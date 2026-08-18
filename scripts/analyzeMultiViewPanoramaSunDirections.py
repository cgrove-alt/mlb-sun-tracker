#!/usr/bin/env python3
"""Analyze calibrated panorama colors at exact observed solar directions."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageDraw
from pyproj import CRS, Proj

from renderPanoramaSolarRayReview import project_direction


SEAT_PATTERN = re.compile(r"^S_([A-Za-z0-9]+)-([A-Za-z0-9]+)-([A-Za-z0-9]+)$")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def medoid_clusters(samples: np.ndarray, threshold: float) -> list[dict[str, Any]]:
    differences = samples[:, None, :] - samples[None, :, :]
    distances = np.sqrt(np.sum(differences * differences, axis=2))
    remaining = set(range(samples.shape[0]))
    clusters = []
    while remaining:
        ordered = np.asarray(sorted(remaining), dtype=int)
        counts = np.sum(distances[np.ix_(ordered, ordered)] <= threshold, axis=1)
        medoid = int(ordered[int(np.argmax(counts))])
        members = [int(value) for value in ordered if distances[medoid, value] <= threshold]
        remaining -= set(members)
        center = np.median(samples[members], axis=0)
        residuals = np.sqrt(np.sum((samples[members] - center) ** 2, axis=1))
        clusters.append({
            "medoidIndex": medoid,
            "memberIndices": members,
            "count": len(members),
            "fraction": round(len(members) / samples.shape[0], 6),
            "labMedian": [round(float(value), 6) for value in center],
            "residualP95": round(float(np.percentile(residuals, 95)), 6),
        })
    return sorted(clusters, key=lambda item: item["count"], reverse=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("panorama_calibration", type=Path)
    parser.add_argument("true_north_orientation", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("solar_windows", type=Path)
    parser.add_argument("review_queue", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--distance-threshold", type=float, action="append", default=[])
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    thresholds = sorted(set(args.distance_threshold or [2.0, 4.0, 6.0, 8.0, 12.0]))
    manifest = json.loads(args.panorama_manifest.read_text())
    calibration = json.loads(args.panorama_calibration.read_text())
    orientation = json.loads(args.true_north_orientation.read_text())
    raster = json.loads(args.raster_metadata.read_text())
    solar = json.loads(args.solar_windows.read_text())
    review = json.loads(args.review_queue.read_text())
    windows = {item["candidateId"]: item for item in solar["candidates"]}
    reviewed = review["manualReviewQueue"]
    grid = raster["grid"]
    compound_crs = CRS.from_wkt(raster["source"]["coordinateReferenceSystem"])
    horizontal_crs = compound_crs.sub_crs_list[0]
    convergence = float(
        Proj(horizontal_crs).get_factors(
            float(grid["centerLongitude"]), float(grid["centerLatitude"])
        ).meridian_convergence
    )
    provider_x_grid_bearing = float(
        orientation["orientation"]["providerPositiveXTrueBearingDegrees"]
    )
    provider_z_grid_bearing = float(
        orientation["orientation"]["providerPositiveZTrueBearingDegrees"]
    )
    rotation = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
    )
    directions = []
    for item in reviewed:
        midpoint = windows[item["candidateId"]]["solarPositionAtMidpoint"]
        true_azimuth = float(midpoint["azimuthDegrees"])
        directions.append({
            "candidateId": item["candidateId"],
            "expected": item["manualDecision"]["rowBankState"],
            "trueAzimuthDegrees": true_azimuth,
            "gridAzimuthDegrees": (true_azimuth - convergence) % 360.0,
            "altitudeDegrees": float(midpoint["altitudeDegrees"]),
        })

    patch_width = 220
    patch_height = 120
    header_height = 42
    canvas = Image.new(
        "RGB",
        (len(directions) * patch_width, len(manifest["images"]) * (patch_height + header_height)),
        (242, 242, 242),
    )
    canvas_draw = ImageDraw.Draw(canvas)
    color_values: list[list[list[float]]] = [[] for _ in directions]
    image_records = []
    for image_index, entry in enumerate(manifest["images"]):
        match = SEAT_PATTERN.match(entry["seatId"])
        if not match:
            raise ValueError(f"Invalid seat ID {entry['seatId']}")
        source = cv2.imread(entry["localPath"], cv2.IMREAD_COLOR)
        if source is None:
            raise ValueError(f"Could not load panorama {entry['seatId']}")
        source_height, source_width = source.shape[:2]
        scale = min(1.0, args.maximum_width / source_width)
        width = int(round(source_width * scale))
        height = int(round(source_height * scale))
        image = cv2.resize(source, (width, height), interpolation=cv2.INTER_AREA)
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB).astype(np.float32)
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        pixels = []
        labs = []
        for direction_index, direction in enumerate(directions):
            grid_azimuth = direction["gridAzimuthDegrees"]
            altitude = direction["altitudeDegrees"]
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
            wrapped_lab = np.concatenate([lab, lab, lab], axis=1)
            x_wrapped = x_value + width
            lab_patch = wrapped_lab[y_value - 1:y_value + 2, x_wrapped - 1:x_wrapped + 2]
            color = np.median(lab_patch.reshape(-1, 3), axis=0)
            color_values[direction_index].append(color.tolist())
            pixels.append([round(pixel[0], 6), round(pixel[1], 6)])
            labs.append([round(float(value), 6) for value in color])

            crop_width = min(width, patch_width)
            crop_height = min(height, patch_height)
            wrapped_rgb = np.concatenate([rgb, rgb, rgb], axis=1)
            left = int(round(x_value + width - crop_width / 2))
            top = max(0, min(height - crop_height, int(round(y_value - crop_height / 2))))
            crop = Image.fromarray(
                wrapped_rgb[top:top + crop_height, left:left + crop_width]
            )
            crop_draw = ImageDraw.Draw(crop)
            crop_draw.ellipse(
                (crop_width / 2 - 5, y_value - top - 5, crop_width / 2 + 5, y_value - top + 5),
                outline=(255, 200, 0),
                width=3,
            )
            panel_left = direction_index * patch_width
            panel_top = image_index * (patch_height + header_height)
            canvas.paste(crop, (panel_left, panel_top + header_height))
            canvas_draw.text(
                (panel_left + 5, panel_top + 12),
                f"{entry['seatId']}  {direction['expected']}  {altitude:.2f} deg",
                fill=(20, 20, 20),
            )
        image_records.append({
            "seatId": entry["seatId"],
            "sectionId": match.group(1),
            "rowId": match.group(2),
            "seatNumber": match.group(3),
            "panoramaSha256": sha256_file(Path(entry["localPath"])),
            "analysisDimensions": [width, height],
            "panoramaPixels": pixels,
            "sampleLabMedians": labs,
        })
        if (image_index + 1) % 10 == 0 or image_index + 1 == len(manifest["images"]):
            print(f"Sampled {image_index + 1}/{len(manifest['images'])} panoramas", flush=True)

    direction_records = []
    for direction_index, (direction, values) in enumerate(zip(directions, color_values)):
        samples = np.asarray(values, dtype=np.float32)
        direction_records.append({
            **direction,
            "clustersByThreshold": [
                {
                    "labDistanceThreshold": threshold,
                    "clusters": medoid_clusters(samples, threshold),
                }
                for threshold in thresholds
            ],
            "sampleImageRecordOrder": direction_index,
        })

    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(args.output_png, format="PNG", optimize=True)
    input_paths = {
        "panoramaManifest": args.panorama_manifest,
        "panoramaCalibration": args.panorama_calibration,
        "trueNorthOrientation": args.true_north_orientation,
        "rasterMetadata": args.raster_metadata,
        "solarWindows": args.solar_windows,
        "reviewQueue": args.review_queue,
    }
    stable = {
        "inputs": {name: sha256_file(path) for name, path in input_paths.items()},
        "parameters": {
            "maximumWidth": args.maximum_width,
            "labDistanceThresholds": thresholds,
            "samplePatch": "median Lab over 3 by 3 pixels",
        },
        "projection": {
            "meridianConvergenceDegrees": convergence,
            "providerPositiveXGridBearingDegrees": provider_x_grid_bearing,
            "providerPositiveZGridBearingDegrees": provider_z_grid_bearing,
        },
        "images": image_records,
        "directions": direction_records,
        "diagnosticPngSha256": sha256_file(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "calibrated-multi-view-solar-direction-colors-v1",
        "artifactStage": "multi-view-solar-direction-photometric-diagnostic",
        "artifactVersion": fingerprint(stable),
        **stable,
        "diagnosticPng": str(args.output_png),
        "assessment": {
            "publicationEligible": False,
            "blockers": [
                "PHOTOMETRIC_CLUSTERS_NOT_YET_ASSIGNED_SKY_OR_STRUCTURE_SEMANTICS",
                "SOLAR_DISK_AND_UNCERTAINTY_ENVELOPE_NOT_YET_EVALUATED",
                "INDEPENDENT_ROW_BOUNDARY_HOLDOUT_NOT_YET_SCORED",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "imageCount": len(image_records),
        "directions": [
            {
                "expected": item["expected"],
                "altitudeDegrees": item["altitudeDegrees"],
                "largestClusterFractionsByThreshold": [
                    group["clusters"][0]["fraction"] for group in item["clustersByThreshold"]
                ],
            }
            for item in direction_records
        ],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
