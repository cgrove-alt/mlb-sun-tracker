#!/usr/bin/env python3
"""Extract checksum-locked regulation field controls from the Section 207 cubemap.

The mound is represented by its two horizontal silhouette tangencies. The
center of a projected ground circle is not, in general, the projection of the
circle center, so this script intentionally does not publish a mound centroid
as a point control.
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
from PIL import Image, ImageDraw


ANALYSIS_VERSION = "rockies-panorama-regulation-field-control-extraction-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


def roi_values(value: list[int], width: int, height: int) -> tuple[int, int, int, int]:
    if len(value) != 4:
        raise ValueError("ROI must contain left, top, right, and bottom")
    left, top, right, bottom = [int(item) for item in value]
    if not (0 <= left < right <= width and 0 <= top < bottom <= height):
        raise ValueError("ROI lies outside the panorama face")
    return left, top, right, bottom


def component_at_anchor(mask: np.ndarray, anchor: tuple[int, int]) -> dict[str, Any]:
    count, labels, stats, centroids = cv2.connectedComponentsWithStats(
        mask.astype(np.uint8), connectivity=8
    )
    x, y = anchor
    if not (0 <= x < mask.shape[1] and 0 <= y < mask.shape[0]):
        raise ValueError("Component anchor lies outside its ROI")
    label = int(labels[y, x])
    if label <= 0 or label >= count:
        raise ValueError("Thresholded component does not contain the locked anchor")
    left, top, width, height, area = [int(item) for item in stats[label]]
    center_x, center_y = [float(item) for item in centroids[label]]
    return {
        "left": left,
        "top": top,
        "rightExclusive": left + width,
        "bottomExclusive": top + height,
        "width": width,
        "height": height,
        "areaPixels": area,
        "centroid": [center_x, center_y],
    }


def extract_mound(
    hsv: np.ndarray,
    control: dict[str, Any],
) -> dict[str, Any]:
    height, width = hsv.shape[:2]
    left, top, right, bottom = roi_values(control["roi"], width, height)
    anchor = (
        int(control["anchorPixel"][0]) - left,
        int(control["anchorPixel"][1]) - top,
    )
    roi = hsv[top:bottom, left:right]
    records: list[dict[str, Any]] = []
    for hue_maximum in control["thresholdSensitivity"]["hueMaximums"]:
        for saturation_maximum in control["thresholdSensitivity"]["saturationMaximums"]:
            for value_minimum in control["thresholdSensitivity"]["valueMinimums"]:
                mask = (
                    (roi[:, :, 0] <= int(hue_maximum))
                    & (roi[:, :, 1] <= int(saturation_maximum))
                    & (roi[:, :, 2] >= int(value_minimum))
                )
                component = component_at_anchor(mask, anchor)
                if not (
                    control["componentLimits"]["minimumAreaPixels"]
                    <= component["areaPixels"]
                    <= control["componentLimits"]["maximumAreaPixels"]
                    and control["componentLimits"]["minimumWidthPixels"]
                    <= component["width"]
                    <= control["componentLimits"]["maximumWidthPixels"]
                    and control["componentLimits"]["minimumHeightPixels"]
                    <= component["height"]
                    <= control["componentLimits"]["maximumHeightPixels"]
                ):
                    raise ValueError("Mound component violates locked shape limits")
                records.append({
                    "hueMaximum": int(hue_maximum),
                    "saturationMaximum": int(saturation_maximum),
                    "valueMinimum": int(value_minimum),
                    "leftTangentPixelX": float(left + component["left"] - 0.5),
                    "rightTangentPixelX": float(left + component["rightExclusive"] - 0.5),
                    "component": {
                        **component,
                        "centroid": [
                            component["centroid"][0] + left,
                            component["centroid"][1] + top,
                        ],
                    },
                })
    left_values = np.asarray([item["leftTangentPixelX"] for item in records])
    right_values = np.asarray([item["rightTangentPixelX"] for item in records])
    selected_left = float(np.median(left_values))
    selected_right = float(np.median(right_values))
    boundary_margin = float(control["additionalBoundaryUncertaintyPixels95"])
    return {
        "controlId": control["controlId"],
        "semanticIdentity": "horizontal silhouette tangencies of the 18-foot mound circle",
        "roi": [left, top, right, bottom],
        "variantCount": len(records),
        "selected": {
            "leftTangentPixelX": selected_left,
            "rightTangentPixelX": selected_right,
            "leftTangentUncertaintyPixels95": float(
                np.max(np.abs(left_values - selected_left)) + boundary_margin
            ),
            "rightTangentUncertaintyPixels95": float(
                np.max(np.abs(right_values - selected_right)) + boundary_margin
            ),
        },
        "sensitivity": records,
        "geometryBoundary": {
            "establishesProjectedCircleCenterPixel": False,
            "establishesHorizontalTangentBearings": True,
            "note": "The two silhouette limits are retained separately. Their image midpoint is not used as a projected world-point center.",
        },
    }


def extract_base_candidate(
    hsv: np.ndarray,
    control: dict[str, Any],
) -> dict[str, Any]:
    height, width = hsv.shape[:2]
    left, top, right, bottom = roi_values(control["roi"], width, height)
    anchor = (
        int(control["anchorPixel"][0]) - left,
        int(control["anchorPixel"][1]) - top,
    )
    roi = hsv[top:bottom, left:right]
    records: list[dict[str, Any]] = []
    for saturation_maximum in control["thresholdSensitivity"]["saturationMaximums"]:
        for value_minimum in control["thresholdSensitivity"]["valueMinimums"]:
            mask = (
                (roi[:, :, 1] <= int(saturation_maximum))
                & (roi[:, :, 2] >= int(value_minimum))
            )
            component = component_at_anchor(mask, anchor)
            if not (
                control["componentLimits"]["minimumAreaPixels"]
                <= component["areaPixels"]
                <= control["componentLimits"]["maximumAreaPixels"]
                and control["componentLimits"]["minimumWidthPixels"]
                <= component["width"]
                <= control["componentLimits"]["maximumWidthPixels"]
                and control["componentLimits"]["minimumHeightPixels"]
                <= component["height"]
                <= control["componentLimits"]["maximumHeightPixels"]
            ):
                raise ValueError(f"Base candidate {control['controlId']} violates shape limits")
            records.append({
                "saturationMaximum": int(saturation_maximum),
                "valueMinimum": int(value_minimum),
                "centroidPixel": [
                    component["centroid"][0] + left,
                    component["centroid"][1] + top,
                ],
                "component": component,
            })
    centers = np.asarray([item["centroidPixel"] for item in records], dtype=np.float64)
    selected = np.median(centers, axis=0)
    segmentation_uncertainty = float(np.max(np.linalg.norm(centers - selected, axis=1)))
    semantic_margin = float(control["additionalSemanticCenterUncertaintyPixels95"])
    return {
        "controlId": control["controlId"],
        "semanticIdentity": "unassigned visible base-bag center candidate",
        "roi": [left, top, right, bottom],
        "variantCount": len(records),
        "selected": {
            "centroidPixel": selected.tolist(),
            "centroidUncertaintyPixels95": segmentation_uncertainty + semantic_margin,
        },
        "sensitivity": records,
        "geometryBoundary": {
            "establishesBaseBagIdentity": False,
            "establishesVisibleBagCenterCandidate": True,
            "note": "First, second, and third-base assignments remain hypotheses for the bearing-pose audit.",
        },
    }


def render_review(
    image: np.ndarray,
    mound: dict[str, Any],
    bases: list[dict[str, Any]],
    output: Path,
) -> None:
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    canvas = Image.fromarray(rgb)
    draw = ImageDraw.Draw(canvas)
    mound_roi = mound["roi"]
    draw.rectangle(mound_roi, outline=(255, 210, 0), width=3)
    for key, colour in (
        ("leftTangentPixelX", (255, 50, 50)),
        ("rightTangentPixelX", (255, 50, 50)),
    ):
        x = float(mound["selected"][key])
        draw.line((x, mound_roi[1], x, mound_roi[3]), fill=colour, width=3)
    draw.text((mound_roi[0], mound_roi[1] - 18), "mound tangent extraction", fill=(255, 210, 0))
    colours = [(0, 255, 255), (255, 90, 255)]
    for base, colour in zip(bases, colours):
        draw.rectangle(base["roi"], outline=colour, width=3)
        x, y = base["selected"]["centroidPixel"]
        draw.line((x - 10, y, x + 10, y), fill=colour, width=3)
        draw.line((x, y - 10, x, y + 10), fill=colour, width=3)
        draw.text((base["roi"][0], base["roi"][1] - 18), base["controlId"], fill=colour)
    crop_box = (0, 1125, 430, 1285)
    review = canvas.crop(crop_box).resize((1720, 640), resample=Image.Resampling.NEAREST)
    output.parent.mkdir(parents=True, exist_ok=True)
    review.save(output, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--review-image", type=Path, required=True)
    args = parser.parse_args()

    control_bytes = args.controls.read_bytes()
    controls = json.loads(control_bytes)
    if controls.get("artifactKind") != "rockies-panorama-regulation-field-extraction-controls":
        raise ValueError("Unexpected controls artifact kind")

    inputs: dict[str, dict[str, Any]] = controls["inputs"]
    for name, record in inputs.items():
        path = Path(record["path"])
        if sha256_file(path) != record["sha256"]:
            raise ValueError(f"Input checksum differs for {name}")

    panorama_manifest = json.loads(Path(inputs["panoramaManifest"]["path"]).read_text())
    section = next(
        item for item in panorama_manifest["sections"]
        if str(item["sectionId"]) == str(controls["sectionId"])
    )
    image_record = next(item for item in section["images"] if item["face"] == controls["face"])
    image_path = Path(inputs["panoramaImage"]["path"])
    if Path(image_record["localPath"]).resolve() != image_path.resolve():
        raise ValueError("Panorama manifest points to a different face image")
    if image_record["sha256"] != inputs["panoramaImage"]["sha256"]:
        raise ValueError("Panorama manifest image checksum differs")

    rules_manifest = json.loads(Path(inputs["officialRulesManifest"]["path"]).read_text())
    if rules_manifest.get("artifactKind") != "official-team-resource-acquisition":
        raise ValueError("Rules manifest has the wrong artifact kind")
    rules_pdf = Path(inputs["officialRulesPdf"]["path"])
    if rules_manifest.get("sha256") != sha256_file(rules_pdf):
        raise ValueError("Rules PDF checksum differs from its acquisition manifest")
    if not math.isclose(float(controls["regulationGeometryFeet"]["moundDiameter"]), 18.0):
        raise ValueError("Locked mound diameter is not 18 feet")
    if not math.isclose(float(controls["regulationGeometryFeet"]["homeToMoundCenter"]), 59.0):
        raise ValueError("Locked home-to-mound-center distance is not 59 feet")

    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not read panorama image")
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    mound = extract_mound(hsv, controls["moundControl"])
    bases = [extract_base_candidate(hsv, item) for item in controls["baseCandidates"]]
    render_review(image, mound, bases, args.review_image)

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": str(controls["sectionId"]),
        "face": controls["face"],
        "inputs": inputs,
        "controls": {
            "path": str(args.controls),
            "sha256": hashlib.sha256(control_bytes).hexdigest(),
        },
        "regulationGeometryFeet": controls["regulationGeometryFeet"],
        "mound": mound,
        "baseCandidates": bases,
        "reviewImage": {
            "path": str(args.review_image),
            "sha256": sha256_file(args.review_image),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-regulation-field-control-extraction",
        "artifactStage": "pixel-controls-extracted-semantic-base-identity-unresolved",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesMoundTangentPixels": True,
            "establishesVisibleBaseCandidatePixels": True,
            "establishesBaseCandidateWorldIdentity": False,
            "establishesCameraPose": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "BASE_BAG_WORLD_IDENTITIES_NOT_YET_ADJUDICATED",
                "CAMERA_POSE_NOT_YET_FITTED",
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
        "moundTangents": mound["selected"],
        "baseCandidates": [item["selected"] for item in bases],
    }, indent=2))


if __name__ == "__main__":
    main()
