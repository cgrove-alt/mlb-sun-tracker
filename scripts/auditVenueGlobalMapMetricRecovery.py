#!/usr/bin/env python3
"""Audit whole-section recovery from current provider map and metric artifacts.

The provider's blockmap locates each section in a shared 2D venue frame while
each section manifest supplies detailed local seat centers. This audit tests
whether polynomial mappings of those four coordinates can recover metric seat
anchors when an entire real section is withheld. Predictions are evidence only
and are never promoted by this script.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from itertools import combinations_with_replacement
from pathlib import Path
from typing import Any

import numpy as np


ANALYSIS_VERSION = "venue-global-map-metric-recovery-audit-v1"
METRES_TO_FEET = 3.280839895013123


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("map_rows", type=Path)
    parser.add_argument("metric_rows", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--horizontal-threshold-ft", type=float, default=1.0)
    parser.add_argument("--vertical-threshold-ft", type=float, default=1.0)
    parser.add_argument("--minimum-holdout-anchors", type=int, default=30)
    parser.add_argument("--minimum-holdout-sections", type=int, default=30)
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


def polynomial_terms(variable_count: int, degree: int) -> list[tuple[int, ...]]:
    terms: list[tuple[int, ...]] = [()]
    for term_degree in range(1, degree + 1):
        terms.extend(combinations_with_replacement(range(variable_count), term_degree))
    return terms


def feature_matrix(points: np.ndarray, terms: list[tuple[int, ...]]) -> np.ndarray:
    columns = []
    for term in terms:
        if not term:
            columns.append(np.ones(points.shape[0], dtype=np.float64))
            continue
        column = np.ones(points.shape[0], dtype=np.float64)
        for variable in term:
            column *= points[:, variable]
        columns.append(column)
    return np.column_stack(columns)


def error_values(predicted: np.ndarray, observed: np.ndarray) -> tuple[list[float], list[float]]:
    horizontal = np.sqrt(
        np.square(predicted[:, 0] - observed[:, 0])
        + np.square(predicted[:, 2] - observed[:, 2])
    ) * METRES_TO_FEET
    vertical = np.abs(predicted[:, 1] - observed[:, 1]) * METRES_TO_FEET
    return horizontal.tolist(), vertical.tolist()


def section_descriptor(section: dict[str, Any]) -> dict[str, Any] | None:
    boundary = section.get("blockmapGeometry", {}).get("sampledBoundary")
    node = section.get("sectionNode")
    if not boundary or not node or not node.get("c") or not node.get("hs"):
        return None
    half_size = np.asarray(node["hs"], dtype=np.float64)
    if np.any(half_size <= 0):
        return None
    block_center = np.mean(np.asarray(boundary, dtype=np.float64), axis=0)
    return {
        "blockCenter": block_center,
        "localCenter": np.asarray(node["c"], dtype=np.float64),
        "localHalfSize": half_size,
    }


def main() -> None:
    args = parse_args()
    map_artifact = json.loads(args.map_rows.read_text(encoding="utf-8"))
    metric_artifact = json.loads(args.metric_rows.read_text(encoding="utf-8"))
    if map_artifact.get("artifactKind") != "current-venue-map-row-geometry":
        raise ValueError("map input is not current-venue-map-row-geometry")
    if metric_artifact.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("metric input is not venue-local-metric-row-anchors")
    if map_artifact.get("stadiumId") != metric_artifact.get("stadiumId"):
        raise ValueError("stadium mismatch")

    descriptors = {
        section["sectionId"]: descriptor
        for section in map_artifact["sections"]
        if (descriptor := section_descriptor(section)) is not None
    }
    block_centers = np.asarray(
        [descriptor["blockCenter"] for descriptor in descriptors.values()], dtype=np.float64
    )
    block_center = np.mean(block_centers, axis=0)
    block_scale = np.std(block_centers, axis=0)
    block_scale[block_scale < 1e-9] = 1.0

    map_seats: dict[str, dict[str, Any]] = {}
    for section in map_artifact["sections"]:
        descriptor = descriptors.get(section["sectionId"])
        if descriptor is None:
            continue
        normalized_block = (descriptor["blockCenter"] - block_center) / block_scale
        for row in section["rows"]:
            for seat in row["seats"]:
                normalized_local = (
                    np.asarray(seat["center"], dtype=np.float64)
                    - descriptor["localCenter"]
                ) / descriptor["localHalfSize"]
                map_seats[seat["id"]] = {
                    "sectionId": section["sectionId"],
                    "rowId": row["rowId"],
                    "coordinates": np.concatenate((normalized_block, normalized_local)),
                }

    training_by_section: dict[str, list[dict[str, Any]]] = defaultdict(list)
    missing_by_section: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in metric_artifact["rows"]:
        for anchor in row.get("anchors", []):
            seat = map_seats.get(anchor["seatId"])
            if seat:
                training_by_section[row["sectionId"]].append({
                    "seatId": anchor["seatId"],
                    "coordinates": seat["coordinates"],
                    "metricPosition": anchor["position"],
                })
        for seat_id in row.get("missingAnchorSeatIds", []):
            seat = map_seats.get(seat_id)
            missing_by_section[row["sectionId"]].append({
                "rowKey": row["rowKey"],
                "rowId": row["rowId"],
                "seatId": seat_id,
                "coordinates": seat["coordinates"] if seat else None,
            })

    known_sections = sorted(training_by_section)
    all_coordinates = np.asarray([
        item["coordinates"]
        for section_id in known_sections
        for item in training_by_section[section_id]
    ], dtype=np.float64)
    all_targets = np.asarray([
        item["metricPosition"]
        for section_id in known_sections
        for item in training_by_section[section_id]
    ], dtype=np.float64)
    all_section_ids = np.asarray([
        section_id
        for section_id in known_sections
        for _ in training_by_section[section_id]
    ], dtype=object)
    if not np.all(np.isfinite(all_coordinates)) or not np.all(np.isfinite(all_targets)):
        raise ValueError("non-finite training coordinate or target")
    coordinate_minimum = np.min(all_coordinates, axis=0)
    coordinate_maximum = np.max(all_coordinates, axis=0)

    model_results = []
    candidate_models: dict[str, dict[str, Any]] = {}
    for degree in (() if not missing_by_section else (1, 2, 3)):
        terms = polynomial_terms(4, degree)
        design = feature_matrix(all_coordinates, terms)
        section_holdouts = []
        horizontal_errors: list[float] = []
        vertical_errors: list[float] = []
        for section_id in known_sections:
            held_coordinates = np.asarray(
                [item["coordinates"] for item in training_by_section[section_id]],
                dtype=np.float64,
            )
            held_targets = np.asarray(
                [item["metricPosition"] for item in training_by_section[section_id]],
                dtype=np.float64,
            )
            held_design = feature_matrix(held_coordinates, terms)
            fit_mask = all_section_ids != section_id
            coefficients, _, rank, _ = np.linalg.lstsq(
                design[fit_mask], all_targets[fit_mask], rcond=None
            )
            if rank < len(terms):
                section_holdouts.append({
                    "sectionId": section_id,
                    "anchorCount": len(held_targets),
                    "status": "RANK_DEFICIENT",
                })
                continue
            predicted = held_design @ coefficients
            horizontal, vertical = error_values(predicted, held_targets)
            horizontal_errors.extend(horizontal)
            vertical_errors.extend(vertical)
            section_holdouts.append({
                "sectionId": section_id,
                "anchorCount": len(held_targets),
                "status": "EVALUATED",
                "horizontalErrorFt": quantiles(horizontal),
                "verticalErrorFt": quantiles(vertical),
            })
        horizontal_summary = quantiles(horizontal_errors)
        vertical_summary = quantiles(vertical_errors)
        evaluated_sections = sum(
            holdout["status"] == "EVALUATED" for holdout in section_holdouts
        )
        qualifies = (
            len(horizontal_errors) >= args.minimum_holdout_anchors
            and evaluated_sections >= args.minimum_holdout_sections
            and horizontal_summary["p95"] is not None
            and horizontal_summary["p95"] <= args.horizontal_threshold_ft
            and vertical_summary["p95"] is not None
            and vertical_summary["p95"] <= args.vertical_threshold_ft
        )
        model_name = f"polynomial-degree-{degree}"
        result = {
            "model": model_name,
            "degree": degree,
            "featureCount": len(terms),
            "trainingSectionCount": len(known_sections),
            "trainingAnchorCount": len(all_targets),
            "holdoutSectionCount": evaluated_sections,
            "holdoutAnchorCount": len(horizontal_errors),
            "horizontalErrorFt": horizontal_summary,
            "verticalErrorFt": vertical_summary,
            "sectionHoldouts": section_holdouts,
            "qualifies": qualifies,
        }
        model_results.append(result)
        if qualifies:
            coefficients, _, rank, _ = np.linalg.lstsq(design, all_targets, rcond=None)
            if rank == len(terms):
                candidate_models[model_name] = {
                    "kind": "global",
                    "terms": terms,
                    "coefficients": coefficients,
                    "result": result,
                }

    section_block_coordinates = {
        section_id: training_by_section[section_id][0]["coordinates"][:2]
        for section_id in known_sections
    }
    for neighbor_count in (() if not missing_by_section else (4, 8, 12, 20)):
        for degree in (1, 2):
            terms = polynomial_terms(4, degree)
            section_holdouts = []
            horizontal_errors: list[float] = []
            vertical_errors: list[float] = []
            for section_id in known_sections:
                query_block = section_block_coordinates[section_id]
                neighbors = sorted(
                    (candidate for candidate in known_sections if candidate != section_id),
                    key=lambda candidate: float(np.linalg.norm(
                        section_block_coordinates[candidate] - query_block
                    )),
                )[:neighbor_count]
                fit_coordinates = np.asarray([
                    item["coordinates"]
                    for neighbor in neighbors
                    for item in training_by_section[neighbor]
                ], dtype=np.float64)
                fit_targets = np.asarray([
                    item["metricPosition"]
                    for neighbor in neighbors
                    for item in training_by_section[neighbor]
                ], dtype=np.float64)
                fit_design = feature_matrix(fit_coordinates, terms)
                coefficients, _, rank, _ = np.linalg.lstsq(
                    fit_design, fit_targets, rcond=None
                )
                held_coordinates = np.asarray(
                    [item["coordinates"] for item in training_by_section[section_id]],
                    dtype=np.float64,
                )
                held_targets = np.asarray(
                    [item["metricPosition"] for item in training_by_section[section_id]],
                    dtype=np.float64,
                )
                if rank < len(terms):
                    section_holdouts.append({
                        "sectionId": section_id,
                        "anchorCount": len(held_targets),
                        "neighborSectionIds": neighbors,
                        "status": "RANK_DEFICIENT",
                    })
                    continue
                predicted = feature_matrix(held_coordinates, terms) @ coefficients
                horizontal, vertical = error_values(predicted, held_targets)
                horizontal_errors.extend(horizontal)
                vertical_errors.extend(vertical)
                section_holdouts.append({
                    "sectionId": section_id,
                    "anchorCount": len(held_targets),
                    "neighborSectionIds": neighbors,
                    "status": "EVALUATED",
                    "horizontalErrorFt": quantiles(horizontal),
                    "verticalErrorFt": quantiles(vertical),
                })
            horizontal_summary = quantiles(horizontal_errors)
            vertical_summary = quantiles(vertical_errors)
            evaluated_sections = sum(
                holdout["status"] == "EVALUATED" for holdout in section_holdouts
            )
            qualifies = (
                len(horizontal_errors) >= args.minimum_holdout_anchors
                and evaluated_sections >= args.minimum_holdout_sections
                and horizontal_summary["p95"] is not None
                and horizontal_summary["p95"] <= args.horizontal_threshold_ft
                and vertical_summary["p95"] is not None
                and vertical_summary["p95"] <= args.vertical_threshold_ft
            )
            model_name = f"nearest-{neighbor_count}-polynomial-degree-{degree}"
            result = {
                "model": model_name,
                "modelKind": "nearest-sections",
                "degree": degree,
                "featureCount": len(terms),
                "neighborSectionCount": neighbor_count,
                "trainingSectionCount": len(known_sections),
                "trainingAnchorCount": len(all_targets),
                "holdoutSectionCount": evaluated_sections,
                "holdoutAnchorCount": len(horizontal_errors),
                "horizontalErrorFt": horizontal_summary,
                "verticalErrorFt": vertical_summary,
                "sectionHoldouts": section_holdouts,
                "qualifies": qualifies,
            }
            model_results.append(result)
            if qualifies:
                candidate_models[model_name] = {
                    "kind": "nearest-sections",
                    "terms": terms,
                    "neighborSectionCount": neighbor_count,
                    "result": result,
                }

    qualified_results = [result for result in model_results if result["qualifies"]]
    qualified_results.sort(key=lambda result: (
        max(result["horizontalErrorFt"]["p95"], result["verticalErrorFt"]["p95"]),
        result["degree"],
    ))
    selected_model = qualified_results[0]["model"] if qualified_results else None
    predictions = []
    if selected_model:
        candidate = candidate_models[selected_model]
        for section_id in sorted(missing_by_section):
            fit_coordinates = all_coordinates
            fit_targets = all_targets
            coefficients = candidate.get("coefficients")
            if candidate["kind"] == "nearest-sections":
                descriptor = descriptors.get(section_id)
                if descriptor is None:
                    continue
                query_block = (descriptor["blockCenter"] - block_center) / block_scale
                neighbors = sorted(
                    known_sections,
                    key=lambda known: float(np.linalg.norm(
                        section_block_coordinates[known] - query_block
                    )),
                )[:candidate["neighborSectionCount"]]
                fit_coordinates = np.asarray([
                    item["coordinates"]
                    for neighbor in neighbors
                    for item in training_by_section[neighbor]
                ], dtype=np.float64)
                fit_targets = np.asarray([
                    item["metricPosition"]
                    for neighbor in neighbors
                    for item in training_by_section[neighbor]
                ], dtype=np.float64)
                coefficients, _, rank, _ = np.linalg.lstsq(
                    feature_matrix(fit_coordinates, candidate["terms"]),
                    fit_targets,
                    rcond=None,
                )
                if rank < len(candidate["terms"]):
                    continue
            for item in missing_by_section[section_id]:
                if item["coordinates"] is None:
                    predictions.append({
                        **item,
                        "sectionId": section_id,
                        "eligible": False,
                        "reason": "MAP_SEAT_MISSING",
                    })
                    continue
                coordinates = np.asarray([item["coordinates"]], dtype=np.float64)
                outside_axes = [
                    axis for axis in range(4)
                    if coordinates[0, axis] < np.min(fit_coordinates, axis=0)[axis]
                    or coordinates[0, axis] > np.max(fit_coordinates, axis=0)[axis]
                ]
                predicted = feature_matrix(coordinates, candidate["terms"]) @ coefficients
                predictions.append({
                    **item,
                    "coordinates": [round_number(value) for value in item["coordinates"]],
                    "sectionId": section_id,
                    "model": selected_model,
                    "predictedMetricPosition": [round_number(value) for value in predicted[0]],
                    "outsideTrainingAxes": outside_axes,
                    "eligible": len(outside_axes) == 0,
                    "reason": None if not outside_axes else "OUTSIDE_GLOBAL_TRAINING_BOUNDS",
                })

    eligible_predictions = [prediction for prediction in predictions if prediction["eligible"]]
    missing_anchor_count = sum(len(items) for items in missing_by_section.values())
    fingerprint_input = {
        "analysisVersion": ANALYSIS_VERSION,
        "mapArtifactVersion": map_artifact["artifactVersion"],
        "metricArtifactVersion": metric_artifact["artifactVersion"],
        "thresholds": {
            "horizontalFt": args.horizontal_threshold_ft,
            "verticalFt": args.vertical_threshold_ft,
            "minimumHoldoutAnchors": args.minimum_holdout_anchors,
            "minimumHoldoutSections": args.minimum_holdout_sections,
        },
        "normalization": {
            "blockCenter": [round_number(value) for value in block_center],
            "blockScale": [round_number(value) for value in block_scale],
        },
        "modelResults": model_results,
        "selectedModel": selected_model,
        "predictions": predictions,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "venue-global-map-metric-recovery-audit",
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
        "normalization": fingerprint_input["normalization"],
        "modelResults": model_results,
        "selectedModel": selected_model,
        "predictions": predictions,
        "summary": {
            "missingAnchorCount": missing_anchor_count,
            "missingSectionCount": len(missing_by_section),
            "qualifiedModelCount": len(qualified_results),
            "candidatePredictionCount": len(predictions),
            "eligiblePredictionCount": len(eligible_predictions),
            "remainingUnrecoveredAnchorCount": missing_anchor_count - len(eligible_predictions),
        },
        "publication": {
            "eligible": False,
            "blockers": (
                ["RECOVERY_AUDIT_DOES_NOT_PROMOTE_GEOMETRY"]
                if missing_anchor_count == 0
                else [
                    "RECOVERED_ANCHORS_NOT_PROMOTED",
                    "METRIC_SOURCE_FRAME_NOT_GEOREFERENCED",
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
        "summary": artifact["summary"],
        "models": [{
            "model": result["model"],
            "holdoutSections": result["holdoutSectionCount"],
            "holdoutAnchors": result["holdoutAnchorCount"],
            "horizontalP95Ft": result["horizontalErrorFt"]["p95"],
            "verticalP95Ft": result["verticalErrorFt"]["p95"],
            "qualifies": result["qualifies"],
        } for result in model_results],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
