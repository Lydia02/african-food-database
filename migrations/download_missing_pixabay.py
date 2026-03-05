#!/usr/bin/env python3
"""
download_missing_pixabay.py

Downloads images for the 91 no-match foods using Pixabay API.
Pixabay is free and requires an API key (free signup at https://pixabay.com/api/docs/).

USAGE
  pip install requests
  python migrations/download_missing_pixabay.py <PIXABAY_API_KEY>

OUTPUT
  migrations/images/<id>_<slug>.<ext>
  migrations/downloads_pixabay.csv
"""

from __future__ import annotations

import csv
import re
import sys
import time
from pathlib import Path
from typing import Optional, Tuple

import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

PIXABAY_API  = "https://pixabay.com/api/"
IMAGES_DIR   = Path("migrations/images")
OUT_CSV      = Path("migrations/downloads_pixabay.csv")
TIMEOUT      = 20
USER_AGENT   = "PantryPalBot/1.0"
FIELDNAMES   = ["id", "name", "image_file", "image_url", "status", "error"]

# 91 no-match foods
NO_MATCH_FOODS = [
    ("0h41P6JLhSF8yLKkkrdV", "Derssa"),
    ("0u8ciBprwyNMMe0R3oCX", "Fura da Nono"),
    ("2v9cZJx9I6pjixOCFYqV", "Gurasa"),
    ("3NpoiRyKZfD93DtHbCjt", "Ofada Rice Ayamase Stew"),
    ("420SnHSI2Mls4MxtnLnl", "Ikokore water yam porridge"),
    ("42BFmqIVc5smqVVRp7Uq", "Edo black soup Nigerian"),
    ("4emeVh0N4WczHUPuO4Rl", "Chikanda Zambian"),
    ("68KNkyMI6EEoFRYn5gQq", "Koose bean cake Ghana"),
    ("6hGGLeen1EFlMTaDL93H", "Achu soup Cameroon"),
    ("71Z1N1W5SeTrdShjpOrs", "Libyan soup"),
    ("7lAlb1AkphDpBu0Gb0VD", "Ofe Nsala white soup Nigeria"),
    ("7w9c4UijTbUavNz8UAoR", "Ampesi boiled plantain Ghana"),
    ("AE5IGgZfxOeYZaQAh2hC", "Ewedu soup Nigeria"),
    ("AyYV7AWGyTwMsIEikDC3", "pumpkin leaves stew Africa"),
    ("BkbtBKC0ij5dx5bnjXxu", "Rechta Algerian pasta"),
    ("C2zz9NX3TWuDzNLPYDCO", "roasted corn Kenya"),
    ("CdmXRovPoPb3aDyK1XbC", "Caldou Senegalese fish rice"),
    ("DZOUNYOkWykpbQuCWc9R", "Chipsi Mayai chips omelette Tanzania"),
    ("Dw5Q68WYttz3B56QixeO", "Miyan Kuka baobab soup Nigeria"),
    ("EFsaSrypa2YJKZlySXr7", "Brik tunisian pastry egg"),
    ("ElUOkWxrvMz93b9ED0bX", "Agege bread beans Nigeria"),
    ("FArK8jmap6pdWEWAEFlT", "Kilishi Nigerian dried meat"),
    ("FqqDkSkbzUP5oYX8o7xk", "Nyembwe chicken Gabon palm nut"),
    ("G2VN9HFMatpI0b20EcrQ", "Sishwala Eswatini porridge"),
    ("Ga0Yq7u8V764lVApPaNw", "Fufu Pondu Congo cassava"),
    ("HJzEoVMFTnhKf95KAdHG", "Kilishi Nigerian beef jerky"),
    ("Hn5OTVTlawIkngFECgHd", "Isi Ewu goat head soup Nigeria"),
    ("JtWpu7yN3nvR8WK64uUu", "Kikomando Uganda chapati beans"),
    ("JvaoPX5yaylKNZI3auwo", "Attieke fried fish Ivory Coast"),
    ("JxeEnt5kfbFVLbqjSvVc", "Gizdodo gizzard plantain Nigeria"),
    ("Mys8UO8wi0ofSxTOwYCf", "Vitumbuwa Zambian fritters"),
    ("NpJeOSY0heM35tc5Sg30", "Ugali nyama Kenya"),
    ("OslneX8sSy30WLkMV7JL", "Wali maharage rice beans Tanzania"),
    ("PeCGnE7rLEzehucCMFol", "Ndizi nyama plantain meat Tanzania"),
    ("Q10KoZOXN43xLCxtYLut", "pate noire okra sauce Africa"),
    ("QWlLdpAOKUF8bIv7ZSYB", "Lahoh Somali pancake"),
    ("QgzZHrO2krWUF2Fk2NOR", "Kat Kat banana coconut Seychelles"),
    ("QhLBN0mqa2HOhobotOkq", "Nkwobi Nigerian cow foot"),
    ("RZ1SASBdyx8C1tuzSpWd", "Eru soup Cameroon"),
    ("TnGXe6yZojOQoSOB9p7O", "Ekpang Nkukwo Nigeria cocoyam"),
    ("ToYru7fvF2UaDfeSHhRe", "Bogobe sorghum porridge Botswana"),
    ("URqrswWPLRZnkNwkgKui", "Koklo Meme grilled chicken Togo"),
    ("Ugm7irxuiNSajeio7YZ7", "bitter leaf soup Nigeria"),
    ("Vk7MV5lFibALrno8lRUb", "Babenda Burkina Faso greens"),
    ("W4FI3VAjI5A80Hzw7Djc", "Calulu fish stew Sao Tome"),
    ("WzUMnGZDdn8ImL9zxaVN", "cassava leaf stew Sierra Leone"),
    ("YLL6Sof4G7xOY3Wvjyyy", "Dambou millet Niger"),
    ("YPZMoKBN4hqVjOiE1iyY", "Indomie jollof noodles Nigeria"),
    ("ZqAL80w2lwJuituWdepO", "Bariis Iskukaris Somali spiced rice"),
    ("a6kqCkBtsbre1igV3bBN", "Succotash seafood Equatorial Guinea"),
    ("aFgcXO5TYYdfmmozXUjz", "Ofe Oha Nigerian soup"),
    ("aTcBbURUIGez7byusa1F", "Tigadeguena Mali peanut stew"),
    ("bcJreidGkqwTNSGWkJi1", "Moi Moi custard pap Nigeria"),
    ("cWbvSJaqYPsxMjGmL2gj", "Nshima kapenta fish Zambia"),
    ("drsfsb17zNmrK1pfDWXw", "Muamba de Galinha Angola chicken"),
    ("es189eBL7HiyrtK6Hn9M", "rice greens Madagascar"),
    ("fTSE3EkUru4v1ossDGLT", "Achu yellow soup Cameroon"),
    ("fUrCaO3sas6h4FGZbOaX", "Cambuulo adzuki beans Somalia"),
    ("fYt87eSZ8J1yCnECsSib", "Nsima chambo fish Malawi"),
    ("fglM1eMEnzGZtBqFSBt6", "Tajine Zitoun olive chicken Algeria"),
    ("flNOxHQtPA8B9ckTmJD3", "Couscous Algerois Algeria"),
    ("gHhYouqL7YgxyG9DXiJ4", "Chipsi Mayai chips omelette"),
    ("gQkL7qwERw5OvaxNoBO8", "Fufu Pondu Congo"),
    ("hwiHpGpDoLJ8iDQ5ARRb", "Sadza muriwo nyama Zimbabwe"),
    ("jONbiiOqOaKSaCjyiuDh", "Chakhchoukha Algeria bread stew"),
    ("jzxgxVeMdFgmR5kmB4Ir", "Calulu de Peixe Angola fish stew"),
    ("mLJkVSqI6FSGVXnkKMP7", "Caldo de Mancarra Guinea-Bissau peanut"),
    ("n2NYj1Kl7iXBC7oS7AGS", "Ndole plantain Cameroon"),
    ("nCPPLiLT05GC8GyQsyo3", "Canjeero Somali pancake"),
    ("pQjzRuSIln2CDen1nfch", "Garri groundnut Nigeria"),
    ("puKlZgyaaBuj0PEb4YJS", "Miyan Taushe pumpkin soup Nigeria"),
    ("qGtoC0necVKZM4aphiFW", "Langouste vanilla lobster Comoros"),
    ("r3eZTWaDTVP5uVyzCYS4", "Ojja Tunisian shakshuka"),
    ("sMqU97r2Q5CXPKnZqhhu", "Vetkoek mince South Africa"),
    ("sRR9GDhVChQbKXRUAKpZ", "Pap wors chakalaka South Africa"),
    ("sW7Tma1Vgt63f7FZiDaf", "Native Jollof Iwuk Edesi Nigeria"),
    ("tJPrgint4TtslVqh758o", "Angu banana Sao Tome"),
    ("tvVAFR5aQsl76BiIaG1F", "Sadza nyama Zimbabwe"),
    ("uVWOD2kHku5WNVW0qp1w", "Ekuru steamed beans Nigeria"),
    ("ueqz5cAgfeH0wIv18RDT", "Chorba Frik freekeh soup Algeria"),
    ("uotvRvjVs561CLIr8D0q", "Skoudehkaris Djibouti spiced rice"),
    ("uwiHl0UV2YwXydhe7ZqZ", "Eru soup Cameroon"),
    ("vIYyuYiy2S8LYvP3mFel", "Oshifima Namibia porridge"),
    ("vWfnXOx6W74zJxpvleef", "Chinchinga Ghanaian kebab skewer"),
    ("vuYSW75bLPkCPlsQ8ohp", "Xima peanut stew Mozambique"),
    ("wYuCSk620DrDYAxxHwCq", "Sisi Pelebe Nigeria soup"),
    ("xGbDVXeO59LZOcMIA07T", "Ofe Akwu banga palm nut soup Nigeria"),
    ("xrbQ2pXtkjuXsjBxAW2J", "Bsisa roasted grain Morocco"),
    ("yVP6U7Vd38ZhC99fQY1L", "Liboke fish banana leaf Congo"),
    ("ypIVXxXWK1V8TEdKnqkL", "Suqaar Somali sauteed meat"),
    ("zCMZGcK34FHOaYcrb1oj", "coconut rice Africa"),
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(text: str) -> str:
    t = text.lower().strip()
    t = re.sub(r"[^a-z0-9]+", "_", t)
    return re.sub(r"_+", "_", t).strip("_")[:60] or "item"


def search_pixabay(query: str, api_key: str) -> Optional[str]:
    """Return best image URL from Pixabay for the query."""
    # Try specific query first, then simplified
    queries = [query]
    # Add fallback with just first 2 words
    words = query.split()
    if len(words) > 2:
        queries.append(" ".join(words[:2]))
    # Add generic food fallback
    queries.append(f"{words[0]} food")

    for q in queries:
        try:
            resp = requests.get(PIXABAY_API, params={
                "key": api_key,
                "q": q,
                "image_type": "photo",
                "category": "food",
                "min_width": 400,
                "per_page": 10,
                "safesearch": "true",
            }, timeout=TIMEOUT)
            resp.raise_for_status()
            hits = resp.json().get("hits", [])
            if hits:
                # prefer larger images
                best = max(hits, key=lambda h: h.get("imageWidth", 0) * h.get("imageHeight", 0))
                return best.get("largeImageURL") or best.get("webformatURL")
            time.sleep(0.3)
        except Exception as e:
            print(f"  Pixabay error ({q}): {e}", file=sys.stderr)
            time.sleep(1)

    return None


def guess_ext(resp: requests.Response, url: str) -> str:
    ct = (resp.headers.get("Content-Type") or "").lower()
    if "jpeg" in ct or "jpg" in ct: return "jpg"
    if "png"  in ct:                return "png"
    if "webp" in ct:                return "webp"
    low = url.lower().split("?")[0]
    for ext in ("jpg", "jpeg", "png", "webp"):
        if low.endswith(ext): return "jpg" if ext == "jpeg" else ext
    return "jpg"


def download(url: str, out_base: Path) -> Tuple[Path, int]:
    headers = {"User-Agent": USER_AGENT}
    resp = requests.get(url, headers=headers, timeout=TIMEOUT, stream=True, allow_redirects=True)
    resp.raise_for_status()
    ext  = guess_ext(resp, url)
    out  = out_base.with_suffix("." + ext)
    out.parent.mkdir(parents=True, exist_ok=True)
    size = 0
    with out.open("wb") as f:
        for chunk in resp.iter_content(65536):
            if chunk:
                f.write(chunk); size += len(chunk)
    if size < 2000:
        out.unlink(missing_ok=True)
        raise ValueError(f"Image too small ({size}b)")
    return out, size


def read_done() -> set:
    done: set = set()
    if not OUT_CSV.exists():
        return done
    with OUT_CSV.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            if row.get("id"):
                done.add(row["id"].strip())
    return done


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python migrations/download_missing_pixabay.py <PIXABAY_API_KEY>", file=sys.stderr)
        print("Get a free key at https://pixabay.com/api/docs/", file=sys.stderr)
        sys.exit(1)

    api_key = sys.argv[1].strip()
    done    = read_done()
    todo    = [(fid, name) for fid, name in NO_MATCH_FOODS if fid not in done]

    print(f"Total: {len(NO_MATCH_FOODS)} | Done: {len(done)} | To process: {len(todo)}\n")

    write_header = not OUT_CSV.exists()
    with OUT_CSV.open("a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if write_header:
            writer.writeheader()

        for idx, (food_id, query) in enumerate(todo, 1):
            row = {"id": food_id, "name": query, "image_file": "",
                   "image_url": "", "status": "", "error": ""}
            try:
                url = search_pixabay(query, api_key)
                if not url:
                    row["status"] = "no_match"
                    writer.writerow(row); f.flush()
                    print(f"[{idx}/{len(todo)}] NO MATCH : {query}")
                    continue

                out_base  = IMAGES_DIR / f"{food_id}_{slugify(query)}"
                path, size = download(url, out_base)

                row.update({"image_file": str(path), "image_url": url, "status": "downloaded"})
                writer.writerow(row); f.flush()
                print(f"[{idx}/{len(todo)}] OK ({size:,}b): {query}")

            except Exception as e:
                row["status"] = "error"
                row["error"]  = repr(e)
                writer.writerow(row); f.flush()
                print(f"[{idx}/{len(todo)}] ERROR    : {query} -> {e}", file=sys.stderr)

            time.sleep(0.5)   # stay within Pixabay rate limits

    print(f"\nDone! Check {OUT_CSV}")
    print("Next: node migrations/uploadAndUpdateImages.js --csv=migrations/downloads_pixabay.csv")


if __name__ == "__main__":
    main()
