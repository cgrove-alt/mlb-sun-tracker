#!/usr/bin/env python3
"""Extract adjacent-face home-plate and first-base panorama controls."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageDraw


ANALYSIS_VERSION = "rockies-panorama-adjacent-infield-control-extraction-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


def fit_line(points: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    if len(points) < 12:
        raise ValueError("Line corridor contains fewer than 12 selected pixels")
    center = np.mean(points, axis=0)
    _, _, vectors = np.linalg.svd(points - center, full_matrices=False)
    direction = vectors[0]
    if direction[0] < 0:
        direction = -direction
    return center, direction


def line_intersection(
    first: tuple[np.ndarray, np.ndarray],
    second: tuple[np.ndarray, np.ndarray],
) -> np.ndarray:
    first_center, first_direction = first
    second_center, second_direction = second
    matrix = np.column_stack((first_direction, -second_direction))
    if abs(float(np.linalg.det(matrix))) < 1e-6:
        raise ValueError("Reviewed foul-line fits are nearly parallel")
    parameters = np.linalg.solve(matrix, second_center - first_center)
    return first_center + parameters[0] * first_direction


def line_corridor_mask(
    x: np.ndarray,
    y: np.ndarray,
    definition: dict[str, Any],
) -> np.ndarray:
    x0, y0 = [float(value) for value in definition["seedStartPixel"]]
    x1, y1 = [float(value) for value in definition["seedEndPixel"]]
    direction = np.asarray([x1 - x0, y1 - y0], dtype=np.float64)
    length = float(np.linalg.norm(direction))
    if length <= 0:
        raise ValueError("Line corridor seed has zero length")
    normal = np.asarray([-direction[1], direction[0]]) / length
    distance = np.abs((x - x0) * normal[0] + (y - y0) * normal[1])
    left, top, right, bottom = [int(value) for value in definition["bounds"]]
    return (
        (x >= left)
        & (x <= right)
        & (y >= top)
        & (y <= bottom)
        & (distance <= float(definition["halfWidthPixels"]))
    )


def extract_home_intersection(
    hsv: np.ndarray,
    control: dict[str, Any],
) -> dict[str, Any]:
    y, x = np.indices(hsv.shape[:2], dtype=np.float64)
    first_corridor = line_corridor_mask(x, y, control["firstBaseFoulLineCorridor"])
    third_corridor = line_corridor_mask(x, y, control["thirdBaseFoulLineCorridor"])
    exclusion = np.zeros(hsv.shape[:2], dtype=bool)
    for bounds in control.get("exclusionBounds", []):
        left, top, right, bottom = [int(value) for value in bounds]
        exclusion[top:bottom, left:right] = True
    records: list[dict[str, Any]] = []
    for saturation_maximum in control["thresholdSensitivity"]["saturationMaximums"]:
        for value_minimum in control["thresholdSensitivity"]["valueMinimums"]:
            white = (
                (hsv[:, :, 1] <= int(saturation_maximum))
                & (hsv[:, :, 2] >= int(value_minimum))
            )
            first_points = np.column_stack(
                (x[white & first_corridor & ~exclusion], y[white & first_corridor & ~exclusion])
            )
            third_points = np.column_stack(
                (x[white & third_corridor], y[white & third_corridor])
            )
            first_line = fit_line(first_points)
            third_line = fit_line(third_points)
            intersection = line_intersection(first_line, third_line)
            records.append({
                "saturationMaximum": int(saturation_maximum),
                "valueMinimum": int(value_minimum),
                "firstBaseFoulLinePixelCount": int(len(first_points)),
                "thirdBaseFoulLinePixelCount": int(len(third_points)),
                "firstBaseFoulLine": {
                    "centerPixel": first_line[0].tolist(),
                    "direction": first_line[1].tolist(),
                },
                "thirdBaseFoulLine": {
                    "centerPixel": third_line[0].tolist(),
                    "direction": third_line[1].tolist(),
                },
                "intersectionPixel": intersection.tolist(),
            })
    intersections = np.asarray([item["intersectionPixel"] for item in records])
    selected = np.median(intersections, axis=0)
    uncertainty = float(
        np.max(np.linalg.norm(intersections - selected, axis=1))
        + float(control["additionalSemanticIntersectionUncertaintyPixels95"])
    )
    return {
        "controlId": control["controlId"],
        "semanticIdentity": "back point of home plate from the intersection of the first-base and third-base foul-line centerlines",
        "variantCount": len(records),
        "selected": {
            "intersectionPixel": selected.tolist(),
            "intersectionUncertaintyPixels95": uncertainty,
        },
        "sensitivity": records,
        "geometryBoundary": {
            "establishesHomePlateBackPointCandidate": True,
            "note": "Official field layout defines both foul lines from the back point of home plate. The plate raster itself is not substituted for the line intersection.",
        },
    }


def extract_first_base_candidate(
    hsv: np.ndarray,
    control: dict[str, Any],
) -> dict[str, Any]:
    left, top, right, bottom = [int(value) for value in control["roi"]]
    anchor_x = int(control["anchorPixel"][0]) - left
    anchor_y = int(control["anchorPixel"][1]) - top
    roi = hsv[top:bottom, left:right]
    records: list[dict[str, Any]] = []
    for saturation_maximum in control["thresholdSensitivity"]["saturationMaximums"]:
        for value_minimum in control["thresholdSensitivity"]["valueMinimums"]:
            mask = (
                (roi[:, :, 1] <= int(saturation_maximum))
                & (roi[:, :, 2] >= int(value_minimum))
            ).astype(np.uint8)
            count, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)
            label = int(labels[anchor_y, anchor_x])
            if label <= 0 or label >= count:
                raise ValueError("First-base component does not contain the locked anchor")
            component_left, component_top, width, height, area = [
                int(value) for value in stats[label]
            ]
            limits = control["componentLimits"]
            if not (
                limits["minimumAreaPixels"] <= area <= limits["maximumAreaPixels"]
                and limits["minimumWidthPixels"] <= width <= limits["maximumWidthPixels"]
                and limits["minimumHeightPixels"] <= height <= limits["maximumHeightPixels"]
            ):
                raise ValueError("First-base component violates locked shape limits")
            bounding_center = np.asarray(
                [
                    left + component_left + (width - 1.0) / 2.0,
                    top + component_top + (height - 1.0) / 2.0,
                ]
            )
            records.append({
                "saturationMaximum": int(saturation_maximum),
                "valueMinimum": int(value_minimum),
                "areaPixels": area,
                "componentBoundingBox": [
                    left + component_left,
                    top + component_top,
                    left + component_left + width,
                    top + component_top + height,
                ],
                "boundingBoxCenterPixel": bounding_center.tolist(),
                "thresholdCentroidPixel": [
                    float(centroids[label][0] + left),
                    float(centroids[label][1] + top),
                ],
            })
    centers = np.asarray([item["boundingBoxCenterPixel"] for item in records])
    selected = np.median(centers, axis=0)
    uncertainty = float(
        np.max(np.linalg.norm(centers - selected, axis=1))
        + float(control["additionalBagCenterUncertaintyPixels95"])
    )
    return {
        "controlId": control["controlId"],
        "semanticIdentity": "first-base bag center candidate isolated at the expected foul-line location",
        "variantCount": len(records),
        "selected": {
            "centerPixel": selected.tolist(),
            "centerUncertaintyPixels95": uncertainty,
        },
        "sensitivity": records,
        "geometryBoundary": {
            "establishesFirstBaseBagCenterCandidate": True,
            "establishesReleaseControl": False,
            "note": "The low-resolution bag touches the chalk line. It remains a prefit holdout rather than a pose-training control.",
        },
    }


def render_review(
    image: np.ndarray,
    home: dict[str, Any],
    first_base: dict[str, Any],
    output: Path,
) -> None:
    canvas = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(canvas)
    home_x, home_y = home["selected"]["intersectionPixel"]
    first_x, first_y = first_base["selected"]["centerPixel"]
    for x, y, colour, label in (
        (home_x, home_y, (255, 50, 50), "home foul-line intersection"),
        (first_x, first_y, (0, 255, 255), "first-base candidate"),
    ):
        draw.line((x - 12, y, x + 12, y), fill=colour, width=3)
        draw.line((x, y - 12, x, y + 12), fill=colour, width=3)
        draw.text((x + 8, y - 24), label, fill=colour)
    crop = canvas.crop((1840, 1160, 2048, 1270)).resize(
        (1664, 880), resample=Image.Resampling.NEAREST
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    crop.save(output, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--review-image", type=Path, required=True)
    args = parser.parse_args()
    control_bytes = args.controls.read_bytes()
    controls = json.loads(control_bytes)
    if controls.get("artifactKind") != "rockies-panorama-adjacent-infield-extraction-controls":
        raise ValueError("Unexpected controls artifact kind")
    for name, record in controls["inputs"].items():
        if sha256_file(Path(record["path"])) != record["sha256"]:
            raise ValueError(f"Input checksum differs for {name}")
    topology = json.loads(Path(controls["inputs"]["cubemapTopologyAudit"]["path"]).read_text())
    if topology.get("analysisVersion") != "sportsdigita-cubemap-pixel-seam-topology-v1":
        raise ValueError("Unsupported cubemap topology audit")
    if topology["sources"]["b"]["sha256"] != controls["inputs"]["backFaceImage"]["sha256"]:
        raise ValueError("Topology audit points to a different back face")
    image_path = Path(controls["inputs"]["backFaceImage"]["path"])
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not read back-face image")
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    home = extract_home_intersection(hsv, controls["homePlateControl"])
    first_base = extract_first_base_candidate(hsv, controls["firstBaseCandidate"])
    render_review(image, home, first_base, args.review_image)
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "face": "b",
        "inputs": controls["inputs"],
        "controls": {
            "path": str(args.controls),
            "sha256": hashlib.sha256(control_bytes).hexdigest(),
        },
        "homePlate": home,
        "firstBaseCandidate": first_base,
        "reviewImage": {
            "path": str(args.review_image),
            "sha256": sha256_file(args.review_image),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-adjacent-infield-control-extraction",
        "artifactStage": "cross-face-home-control-and-first-base-holdout-extracted",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesHomePlateBackPointCandidate": True,
            "establishesFirstBaseBagCenterCandidate": True,
            "establishesCameraPose": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "CAMERA_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT",
                "CUBEMAP_LEVELING_UNCERTAINTY_NOT_ESTABLISHED",
                "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "homePlate": home["selected"],
        "firstBaseCandidate": first_base["selected"],
    }, indent=2))


if __name__ == "__main__":
    main()
