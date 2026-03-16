"""
phishing_detector.py
====================
Core 3-layer phishing detection engine for NullThreat / SentinelMind.

Layers:
  1. TF-IDF + Random Forest ML model (primary signal)
  2. Heuristic feature extraction (urgency, link tricks, domain tricks)
  3. Structural / header analysis (SPF, DKIM, Reply-To, etc.)

Usage:
  from backend.modules.phishing_detector import predict_phishing
  result = predict_phishing(email_body="...", headers="...", subject="...")
"""

import re
import os
import joblib
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Model paths
# ---------------------------------------------------------------------------
_BASE_DIR = Path(__file__).resolve().parent.parent          # backend/
_MODELS_DIR = _BASE_DIR / "models"
_VECTORIZER_PATH = _MODELS_DIR / "phishing_tfidf.pkl"
_MODEL_PATH = _MODELS_DIR / "phishing_rf.pkl"

# Module-level lazy-loaded singletons
_vectorizer = None
_model = None


# ---------------------------------------------------------------------------
# Urgency phrase list (Layer 2)
# ---------------------------------------------------------------------------
URGENCY_PHRASES = [
    "act now", "verify immediately", "account suspended", "click here",
    "confirm your", "limited time", "your account", "unusual activity",
    "security alert", "update required", "verify your", "action required",
    "account will be", "access will be", "immediately", "urgent",
    "within 24 hours", "within 48 hours", "as soon as possible",
    "failure to", "will result in", "suspended account",
]

# Suspicious TLDs (Layer 2)
SUSPICIOUS_TLDS = [
    ".xyz", ".tk", ".ml", ".ga", ".cf", ".gq", ".pw", ".top",
    ".click", ".link", ".work", ".party", ".download", ".loan",
]


# ---------------------------------------------------------------------------
# Helper: load models lazily
# ---------------------------------------------------------------------------
def _load_models() -> None:
    """Load the trained TF-IDF vectorizer and Random Forest model from disk.

    Raises RuntimeError if the .pkl files do not exist (training hasn't been run).
    """
    global _vectorizer, _model

    if _vectorizer is not None and _model is not None:
        return  # Already loaded

    if not _VECTORIZER_PATH.exists() or not _MODEL_PATH.exists():
        raise RuntimeError(
            "Trained model files not found. "
            "Run  python train_phishing.py  first to train the model.\n"
            f"  Expected vectorizer : {_VECTORIZER_PATH}\n"
            f"  Expected model      : {_MODEL_PATH}"
        )

    _vectorizer = joblib.load(_VECTORIZER_PATH)
    _model = joblib.load(_MODEL_PATH)


# ---------------------------------------------------------------------------
# LAYER 1 helpers: preprocessing
# ---------------------------------------------------------------------------
def preprocess(text: str) -> str:
    """Clean raw email text for TF-IDF vectorisation.

    Steps:
      - Lowercase
      - Strip HTML tags
      - Replace URLs with token 'URL'
      - Replace email addresses with token 'EMAIL'
      - Collapse whitespace
    """
    text = text.lower()
    text = re.sub(r"<[^>]+>", " ", text)                    # remove HTML tags
    text = re.sub(r"http\S+|www\S+", "URL", text)           # replace URLs
    text = re.sub(r"\S+@\S+", "EMAIL", text)                 # replace emails
    text = re.sub(r"\s+", " ", text).strip()                 # collapse whitespace
    return text


def _ml_score(text: str) -> float:
    """Run the TF-IDF + Random Forest model on preprocessed text.

    Returns the phishing probability (0.0 – 1.0).
    """
    _load_models()
    cleaned = preprocess(text)
    vec = _vectorizer.transform([cleaned])
    proba = _model.predict_proba(vec)
    return float(proba[0][1])


# ---------------------------------------------------------------------------
# LAYER 2: Heuristic feature extraction
# ---------------------------------------------------------------------------
def extract_heuristic_features(email_text: str, subject: str = "") -> tuple[dict, float]:
    """Extract 9 hand-engineered heuristic features from the email.

    Returns:
        (features_dict, heuristic_score)
        heuristic_score is a float in [0.0, 1.0].
    """
    combined_lower = (email_text + " " + subject).lower()

    # --- Feature 1: urgency_count ---
    urgency_count = sum(1 for phrase in URGENCY_PHRASES if phrase in combined_lower)

    # --- Feature 2: link_mismatch ---
    hrefs = re.findall(r'href=["\']([^"\']+)["\']', email_text)
    display_texts = re.findall(r">([^<]+)</a>", email_text)
    link_mismatch = 0
    for href, display in zip(hrefs, display_texts):
        d = display.strip()
        if d.startswith("http") and d not in href:
            link_mismatch += 1

    # --- Feature 3: at_in_url ---
    at_in_url = int(bool(re.search(r"https?://[^@\s]*@", email_text)))

    # --- Feature 4: ip_as_domain ---
    ip_as_domain = int(
        bool(re.search(r"https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", email_text))
    )

    # --- Feature 5: suspicious_tld ---
    suspicious_tld = int(any(tld in combined_lower for tld in SUSPICIOUS_TLDS))

    # --- Feature 6: external_link_count (evidence only, not part of score) ---
    external_link_count = sum(1 for href in hrefs if href.startswith("http"))

    # --- Feature 7: html_form_present ---
    html_form_present = int("<form" in email_text.lower())

    # --- Feature 8: unicode_spoofing ---
    unicode_spoofing = int(bool(re.search(r"[\u0400-\u04FF]", email_text)))

    # --- Feature 9: excessive_punctuation ---
    punct_count = (email_text + " " + subject).count("!") + (email_text + " " + subject).count("?")
    excessive_punctuation = int(punct_count > 5)

    features = {
        "urgency_count": urgency_count,
        "link_mismatch": link_mismatch,
        "at_in_url": at_in_url,
        "ip_as_domain": ip_as_domain,
        "suspicious_tld": suspicious_tld,
        "external_link_count": external_link_count,
        "html_form_present": html_form_present,
        "unicode_spoofing": unicode_spoofing,
        "excessive_punctuation": excessive_punctuation,
    }

    # Heuristic score computation
    score = 0.0
    score += min(urgency_count * 0.12, 0.36)    # capped at 0.36
    score += link_mismatch * 0.20
    score += at_in_url * 0.35
    score += ip_as_domain * 0.45
    score += suspicious_tld * 0.28
    score += html_form_present * 0.30
    score += unicode_spoofing * 0.42
    score += excessive_punctuation * 0.10
    heuristic_score = min(1.0, score)

    return features, heuristic_score


# ---------------------------------------------------------------------------
# LAYER 3: Structural / Header analysis
# ---------------------------------------------------------------------------
def extract_structural_features(headers: str = "", email_text: str = "") -> tuple[dict, float]:
    """Parse raw email headers for authentication failures and structural red flags.

    No DNS or network calls are made — pure string/regex analysis.

    Returns:
        (features_dict, structural_score)
        structural_score is a float in [0.0, 1.0].
    """
    headers_lower = headers.lower()

    # --- Feature 1: spf_fail ---
    spf_fail = int("spf=fail" in headers_lower or "spf=softfail" in headers_lower)

    # --- Feature 2: dkim_missing ---
    if headers:
        dkim_missing = int("dkim=pass" not in headers_lower)
    else:
        dkim_missing = 0

    # --- Feature 3: reply_to_mismatch ---
    from_match = re.search(r"From:.*?@([\w.-]+)", headers, re.IGNORECASE)
    reply_match = re.search(r"Reply-To:.*?@([\w.-]+)", headers, re.IGNORECASE)
    if from_match and reply_match and from_match.group(1) != reply_match.group(1):
        reply_to_mismatch = 1
    else:
        reply_to_mismatch = 0

    # --- Feature 4: base64_attachment ---
    base64_attachment = int(
        "content-transfer-encoding: base64" in headers_lower
        and "content-disposition: attachment" in headers_lower
    )

    # --- Feature 5: no_plain_text ---
    html_tag_count = email_text.count("<")
    has_plain_paragraph = bool(re.search(r"[^<>]{20,}", email_text))
    no_plain_text = int(html_tag_count > 30 and not has_plain_paragraph)

    features = {
        "spf_fail": spf_fail,
        "dkim_missing": dkim_missing,
        "reply_to_mismatch": reply_to_mismatch,
        "base64_attachment": base64_attachment,
        "no_plain_text": no_plain_text,
    }

    # Structural score
    score = 0.0
    score += spf_fail * 0.40
    score += dkim_missing * 0.25
    score += reply_to_mismatch * 0.35
    score += base64_attachment * 0.20
    score += no_plain_text * 0.15
    structural_score = min(1.0, score)

    return features, structural_score


# ---------------------------------------------------------------------------
# MAIN PREDICTION FUNCTION
# ---------------------------------------------------------------------------
def predict_phishing(
    email_body: str,
    headers: str = "",
    subject: str = "",
) -> dict:
    """Run the full 3-layer phishing detection pipeline on an email.

    Args:
        email_body: Raw body text of the email (plain text or HTML).
        headers:    Raw email headers string (optional).
        subject:    Email subject line (optional).

    Returns:
        A dict with keys: score, label, confidence, evidence, layer_scores,
        chain_bonus_applied.
    """
    # --- Edge case: empty or very short input ---
    if not email_body or len(email_body.strip()) < 20:
        return {
            "score": 0,
            "label": "LEGITIMATE",
            "confidence": "0%",
            "evidence": ["Input text is empty — no analysis possible."],
            "layer_scores": {
                "ml_model": 0.0,
                "heuristic": 0.0,
                "structural": 0.0,
            },
            "chain_bonus_applied": False,
        }

    # -----------------------------------------------------------------------
    # Step 1: Run all three layers
    # -----------------------------------------------------------------------
    l1 = _ml_score(email_body)
    heuristic_features, l2 = extract_heuristic_features(email_body, subject)
    structural_features, l3 = extract_structural_features(headers, email_body)

    # -----------------------------------------------------------------------
    # Step 2: Weighted base score
    # -----------------------------------------------------------------------
    base = (0.50 * l1) + (0.30 * l2) + (0.20 * l3)

    # -----------------------------------------------------------------------
    # Step 3: Chain bonus
    # -----------------------------------------------------------------------
    chain_bonus = bool(l2 > 0.65 and l3 > 0.45)
    if chain_bonus:
        final = min(1.0, base * 1.20)
    else:
        final = base

    # -----------------------------------------------------------------------
    # Step 4: Convert to 0–100
    # -----------------------------------------------------------------------
    score = round(final * 100)

    # -----------------------------------------------------------------------
    # Step 5: Label
    # -----------------------------------------------------------------------
    if score >= 55:
        label = "PHISHING"
    elif score >= 35:
        label = "SUSPICIOUS"
    else:
        label = "LEGITIMATE"

    # -----------------------------------------------------------------------
    # Step 6: Build evidence list
    # -----------------------------------------------------------------------
    evidence: list[str] = []

    if l1 > 0.65:
        evidence.append(
            f"ML model flagged this email with {l1:.0%} confidence based on "
            "word and phrase patterns learned from 82,000 phishing examples."
        )

    if heuristic_features["urgency_count"] > 0:
        evidence.append(
            f"Urgency language detected ({heuristic_features['urgency_count']} phrases) "
            "— pressure tactics designed to make you act without thinking."
        )

    if heuristic_features["link_mismatch"] > 0:
        evidence.append(
            f"Link deception found — the visible link text shows one website but the "
            f"actual destination is different. ({heuristic_features['link_mismatch']} instance(s))"
        )

    if heuristic_features["at_in_url"]:
        evidence.append(
            "@ symbol found inside a URL — everything before the @ is ignored by your browser. "
            "This is used to make 'paypal.com@evil.ru' look like PayPal."
        )

    if heuristic_features["ip_as_domain"]:
        evidence.append(
            "A raw IP address is used as the link destination instead of a domain name. "
            "Legitimate companies never send links to IP addresses."
        )

    if structural_features.get("reply_to_mismatch"):
        evidence.append(
            "Reply-To address differs from the sender — if you reply, your message goes "
            "to the attacker's inbox, not the company you think you're writing to."
        )

    if structural_features["spf_fail"]:
        evidence.append(
            "SPF authentication failed — this email was NOT sent from the company's real "
            "mail servers. The sender address has been forged."
        )

    if structural_features["dkim_missing"]:
        evidence.append(
            "DKIM digital signature is absent. Every legitimate email from major companies "
            "carries a cryptographic signature. Its absence means this email's authenticity "
            "cannot be verified."
        )

    if heuristic_features["suspicious_tld"]:
        evidence.append(
            "The email contains a link to a suspicious top-level domain "
            "(.xyz, .tk, .ml, etc.) — these free or near-free domains are heavily used "
            "for throwaway phishing sites."
        )

    if heuristic_features["unicode_spoofing"]:
        evidence.append(
            "Cyrillic or non-Latin characters detected in what appears to be an English "
            "domain — visual spoofing where characters like Cyrillic 'а' are substituted "
            "for Latin 'a' to impersonate trusted domains."
        )

    if heuristic_features["html_form_present"]:
        evidence.append(
            "This email contains an HTML form. No legitimate company collects passwords "
            "or card numbers inside an email. This is designed to steal your credentials "
            "without you leaving your inbox."
        )

    if chain_bonus:
        evidence.append(
            "Multiple detection layers corroborate each other — heuristic AND structural "
            "signals both fired simultaneously. Score boosted due to multi-layer confirmation."
        )

    if not evidence:
        evidence.append("No significant phishing signals detected in this email.")

    # -----------------------------------------------------------------------
    # Step 7: Return result dict
    # -----------------------------------------------------------------------
    return {
        "score": score,
        "label": label,
        "confidence": f"{score}%",
        "evidence": evidence,
        "layer_scores": {
            "ml_model": round(l1, 4),
            "heuristic": round(l2, 4),
            "structural": round(l3, 4),
        },
        "chain_bonus_applied": chain_bonus,
    }
