#!/usr/bin/env python3
"""Extract a locked ground-level outfield holdout from panorama and orthophoto."""

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

from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-panorama-outfield-ground-holdout-extraction-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_bound_input(record: dict[str, Any]) -> tuple[bytes, Any]:
    path = Path(record["path"])
    data = path.read_bytes()
    if hashlib.sha256(data).hexdigest() != record["sha256"]:
        raise ValueError(f"Input checksum differs: {path}")
    return data, json.loads(data) if path.suffix.lower() == ".json" else None


def green_score(image: np.ndarray) -> np.ndarray:
    blue, green, red = cv2.split(image.astype(np.float64))
    return 2.0 * green - red - blue


def sample_boundary(
    score: np.ndarray,
    region: dict[str, Any],
    threshold: float,
    x_step: int,
    passing_in_five: int,
) -> np.ndarray:
    points = []
    for x_value in range(int(region["xMinimum"]), int(region["xMaximum"]) + 1, x_step):
        if "expectedLine" in region:
            expected = region["expectedLine"]
            centre = float(expected["slope"]) * x_value + float(expected["intercept"])
            half_band = float(expected["halfBandPixels"])
            y_minimum = max(0, int(math.floor(centre - half_band)))
            y_maximum = min(score.shape[0] - 1, int(math.ceil(centre + half_band)))
        else:
            y_minimum = int(region["yMinimum"])
            y_maximum = int(region["yMaximum"])
        values = score[y_minimum : y_maximum + 1, x_value] > threshold
        if len(values) < 5:
            continue
        window = np.convolve(values.astype(np.int16), np.ones(5, dtype=np.int16), mode="valid")
        matches = np.flatnonzero(window >= passing_in_five)
        if len(matches) == 0:
            continue
        if "expectedLine" in region:
            candidate_y = y_minimum + matches + 2
            selected_index = int(np.argmin(np.abs(candidate_y - centre)))
            y_value = float(candidate_y[selected_index])
        else:
            y_value = float(y_minimum + matches[0] + 2)
        points.append([float(x_value), y_value])
    return np.asarray(points, dtype=np.float64)


def robust_line(points: np.ndarray) -> tuple[float, float, np.ndarray]:
    if len(points) < 2:
        raise ValueError("At least two samples are required for a line")
    slope, intercept = np.polyfit(points[:, 0], points[:, 1], 1)

    def residuals(parameters: np.ndarray) -> np.ndarray:
        return points[:, 1] - (parameters[0] * points[:, 0] + parameters[1])

    fitted = least_squares(
        residuals,
        np.asarray([slope, intercept], dtype=np.float64),
        loss="soft_l1",
        f_scale=1.0,
        xtol=1e-12,
        ftol=1e-12,
        gtol=1e-12,
    )
    values = residuals(fitted.x)
    return float(fitted.x[0]), float(fitted.x[1]), values


def intersection(first: tuple[float, float], second: tuple[float, float]) -> np.ndarray:
    denominator = first[0] - second[0]
    if abs(denominator) < 1e-9:
        raise ValueError("Boundary lines are parallel")
    x_value = (second[1] - first[1]) / denominator
    return np.asarray([x_value, first[0] * x_value + first[1]], dtype=np.float64)


def extract_vertex(
    score: np.ndarray,
    regions: dict[str, Any],
    thresholds: list[float],
    x_step: int,
    passing_in_five: int,
    minimum_samples: int,
    seed: int,
) -> dict[str, Any]:
    threshold_records = []
    selected_points: tuple[np.ndarray, np.ndarray] | None = None
    for threshold in thresholds:
        first_points = sample_boundary(
            score, regions["centerSegment"], threshold, x_step, passing_in_five
        )
        second_points = sample_boundary(
            score, regions["rightCenterSegment"], threshold, x_step, passing_in_five
        )
        if len(first_points) < minimum_samples or len(second_points) < minimum_samples:
            raise ValueError(
                f"Threshold {threshold} has too few samples: "
                f"{len(first_points)} and {len(second_points)}"
            )
        first_slope, first_intercept, first_residuals = robust_line(first_points)
        second_slope, second_intercept, second_residuals = robust_line(second_points)
        vertex = intersection(
            (first_slope, first_intercept), (second_slope, second_intercept)
        )
        threshold_records.append(
            {
                "greenScoreThreshold": threshold,
                "centerSegment": {
                    "sampleCount": len(first_points),
                    "slope": first_slope,
                    "intercept": first_intercept,
                    "residualPixels95": float(np.percentile(np.abs(first_residuals), 95.0)),
                },
                "rightCenterSegment": {
                    "sampleCount": len(second_points),
                    "slope": second_slope,
                    "intercept": second_intercept,
                    "residualPixels95": float(np.percentile(np.abs(second_residuals), 95.0)),
                },
                "vertexPixel": vertex.tolist(),
            }
        )
        if threshold == thresholds[len(thresholds) // 2]:
            selected_points = (first_points, second_points)
    if selected_points is None:
        raise ValueError("No selected threshold points")

    selected = np.asarray(
        threshold_records[len(threshold_records) // 2]["vertexPixel"], dtype=np.float64
    )
    threshold_vertices = np.asarray(
        [record["vertexPixel"] for record in threshold_records], dtype=np.float64
    )
    threshold_sensitivity = float(
        np.max(np.linalg.norm(threshold_vertices - selected, axis=1))
    )

    rng = np.random.default_rng(seed)
    first_points, second_points = selected_points
    bootstrap_vertices = []
    for _ in range(1000):
        sampled_first = first_points[
            rng.integers(0, len(first_points), size=len(first_points))
        ]
        sampled_second = second_points[
            rng.integers(0, len(second_points), size=len(second_points))
        ]
        first_slope, first_intercept, _ = robust_line(sampled_first)
        second_slope, second_intercept, _ = robust_line(sampled_second)
        bootstrap_vertices.append(
            intersection(
                (first_slope, first_intercept),
                (second_slope, second_intercept),
            )
        )
    bootstrap = np.vstack(bootstrap_vertices)
    bootstrap_radial_95 = float(
        np.percentile(np.linalg.norm(bootstrap - selected, axis=1), 95.0)
    )
    combined_uncertainty_95 = threshold_sensitivity + bootstrap_radial_95
    return {
        "selectedThreshold": thresholds[len(thresholds) // 2],
        "selectedVertexPixel": selected.tolist(),
        "thresholdSweep": threshold_records,
        "uncertainty": {
            "thresholdSensitivityMaximumRadialPixels": threshold_sensitivity,
            "bootstrapSampleCount": 1000,
            "bootstrapSeed": seed,
            "bootstrapRadialPixels95": bootstrap_radial_95,
            "combinedRadialUncertaintyPixels95": combined_uncertainty_95,
            "combinationMethod": "conservative linear sum of threshold sensitivity and bootstrap radial uncertainty",
        },
    }


def draw_review(
    panorama: np.ndarray,
    orthophoto: np.ndarray,
    panorama_result: dict[str, Any],
    orthophoto_result: dict[str, Any],
    output: Path,
) -> None:
    panels = []
    for image, result, radius in (
        (panorama, panorama_result, 180),
        (orthophoto, orthophoto_result, 260),
    ):
        x_value, y_value = result["selectedVertexPixel"]
        left = max(0, int(round(x_value)) - radius)
        top = max(0, int(round(y_value)) - radius)
        right = min(image.shape[1], int(round(x_value)) + radius + 1)
        bottom = min(image.shape[0], int(round(y_value)) + radius + 1)
        panel = image[top:bottom, left:right].copy()
        centre = (int(round(x_value)) - left, int(round(y_value)) - top)
        uncertainty = int(math.ceil(result["uncertainty"]["combinedRadialUncertaintyPixels95"]))
        cv2.circle(panel, centre, max(2, uncertainty), (0, 255, 255), 2, cv2.LINE_AA)
        cv2.drawMarker(panel, centre, (0, 0, 255), cv2.MARKER_CROSS, 22, 2, cv2.LINE_AA)
        cv2.putText(
            panel,
            f"source pixel {x_value:.2f}, {y_value:.2f}",
            (8, 24),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (0, 255, 255),
            2,
            cv2.LINE_AA,
        )
        panels.append(panel)
    height = max(panel.shape[0] for panel in panels)
    resized = []
    for panel in panels:
        if panel.shape[0] != height:
            scale = height / panel.shape[0]
            panel = cv2.resize(panel, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
        resized.append(panel)
    review = np.hstack(resized)
    output.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output), review, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write review image")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("review_image", type=Path)
    args = parser.parse_args()

    control_bytes = args.controls.read_bytes()
    controls = json.loads(control_bytes)
    supported_controls = {
        "rockies-section-207-outfield-ground-holdout-controls-v1",
        "rockies-section-207-left-field-ground-calibration-controls-v1",
    }
    if controls.get("controlVersion") not in supported_controls:
        raise ValueError("Unsupported holdout controls")
    intended_use = controls.get("intendedUse", "independent-holdout")
    independent_holdout = intended_use == "independent-holdout"
    if independent_holdout and not controls.get("lockedBeforePoseResidualReview"):
        raise ValueError("Holdout controls were not locked before residual review")

    panorama_record = controls["inputs"]["panoramaImage"]
    orthophoto_record = controls["inputs"]["orthophotoImage"]
    crop_record = controls["inputs"]["orthophotoCrop"]
    registration_record = controls["inputs"]["ngsOrthophotoRegistration"]
    load_bound_input(panorama_record)
    load_bound_input(orthophoto_record)
    _, crop = load_bound_input(crop_record)
    _, registration = load_bound_input(registration_record)
    if not registration["registrationAcceptance"]["accepted"]:
        raise ValueError("NGS orthophoto registration is not accepted")

    panorama = cv2.imread(panorama_record["path"], cv2.IMREAD_COLOR)
    orthophoto = cv2.imread(orthophoto_record["path"], cv2.IMREAD_COLOR)
    if panorama is None or orthophoto is None:
        raise ValueError("Could not decode a holdout image")

    sampling = controls["sampling"]
    passing = int(controls["greenScore"]["minimumPassingPixelsInFivePixelRun"])
    panorama_result = extract_vertex(
        green_score(panorama),
        controls["panoramaLineRegions"],
        [float(value) for value in controls["greenScore"]["thresholdSweep"]],
        int(sampling["xStepPixels"]),
        passing,
        int(sampling["minimumSamplesPerLine"]),
        20260811,
    )
    orthophoto_result = extract_vertex(
        green_score(orthophoto),
        controls["orthophotoLineRegions"],
        [float(value) for value in controls["orthophotoGreenScore"]["thresholdSweep"]],
        int(sampling["xStepPixels"]),
        passing,
        int(sampling["minimumSamplesPerLine"]),
        20260812,
    )

    pixel_x, pixel_y = orthophoto_result["selectedVertexPixel"]
    pixel_width, pixel_height = (float(value) for value in crop["pixelSizeFeet"])
    minimum_x = float(crop["projectedBoundsFeet"]["minimumX"])
    maximum_y = float(crop["projectedBoundsFeet"]["maximumY"])
    uncorrected_world = np.asarray(
        [minimum_x + pixel_x * pixel_width, maximum_y + pixel_y * pixel_height],
        dtype=np.float64,
    )
    correction = registration["rigidCorrection"]
    corrected_world = (
        np.asarray(correction["rotationMatrix"], dtype=np.float64) @ uncorrected_world
        + np.asarray(correction["translationFeet"], dtype=np.float64)
    )
    orthophoto_uncertainty_feet = (
        orthophoto_result["uncertainty"]["combinedRadialUncertaintyPixels95"]
        * abs(pixel_width)
    )
    absolute_ground_uncertainty_feet = float(
        registration["uncertainty"]["combinedAbsoluteHorizontalUncertainty95Feet"]
    ) + orthophoto_uncertainty_feet

    draw_review(
        panorama,
        orthophoto,
        panorama_result,
        orthophoto_result,
        args.review_image,
    )
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "feature": controls["semanticFeature"],
        "controls": {
            "path": str(args.controls),
            "sha256": hashlib.sha256(control_bytes).hexdigest(),
        },
        "inputs": controls["inputs"],
        "panoramaObservation": {
            "face": panorama_record["face"],
            **panorama_result,
        },
        "orthophotoObservation": {
            **orthophoto_result,
            "uncorrectedProjectedFeet": uncorrected_world.tolist(),
            "ngsCorrectedProjectedFeet": corrected_world.tolist(),
            "extractionRadialUncertainty95Feet": orthophoto_uncertainty_feet,
            "absoluteGroundRadialUncertainty95Feet": absolute_ground_uncertainty_feet,
        },
        "reviewImage": {
            "path": str(args.review_image),
            "sha256": sha256_file(args.review_image),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-section-207-outfield-ground-holdout-extraction",
        "artifactStage": (
            "locked-disjoint-ground-observation-pose-residual-pending"
            if independent_holdout
            else "semantic-recovery-calibration-observation"
        ),
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesIndependentHoldoutObservation": independent_holdout,
            "establishesCalibrationObservation": not independent_holdout,
            "establishesHoldoutPass": False,
            "establishesCameraPose": False,
            "note": (
                "The panorama and orthophoto observations are extracted from locked image regions without reading a camera-pose prediction. A separate audit must compute the residual."
                if independent_holdout
                else "A prior pose diagnostic triggered semantic recovery, so this paired feature is eligible for calibration only and can never serve as an independent holdout for this pose."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                (
                    "OUTFIELD_GROUND_HOLDOUT_RESIDUAL_NOT_COMPUTED"
                    if independent_holdout
                    else "CALIBRATION_FEATURE_NOT_INDEPENDENT_HOLDOUT"
                ),
                "SOURCE_EPOCH_CURRENTNESS_NOT_CONFIRMED",
                "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "artifactVersion": artifact["artifactVersion"],
                "panoramaObservation": artifact["panoramaObservation"],
                "orthophotoObservation": artifact["orthophotoObservation"],
                "reviewImage": artifact["reviewImage"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
