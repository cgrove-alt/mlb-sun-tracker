#!/usr/bin/env python3
"""Measure NFL field long-axis bearings from OSM map extracts.

Looks for tagged american_football pitches first, then any closed way whose
PCA bounding box matches an NFL field (~110 m × 49 m). Writes JSON.
"""
from __future__ import annotations

import json
import math
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

# Unique NFL sites. Highmark uses the 2026 stadium (west of Abbott), not the
# demolished New Era / Ralph Wilson bowl.
PARKS = [
    ("highmark-stadium", 42.77306, -78.79222),
    ("hard-rock-stadium", 25.9580, -80.2389),
    ("gillette-stadium", 42.0909, -71.2643),
    ("metlife-stadium", 40.8128, -74.0742),
    ("m-t-bank-stadium", 39.2780, -76.6227),
    ("paycor-stadium", 39.0954, -84.5160),
    ("huntington-bank-field", 41.5061, -81.6995),
    ("acrisure-stadium", 40.4468, -80.0158),
    ("nrg-stadium", 29.6847, -95.4107),
    ("lucas-oil-stadium", 39.7601, -86.1639),
    ("everbank-stadium", 30.3239, -81.6373),
    ("nissan-stadium", 36.1665, -86.7713),
    ("empower-field", 39.7439, -105.0200),
    ("geha-field-arrowhead", 39.0489, -94.4839),
    ("allegiant-stadium", 36.0909, -115.1833),
    ("sofi-stadium", 33.9535, -118.3392),
    ("at-t-stadium", 32.7473, -97.0945),
    ("lincoln-financial-field", 39.9008, -75.1675),
    ("northwest-stadium", 38.9076, -76.8645),
    ("soldier-field", 41.8623, -87.6167),
    ("ford-field", 42.3400, -83.0456),
    ("lambeau-field", 44.5013, -88.0622),
    ("us-bank-stadium", 44.9738, -93.2575),
    ("mercedes-benz-stadium", 33.7554, -84.4009),
    ("bank-of-america-stadium", 35.2258, -80.8528),
    ("caesars-superdome", 29.9511, -90.0812),
    ("raymond-james-stadium", 27.9759, -82.5033),
    ("state-farm-stadium", 33.5276, -112.2626),
    ("levis-stadium", 37.4033, -121.9694),
    ("lumen-field", 47.5952, -122.3316),
]


def to_rad(d: float) -> float:
    return d * math.pi / 180.0


def normalize180(deg: float) -> float:
    return ((deg % 180.0) + 180.0) % 180.0


def normalize360(deg: float) -> float:
    return ((deg % 360.0) + 360.0) % 360.0


def pca_box(pts: list[tuple[float, float]]) -> dict | None:
    if len(pts) < 4:
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
    # Local x=east, y=north; bearing is clockwise from north = atan2(east, north)
    bearing = normalize360(math.degrees(math.atan2(ux, uy)))
    aspect = math.sqrt(l1 / l2) if l2 > 0 else 99.0
    projs = [x * ux + y * uy for x, y in pts]
    orths = [-x * uy + y * ux for x, y in pts]
    length = max(projs) - min(projs)
    width = max(orths) - min(orths)
    # shoelace area
    area = 0.0
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        area += x1 * y2 - x2 * y1
    area = abs(area) / 2.0
    return {
        "bearing360": bearing,
        "bearing180": normalize180(bearing),
        "aspect": aspect,
        "lengthM": length,
        "widthM": width,
        "areaM2": area,
        "n": n,
    }


def to_local(lat: float, lon: float, o_lat: float, o_lon: float) -> tuple[float, float]:
    return (
        (lon - o_lon) * 111320.0 * math.cos(to_rad(o_lat)),
        (lat - o_lat) * 111320.0,
    )


def is_football_tag(tags: dict[str, str]) -> bool:
    sport = (tags.get("sport") or "").lower()
    name = (tags.get("name") or "").lower()
    if any(x in sport for x in ("soccer", "baseball", "tennis", "basketball", "hockey")):
        return False
    if "american_football" in sport or "american football" in sport:
        return True
    if "football field" in name or "end zone" in name or "endzone" in name:
        return True
    if tags.get("leisure") == "pitch" and sport in ("football", "gridiron"):
        return True
    return False


def looks_like_nfl_field(axis: dict) -> bool:
    return (
        80.0 <= axis["lengthM"] <= 145.0
        and 38.0 <= axis["widthM"] <= 85.0
        and axis["aspect"] >= 1.55
        and 3000.0 <= axis["areaM2"] <= 14000.0
    )


def parse_osm(xml: str, o_lat: float, o_lon: float) -> list[dict]:
    root = ET.fromstring(xml)
    nodes: dict[str, tuple[float, float]] = {}
    for n in root.findall("node"):
        nodes[n.attrib["id"]] = (float(n.attrib["lat"]), float(n.attrib["lon"]))

    cands: list[dict] = []

    def consider(kind: str, oid: str, tags: dict[str, str], pts_ll: list[tuple[float, float]]) -> None:
        pts = [to_local(lat, lon, o_lat, o_lon) for lat, lon in pts_ll]
        axis = pca_box(pts)
        if not axis:
            return
        tagged = is_football_tag(tags)
        fieldish = looks_like_nfl_field(axis)
        if not tagged and not fieldish:
            return
        cands.append({
            "kind": kind,
            "id": oid,
            "tags": {k: tags[k] for k in tags if k in ("name", "leisure", "sport", "building")},
            "taggedFootball": tagged,
            "fieldShaped": fieldish,
            **{k: (round(v, 2) if isinstance(v, float) else v) for k, v in axis.items()},
        })

    for w in root.findall("way"):
        tags = {t.attrib["k"]: t.attrib["v"] for t in w.findall("tag")}
        pts = []
        for nd in w.findall("nd"):
            p = nodes.get(nd.attrib["ref"])
            if p:
                pts.append(p)
        if len(pts) >= 6:
            consider("way", w.attrib["id"], tags, pts)

    # Relations: gather member node coords if the relation itself is a pitch
    for rel in root.findall("relation"):
        tags = {t.attrib["k"]: t.attrib["v"] for t in rel.findall("tag")}
        if not is_football_tag(tags) and tags.get("leisure") not in ("pitch", "stadium"):
            continue
        pts = []
        for mem in rel.findall("member"):
            if mem.attrib.get("type") == "node":
                p = nodes.get(mem.attrib["ref"])
                if p:
                    pts.append(p)
        if len(pts) >= 6:
            consider("relation", rel.attrib["id"], tags, pts)

    return cands


def fetch_map(lat: float, lon: float, d: float = 0.0042) -> str:
    bbox = f"{lon - d},{lat - d},{lon + d},{lat + d}"
    url = f"https://api.openstreetmap.org/api/0.6/map?bbox={bbox}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "theshadium-nfl-orientation-audit/1.0 (https://theshadium.com)"},
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        return resp.read().decode()


def pick_best(cands: list[dict]) -> dict | None:
    if not cands:
        return None

    def rank(c: dict) -> tuple:
        # Prefer tagged football + field-shaped, then tagged, then field-shaped.
        bucket = 0 if (c["taggedFootball"] and c["fieldShaped"]) else (
            1 if c["taggedFootball"] else 2
        )
        # Prefer NFL-sized aspect (~2.25) and ~110×49
        size_err = abs(c["lengthM"] - 109.7) / 109.7 + abs(c["widthM"] - 48.8) / 48.8
        return (bucket, size_err, -c["aspect"])

    return sorted(cands, key=rank)[0]


def main() -> None:
    results = []
    for i, (sid, lat, lon) in enumerate(PARKS):
        print(f"[{i + 1}/{len(PARKS)}] {sid}", flush=True)
        try:
            xml = fetch_map(lat, lon)
            cands = parse_osm(xml, lat, lon)
            best = pick_best(cands)
            row = {
                "id": sid,
                "lat": lat,
                "lon": lon,
                "xmlBytes": len(xml),
                "nCandidates": len(cands),
                "best": best,
                "candidates": cands[:8],
            }
            if best:
                print(
                    f"  osm={best['bearing180']:6.1f} L={best['lengthM']:.0f} "
                    f"W={best['widthM']:.0f} asp={best['aspect']:.2f} "
                    f"tag={best['taggedFootball']} way={best['kind']}/{best['id']} "
                    f"{best['tags']}",
                    flush=True,
                )
            else:
                print("  no field-like way", flush=True)
        except urllib.error.HTTPError as err:
            print(f"  HTTP {err.code}", flush=True)
            row = {"id": sid, "error": f"HTTP {err.code} {err.reason}"}
        except Exception as err:  # noqa: BLE001
            print(f"  ERR {err}", flush=True)
            row = {"id": sid, "error": str(err)}
        results.append(row)
        time.sleep(1.1)

    out = Path("/tmp/nfl-osm-field-axes.json")
    out.write_text(json.dumps(results, indent=2))
    print(f"Wrote {out} ({len(results)} parks)")


if __name__ == "__main__":
    main()
