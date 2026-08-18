#!/usr/bin/env python3
"""Pull official section ranges from club FAQ / seating-chart / map pages."""

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
    "/ballpark/faq",
    "/tickets/seating-chart",
    "/ballpark/map",
    "/ballpark/seating-map",
    "/tickets/seating-diagram",
    "/ballpark/information/seating-map",
)
RANGE = re.compile(
    r"(?:sections?|secs?\.?|box(?:es)?|reserved)\s+"
    r"(\d{2,3})\s*(?:-|–|to|&)\s*(\d{2,3})",
    re.I,
)
SINGLE = re.compile(r"(?:section|sec\.?)\s+(\d{2,3})\b", re.I)
HASH = re.compile(
    r"(?:href|src)=[\"']?(?:https?:)?//img\.mlbstatic\.com/milb-images/image/"
    r"(?:upload|private)/[^\s\"']+milb/([a-z0-9]{16,20})\.(?:jpg|png|pdf)",
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
    rec = {"id": stadium["id"], "slug": slug, "pages": [], "ranges": [], "singles": [], "assets": []}
    if not slug:
        return rec
    for path in PATHS:
        url = f"https://www.milb.com/{slug}{path}"
        status, final, html = fetch(url)
        if status != 200 or not html:
            continue
        if stadium["team"].split()[0].lower() not in html.lower() and stadium["name"].split()[0].lower() not in html.lower():
            continue
        ranges = [(int(a), int(b)) for a, b in RANGE.findall(html) if abs(int(b) - int(a)) <= 80]
        singles = [int(n) for n in SINGLE.findall(html) if 1 <= int(n) <= 699]
        assets = HASH.findall(html)
        rec["pages"].append({"url": final, "path": path, "ranges": ranges, "singles": singles[:20], "assets": assets[:6]})
        rec["ranges"].extend(ranges)
        rec["singles"].extend(singles)
        rec["assets"].extend(assets)
    rec["ranges"] = sorted(set(map(tuple, rec["ranges"])))
    rec["singles"] = sorted(set(rec["singles"]))
    rec["assets"] = list(dict.fromkeys(rec["assets"]))
    return rec


def main() -> None:
    have = set(milb.OVERRIDES)
    stadiums = [s for s in milb.parse_stadiums() if s["id"] not in have]
    print(f"faq scrape {len(stadiums)}", flush=True)
    results = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futs = {pool.submit(process, s): s for s in stadiums}
        for fut in as_completed(futs):
            rec = fut.result()
            results.append(rec)
            if rec["ranges"] or len(rec["singles"]) >= 6:
                print(f"  {rec['id']}: ranges={rec['ranges']} singles={rec['singles'][:16]} assets={rec['assets'][:3]}", flush=True)
    results.sort(key=lambda r: r["id"])
    Path("/workspace/tmp/milb-faq-ranges.json").write_text(json.dumps(results, indent=2))
    hits = sum(1 for r in results if r["ranges"] or len(r["singles"]) >= 6)
    print(f"hits={hits}/{len(results)}", flush=True)


if __name__ == "__main__":
    main()
