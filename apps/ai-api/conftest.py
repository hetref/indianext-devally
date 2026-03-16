"""
conftest.py
===========
Pytest configuration — ensures the apps/ai-api directory is on sys.path
so that `from backend.modules.phishing_detector import ...` resolves correctly
without requiring an editable pip install.
"""

import sys
from pathlib import Path

# Insert the apps/ai-api directory into sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))
