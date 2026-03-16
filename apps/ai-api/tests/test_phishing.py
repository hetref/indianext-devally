"""
test_phishing.py
================
Pytest test suite for the NullThreat phishing detection module.

Run with:
    pytest tests/test_phishing.py -v
"""

import pytest
from backend.modules.phishing_detector import predict_phishing


# ---------------------------------------------------------------------------
# Sample emails
# ---------------------------------------------------------------------------
OBVIOUS_PHISHING = """
URGENT: Your PayPal account has been suspended! 
Click here immediately to verify your account or it will be permanently deleted.
http://192.168.1.1@paypa1.xyz/login/verify
Act now - you have 24 hours before access is terminated.
"""

LEGITIMATE_EMAIL = """
Hi Sarah,
Just wanted to follow up on our meeting from last Tuesday. 
I've attached the project timeline we discussed.
Let me know if you have any questions.
Best regards, Michael
"""


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------
def test_obvious_phishing_scores_high():
    """An email with multiple phishing signals must score >= 70."""
    result = predict_phishing(OBVIOUS_PHISHING, subject="URGENT: Account Suspended!")
    assert result["score"] >= 70, f"Expected score >= 70, got {result['score']}"
    assert result["label"] == "PHISHING"
    assert len(result["evidence"]) >= 3


def test_legitimate_email_scores_low():
    """A normal conversational email should score <= 40."""
    result = predict_phishing(LEGITIMATE_EMAIL)
    assert result["score"] <= 40, f"Expected score <= 40, got {result['score']}"
    assert result["label"] in ["LEGITIMATE", "SUSPICIOUS"]


def test_result_structure():
    """The result dict must contain all required keys with correct types."""
    result = predict_phishing("Hello world, this is a test email message.")
    assert "score" in result
    assert "label" in result
    assert "confidence" in result
    assert "evidence" in result
    assert "layer_scores" in result
    assert isinstance(result["evidence"], list)
    assert 0 <= result["score"] <= 100


def test_ip_in_url_detected():
    """A URL with a raw IP address should trigger the heuristic layer."""
    result = predict_phishing("Please visit http://192.168.1.1/login to verify")
    assert result["layer_scores"]["heuristic"] > 0.3, (
        f"Expected heuristic > 0.3, got {result['layer_scores']['heuristic']}"
    )


def test_at_in_url_detected():
    """A URL containing @ should trigger the heuristic layer."""
    result = predict_phishing("Click here: http://paypal.com@evil.ru/steal")
    assert result["layer_scores"]["heuristic"] > 0.3, (
        f"Expected heuristic > 0.3, got {result['layer_scores']['heuristic']}"
    )


def test_empty_input_returns_safe():
    """Empty or very short input must return score=0 and LEGITIMATE label."""
    result = predict_phishing("")
    assert result["score"] == 0
    assert result["label"] == "LEGITIMATE"
    assert "empty" in result["evidence"][0].lower()


def test_spf_fail_in_headers():
    """SPF fail in headers should raise the structural score."""
    headers = "Received-SPF: fail\nauthentication-results: spf=fail\n"
    result = predict_phishing("Hello, please check your account.", headers=headers)
    assert result["layer_scores"]["structural"] > 0.0


def test_suspicious_tld_detected():
    """Suspicious TLDs must trigger the heuristic layer."""
    result = predict_phishing("Please visit http://mybank.tk to update details now")
    assert result["layer_scores"]["heuristic"] > 0.0


def test_label_values_are_valid():
    """Label must only ever be PHISHING, SUSPICIOUS, or LEGITIMATE."""
    valid_labels = {"PHISHING", "SUSPICIOUS", "LEGITIMATE"}
    for body in [OBVIOUS_PHISHING, LEGITIMATE_EMAIL, "Test email body here for testing"]:
        result = predict_phishing(body)
        assert result["label"] in valid_labels, f"Unexpected label: {result['label']}"


def test_confidence_format():
    """Confidence must be a string ending with '%'."""
    result = predict_phishing("Test email body here for testing purposes only")
    assert isinstance(result["confidence"], str)
    assert result["confidence"].endswith("%")
