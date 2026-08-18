#!/usr/bin/env python3
"""Render coordinate grids for manual Coors roof-edge correspondence review."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw


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
    parser.add_argument("--review", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--grid-step-pixels", type=int, default=25)
    return parser.parse_args()


def add_grid(panel: Image.Image, step: int) -> Image.Image:
    output = panel.convert("RGB").copy()
    draw = ImageDraw.Draw(output)
    for value in range(0, output.width, step):
        colour = (255, 80, 40) if value % (step * 2) == 0 else (255, 220, 40)
        draw.line((value, 0, value, output.height - 1), fill=colour, width=1)
        draw.text((value + 2, 2), str(value), fill=colour, stroke_width=2, stroke_fill="black")
    for value in range(0, output.height, step):
        colour = (255, 80, 40) if value % (step * 2) == 0 else (255, 220, 40)
        draw.line((0, value, output.width - 1, value), fill=colour, width=1)
        draw.text((2, value + 2), str(value), fill=colour, stroke_width=2, stroke_fill="black")
    return output


def main() -> None:
    args = parse_args()
    if args.grid_step_pixels <= 0:
        raise ValueError("Grid step must be positive")

    control_bytes = args.controls.read_bytes()
    controls = json.loads(control_bytes)
    if controls.get("artifactKind") != "rockies-raw-point-feature-review-controls":
        raise ValueError("Unexpected controls artifact kind")

    review_bytes = args.review.read_bytes()
    review = json.loads(review_bytes)
    if review.get("artifactKind") != "rockies-raw-point-feature-review":
        raise ValueError("Unexpected review artifact kind")
    if review["controls"]["sha256"] != hashlib.sha256(control_bytes).hexdigest():
        raise ValueError("Review artifact does not bind the supplied controls")

    features = {feature["featureId"]: feature for feature in controls["features"]}
    outputs = []
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for record in review["featureOutputs"]:
        feature_id = record["featureId"]
        if feature_id not in features:
            raise ValueError(f"Review feature {feature_id} is absent from controls")
        page_path = Path(record["outputPath"])
        if sha256_file(page_path) != record["outputSha256"]:
            raise ValueError(f"Review image hash differs for {feature_id}")
        with Image.open(page_path) as source:
            page = source.convert("RGB")
        size = page.width // 5
        header = page.height - size
        if size <= 0 or page.width != size * 5 or header < 0:
            raise ValueError(f"Unexpected review page dimensions for {feature_id}")

        plateau = page.crop((size * 2, header, size * 3, header + size))
        orthophoto = page.crop((size * 3, header, size * 4, header + size))
        plateau = add_grid(plateau, args.grid_step_pixels)
        orthophoto = add_grid(orthophoto, args.grid_step_pixels)

        output = Image.new("RGB", (size * 2, size + 52), "white")
        output.paste(plateau, (0, 52))
        output.paste(orthophoto, (size, 52))
        draw = ImageDraw.Draw(output)
        draw.text((8, 6), f"{feature_id}: selected LiDAR plateau", fill="black")
        draw.text((size + 8, 6), f"{feature_id}: corrected orthophoto", fill="black")
        draw.text((8, 27), "Local review pixels: x increases right, y increases down", fill=(55, 55, 55))
        draw.text((size + 8, 27), f"Grid step {args.grid_step_pixels} px", fill=(55, 55, 55))

        output_path = args.output_dir / f"{feature_id}.png"
        output.save(output_path, format="PNG", optimize=True)
        outputs.append({
            "featureId": feature_id,
            "reviewCellMetres": features[feature_id]["reviewCellMetres"],
            "panelSizePixels": size,
            "outputPath": str(output_path),
            "outputSha256": sha256_file(output_path),
        })

    stable = {
        "controls": {
            "path": str(args.controls),
            "sha256": hashlib.sha256(control_bytes).hexdigest(),
        },
        "review": {
            "path": str(args.review),
            "sha256": hashlib.sha256(review_bytes).hexdigest(),
            "artifactVersion": review["artifactVersion"],
        },
        "gridStepPixels": args.grid_step_pixels,
        "outputs": outputs,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-roof-edge-coordinate-grid-review",
        "artifactStage": "manual-correspondence-review-only",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesRegistration": False,
            "acceptedControlCount": 0,
            "note": "Grid images support manual line selection only. A separate locked control artifact and disjoint holdout audit are required.",
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "artifactVersion": artifact["artifactVersion"],
        "featureCount": len(outputs),
    }, indent=2))


if __name__ == "__main__":
    main()
