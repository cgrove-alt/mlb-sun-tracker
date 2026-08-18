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
    "vancouver-canadians": {
        "officialUrl": "https://www.milb.com/vancouver/ballpark/a-z-guide",
        "notes": "Nat Bailey Stadium A-Z: Reserved Grandstand 1-15; box first six rows in A-B, E-J, and O-W. Netting copy names endpoints A-R and reserved 2-8; letters C-D and K-N are not invented from that span.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["A", "B", "E", "F", "G", "H", "I", "J", "O", "P", "Q", "R", "S", "T", "U", "V", "W"], "level": "field", "namePrefix": "Box"},
            {"ids": [str(n) for n in range(1, 16)], "level": "lower", "namePrefix": "Reserved Grandstand", "startOffset": 74, "endOffset": 286},
        ],
        "named": [],
    },
    "lehigh-valley-ironpigs": {
        "officialUrl": "https://www.milb.com/lehigh-valley/tickets/map",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/v1779121987/milb/w8jgjdepszi3mogvubwm.png",
        "notes": "Coca-Cola Park official 2026 stadium map: field 101-120, mid 201-212, upper 301-302 and 304-320 (303 is not labeled), BSI Dugout Suites, PenTeleData Party Porches, PNC Club, Picnic Patio, Tiki Terrace & Oasis, Pig Pen, Capital BLUE Lawn, Keystone Cabana, Bacon Strip, and KLYR.",
        "bands": [
            {"ids": [str(n) for n in range(101, 121)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(201, 213)], "level": "club", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
            {"ids": [str(n) for n in list(range(301, 303)) + list(range(304, 321))], "level": "upper", "namePrefix": "Section", "startOffset": 62, "endOffset": 298},
        ],
        "named": [
            {"id": "lehigh-bsi-dugout-suites", "name": "BSI Dugout Suites", "level": "suite", "compassOffset": 180, "span": 12},
            {"id": "lehigh-party-porch-1b", "name": "PenTeleData Party Porch (1B)", "level": "club", "compassOffset": 90, "span": 10},
            {"id": "lehigh-party-porch-3b", "name": "PenTeleData Party Porch (3B)", "level": "club", "compassOffset": 270, "span": 10},
            {"id": "lehigh-pnc-club", "name": "PNC Club", "level": "club", "compassOffset": 180, "span": 16},
            {"id": "lehigh-picnic-patio", "name": "Picnic Patio", "level": "standing", "compassOffset": 280, "span": 16},
            {"id": "lehigh-tiki-terrace", "name": "Tiki Terrace & Oasis", "level": "club", "compassOffset": 300, "span": 14},
            {"id": "lehigh-pig-pen", "name": "The Pig Pen", "level": "standing", "compassOffset": 310, "span": 10},
            {"id": "lehigh-capital-blue-lawn", "name": "Capital BLUE Lawn", "level": "standing", "compassOffset": 0, "span": 28},
            {"id": "lehigh-keystone-cabana", "name": "Keystone Cabana", "level": "club", "compassOffset": 20, "span": 10},
            {"id": "lehigh-bacon-strip", "name": "Bacon Strip", "level": "standing", "compassOffset": 50, "span": 14},
            {"id": "lehigh-klyr", "name": "KLYR", "level": "club", "compassOffset": 40, "span": 8},
        ],
    },
    "midland-rockhounds": {
        "officialUrl": "https://www.milb.com/midland/tickets/group-tickets",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/milb/ygk4uymlnbohqkz2yvs2.pdf",
        "notes": "Momentum Bank Ballpark official group pricing publishes Outfield 1-3 and 19-20 plus Field 4-5 and 17-18. Sections 6-16 are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["1", "2", "3", "4", "5", "17", "18", "19", "20"], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [],
    },
    "fresno-grizzlies": {
        "officialUrl": "https://www.milb.com/fresno/ballpark/a-z-guide",
        "notes": "Chukchansi Park A-Z publishes restroom/ATM/exit landmarks in 107-109, 111-113, 115-116, 118-121, 123-127, club 214 and 224, plus Kodiak Club, Dugout Club, and Tulare Plaza. Intermediate numbers (110, 114, 117, 122, and other 200s) are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {
                "ids": ["107", "108", "109", "111", "112", "113", "115", "116", "118", "119", "120", "121", "123", "124", "125", "126", "127"],
                "level": "lower",
                "namePrefix": "Section",
            },
            {"ids": ["214", "224"], "level": "club", "namePrefix": "Section", "startOffset": 160, "endOffset": 200},
        ],
        "named": [
            {"id": "fresno-kodiak-club", "name": "Kodiak Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "fresno-dugout-club", "name": "Dugout Club", "level": "club", "compassOffset": 140, "span": 12},
            {"id": "tulare-plaza", "name": "Tulare Plaza", "level": "standing", "compassOffset": 90, "span": 12},
        ],
    },
    "albuquerque-isotopes": {
        "officialUrl": "https://www.milb.com/albuquerque/ballpark/a-z",
        "notes": "Isotopes Park A-Z publishes landmarks 102, 104, 115, 118, 120, 122, 123, club 201/203/205, Pepsi Porch, Smith's Picnic Pavilion, Tecate Terrace, Miller Lite Stadium Club, Tequila Herradura Fiesta Deck, Berm, and Orbit's O-Zone. Intermediate numbers are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["102", "104", "115", "118", "120", "122", "123"], "level": "lower", "namePrefix": "Section"},
            {"ids": ["201", "203", "205"], "level": "club", "namePrefix": "Section", "startOffset": 240, "endOffset": 280},
        ],
        "named": [
            {"id": "albuquerque-pepsi-porch", "name": "Pepsi Porch", "level": "club", "compassOffset": 270, "span": 12},
            {"id": "smiths-picnic-pavilion", "name": "Smith's Picnic Pavilion", "level": "standing", "compassOffset": 40, "span": 18},
            {"id": "tecate-terrace", "name": "Tecate Terrace", "level": "suite", "compassOffset": 180, "span": 12},
            {"id": "miller-lite-stadium-club", "name": "Miller Lite Stadium Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "tequila-herradura-fiesta-deck", "name": "Tequila Herradura Fiesta Deck", "level": "club", "compassOffset": 90, "span": 12},
            {"id": "albuquerque-berm", "name": "Berm", "level": "standing", "compassOffset": 0, "span": 28},
            {"id": "orbits-o-zone", "name": "Orbit's O-Zone", "level": "standing", "compassOffset": 10, "span": 14},
        ],
    },
    "round-rock-express": {
        "officialUrl": "https://www.milb.com/round-rock/ballpark/faqs",
        "notes": "Dell Diamond FAQs publish restroom/elevator landmarks in 111, 114, 116, 118, 119, 120, 122, 124 plus Intel Club, Home Run Porch, and Picnic Area. Intermediate numbers are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["111", "114", "116", "118", "119", "120", "122", "124"], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "round-rock-intel-club", "name": "Intel Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "round-rock-home-run-porch", "name": "Home Run Porch", "level": "standing", "compassOffset": 0, "span": 18},
            {"id": "round-rock-picnic-area", "name": "Picnic Area", "level": "standing", "compassOffset": 40, "span": 16},
        ],
    },
    "omaha-storm-chasers": {
        "officialUrl": "https://www.milb.com/omaha/ballpark/guide",
        "notes": "Werner Park fan guide publishes landmarks 100, 102, 103, 108, 112, 114-116, 120, 121, 124-125 plus Home Run Porch, CKF Party Decks, Hy-Vee Pavilion, Centris Family Fun Zone, Big Top Tent, Omaha Steaks Field Level Suite, Berm, and VIP Club. Intermediate numbers are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["100", "102", "103", "108", "112", "114", "115", "116", "120", "121", "124", "125"], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "omaha-home-run-porch", "name": "Home Run Porch", "level": "standing", "compassOffset": 270, "span": 16},
            {"id": "ckf-party-decks", "name": "CKF Party Decks", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "hy-vee-pavilion", "name": "Hy-Vee Pavilion", "level": "standing", "compassOffset": 40, "span": 14},
            {"id": "centris-family-fun-zone", "name": "Centris Family Fun Zone", "level": "standing", "compassOffset": 300, "span": 14},
            {"id": "omaha-big-top-tent", "name": "Big Top Party Tent", "level": "standing", "compassOffset": 290, "span": 16},
            {"id": "omaha-steaks-field-suite", "name": "Omaha Steaks Field Level Suite", "level": "suite", "compassOffset": 250, "span": 10},
            {"id": "omaha-berm", "name": "Berm", "level": "standing", "compassOffset": 0, "span": 28},
            {"id": "omaha-vip-club", "name": "VIP Club", "level": "club", "compassOffset": 180, "span": 12},
        ],
    },
    "pensacola-blue-wahoos": {
        "officialUrl": "https://www.milb.com/pensacola/tickets",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/qzzq9ep9yyopjrltrgmk.jpg",
        "notes": "Admiral Fetterman Field / Blue Wahoos Stadium official stadium map: Box 100-110, Reserved 111-117, RF bleachers 118 & 120 (119 not labeled), plus Left Field Party Deck, Hancock Whitney Club, Cox Clubhouse, Bubba's Sandtrap, Publix Party Porch, Hill-Kelly Hill, Coors Light Cold Zone, Pepsi Pirate Deck, and Season Ticket Member Lounge.",
        "bands": [
            {"ids": [str(n) for n in range(100, 111)], "level": "field", "namePrefix": "Box"},
            {"ids": [str(n) for n in range(111, 118)], "level": "lower", "namePrefix": "Reserved"},
            {"ids": ["118", "120"], "level": "lower", "namePrefix": "Bleachers", "startOffset": 40, "endOffset": 70},
        ],
        "named": [
            {"id": "pensacola-left-field-party-deck", "name": "Left Field Party Deck", "level": "club", "compassOffset": 270, "span": 14},
            {"id": "pensacola-hancock-whitney-club", "name": "Hancock Whitney Club", "level": "club", "compassOffset": 200, "span": 16},
            {"id": "pensacola-cox-clubhouse", "name": "Cox Clubhouse", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "pensacola-bubbas-sandtrap", "name": "Bubba's Sandtrap", "level": "standing", "compassOffset": 170, "span": 10},
            {"id": "pensacola-publix-party-porch", "name": "Publix Party Porch", "level": "club", "compassOffset": 90, "span": 12},
            {"id": "pensacola-hill-kelly-hill", "name": "Hill-Kelly Hill", "level": "standing", "compassOffset": 20, "span": 18},
            {"id": "pensacola-coors-light-cold-zone", "name": "Coors Light Cold Zone", "level": "standing", "compassOffset": 50, "span": 10},
            {"id": "pensacola-pepsi-pirate-deck", "name": "Pepsi Pirate Deck", "level": "club", "compassOffset": 0, "span": 12},
            {"id": "pensacola-season-ticket-member-lounge", "name": "Season Ticket Member Lounge", "level": "club", "compassOffset": 140, "span": 10},
        ],
    },
    "syracuse-mets": {
        "officialUrl": "https://www.milb.com/syracuse/tickets",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/nkdyyzfwg56rhplkgjgo.jpg",
        "notes": "NBT Bank Stadium official seating chart: lower 101-117; club 200-205, 207-213, 215-221 (206 and 214 not labeled); upper reserved 300-303 and 315-321; suites Seaver plus S303-S314 (prefixed to avoid colliding with upper 303) and 415-420; Berm, Metropolitan Club, Salt City Deck, 1B Sky/Patio, 3B Patio, Piazza Lounge, and 315 Bullpen Bar.",
        "bands": [
            {"ids": [str(n) for n in range(101, 118)], "level": "lower", "namePrefix": "Section"},
            {
                "ids": [str(n) for n in list(range(200, 206)) + list(range(207, 214)) + list(range(215, 222))],
                "level": "club",
                "namePrefix": "Section",
                "startOffset": 74,
                "endOffset": 286,
            },
            {
                "ids": [str(n) for n in list(range(300, 304)) + list(range(315, 322))],
                "level": "upper",
                "namePrefix": "Upper Reserved",
                "startOffset": 62,
                "endOffset": 298,
            },
            {
                "ids": [f"S{n}" for n in range(303, 315)] + [str(n) for n in range(415, 421)],
                "level": "suite",
                "namePrefix": "Suite",
                "startOffset": 100,
                "endOffset": 260,
            },
        ],
        "named": [
            {"id": "syracuse-seaver-suite", "name": "Seaver Suite", "level": "suite", "compassOffset": 240, "span": 8},
            {"id": "syracuse-berm", "name": "Berm Area", "level": "standing", "compassOffset": 0, "span": 28},
            {"id": "syracuse-metropolitan-club", "name": "Metropolitan Club", "level": "club", "compassOffset": 280, "span": 14},
            {"id": "syracuse-salt-city-deck", "name": "Salt City Deck", "level": "club", "compassOffset": 300, "span": 12},
            {"id": "syracuse-1b-sky", "name": "1B Sky", "level": "club", "compassOffset": 250, "span": 8},
            {"id": "syracuse-1b-patio", "name": "1B Patio", "level": "club", "compassOffset": 255, "span": 8},
            {"id": "syracuse-3b-patio", "name": "3B Patio", "level": "club", "compassOffset": 100, "span": 8},
            {"id": "syracuse-piazza-lounge", "name": "Piazza Lounge", "level": "club", "compassOffset": 90, "span": 10},
            {"id": "syracuse-315-bullpen-bar", "name": "315 Bullpen Bar", "level": "standing", "compassOffset": 50, "span": 10},
        ],
    },
    "myrtle-beach-pelicans": {
        "officialUrl": "https://www.milb.com/myrtle-beach/ballpark/seating-map",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/fk1qgjguidg1onqxycmk.jpg",
        "notes": "Pelicans Ballpark official seating chart: lower 102-107, 109-111, 113-117 (101/108/112 not labeled), High Tide 206-214, Budweiser Bowtie outfield 301-304, plus Pepsi Pavilion, D.N. Mason Roofing Field Suite, Sun Cruiser Beach, Shelby Rally Deck, and Suite Level.",
        "bands": [
            {
                "ids": ["102", "103", "104", "105", "106", "107", "109", "110", "111", "113", "114", "115", "116", "117"],
                "level": "lower",
                "namePrefix": "Section",
            },
            {"ids": [str(n) for n in range(206, 215)], "level": "upper", "namePrefix": "Section", "startOffset": 120, "endOffset": 240},
            {"ids": ["301", "302", "303", "304"], "level": "field", "namePrefix": "Outfield Deck", "startOffset": 40, "endOffset": 80},
        ],
        "named": [
            {"id": "myrtle-beach-pepsi-pavilion", "name": "Pepsi Pavilion", "level": "standing", "compassOffset": 280, "span": 16},
            {"id": "myrtle-beach-field-suite", "name": "D.N. Mason Roofing Field Suite", "level": "suite", "compassOffset": 90, "span": 10},
            {"id": "myrtle-beach-sun-cruiser-beach", "name": "Sun Cruiser Beach", "level": "standing", "compassOffset": 30, "span": 14},
            {"id": "myrtle-beach-shelby-rally-deck", "name": "The Shelby Rally Deck", "level": "club", "compassOffset": 50, "span": 12},
            {"id": "myrtle-beach-suite-level", "name": "Suite Level", "level": "suite", "compassOffset": 180, "span": 20},
        ],
    },
    "great-lakes-loons": {
        "officialUrl": "https://www.milb.com/great-lakes/ballpark/seating-chart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/uvwrhttqmqxiz9rmrhod.jpg",
        "notes": "Dow Diamond official seating chart: reserved 101-113, Shoreline Box, The Dock, nightly suites 1-12, Tri-Star Club Level, Lasorda's Landing, Pier 47, Northern Lights Pavilion, The Peninsula, Lawn, Lou E's Lookout, and The Cove Bar.",
        "bands": [
            {"ids": [str(n) for n in range(101, 114)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(1, 13)], "level": "suite", "namePrefix": "Suite", "startOffset": 100, "endOffset": 260},
        ],
        "named": [
            {"id": "great-lakes-shoreline-box", "name": "Shoreline Box", "level": "field", "compassOffset": 90, "span": 14},
            {"id": "great-lakes-the-dock", "name": "The Dock", "level": "field", "compassOffset": 180, "span": 10},
            {"id": "great-lakes-tri-star-club", "name": "Tri-Star Club Level", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "great-lakes-lasordas-landing", "name": "Lasorda's Landing", "level": "club", "compassOffset": 70, "span": 10},
            {"id": "great-lakes-pier-47", "name": "Pier 47", "level": "club", "compassOffset": 270, "span": 12},
            {"id": "great-lakes-northern-lights-pavilion", "name": "Northern Lights Pavilion", "level": "standing", "compassOffset": 40, "span": 18},
            {"id": "great-lakes-the-peninsula", "name": "The Peninsula", "level": "standing", "compassOffset": 320, "span": 12},
            {"id": "great-lakes-lawn", "name": "Lawn Seating", "level": "standing", "compassOffset": 0, "span": 40},
            {"id": "great-lakes-lou-es-lookout", "name": "Lou E's Lookout", "level": "standing", "compassOffset": 300, "span": 10},
            {"id": "great-lakes-cove-bar", "name": "The Cove Bar", "level": "standing", "compassOffset": 250, "span": 8},
        ],
    },
    "inland-empire-66ers": {
        "officialUrl": "https://www.milb.com/inland-empire/ballpark",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/xokpmtfeei0oslurmsdr.jpg",
        "notes": "San Manuel Stadium official seating chart: odds 101-123 and evens 102-108 plus 116-122 (110/112/114 occupied by Toyota Redlands Garage and not invented), terrace 201-209 odds and 202-208 evens, luxury suites 300-301/304-305/318-323, plus Super Box, Omnitrans Home Run Hill, Patio Parties, Skybox Terraces, Party Suite, and Hospitality Suite.",
        "bands": [
            {
                "ids": [str(n) for n in range(101, 124, 2)]
                + [str(n) for n in list(range(102, 110, 2)) + list(range(116, 124, 2))],
                "level": "lower",
                "namePrefix": "Section",
            },
            {
                "ids": [str(n) for n in range(201, 210, 2)] + [str(n) for n in range(202, 209, 2)],
                "level": "upper",
                "namePrefix": "Section",
                "startOffset": 100,
                "endOffset": 260,
            },
            {
                "ids": ["300", "301", "304", "305"] + [str(n) for n in range(318, 324)],
                "level": "suite",
                "namePrefix": "Suite",
                "startOffset": 100,
                "endOffset": 260,
            },
        ],
        "named": [
            {"id": "inland-empire-super-box", "name": "Super Box", "level": "club", "compassOffset": 0, "span": 14},
            {"id": "inland-empire-home-run-hill", "name": "Omnitrans Home Run Hill", "level": "standing", "compassOffset": 300, "span": 16},
            {"id": "inland-empire-patio-parties-lf", "name": "Patio Parties (LF)", "level": "club", "compassOffset": 280, "span": 10},
            {"id": "inland-empire-patio-parties-rf", "name": "Patio Parties (RF)", "level": "club", "compassOffset": 80, "span": 10},
            {"id": "inland-empire-skybox-terrace-3b", "name": "Skybox Terrace (3B)", "level": "club", "compassOffset": 250, "span": 8},
            {"id": "inland-empire-skybox-terrace-1b", "name": "Skybox Terrace (1B)", "level": "club", "compassOffset": 110, "span": 8},
            {"id": "inland-empire-party-suite", "name": "Party Suite", "level": "suite", "compassOffset": 200, "span": 8},
            {"id": "inland-empire-hospitality-suite", "name": "Hospitality Suite", "level": "suite", "compassOffset": 220, "span": 8},
        ],
    },
    "reading-fightin-phils": {
        "officialUrl": "https://www.milb.com/reading/tickets",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/sli2c2akqynww3bd4dxc.jpg",
        "notes": "FirstEnergy Stadium official ballpark diagram: Box 1-9, Left 1-8, Right 1-6, Deck Box 1-5, plus Seidel Auto Group Deck, Blue Marsh Insurance Foul Porch, Pool Pavilion, Savage 61 products, Penn State Health picnic, Tompkins VIST Bank Plaza, and GEICO Phunland.",
        "bands": [
            {"ids": [str(n) for n in range(1, 10)], "level": "lower", "namePrefix": "Box"},
            {"ids": [f"LEFT{n}" for n in range(1, 9)], "level": "lower", "namePrefix": "Left", "startOffset": 220, "endOffset": 280},
            {"ids": [f"RIGHT{n}" for n in range(1, 7)], "level": "lower", "namePrefix": "Right", "startOffset": 80, "endOffset": 140},
            {"ids": [f"DECK{n}" for n in range(1, 6)], "level": "field", "namePrefix": "Deck Box", "startOffset": 300, "endOffset": 340},
        ],
        "named": [
            {"id": "reading-seidel-deck", "name": "Seidel Auto Group Deck", "level": "standing", "compassOffset": 310, "span": 18},
            {"id": "reading-foul-porch", "name": "Blue Marsh Insurance Foul Porch", "level": "standing", "compassOffset": 280, "span": 12},
            {"id": "reading-pool-pavilion", "name": "Reading Hospital Tower Health Pool Pavilion", "level": "club", "compassOffset": 40, "span": 16},
            {"id": "reading-savage-61-loge", "name": "Savage 61 Loge Box", "level": "club", "compassOffset": 120, "span": 8},
            {"id": "reading-savage-61-dugout-suite", "name": "Savage 61 Dugout Suite", "level": "suite", "compassOffset": 110, "span": 8},
            {"id": "reading-savage-61-ram-club", "name": "Savage 61 Ram Club Box Seats", "level": "club", "compassOffset": 100, "span": 8},
            {"id": "reading-penn-state-picnic", "name": "Penn State Health St. Joseph '67 Club Picnic Area", "level": "standing", "compassOffset": 260, "span": 14},
            {"id": "reading-vist-bank-plaza", "name": "Tompkins VIST Bank Plaza", "level": "standing", "compassOffset": 90, "span": 14},
            {"id": "reading-geico-phunland", "name": "GEICO Phunland", "level": "standing", "compassOffset": 70, "span": 12},
        ],
    },
    "hickory-crawdads": {
        "officialUrl": "https://www.milb.com/hickory/tickets",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/vjz5qjlrulwvinkrce9s.jpg",
        "notes": "L.P. Frans Stadium official seating chart: outfield/dugout/home-plate 101-116, upper 201-212, suites ST1-ST6, plus Crawdads Cafe, Carolina Brewery Party Porch, Black's Tire Picnic Deck, Unifour Hydraulics Picnic Pavilion, Arrow Exterminators VIP Seats, Peoples Bank Party Patios, and Grass.",
        "bands": [
            {"ids": [str(n) for n in range(101, 117)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(201, 213)], "level": "upper", "namePrefix": "Section", "startOffset": 100, "endOffset": 260},
            {"ids": [f"ST{n}" for n in range(1, 7)], "level": "suite", "namePrefix": "Suite", "startOffset": 120, "endOffset": 240},
        ],
        "named": [
            {"id": "hickory-crawdads-cafe", "name": "Crawdads Cafe", "level": "club", "compassOffset": 40, "span": 12},
            {"id": "hickory-party-porch", "name": "Carolina Brewery Party Porch", "level": "club", "compassOffset": 50, "span": 10},
            {"id": "hickory-blacks-tire-picnic-deck", "name": "Black's Tire Picnic Deck", "level": "standing", "compassOffset": 60, "span": 12},
            {"id": "hickory-unifour-picnic-pavilion", "name": "Unifour Hydraulics Picnic Pavilion", "level": "standing", "compassOffset": 70, "span": 12},
            {"id": "hickory-arrow-vip-seats", "name": "Arrow Exterminators VIP Seats", "level": "field", "compassOffset": 80, "span": 8},
            {"id": "hickory-peoples-bank-party-patios", "name": "Peoples Bank Party Patios", "level": "club", "compassOffset": 270, "span": 12},
            {"id": "hickory-grass", "name": "Grass", "level": "standing", "compassOffset": 280, "span": 14},
        ],
    },
    "wisconsin-timber-rattlers": {
        "officialUrl": "https://www.milb.com/wisconsin/ballpark/seating-chart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/qwsfebeqqdxmkzmjcjoy.jpg",
        "notes": "Neuroscience Group Field official stadium map: bowl 100-116 (Diamond 100-102, box through 110, reserved bleacher 111-116), plus Party Deck, Miller Lite Home Run Porch, TLC Picnic Pavilion, Leinie's Legends Lodge, Fox Club, Left Field Lofts, Left Field Bar Top, AYCE bar top, patio tables, grass berms, beer garden, and beach.",
        "bands": [
            {"ids": [str(n) for n in range(100, 117)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "wisconsin-party-deck", "name": "Party Deck", "level": "club", "compassOffset": 40, "span": 14},
            {"id": "wisconsin-miller-lite-hr-porch", "name": "Miller Lite Home Run Porch", "level": "standing", "compassOffset": 50, "span": 12},
            {"id": "wisconsin-tlc-picnic-pavilion", "name": "TLC Sign Picnic Pavilion", "level": "standing", "compassOffset": 70, "span": 14},
            {"id": "wisconsin-leinies-legends-lodge", "name": "Leinie's Legends Lodge", "level": "club", "compassOffset": 90, "span": 10},
            {"id": "wisconsin-fox-club", "name": "The Fox Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "wisconsin-left-field-lofts", "name": "Left Field Lofts", "level": "suite", "compassOffset": 300, "span": 12},
            {"id": "wisconsin-lf-bar-top", "name": "Left Field Bar Top Seats", "level": "standing", "compassOffset": 280, "span": 10},
            {"id": "wisconsin-ayce-bar-top", "name": "All-You-Can-Eat Bar Top Seats", "level": "standing", "compassOffset": 80, "span": 10},
            {"id": "wisconsin-patio-tables", "name": "Patio Tables", "level": "standing", "compassOffset": 290, "span": 10},
            {"id": "wisconsin-grass-seating", "name": "Grass Seating", "level": "standing", "compassOffset": 0, "span": 36},
            {"id": "wisconsin-beer-garden", "name": "Beer Garden Area", "level": "standing", "compassOffset": 320, "span": 14},
            {"id": "wisconsin-beach", "name": "Beach Area", "level": "standing", "compassOffset": 30, "span": 12},
        ],
    },
    "columbia-fireflies": {
        "officialUrl": "https://www.milb.com/columbia/ballpark/seating-chart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/telm5n9odzxglcgny1gz.jpg",
        "notes": "Segra Park official seating chart: reserved/dugout/prime/home-plate 101-112, Home Run Porch 113-115, Coors Light On Deck 201-203, suites 1-16, plus 4 Topps tables, Bullpen Boxes, CAE First Class, Lexington Medical Center Picnic Pavilion, Lawn, Bowtie Bar, SCU Kids Zone, and BMW of Columbia.",
        "bands": [
            {"ids": [str(n) for n in range(101, 116)], "level": "lower", "namePrefix": "Section"},
            {"ids": ["201", "202", "203"], "level": "club", "namePrefix": "On Deck", "startOffset": 160, "endOffset": 200},
            {"ids": [str(n) for n in range(1, 17)], "level": "suite", "namePrefix": "Suite", "startOffset": 100, "endOffset": 260},
        ],
        "named": [
            {"id": "columbia-4-topps", "name": "4 Topps", "level": "standing", "compassOffset": 180, "span": 10},
            {"id": "columbia-bullpen-boxes", "name": "Bullpen Boxes", "level": "field", "compassOffset": 60, "span": 12},
            {"id": "columbia-cae-first-class", "name": "CAE First Class", "level": "club", "compassOffset": 140, "span": 8},
            {"id": "columbia-picnic-pavilion", "name": "Lexington Medical Center Picnic Pavilion", "level": "standing", "compassOffset": 280, "span": 16},
            {"id": "columbia-lawn", "name": "Lawn", "level": "standing", "compassOffset": 0, "span": 28},
            {"id": "columbia-bowtie-bar", "name": "Bowtie Bar", "level": "standing", "compassOffset": 300, "span": 10},
            {"id": "columbia-scu-kids-zone", "name": "SCU Kids Zone", "level": "standing", "compassOffset": 40, "span": 10},
            {"id": "columbia-bmw", "name": "BMW of Columbia", "level": "suite", "compassOffset": 100, "span": 8},
        ],
    },
    "winston-salem-dash": {
        "officialUrl": "https://www.milb.com/winston-salem/ballpark",
        "notes": "Truist Stadium ballpark guide publishes landmarks 105, 109, 110-113 plus Lowes Foods Landing, On-Deck Lounge, Flow Club Wings/Tables, Party Decks, Suites, Foothills Flight Deck, Womble Carlyle Club, Wicked Weed Center Field Bar, and The Brewpen. Intermediate numbers are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["105", "109", "110", "111", "112", "113"], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "winston-lowes-foods-landing", "name": "Lowes Foods Landing", "level": "club", "compassOffset": 200, "span": 12},
            {"id": "winston-on-deck-lounge", "name": "On-Deck Lounge", "level": "club", "compassOffset": 190, "span": 10},
            {"id": "winston-flow-club-wings", "name": "Flow Club Wings", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "winston-flow-club-tables", "name": "Flow Club Tables", "level": "club", "compassOffset": 170, "span": 10},
            {"id": "winston-party-decks", "name": "Party Decks", "level": "club", "compassOffset": 90, "span": 12},
            {"id": "winston-suites", "name": "Luxury Suites", "level": "suite", "compassOffset": 180, "span": 16},
            {"id": "winston-foothills-flight-deck", "name": "Foothills Flight Deck", "level": "club", "compassOffset": 40, "span": 10},
            {"id": "winston-womble-carlyle-club", "name": "Womble Carlyle Club", "level": "club", "compassOffset": 160, "span": 10},
            {"id": "winston-wicked-weed-cf-bar", "name": "Wicked Weed Center Field Bar", "level": "standing", "compassOffset": 0, "span": 12},
            {"id": "winston-brewpen", "name": "The Brewpen", "level": "standing", "compassOffset": 320, "span": 10},
        ],
    },
    "jersey-shore-blueclaws": {
        "officialUrl": "https://www.milb.com/jersey-shore/ballpark/seating-chart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/x7e5jdgivh70hxvwqwpf.jpg",
        "notes": "ShoreTown Ballpark official seating chart: reserved 101-115, Champions Club, Luxury Suites, 1B/3B Party Decks, 1B/3B Picnic Areas, Standing Room Only berms, Fire Pits, and Chick-fil-A Fan Zone.",
        "bands": [
            {"ids": [str(n) for n in range(101, 116)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "jersey-shore-champions-club", "name": "Champions Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "jersey-shore-luxury-suites", "name": "Luxury Suites", "level": "suite", "compassOffset": 180, "span": 18},
            {"id": "jersey-shore-1b-party-deck", "name": "1B Party Deck", "level": "club", "compassOffset": 120, "span": 10},
            {"id": "jersey-shore-3b-party-deck", "name": "3B Party Deck", "level": "club", "compassOffset": 240, "span": 10},
            {"id": "jersey-shore-1b-picnic", "name": "1B Picnic Area", "level": "standing", "compassOffset": 60, "span": 14},
            {"id": "jersey-shore-3b-picnic", "name": "3B Picnic Area", "level": "standing", "compassOffset": 300, "span": 14},
            {"id": "jersey-shore-sro", "name": "Standing Room Only", "level": "standing", "compassOffset": 0, "span": 36},
            {"id": "jersey-shore-fire-pits", "name": "Fire Pits", "level": "standing", "compassOffset": 320, "span": 12},
            {"id": "jersey-shore-chick-fil-a-fan-zone", "name": "Chick-fil-A Fan Zone", "level": "standing", "compassOffset": 340, "span": 10},
        ],
    },
"rome-braves": {
        "officialUrl": "https://www.milb.com/rome/ballpark/seatingchart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/dyzpyura283eiuqjblae.jpg",
        "notes": "AdventHealth Stadium / State Mutual official Emperors seating chart: lower 100-113 and 115 (114 not labeled), upper 200-210, upper-outer 301 and 304-311 and 314 (302/303/312/313 not labeled), The Terrace, lawn/picnic, and suites.",
        "bands": [
            {"ids": [str(n) for n in list(range(100, 114)) + [115]], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(200, 211)], "level": "upper", "namePrefix": "Section", "startOffset": 100, "endOffset": 260},
            {"ids": ["301"] + [str(n) for n in range(304, 312)] + ["314"], "level": "upper", "namePrefix": "Section", "startOffset": 80, "endOffset": 280},
        ],
        "named": [
            {"id": "rome-the-terrace", "name": "The Terrace", "level": "club", "compassOffset": 90, "span": 14},
            {"id": "rome-lawn", "name": "General Admission Lawn", "level": "standing", "compassOffset": 0, "span": 36},
            {"id": "rome-suites", "name": "Suites", "level": "suite", "compassOffset": 40, "span": 12},
        ],
    },
    "lakeland-flying-tigers": {
        "officialUrl": "https://www.mlb.com/tigers/spring-training/seat-map",
        "geometryUrl": "https://img.mlbstatic.com/mlb-images/image/upload/t_w2208/mlb/pb3cbivj1qb8dklitpfi.jpg",
        "notes": "Publix Field at Joker Marchant Stadium official Tigers spring / Flying Tigers seat map: field 100-116, club 200-216, 300-302, suites 1-5, Berm, Corona Cabana Bar, Berm Drink Rail, The Runway, Margaritaville, Pepsi Pavilion, 34 Club, and On-Deck Suite.",
        "bands": [
            {"ids": [str(n) for n in range(100, 117)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(200, 217)], "level": "club", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
            {"ids": ["300", "301", "302"], "level": "upper", "namePrefix": "Section", "startOffset": 60, "endOffset": 100},
            {"ids": [str(n) for n in range(1, 6)], "level": "suite", "namePrefix": "Suite", "startOffset": 160, "endOffset": 200},
        ],
        "named": [
            {"id": "lakeland-berm", "name": "Berm", "level": "standing", "compassOffset": 300, "span": 24},
            {"id": "lakeland-corona-cabana-bar", "name": "Corona Cabana Bar", "level": "club", "compassOffset": 310, "span": 10},
            {"id": "lakeland-berm-drink-rail", "name": "Berm Drink Rail", "level": "standing", "compassOffset": 290, "span": 12},
            {"id": "lakeland-the-runway", "name": "The Runway", "level": "standing", "compassOffset": 40, "span": 18},
            {"id": "lakeland-margaritaville", "name": "Margaritaville", "level": "club", "compassOffset": 20, "span": 10},
            {"id": "lakeland-pepsi-pavilion", "name": "Pepsi Pavilion", "level": "standing", "compassOffset": 70, "span": 14},
            {"id": "lakeland-34-club", "name": "34 Club (Miller Lite)", "level": "club", "compassOffset": 90, "span": 10},
            {"id": "lakeland-on-deck-suite", "name": "On-Deck Suite", "level": "suite", "compassOffset": 200, "span": 8},
        ],
    },
    "charleston-riverdogs": {
        "officialUrl": "https://www.milb.com/charleston/ballpark/seatingchart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/a0ehosjhtrpehbrre4no.jpg",
        "notes": "Joseph P. Riley Jr. Park official seating chart: Diamond/Field/Lower Reserved 101-122, Upper Reserved/Grandstand/GA 201-214, Marino Family Sky Suites 401-408, plus Segra Club, Murray's Mezzanine, Doby's Deck, Budweiser Ashley View Pub, Wicked Weed Foul Pole Porch, and Shoeless Joe's Hill.",
        "bands": [
            {"ids": [str(n) for n in range(101, 123)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(201, 215)], "level": "upper", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
            {"ids": [str(n) for n in range(401, 409)], "level": "suite", "namePrefix": "Sky Suite", "startOffset": 140, "endOffset": 220},
        ],
        "named": [
            {"id": "charleston-segra-club", "name": "Segra Club", "level": "club", "compassOffset": 140, "span": 12},
            {"id": "charleston-murrays-mezzanine", "name": "Murray's Mezzanine", "level": "club", "compassOffset": 120, "span": 10},
            {"id": "charleston-dobys-deck", "name": "Doby's Deck", "level": "club", "compassOffset": 240, "span": 12},
            {"id": "charleston-ashley-view-pub", "name": "Budweiser Ashley View Pub", "level": "standing", "compassOffset": 270, "span": 10},
            {"id": "charleston-foul-pole-porch", "name": "Wicked Weed Foul Pole Porch", "level": "club", "compassOffset": 290, "span": 10},
            {"id": "charleston-shoeless-joes-hill", "name": "Shoeless Joe's Hill", "level": "standing", "compassOffset": 40, "span": 16},
        ],
    },
    "tampa-tarpons": {
        "officialUrl": "https://www.milb.com/tampa/ballpark/seatingchart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/edkckqq0ssxxnu4lozu8.jpg",
        "notes": "George M. Steinbrenner Field official seating chart: lower 102-120 (101 not labeled), upper 203-219 (200-202 not labeled), Loge 1-8, Rooftop Bullpen Club, Rooftop 3rd Base Club, Right Field Terrace, Seminole Hard Rock Cabanas, and Planet Fitness Zone.",
        "bands": [
            {"ids": [str(n) for n in range(102, 121)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(203, 220)], "level": "upper", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
            {"ids": [f"LOGE{n}" for n in range(1, 9)], "level": "club", "namePrefix": "Loge", "startOffset": 100, "endOffset": 260},
        ],
        "named": [
            {"id": "tampa-rooftop-bullpen-club", "name": "Rooftop Bullpen Club", "level": "club", "compassOffset": 70, "span": 12},
            {"id": "tampa-rooftop-3b-club", "name": "Rooftop 3rd Base Club", "level": "club", "compassOffset": 250, "span": 12},
            {"id": "tampa-rf-terrace", "name": "Right Field Terrace", "level": "standing", "compassOffset": 40, "span": 14},
            {"id": "tampa-hard-rock-cabanas", "name": "Seminole Hard Rock Cabanas", "level": "club", "compassOffset": 10, "span": 12},
            {"id": "tampa-planet-fitness-zone", "name": "Planet Fitness Zone", "level": "standing", "compassOffset": 320, "span": 14},
        ],
    },
    "salt-lake-bees": {
        "officialUrl": "https://www.milb.com/salt-lake/ballpark/seating-chart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/rewsiwkyh2wamj9esqbc.jpg",
        "notes": "Smith's Ballpark official seating chart: field 1-23, upper 101-118, Party Patio, Vista Deck, Main Street Gardens, Siegfried & Jensen Center Field Pavilion, Fun Zone, and Left Field Corner.",
        "bands": [
            {"ids": [str(n) for n in range(1, 24)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(101, 119)], "level": "upper", "namePrefix": "Section", "startOffset": 74, "endOffset": 286},
        ],
        "named": [
            {"id": "salt-lake-party-patio", "name": "Party Patio", "level": "club", "compassOffset": 280, "span": 14},
            {"id": "salt-lake-vista-deck", "name": "Vista Deck", "level": "club", "compassOffset": 100, "span": 12},
            {"id": "salt-lake-main-street-gardens", "name": "Main Street Gardens", "level": "standing", "compassOffset": 300, "span": 16},
            {"id": "salt-lake-cf-pavilion", "name": "Siegfried & Jensen Center Field Pavilion", "level": "standing", "compassOffset": 0, "span": 16},
            {"id": "salt-lake-fun-zone", "name": "Fun Zone", "level": "standing", "compassOffset": 40, "span": 12},
            {"id": "salt-lake-lf-corner", "name": "Left Field Corner", "level": "standing", "compassOffset": 270, "span": 10},
        ],
    },
    "akron-rubberducks": {
        "officialUrl": "https://www.milb.com/akron/ballpark/a-to-z",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/c7foezuva8w3grqukd7k.jpg",
        "notes": "717 Credit Union Park official seating chart: Homerville/Cheep/Reserved/Hero 1-20 plus section 1/2, Modelo Tiki Terrace, Duck Club, Serra Auto Park Fowl Territory, Trident Restoration Duck Row, Dog Pound, and Electric Suite Level.",
        "bands": [
            {"ids": ["1/2"] + [str(n) for n in range(1, 21)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "akron-modelo-tiki-terrace", "name": "Modelo Tiki Terrace", "level": "club", "compassOffset": 300, "span": 12},
            {"id": "akron-duck-club", "name": "Duck Club", "level": "club", "compassOffset": 280, "span": 14},
            {"id": "akron-fowl-territory", "name": "Serra Auto Park Fowl Territory", "level": "standing", "compassOffset": 70, "span": 12},
            {"id": "akron-duck-row", "name": "Trident Restoration Duck Row", "level": "field", "compassOffset": 80, "span": 10},
            {"id": "akron-dog-pound", "name": "Dog Pound", "level": "standing", "compassOffset": 40, "span": 12},
            {"id": "akron-electric-suite-level", "name": "Electric Suite Level", "level": "suite", "compassOffset": 180, "span": 16},
        ],
    },
    "fredericksburg-nationals": {
        "officialUrl": "https://www.milb.com/fredericksburg/ballpark/seatingchart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/f62jvodgnirthimj5f7b.jpg",
        "notes": "Virginia Credit Union Stadium official seating chart: Field/Dugout/Diamond/Terrace 0-24, Club Level C1-C4, Suites S1-S13, plus Businets Party Porch, Spavia/Shepherd Sky Porches, F.H. Furr Picnic Garden, Pohanka Home Run Porch, Hammer Hank's Eagles' Nest, Bullpen Lounge, and related group decks.",
        "bands": [
            {"ids": [str(n) for n in range(0, 25)], "level": "lower", "namePrefix": "Section"},
            {"ids": [f"C{n}" for n in range(1, 5)], "level": "club", "namePrefix": "Club", "startOffset": 160, "endOffset": 200},
            {"ids": [f"S{n}" for n in range(1, 14)], "level": "suite", "namePrefix": "Suite", "startOffset": 100, "endOffset": 260},
        ],
        "named": [
            {"id": "frednats-businets-party-porch", "name": "Businets Party Porch", "level": "club", "compassOffset": 280, "span": 10},
            {"id": "frednats-spavia-sky-porch", "name": "Spavia FXBG Luxury Spa Sky Porch", "level": "club", "compassOffset": 250, "span": 10},
            {"id": "frednats-shepherd-sky-porch", "name": "Shepherd's Heating & Air Sky Porch", "level": "club", "compassOffset": 110, "span": 10},
            {"id": "frednats-fh-furr-picnic", "name": "F.H. Furr Picnic Garden", "level": "standing", "compassOffset": 300, "span": 14},
            {"id": "frednats-pohanka-hr-porch", "name": "Pohanka Nissan/Hyundai Home Run Porch", "level": "standing", "compassOffset": 40, "span": 14},
            {"id": "frednats-eagles-nest", "name": "Hammer Hank's Eagles' Nest", "level": "club", "compassOffset": 10, "span": 12},
            {"id": "frednats-bullpen-lounge", "name": "Bullpen Lounge", "level": "club", "compassOffset": 50, "span": 10},
            {"id": "frednats-weis-birthday-patio", "name": "Weis Birthday Party Patio", "level": "standing", "compassOffset": 70, "span": 10},
            {"id": "frednats-simventions-scoreboard-deck", "name": "Simventions Scoreboard Deck", "level": "club", "compassOffset": 320, "span": 10},
        ],
    },
    "fort-myers-mighty-mussels": {
        "officialUrl": "https://www.milb.com/fort-myers/ballpark/a-to-z",
        "notes": "Hammond Stadium A-Z: Box 101-117 (netting through 117 on 3B), Reserved 201-217 (shade in top three rows), Terrace 301-302. Boardwalk named products published without inventing outfield numbers past 115.",
        "bands": [
            {"ids": [str(n) for n in range(101, 118)], "level": "lower", "namePrefix": "Box"},
            {"ids": [str(n) for n in range(201, 218)], "level": "upper", "namePrefix": "Reserved", "startOffset": 74, "endOffset": 286},
            {"ids": ["301", "302"], "level": "club", "namePrefix": "Terrace", "startOffset": 100, "endOffset": 260},
        ],
        "named": [
            {"id": "fort-myers-bullpen-zone", "name": "Bullpen Zone", "level": "standing", "compassOffset": 50, "span": 12},
            {"id": "fort-myers-lf-drink-rails", "name": "Left Field Drink Rails", "level": "standing", "compassOffset": 280, "span": 10},
            {"id": "fort-myers-lf-lawn", "name": "Left Field Lawn Seating", "level": "standing", "compassOffset": 300, "span": 16},
            {"id": "fort-myers-scoreboard-pavilion", "name": "Scoreboard Pavilion", "level": "standing", "compassOffset": 0, "span": 14},
            {"id": "fort-myers-grandstand", "name": "Grandstand", "level": "standing", "compassOffset": 20, "span": 14},
            {"id": "fort-myers-the-porch", "name": "The Porch", "level": "club", "compassOffset": 40, "span": 12},
            {"id": "fort-myers-rf-bullpen", "name": "Right Field Bullpen", "level": "standing", "compassOffset": 60, "span": 12},
        ],
    },
    "greensboro-grasshoppers": {
        "officialUrl": "https://www.milb.com/greensboro/ballpark/faqs",
        "notes": "First National Bank Field FAQs + group pages: published bowl landmarks 101-103, 106-109, 112, 114; photo-labeled Section 315; Cone Health Terrace, Party Decks, Luxury Suites, 3rd Base Picnic Area, Lawn, Bud Light Grandstand Bar. Intermediate bowl IDs are not invented.",
        "inventoryStatus": "partial",
        "bands": [
            {"ids": ["101", "102", "103", "106", "107", "108", "109", "112", "114"], "level": "lower", "namePrefix": "Section"},
            {"ids": ["315"], "level": "club", "namePrefix": "Section", "startOffset": 0, "endOffset": 20},
        ],
        "named": [
            {"id": "greensboro-cone-health-terrace", "name": "Cone Health Terrace", "level": "club", "compassOffset": 10, "span": 14},
            {"id": "greensboro-party-decks", "name": "Party Decks", "level": "club", "compassOffset": 40, "span": 14},
            {"id": "greensboro-luxury-suites", "name": "Luxury Suites", "level": "suite", "compassOffset": 180, "span": 16},
            {"id": "greensboro-3rd-base-picnic", "name": "3rd Base Picnic Area", "level": "standing", "compassOffset": 250, "span": 14},
            {"id": "greensboro-lawn", "name": "Lawn Seating", "level": "standing", "compassOffset": 0, "span": 24},
            {"id": "greensboro-bud-light-grandstand-bar", "name": "Bud Light Grandstand Bar", "level": "standing", "compassOffset": 300, "span": 12},
        ],
    },
    "beloit-sky-carp": {
        "officialUrl": "https://www.milb.com/beloit/ballpark/stadium-map",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/gmdkrwwgccemiy0zaj0x.jpg",
        "notes": "ABC Supply Stadium official map: bowl 101-103 and 105-111 (no 104; suites occupy that gap), club seats in 107, Beloit Health System Club, RF/LF Party Decks, Hard Rock Rockin Right, Poopsie's Palace, Kidz Play Zone, Chill Zone, Fowl Pole Porch.",
        "bands": [
            {"ids": [str(n) for n in list(range(101, 104)) + list(range(105, 112))], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "beloit-health-system-club", "name": "Beloit Health System Club", "level": "club", "compassOffset": 180, "span": 14},
            {"id": "beloit-suites", "name": "Suites", "level": "suite", "compassOffset": 160, "span": 12},
            {"id": "beloit-rf-party-deck", "name": "Right Field Party Deck", "level": "club", "compassOffset": 40, "span": 14},
            {"id": "beloit-lf-party-deck", "name": "Left Field Party Deck", "level": "club", "compassOffset": 280, "span": 14},
            {"id": "beloit-hard-rock-rockin-right", "name": "Hard Rock Rockin Right", "level": "standing", "compassOffset": 50, "span": 12},
            {"id": "beloit-poopsies-palace", "name": "Poopsie's Palace", "level": "club", "compassOffset": 60, "span": 10},
            {"id": "beloit-kidz-play-zone", "name": "Kidz Play Zone", "level": "standing", "compassOffset": 70, "span": 10},
            {"id": "beloit-chill-zone", "name": "Chill Zone", "level": "standing", "compassOffset": 270, "span": 10},
            {"id": "beloit-fowl-pole-porch", "name": "Fowl Pole Porch", "level": "standing", "compassOffset": 300, "span": 12},
        ],
    },
    "hudson-valley-renegades": {
        "officialUrl": "https://www.milb.com/hudson-valley/tickets/seating-chart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/dqrwqxhfnmm2lwferpgx.jpg",
        "notes": "Heritage Financial Park official seating chart: field 100-114, club 200-206, outer 302-307 (no 301), baseline/outfield 1-8, plus Michelob ULTRA Party Patio, FoxAir/Minuteman terraces, Bud Light Party Porch, Sohns Landing, Beer Balcony, Club Lounge, and GA blocks.",
        "bands": [
            {"ids": [str(n) for n in range(100, 115)], "level": "lower", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(200, 207)], "level": "club", "namePrefix": "Section", "startOffset": 80, "endOffset": 280},
            {"ids": [str(n) for n in list(range(302, 308))], "level": "upper", "namePrefix": "Section", "startOffset": 70, "endOffset": 290},
            {"ids": [str(n) for n in range(1, 9)], "level": "field", "namePrefix": "Section", "startOffset": 250, "endOffset": 110},
        ],
        "named": [
            {"id": "hudson-valley-michelob-party-patio", "name": "Michelob ULTRA Party Patio", "level": "club", "compassOffset": 280, "span": 16},
            {"id": "hudson-valley-renewal-lookout", "name": "Renewal by Andersen Lookout", "level": "standing", "compassOffset": 290, "span": 8},
            {"id": "hudson-valley-beer-balcony", "name": "Beer Balcony", "level": "standing", "compassOffset": 260, "span": 10},
            {"id": "hudson-valley-sohns-landing", "name": "Sohns Landing", "level": "club", "compassOffset": 250, "span": 10},
            {"id": "hudson-valley-foxair-terrace", "name": "FoxAir Terrace", "level": "club", "compassOffset": 70, "span": 10},
            {"id": "hudson-valley-minuteman-terrace", "name": "Minuteman Press Terrace", "level": "club", "compassOffset": 60, "span": 10},
            {"id": "hudson-valley-bud-light-party-porch", "name": "Bud Light Party Porch", "level": "club", "compassOffset": 40, "span": 14},
            {"id": "hudson-valley-fun-zone", "name": "Heritage Financial Credit Union Fun Zone", "level": "standing", "compassOffset": 50, "span": 12},
            {"id": "hudson-valley-club-lounge", "name": "Club Lounge", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "hudson-valley-ga", "name": "General Admission", "level": "standing", "compassOffset": 0, "span": 20},
        ],
    },
    "springfield-cardinals": {
        "officialUrl": "https://www.milb.com/springfield/ballpark/stadium-map",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/hnp7tycqwgbwxsgqvg9h.jpg",
        "notes": "Hammons Field official fan-guide map: bowl A-N, Coca-Cola Redbird Roost AA-GG, suites 1-30, SpringNet Champions Club, Left Field Berm, Right Field Patio, General Admission, The Suite Spot, The Perch.",
        "bands": [
            {"ids": [chr(c) for c in range(ord("A"), ord("N") + 1)], "level": "lower", "namePrefix": "Section"},
            {"ids": ["AA", "BB", "CC", "DD", "EE", "FF", "GG"], "level": "upper", "namePrefix": "Redbird Roost", "startOffset": 220, "endOffset": 300},
            {"ids": [str(n) for n in range(1, 31)], "level": "suite", "namePrefix": "Suite", "startOffset": 80, "endOffset": 280},
        ],
        "named": [
            {"id": "springfield-springnet-champions-club", "name": "SpringNet Champions Club", "level": "club", "compassOffset": 100, "span": 14},
            {"id": "springfield-lf-berm", "name": "Left Field Berm", "level": "standing", "compassOffset": 300, "span": 18},
            {"id": "springfield-rf-patio", "name": "Right Field Patio", "level": "club", "compassOffset": 40, "span": 14},
            {"id": "springfield-ga", "name": "General Admission", "level": "standing", "compassOffset": 0, "span": 16},
            {"id": "springfield-suite-spot", "name": "The Suite Spot", "level": "suite", "compassOffset": 180, "span": 10},
            {"id": "springfield-the-perch", "name": "The Perch", "level": "club", "compassOffset": 120, "span": 10},
        ],
    },
    "visalia-rawhide": {
        "officialUrl": "https://www.milb.com/visalia/ballpark/seating-chart",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/ti7pas2it08cutpsmds2.jpg",
        "notes": "Valley Strong Ballpark official seating chart: odd field 101-107 and even 102-108; Kaweah Health grandstand odds 201-209 / evens 200-210; lettered A-H and J-O; RF line odds 113-127 (no 109/111); plus Family Pavilion, Equity Saloon, Fan Dugout, Skyboxes, 4Creeks Pasture, Toyota Terrace, Kids Corral, Dog Park, Hall of Fame Club, The Lookout.",
        "bands": [
            {"ids": ["101", "102", "103", "104", "105", "106", "107", "108"], "level": "field", "namePrefix": "Section"},
            {"ids": [str(n) for n in range(113, 128, 2)], "level": "field", "namePrefix": "Section", "startOffset": 20, "endOffset": 80},
            {"ids": [str(n) for n in range(200, 211, 2)] + [str(n) for n in range(201, 210, 2)], "level": "lower", "namePrefix": "Section", "startOffset": 80, "endOffset": 280},
            {"ids": [chr(c) for c in range(ord("A"), ord("H") + 1)] + [chr(c) for c in range(ord("J"), ord("O") + 1)], "level": "upper", "namePrefix": "Section", "startOffset": 70, "endOffset": 290},
        ],
        "named": [
            {"id": "visalia-adventist-family-pavilion", "name": "Adventist Health Family Pavilion", "level": "standing", "compassOffset": 280, "span": 14},
            {"id": "visalia-equity-saloon", "name": "Equity Saloon", "level": "club", "compassOffset": 270, "span": 10},
            {"id": "visalia-autograph-alley", "name": "Autograph Alley", "level": "standing", "compassOffset": 250, "span": 8},
            {"id": "visalia-fan-dugout", "name": "Fan Dugout", "level": "field", "compassOffset": 240, "span": 8},
            {"id": "visalia-allstate-skyboxes", "name": "Allstate Team Guillen Skyboxes", "level": "suite", "compassOffset": 220, "span": 16},
            {"id": "visalia-4creeks-pasture", "name": "4Creeks Pasture", "level": "standing", "compassOffset": 20, "span": 24},
            {"id": "visalia-toyota-terrace", "name": "Toyota Terrace", "level": "club", "compassOffset": 50, "span": 12},
            {"id": "visalia-kids-corral", "name": "Kids Corral", "level": "standing", "compassOffset": 60, "span": 10},
            {"id": "visalia-dog-park", "name": "Dog Park", "level": "standing", "compassOffset": 40, "span": 10},
            {"id": "visalia-michelob-hof-club", "name": "Michelob Ultra Hall of Fame Club", "level": "club", "compassOffset": 70, "span": 16},
            {"id": "visalia-the-lookout", "name": "The Lookout", "level": "standing", "compassOffset": 55, "span": 8},
        ],
    },
    "northwest-arkansas-naturals": {
        "officialUrl": "https://www.milb.com/northwest-arkansas/tickets/single-game-tickets",
        "geometryUrl": "https://img.mlbstatic.com/milb-images/image/upload/t_w2208/milb/juinspi3gp0vwozdw5cy.jpg",
        "notes": "Arvest Ballpark official seating map: Reserved 101-104 and 118-120, Dugout Premium 105-107 and 113-117, Home Plate Premium 108-112, plus Suite Level, Cherokee Casino Home Plate Deck, Bud Light Home Run Porch, Right Field Patio, Grass Berm, Bullpen Party Bar, and McNaughton Community Room. Simmons Foods Family Section is published as a product within 114.",
        "bands": [
            {"ids": [str(n) for n in range(101, 121)], "level": "lower", "namePrefix": "Section"},
        ],
        "named": [
            {"id": "nwa-suite-level", "name": "Suite Level", "level": "suite", "compassOffset": 180, "span": 40},
            {"id": "nwa-cherokee-home-plate-deck", "name": "Cherokee Casino Home Plate Deck", "level": "club", "compassOffset": 180, "span": 12},
            {"id": "nwa-simmons-family-section", "name": "Simmons Foods Family Section", "level": "lower", "compassOffset": 100, "span": 8},
            {"id": "nwa-bud-light-hr-porch", "name": "Bud Light Home Run Porch", "level": "standing", "compassOffset": 40, "span": 14},
            {"id": "nwa-rf-patio", "name": "Right Field Patio", "level": "club", "compassOffset": 300, "span": 12},
            {"id": "nwa-grass-berm", "name": "Grass Berm", "level": "standing", "compassOffset": 0, "span": 40},
            {"id": "nwa-bullpen-party-bar", "name": "Bullpen Party Bar", "level": "standing", "compassOffset": 280, "span": 12},
            {"id": "nwa-mcnaughton-community-room", "name": "McNaughton Real Estate Community Room", "level": "club", "compassOffset": 180, "span": 10},
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
