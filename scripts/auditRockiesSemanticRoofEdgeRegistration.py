#!/usr/bin/env python3
"""Audit Coors LiDAR registration from manually locked semantic roof edges.

Each feature defines two adjacent edges of one fixed roof surface in the raw
LiDAR plateau and the corrected orthophoto. Training corners fit one global
rigid transform. Holdout corners receive no feature-specific adjustment.
"""

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


FEET_PER_METRE = 3.280839895013123


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(payload).hexdigest()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--controls", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    return parser.parse_args()


def segment_coordinates(points: np.ndarray, start: np.ndarray, end: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    direction = end - start
    length = float(np.linalg.norm(direction))
    if length <= 0.0:
        raise ValueError("Line corridor endpoints must differ")
    direction /= length
    normal = np.array([-direction[1], direction[0]], dtype=np.float64)
    relative = points - start
    return relative @ direction, relative @ normal


def robust_line(points: np.ndarray, tolerance: float, minimum_points: int) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    if len(points) < minimum_points:
        raise ValueError(f"Line fit has {len(points)} points, requires {minimum_points}")
    inliers = np.ones(len(points), dtype=bool)
    for _ in range(8):
        selected = points[inliers]
        center = selected.mean(axis=0)
        _, _, vectors = np.linalg.svd(selected - center, full_matrices=False)
        direction = vectors[0]
        normal = np.array([-direction[1], direction[0]], dtype=np.float64)
        residual = np.abs((points - center) @ normal)
        updated = residual <= tolerance
        if updated.sum() < minimum_points:
            order = np.argsort(residual)
            updated = np.zeros(len(points), dtype=bool)
            updated[order[:minimum_points]] = True
        if np.array_equal(updated, inliers):
            break
        inliers = updated
    selected = points[inliers]
    center = selected.mean(axis=0)
    _, _, vectors = np.linalg.svd(selected - center, full_matrices=False)
    direction = vectors[0]
    return center, direction / np.linalg.norm(direction), selected


def source_boundary_line(
    points: np.ndarray,
    corridor: dict[str, Any],
    parameters: dict[str, Any],
) -> tuple[np.ndarray, np.ndarray, np.ndarray, dict[str, Any]]:
    start = np.asarray(corridor["startPixels"], dtype=np.float64)
    end = np.asarray(corridor["endPixels"], dtype=np.float64)
    along, signed = segment_coordinates(points, start, end)
    length = float(np.linalg.norm(end - start))
    half_width = float(corridor["halfWidthPixels"])
    selected = (along >= 0.0) & (along <= length) & (np.abs(signed) <= half_width)
    candidates = points[selected]
    candidate_along = along[selected]
    candidate_signed = signed[selected]
    minimum_points = int(parameters["minimumSourceCorridorPoints"])
    if len(candidates) < minimum_points:
        raise ValueError(f"Source corridor has {len(candidates)} points, requires {minimum_points}")

    bin_width = float(parameters["sourceBoundaryBinWidthPixels"])
    quantile = float(corridor["boundaryQuantile"])
    boundary = []
    for lower in np.arange(0.0, length, bin_width):
        in_bin = (candidate_along >= lower) & (candidate_along < min(length, lower + bin_width))
        if in_bin.sum() < int(parameters["minimumSourcePointsPerBin"]):
            continue
        bin_signed = candidate_signed[in_bin]
        target_signed = float(np.quantile(bin_signed, quantile))
        bin_center = float(np.median(candidate_along[in_bin]))
        rough_direction = (end - start) / length
        rough_normal = np.array([-rough_direction[1], rough_direction[0]], dtype=np.float64)
        boundary.append(start + bin_center * rough_direction + target_signed * rough_normal)
    boundary_points = np.asarray(boundary, dtype=np.float64)
    center, direction, inliers = robust_line(
        boundary_points,
        float(parameters["sourceLineInlierTolerancePixels"]),
        int(parameters["minimumSourceBoundaryBins"]),
    )
    rough_direction = end - start
    if float(direction @ rough_direction) < 0.0:
        direction *= -1.0
    residual = np.abs((inliers - center) @ np.array([-direction[1], direction[0]]))
    return center, direction, inliers, {
        "corridorPointCount": int(len(candidates)),
        "boundaryBinCount": int(len(boundary_points)),
        "fitInlierCount": int(len(inliers)),
        "fitResidualP95Pixels": float(np.percentile(residual, 95)),
    }


def target_image_line(
    image: np.ndarray,
    corridor: dict[str, Any],
    parameters: dict[str, Any],
) -> tuple[np.ndarray, np.ndarray, np.ndarray, dict[str, Any]]:
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, int(parameters["cannyLow"]), int(parameters["cannyHigh"]))
    rows, columns = np.nonzero(edges)
    points = np.column_stack((columns, rows)).astype(np.float64)
    start = np.asarray(corridor["startPixels"], dtype=np.float64)
    end = np.asarray(corridor["endPixels"], dtype=np.float64)
    along, signed = segment_coordinates(points, start, end)
    length = float(np.linalg.norm(end - start))
    signed_min, signed_max = [float(value) for value in corridor["signedNormalRangePixels"]]
    selected = (
        (along >= 0.0)
        & (along <= length)
        & (signed >= signed_min)
        & (signed <= signed_max)
    )
    candidates = points[selected]
    center, direction, inliers = robust_line(
        candidates,
        float(parameters["targetLineInlierTolerancePixels"]),
        int(parameters["minimumTargetEdgePixels"]),
    )
    rough_direction = end - start
    if float(direction @ rough_direction) < 0.0:
        direction *= -1.0
    residual = np.abs((inliers - center) @ np.array([-direction[1], direction[0]]))
    return center, direction, inliers, {
        "candidateEdgePixelCount": int(len(candidates)),
        "fitInlierCount": int(len(inliers)),
        "fitResidualP95Pixels": float(np.percentile(residual, 95)),
    }


def pixel_to_utm(points: np.ndarray, feature: dict[str, Any], size: int) -> np.ndarray:
    center_x, center_y = [float(value) for value in feature["centerDeliveredUtmMetres"]]
    cell = float(feature["reviewCellMetres"])
    minimum_x = center_x - size * cell / 2.0
    minimum_y = center_y - size * cell / 2.0
    output = np.empty_like(points, dtype=np.float64)
    output[:, 0] = minimum_x + (points[:, 0] + 0.5) * cell
    output[:, 1] = minimum_y + (size - points[:, 1] - 0.5) * cell
    return output


def utm_to_pixel(points: np.ndarray, feature: dict[str, Any], size: int) -> np.ndarray:
    center_x, center_y = [float(value) for value in feature["centerDeliveredUtmMetres"]]
    cell = float(feature["reviewCellMetres"])
    minimum_x = center_x - size * cell / 2.0
    minimum_y = center_y - size * cell / 2.0
    output = np.empty_like(points, dtype=np.float64)
    output[:, 0] = (points[:, 0] - minimum_x) / cell - 0.5
    output[:, 1] = size - (points[:, 1] - minimum_y) / cell - 0.5
    return output


def line_to_utm(center: np.ndarray, direction: np.ndarray, feature: dict[str, Any], size: int) -> tuple[np.ndarray, np.ndarray]:
    values = pixel_to_utm(np.vstack((center, center + direction)), feature, size)
    utm_direction = values[1] - values[0]
    return values[0], utm_direction / np.linalg.norm(utm_direction)


def line_intersection(first: tuple[np.ndarray, np.ndarray], second: tuple[np.ndarray, np.ndarray]) -> np.ndarray:
    first_point, first_direction = first
    second_point, second_direction = second
    matrix = np.column_stack((first_direction, -second_direction))
    determinant = float(np.linalg.det(matrix))
    if abs(determinant) < 0.2:
        raise ValueError("Semantic roof edges do not form a stable corner")
    parameters = np.linalg.solve(matrix, second_point - first_point)
    return first_point + parameters[0] * first_direction


def fit_rigid(source: np.ndarray, target: np.ndarray) -> tuple[np.ndarray, np.ndarray, float]:
    source_center = source.mean(axis=0)
    target_center = target.mean(axis=0)
    covariance = (source - source_center).T @ (target - target_center)
    left, _, right = np.linalg.svd(covariance)
    rotation = right.T @ left.T
    if np.linalg.det(rotation) < 0.0:
        right[-1, :] *= -1.0
        rotation = right.T @ left.T
    translation = target_center - source_center @ rotation.T
    angle = math.atan2(rotation[1, 0], rotation[0, 0])
    return rotation, translation, angle


def apply_rigid(points: np.ndarray, rotation: np.ndarray, translation: np.ndarray) -> np.ndarray:
    return points @ rotation.T + translation


def undirected_angle_degrees(first: np.ndarray, second: np.ndarray) -> float:
    cosine = abs(float(first @ second) / float(np.linalg.norm(first) * np.linalg.norm(second)))
    return math.degrees(math.acos(float(np.clip(cosine, -1.0, 1.0))))


def draw_extended_line(draw: ImageDraw.ImageDraw, center: np.ndarray, direction: np.ndarray, colour: tuple[int, int, int], width: int = 3) -> None:
    start = center - direction * 1000.0
    end = center + direction * 1000.0
    draw.line((float(start[0]), float(start[1]), float(end[0]), float(end[1])), fill=colour, width=width)


def main() -> None:
    args = parse_args()
    control_bytes = args.controls.read_bytes()
    controls = json.loads(control_bytes)
    if controls.get("artifactKind") != "rockies-semantic-roof-edge-registration-controls":
        raise ValueError("Unexpected controls artifact kind")
    if not controls.get("lockedBeforeFit"):
        raise ValueError("Controls were not locked before fitting")

    inputs = controls["inputs"]
    for path_key, hash_key in [
        ("featureReviewPath", "featureReviewSha256"),
        ("featureReviewControlsPath", "featureReviewControlsSha256"),
        ("lidarPath", "lidarSha256"),
        ("orthophotoAuditPath", "orthophotoAuditSha256"),
        ("auditScriptPath", "auditScriptSha256"),
    ]:
        if path_key not in inputs and hash_key not in inputs:
            continue
        path = Path(inputs[path_key])
        if sha256_file(path) != inputs[hash_key]:
            raise ValueError(f"Input hash differs for {path}")

    review = json.loads(Path(inputs["featureReviewPath"]).read_bytes())
    review_controls = json.loads(Path(inputs["featureReviewControlsPath"]).read_bytes())
    orthophoto_audit = json.loads(Path(inputs["orthophotoAuditPath"]).read_bytes())
    if not orthophoto_audit.get("registrationAcceptance", {}).get("accepted"):
        raise ValueError("Corrected orthophoto frame is not accepted")

    feature_lookup = {feature["featureId"]: feature for feature in review_controls["features"]}
    review_lookup = {item["featureId"]: item for item in review["featureOutputs"]}
    requested_ids = {feature["featureId"] for feature in controls["features"]}
    if requested_ids - feature_lookup.keys() or requested_ids - review_lookup.keys():
        raise ValueError("A semantic edge feature is absent from the bound review artifacts")

    with laspy.open(Path(inputs["lidarPath"])) as source:
        lidar = source.read()
    raw_x = np.asarray(lidar.x)
    raw_y = np.asarray(lidar.y)
    raw_z = np.asarray(lidar.z)

    parameters = controls["parameters"]
    feature_results = []
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for control_feature in controls["features"]:
        feature_id = control_feature["featureId"]
        source_feature = feature_lookup[feature_id]
        review_record = review_lookup[feature_id]
        page_path = Path(review_record["outputPath"])
        if sha256_file(page_path) != review_record["outputSha256"]:
            raise ValueError(f"Review image hash differs for {feature_id}")
        with Image.open(page_path) as source:
            page = source.convert("RGB")
        size = page.width // 5
        header = page.height - size
        target_image = np.asarray(page.crop((size * 3, header, size * 4, header + size)))

        center_x, center_y = [float(value) for value in source_feature["centerDeliveredUtmMetres"]]
        radius = float(source_feature["radiusMetres"])
        z_low, z_high = [float(value) for value in source_feature["plateauZBoundsMetres"]]
        local = (
            (raw_x >= center_x - radius)
            & (raw_x < center_x + radius)
            & (raw_y >= center_y - radius)
            & (raw_y < center_y + radius)
            & (raw_z >= z_low)
            & (raw_z <= z_high)
        )
        raw_utm = np.column_stack((raw_x[local], raw_y[local]))
        source_pixels = utm_to_pixel(raw_utm, source_feature, size)

        source_lines = []
        target_lines = []
        line_results = []
        for edge in control_feature["edges"]:
            try:
                source_center, source_direction, source_inliers, source_summary = source_boundary_line(
                    source_pixels, edge["sourceCorridor"], parameters
                )
                target_center, target_direction, target_inliers, target_summary = target_image_line(
                    target_image, edge["targetCorridor"], parameters
                )
            except ValueError as error:
                raise ValueError(f"{feature_id} {edge['edgeId']}: {error}") from error
            source_lines.append(line_to_utm(source_center, source_direction, source_feature, size))
            target_lines.append(line_to_utm(target_center, target_direction, source_feature, size))
            line_results.append({
                "edgeId": edge["edgeId"],
                "semanticEdge": edge["semanticEdge"],
                "sourceFitReviewPixels": {
                    "center": source_center.tolist(),
                    "direction": source_direction.tolist(),
                    "inlierExtent": [source_inliers.min(axis=0).tolist(), source_inliers.max(axis=0).tolist()],
                    **source_summary,
                },
                "targetFitReviewPixels": {
                    "center": target_center.tolist(),
                    "direction": target_direction.tolist(),
                    "inlierExtent": [target_inliers.min(axis=0).tolist(), target_inliers.max(axis=0).tolist()],
                    **target_summary,
                },
            })

        if len(source_lines) != 2 or len(target_lines) != 2:
            raise ValueError(f"Feature {feature_id} must define exactly two adjacent edges")
        source_corner = line_intersection(source_lines[0], source_lines[1])
        target_corner = line_intersection(target_lines[0], target_lines[1])
        feature_results.append({
            "featureId": feature_id,
            "role": control_feature["role"],
            "semanticCorner": control_feature["semanticCorner"],
            "panelSizePixels": size,
            "sourceCornerDeliveredUtmMetres": source_corner.tolist(),
            "targetCornerCorrectedUtmMetres": target_corner.tolist(),
            "sourceLines": source_lines,
            "targetLines": target_lines,
            "lineResults": line_results,
            "targetImage": target_image,
            "sourceFeature": source_feature,
        })

    training = [item for item in feature_results if item["role"] == "training"]
    holdout = [item for item in feature_results if item["role"] == "holdout"]
    if len(training) < 3 or len(holdout) < 3:
        raise ValueError("At least three training and three holdout features are required")
    if {item["featureId"] for item in training} & {item["featureId"] for item in holdout}:
        raise ValueError("Training and holdout feature sets overlap")

    training_source = np.asarray([item["sourceCornerDeliveredUtmMetres"] for item in training])
    training_target = np.asarray([item["targetCornerCorrectedUtmMetres"] for item in training])
    rotation, translation, angle = fit_rigid(training_source, training_target)
    stadium_anchor = np.asarray(controls["stadiumAnchorDeliveredUtmMetres"], dtype=np.float64)
    transformed_anchor = apply_rigid(stadium_anchor[None, :], rotation, translation)[0]
    anchor_vector = transformed_anchor - stadium_anchor

    all_errors = []
    holdout_errors = []
    holdout_angles = []
    rendered = []
    for item in feature_results:
        source_corner = np.asarray(item["sourceCornerDeliveredUtmMetres"], dtype=np.float64)
        target_corner = np.asarray(item["targetCornerCorrectedUtmMetres"], dtype=np.float64)
        transformed_corner = apply_rigid(source_corner[None, :], rotation, translation)[0]
        error = float(np.linalg.norm(transformed_corner - target_corner))
        all_errors.append(error)
        if item["role"] == "holdout":
            holdout_errors.append(error)

        line_angle_errors = []
        for source_line, target_line in zip(item["sourceLines"], item["targetLines"]):
            transformed_direction = rotation @ source_line[1]
            difference = undirected_angle_degrees(transformed_direction, target_line[1])
            line_angle_errors.append(difference)
            if item["role"] == "holdout":
                holdout_angles.append(difference)

        feature = item["sourceFeature"]
        size = item["panelSizePixels"]
        diagnostic = Image.fromarray(item["targetImage"]).convert("RGB")
        draw = ImageDraw.Draw(diagnostic)
        for source_line in item["sourceLines"]:
            source_samples = source_line[0][None, :] + np.asarray([-20.0, 20.0])[:, None] * source_line[1][None, :]
            transformed = apply_rigid(source_samples, rotation, translation)
            pixels = utm_to_pixel(transformed, feature, size)
            draw_extended_line(draw, pixels.mean(axis=0), pixels[1] - pixels[0], (255, 25, 25))
        for target_line in item["targetLines"]:
            target_samples = target_line[0][None, :] + np.asarray([-20.0, 20.0])[:, None] * target_line[1][None, :]
            pixels = utm_to_pixel(target_samples, feature, size)
            draw_extended_line(draw, pixels.mean(axis=0), pixels[1] - pixels[0], (0, 255, 255))
        corner_pixels = utm_to_pixel(np.vstack((transformed_corner, target_corner)), feature, size)
        for point, colour in zip(corner_pixels, [(255, 25, 25), (0, 255, 255)]):
            x, y = [float(value) for value in point]
            draw.ellipse((x - 6, y - 6, x + 6, y + 6), outline=colour, width=3)
        output_path = args.output_dir / f"{item['featureId']}.png"
        diagnostic.save(output_path, format="PNG", optimize=True)
        rendered.append({
            "featureId": item["featureId"],
            "path": str(output_path),
            "sha256": sha256_file(output_path),
        })
        item["transformedSourceCornerUtmMetres"] = transformed_corner.tolist()
        item["cornerErrorMetres"] = error
        item["lineOrientationErrorsDegrees"] = line_angle_errors

    holdout_values = np.asarray(holdout_errors, dtype=np.float64)
    holdout_angle_values = np.asarray(holdout_angles, dtype=np.float64)
    holdout_p95 = float(np.percentile(holdout_values, 95))
    orthophoto_horizontal95 = float(
        orthophoto_audit["uncertainty"]["combinedAbsoluteHorizontalUncertainty95Feet"]
    )
    combined_horizontal95 = orthophoto_horizontal95 + holdout_p95 * FEET_PER_METRE
    orthophoto_orientation95 = float(
        orthophoto_audit["uncertainty"]["monteCarlo"]["orientationUncertainty95Degrees"]
    )
    local_orientation95 = float(np.percentile(holdout_angle_values, 95))
    combined_orientation95 = orthophoto_orientation95 + local_orientation95
    diagnostic_only = bool(controls.get("diagnosticOnly", True))
    numerical_gates_pass = bool(
        combined_horizontal95 <= float(parameters["maximumCombinedHorizontalUncertainty95Feet"])
        and combined_orientation95 <= float(parameters["maximumCombinedOrientationUncertainty95Degrees"])
    )

    stable_results = []
    for item in feature_results:
        stable_results.append({key: value for key, value in item.items() if key not in {
            "sourceLines", "targetLines", "targetImage", "sourceFeature"
        }})
    stable = {
        "controls": {
            "path": str(args.controls),
            "sha256": hashlib.sha256(control_bytes).hexdigest(),
        },
        "fit": {
            "trainingFeatureIds": [item["featureId"] for item in training],
            "holdoutFeatureIds": [item["featureId"] for item in holdout],
            "cartesianCounterclockwiseDegrees": math.degrees(angle),
            "rotationMatrix": rotation.tolist(),
            "translationAtStadiumAnchorMetres": anchor_vector.tolist(),
        },
        "features": stable_results,
        "diagnostics": rendered,
        "holdout": {
            "featureCount": len(holdout),
            "cornerErrorMetres": {
                "median": float(np.median(holdout_values)),
                "p95": holdout_p95,
                "maximum": float(np.max(holdout_values)),
            },
            "lineOrientationErrorDegrees": {
                "median": float(np.median(holdout_angle_values)),
                "p95": local_orientation95,
                "maximum": float(np.max(holdout_angle_values)),
            },
        },
        "uncertainty": {
            "correctedOrthophotoAbsoluteHorizontal95Feet": orthophoto_horizontal95,
            "localRegistrationHoldoutP95Feet": holdout_p95 * FEET_PER_METRE,
            "combinedAbsoluteHorizontal95Feet": combined_horizontal95,
            "combinationMethod": "conservative linear sum",
            "correctedOrthophotoOrientation95Degrees": orthophoto_orientation95,
            "localHoldoutOrientation95Degrees": local_orientation95,
            "combinedOrientation95Degrees": combined_orientation95,
        },
        "numericalGatesPass": numerical_gates_pass,
        "diagnosticOnly": diagnostic_only,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-semantic-roof-edge-registration-audit",
        "artifactStage": "diagnostic-method-development" if diagnostic_only else "locked-registration-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
        "registrationAcceptance": {
            "accepted": bool(numerical_gates_pass and not diagnostic_only),
            "blockers": [
                *([] if numerical_gates_pass else ["SEMANTIC_EDGE_REGISTRATION_NUMERICAL_GATE_FAILED"]),
                *([] if not diagnostic_only else ["METHOD_DEVELOPMENT_CONTROLS_REUSE_PRIORLY_REVIEWED_FEATURES"]),
            ],
        },
        "geometryBoundary": {
            "establishesMeasuredRowElevations": False,
            "establishesOverhangUndersides": False,
            "establishesCurrentObstructionCompleteness": False,
            "establishesShadowAccuracy": False,
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "numericalGatesPass": numerical_gates_pass,
        "accepted": artifact["registrationAcceptance"]["accepted"],
        "holdoutP95Metres": holdout_p95,
        "combinedHorizontal95Feet": combined_horizontal95,
        "combinedOrientation95Degrees": combined_orientation95,
    }, indent=2))


if __name__ == "__main__":
    main()
