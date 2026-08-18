#!/usr/bin/env python3
"""Test a smooth global registration from current row anchors to mapped rows.

Exact identity matches are split deterministically before fitting. Current-only
rows are predicted for reconstruction review, but remain publication ineligible
until independently confirmed in current imagery.
"""

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
    stable_holdout,
)


def paired_endpoint_residuals(predicted: np.ndarray, target: np.ndarray) -> list[float]:
    forward = np.linalg.norm(predicted - target, axis=1)
    reverse = np.linalg.norm(predicted - target[::-1], axis=1)
    selected = forward if float(forward.sum()) <= float(reverse.sum()) else reverse
    return [float(value) for value in selected]


def venue_row_geometry_3d(row: dict) -> dict:
    anchors = np.asarray([anchor["position"] for anchor in row["anchors"]], dtype=np.float64)
    return {
        "centroid": np.median(anchors, axis=0),
        "endpoints": np.asarray([anchors[0], anchors[-1]]),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--neighbors", type=int, default=40)
    parser.add_argument("--smoothing", type=float, default=0.0025)
    arguments = parser.parse_args()

    control = json.loads(arguments.row_control.read_text(encoding="utf-8"))
    venue = json.loads(arguments.venue_rows.read_text(encoding="utf-8"))
    if control.get("artifactKind") != "independent-georeferenced-row-polygon-control":
        raise ValueError("Invalid row-control artifact")
    if venue.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Invalid venue-row artifact")

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
                matched_rows.append(current)
        current_rows.append(current)

    training_rows = [row for row in matched_rows if not stable_holdout(row["rowKey"])]
    holdout_rows = [row for row in matched_rows if stable_holdout(row["rowKey"])]
    if len(training_rows) <= arguments.neighbors:
        raise ValueError("Not enough control rows for requested RBF neighborhood")
    source = np.asarray([row["venue"]["centroid"] for row in training_rows])
    target = np.asarray([row["control"]["centroid"] for row in training_rows])
    source_origin = np.median(source, axis=0)
    source_scale = float(np.median(np.linalg.norm(source - source_origin, axis=1)))
    target_origin = np.median(target, axis=0)
    target_scale = float(np.median(np.linalg.norm(target - target_origin, axis=1)))
    normalized_source = (source - source_origin) / source_scale
    normalized_target = (target - target_origin) / target_scale
    interpolator = RBFInterpolator(
        normalized_source,
        normalized_target,
        neighbors=arguments.neighbors,
        smoothing=arguments.smoothing,
        kernel="thin_plate_spline",
        degree=1,
    )

    def transform(points: np.ndarray) -> np.ndarray:
        normalized_points = (np.asarray(points) - source_origin) / source_scale
        return interpolator(normalized_points) * target_scale + target_origin

    holdout_results = []
    center_residuals = []
    endpoint_residuals = []
    for row in holdout_rows:
        predicted_center = transform(row["venue"]["centroid"][None, :])[0]
        predicted_endpoints = transform(row["venue"]["endpoints"])
        center_residual = float(np.linalg.norm(predicted_center - row["control"]["centroid"]))
        endpoints = paired_endpoint_residuals(predicted_endpoints, row["control"]["endpoints"])
        center_residuals.append(center_residual)
        endpoint_residuals.extend(endpoints)
        holdout_results.append({
            "rowKey": row["rowKey"],
            "centroidResidualMetres": center_residual,
            "endpointResidualsMetres": endpoints,
            "maximumResidualMetres": max(center_residual, *endpoints),
        })

    all_residuals = [*center_residuals, *endpoint_residuals]
    metric_pass = bool(
        percentile(all_residuals, 50) <= ONE_FOOT_METRES
        and percentile(all_residuals, 95) <= ONE_FOOT_METRES
    )
    source_tree = cKDTree(source)
    hull = Delaunay(source)
    widths = np.asarray([row["control"]["widthMetres"] for row in training_rows])
    output_rows = []
    current_only_diagnostics = []
    for row in current_rows:
        direct_control = row.get("control")
        if direct_control is not None:
            output_rows.append({
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "publishedSeatCount": row["publishedSeatCount"],
                "horizontalGeometry": {
                    "coordinateReferenceSystem": "EPSG:6347",
                    "method": "exact-identity-matched-independent-row-control",
                    "centroidMetres": [float(value) for value in direct_control["centroid"]],
                    "rings": direct_control["rings"],
                },
                "publicationEligible": False,
            })
            continue
        center = row["venue"]["centroid"]
        endpoints = transform(row["venue"]["endpoints"])
        predicted_center = transform(center[None, :])[0]
        nearest_distances, nearest_indices = source_tree.query(center, k=min(8, len(training_rows)))
        nearest_distances = np.atleast_1d(nearest_distances)
        nearest_indices = np.atleast_1d(nearest_indices)
        estimated_width = float(np.median(widths[nearest_indices]))
        inside_hull = bool(hull.find_simplex(center[None, :])[0] >= 0)
        nearest_distance = float(nearest_distances[0])
        diagnostic = {
            "rowKey": row["rowKey"],
            "insideMatchedControlHull": inside_hull,
            "nearestMatchedVenueRowDistanceMetres": nearest_distance,
            "nearestMatchedRowKeys": [training_rows[int(index)]["rowKey"] for index in nearest_indices],
        }
        current_only_diagnostics.append(diagnostic)
        output_rows.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "publishedSeatCount": row["publishedSeatCount"],
            "horizontalGeometry": {
                "coordinateReferenceSystem": "EPSG:6347",
                "method": "global-smooth-current-row-anchor-prediction",
                "centroidMetres": [float(value) for value in predicted_center],
                "rings": [predicted_ring(endpoints, estimated_width)],
                "estimatedWidthMetres": estimated_width,
            },
            "predictionDiagnostics": diagnostic,
            "publicationEligible": False,
            "blockers": ["PREDICTED_ROW_REQUIRES_INDEPENDENT_CURRENT_CONFIRMATION"],
        })

    stable_payload = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "venueArtifactVersion": venue["artifactVersion"],
        "configuration": {
            "neighbors": arguments.neighbors,
            "smoothing": arguments.smoothing,
            "kernel": "thin_plate_spline",
            "degree": 1,
            "sourceDimensions": ["venue-x", "venue-y", "venue-z"],
        },
        "holdoutResults": holdout_results,
        "rows": output_rows,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "global-smooth-current-row-registration-candidate",
        "artifactVersion": artifact_version,
        "stadiumId": venue["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": control["artifactVersion"],
            "venueArtifactVersion": venue["artifactVersion"],
        },
        "configuration": stable_payload["configuration"],
        "split": "sha256(rowKey) modulo 5",
        "counts": {
            "currentVenueRows": len(current_rows),
            "exactIdentityMatchedRows": len(matched_rows),
            "controlRows": len(training_rows),
            "holdoutRows": len(holdout_rows),
            "predictedCurrentOnlyRows": len(current_only_diagnostics),
            "representedRows": len(output_rows),
            "predictedRowsInsideControlHull": sum(
                item["insideMatchedControlHull"] for item in current_only_diagnostics
            ),
        },
        "holdout": {
            "oneFootThresholdMetres": ONE_FOOT_METRES,
            "centroid": {
                "sampleCount": len(center_residuals),
                "medianResidualMetres": percentile(center_residuals, 50),
                "p95ResidualMetres": percentile(center_residuals, 95),
                "maximumResidualMetres": max(center_residuals),
            },
            "endpoints": {
                "sampleCount": len(endpoint_residuals),
                "medianResidualMetres": percentile(endpoint_residuals, 50),
                "p95ResidualMetres": percentile(endpoint_residuals, 95),
                "maximumResidualMetres": max(endpoint_residuals),
            },
            "combined": {
                "sampleCount": len(all_residuals),
                "medianResidualMetres": percentile(all_residuals, 50),
                "p95ResidualMetres": percentile(all_residuals, 95),
                "maximumResidualMetres": max(all_residuals),
                "withinOneFootPercent": float(
                    np.mean(np.asarray(all_residuals) <= ONE_FOOT_METRES) * 100.0
                ),
                "measurementEligible": metric_pass,
            },
            "rows": holdout_results,
        },
        "currentOnlyDiagnostics": current_only_diagnostics,
        "rows": output_rows,
        "publication": {
            "eligible": False,
            "blockers": [
                "STALE_ROW_CONTROL_REQUIRES_CURRENT_ORTHOPHOTO_CONFIRMATION",
                "PREDICTED_CURRENT_ONLY_ROWS_REQUIRE_INDEPENDENT_CONFIRMATION",
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
        "counts": artifact["counts"],
        "holdout": {key: value for key, value in artifact["holdout"].items() if key != "rows"},
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
