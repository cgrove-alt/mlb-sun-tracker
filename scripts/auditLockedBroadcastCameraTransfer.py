#!/usr/bin/env python3
"""Audit control transfer between frames from one locked broadcast camera.

The tool estimates a calibration-to-observation image homography from mutual
ORB matches inside explicitly declared static review regions. It quantifies
fit residuals, spatial coverage, leave-one-cell-out model variation, and the
uncertainty of every transferred regulation-field control. It never treats a
camera transfer as row geometry or independent shade validation.
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


ANALYSIS_VERSION = "locked-broadcast-camera-control-transfer-v1"


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


def validate_point(value: Any, label: str) -> np.ndarray:
    point = np.asarray(value, dtype=np.float64)
    if point.shape != (2,) or not np.all(np.isfinite(point)):
        raise ValueError(f"{label} must contain two finite coordinates")
    return point


def transform_points(points: np.ndarray, homography: np.ndarray) -> np.ndarray:
    return cv2.perspectiveTransform(
        points.astype(np.float64).reshape(-1, 1, 2), homography
    ).reshape(-1, 2)


def validate_region(
    value: Any,
    width: int,
    height: int,
    label: str,
) -> tuple[int, int, int, int]:
    if not isinstance(value, dict):
        raise ValueError(f"{label} must be an object")
    left = int(value["left"])
    top = int(value["top"])
    right = int(value["right"])
    bottom = int(value["bottom"])
    if not (0 <= left < right <= width and 0 <= top < bottom <= height):
        raise ValueError(f"{label} is outside the image")
    return left, top, right, bottom


def build_mask(
    width: int,
    height: int,
    include_regions: list[dict[str, Any]],
    exclude_regions: list[dict[str, Any]],
) -> tuple[np.ndarray, list[dict[str, int]], list[dict[str, int]]]:
    if not include_regions:
        raise ValueError("At least one static include region is required")
    mask = np.zeros((height, width), dtype=np.uint8)
    normalized_includes: list[dict[str, int]] = []
    normalized_excludes: list[dict[str, int]] = []
    for index, region in enumerate(include_regions):
        left, top, right, bottom = validate_region(
            region, width, height, f"include region {index + 1}"
        )
        mask[top:bottom, left:right] = 255
        normalized_includes.append(
            {"left": left, "top": top, "right": right, "bottom": bottom}
        )
    for index, region in enumerate(exclude_regions):
        left, top, right, bottom = validate_region(
            region, width, height, f"exclude region {index + 1}"
        )
        mask[top:bottom, left:right] = 0
        normalized_excludes.append(
            {"left": left, "top": top, "right": right, "bottom": bottom}
        )
    if int(np.count_nonzero(mask)) == 0:
        raise ValueError("Static review mask contains no pixels")
    return mask, normalized_includes, normalized_excludes


def mutual_ratio_matches(
    observation_descriptors: np.ndarray,
    calibration_descriptors: np.ndarray,
    ratio: float,
) -> list[cv2.DMatch]:
    matcher = cv2.BFMatcher(cv2.NORM_HAMMING)
    forward_pairs = matcher.knnMatch(calibration_descriptors, observation_descriptors, k=2)
    reverse_pairs = matcher.knnMatch(observation_descriptors, calibration_descriptors, k=2)
    forward = {
        (match.queryIdx, match.trainIdx): match
        for match, alternative in forward_pairs
        if match.distance < ratio * alternative.distance
    }
    reverse = {
        (match.trainIdx, match.queryIdx)
        for match, alternative in reverse_pairs
        if match.distance < ratio * alternative.distance
    }
    matches = [match for key, match in forward.items() if key in reverse]
    return sorted(matches, key=lambda item: (item.queryIdx, item.trainIdx))


def spatial_cell_ids(
    points: np.ndarray,
    width: int,
    height: int,
    columns: int,
    rows: int,
) -> np.ndarray:
    x_cell = np.minimum(columns - 1, np.floor(points[:, 0] / width * columns)).astype(int)
    y_cell = np.minimum(rows - 1, np.floor(points[:, 1] / height * rows)).astype(int)
    return y_cell * columns + x_cell


def convex_hull_area_fraction(points: np.ndarray, mask_pixel_count: int) -> float:
    if len(points) < 3 or mask_pixel_count <= 0:
        return 0.0
    hull = cv2.convexHull(points.astype(np.float32).reshape(-1, 1, 2))
    return float(cv2.contourArea(hull)) / float(mask_pixel_count)


def transformation_diagnostics(
    homography: np.ndarray,
    width: int,
    height: int,
) -> dict[str, Any]:
    sample_points = np.asarray(
        [
            [0.0, 0.0],
            [width - 1.0, 0.0],
            [width - 1.0, height - 1.0],
            [0.0, height - 1.0],
            [(width - 1.0) / 2.0, (height - 1.0) / 2.0],
        ],
        dtype=np.float64,
    )
    transformed = transform_points(sample_points, homography)
    displacements = np.linalg.norm(transformed - sample_points, axis=1)
    center = sample_points[-1]
    horizontal = np.asarray([center, center + [100.0, 0.0]], dtype=np.float64)
    vertical = np.asarray([center, center + [0.0, 100.0]], dtype=np.float64)
    horizontal_transformed = transform_points(horizontal, homography)
    vertical_transformed = transform_points(vertical, homography)
    horizontal_vector = horizontal_transformed[1] - horizontal_transformed[0]
    vertical_vector = vertical_transformed[1] - vertical_transformed[0]
    horizontal_scale = float(np.linalg.norm(horizontal_vector) / 100.0)
    vertical_scale = float(np.linalg.norm(vertical_vector) / 100.0)
    rotation = math.degrees(math.atan2(horizontal_vector[1], horizontal_vector[0]))
    return {
        "samplePixels": sample_points.tolist(),
        "transformedSamplePixels": transformed.tolist(),
        "sampleDisplacementPixels": displacements.tolist(),
        "maximumSampleDisplacementPixels": float(np.max(displacements)),
        "horizontalScale": horizontal_scale,
        "verticalScale": vertical_scale,
        "maximumScaleDeltaFraction": max(
            abs(horizontal_scale - 1.0), abs(vertical_scale - 1.0)
        ),
        "rotationDegrees": rotation,
        "perspectiveTerms": [float(homography[2, 0]), float(homography[2, 1])],
    }


def leave_one_cell_out_variation(
    calibration_points: np.ndarray,
    observation_points: np.ndarray,
    inlier_mask: np.ndarray,
    cell_ids: np.ndarray,
    controls: np.ndarray,
    full_homography: np.ndarray,
    ransac_threshold: float,
) -> tuple[np.ndarray, int]:
    full_transformed = transform_points(controls, full_homography)
    variations: list[np.ndarray] = []
    used_cells = 0
    inlier_indices = np.flatnonzero(inlier_mask)
    for cell_id in sorted(set(cell_ids[inlier_indices].tolist())):
        keep = inlier_mask & (cell_ids != cell_id)
        if int(np.count_nonzero(keep)) < 8:
            continue
        homography, fitted_inliers = cv2.findHomography(
            calibration_points[keep],
            observation_points[keep],
            cv2.RANSAC,
            ransac_threshold,
            maxIters=10000,
            confidence=0.999,
        )
        if homography is None or fitted_inliers is None or int(fitted_inliers.sum()) < 6:
            continue
        current = transform_points(controls, homography)
        variations.append(np.linalg.norm(current - full_transformed, axis=1))
        used_cells += 1
    if not variations:
        return np.full(len(controls), np.inf, dtype=np.float64), 0
    matrix = np.vstack(variations)
    return np.percentile(matrix, 95, axis=0), used_cells


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    input_bytes = arguments.input.read_bytes()
    source = json.loads(input_bytes)
    if source.get("schemaVersion") != 1:
        raise ValueError("Unsupported source schema version")
    if source.get("artifactKind") != "locked-broadcast-camera-control-transfer":
        raise ValueError("Input is not a locked broadcast camera control transfer")

    observation_record = source["observationFrame"]
    calibration_record = source["calibrationFrame"]
    observation_path = Path(observation_record["path"])
    calibration_path = Path(calibration_record["path"])
    for label, path, record in (
        ("observation", observation_path, observation_record),
        ("calibration", calibration_path, calibration_record),
    ):
        actual_sha256 = sha256_file(path)
        if actual_sha256 != record["sha256"]:
            raise ValueError(f"{label.title()} frame checksum changed: {path}")

    observation = cv2.imread(str(observation_path), cv2.IMREAD_GRAYSCALE)
    calibration = cv2.imread(str(calibration_path), cv2.IMREAD_GRAYSCALE)
    if observation is None or calibration is None:
        raise ValueError("Could not decode a camera transfer frame")
    if observation.shape != calibration.shape:
        raise ValueError("Camera transfer frames have different dimensions")
    height, width = observation.shape

    mask, includes, excludes = build_mask(
        width,
        height,
        source["staticReviewMask"]["includeRegions"],
        source["staticReviewMask"].get("excludeRegions", []),
    )
    settings = source["featureMatching"]
    maximum_features = int(settings["maximumFeatures"])
    ratio = float(settings["ratioThreshold"])
    ransac_threshold = float(settings["ransacThresholdPixels"])
    if maximum_features < 500:
        raise ValueError("At least 500 ORB features are required")
    if not 0.5 <= ratio <= 0.9:
        raise ValueError("Ratio threshold must be from 0.5 through 0.9")
    if not 0.1 <= ransac_threshold <= 3.0:
        raise ValueError("RANSAC threshold must be from 0.1 through 3 pixels")

    cv2.setRNGSeed(int(source.get("seed", 20260810)))
    detector = cv2.ORB_create(nfeatures=maximum_features)
    observation_keypoints, observation_descriptors = detector.detectAndCompute(
        observation, mask
    )
    calibration_keypoints, calibration_descriptors = detector.detectAndCompute(
        calibration, mask
    )
    if observation_descriptors is None or calibration_descriptors is None:
        raise ValueError("Could not detect ORB descriptors in the static review mask")
    matches = mutual_ratio_matches(
        observation_descriptors,
        calibration_descriptors,
        ratio,
    )
    if len(matches) < 4:
        raise ValueError("Fewer than four mutual feature matches were found")
    calibration_points = np.asarray(
        [calibration_keypoints[item.queryIdx].pt for item in matches], dtype=np.float64
    )
    observation_points = np.asarray(
        [observation_keypoints[item.trainIdx].pt for item in matches], dtype=np.float64
    )
    homography, raw_inlier_mask = cv2.findHomography(
        calibration_points,
        observation_points,
        cv2.RANSAC,
        ransac_threshold,
        maxIters=20000,
        confidence=0.999,
    )
    if homography is None or raw_inlier_mask is None:
        raise ValueError("Could not fit a calibration-to-observation homography")
    inlier_mask = raw_inlier_mask.ravel().astype(bool)
    predicted = transform_points(calibration_points, homography)
    residuals = np.linalg.norm(predicted - observation_points, axis=1)
    inlier_residuals = residuals[inlier_mask]

    grid_columns = int(settings["spatialGridColumns"])
    grid_rows = int(settings["spatialGridRows"])
    if grid_columns < 2 or grid_rows < 2:
        raise ValueError("Spatial match grid requires at least two rows and columns")
    cell_ids = spatial_cell_ids(
        calibration_points,
        width,
        height,
        grid_columns,
        grid_rows,
    )
    occupied_cells = sorted(set(cell_ids[inlier_mask].tolist()))
    mask_pixel_count = int(np.count_nonzero(mask))
    hull_fraction = convex_hull_area_fraction(
        calibration_points[inlier_mask], mask_pixel_count
    )

    controls = source["transferControls"]
    if not isinstance(controls, list) or not controls:
        raise ValueError("At least one regulation-field transfer control is required")
    control_pixels = np.asarray(
        [
            validate_point(item["calibrationPixel"], f"control {item['name']} pixel")
            for item in controls
        ],
        dtype=np.float64,
    )
    control_uncertainties = np.asarray(
        [
            validate_point(
                item["calibrationPixelUncertainty95"],
                f"control {item['name']} uncertainty",
            )
            for item in controls
        ],
        dtype=np.float64,
    )
    if np.any(control_uncertainties <= 0):
        raise ValueError("Control annotation uncertainty must be positive")
    if (
        np.any(control_pixels[:, 0] < 0)
        or np.any(control_pixels[:, 0] >= width)
        or np.any(control_pixels[:, 1] < 0)
        or np.any(control_pixels[:, 1] >= height)
    ):
        raise ValueError("A regulation-field transfer control is outside the image")
    transferred_pixels = transform_points(control_pixels, homography)
    variation_p95, leave_one_out_count = leave_one_cell_out_variation(
        calibration_points,
        observation_points,
        inlier_mask,
        cell_ids,
        control_pixels,
        homography,
        ransac_threshold,
    )
    residual_p95 = percentile(inlier_residuals, 95)
    model_uncertainty = np.maximum(variation_p95, residual_p95)
    transferred_uncertainties = np.sqrt(
        control_uncertainties ** 2 + model_uncertainty[:, None] ** 2
    )
    transferred_controls = []
    for index, item in enumerate(controls):
        transferred_controls.append(
            {
                "name": item["name"],
                "fieldFeet": validate_point(
                    item["fieldFeet"], f"control {item['name']} field point"
                ).tolist(),
                "calibrationPixel": control_pixels[index].tolist(),
                "calibrationPixelUncertainty95": control_uncertainties[index].tolist(),
                "observationPixel": transferred_pixels[index].tolist(),
                "modelVariation95Pixels": float(variation_p95[index]),
                "modelUncertainty95Pixels": float(model_uncertainty[index]),
                "observationPixelUncertainty95": transferred_uncertainties[index].tolist(),
                "semantics": item.get("semantics"),
            }
        )

    diagnostics = transformation_diagnostics(homography, width, height)
    thresholds = source["thresholds"]
    gate_values = {
        "mutualMatchCountPassed": len(matches) >= int(thresholds["minimumMutualMatches"]),
        "inlierMatchCountPassed": int(np.count_nonzero(inlier_mask))
        >= int(thresholds["minimumInlierMatches"]),
        "inlierResidualPassed": residual_p95
        <= float(thresholds["maximumInlierResidualP95Pixels"]),
        "spatialCellCoveragePassed": len(occupied_cells)
        >= int(thresholds["minimumOccupiedSpatialCells"]),
        "convexHullCoveragePassed": hull_fraction
        >= float(thresholds["minimumConvexHullMaskAreaFraction"]),
        "leaveOneCellOutPassed": leave_one_out_count
        >= int(thresholds["minimumLeaveOneCellOutModels"]),
        "controlTransferUncertaintyPassed": bool(
            np.all(
                transferred_uncertainties
                <= float(thresholds["maximumTransferredControlUncertainty95Pixels"])
            )
        ),
        "cameraDisplacementPassed": diagnostics["maximumSampleDisplacementPixels"]
        <= float(thresholds["maximumCameraDisplacementPixels"]),
        "cameraScalePassed": diagnostics["maximumScaleDeltaFraction"]
        <= float(thresholds["maximumCameraScaleDeltaFraction"]),
        "cameraRotationPassed": abs(diagnostics["rotationDegrees"])
        <= float(thresholds["maximumCameraRotationDegrees"]),
    }
    gate_values["allPassed"] = all(gate_values.values())
    blocker_map = {
        "mutualMatchCountPassed": "CAMERA_TRANSFER_MUTUAL_MATCH_COUNT_BELOW_MINIMUM",
        "inlierMatchCountPassed": "CAMERA_TRANSFER_INLIER_COUNT_BELOW_MINIMUM",
        "inlierResidualPassed": "CAMERA_TRANSFER_INLIER_RESIDUAL_EXCEEDS_LIMIT",
        "spatialCellCoveragePassed": "CAMERA_TRANSFER_SPATIAL_CELL_COVERAGE_BELOW_MINIMUM",
        "convexHullCoveragePassed": "CAMERA_TRANSFER_CONVEX_HULL_COVERAGE_BELOW_MINIMUM",
        "leaveOneCellOutPassed": "CAMERA_TRANSFER_LEAVE_ONE_CELL_OUT_COUNT_BELOW_MINIMUM",
        "controlTransferUncertaintyPassed": "CAMERA_TRANSFER_CONTROL_UNCERTAINTY_EXCEEDS_LIMIT",
        "cameraDisplacementPassed": "CAMERA_TRANSFER_DISPLACEMENT_EXCEEDS_LIMIT",
        "cameraScalePassed": "CAMERA_TRANSFER_SCALE_CHANGE_EXCEEDS_LIMIT",
        "cameraRotationPassed": "CAMERA_TRANSFER_ROTATION_EXCEEDS_LIMIT",
    }
    blockers = [
        blocker_map[name]
        for name, passed in gate_values.items()
        if name != "allPassed" and not passed
    ]

    result: dict[str, Any] = {
        "schemaVersion": 1,
        "artifactKind": "locked-broadcast-camera-control-transfer-audit",
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": source["stadiumId"],
        "inputs": {
            "controlPath": str(arguments.input.resolve()),
            "controlSha256": hashlib.sha256(input_bytes).hexdigest(),
            "observationFramePath": str(observation_path.resolve()),
            "observationFrameSha256": sha256_file(observation_path),
            "calibrationFramePath": str(calibration_path.resolve()),
            "calibrationFrameSha256": sha256_file(calibration_path),
        },
        "imageDimensions": {"width": width, "height": height},
        "staticReviewMask": {
            "includeRegions": includes,
            "excludeRegions": excludes,
            "pixelCount": mask_pixel_count,
        },
        "featureMatching": {
            **settings,
            "observationKeypointCount": len(observation_keypoints),
            "calibrationKeypointCount": len(calibration_keypoints),
            "mutualMatchCount": len(matches),
            "inlierMatchCount": int(np.count_nonzero(inlier_mask)),
            "inlierRatio": float(np.mean(inlier_mask)),
            "inlierResidualPixels": {
                "median": percentile(inlier_residuals, 50),
                "p95": residual_p95,
                "maximum": float(np.max(inlier_residuals)),
            },
            "spatialGrid": {
                "columns": grid_columns,
                "rows": grid_rows,
                "occupiedInlierCells": occupied_cells,
                "occupiedInlierCellCount": len(occupied_cells),
                "convexHullMaskAreaFraction": hull_fraction,
            },
            "leaveOneCellOutModelCount": leave_one_out_count,
        },
        "calibrationToObservationHomography": homography.tolist(),
        "cameraChangeDiagnostics": diagnostics,
        "transferredControls": transferred_controls,
        "thresholds": thresholds,
        "gates": gate_values,
        "support": {
            "lockedCameraTransferSupported": gate_values["allPassed"],
            "establishesFieldOrientation": False,
            "establishesWorldTranslation": False,
            "establishesRowGeometry": False,
            "establishesObstructionGeometry": False,
            "establishesIndependentShadowHoldout": False,
        },
        "publication": {
            "eligible": False,
            "blockers": blockers
            + [
                "CAMERA_TRANSFER_IS_ORIENTATION_CALIBRATION_ONLY",
                "ROW_GEOMETRY_NOT_ESTABLISHED",
                "OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    result["artifactVersion"] = artifact_version(result)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
