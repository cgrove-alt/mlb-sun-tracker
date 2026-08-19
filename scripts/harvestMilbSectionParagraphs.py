#!/usr/bin/env python3
"""Find official 'Sections X-Y are located' copy on remaining MiLB club pages."""

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
    "/ballpark/a-z-guide",
    "/ballpark/a-z",
    "/ballpark/a-to-z",
    "/ballpark/guide",
    "/ballpark/ballparkguide",
    "/ballpark/fan-guide",
    "/ballpark/information",
    "/tickets/season-tickets",
    "/tickets/season-memberships",
    "/tickets/seatingchart",
    "/tickets/groups",
    "/tickets/group-tickets",
    "/tickets/group-outings",
)
PARA = re.compile(
    r"Sections?\s+\d{1,3}\s*(?:-|–|to|&amp;|&)\s*\d{1,3}[^.|]{0,80}"
    r"(?:located|are on|first base|third base|home plate|behind)",
    re.I,
)
RANGE = re.compile(
    r"(?:sections?|box(?:es)?|reserved|dugout|field)\s+"
    r"(\d{1,3})\s*(?:-|–|to|&amp;|&)\s*(\d{1,3})",
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
    rec = {"id": stadium["id"], "hits": []}
    if not slug:
        return rec
    for path in PATHS:
        url = f"https://www.milb.com/{slug}{path}"
        status, html = fetch(url)
        if status != 200 or not html:
            continue
        paras = [re.sub(r"\s+", " ", m.group(0)) for m in PARA.finditer(html)]
        ranges = [(int(a), int(b)) for a, b in RANGE.findall(html) if abs(int(a) - int(b)) <= 40]
        if paras or (ranges and any(hi - lo >= 8 for lo, hi in ((min(a, b), max(a, b)) for a, b in ranges))):
            rec["hits"].append({"path": path, "paras": paras[:6], "ranges": sorted(set(ranges))[:12]})
    return rec


def main() -> None:
    already = set(milb.OVERRIDES)
    stadiums = [s for s in milb.parse_stadiums() if s["id"] not in already]
    print(f"paragraph harvest {len(stadiums)}", flush=True)
    out = []
    with ThreadPoolExecutor(max_workers=10) as pool:
        futs = {pool.submit(process, s): s for s in stadiums}
        for fut in as_completed(futs):
            rec = fut.result()
            out.append(rec)
            if rec["hits"]:
                print(f"  HIT {rec['id']}", flush=True)
                for h in rec["hits"][:3]:
                    print(f"    {h['path']} ranges={h['ranges']} paras={h['paras'][:2]}", flush=True)
    out.sort(key=lambda r: r["id"])
    (ROOT / "tmp/milb-section-paragraphs.json").write_text(json.dumps(out, indent=2))
    hits = [r for r in out if r["hits"]]
    print(f"wrote {len(hits)} parks with hits", flush=True)


if __name__ == "__main__":
    main()
