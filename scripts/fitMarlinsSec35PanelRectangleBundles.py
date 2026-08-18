#!/usr/bin/env python3
"""Fit one provider-render display independently in three camera bundles.

Integer contour corners are refined by four signed, subpixel grayscale-threshold
edge lines. Each camera partition then fits its own planar rectangle to its
observed rays. No position, orientation, width, or height is shared across
partitions. This is a provider-model diagnostic and can never establish physical
as-built geometry.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation

from reconstructPanoramaDenseOverhang import panorama_rays, values_summary
from triangulateMarlinsSec35PanelCorners import (
    CORNER_LABELS,
    DETECTION_THRESHOLDS,
    MAXIMUM_NORMAL_MATRIX_CONDITION_NUMBER,
    MAXIMUM_PARTITION_CORNER_DISAGREEMENT_METRES,
    MAXIMUM_PARTITION_NORMAL_DISAGREEMENT_DEGREES,
    MAXIMUM_RAY_RESIDUAL_METRES,
    MAXIMUM_RAY_RESIDUAL_P95_METRES,
    MAXIMUM_THRESHOLD_CORNER_DRIFT_PIXELS,
    PARTITIONS,
    PRIMARY_DETECTION_THRESHOLD,
    angle_degrees,
    detect_panel,
    file_sha256,
    multi_ray_point,
    render_diagnostic,
    round_array,
    value_fingerprint,
)


ANALYSIS_VERSION = "marlins-sec35-panel-disjoint-rectangle-bundle-v2"
EDGE_SEARCH_HALF_WIDTH_PIXELS = 8.0
EDGE_SEARCH_STEP_PIXELS = 0.25
EDGE_SAMPLE_START_FRACTION = 0.10
EDGE_SAMPLE_STOP_FRACTION = 0.90
EDGE_SAMPLE_COUNT = 80
MAXIMUM_EDGE_LINE_RESIDUAL_P95_PIXELS = 2.0
MAXIMUM_OPTIMIZER_EVALUATIONS = 10_000
OPTIMIZER_TOLERANCE = 1e-14


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    return parser.parse_args()


def sample_gray(image: np.ndarray, points: np.ndarray) -> np.ndarray:
    return cv2.remap(
        image.astype(np.float32),
        points[:, 0].astype(np.float32).reshape(1, -1),
        points[:, 1].astype(np.float32).reshape(1, -1),
        cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_REPLICATE,
    ).reshape(-1)


def intersect_lines(
    first: tuple[np.ndarray, np.ndarray],
    second: tuple[np.ndarray, np.ndarray],
) -> np.ndarray:
    first_point, first_direction = first
    second_point, second_direction = second
    parameters = np.linalg.solve(
        np.column_stack([first_direction, -second_direction]),
        second_point - first_point,
    )
    return first_point + parameters[0] * first_direction


def refine_panel_edges(
    gray: np.ndarray,
    initial_corners: np.ndarray,
    threshold: int,
) -> dict[str, np.ndarray]:
    offsets = np.arange(
        -EDGE_SEARCH_HALF_WIDTH_PIXELS,
        EDGE_SEARCH_HALF_WIDTH_PIXELS + EDGE_SEARCH_STEP_PIXELS * 0.5,
        EDGE_SEARCH_STEP_PIXELS,
    )
    fractions = np.linspace(
        EDGE_SAMPLE_START_FRACTION,
        EDGE_SAMPLE_STOP_FRACTION,
        EDGE_SAMPLE_COUNT,
    )
    lines = []
    residuals = []
    residuals_by_edge = []
    selected_points_by_edge = []
    selected_offsets_by_edge = []
    crossing_counts_by_edge = []
    for edge_index in range(4):
        start = initial_corners[edge_index]
        stop = initial_corners[(edge_index + 1) % 4]
        direction = stop - start
        direction /= np.linalg.norm(direction)
        normal = np.asarray([-direction[1], direction[0]])
        bases = start[None, :] + fractions[:, None] * (stop - start)[None, :]
        candidates = bases[:, None, :] + offsets[None, :, None] * normal
        profiles = sample_gray(gray, candidates.reshape(-1, 2)).reshape(
            fractions.size, offsets.size
        )
        crossings = (
            (profiles[:, :-1] < threshold)
            & (profiles[:, 1:] >= threshold)
        )
        crossing_counts = np.sum(crossings, axis=1)
        if np.any(crossing_counts == 0):
            missing = np.flatnonzero(crossing_counts == 0).tolist()
            raise ValueError(
                f"Edge {edge_index} has no signed threshold crossing for samples {missing}"
            )
        crossing_midpoints = 0.5 * (offsets[:-1] + offsets[1:])
        crossing_distance = np.where(
            crossings,
            np.abs(crossing_midpoints)[None, :],
            np.inf,
        )
        crossing_indices = np.argmin(crossing_distance, axis=1)
        rows = np.arange(fractions.size)
        lower_values = profiles[rows, crossing_indices]
        upper_values = profiles[rows, crossing_indices + 1]
        interpolation_fraction = (
            (threshold - lower_values) / (upper_values - lower_values)
        )
        selected_offsets = (
            offsets[crossing_indices]
            + interpolation_fraction * EDGE_SEARCH_STEP_PIXELS
        )
        selected = bases + selected_offsets[:, None] * normal
        center = np.mean(selected, axis=0)
        _, _, right_vectors = np.linalg.svd(selected - center, full_matrices=False)
        fitted_direction = right_vectors[0]
        fitted_normal = np.asarray([-fitted_direction[1], fitted_direction[0]])
        edge_residuals = np.abs((selected - center) @ fitted_normal)
        lines.append((center, fitted_direction))
        residuals.append(edge_residuals)
        residuals_by_edge.append(edge_residuals)
        selected_points_by_edge.append(selected)
        selected_offsets_by_edge.append(selected_offsets)
        crossing_counts_by_edge.append(crossing_counts)
    corners = np.asarray([
        intersect_lines(lines[(corner_index - 1) % 4], lines[corner_index])
        for corner_index in range(4)
    ])
    return {
        "corners": corners,
        "edgeResiduals": np.concatenate(residuals),
        "edgeResidualsByEdge": np.stack(residuals_by_edge),
        "selectedPointsByEdge": np.stack(selected_points_by_edge),
        "selectedOffsetsByEdge": np.stack(selected_offsets_by_edge),
        "crossingCountsByEdge": np.stack(crossing_counts_by_edge),
    }


def rectangle_from_parameters(
    parameters: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    center = parameters[:3]
    rotation = Rotation.from_rotvec(parameters[3:6]).as_matrix()
    horizontal = rotation[:, 0]
    vertical = rotation[:, 1]
    normal = rotation[:, 2]
    width, height = np.exp(parameters[6:8])
    signs = np.asarray([
        [-1.0, -1.0],
        [1.0, -1.0],
        [1.0, 1.0],
        [-1.0, 1.0],
    ])
    corners = (
        center[None, :]
        + signs[:, 0, None] * width * 0.5 * horizontal[None, :]
        + signs[:, 1, None] * height * 0.5 * vertical[None, :]
    )
    return corners, normal, horizontal, vertical


def initial_rectangle_parameters(corners: np.ndarray) -> np.ndarray:
    center = np.mean(corners, axis=0)
    horizontal = 0.5 * (
        corners[1] - corners[0] + corners[2] - corners[3]
    )
    width = np.linalg.norm(horizontal)
    horizontal /= width
    vertical = 0.5 * (
        corners[3] - corners[0] + corners[2] - corners[1]
    )
    vertical -= horizontal * np.dot(vertical, horizontal)
    height = np.linalg.norm(vertical)
    vertical /= height
    normal = np.cross(horizontal, vertical)
    normal /= np.linalg.norm(normal)
    vertical = np.cross(normal, horizontal)
    rotation = np.column_stack([horizontal, vertical, normal])
    return np.concatenate([
        center,
        Rotation.from_matrix(rotation).as_rotvec(),
        np.log([width, height]),
    ])


def rectangle_ray_residuals(
    parameters: np.ndarray,
    origins: np.ndarray,
    directions: np.ndarray,
) -> np.ndarray:
    corners, _, _, _ = rectangle_from_parameters(parameters)
    residuals = []
    for view_index in range(origins.shape[0]):
        offsets = corners - origins[view_index]
        view_directions = directions[view_index]
        along_ray = np.sum(offsets * view_directions, axis=1)
        residuals.append(
            offsets - along_ray[:, None] * view_directions
        )
    return np.asarray(residuals)


def rectangle_edge_ray_residuals(
    parameters: np.ndarray,
    origins: np.ndarray,
    directions: np.ndarray,
) -> np.ndarray:
    """Return signed shortest distances between image rays and rectangle edges."""
    corners, _, horizontal, vertical = rectangle_from_parameters(parameters)
    edge_directions = np.stack([horizontal, vertical, -horizontal, -vertical])
    edge_line_points = corners
    cross_products = np.cross(
        directions,
        edge_directions[None, :, None, :],
    )
    denominators = np.linalg.norm(cross_products, axis=3)
    if np.any(denominators <= 1e-12):
        raise ValueError("An observed ray is parallel to its candidate rectangle edge")
    line_offsets = (
        edge_line_points[None, :, None, :]
        - origins[:, None, None, :]
    )
    return np.sum(line_offsets * cross_products, axis=3) / denominators


def main() -> None:
    args = parse_args()
    manifest = json.loads(args.manifest.read_text())
    calibration = json.loads(args.calibration.read_text())
    by_seat = {entry["seatId"]: entry for entry in manifest["images"]}
    seat_ids = tuple(seat_id for ids in PARTITIONS.values() for seat_id in ids)
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"], dtype=float
    )

    observations: dict[str, dict[str, Any]] = {}
    image_inputs = []
    all_edge_residuals = []
    all_threshold_drifts = []
    for seat_id in seat_ids:
        entry = by_seat[seat_id]
        image_path = Path(entry["localPath"])
        image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not load {image_path}")
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        refinements = {
            threshold: refine_panel_edges(
                gray,
                detect_panel(image, threshold)["corners"],
                PRIMARY_DETECTION_THRESHOLD,
            )
            for threshold in DETECTION_THRESHOLDS
        }
        corners_by_threshold = np.stack([
            refinements[threshold]["corners"] for threshold in DETECTION_THRESHOLDS
        ])
        primary_index = DETECTION_THRESHOLDS.index(PRIMARY_DETECTION_THRESHOLD)
        primary_corners = corners_by_threshold[primary_index]
        threshold_drifts = np.linalg.norm(
            corners_by_threshold - primary_corners[None, :, :], axis=2
        )
        edge_residuals = refinements[PRIMARY_DETECTION_THRESHOLD]["edgeResiduals"]
        primary_refinement = refinements[PRIMARY_DETECTION_THRESHOLD]
        panorama_directions = panorama_rays(
            primary_corners,
            image.shape[1],
            image.shape[0],
            float(entry["config"]["rp"][1]),
        )
        provider_directions = np.einsum(
            "ij,nj->ni", panorama_to_provider, panorama_directions
        )
        provider_directions /= np.linalg.norm(
            provider_directions, axis=1, keepdims=True
        )
        primary_edge_pixels = primary_refinement["selectedPointsByEdge"]
        panorama_edge_directions = panorama_rays(
            primary_edge_pixels.reshape(-1, 2),
            image.shape[1],
            image.shape[0],
            float(entry["config"]["rp"][1]),
        ).reshape(4, EDGE_SAMPLE_COUNT, 3)
        provider_edge_directions = np.einsum(
            "ij,esj->esi", panorama_to_provider, panorama_edge_directions
        )
        provider_edge_directions /= np.linalg.norm(
            provider_edge_directions, axis=2, keepdims=True
        )
        observations[seat_id] = {
            "primaryCornersPixels": primary_corners,
            "providerDirections": provider_directions,
            "providerEdgeDirections": provider_edge_directions,
            "thresholdDriftsPixels": threshold_drifts,
            "edgeResidualsPixels": edge_residuals,
            "edgeResidualsByEdgePixels": primary_refinement["edgeResidualsByEdge"],
            "selectedOffsetsByEdgePixels": primary_refinement["selectedOffsetsByEdge"],
            "crossingCountsByEdge": primary_refinement["crossingCountsByEdge"],
        }
        all_threshold_drifts.extend(threshold_drifts.ravel().tolist())
        all_edge_residuals.extend(edge_residuals.tolist())
        image_inputs.append({
            "seatId": seat_id,
            "path": str(image_path),
            "sha256": file_sha256(image_path),
            "providerCameraPositionMetres": entry["config"]["p"],
            "providerYawDegrees": entry["config"]["rp"][1],
        })

    partition_results: dict[str, dict[str, Any]] = {}
    all_ray_residuals = []
    all_initial_condition_numbers = []
    for partition, partition_seat_ids in PARTITIONS.items():
        origins = np.asarray([
            by_seat[seat_id]["config"]["p"] for seat_id in partition_seat_ids
        ])
        corner_directions = np.asarray([
            observations[seat_id]["providerDirections"]
            for seat_id in partition_seat_ids
        ])
        edge_directions = np.asarray([
            observations[seat_id]["providerEdgeDirections"]
            for seat_id in partition_seat_ids
        ])
        initial_corners = []
        initial_condition_numbers = []
        for corner_index in range(4):
            point, _, condition_number = multi_ray_point(
                origins, corner_directions[:, corner_index, :]
            )
            initial_corners.append(point)
            initial_condition_numbers.append(condition_number)
        initial_parameters = initial_rectangle_parameters(np.asarray(initial_corners))
        fit = least_squares(
            lambda parameters: rectangle_edge_ray_residuals(
                parameters, origins, edge_directions
            ).ravel(),
            initial_parameters,
            method="lm",
            xtol=OPTIMIZER_TOLERANCE,
            ftol=OPTIMIZER_TOLERANCE,
            gtol=OPTIMIZER_TOLERANCE,
            max_nfev=MAXIMUM_OPTIMIZER_EVALUATIONS,
        )
        corners, normal, _, _ = rectangle_from_parameters(fit.x)
        residual_norms = np.abs(
            rectangle_edge_ray_residuals(fit.x, origins, edge_directions)
        )
        per_view = {
            seat_id: residual_norms[view_index].ravel().tolist()
            for view_index, seat_id in enumerate(partition_seat_ids)
        }
        per_view_per_edge = {
            seat_id: {
                label: residual_norms[view_index, edge_index].tolist()
                for edge_index, label in enumerate(("top", "right", "bottom", "left"))
            }
            for view_index, seat_id in enumerate(partition_seat_ids)
        }
        if normal[0] > 0:
            normal = -normal
        width, height = np.exp(fit.x[6:8])
        partition_results[partition] = {
            "seatIds": list(partition_seat_ids),
            "providerCornersMetres": corners,
            "providerPlaneNormal": normal,
            "providerCenterMetres": fit.x[:3],
            "widthMetres": float(width),
            "heightMetres": float(height),
            "rayResidualsMetres": residual_norms,
            "perViewRayResidualsMetres": per_view,
            "perViewPerEdgeRayResidualsMetres": per_view_per_edge,
            "initialConditionNumbers": np.asarray(initial_condition_numbers),
            "fitSuccess": bool(fit.success),
            "fitStatus": int(fit.status),
            "fitMessage": str(fit.message),
            "functionEvaluationCount": int(fit.nfev),
        }
        all_ray_residuals.extend(residual_norms.ravel().tolist())
        all_initial_condition_numbers.extend(initial_condition_numbers)

    comparisons = []
    partition_names = tuple(PARTITIONS)
    for first_index, first_name in enumerate(partition_names):
        for second_name in partition_names[first_index + 1:]:
            first = partition_results[first_name]
            second = partition_results[second_name]
            corner_disagreements = np.linalg.norm(
                first["providerCornersMetres"] - second["providerCornersMetres"],
                axis=1,
            )
            comparisons.append({
                "partitions": [first_name, second_name],
                "cornerDisagreementMetres": corner_disagreements,
                "cornerDisagreementP95Metres": float(np.percentile(corner_disagreements, 95)),
                "normalDisagreementDegrees": angle_degrees(
                    first["providerPlaneNormal"], second["providerPlaneNormal"]
                ),
            })

    edge_residuals_array = np.asarray(all_edge_residuals)
    threshold_drifts_array = np.asarray(all_threshold_drifts)
    ray_residuals_array = np.asarray(all_ray_residuals)
    condition_numbers_array = np.asarray(all_initial_condition_numbers)
    detector_passed = bool(
        np.max(threshold_drifts_array) <= MAXIMUM_THRESHOLD_CORNER_DRIFT_PIXELS
        and np.percentile(edge_residuals_array, 95)
        <= MAXIMUM_EDGE_LINE_RESIDUAL_P95_PIXELS
    )
    ray_passed = bool(
        np.percentile(ray_residuals_array, 95) <= MAXIMUM_RAY_RESIDUAL_P95_METRES
        and np.max(ray_residuals_array) <= MAXIMUM_RAY_RESIDUAL_METRES
    )
    condition_passed = bool(
        np.max(condition_numbers_array) <= MAXIMUM_NORMAL_MATRIX_CONDITION_NUMBER
    )
    fit_passed = all(result["fitSuccess"] for result in partition_results.values())
    corners_passed = all(
        comparison["cornerDisagreementP95Metres"]
        <= MAXIMUM_PARTITION_CORNER_DISAGREEMENT_METRES
        for comparison in comparisons
    )
    orientation_passed = all(
        comparison["normalDisagreementDegrees"]
        <= MAXIMUM_PARTITION_NORMAL_DISAGREEMENT_DEGREES
        for comparison in comparisons
    )
    candidate_eligible = bool(
        detector_passed
        and ray_passed
        and condition_passed
        and fit_passed
        and corners_passed
        and orientation_passed
    )

    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output_npz,
        partition_names=np.asarray(partition_names),
        provider_corners_metres=np.stack([
            partition_results[name]["providerCornersMetres"] for name in partition_names
        ]),
        provider_plane_normals=np.stack([
            partition_results[name]["providerPlaneNormal"] for name in partition_names
        ]),
        provider_centers_metres=np.stack([
            partition_results[name]["providerCenterMetres"] for name in partition_names
        ]),
        widths_metres=np.asarray([
            partition_results[name]["widthMetres"] for name in partition_names
        ]),
        heights_metres=np.asarray([
            partition_results[name]["heightMetres"] for name in partition_names
        ]),
    )
    render_diagnostic(args.output_png, observations, by_seat, partition_results)
    stable = {
        "manifestSha256": file_sha256(args.manifest),
        "calibrationSha256": file_sha256(args.calibration),
        "images": image_inputs,
        "outputNpzSha256": file_sha256(args.output_npz),
        "outputPngSha256": file_sha256(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "current-provider-model-disjoint-panel-rectangle-fit",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        "inputs": {
            "manifest": {"path": str(args.manifest), "sha256": stable["manifestSha256"]},
            "calibration": {
                "path": str(args.calibration),
                "sha256": stable["calibrationSha256"],
                "artifactVersion": calibration.get("artifactVersion"),
            },
            "images": image_inputs,
        },
        "fixedCameraPartitions": {
            name: list(ids) for name, ids in PARTITIONS.items()
        } | {"allPartitionsDisjoint": True},
        "edgeRefinement": {
            "method": (
                "nearest exterior-to-interior crossing of the fixed primary "
                "grayscale threshold along the inward edge normal with linear "
                "subpixel interpolation"
            ),
            "grayThresholdInitializers": list(DETECTION_THRESHOLDS),
            "primaryGrayThreshold": PRIMARY_DETECTION_THRESHOLD,
            "refinementGrayThreshold": PRIMARY_DETECTION_THRESHOLD,
            "initializerStabilityDefinition": (
                "each independent initializer is refined to the same fixed "
                "photometric edge before corner drift is measured"
            ),
            "edgeSearchHalfWidthPixels": EDGE_SEARCH_HALF_WIDTH_PIXELS,
            "edgeSearchStepPixels": EDGE_SEARCH_STEP_PIXELS,
            "edgeSampleFraction": [EDGE_SAMPLE_START_FRACTION, EDGE_SAMPLE_STOP_FRACTION],
            "edgeSampleCount": EDGE_SAMPLE_COUNT,
            "expectedTransition": "gray below threshold to gray at or above threshold",
            "sampleExclusionOrOutlierRejection": "none",
            "maximumThresholdCornerDriftPixels": MAXIMUM_THRESHOLD_CORNER_DRIFT_PIXELS,
            "maximumEdgeLineResidualP95Pixels": MAXIMUM_EDGE_LINE_RESIDUAL_P95_PIXELS,
            "observedThresholdCornerDriftPixels": values_summary(threshold_drifts_array),
            "observedEdgeLineResidualPixels": values_summary(edge_residuals_array),
            "perViewThresholdCornerDriftPixels": {
                seat_id: {
                    "valuesByThresholdAndCorner": round_array(
                        observations[seat_id]["thresholdDriftsPixels"]
                    ),
                    "summary": values_summary(
                        observations[seat_id]["thresholdDriftsPixels"].ravel()
                    ),
                }
                for seat_id in seat_ids
            },
            "perViewPrimaryCornersPixels": {
                seat_id: round_array(observations[seat_id]["primaryCornersPixels"])
                for seat_id in seat_ids
            },
            "perViewPerEdge": {
                seat_id: {
                    label: {
                        "edgeLineResidualPixels": values_summary(
                            observations[seat_id]["edgeResidualsByEdgePixels"][edge_index]
                        ),
                        "selectedOffsetPixels": values_summary(
                            observations[seat_id]["selectedOffsetsByEdgePixels"][edge_index]
                        ),
                        "signedThresholdCrossingCount": values_summary(
                            observations[seat_id]["crossingCountsByEdge"][edge_index]
                        ),
                    }
                    for edge_index, label in enumerate(
                        ("top", "right", "bottom", "left")
                    )
                }
                for seat_id in seat_ids
            },
            "passed": detector_passed,
        },
        "model": {
            "perPartitionParameters": "independent center, 3D rotation, width, and height",
            "sharedParametersAcrossPartitions": [],
            "observationsPerView": (
                f"all {4 * EDGE_SAMPLE_COUNT} signed subpixel boundary rays, "
                f"{EDGE_SAMPLE_COUNT} on each of four labeled edges"
            ),
            "optimizer": "scipy least_squares Levenberg-Marquardt with linear residual loss",
            "maximumFunctionEvaluations": MAXIMUM_OPTIMIZER_EVALUATIONS,
            "optimizerTolerance": OPTIMIZER_TOLERANCE,
        },
        "triangulation": {
            "rayResidualDefinition": (
                "absolute shortest 3D distance between every observed boundary "
                "ray and its corresponding fitted infinite rectangle edge line"
            ),
            "sampleExclusionOrOutlierRejection": "none",
            "maximumRayResidualP95Metres": MAXIMUM_RAY_RESIDUAL_P95_METRES,
            "maximumRayResidualMetres": MAXIMUM_RAY_RESIDUAL_METRES,
            "maximumInitialNormalMatrixConditionNumber": MAXIMUM_NORMAL_MATRIX_CONDITION_NUMBER,
            "observedRayResidualMetres": values_summary(ray_residuals_array),
            "observedInitialNormalMatrixConditionNumber": values_summary(condition_numbers_array),
            "rayResidualPassed": ray_passed,
            "conditionPassed": condition_passed,
            "allOptimizerFitsPassed": fit_passed,
        },
        "partitionGeometry": {
            name: {
                "cornerLabels": list(CORNER_LABELS),
                "providerCornersMetres": round_array(result["providerCornersMetres"]),
                "providerCenterMetres": round_array(result["providerCenterMetres"]),
                "providerPlaneNormal": round_array(result["providerPlaneNormal"]),
                "widthMetres": round(result["widthMetres"], 6),
                "heightMetres": round(result["heightMetres"], 6),
                "rayResidualMetres": values_summary(result["rayResidualsMetres"].ravel()),
                "perViewPerEdgeRayResidualMetres": {
                    seat_id: {
                        label: values_summary(np.asarray(values))
                        for label, values in per_edge.items()
                    }
                    for seat_id, per_edge in result[
                        "perViewPerEdgeRayResidualsMetres"
                    ].items()
                },
                "fitSuccess": result["fitSuccess"],
                "fitStatus": result["fitStatus"],
                "fitMessage": result["fitMessage"],
                "functionEvaluationCount": result["functionEvaluationCount"],
            }
            for name, result in partition_results.items()
        },
        "partitionComparisons": [
            {
                "partitions": comparison["partitions"],
                "cornerDisagreementMetres": round_array(comparison["cornerDisagreementMetres"]),
                "cornerDisagreementP95Metres": round(comparison["cornerDisagreementP95Metres"], 6),
                "normalDisagreementDegrees": round(comparison["normalDisagreementDegrees"], 6),
            }
            for comparison in comparisons
        ],
        "gates": {
            "maximumPartitionCornerDisagreementMetres": MAXIMUM_PARTITION_CORNER_DISAGREEMENT_METRES,
            "maximumPartitionNormalDisagreementDegrees": MAXIMUM_PARTITION_NORMAL_DISAGREEMENT_DEGREES,
            "allCornerComparisonsPassed": corners_passed,
            "allOrientationComparisonsPassed": orientation_passed,
        },
        "geometry": {
            "coordinateFrame": "current 3DDV provider-local metres",
            "npzPath": str(args.output_npz),
            "npzSha256": stable["outputNpzSha256"],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": stable["outputPngSha256"],
        },
        "semanticScope": {
            "established": "independently fitted visible rectangular face of one current provider-render Section 35 display",
            "notEstablished": [
                "display thickness or rear face",
                "closed obstruction volume",
                "physical as-built persistence",
                "survey-grade world position",
                "any other obstruction, section, level, or stadium",
            ],
        },
        "assessment": {
            "currentProviderModelPanelFaceCandidateEligible": candidate_eligible,
            "physicalAsBuiltMeasurementEligible": False,
            "publicationEligible": False,
            "reason": (
                "All fixed provider-model edge, ray, corner, and orientation gates passed."
                if candidate_eligible
                else "At least one fixed provider-model edge, ray, corner, or orientation gate failed."
            ),
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "candidateEligible": candidate_eligible,
        "detectorPassed": detector_passed,
        "rayResidualPassed": ray_passed,
        "conditionPassed": condition_passed,
        "cornerAgreementPassed": corners_passed,
        "orientationAgreementPassed": orientation_passed,
        "rayResidualP95Metres": round(float(np.percentile(ray_residuals_array, 95)), 6),
        "maximumNormalDisagreementDegrees": round(max(
            comparison["normalDisagreementDegrees"] for comparison in comparisons
        ), 6),
        "maximumCornerDisagreementP95Metres": round(max(
            comparison["cornerDisagreementP95Metres"] for comparison in comparisons
        ), 6),
    }, indent=2))


if __name__ == "__main__":
    main()
