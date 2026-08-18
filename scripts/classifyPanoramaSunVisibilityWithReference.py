#!/usr/bin/env python3
"""Classify solar visibility by matching seat panoramas to a calibrated sky reference."""

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


def projected_pixel(
    grid_azimuth: float,
    altitude: float,
    provider_x_grid_bearing: float,
    provider_z_grid_bearing: float,
    rotation: np.ndarray,
    yaw: float,
    width: int,
    height: int,
) -> tuple[float, float]:
    provider_direction = np.asarray([
        math.cos(math.radians(grid_azimuth - provider_x_grid_bearing)),
        math.tan(math.radians(altitude)),
        math.cos(math.radians(grid_azimuth - provider_z_grid_bearing)),
    ])
    return project_direction(provider_direction, rotation, yaw, width, height)


def extract_patch(image: np.ndarray, center_x: float, center_y: float, size: int) -> np.ndarray:
    height, width = image.shape[:2]
    wrapped = np.concatenate([image, image, image], axis=1)
    center = (float(center_x % width + width), float(max(0.0, min(height - 1.0, center_y))))
    return cv2.getRectSubPix(wrapped, (size, size), center).astype(np.float32)


def swept_disk_directions(
    solar_samples: list[dict[str, Any]],
    radius_degrees: float,
    spacing_degrees: float,
) -> list[tuple[float, float]]:
    start_azimuth = float(solar_samples[0]["azimuthDegrees"])
    unwrapped_azimuths = [
        start_azimuth
        + angular_difference(float(sample["azimuthDegrees"]), start_azimuth)
        for sample in solar_samples
    ]
    altitudes = [float(sample["altitudeDegrees"]) for sample in solar_samples]
    azimuth_radius = max(
        radius_degrees / max(0.05, math.cos(math.radians(altitude)))
        for altitude in altitudes
    )
    minimum_azimuth = min(unwrapped_azimuths) - azimuth_radius
    maximum_azimuth = max(unwrapped_azimuths) + azimuth_radius
    minimum_altitude = min(altitudes) - radius_degrees
    maximum_altitude = max(altitudes) + radius_degrees
    azimuth_values = np.arange(
        minimum_azimuth,
        maximum_azimuth + spacing_degrees * 0.5,
        spacing_degrees,
    )
    altitude_values = np.arange(
        minimum_altitude,
        maximum_altitude + spacing_degrees * 0.5,
        spacing_degrees,
    )
    centers = list(zip(unwrapped_azimuths, altitudes))
    selected = []
    for altitude in altitude_values:
        cosine_altitude = max(0.05, math.cos(math.radians(altitude)))
        for azimuth in azimuth_values:
            distance = min(
                math.hypot((azimuth - center_azimuth) * cosine_altitude, altitude - center_altitude)
                for center_azimuth, center_altitude in centers
            )
            if distance <= radius_degrees:
                selected.append((float(azimuth % 360.0), float(altitude)))
    for azimuth, altitude in centers:
        selected.append((float(azimuth % 360.0), float(altitude)))
    return list(dict.fromkeys((round(azimuth, 7), round(altitude, 7)) for azimuth, altitude in selected))


def load_analysis_image(entry: dict[str, Any], maximum_width: int) -> np.ndarray:
    source = cv2.imread(entry["localPath"], cv2.IMREAD_COLOR)
    if source is None:
        raise ValueError(f"Could not load panorama {entry['seatId']}")
    source_height, source_width = source.shape[:2]
    scale = min(1.0, maximum_width / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    resized = cv2.resize(source, (width, height), interpolation=cv2.INTER_AREA)
    return cv2.cvtColor(resized, cv2.COLOR_BGR2LAB)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("target_manifest", type=Path)
    parser.add_argument("reference_manifest", type=Path)
    parser.add_argument("panorama_calibration", type=Path)
    parser.add_argument("true_north_orientation", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("solar_windows", type=Path)
    parser.add_argument("review_queue", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--patch-size", type=int, default=5)
    parser.add_argument("--angular-sample-spacing-degrees", type=float, default=0.07)
    parser.add_argument("--lab-p95-threshold", type=float, action="append", default=[])
    parser.add_argument("--reference-agreement-p95-maximum", type=float, default=2.5)
    parser.add_argument("--confirmed-sun-minimum-fraction", type=float, default=0.95)
    parser.add_argument("--confirmed-shade-maximum-fraction", type=float, default=0.05)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    thresholds = sorted(set(args.lab_p95_threshold or [2.0, 3.0, 4.0]))
    if args.patch_size < 3 or args.patch_size % 2 == 0:
        raise ValueError("patch size must be an odd integer of at least 3")
    target_manifest = json.loads(args.target_manifest.read_text())
    reference_manifest = json.loads(args.reference_manifest.read_text())
    calibration = json.loads(args.panorama_calibration.read_text())
    orientation = json.loads(args.true_north_orientation.read_text())
    raster = json.loads(args.raster_metadata.read_text())
    solar = json.loads(args.solar_windows.read_text())
    review = json.loads(args.review_queue.read_text())
    if len(reference_manifest["images"]) < 3:
        raise ValueError("At least three reference panoramas are required")
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
    orientation95 = float(orientation["crossValidation"]["combinedOrientationP95Degrees"])
    rotation = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"], dtype=float
    )
    envelope_radius = SOLAR_ANGULAR_RADIUS_DEGREES + orientation95
    observations = []
    for item in reviewed:
        window = windows[item["candidateId"]]
        solar_samples = [
            window["solarPositionAtStart"],
            window["solarPositionAtMidpoint"],
            window["solarPositionAtEnd"],
        ]
        directions = swept_disk_directions(
            solar_samples, envelope_radius, args.angular_sample_spacing_degrees
        )
        observations.append({
            "candidateId": item["candidateId"],
            "expected": item["manualDecision"]["rowBankState"],
            "directionsTrue": directions,
            "directionsGrid": [((azimuth - convergence) % 360.0, altitude) for azimuth, altitude in directions],
            "sampleCount": len(directions),
        })

    reference_patches: list[list[list[np.ndarray]]] = [
        [[] for _ in observation["directionsGrid"]] for observation in observations
    ]
    reference_records = []
    for entry in reference_manifest["images"]:
        image = load_analysis_image(entry, args.maximum_width)
        height, width = image.shape[:2]
        observation_patches = []
        for observation_index, observation in enumerate(observations):
            patches = []
            for direction_index, (grid_azimuth, altitude) in enumerate(observation["directionsGrid"]):
                pixel = projected_pixel(
                    grid_azimuth,
                    altitude,
                    provider_x_grid_bearing,
                    provider_z_grid_bearing,
                    rotation,
                    float(entry["config"]["rp"][1]),
                    width,
                    height,
                )
                patch = extract_patch(image, pixel[0], pixel[1], args.patch_size)
                reference_patches[observation_index][direction_index].append(patch)
                patches.append([round(pixel[0], 6), round(pixel[1], 6)])
            observation_patches.append(patches)
        reference_records.append({
            "seatId": entry["seatId"],
            "panoramaSha256": sha256_file(Path(entry["localPath"])),
            "analysisDimensions": [width, height],
            "projectedPixelsByObservation": observation_patches,
        })

    reference_models = []
    for observation_index, observation in enumerate(observations):
        models = []
        for direction_index, patches in enumerate(reference_patches[observation_index]):
            stack = np.stack(patches).astype(np.float32)
            median = np.median(stack, axis=0)
            residuals = np.sqrt(np.sum((stack - median[None, :, :, :]) ** 2, axis=3))
            per_reference_p95 = np.percentile(residuals.reshape(residuals.shape[0], -1), 95, axis=1)
            agreement_p95 = float(np.max(per_reference_p95))
            models.append({
                "median": median,
                "referenceAgreementP95": agreement_p95,
                "valid": agreement_p95 <= args.reference_agreement_p95_maximum,
            })
        reference_models.append(models)

    results = []
    panel_width = 150
    panel_height = 64
    canvas = Image.new(
        "RGB",
        (len(observations) * panel_width, len(target_manifest["images"]) * panel_height),
        (245, 245, 245),
    )
    canvas_draw = ImageDraw.Draw(canvas)
    for target_index, entry in enumerate(target_manifest["images"]):
        image = load_analysis_image(entry, args.maximum_width)
        height, width = image.shape[:2]
        for observation_index, observation in enumerate(observations):
            distances = []
            reference_valid = []
            for (grid_azimuth, altitude), model in zip(
                observation["directionsGrid"], reference_models[observation_index]
            ):
                pixel = projected_pixel(
                    grid_azimuth,
                    altitude,
                    provider_x_grid_bearing,
                    provider_z_grid_bearing,
                    rotation,
                    float(entry["config"]["rp"][1]),
                    width,
                    height,
                )
                patch = extract_patch(image, pixel[0], pixel[1], args.patch_size)
                residual = np.sqrt(np.sum((patch - model["median"]) ** 2, axis=2))
                distances.append(float(np.percentile(residual, 95)))
                reference_valid.append(bool(model["valid"]))
            valid_count = sum(reference_valid)
            valid_fraction = valid_count / len(reference_valid)
            sky_fractions = []
            for threshold in thresholds:
                matched = [
                    distance <= threshold
                    for distance, valid in zip(distances, reference_valid)
                    if valid
                ]
                sky_fractions.append(float(np.mean(matched)) if matched else 0.0)
            if valid_fraction < 1.0:
                classification = "uncertain-reference-sky"
            elif min(sky_fractions) >= args.confirmed_sun_minimum_fraction:
                classification = "confirmed-sun-visible"
            elif max(sky_fractions) <= args.confirmed_shade_maximum_fraction:
                classification = "confirmed-shade-occluded"
            else:
                classification = "uncertain-partial-solar-disk"
            expected = observation["expected"]
            comparison = (
                "agree"
                if (expected == "sun" and classification == "confirmed-sun-visible")
                or (expected == "shade" and classification == "confirmed-shade-occluded")
                else "indeterminate"
                if classification.startswith("uncertain")
                else "disagree"
            )
            results.append({
                "seatId": entry["seatId"],
                "candidateId": observation["candidateId"],
                "manualObservedRowBankState": expected,
                "classification": classification,
                "comparison": comparison,
                "angularSampleCount": len(distances),
                "validReferenceSampleFraction": round(valid_fraction, 6),
                "skyFractionsByLabP95Threshold": [round(value, 6) for value in sky_fractions],
                "targetToReferenceLabP95Distance": {
                    "minimum": round(float(np.min(distances)), 6),
                    "median": round(float(np.median(distances)), 6),
                    "p95": round(float(np.percentile(distances, 95)), 6),
                    "maximum": round(float(np.max(distances)), 6),
                },
            })
            color = {
                "confirmed-sun-visible": (58, 181, 111),
                "confirmed-shade-occluded": (230, 85, 55),
                "uncertain-reference-sky": (245, 190, 65),
                "uncertain-partial-solar-disk": (245, 190, 65),
            }[classification]
            left = observation_index * panel_width
            top = target_index * panel_height
            canvas_draw.rectangle((left, top, left + panel_width - 1, top + panel_height - 1), fill=color)
            canvas_draw.text((left + 6, top + 8), entry["seatId"], fill=(10, 10, 10))
            canvas_draw.text(
                (left + 6, top + 31),
                f"sky {min(sky_fractions):.2f} to {max(sky_fractions):.2f}",
                fill=(10, 10, 10),
            )
        if (target_index + 1) % 10 == 0 or target_index + 1 == len(target_manifest["images"]):
            print(f"Classified {target_index + 1}/{len(target_manifest['images'])} target panoramas", flush=True)

    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(args.output_png, format="PNG", optimize=True)
    input_paths = {
        "targetManifest": args.target_manifest,
        "referenceManifest": args.reference_manifest,
        "panoramaCalibration": args.panorama_calibration,
        "trueNorthOrientation": args.true_north_orientation,
        "rasterMetadata": args.raster_metadata,
        "solarWindows": args.solar_windows,
        "reviewQueue": args.review_queue,
    }
    classifications = [item["classification"] for item in results]
    comparisons = [item["comparison"] for item in results]
    reference_agreements = [
        model["referenceAgreementP95"]
        for models in reference_models
        for model in models
    ]
    stable = {
        "inputs": {name: sha256_file(path) for name, path in input_paths.items()},
        "parameters": {
            "maximumWidth": args.maximum_width,
            "patchSize": args.patch_size,
            "angularSampleSpacingDegrees": args.angular_sample_spacing_degrees,
            "solarAngularRadiusDegrees": SOLAR_ANGULAR_RADIUS_DEGREES,
            "orientation95Degrees": orientation95,
            "sweptDiskRadiusDegrees": envelope_radius,
            "labP95Thresholds": thresholds,
            "referenceAgreementP95Maximum": args.reference_agreement_p95_maximum,
            "confirmedSunMinimumFraction": args.confirmed_sun_minimum_fraction,
            "confirmedShadeMaximumFraction": args.confirmed_shade_maximum_fraction,
        },
        "referencePanoramas": reference_records,
        "observations": [
            {
                "candidateId": item["candidateId"],
                "expected": item["expected"],
                "angularSampleCount": item["sampleCount"],
                "trueDirectionSamples": item["directionsTrue"],
            }
            for item in observations
        ],
        "referenceAgreementLabP95": {
            "maximum": round(float(np.max(reference_agreements)), 6),
            "p95": round(float(np.percentile(reference_agreements, 95)), 6),
            "median": round(float(np.median(reference_agreements)), 6),
        },
        "results": results,
        "diagnosticPngSha256": sha256_file(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "calibrated-reference-sky-swept-solar-disk-v1",
        "artifactStage": "reference-sky-panorama-occlusion-diagnostic",
        "artifactVersion": fingerprint(stable),
        **stable,
        "diagnosticPng": str(args.output_png),
        "summary": {
            "targetSeatCount": len(target_manifest["images"]),
            "referenceSeatCount": len(reference_manifest["images"]),
            "observationCount": len(observations),
            "classificationCounts": {
                value: classifications.count(value) for value in sorted(set(classifications))
            },
            "comparisonCounts": {
                value: comparisons.count(value) for value in sorted(set(comparisons))
            },
        },
        "assessment": {
            "measurementEligibleDiagnostic": True,
            "publicationEligible": False,
            "blockers": [
                "PHOTOMETRIC_MATCH_THRESHOLDS_NOT_YET_CROSS_VALIDATED_ON_DISJOINT_OBSERVATIONS",
                "ONLY_D_E_ROW_ANCHORS_CLASSIFIED",
                "INDEPENDENT_ROW_BOUNDARY_HOLDOUT_NOT_YET_SCORED",
                "FULL_STADIUM_PANORAMA_COVERAGE_NOT_COMPLETE",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "referenceAgreementLabP95": stable["referenceAgreementLabP95"],
        "summary": artifact["summary"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
