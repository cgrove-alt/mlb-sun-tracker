#!/usr/bin/env python3
"""Find official reserved-section price maps on remaining MiLB club pages."""

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
    "/ballpark/ticketpricesandballparkmap",
    "/ballpark/ticket-prices",
    "/ballpark/ticketprices",
    "/tickets/ticket-prices",
    "/tickets/prices",
    "/tickets/seatingchart",
    "/tickets/seating-chart",
    "/ballpark/seatingchart",
    "/ballpark/seating-chart",
    "/ballpark/seating-map",
    "/tickets/season-tickets",
    "/tickets/season-memberships",
    "/tickets/season-ticket-memberships",
    "/tickets/groups",
    "/tickets/group-tickets",
    "/tickets/group-outings",
    "/tickets/mini-plans",
    "/tickets/flex-plans",
    "/ballpark/a-z-guide",
    "/ballpark/a-z",
    "/ballpark/a-to-z",
    "/ballpark/guide",
    "/ballpark/ballparkguide",
    "/ballpark/fan-guide",
    "/ballpark/faq",
    "/ballpark/faqs",
    "/ballpark/accessibility",
    "/tickets",
)

PRICE = re.compile(
    r"(?:Home Plate|Dugout|Reserved|Baseline|Field|Infield|Outfield|Box|"
    r"Club|Porch|Lawn|Berm|Grandstand|Bleacher|Terrace|Loge|"
    r"Backstop|Monster|Pavilion|Deck)[^.\n]{0,80}"
    r"Sections?\s+(\d{1,3})\s*(?:-|–|&amp;|&|and|to)\s*(\d{1,3})"
    r"(?:[^.\n]{0,40}(?:-|–|&amp;|&|and)\s*(\d{1,3})\s*(?:-|–|&amp;|&|and|to)\s*(\d{1,3}))?",
    re.I,
)
SECTIONS_PARA = re.compile(
    r"Sections?\s+\d{1,3}\s*(?:-|–|to)\s*\d{1,3}[^.|]{0,90}"
    r"(?:located|are on|first base|third base|home plate|behind the net)",
    re.I,
)
RANGE = re.compile(
    r"(?:sections?|box(?:es)?|reserved|dugout|field box|infield|outfield|"
    r"home plate|porch|club)\s+(\d{1,3})\s*(?:-|–|to|&amp;|&)\s*(\d{1,3})",
    re.I,
)
PDF = re.compile(
    r"https?://img\.mlbstatic\.com/milb-images/image/(?:upload|private)/[^\s\"']+\.(?:pdf|jpg|png)",
    re.I,
)
MAP_HREF = re.compile(
    r'href="([^"]*(?:seating|ticket.?price|ballpark.?map|section)[^"]*)"',
    re.I,
)


def fetch(url: str) -> tuple[int | None, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=14) as resp:
            return resp.status, resp.read().decode("utf-8", "ignore")
    except Exception:
        return None, ""


def process(stadium: dict) -> dict:
    slug = milb.SLUGS.get(stadium["id"])
    rec = {"id": stadium["id"], "slug": slug, "hits": []}
    if not slug:
        return rec
    for path in PATHS:
        url = f"https://www.milb.com/{slug}{path}"
        status, html = fetch(url)
        if status != 200 or not html:
            continue
        team_tok = stadium["team"].split()[0].lower()
        name_tok = stadium["name"].split()[0].lower()
        if team_tok not in html.lower() and name_tok not in html.lower():
            continue
        prices = []
        for m in PRICE.finditer(html):
            g = [int(x) for x in m.groups() if x]
            prices.append({"text": re.sub(r"\s+", " ", m.group(0))[:160], "nums": g})
        paras = [re.sub(r"\s+", " ", m.group(0)) for m in SECTIONS_PARA.finditer(html)]
        ranges = [(int(a), int(b)) for a, b in RANGE.findall(html) if abs(int(a) - int(b)) <= 40]
        pdfs = sorted(set(PDF.findall(html)))[:6]
        maps = sorted({h for h in MAP_HREF.findall(html) if "schedule" not in h.lower()})[:8]
        if prices or paras or any(abs(b - a) >= 6 for a, b in ranges) or (pdfs and "seating" in path):
            rec["hits"].append(
                {
                    "path": path,
                    "prices": prices[:8],
                    "paras": paras[:4],
                    "ranges": sorted(set(ranges))[:12],
                    "pdfs": pdfs,
                    "maps": maps,
                }
            )
    return rec


def main() -> None:
    already = set(milb.OVERRIDES)
    stadiums = [s for s in milb.parse_stadiums() if s["id"] not in already]
    print(f"price-map harvest {len(stadiums)}", flush=True)
    out = []
    with ThreadPoolExecutor(max_workers=12) as pool:
        futs = {pool.submit(process, s): s for s in stadiums}
        for fut in as_completed(futs):
            rec = fut.result()
            out.append(rec)
            useful = [h for h in rec["hits"] if h["prices"] or h["paras"] or any(abs(b - a) >= 8 for a, b in h["ranges"])]
            if useful:
                print(f"  HIT {rec['id']}", flush=True)
                for h in useful[:3]:
                    print(
                        f"    {h['path']} prices={h['prices'][:3]} paras={h['paras'][:1]} ranges={h['ranges'][:6]}",
                        flush=True,
                    )
    out.sort(key=lambda r: r["id"])
    (ROOT / "tmp/milb-price-maps.json").write_text(json.dumps(out, indent=2))
    hits = [r for r in out if any(h.get("prices") or h.get("paras") for h in r["hits"])]
    print(f"wrote {len(hits)} parks with price/section copy", flush=True)


if __name__ == "__main__":
    main()
