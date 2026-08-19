#!/usr/bin/env python3
"""Download official MiLB seating-chart images and OCR labeled section IDs."""

from __future__ import annotations

import json
import re
import subprocess
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/workspace")
OUT_DIR = Path("/tmp/milb-official-charts")
UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    )
}

IMG = re.compile(r"(?:https?:)?//img\.mlbstatic\.com/[^\"'\\]+", re.I)

SLUGS: dict[str, str] = {}
PATHS: tuple[str, ...] = ()


def fetch(url: str) -> tuple[int | None, str, bytes]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, resp.geturl(), resp.read()
    except Exception:
        return None, url, b""


def chart_urls(html: str) -> list[str]:
    urls = []
    for raw in IMG.findall(html):
        url = ("https:" + raw) if raw.startswith("//") else raw
        url = url.replace("\\/", "/")
        if "milb/" not in url:
            continue
        # prefer original / wide cuts over tiny thumbs
        if any(x in url for x in ("t_16x9", "t_w372", "t_w640")):
            url = re.sub(r"/t_[^/]+", "", url)
            url = re.sub(r"/image/(?:private|upload)/", "/image/upload/t_w2208/", url)
        urls.append(url.split("?")[0])
    # forge ids
    for hid in re.findall(r"milb/([a-z0-9]{16,})", html, re.I):
        urls.append(f"https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/{hid}.jpg")
        urls.append(f"https://img.mlbstatic.com/milb-images/image/upload/milb/{hid}.pdf")
    seen, out = set(), []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out[:10]


def ocr_file(path: Path) -> str:
    if path.suffix.lower() == ".pdf":
        try:
            return subprocess.check_output(
                ["pdftotext", "-layout", str(path), "-"],
                stderr=subprocess.DEVNULL,
                timeout=20,
            ).decode("utf-8", "ignore")
        except Exception:
            return ""
    texts = []
    for psm in ("6", "11"):
        try:
            texts.append(
                subprocess.check_output(
                    ["tesseract", str(path), "stdout", "--psm", psm],
                    stderr=subprocess.DEVNULL,
                    timeout=25,
                ).decode("utf-8", "ignore")
            )
        except Exception:
            pass
    return "\n".join(texts)


def numbers(text: str) -> list[int]:
    return sorted({int(n) for n in re.findall(r"\b(\d{2,3})\b", text) if 1 <= int(n) <= 499})


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
    slug = SLUGS.get(stadium["id"])
    rec = {"id": stadium["id"], "slug": slug, "url": None, "assets": [], "runs": [], "nums": []}
    if not slug:
        return rec
    html = ""
    for path in PATHS:
        status, final, body = fetch(f"https://www.milb.com/{slug}{path}")
        if status != 200 or not body:
            continue
        text = body.decode("utf-8", "ignore")
        if stadium["team"].split()[0].lower() not in text.lower() and stadium["name"].split()[0].lower() not in text.lower():
            continue
        rec["url"] = rec["url"] or final
        html = text
        if "seating" in path:
            break
    if not html:
        return rec
    dest_dir = OUT_DIR / stadium["id"]
    dest_dir.mkdir(parents=True, exist_ok=True)
    blob = []
    for i, url in enumerate(chart_urls(html)):
        ext = Path(url).suffix.lower() or ".jpg"
        if ext not in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"}:
            ext = ".jpg"
        dest = dest_dir / f"chart-{i}{ext}"
        if not dest.exists() or dest.stat().st_size < 2000:
            st, _, body = fetch(url)
            if st == 200 and body and len(body) > 2000:
                dest.write_bytes(body)
        if dest.exists() and dest.stat().st_size > 2000:
            rec["assets"].append(str(dest))
            blob.append(ocr_file(dest))
    text = "\n".join(blob)
    rec["nums"] = numbers(text)
    rec["runs"] = consecutive_runs(rec["nums"])
    return rec


def main() -> None:
    import sys
    sys.path.insert(0, str(ROOT / "scripts"))
    import generateMilbOfficialInventories as milb
    global SLUGS, PATHS
    SLUGS = milb.SLUGS
    PATHS = milb.PATHS
    parse_stadiums = milb.parse_stadiums

    stadiums = parse_stadiums()
    missing = json.loads((ROOT / "tmp/milb-official-collect.json").read_text()).get("missing", [])
    want = [s for s in stadiums if s["id"] in set(missing)]
    print(f"OCR pass for {len(want)} parks", flush=True)
    results = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = {pool.submit(process, s): s for s in want}
        for fut in as_completed(futs):
            rec = fut.result()
            results.append(rec)
            print(f"  {rec['id']}: runs={rec['runs']} n={len(rec['nums'])} assets={len(rec['assets'])}", flush=True)
    (ROOT / "tmp/milb-official-ocr.json").write_text(json.dumps(results, indent=2))
    got = sum(1 for r in results if r["runs"])
    print(f"wrote OCR results with_runs={got}/{len(results)}")


if __name__ == "__main__":
    main()
