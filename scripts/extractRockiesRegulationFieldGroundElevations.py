#!/usr/bin/env python3
"""Extract relative regulation-field elevations from the 2020 USGS point cloud."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from pyproj import Transformer

from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-regulation-field-ground-elevations-v1"
METRES_TO_FEET = 3.280839895013123
ADJUSTED_GPS_EPOCH = dt.datetime(1980, 1, 6, tzinfo=dt.timezone.utc)
GPS_UTC_LEAP_SECONDS_2020 = 18.0


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_bound(path: Path, expected_sha256: str) -> tuple[bytes, Any]:
    data = path.read_bytes()
    if hashlib.sha256(data).hexdigest() != expected_sha256:
        raise ValueError(f"Input checksum differs: {path}")
    return data, json.loads(data) if path.suffix.lower() == ".json" else None


def adjusted_gps_to_utc(value: float) -> str:
    timestamp = ADJUSTED_GPS_EPOCH + dt.timedelta(
        seconds=value + 1_000_000_000.0 - GPS_UTC_LEAP_SECONDS_2020
    )
    return timestamp.isoformat().replace("+00:00", "Z")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("all_field_pose", type=Path)
    parser.add_argument("holdout_extraction", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument(
        "--lidar",
        type=Path,
        default=Path(
            "tmp/lidar/rockies-usgs-co-drcog-2020-b20/"
            "USGS_LPC_CO_DRCOG_2020_B20_w0499n4399.laz"
        ),
    )
    parser.add_argument(
        "--metadata",
        type=Path,
        default=Path(
            "tmp/lidar/rockies-usgs-co-drcog-2020-b20/reports/"
            "312020336_USGS_DRCOG_Lidar_QL2_ClassifiedPointCloud.xml"
        ),
    )
    args = parser.parse_args()

    pose_bytes = args.all_field_pose.read_bytes()
    pose = json.loads(pose_bytes)
    if pose.get("analysisVersion") != "rockies-panorama-all-regulation-field-pose-v1":
        raise ValueError("Unsupported all-field pose")
    holdout_bytes = args.holdout_extraction.read_bytes()
    holdout = json.loads(holdout_bytes)
    if holdout.get("analysisVersion") != "rockies-panorama-outfield-ground-holdout-extraction-v1":
        raise ValueError("Unsupported ground holdout extraction")
    if not holdout["geometryBoundary"].get("establishesIndependentHoldoutObservation"):
        raise ValueError("Ground holdout observation is not locked")

    lidar_expected = "c6650a9a2e02e8b3b1970bba83e893fd197c543fb895d90bffc279f519c6a1be"
    metadata_expected = "c79bc2bb637a0fbd0b6218a7064948a768d75aaf6f09a23ba65ec9425537b6c6"
    if sha256_file(args.lidar) != lidar_expected:
        raise ValueError("LiDAR checksum differs")
    metadata_bytes = args.metadata.read_bytes()
    if hashlib.sha256(metadata_bytes).hexdigest() != metadata_expected:
        raise ValueError("LiDAR metadata checksum differs")
    metadata_text = metadata_bytes.decode("utf-8")
    required_metadata = [
        "<begdate>20200526</begdate>",
        "<enddate>20200612</enddate>",
        "NVA = 19.6 cm 95% Confidence Level",
        "less than or equal to 8 cm RMSEz or within swath overlap",
        "manually reviewed to ensure correct classification on the Class 2 (Ground) points",
        "NAVD88 (GEOID18), Meters",
    ]
    missing = [value for value in required_metadata if value not in metadata_text]
    if missing:
        raise ValueError(f"Required source metadata text is absent: {missing}")

    full_path = Path(pose["inputs"]["fullOrientationPosePath"])
    full_bytes = full_path.read_bytes()
    if hashlib.sha256(full_bytes).hexdigest() != pose["inputs"]["fullOrientationPoseSha256"]:
        raise ValueError("Full-orientation pose checksum differs")
    full = json.loads(full_bytes)
    cross_path = Path(full["inputs"]["crossFacePosePath"])
    cross_bytes = cross_path.read_bytes()
    if hashlib.sha256(cross_bytes).hexdigest() != full["inputs"]["crossFacePoseSha256"]:
        raise ValueError("Cross-face pose checksum differs")
    cross = json.loads(cross_bytes)
    bearing_path = Path(cross["inputs"]["bearingPosePath"])
    bearing_bytes = bearing_path.read_bytes()
    if hashlib.sha256(bearing_bytes).hexdigest() != cross["inputs"]["bearingPoseSha256"]:
        raise ValueError("Bearing pose checksum differs")
    bearing = json.loads(bearing_bytes)
    adjacent_path = Path(cross["inputs"]["adjacentControlsPath"])
    adjacent_bytes = adjacent_path.read_bytes()
    if hashlib.sha256(adjacent_bytes).hexdigest() != cross["inputs"]["adjacentControlsSha256"]:
        raise ValueError("Adjacent controls checksum differs")
    adjacent = json.loads(adjacent_bytes)
    left_path = Path(adjacent["inputs"]["leftFaceExtraction"]["path"])
    left_bytes = left_path.read_bytes()
    if hashlib.sha256(left_bytes).hexdigest() != adjacent["inputs"]["leftFaceExtraction"]["sha256"]:
        raise ValueError("Left controls checksum differs")
    left = json.loads(left_bytes)
    registration_path = Path(left["inputs"]["ngsCorrectedFieldRegistration"]["path"])
    registration_bytes = registration_path.read_bytes()
    if hashlib.sha256(registration_bytes).hexdigest() != left["inputs"]["ngsCorrectedFieldRegistration"]["sha256"]:
        raise ValueError("Field registration checksum differs")
    registration = json.loads(registration_bytes)

    world_controls = {
        key: np.asarray(value, dtype=np.float64)
        for key, value in bearing["worldControlsProjectedFeet"].items()
    }
    world_controls["homePlate"] = np.asarray(
        registration["transform"]["homePlateProjectedFeet"], dtype=np.float64
    )
    world_controls["outfieldHoldout"] = np.asarray(
        holdout["orthophotoObservation"]["ngsCorrectedProjectedFeet"],
        dtype=np.float64,
    )
    requested = ["homePlate", "firstBase", "secondBase", "thirdBase", "moundCenter", "outfieldHoldout"]
    transformer = Transformer.from_crs(6428, 6342, always_xy=True)
    utm_controls = {
        key: np.asarray(transformer.transform(*world_controls[key]), dtype=np.float64)
        for key in requested
    }

    radii = [0.5, 1.0, 1.5]
    samples: dict[tuple[str, float], list[float]] = {
        (key, radius): [] for key in requested for radius in radii
    }
    stadium_gps_times: list[float] = []
    with laspy.open(args.lidar) as source:
        if source.header.parse_crs() is None:
            raise ValueError("LiDAR has no coordinate reference system")
        for points in source.chunk_iterator(1_000_000):
            x_values = np.asarray(points.x)
            y_values = np.asarray(points.y)
            z_values = np.asarray(points.z)
            classifications = np.asarray(points.classification)
            stadium = (
                (x_values >= 500430.0)
                & (x_values <= 500620.0)
                & (y_values >= 4400580.0)
                & (y_values <= 4400800.0)
            )
            if np.any(stadium):
                stadium_gps_times.extend(np.asarray(points.gps_time)[stadium].tolist())
            for key, centre in utm_controls.items():
                distance_squared = (x_values - centre[0]) ** 2 + (y_values - centre[1]) ** 2
                for radius in radii:
                    selected = (distance_squared <= radius * radius) & (classifications == 2)
                    if np.any(selected):
                        samples[(key, radius)].extend(z_values[selected].tolist())

    elevation_records: dict[str, Any] = {}
    for key in requested:
        radius_records = []
        for radius in radii:
            values = np.asarray(samples[(key, radius)], dtype=np.float64)
            radius_records.append(
                {
                    "radiusMetres": radius,
                    "class2PointCount": len(values),
                    "medianNavd88Metres": float(np.median(values)) if len(values) else None,
                    "p05Navd88Metres": float(np.percentile(values, 5.0)) if len(values) else None,
                    "p95Navd88Metres": float(np.percentile(values, 95.0)) if len(values) else None,
                }
            )
        selected = radius_records[1]
        if selected["class2PointCount"] < 7:
            raise ValueError(f"Too few Class 2 points within one metre of {key}")
        sensitivity_values = [
            record["medianNavd88Metres"]
            for record in radius_records
            if record["medianNavd88Metres"] is not None
        ]
        selected_median = float(selected["medianNavd88Metres"])
        radius_sensitivity = max(abs(value - selected_median) for value in sensitivity_values)
        elevation_records[key] = {
            "projectedStatePlaneFeet": world_controls[key].tolist(),
            "projectedUtmMetres": utm_controls[key].tolist(),
            "selectedRadiusMetres": 1.0,
            "selectedMedianNavd88Metres": selected_median,
            "radiusSensitivityMetres": radius_sensitivity,
            "radiusSweep": radius_records,
        }

    home_elevation = elevation_records["homePlate"]["selectedMedianNavd88Metres"]
    overlap_relative_95_metres = 1.96 * math.sqrt(2.0) * 0.08
    for record in elevation_records.values():
        relative = (record["selectedMedianNavd88Metres"] - home_elevation) * METRES_TO_FEET
        relative_uncertainty = (
            overlap_relative_95_metres
            + record["radiusSensitivityMetres"]
            + elevation_records["homePlate"]["radiusSensitivityMetres"]
        ) * METRES_TO_FEET
        record["relativeToHomePlateFeet"] = relative
        record["relativeToHomePlateUncertainty95Feet"] = relative_uncertainty
    elevation_records["homePlate"]["relativeToHomePlateUncertainty95Feet"] = 0.0

    fit_keys = ["homePlate", "firstBase", "secondBase", "thirdBase"]
    matrix = np.asarray(
        [[world_controls[key][0], world_controls[key][1], 1.0] for key in fit_keys],
        dtype=np.float64,
    )
    values = np.asarray(
        [elevation_records[key]["relativeToHomePlateFeet"] for key in fit_keys],
        dtype=np.float64,
    )
    plane, _, _, _ = np.linalg.lstsq(matrix, values, rcond=None)
    fitted = matrix @ plane
    residuals = values - fitted
    gps_times = np.asarray(stadium_gps_times, dtype=np.float64)
    if len(gps_times) == 0:
        raise ValueError("No stadium GPS times found")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "inputs": {
            "allFieldPosePath": str(args.all_field_pose),
            "allFieldPoseSha256": hashlib.sha256(pose_bytes).hexdigest(),
            "allFieldPoseArtifactVersion": pose["artifactVersion"],
            "holdoutExtractionPath": str(args.holdout_extraction),
            "holdoutExtractionSha256": hashlib.sha256(holdout_bytes).hexdigest(),
            "holdoutExtractionArtifactVersion": holdout["artifactVersion"],
            "lidarPath": str(args.lidar),
            "lidarSha256": lidar_expected,
            "metadataPath": str(args.metadata),
            "metadataSha256": metadata_expected,
        },
        "sourceQualification": {
            "horizontalCrs": "NAD83(2011) UTM zone 13N metres",
            "verticalDatum": "NAVD88 Geoid18 metres",
            "classification": "Class 2 ground, manually reviewed per source metadata",
            "nominalPulseSpacingMetres": 0.7,
            "absoluteNonVegetatedVerticalAccuracy95Metres": 0.196,
            "withinOverlapRelativeRmseZMetres": 0.08,
            "relativeDifferenceUncertainty95Metres": overlap_relative_95_metres,
            "orthophotoGroundFrameHorizontalUncertainty95Feet": float(
                registration["diagnostics"]["orthophotoGroundFrameHorizontalUncertainty95Feet"]
            ),
            "collectionRangeFromMetadata": ["2020-05-26", "2020-06-12"],
            "stadiumAdjustedGpsTimeRange": [float(np.min(gps_times)), float(np.max(gps_times))],
            "stadiumUtcRangeAfter18SecondGpsOffset": [
                adjusted_gps_to_utc(float(np.min(gps_times))),
                adjusted_gps_to_utc(float(np.max(gps_times))),
            ],
        },
        "elevations": elevation_records,
        "fieldPlaneRelativeToHomeFeet": {
            "zEqualsAxPlusByPlusC": plane.tolist(),
            "fitControls": fit_keys,
            "residualsFeet": residuals.tolist(),
            "maximumAbsoluteResidualFeet": float(np.max(np.abs(residuals))),
        },
    }
    all_relative_pass = all(
        elevation_records[key]["relativeToHomePlateUncertainty95Feet"] <= 1.0
        for key in requested
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-regulation-field-ground-elevation-extraction",
        "artifactStage": "historical-relative-field-grade-extracted-currentness-pending",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesHistoricalRelativeFieldElevations": all_relative_pass,
            "establishesCurrentFieldElevations": False,
            "establishesCurrentRowGeometry": False,
            "note": "The May 27, 2020 ground returns resolve relative field grade for the 2019 panorama calibration. They do not establish current seating or obstruction geometry.",
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if all_relative_pass else ["RELATIVE_FIELD_ELEVATION_UNCERTAINTY_EXCEEDS_ONE_FOOT"]),
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
                "stadiumUtcRange": stable["sourceQualification"]["stadiumUtcRangeAfter18SecondGpsOffset"],
                "relativeElevationsFeet": {
                    key: {
                        "value": record["relativeToHomePlateFeet"],
                        "uncertainty95": record["relativeToHomePlateUncertainty95Feet"],
                    }
                    for key, record in elevation_records.items()
                },
                "fieldPlaneMaximumAbsoluteResidualFeet": stable["fieldPlaneRelativeToHomeFeet"]["maximumAbsoluteResidualFeet"],
                "geometryBoundary": artifact["geometryBoundary"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
