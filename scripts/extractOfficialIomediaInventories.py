#!/usr/bin/env python3
"""Download club-linked IOMEDIA configs and emit official section inventories."""

from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    )
}

# Best club-linked Virtual Venue config per franchise / shared bowl.
NFL_IOMEDIA = {
    "highmark-stadium": "https://buffalobills.io-media.com/web/confignew.json",
    "hard-rock-stadium": "https://hardrockstadium.io-media.com/web/confignew.json",
    "gillette-stadium": "https://patriots.io-media.com/web/confignew.json",
    "metlife-stadium-jets": "https://newyorkjets.io-media.com/web/confignew.json",
    "metlife-stadium-giants": "https://giants.io-media.com/web/confignew.json",
    "m-t-bank-stadium": "https://baltimoreravens.io-media.com/web/confignew.json",
    "paycor-stadium": "https://bengals.io-media.com/web/confignew.json",
    "huntington-bank-field": "https://clevelandbrowns.io-media.com/web/confignew.json",
    "acrisure-stadium": "https://steelers.io-media.com/web/confignew.json",
    "nrg-stadium": "https://texans.io-media.com/web/confignew.json",
    "lucas-oil-stadium": "https://colts.io-media.com/web/confignew.json",
    "everbank-stadium": "https://jaguars.io-media.com/web/confignew.json",
    "nissan-stadium": "https://titans.io-media.com/web/confignew.json",
    "empower-field": "https://denverbroncos.io-media.com/web/confignew.json",
    "geha-field-arrowhead": "https://kcchiefs.io-media.com/web/confignew.json",
    "allegiant-stadium": "https://raiders.io-media.com/web/confignew.json",
    "sofi-stadium-chargers": "https://sofistadium.io-media.com/web/confignew.json",
    "sofi-stadium-rams": "https://sofistadium.io-media.com/web/confignew.json",
    "at-t-stadium": "https://cowboys.io-media.com/web/confignew.json",
    "lincoln-financial-field": "https://eagles.io-media.com/web/confignew.json",
    "soldier-field": "https://chicagobears.io-media.com/web/confignew.json",
    "ford-field": "https://lions.io-media.com/web/confignew.json",
    "lambeau-field": "https://packers.io-media.com/web/confignew.json",
    "us-bank-stadium": "https://vikings.io-media.com/web/confignew.json",
    "mercedes-benz-stadium": "https://atlantafalcons.io-media.com/web/confignew.json",
    "bank-of-america-stadium": "https://panthers.io-media.com/web/confignew.json",
    "raymond-james-stadium": "https://bucs.io-media.com/web/confignew.json",
    "levis-stadium": "https://levisstadium.io-media.com/web/confignew.json",
    "lumen-field": "https://seahawks.io-media.com/web/confignew.json",
}

OFFICIAL_PAGES = {
    "highmark-stadium": "https://www.buffalobills.com/stadium/",
    "hard-rock-stadium": "https://www.miamidolphins.com/stadium/",
    "gillette-stadium": "https://www.patriots.com/stadium/",
    "metlife-stadium-jets": "https://www.newyorkjets.com/stadium/",
    "metlife-stadium-giants": "https://www.giants.com/stadium/",
    "m-t-bank-stadium": "https://www.baltimoreravens.com/stadium/",
    "paycor-stadium": "https://www.bengals.com/stadium/",
    "huntington-bank-field": "https://www.clevelandbrowns.com/stadium/",
    "acrisure-stadium": "https://www.steelers.com/stadium/",
    "nrg-stadium": "https://www.houstontexans.com/stadium/",
    "lucas-oil-stadium": "https://www.colts.com/stadium/",
    "everbank-stadium": "https://www.jaguars.com/stadium/",
    "nissan-stadium": "https://www.tennesseetitans.com/stadium/",
    "empower-field": "https://www.denverbroncos.com/stadium/",
    "geha-field-arrowhead": "https://www.chiefs.com/stadium/",
    "allegiant-stadium": "https://www.raiders.com/stadium/",
    "sofi-stadium-chargers": "https://www.chargers.com/stadium/",
    "sofi-stadium-rams": "https://www.therams.com/stadium/",
    "at-t-stadium": "https://www.dallascowboys.com/stadium/",
    "lincoln-financial-field": "https://www.philadelphiaeagles.com/stadium/",
    "soldier-field": "https://www.chicagobears.com/stadium/",
    "ford-field": "https://www.detroitlions.com/stadium/",
    "lambeau-field": "https://www.packers.com/lambeau-field/",
    "us-bank-stadium": "https://www.vikings.com/stadium/",
    "mercedes-benz-stadium": "https://www.atlantafalcons.com/stadium/",
    "bank-of-america-stadium": "https://www.panthers.com/stadium/",
    "raymond-james-stadium": "https://www.buccaneers.com/stadium/",
    "levis-stadium": "https://www.49ers.com/stadium/",
    "lumen-field": "https://www.seahawks.com/stadium/",
}

CACHE = Path("/tmp/nfl-iomedia/configs")
OUT = Path("/workspace/tmp/nfl-official-inventories.json")


def fetch(url: str) -> bytes:
    CACHE.mkdir(parents=True, exist_ok=True)
    dest = CACHE / (re.sub(r"[^a-z0-9]+", "-", url)[-80:] + ".json")
    if dest.exists() and dest.stat().st_size > 1000:
        return dest.read_bytes()
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as resp:
        body = resp.read()
    dest.write_bytes(body)
    return body


def extract_ids(config: dict) -> list[str]:
    els = (config.get("cmdData") or {}).get("elements") or []
    ids: list[str] = []
    seen: set[str] = set()
    for el in els:
        if el.get("elementType") != "section":
            continue
        name = el.get("elementDaeModelName") or ""
        title = (el.get("elementTitle") or "").strip()
        subtitle = (el.get("elementSubTitle") or "").strip()
        token = None
        m = re.search(r"(?:Section|SEC|Sec)_([A-Za-z0-9]+)", name)
        if m:
            token = m.group(1)
        elif re.fullmatch(r"[A-Za-z]{0,4}\d{1,4}[A-Za-z]{0,3}", title) and title.lower() not in {"section", "row"}:
            token = title
        elif re.fullmatch(r"[A-Za-z]{0,4}\d{1,4}[A-Za-z]{0,3}", subtitle):
            token = subtitle
        if not token or token.lower() in {"section", "row"}:
            continue
        if token not in seen:
            seen.add(token)
            ids.append(token)
    return ids


def numeric_key(token: str) -> tuple[int, str]:
    m = re.search(r"(\d+)", token)
    return (int(m.group(1)) if m else 10_000, token)


def classify(token: str) -> str:
    upper = token.upper()
    if upper.startswith("VIP") or upper.startswith("SUITE") or upper.startswith("L") and re.fullmatch(r"L\d+", upper):
        return "suite"
    if upper.startswith("C") and re.search(r"\d", upper):
        return "club"
    m = re.search(r"(\d+)", token)
    if not m:
        return "standing"
    n = int(m.group(1))
    if n < 100:
        return "field"
    if n < 200:
        return "lower"
    if n < 300:
        return "club"
    if n < 500:
        return "upper"
    return "suite"


def prefix_for(level: str) -> str:
    return {
        "field": "Field",
        "lower": "Section",
        "club": "Club",
        "upper": "Upper",
        "suite": "Suite",
        "standing": "",
    }[level]


def build_bands(ids: list[str]) -> list[dict]:
    groups: dict[str, list[str]] = {}
    named: list[dict] = []
    for token in ids:
        level = classify(token)
        if level == "standing" and not re.search(r"\d", token):
            named.append(
                {
                    "id": token,
                    "name": token.replace("-", " ").replace("_", " "),
                    "level": "standing",
                    "span": 8,
                }
            )
            continue
        groups.setdefault(level, []).append(token)
    bands = []
    order = ["field", "lower", "club", "upper", "suite"]
    for level in order:
        tokens = sorted(set(groups.get(level, [])), key=numeric_key)
        if not tokens:
            continue
        bands.append(
            {
                "ids": tokens,
                "level": level,
                "namePrefix": prefix_for(level),
                "wrap": True,
            }
        )
    return bands, named


def parse_orientations() -> dict[str, int]:
    text = Path("/workspace/src/data/nflStadiums.ts").read_text()
    out = {}
    current = None
    for line in text.splitlines():
        mid = re.search(r"id:\s*'([^']+)'", line)
        if mid:
            current = mid.group(1)
        ori = re.search(r"orientation:\s*(\d+)", line)
        if ori and current:
            out[current] = int(ori.group(1))
    return out


def main() -> None:
    orientations = parse_orientations()
    parks = []
    for stadium_id, url in NFL_IOMEDIA.items():
        print(f"fetch {stadium_id}", flush=True)
        raw = fetch(url)
        config = json.loads(raw.decode("utf-8", "ignore"))
        ids = extract_ids(config)
        bands, named = build_bands(ids)
        parks.append(
            {
                "stadiumId": stadium_id,
                "league": "NFL",
                "orientation": orientations.get(stadium_id, 0),
                "angleConvention": "compass-from-north",
                "sourceKind": "club-linked-virtual-venue",
                "officialUrl": OFFICIAL_PAGES.get(stadium_id, url),
                "geometryUrl": url.replace("/web/confignew.json", "/"),
                "sectionIdentity": "source-backed",
                "rowGeometry": "modeled",
                "currentInventoryCount": sum(len(b["ids"]) for b in bands) + len(named),
                "sourceProductCount": len(ids),
                "ids": ids,
                "bands": bands,
                "named": named,
            }
        )
        print(f"  {stadium_id}: {len(ids)} products, bands={[ (b['level'], len(b['ids'])) for b in bands ]}", flush=True)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"reviewedOn": "2026-08-18", "parks": parks}, indent=2))
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
