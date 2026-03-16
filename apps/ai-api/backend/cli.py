"""
cli.py
======
Interactive command-line interface for the SentinelMind Phishing Detector.

Run with:
    python backend/cli.py

You will be prompted to paste an email subject, headers (optional),
and body, then the analysis result is printed in a readable format.
"""

import sys
import textwrap
from pathlib import Path

# Allow running this script directly from the repo root
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.modules.phishing_detector import predict_phishing

# ---------------------------------------------------------------------------
# ANSI colour helpers (graceful degradation on Windows without colour support)
# ---------------------------------------------------------------------------
try:
    import colorama
    colorama.init(autoreset=True)
    RED    = "\033[91m"
    YELLOW = "\033[93m"
    GREEN  = "\033[92m"
    CYAN   = "\033[96m"
    BOLD   = "\033[1m"
    RESET  = "\033[0m"
except ImportError:
    RED = YELLOW = GREEN = CYAN = BOLD = RESET = ""


def _colour_label(label: str) -> str:
    """Return the label string wrapped in ANSI colour codes."""
    if label == "PHISHING":
        return f"{RED}{BOLD}{label}{RESET}"
    elif label == "SUSPICIOUS":
        return f"{YELLOW}{BOLD}{label}{RESET}"
    return f"{GREEN}{BOLD}{label}{RESET}"


def _risk_bar(score: int, width: int = 40) -> str:
    """Render a simple ASCII progress bar for the risk score."""
    filled = round(score / 100 * width)
    bar = "█" * filled + "░" * (width - filled)
    colour = RED if score >= 55 else (YELLOW if score >= 35 else GREEN)
    return f"{colour}[{bar}]{RESET} {score}/100"


def _read_multiline(prompt: str) -> str:
    """Read multi-line input until the user enters a line with just '---'."""
    print(prompt)
    print("  (Paste your text, then press Enter and type  ---  on a new line to finish)\n")
    lines = []
    while True:
        try:
            line = input()
        except EOFError:
            break
        if line.strip() == "---":
            break
        lines.append(line)
    return "\n".join(lines)


def _print_result(result: dict) -> None:
    """Pretty-print the analysis result dict to stdout."""
    print("\n" + "=" * 60)
    print(f"  {CYAN}{BOLD}SentinelMind — Phishing Analysis Result{RESET}")
    print("=" * 60)

    print(f"\n  Risk Score  : {_risk_bar(result['score'])}")
    print(f"  Label       : {_colour_label(result['label'])}")
    print(f"  Confidence  : {BOLD}{result['confidence']}{RESET}")

    ls = result["layer_scores"]
    print(f"\n  Layer Scores:")
    print(f"    ML Model   (weight 50%) : {ls['ml_model']:.4f}")
    print(f"    Heuristic  (weight 30%) : {ls['heuristic']:.4f}")
    print(f"    Structural (weight 20%) : {ls['structural']:.4f}")
    print(f"  Chain Bonus Applied : {result['chain_bonus_applied']}")

    print(f"\n  Evidence ({len(result['evidence'])} signal(s)):")
    for i, e in enumerate(result["evidence"], 1):
        wrapped = textwrap.fill(e, width=54, subsequent_indent="       ")
        print(f"    {i}. {wrapped}")

    print("\n" + "=" * 60 + "\n")


def main() -> None:
    """Entry-point for the interactive CLI."""
    print(f"\n{CYAN}{BOLD}{'='*60}")
    print("  SentinelMind — Phishing Email Detector CLI")
    print(f"{'='*60}{RESET}")
    print("  Powered by TF-IDF + Random Forest + Heuristics + Headers\n")

    while True:
        # Subject
        subject = input("Email Subject (press Enter to skip): ").strip()

        # Headers
        headers = _read_multiline(
            "\nEmail Headers (optional — paste raw headers):"
        )

        # Body
        body = _read_multiline("\nEmail Body (required):")

        if not body.strip():
            print(f"\n{YELLOW}[Warning] Empty email body — skipping analysis.{RESET}\n")
        else:
            print(f"\n{CYAN}Analysing...{RESET}")
            try:
                result = predict_phishing(
                    email_body=body,
                    headers=headers,
                    subject=subject,
                )
                _print_result(result)
            except RuntimeError as exc:
                print(f"\n{RED}[ERROR] {exc}{RESET}\n")

        again = input("Analyse another email? [y/N]: ").strip().lower()
        if again != "y":
            print(f"\n{CYAN}Goodbye! Stay safe online.{RESET}\n")
            break


if __name__ == "__main__":
    main()
