#!/usr/bin/env python3
"""Register current venue-local rows to mapped row polygons by section.

The script uses exact section and row identities for a deterministic control and
holdout experiment. It never marks the result as publication eligible. A small
registration residual only measures consistency between the current venue-local
seat product and the independent mapped row control.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path

import numpy as np


ONE_FOOT_METRES = 0.3048


def normalized_key(section: object, row: object) -> str:
    return f"{str(section).strip()}:{str(row).strip().upper()}"


def stable_holdout(row_key: str) -> bool:
    digest = hashlib.sha256(row_key.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def percentile(values: list[float], amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values else None


def polygon_area_centroid(raw_ring: list[list[float]]) -> tuple[float, np.ndarray]:
    ring = np.asarray(raw_ring, dtype=np.float64)
    if ring.shape[0] > 1 and np.allclose(ring[0], ring[-1]):
        ring = ring[:-1]
    if ring.shape[0] < 3:
        return 0.0, np.asarray([math.nan, math.nan])
    origin = ring[0]
    shifted = ring - origin
    x_values = shifted[:, 0]
    y_values = shifted[:, 1]
    next_x = np.roll(x_values, -1)
    next_y = np.roll(y_values, -1)
    cross = x_values * next_y - next_x * y_values
    signed_double_area = float(cross.sum())
    if abs(signed_double_area) < 1e-12:
        return 0.0, np.mean(ring, axis=0)
    area = abs(signed_double_area) / 2.0
    centroid = origin + np.asarray([
        ((x_values + next_x) * cross).sum() / (3.0 * signed_double_area),
        ((y_values + next_y) * cross).sum() / (3.0 * signed_double_area),
    ])
    return area, centroid


def control_row_geometry(features: list[dict]) -> dict | None:
    rings: list[list[list[float]]] = []
    weighted_centroids: list[np.ndarray] = []
    total_area = 0.0
    all_vertices: list[np.ndarray] = []
    for feature in features:
        for raw_ring in feature.get("geometry", {}).get("rings", []):
            area, centroid = polygon_area_centroid(raw_ring)
            if area <= 0 or not np.isfinite(centroid).all():
                continue
            ring = np.asarray(raw_ring, dtype=np.float64)
            if ring.shape[0] > 1 and np.allclose(ring[0], ring[-1]):
                ring = ring[:-1]
            rings.append(raw_ring)
            weighted_centroids.append(area * centroid)
            total_area += area
            all_vertices.append(ring)
    if not rings or total_area <= 0:
        return None
    centroid = np.sum(weighted_centroids, axis=0) / total_area
    vertices = np.concatenate(all_vertices)
    centered = vertices - centroid
    covariance = centered.T @ centered
    eigenvalues, eigenvectors = np.linalg.eigh(covariance)
    major = eigenvectors[:, int(np.argmax(eigenvalues))]
    projections = centered @ major
    minimum = float(projections.min())
    maximum = float(projections.max())
    endpoint_a = centroid + minimum * major
    endpoint_b = centroid + maximum * major
    if tuple(endpoint_b) < tuple(endpoint_a):
        endpoint_a, endpoint_b = endpoint_b, endpoint_a
    perpendicular = np.asarray([-major[1], major[0]])
    width = float((centered @ perpendicular).max() - (centered @ perpendicular).min())
    return {
        "centroid": centroid,
        "endpoints": np.asarray([endpoint_a, endpoint_b]),
        "widthMetres": width,
        "rings": rings,
    }


def venue_row_geometry(row: dict) -> dict:
    anchors = np.asarray(
        [[anchor["position"][0], anchor["position"][2]] for anchor in row["anchors"]],
        dtype=np.float64,
    )
    return {
        "centroid": np.median(anchors, axis=0),
        "endpoints": np.asarray([anchors[0], anchors[-1]]),
    }


def affine_design(points: np.ndarray) -> np.ndarray:
    return np.column_stack((points, np.ones(points.shape[0], dtype=np.float64)))


def fit_affine(source: np.ndarray, target: np.ndarray) -> np.ndarray:
    parameters, _, rank, _ = np.linalg.lstsq(affine_design(source), target, rcond=None)
    if rank < 3:
        raise ValueError("Section control geometry does not support a full affine fit")
    return parameters


def apply_affine(points: np.ndarray, parameters: np.ndarray) -> np.ndarray:
    return affine_design(points) @ parameters


def section_fit(rows: list[dict]) -> dict | None:
    control_rows = [row for row in rows if not stable_holdout(row["rowKey"])]
    holdout_rows = [row for row in rows if stable_holdout(row["rowKey"])]
    if len(control_rows) < 3 or len(holdout_rows) < 1:
        return None
    best: dict | None = None
    for reverse in (False, True):
        source_points: list[np.ndarray] = []
        target_points: list[np.ndarray] = []
        for row in control_rows:
            source_points.extend(row["venue"]["endpoints"])
            source_points.append(row["venue"]["centroid"])
            endpoints = row["control"]["endpoints"][::-1] if reverse else row["control"]["endpoints"]
            target_points.extend(endpoints)
            target_points.append(row["control"]["centroid"])
        source = np.asarray(source_points)
        target = np.asarray(target_points)
        try:
            parameters = fit_affine(source, target)
        except ValueError:
            continue
        predicted = apply_affine(source, parameters)
        rmse = float(np.sqrt(np.mean(np.sum((predicted - target) ** 2, axis=1))))
        if best is None or rmse < best["controlRmseMetres"]:
            best = {
                "reverseTargetEndpoints": reverse,
                "parameters": parameters,
                "controlRmseMetres": rmse,
            }
    if best is None:
        return None
    parameters = best["parameters"]
    reverse = best["reverseTargetEndpoints"]
    row_results = []
    for row in rows:
        predicted_endpoints = apply_affine(row["venue"]["endpoints"], parameters)
        predicted_centroid = apply_affine(row["venue"]["centroid"][None, :], parameters)[0]
        target_endpoints = row["control"]["endpoints"][::-1] if reverse else row["control"]["endpoints"]
        endpoint_residuals = np.linalg.norm(predicted_endpoints - target_endpoints, axis=1)
        centroid_residual = float(np.linalg.norm(predicted_centroid - row["control"]["centroid"]))
        row_results.append({
            "rowKey": row["rowKey"],
            "partition": "holdout" if stable_holdout(row["rowKey"]) else "control",
            "centroidResidualMetres": centroid_residual,
            "endpointResidualsMetres": [float(value) for value in endpoint_residuals],
            "maximumResidualMetres": float(max(centroid_residual, endpoint_residuals.max())),
        })
    holdout_residuals = [
        residual
        for result in row_results
        if result["partition"] == "holdout"
        for residual in [result["centroidResidualMetres"], *result["endpointResidualsMetres"]]
    ]
    control_residuals = [
        residual
        for result in row_results
        if result["partition"] == "control"
        for residual in [result["centroidResidualMetres"], *result["endpointResidualsMetres"]]
    ]
    holdout_p95 = percentile(holdout_residuals, 95)
    measurement_eligible = bool(
        holdout_p95 is not None
        and percentile(holdout_residuals, 50) <= ONE_FOOT_METRES
        and holdout_p95 <= ONE_FOOT_METRES
    )
    return {
        "method": "section-local-affine-from-current-row-anchors",
        "split": "sha256(rowKey) modulo 5",
        "controlRowCount": len(control_rows),
        "holdoutRowCount": len(holdout_rows),
        "reverseTargetEndpoints": reverse,
        "affineParameters": [[float(value) for value in column] for column in parameters],
        "control": {
            "medianResidualMetres": percentile(control_residuals, 50),
            "p95ResidualMetres": percentile(control_residuals, 95),
            "maximumResidualMetres": max(control_residuals),
        },
        "holdout": {
            "medianResidualMetres": percentile(holdout_residuals, 50),
            "p95ResidualMetres": holdout_p95,
            "maximumResidualMetres": max(holdout_residuals),
            "withinOneFootPercent": float(
                np.mean(np.asarray(holdout_residuals) <= ONE_FOOT_METRES) * 100.0
            ),
        },
        "measurementEligible": measurement_eligible,
        "rowResiduals": row_results,
    }


def predicted_ring(endpoints: np.ndarray, width_metres: float) -> list[list[float]]:
    direction = endpoints[1] - endpoints[0]
    length = float(np.linalg.norm(direction))
    if length <= 0:
        raise ValueError("Predicted row endpoints are coincident")
    normal = np.asarray([-direction[1], direction[0]]) / length
    offset = normal * max(width_metres, 0.25) / 2.0
    ring = np.asarray([
        endpoints[0] - offset,
        endpoints[1] - offset,
        endpoints[1] + offset,
        endpoints[0] + offset,
        endpoints[0] - offset,
    ])
    return [[float(value) for value in point] for point in ring]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("venue_rows", type=Path)
    parser.add_argument("output", type=Path)
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

    matched_by_section: dict[str, list[dict]] = defaultdict(list)
    current_rows: list[dict] = []
    for row in venue["rows"]:
        row_key = normalized_key(row["sectionId"], row["rowId"])
        current = {
            "rowKey": row_key,
            "sectionId": str(row["sectionId"]),
            "rowId": str(row["rowId"]),
            "publishedSeatCount": row["publishedSeatCount"],
            "venue": venue_row_geometry(row),
        }
        features = control_by_key.get(row_key)
        if features:
            geometry = control_row_geometry(features)
            if geometry is not None:
                current["control"] = geometry
                matched_by_section[current["sectionId"]].append(current)
        current_rows.append(current)

    fits = {
        section_id: fit
        for section_id, rows in matched_by_section.items()
        if (fit := section_fit(rows)) is not None
    }
    section_widths = {
        section_id: float(np.median([row["control"]["widthMetres"] for row in rows]))
        for section_id, rows in matched_by_section.items()
    }

    output_rows = []
    unresolved_rows = []
    for row in current_rows:
        fit = fits.get(row["sectionId"])
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
                "sectionRegistrationMeasurementEligible": bool(fit and fit["measurementEligible"]),
                "publicationEligible": False,
            })
            continue
        if fit is None:
            unresolved_rows.append({
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "blockers": ["NO_SECTION_LOCAL_REGISTRATION_FIT"],
            })
            continue
        parameters = np.asarray(fit["affineParameters"], dtype=np.float64)
        endpoints = apply_affine(row["venue"]["endpoints"], parameters)
        centroid = apply_affine(row["venue"]["centroid"][None, :], parameters)[0]
        width = section_widths[row["sectionId"]]
        output_rows.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "publishedSeatCount": row["publishedSeatCount"],
            "horizontalGeometry": {
                "coordinateReferenceSystem": "EPSG:6347",
                "method": "section-local-affine-current-row-anchor-prediction",
                "centroidMetres": [float(value) for value in centroid],
                "rings": [predicted_ring(endpoints, width)],
                "estimatedWidthMetres": width,
            },
            "sectionRegistrationMeasurementEligible": fit["measurementEligible"],
            "publicationEligible": False,
            "blockers": ["PREDICTED_ROW_REQUIRES_INDEPENDENT_CURRENT_CONFIRMATION"],
        })

    holdout_residuals = [
        residual
        for fit in fits.values()
        for result in fit["rowResiduals"]
        if result["partition"] == "holdout"
        for residual in [result["centroidResidualMetres"], *result["endpointResidualsMetres"]]
    ]
    stable_payload = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "venueArtifactVersion": venue["artifactVersion"],
        "fits": fits,
        "rows": output_rows,
        "unresolvedRows": unresolved_rows,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    ).hexdigest()
    predicted_count = sum(
        row["horizontalGeometry"]["method"] == "section-local-affine-current-row-anchor-prediction"
        for row in output_rows
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "section-local-current-row-registration-candidate",
        "artifactVersion": artifact_version,
        "stadiumId": venue["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": control["artifactVersion"],
            "venueArtifactVersion": venue["artifactVersion"],
        },
        "counts": {
            "currentVenueRows": len(venue["rows"]),
            "exactIdentityMatchedRows": sum("control" in row for row in current_rows),
            "predictedCurrentOnlyRows": predicted_count,
            "representedRows": len(output_rows),
            "unresolvedRows": len(unresolved_rows),
            "sectionsWithFits": len(fits),
            "measurementEligibleSectionFits": sum(fit["measurementEligible"] for fit in fits.values()),
        },
        "holdout": {
            "oneFootThresholdMetres": ONE_FOOT_METRES,
            "sampleCount": len(holdout_residuals),
            "medianResidualMetres": percentile(holdout_residuals, 50),
            "p95ResidualMetres": percentile(holdout_residuals, 95),
            "maximumResidualMetres": max(holdout_residuals) if holdout_residuals else None,
            "withinOneFootPercent": (
                float(np.mean(np.asarray(holdout_residuals) <= ONE_FOOT_METRES) * 100.0)
                if holdout_residuals else None
            ),
        },
        "sectionFits": fits,
        "rows": output_rows,
        "unresolvedRows": unresolved_rows,
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
        "holdout": artifact["holdout"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
