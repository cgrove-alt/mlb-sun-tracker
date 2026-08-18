#!/usr/bin/env python3
"""Build a dense, reproducible visual index of official MLB observation clips."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image, ImageDraw


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    serialized = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(serialized).hexdigest()}"


def render_sheet(
    frames: list[dict[str, Any]], output: Path, title: str, columns: int, thumbnail_width: int
) -> None:
    if not frames:
        return
    first = Image.open(frames[0]["thumbnailPath"])
    thumbnail_height = round(first.height / first.width * thumbnail_width)
    label_height = 42
    title_height = 48
    rows = math.ceil(len(frames) / columns)
    sheet = Image.new(
        "RGB",
        (columns * thumbnail_width, title_height + rows * (thumbnail_height + label_height)),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    draw.text((10, 15), title, fill="black")
    for index, record in enumerate(frames):
        image = Image.open(record["thumbnailPath"]).convert("RGB")
        image.thumbnail((thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS)
        column = index % columns
        row = index // columns
        x_value = column * thumbnail_width
        y_value = title_height + row * (thumbnail_height + label_height)
        sheet.paste(image, (x_value, y_value + label_height))
        draw.text(
            (x_value + 6, y_value + 5),
            f"{record['sampleIndex']:03d}  {record['seconds']:.2f}s  {record['decodedPixelsSha256'][:10]}",
            fill="black",
        )
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="JPEG", quality=92, optimize=True, progressive=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("corpus_manifest", type=Path)
    parser.add_argument("candidates", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--interval-seconds", type=float, default=0.5)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--thumbnail-width", type=int, default=480)
    arguments = parser.parse_args()
    if arguments.interval_seconds <= 0 or arguments.interval_seconds > 2:
        raise ValueError("Interval must be greater than zero and no more than two seconds")
    if arguments.columns < 1 or arguments.thumbnail_width < 240:
        raise ValueError("Invalid contact-sheet dimensions")

    corpus_bytes = arguments.corpus_manifest.read_bytes()
    candidates_bytes = arguments.candidates.read_bytes()
    corpus = json.loads(corpus_bytes)
    candidates_artifact = json.loads(candidates_bytes)
    candidates = candidates_artifact["candidates"]
    acquired = corpus["acquired"]
    if len(acquired) != len(candidates):
        raise ValueError("Corpus and candidate counts differ")
    arguments.output_directory.mkdir(parents=True, exist_ok=True)

    indexed: list[dict[str, Any]] = []
    unavailable: list[dict[str, Any]] = []
    total_samples = 0
    for candidate_index, (video_record, candidate) in enumerate(zip(acquired, candidates)):
        if video_record["candidateId"] != candidate["candidateId"]:
            raise ValueError(f"Candidate order mismatch at index {candidate_index}")
        if video_record.get("status") == "unavailable":
            unavailable.append(
                {
                    "candidateIndex": candidate_index + 1,
                    "candidateId": candidate["candidateId"],
                    "reason": video_record.get("unavailableReason", "UNSPECIFIED"),
                }
            )
            print(f"{candidate_index + 1:03d}/{len(candidates)} unavailable")
            continue
        if video_record.get("status") != "acquired":
            raise ValueError(f"Unexpected corpus status at index {candidate_index}")
        video_path = Path(video_record["output"])
        if video_path.stat().st_size != video_record["byteLength"]:
            raise ValueError(f"Video size mismatch: {video_path}")
        actual_video_sha256 = sha256_file(video_path)
        if actual_video_sha256 != video_record["sha256"]:
            raise ValueError(f"Video checksum mismatch: {video_path}")

        capture = cv2.VideoCapture(str(video_path))
        if not capture.isOpened():
            raise ValueError(f"OpenCV could not open {video_path}")
        fps = float(capture.get(cv2.CAP_PROP_FPS))
        frame_count = int(round(capture.get(cv2.CAP_PROP_FRAME_COUNT)))
        width = int(round(capture.get(cv2.CAP_PROP_FRAME_WIDTH)))
        height = int(round(capture.get(cv2.CAP_PROP_FRAME_HEIGHT)))
        if not math.isfinite(fps) or fps <= 0 or frame_count < 1 or width < 1 or height < 1:
            raise ValueError(f"Invalid video metadata: {video_path}")
        duration_seconds = frame_count / fps
        requested_seconds = np.arange(
            min(arguments.interval_seconds / 2, duration_seconds / 2),
            duration_seconds,
            arguments.interval_seconds,
        )
        target_frames = sorted(
            {max(0, min(frame_count - 1, int(round(float(seconds) * fps)))) for seconds in requested_seconds}
        )
        candidate_directory = arguments.output_directory / f"{candidate_index + 1:03d}"
        candidate_directory.mkdir(parents=True, exist_ok=True)
        frames: list[dict[str, Any]] = []
        for sample_index, frame_index in enumerate(target_frames, start=1):
            capture.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
            ok, bgr = capture.read()
            if not ok or bgr is None:
                raise ValueError(f"Could not decode frame {frame_index} from {video_path}")
            decoded_sha256 = hashlib.sha256(bgr.tobytes(order="C")).hexdigest()
            thumbnail = cv2.resize(
                bgr,
                (
                    arguments.thumbnail_width,
                    round(height / width * arguments.thumbnail_width),
                ),
                interpolation=cv2.INTER_AREA,
            )
            thumbnail_path = candidate_directory / f"sample-{sample_index:03d}.jpg"
            if not cv2.imwrite(
                str(thumbnail_path), thumbnail, [cv2.IMWRITE_JPEG_QUALITY, 92]
            ):
                raise ValueError(f"Could not write {thumbnail_path}")
            frames.append(
                {
                    "sampleIndex": sample_index,
                    "frameIndex": frame_index,
                    "seconds": round(frame_index / fps, 6),
                    "decodedPixelsSha256": decoded_sha256,
                    "thumbnailPath": str(thumbnail_path.resolve()),
                    "thumbnailSha256": sha256_file(thumbnail_path),
                }
            )
        capture.release()
        sheet_path = candidate_directory / "review-sheet.jpg"
        render_sheet(
            frames,
            sheet_path,
            f"{candidate_index + 1:03d} {candidate['event']['midpointTime']}  {candidate['video']['title']}",
            arguments.columns,
            arguments.thumbnail_width,
        )
        indexed.append(
            {
                "candidateIndex": candidate_index + 1,
                "candidateId": candidate["candidateId"],
                "eventMidpointTime": candidate["event"]["midpointTime"],
                "eventWindowSeconds": candidate["event"]["eventWindowSeconds"],
                "solarPosition": candidate["solarPositionAtMidpoint"],
                "videoPath": str(video_path.resolve()),
                "videoSha256": actual_video_sha256,
                "videoMetadata": {
                    "fps": fps,
                    "frameCount": frame_count,
                    "durationSeconds": duration_seconds,
                    "width": width,
                    "height": height,
                },
                "reviewSheetPath": str(sheet_path.resolve()),
                "reviewSheetSha256": sha256_file(sheet_path),
                "frames": frames,
            }
        )
        total_samples += len(frames)
        print(f"{candidate_index + 1:03d}/{len(candidates)} indexed {len(frames)} samples")

    manifest_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "dense-video-index-v2",
        "artifactStage": "official-mlb-observation-frame-review-index",
        "stadiumId": candidates_artifact.get("stadiumId"),
        "inputs": {
            "corpusManifestPath": str(arguments.corpus_manifest.resolve()),
            "corpusManifestSha256": hashlib.sha256(corpus_bytes).hexdigest(),
            "candidatesPath": str(arguments.candidates.resolve()),
            "candidatesSha256": hashlib.sha256(candidates_bytes).hexdigest(),
        },
        "sampling": {
            "intervalSeconds": arguments.interval_seconds,
            "decodedFrameSelection": "nearest integer frame index at each interval midpoint",
            "decodedPixelHash": "SHA-256 of full-resolution BGR bytes returned by OpenCV",
            "reviewThumbnail": "JPEG quality 92, used only to locate frames for full-resolution review",
        },
        "sourceCandidateCount": len(candidates),
        "candidateCount": len(indexed),
        "unavailableCount": len(unavailable),
        "unavailable": unavailable,
        "totalSampleCount": total_samples,
        "candidates": indexed,
        "publicationEligible": False,
        "note": "This index is a review aid. No frame is accepted as a shadow observation without separate provenance, section, boundary, and visibility review.",
    }
    manifest = {
        **manifest_without_version,
        "artifactVersion": artifact_version(manifest_without_version),
    }
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "manifestPath": str(manifest_path),
                "artifactVersion": manifest["artifactVersion"],
                "candidateCount": len(indexed),
                "unavailableCount": len(unavailable),
                "totalSampleCount": total_samples,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
