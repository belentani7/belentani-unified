#!/usr/bin/env python3
"""Privacy scanner — generates exclusions.generated.txt.

Scans content/html-source/ for personal data (real emails, ES phone numbers)
and writes one exclusion entry per affected file. Personal domains listed
below are always treated as private; template/example emails are ignored.

Run before every public build. Idempotent, stdlib only.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = REPO_ROOT / "content" / "html-source"
OUT_FILE = REPO_ROOT / "scripts" / "exclusions.generated.txt"

# Emails that are obviously templates/examples — not personal data.
TEMPLATE_PATTERNS = (
    "tu@email", "you@email", "your.email", "you@frequency", "signal@network",
    "seu@email", "email@system", "email@dominio", "tu@correo", "your@email",
    "example.com", "sentry.io", "wixpress", "schema.org",
)

# Real personal / business addresses that must never go public.
PERSONAL_DOMAINS = (
    "belentani7pedro@", "belentani777pedro@",   # personal gmail addresses
    "duck-beats@", "duck.beats@",               # personal hotmail
    "carqdisantos@", "guilhermerodriguess1989@", # third parties
    "@belentani.com", "@belentani.es",           # business contact inboxes
    "core@noia-core.com",
    "@dragondejade.es", "@arqbcn",               # third-party businesses
)

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?:\+34[\s.-]?)?\s?[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}")


def is_personal_email(addr: str) -> bool:
    low = addr.lower()
    if any(p in low for p in TEMPLATE_PATTERNS):
        return False
    return any(d in low for d in PERSONAL_DOMAINS)


def scan() -> int:
    if not CONTENT_DIR.exists():
        print("[privacy] no content dir — nothing to scan")
        return 0

    flagged: set[str] = set()
    for html in CONTENT_DIR.rglob("*.html"):
        try:
            text = html.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        if any(is_personal_email(m) for m in EMAIL_RE.findall(text)):
            flagged.add(html.relative_to(CONTENT_DIR).as_posix())
            continue
        # A personal phone number standing alone also flags the file.
        if PHONE_RE.search(text) and "+34" in text:
            flagged.add(html.relative_to(CONTENT_DIR).as_posix())

    OUT_FILE.write_text(
        "\n".join(sorted(flagged)) + ("\n" if flagged else ""),
        encoding="utf-8",
    )
    print(f"[privacy] flagged {len(flagged)} files -> {OUT_FILE.name}")
    return 0


if __name__ == "__main__":
    sys.exit(scan())
