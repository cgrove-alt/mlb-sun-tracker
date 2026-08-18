#!/usr/bin/env python3
"""Audit current provider row anchors against multiple official orthophotos.

This is a conservative discovery and coverage audit. It detects blue physical
seat bands near projected provider row chords, fits the cross-row offset on a
deterministic control subset of along-row samples, and verifies that offset on
held-out samples. The output never grants publication eligibility because a
nearby historic seat band does not independently establish current row labels,
provider camera-point semantics, vertical geometry, or shadow accuracy.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import distance_transform_edt, map_coordinates


ONE_FOOT = 1.0


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


def percentile(values: list[float], amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values else None


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_bytes())


@dataclass(frozen=True)
class EpochArgument:
    year: int
    roof_state: str
    manifest_path: Path
    image_path: Path


def parse_epoch(value: str) -> EpochArgument:
    parts = value.split(":", 3)
    if len(parts) != 4:
        raise argparse.ArgumentTypeError(
            "Epoch must be YEAR:ROOF_STATE:MANIFEST:IMAGE"
        )
    year_text, roof_state, manifest_text, image_text = parts
    try:
        year = int(year_text)
    except ValueError as error:
        raise argparse.ArgumentTypeError("Epoch year must be an integer") from error
    if year < 1900 or year > 2200:
        raise argparse.ArgumentTypeError("Epoch year is implausible")
    if roof_state not in {"open", "partial-open"}:
        raise argparse.ArgumentTypeError("Roof state must be open or partial-open")
    return EpochArgument(year, roof_state, Path(manifest_text), Path(image_text))


def raster_metadata(manifest: dict[str, Any]) -> dict[str, Any]:
    if isinstance(manifest.get("raster"), dict):
        raster = manifest["raster"]
        return {
            "extent": raster["extent"],
            "coordinateReferenceSystem": raster["coordinateReferenceSystem"],
            "pixelSizeX": float(raster["pixelSizeX"]),
            "pixelSizeY": float(raster["pixelSizeY"]),
            "declaredSha256": raster.get("sha256"),
            "declaredPath": raster.get("path"),
            "serviceUrl": manifest.get("source", {}).get("serviceUrl"),
        }
    if isinstance(manifest.get("export"), dict):
        export = manifest["export"]
        return {
            "extent": export["extent"],
            "coordinateReferenceSystem": export["coordinateReferenceSystem"],
            "pixelSizeX": float(export["pixelSizeX"]),
            "pixelSizeY": float(export["pixelSizeY"]),
            "declaredSha256": export.get("sha256"),
            "declaredPath": manifest.get("localImagePath"),
            "serviceUrl": manifest.get("source", {}).get("serviceUrl"),
        }
    raise ValueError("Orthophoto manifest lacks raster or export metadata")


def blue_seat_mask(rgb: np.ndarray, parameters: dict[str, float]) -> np.ndarray:
    values = rgb.astype(np.float64) / 255.0
    red = values[..., 0]
    green = values[..., 1]
    blue = values[..., 2]
    maximum = values.max(axis=2)
    minimum = values.min(axis=2)
    saturation = np.divide(
        maximum - minimum,
        maximum,
        out=np.zeros_like(maximum),
        where=maximum > 0,
    )
    return (
        (blue >= parameters["minimumBlue"])
        & (saturation >= parameters["minimumSaturation"])
        & ((blue - red) >= parameters["minimumBlueMinusRed"])
        & ((blue - green) >= parameters["minimumBlueMinusGreen"])
    )


def stable_control_mask(row_key: str, count: int) -> np.ndarray:
    seed = hashlib.sha256(row_key.encode("utf-8")).digest()[0] % 5
    indices = np.arange(count)
    return (indices + seed) % 5 != 0


def best_profile_offset(
    distance_values: np.ndarray,
    offsets: np.ndarray,
    sample_mask: np.ndarray,
    hit_radius_feet: float,
    ambiguity_distance_feet: float,
) -> dict[str, Any] | None:
    subset = distance_values[:, sample_mask]
    finite_counts = np.isfinite(subset).sum(axis=1)
    minimum_finite = max(4, int(math.ceil(sample_mask.sum() * 0.90)))
    valid_profiles = finite_counts >= minimum_finite
    if not valid_profiles.any():
        return None
    coverage = np.full(offsets.shape, np.nan, dtype=float)
    median_distance = np.full(offsets.shape, np.nan, dtype=float)
    p75_distance = np.full(offsets.shape, np.nan, dtype=float)
    p95_distance = np.full(offsets.shape, np.nan, dtype=float)
    for index in np.flatnonzero(valid_profiles):
        values = subset[index]
        values = values[np.isfinite(values)]
        coverage[index] = float(np.mean(values <= hit_radius_feet))
        median_distance[index] = float(np.median(values))
        p75_distance[index] = float(np.percentile(values, 75))
        p95_distance[index] = float(np.percentile(values, 95))
    candidates = np.flatnonzero(valid_profiles)
    best_index = int(
        min(
            candidates,
            key=lambda index: (
                -coverage[index],
                median_distance[index],
                abs(offsets[index]),
            ),
        )
    )
    alternatives = candidates[
        np.abs(offsets[candidates] - offsets[best_index]) >= ambiguity_distance_feet
    ]
    alternative_coverage = (
        float(np.max(coverage[alternatives])) if alternatives.size else None
    )
    uniqueness = (
        float(coverage[best_index] - alternative_coverage)
        if alternative_coverage is not None
        else None
    )
    return {
        "offsetFeet": float(offsets[best_index]),
        "coverage": float(coverage[best_index]),
        "medianDistanceFeet": float(median_distance[best_index]),
        "p75DistanceFeet": float(p75_distance[best_index]),
        "p95DistanceFeet": float(p95_distance[best_index]),
        "alternativeCoverage": alternative_coverage,
        "uniqueness": uniqueness,
        "finiteSampleCount": int(finite_counts[best_index]),
    }


def fixed_profile_metrics(
    values: np.ndarray,
    sample_mask: np.ndarray,
    hit_radius_feet: float,
) -> dict[str, Any] | None:
    subset = values[sample_mask]
    subset = subset[np.isfinite(subset)]
    minimum_finite = max(4, int(math.ceil(sample_mask.sum() * 0.90)))
    if subset.size < minimum_finite:
        return None
    return {
        "coverage": float(np.mean(subset <= hit_radius_feet)),
        "medianDistanceFeet": float(np.median(subset)),
        "p75DistanceFeet": float(np.percentile(subset, 75)),
        "p95DistanceFeet": float(np.percentile(subset, 95)),
        "finiteSampleCount": int(subset.size),
    }


def image_pixel(
    point: np.ndarray,
    extent: dict[str, float],
    pixel_size_x: float,
    pixel_size_y: float,
) -> np.ndarray:
    return np.asarray([
        (point[0] - float(extent["xmin"])) / pixel_size_x,
        (float(extent["ymax"]) - point[1]) / pixel_size_y,
    ])


def audit_row(
    row: dict[str, Any],
    distance_feet: np.ndarray,
    extent: dict[str, float],
    pixel_size_x: float,
    pixel_size_y: float,
    parameters: dict[str, float],
) -> dict[str, Any]:
    anchors = np.asarray(
        [anchor["projectedCoordinateUsSurveyFeet"] for anchor in row["anchors"]],
        dtype=float,
    )
    if anchors.shape[0] < 2:
        return {"status": "insufficient-anchors"}
    segment_vectors = np.diff(anchors, axis=0)
    segment_lengths = np.linalg.norm(segment_vectors, axis=1)
    if (segment_lengths <= 0).any():
        return {"status": "coincident-anchors"}
    cumulative_lengths = np.concatenate(([0.0], np.cumsum(segment_lengths)))
    length = float(cumulative_lengths[-1])
    chord = anchors[-1] - anchors[0]
    chord_length = float(np.linalg.norm(chord))
    sample_count = max(
        int(parameters["minimumAlongSamples"]),
        int(math.ceil(length / parameters["alongSpacingFeet"])) + 1,
    )
    along_distances = np.linspace(0.0, length, sample_count)
    segment_indices = np.searchsorted(
        cumulative_lengths[1:], along_distances, side="right"
    )
    segment_indices = np.minimum(segment_indices, segment_lengths.size - 1)
    segment_fractions = (
        along_distances - cumulative_lengths[segment_indices]
    ) / segment_lengths[segment_indices]
    base = (
        anchors[segment_indices]
        + segment_fractions[:, None] * segment_vectors[segment_indices]
    )
    directions = segment_vectors[segment_indices] / segment_lengths[
        segment_indices, None
    ]
    normals = np.column_stack((-directions[:, 1], directions[:, 0]))
    offsets = np.arange(
        -parameters["searchRadiusFeet"],
        parameters["searchRadiusFeet"] + parameters["normalStepFeet"] * 0.5,
        parameters["normalStepFeet"],
    )
    sample_rows = []
    for offset in offsets:
        points = base + offset * normals
        columns = (points[:, 0] - float(extent["xmin"])) / pixel_size_x
        rows = (float(extent["ymax"]) - points[:, 1]) / pixel_size_y
        sample_rows.append(
            map_coordinates(
                distance_feet,
                np.vstack((rows, columns)),
                order=1,
                mode="constant",
                cval=np.nan,
                prefilter=False,
            )
        )
    sampled = np.asarray(sample_rows)
    control_mask = stable_control_mask(row["rowKey"], sample_count)
    holdout_mask = ~control_mask
    if control_mask.sum() < 8 or holdout_mask.sum() < 4:
        return {"status": "insufficient-split-samples"}
    control = best_profile_offset(
        sampled,
        offsets,
        control_mask,
        parameters["hitRadiusFeet"],
        parameters["ambiguityDistanceFeet"],
    )
    holdout = best_profile_offset(
        sampled,
        offsets,
        holdout_mask,
        parameters["hitRadiusFeet"],
        parameters["ambiguityDistanceFeet"],
    )
    if control is None or holdout is None:
        return {"status": "outside-image-or-insufficient-valid-pixels"}
    zero_index = int(np.argmin(np.abs(offsets)))
    if abs(float(offsets[zero_index])) > 1e-9:
        raise ValueError("Normal-offset grid does not include zero")
    fixed_control = fixed_profile_metrics(
        sampled[zero_index], control_mask, parameters["hitRadiusFeet"]
    )
    fixed_holdout = fixed_profile_metrics(
        sampled[zero_index], holdout_mask, parameters["hitRadiusFeet"]
    )
    fixed_projection_candidate = bool(
        fixed_control is not None
        and fixed_holdout is not None
        and fixed_control["coverage"] >= parameters["minimumCoverage"]
        and fixed_holdout["coverage"] >= parameters["minimumCoverage"]
        and fixed_control["medianDistanceFeet"]
        <= parameters["maximumMedianDistanceFeet"]
        and fixed_holdout["medianDistanceFeet"]
        <= parameters["maximumMedianDistanceFeet"]
        and fixed_control["p75DistanceFeet"]
        <= parameters["maximumP75DistanceFeet"]
        and fixed_holdout["p75DistanceFeet"]
        <= parameters["maximumP75DistanceFeet"]
        and fixed_control["p95DistanceFeet"] <= ONE_FOOT
        and fixed_holdout["p95DistanceFeet"] <= ONE_FOOT
    )
    offset_residual = abs(control["offsetFeet"] - holdout["offsetFeet"])
    control_detected = bool(
        control["coverage"] >= parameters["minimumCoverage"]
        and control["medianDistanceFeet"] <= parameters["maximumMedianDistanceFeet"]
        and control["p75DistanceFeet"] <= parameters["maximumP75DistanceFeet"]
    )
    holdout_detected = bool(
        holdout["coverage"] >= parameters["minimumCoverage"]
        and holdout["medianDistanceFeet"] <= parameters["maximumMedianDistanceFeet"]
        and holdout["p75DistanceFeet"] <= parameters["maximumP75DistanceFeet"]
    )
    identifiable = bool(
        control_detected
        and holdout_detected
        and control["uniqueness"] is not None
        and holdout["uniqueness"] is not None
        and control["uniqueness"] >= parameters["minimumUniqueness"]
        and holdout["uniqueness"] >= parameters["minimumUniqueness"]
    )
    candidate = bool(identifiable and offset_residual <= ONE_FOOT)
    midpoint_index = sample_count // 2
    midpoint = base[midpoint_index]
    return {
        "status": "evaluated",
        "anchorPolylineLengthFeet": length,
        "chordLengthFeet": chord_length,
        "alongSampleCount": sample_count,
        "controlAlongSampleCount": int(control_mask.sum()),
        "holdoutAlongSampleCount": int(holdout_mask.sum()),
        "rowNormalUnitVectorAtMidpoint": [
            float(value) for value in normals[midpoint_index]
        ],
        "projectedMidpointUsSurveyFeet": [float(value) for value in midpoint],
        "control": control,
        "holdout": holdout,
        "fixedProjection": {
            "offsetFeet": 0.0,
            "control": fixed_control,
            "holdout": fixed_holdout,
            "candidate": fixed_projection_candidate,
        },
        "absoluteControlHoldoutOffsetResidualFeet": offset_residual,
        "blueSeatBandDetected": bool(control_detected and holdout_detected),
        "blueSeatBandIdentifiable": identifiable,
        "measurementCandidate": candidate,
        "withinOneFootControlHoldoutResidual": bool(offset_residual <= ONE_FOOT),
        "publicationEligible": False,
    }


def render_review(
    image: Image.Image,
    row_results: list[dict[str, Any]],
    metadata: dict[str, Any],
    output: Path,
) -> None:
    maximum_dimension = 1800
    scale = min(1.0, maximum_dimension / max(image.size))
    review = image.convert("RGB")
    if scale < 1.0:
        review = review.resize(
            (int(round(image.width * scale)), int(round(image.height * scale))),
            Image.Resampling.LANCZOS,
        )
    draw = ImageDraw.Draw(review)
    extent = metadata["extent"]
    pixel_size_x = metadata["pixelSizeX"]
    pixel_size_y = metadata["pixelSizeY"]
    for result in row_results:
        if result.get("status") != "evaluated":
            continue
        point = np.asarray(result["projectedMidpointUsSurveyFeet"], dtype=float)
        pixel = image_pixel(point, extent, pixel_size_x, pixel_size_y) * scale
        if result.get("fixedProjection", {}).get("candidate"):
            colour = (0, 235, 90)
        elif result["measurementCandidate"]:
            colour = (0, 220, 255)
        elif result["blueSeatBandDetected"]:
            colour = (255, 190, 0)
        else:
            colour = (230, 45, 55)
        radius = 2
        draw.ellipse(
            (
                float(pixel[0] - radius),
                float(pixel[1] - radius),
                float(pixel[0] + radius),
                float(pixel[1] + radius),
            ),
            fill=colour,
        )
    output.parent.mkdir(parents=True, exist_ok=True)
    review.save(output, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--registration", type=Path, required=True)
    parser.add_argument("--epoch", action="append", type=parse_epoch, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--review-directory", type=Path)
    parser.add_argument("--search-radius-feet", type=float, default=4.0)
    parser.add_argument("--normal-step-feet", type=float, default=0.125)
    parser.add_argument("--along-spacing-feet", type=float, default=0.5)
    parser.add_argument("--minimum-along-samples", type=int, default=20)
    parser.add_argument("--hit-radius-feet", type=float, default=0.5)
    parser.add_argument("--ambiguity-distance-feet", type=float, default=1.25)
    parser.add_argument("--minimum-coverage", type=float, default=0.45)
    parser.add_argument("--minimum-uniqueness", type=float, default=0.04)
    parser.add_argument("--maximum-median-distance-feet", type=float, default=0.5)
    parser.add_argument("--maximum-p75-distance-feet", type=float, default=0.75)
    parser.add_argument("--minimum-blue", type=float, default=0.12)
    parser.add_argument("--minimum-saturation", type=float, default=0.18)
    parser.add_argument("--minimum-blue-minus-red", type=float, default=0.035)
    parser.add_argument("--minimum-blue-minus-green", type=float, default=0.012)
    arguments = parser.parse_args()

    registration = read_json(arguments.registration)
    if registration.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("Registration input has the wrong artifact kind")
    if registration.get("coordinateReference", {}).get("horizontal") != (
        "NAD83(2011) Florida East, EPSG:6438, US survey feet"
    ):
        raise ValueError("Registration is not in the expected EPSG:6438 foot frame")
    if not arguments.epoch:
        raise ValueError("At least one orthophoto epoch is required")

    parameters = {
        "searchRadiusFeet": arguments.search_radius_feet,
        "normalStepFeet": arguments.normal_step_feet,
        "alongSpacingFeet": arguments.along_spacing_feet,
        "minimumAlongSamples": arguments.minimum_along_samples,
        "hitRadiusFeet": arguments.hit_radius_feet,
        "ambiguityDistanceFeet": arguments.ambiguity_distance_feet,
        "minimumCoverage": arguments.minimum_coverage,
        "minimumUniqueness": arguments.minimum_uniqueness,
        "maximumMedianDistanceFeet": arguments.maximum_median_distance_feet,
        "maximumP75DistanceFeet": arguments.maximum_p75_distance_feet,
        "minimumBlue": arguments.minimum_blue,
        "minimumSaturation": arguments.minimum_saturation,
        "minimumBlueMinusRed": arguments.minimum_blue_minus_red,
        "minimumBlueMinusGreen": arguments.minimum_blue_minus_green,
    }
    epoch_artifacts = []
    union_by_row: dict[str, dict[str, Any]] = {
        row["rowKey"]: {
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "publishedSeatCount": row["publishedSeatCount"],
            "detectedEpochs": [],
            "identifiableEpochs": [],
            "candidateEpochs": [],
            "fixedProjectionCandidateEpochs": [],
            "epochEvidence": [],
        }
        for row in registration["rows"]
    }
    for epoch in arguments.epoch:
        manifest_path = epoch.manifest_path.resolve()
        image_path = epoch.image_path.resolve()
        if not manifest_path.is_file() or not image_path.is_file():
            raise ValueError(f"Missing source for {epoch.year}")
        manifest = read_json(manifest_path)
        metadata = raster_metadata(manifest)
        if metadata["coordinateReferenceSystem"] != "EPSG:6438":
            raise ValueError(f"Epoch {epoch.year} is not EPSG:6438")
        image_hash = sha256_file(image_path)
        if metadata["declaredSha256"] != image_hash:
            raise ValueError(f"Epoch {epoch.year} image hash does not match manifest")
        image = Image.open(image_path).convert("RGB")
        rgb = np.asarray(image)
        seat_mask = blue_seat_mask(rgb, parameters)
        distance_feet = distance_transform_edt(
            ~seat_mask,
            sampling=(metadata["pixelSizeY"], metadata["pixelSizeX"]),
        )
        row_results = []
        for row in registration["rows"]:
            result = {
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                **audit_row(
                    row,
                    distance_feet,
                    metadata["extent"],
                    metadata["pixelSizeX"],
                    metadata["pixelSizeY"],
                    parameters,
                ),
            }
            row_results.append(result)
            union = union_by_row[row["rowKey"]]
            if result.get("blueSeatBandDetected"):
                union["detectedEpochs"].append(epoch.year)
            if result.get("blueSeatBandIdentifiable"):
                union["identifiableEpochs"].append(epoch.year)
            if result.get("measurementCandidate"):
                union["candidateEpochs"].append(epoch.year)
            if result.get("fixedProjection", {}).get("candidate"):
                union["fixedProjectionCandidateEpochs"].append(epoch.year)
            if result.get("status") == "evaluated":
                union["epochEvidence"].append({
                    "year": epoch.year,
                    "roofState": epoch.roof_state,
                    "blueSeatBandDetected": result["blueSeatBandDetected"],
                    "blueSeatBandIdentifiable": result["blueSeatBandIdentifiable"],
                    "measurementCandidate": result["measurementCandidate"],
                    "fixedProjectionCandidate": result["fixedProjection"]["candidate"],
                    "controlOffsetFeet": result["control"]["offsetFeet"],
                    "holdoutOffsetFeet": result["holdout"]["offsetFeet"],
                    "meanControlHoldoutOffsetFeet": (
                        result["control"]["offsetFeet"]
                        + result["holdout"]["offsetFeet"]
                    ) / 2.0,
                    "absoluteControlHoldoutOffsetResidualFeet": result[
                        "absoluteControlHoldoutOffsetResidualFeet"
                    ],
                    "controlCoverage": result["control"]["coverage"],
                    "holdoutCoverage": result["holdout"]["coverage"],
                    "controlUniqueness": result["control"]["uniqueness"],
                    "holdoutUniqueness": result["holdout"]["uniqueness"],
                })
        evaluated = [item for item in row_results if item.get("status") == "evaluated"]
        detected = [item for item in evaluated if item["blueSeatBandDetected"]]
        identifiable = [item for item in evaluated if item["blueSeatBandIdentifiable"]]
        candidates = [item for item in evaluated if item["measurementCandidate"]]
        fixed_candidates = [
            item
            for item in evaluated
            if item.get("fixedProjection", {}).get("candidate")
        ]
        residuals = [
            item["absoluteControlHoldoutOffsetResidualFeet"] for item in identifiable
        ]
        source = {
            "year": epoch.year,
            "roofState": epoch.roof_state,
            "manifestPath": str(epoch.manifest_path),
            "manifestSha256": sha256_file(manifest_path),
            "manifestArtifactVersion": manifest.get("artifactVersion"),
            "imagePath": str(epoch.image_path),
            "imageSha256": image_hash,
            "serviceUrl": metadata["serviceUrl"],
            "extent": metadata["extent"],
            "coordinateReferenceSystem": metadata["coordinateReferenceSystem"],
            "pixelSizeFeet": [metadata["pixelSizeX"], metadata["pixelSizeY"]],
            "dimensionsPixels": [image.width, image.height],
        }
        epoch_artifacts.append({
            "source": source,
            "mask": {
                "blueSeatPixelCount": int(seat_mask.sum()),
                "blueSeatPixelPercent": float(seat_mask.mean() * 100.0),
            },
            "counts": {
                "rowsTotal": len(row_results),
                "rowsEvaluated": len(evaluated),
                "rowsWithBlueSeatBandDetected": len(detected),
                "rowsWithIdentifiableBlueSeatBand": len(identifiable),
                "measurementCandidateRows": len(candidates),
                "fixedProjectionCandidateRows": len(fixed_candidates),
            },
            "identifiableResidualsFeet": {
                "median": percentile(residuals, 50),
                "p95": percentile(residuals, 95),
                "maximum": max(residuals) if residuals else None,
            },
            "rows": row_results,
        })
        if arguments.review_directory:
            render_review(
                image,
                row_results,
                metadata,
                arguments.review_directory / f"{epoch.year}-row-visibility-review.png",
            )

    union_rows = list(union_by_row.values())
    for row in union_rows:
        candidates = [
            item for item in row["epochEvidence"] if item["measurementCandidate"]
        ]
        candidate_offsets = [
            item["meanControlHoldoutOffsetFeet"] for item in candidates
        ]
        pairwise_range = (
            max(candidate_offsets) - min(candidate_offsets)
            if candidate_offsets
            else None
        )
        row["crossEpochCandidate"] = {
            "minimumIndependentEpochs": 2,
            "maximumPairwiseOffsetDifferenceFeet": pairwise_range,
            "pass": bool(
                len(candidates) >= 2
                and pairwise_range is not None
                and pairwise_range <= ONE_FOOT
            ),
            "supportingYears": [item["year"] for item in candidates],
            "supportingOffsetsFeet": candidate_offsets,
        }
    detected_union = [item for item in union_rows if item["detectedEpochs"]]
    identifiable_union = [item for item in union_rows if item["identifiableEpochs"]]
    candidate_union = [item for item in union_rows if item["candidateEpochs"]]
    fixed_projection_union = [
        item for item in union_rows if item["fixedProjectionCandidateEpochs"]
    ]
    cross_epoch_union = [
        item for item in union_rows if item["crossEpochCandidate"]["pass"]
    ]
    stable = {
        "registrationArtifactVersion": registration["artifactVersion"],
        "parameters": parameters,
        "epochs": epoch_artifacts,
        "unionRows": union_rows,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "multi-epoch-provider-row-orthophoto-visibility-audit",
        "artifactVersion": stable_sha256(stable),
        "stadiumId": registration["stadiumId"],
        "sources": {
            "registrationPath": str(arguments.registration),
            "registrationSha256": sha256_file(arguments.registration),
            "registrationArtifactVersion": registration["artifactVersion"],
            "orthophotoEpochs": [item["source"] for item in epoch_artifacts],
        },
        "method": {
            "description": (
                "Blue physical-seat mask with deterministic along-row control and "
                "holdout fits of the cross-row offset from current provider row chords"
            ),
            "split": "sha256(rowKey) selects one of every five along-row samples as holdout",
            "parameters": parameters,
            "limitations": [
                "Blue-pixel evidence is a visibility detector, not a semantic row-label control",
                "A fitted nearby seat band can be an adjacent row because provider camera-point semantics are unverified",
                "Historical imagery does not by itself establish current row persistence",
                "Two-dimensional orthophotos do not establish row or obstruction elevation",
                "Roof shadow can prevent an exposed physical row from being identifiable",
            ],
        },
        "counts": {
            "providerRows": len(union_rows),
            "rowsWithDetectedSeatBandInAnyEpoch": len(detected_union),
            "rowsWithIdentifiableSeatBandInAnyEpoch": len(identifiable_union),
            "measurementCandidateRowsInAnyEpoch": len(candidate_union),
            "fixedProjectionCandidateRowsInAnyEpoch": len(fixed_projection_union),
            "crossEpochAgreementCandidateRows": len(cross_epoch_union),
            "rowsWithoutMeasurementCandidate": len(union_rows) - len(candidate_union),
            "measurementCandidateCoveragePercent": (
                len(candidate_union) / len(union_rows) * 100.0 if union_rows else 0.0
            ),
            "crossEpochAgreementCandidateCoveragePercent": (
                len(cross_epoch_union) / len(union_rows) * 100.0
                if union_rows else 0.0
            ),
            "fixedProjectionCandidateCoveragePercent": (
                len(fixed_projection_union) / len(union_rows) * 100.0
                if union_rows else 0.0
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "PROVIDER_CAMERA_POINT_SEMANTICS_NOT_INDEPENDENTLY_ESTABLISHED",
                "CANDIDATE_ROW_LABEL_IDENTITY_NOT_INDEPENDENTLY_ESTABLISHED",
                "CURRENT_ROW_PERSISTENCE_NOT_ESTABLISHED_FOR_HISTORICAL_EPOCHS",
                "COMBINED_ROW_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT",
                "ROW_ELEVATIONS_NOT_INDEPENDENTLY_MEASURED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "epochs": epoch_artifacts,
        "unionRows": union_rows,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact["artifactVersion"],
        "counts": artifact["counts"],
        "epochCounts": [
            {"year": item["source"]["year"], **item["counts"]}
            for item in epoch_artifacts
        ],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
