#!/usr/bin/env python3
"""Harvest official seating copy from remaining unsourced MiLB clubs."""

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

ALREADY = set(milb.OVERRIDES)

PATHS = (
    "/tickets/seatingchart",
    "/tickets/seating-chart",
    "/tickets/seating-map",
    "/ballpark/seatingchart",
    "/ballpark/seating-chart",
    "/ballpark/seating-map",
    "/tickets/season-tickets",
    "/tickets/season-memberships",
    "/tickets/season-ticket-memberships",
    "/tickets/mini-plans",
    "/tickets/flex-plans",
    "/tickets/groups",
    "/tickets/group-tickets",
    "/tickets/group-outings",
    "/ballpark/a-z-guide",
    "/ballpark/a-z",
    "/ballpark/guide",
    "/ballpark/ballparkguide",
    "/ballpark/fan-guide",
    "/ballpark/accessibility",
    "/ballpark/faq",
    "/ballpark/faqs",
    "/tickets",
)

RANGE = re.compile(
    r"(?:sections?|secs?\.?|box(?:es)?|reserved|field box|dugout|bleachers?|"
    r"club|infield|outfield|grandstand|loge|terrace|home plate)\s+"
    r"(\d{1,3})\s*(?:-|–|to|&amp;|&)\s*(\d{1,3})",
    re.I,
)
LETTER_RANGE = re.compile(
    r"(?:sections?|box(?:es)?|diamond|bullpen|club box|field)\s+"
    r"([A-Z]{1,3})\s*(?:-|–|to)\s*([A-Z]{1,3})",
    re.I,
)
SECTION = re.compile(r"\bSection(?:s)?\s+(\d{1,3})\b", re.I)
PDF = re.compile(
    r"https?://img\.mlbstatic\.com/milb-images/image/(?:upload|private)/[^\s\"']+\.(?:pdf|jpg|png)",
    re.I,
)
NAMED = re.compile(
    r"\b("
    r"Party Deck|Picnic (?:Area|Pavilion|Patio|Deck)|Grass Berm|Berm|"
    r"Home Run (?:Porch|Patio|Deck|Hill)|Pool(?: Area| Deck)?|"
    r"Beer Garden|Lawn|Green Monster|Blue Monster|Chill Zone|"
    r"Home Plate Club|Dugout Club|Tiki (?:Deck|Bar|Terrace)|"
    r"Pig Pen|Bacon Strip|PNC Club|Left Field Terrace|Foul Pole Patio|"
    r"Zander Berm|Houchens Club|CKF Party|Hy-Vee Pavilion|"
    r"Owner.?s Seats|Bluffs?|Knot Hole"
    r")\b",
    re.I,
)


def fetch(url: str) -> tuple[int | None, str, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=16) as resp:
            return resp.status, resp.geturl(), resp.read().decode("utf-8", "ignore")
    except Exception:
        return None, url, ""


def process(stadium: dict) -> dict:
    slug = milb.SLUGS.get(stadium["id"])
    rec = {"id": stadium["id"], "slug": slug, "hits": []}
    if not slug:
        return rec
    for path in PATHS:
        url = f"https://www.milb.com/{slug}{path}"
        status, final, html = fetch(url)
        if status != 200 or not html:
            continue
        team_tok = stadium["team"].split()[0].lower()
        name_tok = stadium["name"].split()[0].lower()
        if team_tok not in html.lower() and name_tok not in html.lower():
            continue
        ranges = [(int(a), int(b)) for a, b in RANGE.findall(html)]
        letters = LETTER_RANGE.findall(html)
        singles = sorted({int(n) for n in SECTION.findall(html) if 1 <= int(n) <= 799})
        named = sorted({m.group(0) for m in NAMED.finditer(html)})
        pdfs = sorted(set(PDF.findall(html)))
        if ranges or letters or len(singles) >= 4 or named or pdfs:
            rec["hits"].append(
                {
                    "url": final,
                    "path": path,
                    "ranges": ranges[:20],
                    "letters": letters[:20],
                    "singles": singles[:40],
                    "named": named[:20],
                    "pdfs": pdfs[:8],
                }
            )
    return rec


def main() -> None:
    stadiums = [s for s in milb.parse_stadiums() if s["id"] not in ALREADY]
    # Prefer remaining AAA first, then the rest.
    aaa_ids = {
        "iowa-cubs", "lehigh-valley-ironpigs", "louisville-bats", "memphis-redbirds",
        "nashville-sounds", "omaha-storm-chasers", "rochester-red-wings",
        "scranton-railriders", "st-paul-saints", "syracuse-mets",
        "albuquerque-isotopes", "el-paso-chihuahuas", "reno-aces",
        "round-rock-express", "sacramento-river-cats", "salt-lake-bees",
        "sugar-land-space-cowboys", "tacoma-rainiers",
    }
    first = [s for s in stadiums if s["id"] in aaa_ids]
    rest = [s for s in stadiums if s["id"] not in aaa_ids]
    todo = first + rest[:40]
    print(f"harvest {len(todo)} / remaining {len(stadiums)}", flush=True)
    out = []
    with ThreadPoolExecutor(max_workers=10) as pool:
        futs = {pool.submit(process, s): s for s in todo}
        for fut in as_completed(futs):
            rec = fut.result()
            out.append(rec)
            useful = [h for h in rec["hits"] if h["ranges"] or h["letters"] or len(h["singles"]) >= 6]
            print(
                f"  {rec['id']}: pages={len(rec['hits'])} useful={len(useful)}",
                flush=True,
            )
            for h in useful[:3]:
                print(
                    f"    {h['path']} ranges={h['ranges'][:6]} letters={h['letters'][:4]} "
                    f"singles={h['singles'][:12]} named={h['named'][:6]}",
                    flush=True,
                )
    out.sort(key=lambda r: r["id"])
    (ROOT / "tmp/milb-aaa-harvest.json").write_text(json.dumps(out, indent=2))
    print("wrote tmp/milb-aaa-harvest.json", flush=True)


if __name__ == "__main__":
    main()
