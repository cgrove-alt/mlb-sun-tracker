#!/usr/bin/env python3
"""Render native-source review crops for an explicit candidate-ID subset."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "sportsdigita-explicit-candidate-subset-review-v2"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def parse_csv(value: str) -> list[str]:
    return [part.strip() for part in value.split(",") if part.strip()]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("candidate_manifest", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--candidate-ids", required=True)
    parser.add_argument("--radius", type=int, default=90)
    parser.add_argument("--scale", type=float, default=1.0)
    arguments = parser.parse_args()
    candidate_bytes = arguments.candidate_manifest.read_bytes()
    panorama_bytes = arguments.panorama_manifest.read_bytes()
    candidate_artifact = json.loads(candidate_bytes)
    panorama = json.loads(panorama_bytes)
    if candidate_artifact.get("analysisVersion") != "sportsdigita-seat-badge-candidates-v1":
        raise ValueError("Candidate manifest uses an unsupported analysis version")
    if candidate_artifact["sourceManifest"]["sha256"] != hashlib.sha256(panorama_bytes).hexdigest():
        raise ValueError("Panorama SHA-256 does not match the candidate manifest")
    requested = parse_csv(arguments.candidate_ids)
    candidate_lookup: dict[str, tuple[dict[str, Any], dict[str, Any]]] = {}
    for image_record in candidate_artifact["images"]:
        for candidate in image_record["candidates"]:
            candidate_lookup[candidate["candidateId"]] = (candidate, image_record)
    missing = sorted(set(requested) - set(candidate_lookup))
    if missing:
        raise ValueError(f"Candidate IDs are absent: {missing}")
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    outputs: list[dict[str, Any]] = []
    tiles: list[np.ndarray] = []
    for candidate_id in requested:
        candidate, image_record = candidate_lookup[candidate_id]
        path = Path(image_record["sourcePath"])
        if sha256_file(path) != image_record["sourceSha256"]:
            raise ValueError(f"Candidate source checksum mismatch: {path}")
        image = cv2.imread(str(path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode {path}")
        center_x, center_y = (float(value) for value in candidate["centerPixel"])
        left = max(0, int(round(center_x)) - arguments.radius)
        top = max(0, int(round(center_y)) - arguments.radius)
        right = min(image.shape[1], int(round(center_x)) + arguments.radius)
        bottom = min(image.shape[0], int(round(center_y)) + arguments.radius)
        crop = image[top:bottom, left:right].copy()
        if arguments.scale != 1.0:
            crop = cv2.resize(
                crop,
                (
                    int(round(crop.shape[1] * arguments.scale)),
                    int(round(crop.shape[0] * arguments.scale)),
                ),
                interpolation=cv2.INTER_LANCZOS4,
            )
        marker = (
            int(round((center_x - left) * arguments.scale)),
            int(round((center_y - top) * arguments.scale)),
        )
        cv2.drawMarker(crop, marker, (0, 0, 255), cv2.MARKER_CROSS, 15, 2)
        output_path = arguments.output_directory / f"{candidate_id}-review.png"
        if not cv2.imwrite(str(output_path), crop, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
            raise ValueError(f"Could not write {output_path}")
        title_height = 28
        tile = np.zeros((crop.shape[0] + title_height, crop.shape[1], 3), dtype=np.uint8)
        tile[title_height:, :] = crop
        cv2.putText(
            tile,
            candidate_id,
            (3, 19),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.38,
            (0, 255, 255),
            1,
            cv2.LINE_AA,
        )
        tiles.append(tile)
        outputs.append(
            {
                "candidateId": candidate_id,
                "face": image_record["face"],
                "sourcePath": str(path.resolve()),
                "sourceSha256": image_record["sourceSha256"],
                "candidatePixel": candidate["centerPixel"],
                "sourceBoundsPixels": [left, top, right, bottom],
                "path": str(output_path.resolve()),
                "sha256": sha256_file(output_path),
                "candidatePointColor": "red",
                "resampling": (
                    "none"
                    if arguments.scale == 1.0
                    else f"Lanczos diagnostic at {arguments.scale:g}x"
                ),
            }
        )
    tile_height = max(tile.shape[0] for tile in tiles)
    tile_width = max(tile.shape[1] for tile in tiles)
    columns = 5
    row_count = max(1, math.ceil(len(tiles) / columns))
    sheet = np.zeros((row_count * tile_height, columns * tile_width, 3), dtype=np.uint8)
    for index, tile in enumerate(tiles):
        row = index // columns
        column = index % columns
        sheet[row * tile_height : row * tile_height + tile.shape[0], column * tile_width : column * tile_width + tile.shape[1]] = tile
    sheet_path = arguments.output_directory / "candidate-subset-review.png"
    if not cv2.imwrite(str(sheet_path), sheet, [cv2.IMWRITE_PNG_COMPRESSION, 5]):
        raise ValueError(f"Could not write {sheet_path}")
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "candidateManifestPath": str(arguments.candidate_manifest),
            "candidateManifestSha256": hashlib.sha256(candidate_bytes).hexdigest(),
            "candidateArtifactVersion": candidate_artifact["artifactVersion"],
            "panoramaManifestPath": str(arguments.panorama_manifest),
            "panoramaManifestSha256": hashlib.sha256(panorama_bytes).hexdigest(),
            "panoramaArtifactVersion": panorama["artifactVersion"],
        },
        "requestedCandidateIds": requested,
        "outputs": outputs,
        "reviewSheet": {
            "path": str(sheet_path.resolve()),
            "sha256": sha256_file(sheet_path),
            "resampling": (
                "none"
                if arguments.scale == 1.0
                else f"Lanczos diagnostic at {arguments.scale:g}x"
            ),
        },
        "publicationEligible": False,
        "blockers": [
            "CANDIDATE_SUBSET_REQUIRES_MANUAL_NUMBER_AND-TIER_REVIEW",
            "ROW_IDENTITIES_NOT_ASSIGNED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "explicit-candidate-subset-review",
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
                "outputCount": len(outputs),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
