#!/usr/bin/env python3
"""Lock the fresh full-tile at-grade controls before localization."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from scipy.spatial import ConvexHull

from auditNoaa2021HardStructureRegistration import artifact_version, sha256_file


MINIMUM_CENTER_SEPARATION_FEET = 120.0
MINIMUM_EXCLUDED_QUEUE_DISTANCE_FEET = 120.0

TRAINING = {
    "ground-control-02": "surface parking stall paint and fixed island curb patch",
    "ground-control-04": "surface parking aisle paint and fixed curb patch",
    "ground-control-05": "at-grade crosswalk and street curb-return patch",
    "ground-control-14": "surface parking drive-aisle and fixed curb-return patch",
    "ground-control-20": "cemetery entrance pavement and fixed curb-return patch",
    "ground-control-39": "surface parking island curb and painted-stall patch",
    "ground-control-44": "at-grade roadway lane and fixed road-edge patch",
    "ground-control-46": "at-grade circular-road curb and lane-marking patch",
    "ground-control-59": "residential street, sidewalk, and fixed driveway-edge patch",
    "ground-control-65": "at-grade roadway curve and fixed curb-return patch",
    "ground-control-68": "multilane roadway paint and fixed channelized-island patch",
    "ground-control-76": "surface parking drive-aisle and fixed curb patch",
    "ground-control-84": "at-grade residential junction and fixed curb-return patch",
    "ground-control-89": "at-grade roadway lane-marking and fixed road-edge patch",
    "ground-control-93": "at-grade crosswalk and intersection curb-return patch",
}

FINAL_HOLDOUT = {
    "ground-control-01": "fixed rounded parking-island curb and pavement patch",
    "ground-control-03": "multilane roadway paint and fixed road-edge patch",
    "ground-control-13": "surface parking island curb and painted-stall patch",
    "ground-control-23": "at-grade urban junction pavement and fixed curb patch",
    "ground-control-25": "surface parking internal junction and lane-marking patch",
    "ground-control-40": "at-grade commercial roadway edge and pavement-marking patch",
    "ground-control-45": "surface parking crosswalk, lane paint, and fixed curb patch",
    "ground-control-50": "at-grade road curve, sidewalk, and fixed curb patch",
    "ground-control-62": "at-grade residential roadway and fixed sidewalk-edge patch",
    "ground-control-70": "multilane roadway marking and fixed road-edge patch",
    "ground-control-73": "at-grade intersection paint and fixed curb-return patch",
    "ground-control-80": "multilane roadway marking and fixed road-edge patch",
    "ground-control-82": "at-grade roadway edge and fixed curb patch",
    "ground-control-91": "residential street, sidewalk, and fixed curb-return patch",
    "ground-control-94": "at-grade curved-road paint and fixed channelized-island patch",
}

SUPPLEMENTAL_TRAINING = {
    "ground-control-02": "at-grade crosswalk and fixed curb-return patch",
    "ground-control-10": "surface parking island curb and painted-stall patch",
    "ground-control-15": "at-grade divided-road islands and fixed curb patch",
    "ground-control-18": "multilane roadway paint and fixed road-edge patch",
    "ground-control-32": "surface parking island curb and pavement patch",
    "ground-control-36": "multilane roadway paint and fixed channelized-island patch",
    "ground-control-41": "multilane roadway paint and fixed road-edge patch",
    "ground-control-46": "at-grade curved-road paint and fixed curb patch",
    "ground-control-52": "at-grade marked intersection and fixed curb-return patch",
    "ground-control-83": "multilane marked intersection and fixed curb-return patch",
}

SUPPLEMENTAL_FINAL_HOLDOUT = {
    "ground-control-07": "surface parking paint and fixed curb-return patch",
    "ground-control-17": "surface parking island curb and pavement patch",
    "ground-control-30": "at-grade residential intersection and fixed curb patch",
    "ground-control-43": "at-grade street edge, sidewalk, and fixed curb patch",
    "ground-control-44": "multilane roadway paint and fixed channelized-island patch",
    "ground-control-55": "multilane roadway paint and fixed road-edge patch",
    "ground-control-67": "at-grade road edge and fixed paved-lot curb patch",
    "ground-control-79": "multilane roadway paint and fixed road-edge patch",
    "ground-control-82": "at-grade marked intersection and fixed curb-return patch",
    "ground-control-86": "multilane marked intersection and fixed curb-return patch",
}

PROFILES = {
    "v5": {
        "analysisVersion": "marlins-2025-fresh-full-tile-ground-controls-v1",
        "training": TRAINING,
        "finalHoldout": FINAL_HOLDOUT,
        "expectedQueueCandidateCount": 96,
        "minimumExcludedQueueCount": 2,
        "completedAtUtc": "2026-08-11T23:12:31Z",
    },
    "v6-supplemental": {
        "analysisVersion": (
            "marlins-2025-supplemental-fresh-full-tile-ground-controls-v1"
        ),
        "training": SUPPLEMENTAL_TRAINING,
        "finalHoldout": SUPPLEMENTAL_FINAL_HOLDOUT,
        "expectedQueueCandidateCount": 88,
        "minimumExcludedQueueCount": 3,
        "completedAtUtc": "2026-08-11T23:26:42Z",
    },
}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("queue", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--profile", choices=tuple(PROFILES), default="v5")
    arguments = parser.parse_args()
    profile = PROFILES[arguments.profile]
    training = profile["training"]
    final_holdout = profile["finalHoldout"]
    raw = arguments.queue.read_bytes()
    queue = json.loads(raw)
    if queue.get("artifactKind") != (
        "marlins-2025-orthophoto-2024-lidar-ground-control-queue"
    ):
        raise ValueError("Input is not a full-tile ground-control queue")
    if queue.get("stadiumId") != "marlins":
        raise ValueError("Ground-control queue targets another stadium")
    parameters = queue["parameters"]
    if parameters["crossSensorOffsetMeasuredDuringProposal"]:
        raise ValueError("Queue proposal inspected cross-sensor offsets")
    if parameters["minimumCandidateSeparationFeet"] < MINIMUM_CENTER_SEPARATION_FEET:
        raise ValueError("Queue proposal separation is below the control gate")
    if parameters["minimumExclusionDistanceFeet"] < MINIMUM_EXCLUDED_QUEUE_DISTANCE_FEET:
        raise ValueError("Fresh queue exclusion distance is below the control gate")
    if len(queue.get("excludedQueues", [])) < profile["minimumExcludedQueueCount"]:
        raise ValueError("Fresh queue excludes too few consumed predecessor queues")

    candidates = {record["candidateId"]: record for record in queue["candidates"]}
    if len(candidates) != profile["expectedQueueCandidateCount"]:
        raise ValueError("Fresh queue candidate count does not match the profile")
    accepted_ids = set(training) | set(final_holdout)
    if set(training) & set(final_holdout):
        raise ValueError("Training and final-holdout IDs overlap")
    if not accepted_ids <= set(candidates):
        raise ValueError("A reviewed control is absent from the queue")
    rejected_ids = sorted(set(candidates) - accepted_ids)
    semantics = training | final_holdout
    controls = []
    for candidate_id in sorted(accepted_ids):
        candidate = candidates[candidate_id]
        controls.append({
            "candidateId": candidate_id,
            "role": "training" if candidate_id in training else "final-holdout",
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
    center = np.asarray([
        (queue["extentStatePlaneFeet"]["xmin"] + queue["extentStatePlaneFeet"]["xmax"]) / 2,
        (queue["extentStatePlaneFeet"]["ymin"] + queue["extentStatePlaneFeet"]["ymax"]) / 2,
    ])
    hull = ConvexHull(training_points)
    hull_points = training_points[hull.vertices]
    hull_edges = np.roll(hull_points, -1, axis=0) - hull_points
    center_vectors = center - hull_points
    cross_products = (
        hull_edges[:, 0] * center_vectors[:, 1]
        - hull_edges[:, 1] * center_vectors[:, 0]
    )
    stadium_inside_training_hull = bool(
        np.all(cross_products >= -1e-8) or np.all(cross_products <= 1e-8)
    )
    if not stadium_inside_training_hull:
        raise ValueError("Stadium is outside the locked training-control hull")

    review = {
        "reviewerId": "codex-visual-review-2026-08-11",
        "completedAtUtc": profile["completedAtUtc"],
        "method": (
            f"All {len(candidates)} checksum-locked candidate rows were reviewed in the official "
            "one-foot 2025 orthophoto, orthophoto high-pass, 2024 classified-ground "
            "intensity, and intensity high-pass views. Accepted semantics are limited "
            "to fixed at-grade roadway paint, crosswalks, curbs, paved junctions, "
            "and surface parking geometry visible in both sources. Buildings, "
            "elevated roads, roofs, vegetation, water, vehicles, shadows, construction "
            "objects, and interpolated no-data geometry were rejected. Training and "
            "final-holdout roles were fixed before any offset or residual was computed."
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
        "analysisVersion": profile["analysisVersion"],
        "artifactKind": "reviewed-marlins-2025-fresh-full-tile-ground-controls",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "reviewStatus": "locked-before-fresh-full-tile-ground-localization",
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
            "registrationResidualsInspectedBeforeLock": False,
            "acceptedSemanticElevationClass": "at-grade-only",
            "minimumRequiredCenterSeparationFeet": MINIMUM_CENTER_SEPARATION_FEET,
            "minimumRequiredExcludedQueueDistanceFeet": MINIMUM_EXCLUDED_QUEUE_DISTANCE_FEET,
        },
        "controls": controls,
        "rejectedCandidateIds": rejected_ids,
        "spatialDesign": {
            "queueCandidateCount": len(candidates),
            "acceptedControlCount": len(controls),
            "trainingControlCount": len(training),
            "finalHoldoutControlCount": len(final_holdout),
            "minimumControlCenterSeparationFeet": minimum_center_distance,
            "minimumTrainingToHoldoutCenterDistanceFeet": minimum_training_to_holdout,
            "stadiumInsideTrainingControlHull": stadium_inside_training_hull,
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
                "FRESH_FULL_TILE_GROUND_LOCALIZATION_NOT_YET_AUDITED",
                "FRESH_FINAL_GROUND_HOLDOUT_RESIDUALS_NOT_YET_SCORED",
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
        "trainingControlCount": len(training),
        "finalHoldoutControlCount": len(final_holdout),
        "rejectedControlCount": len(rejected_ids),
        "minimumControlCenterSeparationFeet": minimum_center_distance,
        "minimumTrainingToHoldoutCenterDistanceFeet": minimum_training_to_holdout,
        "stadiumInsideTrainingControlHull": stadium_inside_training_hull,
        "outputSha256": sha256_file(arguments.output),
    }, indent=2))


if __name__ == "__main__":
    main()
