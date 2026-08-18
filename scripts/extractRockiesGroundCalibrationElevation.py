#!/usr/bin/env python3
"""Extract the relative LiDAR elevation of a calibration-only ground feature."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import laspy
import numpy as np
from pyproj import Transformer

from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-ground-calibration-elevation-v1"
METRES_TO_FEET = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("calibration_extraction", type=Path)
    parser.add_argument("field_elevations", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--selected-radius-metres", type=float, choices=(1.5, 2.0), default=1.5)
    parser.add_argument(
        "--lidar",
        type=Path,
        default=Path(
            "tmp/lidar/rockies-usgs-co-drcog-2020-b20/"
            "USGS_LPC_CO_DRCOG_2020_B20_w0499n4399.laz"
        ),
    )
    args = parser.parse_args()

    calibration_bytes = args.calibration_extraction.read_bytes()
    calibration = json.loads(calibration_bytes)
    if calibration.get("analysisVersion") != "rockies-panorama-outfield-ground-holdout-extraction-v1":
        raise ValueError("Unsupported calibration extraction")
    boundary = calibration["geometryBoundary"]
    if not boundary.get("establishesCalibrationObservation"):
        raise ValueError("Input is not restricted to calibration")
    if boundary.get("establishesIndependentHoldoutObservation"):
        raise ValueError("Calibration input cannot also be a holdout")

    field_bytes = args.field_elevations.read_bytes()
    field = json.loads(field_bytes)
    if field.get("analysisVersion") != "rockies-regulation-field-ground-elevations-v1":
        raise ValueError("Unsupported field elevations")
    lidar_expected = field["inputs"]["lidarSha256"]
    if sha256_file(args.lidar) != lidar_expected:
        raise ValueError("LiDAR checksum differs")

    state_plane = np.asarray(
        calibration["orthophotoObservation"]["ngsCorrectedProjectedFeet"],
        dtype=np.float64,
    )
    transformer = Transformer.from_crs(6428, 6342, always_xy=True)
    utm = np.asarray(transformer.transform(*state_plane), dtype=np.float64)
    radii = [0.5, 1.0, 1.5, 2.0]
    samples = {radius: [] for radius in radii}
    with laspy.open(args.lidar) as source:
        for points in source.chunk_iterator(1_000_000):
            x_values = np.asarray(points.x)
            y_values = np.asarray(points.y)
            z_values = np.asarray(points.z)
            classifications = np.asarray(points.classification)
            distance_squared = (x_values - utm[0]) ** 2 + (y_values - utm[1]) ** 2
            for radius in radii:
                selected = (distance_squared <= radius * radius) & (classifications == 2)
                if np.any(selected):
                    samples[radius].extend(z_values[selected].tolist())

    sweeps = []
    for radius in radii:
        values = np.asarray(samples[radius], dtype=np.float64)
        sweeps.append(
            {
                "radiusMetres": radius,
                "class2PointCount": len(values),
                "medianNavd88Metres": float(np.median(values)) if len(values) else None,
                "p05Navd88Metres": float(np.percentile(values, 5.0)) if len(values) else None,
                "p95Navd88Metres": float(np.percentile(values, 95.0)) if len(values) else None,
            }
        )
    selected = next(
        record for record in sweeps
        if math.isclose(record["radiusMetres"], args.selected_radius_metres)
    )
    if selected["class2PointCount"] < 10:
        raise ValueError(
            f"Too few Class 2 points within {args.selected_radius_metres} metres"
        )
    selected_median = float(selected["medianNavd88Metres"])
    sensitivity_values = [
        float(record["medianNavd88Metres"])
        for record in sweeps
        if record["medianNavd88Metres"] is not None
    ]
    radius_sensitivity = max(abs(value - selected_median) for value in sensitivity_values)
    home = field["elevations"]["homePlate"]
    home_median = float(home["selectedMedianNavd88Metres"])
    home_sensitivity = float(home["radiusSensitivityMetres"])
    relative_rmse_95 = float(field["sourceQualification"]["relativeDifferenceUncertainty95Metres"])
    relative_feet = (selected_median - home_median) * METRES_TO_FEET
    relative_uncertainty_feet = (
        relative_rmse_95 + radius_sensitivity + home_sensitivity
    ) * METRES_TO_FEET

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "feature": calibration["feature"],
        "inputs": {
            "calibrationExtractionPath": str(args.calibration_extraction),
            "calibrationExtractionSha256": hashlib.sha256(calibration_bytes).hexdigest(),
            "calibrationExtractionArtifactVersion": calibration["artifactVersion"],
            "fieldElevationsPath": str(args.field_elevations),
            "fieldElevationsSha256": hashlib.sha256(field_bytes).hexdigest(),
            "fieldElevationsArtifactVersion": field["artifactVersion"],
            "lidarPath": str(args.lidar),
            "lidarSha256": lidar_expected,
        },
        "groundControl": {
            "projectedStatePlaneFeet": state_plane.tolist(),
            "projectedUtmMetres": utm.tolist(),
            "selectedRadiusMetres": args.selected_radius_metres,
            "selectedMedianNavd88Metres": selected_median,
            "radiusSensitivityMetres": radius_sensitivity,
            "relativeToHomePlateFeet": relative_feet,
            "relativeToHomePlateUncertainty95Feet": relative_uncertainty_feet,
            "radiusSweep": sweeps,
        },
    }
    passed = relative_uncertainty_feet <= 1.0
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-ground-calibration-elevation-extraction",
        "artifactStage": "historical-calibration-ground-elevation-extracted",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesHistoricalCalibrationElevation": passed,
            "establishesIndependentHoldout": False,
            "establishesCurrentGeometry": False,
            "note": "The elevation belongs to a calibration-only feature and cannot be reused as a holdout.",
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if passed else ["CALIBRATION_ELEVATION_UNCERTAINTY_EXCEEDS_ONE_FOOT"]),
                "CALIBRATION_FEATURE_NOT_INDEPENDENT_HOLDOUT",
                "CURRENT_FIELD_GRADE_NOT_CONFIRMED",
                "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "artifactVersion": artifact["artifactVersion"],
                "groundControl": artifact["groundControl"],
                "geometryBoundary": artifact["geometryBoundary"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
