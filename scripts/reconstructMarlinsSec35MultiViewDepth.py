#!/usr/bin/env python3
"""Reconstruct provider-model surfaces with disjoint multi-view depth checks.

The target image, partner partitions, image region, and numeric gates are fixed
in this source. Accepted points agree between training and holdout depth sweeps
and then pass a third fixed-depth photometric check. Results remain geometry of
the current provider render, not physical as-built measurements.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from classifyOpenRoofPanoramaRayDepths import (
    candidate_scores_many,
    sampled_patches,
)
from reconstructPanoramaDenseOverhang import panorama_rays, values_summary


ANALYSIS_VERSION = "marlins-sec35-disjoint-multiview-depth-v1"
PROFILE_CONFIGS = {
    "target12": {
        "targetSeatId": "S_SEC35-10-12",
        "trainingPartnerSeatIds": (
            "S_SEC35-10-7",
            "S_SEC35-10-16",
            "S_SEC35-10-5",
            "S_SEC35-10-18",
        ),
        "holdoutPartnerSeatIds": (
            "S_SEC35-10-10",
            "S_SEC35-10-14",
            "S_SEC35-10-3",
            "S_SEC35-10-21",
        ),
        "finalPartnerSeatIds": (
            "S_SEC35-10-23",
            "S_SEC35-10-25",
            "S_SEC35-10-27",
            "S_SEC35-10-28",
            "S_SEC35-10-30",
        ),
    },
    "target16": {
        "targetSeatId": "S_SEC35-10-16",
        "trainingPartnerSeatIds": (
            "S_SEC35-10-12",
            "S_SEC35-10-18",
            "S_SEC35-10-10",
            "S_SEC35-10-21",
        ),
        "holdoutPartnerSeatIds": (
            "S_SEC35-10-14",
            "S_SEC35-10-23",
            "S_SEC35-10-7",
            "S_SEC35-10-25",
        ),
        "finalPartnerSeatIds": (
            "S_SEC35-10-5",
            "S_SEC35-10-27",
            "S_SEC35-10-3",
            "S_SEC35-10-28",
            "S_SEC35-10-30",
        ),
    },
    "target11wc10": {
        "targetSeatId": "S_SEC35-11wc-10",
        "trainingPartnerSeatIds": (
            "S_SEC35-11wc-8",
            "S_SEC35-11wc-12",
            "S_SEC35-11wc-4",
            "S_SEC35-11wc-16",
        ),
        "holdoutPartnerSeatIds": (
            "S_SEC35-11wc-7",
            "S_SEC35-11wc-13",
            "S_SEC35-11wc-3",
            "S_SEC35-11wc-17",
        ),
        "finalPartnerSeatIds": (
            "S_SEC35-11wc-2",
            "S_SEC35-11wc-9",
            "S_SEC35-11wc-14",
            "S_SEC35-11wc-18",
            "S_SEC35-11wc-19",
        ),
    },
}
DEFAULT_ANALYSIS_WIDTH = 2048
BASE_ROI_X_PIXELS = (560, 1490)
BASE_ROI_Y_PIXELS = (80, 500)
DEFAULT_GRID_STRIDE_PIXELS = 8
DEFAULT_PATCH_SIZE_PIXELS = 9
MINIMUM_GRADIENT = 15.0
MINIMUM_PATCH_STANDARD_DEVIATION = 12.0
MINIMUM_DEPTH_METRES = 2.0
MAXIMUM_DEPTH_METRES = 25.0
COARSE_DEPTH_STEP_METRES = 0.25
REFINE_HALF_SPAN_METRES = 0.50
DEFAULT_REFINE_DEPTH_STEP_METRES = 0.02
PROMINENCE_EXCLUSION_METRES = 0.75
MINIMUM_MEDIAN_ZNCC = 0.75
MINIMUM_PARTNER_ZNCC = 0.65
MINIMUM_PARTNER_SUPPORT = 3
MINIMUM_PEAK_PROMINENCE = 0.03
MAXIMUM_PARTITION_DEPTH_DISAGREEMENT_METRES = 0.3048
MINIMUM_FINAL_POINT_COUNT = 100
CHUNK_SIZE = 192
PROVIDER_BOUNDS_METRES = np.asarray([
    [90.0, 122.0],
    [11.5, 22.0],
    [5.0, 55.0],
], dtype=float)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument(
        "--profile",
        choices=tuple(PROFILE_CONFIGS),
        default="target12",
    )
    parser.add_argument(
        "--grid-stride",
        type=int,
        choices=(2, 4, 8),
        default=DEFAULT_GRID_STRIDE_PIXELS,
    )
    parser.add_argument(
        "--texture-metric",
        choices=("center-gradient", "patch-standard-deviation"),
        default="center-gradient",
    )
    parser.add_argument(
        "--patch-size",
        type=int,
        choices=(9, 17),
        default=DEFAULT_PATCH_SIZE_PIXELS,
    )
    parser.add_argument(
        "--refine-depth-step",
        type=float,
        choices=(0.01, 0.02),
        default=DEFAULT_REFINE_DEPTH_STEP_METRES,
    )
    parser.add_argument(
        "--analysis-width",
        type=int,
        choices=(2048, 4096),
        default=DEFAULT_ANALYSIS_WIDTH,
    )
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


def peak_prominence(
    scores: np.ndarray,
    depth_axis: np.ndarray,
    best_indices: np.ndarray,
) -> np.ndarray:
    output = np.full(best_indices.shape, -np.inf, dtype=float)
    for index, best_index in enumerate(best_indices):
        far = (
            np.abs(depth_axis - depth_axis[int(best_index)])
            >= PROMINENCE_EXCLUSION_METRES
        )
        if np.any(far):
            output[index] = (
                scores[index, int(best_index)]
                - float(np.max(scores[index, far]))
            )
    return output


def best_partition_depths(
    target: dict[str, Any],
    provider_directions: np.ndarray,
    target_patches: np.ndarray,
    partners: list[dict[str, Any]],
    image_cache: dict[str, np.ndarray],
    provider_to_panorama: np.ndarray,
    coarse_axis: np.ndarray,
    patch_size: int,
    refine_depth_step: float,
) -> dict[str, np.ndarray]:
    direction_count = provider_directions.shape[0]
    coarse_depths = np.broadcast_to(
        coarse_axis[None, :],
        (direction_count, coarse_axis.size),
    )
    coarse_scores, _ = candidate_scores_many(
        coarse_depths,
        np.asarray(target["config"]["p"], dtype=float),
        provider_directions,
        target_patches,
        partners,
        image_cache,
        provider_to_panorama,
        patch_size,
    )
    coarse_indices = np.argmax(coarse_scores, axis=1)
    prominence = peak_prominence(coarse_scores, coarse_axis, coarse_indices)
    coarse_best = coarse_axis[coarse_indices]
    refine_offsets = np.arange(
        -REFINE_HALF_SPAN_METRES,
        REFINE_HALF_SPAN_METRES + refine_depth_step * 0.5,
        refine_depth_step,
    )
    refine_depths = np.clip(
        coarse_best[:, None] + refine_offsets[None, :],
        MINIMUM_DEPTH_METRES,
        MAXIMUM_DEPTH_METRES,
    )
    refined_scores, partner_scores = candidate_scores_many(
        refine_depths,
        np.asarray(target["config"]["p"], dtype=float),
        provider_directions,
        target_patches,
        partners,
        image_cache,
        provider_to_panorama,
        patch_size,
    )
    refined_indices = np.argmax(refined_scores, axis=1)
    rows = np.arange(direction_count)
    best_depth = refine_depths[rows, refined_indices]
    best_score = refined_scores[rows, refined_indices]
    partner_at_best = np.column_stack([
        scores[rows, refined_indices]
        for scores in partner_scores
    ])
    support = np.count_nonzero(
        partner_at_best >= MINIMUM_PARTNER_ZNCC,
        axis=1,
    )
    return {
        "depth": best_depth,
        "score": best_score,
        "prominence": prominence,
        "partnerSupport": support,
        "partnerScores": partner_at_best,
    }


def render_diagnostic(
    path: Path,
    target_image: np.ndarray,
    candidate_pixels: np.ndarray,
    partition_passed: np.ndarray,
    final_passed: np.ndarray,
    points: np.ndarray,
    depths: np.ndarray,
    roi_x_pixels: tuple[int, int],
    roi_y_pixels: tuple[int, int],
) -> None:
    overlay = cv2.cvtColor(target_image.astype(np.uint8), cv2.COLOR_GRAY2BGR)
    for pixel, partition_ok, final_ok in zip(
        candidate_pixels,
        partition_passed,
        final_passed,
    ):
        if final_ok:
            color = (0, 255, 0)
        elif partition_ok:
            color = (0, 165, 255)
        else:
            continue
        cv2.circle(
            overlay,
            tuple(np.round(pixel).astype(int)),
            3,
            color,
            -1,
            cv2.LINE_AA,
        )
    cv2.rectangle(
        overlay,
        (roi_x_pixels[0], roi_y_pixels[0]),
        (roi_x_pixels[1], roi_y_pixels[1]),
        (255, 255, 0),
        2,
    )
    cv2.putText(
        overlay,
        "green final validated, orange partition-only",
        (25, 45),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.0,
        (0, 255, 255),
        3,
        cv2.LINE_AA,
    )
    plan_width, plan_height, padding = 1024, 700, 45
    plan = np.full((plan_height, plan_width, 3), 245, dtype=np.uint8)
    if points.shape[0]:
        minimum = np.min(points[:, [0, 2]], axis=0)
        maximum = np.max(points[:, [0, 2]], axis=0)
        depth_low = float(np.percentile(depths, 5))
        depth_high = max(float(np.percentile(depths, 95)), depth_low + 1e-9)
        for point, depth in zip(points, depths):
            x = int(round(
                padding
                + (point[0] - minimum[0])
                / max(maximum[0] - minimum[0], 1e-9)
                * (plan_width - 2 * padding)
            ))
            y = int(round(
                plan_height - padding
                - (point[2] - minimum[1])
                / max(maximum[1] - minimum[1], 1e-9)
                * (plan_height - 2 * padding)
            ))
            normalized = min(max((depth - depth_low) / (depth_high - depth_low), 0.0), 1.0)
            color = (
                int(round(240 * normalized)),
                int(round(190 * (1.0 - normalized))),
                35,
            )
            cv2.circle(plan, (x, y), 3, color, -1)
    cv2.putText(
        plan,
        "validated provider x-z plan, color follows target depth",
        (25, 38),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (20, 20, 20),
        2,
        cv2.LINE_AA,
    )
    overlay = cv2.resize(overlay, (1400, 700), interpolation=cv2.INTER_AREA)
    plan = cv2.resize(plan, (1400, 700), interpolation=cv2.INTER_AREA)
    diagnostic = np.vstack([overlay, plan])
    path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(path), diagnostic):
        raise ValueError(f"Could not write {path}")


def main() -> None:
    args = parse_args()
    manifest = json.loads(args.manifest.read_text())
    calibration = json.loads(args.calibration.read_text())
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Provider-frame calibration is not measurement eligible")
    profile = PROFILE_CONFIGS[args.profile]
    analysis_width = args.analysis_width
    analysis_height = analysis_width // 2
    resolution_scale = analysis_width / DEFAULT_ANALYSIS_WIDTH
    roi_x_pixels = tuple(
        int(round(value * resolution_scale)) for value in BASE_ROI_X_PIXELS
    )
    roi_y_pixels = tuple(
        int(round(value * resolution_scale)) for value in BASE_ROI_Y_PIXELS
    )
    target_seat_id = profile["targetSeatId"]
    training_partner_ids = profile["trainingPartnerSeatIds"]
    holdout_partner_ids = profile["holdoutPartnerSeatIds"]
    final_partner_ids = profile["finalPartnerSeatIds"]
    all_ids = (
        target_seat_id,
        *training_partner_ids,
        *holdout_partner_ids,
        *final_partner_ids,
    )
    if len(set(all_ids)) != len(all_ids):
        raise ValueError("Target and partner partitions overlap")
    entries = {entry["seatId"]: entry for entry in manifest["images"]}
    missing = sorted(set(all_ids) - set(entries))
    if missing:
        raise ValueError(f"Manifest is missing required seats: {missing}")
    image_cache: dict[str, np.ndarray] = {}
    analysis_entries: dict[str, dict[str, Any]] = {}
    image_inputs = []
    for seat_id in all_ids:
        entry = entries[seat_id]
        image_path = Path(entry["localPath"])
        actual_sha256 = file_sha256(image_path)
        if entry.get("imageSha256") not in (None, actual_sha256):
            raise ValueError(f"Image checksum mismatch for {seat_id}")
        source = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
        if source is None:
            raise ValueError(f"Could not read {image_path}")
        resized = cv2.resize(
            source,
            (analysis_width, analysis_height),
            interpolation=cv2.INTER_AREA,
        ).astype(np.float32)
        image_cache[seat_id] = resized
        analysis_entries[seat_id] = {
            **entry,
            "analysisWidth": analysis_width,
            "analysisHeight": analysis_height,
        }
        image_inputs.append({
            "seatId": seat_id,
            "path": str(image_path),
            "sha256": actual_sha256,
        })
    target = analysis_entries[target_seat_id]
    target_image = image_cache[target_seat_id]
    gradient = np.hypot(
        cv2.Sobel(target_image, cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(target_image, cv2.CV_32F, 0, 1, ksize=3),
    )
    coordinate_x, coordinate_y = np.meshgrid(
        np.arange(roi_x_pixels[0], roi_x_pixels[1], args.grid_stride),
        np.arange(roi_y_pixels[0], roi_y_pixels[1], args.grid_stride),
    )
    full_grid_count = coordinate_x.size
    candidate_pixels = np.column_stack([
        coordinate_x.ravel(),
        coordinate_y.ravel(),
    ]).astype(float)
    if args.texture_metric == "center-gradient":
        gradient_values = gradient[
            candidate_pixels[:, 1].astype(int),
            candidate_pixels[:, 0].astype(int),
        ]
        texture_selected = gradient_values >= MINIMUM_GRADIENT
        candidate_pixels = candidate_pixels[texture_selected]
        target_patches = sampled_patches(
            target_image,
            candidate_pixels,
            args.patch_size,
        )
    else:
        full_target_patches = sampled_patches(
            target_image,
            candidate_pixels,
            args.patch_size,
        )
        patch_standard_deviation = np.std(
            full_target_patches,
            axis=(1, 2),
        )
        texture_selected = (
            patch_standard_deviation >= MINIMUM_PATCH_STANDARD_DEVIATION
        )
        candidate_pixels = candidate_pixels[texture_selected]
        target_patches = full_target_patches[texture_selected]
    panorama_directions = panorama_rays(
        candidate_pixels,
        analysis_width,
        analysis_height,
        float(target["config"]["rp"][1]),
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
    training_partners = [analysis_entries[seat_id] for seat_id in training_partner_ids]
    holdout_partners = [analysis_entries[seat_id] for seat_id in holdout_partner_ids]
    final_partners = [analysis_entries[seat_id] for seat_id in final_partner_ids]
    coarse_axis = np.arange(
        MINIMUM_DEPTH_METRES,
        MAXIMUM_DEPTH_METRES + COARSE_DEPTH_STEP_METRES * 0.5,
        COARSE_DEPTH_STEP_METRES,
    )
    outputs: dict[str, list[np.ndarray]] = {
        "trainingDepth": [],
        "holdoutDepth": [],
        "trainingScore": [],
        "holdoutScore": [],
        "trainingProminence": [],
        "holdoutProminence": [],
        "trainingSupport": [],
        "holdoutSupport": [],
        "finalScore": [],
        "finalSupport": [],
        "partitionPassed": [],
        "finalPassed": [],
    }
    target_position = np.asarray(target["config"]["p"], dtype=float)
    for start in range(0, candidate_pixels.shape[0], CHUNK_SIZE):
        stop = min(candidate_pixels.shape[0], start + CHUNK_SIZE)
        directions = provider_directions[start:stop]
        patches = target_patches[start:stop]
        training = best_partition_depths(
            target,
            directions,
            patches,
            training_partners,
            image_cache,
            provider_to_panorama,
            coarse_axis,
            args.patch_size,
            args.refine_depth_step,
        )
        holdout = best_partition_depths(
            target,
            directions,
            patches,
            holdout_partners,
            image_cache,
            provider_to_panorama,
            coarse_axis,
            args.patch_size,
            args.refine_depth_step,
        )
        depth_disagreement = np.abs(training["depth"] - holdout["depth"])
        partition_passed = (
            (training["score"] >= MINIMUM_MEDIAN_ZNCC)
            & (holdout["score"] >= MINIMUM_MEDIAN_ZNCC)
            & (training["prominence"] >= MINIMUM_PEAK_PROMINENCE)
            & (holdout["prominence"] >= MINIMUM_PEAK_PROMINENCE)
            & (training["partnerSupport"] >= MINIMUM_PARTNER_SUPPORT)
            & (holdout["partnerSupport"] >= MINIMUM_PARTNER_SUPPORT)
            & (depth_disagreement <= MAXIMUM_PARTITION_DEPTH_DISAGREEMENT_METRES)
        )
        combined_depth = 0.5 * (training["depth"] + holdout["depth"])
        combined_points = target_position + directions * combined_depth[:, None]
        within_bounds = np.all(
            (combined_points >= PROVIDER_BOUNDS_METRES[:, 0])
            & (combined_points <= PROVIDER_BOUNDS_METRES[:, 1]),
            axis=1,
        )
        partition_passed &= within_bounds
        fixed_depths = combined_depth[:, None]
        final_scores, final_partner_scores = candidate_scores_many(
            fixed_depths,
            target_position,
            directions,
            patches,
            final_partners,
            image_cache,
            provider_to_panorama,
            args.patch_size,
        )
        final_score = final_scores[:, 0]
        final_partner_at_point = np.column_stack([
            scores[:, 0] for scores in final_partner_scores
        ])
        final_support = np.count_nonzero(
            final_partner_at_point >= MINIMUM_PARTNER_ZNCC,
            axis=1,
        )
        final_passed = (
            partition_passed
            & (final_score >= MINIMUM_MEDIAN_ZNCC)
            & (final_support >= MINIMUM_PARTNER_SUPPORT)
        )
        for key, value in (
            ("trainingDepth", training["depth"]),
            ("holdoutDepth", holdout["depth"]),
            ("trainingScore", training["score"]),
            ("holdoutScore", holdout["score"]),
            ("trainingProminence", training["prominence"]),
            ("holdoutProminence", holdout["prominence"]),
            ("trainingSupport", training["partnerSupport"]),
            ("holdoutSupport", holdout["partnerSupport"]),
            ("finalScore", final_score),
            ("finalSupport", final_support),
            ("partitionPassed", partition_passed),
            ("finalPassed", final_passed),
        ):
            outputs[key].append(value)
    combined = {
        key: np.concatenate(parts) if parts else np.empty(0)
        for key, parts in outputs.items()
    }
    combined_depth = 0.5 * (
        combined["trainingDepth"] + combined["holdoutDepth"]
    )
    all_points = target_position + provider_directions * combined_depth[:, None]
    final_mask = combined["finalPassed"].astype(bool)
    partition_mask = combined["partitionPassed"].astype(bool)
    points = all_points[final_mask]
    pixels = candidate_pixels[final_mask]
    depths = combined_depth[final_mask]
    depth_disagreement = np.abs(
        combined["trainingDepth"] - combined["holdoutDepth"]
    )
    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output_npz,
        provider_points_metres=points,
        target_pixels=pixels,
        combined_depth_metres=depths,
        training_depth_metres=combined["trainingDepth"][final_mask],
        holdout_depth_metres=combined["holdoutDepth"][final_mask],
        depth_disagreement_metres=depth_disagreement[final_mask],
        training_median_zncc=combined["trainingScore"][final_mask],
        holdout_median_zncc=combined["holdoutScore"][final_mask],
        final_median_zncc=combined["finalScore"][final_mask],
        training_peak_prominence=combined["trainingProminence"][final_mask],
        holdout_peak_prominence=combined["holdoutProminence"][final_mask],
        training_partner_support=combined["trainingSupport"][final_mask],
        holdout_partner_support=combined["holdoutSupport"][final_mask],
        final_partner_support=combined["finalSupport"][final_mask],
    )
    render_diagnostic(
        args.output_png,
        target_image,
        candidate_pixels,
        partition_mask,
        final_mask,
        points,
        depths,
        roi_x_pixels,
        roi_y_pixels,
    )
    final_point_count_passed = points.shape[0] >= MINIMUM_FINAL_POINT_COUNT
    candidate_eligible = bool(
        final_point_count_passed
        and depth_disagreement[final_mask].size
        and float(np.percentile(depth_disagreement[final_mask], 95))
        <= MAXIMUM_PARTITION_DEPTH_DISAGREEMENT_METRES
    )
    stable = {
        "manifestSha256": file_sha256(args.manifest),
        "calibrationSha256": file_sha256(args.calibration),
        "imageInputs": image_inputs,
        "outputNpzSha256": file_sha256(args.output_npz),
        "outputPngSha256": file_sha256(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "current-provider-model-disjoint-multiview-depth-points",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        "inputs": {
            "manifest": {
                "path": str(args.manifest),
                "sha256": stable["manifestSha256"],
            },
            "calibration": {
                "path": str(args.calibration),
                "sha256": stable["calibrationSha256"],
                "artifactVersion": calibration["artifactVersion"],
            },
            "images": image_inputs,
        },
        "cameraPartitions": {
            "profile": args.profile,
            "targetSeatId": target_seat_id,
            "trainingPartnerSeatIds": list(training_partner_ids),
            "holdoutPartnerSeatIds": list(holdout_partner_ids),
            "finalPartnerSeatIds": list(final_partner_ids),
            "allPartitionsDisjoint": True,
        },
        "parameters": {
            "analysisDimensionsPixels": [analysis_width, analysis_height],
            "semanticRegionPixels": {
                "x": list(roi_x_pixels),
                "y": list(roi_y_pixels),
            },
            "gridStridePixels": args.grid_stride,
            "patchSizePixels": args.patch_size,
            "textureMetric": args.texture_metric,
            "minimumGradient": MINIMUM_GRADIENT,
            "minimumPatchStandardDeviation": MINIMUM_PATCH_STANDARD_DEVIATION,
            "minimumDepthMetres": MINIMUM_DEPTH_METRES,
            "maximumDepthMetres": MAXIMUM_DEPTH_METRES,
            "coarseDepthStepMetres": COARSE_DEPTH_STEP_METRES,
            "refineHalfSpanMetres": REFINE_HALF_SPAN_METRES,
            "refineDepthStepMetres": args.refine_depth_step,
            "prominenceExclusionMetres": PROMINENCE_EXCLUSION_METRES,
            "minimumMedianZncc": MINIMUM_MEDIAN_ZNCC,
            "minimumPartnerZncc": MINIMUM_PARTNER_ZNCC,
            "minimumPartnerSupportPerPartition": MINIMUM_PARTNER_SUPPORT,
            "minimumPeakProminence": MINIMUM_PEAK_PROMINENCE,
            "maximumPartitionDepthDisagreementMetres": MAXIMUM_PARTITION_DEPTH_DISAGREEMENT_METRES,
            "minimumFinalPointCount": MINIMUM_FINAL_POINT_COUNT,
            "providerBoundsMetres": {
                "x": PROVIDER_BOUNDS_METRES[0].tolist(),
                "y": PROVIDER_BOUNDS_METRES[1].tolist(),
                "z": PROVIDER_BOUNDS_METRES[2].tolist(),
            },
            "chunkSize": CHUNK_SIZE,
        },
        "candidateSampling": {
            "fullGridPointCount": int(full_grid_count),
            "gradientCandidateCount": int(candidate_pixels.shape[0]),
            "partitionPassedPointCount": int(np.count_nonzero(partition_mask)),
            "finalPassedPointCount": int(points.shape[0]),
        },
        "crossValidation": {
            "acceptedDepthDisagreementMetres": values_summary(
                depth_disagreement[final_mask]
            ),
            "acceptedTrainingMedianZncc": values_summary(
                combined["trainingScore"][final_mask]
            ),
            "acceptedHoldoutMedianZncc": values_summary(
                combined["holdoutScore"][final_mask]
            ),
            "acceptedFinalMedianZncc": values_summary(
                combined["finalScore"][final_mask]
            ),
            "acceptedTrainingPartnerSupport": values_summary(
                combined["trainingSupport"][final_mask]
            ),
            "acceptedHoldoutPartnerSupport": values_summary(
                combined["holdoutSupport"][final_mask]
            ),
            "acceptedFinalPartnerSupport": values_summary(
                combined["finalSupport"][final_mask]
            ),
        },
        "geometry": {
            "coordinateFrame": "current 3DDV provider-local metres",
            "providerPointCount": int(points.shape[0]),
            "providerXMetres": values_summary(points[:, 0]),
            "providerYMetres": values_summary(points[:, 1]),
            "providerZMetres": values_summary(points[:, 2]),
            "targetDepthMetres": values_summary(depths),
            "npzPath": str(args.output_npz),
            "npzSha256": stable["outputNpzSha256"],
        },
        "semanticScope": {
            "established": "cross-validated visible provider-render surfaces in the fixed section 35 overhead image region",
            "notEstablished": [
                "semantic surface labels",
                "surface connectivity",
                "closed obstruction volumes",
                "physical as-built persistence",
                "any other target view, section, level, or stadium",
            ],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": stable["outputPngSha256"],
        },
        "assessment": {
            "currentProviderModelMultiViewDepthCandidateEligible": candidate_eligible,
            "physicalAsBuiltMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "POINTS_REQUIRE_SEMANTIC_SURFACE_SEGMENTATION",
                "POINTS_DO_NOT_FORM_CLOSED_OCCLUDER_VOLUMES",
                "CURRENT_PROVIDER_RENDER_IS_NOT_PHYSICAL_AS_BUILT_MEASUREMENT",
                "PROVIDER_LOCAL_GEOMETRY_IS_NOT_SUB_FOOT_WORLD_REGISTERED",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "gradientCandidateCount": int(candidate_pixels.shape[0]),
        "partitionPassedPointCount": int(np.count_nonzero(partition_mask)),
        "finalPassedPointCount": int(points.shape[0]),
        "acceptedDepthDisagreementMetres": artifact["crossValidation"]["acceptedDepthDisagreementMetres"],
        "acceptedFinalMedianZncc": artifact["crossValidation"]["acceptedFinalMedianZncc"],
        "currentProviderModelMultiViewDepthCandidateEligible": candidate_eligible,
        "physicalAsBuiltMeasurementEligible": False,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
