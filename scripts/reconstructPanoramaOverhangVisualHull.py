#!/usr/bin/env python3
"""Reconstruct a calibrated overhang visual hull from panorama silhouettes.

Every retained voxel must project into the overhead side of every silhouette
in its view group. Training and holdout panoramas produce separate hulls. The
result is a conservative visual hull, not a claim that every occupied voxel is
physical material. Direct 3D anchors and a separately fitted boundary curve are
used only for validation, not to form the hull.
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
from scipy.spatial import cKDTree

from fitMultiViewOpeningBoundary import load_view
from validatePanoramaOverhangFrontEdge import project_provider_points


ANALYSIS_VERSION = "panorama-overhang-visual-hull-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("calibration", type=Path)
    parser.add_argument("surface", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("boundary_curve", type=Path)
    parser.add_argument("consensus_anchors", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--training-stereo", type=Path, action="append", default=[])
    parser.add_argument("--holdout-stereo", type=Path, action="append", default=[])
    parser.add_argument("--provider-x-minimum", type=float, default=0.0)
    parser.add_argument("--provider-x-maximum", type=float, default=7.0)
    parser.add_argument("--provider-y-minimum", type=float, default=8.0)
    parser.add_argument("--provider-y-maximum", type=float, default=9.6)
    parser.add_argument("--provider-z-minimum", type=float, default=40.0)
    parser.add_argument("--provider-z-maximum", type=float, default=54.0)
    parser.add_argument("--voxel-size-metres", type=float, default=0.10)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--minimum-transition-score", type=float, default=18.0)
    parser.add_argument("--foreground-margin-pixels", type=float, default=2.0)
    parser.add_argument("--maximum-envelope-disagreement-p95-metres", type=float, default=0.20)
    parser.add_argument("--minimum-common-column-fraction", type=float, default=0.70)
    parser.add_argument("--minimum-direct-anchor-count", type=int, default=15)
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


def values_summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 6),
        "median": None if finite.size == 0 else round(float(np.median(finite)), 6),
        "p95": None if finite.size == 0 else round(float(np.percentile(finite, 95)), 6),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 6),
    }


def grid_centres(minimum: float, maximum: float, size: float) -> np.ndarray:
    count = int(math.floor((maximum - minimum) / size + 1e-9))
    if count < 1:
        raise ValueError("Every voxel-grid axis must contain at least one cell")
    return minimum + size * (np.arange(count, dtype=float) + 0.5)


def classify_hull(
    points: np.ndarray,
    views: list[dict[str, Any]],
    provider_to_panorama: np.ndarray,
    foreground_margin_pixels: float,
) -> tuple[np.ndarray, np.ndarray, list[dict[str, Any]]]:
    occupied = np.ones(points.shape[0], dtype=bool)
    observed = np.ones(points.shape[0], dtype=bool)
    diagnostics = []
    for view in views:
        pixels = project_provider_points(
            points,
            np.asarray(view["config"]["p"], dtype=float),
            provider_to_panorama,
            float(view["config"]["rp"][1]),
            int(view["width"]),
            int(view["height"]),
        )
        boundary = view["boundary"]
        valid = (
            np.all(np.isfinite(pixels), axis=1)
            & (pixels[:, 0] >= boundary[0, 0])
            & (pixels[:, 0] <= boundary[-1, 0])
            & (pixels[:, 1] >= 0.0)
            & (pixels[:, 1] < view["height"])
        )
        expected_y = np.interp(
            np.clip(pixels[:, 0], boundary[0, 0], boundary[-1, 0]),
            boundary[:, 0],
            boundary[:, 1],
        )
        foreground = valid & (
            pixels[:, 1] <= expected_y - foreground_margin_pixels
        )
        observed &= valid
        occupied &= foreground
        diagnostics.append({
            "seatId": view["seatId"],
            "observedVoxelCount": int(np.count_nonzero(valid)),
            "foregroundVoxelCount": int(np.count_nonzero(foreground)),
            "foregroundPercentOfObserved": round(
                100.0 * np.count_nonzero(foreground) / max(np.count_nonzero(valid), 1),
                6,
            ),
        })
    occupied &= observed
    return occupied, observed, diagnostics


def bottom_envelope(
    occupancy: np.ndarray,
    y_values: np.ndarray,
) -> np.ndarray:
    has_occupancy = np.any(occupancy, axis=-1)
    first_index = np.argmax(occupancy, axis=-1)
    envelope = np.full(has_occupancy.shape, np.nan, dtype=float)
    envelope[has_occupancy] = y_values[first_index[has_occupancy]]
    return envelope


def render_panel(values: np.ndarray, minimum: float, maximum: float, title: str) -> np.ndarray:
    height, width = values.shape
    finite = np.isfinite(values)
    normalized = np.zeros(values.shape, dtype=np.uint8)
    normalized[finite] = np.clip(
        255.0 * (values[finite] - minimum) / max(maximum - minimum, 1e-9),
        0,
        255,
    ).astype(np.uint8)
    panel = cv2.applyColorMap(normalized, cv2.COLORMAP_TURBO)
    panel[~finite] = (235, 235, 235)
    panel = cv2.resize(panel, (800, 800), interpolation=cv2.INTER_NEAREST)
    cv2.putText(panel, title, (20, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (15, 15, 15), 3, cv2.LINE_AA)
    return panel


def nearest_distances(points: np.ndarray, occupied_points: np.ndarray) -> np.ndarray:
    if points.shape[0] == 0 or occupied_points.shape[0] == 0:
        return np.empty(0, dtype=float)
    return cKDTree(occupied_points).query(points, k=1)[0]


def main() -> None:
    args = parse_args()
    if len(args.training_stereo) < 4:
        raise ValueError("At least four training views are required")
    if len(args.holdout_stereo) < 3:
        raise ValueError("At least three holdout views are required")
    if args.voxel_size_metres <= 0:
        raise ValueError("Voxel size must be positive")

    calibration = json.loads(args.calibration.read_text())
    surface = json.loads(args.surface.read_text())
    datum = json.loads(args.vertical_datum.read_text())
    boundary = json.loads(args.boundary_curve.read_text())
    anchors = json.loads(args.consensus_anchors.read_text())
    if not calibration["assessment"]["measurementEligible"]:
        raise ValueError("Provider-frame calibration is not measurement eligible")
    if not surface["assessment"].get("providerLocalOverhangingDeckUndersideMeasurementEligible"):
        raise ValueError("Overhanging deck underside is not measurement eligible")
    if not datum["assessment"]["sectionLocalVerticalDatumMeasurementEligible"]:
        raise ValueError("Vertical datum is not measurement eligible")
    if not boundary["assessment"].get("georeferencedBoundaryCurveMeasurementEligible"):
        raise ValueError("Boundary curve is not measurement eligible")
    if not anchors["assessment"].get("georeferencedAnchorMeasurementEligible"):
        raise ValueError("Consensus anchors are not measurement eligible")

    training_views = [
        load_view(path, args.maximum_width, args.minimum_transition_score)
        for path in args.training_stereo
    ]
    holdout_views = [
        load_view(path, args.maximum_width, args.minimum_transition_score)
        for path in args.holdout_stereo
    ]
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"],
        dtype=float,
    )
    x_values = grid_centres(args.provider_x_minimum, args.provider_x_maximum, args.voxel_size_metres)
    y_values = grid_centres(args.provider_y_minimum, args.provider_y_maximum, args.voxel_size_metres)
    z_values = grid_centres(args.provider_z_minimum, args.provider_z_maximum, args.voxel_size_metres)
    x_grid, y_grid, z_grid = np.meshgrid(x_values, y_values, z_values, indexing="ij")
    points = np.column_stack([x_grid.ravel(), y_grid.ravel(), z_grid.ravel()])
    shape = (x_values.size, y_values.size, z_values.size)

    training_flat, training_observed, training_diagnostics = classify_hull(
        points,
        training_views,
        provider_to_panorama,
        args.foreground_margin_pixels,
    )
    holdout_flat, holdout_observed, holdout_diagnostics = classify_hull(
        points,
        holdout_views,
        provider_to_panorama,
        args.foreground_margin_pixels,
    )
    training_occupancy = training_flat.reshape(shape)
    holdout_occupancy = holdout_flat.reshape(shape)
    training_envelope = bottom_envelope(training_occupancy.transpose(0, 2, 1), y_values)
    holdout_envelope = bottom_envelope(holdout_occupancy.transpose(0, 2, 1), y_values)
    common_columns = np.isfinite(training_envelope) & np.isfinite(holdout_envelope)
    union_columns = np.isfinite(training_envelope) | np.isfinite(holdout_envelope)
    envelope_disagreement = np.abs(
        training_envelope[common_columns] - holdout_envelope[common_columns]
    )
    common_column_fraction = float(
        np.count_nonzero(common_columns) / max(np.count_nonzero(union_columns), 1)
    )

    training_points = points[training_flat]
    holdout_points = points[holdout_flat]
    boundary_points = np.asarray([
        point["providerLocalMetres"]
        for point in boundary["georeferencedCurve"]["points"]
    ], dtype=float)
    anchor_points = np.asarray([
        point["providerLocalMetres"]
        for point in anchors["consensus"]["anchors"]
    ], dtype=float)
    volume_bounds = (
        (anchor_points[:, 0] >= args.provider_x_minimum)
        & (anchor_points[:, 0] <= args.provider_x_maximum)
        & (anchor_points[:, 1] >= args.provider_y_minimum)
        & (anchor_points[:, 1] <= args.provider_y_maximum)
        & (anchor_points[:, 2] >= args.provider_z_minimum)
        & (anchor_points[:, 2] <= args.provider_z_maximum)
    )
    volume_anchor_points = anchor_points[volume_bounds]
    boundary_to_training = nearest_distances(boundary_points, training_points)
    boundary_to_holdout = nearest_distances(boundary_points, holdout_points)
    anchors_to_training = nearest_distances(volume_anchor_points, training_points)
    anchors_to_holdout = nearest_distances(volume_anchor_points, holdout_points)

    disagreement_p95 = (
        math.inf
        if envelope_disagreement.size == 0
        else float(np.percentile(envelope_disagreement, 95))
    )
    half_voxel_diagonal = math.sqrt(3.0) * args.voxel_size_metres / 2.0
    geometry_uncertainty = math.hypot(disagreement_p95, half_voxel_diagonal)
    horizontal_combined_95 = math.hypot(
        float(datum["combinedAccuracy"]["horizontal95Metres"]),
        geometry_uncertainty,
    )
    vertical_combined_95 = math.hypot(
        float(datum["combinedAccuracy"]["vertical95Metres"]),
        geometry_uncertainty,
    )
    validation_distance_limit = float(datum["combinedAccuracy"]["horizontal95Metres"])
    visual_hull_measurement_eligible = bool(
        training_points.shape[0] >= 1_000
        and holdout_points.shape[0] >= 1_000
        and common_column_fraction >= args.minimum_common_column_fraction
        and disagreement_p95 <= args.maximum_envelope_disagreement_p95_metres
        and boundary_to_training.size == boundary_points.shape[0]
        and boundary_to_holdout.size == boundary_points.shape[0]
        and float(np.percentile(boundary_to_training, 95)) <= validation_distance_limit
        and float(np.percentile(boundary_to_holdout, 95)) <= validation_distance_limit
        and volume_anchor_points.shape[0] >= args.minimum_direct_anchor_count
        and float(np.percentile(anchors_to_training, 95)) <= validation_distance_limit
        and float(np.percentile(anchors_to_holdout, 95)) <= validation_distance_limit
        and horizontal_combined_95 <= 0.3048
        and vertical_combined_95 <= 0.3048
    )

    difference_panel = np.full(training_envelope.shape, np.nan, dtype=float)
    difference_panel[common_columns] = envelope_disagreement
    diagnostic = np.hstack([
        render_panel(training_envelope, args.provider_y_minimum, args.provider_y_maximum, "training bottom envelope"),
        render_panel(holdout_envelope, args.provider_y_minimum, args.provider_y_maximum, "holdout bottom envelope"),
        render_panel(difference_panel, 0.0, args.maximum_envelope_disagreement_p95_metres, "absolute disagreement"),
    ])
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_png), diagnostic):
        raise ValueError("Could not write visual-hull diagnostic")
    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        args.output_npz,
        provider_x_metres=x_values,
        provider_y_metres=y_values,
        provider_z_metres=z_values,
        training_occupancy=training_occupancy,
        holdout_occupancy=holdout_occupancy,
        training_bottom_envelope_metres=training_envelope,
        holdout_bottom_envelope_metres=holdout_envelope,
    )

    def view_metadata(view: dict[str, Any]) -> dict[str, Any]:
        return {
            key: view[key]
            for key in (
                "stereoPath",
                "stereoSha256",
                "stereoArtifactVersion",
                "manifestPath",
                "manifestSha256",
                "seatId",
                "imagePath",
                "imageSha256",
            )
        }

    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "cross-validated-panorama-overhang-visual-hull",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "calibration": {"path": str(args.calibration), "sha256": file_sha256(args.calibration), "artifactVersion": calibration["artifactVersion"]},
            "surface": {"path": str(args.surface), "sha256": file_sha256(args.surface), "artifactVersion": surface["artifactVersion"]},
            "verticalDatum": {"path": str(args.vertical_datum), "sha256": file_sha256(args.vertical_datum), "artifactVersion": datum["artifactVersion"]},
            "boundaryCurve": {"path": str(args.boundary_curve), "sha256": file_sha256(args.boundary_curve), "artifactVersion": boundary["artifactVersion"]},
            "consensusAnchors": {"path": str(args.consensus_anchors), "sha256": file_sha256(args.consensus_anchors), "artifactVersion": anchors["artifactVersion"]},
            "trainingViews": [view_metadata(view) for view in training_views],
            "holdoutViews": [view_metadata(view) for view in holdout_views],
        },
        "parameters": {
            "providerBoundsMetres": {
                "x": [args.provider_x_minimum, args.provider_x_maximum],
                "y": [args.provider_y_minimum, args.provider_y_maximum],
                "z": [args.provider_z_minimum, args.provider_z_maximum],
            },
            "voxelSizeMetres": args.voxel_size_metres,
            "maximumWidth": args.maximum_width,
            "minimumTransitionScore": args.minimum_transition_score,
            "foregroundMarginPixels": args.foreground_margin_pixels,
            "foregroundRule": "projected voxel is at least the margin above the detected overhead-to-opening silhouette",
            "hullRule": "voxel must satisfy the foreground rule in every view in its group",
            "maximumEnvelopeDisagreementP95Metres": args.maximum_envelope_disagreement_p95_metres,
            "minimumCommonColumnFraction": args.minimum_common_column_fraction,
            "minimumDirectAnchorCount": args.minimum_direct_anchor_count,
        },
        "grid": {
            "shapeXyz": [int(value) for value in shape],
            "totalVoxelCount": int(points.shape[0]),
            "trainingObservedVoxelCount": int(np.count_nonzero(training_observed)),
            "holdoutObservedVoxelCount": int(np.count_nonzero(holdout_observed)),
            "trainingOccupiedVoxelCount": int(training_points.shape[0]),
            "holdoutOccupiedVoxelCount": int(holdout_points.shape[0]),
            "trainingViewDiagnostics": training_diagnostics,
            "holdoutViewDiagnostics": holdout_diagnostics,
        },
        "crossValidation": {
            "trainingOccupiedColumnCount": int(np.count_nonzero(np.isfinite(training_envelope))),
            "holdoutOccupiedColumnCount": int(np.count_nonzero(np.isfinite(holdout_envelope))),
            "commonOccupiedColumnCount": int(np.count_nonzero(common_columns)),
            "unionOccupiedColumnCount": int(np.count_nonzero(union_columns)),
            "commonColumnFraction": round(common_column_fraction, 6),
            "bottomEnvelopeDisagreementMetres": values_summary(envelope_disagreement),
            "halfVoxelDiagonalMetres": round(half_voxel_diagonal, 6),
            "geometryUncertainty95Metres": round(geometry_uncertainty, 6),
        },
        "independentGeometryChecks": {
            "boundaryCurvePointCount": int(boundary_points.shape[0]),
            "boundaryCurveToTrainingHullMetres": values_summary(boundary_to_training),
            "boundaryCurveToHoldoutHullMetres": values_summary(boundary_to_holdout),
            "directAnchorCountInsideVolume": int(volume_anchor_points.shape[0]),
            "directAnchorsToTrainingHullMetres": values_summary(anchors_to_training),
            "directAnchorsToHoldoutHullMetres": values_summary(anchors_to_holdout),
            "validationDistanceLimitMetres": round(validation_distance_limit, 6),
        },
        "combinedAccuracy": {
            "horizontal95Metres": round(horizontal_combined_95, 6),
            "vertical95Metres": round(vertical_combined_95, 6),
            "withinOneFoot": bool(horizontal_combined_95 <= 0.3048 and vertical_combined_95 <= 0.3048),
        },
        "voxelArtifact": {"path": str(args.output_npz), "sha256": file_sha256(args.output_npz)},
        "diagnosticPng": {"path": str(args.output_png), "sha256": file_sha256(args.output_png)},
        "semanticScope": {
            "established": "training and holdout silhouette visual hulls inside the bounded section 123 overhang volume",
            "notEstablished": [
                "that every occupied visual-hull voxel is physical material",
                "exterior top surface or closed slab volume",
                "full section-width current obstruction mesh",
                "full stadium obstruction scope",
            ],
        },
        "assessment": {
            "sectionLocalVisualHullMeasurementEligible": visual_hull_measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "VISUAL_HULL_REQUIRES_PHYSICAL_SURFACE_SEGMENTATION",
                "EXTERIOR_TOP_AND_CLOSED_SLAB_VOLUME_NOT_COMPLETE",
                "FULL_SECTION_WIDTH_CURRENT_OBSTRUCTION_MESH_NOT_COMPLETE",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
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
        "trainingOccupiedVoxels": int(training_points.shape[0]),
        "holdoutOccupiedVoxels": int(holdout_points.shape[0]),
        "commonColumnFraction": round(common_column_fraction, 6),
        "envelopeDisagreementP95Metres": None if not math.isfinite(disagreement_p95) else round(disagreement_p95, 6),
        "boundaryToTrainingHullP95Metres": values_summary(boundary_to_training)["p95"],
        "boundaryToHoldoutHullP95Metres": values_summary(boundary_to_holdout)["p95"],
        "anchorsToTrainingHullP95Metres": values_summary(anchors_to_training)["p95"],
        "anchorsToHoldoutHullP95Metres": values_summary(anchors_to_holdout)["p95"],
        "horizontalAccuracy95Metres": round(horizontal_combined_95, 6),
        "verticalAccuracy95Metres": round(vertical_combined_95, 6),
        "measurementEligible": visual_hull_measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
