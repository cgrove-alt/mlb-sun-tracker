#!/usr/bin/env python3
"""Extract and triangulate the overhead-to-open-view boundary in panoramas.

The boundary detector searches for a dark-overhead to brighter-open transition
independently in each image. Known provider camera poses then match the two
curves using spherical epipolar geometry. The result remains a candidate curve
until it repeats across disjoint panorama pairs.
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

from reconstructPanoramaDenseOverhang import panorama_rays, triangulate, values_summary


ANALYSIS_VERSION = "semantic-panorama-opening-boundary-v2"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("stereo", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("surface", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--known-pose-features", type=Path, required=True)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--x-minimum-fraction", type=float, default=0.20)
    parser.add_argument("--x-maximum-fraction", type=float, default=0.80)
    parser.add_argument("--y-minimum-fraction", type=float, default=0.24)
    parser.add_argument("--y-maximum-fraction", type=float, default=0.55)
    parser.add_argument("--contrast-offset-pixels", type=int, default=10)
    parser.add_argument("--minimum-transition-score", type=float, default=18.0)
    parser.add_argument("--curve-sample-stride", type=int, default=6)
    parser.add_argument("--right-search-half-width-pixels", type=int, default=180)
    parser.add_argument("--epipolar-threshold", type=float, default=0.0005)
    parser.add_argument("--maximum-ray-separation-metres", type=float, default=0.02)
    parser.add_argument("--maximum-depth-metres", type=float, default=25.0)
    parser.add_argument("--maximum-embedded-points", type=int, default=5_000)
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


def median_filter(values: np.ndarray, radius: int) -> np.ndarray:
    padded = np.pad(values, (radius, radius), mode="edge")
    return np.asarray([
        np.median(padded[index:index + 2 * radius + 1])
        for index in range(values.size)
    ])


def detect_opening_boundary(
    image: np.ndarray,
    x_minimum_fraction: float,
    x_maximum_fraction: float,
    y_minimum_fraction: float,
    y_maximum_fraction: float,
    contrast_offset: int,
    minimum_score: float,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    height, width = image.shape[:2]
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB).astype(np.float32)
    lab = cv2.GaussianBlur(lab, (0, 0), 2.0)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.float32)
    gray = cv2.GaussianBlur(gray, (0, 0), 2.0)
    x_values = np.arange(
        int(round(width * x_minimum_fraction)),
        int(round(width * x_maximum_fraction)) + 1,
    )
    y_minimum = max(contrast_offset + 1, int(round(height * y_minimum_fraction)))
    y_maximum = min(height - contrast_offset - 2, int(round(height * y_maximum_fraction)))
    y_values = np.arange(y_minimum, y_maximum + 1)
    above_gray = gray[y_values - contrast_offset][:, x_values]
    below_gray = gray[y_values + contrast_offset][:, x_values]
    brightness_transition = below_gray - above_gray
    above_lab = lab[y_values - contrast_offset][:, x_values]
    below_lab = lab[y_values + contrast_offset][:, x_values]
    color_transition = np.linalg.norm(below_lab - above_lab, axis=2)
    score = np.maximum(brightness_transition, 0.0) + 0.25 * color_transition
    row_count, column_count = score.shape
    transition_limit = 3
    smoothness_penalty = 1.0
    accumulated = score[:, 0].astype(float)
    backtrack = np.zeros((row_count, column_count), dtype=np.int8)
    for column in range(1, column_count):
        candidates = []
        for delta in range(-transition_limit, transition_limit + 1):
            shifted = np.full(row_count, -math.inf, dtype=float)
            if delta >= 0:
                shifted[delta:] = accumulated[:row_count - delta]
            else:
                shifted[:row_count + delta] = accumulated[-delta:]
            candidates.append(shifted - smoothness_penalty * abs(delta))
        stacked = np.vstack(candidates)
        best_delta_index = np.argmax(stacked, axis=0)
        accumulated = score[:, column] + stacked[
            best_delta_index,
            np.arange(row_count),
        ]
        backtrack[:, column] = (
            best_delta_index - transition_limit
        ).astype(np.int8)
    best_indices = np.zeros(column_count, dtype=int)
    best_indices[-1] = int(np.argmax(accumulated))
    for column in range(column_count - 1, 0, -1):
        delta = int(backtrack[best_indices[column], column])
        best_indices[column - 1] = best_indices[column] - delta
    raw_y = y_values[best_indices].astype(float)
    raw_score = score[best_indices, np.arange(column_count)]
    smoothed_y = median_filter(raw_y, 4)
    valid = raw_score >= minimum_score
    local_slope = np.abs(np.gradient(smoothed_y))
    valid &= local_slope <= transition_limit
    points = np.column_stack([x_values.astype(float), smoothed_y])
    return points, raw_score, valid


def match_curves(
    left_curve: np.ndarray,
    left_valid: np.ndarray,
    right_curve: np.ndarray,
    right_valid: np.ndarray,
    left_yaw: float,
    right_yaw: float,
    width: int,
    height: int,
    translation: np.ndarray,
    right_x_polynomial: np.ndarray,
    stride: int,
    search_half_width: int,
    epipolar_threshold: float,
    maximum_separation: float,
    maximum_depth: float,
) -> dict[str, np.ndarray]:
    right_by_x = {
        int(round(point[0])): (index, point)
        for index, point in enumerate(right_curve)
        if right_valid[index]
    }
    selected_left = []
    selected_right = []
    selected_epipolar = []
    translation_unit = translation / np.linalg.norm(translation)
    for left_index in range(0, left_curve.shape[0], stride):
        if not left_valid[left_index]:
            continue
        left_point = left_curve[left_index]
        center_x = int(round(float(np.polyval(right_x_polynomial, left_point[0]))))
        candidate_points = []
        for candidate_x in range(center_x - search_half_width, center_x + search_half_width + 1):
            item = right_by_x.get(candidate_x)
            if item is not None:
                candidate_points.append(item[1])
        if not candidate_points:
            continue
        right_candidates = np.asarray(candidate_points, dtype=float)
        repeated_left = np.repeat(left_point[None, :], right_candidates.shape[0], axis=0)
        left_rays = panorama_rays(repeated_left, width, height, left_yaw)
        right_rays = panorama_rays(right_candidates, width, height, right_yaw)
        residuals = np.abs(
            np.sum(np.cross(left_rays, right_rays) * translation_unit, axis=1)
        )
        best = int(np.argmin(residuals))
        if residuals[best] > epipolar_threshold:
            continue
        selected_left.append(left_point)
        selected_right.append(right_candidates[best])
        selected_epipolar.append(residuals[best])
    if not selected_left:
        return {
            "leftPixels": np.empty((0, 2)),
            "rightPixels": np.empty((0, 2)),
            "epipolar": np.empty(0),
            "leftDepth": np.empty(0),
            "rightDepth": np.empty(0),
            "separation": np.empty(0),
            "panoramaPoints": np.empty((0, 3)),
        }
    left_pixels = np.asarray(selected_left)
    right_pixels = np.asarray(selected_right)
    epipolar = np.asarray(selected_epipolar)
    left_rays = panorama_rays(left_pixels, width, height, left_yaw)
    right_rays = panorama_rays(right_pixels, width, height, right_yaw)
    left_depth, right_depth, separation, points = triangulate(
        left_rays,
        right_rays,
        translation,
    )
    geometry = (
        np.isfinite(left_depth)
        & np.isfinite(right_depth)
        & np.all(np.isfinite(points), axis=1)
        & (left_depth > 0)
        & (right_depth > 0)
        & (left_depth <= maximum_depth)
        & (right_depth <= maximum_depth)
        & (separation <= maximum_separation)
    )
    return {
        "leftPixels": left_pixels[geometry],
        "rightPixels": right_pixels[geometry],
        "epipolar": epipolar[geometry],
        "leftDepth": left_depth[geometry],
        "rightDepth": right_depth[geometry],
        "separation": separation[geometry],
        "panoramaPoints": points[geometry],
    }


def main() -> None:
    args = parse_args()
    stereo = json.loads(args.stereo.read_text())
    calibration = json.loads(args.calibration.read_text())
    surface = json.loads(args.surface.read_text())
    known_pose = json.loads(args.known_pose_features.read_text())
    if not calibration["assessment"]["measurementEligible"]:
        raise ValueError("Provider-frame calibration is not measurement eligible")
    if not surface["assessment"].get("providerLocalOverhangingDeckUndersideMeasurementEligible"):
        raise ValueError("Overhanging deck underside is not measurement eligible")
    if not known_pose["assessment"].get("knownPoseProviderLocalMeasurementEligible"):
        raise ValueError("Known-pose feature artifact is not measurement eligible")
    if known_pose["inputs"]["stereo"]["artifactVersion"] != stereo["artifactVersion"]:
        raise ValueError("Known-pose feature artifact does not reference this stereo artifact")
    manifest_path = Path(stereo["inputs"]["manifest"])
    manifest = json.loads(manifest_path.read_text())
    images = {entry["seatId"]: entry for entry in manifest["images"]}
    left_entry = images[stereo["inputs"]["leftSeatId"]]
    right_entry = images[stereo["inputs"]["rightSeatId"]]
    left_path = Path(left_entry["localPath"])
    right_path = Path(right_entry["localPath"])
    left_source = cv2.imread(str(left_path), cv2.IMREAD_COLOR)
    right_source = cv2.imread(str(right_path), cv2.IMREAD_COLOR)
    if left_source is None or right_source is None or left_source.shape != right_source.shape:
        raise ValueError("Could not load matching panorama images")
    source_height, source_width = left_source.shape[:2]
    scale = min(1.0, args.maximum_width / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    left = cv2.resize(left_source, (width, height), interpolation=cv2.INTER_AREA)
    right = cv2.resize(right_source, (width, height), interpolation=cv2.INTER_AREA)
    left_curve, left_scores, left_valid = detect_opening_boundary(
        left,
        args.x_minimum_fraction,
        args.x_maximum_fraction,
        args.y_minimum_fraction,
        args.y_maximum_fraction,
        args.contrast_offset_pixels,
        args.minimum_transition_score,
    )
    right_curve, right_scores, right_valid = detect_opening_boundary(
        right,
        args.x_minimum_fraction,
        args.x_maximum_fraction,
        args.y_minimum_fraction,
        args.y_maximum_fraction,
        args.contrast_offset_pixels,
        args.minimum_transition_score,
    )
    surface_points = np.asarray([
        point["providerLocalMetres"]
        for dataset in [surface["training"], *surface["holdouts"]]
        for point in dataset["points"]
        if point["planeInlier"]
    ], dtype=float)
    plane_y = float(np.median(surface_points[:, 1]))
    mapping_records = []
    for record in known_pose["geometry"]["embeddedPoints"]:
        provider_point = np.asarray(record["providerLocalMetres"], dtype=float)
        if not (
            np.min(surface_points[:, 0]) <= provider_point[0] <= np.max(surface_points[:, 0])
            and plane_y - 2.5 <= provider_point[1] <= plane_y + 0.2
            and np.min(surface_points[:, 2]) - 8.0 <= provider_point[2] <= 42.5
        ):
            continue
        mapping_records.append(record)
    if len(mapping_records) < 12:
        raise ValueError("Too few known-pose mapping features near the opening boundary")
    mapping_left_x = np.asarray([record["leftPixel"][0] for record in mapping_records])
    mapping_right_x = np.asarray([record["rightPixel"][0] for record in mapping_records])
    mapping_inliers = np.ones(mapping_left_x.size, dtype=bool)
    right_x_polynomial = np.polyfit(mapping_left_x, mapping_right_x, 2)
    for _ in range(6):
        right_x_polynomial = np.polyfit(
            mapping_left_x[mapping_inliers],
            mapping_right_x[mapping_inliers],
            2,
        )
        mapping_residual = np.abs(
            np.polyval(right_x_polynomial, mapping_left_x) - mapping_right_x
        )
        refined = mapping_residual <= 20.0
        if np.array_equal(refined, mapping_inliers) or np.count_nonzero(refined) < 12:
            break
        mapping_inliers = refined
    mapping_residual = np.abs(
        np.polyval(right_x_polynomial, mapping_left_x) - mapping_right_x
    )
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"],
        dtype=float,
    )
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"],
        dtype=float,
    )
    left_position = np.asarray(left_entry["config"]["p"], dtype=float)
    right_position = np.asarray(right_entry["config"]["p"], dtype=float)
    translation = provider_to_panorama @ (right_position - left_position)
    matched = match_curves(
        left_curve,
        left_valid,
        right_curve,
        right_valid,
        float(left_entry["config"]["rp"][1]),
        float(right_entry["config"]["rp"][1]),
        width,
        height,
        translation,
        right_x_polynomial,
        args.curve_sample_stride,
        args.right_search_half_width_pixels,
        args.epipolar_threshold,
        args.maximum_ray_separation_metres,
        args.maximum_depth_metres,
    )
    provider_points = left_position + np.einsum(
        "ij,nj->ni",
        panorama_to_provider,
        matched["panoramaPoints"],
    )
    plane_normal = np.asarray(
        surface["training"]["plane"]["normalProviderLocal"],
        dtype=float,
    )
    plane_offset = float(surface["training"]["plane"]["offsetMetres"])
    plane_residual = np.abs(
        np.einsum("ij,j->i", provider_points, plane_normal) + plane_offset
    )
    within_section = (
        (provider_points[:, 0] >= np.min(surface_points[:, 0]))
        & (provider_points[:, 0] <= np.max(surface_points[:, 0]))
        & (provider_points[:, 1] >= np.median(surface_points[:, 1]) - 2.5)
        & (provider_points[:, 1] <= np.median(surface_points[:, 1]) + 0.2)
        & (provider_points[:, 2] >= np.min(surface_points[:, 2]) - 8.0)
        & (provider_points[:, 2] <= np.max(surface_points[:, 2]))
    )
    for key in list(matched):
        matched[key] = matched[key][within_section]
    provider_points = provider_points[within_section]
    plane_residual = plane_residual[within_section]

    diagnostic_left = left.copy()
    diagnostic_right = right.copy()
    for curve, valid, image, color in [
        (left_curve, left_valid, diagnostic_left, (0, 255, 255)),
        (right_curve, right_valid, diagnostic_right, (0, 255, 255)),
    ]:
        points = np.round(curve[valid]).astype(np.int32).reshape(-1, 1, 2)
        if points.shape[0] >= 2:
            cv2.polylines(image, [points], False, color, 3, cv2.LINE_AA)
    for point in matched["leftPixels"]:
        cv2.circle(diagnostic_left, tuple(np.round(point).astype(int)), 4, (0, 0, 255), -1)
    for point in matched["rightPixels"]:
        cv2.circle(diagnostic_right, tuple(np.round(point).astype(int)), 4, (0, 0, 255), -1)
    panel = np.vstack([
        cv2.resize(diagnostic_left, (1600, 800), interpolation=cv2.INTER_AREA),
        cv2.resize(diagnostic_right, (1600, 800), interpolation=cv2.INTER_AREA),
    ])
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_png), panel):
        raise ValueError("Could not write semantic boundary diagnostic")

    candidate_measurement_eligible = bool(
        provider_points.shape[0] >= 30
        and float(np.percentile(matched["epipolar"], 95)) <= args.epipolar_threshold
        and float(np.percentile(matched["separation"], 95))
        <= args.maximum_ray_separation_metres
    ) if provider_points.shape[0] else False
    embedded_indices = np.arange(min(provider_points.shape[0], args.maximum_embedded_points))
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "provider-local-semantic-opening-boundary-candidate",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "stereo": {
                "path": str(args.stereo),
                "sha256": file_sha256(args.stereo),
                "artifactVersion": stereo["artifactVersion"],
            },
            "calibration": {
                "path": str(args.calibration),
                "sha256": file_sha256(args.calibration),
                "artifactVersion": calibration["artifactVersion"],
            },
            "surface": {
                "path": str(args.surface),
                "sha256": file_sha256(args.surface),
                "artifactVersion": surface["artifactVersion"],
            },
            "knownPoseFeatures": {
                "path": str(args.known_pose_features),
                "sha256": file_sha256(args.known_pose_features),
                "artifactVersion": known_pose["artifactVersion"],
            },
            "manifest": {
                "path": str(manifest_path),
                "sha256": file_sha256(manifest_path),
            },
            "leftImageSha256": file_sha256(left_path),
            "rightImageSha256": file_sha256(right_path),
        },
        "parameters": {
            "maximumWidth": args.maximum_width,
            "xFraction": [args.x_minimum_fraction, args.x_maximum_fraction],
            "yFraction": [args.y_minimum_fraction, args.y_maximum_fraction],
            "contrastOffsetPixels": args.contrast_offset_pixels,
            "minimumTransitionScore": args.minimum_transition_score,
            "curveSampleStride": args.curve_sample_stride,
            "rightSearchHalfWidthPixels": args.right_search_half_width_pixels,
            "epipolarThreshold": args.epipolar_threshold,
            "maximumRaySeparationMetres": args.maximum_ray_separation_metres,
            "maximumDepthMetres": args.maximum_depth_metres,
        },
        "curveDetection": {
            "leftValidPointCount": int(np.count_nonzero(left_valid)),
            "rightValidPointCount": int(np.count_nonzero(right_valid)),
            "leftTransitionScore": values_summary(left_scores[left_valid]),
            "rightTransitionScore": values_summary(right_scores[right_valid]),
            "knownPoseRightXMapping": {
                "candidateFeatureCount": len(mapping_records),
                "inlierFeatureCount": int(np.count_nonzero(mapping_inliers)),
                "polynomialCoefficients": [
                    round(float(value), 12) for value in right_x_polynomial
                ],
                "inlierAbsoluteResidualPixels": values_summary(
                    mapping_residual[mapping_inliers]
                ),
            },
        },
        "triangulation": {
            "providerLocalPointCount": int(provider_points.shape[0]),
            "epipolarResidual": values_summary(matched["epipolar"]),
            "closestRaySeparationMetres": values_summary(matched["separation"]),
            "leftDepthMetres": values_summary(matched["leftDepth"]),
            "providerXMetres": values_summary(provider_points[:, 0]),
            "providerYMetres": values_summary(provider_points[:, 1]),
            "providerZMetres": values_summary(provider_points[:, 2]),
            "undersidePlaneAbsoluteResidualMetres": values_summary(plane_residual),
            "points": [
                {
                    "providerLocalMetres": [round(float(value), 6) for value in provider_points[index]],
                    "leftPixel": [round(float(value), 3) for value in matched["leftPixels"][index]],
                    "rightPixel": [round(float(value), 3) for value in matched["rightPixels"][index]],
                    "epipolarResidual": round(float(matched["epipolar"][index]), 9),
                    "closestRaySeparationMetres": round(float(matched["separation"][index]), 6),
                    "undersidePlaneAbsoluteResidualMetres": round(float(plane_residual[index]), 6),
                }
                for index in embedded_indices
            ],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
            "overlay": "yellow is independently detected curve; red marks accepted known-pose triangulations",
        },
        "assessment": {
            "providerLocalBoundaryCandidateMeasurementEligible": candidate_measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "SEMANTIC_BOUNDARY_NOT_CROSS_VALIDATED_ACROSS_DISJOINT_CAMERA_PAIRS",
                "BOUNDARY_CURVE_NOT_LINKED_TO_CLOSED_OBSTRUCTION_VOLUME",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    stable = dict(artifact)
    stable.pop("artifactVersion")
    artifact["artifactVersion"] = f"sha256:{value_fingerprint(stable)}"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "leftCurvePoints": int(np.count_nonzero(left_valid)),
        "rightCurvePoints": int(np.count_nonzero(right_valid)),
        "triangulatedProviderPoints": int(provider_points.shape[0]),
        "providerZMedianMetres": artifact["triangulation"]["providerZMetres"]["median"],
        "measurementEligible": candidate_measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
