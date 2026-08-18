#!/usr/bin/env python3
"""Classify open-roof solar rays by current-panorama surface depth.

The current venue panoramas show the retractable roof closed.  They therefore
cannot be treated as direct sun-visibility photographs for an open-roof game.
This analysis instead uses known camera poses and photometric parallax to
measure the first rendered surface on an exact seat-to-sun ray.  Near surfaces
are fixed bowl structure.  Far surfaces are the movable roof background in its
closed position.  The panels relocate west when open, so a separate surveyed
parked-position model is required before any far ray may be called sun-exposed.
A deliberately unclassified depth
gap prevents the two material classes from being inferred by a single cutoff.

Training and holdout partner cameras are selected before image matching and are
disjoint.  Broadcast shade-boundary pixels are never read by this script.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from collections import OrderedDict
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from renderPanoramaSolarRayReview import project_direction
from validatePanoramaOverhangFrontEdge import project_provider_points


ANALYSIS_VERSION = "open-roof-panorama-first-surface-parallax-envelope-v4"
SOLAR_ANGULAR_RADIUS_DEGREES = 0.2666
SEAT_PATTERN = re.compile(r"^S_([A-Za-z0-9]+)-([A-Za-z0-9]+)-([A-Za-z0-9]+)$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("panorama_calibration", type=Path)
    parser.add_argument("true_north_orientation", type=Path)
    parser.add_argument("event_evidence", type=Path)
    parser.add_argument("solar_windows", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--target-seat-id", action="append", default=[])
    parser.add_argument("--target-row-id", action="append", default=[])
    parser.add_argument("--maximum-width", type=int, default=2048)
    parser.add_argument("--maximum-cached-images", type=int, default=48)
    parser.add_argument("--patch-size", type=int, default=17)
    parser.add_argument("--minimum-depth-metres", type=float, default=1.0)
    parser.add_argument("--maximum-depth-metres", type=float, default=140.0)
    parser.add_argument("--coarse-depth-step-metres", type=float, default=0.25)
    parser.add_argument("--refine-half-span-metres", type=float, default=1.0)
    parser.add_argument("--refine-depth-step-metres", type=float, default=0.02)
    parser.add_argument("--minimum-partner-baseline-metres", type=float, default=0.4)
    parser.add_argument("--maximum-partner-baseline-metres", type=float, default=8.0)
    parser.add_argument("--partner-candidate-count", type=int, default=12)
    parser.add_argument("--minimum-partners-per-partition", type=int, default=3)
    parser.add_argument("--fixed-structure-maximum-depth-metres", type=float, default=25.0)
    parser.add_argument("--movable-roof-minimum-depth-metres", type=float, default=50.0)
    parser.add_argument("--minimum-fixed-peak-score", type=float, default=0.40)
    parser.add_argument("--minimum-movable-peak-score", type=float, default=0.75)
    parser.add_argument("--maximum-fixed-depth-disagreement-metres", type=float, default=0.3048)
    parser.add_argument("--angular-sample-spacing-degrees", type=float, default=0.5)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def verify_input(
    name: str,
    path: Path,
    value: dict[str, Any],
    expected: dict[str, Any],
) -> None:
    actual_sha = sha256_file(path)
    if actual_sha != expected["sha256"]:
        raise ValueError(f"{name} SHA-256 does not match reviewed controls")
    expected_version = expected.get("artifactVersion")
    if expected_version is not None and value.get("artifactVersion") != expected_version:
        raise ValueError(f"{name} artifact version does not match reviewed controls")


def normalized_gray(image: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.float32)
    return gray


def wrapped_patch(
    image: np.ndarray,
    center: tuple[float, float] | np.ndarray,
    patch_size: int,
) -> np.ndarray:
    height, width = image.shape[:2]
    radius = patch_size // 2
    wrapped = np.concatenate([image, image, image], axis=1)
    x_value = float(center[0] % width + width)
    y_value = float(np.clip(center[1], radius + 1, height - radius - 2))
    return cv2.getRectSubPix(wrapped, (patch_size, patch_size), (x_value, y_value))


def sampled_patches(
    image: np.ndarray,
    centers: np.ndarray,
    patch_size: int,
) -> np.ndarray:
    maximum_centers_per_remap = max(1, 30_000 // patch_size)
    if centers.shape[0] > maximum_centers_per_remap:
        return np.concatenate([
            sampled_patches(
                image,
                centers[start:start + maximum_centers_per_remap],
                patch_size,
            )
            for start in range(0, centers.shape[0], maximum_centers_per_remap)
        ])
    height, width = image.shape[:2]
    radius = patch_size // 2
    offsets = np.arange(-radius, radius + 1, dtype=np.float32)
    x_grid = (
        np.mod(centers[:, 0], width)[:, None, None]
        + offsets[None, None, :]
    )
    y_grid = (
        np.clip(centers[:, 1], radius + 1, height - radius - 2)[:, None, None]
        + offsets[None, :, None]
    )
    map_x = np.broadcast_to(
        x_grid, (centers.shape[0], patch_size, patch_size)
    ).astype(np.float32)
    map_y = np.broadcast_to(
        y_grid, (centers.shape[0], patch_size, patch_size)
    ).astype(np.float32)
    patches = cv2.remap(
        image,
        map_x.reshape(-1, patch_size),
        map_y.reshape(-1, patch_size),
        cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_WRAP,
    )
    return patches.reshape(centers.shape[0], patch_size, patch_size)


def zncc_scores(target: np.ndarray, candidates: np.ndarray) -> np.ndarray:
    target_values = target.astype(np.float64)
    target_values -= float(np.mean(target_values))
    target_norm = float(np.linalg.norm(target_values))
    candidate_values = candidates.astype(np.float64)
    candidate_values -= np.mean(candidate_values, axis=(1, 2), keepdims=True)
    candidate_norms = np.linalg.norm(candidate_values, axis=(1, 2))
    denominator = candidate_norms * target_norm
    numerator = np.einsum("nij,ij->n", candidate_values, target_values)
    return np.divide(
        numerator,
        denominator,
        out=np.full(candidate_values.shape[0], -1.0, dtype=float),
        where=denominator > 1e-12,
    )


def zncc_scores_many(targets: np.ndarray, candidates: np.ndarray) -> np.ndarray:
    target_values = targets.astype(np.float64)
    target_values -= np.mean(target_values, axis=(1, 2), keepdims=True)
    target_norms = np.linalg.norm(target_values, axis=(1, 2))
    candidate_values = candidates.astype(np.float64)
    candidate_values -= np.mean(candidate_values, axis=(2, 3), keepdims=True)
    candidate_norms = np.linalg.norm(candidate_values, axis=(2, 3))
    denominator = candidate_norms * target_norms[:, None]
    numerator = np.einsum("dkij,dij->dk", candidate_values, target_values)
    return np.divide(
        numerator,
        denominator,
        out=np.full(candidate_values.shape[:2], -1.0, dtype=float),
        where=denominator > 1e-12,
    )


def angular_difference(first: float, second: float) -> float:
    return (first - second + 180.0) % 360.0 - 180.0


def point_segment_distance(
    point: np.ndarray,
    start: np.ndarray,
    end: np.ndarray,
) -> float:
    delta = end - start
    denominator = float(np.dot(delta, delta))
    if denominator <= 1e-12:
        return float(np.linalg.norm(point - start))
    parameter = float(np.clip(np.dot(point - start, delta) / denominator, 0.0, 1.0))
    return float(np.linalg.norm(point - (start + parameter * delta)))


def swept_solar_envelope_directions(
    solar_samples: list[dict[str, Any]],
    radius_degrees: float,
    spacing_degrees: float,
) -> tuple[list[tuple[float, float]], float]:
    if spacing_degrees <= 0:
        raise ValueError("Angular sample spacing must be positive")
    start_azimuth = float(solar_samples[0]["azimuthDegrees"])
    unwrapped_azimuths = [
        start_azimuth
        + angular_difference(float(sample["azimuthDegrees"]), start_azimuth)
        for sample in solar_samples
    ]
    altitudes = [float(sample["altitudeDegrees"]) for sample in solar_samples]
    representative_altitude = float(np.mean(altitudes))
    cosine_altitude = max(0.05, math.cos(math.radians(representative_altitude)))
    centers = [
        np.asarray([azimuth * cosine_altitude, altitude], dtype=float)
        for azimuth, altitude in zip(unwrapped_azimuths, altitudes)
    ]
    covering_radius = spacing_degrees * math.sqrt(2.0) / 2.0
    expanded_radius = radius_degrees + covering_radius
    azimuth_radius = expanded_radius / cosine_altitude
    azimuth_values = np.arange(
        min(unwrapped_azimuths) - azimuth_radius,
        max(unwrapped_azimuths) + azimuth_radius + spacing_degrees * 0.5,
        spacing_degrees,
    )
    altitude_values = np.arange(
        min(altitudes) - expanded_radius,
        max(altitudes) + expanded_radius + spacing_degrees * 0.5,
        spacing_degrees,
    )
    selected: list[tuple[float, float]] = []
    for altitude in altitude_values:
        for azimuth in azimuth_values:
            point = np.asarray([azimuth * cosine_altitude, altitude], dtype=float)
            distance = min(
                point_segment_distance(point, centers[index], centers[index + 1])
                for index in range(len(centers) - 1)
            )
            if distance <= expanded_radius:
                selected.append((float(azimuth % 360.0), float(altitude)))
    selected.extend(
        (float(azimuth % 360.0), float(altitude))
        for azimuth, altitude in zip(unwrapped_azimuths, altitudes)
    )
    unique = list(dict.fromkeys(
        (round(azimuth, 7), round(altitude, 7))
        for azimuth, altitude in selected
    ))
    return unique, covering_radius


def provider_direction_toward_sun(
    azimuth: float,
    altitude: float,
    x_bearing: float,
    z_bearing: float,
) -> np.ndarray:
    direction = np.asarray([
        math.cos(math.radians(azimuth - x_bearing)),
        math.tan(math.radians(altitude)),
        math.cos(math.radians(azimuth - z_bearing)),
    ], dtype=float)
    return direction / np.linalg.norm(direction)


def candidate_scores(
    depths: np.ndarray,
    target_position: np.ndarray,
    provider_direction: np.ndarray,
    target_patch: np.ndarray,
    partners: list[dict[str, Any]],
    image_cache: dict[str, np.ndarray],
    provider_to_panorama: np.ndarray,
    patch_size: int,
) -> tuple[np.ndarray, list[np.ndarray]]:
    points = target_position[None, :] + depths[:, None] * provider_direction[None, :]
    partner_scores = []
    for partner in partners:
        centers = project_provider_points(
            points,
            np.asarray(partner["config"]["p"], dtype=float),
            provider_to_panorama,
            float(partner["config"]["rp"][1]),
            int(partner["analysisWidth"]),
            int(partner["analysisHeight"]),
        )
        patches = sampled_patches(image_cache[partner["seatId"]], centers, patch_size)
        partner_scores.append(zncc_scores(target_patch, patches))
    stacked = np.stack(partner_scores)
    return np.median(stacked, axis=0), partner_scores


def candidate_scores_many(
    depths: np.ndarray,
    target_position: np.ndarray,
    provider_directions: np.ndarray,
    target_patches: np.ndarray,
    partners: list[dict[str, Any]],
    image_cache: dict[str, np.ndarray],
    provider_to_panorama: np.ndarray,
    patch_size: int,
) -> tuple[np.ndarray, list[np.ndarray]]:
    direction_count, depth_count = depths.shape
    points = (
        target_position[None, None, :]
        + depths[:, :, None] * provider_directions[:, None, :]
    )
    partner_scores = []
    for partner in partners:
        centers = project_provider_points(
            points.reshape(-1, 3),
            np.asarray(partner["config"]["p"], dtype=float),
            provider_to_panorama,
            float(partner["config"]["rp"][1]),
            int(partner["analysisWidth"]),
            int(partner["analysisHeight"]),
        )
        patches = sampled_patches(
            image_cache[partner["seatId"]], centers, patch_size
        ).reshape(direction_count, depth_count, patch_size, patch_size)
        partner_scores.append(zncc_scores_many(target_patches, patches))
    stacked = np.stack(partner_scores)
    return np.median(stacked, axis=0), partner_scores


def estimate_partition_depths(
    target: dict[str, Any],
    partners: list[dict[str, Any]],
    provider_directions: np.ndarray,
    target_patches: np.ndarray,
    image_cache: dict[str, np.ndarray],
    provider_to_panorama: np.ndarray,
    args: argparse.Namespace,
) -> list[dict[str, Any]]:
    direction_count = provider_directions.shape[0]
    coarse_axis = np.arange(
        args.minimum_depth_metres,
        args.maximum_depth_metres + args.coarse_depth_step_metres * 0.5,
        args.coarse_depth_step_metres,
    )
    coarse_depths = np.broadcast_to(
        coarse_axis[None, :], (direction_count, coarse_axis.size)
    )
    coarse_scores, _ = candidate_scores_many(
        coarse_depths,
        np.asarray(target["config"]["p"], dtype=float),
        provider_directions,
        target_patches,
        partners,
        image_cache,
        provider_to_panorama,
        args.patch_size,
    )
    coarse_indices = []
    coarse_selection_rules = []
    fixed_limit_index = int(np.searchsorted(
        coarse_axis,
        args.fixed_structure_maximum_depth_metres,
        side="right",
    ))
    for direction_index in range(direction_count):
        scores = coarse_scores[direction_index]
        fixed_candidates = []
        for candidate_index in range(fixed_limit_index):
            score = float(scores[candidate_index])
            if score < args.minimum_fixed_peak_score:
                continue
            before = float(scores[candidate_index - 1]) if candidate_index > 0 else -1.0
            after = (
                float(scores[candidate_index + 1])
                if candidate_index + 1 < scores.size
                else -1.0
            )
            if score >= before and score >= after:
                fixed_candidates.append(candidate_index)
        if fixed_candidates:
            coarse_indices.append(fixed_candidates[0])
            coarse_selection_rules.append("nearest-qualifying-fixed-local-peak")
        else:
            coarse_indices.append(int(np.argmax(scores)))
            coarse_selection_rules.append("global-maximum-no-qualifying-fixed-local-peak")
    coarse_indices = np.asarray(coarse_indices, dtype=np.int64)
    coarse_best = coarse_axis[coarse_indices]
    refine_offsets = np.arange(
        -args.refine_half_span_metres,
        args.refine_half_span_metres + args.refine_depth_step_metres * 0.5,
        args.refine_depth_step_metres,
    )
    refine_depths = np.clip(
        coarse_best[:, None] + refine_offsets[None, :],
        args.minimum_depth_metres,
        args.maximum_depth_metres,
    )
    refined_scores, partner_scores = candidate_scores_many(
        refine_depths,
        np.asarray(target["config"]["p"], dtype=float),
        provider_directions,
        target_patches,
        partners,
        image_cache,
        provider_to_panorama,
        args.patch_size,
    )
    refined_indices = np.argmax(refined_scores, axis=1)
    results = []
    for direction_index in range(direction_count):
        refined_index = int(refined_indices[direction_index])
        depth = float(refine_depths[direction_index, refined_index])
        peak_score = float(refined_scores[direction_index, refined_index])
        partner_peak_scores = [
            float(values[direction_index, refined_index]) for values in partner_scores
        ]
        if (
            depth <= args.fixed_structure_maximum_depth_metres
            and peak_score >= args.minimum_fixed_peak_score
        ):
            classification = "fixed-structure-occluder"
        elif (
            depth >= args.movable_roof_minimum_depth_metres
            and peak_score >= args.minimum_movable_peak_score
        ):
            classification = "movable-roof-background"
        else:
            classification = "uncertain-depth-or-material"
        results.append({
            "partnerSeatIds": [partner["seatId"] for partner in partners],
            "partnerBaselinesMetres": [
                round(float(partner["baselineMetres"]), 6) for partner in partners
            ],
            "bestDepthMetres": round(depth, 6),
            "coarseBestDepthMetres": round(float(coarse_best[direction_index]), 6),
            "coarseSelectionRule": coarse_selection_rules[direction_index],
            "peakMedianZncc": round(peak_score, 6),
            "partnerZnccAtBestDepth": [round(value, 6) for value in partner_peak_scores],
            "classification": classification,
        })
    return results


def estimate_partition_depth(
    target: dict[str, Any],
    partners: list[dict[str, Any]],
    provider_direction: np.ndarray,
    target_patch: np.ndarray,
    image_cache: dict[str, np.ndarray],
    provider_to_panorama: np.ndarray,
    args: argparse.Namespace,
) -> dict[str, Any]:
    coarse_depths = np.arange(
        args.minimum_depth_metres,
        args.maximum_depth_metres + args.coarse_depth_step_metres * 0.5,
        args.coarse_depth_step_metres,
    )
    coarse_scores, _ = candidate_scores(
        coarse_depths,
        np.asarray(target["config"]["p"], dtype=float),
        provider_direction,
        target_patch,
        partners,
        image_cache,
        provider_to_panorama,
        args.patch_size,
    )
    coarse_index = int(np.argmax(coarse_scores))
    coarse_depth = float(coarse_depths[coarse_index])
    refine_minimum = max(args.minimum_depth_metres, coarse_depth - args.refine_half_span_metres)
    refine_maximum = min(args.maximum_depth_metres, coarse_depth + args.refine_half_span_metres)
    refine_depths = np.arange(
        refine_minimum,
        refine_maximum + args.refine_depth_step_metres * 0.5,
        args.refine_depth_step_metres,
    )
    refined_scores, partner_scores = candidate_scores(
        refine_depths,
        np.asarray(target["config"]["p"], dtype=float),
        provider_direction,
        target_patch,
        partners,
        image_cache,
        provider_to_panorama,
        args.patch_size,
    )
    refined_index = int(np.argmax(refined_scores))
    depth = float(refine_depths[refined_index])
    peak_score = float(refined_scores[refined_index])
    partner_peak_scores = [float(values[refined_index]) for values in partner_scores]
    if (
        depth <= args.fixed_structure_maximum_depth_metres
        and peak_score >= args.minimum_fixed_peak_score
    ):
        classification = "fixed-structure-occluder"
    elif (
        depth >= args.movable_roof_minimum_depth_metres
        and peak_score >= args.minimum_movable_peak_score
    ):
        classification = "movable-roof-background"
    else:
        classification = "uncertain-depth-or-material"
    return {
        "partnerSeatIds": [partner["seatId"] for partner in partners],
        "partnerBaselinesMetres": [round(float(partner["baselineMetres"]), 6) for partner in partners],
        "bestDepthMetres": round(depth, 6),
        "coarseBestDepthMetres": round(coarse_depth, 6),
        "peakMedianZncc": round(peak_score, 6),
        "partnerZnccAtBestDepth": [round(value, 6) for value in partner_peak_scores],
        "classification": classification,
    }


def deterministic_partners(
    target: dict[str, Any],
    images: list[dict[str, Any]],
    args: argparse.Namespace,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    position = np.asarray(target["config"]["p"], dtype=float)
    candidates = []
    for image in images:
        if image["seatId"] == target["seatId"]:
            continue
        baseline = float(np.linalg.norm(np.asarray(image["config"]["p"], dtype=float) - position))
        if not args.minimum_partner_baseline_metres <= baseline <= args.maximum_partner_baseline_metres:
            continue
        candidates.append({**image, "baselineMetres": baseline})
    candidates.sort(key=lambda item: (item["baselineMetres"], item["seatId"]))
    candidates = candidates[: args.partner_candidate_count]
    candidates.sort(
        key=lambda item: hashlib.sha256(
            f"{target['seatId']}|{item['seatId']}|partner-partition-v1".encode("utf-8")
        ).hexdigest()
    )
    training = candidates[::2]
    holdout = candidates[1::2]
    if (
        len(training) < args.minimum_partners_per_partition
        or len(holdout) < args.minimum_partners_per_partition
    ):
        raise ValueError(f"Too few disjoint partner cameras for {target['seatId']}")
    return training, holdout


def main() -> None:
    args = parse_args()
    if args.patch_size < 5 or args.patch_size % 2 == 0:
        raise ValueError("Patch size must be an odd integer of at least five")
    if not args.fixed_structure_maximum_depth_metres < args.movable_roof_minimum_depth_metres:
        raise ValueError("Fixed and movable depth classes require a positive uncertainty gap")
    if args.maximum_cached_images < args.partner_candidate_count + 1:
        raise ValueError(
            "Maximum cached images must hold one target and every selected partner"
        )

    controls = json.loads(args.controls.read_text())
    manifest = json.loads(args.panorama_manifest.read_text())
    calibration = json.loads(args.panorama_calibration.read_text())
    orientation = json.loads(args.true_north_orientation.read_text())
    event_evidence = json.loads(args.event_evidence.read_text())
    solar_windows = json.loads(args.solar_windows.read_text())
    if controls.get("reviewStatus") != "reviewed-open-roof-parallax-envelope-controls":
        raise ValueError("Controls are not reviewed open-roof parallax envelope controls")
    inputs = controls["inputs"]
    verify_input("panoramaManifest", args.panorama_manifest, manifest, inputs["panoramaManifest"])
    verify_input("panoramaCalibration", args.panorama_calibration, calibration, inputs["panoramaCalibration"])
    verify_input("trueNorthOrientation", args.true_north_orientation, orientation, inputs["trueNorthOrientation"])
    verify_input("eventEvidence", args.event_evidence, event_evidence, inputs["eventEvidence"])
    verify_input("solarWindows", args.solar_windows, solar_windows, inputs["solarWindows"])
    if not calibration.get("assessment", {}).get("measurementEligible"):
        raise ValueError("Panorama-frame calibration is not measurement eligible")
    if not orientation.get("assessment", {}).get("globalProviderTrueNorthOrientationMeasurementEligible"):
        raise ValueError("Provider true-north orientation is not measurement eligible")

    candidate_id = controls["event"]["candidateId"]
    candidate = next(
        (item for item in event_evidence["candidates"] if item["candidateId"] == candidate_id),
        None,
    )
    if candidate is None:
        raise ValueError("Reviewed event candidate is absent from event evidence")
    solar_window = next(
        (item for item in solar_windows["candidates"] if item["candidateId"] == candidate_id),
        None,
    )
    if solar_window is None:
        raise ValueError("Reviewed event candidate is absent from solar windows")
    solar_samples = [
        solar_window["solarPositionAtStart"],
        solar_window["solarPositionAtMidpoint"],
        solar_window["solarPositionAtEnd"],
    ]
    midpoint_difference = max(
        abs(
            float(solar_window["solarPositionAtMidpoint"][axis])
            - float(candidate["solarPositionAtMidpoint"][axis])
        )
        for axis in ("azimuthDegrees", "altitudeDegrees")
    )
    if midpoint_difference > 0.011:
        raise ValueError("Candidate and solar-window midpoint positions disagree")
    orientation_uncertainty = float(
        orientation["uncertainty"]["combinedTrueNorthOrientationDegrees"]
    )
    physical_envelope_radius = SOLAR_ANGULAR_RADIUS_DEGREES + orientation_uncertainty
    directions_true, angular_covering_radius = swept_solar_envelope_directions(
        solar_samples,
        physical_envelope_radius,
        args.angular_sample_spacing_degrees,
    )
    x_bearing = float(orientation["orientation"]["providerPositiveXTrueBearingDegrees"])
    z_bearing = float(orientation["orientation"]["providerPositiveZTrueBearingDegrees"])
    provider_directions = np.stack([
        provider_direction_toward_sun(azimuth, altitude, x_bearing, z_bearing)
        for azimuth, altitude in directions_true
    ])
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
    )

    requested = set(args.target_seat_id)
    requested_rows = set(args.target_row_id)
    images = []
    image_cache: OrderedDict[str, np.ndarray] = OrderedDict()
    image_load_count = 0
    peak_cached_image_count = 0
    for item in manifest["images"]:
        if not SEAT_PATTERN.match(item["seatId"]):
            raise ValueError(f"Invalid seat ID {item['seatId']}")
        source_path = Path(item["localPath"])
        if sha256_file(source_path) != item["imageSha256"]:
            raise ValueError(f"Panorama image hash mismatch for {item['seatId']}")
        source_width = int(item["width"])
        source_height = int(item["height"])
        if source_width <= 0 or source_height <= 0:
            raise ValueError(f"Invalid manifest dimensions for {item['seatId']}")
        scale = min(1.0, args.maximum_width / source_width)
        width = int(round(source_width * scale))
        height = int(round(source_height * scale))
        images.append({
            **item,
            "sourcePath": str(source_path),
            "analysisWidth": width,
            "analysisHeight": height,
        })

    images_by_seat = {item["seatId"]: item for item in images}

    def load_gray(seat_id: str) -> np.ndarray:
        nonlocal image_load_count, peak_cached_image_count
        cached = image_cache.get(seat_id)
        if cached is not None:
            image_cache.move_to_end(seat_id)
            return cached
        item = images_by_seat[seat_id]
        source = cv2.imread(item["sourcePath"], cv2.IMREAD_COLOR)
        if source is None:
            raise ValueError(f"Could not load panorama {seat_id}")
        source_height, source_width = source.shape[:2]
        if source_width != int(item["width"]) or source_height != int(item["height"]):
            raise ValueError(f"Decoded panorama dimensions do not match manifest for {seat_id}")
        gray = normalized_gray(cv2.resize(
            source,
            (int(item["analysisWidth"]), int(item["analysisHeight"])),
            interpolation=cv2.INTER_AREA,
        ))
        image_cache[seat_id] = gray
        image_load_count += 1
        while len(image_cache) > args.maximum_cached_images:
            image_cache.popitem(last=False)
        peak_cached_image_count = max(peak_cached_image_count, len(image_cache))
        return gray

    if requested - {item["seatId"] for item in images}:
        raise ValueError("A requested target seat is missing from the manifest")
    available_rows = {
        SEAT_PATTERN.match(item["seatId"]).group(2) for item in images
    }
    if requested_rows - available_rows:
        raise ValueError("A requested target row is missing from the manifest")
    targets = [
        item
        for item in images
        if (
            (not requested and not requested_rows)
            or item["seatId"] in requested
            or SEAT_PATTERN.match(item["seatId"]).group(2) in requested_rows
        )
    ]

    results = []
    for index, target in enumerate(targets):
        training_partners, holdout_partners = deterministic_partners(target, images, args)
        load_gray(target["seatId"])
        for partner in training_partners + holdout_partners:
            load_gray(partner["seatId"])
        target_pixels = np.asarray([
            project_direction(
                provider_direction,
                provider_to_panorama,
                float(target["config"]["rp"][1]),
                int(target["analysisWidth"]),
                int(target["analysisHeight"]),
            )
            for provider_direction in provider_directions
        ])
        target_patches = np.stack([
            wrapped_patch(
                load_gray(target["seatId"]), target_pixel, args.patch_size
            )
            for target_pixel in target_pixels
        ])
        training_samples = estimate_partition_depths(
            target,
            training_partners,
            provider_directions,
            target_patches,
            image_cache,
            provider_to_panorama,
            args,
        )
        holdout_samples = estimate_partition_depths(
            target,
            holdout_partners,
            provider_directions,
            target_patches,
            image_cache,
            provider_to_panorama,
            args,
        )
        sample_results = []
        for direction_index, (training, holdout) in enumerate(
            zip(training_samples, holdout_samples)
        ):
            depth_disagreement = abs(
                training["bestDepthMetres"] - holdout["bestDepthMetres"]
            )
            if (
                training["classification"]
                == holdout["classification"]
                == "fixed-structure-occluder"
            ):
                sample_classification = (
                    "confirmed-fixed-structure-occluder"
                    if depth_disagreement <= args.maximum_fixed_depth_disagreement_metres
                    else "uncertain-fixed-depth-disagreement"
                )
            elif (
                training["classification"]
                == holdout["classification"]
                == "movable-roof-background"
            ):
                sample_classification = "confirmed-movable-roof-background"
            else:
                sample_classification = "uncertain-cross-validation"
            sample_results.append({
                "directionIndex": direction_index,
                "panoramaPixel": [
                    round(float(value), 6) for value in target_pixels[direction_index]
                ],
                "training": training,
                "holdout": holdout,
                "absoluteDepthDisagreementMetres": round(depth_disagreement, 6),
                "classification": sample_classification,
            })
        sample_classifications = [
            sample["classification"] for sample in sample_results
        ]
        if all(
            value == "confirmed-fixed-structure-occluder"
            for value in sample_classifications
        ):
            classification = "confirmed-fixed-structure-occluder-envelope"
        elif all(
            value == "confirmed-movable-roof-background"
            for value in sample_classifications
        ):
            classification = "confirmed-movable-roof-background-envelope"
        else:
            classification = "uncertain-envelope-mixed-or-unresolved"
        results.append({
            "seatId": target["seatId"],
            "cameraProviderPositionMetres": target["config"]["p"],
            "sampleResults": sample_results,
            "sampleClassificationCounts": {
                value: sample_classifications.count(value)
                for value in sorted(set(sample_classifications))
            },
            "classification": classification,
        })
        print(f"Classified {index + 1}/{len(targets)}: {target['seatId']} {classification}", flush=True)

    classifications = [item["classification"] for item in results]
    stable = {
        "inputs": {
            "controls": {"path": str(args.controls), "sha256": sha256_file(args.controls)},
            "panoramaManifest": {"path": str(args.panorama_manifest), **inputs["panoramaManifest"]},
            "panoramaCalibration": {"path": str(args.panorama_calibration), **inputs["panoramaCalibration"]},
            "trueNorthOrientation": {"path": str(args.true_north_orientation), **inputs["trueNorthOrientation"]},
            "eventEvidence": {"path": str(args.event_evidence), **inputs["eventEvidence"]},
            "solarWindows": {"path": str(args.solar_windows), **inputs["solarWindows"]},
        },
        "event": {
            "candidateId": candidate_id,
            "eventWindowSeconds": solar_window["eventWindowSeconds"],
            "solarPositionAtStart": solar_window["solarPositionAtStart"],
            "solarPositionAtMidpoint": solar_window["solarPositionAtMidpoint"],
            "solarPositionAtEnd": solar_window["solarPositionAtEnd"],
            "candidateMidpointSolarMaximumDifferenceDegrees": round(midpoint_difference, 8),
            "angularSamples": [
                {
                    "trueAzimuthDegrees": azimuth,
                    "altitudeDegrees": altitude,
                    "providerUnitDirectionTowardSun": [
                        round(float(value), 12)
                        for value in provider_directions[index]
                    ],
                }
                for index, (azimuth, altitude) in enumerate(directions_true)
            ],
        },
        "parameters": {
            "requestedTargetSeatIds": sorted(requested),
            "requestedTargetRowIds": sorted(requested_rows),
            "maximumWidth": args.maximum_width,
            "maximumCachedImages": args.maximum_cached_images,
            "patchSize": args.patch_size,
            "minimumDepthMetres": args.minimum_depth_metres,
            "maximumDepthMetres": args.maximum_depth_metres,
            "coarseDepthStepMetres": args.coarse_depth_step_metres,
            "refineHalfSpanMetres": args.refine_half_span_metres,
            "refineDepthStepMetres": args.refine_depth_step_metres,
            "minimumPartnerBaselineMetres": args.minimum_partner_baseline_metres,
            "maximumPartnerBaselineMetres": args.maximum_partner_baseline_metres,
            "partnerCandidateCount": args.partner_candidate_count,
            "minimumPartnersPerPartition": args.minimum_partners_per_partition,
            "fixedStructureMaximumDepthMetres": args.fixed_structure_maximum_depth_metres,
            "movableRoofMinimumDepthMetres": args.movable_roof_minimum_depth_metres,
            "unclassifiedDepthGapMetres": [
                args.fixed_structure_maximum_depth_metres,
                args.movable_roof_minimum_depth_metres,
            ],
            "minimumFixedPeakScore": args.minimum_fixed_peak_score,
            "minimumMovablePeakScore": args.minimum_movable_peak_score,
            "maximumFixedDepthDisagreementMetres": args.maximum_fixed_depth_disagreement_metres,
            "solarAngularRadiusDegrees": SOLAR_ANGULAR_RADIUS_DEGREES,
            "trueNorthOrientationUncertaintyDegrees": orientation_uncertainty,
            "physicalEnvelopeRadiusDegrees": physical_envelope_radius,
            "angularSampleSpacingDegrees": args.angular_sample_spacing_degrees,
            "angularGridCoveringRadiusDegrees": angular_covering_radius,
            "expandedSampleEnvelopeRadiusDegrees": (
                physical_envelope_radius + angular_covering_radius
            ),
            "angularSampleCount": len(directions_true),
            "angularEnvelopeRule": (
                "grid samples cover the swept start-to-midpoint-to-end solar-center path, "
                "expanded by the solar radius, true-north uncertainty, and grid covering radius"
            ),
            "partnerPartitionRule": "nearest baseline candidates, then SHA-256 order split into disjoint alternating groups",
            "photometricScore": "median zero-mean normalized cross-correlation across disjoint partner cameras",
            "firstSurfaceSelectionRule": (
                "each camera partition independently selects its nearest local depth peak "
                "at or above the unchanged fixed-material score threshold within the fixed-depth range; "
                "the global maximum is used only when no such near peak exists"
            ),
        },
        "results": results,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "cross-validated-open-roof-solar-ray-surface-depths",
        "artifactVersion": fingerprint(stable),
        **stable,
        "summary": {
            "targetSeatCount": len(results),
            "manifestImageCount": len(images),
            "imageDecodeCount": image_load_count,
            "peakCachedImageCount": peak_cached_image_count,
            "classificationCounts": {
                value: classifications.count(value) for value in sorted(set(classifications))
            },
        },
        "assessment": {
            "openRoofRayDepthDiagnosticEligible": True,
            "publicationEligible": False,
            "blockers": [
                "FIXED_VERSUS_MOVABLE_DEPTH_CLASSES_NOT_YET_VALIDATED_AGAINST_REVIEWED_MATERIAL_HOLDOUTS",
                "ANGULAR_SAMPLE_CONTINUITY_NOT_YET_VALIDATED_AGAINST_REVIEWED_EDGE_HOLDOUTS",
                "INDEPENDENT_BROADCAST_ROW_BOUNDARY_NOT_YET_SCORED",
                *([] if manifest.get("coverage", {}).get("coverageFraction") == 1.0 else [
                    "PANORAMA_MANIFEST_IS_NOT_COMPLETE_SEAT_COVERAGE"
                ]),
                "ONLY_ONE_SECTION_AND_ONE_OBSERVATION_PROCESSED",
            ],
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "summary": artifact["summary"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
