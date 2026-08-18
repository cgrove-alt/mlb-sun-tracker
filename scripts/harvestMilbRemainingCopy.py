#!/usr/bin/env python3
"""Harvest official section-ID copy from remaining MiLB club pages."""

from __future__ import annotations

import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
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
    "/tickets/seasontix",
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
    "/ballpark/information",
)

RANGE = re.compile(
    r"(?:sections?|box(?:es)?|reserved|dugout|field box|infield|outfield|"
    r"home plate|porch|club|premium|value|loge|terrace|grandstand|bleacher|"
    r"wheelchair|accessible|ada)\s+"
    r"(\d{1,3}|[A-Z]{1,2})\s*(?:-|–|to|&amp;|&|/)\s*(\d{1,3}|[A-Z]{1,2})",
    re.I,
)
SNIP = re.compile(
    r".{0,70}(?:section|reserved|dugout|field box|club box|home plate|"
    r"grandstand|loge|terrace|berm|lawn|porch|monster|picnic|bleacher)"
    r".{0,90}",
    re.I,
)
PDF = re.compile(
    r"https?://img\.mlbstatic\.com/milb-images/image/(?:upload|private)/[^\s\"']+\.(?:pdf|jpg|png)",
    re.I,
)


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "noscript"}:
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in {"script", "style", "noscript"} and self.skip:
            self.skip -= 1

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def visible_text(html: str) -> str:
    parser = TextExtractor()
    try:
        parser.feed(html)
    except Exception:
        return re.sub(r"<[^>]+>", " ", html)
    return re.sub(r"\s+", " ", " ".join(parser.parts))


def fetch(url: str) -> tuple[int | None, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=16) as resp:
            return resp.status, resp.read().decode("utf-8", "ignore")
    except Exception:
        return None, ""


def process(stadium_id: str) -> dict:
    slug = milb.SLUGS.get(stadium_id)
    rec = {"id": stadium_id, "hits": []}
    if not slug:
        return rec
    for path in PATHS:
        url = f"https://www.milb.com/{slug}{path}"
        status, html = fetch(url)
        if status != 200 or not html:
            continue
        text = visible_text(html)
        ranges = []
        for a, b in RANGE.findall(text):
            if a.isdigit() and b.isdigit():
                lo, hi = int(a), int(b)
                if 0 < lo <= hi <= 699 and hi - lo <= 50:
                    ranges.append((lo, hi))
            elif a.isalpha() and b.isalpha() and len(a) <= 2 and len(b) <= 2:
                ranges.append((a.upper(), b.upper()))
        snips = []
        for m in SNIP.finditer(text):
            s = re.sub(r"\s+", " ", m.group(0)).strip()
            if re.search(r"\d{2,3}|section [A-Z]\b|sections? [A-Z]", s, re.I):
                snips.append(s[:180])
        pdfs = PDF.findall(html)
        if ranges or pdfs or any(re.search(r"\b(10[0-9]|11[0-9]|20[0-9])\b", s) for s in snips):
            rec["hits"].append(
                {
                    "path": path,
                    "ranges": sorted(set(str(x) for x in ranges))[:16],
                    "snips": snips[:8],
                    "pdfs": pdfs[:3],
                }
            )
    return rec


def main() -> None:
    already = set(milb.OVERRIDES)
    stadiums = [s["id"] for s in milb.parse_stadiums() if s["id"] not in already]
    print(f"remaining harvest {len(stadiums)}", flush=True)
    # Prefer AAA / AA first
    priority = [
        "lehigh-valley-ironpigs",
        "omaha-storm-chasers",
        "rochester-red-wings",
        "scranton-railriders",
        "syracuse-mets",
        "albuquerque-isotopes",
        "el-paso-chihuahuas",
        "reno-aces",
        "round-rock-express",
        "sacramento-river-cats",
        "salt-lake-bees",
        "sugar-land-space-cowboys",
        "tacoma-rainiers",
        "bowling-green-hot-rods",
        "biloxi-shuckers",
        "akron-rubberducks",
        "altoona-curve",
        "binghamton-rumble-ponies",
        "bowie-baysox",
        "hartford-yard-goats",
        "portland-sea-dogs",
        "reading-fightin-phils",
        "chattanooga-lookouts",
        "pensacola-blue-wahoos",
        "knoxville-smokies",
        "amarillo-sod-poodles",
        "arkansas-travelers",
        "corpus-christi-hooks",
        "midland-rockhounds",
        "northwest-arkansas-naturals",
        "san-antonio-missions",
        "springfield-cardinals",
        "tulsa-drillers",
        "wichita-wind-surge",
        "columbus-clingstones",
    ]
    ordered = [s for s in priority if s in stadiums] + [s for s in stadiums if s not in priority]
    with ThreadPoolExecutor(max_workers=10) as pool:
        futs = {pool.submit(process, sid): sid for sid in ordered}
        for fut in as_completed(futs):
            rec = fut.result()
            if rec["hits"]:
                print(f"HIT {rec['id']}", flush=True)
                for hit in rec["hits"]:
                    print(f"  {hit['path']} ranges={hit['ranges']}", flush=True)
                    for snip in hit["snips"][:4]:
                        print(f"    {snip}", flush=True)
                    if hit["pdfs"]:
                        print(f"    pdfs={hit['pdfs']}", flush=True)
            else:
                print(f"MISS {rec['id']}", flush=True)


if __name__ == "__main__":
    main()
