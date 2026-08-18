#!/usr/bin/env python3
"""Cross-validate lower overhead structure anchors across camera pairs.

Only known-pose feature points below the measured underside plane, within its
observed section span, and visible in at least three independent camera pairs
are retained. The output is a set of measured anchors, not a surface or solid.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "cross-validated-overhead-structure-anchors-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("surface", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("training_features", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--holdout-features", type=Path, action="append", default=[])
    parser.add_argument("--minimum-camera-pairs", type=int, default=3)
    parser.add_argument("--deduplication-radius-metres", type=float, default=0.10)
    parser.add_argument("--minimum-below-plane-metres", type=float, default=0.20)
    parser.add_argument("--maximum-below-plane-metres", type=float, default=1.50)
    parser.add_argument("--front-extension-metres", type=float, default=2.0)
    parser.add_argument("--minimum-consensus-anchors", type=int, default=30)
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


def source_record(path: Path) -> tuple[dict[str, Any], np.ndarray, list[dict[str, Any]]]:
    artifact = json.loads(path.read_text())
    if not artifact["assessment"].get("knownPoseProviderLocalMeasurementEligible"):
        raise ValueError(f"Known-pose feature artifact is not measurement eligible: {path}")
    records = artifact["geometry"]["embeddedPoints"]
    points = np.asarray([record["providerLocalMetres"] for record in records], dtype=float)
    metadata = {
        "path": str(path),
        "sha256": file_sha256(path),
        "artifactVersion": artifact["artifactVersion"],
        "pointCount": int(points.shape[0]),
    }
    return metadata, points, records


def render_diagnostic(path: Path, anchors: np.ndarray, view_counts: np.ndarray) -> None:
    width, height, padding = 1500, 1000, 70
    image = np.full((height, width, 3), 246, dtype=np.uint8)
    if anchors.shape[0] == 0:
        cv2.putText(image, "No consensus anchors", (50, 90), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 0), 3)
        cv2.imwrite(str(path), image)
        return
    plan = anchors[:, [0, 2]]
    minimum = np.min(plan, axis=0)
    maximum = np.max(plan, axis=0)
    scale_x = (width - 2 * padding) / max(maximum[0] - minimum[0], 1e-6)
    scale_y = (height - 2 * padding) / max(maximum[1] - minimum[1], 1e-6)
    for point, views in zip(plan, view_counts):
        x = int(round(padding + (point[0] - minimum[0]) * scale_x))
        y = int(round(height - padding - (point[1] - minimum[1]) * scale_y))
        color = (30, 90, 220) if views == 3 else (30, 160, 80) if views == 4 else (180, 70, 170)
        cv2.circle(image, (x, y), 6, color, -1)
    cv2.putText(image, "provider-local x-z plan, red 3 views, green 4 views, purple 5 views", (35, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (20, 20, 20), 2)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(path), image):
        raise ValueError("Could not write consensus-anchor diagnostic")


def main() -> None:
    args = parse_args()
    if len(args.holdout_features) < args.minimum_camera_pairs - 1:
        raise ValueError("Too few holdout feature artifacts for the requested camera-pair minimum")
    surface = json.loads(args.surface.read_text())
    if not surface["assessment"].get("providerLocalOverhangingDeckUndersideMeasurementEligible"):
        raise ValueError("Overhanging deck underside is not measurement eligible")
    datum = json.loads(args.vertical_datum.read_text())
    if not datum["assessment"]["sectionLocalVerticalDatumMeasurementEligible"]:
        raise ValueError("Vertical datum is not measurement eligible")
    surface_points = np.asarray([
        point["providerLocalMetres"]
        for dataset in [surface["training"], *surface["holdouts"]]
        for point in dataset["points"]
        if point["planeInlier"]
    ], dtype=float)
    plane_y = float(np.median(surface_points[:, 1]))
    semantic_bounds = {
        "providerXMinimumMetres": float(np.min(surface_points[:, 0])),
        "providerXMaximumMetres": float(np.max(surface_points[:, 0])),
        "providerYMinimumMetres": plane_y - args.maximum_below_plane_metres,
        "providerYMaximumMetres": plane_y - args.minimum_below_plane_metres,
        "providerZMinimumMetres": float(np.min(surface_points[:, 2])) - args.front_extension_metres,
        "providerZMaximumMetres": float(np.max(surface_points[:, 2])),
    }
    feature_paths = [args.training_features, *args.holdout_features]
    loaded = [source_record(path) for path in feature_paths]

    def semantic_subset(
        points: np.ndarray,
        records: list[dict[str, Any]],
    ) -> tuple[np.ndarray, list[dict[str, Any]]]:
        selected = (
            (points[:, 0] >= semantic_bounds["providerXMinimumMetres"])
            & (points[:, 0] <= semantic_bounds["providerXMaximumMetres"])
            & (points[:, 1] >= semantic_bounds["providerYMinimumMetres"])
            & (points[:, 1] <= semantic_bounds["providerYMaximumMetres"])
            & (points[:, 2] >= semantic_bounds["providerZMinimumMetres"])
            & (points[:, 2] <= semantic_bounds["providerZMaximumMetres"])
        )
        return points[selected], [record for record, keep in zip(records, selected) if keep]

    subsets = [semantic_subset(points, records) for _, points, records in loaded]
    association_radius = float(datum["combinedAccuracy"]["horizontal95Metres"])
    candidates = []
    training_points, training_records = subsets[0]
    for training_index, training_point in enumerate(training_points):
        group = [(0, training_index, training_point, training_records[training_index])]
        for dataset_index, (holdout_points, holdout_records) in enumerate(subsets[1:], start=1):
            if holdout_points.shape[0] == 0:
                continue
            distances = np.linalg.norm(holdout_points - training_point, axis=1)
            nearest_index = int(np.argmin(distances))
            if distances[nearest_index] <= association_radius:
                group.append((
                    dataset_index,
                    nearest_index,
                    holdout_points[nearest_index],
                    holdout_records[nearest_index],
                ))
        if len(group) < args.minimum_camera_pairs:
            continue
        group_points = np.asarray([item[2] for item in group])
        center = np.mean(group_points, axis=0)
        maximum_spread = float(np.max(np.linalg.norm(group_points - center, axis=1)))
        candidates.append({
            "center": center,
            "viewCount": len(group),
            "maximumSpreadMetres": maximum_spread,
            "members": group,
        })
    candidates.sort(
        key=lambda item: (-item["viewCount"], item["maximumSpreadMetres"])
    )
    retained = []
    for candidate in candidates:
        if any(
            np.linalg.norm(candidate["center"] - existing["center"])
            <= args.deduplication_radius_metres
            for existing in retained
        ):
            continue
        retained.append(candidate)
    centers = np.asarray([item["center"] for item in retained], dtype=float)
    view_counts = np.asarray([item["viewCount"] for item in retained], dtype=int)
    spreads = np.asarray([item["maximumSpreadMetres"] for item in retained], dtype=float)
    render_diagnostic(args.output_png, centers, view_counts)
    affine = np.asarray(
        datum["inputs"]["sectionRegistration"]["sectionFit"]["affineParameters"],
        dtype=float,
    )
    vertical_offset = float(
        datum["verticalDatum"]["fittedTrainingOffsetNavd88MinusProviderYMetres"]
    )
    if centers.shape[0]:
        projected = np.column_stack([
            centers[:, 0],
            centers[:, 2],
            np.ones(centers.shape[0]),
        ]) @ affine
        navd88 = centers[:, 1] + vertical_offset
    else:
        projected = np.empty((0, 2), dtype=float)
        navd88 = np.empty(0, dtype=float)
    spread_p95 = math.inf if spreads.size == 0 else float(np.percentile(spreads, 95))
    horizontal_combined_95 = math.hypot(
        float(datum["combinedAccuracy"]["horizontal95Metres"]),
        spread_p95,
    )
    vertical_combined_95 = math.hypot(
        float(datum["combinedAccuracy"]["vertical95Metres"]),
        spread_p95,
    )
    anchor_measurement_eligible = bool(
        len(retained) >= args.minimum_consensus_anchors
        and spread_p95 <= association_radius
        and horizontal_combined_95 <= 0.3048
        and vertical_combined_95 <= 0.3048
    )
    source_metadata = [item[0] for item in loaded]
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "cross-validated-lower-overhead-structure-anchors",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "surface": {
                "path": str(args.surface),
                "sha256": file_sha256(args.surface),
                "artifactVersion": surface["artifactVersion"],
            },
            "verticalDatum": {
                "path": str(args.vertical_datum),
                "sha256": file_sha256(args.vertical_datum),
                "artifactVersion": datum["artifactVersion"],
            },
            "featureArtifacts": source_metadata,
        },
        "parameters": {
            "minimumCameraPairs": args.minimum_camera_pairs,
            "associationRadiusMetres": round(association_radius, 6),
            "associationRadiusSource": "section-local combined horizontal 95 percent accuracy",
            "deduplicationRadiusMetres": args.deduplication_radius_metres,
            "minimumBelowPlaneMetres": args.minimum_below_plane_metres,
            "maximumBelowPlaneMetres": args.maximum_below_plane_metres,
            "frontExtensionMetres": args.front_extension_metres,
            "minimumConsensusAnchors": args.minimum_consensus_anchors,
            "semanticBoundsProviderLocalMetres": {
                key: round(value, 6) for key, value in semantic_bounds.items()
            },
        },
        "candidateCounts": {
            "semanticPointsByFeatureArtifact": [
                int(points.shape[0]) for points, _ in subsets
            ],
            "preDeduplicationConsensusCount": len(candidates),
            "retainedConsensusAnchorCount": len(retained),
            "retainedByCameraPairCount": {
                str(count): int(np.count_nonzero(view_counts == count))
                for count in sorted(set(view_counts.tolist()))
            },
        },
        "consensus": {
            "maximumMemberSpreadMetres": values_summary(spreads),
            "anchors": [
                {
                    "providerLocalMetres": [round(float(value), 6) for value in item["center"]],
                    "eastEpsg6347Metres": round(float(xy[0]), 6),
                    "northEpsg6347Metres": round(float(xy[1]), 6),
                    "navd88Metres": round(float(elevation), 6),
                    "cameraPairCount": item["viewCount"],
                    "maximumMemberSpreadMetres": round(item["maximumSpreadMetres"], 6),
                    "members": [
                        {
                            "featureArtifactIndex": member[0],
                            "providerLocalMetres": [round(float(value), 6) for value in member[2]],
                            "leftPixel": member[3]["leftPixel"],
                            "rightPixel": member[3]["rightPixel"],
                            "epipolarResidual": member[3]["epipolarResidual"],
                            "closestRaySeparationMetres": member[3]["closestRaySeparationMetres"],
                        }
                        for member in item["members"]
                    ],
                }
                for item, xy, elevation in zip(retained, projected, navd88)
            ],
        },
        "combinedAccuracy": {
            "horizontal95Metres": round(horizontal_combined_95, 6),
            "vertical95Metres": round(vertical_combined_95, 6),
            "withinOneFoot": bool(
                horizontal_combined_95 <= 0.3048
                and vertical_combined_95 <= 0.3048
            ),
        },
        "semanticScope": {
            "established": "repeatable point anchors on lower overhead structures below the measured deck underside",
            "notEstablished": [
                "which structural member each anchor belongs to",
                "beam cross sections",
                "physical perimeter curves",
                "continuous surfaces between anchors",
                "closed obstruction volumes",
            ],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
        },
        "assessment": {
            "georeferencedAnchorMeasurementEligible": anchor_measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "ANCHORS_NOT_SEGMENTED_BY_STRUCTURAL_MEMBER",
                "PHYSICAL_PERIMETER_CURVES_NOT_MEASURED",
                "CLOSED_OBSTRUCTION_VOLUME_NOT_COMPLETE",
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
        "semanticPointCounts": artifact["candidateCounts"]["semanticPointsByFeatureArtifact"],
        "retainedConsensusAnchors": len(retained),
        "cameraPairCounts": artifact["candidateCounts"]["retainedByCameraPairCount"],
        "spreadP95Metres": None if not math.isfinite(spread_p95) else round(spread_p95, 6),
        "horizontalAccuracy95Metres": round(horizontal_combined_95, 6),
        "verticalAccuracy95Metres": round(vertical_combined_95, 6),
        "measurementEligible": anchor_measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
