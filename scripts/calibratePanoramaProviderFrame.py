#!/usr/bin/env python3
"""Calibrate panorama-ray axes to provider-local metric camera axes.

Two non-collinear stereo baselines define the rotation. Additional stereo
artifacts are evaluated as holdouts and never participate in the fit.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np


ANALYSIS_VERSION = "panorama-provider-frame-calibration-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    parser.add_argument("--training", type=Path, action="append", default=[])
    parser.add_argument("--holdout", type=Path, action="append", default=[])
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


def vector_pair(path: Path) -> tuple[np.ndarray, np.ndarray, dict[str, Any]]:
    artifact = json.loads(path.read_text())
    inputs = artifact["inputs"]
    left = np.asarray(inputs["providerLocalLeftPositionMetres"], dtype=float)
    right = np.asarray(inputs["providerLocalRightPositionMetres"], dtype=float)
    provider = right - left
    panorama = np.asarray(
        artifact["sharedFrameTranslationFit"]["chosenTranslationVectorMetres"],
        dtype=float,
    )
    if np.linalg.norm(provider) <= 0 or np.linalg.norm(panorama) <= 0:
        raise ValueError(f"Zero-length baseline in {path}")
    metadata = {
        "path": str(path),
        "sha256": file_sha256(path),
        "artifactVersion": artifact["artifactVersion"],
        "leftSeatId": inputs["leftSeatId"],
        "rightSeatId": inputs["rightSeatId"],
    }
    return provider, panorama, metadata


def fit_rotation(provider_vectors: np.ndarray, panorama_vectors: np.ndarray) -> np.ndarray:
    if provider_vectors.shape[0] < 2:
        raise ValueError("At least two training baselines are required")
    provider_unit = provider_vectors / np.linalg.norm(provider_vectors, axis=1, keepdims=True)
    panorama_unit = panorama_vectors / np.linalg.norm(panorama_vectors, axis=1, keepdims=True)
    best_pair: tuple[int, int] | None = None
    best_cross_norm = -1.0
    for first in range(provider_unit.shape[0]):
        for second in range(first + 1, provider_unit.shape[0]):
            cross_norm = float(np.linalg.norm(np.cross(provider_unit[first], provider_unit[second])))
            if cross_norm > best_cross_norm:
                best_cross_norm = cross_norm
                best_pair = (first, second)
    if best_pair is None or best_cross_norm < 0.1:
        raise ValueError("Training baselines are not sufficiently non-collinear")
    first, second = best_pair
    provider_cross = np.cross(provider_unit[first], provider_unit[second])
    provider_cross /= np.linalg.norm(provider_cross)
    panorama_cross = np.cross(panorama_unit[first], panorama_unit[second])
    panorama_cross /= np.linalg.norm(panorama_cross)
    augmented_provider = np.vstack([provider_unit, provider_cross])
    augmented_panorama = np.vstack([panorama_unit, panorama_cross])
    covariance = augmented_provider.T @ augmented_panorama
    left_singular, _, right_singular = np.linalg.svd(covariance)
    row_rotation = left_singular @ right_singular
    if np.linalg.det(row_rotation) < 0:
        left_singular[:, -1] *= -1
        row_rotation = left_singular @ right_singular
    return row_rotation.T


def evaluate(
    provider: np.ndarray,
    panorama: np.ndarray,
    rotation: np.ndarray,
) -> dict[str, Any]:
    predicted = rotation @ provider
    vector_error = float(np.linalg.norm(predicted - panorama))
    predicted_unit = predicted / np.linalg.norm(predicted)
    panorama_unit = panorama / np.linalg.norm(panorama)
    cosine = float(np.clip(np.dot(predicted_unit, panorama_unit), -1.0, 1.0))
    angle = math.degrees(math.acos(cosine))
    return {
        "providerBaselineMetres": [round(float(value), 9) for value in provider],
        "observedPanoramaBaselineMetres": [round(float(value), 9) for value in panorama],
        "predictedPanoramaBaselineMetres": [round(float(value), 9) for value in predicted],
        "vectorErrorMetres": round(vector_error, 9),
        "angularErrorDegrees": round(angle, 6),
    }


def metric_summary(values: list[float]) -> dict[str, float | int | None]:
    array = np.asarray(values, dtype=float)
    return {
        "count": int(array.size),
        "median": None if array.size == 0 else round(float(np.median(array)), 9),
        "p95": None if array.size == 0 else round(float(np.percentile(array, 95)), 9),
        "maximum": None if array.size == 0 else round(float(np.max(array)), 9),
    }


def main() -> None:
    args = parse_args()
    if len(args.training) < 2:
        raise ValueError("At least two --training artifacts are required")
    if not args.holdout:
        raise ValueError("At least one --holdout artifact is required")
    training_pairs = [vector_pair(path) for path in args.training]
    holdout_pairs = [vector_pair(path) for path in args.holdout]
    rotation = fit_rotation(
        np.asarray([pair[0] for pair in training_pairs]),
        np.asarray([pair[1] for pair in training_pairs]),
    )
    inverse = rotation.T

    def records(pairs: list[tuple[np.ndarray, np.ndarray, dict[str, Any]]]) -> list[dict[str, Any]]:
        return [
            {**metadata, **evaluate(provider, panorama, rotation)}
            for provider, panorama, metadata in pairs
        ]

    training_records = records(training_pairs)
    holdout_records = records(holdout_pairs)
    holdout_vector_errors = [record["vectorErrorMetres"] for record in holdout_records]
    holdout_angles = [record["angularErrorDegrees"] for record in holdout_records]
    holdout_vector_summary = metric_summary(holdout_vector_errors)
    holdout_angle_summary = metric_summary(holdout_angles)
    measurement_eligible = bool(
        holdout_vector_summary["p95"] is not None
        and holdout_vector_summary["p95"] <= 0.03
        and holdout_angle_summary["p95"] is not None
        and holdout_angle_summary["p95"] <= 1.0
    )
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "provider-local-axis-calibration",
        "artifactVersion": "sha256:pending",
        "rotation": {
            "providerVectorToPanoramaVector": [
                [round(float(value), 12) for value in row] for row in rotation
            ],
            "panoramaVectorToProviderVector": [
                [round(float(value), 12) for value in row] for row in inverse
            ],
            "determinant": round(float(np.linalg.det(rotation)), 12),
            "orthogonalityMaximumAbsoluteError": round(
                float(np.max(np.abs(rotation.T @ rotation - np.eye(3)))), 12
            ),
        },
        "training": training_records,
        "holdout": holdout_records,
        "holdoutSummary": {
            "vectorErrorMetres": holdout_vector_summary,
            "angularErrorDegrees": holdout_angle_summary,
        },
        "assessment": {
            "measurementEligible": measurement_eligible,
            "providerLocalMetricOnly": True,
            "publicationEligible": False,
            "blockers": [
                "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
                "CAMERA_MODEL_NOT_INDEPENDENTLY_SURVEYED",
                "SEMANTIC_ROOF_SURFACE_NOT_YET_VALIDATED",
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
        "holdoutVectorErrorP95Metres": holdout_vector_summary["p95"],
        "holdoutAngularErrorP95Degrees": holdout_angle_summary["p95"],
        "measurementEligible": measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
