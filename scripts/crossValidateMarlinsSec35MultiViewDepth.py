#!/usr/bin/env python3
"""Cross-validate section 35 provider-model depth points across target heights."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from scipy.spatial import cKDTree

from reconstructPanoramaDenseOverhang import values_summary


ANALYSIS_VERSION = "marlins-sec35-cross-target-depth-anchors-v1"
MAXIMUM_MUTUAL_SEPARATION_METRES = 0.3048
MINIMUM_MUTUAL_ANCHOR_COUNT = 200
MINIMUM_SMALLER_CLOUD_MUTUAL_FRACTION = 0.50
COMPONENT_LINK_DISTANCE_METRES = 0.3048
MINIMUM_REPORTED_COMPONENT_POINT_COUNT = 3


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("row10_json", type=Path)
    parser.add_argument("row10_npz", type=Path)
    parser.add_argument("row11_json", type=Path)
    parser.add_argument("row11_npz", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
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


def connected_components(points: np.ndarray) -> list[np.ndarray]:
    parent = np.arange(points.shape[0])

    def root(index: int) -> int:
        while parent[index] != index:
            parent[index] = parent[parent[index]]
            index = int(parent[index])
        return index

    def union(first: int, second: int) -> None:
        first_root = root(first)
        second_root = root(second)
        if first_root != second_root:
            parent[second_root] = first_root

    for first, second in cKDTree(points).query_pairs(
        COMPONENT_LINK_DISTANCE_METRES
    ):
        union(int(first), int(second))
    grouped: dict[int, list[int]] = {}
    for index in range(points.shape[0]):
        grouped.setdefault(root(index), []).append(index)
    return sorted(
        (np.asarray(indices, dtype=int) for indices in grouped.values()),
        key=lambda indices: (-indices.size, int(indices[0])),
    )


def render_diagnostic(
    path: Path,
    points: np.ndarray,
    separations: np.ndarray,
) -> None:
    panels = []
    for first_axis, second_axis, label in (
        (0, 2, "provider x-z plan"),
        (0, 1, "provider x-y elevation"),
        (2, 1, "provider z-y elevation"),
    ):
        width, height, padding = 1500, 900, 50
        panel = np.full((height, width, 3), 245, dtype=np.uint8)
        minimum = np.min(points[:, [first_axis, second_axis]], axis=0)
        maximum = np.max(points[:, [first_axis, second_axis]], axis=0)
        low = float(np.percentile(separations, 5))
        high = max(float(np.percentile(separations, 95)), low + 1e-9)
        for point, separation in zip(points, separations):
            x = int(round(
                padding
                + (point[first_axis] - minimum[0])
                / max(maximum[0] - minimum[0], 1e-9)
                * (width - 2 * padding)
            ))
            y = int(round(
                height - padding
                - (point[second_axis] - minimum[1])
                / max(maximum[1] - minimum[1], 1e-9)
                * (height - 2 * padding)
            ))
            normalized = min(max((separation - low) / (high - low), 0.0), 1.0)
            color = (
                int(round(230 * normalized)),
                int(round(190 * (1.0 - normalized))),
                35,
            )
            cv2.circle(panel, (x, y), 3, color, -1)
        cv2.putText(
            panel,
            f"{label}, green lower and blue higher cross-target separation",
            (30, 42),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.85,
            (20, 20, 20),
            2,
            cv2.LINE_AA,
        )
        panels.append(panel)
    diagnostic = np.vstack(panels)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(path), diagnostic):
        raise ValueError(f"Could not write {path}")


def load_source(json_path: Path, npz_path: Path) -> tuple[dict[str, Any], np.ndarray]:
    artifact = json.loads(json_path.read_text())
    if not artifact["assessment"].get(
        "currentProviderModelMultiViewDepthCandidateEligible"
    ):
        raise ValueError(f"Source is not candidate eligible: {json_path}")
    if artifact["geometry"]["npzSha256"] != file_sha256(npz_path):
        raise ValueError(f"NPZ checksum mismatch: {npz_path}")
    with np.load(npz_path, allow_pickle=False) as arrays:
        points = arrays["provider_points_metres"]
    if points.shape != (artifact["geometry"]["providerPointCount"], 3):
        raise ValueError(f"Point count mismatch: {npz_path}")
    return artifact, points


def main() -> None:
    args = parse_args()
    row10_artifact, row10_points = load_source(args.row10_json, args.row10_npz)
    row11_artifact, row11_points = load_source(args.row11_json, args.row11_npz)
    row10_profile = row10_artifact["cameraPartitions"]["profile"]
    row11_profile = row11_artifact["cameraPartitions"]["profile"]
    if row10_profile == row11_profile:
        raise ValueError("Cross-target sources use the same profile")
    row10_distances, row10_to_row11 = cKDTree(row11_points).query(row10_points)
    _, row11_to_row10 = cKDTree(row10_points).query(row11_points)
    mutual_pairs = [
        (row10_index, int(row11_index))
        for row10_index, row11_index in enumerate(row10_to_row11)
        if (
            row11_to_row10[int(row11_index)] == row10_index
            and row10_distances[row10_index]
            <= MAXIMUM_MUTUAL_SEPARATION_METRES
        )
    ]
    if mutual_pairs:
        row10_indices = np.asarray([pair[0] for pair in mutual_pairs], dtype=int)
        row11_indices = np.asarray([pair[1] for pair in mutual_pairs], dtype=int)
        separations = np.linalg.norm(
            row10_points[row10_indices] - row11_points[row11_indices],
            axis=1,
        )
        anchors = 0.5 * (
            row10_points[row10_indices] + row11_points[row11_indices]
        )
    else:
        row10_indices = np.empty(0, dtype=int)
        row11_indices = np.empty(0, dtype=int)
        separations = np.empty(0)
        anchors = np.empty((0, 3))
    components = connected_components(anchors) if anchors.shape[0] else []
    component_records = []
    component_labels = np.full(anchors.shape[0], -1, dtype=np.int32)
    for component_id, indices in enumerate(components):
        component_labels[indices] = component_id
        if indices.size < MINIMUM_REPORTED_COMPONENT_POINT_COUNT:
            continue
        points = anchors[indices]
        component_records.append({
            "componentId": component_id,
            "pointCount": int(indices.size),
            "providerXMetres": values_summary(points[:, 0]),
            "providerYMetres": values_summary(points[:, 1]),
            "providerZMetres": values_summary(points[:, 2]),
            "crossTargetSeparationMetres": values_summary(separations[indices]),
        })
    row10_mutual_fraction = (
        row10_indices.size / row10_points.shape[0] if row10_points.shape[0] else 0.0
    )
    row11_mutual_fraction = (
        row11_indices.size / row11_points.shape[0] if row11_points.shape[0] else 0.0
    )
    smaller_cloud_fraction = row10_indices.size / min(
        row10_points.shape[0],
        row11_points.shape[0],
    )
    candidate_eligible = bool(
        anchors.shape[0] >= MINIMUM_MUTUAL_ANCHOR_COUNT
        and smaller_cloud_fraction >= MINIMUM_SMALLER_CLOUD_MUTUAL_FRACTION
        and separations.size
        and float(np.percentile(separations, 95))
        <= MAXIMUM_MUTUAL_SEPARATION_METRES
    )
    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output_npz,
        provider_points_metres=anchors,
        cross_target_separation_metres=separations,
        row10_point_indices=row10_indices,
        row11_point_indices=row11_indices,
        connected_component_id=component_labels,
    )
    render_diagnostic(args.output_png, anchors, separations)
    stable = {
        "row10JsonSha256": file_sha256(args.row10_json),
        "row10NpzSha256": file_sha256(args.row10_npz),
        "row11JsonSha256": file_sha256(args.row11_json),
        "row11NpzSha256": file_sha256(args.row11_npz),
        "outputNpzSha256": file_sha256(args.output_npz),
        "outputPngSha256": file_sha256(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "cross-target-current-provider-model-depth-anchors",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        "inputs": {
            "row10": {
                "jsonPath": str(args.row10_json),
                "jsonSha256": stable["row10JsonSha256"],
                "npzPath": str(args.row10_npz),
                "npzSha256": stable["row10NpzSha256"],
                "artifactVersion": row10_artifact["artifactVersion"],
                "profile": row10_profile,
            },
            "row11": {
                "jsonPath": str(args.row11_json),
                "jsonSha256": stable["row11JsonSha256"],
                "npzPath": str(args.row11_npz),
                "npzSha256": stable["row11NpzSha256"],
                "artifactVersion": row11_artifact["artifactVersion"],
                "profile": row11_profile,
            },
        },
        "parameters": {
            "matchingRule": "one-to-one mutual nearest neighbor across target point clouds",
            "maximumMutualSeparationMetres": MAXIMUM_MUTUAL_SEPARATION_METRES,
            "minimumMutualAnchorCount": MINIMUM_MUTUAL_ANCHOR_COUNT,
            "minimumSmallerCloudMutualFraction": MINIMUM_SMALLER_CLOUD_MUTUAL_FRACTION,
            "componentLinkDistanceMetres": COMPONENT_LINK_DISTANCE_METRES,
            "minimumReportedComponentPointCount": MINIMUM_REPORTED_COMPONENT_POINT_COUNT,
        },
        "crossValidation": {
            "row10PointCount": int(row10_points.shape[0]),
            "row11PointCount": int(row11_points.shape[0]),
            "mutualAnchorCount": int(anchors.shape[0]),
            "row10MutualFraction": round(float(row10_mutual_fraction), 6),
            "row11MutualFraction": round(float(row11_mutual_fraction), 6),
            "smallerCloudMutualFraction": round(float(smaller_cloud_fraction), 6),
            "crossTargetSeparationMetres": values_summary(separations),
        },
        "components": {
            "totalComponentCount": len(components),
            "reportedComponentCount": len(component_records),
            "records": component_records,
        },
        "geometry": {
            "coordinateFrame": "current 3DDV provider-local metres",
            "providerPointCount": int(anchors.shape[0]),
            "providerXMetres": values_summary(anchors[:, 0]),
            "providerYMetres": values_summary(anchors[:, 1]),
            "providerZMetres": values_summary(anchors[:, 2]),
            "npzPath": str(args.output_npz),
            "npzSha256": stable["outputNpzSha256"],
        },
        "semanticScope": {
            "established": "one-to-one provider-model points repeated across row 10 and row 11 target reconstructions",
            "notEstablished": [
                "semantic surface labels",
                "surface connectivity beyond proximity components",
                "closed obstruction volumes",
                "physical as-built persistence",
                "any other section, level, or stadium",
            ],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": stable["outputPngSha256"],
        },
        "assessment": {
            "crossTargetProviderModelDepthAnchorCandidateEligible": candidate_eligible,
            "physicalAsBuiltMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "ANCHORS_REQUIRE_SEMANTIC_SURFACE_SEGMENTATION",
                "ANCHORS_DO_NOT_FORM_CLOSED_OCCLUDER_VOLUMES",
                "CURRENT_PROVIDER_RENDER_IS_NOT_PHYSICAL_AS_BUILT_MEASUREMENT",
                "PROVIDER_LOCAL_GEOMETRY_IS_NOT_SUB_FOOT_WORLD_REGISTERED",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "mutualAnchorCount": int(anchors.shape[0]),
        "smallerCloudMutualFraction": round(float(smaller_cloud_fraction), 6),
        "crossTargetSeparationMetres": values_summary(separations),
        "reportedComponentPointCounts": [
            record["pointCount"] for record in component_records
        ],
        "crossTargetProviderModelDepthAnchorCandidateEligible": candidate_eligible,
        "physicalAsBuiltMeasurementEligible": False,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
