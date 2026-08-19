#!/usr/bin/env python3
"""Collect official section IDs from club seating-map / section-view pages."""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/workspace")
sys.path.insert(0, str(ROOT / "scripts"))
import generateMilbOfficialInventories as milb

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    )
}
PATHS = (
    "/ballpark/seating-map",
    "/ballpark/seatingchart",
    "/ballpark/seating-chart",
    "/tickets/seating-diagram",
    "/tickets/seating-map",
    "/ballpark/map",
)
SECTION = re.compile(r"\bSection\s+(\d{2,3})\b", re.I)
NAMED = re.compile(
    r"\b("
    r"Home Run Terrace|Blue Monster|Green Monster|Party Deck|Picnic (?:Area|Pavilion|Patio|Deck)|"
    r"Grass Berm|Berm|Lawn(?: [A-Z])?|Home Run (?:Porch|Patio|Deck|Hill)|"
    r"Pool(?: Area| Deck)?|Beer Garden|Right Field (?:Pavilion|Porch|Deck)|"
    r"Left Field (?:Pavilion|Porch|Deck)|Dugout (?:Club|Box)|"
    r"Jackie Robinson Deck|Tobacco Road|PNC Triangle Club|"
    r"Bully Hill(?: Party Deck)?|Las Vegas Club|"
    r"Tiki (?:Deck|Bar)|Cabana|Hot Tub|"
    r"Skyline (?:Deck|Porch|Club)|Family Deck|Boardwalk|"
    r"Funnville|Kids Zone|Standing Room|SRO"
    r")\b",
    re.I,
)


def fetch(url: str) -> tuple[int | None, str, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=18) as resp:
            return resp.status, resp.geturl(), resp.read().decode("utf-8", "ignore")
    except Exception:
        return None, url, ""


def process(stadium: dict) -> dict:
    slug = milb.SLUGS.get(stadium["id"])
    rec = {
        "id": stadium["id"],
        "orientation": stadium.get("orientation", 0),
        "slug": slug,
        "url": None,
        "ids": [],
        "named": [],
    }
    if not slug:
        return rec
    for path in PATHS:
        url = f"https://www.milb.com/{slug}{path}"
        status, final, html = fetch(url)
        if status != 200 or not html:
            continue
        if stadium["team"].split()[0].lower() not in html.lower() and stadium["name"].split()[0].lower() not in html.lower():
            continue
        ids = [n for n in SECTION.findall(html) if 1 <= int(n) <= 699]
        named = [m.group(0) for m in NAMED.finditer(html)]
        if len(set(ids)) < 8 and not (len(set(ids)) >= 5 and named):
            continue
        rec["url"] = final
        rec["ids"] = sorted(set(ids), key=int)
        rec["named"] = sorted(set(named))
        break
    return rec


def main() -> None:
    stadiums = milb.parse_stadiums()
    print(f"section-view scrape {len(stadiums)}", flush=True)
    results = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futs = {pool.submit(process, s): s for s in stadiums}
        for fut in as_completed(futs):
            rec = fut.result()
            results.append(rec)
            if rec["ids"]:
                print(f"  {rec['id']}: {len(rec['ids'])} ids {rec['ids'][:12]}... named={rec['named'][:4]} {rec['url']}", flush=True)
    results.sort(key=lambda r: r["id"])
    Path("/workspace/tmp/milb-section-views.json").write_text(json.dumps(results, indent=2))
    print("hits", sum(1 for r in results if r["ids"]), "/", len(results), flush=True)


if __name__ == "__main__":
    main()
