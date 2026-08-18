#!/usr/bin/env python3
"""Resolve MiLB coordinates, then measure HP→CF from OSM + Esri tiles.

Coordinate priority:
  1. Hand overrides for 2025–2026 new/renamed parks (Wikipedia / published).
  2. MLB Stats API defaultCoordinates when the API venue is the SAME park
     (name match or known rename). Stale leftover venue-ids are rejected.
  3. Wikipedia page coordinates for the authored park name.
  4. Authored milbStadiums.ts value, marked unverified.

OSM HP→CF: home plate is the baseball-pitch vertex nearest the grandstand
mass; center field is the pitch vertex farthest from HP. PCA is recorded
only as an undirected check — never shipped as the directed bearing.

Usage:
  python3 scripts/auditMilbGeometry.py --coords
  python3 scripts/auditMilbGeometry.py --tiles
  python3 scripts/auditMilbGeometry.py --osm
  python3 scripts/auditMilbGeometry.py --all
"""
from __future__ import annotations

import argparse
import json
import math
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from difflib import SequenceMatcher
from pathlib import Path

UA = "theshadium-milb-orientation-audit/1.0 (https://theshadium.com)"
INV_PATH = Path("/tmp/milb_inventory.json")
API_PATH = Path("/tmp/milb_mlb_api_coords.json")
OUT_COORDS = Path("/tmp/milb_resolved_coords.json")
OUT_OSM = Path("/tmp/milb_osm_directed.json")
TILE_DIR = Path("/tmp/milb-sat")

# Parks whose MLB venueId still points at a demolished / previous home.
# Values are Wikipedia / published coordinates of the CURRENT 2026 park.
CURRENT_PARK_OVERRIDES: dict[str, dict] = {
    "gwinnett-stripers": {
        "lat": 34.04096,
        "lon": -83.99379,
        "source": "MLB Stats API defaultCoordinates for Gwinnett Field + Wikipedia 34.040583,-83.992389",
    },
    "albuquerque-isotopes": {
        "lat": 35.06985,
        "lon": -106.62802,
        "source": "MLB Stats API Isotopes Park + Wikipedia 35.069722,-106.629167",
    },
    "rome-braves": {
        "lat": 34.28583,
        "lon": -85.16722,
        "source": "Wikipedia AdventHealth Stadium 34.28583,-85.16722 (file was ~4 km SW)",
    },
    "columbus-clingstones": {
        "lat": 32.45235,
        "lon": -84.99154,
        "source": "Wikipedia Synovus Park / Golden Park 32.452348,-84.991541 (MLB API still Trustmark Park, Pearl MS)",
    },
    "knoxville-smokies": {
        "lat": 35.97221,
        "lon": -83.91438,
        "source": "Wikipedia Covenant Health Park 35.9722125,-83.9143812 (MLB API still 2011 Smokies Stadium, Kodak)",
    },
    "salt-lake-bees": {
        "lat": 40.5497,
        "lon": -112.0225,
        "source": "Wikipedia The Ballpark at America First Square 40.5497,-112.0225 (MLB API still Smith's Ballpark)",
    },
    "oklahoma-city-dodgers": {
        "lat": 35.46496,
        "lon": -97.50805,
        "source": "Wikipedia Chickasaw Bricktown Ballpark 35.464961,-97.508050 (MLB venueId 2521 returned Knights Stadium)",
    },
    "worcester-red-sox": {
        "lat": 42.2672,
        "lon": -71.7978,
        "source": "Prior Polar Park correction; MLB API 42.25606 is ~1.2 km south of the diamond",
    },
}

# Same physical park, different sponsor name. Allows MLB API coords.
NAME_ALIASES: dict[str, list[str]] = {
    "coolray field": ["gwinnett field"],
    "gwinnett field": ["coolray field"],
    "innovative field": ["esl ballpark", "frontier field"],
    "canal park": ["7 17 credit union park"],
    "hadlock field": ["delta dental park"],
    "mgm park": ["keesler federal park"],
    "riverwalk stadium": ["dabos park"],
    "hammons field": ["route 66 stadium"],
    "riverfront stadium": ["equity bank park"],
    "mccormick field": ["hometrust park"],
    "funko field": ["everett memorial stadium"],
    "ron tonkin field": ["hillsboro ballpark"],
    "loanmart field": ["loanmart park", "morongo field"],
    "bank of the james stadium": ["city stadium"],
    "hammond stadium": ["lee health sports complex"],
    "vy star ballpark": ["vystar ballpark", "121 financial ballpark"],
}


def to_rad(d: float) -> float:
    return d * math.pi / 180.0


def hav_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371000.0
    p1, p2 = to_rad(lat1), to_rad(lat2)
    dphi = to_rad(lat2 - lat1)
    dl = to_rad(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(min(1.0, a)))


def normalize360(deg: float) -> float:
    return ((deg % 360.0) + 360.0) % 360.0


def angular_distance(a: float, b: float) -> float:
    d = abs(normalize360(a) - normalize360(b))
    return d if d <= 180.0 else 360.0 - d


def bearing_ll(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    φ1, φ2 = to_rad(lat1), to_rad(lat2)
    Δλ = to_rad(lon2 - lon1)
    y = math.sin(Δλ) * math.cos(φ2)
    x = math.cos(φ1) * math.sin(φ2) - math.sin(φ1) * math.cos(φ2) * math.cos(Δλ)
    return normalize360(math.degrees(math.atan2(y, x)))


def to_local(lat: float, lon: float, o_lat: float, o_lon: float) -> tuple[float, float]:
    return (
        (lon - o_lon) * 111320.0 * math.cos(to_rad(o_lat)),
        (lat - o_lat) * 111320.0,
    )


def norm_name(s: str) -> str:
    s = (s or "").lower()
    s = s.replace("&", " and ")
    s = re.sub(r"[^a-z0-9 ]+", " ", s)
    for w in ("stadium", "field", "park", "ballpark", "ball park", "at", "the", "jr"):
        s = re.sub(rf"\b{w}\b", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def names_match(a: str, b: str) -> bool:
    na, nb = norm_name(a), norm_name(b)
    if not na or not nb:
        return False
    if na == nb or na in nb or nb in na:
        return True
    if SequenceMatcher(None, na, nb).ratio() >= 0.55:
        return True
    aliases = NAME_ALIASES.get(a.lower(), []) + NAME_ALIASES.get(na, [])
    for alias in aliases:
        if norm_name(alias) == nb or SequenceMatcher(None, norm_name(alias), nb).ratio() >= 0.7:
            return True
    return False


def http_json(url: str, timeout: int = 30) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode())


def wikipedia_coords(title: str) -> tuple[float, float] | None:
    q = urllib.parse.urlencode({
        "action": "query",
        "prop": "coordinates",
        "titles": title,
        "format": "json",
        "redirects": 1,
    })
    data = http_json(f"https://en.wikipedia.org/w/api.php?{q}")
    pages = (data.get("query") or {}).get("pages") or {}
    for page in pages.values():
        coords = page.get("coordinates") or []
        if coords:
            return float(coords[0]["lat"]), float(coords[0]["lon"])
    return None


def wikipedia_search_coords(name: str, city: str, state: str) -> dict | None:
    for query in (name, f"{name} {city}", f"{name} baseball"):
        q = urllib.parse.urlencode({
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": 5,
            "format": "json",
        })
        try:
            data = http_json(f"https://en.wikipedia.org/w/api.php?{q}")
        except Exception:
            return None
        for hit in (data.get("query") or {}).get("search") or []:
            title = hit.get("title") or ""
            if not names_match(name, title) and name.lower() not in title.lower():
                # Allow if city appears and it looks like a ballpark.
                blob = (title + " " + (hit.get("snippet") or "")).lower()
                if name.lower() not in blob:
                    continue
            coords = wikipedia_coords(title)
            if coords:
                return {"title": title, "lat": coords[0], "lon": coords[1], "query": query}
        time.sleep(0.05)
    return None


def load_inv() -> list[dict]:
    return json.loads(INV_PATH.read_text())


def load_api() -> dict:
    raw = json.loads(API_PATH.read_text())
    return raw["results"]


def resolve_coords() -> list[dict]:
    inv = load_inv()
    api = load_api()
    out = []
    for row in inv:
        rec = {
            "id": row["id"],
            "name": row["name"],
            "team": row["team"],
            "level": row["level"],
            "city": row["city"],
            "state": row["state"],
            "fileLat": row["latitude"],
            "fileLon": row["longitude"],
            "fileOri": row["orientation"],
            "venueId": row["venueId"],
        }
        override = CURRENT_PARK_OVERRIDES.get(row["id"])
        api_row = api.get(str(int(row["venueId"])))
        wiki = None
        # Always try Wikipedia for parks we will move, plus parks >1 km from API.
        need_wiki = override is not None
        if api_row and api_row.get("lat") is not None:
            rec["apiName"] = api_row.get("apiName")
            rec["apiLat"] = api_row["lat"]
            rec["apiLon"] = api_row["lon"]
            rec["apiMatch"] = names_match(row["name"], api_row.get("apiName") or "")
            rec["apiDistM"] = round(hav_m(row["latitude"], row["longitude"], api_row["lat"], api_row["lon"]), 1)
            if rec["apiDistM"] > 1500 or not rec["apiMatch"]:
                need_wiki = True
        else:
            rec["apiMatch"] = False
            need_wiki = True

        if need_wiki:
            wiki = wikipedia_search_coords(row["name"], row["city"], row["state"])
            rec["wiki"] = wiki
            time.sleep(0.12)

        if override:
            rec["lat"] = override["lat"]
            rec["lon"] = override["lon"]
            rec["coordSource"] = "override"
            rec["coordNote"] = override["source"]
        elif rec.get("apiMatch") and rec.get("apiLat") is not None:
            rec["lat"] = rec["apiLat"]
            rec["lon"] = rec["apiLon"]
            rec["coordSource"] = "mlb-api"
            rec["coordNote"] = f"MLB Stats API {rec.get('apiName')}"
        elif wiki:
            rec["lat"] = wiki["lat"]
            rec["lon"] = wiki["lon"]
            rec["coordSource"] = "wikipedia"
            rec["coordNote"] = f"Wikipedia {wiki['title']}"
        else:
            rec["lat"] = row["latitude"]
            rec["lon"] = row["longitude"]
            rec["coordSource"] = "file-unverified"
            rec["coordNote"] = "No matching MLB API or Wikipedia coordinate; kept authored value"
        rec["moveM"] = round(hav_m(row["latitude"], row["longitude"], rec["lat"], rec["lon"]), 1)
        out.append(rec)
        print(
            f"{rec['id']:28} {rec['coordSource']:16} "
            f"{rec['lat']:.5f},{rec['lon']:.5f} move={rec['moveM']:.0f}m  {rec['coordNote'][:80]}",
            flush=True,
        )
    OUT_COORDS.write_text(json.dumps(out, indent=2))
    print(f"Wrote {OUT_COORDS}  moved>200m={sum(1 for r in out if r['moveM']>200)}")
    return out


def esri_tile_url(lat: float, lon: float, half_deg: float = 0.0032) -> str:
    bbox = f"{lon - half_deg},{lat - half_deg},{lon + half_deg},{lat + half_deg}"
    return (
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export"
        f"?bbox={bbox}&bboxSR=4326&imageSR=4326&size=800,800&format=jpg&f=image"
    )


def download_one_tile(row: dict) -> tuple[str, int]:
    TILE_DIR.mkdir(parents=True, exist_ok=True)
    dest = TILE_DIR / f"{row['id']}.jpg"
    url = esri_tile_url(row["lat"], row["lon"])
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    dest.write_bytes(data)
    return row["id"], len(data)


def download_tiles(rows: list[dict]) -> None:
    TILE_DIR.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = [pool.submit(download_one_tile, row) for row in rows]
        for fut in as_completed(futs):
            sid, n = fut.result()
            print(f"  tile {sid} {n} bytes", flush=True)
    print(f"Wrote tiles to {TILE_DIR}")


def pca(pts: list[tuple[float, float]]) -> dict | None:
    if len(pts) < 5:
        return None
    n = len(pts)
    mx = sum(p[0] for p in pts) / n
    my = sum(p[1] for p in pts) / n
    cxx = cyy = cxy = 0.0
    for x, y in pts:
        dx, dy = x - mx, y - my
        cxx += dx * dx
        cyy += dy * dy
        cxy += dx * dy
    cxx /= n
    cyy /= n
    cxy /= n
    tr = cxx + cyy
    det = cxx * cyy - cxy * cxy
    disc = max(0.0, (tr * tr) / 4.0 - det)
    l1 = tr / 2.0 + math.sqrt(disc)
    l2 = tr / 2.0 - math.sqrt(disc)
    if l1 <= 0:
        return None
    if abs(cxy) > 1e-12:
        vx, vy = l1 - cyy, cxy
    elif cxx >= cyy:
        vx, vy = 1.0, 0.0
    else:
        vx, vy = 0.0, 1.0
    mag = math.hypot(vx, vy) or 1.0
    ux, uy = vx / mag, vy / mag
    projs = [x * ux + y * uy for x, y in pts]
    orths = [-x * uy + y * ux for x, y in pts]
    return {
        "aspect": math.sqrt(l1 / l2) if l2 > 0 else 99.0,
        "length": max(projs) - min(projs),
        "width": max(orths) - min(orths),
        "area": abs(sum(pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1] for i in range(n))) / 2.0,
        "bearing180": normalize360(math.degrees(math.atan2(vx, vy))) % 180.0,
    }


def is_baseball(tags: dict[str, str]) -> bool:
    sport = (tags.get("sport") or "").lower()
    name = (tags.get("name") or "").lower()
    leisure = tags.get("leisure") or ""
    if "soccer" in sport and "baseball" not in sport:
        return False
    if any(x in sport for x in ("tennis", "basketball", "american_football", "football")):
        return False
    if "baseball" in sport:
        return True
    if leisure == "pitch" and any(k in name for k in ("ballpark", "diamond", "baseball")):
        return True
    return False


def is_grandstand(tags: dict[str, str]) -> bool:
    leisure = tags.get("leisure") or ""
    building = tags.get("building") or ""
    name = (tags.get("name") or "").lower()
    if leisure in ("stadium", "bleachers", "sports_centre"):
        return True
    if building in ("stadium", "grandstand", "bleachers"):
        return True
    if "grandstand" in name or "bleacher" in name:
        return True
    return False


def parse_osm(xml: str) -> list[dict]:
    root = ET.fromstring(xml)
    nodes = {
        n.attrib["id"]: (float(n.attrib["lat"]), float(n.attrib["lon"]))
        for n in root.findall("node")
        if "lat" in n.attrib
    }
    ways = []
    for w in root.findall("way"):
        tags = {t.attrib["k"]: t.attrib["v"] for t in w.findall("tag")}
        pts = []
        for nd in w.findall("nd"):
            p = nodes.get(nd.attrib["ref"])
            if p:
                pts.append(p)
        if len(pts) >= 4:
            ways.append({"id": w.attrib["id"], "tags": tags, "pts": pts})
    return ways


def fetch_map(lat: float, lon: float, d: float = 0.0036) -> str:
    bbox = f"{lon - d},{lat - d},{lon + d},{lat + d}"
    url = f"https://api.openstreetmap.org/api/0.6/map?bbox={bbox}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90) as resp:
        return resp.read().decode()


def field_score(pts_ll: list[tuple[float, float]], o_lat: float, o_lon: float, tagged: bool) -> tuple[float, dict] | None:
    pts = [to_local(lat, lon, o_lat, o_lon) for lat, lon in pts_ll]
    axis = pca(pts)
    if not axis:
        return None
    if not (2500 <= axis["area"] <= 32000):
        return None
    if axis["length"] < 70 or axis["width"] < 45:
        return None
    size_err = abs(axis["length"] - 130) / 130 + abs(axis["width"] - 110) / 110
    rank = (0 if tagged else 8) + size_err
    return rank, axis


def hp_cf_from_grandstand(pitch_ll: list[tuple[float, float]], stand_pts: list[tuple[float, float]]) -> dict | None:
    if not stand_pts:
        return None
    best_hp = None
    best_d = 1e18
    for plat, plon in pitch_ll:
        for slat, slon in stand_pts:
            dx = (plon - slon) * 111320.0 * math.cos(to_rad(plat))
            dy = (plat - slat) * 111320.0
            d = math.hypot(dx, dy)
            if d < best_d:
                best_d = d
                best_hp = (plat, plon)
    if not best_hp:
        return None
    best_cf = None
    best_cf_d = -1.0
    for plat, plon in pitch_ll:
        dx = (plon - best_hp[1]) * 111320.0 * math.cos(to_rad(plat))
        dy = (plat - best_hp[0]) * 111320.0
        d = math.hypot(dx, dy)
        if d > best_cf_d:
            best_cf_d = d
            best_cf = (plat, plon)
    if not best_cf or best_cf_d < 60:
        return None
    return {
        "method": "grandstand-nearest-hp",
        "bearing": bearing_ll(best_hp[0], best_hp[1], best_cf[0], best_cf[1]),
        "hp": {"lat": best_hp[0], "lon": best_hp[1]},
        "cf": {"lat": best_cf[0], "lon": best_cf[1]},
        "hpStandDistM": best_d,
        "hpCfDistM": best_cf_d,
    }


def measure_park(park: dict) -> dict:
    xml = fetch_map(park["lat"], park["lon"])
    ways = parse_osm(xml)
    pitches = []
    stands: list[tuple[float, float]] = []
    for w in ways:
        tags = w["tags"]
        if is_grandstand(tags):
            stands.extend(w["pts"])
        tagged = is_baseball(tags)
        scored = field_score(w["pts"], park["lat"], park["lon"], tagged)
        if not scored:
            continue
        rank, axis = scored
        if tagged or (axis["area"] >= 4000 and axis["length"] >= 90):
            pitches.append({
                "id": w["id"],
                "tags": {k: tags[k] for k in tags if k in ("name", "leisure", "sport")},
                "tagged": tagged,
                "rank": rank,
                "pts": w["pts"],
                "aspect": axis["aspect"],
                "lengthM": axis["length"],
                "widthM": axis["width"],
                "areaM2": axis["area"],
                "pca180": axis["bearing180"],
            })
    pitches.sort(key=lambda p: p["rank"])
    best = None
    if pitches:
        p = pitches[0]
        directed = hp_cf_from_grandstand(p["pts"], stands)
        payload = {
            "wayId": p["id"],
            "tags": p["tags"],
            "tagged": p["tagged"],
            "aspect": round(p["aspect"], 2),
            "lengthM": round(p["lengthM"], 1),
            "widthM": round(p["widthM"], 1),
            "areaM2": round(p["areaM2"], 0),
            "pca180": round(p["pca180"], 1),
            "nStands": len(stands),
        }
        if directed:
            payload.update({
                "method": directed["method"],
                "bearing": round(directed["bearing"], 1),
                "hp": directed["hp"],
                "cf": directed["cf"],
                "hpStandDistM": round(directed["hpStandDistM"], 1),
                "hpCfDistM": round(directed["hpCfDistM"], 1),
            })
        best = payload
    return {
        "id": park["id"],
        "xmlBytes": len(xml),
        "nPitches": len(pitches),
        "nStandPts": len(stands),
        "best": best,
        "candidates": [
            {
                "id": p["id"],
                "tags": p["tags"],
                "tagged": p["tagged"],
                "L": round(p["lengthM"], 1),
                "W": round(p["widthM"], 1),
                "area": round(p["areaM2"]),
                "pca180": round(p["pca180"], 1),
            }
            for p in pitches[:5]
        ],
    }


def measure_all_osm(rows: list[dict]) -> list[dict]:
    # Unique sites (Roger Dean is shared).
    unique = []
    seen = set()
    for row in rows:
        key = (round(row["lat"], 5), round(row["lon"], 5))
        if key in seen:
            continue
        seen.add(key)
        unique.append(row)

    measured = {}
    for i, park in enumerate(unique):
        print(f"[{i + 1}/{len(unique)}] OSM {park['id']}", flush=True)
        try:
            measured[park["id"]] = measure_park(park)
            best = measured[park["id"]].get("best") or {}
            if best.get("bearing") is not None:
                print(f"  bearing={best['bearing']:.1f} way={best.get('wayId')} {best.get('tags')}", flush=True)
            else:
                print("  no directed HP→CF", flush=True)
        except urllib.error.HTTPError as err:
            print(f"  HTTP {err.code}", flush=True)
            measured[park["id"]] = {"id": park["id"], "error": f"HTTP {err.code}"}
        except Exception as err:  # noqa: BLE001
            print(f"  ERR {err}", flush=True)
            measured[park["id"]] = {"id": park["id"], "error": str(err)}
        time.sleep(1.05)

    out = []
    for row in rows:
        key = (round(row["lat"], 5), round(row["lon"], 5))
        match = None
        for src in unique:
            if (round(src["lat"], 5), round(src["lon"], 5)) == key:
                match = measured.get(src["id"])
                break
        item = {
            **{k: row[k] for k in ("id", "name", "lat", "lon", "fileOri", "coordSource")},
            "osm": match,
        }
        if match and (match.get("best") or {}).get("bearing") is not None:
            item["osmBearing"] = match["best"]["bearing"]
            item["osmDelta"] = round(angular_distance(match["best"]["bearing"], row["fileOri"]), 1)
        out.append(item)
    OUT_OSM.write_text(json.dumps(out, indent=2))
    hits = sum(1 for r in out if r.get("osmBearing") is not None)
    print(f"Wrote {OUT_OSM} ({hits}/{len(out)} directed bearings)")
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--coords", action="store_true")
    parser.add_argument("--tiles", action="store_true")
    parser.add_argument("--osm", action="store_true")
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()
    if args.all:
        args.coords = args.tiles = args.osm = True
    if not (args.coords or args.tiles or args.osm):
        parser.error("pick --coords / --tiles / --osm / --all")

    rows = json.loads(OUT_COORDS.read_text()) if OUT_COORDS.exists() and not args.coords else None
    if args.coords or rows is None:
        rows = resolve_coords()
    if args.tiles:
        download_tiles(rows)
    if args.osm:
        measure_all_osm(rows)


if __name__ == "__main__":
    main()
