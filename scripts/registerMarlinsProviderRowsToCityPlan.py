#!/usr/bin/env python3
"""Fit a diagnostic provider-row similarity to City design-plan linework.

The fit uses training row centroids and reports disjoint row-key holdouts. Dark
plan line proximity is not semantic row identity, as-built proof, or current
geometry. The artifact is deliberately fail-closed.
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
from scipy.ndimage import distance_transform_edt, map_coordinates
from scipy.optimize import differential_evolution, minimize


ANALYSIS_VERSION = "marlins-provider-city-plan-line-registration-v1"
METRES_TO_FEET = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def stable_holdout(row_key: str) -> bool:
    digest = hashlib.sha256(row_key.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    if finite.size == 0:
        return {
            "count": 0,
            "minimum": None,
            "median": None,
            "p95": None,
            "maximum": None,
        }
    return {
        "count": int(finite.size),
        "minimum": float(np.min(finite)),
        "median": float(np.median(finite)),
        "p95": float(np.percentile(finite, 95)),
        "maximum": float(np.max(finite)),
    }


def transform(points: np.ndarray, parameters: np.ndarray) -> np.ndarray:
    log_pixels_per_metre, theta, home_x, home_y = parameters
    scale = math.exp(float(log_pixels_per_metre))
    cosine = math.cos(float(theta))
    sine = math.sin(float(theta))
    rotation = np.asarray([[cosine, -sine], [sine, cosine]])
    return points @ rotation.T * scale + np.asarray([home_x, home_y])


def sample_distance(distance: np.ndarray, points: np.ndarray) -> np.ndarray:
    return map_coordinates(
        distance,
        np.vstack((points[:, 1], points[:, 0])),
        order=1,
        mode="constant",
        cval=float(max(distance.shape)),
        prefilter=False,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("plan", type=Path)
    parser.add_argument("plan_review", type=Path)
    parser.add_argument("metric_render_manifest", type=Path)
    parser.add_argument("provider_home_control", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_image", type=Path)
    parser.add_argument("--minimum-elevation-metres", type=float, default=1.0)
    parser.add_argument("--maximum-elevation-metres", type=float, default=12.0)
    parser.add_argument("--dark-threshold", type=int, default=185)
    parser.add_argument("--minimum-pixels-per-metre", type=float, default=6.2)
    parser.add_argument("--maximum-pixels-per-metre", type=float, default=7.4)
    parser.add_argument("--minimum-rotation-degrees", type=float, default=28.0)
    parser.add_argument("--maximum-rotation-degrees", type=float, default=48.0)
    parser.add_argument("--minimum-home-x", type=float, default=1520.0)
    parser.add_argument("--maximum-home-x", type=float, default=1660.0)
    parser.add_argument("--minimum-home-y", type=float, default=920.0)
    parser.add_argument("--maximum-home-y", type=float, default=1060.0)
    parser.add_argument("--seed", type=int, default=20260811)
    arguments = parser.parse_args()
    if arguments.maximum_elevation_metres < arguments.minimum_elevation_metres:
        raise ValueError("Elevation range is inverted")
    if not 0 <= arguments.dark_threshold <= 255:
        raise ValueError("Dark threshold must be in [0, 255]")

    rows = json.loads(arguments.rows.read_text())
    plan_review = json.loads(arguments.plan_review.read_text())
    metric_render_manifest = json.loads(arguments.metric_render_manifest.read_text())
    provider_home = json.loads(arguments.provider_home_control.read_text())
    if rows.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Rows input has the wrong artifact kind")
    if rows.get("stadiumId") != "marlins":
        raise ValueError("Rows input targets the wrong stadium")
    if plan_review.get("artifactKind") != "marlins-city-weblink-design-plan-manual-review":
        raise ValueError("Plan review input has the wrong artifact kind")
    if plan_review.get("stadiumId") != "marlins":
        raise ValueError("Plan review targets the wrong stadium")
    if provider_home.get("artifactKind") != "provider-local-home-plate-arc-center":
        raise ValueError("Provider home input has the wrong artifact kind")
    if not provider_home.get("assessment", {}).get("numericArcCenterMeasurementEligible"):
        raise ValueError("Provider home arc center did not pass its numeric gate")
    if provider_home.get("assessment", {}).get("providerHomePlateSemanticsIndependentlyProven"):
        raise ValueError("Provider home semantics unexpectedly report as proven")

    if metric_render_manifest.get("analysisVersion") != "pdf-review-render-v1":
        raise ValueError("Metric render manifest has the wrong analysis version")
    if metric_render_manifest.get("sourcePageCount") != 96:
        raise ValueError("Metric render manifest has the wrong source page count")
    if metric_render_manifest.get("renderedPageRange") != [43, 48]:
        raise ValueError("Metric render manifest has the wrong page range")
    if metric_render_manifest.get("source", {}).get("sha256") != plan_review.get(
        "inputs", {}
    ).get("designDevelopmentPlans", {}).get("sha256"):
        raise ValueError("Metric render source does not match the reviewed plan PDF")
    plan_record = next(
        record
        for record in metric_render_manifest["pages"]
        if record["pageNumber"] == 43
    )
    if Path(plan_record["path"]).resolve() != arguments.plan.resolve():
        raise ValueError("Plan review points to a different page-43 image")
    if plan_record["sha256"] != sha256_file(arguments.plan):
        raise ValueError("Plan page checksum does not match the manual review")

    source = cv2.imread(str(arguments.plan), cv2.IMREAD_COLOR)
    if source is None:
        raise ValueError("Could not read plan image")
    rotated = cv2.rotate(source, cv2.ROTATE_90_CLOCKWISE)
    grayscale = cv2.cvtColor(rotated, cv2.COLOR_BGR2GRAY)
    dark = grayscale <= arguments.dark_threshold
    dark = cv2.morphologyEx(
        dark.astype(np.uint8),
        cv2.MORPH_OPEN,
        np.ones((2, 2), dtype=np.uint8),
    ).astype(bool)
    distance = distance_transform_edt(~dark)

    provider_home_x, _, provider_home_z = provider_home["measurement"][
        "homePlateArcCenterProviderPositionMetres"
    ]
    provider_origin = np.asarray([float(provider_home_x), -float(provider_home_z)])
    records = []
    for row in rows.get("rows", []):
        direct = [
            anchor
            for anchor in row.get("anchors", [])
            if anchor.get("directProvider3dMeasurement", True)
            and anchor.get("coordinateProvenance", "DIRECT_PROVIDER_3D_CONFIG")
            == "DIRECT_PROVIDER_3D_CONFIG"
        ]
        if len(direct) < 2:
            continue
        anchors = np.asarray([anchor["position"] for anchor in direct], dtype=float)
        elevation = float(np.median(anchors[:, 1]))
        if not (
            arguments.minimum_elevation_metres
            <= elevation
            <= arguments.maximum_elevation_metres
        ):
            continue
        row_key = str(row["rowKey"])
        center = np.median(anchors[:, [0, 2]], axis=0)
        provider_point = np.asarray([center[0], -center[1]]) - provider_origin
        records.append({
            "rowKey": row_key,
            "sectionId": row.get("sectionId"),
            "rowId": row.get("rowId"),
            "elevationMetres": elevation,
            "providerPoint": provider_point,
            "partition": "holdout" if stable_holdout(row_key) else "training",
        })
    training = [record for record in records if record["partition"] == "training"]
    holdout = [record for record in records if record["partition"] == "holdout"]
    if len(training) < 500 or len(holdout) < 100:
        raise ValueError("Plan registration lacks enough disjoint row controls")
    training_points = np.asarray([record["providerPoint"] for record in training])

    def objective(parameters: np.ndarray) -> float:
        distances = sample_distance(distance, transform(training_points, parameters))
        finite = distances[np.isfinite(distances)]
        if finite.size == 0:
            return 1_000_000.0
        return float(
            np.percentile(finite, 50)
            + 0.45 * np.percentile(finite, 80)
            + 0.20 * np.percentile(finite, 95)
        )

    bounds = [
        (
            math.log(arguments.minimum_pixels_per_metre),
            math.log(arguments.maximum_pixels_per_metre),
        ),
        (
            math.radians(arguments.minimum_rotation_degrees),
            math.radians(arguments.maximum_rotation_degrees),
        ),
        (arguments.minimum_home_x, arguments.maximum_home_x),
        (arguments.minimum_home_y, arguments.maximum_home_y),
    ]
    global_fit = differential_evolution(
        objective,
        bounds,
        seed=arguments.seed,
        popsize=18,
        maxiter=200,
        tol=1e-7,
        polish=False,
        updating="immediate",
        workers=1,
    )
    local_fit = minimize(
        objective,
        global_fit.x,
        method="Nelder-Mead",
        options={
            "maxiter": 4_000,
            "xatol": 1e-9,
            "fatol": 1e-9,
        },
    )
    parameters = local_fit.x
    scale = math.exp(float(parameters[0]))
    rotation_degrees = math.degrees(float(parameters[1]))

    def evaluate(selected: list[dict[str, Any]]) -> tuple[np.ndarray, np.ndarray]:
        source_points = np.asarray([record["providerPoint"] for record in selected])
        plan_points = transform(source_points, parameters)
        residual_pixels = sample_distance(distance, plan_points)
        return plan_points, residual_pixels

    training_plan_points, training_residual_pixels = evaluate(training)
    holdout_plan_points, holdout_residual_pixels = evaluate(holdout)
    pixels_to_feet = METRES_TO_FEET / scale
    training_residual_feet = training_residual_pixels * pixels_to_feet
    holdout_residual_feet = holdout_residual_pixels * pixels_to_feet
    holdout_records = []
    for record, point, residual_pixels, residual_feet in zip(
        holdout,
        holdout_plan_points,
        holdout_residual_pixels,
        holdout_residual_feet,
    ):
        holdout_records.append({
            "rowKey": record["rowKey"],
            "sectionId": record["sectionId"],
            "rowId": record["rowId"],
            "elevationMetres": record["elevationMetres"],
            "planPixel": [float(value) for value in point],
            "nearestDarkLineResidualPixels": float(residual_pixels),
            "nearestDarkLineResidualFeet": float(residual_feet),
        })

    review = cv2.addWeighted(
        rotated,
        0.75,
        np.full_like(rotated, 255),
        0.25,
        0.0,
    )
    for point in training_plan_points:
        cv2.circle(
            review,
            (int(round(point[0])), int(round(point[1]))),
            1,
            (0, 150, 255),
            -1,
            cv2.LINE_AA,
        )
    for point in holdout_plan_points:
        cv2.circle(
            review,
            (int(round(point[0])), int(round(point[1]))),
            2,
            (0, 0, 255),
            -1,
            cv2.LINE_AA,
        )
    fit_origin = (int(round(parameters[2])), int(round(parameters[3])))
    cv2.drawMarker(
        review,
        fit_origin,
        (255, 0, 0),
        cv2.MARKER_CROSS,
        28,
        2,
        cv2.LINE_AA,
    )
    arguments.output_image.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(arguments.output_image), review, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write plan registration review image")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "inputs": {
            "rows": {
                "path": str(arguments.rows),
                "sha256": sha256_file(arguments.rows),
                "artifactVersion": rows.get("artifactVersion"),
            },
            "plan": {
                "path": str(arguments.plan),
                "sha256": sha256_file(arguments.plan),
                "pdfPage": 43,
                "sheetId": "A21",
                "rotation": "90-degrees-clockwise",
            },
            "planReview": {
                "path": str(arguments.plan_review),
                "sha256": sha256_file(arguments.plan_review),
                "artifactVersion": plan_review.get("artifactVersion"),
            },
            "metricRenderManifest": {
                "path": str(arguments.metric_render_manifest),
                "sha256": sha256_file(arguments.metric_render_manifest),
                "artifactVersion": metric_render_manifest.get("artifactVersion"),
            },
            "providerHomeControl": {
                "path": str(arguments.provider_home_control),
                "sha256": sha256_file(arguments.provider_home_control),
                "artifactVersion": provider_home.get("artifactVersion"),
            },
        },
        "method": {
            "description": "Robust global similarity fitted from provider row centroids to nearest dark City plan linework",
            "split": "sha256(rowKey) modulo 5",
            "planLineSemantics": "unlabeled-dark-line-proximity",
            "planDarkThreshold": arguments.dark_threshold,
            "minimumElevationMetres": arguments.minimum_elevation_metres,
            "maximumElevationMetres": arguments.maximum_elevation_metres,
            "objective": "training median plus 0.45 times p80 plus 0.20 times p95 nearest-line pixel distance",
            "globalOptimizer": "differential-evolution",
            "localOptimizer": "Nelder-Mead",
            "limitations": [
                "Dense adjacent row lines permit integer-row ambiguity",
                "Dark plan text and non-row linework can attract individual row centroids",
                "The holdout tests line-proximity transfer but does not independently prove row labels",
                "The provider arc-center semantics remain unproven",
                "The City plan is historical design-development, not current as-built geometry",
            ],
        },
        "fit": {
            "pixelsPerMetre": scale,
            "rotationDegrees": rotation_degrees,
            "providerArcCenterPlanPixel": [float(parameters[2]), float(parameters[3])],
            "globalOptimizationSucceeded": bool(global_fit.success),
            "globalOptimizationMessage": str(global_fit.message),
            "localOptimizationSucceeded": bool(local_fit.success),
            "localOptimizationMessage": str(local_fit.message),
            "objectiveValue": float(objective(parameters)),
            "parameterBounds": {
                "pixelsPerMetre": [
                    arguments.minimum_pixels_per_metre,
                    arguments.maximum_pixels_per_metre,
                ],
                "rotationDegrees": [
                    arguments.minimum_rotation_degrees,
                    arguments.maximum_rotation_degrees,
                ],
                "homeX": [arguments.minimum_home_x, arguments.maximum_home_x],
                "homeY": [arguments.minimum_home_y, arguments.maximum_home_y],
            },
        },
        "counts": {
            "eligibleProviderRows": len(records),
            "trainingRows": len(training),
            "holdoutRows": len(holdout),
        },
        "trainingNearestLineResidualPixels": summary(training_residual_pixels),
        "trainingNearestLineResidualFeet": summary(training_residual_feet),
        "holdoutNearestLineResidualPixels": summary(holdout_residual_pixels),
        "holdoutNearestLineResidualFeet": summary(holdout_residual_feet),
        "holdoutRows": holdout_records,
        "assessment": {
            "optimizationConverged": bool(local_fit.success),
            "holdoutMedianAtOrBelowOneFoot": bool(
                np.percentile(holdout_residual_feet, 50) <= 1.0
            ),
            "holdoutP95AtOrBelowOneFoot": bool(
                np.percentile(holdout_residual_feet, 95) <= 1.0
            ),
            "semanticRowIdentityEstablished": False,
            "providerArcCenterToHomePlateSemanticsEstablished": False,
            "planMetricAccuracyEstablished": False,
            "currentAsBuiltAgreementEstablished": False,
            "measurementEligible": False,
        },
        "geometryBoundary": {
            "establishesHistoricalPlanLineAgreementCandidate": True,
            "establishesSemanticRowIdentity": False,
            "establishesSubFootAbsoluteHorizontalAccuracy": False,
            "establishesMeasuredRowGeometry": False,
            "establishesCurrentAsBuiltGeometry": False,
            "establishesRowElevations": False,
            "establishesIndependentShadowValidation": False,
        },
        "reviewImage": {
            "path": str(arguments.output_image),
            "sha256": sha256_file(arguments.output_image),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "NEAREST_DARK_LINE_IS_NOT_SEMANTIC_ROW_CONTROL",
                "INTEGER_ROW_AMBIGUITY_NOT_RESOLVED",
                "PROVIDER_ARC_CENTER_TO_HOME_PLATE_SEMANTICS_NOT_PROVEN",
                "PLAN_SCAN_METRIC_ACCURACY_NOT_ESTABLISHED",
                "DESIGN_DEVELOPMENT_IS_NOT_CURRENT_AS_BUILT",
                "ROW_ELEVATIONS_NOT_COMPLETE",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "marlins-provider-city-plan-line-registration-candidate",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(arguments.output_json),
        "outputImage": str(arguments.output_image),
        "artifactVersion": artifact["artifactVersion"],
        "fit": artifact["fit"],
        "counts": artifact["counts"],
        "trainingNearestLineResidualFeet": artifact["trainingNearestLineResidualFeet"],
        "holdoutNearestLineResidualFeet": artifact["holdoutNearestLineResidualFeet"],
        "assessment": artifact["assessment"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
