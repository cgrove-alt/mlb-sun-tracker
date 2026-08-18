#!/usr/bin/env python3
"""Fit and freeze the fresh Marlins hard-curb model from training only."""

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


ANALYSIS_VERSION = "marlins-2025-fresh-hard-curb-training-model-v1"
EXPECTED_TRAINING_CONTROL_COUNT = 12
MAXIMUM_LEAVE_ONE_OUT_ANCHOR_DISTANCE_FEET = 0.30
MAXIMUM_LEAVE_ONE_OUT_ROTATION_DISTANCE_DEGREES = 0.02
MINIMUM_TRANSLATION_BOUND_CLEARANCE_FEET = 0.25
MINIMUM_ROTATION_BOUND_CLEARANCE_DEGREES = 0.005


def locked_bytes(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def load_training_records(
    controls: dict[str, Any],
    crop_index: dict[str, Any],
    chunk_size: int,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    controls_by_id = {
        record["candidateId"]: record for record in controls["controls"]
    }
    selected = [
        record for record in controls["controls"] if record["role"] == "training"
    ]
    crop_by_id = {record["candidateId"]: record for record in crop_index["crops"]}
    crop_records = []
    for control in selected:
        index_record = crop_by_id.get(control["candidateId"])
        if index_record is None or index_record["role"] != "training":
            raise ValueError(f"Missing training crop: {control['candidateId']}")
        manifest_path = Path(index_record["manifestPath"])
        manifest, manifest_sha256 = locked_json(manifest_path)
        if manifest_sha256 != index_record["manifestSha256"]:
            raise ValueError(f"Training crop manifest checksum mismatch: {manifest_path}")
        if manifest["artifactVersion"] != index_record["artifactVersion"]:
            raise ValueError(f"Training crop artifact mismatch: {manifest_path}")
        if manifest["candidateId"] != control["candidateId"]:
            raise ValueError(f"Training crop candidate mismatch: {manifest_path}")
        if manifest["lockedStatePlaneFeet"] != control["statePlaneFeet"]:
            raise ValueError(f"Training crop coordinate mismatch: {manifest_path}")
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
    parser.add_argument("controls", type=Path)
    parser.add_argument("training_crop_index", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--chunk-size", type=int, default=1_000_000)
    arguments = parser.parse_args()

    controls, controls_sha256 = locked_bytes(arguments.controls)
    if controls.get("artifactKind") != (
        "reviewed-marlins-2025-fresh-hard-curb-controls"
    ):
        raise ValueError("Input is not the fresh hard-curb control lock")
    if controls.get("reviewStatus") != "locked-before-v7-hard-curb-localization":
        raise ValueError("Fresh hard-curb roles were not locked before localization")
    if controls["reviewProtocol"]["crossSensorOffsetsInspectedBeforeLock"]:
        raise ValueError("Hard-curb controls were selected after offsets were inspected")
    if controls["reviewProtocol"]["responseSurfacesInspectedBeforeLock"]:
        raise ValueError("Hard-curb controls were selected after responses were inspected")
    if controls["reviewProtocol"]["registrationResidualsInspectedBeforeLock"]:
        raise ValueError("Hard-curb controls were selected after residuals were inspected")
    if not controls["spatialDesign"]["stadiumInsideTrainingControlHull"]:
        raise ValueError("Stadium anchor is outside the locked training hull")
    if controls["spatialDesign"]["trainingControlCount"] != EXPECTED_TRAINING_CONTROL_COUNT:
        raise ValueError("Unexpected locked training-control count")

    crop_index, crop_index_sha256 = locked_bytes(arguments.training_crop_index)
    if crop_index.get("artifactKind") != (
        "marlins-2025-locked-ground-control-orthophoto-crop-index"
    ):
        raise ValueError("Input is not a locked ground-control crop index")
    if crop_index["controlsSha256"] != controls_sha256:
        raise ValueError("Training crop index does not lock the supplied controls")
    if crop_index["requestedRole"] != "training":
        raise ValueError("Model fitting requires a training-only crop index")
    if crop_index["offsetsComputedDuringAcquisition"]:
        raise ValueError("Training acquisition computed offsets")
    if crop_index["residualsComputedDuringAcquisition"]:
        raise ValueError("Training acquisition computed residuals")
    if len(crop_index["crops"]) != EXPECTED_TRAINING_CONTROL_COUNT:
        raise ValueError("Training crop index is incomplete")

    records, failures = load_training_records(
        controls,
        crop_index,
        arguments.chunk_size,
    )
    blockers = []
    if failures or len(records) != EXPECTED_TRAINING_CONTROL_COUNT:
        blockers.append("NOT_ALL_TWELVE_TRAINING_RESPONSE_SURFACES_BUILT")
    full_fit = fit(records)
    full_parameters = parameter_vector(full_fit)
    leave_one_out = []
    for omitted_index, omitted in enumerate(records):
        retained = [
            record for index, record in enumerate(records) if index != omitted_index
        ]
        omitted_fit = fit(retained, initial=full_parameters, global_search=False)
        omitted_parameters = parameter_vector(omitted_fit)
        leave_one_out.append({
            "omittedCandidateId": omitted["candidateId"],
            "anchorTranslationFeet": omitted_parameters[:2].tolist(),
            "cartesianCounterclockwiseDegrees": float(omitted_parameters[2]),
            "anchorDistanceFromFullFitFeet": float(np.linalg.norm(
                omitted_parameters[:2] - full_parameters[:2]
            )),
            "rotationDistanceFromFullFitDegrees": abs(float(
                omitted_parameters[2] - full_parameters[2]
            )),
        })
    maximum_loo_anchor = max(
        record["anchorDistanceFromFullFitFeet"] for record in leave_one_out
    )
    maximum_loo_rotation = max(
        record["rotationDistanceFromFullFitDegrees"] for record in leave_one_out
    )
    translation_clearance = float(
        TRANSLATION_BOUND_FEET - np.max(np.abs(full_parameters[:2]))
    )
    rotation_clearance = float(
        ROTATION_BOUND_DEGREES - abs(full_parameters[2])
    )
    if maximum_loo_anchor > MAXIMUM_LEAVE_ONE_OUT_ANCHOR_DISTANCE_FEET:
        blockers.append("TRAINING_LEAVE_ONE_OUT_ANCHOR_INSTABILITY_EXCEEDS_0_30_FEET")
    if maximum_loo_rotation > MAXIMUM_LEAVE_ONE_OUT_ROTATION_DISTANCE_DEGREES:
        blockers.append("TRAINING_LEAVE_ONE_OUT_ROTATION_INSTABILITY_EXCEEDS_0_02_DEGREES")
    if translation_clearance < MINIMUM_TRANSLATION_BOUND_CLEARANCE_FEET:
        blockers.append("TRAINING_TRANSLATION_FIT_TOO_CLOSE_TO_SEARCH_BOUND")
    if rotation_clearance < MINIMUM_ROTATION_BOUND_CLEARANCE_DEGREES:
        blockers.append("TRAINING_ROTATION_FIT_TOO_CLOSE_TO_SEARCH_BOUND")
    training_accepted = not blockers

    orthophoto_audit_input = controls["inputs"]["orthophotoAudit"]
    orthophoto_audit, orthophoto_audit_sha256 = locked_bytes(Path(
        orthophoto_audit_input["path"]
    ))
    if orthophoto_audit_sha256 != orthophoto_audit_input["sha256"]:
        raise ValueError("Orthophoto audit checksum mismatch")
    if not orthophoto_audit["accuracyAssessment"]["officialDatasetPlanFrameAccepted"]:
        raise ValueError("Official orthophoto plan frame is not accepted")
    source_accuracy = float(orthophoto_audit[
        "accuracyAssessment"
    ]["officialDatasetHorizontalAccuracy95Feet"])
    stable = {
        "controlsSha256": controls_sha256,
        "trainingCropIndexSha256": crop_index_sha256,
        "orthophotoAuditSha256": orthophoto_audit_sha256,
        "method": {
            "representation": "gradient-magnitude",
            "surfaceCombination": "mean-normalized-response-across-nine-patch-widths",
            "modelFamily": "unit-scale-rigid-at-stadium-anchor",
            "robustObjective": "mean-top-75-percent-control-scores",
            "modelSelectedFromTrainingOnly": True,
            "finalHoldoutImagesRequestedOrOpened": False,
            "finalHoldoutResponsesOrResidualsInspected": False,
        },
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
        "selectedTransform": full_fit,
        "trainingLeaveOneOut": leave_one_out,
        "trainingMetrics": {
            "lockedTrainingControlCount": EXPECTED_TRAINING_CONTROL_COUNT,
            "trainingResponseSurfaceCount": len(records),
            "failedTrainingResponseSurfaces": failures,
            "maximumLeaveOneOutAnchorDistanceFeet": maximum_loo_anchor,
            "maximumLeaveOneOutRotationDistanceDegrees": maximum_loo_rotation,
            "translationBoundClearanceFeet": translation_clearance,
            "rotationBoundClearanceDegrees": rotation_clearance,
        },
        "gates": {
            "allLockedTrainingResponseSurfacesRequired": True,
            "maximumLeaveOneOutAnchorDistanceFeet": (
                MAXIMUM_LEAVE_ONE_OUT_ANCHOR_DISTANCE_FEET
            ),
            "maximumLeaveOneOutRotationDistanceDegrees": (
                MAXIMUM_LEAVE_ONE_OUT_ROTATION_DISTANCE_DEGREES
            ),
            "minimumTranslationBoundClearanceFeet": (
                MINIMUM_TRANSLATION_BOUND_CLEARANCE_FEET
            ),
            "minimumRotationBoundClearanceDegrees": (
                MINIMUM_ROTATION_BOUND_CLEARANCE_DEGREES
            ),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-fresh-hard-curb-training-model-lock",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "controls": {
                "path": str(arguments.controls),
                "sha256": controls_sha256,
                "artifactVersion": controls["artifactVersion"],
            },
            "trainingCropIndex": {
                "path": str(arguments.training_crop_index),
                "sha256": crop_index_sha256,
                "artifactVersion": crop_index["artifactVersion"],
            },
            "comparisonLidar": controls["inputs"]["comparisonLidar"],
            "orthophotoAudit": controls["inputs"]["orthophotoAudit"],
        },
        **stable,
        "accuracyBudgetPendingFinalHoldouts": {
            "orthophotoHorizontalAccuracy95Feet": source_accuracy,
            "maximumAbsoluteHorizontalFeet": 1.0,
            "maximumPermittedFinalAnchorDisagreementFeet": 1.0 - source_accuracy,
        },
        "freeze": {
            "trainingAccepted": training_accepted,
            "methodFrozenBeforeFinalHoldoutAcquisition": training_accepted,
            "parametersFrozenBeforeFinalHoldoutAcquisition": training_accepted,
            "selectedTransformFrozenBeforeFinalHoldoutAcquisition": training_accepted,
            "finalHoldoutImagesRequestedOrOpened": False,
            "finalHoldoutResponsesOrResidualsInspected": False,
        },
        "assessment": {
            "trainingAccepted": training_accepted,
            "publicationEligible": False,
            "blockers": blockers + [
                "FINAL_HARD_CURB_HOLDOUTS_NOT_YET_ACQUIRED_OR_SCORED",
                "ROW_SURFACE_SEMANTICS_NOT_ESTABLISHED",
                "CURRENT_ROOF_UNDERSIDE_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "trainingAccepted": training_accepted,
        "trainingResponseSurfaceCount": len(records),
        "selectedTransform": full_fit["parameters"],
        "maximumLeaveOneOutAnchorDistanceFeet": maximum_loo_anchor,
        "maximumLeaveOneOutRotationDistanceDegrees": maximum_loo_rotation,
        "translationBoundClearanceFeet": translation_clearance,
        "rotationBoundClearanceDegrees": rotation_clearance,
        "blockers": artifact["assessment"]["blockers"],
    }, indent=2))


if __name__ == "__main__":
    main()
