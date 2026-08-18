#!/usr/bin/env python3
"""Localize locked ground controls using native 0.25-foot orthophoto crops."""

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


ANALYSIS_VERSIONS = {
    "signed": "marlins-2025-native-ground-localization-v3-signed-training-development",
    "gradient-magnitude": "marlins-2025-native-ground-localization-v4-gradient-training-development",
}
CORRELATION_METHODS = {
    "signed": "native-quarter-foot-masked-signed-high-pass-correlation",
    "gradient-magnitude": "native-quarter-foot-masked-gradient-magnitude-correlation",
}
CELL_FEET = 0.25
LIDAR_RASTER_CELL_FEET = 1.0
LIDAR_FILL_SMOOTHING_FEET = 0.8
LIDAR_HIGH_PASS_SMOOTHING_FEET = 10.0
TARGET_EPSG = 6438
GROUND_CLASSIFICATION = 2
PATCH_HALF_WIDTHS_FEET = [35.0, 55.0, 75.0]
SEARCH_HALF_WIDTH_FEET = 3.0
GROUND_DENSITY_WINDOW_FEET = 21.0
MINIMUM_LOCAL_GROUND_POINT_DENSITY_PER_SQUARE_FOOT = 0.35
MINIMUM_VALID_PIXEL_FRACTION = 0.20
MINIMUM_MATCH_RESPONSE = 0.10
MINIMUM_CONSISTENT_PATCH_WIDTH_COUNT = 2
MAXIMUM_LOCALIZATION_ENVELOPE_FEET = 0.50


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def horizontal_epsg(crs: Any) -> int | None:
    if crs is None:
        return None
    if crs.is_compound and crs.sub_crs_list:
        return crs.sub_crs_list[0].to_epsg()
    return crs.to_epsg()


def build_lidar_crop_surfaces(
    lidar_path: Path,
    crop_records: list[dict[str, Any]],
    chunk_size: int,
    lidar_raster_cell_feet: float,
) -> dict[str, dict[str, np.ndarray | float]]:
    accumulators: dict[str, dict[str, Any]] = {}
    for record in crop_records:
        manifest = record["manifest"]
        output_width, output_height = manifest["dimensionsPixels"]
        if output_width != output_height or output_width != 720:
            raise ValueError("Native ground crop must be 720 by 720 pixels")
        extent = manifest["extent"]
        width = int(round((extent["xmax"] - extent["xmin"]) / lidar_raster_cell_feet))
        height = int(round((extent["ymax"] - extent["ymin"]) / lidar_raster_cell_feet))
        accumulators[record["candidateId"]] = {
            "extent": extent,
            "outputDimensions": [output_width, output_height],
            "intensitySum": np.zeros((height, width), dtype=np.float64),
            "pointCount": np.zeros((height, width), dtype=np.uint32),
        }
    with laspy.open(lidar_path) as source:
        if horizontal_epsg(source.header.parse_crs()) != TARGET_EPSG:
            raise ValueError("Comparison LiDAR is not in EPSG:6438")
        for points in source.chunk_iterator(chunk_size):
            x = np.asarray(points.x, dtype=np.float64)
            y = np.asarray(points.y, dtype=np.float64)
            classification = np.asarray(points.classification)
            intensity = np.asarray(points.intensity, dtype=np.float64)
            ground = classification == GROUND_CLASSIFICATION
            if not np.any(ground):
                continue
            x = x[ground]
            y = y[ground]
            intensity = intensity[ground]
            chunk_xmin = float(np.min(x))
            chunk_xmax = float(np.max(x))
            chunk_ymin = float(np.min(y))
            chunk_ymax = float(np.max(y))
            for accumulator in accumulators.values():
                extent = accumulator["extent"]
                if (
                    chunk_xmax < extent["xmin"]
                    or chunk_xmin >= extent["xmax"]
                    or chunk_ymax < extent["ymin"]
                    or chunk_ymin >= extent["ymax"]
                ):
                    continue
                keep = (
                    (x >= extent["xmin"])
                    & (x < extent["xmax"])
                    & (y >= extent["ymin"])
                    & (y < extent["ymax"])
                )
                if not np.any(keep):
                    continue
                ix = np.floor(
                    (x[keep] - extent["xmin"]) / lidar_raster_cell_feet
                ).astype(np.int32)
                iy = np.floor(
                    (y[keep] - extent["ymin"]) / lidar_raster_cell_feet
                ).astype(np.int32)
                np.add.at(accumulator["intensitySum"], (iy, ix), intensity[keep])
                np.add.at(accumulator["pointCount"], (iy, ix), 1)
    surfaces: dict[str, dict[str, np.ndarray | float]] = {}
    for candidate_id, accumulator in accumulators.items():
        point_count = accumulator["pointCount"]
        finite = point_count > 0
        if not np.any(finite):
            raise ValueError(f"LiDAR crop is empty for {candidate_id}")
        mean = np.zeros_like(accumulator["intensitySum"], dtype=np.float32)
        mean[finite] = (
            accumulator["intensitySum"][finite] / point_count[finite]
        ).astype(np.float32)
        indices = ndimage.distance_transform_edt(
            ~finite,
            return_distances=False,
            return_indices=True,
        )
        filled = ndimage.gaussian_filter(
            mean[tuple(indices)],
            LIDAR_FILL_SMOOTHING_FEET / lidar_raster_cell_feet,
        )
        high_pass = filled - ndimage.gaussian_filter(
            filled,
            LIDAR_HIGH_PASS_SMOOTHING_FEET / lidar_raster_cell_feet,
        )
        density_window_cells = int(round(
            GROUND_DENSITY_WINDOW_FEET / lidar_raster_cell_feet
        ))
        density = ndimage.uniform_filter(
            point_count.astype(np.float32),
            size=density_window_cells,
            mode="constant",
        ) / (lidar_raster_cell_feet * lidar_raster_cell_feet)
        coverage = density >= MINIMUM_LOCAL_GROUND_POINT_DENSITY_PER_SQUARE_FOOT
        output_width, output_height = accumulator["outputDimensions"]
        high_pass_output = cv2.resize(
            high_pass.astype(np.float32),
            (output_width, output_height),
            interpolation=cv2.INTER_CUBIC,
        )
        coverage_output = cv2.resize(
            coverage.astype(np.uint8),
            (output_width, output_height),
            interpolation=cv2.INTER_NEAREST,
        )
        surfaces[candidate_id] = {
            "highPass": high_pass_output,
            "coverageMask": coverage_output * 255,
            "finiteCellFractionBeforeFill": float(np.mean(finite)),
            "eligibleCellFraction": float(np.mean(coverage)),
        }
    return surfaces


def orthophoto_high_pass(manifest: dict[str, Any]) -> np.ndarray:
    image_path = Path(manifest["imagePath"])
    if sha256_file(image_path) != manifest["imageSha256"]:
        raise ValueError(f"Native crop image checksum mismatch: {image_path}")
    with Image.open(image_path) as source:
        if list(source.size) != manifest["dimensionsPixels"]:
            raise ValueError(f"Native crop dimensions mismatch: {image_path}")
        rgb = np.flipud(np.asarray(source.convert("RGB")))
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32)
    gray = cv2.GaussianBlur(gray, (0, 0), 3.2)
    return gray - ndimage.gaussian_filter(gray, 40.0)


def gradient_magnitude(image: np.ndarray) -> np.ndarray:
    return np.hypot(
        cv2.Sobel(image, cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(image, cv2.CV_32F, 0, 1, ksize=3),
    )


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
    orthophoto_gradient: np.ndarray,
    lidar_gradient: np.ndarray,
    coverage_mask: np.ndarray,
    half_width_feet: float,
) -> dict[str, Any] | None:
    center = np.asarray([
        orthophoto_gradient.shape[1] / 2.0 - 0.5,
        orthophoto_gradient.shape[0] / 2.0 - 0.5,
    ])
    half = int(round(half_width_feet / CELL_FEET))
    search_half = int(round(SEARCH_HALF_WIDTH_FEET / CELL_FEET))
    template = crop_centered(lidar_gradient, center, half)
    mask = crop_centered(coverage_mask, center, half)
    search = crop_centered(orthophoto_gradient, center, half + search_half)
    if template is None or mask is None or search is None:
        return None
    valid = mask > 0
    valid_fraction = float(np.mean(valid))
    if valid_fraction < MINIMUM_VALID_PIXEL_FRACTION:
        return None
    template = template.astype(np.float32)
    template[~valid] = 0.0
    if float(np.std(template[valid])) < 1e-6:
        return None
    response_surface = cv2.matchTemplate(
        search.astype(np.float32),
        template,
        cv2.TM_CCORR_NORMED,
        mask=valid.astype(np.uint8) * 255,
    )
    response_surface = np.nan_to_num(
        response_surface,
        nan=-1.0,
        posinf=-1.0,
        neginf=-1.0,
    )
    _, response, _, location = cv2.minMaxLoc(response_surface)
    location_x, location_y = location
    inside = bool(
        0 < location_x < response_surface.shape[1] - 1
        and 0 < location_y < response_surface.shape[0] - 1
    )
    subpixel_x = quadratic_subpixel(response_surface[location_y, :], location_x)
    subpixel_y = quadratic_subpixel(response_surface[:, location_x], location_y)
    shift = np.asarray([
        location_x + subpixel_x - search_half,
        location_y + subpixel_y - search_half,
    ]) * CELL_FEET
    return {
        "patchHalfWidthFeet": half_width_feet,
        "validPixelFraction": valid_fraction,
        "lidarToOrthophotoShiftFeet": shift.tolist(),
        "shiftNormFeet": float(np.linalg.norm(shift)),
        "matchResponse": float(response),
        "peakInsideSearchWindow": inside,
        "integerPeakLocation": [int(location_x), int(location_y)],
        "subpixelPeakOffsetCells": [subpixel_x, subpixel_y],
    }


def consistent_component(
    estimates: list[dict[str, Any]],
    minimum_consistent_patch_width_count: int,
) -> list[dict[str, Any]]:
    eligible = [
        record
        for record in estimates
        if record["matchResponse"] >= MINIMUM_MATCH_RESPONSE
        and record["peakInsideSearchWindow"]
    ]
    best: list[dict[str, Any]] = []
    for size in range(
        len(eligible),
        minimum_consistent_patch_width_count - 1,
        -1,
    ):
        for subset in itertools.combinations(eligible, size):
            shifts = np.asarray([
                record["lidarToOrthophotoShiftFeet"] for record in subset
            ])
            median = np.median(shifts, axis=0)
            envelope = float(max(CELL_FEET / 2.0, np.max(np.linalg.norm(
                shifts - median,
                axis=1,
            ))))
            if envelope > MAXIMUM_LOCALIZATION_ENVELOPE_FEET:
                continue
            component = list(subset)
            if not best or np.median([
                record["matchResponse"] for record in component
            ]) > np.median([record["matchResponse"] for record in best]):
                best = component
        if best:
            break
    return best


def build_localization(
    controls_path: Path,
    crop_index_path: Path,
    role: str,
    chunk_size: int,
    representation: str,
    patch_half_widths_feet: list[float],
    minimum_consistent_patch_width_count: int,
    lidar_raster_cell_feet: float,
) -> dict[str, Any]:
    controls, controls_sha256 = locked_json(controls_path)
    accepted_lock_states = {
        (
            "reviewed-marlins-2025-full-tile-ground-controls",
            "locked-before-full-tile-ground-localization",
        ),
        (
            "reviewed-marlins-2025-fresh-full-tile-ground-controls",
            "locked-before-fresh-full-tile-ground-localization",
        ),
    }
    if (
        controls.get("artifactKind"),
        controls.get("reviewStatus"),
    ) not in accepted_lock_states:
        raise ValueError("Input is not the locked full-tile ground controls")
    crop_index, crop_index_sha256 = locked_json(crop_index_path)
    if crop_index.get("artifactKind") != (
        "marlins-2025-locked-ground-control-orthophoto-crop-index"
    ):
        raise ValueError("Input is not the locked native ground-crop index")
    if crop_index["controlsSha256"] != controls_sha256:
        raise ValueError("Native crops do not lock the supplied controls")
    if crop_index["offsetsComputedDuringAcquisition"]:
        raise ValueError("Native crop acquisition inspected offsets")
    if crop_index["residualsComputedDuringAcquisition"]:
        raise ValueError("Native crop acquisition inspected residuals")
    control_by_id = {record["candidateId"]: record for record in controls["controls"]}
    selected = [record for record in controls["controls"] if record["role"] == role]
    crop_by_id = {record["candidateId"]: record for record in crop_index["crops"]}
    selected_crops = []
    for control in selected:
        record = crop_by_id.get(control["candidateId"])
        if record is None or record["role"] != role:
            raise ValueError(f"Native crop role mismatch for {control['candidateId']}")
        manifest_path = Path(record["manifestPath"])
        manifest, manifest_sha256 = locked_json(manifest_path)
        if manifest_sha256 != record["manifestSha256"]:
            raise ValueError(f"Native crop manifest checksum mismatch: {manifest_path}")
        if manifest["artifactVersion"] != record["artifactVersion"]:
            raise ValueError(f"Native crop artifact mismatch: {manifest_path}")
        if manifest["candidateId"] != control["candidateId"]:
            raise ValueError(f"Native crop candidate mismatch: {manifest_path}")
        if manifest["lockedStatePlaneFeet"] != control["statePlaneFeet"]:
            raise ValueError(f"Native crop coordinate mismatch: {manifest_path}")
        selected_crops.append({
            "candidateId": control["candidateId"],
            "control": control,
            "indexRecord": record,
            "manifest": manifest,
        })
    lidar_path = Path(controls["inputs"]["comparisonLidar"]["path"])
    if sha256_file(lidar_path) != controls["inputs"]["comparisonLidar"]["sha256"]:
        raise ValueError("Comparison LiDAR checksum mismatch")
    lidar_surfaces = build_lidar_crop_surfaces(
        lidar_path,
        selected_crops,
        chunk_size,
        lidar_raster_cell_feet,
    )
    evaluations = []
    localized = []
    for record in selected_crops:
        candidate_id = record["candidateId"]
        control = control_by_id[candidate_id]
        lidar_surface = lidar_surfaces[candidate_id]
        ortho_high_pass = orthophoto_high_pass(record["manifest"])
        lidar_high_pass = lidar_surface["highPass"]
        if representation == "gradient-magnitude":
            orthophoto_match = gradient_magnitude(ortho_high_pass)
            lidar_match = gradient_magnitude(lidar_high_pass)
        else:
            orthophoto_match = ortho_high_pass
            lidar_match = lidar_high_pass
        estimates = [
            estimate
            for half_width in patch_half_widths_feet
            if (
                estimate := match_patch(
                    orthophoto_match,
                    lidar_match,
                    lidar_surface["coverageMask"],
                    half_width,
                )
            ) is not None
        ]
        component = consistent_component(
            estimates,
            minimum_consistent_patch_width_count,
        )
        consensus = None
        if len(component) >= minimum_consistent_patch_width_count:
            shifts = np.asarray([
                estimate["lidarToOrthophotoShiftFeet"] for estimate in component
            ])
            median = np.median(shifts, axis=0)
            distances = np.linalg.norm(shifts - median, axis=1)
            envelope = float(max(CELL_FEET / 2.0, float(np.max(distances))))
            nominal = np.asarray(control["statePlaneFeet"], dtype=float)
            consensus = {
                "passes": envelope <= MAXIMUM_LOCALIZATION_ENVELOPE_FEET,
                "consistentPatchWidthCount": len(component),
                "medianLidarToOrthophotoShiftFeet": median.tolist(),
                "maximumCrossWidthDistanceFeet": float(np.max(distances)),
                "medianMatchResponse": float(np.median([
                    estimate["matchResponse"] for estimate in component
                ])),
                "localizationEnvelopeFeet": envelope,
                "lidarStatePlaneFeet": nominal.tolist(),
                "orthophotoStatePlaneFeet": (nominal + median).tolist(),
            }
            if consensus["passes"]:
                localized.append({
                    "candidateId": candidate_id,
                    "role": role,
                    "semanticIdentity": control["semanticIdentity"],
                    **consensus,
                })
        evaluations.append({
            "candidateId": candidate_id,
            "role": role,
            "semanticIdentity": control["semanticIdentity"],
            "nativeCrop": record["indexRecord"],
            "lidarFiniteCellFractionBeforeFill": lidar_surface[
                "finiteCellFractionBeforeFill"
            ],
            "lidarEligibleCellFraction": lidar_surface["eligibleCellFraction"],
            "patchEstimates": estimates,
            "consensus": consensus,
        })
    blockers = []
    if len(localized) < 6:
        blockers.append("FEWER_THAN_SIX_CONTROLS_PASS_NATIVE_LOCALIZATION_GATE")
    if role == "training":
        blockers.extend([
            "REGISTRATION_MODEL_NOT_YET_SELECTED_FROM_TRAINING_ONLY",
            "FINAL_HOLDOUTS_NOT_YET_LOCALIZED_OR_SCORED",
        ])
    else:
        blockers.append("FINAL_HOLDOUT_RESIDUALS_NOT_YET_SCORED")
    blockers.append("INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED")
    stable = {
        "controlsSha256": controls_sha256,
        "cropIndexSha256": crop_index_sha256,
        "role": role,
        "representation": representation,
        "parameters": {
            "cellFeet": CELL_FEET,
            "lidarRasterCellFeet": lidar_raster_cell_feet,
            "lidarFillSmoothingFeet": LIDAR_FILL_SMOOTHING_FEET,
            "lidarHighPassSmoothingFeet": LIDAR_HIGH_PASS_SMOOTHING_FEET,
            "patchHalfWidthsFeet": patch_half_widths_feet,
            "searchHalfWidthFeet": SEARCH_HALF_WIDTH_FEET,
            "groundDensityWindowFeet": GROUND_DENSITY_WINDOW_FEET,
            "minimumLocalGroundPointDensityPerSquareFoot": (
                MINIMUM_LOCAL_GROUND_POINT_DENSITY_PER_SQUARE_FOOT
            ),
            "minimumValidPixelFraction": MINIMUM_VALID_PIXEL_FRACTION,
            "minimumMatchResponse": MINIMUM_MATCH_RESPONSE,
            "minimumConsistentPatchWidthCount": (
                minimum_consistent_patch_width_count
            ),
            "maximumLocalizationEnvelopeFeet": MAXIMUM_LOCALIZATION_ENVELOPE_FEET,
        },
        "localizedControls": localized,
        "evaluations": evaluations,
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": (
            ANALYSIS_VERSIONS[representation]
            + f"-lidar-cell-{lidar_raster_cell_feet:g}-feet"
        ),
        "artifactKind": "marlins-2025-native-ground-localization",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "role": role,
        "inputs": {
            "controls": {
                "path": str(controls_path),
                "sha256": controls_sha256,
                "artifactVersion": controls["artifactVersion"],
            },
            "nativeCropIndex": {
                "path": str(crop_index_path),
                "sha256": crop_index_sha256,
                "artifactVersion": crop_index["artifactVersion"],
            },
            "orthophotoAudit": controls["inputs"]["orthophotoAudit"],
            "comparisonLidar": controls["inputs"]["comparisonLidar"],
        },
        "predeclaredLocalizationMethod": {
            "correlation": CORRELATION_METHODS[representation],
            "registrationModelSelected": False,
            "finalHoldoutOffsetsMayNotInfluenceModelSelection": True,
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
    parser.add_argument("crop_index", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--role", choices=("training", "final-holdout"), required=True)
    parser.add_argument(
        "--representation",
        choices=("signed", "gradient-magnitude"),
        default="signed",
    )
    parser.add_argument(
        "--patch-half-widths-feet",
        default=",".join(str(value) for value in PATCH_HALF_WIDTHS_FEET),
    )
    parser.add_argument(
        "--minimum-consistent-patch-width-count",
        type=int,
        default=MINIMUM_CONSISTENT_PATCH_WIDTH_COUNT,
    )
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    parser.add_argument(
        "--lidar-raster-cell-feet",
        type=float,
        default=LIDAR_RASTER_CELL_FEET,
    )
    arguments = parser.parse_args()
    patch_half_widths_feet = [
        float(value)
        for value in arguments.patch_half_widths_feet.split(",")
        if value.strip()
    ]
    if len(set(patch_half_widths_feet)) != len(patch_half_widths_feet):
        raise ValueError("Patch half-widths must be distinct")
    if min(patch_half_widths_feet) <= SEARCH_HALF_WIDTH_FEET:
        raise ValueError("Patch half-widths must exceed the search half-width")
    if arguments.minimum_consistent_patch_width_count < 2:
        raise ValueError("At least two consistent patch widths are required")
    if arguments.lidar_raster_cell_feet <= 0:
        raise ValueError("LiDAR raster cell size must be positive")
    if CELL_FEET / arguments.lidar_raster_cell_feet < 1.0:
        raise ValueError("LiDAR raster may not be coarser than the output cell size")
    output_scale = CELL_FEET / arguments.lidar_raster_cell_feet
    if abs(output_scale - round(output_scale)) > 1e-9:
        raise ValueError("Output cell size must be an integer multiple of LiDAR cell size")
    if (
        arguments.minimum_consistent_patch_width_count
        > len(patch_half_widths_feet)
    ):
        raise ValueError("Consistency count exceeds the patch-width count")
    artifact = build_localization(
        arguments.controls,
        arguments.crop_index,
        arguments.role,
        arguments.chunk_size,
        arguments.representation,
        patch_half_widths_feet,
        arguments.minimum_consistent_patch_width_count,
        arguments.lidar_raster_cell_feet,
    )
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
