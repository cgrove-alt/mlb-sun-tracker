#!/usr/bin/env python3
"""Select and freeze the Marlins ground registration model from training only."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
from pathlib import Path
from typing import Any

import numpy as np
from scipy.spatial import ConvexHull

from auditDenverRangePointOrthophotoRegistration import (
    fit_rigid,
    fit_similarity,
    leave_one_out_errors,
    transform_points,
)
from auditNoaa2021HardStructureRegistration import artifact_version


ANALYSIS_VERSION = "marlins-2025-full-tile-ground-training-model-selection-v1"
ROBUST_INLIER_THRESHOLD_FEET = 0.65
MINIMUM_ROBUST_INLIER_COUNT = 9
MAXIMUM_ROBUST_INLIER_RESIDUAL_FEET = 0.65
MAXIMUM_ROBUST_LEAVE_ONE_OUT_FEET = 1.0
MAXIMUM_ABSOLUTE_HORIZONTAL_FEET = 1.0
STADIUM_ANCHOR_STATE_PLANE_FEET = np.asarray([913125.0, 525625.0])


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def residuals(
    source: np.ndarray,
    target: np.ndarray,
    fit: dict[str, Any],
) -> np.ndarray:
    matrix = fit["rotation"] * float(fit.get("scale", 1.0))
    predicted = transform_points(source, matrix, fit["translation"])
    return np.linalg.norm(predicted - target, axis=1)


def point_inside_hull(point: np.ndarray, controls: np.ndarray) -> bool:
    if len(controls) < 3:
        return False
    hull = ConvexHull(controls)
    return bool(np.all(
        hull.equations[:, :2] @ point + hull.equations[:, 2] <= 1e-8
    ))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("training_localization", type=Path)
    parser.add_argument("orthophoto_audit", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()
    localization, localization_sha256 = locked_json(arguments.training_localization)
    accepted_localization_versions = {
        (
            "marlins-2025-full-tile-ground-localization",
            "marlins-2025-full-tile-ground-localization-v1-training-development",
        ),
        (
            "marlins-2025-native-ground-localization",
            "marlins-2025-native-ground-localization-v4-gradient-training-development",
        ),
        (
            "marlins-2025-native-ground-localization",
            (
                "marlins-2025-native-ground-localization-v4-gradient-"
                "training-development-lidar-cell-0.25-feet"
            ),
        ),
    }
    localization_version = (
        localization.get("artifactKind"),
        localization.get("analysisVersion"),
    )
    if localization_version not in accepted_localization_versions:
        raise ValueError("Input is not an accepted locked-control localization")
    if localization.get("role") != "training":
        raise ValueError("Model selection may use training localization only")
    method = localization["predeclaredLocalizationMethod"]
    if method["registrationModelSelected"]:
        raise ValueError("Training localization unexpectedly selected a model")
    if not method["finalHoldoutOffsetsMayNotInfluenceModelSelection"]:
        raise ValueError("Training localization lacks final-holdout isolation")
    records = localization["localizedControls"]
    if len(records) < MINIMUM_ROBUST_INLIER_COUNT:
        raise ValueError("Too few localized training controls for robust selection")
    source = np.asarray([record["lidarStatePlaneFeet"] for record in records])
    target = np.asarray([record["orthophotoStatePlaneFeet"] for record in records])
    ids = [record["candidateId"] for record in records]
    all_rigid = fit_rigid(source, target)
    all_similarity = fit_similarity(source, target)
    all_rigid_errors = residuals(source, target, all_rigid)
    all_similarity_errors = residuals(source, target, all_similarity)
    candidates = []
    for seed_indices in itertools.combinations(range(len(records)), 3):
        seed = list(seed_indices)
        fit = fit_rigid(source[seed], target[seed])
        errors = residuals(source, target, fit)
        inliers = np.flatnonzero(errors <= ROBUST_INLIER_THRESHOLD_FEET)
        candidates.append({
            "seedIndices": seed,
            "seedIds": [ids[index] for index in seed],
            "inlierIndices": inliers.tolist(),
            "inlierCount": int(len(inliers)),
            "inlierMedianResidualFeet": (
                float(np.median(errors[inliers])) if len(inliers) else float("inf")
            ),
            "allControlMaximumResidualFeet": float(np.max(errors)),
        })
    candidates.sort(key=lambda record: (
        -record["inlierCount"],
        record["inlierMedianResidualFeet"],
        record["allControlMaximumResidualFeet"],
        record["seedIds"],
    ))
    winner = candidates[0]
    robust_indices = np.asarray(winner["inlierIndices"], dtype=int)
    robust_fit = fit_rigid(source[robust_indices], target[robust_indices])
    robust_errors = residuals(source, target, robust_fit)
    final_inliers = np.flatnonzero(
        robust_errors <= ROBUST_INLIER_THRESHOLD_FEET
    )
    if not np.array_equal(final_inliers, robust_indices):
        robust_indices = final_inliers
        robust_fit = fit_rigid(source[robust_indices], target[robust_indices])
        robust_errors = residuals(source, target, robust_fit)
        final_inliers = np.flatnonzero(
            robust_errors <= ROBUST_INLIER_THRESHOLD_FEET
        )
    if not np.array_equal(final_inliers, robust_indices):
        raise ValueError("Robust training inlier set did not stabilize")
    inlier_source = source[robust_indices]
    inlier_target = target[robust_indices]
    inlier_errors = robust_errors[robust_indices]
    inlier_loo = leave_one_out_errors(inlier_source, inlier_target)
    stadium_inside = point_inside_hull(STADIUM_ANCHOR_STATE_PLANE_FEET, inlier_source)
    audit, audit_sha256 = locked_json(arguments.orthophoto_audit)
    if not audit["accuracyAssessment"]["officialDatasetPlanFrameAccepted"]:
        raise ValueError("Official orthophoto ground frame is not accepted")
    source_accuracy = float(
        audit["accuracyAssessment"]["officialDatasetHorizontalAccuracy95Feet"]
    )
    blockers = []
    if len(robust_indices) < MINIMUM_ROBUST_INLIER_COUNT:
        blockers.append("FEWER_THAN_NINE_ROBUST_TRAINING_INLIERS")
    if float(np.max(inlier_errors)) > MAXIMUM_ROBUST_INLIER_RESIDUAL_FEET:
        blockers.append("ROBUST_TRAINING_RESIDUAL_EXCEEDS_0_65_FEET")
    if float(np.max(inlier_loo)) > MAXIMUM_ROBUST_LEAVE_ONE_OUT_FEET:
        blockers.append("ROBUST_TRAINING_LEAVE_ONE_OUT_EXCEEDS_ONE_FOOT")
    if not stadium_inside:
        blockers.append("STADIUM_OUTSIDE_ROBUST_TRAINING_CONTROL_HULL")
    training_accepted = not blockers
    stable = {
        "trainingLocalizationSha256": localization_sha256,
        "orthophotoAuditSha256": audit_sha256,
        "selectionRule": {
            "modelFamily": "rigid-unit-scale",
            "seedSize": 3,
            "seedEnumeration": "all-three-control-combinations",
            "inlierThresholdFeet": ROBUST_INLIER_THRESHOLD_FEET,
            "ranking": [
                "maximum-inlier-count",
                "minimum-inlier-median-residual",
                "minimum-all-control-maximum-residual",
                "lexicographic-seed-ids",
            ],
            "refit": "unit-scale-rigid-fit-on-winning-inliers-until-stable",
        },
        "selectedInlierIds": [ids[index] for index in robust_indices],
        "rejectedTrainingLocalizationIds": [
            candidate_id
            for index, candidate_id in enumerate(ids)
            if index not in set(robust_indices.tolist())
        ],
        "selectedTransform": {
            "rotationMatrix": robust_fit["rotation"].tolist(),
            "translationFeet": robust_fit["translation"].tolist(),
            "cartesianCounterclockwiseDegrees": robust_fit[
                "cartesianCounterclockwiseCorrectionDegrees"
            ],
            "trueBearingCorrectionDegrees": robust_fit[
                "trueBearingCorrectionDegrees"
            ],
            "unitScaleEnforced": True,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2025-ground-training-model-lock",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "trainingLocalization": {
                "path": str(arguments.training_localization),
                "sha256": localization_sha256,
                "artifactVersion": localization["artifactVersion"],
                "localizedTrainingControlCount": len(records),
            },
            "orthophotoAudit": {
                "path": str(arguments.orthophoto_audit),
                "sha256": audit_sha256,
                "artifactVersion": audit["artifactVersion"],
            },
        },
        "modelFamilyDiagnosticsFromTrainingOnly": {
            "allControlRigid": {
                "maximumResidualFeet": float(np.max(all_rigid_errors)),
                "medianResidualFeet": float(np.median(all_rigid_errors)),
                "cartesianCounterclockwiseDegrees": all_rigid[
                    "cartesianCounterclockwiseCorrectionDegrees"
                ],
            },
            "allControlSimilarity": {
                "maximumResidualFeet": float(np.max(all_similarity_errors)),
                "medianResidualFeet": float(np.median(all_similarity_errors)),
                "scale": float(all_similarity["scale"]),
                "scalePartsPerMillion": float(
                    (all_similarity["scale"] - 1.0) * 1_000_000.0
                ),
                "cartesianCounterclockwiseDegrees": all_similarity[
                    "cartesianCounterclockwiseCorrectionDegrees"
                ],
            },
            "decision": (
                "Similarity does not materially reduce the training maximum. "
                "The same-CRS unit-scale rigid family is retained and a fixed "
                "exhaustive robust estimator handles false local patch locks."
            ),
        },
        "robustSelection": {
            **stable["selectionRule"],
            "enumeratedSeedCount": len(candidates),
            "winningSeedIds": winner["seedIds"],
            "selectedInlierIds": stable["selectedInlierIds"],
            "rejectedTrainingLocalizationIds": stable[
                "rejectedTrainingLocalizationIds"
            ],
        },
        "selectedTransform": stable["selectedTransform"],
        "trainingMetrics": {
            "selectedInlierCount": int(len(robust_indices)),
            "maximumInlierResidualFeet": float(np.max(inlier_errors)),
            "medianInlierResidualFeet": float(np.median(inlier_errors)),
            "maximumInlierLeaveOneOutFeet": float(np.max(inlier_loo)),
            "inlierResidualsFeet": {
                ids[index]: float(robust_errors[index])
                for index in robust_indices
            },
            "inlierLeaveOneOutFeet": {
                ids[index]: float(error)
                for index, error in zip(robust_indices, inlier_loo)
            },
            "stadiumAnchorStatePlaneFeet": STADIUM_ANCHOR_STATE_PLANE_FEET.tolist(),
            "stadiumInsideInlierControlHull": stadium_inside,
        },
        "accuracyBudgetPendingFinalHoldouts": {
            "orthophotoHorizontalAccuracy95Feet": source_accuracy,
            "maximumAbsoluteHorizontalFeet": MAXIMUM_ABSOLUTE_HORIZONTAL_FEET,
            "maximumPermittedFinalHoldoutResidualFeet": (
                MAXIMUM_ABSOLUTE_HORIZONTAL_FEET - source_accuracy
            ),
            "combinationMethod": (
                "conservative linear sum of official orthophoto 95 percent "
                "horizontal accuracy and maximum final holdout residual"
            ),
        },
        "freeze": {
            "trainingAccepted": training_accepted,
            "modelFamilyFrozenBeforeFinalHoldoutLocalization": training_accepted,
            "selectionRuleFrozenBeforeFinalHoldoutLocalization": training_accepted,
            "selectedTransformFrozenBeforeFinalHoldoutLocalization": training_accepted,
            "finalHoldoutOffsetsInspected": False,
            "finalHoldoutResidualsInspected": False,
        },
        "assessment": {
            "trainingAccepted": training_accepted,
            "finalRegistrationAccepted": False,
            "publicationEligible": False,
            "blockers": blockers + [
                "FINAL_HOLDOUTS_NOT_YET_LOCALIZED_OR_SCORED",
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
        "selectedInlierCount": len(robust_indices),
        "maximumInlierResidualFeet": artifact["trainingMetrics"][
            "maximumInlierResidualFeet"
        ],
        "maximumInlierLeaveOneOutFeet": artifact["trainingMetrics"][
            "maximumInlierLeaveOneOutFeet"
        ],
        "stadiumInsideInlierControlHull": stadium_inside,
        "maximumPermittedFinalHoldoutResidualFeet": artifact[
            "accuracyBudgetPendingFinalHoldouts"
        ]["maximumPermittedFinalHoldoutResidualFeet"],
        "blockers": artifact["assessment"]["blockers"],
    }, indent=2))


if __name__ == "__main__":
    main()
