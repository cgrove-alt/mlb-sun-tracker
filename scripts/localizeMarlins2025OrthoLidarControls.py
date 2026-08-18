#!/usr/bin/env python3
"""Localize locked 2024 LiDAR controls in the official 2025 orthophoto."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import laspy
import numpy as np
from PIL import Image
from scipy import ndimage

from auditNoaa2021HardStructureRegistration import (
    artifact_version,
    sha256_file,
    validate_input_record,
)


ANALYSIS_VERSION = "marlins-2025-orthophoto-2024-lidar-subpixel-localization-v2-development"
TARGET_EPSG = 6438
CELL_FEET = 0.5
MINIMUM_Z_FEET = 5.0
MAXIMUM_Z_FEET = 250.0
MINIMUM_STRUCTURE_SURFACE_FEET = 18.0
PATCH_HALF_WIDTHS_FEET = [20.0, 30.0, 40.0, 50.0, 60.0]
SEARCH_HALF_WIDTH_FEET = 12.0
MAXIMUM_SHIFT_NORM_FEET = 12.0
MAXIMUM_CROSS_PATCH_DISTANCE_FEET = 0.75
MAXIMUM_LOCALIZATION_ENVELOPE_FEET = 0.50
MINIMUM_MATCH_RESPONSE = 0.10
MINIMUM_CONSISTENT_PATCH_COUNT = 3
MINIMUM_TRAINING_CONTROL_COUNT = 6
MINIMUM_HOLDOUT_CONTROL_COUNT = 6


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def horizontal_epsg(crs: Any) -> int | None:
    if crs is None:
        return None
    if crs.is_compound and crs.sub_crs_list:
        return crs.sub_crs_list[0].to_epsg()
    return crs.to_epsg()


def build_lidar_edge(
    path: Path,
    extent: dict[str, float],
    chunk_size: int,
) -> tuple[np.ndarray, np.ndarray, dict[str, Any]]:
    width = int(round((extent["xmax"] - extent["xmin"]) / CELL_FEET))
    height_pixels = int(round((extent["ymax"] - extent["ymin"]) / CELL_FEET))
    height = np.full((height_pixels, width), -np.inf, dtype=np.float32)
    total = 0
    cropped = 0
    with laspy.open(path) as source:
        if horizontal_epsg(source.header.parse_crs()) != TARGET_EPSG:
            raise ValueError("LiDAR is not in EPSG:6438")
        for points in source.chunk_iterator(chunk_size):
            x = np.asarray(points.x, dtype=np.float64)
            y = np.asarray(points.y, dtype=np.float64)
            z = np.asarray(points.z, dtype=np.float64)
            classification = np.asarray(points.classification)
            keep = (
                (x >= extent["xmin"])
                & (x < extent["xmax"])
                & (y >= extent["ymin"])
                & (y < extent["ymax"])
                & (z > MINIMUM_Z_FEET)
                & (z < MAXIMUM_Z_FEET)
                & ~np.isin(classification, [7, 18])
            )
            ix = np.floor((x[keep] - extent["xmin"]) / CELL_FEET).astype(np.int32)
            iy = np.floor((y[keep] - extent["ymin"]) / CELL_FEET).astype(np.int32)
            np.maximum.at(height, (iy, ix), z[keep].astype(np.float32))
            total += len(x)
            cropped += int(np.count_nonzero(keep))
    finite = np.isfinite(height)
    if not np.any(finite):
        raise ValueError("LiDAR surface is empty")
    indices = ndimage.distance_transform_edt(
        ~finite,
        return_distances=False,
        return_indices=True,
    )
    filled = ndimage.gaussian_filter(height[tuple(indices)], 1.0)
    gradient = np.hypot(
        ndimage.sobel(filled, axis=1),
        ndimage.sobel(filled, axis=0),
    )
    edge_limit = float(np.percentile(gradient, 99.5))
    edge = np.clip(gradient / max(edge_limit, 1e-6), 0.0, 1.0)
    structure = filled >= MINIMUM_STRUCTURE_SURFACE_FEET
    structure = ndimage.binary_dilation(structure, iterations=10)
    edge[~structure] = 0.0
    edge = ndimage.gaussian_filter(edge, 1.0).astype(np.float32)
    return edge, structure.astype(np.uint8), {
        "totalPointCount": total,
        "croppedPointCount": cropped,
        "finiteCellFractionBeforeFill": float(np.mean(finite)),
    }


def build_orthophoto_edge(
    path: Path,
    native_pixel_feet: float,
    expected_size: list[int],
    structure_mask: np.ndarray,
) -> np.ndarray:
    with Image.open(path) as source:
        if list(source.size) != expected_size:
            raise ValueError("Orthophoto dimensions do not match the manifest")
        scale = native_pixel_feet / CELL_FEET
        target_size = (
            int(round(source.size[0] * scale)),
            int(round(source.size[1] * scale)),
        )
        rgb = source.convert("RGB").resize(target_size, Image.Resampling.BOX)
    rgb_array = np.flipud(np.asarray(rgb))
    gray = cv2.cvtColor(rgb_array, cv2.COLOR_RGB2GRAY)
    gray = cv2.GaussianBlur(gray, (0, 0), 1.0)
    edge = cv2.Canny(gray, 20, 70).astype(np.float32) / 255.0
    edge = ndimage.gaussian_filter(edge, 1.0)
    broad_mask = ndimage.binary_dilation(structure_mask.astype(bool), iterations=10)
    edge[~broad_mask] = 0.0
    return edge.astype(np.float32)


def crop_centered(
    image: np.ndarray,
    center_pixel: np.ndarray,
    half_width_pixels: int,
) -> np.ndarray | None:
    center_x = int(round(float(center_pixel[0])))
    center_y = int(round(float(center_pixel[1])))
    x0 = center_x - half_width_pixels
    x1 = center_x + half_width_pixels
    y0 = center_y - half_width_pixels
    y1 = center_y + half_width_pixels
    if x0 < 0 or y0 < 0 or x1 > image.shape[1] or y1 > image.shape[0]:
        return None
    return image[y0:y1, x0:x1]


def quadratic_subpixel(values: np.ndarray, index: int) -> float:
    if index <= 0 or index >= len(values) - 1:
        return 0.0
    left = float(values[index - 1])
    center = float(values[index])
    right = float(values[index + 1])
    denominator = left - 2.0 * center + right
    if abs(denominator) < 1e-12:
        return 0.0
    offset = 0.5 * (left - right) / denominator
    return float(np.clip(offset, -0.5, 0.5))


def match_shift(
    orthophoto_edge: np.ndarray,
    lidar_edge: np.ndarray,
    center_pixel: np.ndarray,
    patch_half_width_feet: float,
) -> dict[str, Any] | None:
    patch_half_cells = int(round(patch_half_width_feet / CELL_FEET))
    search_cells = int(round(SEARCH_HALF_WIDTH_FEET / CELL_FEET))
    template = crop_centered(lidar_edge, center_pixel, patch_half_cells)
    search = crop_centered(
        orthophoto_edge,
        center_pixel,
        patch_half_cells + search_cells,
    )
    if template is None or search is None:
        return None
    if float(np.std(template)) < 1e-6 or float(np.std(search)) < 1e-6:
        return None
    response_surface = cv2.matchTemplate(
        search.astype(np.float32),
        template.astype(np.float32),
        cv2.TM_CCOEFF_NORMED,
    )
    _, response, _, location = cv2.minMaxLoc(response_surface)
    location_x, location_y = location
    subpixel_x = quadratic_subpixel(response_surface[location_y, :], location_x)
    subpixel_y = quadratic_subpixel(response_surface[:, location_x], location_y)
    shift_pixels = np.asarray([
        location_x + subpixel_x - search_cells,
        location_y + subpixel_y - search_cells,
    ])
    shift_feet = shift_pixels * CELL_FEET
    return {
        "patchHalfWidthFeet": patch_half_width_feet,
        "lidarToOrthophotoShiftFeet": shift_feet.tolist(),
        "shiftNormFeet": float(np.linalg.norm(shift_feet)),
        "matchResponse": float(response),
        "integerPeakLocation": [int(location_x), int(location_y)],
        "subpixelPeakOffsetPixels": [subpixel_x, subpixel_y],
    }


def consistent_component(estimates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    eligible = [
        estimate
        for estimate in estimates
        if estimate["shiftNormFeet"] <= MAXIMUM_SHIFT_NORM_FEET
        and estimate["matchResponse"] >= MINIMUM_MATCH_RESPONSE
    ]
    if not eligible:
        return []
    best_component: list[dict[str, Any]] = []
    for seed in eligible:
        seed_shift = np.asarray(seed["lidarToOrthophotoShiftFeet"])
        component = [
            estimate
            for estimate in eligible
            if float(np.linalg.norm(
                np.asarray(estimate["lidarToOrthophotoShiftFeet"]) - seed_shift
            )) <= MAXIMUM_CROSS_PATCH_DISTANCE_FEET
        ]
        if len(component) > len(best_component):
            best_component = component
        elif len(component) == len(best_component) and component:
            if np.median([item["matchResponse"] for item in component]) > np.median([
                item["matchResponse"] for item in best_component
            ]):
                best_component = component
    return best_component


def build_localization(controls_path: Path, chunk_size: int) -> dict[str, Any]:
    controls, controls_sha256 = locked_json(controls_path)
    if controls.get("reviewStatus") != "reviewed-2025-orthophoto-2024-lidar-controls":
        raise ValueError("Cross-sensor controls are not locked")
    if controls["assessment"]["crossSensorOffsetsInspectedBeforeLock"]:
        raise ValueError("Control selection inspected cross-sensor offsets")
    queue = validate_input_record(controls["inputs"]["reviewQueue"])
    validate_input_record(controls["inputs"]["reviewSheet"])
    orthophoto_audit = validate_input_record(controls["inputs"]["orthophotoAudit"])
    mosaic = validate_input_record(controls["inputs"]["orthophotoMosaic"])
    if queue is None or orthophoto_audit is None or mosaic is None:
        raise ValueError("Locked input JSON is unavailable")
    if not orthophoto_audit["accuracyAssessment"]["officialDatasetPlanFrameAccepted"]:
        raise ValueError("Orthophoto plan frame is not accepted")
    if orthophoto_audit["accuracyAssessment"]["roofTopEdgeMetricMeasurementAccepted"]:
        raise ValueError("Localization must not inherit a roof-edge accuracy claim")
    reviewed_ids = {
        record["candidateId"] for record in controls["controls"]
    } | set(controls["rejectedCandidateIds"])
    candidates = {record["candidateId"]: record for record in queue["candidates"]}
    if reviewed_ids != set(candidates):
        raise ValueError("Every review candidate was not handled exactly once")
    raster = mosaic["raster"]
    raster_path = Path(raster["path"])
    if sha256_file(raster_path) != raster["sha256"]:
        raise ValueError("Orthophoto raster checksum mismatch")
    lidar_record = queue["inputs"]["comparisonLidar"]
    lidar_path = Path(lidar_record["path"])
    if sha256_file(lidar_path) != lidar_record["sha256"]:
        raise ValueError("LiDAR checksum mismatch")
    extent = {key: float(value) for key, value in raster["extent"].items()}
    lidar_edge, structure_mask, point_counts = build_lidar_edge(
        lidar_path,
        extent,
        chunk_size,
    )
    orthophoto_edge = build_orthophoto_edge(
        raster_path,
        float(raster["pixelSizeX"]),
        raster["dimensionsPixels"],
        structure_mask,
    )

    evaluations: list[dict[str, Any]] = []
    localized: list[dict[str, Any]] = []
    for reviewed in controls["controls"]:
        candidate = candidates[reviewed["candidateId"]]
        nominal = np.asarray(candidate["orthophoto"]["statePlaneFeet"])
        center_pixel = np.asarray([
            (nominal[0] - extent["xmin"]) / CELL_FEET - 0.5,
            (nominal[1] - extent["ymin"]) / CELL_FEET - 0.5,
        ])
        estimates = [
            estimate
            for patch_half_width in PATCH_HALF_WIDTHS_FEET
            if (
                estimate := match_shift(
                    orthophoto_edge,
                    lidar_edge,
                    center_pixel,
                    patch_half_width,
                )
            ) is not None
        ]
        component = consistent_component(estimates)
        consensus: dict[str, Any] | None = None
        if len(component) >= MINIMUM_CONSISTENT_PATCH_COUNT:
            shifts = np.asarray([
                record["lidarToOrthophotoShiftFeet"] for record in component
            ])
            median_shift = np.median(shifts, axis=0)
            distances = np.linalg.norm(shifts - median_shift, axis=1)
            localization_envelope = float(max(
                CELL_FEET / np.sqrt(2.0),
                float(np.max(distances)),
            ))
            passes = bool(
                localization_envelope <= MAXIMUM_LOCALIZATION_ENVELOPE_FEET
            )
            consensus = {
                "passes": passes,
                "consistentPatchCount": len(component),
                "medianLidarToOrthophotoShiftFeet": median_shift.tolist(),
                "maximumCrossPatchDistanceFeet": float(np.max(distances)),
                "medianMatchResponse": float(np.median([
                    record["matchResponse"] for record in component
                ])),
                "localizationEnvelopeFeet": localization_envelope,
                "orthophotoStatePlaneFeet": (nominal + median_shift).tolist(),
                "lidarStatePlaneFeet": nominal.tolist(),
            }
            if passes:
                localized.append({
                    "candidateId": reviewed["candidateId"],
                    "role": reviewed["role"],
                    "semanticIdentity": reviewed["semanticIdentity"],
                    "orthophotoStatePlaneFeet": (nominal + median_shift).tolist(),
                    "lidarStatePlaneFeet": nominal.tolist(),
                    "lidarToOrthophotoShiftFeet": median_shift.tolist(),
                    "localizationEnvelopeFeet": localization_envelope,
                    "consistentPatchCount": len(component),
                    "medianMatchResponse": consensus["medianMatchResponse"],
                })
        evaluations.append({
            "candidateId": reviewed["candidateId"],
            "lockedRole": reviewed["role"],
            "semanticIdentity": reviewed["semanticIdentity"],
            "nominalStatePlaneFeet": nominal.tolist(),
            "patchEstimates": estimates,
            "consensus": consensus,
        })

    training_count = sum(record["role"] == "training" for record in localized)
    holdout_count = sum(record["role"] == "holdout" for record in localized)
    measurement_eligible = (
        training_count >= MINIMUM_TRAINING_CONTROL_COUNT
        and holdout_count >= MINIMUM_HOLDOUT_CONTROL_COUNT
    )
    blockers: list[str] = []
    if training_count < MINIMUM_TRAINING_CONTROL_COUNT:
        blockers.append("FEWER_THAN_SIX_TRAINING_CONTROLS_PASS_LOCALIZATION_GATE")
    if holdout_count < MINIMUM_HOLDOUT_CONTROL_COUNT:
        blockers.append("FEWER_THAN_SIX_HOLDOUT_CONTROLS_PASS_LOCALIZATION_GATE")
    stable = {
        "controlsSha256": controls_sha256,
        "parameters": {
            "cellFeet": CELL_FEET,
            "patchHalfWidthsFeet": PATCH_HALF_WIDTHS_FEET,
            "searchHalfWidthFeet": SEARCH_HALF_WIDTH_FEET,
            "maximumShiftNormFeet": MAXIMUM_SHIFT_NORM_FEET,
            "maximumCrossPatchDistanceFeet": MAXIMUM_CROSS_PATCH_DISTANCE_FEET,
            "maximumLocalizationEnvelopeFeet": MAXIMUM_LOCALIZATION_ENVELOPE_FEET,
            "minimumMatchResponse": MINIMUM_MATCH_RESPONSE,
            "minimumConsistentPatchCount": MINIMUM_CONSISTENT_PATCH_COUNT,
            "minimumTrainingControlCount": MINIMUM_TRAINING_CONTROL_COUNT,
            "minimumHoldoutControlCount": MINIMUM_HOLDOUT_CONTROL_COUNT,
        },
        "localizedControls": localized,
        "evaluations": evaluations,
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-orthophoto-2024-lidar-subpixel-localization",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "reviewStatus": (
            "locked-2025-orthophoto-2024-lidar-subpixel-controls"
            if measurement_eligible
            else "failed-2025-orthophoto-2024-lidar-subpixel-controls"
        ),
        "inputs": {
            "controls": {
                "path": str(controls_path),
                "sha256": controls_sha256,
                "artifactVersion": controls["artifactVersion"],
            },
            "reviewQueue": controls["inputs"]["reviewQueue"],
            "reviewSheet": controls["inputs"]["reviewSheet"],
            "orthophotoAudit": controls["inputs"]["orthophotoAudit"],
            "orthophotoMosaic": controls["inputs"]["orthophotoMosaic"],
            "orthophotoRaster": {
                "path": str(raster_path),
                "sha256": raster["sha256"],
            },
            "comparisonLidar": lidar_record,
        },
        "parameters": stable["parameters"],
        "pointCounts": point_counts,
        "controls": localized,
        "evaluations": evaluations,
        "assessment": {
            "baseAcceptedControlCount": len(controls["controls"]),
            "localizedControlCount": len(localized),
            "trainingControlCount": training_count,
            "holdoutControlCount": holdout_count,
            "fixedEngineeredFeatureIdentityReviewed": True,
            "movableRoofControlsExcluded": True,
            "vegetationControlsExcluded": True,
            "localizationGatePassed": measurement_eligible,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                *blockers,
                "LOCKED_RIGID_REGISTRATION_NOT_PASSED",
                "ROW_SURFACE_SEMANTICS_NOT_ESTABLISHED",
                "CURRENT_2026_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_localization(arguments.controls, arguments.chunk_size)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "reviewStatus": artifact["reviewStatus"],
        "assessment": artifact["assessment"],
        "passingTrainingIds": [
            record["candidateId"]
            for record in artifact["controls"]
            if record["role"] == "training"
        ],
        "passingHoldoutIds": [
            record["candidateId"]
            for record in artifact["controls"]
            if record["role"] == "holdout"
        ],
    }, indent=2))


if __name__ == "__main__":
    main()
