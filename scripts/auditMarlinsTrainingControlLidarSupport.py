#!/usr/bin/env python3
"""Audit direct 2024 LiDAR support at locked Miami-Dade training controls."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from pyproj import CRS


RADII_METRES = (0.10, 0.20, 0.30, 0.50, 1.00, 2.00)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def axis_metres_per_unit(crs: CRS) -> float:
    if not crs.axis_info:
        raise ValueError("CRS does not declare a linear axis unit")
    factor = crs.axis_info[0].unit_conversion_factor
    if factor is None or not np.isfinite(factor) or factor <= 0:
        raise ValueError("CRS axis lacks a valid conversion to metres")
    return float(factor)


def values_summary(values: np.ndarray) -> dict[str, float | int | None]:
    if values.size == 0:
        return {"count": 0, "minimum": None, "median": None, "p98": None, "maximum": None}
    return {
        "count": int(values.size),
        "minimum": float(np.min(values)),
        "median": float(np.median(values)),
        "p98": float(np.percentile(values, 98)),
        "maximum": float(np.max(values)),
    }


def audit_control(control: dict[str, Any], lidar_path: Path) -> dict[str, Any]:
    with laspy.open(lidar_path) as source:
        source_crs = source.header.parse_crs()
        if source_crs is None:
            raise ValueError(f"LiDAR source has no embedded CRS: {lidar_path}")
        horizontal_crs = CRS.from_user_input(
            source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
        )
        horizontal_factor = axis_metres_per_unit(horizontal_crs)
        if horizontal_crs.to_epsg() != 6438:
            raise ValueError(f"Expected EPSG:6438 horizontal CRS: {lidar_path}")
        target_x = float(control["target"]["eastingUsSurveyFeet"]) * horizontal_factor
        target_y = float(control["target"]["northingUsSurveyFeet"]) * horizontal_factor
        maximum_radius = max(RADII_METRES)
        x_parts: list[np.ndarray] = []
        y_parts: list[np.ndarray] = []
        z_parts: list[np.ndarray] = []
        intensity_parts: list[np.ndarray] = []
        classification_parts: list[np.ndarray] = []
        for points in source.chunk_iterator(2_000_000):
            x = np.asarray(points.x, dtype=np.float64) * horizontal_factor
            y = np.asarray(points.y, dtype=np.float64) * horizontal_factor
            inside = (
                (np.abs(x - target_x) <= maximum_radius)
                & (np.abs(y - target_y) <= maximum_radius)
                & (np.asarray(points.classification) != 7)
            )
            if not inside.any():
                continue
            x_parts.append(x[inside])
            y_parts.append(y[inside])
            z_parts.append(np.asarray(points.z, dtype=np.float64)[inside] * horizontal_factor)
            intensity_parts.append(np.asarray(points.intensity, dtype=np.float64)[inside])
            classification_parts.append(np.asarray(points.classification, dtype=np.uint8)[inside])
    if not x_parts:
        return {
            "controlId": control["id"],
            "role": control["role"],
            "lidarPath": str(lidar_path),
            "lidarSha256": sha256(lidar_path),
            "targetEastingMetres": target_x,
            "targetNorthingMetres": target_y,
            "pointCountWithinRadiusMetres": {str(radius): 0 for radius in RADII_METRES},
            "nearestReturn": None,
            "directMarkIdentityResolved": False,
            "blockers": ["NO_NONNOISE_RETURN_WITHIN_TWO_METRES", "BRASS_DISK_IDENTITY_NOT_RESOLVED"],
        }
    x = np.concatenate(x_parts)
    y = np.concatenate(y_parts)
    z = np.concatenate(z_parts)
    intensity = np.concatenate(intensity_parts)
    classification = np.concatenate(classification_parts)
    distance = np.hypot(x - target_x, y - target_y)
    within_square_and_circle = distance <= max(RADII_METRES)
    x = x[within_square_and_circle]
    y = y[within_square_and_circle]
    z = z[within_square_and_circle]
    intensity = intensity[within_square_and_circle]
    classification = classification[within_square_and_circle]
    distance = distance[within_square_and_circle]
    nearest = int(np.argmin(distance)) if distance.size else None
    blockers = ["BRASS_DISK_IDENTITY_NOT_RESOLVED"]
    if nearest is None or float(distance[nearest]) > 0.30:
        blockers.insert(0, "NO_NONNOISE_RETURN_WITHIN_0_30_METRES")
    local_intensity = intensity[distance <= 2.0]
    nearest_intensity_percentile = None
    if nearest is not None and local_intensity.size:
        nearest_intensity_percentile = float(
            100.0 * np.count_nonzero(local_intensity <= intensity[nearest]) / local_intensity.size
        )
    return {
        "controlId": control["id"],
        "role": control["role"],
        "lidarPath": str(lidar_path),
        "lidarSha256": sha256(lidar_path),
        "targetEastingMetres": target_x,
        "targetNorthingMetres": target_y,
        "pointCountWithinRadiusMetres": {
            str(radius): int(np.count_nonzero(distance <= radius)) for radius in RADII_METRES
        },
        "nearestReturn": None if nearest is None else {
            "horizontalDistanceMetres": float(distance[nearest]),
            "deltaEastingMetres": float(x[nearest] - target_x),
            "deltaNorthingMetres": float(y[nearest] - target_y),
            "elevationMetres": float(z[nearest]),
            "intensity": int(intensity[nearest]),
            "classification": int(classification[nearest]),
            "localIntensityPercentileWithinTwoMetres": nearest_intensity_percentile,
        },
        "withinTwoMetres": {
            "horizontalDistanceMetres": values_summary(distance),
            "intensity": values_summary(intensity),
            "elevationMetres": values_summary(z),
            "classificationCounts": {
                str(key): int(value) for key, value in sorted(Counter(classification.tolist()).items())
            },
        },
        "directMarkIdentityResolved": False,
        "blockers": blockers,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--transforms", type=Path, required=True)
    parser.add_argument("--lidar-manifest", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    transforms = json.loads(arguments.transforms.read_text())
    lidar_manifest = json.loads(arguments.lidar_manifest.read_text())
    training = [control for control in transforms["controls"] if control["role"] == "training"]
    holdouts = [control for control in transforms["controls"] if control["role"] == "final-holdout"]
    if len(training) < 3 or len(holdouts) < 3:
        raise ValueError("Expected at least three locked training and final-holdout controls")
    selected_title_by_control = {
        record["controlId"]: record["selectedProduct"]["title"]
        for record in lidar_manifest["catalogRecords"]
    }
    tile_path_by_title = {tile["title"]: Path(tile["path"]) for tile in lidar_manifest["tiles"]}
    results = []
    for control in training:
        title = selected_title_by_control.get(control["id"])
        if title not in tile_path_by_title:
            raise ValueError(f"No acquired training tile for {control['id']}")
        results.append(audit_control(control, tile_path_by_title[title]))
    publication_blockers = sorted({blocker for result in results for blocker in result["blockers"]})
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "marlins-locked-training-control-lidar-support-audit",
        "source": {
            "transformsPath": str(arguments.transforms),
            "transformsSha256": sha256(arguments.transforms),
            "lidarManifestPath": str(arguments.lidar_manifest),
            "lidarManifestSha256": sha256(arguments.lidar_manifest),
        },
        "method": {
            "radiiMetres": list(RADII_METRES),
            "excludedClassification": 7,
            "identityRule": (
                "A LiDAR return near the expected coordinate is not assigned to a 3 to 4 inch brass disk "
                "without a unique observable intensity or geometric signature tied to the source recovery sheet."
            ),
            "holdoutAccess": "No final-holdout LiDAR file or image is read by this audit.",
        },
        "results": results,
        "publication": {
            "eligible": False,
            "blockers": publication_blockers,
        },
    }
    stable = json.dumps(artifact, sort_keys=True, separators=(",", ":")).encode()
    artifact["artifactVersion"] = f"sha256:{hashlib.sha256(stable).hexdigest()}"
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "results": [
            {
                "controlId": result["controlId"],
                "nearestReturn": result["nearestReturn"],
                "pointCountWithinRadiusMetres": result["pointCountWithinRadiusMetres"],
                "directMarkIdentityResolved": result["directMarkIdentityResolved"],
                "blockers": result["blockers"],
            }
            for result in results
        ],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
