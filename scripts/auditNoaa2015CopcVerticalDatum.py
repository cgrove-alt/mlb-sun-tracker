#!/usr/bin/env python3
"""Audit the local vertical shift in NOAA's transformed 2015 Miami COPC files."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import sqlite3
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from pyproj import CRS, Transformer


ANALYSIS_VERSION = "noaa-2015-copc-local-vertical-datum-audit-v1"
US_SURVEY_FEET_PER_METRE = 3937.0 / 1200.0


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def load_control_coordinates(gpkg: Path, pid: int) -> tuple[float, float, float]:
    with sqlite3.connect(gpkg) as connection:
        record = connection.execute(
            "SELECT X, Y, Z FROM CONTROL WHERE pid = ?",
            (pid,),
        ).fetchone()
    if record is None:
        raise ValueError(f"Control PID {pid} is absent from the geodatabase")
    return tuple(float(value) for value in record)


def lidar_horizontal_crs(path: Path) -> CRS:
    with laspy.open(path) as reader:
        crs = reader.header.parse_crs()
    if crs is None:
        raise ValueError(f"LiDAR tile has no CRS: {path}")
    if crs.is_compound:
        horizontal = crs.sub_crs_list[0]
    else:
        horizontal = crs
    if horizontal.to_epsg() != 3747:
        raise ValueError(f"LiDAR horizontal CRS is not EPSG:3747: {path}")
    return horizontal


def sample_ground(
    path: Path,
    easting: float,
    northing: float,
    radius: float,
    classification: int,
) -> np.ndarray:
    batches: list[np.ndarray] = []
    radius_squared = radius * radius
    with laspy.open(path) as reader:
        for chunk in reader.chunk_iterator(1_000_000):
            x_values = np.asarray(chunk.x)
            y_values = np.asarray(chunk.y)
            mask = (
                (x_values - easting) ** 2 + (y_values - northing) ** 2
                <= radius_squared
            ) & (np.asarray(chunk.classification) == classification)
            if np.any(mask):
                batches.append(np.asarray(chunk.z)[mask])
    if not batches:
        return np.empty(0, dtype=np.float64)
    return np.concatenate(batches).astype(np.float64)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    controls_bytes = arguments.controls.read_bytes()
    controls: dict[str, Any] = json.loads(controls_bytes)
    if controls.get("reviewStatus") != "reviewed-2015-noaa-copc-local-vertical-datum-controls":
        raise ValueError("Controls have not passed the required manual review")
    if controls.get("stadiumId") != "marlins":
        raise ValueError("Controls target the wrong stadium")

    gpkg_record = controls["sources"]["controlGeodatabase"]
    gpkg = Path(gpkg_record["path"])
    if sha256_file(gpkg) != gpkg_record["sha256"]:
        raise ValueError("Control geodatabase checksum mismatch")
    for source_name in ("surveyReport", "metadata"):
        source = controls["sources"][source_name]
        if sha256_file(Path(source["path"])) != source["sha256"]:
            raise ValueError(f"{source_name} checksum mismatch")

    sampling = controls["sampling"]
    radius = float(sampling["radiusMetres"])
    classification = int(sampling["classification"])
    minimum_count = int(sampling["minimumPointCount"])
    transformer = Transformer.from_crs(2881, 3747, always_xy=True)
    records: list[dict[str, Any]] = []
    for reviewed in controls["controls"]:
        pid = int(reviewed["pid"])
        tile_record = reviewed["tile"]
        tile = Path(tile_record["path"])
        if sha256_file(tile) != tile_record["sha256"]:
            raise ValueError(f"Tile checksum mismatch for PID {pid}")
        lidar_horizontal_crs(tile)
        state_plane_x, state_plane_y, known_z = load_control_coordinates(gpkg, pid)
        expected_known_z = float(reviewed["knownElevationFeet"])
        if not math.isclose(known_z, expected_known_z, rel_tol=0, abs_tol=0.0051):
            raise ValueError(f"Reviewed known elevation disagrees with GPKG for PID {pid}")
        easting, northing = transformer.transform(state_plane_x, state_plane_y)
        z_values = sample_ground(
            tile,
            easting,
            northing,
            radius,
            classification,
        )
        if z_values.size < minimum_count:
            raise ValueError(f"Too few classified ground points for PID {pid}")
        current_median_feet = float(np.median(z_values) * US_SURVEY_FEET_PER_METRE)
        current_minimum_feet = float(np.min(z_values) * US_SURVEY_FEET_PER_METRE)
        current_maximum_feet = float(np.max(z_values) * US_SURVEY_FEET_PER_METRE)
        original_laser_feet = float(reviewed["originalReportedLaserElevationFeet"])
        records.append({
            "pid": pid,
            "role": reviewed["role"],
            "tile": tile_record,
            "controlCoordinateStatePlaneFeet": [state_plane_x, state_plane_y],
            "sampleCoordinateUtmMetres": [easting, northing],
            "knownElevationFeet": known_z,
            "originalReportedLaserElevationFeet": original_laser_feet,
            "currentCopcGroundPointCount": int(z_values.size),
            "currentCopcGroundElevationFeet": {
                "minimum": current_minimum_feet,
                "median": current_median_feet,
                "maximum": current_maximum_feet,
            },
            "requiredCorrectionFeet": original_laser_feet - current_median_feet,
        })

    training = [record for record in records if record["role"] == "training"]
    holdouts = [record for record in records if record["role"] == "holdout"]
    if len(training) < 2 or not holdouts:
        raise ValueError("At least two training controls and one holdout are required")
    correction_feet = float(np.median([
        record["requiredCorrectionFeet"] for record in training
    ]))
    for record in records:
        corrected = record["currentCopcGroundElevationFeet"]["median"] + correction_feet
        record["correctedCopcGroundElevationFeet"] = corrected
        record["correctedDifferenceFromOriginalReportedLaserFeet"] = (
            corrected - record["originalReportedLaserElevationFeet"]
        )

    training_deviations = np.asarray([
        abs(record["requiredCorrectionFeet"] - correction_feet)
        for record in training
    ])
    holdout_residuals = np.asarray([
        abs(record["correctedDifferenceFromOriginalReportedLaserFeet"])
        for record in holdouts
    ])
    maximum_half_sample_range = max(
        (
            record["currentCopcGroundElevationFeet"]["maximum"]
            - record["currentCopcGroundElevationFeet"]["minimum"]
        ) / 2.0
        for record in records
    )
    report_rounding_feet = 0.005
    correction_envelope_feet = (
        max(float(np.max(training_deviations)), float(np.max(holdout_residuals)))
        + maximum_half_sample_range
        + report_rounding_feet
    )
    source_vertical95 = float(controls["sourceAccuracy"]["verticalAccuracy95Feet"])
    combined_vertical95 = math.hypot(source_vertical95, correction_envelope_feet)
    source_horizontal95 = float(controls["sourceAccuracy"]["horizontalAccuracy95Feet"])

    stable = {
        "controlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
        "correctionFeet": correction_feet,
        "records": records,
        "correctionEnvelopeFeet": correction_envelope_feet,
        "combinedVertical95Feet": combined_vertical95,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "noaa-copc-local-vertical-datum-correction-audit",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controlsPath": str(arguments.controls),
            "controlsSha256": stable["controlsSha256"],
            "sourceRecords": controls["sources"],
        },
        "sampling": sampling,
        "controls": records,
        "verticalCorrection": {
            "operation": "add correction to current 2015 NOAA GEOID18 COPC z values",
            "correctionFeet": correction_feet,
            "correctionMetres": correction_feet / US_SURVEY_FEET_PER_METRE,
            "trainingControlCount": len(training),
            "trainingAbsoluteDeviationFromCorrectionFeet": {
                "median": float(np.median(training_deviations)),
                "maximum": float(np.max(training_deviations)),
            },
            "holdoutControlCount": len(holdouts),
            "holdoutAbsoluteResidualFeet": {
                "median": float(np.median(holdout_residuals)),
                "maximum": float(np.max(holdout_residuals)),
            },
            "maximumHalfSampleRangeFeet": maximum_half_sample_range,
            "reportRoundingAllowanceFeet": report_rounding_feet,
            "correctionEnvelope95Feet": correction_envelope_feet,
            "sourceVerticalAccuracy95Feet": source_vertical95,
            "combinedVerticalAccuracy95Feet": combined_vertical95,
        },
        "assessment": {
            "localVerticalCorrectionMeasurementEligible": combined_vertical95 <= 1.0,
            "metricStadiumGeometryEligible": False,
            "publicationEligible": False,
            "blockers": [
                "SOURCE_HORIZONTAL_ACCURACY_95_IS_3_8_FEET",
                "CONTROL_SAMPLE_DOES_NOT_ESTABLISH_ROW_SURFACE_SEMANTICS",
                "2015_GEOMETRY_CURRENCY_IS_STALE",
                "FULL_CURRENT_OBSTRUCTION_VOLUME_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": (
                "The local additive correction is independently held out and can be used "
                "to compare 2015 vertical shapes near the stadium. It does not promote the "
                "2015 source to publication geometry."
            ),
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "verticalCorrection": artifact["verticalCorrection"],
        "assessment": artifact["assessment"],
    }, indent=2))


if __name__ == "__main__":
    main()
