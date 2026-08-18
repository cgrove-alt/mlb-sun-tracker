#!/usr/bin/env python3
"""Consolidate multiscale Marlins cross-epoch hard-structure refinements."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


ANALYSIS_VERSION = "marlins-cross-epoch-subpixel-control-consensus-audit-v6"
REQUIRED_PATCH_HALF_WIDTHS_METRES = [8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0]
MAXIMUM_CROSS_PATCH_DISTANCE_METRES = 0.20
MAXIMUM_LOCALIZATION_ENVELOPE_METRES = 0.19
MINIMUM_MEDIAN_RESPONSE = 0.12
MAXIMUM_SHIFT_NORM_METRES = 0.80
MAXIMUM_COARSE_TO_SELECTED_DISTANCE_METRES = 0.20


def checksum_locked(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def consensus_for_estimates(estimates: list[dict[str, Any]]) -> dict[str, Any] | None:
    if len(estimates) < 2:
        return None
    unvisited = set(range(len(estimates)))
    components: list[list[dict[str, Any]]] = []
    while unvisited:
        pending = [unvisited.pop()]
        component: list[int] = []
        while pending:
            current = pending.pop()
            component.append(current)
            neighbours = {
                other
                for other in unvisited
                if float(np.linalg.norm(
                    estimates[current]["shift"] - estimates[other]["shift"]
                )) <= MAXIMUM_CROSS_PATCH_DISTANCE_METRES
            }
            unvisited -= neighbours
            pending.extend(neighbours)
        components.append([estimates[index] for index in component])
    eligible_components = [component for component in components if len(component) >= 2]
    if not eligible_components:
        return None
    inliers = min(
        eligible_components,
        key=lambda component: (
            -len(component),
            min(
                item["refined"]["crossRunShiftDispersionMetres"]["p95"]
                for item in component
            ),
            -max(item["refined"]["response"]["median"] for item in component),
        ),
    )
    median_shift = np.median(
        np.asarray([item["shift"] for item in inliers]),
        axis=0,
    )
    selected = min(
        inliers,
        key=lambda item: (
            item["refined"]["crossRunShiftDispersionMetres"]["p95"],
            -item["refined"]["response"]["median"],
            item["patchHalfWidthMetres"],
        ),
    )
    cross_patch_distances = [
        float(np.linalg.norm(item["shift"] - median_shift))
        for item in inliers
    ]
    localization_envelope = max(
        float(selected["refined"]["crossRunShiftDispersionMetres"]["p95"]),
        max(cross_patch_distances),
    )
    passes = bool(
        localization_envelope <= MAXIMUM_LOCALIZATION_ENVELOPE_METRES
        and selected["refined"]["response"]["median"] >= MINIMUM_MEDIAN_RESPONSE
    )
    return {
        "passes": passes,
        "availablePatchEstimateCount": len(estimates),
        "consistentPatchEstimateCount": len(inliers),
        "medianShiftMetres": median_shift.tolist(),
        "selectedPatchHalfWidthMetres": selected["patchHalfWidthMetres"],
        "selectedReferenceToComparisonShiftMetres": selected["shift"].tolist(),
        "selectedComparisonUtmMetres": selected["refined"]["comparisonUtmMetres"],
        "selectedResponseMedian": selected["refined"]["response"]["median"],
        "selectedCrossRunP95Metres": selected["refined"]
        ["crossRunShiftDispersionMetres"]["p95"],
        "maximumCrossPatchDistanceFromMedianMetres": max(cross_patch_distances),
        "localizationEnvelopeMetres": localization_envelope,
    }


def build_consensus(
    base_controls_path: Path,
    refinement_paths: list[Path],
    minimum_training_control_count: int = 6,
    minimum_holdout_control_count: int = 6,
) -> dict[str, Any]:
    if minimum_training_control_count < 0 or minimum_holdout_control_count < 0:
        raise ValueError("Minimum control counts cannot be negative")
    base, base_sha256 = checksum_locked(base_controls_path)
    supported_review_statuses = {
        "reviewed-2018-2021-subpixel-hard-structure-lidar-controls",
        "reviewed-2018-2024-hard-structure-lidar-controls",
        "reviewed-2021-2024-hard-structure-lidar-controls",
    }
    if base.get("reviewStatus") not in supported_review_statuses:
        raise ValueError("Base controls have the wrong review status")
    base_by_id = {
        record["candidateId"]: record
        for record in base["controls"]
        if record.get("accepted")
    }
    refinements: list[dict[str, Any]] = []
    refinement_inputs: list[dict[str, Any]] = []
    for path in refinement_paths:
        artifact, digest = checksum_locked(path)
        if artifact.get("artifactKind") != "hard-structure-control-subpixel-refinement":
            raise ValueError(f"Refinement has the wrong kind: {path}")
        if artifact["inputs"]["controlsSha256"] != base_sha256:
            raise ValueError(f"Refinement uses different base controls: {path}")
        record_ids = {record["candidateId"] for record in artifact["records"]}
        if record_ids != set(base_by_id):
            raise ValueError(f"Refinement does not contain every accepted control: {path}")
        refinements.append(artifact)
        refinement_inputs.append({
            "path": str(path),
            "sha256": digest,
            "artifactVersion": artifact["artifactVersion"],
            "patchHalfWidthMetres": artifact["parameters"]["patchHalfWidthMetres"],
        })
    widths = sorted(item["patchHalfWidthMetres"] for item in refinement_inputs)
    if widths != REQUIRED_PATCH_HALF_WIDTHS_METRES:
        raise ValueError("Refinements do not match the locked patch-width set")
    refinement_by_width = {
        float(artifact["parameters"]["patchHalfWidthMetres"]): {
            record["candidateId"]: record for record in artifact["records"]
        }
        for artifact in refinements
    }
    queue_path = Path(base["inputs"]["reviewQueue"]["path"])
    if sha256_file(queue_path) != base["inputs"]["reviewQueue"]["sha256"]:
        raise ValueError("Review queue checksum mismatch")
    queue = json.loads(queue_path.read_text())
    queue_by_id = {record["candidateId"]: record for record in queue["candidates"]}

    evaluations: list[dict[str, Any]] = []
    selected_controls: list[dict[str, Any]] = []
    for candidate_id, base_record in base_by_id.items():
        estimates: list[dict[str, Any]] = []
        for width, records in sorted(refinement_by_width.items()):
            refined = records[candidate_id].get("refined")
            if refined is None:
                continue
            shift = np.asarray(refined["referenceToComparisonShiftMetres"])
            if float(np.linalg.norm(shift)) > MAXIMUM_SHIFT_NORM_METRES:
                continue
            estimates.append({
                "patchHalfWidthMetres": width,
                "shift": shift,
                "refined": refined,
            })
        consensus = consensus_for_estimates(estimates)
        if consensus is not None:
            coarse_comparison = np.asarray(
                queue_by_id[candidate_id]["comparison"]["utmMetres"]
            )
            selected_comparison = np.asarray(
                consensus["selectedComparisonUtmMetres"]
            )
            coarse_to_selected_distance = float(
                np.linalg.norm(selected_comparison - coarse_comparison)
            )
            consensus["coarseToSelectedComparisonDistanceMetres"] = (
                coarse_to_selected_distance
            )
            consensus["passesCoarseAgreementGate"] = bool(
                coarse_to_selected_distance
                <= MAXIMUM_COARSE_TO_SELECTED_DISTANCE_METRES
            )
            consensus["passes"] = bool(
                consensus["passes"]
                and consensus["passesCoarseAgreementGate"]
            )
        evaluation = {
            "candidateId": candidate_id,
            "lockedRole": base_record["role"],
            "semanticIdentity": base_record["semanticIdentity"],
            "referenceLocalMetres": queue_by_id[candidate_id]["reference"]["localMetres"],
            "referenceUtmMetres": queue_by_id[candidate_id]["reference"]["utmMetres"],
            "consensus": consensus,
        }
        evaluations.append(evaluation)
        if consensus is None or not consensus["passes"]:
            continue
        selected_controls.append({
            "candidateId": candidate_id,
            "role": base_record["role"],
            "semanticIdentity": base_record["semanticIdentity"],
            "referenceUtmMetres": queue_by_id[candidate_id]["reference"]["utmMetres"],
            "comparisonUtmMetres": consensus["selectedComparisonUtmMetres"],
            "localizationEnvelopeMetres": consensus["localizationEnvelopeMetres"],
            "selectedPatchHalfWidthMetres": consensus[
                "selectedPatchHalfWidthMetres"
            ],
        })
    training_count = sum(item["role"] == "training" for item in selected_controls)
    holdout_count = sum(item["role"] == "holdout" for item in selected_controls)
    measurement_eligible = (
        training_count >= minimum_training_control_count
        and holdout_count >= minimum_holdout_control_count
    )
    stable = {
        "baseControlsSha256": base_sha256,
        "refinementInputs": refinement_inputs,
        "selectionParameters": {
            "maximumCrossPatchDistanceMetres": MAXIMUM_CROSS_PATCH_DISTANCE_METRES,
            "maximumLocalizationEnvelopeMetres": MAXIMUM_LOCALIZATION_ENVELOPE_METRES,
            "minimumMedianResponse": MINIMUM_MEDIAN_RESPONSE,
            "maximumShiftNormMetres": MAXIMUM_SHIFT_NORM_METRES,
            "maximumCoarseToSelectedComparisonDistanceMetres": (
                MAXIMUM_COARSE_TO_SELECTED_DISTANCE_METRES
            ),
            "minimumRequiredTrainingControlCount": minimum_training_control_count,
            "minimumRequiredHoldoutControlCount": minimum_holdout_control_count,
        },
        "controls": selected_controls,
        "evaluations": evaluations,
    }
    blockers: list[str] = []
    if training_count < minimum_training_control_count:
        blockers.append("INSUFFICIENT_TRAINING_CONTROLS_PASS_MULTISCALE_GATE")
    if holdout_count < minimum_holdout_control_count:
        blockers.append("INSUFFICIENT_HOLDOUT_CONTROLS_PASS_MULTISCALE_GATE")
    base_review_status = base.get("reviewStatus")
    if measurement_eligible:
        if base_review_status == "reviewed-2018-2021-subpixel-hard-structure-lidar-controls":
            review_status = (
                "locked-2018-2021-subpixel-final-holdout-controls"
                if minimum_training_control_count == 0
                else "locked-2018-2021-subpixel-hard-structure-controls"
            )
            artifact_kind = "marlins-2018-2021-subpixel-control-consensus-audit"
        elif base_review_status == "reviewed-2021-2024-hard-structure-lidar-controls":
            review_status = (
                "locked-2021-2024-subpixel-final-holdout-controls"
                if minimum_training_control_count == 0
                else "locked-2021-2024-subpixel-hard-structure-controls"
            )
            artifact_kind = "marlins-2024-subpixel-control-consensus-audit"
        else:
            review_status = (
                "locked-2018-2024-subpixel-final-holdout-controls"
                if minimum_training_control_count == 0
                else "locked-2018-2024-subpixel-hard-structure-controls"
            )
            artifact_kind = "marlins-2024-subpixel-control-consensus-audit"
    else:
        epoch_label = (
            "2018-2021"
            if base_review_status == "reviewed-2018-2021-subpixel-hard-structure-lidar-controls"
            else "2021-2024"
            if base_review_status == "reviewed-2021-2024-hard-structure-lidar-controls"
            else "2018-2024"
        )
        review_status = f"failed-{epoch_label}-subpixel-hard-structure-consensus"
        artifact_kind = (
            "marlins-2018-2021-subpixel-control-consensus-audit"
            if epoch_label == "2018-2021"
            else "marlins-2024-subpixel-control-consensus-audit"
        )
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": artifact_kind,
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "reviewStatus": review_status,
        "inputs": {
            "baseControls": {
                "path": str(base_controls_path),
                "sha256": base_sha256,
                "artifactVersion": base["artifactVersion"],
            },
            "reviewQueue": base["inputs"]["reviewQueue"],
            "reviewSheet": base["inputs"]["reviewSheet"],
            **(
                {"referenceSurveyReview": base["inputs"]["referenceSurveyReview"]}
                if "referenceSurveyReview" in base["inputs"]
                else {}
            ),
            **(
                {"accepted2021Frame": base["inputs"]["accepted2021Frame"]}
                if "accepted2021Frame" in base["inputs"]
                else {}
            ),
            "comparisonSurveyReview": base["inputs"]["comparisonSurveyReview"],
            "refinements": refinement_inputs,
        },
        "selectionProtocol": {
            **stable["selectionParameters"],
            "requiredPatchHalfWidthsMetres": widths,
            "minimumConsistentPatchEstimateCount": 2,
            "selectedEstimateRule": (
                "lowest cross-run p95 among cross-patch-consistent estimates, "
                "then highest response, then smallest patch"
            ),
            "partitionRule": base["reviewProtocol"]["partitionRule"],
            "minimumRequiredTrainingControlCount": minimum_training_control_count,
            "minimumRequiredHoldoutControlCount": minimum_holdout_control_count,
        },
        "controls": selected_controls,
        "evaluations": evaluations,
        "assessment": {
            "baseAcceptedControlCount": len(base_by_id),
            "multiscaleAcceptedControlCount": len(selected_controls),
            "trainingControlCount": training_count,
            "holdoutControlCount": holdout_count,
            "semanticHardStructureIdentityReviewed": True,
            "movableRoofControlsExcluded": True,
            "vegetationControlsExcluded": True,
            "subpixelLocalizationGatePassed": measurement_eligible,
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
    parser.add_argument("base_controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("refinements", type=Path, nargs="+")
    parser.add_argument("--minimum-training-controls", type=int, default=6)
    parser.add_argument("--minimum-holdout-controls", type=int, default=6)
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_consensus(
        arguments.base_controls,
        arguments.refinements,
        arguments.minimum_training_controls,
        arguments.minimum_holdout_controls,
    )
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "assessment": artifact["assessment"],
        "passingCandidateIds": [record["candidateId"] for record in artifact["controls"]],
    }, indent=2))


if __name__ == "__main__":
    main()
