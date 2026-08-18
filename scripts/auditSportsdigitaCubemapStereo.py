#!/usr/bin/env python3
"""Audit club-linked cubemap faces for independently validated stereo geometry.

The script estimates an essential matrix from feature matches in training-only
spatial cells. It evaluates the fitted matrix on untouched spatial cells and
reports cheirality, parallax, image coverage, and planar-degeneracy diagnostics.

This is a fail-closed research audit. Passing it supports continued relative
camera-pose research only. It does not establish scale, venue registration,
row identity, surveyed accuracy, obstruction semantics, or publication status.
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


ANALYSIS_VERSION = "sportsdigita-cubemap-stereo-audit-v9"
HORIZONTAL_FACES = ("f", "r", "b", "l")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--sections", default="205,206,207,208,209")
    parser.add_argument("--left-faces", default="f")
    parser.add_argument("--right-faces", default="f")
    parser.add_argument("--face-pairing", choices=("all", "same-name"), default="all")
    parser.add_argument("--maximum-width", type=int, default=1536)
    parser.add_argument("--maximum-features", type=int, default=18000)
    parser.add_argument("--ratio-threshold", type=float, default=0.72)
    parser.add_argument("--spatial-cell-pixels", type=int, default=256)
    parser.add_argument("--holdout-fraction", type=float, default=0.20)
    parser.add_argument("--ransac-threshold-pixels", type=float, default=1.0)
    parser.add_argument("--evaluation-threshold-pixels", type=float, default=2.0)
    parser.add_argument("--minimum-mutual-matches", type=int, default=60)
    parser.add_argument("--minimum-training-matches", type=int, default=40)
    parser.add_argument("--minimum-holdout-matches", type=int, default=15)
    parser.add_argument("--minimum-training-inliers", type=int, default=30)
    parser.add_argument("--minimum-inlier-hull-fraction", type=float, default=0.03)
    parser.add_argument("--minimum-positive-depth-fraction", type=float, default=0.70)
    parser.add_argument("--minimum-parallax-degrees", type=float, default=0.25)
    parser.add_argument("--maximum-holdout-p95-pixels", type=float, default=2.0)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def numeric_summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = np.asarray(values, dtype=float)
    finite = finite[np.isfinite(finite)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 6),
        "median": None if finite.size == 0 else round(float(np.median(finite)), 6),
        "p95": None if finite.size == 0 else round(float(np.percentile(finite, 95)), 6),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 6),
    }


def hull_fraction(points: np.ndarray, width: int, height: int) -> float:
    if len(points) < 3:
        return 0.0
    hull = cv2.convexHull(np.asarray(points, dtype=np.float32).reshape(-1, 1, 2))
    return float(cv2.contourArea(hull)) / float(width * height)


def parse_csv(value: str) -> list[str]:
    return [part.strip() for part in value.split(",") if part.strip()]


def validate_face_list(values: list[str]) -> None:
    unsupported = sorted(set(values) - set(HORIZONTAL_FACES))
    if unsupported:
        raise ValueError(f"Only horizontal cubemap faces are supported: {unsupported}")


def spatial_holdout_mask(
    left_points: np.ndarray,
    right_points: np.ndarray,
    cell_pixels: int,
    target_fraction: float,
) -> tuple[np.ndarray, dict[str, Any]]:
    """Reserve whole joint spatial cells before geometric fitting."""
    groups: dict[tuple[int, int, int, int], list[int]] = {}
    for index, (left, right) in enumerate(zip(left_points, right_points)):
        key = (
            int(left[0] // cell_pixels),
            int(left[1] // cell_pixels),
            int(right[0] // cell_pixels),
            int(right[1] // cell_pixels),
        )
        groups.setdefault(key, []).append(index)
    selected: list[tuple[int, int, int, int]] = []
    groups_by_left_y: dict[int, list[tuple[int, int, int, int]]] = {}
    for key in groups:
        groups_by_left_y.setdefault(key[1], []).append(key)
    for left_y_cell in sorted(groups_by_left_y):
        band_keys = groups_by_left_y[left_y_cell]
        band_match_count = sum(len(groups[key]) for key in band_keys)
        if len(band_keys) < 2:
            continue
        target_count = max(1, int(math.ceil(band_match_count * target_fraction)))
        ranked = sorted(
            band_keys,
            key=lambda key: hashlib.sha256(
                f"spatial-holdout-v2-stratified-y:{key}".encode("utf-8")
            ).hexdigest(),
        )
        selected_count = 0
        for key in ranked:
            if selected_count >= target_count:
                break
            candidate_count = len(groups[key])
            if selected_count + candidate_count < band_match_count:
                selected.append(key)
                selected_count += candidate_count
    mask = np.zeros(len(left_points), dtype=bool)
    for key in selected:
        mask[groups[key]] = True
    return mask, {
        "groupCount": len(groups),
        "heldOutGroupCount": len(selected),
        "heldOutGroupKeys": [list(key) for key in selected],
        "stratification": "left-image-y-cell",
        "partitionSalt": "spatial-holdout-v2-stratified-y",
        "targetFraction": target_fraction,
        "actualFraction": round(float(np.mean(mask)) if len(mask) else 0.0, 6),
    }


def normalized_points(points: np.ndarray, camera_matrix: np.ndarray) -> np.ndarray:
    return cv2.undistortPoints(
        np.asarray(points, dtype=np.float64).reshape(-1, 1, 2),
        camera_matrix,
        None,
    ).reshape(-1, 2)


def sampson_residual_pixels(
    essential: np.ndarray,
    left_points: np.ndarray,
    right_points: np.ndarray,
    camera_matrix: np.ndarray,
) -> np.ndarray:
    if len(left_points) == 0:
        return np.empty(0, dtype=float)
    if (
        not np.all(np.isfinite(essential))
        or not np.all(np.isfinite(left_points))
        or not np.all(np.isfinite(right_points))
        or not np.all(np.isfinite(camera_matrix))
    ):
        raise ValueError("Epipolar residual inputs must be finite")
    left_normalized = normalized_points(left_points, camera_matrix)
    right_normalized = normalized_points(right_points, camera_matrix)
    left_h = np.column_stack([left_normalized, np.ones(len(left_normalized))])
    right_h = np.column_stack([right_normalized, np.ones(len(right_normalized))])
    essential_left = np.einsum("ij,nj->ni", essential, left_h)
    essential_transpose_right = np.einsum("ij,nj->ni", essential.T, right_h)
    if (
        not np.all(np.isfinite(essential_left))
        or not np.all(np.isfinite(essential_transpose_right))
    ):
        raise ValueError("Epipolar line computation returned non-finite values")
    numerator = np.sum(right_h * essential_left, axis=1) ** 2
    denominator = (
        essential_left[:, 0] ** 2
        + essential_left[:, 1] ** 2
        + essential_transpose_right[:, 0] ** 2
        + essential_transpose_right[:, 1] ** 2
    )
    residual_normalized = np.sqrt(numerator / np.maximum(denominator, 1e-18))
    focal_pixels = float((camera_matrix[0, 0] + camera_matrix[1, 1]) / 2.0)
    return residual_normalized * focal_pixels


def split_essential_candidates(essential: np.ndarray) -> list[np.ndarray]:
    matrix = np.asarray(essential, dtype=np.float64)
    if matrix.shape == (3, 3):
        return [matrix]
    if matrix.ndim == 2 and matrix.shape[1] == 3 and matrix.shape[0] % 3 == 0:
        return [matrix[index:index + 3] for index in range(0, matrix.shape[0], 3)]
    raise ValueError(f"Unexpected essential-matrix shape: {matrix.shape}")


def validated_essential_candidates(essential: np.ndarray) -> tuple[list[np.ndarray], int]:
    """Reject non-finite and numerically invalid solver candidates."""
    accepted: list[np.ndarray] = []
    rejected = 0
    for candidate in split_essential_candidates(essential):
        if not np.all(np.isfinite(candidate)):
            rejected += 1
            continue
        norm = float(np.linalg.norm(candidate))
        if norm <= 1e-12:
            rejected += 1
            continue
        normalized = candidate / norm
        singular_values = np.linalg.svd(normalized, compute_uv=False)
        if (
            not np.all(np.isfinite(singular_values))
            or singular_values[0] <= 1e-12
            or singular_values[1] / singular_values[0] < 0.50
            or singular_values[2] / singular_values[0] > 0.10
        ):
            rejected += 1
            continue
        accepted.append(normalized)
    return accepted, rejected


def recover_candidate_pose(
    essential: np.ndarray,
    left_points: np.ndarray,
    right_points: np.ndarray,
    camera_matrix: np.ndarray,
    evaluation_threshold: float,
) -> dict[str, Any]:
    clean_essential = np.asarray(essential, dtype=np.float64).copy()
    residuals = sampson_residual_pixels(
        clean_essential, left_points, right_points, camera_matrix
    )
    geometric_inliers = residuals <= evaluation_threshold
    pose_count, rotation, translation, pose_mask = cv2.recoverPose(
        clean_essential.copy(),
        np.asarray(left_points, dtype=np.float64),
        np.asarray(right_points, dtype=np.float64),
        camera_matrix,
        mask=(geometric_inliers.astype(np.uint8) * 255).reshape(-1, 1),
    )
    rotation = np.asarray(rotation, dtype=np.float64).copy()
    translation = np.asarray(translation, dtype=np.float64).copy()
    if not np.all(np.isfinite(rotation)) or not np.all(np.isfinite(translation)):
        raise ValueError("Pose recovery returned non-finite values")
    orthogonality_error = float(np.linalg.norm(rotation.T @ rotation - np.eye(3)))
    determinant = float(np.linalg.det(rotation))
    if orthogonality_error > 1e-5 or abs(determinant - 1.0) > 1e-5:
        raise ValueError("Pose recovery returned an invalid rotation")
    pose_inliers = geometric_inliers & pose_mask.ravel().astype(bool)
    left_normalized = normalized_points(left_points, camera_matrix)
    right_normalized = normalized_points(right_points, camera_matrix)
    left_rays = np.column_stack([left_normalized, np.ones(len(left_normalized))])
    right_rays_camera_two = np.column_stack([
        right_normalized,
        np.ones(len(right_normalized)),
    ])
    left_rays /= np.linalg.norm(left_rays, axis=1, keepdims=True)
    right_rays_camera_one = np.einsum(
        "ij,nj->ni", rotation.T, right_rays_camera_two
    )
    right_rays_camera_one /= np.linalg.norm(right_rays_camera_one, axis=1, keepdims=True)
    cosine = np.clip(
        np.sum(left_rays * right_rays_camera_one, axis=1), -1.0, 1.0
    )
    parallax = np.degrees(np.arccos(cosine))

    triangulated_h = cv2.triangulatePoints(
        np.column_stack([np.eye(3), np.zeros(3)]),
        np.column_stack([rotation, translation]),
        left_normalized.T,
        right_normalized.T,
    )
    finite = np.abs(triangulated_h[3]) > 1e-12
    points = np.full((len(left_points), 3), np.nan, dtype=float)
    points[finite] = (triangulated_h[:3, finite] / triangulated_h[3, finite]).T
    points_camera_two = (
        np.einsum("ij,nj->ni", rotation, points) + translation.ravel()
    )
    positive = finite & (points[:, 2] > 0) & (points_camera_two[:, 2] > 0)
    positive_inliers = pose_inliers & positive
    inlier_count = int(np.count_nonzero(geometric_inliers))
    positive_count = int(np.count_nonzero(positive_inliers))
    positive_fraction = positive_count / max(inlier_count, 1)
    rotation_angle = math.degrees(
        math.acos(np.clip((float(np.trace(rotation)) - 1.0) / 2.0, -1.0, 1.0))
    )
    return {
        "essential": clean_essential,
        "rotation": rotation,
        "translation": translation.ravel(),
        "residuals": residuals,
        "geometricInliers": geometric_inliers,
        "poseInliers": pose_inliers,
        "positiveInliers": positive_inliers,
        "parallaxDegrees": parallax,
        "poseRecoveredPointCount": int(pose_count),
        "positiveDepthCount": positive_count,
        "positiveDepthFraction": positive_fraction,
        "rotationAngleDegrees": rotation_angle,
    }


def evaluate_fixed_pose_geometry(
    rotation: np.ndarray,
    translation: np.ndarray,
    left_points: np.ndarray,
    right_points: np.ndarray,
    camera_matrix: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    """Evaluate cheirality and parallax without refitting the pose."""
    left_normalized = normalized_points(left_points, camera_matrix)
    right_normalized = normalized_points(right_points, camera_matrix)
    left_rays = np.column_stack([left_normalized, np.ones(len(left_normalized))])
    right_rays_camera_two = np.column_stack([
        right_normalized,
        np.ones(len(right_normalized)),
    ])
    left_rays /= np.linalg.norm(left_rays, axis=1, keepdims=True)
    right_rays_camera_one = np.einsum(
        "ij,nj->ni", rotation.T, right_rays_camera_two
    )
    right_rays_camera_one /= np.linalg.norm(right_rays_camera_one, axis=1, keepdims=True)
    cosine = np.clip(
        np.sum(left_rays * right_rays_camera_one, axis=1), -1.0, 1.0
    )
    parallax = np.degrees(np.arccos(cosine))
    triangulated_h = cv2.triangulatePoints(
        np.column_stack([np.eye(3), np.zeros(3)]),
        np.column_stack([rotation, translation.reshape(3, 1)]),
        left_normalized.T,
        right_normalized.T,
    )
    finite = np.abs(triangulated_h[3]) > 1e-12
    points = np.full((len(left_points), 3), np.nan, dtype=float)
    points[finite] = (triangulated_h[:3, finite] / triangulated_h[3, finite]).T
    points_camera_two = (
        np.einsum("ij,nj->ni", rotation, points) + translation.ravel()
    )
    positive = finite & (points[:, 2] > 0) & (points_camera_two[:, 2] > 0)
    return positive, parallax


def homography_diagnostic(
    train_left: np.ndarray,
    train_right: np.ndarray,
    holdout_left: np.ndarray,
    holdout_right: np.ndarray,
    threshold: float,
) -> dict[str, Any]:
    if len(train_left) < 4:
        return {"solved": False, "reason": "TOO_FEW_TRAINING_MATCHES"}
    homography, mask = cv2.findHomography(
        np.asarray(train_left, dtype=np.float64),
        np.asarray(train_right, dtype=np.float64),
        cv2.USAC_MAGSAC,
        threshold,
        maxIters=20000,
        confidence=0.999,
    )
    if homography is None or mask is None:
        return {"solved": False, "reason": "HOMOGRAPHY_NOT_SOLVED"}

    def errors(left: np.ndarray, right: np.ndarray) -> np.ndarray:
        if len(left) == 0:
            return np.empty(0, dtype=float)
        projected = cv2.perspectiveTransform(
            np.asarray(left, dtype=np.float64).reshape(-1, 1, 2), homography
        ).reshape(-1, 2)
        return np.linalg.norm(projected - right, axis=1)

    train_errors = errors(train_left, train_right)
    holdout_errors = errors(holdout_left, holdout_right)
    return {
        "solved": True,
        "matrixLeftToRight": homography.tolist(),
        "trainingRansacInlierCount": int(np.count_nonzero(mask)),
        "trainingReprojectionPixels": numeric_summary(train_errors),
        "holdoutReprojectionPixels": numeric_summary(holdout_errors),
        "holdoutWithinEvaluationThresholdPercent": round(
            100.0 * float(np.mean(holdout_errors <= threshold))
            if len(holdout_errors) else 0.0,
            6,
        ),
    }


def diagnostic_image(
    left_image: np.ndarray,
    right_image: np.ndarray,
    left_points: np.ndarray,
    right_points: np.ndarray,
    train_inliers: np.ndarray,
    holdout: np.ndarray,
    holdout_accepted: np.ndarray,
    output_path: Path,
) -> None:
    height = max(left_image.shape[0], right_image.shape[0])
    width = left_image.shape[1] + right_image.shape[1]
    canvas = np.zeros((height, width, 3), dtype=np.uint8)
    canvas[:left_image.shape[0], :left_image.shape[1]] = left_image
    canvas[:right_image.shape[0], left_image.shape[1]:] = right_image
    candidates = np.flatnonzero(train_inliers | holdout)
    if len(candidates) > 300:
        candidates = candidates[np.linspace(0, len(candidates) - 1, 300).astype(int)]
    for index in candidates:
        left = tuple(np.round(left_points[index]).astype(int))
        right = tuple(
            np.round(right_points[index] + np.array([left_image.shape[1], 0])).astype(int)
        )
        if holdout[index]:
            color = (255, 255, 0) if holdout_accepted[index] else (0, 0, 255)
        else:
            color = (0, 220, 0)
        cv2.circle(canvas, left, 3, color, -1, lineType=cv2.LINE_AA)
        cv2.circle(canvas, right, 3, color, -1, lineType=cv2.LINE_AA)
        cv2.line(canvas, left, right, color, 1, lineType=cv2.LINE_AA)
    legend = "green training inlier | cyan holdout <= threshold | red holdout > threshold"
    cv2.rectangle(canvas, (0, 0), (min(width, 930), 36), (0, 0, 0), -1)
    cv2.putText(
        canvas,
        legend,
        (10, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (255, 255, 255),
        1,
        cv2.LINE_AA,
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output_path), canvas, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError(f"Could not write diagnostic image: {output_path}")


def training_cell_diagnostics(
    left_points: np.ndarray,
    right_points: np.ndarray,
    training: np.ndarray,
    residuals: np.ndarray,
    geometric_inliers: np.ndarray,
    parallax_degrees: np.ndarray,
    positive_depth: np.ndarray,
    cell_pixels: int,
    minimum_parallax_degrees: float,
) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    cells: dict[tuple[int, int], list[int]] = {}
    for index in np.flatnonzero(training):
        key = (
            int(left_points[index, 0] // cell_pixels),
            int(left_points[index, 1] // cell_pixels),
        )
        cells.setdefault(key, []).append(int(index))
    for key in sorted(cells):
        indices = np.asarray(cells[key], dtype=int)
        inliers = geometric_inliers[indices]
        qualified = inliers & (
            parallax_degrees[indices] >= minimum_parallax_degrees
        )
        positive_qualified = qualified & positive_depth[indices]
        records.append({
            "leftCell": list(key),
            "trainingMatchCount": len(indices),
            "epipolarInlierCount": int(np.count_nonzero(inliers)),
            "epipolarResidualPixels": numeric_summary(residuals[indices]),
            "parallaxQualifiedCount": int(np.count_nonzero(qualified)),
            "positiveDepthAmongParallaxQualifiedCount": int(
                np.count_nonzero(positive_qualified)
            ),
            "positiveDepthAmongParallaxQualifiedFraction": round(
                float(np.count_nonzero(positive_qualified))
                / max(int(np.count_nonzero(qualified)), 1),
                6,
            ),
            "medianLeftPixel": [
                round(float(value), 3) for value in np.median(left_points[indices], axis=0)
            ],
            "medianRightPixel": [
                round(float(value), 3) for value in np.median(right_points[indices], axis=0)
            ],
        })
    return records


def main() -> None:
    arguments = parse_args()
    cv2.setNumThreads(1)
    cv2.setRNGSeed(0)
    if arguments.maximum_width <= 0:
        raise ValueError("maximum-width must be positive")
    if arguments.spatial_cell_pixels <= 0:
        raise ValueError("spatial-cell-pixels must be positive")
    if not 0.05 <= arguments.holdout_fraction <= 0.45:
        raise ValueError("holdout-fraction must be between 0.05 and 0.45")
    requested_sections = parse_csv(arguments.sections)
    left_faces = parse_csv(arguments.left_faces)
    right_faces = parse_csv(arguments.right_faces)
    validate_face_list(left_faces)
    validate_face_list(right_faces)

    manifest = json.loads(arguments.manifest.read_text(encoding="utf-8"))
    if manifest.get("artifactKind") != "club-linked-section-panorama-research-input":
        raise ValueError("Manifest is not a club-linked section panorama artifact")
    sections = {str(record["sectionId"]): record for record in manifest.get("sections", [])}
    missing_sections = [section for section in requested_sections if section not in sections]
    if missing_sections:
        raise ValueError(f"Requested sections are absent from the manifest: {missing_sections}")
    if len(requested_sections) < 2:
        raise ValueError("At least two sections are required")
    section_numbers = [int(section) for section in requested_sections]
    if section_numbers != list(range(section_numbers[0], section_numbers[0] + len(section_numbers))):
        raise ValueError("Requested sections must be consecutive and ordered")

    image_entries: dict[tuple[str, str], dict[str, Any]] = {}
    decoded: dict[tuple[str, str], np.ndarray] = {}
    features: dict[tuple[str, str], tuple[list[cv2.KeyPoint], np.ndarray]] = {}
    image_metadata: list[dict[str, Any]] = []
    required_faces = sorted(set(left_faces + right_faces))
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(16, 16))
    sift = cv2.SIFT_create(
        nfeatures=arguments.maximum_features,
        contrastThreshold=0.015,
        edgeThreshold=15,
    )
    for section in requested_sections:
        record = sections[section]
        by_face = {entry["face"]: entry for entry in record.get("images", [])}
        for face in required_faces:
            if face not in by_face:
                raise ValueError(f"Section {section} is missing face {face}")
            entry = by_face[face]
            path = Path(entry["localPath"])
            actual_sha256 = sha256_file(path)
            if actual_sha256 != entry["sha256"]:
                raise ValueError(f"Checksum mismatch for {path}")
            source = cv2.imread(str(path), cv2.IMREAD_COLOR)
            if source is None:
                raise ValueError(f"Could not decode {path}")
            source_height, source_width = source.shape[:2]
            if source_width != source_height:
                raise ValueError(f"Cubemap face is not square: {path}")
            scale = min(1.0, arguments.maximum_width / source_width)
            output_size = int(round(source_width * scale))
            image = cv2.resize(
                source,
                (output_size, output_size),
                interpolation=cv2.INTER_AREA if scale < 1.0 else cv2.INTER_LINEAR,
            )
            gray = clahe.apply(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY))
            keypoints, descriptors = sift.detectAndCompute(gray, None)
            if descriptors is None or len(keypoints) < arguments.minimum_mutual_matches:
                raise ValueError(f"Too few features in section {section} face {face}")
            key = (section, face)
            image_entries[key] = entry
            decoded[key] = image
            features[key] = (keypoints, descriptors)
            image_metadata.append({
                "sectionId": section,
                "panoramaId": record["panoramaId"],
                "face": face,
                "path": str(path.resolve()),
                "sha256": actual_sha256,
                "sourceWidth": source_width,
                "sourceHeight": source_height,
                "analysisWidth": output_size,
                "analysisHeight": output_size,
                "detectedFeatureCount": len(keypoints),
            })

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    pair_records: list[dict[str, Any]] = []
    selected_records: list[dict[str, Any]] = []
    for left_section, right_section in zip(requested_sections[:-1], requested_sections[1:]):
        pair_candidates: list[dict[str, Any]] = []
        for left_face in left_faces:
            for right_face in right_faces:
                if arguments.face_pairing == "same-name" and left_face != right_face:
                    continue
                left_key = (left_section, left_face)
                right_key = (right_section, right_face)
                left_image = decoded[left_key]
                right_image = decoded[right_key]
                left_keypoints, left_descriptors = features[left_key]
                right_keypoints, right_descriptors = features[right_key]
                left_to_right = matcher.knnMatch(left_descriptors, right_descriptors, k=2)
                right_to_left = matcher.knnMatch(right_descriptors, left_descriptors, k=2)
                forward = {
                    match.queryIdx: match
                    for match, alternative in left_to_right
                    if match.distance < arguments.ratio_threshold * alternative.distance
                }
                reverse = {
                    match.queryIdx: match
                    for match, alternative in right_to_left
                    if match.distance < arguments.ratio_threshold * alternative.distance
                }
                mutual = [
                    match for match in forward.values()
                    if match.trainIdx in reverse
                    and reverse[match.trainIdx].trainIdx == match.queryIdx
                ]
                mutual.sort(key=lambda match: (match.queryIdx, match.trainIdx))
                base_record: dict[str, Any] = {
                    "leftSectionId": left_section,
                    "rightSectionId": right_section,
                    "leftFace": left_face,
                    "rightFace": right_face,
                    "mutualRatioMatchCount": len(mutual),
                    "fitSolved": False,
                    "acceptedIndependentEpipolarHoldout": False,
                }
                if len(mutual) < arguments.minimum_mutual_matches:
                    base_record["failureReason"] = "TOO_FEW_MUTUAL_MATCHES"
                    pair_records.append(base_record)
                    pair_candidates.append(base_record)
                    continue
                left_points = np.asarray(
                    [left_keypoints[match.queryIdx].pt for match in mutual], dtype=np.float64
                )
                right_points = np.asarray(
                    [right_keypoints[match.trainIdx].pt for match in mutual], dtype=np.float64
                )
                holdout, holdout_metadata = spatial_holdout_mask(
                    left_points,
                    right_points,
                    arguments.spatial_cell_pixels,
                    arguments.holdout_fraction,
                )
                train = ~holdout
                base_record["spatialPartition"] = holdout_metadata
                base_record["trainingMatchCount"] = int(np.count_nonzero(train))
                base_record["holdoutMatchCount"] = int(np.count_nonzero(holdout))
                if (
                    np.count_nonzero(train) < arguments.minimum_training_matches
                    or np.count_nonzero(holdout) < arguments.minimum_holdout_matches
                ):
                    base_record["failureReason"] = "INSUFFICIENT_SPATIAL_PARTITION"
                    pair_records.append(base_record)
                    pair_candidates.append(base_record)
                    continue
                width = left_image.shape[1]
                if right_image.shape[1] != width:
                    raise ValueError("Analysis cubemap faces have different dimensions")
                focal = width / 2.0
                center = (width - 1.0) / 2.0
                camera_matrix = np.asarray([
                    [focal, 0.0, center],
                    [0.0, focal, center],
                    [0.0, 0.0, 1.0],
                ])
                try:
                    essential, _ = cv2.findEssentialMat(
                        left_points[train],
                        right_points[train],
                        camera_matrix,
                        method=cv2.USAC_MAGSAC,
                        prob=0.999,
                        threshold=arguments.ransac_threshold_pixels,
                        maxIters=20000,
                    )
                except cv2.error as error:
                    base_record["failureReason"] = "ESSENTIAL_MATRIX_EXCEPTION"
                    base_record["error"] = str(error)
                    pair_records.append(base_record)
                    pair_candidates.append(base_record)
                    continue
                if essential is None:
                    base_record["failureReason"] = "ESSENTIAL_MATRIX_NOT_SOLVED"
                    pair_records.append(base_record)
                    pair_candidates.append(base_record)
                    continue
                essential_candidates, rejected_candidate_count = validated_essential_candidates(
                    essential
                )
                base_record["essentialCandidateCount"] = (
                    len(essential_candidates) + rejected_candidate_count
                )
                base_record["rejectedEssentialCandidateCount"] = rejected_candidate_count
                if not essential_candidates:
                    base_record["failureReason"] = "NO_NUMERICALLY_VALID_ESSENTIAL_CANDIDATE"
                    pair_records.append(base_record)
                    pair_candidates.append(base_record)
                    continue
                candidate_poses = []
                pose_recovery_error_count = 0
                for candidate in essential_candidates:
                    try:
                        pose = recover_candidate_pose(
                            candidate,
                            left_points[train],
                            right_points[train],
                            camera_matrix,
                            arguments.evaluation_threshold_pixels,
                        )
                    except (ValueError, FloatingPointError, cv2.error):
                        pose_recovery_error_count += 1
                        continue
                    candidate_poses.append(pose)
                base_record["poseRecoveryErrorCount"] = pose_recovery_error_count
                if not candidate_poses:
                    base_record["failureReason"] = "NO_VALID_RELATIVE_POSE_CANDIDATE"
                    pair_records.append(base_record)
                    pair_candidates.append(base_record)
                    continue
                candidate_poses.sort(
                    key=lambda candidate: (
                        int(np.count_nonzero(candidate["positiveInliers"])),
                        int(np.count_nonzero(candidate["geometricInliers"])),
                        -float(np.median(candidate["residuals"])),
                    ),
                    reverse=True,
                )
                pose = candidate_poses[0]
                all_residuals = sampson_residual_pixels(
                    pose["essential"], left_points, right_points, camera_matrix
                )
                all_epipolar_inliers = (
                    all_residuals <= arguments.evaluation_threshold_pixels
                )
                all_positive_depth, all_parallax = evaluate_fixed_pose_geometry(
                    pose["rotation"],
                    pose["translation"],
                    left_points,
                    right_points,
                    camera_matrix,
                )
                train_inliers = train & all_epipolar_inliers
                holdout_accepted = holdout & all_epipolar_inliers
                training_positive_depth = np.zeros(len(mutual), dtype=bool)
                training_positive_depth[train] = pose["positiveInliers"]
                training_parallax = np.full(len(mutual), np.nan, dtype=float)
                training_parallax[train] = pose["parallaxDegrees"]
                holdout_residuals = all_residuals[holdout]
                train_residuals = all_residuals[train]
                holdout_p95 = float(np.percentile(holdout_residuals, 95))
                left_hull = hull_fraction(left_points[train_inliers], width, width)
                right_hull = hull_fraction(right_points[train_inliers], width, width)
                positive_depth_fraction = float(pose["positiveDepthFraction"])
                parallax_qualified = (
                    pose["geometricInliers"]
                    & (pose["parallaxDegrees"] >= arguments.minimum_parallax_degrees)
                )
                positive_parallax_qualified = (
                    pose["positiveInliers"] & parallax_qualified
                )
                positive_depth_among_parallax_qualified_fraction = (
                    float(np.count_nonzero(positive_parallax_qualified))
                    / max(int(np.count_nonzero(parallax_qualified)), 1)
                )
                parallax_inliers = pose["parallaxDegrees"][pose["positiveInliers"]]
                median_parallax = (
                    0.0 if len(parallax_inliers) == 0 else float(np.median(parallax_inliers))
                )
                near_field = left_points[:, 1] >= width * 0.75
                near_field_training = near_field & train
                near_field_holdout = near_field & holdout
                near_field_training_qualified = (
                    near_field_training
                    & all_epipolar_inliers
                    & (all_parallax >= arguments.minimum_parallax_degrees)
                )
                near_field_holdout_qualified = (
                    near_field_holdout
                    & all_epipolar_inliers
                    & (all_parallax >= arguments.minimum_parallax_degrees)
                )
                near_field_training_positive = (
                    near_field_training_qualified & all_positive_depth
                )
                near_field_holdout_positive = (
                    near_field_holdout_qualified & all_positive_depth
                )
                near_field_training_positive_fraction = (
                    float(np.count_nonzero(near_field_training_positive))
                    / max(int(np.count_nonzero(near_field_training_qualified)), 1)
                )
                near_field_holdout_positive_fraction = (
                    float(np.count_nonzero(near_field_holdout_positive))
                    / max(int(np.count_nonzero(near_field_holdout_qualified)), 1)
                )
                accepted_near_field = bool(
                    np.count_nonzero(near_field_training_qualified)
                    >= arguments.minimum_training_inliers
                    and np.count_nonzero(near_field_holdout_qualified)
                    >= arguments.minimum_holdout_matches
                    and near_field_training_positive_fraction
                    >= arguments.minimum_positive_depth_fraction
                    and near_field_holdout_positive_fraction
                    >= arguments.minimum_positive_depth_fraction
                )
                homography = homography_diagnostic(
                    left_points[train],
                    right_points[train],
                    left_points[holdout],
                    right_points[holdout],
                    arguments.evaluation_threshold_pixels,
                )
                holdout_essential_percent = round(
                    100.0 * float(np.mean(holdout_residuals <= arguments.evaluation_threshold_pixels)),
                    6,
                )
                homography_percent = (
                    float(homography.get("holdoutWithinEvaluationThresholdPercent", 0.0))
                    if homography.get("solved") else 0.0
                )
                planar_warning = bool(
                    homography.get("solved")
                    and homography_percent >= 90.0
                    and homography_percent >= holdout_essential_percent - 5.0
                )
                accepted = bool(
                    len(mutual) >= arguments.minimum_mutual_matches
                    and np.count_nonzero(train) >= arguments.minimum_training_matches
                    and np.count_nonzero(holdout) >= arguments.minimum_holdout_matches
                    and np.count_nonzero(train_inliers) >= arguments.minimum_training_inliers
                    and min(left_hull, right_hull) >= arguments.minimum_inlier_hull_fraction
                    and np.count_nonzero(parallax_qualified)
                    >= arguments.minimum_training_inliers
                    and positive_depth_among_parallax_qualified_fraction
                    >= arguments.minimum_positive_depth_fraction
                    and median_parallax >= arguments.minimum_parallax_degrees
                    and holdout_p95 <= arguments.maximum_holdout_p95_pixels
                )
                diagnostic_path = arguments.output_directory / (
                    f"sections-{left_section}-{right_section}-{left_face}-{right_face}.png"
                )
                diagnostic_image(
                    left_image,
                    right_image,
                    left_points,
                    right_points,
                    train_inliers,
                    holdout,
                    holdout_accepted,
                    diagnostic_path,
                )
                record = {
                    **base_record,
                    "fitSolved": True,
                    "cameraModel": {
                        "projection": "cubemap-perspective-face",
                        "nominalHorizontalFieldOfViewDegrees": 90.0,
                        "focalPixels": focal,
                        "principalPointPixels": [center, center],
                        "lensDistortion": "none-after-cubemap-resampling",
                    },
                    "essentialMatrix": pose["essential"].tolist(),
                    "rotationCameraOneToCameraTwo": pose["rotation"].tolist(),
                    "translationDirectionInCameraTwoFrame": pose["translation"].tolist(),
                    "rotationAngleDegrees": round(float(pose["rotationAngleDegrees"]), 6),
                    "trainingEpipolarInlierCount": int(np.count_nonzero(train_inliers)),
                    "trainingEpipolarResidualPixels": numeric_summary(train_residuals),
                    "holdoutEpipolarResidualPixels": numeric_summary(holdout_residuals),
                    "holdoutWithinEvaluationThresholdPercent": holdout_essential_percent,
                    "trainingInlierLeftHullFraction": round(left_hull, 6),
                    "trainingInlierRightHullFraction": round(right_hull, 6),
                    "positiveDepthFraction": round(positive_depth_fraction, 6),
                    "parallaxQualifiedTrainingInlierCount": int(
                        np.count_nonzero(parallax_qualified)
                    ),
                    "positiveDepthAmongParallaxQualifiedCount": int(
                        np.count_nonzero(positive_parallax_qualified)
                    ),
                    "positiveDepthAmongParallaxQualifiedFraction": round(
                        positive_depth_among_parallax_qualified_fraction, 6
                    ),
                    "positiveDepthParallaxDegrees": numeric_summary(parallax_inliers),
                    "poseRecoveredPointCount": int(pose["poseRecoveredPointCount"]),
                    "nearFieldDefinition": {
                        "kind": "bottom-image-quarter",
                        "minimumLeftImageYFraction": 0.75,
                        "purpose": "isolate close seating and tread surfaces from the distant stadium",
                    },
                    "nearFieldTrainingMatchCount": int(
                        np.count_nonzero(near_field_training)
                    ),
                    "nearFieldHoldoutMatchCount": int(
                        np.count_nonzero(near_field_holdout)
                    ),
                    "nearFieldTrainingParallaxQualifiedInlierCount": int(
                        np.count_nonzero(near_field_training_qualified)
                    ),
                    "nearFieldHoldoutParallaxQualifiedInlierCount": int(
                        np.count_nonzero(near_field_holdout_qualified)
                    ),
                    "nearFieldTrainingPositiveDepthFraction": round(
                        near_field_training_positive_fraction, 6
                    ),
                    "nearFieldHoldoutPositiveDepthFraction": round(
                        near_field_holdout_positive_fraction, 6
                    ),
                    "acceptedIndependentNearFieldCheirality": accepted_near_field,
                    "trainingCellDiagnostics": training_cell_diagnostics(
                        left_points,
                        right_points,
                        train,
                        all_residuals,
                        all_epipolar_inliers,
                        training_parallax,
                        training_positive_depth,
                        arguments.spatial_cell_pixels,
                        arguments.minimum_parallax_degrees,
                    ),
                    "homographyDiagnostic": homography,
                    "planarDegeneracyWarning": planar_warning,
                    "acceptedIndependentEpipolarHoldout": accepted,
                    "diagnosticPath": str(diagnostic_path.resolve()),
                    "diagnosticSha256": sha256_file(diagnostic_path),
                }
                pair_records.append(record)
                pair_candidates.append(record)
        pair_candidates.sort(
            key=lambda record: (
                bool(record.get("acceptedIndependentEpipolarHoldout")),
                -float(record.get("holdoutEpipolarResidualPixels", {}).get("p95") or math.inf),
                int(record.get("trainingEpipolarInlierCount", 0)),
            ),
            reverse=True,
        )
        selected_records.append(pair_candidates[0])

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "sourceManifest": {
            "path": str(arguments.manifest.resolve()),
            "sha256": sha256_file(arguments.manifest),
            "artifactVersion": manifest["artifactVersion"],
            "sourceMapSha256": manifest["map"]["sha256"],
        },
        "images": sorted(
            image_metadata,
            key=lambda record: (int(record["sectionId"]), record["face"]),
        ),
        "parameters": {
            "sections": requested_sections,
            "leftFaces": left_faces,
            "rightFaces": right_faces,
            "facePairing": arguments.face_pairing,
            "maximumWidth": arguments.maximum_width,
            "maximumFeatures": arguments.maximum_features,
            "ratioThreshold": arguments.ratio_threshold,
            "spatialCellPixels": arguments.spatial_cell_pixels,
            "holdoutFraction": arguments.holdout_fraction,
            "ransacThresholdPixels": arguments.ransac_threshold_pixels,
            "evaluationThresholdPixels": arguments.evaluation_threshold_pixels,
            "minimumMutualMatches": arguments.minimum_mutual_matches,
            "minimumTrainingMatches": arguments.minimum_training_matches,
            "minimumHoldoutMatches": arguments.minimum_holdout_matches,
            "minimumTrainingInliers": arguments.minimum_training_inliers,
            "minimumInlierHullFraction": arguments.minimum_inlier_hull_fraction,
            "minimumPositiveDepthFraction": arguments.minimum_positive_depth_fraction,
            "minimumParallaxDegrees": arguments.minimum_parallax_degrees,
            "maximumHoldoutP95Pixels": arguments.maximum_holdout_p95_pixels,
        },
        "pairCandidates": pair_records,
        "selectedAdjacentPairResults": selected_records,
    }
    accepted_count = sum(
        bool(record.get("acceptedIndependentEpipolarHoldout"))
        for record in selected_records
    )
    near_field_accepted_count = sum(
        bool(record.get("acceptedIndependentNearFieldCheirality"))
        for record in selected_records
    )
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "club-linked-cubemap-stereo-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
        "summary": {
            "adjacentPairCount": len(selected_records),
            "adjacentPairAcceptedCount": accepted_count,
            "allAdjacentPairsAccepted": accepted_count == len(selected_records),
            "adjacentPairNearFieldAcceptedCount": near_field_accepted_count,
            "allAdjacentPairNearFieldsAccepted": (
                near_field_accepted_count == len(selected_records)
            ),
            "selectedPairPlanarDegeneracyWarningCount": sum(
                bool(record.get("planarDegeneracyWarning"))
                for record in selected_records
            ),
        },
        "conclusion": {
            "relativePoseResearchSupported": accepted_count == len(selected_records),
            "nearFieldMetricReconstructionSupported": (
                near_field_accepted_count == len(selected_records)
            ),
            "metricGeometrySupported": False,
            "note": (
                "The stratified independent epipolar holdout and bottom-quarter near-field "
                "cheirality tests did not pass across all adjacent pairs. These stitched "
                "cubemap faces must not be used as local metric stereo. Metric use also "
                "requires scale, current venue registration, exact row identity, non-planar "
                "control, and independent metric holdouts."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "RELATIVE_CAMERA_POSE_IS_NOT_METRIC_GEOMETRY",
                "CAMERA_BASELINE_SCALE_NOT_ESTABLISHED",
                "CURRENT_VENUE_REGISTRATION_NOT_ESTABLISHED",
                "EXACT_ROW_IDENTITY_NOT_ESTABLISHED",
                "PLANAR_SCENE_DEGENERACY_MUST_BE_RESOLVED_FOR_DEPTH_USE",
                "NEAR_FIELD_CUBEMAP_STITCHING_CHEIRALITY_NOT_PASSED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    output_path = arguments.output_directory / "manifest.json"
    output_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(output_path.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "summary": artifact["summary"],
        "selectedAdjacentPairResults": [
            {
                "sections": [record["leftSectionId"], record["rightSectionId"]],
                "faces": [record["leftFace"], record["rightFace"]],
                "mutualMatches": record["mutualRatioMatchCount"],
                "trainingInliers": record.get("trainingEpipolarInlierCount"),
                "holdoutP95Pixels": record.get("holdoutEpipolarResidualPixels", {}).get("p95"),
                "accepted": record.get("acceptedIndependentEpipolarHoldout", False),
                "nearFieldHoldoutQualified": record.get(
                    "nearFieldHoldoutParallaxQualifiedInlierCount"
                ),
                "nearFieldHoldoutPositiveDepthFraction": record.get(
                    "nearFieldHoldoutPositiveDepthFraction"
                ),
                "nearFieldAccepted": record.get(
                    "acceptedIndependentNearFieldCheirality", False
                ),
                "planarDegeneracyWarning": record.get("planarDegeneracyWarning"),
                "failureReason": record.get("failureReason"),
            }
            for record in selected_records
        ],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
