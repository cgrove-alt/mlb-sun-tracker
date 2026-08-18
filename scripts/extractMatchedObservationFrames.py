#!/usr/bin/env python3
"""Decode exact full-resolution frames selected by a camera review queue."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("review_queue", type=Path)
    parser.add_argument("frame_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    arguments = parser.parse_args()

    review_bytes = arguments.review_queue.read_bytes()
    frame_bytes = arguments.frame_manifest.read_bytes()
    review = json.loads(review_bytes)
    manifest = json.loads(frame_bytes)
    candidates = {item["candidateIndex"]: item for item in manifest["candidates"]}
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    extracted: list[dict[str, Any]] = []
    for selected in review["manualReviewQueue"]:
        candidate = candidates[selected["candidateIndex"]]
        if candidate["candidateId"] != selected["candidateId"]:
            raise ValueError("Candidate identity differs between review and frame manifests")
        indexed = next(
            item for item in candidate["frames"] if item["sampleIndex"] == selected["sampleIndex"]
        )
        if indexed["frameIndex"] != selected["frameIndex"]:
            raise ValueError("Frame index differs between review and frame manifests")
        video_path = Path(candidate["videoPath"])
        if sha256_file(video_path) != candidate["videoSha256"]:
            raise ValueError(f"Video checksum changed: {video_path}")
        capture = cv2.VideoCapture(str(video_path))
        if not capture.isOpened():
            raise ValueError(f"Could not open {video_path}")
        capture.set(cv2.CAP_PROP_POS_FRAMES, indexed["frameIndex"])
        ok, bgr = capture.read()
        capture.release()
        if not ok or bgr is None:
            raise ValueError(f"Could not decode frame {indexed['frameIndex']} from {video_path}")
        decoded_sha256 = hashlib.sha256(bgr.tobytes(order="C")).hexdigest()
        if decoded_sha256 != indexed["decodedPixelsSha256"]:
            raise ValueError("Full-resolution decoded pixel hash differs from the dense index")
        output_path = arguments.output_directory / (
            f"{selected['candidateIndex']:03d}-{selected['sampleIndex']:03d}.png"
        )
        if not cv2.imwrite(str(output_path), bgr, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
            raise ValueError(f"Could not write {output_path}")
        extracted.append(
            {
                "candidateIndex": selected["candidateIndex"],
                "candidateId": selected["candidateId"],
                "eventMidpointTime": selected["eventMidpointTime"],
                "solarPosition": selected["solarPosition"],
                "sampleIndex": selected["sampleIndex"],
                "frameIndex": selected["frameIndex"],
                "seconds": selected["seconds"],
                "videoPath": str(video_path),
                "videoSha256": candidate["videoSha256"],
                "decodedPixelsSha256": decoded_sha256,
                "outputPath": str(output_path),
                "outputPngSha256": sha256_file(output_path),
                "width": int(bgr.shape[1]),
                "height": int(bgr.shape[0]),
            }
        )
    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "exact-indexed-full-frame-extraction-v1",
        "artifactStage": "official-mlb-full-resolution-shadow-observation-review",
        "inputs": {
            "reviewQueuePath": str(arguments.review_queue),
            "reviewQueueSha256": hashlib.sha256(review_bytes).hexdigest(),
            "frameManifestPath": str(arguments.frame_manifest),
            "frameManifestSha256": hashlib.sha256(frame_bytes).hexdigest(),
        },
        "frames": extracted,
        "frameCount": len(extracted),
        "publicationEligible": False,
        "blockers": [
            "FULL_RESOLUTION_FRAMES_REQUIRE_VISUAL_REVIEW",
            "ROW_BANK_REGISTRATION_NOT_ESTABLISHED",
            "SHADOW_BOUNDARIES_NOT_LABELED",
        ],
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    output_manifest = arguments.output_directory / "manifest.json"
    output_manifest.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputManifest": str(output_manifest),
                "artifactVersion": artifact["artifactVersion"],
                "frameCount": len(extracted),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
