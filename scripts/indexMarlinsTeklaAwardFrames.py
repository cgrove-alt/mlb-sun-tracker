#!/usr/bin/env python3
"""Build a checksum-locked visual index of the official Tekla Marlins BIM animation."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def build_contact_sheet(
    frames: list[dict[str, Any]],
    output: Path,
    title: str,
    columns: int,
    thumbnail_width: int,
) -> None:
    if not frames:
        raise ValueError("A contact sheet requires at least one frame")
    first = Image.open(frames[0]["thumbnailPath"])
    thumbnail_height = first.height
    first.close()
    label_height = 32
    title_height = 44
    rows = math.ceil(len(frames) / columns)
    canvas = Image.new(
        "RGB",
        (columns * thumbnail_width, title_height + rows * (thumbnail_height + label_height)),
        "white",
    )
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    draw.text((12, 14), title, fill="black", font=font)
    for index, record in enumerate(frames):
        row = index // columns
        column = index % columns
        x = column * thumbnail_width
        y = title_height + row * (thumbnail_height + label_height)
        with Image.open(record["thumbnailPath"]) as thumbnail:
            canvas.paste(thumbnail.convert("RGB"), (x, y))
        label = f"{record['sampleIndex']:03d}  {record['seconds']:.3f}s  frame {record['frameIndex']}"
        draw.text((x + 8, y + thumbnail_height + 9), label, fill="black", font=font)
    canvas.save(output, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("acquisition_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--interval-seconds", type=float, default=1.0)
    parser.add_argument("--thumbnail-width", type=int, default=384)
    parser.add_argument("--columns", type=int, default=5)
    parser.add_argument("--rows-per-sheet", type=int, default=4)
    arguments = parser.parse_args()
    if not 0.25 <= arguments.interval_seconds <= 5.0:
        raise ValueError("Interval must be from 0.25 through 5 seconds")
    if arguments.thumbnail_width < 320:
        raise ValueError("Thumbnail width must be at least 320 pixels")
    if arguments.columns < 1 or arguments.rows_per_sheet < 1:
        raise ValueError("Contact-sheet dimensions must be positive")

    acquisition_bytes = arguments.acquisition_manifest.read_bytes()
    acquisition = json.loads(acquisition_bytes)
    if acquisition.get("artifactKind") != "marlins-tekla-award-source-acquisition":
        raise ValueError("Input is not a Tekla award source acquisition manifest")
    video_record = acquisition["youtube"]["video"]
    video_path = Path(video_record["localPath"])
    if not video_path.is_absolute():
        video_path = Path.cwd() / video_path
    if video_path.stat().st_size != video_record["byteLength"]:
        raise ValueError("Tekla animation byte length changed")
    video_sha256 = sha256_file(video_path)
    if video_sha256 != video_record["sha256"]:
        raise ValueError("Tekla animation checksum changed")

    capture = cv2.VideoCapture(str(video_path))
    if not capture.isOpened():
        raise ValueError(f"OpenCV could not open {video_path}")
    fps = float(capture.get(cv2.CAP_PROP_FPS))
    frame_count = int(round(capture.get(cv2.CAP_PROP_FRAME_COUNT)))
    width = int(round(capture.get(cv2.CAP_PROP_FRAME_WIDTH)))
    height = int(round(capture.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    if not math.isfinite(fps) or fps <= 0 or min(frame_count, width, height) < 1:
        raise ValueError("Tekla animation metadata is invalid")
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

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    thumbnail_height = round(height / width * arguments.thumbnail_width)
    frames: list[dict[str, Any]] = []
    for sample_index, frame_index in enumerate(target_frames, start=1):
        capture.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        ok, bgr = capture.read()
        if not ok or bgr is None:
            raise ValueError(f"Could not decode frame {frame_index}")
        decoded_sha256 = hashlib.sha256(bgr.tobytes(order="C")).hexdigest()
        thumbnail = cv2.resize(
            bgr,
            (arguments.thumbnail_width, thumbnail_height),
            interpolation=cv2.INTER_AREA,
        )
        thumbnail_path = arguments.output_directory / f"sample-{sample_index:03d}.jpg"
        if not cv2.imwrite(
            str(thumbnail_path), thumbnail, [cv2.IMWRITE_JPEG_QUALITY, 95]
        ):
            raise ValueError(f"Could not write {thumbnail_path}")
        frames.append({
            "sampleIndex": sample_index,
            "frameIndex": frame_index,
            "seconds": round(frame_index / fps, 6),
            "decodedPixelsSha256": decoded_sha256,
            "thumbnailPath": str(thumbnail_path.resolve()),
            "thumbnailSha256": sha256_file(thumbnail_path),
        })
    capture.release()

    per_sheet = arguments.columns * arguments.rows_per_sheet
    contact_sheets: list[dict[str, Any]] = []
    for sheet_index, start in enumerate(range(0, len(frames), per_sheet), start=1):
        subset = frames[start : start + per_sheet]
        sheet_path = arguments.output_directory / f"contact-sheet-{sheet_index:02d}.png"
        build_contact_sheet(
            subset,
            sheet_path,
            f"Official Tekla Marlins BIM animation samples {subset[0]['sampleIndex']}-{subset[-1]['sampleIndex']}",
            arguments.columns,
            arguments.thumbnail_width,
        )
        contact_sheets.append({
            "sheetIndex": sheet_index,
            "firstSampleIndex": subset[0]["sampleIndex"],
            "lastSampleIndex": subset[-1]["sampleIndex"],
            "path": str(sheet_path.resolve()),
            "sha256": sha256_file(sheet_path),
        })

    stable = {
        "schemaVersion": 1,
        "analysisVersion": "marlins-tekla-award-frame-review-index-v1",
        "artifactKind": "marlins-tekla-award-frame-review-index",
        "inputs": {
            "acquisitionManifestPath": str(arguments.acquisition_manifest.resolve()),
            "acquisitionManifestSha256": hashlib.sha256(acquisition_bytes).hexdigest(),
            "acquisitionArtifactVersion": acquisition["artifactVersion"],
            "videoPath": str(video_path.resolve()),
            "videoSha256": video_sha256,
            "contactSheets": [
                {"path": sheet["path"], "sha256": sheet["sha256"]}
                for sheet in contact_sheets
            ],
        },
        "videoMetadata": {
            "fps": fps,
            "frameCount": frame_count,
            "durationSeconds": duration_seconds,
            "width": width,
            "height": height,
        },
        "sampling": {
            "intervalSeconds": arguments.interval_seconds,
            "decodedFrameSelection": "nearest integer frame index at each interval midpoint",
            "thumbnailWidth": arguments.thumbnail_width,
            "decodedPixelHash": "SHA-256 of full-resolution BGR bytes returned by OpenCV",
        },
        "sampleCount": len(frames),
        "frames": frames,
        "contactSheets": contact_sheets,
        "publicationEligible": False,
        "blockers": [
            "VISUAL_CONTENT_REVIEW_REQUIRED",
            "NATIVE_MODEL_FILE_NOT_LOCATED",
            "MODEL_COORDINATE_REFERENCE_NOT_LOCATED",
            "CURRENT_GEOMETRY_NOT_ESTABLISHED",
            "MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED",
        ],
    }
    manifest = {**stable, "artifactVersion": artifact_version(stable)}
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(manifest_path),
        "artifactVersion": manifest["artifactVersion"],
        "sampleCount": len(frames),
        "videoMetadata": manifest["videoMetadata"],
        "contactSheets": contact_sheets,
    }, indent=2))


if __name__ == "__main__":
    main()
