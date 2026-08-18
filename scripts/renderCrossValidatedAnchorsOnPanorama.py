#!/usr/bin/env python3
"""Project cross-validated provider-local anchors onto a source panorama."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw

from renderProviderRowsOnPanorama import project_provider_points


ANALYSIS_VERSION = "cross-validated-anchor-panorama-review-v1"


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("anchors", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--seat-id", required=True)
    parser.add_argument("--padding-x", type=int, default=250)
    parser.add_argument("--padding-y", type=int, default=180)
    parser.add_argument("--scale", type=float, default=2.0)
    parser.add_argument("--maximum-labels", type=int, default=120)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    anchors = json.loads(args.anchors.read_text())
    manifest = json.loads(args.panorama_manifest.read_text())
    calibration = json.loads(args.calibration.read_text())
    if not anchors["assessment"].get("providerLocalDirectAnchorMeasurementEligible"):
        raise ValueError("Direct anchor artifact is not measurement eligible")
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Panorama calibration is not measurement eligible")
    entry = next(
        (item for item in manifest["images"] if item["seatId"] == args.seat_id),
        None,
    )
    if entry is None:
        raise ValueError("Requested panorama is missing from the manifest")
    panorama_path = Path(entry["localPath"])
    if file_sha256(panorama_path) != entry["imageSha256"]:
        raise ValueError("Panorama checksum does not match its manifest")
    source = Image.open(panorama_path).convert("RGB")
    if source.size != (entry["width"], entry["height"]):
        raise ValueError("Panorama dimensions do not match its manifest")

    records = anchors["consensus"]["anchors"]
    points = np.asarray([record["providerLocalMetres"] for record in records], dtype=float)
    uncertainties = np.asarray(
        [record["disagreementRadiusMetres"] for record in records],
        dtype=float,
    )
    rotation = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"],
        dtype=float,
    )
    pixels = project_provider_points(
        points,
        np.asarray(entry["config"]["p"], dtype=float),
        rotation,
        float(entry["config"]["rp"][1]),
        source.width,
        source.height,
    )

    reference_x = float(np.median(pixels[:, 0]))
    unwrapped_x = reference_x + (
        (pixels[:, 0] - reference_x + source.width / 2.0) % source.width
        - source.width / 2.0
    )
    left = math.floor(float(np.min(unwrapped_x))) - args.padding_x
    right = math.ceil(float(np.max(unwrapped_x))) + args.padding_x
    top = max(0, math.floor(float(np.min(pixels[:, 1]))) - args.padding_y)
    bottom = min(source.height, math.ceil(float(np.max(pixels[:, 1]))) + args.padding_y)
    if right - left >= source.width:
        raise ValueError("Anchor crop spans the entire panorama")
    tripled = Image.new("RGB", (source.width * 3, source.height))
    for index in range(3):
        tripled.paste(source, (index * source.width, 0))
    shifted_left = left + source.width
    crop = tripled.crop((shifted_left, top, right + source.width, bottom)).convert("RGBA")
    overlay = Image.new("RGBA", crop.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    upper = max(float(np.percentile(uncertainties, 95)), 1e-9)
    label_indices = set(
        np.linspace(
            0,
            len(records) - 1,
            min(args.maximum_labels, len(records)),
            dtype=int,
        ).tolist()
    )
    projected_records = []
    for index, (point, uncertainty, pixel_x, pixel_y) in enumerate(
        zip(points, uncertainties, unwrapped_x, pixels[:, 1])
    ):
        x = float(pixel_x - left)
        y = float(pixel_y - top)
        normalized = min(max(float(uncertainty / upper), 0.0), 1.0)
        color = (
            round(40 + 210 * normalized),
            round(210 - 145 * normalized),
            round(245 - 165 * normalized),
            230,
        )
        radius = 7
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), outline=color, width=4)
        if index in label_indices:
            draw.text((x + 9, y - 9), str(index), fill=(255, 255, 0, 255))
        projected_records.append({
            "anchorIndex": index,
            "providerLocalMetres": [round(float(value), 6) for value in point],
            "disagreementRadiusMetres": round(float(uncertainty), 6),
            "panoramaPixel": [round(float(pixels[index, 0]), 6), round(float(pixel_y), 6)],
        })
    crop = Image.alpha_composite(crop, overlay).convert("RGB")
    if args.scale <= 0:
        raise ValueError("Scale must be positive")
    if args.scale != 1.0:
        crop = crop.resize(
            (round(crop.width * args.scale), round(crop.height * args.scale)),
            Image.Resampling.LANCZOS,
        )
    output_png = args.output_json.with_suffix(".png")
    output_png.parent.mkdir(parents=True, exist_ok=True)
    crop.save(output_png, format="PNG", optimize=True)

    stable = {
        "inputs": {
            "anchorsSha256": file_sha256(args.anchors),
            "panoramaManifestSha256": file_sha256(args.panorama_manifest),
            "calibrationSha256": file_sha256(args.calibration),
            "panoramaSha256": file_sha256(panorama_path),
        },
        "seatId": args.seat_id,
        "cropUnwrappedSourcePixels": {
            "left": left,
            "top": top,
            "right": right,
            "bottom": bottom,
        },
        "projectedAnchors": projected_records,
        "outputPngSha256": file_sha256(output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "direct-anchor-semantic-panorama-review",
        "artifactVersion": value_fingerprint(stable),
        "inputs": {
            "anchors": {"path": str(args.anchors), "sha256": stable["inputs"]["anchorsSha256"]},
            "panoramaManifest": {"path": str(args.panorama_manifest), "sha256": stable["inputs"]["panoramaManifestSha256"]},
            "calibration": {"path": str(args.calibration), "sha256": stable["inputs"]["calibrationSha256"]},
            "panorama": {"path": str(panorama_path), "sha256": stable["inputs"]["panoramaSha256"], "seatId": args.seat_id},
        },
        "projection": {
            "cropUnwrappedSourcePixels": stable["cropUnwrappedSourcePixels"],
            "renderScale": args.scale,
            "providerVectorToPanoramaVector": rotation.tolist(),
        },
        "projectedAnchors": projected_records,
        "outputPng": str(output_png),
        "outputPngSha256": stable["outputPngSha256"],
        "assessment": {
            "semanticReviewEligible": True,
            "publicationEligible": False,
            "blockers": [
                "ANCHORS_REQUIRE_REVIEWED_PHYSICAL_SURFACE_LABELS",
                "ANCHORS_DO_NOT_FORM_CLOSED_OCCLUDER_VOLUMES",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "outputPng": str(output_png),
        "anchorCount": len(records),
        "cropUnwrappedSourcePixels": stable["cropUnwrappedSourcePixels"],
        "artifactVersion": artifact["artifactVersion"],
    }, indent=2))


if __name__ == "__main__":
    main()
