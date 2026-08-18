#!/usr/bin/env python3
"""Audit the frozen Marlins hard-curb model on untouched final holdouts."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file
from developMarlinsNativeAggregateGroundRegistration import (
    ANCHOR_STATE_PLANE_FEET,
    LIDAR_RASTER_CELL_FEET,
    PATCH_HALF_WIDTHS_FEET,
    ROBUST_KEEP_FRACTION,
    ROTATION_BOUND_DEGREES,
    SEARCH_HALF_WIDTH_FEET,
    TRANSLATION_BOUND_FEET,
    fit,
    gradient_magnitude,
    objective,
    parameter_vector,
    response_surface,
)
from localizeMarlins2025NativeGroundControls import (
    CELL_FEET,
    MINIMUM_VALID_PIXEL_FRACTION,
    build_lidar_crop_surfaces,
    locked_json,
    orthophoto_high_pass,
)


ANALYSIS_VERSION = "marlins-2025-fresh-hard-curb-final-holdout-audit-v1"
EXPECTED_FINAL_HOLDOUT_COUNT = 12
MAXIMUM_LEAVE_ONE_OUT_ANCHOR_DISTANCE_FEET = 0.30
MAXIMUM_LEAVE_ONE_OUT_ROTATION_DISTANCE_DEGREES = 0.02
MAXIMUM_ABSOLUTE_HORIZONTAL_FEET = 1.0
MAXIMUM_ABSOLUTE_VERTICAL_FEET = 1.0
MAXIMUM_ABSOLUTE_ORIENTATION_DEGREES = 1.0
VERTICAL_UNCERTAINTY_95_FEET = 0.6430446194056058


def locked_bytes(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def load_final_records(
    controls: dict[str, Any],
    crop_index: dict[str, Any],
    chunk_size: int,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    controls_by_id = {
        record["candidateId"]: record for record in controls["controls"]
    }
    selected = [
        record
        for record in controls["controls"]
        if record["role"] == "final-holdout"
    ]
    crop_by_id = {record["candidateId"]: record for record in crop_index["crops"]}
    crop_records = []
    for control in selected:
        index_record = crop_by_id.get(control["candidateId"])
        if index_record is None or index_record["role"] != "final-holdout":
            raise ValueError(f"Missing final-holdout crop: {control['candidateId']}")
        manifest_path = Path(index_record["manifestPath"])
        manifest, manifest_sha256 = locked_json(manifest_path)
        if manifest_sha256 != index_record["manifestSha256"]:
            raise ValueError(f"Final crop manifest checksum mismatch: {manifest_path}")
        if manifest["artifactVersion"] != index_record["artifactVersion"]:
            raise ValueError(f"Final crop artifact mismatch: {manifest_path}")
        if manifest["candidateId"] != control["candidateId"]:
            raise ValueError(f"Final crop candidate mismatch: {manifest_path}")
        if manifest["lockedStatePlaneFeet"] != control["statePlaneFeet"]:
            raise ValueError(f"Final crop coordinate mismatch: {manifest_path}")
        crop_records.append({
            "candidateId": control["candidateId"],
            "control": control,
            "indexRecord": index_record,
            "manifest": manifest,
        })
    lidar_path = Path(controls["inputs"]["comparisonLidar"]["path"])
    if sha256_file(lidar_path) != controls["inputs"]["comparisonLidar"]["sha256"]:
        raise ValueError("Comparison LiDAR checksum mismatch")
    surfaces = build_lidar_crop_surfaces(
        lidar_path,
        crop_records,
        chunk_size,
        LIDAR_RASTER_CELL_FEET,
    )
    records = []
    failures = []
    for crop_record in crop_records:
        candidate_id = crop_record["candidateId"]
        lidar_surface = surfaces[candidate_id]
        response = response_surface(
            gradient_magnitude(orthophoto_high_pass(crop_record["manifest"])),
            gradient_magnitude(lidar_surface["highPass"]),
            lidar_surface["coverageMask"],
        )
        control = crop_record["control"]
        if response is None:
            failures.append({
                "candidateId": candidate_id,
                "semanticIdentity": control["semanticIdentity"],
            })
            continue
        records.append({
            "candidateId": candidate_id,
            "semanticIdentity": control["semanticIdentity"],
            "point": np.asarray(control["statePlaneFeet"], dtype=float),
            "surface": response["surface"],
            "patchDiagnostics": response["patchDiagnostics"],
        })
    return records, failures


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("training_model", type=Path)
    parser.add_argument("final_crop_index", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    arguments = parser.parse_args()

    model, model_sha256 = locked_bytes(arguments.training_model)
    if model.get("artifactKind") != (
        "marlins-2025-fresh-hard-curb-training-model-lock"
    ):
        raise ValueError("Input is not the frozen fresh hard-curb training model")
    freeze = model["freeze"]
    if not all([
        freeze["trainingAccepted"],
        freeze["methodFrozenBeforeFinalHoldoutAcquisition"],
        freeze["parametersFrozenBeforeFinalHoldoutAcquisition"],
        freeze["selectedTransformFrozenBeforeFinalHoldoutAcquisition"],
    ]):
        raise ValueError("Training model was not accepted and frozen")
    if freeze["finalHoldoutImagesRequestedOrOpened"]:
        raise ValueError("Training model lock opened final-holdout imagery")
    if freeze["finalHoldoutResponsesOrResidualsInspected"]:
        raise ValueError("Training model lock inspected final-holdout responses")

    controls_path = Path(model["inputs"]["controls"]["path"])
    controls, controls_sha256 = locked_bytes(controls_path)
    if controls_sha256 != model["inputs"]["controls"]["sha256"]:
        raise ValueError("Frozen hard-curb control checksum mismatch")
    if controls.get("artifactKind") != (
        "reviewed-marlins-2025-fresh-hard-curb-controls"
    ):
        raise ValueError("Model does not use the fresh hard-curb control lock")
    if controls["spatialDesign"]["finalHoldoutControlCount"] != (
        EXPECTED_FINAL_HOLDOUT_COUNT
    ):
        raise ValueError("Unexpected locked final-holdout count")

    crop_index, crop_index_sha256 = locked_bytes(arguments.final_crop_index)
    if crop_index.get("artifactKind") != (
        "marlins-2025-locked-ground-control-orthophoto-crop-index"
    ):
        raise ValueError("Input is not a locked final ground-control crop index")
    if crop_index["controlsSha256"] != controls_sha256:
        raise ValueError("Final crop index does not lock the frozen controls")
    if crop_index["requestedRole"] != "final-holdout":
        raise ValueError("Final audit requires a final-holdout-only crop index")
    if crop_index["offsetsComputedDuringAcquisition"]:
        raise ValueError("Final acquisition computed offsets")
    if crop_index["residualsComputedDuringAcquisition"]:
        raise ValueError("Final acquisition computed residuals")
    if len(crop_index["crops"]) != EXPECTED_FINAL_HOLDOUT_COUNT:
        raise ValueError("Final crop index is incomplete")

    frozen_parameters = model["parameters"]
    expected_parameters = {
        "orthophotoCellFeet": CELL_FEET,
        "lidarRasterCellFeet": LIDAR_RASTER_CELL_FEET,
        "patchHalfWidthsFeet": list(PATCH_HALF_WIDTHS_FEET),
        "searchHalfWidthFeet": SEARCH_HALF_WIDTH_FEET,
        "minimumValidPixelFraction": MINIMUM_VALID_PIXEL_FRACTION,
        "robustKeepFraction": ROBUST_KEEP_FRACTION,
        "translationBoundFeet": TRANSLATION_BOUND_FEET,
        "rotationBoundDegrees": ROTATION_BOUND_DEGREES,
        "anchorStatePlaneFeet": ANCHOR_STATE_PLANE_FEET.tolist(),
    }
    if frozen_parameters != expected_parameters:
        raise ValueError("Runtime final-audit parameters differ from the frozen model")

    records, failures = load_final_records(
        controls,
        crop_index,
        arguments.chunk_size,
    )
    blockers = []
    if failures or len(records) != EXPECTED_FINAL_HOLDOUT_COUNT:
        blockers.append("NOT_ALL_TWELVE_FINAL_HOLDOUT_RESPONSE_SURFACES_BUILT")

    final_fit = fit(records)
    final_parameters = parameter_vector(final_fit)
    training_parameters_record = model["selectedTransform"]["parameters"]
    training_parameters = np.asarray([
        *training_parameters_record["anchorTranslationFeet"],
        training_parameters_record["cartesianCounterclockwiseDegrees"],
    ])
    anchor_disagreement = float(np.linalg.norm(
        final_parameters[:2] - training_parameters[:2]
    ))
    rotation_disagreement = abs(float(final_parameters[2] - training_parameters[2]))

    leave_one_out = []
    for omitted_index, omitted in enumerate(records):
        retained = [
            record for index, record in enumerate(records) if index != omitted_index
        ]
        omitted_fit = fit(retained, initial=final_parameters, global_search=False)
        omitted_parameters = parameter_vector(omitted_fit)
        leave_one_out.append({
            "omittedCandidateId": omitted["candidateId"],
            "anchorTranslationFeet": omitted_parameters[:2].tolist(),
            "cartesianCounterclockwiseDegrees": float(omitted_parameters[2]),
            "anchorDistanceFromFullFinalFitFeet": float(np.linalg.norm(
                omitted_parameters[:2] - final_parameters[:2]
            )),
            "rotationDistanceFromFullFinalFitDegrees": abs(float(
                omitted_parameters[2] - final_parameters[2]
            )),
        })
    limiting_anchor_record = max(
        leave_one_out,
        key=lambda record: record["anchorDistanceFromFullFinalFitFeet"],
    )
    limiting_rotation_record = max(
        leave_one_out,
        key=lambda record: record["rotationDistanceFromFullFinalFitDegrees"],
    )
    maximum_loo_anchor = limiting_anchor_record[
        "anchorDistanceFromFullFinalFitFeet"
    ]
    maximum_loo_rotation = limiting_rotation_record[
        "rotationDistanceFromFullFinalFitDegrees"
    ]
    source_accuracy = float(model[
        "accuracyBudgetPendingFinalHoldouts"
    ]["orthophotoHorizontalAccuracy95Feet"])
    permitted_disagreement = float(model[
        "accuracyBudgetPendingFinalHoldouts"
    ]["maximumPermittedFinalAnchorDisagreementFeet"])
    combined_horizontal = source_accuracy + anchor_disagreement
    maximum_absolute_orientation = max(
        abs(float(training_parameters[2])),
        abs(float(final_parameters[2])),
    )
    final_score_at_training = -objective(training_parameters, records)
    final_best_score = -objective(final_parameters, records)

    if maximum_loo_anchor > MAXIMUM_LEAVE_ONE_OUT_ANCHOR_DISTANCE_FEET:
        blockers.append("FINAL_LEAVE_ONE_OUT_ANCHOR_INSTABILITY_EXCEEDS_0_30_FEET")
    if maximum_loo_rotation > MAXIMUM_LEAVE_ONE_OUT_ROTATION_DISTANCE_DEGREES:
        blockers.append("FINAL_LEAVE_ONE_OUT_ROTATION_INSTABILITY_EXCEEDS_0_02_DEGREES")
    if anchor_disagreement > permitted_disagreement:
        blockers.append("FINAL_ANCHOR_DISAGREEMENT_EXCEEDS_0_616_FEET")
    if combined_horizontal > MAXIMUM_ABSOLUTE_HORIZONTAL_FEET:
        blockers.append("COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if VERTICAL_UNCERTAINTY_95_FEET > MAXIMUM_ABSOLUTE_VERTICAL_FEET:
        blockers.append("VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if maximum_absolute_orientation > MAXIMUM_ABSOLUTE_ORIENTATION_DEGREES:
        blockers.append("ABSOLUTE_ORIENTATION_CORRECTION_EXCEEDS_ONE_DEGREE")
    accepted = not blockers

    stable = {
        "trainingModelSha256": model_sha256,
        "finalCropIndexSha256": crop_index_sha256,
        "frozenTrainingTransform": model["selectedTransform"],
        "independentFinalTransform": final_fit,
        "finalLeaveOneOut": leave_one_out,
        "metrics": {
            "lockedFinalHoldoutCount": EXPECTED_FINAL_HOLDOUT_COUNT,
            "finalResponseSurfaceCount": len(records),
            "failedFinalResponseSurfaces": failures,
            "anchorTranslationDisagreementFeet": anchor_disagreement,
            "rotationDisagreementDegrees": rotation_disagreement,
            "maximumFinalLeaveOneOutAnchorDistanceFeet": maximum_loo_anchor,
            "maximumFinalLeaveOneOutRotationDistanceDegrees": maximum_loo_rotation,
            "limitingFinalAnchorLeaveOneOutId": limiting_anchor_record[
                "omittedCandidateId"
            ],
            "limitingFinalRotationLeaveOneOutId": limiting_rotation_record[
                "omittedCandidateId"
            ],
            "officialOrthophotoHorizontalAccuracy95Feet": source_accuracy,
            "combinedHorizontalUncertainty95Feet": combined_horizontal,
            "verticalUncertainty95Feet": VERTICAL_UNCERTAINTY_95_FEET,
            "maximumAbsoluteOrientationCorrectionDegrees": (
                maximum_absolute_orientation
            ),
            "finalAggregateScoreAtFrozenTrainingTransform": final_score_at_training,
            "finalAggregateBestScore": final_best_score,
            "finalAggregateScoreRegret": final_best_score - final_score_at_training,
        },
        "gates": {
            "allLockedFinalResponseSurfacesRequired": True,
            "maximumFinalLeaveOneOutAnchorDistanceFeet": (
                MAXIMUM_LEAVE_ONE_OUT_ANCHOR_DISTANCE_FEET
            ),
            "maximumFinalLeaveOneOutRotationDistanceDegrees": (
                MAXIMUM_LEAVE_ONE_OUT_ROTATION_DISTANCE_DEGREES
            ),
            "maximumPermittedAnchorDisagreementFeet": permitted_disagreement,
            "maximumAbsoluteHorizontalFeet": MAXIMUM_ABSOLUTE_HORIZONTAL_FEET,
            "maximumAbsoluteVerticalFeet": MAXIMUM_ABSOLUTE_VERTICAL_FEET,
            "maximumAbsoluteOrientationDegrees": (
                MAXIMUM_ABSOLUTE_ORIENTATION_DEGREES
            ),
            "limitingFinalHoldoutMayNotBeDropped": True,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-fresh-hard-curb-final-registration-audit",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "trainingModel": {
                "path": str(arguments.training_model),
                "sha256": model_sha256,
                "artifactVersion": model["artifactVersion"],
            },
            "finalCropIndex": {
                "path": str(arguments.final_crop_index),
                "sha256": crop_index_sha256,
                "artifactVersion": crop_index["artifactVersion"],
            },
            "controls": model["inputs"]["controls"],
            "comparisonLidar": model["inputs"]["comparisonLidar"],
            "orthophotoAudit": model["inputs"]["orthophotoAudit"],
        },
        **stable,
        "assessment": {
            "accepted": accepted,
            "groundRegistrationAccepted": accepted,
            "publicationEligible": False,
            "blockers": blockers + [
                "ROW_SURFACE_SEMANTICS_NOT_ESTABLISHED",
                "CURRENT_ROOF_UNDERSIDE_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "limitingFinalHoldoutRetained": True,
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "accepted": accepted,
        "finalResponseSurfaceCount": len(records),
        "frozenTrainingTransform": training_parameters_record,
        "independentFinalTransform": final_fit["parameters"],
        "anchorTranslationDisagreementFeet": anchor_disagreement,
        "rotationDisagreementDegrees": rotation_disagreement,
        "combinedHorizontalUncertainty95Feet": combined_horizontal,
        "maximumFinalLeaveOneOutAnchorDistanceFeet": maximum_loo_anchor,
        "maximumFinalLeaveOneOutRotationDistanceDegrees": maximum_loo_rotation,
        "blockers": artifact["assessment"]["blockers"],
    }, indent=2))


if __name__ == "__main__":
    main()
