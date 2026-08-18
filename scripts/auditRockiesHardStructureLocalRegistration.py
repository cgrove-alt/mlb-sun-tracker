#!/usr/bin/env python3
"""Audit local Coors LiDAR registration with locked roof train/holdout features."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import laspy
import numpy as np
from PIL import Image, ImageDraw
from pyproj import CRS, Transformer
from scipy.ndimage import distance_transform_edt, map_coordinates
from scipy.optimize import differential_evolution, minimize
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
from scipy.spatial import Delaunay, cKDTree


METRES_TO_FEET = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def inverse_rigid(points: np.ndarray, rotation: np.ndarray, translation: np.ndarray) -> np.ndarray:
    return (points - translation) @ rotation


def apply_transform(
    points: np.ndarray,
    translation: np.ndarray,
    angle_radians: float,
    origin: np.ndarray | None = None,
) -> np.ndarray:
    cosine = math.cos(angle_radians)
    sine = math.sin(angle_radians)
    rotation = np.array([[cosine, -sine], [sine, cosine]], dtype=np.float64)
    if origin is None:
        origin = np.zeros(2, dtype=np.float64)
    return (points - origin) @ rotation.T + origin + translation


def fit_rigid(source: np.ndarray, target: np.ndarray) -> tuple[np.ndarray, float, np.ndarray]:
    source_center = source.mean(axis=0)
    target_center = target.mean(axis=0)
    covariance = (source - source_center).T @ (target - target_center)
    left, _, right = np.linalg.svd(covariance)
    rotation = right.T @ left.T
    if np.linalg.det(rotation) < 0:
        right[-1, :] *= -1
        rotation = right.T @ left.T
    translation = target_center - source_center @ rotation.T
    angle = math.atan2(rotation[1, 0], rotation[0, 0])
    return translation, angle, rotation


def ordered_box(points: np.ndarray) -> np.ndarray:
    center = points.mean(axis=0)
    angles = np.arctan2(points[:, 1] - center[1], points[:, 0] - center[0])
    return points[np.argsort(angles)]


def rectangle_from_points(points: np.ndarray) -> np.ndarray:
    origin = points.mean(axis=0)
    rectangle = cv2.minAreaRect((points - origin).astype(np.float32))
    return ordered_box(cv2.boxPoints(rectangle).astype(np.float64) + origin)


def sample_perimeter(corners: np.ndarray, spacing: float) -> np.ndarray:
    values = []
    for index in range(4):
        start = corners[index]
        end = corners[(index + 1) % 4]
        count = max(2, int(math.ceil(np.linalg.norm(end - start) / spacing)))
        fractions = np.arange(count, dtype=np.float64) / count
        values.append(start + fractions[:, None] * (end - start))
    return np.vstack(values)


def adjusted_rectangle(
    source_corners: np.ndarray,
    translation: np.ndarray,
    angle_radians: float,
    dimension_adjustments: np.ndarray,
) -> np.ndarray:
    center = source_corners.mean(axis=0)
    first_axis = source_corners[1] - source_corners[0]
    second_axis = source_corners[2] - source_corners[1]
    first_length = float(np.linalg.norm(first_axis)) + float(dimension_adjustments[0])
    second_length = float(np.linalg.norm(second_axis)) + float(dimension_adjustments[1])
    if first_length <= 0 or second_length <= 0:
        raise ValueError("Adjusted target rectangle has a non-positive dimension")
    first_axis /= np.linalg.norm(first_axis)
    second_axis /= np.linalg.norm(second_axis)
    cosine = math.cos(angle_radians)
    sine = math.sin(angle_radians)
    rotation = np.array([[cosine, -sine], [sine, cosine]], dtype=np.float64)
    first_axis = rotation @ first_axis
    second_axis = rotation @ second_axis
    target_center = center + translation
    return np.asarray([
        target_center - first_axis * first_length / 2.0 - second_axis * second_length / 2.0,
        target_center + first_axis * first_length / 2.0 - second_axis * second_length / 2.0,
        target_center + first_axis * first_length / 2.0 + second_axis * second_length / 2.0,
        target_center - first_axis * first_length / 2.0 + second_axis * second_length / 2.0,
    ])


def largest_component(points: np.ndarray, radius: float, minimum_count: int) -> np.ndarray:
    pairs = cKDTree(points).query_pairs(radius, output_type="ndarray")
    if len(pairs) == 0:
        raise ValueError("Source plateau has no connected point pairs")
    graph = coo_matrix(
        (
            np.ones(len(pairs) * 2, dtype=np.uint8),
            (np.r_[pairs[:, 0], pairs[:, 1]], np.r_[pairs[:, 1], pairs[:, 0]]),
        ),
        shape=(len(points), len(points)),
    ).tocsr()
    _, labels = connected_components(graph, directed=False)
    counts = np.bincount(labels)
    component = points[labels == int(np.argmax(counts))]
    if len(component) < minimum_count:
        raise ValueError(f"Largest source plateau has only {len(component)} points")
    return component


def sample_orthophoto(
    minimum_x: float,
    minimum_y: float,
    size: int,
    cell: float,
    transformer: Transformer,
    correction_rotation: np.ndarray,
    correction_translation: np.ndarray,
    manifests: list[tuple[dict[str, Any], Path]],
) -> np.ndarray:
    x_values = minimum_x + (np.arange(size, dtype=np.float64) + 0.5) * cell
    y_values = minimum_y + (np.arange(size, dtype=np.float64) + 0.5) * cell
    east, north = np.meshgrid(x_values, y_values)
    state_x, state_y = transformer.transform(east, north)
    corrected = np.column_stack((state_x.ravel(), state_y.ravel()))
    nominal = inverse_rigid(corrected, correction_rotation, correction_translation)
    output = np.zeros((size, size, 3), dtype=np.uint8)
    coverage = np.zeros((size, size), dtype=bool)
    for manifest, image_path in manifests:
        world = [float(value) for value in manifest["worldFile"]["values"]]
        columns = (nominal[:, 0] - world[4]) / world[0]
        rows = (nominal[:, 1] - world[5]) / world[3]
        with Image.open(image_path) as image:
            valid = (
                (columns >= -0.5)
                & (columns <= image.width - 0.5)
                & (rows >= -0.5)
                & (rows <= image.height - 0.5)
            ).reshape(size, size)
            if not valid.any():
                continue
            flat = valid.ravel()
            left = max(0, int(np.floor(columns[flat].min())) - 3)
            top = max(0, int(np.floor(rows[flat].min())) - 3)
            right = min(image.width, int(np.ceil(columns[flat].max())) + 4)
            bottom = min(image.height, int(np.ceil(rows[flat].max())) + 4)
            crop = np.asarray(image.crop((left, top, right, bottom)).convert("RGB"))
        map_x = columns.reshape(size, size).astype(np.float32) - left
        map_y = rows.reshape(size, size).astype(np.float32) - top
        sampled = cv2.remap(
            crop,
            map_x,
            map_y,
            interpolation=cv2.INTER_LANCZOS4,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(0, 0, 0),
        )
        new = valid & ~coverage
        output[new] = sampled[new]
        coverage |= valid
    if not coverage.all():
        raise ValueError("Orthophoto tiles do not cover a feature")
    return np.flipud(output)


def coordinates_to_image(points: np.ndarray, minimum_x: float, minimum_y: float, size: int, cell: float) -> np.ndarray:
    return np.column_stack((
        (points[:, 0] - minimum_x) / cell - 0.5,
        size - ((points[:, 1] - minimum_y) / cell - 0.5) - 1,
    ))


def image_distance_values(
    points: np.ndarray,
    distance: np.ndarray,
    minimum_x: float,
    minimum_y: float,
    cell: float,
) -> np.ndarray:
    pixels = coordinates_to_image(points, minimum_x, minimum_y, distance.shape[0], cell)
    return map_coordinates(
        distance,
        [pixels[:, 1], pixels[:, 0]],
        order=1,
        mode="constant",
        cval=float(distance.max()),
    ) * cell


def bootstrap_rectangle_uncertainty(
    points: np.ndarray,
    reference: np.ndarray,
    samples: int,
    rng: np.random.Generator,
) -> tuple[float, float]:
    reference_perimeter = sample_perimeter(reference, 0.2)
    displacements = []
    center_displacements = []
    for _ in range(samples):
        resampled = points[rng.integers(0, len(points), len(points))]
        candidate = rectangle_from_points(resampled)
        candidate_perimeter = sample_perimeter(candidate, 0.2)
        tree = cKDTree(candidate_perimeter)
        distances, _ = tree.query(reference_perimeter)
        displacements.append(float(np.percentile(distances, 95)))
        center_displacements.append(float(np.linalg.norm(candidate.mean(axis=0) - reference.mean(axis=0))))
    return (
        float(np.percentile(displacements, 95)),
        float(np.percentile(center_displacements, 95)),
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--controls", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    control_bytes = args.controls.read_bytes()
    controls = json.loads(control_bytes)
    if controls.get("artifactKind") != "rockies-hard-structure-local-registration-controls":
        raise ValueError("Unexpected controls artifact kind")
    if controls.get("lockedBeforeFit") is not True:
        raise ValueError("Training and holdout roles were not locked before fitting")
    for key in ["featureReviewPath", "featureReviewControlsPath", "lidarPath", "orthophotoAuditPath"]:
        path = Path(controls["inputs"][key])
        expected_key = key.replace("Path", "Sha256")
        if sha256_file(path) != controls["inputs"][expected_key]:
            raise ValueError(f"Input hash differs for {key}")

    lidar_path = Path(controls["inputs"]["lidarPath"])
    with laspy.open(lidar_path) as source:
        lidar = source.read()
        source_crs = source.header.parse_crs()
    if source_crs is None:
        raise ValueError("LiDAR has no coordinate reference system")
    horizontal_crs = source_crs.sub_crs_list[0] if source_crs.is_compound else source_crs
    to_state = Transformer.from_crs(horizontal_crs, CRS.from_epsg(6428), always_xy=True)
    lidar_x = np.asarray(lidar.x)
    lidar_y = np.asarray(lidar.y)
    lidar_z = np.asarray(lidar.z)

    audit = json.loads(Path(controls["inputs"]["orthophotoAuditPath"]).read_bytes())
    if audit.get("registrationAcceptance", {}).get("accepted") is not True:
        raise ValueError("Corrected orthophoto frame is not accepted")
    correction = audit["rigidCorrection"]
    correction_rotation = np.asarray(correction["rotationMatrix"], dtype=np.float64)
    correction_translation = np.asarray(correction["translationFeet"], dtype=np.float64)
    manifests = []
    for item in controls["inputs"]["orthophotoManifests"]:
        path = Path(item["path"])
        if sha256_file(path) != item["sha256"]:
            raise ValueError("Orthophoto manifest hash differs from controls")
        manifest = json.loads(path.read_bytes())
        image_path = Path(manifest["localFiles"]["orthophoto"])
        if sha256_file(image_path) != manifest["orthophoto"]["sha256"]:
            raise ValueError("Orthophoto image hash differs from manifest")
        manifests.append((manifest, image_path))

    parameters = controls["fitParameters"]
    cell = float(parameters["reviewCellMetres"])
    padding = float(parameters["featurePaddingMetres"])
    connection_radius = float(parameters["sourceConnectionRadiusMetres"])
    minimum_points = int(parameters["sourceMinimumComponentPoints"])
    perimeter_spacing = float(parameters["perimeterSampleSpacingMetres"])
    clip = float(parameters["edgeObjectiveClipMetres"])
    maximum_translation = float(parameters["maximumFeatureTranslationMetres"])
    maximum_rotation = math.radians(float(parameters["maximumFeatureRotationDegrees"]))
    dimension_adjustment = float(parameters.get("allowTargetRectangleDimensionAdjustmentMetres", 0.0))
    rng = np.random.default_rng(int(parameters["bootstrapSeed"]))
    args.output_dir.mkdir(parents=True, exist_ok=True)
    feature_results = []

    for feature_index, feature in enumerate(controls["features"]):
        center = np.asarray(feature["centerDeliveredUtmMetres"], dtype=np.float64)
        radius = float(feature["radiusMetres"])
        z_low, z_high = [float(value) for value in feature["plateauZBoundsMetres"]]
        mask = (
            (np.abs(lidar_x - center[0]) < radius)
            & (np.abs(lidar_y - center[1]) < radius)
            & (lidar_z >= z_low)
            & (lidar_z <= z_high)
        )
        plateau = largest_component(
            np.column_stack((lidar_x[mask], lidar_y[mask])),
            connection_radius,
            minimum_points,
        )
        source_corners = rectangle_from_points(plateau)
        source_perimeter = sample_perimeter(source_corners, perimeter_spacing)
        minimum = source_corners.min(axis=0) - padding
        maximum = source_corners.max(axis=0) + padding
        size = int(math.ceil(max(maximum - minimum) / cell))
        center_grid = (minimum + maximum) / 2.0
        minimum = center_grid - size * cell / 2.0
        orthophoto = sample_orthophoto(
            float(minimum[0]),
            float(minimum[1]),
            size,
            cell,
            to_state,
            correction_rotation,
            correction_translation,
            manifests,
        )
        gray = cv2.cvtColor(orthophoto, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, int(parameters["cannyLow"]), int(parameters["cannyHigh"]))
        distance = distance_transform_edt(edges == 0)

        def objective(values: np.ndarray) -> float:
            transformed_corners = adjusted_rectangle(
                source_corners,
                values[:2],
                float(values[2]),
                values[3:5],
            )
            transformed = sample_perimeter(transformed_corners, perimeter_spacing)
            distances = image_distance_values(
                transformed,
                distance,
                float(minimum[0]),
                float(minimum[1]),
                cell,
            )
            return float(np.mean(np.minimum(distances, clip)))

        bounds = [
            (-maximum_translation, maximum_translation),
            (-maximum_translation, maximum_translation),
            (-maximum_rotation, maximum_rotation),
            (-dimension_adjustment, dimension_adjustment),
            (-dimension_adjustment, dimension_adjustment),
        ]
        global_fit = differential_evolution(
            objective,
            bounds,
            seed=int(parameters["bootstrapSeed"]) + feature_index,
            workers=1,
            polish=False,
            updating="immediate",
            popsize=12,
            maxiter=120,
            tol=1e-8,
        )
        local_fit = minimize(
            objective,
            global_fit.x,
            method="L-BFGS-B",
            bounds=bounds,
            options={"maxiter": 800, "ftol": 1e-12, "gtol": 1e-9},
        )
        feature_transform = local_fit.x
        target_corners = adjusted_rectangle(
            source_corners,
            feature_transform[:2],
            float(feature_transform[2]),
            feature_transform[3:5],
        )
        target_perimeter = sample_perimeter(target_corners, perimeter_spacing)
        target_edge_distances = image_distance_values(
            target_perimeter,
            distance,
            float(minimum[0]),
            float(minimum[1]),
            cell,
        )
        bootstrap95, center_bootstrap95 = bootstrap_rectangle_uncertainty(
            plateau,
            source_corners,
            int(parameters["bootstrapSamples"]),
            rng,
        )

        review = orthophoto.copy()
        draw = ImageDraw.Draw(Image.fromarray(review))
        review_image = Image.fromarray(review)
        draw = ImageDraw.Draw(review_image)
        source_pixels = coordinates_to_image(source_corners, float(minimum[0]), float(minimum[1]), size, cell)
        target_pixels = coordinates_to_image(target_corners, float(minimum[0]), float(minimum[1]), size, cell)
        draw.line([tuple(value) for value in np.vstack((source_pixels, source_pixels[0]))], fill=(255, 30, 30), width=3)
        draw.line([tuple(value) for value in np.vstack((target_pixels, target_pixels[0]))], fill=(0, 255, 255), width=3)
        header = 62
        page = Image.new("RGB", (size, size + header), "white")
        page.paste(review_image, (0, header))
        page_draw = ImageDraw.Draw(page)
        page_draw.text((10, 8), f'{feature["featureId"]} ({feature["role"]})', fill="black")
        page_draw.text((10, 30), "red delivered LiDAR rectangle; cyan independently fitted orthophoto rectangle", fill=(65, 65, 65))
        output_path = args.output_dir / f'{feature["featureId"]}.png'
        page.save(output_path, format="PNG", optimize=True)

        feature_results.append({
            "featureId": feature["featureId"],
            "role": feature["role"],
            "semanticReview": feature["semanticReview"],
            "sourcePlateauPointCount": int(len(plateau)),
            "sourceRectangleCornersDeliveredUtmMetres": source_corners.tolist(),
            "sourceControlCenterDeliveredUtmMetres": source_corners.mean(axis=0).tolist(),
            "featureTransform": {
                "translationMetres": feature_transform[:2].tolist(),
                "cartesianCounterclockwiseDegrees": math.degrees(float(feature_transform[2])),
                "targetDimensionAdjustmentsMetres": feature_transform[3:5].tolist(),
            },
            "targetRectangleCornersReviewUtmMetres": target_corners.tolist(),
            "targetControlCenterReviewUtmMetres": target_corners.mean(axis=0).tolist(),
            "targetEdgeResidualMetres": {
                "median": float(np.median(target_edge_distances)),
                "p95": float(np.percentile(target_edge_distances, 95)),
                "maximum": float(target_edge_distances.max()),
            },
            "sourceBoundaryBootstrap95Metres": bootstrap95,
            "sourceControlCenterBootstrap95Metres": center_bootstrap95,
            "reviewPng": str(output_path),
            "reviewPngSha256": sha256_file(output_path),
        })

    training = [item for item in feature_results if item["role"] == "training"]
    holdouts = [item for item in feature_results if item["role"] == "holdout"]
    if len(training) < 3 or len(holdouts) < 3:
        raise ValueError("At least three locked training and three locked holdout features are required")
    representation = parameters.get("controlRepresentation", "rectangle-corners")
    if representation == "feature-centers":
        training_source = np.asarray([item["sourceControlCenterDeliveredUtmMetres"] for item in training])
        training_target = np.asarray([item["targetControlCenterReviewUtmMetres"] for item in training])
    elif representation == "rectangle-corners":
        training_source = np.vstack([item["sourceRectangleCornersDeliveredUtmMetres"] for item in training])
        training_target = np.vstack([item["targetRectangleCornersReviewUtmMetres"] for item in training])
    else:
        raise ValueError(f"Unsupported control representation: {representation}")
    translation, angle, rotation = fit_rigid(training_source, training_target)

    def evaluate(items: list[dict[str, Any]]) -> tuple[np.ndarray, list[dict[str, Any]]]:
        all_errors = []
        summaries = []
        for item in items:
            if representation == "feature-centers":
                source = np.asarray([item["sourceControlCenterDeliveredUtmMetres"]], dtype=np.float64)
                target = np.asarray([item["targetControlCenterReviewUtmMetres"]], dtype=np.float64)
            else:
                source = np.asarray(item["sourceRectangleCornersDeliveredUtmMetres"], dtype=np.float64)
                target = np.asarray(item["targetRectangleCornersReviewUtmMetres"], dtype=np.float64)
            prediction = source @ rotation.T + translation
            errors = np.linalg.norm(prediction - target, axis=1)
            all_errors.extend(errors.tolist())
            feature_angle = math.radians(item["featureTransform"]["cartesianCounterclockwiseDegrees"])
            angle_error = math.degrees(math.atan2(math.sin(angle - feature_angle), math.cos(angle - feature_angle)))
            summaries.append({
                "featureId": item["featureId"],
                "cornerErrorsMetres": errors.tolist(),
                "medianErrorMetres": float(np.median(errors)),
                "p95ErrorMetres": float(np.percentile(errors, 95)),
                "maximumErrorMetres": float(errors.max()),
                "orientationDifferenceDegrees": angle_error,
            })
        return np.asarray(all_errors), summaries

    train_errors, train_summaries = evaluate(training)
    holdout_errors, holdout_summaries = evaluate(holdouts)
    training_centers = np.asarray([
        np.mean(item["sourceRectangleCornersDeliveredUtmMetres"], axis=0)
        for item in training
    ])
    stadium_anchor = np.asarray(controls["stadiumAnchorDeliveredUtmMetres"], dtype=np.float64)
    stadium_inside_hull = bool(Delaunay(training_centers).find_simplex(stadium_anchor) >= 0)
    maximum_bootstrap = max(item["sourceBoundaryBootstrap95Metres"] for item in feature_results)
    maximum_center_bootstrap = max(item["sourceControlCenterBootstrap95Metres"] for item in feature_results)
    target_centering95_feet = float(parameters["nativeOrthophotoPixelFeet"]) / 2.0
    empirical_local95_metres = max(
        float(np.percentile(train_errors, 95)),
        float(np.percentile(holdout_errors, 95)),
        max(item["targetEdgeResidualMetres"]["p95"] for item in feature_results),
    )
    source_extraction95_metres = maximum_center_bootstrap if representation == "feature-centers" else maximum_bootstrap
    extraction95_feet = source_extraction95_metres * METRES_TO_FEET + target_centering95_feet
    local_registration95_feet = max(empirical_local95_metres * METRES_TO_FEET, extraction95_feet)
    orthophoto_absolute95_feet = float(audit["uncertainty"]["combinedAbsoluteHorizontalUncertainty95Feet"])
    combined_horizontal95_feet = orthophoto_absolute95_feet + local_registration95_feet
    if representation == "feature-centers":
        holdout_source_centers = np.asarray([
            item["sourceControlCenterDeliveredUtmMetres"] for item in holdouts
        ])
        holdout_target_centers = np.asarray([
            item["targetControlCenterReviewUtmMetres"] for item in holdouts
        ])
        _, holdout_angle, _ = fit_rigid(holdout_source_centers, holdout_target_centers)
        local_orientation95 = abs(math.degrees(math.atan2(
            math.sin(angle - holdout_angle),
            math.cos(angle - holdout_angle),
        )))
    else:
        holdout_orientation_differences = np.abs([
            item["orientationDifferenceDegrees"] for item in holdout_summaries
        ])
        local_orientation95 = float(np.percentile(holdout_orientation_differences, 95))
    combined_orientation95 = local_orientation95 + float(audit["uncertainty"]["monteCarlo"]["orientationUncertainty95Degrees"])
    blockers = []
    if not stadium_inside_hull:
        blockers.append("STADIUM_OUTSIDE_TRAINING_CONTROL_HULL")
    if combined_horizontal95_feet > float(parameters["maximumCombinedHorizontalUncertainty95Feet"]):
        blockers.append("COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if combined_orientation95 > float(parameters["maximumOrientationUncertainty95Degrees"]):
        blockers.append("COMBINED_ORIENTATION_UNCERTAINTY_EXCEEDS_ONE_DEGREE")

    stable = {
        "controls": {
            "path": str(args.controls),
            "sha256": hashlib.sha256(control_bytes).hexdigest(),
        },
        "orthophotoAuditArtifactVersion": audit["artifactVersion"],
        "features": feature_results,
        "globalRigidFit": {
            "translationMetres": translation.tolist(),
            "rotationMatrix": rotation.tolist(),
            "cartesianCounterclockwiseDegrees": math.degrees(angle),
            "training": {
                "cornerCount": int(len(train_errors)),
                "medianErrorMetres": float(np.median(train_errors)),
                "p95ErrorMetres": float(np.percentile(train_errors, 95)),
                "maximumErrorMetres": float(train_errors.max()),
                "byFeature": train_summaries,
            },
            "holdout": {
                "featureCount": len(holdouts),
                "cornerCount": int(len(holdout_errors)),
                "medianErrorMetres": float(np.median(holdout_errors)),
                "p95ErrorMetres": float(np.percentile(holdout_errors, 95)),
                "maximumErrorMetres": float(holdout_errors.max()),
                "byFeature": holdout_summaries,
            },
            "stadiumInsideTrainingFeatureHull": stadium_inside_hull,
        },
        "uncertainty": {
            "maximumSourceBoundaryBootstrap95Metres": maximum_bootstrap,
            "maximumSourceControlCenterBootstrap95Metres": maximum_center_bootstrap,
            "controlRepresentation": representation,
            "targetEdgeCentering95Feet": target_centering95_feet,
            "empiricalLocalRegistration95Metres": empirical_local95_metres,
            "localRegistrationUncertainty95Feet": local_registration95_feet,
            "orthophotoAbsoluteHorizontalUncertainty95Feet": orthophoto_absolute95_feet,
            "combinedAbsoluteHorizontalUncertainty95Feet": combined_horizontal95_feet,
            "localOrientationUncertainty95Degrees": local_orientation95,
            "combinedOrientationUncertainty95Degrees": combined_orientation95,
            "combinationMethod": "Conservative linear sum of the accepted absolute orthophoto uncertainty and the larger of empirical local error or source-plus-target extraction uncertainty.",
        },
        "registrationAcceptance": {
            "accepted": len(blockers) == 0,
            "blockers": blockers,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-hard-structure-local-registration-audit",
        "artifactStage": "accepted" if not blockers else "rejected",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesLidarToCorrectedOrthophotoRegistration": len(blockers) == 0,
            "establishesMeasuredRowElevations": False,
            "establishesCurrentObstructionGeometry": False,
            "establishesIndependentShadowValidation": False,
        },
        "publication": {
            "eligibleForExactRowShade": False,
            "blockers": [
                "REGISTRATION_ARTIFACT_ONLY",
                "MEASURED_ROW_ELEVATIONS_NOT_ESTABLISHED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_VALIDATION_NOT_ESTABLISHED",
            ] + blockers,
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "accepted": artifact["registrationAcceptance"]["accepted"],
        "combinedHorizontal95Feet": combined_horizontal95_feet,
        "holdoutP95Metres": float(np.percentile(holdout_errors, 95)),
        "blockers": blockers,
    }, indent=2))


if __name__ == "__main__":
    main()
