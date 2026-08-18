#!/usr/bin/env python3
"""Develop a rigid registration from native quarter-foot response surfaces.

This artifact is development-only. Its final-holdout controls were consumed by
earlier experiments and may never be reused for a publication decision.
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
from scipy import ndimage, optimize

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file
from localizeMarlins2025NativeGroundControls import (
    CELL_FEET,
    MINIMUM_VALID_PIXEL_FRACTION,
    build_lidar_crop_surfaces,
    crop_centered,
    gradient_magnitude,
    locked_json,
    orthophoto_high_pass,
)


ANALYSIS_VERSION = "marlins-native-aggregate-ground-registration-development-v1"
PATCH_HALF_WIDTHS_FEET = (20.0, 25.0, 30.0, 35.0, 40.0, 45.0, 55.0, 65.0, 75.0)
SEARCH_HALF_WIDTH_FEET = 3.0
LIDAR_RASTER_CELL_FEET = 0.25
ROBUST_KEEP_FRACTION = 0.75
TRANSLATION_BOUND_FEET = 3.0
ROTATION_BOUND_DEGREES = 0.05
ANCHOR_STATE_PLANE_FEET = np.asarray([913125.0, 525625.0])
MINIMUM_SURFACES_PER_ROLE = 12
MINIMUM_SEMANTIC_COHORT_SURFACES_PER_ROLE = 5


def normalized_surface(surface: np.ndarray) -> np.ndarray:
    finite = surface[np.isfinite(surface)]
    if not finite.size:
        raise ValueError("Correlation surface contains no finite values")
    median = float(np.median(finite))
    mad = float(np.median(np.abs(finite - median)))
    scale = max(1.4826 * mad, 0.01)
    return np.clip((surface - median) / scale, -5.0, 5.0)


def response_surface(
    orthophoto_gradient: np.ndarray,
    lidar_gradient: np.ndarray,
    coverage_mask: np.ndarray,
) -> dict[str, Any] | None:
    center = np.asarray([
        orthophoto_gradient.shape[1] / 2.0 - 0.5,
        orthophoto_gradient.shape[0] / 2.0 - 0.5,
    ])
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
        expected_shape = (2 * search_half + 1, 2 * search_half + 1)
        if raw.shape != expected_shape:
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
    if len(surfaces) < 3:
        return None
    combined = np.mean(np.stack(surfaces), axis=0)
    return {"surface": combined, "patchDiagnostics": diagnostics}


def predicted_shift(parameters: np.ndarray, point: np.ndarray) -> np.ndarray:
    theta = math.radians(float(parameters[2]))
    relative = point - ANCHOR_STATE_PLANE_FEET
    return parameters[:2] + np.asarray([-theta * relative[1], theta * relative[0]])


def sample_surface(surface: np.ndarray, shift: np.ndarray) -> float:
    search_half = int(round(SEARCH_HALF_WIDTH_FEET / CELL_FEET))
    column = float(shift[0] / CELL_FEET + search_half)
    row = float(shift[1] / CELL_FEET + search_half)
    if (
        row < 0.0
        or column < 0.0
        or row > surface.shape[0] - 1
        or column > surface.shape[1] - 1
    ):
        return -10.0
    return float(ndimage.map_coordinates(
        surface,
        [[row], [column]],
        order=3,
        mode="nearest",
        prefilter=True,
    )[0])


def objective(parameters: np.ndarray, records: list[dict[str, Any]]) -> float:
    scores = np.asarray([
        sample_surface(record["surface"], predicted_shift(parameters, record["point"]))
        for record in records
    ])
    keep = max(3, int(math.ceil(len(scores) * ROBUST_KEEP_FRACTION)))
    return -float(np.mean(np.sort(scores)[-keep:]))


def fit(
    records: list[dict[str, Any]],
    *,
    initial: np.ndarray | None = None,
    global_search: bool = True,
) -> dict[str, Any]:
    bounds = [
        (-TRANSLATION_BOUND_FEET, TRANSLATION_BOUND_FEET),
        (-TRANSLATION_BOUND_FEET, TRANSLATION_BOUND_FEET),
        (-ROTATION_BOUND_DEGREES, ROTATION_BOUND_DEGREES),
    ]
    if global_search:
        global_fit = optimize.differential_evolution(
            objective,
            bounds,
            args=(records,),
            seed=20260812,
            popsize=24,
            tol=1e-10,
            polish=False,
            workers=1,
        )
        initial = np.asarray(global_fit.x, dtype=float)
    if initial is None:
        raise ValueError("A local fit requires an initial parameter vector")
    refined = optimize.minimize(
        objective,
        initial,
        args=(records,),
        method="Nelder-Mead",
        options={"xatol": 1e-9, "fatol": 1e-9, "maxiter": 20_000},
    )
    parameters = np.asarray(refined.x, dtype=float)
    per_control = []
    for record in records:
        shift = predicted_shift(parameters, record["point"])
        surface = record["surface"]
        peak_index = np.unravel_index(int(np.argmax(surface)), surface.shape)
        search_half = int(round(SEARCH_HALF_WIDTH_FEET / CELL_FEET))
        peak_shift = np.asarray([
            (peak_index[1] - search_half) * CELL_FEET,
            (peak_index[0] - search_half) * CELL_FEET,
        ])
        per_control.append({
            "candidateId": record["candidateId"],
            "semanticIdentity": record["semanticIdentity"],
            "predictedShiftFeet": shift.tolist(),
            "aggregateSurfaceScoreAtPrediction": sample_surface(surface, shift),
            "integerPeakShiftFeet": peak_shift.tolist(),
            "distanceToArbitraryIndividualPeakFeet": float(np.linalg.norm(
                shift - peak_shift
            )),
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


def parameter_vector(fit_record: dict[str, Any]) -> np.ndarray:
    parameters = fit_record["parameters"]
    return np.asarray([
        *parameters["anchorTranslationFeet"],
        parameters["cartesianCounterclockwiseDegrees"],
    ])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("crop_index", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    arguments = parser.parse_args()

    controls, controls_sha256 = locked_json(arguments.controls)
    if controls.get("artifactKind") not in {
        "reviewed-marlins-2025-full-tile-ground-controls",
        "reviewed-marlins-2025-fresh-full-tile-ground-controls",
    }:
        raise ValueError("Input is not a reviewed Marlins ground-control lock")
    crop_index, crop_index_sha256 = locked_json(arguments.crop_index)
    if crop_index.get("artifactKind") != (
        "marlins-2025-locked-ground-control-orthophoto-crop-index"
    ):
        raise ValueError("Input is not the locked native ground-crop index")
    if crop_index["controlsSha256"] != controls_sha256:
        raise ValueError("Native crops do not lock the supplied controls")
    if crop_index["offsetsComputedDuringAcquisition"]:
        raise ValueError("Crop acquisition inspected offsets")
    if crop_index["residualsComputedDuringAcquisition"]:
        raise ValueError("Crop acquisition inspected residuals")

    controls_by_id = {
        record["candidateId"]: record for record in controls["controls"]
    }
    crop_records = []
    for index_record in crop_index["crops"]:
        manifest_path = Path(index_record["manifestPath"])
        manifest, manifest_sha256 = locked_json(manifest_path)
        if manifest_sha256 != index_record["manifestSha256"]:
            raise ValueError(f"Native crop checksum mismatch: {manifest_path}")
        if manifest["artifactVersion"] != index_record["artifactVersion"]:
            raise ValueError(f"Native crop artifact mismatch: {manifest_path}")
        control = controls_by_id[index_record["candidateId"]]
        if control["role"] != index_record["role"]:
            raise ValueError(f"Native crop role mismatch: {manifest_path}")
        crop_records.append({
            "candidateId": control["candidateId"],
            "control": control,
            "indexRecord": index_record,
            "manifest": manifest,
        })

    lidar_path = Path(controls["inputs"]["comparisonLidar"]["path"])
    if sha256_file(lidar_path) != controls["inputs"]["comparisonLidar"]["sha256"]:
        raise ValueError("Comparison LiDAR checksum mismatch")
    lidar_surfaces = build_lidar_crop_surfaces(
        lidar_path,
        crop_records,
        arguments.chunk_size,
        LIDAR_RASTER_CELL_FEET,
    )
    records = []
    failed = []
    for crop_record in crop_records:
        candidate_id = crop_record["candidateId"]
        lidar_surface = lidar_surfaces[candidate_id]
        response = response_surface(
            gradient_magnitude(orthophoto_high_pass(crop_record["manifest"])),
            gradient_magnitude(lidar_surface["highPass"]),
            lidar_surface["coverageMask"],
        )
        control = crop_record["control"]
        if response is None:
            failed.append({
                "candidateId": candidate_id,
                "role": control["role"],
                "semanticIdentity": control["semanticIdentity"],
            })
            continue
        records.append({
            "candidateId": candidate_id,
            "role": control["role"],
            "semanticIdentity": control["semanticIdentity"],
            "point": np.asarray(control["statePlaneFeet"], dtype=float),
            "surface": response["surface"],
            "patchDiagnostics": response["patchDiagnostics"],
        })
    training = [record for record in records if record["role"] == "training"]
    holdout = [record for record in records if record["role"] == "final-holdout"]
    if len(training) < MINIMUM_SURFACES_PER_ROLE:
        raise ValueError("Too few training response surfaces")
    if len(holdout) < MINIMUM_SURFACES_PER_ROLE:
        raise ValueError("Too few consumed-holdout response surfaces")

    training_fit = fit(training)
    holdout_fit = fit(holdout)
    training_parameters = parameter_vector(training_fit)
    holdout_parameters = parameter_vector(holdout_fit)
    anchor_disagreement = float(np.linalg.norm(
        training_parameters[:2] - holdout_parameters[:2]
    ))
    rotation_disagreement = abs(float(
        training_parameters[2] - holdout_parameters[2]
    ))
    holdout_score_at_training = -objective(training_parameters, holdout)
    holdout_best_score = -objective(holdout_parameters, holdout)

    fixed_curb_training = [
        record for record in training
        if "curb" in record["semanticIdentity"].lower()
    ]
    fixed_curb_holdout = [
        record for record in holdout
        if "curb" in record["semanticIdentity"].lower()
    ]
    fixed_curb_comparison = None
    if (
        len(fixed_curb_training) >= MINIMUM_SEMANTIC_COHORT_SURFACES_PER_ROLE
        and len(fixed_curb_holdout) >= MINIMUM_SEMANTIC_COHORT_SURFACES_PER_ROLE
    ):
        fixed_curb_training_fit = fit(fixed_curb_training)
        fixed_curb_holdout_fit = fit(fixed_curb_holdout)
        fixed_curb_training_parameters = parameter_vector(fixed_curb_training_fit)
        fixed_curb_holdout_parameters = parameter_vector(fixed_curb_holdout_fit)
        fixed_curb_comparison = {
            "semanticSelectionRule": "case-insensitive semanticIdentity contains curb",
            "trainingFit": fixed_curb_training_fit,
            "consumedHoldoutDiagnosticFit": fixed_curb_holdout_fit,
            "anchorTranslationDisagreementFeet": float(np.linalg.norm(
                fixed_curb_training_parameters[:2]
                - fixed_curb_holdout_parameters[:2]
            )),
            "rotationDisagreementDegrees": abs(float(
                fixed_curb_training_parameters[2]
                - fixed_curb_holdout_parameters[2]
            )),
        }

    holdout_leave_one_out = []
    for omitted_index, omitted in enumerate(holdout):
        retained = [
            record for index, record in enumerate(holdout) if index != omitted_index
        ]
        local_fit = fit(
            retained,
            initial=holdout_parameters,
            global_search=False,
        )
        vector = parameter_vector(local_fit)
        holdout_leave_one_out.append({
            "omittedCandidateId": omitted["candidateId"],
            "anchorTranslationFeet": vector[:2].tolist(),
            "cartesianCounterclockwiseDegrees": float(vector[2]),
            "anchorDistanceFromFullHoldoutFitFeet": float(np.linalg.norm(
                vector[:2] - holdout_parameters[:2]
            )),
            "rotationDistanceFromFullHoldoutFitDegrees": abs(float(
                vector[2] - holdout_parameters[2]
            )),
        })

    stable = {
        "controlsSha256": controls_sha256,
        "cropIndexSha256": crop_index_sha256,
        "lidarSha256": sha256_file(lidar_path),
        "parameters": {
            "orthophotoCellFeet": CELL_FEET,
            "lidarRasterCellFeet": LIDAR_RASTER_CELL_FEET,
            "patchHalfWidthsFeet": list(PATCH_HALF_WIDTHS_FEET),
            "searchHalfWidthFeet": SEARCH_HALF_WIDTH_FEET,
            "minimumValidPixelFraction": MINIMUM_VALID_PIXEL_FRACTION,
            "robustKeepFraction": ROBUST_KEEP_FRACTION,
            "translationBoundFeet": TRANSLATION_BOUND_FEET,
            "rotationBoundDegrees": ROTATION_BOUND_DEGREES,
            "anchorStatePlaneFeet": ANCHOR_STATE_PLANE_FEET.tolist(),
        },
        "trainingFit": training_fit,
        "consumedHoldoutDiagnosticFit": holdout_fit,
        "fixedCurbSemanticCohortDiagnostic": fixed_curb_comparison,
        "consumedHoldoutLeaveOneOut": holdout_leave_one_out,
        "comparison": {
            "anchorTranslationDisagreementFeet": anchor_disagreement,
            "rotationDisagreementDegrees": rotation_disagreement,
            "holdoutAggregateScoreAtFrozenTraining": holdout_score_at_training,
            "holdoutAggregateBestScore": holdout_best_score,
            "holdoutScoreRegret": holdout_best_score - holdout_score_at_training,
            "maximumHoldoutLeaveOneOutAnchorDistanceFeet": max(
                record["anchorDistanceFromFullHoldoutFitFeet"]
                for record in holdout_leave_one_out
            ),
            "maximumHoldoutLeaveOneOutRotationDistanceDegrees": max(
                record["rotationDistanceFromFullHoldoutFitDegrees"]
                for record in holdout_leave_one_out
            ),
        },
        "failedSurfaceControls": failed,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-native-aggregate-ground-registration-development",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controls": {
                "path": str(arguments.controls),
                "sha256": controls_sha256,
                "artifactVersion": controls["artifactVersion"],
            },
            "nativeCropIndex": {
                "path": str(arguments.crop_index),
                "sha256": crop_index_sha256,
                "artifactVersion": crop_index["artifactVersion"],
            },
            "comparisonLidar": controls["inputs"]["comparisonLidar"],
            "orthophotoAudit": controls["inputs"]["orthophotoAudit"],
        },
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
        "consumedHoldoutDiagnosticFit": holdout_fit["parameters"],
        "comparison": stable["comparison"],
        "fixedCurbSemanticCohortDiagnostic": fixed_curb_comparison,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
