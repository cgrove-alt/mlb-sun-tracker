#!/usr/bin/env python3
"""Render native-pixel coordinate grids for manual cubemap control review."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "sportsdigita-control-coordinate-grids-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_seats(value: str) -> set[str]:
    return {part.strip() for part in value.split(",") if part.strip()}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("projection_manifest", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--seat-labels", default="8,10,13,18,21,23,24")
    parser.add_argument("--radius", type=int, default=45)
    parser.add_argument("--scale", type=int, default=7)
    parser.add_argument("--grid-spacing", type=int, default=5)
    arguments = parser.parse_args()

    projection_bytes = arguments.projection_manifest.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    projection = json.loads(projection_bytes)
    panorama = json.loads(panorama_bytes)
    if projection.get("analysisVersion") != "sportsdigita-cubemap-row-projection-review-v1":
        raise ValueError("Projection manifest uses an unsupported analysis version")
    if projection["inputs"]["panoramaManifestSha256"] != hashlib.sha256(panorama_bytes).hexdigest():
        raise ValueError("Panorama manifest SHA-256 does not match the projection")
    section_id = str(projection["sectionId"])
    source_section = next(
        record for record in panorama["sections"] if str(record["sectionId"]) == section_id
    )
    images: dict[str, tuple[np.ndarray, dict[str, Any]]] = {}
    for record in source_section["images"]:
        path = Path(record["localPath"])
        if sha256_file(path) != record["sha256"]:
            raise ValueError(f"Cube-face checksum mismatch: {path}")
        image = cv2.imread(str(path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode {path}")
        images[str(record["face"])] = (image, record)

    requested_seats = parse_seats(arguments.seat_labels)
    queued = [
        record
        for record in projection["projectedSeats"]
        if str(record["seatLabel"]) in requested_seats
    ]
    if {str(record["seatLabel"]) for record in queued} != requested_seats:
        raise ValueError("At least one requested seat is absent from the projection")
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    output_records: list[dict[str, Any]] = []
    for seat in queued:
        image, source = images[str(seat["face"])]
        center_x, center_y = (float(value) for value in seat["pixel"])
        left = max(0, int(math.floor(center_x)) - arguments.radius)
        top = max(0, int(math.floor(center_y)) - arguments.radius)
        right = min(image.shape[1], int(math.floor(center_x)) + arguments.radius)
        bottom = min(image.shape[0], int(math.floor(center_y)) + arguments.radius)
        crop = image[top:bottom, left:right]
        enlarged = cv2.resize(
            crop,
            (crop.shape[1] * arguments.scale, crop.shape[0] * arguments.scale),
            interpolation=cv2.INTER_NEAREST,
        )
        margin_left = 78
        margin_top = 54
        canvas = np.zeros(
            (enlarged.shape[0] + margin_top, enlarged.shape[1] + margin_left, 3),
            dtype=np.uint8,
        )
        canvas[margin_top:, margin_left:] = enlarged
        overlay = canvas.copy()
        spacing = arguments.grid_spacing
        first_x = int(math.ceil(left / spacing) * spacing)
        for global_x in range(first_x, right, spacing):
            output_x = margin_left + (global_x - left) * arguments.scale
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
                (max(margin_left, output_x - 18), 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.34,
                (0, 255, 255),
                1,
                cv2.LINE_AA,
            )
        first_y = int(math.ceil(top / spacing) * spacing)
        for global_y in range(first_y, bottom, spacing):
            output_y = margin_top + (global_y - top) * arguments.scale
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
                (2, output_y + 4),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.34,
                (0, 255, 255),
                1,
                cv2.LINE_AA,
            )
        cv2.addWeighted(overlay, 0.32, canvas, 0.68, 0.0, canvas)
        predicted_output = (
            margin_left + int(round((center_x - left) * arguments.scale)),
            margin_top + int(round((center_y - top) * arguments.scale)),
        )
        cv2.drawMarker(canvas, predicted_output, (0, 255, 0), cv2.MARKER_CROSS, 25, 2)
        output_path = arguments.output_directory / (
            f"section-{section_id}-{seat['rowKey'].replace(':', '-')}-seat-"
            f"{seat['seatLabel']}-{seat['face']}-coordinate-grid.png"
        )
        if not cv2.imwrite(str(output_path), canvas, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
            raise ValueError(f"Could not write {output_path}")
        output_records.append(
            {
                "rowKey": seat["rowKey"],
                "seatLabel": str(seat["seatLabel"]),
                "face": seat["face"],
                "projectedPixel": seat["pixel"],
                "sourcePath": str(Path(source["localPath"]).resolve()),
                "sourceSha256": source["sha256"],
                "sourceBoundsPixels": [left, top, right, bottom],
                "nearestNeighborScale": arguments.scale,
                "gridSpacingSourcePixels": spacing,
                "predictedPointColor": "green",
                "path": str(output_path.resolve()),
                "sha256": sha256_file(output_path),
            }
        )
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "projectionManifestPath": str(arguments.projection_manifest),
            "projectionManifestSha256": hashlib.sha256(projection_bytes).hexdigest(),
            "projectionArtifactVersion": projection["artifactVersion"],
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama["artifactVersion"],
        },
        "sectionId": section_id,
        "reviewPolicy": {
            "sourceResampling": "nearest-neighbor diagnostic only",
            "gridSpacingSourcePixels": arguments.grid_spacing,
            "manualControlRequiresSeparateReviewedArtifact": True,
            "automaticControlSelection": False,
        },
        "outputs": output_records,
        "publicationEligible": False,
        "blockers": [
            "DIAGNOSTIC_REQUIRES_MANUAL_REVIEW",
            "CONTROL_PARTITIONS_NOT_DECLARED",
            "ROW_COVERAGE_INCOMPLETE",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "manual-control-coordinate-grid-diagnostics",
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
                "outputCount": len(output_records),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
