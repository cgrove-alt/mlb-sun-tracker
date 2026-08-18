#!/usr/bin/env python3
"""Test a straight overhang front-edge hypothesis against panorama imagery.

The measured underside plane supplies height. A candidate provider-local z
coordinate defines a straight line across the section on that plane. The line
is projected into one training panorama and disjoint holdout panoramas. Image
gradient support is scored independently in each view.

This test only evaluates a straight-edge hypothesis. It does not establish the
side edges, beams, full overhang perimeter, or a closed obstruction volume.
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


ANALYSIS_VERSION = "panorama-overhang-front-edge-hypothesis-v2"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("calibration", type=Path)
    parser.add_argument("surface", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--minimum-provider-z", type=float, default=36.0)
    parser.add_argument("--maximum-provider-z", type=float, default=44.0)
    parser.add_argument("--provider-z-step", type=float, default=0.01)
    parser.add_argument("--provider-x-minimum", type=float, default=-4.0)
    parser.add_argument("--provider-x-maximum", type=float, default=10.0)
    parser.add_argument("--line-samples", type=int, default=281)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--contrast-offset-pixels", type=float, default=8.0)
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


def panorama_entry(stereo_path: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    stereo = json.loads(stereo_path.read_text())
    manifest_path = Path(stereo["inputs"]["manifest"])
    manifest = json.loads(manifest_path.read_text())
    left_seat = stereo["inputs"]["leftSeatId"]
    entry = next(image for image in manifest["images"] if image["seatId"] == left_seat)
    metadata = {
        "stereoPath": str(stereo_path),
        "stereoSha256": file_sha256(stereo_path),
        "stereoArtifactVersion": stereo["artifactVersion"],
        "manifestPath": str(manifest_path),
        "manifestSha256": file_sha256(manifest_path),
        "seatId": left_seat,
        "imagePath": entry["localPath"],
        "imageSha256": file_sha256(Path(entry["localPath"])),
    }
    return entry, metadata


def provider_line(
    provider_z: float,
    provider_x: np.ndarray,
    plane_normal: np.ndarray,
    plane_offset: float,
) -> np.ndarray:
    if abs(float(plane_normal[1])) < 1e-8:
        raise ValueError("Underside plane cannot be solved for provider y")
    provider_y = -(
        plane_normal[0] * provider_x
        + plane_normal[2] * provider_z
        + plane_offset
    ) / plane_normal[1]
    return np.column_stack([
        provider_x,
        provider_y,
        np.full(provider_x.shape, provider_z),
    ])


def project_provider_points(
    points: np.ndarray,
    camera_position: np.ndarray,
    provider_to_panorama: np.ndarray,
    provider_yaw_degrees: float,
    width: int,
    height: int,
) -> np.ndarray:
    deltas = np.asarray(points, dtype=float) - np.asarray(camera_position, dtype=float)
    if not np.all(np.isfinite(deltas)) or not np.all(np.isfinite(provider_to_panorama)):
        raise ValueError("Panorama projection inputs must be finite")
    distances = np.linalg.norm(deltas, axis=1, keepdims=True)
    if np.any(distances <= 1e-12):
        raise ValueError("A panorama projection point coincides with the camera position")
    # OpenCV image operations can leave floating-point status flags set. NumPy
    # may report those stale flags on the next matrix multiplication even when
    # every operand and result is finite. Suppress only that inherited status,
    # then verify the complete projected vector before using it.
    with np.errstate(all="ignore"):
        corrected = (provider_to_panorama @ deltas.T).T / distances
    if not np.all(np.isfinite(corrected)):
        raise ValueError("Panorama projection produced a non-finite direction")
    yaw = math.radians(provider_yaw_degrees)
    cosine = math.cos(yaw)
    sine = math.sin(yaw)
    base = np.empty_like(corrected)
    base[:, 0] = cosine * corrected[:, 0] - sine * corrected[:, 2]
    base[:, 1] = corrected[:, 1]
    base[:, 2] = sine * corrected[:, 0] + cosine * corrected[:, 2]
    longitude = np.arctan2(base[:, 2], base[:, 0])
    latitude = np.arcsin(np.clip(base[:, 1], -1.0, 1.0))
    return np.column_stack([
        (longitude / (2.0 * math.pi) + 0.5) * width,
        (0.5 - latitude / math.pi) * height,
    ])


def bilinear(image: np.ndarray, x: np.ndarray, y: np.ndarray) -> np.ndarray:
    map_x = x.astype(np.float32).reshape(1, -1)
    map_y = y.astype(np.float32).reshape(1, -1)
    sampled = cv2.remap(
        image,
        map_x,
        map_y,
        interpolation=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=float("nan"),
    )
    return sampled.reshape(-1, *image.shape[2:]) if image.ndim == 3 else sampled.reshape(-1)


def load_image_metrics(path: Path, maximum_width: int) -> tuple[np.ndarray, np.ndarray, int, int, float]:
    source = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if source is None:
        raise ValueError(f"Could not read panorama {path}")
    source_height, source_width = source.shape[:2]
    scale = min(1.0, maximum_width / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    image = cv2.resize(source, (width, height), interpolation=cv2.INTER_AREA)
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB).astype(np.float32)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.float32)
    vertical_gradient = np.abs(cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=5))
    vertical_gradient = cv2.GaussianBlur(vertical_gradient, (0, 0), 1.2)
    return lab, vertical_gradient, width, height, scale


def score_candidate(
    pixels: np.ndarray,
    lab: np.ndarray,
    vertical_gradient: np.ndarray,
    contrast_offset: float,
) -> tuple[float, int, float, float]:
    width = lab.shape[1]
    height = lab.shape[0]
    x = pixels[:, 0]
    y = pixels[:, 1]
    valid = (
        (x >= 2)
        & (x < width - 2)
        & (y >= contrast_offset + 2)
        & (y < height - contrast_offset - 2)
        & (y >= 0.22 * height)
        & (y <= 0.62 * height)
    )
    if np.count_nonzero(valid) < 40:
        return -math.inf, int(np.count_nonzero(valid)), math.nan, math.nan
    valid_x = x[valid]
    valid_y = y[valid]
    above = bilinear(lab, valid_x, valid_y - contrast_offset)
    below = bilinear(lab, valid_x, valid_y + contrast_offset)
    contrast = np.linalg.norm(above - below, axis=1)
    gradient = bilinear(vertical_gradient, valid_x, valid_y)
    contrast_score = float(np.percentile(contrast, 65))
    gradient_score = float(np.percentile(gradient, 65))
    score = contrast_score + 0.08 * gradient_score
    return score, int(np.count_nonzero(valid)), contrast_score, gradient_score


def evaluate_view(
    entry: dict[str, Any],
    metadata: dict[str, Any],
    provider_to_panorama: np.ndarray,
    plane_normal: np.ndarray,
    plane_offset: float,
    provider_x: np.ndarray,
    candidates: np.ndarray,
    maximum_width: int,
    contrast_offset: float,
) -> tuple[dict[str, Any], np.ndarray, np.ndarray, list[np.ndarray], np.ndarray]:
    lab, gradient, width, height, scale = load_image_metrics(
        Path(entry["localPath"]),
        maximum_width,
    )
    camera = np.asarray(entry["config"]["p"], dtype=float)
    yaw = float(entry["config"]["rp"][1])
    scores = []
    valid_counts = []
    contrasts = []
    gradients = []
    projected_lines = []
    for provider_z in candidates:
        line = provider_line(provider_z, provider_x, plane_normal, plane_offset)
        pixels = project_provider_points(
            line,
            camera,
            provider_to_panorama,
            yaw,
            width,
            height,
        )
        score, valid_count, contrast_score, gradient_score = score_candidate(
            pixels,
            lab,
            gradient,
            contrast_offset,
        )
        scores.append(score)
        valid_counts.append(valid_count)
        contrasts.append(contrast_score)
        gradients.append(gradient_score)
        projected_lines.append(pixels)
    score_array = np.asarray(scores, dtype=float)
    finite = np.isfinite(score_array)
    if not np.any(finite):
        raise ValueError(f"No valid edge candidates in {entry['seatId']}")
    smoothed = score_array.copy()
    finite_values = np.where(finite, score_array, np.nanmin(score_array[finite]))
    smoothed = cv2.GaussianBlur(finite_values.reshape(-1, 1), (1, 0), 1.5).reshape(-1)
    best_index = int(np.argmax(smoothed))
    top_indices = np.argsort(smoothed)[::-1][:10]
    record = {
        **metadata,
        "sourceDimensions": [int(round(width / scale)), int(round(height / scale))],
        "analysisDimensions": [width, height],
        "providerLocalCameraPositionMetres": [round(float(value), 9) for value in camera],
        "providerPanoramaYawDegrees": yaw,
        "bestProviderZMetres": round(float(candidates[best_index]), 6),
        "bestScore": round(float(smoothed[best_index]), 6),
        "bestValidLineSampleCount": valid_counts[best_index],
        "bestColorContrastP65": round(float(contrasts[best_index]), 6),
        "bestVerticalGradientP65": round(float(gradients[best_index]), 6),
        "topCandidateProviderZMetres": [round(float(candidates[index]), 6) for index in top_indices],
        "topCandidateScores": [round(float(smoothed[index]), 6) for index in top_indices],
    }
    return record, lab.astype(np.uint8), projected_lines[best_index], projected_lines, smoothed


def main() -> None:
    args = parse_args()
    calibration = json.loads(args.calibration.read_text())
    if not calibration["assessment"]["measurementEligible"]:
        raise ValueError("Provider-frame calibration is not measurement eligible")
    surface = json.loads(args.surface.read_text())
    if not surface["assessment"].get("providerLocalOverhangingDeckUndersideMeasurementEligible"):
        raise ValueError("Overhanging deck underside is not measurement eligible")
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"],
        dtype=float,
    )
    plane_normal = np.asarray(
        surface["training"]["plane"]["normalProviderLocal"],
        dtype=float,
    )
    plane_offset = float(surface["training"]["plane"]["offsetMetres"])
    provider_x = np.linspace(
        args.provider_x_minimum,
        args.provider_x_maximum,
        args.line_samples,
    )
    candidates = np.arange(
        args.minimum_provider_z,
        args.maximum_provider_z + args.provider_z_step * 0.5,
        args.provider_z_step,
    )
    source_records = [surface["training"], *surface["holdouts"]]
    views = []
    for source in source_records:
        entry, metadata = panorama_entry(Path(source["path"]))
        views.append((entry, metadata))
    evaluated = [
        evaluate_view(
            entry,
            metadata,
            provider_to_panorama,
            plane_normal,
            plane_offset,
            provider_x,
            candidates,
            args.maximum_width,
            args.contrast_offset_pixels,
        )
        for entry, metadata in views
    ]
    records = [item[0] for item in evaluated]
    training_z = float(records[0]["bestProviderZMetres"])
    training_candidate_index = int(np.argmin(np.abs(candidates - training_z)))
    for record, _, _, _, candidate_scores in evaluated:
        fixed_score = float(candidate_scores[training_candidate_index])
        finite_scores = candidate_scores[np.isfinite(candidate_scores)]
        record["scoreAtTrainingProviderZ"] = round(fixed_score, 6)
        record["scoreAtTrainingProviderZPercentile"] = round(
            100.0 * float(np.mean(finite_scores <= fixed_score)),
            4,
        )
        local = np.abs(candidates - training_z) <= 0.3048
        local_indices = np.flatnonzero(local)
        local_best_index = int(local_indices[np.argmax(candidate_scores[local])])
        record["bestProviderZWithinOneFootOfTrainingMetres"] = round(
            float(candidates[local_best_index]),
            6,
        )
        record["localBestDifferenceFromTrainingMetres"] = round(
            abs(float(candidates[local_best_index]) - training_z),
            6,
        )
    holdout_differences = np.asarray([
        abs(float(record["bestProviderZMetres"]) - training_z)
        for record in records[1:]
    ], dtype=float)

    panels = []
    for record, lab, best_pixels, projected_lines, _ in evaluated:
        image = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
        fixed_pixels = projected_lines[training_candidate_index]
        fixed_valid = np.all(np.isfinite(fixed_pixels), axis=1)
        fixed_polyline = np.round(fixed_pixels[fixed_valid]).astype(np.int32).reshape(-1, 1, 2)
        if fixed_polyline.shape[0] >= 2:
            cv2.polylines(image, [fixed_polyline], False, (255, 255, 0), 4, cv2.LINE_AA)
        valid = np.all(np.isfinite(best_pixels), axis=1)
        polyline = np.round(best_pixels[valid]).astype(np.int32).reshape(-1, 1, 2)
        if polyline.shape[0] >= 2:
            cv2.polylines(image, [polyline], False, (0, 255, 255), 4, cv2.LINE_AA)
        cv2.putText(
            image,
            f"{record['seatId']} fixed={training_z:.2f} m cyan, best={record['bestProviderZMetres']:.2f} m yellow",
            (30, 55),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 255, 255),
            3,
            cv2.LINE_AA,
        )
        panels.append(cv2.resize(image, (1200, 600), interpolation=cv2.INTER_AREA))
    diagnostic = np.vstack(panels)
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_png), diagnostic):
        raise ValueError("Could not write edge diagnostic")

    holdout_pass = bool(
        len(records) >= 3
        and float(np.percentile(holdout_differences, 95)) <= 0.3048
    )
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "provider-local-overhang-front-edge-image-hypothesis",
        "artifactVersion": "sha256:pending",
        "inputs": {
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
        },
        "parameters": {
            "minimumProviderZ": args.minimum_provider_z,
            "maximumProviderZ": args.maximum_provider_z,
            "providerZStep": args.provider_z_step,
            "providerXMinimum": args.provider_x_minimum,
            "providerXMaximum": args.provider_x_maximum,
            "lineSamples": args.line_samples,
            "maximumWidth": args.maximum_width,
            "contrastOffsetPixels": args.contrast_offset_pixels,
            "score": "65th percentile Lab color contrast plus 0.08 times 65th percentile vertical Sobel magnitude",
            "holdoutMaximumP95ProviderZDifferenceMetres": 0.3048,
        },
        "hypothesis": {
            "shape": "straight provider-local constant-z edge on measured underside plane",
            "trainingProviderZMetres": round(training_z, 6),
            "providerXIntervalMetres": [args.provider_x_minimum, args.provider_x_maximum],
        },
        "training": records[0],
        "holdouts": records[1:],
        "holdoutSummary": {
            "absoluteProviderZDifferenceMetres": values_summary(holdout_differences),
            "passed": holdout_pass,
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
            "overlay": "cyan line is the training coordinate projected unchanged; yellow is each view's independently best-scoring candidate",
        },
        "assessment": {
            "straightFrontEdgeImageHypothesisSupported": holdout_pass,
            "publicationEligible": False,
            "blockers": [
                "EDGE_SEGMENTATION_NOT_MANUALLY_ADJUDICATED",
                "SIDE_EDGES_AND_BEAMS_NOT_MEASURED",
                "CLOSED_OBSTRUCTION_VOLUME_NOT_COMPLETE",
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
        "trainingProviderZMetres": round(training_z, 6),
        "holdoutProviderZMetres": [record["bestProviderZMetres"] for record in records[1:]],
        "holdoutDifferenceP95Metres": round(float(np.percentile(holdout_differences, 95)), 6),
        "hypothesisSupported": holdout_pass,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
