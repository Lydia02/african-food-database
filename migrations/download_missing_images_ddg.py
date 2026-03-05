#!/usr/bin/env python3
"""
download_missing_images_ddg.py

Second-pass image downloader for the 91 foods that Openverse couldn't match.
Uses DuckDuckGo image search (no API key required).

USAGE
  pip install requests duckduckgo-search
  python migrations/download_missing_images_ddg.py

OUTPUT
  migrations/images/<id>_<slug>.<ext>   -- downloaded image files
  migrations/downloads_ddg.csv          -- metadata for the upload step
"""

from __future__ import annotations

import csv
import io
import re
import sys
import time
from pathlib import Path
from typing import Optional, Tuple

import requests
from duckduckgo_search import DDGS

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

IMAGES_DIR = Path("migrations/images")
OUT_CSV    = Path("migrations/downloads_ddg.csv")
TIMEOUT    = 20
USER_AGENT = "Mozilla/5.0 (compatible; PantryPalBot/1.0)"

EXCLUDED_HOSTS = (
    "wikipedia.org", "wikimedia.org", "upload.wikimedia.org",
    "commons.wikimedia.org",
)

# 91 no-match foods from the Openverse run
NO_MATCH_FOODS = [
    ("0h41P6JLhSF8yLKkkrdV", "Derssa"),
    ("0u8ciBprwyNMMe0R3oCX", "Fura da Nono"),
    ("2v9cZJx9I6pjixOCFYqV", "Gurasa"),
    ("3NpoiRyKZfD93DtHbCjt", "Ofada Rice & Ayamase Stew"),
    ("420SnHSI2Mls4MxtnLnl", "Ikokore"),
    ("42BFmqIVc5smqVVRp7Uq", "Edo black soup"),
    ("4emeVh0N4WczHUPuO4Rl", "Chikanda (African Polony)"),
    ("68KNkyMI6EEoFRYn5gQq", "Koose (Bean Cake) and Koko"),
    ("6hGGLeen1EFlMTaDL93H", "Achu Soup & Fufu"),
    ("71Z1N1W5SeTrdShjpOrs", "Sharba Libiya (Libyan Soup)"),
    ("7lAlb1AkphDpBu0Gb0VD", "Ofe Nsala (White Soup)"),
    ("7w9c4UijTbUavNz8UAoR", "Ampesi (Boiled Yam/Plantain) with Kontomire"),
    ("AE5IGgZfxOeYZaQAh2hC", "Ewedu Soup"),
    ("AyYV7AWGyTwMsIEikDC3", "Muboora (Pumpkin Leaves)"),
    ("BkbtBKC0ij5dx5bnjXxu", "Rechta"),
    ("C2zz9NX3TWuDzNLPYDCO", "Mahindi Choma (Roasted Corn)"),
    ("CdmXRovPoPb3aDyK1XbC", "Caldou"),
    ("DZOUNYOkWykpbQuCWc9R", "Chipsi Mayai (Chips Mayai)"),
    ("Dw5Q68WYttz3B56QixeO", "Miyan Kuka (Baobab Soup)"),
    ("EFsaSrypa2YJKZlySXr7", "Brik à l'Oeuf"),
    ("ElUOkWxrvMz93b9ED0bX", "Agege Bread and Ewa Agoyin"),
    ("FArK8jmap6pdWEWAEFlT", "Kilishi"),
    ("FqqDkSkbzUP5oYX8o7xk", "Nyembwe Chicken"),
    ("G2VN9HFMatpI0b20EcrQ", "Sishwala"),
    ("Ga0Yq7u8V764lVApPaNw", "Fufu and Pondu"),
    ("HJzEoVMFTnhKf95KAdHG", "Kilishi"),
    ("Hn5OTVTlawIkngFECgHd", "Isi Ewu (Goat Head)"),
    ("JtWpu7yN3nvR8WK64uUu", "Kikomando"),
    ("JvaoPX5yaylKNZI3auwo", "Attiéké and Fried Fish"),
    ("JxeEnt5kfbFVLbqjSvVc", "Gizdodo"),
    ("Mys8UO8wi0ofSxTOwYCf", "Vitumbuwa (Zambian Fritters)"),
    ("NpJeOSY0heM35tc5Sg30", "Ugali na Nyama"),
    ("OslneX8sSy30WLkMV7JL", "Wali na Maharage"),
    ("PeCGnE7rLEzehucCMFol", "Ndizi Nyama (Plantain & Meat)"),
    ("Q10KoZOXN43xLCxtYLut", "Pâte Noire & Sauce Gombo"),
    ("QWlLdpAOKUF8bIv7ZSYB", "Lahoh"),
    ("QgzZHrO2krWUF2Fk2NOR", "Kat Kat Banane"),
    ("QhLBN0mqa2HOhobotOkq", "Nkwobi"),
    ("RZ1SASBdyx8C1tuzSpWd", "Eru Soup"),
    ("TnGXe6yZojOQoSOB9p7O", "Ekpang Nkukwo"),
    ("ToYru7fvF2UaDfeSHhRe", "Bogobe (Sorghum Porridge)"),
    ("URqrswWPLRZnkNwkgKui", "Koklo Meme (Grilled Chicken)"),
    ("Ugm7irxuiNSajeio7YZ7", "Ofe Onugbu (Bitter Leaf Soup)"),
    ("Vk7MV5lFibALrno8lRUb", "Babenda"),
    ("W4FI3VAjI5A80Hzw7Djc", "Calulu São-tomense"),
    ("WzUMnGZDdn8ImL9zxaVN", "Cassava Leaf Stew"),
    ("YLL6Sof4G7xOY3Wvjyyy", "Dambou (Niger)"),
    ("YPZMoKBN4hqVjOiE1iyY", "Indomie Jollof"),
    ("ZqAL80w2lwJuituWdepO", "Bariis Iskukaris (Somali Spiced Rice)"),
    ("a6kqCkBtsbre1igV3bBN", "Succotash de Mariscos"),
    ("aFgcXO5TYYdfmmozXUjz", "Ofe Oha"),
    ("aTcBbURUIGez7byusa1F", "Tigadèguèna (Mali Peanut Stew)"),
    ("bcJreidGkqwTNSGWkJi1", "Moi Moi and Custard/Pap"),
    ("cWbvSJaqYPsxMjGmL2gj", "Nshima, Kapenta and Chibwabwa"),
    ("drsfsb17zNmrK1pfDWXw", "Muamba de Galinha"),
    ("es189eBL7HiyrtK6Hn9M", "Vary amin'anana (Rice and Greens)"),
    ("fTSE3EkUru4v1ossDGLT", "Achu Soup and Fufu (Yellow Soup)"),
    ("fUrCaO3sas6h4FGZbOaX", "Cambuulo (Adzuki Bean Dessert)"),
    ("fYt87eSZ8J1yCnECsSib", "Nsima with Chambo"),
    ("fglM1eMEnzGZtBqFSBt6", "Tajine Zitoun"),
    ("flNOxHQtPA8B9ckTmJD3", "Couscous Algérois"),
    ("gHhYouqL7YgxyG9DXiJ4", "Chipsi Mayai (Chips Omelette)"),
    ("gQkL7qwERw5OvaxNoBO8", "Fufu and Pondu"),
    ("hwiHpGpDoLJ8iDQ5ARRb", "Sadza and Muriwo ne Nyama"),
    ("jONbiiOqOaKSaCjyiuDh", "Chakhchoukha"),
    ("jzxgxVeMdFgmR5kmB4Ir", "Calulu de Peixe"),
    ("mLJkVSqI6FSGVXnkKMP7", "Caldo de Mancarra"),
    ("n2NYj1Kl7iXBC7oS7AGS", "Ndolé and Plantain"),
    ("nCPPLiLT05GC8GyQsyo3", "Canjeero (Somali Pancake)"),
    ("pQjzRuSIln2CDen1nfch", "Garri and Groundnut"),
    ("puKlZgyaaBuj0PEb4YJS", "Miyan Taushe (Pumpkin Soup)"),
    ("qGtoC0necVKZM4aphiFW", "Langouste à la Vanille"),
    ("r3eZTWaDTVP5uVyzCYS4", "Ojja (Tunisian Shakshuka)"),
    ("sMqU97r2Q5CXPKnZqhhu", "Vetkoek and Mince"),
    ("sRR9GDhVChQbKXRUAKpZ", "Pap, Wors, and Chakalaka"),
    ("sW7Tma1Vgt63f7FZiDaf", "Native Jollof (Iwuk Edesi)"),
    ("tJPrgint4TtslVqh758o", "Ângu de Banana"),
    ("tvVAFR5aQsl76BiIaG1F", "Sadza ne Nyama"),
    ("uVWOD2kHku5WNVW0qp1w", "Ekuru with Stew"),
    ("ueqz5cAgfeH0wIv18RDT", "Chorba Frik (Freekeh Soup)"),
    ("uotvRvjVs561CLIr8D0q", "Skoudehkaris (Djibouti Spiced Rice)"),
    ("uwiHl0UV2YwXydhe7ZqZ", "Eru Soup"),
    ("vIYyuYiy2S8LYvP3mFel", "Oshifima with Omagungu"),
    ("vWfnXOx6W74zJxpvleef", "Chinchinga (Ghanaian Kebab)"),
    ("vuYSW75bLPkCPlsQ8ohp", "Xima and Caril de Amendoim"),
    ("wYuCSk620DrDYAxxHwCq", "Sisi Pelebe"),
    ("xGbDVXeO59LZOcMIA07T", "Ofe Akwu (Banga Soup)"),
    ("xrbQ2pXtkjuXsjBxAW2J", "Bsisa"),
    ("yVP6U7Vd38ZhC99fQY1L", "Liboke ya Mbisi"),
    ("ypIVXxXWK1V8TEdKnqkL", "Suqaar (Somali Sautéed Meat)"),
    ("zCMZGcK34FHOaYcrb1oj", "Wali wa Nazi (Coconut Rice)"),
]

FIELDNAMES = ["id", "name", "image_file", "image_url", "status", "error"]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(text: str) -> str:
    t = text.lower().strip()
    t = re.sub(r"[''\u2019]", "", t)
    t = re.sub(r"[^a-z0-9]+", "_", t)
    return re.sub(r"_+", "_", t).strip("_")[:80] or "item"


def make_queries(name: str):
    base = name.strip()
    no_parens = re.sub(r"\s*\([^)]*\)\s*", " ", base).strip()
    no_parens = re.sub(r"\s+", " ", no_parens)
    queries = []
    if no_parens and no_parens.lower() != base.lower():
        queries.append(f"{no_parens} African food")
        queries.append(f"{no_parens} dish")
    queries.append(f"{base} food")
    queries.append(f"{base} African dish")
    seen, out = set(), []
    for q in queries:
        if q.lower() not in seen:
            out.append(q); seen.add(q.lower())
    return out


def is_excluded(url: str) -> bool:
    return any(h in url.lower() for h in EXCLUDED_HOSTS)


def guess_ext(resp: requests.Response, url: str) -> str:
    ct = (resp.headers.get("Content-Type") or "").lower()
    if "jpeg" in ct or "jpg" in ct: return "jpg"
    if "png"  in ct:                return "png"
    if "webp" in ct:                return "webp"
    if "gif"  in ct:                return "gif"
    # fallback from URL
    low = url.lower().split("?")[0]
    for ext in ("jpg", "jpeg", "png", "webp"):
        if low.endswith(ext): return "jpg" if ext == "jpeg" else ext
    return "jpg"


def download(url: str, out_base: Path) -> Tuple[Path, int]:
    headers = {"User-Agent": USER_AGENT, "Accept": "image/*,*/*;q=0.8"}
    resp = requests.get(url, headers=headers, timeout=TIMEOUT,
                        stream=True, allow_redirects=True)
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
        raise ValueError(f"Image too small ({size} bytes) — likely a placeholder")
    return out, size


def search_ddg(name: str) -> Optional[str]:
    """Return first non-Wikipedia image URL from DuckDuckGo, or None."""
    ddgs = DDGS()
    for query in make_queries(name):
        try:
            results = list(ddgs.images(
                query,
                max_results=10,
                safesearch="moderate",
            ))
            for r in results:
                url = r.get("image") or r.get("url") or ""
                if url and not is_excluded(url):
                    return url
            time.sleep(0.5)
        except Exception as e:
            print(f"  DDG search error ({query}): {e}", file=sys.stderr)
            time.sleep(2)
    return None


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def read_done() -> set:
    done: set = set()
    if not OUT_CSV.exists():
        return done
    with OUT_CSV.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            if row.get("id"):
                done.add(row["id"].strip())
    return done


def main() -> None:
    done = read_done()
    todo = [(fid, name) for fid, name in NO_MATCH_FOODS if fid not in done]

    print(f"Total missing: {len(NO_MATCH_FOODS)} | Already done: {len(done)} | To process: {len(todo)}")

    write_header = not OUT_CSV.exists()
    with OUT_CSV.open("a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if write_header:
            writer.writeheader()

        for idx, (food_id, name) in enumerate(todo, 1):
            row = {"id": food_id, "name": name, "image_file": "",
                   "image_url": "", "status": "", "error": ""}
            try:
                url = search_ddg(name)
                if not url:
                    row["status"] = "no_match"
                    writer.writerow(row); f.flush()
                    print(f"[{idx}/{len(todo)}] NO MATCH  : {name}")
                    continue

                out_base   = IMAGES_DIR / f"{food_id}_{slugify(name)}"
                file_path, size = download(url, out_base)

                row.update({"image_file": str(file_path), "image_url": url, "status": "downloaded"})
                writer.writerow(row); f.flush()
                print(f"[{idx}/{len(todo)}] OK ({size:,}b): {name}")

            except Exception as e:
                row["status"] = "error"
                row["error"]  = repr(e)
                writer.writerow(row); f.flush()
                print(f"[{idx}/{len(todo)}] ERROR     : {name} -> {e}", file=sys.stderr)

            # be polite to DDG
            time.sleep(1.0)

    print(f"\nDone! Check {OUT_CSV}")
    print("Next step: node migrations/uploadAndUpdateImages.js --csv migrations/downloads_ddg.csv")


if __name__ == "__main__":
    main()
