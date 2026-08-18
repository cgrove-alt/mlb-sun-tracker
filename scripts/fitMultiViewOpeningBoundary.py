#!/usr/bin/env python3
"""Fit an opening-boundary curve from independent panorama silhouettes.

The curve is parameterized in provider-local coordinates as quadratic y(x) and
z(x). Three or more training panoramas fit one curve. Two or more untouched
panoramas fit a separate holdout curve. Their 3D disagreement is evaluated
without pairwise pixel correspondence, avoiding ambiguity from repeated ribs.
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

from extractPanoramaOpeningBoundary import detect_opening_boundary
from validatePanoramaOverhangFrontEdge import project_provider_points


ANALYSIS_VERSION = "multi-view-opening-boundary-curve-v2"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("calibration", type=Path)
    parser.add_argument("surface", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--training-stereo", type=Path, action="append", default=[])
    parser.add_argument("--holdout-stereo", type=Path, action="append", default=[])
    parser.add_argument("--provider-x-minimum", type=float, default=-3.0)
    parser.add_argument("--provider-x-maximum", type=float, default=9.0)
    parser.add_argument("--curve-samples", type=int, default=121)
    parser.add_argument("--maximum-width", type=int, default=4096)
    parser.add_argument("--minimum-transition-score", type=float, default=18.0)
    parser.add_argument("--maximum-holdout-image-residual-p95-pixels", type=float, default=5.0)
    parser.add_argument("--maximum-curve-disagreement-metres", type=float, default=0.3048)
    parser.add_argument("--maximum-leave-one-out-curve-disagreement-metres", type=float, default=0.3048)
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


def curve_points(parameters: np.ndarray, provider_x: np.ndarray) -> np.ndarray:
    center = 0.5 * (float(np.min(provider_x)) + float(np.max(provider_x)))
    half_span = 0.5 * (float(np.max(provider_x)) - float(np.min(provider_x)))
    normalized = (provider_x - center) / max(half_span, 1e-6)
    design = np.column_stack([normalized * normalized, normalized, np.ones(normalized.size)])
    provider_y = design @ parameters[:3]
    provider_z = design @ parameters[3:]
    return np.column_stack([provider_x, provider_y, provider_z])


def load_view(
    stereo_path: Path,
    maximum_width: int,
    minimum_transition_score: float,
) -> dict[str, Any]:
    stereo = json.loads(stereo_path.read_text())
    manifest_path = Path(stereo["inputs"]["manifest"])
    manifest = json.loads(manifest_path.read_text())
    seat_id = stereo["inputs"]["leftSeatId"]
    entry = next(image for image in manifest["images"] if image["seatId"] == seat_id)
    image_path = Path(entry["localPath"])
    source = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if source is None:
        raise ValueError(f"Could not load panorama {image_path}")
    source_height, source_width = source.shape[:2]
    scale = min(1.0, maximum_width / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    image = cv2.resize(source, (width, height), interpolation=cv2.INTER_AREA)
    boundary, score, valid = detect_opening_boundary(
        image,
        0.20,
        0.80,
        0.24,
        0.55,
        10,
        minimum_transition_score,
    )
    return {
        "stereoPath": str(stereo_path),
        "stereoSha256": file_sha256(stereo_path),
        "stereoArtifactVersion": stereo["artifactVersion"],
        "manifestPath": str(manifest_path),
        "manifestSha256": file_sha256(manifest_path),
        "seatId": seat_id,
        "imagePath": str(image_path),
        "imageSha256": file_sha256(image_path),
        "config": entry["config"],
        "image": image,
        "width": width,
        "height": height,
        "boundary": boundary,
        "score": score,
        "valid": valid,
    }


def boundary_residuals(
    parameters: np.ndarray,
    views: list[dict[str, Any]],
    provider_x: np.ndarray,
    provider_to_panorama: np.ndarray,
) -> np.ndarray:
    points = curve_points(parameters, provider_x)
    residuals = []
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
        x_minimum = boundary[0, 0]
        x_maximum = boundary[-1, 0]
        projected_x = np.clip(pixels[:, 0], x_minimum, x_maximum)
        expected_y = np.interp(projected_x, boundary[:, 0], boundary[:, 1])
        residual = pixels[:, 1] - expected_y
        outside = np.maximum(x_minimum - pixels[:, 0], 0.0) + np.maximum(pixels[:, 0] - x_maximum, 0.0)
        residuals.extend(residual.tolist())
        residuals.extend((0.25 * outside).tolist())
    return np.asarray(residuals, dtype=float)


def fit_curve(
    views: list[dict[str, Any]],
    provider_x: np.ndarray,
    provider_to_panorama: np.ndarray,
    initial: np.ndarray,
) -> tuple[np.ndarray, dict[str, Any]]:
    result = least_squares(
        boundary_residuals,
        initial,
        args=(views, provider_x, provider_to_panorama),
        loss="soft_l1",
        f_scale=3.0,
        max_nfev=20_000,
        xtol=1e-12,
        ftol=1e-12,
        gtol=1e-12,
    )
    per_view = []
    points = curve_points(result.x, provider_x)
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
        expected_y = np.interp(
            np.clip(pixels[:, 0], boundary[0, 0], boundary[-1, 0]),
            boundary[:, 0],
            boundary[:, 1],
        )
        residual = np.abs(pixels[:, 1] - expected_y)
        per_view.append({
            "seatId": view["seatId"],
            "absoluteVerticalPixelResidual": values_summary(residual),
        })
    return result.x, {
        "success": bool(result.success),
        "status": int(result.status),
        "message": str(result.message),
        "functionEvaluations": int(result.nfev),
        "cost": round(float(result.cost), 6),
        "optimality": round(float(result.optimality), 9),
        "perView": per_view,
    }


def render_diagnostic(
    path: Path,
    views: list[dict[str, Any]],
    training_curve: np.ndarray,
    holdout_curve: np.ndarray,
    provider_to_panorama: np.ndarray,
) -> None:
    panels = []
    for view in views:
        image = view["image"].copy()
        boundary = view["boundary"]
        detected = np.round(boundary[view["valid"]]).astype(np.int32).reshape(-1, 1, 2)
        if detected.shape[0] >= 2:
            cv2.polylines(image, [detected], False, (0, 255, 255), 3, cv2.LINE_AA)
        for curve, color in [(training_curve, (255, 255, 0)), (holdout_curve, (255, 0, 255))]:
            pixels = project_provider_points(
                curve,
                np.asarray(view["config"]["p"], dtype=float),
                provider_to_panorama,
                float(view["config"]["rp"][1]),
                int(view["width"]),
                int(view["height"]),
            )
            polyline = np.round(pixels).astype(np.int32).reshape(-1, 1, 2)
            cv2.polylines(image, [polyline], False, color, 4, cv2.LINE_AA)
        cv2.putText(
            image,
            f"{view['seatId']} yellow detected, cyan training, magenta holdout",
            (25, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.0,
            (0, 255, 255),
            3,
            cv2.LINE_AA,
        )
        panels.append(cv2.resize(image, (1400, 700), interpolation=cv2.INTER_AREA))
    diagnostic = np.vstack(panels)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(path), diagnostic):
        raise ValueError("Could not write multi-view boundary diagnostic")


def main() -> None:
    args = parse_args()
    if len(args.training_stereo) < 3:
        raise ValueError("At least three training panoramas are required")
    if len(args.holdout_stereo) < 2:
        raise ValueError("At least two holdout panoramas are required")
    calibration = json.loads(args.calibration.read_text())
    surface = json.loads(args.surface.read_text())
    datum = json.loads(args.vertical_datum.read_text())
    if not calibration["assessment"]["measurementEligible"]:
        raise ValueError("Provider-frame calibration is not measurement eligible")
    if not surface["assessment"].get("providerLocalOverhangingDeckUndersideMeasurementEligible"):
        raise ValueError("Overhanging deck underside is not measurement eligible")
    if not datum["assessment"]["sectionLocalVerticalDatumMeasurementEligible"]:
        raise ValueError("Vertical datum is not measurement eligible")
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
    provider_x = np.linspace(
        args.provider_x_minimum,
        args.provider_x_maximum,
        args.curve_samples,
    )
    initial = np.asarray([0.0, 0.0, 8.5, 0.0, 0.0, 40.7], dtype=float)
    training_parameters, training_fit = fit_curve(
        training_views,
        provider_x,
        provider_to_panorama,
        initial,
    )
    holdout_parameters, holdout_fit = fit_curve(
        holdout_views,
        provider_x,
        provider_to_panorama,
        initial,
    )
    training_curve = curve_points(training_parameters, provider_x)
    holdout_curve = curve_points(holdout_parameters, provider_x)
    curve_disagreement = np.linalg.norm(training_curve - holdout_curve, axis=1)
    leave_one_out = []
    leave_one_out_p95 = []
    leave_one_out_success = True
    for omitted_index, omitted_view in enumerate(training_views):
        retained_views = [
            view
            for view_index, view in enumerate(training_views)
            if view_index != omitted_index
        ]
        parameters, fit = fit_curve(
            retained_views,
            provider_x,
            provider_to_panorama,
            training_parameters,
        )
        curve = curve_points(parameters, provider_x)
        disagreement = np.linalg.norm(training_curve - curve, axis=1)
        summary = values_summary(disagreement)
        p95 = float(summary["p95"])
        leave_one_out_p95.append(p95)
        leave_one_out_success = leave_one_out_success and fit["success"]
        leave_one_out.append({
            "omittedSeatId": omitted_view["seatId"],
            "retainedSeatIds": [view["seatId"] for view in retained_views],
            "parameters": [round(float(value), 12) for value in parameters],
            "fit": fit,
            "curveDisagreementFromFullTrainingFitMetres": summary,
        })
    all_views = [*training_views, *holdout_views]
    render_diagnostic(
        args.output_png,
        all_views,
        training_curve,
        holdout_curve,
        provider_to_panorama,
    )
    holdout_image_residuals = np.asarray([
        record["absoluteVerticalPixelResidual"]["p95"]
        for record in training_fit["perView"]
    ], dtype=float)
    independent_holdout_image_residuals = np.asarray([
        record["absoluteVerticalPixelResidual"]["p95"]
        for record in holdout_fit["perView"]
    ], dtype=float)
    disagreement_p95 = float(np.percentile(curve_disagreement, 95))
    maximum_leave_one_out_p95 = float(np.max(leave_one_out_p95))
    dominant_curve_uncertainty_p95 = max(
        disagreement_p95,
        maximum_leave_one_out_p95,
    )
    horizontal_combined_95 = math.hypot(
        float(datum["combinedAccuracy"]["horizontal95Metres"]),
        dominant_curve_uncertainty_p95,
    )
    vertical_combined_95 = math.hypot(
        float(datum["combinedAccuracy"]["vertical95Metres"]),
        dominant_curve_uncertainty_p95,
    )
    measurement_eligible = bool(
        training_fit["success"]
        and holdout_fit["success"]
        and leave_one_out_success
        and float(np.max(independent_holdout_image_residuals))
        <= args.maximum_holdout_image_residual_p95_pixels
        and disagreement_p95 <= args.maximum_curve_disagreement_metres
        and maximum_leave_one_out_p95
        <= args.maximum_leave_one_out_curve_disagreement_metres
        and horizontal_combined_95 <= 0.3048
        and vertical_combined_95 <= 0.3048
    )
    affine = np.asarray(
        datum["inputs"]["sectionRegistration"]["sectionFit"]["affineParameters"],
        dtype=float,
    )
    projected = np.column_stack([
        training_curve[:, 0],
        training_curve[:, 2],
        np.ones(training_curve.shape[0]),
    ]) @ affine
    navd88 = training_curve[:, 1] + float(
        datum["verticalDatum"]["fittedTrainingOffsetNavd88MinusProviderYMetres"]
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
        "artifactStage": "cross-validated-multi-view-opening-boundary-curve",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "calibration": {
                "path": str(args.calibration),
                "sha256": file_sha256(args.calibration),
                "artifactVersion": calibration["artifactVersion"],
            },
            "surface": {
                "path": str(args.surface),
                "sha256": file_sha256(args.surface),
                "artifactVersion": surface["artifactVersion"],
            },
            "verticalDatum": {
                "path": str(args.vertical_datum),
                "sha256": file_sha256(args.vertical_datum),
                "artifactVersion": datum["artifactVersion"],
            },
            "trainingViews": [view_metadata(view) for view in training_views],
            "holdoutViews": [view_metadata(view) for view in holdout_views],
        },
        "parameters": {
            "providerXMinimum": args.provider_x_minimum,
            "providerXMaximum": args.provider_x_maximum,
            "curveSamples": args.curve_samples,
            "curveModel": "quadratic provider y and z as functions of normalized provider x",
            "maximumWidth": args.maximum_width,
            "minimumTransitionScore": args.minimum_transition_score,
            "maximumHoldoutImageResidualP95Pixels": args.maximum_holdout_image_residual_p95_pixels,
            "maximumCurveDisagreementMetres": args.maximum_curve_disagreement_metres,
            "maximumLeaveOneOutCurveDisagreementMetres": args.maximum_leave_one_out_curve_disagreement_metres,
        },
        "trainingFit": {
            "parameters": [round(float(value), 12) for value in training_parameters],
            **training_fit,
        },
        "holdoutFit": {
            "parameters": [round(float(value), 12) for value in holdout_parameters],
            **holdout_fit,
        },
        "crossValidation": {
            "curveDisagreementMetres": values_summary(curve_disagreement),
            "trainingViewP95PixelResiduals": values_summary(holdout_image_residuals),
            "holdoutViewP95PixelResiduals": values_summary(independent_holdout_image_residuals),
            "leaveOneTrainingViewOut": leave_one_out,
            "leaveOneOutP95CurveDisagreementMetres": values_summary(
                np.asarray(leave_one_out_p95, dtype=float)
            ),
            "dominantCurveUncertaintyP95Metres": round(
                dominant_curve_uncertainty_p95,
                6,
            ),
        },
        "georeferencedCurve": {
            "coordinateReferenceSystem": "EPSG:6347 horizontal and EPSG:5703 NAVD88 Geoid18 vertical, metres",
            "points": [
                {
                    "providerLocalMetres": [round(float(value), 6) for value in local],
                    "eastMetres": round(float(xy[0]), 6),
                    "northMetres": round(float(xy[1]), 6),
                    "navd88Metres": round(float(elevation), 6),
                }
                for local, xy, elevation in zip(training_curve, projected, navd88)
            ],
        },
        "combinedAccuracy": {
            "horizontal95Metres": round(horizontal_combined_95, 6),
            "vertical95Metres": round(vertical_combined_95, 6),
            "withinOneFoot": bool(
                horizontal_combined_95 <= 0.3048
                and vertical_combined_95 <= 0.3048
            ),
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
        },
        "semanticScope": {
            "established": (
                "candidate overhead-to-open-view boundary segment over provider x "
                f"from {args.provider_x_minimum:g} to {args.provider_x_maximum:g} metres"
            ),
            "notEstablished": [
                "full section-width boundary",
                "beam cross section",
                "connection to the measured deck plane",
                "closed obstruction volume",
            ],
        },
        "assessment": {
            "georeferencedBoundaryCurveMeasurementEligible": measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "FULL_SECTION_WIDTH_BOUNDARY_NOT_MEASURED",
                "BEAM_CROSS_SECTION_NOT_MEASURED",
                "CLOSED_OBSTRUCTION_VOLUME_NOT_COMPLETE",
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
        "trainingP95Pixels": training_fit["perView"],
        "holdoutP95Pixels": holdout_fit["perView"],
        "curveDisagreementP95Metres": round(disagreement_p95, 6),
        "maximumLeaveOneOutCurveDisagreementP95Metres": round(
            maximum_leave_one_out_p95,
            6,
        ),
        "dominantCurveUncertaintyP95Metres": round(
            dominant_curve_uncertainty_p95,
            6,
        ),
        "horizontalAccuracy95Metres": round(horizontal_combined_95, 6),
        "verticalAccuracy95Metres": round(vertical_combined_95, 6),
        "measurementEligible": measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
