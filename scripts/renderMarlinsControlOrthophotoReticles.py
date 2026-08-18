#!/usr/bin/env python3
"""Render nearest-neighbor reticles for locked training control chips only."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def render(source: Path, output: Path, scale: int) -> dict[str, object]:
    with Image.open(source) as opened:
        image = opened.convert("RGB")
    if image.width % 2 or image.height % 2:
        raise ValueError(f"Control chip dimensions must be even: {source}")
    enlarged = image.resize((image.width * scale, image.height * scale), Image.Resampling.NEAREST)
    center_x = image.width * scale // 2
    center_y = image.height * scale // 2
    gap = 8 * scale
    arm = 28 * scale
    width = max(2, scale // 2)
    draw = ImageDraw.Draw(enlarged)
    color = (255, 0, 255)
    draw.line((center_x - arm, center_y, center_x - gap, center_y), fill=color, width=width)
    draw.line((center_x + gap, center_y, center_x + arm, center_y), fill=color, width=width)
    draw.line((center_x, center_y - arm, center_x, center_y - gap), fill=color, width=width)
    draw.line((center_x, center_y + gap, center_x, center_y + arm), fill=color, width=width)
    output.parent.mkdir(parents=True, exist_ok=True)
    enlarged.save(output)
    return {
        "sourcePath": str(source),
        "sourceSha256": sha256(source),
        "outputPath": str(output),
        "outputSha256": sha256(output),
        "sourceWidth": image.width,
        "sourceHeight": image.height,
        "scale": scale,
        "expectedCenterSourcePixel": [image.width / 2, image.height / 2],
        "reticleGapSourcePixels": gap / scale,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--scale", type=int, default=4)
    arguments = parser.parse_args()
    manifest = json.loads(arguments.manifest.read_text())
    training = [chip for chip in manifest["chips"] if chip["role"] == "training"]
    holdouts = [chip for chip in manifest["chips"] if chip["role"] == "final-holdout"]
    if len(training) < 3 or len(holdouts) < 3:
        raise ValueError("Expected at least three training and three final-holdout chips")
    records = []
    for chip in training:
        source = Path(chip["outputPath"])
        output = arguments.output_dir / f"{chip['id']}-training-reticle.png"
        records.append({"id": chip["id"], "role": chip["role"], **render(source, output, arguments.scale)})
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "marlins-miami-dade-training-control-orthophoto-reticles",
        "sourceManifestPath": str(arguments.manifest),
        "sourceManifestSha256": sha256(arguments.manifest),
        "holdoutAccessRule": "No final-holdout image is opened or rendered by this program.",
        "records": records,
        "publication": {
            "eligible": False,
            "blockers": [
                "TRAINING_CONTROLS_NOT_YET_ADJUDICATED",
                "TRAINING_TRANSFORM_NOT_FROZEN",
                "FINAL_HOLDOUTS_NOT_OPENED_OR_EVALUATED",
            ],
        },
    }
    stable = json.dumps(artifact, sort_keys=True, separators=(",", ":")).encode()
    artifact["artifactVersion"] = f"sha256:{hashlib.sha256(stable).hexdigest()}"
    output_manifest = arguments.output_dir / "manifest.json"
    output_manifest.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "manifestPath": str(output_manifest),
        "artifactVersion": artifact["artifactVersion"],
        "trainingControlIds": [record["id"] for record in records],
        "finalHoldoutImagesOpened": 0,
    }, indent=2))


if __name__ == "__main__":
    main()
