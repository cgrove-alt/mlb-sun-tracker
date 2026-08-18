#!/usr/bin/env python3
"""Build a diverse, checksum-locked condensed-game scene review queue.

The queue favors Miami-blue seating, fixed structural edges, and mixed light,
then suppresses near-duplicate broadcast views. It is a visual-review aid only.
Condensed-game time is never treated as the original event timestamp.
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


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def image_features(image: np.ndarray) -> dict[str, Any]:
    height, width = image.shape[:2]
    upper = image[0 : round(height * 0.62), :]
    full_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    hsv = cv2.cvtColor(upper, cv2.COLOR_BGR2HSV)
    histogram = cv2.calcHist([hsv], [0, 1], None, [18, 8], [0, 180, 0, 256])
    histogram = cv2.normalize(histogram, None).reshape(-1)
    hue = hsv[:, :, 0]
    saturation = hsv[:, :, 1]
    value = hsv[:, :, 2]
    blue = (hue >= 88) & (hue <= 132) & (saturation >= 55) & (value >= 35)
    full_hue = full_hsv[:, :, 0]
    full_saturation = full_hsv[:, :, 1]
    full_value = full_hsv[:, :, 2]
    green = (
        (full_hue >= 32)
        & (full_hue <= 88)
        & (full_saturation >= 45)
        & (full_value >= 35)
    )
    dark = value <= 72
    bright = value >= 170
    grayscale = cv2.cvtColor(upper, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(grayscale, 70, 150)
    signature = cv2.resize(upper, (48, 20), interpolation=cv2.INTER_AREA).astype(
        np.float32
    ) / 255.0
    blue_fraction = float(np.mean(blue))
    green_fraction = float(np.mean(green))
    tile_blue_fractions = []
    for y_index in range(4):
        y_start = round(y_index * blue.shape[0] / 4)
        y_end = round((y_index + 1) * blue.shape[0] / 4)
        for x_index in range(8):
            x_start = round(x_index * blue.shape[1] / 8)
            x_end = round((x_index + 1) * blue.shape[1] / 8)
            tile_blue_fractions.append(float(np.mean(blue[y_start:y_end, x_start:x_end])))
    blue_grid_coverage = float(np.mean(np.asarray(tile_blue_fractions) >= 0.08))
    dark_fraction = float(np.mean(dark))
    bright_fraction = float(np.mean(bright))
    mixed_light_fraction = min(dark_fraction, bright_fraction)
    edge_fraction = float(np.mean(edges > 0))
    seating_review_score = (
        4.0 * blue_grid_coverage
        + 5.0 * math.sqrt(max(0.0, blue_fraction * green_fraction))
        + 3.0 * mixed_light_fraction
        + 0.8 * edge_fraction
    )
    return {
        "histogram": histogram,
        "signature": signature,
        "blueFraction": blue_fraction,
        "blueGridCoverage": blue_grid_coverage,
        "greenFraction": green_fraction,
        "darkFraction": dark_fraction,
        "brightFraction": bright_fraction,
        "mixedLightFraction": mixed_light_fraction,
        "edgeFraction": edge_fraction,
        "seatingReviewScore": seating_review_score,
    }


def scene_distance(first: dict[str, Any], second: dict[str, Any]) -> tuple[float, float]:
    histogram_distance = float(
        cv2.compareHist(
            first["histogram"].astype(np.float32),
            second["histogram"].astype(np.float32),
            cv2.HISTCMP_BHATTACHARYYA,
        )
    )
    pixel_difference = float(np.mean(np.abs(first["signature"] - second["signature"])))
    return histogram_distance, pixel_difference


def render_sheet(
    records: list[dict[str, Any]],
    output: Path,
    columns: int,
    crop_height_fraction: float = 1.0,
) -> None:
    if not records:
        raise ValueError("Review queue contains no scenes")
    thumbnail_width = 480
    thumbnail_height = round(270 * crop_height_fraction)
    label_height = 62
    title_height = 48
    rows = math.ceil(len(records) / columns)
    sheet = Image.new(
        "RGB",
        (columns * thumbnail_width, title_height + rows * (label_height + thumbnail_height)),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    title = "Diverse condensed-game seating and mixed-light review"
    if crop_height_fraction < 1.0:
        title += " (upper structural crop)"
    draw.text((10, 15), title, fill="black")
    for index, record in enumerate(records):
        image = Image.open(record["thumbnailPath"]).convert("RGB")
        if crop_height_fraction < 1.0:
            image = image.crop(
                (0, 0, image.width, round(image.height * crop_height_fraction))
            )
        image = image.resize((thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS)
        column = index % columns
        row = index // columns
        left = column * thumbnail_width
        top = title_height + row * (label_height + thumbnail_height)
        label = (
            f"shot {record['shotIndex']:03d}  {record['condensedTimelineSeconds']:.1f}s  "
            f"span {record['shotStartSeconds']:.1f}-{record['shotEndSeconds']:.1f}s\n"
            f"blue {record['features']['blueFraction']:.3f}  "
            f"grid {record['features']['blueGridCoverage']:.2f}  "
            f"green {record['features']['greenFraction']:.3f}\n"
            f"mixed {record['features']['mixedLightFraction']:.3f}  "
            f"score {record['features']['seatingReviewScore']:.3f}  "
            f"pixels {record['decodedPixelsSha256'][:10]}"
        )
        draw.text((left + 6, top + 5), label, fill="black")
        sheet.paste(image, (left, top + label_height))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="JPEG", quality=94, optimize=True, progressive=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--maximum-scenes", type=int, default=80)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--shot-histogram-distance", type=float, default=0.24)
    parser.add_argument("--shot-pixel-difference", type=float, default=0.12)
    parser.add_argument("--duplicate-histogram-distance", type=float, default=0.10)
    parser.add_argument("--duplicate-pixel-difference", type=float, default=0.075)
    parser.add_argument("--minimum-green-fraction", type=float, default=0.0)
    parser.add_argument("--minimum-blue-grid-coverage", type=float, default=0.0)
    arguments = parser.parse_args()
    if arguments.maximum_scenes < 1 or arguments.columns < 1:
        raise ValueError("Queue and sheet dimensions must be positive")

    manifest_bytes = arguments.frame_manifest.read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get("artifactStage") != "official-mlb-condensed-game-frame-review-index":
        raise ValueError("Input is not a condensed-game frame index")

    analyzed: list[dict[str, Any]] = []
    for frame in manifest["frames"]:
        thumbnail_path = Path(frame["thumbnailPath"])
        if sha256_file(thumbnail_path) != frame["thumbnailSha256"]:
            raise ValueError(f"Thumbnail checksum changed: {thumbnail_path}")
        image = cv2.imread(str(thumbnail_path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode {thumbnail_path}")
        analyzed.append({**frame, "_features": image_features(image)})

    shots: list[list[dict[str, Any]]] = []
    for frame in analyzed:
        if not shots:
            shots.append([frame])
            continue
        histogram_distance, pixel_difference = scene_distance(
            shots[-1][-1]["_features"], frame["_features"]
        )
        if (
            histogram_distance >= arguments.shot_histogram_distance
            or pixel_difference >= arguments.shot_pixel_difference
        ):
            shots.append([])
        shots[-1].append(frame)

    representatives: list[dict[str, Any]] = []
    for shot_index, shot in enumerate(shots, start=1):
        representative = max(
            shot,
            key=lambda item: (
                item["_features"]["seatingReviewScore"],
                item["_features"]["edgeFraction"],
            ),
        )
        representatives.append(
            {
                **representative,
                "shotIndex": shot_index,
                "shotStartSeconds": shot[0]["condensedTimelineSeconds"],
                "shotEndSeconds": shot[-1]["condensedTimelineSeconds"],
                "shotSampleCount": len(shot),
            }
        )

    selected: list[dict[str, Any]] = []
    eligible_representatives = [
        item
        for item in representatives
        if item["_features"]["greenFraction"] >= arguments.minimum_green_fraction
        and item["_features"]["blueGridCoverage"]
        >= arguments.minimum_blue_grid_coverage
    ]
    for candidate in sorted(
        eligible_representatives,
        key=lambda item: item["_features"]["seatingReviewScore"],
        reverse=True,
    ):
        duplicate = False
        for accepted in selected:
            histogram_distance, pixel_difference = scene_distance(
                candidate["_features"], accepted["_features"]
            )
            if (
                histogram_distance < arguments.duplicate_histogram_distance
                and pixel_difference < arguments.duplicate_pixel_difference
            ):
                duplicate = True
                break
        if duplicate:
            continue
        selected.append(candidate)
        if len(selected) >= arguments.maximum_scenes:
            break
    selected.sort(key=lambda item: item["condensedTimelineSeconds"])

    queue: list[dict[str, Any]] = []
    for record in selected:
        features = record.pop("_features")
        queue.append(
            {
                **record,
                "features": {
                    key: value
                    for key, value in features.items()
                    if key not in {"histogram", "signature"}
                },
            }
        )
    review_sheet = arguments.output_json.with_suffix(".jpg")
    render_sheet(queue, review_sheet, arguments.columns)
    upper_review_sheet = arguments.output_json.with_name(
        f"{arguments.output_json.stem}-upper.jpg"
    )
    render_sheet(queue, upper_review_sheet, arguments.columns, 0.62)
    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "diverse-condensed-scene-review-v1",
        "artifactStage": "official-mlb-condensed-scene-review-queue",
        "inputs": {
            "frameManifestPath": str(arguments.frame_manifest),
            "frameManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "frameManifestArtifactVersion": manifest["artifactVersion"],
        },
        "parameters": {
            "maximumScenes": arguments.maximum_scenes,
            "shotHistogramDistance": arguments.shot_histogram_distance,
            "shotPixelDifference": arguments.shot_pixel_difference,
            "duplicateHistogramDistance": arguments.duplicate_histogram_distance,
            "duplicatePixelDifference": arguments.duplicate_pixel_difference,
            "minimumGreenFraction": arguments.minimum_green_fraction,
            "minimumBlueGridCoverage": arguments.minimum_blue_grid_coverage,
        },
        "sampleCount": len(analyzed),
        "detectedShotCount": len(shots),
        "selectedSceneCount": len(queue),
        "reviewQueue": queue,
        "reviewSheetPath": str(review_sheet),
        "reviewSheetSha256": sha256_file(review_sheet),
        "upperReviewSheetPath": str(upper_review_sheet),
        "upperReviewSheetSha256": sha256_file(upper_review_sheet),
        "publicationEligible": False,
        "blockers": [
            "CONDENSED_TIMELINE_IS_NOT_THE_ORIGINAL_EVENT_TIMESTAMP",
            "SELECTED_SCENES_REQUIRE_EXACT_PLAY_CLIP_MATCHING",
            "SECTION_AND_ROW_REGISTRATION_REQUIRED",
            "SHADOW_BOUNDARY_LABEL_REQUIRED",
        ],
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputJson": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "detectedShotCount": len(shots),
                "selectedSceneCount": len(queue),
                "reviewSheet": str(review_sheet),
                "upperReviewSheet": str(upper_review_sheet),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
