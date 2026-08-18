#!/usr/bin/env python3
"""Register metric seating rows to one official broadcast frame.

The fit uses only training controls. Controls identify a source row and a
fraction measured from its first to last metric seat anchor. Separately marked
holdout controls are projected only after the camera fit has finished.

This artifact registers row identity. It does not label shade and it cannot
make a stadium publication eligible by itself.
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
from scipy.optimize import least_squares


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_version(value: dict[str, Any]) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def interpolate_row_point(row: dict[str, Any], fraction: float) -> np.ndarray:
    anchors = np.asarray([anchor["position"] for anchor in row["anchors"]], dtype=np.float64)
    if anchors.ndim != 2 or anchors.shape[1] != 3 or anchors.shape[0] < 2:
        raise ValueError(f"Row {row['rowKey']} has fewer than two metric anchors")
    scaled = fraction * (anchors.shape[0] - 1)
    lower = min(int(math.floor(scaled)), anchors.shape[0] - 2)
    upper = lower + 1
    weight = scaled - lower
    return anchors[lower] * (1.0 - weight) + anchors[upper] * weight


def interpolate_row_at_lateral(
    row: dict[str, Any], lateral_provider_metres: float
) -> np.ndarray | None:
    anchors = np.asarray([anchor["position"] for anchor in row["anchors"]], dtype=np.float64)
    order = np.argsort(anchors[:, 2])
    anchors = anchors[order]
    lateral = anchors[:, 2]
    if lateral_provider_metres < lateral[0] or lateral_provider_metres > lateral[-1]:
        return None
    upper = int(np.searchsorted(lateral, lateral_provider_metres, side="right"))
    upper = min(max(upper, 1), len(anchors) - 1)
    lower = upper - 1
    span = lateral[upper] - lateral[lower]
    weight = 0.0 if abs(span) < 1e-12 else (
        (lateral_provider_metres - lateral[lower]) / span
    )
    return anchors[lower] * (1.0 - weight) + anchors[upper] * weight


def point_to_polyline_distance(point: np.ndarray, polyline: np.ndarray) -> float:
    if len(polyline) == 1:
        return float(np.linalg.norm(point - polyline[0]))
    starts = polyline[:-1]
    segments = polyline[1:] - starts
    denominator = np.sum(np.square(segments), axis=1)
    numerator = np.sum((point.reshape(1, 2) - starts) * segments, axis=1)
    weights = np.divide(
        numerator,
        denominator,
        out=np.zeros_like(numerator),
        where=denominator > 1e-12,
    )
    weights = np.clip(weights, 0.0, 1.0)
    closest = starts + weights[:, None] * segments
    return float(np.min(np.linalg.norm(point.reshape(1, 2) - closest, axis=1)))


def project_points(
    world_points: np.ndarray,
    rotation_vector: np.ndarray,
    translation_vector: np.ndarray,
    focal_pixels: float,
    principal_point: tuple[float, float],
) -> tuple[np.ndarray, np.ndarray]:
    rotation, _ = cv2.Rodrigues(rotation_vector.reshape(3, 1))
    camera = (rotation @ world_points.T).T + translation_vector.reshape(1, 3)
    depth = camera[:, 2]
    safe_depth = np.where(np.abs(depth) < 1e-9, np.nan, depth)
    pixels = np.column_stack(
        (
            focal_pixels * camera[:, 0] / safe_depth + principal_point[0],
            focal_pixels * camera[:, 1] / safe_depth + principal_point[1],
        )
    )
    return pixels, depth


def initialize_camera(
    world_points: np.ndarray,
    image_points: np.ndarray,
    principal_point: tuple[float, float],
) -> tuple[np.ndarray, np.ndarray, float]:
    candidates: list[tuple[float, np.ndarray, np.ndarray, float]] = []
    for focal in (300.0, 450.0, 650.0, 900.0, 1200.0, 1700.0, 2400.0, 3400.0):
        intrinsic = np.asarray(
            [
                [focal, 0.0, principal_point[0]],
                [0.0, focal, principal_point[1]],
                [0.0, 0.0, 1.0],
            ],
            dtype=np.float64,
        )
        success, rotation, translation = cv2.solvePnP(
            world_points,
            image_points,
            intrinsic,
            None,
            flags=cv2.SOLVEPNP_EPNP,
        )
        if not success:
            continue
        refined, rotation, translation = cv2.solvePnP(
            world_points,
            image_points,
            intrinsic,
            None,
            rotation,
            translation,
            True,
            flags=cv2.SOLVEPNP_ITERATIVE,
        )
        if not refined:
            continue
        projected, depth = project_points(
            world_points,
            rotation.reshape(3),
            translation.reshape(3),
            focal,
            principal_point,
        )
        if np.any(depth <= 0) or not np.all(np.isfinite(projected)):
            continue
        rmse = float(np.sqrt(np.mean(np.square(projected - image_points))))
        candidates.append((rmse, rotation.reshape(3), translation.reshape(3), focal))
    if not candidates:
        raise ValueError("Could not initialize a positive-depth pinhole camera")
    _, rotation, translation, focal = min(candidates, key=lambda item: item[0])
    return rotation, translation, focal


def optimize_camera(
    world_points: np.ndarray,
    image_points: np.ndarray,
    principal_point: tuple[float, float],
) -> tuple[np.ndarray, np.ndarray, float, dict[str, Any]]:
    rotation, translation, focal = initialize_camera(
        world_points, image_points, principal_point
    )
    initial = np.concatenate((rotation, translation, [math.log(focal)]))

    def residuals(parameters: np.ndarray) -> np.ndarray:
        projected, depth = project_points(
            world_points,
            parameters[:3],
            parameters[3:6],
            math.exp(float(parameters[6])),
            principal_point,
        )
        residual = (projected - image_points).reshape(-1)
        if np.all(depth > 0) and np.all(np.isfinite(residual)):
            return residual
        invalid = np.count_nonzero(depth <= 0) + np.count_nonzero(~np.isfinite(residual))
        return np.nan_to_num(residual, nan=1e5, posinf=1e5, neginf=-1e5) + invalid * 1e4

    result = least_squares(
        residuals,
        initial,
        bounds=(
            np.asarray([-np.inf] * 6 + [math.log(100.0)]),
            np.asarray([np.inf] * 6 + [math.log(10000.0)]),
        ),
        loss="soft_l1",
        f_scale=2.0,
        max_nfev=10000,
        xtol=1e-12,
        ftol=1e-12,
        gtol=1e-12,
    )
    optimized_focal = math.exp(float(result.x[6]))
    projected, depth = project_points(
        world_points,
        result.x[:3],
        result.x[3:6],
        optimized_focal,
        principal_point,
    )
    if not result.success or np.any(depth <= 0) or not np.all(np.isfinite(projected)):
        raise ValueError(f"Camera optimization did not converge to a valid fit: {result.message}")
    diagnostics = {
        "success": bool(result.success),
        "message": str(result.message),
        "functionEvaluations": int(result.nfev),
        "cost": float(result.cost),
        "optimality": float(result.optimality),
    }
    return result.x[:3], result.x[3:6], optimized_focal, diagnostics


def percentile(values: np.ndarray, probability: float) -> float:
    return float(np.percentile(values, probability)) if values.size else math.nan


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame", type=Path)
    parser.add_argument("metric_rows", type=Path)
    parser.add_argument("reviewed_controls", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--section", required=True)
    parser.add_argument("--minimum-training-controls", type=int, default=12)
    parser.add_argument("--minimum-holdout-controls", type=int, default=6)
    parser.add_argument("--maximum-holdout-p95-rows", type=float, default=0.5)
    parser.add_argument("--maximum-holdout-error-rows", type=float, default=0.75)
    parser.add_argument("--minimum-row-spacing-pixels", type=float, default=2.0)
    parser.add_argument("--maximum-row-spacing-pixels", type=float, default=30.0)
    arguments = parser.parse_args()

    frame = cv2.imread(str(arguments.frame), cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Could not decode the official broadcast frame")
    frame_height, frame_width = frame.shape[:2]
    frame_sha = sha256_file(arguments.frame)

    metric_bytes = arguments.metric_rows.read_bytes()
    controls_bytes = arguments.reviewed_controls.read_bytes()
    metric = json.loads(metric_bytes)
    controls_artifact = json.loads(controls_bytes)
    metric_sha = hashlib.sha256(metric_bytes).hexdigest()
    if controls_artifact.get("reviewStatus") != "independently-reviewed-broadcast-row-fraction-controls":
        raise ValueError("Controls are not marked as independently reviewed")
    if controls_artifact.get("coordinateConvention") != "zero-based-pixel-centers":
        raise ValueError("Unsupported control coordinate convention")
    expected_inputs = controls_artifact.get("inputs", {})
    if expected_inputs.get("broadcastFrameSha256") != frame_sha:
        raise ValueError("Control frame checksum does not match the decoded frame")
    if expected_inputs.get("metricRowsSha256") != metric_sha:
        raise ValueError("Control metric-row checksum does not match")

    rows = [row for row in metric["rows"] if row["sectionId"] == arguments.section]
    if len(rows) < 3:
        raise ValueError("Requested section has fewer than three metric rows")
    row_by_id = {str(row["rowId"]): row for row in rows}
    if len(row_by_id) != len(rows):
        raise ValueError("Requested section has duplicate row identities")
    requested_scope = controls_artifact.get(
        "registrationScopeRowIds", [str(row["rowId"]) for row in rows]
    )
    scope_ids = [str(row_id) for row_id in requested_scope]
    if len(scope_ids) != len(set(scope_ids)) or not scope_ids:
        raise ValueError("Registration scope must contain unique row identities")
    unknown_scope = [row_id for row_id in scope_ids if row_id not in row_by_id]
    if unknown_scope:
        raise ValueError(f"Registration scope references unknown rows: {unknown_scope}")
    scope_set = set(scope_ids)
    scoped_rows = [row for row in rows if str(row["rowId"]) in scope_set]
    requested_fraction_scope = controls_artifact.get(
        "registrationScopeSectionFractionInclusive", [0.0, 1.0]
    )
    if not isinstance(requested_fraction_scope, list) or len(requested_fraction_scope) != 2:
        raise ValueError(
            "Registration section-fraction scope must be a two-element inclusive range"
        )
    fraction_scope = [float(value) for value in requested_fraction_scope]
    if not all(math.isfinite(value) for value in fraction_scope):
        raise ValueError("Registration section-fraction scope must be finite")
    if not 0.0 <= fraction_scope[0] < fraction_scope[1] <= 1.0:
        raise ValueError(
            "Registration section-fraction scope must increase within zero and one"
        )

    controls: list[dict[str, Any]] = []
    for control in controls_artifact.get("controls", []):
        partition = str(control.get("partition"))
        if partition not in {"training", "holdout"}:
            raise ValueError(f"Control {control.get('id')} has an invalid partition")
        row_id = str(control.get("rowId"))
        if row_id not in row_by_id:
            raise ValueError(f"Control {control.get('id')} references unknown row {row_id}")
        if row_id not in scope_set:
            raise ValueError(f"Control {control.get('id')} is outside the registration scope")
        fraction = float(control.get("sectionFraction"))
        if not 0.0 <= fraction <= 1.0:
            raise ValueError(f"Control {control.get('id')} has an invalid section fraction")
        if not fraction_scope[0] - 1e-9 <= fraction <= fraction_scope[1] + 1e-9:
            raise ValueError(
                f"Control {control.get('id')} is outside the section-fraction scope"
            )
        pixel = np.asarray(control.get("broadcastPixel"), dtype=np.float64)
        if pixel.shape != (2,) or not np.all(np.isfinite(pixel)):
            raise ValueError(f"Control {control.get('id')} has an invalid broadcast pixel")
        if not (0 <= pixel[0] < frame_width and 0 <= pixel[1] < frame_height):
            raise ValueError(f"Control {control.get('id')} is outside the frame")
        controls.append(
            {
                **control,
                "partition": partition,
                "rowId": row_id,
                "sectionFraction": fraction,
                "broadcastPixelArray": pixel,
                "worldPointArray": interpolate_row_point(row_by_id[row_id], fraction),
            }
        )

    training = [control for control in controls if control["partition"] == "training"]
    holdout = [control for control in controls if control["partition"] == "holdout"]
    training_rows = {control["rowId"] for control in training}
    training_fractions = {control["sectionFraction"] for control in training}
    holdout_rows = {control["rowId"] for control in holdout}
    if len(training) < arguments.minimum_training_controls:
        raise ValueError("Too few training controls")
    if len(training_rows) < 5 or len(training_fractions) < 2:
        raise ValueError("Training controls do not span at least five rows and two fractions")
    if len(holdout) < arguments.minimum_holdout_controls or len(holdout_rows) < 3:
        raise ValueError("Holdouts do not span at least three independent row identities")
    if training_rows & holdout_rows:
        raise ValueError("A row identity cannot appear in both training and holdout partitions")

    world_origin = np.mean(
        np.vstack([control["worldPointArray"] for control in training]), axis=0
    )
    training_world = (
        np.vstack([control["worldPointArray"] for control in training]) - world_origin
    )
    training_pixels = np.vstack([control["broadcastPixelArray"] for control in training])
    principal_point = ((frame_width - 1) / 2.0, (frame_height - 1) / 2.0)
    rotation, translation, focal, optimizer = optimize_camera(
        training_world, training_pixels, principal_point
    )

    def project_world(points: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        return project_points(
            points - world_origin,
            rotation,
            translation,
            focal,
            principal_point,
        )

    projected_training, _ = project_world(
        np.vstack([control["worldPointArray"] for control in training])
    )
    training_errors = np.linalg.norm(projected_training - training_pixels, axis=1)
    training_results = [
        {
            "id": control["id"],
            "rowId": control["rowId"],
            "sectionFraction": control["sectionFraction"],
            "observedPixel": control["broadcastPixelArray"].tolist(),
            "projectedPixel": projected.tolist(),
            "errorPixels": float(error),
        }
        for control, projected, error in zip(
            training, projected_training, training_errors
        )
    ]
    projected_holdout, holdout_depth = project_world(
        np.vstack([control["worldPointArray"] for control in holdout])
    )
    holdout_pixels = np.vstack([control["broadcastPixelArray"] for control in holdout])
    holdout_errors = np.linalg.norm(projected_holdout - holdout_pixels, axis=1)

    row_index = {str(row["rowId"]): index for index, row in enumerate(rows)}
    holdout_point_row_errors: list[float] = []
    holdout_curve_row_errors: list[float] = []
    holdout_results: list[dict[str, Any]] = []
    for index, control in enumerate(holdout):
        source_index = row_index[control["rowId"]]
        source_row = rows[source_index]
        source_anchors = np.asarray(
            [anchor["position"] for anchor in source_row["anchors"]], dtype=np.float64
        )
        source_polyline, source_depth = project_world(source_anchors)
        if np.any(source_depth <= 0):
            raise ValueError("A holdout source row projected behind the camera")
        curve_distance = point_to_polyline_distance(
            control["broadcastPixelArray"], source_polyline
        )
        neighbor_indexes = [
            candidate
            for candidate in (source_index - 1, source_index + 1)
            if 0 <= candidate < len(rows)
        ]
        lateral = float(control["worldPointArray"][2])
        neighbor_world = [
            point
            for candidate in neighbor_indexes
            if (point := interpolate_row_at_lateral(rows[candidate], lateral)) is not None
        ]
        if not neighbor_world:
            raise ValueError(
                f"Holdout {control['id']} has no adjacent row at the same provider lateral coordinate"
            )
        neighbor_points = np.vstack(neighbor_world)
        neighbor_pixels, neighbor_depth = project_world(neighbor_points)
        if np.any(neighbor_depth <= 0):
            raise ValueError("An adjacent row projected behind the camera")
        local_spacing = float(
            np.mean(
                np.linalg.norm(
                    neighbor_pixels - projected_holdout[index].reshape(1, 2), axis=1
                )
            )
        )
        if not math.isfinite(local_spacing) or local_spacing <= 0:
            raise ValueError("Could not measure local projected row spacing")
        point_error_rows = float(holdout_errors[index] / local_spacing)
        curve_error_rows = float(curve_distance / local_spacing)
        holdout_point_row_errors.append(point_error_rows)
        holdout_curve_row_errors.append(curve_error_rows)
        holdout_results.append(
            {
                "id": control["id"],
                "rowId": control["rowId"],
                "sectionFraction": control["sectionFraction"],
                "observedPixel": control["broadcastPixelArray"].tolist(),
                "projectedPixel": projected_holdout[index].tolist(),
                "pointErrorPixels": float(holdout_errors[index]),
                "rowCurveDistancePixels": curve_distance,
                "localProjectedRowSpacingPixels": local_spacing,
                "pointErrorRows": point_error_rows,
                "rowCurveErrorRows": curve_error_rows,
            }
        )
    holdout_point_row_errors_array = np.asarray(
        holdout_point_row_errors, dtype=np.float64
    )
    holdout_curve_row_errors_array = np.asarray(
        holdout_curve_row_errors, dtype=np.float64
    )

    rendered = frame.copy()
    projected_rows: list[dict[str, Any]] = []
    all_spacings: list[float] = []
    row_polylines: list[np.ndarray] = []
    for row in scoped_rows:
        anchors = np.asarray([anchor["position"] for anchor in row["anchors"]], dtype=np.float64)
        projected, depth = project_world(anchors)
        if np.any(depth <= 0) or not np.all(np.isfinite(projected)):
            raise ValueError(f"Row {row['rowKey']} did not project with positive finite depth")
        row_polylines.append(projected)
        projected_rows.append(
            {
                "rowId": str(row["rowId"]),
                "rowKey": row["rowKey"],
                "anchorSeatIds": row["anchorSeatIds"],
                "projectedAnchorPixels": projected.tolist(),
            }
        )
    for first_row, second_row in zip(scoped_rows[:-1], scoped_rows[1:]):
        first_lateral = np.asarray(
            [anchor["position"][2] for anchor in first_row["anchors"]], dtype=np.float64
        )
        second_lateral = np.asarray(
            [anchor["position"][2] for anchor in second_row["anchors"]], dtype=np.float64
        )
        overlap_minimum = max(float(first_lateral.min()), float(second_lateral.min()))
        overlap_maximum = min(float(first_lateral.max()), float(second_lateral.max()))
        if overlap_maximum < overlap_minimum:
            continue
        for lateral in np.linspace(overlap_minimum, overlap_maximum, 3):
            first_point = interpolate_row_at_lateral(first_row, float(lateral))
            second_point = interpolate_row_at_lateral(second_row, float(lateral))
            if first_point is None or second_point is None:
                continue
            pixels, depth = project_world(np.vstack((first_point, second_point)))
            if np.any(depth <= 0):
                raise ValueError("An adjacent-row spacing sample projected behind the camera")
            all_spacings.append(float(np.linalg.norm(pixels[0] - pixels[1])))
    spacing_array = np.asarray(all_spacings, dtype=np.float64)

    for row, projected in zip(scoped_rows, row_polylines):
        points = np.rint(projected).astype(np.int32)
        cv2.polylines(rendered, [points], False, (0, 220, 255), 1, cv2.LINE_AA)
        label_point = tuple(int(value) for value in points[len(points) // 2])
        cv2.putText(
            rendered,
            str(row["rowId"]),
            label_point,
            cv2.FONT_HERSHEY_SIMPLEX,
            0.34,
            (0, 220, 255),
            1,
            cv2.LINE_AA,
        )
    for control, projected in zip(training, projected_training):
        observed = tuple(int(round(value)) for value in control["broadcastPixelArray"])
        predicted = tuple(int(round(value)) for value in projected)
        cv2.circle(rendered, observed, 3, (60, 230, 60), -1, cv2.LINE_AA)
        cv2.line(rendered, observed, predicted, (60, 230, 60), 1, cv2.LINE_AA)
    for control, projected in zip(holdout, projected_holdout):
        observed = tuple(int(round(value)) for value in control["broadcastPixelArray"])
        predicted = tuple(int(round(value)) for value in projected)
        cv2.circle(rendered, observed, 4, (255, 70, 255), 1, cv2.LINE_AA)
        cv2.line(rendered, observed, predicted, (255, 70, 255), 1, cv2.LINE_AA)

    minimum_spacing = float(spacing_array.min())
    maximum_spacing = float(spacing_array.max())
    holdout_point_p95_rows = percentile(holdout_point_row_errors_array, 95)
    holdout_point_maximum_rows = float(holdout_point_row_errors_array.max())
    holdout_curve_p95_rows = percentile(holdout_curve_row_errors_array, 95)
    holdout_curve_maximum_rows = float(holdout_curve_row_errors_array.max())
    row_identity_eligible = bool(
        holdout_curve_p95_rows <= arguments.maximum_holdout_p95_rows
        and holdout_curve_maximum_rows <= arguments.maximum_holdout_error_rows
        and minimum_spacing >= arguments.minimum_row_spacing_pixels
        and maximum_spacing <= arguments.maximum_row_spacing_pixels
    )
    registration_eligible = bool(
        row_identity_eligible
        and holdout_point_p95_rows <= arguments.maximum_holdout_p95_rows
        and holdout_point_maximum_rows <= arguments.maximum_holdout_error_rows
    )
    registration_blockers: list[str] = []
    if holdout_curve_p95_rows > arguments.maximum_holdout_p95_rows:
        registration_blockers.append("HOLDOUT_P95_ROW_CURVE_ERROR_EXCEEDS_THRESHOLD")
    if holdout_curve_maximum_rows > arguments.maximum_holdout_error_rows:
        registration_blockers.append("HOLDOUT_MAXIMUM_ROW_CURVE_ERROR_EXCEEDS_THRESHOLD")
    if holdout_point_p95_rows > arguments.maximum_holdout_p95_rows:
        registration_blockers.append("HOLDOUT_P95_SEAT_FRACTION_ERROR_EXCEEDS_THRESHOLD")
    if holdout_point_maximum_rows > arguments.maximum_holdout_error_rows:
        registration_blockers.append("HOLDOUT_MAXIMUM_SEAT_FRACTION_ERROR_EXCEEDS_THRESHOLD")
    if minimum_spacing < arguments.minimum_row_spacing_pixels:
        registration_blockers.append("PROJECTED_ROW_SPACING_BELOW_THRESHOLD")
    if maximum_spacing > arguments.maximum_row_spacing_pixels:
        registration_blockers.append("PROJECTED_ROW_SPACING_ABOVE_THRESHOLD")

    output_png = arguments.output_json.with_suffix(".png")
    output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output_png), rendered, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write registration preview")

    stable = {
        "frameSha256": frame_sha,
        "metricRowsSha256": metric_sha,
        "reviewedControlsSha256": hashlib.sha256(controls_bytes).hexdigest(),
        "sectionId": arguments.section,
        "registrationScopeRowIds": scope_ids,
        "registrationScopeSectionFractionInclusive": fraction_scope,
        "worldOriginProviderMetres": world_origin.tolist(),
        "camera": {
            "model": "pinhole-zero-skew-square-pixels-fixed-image-center",
            "rotationVector": rotation.tolist(),
            "translationVector": translation.tolist(),
            "focalPixels": focal,
            "principalPointPixels": list(principal_point),
        },
        "thresholds": {
            "minimumTrainingControls": arguments.minimum_training_controls,
            "minimumHoldoutControls": arguments.minimum_holdout_controls,
            "maximumHoldoutP95Rows": arguments.maximum_holdout_p95_rows,
            "maximumHoldoutErrorRows": arguments.maximum_holdout_error_rows,
            "minimumRowSpacingPixels": arguments.minimum_row_spacing_pixels,
            "maximumRowSpacingPixels": arguments.maximum_row_spacing_pixels,
        },
        "trainingControlIds": [control["id"] for control in training],
        "holdoutControlIds": [control["id"] for control in holdout],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "official-broadcast-metric-row-camera-registration",
        "artifactVersion": stable_version(stable),
        "stadiumId": metric["stadiumId"],
        "sectionId": arguments.section,
        "registrationScope": {
            "rowIds": scope_ids,
            "rowCount": len(scope_ids),
            "completeSection": len(scope_ids) == len(rows),
            "sectionFractionInclusive": fraction_scope,
            "completeSectionFractionSpan": fraction_scope == [0.0, 1.0],
        },
        "inputs": {
            "frame": {"path": str(arguments.frame), "sha256": frame_sha},
            "metricRows": {
                "path": str(arguments.metric_rows),
                "sha256": metric_sha,
                "artifactVersion": metric["artifactVersion"],
            },
            "reviewedControls": {
                "path": str(arguments.reviewed_controls),
                "sha256": stable["reviewedControlsSha256"],
            },
        },
        "camera": stable["camera"],
        "worldOriginProviderMetres": stable["worldOriginProviderMetres"],
        "optimizer": optimizer,
        "trainingValidation": {
            "controlCount": len(training),
            "uniqueRowCount": len(training_rows),
            "uniqueSectionFractionCount": len(training_fractions),
            "medianErrorPixels": float(np.median(training_errors)),
            "p95ErrorPixels": percentile(training_errors, 95),
            "maximumErrorPixels": float(training_errors.max()),
            "controls": training_results,
        },
        "holdoutValidation": {
            "controlCount": len(holdout),
            "uniqueRowCount": len(holdout_rows),
            "medianErrorPixels": float(np.median(holdout_errors)),
            "p95ErrorPixels": percentile(holdout_errors, 95),
            "maximumErrorPixels": float(holdout_errors.max()),
            "medianPointErrorRows": float(np.median(holdout_point_row_errors_array)),
            "p95PointErrorRows": holdout_point_p95_rows,
            "maximumPointErrorRows": holdout_point_maximum_rows,
            "medianRowCurveErrorRows": float(np.median(holdout_curve_row_errors_array)),
            "p95RowCurveErrorRows": holdout_curve_p95_rows,
            "maximumRowCurveErrorRows": holdout_curve_maximum_rows,
            "controls": holdout_results,
        },
        "projectedRowSpacing": {
            "sampleCount": int(spacing_array.size),
            "minimumPixels": minimum_spacing,
            "medianPixels": float(np.median(spacing_array)),
            "maximumPixels": maximum_spacing,
        },
        "thresholds": stable["thresholds"],
        "rows": projected_rows,
        "previewPng": str(output_png),
        "previewPngSha256": sha256_file(output_png),
        "rowIdentityEligibleForManualReview": row_identity_eligible,
        "registrationEligibleForManualShadeReview": registration_eligible,
        "registrationBlockers": registration_blockers,
        "publication": {
            "eligible": False,
            "blockers": [
                "REGISTRATION_APPLIES_ONLY_TO_ONE_VISIBLE_SECTION_AND_FRAME",
                *(
                    []
                    if len(scope_ids) == len(rows)
                    else ["SECTION_ROWS_OUTSIDE_REGISTRATION_SCOPE"]
                ),
                "SHADE_BOUNDARIES_NOT_YET_LABELED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "outputPng": str(output_png),
                "artifactVersion": artifact["artifactVersion"],
                "trainingValidation": artifact["trainingValidation"],
                "holdoutValidation": artifact["holdoutValidation"],
                "projectedRowSpacing": artifact["projectedRowSpacing"],
                "rowIdentityEligibleForManualReview": row_identity_eligible,
                "registrationEligibleForManualShadeReview": registration_eligible,
                "registrationBlockers": registration_blockers,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
