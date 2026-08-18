#!/usr/bin/env python3
"""Classify seat-to-sun rays against current panorama sky visibility.

The classifier uses only panorama pixels and calibrated geometry. Observation
labels are compared after classification and never tune the segmentation.
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
from PIL import Image, ImageDraw
from pyproj import CRS, Proj
from scipy import ndimage

from renderPanoramaSolarRayReview import project_direction


SOLAR_ANGULAR_RADIUS_DEGREES = 0.2666


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def angular_difference(first: float, second: float) -> float:
    return (first - second + 180.0) % 360.0 - 180.0


def top_connected_sky_masks(
    image_bgr: np.ndarray,
    thresholds: list[float],
    seed_fraction: float,
    cluster_count: int,
) -> tuple[list[np.ndarray], list[list[float]]]:
    height, width = image_bgr.shape[:2]
    lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    seed_rows = max(1, int(round(height * seed_fraction)))
    seed = lab[:seed_rows].reshape(-1, 3)
    if seed.shape[0] > 80_000:
        indices = np.linspace(0, seed.shape[0] - 1, 80_000, dtype=int)
        seed = seed[indices]
    cv2.setRNGSeed(20260808)
    _, _, centers = cv2.kmeans(
        seed,
        cluster_count,
        None,
        (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.05),
        5,
        cv2.KMEANS_PP_CENTERS,
    )
    minimum_distance_squared = np.full((height, width), np.inf, dtype=np.float32)
    for center in centers:
        difference = lab - center[None, None, :]
        minimum_distance_squared = np.minimum(
            minimum_distance_squared, np.sum(difference * difference, axis=2)
        )
    minimum_distance = np.sqrt(minimum_distance_squared)
    masks = []
    structure = np.ones((3, 3), dtype=np.uint8)
    for threshold in thresholds:
        candidate = minimum_distance <= threshold
        labels, count = ndimage.label(candidate, structure=structure)
        top_labels = np.unique(labels[0])
        top_labels = top_labels[top_labels != 0]
        connected = np.isin(labels, top_labels) if count else np.zeros_like(candidate)
        masks.append(connected)
    return masks, centers.tolist()


def circular_patch(
    mask: np.ndarray,
    center_x: float,
    center_y: float,
    angular_radius_degrees: float,
) -> np.ndarray:
    height, width = mask.shape
    radius_x = angular_radius_degrees / 360.0 * width
    radius_y = angular_radius_degrees / 180.0 * height
    x_minimum = math.floor(center_x - radius_x) - 1
    x_maximum = math.ceil(center_x + radius_x) + 1
    y_minimum = max(0, math.floor(center_y - radius_y) - 1)
    y_maximum = min(height - 1, math.ceil(center_y + radius_y) + 1)
    values = []
    for y_value in range(y_minimum, y_maximum + 1):
        for x_unwrapped in range(x_minimum, x_maximum + 1):
            normalized = (
                ((x_unwrapped - center_x) / max(radius_x, 1e-9)) ** 2
                + ((y_value - center_y) / max(radius_y, 1e-9)) ** 2
            )
            if normalized <= 1.0:
                values.append(mask[y_value, x_unwrapped % width])
    return np.asarray(values, dtype=bool)


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
    parser.add_argument("--seat-id", action="append", required=True)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--sky-distance-threshold", type=float, action="append", default=[])
    parser.add_argument("--sky-seed-height-fraction", type=float, default=0.12)
    parser.add_argument("--sky-cluster-count", type=int, default=8)
    parser.add_argument("--confirmed-sun-minimum-sky-fraction", type=float, default=0.90)
    parser.add_argument("--confirmed-shade-maximum-sky-fraction", type=float, default=0.05)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    thresholds = sorted(set(args.sky_distance_threshold or [12.0, 18.0, 24.0, 30.0]))
    if not 0.0 <= args.confirmed_shade_maximum_sky_fraction < args.confirmed_sun_minimum_sky_fraction <= 1.0:
        raise ValueError("Invalid sky-fraction classification gates")
    input_paths = {
        "panoramaManifest": args.panorama_manifest,
        "panoramaCalibration": args.panorama_calibration,
        "trueNorthOrientation": args.true_north_orientation,
        "rasterMetadata": args.raster_metadata,
        "solarWindows": args.solar_windows,
        "reviewQueue": args.review_queue,
    }
    input_hashes = {name: sha256_file(path) for name, path in input_paths.items()}
    manifest = json.loads(args.panorama_manifest.read_text())
    calibration = json.loads(args.panorama_calibration.read_text())
    orientation = json.loads(args.true_north_orientation.read_text())
    raster = json.loads(args.raster_metadata.read_text())
    solar = json.loads(args.solar_windows.read_text())
    review = json.loads(args.review_queue.read_text())
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Panorama calibration is not measurement eligible")
    if not orientation["assessment"].get("sectionLocalTrueNorthOrientationMeasurementEligible"):
        raise ValueError("Orientation calibration is not measurement eligible")
    images = {item["seatId"]: item for item in manifest["images"]}
    if any(seat_id not in images for seat_id in args.seat_id):
        raise ValueError("A requested seat panorama is missing")
    windows = {item["candidateId"]: item for item in solar["candidates"]}
    reviewed = review["manualReviewQueue"]
    if any(item["candidateId"] not in windows for item in reviewed):
        raise ValueError("A review observation has no solar-window record")

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
    orientation95 = float(orientation["crossValidation"]["combinedOrientationP95Degrees"])
    rotation = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
    )

    panel_width = 640
    panel_height = 400
    header_height = 55
    canvas = Image.new(
        "RGB",
        (len(reviewed) * panel_width, len(args.seat_id) * (panel_height + header_height)),
        (242, 242, 242),
    )
    canvas_draw = ImageDraw.Draw(canvas)
    results = []
    segmentation_records = []
    for seat_index, seat_id in enumerate(args.seat_id):
        entry = images[seat_id]
        source = cv2.imread(entry["localPath"], cv2.IMREAD_COLOR)
        if source is None:
            raise ValueError(f"Could not load panorama {seat_id}")
        source_height, source_width = source.shape[:2]
        scale = min(1.0, args.maximum_width / source_width)
        width = int(round(source_width * scale))
        height = int(round(source_height * scale))
        image = cv2.resize(source, (width, height), interpolation=cv2.INTER_AREA)
        sky_masks, centers = top_connected_sky_masks(
            image, thresholds, args.sky_seed_height_fraction, args.sky_cluster_count
        )
        segmentation_records.append({
            "seatId": seat_id,
            "panoramaPath": entry["localPath"],
            "panoramaSha256": sha256_file(Path(entry["localPath"])),
            "analysisDimensions": [width, height],
            "skyLabClusterCenters": centers,
            "topConnectedSkyPercentByThreshold": [
                round(float(np.mean(mask) * 100.0), 6) for mask in sky_masks
            ],
        })
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        for observation_index, reviewed_item in enumerate(reviewed):
            window = windows[reviewed_item["candidateId"]]
            solar_samples = [
                window["solarPositionAtStart"],
                window["solarPositionAtMidpoint"],
                window["solarPositionAtEnd"],
            ]
            midpoint = solar_samples[1]
            true_azimuth = float(midpoint["azimuthDegrees"])
            grid_azimuth = (true_azimuth - convergence) % 360.0
            altitude = float(midpoint["altitudeDegrees"])
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
            time_azimuth_bound = max(
                abs(angular_difference(float(item["azimuthDegrees"]), true_azimuth))
                for item in solar_samples
            )
            time_altitude_bound = max(
                abs(float(item["altitudeDegrees"]) - altitude) for item in solar_samples
            )
            total_radius = (
                SOLAR_ANGULAR_RADIUS_DEGREES
                + orientation95
                + time_azimuth_bound
                + time_altitude_bound
            )
            sky_fractions = []
            pixel_counts = []
            for mask in sky_masks:
                patch = circular_patch(mask, pixel[0], pixel[1], total_radius)
                sky_fractions.append(float(np.mean(patch)) if patch.size else 0.0)
                pixel_counts.append(int(patch.size))
            if min(sky_fractions) >= args.confirmed_sun_minimum_sky_fraction:
                classification = "confirmed-sun-visible"
            elif max(sky_fractions) <= args.confirmed_shade_maximum_sky_fraction:
                classification = "confirmed-shade-occluded"
            else:
                classification = "uncertain-sky-boundary"
            expected = reviewed_item["manualDecision"]["rowBankState"]
            comparison = (
                "agree"
                if (expected == "sun" and classification == "confirmed-sun-visible")
                or (expected == "shade" and classification == "confirmed-shade-occluded")
                else "indeterminate"
                if classification == "uncertain-sky-boundary"
                else "disagree"
            )
            results.append({
                "seatId": seat_id,
                "candidateId": reviewed_item["candidateId"],
                "manualObservedRowBankState": expected,
                "classification": classification,
                "comparison": comparison,
                "midpointTrueAzimuthDegrees": round(true_azimuth, 6),
                "midpointGridAzimuthDegrees": round(grid_azimuth, 6),
                "midpointAltitudeDegrees": round(altitude, 6),
                "panoramaPixel": [round(pixel[0], 6), round(pixel[1], 6)],
                "angularEnvelopeRadiusDegrees": round(total_radius, 6),
                "skyFractionsByThreshold": [round(value, 6) for value in sky_fractions],
                "evaluatedPixelCounts": pixel_counts,
            })

            radius_pixels = max(
                total_radius / 360.0 * width,
                total_radius / 180.0 * height,
            )
            crop_width = min(width, panel_width)
            crop_height = min(height, panel_height)
            doubled = np.concatenate([rgb, rgb, rgb], axis=1)
            shifted_x = pixel[0] + width
            left = int(round(shifted_x - crop_width / 2))
            top = max(0, min(height - crop_height, int(round(pixel[1] - crop_height / 2))))
            crop = Image.fromarray(doubled[top:top + crop_height, left:left + crop_width])
            crop_draw = ImageDraw.Draw(crop)
            center = (crop_width / 2, pixel[1] - top)
            color = {
                "confirmed-sun-visible": (0, 205, 100),
                "confirmed-shade-occluded": (255, 70, 35),
                "uncertain-sky-boundary": (255, 190, 0),
            }[classification]
            crop_draw.ellipse(
                (
                    center[0] - radius_pixels,
                    center[1] - radius_pixels,
                    center[0] + radius_pixels,
                    center[1] + radius_pixels,
                ),
                outline=color,
                width=4,
            )
            panel_left = observation_index * panel_width
            panel_top = seat_index * (panel_height + header_height)
            canvas.paste(crop, (panel_left, panel_top + header_height))
            canvas_draw.text(
                (panel_left + 10, panel_top + 16),
                f"{seat_id}  {classification}  {comparison}",
                fill=(20, 20, 20),
            )

    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(args.output_png, format="PNG", optimize=True)
    classifications = [item["classification"] for item in results]
    comparisons = [item["comparison"] for item in results]
    stable = {
        "inputs": input_hashes,
        "seatIds": args.seat_id,
        "parameters": {
            "maximumWidth": args.maximum_width,
            "skyDistanceThresholds": thresholds,
            "skySeedHeightFraction": args.sky_seed_height_fraction,
            "skyClusterCount": args.sky_cluster_count,
            "solarAngularRadiusDegrees": SOLAR_ANGULAR_RADIUS_DEGREES,
            "orientation95Degrees": orientation95,
            "confirmedSunMinimumSkyFraction": args.confirmed_sun_minimum_sky_fraction,
            "confirmedShadeMaximumSkyFraction": args.confirmed_shade_maximum_sky_fraction,
            "segmentationRule": "Lab sky clusters learned only from zenith seeds, then restricted to top-connected components",
        },
        "results": results,
        "outputPngSha256": sha256_file(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "current-panorama-solar-disk-occlusion-v1",
        "artifactStage": "current-seat-panorama-sun-visibility-diagnostic",
        "artifactVersion": fingerprint(stable),
        "inputs": {
            name: {"path": str(path), "sha256": input_hashes[name]}
            for name, path in input_paths.items()
        },
        "parameters": stable["parameters"],
        "projection": {
            "meridianConvergenceDegrees": convergence,
            "providerPositiveXGridBearingDegrees": provider_x_grid_bearing,
            "providerPositiveZGridBearingDegrees": provider_z_grid_bearing,
        },
        "segmentations": segmentation_records,
        "results": results,
        "summary": {
            "seatCount": len(args.seat_id),
            "observationCount": len(reviewed),
            "classificationCounts": {
                value: classifications.count(value) for value in sorted(set(classifications))
            },
            "comparisonCounts": {
                value: comparisons.count(value) for value in sorted(set(comparisons))
            },
        },
        "diagnosticPng": {"path": str(args.output_png), "sha256": stable["outputPngSha256"]},
        "assessment": {
            "measurementEligibleDiagnostic": True,
            "publicationEligible": False,
            "blockers": [
                "SKY_SEGMENTATION_THRESHOLDS_NOT_YET_CROSS_VALIDATED_ON_DISJOINT_PANORAMAS",
                "ONLY_SIX_D_E_SEATS_CLASSIFIED",
                "INDEPENDENT_ROW_BOUNDARY_HOLDOUT_NOT_YET_SCORED",
                "FULL_STADIUM_PANORAMA_COVERAGE_NOT_COMPLETE",
            ],
            "interpretation": (
                "Confirmed shade requires the complete solar disk and geometry envelope to remain "
                "non-sky in every segmentation variant. Confirmed sun requires at least 90 percent "
                "sky in every variant. Observation labels are used only for post hoc comparison."
            ),
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "parameters": artifact["parameters"],
        "summary": artifact["summary"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
