#!/usr/bin/env python3
"""Localize locked ground patches without fitting a registration transform.

The rigid model family and signed high-pass correlation method are predeclared.
Training and final-holdout roles can be localized in separate runs so method
development never inspects a final-holdout offset.
"""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
from pathlib import Path
from typing import Any

import cv2
import laspy
import numpy as np
from PIL import Image
from scipy import ndimage

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


ANALYSIS_VERSION = "marlins-2025-ground-patch-localization-v4-training-development"
CELL_FEET = 0.5
TARGET_EPSG = 6438
GROUND_CLASSIFICATION = 2
GROUND_DENSITY_WINDOW_FEET = 21.0
MINIMUM_LOCAL_GROUND_POINT_DENSITY_PER_SQUARE_FOOT = 0.35
PATCH_HALF_WIDTHS_FEET = [35.0, 45.0, 55.0]
SEARCH_HALF_WIDTH_FEET = 3.0
MATCH_REPRESENTATIONS = ("gradient-magnitude",)
MINIMUM_VALID_PIXEL_FRACTION = 0.20
MINIMUM_MATCH_RESPONSE = 0.08
MAXIMUM_CROSS_SCALE_DISTANCE_FEET = 0.75
MINIMUM_CONSISTENT_ESTIMATE_COUNT = 2
MINIMUM_CONSISTENT_PATCH_WIDTH_COUNT = 2
MINIMUM_CONSISTENT_REPRESENTATION_COUNT = 1
MAXIMUM_LOCALIZATION_ENVELOPE_FEET = 0.75


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def horizontal_epsg(crs: Any) -> int | None:
    if crs is None:
        return None
    if crs.is_compound and crs.sub_crs_list:
        return crs.sub_crs_list[0].to_epsg()
    return crs.to_epsg()


def build_ground_intensity(
    path: Path,
    extent: dict[str, float],
    chunk_size: int,
) -> dict[str, Any]:
    width = int(round((extent["xmax"] - extent["xmin"]) / CELL_FEET))
    height = int(round((extent["ymax"] - extent["ymin"]) / CELL_FEET))
    intensity_sum = np.zeros((height, width), dtype=np.float64)
    point_count = np.zeros((height, width), dtype=np.uint32)
    with laspy.open(path) as source:
        if horizontal_epsg(source.header.parse_crs()) != TARGET_EPSG:
            raise ValueError("LiDAR is not in EPSG:6438")
        for points in source.chunk_iterator(chunk_size):
            x = np.asarray(points.x, dtype=np.float64)
            y = np.asarray(points.y, dtype=np.float64)
            classification = np.asarray(points.classification)
            intensity = np.asarray(points.intensity, dtype=np.float64)
            keep = (
                (classification == GROUND_CLASSIFICATION)
                & (x >= extent["xmin"])
                & (x < extent["xmax"])
                & (y >= extent["ymin"])
                & (y < extent["ymax"])
            )
            ix = np.floor((x[keep] - extent["xmin"]) / CELL_FEET).astype(np.int32)
            iy = np.floor((y[keep] - extent["ymin"]) / CELL_FEET).astype(np.int32)
            np.add.at(intensity_sum, (iy, ix), intensity[keep])
            np.add.at(point_count, (iy, ix), 1)
    finite = point_count > 0
    if not np.any(finite):
        raise ValueError("Ground-intensity crop is empty")
    mean = np.zeros_like(intensity_sum, dtype=np.float32)
    mean[finite] = (intensity_sum[finite] / point_count[finite]).astype(np.float32)
    indices = ndimage.distance_transform_edt(
        ~finite,
        return_distances=False,
        return_indices=True,
    )
    filled = ndimage.gaussian_filter(mean[tuple(indices)], 1.2)
    high_pass = filled - ndimage.gaussian_filter(
        filled,
        10.0 / CELL_FEET,
    )
    high_limit = float(np.percentile(np.abs(high_pass), 99))
    feature = np.clip(
        high_pass / max(high_limit, 1e-6) * 96 + 128,
        0,
        255,
    ).astype(np.uint8)
    density_window_cells = int(round(GROUND_DENSITY_WINDOW_FEET / CELL_FEET))
    density = ndimage.uniform_filter(
        point_count.astype(np.float32),
        size=density_window_cells,
        mode="constant",
    ) / (CELL_FEET * CELL_FEET)
    coverage = (
        density >= MINIMUM_LOCAL_GROUND_POINT_DENSITY_PER_SQUARE_FOOT
    ).astype(np.uint8) * 255
    return {
        "featureImage": feature,
        "coverageMask": coverage,
        "finiteCellFractionBeforeFill": float(np.mean(finite)),
        "eligibleGroundControlCellFraction": float(np.mean(coverage > 0)),
    }


def build_orthophoto(
    path: Path,
    native_pixel_feet: float,
    expected_size: list[int],
    coverage_mask: np.ndarray,
) -> dict[str, Any]:
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
    gray = cv2.GaussianBlur(gray, (0, 0), 0.8 / CELL_FEET)
    high_pass = gray.astype(np.float32) - ndimage.gaussian_filter(
        gray.astype(np.float32),
        10.0 / CELL_FEET,
    )
    high_limit = float(np.percentile(np.abs(high_pass), 99))
    feature = np.clip(
        high_pass / max(high_limit, 1e-6) * 96 + 128,
        0,
        255,
    ).astype(np.uint8)
    feature[coverage_mask == 0] = 128
    return {"featureImage": feature}


def crop_centered(
    image: np.ndarray,
    center: np.ndarray,
    half_width: int,
) -> np.ndarray | None:
    center_x = int(round(float(center[0])))
    center_y = int(round(float(center[1])))
    x0 = center_x - half_width
    x1 = center_x + half_width
    y0 = center_y - half_width
    y1 = center_y + half_width
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
    return float(np.clip(0.5 * (left - right) / denominator, -0.5, 0.5))


def match_patch(
    orthophoto_feature: np.ndarray,
    lidar_feature: np.ndarray,
    coverage_mask: np.ndarray,
    center: np.ndarray,
    half_width_feet: float,
    representation: str,
) -> dict[str, Any] | None:
    half = int(round(half_width_feet / CELL_FEET))
    search_half = int(round(SEARCH_HALF_WIDTH_FEET / CELL_FEET))
    lidar = crop_centered(lidar_feature, center, half)
    mask = crop_centered(coverage_mask, center, half)
    orthophoto = crop_centered(orthophoto_feature, center, half + search_half)
    if lidar is None or mask is None or orthophoto is None:
        return None
    valid = mask > 0
    valid_fraction = float(np.mean(valid))
    if valid_fraction < MINIMUM_VALID_PIXEL_FRACTION:
        return None
    template = lidar.astype(np.float32)
    search = orthophoto.astype(np.float32)
    template[~valid] = 0.0
    match_mask = (valid.astype(np.uint8) * 255)
    if float(np.std(template[valid])) < 1e-6:
        return None
    response_surface = cv2.matchTemplate(
        search,
        template,
        cv2.TM_CCORR_NORMED,
        mask=match_mask,
    )
    response_surface = np.nan_to_num(
        response_surface,
        nan=-1.0,
        posinf=-1.0,
        neginf=-1.0,
    )
    _, response, _, location = cv2.minMaxLoc(response_surface)
    location_x, location_y = location
    peak_inside_search_window = bool(
        0 < location_x < response_surface.shape[1] - 1
        and 0 < location_y < response_surface.shape[0] - 1
    )
    subpixel_x = quadratic_subpixel(response_surface[location_y, :], location_x)
    subpixel_y = quadratic_subpixel(response_surface[:, location_x], location_y)
    shift = np.asarray([
        location_x + subpixel_x - search_half,
        location_y + subpixel_y - search_half,
    ]) * CELL_FEET
    flattened = np.sort(response_surface.ravel())
    second_response = float(flattened[-2]) if len(flattened) >= 2 else -1.0
    return {
        "representation": representation,
        "patchHalfWidthFeet": half_width_feet,
        "validPixelFraction": valid_fraction,
        "lidarToOrthophotoShiftFeet": shift.tolist(),
        "shiftNormFeet": float(np.linalg.norm(shift)),
        "matchResponse": float(response),
        "secondHighestCellResponse": second_response,
        "peakCellMargin": float(response - second_response),
        "peakInsideSearchWindow": peak_inside_search_window,
        "integerPeakLocation": [int(location_x), int(location_y)],
        "subpixelPeakOffsetCells": [subpixel_x, subpixel_y],
    }


def consistent_component(estimates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    eligible = [
        estimate
        for estimate in estimates
        if estimate["matchResponse"] >= MINIMUM_MATCH_RESPONSE
        and estimate["peakInsideSearchWindow"]
    ]
    best: list[dict[str, Any]] = []
    for size in range(len(eligible), MINIMUM_CONSISTENT_ESTIMATE_COUNT - 1, -1):
        for subset in itertools.combinations(eligible, size):
            shifts = np.asarray([
                record["lidarToOrthophotoShiftFeet"] for record in subset
            ])
            median = np.median(shifts, axis=0)
            maximum_distance = float(np.max(np.linalg.norm(shifts - median, axis=1)))
            if maximum_distance > MAXIMUM_CROSS_SCALE_DISTANCE_FEET:
                continue
            component = list(subset)
            if not best or np.median([
                record["matchResponse"] for record in component
            ]) > np.median([record["matchResponse"] for record in best]):
                best = component
        if best:
            break
    return best


def build_localization(controls_path: Path, role: str, chunk_size: int) -> dict[str, Any]:
    controls, controls_sha256 = locked_json(controls_path)
    if controls.get("artifactKind") != "reviewed-marlins-2025-ground-patch-controls":
        raise ValueError("Input is not the locked ground-patch controls")
    if controls.get("reviewStatus") != "locked-before-ground-patch-localization":
        raise ValueError("Ground-patch controls were not locked before localization")
    protocol = controls["reviewProtocol"]
    if protocol["crossSensorOffsetsInspectedBeforeLock"]:
        raise ValueError("Controls were selected after offsets were inspected")
    if protocol["registrationResidualsInspectedBeforeLock"]:
        raise ValueError("Controls were selected after residuals were inspected")
    queue_path = Path(controls["inputs"]["reviewQueue"]["path"])
    queue, queue_sha256 = locked_json(queue_path)
    if queue_sha256 != controls["inputs"]["reviewQueue"]["sha256"]:
        raise ValueError("Review queue checksum mismatch")
    mosaic_path = Path(controls["inputs"]["mosaicManifest"]["path"])
    mosaic, mosaic_sha256 = locked_json(mosaic_path)
    if mosaic_sha256 != controls["inputs"]["mosaicManifest"]["sha256"]:
        raise ValueError("Orthophoto mosaic manifest checksum mismatch")
    audit_path = Path(controls["inputs"]["orthophotoAudit"]["path"])
    audit, audit_sha256 = locked_json(audit_path)
    if audit_sha256 != controls["inputs"]["orthophotoAudit"]["sha256"]:
        raise ValueError("Orthophoto audit checksum mismatch")
    if not audit["accuracyAssessment"]["officialDatasetPlanFrameAccepted"]:
        raise ValueError("Official 2025 orthophoto ground frame is not accepted")
    lidar_path = Path(controls["inputs"]["comparisonLidar"]["path"])
    if sha256_file(lidar_path) != controls["inputs"]["comparisonLidar"]["sha256"]:
        raise ValueError("Comparison LiDAR checksum mismatch")
    raster = mosaic["raster"]
    raster_path = Path(raster["path"])
    if sha256_file(raster_path) != raster["sha256"]:
        raise ValueError("Orthophoto raster checksum mismatch")
    extent = {key: float(value) for key, value in raster["extent"].items()}
    lidar = build_ground_intensity(lidar_path, extent, chunk_size)
    orthophoto = build_orthophoto(
        raster_path,
        float(raster["pixelSizeX"]),
        raster["dimensionsPixels"],
        lidar["coverageMask"],
    )
    selected = [record for record in controls["controls"] if record["role"] == role]
    if len(selected) < 6:
        raise ValueError(f"Role {role} has fewer than six locked controls")
    signed_orthophoto = orthophoto["featureImage"].astype(np.float32) - 128.0
    signed_lidar = lidar["featureImage"].astype(np.float32) - 128.0
    gradient_orthophoto = np.hypot(
        cv2.Sobel(signed_orthophoto, cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(signed_orthophoto, cv2.CV_32F, 0, 1, ksize=3),
    )
    gradient_lidar = np.hypot(
        cv2.Sobel(signed_lidar, cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(signed_lidar, cv2.CV_32F, 0, 1, ksize=3),
    )
    representations = {
        "signed-high-pass": (signed_orthophoto, signed_lidar),
        "gradient-magnitude": (gradient_orthophoto, gradient_lidar),
    }
    evaluations = []
    localized = []
    for control in selected:
        nominal = np.asarray(control["statePlaneFeet"], dtype=float)
        center = np.asarray([
            (nominal[0] - extent["xmin"]) / CELL_FEET,
            (nominal[1] - extent["ymin"]) / CELL_FEET,
        ])
        estimates = []
        for representation in MATCH_REPRESENTATIONS:
            reference, comparison = representations[representation]
            for half_width in PATCH_HALF_WIDTHS_FEET:
                estimate = match_patch(
                    reference,
                    comparison,
                    lidar["coverageMask"],
                    center,
                    half_width,
                    representation,
                )
                if estimate is not None:
                    estimates.append(estimate)
        component = consistent_component(estimates)
        consensus = None
        representation_count = len({
            record["representation"] for record in component
        })
        patch_width_count = len({
            record["patchHalfWidthFeet"] for record in component
        })
        if (
            len(component) >= MINIMUM_CONSISTENT_ESTIMATE_COUNT
            and representation_count >= MINIMUM_CONSISTENT_REPRESENTATION_COUNT
            and patch_width_count >= MINIMUM_CONSISTENT_PATCH_WIDTH_COUNT
        ):
            shifts = np.asarray([
                record["lidarToOrthophotoShiftFeet"] for record in component
            ])
            median = np.median(shifts, axis=0)
            distances = np.linalg.norm(shifts - median, axis=1)
            envelope = float(max(CELL_FEET / 2.0, float(np.max(distances))))
            passes = envelope <= MAXIMUM_LOCALIZATION_ENVELOPE_FEET
            consensus = {
                "passes": passes,
                "consistentScaleCount": len(component),
                "consistentEstimateCount": len(component),
                "consistentPatchWidthCount": patch_width_count,
                "consistentRepresentationCount": representation_count,
                "medianLidarToOrthophotoShiftFeet": median.tolist(),
                "maximumCrossScaleDistanceFeet": float(np.max(distances)),
                "medianMatchResponse": float(np.median([
                    record["matchResponse"] for record in component
                ])),
                "localizationEnvelopeFeet": envelope,
                "lidarStatePlaneFeet": nominal.tolist(),
                "orthophotoStatePlaneFeet": (nominal + median).tolist(),
            }
            if passes:
                localized.append({
                    "candidateId": control["candidateId"],
                    "role": role,
                    "semanticIdentity": control["semanticIdentity"],
                    **consensus,
                })
        evaluations.append({
            "candidateId": control["candidateId"],
            "role": role,
            "semanticIdentity": control["semanticIdentity"],
            "nominalStatePlaneFeet": nominal.tolist(),
            "scaleEstimates": estimates,
            "consensus": consensus,
        })
    stable = {
        "controlsSha256": controls_sha256,
        "role": role,
        "method": "masked-gradient-magnitude-normalized-correlation",
        "modelFamilyReservedForAudit": "rigid-unit-scale",
        "parameters": {
            "cellFeet": CELL_FEET,
            "patchHalfWidthsFeet": PATCH_HALF_WIDTHS_FEET,
            "searchHalfWidthFeet": SEARCH_HALF_WIDTH_FEET,
            "matchRepresentations": MATCH_REPRESENTATIONS,
            "minimumValidPixelFraction": MINIMUM_VALID_PIXEL_FRACTION,
            "minimumMatchResponse": MINIMUM_MATCH_RESPONSE,
            "maximumCrossScaleDistanceFeet": MAXIMUM_CROSS_SCALE_DISTANCE_FEET,
            "minimumConsistentEstimateCount": MINIMUM_CONSISTENT_ESTIMATE_COUNT,
            "minimumConsistentPatchWidthCount": MINIMUM_CONSISTENT_PATCH_WIDTH_COUNT,
            "minimumConsistentRepresentationCount": (
                MINIMUM_CONSISTENT_REPRESENTATION_COUNT
            ),
            "maximumLocalizationEnvelopeFeet": MAXIMUM_LOCALIZATION_ENVELOPE_FEET,
        },
        "localizedControls": localized,
        "evaluations": evaluations,
    }
    blockers = []
    if len(localized) < 6:
        blockers.append("FEWER_THAN_SIX_CONTROLS_PASS_LOCALIZATION_GATE")
    if role == "training":
        blockers.append("FINAL_HOLDOUTS_NOT_YET_LOCALIZED_OR_SCORED")
    else:
        blockers.append("FINAL_HOLDOUT_RESIDUALS_NOT_YET_SCORED")
    blockers.append("INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED")
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-ground-patch-localization",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "role": role,
        "inputs": {
            "controls": {
                "path": str(controls_path),
                "sha256": controls_sha256,
                "artifactVersion": controls["artifactVersion"],
            },
            "reviewQueue": controls["inputs"]["reviewQueue"],
            "orthophotoAudit": controls["inputs"]["orthophotoAudit"],
            "mosaicManifest": controls["inputs"]["mosaicManifest"],
            "comparisonLidar": controls["inputs"]["comparisonLidar"],
        },
        "predeclaredMethod": {
            "correlation": "masked-gradient-magnitude-normalized-correlation",
            "registrationModelFamily": "rigid-unit-scale",
            "modelFamilyMayNotChangeAfterFinalHoldoutLocalization": True,
        },
        "parameters": stable["parameters"],
        "evaluations": evaluations,
        "localizedControls": localized,
        "assessment": {
            "lockedControlCount": len(selected),
            "localizedControlCount": len(localized),
            "localizationGatePassed": len(localized) >= 6,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": blockers,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--role", choices=("training", "final-holdout"), required=True)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    arguments = parser.parse_args()
    artifact = build_localization(arguments.controls, arguments.role, arguments.chunk_size)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "role": artifact["role"],
        "lockedControlCount": artifact["assessment"]["lockedControlCount"],
        "localizedControlCount": artifact["assessment"]["localizedControlCount"],
        "blockers": artifact["assessment"]["blockers"],
    }, indent=2))


if __name__ == "__main__":
    main()
