#!/usr/bin/env python3
"""Register 2021 Miami-Dade LiDAR locally to the sub-foot 2018 survey frame.

The statewide 2021 source is specified at 3.8 feet horizontal accuracy at 95
percent confidence. This audit does not ignore that limit. It derives a local
rigid correction from disjoint, fixed stadium-perimeter surfaces and validates
the locked correction on separate fixed-perimeter sectors. Movable roof panels
and the west parking area are excluded from every control sector.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import laspy
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage


ANALYSIS_VERSION = "noaa-2021-local-lidar-registration-v1"
FEET_PER_METRE = 3.280839895013123

CENTER_UTM_METRES = (578294.34, 2851288.13)
HALF_WIDTH_METRES = 175.0
GRID_CELL_METRES = (0.15, 0.20, 0.25, 0.30)
HIGH_PASS_METRES = (1.0, 2.0, 4.0, 6.0)
MINIMUM_Z_METRES = 5.0
MAXIMUM_Z_METRES = 90.0

SECTORS = {
    "north_inner": (-10.0, 70.0, 85.0, 155.0),
    "north_outer": (70.0, 140.0, 85.0, 155.0),
    "east_upper": (85.0, 155.0, 5.0, 75.0),
    "east_lower": (85.0, 155.0, -75.0, -5.0),
    "south_inner": (-10.0, 70.0, -155.0, -85.0),
    "south_west": (-90.0, -10.0, -155.0, -85.0),
}
TRAINING_SECTORS = ("north_inner", "east_lower", "south_west")
HOLDOUT_SECTORS = ("north_outer", "east_upper", "south_inner")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def percentile(values: np.ndarray, q: float) -> float:
    return float(np.percentile(values, q))


def summary(values: np.ndarray) -> dict[str, float | int]:
    return {
        "count": int(values.size),
        "minimum": float(np.min(values)),
        "median": float(np.median(values)),
        "p95": percentile(values, 95),
        "maximum": float(np.max(values)),
    }


def validate_review(review_path: Path, expected_status: str) -> dict[str, Any]:
    review = json.loads(review_path.read_text())
    if review.get("stadiumId") != "marlins":
        raise ValueError(f"Review targets the wrong stadium: {review_path}")
    if expected_status and review.get("reviewStatus") != expected_status:
        raise ValueError(f"Review status is not accepted: {review_path}")
    source = review["source"]
    report = Path(source["reportPath"])
    tile = Path(source["tilePath"])
    if sha256_file(report) != source["reportSha256"]:
        raise ValueError(f"Survey report checksum mismatch: {report}")
    if sha256_file(tile) != source["tileSha256"]:
        raise ValueError(f"LiDAR tile checksum mismatch: {tile}")
    return review


def validate_2018_review(review_path: Path) -> dict[str, Any]:
    review = json.loads(review_path.read_text())
    if review.get("stadiumId") != "marlins":
        raise ValueError("2018 review targets the wrong stadium")
    source = review["source"]
    report = Path(source["reportPath"])
    tile = Path(source["tilePath"])
    if sha256_file(report) != source["reportSha256"]:
        raise ValueError("2018 survey report checksum mismatch")
    if sha256_file(tile) != source["tileSha256"]:
        raise ValueError("2018 LiDAR tile checksum mismatch")
    if not review["conservativeInterpretation"]["passesOneFootHorizontalThreshold"]:
        raise ValueError("2018 reference review does not clear the horizontal gate")
    return review


def validate_lidar_crs(path: Path) -> str:
    with laspy.open(path) as reader:
        crs = reader.header.parse_crs()
    if crs is None:
        raise ValueError(f"LiDAR source has no CRS: {path}")
    horizontal = crs.sub_crs_list[0] if crs.is_compound else crs
    if horizontal.to_epsg() != 6346:
        raise ValueError(f"LiDAR horizontal CRS is not EPSG:6346: {path}")
    return crs.to_wkt()


def load_crop(path: Path) -> tuple[np.ndarray, np.ndarray, np.ndarray, int]:
    lidar = laspy.read(path)
    x = np.asarray(lidar.x)
    y = np.asarray(lidar.y)
    z = np.asarray(lidar.z)
    classification = np.asarray(lidar.classification)
    center_x, center_y = CENTER_UTM_METRES
    keep = (
        (np.abs(x - center_x) < HALF_WIDTH_METRES)
        & (np.abs(y - center_y) < HALF_WIDTH_METRES)
        & (z > MINIMUM_Z_METRES)
        & (z < MAXIMUM_Z_METRES)
        & ~np.isin(classification, [7, 18])
    )
    return (
        x[keep].astype(np.float64, copy=True),
        y[keep].astype(np.float64, copy=True),
        z[keep].astype(np.float32, copy=True),
        int(len(x)),
    )


def maximum_height_grid(
    points: tuple[np.ndarray, np.ndarray, np.ndarray],
    cell_metres: float,
) -> tuple[np.ndarray, float]:
    x, y, z = points
    center_x, center_y = CENTER_UTM_METRES
    size = int(round(2.0 * HALF_WIDTH_METRES / cell_metres))
    ix = np.floor((x - center_x + HALF_WIDTH_METRES) / cell_metres).astype(np.int32)
    iy = np.floor((y - center_y + HALF_WIDTH_METRES) / cell_metres).astype(np.int32)
    inside = (ix >= 0) & (ix < size) & (iy >= 0) & (iy < size)
    grid = np.full((size, size), -np.inf, dtype=np.float32)
    np.maximum.at(grid, (iy[inside], ix[inside]), z[inside])
    grid[~np.isfinite(grid)] = np.nan
    coverage = float(np.isfinite(grid).mean())
    indices = ndimage.distance_transform_edt(
        ~np.isfinite(grid),
        return_distances=False,
        return_indices=True,
    )
    filled = ndimage.gaussian_filter(grid[tuple(indices)], 1.0)
    return filled.astype(np.float32), coverage


def sector_window(grid: np.ndarray, sector: tuple[float, float, float, float], cell: float) -> np.ndarray:
    x_min, x_max, y_min, y_max = sector
    x0 = int((x_min + HALF_WIDTH_METRES) / cell)
    x1 = int((x_max + HALF_WIDTH_METRES) / cell)
    y0 = int((y_min + HALF_WIDTH_METRES) / cell)
    y1 = int((y_max + HALF_WIDTH_METRES) / cell)
    return grid[y0:y1, x0:x1]


def phase_shift(
    reference: np.ndarray,
    comparison: np.ndarray,
    cell_metres: float,
    high_pass_metres: float,
) -> tuple[float, float, float]:
    sigma = high_pass_metres / cell_metres
    reference_high = reference - ndimage.gaussian_filter(reference, sigma)
    comparison_high = comparison - ndimage.gaussian_filter(comparison, sigma)
    window = cv2.createHanningWindow(
        (reference.shape[1], reference.shape[0]),
        cv2.CV_32F,
    )
    shift, response = cv2.phaseCorrelate(
        reference_high.astype(np.float32),
        comparison_high.astype(np.float32),
        window,
    )
    return float(shift[0] * cell_metres), float(shift[1] * cell_metres), float(response)


def fit_small_rigid(observations: dict[str, dict[str, float]]) -> np.ndarray:
    design: list[list[float]] = []
    values: list[float] = []
    for name in TRAINING_SECTORS:
        record = observations[name]
        x = record["centerRelativeMetres"][0]
        y = record["centerRelativeMetres"][1]
        dx = record["comparisonToReferenceShiftMetres"][0]
        dy = record["comparisonToReferenceShiftMetres"][1]
        design.extend([[1.0, 0.0, -y], [0.0, 1.0, x]])
        values.extend([dx, dy])
    solution, _, _, _ = np.linalg.lstsq(
        np.asarray(design, dtype=np.float64),
        np.asarray(values, dtype=np.float64),
        rcond=None,
    )
    return solution


def predicted_shift(transform: np.ndarray, x: float, y: float) -> np.ndarray:
    translation_x, translation_y, rotation_radians = transform
    return np.asarray([
        translation_x - rotation_radians * y,
        translation_y + rotation_radians * x,
    ])


def render_diagnostic(
    output: Path,
    reference_grid: np.ndarray,
    cell_metres: float,
) -> None:
    finite = reference_grid[np.isfinite(reference_grid)]
    low, high = np.percentile(finite, [2, 98])
    scaled = np.clip((reference_grid - low) / max(high - low, 1e-6), 0, 1)
    pixels = np.flipud((np.nan_to_num(scaled) * 255).astype(np.uint8))
    image = Image.fromarray(pixels).convert("RGB")
    draw = ImageDraw.Draw(image)
    size = image.width
    colors = {"training": (0, 160, 60), "holdout": (230, 50, 40)}
    for name, (x_min, x_max, y_min, y_max) in SECTORS.items():
        role = "training" if name in TRAINING_SECTORS else "holdout"
        left = (x_min + HALF_WIDTH_METRES) / cell_metres
        right = (x_max + HALF_WIDTH_METRES) / cell_metres
        top = size - (y_max + HALF_WIDTH_METRES) / cell_metres
        bottom = size - (y_min + HALF_WIDTH_METRES) / cell_metres
        draw.rectangle((left, top, right, bottom), outline=colors[role], width=4)
        draw.text((left + 5, top + 5), f"{role}: {name}", fill=colors[role])
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("reference_review", type=Path)
    parser.add_argument("comparison_review", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    args = parser.parse_args()

    reference_review = validate_2018_review(args.reference_review)
    comparison_review = validate_review(
        args.comparison_review,
        "reviewed-2021-miami-dade-lidar-survey-report",
    )
    reference_path = Path(reference_review["source"]["tilePath"])
    comparison_path = Path(comparison_review["source"]["tilePath"])
    reference_crs = validate_lidar_crs(reference_path)
    comparison_crs = validate_lidar_crs(comparison_path)
    if reference_crs != comparison_crs:
        raise ValueError("Reference and comparison LiDAR CRS definitions differ")

    ref_x, ref_y, ref_z, reference_total = load_crop(reference_path)
    cmp_x, cmp_y, cmp_z, comparison_total = load_crop(comparison_path)
    reference_points = (ref_x, ref_y, ref_z)
    comparison_points = (cmp_x, cmp_y, cmp_z)

    variants: list[dict[str, Any]] = []
    display_grid: np.ndarray | None = None
    for cell_metres in GRID_CELL_METRES:
        reference_grid, reference_coverage = maximum_height_grid(reference_points, cell_metres)
        comparison_grid, comparison_coverage = maximum_height_grid(comparison_points, cell_metres)
        if math.isclose(cell_metres, 0.25):
            display_grid = reference_grid.copy()
        for high_pass_metres in HIGH_PASS_METRES:
            observations: dict[str, dict[str, Any]] = {}
            for name, bounds in SECTORS.items():
                ref_window = sector_window(reference_grid, bounds, cell_metres)
                cmp_window = sector_window(comparison_grid, bounds, cell_metres)
                dx, dy, response = phase_shift(
                    ref_window,
                    cmp_window,
                    cell_metres,
                    high_pass_metres,
                )
                x_min, x_max, y_min, y_max = bounds
                observations[name] = {
                    "role": "training" if name in TRAINING_SECTORS else "holdout",
                    "boundsRelativeToCenterMetres": list(bounds),
                    "centerRelativeMetres": [
                        (x_min + x_max) / 2.0,
                        (y_min + y_max) / 2.0,
                    ],
                    "comparisonToReferenceShiftMetres": [dx, dy],
                    "phaseCorrelationResponse": response,
                }
            transform = fit_small_rigid(observations)
            variants.append({
                "cellMetres": cell_metres,
                "highPassMetres": high_pass_metres,
                "referenceGridCoverageFraction": reference_coverage,
                "comparisonGridCoverageFraction": comparison_coverage,
                "trainingFit": {
                    "translationMetres": [float(transform[0]), float(transform[1])],
                    "rotationRadians": float(transform[2]),
                    "rotationDegrees": float(math.degrees(transform[2])),
                },
                "sectors": observations,
            })

    transforms = np.asarray([
        [
            variant["trainingFit"]["translationMetres"][0],
            variant["trainingFit"]["translationMetres"][1],
            variant["trainingFit"]["rotationRadians"],
        ]
        for variant in variants
    ])
    locked = np.median(transforms, axis=0)
    holdout_records: list[dict[str, Any]] = []
    for variant in variants:
        for name in HOLDOUT_SECTORS:
            observation = variant["sectors"][name]
            x, y = observation["centerRelativeMetres"]
            observed = np.asarray(observation["comparisonToReferenceShiftMetres"])
            predicted = predicted_shift(locked, x, y)
            residual = float(np.linalg.norm(observed - predicted))
            holdout_records.append({
                "cellMetres": variant["cellMetres"],
                "highPassMetres": variant["highPassMetres"],
                "sector": name,
                "phaseCorrelationResponse": observation["phaseCorrelationResponse"],
                "observedComparisonToReferenceShiftMetres": observed.tolist(),
                "lockedPredictedShiftMetres": predicted.tolist(),
                "horizontalResidualMetres": residual,
                "horizontalResidualFeet": residual * FEET_PER_METRE,
            })

    residuals_metres = np.asarray([
        record["horizontalResidualMetres"] for record in holdout_records
    ])
    responses = np.asarray([
        record["phaseCorrelationResponse"] for record in holdout_records
    ])
    reference_horizontal95_feet = float(
        reference_review["conservativeInterpretation"]["horizontalAccuracy95Feet"]
    )
    maximum_holdout_residual_feet = float(np.max(residuals_metres) * FEET_PER_METRE)
    combined_horizontal95_feet = math.hypot(
        reference_horizontal95_feet,
        maximum_holdout_residual_feet,
    )
    rotation_degrees = np.degrees(transforms[:, 2])
    rotation_parameter_envelope_degrees = max(
        abs(float(value - math.degrees(locked[2]))) for value in rotation_degrees
    )
    holdout_rotation_envelope_degrees = math.degrees(
        math.atan2(float(np.max(residuals_metres)), 120.0)
    )
    reference_orientation_envelope_degrees = math.degrees(
        math.atan2(reference_horizontal95_feet / FEET_PER_METRE, 240.0)
    )
    combined_orientation95_degrees = math.sqrt(
        rotation_parameter_envelope_degrees ** 2
        + holdout_rotation_envelope_degrees ** 2
        + reference_orientation_envelope_degrees ** 2
    )

    minimum_holdout_response = float(np.min(responses))
    numeric_candidate_eligible = (
        combined_horizontal95_feet <= 1.0
        and combined_orientation95_degrees <= 1.0
        and minimum_holdout_response >= 0.15
        and len(HOLDOUT_SECTORS) >= 3
    )
    measurement_eligible = False
    if display_grid is None:
        raise RuntimeError("Display grid was not created")
    render_diagnostic(args.output_png, display_grid, 0.25)

    stable = {
        "referenceReviewSha256": sha256_file(args.reference_review),
        "comparisonReviewSha256": sha256_file(args.comparison_review),
        "referenceTileSha256": sha256_file(reference_path),
        "comparisonTileSha256": sha256_file(comparison_path),
        "variants": variants,
        "lockedTransform": locked.tolist(),
        "holdouts": holdout_records,
        "combinedHorizontal95Feet": combined_horizontal95_feet,
        "combinedOrientation95Degrees": combined_orientation95_degrees,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "locally-registered-cross-epoch-lidar-frame",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "referenceReview": {
                "path": str(args.reference_review),
                "sha256": stable["referenceReviewSha256"],
                "artifactVersion": reference_review["artifactVersion"],
            },
            "comparisonReview": {
                "path": str(args.comparison_review),
                "sha256": stable["comparisonReviewSha256"],
                "artifactVersion": comparison_review["artifactVersion"],
            },
            "referenceLidar": {
                "path": str(reference_path),
                "sha256": stable["referenceTileSha256"],
                "acquiredOn": "2018-06-05",
            },
            "comparisonLidar": {
                "path": str(comparison_path),
                "sha256": stable["comparisonTileSha256"],
                "acquiredOn": "2021-04-10",
            },
        },
        "controlDesign": {
            "centerUtmMetres": list(CENTER_UTM_METRES),
            "halfWidthMetres": HALF_WIDTH_METRES,
            "heightRangeMetresNavd88": [MINIMUM_Z_METRES, MAXIMUM_Z_METRES],
            "excludedClassificationCodes": [7, 18],
            "surfaceRaster": "maximum elevation per cell, nearest-cell fill, one-cell Gaussian smoothing",
            "phaseSignal": "maximum-elevation raster minus Gaussian low-pass raster",
            "gridCellMetres": list(GRID_CELL_METRES),
            "highPassMetres": list(HIGH_PASS_METRES),
            "trainingSectors": list(TRAINING_SECTORS),
            "holdoutSectors": list(HOLDOUT_SECTORS),
            "sectorBoundsRelativeToCenterMetres": {
                name: list(bounds) for name, bounds in SECTORS.items()
            },
            "semanticExclusions": [
                "movable roof panels",
                "west roof parking area",
                "playing field",
                "seating bowl",
                "vegetation outside the stadium perimeter",
            ],
            "rationale": (
                "The selected north, east, and south controls are fixed exterior stadium "
                "perimeter surfaces visible in both roof states. Training and holdout "
                "sectors are spatially disjoint."
            ),
        },
        "pointCounts": {
            "referenceTotal": reference_total,
            "referenceCropped": int(ref_x.size),
            "comparisonTotal": comparison_total,
            "comparisonCropped": int(cmp_x.size),
        },
        "variants": variants,
        "lockedTransform": {
            "operation": "map comparison 2021 coordinates into the 2018 local frame",
            "translationMetres": [float(locked[0]), float(locked[1])],
            "rotationRadians": float(locked[2]),
            "rotationDegrees": float(math.degrees(locked[2])),
            "linearizedAtUtmCenterMetres": list(CENTER_UTM_METRES),
        },
        "holdoutValidation": {
            "sectorCount": len(HOLDOUT_SECTORS),
            "methodVariantCount": len(variants),
            "observationCount": len(holdout_records),
            "minimumPhaseCorrelationResponse": minimum_holdout_response,
            "horizontalResidualMetres": summary(residuals_metres),
            "horizontalResidualFeet": summary(residuals_metres * FEET_PER_METRE),
            "maximumResidualUsedAsRegistrationEnvelope95Feet": maximum_holdout_residual_feet,
            "records": holdout_records,
        },
        "uncertainty": {
            "referenceHorizontalAccuracy95Feet": reference_horizontal95_feet,
            "registrationEnvelope95Feet": maximum_holdout_residual_feet,
            "combinedHorizontalAccuracy95Feet": combined_horizontal95_feet,
            "rotationParameterEnvelopeDegrees": rotation_parameter_envelope_degrees,
            "holdoutRotationEnvelopeDegrees": holdout_rotation_envelope_degrees,
            "referenceOrientationEnvelopeDegrees": reference_orientation_envelope_degrees,
            "combinedOrientationAccuracy95Degrees": combined_orientation95_degrees,
            "combinationRule": "root sum of squares",
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": sha256_file(args.output_png),
        },
        "assessment": {
            "localHorizontalRegistrationMeasurementEligible": measurement_eligible,
            "numericCandidateEligible": numeric_candidate_eligible,
            "closedRoofTopSurfaceFrameEligible": False,
            "closedRoofObstructionVolumeEligible": False,
            "publicationEligible": False,
            "blockers": [
                "CONTROL_SECTORS_INCLUDE_UNREVIEWED_CONTEXT_SURFACES",
                "ROOF_UNDERSIDE_NOT_MEASURED",
                "CURRENT_OPEN_ROOF_PANEL_POSITION_NOT_ESTABLISHED",
                "FULL_CURRENT_OBSTRUCTION_VOLUME_NOT_ESTABLISHED",
                "ROW_FRAME_HORIZONTAL_ACCURACY_NOT_YET_SUBFOOT",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "interpretation": (
                "The broad context windows numerically fit below one foot, but their "
                "surface identities were not individually reviewed and some include "
                "vegetation. This artifact is rejected for measurement promotion. The "
                "hard-structure registration artifact supersedes it."
            ),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "lockedTransform": artifact["lockedTransform"],
        "holdoutValidation": artifact["holdoutValidation"],
        "uncertainty": artifact["uncertainty"],
        "assessment": artifact["assessment"],
    }, indent=2))


if __name__ == "__main__":
    main()
