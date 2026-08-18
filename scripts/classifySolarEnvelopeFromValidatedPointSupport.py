#!/usr/bin/env python3
"""Recover fixed solar-ray occlusion from cross-validated metric point support.

Every training point comes from a ray depth that independently agreed within
one foot across disjoint partner-camera partitions. A query ray is recovered as
fixed only when points from multiple training observations and multiple source
seats lie within the unchanged one-foot tube. Direct movable-background rays
remain movable only when no validated fixed point enters that tube.

Broadcast shade labels are not inputs. The output remains diagnostic until the
point-support rule passes reviewed material and independent shadow holdouts.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np


ANALYSIS_VERSION = "cross-observation-fixed-point-solar-ray-support-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("query_artifact", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--training-artifact", action="append", type=Path, required=True)
    parser.add_argument("--maximum-ray-tube-distance-metres", type=float, default=0.3048)
    parser.add_argument("--minimum-training-observations", type=int, default=2)
    parser.add_argument("--minimum-unique-source-seats", type=int, default=3)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def load_artifact(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text())
    if not value.get("assessment", {}).get("openRoofRayDepthDiagnosticEligible"):
        raise ValueError(f"Parallax artifact is not diagnostic eligible: {path}")
    if value.get("assessment", {}).get("publicationEligible"):
        raise ValueError("A diagnostic parallax artifact must not claim publication eligibility")
    if not value.get("results"):
        raise ValueError(f"Parallax artifact has no results: {path}")
    return value


def directions(artifact: dict[str, Any]) -> np.ndarray:
    return np.asarray(
        [
            sample["providerUnitDirectionTowardSun"]
            for sample in artifact["event"]["angularSamples"]
        ],
        dtype=np.float64,
    )


def training_points(
    artifacts: list[dict[str, Any]],
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    points = []
    observation_indices = []
    seat_ids = []
    depth_disagreements = []
    for observation_index, artifact in enumerate(artifacts):
        provider_directions = directions(artifact)
        for result in artifact["results"]:
            origin = np.asarray(result["cameraProviderPositionMetres"], dtype=np.float64)
            for sample in result["sampleResults"]:
                if sample["classification"] != "confirmed-fixed-structure-occluder":
                    continue
                disagreement = float(sample["absoluteDepthDisagreementMetres"])
                maximum = float(
                    artifact["parameters"]["maximumFixedDepthDisagreementMetres"]
                )
                if disagreement > maximum or maximum > 0.3048:
                    raise ValueError("A training fixed point violates the one-foot gate")
                depth = 0.5 * (
                    float(sample["training"]["bestDepthMetres"])
                    + float(sample["holdout"]["bestDepthMetres"])
                )
                points.append(
                    origin
                    + depth * provider_directions[int(sample["directionIndex"])]
                )
                observation_indices.append(observation_index)
                seat_ids.append(str(result["seatId"]))
                depth_disagreements.append(disagreement)
    if not points:
        raise ValueError("Training artifacts contain no confirmed fixed points")
    return (
        np.asarray(points, dtype=np.float64),
        np.asarray(observation_indices, dtype=np.int32),
        np.asarray(seat_ids),
        np.asarray(depth_disagreements, dtype=np.float64),
    )


def main() -> None:
    args = parse_args()
    if args.maximum_ray_tube_distance_metres > 0.3048:
        raise ValueError("Ray tube distance may not exceed one foot")
    if args.minimum_training_observations < 2:
        raise ValueError("At least two training observations are required")
    if args.minimum_unique_source_seats < 3:
        raise ValueError("At least three unique source seats are required")
    query = load_artifact(args.query_artifact)
    training = [load_artifact(path) for path in args.training_artifact]
    if len(training) < args.minimum_training_observations:
        raise ValueError("Too few training artifacts for the requested observation gate")
    candidate_ids = [artifact["event"]["candidateId"] for artifact in training]
    if len(set(candidate_ids)) != len(candidate_ids):
        raise ValueError("Training observations must have unique candidate IDs")
    if query["event"]["candidateId"] in candidate_ids:
        raise ValueError("Query observation must be disjoint from training observations")
    points, observation_indices, source_seats, point_disagreements = training_points(training)
    query_directions = directions(query)
    results = []
    for result in query["results"]:
        origin = np.asarray(result["cameraProviderPositionMetres"], dtype=np.float64)
        relative = points - origin
        sample_results = []
        for sample in result["sampleResults"]:
            direction_index = int(sample["directionIndex"])
            direction = query_directions[direction_index]
            parameters = np.einsum("ij,j->i", relative, direction)
            perpendicular = relative - parameters[:, None] * direction[None, :]
            distances = np.sqrt(np.einsum("ij,ij->i", perpendicular, perpendicular))
            support_mask = (
                (parameters > 0.0)
                & (distances <= args.maximum_ray_tube_distance_metres)
            )
            support_indices = np.flatnonzero(support_mask)
            unique_observations = sorted(set(
                int(value) for value in observation_indices[support_indices]
            ))
            unique_seats = sorted(set(str(value) for value in source_seats[support_indices]))
            has_fixed_support = (
                len(unique_observations) >= args.minimum_training_observations
                and len(unique_seats) >= args.minimum_unique_source_seats
            )
            direct = str(sample["classification"])
            if direct == "confirmed-fixed-structure-occluder":
                classification = "confirmed-fixed-direct-parallax"
                basis = "query-disjoint-partition-depth-agreement"
            elif has_fixed_support:
                classification = "confirmed-fixed-cross-observation-point-support"
                basis = "multi-observation-multi-seat-one-foot-ray-tube"
            elif direct == "confirmed-movable-roof-background" and support_indices.size == 0:
                classification = "confirmed-movable-background-no-fixed-point-support"
                basis = "query-disjoint-partition-far-depth-and-empty-fixed-ray-tube"
            else:
                classification = "uncertain"
                basis = "insufficient-or-conflicting-fixed-point-support"
            sample_results.append({
                "directionIndex": direction_index,
                "directParallaxClassification": direct,
                "classification": classification,
                "basis": basis,
                "support": {
                    "pointCount": int(support_indices.size),
                    "uniqueTrainingObservationCount": len(unique_observations),
                    "uniqueTrainingObservationIndices": unique_observations,
                    "uniqueSourceSeatCount": len(unique_seats),
                    "uniqueSourceSeatIds": unique_seats,
                    "minimumRayDistanceMetres": (
                        None
                        if support_indices.size == 0
                        else round(float(np.min(distances[support_indices])), 6)
                    ),
                    "maximumSourceDepthDisagreementMetres": (
                        None
                        if support_indices.size == 0
                        else round(float(np.max(point_disagreements[support_indices])), 6)
                    ),
                },
            })
        sample_classes = [item["classification"] for item in sample_results]
        if all(value.startswith("confirmed-fixed-") for value in sample_classes):
            classification = "confirmed-fixed-envelope"
        elif all(
            value == "confirmed-movable-background-no-fixed-point-support"
            for value in sample_classes
        ):
            classification = "confirmed-movable-background-envelope"
        else:
            classification = "uncertain-envelope"
        results.append({
            "seatId": result["seatId"],
            "cameraProviderPositionMetres": result["cameraProviderPositionMetres"],
            "sampleResults": sample_results,
            "classification": classification,
        })
    classifications = [result["classification"] for result in results]
    stable = {
        "inputs": {
            "queryArtifact": {
                "path": str(args.query_artifact),
                "sha256": sha256_file(args.query_artifact),
                "artifactVersion": query["artifactVersion"],
            },
            "trainingArtifacts": [
                {
                    "path": str(path),
                    "sha256": sha256_file(path),
                    "artifactVersion": artifact["artifactVersion"],
                    "candidateId": artifact["event"]["candidateId"],
                }
                for path, artifact in zip(args.training_artifact, training)
            ],
        },
        "queryCandidateId": query["event"]["candidateId"],
        "parameters": {
            "maximumRayTubeDistanceMetres": args.maximum_ray_tube_distance_metres,
            "minimumTrainingObservations": args.minimum_training_observations,
            "minimumUniqueSourceSeats": args.minimum_unique_source_seats,
            "trainingPointCount": int(points.shape[0]),
        },
        "results": results,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "cross-observation-fixed-point-solar-ray-support",
        "artifactVersion": fingerprint(stable),
        **stable,
        "summary": {
            "targetSeatCount": len(results),
            "classificationCounts": {
                value: classifications.count(value)
                for value in sorted(set(classifications))
            },
        },
        "assessment": {
            "pointSupportDiagnosticEligible": True,
            "publicationEligible": False,
            "blockers": [
                "POINT_SUPPORT_RULE_NOT_YET_VALIDATED_AGAINST_REVIEWED_MATERIAL_HOLDOUTS",
                "INDEPENDENT_BROADCAST_ROW_BOUNDARY_NOT_YET_SCORED",
                "MOVABLE_BACKGROUND_IS_NOT_OPEN_SUN_WITHOUT_PARKED_ROOF_GEOMETRY",
                "ONLY_ONE_SECTION_AND_TWO_TRAINING_OBSERVATIONS_PROCESSED",
            ],
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "summary": artifact["summary"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
