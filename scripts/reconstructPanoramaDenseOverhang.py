#!/usr/bin/env python3
"""Evaluate dense optical-flow stereo for overhead obstruction geometry.

Dense flow is checked against independently matched sparse SIFT features before
its 3D points are considered. The result remains experimental and fail-closed.
It does not become publication geometry unless both image correspondence and
surface holdouts pass their stated thresholds.
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


ANALYSIS_VERSION = "dense-spherical-panorama-overhang-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("stereo", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("surface", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--maximum-width", type=int, default=2048)
    parser.add_argument("--grid-stride", type=int, default=2)
    parser.add_argument("--forward-backward-threshold-pixels", type=float, default=1.0)
    parser.add_argument("--sparse-validation-p95-pixels", type=float, default=2.0)
    parser.add_argument("--epipolar-threshold", type=float, default=0.002)
    parser.add_argument("--maximum-ray-separation-metres", type=float, default=0.03)
    parser.add_argument("--maximum-depth-metres", type=float, default=20.0)
    parser.add_argument("--minimum-gradient", type=float, default=12.0)
    parser.add_argument("--maximum-photometric-error", type=float, default=35.0)
    parser.add_argument("--maximum-embedded-points", type=int, default=20_000)
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


def values_summary(values: np.ndarray) -> dict[str, float | int | None]:
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
    points = np.asarray(points, dtype=np.float64)
    longitude = (points[:, 0] / width - 0.5) * (2.0 * math.pi)
    latitude = (0.5 - points[:, 1] / height) * math.pi
    cosine_latitude = np.cos(latitude)
    rays = np.column_stack([
        cosine_latitude * np.cos(longitude),
        np.sin(latitude),
        cosine_latitude * np.sin(longitude),
    ])
    yaw = math.radians(provider_yaw_degrees)
    cosine = math.cos(yaw)
    sine = math.sin(yaw)
    rotated = np.empty_like(rays)
    rotated[:, 0] = cosine * rays[:, 0] + sine * rays[:, 2]
    rotated[:, 1] = rays[:, 1]
    rotated[:, 2] = -sine * rays[:, 0] + cosine * rays[:, 2]
    rotated /= np.linalg.norm(rotated, axis=1, keepdims=True)
    return rotated


def bilinear_scalar(image: np.ndarray, points: np.ndarray) -> np.ndarray:
    outputs = []
    for start in range(0, points.shape[0], 30_000):
        selected = points[start:start + 30_000]
        outputs.append(cv2.remap(
            image,
            selected[:, 0].astype(np.float32).reshape(1, -1),
            selected[:, 1].astype(np.float32).reshape(1, -1),
            cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=float("nan"),
        ).reshape(-1))
    return np.concatenate(outputs) if outputs else np.empty(0, dtype=float)


def bilinear_vector(field: np.ndarray, points: np.ndarray) -> np.ndarray:
    outputs = []
    for start in range(0, points.shape[0], 30_000):
        selected = points[start:start + 30_000]
        sampled = cv2.remap(
            field,
            selected[:, 0].astype(np.float32).reshape(1, -1),
            selected[:, 1].astype(np.float32).reshape(1, -1),
            cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=float("nan"),
        )
        outputs.append(sampled.reshape(-1, field.shape[2]))
    return np.vstack(outputs) if outputs else np.empty((0, field.shape[2]), dtype=float)


def triangulate(
    left_rays: np.ndarray,
    right_rays: np.ndarray,
    translation: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    left_rays = np.asarray(left_rays, dtype=np.float64)
    right_rays = np.asarray(right_rays, dtype=np.float64)
    translation = np.asarray(translation, dtype=np.float64)
    dot = np.sum(left_rays * right_rays, axis=1)
    off_diagonal = -dot
    first_rhs = np.einsum("ij,j->i", left_rays, translation)
    second_rhs = -np.einsum("ij,j->i", right_rays, translation)
    determinant = 1.0 - off_diagonal * off_diagonal
    safe = np.abs(determinant) > 1e-9
    left_depth = np.full(left_rays.shape[0], np.nan)
    right_depth = np.full(left_rays.shape[0], np.nan)
    left_depth[safe] = (
        first_rhs[safe] - off_diagonal[safe] * second_rhs[safe]
    ) / determinant[safe]
    right_depth[safe] = (
        second_rhs[safe] - off_diagonal[safe] * first_rhs[safe]
    ) / determinant[safe]
    left_point = left_rays * left_depth[:, None]
    right_point = translation + right_rays * right_depth[:, None]
    separation = np.linalg.norm(left_point - right_point, axis=1)
    points = (left_point + right_point) / 2.0
    return left_depth, right_depth, separation, points


def render_plan(path: Path, points: np.ndarray, plane_residual: np.ndarray) -> None:
    if points.shape[0] == 0:
        image = np.full((800, 1200, 3), 245, dtype=np.uint8)
        cv2.putText(image, "No accepted dense points", (40, 80), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 0), 3)
        cv2.imwrite(str(path), image)
        return
    minimum = np.percentile(points[:, [0, 2]], 1, axis=0)
    maximum = np.percentile(points[:, [0, 2]], 99, axis=0)
    width, height, padding = 1400, 1000, 50
    image = np.full((height, width, 3), 245, dtype=np.uint8)
    scale_x = (width - 2 * padding) / max(maximum[0] - minimum[0], 1e-6)
    scale_y = (height - 2 * padding) / max(maximum[1] - minimum[1], 1e-6)
    for point, residual in zip(points, plane_residual):
        if not (
            minimum[0] <= point[0] <= maximum[0]
            and minimum[1] <= point[2] <= maximum[1]
        ):
            continue
        x = int(round(padding + (point[0] - minimum[0]) * scale_x))
        y = int(round(height - padding - (point[2] - minimum[1]) * scale_y))
        if residual <= 0.05:
            color = (220, 90, 20)
        elif point[1] < 9.2:
            color = (40, 40, 220)
        else:
            color = (80, 150, 80)
        cv2.circle(image, (x, y), 1, color, -1)
    cv2.putText(image, "blue: underside plane, red: lower candidate obstruction, green: other", (35, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (20, 20, 20), 2)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(path), image):
        raise ValueError("Could not write dense plan diagnostic")


def main() -> None:
    args = parse_args()
    stereo = json.loads(args.stereo.read_text())
    calibration = json.loads(args.calibration.read_text())
    surface = json.loads(args.surface.read_text())
    manifest_path = Path(stereo["inputs"]["manifest"])
    manifest = json.loads(manifest_path.read_text())
    images = {entry["seatId"]: entry for entry in manifest["images"]}
    left_entry = images[stereo["inputs"]["leftSeatId"]]
    right_entry = images[stereo["inputs"]["rightSeatId"]]
    left_source = cv2.imread(left_entry["localPath"], cv2.IMREAD_GRAYSCALE)
    right_source = cv2.imread(right_entry["localPath"], cv2.IMREAD_GRAYSCALE)
    if left_source is None or right_source is None or left_source.shape != right_source.shape:
        raise ValueError("Could not load matching panorama images")
    source_height, source_width = left_source.shape
    scale = min(1.0, args.maximum_width / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    left = cv2.resize(left_source, (width, height), interpolation=cv2.INTER_AREA)
    right = cv2.resize(right_source, (width, height), interpolation=cv2.INTER_AREA)
    sparse_left = np.asarray([
        point["leftPixel"]
        for point in stereo["triangulation"].get("sparseCeilingPoints", [])
        if point.get("highConfidenceLocalSurfacePoint")
    ], dtype=float) * scale
    sparse_right = np.asarray([
        point["rightPixel"]
        for point in stereo["triangulation"].get("sparseCeilingPoints", [])
        if point.get("highConfidenceLocalSurfacePoint")
    ], dtype=float) * scale
    if sparse_left.shape[0] == 0:
        raise ValueError("Sparse artifact has no high-confidence ceiling validation points")
    sparse_displacement = sparse_right - sparse_left
    sparse_displacement[:, 0] = (
        (sparse_displacement[:, 0] + width / 2.0) % width
        - width / 2.0
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
    sparse_p95 = float(np.percentile(sparse_errors, 95))

    rows = np.arange(1, int(height * 0.55), args.grid_stride)
    columns = np.arange(int(width * 0.12), int(width * 0.88), args.grid_stride)
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

    left_yaw = float(left_entry["config"]["rp"][1])
    right_yaw = float(right_entry["config"]["rp"][1])
    left_rays = panorama_rays(left_points[correspondence], width, height, left_yaw)
    right_rays = panorama_rays(right_points[correspondence], width, height, right_yaw)
    translation = np.asarray(
        stereo["sharedFrameTranslationFit"]["chosenTranslationVectorMetres"],
        dtype=float,
    )
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
        & (left_depth > 0)
        & (right_depth > 0)
        & (left_depth <= args.maximum_depth_metres)
        & (right_depth <= args.maximum_depth_metres)
        & (separation <= args.maximum_ray_separation_metres)
        & (epipolar <= args.epipolar_threshold)
    )
    panorama_points = panorama_points[geometry]
    accepted_left_pixels = left_points[correspondence][geometry]
    accepted_right_pixels = right_points[correspondence][geometry]
    accepted_fb = forward_backward_error[correspondence][geometry]
    accepted_photo = photometric_error[correspondence][geometry]
    accepted_epipolar = epipolar[geometry]
    accepted_separation = separation[geometry]
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"],
        dtype=float,
    )
    left_position = np.asarray(left_entry["config"]["p"], dtype=float)
    provider_points = left_position + (panorama_to_provider @ panorama_points.T).T
    plane_normal = np.asarray(
        surface["training"]["plane"]["normalProviderLocal"],
        dtype=float,
    )
    plane_offset = float(surface["training"]["plane"]["offsetMetres"])
    plane_residual = np.abs(provider_points @ plane_normal + plane_offset)
    underside_plane = plane_residual <= 0.05
    lower_obstruction = (
        (provider_points[:, 1] < 9.2)
        & (provider_points[:, 1] >= 5.0)
        & (provider_points[:, 2] >= 35.0)
        & (provider_points[:, 2] <= 45.0)
    )
    render_plan(args.output_png, provider_points, plane_residual)

    if provider_points.shape[0] > args.maximum_embedded_points:
        keys = np.asarray([
            int.from_bytes(
                hashlib.sha256(
                    f"dense-v1:{point[0]:.4f}:{point[1]:.4f}:{point[2]:.4f}".encode("utf-8")
                ).digest()[:8],
                "big",
            )
            for point in provider_points
        ], dtype=np.uint64)
        embedded_indices = np.argsort(keys)[:args.maximum_embedded_points]
    else:
        embedded_indices = np.arange(provider_points.shape[0])
    sparse_validation_pass = bool(
        sparse_left.shape[0] >= 30
        and sparse_p95 <= args.sparse_validation_p95_pixels
    )
    dense_measurement_eligible = bool(
        sparse_validation_pass
        and provider_points.shape[0] >= 1_000
        and np.count_nonzero(underside_plane) >= 100
    )
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "experimental-dense-provider-local-overhead-stereo",
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
            "manifest": {
                "path": str(manifest_path),
                "sha256": file_sha256(manifest_path),
            },
            "leftImageSha256": file_sha256(Path(left_entry["localPath"])),
            "rightImageSha256": file_sha256(Path(right_entry["localPath"])),
        },
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
            "coarseSparseMedianShiftPixels": [
                round(float(value), 6) for value in coarse_shift
            ],
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
            "forwardBackwardErrorPixels": values_summary(accepted_fb),
            "photometricErrorGrayLevels": values_summary(accepted_photo),
            "epipolarResidual": values_summary(accepted_epipolar),
            "closestRaySeparationMetres": values_summary(accepted_separation),
        },
        "geometry": {
            "providerLocalPointCount": int(provider_points.shape[0]),
            "undersidePlanePointCount": int(np.count_nonzero(underside_plane)),
            "lowerCandidateObstructionPointCount": int(np.count_nonzero(lower_obstruction)),
            "providerXMetres": values_summary(provider_points[:, 0]),
            "providerYMetres": values_summary(provider_points[:, 1]),
            "providerZMetres": values_summary(provider_points[:, 2]),
            "undersidePlaneAbsoluteResidualMetres": values_summary(
                plane_residual[underside_plane]
            ),
            "embeddedPoints": [
                {
                    "providerLocalMetres": [round(float(value), 6) for value in provider_points[index]],
                    "leftPixel": [round(float(value), 3) for value in accepted_left_pixels[index]],
                    "rightPixel": [round(float(value), 3) for value in accepted_right_pixels[index]],
                    "planeAbsoluteResidualMetres": round(float(plane_residual[index]), 6),
                    "undersidePlaneCandidate": bool(underside_plane[index]),
                    "lowerObstructionCandidate": bool(lower_obstruction[index]),
                }
                for index in embedded_indices
            ],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
        },
        "assessment": {
            "denseProviderLocalMeasurementEligible": dense_measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "DENSE_FLOW_NOT_CROSS_VALIDATED_ACROSS_DISJOINT_PANORAMAS",
                "POINTS_NOT_YET_SEGMENTED_INTO_CLOSED_SOLID_VOLUMES",
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
        "sparseValidationPointCount": int(sparse_errors.size),
        "sparseValidationP95Pixels": round(sparse_p95, 6),
        "acceptedDensePoints": int(provider_points.shape[0]),
        "undersidePlanePoints": int(np.count_nonzero(underside_plane)),
        "lowerObstructionCandidates": int(np.count_nonzero(lower_obstruction)),
        "measurementEligible": dense_measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
