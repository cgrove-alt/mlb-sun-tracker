#!/usr/bin/env python3
"""Measure whether calibrated venue panoramas share a stable sky background."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from renderPanoramaSolarRayReview import project_direction


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def largest_distance_component(samples: np.ndarray, threshold: float) -> list[int]:
    differences = samples[:, None, :] - samples[None, :, :]
    distances = np.sqrt(np.sum(differences * differences, axis=2))
    adjacency = distances <= threshold
    remaining = set(range(samples.shape[0]))
    components: list[list[int]] = []
    while remaining:
        seed = remaining.pop()
        component = [seed]
        stack = [seed]
        while stack:
            current = stack.pop()
            neighbors = set(np.flatnonzero(adjacency[current]).tolist()) & remaining
            remaining -= neighbors
            component.extend(neighbors)
            stack.extend(neighbors)
        components.append(component)
    return max(components, key=len)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("panorama_calibration", type=Path)
    parser.add_argument("true_north_orientation", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--azimuth-step-degrees", type=float, default=10.0)
    parser.add_argument("--altitude-degrees", type=float, action="append", default=[])
    parser.add_argument("--distance-threshold", type=float, action="append", default=[])
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    altitudes = args.altitude_degrees or [35.0, 45.0, 55.0, 65.0, 75.0]
    thresholds = sorted(set(args.distance_threshold or [2.0, 4.0, 6.0, 8.0, 12.0, 16.0]))
    if args.maximum_width < 512:
        raise ValueError("maximum width must be at least 512 pixels")
    manifest = json.loads(args.panorama_manifest.read_text())
    calibration = json.loads(args.panorama_calibration.read_text())
    orientation = json.loads(args.true_north_orientation.read_text())
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Panorama calibration is not measurement eligible")
    if not orientation["assessment"].get("sectionLocalTrueNorthOrientationMeasurementEligible"):
        raise ValueError("Orientation calibration is not measurement eligible")
    provider_x_grid_bearing = float(
        orientation["orientation"]["providerPositiveXTrueBearingDegrees"]
    )
    provider_z_grid_bearing = float(
        orientation["orientation"]["providerPositiveZTrueBearingDegrees"]
    )
    rotation = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
    )
    azimuths = np.arange(0.0, 360.0, args.azimuth_step_degrees)
    directions = [
        (float(azimuth), float(altitude))
        for altitude in altitudes
        for azimuth in azimuths
    ]
    colors_by_direction: list[list[list[float]]] = [[] for _ in directions]
    image_records = []
    for index, entry in enumerate(manifest["images"]):
        source = cv2.imread(entry["localPath"], cv2.IMREAD_COLOR)
        if source is None:
            raise ValueError(f"Could not load panorama {entry['seatId']}")
        source_height, source_width = source.shape[:2]
        scale = min(1.0, args.maximum_width / source_width)
        width = int(round(source_width * scale))
        height = int(round(source_height * scale))
        image = cv2.resize(source, (width, height), interpolation=cv2.INTER_AREA)
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB).astype(np.float32)
        for direction_index, (grid_azimuth, altitude) in enumerate(directions):
            provider_direction = np.asarray([
                math.cos(math.radians(grid_azimuth - provider_x_grid_bearing)),
                math.tan(math.radians(altitude)),
                math.cos(math.radians(grid_azimuth - provider_z_grid_bearing)),
            ])
            pixel = project_direction(
                provider_direction,
                rotation,
                float(entry["config"]["rp"][1]),
                width,
                height,
            )
            x_value = int(round(pixel[0])) % width
            y_value = max(1, min(height - 2, int(round(pixel[1]))))
            patch = lab[y_value - 1:y_value + 2, x_value - 1:x_value + 2]
            if patch.shape[1] != 3:
                wrapped = np.concatenate([lab, lab, lab], axis=1)
                x_wrapped = x_value + width
                patch = wrapped[y_value - 1:y_value + 2, x_wrapped - 1:x_wrapped + 2]
            colors_by_direction[direction_index].append(
                np.median(patch.reshape(-1, 3), axis=0).tolist()
            )
        image_records.append({
            "seatId": entry["seatId"],
            "panoramaSha256": sha256_file(Path(entry["localPath"])),
            "analysisDimensions": [width, height],
        })
        if (index + 1) % 10 == 0 or index + 1 == len(manifest["images"]):
            print(f"Sampled {index + 1}/{len(manifest['images'])} panoramas", flush=True)

    direction_records = []
    for (grid_azimuth, altitude), values in zip(directions, colors_by_direction):
        samples = np.asarray(values, dtype=np.float32)
        by_threshold = []
        for threshold in thresholds:
            component = largest_distance_component(samples, threshold)
            component_samples = samples[component]
            center = np.median(component_samples, axis=0)
            residuals = np.sqrt(np.sum((component_samples - center) ** 2, axis=1))
            by_threshold.append({
                "labDistanceThreshold": threshold,
                "largestComponentCount": len(component),
                "largestComponentFraction": round(len(component) / len(samples), 6),
                "largestComponentLabMedian": [round(float(value), 6) for value in center],
                "largestComponentResidualP95": round(float(np.percentile(residuals, 95)), 6),
            })
        direction_records.append({
            "gridAzimuthDegrees": grid_azimuth,
            "altitudeDegrees": altitude,
            "clustersByThreshold": by_threshold,
        })

    summaries = []
    for threshold_index, threshold in enumerate(thresholds):
        fractions = np.asarray([
            item["clustersByThreshold"][threshold_index]["largestComponentFraction"]
            for item in direction_records
        ])
        residuals = np.asarray([
            item["clustersByThreshold"][threshold_index]["largestComponentResidualP95"]
            for item in direction_records
        ])
        summaries.append({
            "labDistanceThreshold": threshold,
            "largestComponentFractionMedian": round(float(np.median(fractions)), 6),
            "largestComponentFractionP05": round(float(np.percentile(fractions, 5)), 6),
            "directionsWithAtLeast80PercentSupport": int(np.sum(fractions >= 0.8)),
            "directionCount": int(fractions.size),
            "withinComponentResidualP95Median": round(float(np.median(residuals)), 6),
            "withinComponentResidualP95P95": round(float(np.percentile(residuals, 95)), 6),
        })
    stable = {
        "inputs": {
            "panoramaManifestSha256": sha256_file(args.panorama_manifest),
            "panoramaCalibrationSha256": sha256_file(args.panorama_calibration),
            "trueNorthOrientationSha256": sha256_file(args.true_north_orientation),
        },
        "parameters": {
            "maximumWidth": args.maximum_width,
            "azimuthStepDegrees": args.azimuth_step_degrees,
            "altitudeDegrees": altitudes,
            "labDistanceThresholds": thresholds,
            "samplePatch": "median Lab over 3 by 3 pixels",
        },
        "images": image_records,
        "directions": direction_records,
        "summaryByThreshold": summaries,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "calibrated-multi-view-sky-consistency-v1",
        "artifactStage": "multi-view-panorama-background-consistency-diagnostic",
        "artifactVersion": fingerprint(stable),
        **stable,
        "assessment": {
            "publicationEligible": False,
            "blockers": [
                "PHOTOMETRIC_CLUSTER_SEMANTICS_NOT_YET_HUMAN_VALIDATED",
                "ONLY_PHILLIES_D_E_ROW_BANK_SAMPLED",
                "SUN_RAY_OCCLUSION_CLASSIFIER_NOT_YET_CROSS_VALIDATED",
            ],
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "imageCount": len(image_records),
        "directionCount": len(direction_records),
        "summaryByThreshold": summaries,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
