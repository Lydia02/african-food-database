#!/usr/bin/env python3
"""
Download one image per food item using Openverse (Creative Commons).

- Excludes ALL Wikipedia / Wikimedia sources
- Saves images to migrations/images/<id>_<slug>.<ext>
- Writes migrations/downloads.csv with URL + license metadata
- Resumable: skips foods already in downloads.csv

USAGE
  pip install requests
  python migrations/download_food_images.py migrations/foods.csv

OUTPUT
  migrations/images/   -- downloaded image files
  migrations/downloads.csv -- metadata + file paths for upload step
"""

from __future__ import annotations

import csv
import os
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

OPENVERSE_API   = "https://api.openverse.org/v1/images/"
USER_AGENT      = "PantryPalFoodImages/1.0"
TIMEOUT         = 30
MAX_RETRIES     = 6
BASE_BACKOFF    = 1.5
PAGE_SIZE       = 20
MAX_PAGES       = 5   # pages to try per query variant

EXCLUDED_HOST_SNIPPETS = (
    "wikipedia.org",
    "wikimedia.org",
    "upload.wikimedia.org",
    "commons.wikimedia.org",
)
EXCLUDED_SOURCES = {"wikimedia", "wikipedia"}


# ---------------------------------------------------------------------------
# Data types
# ---------------------------------------------------------------------------

@dataclass
class FoodItem:
    food_id: str
    name: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(text: str) -> str:
    t = text.lower().strip()
    t = re.sub(r"['']", "", t)
    t = re.sub(r"[^a-z0-9]+", "_", t)
    t = re.sub(r"_+", "_", t).strip("_")
    return (t[:80] or "item")


def normalize_queries(name: str) -> List[str]:
    """Generate multiple search variants to maximise hit rate."""
    base = name.strip()
    # strip parenthetical qualifiers like "(Nigerian)" or "(Steamed)"
    no_parens = re.sub(r"\s*\([^)]*\)\s*", " ", base).strip()
    no_parens = re.sub(r"\s+", " ", no_parens)

    candidates: List[str] = []
    if no_parens and no_parens.lower() != base.lower():
        candidates.append(no_parens)
    candidates.append(base)
    if no_parens:
        candidates.append(f"{no_parens} food")
        candidates.append(f"{no_parens} dish African")

    # deduplicate, preserve order
    out: List[str] = []
    seen: set = set()
    for q in candidates:
        q2 = q.strip()
        if q2 and q2.lower() not in seen:
            out.append(q2)
            seen.add(q2.lower())
    return out


def request_with_retries(method: str, url: str, **kwargs) -> requests.Response:
    last_exc: Optional[Exception] = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.request(method, url, timeout=TIMEOUT, **kwargs)
            if resp.status_code in (429, 500, 502, 503, 504):
                retry_after = resp.headers.get("Retry-After")
                backoff = BASE_BACKOFF * (2 ** (attempt - 1))
                if retry_after and retry_after.isdigit():
                    backoff = max(backoff, float(retry_after))
                time.sleep(min(backoff, 60))
                continue
            resp.raise_for_status()
            return resp
        except Exception as e:
            last_exc = e
            time.sleep(min(BASE_BACKOFF * (2 ** (attempt - 1)), 60))
    raise RuntimeError(f"Failed after {MAX_RETRIES} retries: {url}") from last_exc


def is_excluded(r: Dict) -> bool:
    source = (r.get("source") or "").strip().lower()
    if source in EXCLUDED_SOURCES:
        return True
    for key in ("url", "thumbnail", "foreign_landing_url", "creator_url"):
        val = (r.get(key) or "").lower()
        if any(h in val for h in EXCLUDED_HOST_SNIPPETS):
            return True
    return False


def score_result(r: Dict, query: str) -> float:
    title  = (r.get("title") or "").lower()
    tokens = [t for t in re.split(r"[^a-z0-9]+", query.lower()) if t]
    hits   = sum(1 for t in tokens if t in title)
    w = r.get("width") or 0
    h = r.get("height") or 0
    mp = (w * h) / 1_000_000 if (isinstance(w, int) and isinstance(h, int)) else 0.0
    return hits * 10.0 + mp * 0.75


def openverse_search(query: str, page: int) -> Dict:
    params = {"q": query, "page": page, "page_size": PAGE_SIZE}
    headers = {"User-Agent": USER_AGENT}
    resp = request_with_retries("GET", OPENVERSE_API, params=params, headers=headers)
    return resp.json()


def pick_best(results: List[Dict], query: str) -> Optional[Dict]:
    candidates = [r for r in results if r.get("url") and not is_excluded(r)]
    if not candidates:
        return None
    candidates.sort(key=lambda r: score_result(r, query), reverse=True)
    return candidates[0]


def find_image(food: FoodItem) -> Optional[Dict]:
    for q in normalize_queries(food.name):
        for page in range(1, MAX_PAGES + 1):
            try:
                data    = openverse_search(q, page)
                results = data.get("results") or []
                best    = pick_best(results, q)
                if best:
                    best["_matched_query"] = q
                    return best
            except Exception as e:
                print(f"  ⚠ search error ({q} p{page}): {e}", file=sys.stderr)
    return None


def guess_ext(resp: requests.Response) -> str:
    ct = (resp.headers.get("Content-Type") or "").lower()
    if "jpeg" in ct or "jpg" in ct: return "jpg"
    if "png"  in ct:                return "png"
    if "webp" in ct:                return "webp"
    if "gif"  in ct:                return "gif"
    return "jpg"


def download_image(url: str, out_base: Path) -> Tuple[Path, int]:
    headers = {"User-Agent": USER_AGENT, "Accept": "image/*,*/*;q=0.8"}
    resp    = request_with_retries("GET", url, headers=headers, stream=True, allow_redirects=True)
    ext     = guess_ext(resp)
    out     = out_base.with_suffix("." + ext)
    out.parent.mkdir(parents=True, exist_ok=True)
    size = 0
    with out.open("wb") as f:
        for chunk in resp.iter_content(chunk_size=65536):
            if chunk:
                f.write(chunk)
                size += len(chunk)
    return out, size


# ---------------------------------------------------------------------------
# CSV I/O
# ---------------------------------------------------------------------------

FIELDNAMES = [
    "id", "name", "matched_query",
    "image_file", "image_url", "thumbnail",
    "source", "title", "creator", "license", "attribution",
    "bytes", "status", "error",
]


def read_foods(path: Path) -> List[FoodItem]:
    foods: List[FoodItem] = []
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fid  = str(row.get("id", "")).strip()
            name = str(row.get("name", "")).strip()
            if fid and name:
                foods.append(FoodItem(food_id=fid, name=name))
    return foods


def read_done_ids(out_csv: Path) -> set:
    done: set = set()
    if not out_csv.exists():
        return done
    with out_csv.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            if row.get("id"):
                done.add(row["id"].strip())
    return done


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python migrations/download_food_images.py migrations/foods.csv", file=sys.stderr)
        sys.exit(1)

    foods_csv  = Path(sys.argv[1])
    images_dir = foods_csv.parent / "images"
    out_csv    = foods_csv.parent / "downloads.csv"

    foods    = read_foods(foods_csv)
    done_ids = read_done_ids(out_csv)
    todo     = [f for f in foods if f.food_id not in done_ids]

    print(f"Total foods: {len(foods)} | Already done: {len(done_ids)} | To process: {len(todo)}")

    write_header = not out_csv.exists()
    with out_csv.open("a", encoding="utf-8", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=FIELDNAMES)
        if write_header:
            writer.writeheader()

        for idx, food in enumerate(todo, start=1):
            row = {k: "" for k in FIELDNAMES}
            row["id"]   = food.food_id
            row["name"] = food.name

            try:
                record = find_image(food)

                if not record:
                    row["status"] = "no_match"
                    writer.writerow(row); csv_file.flush()
                    print(f"[{idx}/{len(todo)}] NO MATCH  : {food.name}")
                    continue

                img_url = record.get("url", "")
                if not img_url:
                    row["status"] = "no_url"
                    writer.writerow(row); csv_file.flush()
                    print(f"[{idx}/{len(todo)}] NO URL    : {food.name}")
                    continue

                out_base   = images_dir / f"{food.food_id}_{slugify(food.name)}"
                file_path, size = download_image(img_url, out_base)

                row.update({
                    "matched_query": record.get("_matched_query", ""),
                    "image_file":    str(file_path),
                    "image_url":     img_url,
                    "thumbnail":     record.get("thumbnail", ""),
                    "source":        record.get("source", ""),
                    "title":         record.get("title", ""),
                    "creator":       record.get("creator", ""),
                    "license":       record.get("license", ""),
                    "attribution":   record.get("attribution", ""),
                    "bytes":         str(size),
                    "status":        "downloaded",
                })
                writer.writerow(row); csv_file.flush()
                print(f"[{idx}/{len(todo)}] OK ({size:,}b): {food.name}")

            except Exception as e:
                row["status"] = "error"
                row["error"]  = repr(e)
                writer.writerow(row); csv_file.flush()
                print(f"[{idx}/{len(todo)}] ERROR     : {food.name} -> {e}", file=sys.stderr)

    print("\nDone! Check migrations/downloads.csv and migrations/images/")
    print("Next step: node migrations/uploadAndUpdateImages.js")


if __name__ == "__main__":
    main()
