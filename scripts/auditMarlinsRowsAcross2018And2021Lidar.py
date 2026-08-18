#!/usr/bin/env python3
"""Cross-check orthophoto-localized Marlins rows in 2018 and 2021 LiDAR.

The audit is deliberately narrow. It evaluates only rows whose provider path
was localized to a blue physical-seat band with a deterministic along-row
holdout. The 2021 LiDAR coordinates are mapped into the certified 2018 frame
with the locked hard-structure transform. A row remains a candidate unless
every provider anchor has a repeatable 2018 surface and a matching 2021
surface near the training-only camera-to-surface offset.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import laspy
import numpy as np
from pyproj import CRS, Transformer
from scipy.spatial import cKDTree


FEET_PER_METRE = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    payload = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(payload).hexdigest()}"


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_bytes())


def percentile(values: list[float], amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values else None


def vertical_clusters(
    values_feet: np.ndarray,
    maximum_gap_feet: float,
    minimum_points: int,
) -> list[dict[str, Any]]:
    if values_feet.size == 0:
        return []
    ordered = np.sort(values_feet.astype(np.float64))
    boundaries = np.flatnonzero(np.diff(ordered) > maximum_gap_feet) + 1
    result = []
    for values in np.split(ordered, boundaries):
        if values.size < minimum_points:
            continue
        result.append({
            "medianElevationFeet": float(np.median(values)),
            "pointCount": int(values.size),
            "spanFeet": float(values[-1] - values[0]),
        })
    return result


def repeatable_reference_candidates(
    by_source: dict[int, list[dict[str, Any]]],
    maximum_disagreement_feet: float,
) -> list[dict[str, Any]]:
    seeds = [
        cluster["medianElevationFeet"]
        for clusters in by_source.values()
        for cluster in clusters
    ]
    candidates = []
    seen: set[tuple[int, ...]] = set()
    for seed in seeds:
        selected = []
        for source_id, clusters in sorted(by_source.items()):
            if not clusters:
                continue
            closest = min(
                clusters,
                key=lambda item: abs(item["medianElevationFeet"] - seed),
            )
            if abs(closest["medianElevationFeet"] - seed) <= maximum_disagreement_feet:
                selected.append((source_id, closest))
        if len(selected) < 2:
            continue
        elevations = [item[1]["medianElevationFeet"] for item in selected]
        disagreement = max(elevations) - min(elevations)
        if disagreement > maximum_disagreement_feet:
            continue
        key = tuple(
            value
            for source_id, cluster in selected
            for value in (source_id, round(cluster["medianElevationFeet"] * 1000))
        )
        if key in seen:
            continue
        seen.add(key)
        candidates.append({
            "medianElevationFeet": float(np.median(elevations)),
            "sourceIds": [source_id for source_id, _ in selected],
            "sourceCount": len(selected),
            "crossSourceDisagreementFeet": float(disagreement),
            "pointCount": int(sum(cluster["pointCount"] for _, cluster in selected)),
        })
    return sorted(candidates, key=lambda item: item["medianElevationFeet"])


def horizontal_crs(source_crs: CRS) -> CRS:
    return CRS.from_user_input(
        source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
    )


def linear_unit_to_metres(crs: CRS) -> float:
    if not crs.axis_info:
        raise ValueError("LiDAR CRS lacks linear-unit metadata")
    factor = float(crs.axis_info[0].unit_conversion_factor or math.nan)
    if not math.isfinite(factor) or factor <= 0:
        raise ValueError("LiDAR CRS has an invalid linear unit")
    return factor


def load_points_by_source(
    path: Path,
    accepted_classifications: list[int],
    minimum_xy_metres: np.ndarray,
    maximum_xy_metres: np.ndarray,
) -> tuple[CRS, dict[int, np.ndarray]]:
    parts: dict[int, list[np.ndarray]] = {}
    with laspy.open(path) as reader:
        embedded = reader.header.parse_crs()
        if embedded is None:
            raise ValueError(f"LiDAR has no embedded CRS: {path}")
        source_crs = CRS.from_user_input(embedded)
        horizontal = horizontal_crs(source_crs)
        horizontal_factor = linear_unit_to_metres(horizontal)
        if source_crs.is_compound and len(source_crs.sub_crs_list) > 1:
            vertical_factor = linear_unit_to_metres(
                CRS.from_user_input(source_crs.sub_crs_list[1])
            )
        elif len(source_crs.axis_info) >= 3:
            vertical_factor = float(source_crs.axis_info[2].unit_conversion_factor)
        else:
            vertical_factor = horizontal_factor
        for points in reader.chunk_iterator(2_000_000):
            x_metres = np.asarray(points.x) * horizontal_factor
            y_metres = np.asarray(points.y) * horizontal_factor
            classifications = np.asarray(points.classification)
            selected = (
                (x_metres >= minimum_xy_metres[0])
                & (x_metres <= maximum_xy_metres[0])
                & (y_metres >= minimum_xy_metres[1])
                & (y_metres <= maximum_xy_metres[1])
                & np.isin(classifications, accepted_classifications)
            )
            if not selected.any():
                continue
            z_feet = np.asarray(points.z) * vertical_factor * FEET_PER_METRE
            sources = np.asarray(points.point_source_id)
            for source_id in np.unique(sources[selected]):
                source_id_int = int(source_id)
                current = selected & (sources == source_id)
                parts.setdefault(source_id_int, []).append(
                    np.column_stack((
                        x_metres[current],
                        y_metres[current],
                        z_feet[current],
                    ))
                )
    return horizontal, {
        source_id: np.vstack(source_parts)
        for source_id, source_parts in parts.items()
        if source_parts
    }


def corrected_row_anchor_path(
    row: dict[str, Any], normal_offset_feet: float
) -> list[list[float]]:
    anchors = np.asarray(
        [anchor["projectedCoordinateUsSurveyFeet"] for anchor in row["anchors"]],
        dtype=float,
    )
    segments = np.diff(anchors, axis=0)
    lengths = np.linalg.norm(segments, axis=1)
    if (lengths <= 0).any():
        raise ValueError(f"Coincident provider anchors for {row['rowKey']}")
    directions = segments / lengths[:, None]
    tangents = []
    for index in range(anchors.shape[0]):
        if index == 0:
            tangent = directions[0]
        elif index == anchors.shape[0] - 1:
            tangent = directions[-1]
        else:
            tangent = directions[index - 1] + directions[index]
            tangent = tangent / np.linalg.norm(tangent)
        tangents.append(tangent)
    tangents_array = np.asarray(tangents)
    normals = np.column_stack((-tangents_array[:, 1], tangents_array[:, 0]))
    corrected = anchors + normal_offset_feet * normals
    return [[float(value) for value in point] for point in corrected]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--world-rows", type=Path, required=True)
    parser.add_argument("--orthophoto-audit", type=Path, required=True)
    parser.add_argument("--reference-row-audit", type=Path, required=True)
    parser.add_argument("--hard-registration", type=Path, required=True)
    parser.add_argument("--ground-frame-audit", type=Path, required=True)
    parser.add_argument("--reference-survey-review", type=Path, required=True)
    parser.add_argument("--comparison-survey-review", type=Path, required=True)
    parser.add_argument("--reference-lidar", type=Path, required=True)
    parser.add_argument("--comparison-lidar", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--accepted-classification", type=int, action="append")
    parser.add_argument("--horizontal-radius-feet", type=float, default=0.75)
    parser.add_argument("--cluster-gap-feet", type=float, default=0.5)
    parser.add_argument("--provider-surface-tolerance-feet", type=float, default=0.5)
    parser.add_argument("--maximum-cross-epoch-disagreement-feet", type=float, default=0.75)
    args = parser.parse_args()

    world = read_json(args.world_rows)
    orthophoto = read_json(args.orthophoto_audit)
    reference_audit = read_json(args.reference_row_audit)
    registration = read_json(args.hard_registration)
    ground_frame = read_json(args.ground_frame_audit)
    reference_review = read_json(args.reference_survey_review)
    comparison_review = read_json(args.comparison_survey_review)
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World-row artifact has the wrong kind")
    if orthophoto.get("artifactKind") != "multi-epoch-provider-row-orthophoto-visibility-audit":
        raise ValueError("Orthophoto audit has the wrong kind")
    if reference_audit.get("artifactKind") != "3ddv-open-roof-lidar-row-surface-audit":
        raise ValueError("Reference row-surface audit has the wrong kind")
    if registration.get("artifactKind") != "hard-structure-registered-2021-lidar-local-frame":
        raise ValueError("Hard-structure registration has the wrong kind")
    if not registration.get("assessment", {}).get("localHorizontalRegistrationMeasurementEligible"):
        raise ValueError("Hard-structure registration did not pass its measurement gate")
    if ground_frame.get("artifactKind") != "survey-qc-orthophoto-registration-audit":
        raise ValueError("Orthophoto ground-frame audit has the wrong kind")
    if not ground_frame.get("numericRegistrationAcceptance", {}).get("accepted"):
        raise ValueError("Orthophoto ground frame did not pass its numeric gate")
    if reference_review.get("artifactKind") != "lidar-survey-report-review":
        raise ValueError("Reference survey review has the wrong kind")
    if comparison_review.get("artifactKind") != "lidar-survey-report-review":
        raise ValueError("Comparison survey review has the wrong kind")
    if orthophoto["sources"]["registrationArtifactVersion"] != world["artifactVersion"]:
        raise ValueError("Orthophoto audit uses different world rows")
    if len(orthophoto["epochs"]) != 1 or orthophoto["epochs"][0]["source"]["year"] != 2021:
        raise ValueError("Orthophoto audit must be the single 2021 localization run")
    search_radius = float(orthophoto["method"]["parameters"]["searchRadiusFeet"])
    if search_radius > 0.5:
        raise ValueError("Orthophoto localization search radius exceeds 0.5 foot")
    if sha256_file(args.reference_lidar) != reference_review["source"]["tileSha256"]:
        raise ValueError("Reference LiDAR does not match its survey review")
    reference_lidar_sha256 = sha256_file(args.reference_lidar)
    comparison_lidar_sha256 = sha256_file(args.comparison_lidar)
    if comparison_lidar_sha256 != comparison_review["source"]["tileSha256"]:
        raise ValueError("Comparison LiDAR does not match its survey review")
    if reference_lidar_sha256 != reference_audit["inputs"]["lidarSha256"]:
        raise ValueError("Reference LiDAR does not match the row-surface audit")
    for input_key, review in (
        ("referenceSurveyReview", reference_review),
        ("comparisonSurveyReview", comparison_review),
    ):
        registration_review = registration["inputs"][input_key]
        if registration_review["artifactVersion"] != review["artifactVersion"]:
            raise ValueError(
                f"{input_key} does not match the hard-structure registration"
            )

    orthophoto_rows = {
        row["rowKey"]: row
        for row in orthophoto["epochs"][0]["rows"]
        if row.get("measurementCandidate")
    }
    world_rows = {
        row["rowKey"]: row
        for row in world["rows"]
        if row["rowKey"] in orthophoto_rows
    }
    anchors = []
    for row in world_rows.values():
        corrected_path = corrected_row_anchor_path(
            row, float(orthophoto_rows[row["rowKey"]]["control"]["offsetFeet"])
        )
        for anchor_index, (anchor, corrected_plan_feet) in enumerate(
            zip(row["anchors"], corrected_path)
        ):
            anchors.append({
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "anchorIndex": anchor_index,
                "seatId": anchor["seatId"],
                "providerPlanFeet": anchor["projectedCoordinateUsSurveyFeet"],
                "planFeet": corrected_plan_feet,
                "cameraElevationFeet": float(anchor["candidateCameraElevationNavd88Feet"]),
            })
    if not anchors:
        raise ValueError("No orthophoto-localized rows are available")

    with laspy.open(args.comparison_lidar) as reader:
        comparison_crs = reader.header.parse_crs()
    if comparison_crs is None:
        raise ValueError("Comparison LiDAR lacks a CRS")
    comparison_horizontal = horizontal_crs(CRS.from_user_input(comparison_crs))
    transformer = Transformer.from_crs(6438, comparison_horizontal, always_xy=True)
    plan_feet = np.asarray([anchor["planFeet"] for anchor in anchors], dtype=float)
    query_x, query_y = transformer.transform(plan_feet[:, 0], plan_feet[:, 1])
    comparison_queries = np.column_stack((query_x, query_y)) * linear_unit_to_metres(
        comparison_horizontal
    )
    rotation = np.asarray(registration["lockedTransform"]["rotationMatrix"], dtype=float)
    translation = np.asarray(registration["lockedTransform"]["translationMetres"], dtype=float)
    reference_queries = comparison_queries @ rotation.T + translation
    radius_metres = args.horizontal_radius_feet / FEET_PER_METRE
    all_queries = np.vstack((reference_queries, comparison_queries))
    minimum_xy = all_queries.min(axis=0) - radius_metres
    maximum_xy = all_queries.max(axis=0) + radius_metres
    classifications = sorted(set(args.accepted_classification or [1, 6]))

    reference_crs, reference_points = load_points_by_source(
        args.reference_lidar, classifications, minimum_xy, maximum_xy
    )
    comparison_crs_loaded, comparison_points = load_points_by_source(
        args.comparison_lidar, classifications, minimum_xy, maximum_xy
    )
    if reference_crs.to_epsg() != comparison_crs_loaded.to_epsg():
        raise ValueError("LiDAR horizontal coordinate systems do not match")
    if len(reference_points) < 2:
        raise ValueError("Reference LiDAR lacks two overlapping point sources")
    if not comparison_points:
        raise ValueError("Comparison LiDAR has no accepted points")
    reference_trees = {
        source_id: cKDTree(points[:, :2])
        for source_id, points in reference_points.items()
    }
    comparison_all = np.vstack(list(comparison_points.values()))
    comparison_tree = cKDTree(comparison_all[:, :2])

    camera_to_surface_offset = float(
        reference_audit["cameraToSurfaceOffsetFit"]["selectedOffsetFeet"]
    )
    reference_vertical_accuracy = float(
        reference_review["conservativeInterpretation"]["verticalAccuracy95Feet"]
    )
    comparison_vertical_accuracy = float(
        comparison_review["conservativeInterpretation"]["verticalAccuracy95Feet"]
    )
    ground_horizontal_accuracy = float(
        ground_frame["uncertainty"]["combinedAbsoluteHorizontalUncertainty95Feet"]
    )
    lidar_horizontal_accuracy = float(
        registration["uncertainty"]["combinedAbsoluteHorizontalUncertainty95Feet"]
    )
    combined_row_lidar_horizontal = math.hypot(
        ground_horizontal_accuracy, lidar_horizontal_accuracy
    )

    anchor_results = []
    by_row: dict[str, list[dict[str, Any]]] = {}
    for anchor, reference_query, comparison_query in zip(
        anchors, reference_queries, comparison_queries
    ):
        reference_clusters_by_source = {}
        for source_id, tree in reference_trees.items():
            indexes = tree.query_ball_point(reference_query, radius_metres)
            reference_clusters_by_source[source_id] = vertical_clusters(
                reference_points[source_id][indexes, 2],
                args.cluster_gap_feet,
                minimum_points=2,
            )
        reference_candidates = repeatable_reference_candidates(
            reference_clusters_by_source,
            args.maximum_cross_epoch_disagreement_feet,
        )
        comparison_indexes = comparison_tree.query_ball_point(
            comparison_query, radius_metres
        )
        comparison_candidates = vertical_clusters(
            comparison_all[comparison_indexes, 2],
            args.cluster_gap_feet,
            minimum_points=2,
        )
        expected = anchor["cameraElevationFeet"] - camera_to_surface_offset
        reference_near = [
            candidate
            for candidate in reference_candidates
            if abs(candidate["medianElevationFeet"] - expected)
            <= args.provider_surface_tolerance_feet
        ]
        comparison_near = [
            candidate
            for candidate in comparison_candidates
            if abs(candidate["medianElevationFeet"] - expected)
            <= args.provider_surface_tolerance_feet
        ]
        pairs = []
        for reference_candidate in reference_near:
            for comparison_candidate in comparison_near:
                disagreement = abs(
                    comparison_candidate["medianElevationFeet"]
                    - reference_candidate["medianElevationFeet"]
                )
                if disagreement <= args.maximum_cross_epoch_disagreement_feet:
                    combined_vertical_uncertainty = (
                        max(reference_vertical_accuracy, comparison_vertical_accuracy)
                        + disagreement
                    )
                    pairs.append({
                        "reference": reference_candidate,
                        "comparison": comparison_candidate,
                        "crossEpochDisagreementFeet": disagreement,
                        "combinedVerticalUncertainty95Feet": combined_vertical_uncertainty,
                        "withinOneFootVertical": combined_vertical_uncertainty <= 1.0,
                    })
        selected = None
        if pairs:
            selected = min(
                pairs,
                key=lambda pair: (
                    pair["crossEpochDisagreementFeet"],
                    abs(pair["reference"]["medianElevationFeet"] - expected)
                    + abs(pair["comparison"]["medianElevationFeet"] - expected),
                ),
            )
        result = {
            **anchor,
            "expectedReferenceSurfaceElevationFeet": expected,
            "referenceCandidateCount": len(reference_candidates),
            "comparisonCandidateCount": len(comparison_candidates),
            "referenceCandidates": reference_candidates,
            "comparisonCandidates": comparison_candidates,
            "referenceProviderWindowCandidateCount": len(reference_near),
            "comparisonProviderWindowCandidateCount": len(comparison_near),
            "selectedSurfacePair": selected,
        }
        anchor_results.append(result)
        by_row.setdefault(anchor["rowKey"], []).append(result)

    row_results = []
    for row_key, world_row in world_rows.items():
        ortho = orthophoto_rows[row_key]
        row_anchors = by_row[row_key]
        selected = [
            anchor["selectedSurfacePair"]
            for anchor in row_anchors
            if anchor["selectedSurfacePair"] is not None
        ]
        full_anchor_coverage = bool(
            row_anchors and len(selected) == len(row_anchors)
        )
        all_vertical_within_one_foot = bool(
            selected and all(pair["withinOneFootVertical"] for pair in selected)
        )
        orthophoto_residual = float(
            ortho["absoluteControlHoldoutOffsetResidualFeet"]
        )
        row_horizontal_uncertainty = ground_horizontal_accuracy + orthophoto_residual
        horizontal_eligible = row_horizontal_uncertainty <= 1.0
        metric_candidate = bool(
            full_anchor_coverage
            and all_vertical_within_one_foot
            and horizontal_eligible
            and combined_row_lidar_horizontal <= 1.0
        )
        corrected_path = corrected_row_anchor_path(
            world_row, float(ortho["control"]["offsetFeet"])
        )
        anchor_surfaces = []
        for anchor in row_anchors:
            selected_pair = anchor["selectedSurfacePair"]
            anchor_surfaces.append({
                "seatId": anchor["seatId"],
                "anchorIndex": anchor["anchorIndex"],
                "expectedReferenceSurfaceElevationFeet": anchor[
                    "expectedReferenceSurfaceElevationFeet"
                ],
                "referenceCandidateCount": anchor["referenceCandidateCount"],
                "comparisonCandidateCount": anchor["comparisonCandidateCount"],
                "referenceCandidates": anchor["referenceCandidates"],
                "comparisonCandidates": anchor["comparisonCandidates"],
                "referenceProviderWindowCandidateCount": anchor[
                    "referenceProviderWindowCandidateCount"
                ],
                "comparisonProviderWindowCandidateCount": anchor[
                    "comparisonProviderWindowCandidateCount"
                ],
                "surfaceElevationFeetNavd88": (
                    selected_pair["reference"]["medianElevationFeet"]
                    if selected_pair else None
                ),
                "selectedSurfacePair": selected_pair,
            })
        row_results.append({
            "rowKey": row_key,
            "sectionId": world_row["sectionId"],
            "rowId": world_row["rowId"],
            "publishedSeatCount": world_row["publishedSeatCount"],
            "orthophotoControlOffsetFeet": ortho["control"]["offsetFeet"],
            "orthophotoHoldoutOffsetFeet": ortho["holdout"]["offsetFeet"],
            "orthophotoControlHoldoutResidualFeet": orthophoto_residual,
            "correctedPlanAnchorPathEpsg6438UsSurveyFeet": corrected_path,
            "horizontalUncertainty95Feet": row_horizontal_uncertainty,
            "rowToLidarCombinedHorizontalUncertainty95Feet": combined_row_lidar_horizontal,
            "anchorCount": len(row_anchors),
            "matchedAnchorCount": len(selected),
            "matchedAnchorCoveragePercent": (
                len(selected) / len(row_anchors) * 100.0 if row_anchors else 0.0
            ),
            "maximumAnchorVerticalUncertainty95Feet": (
                max(pair["combinedVerticalUncertainty95Feet"] for pair in selected)
                if selected else None
            ),
            "anchorSurfaces": anchor_surfaces,
            "metricCandidate": metric_candidate,
            "publicationEligible": False,
            "blockers": [
                *([] if full_anchor_coverage else ["INCOMPLETE_LIDAR_ANCHOR_COVERAGE"]),
                *([] if all_vertical_within_one_foot else ["VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT"]),
                *([] if horizontal_eligible else ["ROW_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT"]),
                *([] if combined_row_lidar_horizontal <= 1.0 else ["ROW_TO_LIDAR_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT"]),
                "COMPARISON_LIDAR_CLOSED_ROOF_OCCLUDES_SEATING_BOWL",
                "SURFACE_SEMANTIC_ROLE_NOT_INDEPENDENTLY_PROVEN_AS_SEATING_TREAD",
                "CURRENT_ROW_PERSISTENCE_NOT_ESTABLISHED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        })

    metric_rows = [row for row in row_results if row["metricCandidate"]]
    comparison_surface_offsets = [
        candidate["medianElevationFeet"]
        - anchor["expectedReferenceSurfaceElevationFeet"]
        for anchor in anchor_results
        for candidate in anchor["comparisonCandidates"]
    ]
    comparison_provider_window_count = sum(
        anchor["comparisonProviderWindowCandidateCount"] for anchor in anchor_results
    )
    stable = {
        "inputs": {
            "worldRowsArtifactVersion": world["artifactVersion"],
            "orthophotoAuditArtifactVersion": orthophoto["artifactVersion"],
            "referenceRowAuditArtifactVersion": reference_audit["artifactVersion"],
            "hardRegistrationArtifactVersion": registration["artifactVersion"],
            "groundFrameArtifactVersion": ground_frame["artifactVersion"],
            "referenceSurveyReviewArtifactVersion": reference_review["artifactVersion"],
            "comparisonSurveyReviewArtifactVersion": comparison_review["artifactVersion"],
            "referenceLidarSha256": sha256_file(args.reference_lidar),
            "comparisonLidarSha256": sha256_file(args.comparison_lidar),
        },
        "parameters": {
            "acceptedClassifications": classifications,
            "horizontalRadiusFeet": args.horizontal_radius_feet,
            "clusterGapFeet": args.cluster_gap_feet,
            "providerSurfaceToleranceFeet": args.provider_surface_tolerance_feet,
            "maximumCrossEpochDisagreementFeet": args.maximum_cross_epoch_disagreement_feet,
        },
        "rows": row_results,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "orthophoto-identified-two-epoch-lidar-row-surface-audit",
        "artifactVersion": stable_sha256(stable),
        "stadiumId": "marlins",
        "sources": {
            **stable["inputs"],
            "worldRowsPath": str(args.world_rows),
            "orthophotoAuditPath": str(args.orthophoto_audit),
            "referenceLidarPath": str(args.reference_lidar),
            "comparisonLidarPath": str(args.comparison_lidar),
        },
        "method": {
            "description": (
                "Orthophoto-localized current provider rows queried in repeatable "
                "2018 LiDAR sources and locally registered 2021 LiDAR, with every "
                "provider anchor required for a row-level metric candidate"
            ),
            **stable["parameters"],
            "cameraToReferenceSurfaceOffsetFeet": camera_to_surface_offset,
            "horizontalCombinationRule": "root sum of squares for independent survey frames",
            "verticalCombinationRule": "larger project 95 percent vertical accuracy plus observed cross-epoch disagreement",
        },
        "uncertainty": {
            "orthophotoGroundFrameHorizontal95Feet": ground_horizontal_accuracy,
            "registeredLidarHorizontal95Feet": lidar_horizontal_accuracy,
            "combinedRowToLidarHorizontal95Feet": combined_row_lidar_horizontal,
            "referenceVertical95Feet": reference_vertical_accuracy,
            "comparisonVertical95Feet": comparison_vertical_accuracy,
        },
        "counts": {
            "orthophotoLocalizedRows": len(row_results),
            "rowsWithAnyMatchedAnchor": sum(row["matchedAnchorCount"] > 0 for row in row_results),
            "rowsWithFullAnchorCoverage": sum(
                row["anchorCount"] > 0 and row["matchedAnchorCount"] == row["anchorCount"]
                for row in row_results
            ),
            "metricCandidateRows": len(metric_rows),
        },
        "geometryBoundary": {
            "establishesOrthophotoIdentifiedPlanCandidates": True,
            "establishesTwoEpochVerticalSurfaceRepeatability": bool(metric_rows),
            "establishesSeatingTreadSemanticIdentity": False,
            "establishesCurrentPersistence": False,
            "establishesPublicationReadyRows": False,
        },
        "comparisonAcquisitionState": {
            "hardStructureRegistrationCallsSourceClosedRoof": bool(
                registration["assessment"].get("closedRoofTopSurfaceFrameEligible")
            ),
            "anchorCount": len(anchor_results),
            "anchorsWithComparisonCandidates": sum(
                bool(anchor["comparisonCandidates"]) for anchor in anchor_results
            ),
            "providerSurfaceWindowCandidateCount": comparison_provider_window_count,
            "minimumCandidateElevationAboveExpectedSeatSurfaceFeet": (
                min(comparison_surface_offsets) if comparison_surface_offsets else None
            ),
            "medianCandidateElevationAboveExpectedSeatSurfaceFeet": percentile(
                comparison_surface_offsets, 50
            ),
            "interpretation": (
                "The accepted hard-structure artifact identifies the 2021 source "
                "as a closed-roof capture. Its LiDAR returns are therefore not an "
                "independent seating-bowl epoch."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "COMPARISON_LIDAR_CLOSED_ROOF_OCCLUDES_SEATING_BOWL",
                "SURFACE_SEMANTIC_ROLE_NOT_INDEPENDENTLY_PROVEN_AS_SEATING_TREAD",
                "CURRENT_ROW_PERSISTENCE_NOT_ESTABLISHED",
                "MEASURED_ROW_COVERAGE_NOT_COMPLETE",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "rows": row_results,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "counts": artifact["counts"],
        "uncertainty": artifact["uncertainty"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
