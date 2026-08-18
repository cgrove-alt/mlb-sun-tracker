#!/usr/bin/env python3
"""Develop aggregate rigid registration from full ground-patch response surfaces."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from scipy import ndimage, optimize

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file
from buildMarlins2025OrthoGroundControlQueue import (
    CELL_FEET,
    build_ground_intensity,
    build_orthophoto,
)


PATCH_HALF_WIDTHS_FEET = (35.0, 55.0, 75.0)
SEARCH_HALF_WIDTH_FEET = 4.0
MINIMUM_VALID_PIXEL_FRACTION = 0.20
ROBUST_KEEP_FRACTION = 0.75
TRANSLATION_BOUND_FEET = 3.0
ROTATION_BOUND_DEGREES = 0.05
ANCHOR_STATE_PLANE_FEET = np.asarray([913125.0, 525625.0])


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def crop_centered(image: np.ndarray, center: np.ndarray, half_width: int) -> np.ndarray | None:
    center_x = int(round(float(center[0])))
    center_y = int(round(float(center[1])))
    x0 = center_x - half_width
    x1 = center_x + half_width
    y0 = center_y - half_width
    y1 = center_y + half_width
    if x0 < 0 or y0 < 0 or x1 > image.shape[1] or y1 > image.shape[0]:
        return None
    return image[y0:y1, x0:x1]


def normalized_surface(surface: np.ndarray) -> np.ndarray:
    finite = surface[np.isfinite(surface)]
    if finite.size == 0:
        raise ValueError("Correlation surface contains no finite values")
    median = float(np.median(finite))
    mad = float(np.median(np.abs(finite - median)))
    scale = max(1.4826 * mad, 0.01)
    return np.clip((surface - median) / scale, -5.0, 5.0)


def response_surface(
    orthophoto_gradient: np.ndarray,
    lidar_gradient: np.ndarray,
    coverage_mask: np.ndarray,
    center: np.ndarray,
) -> dict[str, Any] | None:
    search_half = int(round(SEARCH_HALF_WIDTH_FEET / CELL_FEET))
    surfaces = []
    diagnostics = []
    for half_width_feet in PATCH_HALF_WIDTHS_FEET:
        half = int(round(half_width_feet / CELL_FEET))
        template = crop_centered(lidar_gradient, center, half)
        mask = crop_centered(coverage_mask, center, half)
        search = crop_centered(orthophoto_gradient, center, half + search_half)
        if template is None or mask is None or search is None:
            continue
        valid = mask > 0
        valid_fraction = float(np.mean(valid))
        if valid_fraction < MINIMUM_VALID_PIXEL_FRACTION:
            continue
        template = template.astype(np.float32)
        template[~valid] = 0.0
        if float(np.std(template[valid])) < 1e-6:
            continue
        raw = cv2.matchTemplate(
            search.astype(np.float32),
            template,
            cv2.TM_CCORR_NORMED,
            mask=valid.astype(np.uint8) * 255,
        )
        raw = np.nan_to_num(raw, nan=-1.0, posinf=-1.0, neginf=-1.0)
        if raw.shape != (2 * search_half + 1, 2 * search_half + 1):
            raise ValueError(f"Unexpected response surface shape: {raw.shape}")
        surfaces.append(normalized_surface(raw))
        maximum_index = np.unravel_index(int(np.argmax(raw)), raw.shape)
        diagnostics.append({
            "patchHalfWidthFeet": half_width_feet,
            "validPixelFraction": valid_fraction,
            "rawMinimum": float(np.min(raw)),
            "rawMedian": float(np.median(raw)),
            "rawMaximum": float(np.max(raw)),
            "integerPeakShiftFeet": [
                float((maximum_index[1] - search_half) * CELL_FEET),
                float((maximum_index[0] - search_half) * CELL_FEET),
            ],
        })
    if len(surfaces) < 2:
        return None
    combined = np.mean(np.stack(surfaces), axis=0)
    return {"surface": combined, "patchDiagnostics": diagnostics}


def predicted_shift(parameters: np.ndarray, point: np.ndarray) -> np.ndarray:
    translation = parameters[:2]
    theta = math.radians(float(parameters[2]))
    relative = point - ANCHOR_STATE_PLANE_FEET
    return translation + np.asarray([-theta * relative[1], theta * relative[0]])


def sample_surface(surface: np.ndarray, shift: np.ndarray) -> float:
    search_half = int(round(SEARCH_HALF_WIDTH_FEET / CELL_FEET))
    column = float(shift[0] / CELL_FEET + search_half)
    row = float(shift[1] / CELL_FEET + search_half)
    if row < 0 or column < 0 or row > surface.shape[0] - 1 or column > surface.shape[1] - 1:
        return -10.0
    return float(ndimage.map_coordinates(surface, [[row], [column]], order=1, mode="nearest")[0])


def objective(parameters: np.ndarray, records: list[dict[str, Any]]) -> float:
    scores = np.asarray([
        sample_surface(record["surface"], predicted_shift(parameters, record["point"]))
        for record in records
    ])
    keep = max(3, int(math.ceil(len(scores) * ROBUST_KEEP_FRACTION)))
    retained = np.sort(scores)[-keep:]
    return -float(np.mean(retained))


def fit(records: list[dict[str, Any]]) -> dict[str, Any]:
    bounds = [
        (-TRANSLATION_BOUND_FEET, TRANSLATION_BOUND_FEET),
        (-TRANSLATION_BOUND_FEET, TRANSLATION_BOUND_FEET),
        (-ROTATION_BOUND_DEGREES, ROTATION_BOUND_DEGREES),
    ]
    global_fit = optimize.differential_evolution(
        objective,
        bounds,
        args=(records,),
        seed=20260812,
        popsize=20,
        tol=1e-9,
        polish=False,
        workers=1,
    )
    refined = optimize.minimize(
        objective,
        global_fit.x,
        args=(records,),
        method="Nelder-Mead",
        options={"xatol": 1e-8, "fatol": 1e-8, "maxiter": 10_000},
    )
    parameters = np.asarray(refined.x, dtype=float)
    per_control = []
    for record in records:
        shift = predicted_shift(parameters, record["point"])
        score = sample_surface(record["surface"], shift)
        peak_index = np.unravel_index(int(np.argmax(record["surface"])), record["surface"].shape)
        search_half = int(round(SEARCH_HALF_WIDTH_FEET / CELL_FEET))
        peak_shift = np.asarray([
            (peak_index[1] - search_half) * CELL_FEET,
            (peak_index[0] - search_half) * CELL_FEET,
        ])
        per_control.append({
            "candidateId": record["candidateId"],
            "semanticIdentity": record["semanticIdentity"],
            "predictedShiftFeet": shift.tolist(),
            "aggregateSurfaceScoreAtPrediction": score,
            "integerPeakShiftFeet": peak_shift.tolist(),
            "distanceToArbitraryIndividualPeakFeet": float(np.linalg.norm(shift - peak_shift)),
        })
    return {
        "parameters": {
            "anchorTranslationFeet": parameters[:2].tolist(),
            "cartesianCounterclockwiseDegrees": float(parameters[2]),
            "trueBearingCorrectionDegrees": float(-parameters[2]),
        },
        "objective": float(objective(parameters, records)),
        "controlCount": len(records),
        "controls": per_control,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--controls", action="append", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    arguments = parser.parse_args()
    controls_inputs = []
    controls = []
    common_queue = None
    for batch_index, path in enumerate(arguments.controls, start=1):
        artifact, digest = locked_json(path)
        if artifact.get("artifactKind") != "reviewed-marlins-2025-fresh-full-tile-ground-controls":
            raise ValueError(f"Unexpected control artifact: {path}")
        controls_inputs.append({
            "path": str(path),
            "sha256": digest,
            "artifactVersion": artifact["artifactVersion"],
        })
        controls.extend({**control, "sourceBatch": batch_index} for control in artifact["controls"])
        if common_queue is None:
            common_queue = artifact
    if common_queue is None:
        raise ValueError("No controls supplied")
    mosaic_path = Path(common_queue["inputs"]["mosaicManifest"]["path"])
    mosaic, mosaic_sha256 = locked_json(mosaic_path)
    lidar_path = Path(common_queue["inputs"]["comparisonLidar"]["path"])
    if sha256_file(lidar_path) != common_queue["inputs"]["comparisonLidar"]["sha256"]:
        raise ValueError("Comparison LiDAR checksum mismatch")
    raster = mosaic["raster"]
    raster_path = Path(raster["path"])
    if sha256_file(raster_path) != raster["sha256"]:
        raise ValueError("Orthophoto checksum mismatch")
    extent = {key: float(value) for key, value in raster["extent"].items()}
    lidar = build_ground_intensity(lidar_path, extent, arguments.chunk_size)
    orthophoto = build_orthophoto(
        raster_path,
        float(raster["pixelSizeX"]),
        raster["dimensionsPixels"],
        lidar["coverageMask"],
    )
    signed_orthophoto = orthophoto["featureImage"].astype(np.float32) - 128.0
    signed_lidar = lidar["featureImage"].astype(np.float32) - 128.0
    orthophoto_gradient = np.hypot(
        cv2.Sobel(signed_orthophoto, cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(signed_orthophoto, cv2.CV_32F, 0, 1, ksize=3),
    )
    lidar_gradient = np.hypot(
        cv2.Sobel(signed_lidar, cv2.CV_32F, 1, 0, ksize=3),
        cv2.Sobel(signed_lidar, cv2.CV_32F, 0, 1, ksize=3),
    )
    records = []
    failed = []
    for control in controls:
        point = np.asarray(control["statePlaneFeet"], dtype=float)
        center = np.asarray([
            (point[0] - extent["xmin"]) / CELL_FEET,
            (point[1] - extent["ymin"]) / CELL_FEET,
        ])
        response = response_surface(
            orthophoto_gradient,
            lidar_gradient,
            lidar["coverageMask"],
            center,
        )
        if response is None:
            failed.append({
                "candidateId": f"batch-{control['sourceBatch']}:{control['candidateId']}",
                "role": control["role"],
                "semanticIdentity": control["semanticIdentity"],
            })
            continue
        records.append({
            "candidateId": f"batch-{control['sourceBatch']}:{control['candidateId']}",
            "role": control["role"],
            "semanticIdentity": control["semanticIdentity"],
            "point": point,
            "surface": response["surface"],
            "patchDiagnostics": response["patchDiagnostics"],
        })
    training = [record for record in records if record["role"] == "training"]
    holdout = [record for record in records if record["role"] == "final-holdout"]
    if len(training) < 12 or len(holdout) < 12:
        raise ValueError("Too few development training or holdout surfaces")
    training_fit = fit(training)
    holdout_diagnostic_fit = fit(holdout)
    training_parameters = np.asarray([
        *training_fit["parameters"]["anchorTranslationFeet"],
        training_fit["parameters"]["cartesianCounterclockwiseDegrees"],
    ])
    holdout_parameters = np.asarray([
        *holdout_diagnostic_fit["parameters"]["anchorTranslationFeet"],
        holdout_diagnostic_fit["parameters"]["cartesianCounterclockwiseDegrees"],
    ])
    anchor_disagreement = float(np.linalg.norm(training_parameters[:2] - holdout_parameters[:2]))
    rotation_disagreement = abs(float(training_parameters[2] - holdout_parameters[2]))
    holdout_score_at_frozen_training = -objective(training_parameters, holdout)
    holdout_best_score = -objective(holdout_parameters, holdout)
    stable = {
        "controls": controls_inputs,
        "mosaicSha256": mosaic_sha256,
        "lidarSha256": sha256_file(lidar_path),
        "parameters": {
            "cellFeet": CELL_FEET,
            "patchHalfWidthsFeet": list(PATCH_HALF_WIDTHS_FEET),
            "searchHalfWidthFeet": SEARCH_HALF_WIDTH_FEET,
            "minimumValidPixelFraction": MINIMUM_VALID_PIXEL_FRACTION,
            "robustKeepFraction": ROBUST_KEEP_FRACTION,
            "translationBoundFeet": TRANSLATION_BOUND_FEET,
            "rotationBoundDegrees": ROTATION_BOUND_DEGREES,
            "anchorStatePlaneFeet": ANCHOR_STATE_PLANE_FEET.tolist(),
        },
        "trainingFit": training_fit,
        "consumedHoldoutDiagnosticFit": holdout_diagnostic_fit,
        "comparison": {
            "anchorTranslationDisagreementFeet": anchor_disagreement,
            "rotationDisagreementDegrees": rotation_disagreement,
            "holdoutAggregateScoreAtFrozenTraining": holdout_score_at_frozen_training,
            "holdoutAggregateBestScore": holdout_best_score,
            "holdoutScoreRegret": holdout_best_score - holdout_score_at_frozen_training,
        },
        "failedSurfaceControls": failed,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "marlins-aggregate-ground-response-registration-development-v1",
        "artifactKind": "marlins-aggregate-ground-response-registration-development",
        "artifactVersion": artifact_version(stable),
        **stable,
        "assessment": {
            "developmentOnly": True,
            "existingHoldoutsConsumedAndIneligibleForPublicationReuse": True,
            "publicationEligible": False,
            "blockers": [
                "METHOD_NOT_YET_FROZEN",
                "FRESH_TRAINING_AND_FINAL_HOLDOUT_CONTROLS_NOT_YET_LOCKED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "trainingControlCount": len(training),
        "consumedHoldoutControlCount": len(holdout),
        "trainingFit": training_fit["parameters"],
        "consumedHoldoutDiagnosticFit": holdout_diagnostic_fit["parameters"],
        "comparison": artifact["comparison"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
