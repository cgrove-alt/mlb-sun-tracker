#!/usr/bin/env python3
"""Audit frozen Marlins ground registration against untouched final holdouts."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

from auditDenverRangePointOrthophotoRegistration import transform_points
from auditNoaa2021HardStructureRegistration import artifact_version


ANALYSIS_VERSION = "marlins-2025-full-tile-ground-final-holdout-audit-v1"
MAXIMUM_HORIZONTAL_FEET = 1.0
MAXIMUM_VERTICAL_FEET = 1.0
MAXIMUM_ORIENTATION_DEGREES = 1.0
MINIMUM_FINAL_HOLDOUT_COUNT = 6
VERTICAL_UNCERTAINTY_95_FEET = 0.6430446194056058


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def locked_control_hashes(localization: dict[str, Any]) -> list[str]:
    direct = localization.get("inputs", {}).get("controls")
    if direct is not None:
        return [direct["sha256"]]
    batch_inputs = (
        localization.get("inputs", {}).get("trainingLocalizations")
        or localization.get("inputs", {}).get("finalLocalizations")
    )
    if not batch_inputs:
        raise ValueError("Localization does not identify locked controls")
    hashes = []
    for batch_input in batch_inputs:
        batch, batch_sha256 = locked_json(Path(batch_input["path"]))
        if batch_sha256 != batch_input["sha256"]:
            raise ValueError("Combined localization source checksum mismatch")
        hashes.extend(locked_control_hashes(batch))
    return hashes


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("model_lock", type=Path)
    parser.add_argument("final_localization", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()
    model, model_sha256 = locked_json(arguments.model_lock)
    if model.get("artifactKind") != "marlins-2025-ground-training-model-lock":
        raise ValueError("Input is not the frozen training model")
    freeze = model["freeze"]
    if not all([
        freeze["trainingAccepted"],
        freeze["modelFamilyFrozenBeforeFinalHoldoutLocalization"],
        freeze["selectionRuleFrozenBeforeFinalHoldoutLocalization"],
        freeze["selectedTransformFrozenBeforeFinalHoldoutLocalization"],
    ]):
        raise ValueError("Training model was not frozen before final localization")
    if freeze["finalHoldoutOffsetsInspected"] or freeze["finalHoldoutResidualsInspected"]:
        raise ValueError("Training model lock inspected final holdouts")
    holdouts, holdouts_sha256 = locked_json(arguments.final_localization)
    if holdouts.get("artifactKind") != "marlins-2025-full-tile-ground-localization":
        raise ValueError("Input is not the full-tile final localization")
    if holdouts.get("role") != "final-holdout":
        raise ValueError("Final audit requires final-holdout localization")
    if holdouts["analysisVersion"] != (
        "marlins-2025-full-tile-ground-localization-v1-training-development"
    ):
        raise ValueError("Final localization does not use the frozen method version")
    training_path = Path(model["inputs"]["trainingLocalization"]["path"])
    training, training_sha256 = locked_json(training_path)
    if training_sha256 != model["inputs"]["trainingLocalization"]["sha256"]:
        raise ValueError("Frozen training localization checksum mismatch")
    if training["predeclaredLocalizationMethod"] != holdouts[
        "predeclaredLocalizationMethod"
    ]:
        raise ValueError("Training and final localization methods differ")
    if training["parameters"] != holdouts["parameters"]:
        raise ValueError("Training and final localization parameters differ")
    if locked_control_hashes(training) != locked_control_hashes(holdouts):
        raise ValueError("Training and final localization use different locked controls")
    records = holdouts["localizedControls"]
    transform = model["selectedTransform"]
    source = np.asarray([record["lidarStatePlaneFeet"] for record in records])
    target = np.asarray([record["orthophotoStatePlaneFeet"] for record in records])
    predicted = transform_points(
        source,
        np.asarray(transform["rotationMatrix"]),
        np.asarray(transform["translationFeet"]),
    )
    errors = np.linalg.norm(predicted - target, axis=1)
    source_accuracy = float(model[
        "accuracyBudgetPendingFinalHoldouts"
    ]["orthophotoHorizontalAccuracy95Feet"])
    maximum_error = float(np.max(errors)) if len(errors) else float("inf")
    combined_horizontal = source_accuracy + maximum_error
    orientation = abs(float(
        transform["cartesianCounterclockwiseDegrees"]
    ))
    blockers = []
    if len(records) < MINIMUM_FINAL_HOLDOUT_COUNT:
        blockers.append("FEWER_THAN_SIX_FINAL_HOLDOUTS_LOCALIZED")
    if combined_horizontal > MAXIMUM_HORIZONTAL_FEET:
        blockers.append("COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if VERTICAL_UNCERTAINTY_95_FEET > MAXIMUM_VERTICAL_FEET:
        blockers.append("VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if orientation > MAXIMUM_ORIENTATION_DEGREES:
        blockers.append("ORIENTATION_CORRECTION_EXCEEDS_ONE_DEGREE")
    accepted = not blockers
    holdout_results = [{
        "candidateId": record["candidateId"],
        "semanticIdentity": record["semanticIdentity"],
        "lidarStatePlaneFeet": record["lidarStatePlaneFeet"],
        "observedOrthophotoStatePlaneFeet": record[
            "orthophotoStatePlaneFeet"
        ],
        "predictedOrthophotoStatePlaneFeet": predicted[index].tolist(),
        "residualFeet": float(errors[index]),
        "withinRelativeResidualBudget": bool(
            errors[index] <= MAXIMUM_HORIZONTAL_FEET - source_accuracy
        ),
    } for index, record in enumerate(records)]
    limiting_index = int(np.argmax(errors)) if len(errors) else None
    stable = {
        "modelLockSha256": model_sha256,
        "finalLocalizationSha256": holdouts_sha256,
        "holdoutResults": holdout_results,
        "maximumFinalHoldoutResidualFeet": maximum_error,
        "combinedHorizontalUncertainty95Feet": combined_horizontal,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-ground-final-independent-registration-audit",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "trainingModelLock": {
                "path": str(arguments.model_lock),
                "sha256": model_sha256,
                "artifactVersion": model["artifactVersion"],
            },
            "finalHoldoutLocalization": {
                "path": str(arguments.final_localization),
                "sha256": holdouts_sha256,
                "artifactVersion": holdouts["artifactVersion"],
                "lockedFinalHoldoutCount": holdouts["assessment"][
                    "lockedControlCount"
                ],
                "localizedFinalHoldoutCount": len(records),
            },
        },
        "frozenTransform": transform,
        "finalHoldouts": holdout_results,
        "metrics": {
            "lockedFinalHoldoutCount": holdouts["assessment"][
                "lockedControlCount"
            ],
            "localizedFinalHoldoutCount": len(records),
            "maximumFinalHoldoutResidualFeet": maximum_error,
            "medianFinalHoldoutResidualFeet": (
                float(np.median(errors)) if len(errors) else None
            ),
            "orthophotoHorizontalAccuracy95Feet": source_accuracy,
            "combinedHorizontalUncertainty95Feet": combined_horizontal,
            "verticalUncertainty95Feet": VERTICAL_UNCERTAINTY_95_FEET,
            "absoluteOrientationCorrectionDegrees": orientation,
            "limitingFinalHoldoutId": (
                records[limiting_index]["candidateId"]
                if limiting_index is not None
                else None
            ),
            "limitingFinalHoldoutResidualFeet": maximum_error,
            "holdoutsWithinRelativeResidualBudget": int(np.count_nonzero(
                errors <= MAXIMUM_HORIZONTAL_FEET - source_accuracy
            )),
        },
        "gates": {
            "minimumFinalHoldoutCount": MINIMUM_FINAL_HOLDOUT_COUNT,
            "maximumHorizontalUncertainty95Feet": MAXIMUM_HORIZONTAL_FEET,
            "maximumVerticalUncertainty95Feet": MAXIMUM_VERTICAL_FEET,
            "maximumOrientationDegrees": MAXIMUM_ORIENTATION_DEGREES,
            "maximumPermittedFinalHoldoutResidualFeet": (
                MAXIMUM_HORIZONTAL_FEET - source_accuracy
            ),
            "limitingHoldoutMayNotBeDropped": True,
        },
        "assessment": {
            "accepted": accepted,
            "publicationEligible": False,
            "blockers": blockers + [
                "ROW_SURFACE_SEMANTICS_NOT_ESTABLISHED",
                "CURRENT_ROOF_UNDERSIDE_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
            "limitingHoldoutRetained": True,
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "accepted": accepted,
        "localizedFinalHoldoutCount": len(records),
        "maximumFinalHoldoutResidualFeet": maximum_error,
        "combinedHorizontalUncertainty95Feet": combined_horizontal,
        "limitingFinalHoldoutId": artifact["metrics"]["limitingFinalHoldoutId"],
        "holdoutsWithinRelativeResidualBudget": artifact["metrics"][
            "holdoutsWithinRelativeResidualBudget"
        ],
        "blockers": artifact["assessment"]["blockers"],
    }, indent=2))


if __name__ == "__main__":
    main()
