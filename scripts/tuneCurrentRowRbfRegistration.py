#!/usr/bin/env python3
"""Tune a 3D venue-to-map registration without touching the final holdout."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path

import numpy as np
from scipy.interpolate import RBFInterpolator
from scipy.spatial import Delaunay, cKDTree

from registerCurrentRowsBySection import (
    ONE_FOOT_METRES,
    control_row_geometry,
    normalized_key,
    percentile,
    predicted_ring,
)
from registerCurrentRowsRbf import paired_endpoint_residuals, venue_row_geometry_3d


def partition(row_key: str) -> str:
    final_digest = hashlib.sha256(f"final-v1:{row_key}".encode("utf-8")).digest()
    if int.from_bytes(final_digest[:4], "big") % 5 == 0:
        return "final-holdout"
    validation_digest = hashlib.sha256(f"development-v1:{row_key}".encode("utf-8")).digest()
    if int.from_bytes(validation_digest[:4], "big") % 5 == 0:
        return "development-validation"
    return "development-training"


def build_model(rows: list[dict], neighbors: int, smoothing: float) -> dict:
    source = np.asarray([row["venue"]["centroid"] for row in rows])
    target = np.asarray([row["control"]["centroid"] for row in rows])
    source_origin = np.median(source, axis=0)
    source_scale = float(np.median(np.linalg.norm(source - source_origin, axis=1)))
    target_origin = np.median(target, axis=0)
    target_scale = float(np.median(np.linalg.norm(target - target_origin, axis=1)))
    interpolator = RBFInterpolator(
        (source - source_origin) / source_scale,
        (target - target_origin) / target_scale,
        neighbors=neighbors,
        smoothing=smoothing,
        kernel="thin_plate_spline",
        degree=0,
    )

    def transform(points: np.ndarray) -> np.ndarray:
        normalized = (np.asarray(points) - source_origin) / source_scale
        return interpolator(normalized) * target_scale + target_origin

    return {
        "source": source,
        "transform": transform,
        "sourceOrigin": source_origin,
        "sourceScale": source_scale,
        "targetOrigin": target_origin,
        "targetScale": target_scale,
    }


def evaluate_centroids(rows: list[dict], transform) -> list[float]:
    source = np.asarray([row["venue"]["centroid"] for row in rows])
    target = np.asarray([row["control"]["centroid"] for row in rows])
    return np.linalg.norm(transform(source) - target, axis=1).tolist()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    control = json.loads(arguments.row_control.read_text(encoding="utf-8"))
    venue = json.loads(arguments.venue_rows.read_text(encoding="utf-8"))
    control_by_key: dict[str, list[dict]] = defaultdict(list)
    for feature in control["features"]:
        attributes = feature["attributes"]
        control_by_key[normalized_key(attributes.get("section"), attributes.get("row"))].append(feature)

    current_rows = []
    matched_rows = []
    for row in venue["rows"]:
        row_key = normalized_key(row["sectionId"], row["rowId"])
        current = {
            "rowKey": row_key,
            "sectionId": str(row["sectionId"]),
            "rowId": str(row["rowId"]),
            "publishedSeatCount": row["publishedSeatCount"],
            "venue": venue_row_geometry_3d(row),
        }
        features = control_by_key.get(row_key)
        if features:
            geometry = control_row_geometry(features)
            if geometry is not None:
                current["control"] = geometry
                current["partition"] = partition(row_key)
                matched_rows.append(current)
        current_rows.append(current)

    training = [row for row in matched_rows if row["partition"] == "development-training"]
    validation = [row for row in matched_rows if row["partition"] == "development-validation"]
    final_holdout = [row for row in matched_rows if row["partition"] == "final-holdout"]
    grid = [
        (neighbors, smoothing)
        for neighbors in (8, 12, 20, 30, 40, 60)
        for smoothing in (0.0, 0.0001, 0.001, 0.005, 0.02, 0.1)
    ]
    development_results = []
    for neighbors, smoothing in grid:
        model = build_model(training, neighbors, smoothing)
        residuals = evaluate_centroids(validation, model["transform"])
        development_results.append({
            "neighbors": neighbors,
            "smoothing": smoothing,
            "medianResidualMetres": percentile(residuals, 50),
            "p95ResidualMetres": percentile(residuals, 95),
            "maximumResidualMetres": max(residuals),
            "withinOneFootPercent": float(
                np.mean(np.asarray(residuals) <= ONE_FOOT_METRES) * 100.0
            ),
        })
    selected = min(
        development_results,
        key=lambda result: (result["p95ResidualMetres"], result["medianResidualMetres"]),
    )
    development = [row for row in matched_rows if row["partition"] != "final-holdout"]
    final_model = build_model(development, selected["neighbors"], selected["smoothing"])
    transform = final_model["transform"]
    final_centroid_residuals = evaluate_centroids(final_holdout, transform)
    final_endpoint_residuals = []
    final_results = []
    for row, centroid_residual in zip(final_holdout, final_centroid_residuals):
        predicted_endpoints = transform(row["venue"]["endpoints"])
        endpoint_residuals = paired_endpoint_residuals(
            predicted_endpoints,
            row["control"]["endpoints"],
        )
        final_endpoint_residuals.extend(endpoint_residuals)
        final_results.append({
            "rowKey": row["rowKey"],
            "centroidResidualMetres": centroid_residual,
            "endpointResidualsMetres": endpoint_residuals,
        })

    source_tree = cKDTree(final_model["source"])
    hull = Delaunay(final_model["source"])
    development_widths = np.asarray([row["control"]["widthMetres"] for row in development])
    current_only = []
    for row in current_rows:
        if "control" in row:
            continue
        center = row["venue"]["centroid"]
        endpoints = transform(row["venue"]["endpoints"])
        predicted_center = transform(center[None, :])[0]
        distances, indices = source_tree.query(center, k=min(8, len(development)))
        distances = np.atleast_1d(distances)
        indices = np.atleast_1d(indices)
        width = float(np.median(development_widths[indices]))
        current_only.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "insideDevelopmentControlHull": bool(hull.find_simplex(center[None, :])[0] >= 0),
            "nearestDevelopmentRowDistanceMetres": float(distances[0]),
            "predictedHorizontalGeometry": {
                "coordinateReferenceSystem": "EPSG:6347",
                "centroidMetres": [float(value) for value in predicted_center],
                "rings": [predicted_ring(endpoints, width)],
                "estimatedWidthMetres": width,
            },
            "publicationEligible": False,
            "blockers": ["PREDICTED_ROW_REQUIRES_INDEPENDENT_CURRENT_CONFIRMATION"],
        })

    final_median = percentile(final_centroid_residuals, 50)
    final_p95 = percentile(final_centroid_residuals, 95)
    final_centroid_pass = bool(
        final_median <= ONE_FOOT_METRES and final_p95 <= ONE_FOOT_METRES
    )
    stable_payload = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "venueArtifactVersion": venue["artifactVersion"],
        "partitions": {
            "final": "sha256(final-v1:rowKey) modulo 5",
            "development": "sha256(development-v1:rowKey) modulo 5",
        },
        "developmentResults": development_results,
        "selected": selected,
        "finalResults": final_results,
        "currentOnlyRows": current_only,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "nested-current-row-3d-registration-validation",
        "artifactVersion": artifact_version,
        "stadiumId": venue["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": control["artifactVersion"],
            "venueArtifactVersion": venue["artifactVersion"],
        },
        "partitions": {
            "developmentTrainingRows": len(training),
            "developmentValidationRows": len(validation),
            "finalHoldoutRows": len(final_holdout),
            "finalHoldoutRule": "sha256(final-v1:rowKey) modulo 5 equals zero",
            "developmentValidationRule": "sha256(development-v1:rowKey) modulo 5 equals zero",
        },
        "development": {
            "configurationCount": len(development_results),
            "selectedConfiguration": selected,
            "results": development_results,
        },
        "finalHoldout": {
            "centroid": {
                "sampleCount": len(final_centroid_residuals),
                "medianResidualMetres": final_median,
                "p95ResidualMetres": final_p95,
                "maximumResidualMetres": max(final_centroid_residuals),
                "withinOneFootPercent": float(
                    np.mean(np.asarray(final_centroid_residuals) <= ONE_FOOT_METRES) * 100.0
                ),
                "measurementEligible": final_centroid_pass,
            },
            "endpointsDiagnosticOnly": {
                "semanticNote": "Current camera anchors and control polygon extents do not share a proved endpoint semantic.",
                "sampleCount": len(final_endpoint_residuals),
                "medianResidualMetres": percentile(final_endpoint_residuals, 50),
                "p95ResidualMetres": percentile(final_endpoint_residuals, 95),
                "maximumResidualMetres": max(final_endpoint_residuals),
                "measurementEligible": False,
            },
            "rows": final_results,
        },
        "currentOnly": {
            "rowCount": len(current_only),
            "insideDevelopmentControlHull": sum(
                row["insideDevelopmentControlHull"] for row in current_only
            ),
            "rows": current_only,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "CURRENT_ONLY_ROWS_REQUIRE_INDEPENDENT_CURRENT_CONFIRMATION",
                "ROW_EXTENTS_REQUIRE_CURRENT_METRIC_CONFIRMATION",
                "VERTICAL_SEAT_SURFACE_NOT_COMPLETE",
                "OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED"
            ]
        }
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact_version,
        "partitions": artifact["partitions"],
        "selectedConfiguration": selected,
        "finalHoldout": {key: value for key, value in artifact["finalHoldout"].items() if key != "rows"},
        "currentOnly": {key: value for key, value in artifact["currentOnly"].items() if key != "rows"},
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
