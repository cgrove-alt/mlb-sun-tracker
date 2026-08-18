#!/usr/bin/env python3
"""Extract exact indexed video frames without a browser or external ffmpeg CLI."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import cv2


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("seconds", type=float, nargs="*")
    parser.add_argument("--interval-seconds", type=float)
    parser.add_argument("--manifest", type=Path)
    arguments = parser.parse_args()
    capture = cv2.VideoCapture(str(arguments.input))
    if not capture.isOpened():
        raise ValueError(f"Could not open {arguments.input}")
    fps = float(capture.get(cv2.CAP_PROP_FPS))
    frame_count = int(round(capture.get(cv2.CAP_PROP_FRAME_COUNT)))
    width = int(round(capture.get(cv2.CAP_PROP_FRAME_WIDTH)))
    height = int(round(capture.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    duration = frame_count / fps
    if bool(arguments.seconds) == (arguments.interval_seconds is not None):
        raise ValueError("Provide explicit seconds or --interval-seconds, but not both")
    if arguments.interval_seconds is not None:
        if not 0.25 <= arguments.interval_seconds <= 30:
            raise ValueError("Interval must be from 0.25 through 30 seconds")
        requested = []
        seconds = arguments.interval_seconds / 2.0
        while seconds < duration:
            requested.append(seconds)
            seconds += arguments.interval_seconds
        selection = "nearest integer frame index to each interval midpoint"
    else:
        requested = sorted(set(arguments.seconds))
        selection = "nearest integer frame index to each requested second"
    if any(value < 0 or value >= duration for value in requested):
        raise ValueError(f"Requested seconds must be in [0, {duration})")
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    frames = []
    for index, seconds in enumerate(requested, start=1):
        frame_index = max(0, min(frame_count - 1, int(round(seconds * fps))))
        capture.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        ok, bgr = capture.read()
        if not ok or bgr is None:
            raise ValueError(f"Could not decode frame {frame_index}")
        actual_seconds = frame_index / fps
        output = arguments.output_directory / f"frame-{index:02d}-{actual_seconds:06.2f}s.png"
        if not cv2.imwrite(str(output), bgr, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
            raise ValueError(f"Could not write {output}")
        frames.append(
            {
                "requestedSeconds": seconds,
                "frameIndex": frame_index,
                "actualSeconds": actual_seconds,
                "file": str(output.resolve()),
                "decodedPixelsSha256": hashlib.sha256(bgr.tobytes(order="C")).hexdigest(),
                "fileSha256": sha256_file(output),
            }
        )
    capture.release()
    manifest = {
        "schemaVersion": 1,
        "input": str(arguments.input.resolve()),
        "inputSha256": sha256_file(arguments.input),
        "videoMetadata": {
            "fps": fps,
            "frameCount": frame_count,
            "durationSeconds": duration,
            "width": width,
            "height": height,
        },
        "selection": selection,
        "frames": frames,
    }
    if arguments.manifest:
        arguments.manifest.parent.mkdir(parents=True, exist_ok=True)
        arguments.manifest.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
