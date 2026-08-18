#!/usr/bin/env python3
"""Build provider-local 3D anchors supported by disjoint panorama pairs.

Every retained anchor must be observed within the stated metric distance by at
least two training camera pairs and at least two holdout camera pairs. Camera
pairs are supplied explicitly so the caller can keep their source panoramas
disjoint. The artifact remains provider-local and cannot authorize publication.
"""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from scipy.spatial import cKDTree


ANALYSIS_VERSION = "cross-validated-known-pose-point-clouds-v2"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--training", type=Path, action="append", default=[])
    parser.add_argument("--holdout", type=Path, action="append", default=[])
    parser.add_argument("--provider-x-minimum", type=float, required=True)
    parser.add_argument("--provider-x-maximum", type=float, required=True)
    parser.add_argument("--provider-y-minimum", type=float, required=True)
    parser.add_argument("--provider-y-maximum", type=float, required=True)
    parser.add_argument("--provider-z-minimum", type=float, required=True)
    parser.add_argument("--provider-z-maximum", type=float, required=True)
    parser.add_argument("--support-distance-metres", type=float, default=0.20)
    parser.add_argument("--voxel-size-metres", type=float, default=0.10)
    parser.add_argument("--minimum-training-pairs", type=int, default=2)
    parser.add_argument("--minimum-holdout-pairs", type=int, default=2)
    parser.add_argument("--minimum-consensus-anchors", type=int, default=50)
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def values_summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 6),
        "median": None if finite.size == 0 else round(float(np.median(finite)), 6),
        "p95": None if finite.size == 0 else round(float(np.percentile(finite, 95)), 6),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 6),
    }


def minimum_enclosing_sphere(
    points: np.ndarray,
    fallback_center: np.ndarray,
) -> tuple[np.ndarray, float]:
    """Return the smallest sphere containing a small three-dimensional set."""
    if points.shape[0] == 0:
        raise ValueError("Cannot enclose an empty point set")
    tolerance = 1e-9
    best_center = np.asarray(fallback_center, dtype=float)
    best_radius = float(np.max(np.linalg.norm(points - best_center, axis=1)))

    def consider(center: np.ndarray, boundary_radius: float) -> None:
        nonlocal best_center, best_radius
        distances = np.linalg.norm(points - center, axis=1)
        if float(np.max(distances)) > boundary_radius + tolerance:
            return
        covering_radius = float(np.max(distances))
        if covering_radius < best_radius - tolerance:
            best_center = center
            best_radius = covering_radius

    for point in points:
        consider(point, 0.0)
    for first, second in itertools.combinations(points, 2):
        center = (first + second) / 2.0
        consider(center, float(np.linalg.norm(first - center)))
    for first, second, third in itertools.combinations(points, 3):
        normal = np.cross(second - first, third - first)
        normal_norm = float(np.linalg.norm(normal))
        if normal_norm <= 1e-12:
            continue
        normal /= normal_norm
        matrix = np.asarray([
            2.0 * (second - first),
            2.0 * (third - first),
            normal,
        ])
        right = np.asarray([
            float(np.dot(second, second) - np.dot(first, first)),
            float(np.dot(third, third) - np.dot(first, first)),
            float(np.dot(normal, first)),
        ])
        try:
            center = np.linalg.solve(matrix, right)
        except np.linalg.LinAlgError:
            continue
        consider(center, float(np.linalg.norm(first - center)))
    for subset in itertools.combinations(points, 4):
        first, second, third, fourth = subset
        matrix = 2.0 * np.asarray([
            second - first,
            third - first,
            fourth - first,
        ])
        right = np.asarray([
            float(np.dot(second, second) - np.dot(first, first)),
            float(np.dot(third, third) - np.dot(first, first)),
            float(np.dot(fourth, fourth) - np.dot(first, first)),
        ])
        try:
            center = np.linalg.solve(matrix, right)
        except np.linalg.LinAlgError:
            continue
        consider(center, float(np.linalg.norm(first - center)))
    return best_center, best_radius


def load_cloud(path: Path, bounds: np.ndarray) -> tuple[np.ndarray, dict[str, Any]]:
    artifact = json.loads(path.read_text())
    if not artifact.get("knownPoseValidation", {}).get("passed"):
        raise ValueError(f"Known-pose validation did not pass for {path}")
    assessment = artifact.get("assessment", {})
    measurement_eligible = bool(
        assessment.get("knownPoseProviderMetricMeasurementEligible")
        or assessment.get("denseKnownPoseProviderMetricMeasurementEligible")
        or assessment.get("photometricKnownPoseProviderMetricMeasurementEligible")
    )
    if not measurement_eligible:
        raise ValueError(f"Known-pose point cloud is not measurement eligible: {path}")
    npz_path = Path(artifact["geometry"]["npzPath"])
    if file_sha256(npz_path) != artifact["geometry"]["npzSha256"]:
        raise ValueError(f"Point-cloud checksum mismatch for {npz_path}")
    with np.load(npz_path) as payload:
        points = np.asarray(payload["provider_points_metres"], dtype=float)
    inside = np.all((points >= bounds[:, 0]) & (points <= bounds[:, 1]), axis=1)
    selected = points[inside]
    if selected.shape[0] == 0:
        raise ValueError(f"No points inside the requested bounds for {path}")
    return selected, {
        "path": str(path),
        "sha256": file_sha256(path),
        "artifactVersion": artifact["artifactVersion"],
        "analysisVersion": artifact.get("analysisVersion"),
        "npzPath": str(npz_path),
        "npzSha256": artifact["geometry"]["npzSha256"],
        "cameraPair": artifact["cameraPair"],
        "inputPointCount": int(points.shape[0]),
        "boundedPointCount": int(selected.shape[0]),
    }


def camera_ids(metadata: list[dict[str, Any]]) -> list[str]:
    return [
        seat_id
        for item in metadata
        for seat_id in (
            item["cameraPair"]["leftSeatId"],
            item["cameraPair"]["rightSeatId"],
        )
    ]


def render_plan(path: Path, points: np.ndarray, uncertainty: np.ndarray) -> None:
    width, height, padding = 1600, 1000, 55
    image = np.full((height, width, 3), 245, dtype=np.uint8)
    if points.shape[0] == 0:
        cv2.putText(image, "No consensus anchors", (50, 90), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (20, 20, 20), 3)
    else:
        minimum = np.min(points[:, [0, 2]], axis=0)
        maximum = np.max(points[:, [0, 2]], axis=0)
        scale = np.asarray([
            (width - 2 * padding) / max(maximum[0] - minimum[0], 1e-9),
            (height - 2 * padding) / max(maximum[1] - minimum[1], 1e-9),
        ])
        upper = max(float(np.percentile(uncertainty, 95)), 1e-6)
        for point, radius in zip(points, uncertainty):
            x = int(round(padding + (point[0] - minimum[0]) * scale[0]))
            y = int(round(height - padding - (point[2] - minimum[1]) * scale[1]))
            normalized = min(max(float(radius / upper), 0.0), 1.0)
            color = (int(240 * normalized), int(190 * (1.0 - normalized)), 30)
            cv2.circle(image, (x, y), 4, color, -1, cv2.LINE_AA)
        cv2.putText(
            image,
            "provider x-z plan, blue lower disagreement and red higher disagreement",
            (35, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (20, 20, 20),
            2,
            cv2.LINE_AA,
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(path), image):
        raise ValueError(f"Could not write {path}")


def main() -> None:
    args = parse_args()
    if len(args.training) < args.minimum_training_pairs:
        raise ValueError("Too few training camera-pair artifacts")
    if len(args.holdout) < args.minimum_holdout_pairs:
        raise ValueError("Too few holdout camera-pair artifacts")
    if args.support_distance_metres <= 0 or args.voxel_size_metres <= 0:
        raise ValueError("Distance and voxel size must be positive")
    bounds = np.asarray([
        [args.provider_x_minimum, args.provider_x_maximum],
        [args.provider_y_minimum, args.provider_y_maximum],
        [args.provider_z_minimum, args.provider_z_maximum],
    ], dtype=float)
    if np.any(bounds[:, 1] <= bounds[:, 0]):
        raise ValueError("Every provider bound must have positive span")

    training_loaded = [load_cloud(path, bounds) for path in args.training]
    holdout_loaded = [load_cloud(path, bounds) for path in args.holdout]
    training_camera_ids = camera_ids([item[1] for item in training_loaded])
    holdout_camera_ids = camera_ids([item[1] for item in holdout_loaded])
    if len(training_camera_ids) != len(set(training_camera_ids)):
        raise ValueError("A training panorama is reused across camera pairs")
    if len(holdout_camera_ids) != len(set(holdout_camera_ids)):
        raise ValueError("A holdout panorama is reused across camera pairs")
    overlap = sorted(set(training_camera_ids) & set(holdout_camera_ids))
    if overlap:
        raise ValueError(f"Training and holdout panoramas overlap: {overlap}")
    training_clouds = [item[0] for item in training_loaded]
    holdout_clouds = [item[0] for item in holdout_loaded]
    training_trees = [cKDTree(points) for points in training_clouds]
    holdout_trees = [cKDTree(points) for points in holdout_clouds]

    candidates = np.vstack(training_clouds)
    training_distances = np.column_stack([
        tree.query(candidates, k=1)[0] for tree in training_trees
    ])
    holdout_distances = np.column_stack([
        tree.query(candidates, k=1)[0] for tree in holdout_trees
    ])
    training_support = np.sum(
        training_distances <= args.support_distance_metres, axis=1
    )
    holdout_support = np.sum(
        holdout_distances <= args.support_distance_metres, axis=1
    )
    retained = (
        (training_support >= args.minimum_training_pairs)
        & (holdout_support >= args.minimum_holdout_pairs)
    )
    retained_candidates = candidates[retained]
    if retained_candidates.shape[0] == 0:
        raise ValueError("No point has the required training and holdout support")

    proposals: list[tuple[np.ndarray, float, int, int]] = []
    for candidate, train_row, hold_row in zip(
        retained_candidates,
        training_distances[retained],
        holdout_distances[retained],
    ):
        supporting = []
        for cloud, tree, distance in zip(training_clouds, training_trees, train_row):
            if distance <= args.support_distance_metres:
                supporting.append(cloud[tree.query(candidate, k=1)[1]])
        for cloud, tree, distance in zip(holdout_clouds, holdout_trees, hold_row):
            if distance <= args.support_distance_metres:
                supporting.append(cloud[tree.query(candidate, k=1)[1]])
        support_points = np.asarray(supporting, dtype=float)
        consensus, disagreement = minimum_enclosing_sphere(
            support_points,
            candidate,
        )
        proposals.append((
            consensus,
            disagreement,
            int(np.count_nonzero(train_row <= args.support_distance_metres)),
            int(np.count_nonzero(hold_row <= args.support_distance_metres)),
        ))

    voxel_groups: dict[tuple[int, int, int], list[tuple[np.ndarray, float, int, int]]] = {}
    for proposal in proposals:
        key = tuple(np.floor(proposal[0] / args.voxel_size_metres).astype(int).tolist())
        voxel_groups.setdefault(key, []).append(proposal)
    consensus_points = []
    uncertainties = []
    training_support_counts = []
    holdout_support_counts = []
    for key in sorted(voxel_groups):
        group = voxel_groups[key]
        selected = min(
            group,
            key=lambda item: (
                item[1],
                -item[2],
                -item[3],
                float(item[0][0]),
                float(item[0][1]),
                float(item[0][2]),
            ),
        )
        consensus_points.append(selected[0])
        uncertainties.append(selected[1])
        training_support_counts.append(selected[2])
        holdout_support_counts.append(selected[3])
    consensus_points_array = np.asarray(consensus_points, dtype=float)
    uncertainties_array = np.asarray(uncertainties, dtype=float)
    training_support_array = np.asarray(training_support_counts, dtype=np.int16)
    holdout_support_array = np.asarray(holdout_support_counts, dtype=np.int16)

    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output_npz,
        provider_points_metres=consensus_points_array,
        disagreement_radius_metres=uncertainties_array,
        training_pair_support=training_support_array,
        holdout_pair_support=holdout_support_array,
    )
    render_plan(args.output_png, consensus_points_array, uncertainties_array)
    uncertainty_summary = values_summary(uncertainties_array)
    measurement_eligible = bool(
        consensus_points_array.shape[0] >= args.minimum_consensus_anchors
        and uncertainty_summary["p95"] is not None
        and float(uncertainty_summary["p95"]) <= args.support_distance_metres
    )

    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "cross-validated-provider-local-direct-surface-anchors",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "training": [item[1] for item in training_loaded],
            "holdout": [item[1] for item in holdout_loaded],
        },
        "parameters": {
            "providerBoundsMetres": {
                "x": bounds[0].tolist(),
                "y": bounds[1].tolist(),
                "z": bounds[2].tolist(),
            },
            "supportDistanceMetres": args.support_distance_metres,
            "voxelSizeMetres": args.voxel_size_metres,
            "minimumTrainingPairs": args.minimum_training_pairs,
            "minimumHoldoutPairs": args.minimum_holdout_pairs,
            "minimumConsensusAnchors": args.minimum_consensus_anchors,
            "supportRule": "anchor must be within the support distance in the required number of training and holdout camera-pair point clouds",
            "consensusEstimator": "exact minimum enclosing sphere across the nearest supporting observation from every qualifying camera pair",
            "voxelRepresentativeRule": "smallest valid enclosing-sphere radius, then highest pair support, then provider-coordinate order",
            "cameraIsolationRule": "every source panorama appears in exactly one camera pair and training panoramas are disjoint from holdout panoramas",
        },
        "consensus": {
            "candidateTrainingPointCount": int(candidates.shape[0]),
            "supportedCandidateCount": int(retained_candidates.shape[0]),
            "voxelDeduplicatedAnchorCount": int(consensus_points_array.shape[0]),
            "disagreementRadiusMetres": uncertainty_summary,
            "trainingPairSupport": values_summary(training_support_array.astype(float)),
            "holdoutPairSupport": values_summary(holdout_support_array.astype(float)),
            "anchors": [
                {
                    "providerLocalMetres": [round(float(value), 6) for value in point],
                    "disagreementRadiusMetres": round(float(radius), 6),
                    "trainingPairSupport": int(training_count),
                    "holdoutPairSupport": int(holdout_count),
                }
                for point, radius, training_count, holdout_count in zip(
                    consensus_points_array,
                    uncertainties_array,
                    training_support_array,
                    holdout_support_array,
                )
            ],
        },
        "pointArtifact": {
            "path": str(args.output_npz),
            "sha256": file_sha256(args.output_npz),
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
        },
        "assessment": {
            "providerLocalDirectAnchorMeasurementEligible": measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "ANCHORS_NOT_SEMANTICALLY_SEGMENTED_INTO_OBSTRUCTION_SURFACES",
                "ANCHORS_DO_NOT_FORM_CLOSED_OCCLUDER_VOLUMES",
                "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    stable = dict(artifact)
    stable.pop("artifactVersion")
    artifact["artifactVersion"] = f"sha256:{value_fingerprint(stable)}"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "candidateTrainingPoints": int(candidates.shape[0]),
        "supportedCandidates": int(retained_candidates.shape[0]),
        "consensusAnchors": int(consensus_points_array.shape[0]),
        "disagreementRadiusP95Metres": uncertainty_summary["p95"],
        "measurementEligible": measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
