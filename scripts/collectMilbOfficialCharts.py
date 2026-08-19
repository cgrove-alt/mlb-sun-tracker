#!/usr/bin/env python3
"""Download official MiLB seating-chart images, PDFs, and linked map configs.

Does not invent section IDs. Writes hashes, local files, OCR text, and any
3-D map product lists so inventories can be transcribed from club sources.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import urllib.error
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
OUT_DIR = Path("/tmp/milb-charts")
INDEX = ROOT / "tmp/milb-chart-index.json"
HASH = re.compile(r"milb/([a-z0-9]{16,20})", re.I)
MAP_HOST = re.compile(
    r"https?://[a-z0-9.-]+\.(?:io-media|3ddigitalvenue)\.com[^\s\"'<>]*",
    re.I,
)
PDF = re.compile(r"https?://[^\s\"'<>]+\.pdf", re.I)
IMG = re.compile(
    r"https?://(?:img\.mlbstatic\.com|www\.milbstatic\.com|midfield\.mlbstatic\.com)"
    r"/[^\s\"'<>]+\.(?:jpg|jpeg|png|webp)",
    re.I,
)
PATHS = (
    "/tickets/seating-diagram",
    "/ballpark/seating-map",
    "/tickets/seating-map",
    "/ballpark/information/seating-map",
    "/ballpark/seating-chart",
    "/tickets",
    "/ballpark",
)
IMAGE_TEMPLATES = (
    "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/{hid}.jpg",
    "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/{hid}.png",
    "https://img.mlbstatic.com/milb-images/image/private/t_w2208/milb/{hid}.jpg",
    "https://img.mlbstatic.com/milb-images/image/private/t_w2208/milb/{hid}.png",
    "https://img.mlbstatic.com/milb-images/image/upload/milb/{hid}.jpg",
    "https://img.mlbstatic.com/milb-images/image/private/t_16x9/milb/{hid}.jpg",
)


def fetch(url: str, timeout: float = 20) -> tuple[int | None, str, bytes]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.geturl(), resp.read()
    except urllib.error.HTTPError as exc:
        return exc.code, url, exc.read() if exc.fp else b""
    except Exception:
        return None, url, b""


def ocr_file(path: Path) -> str:
    chunks: list[str] = []
    for psm in ("6", "11"):
        try:
            chunks.append(
                subprocess.check_output(
                    ["tesseract", str(path), "stdout", "--psm", psm],
                    stderr=subprocess.DEVNULL,
                    timeout=30,
                ).decode("utf-8", "ignore")
            )
        except Exception:
            continue
    return "\n".join(chunks)


def unique(items: list[str]) -> list[str]:
    out, seen = [], set()
    for item in items:
        if item and item not in seen:
            seen.add(item)
            out.append(item)
    return out


def save_bytes(dest: Path, body: bytes) -> bool:
    if not body or len(body) < 1500:
        return False
    if body[:5] in {b"<?xml", b"<html", b"<!DOC"} or body[:15].lower().startswith(b"<!doctype"):
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(body)
    return True


def download_hash(hid: str, stadium_id: str) -> list[dict]:
    saved = []
    for url in IMAGE_TEMPLATES:
        resolved = url.format(hid=hid)
        ext = ".png" if resolved.endswith(".png") else ".jpg"
        dest = OUT_DIR / stadium_id / f"{hid}{ext}"
        if dest.exists() and dest.stat().st_size > 2000:
            saved.append({"hash": hid, "path": str(dest), "url": resolved, "bytes": dest.stat().st_size})
            break
        status, _, body = fetch(resolved)
        if status == 200 and save_bytes(dest, body):
            saved.append({"hash": hid, "path": str(dest), "url": resolved, "bytes": dest.stat().st_size})
            break
    return saved


def extract_iomedia_ids(blob: bytes) -> list[str]:
    try:
        data = json.loads(blob.decode("utf-8", "ignore"))
    except Exception:
        return []
    els = (data.get("cmdData") or {}).get("elements") or data.get("elements") or []
    ids = []
    for el in els:
        name = str(el.get("daeName") or el.get("name") or "")
        m = re.search(r"Sub_Section_([^_]+)_", name)
        if m:
            ids.append(m.group(1))
            continue
        if el.get("elementType") in {"section", "Section"} and el.get("id"):
            ids.append(str(el["id"]))
    return unique(ids)


def try_map_hosts(slug: str, stadium_id: str) -> dict:
    hosts = unique(
        [
            f"https://{slug}.io-media.com/web/confignew.json",
            f"https://{stadium_id}.io-media.com/web/confignew.json",
            f"https://{slug.replace('-', '')}.io-media.com/web/confignew.json",
            f"https://{slug}.3ddigitalvenue.com/",
            f"https://preview.3ddigitalvenue.com/{slug}/",
        ]
    )
    found = {"configs": [], "ids": []}
    for url in hosts:
        status, final, body = fetch(url, timeout=12)
        if status != 200 or not body:
            continue
        ids = extract_iomedia_ids(body)
        if ids:
            dest = OUT_DIR / stadium_id / "confignew.json"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(body)
            found["configs"].append(final)
            found["ids"] = ids
            break
    return found


def process(stadium: dict) -> dict:
    slug = milb.SLUGS.get(stadium["id"])
    rec = {
        "id": stadium["id"],
        "name": stadium["name"],
        "team": stadium["team"],
        "orientation": stadium.get("orientation", 0),
        "slug": slug,
        "pages": [],
        "hashes": [],
        "images": [],
        "pdfs": [],
        "mapLinks": [],
        "mapIds": [],
        "ocr": "",
        "officialUrl": None,
    }
    if not slug:
        return rec

    html_blob = ""
    for path in PATHS:
        url = f"https://www.milb.com/{slug}{path}"
        status, final, body = fetch(url)
        rec["pages"].append({"url": final, "status": status, "bytes": len(body)})
        if status != 200 or not body:
            continue
        text = body.decode("utf-8", "ignore")
        team_token = stadium["team"].split()[0].lower()
        name_token = stadium["name"].split()[0].lower()
        if team_token not in text.lower() and name_token not in text.lower():
            continue
        rec["officialUrl"] = rec["officialUrl"] or final
        html_blob += "\n" + text
        if "seating" in path:
            break

    rec["hashes"] = unique(HASH.findall(html_blob))
    rec["mapLinks"] = unique(MAP_HOST.findall(html_blob))
    rec["pdfs"] = unique(PDF.findall(html_blob))[:6]
    extra_imgs = unique(IMG.findall(html_blob))[:8]

    for hid in rec["hashes"][:8]:
        rec["images"].extend(download_hash(hid, stadium["id"]))

    for i, url in enumerate(extra_imgs):
        dest = OUT_DIR / stadium["id"] / f"pageimg-{i}{Path(url.split('?')[0]).suffix or '.jpg'}"
        if dest.exists() and dest.stat().st_size > 2000:
            rec["images"].append({"path": str(dest), "url": url, "bytes": dest.stat().st_size})
            continue
        status, _, body = fetch(url)
        if status == 200 and save_bytes(dest, body):
            rec["images"].append({"path": str(dest), "url": url, "bytes": dest.stat().st_size})

    for i, url in enumerate(rec["pdfs"][:3]):
        dest = OUT_DIR / stadium["id"] / f"chart-{i}.pdf"
        status, _, body = fetch(url)
        if status == 200 and save_bytes(dest, body):
            rec["images"].append({"path": str(dest), "url": url, "bytes": dest.stat().st_size, "kind": "pdf"})

    maps = try_map_hosts(slug, stadium["id"])
    rec["mapLinks"] = unique(rec["mapLinks"] + maps["configs"])
    rec["mapIds"] = maps["ids"]

    texts = []
    for image in rec["images"][:4]:
        path = Path(image["path"])
        if path.suffix.lower() == ".pdf":
            try:
                texts.append(
                    subprocess.check_output(["pdftotext", "-layout", str(path), "-"], timeout=20).decode(
                        "utf-8", "ignore"
                    )
                )
            except Exception:
                texts.append(ocr_file(path))
        else:
            texts.append(ocr_file(path))
    rec["ocr"] = "\n----\n".join(texts)[:4000]
    return rec


def main() -> None:
    # Flush the last stadium object (tampa-tarpons ends without a trailing comma).
    stadiums = milb.parse_stadiums()
    text = (ROOT / "src/data/milbStadiums.ts").read_text()
    if "tampa-tarpons" not in {s["id"] for s in stadiums}:
        last = {"id": "tampa-tarpons", "name": "George M. Steinbrenner Field", "team": "Tampa Tarpons", "orientation": 60}
        stadiums.append(last)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (ROOT / "tmp").mkdir(parents=True, exist_ok=True)
    print(f"collecting {len(stadiums)} MiLB parks", flush=True)
    results = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futs = {pool.submit(process, s): s for s in stadiums}
        for fut in as_completed(futs):
            rec = fut.result()
            results.append(rec)
            print(
                f"  {rec['id']}: hashes={len(rec['hashes'])} images={len(rec['images'])} "
                f"mapIds={len(rec['mapIds'])} url={rec['officialUrl']}",
                flush=True,
            )
    results.sort(key=lambda r: r["id"])
    INDEX.write_text(json.dumps(results, indent=2))
    with_images = sum(1 for r in results if r["images"])
    with_maps = sum(1 for r in results if r["mapIds"])
    print(f"wrote {INDEX} images={with_images} mapIds={with_maps}", flush=True)


if __name__ == "__main__":
    main()
