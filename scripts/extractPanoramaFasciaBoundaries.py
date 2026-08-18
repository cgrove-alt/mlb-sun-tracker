#!/usr/bin/env python3
"""Triangulate the top and bottom boundaries of a current opaque fascia band."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from extractPanoramaOpeningBoundary import match_curves, median_filter
from reconstructPanoramaDenseOverhang import values_summary


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def detect_boundary(
    image: np.ndarray,
    x_bounds: tuple[float, float],
    y_bounds: tuple[float, float],
    contrast_offset: int,
    minimum_score: float,
    direction: str,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    height, width = image.shape[:2]
    lab = cv2.GaussianBlur(cv2.cvtColor(image, cv2.COLOR_BGR2LAB).astype(np.float32), (0, 0), 2.0)
    gray = cv2.GaussianBlur(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.float32), (0, 0), 2.0)
    x_values = np.arange(int(round(width * x_bounds[0])), int(round(width * x_bounds[1])) + 1)
    y_values = np.arange(
        max(contrast_offset + 1, int(round(height * y_bounds[0]))),
        min(height - contrast_offset - 2, int(round(height * y_bounds[1]))) + 1,
    )
    above_gray = gray[y_values - contrast_offset][:, x_values]
    below_gray = gray[y_values + contrast_offset][:, x_values]
    above_lab = lab[y_values - contrast_offset][:, x_values]
    below_lab = lab[y_values + contrast_offset][:, x_values]
    signed = below_gray - above_gray
    if direction == "bright-to-dark":
        signed = -signed
    color = np.linalg.norm(below_lab - above_lab, axis=2)
    score = np.maximum(signed, 0.0) + 0.20 * color

    row_count, column_count = score.shape
    transition_limit = 4
    smoothness_penalty = 1.2
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
        best = np.argmax(stacked, axis=0)
        accumulated = score[:, column] + stacked[best, np.arange(row_count)]
        backtrack[:, column] = (best - transition_limit).astype(np.int8)
    indices = np.zeros(column_count, dtype=int)
    indices[-1] = int(np.argmax(accumulated))
    for column in range(column_count - 1, 0, -1):
        indices[column - 1] = indices[column] - int(backtrack[indices[column], column])
    raw_y = y_values[indices].astype(float)
    selected_score = score[indices, np.arange(column_count)]
    smooth_y = median_filter(raw_y, 4)
    valid = (selected_score >= minimum_score) & (np.abs(np.gradient(smooth_y)) <= transition_limit)
    return np.column_stack([x_values.astype(float), smooth_y]), selected_score, valid


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("scene_json", type=Path)
    parser.add_argument("scene_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--left-seat-id", required=True)
    parser.add_argument("--right-seat-id", required=True)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--x-minimum-fraction", type=float, default=0.08)
    parser.add_argument("--x-maximum-fraction", type=float, default=0.28)
    parser.add_argument("--right-x-minimum-fraction", type=float)
    parser.add_argument("--right-x-maximum-fraction", type=float)
    parser.add_argument("--top-y-minimum-fraction", type=float, default=0.25)
    parser.add_argument("--top-y-maximum-fraction", type=float, default=0.35)
    parser.add_argument("--bottom-y-minimum-fraction", type=float, default=0.31)
    parser.add_argument("--bottom-y-maximum-fraction", type=float, default=0.43)
    parser.add_argument("--contrast-offset-pixels", type=int, default=8)
    parser.add_argument("--minimum-transition-score", type=float, default=12.0)
    parser.add_argument("--curve-sample-stride", type=int, default=4)
    parser.add_argument("--right-search-half-width-pixels", type=int, default=160)
    parser.add_argument("--epipolar-threshold", type=float, default=0.0007)
    parser.add_argument("--maximum-ray-separation-metres", type=float, default=0.05)
    parser.add_argument("--maximum-depth-metres", type=float, default=120.0)
    parser.add_argument("--mapping-minimum-depth-metres", type=float, default=20.0)
    parser.add_argument("--mapping-maximum-depth-metres", type=float, default=60.0)
    parser.add_argument("--mapping-minimum-provider-y-metres", type=float, default=15.0)
    parser.add_argument("--mapping-maximum-provider-y-metres", type=float, default=25.0)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    right_x_bounds = (
        args.x_minimum_fraction
        if args.right_x_minimum_fraction is None
        else args.right_x_minimum_fraction,
        args.x_maximum_fraction
        if args.right_x_maximum_fraction is None
        else args.right_x_maximum_fraction,
    )
    manifest = json.loads(args.manifest.read_text())
    calibration = json.loads(args.calibration.read_text())
    scene = json.loads(args.scene_json.read_text())
    if not scene["assessment"].get("knownPoseProviderMetricMeasurementEligible"):
        raise ValueError("Known-pose scene is not measurement eligible")
    if scene["cameraPair"]["leftSeatId"] != args.left_seat_id or scene["cameraPair"]["rightSeatId"] != args.right_seat_id:
        raise ValueError("Scene camera pair differs from requested camera pair")
    images = {item["seatId"]: item for item in manifest["images"]}
    left_entry = images[args.left_seat_id]
    right_entry = images[args.right_seat_id]
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

    with np.load(args.scene_npz, allow_pickle=False) as arrays:
        mapping_left = arrays["left_pixels"]
        mapping_right = arrays["right_pixels"]
        mapping_depth = arrays["left_depth_metres"]
        mapping_provider_points = arrays["provider_points_metres"]
    mapping_roi = (
        (mapping_left[:, 0] >= width * (args.x_minimum_fraction - 0.05))
        & (mapping_left[:, 0] <= width * (args.x_maximum_fraction + 0.05))
        & (mapping_left[:, 1] >= height * (args.top_y_minimum_fraction - 0.05))
        & (mapping_left[:, 1] <= height * (args.bottom_y_maximum_fraction + 0.05))
        & (mapping_depth >= args.mapping_minimum_depth_metres)
        & (mapping_depth <= args.mapping_maximum_depth_metres)
        & (mapping_provider_points[:, 1] >= args.mapping_minimum_provider_y_metres)
        & (mapping_provider_points[:, 1] <= args.mapping_maximum_provider_y_metres)
    )
    mapping_left_x = mapping_left[mapping_roi, 0]
    mapping_right_x = mapping_right[mapping_roi, 0]
    if mapping_left_x.size < 12:
        raise ValueError("Too few known-pose features in the fascia ROI")
    inliers = np.ones(mapping_left_x.size, dtype=bool)
    polynomial = np.polyfit(mapping_left_x, mapping_right_x, 2)
    for _ in range(8):
        polynomial = np.polyfit(mapping_left_x[inliers], mapping_right_x[inliers], 2)
        residual = np.abs(np.polyval(polynomial, mapping_left_x) - mapping_right_x)
        refined = residual <= 16.0
        if np.array_equal(refined, inliers) or np.count_nonzero(refined) < 12:
            break
        inliers = refined
    residual = np.abs(np.polyval(polynomial, mapping_left_x) - mapping_right_x)

    provider_to_panorama = np.asarray(calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float)
    panorama_to_provider = np.asarray(calibration["rotation"]["panoramaVectorToProviderVector"], dtype=float)
    left_position = np.asarray(left_entry["config"]["p"], dtype=float)
    right_position = np.asarray(right_entry["config"]["p"], dtype=float)
    translation = provider_to_panorama @ (right_position - left_position)
    boundaries: dict[str, Any] = {}
    diagnostics = {"left": left.copy(), "right": right.copy()}
    for name, direction, y_bounds, color in [
        (
            "top",
            "dark-to-bright",
            (args.top_y_minimum_fraction, args.top_y_maximum_fraction),
            (0, 255, 255),
        ),
        (
            "bottom",
            "bright-to-dark",
            (args.bottom_y_minimum_fraction, args.bottom_y_maximum_fraction),
            (0, 80, 255),
        ),
    ]:
        left_curve, left_scores, left_valid = detect_boundary(
            left,
            (args.x_minimum_fraction, args.x_maximum_fraction),
            y_bounds,
            args.contrast_offset_pixels,
            args.minimum_transition_score,
            direction,
        )
        right_curve, right_scores, right_valid = detect_boundary(
            right,
            right_x_bounds,
            y_bounds,
            args.contrast_offset_pixels,
            args.minimum_transition_score,
            direction,
        )
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
            polynomial,
            args.curve_sample_stride,
            args.right_search_half_width_pixels,
            args.epipolar_threshold,
            args.maximum_ray_separation_metres,
            args.maximum_depth_metres,
        )
        points = left_position + np.einsum(
            "ij,nj->ni", panorama_to_provider, matched["panoramaPoints"]
        )
        plausible = (
            np.all(np.isfinite(points), axis=1)
            & (points[:, 1] >= 5.0)
            & (points[:, 1] <= 35.0)
        )
        for key in list(matched):
            matched[key] = matched[key][plausible]
        points = points[plausible]
        for curve, valid, panel_name in [
            (left_curve, left_valid, "left"),
            (right_curve, right_valid, "right"),
        ]:
            polyline = np.round(curve[valid]).astype(np.int32).reshape(-1, 1, 2)
            if polyline.shape[0] >= 2:
                cv2.polylines(diagnostics[panel_name], [polyline], False, color, 2, cv2.LINE_AA)
        for point in matched["leftPixels"]:
            cv2.circle(diagnostics["left"], tuple(np.round(point).astype(int)), 3, color, -1)
        for point in matched["rightPixels"]:
            cv2.circle(diagnostics["right"], tuple(np.round(point).astype(int)), 3, color, -1)
        boundaries[name] = {
            "leftValidCurvePointCount": int(np.count_nonzero(left_valid)),
            "rightValidCurvePointCount": int(np.count_nonzero(right_valid)),
            "triangulatedPointCount": int(points.shape[0]),
            "epipolarResidual": values_summary(matched["epipolar"]),
            "raySeparationMetres": values_summary(matched["separation"]),
            "providerXMetres": values_summary(points[:, 0]),
            "providerYMetres": values_summary(points[:, 1]),
            "providerZMetres": values_summary(points[:, 2]),
            "points": [
                {
                    "providerLocalMetres": [round(float(value), 6) for value in point],
                    "leftPixel": [round(float(value), 3) for value in left_pixel],
                    "rightPixel": [round(float(value), 3) for value in right_pixel],
                    "epipolarResidual": round(float(epipolar), 9),
                    "raySeparationMetres": round(float(separation), 6),
                }
                for point, left_pixel, right_pixel, epipolar, separation in zip(
                    points,
                    matched["leftPixels"],
                    matched["rightPixels"],
                    matched["epipolar"],
                    matched["separation"],
                )
            ],
        }

    panel = np.vstack([
        cv2.resize(diagnostics["left"], (1600, 800), interpolation=cv2.INTER_AREA),
        cv2.resize(diagnostics["right"], (1600, 800), interpolation=cv2.INTER_AREA),
    ])
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_png), panel):
        raise ValueError("Could not write fascia-boundary diagnostic")
    eligible = all(
        boundary["triangulatedPointCount"] >= 20
        and boundary["raySeparationMetres"]["p95"] <= args.maximum_ray_separation_metres
        for boundary in boundaries.values()
    )
    stable = {
        "inputs": {
            "manifestSha256": sha256_file(args.manifest),
            "calibrationSha256": sha256_file(args.calibration),
            "sceneJsonSha256": sha256_file(args.scene_json),
            "sceneNpzSha256": sha256_file(args.scene_npz),
        },
        "cameraPair": [args.left_seat_id, args.right_seat_id],
        "boundaries": boundaries,
        "outputPngSha256": sha256_file(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "known-pose-current-fascia-boundaries-v1",
        "artifactStage": "provider-metric-current-fascia-boundary-candidates",
        "artifactVersion": fingerprint(stable),
        "inputs": {
            "manifest": {"path": str(args.manifest), "sha256": stable["inputs"]["manifestSha256"]},
            "calibration": {"path": str(args.calibration), "sha256": stable["inputs"]["calibrationSha256"]},
            "sceneJson": {"path": str(args.scene_json), "sha256": stable["inputs"]["sceneJsonSha256"]},
            "sceneNpz": {"path": str(args.scene_npz), "sha256": stable["inputs"]["sceneNpzSha256"]},
        },
        "cameraPair": {
            "leftSeatId": args.left_seat_id,
            "rightSeatId": args.right_seat_id,
            "baselineMetres": float(np.linalg.norm(right_position - left_position)),
        },
        "knownPoseRightXMapping": {
            "candidateFeatureCount": int(mapping_left_x.size),
            "inlierFeatureCount": int(np.count_nonzero(inliers)),
            "polynomialCoefficients": [round(float(value), 12) for value in polynomial],
            "inlierAbsoluteResidualPixels": values_summary(residual[inliers]),
        },
        "boundaries": boundaries,
        "diagnosticPng": {"path": str(args.output_png), "sha256": stable["outputPngSha256"]},
        "assessment": {
            "pairBoundaryCandidateMeasurementEligible": eligible,
            "publicationEligible": False,
            "blockers": [
                "BOUNDARIES_REQUIRE_DISJOINT_CAMERA_PAIR_CROSS_VALIDATION",
                "BOUNDARIES_NOT_YET_JOINED_INTO_CLOSED_OPAQUE_FASCIA",
                "PROVIDER_FRAME_NOT_YET_REGISTERED_TO_LIDAR_FOR_THIS_TIER",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_YET_PASSED",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "cameraPair": artifact["cameraPair"],
        "knownPoseRightXMapping": artifact["knownPoseRightXMapping"],
        "boundarySummary": {
            name: {
                "pointCount": value["triangulatedPointCount"],
                "raySeparationP95Metres": value["raySeparationMetres"]["p95"],
                "providerYMetres": value["providerYMetres"],
            }
            for name, value in boundaries.items()
        },
        "measurementEligible": eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
