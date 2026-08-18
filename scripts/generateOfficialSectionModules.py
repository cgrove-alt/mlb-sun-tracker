#!/usr/bin/env python3
"""Emit TypeScript official-inventory modules from collected club maps."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path("/workspace")
NFL_JSON = ROOT / "tmp/nfl-official-inventories.json"

# Club-published inventories that are not IOMEDIA product lists.
NFL_SUPPLEMENTS = [
    {
        "stadiumId": "northwest-stadium",
        "league": "NFL",
        "orientation": 295,
        "angleConvention": "compass-from-north",
        "sourceKind": "official-static-chart",
        "officialUrl": "https://www.commanders.com/stadium/stadium-guide",
        "geometryUrl": "https://www.commanders.com/stadium/stadium-guide",
        "inventoryNotes": (
            "Commanders stadium guide: Dream Seats 1-42 correspond to the 100-level "
            "portals; main concourse 101-142 and 201-242; Pete Rozelle upper 401-454."
        ),
        "bands": [
            {"ids": [str(n) for n in range(1, 43)], "level": "field", "namePrefix": "Dream Seat", "wrap": True},
            {"ids": [str(n) for n in range(101, 143)], "level": "lower", "namePrefix": "Section", "wrap": True},
            {"ids": [str(n) for n in range(201, 243)], "level": "club", "namePrefix": "Section", "wrap": True},
            {"ids": [str(n) for n in range(401, 455)], "level": "upper", "namePrefix": "Section", "wrap": True},
        ],
        "named": [],
    },
    {
        "stadiumId": "caesars-superdome",
        "league": "NFL",
        "orientation": 30,
        "angleConvention": "compass-from-north",
        "sourceKind": "official-static-chart",
        "officialUrl": "https://www.caesarssuperdome.com/seating-charts",
        "geometryUrl": "https://www.caesarssuperdome.com/assets/img/2025-Saints-Seating-Chart-1-2-543f728e5f.jpg",
        "supplementalUrls": [
            "https://www.caesarssuperdome.com/assets/doc/Dome-FacilityGuide-d65d49f3d0.pdf"
        ],
        "inventoryNotes": (
            "2025 Saints seating chart plus the venue facility guide: Plaza 101-156, "
            "Loge 201-249 (guide cites 207 and 249), Terrace 501-548 and 601-652."
        ),
        "bands": [
            {"ids": [str(n) for n in range(101, 157)], "level": "lower", "namePrefix": "Plaza", "wrap": True},
            {"ids": [str(n) for n in range(201, 250)], "level": "club", "namePrefix": "Loge", "wrap": True},
            {"ids": [str(n) for n in range(501, 549)], "level": "upper", "namePrefix": "Terrace", "wrap": True},
            {"ids": [str(n) for n in range(601, 653)], "level": "upper", "namePrefix": "Terrace", "wrap": True},
        ],
        "named": [{"id": "CHAMPIONS-SQUARE", "name": "Champions Square", "level": "standing", "compassOffset": 0, "span": 16}],
    },
    {
        "stadiumId": "state-farm-stadium",
        "league": "NFL",
        "orientation": 330,
        "angleConvention": "compass-from-north",
        "sourceKind": "official-static-chart",
        "officialUrl": "https://www.statefarmstadium.com/seating-chart",
        "geometryUrl": "https://www.statefarmstadium.com/assets/doc/SFS-Seating-Map_2024_Cardinals-1a64c9845f.pdf",
        "supplementalUrls": ["https://www.statefarmstadium.com/a-z-guide"],
        "inventoryNotes": (
            "Official 2024 Cardinals seating map and A-Z guide: 100-level 101-144, "
            "club 201-247, terrace 401-455, plus the Casita Garden Club."
        ),
        "bands": [
            {"ids": [str(n) for n in range(101, 145)], "level": "lower", "namePrefix": "Section", "wrap": True},
            {"ids": [str(n) for n in range(201, 248)], "level": "club", "namePrefix": "Club", "wrap": True},
            {"ids": [str(n) for n in range(401, 456)], "level": "upper", "namePrefix": "Terrace", "wrap": True},
        ],
        "named": [{"id": "CASITA-GARDEN-CLUB", "name": "Casita Garden Club", "level": "club", "compassOffset": 180, "span": 14}],
    },
]


def ts_list(values: list[str]) -> str:
    return "[" + ", ".join(json.dumps(v) for v in values) + "]"


def emit_inventory(park: dict) -> str:
    bands = []
    for band in park["bands"]:
        extra = []
        if band.get("wrap"):
            extra.append("wrap: true")
        if band.get("startOffset") is not None:
            extra.append(f"startOffset: {band['startOffset']}")
        if band.get("endOffset") is not None:
            extra.append(f"endOffset: {band['endOffset']}")
        if band.get("coverage"):
            extra.append(f"coverage: {json.dumps(band['coverage'])}")
        extra_s = (", " + ", ".join(extra)) if extra else ""
        prefix = f", namePrefix: {json.dumps(band.get('namePrefix') or 'Section')}"
        bands.append(
            f"      {{ ids: {ts_list(band['ids'])}, level: {json.dumps(band['level'])}{prefix}{extra_s} }}"
        )
    named = []
    for place in park.get("named") or []:
        named.append(
            "      { "
            f"id: {json.dumps(place['id'])}, name: {json.dumps(place['name'])}, "
            f"level: {json.dumps(place['level'])}, compassOffset: {place.get('compassOffset', 90)}, "
            f"span: {place.get('span', 10)} }}"
        )
    notes = park.get("inventoryNotes")
    notes_line = f"\n    inventoryNotes: {json.dumps(notes)}," if notes else ""
    supp = park.get("supplementalUrls") or []
    supp_line = f"\n    supplementalUrls: {ts_list(supp)}," if supp else ""
    geom = park.get("geometryUrl")
    geom_line = f"\n    geometryUrl: {json.dumps(geom)}," if geom else ""
    named_block = ("[\n" + ",\n".join(named) + ",\n    ]") if named else "[]"
    return (
        f"  {json.dumps(park['stadiumId'])}: {{\n"
        f"    stadiumId: {json.dumps(park['stadiumId'])},\n"
        f"    league: {json.dumps(park['league'])},\n"
        f"    orientation: {park['orientation']},\n"
        f"    angleConvention: {json.dumps(park['angleConvention'])},\n"
        f"    sourceKind: {json.dumps(park['sourceKind'])},\n"
        f"    officialUrl: {json.dumps(park['officialUrl'])},{geom_line}{supp_line}{notes_line}\n"
        f"    bands: [\n" + ",\n".join(bands) + ",\n    ],\n"
        f"    named: {named_block},\n"
        f"  }}"
    )


def emit_provenance(park: dict, reviewed: str) -> str:
    count = sum(len(b["ids"]) for b in park["bands"]) + len(park.get("named") or [])
    notes = park.get("inventoryNotes")
    notes_line = f", inventoryNotes: {json.dumps(notes)}" if notes else ""
    geom = park.get("geometryUrl")
    geom_line = f", geometryUrl: {json.dumps(geom)}" if geom else ""
    supp = park.get("supplementalUrls") or []
    supp_line = f", supplementalUrls: {ts_list(supp)}" if supp else ""
    status = "partial" if park["stadiumId"] == "nissan-stadium" else "reconciled"
    return (
        f"  {json.dumps(park['stadiumId'])}: {{ stadiumId: {json.dumps(park['stadiumId'])}, "
        f"sourceKind: {json.dumps(park['sourceKind'])}, officialUrl: {json.dumps(park['officialUrl'])}"
        f"{geom_line}{supp_line}, sectionIdentity: 'source-backed', rowGeometry: 'modeled', "
        f"inventoryStatus: {json.dumps(status)}, currentInventoryCount: {count}, "
        f"sourceProductCount: {count}{notes_line}, reviewedOn: {json.dumps(reviewed)} }}"
    )


def main() -> None:
    payload = json.loads(NFL_JSON.read_text())
    parks = payload["parks"]
    have = {p["stadiumId"] for p in parks}
    for extra in NFL_SUPPLEMENTS:
        if extra["stadiumId"] not in have:
            parks.append(extra)
    parks.sort(key=lambda p: p["stadiumId"])

    inv_body = ",\n".join(emit_inventory(p) for p in parks)
    inv = (
        "import type { OfficialInventory } from '../officialTypes';\n\n"
        "/** Club-linked Virtual Venue product IDs or official published charts. */\n"
        "export const NFL_OFFICIAL_INVENTORIES: Record<string, OfficialInventory> = {\n"
        f"{inv_body},\n"
        "};\n"
    )
    (ROOT / "src/data/sections/nfl/officialInventories.ts").write_text(inv)

    prov_body = ",\n".join(emit_provenance(p, payload["reviewedOn"]) for p in parks)
    prov = (
        "import type { StadiumSectionProvenance } from './stadiumSectionProvenance';\n\n"
        "export const NFL_SECTION_PROVENANCE: Record<string, StadiumSectionProvenance> = {\n"
        f"{prov_body},\n"
        "};\n"
    )
    (ROOT / "src/data/nflSectionProvenance.ts").write_text(prov)
    print(f"wrote {len(parks)} NFL official inventories")


if __name__ == "__main__":
    main()
