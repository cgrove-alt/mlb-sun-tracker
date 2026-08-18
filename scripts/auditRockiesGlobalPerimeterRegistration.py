#!/usr/bin/env python3
"""Fit one Coors LiDAR transform, then score untouched roof perimeters."""

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
from scipy.ndimage import distance_transform_edt
from scipy.optimize import differential_evolution, minimize

from auditRockiesHardStructureLocalRegistration import (
    METRES_TO_FEET,
    apply_transform,
    artifact_version,
    bootstrap_rectangle_uncertainty,
    coordinates_to_image,
    image_distance_values,
    largest_component,
    rectangle_from_points,
    sample_orthophoto,
    sample_perimeter,
    sha256_file,
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
    if controls.get("artifactKind") != "rockies-global-perimeter-registration-controls":
        raise ValueError("Unexpected controls kind")
    if controls.get("lockedBeforeFit") is not True:
        raise ValueError("Training and holdout roles were not locked")
    for key in [
        "featureReviewPath",
        "featureReviewControlsPath",
        "helperScriptPath",
        "lidarPath",
        "orthophotoAuditPath",
    ]:
        path = Path(controls["inputs"][key])
        if sha256_file(path) != controls["inputs"][key.replace("Path", "Sha256")]:
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
    correction = audit["rigidCorrection"]
    correction_rotation = np.asarray(correction["rotationMatrix"], dtype=np.float64)
    correction_translation = np.asarray(correction["translationFeet"], dtype=np.float64)
    manifests = []
    for item in controls["inputs"]["orthophotoManifests"]:
        manifest_path = Path(item["path"])
        if sha256_file(manifest_path) != item["sha256"]:
            raise ValueError("Orthophoto manifest hash differs from controls")
        manifest = json.loads(manifest_path.read_bytes())
        image_path = Path(manifest["localFiles"]["orthophoto"])
        if sha256_file(image_path) != manifest["orthophoto"]["sha256"]:
            raise ValueError("Orthophoto image hash differs from manifest")
        manifests.append((manifest, image_path))

    parameters = controls["parameters"]
    cell = float(parameters["reviewCellMetres"])
    padding = float(parameters["featurePaddingMetres"])
    spacing = float(parameters["perimeterSampleSpacingMetres"])
    rng = np.random.default_rng(int(parameters["bootstrapSeed"]))
    prepared = []
    for feature in controls["features"]:
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
            float(parameters["sourceConnectionRadiusMetres"]),
            int(parameters["sourceMinimumComponentPoints"]),
        )
        corners = rectangle_from_points(plateau)
        perimeter = sample_perimeter(corners, spacing)
        minimum = corners.min(axis=0) - padding - float(parameters["maximumGlobalTranslationMetres"])
        maximum = corners.max(axis=0) + padding + float(parameters["maximumGlobalTranslationMetres"])
        size = int(math.ceil(max(maximum - minimum) / cell))
        grid_center = (minimum + maximum) / 2.0
        minimum = grid_center - size * cell / 2.0
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
        boundary_bootstrap95, center_bootstrap95 = bootstrap_rectangle_uncertainty(
            plateau,
            corners,
            int(parameters["bootstrapSamples"]),
            rng,
        )
        prepared.append({
            "control": feature,
            "plateauCount": int(len(plateau)),
            "corners": corners,
            "perimeter": perimeter,
            "minimum": minimum,
            "size": size,
            "orthophoto": orthophoto,
            "distance": distance,
            "boundaryBootstrap95Metres": boundary_bootstrap95,
            "centerBootstrap95Metres": center_bootstrap95,
        })

    training = [item for item in prepared if item["control"]["role"] == "training"]
    holdouts = [item for item in prepared if item["control"]["role"] == "holdout"]
    if len(training) < 3 or len(holdouts) < 3:
        raise ValueError("At least three training and three holdout roofs are required")
    anchor = np.asarray(controls["stadiumAnchorDeliveredUtmMetres"], dtype=np.float64)
    clip = float(parameters["edgeObjectiveClipMetres"])

    def transform_perimeter(item: dict[str, Any], values: np.ndarray) -> np.ndarray:
        return apply_transform(item["perimeter"], values[:2], float(values[2]), anchor)

    def distances_for(item: dict[str, Any], values: np.ndarray) -> np.ndarray:
        return image_distance_values(
            transform_perimeter(item, values),
            item["distance"],
            float(item["minimum"][0]),
            float(item["minimum"][1]),
            cell,
        )

    def objective(values: np.ndarray) -> float:
        distances = np.concatenate([distances_for(item, values) for item in training])
        return float(np.mean(np.minimum(distances, clip)))

    maximum_translation = float(parameters["maximumGlobalTranslationMetres"])
    maximum_rotation = math.radians(float(parameters["maximumGlobalRotationDegrees"]))
    bounds = [
        (-maximum_translation, maximum_translation),
        (-maximum_translation, maximum_translation),
        (-maximum_rotation, maximum_rotation),
    ]
    broad = differential_evolution(
        objective,
        bounds,
        seed=int(parameters["bootstrapSeed"]),
        workers=1,
        polish=False,
        popsize=16,
        maxiter=180,
        tol=1e-9,
    )
    fit = minimize(
        objective,
        broad.x,
        method="L-BFGS-B",
        bounds=bounds,
        options={"maxiter": 1000, "ftol": 1e-13, "gtol": 1e-10},
    )
    values = fit.x
    args.output_dir.mkdir(parents=True, exist_ok=True)
    feature_results = []
    for item in prepared:
        distances = distances_for(item, values)
        transformed_corners = apply_transform(item["corners"], values[:2], float(values[2]), anchor)
        image = Image.fromarray(item["orthophoto"])
        draw = ImageDraw.Draw(image)
        source_pixels = coordinates_to_image(
            item["corners"],
            float(item["minimum"][0]),
            float(item["minimum"][1]),
            item["size"],
            cell,
        )
        transformed_pixels = coordinates_to_image(
            transformed_corners,
            float(item["minimum"][0]),
            float(item["minimum"][1]),
            item["size"],
            cell,
        )
        draw.line([tuple(value) for value in np.vstack((source_pixels, source_pixels[0]))], fill=(255, 30, 30), width=3)
        draw.line([tuple(value) for value in np.vstack((transformed_pixels, transformed_pixels[0]))], fill=(0, 255, 255), width=3)
        header = 62
        page = Image.new("RGB", (item["size"], item["size"] + header), "white")
        page.paste(image, (0, header))
        page_draw = ImageDraw.Draw(page)
        feature = item["control"]
        page_draw.text((10, 8), f'{feature["featureId"]} ({feature["role"]})', fill="black")
        page_draw.text((10, 30), "red delivered LiDAR; cyan one global training transform", fill=(65, 65, 65))
        output_path = args.output_dir / f'{feature["featureId"]}.png'
        page.save(output_path, format="PNG", optimize=True)
        feature_results.append({
            "featureId": feature["featureId"],
            "role": feature["role"],
            "semanticReview": feature["semanticReview"],
            "sourcePlateauPointCount": item["plateauCount"],
            "sourceBoundaryBootstrap95Metres": item["boundaryBootstrap95Metres"],
            "sourceCenterBootstrap95Metres": item["centerBootstrap95Metres"],
            "edgeResidualMetres": {
                "median": float(np.median(distances)),
                "p95": float(np.percentile(distances, 95)),
                "maximum": float(distances.max()),
            },
            "reviewPng": str(output_path),
            "reviewPngSha256": sha256_file(output_path),
        })

    train_distances = np.concatenate([distances_for(item, values) for item in training])
    holdout_distances = np.concatenate([distances_for(item, values) for item in holdouts])
    maximum_boundary_bootstrap = max(item["boundaryBootstrap95Metres"] for item in prepared)
    empirical95_metres = max(
        float(np.percentile(train_distances, 95)),
        float(np.percentile(holdout_distances, 95)),
    )
    target_centering95_feet = float(parameters["nativeOrthophotoPixelFeet"]) / 2.0
    local95_feet = max(empirical95_metres, maximum_boundary_bootstrap) * METRES_TO_FEET + target_centering95_feet
    orthophoto95_feet = float(audit["uncertainty"]["combinedAbsoluteHorizontalUncertainty95Feet"])
    combined95_feet = orthophoto95_feet + local95_feet
    combined_orientation95 = abs(math.degrees(float(values[2]))) + float(
        audit["uncertainty"]["monteCarlo"]["orientationUncertainty95Degrees"]
    )
    blockers = []
    if combined95_feet > float(parameters["maximumCombinedHorizontalUncertainty95Feet"]):
        blockers.append("COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT")
    if combined_orientation95 > float(parameters["maximumOrientationUncertainty95Degrees"]):
        blockers.append("COMBINED_ORIENTATION_UNCERTAINTY_EXCEEDS_ONE_DEGREE")
    stable = {
        "controls": {
            "path": str(args.controls),
            "sha256": hashlib.sha256(control_bytes).hexdigest(),
        },
        "features": feature_results,
        "globalRigidTransform": {
            "translationMetresAtStadiumAnchor": values[:2].tolist(),
            "cartesianCounterclockwiseDegrees": math.degrees(float(values[2])),
            "trainingObjectiveMetres": float(objective(values)),
        },
        "validation": {
            "training": {
                "perimeterSampleCount": int(len(train_distances)),
                "medianEdgeResidualMetres": float(np.median(train_distances)),
                "p95EdgeResidualMetres": float(np.percentile(train_distances, 95)),
                "maximumEdgeResidualMetres": float(train_distances.max()),
            },
            "holdout": {
                "featureCount": len(holdouts),
                "perimeterSampleCount": int(len(holdout_distances)),
                "medianEdgeResidualMetres": float(np.median(holdout_distances)),
                "p95EdgeResidualMetres": float(np.percentile(holdout_distances, 95)),
                "maximumEdgeResidualMetres": float(holdout_distances.max()),
                "featureSpecificRefits": 0,
            },
        },
        "uncertainty": {
            "maximumSourceBoundaryBootstrap95Metres": maximum_boundary_bootstrap,
            "empiricalPerimeterResidual95Metres": empirical95_metres,
            "targetEdgeCentering95Feet": target_centering95_feet,
            "localRegistrationUncertainty95Feet": local95_feet,
            "orthophotoAbsoluteHorizontalUncertainty95Feet": orthophoto95_feet,
            "combinedAbsoluteHorizontalUncertainty95Feet": combined95_feet,
            "combinedOrientationUncertainty95Degrees": combined_orientation95,
            "combinationMethod": "Linear sum of accepted orthophoto uncertainty, the larger of empirical perimeter residual or source boundary bootstrap, and target half-pixel centering.",
        },
        "registrationAcceptance": {
            "accepted": len(blockers) == 0,
            "blockers": blockers,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-global-perimeter-registration-audit",
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
        "transform": artifact["globalRigidTransform"],
        "holdoutP95Metres": artifact["validation"]["holdout"]["p95EdgeResidualMetres"],
        "combinedHorizontal95Feet": combined95_feet,
        "blockers": blockers,
    }, indent=2))


if __name__ == "__main__":
    main()
