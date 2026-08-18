#!/usr/bin/env python3
"""Lock fresh Marlins 2021 to 2024 similarity-model holdout controls."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

from auditNoaa2021HardStructureRegistration import artifact_version, validate_input_record


ANALYSIS_VERSION = "marlins-2021-to-2024-similarity-final-holdout-lock-v1"
REVIEWED_ON = "2026-08-11"
MINIMUM_PRIOR_CONTROL_DISTANCE_METRES = 50.0
MINIMUM_HOLDOUT_SEPARATION_METRES = 20.0
TILE_LABELS = {
    "K": "north tile",
    "N": "west tile",
    "P": "east tile",
}
SELECTED_IDS = {
    "K": [
        "hard-structure-01",
        "hard-structure-02",
        "hard-structure-05",
        "hard-structure-11",
    ],
    "N": [
        "hard-structure-00",
        "hard-structure-02",
        "hard-structure-04",
        "hard-structure-06",
        "hard-structure-08",
        "hard-structure-10",
        "hard-structure-11",
        "hard-structure-13",
        "hard-structure-14",
        "hard-structure-15",
        "hard-structure-17",
        "hard-structure-21",
        "hard-structure-23",
    ],
    "P": [
        "hard-structure-00",
        "hard-structure-01",
        "hard-structure-03",
        "hard-structure-08",
        "hard-structure-10",
        "hard-structure-13",
        "hard-structure-15",
        "hard-structure-16",
        "hard-structure-19",
        "hard-structure-22",
        "hard-structure-26",
        "hard-structure-27",
        "hard-structure-28",
        "hard-structure-31",
        "hard-structure-32",
        "hard-structure-34",
        "hard-structure-35",
        "hard-structure-36",
        "hard-structure-37",
        "hard-structure-38",
        "hard-structure-39",
        "hard-structure-40",
        "hard-structure-45",
        "hard-structure-50",
        "hard-structure-52",
        "hard-structure-54",
        "hard-structure-57",
        "hard-structure-59",
    ],
}


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def input_record(path: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    value, digest = locked_json(path)
    return value, {
        "path": str(path),
        "sha256": digest,
        "artifactVersion": value["artifactVersion"],
    }


def distance(first: list[float], second: list[float]) -> float:
    return float(np.linalg.norm(np.asarray(first) - np.asarray(second)))


def minimum_pair_separation(records: list[dict[str, Any]]) -> float:
    values = [
        distance(first["reference"]["utmMetres"], second["reference"]["utmMetres"])
        for index, first in enumerate(records)
        for second in records[index + 1:]
    ]
    if not values:
        raise ValueError("At least two selected controls are required")
    return min(values)


def build_artifacts(base_directory: Path, output_directory: Path) -> list[dict[str, Any]]:
    first_path = base_directory / "hard-structure-2021-2024-subpixel-consensus-v1.json"
    supplemental_path = (
        base_directory / "hard-structure-2021-2024-supplemental-consensus-v1.json"
    )
    prior_registration_path = (
        base_directory
        / "hard-structure-2021-to-2024-final-independent-registration-v1.json"
    )
    consumed_holdout_path = (
        base_directory
        / "hard-structure-2021-to-2024-adjacent-final-independent-registration-v2.json"
    )
    diagnostic_path = (
        base_directory / "hard-structure-2021-to-2024-transform-family-diagnostic-v1.json"
    )
    reference_review_path = Path(
        "tmp/lidar/marlins-usgs-2021-open-roof/survey-report-review-v1.json"
    )
    comparison_review_path = base_directory / "report-review.json"
    accepted_frame_path = Path(
        "tmp/lidar/marlins-usgs-2021-open-roof/hard-structure-local-registration-v1.json"
    )

    first, first_input = input_record(first_path)
    supplemental, supplemental_input = input_record(supplemental_path)
    prior_registration, prior_registration_input = input_record(prior_registration_path)
    consumed_holdout, consumed_holdout_input = input_record(consumed_holdout_path)
    diagnostic, diagnostic_input = input_record(diagnostic_path)
    reference_review, reference_review_input = input_record(reference_review_path)
    comparison_review, comparison_review_input = input_record(comparison_review_path)
    accepted_frame, accepted_frame_input = input_record(accepted_frame_path)

    if first["artifactKind"] != "marlins-2024-subpixel-control-consensus-audit":
        raise ValueError("First training consensus has the wrong kind")
    if supplemental["artifactKind"] != "marlins-2024-subpixel-control-consensus-audit":
        raise ValueError("Supplemental training consensus has the wrong kind")
    if not accepted_frame["registrationAcceptance"]["accepted"]:
        raise ValueError("The accepted 2021 frame is not accepted")
    if not comparison_review["gates"]["sourceVerticalAccuracy"]["pass"]:
        raise ValueError("The 2024 vertical source gate is not passed")
    if diagnostic["controlDesign"]["newIndependentHoldoutsRequiredForAnyChosenModel"] is not True:
        raise ValueError("Transform diagnostic does not require new holdouts")
    similarity = next(
        model for model in diagnostic["models"] if model["model"] == "similarity"
    )
    if similarity["parameters"]["parameterCount"] != 4:
        raise ValueError("Chosen similarity model does not have four parameters")
    if prior_registration["inputs"]["firstConsensus"] != first_input:
        raise ValueError("Prior registration does not score the first consensus")
    if prior_registration["inputs"]["supplementalConsensus"] != supplemental_input:
        raise ValueError("Prior registration does not score the supplemental consensus")
    if consumed_holdout["inputs"]["priorScoredRegistration"] != prior_registration_input:
        raise ValueError("Consumed holdout audit has the wrong prior registration")
    if diagnostic["inputs"]["scoredExploratoryHoldoutAudit"] != consumed_holdout_input:
        raise ValueError("Transform diagnostic did not consume the expected holdout audit")

    queues: dict[str, dict[str, Any]] = {}
    queue_inputs: dict[str, dict[str, Any]] = {}
    selected_records: list[dict[str, Any]] = []
    for tile in ("K", "N", "P"):
        queue_path = (
            base_directory / f"adjacent-2021-2024-{tile}-fresh-review-queue-v2.json"
        )
        queue, queue_input = input_record(queue_path)
        if queue["artifactKind"] != "cross-epoch-hard-structure-control-review-queue":
            raise ValueError(f"Fresh {tile} input has the wrong kind")
        if queue["parameters"]["minimumExclusionDistanceMetres"] < 10.0:
            raise ValueError(f"Fresh {tile} queue has a weak exclusion distance")
        for excluded in queue["inputs"]["excludedReviewQueues"]:
            validate_input_record(excluded)
        queues[tile] = queue
        queue_inputs[tile] = queue_input
        by_id = {candidate["candidateId"]: candidate for candidate in queue["candidates"]}
        if not set(SELECTED_IDS[tile]).issubset(by_id):
            raise ValueError(f"Selected {tile} control is absent from the queue")
        selected_records.extend(by_id[candidate_id] for candidate_id in SELECTED_IDS[tile])

    consumed_controls = [
        *first["controls"],
        *supplemental["controls"],
        *consumed_holdout["holdoutValidation"]["records"],
    ]
    minimum_prior_distance = min(
        distance(
            candidate["reference"]["utmMetres"],
            consumed["referenceUtmMetres"],
        )
        for candidate in selected_records
        for consumed in consumed_controls
    )
    minimum_holdout_separation = minimum_pair_separation(selected_records)
    if minimum_prior_distance < MINIMUM_PRIOR_CONTROL_DISTANCE_METRES:
        raise ValueError("A selected control is too close to consumed model data")
    if minimum_holdout_separation < MINIMUM_HOLDOUT_SEPARATION_METRES:
        raise ValueError("Selected final holdouts are not sufficiently separated")

    outputs: list[dict[str, Any]] = []
    for tile in ("K", "N", "P"):
        queue = queues[tile]
        by_id = {candidate["candidateId"]: candidate for candidate in queue["candidates"]}
        selected = set(SELECTED_IDS[tile])
        controls = []
        for candidate_id in SELECTED_IDS[tile]:
            local = by_id[candidate_id]["reference"]["localMetres"]
            controls.append({
                "candidateId": candidate_id,
                "role": "holdout",
                "semanticIdentity": (
                    f"{TILE_LABELS[tile]} fixed engineered roof edge or corner "
                    f"at local {local[0]:.1f}, {local[1]:.1f} metres"
                ),
                "accepted": True,
            })
        rejected = [
            candidate["candidateId"]
            for candidate in queue["candidates"]
            if candidate["candidateId"] not in selected
        ]
        artifact: dict[str, Any] = {
            "schemaVersion": 1,
            "analysisVersion": ANALYSIS_VERSION,
            "artifactKind": (
                "reviewed-marlins-2021-2024-similarity-final-holdout-controls"
            ),
            "stadiumId": "marlins",
            "tileId": f"318449{tile}",
            "reviewStatus": "reviewed-2021-2024-hard-structure-lidar-controls",
            "reviewedOn": REVIEWED_ON,
            "inputs": {
                "reviewQueue": queue_inputs[tile],
                "reviewSheet": queue["reviewSheet"],
                "referenceSurveyReview": reference_review_input,
                "comparisonSurveyReview": comparison_review_input,
                "accepted2021Frame": accepted_frame_input,
                "firstConsumedTrainingConsensus": first_input,
                "supplementalConsumedTrainingConsensus": supplemental_input,
                "priorRigidRegistration": prior_registration_input,
                "consumedAdjacentHoldoutAudit": consumed_holdout_input,
                "transformFamilyDiagnostic": diagnostic_input,
            },
            "reviewProtocol": {
                "acceptedFeatureRule": (
                    "Accept only a discrete fixed engineered roof edge or corner "
                    "visible at the same semantic location in the paired 2021 and "
                    "2024 height and hard-structure views."
                ),
                "rejectedFeatureRule": (
                    "Reject vegetation-dominated points, ambiguous texture, close "
                    "duplicates, temporary objects, and proposals whose paired views "
                    "do not establish the same fixed engineered feature."
                ),
                "freshFinalHoldoutRule": (
                    "Every accepted control comes from a queue excluding all prior "
                    "proposals by at least 10 metres, is at least 50 metres from every "
                    "control consumed during transform-family selection, and was "
                    "locked before its multiscale localization or similarity-model "
                    "residual was computed."
                ),
                "chosenModelFamily": "four-parameter similarity transform",
                "partitionRule": (
                    "Every accepted control is a final holdout and is never a fit input."
                ),
                "maximumCoarseToMultiscaleLocalizationDistanceMetres": 0.20,
                "minimumDistanceFromEveryConsumedControlMetres": (
                    minimum_prior_distance
                ),
                "minimumCombinedFinalHoldoutSeparationMetres": (
                    minimum_holdout_separation
                ),
                "minimumQueueCandidateSeparationMetres": queue["parameters"][
                    "minimumCandidateSeparationMetres"
                ],
                "minimumPriorProposalExclusionDistanceMetres": queue["parameters"][
                    "minimumExclusionDistanceMetres"
                ],
            },
            "controls": controls,
            "rejectedCandidateIds": rejected,
            "assessment": {
                "queueCandidateCount": len(queue["candidates"]),
                "acceptedControlCount": len(controls),
                "trainingControlCount": 0,
                "holdoutControlCount": len(controls),
                "everyQueueCandidateReviewedExactlyOnce": (
                    len(controls) + len(rejected) == len(queue["candidates"])
                ),
                "semanticHardStructureIdentityReviewed": True,
                "movableRoofControlsExcluded": True,
                "vegetationControlsExcluded": True,
                "localizationInspectedBeforeLock": False,
                "residualAgainstAnyFittedTransformInspected": False,
                "residualAgainstChosenSimilarityTransformInspected": False,
                "registrationMeasurementEligible": False,
                "publicationEligible": False,
                "blockers": [
                    "LOCKED_MULTISCALE_LOCALIZATION_NOT_YET_AUDITED",
                    "FRESH_SIMILARITY_HOLDOUT_RESIDUALS_NOT_YET_SCORED",
                    "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
                ],
            },
        }
        artifact["artifactVersion"] = artifact_version(artifact)
        output_path = (
            output_directory
            / f"adjacent-2021-2024-{tile}-similarity-final-holdout-controls-v2.json"
        )
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(artifact, indent=2) + "\n")
        outputs.append({
            "path": str(output_path),
            "artifactVersion": artifact["artifactVersion"],
            "acceptedControlCount": len(controls),
            "rejectedCandidateCount": len(rejected),
        })
    return outputs


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--base-directory",
        type=Path,
        default=Path("tmp/lidar/marlins-usgs-fl-miamidade-d23"),
    )
    parser.add_argument(
        "--output-directory",
        type=Path,
        default=Path("tmp/lidar/marlins-usgs-fl-miamidade-d23"),
    )
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    outputs = build_artifacts(
        arguments.base_directory,
        arguments.output_directory,
    )
    print(json.dumps({"outputs": outputs}, indent=2))


if __name__ == "__main__":
    main()
