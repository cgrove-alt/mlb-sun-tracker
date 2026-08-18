#!/usr/bin/env python3
"""Sample a provider-local surface with known-pose epipolar patch search."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from classifyOpenRoofPanoramaRayDepths import sampled_patches
from reconstructPanoramaDenseOverhang import panorama_rays, values_summary
from validatePanoramaOverhangFrontEdge import project_provider_points


ANALYSIS_VERSION = "photometric-known-pose-panorama-surface-v1"


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


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
    parser.add_argument("--grid-stride", type=int, default=4)
    parser.add_argument("--patch-size", type=int, default=9)
    parser.add_argument("--minimum-depth-metres", type=float, default=1.0)
    parser.add_argument("--maximum-depth-metres", type=float, default=50.0)
    parser.add_argument("--coarse-depth-step-metres", type=float, default=0.25)
    parser.add_argument("--refine-half-span-metres", type=float, default=0.5)
    parser.add_argument("--refine-depth-step-metres", type=float, default=0.02)
    parser.add_argument("--minimum-gradient", type=float, default=12.0)
    parser.add_argument("--minimum-zncc", type=float, default=0.75)
    parser.add_argument("--minimum-peak-prominence", type=float, default=0.03)
    parser.add_argument("--prominence-exclusion-metres", type=float, default=0.5)
    parser.add_argument("--chunk-size", type=int, default=64)
    parser.add_argument("--minimum-bounded-points", type=int, default=500)
    return parser.parse_args()


def ray_box_intervals(
    origin: np.ndarray,
    directions: np.ndarray,
    bounds: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    with np.errstate(divide="ignore", invalid="ignore"):
        first = (bounds[:, 0] - origin) / directions
        second = (bounds[:, 1] - origin) / directions
    lower = np.minimum(first, second)
    upper = np.maximum(first, second)
    parallel = np.abs(directions) <= 1e-12
    origin_inside = (origin >= bounds[:, 0]) & (origin <= bounds[:, 1])
    lower = np.where(parallel & origin_inside, -np.inf, lower)
    upper = np.where(parallel & origin_inside, np.inf, upper)
    lower = np.where(parallel & ~origin_inside, np.inf, lower)
    upper = np.where(parallel & ~origin_inside, -np.inf, upper)
    return np.max(lower, axis=1), np.min(upper, axis=1)


def batched_zncc(targets: np.ndarray, candidates: np.ndarray) -> np.ndarray:
    target_values = targets.astype(np.float64)
    target_values -= np.mean(target_values, axis=(1, 2), keepdims=True)
    target_norms = np.linalg.norm(target_values, axis=(1, 2))
    candidate_values = candidates.astype(np.float64)
    candidate_values -= np.mean(candidate_values, axis=(2, 3), keepdims=True)
    candidate_norms = np.linalg.norm(candidate_values, axis=(2, 3))
    numerator = np.einsum("ndij,nij->nd", candidate_values, target_values)
    denominator = candidate_norms * target_norms[:, None]
    return np.divide(
        numerator,
        denominator,
        out=np.full(numerator.shape, -1.0, dtype=float),
        where=denominator > 1e-12,
    )


def safe_sampled_patches(
    image: np.ndarray,
    centers: np.ndarray,
    patch_size: int,
    remap_row_limit: int = 32_000,
) -> np.ndarray:
    maximum_centers = max(1, remap_row_limit // patch_size)
    batches = [
        sampled_patches(
            image,
            centers[start:start + maximum_centers],
            patch_size,
        )
        for start in range(0, centers.shape[0], maximum_centers)
    ]
    if not batches:
        return np.empty((0, patch_size, patch_size), dtype=image.dtype)
    return np.concatenate(batches, axis=0)


def render_plan(
    path: Path,
    points: np.ndarray,
    scores: np.ndarray,
) -> None:
    width, height, padding = 1600, 1000, 55
    image = np.full((height, width, 3), 245, dtype=np.uint8)
    if points.shape[0] == 0:
        cv2.putText(image, "No accepted photometric points", (45, 85), cv2.FONT_HERSHEY_SIMPLEX, 1.4, (20, 20, 20), 3)
    else:
        minimum = np.min(points[:, [0, 2]], axis=0)
        maximum = np.max(points[:, [0, 2]], axis=0)
        scale = np.asarray([
            (width - 2 * padding) / max(maximum[0] - minimum[0], 1e-9),
            (height - 2 * padding) / max(maximum[1] - minimum[1], 1e-9),
        ])
        low = float(np.percentile(scores, 5))
        high = max(float(np.percentile(scores, 95)), low + 1e-9)
        for point, score in zip(points, scores):
            x = int(round(padding + (point[0] - minimum[0]) * scale[0]))
            y = int(round(height - padding - (point[2] - minimum[1]) * scale[1]))
            normalized = min(max(float((score - low) / (high - low)), 0.0), 1.0)
            color = (round(220 * (1.0 - normalized)), round(180 * normalized), 45)
            cv2.circle(image, (x, y), 1, color, -1)
        cv2.putText(
            image,
            "provider x-z plan, blue lower ZNCC and green higher",
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


def main() -> None:
    args = parse_args()
    if args.patch_size < 5 or args.patch_size % 2 == 0:
        raise ValueError("Patch size must be an odd integer of at least five")
    if args.grid_stride <= 0 or args.chunk_size <= 0:
        raise ValueError("Grid stride and chunk size must be positive")
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
    left_source = cv2.imread(str(left_path), cv2.IMREAD_GRAYSCALE)
    right_source = cv2.imread(str(right_path), cv2.IMREAD_GRAYSCALE)
    if left_source is None or right_source is None or left_source.shape != right_source.shape:
        raise ValueError("Could not load matching panorama images")
    source_height, source_width = left_source.shape
    scale = min(1.0, args.maximum_width / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    left = cv2.resize(left_source, (width, height), interpolation=cv2.INTER_AREA).astype(np.float32)
    right = cv2.resize(right_source, (width, height), interpolation=cv2.INTER_AREA).astype(np.float32)
    gradient = np.hypot(
        cv2.Sobel(left, cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(left, cv2.CV_32F, 0, 1, ksize=3),
    )

    bounds = np.asarray([
        [args.provider_x_minimum, args.provider_x_maximum],
        [args.provider_y_minimum, args.provider_y_maximum],
        [args.provider_z_minimum, args.provider_z_maximum],
    ], dtype=float)
    if np.any(bounds[:, 1] <= bounds[:, 0]):
        raise ValueError("Every provider bound must have positive span")
    radius = args.patch_size // 2
    columns = np.arange(0, width, args.grid_stride)
    rows = np.arange(radius + 1, int(height * 0.60), args.grid_stride)
    grid_x, grid_y = np.meshgrid(columns, rows)
    pixels = np.column_stack([grid_x.ravel(), grid_y.ravel()]).astype(float)
    panorama_directions = panorama_rays(
        pixels,
        width,
        height,
        float(left_entry["config"]["rp"][1]),
    )
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"],
        dtype=float,
    )
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"],
        dtype=float,
    )
    provider_directions = np.einsum(
        "ij,nj->ni",
        panorama_to_provider,
        panorama_directions,
    )
    left_position = np.asarray(left_entry["config"]["p"], dtype=float)
    right_position = np.asarray(right_entry["config"]["p"], dtype=float)
    entry_depth, exit_depth = ray_box_intervals(
        left_position,
        provider_directions,
        bounds,
    )
    selectable = (
        (exit_depth >= np.maximum(entry_depth, args.minimum_depth_metres))
        & (entry_depth <= args.maximum_depth_metres)
        & np.all(np.isfinite(provider_directions), axis=1)
        & (pixels[:, 1] >= radius + 1)
        & (pixels[:, 1] < height - radius - 2)
        & (gradient[pixels[:, 1].astype(int), pixels[:, 0].astype(int)] >= args.minimum_gradient)
    )
    pixels = pixels[selectable]
    provider_directions = provider_directions[selectable]
    entry_depth = np.maximum(entry_depth[selectable], args.minimum_depth_metres)
    exit_depth = np.minimum(exit_depth[selectable], args.maximum_depth_metres)
    target_patches = safe_sampled_patches(left, pixels, args.patch_size)

    coarse_depths = np.arange(
        args.minimum_depth_metres,
        args.maximum_depth_metres + args.coarse_depth_step_metres * 0.5,
        args.coarse_depth_step_metres,
    )
    remap_row_limit = 32_000
    maximum_safe_chunk = max(
        1,
        remap_row_limit // (coarse_depths.size * args.patch_size),
    )
    effective_chunk_size = min(args.chunk_size, maximum_safe_chunk)
    accepted_points = []
    accepted_pixels = []
    accepted_depths = []
    accepted_scores = []
    accepted_prominence = []
    for start in range(0, pixels.shape[0], effective_chunk_size):
        stop = min(pixels.shape[0], start + effective_chunk_size)
        chunk_pixels = pixels[start:stop]
        chunk_directions = provider_directions[start:stop]
        chunk_entry = entry_depth[start:stop]
        chunk_exit = exit_depth[start:stop]
        chunk_targets = target_patches[start:stop]
        candidate_points = (
            left_position[None, None, :]
            + chunk_directions[:, None, :] * coarse_depths[None, :, None]
        )
        centers = project_provider_points(
            candidate_points.reshape(-1, 3),
            right_position,
            provider_to_panorama,
            float(right_entry["config"]["rp"][1]),
            width,
            height,
        )
        patches = safe_sampled_patches(right, centers, args.patch_size).reshape(
            stop - start,
            coarse_depths.size,
            args.patch_size,
            args.patch_size,
        )
        scores = batched_zncc(chunk_targets, patches)
        valid = (
            (coarse_depths[None, :] >= chunk_entry[:, None])
            & (coarse_depths[None, :] <= chunk_exit[:, None])
        )
        scores[~valid] = -np.inf
        best_indices = np.argmax(scores, axis=1)
        best_coarse = coarse_depths[best_indices]
        best_coarse_scores = scores[np.arange(stop - start), best_indices]
        far = np.abs(coarse_depths[None, :] - best_coarse[:, None]) >= args.prominence_exclusion_metres
        alternate_scores = np.max(np.where(valid & far, scores, -np.inf), axis=1)
        prominence = np.full(best_coarse_scores.shape, np.nan, dtype=float)
        finite_peaks = np.isfinite(best_coarse_scores) & np.isfinite(alternate_scores)
        prominence[finite_peaks] = (
            best_coarse_scores[finite_peaks] - alternate_scores[finite_peaks]
        )

        refine_offsets = np.arange(
            -args.refine_half_span_metres,
            args.refine_half_span_metres + args.refine_depth_step_metres * 0.5,
            args.refine_depth_step_metres,
        )
        refine_depths = best_coarse[:, None] + refine_offsets[None, :]
        refine_points = (
            left_position[None, None, :]
            + chunk_directions[:, None, :] * refine_depths[:, :, None]
        )
        refine_centers = project_provider_points(
            refine_points.reshape(-1, 3),
            right_position,
            provider_to_panorama,
            float(right_entry["config"]["rp"][1]),
            width,
            height,
        )
        refine_patches = safe_sampled_patches(right, refine_centers, args.patch_size).reshape(
            stop - start,
            refine_offsets.size,
            args.patch_size,
            args.patch_size,
        )
        refine_scores = batched_zncc(chunk_targets, refine_patches)
        refine_valid = (
            (refine_depths >= chunk_entry[:, None])
            & (refine_depths <= chunk_exit[:, None])
        )
        refine_scores[~refine_valid] = -np.inf
        refine_indices = np.argmax(refine_scores, axis=1)
        final_depths = refine_depths[np.arange(stop - start), refine_indices]
        final_scores = refine_scores[np.arange(stop - start), refine_indices]
        keep = (
            np.isfinite(final_scores)
            & (final_scores >= args.minimum_zncc)
            & np.isfinite(prominence)
            & (prominence >= args.minimum_peak_prominence)
        )
        final_points = (
            left_position[None, :]
            + chunk_directions * final_depths[:, None]
        )
        accepted_points.append(final_points[keep])
        accepted_pixels.append(chunk_pixels[keep])
        accepted_depths.append(final_depths[keep])
        accepted_scores.append(final_scores[keep])
        accepted_prominence.append(prominence[keep])

    points = np.vstack(accepted_points) if accepted_points else np.empty((0, 3))
    left_pixels = np.vstack(accepted_pixels) if accepted_pixels else np.empty((0, 2))
    depths = np.concatenate(accepted_depths) if accepted_depths else np.empty(0)
    scores = np.concatenate(accepted_scores) if accepted_scores else np.empty(0)
    prominences = np.concatenate(accepted_prominence) if accepted_prominence else np.empty(0)
    measurement_eligible = bool(
        points.shape[0] >= args.minimum_bounded_points
        and scene["knownPoseValidation"]["passed"]
    )
    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output_npz,
        provider_points_metres=points,
        left_pixels=left_pixels,
        depth_metres=depths,
        peak_zncc=scores,
        peak_prominence=prominences,
    )
    render_plan(args.output_png, points, scores)

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
        "artifactStage": "photometric-provider-metric-panorama-surface-points",
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
            "patchSize": args.patch_size,
            "minimumDepthMetres": args.minimum_depth_metres,
            "maximumDepthMetres": args.maximum_depth_metres,
            "coarseDepthStepMetres": args.coarse_depth_step_metres,
            "refineHalfSpanMetres": args.refine_half_span_metres,
            "refineDepthStepMetres": args.refine_depth_step_metres,
            "minimumGradient": args.minimum_gradient,
            "minimumZncc": args.minimum_zncc,
            "minimumPeakProminence": args.minimum_peak_prominence,
            "prominenceExclusionMetres": args.prominence_exclusion_metres,
            "providerBoundsMetres": {"x": bounds[0].tolist(), "y": bounds[1].tolist(), "z": bounds[2].tolist()},
            "minimumBoundedPoints": args.minimum_bounded_points,
            "requestedChunkSize": args.chunk_size,
            "effectiveChunkSize": effective_chunk_size,
            "opencvRemapRowLimit": remap_row_limit,
        },
        "candidateSampling": {
            "fullGridPointCount": int(grid_x.size),
            "rayBoxAndGradientCandidateCount": int(pixels.shape[0]),
            "acceptedPointCount": int(points.shape[0]),
            "depthMetres": values_summary(depths),
            "peakZncc": values_summary(scores),
            "peakProminence": values_summary(prominences),
        },
        "knownPoseValidation": {
            "sparseSourceArtifactPassed": bool(scene["knownPoseValidation"]["passed"]),
            "minimumPhotometricPointCountPassed": points.shape[0] >= args.minimum_bounded_points,
            "passed": measurement_eligible,
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
            "photometricKnownPoseProviderMetricMeasurementEligible": measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "PHOTOMETRIC_POINTS_REQUIRE_CROSS_VALIDATION_ACROSS_DISJOINT_PANORAMAS",
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
        "rayBoxAndGradientCandidates": int(pixels.shape[0]),
        "acceptedPoints": int(points.shape[0]),
        "peakZncc": artifact["candidateSampling"]["peakZncc"],
        "peakProminence": artifact["candidateSampling"]["peakProminence"],
        "measurementEligible": measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
