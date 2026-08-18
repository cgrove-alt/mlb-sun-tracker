#!/usr/bin/env python3
"""Render a checksum-locked cubemap source region with native coordinate grid."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "sportsdigita-source-region-coordinate-grid-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_bounds(value: str) -> list[int]:
    parts = [int(part.strip()) for part in value.split(",")]
    if len(parts) != 4:
        raise ValueError("Bounds must contain left,top,right,bottom")
    return parts


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--section", required=True)
    parser.add_argument("--face", required=True)
    parser.add_argument("--bounds", required=True)
    parser.add_argument("--scale", type=float, default=2.0)
    parser.add_argument("--grid-spacing", type=int, default=25)
    arguments = parser.parse_args()

    manifest_bytes = arguments.panorama_manifest.read_bytes()
    panorama = json.loads(manifest_bytes)
    section = next(
        record
        for record in panorama["sections"]
        if str(record["sectionId"]) == str(arguments.section)
    )
    source = next(
        record for record in section["images"] if str(record["face"]) == arguments.face
    )
    source_path = Path(source["localPath"])
    if sha256_file(source_path) != source["sha256"]:
        raise ValueError("Cube-face checksum mismatch")
    image = cv2.imread(str(source_path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Could not decode {source_path}")
    left, top, right, bottom = parse_bounds(arguments.bounds)
    if not (0 <= left < right <= image.shape[1] and 0 <= top < bottom <= image.shape[0]):
        raise ValueError("Bounds are outside the source image")
    if arguments.scale <= 0:
        raise ValueError("Scale must be positive")
    if arguments.grid_spacing <= 0:
        raise ValueError("Grid spacing must be positive")

    crop = image[top:bottom, left:right]
    enlarged = cv2.resize(
        crop,
        (
            int(round(crop.shape[1] * arguments.scale)),
            int(round(crop.shape[0] * arguments.scale)),
        ),
        interpolation=cv2.INTER_LANCZOS4,
    )
    margin_left = 86
    margin_top = 48
    canvas = np.zeros(
        (enlarged.shape[0] + margin_top, enlarged.shape[1] + margin_left, 3),
        dtype=np.uint8,
    )
    canvas[margin_top:, margin_left:] = enlarged
    overlay = canvas.copy()
    spacing = arguments.grid_spacing
    first_x = int(math.ceil(left / spacing) * spacing)
    for global_x in range(first_x, right, spacing):
        output_x = margin_left + int(round((global_x - left) * arguments.scale))
        cv2.line(
            overlay,
            (output_x, margin_top),
            (output_x, canvas.shape[0] - 1),
            (0, 0, 255),
            1,
        )
        cv2.putText(
            canvas,
            str(global_x),
            (max(margin_left, output_x - 18), 34),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.36,
            (0, 255, 255),
            1,
            cv2.LINE_AA,
        )
    first_y = int(math.ceil(top / spacing) * spacing)
    for global_y in range(first_y, bottom, spacing):
        output_y = margin_top + int(round((global_y - top) * arguments.scale))
        cv2.line(
            overlay,
            (margin_left, output_y),
            (canvas.shape[1] - 1, output_y),
            (0, 0, 255),
            1,
        )
        cv2.putText(
            canvas,
            str(global_y),
            (4, output_y + 4),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.36,
            (0, 255, 255),
            1,
            cv2.LINE_AA,
        )
    cv2.addWeighted(overlay, 0.22, canvas, 0.78, 0.0, canvas)

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    output_path = arguments.output_directory / (
        f"section-{arguments.section}-{arguments.face}-source-region-grid.png"
    )
    if not cv2.imwrite(str(output_path), canvas, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
        raise ValueError(f"Could not write {output_path}")
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama["artifactVersion"],
            "sourcePath": str(source_path.resolve()),
            "sourceSha256": source["sha256"],
        },
        "sectionId": str(arguments.section),
        "face": arguments.face,
        "sourceBoundsPixels": [left, top, right, bottom],
        "scale": arguments.scale,
        "resampling": "Lanczos diagnostic",
        "gridSpacingSourcePixels": spacing,
        "output": {
            "path": str(output_path.resolve()),
            "sha256": sha256_file(output_path),
            "width": canvas.shape[1],
            "height": canvas.shape[0],
        },
        "reviewStatus": "pending",
        "publicationEligible": False,
        "blockers": [
            "DIAGNOSTIC_REQUIRES_MANUAL_REVIEW",
            "ROW_IDENTITIES_NOT_ASSIGNED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "source-region-coordinate-grid",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "manifestPath": str(manifest_path),
                "artifactVersion": artifact["artifactVersion"],
                "outputPath": str(output_path),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
