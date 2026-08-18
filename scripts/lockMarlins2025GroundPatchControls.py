#!/usr/bin/env python3
"""Lock reviewed ground-patch semantics and partitions before localization."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


ANALYSIS_VERSION = "marlins-2025-ground-patch-controls-v1"
MINIMUM_CENTER_SEPARATION_FEET = 120.0

TRAINING = {
    "ground-patch-00": "north-west perimeter roadway curb and pavement-edge patch",
    "ground-patch-03": "north-central perimeter roadway curb and pavement-edge patch A",
    "ground-patch-05": "north-east at-grade crosswalk and curb-intersection patch",
    "ground-patch-08": "west upper at-grade plaza paving and fixed curb patch",
    "ground-patch-11": "west lower at-grade plaza ramp and pavement-boundary patch",
    "ground-patch-14": "south-west at-grade crosswalk and curb-intersection patch",
    "ground-patch-16": "south-central at-grade roadway curb and pavement patch",
    "ground-patch-18": "south-east at-grade roadway and curb-intersection patch",
    "ground-patch-21": "east upper-middle at-grade roadway and curb patch",
    "ground-patch-23": "east lower-middle at-grade roadway and curb patch",
    "ground-patch-24": "east lower at-grade roadway and curb-intersection patch",
}

HOLDOUT = {
    "ground-patch-02": "north-west-central perimeter roadway curb and pavement-edge patch",
    "ground-patch-04": "north-central perimeter roadway curb and pavement-edge patch B",
    "ground-patch-06": "north far-east at-grade roadway and curb-intersection patch",
    "ground-patch-09": "west middle at-grade plaza paving and fixed curb patch",
    "ground-patch-13": "south-west perimeter at-grade roadway and curb patch",
    "ground-patch-15": "south-central-west at-grade roadway and crosswalk patch",
    "ground-patch-17": "south-east at-grade crosswalk and curb-intersection patch",
    "ground-patch-20": "east upper at-grade crosswalk and curb-intersection patch",
    "ground-patch-22": "east middle at-grade roadway dual-curb patch",
    "ground-patch-27": "far-east lower fixed landscaped-island curb and roadway patch",
    "ground-patch-28": "far-east lower at-grade roadway and curb patch",
}


def stable_sha256(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("queue", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()
    queue_bytes = arguments.queue.read_bytes()
    queue = json.loads(queue_bytes)
    if queue.get("artifactKind") != (
        "marlins-2025-orthophoto-2024-lidar-ground-patch-review-queue"
    ):
        raise ValueError("Input is not the ground-patch review queue")
    if queue.get("stadiumId") != "marlins":
        raise ValueError("Ground-patch queue targets another stadium")
    if queue["proposalProtocol"]["crossSensorOffsetsComputedDuringProposal"]:
        raise ValueError("Queue was not built independently of offsets")
    if queue["proposalProtocol"]["registrationResidualsComputedDuringProposal"]:
        raise ValueError("Queue was not built independently of residuals")
    candidates = {record["candidateId"]: record for record in queue["candidates"]}
    accepted_ids = set(TRAINING) | set(HOLDOUT)
    if set(TRAINING) & set(HOLDOUT):
        raise ValueError("Training and final holdout IDs overlap")
    if not accepted_ids <= set(candidates):
        raise ValueError("A locked control is absent from the review queue")
    rejected_ids = sorted(set(candidates) - accepted_ids)
    controls = []
    for candidate_id in sorted(accepted_ids):
        candidate = candidates[candidate_id]
        role = "training" if candidate_id in TRAINING else "final-holdout"
        identity = (TRAINING | HOLDOUT)[candidate_id]
        controls.append({
            "candidateId": candidate_id,
            "role": role,
            "semanticIdentity": identity,
            "statePlaneFeet": candidate["statePlaneFeet"],
            "displayPixelOneFoot": candidate["displayPixelOneFoot"],
            "patchHalfWidthFeet": candidate["patchHalfWidthFeet"],
            "directGroundCoverageFraction": candidate[
                "directGroundCoverageFraction"
            ],
            "accepted": True,
        })
    points = np.asarray([record["statePlaneFeet"] for record in controls], dtype=float)
    distances = np.linalg.norm(points[:, np.newaxis] - points[np.newaxis, :], axis=2)
    distances += np.eye(len(points)) * 1e9
    minimum_separation = float(np.min(distances))
    if minimum_separation < MINIMUM_CENTER_SEPARATION_FEET:
        raise ValueError(
            f"Locked control centers are only {minimum_separation:.3f} feet apart"
        )
    training_points = np.asarray([
        record["statePlaneFeet"] for record in controls if record["role"] == "training"
    ])
    holdout_points = np.asarray([
        record["statePlaneFeet"]
        for record in controls
        if record["role"] == "final-holdout"
    ])
    train_holdout_distance = float(np.min(np.linalg.norm(
        training_points[:, np.newaxis] - holdout_points[np.newaxis, :],
        axis=2,
    )))
    review = {
        "reviewerId": "codex-visual-review-2026-08-11",
        "completedAtUtc": "2026-08-11T00:00:00Z",
        "method": (
            "The complete nominal 2025 orthophoto, 2024 classified-ground "
            "intensity raster, and every checksum-locked queue patch were "
            "reviewed. A patch was accepted only for durable at-grade pavement, "
            "curb, crosswalk, or plaza boundaries visible in both sources. "
            "Elevated structures, vegetation, vehicles, shadows, and filled "
            "no-data regions were excluded from the semantic identity. Roles "
            "were fixed before any cross-sensor offset or residual was computed."
        ),
    }
    stable = {
        "queueSha256": hashlib.sha256(queue_bytes).hexdigest(),
        "queueArtifactVersion": queue["artifactVersion"],
        "review": review,
        "controls": controls,
        "rejectedCandidateIds": rejected_ids,
        "minimumControlCenterSeparationFeet": minimum_separation,
        "minimumTrainingToHoldoutCenterDistanceFeet": train_holdout_distance,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "reviewed-marlins-2025-ground-patch-controls",
        "artifactVersion": stable_sha256(stable),
        "stadiumId": "marlins",
        "reviewStatus": "locked-before-ground-patch-localization",
        "inputs": {
            "reviewQueue": {
                "path": str(arguments.queue),
                "sha256": stable["queueSha256"],
                "artifactVersion": queue["artifactVersion"],
            },
            "reviewSheet": {
                "path": queue["reviewSheet"]["path"],
                "sha256": queue["reviewSheet"]["sha256"],
            },
            "orthophotoAudit": queue["inputs"]["orthophotoAudit"],
            "mosaicManifest": queue["inputs"]["mosaicManifest"],
            "comparisonLidar": queue["inputs"]["comparisonLidar"],
        },
        "reviewProtocol": {
            **review,
            "crossSensorOffsetsInspectedBeforeLock": False,
            "registrationResidualsInspectedBeforeLock": False,
            "maximumPatchHalfWidthFeet": max(
                record["patchHalfWidthFeet"] for record in controls
            ),
            "minimumRequiredCenterSeparationFeet": MINIMUM_CENTER_SEPARATION_FEET,
        },
        "controls": controls,
        "rejectedCandidateIds": rejected_ids,
        "spatialDesign": {
            "acceptedControlCount": len(controls),
            "trainingControlCount": len(TRAINING),
            "finalHoldoutControlCount": len(HOLDOUT),
            "minimumControlCenterSeparationFeet": minimum_separation,
            "minimumTrainingToHoldoutCenterDistanceFeet": train_holdout_distance,
        },
        "assessment": {
            "everyQueueCandidateReviewedExactlyOnce": (
                accepted_ids | set(rejected_ids) == set(candidates)
            ),
            "elevatedFeaturesExcludedFromSemanticIdentity": True,
            "vegetationVehiclesAndShadowsExcludedFromSemanticIdentity": True,
            "rolesLockedBeforeLocalization": True,
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "GROUND_PATCH_LOCALIZATION_NOT_YET_AUDITED",
                "FINAL_GROUND_HOLDOUT_RESIDUALS_NOT_YET_SCORED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    artifact["artifactVersion"] = artifact_version({
        key: value for key, value in artifact.items() if key != "artifactVersion"
    })
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "acceptedControlCount": len(controls),
        "trainingControlCount": len(TRAINING),
        "finalHoldoutControlCount": len(HOLDOUT),
        "rejectedControlCount": len(rejected_ids),
        "minimumControlCenterSeparationFeet": minimum_separation,
        "minimumTrainingToHoldoutCenterDistanceFeet": train_holdout_distance,
        "outputSha256": sha256_file(arguments.output),
    }, indent=2))


if __name__ == "__main__":
    main()
