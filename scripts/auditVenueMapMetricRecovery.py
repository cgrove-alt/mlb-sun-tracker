#!/usr/bin/env python3
"""Audit whether provider 2D seat centers can recover unavailable metric anchors.

Fits are section-local and are evaluated by leaving out whole rows. A missing
edge row can qualify only when its map-space extrapolation is no farther than
the section's independently withheld real edge rows and the pooled edge-row
error gate passes. Candidate predictions are never promoted here.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path
from typing import Any

import numpy as np


ANALYSIS_VERSION = "venue-map-metric-recovery-audit-v3"
METRES_TO_FEET = 3.280839895013123


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("map_rows", type=Path)
    parser.add_argument("metric_rows", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--horizontal-threshold-ft", type=float, default=1.0)
    parser.add_argument("--vertical-threshold-ft", type=float, default=1.0)
    parser.add_argument("--minimum-holdout-anchors", type=int, default=30)
    parser.add_argument("--minimum-edge-holdout-anchors", type=int, default=6)
    return parser.parse_args()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def round_number(value: float | None, digits: int = 6) -> float | None:
    return None if value is None or not math.isfinite(value) else round(float(value), digits)


def quantiles(values: list[float]) -> dict[str, float | None]:
    if not values:
        return {"median": None, "p95": None, "maximum": None}
    array = np.asarray(values, dtype=np.float64)
    return {
        "median": round_number(float(np.quantile(array, 0.5))),
        "p95": round_number(float(np.quantile(array, 0.95))),
        "maximum": round_number(float(np.max(array))),
    }


def feature_matrix(points: np.ndarray, model: str, center: np.ndarray, scale: np.ndarray) -> np.ndarray:
    normalized = (points - center) / scale
    u = normalized[:, 0]
    v = normalized[:, 1]
    if model == "affine":
        return np.column_stack((np.ones(points.shape[0]), u, v))
    if model == "quadratic":
        return np.column_stack((np.ones(points.shape[0]), u, v, u * u, u * v, v * v))
    raise ValueError(model)


def fit_model(points: np.ndarray, targets: np.ndarray, model: str) -> dict[str, np.ndarray]:
    center = np.mean(points, axis=0)
    scale = np.std(points, axis=0)
    scale[scale < 1e-9] = 1.0
    design = feature_matrix(points, model, center, scale)
    coefficients, _, rank, singular_values = np.linalg.lstsq(design, targets, rcond=None)
    if rank < design.shape[1]:
        raise ValueError(f"rank-deficient {model} fit")
    return {
        "center": center,
        "scale": scale,
        "coefficients": coefficients,
        "singularValues": singular_values,
    }


def predict_model(fit: dict[str, np.ndarray], points: np.ndarray, model: str) -> np.ndarray:
    design = feature_matrix(points, model, fit["center"], fit["scale"])
    return design @ fit["coefficients"]


def error_values(predicted: np.ndarray, observed: np.ndarray) -> tuple[list[float], list[float]]:
    horizontal = np.sqrt(
        np.square(predicted[:, 0] - observed[:, 0])
        + np.square(predicted[:, 2] - observed[:, 2])
    ) * METRES_TO_FEET
    vertical = np.abs(predicted[:, 1] - observed[:, 1]) * METRES_TO_FEET
    return horizontal.tolist(), vertical.tolist()


def bounds_excess(points: np.ndarray, minimum: np.ndarray, maximum: np.ndarray) -> np.ndarray:
    """Return nonnegative distance beyond an axis-aligned training envelope."""
    return np.maximum(minimum - points, 0.0) + np.maximum(points - maximum, 0.0)


def main() -> None:
    args = parse_args()
    if args.horizontal_threshold_ft <= 0 or args.vertical_threshold_ft <= 0:
        raise ValueError("thresholds must be positive")
    map_artifact = json.loads(args.map_rows.read_text(encoding="utf-8"))
    metric_artifact = json.loads(args.metric_rows.read_text(encoding="utf-8"))
    if map_artifact.get("artifactKind") != "current-venue-map-row-geometry":
        raise ValueError("map input is not current-venue-map-row-geometry")
    if metric_artifact.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("metric input is not venue-local-metric-row-anchors")
    if map_artifact.get("stadiumId") != metric_artifact.get("stadiumId"):
        raise ValueError("stadium mismatch")

    map_seats: dict[str, dict[str, Any]] = {}
    section_row_seats: dict[str, dict[str, list[dict[str, Any]]]] = defaultdict(dict)
    for section in map_artifact["sections"]:
        section_id = section["sectionId"]
        for row in section["rows"]:
            section_row_seats[section_id][row["rowId"]] = row["seats"]
            for seat in row["seats"]:
                if seat["id"] in map_seats:
                    raise ValueError(f"duplicate map seat {seat['id']}")
                map_seats[seat["id"]] = {
                    "sectionId": section_id,
                    "rowId": row["rowId"],
                    "center": seat["center"],
                }

    training_by_section: dict[str, list[dict[str, Any]]] = defaultdict(list)
    missing_by_section: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in metric_artifact["rows"]:
        for anchor in row.get("anchors", []):
            map_seat = map_seats.get(anchor["seatId"])
            if map_seat is None:
                continue
            training_by_section[row["sectionId"]].append({
                "seatId": anchor["seatId"],
                "rowId": row["rowId"],
                "mapCenter": map_seat["center"],
                "metricPosition": anchor["position"],
            })
        for seat_id in row.get("missingAnchorSeatIds", []):
            map_seat = map_seats.get(seat_id)
            missing_by_section[row["sectionId"]].append({
                "rowKey": row["rowKey"],
                "rowId": row["rowId"],
                "seatId": seat_id,
                "mapCenter": map_seat["center"] if map_seat else None,
            })
    missing_anchor_count = sum(len(items) for items in missing_by_section.values())

    section_results: list[dict[str, Any]] = []
    global_edge_horizontal_errors: list[float] = []
    global_edge_vertical_errors: list[float] = []
    for section_id in sorted(missing_by_section):
        training = training_by_section.get(section_id, [])
        missing = missing_by_section[section_id]
        training_rows: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for item in training:
            training_rows[item["rowId"]].append(item)
        row_median_v = {
            row_id: float(np.median([item["mapCenter"][1] for item in items]))
            for row_id, items in training_rows.items()
        }
        ordered_rows = sorted(row_median_v, key=row_median_v.get)
        edge_rows = set(ordered_rows[:1] + ordered_rows[-1:])
        model_results = []
        model_raw_diagnostics: dict[str, dict[str, list[float]]] = {}
        for model, feature_count in (("affine", 3), ("quadratic", 6)):
            horizontal_errors: list[float] = []
            vertical_errors: list[float] = []
            edge_horizontal_errors: list[float] = []
            edge_vertical_errors: list[float] = []
            edge_u_excess: list[float] = []
            edge_v_excess: list[float] = []
            two_step_edge_horizontal_errors: list[float] = []
            two_step_edge_vertical_errors: list[float] = []
            two_step_edge_u_excess: list[float] = []
            two_step_edge_v_excess: list[float] = []
            held_out_rows = 0
            failures: list[str] = []
            for held_row, held_items in training_rows.items():
                fit_items = [item for item in training if item["rowId"] != held_row]
                fit_row_count = len({item["rowId"] for item in fit_items})
                if fit_row_count < 4 or len(fit_items) < feature_count * 2:
                    continue
                try:
                    fit = fit_model(
                        np.asarray([item["mapCenter"] for item in fit_items], dtype=np.float64),
                        np.asarray([item["metricPosition"] for item in fit_items], dtype=np.float64),
                        model,
                    )
                    predicted = predict_model(
                        fit,
                        np.asarray([item["mapCenter"] for item in held_items], dtype=np.float64),
                        model,
                    )
                except (ValueError, np.linalg.LinAlgError) as error:
                    failures.append(f"{held_row}: {error}")
                    continue
                observed = np.asarray(
                    [item["metricPosition"] for item in held_items], dtype=np.float64
                )
                horizontal, vertical = error_values(predicted, observed)
                horizontal_errors.extend(horizontal)
                vertical_errors.extend(vertical)
                if held_row in edge_rows:
                    edge_horizontal_errors.extend(horizontal)
                    edge_vertical_errors.extend(vertical)
                    fit_points = np.asarray(
                        [item["mapCenter"] for item in fit_items], dtype=np.float64
                    )
                    held_points = np.asarray(
                        [item["mapCenter"] for item in held_items], dtype=np.float64
                    )
                    excess = bounds_excess(
                        held_points,
                        np.min(fit_points, axis=0),
                        np.max(fit_points, axis=0),
                    )
                    edge_u_excess.extend(excess[:, 0].tolist())
                    edge_v_excess.extend(excess[:, 1].tolist())
                held_out_rows += 1
            for edge_pair, held_row in (
                (ordered_rows[:2], ordered_rows[0] if ordered_rows else None),
                (ordered_rows[-2:], ordered_rows[-1] if ordered_rows else None),
            ):
                if held_row is None or len(edge_pair) < 2:
                    continue
                excluded_rows = set(edge_pair)
                fit_items = [
                    item for item in training if item["rowId"] not in excluded_rows
                ]
                held_items = training_rows[held_row]
                fit_row_count = len({item["rowId"] for item in fit_items})
                if fit_row_count < 4 or len(fit_items) < feature_count * 2:
                    continue
                try:
                    fit_points = np.asarray(
                        [item["mapCenter"] for item in fit_items], dtype=np.float64
                    )
                    fit = fit_model(
                        fit_points,
                        np.asarray(
                            [item["metricPosition"] for item in fit_items], dtype=np.float64
                        ),
                        model,
                    )
                    held_points = np.asarray(
                        [item["mapCenter"] for item in held_items], dtype=np.float64
                    )
                    predicted = predict_model(fit, held_points, model)
                except (ValueError, np.linalg.LinAlgError) as error:
                    failures.append(f"two-step {held_row}: {error}")
                    continue
                observed = np.asarray(
                    [item["metricPosition"] for item in held_items], dtype=np.float64
                )
                horizontal, vertical = error_values(predicted, observed)
                two_step_edge_horizontal_errors.extend(horizontal)
                two_step_edge_vertical_errors.extend(vertical)
                excess = bounds_excess(
                    held_points,
                    np.min(fit_points, axis=0),
                    np.max(fit_points, axis=0),
                )
                two_step_edge_u_excess.extend(excess[:, 0].tolist())
                two_step_edge_v_excess.extend(excess[:, 1].tolist())
            horizontal_summary = quantiles(horizontal_errors)
            vertical_summary = quantiles(vertical_errors)
            edge_horizontal_summary = quantiles(edge_horizontal_errors)
            edge_vertical_summary = quantiles(edge_vertical_errors)
            edge_u_excess_summary = quantiles(edge_u_excess)
            edge_v_excess_summary = quantiles(edge_v_excess)
            two_step_edge_horizontal_summary = quantiles(two_step_edge_horizontal_errors)
            two_step_edge_vertical_summary = quantiles(two_step_edge_vertical_errors)
            two_step_edge_u_excess_summary = quantiles(two_step_edge_u_excess)
            two_step_edge_v_excess_summary = quantiles(two_step_edge_v_excess)
            qualifies = (
                len(horizontal_errors) >= args.minimum_holdout_anchors
                and len(edge_horizontal_errors) >= args.minimum_edge_holdout_anchors
                and horizontal_summary["p95"] is not None
                and horizontal_summary["p95"] <= args.horizontal_threshold_ft
                and vertical_summary["p95"] is not None
                and vertical_summary["p95"] <= args.vertical_threshold_ft
                and edge_horizontal_summary["p95"] is not None
                and edge_horizontal_summary["p95"] <= args.horizontal_threshold_ft
                and edge_vertical_summary["p95"] is not None
                and edge_vertical_summary["p95"] <= args.vertical_threshold_ft
                and len(two_step_edge_horizontal_errors) >= args.minimum_edge_holdout_anchors
                and two_step_edge_horizontal_summary["p95"] is not None
                and two_step_edge_horizontal_summary["p95"] <= args.horizontal_threshold_ft
                and two_step_edge_vertical_summary["p95"] is not None
                and two_step_edge_vertical_summary["p95"] <= args.vertical_threshold_ft
            )
            model_results.append({
                "model": model,
                "trainingAnchorCount": len(training),
                "trainingRowCount": len(training_rows),
                "heldOutRowCount": held_out_rows,
                "holdoutAnchorCount": len(horizontal_errors),
                "edgeHoldoutRows": sorted(edge_rows),
                "edgeHoldoutAnchorCount": len(edge_horizontal_errors),
                "horizontalErrorFt": horizontal_summary,
                "verticalErrorFt": vertical_summary,
                "edgeHorizontalErrorFt": edge_horizontal_summary,
                "edgeVerticalErrorFt": edge_vertical_summary,
                "edgeExtrapolationEnvelopeMapUnits": {
                    "u": edge_u_excess_summary,
                    "v": edge_v_excess_summary,
                },
                "twoStepEdgeProtocol": {
                    "description": (
                        "Exclude the two outermost training rows at each side, then "
                        "predict the outer row from the remaining interior rows."
                    ),
                    "holdoutAnchorCount": len(two_step_edge_horizontal_errors),
                    "horizontalErrorFt": two_step_edge_horizontal_summary,
                    "verticalErrorFt": two_step_edge_vertical_summary,
                    "extrapolationEnvelopeMapUnits": {
                        "u": two_step_edge_u_excess_summary,
                        "v": two_step_edge_v_excess_summary,
                    },
                },
                "fitFailures": failures,
                "qualifies": qualifies,
            })
            model_raw_diagnostics[model] = {
                "edgeHorizontalErrors": edge_horizontal_errors,
                "edgeVerticalErrors": edge_vertical_errors,
                "twoStepEdgeHorizontalErrors": two_step_edge_horizontal_errors,
                "twoStepEdgeVerticalErrors": two_step_edge_vertical_errors,
            }

        qualified_models = [result for result in model_results if result["qualifies"]]
        qualified_models.sort(key=lambda result: (
            max(result["horizontalErrorFt"]["p95"], result["verticalErrorFt"]["p95"]),
            0 if result["model"] == "affine" else 1,
        ))
        selected_model = qualified_models[0]["model"] if qualified_models else None
        selected_model_result = next(
            (result for result in model_results if result["model"] == selected_model), None
        )
        if selected_model:
            global_edge_horizontal_errors.extend(
                model_raw_diagnostics[selected_model]["twoStepEdgeHorizontalErrors"]
            )
            global_edge_vertical_errors.extend(
                model_raw_diagnostics[selected_model]["twoStepEdgeVerticalErrors"]
            )
        section_predictions = []
        if selected_model and training:
            fit = fit_model(
                np.asarray([item["mapCenter"] for item in training], dtype=np.float64),
                np.asarray([item["metricPosition"] for item in training], dtype=np.float64),
                selected_model,
            )
            minimum = np.min(
                np.asarray([item["mapCenter"] for item in training], dtype=np.float64), axis=0
            )
            maximum = np.max(
                np.asarray([item["mapCenter"] for item in training], dtype=np.float64), axis=0
            )
            for item in missing:
                if item["mapCenter"] is None:
                    section_predictions.append({**item, "eligible": False, "reason": "MAP_SEAT_MISSING"})
                    continue
                point = np.asarray([item["mapCenter"]], dtype=np.float64)
                excess = bounds_excess(point, minimum, maximum)[0]
                extrapolated_axes = [axis for axis in range(2) if excess[axis] > 0]
                envelope = selected_model_result["twoStepEdgeProtocol"][
                    "extrapolationEnvelopeMapUnits"
                ]
                within_edge_envelope = (
                    len(extrapolated_axes) == 1
                    and all(
                        excess[axis] <= envelope["u" if axis == 0 else "v"]["p95"]
                        for axis in extrapolated_axes
                    )
                )
                predicted = predict_model(fit, point, selected_model)[0]
                prediction = {
                    **item,
                    "model": selected_model,
                    "predictedMetricPosition": [round_number(value) for value in predicted],
                    "extrapolatedAxes": ["u" if axis == 0 else "v" for axis in extrapolated_axes],
                    "extrapolationDistanceMapUnits": {
                        "u": round_number(excess[0]),
                        "v": round_number(excess[1]),
                    },
                    "withinSectionEdgeEnvelope": within_edge_envelope,
                    "eligible": False,
                    "reason": None if within_edge_envelope else "OUTSIDE_VALIDATED_EDGE_ENVELOPE",
                }
                section_predictions.append(prediction)
        section_results.append({
            "sectionId": section_id,
            "missingAnchorCount": len(missing),
            "trainingAnchorCount": len(training),
            "trainingRowCount": len(training_rows),
            "modelResults": model_results,
            "selectedModel": selected_model,
            "predictions": section_predictions,
        })

    global_edge_horizontal_summary = quantiles(global_edge_horizontal_errors)
    global_edge_vertical_summary = quantiles(global_edge_vertical_errors)
    pooled_edge_gate_passes = (
        len(global_edge_horizontal_errors) >= args.minimum_holdout_anchors
        and global_edge_horizontal_summary["p95"] is not None
        and global_edge_horizontal_summary["p95"] <= args.horizontal_threshold_ft
        and global_edge_vertical_summary["p95"] is not None
        and global_edge_vertical_summary["p95"] <= args.vertical_threshold_ft
    )
    candidate_predictions: list[dict[str, Any]] = []
    for section in section_results:
        for prediction in section["predictions"]:
            prediction["eligible"] = bool(
                prediction.get("withinSectionEdgeEnvelope") and pooled_edge_gate_passes
            )
            if prediction["eligible"]:
                prediction["reason"] = None
            elif prediction.get("withinSectionEdgeEnvelope"):
                prediction["reason"] = "POOLED_EDGE_HOLDOUT_GATE_FAILED"
            candidate_predictions.append({"sectionId": section["sectionId"], **prediction})
    eligible_predictions = [item for item in candidate_predictions if item["eligible"]]
    fingerprint_input = {
        "analysisVersion": ANALYSIS_VERSION,
        "mapArtifactVersion": map_artifact["artifactVersion"],
        "metricArtifactVersion": metric_artifact["artifactVersion"],
        "thresholds": {
            "horizontalFt": args.horizontal_threshold_ft,
            "verticalFt": args.vertical_threshold_ft,
            "minimumHoldoutAnchors": args.minimum_holdout_anchors,
            "minimumEdgeHoldoutAnchors": args.minimum_edge_holdout_anchors,
        },
        "sectionResults": section_results,
        "pooledTwoStepEdgeCalibration": {
            "anchorCount": len(global_edge_horizontal_errors),
            "horizontalErrorFt": global_edge_horizontal_summary,
            "verticalErrorFt": global_edge_vertical_summary,
            "passes": pooled_edge_gate_passes,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "venue-map-metric-recovery-audit",
        "artifactVersion": f"sha256:{fingerprint(fingerprint_input)}",
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": map_artifact["stadiumId"],
        "inputs": {
            "mapRows": {
                "path": str(args.map_rows),
                "sha256": sha256(args.map_rows),
                "artifactVersion": map_artifact["artifactVersion"],
            },
            "metricRows": {
                "path": str(args.metric_rows),
                "sha256": sha256(args.metric_rows),
                "artifactVersion": metric_artifact["artifactVersion"],
            },
        },
        "thresholds": fingerprint_input["thresholds"],
        "pooledTwoStepEdgeCalibration": fingerprint_input["pooledTwoStepEdgeCalibration"],
        "summary": {
            "missingAnchorCount": missing_anchor_count,
            "sectionCountWithMissingAnchors": len(missing_by_section),
            "sectionCountWithQualifiedLocalModel": sum(
                result["selectedModel"] is not None for result in section_results
            ),
            "candidatePredictionCount": len(candidate_predictions),
            "validatedEdgeEnvelopePredictionCount": len(eligible_predictions),
            "remainingUnrecoveredAnchorCount": missing_anchor_count - len(eligible_predictions),
        },
        "sections": section_results,
        "publication": {
            "eligible": False,
            "blockers": (
                ["RECOVERY_AUDIT_DOES_NOT_PROMOTE_GEOMETRY"]
                if missing_anchor_count == 0
                else [
                    "RECOVERED_ANCHORS_NOT_PROMOTED",
                    "CROSS_SECTION_RECOVERY_NOT_IMPLEMENTED",
                    "MISSING_METRIC_ANCHORS_REMAIN",
                    "SOURCE_FRAME_NOT_GEOREFERENCED",
                    "OBSTRUCTION_GEOMETRY_NOT_INCLUDED",
                    "SHADOW_HOLDOUT_NOT_PASSED",
                ]
            ),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "stadiumId": artifact["stadiumId"],
        "summary": artifact["summary"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
