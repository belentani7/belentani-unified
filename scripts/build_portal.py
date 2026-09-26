#!/usr/bin/env python3
"""Belentani Unified — portal build script.

Scans content/html-source/ for unique HTMLs, applies the privacy
exclusion list (scripts/exclusions.txt), and generates:
  - dist/search-index.json   (pre-compiled index for the portal search)
  - dist/collections.json    (collections derived from source paths)
  - dist/sitemap.xml         (generated for the public portal)
  - dist/manifest.json       (copy of the build manifest)

Idempotent: safe to re-run at any time. Stdlib only.
"""

from __future__ import annotations

import argparse
import fnmatch
import hashlib
import json
import shutil
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = REPO_ROOT / "content" / "html-source"
DIST_DIR = REPO_ROOT / "dist"
EXCLUSIONS_FILE = REPO_ROOT / "scripts" / "exclusions.txt"
EXCLUSIONS_GENERATED = REPO_ROOT / "scripts" / "exclusions.generated.txt"

TITLE_SUFFIX = " · Belentani"


def load_exclusions() -> list[str]:
    patterns: list[str] = []
    for f in (EXCLUSIONS_FILE, EXCLUSIONS_GENERATED):
        if not f.exists():
            continue
        for raw in f.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if line and not line.startswith("#"):
                patterns.append(line)
    return patterns


def is_excluded(rel_path: str, patterns: list[str]) -> bool:
    normalized = rel_path.replace("\\", "/")
    return any(fnmatch.fnmatch(normalized, pat) for pat in patterns)


def derive_collection(rel_path: str) -> str:
    """Derive a collection name from the first path segment (or 'raiz')."""
    parts = Path(rel_path).parts
    return parts[0] if len(parts) > 1 else "raiz"


def build(copy_pages: bool = False, max_mb: float = 0) -> int:
    if not CONTENT_DIR.exists():
        print(f"[build] Missing content dir: {CONTENT_DIR}")
        print("[build] Nothing to index yet — creating empty dist/ skeleton.")
        DIST_DIR.mkdir(parents=True, exist_ok=True)
        (DIST_DIR / "search-index.json").write_text(
            json.dumps({"generated": now_iso(), "count": 0, "pages": []}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return 0

    exclusions = load_exclusions()
    pages: list[dict] = []
    excluded: list[str] = []
    collections: dict[str, list[str]] = defaultdict(list)
    seen_hashes: set[str] = set()

    for html_path in sorted(CONTENT_DIR.rglob("*.html")):
        rel_path = html_path.relative_to(CONTENT_DIR).as_posix()
        content_bytes = html_path.read_bytes()
        sha = hashlib.sha256(content_bytes).hexdigest()

        # Size gate: files above max_mb stay local-only (hosting limits).
        if max_mb and len(content_bytes) > max_mb * 1_000_000:
            excluded.append(rel_path)
            continue
        if sha in seen_hashes:
            continue  # dedupe safety net (should already be deduped)
        seen_hashes.add(sha)

        if is_excluded(rel_path, exclusions):
            excluded.append(rel_path)
            continue

        title = extract_title(content_bytes) or html_path.stem.replace("-", " ").replace("_", " ")
        pages.append({"path": rel_path, "title": title + TITLE_SUFFIX, "sha256": sha[:12]})
        collections[derive_collection(rel_path)].append(rel_path)

    DIST_DIR.mkdir(parents=True, exist_ok=True)

    search_index = {"generated": now_iso(), "count": len(pages), "pages": pages}
    (DIST_DIR / "search-index.json").write_text(
        json.dumps(search_index, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    collections_data = {
        "generated": now_iso(),
        "collections": [
            {"name": name, "count": len(files), "pages": files}
            for name, files in sorted(collections.items())
        ],
    }
    (DIST_DIR / "collections.json").write_text(
        json.dumps(collections_data, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    write_sitemap([p["path"] for p in pages])

    if copy_pages:
        copied = 0
        dest_root = DIST_DIR / "html-source"
        for p in pages:
            src = CONTENT_DIR / p["path"]
            dst = dest_root / p["path"]
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            copied += 1
        print(f"[build] Pages copied to dist/html-source: {copied}")

    print(f"[build] Pages indexed: {len(pages)}")
    print(f"[build] Pages excluded (privacy): {len(excluded)}")
    print(f"[build] Collections: {len(collections)}")
    print(f"[build] Output: {DIST_DIR}")
    return 0


def extract_title(content: bytes) -> str | None:
    text = content.decode("utf-8", errors="ignore")
    lower = text.lower()
    start = lower.find("<title>")
    end = lower.find("</title>")
    if start == -1 or end == -1 or end <= start:
        return None
    title = text[start + len("<title>") : end].strip()
    return title[:120] or None


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def write_sitemap(paths: list[str]) -> None:
    urls = "\n".join(f"    <url><loc>/{p}</loc></url>" for p in paths)
    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{urls}\n</urlset>\n"
    )
    (DIST_DIR / "sitemap.xml").write_text(sitemap, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the Belentani Unified portal index.")
    parser.add_argument("--copy", action="store_true", help="Copy public pages into dist/html-source (deployable site).")
    parser.add_argument("--max-mb", type=float, default=0, help="Skip files larger than this size in MB (0 = no limit).")
    args = parser.parse_args()
    return build(copy_pages=args.copy, max_mb=args.max_mb)


if __name__ == "__main__":
    sys.exit(main())
