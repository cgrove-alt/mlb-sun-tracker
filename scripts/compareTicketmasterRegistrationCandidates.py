#!/usr/bin/env python3
"""Compare repeated Ticketmaster to LiDAR registration candidates."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
from pathlib import Path
from typing import Any


ANALYSIS_VERSION = "ticketmaster-registration-repeatability-v1"


def stable_sha256(value: Any) -> str:
    serialized = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def angle_delta(first: float, second: float) -> float:
    return (first - second + 180.0) % 360.0 - 180.0


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--candidate", type=Path, action="append", required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--maximum-position-delta-feet", type=float, default=1.0)
    parser.add_argument("--maximum-bearing-delta-degrees", type=float, default=1.0)
    args = parser.parse_args()
    if len(args.candidate) < 2:
        raise ValueError("At least two candidate files are required")

    candidates = []
    stadium_ids = set()
    row_versions = set()
    control_versions = set()
    manifest_versions = set()
    for path in args.candidate:
        content = path.read_bytes()
        value = json.loads(content)
        if value.get("analysisVersion") not in {
            "ticketmaster-lidar-plan-registration-v1",
            "ticketmaster-lidar-plan-registration-v2",
            "ticketmaster-lidar-plan-registration-v3",
        }:
            raise ValueError(f"Unexpected registration analysis version: {path}")
        stadium_ids.add(value.get("stadiumId"))
        row_versions.add(value.get("inputs", {}).get("rowArtifactVersion"))
        control_versions.add(
            value.get("inputs", {}).get("fieldControlArtifactVersion")
        )
        manifest_versions.add(
            value.get("inputs", {}).get("lidarManifestArtifactVersion")
        )
        transform = value["transform"]
        candidates.append(
            {
                "path": str(path.resolve()),
                "sha256": hashlib.sha256(content).hexdigest(),
                "artifactVersion": value.get("artifactVersion"),
                "pointSourceId": value.get("settings", {}).get("pointSourceId"),
                "homePlateEastFeetFromInputCenter": float(
                    transform["homePlateEastFeetFromInputCenter"]
                ),
                "homePlateNorthFeetFromInputCenter": float(
                    transform["homePlateNorthFeetFromInputCenter"]
                ),
                "fittedCenterFieldBearingDegrees": float(
                    transform["fittedCenterFieldBearingDegrees"]
                ),
                "publicationEligible": bool(
                    value.get("publication", {}).get("eligible")
                ),
            }
        )
    if len(stadium_ids) != 1 or None in stadium_ids:
        raise ValueError("Candidate stadium identifiers do not agree")
    if len(row_versions) != 1 or len(control_versions) != 1 or len(manifest_versions) != 1:
        raise ValueError("Candidates do not use identical source artifacts")

    pairwise = []
    for first, second in itertools.combinations(candidates, 2):
        east_delta = (
            first["homePlateEastFeetFromInputCenter"]
            - second["homePlateEastFeetFromInputCenter"]
        )
        north_delta = (
            first["homePlateNorthFeetFromInputCenter"]
            - second["homePlateNorthFeetFromInputCenter"]
        )
        position_delta = math.hypot(east_delta, north_delta)
        bearing_delta = abs(
            angle_delta(
                first["fittedCenterFieldBearingDegrees"],
                second["fittedCenterFieldBearingDegrees"],
            )
        )
        pairwise.append(
            {
                "firstPath": first["path"],
                "secondPath": second["path"],
                "firstPointSourceId": first["pointSourceId"],
                "secondPointSourceId": second["pointSourceId"],
                "eastDeltaFeet": east_delta,
                "northDeltaFeet": north_delta,
                "positionDeltaFeet": position_delta,
                "bearingDeltaDegrees": bearing_delta,
                "positionRepeatabilityPassed": (
                    position_delta <= args.maximum_position_delta_feet
                ),
                "bearingRepeatabilityPassed": (
                    bearing_delta <= args.maximum_bearing_delta_degrees
                ),
            }
        )
    maximum_position_delta = max(
        pair["positionDeltaFeet"] for pair in pairwise
    )
    maximum_bearing_delta = max(
        pair["bearingDeltaDegrees"] for pair in pairwise
    )
    position_passed = maximum_position_delta <= args.maximum_position_delta_feet
    bearing_passed = maximum_bearing_delta <= args.maximum_bearing_delta_degrees
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": next(iter(stadium_ids)),
        "inputs": {
            "candidates": [
                {
                    "path": candidate["path"],
                    "sha256": candidate["sha256"],
                    "artifactVersion": candidate["artifactVersion"],
                }
                for candidate in candidates
            ],
        },
        "sourceAgreement": {
            "rowArtifactVersion": next(iter(row_versions)),
            "fieldControlArtifactVersion": next(iter(control_versions)),
            "lidarManifestArtifactVersion": next(iter(manifest_versions)),
        },
        "thresholds": {
            "maximumPositionDeltaFeet": args.maximum_position_delta_feet,
            "maximumBearingDeltaDegrees": args.maximum_bearing_delta_degrees,
        },
        "candidates": candidates,
        "pairwise": pairwise,
        "summary": {
            "candidateCount": len(candidates),
            "pairCount": len(pairwise),
            "maximumPositionDeltaFeet": maximum_position_delta,
            "maximumBearingDeltaDegrees": maximum_bearing_delta,
            "positionRepeatabilityPassed": position_passed,
            "bearingRepeatabilityPassed": bearing_passed,
            "registrationRepeatabilityPassed": position_passed and bearing_passed,
        },
    }
    blockers = []
    if not position_passed:
        blockers.append("LIDAR_PLAN_TRANSLATION_REPEATABILITY_EXCEEDS_ONE_FOOT")
    if not bearing_passed:
        blockers.append("LIDAR_PLAN_BEARING_REPEATABILITY_EXCEEDS_ONE_DEGREE")
    blockers.extend(
        [
            "REPEATED_FITS_SHARE_THE_SAME_LIDAR_ACQUISITION",
            "INDEPENDENT_SURVEY_CONTROL_NOT_AVAILABLE",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ]
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ticketmaster-lidar-registration-repeatability-audit",
        "artifactVersion": "sha256:" + stable_sha256(stable),
        **stable,
        "geometryBoundary": {
            "testsAlgorithmicFlightLineRepeatability": True,
            "establishesIndependentSurveyAccuracy": False,
            "establishesPublicationReadyMetricGeometry": False,
            "note": (
                "Separate flight-line subsets expose model instability but are not "
                "independent surveyed controls."
            ),
        },
        "publication": {"eligible": False, "blockers": blockers},
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(artifact, indent=2))


if __name__ == "__main__":
    main()
