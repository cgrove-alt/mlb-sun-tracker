#!/usr/bin/env python3
"""Normalize field-orientation candidates to true north and audit agreement."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from pyproj import CRS, Proj


ANALYSIS_VERSION = "field-orientation-cross-source-audit-v1"
MAXIMUM_ORIENTATION_UNCERTAINTY_DEGREES = 1.0


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def circular_delta(first: float, second: float) -> float:
    return (first - second + 180.0) % 360.0 - 180.0


def circular_mean(values: list[float]) -> float:
    radians = np.deg2rad(np.asarray(values, dtype=np.float64))
    return math.degrees(math.atan2(float(np.sin(radians).mean()), float(np.cos(radians).mean()))) % 360.0


def grid_to_true(
    grid_bearing: float,
    crs: CRS,
    longitude: float,
    latitude: float,
) -> tuple[float, float]:
    convergence = float(Proj(crs).get_factors(longitude, latitude).meridian_convergence)
    return (grid_bearing + convergence) % 360.0, convergence


def load_json(path: Path) -> tuple[dict[str, Any], str]:
    content = path.read_bytes()
    return json.loads(content), hashlib.sha256(content).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--orthophoto", type=Path, required=True)
    parser.add_argument("--lidar-repeatability", type=Path, required=True)
    parser.add_argument("--broadcast", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()

    orthophoto, orthophoto_sha256 = load_json(arguments.orthophoto)
    lidar, lidar_sha256 = load_json(arguments.lidar_repeatability)
    broadcast, broadcast_sha256 = load_json(arguments.broadcast)
    if orthophoto.get("artifactKind") != "drcog-regulation-field-control-candidate":
        raise ValueError("Orthophoto input has the wrong artifact kind")
    if lidar.get("artifactKind") != "ticketmaster-lidar-registration-repeatability-audit":
        raise ValueError("LiDAR input has the wrong artifact kind")
    if broadcast.get("artifactKind") != "broadcast-field-shadow-orientation-audit":
        raise ValueError("Broadcast input has the wrong artifact kind")

    orthophoto_true = float(
        orthophoto["controls"]["fieldAxisBearingDegreesEastOfTrueNorth"]
    )
    orthophoto_grid = float(
        orthophoto["controls"]["fieldAxisBearingDegreesEastOfGridNorth"]
    )
    orthophoto_convergence = float(orthophoto["controls"]["meridianConvergenceDegrees"])

    lidar_candidates: list[dict[str, Any]] = []
    for candidate in lidar["candidates"]:
        candidate_path = Path(candidate["path"])
        if sha256_file(candidate_path) != candidate["sha256"]:
            raise ValueError(f"LiDAR candidate hash changed: {candidate_path}")
        candidate_artifact, _ = load_json(candidate_path)
        if candidate_artifact["artifactVersion"] != candidate["artifactVersion"]:
            raise ValueError(f"LiDAR candidate artifact version changed: {candidate_path}")
        longitude, latitude = candidate_artifact["transform"][
            "homePlateLongitudeLatitude"
        ]
        grid_bearing = float(candidate["fittedCenterFieldBearingDegrees"])
        true_bearing, convergence = grid_to_true(
            grid_bearing,
            CRS.from_epsg(6342),
            float(longitude),
            float(latitude),
        )
        lidar_candidates.append(
            {
                "pointSourceId": candidate["pointSourceId"],
                "gridBearingDegrees": grid_bearing,
                "trueBearingDegrees": true_bearing,
                "meridianConvergenceDegrees": convergence,
                "homePlateLongitudeLatitude": [longitude, latitude],
                "path": str(candidate_path.resolve()),
                "sha256": candidate["sha256"],
                "artifactVersion": candidate["artifactVersion"],
            }
        )
    lidar_true_mean = circular_mean(
        [item["trueBearingDegrees"] for item in lidar_candidates]
    )
    lidar_true_spread = max(
        abs(circular_delta(first["trueBearingDegrees"], second["trueBearingDegrees"]))
        for first_index, first in enumerate(lidar_candidates)
        for second in lidar_candidates[first_index + 1 :]
    )

    broadcast_nominal_values = [
        float(frame["nominalFrameBearingDegrees"]) for frame in broadcast["frames"]
    ]
    broadcast_nominal = circular_mean(broadcast_nominal_values)
    broadcast_uncertainty = float(broadcast["combined"]["absoluteDeltaP95Degrees"])

    source_families = [
        {
            "sourceFamily": "DRCOG 2022 orthophoto",
            "trueBearingDegrees": orthophoto_true,
            "independentAcquisition": True,
            "uncertainty95Degrees": None,
            "accuracyVerifiedAt95Percent": bool(
                orthophoto["validation"]["orthophotoAbsoluteAccuracyVerifiedAt95Percent"]
            ),
        },
        {
            "sourceFamily": "USGS 2020 LiDAR",
            "trueBearingDegrees": lidar_true_mean,
            "independentAcquisition": True,
            "uncertainty95Degrees": None,
            "accuracyVerifiedAt95Percent": False,
            "flightlineBearingSpreadDegrees": lidar_true_spread,
            "translationRepeatabilityPassed": bool(
                lidar["summary"]["positionRepeatabilityPassed"]
            ),
        },
        {
            "sourceFamily": "official MLB 2025 broadcast shadow",
            "trueBearingDegrees": broadcast_nominal,
            "independentAcquisition": True,
            "uncertainty95Degrees": broadcast_uncertainty,
            "accuracyVerifiedAt95Percent": bool(broadcast["gates"]["allPassed"]),
        },
    ]
    pairwise = []
    for first_index, first in enumerate(source_families):
        for second in source_families[first_index + 1 :]:
            delta = abs(
                circular_delta(
                    float(first["trueBearingDegrees"]),
                    float(second["trueBearingDegrees"]),
                )
            )
            pairwise.append(
                {
                    "firstSourceFamily": first["sourceFamily"],
                    "secondSourceFamily": second["sourceFamily"],
                    "absoluteDeltaDegrees": delta,
                    "withinOneDegree": delta <= MAXIMUM_ORIENTATION_UNCERTAINTY_DEGREES,
                }
            )
    maximum_family_delta = max(item["absoluteDeltaDegrees"] for item in pairwise)
    blockers = []
    if not orthophoto["validation"]["orthophotoAbsoluteAccuracyVerifiedAt95Percent"]:
        blockers.append("ORTHOPHOTO_EXTERNAL_ACCURACY_95_UNVERIFIED")
    if not lidar["summary"]["positionRepeatabilityPassed"]:
        blockers.append("LIDAR_TRANSLATION_REPEATABILITY_FAILED")
    if broadcast_uncertainty > MAXIMUM_ORIENTATION_UNCERTAINTY_DEGREES:
        blockers.append("BROADCAST_BEARING_UNCERTAINTY_EXCEEDS_ONE_DEGREE")
    if not broadcast["gates"]["independentDateCountPassed"]:
        blockers.append("BROADCAST_THREE_DATE_CONTROL_NOT_MET")
    if not broadcast["gates"]["solarAltitudeSpanPassed"]:
        blockers.append("BROADCAST_SOLAR_ALTITUDE_SPAN_NOT_MET")
    if maximum_family_delta > MAXIMUM_ORIENTATION_UNCERTAINTY_DEGREES:
        blockers.append("CROSS_SOURCE_MAXIMUM_DELTA_EXCEEDS_ONE_DEGREE")

    result: dict[str, Any] = {
        "schemaVersion": 1,
        "artifactKind": "field-orientation-cross-source-audit",
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": orthophoto["stadiumId"],
        "thresholds": {
            "maximumOrientationUncertainty95Degrees": (
                MAXIMUM_ORIENTATION_UNCERTAINTY_DEGREES
            )
        },
        "inputs": {
            "orthophoto": {
                "path": str(arguments.orthophoto.resolve()),
                "sha256": orthophoto_sha256,
                "artifactVersion": orthophoto["artifactVersion"],
            },
            "lidarRepeatability": {
                "path": str(arguments.lidar_repeatability.resolve()),
                "sha256": lidar_sha256,
                "artifactVersion": lidar["artifactVersion"],
            },
            "broadcast": {
                "path": str(arguments.broadcast.resolve()),
                "sha256": broadcast_sha256,
                "artifactVersion": broadcast["artifactVersion"],
            },
        },
        "northReference": {
            "target": "true north",
            "orthophotoGridBearingDegrees": orthophoto_grid,
            "orthophotoMeridianConvergenceDegrees": orthophoto_convergence,
            "orthophotoTrueBearingDegrees": orthophoto_true,
            "conversion": "true bearing equals grid bearing plus meridian convergence",
        },
        "lidarCandidates": lidar_candidates,
        "sourceFamilies": source_families,
        "pairwiseSourceAgreement": pairwise,
        "summary": {
            "candidateTrueBearingDegrees": circular_mean(
                [float(item["trueBearingDegrees"]) for item in source_families]
            ),
            "maximumSourceFamilyDeltaDegrees": maximum_family_delta,
            "allSourceFamilyDeltasWithinOneDegree": (
                maximum_family_delta <= MAXIMUM_ORIENTATION_UNCERTAINTY_DEGREES
            ),
            "lidarFlightlineBearingSpreadDegrees": lidar_true_spread,
            "lidarCandidateLineageConsistent": True,
        },
        "geometryBoundary": {
            "establishesTrueNorthNormalization": True,
            "establishesPublicationReadyOrientation": False,
            "establishesSurveyedWorldTranslation": False,
            "note": (
                "Agreement among unresolved candidates is diagnostic evidence, not a "
                "replacement for each source's missing 95-percent accuracy evidence."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": blockers,
        },
    }
    result["artifactVersion"] = artifact_version(result)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
