# AI API Service — SentinelMind

> **NullThreat Hackathon — Cybersecurity AI Platform**
> Module 1: Phishing Email Detection (3-Layer Engine)

---

## Architecture Overview

```
apps/ai-api/
├── backend/
│   ├── __init__.py
│   ├── main.py                  ← FastAPI server (uvicorn entry-point)
│   ├── cli.py                   ← Interactive command-line interface
│   ├── train_phishing.py        ← One-time training script
│   ├── data/
│   │   └── phishing_emails.csv  ← Dataset (see below for download)
│   ├── models/
│   │   ├── phishing_tfidf.pkl   ← Saved after training
│   │   └── phishing_rf.pkl      ← Saved after training
│   └── modules/
│       ├── __init__.py
│       └── phishing_detector.py ← Core 3-layer detection logic
├── tests/
│   ├── __init__.py
│   └── test_phishing.py         ← Pytest test suite
└── requirements.txt
```

### Detection Layers

| Layer | Technique | Weight |
|-------|-----------|--------|
| 1 — ML Model | TF-IDF (15k features, bigrams) + Random Forest (300 trees) | 50% |
| 2 — Heuristic | 9 hand-engineered features (urgency, link tricks, domain tricks) | 30% |
| 3 — Structural | Header auth checks (SPF, DKIM, Reply-To mismatch, etc.) | 20% |

A **chain bonus** (+20% score boost) is applied when both the heuristic **and** structural layers fire simultaneously, indicating multi-layer corroboration.

---

## How to Get the Dataset

The training dataset is **Kaggle's Phishing Email Dataset** (~82,000 rows):

1. Go to: https://www.kaggle.com/datasets/naserabdullahalam/phishing-email-dataset
2. Download `phishing_emails.csv`
3. Place it at:
   ```
   apps/ai-api/backend/data/phishing_emails.csv
   ```
   The CSV must have exactly two columns: `text` (email body) and `label` (0=legitimate, 1=phishing).

> **Alternative dataset** (also works):
> https://www.kaggle.com/datasets/subhajournal/phishingemails
> After download, rename your label column to `label` and body column to `text`.

---

## Running Module 1 — Phishing Detection

### Step 0: Prerequisites

- Python 3.11+
- pip

### Step 1: Create and activate a virtual environment

```powershell
# From apps/ai-api directory
python -m venv .venv
.venv\Scripts\Activate.ps1      # Windows PowerShell
# OR
source .venv/bin/activate       # macOS / Linux
```

### Step 2: Install dependencies

```powershell
pip install -r requirements.txt
```

### Step 3: Prepare the dataset

Make sure `backend/data/phishing_emails.csv` exists.
See **"How to Get the Dataset"** above.

### Step 4: Train the model (run once — takes 3–5 minutes)

```powershell
# From apps/ai-api directory
python backend/train_phishing.py
```

You will see progress output like:
```
Loading dataset...
  Loaded 82,000 rows.
Preprocessing text... (this takes ~1 minute)
Training TF-IDF vectorizer...
Training Random Forest (300 trees)... (this takes 2-3 minutes)
Evaluating on test set...
              precision    recall  f1-score ...
Saving models...
Done! Models saved to backend/models/
Training complete. Models saved.
```

Two files will be created:
- `backend/models/phishing_tfidf.pkl`
- `backend/models/phishing_rf.pkl`

### Step 5: Start the API server

```powershell
# From apps/ai-api directory
uvicorn backend.main:app --reload --port 8000
```

Interactive API docs are available at: http://localhost:8000/docs

### Step 6: Use the CLI (recommended for quick testing)

```powershell
# From apps/ai-api directory
python backend/cli.py
```

You will be prompted to paste a subject, headers (optional), and email body.
Type `---` on a new line to finish each input section.  
The tool prints a colour-coded risk score, layer breakdown, and evidence.

### Step 7: Test with the API (curl)

```powershell
curl -X POST http://localhost:8000/analyze/phishing `
  -H "Content-Type: application/json" `
  -d '{
    "email_body": "URGENT: Click here to verify your account immediately!",
    "subject": "Account Suspended"
  }'
```

**Example response:**
```json
{
  "score": 82,
  "label": "PHISHING",
  "confidence": "82%",
  "evidence": [
    "ML model flagged this email with 91% confidence ...",
    "Urgency language detected (3 phrases) ...",
    "..."
  ],
  "layer_scores": {
    "ml_model": 0.91,
    "heuristic": 0.72,
    "structural": 0.0
  },
  "chain_bonus_applied": false
}
```

### Step 8: Run the test suite

```powershell
# From apps/ai-api directory
pytest tests/test_phishing.py -v
```

---

## API Reference

### `POST /analyze/phishing`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email_body` | string | ✅ | Raw email body (plain text or HTML) |
| `headers` | string | ❌ | Raw email headers string |
| `subject` | string | ❌ | Email subject line |

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `score` | int | Risk score 0–100 |
| `label` | string | `PHISHING`, `SUSPICIOUS`, or `LEGITIMATE` |
| `confidence` | string | e.g. `"82%"` |
| `evidence` | list[str] | Plain-English explanations of triggered signals |
| `layer_scores.ml_model` | float | ML layer probability (0.0–1.0) |
| `layer_scores.heuristic` | float | Heuristic layer score (0.0–1.0) |
| `layer_scores.structural` | float | Structural layer score (0.0–1.0) |
| `chain_bonus_applied` | bool | Whether the 20% multi-layer boost fired |

### `GET /health`

Returns `{"status": "ok", "module": "phishing_detector"}`.

---

## Score Thresholds

| Score | Label | Meaning |
|-------|-------|---------|
| 0–34 | `LEGITIMATE` | Low-risk, no significant signals |
| 35–54 | `SUSPICIOUS` | Some signals present, treat with caution |
| 55–100 | `PHISHING` | Multiple phishing indicators confirmed |

---

## What You Will Need

- **Python 3.11+** — the ML pipeline uses modern type hints (`list[str]` etc.)
- **~4 GB RAM** — Random Forest with 300 trees on 82k samples needs headroom
- **~5 minutes** — one-time training (never needs to re-run unless data changes)
- **The Kaggle dataset** — see "How to Get the Dataset" above
- A **PowerShell** or **bash** terminal

> The trained `.pkl` files are only ~150–300 MB combined. Once created, all predictions are instantaneous (< 50ms per email).

---

## Notes for Future Modules

This service is architected to be **modular**. Each new detection module should:
1. Live in `backend/modules/<module_name>.py`
2. Expose a top-level `predict_<module>(...)` function returning a standardised dict
3. Register its own FastAPI endpoint in `backend/main.py`
4. Have its own training script in `backend/`
5. Save its models to `backend/models/`

> Graph-analysis features (Neo4j), URL scanning, and other modules are intentionally kept in separate directories and will be connected in later phases.