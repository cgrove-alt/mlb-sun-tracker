#!/usr/bin/env python3
"""Lock full-tile at-grade ground controls before cross-sensor localization."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


ANALYSIS_VERSION = "marlins-2025-full-tile-ground-controls-v1"
MINIMUM_CENTER_SEPARATION_FEET = 120.0

TRAINING = {
    "ground-control-00": "east-south at-grade road edge and parking-lot curb patch",
    "ground-control-08": "north-central at-grade divided-road lane and curb patch",
    "ground-control-14": "west-central residential street curb and sidewalk patch",
    "ground-control-20": "central-south residential street and curb patch",
    "ground-control-24": "central-south-west residential street and curb patch",
    "ground-control-28": "central-south residential roadway and fixed curb patch",
    "ground-control-44": "north-east at-grade curb-return and roadway patch",
    "ground-control-54": "far-south-west residential street and fixed curb patch",
    "ground-control-58": "south-west at-grade roadway and curb patch",
    "ground-control-70": "far-west diagonal at-grade roadway and curb patch",
    "ground-control-76": "east-north at-grade crosswalk and intersection patch",
    "ground-control-84": "far-south-west at-grade crosswalk and intersection patch",
    "ground-control-94": "far-east at-grade roadway and intersection patch",
    "ground-control-96": "far-north-west residential street and curb patch",
    "ground-control-98": "far-south-east at-grade roadway and intersection patch",
}

FINAL_HOLDOUT = {
    "ground-control-01": "far-north-east at-grade channelized roadway junction patch",
    "ground-control-05": "far-west at-grade rail and roadway crossing patch",
    "ground-control-19": "central-south residential north-south street and curb patch",
    "ground-control-21": "south-west at-grade crosswalk and intersection patch",
    "ground-control-25": "south-east at-grade crosswalk and intersection patch",
    "ground-control-31": "far-north-east at-grade parking markings and island-curb patch",
    "ground-control-33": "far-south-east at-grade crosswalk and intersection patch",
    "ground-control-41": "far-east-north at-grade crosswalk and intersection patch",
    "ground-control-43": "far-south-east roadway and crosswalk patch",
    "ground-control-49": "west-central at-grade multilane roadway-marking patch",
    "ground-control-53": "south-east at-grade parking markings and drive-aisle patch",
    "ground-control-69": "far-north-west at-grade curved curb-return and roadway patch",
    "ground-control-75": "far-south-west residential roadway and curb patch",
    "ground-control-88": "north-east at-grade roadway edge and sidewalk patch",
    "ground-control-93": "far-north-west at-grade curved roadway and curb patch",
}


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
        raise ValueError("Input is not the full-tile ground-control queue")
    if queue.get("stadiumId") != "marlins":
        raise ValueError("Ground-control queue targets another stadium")
    parameters = queue["parameters"]
    if parameters["crossSensorOffsetMeasuredDuringProposal"]:
        raise ValueError("Queue proposal inspected cross-sensor offsets")
    if parameters["minimumCandidateSeparationFeet"] < MINIMUM_CENTER_SEPARATION_FEET:
        raise ValueError("Queue proposal separation is below the locked-control gate")
    candidates = {record["candidateId"]: record for record in queue["candidates"]}
    accepted_ids = set(TRAINING) | set(FINAL_HOLDOUT)
    if set(TRAINING) & set(FINAL_HOLDOUT):
        raise ValueError("Training and final-holdout IDs overlap")
    if not accepted_ids <= set(candidates):
        raise ValueError("A reviewed control is absent from the queue")
    rejected_ids = sorted(set(candidates) - accepted_ids)
    controls = []
    semantics = TRAINING | FINAL_HOLDOUT
    for candidate_id in sorted(accepted_ids):
        candidate = candidates[candidate_id]
        controls.append({
            "candidateId": candidate_id,
            "role": "training" if candidate_id in TRAINING else "final-holdout",
            "semanticIdentity": semantics[candidate_id],
            "statePlaneFeet": candidate["orthophoto"]["statePlaneFeet"],
            "localFeet": candidate["orthophoto"]["localFeet"],
            "proposalSector": candidate["proposalSector"],
            "accepted": True,
        })
    points = np.asarray([record["statePlaneFeet"] for record in controls])
    distances = np.linalg.norm(points[:, np.newaxis] - points[np.newaxis, :], axis=2)
    distances += np.eye(len(points)) * 1e12
    minimum_center_distance = float(np.min(distances))
    if minimum_center_distance < MINIMUM_CENTER_SEPARATION_FEET:
        raise ValueError("Accepted controls violate the center-separation gate")
    training_points = np.asarray([
        record["statePlaneFeet"] for record in controls if record["role"] == "training"
    ])
    holdout_points = np.asarray([
        record["statePlaneFeet"]
        for record in controls
        if record["role"] == "final-holdout"
    ])
    minimum_training_to_holdout = float(np.min(np.linalg.norm(
        training_points[:, np.newaxis] - holdout_points[np.newaxis, :], axis=2
    )))
    review = {
        "reviewerId": "codex-visual-review-2026-08-11",
        "completedAtUtc": "2026-08-11T00:00:00Z",
        "method": (
            "The complete official one-foot 2025 orthophoto mosaic, complete "
            "2024 classified-ground intensity raster, and all 100 checksum-locked "
            "candidate rows were reviewed. Accepted semantics are limited to "
            "fixed at-grade road markings, crosswalks, curbs, paved junctions, "
            "and surface parking markings visible in both sources. Buildings, "
            "elevated roads, roofs, vegetation, water, vehicles, shadows, and "
            "interpolated no-data geometry were rejected. Training and final "
            "holdout roles were fixed before any native offset or residual was "
            "computed for this queue."
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
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "reviewed-marlins-2025-full-tile-ground-controls",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "reviewStatus": "locked-before-full-tile-ground-localization",
        "inputs": {
            "reviewQueue": {
                "path": str(arguments.queue),
                "sha256": stable["queueSha256"],
                "artifactVersion": queue["artifactVersion"],
            },
            "reviewSheet": queue["reviewSheet"],
            "orthophotoAudit": queue["inputs"]["orthophotoAudit"],
            "mosaicManifest": queue["inputs"]["mosaicManifest"],
            "comparisonLidar": queue["inputs"]["comparisonLidar"],
        },
        "reviewProtocol": {
            **review,
            "crossSensorOffsetsInspectedBeforeLock": False,
            "registrationResidualsInspectedBeforeLock": False,
            "acceptedSemanticElevationClass": "at-grade-only",
            "minimumRequiredCenterSeparationFeet": MINIMUM_CENTER_SEPARATION_FEET,
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
            "acceptedProposalSectors": sorted({
                tuple(record["proposalSector"]) for record in controls
            }),
        },
        "assessment": {
            "everyQueueCandidateReviewedExactlyOnce": (
                accepted_ids | set(rejected_ids) == set(candidates)
            ),
            "elevatedFeaturesExcludedFromSemanticIdentity": True,
            "vegetationVehiclesWaterAndShadowsExcludedFromSemanticIdentity": True,
            "rolesLockedBeforeLocalization": True,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "FULL_TILE_GROUND_LOCALIZATION_NOT_YET_AUDITED",
                "FINAL_GROUND_HOLDOUT_RESIDUALS_NOT_YET_SCORED",
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
        "outputSha256": sha256_file(arguments.output),
    }, indent=2))


if __name__ == "__main__":
    main()
