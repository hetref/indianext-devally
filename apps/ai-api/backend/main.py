"""
main.py
=======
FastAPI application entry-point for the SentinelMind AI API.

Endpoints:
  POST /analyze/phishing  — Run phishing detection on an email
  GET  /health            — Health check

Run with:
    uvicorn backend.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.modules.phishing_detector import predict_phishing

app = FastAPI(
    title="SentinelMind API",
    description="NullThreat Hackathon — Cybersecurity AI Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------
class EmailAnalysisRequest(BaseModel):
    """Input payload for phishing analysis."""

    email_body: str
    headers: str = ""
    subject: str = ""


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.post("/analyze/phishing", summary="Analyse an email for phishing signals")
def analyze_phishing(request: EmailAnalysisRequest) -> dict:
    """Run the 3-layer phishing detection pipeline on the provided email.

    Returns a risk score (0-100), a label, confidence, evidence strings,
    per-layer scores, and whether the chain bonus was applied.
    """
    return predict_phishing(
        email_body=request.email_body,
        headers=request.headers,
        subject=request.subject,
    )


@app.get("/health", summary="Health check")
def health() -> dict:
    """Simple health-check endpoint consumed by load-balancers and monitoring."""
    return {"status": "ok", "module": "phishing_detector"}
