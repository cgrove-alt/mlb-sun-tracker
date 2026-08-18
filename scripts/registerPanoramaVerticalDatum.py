#!/usr/bin/env python3
"""Register a panorama provider-local vertical datum to USGS LiDAR.

The training stereo pair defines the vertical offset from provider-local metres
to NAVD88 metres. Disjoint panorama pairs are evaluated as holdouts and never
participate in the offset fit. Green stereo points are only treated as playing
field candidates when they form the dominant narrow provider-height cluster
and land on the independently acquired LiDAR playing surface.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import xml.etree.ElementTree as ElementTree
from pathlib import Path
from typing import Any

import numpy as np


ANALYSIS_VERSION = "panorama-lidar-vertical-datum-v1"
USGS_METADATA_URL = (
    "https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/metadata/"
    "PA_17County_D24/PA_17Co_5_D24/reports/vendor_provided_xml/"
    "PA_17County_2024_WU301078_ClassifiedPointCloud.xml"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("calibration", type=Path)
    parser.add_argument("section_registration", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("dsm", type=Path)
    parser.add_argument("usgs_project_metadata", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", default="123")
    parser.add_argument("--training-stereo", type=Path, required=True)
    parser.add_argument("--holdout-stereo", type=Path, action="append", default=[])
    parser.add_argument("--histogram-bin-metres", type=float, default=0.25)
    parser.add_argument("--cluster-half-width-metres", type=float, default=0.75)
    parser.add_argument("--minimum-field-points", type=int, default=40)
    parser.add_argument("--maximum-holdout-offset-difference-metres", type=float, default=0.15)
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


def find_text(root: ElementTree.Element, tag: str) -> str:
    values = [" ".join((element.text or "").split()) for element in root.findall(f".//{tag}")]
    return " ".join(value for value in values if value)


def parse_usgs_accuracy(path: Path) -> dict[str, Any]:
    root = ElementTree.parse(path).getroot()
    horizontal_text = find_text(root, "horizpar")
    vertical_text = find_text(root, "vertaccr")
    process_text = find_text(root, "procdesc")
    horizontal_match = re.search(
        r"Horizontal Accuracy\s*=\s*\+/-\s*([0-9.]+)\s*cm at a 95% confidence level",
        horizontal_text,
        re.IGNORECASE,
    )
    vertical_class_match = re.search(
        r"([0-9.]+)-cm RMSEz Vertical Accuracy Class",
        vertical_text,
        re.IGNORECASE,
    )
    nva_match = re.search(
        r"NVA\s*=\s*([0-9.]+)\s*cm 95% Confidence Level",
        process_text,
        re.IGNORECASE,
    )
    if horizontal_match is None or vertical_class_match is None or nva_match is None:
        raise ValueError("Official USGS metadata did not contain the expected accuracy statements")
    return {
        "sourceUrl": USGS_METADATA_URL,
        "localPath": str(path),
        "sha256": file_sha256(path),
        "horizontalAccuracy95Metres": round(float(horizontal_match.group(1)) / 100.0, 6),
        "verticalRmseClassMetres": round(float(vertical_class_match.group(1)) / 100.0, 6),
        "requiredNonVegetatedVerticalAccuracy95Metres": round(
            float(nva_match.group(1)) / 100.0,
            6,
        ),
        "horizontalStatement": horizontal_text,
        "verticalStatement": vertical_text,
        "checkpointProcessStatement": next(
            (
                " ".join((element.text or "").split())
                for element in root.findall(".//procdesc")
                if "NVA =" in (element.text or "")
            ),
            process_text,
        ),
    }


def bilinear_sample(
    raster: np.ndarray,
    east: np.ndarray,
    north: np.ndarray,
    grid: dict[str, Any],
) -> np.ndarray:
    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    cell = float(grid["cellMetres"])
    column_float = (east - minimum_x) / cell - 0.5
    row_float = (north - minimum_y) / cell - 0.5
    column0 = np.floor(column_float).astype(int)
    row0 = np.floor(row_float).astype(int)
    column1 = column0 + 1
    row1 = row0 + 1
    valid = (
        (column0 >= 0)
        & (row0 >= 0)
        & (column1 < raster.shape[1])
        & (row1 < raster.shape[0])
    )
    sampled = np.full(east.shape, np.nan, dtype=float)
    if not np.any(valid):
        return sampled
    q00 = raster[row0[valid], column0[valid]].astype(float)
    q10 = raster[row0[valid], column1[valid]].astype(float)
    q01 = raster[row1[valid], column0[valid]].astype(float)
    q11 = raster[row1[valid], column1[valid]].astype(float)
    finite_neighbors = np.isfinite(q00) & np.isfinite(q10) & np.isfinite(q01) & np.isfinite(q11)
    valid_indices = np.flatnonzero(valid)[finite_neighbors]
    if valid_indices.size == 0:
        return sampled
    x_weight = column_float[valid_indices] - column0[valid_indices]
    y_weight = row_float[valid_indices] - row0[valid_indices]
    sampled[valid_indices] = (
        q00[finite_neighbors] * (1.0 - x_weight) * (1.0 - y_weight)
        + q10[finite_neighbors] * x_weight * (1.0 - y_weight)
        + q01[finite_neighbors] * (1.0 - x_weight) * y_weight
        + q11[finite_neighbors] * x_weight * y_weight
    )
    return sampled


def provider_points(path: Path, panorama_to_provider: np.ndarray) -> tuple[np.ndarray, dict[str, Any]]:
    artifact = json.loads(path.read_text())
    left_position = np.asarray(
        artifact["inputs"]["providerLocalLeftPositionMetres"],
        dtype=float,
    )
    points = []
    for record in artifact["triangulation"].get("sparseGreenHorizonPoints", []):
        if not record.get("highConfidenceProviderLocalFieldCandidate"):
            continue
        panorama_relative = np.asarray(
            record["panoramaFrameMetresRelativeToLeftCamera"],
            dtype=float,
        )
        points.append(left_position + panorama_to_provider @ panorama_relative)
    if not points:
        raise ValueError(f"No high-confidence green horizon points in {path}")
    metadata = {
        "path": str(path),
        "sha256": file_sha256(path),
        "artifactVersion": artifact["artifactVersion"],
        "leftSeatId": artifact["inputs"]["leftSeatId"],
        "rightSeatId": artifact["inputs"]["rightSeatId"],
    }
    return np.asarray(points), metadata


def dominant_vertical_cluster(
    points: np.ndarray,
    bin_width: float,
    half_width: float,
    fixed_center: float | None = None,
) -> tuple[np.ndarray, float, dict[str, Any]]:
    provider_y = points[:, 1]
    if fixed_center is not None:
        selected = np.abs(provider_y - fixed_center) <= half_width
        return selected, fixed_center, {
            "selectionMethod": "training stereo histogram peak center",
            "histogramPeakCenterProviderYMetres": round(float(fixed_center), 6),
            "histogramPeakBinCount": None,
            "selectedPointCount": int(np.count_nonzero(selected)),
            "selectedProviderYMetres": values_summary(provider_y[selected]),
        }
    bin_indices = np.floor(provider_y / bin_width).astype(int)
    unique, counts = np.unique(bin_indices, return_counts=True)
    maximum_count = int(np.max(counts))
    winning_bins = unique[counts == maximum_count]
    winning_bin = int(winning_bins[np.argmin(np.abs(winning_bins))])
    center = (winning_bin + 0.5) * bin_width
    selected = np.abs(provider_y - center) <= half_width
    return selected, center, {
        "selectionMethod": "dominant training stereo provider-y histogram bin",
        "histogramPeakCenterProviderYMetres": round(float(center), 6),
        "histogramPeakBinCount": maximum_count,
        "selectedPointCount": int(np.count_nonzero(selected)),
        "selectedProviderYMetres": values_summary(provider_y[selected]),
    }


def dataset_record(
    path: Path,
    panorama_to_provider: np.ndarray,
    affine: np.ndarray,
    raster: np.ndarray,
    grid: dict[str, Any],
    bin_width: float,
    half_width: float,
    fixed_cluster_center: float | None = None,
) -> dict[str, Any]:
    points, metadata = provider_points(path, panorama_to_provider)
    selected, peak_center, cluster = dominant_vertical_cluster(
        points,
        bin_width,
        half_width,
        fixed_cluster_center,
    )
    selected_points = points[selected]
    design = np.column_stack([
        selected_points[:, 0],
        selected_points[:, 2],
        np.ones(selected_points.shape[0]),
    ])
    projected = design @ affine
    sampled = bilinear_sample(raster, projected[:, 0], projected[:, 1], grid)
    finite = np.isfinite(sampled)
    offsets = sampled[finite] - selected_points[finite, 1]
    return {
        **metadata,
        "candidatePointCount": int(points.shape[0]),
        "cluster": cluster,
        "projectedCoordinateReferenceSystem": "EPSG:6347",
        "finiteDsmSampleCount": int(np.count_nonzero(finite)),
        "finiteDsmSamplePercent": round(100.0 * np.mean(finite), 4),
        "dsmNavd88Metres": values_summary(sampled[finite]),
        "dsmMinusProviderYMetres": values_summary(offsets),
        "projectedFieldPoints": [
            {
                "providerLocalMetres": [round(float(value), 6) for value in point],
                "projectedEastMetres": round(float(projected_point[0]), 6),
                "projectedNorthMetres": round(float(projected_point[1]), 6),
                "dsmNavd88Metres": None if not math.isfinite(dsm_value) else round(float(dsm_value), 6),
            }
            for point, projected_point, dsm_value in zip(selected_points, projected, sampled)
        ],
        "_peakCenter": peak_center,
        "_offsets": offsets,
    }


def main() -> None:
    args = parse_args()
    if not args.holdout_stereo:
        raise ValueError("At least one --holdout-stereo artifact is required")
    calibration = json.loads(args.calibration.read_text())
    if not calibration["assessment"]["measurementEligible"]:
        raise ValueError("Panorama provider-frame calibration is not measurement eligible")
    section_registration = json.loads(args.section_registration.read_text())
    section_fit = section_registration["sectionFits"].get(args.section)
    if section_fit is None or not section_fit["measurementEligible"]:
        raise ValueError(f"Section {args.section} registration is not measurement eligible")
    affine = np.asarray(section_fit["affineParameters"], dtype=float)
    if affine.shape != (3, 2):
        raise ValueError("Section affine parameters must have shape 3 by 2")
    raster_metadata = json.loads(args.raster_metadata.read_text())
    expected_dsm = raster_metadata["rasterOutputs"]["dsmMaximumZMetres"]
    if file_sha256(args.dsm) != expected_dsm["sha256"]:
        raise ValueError("DSM hash does not match raster metadata")
    raster = np.load(args.dsm)
    if list(raster.shape) != expected_dsm["shape"]:
        raise ValueError("DSM shape does not match raster metadata")
    usgs_accuracy = parse_usgs_accuracy(args.usgs_project_metadata)
    panorama_to_provider = np.asarray(
        calibration["rotation"]["panoramaVectorToProviderVector"],
        dtype=float,
    )

    training = dataset_record(
        args.training_stereo,
        panorama_to_provider,
        affine,
        raster,
        raster_metadata["grid"],
        args.histogram_bin_metres,
        args.cluster_half_width_metres,
    )
    training_cluster_center = float(training["_peakCenter"])
    holdouts = [
        dataset_record(
            path,
            panorama_to_provider,
            affine,
            raster,
            raster_metadata["grid"],
            args.histogram_bin_metres,
            args.cluster_half_width_metres,
            training_cluster_center,
        )
        for path in args.holdout_stereo
    ]
    training_offsets = training.pop("_offsets")
    training.pop("_peakCenter")
    if training_offsets.size < args.minimum_field_points:
        raise ValueError("Training field cluster has too few finite DSM samples")
    fitted_vertical_offset = float(np.median(training_offsets))
    holdout_offset_differences = []
    for holdout in holdouts:
        holdout_offsets = holdout.pop("_offsets")
        holdout.pop("_peakCenter")
        if holdout_offsets.size == 0:
            holdout_offset_differences.append(math.inf)
        else:
            holdout_offset_differences.append(
                abs(float(np.median(holdout_offsets)) - fitted_vertical_offset)
            )
    holdout_differences = np.asarray(holdout_offset_differences, dtype=float)
    all_holdout_counts_pass = all(
        holdout["finiteDsmSampleCount"] >= args.minimum_field_points
        for holdout in holdouts
    )
    repeatability_pass = bool(
        all_holdout_counts_pass
        and np.all(np.isfinite(holdout_differences))
        and float(np.max(holdout_differences))
        <= args.maximum_holdout_offset_difference_metres
    )
    horizontal_combined_95 = math.hypot(
        float(usgs_accuracy["horizontalAccuracy95Metres"]),
        float(section_fit["holdout"]["p95ResidualMetres"]),
    )
    vertical_combined_95 = math.sqrt(
        float(usgs_accuracy["requiredNonVegetatedVerticalAccuracy95Metres"]) ** 2
        + float(np.percentile(holdout_differences, 95)) ** 2
    )
    one_foot = 0.3048
    local_measurement_eligible = bool(
        repeatability_pass
        and horizontal_combined_95 <= one_foot
        and vertical_combined_95 <= one_foot
    )
    parameters = {
        "section": args.section,
        "histogramBinMetres": args.histogram_bin_metres,
        "clusterHalfWidthMetres": args.cluster_half_width_metres,
        "minimumFiniteDsmFieldPointsPerDataset": args.minimum_field_points,
        "maximumHoldoutOffsetDifferenceMetres": args.maximum_holdout_offset_difference_metres,
        "oneFootAccuracyThresholdMetres": one_foot,
        "verticalOffsetConvention": "navd88 metres = provider-local y metres + fitted offset",
        "dsmSampling": "bilinear interpolation requiring four finite 0.3 metre cells",
    }
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "section-local-panorama-to-navd88-datum-registration",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "calibration": {
                "path": str(args.calibration),
                "sha256": file_sha256(args.calibration),
                "artifactVersion": calibration["artifactVersion"],
            },
            "sectionRegistration": {
                "path": str(args.section_registration),
                "sha256": file_sha256(args.section_registration),
                "artifactVersion": section_registration["artifactVersion"],
                "sectionFit": section_fit,
            },
            "rasterMetadata": {
                "path": str(args.raster_metadata),
                "sha256": file_sha256(args.raster_metadata),
                "artifactVersion": raster_metadata["artifactVersion"],
            },
            "dsm": {
                "path": str(args.dsm),
                "sha256": file_sha256(args.dsm),
                "shape": list(raster.shape),
            },
            "usgsProjectMetadata": usgs_accuracy,
        },
        "parameters": parameters,
        "training": training,
        "holdouts": holdouts,
        "verticalDatum": {
            "fittedTrainingOffsetNavd88MinusProviderYMetres": round(fitted_vertical_offset, 6),
            "holdoutAbsoluteOffsetDifferenceMetres": values_summary(holdout_differences),
            "holdoutRepeatabilityPassed": repeatability_pass,
            "providerLocalToNavd88": {
                "scale": 1.0,
                "offsetMetres": round(fitted_vertical_offset, 6),
            },
        },
        "combinedAccuracy": {
            "method": "root sum square of independent 95 percent source and registration terms",
            "horizontal95Metres": round(horizontal_combined_95, 6),
            "vertical95Metres": round(vertical_combined_95, 6),
            "withinOneFoot": bool(
                horizontal_combined_95 <= one_foot and vertical_combined_95 <= one_foot
            ),
            "caveat": "The section 123 horizontal fit has only one held-out control row and is not a full-venue release registration.",
        },
        "assessment": {
            "sectionLocalVerticalDatumMeasurementEligible": local_measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "ONLY_SECTION_123_LOCAL_FRAME_MEASURED",
                "HORIZONTAL_REGISTRATION_HAS_ONE_HELD_OUT_ROW",
                "OVERHANG_PERIMETER_AND_SOLID_VOLUME_NOT_COMPLETE",
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
        "trainingOffsetNavd88MinusProviderYMetres": round(fitted_vertical_offset, 6),
        "trainingFiniteFieldPoints": training["finiteDsmSampleCount"],
        "holdoutFiniteFieldPoints": [item["finiteDsmSampleCount"] for item in holdouts],
        "holdoutOffsetDifferenceP95Metres": round(float(np.percentile(holdout_differences, 95)), 6),
        "horizontalCombined95Metres": round(horizontal_combined_95, 6),
        "verticalCombined95Metres": round(vertical_combined_95, 6),
        "measurementEligible": local_measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
