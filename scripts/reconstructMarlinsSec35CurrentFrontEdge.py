#!/usr/bin/env python3
"""Cross-validate a current provider-model upper-deck front-edge segment.

The camera split, semantic image region, curve scope, and acceptance thresholds
are fixed in this source before the final holdout is evaluated. The artifact is
provider-model geometry only. It never claims physical as-built measurement or
publication eligibility.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from scipy.optimize import least_squares

from extractPanoramaOpeningBoundary import detect_opening_boundary
from reconstructPanoramaDenseOverhang import values_summary
from validatePanoramaOverhangFrontEdge import project_provider_points


ANALYSIS_VERSION = "marlins-sec35-current-provider-front-edge-v1"
MAXIMUM_WIDTH = 4096
X_BOUNDS = (0.38, 0.62)
Y_BOUNDS = (0.34, 0.54)
CONTRAST_OFFSET_PIXELS = 10
MINIMUM_TRANSITION_SCORE = 18.0
PROVIDER_Z_KNOTS_METRES = np.linspace(23.0, 38.0, 11)
SMOOTHNESS_WEIGHT = 20.0
MAXIMUM_FINAL_VIEW_P95_RESIDUAL_PIXELS = 5.0
MAXIMUM_CURVE_DISAGREEMENT_P95_METRES = 0.3048
MAXIMUM_LEAVE_ONE_OUT_DISAGREEMENT_P95_METRES = 0.3048
MINIMUM_PROJECTED_VALID_FRACTION = 0.90

# The split was fixed after development on the training and development views.
# The final views were not used to select the curve span, model, or thresholds.
TRAINING_SEAT_IDS = (
    "S_SEC35-10-3",
    "S_SEC35-11wc-2",
    "S_SEC35-10-21",
    "S_SEC35-11wc-13",
    "S_SEC35-10-7",
    "S_SEC35-11wc-4",
    "S_SEC35-10-14",
    "S_SEC35-11wc-9",
)
DEVELOPMENT_SEAT_IDS = (
    "S_SEC35-10-12",
    "S_SEC35-11wc-8",
    "S_SEC35-10-16",
    "S_SEC35-11wc-10",
    "S_SEC35-10-5",
    "S_SEC35-11wc-3",
    "S_SEC35-10-10",
    "S_SEC35-11wc-7",
    "S_SEC35-10-18",
    "S_SEC35-11wc-12",
)
FINAL_SEAT_IDS = (
    "S_SEC35-10-23",
    "S_SEC35-10-27",
    "S_SEC35-11wc-14",
    "S_SEC35-11wc-17",
    "S_SEC35-10-25",
    "S_SEC35-10-28",
    "S_SEC35-11wc-16",
    "S_SEC35-11wc-18",
    "S_SEC35-10-30",
    "S_SEC35-11wc-19",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
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


def initial_parameters() -> np.ndarray:
    normalized = (PROVIDER_Z_KNOTS_METRES - 30.0) / 15.0
    provider_x = 104.5 - 4.0 * normalized + 1.5 * normalized * normalized
    provider_y = 12.7 - 0.12 * normalized - 0.25 * normalized * normalized
    return np.concatenate([provider_x, provider_y])


def curve_from_parameters(
    parameters: np.ndarray,
    provider_z: np.ndarray = PROVIDER_Z_KNOTS_METRES,
) -> np.ndarray:
    knot_count = PROVIDER_Z_KNOTS_METRES.size
    provider_x = np.interp(
        provider_z,
        PROVIDER_Z_KNOTS_METRES,
        parameters[:knot_count],
    )
    provider_y = np.interp(
        provider_z,
        PROVIDER_Z_KNOTS_METRES,
        parameters[knot_count:],
    )
    return np.column_stack([provider_x, provider_y, provider_z])


def load_view(entry: dict[str, Any]) -> dict[str, Any]:
    image_path = Path(entry["localPath"])
    expected_sha256 = entry.get("imageSha256")
    actual_sha256 = file_sha256(image_path)
    if expected_sha256 is not None and expected_sha256 != actual_sha256:
        raise ValueError(f"Image checksum mismatch for {image_path}")
    source = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if source is None:
        raise ValueError(f"Could not load panorama {image_path}")
    source_height, source_width = source.shape[:2]
    scale = min(1.0, MAXIMUM_WIDTH / source_width)
    width = int(round(source_width * scale))
    height = int(round(source_height * scale))
    image = cv2.resize(source, (width, height), interpolation=cv2.INTER_AREA)
    boundary, transition_scores, valid = detect_opening_boundary(
        image,
        X_BOUNDS[0],
        X_BOUNDS[1],
        Y_BOUNDS[0],
        Y_BOUNDS[1],
        CONTRAST_OFFSET_PIXELS,
        MINIMUM_TRANSITION_SCORE,
    )
    return {
        "seatId": entry["seatId"],
        "imagePath": str(image_path),
        "imageSha256": actual_sha256,
        "config": entry["config"],
        "image": image,
        "width": width,
        "height": height,
        "boundary": boundary,
        "transitionScores": transition_scores,
        "valid": valid,
        "validBoundaryFraction": float(np.mean(valid)),
    }


def projected_boundary_residuals(
    curve: np.ndarray,
    view: dict[str, Any],
    provider_to_panorama: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    pixels = project_provider_points(
        curve,
        np.asarray(view["config"]["p"], dtype=float),
        provider_to_panorama,
        float(view["config"]["rp"][1]),
        int(view["width"]),
        int(view["height"]),
    )
    boundary = view["boundary"]
    clipped_x = np.clip(pixels[:, 0], boundary[0, 0], boundary[-1, 0])
    expected_y = np.interp(clipped_x, boundary[:, 0], boundary[:, 1])
    expected_valid = np.interp(
        clipped_x,
        boundary[:, 0],
        view["valid"].astype(float),
    ) >= 0.5
    inside = (
        (pixels[:, 0] >= boundary[0, 0])
        & (pixels[:, 0] <= boundary[-1, 0])
    )
    return pixels, pixels[:, 1] - expected_y, inside & expected_valid


def objective_residuals(
    parameters: np.ndarray,
    views: list[dict[str, Any]],
    provider_to_panorama: np.ndarray,
) -> np.ndarray:
    curve = curve_from_parameters(parameters)
    residuals: list[float] = []
    for view in views:
        pixels, vertical_residuals, _ = projected_boundary_residuals(
            curve,
            view,
            provider_to_panorama,
        )
        boundary = view["boundary"]
        outside = (
            np.maximum(boundary[0, 0] - pixels[:, 0], 0.0)
            + np.maximum(pixels[:, 0] - boundary[-1, 0], 0.0)
        )
        residuals.extend(vertical_residuals.tolist())
        residuals.extend((0.3 * outside).tolist())
    knot_count = PROVIDER_Z_KNOTS_METRES.size
    residuals.extend(
        (SMOOTHNESS_WEIGHT * np.diff(parameters[:knot_count], 2)).tolist()
    )
    residuals.extend(
        (SMOOTHNESS_WEIGHT * np.diff(parameters[knot_count:], 2)).tolist()
    )
    return np.asarray(residuals, dtype=float)


def fit_curve(
    views: list[dict[str, Any]],
    provider_to_panorama: np.ndarray,
    initial: np.ndarray,
) -> tuple[np.ndarray, dict[str, Any]]:
    result = least_squares(
        objective_residuals,
        initial,
        args=(views, provider_to_panorama),
        loss="soft_l1",
        f_scale=3.0,
        max_nfev=20_000,
        xtol=1e-11,
        ftol=1e-11,
        gtol=1e-11,
    )
    dense_curve = curve_from_parameters(result.x, np.linspace(23.0, 38.0, 301))
    per_view = []
    for view in views:
        _, residuals, valid = projected_boundary_residuals(
            dense_curve,
            view,
            provider_to_panorama,
        )
        per_view.append({
            "seatId": view["seatId"],
            "absoluteVerticalPixelResidual": values_summary(np.abs(residuals)),
            "projectedValidFraction": round(float(np.mean(valid)), 6),
            "detectedBoundaryValidFraction": round(
                float(view["validBoundaryFraction"]),
                6,
            ),
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


def curve_disagreement(
    first: np.ndarray,
    second: np.ndarray,
) -> dict[str, float | int | None]:
    provider_z = np.linspace(23.0, 38.0, 301)
    separation = np.linalg.norm(
        curve_from_parameters(first, provider_z)
        - curve_from_parameters(second, provider_z),
        axis=1,
    )
    return values_summary(separation)


def render_diagnostic(
    path: Path,
    groups: list[tuple[str, list[dict[str, Any]]]],
    curves: list[tuple[str, np.ndarray, tuple[int, int, int]]],
    provider_to_panorama: np.ndarray,
) -> None:
    panels = []
    dense_z = np.linspace(23.0, 38.0, 301)
    for group_name, views in groups:
        for view in views:
            image = view["image"].copy()
            detected = np.round(
                view["boundary"][view["valid"]]
            ).astype(np.int32).reshape(-1, 1, 2)
            if detected.shape[0] >= 2:
                cv2.polylines(image, [detected], False, (0, 255, 255), 3, cv2.LINE_AA)
            for _, parameters, color in curves:
                pixels, _, _ = projected_boundary_residuals(
                    curve_from_parameters(parameters, dense_z),
                    view,
                    provider_to_panorama,
                )
                polyline = np.round(pixels).astype(np.int32).reshape(-1, 1, 2)
                cv2.polylines(image, [polyline], False, color, 4, cv2.LINE_AA)
            cv2.putText(
                image,
                f"{group_name}: {view['seatId']}",
                (20, 45),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.1,
                (0, 255, 255),
                3,
                cv2.LINE_AA,
            )
            panels.append(cv2.resize(image, (700, 350), interpolation=cv2.INTER_AREA))
    if len(panels) % 2:
        panels.append(np.full_like(panels[0], 245))
    rows = [np.hstack(panels[index:index + 2]) for index in range(0, len(panels), 2)]
    diagnostic = np.vstack(rows)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(path), diagnostic):
        raise ValueError(f"Could not write diagnostic {path}")


def view_metadata(view: dict[str, Any]) -> dict[str, Any]:
    return {
        "seatId": view["seatId"],
        "imagePath": view["imagePath"],
        "imageSha256": view["imageSha256"],
        "providerPositionMetres": view["config"]["p"],
        "providerYawDegrees": view["config"]["rp"][1],
    }


def main() -> None:
    args = parse_args()
    manifest = json.loads(args.manifest.read_text())
    calibration = json.loads(args.calibration.read_text())
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Provider-frame calibration is not measurement eligible")
    split_sets = [set(TRAINING_SEAT_IDS), set(DEVELOPMENT_SEAT_IDS), set(FINAL_SEAT_IDS)]
    if any(split_sets[index] & split_sets[other] for index in range(3) for other in range(index + 1, 3)):
        raise ValueError("Camera splits overlap")
    entries = {entry["seatId"]: entry for entry in manifest["images"]}
    required_seats = set().union(*split_sets)
    missing = sorted(required_seats - set(entries))
    if missing:
        raise ValueError(f"Manifest is missing required seats: {missing}")
    training_views = [load_view(entries[seat_id]) for seat_id in TRAINING_SEAT_IDS]
    development_views = [load_view(entries[seat_id]) for seat_id in DEVELOPMENT_SEAT_IDS]
    final_views = [load_view(entries[seat_id]) for seat_id in FINAL_SEAT_IDS]
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"],
        dtype=float,
    )
    initial = initial_parameters()
    training_parameters, training_fit = fit_curve(
        training_views,
        provider_to_panorama,
        initial,
    )
    development_parameters, development_fit = fit_curve(
        development_views,
        provider_to_panorama,
        initial,
    )
    final_parameters, final_fit = fit_curve(
        final_views,
        provider_to_panorama,
        initial,
    )
    leave_one_out = []
    leave_one_out_p95 = []
    for omitted_index, omitted_view in enumerate(training_views):
        retained = [
            view for index, view in enumerate(training_views)
            if index != omitted_index
        ]
        parameters, fit = fit_curve(
            retained,
            provider_to_panorama,
            training_parameters,
        )
        disagreement = curve_disagreement(training_parameters, parameters)
        leave_one_out_p95.append(float(disagreement["p95"]))
        leave_one_out.append({
            "omittedSeatId": omitted_view["seatId"],
            "fitSuccess": fit["success"],
            "curveDisagreementMetres": disagreement,
        })
    development_disagreement = curve_disagreement(
        training_parameters,
        development_parameters,
    )
    final_disagreement = curve_disagreement(
        training_parameters,
        final_parameters,
    )
    final_p95_residuals = np.asarray([
        record["absoluteVerticalPixelResidual"]["p95"]
        for record in training_fit["perView"]
    ] + [
        record["absoluteVerticalPixelResidual"]["p95"]
        for record in final_fit["perView"]
    ], dtype=float)
    training_curve_on_final = []
    dense_curve = curve_from_parameters(
        training_parameters,
        np.linspace(23.0, 38.0, 301),
    )
    for view in final_views:
        _, residuals, valid = projected_boundary_residuals(
            dense_curve,
            view,
            provider_to_panorama,
        )
        training_curve_on_final.append({
            "seatId": view["seatId"],
            "absoluteVerticalPixelResidual": values_summary(np.abs(residuals)),
            "projectedValidFraction": round(float(np.mean(valid)), 6),
        })
    final_training_projection_p95 = np.asarray([
        record["absoluteVerticalPixelResidual"]["p95"]
        for record in training_curve_on_final
    ], dtype=float)
    final_training_projection_valid = np.asarray([
        record["projectedValidFraction"]
        for record in training_curve_on_final
    ], dtype=float)
    leave_one_out_passed = bool(
        leave_one_out_p95
        and max(leave_one_out_p95)
        <= MAXIMUM_LEAVE_ONE_OUT_DISAGREEMENT_P95_METRES
    )
    candidate_eligible = bool(
        training_fit["success"]
        and development_fit["success"]
        and final_fit["success"]
        and float(development_disagreement["p95"])
        <= MAXIMUM_CURVE_DISAGREEMENT_P95_METRES
        and float(final_disagreement["p95"])
        <= MAXIMUM_CURVE_DISAGREEMENT_P95_METRES
        and leave_one_out_passed
        and float(np.max(final_training_projection_p95))
        <= MAXIMUM_FINAL_VIEW_P95_RESIDUAL_PIXELS
        and float(np.min(final_training_projection_valid))
        >= MINIMUM_PROJECTED_VALID_FRACTION
    )
    render_diagnostic(
        args.output_png,
        [
            ("training", training_views),
            ("development", development_views),
            ("final", final_views),
        ],
        [
            ("training", training_parameters, (255, 255, 0)),
            ("development", development_parameters, (255, 0, 255)),
            ("final", final_parameters, (0, 255, 0)),
        ],
        provider_to_panorama,
    )
    stable = {
        "manifestSha256": file_sha256(args.manifest),
        "calibrationSha256": file_sha256(args.calibration),
        "trainingParameters": training_parameters.tolist(),
        "developmentParameters": development_parameters.tolist(),
        "finalParameters": final_parameters.tolist(),
        "outputPngSha256": file_sha256(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "cross-validated-current-provider-model-front-edge-segment",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        "inputs": {
            "manifest": {
                "path": str(args.manifest),
                "sha256": stable["manifestSha256"],
            },
            "calibration": {
                "path": str(args.calibration),
                "sha256": stable["calibrationSha256"],
                "artifactVersion": calibration["artifactVersion"],
            },
            "trainingViews": [view_metadata(view) for view in training_views],
            "developmentViews": [view_metadata(view) for view in development_views],
            "finalViews": [view_metadata(view) for view in final_views],
        },
        "parameters": {
            "maximumWidth": MAXIMUM_WIDTH,
            "semanticImageBoundsFractions": {
                "x": list(X_BOUNDS),
                "y": list(Y_BOUNDS),
            },
            "contrastOffsetPixels": CONTRAST_OFFSET_PIXELS,
            "minimumTransitionScore": MINIMUM_TRANSITION_SCORE,
            "providerZKnotsMetres": PROVIDER_Z_KNOTS_METRES.tolist(),
            "curveModel": "piecewise-linear provider x and y over fixed provider z knots",
            "smoothnessWeight": SMOOTHNESS_WEIGHT,
            "maximumFinalViewP95ResidualPixels": MAXIMUM_FINAL_VIEW_P95_RESIDUAL_PIXELS,
            "maximumCurveDisagreementP95Metres": MAXIMUM_CURVE_DISAGREEMENT_P95_METRES,
            "maximumLeaveOneOutDisagreementP95Metres": MAXIMUM_LEAVE_ONE_OUT_DISAGREEMENT_P95_METRES,
            "minimumProjectedValidFraction": MINIMUM_PROJECTED_VALID_FRACTION,
        },
        "semanticScope": {
            "established": "current provider-rendered central upper-deck lower-silhouette segment in section 35",
            "providerZMinimumMetres": 23.0,
            "providerZMaximumMetres": 38.0,
            "notEstablished": [
                "physical as-built persistence",
                "full section-width front edge",
                "deck underside surface",
                "attached monitors and side-wall occluders as separate solids",
                "closed obstruction volume",
                "any other stadium section or level",
            ],
        },
        "training": {
            "parameters": [round(float(value), 9) for value in training_parameters],
            "fit": training_fit,
        },
        "development": {
            "parameters": [round(float(value), 9) for value in development_parameters],
            "fit": development_fit,
            "curveDisagreementFromTrainingMetres": development_disagreement,
        },
        "finalHoldout": {
            "parameters": [round(float(value), 9) for value in final_parameters],
            "fit": final_fit,
            "curveDisagreementFromTrainingMetres": final_disagreement,
            "trainingCurveProjectedIntoFinalViews": training_curve_on_final,
            "trainingCurveFinalViewP95ResidualPixels": values_summary(
                final_training_projection_p95
            ),
            "trainingCurveFinalViewProjectedValidFraction": values_summary(
                final_training_projection_valid
            ),
        },
        "leaveOneTrainingViewOut": {
            "records": leave_one_out,
            "p95CurveDisagreementMetres": values_summary(
                np.asarray(leave_one_out_p95, dtype=float)
            ),
            "passed": leave_one_out_passed,
        },
        "geometry": {
            "coordinateFrame": "current 3DDV provider-local metres",
            "trainingCurvePoints": [
                [round(float(value), 6) for value in point]
                for point in curve_from_parameters(training_parameters)
            ],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": stable["outputPngSha256"],
            "legend": "yellow detected boundary, cyan training curve, magenta development curve, green final curve",
        },
        "assessment": {
            "currentProviderModelFrontEdgeCandidateEligible": candidate_eligible,
            "physicalAsBuiltMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "CURRENT_PROVIDER_RENDER_IS_NOT_PHYSICAL_AS_BUILT_MEASUREMENT",
                "PROVIDER_LOCAL_FRONT_EDGE_IS_NOT_SUB_FOOT_WORLD_REGISTERED",
                "FRONT_EDGE_SEGMENT_DOES_NOT_FORM_A_CLOSED_OCCLUDER",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "developmentCurveDisagreementP95Metres": development_disagreement["p95"],
        "finalCurveDisagreementP95Metres": final_disagreement["p95"],
        "maximumLeaveOneOutDisagreementP95Metres": max(leave_one_out_p95),
        "maximumTrainingCurveFinalViewP95ResidualPixels": round(
            float(np.max(final_training_projection_p95)),
            6,
        ),
        "minimumTrainingCurveFinalViewProjectedValidFraction": round(
            float(np.min(final_training_projection_valid)),
            6,
        ),
        "currentProviderModelFrontEdgeCandidateEligible": candidate_eligible,
        "physicalAsBuiltMeasurementEligible": False,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
