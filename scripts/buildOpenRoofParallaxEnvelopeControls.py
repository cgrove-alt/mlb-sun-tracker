#!/usr/bin/env python3
"""Build checksum-locked controls for one open-roof parallax envelope run."""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import date
from pathlib import Path
from typing import Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("base_controls", type=Path)
    parser.add_argument("event_evidence", type=Path)
    parser.add_argument("solar_windows", type=Path)
    parser.add_argument("candidate_id")
    parser.add_argument("output_json", type=Path)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    args = parse_args()
    base = json.loads(args.base_controls.read_text())
    event_evidence = json.loads(args.event_evidence.read_text())
    solar_windows = json.loads(args.solar_windows.read_text())
    if base.get("reviewStatus") != "reviewed-open-roof-parallax-depth-controls":
        raise ValueError("Base controls are not reviewed open-roof parallax depth controls")
    candidate = next(
        (
            item
            for item in event_evidence["candidates"]
            if item["candidateId"] == args.candidate_id
        ),
        None,
    )
    solar_window = next(
        (
            item
            for item in solar_windows["candidates"]
            if item["candidateId"] == args.candidate_id
        ),
        None,
    )
    if candidate is None or solar_window is None:
        raise ValueError("Candidate must exist in both event evidence and solar windows")
    if float(solar_window["eventWindowSeconds"]) > 30.0:
        raise ValueError("Candidate exceeds the unchanged 30-second timestamp gate")
    inputs = {
        "panoramaManifest": base["inputs"]["panoramaManifest"],
        "panoramaCalibration": base["inputs"]["panoramaCalibration"],
        "trueNorthOrientation": base["inputs"]["trueNorthOrientation"],
        "eventEvidence": {
            "sha256": sha256_file(args.event_evidence),
            **(
                {"artifactVersion": event_evidence["artifactVersion"]}
                if event_evidence.get("artifactVersion")
                else {}
            ),
        },
        "solarWindows": {
            "sha256": sha256_file(args.solar_windows),
            "artifactVersion": solar_windows["artifactVersion"],
        },
    }
    stable = {
        "schemaVersion": 1,
        "artifactKind": "reviewed-open-roof-parallax-envelope-controls",
        "reviewStatus": "reviewed-open-roof-parallax-envelope-controls",
        "stadiumId": base["stadiumId"],
        "sectionId": base["sectionId"],
        "reviewedOn": str(date.today()),
        "inputs": inputs,
        "event": {
            "candidateId": args.candidate_id,
            "independenceKey": candidate.get("evidence", {}).get(
                "independenceKey",
                candidate.get("independenceKey"),
            ),
            "eventWindowSeconds": solar_window["eventWindowSeconds"],
        },
        "coverageReview": base["coverageReview"],
        "roofStateReview": base["roofStateReview"],
        "depthClassReview": base["depthClassReview"],
        "envelopeReview": {
            "solarAngularRadiusDegrees": 0.2666,
            "orientationUncertaintySource": (
                "trueNorthOrientation.uncertainty.combinedTrueNorthOrientationDegrees"
            ),
            "timeUncertaintySource": "solarWindows start, midpoint, and end positions",
            "classificationRule": (
                "Every sampled direction must independently pass the same material class "
                "in disjoint training and holdout partner-camera partitions. Mixed or "
                "unresolved directions remain uncertain."
            ),
            "boundaryLabelExclusion": (
                "No broadcast boundary pixels, row labels, or predicted shade labels are inputs."
            ),
        },
    }
    result = {
        **stable,
        "artifactVersion": fingerprint(stable),
        "publicationEligible": False,
        "blockers": [
            "DEPTH_CLASSES_REQUIRE_DISJOINT_MATERIAL_HOLDOUTS",
            "ANGULAR_SAMPLE_CONTINUITY_REQUIRES_EDGE_HOLDOUTS",
            "INDEPENDENT_BROADCAST_ROW_BOUNDARY_NOT_YET_SCORED",
            "PARKED_OPEN_ROOF_PANEL_GEOMETRY_NOT_YET_ESTABLISHED",
            "ONLY_ONE_SECTION_IS_IN_SCOPE",
        ],
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output_json),
        "artifactVersion": result["artifactVersion"],
        "candidateId": args.candidate_id,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
