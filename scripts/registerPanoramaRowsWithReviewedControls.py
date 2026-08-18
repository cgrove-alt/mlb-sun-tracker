#!/usr/bin/env python3
"""Register provider row projections with reviewed fixed-scene controls.

Training controls solve one local projective transform. Held-out controls are
never used by the fit and determine whether the registration is precise enough
for a human row-boundary review. The output never labels shade automatically.
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


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def hull_fraction(points: np.ndarray, width: int, height: int) -> float:
    if len(points) < 3:
        return 0.0
    hull = cv2.convexHull(points.reshape(-1, 1, 2).astype(np.float32))
    return float(cv2.contourArea(hull)) / float(width * height)


def residual_summary(values: np.ndarray) -> dict[str, float | int | None]:
    if values.size == 0:
        return {"count": 0, "median": None, "p95": None, "maximum": None}
    return {
        "count": int(values.size),
        "median": float(np.median(values)),
        "p95": float(np.percentile(values, 95)),
        "maximum": float(np.max(values)),
    }


def row_ordinal(row_id: str) -> tuple[int, int | str]:
    letter_order = {letter: index for index, letter in enumerate("ABCDEFG", start=1)}
    if row_id in letter_order:
        return (0, letter_order[row_id])
    if row_id.isdigit():
        return (1, int(row_id))
    if row_id.endswith("wc") and row_id[:-2].isdigit():
        return (1, int(row_id[:-2]))
    return (2, row_id)


def quadratic_design(points: np.ndarray, center: np.ndarray, scale: np.ndarray) -> np.ndarray:
    normalized = (points - center) / scale
    x_values = normalized[:, 0]
    y_values = normalized[:, 1]
    return np.column_stack(
        [
            np.ones(len(points)),
            x_values,
            y_values,
            x_values * y_values,
            x_values * x_values,
            y_values * y_values,
        ]
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_identity", type=Path)
    parser.add_argument("broadcast_frame", type=Path)
    parser.add_argument("reviewed_controls", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--minimum-training-controls", type=int, default=8)
    parser.add_argument("--minimum-holdout-controls", type=int, default=4)
    parser.add_argument("--maximum-training-p95-row-fraction", type=float, default=0.5)
    parser.add_argument("--maximum-holdout-p95-row-fraction", type=float, default=0.5)
    parser.add_argument("--minimum-training-hull-fraction", type=float, default=0.01)
    parser.add_argument("--minimum-holdout-hull-fraction", type=float, default=0.003)
    parser.add_argument(
        "--transform",
        choices=("homography", "quadratic", "piecewise-affine"),
        default="homography",
    )
    parser.add_argument("--minimum-row-spacing-pixels", type=float, default=2.0)
    parser.add_argument("--maximum-row-spacing-pixels", type=float, default=30.0)
    arguments = parser.parse_args()

    identity_bytes = arguments.row_identity.read_bytes()
    controls_bytes = arguments.reviewed_controls.read_bytes()
    identity = json.loads(identity_bytes)
    controls_artifact = json.loads(controls_bytes)
    broadcast = cv2.imread(str(arguments.broadcast_frame), cv2.IMREAD_COLOR)
    if broadcast is None:
        raise ValueError("Could not decode broadcast frame")
    if identity.get("artifactStage") != "current-provider-row-identity-review":
        raise ValueError("Input is not a current provider row identity artifact")
    if controls_artifact.get("artifactStage") != "reviewed-panorama-broadcast-controls":
        raise ValueError("Input is not a reviewed control artifact")
    if controls_artifact["inputs"]["rowIdentitySha256"] != hashlib.sha256(identity_bytes).hexdigest():
        raise ValueError("Control artifact row identity checksum differs")
    if controls_artifact["inputs"]["broadcastFrameSha256"] != sha256_file(arguments.broadcast_frame):
        raise ValueError("Control artifact broadcast frame checksum differs")

    controls = controls_artifact["controls"]
    ids = [item["id"] for item in controls]
    if len(ids) != len(set(ids)):
        raise ValueError("Reviewed control IDs must be unique")
    training = [item for item in controls if item["partition"] == "training"]
    holdouts = [item for item in controls if item["partition"] == "holdout"]
    if len(training) < arguments.minimum_training_controls:
        raise ValueError("Too few training controls")
    if len(holdouts) < arguments.minimum_holdout_controls:
        raise ValueError("Too few held-out controls")

    source_training = np.asarray([item["panoramaPixel"] for item in training], dtype=np.float32)
    target_training = np.asarray([item["broadcastPixel"] for item in training], dtype=np.float32)
    transform_record: dict[str, Any]
    if arguments.transform == "homography":
        homography, _ = cv2.findHomography(source_training, target_training, 0)
        if homography is None or not np.all(np.isfinite(homography)):
            raise ValueError("Reviewed controls did not solve a finite homography")

        def project(points: np.ndarray) -> np.ndarray:
            return cv2.perspectiveTransform(
                points.reshape(-1, 1, 2).astype(np.float32), homography
            ).reshape(-1, 2)

        transform_record = {"kind": "homography", "matrix": homography.tolist()}
    elif arguments.transform == "quadratic":
        if len(training) < 8:
            raise ValueError("Quadratic registration requires at least eight training controls")
        source_center = np.mean(source_training, axis=0)
        source_scale = np.std(source_training, axis=0)
        if np.any(source_scale <= 0):
            raise ValueError("Quadratic registration controls have zero source extent")
        design = quadratic_design(source_training, source_center, source_scale)
        condition_number = float(np.linalg.cond(design))
        if not math.isfinite(condition_number) or condition_number > 1e6:
            raise ValueError("Quadratic registration controls are poorly conditioned")
        coefficients, _, rank, _ = np.linalg.lstsq(design, target_training, rcond=None)
        if int(rank) != 6 or not np.all(np.isfinite(coefficients)):
            raise ValueError("Quadratic registration did not solve all coefficients")

        def project(points: np.ndarray) -> np.ndarray:
            return quadratic_design(points, source_center, source_scale) @ coefficients

        transform_record = {
            "kind": "normalized-quadratic",
            "sourceCenterPixels": source_center.tolist(),
            "sourceScalePixels": source_scale.tolist(),
            "basis": ["1", "x", "y", "x*y", "x^2", "y^2"],
            "coefficientsToBroadcastXY": coefficients.tolist(),
            "trainingDesignConditionNumber": condition_number,
        }
    else:
        try:
            from scipy.spatial import Delaunay
        except ImportError as error:
            raise ValueError("Piecewise affine registration requires scipy") from error
        triangulation = Delaunay(source_training)
        if len(triangulation.simplices) < 2:
            raise ValueError("Piecewise affine registration has too few triangles")

        def project(points: np.ndarray) -> np.ndarray:
            points64 = np.asarray(points, dtype=np.float64)
            simplices = triangulation.find_simplex(points64, tol=1e-7)
            projected = np.full((len(points64), 2), np.nan, dtype=np.float64)
            inside = simplices >= 0
            for simplex_index in np.unique(simplices[inside]):
                selected = np.flatnonzero(simplices == simplex_index)
                transform = triangulation.transform[simplex_index]
                delta = points64[selected] - transform[2]
                first_weights = delta @ transform[:2].T
                weights = np.column_stack(
                    [first_weights, 1.0 - np.sum(first_weights, axis=1)]
                )
                vertices = triangulation.simplices[simplex_index]
                projected[selected] = weights @ target_training[vertices]
            return projected

        transform_record = {
            "kind": "piecewise-affine-delaunay",
            "sourceTrainingPixels": source_training.tolist(),
            "targetTrainingPixels": target_training.tolist(),
            "simplices": triangulation.simplices.tolist(),
            "outsideTrainingHullPolicy": "reject registration",
        }

    training_residual = np.linalg.norm(project(source_training) - target_training, axis=1)
    source_holdout = np.asarray([item["panoramaPixel"] for item in holdouts], dtype=np.float32)
    target_holdout = np.asarray([item["broadcastPixel"] for item in holdouts], dtype=np.float32)
    holdout_projected = project(source_holdout)
    if not np.all(np.isfinite(holdout_projected)):
        raise ValueError("One or more held-out controls are outside the training hull")
    holdout_residual = np.linalg.norm(holdout_projected - target_holdout, axis=1)

    projected_rows_internal: list[dict[str, Any]] = []
    projected_row_point_count = 0
    projected_row_inside_count = 0
    for row in identity["rows"]:
        panorama_points = np.asarray(row["panoramaPixels"], dtype=np.float32)
        broadcast_points = project(panorama_points)
        finite = np.all(np.isfinite(broadcast_points), axis=1)
        projected_row_point_count += len(broadcast_points)
        projected_row_inside_count += int(np.sum(finite))
        projected_rows_internal.append(
            {
                "rowKey": row["rowKey"],
                "anchorSeatIds": row["anchorSeatIds"],
                "broadcastArray": broadcast_points,
            }
        )

    rows_by_section: dict[str, list[dict[str, Any]]] = {}
    for row in projected_rows_internal:
        section, _ = row["rowKey"].split(":", 1)
        rows_by_section.setdefault(section, []).append(row)
    spacing_samples: list[float] = []
    for section_rows in rows_by_section.values():
        ordered = sorted(
            section_rows,
            key=lambda item: row_ordinal(item["rowKey"].split(":", 1)[1]),
        )
        for first, second in zip(ordered, ordered[1:]):
            first_points = first["broadcastArray"]
            second_points = second["broadcastArray"]
            first_valid = first_points[np.all(np.isfinite(first_points), axis=1)]
            second_valid = second_points[np.all(np.isfinite(second_points), axis=1)]
            if not len(first_valid) or not len(second_valid):
                continue
            first_center = np.median(first_valid, axis=0)
            second_center = np.median(second_valid, axis=0)
            spacing_samples.append(float(np.linalg.norm(second_center - first_center)))
    if not spacing_samples:
        raise ValueError("No adjacent projected rows are available")
    median_row_spacing = float(np.median(spacing_samples))
    training_summary = residual_summary(training_residual)
    holdout_summary = residual_summary(holdout_residual)
    training_p95_fraction = float(training_summary["p95"]) / median_row_spacing
    holdout_p95_fraction = float(holdout_summary["p95"]) / median_row_spacing
    height, width = broadcast.shape[:2]
    training_hull = hull_fraction(target_training, width, height)
    holdout_hull = hull_fraction(target_holdout, width, height)
    projected_row_inside_fraction = (
        projected_row_inside_count / projected_row_point_count
        if projected_row_point_count
        else 0.0
    )
    eligible = bool(
        training_p95_fraction <= arguments.maximum_training_p95_row_fraction
        and holdout_p95_fraction <= arguments.maximum_holdout_p95_row_fraction
        and training_hull >= arguments.minimum_training_hull_fraction
        and holdout_hull >= arguments.minimum_holdout_hull_fraction
        and projected_row_inside_fraction == 1.0
        and arguments.minimum_row_spacing_pixels
        <= median_row_spacing
        <= arguments.maximum_row_spacing_pixels
    )

    rendered = broadcast.copy()
    palette = [(0, 255, 255), (255, 0, 255), (255, 255, 0), (0, 160, 255), (255, 120, 0)]
    colors = {
        section: palette[index % len(palette)]
        for index, section in enumerate(sorted(rows_by_section))
    }
    for row in projected_rows_internal:
        section, row_id = row["rowKey"].split(":", 1)
        broadcast_points = row["broadcastArray"]
        if not np.all(np.isfinite(broadcast_points)):
            continue
        points = np.rint(broadcast_points).astype(np.int32)
        cv2.polylines(rendered, [points], False, colors[section], 1, cv2.LINE_AA)
        if row_id in {"A", "1", "5", "9", "13"}:
            label_point = tuple(int(value) for value in points[-1])
            cv2.putText(
                rendered,
                row["rowKey"],
                label_point,
                cv2.FONT_HERSHEY_SIMPLEX,
                0.42,
                colors[section],
                1,
                cv2.LINE_AA,
            )
    for control in training:
        point = tuple(int(round(value)) for value in control["broadcastPixel"])
        cv2.drawMarker(rendered, point, (60, 255, 60), cv2.MARKER_CROSS, 15, 2)
    for control, predicted in zip(holdouts, holdout_projected):
        observed = tuple(int(round(value)) for value in control["broadcastPixel"])
        projected_point = tuple(int(round(value)) for value in predicted)
        cv2.drawMarker(rendered, observed, (255, 190, 0), cv2.MARKER_CROSS, 15, 2)
        cv2.line(rendered, observed, projected_point, (0, 0, 255), 2, cv2.LINE_AA)

    output_png = arguments.output_json.with_suffix(".png")
    output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output_png), rendered, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write reviewed-control registration preview")

    projected_rows = [
        {
            "rowKey": row["rowKey"],
            "anchorSeatIds": row["anchorSeatIds"],
            "broadcastPixels": [
                point.tolist() if np.all(np.isfinite(point)) else None
                for point in row["broadcastArray"]
            ],
        }
        for row in projected_rows_internal
    ]
    eligibility_blockers = [
        *(
            ["TRAINING_P95_EXCEEDS_LIMIT"]
            if training_p95_fraction > arguments.maximum_training_p95_row_fraction
            else []
        ),
        *(
            ["HOLDOUT_P95_EXCEEDS_LIMIT"]
            if holdout_p95_fraction > arguments.maximum_holdout_p95_row_fraction
            else []
        ),
        *(
            ["TRAINING_TARGET_HULL_TOO_SMALL"]
            if training_hull < arguments.minimum_training_hull_fraction
            else []
        ),
        *(
            ["HOLDOUT_TARGET_HULL_TOO_SMALL"]
            if holdout_hull < arguments.minimum_holdout_hull_fraction
            else []
        ),
        *(
            ["PROJECTED_ROWS_OUTSIDE_TRAINING_HULL"]
            if projected_row_inside_fraction < 1.0
            else []
        ),
        *(
            ["PROJECTED_ROW_SPACING_OUTSIDE_LIMITS"]
            if not (
                arguments.minimum_row_spacing_pixels
                <= median_row_spacing
                <= arguments.maximum_row_spacing_pixels
            )
            else []
        ),
    ]
    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "held-out-reviewed-control-registration-v2",
        "artifactStage": "current-provider-row-to-official-broadcast-reviewed-registration",
        "inputs": {
            "rowIdentityPath": str(arguments.row_identity.resolve()),
            "rowIdentitySha256": hashlib.sha256(identity_bytes).hexdigest(),
            "rowIdentityArtifactVersion": identity["artifactVersion"],
            "broadcastFramePath": str(arguments.broadcast_frame.resolve()),
            "broadcastFrameSha256": sha256_file(arguments.broadcast_frame),
            "reviewedControlsPath": str(arguments.reviewed_controls.resolve()),
            "reviewedControlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
        },
        "parameters": {
            "minimumTrainingControls": arguments.minimum_training_controls,
            "minimumHoldoutControls": arguments.minimum_holdout_controls,
            "maximumTrainingP95RowFraction": arguments.maximum_training_p95_row_fraction,
            "maximumHoldoutP95RowFraction": arguments.maximum_holdout_p95_row_fraction,
            "minimumTrainingHullFraction": arguments.minimum_training_hull_fraction,
            "minimumHoldoutHullFraction": arguments.minimum_holdout_hull_fraction,
            "minimumRowSpacingPixels": arguments.minimum_row_spacing_pixels,
            "maximumRowSpacingPixels": arguments.maximum_row_spacing_pixels,
        },
        "transform": transform_record,
        "validation": {
            "trainingResidualPixels": training_summary,
            "holdoutResidualPixels": holdout_summary,
            "medianProjectedRowSpacingPixels": median_row_spacing,
            "trainingP95AsRowFraction": training_p95_fraction,
            "holdoutP95AsRowFraction": holdout_p95_fraction,
            "trainingTargetHullFraction": training_hull,
            "holdoutTargetHullFraction": holdout_hull,
            "projectedRowPointInsideTrainingHullFraction": projected_row_inside_fraction,
        },
        "controls": [
            {
                **control,
                **(
                    {"projectedBroadcastPixel": predicted.tolist(), "residualPixels": float(residual)}
                    if control["partition"] == "holdout"
                    else {}
                ),
            }
            for control, predicted, residual in [
                *[
                    (item, np.asarray(item["broadcastPixel"], dtype=float), residual)
                    for item, residual in zip(training, training_residual)
                ],
                *[
                    (item, predicted, residual)
                    for item, predicted, residual in zip(holdouts, holdout_projected, holdout_residual)
                ],
            ]
        ],
        "projectedRows": projected_rows,
        "previewPng": str(output_png.resolve()),
        "previewPngSha256": sha256_file(output_png),
        "registrationEligibleForManualRowReview": eligible,
        "publicationEligible": False,
        "blockers": [
            *eligibility_blockers,
            "SHADE_BOUNDARY_NOT_LABELED",
            "LOCALLY_PLANAR_BANK_ASSUMPTION_REQUIRES_SCOPE_REVIEW",
            "REGISTRATION_ONLY_DOES_NOT_VALIDATE_SHADOW_GEOMETRY",
        ],
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "validation": artifact["validation"],
                "registrationEligibleForManualRowReview": eligible,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
