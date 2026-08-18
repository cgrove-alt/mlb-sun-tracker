#!/usr/bin/env python3
"""Build a checksum-locked visual index of an official MLB condensed game."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np


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
    parser.add_argument("acquisition_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--interval-seconds", type=float, default=0.5)
    parser.add_argument("--thumbnail-width", type=int, default=640)
    arguments = parser.parse_args()
    if not 0.25 <= arguments.interval_seconds <= 2.0:
        raise ValueError("Interval must be from 0.25 through 2 seconds")
    if arguments.thumbnail_width < 320:
        raise ValueError("Thumbnail width must be at least 320 pixels")

    acquisition_bytes = arguments.acquisition_manifest.read_bytes()
    acquisition = json.loads(acquisition_bytes)
    if acquisition.get("artifactStage") != "official-mlb-condensed-game-corpus":
        raise ValueError("Input is not an MLB condensed-game acquisition manifest")
    video_path = Path(acquisition["video"]["path"])
    if video_path.stat().st_size != acquisition["video"]["byteLength"]:
        raise ValueError("Condensed-game byte length changed")
    video_sha256 = sha256_file(video_path)
    if video_sha256 != acquisition["video"]["sha256"]:
        raise ValueError("Condensed-game checksum changed")

    capture = cv2.VideoCapture(str(video_path))
    if not capture.isOpened():
        raise ValueError(f"OpenCV could not open {video_path}")
    fps = float(capture.get(cv2.CAP_PROP_FPS))
    frame_count = int(round(capture.get(cv2.CAP_PROP_FRAME_COUNT)))
    width = int(round(capture.get(cv2.CAP_PROP_FRAME_WIDTH)))
    height = int(round(capture.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    if not math.isfinite(fps) or fps <= 0 or min(frame_count, width, height) < 1:
        raise ValueError("Condensed-game video metadata is invalid")
    duration_seconds = frame_count / fps
    requested_seconds = np.arange(
        min(arguments.interval_seconds / 2, duration_seconds / 2),
        duration_seconds,
        arguments.interval_seconds,
    )
    target_frames = sorted({
        max(0, min(frame_count - 1, int(round(float(seconds) * fps))))
        for seconds in requested_seconds
    })
    target_set = set(target_frames)
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    frames: list[dict[str, Any]] = []
    frame_index = 0
    while frame_index < frame_count:
        ok = capture.grab()
        if not ok:
            break
        if frame_index in target_set:
            ok, bgr = capture.retrieve()
            if not ok or bgr is None:
                raise ValueError(f"Could not decode frame {frame_index}")
            decoded_sha256 = hashlib.sha256(bgr.tobytes(order="C")).hexdigest()
            thumbnail_height = round(height / width * arguments.thumbnail_width)
            thumbnail = cv2.resize(
                bgr,
                (arguments.thumbnail_width, thumbnail_height),
                interpolation=cv2.INTER_AREA,
            )
            sample_index = len(frames) + 1
            thumbnail_path = arguments.output_directory / f"sample-{sample_index:04d}.jpg"
            if not cv2.imwrite(
                str(thumbnail_path), thumbnail, [cv2.IMWRITE_JPEG_QUALITY, 94]
            ):
                raise ValueError(f"Could not write {thumbnail_path}")
            frames.append({
                "sampleIndex": sample_index,
                "frameIndex": frame_index,
                "condensedTimelineSeconds": round(frame_index / fps, 6),
                "decodedPixelsSha256": decoded_sha256,
                "thumbnailPath": str(thumbnail_path.resolve()),
                "thumbnailSha256": sha256_file(thumbnail_path),
            })
        frame_index += 1
    capture.release()
    if len(frames) != len(target_frames):
        raise ValueError(
            f"Decoded {len(frames)} samples but expected {len(target_frames)}"
        )

    manifest_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "sequential-condensed-timeline-index-v1",
        "artifactStage": "official-mlb-condensed-game-frame-review-index",
        "inputs": {
            "acquisitionManifestPath": str(arguments.acquisition_manifest.resolve()),
            "acquisitionManifestSha256": hashlib.sha256(acquisition_bytes).hexdigest(),
            "acquisitionArtifactVersion": acquisition["artifactVersion"],
            "videoPath": str(video_path.resolve()),
            "videoSha256": video_sha256,
        },
        "gamePk": acquisition["gamePk"],
        "videoMetadata": {
            "fps": fps,
            "frameCount": frame_count,
            "durationSeconds": duration_seconds,
            "width": width,
            "height": height,
        },
        "sampling": {
            "intervalSeconds": arguments.interval_seconds,
            "decodedFrameSelection": "nearest integer frame at each interval midpoint",
            "thumbnailWidth": arguments.thumbnail_width,
            "decodedPixelHash": "SHA-256 of full-resolution BGR bytes returned by OpenCV",
        },
        "sampleCount": len(frames),
        "frames": frames,
        "publicationEligible": False,
        "blockers": [
            "CONDENSED_TIMELINE_IS_NOT_THE_ORIGINAL_BROADCAST_TIMELINE",
            "EACH_FRAME_REQUIRES_EXACT_PLAY_BY_PLAY_IDENTITY",
            "SECTION_AND_ROW_REGISTRATION_REQUIRED",
            "SHADOW_BOUNDARY_LABEL_REQUIRED",
        ],
    }
    manifest = {
        **manifest_without_version,
        "artifactVersion": artifact_version(manifest_without_version),
    }
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(manifest_path),
        "artifactVersion": manifest["artifactVersion"],
        "sampleCount": len(frames),
        "videoMetadata": manifest["videoMetadata"],
    }, indent=2))


if __name__ == "__main__":
    main()
