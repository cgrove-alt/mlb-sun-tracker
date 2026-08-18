#!/usr/bin/env python3
"""Validate the current venue blockmap against mapped section controls."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path

import numpy as np
from scipy.optimize import least_squares

from registerCurrentRowsBySection import (
    ONE_FOOT_METRES,
    control_row_geometry,
    normalized_key,
    percentile,
)


def stable_section_holdout(section_id: str) -> bool:
    digest = hashlib.sha256(section_id.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def sampled_polygon_centroid(raw_points: list[list[float]]) -> np.ndarray:
    points = np.asarray(raw_points, dtype=np.float64)
    if points.shape[0] > 1 and np.allclose(points[0], points[-1]):
        points = points[:-1]
    next_points = np.roll(points, -1, axis=0)
    cross = points[:, 0] * next_points[:, 1] - next_points[:, 0] * points[:, 1]
    signed_double_area = float(cross.sum())
    if abs(signed_double_area) < 1e-9:
        return np.mean(points, axis=0)
    return np.asarray([
        ((points[:, 0] + next_points[:, 0]) * cross).sum() / (3.0 * signed_double_area),
        ((points[:, 1] + next_points[:, 1]) * cross).sum() / (3.0 * signed_double_area),
    ])


def transform(points: np.ndarray, parameters: np.ndarray) -> np.ndarray:
    matrix = parameters[:4].reshape(2, 2)
    translation = parameters[4:]
    return np.asarray(points) @ matrix.T + translation


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("venue_map_rows", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    control = json.loads(arguments.row_control.read_text(encoding="utf-8"))
    venue_map = json.loads(arguments.venue_map_rows.read_text(encoding="utf-8"))
    control_by_section: dict[str, list[np.ndarray]] = defaultdict(list)
    for feature in control["features"]:
        attributes = feature["attributes"]
        geometry = control_row_geometry([feature])
        if geometry is None:
            continue
        section_id = normalized_key(attributes.get("section"), attributes.get("row")).split(":", 1)[0]
        control_by_section[section_id].append(geometry["centroid"])

    section_pairs = []
    for section in venue_map["sections"]:
        section_id = str(section["sectionId"])
        target_rows = control_by_section.get(section_id)
        boundary = section.get("blockmapGeometry", {}).get("sampledBoundary")
        if not target_rows or not boundary:
            continue
        section_pairs.append({
            "sectionId": section_id,
            "source": sampled_polygon_centroid(boundary),
            "target": np.mean(np.asarray(target_rows), axis=0),
            "targetRowCount": len(target_rows),
        })
    training = [pair for pair in section_pairs if not stable_section_holdout(pair["sectionId"])]
    holdout = [pair for pair in section_pairs if stable_section_holdout(pair["sectionId"])]
    source = np.asarray([pair["source"] for pair in training])
    target = np.asarray([pair["target"] for pair in training])
    design = np.column_stack((source, np.ones(len(source))))
    affine, _, rank, _ = np.linalg.lstsq(design, target, rcond=None)
    if rank < 3:
        raise ValueError("Blockmap controls do not support an affine fit")
    initial = np.asarray([
        affine[0, 0], affine[1, 0],
        affine[0, 1], affine[1, 1],
        affine[2, 0], affine[2, 1],
    ])
    fit = least_squares(
        lambda parameters: (transform(source, parameters) - target).ravel(),
        initial,
        loss="soft_l1",
        f_scale=0.5,
        x_scale=np.asarray([0.02, 0.02, 0.02, 0.02, 100.0, 100.0]),
        max_nfev=10_000,
    )
    holdout_source = np.asarray([pair["source"] for pair in holdout])
    holdout_target = np.asarray([pair["target"] for pair in holdout])
    predicted = transform(holdout_source, fit.x)
    residuals = np.linalg.norm(predicted - holdout_target, axis=1)
    results = [{
        "sectionId": pair["sectionId"],
        "targetRowCount": pair["targetRowCount"],
        "residualMetres": float(residual),
        "predictedSectionCentroidMetres": [float(value) for value in point],
        "controlSectionCentroidMetres": [float(value) for value in target_point],
    } for pair, residual, point, target_point in zip(holdout, residuals, predicted, holdout_target)]
    median = percentile(residuals.tolist(), 50)
    p95 = percentile(residuals.tolist(), 95)
    stable_payload = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "venueMapArtifactVersion": venue_map["artifactVersion"],
        "parameters": [float(value) for value in fit.x],
        "holdoutResults": results,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "current-venue-blockmap-registration-validation",
        "artifactVersion": artifact_version,
        "stadiumId": venue_map["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": control["artifactVersion"],
            "venueMapArtifactVersion": venue_map["artifactVersion"],
        },
        "split": "sha256(sectionId) modulo 5",
        "fit": {
            "method": "robust-global-affine-soft-l1",
            "controlSectionCount": len(training),
            "affineParameters": [float(value) for value in fit.x],
            "optimizationSucceeded": bool(fit.success),
            "optimizationCost": float(fit.cost),
        },
        "holdout": {
            "sectionCount": len(holdout),
            "medianResidualMetres": median,
            "p95ResidualMetres": p95,
            "maximumResidualMetres": float(residuals.max()),
            "withinOneFootPercent": float(np.mean(residuals <= ONE_FOOT_METRES) * 100.0),
            "measurementEligible": bool(median <= ONE_FOOT_METRES and p95 <= ONE_FOOT_METRES),
            "sections": results,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "BLOCKMAP_SECTION_FOOTPRINTS_ARE_NOT_ROW_GEOMETRY",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_INCLUDED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED"
            ]
        }
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact_version,
        "fit": artifact["fit"],
        "holdout": {key: value for key, value in artifact["holdout"].items() if key != "sections"},
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
