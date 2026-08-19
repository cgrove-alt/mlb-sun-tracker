#!/usr/bin/env python3
"""Find club-linked interactive maps and extract official section product IDs."""

from __future__ import annotations

import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"}
OUT = Path("/workspace/tmp/official-map-discovery.json")

NFL = {
    "highmark-stadium": ["buffalobills", "bills", "highmarkstadium"],
    "hard-rock-stadium": ["miamidolphins", "dolphins", "hardrockstadium"],
    "gillette-stadium": ["patriots", "newenglandpatriots", "gillettestadium"],
    "metlife-stadium-jets": ["newyorkjets", "jets", "metlifestadium"],
    "metlife-stadium-giants": ["giants", "newyorkgiants", "metlifestadium"],
    "m-t-bank-stadium": ["ravens", "baltimoreravens", "mtbankstadium"],
    "paycor-stadium": ["bengals", "cincinnatibengals", "paycorstadium"],
    "huntington-bank-field": ["browns", "clevelandbrowns", "huntingtonbankfield"],
    "acrisure-stadium": ["steelers", "pittsburghsteelers", "acrisurestadium"],
    "nrg-stadium": ["texans", "houstontexans", "nrgstadium"],
    "lucas-oil-stadium": ["colts", "indianapoliscolts", "lucasoilstadium"],
    "everbank-stadium": ["jaguars", "jacksonvillejaguars", "everbankstadium"],
    "nissan-stadium": ["titans", "tennesseetitans", "nissanstadium"],
    "empower-field": ["broncos", "denverbroncos", "empowerfield"],
    "geha-field-arrowhead": ["chiefs", "kansascitychiefs", "arrowhead"],
    "allegiant-stadium": ["raiders", "lasvegasraiders", "allegiantstadium"],
    "sofi-stadium-chargers": ["chargers", "losangeleschargers", "sofistadium"],
    "sofi-stadium-rams": ["rams", "losangelesrams", "sofistadium"],
    "at-t-stadium": ["dallascowboys", "cowboys", "attstadium"],
    "lincoln-financial-field": ["eagles", "philadelphiaeagles", "lincolnfinancialfield"],
    "northwest-stadium": ["commanders", "washingtoncommanders", "northweststadium"],
    "soldier-field": ["bears", "chicagobears", "soldierfield"],
    "ford-field": ["lions", "detroitlions", "fordfield"],
    "lambeau-field": ["packers", "greenbaypackers", "lambeaufield"],
    "us-bank-stadium": ["vikings", "minnesotavikings", "usbankstadium"],
    "mercedes-benz-stadium": ["falcons", "atlantafalcons", "mercedesbenzstadium"],
    "bank-of-america-stadium": ["panthers", "carolinapanthers", "bankofamericastadium"],
    "caesars-superdome": ["saints", "neworleanssaints", "caesarssuperdome"],
    "raymond-james-stadium": ["buccaneers", "tampabaybuccaneers", "raymondjamesstadium"],
    "state-farm-stadium": ["cardinals", "arizonacardinals", "statefarmstadium"],
    "levis-stadium": ["49ers", "sf49ers", "levisstadium"],
    "lumen-field": ["seahawks", "seattleseahawks", "lumenfield"],
}

DIGITAL_VENUE = [
    "sofi-stadium", "metlife-stadium", "lambeau-field", "allegiant-stadium",
    "at-t-stadium", "us-bank-stadium", "mercedes-benz-stadium", "nrg-stadium",
    "lucas-oil-stadium", "hard-rock-stadium", "gillette-stadium",
    "lincoln-financial-field", "soldier-field", "ford-field", "empower-field",
    "arrowhead-stadium", "lumen-field", "levis-stadium", "raymond-james-stadium",
    "bank-of-america-stadium", "caesars-superdome", "state-farm-stadium",
    "nissan-stadium", "everbank-stadium", "paycor-stadium", "acrisure-stadium",
    "huntington-bank-field", "northwest-stadium", "highmark-stadium",
    "mt-bank-stadium", "m-t-bank-stadium",
]


def get(url: str, timeout: float = 15) -> tuple[int | None, str, bytes]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.geturl(), resp.read()
    except Exception as e:
        return None, url, str(e).encode()


def extract_iomedia_ids(blob: bytes) -> list[str]:
    try:
        data = json.loads(blob.decode("utf-8", "ignore"))
    except Exception:
        return []
    els = (data.get("cmdData") or {}).get("elements") or []
    ids = []
    for el in els:
        if el.get("elementType") != "section":
            continue
        name = el.get("elementDaeModelName") or ""
        m = re.search(r"Section_([A-Za-z0-9]+)", name)
        title = (el.get("elementTitle") or "").strip()
        if m:
            ids.append(m.group(1))
        elif re.fullmatch(r"[A-Za-z0-9\-]{1,12}", title) and title.lower() != "section":
            ids.append(title)
    # unique preserve
    out, seen = [], set()
    for i in ids:
        if i not in seen:
            seen.add(i)
            out.append(i)
    return out


def probe_iomedia(slug: str) -> dict | None:
    for host in (f"https://{slug}.io-media.com", f"https://{slug}.io-media.com/web"):
        status, final, body = get(host + "/index.html")
        if status != 200:
            status, final, body = get(host + "/")
        if status != 200:
            continue
        cfg_status, cfg_url, cfg = get(host.replace("/web", "") + "/web/confignew.json")
        if cfg_status != 200:
            cfg_status, cfg_url, cfg = get(host + "/confignew.json")
        ids = extract_iomedia_ids(cfg) if cfg_status == 200 else []
        if b"Virtual Venue" in body or b"IOMEDIA" in body or ids:
            return {
                "kind": "club-linked-virtual-venue",
                "url": final,
                "configUrl": cfg_url if cfg_status == 200 else None,
                "ids": ids,
                "idCount": len(ids),
            }
    return None


def probe_3dv(slug: str) -> dict | None:
    for host in (
        f"https://venues.3ddigitalvenue.com/{slug}",
        f"https://map.3ddigitalvenue.com/{slug}",
        f"https://preview.3ddigitalvenue.com/{slug}",
    ):
        status, final, body = get(host)
        if status == 200 and (b"3d" in body.lower() or b"venue" in body.lower()):
            return {"kind": "club-linked-3d-map", "url": final, "ids": [], "idCount": 0}
    return None


def main() -> None:
    results = {}
    print("probing NFL IOMEDIA...", flush=True)
    with ThreadPoolExecutor(max_workers=10) as pool:
        futs = {}
        for stadium, slugs in NFL.items():
            for slug in slugs:
                futs[pool.submit(probe_iomedia, slug)] = (stadium, slug, "iomedia")
            for slug in slugs:
                futs[pool.submit(probe_3dv, slug)] = (stadium, slug, "3dv")
        for slug in DIGITAL_VENUE:
            futs[pool.submit(probe_3dv, slug)] = (slug, slug, "3dv-extra")
        for fut in as_completed(futs):
            stadium, slug, kind = futs[fut]
            try:
                hit = fut.result()
            except Exception as e:
                print(f"  fail {stadium} {slug}: {e}", flush=True)
                continue
            if not hit:
                continue
            rec = results.setdefault(stadium, {"hits": []})
            rec["hits"].append({"slug": slug, **hit})
            print(f"  HIT {stadium} {kind} {slug} ids={hit.get('idCount')} {hit.get('url')}", flush=True)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(results, indent=2))
    print(f"wrote {OUT} parks_with_hits={len(results)}")


if __name__ == "__main__":
    main()
