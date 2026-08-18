#!/usr/bin/env python3
"""Checksum-lock authoritative NGS datasheets for control candidates.

Each accepted numeric value must appear under the datasheet's explicit
"FGDC (95% conf, cm)" header and match the NGS Data Explorer value. This
script converts centimetres to feet only after both checks pass.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import math
from pathlib import Path
import re
from typing import Any

from acquireNgsOrthophotoControls import (
    NGS_POSITION_ACCURACY_URL,
    parse_optional_float,
    sha256_bytes,
    stable_sha256,
    fetch_bytes,
)


ANALYSIS_VERSION = "ngs-datasheet-horizontal-accuracy-evidence-v1"
DATASHEET_URL = "https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl"
DSDATA_SPECIFICATION_URL = "https://www.ngs.noaa.gov/DATASHEET/dsdata.pdf"
CENTIMETRES_PER_FOOT = 30.48


def normalize_datasheet_text(raw: bytes) -> str:
    decoded = raw.decode("utf-8", errors="replace")
    without_tags = re.sub(r"<[^>]*>", "", decoded)
    return html.unescape(without_tags).replace("\r\n", "\n").replace("\r", "\n")


def parse_datasheet_horizontal_accuracy(
    raw: bytes,
    pid: str,
    expected_api_value: float,
) -> dict[str, Any]:
    if len(pid) != 6 or not pid.isalnum():
        raise ValueError(f"Invalid NGS PID: {pid}")
    if not math.isfinite(expected_api_value) or expected_api_value <= 0:
        raise ValueError("Expected NGS API accuracy must be positive and finite")
    text = normalize_datasheet_text(raw)
    escaped_pid = re.escape(pid)
    identity_pattern = re.compile(
        rf"^\s*{escaped_pid}\s+PID\s+-\s+{escaped_pid}\s*$",
        re.MULTILINE,
    )
    unit_pattern = re.compile(
        rf"^\s*{escaped_pid}\s+FGDC\s+\(95%\s+conf,\s*cm\)",
        re.MULTILINE,
    )
    network_pattern = re.compile(
        rf"^\s*{escaped_pid}\s+NETWORK\s+"
        r"([0-9]+(?:\.[0-9]+)?)\s+"
        r"([0-9]+(?:\.[0-9]+)?)\s+"
        r"([+-]?[0-9]+(?:\.[0-9]+)?)\s+"
        r"([+-]?[0-9]+(?:\.[0-9]+)?)\s+"
        r"([+-]?[0-9]+(?:\.[0-9]+)?)\s+"
        r"([+-]?[0-9]+(?:\.[0-9]+)?)\s*$",
        re.MULTILINE,
    )
    if identity_pattern.search(text) is None:
        raise ValueError(f"NGS datasheet identity line is missing for {pid}")
    if unit_pattern.search(text) is None:
        raise ValueError(f"NGS datasheet lacks explicit 95-percent centimetre units for {pid}")
    match = network_pattern.search(text)
    if match is None:
        raise ValueError(f"NGS datasheet network-accuracy row is missing for {pid}")
    horizontal_centimetres = float(match.group(1))
    if not math.isclose(
        horizontal_centimetres,
        expected_api_value,
        rel_tol=0,
        abs_tol=1e-9,
    ):
        raise ValueError(
            f"NGS datasheet and API horizontal accuracy disagree for {pid}: "
            f"{horizontal_centimetres} versus {expected_api_value}"
        )
    return {
        "pid": pid,
        "confidenceDefinition": "FGDC circular horizontal 95 percent confidence",
        "datasheetUnit": "centimetres",
        "horizontalAccuracy95Centimetres": horizontal_centimetres,
        "horizontalAccuracy95Feet": horizontal_centimetres / CENTIMETRES_PER_FOOT,
        "ellipsoidHeightAccuracy95Centimetres": float(match.group(2)),
        "standardDeviationNorthCentimetres": float(match.group(3)),
        "standardDeviationEastCentimetres": float(match.group(4)),
        "standardDeviationHeightCentimetres": float(match.group(5)),
        "northEastCorrelation": float(match.group(6)),
    }


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--acquisition-manifest", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--pid", action="append", default=[])
    parser.add_argument("--reuse-existing-downloads", action="store_true")
    args = parser.parse_args()

    acquisition_bytes = args.acquisition_manifest.read_bytes()
    acquisition = json.loads(acquisition_bytes)
    if acquisition.get("artifactKind") != "ngs-orthophoto-control-acquisition":
        raise ValueError("Input has the wrong NGS acquisition artifact kind")
    radial_request = acquisition.get("requests", {}).get("radial", {})
    radial_path = Path(str(radial_request.get("localPath", "")))
    if not radial_path.is_file() or sha256_file(radial_path) != radial_request.get("sha256"):
        raise ValueError("NGS radial response is missing or has a hash mismatch")
    radial_response = json.loads(radial_path.read_bytes())
    if not isinstance(radial_response, list):
        raise ValueError("NGS radial response is not an array")
    raw_marks = {str(mark.get("pid")): mark for mark in radial_response}

    requested_pids = {pid.strip().upper() for pid in args.pid if pid.strip()}
    candidates: list[dict[str, Any]] = []
    for candidate in acquisition.get("candidates", []):
        pid = str(candidate.get("pid", ""))
        if pid not in raw_marks:
            raise ValueError(f"NGS acquisition candidate {pid} is absent from raw response")
        raw_value = parse_optional_float(raw_marks[pid].get("netAccHz"))
        candidate_value = candidate.get("networkHorizontalAccuracyRaw")
        if raw_value != candidate_value:
            raise ValueError(f"NGS candidate {pid} does not match the raw API response")
        if (
            candidate.get("positionSource") == "ADJUSTED"
            and isinstance(raw_value, float)
            and raw_value > 0
            and (not requested_pids or pid in requested_pids)
        ):
            candidates.append(candidate)
    found_pids = {str(candidate["pid"]) for candidate in candidates}
    missing_requested_pids = requested_pids - found_pids
    if missing_requested_pids:
        raise ValueError(
            "Requested PIDs are absent or lack adjusted numeric accuracy: "
            + ", ".join(sorted(missing_requested_pids))
        )

    args.output_dir.mkdir(parents=True, exist_ok=True)
    specification_path = args.output_dir / "ngs-dsdata-specification.pdf"
    if args.reuse_existing_downloads and specification_path.is_file():
        specification_bytes = specification_path.read_bytes()
        specification_request = {
            "requestedUrl": DSDATA_SPECIFICATION_URL,
            "resolvedUrl": DSDATA_SPECIFICATION_URL,
            "status": None,
            "contentType": "application/pdf",
            "contentLength": len(specification_bytes),
            "etag": None,
            "lastModified": None,
            "retrieval": "reused-existing-checksum-locked-download",
        }
    else:
        specification_bytes, specification_request = fetch_bytes(DSDATA_SPECIFICATION_URL)
        specification_path.write_bytes(specification_bytes)
    records: list[dict[str, Any]] = []
    for candidate in candidates:
        pid = str(candidate["pid"])
        url = f"{DATASHEET_URL}?PidBox={pid}"
        datasheet_path = args.output_dir / f"ngs-datasheet-{pid}.html"
        if args.reuse_existing_downloads and datasheet_path.is_file():
            datasheet_bytes = datasheet_path.read_bytes()
            request_metadata = {
                "requestedUrl": url,
                "resolvedUrl": url,
                "status": None,
                "contentType": "text/html",
                "contentLength": len(datasheet_bytes),
                "etag": None,
                "lastModified": None,
                "retrieval": "reused-existing-checksum-locked-download",
            }
        else:
            datasheet_bytes, request_metadata = fetch_bytes(url)
            datasheet_path.write_bytes(datasheet_bytes)
        parsed = parse_datasheet_horizontal_accuracy(
            datasheet_bytes,
            pid,
            float(candidate["networkHorizontalAccuracyRaw"]),
        )
        candidate_blockers = [
            blocker
            for blocker in candidate.get("controlEligibility", {}).get("blockers", [])
            if blocker != "NGS_HORIZONTAL_NETWORK_ACCURACY_UNIT_REQUIRES_DATASHEET"
        ]
        if parsed["horizontalAccuracy95Feet"] > 1.0:
            candidate_blockers.append("NGS_HORIZONTAL_NETWORK_ACCURACY_EXCEEDS_ONE_FOOT")
        records.append({
            "pid": pid,
            "candidate": candidate,
            "datasheet": {
                "url": url,
                "localPath": str(datasheet_path.resolve()),
                "sha256": sha256_bytes(datasheet_bytes),
                "request": request_metadata,
            },
            "parsedAccuracy": parsed,
            "controlEligibilityAfterDatasheet": {
                "eligible": len(candidate_blockers) == 0,
                "blockers": candidate_blockers,
            },
        })

    eligible = [
        record for record in records
        if record["controlEligibilityAfterDatasheet"]["eligible"]
    ]
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": acquisition.get("stadiumId"),
        "inputs": {
            "acquisitionManifestPath": str(args.acquisition_manifest.resolve()),
            "acquisitionManifestSha256": hashlib.sha256(acquisition_bytes).hexdigest(),
            "acquisitionArtifactVersion": acquisition.get("artifactVersion"),
            "radialResponsePath": str(radial_path.resolve()),
            "radialResponseSha256": radial_request.get("sha256"),
        },
        "sourceSemantics": {
            "dsdataSpecificationUrl": DSDATA_SPECIFICATION_URL,
            "dsdataSpecificationPath": str(specification_path.resolve()),
            "dsdataSpecificationSha256": sha256_bytes(specification_bytes),
            "dsdataSpecificationRequest": specification_request,
            "positionAccuracyExplanationUrl": NGS_POSITION_ACCURACY_URL,
        },
        "candidateCount": len(candidates),
        "requestedPids": sorted(requested_pids),
        "records": records,
    }
    blockers = [
        "NGS_MARKS_NOT_VISUALLY_MATCHED_TO_ORTHOPHOTO",
        "NGS_ORTHOPHOTO_CONTROL_RESIDUALS_NOT_COMPUTED",
    ]
    if len(eligible) < 3:
        blockers.append("FEWER_THAN_THREE_NGS_CONTROLS_PASS_DATASHEET_GATES")
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ngs-datasheet-horizontal-accuracy-evidence",
        "artifactVersion": f"sha256:{stable_sha256(stable)}",
        **stable,
        "geometryBoundary": {
            "establishesNumeric95PercentHorizontalAccuracy": bool(records),
            "establishesVisibleOrthophotoCorrespondences": False,
            "establishesOrthophotoTranslationOrRotation": False,
            "note": (
                "Each numeric value is accepted only when the authoritative datasheet "
                "states FGDC 95-percent confidence in centimetres and matches the API."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": blockers,
        },
    }
    manifest_path = args.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(manifest_path.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "datasheetCount": len(records),
        "datasheetEligibleControlCount": len(eligible),
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
