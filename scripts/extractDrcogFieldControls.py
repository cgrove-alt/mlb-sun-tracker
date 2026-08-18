#!/usr/bin/env python3
"""Extract regulation field controls from a georeferenced DRCOG crop.

The 2022 image contains visible 15-inch first- and third-base bags, while home
plate is obscured. This diagnostic detects the two bags, reconstructs the
regulation square, and reports segmentation repeatability separately from the
unknown absolute accuracy of the orthophoto.
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
from pyproj import CRS, Proj, Transformer


ANALYSIS_VERSION = "drcog-regulation-field-controls-v2"
OFFICIAL_RULES_URL = (
    "https://img.mlbstatic.com/mlb-images/image/upload/mlb/"
    "hhvryxqioipb87os1puw.pdf"
)
BASE_PATH_FEET = 90.0
BASE_WIDTH_FEET = 15.0 / 12.0
HOME_TO_SECOND_FEET = math.hypot(BASE_PATH_FEET, BASE_PATH_FEET)
FIRST_TO_THIRD_CENTRE_FEET = math.sqrt(2.0) * (
    BASE_PATH_FEET - BASE_WIDTH_FEET
)
HOME_TO_BASE_PAIR_MIDPOINT_FEET = math.hypot(
    BASE_PATH_FEET / 2.0,
    BASE_PATH_FEET / 2.0,
)
MOUND_DISTANCE_FEET = 60.5
THRESHOLDS = (135, 145, 155, 165, 175, 185, 195)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    serialized = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def projected_point(
    pixel: np.ndarray,
    minimum_x: float,
    maximum_y: float,
    pixel_width: float,
    pixel_height: float,
) -> list[float]:
    return [
        minimum_x + float(pixel[0]) * pixel_width,
        maximum_y + float(pixel[1]) * pixel_height,
    ]


def grid_bearing_to_true_bearing(
    grid_bearing_degrees: float,
    projected_crs: CRS,
    longitude: float,
    latitude: float,
) -> tuple[float, float]:
    meridian_convergence_degrees = float(
        Proj(projected_crs).get_factors(longitude, latitude).meridian_convergence
    )
    true_bearing_degrees = (
        grid_bearing_degrees + meridian_convergence_degrees
    ) % 360.0
    return true_bearing_degrees, meridian_convergence_degrees


def detect_base_pair(
    image: np.ndarray,
    threshold: int,
    maximum_candidate_y: int,
    minimum_candidate_x: int,
    maximum_candidate_x: int,
    expected_separation_pixels: float,
    separation_tolerance_pixels: float,
) -> dict[str, Any]:
    blue, green, red = cv2.split(image)
    maximum = np.maximum.reduce((red, green, blue)).astype(np.int16)
    minimum = np.minimum.reduce((red, green, blue)).astype(np.int16)
    mask = (
        (red > threshold)
        & (green > threshold)
        & (blue > threshold)
        & ((maximum - minimum) < 60)
    ).astype(np.uint8)
    count, labels, stats, centroids = cv2.connectedComponentsWithStats(mask, 8)
    candidates: list[dict[str, Any]] = []
    for index in range(1, count):
        x, y, width, height, area = (int(value) for value in stats[index])
        centre_x, centre_y = (float(value) for value in centroids[index])
        if not (
            20 <= area <= 100
            and 3 <= width <= 15
            and 3 <= height <= 15
            and y < maximum_candidate_y
            and minimum_candidate_x < centre_x < maximum_candidate_x
        ):
            continue
        candidates.append(
            {
                "componentId": index,
                "areaPixels": area,
                "centroidPixels": [centre_x, centre_y],
                "boundsPixels": [x, y, width, height],
            }
        )
    pairs: list[tuple[dict[str, Any], dict[str, Any], float]] = []
    for first_index, first in enumerate(candidates):
        first_centre = np.asarray(first["centroidPixels"], dtype=np.float64)
        for second in candidates[first_index + 1 :]:
            second_centre = np.asarray(second["centroidPixels"], dtype=np.float64)
            separation = float(np.linalg.norm(second_centre - first_centre))
            if abs(separation - expected_separation_pixels) <= separation_tolerance_pixels:
                pairs.append((first, second, separation))
    if len(pairs) != 1:
        raise ValueError(
            f"Threshold {threshold} produced {len(pairs)} plausible base pairs; expected one"
        )
    first, second, separation = pairs[0]
    left, right = sorted((first, second), key=lambda value: value["centroidPixels"][0])
    return {
        "threshold": threshold,
        "candidateCount": len(candidates),
        "leftBase": left,
        "rightBase": right,
        "separationPixels": separation,
        "mask": mask,
        "labels": labels,
        "stats": stats,
        "centroids": centroids,
    }


def reconstruct_controls(
    left_pixels: np.ndarray,
    right_pixels: np.ndarray,
    pixel_size_feet: float,
    home_side: str,
) -> dict[str, np.ndarray | float]:
    pair_vector = right_pixels - left_pixels
    pair_unit = pair_vector / np.linalg.norm(pair_vector)
    perpendicular = np.asarray([-pair_unit[1], pair_unit[0]], dtype=np.float64)
    if home_side == "north":
        perpendicular *= -1.0
    midpoint = (left_pixels + right_pixels) / 2.0
    midpoint_offset_pixels = HOME_TO_BASE_PAIR_MIDPOINT_FEET / pixel_size_feet
    home = midpoint + perpendicular * midpoint_offset_pixels
    second = midpoint - perpendicular * midpoint_offset_pixels
    field_axis = second - home
    field_axis /= np.linalg.norm(field_axis)
    mound = home + field_axis * (MOUND_DISTANCE_FEET / pixel_size_feet)
    return {
        "basePairMidpointPixels": midpoint,
        "homePlateRearPointPixels": home,
        "secondBasePointPixels": second,
        "moundRearPointPixels": mound,
        "fieldAxisImageUnitVector": field_axis,
        "pairUnitVector": pair_unit,
    }


def find_mound_cover(
    detection: dict[str, Any],
    expected_mound: np.ndarray,
) -> dict[str, Any]:
    stats = detection["stats"]
    centroids = detection["centroids"]
    candidates: list[dict[str, Any]] = []
    for index in range(1, len(stats)):
        x, y, width, height, area = (int(value) for value in stats[index])
        centre = np.asarray(centroids[index], dtype=np.float64)
        distance = float(np.linalg.norm(centre - expected_mound))
        if 2_000 <= area <= 8_000 and 50 <= width <= 100 and 50 <= height <= 100:
            candidates.append(
                {
                    "componentId": index,
                    "areaPixels": area,
                    "centroidPixels": centre.tolist(),
                    "boundsPixels": [x, y, width, height],
                    "distanceFromExpectedMoundPixels": distance,
                }
            )
    if not candidates:
        raise ValueError("No plausible mound-cover component was detected")
    return min(candidates, key=lambda value: value["distanceFromExpectedMoundPixels"])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--crop-json", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-overlay", type=Path, required=True)
    parser.add_argument("--home-side", choices=("north", "south"), required=True)
    parser.add_argument("--maximum-candidate-y", type=int, required=True)
    parser.add_argument("--minimum-candidate-x", type=int, required=True)
    parser.add_argument("--maximum-candidate-x", type=int, required=True)
    parser.add_argument("--separation-tolerance-feet", type=float, default=2.0)
    args = parser.parse_args()

    crop_bytes = args.crop_json.read_bytes()
    crop = json.loads(crop_bytes)
    if crop.get("artifactKind") != "drcog-orthophoto-crop":
        raise ValueError("Input is not a DRCOG orthophoto crop")
    image_path = Path(crop["outputImage"]["path"])
    image_hash = sha256_file(image_path)
    if image_hash != crop.get("outputImage", {}).get("sha256"):
        raise ValueError("Crop image hash does not match its manifest")
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("OpenCV could not read the crop image")

    orthophoto_manifest_path = Path(crop["source"]["manifestPath"])
    orthophoto_manifest_bytes = orthophoto_manifest_path.read_bytes()
    if hashlib.sha256(orthophoto_manifest_bytes).hexdigest() != crop["source"][
        "manifestSha256"
    ]:
        raise ValueError("Orthophoto manifest hash does not match the crop manifest")
    orthophoto_manifest = json.loads(orthophoto_manifest_bytes)
    projected_crs = CRS.from_epsg(
        int(orthophoto_manifest["spatialReference"]["latestWkid"])
    )

    pixel_width, pixel_height = (float(value) for value in crop["pixelSizeFeet"])
    if pixel_width <= 0 or pixel_height >= 0 or abs(pixel_width + pixel_height) > 1e-9:
        raise ValueError("Crop pixels must be north-up and square")
    expected_separation_pixels = FIRST_TO_THIRD_CENTRE_FEET / pixel_width
    tolerance_pixels = args.separation_tolerance_feet / pixel_width

    detections: list[dict[str, Any]] = []
    controls_by_threshold: list[dict[str, Any]] = []
    for threshold in THRESHOLDS:
        detection = detect_base_pair(
            image,
            threshold,
            args.maximum_candidate_y,
            args.minimum_candidate_x,
            args.maximum_candidate_x,
            expected_separation_pixels,
            tolerance_pixels,
        )
        left = np.asarray(detection["leftBase"]["centroidPixels"], dtype=np.float64)
        right = np.asarray(detection["rightBase"]["centroidPixels"], dtype=np.float64)
        controls = reconstruct_controls(left, right, pixel_width, args.home_side)
        detections.append(detection)
        controls_by_threshold.append(
            {
                "threshold": threshold,
                "leftBasePixels": left,
                "rightBasePixels": right,
                **controls,
            }
        )

    reference_index = THRESHOLDS.index(145)
    reference_detection = detections[reference_index]
    reference = controls_by_threshold[reference_index]
    home_samples = np.vstack(
        [value["homePlateRearPointPixels"] for value in controls_by_threshold]
    )
    axis_samples = np.vstack(
        [value["fieldAxisImageUnitVector"] for value in controls_by_threshold]
    )
    maximum_home_delta_feet = float(
        np.max(np.linalg.norm(home_samples - home_samples[reference_index], axis=1))
        * pixel_width
    )
    bearings = np.degrees(np.arctan2(axis_samples[:, 0], -axis_samples[:, 1]))
    reference_bearing = float(bearings[reference_index])
    bearing_deltas = ((bearings - reference_bearing + 180.0) % 360.0) - 180.0
    maximum_bearing_delta_degrees = float(np.max(np.abs(bearing_deltas)))
    mound_cover = find_mound_cover(
        reference_detection,
        np.asarray(reference["moundRearPointPixels"]),
    )

    bounds = crop["projectedBoundsFeet"]
    minimum_x = float(bounds["minimumX"])
    maximum_y = float(bounds["maximumY"])
    left_world = projected_point(
        np.asarray(reference["leftBasePixels"]),
        minimum_x,
        maximum_y,
        pixel_width,
        pixel_height,
    )
    right_world = projected_point(
        np.asarray(reference["rightBasePixels"]),
        minimum_x,
        maximum_y,
        pixel_width,
        pixel_height,
    )
    home_world = projected_point(
        np.asarray(reference["homePlateRearPointPixels"]),
        minimum_x,
        maximum_y,
        pixel_width,
        pixel_height,
    )
    second_world = projected_point(
        np.asarray(reference["secondBasePointPixels"]),
        minimum_x,
        maximum_y,
        pixel_width,
        pixel_height,
    )
    mound_world = projected_point(
        np.asarray(reference["moundRearPointPixels"]),
        minimum_x,
        maximum_y,
        pixel_width,
        pixel_height,
    )
    mound_cover_world = projected_point(
        np.asarray(mound_cover["centroidPixels"]),
        minimum_x,
        maximum_y,
        pixel_width,
        pixel_height,
    )
    measured_base_separation_feet = (
        float(reference_detection["separationPixels"]) * pixel_width
    )
    mound_cover_residual_feet = (
        float(mound_cover["distanceFromExpectedMoundPixels"]) * pixel_width
    )
    to_lonlat = Transformer.from_crs(projected_crs, 4326, always_xy=True)
    home_longitude, home_latitude = to_lonlat.transform(*home_world)
    true_north_bearing, meridian_convergence_degrees = grid_bearing_to_true_bearing(
        reference_bearing,
        projected_crs,
        home_longitude,
        home_latitude,
    )

    overlay = image.copy()
    colours = {
        "left": (0, 0, 255),
        "right": (0, 0, 255),
        "home": (0, 255, 255),
        "second": (255, 128, 0),
        "mound": (255, 255, 0),
        "cover": (255, 0, 255),
    }
    overlay_points = {
        "left": np.asarray(reference["leftBasePixels"]),
        "right": np.asarray(reference["rightBasePixels"]),
        "home": np.asarray(reference["homePlateRearPointPixels"]),
        "second": np.asarray(reference["secondBasePointPixels"]),
        "mound": np.asarray(reference["moundRearPointPixels"]),
        "cover": np.asarray(mound_cover["centroidPixels"]),
    }
    cv2.line(
        overlay,
        tuple(np.rint(overlay_points["home"]).astype(int)),
        tuple(np.rint(overlay_points["second"]).astype(int)),
        (0, 255, 255),
        2,
    )
    cv2.line(
        overlay,
        tuple(np.rint(overlay_points["left"]).astype(int)),
        tuple(np.rint(overlay_points["right"]).astype(int)),
        (0, 0, 255),
        2,
    )
    for label, point in overlay_points.items():
        integer_point = tuple(np.rint(point).astype(int))
        cv2.circle(overlay, integer_point, 8, colours[label], 2)
        cv2.putText(
            overlay,
            label,
            (integer_point[0] + 10, integer_point[1] - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            colours[label],
            2,
            cv2.LINE_AA,
        )
    args.output_overlay.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_overlay), overlay):
        raise ValueError("OpenCV could not write the control overlay")

    sensitivity = []
    for index, value in enumerate(controls_by_threshold):
        sensitivity.append(
            {
                "threshold": int(value["threshold"]),
                "leftBasePixels": value["leftBasePixels"].tolist(),
                "rightBasePixels": value["rightBasePixels"].tolist(),
                "homePlateRearPointPixels": value["homePlateRearPointPixels"].tolist(),
                "fieldAxisBearingDegreesEastOfGridNorth": float(bearings[index]),
            }
        )
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": crop.get("stadiumId"),
        "source": {
            "cropJsonPath": str(args.crop_json.resolve()),
            "cropJsonSha256": hashlib.sha256(crop_bytes).hexdigest(),
            "cropArtifactVersion": crop.get("artifactVersion"),
            "cropImagePath": str(image_path.resolve()),
            "cropImageSha256": image_hash,
            "orthophotoArtifactVersion": crop.get("source", {}).get("artifactVersion"),
            "orthophotoProjectedCrs": projected_crs.to_string(),
            "official2022RulesUrl": OFFICIAL_RULES_URL,
        },
        "regulationGeometryFeet": {
            "basePath": BASE_PATH_FEET,
            "baseBagWidth": BASE_WIDTH_FEET,
            "homeToSecond": HOME_TO_SECOND_FEET,
            "firstToThirdBagCentre": FIRST_TO_THIRD_CENTRE_FEET,
            "homeToBasePairMidpoint": HOME_TO_BASE_PAIR_MIDPOINT_FEET,
            "homeToPitchersPlateRearPoint": MOUND_DISTANCE_FEET,
        },
        "detection": {
            "brightnessThreshold": 145,
            "thresholdSensitivityValues": list(THRESHOLDS),
            "maximumCandidateY": args.maximum_candidate_y,
            "minimumCandidateX": args.minimum_candidate_x,
            "maximumCandidateX": args.maximum_candidate_x,
            "separationToleranceFeet": args.separation_tolerance_feet,
            "referenceCandidateCount": reference_detection["candidateCount"],
            "uniqueBasePairAtEveryThreshold": True,
            "homeSide": args.home_side,
        },
        "controls": {
            "leftBaseCentroidPixels": reference["leftBasePixels"].tolist(),
            "rightBaseCentroidPixels": reference["rightBasePixels"].tolist(),
            "leftBaseCentroidProjectedFeet": left_world,
            "rightBaseCentroidProjectedFeet": right_world,
            "homePlateRearPointPixels": reference["homePlateRearPointPixels"].tolist(),
            "homePlateRearPointProjectedFeet": home_world,
            "secondBasePointPixels": reference["secondBasePointPixels"].tolist(),
            "secondBasePointProjectedFeet": second_world,
            "pitchersPlateRearPointPixels": reference["moundRearPointPixels"].tolist(),
            "pitchersPlateRearPointProjectedFeet": mound_world,
            "moundCoverCentroidPixels": mound_cover["centroidPixels"],
            "moundCoverCentroidProjectedFeet": mound_cover_world,
            "fieldAxisImageUnitVector": reference["fieldAxisImageUnitVector"].tolist(),
            "fieldAxisBearingDegreesEastOfGridNorth": reference_bearing,
            "fieldAxisBearingDegreesEastOfTrueNorth": true_north_bearing,
            "homePlateLongitudeLatitude": [home_longitude, home_latitude],
            "meridianConvergenceDegrees": meridian_convergence_degrees,
            "bearingConversion": (
                "true bearing equals grid bearing plus meridian convergence"
            ),
        },
        "validation": {
            "measuredBaseBagCentreSeparationFeet": measured_base_separation_feet,
            "expectedBaseBagCentreSeparationFeet": FIRST_TO_THIRD_CENTRE_FEET,
            "baseBagCentreSeparationResidualFeet": abs(
                measured_base_separation_feet - FIRST_TO_THIRD_CENTRE_FEET
            ),
            "moundCoverCentroidResidualFeet": mound_cover_residual_feet,
            "maximumHomePointDeltaAcrossThresholdsFeet": maximum_home_delta_feet,
            "maximumBearingDeltaAcrossThresholdsDegrees": maximum_bearing_delta_degrees,
            "segmentationRepeatabilityWithinOneFoot": maximum_home_delta_feet <= 1.0,
            "segmentationBearingRepeatabilityWithinOneDegree": (
                maximum_bearing_delta_degrees <= 1.0
            ),
            "orthophotoAbsoluteAccuracyVerifiedAt95Percent": False,
            "trueNorthConversionApplied": True,
        },
        "thresholdSensitivity": sensitivity,
        "overlay": {
            "path": str(args.output_overlay.resolve()),
            "sha256": sha256_file(args.output_overlay),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "drcog-regulation-field-control-candidate",
        "artifactVersion": "sha256:" + stable_sha256(stable),
        **stable,
        "geometryBoundary": {
            "establishesProjectedHomePlateCandidate": True,
            "establishesProjectedFieldAxisCandidate": True,
            "establishesSubFootSegmentationRepeatability": (
                maximum_home_delta_feet <= 1.0
            ),
            "establishesSubFootAbsoluteHorizontalAccuracy": False,
            "establishesSurveyedWorldCoordinates": False,
            "establishesElevatedRowCoordinates": False,
            "note": (
                "Regulation reconstruction and threshold stability do not replace an "
                "official 95-percent absolute-accuracy statement or surveyed controls."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "ORTHOPHOTO_HORIZONTAL_ACCURACY_NOT_VERIFIED_AT_95_PERCENT",
                "FIELD_CONTROL_DERIVED_FROM_REGULATION_GEOMETRY_NOT_SURVEY",
                "HOME_PLATE_OBSCURED_AND_RECONSTRUCTED",
                "ROW_ELEVATIONS_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(artifact, indent=2))


if __name__ == "__main__":
    main()
