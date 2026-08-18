#!/usr/bin/env python3
"""Audit field orientation from timestamped broadcast shadows.

Each frame supplies independent planar field controls and shadow landmarks. The
tool fits one image-to-field homography per frame, propagates declared pixel and
solar uncertainty with deterministic Monte Carlo sampling, and reports a
candidate center-field bearing. It does not promote geometry for publication.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "broadcast-field-shadow-orientation-audit-v2"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def percentile(values: np.ndarray, percentage: float) -> float:
    return float(np.percentile(values, percentage))


def circular_delta_degrees(first: np.ndarray | float, second: np.ndarray | float) -> np.ndarray:
    return (np.asarray(first) - np.asarray(second) + 180.0) % 360.0 - 180.0


def circular_mean_degrees(values: np.ndarray, axis: int | None = None) -> np.ndarray:
    radians = np.deg2rad(values)
    sine = np.mean(np.sin(radians), axis=axis)
    cosine = np.mean(np.cos(radians), axis=axis)
    return np.rad2deg(np.arctan2(sine, cosine)) % 360.0


def transform_points(points: np.ndarray, homography: np.ndarray) -> np.ndarray:
    return cv2.perspectiveTransform(
        points.astype(np.float64).reshape(-1, 1, 2), homography
    ).reshape(-1, 2)


def validate_point(value: Any, label: str) -> np.ndarray:
    point = np.asarray(value, dtype=np.float64)
    if point.shape != (2,) or not np.all(np.isfinite(point)):
        raise ValueError(f"{label} must contain two finite coordinates")
    return point


def uncertainty_sigma(record: dict[str, Any], key: str, label: str) -> np.ndarray:
    uncertainty = validate_point(record[key], label)
    if np.any(uncertainty <= 0):
        raise ValueError(f"{label} must be positive")
    return uncertainty / 1.96


def fit_homography(pixel_points: np.ndarray, field_points: np.ndarray) -> np.ndarray:
    homography, _ = cv2.findHomography(pixel_points, field_points, method=0)
    if homography is None or not np.all(np.isfinite(homography)):
        raise ValueError("Could not fit an image-to-field homography")
    if abs(float(np.linalg.det(homography))) < 1e-12:
        raise ValueError("Image-to-field homography is singular")
    return homography


def bearing_from_vector(vector: np.ndarray) -> float:
    if float(np.linalg.norm(vector)) <= 1e-9:
        raise ValueError("Shadow vector has zero length")
    return math.degrees(math.atan2(float(vector[0]), float(vector[1]))) % 360.0


def audit_frame(
    frame: dict[str, Any],
    rng: np.random.Generator,
    sample_count: int,
) -> tuple[dict[str, Any], np.ndarray]:
    frame_path = Path(frame["path"])
    actual_sha256 = sha256_file(frame_path)
    if actual_sha256 != frame["sha256"]:
        raise ValueError(f"Frame checksum changed: {frame_path}")
    image = cv2.imread(str(frame_path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Could not decode {frame_path}")
    height, width = image.shape[:2]

    controls = frame["controls"]
    if len(controls) < 4:
        raise ValueError(f"Frame {frame['frameId']} requires at least four planar controls")
    pixel_points = np.asarray(
        [validate_point(item["pixel"], f"{frame['frameId']} control pixel") for item in controls]
    )
    field_points = np.asarray(
        [validate_point(item["fieldFeet"], f"{frame['frameId']} control field point") for item in controls]
    )
    pixel_sigmas = np.asarray(
        [
            uncertainty_sigma(
                item,
                "pixelUncertainty95",
                f"{frame['frameId']} control pixel uncertainty",
            )
            for item in controls
        ]
    )
    if (
        np.any(pixel_points[:, 0] < 0)
        or np.any(pixel_points[:, 0] >= width)
        or np.any(pixel_points[:, 1] < 0)
        or np.any(pixel_points[:, 1] >= height)
    ):
        raise ValueError(f"Frame {frame['frameId']} contains a control outside the image")

    homography = fit_homography(pixel_points, field_points)
    inverse = np.linalg.inv(homography)
    fitted_field = transform_points(pixel_points, homography)
    fitted_pixels = transform_points(field_points, inverse)
    field_residuals = np.linalg.norm(fitted_field - field_points, axis=1)
    pixel_residuals = np.linalg.norm(fitted_pixels - pixel_points, axis=1)
    control_residuals = [
        {
            "name": control["name"],
            "annotatedPixel": pixel_points[index].tolist(),
            "fittedPixel": fitted_pixels[index].tolist(),
            "pixelResidual": float(pixel_residuals[index]),
            "annotatedFieldFeet": field_points[index].tolist(),
            "fittedFieldFeet": fitted_field[index].tolist(),
            "fieldResidualFeet": float(field_residuals[index]),
        }
        for index, control in enumerate(controls)
    ]

    solar = frame["solarPosition"]
    timestamp_uncertainty_95 = float(frame["event"]["timestampUncertainty95Seconds"])
    if timestamp_uncertainty_95 <= 0:
        raise ValueError(
            f"Frame {frame['frameId']} timestamp uncertainty must be positive"
        )
    solar_azimuth = float(solar["azimuthDegrees"])
    solar_uncertainty_95 = float(solar["azimuthUncertainty95Degrees"])
    if not 0 <= solar_azimuth < 360:
        raise ValueError(f"Frame {frame['frameId']} solar azimuth must be in [0, 360)")
    if solar_uncertainty_95 <= 0:
        raise ValueError(f"Frame {frame['frameId']} solar uncertainty must be positive")
    true_shadow_bearing = (solar_azimuth + 180.0) % 360.0

    observations = frame["shadowObservations"]
    if not observations:
        raise ValueError(f"Frame {frame['frameId']} requires a shadow observation")
    observation_results: list[dict[str, Any]] = []
    nominal_bearings: list[float] = []
    for observation in observations:
        ground_pixel = validate_point(
            observation["verticalGroundProjectionPixel"],
            f"{frame['frameId']} shadow ground projection",
        )
        shadow_pixel = validate_point(
            observation["headShadowCentroidPixel"],
            f"{frame['frameId']} head shadow centroid",
        )
        ground_field, shadow_field = transform_points(
            np.asarray([ground_pixel, shadow_pixel]), homography
        )
        local_bearing = bearing_from_vector(shadow_field - ground_field)
        field_bearing = (true_shadow_bearing - local_bearing) % 360.0
        nominal_bearings.append(field_bearing)
        observation_results.append(
            {
                "observationId": observation["observationId"],
                "subject": observation["subject"],
                "verticalGroundProjectionPixel": ground_pixel.tolist(),
                "headShadowCentroidPixel": shadow_pixel.tolist(),
                "shadowVectorFieldFeet": (shadow_field - ground_field).tolist(),
                "shadowLengthFeet": float(np.linalg.norm(shadow_field - ground_field)),
                "localShadowBearingDegrees": local_bearing,
                "candidateFieldBearingDegrees": field_bearing,
                "semantics": observation["semantics"],
            }
        )

    sample_bearings = np.full((sample_count, len(observations)), np.nan, dtype=np.float64)
    accepted_samples = 0
    attempts = 0
    maximum_attempts = sample_count * 5
    while accepted_samples < sample_count and attempts < maximum_attempts:
        attempts += 1
        perturbed_pixels = pixel_points + rng.normal(size=pixel_points.shape) * pixel_sigmas
        try:
            perturbed_homography = fit_homography(perturbed_pixels, field_points)
        except ValueError:
            continue
        solar_sample = solar_azimuth + rng.normal() * solar_uncertainty_95 / 1.96
        shadow_bearing_sample = (solar_sample + 180.0) % 360.0
        valid = True
        current: list[float] = []
        for observation in observations:
            ground_sigma = uncertainty_sigma(
                observation,
                "verticalGroundProjectionUncertainty95Pixels",
                f"{frame['frameId']} ground projection uncertainty",
            )
            shadow_sigma = uncertainty_sigma(
                observation,
                "headShadowCentroidUncertainty95Pixels",
                f"{frame['frameId']} head shadow uncertainty",
            )
            ground = validate_point(
                observation["verticalGroundProjectionPixel"], "ground projection"
            ) + rng.normal(size=2) * ground_sigma
            shadow = validate_point(
                observation["headShadowCentroidPixel"], "head shadow centroid"
            ) + rng.normal(size=2) * shadow_sigma
            ground_field, shadow_field = transform_points(
                np.asarray([ground, shadow]), perturbed_homography
            )
            vector = shadow_field - ground_field
            if not np.all(np.isfinite(vector)) or float(np.linalg.norm(vector)) <= 1e-6:
                valid = False
                break
            local = math.degrees(math.atan2(float(vector[0]), float(vector[1]))) % 360.0
            current.append((shadow_bearing_sample - local) % 360.0)
        if not valid:
            continue
        sample_bearings[accepted_samples] = current
        accepted_samples += 1
    if accepted_samples != sample_count:
        raise ValueError(
            f"Frame {frame['frameId']} produced only {accepted_samples} valid uncertainty samples"
        )

    nominal_frame_bearing = float(circular_mean_degrees(np.asarray(nominal_bearings)))
    frame_samples = circular_mean_degrees(sample_bearings, axis=1)
    frame_center = float(circular_mean_degrees(frame_samples))
    frame_deltas = np.abs(circular_delta_degrees(frame_samples, frame_center))
    frame_result = {
        "frameId": frame["frameId"],
        "path": str(frame_path.resolve()),
        "sha256": actual_sha256,
        "imageDimensions": {"width": width, "height": height},
        "event": frame["event"],
        "solarPosition": solar,
        "trueShadowBearingDegrees": true_shadow_bearing,
        "homographyImageToFieldFeet": homography.tolist(),
        "controlFit": {
            "controlCount": len(controls),
            "controls": control_residuals,
            "fieldResidualFeet": {
                "median": percentile(field_residuals, 50),
                "p95": percentile(field_residuals, 95),
                "maximum": float(np.max(field_residuals)),
            },
            "pixelResidual": {
                "median": percentile(pixel_residuals, 50),
                "p95": percentile(pixel_residuals, 95),
                "maximum": float(np.max(pixel_residuals)),
            },
        },
        "shadowObservations": observation_results,
        "nominalFrameBearingDegrees": nominal_frame_bearing,
        "uncertainty": {
            "sampleCount": sample_count,
            "attemptCount": attempts,
            "candidateFieldBearingDegrees": frame_center,
            "absoluteDeltaP50Degrees": percentile(frame_deltas, 50),
            "absoluteDeltaP95Degrees": percentile(frame_deltas, 95),
            "absoluteDeltaMaximumDegrees": float(np.max(frame_deltas)),
        },
    }
    return frame_result, frame_samples


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--samples", type=int, default=10000)
    parser.add_argument("--seed", type=int, default=20260810)
    arguments = parser.parse_args()
    if arguments.samples < 1000:
        raise ValueError("At least 1000 uncertainty samples are required")

    input_bytes = arguments.input.read_bytes()
    source = json.loads(input_bytes)
    if source.get("schemaVersion") != 1:
        raise ValueError("Unsupported source schema version")
    if source.get("artifactKind") != "broadcast-field-shadow-orientation-control":
        raise ValueError("Input is not a broadcast field shadow orientation control")
    frames = source.get("frames")
    if not isinstance(frames, list) or not frames:
        raise ValueError("Input requires at least one frame")

    rng = np.random.default_rng(arguments.seed)
    frame_results: list[dict[str, Any]] = []
    frame_samples: list[np.ndarray] = []
    for frame in frames:
        result, samples = audit_frame(frame, rng, arguments.samples)
        frame_results.append(result)
        frame_samples.append(samples)

    combined_samples = circular_mean_degrees(np.stack(frame_samples, axis=1), axis=1)
    combined_center = float(circular_mean_degrees(combined_samples))
    combined_deltas = np.abs(circular_delta_degrees(combined_samples, combined_center))
    thresholds = source["thresholds"]
    maximum_control_p95 = float(thresholds["maximumControlReprojectionP95Pixels"])
    maximum_bearing_uncertainty = float(thresholds["maximumBearingUncertainty95Degrees"])
    minimum_independent_dates = int(thresholds["minimumIndependentDates"])
    minimum_planar_control_count = int(thresholds["minimumPlanarControlCount"])
    maximum_timestamp_uncertainty = float(
        thresholds["maximumTimestampUncertainty95Seconds"]
    )
    minimum_solar_altitude_span = float(
        thresholds["minimumSolarAltitudeSpanDegrees"]
    )
    dates = sorted({frame["event"]["stadiumLocalDate"] for frame in frames})
    solar_altitudes = [float(frame["solarPosition"]["altitudeDegrees"]) for frame in frames]
    solar_altitude_span = max(solar_altitudes) - min(solar_altitudes)
    control_count_passed = all(
        frame["controlFit"]["controlCount"] >= minimum_planar_control_count
        for frame in frame_results
    )
    control_fit_passed = all(
        frame["controlFit"]["pixelResidual"]["p95"] <= maximum_control_p95
        for frame in frame_results
    )
    bearing_uncertainty_p95 = percentile(combined_deltas, 95)
    uncertainty_passed = bearing_uncertainty_p95 <= maximum_bearing_uncertainty
    date_count_passed = len(dates) >= minimum_independent_dates
    timestamp_uncertainty_passed = all(
        float(frame["event"]["timestampUncertainty95Seconds"])
        <= maximum_timestamp_uncertainty
        for frame in frames
    )
    solar_altitude_span_passed = solar_altitude_span >= minimum_solar_altitude_span
    gate_blockers: list[str] = []
    if not control_count_passed:
        gate_blockers.append("ORIENTATION_CONTROL_COUNT_BELOW_MINIMUM")
    if not control_fit_passed:
        gate_blockers.append("ORIENTATION_CONTROL_REPROJECTION_EXCEEDS_LIMIT")
    if not uncertainty_passed:
        gate_blockers.append("ORIENTATION_BEARING_UNCERTAINTY_EXCEEDS_LIMIT")
    if not date_count_passed:
        gate_blockers.append("ORIENTATION_INDEPENDENT_DATE_COUNT_BELOW_MINIMUM")
    if not timestamp_uncertainty_passed:
        gate_blockers.append("ORIENTATION_TIMESTAMP_UNCERTAINTY_EXCEEDS_LIMIT")
    if not solar_altitude_span_passed:
        gate_blockers.append("ORIENTATION_SOLAR_ALTITUDE_SPAN_BELOW_MINIMUM")

    result: dict[str, Any] = {
        "schemaVersion": 1,
        "artifactKind": "broadcast-field-shadow-orientation-audit",
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": source["stadiumId"],
        "inputs": {
            "controlPath": str(arguments.input.resolve()),
            "controlSha256": hashlib.sha256(input_bytes).hexdigest(),
        },
        "coordinateConvention": source["coordinateConvention"],
        "regulationSource": source.get("regulationSource"),
        "thresholds": thresholds,
        "frames": frame_results,
        "combined": {
            "frameCount": len(frame_results),
            "independentDates": dates,
            "independentDateCount": len(dates),
            "solarAltitudeSpanDegrees": solar_altitude_span,
            "candidateFieldBearingDegrees": combined_center,
            "absoluteDeltaP50Degrees": percentile(combined_deltas, 50),
            "absoluteDeltaP95Degrees": bearing_uncertainty_p95,
            "absoluteDeltaMaximumDegrees": float(np.max(combined_deltas)),
        },
        "gates": {
            "minimumPlanarControlCountPassed": control_count_passed,
            "controlReprojectionPassed": control_fit_passed,
            "bearingUncertaintyPassed": uncertainty_passed,
            "independentDateCountPassed": date_count_passed,
            "timestampUncertaintyPassed": timestamp_uncertainty_passed,
            "solarAltitudeSpanPassed": solar_altitude_span_passed,
            "allPassed": (
                control_count_passed
                and control_fit_passed
                and uncertainty_passed
                and date_count_passed
                and timestamp_uncertainty_passed
                and solar_altitude_span_passed
            ),
        },
        "geometryBoundary": {
            "establishesCandidateFieldOrientation": True,
            "establishesSurveyedWorldTranslation": False,
            "establishesRowElevations": False,
            "establishesObstructionGeometry": False,
            "establishesIndependentShadowHoldout": False,
            "note": (
                "Broadcast shadows can constrain rotation without constraining absolute translation. "
                "These annotated frames are orientation controls and are not release holdouts."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": gate_blockers + [
                "ORIENTATION_CONTROL_IS_NOT_AN_INDEPENDENT_RELEASE_HOLDOUT",
                "ROW_ELEVATIONS_NOT_MEASURED",
                "OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "THIRTY_INDEPENDENT_SHADOW_HOLDOUTS_NOT_PASSED",
            ],
        },
    }
    result["artifactVersion"] = artifact_version(result)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
