#!/usr/bin/env python3
"""Download official club seating charts and transcribe labeled section IDs.

Sources, in order:
  1. Club MiLB.com seating-diagram / seating-map / ballpark pages
  2. Official chart images and PDFs hosted on mlbstatic.com
  3. Page FAQ / ticket copy that names numbered ranges and unique products

This script never invents Field-100 clones. Parks with no official chart stay
empty so a later pass can fill them from another club-published asset.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/workspace")
OUT_DIR = Path("/tmp/official-charts")
RESULT = Path("/workspace/tmp/official-section-collect.json")
UA = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; ShadiumSectionAudit/1.0; "
        "+https://theshadium.com)"
    )
}

PAGE_PATHS = (
    "/tickets/seating-diagram",
    "/ballpark/seating-map",
    "/tickets/seating-map",
    "/ballpark/information/seating-map",
    "/ballpark/seating-chart",
    "/tickets/single-game-tickets",
    "/ballpark",
    "/tickets",
)

NAMED_PRODUCT = re.compile(
    r"\b("
    r"Blue Monster|Green Monster|Party Deck|Picnic (?:Area|Pavilion|Patio|Deck)|"
    r"Grass Berm|Berm|Lawn|GA Lawn|General Admission|"
    r"Home Run (?:Porch|Patio|Deck|Hill)|Pool(?: Area| Deck)?|"
    r"Beer Garden|Right Field (?:Pavilion|Porch|Deck)|"
    r"Left Field (?:Pavilion|Porch|Deck)|Center Field (?:Pavilion|Deck|Bar)|"
    r"Dugout (?:Club|Box|Seats)|Club Level|Luxury Suites?|"
    r"Suites? Level|Owner'?s Club|Champions Club|"
    r"Jackie Robinson Deck|Tobacco Road|PNC Triangle Club|"
    r"Bully Hill(?: Party Deck)?|Las Vegas Club|"
    r"Drink Rail|Standing Room|SRO|"
    r"Outfield (?:Reserved|Bleachers|Lawn)|"
    r"Boardwalk|Tiki Deck|Cabana|Hot Tub|"
    r"Skyline (?:Deck|Porch|Club)|Rooftop|"
    r"Family Deck|Kids Zone|Playground"
    r")\b",
    re.I,
)

SECTION_RANGE = re.compile(
    r"(?:sections?|secs?\.?)\s+(\d{2,3})\s*(?:-|–|to|&)\s*(\d{2,3})",
    re.I,
)
SECTION_LIST = re.compile(r"(?:sections?|secs?\.?)\s+(\d{2,3}(?:\s*,\s*\d{2,3}){1,12})", re.I)
BARE_SECTION = re.compile(r"\b(?:section|sec\.?)\s+(\d{2,3})\b", re.I)
IMG_URL = re.compile(
    r"(?:https?:)?//img\.mlbstatic\.com/[^\"'\\]+\.(?:jpg|jpeg|png|gif|webp|pdf)",
    re.I,
)
CHART_HINT = re.compile(r"seat(?:ing)?[-_]?(?:diagram|map|chart)|bowl[-_]?map", re.I)


def parse_stadiums() -> list[dict]:
    text = (ROOT / "src/data/milbStadiums.ts").read_text()
    stadiums = []
    current: dict | None = None
    for line in text.splitlines():
        mid = re.search(r"id:\s*'([^']+)'", line)
        if mid and "venueId" not in line:
            if current and current.get("id") and current.get("name"):
                stadiums.append(current)
            current = {"id": mid.group(1), "league": "MiLB"}
            continue
        if current is None:
            continue
        for key in ("name", "team", "city", "state"):
            m = re.search(rf"{key}:\s*'([^']+)'", line)
            if m:
                current[key] = m.group(1)
        ori = re.search(r"orientation:\s*(\d+)", line)
        if ori:
            current["orientation"] = int(ori.group(1))
        if line.strip() == "}," and current.get("id") and current.get("name"):
            stadiums.append(current)
            current = None
    # de-dupe by id, keep first complete
    seen = set()
    out = []
    for s in stadiums:
        if s["id"] in seen:
            continue
        if not s.get("name") or not s.get("team"):
            continue
        seen.add(s["id"])
        out.append(s)
    return out


def slug_candidates(stadium: dict) -> list[str]:
    team = stadium["team"].lower()
    city = stadium.get("city", "").lower()
    sid = stadium["id"]
    parts = sid.split("-")
    # drop last token if it is the nickname
    nick = parts[-1]
    city_slug = "".join(ch for ch in city if ch.isalnum())
    team_words = re.sub(r"[^a-z0-9\s]", "", team).split()
    joined = "".join(team_words)
    no_spaces = team.replace(" ", "").replace(".", "")
    guesses = [
        sid.replace("-", ""),
        "".join(parts[:-1]) if len(parts) > 1 else sid,
        city_slug,
        team_words[0] if team_words else sid,
        joined,
        no_spaces,
        parts[0],
        "-".join(parts[:-1]) if len(parts) > 1 else sid,
    ]
    extras = {
        "scranton-railriders": ["swb", "railriders", "scranton"],
        "lehigh-valley-ironpigs": ["lehighvalley", "ironpigs", "lvironpigs"],
        "las-vegas-aviators": ["aviators", "lasvegas", "vegas"],
        "st-paul-saints": ["saints", "stpaul", "stp"],
        "st-lucie-mets": ["stlucie", "slu"],
        "new-hampshire-fisher-cats": ["nh", "newhampshire", "fishercats"],
        "northwest-arkansas-naturals": ["nwa", "northwestarkansas", "naturals"],
        "worcester-red-sox": ["worcester", "woo"],
        "oklahoma-city-dodgers": ["oklahomacity", "okc", "comets"],
        "knoxville-smokies": ["knoxville", "tennessee", "smokies"],
        "columbus-clingstones": ["columbusga", "clingstones"],
        "gwinnett-stripers": ["gwinnett", "stripers"],
        "rome-braves": ["rome", "emperors"],
        "bowie-baysox": ["bowie", "chesapeake", "baysox"],
        "salem-red-sox": ["salem", "ridgeyaks"],
        "lynchburg-hillcats": ["lynchburg", "hillcity", "howlers"],
        "carolina-mudcats": ["carolina", "wilson", "warbirds"],
        "inland-empire-66ers": ["inlandempire", "66ers", "ontario"],
        "jersey-shore-blueclaws": ["jerseyshore", "blueclaws"],
        "hudson-valley-renegades": ["hudsonvalley", "renegades"],
        "tri-city-dust-devils": ["tricity", "dustdevils"],
        "quad-cities-river-bandits": ["quadcities", "riverbandits"],
        "west-michigan-whitecaps": ["westmichigan", "whitecaps"],
        "great-lakes-loons": ["greatlakes", "loons"],
        "lake-county-captains": ["lakecounty", "captains"],
        "fort-wayne-tincaps": ["fortwayne", "tincaps"],
        "cedar-rapids-kernels": ["cedarrapids", "kernels"],
        "winston-salem-dash": ["winstonsalem", "dash"],
        "bowling-green-hot-rods": ["bowlinggreen", "hotrods"],
        "rancho-cucamonga-quakes": ["ranchocucamonga", "quakes"],
        "lake-elsinore-storm": ["lakeelsinore", "storm"],
        "san-jose-giants": ["sanjose", "sjgiants"],
        "down-east-wood-ducks": ["downeast", "woodducks"],
        "fort-myers-mighty-mussels": ["fortmyers", "mightymussels"],
        "palm-beach-cardinals": ["palmbeach", "cardinals"],
        "jupiter-hammerheads": ["jupiter", "hammerheads"],
        "rocket-city-trash-pandas": ["rocketcity", "trashpandas"],
        "sugar-land-space-cowboys": ["sugarland", "spacecowboys"],
        "round-rock-express": ["roundrock", "express"],
        "el-paso-chihuahuas": ["elpaso", "chihuahuas"],
        "salt-lake-bees": ["saltlake", "bees"],
        "corpus-christi-hooks": ["corpuschristi", "hooks"],
        "san-antonio-missions": ["sanantonio", "missions"],
        "harrisburg-senators": ["harrisburg", "senators"],
        "binghamton-rumble-ponies": ["binghamton", "rumbleponies"],
        "richmond-flying-squirrels": ["richmond", "flyingsquirrels"],
        "hartford-yard-goats": ["hartford", "yardgoats"],
        "reading-fightin-phils": ["reading", "fightins"],
        "portland-sea-dogs": ["portland", "seadogs"],
        "altoona-curve": ["altoona", "curve"],
        "akron-rubberducks": ["akron", "rubberducks"],
        "erie-seawolves": ["erie", "seawolves"],
        "jacksonville-jumbo-shrimp": ["jacksonville", "jumboshrimp"],
        "indianapolis-indians": ["indianapolis", "indians"],
        "iowa-cubs": ["iowa", "iowacubs"],
        "scranton-railriders": ["swb"],
        "hillsboro-hops": ["hillsboro", "hops"],
        "eugene-emeralds": ["eugene", "emeralds"],
        "everett-aquasox": ["everett", "aquasox"],
        "wisconsin-timber-rattlers": ["wisconsin", "timberrattlers"],
        "south-bend-cubs": ["southbend", "sbcubs"],
        "kannapolis-cannon-ballers": ["kannapolis", "cannonballers"],
        "myrtle-beach-pelicans": ["myrtlebeach", "pelicans"],
        "fredericksburg-nationals": ["fredericksburg", "frednats"],
        "charleston-riverdogs": ["charleston", "riverdogs"],
        "columbia-fireflies": ["columbia", "fireflies"],
        "delmarva-shorebirds": ["delmarva", "shorebirds"],
        "fayetteville-woodpeckers": ["fayetteville", "woodpeckers"],
        "augusta-greenjackets": ["augusta", "greenjackets"],
        "clearwater-threshers": ["clearwater", "threshers"],
        "bradenton-marauders": ["bradenton", "marauders"],
        "daytona-tortugas": ["daytona", "tortugas"],
        "dunedin-blue-jays": ["dunedin", "bluejays"],
        "lakeland-flying-tigers": ["lakeland", "flyingtigers"],
        "tampa-tarpons": ["tampa", "tarpons"],
        "albuquerque-isotopes": ["albuquerque", "isotopes"],
        "sacramento-river-cats": ["sacramento", "rivercats"],
        "tacoma-rainiers": ["tacoma", "rainiers"],
        "reno-aces": ["reno", "aces"],
        "memphis-redbirds": ["memphis", "redbirds"],
        "nashville-sounds": ["nashville", "sounds"],
        "norfolk-tides": ["norfolk", "tides"],
        "omaha-storm-chasers": ["omaha", "stormchasers"],
        "rochester-red-wings": ["rochester", "redwings"],
        "syracuse-mets": ["syracuse", "mets"],
        "toledo-mud-hens": ["toledo", "mudhens"],
        "louisville-bats": ["louisville", "bats"],
        "charlotte-knights": ["charlotte", "knights"],
        "columbus-clippers": ["columbus", "clippers"],
        "durham-bulls": ["durham", "bulls"],
        "buffalo-bisons": ["buffalo", "bisons"],
    }
    guesses.extend(extras.get(sid, []))
    # unique, non-empty, lowercase
    out = []
    for g in guesses:
        g = re.sub(r"[^a-z0-9-]", "", g.lower())
        if g and g not in out and g not in {"the", "a", "of"}:
            out.append(g)
    return out


def http_get(url: str, timeout: float = 20) -> tuple[int | None, str, bytes]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.geturl(), resp.read()
    except urllib.error.HTTPError as e:
        return e.code, url, e.read() if e.fp else b""
    except Exception:
        return None, url, b""


def discover_slug(stadium: dict) -> str | None:
    for slug in slug_candidates(stadium):
        status, final, _ = http_get(f"https://www.milb.com/{slug}", timeout=12)
        if status == 200 and "/404" not in final:
            return slug
    return None


def extract_assets(html: str) -> dict:
    text = html
    images = []
    for raw in IMG_URL.findall(text):
        url = raw if raw.startswith("http") else "https:" + raw
        url = url.replace("\\/", "/")
        if CHART_HINT.search(url) or "milb/" in url:
            images.append(url)
    # also pull forge image ids from escaped JSON
    for m in re.finditer(r"milb/([a-z0-9]{15,})", text, re.I):
        hid = m.group(1)
        images.append(
            f"https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/{hid}.jpg"
        )
        images.append(
            f"https://img.mlbstatic.com/milb-images/image/upload/milb/{hid}.pdf"
        )
    # unique preserve order
    seen = set()
    uniq = []
    for u in images:
        u = u.split("?")[0]
        if u not in seen:
            seen.add(u)
            uniq.append(u)

    ranges = [(int(a), int(b)) for a, b in SECTION_RANGE.findall(text) if abs(int(b) - int(a)) < 80]
    singles = [int(x) for x in BARE_SECTION.findall(text)]
    named = sorted({m.group(0) for m in NAMED_PRODUCT.finditer(text)})
    return {"images": uniq[:20], "ranges": ranges, "singles": singles, "named": named}


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 2000:
        return True
    dest.parent.mkdir(parents=True, exist_ok=True)
    status, _, body = http_get(url, timeout=25)
    if status != 200 or not body or len(body) < 500:
        return False
    dest.write_bytes(body)
    return True


def ocr_file(path: Path) -> str:
    if not path.exists() or path.stat().st_size < 500:
        return ""
    if path.suffix.lower() == ".pdf":
        try:
            txt = subprocess.check_output(
                ["pdftotext", "-layout", str(path), "-"],
                stderr=subprocess.DEVNULL,
                timeout=20,
            ).decode("utf-8", "ignore")
            if len(re.findall(r"\b\d{2,3}\b", txt)) >= 6:
                return txt
        except Exception:
            pass
        ppm = path.with_suffix("")
        try:
            subprocess.check_call(
                ["pdftoppm", "-png", "-r", "140", str(path), str(ppm)],
                stderr=subprocess.DEVNULL,
                timeout=30,
            )
        except Exception:
            return ""
        texts = []
        for img in sorted(path.parent.glob(ppm.name + "*.png"))[:4]:
            texts.append(ocr_image(img))
        return "\n".join(texts)
    return ocr_image(path)


def ocr_image(path: Path) -> str:
    try:
        return subprocess.check_output(
            [
                "tesseract",
                str(path),
                "stdout",
                "--psm",
                "6",
                "-c",
                "tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz -",
            ],
            stderr=subprocess.DEVNULL,
            timeout=25,
        ).decode("utf-8", "ignore")
    except Exception:
        return ""


def numbers_from_text(text: str) -> list[int]:
    nums = [int(n) for n in re.findall(r"\b(\d{2,3})\b", text)]
    # keep plausible baseball/football section numbers
    return sorted({n for n in nums if 1 <= n <= 799})


def collect_one(stadium: dict, slug: str | None) -> dict:
    rec = {
        "id": stadium["id"],
        "name": stadium["name"],
        "team": stadium["team"],
        "orientation": stadium.get("orientation"),
        "slug": slug,
        "officialUrl": None,
        "geometryUrls": [],
        "pageRanges": [],
        "pageSingles": [],
        "pageNamed": [],
        "ocrNumbers": [],
        "ocrNamed": [],
        "ocrTextSample": "",
    }
    if not slug:
        return rec

    pages = []
    for path in PAGE_PATHS:
        url = f"https://www.milb.com/{slug}{path}"
        status, final, body = http_get(url)
        if status != 200 or not body:
            continue
        html = body.decode("utf-8", "ignore")
        extracted = extract_assets(html)
        pages.append({"url": final, **extracted})
        if CHART_HINT.search(path) or extracted["ranges"] or extracted["images"]:
            if rec["officialUrl"] is None:
                rec["officialUrl"] = final
            rec["pageRanges"].extend(extracted["ranges"])
            rec["pageSingles"].extend(extracted["singles"])
            rec["pageNamed"].extend(extracted["named"])
            rec["geometryUrls"].extend(extracted["images"])

    # unique
    rec["pageRanges"] = sorted(set(map(tuple, rec["pageRanges"])))
    rec["pageSingles"] = sorted(set(rec["pageSingles"]))
    rec["pageNamed"] = sorted(set(rec["pageNamed"]))
    seen = set()
    geos = []
    for u in rec["geometryUrls"]:
        if u not in seen:
            seen.add(u)
            geos.append(u)
    rec["geometryUrls"] = geos[:12]
    if rec["officialUrl"] is None and pages:
        rec["officialUrl"] = pages[0]["url"]

    ocr_bits = []
    park_dir = OUT_DIR / stadium["id"]
    for i, url in enumerate(rec["geometryUrls"][:8]):
        ext = Path(url.split("?")[0]).suffix.lower() or ".jpg"
        if ext not in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"}:
            ext = ".jpg"
        dest = park_dir / f"asset-{i}{ext}"
        if download(url, dest):
            text = ocr_file(dest)
            if text.strip():
                ocr_bits.append(text)
    blob = "\n".join(ocr_bits)
    rec["ocrNumbers"] = numbers_from_text(blob)
    rec["ocrNamed"] = sorted({m.group(0) for m in NAMED_PRODUCT.finditer(blob)})
    rec["ocrTextSample"] = blob[:1500]
    return rec


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    RESULT.parent.mkdir(parents=True, exist_ok=True)
    stadiums = parse_stadiums()
    print(f"parsed {len(stadiums)} MiLB stadiums", flush=True)

    slug_map = {}
    print("discovering milb.com slugs...", flush=True)
    with ThreadPoolExecutor(max_workers=8) as pool:
        futs = {pool.submit(discover_slug, s): s for s in stadiums}
        for fut in as_completed(futs):
            s = futs[fut]
            try:
                slug = fut.result()
            except Exception as e:
                slug = None
                print(f"  slug fail {s['id']}: {e}", flush=True)
            slug_map[s["id"]] = slug
            print(f"  {s['id']}: {slug}", flush=True)

    results = []
    print("collecting official charts...", flush=True)
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = {pool.submit(collect_one, s, slug_map.get(s["id"])): s for s in stadiums}
        for fut in as_completed(futs):
            s = futs[fut]
            try:
                rec = fut.result()
            except Exception as e:
                rec = {"id": s["id"], "error": str(e)}
                print(f"  collect fail {s['id']}: {e}", flush=True)
            results.append(rec)
            print(
                f"  {rec.get('id')}: url={rec.get('officialUrl')} "
                f"ocr={len(rec.get('ocrNumbers') or [])} "
                f"ranges={rec.get('pageRanges')}",
                flush=True,
            )

    results.sort(key=lambda r: r.get("id") or "")
    RESULT.write_text(json.dumps({"reviewedOn": "2026-08-18", "parks": results}, indent=2))
    found = sum(1 for r in results if r.get("ocrNumbers") or r.get("pageRanges"))
    slugged = sum(1 for r in results if r.get("slug"))
    print(f"wrote {RESULT} slugs={slugged}/{len(results)} with_ids={found}/{len(results)}")


if __name__ == "__main__":
    main()
