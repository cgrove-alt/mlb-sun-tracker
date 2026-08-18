#!/usr/bin/env python3
"""Validate a robust global similarity transform on identity-matched rows."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path

import numpy as np
from scipy.optimize import least_squares

from registerCurrentRowsBySection import (
    ONE_FOOT_METRES,
    control_row_geometry,
    normalized_key,
    percentile,
    stable_holdout,
    venue_row_geometry,
)


def transform(points: np.ndarray, parameters: np.ndarray) -> np.ndarray:
    log_scale, theta, east, north = parameters
    scale = math.exp(float(log_scale))
    cosine = math.cos(float(theta))
    sine = math.sin(float(theta))
    rotation = np.asarray([[cosine, -sine], [sine, cosine]])
    reflected = np.asarray(points) * np.asarray([1.0, -1.0])
    return reflected @ rotation.T * scale + np.asarray([east, north])


def initial_fit(source: np.ndarray, target: np.ndarray) -> np.ndarray:
    source_center = np.mean(source, axis=0)
    target_center = np.mean(target, axis=0)
    centered_source = source - source_center
    centered_target = target - target_center
    covariance = centered_source.T @ centered_target
    left, _, right = np.linalg.svd(covariance)
    rotation = right.T @ left.T
    if np.linalg.det(rotation) < 0:
        right[-1] *= -1
        rotation = right.T @ left.T
    scale = float(
        np.sum((centered_source @ rotation.T) * centered_target)
        / np.sum(centered_source ** 2)
    )
    theta = math.atan2(rotation[1, 0], rotation[0, 0])
    translation = target_center - source_center @ rotation.T * scale
    return np.asarray([math.log(abs(scale)), theta, translation[0], translation[1]])


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

    rows = []
    for row in venue["rows"]:
        row_key = normalized_key(row["sectionId"], row["rowId"])
        features = control_by_key.get(row_key)
        if not features:
            continue
        control_geometry = control_row_geometry(features)
        if control_geometry is None:
            continue
        rows.append({
            "rowKey": row_key,
            "source": venue_row_geometry(row)["centroid"],
            "target": control_geometry["centroid"],
        })
    training = [row for row in rows if not stable_holdout(row["rowKey"])]
    holdout = [row for row in rows if stable_holdout(row["rowKey"])]
    source = np.asarray([row["source"] for row in training])
    target = np.asarray([row["target"] for row in training])
    initial = initial_fit(source * np.asarray([1.0, -1.0]), target)
    lower_bounds = np.asarray([
        math.log(0.5),
        -2.0 * math.pi,
        initial[2] - 1_000.0,
        initial[3] - 1_000.0,
    ])
    upper_bounds = np.asarray([
        math.log(2.0),
        2.0 * math.pi,
        initial[2] + 1_000.0,
        initial[3] + 1_000.0,
    ])
    fit = least_squares(
        lambda parameters: (transform(source, parameters) - target).ravel(),
        initial,
        loss="soft_l1",
        f_scale=0.5,
        bounds=(lower_bounds, upper_bounds),
        x_scale=np.asarray([0.05, 0.1, 100.0, 100.0]),
        max_nfev=10_000,
        xtol=1e-13,
        ftol=1e-13,
        gtol=1e-13,
    )
    parameters = fit.x
    predicted = transform(np.asarray([row["source"] for row in holdout]), parameters)
    targets = np.asarray([row["target"] for row in holdout])
    residuals = np.linalg.norm(predicted - targets, axis=1)
    results = [{
        "rowKey": row["rowKey"],
        "residualMetres": float(residual),
        "predictedCentroidMetres": [float(value) for value in point],
        "controlCentroidMetres": [float(value) for value in target_point],
    } for row, residual, point, target_point in zip(holdout, residuals, predicted, targets)]
    median = percentile(residuals.tolist(), 50)
    p95 = percentile(residuals.tolist(), 95)
    stable_payload = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "venueArtifactVersion": venue["artifactVersion"],
        "parameters": [float(value) for value in parameters],
        "holdoutResults": results,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "current-row-global-similarity-validation",
        "artifactVersion": artifact_version,
        "stadiumId": venue["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": control["artifactVersion"],
            "venueArtifactVersion": venue["artifactVersion"],
        },
        "split": "sha256(rowKey) modulo 5",
        "fit": {
            "method": "robust-global-similarity-soft-l1",
            "controlRowCount": len(training),
            "scale": math.exp(float(parameters[0])),
            "sourceAxisSigns": [1, -1],
            "rotationDegrees": math.degrees(float(parameters[1])),
            "eastTranslationMetres": float(parameters[2]),
            "northTranslationMetres": float(parameters[3]),
            "optimizationCost": float(fit.cost),
            "optimizationSucceeded": bool(fit.success),
        },
        "holdout": {
            "rowCount": len(holdout),
            "medianResidualMetres": median,
            "p95ResidualMetres": p95,
            "maximumResidualMetres": float(residuals.max()),
            "withinOneFootPercent": float(np.mean(residuals <= ONE_FOOT_METRES) * 100.0),
            "measurementEligible": bool(median <= ONE_FOOT_METRES and p95 <= ONE_FOOT_METRES),
            "rows": results,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "GLOBAL_SIMILARITY_IS_DIAGNOSTIC_ONLY",
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
        "holdout": {key: value for key, value in artifact["holdout"].items() if key != "rows"},
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
