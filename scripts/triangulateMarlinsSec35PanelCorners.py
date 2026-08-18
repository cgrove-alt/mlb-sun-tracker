#!/usr/bin/env python3
"""Triangulate one current Section 35 display from disjoint camera bundles.

The display detector, camera partitions, and acceptance gates are fixed in this
source. Each partition reconstructs all four display corners from four camera
rays. Agreement is evaluated across partitions, never by reusing a fitted plane.
The result describes provider-render geometry only. It is not an as-built survey
and it cannot make a row-shade result publication eligible.
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

from reconstructPanoramaDenseOverhang import panorama_rays, values_summary


ANALYSIS_VERSION = "marlins-sec35-panel-four-camera-bundle-v1"
PARTITIONS = {
    "training": (
        "S_SEC35-10-12",
        "S_SEC35-11wc-8",
        "S_SEC35-10-16",
        "S_SEC35-11wc-10",
    ),
    "holdout": (
        "S_SEC35-10-7",
        "S_SEC35-11wc-4",
        "S_SEC35-10-18",
        "S_SEC35-11wc-12",
    ),
    "final": (
        "S_SEC35-10-21",
        "S_SEC35-11wc-13",
        "S_SEC35-10-5",
        "S_SEC35-11wc-3",
    ),
}
DETECTION_THRESHOLDS = (35, 40, 45)
PRIMARY_DETECTION_THRESHOLD = 40
SEARCH_X_FRACTION = (0.45, 0.60)
SEARCH_Y_FRACTION = (0.36, 0.50)
MINIMUM_CONTOUR_WIDTH_PIXELS = 100
MAXIMUM_CONTOUR_WIDTH_PIXELS = 220
MINIMUM_CONTOUR_HEIGHT_PIXELS = 50
MAXIMUM_CONTOUR_HEIGHT_PIXELS = 110
MINIMUM_CONTOUR_ASPECT_RATIO = 1.5
MAXIMUM_CONTOUR_ASPECT_RATIO = 3.0
MINIMUM_CONTOUR_AREA_PIXELS = 5_000.0
MAXIMUM_CONTOUR_AREA_PIXELS = 15_000.0
POLYGON_APPROXIMATION_FRACTION = 0.03
MAXIMUM_THRESHOLD_CORNER_DRIFT_PIXELS = 3.0
MAXIMUM_RAY_RESIDUAL_P95_METRES = 0.03
MAXIMUM_RAY_RESIDUAL_METRES = 0.05
MAXIMUM_NORMAL_MATRIX_CONDITION_NUMBER = 10_000.0
MAXIMUM_PARTITION_CORNER_DISAGREEMENT_METRES = 0.3048
MAXIMUM_PARTITION_NORMAL_DISAGREEMENT_DEGREES = 1.0
CORNER_LABELS = ("topLeft", "topRight", "bottomRight", "bottomLeft")
PARTITION_COLORS = {
    "training": (30, 180, 30),
    "holdout": (20, 150, 240),
    "final": (220, 80, 40),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
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


def order_corners(points: np.ndarray) -> np.ndarray:
    points = np.asarray(points, dtype=float)
    if points.shape != (4, 2):
        raise ValueError("Exactly four 2D corners are required")
    sums = points[:, 0] + points[:, 1]
    differences = points[:, 0] - points[:, 1]
    ordered = np.asarray([
        points[np.argmin(sums)],
        points[np.argmax(differences)],
        points[np.argmax(sums)],
        points[np.argmin(differences)],
    ])
    if np.unique(ordered, axis=0).shape[0] != 4:
        raise ValueError("Corner ordering is ambiguous")
    return ordered


def detect_panel(image: np.ndarray, threshold: int) -> dict[str, Any]:
    height, width = image.shape[:2]
    x0 = int(math.floor(width * SEARCH_X_FRACTION[0]))
    x1 = int(math.ceil(width * SEARCH_X_FRACTION[1]))
    y0 = int(math.floor(height * SEARCH_Y_FRACTION[0]))
    y1 = int(math.ceil(height * SEARCH_Y_FRACTION[1]))
    gray = cv2.cvtColor(image[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    candidates = []
    for contour in contours:
        x, y, contour_width, contour_height = cv2.boundingRect(contour)
        aspect_ratio = contour_width / max(contour_height, 1)
        contour_area = float(cv2.contourArea(contour))
        if not (
            MINIMUM_CONTOUR_WIDTH_PIXELS <= contour_width <= MAXIMUM_CONTOUR_WIDTH_PIXELS
            and MINIMUM_CONTOUR_HEIGHT_PIXELS <= contour_height <= MAXIMUM_CONTOUR_HEIGHT_PIXELS
            and MINIMUM_CONTOUR_ASPECT_RATIO <= aspect_ratio <= MAXIMUM_CONTOUR_ASPECT_RATIO
            and MINIMUM_CONTOUR_AREA_PIXELS <= contour_area <= MAXIMUM_CONTOUR_AREA_PIXELS
        ):
            continue
        perimeter = cv2.arcLength(contour, True)
        polygon = cv2.approxPolyDP(
            contour,
            POLYGON_APPROXIMATION_FRACTION * perimeter,
            True,
        ).reshape(-1, 2)
        if polygon.shape[0] != 4:
            continue
        corners = order_corners(
            polygon.astype(float) + np.asarray([x0, y0], dtype=float)
        )
        candidates.append({
            "corners": corners,
            "boundingBoxPixels": [x + x0, y + y0, contour_width, contour_height],
            "contourAreaPixels": contour_area,
            "aspectRatio": float(aspect_ratio),
        })
    if len(candidates) != 1:
        raise ValueError(
            f"Threshold {threshold} produced {len(candidates)} panel candidates; expected one"
        )
    return candidates[0]


def multi_ray_point(
    origins: np.ndarray,
    directions: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, float]:
    identity = np.eye(3)
    projectors = identity[None, :, :] - np.einsum(
        "ni,nj->nij", directions, directions
    )
    normal_matrix = np.sum(projectors, axis=0)
    right_hand_side = np.einsum("nij,nj->i", projectors, origins)
    point = np.linalg.solve(normal_matrix, right_hand_side)
    offsets = point[None, :] - origins
    residual_vectors = np.einsum("nij,nj->ni", projectors, offsets)
    residuals = np.linalg.norm(residual_vectors, axis=1)
    condition_number = float(np.linalg.cond(normal_matrix))
    return point, residuals, condition_number


def fit_plane(corners: np.ndarray) -> dict[str, Any]:
    center = np.mean(corners, axis=0)
    _, _, right_vectors = np.linalg.svd(corners - center, full_matrices=False)
    normal = right_vectors[-1]
    normal /= np.linalg.norm(normal)
    if normal[0] > 0:
        normal = -normal
    residuals = np.abs((corners - center) @ normal)
    widths = np.asarray([
        np.linalg.norm(corners[1] - corners[0]),
        np.linalg.norm(corners[2] - corners[3]),
    ])
    heights = np.asarray([
        np.linalg.norm(corners[3] - corners[0]),
        np.linalg.norm(corners[2] - corners[1]),
    ])
    return {
        "center": center,
        "normal": normal,
        "residuals": residuals,
        "widths": widths,
        "heights": heights,
    }


def angle_degrees(first: np.ndarray, second: np.ndarray) -> float:
    cosine = float(np.clip(abs(np.dot(first, second)), 0.0, 1.0))
    return math.degrees(math.acos(cosine))


def round_array(values: np.ndarray) -> list[Any]:
    return np.round(np.asarray(values, dtype=float), 6).tolist()


def render_diagnostic(
    output_path: Path,
    observations: dict[str, dict[str, Any]],
    entries: dict[str, dict[str, Any]],
    partition_results: dict[str, dict[str, Any]],
) -> None:
    tile_width, tile_height = 620, 290
    canvas = np.full((tile_height * 4, tile_width * 3, 3), 247, dtype=np.uint8)
    for partition_index, (partition, seat_ids) in enumerate(PARTITIONS.items()):
        for view_index, seat_id in enumerate(seat_ids):
            image = cv2.imread(entries[seat_id]["localPath"], cv2.IMREAD_COLOR)
            corners = observations[seat_id]["primaryCornersPixels"]
            minimum = np.floor(np.min(corners, axis=0) - np.asarray([85, 70])).astype(int)
            maximum = np.ceil(np.max(corners, axis=0) + np.asarray([85, 70])).astype(int)
            minimum = np.maximum(minimum, 0)
            maximum = np.minimum(maximum, np.asarray([image.shape[1], image.shape[0]]))
            crop = image[minimum[1]:maximum[1], minimum[0]:maximum[0]].copy()
            local_corners = corners - minimum[None, :]
            color = PARTITION_COLORS[partition]
            cv2.polylines(
                crop,
                [np.round(local_corners).astype(np.int32)],
                True,
                color,
                3,
                cv2.LINE_AA,
            )
            for corner_index, point in enumerate(local_corners):
                center = tuple(np.round(point).astype(int))
                cv2.circle(crop, center, 7, color, -1, cv2.LINE_AA)
                cv2.putText(
                    crop,
                    str(corner_index + 1),
                    (center[0] + 8, center[1] - 8),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.55,
                    (255, 255, 255),
                    2,
                    cv2.LINE_AA,
                )
            available_height = tile_height - 56
            scale = min(
                (tile_width - 20) / max(crop.shape[1], 1),
                available_height / max(crop.shape[0], 1),
            )
            resized = cv2.resize(
                crop,
                (int(round(crop.shape[1] * scale)), int(round(crop.shape[0] * scale))),
                interpolation=cv2.INTER_AREA if scale < 1 else cv2.INTER_CUBIC,
            )
            x0 = partition_index * tile_width + (tile_width - resized.shape[1]) // 2
            y0 = view_index * tile_height + 42
            canvas[y0:y0 + resized.shape[0], x0:x0 + resized.shape[1]] = resized
            residual = partition_results[partition]["perViewRayResidualsMetres"][seat_id]
            label = f"{partition}: {seat_id}  ray residual max {max(residual):.3f} m"
            cv2.putText(
                canvas,
                label,
                (partition_index * tile_width + 12, view_index * tile_height + 28),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.58,
                (25, 25, 25),
                1,
                cv2.LINE_AA,
            )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output_path), canvas):
        raise ValueError("Could not write diagnostic image")


def main() -> None:
    args = parse_args()
    manifest = json.loads(args.manifest.read_text())
    calibration = json.loads(args.calibration.read_text())
    all_entries = {entry["seatId"]: entry for entry in manifest["images"]}
    required_ids = tuple(seat_id for ids in PARTITIONS.values() for seat_id in ids)
    if len(set(required_ids)) != len(required_ids):
        raise ValueError("Camera partitions are not disjoint")
    missing_ids = sorted(set(required_ids) - set(all_entries))
    if missing_ids:
        raise ValueError(f"Manifest is missing required cameras: {missing_ids}")
    entries = {seat_id: all_entries[seat_id] for seat_id in required_ids}
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"], dtype=float
    )

    observations: dict[str, dict[str, Any]] = {}
    image_inputs = []
    for seat_id in required_ids:
        entry = entries[seat_id]
        image_path = Path(entry["localPath"])
        image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not load {image_path}")
        detections = {
            threshold: detect_panel(image, threshold)
            for threshold in DETECTION_THRESHOLDS
        }
        primary_corners = detections[PRIMARY_DETECTION_THRESHOLD]["corners"]
        threshold_corners = np.stack([
            detections[threshold]["corners"] for threshold in DETECTION_THRESHOLDS
        ])
        threshold_drifts = np.linalg.norm(
            threshold_corners - primary_corners[None, :, :], axis=2
        )
        panorama_directions = panorama_rays(
            primary_corners,
            image.shape[1],
            image.shape[0],
            float(entry["config"]["rp"][1]),
        )
        provider_directions = np.einsum(
            "ij,nj->ni", panorama_to_provider, panorama_directions
        )
        provider_directions /= np.linalg.norm(
            provider_directions, axis=1, keepdims=True
        )
        observations[seat_id] = {
            "primaryCornersPixels": primary_corners,
            "thresholdCornersPixels": threshold_corners,
            "thresholdDriftsPixels": threshold_drifts,
            "providerDirections": provider_directions,
            "imageDimensionsPixels": [image.shape[1], image.shape[0]],
            "detections": detections,
        }
        image_inputs.append({
            "seatId": seat_id,
            "path": str(image_path),
            "sha256": file_sha256(image_path),
            "providerCameraPositionMetres": entry["config"]["p"],
            "providerYawDegrees": entry["config"]["rp"][1],
        })

    partition_results: dict[str, dict[str, Any]] = {}
    all_residuals = []
    all_condition_numbers = []
    for partition, seat_ids in PARTITIONS.items():
        origins = np.asarray([entries[seat_id]["config"]["p"] for seat_id in seat_ids])
        corners = []
        residuals_by_corner = []
        condition_numbers = []
        per_view_residuals = {seat_id: [] for seat_id in seat_ids}
        for corner_index in range(4):
            directions = np.asarray([
                observations[seat_id]["providerDirections"][corner_index]
                for seat_id in seat_ids
            ])
            point, residuals, condition_number = multi_ray_point(origins, directions)
            corners.append(point)
            residuals_by_corner.append(residuals)
            condition_numbers.append(condition_number)
            for view_index, seat_id in enumerate(seat_ids):
                per_view_residuals[seat_id].append(float(residuals[view_index]))
        corners_array = np.asarray(corners)
        residuals_array = np.asarray(residuals_by_corner)
        plane = fit_plane(corners_array)
        all_residuals.extend(residuals_array.ravel().tolist())
        all_condition_numbers.extend(condition_numbers)
        partition_results[partition] = {
            "seatIds": list(seat_ids),
            "providerCornersMetres": corners_array,
            "rayResidualsMetres": residuals_array,
            "perViewRayResidualsMetres": per_view_residuals,
            "normalMatrixConditionNumbers": np.asarray(condition_numbers),
            "plane": plane,
        }

    comparisons = []
    partition_names = tuple(PARTITIONS)
    for first_index, first_name in enumerate(partition_names):
        for second_name in partition_names[first_index + 1:]:
            first = partition_results[first_name]
            second = partition_results[second_name]
            corner_disagreements = np.linalg.norm(
                first["providerCornersMetres"] - second["providerCornersMetres"], axis=1
            )
            comparisons.append({
                "partitions": [first_name, second_name],
                "cornerDisagreementMetres": corner_disagreements,
                "cornerDisagreementP95Metres": float(np.percentile(corner_disagreements, 95)),
                "normalDisagreementDegrees": angle_degrees(
                    first["plane"]["normal"], second["plane"]["normal"]
                ),
            })

    all_residuals_array = np.asarray(all_residuals)
    all_condition_numbers_array = np.asarray(all_condition_numbers)
    threshold_drifts_array = np.concatenate([
        observations[seat_id]["thresholdDriftsPixels"].ravel()
        for seat_id in required_ids
    ])
    detector_passed = bool(
        np.max(threshold_drifts_array) <= MAXIMUM_THRESHOLD_CORNER_DRIFT_PIXELS
    )
    ray_residual_passed = bool(
        np.percentile(all_residuals_array, 95) <= MAXIMUM_RAY_RESIDUAL_P95_METRES
        and np.max(all_residuals_array) <= MAXIMUM_RAY_RESIDUAL_METRES
    )
    condition_passed = bool(
        np.max(all_condition_numbers_array) <= MAXIMUM_NORMAL_MATRIX_CONDITION_NUMBER
    )
    corner_agreement_passed = all(
        comparison["cornerDisagreementP95Metres"]
        <= MAXIMUM_PARTITION_CORNER_DISAGREEMENT_METRES
        for comparison in comparisons
    )
    orientation_agreement_passed = all(
        comparison["normalDisagreementDegrees"]
        <= MAXIMUM_PARTITION_NORMAL_DISAGREEMENT_DEGREES
        for comparison in comparisons
    )
    candidate_eligible = bool(
        detector_passed
        and ray_residual_passed
        and condition_passed
        and corner_agreement_passed
        and orientation_agreement_passed
    )

    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output_npz,
        partition_names=np.asarray(partition_names),
        provider_corners_metres=np.stack([
            partition_results[name]["providerCornersMetres"] for name in partition_names
        ]),
        provider_plane_normals=np.stack([
            partition_results[name]["plane"]["normal"] for name in partition_names
        ]),
        ray_residuals_metres=np.stack([
            partition_results[name]["rayResidualsMetres"] for name in partition_names
        ]),
        normal_matrix_condition_numbers=np.stack([
            partition_results[name]["normalMatrixConditionNumbers"]
            for name in partition_names
        ]),
    )
    render_diagnostic(args.output_png, observations, entries, partition_results)

    stable = {
        "manifestSha256": file_sha256(args.manifest),
        "calibrationSha256": file_sha256(args.calibration),
        "images": image_inputs,
        "outputNpzSha256": file_sha256(args.output_npz),
        "outputPngSha256": file_sha256(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "current-provider-model-disjoint-panel-corner-triangulation",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        "inputs": {
            "manifest": {"path": str(args.manifest), "sha256": stable["manifestSha256"]},
            "calibration": {
                "path": str(args.calibration),
                "sha256": stable["calibrationSha256"],
                "artifactVersion": calibration.get("artifactVersion"),
            },
            "images": image_inputs,
        },
        "fixedCameraPartitions": {
            name: list(seat_ids) for name, seat_ids in PARTITIONS.items()
        } | {"allPartitionsDisjoint": True},
        "detector": {
            "searchXFraction": list(SEARCH_X_FRACTION),
            "searchYFraction": list(SEARCH_Y_FRACTION),
            "grayThresholds": list(DETECTION_THRESHOLDS),
            "primaryGrayThreshold": PRIMARY_DETECTION_THRESHOLD,
            "contourRetrieval": "external",
            "contourWidthPixels": [MINIMUM_CONTOUR_WIDTH_PIXELS, MAXIMUM_CONTOUR_WIDTH_PIXELS],
            "contourHeightPixels": [MINIMUM_CONTOUR_HEIGHT_PIXELS, MAXIMUM_CONTOUR_HEIGHT_PIXELS],
            "contourAspectRatio": [MINIMUM_CONTOUR_ASPECT_RATIO, MAXIMUM_CONTOUR_ASPECT_RATIO],
            "contourAreaPixels": [MINIMUM_CONTOUR_AREA_PIXELS, MAXIMUM_CONTOUR_AREA_PIXELS],
            "polygonApproximationFractionOfPerimeter": POLYGON_APPROXIMATION_FRACTION,
            "requiredCornerCount": 4,
            "maximumThresholdCornerDriftPixels": MAXIMUM_THRESHOLD_CORNER_DRIFT_PIXELS,
            "observedThresholdCornerDriftPixels": values_summary(threshold_drifts_array),
            "passed": detector_passed,
        },
        "triangulation": {
            "method": "least-squares closest point to four independently observed camera rays per corner and partition",
            "maximumRayResidualP95Metres": MAXIMUM_RAY_RESIDUAL_P95_METRES,
            "maximumRayResidualMetres": MAXIMUM_RAY_RESIDUAL_METRES,
            "maximumNormalMatrixConditionNumber": MAXIMUM_NORMAL_MATRIX_CONDITION_NUMBER,
            "observedRayResidualMetres": values_summary(all_residuals_array),
            "observedNormalMatrixConditionNumber": values_summary(all_condition_numbers_array),
            "rayResidualPassed": ray_residual_passed,
            "conditionPassed": condition_passed,
        },
        "partitionGeometry": {
            name: {
                "cornerLabels": list(CORNER_LABELS),
                "providerCornersMetres": round_array(result["providerCornersMetres"]),
                "providerPlaneCenterMetres": round_array(result["plane"]["center"]),
                "providerPlaneNormal": round_array(result["plane"]["normal"]),
                "planeResidualMetres": values_summary(result["plane"]["residuals"]),
                "panelWidthsMetres": round_array(result["plane"]["widths"]),
                "panelHeightsMetres": round_array(result["plane"]["heights"]),
                "rayResidualMetres": values_summary(result["rayResidualsMetres"].ravel()),
                "normalMatrixConditionNumber": values_summary(result["normalMatrixConditionNumbers"]),
            }
            for name, result in partition_results.items()
        },
        "partitionComparisons": [
            {
                "partitions": comparison["partitions"],
                "cornerDisagreementMetres": round_array(comparison["cornerDisagreementMetres"]),
                "cornerDisagreementP95Metres": round(comparison["cornerDisagreementP95Metres"], 6),
                "normalDisagreementDegrees": round(comparison["normalDisagreementDegrees"], 6),
            }
            for comparison in comparisons
        ],
        "gates": {
            "maximumPartitionCornerDisagreementMetres": MAXIMUM_PARTITION_CORNER_DISAGREEMENT_METRES,
            "maximumPartitionNormalDisagreementDegrees": MAXIMUM_PARTITION_NORMAL_DISAGREEMENT_DEGREES,
            "allCornerComparisonsPassed": corner_agreement_passed,
            "allOrientationComparisonsPassed": orientation_agreement_passed,
        },
        "geometry": {
            "coordinateFrame": "current 3DDV provider-local metres",
            "npzPath": str(args.output_npz),
            "npzSha256": stable["outputNpzSha256"],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": stable["outputPngSha256"],
        },
        "semanticScope": {
            "established": "four visible outer corners of one current provider-render display face",
            "notEstablished": [
                "display thickness or rear face",
                "closed obstruction volume",
                "physical as-built persistence",
                "survey-grade world position",
                "any other obstruction, section, level, or stadium",
            ],
        },
        "assessment": {
            "currentProviderModelPanelFaceCandidateEligible": candidate_eligible,
            "physicalAsBuiltMeasurementEligible": False,
            "publicationEligible": False,
            "reason": (
                "All fixed provider-model detector, ray, corner, and orientation gates passed."
                if candidate_eligible
                else "At least one fixed provider-model detector, ray, corner, or orientation gate failed."
            ),
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "candidateEligible": candidate_eligible,
        "detectorPassed": detector_passed,
        "rayResidualPassed": ray_residual_passed,
        "conditionPassed": condition_passed,
        "cornerAgreementPassed": corner_agreement_passed,
        "orientationAgreementPassed": orientation_agreement_passed,
        "rayResidualP95Metres": round(float(np.percentile(all_residuals_array, 95)), 6),
        "maximumNormalDisagreementDegrees": round(max(
            comparison["normalDisagreementDegrees"] for comparison in comparisons
        ), 6),
        "maximumCornerDisagreementP95Metres": round(max(
            comparison["cornerDisagreementP95Metres"] for comparison in comparisons
        ), 6),
    }, indent=2))


if __name__ == "__main__":
    main()
