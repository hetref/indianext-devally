"""
train_phishing.py
=================
One-time training script for the TF-IDF + Random Forest phishing detector.

Usage (from the apps/ai-api directory):
    python backend/train_phishing.py

Dataset expected at: backend/data/phishing_emails.csv
  Columns:
    - text   : raw email body string
    - label  : 0 = legitimate, 1 = phishing

Outputs saved to backend/models/:
    - phishing_tfidf.pkl
    - phishing_rf.pkl
"""

import sys
import os
from pathlib import Path

# Ensure backend package is importable when run directly
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

from backend.modules.phishing_detector import preprocess

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent          # backend/
DATA_PATH = BASE_DIR / "data" / "phishing_emails.csv"
MODELS_DIR = BASE_DIR / "models"
VECTORIZER_PATH = MODELS_DIR / "phishing_tfidf.pkl"
MODEL_PATH = MODELS_DIR / "phishing_rf.pkl"


def main() -> None:
    """Run the full training pipeline and save model artefacts."""

    # ------------------------------------------------------------------
    # Load dataset
    # ------------------------------------------------------------------
    print("Loading dataset...")
    if not DATA_PATH.exists():
        print(
            f"\n[ERROR] Dataset not found at: {DATA_PATH}\n"
            "Please place phishing_emails.csv in backend/data/ and re-run.\n"
            "See README.md → 'How to get the dataset' for download instructions."
        )
        sys.exit(1)

    df = pd.read_csv(DATA_PATH)
    print(f"  Loaded {len(df):,} rows. Columns: {list(df.columns)}")

    # Basic validation
    if "text" not in df.columns or "label" not in df.columns:
        print("[ERROR] CSV must contain 'text' and 'label' columns.")
        sys.exit(1)

    df = df.dropna(subset=["text", "label"])
    df["label"] = df["label"].astype(int)
    print(f"  Phishing : {(df['label'] == 1).sum():,}")
    print(f"  Legitimate: {(df['label'] == 0).sum():,}")

    # ------------------------------------------------------------------
    # Preprocessing
    # ------------------------------------------------------------------
    print("\nPreprocessing text... (this takes ~1 minute)")
    df["clean_text"] = df["text"].astype(str).apply(preprocess)
    print("  Preprocessing done.")

    X = df["clean_text"]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=42
    )
    print(f"  Train: {len(X_train):,} | Test: {len(X_test):,}")

    # ------------------------------------------------------------------
    # TF-IDF vectoriser
    # ------------------------------------------------------------------
    print("\nTraining TF-IDF vectorizer...")
    vectorizer = TfidfVectorizer(
        max_features=15000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95,
        sublinear_tf=True,
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    print(f"  Vocabulary size: {len(vectorizer.vocabulary_):,}")

    # ------------------------------------------------------------------
    # Random Forest
    # ------------------------------------------------------------------
    print("\nTraining Random Forest (300 trees)... (this takes 2-3 minutes)")
    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_leaf=1,
        class_weight="balanced",
        n_jobs=-1,
        random_state=42,
    )
    model.fit(X_train_vec, y_train)
    print("  Training complete.")

    # ------------------------------------------------------------------
    # Evaluation
    # ------------------------------------------------------------------
    print("\nEvaluating on test set...")
    y_pred = model.predict(X_test_vec)
    print(classification_report(y_test, y_pred, target_names=["Legitimate", "Phishing"]))

    # Top 20 most important features
    importances = model.feature_importances_
    feature_names = vectorizer.get_feature_names_out()
    top_indices = importances.argsort()[::-1][:20]
    print("Top 20 most important features:")
    for rank, idx in enumerate(top_indices, 1):
        print(f"  {rank:2d}. {feature_names[idx]:<30s}  importance={importances[idx]:.5f}")

    # ------------------------------------------------------------------
    # Save models
    # ------------------------------------------------------------------
    print("\nSaving models...")
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(vectorizer, VECTORIZER_PATH)
    joblib.dump(model, MODEL_PATH)
    print(f"  Vectorizer → {VECTORIZER_PATH}")
    print(f"  Model      → {MODEL_PATH}")
    print("\nDone! Models saved to backend/models/")
    print("Training complete. Models saved.")


if __name__ == "__main__":
    main()
