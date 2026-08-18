#!/usr/bin/env python3
"""Build MiLB official inventories from club seating-diagram pages and charts."""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/workspace")
UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    )
}

# Club slugs verified against milb.com (not city-name collisions).
SLUGS = {
    "buffalo-bisons": "buffalo",
    "charlotte-knights": "charlotte-knights",
    "columbus-clippers": "columbus",
    "durham-bulls": "durham",
    "gwinnett-stripers": "gwinnett",
    "indianapolis-indians": "indianapolis",
    "iowa-cubs": "iowa",
    "jacksonville-jumbo-shrimp": "jacksonville",
    "lehigh-valley-ironpigs": "lehigh-valley",
    "louisville-bats": "louisville",
    "memphis-redbirds": "memphis",
    "nashville-sounds": "nashville",
    "norfolk-tides": "norfolk",
    "omaha-storm-chasers": "omaha",
    "rochester-red-wings": "rochester",
    "scranton-railriders": "scranton-wb",
    "st-paul-saints": "st-paul",
    "syracuse-mets": "syracuse",
    "toledo-mud-hens": "toledo",
    "worcester-red-sox": "worcester",
    "albuquerque-isotopes": "albuquerque",
    "el-paso-chihuahuas": "el-paso",
    "las-vegas-aviators": "las-vegas",
    "oklahoma-city-dodgers": "oklahoma-city",
    "reno-aces": "reno",
    "round-rock-express": "round-rock",
    "sacramento-river-cats": "sacramento",
    "salt-lake-bees": "salt-lake",
    "sugar-land-space-cowboys": "sugar-land",
    "tacoma-rainiers": "tacoma",
    "akron-rubberducks": "akron",
    "altoona-curve": "altoona",
    "binghamton-rumble-ponies": "binghamton",
    "bowie-baysox": "bowie",
    "erie-seawolves": "erie",
    "harrisburg-senators": "harrisburg",
    "hartford-yard-goats": "hartford",
    "new-hampshire-fisher-cats": "new-hampshire",
    "portland-sea-dogs": "portland",
    "reading-fightin-phils": "reading",
    "richmond-flying-squirrels": "richmond",
    "somerset-patriots": "somerset",
    "birmingham-barons": "birmingham",
    "biloxi-shuckers": "biloxi",
    "chattanooga-lookouts": "chattanooga",
    "columbus-clingstones": "clingstones",
    "montgomery-biscuits": "montgomery",
    "pensacola-blue-wahoos": "pensacola",
    "rocket-city-trash-pandas": "rocket-city",
    "knoxville-smokies": "knoxville",
    "amarillo-sod-poodles": "amarillo",
    "arkansas-travelers": "arkansas",
    "corpus-christi-hooks": "corpus-christi",
    "frisco-roughriders": "frisco",
    "midland-rockhounds": "midland",
    "northwest-arkansas-naturals": "northwest-arkansas",
    "san-antonio-missions": "san-antonio",
    "springfield-cardinals": "springfield",
    "tulsa-drillers": "tulsa",
    "wichita-wind-surge": "wichita",
    "aberdeen-ironbirds": "aberdeen",
    "asheville-tourists": "asheville",
    "bowling-green-hot-rods": "bowling-green",
    "brooklyn-cyclones": "brooklyn",
    "greensboro-grasshoppers": "greensboro",
    "greenville-drive": "greenville",
    "hickory-crawdads": "hickory",
    "hudson-valley-renegades": "hudson-valley",
    "jersey-shore-blueclaws": "jersey-shore",
    "rome-braves": "rome",
    "wilmington-blue-rocks": "wilmington",
    "winston-salem-dash": "winston-salem",
    "beloit-sky-carp": "beloit",
    "cedar-rapids-kernels": "cedar-rapids",
    "dayton-dragons": "dayton",
    "fort-wayne-tincaps": "fort-wayne",
    "great-lakes-loons": "great-lakes",
    "lake-county-captains": "lake-county",
    "lansing-lugnuts": "lansing",
    "peoria-chiefs": "peoria",
    "quad-cities-river-bandits": "quad-cities",
    "south-bend-cubs": "south-bend",
    "west-michigan-whitecaps": "west-michigan",
    "wisconsin-timber-rattlers": "wisconsin",
    "eugene-emeralds": "eugene",
    "everett-aquasox": "everett",
    "hillsboro-hops": "hillsboro",
    "spokane-indians": "spokane",
    "tri-city-dust-devils": "tri-city-dust-devils",
    "vancouver-canadians": "vancouver",
    "fresno-grizzlies": "fresno",
    "inland-empire-66ers": "inland-empire",
    "lake-elsinore-storm": "lake-elsinore",
    "modesto-nuts": "modesto",
    "rancho-cucamonga-quakes": "rancho-cucamonga",
    "san-jose-giants": "san-jose",
    "stockton-ports": "stockton",
    "visalia-rawhide": "visalia",
    "augusta-greenjackets": "augusta",
    "carolina-mudcats": "carolina",
    "charleston-riverdogs": "charleston",
    "columbia-fireflies": "columbia",
    "delmarva-shorebirds": "delmarva",
    "down-east-wood-ducks": "down-east",
    "fayetteville-woodpeckers": "fayetteville",
    "fredericksburg-nationals": "fredericksburg",
    "kannapolis-cannon-ballers": "kannapolis",
    "lynchburg-hillcats": "lynchburg",
    "myrtle-beach-pelicans": "myrtle-beach",
    "salem-red-sox": "salem",
    "bradenton-marauders": "bradenton",
    "clearwater-threshers": "clearwater",
    "daytona-tortugas": "daytona",
    "dunedin-blue-jays": "dunedin",
    "fort-myers-mighty-mussels": "fort-myers",
    "jupiter-hammerheads": "jupiter",
    "lakeland-flying-tigers": "lakeland",
    "palm-beach-cardinals": "jupiter",
    "st-lucie-mets": "st-lucie",
    "tampa-tarpons": "tampa",
}

PATHS = (
    "/tickets/seating-diagram",
    "/ballpark/seating-map",
    "/tickets/seating-map",
    "/ballpark/information/seating-map",
    "/tickets",
)

NAMED = re.compile(
    r"\b("
    r"Blue Monster|Green Monster|Party Deck|Picnic (?:Area|Pavilion|Patio|Deck)|"
    r"Grass Berm|Berm|Home Run (?:Porch|Patio|Deck|Hill)|"
    r"Pool(?: Area| Deck)?|Beer Garden|Right Field (?:Pavilion|Porch|Deck)|"
    r"Left Field (?:Pavilion|Porch|Deck)|Dugout (?:Club|Box)|"
    r"Jackie Robinson Deck|Tobacco Road|PNC Triangle Club|"
    r"Bully Hill(?: Party Deck)?|Las Vegas Club|Home Run Porch|"
    r"Tiki (?:Deck|Bar)|Cabana|Hot Tub|Drink Rail|"
    r"Skyline (?:Deck|Porch|Club)|Family Deck|Boardwalk|"
    r"Funnville|Kids Zone"
    r")\b",
    re.I,
)
RANGE = re.compile(r"(?:sections?|secs?\.?)\s+(\d{2,3})\s*(?:-|–|to)\s*(\d{2,3})", re.I)
BARE = re.compile(r"(?:section|sec\.?)\s+(\d{2,3})\b", re.I)


def parse_stadiums() -> list[dict]:
    text = (ROOT / "src/data/milbStadiums.ts").read_text()
    out, cur = [], None
    for line in text.splitlines():
        mid = re.search(r"id:\s*'([^']+)'", line)
        if mid and "venueId" not in line:
            if cur and cur.get("name"):
                out.append(cur)
            cur = {"id": mid.group(1)}
            continue
        if not cur:
            continue
        for key in ("name", "team"):
            m = re.search(rf"{key}:\s*'([^']+)'", line)
            if m:
                cur[key] = m.group(1)
        ori = re.search(r"orientation:\s*(\d+)", line)
        if ori:
            cur["orientation"] = int(ori.group(1))
        if line.strip() == "}," and cur.get("name"):
            out.append(cur)
            cur = None
    if cur and cur.get("name") and cur.get("id"):
        out.append(cur)
    seen, uniq = set(), []
    for s in out:
        if s["id"] in seen or not s.get("team"):
            continue
        seen.add(s["id"])
        uniq.append(s)
    return uniq


def fetch(url: str) -> tuple[int | None, str, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=18) as resp:
            return resp.status, resp.geturl(), resp.read().decode("utf-8", "ignore")
    except Exception:
        return None, url, ""


def expand_ranges(ranges: list[tuple[int, int]]) -> list[str]:
    ids: list[int] = []
    for a, b in ranges:
        lo, hi = (a, b) if a <= b else (b, a)
        if hi - lo > 80 or hi > 799:
            continue
        ids.extend(range(lo, hi + 1))
    return [str(n) for n in sorted(set(ids))]


def consecutive_runs(nums: list[int], min_len: int = 6) -> list[list[int]]:
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


def collect(stadium: dict) -> dict:
    slug = SLUGS.get(stadium["id"])
    rec = {
        "stadiumId": stadium["id"],
        "name": stadium["name"],
        "team": stadium["team"],
        "orientation": stadium.get("orientation", 0),
        "slug": slug,
        "officialUrl": None,
        "ranges": [],
        "named": [],
        "verified": False,
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
        rec["verified"] = True
        rec["officialUrl"] = rec["officialUrl"] or final
        rec["ranges"].extend((int(a), int(b)) for a, b in RANGE.findall(html))
        rec["named"].extend(m.group(0) for m in NAMED.finditer(html))
        singles = [int(n) for n in BARE.findall(html)]
        for run in consecutive_runs(singles, 8):
            rec["ranges"].append((run[0], run[-1]))
        if "seating" in path or rec["ranges"] or rec["named"]:
            break
    rec["named"] = sorted(set(rec["named"]))
    rec["ranges"] = sorted(set(map(tuple, rec["ranges"])))
    return rec


# Hand-transcribed from club-published charts / FAQs. These win over page regex.
OVERRIDES = {
    "buffalo-bisons": {
        "officialUrl": "https://www.milb.com/buffalo/tickets/seating-diagram",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/private/t_w2208/milb/f90jhubwo9m6lmshtxpw.jpg",
        "notes": "Sahlen Field official 3-D diagram: 100-126 and 128 in the lower horseshoe, 201-222 under the roof, Bully Hill Party Deck past 128. FAQ reserved 100-120 / accessible 123-124 is a ticket-product subset of the same chart.",
        "bands": [
            {"ids": [str(n) for n in list(range(100, 127)) + [128]], "level": "lower", "namePrefix": "Reserved"},
            {"ids": [str(n) for n in range(201, 223)], "level": "upper", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
        ],
        "named": [{"id": "bully-hill-party-deck", "name": "Bully Hill Party Deck", "level": "club", "compassOffset": 90, "span": 16}],
    },
    "durham-bulls": {
        "officialUrl": "https://www.milb.com/durham/ballpark/seating-map",
        "notes": "Club seating map + DBAP products: 100-level horseshoe, even 200s, Blue Monster.",
        "bands": [
            {"ids": [str(n) for n in list(range(100, 111)) + list(range(113, 119))], "level": "lower", "namePrefix": "Section"},
            {"ids": ["202", "204", "206", "208", "210"], "level": "upper", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
        ],
        "named": [
            {"id": "blue-monster", "name": "Blue Monster", "level": "club", "compassOffset": 270, "span": 18},
            {"id": "pnc-triangle-club", "name": "PNC Triangle Club", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "jackie-robinson-deck", "name": "Jackie Robinson Deck", "level": "standing", "compassOffset": 20, "span": 20},
        ],
    },
    "las-vegas-aviators": {
        "officialUrl": "https://www.milb.com/las-vegas/tickets",
        "notes": "Las Vegas Ballpark official products: 101-117 field, pool, berm, Home Run Porch, Las Vegas Club.",
        "bands": [
            {"ids": [str(n) for n in range(101, 118)], "level": "field", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "pool-area", "name": "Pool Area", "level": "club", "compassOffset": 20, "span": 16},
            {"id": "las-vegas-berm", "name": "Grass Berm", "level": "standing", "compassOffset": 0, "span": 28},
            {"id": "las-vegas-home-run-porch", "name": "Home Run Porch", "level": "standing", "compassOffset": 40, "span": 18},
            {"id": "las-vegas-club", "name": "Las Vegas Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "las-vegas-party-deck", "name": "Party Deck", "level": "club", "compassOffset": 90, "span": 14},
        ],
    },
    "jacksonville-jumbo-shrimp": {
        "officialUrl": "https://www.milb.com/jacksonville/tickets",
        "notes": "Club ticket page lists 102-113 and 118-120 as published reserved products.",
        "bands": [
            {"ids": [str(n) for n in list(range(102, 114)) + list(range(118, 121))], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [],
    },
    "norfolk-tides": {
        "officialUrl": "https://www.milb.com/norfolk/tickets",
        "notes": "Harbor Park club page publishes reserved 200-223.",
        "bands": [
            {"ids": [str(n) for n in range(200, 224)], "level": "upper", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
        ],
        "named": [],
    },
    "erie-seawolves": {
        "officialUrl": "https://www.milb.com/erie/tickets",
        "notes": "UPMC Park club tickets page publishes reserved 102-117 and club 201-211 plus the Party Deck.",
        "bands": [
            {"ids": [str(n) for n in range(102, 118)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(201, 212)], "level": "club", "namePrefix": "Club"},
        ],
        "named": [{"id": "erie-party-deck", "name": "Party Deck", "level": "club", "compassOffset": 90, "span": 14}],
    },
    "oklahoma-city-dodgers": {
        "officialUrl": "https://www.milb.com/oklahoma-city/ballpark/seating-map",
        "notes": "Chickasaw Bricktown seating map: Home Plate 108-112, Dugout 104-107 and 113-116, Field 100-103 and 117-120, Terrace 200-203, Lawn.",
        "bands": [
            {"ids": [str(n) for n in range(100, 121)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(200, 204)], "level": "club", "namePrefix": "Terrace", "startOffset": 80, "endOffset": 280},
        ],
        "named": [{"id": "oklahoma-city-lawn", "name": "Lawn", "level": "standing", "compassOffset": 0, "span": 28}],
    },
    "toledo-mud-hens": {
        "officialUrl": "https://www.milb.com/toledo/ballpark/seating-map",
        "notes": "Fifth Third Field official seating-map section views: 101-119, Home Run Terrace 120-122, club 201-219.",
        "bands": [
            {"ids": [str(n) for n in range(101, 120)], "level": "lower", "namePrefix": "Section"},
            {"ids": ["120", "121", "122"], "level": "field", "namePrefix": "Home Run Terrace", "startOffset": 40, "endOffset": 80},
            {"ids": [str(n) for n in range(201, 220)], "level": "club", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
        ],
        "named": [],
    },
    "dayton-dragons": {
        "officialUrl": "https://www.milb.com/dayton/ballpark/seatingchart",
        "notes": "Day Air Ballpark official section-view chart: reserved 104-116, club 201-210, Lawn A and Lawn D. 101-103 are not published on the club page.",
        "bands": [
            {"ids": [str(n) for n in range(104, 117)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(201, 211)], "level": "club", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
        ],
        "named": [
            {"id": "lawn-a", "name": "Lawn A", "level": "standing", "compassOffset": 20, "span": 16},
            {"id": "lawn-d", "name": "Lawn D", "level": "standing", "compassOffset": 340, "span": 16},
        ],
    },
    "frisco-roughriders": {
        "officialUrl": "https://www.milb.com/frisco/tickets",
        "notes": "Riders Field club page publishes 100-103, 105-108, and 109-118.",
        "bands": [
            {"ids": [str(n) for n in list(range(100, 104)) + list(range(105, 119))], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [],
    },
    "charlotte-knights": {
        "officialUrl": "https://www.milb.com/charlotte-knights/tickets/season-memberships",
        "notes": "Truist Field season-membership and group pages: Field Box 101-108 and 114-122, Home Plate Club 109-113, club 202-205, Home Run HR1-HR7, Home Run Porch SRO.",
        "bands": [
            {"ids": [str(n) for n in range(101, 123)], "level": "lower", "namePrefix": "Section"},
            {"ids": ["202", "203", "204", "205"], "level": "club", "namePrefix": "Club", "startOffset": 160, "endOffset": 200},
            {"ids": ["HR1", "HR2", "HR3", "HR4", "HR5", "HR6", "HR7"], "level": "field", "namePrefix": "Home Run", "startOffset": 20, "endOffset": 70},
        ],
        "named": [
            {"id": "charlotte-home-run-porch", "name": "Home Run Porch", "level": "standing", "compassOffset": 0, "span": 20},
            {"id": "budweiser-home-plate-club", "name": "Budweiser Home Plate Club", "level": "club", "compassOffset": 180, "span": 14},
        ],
    },
    "gwinnett-stripers": {
        "officialUrl": "https://www.milb.com/gwinnett/ballpark/seating-map",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/milb/uwaomcxntbcjpi8nmwgt.pdf",
        "notes": "Gwinnett Field official seating PDF: Homeplate Club 1-7, reserve 100-102, infield 103-106, dugout 107-114, RF 115/117/119/121, LF 116/118/120/122, suites 1-19, Super Suite, berm, party docks, Coca-Cola Front Porch.",
        "bands": [
            {"ids": ["1", "2", "3", "4", "5", "6", "7"], "level": "field", "namePrefix": "Homeplate Club"},
            {"ids": [str(n) for n in range(100, 123)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "the-berm", "name": "The Berm", "level": "standing", "compassOffset": 0, "span": 40},
            {"id": "first-base-party-dock", "name": "First Base Party Dock", "level": "club", "compassOffset": 40, "span": 12},
            {"id": "third-base-party-dock", "name": "Third Base Party Dock", "level": "club", "compassOffset": 250, "span": 12},
            {"id": "coca-cola-front-porch", "name": "Coca-Cola Front Porch", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "super-suite", "name": "Super Suite", "level": "suite", "compassOffset": 50, "span": 10},
        ],
    },
    "columbus-clippers": {
        "officialUrl": "https://www.milb.com/columbus/ballpark/a-z-guide",
        "notes": "Huntington Park A-Z guide: reserved 1-3 and 21-25, box 4-9 and 15-20, home/club 10-14, bleachers 27-31, Loge A-E. Picnic terrace sits in the published gap at 26.",
        "bands": [
            {"ids": [str(n) for n in list(range(1, 26)) + list(range(27, 32))], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "loge-a", "name": "Loge A", "level": "club", "compassOffset": 170, "span": 8},
            {"id": "loge-b", "name": "Loge B", "level": "club", "compassOffset": 178, "span": 8},
            {"id": "loge-c", "name": "Loge C", "level": "club", "compassOffset": 186, "span": 8},
            {"id": "loge-d", "name": "Loge D", "level": "club", "compassOffset": 194, "span": 8},
            {"id": "loge-e", "name": "Loge E", "level": "club", "compassOffset": 202, "span": 8},
            {"id": "tansky-club", "name": "Tansky Club", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "aep-power-pavilion", "name": "AEP Power Pavilion", "level": "standing", "compassOffset": 270, "span": 16},
            {"id": "picnic-terrace", "name": "Picnic Terrace", "level": "standing", "compassOffset": 250, "span": 14},
            {"id": "pedialyte-porch", "name": "Pedialyte Porch", "level": "standing", "compassOffset": 40, "span": 14},
        ],
    },
    "worcester-red-sox": {
        "officialUrl": "https://www.milb.com/worcester/ballpark/accessibility",
        "notes": "Polar Park accessibility + fan guide list field 2-6, 8-13, 16; Worcester Wall 101; DCU Club 202, 206, 207; UDG Berm. Other numbered products are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["2", "3", "4", "5", "6", "8", "9", "10", "11", "12", "13", "16"], "level": "field", "namePrefix": "Section"},
            {"ids": ["101"], "level": "lower", "namePrefix": "Worcester Wall", "startOffset": 250, "endOffset": 270},
            {"ids": ["202", "206", "207"], "level": "club", "namePrefix": "DCU Club", "startOffset": 160, "endOffset": 210},
        ],
        "named": [
            {"id": "udg-berm", "name": "University Dental Group Berm", "level": "standing", "compassOffset": 0, "span": 28},
        ],
    },
    "indianapolis-indians": {
        "officialUrl": "https://www.milb.com/indianapolis/ballpark/faq",
        "notes": "Victory Field FAQ publishes box 105-119 (last four rows shade first on the 3B side). Pricing page adds Lawn, The Landing, Elements Financial Club, and Knot Hole. Reserved IDs outside 105-119 are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": [str(n) for n in range(105, 120)], "level": "lower", "namePrefix": "Box"},
        ],
        "named": [
            {"id": "indianapolis-lawn", "name": "Lawn", "level": "standing", "compassOffset": 0, "span": 40},
            {"id": "the-landing", "name": "The Landing", "level": "club", "compassOffset": 40, "span": 14},
            {"id": "elements-financial-club", "name": "Elements Financial Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "knot-hole-gang", "name": "Knot Hole Gang", "level": "standing", "compassOffset": 270, "span": 12},
        ],
    },
    "somerset-patriots": {
        "officialUrl": "https://www.milb.com/somerset/tickets",
        "notes": "TD Bank Ballpark club page publishes 101-122 and 201-218 plus standing room.",
        "bands": [
            {"ids": [str(n) for n in range(101, 123)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(201, 219)], "level": "upper", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
        ],
        "named": [{"id": "standing-room", "name": "Standing Room", "level": "standing", "compassOffset": 20, "span": 16}],
    },
    "montgomery-biscuits": {
        "officialUrl": "https://www.milb.com/montgomery/tickets",
        "notes": "Montgomery Riverwalk Stadium club page publishes reserved 101-117 and the Outfield Lawn.",
        "bands": [
            {"ids": [str(n) for n in range(101, 118)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [{"id": "outfield-lawn", "name": "Outfield Lawn", "level": "standing", "compassOffset": 0, "span": 30}],
    },
    "salem-red-sox": {
        "officialUrl": "https://www.milb.com/salem/tickets",
        "notes": "Salem Memorial Ballpark club page publishes 101-105 and 113-117 plus the Green Monster.",
        "bands": [
            {"ids": [str(n) for n in list(range(101, 106)) + list(range(113, 118))], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [{"id": "green-monster", "name": "Green Monster", "level": "club", "compassOffset": 270, "span": 18}],
    },
    "louisville-bats": {
        "officialUrl": "https://www.milb.com/louisville/tickets/seatingchart",
        "notes": "Louisville Slugger Field official pricing chart: Backstop 1-2, RF reserved 105-108, away dugout 109-111, home plate 112-118, home dugout 119-123, LF reserved 124-136, club 208-224. 101-104 are not published.",
        "bands": [
            {"ids": ["1", "2"], "level": "field", "namePrefix": "Backstop", "startOffset": 172, "endOffset": 188},
            {"ids": [str(n) for n in range(105, 137)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(208, 225)], "level": "club", "namePrefix": "Club", "startOffset": 74, "endOffset": 286},
        ],
        "named": [],
    },
    "nashville-sounds": {
        "officialUrl": "https://www.milb.com/nashville/ballpark/ballparkguide",
        "notes": "First Horizon Park A-Z: reserved 100-110 on 3B, 111-115 behind home (netted), 116-124 on 1B. ADA also publishes club 206. Grass berm plus Coors Light Home Run Porch and Vanderbilt Health Picnic Place. Club 207-210 is not invented.",
        "bands": [
            {"ids": [str(n) for n in range(100, 125)], "level": "lower", "namePrefix": "Section"},
            {"ids": ["206"], "level": "club", "namePrefix": "Club", "startOffset": 176, "endOffset": 184},
        ],
        "named": [
            {"id": "nashville-grass-berm", "name": "Grass Berm", "level": "standing", "compassOffset": 0, "span": 28},
            {"id": "nashville-home-run-porch", "name": "Coors Light Home Run Porch", "level": "standing", "compassOffset": 40, "span": 16},
            {"id": "vanderbilt-health-picnic-place", "name": "Vanderbilt Health Picnic Place", "level": "standing", "compassOffset": 320, "span": 16},
        ],
    },
    "st-paul-saints": {
        "officialUrl": "https://www.milb.com/st-paul/tickets/season-ticket-memberships",
        "geometryUrl": "https://issuu.com/stpaulsaints/docs/2025_chs_field_seating_map",
        "notes": "CHS Field season memberships: Outfield 101-102 and 116-118, Infield 103-104 and 114-115, Dugout 105-106 and 112-113, Home Plate Reserved 107-111. Premium: Capitol Box and Securian Financial Club. Suite numbers are not invented.",
        "bands": [
            {"ids": [str(n) for n in range(101, 119)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "st-paul-capitol-box", "name": "Capitol Box", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "securian-financial-club", "name": "Securian Financial Club", "level": "club", "compassOffset": 180, "span": 14},
        ],
    },
    "iowa-cubs": {
        "officialUrl": "https://www.milb.com/iowa/tickets/season-tickets",
        "notes": "Principal Park official products: Diamond Flex lower A-Z; Diamond F-T and Bullpen AA/D/E/U-X are ticket-product subsets of that lettered field; Reserved Grandstand 4-16; Upper Diamond 10 and Upper Home Dugout 6; Club Box AA-B and W-ZZ. Club-box letters are prefixed so they do not collide with field letters.",
        "bands": [
            {"ids": [chr(c) for c in range(ord("A"), ord("Z") + 1)] + ["AA"], "level": "field", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(4, 17)], "level": "lower", "namePrefix": "Reserved Grandstand", "startOffset": 74, "endOffset": 286},
            {"ids": ["iowa-upper-6", "iowa-upper-10"], "level": "upper", "namePrefix": "Upper", "startOffset": 160, "endOffset": 200},
            {
                "ids": ["iowa-club-AA", "iowa-club-A", "iowa-club-B", "iowa-club-W", "iowa-club-X", "iowa-club-Y", "iowa-club-Z", "iowa-club-ZZ"],
                "level": "club",
                "namePrefix": "Club Box",
                "startOffset": 150,
                "endOffset": 210,
            },
        ],
        "named": [],
    },
    "memphis-redbirds": {
        "officialUrl": "https://www.milb.com/memphis/tickets/flex-plans",
        "notes": "AutoZone Park official products: A-Z landmark Section 100, Dugout Flex 101-112, Ballpark Pass 114-115, Coors Light Chill Zone 213/215/217/219. Left and right Bluffs, Party Deck, and Owner's Seats. Other 100/200 IDs are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["100"] + [str(n) for n in range(101, 113)] + ["114", "115"], "level": "lower", "namePrefix": "Section"},
            {"ids": ["213", "215", "217", "219"], "level": "club", "namePrefix": "Chill Zone", "startOffset": 40, "endOffset": 80},
        ],
        "named": [
            {"id": "memphis-left-bluff", "name": "Left Field Bluff", "level": "standing", "compassOffset": 300, "span": 18},
            {"id": "memphis-right-bluff", "name": "Right Field Bluff", "level": "standing", "compassOffset": 60, "span": 18},
            {"id": "memphis-party-deck", "name": "Party Deck", "level": "club", "compassOffset": 90, "span": 14},
            {"id": "memphis-owners-seats", "name": "Owner's Seats", "level": "club", "compassOffset": 180, "span": 10},
        ],
    },
    "birmingham-barons": {
        "officialUrl": "https://www.milb.com/birmingham/tickets/season-tickets",
        "notes": "Regions Field season-ticket copy: Baseline Box 101-102 and 114-119, Dugout Premium 103-105 and 111-113, Field Reserved 106-110. Batter's Box and Pearl Club are named products. Numbers outside 101-119 are not invented.",
        "bands": [
            {"ids": [str(n) for n in range(101, 120)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "birmingham-batters-box", "name": "Batter's Box", "level": "club", "compassOffset": 180, "span": 10},
            {"id": "pearl-club", "name": "Pearl Club", "level": "club", "compassOffset": 180, "span": 14},
        ],
    },
    "richmond-flying-squirrels": {
        "officialUrl": "https://www.milb.com/richmond/ballpark/a-z",
        "notes": "CarMax Park A-Z: drink-rail seats at the top of reserved 101-118. Knot Hole bleachers, Bon Secours Lawn, Legacy Club, The Patio past 101, and The Yard Club.",
        "bands": [
            {"ids": [str(n) for n in range(101, 119)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "richmond-knot-hole", "name": "The Knot Hole", "level": "standing", "compassOffset": 0, "span": 20},
            {"id": "richmond-lawn", "name": "Bon Secours Lawn", "level": "standing", "compassOffset": 20, "span": 18},
            {"id": "richmond-legacy-club", "name": "Legacy Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "richmond-patio", "name": "The Patio", "level": "club", "compassOffset": 250, "span": 12},
            {"id": "richmond-yard-club", "name": "The Yard Club", "level": "club", "compassOffset": 40, "span": 10},
        ],
    },
    "rocket-city-trash-pandas": {
        "officialUrl": "https://www.milb.com/rocket-city/ballpark/guide",
        "notes": "Toyota Field A-Z SECTIONS: 1-5 first base, 6-10 home (netted), 11-18 third base. ADA also publishes club 22 and 26. Rock Porch, Berm, SportsMED Stadium Club, and Four Tops. 19-21 and 23-25 are not invented.",
        "bands": [
            {"ids": [str(n) for n in range(1, 19)], "level": "lower", "namePrefix": "Section"},
            {"ids": ["22", "26"], "level": "club", "namePrefix": "Club", "startOffset": 160, "endOffset": 200},
        ],
        "named": [
            {"id": "rocket-city-berm", "name": "Berm", "level": "standing", "compassOffset": 0, "span": 28},
            {"id": "rock-porch", "name": "Rock Porch", "level": "standing", "compassOffset": 40, "span": 16},
            {"id": "sportsmed-stadium-club", "name": "SportsMED Stadium Club", "level": "club", "compassOffset": 150, "span": 14},
            {"id": "rocket-city-four-tops", "name": "Four Tops", "level": "club", "compassOffset": 90, "span": 12},
        ],
    },
    "new-hampshire-fisher-cats": {
        "officialUrl": "https://www.milb.com/new-hampshire/tickets/group-outings",
        "notes": "Delta Dental Stadium group pricing publishes reserved 102, 103-104/114-115, 105-106/112-113, and 107-111. Section 101 and IDs past 115 are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": [str(n) for n in range(102, 116)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [],
    },
    "greenville-drive": {
        "officialUrl": "https://www.milb.com/greenville/ballpark/ticketpricesandballparkmap",
        "notes": "Fluor Field official price map: Reserved 101-102 and 114-115, Dugout 103-106 and 110-113, Home Plate 107-109, Pesky's Porch 116-120, Green Monster, Sam Adams Deck, Lawn & Deck.",
        "bands": [
            {"ids": [str(n) for n in range(101, 121)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "greenville-green-monster", "name": "Green Monster", "level": "club", "compassOffset": 270, "span": 18},
            {"id": "sam-adams-deck", "name": "Sam Adams Deck", "level": "club", "compassOffset": 40, "span": 14},
            {"id": "greenville-lawn", "name": "Lawn & Deck", "level": "standing", "compassOffset": 0, "span": 24},
        ],
    },
    "asheville-tourists": {
        "officialUrl": "https://www.milb.com/asheville/tickets",
        "notes": "HomeTrust Park official ticket products: Premium Box A-S. Corner Reserves, Reserves, Press Row, and Bojangles Dugout Suites are published as named products without numbered IDs. Numbered reserved IDs are not invented.",
        "bands": [
            {"ids": [chr(c) for c in range(ord("A"), ord("S") + 1)], "level": "field", "namePrefix": "Premium Box"},
        ],
        "named": [
            {"id": "asheville-corner-reserves", "name": "Corner Reserves", "level": "lower", "compassOffset": 40, "span": 16},
            {"id": "asheville-reserves", "name": "Reserves", "level": "lower", "compassOffset": 320, "span": 16},
            {"id": "asheville-press-row", "name": "Press Row", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "bojangles-dugout-suites", "name": "Bojangles Dugout Suites", "level": "suite", "compassOffset": 90, "span": 14},
        ],
    },
    "brooklyn-cyclones": {
        "officialUrl": "https://www.milb.com/brooklyn/tickets/seasontix",
        "notes": "Maimonides Park season memberships publish reserved 1-16. Beach Club sits at the top of 1-2, The Stoop is rows A-B in 1-4, and The Dugout is rows A-B in section 7. The Backyard is a group product.",
        "bands": [
            {"ids": [str(n) for n in range(1, 17)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "brooklyn-beach-club", "name": "The Beach Club", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "brooklyn-stoop", "name": "The Stoop", "level": "club", "compassOffset": 180, "span": 10},
            {"id": "brooklyn-dugout", "name": "The Dugout", "level": "field", "compassOffset": 90, "span": 8},
            {"id": "brooklyn-backyard", "name": "The Backyard", "level": "standing", "compassOffset": 0, "span": 18},
        ],
    },
    "harrisburg-senators": {
        "officialUrl": "https://www.milb.com/harrisburg/tickets/groups",
        "notes": "FNB Field official group table: Ollie's 101-102 and 401-404, Box 103-104, Dugout 105-107 and 110-112, Club 108-109, Field Box 113-115, Scoreboard Bar 201-207 and 411-413, LB Smith Value 301-304. Other 200/300/400 IDs are not invented.",
        "bands": [
            {"ids": [str(n) for n in range(101, 116)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(201, 208)], "level": "club", "namePrefix": "Scoreboard Bar", "startOffset": 74, "endOffset": 286},
            {"ids": ["301", "302", "303", "304"], "level": "upper", "namePrefix": "LB Smith Value", "startOffset": 40, "endOffset": 80},
            {"ids": ["401", "402", "403", "404", "411", "412", "413"], "level": "upper", "namePrefix": "Section", "startOffset": 250, "endOffset": 310},
        ],
        "named": [],
    },
    "fort-wayne-tincaps": {
        "officialUrl": "https://www.milb.com/fort-wayne/ballpark/a-z",
        "notes": "Parkview Field A-Z publishes wheelchair spaces in 101, 102, 105-107, 111, 113, 117, and club 201, plus water fountains at 101 and 112. Ticket page adds Ruoff lawns, Home Run Porch, and Diamond View. Other 100/200 IDs are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["101", "102", "105", "106", "107", "111", "112", "113", "117"], "level": "lower", "namePrefix": "Section"},
            {"ids": ["201"], "level": "club", "namePrefix": "Section", "startOffset": 176, "endOffset": 184},
        ],
        "named": [
            {"id": "fort-wayne-lawn", "name": "Ruoff Home Mortgage Lawn", "level": "standing", "compassOffset": 0, "span": 28},
            {"id": "rohrman-home-run-porch", "name": "Rohrman Automotive Group Home Run Porch", "level": "standing", "compassOffset": 270, "span": 16},
            {"id": "paul-davis-diamond-view", "name": "Paul Davis Diamond View", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "nucor-all-star", "name": "NUCOR All-Star", "level": "field", "compassOffset": 180, "span": 16},
        ],
    },
    "bowling-green-hot-rods": {
        "officialUrl": "https://www.milb.com/bowling-green/ballpark/a-to-z",
        "notes": "Bowling Green Ballpark A-Z ticket copy: Reserved 101-107 and 113-121, Premium Reserved 108-112, Performance Foodservice / Stadium Club on the suite level, and the grass berm past 101. Numbers outside 101-121 are not invented.",
        "bands": [
            {"ids": [str(n) for n in range(101, 122)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "bowling-green-club", "name": "Performance Foodservice Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "bowling-green-berm", "name": "Grass Berm", "level": "standing", "compassOffset": 20, "span": 18},
        ],
    },
    "sacramento-river-cats": {
        "officialUrl": "https://www.milb.com/sacramento/tickets",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/milb/p9wkmenj9geqnkpbortz.pdf",
        "notes": "Sutter Health Park official seating PDF: Reserved 101-125, Solon Club 201-206, Diamond View Dugout, Gilt Edge Club, Triple Suite, Pacifico Patio, SacTown Smokehouse, and Toyota Home Run Hill. Suite numbers and other 200s are not invented.",
        "bands": [
            {"ids": [str(n) for n in range(101, 126)], "level": "lower", "namePrefix": "Reserved"},
            {"ids": [str(n) for n in range(201, 207)], "level": "club", "namePrefix": "Solon Club", "startOffset": 40, "endOffset": 110},
        ],
        "named": [
            {"id": "sacramento-diamond-view", "name": "Diamond View Dugout", "level": "club", "compassOffset": 180, "span": 16},
            {"id": "gilt-edge-club", "name": "Gilt Edge Club", "level": "club", "compassOffset": 250, "span": 10},
            {"id": "triple-suite", "name": "Triple Suite", "level": "suite", "compassOffset": 260, "span": 8},
            {"id": "pacifico-patio", "name": "Pacifico Patio", "level": "club", "compassOffset": 40, "span": 10},
            {"id": "sactown-smokehouse", "name": "SacTown Smokehouse", "level": "club", "compassOffset": 20, "span": 10},
            {"id": "toyota-home-run-hill", "name": "Toyota Home Run Hill", "level": "standing", "compassOffset": 0, "span": 40},
        ],
    },
    "portland-sea-dogs": {
        "officialUrl": "https://www.milb.com/portland/tickets",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/milb/faxfcqdnet5awe9w6n8q.jpg",
        "notes": "Hadlock Field official seating chart: Box 101-114, Reserved 201-214, GA 303-317, Sky View 403/405/406/408, Gifford's Pavilion 501-503, and RF boxes P1-P4. 301-302, 404, and 407 are not on the chart and are not invented.",
        "bands": [
            {"ids": [str(n) for n in range(101, 115)], "level": "field", "namePrefix": "Box"},
            {"ids": [str(n) for n in range(201, 215)], "level": "lower", "namePrefix": "Reserved", "startOffset": 74, "endOffset": 286},
            {"ids": [str(n) for n in range(303, 318)], "level": "upper", "namePrefix": "General Admission", "startOffset": 74, "endOffset": 286},
            {"ids": ["403", "405", "406", "408"], "level": "upper", "namePrefix": "Sky View", "startOffset": 150, "endOffset": 210},
            {"ids": ["501", "502", "503"], "level": "standing", "namePrefix": "Gifford's Pavilion", "startOffset": 20, "endOffset": 50},
            {"ids": ["P1", "P2", "P3", "P4"], "level": "field", "namePrefix": "Box", "startOffset": 30, "endOffset": 70},
        ],
        "named": [
            {"id": "portland-coca-cola-picnic", "name": "Coca-Cola Picnic Area", "level": "standing", "compassOffset": 40, "span": 16},
            {"id": "portland-bullpen-bbq", "name": "Bullpen BBQ", "level": "standing", "compassOffset": 20, "span": 12},
            {"id": "shipyard-grill", "name": "Shipyard Grill", "level": "standing", "compassOffset": 270, "span": 12},
            {"id": "portland-corporate-corner", "name": "Corporate Corner Picnic Area", "level": "standing", "compassOffset": 280, "span": 10},
            {"id": "park-ave-plaza", "name": "Park Ave Plaza", "level": "club", "compassOffset": 90, "span": 10},
        ],
    },
    "hartford-yard-goats": {
        "officialUrl": "https://www.milb.com/hartford/tickets",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/milb/ex4f9qkqvyteqmddsblx.pdf",
        "notes": "Dunkin' Park official seating chart: field 101-128, terrace 201-203, Liberty Bank Club 210-212, and Jordan's Right Field Porch 224-230. Intermediate 200s are not invented.",
        "bands": [
            {"ids": [str(n) for n in range(101, 129)], "level": "lower", "namePrefix": "Section"},
            {"ids": ["201", "202", "203"], "level": "upper", "namePrefix": "Section", "startOffset": 80, "endOffset": 120},
            {"ids": ["210", "211", "212"], "level": "club", "namePrefix": "Liberty Bank Club", "startOffset": 168, "endOffset": 192},
            {"ids": [str(n) for n in range(224, 231)], "level": "club", "namePrefix": "Right Field Porch", "startOffset": 20, "endOffset": 70},
        ],
        "named": [
            {"id": "hartford-patron-plaza", "name": "Patrón Party Plaza", "level": "standing", "compassOffset": 270, "span": 16},
            {"id": "hartford-garage-deck", "name": "Garage Party Deck", "level": "club", "compassOffset": 250, "span": 10},
            {"id": "liberty-bank-pavilion", "name": "Liberty Bank Pavilion", "level": "standing", "compassOffset": 300, "span": 14},
            {"id": "travelers-patio", "name": "Travelers Patio", "level": "club", "compassOffset": 0, "span": 12},
            {"id": "bears-bbq-pit", "name": "Bear's BBQ Pit", "level": "standing", "compassOffset": 10, "span": 10},
            {"id": "hartford-sky-deck", "name": "Budweiser Sky Deck", "level": "club", "compassOffset": 40, "span": 12},
            {"id": "hartford-terrace", "name": "The Hartford Terrace", "level": "club", "compassOffset": 50, "span": 12},
            {"id": "hartford-samuel-adams-deck", "name": "Samuel Adams Party Deck", "level": "club", "compassOffset": 90, "span": 10},
            {"id": "hartford-home-plate-club", "name": "Home Plate Club", "level": "club", "compassOffset": 180, "span": 10},
            {"id": "hartford-dugout-suites", "name": "Dugout Suites", "level": "suite", "compassOffset": 140, "span": 12},
        ],
    },
}


def bands_from_ranges(ranges: list[tuple[int, int]]) -> list[dict]:
    ids = [int(x) for x in expand_ranges(ranges)]
    groups = {"field": [], "lower": [], "club": [], "upper": []}
    for n in ids:
        if n < 100:
            groups["field"].append(str(n))
        elif n < 200:
            groups["lower"].append(str(n))
        elif n < 300:
            groups["club"].append(str(n))
        else:
            groups["upper"].append(str(n))
    bands = []
    for level, tokens in groups.items():
        if len(tokens) < 3:
            continue
        bands.append(
            {
                "ids": tokens,
                "level": "field" if level == "field" else level,
                "namePrefix": "Section",
            }
        )
    return bands


def named_places(names: list[str]) -> list[dict]:
    out, seen = [], set()
    for raw in names:
        key = re.sub(r"[^a-z0-9]+", "-", raw.lower()).strip("-")
        if key in seen or key in {"berm", "pool", "club"} and raw.lower() == "club":
            continue
        seen.add(key)
        level = "standing"
        offset = 0
        low = raw.lower()
        if "monster" in low:
            level, offset = "club", 270
        elif "pool" in low or "cabana" in low or "tiki" in low:
            level, offset = "club", 20
        elif "party" in low or "club" in low:
            level, offset = "club", 180
        elif "picnic" in low or "porch" in low or "pavilion" in low:
            level, offset = "standing", 40
        elif "berm" in low or "lawn" in low:
            level, offset = "standing", 0
        out.append({"id": key, "name": raw, "level": level, "compassOffset": offset, "span": 14})
    return out


def emit_inventory(park: dict) -> str:
    bands = []
    for band in park["bands"]:
        extra = ""
        if band.get("startOffset") is not None:
            extra += f", startOffset: {band['startOffset']}, endOffset: {band.get('endOffset', 298)}"
        bands.append(
            f"      {{ ids: {json.dumps(band['ids'])}, level: {json.dumps(band['level'])}, "
            f"namePrefix: {json.dumps(band.get('namePrefix') or 'Section')}{extra} }}"
        )
    named = []
    for place in park.get("named") or []:
        named.append(
            f"      {{ id: {json.dumps(place['id'])}, name: {json.dumps(place['name'])}, "
            f"level: {json.dumps(place['level'])}, compassOffset: {place.get('compassOffset', 90)}, "
            f"span: {place.get('span', 10)} }}"
        )
    notes = park.get("notes")
    notes_line = f"\n    inventoryNotes: {json.dumps(notes)}," if notes else ""
    geom = park.get("geometryUrl")
    geom_line = f"\n    geometryUrl: {json.dumps(geom)}," if geom else ""
    named_block = ("[\n" + ",\n".join(named) + ",\n    ]") if named else "[]"
    return (
        f"  {json.dumps(park['stadiumId'])}: {{\n"
        f"    stadiumId: {json.dumps(park['stadiumId'])},\n"
        f"    league: 'MiLB',\n"
        f"    orientation: {park['orientation']},\n"
        f"    angleConvention: 'baseball-local',\n"
        f"    sourceKind: {json.dumps(park.get('sourceKind', 'official-static-chart'))},\n"
        f"    officialUrl: {json.dumps(park['officialUrl'])},{geom_line}{notes_line}\n"
        f"    bands: [\n" + ",\n".join(bands) + ",\n    ],\n"
        f"    named: {named_block},\n"
        f"  }}"
    )


def emit_provenance(park: dict) -> str:
    count = sum(len(b["ids"]) for b in park["bands"]) + len(park.get("named") or [])
    notes = park.get("notes")
    notes_line = f", inventoryNotes: {json.dumps(notes)}" if notes else ""
    geom = park.get("geometryUrl")
    geom_line = f", geometryUrl: {json.dumps(geom)}" if geom else ""
    status = park.get("inventoryStatus", "reconciled")
    return (
        f"  {json.dumps(park['stadiumId'])}: {{ stadiumId: {json.dumps(park['stadiumId'])}, "
        f"sourceKind: 'official-static-chart', officialUrl: {json.dumps(park['officialUrl'])}"
        f"{geom_line}, sectionIdentity: 'source-backed', rowGeometry: 'modeled', "
        f"inventoryStatus: {json.dumps(status)}, currentInventoryCount: {count}, "
        f"sourceProductCount: {count}{notes_line}, reviewedOn: '2026-08-18' }}"
    )


def main() -> None:
    stadiums = parse_stadiums()
    print(f"parsed {len(stadiums)} MiLB stadiums", flush=True)
    overrides_only = "--overrides-only" in sys.argv
    collected = {}
    if not overrides_only:
        with ThreadPoolExecutor(max_workers=8) as pool:
            futs = {pool.submit(collect, s): s for s in stadiums}
            for fut in as_completed(futs):
                rec = fut.result()
                collected[rec["stadiumId"]] = rec
                print(f"  {rec['stadiumId']}: verified={rec['verified']} ranges={rec['ranges']} named={rec['named'][:4]}", flush=True)

    parks = []
    missing = []
    for s in stadiums:
        rec = collected.get(s["id"], {})
        if s["id"] in OVERRIDES:
            inv = {
                "stadiumId": s["id"],
                "orientation": s.get("orientation", 0),
                **OVERRIDES[s["id"]],
            }
            parks.append(inv)
            continue
        if overrides_only:
            missing.append(s["id"])
            continue
        bands = bands_from_ranges(rec.get("ranges") or [])
        named = named_places(rec.get("named") or [])
        # Named-only hits are usually page chrome ("Kids Zone", "Pool"), not an inventory.
        if not bands:
            missing.append(s["id"])
            continue
        parks.append(
            {
                "stadiumId": s["id"],
                "orientation": s.get("orientation", 0),
                "officialUrl": rec.get("officialUrl") or f"https://www.milb.com/{SLUGS.get(s['id'], s['id'])}/tickets",
                "notes": "Section IDs transcribed from the club MiLB.com seating / tickets page.",
                "bands": bands,
                "named": named,
            }
        )

    # Shared bowl: Roger Dean
    jup = next((p for p in parks if p["stadiumId"] == "jupiter-hammerheads"), None)
    if jup and not any(p["stadiumId"] == "palm-beach-cardinals" for p in parks):
        copy = dict(jup)
        copy["stadiumId"] = "palm-beach-cardinals"
        parks.append(copy)

    parks.sort(key=lambda p: p["stadiumId"])
    (ROOT / "tmp/milb-official-collect.json").write_text(
        json.dumps({"parks": parks, "missing": missing}, indent=2)
    )
    print(f"inventories={len(parks)} missing={len(missing)} {missing}", flush=True)

    inv = (
        "import type { OfficialInventory } from '../officialTypes';\n\n"
        "export const MILB_OFFICIAL_INVENTORIES: Record<string, OfficialInventory> = {\n"
        + ",\n".join(emit_inventory(p) for p in parks)
        + ",\n};\n"
    )
    (ROOT / "src/data/sections/milb/officialInventories.ts").write_text(inv)
    prov = (
        "import type { StadiumSectionProvenance } from './stadiumSectionProvenance';\n\n"
        "export const MILB_SECTION_PROVENANCE: Record<string, StadiumSectionProvenance> = {\n"
        + ",\n".join(emit_provenance(p) for p in parks)
        + ",\n};\n"
    )
    (ROOT / "src/data/milbSectionProvenance.ts").write_text(prov)
    print("wrote official MiLB modules")


if __name__ == "__main__":
    main()
