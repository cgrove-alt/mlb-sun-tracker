#!/usr/bin/env python3
"""Compare 2021 to 2024 transform families without accepting any model."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any, Callable

import numpy as np

from auditNoaa2021HardStructureRegistration import (
    FEET_PER_METRE,
    artifact_version,
    fit_rigid,
    rotation_degrees,
    summary,
    transform_points,
)


ANALYSIS_VERSION = "marlins-2021-to-2024-transform-family-diagnostic-v1"


def locked_json(path: Path) -> tuple[dict[str, Any], str]:
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def fit_similarity(
    source: np.ndarray,
    target: np.ndarray,
) -> tuple[float, np.ndarray, np.ndarray]:
    source_mean = source.mean(axis=0)
    target_mean = target.mean(axis=0)
    source_centered = source - source_mean
    target_centered = target - target_mean
    covariance = source_centered.T @ target_centered
    u, singular_values, vt = np.linalg.svd(covariance)
    rotation = vt.T @ u.T
    if np.linalg.det(rotation) < 0:
        vt[-1, :] *= -1
        rotation = vt.T @ u.T
        singular_values[-1] *= -1
    scale = float(
        np.sum(singular_values) / np.sum(source_centered * source_centered)
    )
    translation = target_mean - scale * (rotation @ source_mean)
    return scale, rotation, translation


def transform_similarity(
    points: np.ndarray,
    scale: float,
    rotation: np.ndarray,
    translation: np.ndarray,
) -> np.ndarray:
    return scale * (points @ rotation.T) + translation


def fit_affine(
    source: np.ndarray,
    target: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    source_mean = source.mean(axis=0)
    target_mean = target.mean(axis=0)
    coefficients, _, _, _ = np.linalg.lstsq(
        source - source_mean,
        target - target_mean,
        rcond=None,
    )
    return coefficients, source_mean, target_mean, coefficients.T


def transform_affine(
    points: np.ndarray,
    coefficients: np.ndarray,
    source_mean: np.ndarray,
    target_mean: np.ndarray,
) -> np.ndarray:
    return (points - source_mean) @ coefficients + target_mean


def residuals(
    source: np.ndarray,
    target: np.ndarray,
    predictor: Callable[[np.ndarray], np.ndarray],
) -> np.ndarray:
    return np.linalg.norm(predictor(source) - target, axis=1)


def model_summary(
    training_source: np.ndarray,
    training_target: np.ndarray,
    holdout_source: np.ndarray,
    holdout_target: np.ndarray,
    model: str,
) -> dict[str, Any]:
    if model == "rigid":
        rotation, translation = fit_rigid(training_source, training_target)
        predictor = lambda points: transform_points(points, rotation, translation)
        parameters = {
            "parameterCount": 3,
            "rotationDegrees": rotation_degrees(rotation),
            "translationMetres": translation.tolist(),
            "scale": 1.0,
        }
    elif model == "similarity":
        scale, rotation, translation = fit_similarity(
            training_source,
            training_target,
        )
        predictor = lambda points: transform_similarity(
            points,
            scale,
            rotation,
            translation,
        )
        parameters = {
            "parameterCount": 4,
            "rotationDegrees": rotation_degrees(rotation),
            "translationMetres": translation.tolist(),
            "scale": scale,
            "scaleDeviationPartsPerMillion": (scale - 1.0) * 1_000_000.0,
        }
    elif model == "affine":
        coefficients, source_mean, target_mean, linear_matrix = fit_affine(
            training_source,
            training_target,
        )
        predictor = lambda points: transform_affine(
            points,
            coefficients,
            source_mean,
            target_mean,
        )
        u, singular_values, vt = np.linalg.svd(linear_matrix)
        polar_rotation = u @ vt
        parameters = {
            "parameterCount": 6,
            "linearMatrix": linear_matrix.tolist(),
            "sourceCentroidMetres": source_mean.tolist(),
            "targetCentroidMetres": target_mean.tolist(),
            "principalScales": singular_values.tolist(),
            "maximumPrincipalScaleDeviationPartsPerMillion": float(
                np.max(np.abs(singular_values - 1.0)) * 1_000_000.0
            ),
            "conditionNumber": float(singular_values[0] / singular_values[-1]),
            "polarRotationDegrees": rotation_degrees(polar_rotation),
        }
    else:
        raise ValueError(f"Unknown model: {model}")

    training_residuals = residuals(
        training_source,
        training_target,
        predictor,
    )
    holdout_predictions = predictor(holdout_source)
    holdout_vectors = holdout_predictions - holdout_target
    holdout_residuals = np.linalg.norm(holdout_vectors, axis=1)
    return {
        "model": model,
        "parameters": parameters,
        "trainingResidualMetres": summary(training_residuals),
        "trainingResidualFeet": summary(training_residuals * FEET_PER_METRE),
        "exploratoryHoldoutResidualMetres": summary(holdout_residuals),
        "exploratoryHoldoutResidualFeet": summary(
            holdout_residuals * FEET_PER_METRE
        ),
        "exploratoryHoldoutResidualVectorsMetres": holdout_vectors.tolist(),
    }


def build_diagnostic(
    first_consensus_path: Path,
    supplemental_consensus_path: Path,
    scored_holdout_audit_path: Path,
) -> dict[str, Any]:
    first, first_sha256 = locked_json(first_consensus_path)
    supplemental, supplemental_sha256 = locked_json(supplemental_consensus_path)
    scored, scored_sha256 = locked_json(scored_holdout_audit_path)
    if not scored["controlDesign"]["holdoutResidualsInspectedBeforeSelection"] is False:
        raise ValueError("Scored holdout selection was not independent")
    training = first["controls"] + supplemental["controls"]
    holdouts = scored["holdoutValidation"]["records"]
    training_source = np.asarray([
        record["comparisonUtmMetres"] for record in training
    ])
    training_target = np.asarray([
        record["referenceUtmMetres"] for record in training
    ])
    holdout_source = np.asarray([
        record["comparisonUtmMetres"] for record in holdouts
    ])
    holdout_target = np.asarray([
        record["referenceUtmMetres"] for record in holdouts
    ])
    models = [
        model_summary(
            training_source,
            training_target,
            holdout_source,
            holdout_target,
            model,
        )
        for model in ("rigid", "similarity", "affine")
    ]
    stable = {
        "firstConsensusSha256": first_sha256,
        "supplementalConsensusSha256": supplemental_sha256,
        "scoredHoldoutAuditSha256": scored_sha256,
        "models": models,
    }
    return {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactKind": "marlins-2021-to-2024-transform-family-diagnostic",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "firstTrainingConsensus": {
                "path": str(first_consensus_path),
                "sha256": first_sha256,
                "artifactVersion": first["artifactVersion"],
            },
            "supplementalTrainingConsensus": {
                "path": str(supplemental_consensus_path),
                "sha256": supplemental_sha256,
                "artifactVersion": supplemental["artifactVersion"],
            },
            "scoredExploratoryHoldoutAudit": {
                "path": str(scored_holdout_audit_path),
                "sha256": scored_sha256,
                "artifactVersion": scored["artifactVersion"],
            },
        },
        "controlDesign": {
            "trainingControlCount": len(training),
            "exploratoryHoldoutControlCount": len(holdouts),
            "fitUsesExploratoryHoldouts": False,
            "exploratoryHoldoutsNowConsumedForModelSelection": True,
            "newIndependentHoldoutsRequiredForAnyChosenModel": True,
        },
        "models": models,
        "assessment": {
            "registrationMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "TRANSFORM_FAMILY_NOT_YET_CHOSEN",
                "NEW_INDEPENDENT_HOLDOUTS_REQUIRED_AFTER_MODEL_SELECTION",
                "ROW_GEOMETRY_NOT_MEASURED",
                "ROOF_UNDERSIDE_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("first_consensus", type=Path)
    parser.add_argument("supplemental_consensus", type=Path)
    parser.add_argument("scored_holdout_audit", type=Path)
    parser.add_argument("output", type=Path)
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()
    artifact = build_diagnostic(
        arguments.first_consensus,
        arguments.supplemental_consensus,
        arguments.scored_holdout_audit,
    )
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "controlDesign": artifact["controlDesign"],
        "models": artifact["models"],
    }, indent=2))


if __name__ == "__main__":
    main()
