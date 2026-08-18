#!/usr/bin/env python3
"""Measure a baseball field axis from reviewed orthophoto boundary pixels.

The calculation is deliberately limited to orientation. Absolute horizontal
position and all vertical geometry remain blocked unless their own source
accuracy is established.
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


ANALYSIS_VERSION = "reviewed-orthophoto-infield-orientation-v1"
REQUIRED_REVIEW_STATUS = "reviewed-direct-orthophoto-infield-boundary-pixels"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--preview", type=Path)
    parser.add_argument("--maximum-orientation-uncertainty-degrees", type=float, default=1.0)
    parser.add_argument("--maximum-opposite-edge-disagreement-degrees", type=float, default=1.0)
    parser.add_argument("--maximum-included-angle-error-degrees", type=float, default=1.0)
    parser.add_argument("--maximum-boundary-residual-p95-pixels", type=float, default=3.0)
    parser.add_argument("--minimum-points-per-edge", type=int, default=6)
    parser.add_argument("--monte-carlo-samples", type=int, default=50_000)
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def decoded_pixels_sha256(image: np.ndarray) -> str:
    return hashlib.sha256(image.tobytes()).hexdigest()


def angular_difference(first: float, second: float) -> float:
    return float((first - second + 180.0) % 360.0 - 180.0)


def circular_mean_degrees(values: list[float]) -> float:
    radians = np.radians(np.asarray(values, dtype=float))
    return float(
        math.degrees(
            math.atan2(float(np.mean(np.sin(radians))), float(np.mean(np.cos(radians))))
        )
        % 360.0
    )


def compass_bearing(vector_east_north: np.ndarray) -> float:
    return float(math.degrees(math.atan2(float(vector_east_north[0]), float(vector_east_north[1]))) % 360.0)


def fit_line(points: np.ndarray) -> dict[str, Any]:
    center = np.mean(points, axis=0)
    _, _, vectors = np.linalg.svd(points - center, full_matrices=False)
    direction = vectors[0]
    ordered_direction = points[-1] - points[0]
    if float(np.dot(direction, ordered_direction)) < 0:
        direction = -direction
    direction /= np.linalg.norm(direction)
    normal = np.asarray([-direction[1], direction[0]], dtype=float)
    residuals = np.abs((points - center) @ normal)
    return {
        "center": center,
        "direction": direction,
        "normal": normal,
        "residuals": residuals,
    }


def line_intersection(first: dict[str, Any], second: dict[str, Any]) -> np.ndarray:
    matrix = np.column_stack([first["direction"], -second["direction"]])
    if abs(float(np.linalg.det(matrix))) < 1e-9:
        raise ValueError("Reviewed boundary lines are parallel and cannot be intersected")
    parameters = np.linalg.solve(matrix, second["center"] - first["center"])
    return first["center"] + parameters[0] * first["direction"]


def pixel_direction_bearing(direction: np.ndarray, pixel_size_x: float, pixel_size_y: float) -> float:
    return compass_bearing(
        np.asarray([direction[0] * pixel_size_x, -direction[1] * pixel_size_y], dtype=float)
    )


def pair_orientation(
    first_parallel_points: np.ndarray,
    third_parallel_points: np.ndarray,
    pixel_size_x: float,
    pixel_size_y: float,
) -> dict[str, Any]:
    first = fit_line(first_parallel_points)
    third = fit_line(third_parallel_points)
    first_bearing = pixel_direction_bearing(first["direction"], pixel_size_x, pixel_size_y)
    third_bearing = pixel_direction_bearing(third["direction"], pixel_size_x, pixel_size_y)
    clockwise_span = (third_bearing - first_bearing + 360.0) % 360.0
    if not 45.0 < clockwise_span < 135.0:
        raise ValueError(f"Reviewed infield edges do not form the expected quadrant: {clockwise_span:.6f}")
    orientation = (first_bearing + clockwise_span / 2.0) % 360.0
    return {
        "first": first,
        "third": third,
        "firstBearingDegrees": first_bearing,
        "thirdBearingDegrees": third_bearing,
        "includedAngleDegrees": clockwise_span,
        "includedAngleErrorDegrees": abs(clockwise_span - 90.0),
        "orientationDegrees": orientation,
    }


def serializable_line(line: dict[str, Any]) -> dict[str, Any]:
    residuals = line["residuals"]
    return {
        "centerPixel": [round(float(value), 6) for value in line["center"]],
        "directionPixel": [round(float(value), 9) for value in line["direction"]],
        "residualPixels": {
            "median": round(float(np.median(residuals)), 6),
            "p95": round(float(np.percentile(residuals, 95)), 6),
            "maximum": round(float(np.max(residuals)), 6),
        },
    }


def sample_pair_orientations(
    rng: np.random.Generator,
    first_points: np.ndarray,
    third_points: np.ndarray,
    uncertainty_pixels: float,
    pixel_size_x: float,
    pixel_size_y: float,
    sample_count: int,
) -> np.ndarray:
    values = np.empty(sample_count, dtype=float)
    for index in range(sample_count):
        first_sample = first_points + rng.uniform(
            -uncertainty_pixels, uncertainty_pixels, size=first_points.shape
        )
        third_sample = third_points + rng.uniform(
            -uncertainty_pixels, uncertainty_pixels, size=third_points.shape
        )
        values[index] = pair_orientation(
            first_sample, third_sample, pixel_size_x, pixel_size_y
        )["orientationDegrees"]
    return values


def orientation_error_percentiles(samples: np.ndarray, central: float) -> dict[str, float]:
    errors = np.abs(np.asarray([angular_difference(value, central) for value in samples]))
    return {
        "median": round(float(np.percentile(errors, 50)), 6),
        "p95": round(float(np.percentile(errors, 95)), 6),
        "p99": round(float(np.percentile(errors, 99)), 6),
        "maximum": round(float(np.max(errors)), 6),
    }


def checked_points(group: dict[str, Any], minimum_count: int, image_shape: tuple[int, ...]) -> np.ndarray:
    points = np.asarray(group["pixels"], dtype=float)
    if points.ndim != 2 or points.shape[1] != 2 or points.shape[0] < minimum_count:
        raise ValueError(f"{group.get('edgeId')} needs at least {minimum_count} two-dimensional points")
    height, width = image_shape[:2]
    if np.any(points[:, 0] < 0) or np.any(points[:, 0] >= width) or np.any(points[:, 1] < 0) or np.any(points[:, 1] >= height):
        raise ValueError(f"{group.get('edgeId')} contains a point outside the source image")
    return points


def draw_extended_line(image: np.ndarray, line: dict[str, Any], color: tuple[int, int, int], thickness: int = 3) -> None:
    center = line["center"]
    direction = line["direction"]
    scale = max(image.shape[:2]) * 2.0
    start = tuple(np.rint(center - scale * direction).astype(int))
    end = tuple(np.rint(center + scale * direction).astype(int))
    cv2.line(image, start, end, color, thickness, cv2.LINE_AA)


def main() -> None:
    args = parse_args()
    controls = json.loads(args.controls.read_text())
    if controls.get("review", {}).get("status") != REQUIRED_REVIEW_STATUS:
        raise ValueError(f"Controls must have review status {REQUIRED_REVIEW_STATUS}")

    source = controls["source"]
    manifest_path = Path(source["manifestPath"])
    image_path = Path(source["imagePath"])
    if file_sha256(manifest_path) != source["manifestSha256"]:
        raise ValueError("Source manifest SHA-256 does not match reviewed controls")
    manifest = json.loads(manifest_path.read_text())
    if manifest.get("artifactVersion") != source["manifestArtifactVersion"]:
        raise ValueError("Source manifest artifact version does not match reviewed controls")
    if file_sha256(image_path) != source["imageSha256"]:
        raise ValueError("Source image SHA-256 does not match reviewed controls")
    if manifest.get("export", {}).get("sha256") != source["imageSha256"]:
        raise ValueError("Source manifest does not bind the reviewed image SHA-256")
    image = cv2.imread(str(image_path), cv2.IMREAD_UNCHANGED)
    if image is None:
        raise ValueError("Could not decode source orthophoto")
    if decoded_pixels_sha256(image) != source["decodedPixelsSha256"]:
        raise ValueError("Decoded source pixels SHA-256 does not match reviewed controls")

    export = manifest["export"]
    if export.get("coordinateReferenceSystem") != "EPSG:3857":
        raise ValueError("This analysis requires the reviewed north-up EPSG:3857 export")
    if export.get("width") != image.shape[1] or export.get("height") != image.shape[0]:
        raise ValueError("Source manifest dimensions do not match decoded image")
    pixel_size_x = float(export["pixelSizeX"])
    pixel_size_y = float(export["pixelSizeY"])
    if pixel_size_x <= 0 or pixel_size_y <= 0:
        raise ValueError("Source manifest pixel size is invalid")

    training = controls["trainingEdgePair"]
    holdout = controls["oppositeEdgeHoldoutPair"]
    training_first = checked_points(training["firstBaseParallel"], args.minimum_points_per_edge, image.shape)
    training_third = checked_points(training["thirdBaseParallel"], args.minimum_points_per_edge, image.shape)
    holdout_first = checked_points(holdout["firstBaseParallel"], args.minimum_points_per_edge, image.shape)
    holdout_third = checked_points(holdout["thirdBaseParallel"], args.minimum_points_per_edge, image.shape)
    training_uncertainty = float(training["pointUncertaintyPixels"])
    holdout_uncertainty = float(holdout["pointUncertaintyPixels"])
    if training_uncertainty <= 0 or holdout_uncertainty <= 0:
        raise ValueError("Reviewed point uncertainty must be positive")

    training_fit = pair_orientation(training_first, training_third, pixel_size_x, pixel_size_y)
    holdout_fit = pair_orientation(holdout_first, holdout_third, pixel_size_x, pixel_size_y)
    home_inner_corner = line_intersection(training_fit["first"], training_fit["third"])
    second_inner_corner = line_intersection(holdout_fit["first"], holdout_fit["third"])
    diagonal_pixel = second_inner_corner - home_inner_corner
    diagonal_orientation = pixel_direction_bearing(diagonal_pixel, pixel_size_x, pixel_size_y)

    mound = controls["moundCoverHoldout"]
    mound_center = np.asarray(mound["centerPixel"], dtype=float)
    if mound_center.shape != (2,):
        raise ValueError("Mound cover center must contain two pixel coordinates")
    home_to_mound_orientation = pixel_direction_bearing(
        mound_center - home_inner_corner, pixel_size_x, pixel_size_y
    )
    mound_to_second_orientation = pixel_direction_bearing(
        second_inner_corner - mound_center, pixel_size_x, pixel_size_y
    )
    diagonal_length_pixels = float(np.linalg.norm(diagonal_pixel))
    mound_line_offset_pixels = float(
        abs(np.cross(
            np.asarray([diagonal_pixel[0], diagonal_pixel[1], 0.0]),
            np.asarray([mound_center[0] - home_inner_corner[0], mound_center[1] - home_inner_corner[1], 0.0]),
        )[2]) / diagonal_length_pixels
    )

    central_orientation = circular_mean_degrees([
        training_fit["orientationDegrees"],
        holdout_fit["orientationDegrees"],
        diagonal_orientation,
    ])
    opposite_edge_disagreement = abs(angular_difference(
        holdout_fit["orientationDegrees"], training_fit["orientationDegrees"]
    ))

    rng = np.random.default_rng(int(controls["uncertaintyAnalysis"]["seed"]))
    training_samples = sample_pair_orientations(
        rng,
        training_first,
        training_third,
        training_uncertainty,
        pixel_size_x,
        pixel_size_y,
        args.monte_carlo_samples,
    )
    holdout_samples = sample_pair_orientations(
        rng,
        holdout_first,
        holdout_third,
        holdout_uncertainty,
        pixel_size_x,
        pixel_size_y,
        args.monte_carlo_samples,
    )
    training_error = orientation_error_percentiles(training_samples, training_fit["orientationDegrees"])
    holdout_error = orientation_error_percentiles(holdout_samples, holdout_fit["orientationDegrees"])
    orientation_uncertainty = max(
        abs(angular_difference(training_fit["orientationDegrees"], central_orientation)) + training_error["p95"],
        abs(angular_difference(holdout_fit["orientationDegrees"], central_orientation)) + holdout_error["p95"],
        abs(angular_difference(diagonal_orientation, central_orientation)),
        abs(angular_difference(home_to_mound_orientation, central_orientation)),
        abs(angular_difference(mound_to_second_orientation, central_orientation)),
    )

    line_records = {
        "trainingFirstBaseParallel": serializable_line(training_fit["first"]),
        "trainingThirdBaseParallel": serializable_line(training_fit["third"]),
        "holdoutFirstBaseParallel": serializable_line(holdout_fit["first"]),
        "holdoutThirdBaseParallel": serializable_line(holdout_fit["third"]),
    }
    maximum_boundary_residual_p95 = max(
        record["residualPixels"]["p95"] for record in line_records.values()
    )
    included_angle_errors = [
        training_fit["includedAngleErrorDegrees"],
        holdout_fit["includedAngleErrorDegrees"],
    ]
    blockers = []
    if opposite_edge_disagreement > args.maximum_opposite_edge_disagreement_degrees:
        blockers.append("OPPOSITE_INFIELD_EDGE_ORIENTATION_DISAGREEMENT_TOO_HIGH")
    if max(included_angle_errors) > args.maximum_included_angle_error_degrees:
        blockers.append("INFIELD_INCLUDED_ANGLE_ERROR_TOO_HIGH")
    if maximum_boundary_residual_p95 > args.maximum_boundary_residual_p95_pixels:
        blockers.append("INFIELD_BOUNDARY_FIT_RESIDUAL_TOO_HIGH")
    if orientation_uncertainty > args.maximum_orientation_uncertainty_degrees:
        blockers.append("ORIENTATION_UNCERTAINTY_TOO_HIGH")
    orientation_measurement_eligible = not blockers

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": controls["stadiumId"],
        "source": {
            "manifestPath": str(manifest_path),
            "manifestSha256": source["manifestSha256"],
            "manifestArtifactVersion": source["manifestArtifactVersion"],
            "imagePath": str(image_path),
            "imageSha256": source["imageSha256"],
            "decodedPixelsSha256": source["decodedPixelsSha256"],
            "catalogObjectId": manifest.get("source", {}).get("catalogItem", {}).get("objectId"),
            "groundConditionDate": manifest.get("source", {}).get("catalogItem", {}).get("groundConditionDate"),
            "coordinateReferenceSystem": export["coordinateReferenceSystem"],
            "pixelSizeMetres": {"x": pixel_size_x, "y": pixel_size_y},
        },
        "review": controls["review"],
        "rulesBasis": controls["rulesBasis"],
        "lineFits": line_records,
        "measurements": {
            "trainingOrientationDegrees": round(float(training_fit["orientationDegrees"]), 6),
            "oppositeEdgeHoldoutOrientationDegrees": round(float(holdout_fit["orientationDegrees"]), 6),
            "oppositeEdgeDisagreementDegrees": round(opposite_edge_disagreement, 6),
            "trainingIncludedAngleDegrees": round(float(training_fit["includedAngleDegrees"]), 6),
            "holdoutIncludedAngleDegrees": round(float(holdout_fit["includedAngleDegrees"]), 6),
            "homeInnerCornerPixel": [round(float(value), 6) for value in home_inner_corner],
            "secondInnerCornerPixel": [round(float(value), 6) for value in second_inner_corner],
            "diagonalOrientationDegrees": round(diagonal_orientation, 6),
            "moundCoverCenterPixel": [round(float(value), 6) for value in mound_center],
            "homeToMoundOrientationDegrees": round(home_to_mound_orientation, 6),
            "moundToSecondOrientationDegrees": round(mound_to_second_orientation, 6),
            "moundOffsetFromDiagonalPixels": round(mound_line_offset_pixels, 6),
            "orientationDegrees": round(central_orientation, 6),
            "orientationUncertaintyDegrees": round(float(orientation_uncertainty), 6),
        },
        "uncertainty": {
            "method": "seeded-uniform-reviewed-pixel-perturbation-plus-family-disagreement",
            "seed": int(controls["uncertaintyAnalysis"]["seed"]),
            "sampleCountPerEdgePair": args.monte_carlo_samples,
            "trainingPointUncertaintyPixels": training_uncertainty,
            "holdoutPointUncertaintyPixels": holdout_uncertainty,
            "trainingOrientationErrorDegrees": training_error,
            "holdoutOrientationErrorDegrees": holdout_error,
            "combinedConservativeUncertaintyDegrees": round(float(orientation_uncertainty), 6),
        },
        "thresholds": {
            "maximumOrientationUncertaintyDegrees": args.maximum_orientation_uncertainty_degrees,
            "maximumOppositeEdgeDisagreementDegrees": args.maximum_opposite_edge_disagreement_degrees,
            "maximumIncludedAngleErrorDegrees": args.maximum_included_angle_error_degrees,
            "maximumBoundaryResidualP95Pixels": args.maximum_boundary_residual_p95_pixels,
            "minimumPointsPerEdge": args.minimum_points_per_edge,
        },
        "assessment": {
            "orientationMeasurementEligible": orientation_measurement_eligible,
            "absoluteHorizontalMeasurementEligible": False,
            "blockers": blockers,
            "absoluteHorizontalBlockers": [
                "SOURCE_ABSOLUTE_HORIZONTAL_ACCURACY_NOT_ESTABLISHED_WITHIN_ONE_FOOT"
            ],
        },
        "publication": {
            "eligibleByItself": False,
            "blockers": [
                "ORIENTATION_ONLY",
                "SOURCE_ABSOLUTE_HORIZONTAL_ACCURACY_NOT_ESTABLISHED_WITHIN_ONE_FOOT",
                "ORTHOPHOTO_IS_TWO_DIMENSIONAL",
                "ROW_GEOMETRY_NOT_ESTABLISHED",
                "OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "reviewed-orthophoto-field-orientation",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        **stable,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")

    if args.preview:
        preview = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
        if preview is None:
            raise ValueError("Could not decode source image for preview")
        colors = {
            "trainingFirst": (0, 215, 255),
            "trainingThird": (0, 165, 255),
            "holdoutFirst": (255, 120, 0),
            "holdoutThird": (255, 0, 120),
        }
        for points, line, color in [
            (training_first, training_fit["first"], colors["trainingFirst"]),
            (training_third, training_fit["third"], colors["trainingThird"]),
            (holdout_first, holdout_fit["first"], colors["holdoutFirst"]),
            (holdout_third, holdout_fit["third"], colors["holdoutThird"]),
        ]:
            draw_extended_line(preview, line, color)
            for point in points:
                cv2.circle(preview, tuple(np.rint(point).astype(int)), 7, color, -1, cv2.LINE_AA)
        home_point = tuple(np.rint(home_inner_corner).astype(int))
        second_point = tuple(np.rint(second_inner_corner).astype(int))
        mound_point = tuple(np.rint(mound_center).astype(int))
        cv2.line(preview, home_point, second_point, (80, 255, 80), 4, cv2.LINE_AA)
        cv2.circle(preview, home_point, 12, (80, 255, 80), -1, cv2.LINE_AA)
        cv2.circle(preview, second_point, 12, (80, 255, 80), -1, cv2.LINE_AA)
        cv2.circle(preview, mound_point, 12, (255, 255, 255), 3, cv2.LINE_AA)
        crop = controls["previewCrop"]
        preview = preview[int(crop["top"]):int(crop["bottom"]), int(crop["left"]):int(crop["right"])]
        args.preview.parent.mkdir(parents=True, exist_ok=True)
        if not cv2.imwrite(str(args.preview), preview, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
            raise ValueError("Could not write preview")

    print(json.dumps({
        "output": str(args.output),
        "preview": None if args.preview is None else str(args.preview),
        "artifactVersion": artifact["artifactVersion"],
        "measurements": artifact["measurements"],
        "assessment": artifact["assessment"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
