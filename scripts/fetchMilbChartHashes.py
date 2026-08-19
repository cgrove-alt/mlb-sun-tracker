#!/usr/bin/env python3
"""Pull official milbstatic chart hashes and OCR labeled section numbers."""

from __future__ import annotations

import json
import re
import subprocess
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
DEST = Path("/tmp/milb-hashes")
HASH = re.compile(r"milb/([a-z0-9]{16,20})", re.I)


def fetch(url: str) -> tuple[int | None, str, bytes]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, resp.geturl(), resp.read()
    except Exception:
        return None, url, b""


def ocr(path: Path) -> str:
    try:
        return subprocess.check_output(
            ["tesseract", str(path), "stdout", "--psm", "6"],
            stderr=subprocess.DEVNULL,
            timeout=25,
        ).decode("utf-8", "ignore")
    except Exception:
        return ""


def consecutive_runs(nums: list[int], min_len: int = 5) -> list[list[int]]:
    if not nums:
        return []
    nums = sorted(set(nums))
    runs, run = [], [nums[0]]
    for n in nums[1:]:
        if n == run[-1] + 1:
            run.append(n)
        else:
            if len(run) >= min_len:
                runs.append(run)
            run = [n]
    if len(run) >= min_len:
        runs.append(run)
    return runs


def process(stadium: dict) -> dict:
    slug = milb.SLUGS.get(stadium["id"])
    rec = {"id": stadium["id"], "slug": slug, "hashes": [], "runs": [], "url": None}
    if not slug:
        return rec
    html = b""
    final = ""
    for path in ("/tickets/seating-diagram", "/ballpark/seating-map", "/tickets"):
        status, final_url, body = fetch(f"https://www.milb.com/{slug}{path}")
        if status == 200 and body:
            html = body
            final = final_url
            if "seating" in path:
                break
    rec["url"] = final
    text = html.decode("utf-8", "ignore")
    hashes = []
    for hid in HASH.findall(text):
        if hid not in hashes:
            hashes.append(hid)
    rec["hashes"] = hashes[:8]
    DEST.mkdir(parents=True, exist_ok=True)
    nums: list[int] = []
    for hid in rec["hashes"][:4]:
        for ext in (".png", ".jpg"):
            url = f"https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/{hid}{ext}"
            dest = DEST / f"{stadium['id']}-{hid}{ext}"
            if not dest.exists() or dest.stat().st_size < 2000:
                st, _, body = fetch(url)
                if st == 200 and body and len(body) > 2000 and body[:10] != b"<?xml":
                    dest.write_bytes(body)
            if dest.exists() and dest.stat().st_size > 2000:
                blob = ocr(dest)
                nums.extend(int(n) for n in re.findall(r"\b(\d{2,3})\b", blob) if 1 <= int(n) <= 399)
                break
    rec["runs"] = consecutive_runs(nums)
    rec["n"] = len(set(nums))
    return rec


def main() -> None:
    have = set(json.loads((ROOT / "tmp/milb-official-collect.json").read_text())["parks"])
    have_ids = {p["stadiumId"] if isinstance(p, dict) else p for p in have}
    stadiums = [s for s in milb.parse_stadiums() if s["id"] not in have_ids]
    print(f"hash OCR {len(stadiums)} parks", flush=True)
    results = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = {pool.submit(process, s): s for s in stadiums}
        for fut in as_completed(futs):
            rec = fut.result()
            results.append(rec)
            print(f"  {rec['id']}: hashes={len(rec['hashes'])} runs={rec['runs']}", flush=True)
    (ROOT / "tmp/milb-hash-ocr.json").write_text(json.dumps(results, indent=2))
    print("with_runs", sum(1 for r in results if r["runs"]), "/", len(results))


if __name__ == "__main__":
    main()
