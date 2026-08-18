#!/usr/bin/env python3
"""Lock fresh hard-curb controls before any v7 localization is computed."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from scipy.spatial import ConvexHull

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


ANALYSIS_VERSION = "marlins-2025-fresh-hard-curb-controls-v1"
EXPECTED_QUEUE_CANDIDATE_COUNT = 68
MINIMUM_EXCLUDED_QUEUE_COUNT = 4
MINIMUM_CENTER_SEPARATION_FEET = 120.0
MINIMUM_EXCLUDED_QUEUE_DISTANCE_FEET = 120.0
STADIUM_ANCHOR_STATE_PLANE_FEET = np.asarray([913125.0, 525625.0])

TRAINING = {
    "ground-control-03": "fixed curved street curb-return and sidewalk edge",
    "ground-control-08": "fixed curved paved edge and sidewalk junction",
    "ground-control-12": "fixed residential street curb-return and sidewalk edge",
    "ground-control-15": "fixed elongated parking-island curb perimeter",
    "ground-control-16": "fixed residential intersection curb-return and sidewalk edge",
    "ground-control-19": "fixed residential street curb and sidewalk edge",
    "ground-control-24": "fixed park-side street curb and sidewalk edge",
    "ground-control-31": "fixed residential street curb-return and sidewalk edge",
    "ground-control-37": "fixed commercial street curb and sidewalk edge",
    "ground-control-40": "fixed curved paved turnaround curb perimeter",
    "ground-control-43": "fixed cemetery entrance curb and driveway edge",
    "ground-control-47": "fixed residential street curb and sidewalk edge",
}

FINAL_HOLDOUT = {
    "ground-control-00": "fixed paved access curb and parking edge",
    "ground-control-02": "fixed commercial driveway curb and sidewalk edge",
    "ground-control-10": "fixed residential street curb and sidewalk edge",
    "ground-control-11": "fixed commercial street curb and sidewalk edge",
    "ground-control-13": "fixed residential street curb and sidewalk edge",
    "ground-control-14": "fixed residential street curb and driveway edge",
    "ground-control-17": "fixed residential street curb and sidewalk edge",
    "ground-control-21": "fixed residential street curb-return and sidewalk edge",
    "ground-control-28": "fixed paved-lot curb perimeter",
    "ground-control-29": "fixed residential street curb and sidewalk edge",
    "ground-control-38": "fixed road-edge curb and sidewalk boundary",
    "ground-control-51": "fixed commercial roadway curb and sidewalk edge",
}


def point_inside_hull(point: np.ndarray, controls: np.ndarray) -> bool:
    hull = ConvexHull(controls)
    return bool(np.all(
        hull.equations[:, :2] @ point + hull.equations[:, 2] <= 1e-8
    ))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("queue", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    raw = arguments.queue.read_bytes()
    queue = json.loads(raw)
    if queue.get("artifactKind") != (
        "marlins-2025-orthophoto-2024-lidar-ground-control-queue"
    ):
        raise ValueError("Input is not a Marlins ground-control queue")
    if queue.get("stadiumId") != "marlins":
        raise ValueError("Ground-control queue targets another stadium")
    if len(queue.get("candidates", [])) != EXPECTED_QUEUE_CANDIDATE_COUNT:
        raise ValueError("Fresh hard-curb queue candidate count changed")
    if len(queue.get("excludedQueues", [])) < MINIMUM_EXCLUDED_QUEUE_COUNT:
        raise ValueError("Fresh hard-curb queue excludes too few consumed queues")
    parameters = queue["parameters"]
    if parameters["crossSensorOffsetMeasuredDuringProposal"]:
        raise ValueError("Queue proposal inspected a cross-sensor offset")
    if parameters["minimumCandidateSeparationFeet"] < MINIMUM_CENTER_SEPARATION_FEET:
        raise ValueError("Queue candidate separation is below the hard-curb gate")
    if parameters["minimumExclusionDistanceFeet"] < MINIMUM_EXCLUDED_QUEUE_DISTANCE_FEET:
        raise ValueError("Consumed-queue exclusion distance is below the gate")

    candidates = {record["candidateId"]: record for record in queue["candidates"]}
    accepted_ids = set(TRAINING) | set(FINAL_HOLDOUT)
    if set(TRAINING) & set(FINAL_HOLDOUT):
        raise ValueError("Training and final-holdout roles overlap")
    if not accepted_ids <= set(candidates):
        raise ValueError("A reviewed hard-curb control is absent from the queue")
    rejected_ids = sorted(set(candidates) - accepted_ids)
    semantics = TRAINING | FINAL_HOLDOUT
    controls = []
    for candidate_id in sorted(accepted_ids):
        candidate = candidates[candidate_id]
        controls.append({
            "candidateId": candidate_id,
            "role": "training" if candidate_id in TRAINING else "final-holdout",
            "semanticIdentity": semantics[candidate_id],
            "statePlaneFeet": candidate["orthophoto"]["statePlaneFeet"],
            "localFeet": candidate["orthophoto"]["localFeet"],
            "proposalSector": candidate["proposalSector"],
            "directGroundCoverageFraction": candidate[
                "directGroundCoverageFraction"
            ],
            "accepted": True,
        })

    points = np.asarray([record["statePlaneFeet"] for record in controls])
    distances = np.linalg.norm(points[:, None] - points[None], axis=2)
    distances += np.eye(len(points)) * 1e12
    minimum_center_distance = float(np.min(distances))
    if minimum_center_distance < MINIMUM_CENTER_SEPARATION_FEET:
        raise ValueError("Accepted hard-curb controls violate center separation")
    training_points = np.asarray([
        record["statePlaneFeet"] for record in controls if record["role"] == "training"
    ])
    holdout_points = np.asarray([
        record["statePlaneFeet"]
        for record in controls
        if record["role"] == "final-holdout"
    ])
    minimum_training_to_holdout = float(np.min(np.linalg.norm(
        training_points[:, None] - holdout_points[None], axis=2
    )))
    stadium_inside_training_hull = point_inside_hull(
        STADIUM_ANCHOR_STATE_PLANE_FEET,
        training_points,
    )
    if not stadium_inside_training_hull:
        raise ValueError("Stadium anchor is outside the training hard-curb hull")

    review = {
        "reviewerId": "codex-visual-review-2026-08-12",
        "completedAtUtc": "2026-08-12T01:24:57Z",
        "method": (
            "All 68 checksum-locked v7 candidate rows were reviewed in the official "
            "one-foot 2025 orthophoto, orthophoto high-pass, 2024 classified-ground "
            "intensity, and intensity high-pass panels before localization. Accepted "
            "controls are durable at-grade curb, sidewalk-edge, driveway-edge, or "
            "paved-perimeter geometry visibly present in both epochs. Paint-only, "
            "building, elevated-road, roof, vegetation, water, vehicle, shadow, "
            "construction, and no-data candidates were rejected. Training and final "
            "roles are balanced across the accepted hard-edge semantic family and "
            "were fixed before any v7 offsets, response surfaces, or residuals were "
            "computed."
        ),
    }
    stable = {
        "queueSha256": hashlib.sha256(raw).hexdigest(),
        "queueArtifactVersion": queue["artifactVersion"],
        "review": review,
        "controls": controls,
        "rejectedCandidateIds": rejected_ids,
        "minimumCenterDistanceFeet": minimum_center_distance,
        "minimumTrainingToHoldoutCenterDistanceFeet": minimum_training_to_holdout,
        "stadiumInsideTrainingControlHull": stadium_inside_training_hull,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "reviewed-marlins-2025-fresh-hard-curb-controls",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "reviewStatus": "locked-before-v7-hard-curb-localization",
        "inputs": {
            "reviewQueue": {
                "path": str(arguments.queue),
                "sha256": stable["queueSha256"],
                "artifactVersion": queue["artifactVersion"],
            },
            "excludedQueues": queue["excludedQueues"],
            "reviewSheet": queue["reviewSheet"],
            "orthophotoAudit": queue["inputs"]["orthophotoAudit"],
            "mosaicManifest": queue["inputs"]["mosaicManifest"],
            "comparisonLidar": queue["inputs"]["comparisonLidar"],
        },
        "reviewProtocol": {
            **review,
            "crossSensorOffsetsInspectedBeforeLock": False,
            "responseSurfacesInspectedBeforeLock": False,
            "registrationResidualsInspectedBeforeLock": False,
            "acceptedSemanticFamily": "durable-at-grade-hard-curb-or-sidewalk-edge",
            "paintOnlyFeaturesExcluded": True,
            "minimumRequiredCenterSeparationFeet": MINIMUM_CENTER_SEPARATION_FEET,
            "minimumRequiredExcludedQueueDistanceFeet": (
                MINIMUM_EXCLUDED_QUEUE_DISTANCE_FEET
            ),
        },
        "controls": controls,
        "rejectedCandidateIds": rejected_ids,
        "spatialDesign": {
            "queueCandidateCount": len(candidates),
            "acceptedControlCount": len(controls),
            "trainingControlCount": len(TRAINING),
            "finalHoldoutControlCount": len(FINAL_HOLDOUT),
            "minimumControlCenterSeparationFeet": minimum_center_distance,
            "minimumTrainingToHoldoutCenterDistanceFeet": minimum_training_to_holdout,
            "stadiumInsideTrainingControlHull": stadium_inside_training_hull,
            "trainingProposalSectors": sorted({
                tuple(record["proposalSector"])
                for record in controls if record["role"] == "training"
            }),
            "finalHoldoutProposalSectors": sorted({
                tuple(record["proposalSector"])
                for record in controls if record["role"] == "final-holdout"
            }),
        },
        "assessment": {
            "everyQueueCandidateReviewedExactlyOnce": (
                accepted_ids | set(rejected_ids) == set(candidates)
            ),
            "hardEdgeSemanticFamilyBalancedAcrossRoles": True,
            "paintOnlyFeaturesExcluded": True,
            "rolesLockedBeforeLocalization": True,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "FRESH_HARD_CURB_RESPONSE_SURFACES_NOT_YET_ACQUIRED",
                "TRAINING_MODEL_NOT_YET_FROZEN",
                "FINAL_HOLDOUTS_NOT_YET_ACQUIRED_OR_SCORED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "acceptedControlCount": len(controls),
        "trainingControlCount": len(TRAINING),
        "finalHoldoutControlCount": len(FINAL_HOLDOUT),
        "rejectedControlCount": len(rejected_ids),
        "minimumControlCenterSeparationFeet": minimum_center_distance,
        "minimumTrainingToHoldoutCenterDistanceFeet": minimum_training_to_holdout,
        "stadiumInsideTrainingControlHull": stadium_inside_training_hull,
        "outputSha256": sha256_file(arguments.output),
    }, indent=2))


if __name__ == "__main__":
    main()
