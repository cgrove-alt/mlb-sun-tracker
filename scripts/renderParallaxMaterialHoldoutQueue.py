#!/usr/bin/env python3
"""Render deterministic unseen material holdouts for parallax classifiers."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--observation", nargs=2, action="append", required=True)
    parser.add_argument("--per-class-per-observation", type=int, default=6)
    parser.add_argument("--exclude-seat-id", action="append", default=[])
    parser.add_argument("--crop-width", type=int, default=640)
    parser.add_argument("--crop-height", type=int, default=480)
    parser.add_argument("--columns", type=int, default=4)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def midpoint_direction_index(query: dict[str, Any]) -> int:
    midpoint = query["event"]["solarPositionAtMidpoint"]
    return next(
        index
        for index, sample in enumerate(query["event"]["angularSamples"])
        if (
            float(sample["trueAzimuthDegrees"]) == float(midpoint["azimuthDegrees"])
            and float(sample["altitudeDegrees"]) == float(midpoint["altitudeDegrees"])
        )
    )


def wrapped_crop(
    image: Image.Image,
    center_x: float,
    center_y: float,
    width: int,
    height: int,
) -> Image.Image:
    doubled = Image.new("RGB", (image.width * 3, image.height))
    doubled.paste(image, (0, 0))
    doubled.paste(image, (image.width, 0))
    doubled.paste(image, (image.width * 2, 0))
    left = int(round((center_x % image.width) + image.width - width / 2))
    top = max(0, min(image.height - height, int(round(center_y - height / 2))))
    return doubled.crop((left, top, left + width, top + height))


def main() -> None:
    args = parse_args()
    if args.per_class_per_observation < 1:
        raise ValueError("At least one holdout per class and observation is required")
    manifest = json.loads(args.panorama_manifest.read_text())
    images = {item["seatId"]: item for item in manifest["images"]}
    excluded = set(args.exclude_seat_id)
    selected = []
    inputs = []
    for query_name, support_name in args.observation:
        query_path = Path(query_name)
        support_path = Path(support_name)
        query = json.loads(query_path.read_text())
        support = json.loads(support_path.read_text())
        if (
            support["inputs"]["queryArtifact"]["sha256"]
            != sha256_file(query_path)
        ):
            raise ValueError("Point-support artifact does not lock its query artifact")
        inputs.append({
            "queryArtifact": {
                "path": str(query_path),
                "sha256": sha256_file(query_path),
                "artifactVersion": query["artifactVersion"],
            },
            "pointSupportArtifact": {
                "path": str(support_path),
                "sha256": sha256_file(support_path),
                "artifactVersion": support["artifactVersion"],
            },
        })
        query_results = {result["seatId"]: result for result in query["results"]}
        direction_index = midpoint_direction_index(query)
        by_class = {
            "confirmed-fixed-envelope": [],
            "confirmed-movable-background-envelope": [],
        }
        for result in support["results"]:
            classification = result["classification"]
            if classification not in by_class or result["seatId"] in excluded:
                continue
            query_result = query_results[result["seatId"]]
            sample = next(
                item
                for item in query_result["sampleResults"]
                if int(item["directionIndex"]) == direction_index
            )
            rank = hashlib.sha256(
                (
                    f"material-holdout-v1|{query['event']['candidateId']}|"
                    f"{result['seatId']}|{classification}"
                ).encode("utf-8")
            ).hexdigest()
            by_class[classification].append((rank, result, sample, query))
        for classification, candidates in by_class.items():
            candidates.sort(key=lambda item: item[0])
            if len(candidates) < args.per_class_per_observation:
                raise ValueError(f"Too few {classification} candidates")
            for rank, result, sample, query_value in candidates[
                :args.per_class_per_observation
            ]:
                selected.append({
                    "holdoutId": (
                        f"{query_value['event']['candidateId']}|{result['seatId']}|"
                        f"direction-{direction_index}"
                    ),
                    "candidateId": query_value["event"]["candidateId"],
                    "seatId": result["seatId"],
                    "directionIndex": direction_index,
                    "analysisMaximumWidth": int(query_value["parameters"]["maximumWidth"]),
                    "panoramaPixelAtAnalysisResolution": sample["panoramaPixel"],
                    "predictedEnvelopeClass": classification,
                    "deterministicSelectionRank": rank,
                    "manualMaterialDecision": None,
                })

    panel_width = args.crop_width
    header_height = 72
    panel_height = args.crop_height + header_height
    rows = math.ceil(len(selected) / args.columns)
    canvas = Image.new(
        "RGB",
        (args.columns * panel_width, rows * panel_height),
        (242, 242, 242),
    )
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    for index, item in enumerate(selected):
        image_entry = images[item["seatId"]]
        source_path = Path(image_entry["localPath"])
        if sha256_file(source_path) != image_entry["imageSha256"]:
            raise ValueError(f"Panorama hash mismatch for {item['seatId']}")
        source = Image.open(source_path).convert("RGB")
        analysis_width = int(item["analysisMaximumWidth"])
        analysis_height = int(round(source.height * analysis_width / source.width))
        pixel = item["panoramaPixelAtAnalysisResolution"]
        center_x = float(pixel[0]) * source.width / analysis_width
        center_y = float(pixel[1]) * source.height / analysis_height
        crop = wrapped_crop(
            source,
            center_x,
            center_y,
            args.crop_width,
            args.crop_height,
        )
        crop_draw = ImageDraw.Draw(crop)
        cx = args.crop_width // 2
        cy = args.crop_height // 2
        crop_draw.line((cx - 28, cy, cx + 28, cy), fill=(255, 45, 0), width=5)
        crop_draw.line((cx, cy - 28, cx, cy + 28), fill=(255, 45, 0), width=5)
        column = index % args.columns
        row = index // args.columns
        left = column * panel_width
        top = row * panel_height
        canvas.paste(crop, (left, top + header_height))
        label = (
            f"{index + 1:02d} {item['seatId']} d{item['directionIndex']}\n"
            f"prediction: {item['predictedEnvelopeClass']}"
        )
        draw.multiline_text((left + 8, top + 10), label, fill=(20, 20, 20), font=font)
        item["sourcePanorama"] = {
            "path": str(source_path),
            "sha256": image_entry["imageSha256"],
        }
        item["sourcePixel"] = [round(center_x, 6), round(center_y, 6)]
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(args.output_png, format="PNG", optimize=True)
    stable = {
        "inputs": {
            "panoramaManifest": {
                "path": str(args.panorama_manifest),
                "sha256": sha256_file(args.panorama_manifest),
                "artifactVersion": manifest.get("artifactVersion"),
            },
            "observations": inputs,
        },
        "selectionRule": (
            "SHA-256 rank within predicted class and observation after explicit development-seat exclusion"
        ),
        "excludedDevelopmentSeatIds": sorted(excluded),
        "manualReviewQueue": selected,
        "contactSheet": {
            "path": str(args.output_png),
            "sha256": sha256_file(args.output_png),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "parallax-material-holdout-review-queue",
        "artifactVersion": fingerprint(stable),
        **stable,
        "publicationEligible": False,
        "blockers": ["MANUAL_MATERIAL_REVIEW_NOT_YET_COMPLETE"],
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "outputPng": str(args.output_png),
        "holdoutCount": len(selected),
        "artifactVersion": artifact["artifactVersion"],
    }, indent=2))


if __name__ == "__main__":
    main()
