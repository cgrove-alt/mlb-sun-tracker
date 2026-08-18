#!/usr/bin/env python3
"""Reconstruct dense provider-local points from an accepted known-pose pair."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from reconstructPanoramaDenseOverhang import (
    bilinear_scalar,
    bilinear_vector,
    panorama_rays,
    triangulate,
    values_summary,
)


ANALYSIS_VERSION = "dense-known-pose-panorama-scene-v1"


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def deterministic_holdout(pixels: np.ndarray) -> np.ndarray:
    return np.asarray([
        int.from_bytes(
            hashlib.sha256(
                f"dense-known-pose-holdout-v1:{pixel[0]:.3f}:{pixel[1]:.3f}".encode("utf-8")
            ).digest()[:4],
            "big",
        ) % 5 == 0
        for pixel in pixels
    ], dtype=bool)


def render_plan(path: Path, points: np.ndarray, separation: np.ndarray) -> None:
    width, height, padding = 1600, 1000, 55
    image = np.full((height, width, 3), 245, dtype=np.uint8)
    if points.shape[0] == 0:
        cv2.putText(image, "No bounded dense points", (45, 85), cv2.FONT_HERSHEY_SIMPLEX, 1.4, (20, 20, 20), 3)
    else:
        minimum = np.min(points[:, [0, 2]], axis=0)
        maximum = np.max(points[:, [0, 2]], axis=0)
        scale = np.asarray([
            (width - 2 * padding) / max(maximum[0] - minimum[0], 1e-9),
            (height - 2 * padding) / max(maximum[1] - minimum[1], 1e-9),
        ])
        upper = max(float(np.percentile(separation, 95)), 1e-9)
        for point, error in zip(points, separation):
            x = int(round(padding + (point[0] - minimum[0]) * scale[0]))
            y = int(round(height - padding - (point[2] - minimum[1]) * scale[1]))
            normalized = min(max(float(error / upper), 0.0), 1.0)
            color = (round(240 * normalized), round(185 * (1.0 - normalized)), 35)
            cv2.circle(image, (x, y), 1, color, -1)
        cv2.putText(
            image,
            "provider x-z plan, blue lower ray separation and red higher",
            (35, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (20, 20, 20),
            2,
            cv2.LINE_AA,
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(path), image):
        raise ValueError(f"Could not write {path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("known_pose_scene", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--provider-x-minimum", type=float, required=True)
    parser.add_argument("--provider-x-maximum", type=float, required=True)
    parser.add_argument("--provider-y-minimum", type=float, required=True)
    parser.add_argument("--provider-y-maximum", type=float, required=True)
    parser.add_argument("--provider-z-minimum", type=float, required=True)
    parser.add_argument("--provider-z-maximum", type=float, required=True)
    parser.add_argument("--maximum-width", type=int, default=2048)
    parser.add_argument("--grid-stride", type=int, default=2)
    parser.add_argument("--forward-backward-threshold-pixels", type=float, default=1.0)
    parser.add_argument("--sparse-validation-p95-pixels", type=float, default=2.0)
    parser.add_argument("--epipolar-threshold", type=float, default=0.002)
    parser.add_argument("--maximum-ray-separation-metres", type=float, default=0.03)
    parser.add_argument("--maximum-depth-metres", type=float, default=50.0)
    parser.add_argument("--minimum-gradient", type=float, default=12.0)
    parser.add_argument("--maximum-photometric-error", type=float, default=35.0)
    parser.add_argument("--minimum-bounded-points", type=int, default=1000)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    scene = json.loads(args.known_pose_scene.read_text())
    calibration = json.loads(args.calibration.read_text())
    if not scene.get("knownPoseValidation", {}).get("passed"):
        raise ValueError("Sparse known-pose scene did not pass validation")
    if not scene.get("assessment", {}).get("knownPoseProviderMetricMeasurementEligible"):
        raise ValueError("Sparse known-pose scene is not measurement eligible")
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Panorama calibration is not measurement eligible")
    manifest_path = Path(scene["inputs"]["manifest"]["path"])
    if file_sha256(manifest_path) != scene["inputs"]["manifest"]["sha256"]:
        raise ValueError("Manifest checksum does not match the sparse scene")
    manifest = json.loads(manifest_path.read_text())
    images = {entry["seatId"]: entry for entry in manifest["images"]}
    left_id = scene["cameraPair"]["leftSeatId"]
    right_id = scene["cameraPair"]["rightSeatId"]
    left_entry = images[left_id]
    right_entry = images[right_id]
    left_path = Path(left_entry["localPath"])
    right_path = Path(right_entry["localPath"])
    for path, entry in ((left_path, left_entry), (right_path, right_entry)):
        if file_sha256(path) != entry["imageSha256"]:
            raise ValueError(f"Panorama checksum mismatch for {path}")
    sparse_npz_path = Path(scene["geometry"]["npzPath"])
    if file_sha256(sparse_npz_path) != scene["geometry"]["npzSha256"]:
        raise ValueError("Sparse point artifact checksum mismatch")

    left_source = cv2.imread(str(left_path), cv2.IMREAD_GRAYSCALE)
    right_source = cv2.imread(str(right_path), cv2.IMREAD_GRAYSCALE)
    if left_source is None or right_source is None or left_source.shape != right_source.shape:
        raise ValueError("Could not load matching panorama images")
    source_height, source_width = left_source.shape
    scale = min(1.0, args.maximum_width / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    left = cv2.resize(left_source, (width, height), interpolation=cv2.INTER_AREA)
    right = cv2.resize(right_source, (width, height), interpolation=cv2.INTER_AREA)
    sparse_width = min(source_width, int(scene["parameters"]["maximumWidth"]))
    sparse_to_dense = width / sparse_width
    with np.load(sparse_npz_path) as payload:
        sparse_left = np.asarray(payload["left_pixels"], dtype=float) * sparse_to_dense
        sparse_right = np.asarray(payload["right_pixels"], dtype=float) * sparse_to_dense
    sparse_displacement = sparse_right - sparse_left
    sparse_displacement[:, 0] = (
        (sparse_displacement[:, 0] + width / 2.0) % width - width / 2.0
    )
    coarse_shift = np.median(sparse_displacement, axis=0)

    coordinate_x, coordinate_y = np.meshgrid(
        np.arange(width, dtype=np.float32),
        np.arange(height, dtype=np.float32),
    )

    def shifted(image: np.ndarray, displacement: np.ndarray) -> np.ndarray:
        return cv2.remap(
            image,
            coordinate_x + np.float32(displacement[0]),
            coordinate_y + np.float32(displacement[1]),
            cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_WRAP,
        )

    left_equalized = cv2.createCLAHE(2.5, (16, 8)).apply(left)
    right_equalized = cv2.createCLAHE(2.5, (16, 8)).apply(right)
    right_coarsely_aligned = shifted(right_equalized, coarse_shift)
    left_coarsely_aligned = shifted(left_equalized, -coarse_shift)
    flow_estimator = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    flow_estimator.setUseSpatialPropagation(True)
    forward = flow_estimator.calc(left_equalized, right_coarsely_aligned, None)
    forward += coarse_shift.astype(np.float32)
    backward_estimator = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    backward_estimator.setUseSpatialPropagation(True)
    backward = backward_estimator.calc(right_equalized, left_coarsely_aligned, None)
    backward -= coarse_shift.astype(np.float32)

    sparse_flow = bilinear_vector(forward, sparse_left)
    sparse_prediction = sparse_left + sparse_flow
    sparse_errors = np.linalg.norm(sparse_prediction - sparse_right, axis=1)
    sparse_validation_pass = bool(
        sparse_errors.size >= 500
        and float(np.percentile(sparse_errors, 95)) <= args.sparse_validation_p95_pixels
    )

    rows = np.arange(1, int(height * 0.60), args.grid_stride)
    columns = np.arange(int(width * 0.02), int(width * 0.98), args.grid_stride)
    grid_x, grid_y = np.meshgrid(columns, rows)
    left_points = np.column_stack([grid_x.ravel(), grid_y.ravel()]).astype(float)
    flow_values = forward[grid_y.ravel(), grid_x.ravel()].astype(float)
    right_points = left_points + flow_values
    inside = (
        np.all(np.isfinite(right_points), axis=1)
        & (right_points[:, 0] >= 1)
        & (right_points[:, 0] < width - 2)
        & (right_points[:, 1] >= 1)
        & (right_points[:, 1] < height - 2)
    )
    sampled_backward = bilinear_vector(backward, right_points)
    forward_backward_error = np.linalg.norm(flow_values + sampled_backward, axis=1)
    right_values = bilinear_scalar(right.astype(np.float32), right_points)
    left_values = left[grid_y.ravel(), grid_x.ravel()].astype(float)
    photometric_error = np.abs(left_values - right_values)
    gradient = np.hypot(
        cv2.Sobel(left.astype(np.float32), cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(left.astype(np.float32), cv2.CV_32F, 0, 1, ksize=3),
    )
    gradient_values = gradient[grid_y.ravel(), grid_x.ravel()]
    correspondence = (
        inside
        & np.isfinite(forward_backward_error)
        & (forward_backward_error <= args.forward_backward_threshold_pixels)
        & np.isfinite(photometric_error)
        & (photometric_error <= args.maximum_photometric_error)
        & (gradient_values >= args.minimum_gradient)
    )

    left_rays = panorama_rays(
        left_points[correspondence],
        width,
        height,
        float(left_entry["config"]["rp"][1]),
    )
    right_rays = panorama_rays(
        right_points[correspondence],
        width,
        height,
        float(right_entry["config"]["rp"][1]),
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
    translation_unit = translation / np.linalg.norm(translation)
    epipolar = np.abs(np.sum(np.cross(left_rays, right_rays) * translation_unit, axis=1))
    left_depth, right_depth, separation, panorama_points = triangulate(
        left_rays,
        right_rays,
        translation,
    )
    geometry = (
        np.isfinite(left_depth)
        & np.isfinite(right_depth)
        & np.all(np.isfinite(panorama_points), axis=1)
        & (left_depth > 0)
        & (right_depth > 0)
        & (left_depth <= args.maximum_depth_metres)
        & (right_depth <= args.maximum_depth_metres)
        & (separation <= args.maximum_ray_separation_metres)
        & (epipolar <= args.epipolar_threshold)
    )
    provider_points = left_position + (
        panorama_to_provider @ panorama_points[geometry].T
    ).T
    accepted_left = left_points[correspondence][geometry]
    accepted_right = right_points[correspondence][geometry]
    accepted_fb = forward_backward_error[correspondence][geometry]
    accepted_photo = photometric_error[correspondence][geometry]
    accepted_epipolar = epipolar[geometry]
    accepted_separation = separation[geometry]

    bounds = np.asarray([
        [args.provider_x_minimum, args.provider_x_maximum],
        [args.provider_y_minimum, args.provider_y_maximum],
        [args.provider_z_minimum, args.provider_z_maximum],
    ], dtype=float)
    if np.any(bounds[:, 1] <= bounds[:, 0]):
        raise ValueError("Every provider bound must have positive span")
    bounded = np.all(
        (provider_points >= bounds[:, 0]) & (provider_points <= bounds[:, 1]),
        axis=1,
    )
    points = provider_points[bounded]
    left_pixels = accepted_left[bounded]
    right_pixels = accepted_right[bounded]
    fb_error = accepted_fb[bounded]
    photo_error = accepted_photo[bounded]
    epipolar_error = accepted_epipolar[bounded]
    ray_separation = accepted_separation[bounded]
    holdout = deterministic_holdout(left_pixels)
    dense_validation_pass = bool(
        sparse_validation_pass
        and points.shape[0] >= args.minimum_bounded_points
        and np.count_nonzero(holdout) >= 100
        and float(np.percentile(ray_separation[holdout], 95))
        <= args.maximum_ray_separation_metres
    )

    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output_npz,
        provider_points_metres=points,
        left_pixels=left_pixels,
        right_pixels=right_pixels,
        forward_backward_error_pixels=fb_error,
        photometric_error_gray_levels=photo_error,
        epipolar_residual=epipolar_error,
        ray_separation_metres=ray_separation,
        holdout=holdout,
    )
    render_plan(args.output_png, points, ray_separation)

    stable = {
        "inputs": {
            "knownPoseSceneSha256": file_sha256(args.known_pose_scene),
            "calibrationSha256": file_sha256(args.calibration),
            "manifestSha256": file_sha256(manifest_path),
            "leftImageSha256": file_sha256(left_path),
            "rightImageSha256": file_sha256(right_path),
        },
        "seatIds": [left_id, right_id],
        "bounds": bounds.tolist(),
        "outputNpzSha256": file_sha256(args.output_npz),
        "outputPngSha256": file_sha256(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "dense-provider-metric-current-panorama-point-cloud",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        "inputs": {
            "knownPoseScene": {"path": str(args.known_pose_scene), "sha256": stable["inputs"]["knownPoseSceneSha256"], "artifactVersion": scene["artifactVersion"]},
            "calibration": {"path": str(args.calibration), "sha256": stable["inputs"]["calibrationSha256"], "artifactVersion": calibration["artifactVersion"]},
            "manifest": {"path": str(manifest_path), "sha256": stable["inputs"]["manifestSha256"]},
            "leftImage": {"path": str(left_path), "sha256": stable["inputs"]["leftImageSha256"]},
            "rightImage": {"path": str(right_path), "sha256": stable["inputs"]["rightImageSha256"]},
        },
        "cameraPair": scene["cameraPair"],
        "parameters": {
            "maximumWidth": args.maximum_width,
            "gridStride": args.grid_stride,
            "forwardBackwardThresholdPixels": args.forward_backward_threshold_pixels,
            "sparseValidationP95Pixels": args.sparse_validation_p95_pixels,
            "epipolarThreshold": args.epipolar_threshold,
            "maximumRaySeparationMetres": args.maximum_ray_separation_metres,
            "maximumDepthMetres": args.maximum_depth_metres,
            "minimumGradient": args.minimum_gradient,
            "maximumPhotometricError": args.maximum_photometric_error,
            "minimumBoundedPoints": args.minimum_bounded_points,
            "providerBoundsMetres": {"x": bounds[0].tolist(), "y": bounds[1].tolist(), "z": bounds[2].tolist()},
            "coarseSparseMedianShiftPixels": [round(float(value), 6) for value in coarse_shift],
        },
        "sparseFeatureValidation": {
            "pointCount": int(sparse_errors.size),
            "denseFlowPredictionErrorPixels": values_summary(sparse_errors),
            "passed": sparse_validation_pass,
        },
        "denseCorrespondence": {
            "sampledGridPointCount": int(left_points.shape[0]),
            "forwardBackwardAndPhotometricAcceptedCount": int(np.count_nonzero(correspondence)),
            "geometricallyAcceptedCount": int(provider_points.shape[0]),
            "boundedPointCount": int(points.shape[0]),
            "boundedForwardBackwardErrorPixels": values_summary(fb_error),
            "boundedPhotometricErrorGrayLevels": values_summary(photo_error),
            "boundedEpipolarResidual": values_summary(epipolar_error),
            "boundedRaySeparationMetres": values_summary(ray_separation),
        },
        "knownPoseValidation": {
            "trainingPointCount": int(np.count_nonzero(~holdout)),
            "holdoutPointCount": int(np.count_nonzero(holdout)),
            "holdoutRaySeparationMetres": values_summary(ray_separation[holdout]),
            "passed": dense_validation_pass,
        },
        "geometry": {
            "providerPointCount": int(points.shape[0]),
            "providerXMetres": values_summary(points[:, 0]),
            "providerYMetres": values_summary(points[:, 1]),
            "providerZMetres": values_summary(points[:, 2]),
            "npzPath": str(args.output_npz),
            "npzSha256": stable["outputNpzSha256"],
        },
        "diagnosticPng": {"path": str(args.output_png), "sha256": stable["outputPngSha256"]},
        "assessment": {
            "denseKnownPoseProviderMetricMeasurementEligible": dense_validation_pass,
            "publicationEligible": False,
            "blockers": [
                "DENSE_POINTS_REQUIRE_CROSS_VALIDATION_ACROSS_DISJOINT_PANORAMAS",
                "POINTS_NOT_SEGMENTED_INTO_CLOSED_SOLID_VOLUMES",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "outputNpz": str(args.output_npz),
        "cameraPair": artifact["cameraPair"],
        "sparseValidationP95Pixels": artifact["sparseFeatureValidation"]["denseFlowPredictionErrorPixels"]["p95"],
        "geometricallyAcceptedPoints": artifact["denseCorrespondence"]["geometricallyAcceptedCount"],
        "boundedPoints": artifact["denseCorrespondence"]["boundedPointCount"],
        "holdoutRaySeparationP95Metres": artifact["knownPoseValidation"]["holdoutRaySeparationMetres"]["p95"],
        "measurementEligible": dense_validation_pass,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
