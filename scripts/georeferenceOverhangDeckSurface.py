#!/usr/bin/env python3
"""Georeference a measured overhanging deck underside and check LiDAR support.

The panorama artifact supplies a cross-validated underside plane. The panorama
datum artifact supplies section-local EPSG:6347 horizontal registration and a
training-only NAVD88 offset. USGS LiDAR independently checks that exterior
surface returns occupy the same plan area above the measured underside.

The convex hull in this artifact is only the observed stereo support patch. It
is not labeled as the physical overhang perimeter and cannot close a release
obstruction volume by itself.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw

from registerPanoramaVerticalDatum import bilinear_sample


ANALYSIS_VERSION = "georeferenced-overhanging-deck-underside-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("surface", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--minimum-lidar-support-points", type=int, default=30)
    parser.add_argument("--minimum-eligible-holdouts", type=int, default=2)
    parser.add_argument("--minimum-top-clearance-metres", type=float, default=0.10)
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
        "p05": None if finite.size == 0 else round(float(np.percentile(finite, 5)), 6),
        "median": None if finite.size == 0 else round(float(np.median(finite)), 6),
        "p95": None if finite.size == 0 else round(float(np.percentile(finite, 95)), 6),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 6),
    }


def convex_hull(points: np.ndarray) -> np.ndarray:
    unique = sorted({(float(point[0]), float(point[1])) for point in points})
    if len(unique) < 3:
        raise ValueError("At least three unique points are required for a hull")

    def cross(origin: tuple[float, float], first: tuple[float, float], second: tuple[float, float]) -> float:
        return (
            (first[0] - origin[0]) * (second[1] - origin[1])
            - (first[1] - origin[1]) * (second[0] - origin[0])
        )

    lower: list[tuple[float, float]] = []
    for point in unique:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], point) <= 0:
            lower.pop()
        lower.append(point)
    upper: list[tuple[float, float]] = []
    for point in reversed(unique):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], point) <= 0:
            upper.pop()
        upper.append(point)
    return np.asarray(lower[:-1] + upper[:-1], dtype=float)


def polygon_area(points: np.ndarray) -> float:
    following = np.roll(points, -1, axis=0)
    return 0.5 * abs(float(np.sum(points[:, 0] * following[:, 1] - following[:, 0] * points[:, 1])))


def points_in_polygon(points: np.ndarray, polygon: np.ndarray) -> np.ndarray:
    inside = np.zeros(points.shape[0], dtype=bool)
    x = points[:, 0]
    y = points[:, 1]
    previous = polygon[-1]
    for current in polygon:
        current_x, current_y = current
        previous_x, previous_y = previous
        crosses = (current_y > y) != (previous_y > y)
        denominator = previous_y - current_y
        intersection_x = np.full(points.shape[0], math.inf, dtype=float)
        if abs(denominator) > 1e-12:
            intersection_x = (
                (previous_x - current_x) * (y - current_y) / denominator
                + current_x
            )
        inside ^= crosses & (x < intersection_x)
        previous = current
    return inside


def transform_points(
    record: dict[str, Any],
    affine: np.ndarray,
    vertical_offset: float,
    raster: np.ndarray,
    grid: dict[str, Any],
) -> dict[str, Any]:
    provider = np.asarray([
        point["providerLocalMetres"]
        for point in record["points"]
        if point["planeInlier"]
    ], dtype=float)
    design = np.column_stack([
        provider[:, 0],
        provider[:, 2],
        np.ones(provider.shape[0]),
    ])
    projected = design @ affine
    underside_navd88 = provider[:, 1] + vertical_offset
    dsm_top = bilinear_sample(raster, projected[:, 0], projected[:, 1], grid)
    top_clearance = dsm_top - underside_navd88
    finite = np.isfinite(top_clearance)
    return {
        "source": {
            key: record[key]
            for key in ("path", "sha256", "artifactVersion", "leftSeatId", "rightSeatId")
        },
        "planeInlierPointCount": int(provider.shape[0]),
        "finiteLidarSupportCount": int(np.count_nonzero(finite)),
        "finiteLidarSupportPercent": round(100.0 * np.mean(finite), 4),
        "undersideNavd88Metres": values_summary(underside_navd88),
        "lidarExteriorTopNavd88Metres": values_summary(dsm_top[finite]),
        "lidarTopMinusUndersideMetres": values_summary(top_clearance[finite]),
        "points": [
            {
                "providerLocalMetres": [round(float(value), 6) for value in local],
                "eastMetres": round(float(xy[0]), 6),
                "northMetres": round(float(xy[1]), 6),
                "undersideNavd88Metres": round(float(under), 6),
                "lidarExteriorTopNavd88Metres": None if not math.isfinite(top) else round(float(top), 6),
                "lidarTopMinusUndersideMetres": None if not math.isfinite(clearance) else round(float(clearance), 6),
            }
            for local, xy, under, top, clearance in zip(
                provider,
                projected,
                underside_navd88,
                dsm_top,
                top_clearance,
            )
        ],
        "_projected": projected,
        "_topClearance": top_clearance,
    }


def render_diagnostic(
    path: Path,
    datasets: list[tuple[str, dict[str, Any]]],
    hull: np.ndarray,
) -> None:
    all_points = np.vstack([dataset["_projected"] for _, dataset in datasets])
    minimum = np.min(all_points, axis=0)
    maximum = np.max(all_points, axis=0)
    width, height, padding = 1600, 1000, 60
    image = Image.new("RGB", (width, height), (246, 247, 249))
    draw = ImageDraw.Draw(image)

    def pixel(point: np.ndarray) -> tuple[float, float]:
        x = padding + (point[0] - minimum[0]) / max(maximum[0] - minimum[0], 1e-6) * (width - 2 * padding)
        y = height - padding - (point[1] - minimum[1]) / max(maximum[1] - minimum[1], 1e-6) * (height - 2 * padding)
        return float(x), float(y)

    hull_pixels = [pixel(point) for point in hull]
    draw.polygon(hull_pixels, fill=(218, 232, 253), outline=(20, 70, 160), width=4)
    colors = [(10, 85, 210), (220, 65, 45), (20, 145, 90)]
    for index, (label, dataset) in enumerate(datasets):
        color = colors[index % len(colors)]
        for point in dataset["_projected"]:
            x, y = pixel(point)
            draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=color)
        draw.text((padding, 18 + 22 * index), label, fill=color)
    draw.text((padding, height - 34), "Observed stereo support hull only, not physical overhang perimeter", fill=(30, 30, 30))
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path)


def main() -> None:
    args = parse_args()
    surface = json.loads(args.surface.read_text())
    if not surface["assessment"].get("providerLocalOverhangingDeckUndersideMeasurementEligible"):
        raise ValueError("Overhanging deck underside surface is not measurement eligible")
    datum = json.loads(args.vertical_datum.read_text())
    if not datum["assessment"]["sectionLocalVerticalDatumMeasurementEligible"]:
        raise ValueError("Panorama vertical datum is not measurement eligible")
    raster_metadata = json.loads(args.raster_metadata.read_text())
    expected_dsm = raster_metadata["rasterOutputs"]["dsmMaximumZMetres"]
    if file_sha256(args.dsm) != expected_dsm["sha256"]:
        raise ValueError("DSM hash does not match raster metadata")
    raster = np.load(args.dsm)
    if list(raster.shape) != expected_dsm["shape"]:
        raise ValueError("DSM shape does not match raster metadata")
    section_fit = datum["inputs"]["sectionRegistration"]["sectionFit"]
    affine = np.asarray(section_fit["affineParameters"], dtype=float)
    vertical_offset = float(
        datum["verticalDatum"]["fittedTrainingOffsetNavd88MinusProviderYMetres"]
    )
    training = transform_points(
        surface["training"],
        affine,
        vertical_offset,
        raster,
        raster_metadata["grid"],
    )
    holdouts = [
        transform_points(
            record,
            affine,
            vertical_offset,
            raster,
            raster_metadata["grid"],
        )
        for record in surface["holdouts"]
    ]
    datasets = [("training", training)] + [
        (f"holdout {index + 1}", holdout)
        for index, holdout in enumerate(holdouts)
    ]
    hull = convex_hull(training["_projected"])
    hull_closed = np.vstack([hull, hull[0]])
    for index, (_, dataset) in enumerate(datasets):
        inside_patch = (
            np.ones(dataset["_projected"].shape[0], dtype=bool)
            if index == 0
            else points_in_polygon(dataset["_projected"], hull)
        )
        finite_inside = inside_patch & np.isfinite(dataset["_topClearance"])
        dataset["withinTrainingObservedSupportPatch"] = {
            "pointCount": int(np.count_nonzero(inside_patch)),
            "finiteLidarSupportCount": int(np.count_nonzero(finite_inside)),
            "lidarTopMinusUndersideMetres": values_summary(
                dataset["_topClearance"][finite_inside]
            ),
        }
        support = dataset["withinTrainingObservedSupportPatch"]
        support["eligible"] = bool(
            support["finiteLidarSupportCount"] >= args.minimum_lidar_support_points
            and support["lidarTopMinusUndersideMetres"]["p05"] is not None
            and support["lidarTopMinusUndersideMetres"]["p05"]
            >= args.minimum_top_clearance_metres
        )
        for point, is_inside in zip(dataset["points"], inside_patch):
            point["insideTrainingObservedSupportPatch"] = bool(is_inside)
    render_diagnostic(args.output_png, datasets, hull)
    training_support_pass = bool(
        training["withinTrainingObservedSupportPatch"]["eligible"]
    )
    eligible_holdout_count = sum(
        int(holdout["withinTrainingObservedSupportPatch"]["eligible"])
        for holdout in holdouts
    )
    contradictory_holdout_count = sum(
        int(
            holdout["withinTrainingObservedSupportPatch"]["finiteLidarSupportCount"]
            >= args.minimum_lidar_support_points
            and holdout["withinTrainingObservedSupportPatch"]["lidarTopMinusUndersideMetres"]["p05"] is not None
            and holdout["withinTrainingObservedSupportPatch"]["lidarTopMinusUndersideMetres"]["p05"]
            < args.minimum_top_clearance_metres
        )
        for holdout in holdouts
    )
    lidar_support_pass = bool(
        training_support_pass
        and eligible_holdout_count >= args.minimum_eligible_holdouts
        and contradictory_holdout_count == 0
    )
    plane_residual_p95 = float(
        surface["training"]["inlierAbsoluteResidualMetres"]["p95"]
    )
    vertical_accuracy_95 = math.hypot(
        float(datum["combinedAccuracy"]["vertical95Metres"]),
        plane_residual_p95,
    )
    for _, dataset in datasets:
        dataset.pop("_projected")
        dataset.pop("_topClearance")
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "georeferenced-observed-overhang-underside-patch",
        "artifactVersion": "sha256:pending",
        "inputs": {
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
            "rasterMetadata": {
                "path": str(args.raster_metadata),
                "sha256": file_sha256(args.raster_metadata),
                "artifactVersion": raster_metadata["artifactVersion"],
            },
            "dsm": {
                "path": str(args.dsm),
                "sha256": file_sha256(args.dsm),
            },
        },
        "coordinateReferenceSystem": {
            "horizontal": "EPSG:6347",
            "vertical": "EPSG:5703 NAVD88 Geoid18 metres",
        },
        "semanticScope": {
            "surface": "concrete underside of the seating deck overhanging section 123 back rows",
            "observedSupportPatchIsPhysicalPerimeter": False,
            "lidarInterpretation": "independent exterior returns above the underside support an occupied overhead structure, but do not define its underside or perimeter",
        },
        "observedSupportPatch": {
            "geometryType": "Polygon",
            "coordinatesEpsg6347Metres": [
                [round(float(value), 6) for value in point]
                for point in hull_closed
            ],
            "areaSquareMetres": round(polygon_area(hull), 6),
            "source": "convex hull of training stereo plane inliers",
            "restriction": "The hull bounds only the sampled continuous plane patch and is not the physical overhang edge.",
        },
        "training": training,
        "holdouts": holdouts,
        "independentLidarSupport": {
            "minimumPointsPerDataset": args.minimum_lidar_support_points,
            "minimumEligibleHoldouts": args.minimum_eligible_holdouts,
            "minimumP05TopClearanceMetres": args.minimum_top_clearance_metres,
            "eligibleHoldoutCount": eligible_holdout_count,
            "contradictoryHoldoutCount": contradictory_holdout_count,
            "passed": lidar_support_pass,
        },
        "combinedAccuracy": {
            "horizontal95Metres": datum["combinedAccuracy"]["horizontal95Metres"],
            "vertical95MetresIncludingPlaneResidual": round(vertical_accuracy_95, 6),
            "withinOneFoot": bool(
                float(datum["combinedAccuracy"]["horizontal95Metres"]) <= 0.3048
                and vertical_accuracy_95 <= 0.3048
            ),
            "caveat": datum["combinedAccuracy"]["caveat"],
        },
        "diagnosticPng": {
            "path": str(args.output_png),
            "sha256": file_sha256(args.output_png),
        },
        "assessment": {
            "georeferencedObservedPatchMeasurementEligible": bool(
                lidar_support_pass and vertical_accuracy_95 <= 0.3048
            ),
            "publicationEligible": False,
            "blockers": [
                "OBSERVED_SUPPORT_HULL_IS_NOT_PHYSICAL_OVERHANG_PERIMETER",
                "BEAM_AND_EDGE_SOLID_VOLUMES_NOT_MEASURED",
                "HORIZONTAL_REGISTRATION_HAS_ONE_HELD_OUT_ROW",
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
        "observedPatchAreaSquareMetres": artifact["observedSupportPatch"]["areaSquareMetres"],
        "trainingLidarSupport": training["withinTrainingObservedSupportPatch"]["finiteLidarSupportCount"],
        "holdoutLidarSupport": [
            item["withinTrainingObservedSupportPatch"]["finiteLidarSupportCount"]
            for item in holdouts
        ],
        "trainingTopClearanceP05Metres": training["withinTrainingObservedSupportPatch"]["lidarTopMinusUndersideMetres"]["p05"],
        "verticalAccuracy95Metres": round(vertical_accuracy_95, 6),
        "measurementEligible": artifact["assessment"]["georeferencedObservedPatchMeasurementEligible"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
