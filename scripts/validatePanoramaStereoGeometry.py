#!/usr/bin/env python3
"""Validate whether public venue panoramas support calibrated stereo geometry.

The test uses feature correspondences from two full spherical panoramas and
the provider-local camera baseline. It estimates a shared-frame translation
direction from a training partition, evaluates an untouched deterministic
holdout partition, and reports sparse triangulation diagnostics.

This is a research measurement only. It does not establish the venue frame,
survey accuracy, roof semantics, or publication eligibility.
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


ANALYSIS_VERSION = "spherical-panorama-stereo-validation-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("left_seat_id")
    parser.add_argument("right_seat_id")
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--ratio-threshold", type=float, default=0.72)
    parser.add_argument("--ransac-iterations", type=int, default=10_000)
    parser.add_argument("--epipolar-threshold", type=float, default=0.0005)
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


def summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 6),
        "median": None if finite.size == 0 else round(float(np.median(finite)), 6),
        "p95": None if finite.size == 0 else round(float(np.percentile(finite, 95)), 6),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 6),
    }


def panorama_rays(
    points: np.ndarray,
    width: int,
    height: int,
    provider_yaw_degrees: float,
) -> np.ndarray:
    longitude = (points[:, 0] / width - 0.5) * (2.0 * math.pi)
    latitude = (0.5 - points[:, 1] / height) * math.pi
    cosine_latitude = np.cos(latitude)
    rays = np.column_stack([
        cosine_latitude * np.cos(longitude),
        np.sin(latitude),
        cosine_latitude * np.sin(longitude),
    ])
    rays /= np.linalg.norm(rays, axis=1, keepdims=True)
    yaw = math.radians(provider_yaw_degrees)
    cosine_yaw = math.cos(yaw)
    sine_yaw = math.sin(yaw)
    rotated = np.empty_like(rays)
    rotated[:, 0] = cosine_yaw * rays[:, 0] + sine_yaw * rays[:, 2]
    rotated[:, 1] = rays[:, 1]
    rotated[:, 2] = -sine_yaw * rays[:, 0] + cosine_yaw * rays[:, 2]
    return rotated


def deterministic_holdout(points: np.ndarray) -> np.ndarray:
    values = []
    for point in points:
        key = f"holdout-v1:{point[0]:.3f}:{point[1]:.3f}".encode("utf-8")
        values.append(int.from_bytes(hashlib.sha256(key).digest()[:4], "big") % 5 == 0)
    return np.asarray(values, dtype=bool)


def robust_translation_direction(
    cross_products: np.ndarray,
    iterations: int,
    threshold: float,
) -> tuple[np.ndarray, np.ndarray]:
    if cross_products.shape[0] < 8:
        raise ValueError("At least eight training correspondences are required")
    random = np.random.default_rng(20260808)
    best_direction: np.ndarray | None = None
    best_inliers = np.zeros(cross_products.shape[0], dtype=bool)
    best_score = (-1, math.inf)
    for _ in range(iterations):
        first, second = random.choice(cross_products.shape[0], size=2, replace=False)
        direction = np.cross(cross_products[first], cross_products[second])
        norm = np.linalg.norm(direction)
        if norm < 1e-10:
            continue
        direction /= norm
        residual = np.abs(np.sum(cross_products * direction, axis=1))
        inliers = residual <= threshold
        score = (int(np.count_nonzero(inliers)), float(np.median(residual[inliers])))
        if score[0] > best_score[0] or (score[0] == best_score[0] and score[1] < best_score[1]):
            best_score = score
            best_direction = direction
            best_inliers = inliers
    if best_direction is None or np.count_nonzero(best_inliers) < 8:
        raise ValueError("Robust translation fit did not find enough inliers")
    _, _, right_vectors = np.linalg.svd(cross_products[best_inliers], full_matrices=False)
    refined = right_vectors[-1]
    refined /= np.linalg.norm(refined)
    if np.dot(refined, best_direction) < 0:
        refined *= -1
    refined_residual = np.abs(np.sum(cross_products * refined, axis=1))
    return refined, refined_residual <= threshold


def triangulate(
    left_rays: np.ndarray,
    right_rays: np.ndarray,
    translation: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    left_depths = np.full(left_rays.shape[0], np.nan)
    right_depths = np.full(left_rays.shape[0], np.nan)
    separation = np.full(left_rays.shape[0], np.nan)
    points = np.full((left_rays.shape[0], 3), np.nan)
    for index, (left_ray, right_ray) in enumerate(zip(left_rays, right_rays)):
        matrix = np.column_stack([left_ray, -right_ray])
        depths, _, _, _ = np.linalg.lstsq(matrix, translation, rcond=None)
        left_point = left_ray * depths[0]
        right_point = translation + right_ray * depths[1]
        left_depths[index] = depths[0]
        right_depths[index] = depths[1]
        separation[index] = np.linalg.norm(left_point - right_point)
        points[index] = (left_point + right_point) / 2.0
    return left_depths, right_depths, separation, points


def main() -> None:
    args = parse_args()
    manifest = json.loads(args.manifest.read_text())
    images_by_id = {image["seatId"]: image for image in manifest.get("images", [])}
    if args.left_seat_id not in images_by_id or args.right_seat_id not in images_by_id:
        raise ValueError("Both requested seat IDs must exist in the manifest")
    left_entry = images_by_id[args.left_seat_id]
    right_entry = images_by_id[args.right_seat_id]
    left_path = Path(left_entry["localPath"])
    right_path = Path(right_entry["localPath"])
    left_image = cv2.imread(str(left_path), cv2.IMREAD_COLOR)
    right_image = cv2.imread(str(right_path), cv2.IMREAD_COLOR)
    if left_image is None or right_image is None:
        raise ValueError("Could not read one or both panorama images")
    if left_image.shape != right_image.shape:
        raise ValueError("Panorama dimensions differ")
    source_height, source_width = left_image.shape[:2]
    scale = min(1.0, args.maximum_width / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    left_image = cv2.resize(left_image, (width, height), interpolation=cv2.INTER_AREA)
    right_image = cv2.resize(right_image, (width, height), interpolation=cv2.INTER_AREA)

    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(16, 8))
    left_gray = clahe.apply(cv2.cvtColor(left_image, cv2.COLOR_BGR2GRAY))
    right_gray = clahe.apply(cv2.cvtColor(right_image, cv2.COLOR_BGR2GRAY))
    sift = cv2.SIFT_create(nfeatures=30_000, contrastThreshold=0.015, edgeThreshold=15)
    left_keypoints, left_descriptors = sift.detectAndCompute(left_gray, None)
    right_keypoints, right_descriptors = sift.detectAndCompute(right_gray, None)
    if left_descriptors is None or right_descriptors is None:
        raise ValueError("Feature extraction produced no descriptors")
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    left_to_right = matcher.knnMatch(left_descriptors, right_descriptors, k=2)
    right_to_left = matcher.knnMatch(right_descriptors, left_descriptors, k=2)
    forward = {
        match.queryIdx: match
        for match, alternative in left_to_right
        if match.distance < args.ratio_threshold * alternative.distance
    }
    reverse = {
        match.queryIdx: match
        for match, alternative in right_to_left
        if match.distance < args.ratio_threshold * alternative.distance
    }
    mutual = [
        match
        for match in forward.values()
        if match.trainIdx in reverse and reverse[match.trainIdx].trainIdx == match.queryIdx
    ]
    if len(mutual) < 16:
        raise ValueError("Too few mutual feature matches")
    left_points = np.asarray([left_keypoints[match.queryIdx].pt for match in mutual])
    right_points = np.asarray([right_keypoints[match.trainIdx].pt for match in mutual])
    left_yaw = float(left_entry["config"]["rp"][1])
    right_yaw = float(right_entry["config"]["rp"][1])
    left_rays = panorama_rays(left_points, width, height, left_yaw)
    right_rays = panorama_rays(right_points, width, height, right_yaw)
    cross_products = np.cross(left_rays, right_rays)
    finite = np.all(np.isfinite(cross_products), axis=1)
    finite &= np.linalg.norm(cross_products, axis=1) > 1e-10
    if not np.all(finite):
        left_points = left_points[finite]
        right_points = right_points[finite]
        left_rays = left_rays[finite]
        right_rays = right_rays[finite]
        cross_products = cross_products[finite]
        mutual = [match for match, keep in zip(mutual, finite) if keep]
    holdout = deterministic_holdout(left_points)
    direction, train_inliers = robust_translation_direction(
        cross_products[~holdout],
        args.ransac_iterations,
        args.epipolar_threshold,
    )
    residuals = np.abs(np.sum(cross_products * direction, axis=1))
    all_inliers = residuals <= args.epipolar_threshold

    left_position = np.asarray(left_entry["config"]["p"], dtype=float)
    right_position = np.asarray(right_entry["config"]["p"], dtype=float)
    provider_baseline = float(np.linalg.norm(right_position - left_position))
    positive_translation = direction * provider_baseline
    negative_translation = -positive_translation
    positive_depths = triangulate(left_rays[all_inliers], right_rays[all_inliers], positive_translation)
    negative_depths = triangulate(left_rays[all_inliers], right_rays[all_inliers], negative_translation)
    positive_count = int(np.count_nonzero((positive_depths[0] > 0) & (positive_depths[1] > 0)))
    negative_count = int(np.count_nonzero((negative_depths[0] > 0) & (negative_depths[1] > 0)))
    translation = positive_translation if positive_count >= negative_count else negative_translation
    left_depth, right_depth, separation, points = triangulate(
        left_rays[all_inliers], right_rays[all_inliers], translation
    )
    positive = (left_depth > 0) & (right_depth > 0)

    inlier_indices = np.flatnonzero(all_inliers)
    ceiling = ((left_points[:, 1] + right_points[:, 1]) / 2.0) < height * 0.42
    horizon = (
        (((left_points[:, 1] + right_points[:, 1]) / 2.0) >= height * 0.42)
        & (((left_points[:, 1] + right_points[:, 1]) / 2.0) < height * 0.68)
    )
    ceiling_inliers = all_inliers & ceiling
    horizon_inliers = all_inliers & horizon
    seating_inliers = all_inliers & ~ceiling & ~horizon

    draw_matches = [mutual[index] for index in inlier_indices[:400]]
    diagnostic = cv2.drawMatches(
        left_image,
        left_keypoints,
        right_image,
        right_keypoints,
        draw_matches,
        None,
        flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS,
    )
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_png), diagnostic):
        raise ValueError("Could not write diagnostic match image")

    train_residual = residuals[~holdout]
    holdout_residual = residuals[holdout]
    holdout_inlier_percent = round(
        100.0 * np.count_nonzero(holdout_residual <= args.epipolar_threshold)
        / max(holdout_residual.size, 1),
        4,
    )
    inlier_ceiling = ceiling[inlier_indices]
    inlier_horizon = horizon[inlier_indices]
    inlier_seating = (~ceiling & ~horizon)[inlier_indices]
    ceiling_positive = positive & inlier_ceiling
    horizon_positive = positive & inlier_horizon
    seating_positive = positive & inlier_seating

    def region_triangulation(region_positive: np.ndarray) -> dict[str, Any]:
        return {
            "positivePointCount": int(np.count_nonzero(region_positive)),
            "leftDepthMetres": summary(left_depth[region_positive]),
            "closestRaySeparationMetres": summary(separation[region_positive]),
        }

    sparse_ceiling_points: list[dict[str, Any]] = []
    for triangulated_index in np.flatnonzero(ceiling_positive):
        match_index = int(inlier_indices[triangulated_index])
        left_pixel = left_points[match_index]
        right_pixel = right_points[match_index]
        image_x = int(np.clip(round(left_pixel[0]), 0, width - 1))
        image_y = int(np.clip(round(left_pixel[1]), 0, height - 1))
        color_bgr = left_image[image_y, image_x]
        sparse_ceiling_points.append({
            "leftPixel": [round(float(left_pixel[0]), 3), round(float(left_pixel[1]), 3)],
            "rightPixel": [round(float(right_pixel[0]), 3), round(float(right_pixel[1]), 3)],
            "panoramaFrameMetresRelativeToLeftCamera": [
                round(float(value), 6) for value in points[triangulated_index]
            ],
            "leftDepthMetres": round(float(left_depth[triangulated_index]), 6),
            "rightDepthMetres": round(float(right_depth[triangulated_index]), 6),
            "closestRaySeparationMetres": round(float(separation[triangulated_index]), 6),
            "leftPixelRgb": [int(color_bgr[2]), int(color_bgr[1]), int(color_bgr[0])],
            "highConfidenceLocalSurfacePoint": bool(
                left_depth[triangulated_index] <= 15.0
                and separation[triangulated_index] <= 0.02
            ),
        })
    sparse_green_horizon_points: list[dict[str, Any]] = []
    for triangulated_index in np.flatnonzero(horizon_positive):
        match_index = int(inlier_indices[triangulated_index])
        left_pixel = left_points[match_index]
        right_pixel = right_points[match_index]
        image_x = int(np.clip(round(left_pixel[0]), 0, width - 1))
        image_y = int(np.clip(round(left_pixel[1]), 0, height - 1))
        color_bgr = left_image[image_y, image_x]
        red, green, blue = int(color_bgr[2]), int(color_bgr[1]), int(color_bgr[0])
        green_candidate = bool(
            green >= 45
            and green > red * 1.15
            and green > blue * 1.10
        )
        high_confidence = bool(
            green_candidate
            and 5.0 <= left_depth[triangulated_index] <= 200.0
            and separation[triangulated_index] <= 0.05
        )
        if not high_confidence:
            continue
        sparse_green_horizon_points.append({
            "leftPixel": [round(float(left_pixel[0]), 3), round(float(left_pixel[1]), 3)],
            "rightPixel": [round(float(right_pixel[0]), 3), round(float(right_pixel[1]), 3)],
            "panoramaFrameMetresRelativeToLeftCamera": [
                round(float(value), 6) for value in points[triangulated_index]
            ],
            "leftDepthMetres": round(float(left_depth[triangulated_index]), 6),
            "rightDepthMetres": round(float(right_depth[triangulated_index]), 6),
            "closestRaySeparationMetres": round(float(separation[triangulated_index]), 6),
            "leftPixelRgb": [red, green, blue],
            "highConfidenceProviderLocalFieldCandidate": True,
        })

    parameters = {
        "maximumWidth": args.maximum_width,
        "ratioThreshold": args.ratio_threshold,
        "ransacIterations": args.ransac_iterations,
        "epipolarThreshold": args.epipolar_threshold,
        "holdoutRule": "sha256(holdout-v1:left-x:left-y) modulo 5 equals zero",
    }
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "provider-local-sparse-stereo-measurement",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "manifest": str(args.manifest),
            "manifestSha256": file_sha256(args.manifest),
            "leftSeatId": args.left_seat_id,
            "rightSeatId": args.right_seat_id,
            "leftImageSha256": file_sha256(left_path),
            "rightImageSha256": file_sha256(right_path),
            "sourceDimensions": [source_width, source_height],
            "analysisDimensions": [width, height],
            "providerLocalLeftPositionMetres": left_position.tolist(),
            "providerLocalRightPositionMetres": right_position.tolist(),
            "providerLocalBaselineMetres": round(provider_baseline, 9),
            "providerPanoramaYawDegrees": {
                "left": left_yaw,
                "right": right_yaw,
                "method": "config.rp[1] applied about panorama vertical axis",
            },
        },
        "parameters": parameters,
        "features": {
            "leftKeypointCount": len(left_keypoints),
            "rightKeypointCount": len(right_keypoints),
            "mutualRatioMatchCount": len(mutual),
            "trainingMatchCount": int(np.count_nonzero(~holdout)),
            "holdoutMatchCount": int(np.count_nonzero(holdout)),
        },
        "sharedFrameTranslationFit": {
            "panoramaFrameUnitDirection": [round(float(value), 9) for value in direction],
            "chosenTranslationVectorMetres": [round(float(value), 9) for value in translation],
            "trainingResidual": summary(train_residual),
            "holdoutResidual": summary(holdout_residual),
            "holdoutInlierPercent": holdout_inlier_percent,
            "allInlierCount": int(np.count_nonzero(all_inliers)),
            "allInlierPercent": round(100.0 * np.mean(all_inliers), 4),
        },
        "regionSupport": {
            "ceilingMutualMatchCount": int(np.count_nonzero(ceiling)),
            "ceilingInlierCount": int(np.count_nonzero(ceiling_inliers)),
            "horizonMutualMatchCount": int(np.count_nonzero(horizon)),
            "horizonInlierCount": int(np.count_nonzero(horizon_inliers)),
            "seatingMutualMatchCount": int(np.count_nonzero(~ceiling & ~horizon)),
            "seatingInlierCount": int(np.count_nonzero(seating_inliers)),
        },
        "triangulation": {
            "positiveDepthCount": int(np.count_nonzero(positive)),
            "positiveDepthPercentOfInliers": round(100.0 * np.mean(positive), 4),
            "leftDepthMetres": summary(left_depth[positive]),
            "rightDepthMetres": summary(right_depth[positive]),
            "closestRaySeparationMetres": summary(separation[positive]),
            "pointDistanceFromLeftCameraMetres": summary(
                np.linalg.norm(points[positive], axis=1)
            ),
            "byRegion": {
                "ceiling": region_triangulation(ceiling_positive),
                "horizon": region_triangulation(horizon_positive),
                "seating": region_triangulation(seating_positive),
            },
            "sparseCeilingPoints": sparse_ceiling_points,
            "sparseGreenHorizonPoints": sparse_green_horizon_points,
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
            "drawnInlierLimit": 400,
        },
        "assessment": {
            "sharedPanoramaFrameSupported": holdout_inlier_percent >= 70.0,
            "ceilingSparseStereoSupported": int(np.count_nonzero(ceiling_inliers)) >= 30,
            "providerLocalMetricOnly": True,
            "publicationEligible": False,
            "blockers": [
                "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
                "SPARSE_FEATURES_DO_NOT_FORM_SEMANTIC_ROOF_MESH",
                "CAMERA_MODEL_NOT_INDEPENDENTLY_CALIBRATED",
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
        "mutualMatches": len(mutual),
        "holdoutInlierPercent": holdout_inlier_percent,
        "ceilingInliers": int(np.count_nonzero(ceiling_inliers)),
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
