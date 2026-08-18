#!/usr/bin/env python3
"""Fit and cross-validate an overhanging deck underside from stereo points.

Each stereo artifact is fitted independently. Holdout plane comparison uses
panoramas that were not used by the training pair. The result remains a
provider-local measurement and never becomes release geometry by itself.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw


ANALYSIS_VERSION = "panorama-overhanging-deck-underside-holdout-v2"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--training-stereo", type=Path, required=True)
    parser.add_argument("--holdout-stereo", type=Path, action="append", default=[])
    parser.add_argument("--plane-threshold-metres", type=float, default=0.03)
    parser.add_argument("--ransac-iterations", type=int, default=20_000)
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


def fit_plane_svd(points: np.ndarray) -> tuple[np.ndarray, float]:
    centroid = np.mean(points, axis=0)
    _, _, right_vectors = np.linalg.svd(points - centroid, full_matrices=False)
    normal = right_vectors[-1]
    normal /= np.linalg.norm(normal)
    if normal[1] < 0:
        normal *= -1
    offset = -float(np.dot(normal, centroid))
    return normal, offset


def fit_plane_ransac(
    points: np.ndarray,
    threshold: float,
    iterations: int,
    seed: int,
) -> tuple[np.ndarray, float, np.ndarray]:
    if points.shape[0] < 12:
        raise ValueError("At least twelve ceiling points are required for a plane fit")
    random = np.random.default_rng(seed)
    best_inliers = np.zeros(points.shape[0], dtype=bool)
    best_score = (-1, math.inf)
    for _ in range(iterations):
        indices = random.choice(points.shape[0], size=3, replace=False)
        first, second, third = points[indices]
        normal = np.cross(second - first, third - first)
        norm = np.linalg.norm(normal)
        if norm < 1e-8:
            continue
        normal /= norm
        offset = -float(np.dot(normal, first))
        residual = np.abs(points @ normal + offset)
        inliers = residual <= threshold
        count = int(np.count_nonzero(inliers))
        score = (count, float(np.median(residual[inliers])) if count else math.inf)
        if score[0] > best_score[0] or (score[0] == best_score[0] and score[1] < best_score[1]):
            best_score = score
            best_inliers = inliers
    if np.count_nonzero(best_inliers) < 12:
        raise ValueError("Plane RANSAC did not find a stable surface")
    normal, offset = fit_plane_svd(points[best_inliers])
    residual = np.abs(points @ normal + offset)
    refined_inliers = residual <= threshold
    if np.count_nonzero(refined_inliers) >= 12:
        normal, offset = fit_plane_svd(points[refined_inliers])
        residual = np.abs(points @ normal + offset)
        refined_inliers = residual <= threshold
    return normal, offset, refined_inliers


def load_points(
    path: Path,
    panorama_to_provider: np.ndarray,
) -> tuple[np.ndarray, list[dict[str, Any]], dict[str, Any]]:
    artifact = json.loads(path.read_text())
    left_position = np.asarray(
        artifact["inputs"]["providerLocalLeftPositionMetres"], dtype=float
    )
    records: list[dict[str, Any]] = []
    points: list[np.ndarray] = []
    for record in artifact["triangulation"].get("sparseCeilingPoints", []):
        if not record.get("highConfidenceLocalSurfacePoint"):
            continue
        panorama_relative = np.asarray(
            record["panoramaFrameMetresRelativeToLeftCamera"], dtype=float
        )
        provider_point = left_position + panorama_to_provider @ panorama_relative
        points.append(provider_point)
        records.append({
            "providerLocalMetres": [round(float(value), 6) for value in provider_point],
            "leftPixel": record["leftPixel"],
            "rightPixel": record["rightPixel"],
            "leftPixelRgb": record["leftPixelRgb"],
            "closestRaySeparationMetres": record["closestRaySeparationMetres"],
        })
    if not points:
        raise ValueError(f"No high-confidence ceiling points in {path}")
    metadata = {
        "path": str(path),
        "sha256": file_sha256(path),
        "artifactVersion": artifact["artifactVersion"],
        "leftSeatId": artifact["inputs"]["leftSeatId"],
        "rightSeatId": artifact["inputs"]["rightSeatId"],
        "pointCount": len(points),
    }
    return np.asarray(points), records, metadata


def plane_record(
    points: np.ndarray,
    records: list[dict[str, Any]],
    metadata: dict[str, Any],
    threshold: float,
    iterations: int,
    seed: int,
) -> tuple[dict[str, Any], np.ndarray, np.ndarray, float]:
    normal, offset, inliers = fit_plane_ransac(points, threshold, iterations, seed)
    residuals = np.abs(points @ normal + offset)
    inlier_points = points[inliers]
    x_span = float(np.ptp(inlier_points[:, 0]))
    y_span = float(np.ptp(inlier_points[:, 1]))
    z_span = float(np.ptp(inlier_points[:, 2]))
    record = {
        **metadata,
        "plane": {
            "normalProviderLocal": [round(float(value), 9) for value in normal],
            "offsetMetres": round(offset, 9),
            "equation": "normal dot providerLocalPoint + offset = 0",
        },
        "inlierCount": int(np.count_nonzero(inliers)),
        "inlierPercent": round(100.0 * np.mean(inliers), 4),
        "inlierAbsoluteResidualMetres": values_summary(residuals[inliers]),
        "allPointAbsoluteResidualMetres": values_summary(residuals),
        "inlierExtentMetres": {
            "providerX": round(x_span, 6),
            "providerY": round(y_span, 6),
            "providerZ": round(z_span, 6),
        },
        "points": [
            {**source_record, "planeInlier": bool(is_inlier)}
            for source_record, is_inlier in zip(records, inliers)
        ],
    }
    return record, inliers, normal, offset


def compare_planes(
    training_normal: np.ndarray,
    training_offset: float,
    holdout_normal: np.ndarray,
    holdout_offset: float,
    reference_point: np.ndarray,
) -> dict[str, float]:
    aligned_normal = holdout_normal.copy()
    aligned_offset = holdout_offset
    if np.dot(training_normal, aligned_normal) < 0:
        aligned_normal *= -1
        aligned_offset *= -1
    cosine = float(np.clip(np.dot(training_normal, aligned_normal), -1.0, 1.0))
    angle = math.degrees(math.acos(cosine))
    separation = abs(float(np.dot(aligned_normal, reference_point) + aligned_offset))
    return {
        "normalAngularDifferenceDegrees": round(angle, 6),
        "surfaceSeparationAtTrainingCentroidMetres": round(separation, 6),
    }


def render_plan(
    output: Path,
    datasets: list[tuple[str, np.ndarray, np.ndarray]],
) -> None:
    all_points = np.vstack([points for _, points, _ in datasets])
    minimum_x, maximum_x = float(np.min(all_points[:, 0])), float(np.max(all_points[:, 0]))
    minimum_z, maximum_z = float(np.min(all_points[:, 2])), float(np.max(all_points[:, 2]))
    width, height, padding = 1600, 1000, 40
    image = Image.new("RGB", (width, height), (245, 246, 248))
    draw = ImageDraw.Draw(image)
    colors = [(20, 90, 220), (230, 70, 45), (20, 150, 95), (170, 80, 190)]
    for dataset_index, (label, points, inliers) in enumerate(datasets):
        color = colors[dataset_index % len(colors)]
        for point, is_inlier in zip(points, inliers):
            x = padding + (point[0] - minimum_x) / max(maximum_x - minimum_x, 1e-6) * (width - 2 * padding)
            y = height - padding - (point[2] - minimum_z) / max(maximum_z - minimum_z, 1e-6) * (height - 2 * padding)
            radius = 4 if is_inlier else 2
            fill = color if is_inlier else tuple(int(channel * 0.45 + 255 * 0.55) for channel in color)
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=fill)
        draw.text((padding, 15 + dataset_index * 20), label, fill=color)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)


def main() -> None:
    args = parse_args()
    if not args.holdout_stereo:
        raise ValueError("At least one --holdout-stereo artifact is required")
    calibration = json.loads(args.calibration.read_text())
    if not calibration["assessment"]["measurementEligible"]:
        raise ValueError("Panorama provider-frame calibration is not measurement eligible")
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"], dtype=float
    )
    training_points, training_sources, training_metadata = load_points(
        args.training_stereo, panorama_to_provider
    )
    training_record, training_inliers, training_normal, training_offset = plane_record(
        training_points,
        training_sources,
        training_metadata,
        args.plane_threshold_metres,
        args.ransac_iterations,
        20260808,
    )
    training_centroid = np.mean(training_points[training_inliers], axis=0)
    holdout_records = []
    rendered_datasets = [("training", training_points, training_inliers)]
    comparisons = []
    for index, path in enumerate(args.holdout_stereo):
        points, sources, metadata = load_points(path, panorama_to_provider)
        record, inliers, normal, offset = plane_record(
            points,
            sources,
            metadata,
            args.plane_threshold_metres,
            args.ransac_iterations,
            20260809 + index,
        )
        comparison = compare_planes(
            training_normal,
            training_offset,
            normal,
            offset,
            training_centroid,
        )
        record["comparisonToTraining"] = comparison
        holdout_records.append(record)
        comparisons.append(comparison)
        rendered_datasets.append((f"holdout {index + 1}", points, inliers))

    render_plan(args.output_png, rendered_datasets)
    angles = np.asarray([item["normalAngularDifferenceDegrees"] for item in comparisons])
    separations = np.asarray([
        item["surfaceSeparationAtTrainingCentroidMetres"] for item in comparisons
    ])
    holdout_pass = bool(
        all(record["inlierCount"] >= 30 for record in holdout_records)
        and float(np.percentile(angles, 95)) <= 1.0
        and float(np.percentile(separations, 95)) <= args.plane_threshold_metres
    )
    parameters = {
        "planeThresholdMetres": args.plane_threshold_metres,
        "ransacIterations": args.ransac_iterations,
        "highConfidenceStereoPointRule": "depth at most 15 metres and ray separation at most 0.02 metres",
        "holdoutMinimumPlaneInliers": 30,
        "holdoutMaximumP95NormalDifferenceDegrees": 1.0,
        "holdoutMaximumP95SurfaceSeparationMetres": args.plane_threshold_metres,
    }
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "provider-local-overhanging-deck-underside-measurement",
        "artifactVersion": "sha256:pending",
        "calibration": {
            "path": str(args.calibration),
            "sha256": file_sha256(args.calibration),
            "artifactVersion": calibration["artifactVersion"],
        },
        "parameters": parameters,
        "semanticScope": {
            "surface": "visible dominant overhead surface sampled by the training and holdout panorama pairs",
            "selection": "upper 42 percent of full spherical panorama plus independent dominant-plane fit",
            "notEstablished": [
                "the physical identity of the fitted dominant overhead surface",
                "overhang perimeter",
                "beam solid volumes",
                "all obstructions in any source section",
                "any other stadium section or level",
            ],
        },
        "training": training_record,
        "holdouts": holdout_records,
        "holdoutSummary": {
            "normalAngularDifferenceDegrees": values_summary(angles),
            "surfaceSeparationAtTrainingCentroidMetres": values_summary(separations),
            "passed": holdout_pass,
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
            "projection": "provider-local x-z plan view",
        },
        "assessment": {
            "providerLocalOverhangingDeckUndersideMeasurementEligible": holdout_pass,
            "publicationEligible": False,
            "blockers": [
                "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
                "OVERHANG_PERIMETER_AND_SOLID_VOLUME_NOT_COMPLETE",
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
        "trainingInliers": training_record["inlierCount"],
        "holdoutInliers": [record["inlierCount"] for record in holdout_records],
        "holdoutNormalDifferenceP95Degrees": round(float(np.percentile(angles, 95)), 6),
        "holdoutSurfaceSeparationP95Metres": round(float(np.percentile(separations, 95)), 6),
        "measurementEligible": holdout_pass,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
