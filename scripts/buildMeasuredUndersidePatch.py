#!/usr/bin/env python3
"""Build an analytic obstruction from an observed concrete underside patch.

The patch is the convex support hull of measured training plane inliers. It is
not labeled as the physical slab perimeter. Rays may use its eroded interior to
confirm shade, but a miss outside the patch cannot establish sun because the
unobserved slab may continue beyond the sampled support.
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
from scipy.spatial import ConvexHull


ANALYSIS_VERSION = "measured-underside-analytic-patch-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("surface", type=Path)
    parser.add_argument("georeferenced_surface", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--stereo-ray-separation-limit-metres", type=float, default=0.02)
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


def polygon_area(points: np.ndarray) -> float:
    x_values = points[:, 0]
    y_values = points[:, 1]
    return abs(float(
        np.sum(x_values * np.roll(y_values, -1) - np.roll(x_values, -1) * y_values)
    )) / 2.0


def main() -> None:
    args = parse_args()
    surface = json.loads(args.surface.read_text())
    georeferenced = json.loads(args.georeferenced_surface.read_text())
    calibration = json.loads(args.calibration.read_text())
    if not surface["assessment"].get("providerLocalOverhangingDeckUndersideMeasurementEligible"):
        raise ValueError("Provider-local underside surface is not measurement eligible")
    if not georeferenced["assessment"].get("georeferencedObservedPatchMeasurementEligible"):
        raise ValueError("Georeferenced observed underside patch is not measurement eligible")
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Panorama-frame calibration is not measurement eligible")

    training_points = np.asarray([
        point["providerLocalMetres"]
        for point in surface["training"]["points"]
        if point["planeInlier"]
    ], dtype=float)
    if training_points.shape[0] < 30:
        raise ValueError("Too few training plane inliers for an observed patch")
    plan = training_points[:, [0, 2]]
    hull_indices = ConvexHull(plan).vertices
    hull = plan[hull_indices]
    plane_normal = np.asarray(
        surface["training"]["plane"]["normalProviderLocal"],
        dtype=float,
    )
    plane_offset = float(surface["training"]["plane"]["offsetMetres"])

    holdout_inside_counts = []
    holdout_plane_separations = []
    contour = hull.astype(np.float32).reshape(-1, 1, 2)
    for holdout in surface["holdouts"]:
        points = np.asarray([
            point["providerLocalMetres"]
            for point in holdout["points"]
            if point["planeInlier"]
        ], dtype=float)
        signed = np.asarray([
            cv2.pointPolygonTest(contour, (float(point[0]), float(point[2])), False)
            for point in points
        ])
        holdout_inside_counts.append({
            "source": {
                key: holdout[key]
                for key in (
                    "path",
                    "sha256",
                    "artifactVersion",
                    "leftSeatId",
                    "rightSeatId",
                )
            },
            "planeInlierPointCount": int(points.shape[0]),
            "insideTrainingSupportHullPointCount": int(np.count_nonzero(signed >= 0)),
            "insideTrainingSupportHullPercent": round(
                100.0 * np.count_nonzero(signed >= 0) / max(points.shape[0], 1),
                6,
            ),
        })
        holdout_plane_separations.append(
            float(holdout["comparisonToTraining"]["surfaceSeparationAtTrainingCentroidMetres"])
        )
    inside_total = sum(item["insideTrainingSupportHullPointCount"] for item in holdout_inside_counts)
    holdout_total = sum(item["planeInlierPointCount"] for item in holdout_inside_counts)
    holdout_inside_percent = 100.0 * inside_total / max(holdout_total, 1)
    separation_p95 = float(np.percentile(holdout_plane_separations, 95))
    calibration_vector_p95 = float(
        calibration["holdoutSummary"]["vectorErrorMetres"]["p95"]
    )
    local_surface_accuracy = math.sqrt(
        args.stereo_ray_separation_limit_metres ** 2
        + separation_p95 ** 2
        + calibration_vector_p95 ** 2
    )
    conservative_plan_erosion = float(
        georeferenced["combinedAccuracy"]["horizontal95Metres"]
    )

    width, height, padding = 1400, 900, 80
    minimum = np.min(hull, axis=0)
    maximum = np.max(hull, axis=0)
    scale = min(
        (width - 2 * padding) / max(maximum[0] - minimum[0], 1e-9),
        (height - 2 * padding) / max(maximum[1] - minimum[1], 1e-9),
    )
    pixels = np.column_stack([
        padding + (hull[:, 0] - minimum[0]) * scale,
        height - padding - (hull[:, 1] - minimum[1]) * scale,
    ]).round().astype(np.int32)
    image = np.full((height, width, 3), 245, dtype=np.uint8)
    cv2.fillPoly(image, [pixels.reshape(-1, 1, 2)], (215, 235, 250))
    cv2.polylines(image, [pixels.reshape(-1, 1, 2)], True, (30, 90, 220), 5, cv2.LINE_AA)
    for point in plan:
        pixel = (
            int(round(padding + (point[0] - minimum[0]) * scale)),
            int(round(height - padding - (point[1] - minimum[1]) * scale)),
        )
        cv2.circle(image, pixel, 3, (30, 130, 60), -1)
    cv2.putText(image, "observed training underside support patch, provider x versus z", (25, 48), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (20, 20, 20), 3, cv2.LINE_AA)
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_png), image):
        raise ValueError("Could not write underside-patch diagnostic")

    measurement_eligible = bool(
        holdout_inside_percent >= 50.0
        and surface["holdoutSummary"]["passed"]
        and local_surface_accuracy <= 0.3048
        and conservative_plan_erosion <= 0.3048
    )
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "provider-local-observed-analytic-underside-patch",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "surface": {"path": str(args.surface), "sha256": file_sha256(args.surface), "artifactVersion": surface["artifactVersion"]},
            "georeferencedSurface": {"path": str(args.georeferenced_surface), "sha256": file_sha256(args.georeferenced_surface), "artifactVersion": georeferenced["artifactVersion"]},
            "calibration": {"path": str(args.calibration), "sha256": file_sha256(args.calibration), "artifactVersion": calibration["artifactVersion"]},
        },
        "plane": {
            "normalProviderLocal": [round(float(value), 12) for value in plane_normal],
            "offsetMetres": round(plane_offset, 12),
            "equation": "normal dot providerLocalPoint + offset = 0",
        },
        "observedSupportPatch": {
            "geometryType": "Polygon",
            "providerLocalXzMetres": [
                [round(float(value), 6) for value in point]
                for point in hull
            ],
            "areaSquareMetres": round(polygon_area(hull), 6),
            "trainingPlaneInlierPointCount": int(training_points.shape[0]),
            "source": "convex support hull of visible training plane inliers",
            "restriction": "observed continuous support patch only, not the physical slab perimeter",
        },
        "crossValidation": {
            "holdoutPlaneSeparationMetres": values_summary(np.asarray(holdout_plane_separations)),
            "holdoutPatchChecks": holdout_inside_counts,
            "holdoutPlaneInlierCount": holdout_total,
            "holdoutInsideTrainingSupportHullCount": inside_total,
            "holdoutInsideTrainingSupportHullPercent": round(holdout_inside_percent, 6),
        },
        "providerLocalAccuracy": {
            "surface95Metres": round(local_surface_accuracy, 6),
            "components": {
                "maximumStereoRaySeparationMetres": args.stereo_ray_separation_limit_metres,
                "holdoutPlaneSeparationP95Metres": round(separation_p95, 6),
                "panoramaCalibrationVectorP95Metres": round(calibration_vector_p95, 6),
            },
            "conservativePlanErosionMetresForConfirmedShade": round(conservative_plan_erosion, 6),
            "planErosionSource": "full georeferenced horizontal 95 percent accuracy, retained as a conservative local boundary margin",
        },
        "diagnosticPng": {"path": str(args.output_png), "sha256": file_sha256(args.output_png)},
        "semanticScope": {
            "established": "visible continuous concrete underside plane inside the observed training support patch",
            "notEstablished": [
                "physical slab perimeter",
                "continuation beyond the observed patch",
                "solid thickness above the underside surface",
            ],
        },
        "assessment": {
            "analyticUndersidePatchMeasurementEligible": measurement_eligible,
            "mayConfirmShadeInsideErodedPatch": measurement_eligible,
            "mayConfirmSunFromPatchMiss": False,
            "publicationEligible": False,
            "blockers": [
                "PATCH_MISS_CANNOT_ESTABLISH_ABSENCE_OF_CONTINUING_SLAB",
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
        "patchAreaSquareMetres": artifact["observedSupportPatch"]["areaSquareMetres"],
        "holdoutInsidePatchPercent": round(holdout_inside_percent, 6),
        "providerLocalSurfaceAccuracy95Metres": round(local_surface_accuracy, 6),
        "conservativePlanErosionMetres": round(conservative_plan_erosion, 6),
        "measurementEligible": measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
