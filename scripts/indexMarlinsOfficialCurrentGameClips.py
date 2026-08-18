#!/usr/bin/env python3
"""Build a checksum-locked frame index of dated official Marlins game clips."""

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


ARTICLE_HEADLINE = (
    "Alcantara continues torrid pace; Marlins express instant regret over decision to remove him"
)
ARTICLE_PUBLISHED = "2026-04-08T04:51:04.302Z"
GAME_DATE = "2026-04-07"
OFFICIAL_CLIPS = (
    {
        "id": "d6c41cd4",
        "title": "Marlins discuss taking Alcantara out in the 9th",
        "url": "https://mlb-cuts-diamond.mlb.com/FORGE/2026/2026-04/07/d6c41cd4-e0aafac5-0f1a0d89-csvm-diamondgcp-asset_1280x720_59_4000K.mp4",
    },
    {
        "id": "4fefb8e9",
        "title": "Sandy Alacantra sets down six Reds",
        "url": "https://mlb-cuts-diamond.mlb.com/FORGE/2026/2026-04/07/4fefb8e9-07515a86-158bee3f-csvm-diamondgcp-asset_1280x720_59_4000K.mp4",
    },
    {
        "id": "d88207b6",
        "title": "Matt McLain's two-run double",
        "url": "https://mlb-cuts-diamond.mlb.com/FORGE/2026/2026-04/07/d88207b6-a4dd1e55-350ba0de-csvm-diamondgcp-asset_1280x720_59_4000K.mp4",
    },
)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def resolve_clip(video_directory: Path, clip_id: str) -> Path:
    matches = sorted(video_directory.glob(f"recap-2026-04-08-{clip_id}*.mp4"))
    if len(matches) != 1:
        raise ValueError(
            f"Expected exactly one downloaded clip for {clip_id}; found {len(matches)}"
        )
    return matches[0]


def build_contact_sheet(
    frames: list[dict[str, Any]],
    output: Path,
    title: str,
    columns: int,
    thumbnail_width: int,
) -> None:
    if not frames:
        raise ValueError("A contact sheet requires at least one frame")
    with Image.open(frames[0]["thumbnailPath"]) as first:
        thumbnail_height = first.height
    label_height = 30
    title_height = 46
    rows = math.ceil(len(frames) / columns)
    canvas = Image.new(
        "RGB",
        (columns * thumbnail_width, title_height + rows * (thumbnail_height + label_height)),
        "white",
    )
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    draw.text((12, 15), title, fill="black", font=font)
    for index, record in enumerate(frames):
        row = index // columns
        column = index % columns
        x = column * thumbnail_width
        y = title_height + row * (thumbnail_height + label_height)
        with Image.open(record["thumbnailPath"]) as thumbnail:
            canvas.paste(thumbnail.convert("RGB"), (x, y))
        label = (
            f"{record['sampleIndex']:03d}  {record['seconds']:.3f}s  "
            f"frame {record['frameIndex']}"
        )
        draw.text((x + 7, y + thumbnail_height + 8), label, fill="black", font=font)
    canvas.save(output, format="PNG", optimize=True)


def index_clip(
    clip: dict[str, str],
    video_path: Path,
    output_directory: Path,
    interval_seconds: float,
    thumbnail_width: int,
    columns: int,
    rows_per_sheet: int,
) -> dict[str, Any]:
    capture = cv2.VideoCapture(str(video_path))
    if not capture.isOpened():
        raise ValueError(f"OpenCV could not open {video_path}")
    fps = float(capture.get(cv2.CAP_PROP_FPS))
    frame_count = int(round(capture.get(cv2.CAP_PROP_FRAME_COUNT)))
    width = int(round(capture.get(cv2.CAP_PROP_FRAME_WIDTH)))
    height = int(round(capture.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    if not math.isfinite(fps) or fps <= 0 or min(frame_count, width, height) < 1:
        raise ValueError(f"Video metadata is invalid for {video_path}")
    duration_seconds = frame_count / fps
    requested_seconds = np.arange(
        min(interval_seconds / 2, duration_seconds / 2),
        duration_seconds,
        interval_seconds,
    )
    target_frames = sorted(
        {
            max(0, min(frame_count - 1, int(round(float(seconds) * fps))))
            for seconds in requested_seconds
        }
    )

    clip_directory = output_directory / clip["id"]
    clip_directory.mkdir(parents=True, exist_ok=True)
    thumbnail_height = round(height / width * thumbnail_width)
    frames: list[dict[str, Any]] = []
    for sample_index, frame_index in enumerate(target_frames, start=1):
        capture.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        ok, bgr = capture.read()
        if not ok or bgr is None:
            raise ValueError(f"Could not decode {video_path} frame {frame_index}")
        thumbnail = cv2.resize(
            bgr,
            (thumbnail_width, thumbnail_height),
            interpolation=cv2.INTER_AREA,
        )
        thumbnail_path = clip_directory / f"sample-{sample_index:03d}.jpg"
        if not cv2.imwrite(
            str(thumbnail_path), thumbnail, [cv2.IMWRITE_JPEG_QUALITY, 95]
        ):
            raise ValueError(f"Could not write {thumbnail_path}")
        frames.append(
            {
                "sampleIndex": sample_index,
                "frameIndex": frame_index,
                "seconds": round(frame_index / fps, 6),
                "decodedPixelsSha256": hashlib.sha256(bgr.tobytes(order="C")).hexdigest(),
                "thumbnailPath": str(thumbnail_path.resolve()),
                "thumbnailSha256": sha256_file(thumbnail_path),
            }
        )
    capture.release()

    per_sheet = columns * rows_per_sheet
    contact_sheets: list[dict[str, Any]] = []
    for sheet_index, start in enumerate(range(0, len(frames), per_sheet), start=1):
        subset = frames[start : start + per_sheet]
        sheet_path = clip_directory / f"contact-sheet-{sheet_index:02d}.png"
        build_contact_sheet(
            subset,
            sheet_path,
            (
                f"Official MLB {GAME_DATE} {clip['id']} samples "
                f"{subset[0]['sampleIndex']}-{subset[-1]['sampleIndex']}"
            ),
            columns,
            thumbnail_width,
        )
        contact_sheets.append(
            {
                "sheetIndex": sheet_index,
                "firstSampleIndex": subset[0]["sampleIndex"],
                "lastSampleIndex": subset[-1]["sampleIndex"],
                "path": str(sheet_path.resolve()),
                "sha256": sha256_file(sheet_path),
            }
        )

    return {
        "clipId": clip["id"],
        "title": clip["title"],
        "officialUrl": clip["url"],
        "videoPath": str(video_path.resolve()),
        "videoByteLength": video_path.stat().st_size,
        "videoSha256": sha256_file(video_path),
        "videoMetadata": {
            "fps": fps,
            "frameCount": frame_count,
            "durationSeconds": duration_seconds,
            "width": width,
            "height": height,
        },
        "sampleCount": len(frames),
        "frames": frames,
        "contactSheets": contact_sheets,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("article_html", type=Path)
    parser.add_argument("video_directory", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--interval-seconds", type=float, default=0.5)
    parser.add_argument("--thumbnail-width", type=int, default=320)
    parser.add_argument("--columns", type=int, default=6)
    parser.add_argument("--rows-per-sheet", type=int, default=5)
    arguments = parser.parse_args()
    if not 0.25 <= arguments.interval_seconds <= 5.0:
        raise ValueError("Interval must be from 0.25 through 5 seconds")
    if arguments.thumbnail_width < 240:
        raise ValueError("Thumbnail width must be at least 240 pixels")
    if arguments.columns < 1 or arguments.rows_per_sheet < 1:
        raise ValueError("Contact-sheet dimensions must be positive")

    article_bytes = arguments.article_html.read_bytes()
    article_text = article_bytes.decode("utf-8")
    required_article_strings = [
        ARTICLE_HEADLINE,
        ARTICLE_PUBLISHED,
        f'"contentDate":"{ARTICLE_PUBLISHED}"',
        *[clip["url"] for clip in OFFICIAL_CLIPS],
        *[clip["title"] for clip in OFFICIAL_CLIPS],
    ]
    missing = [value for value in required_article_strings if value not in article_text]
    if missing:
        raise ValueError(f"Official article changed or required provenance is missing: {missing}")

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    clips = [
        index_clip(
            clip,
            resolve_clip(arguments.video_directory, clip["id"]),
            arguments.output_directory,
            arguments.interval_seconds,
            arguments.thumbnail_width,
            arguments.columns,
            arguments.rows_per_sheet,
        )
        for clip in OFFICIAL_CLIPS
    ]
    stable = {
        "schemaVersion": 1,
        "analysisVersion": "marlins-official-current-game-frame-review-index-v1",
        "artifactKind": "marlins-official-current-game-frame-review-index",
        "stadiumId": "marlins",
        "source": {
            "publisher": "Major League Baseball",
            "articlePath": str(arguments.article_html.resolve()),
            "articleSha256": sha256_bytes(article_bytes),
            "headline": ARTICLE_HEADLINE,
            "articlePublishedUtc": ARTICLE_PUBLISHED,
            "gameDateLocal": GAME_DATE,
            "provenanceValidation": (
                "Exact headline, publication timestamp, clip titles, and official MLB MP4 URLs "
                "must all remain present in the downloaded article HTML."
            ),
        },
        "sampling": {
            "intervalSeconds": arguments.interval_seconds,
            "decodedFrameSelection": "nearest integer frame index at each interval midpoint",
            "thumbnailWidth": arguments.thumbnail_width,
            "decodedPixelHash": "SHA-256 of full-resolution BGR bytes returned by OpenCV",
        },
        "clips": clips,
        "summary": {
            "clipCount": len(clips),
            "sampleCount": sum(clip["sampleCount"] for clip in clips),
            "contactSheetCount": sum(len(clip["contactSheets"]) for clip in clips),
        },
        "evidenceScope": {
            "allowed": [
                "Dated visual evidence of physical stadium conditions visible in a reviewed frame",
                "Current physical persistence only when a feature or section is uniquely identifiable",
            ],
            "prohibited": [
                "Metric row geometry without a separately validated camera solution and scale",
                "Row identity inferred from broadcast appearance alone",
                "Shade holdout use without independent timestamp and boundary labels",
            ],
        },
        "publicationEligible": False,
        "blockers": [
            "VISUAL_CONTENT_REVIEW_REQUIRED",
            "SECTION_4_UNIQUE_IDENTIFICATION_NOT_REVIEWED",
            "CAMERA_REGISTRATION_NOT_ESTABLISHED",
            "METRIC_ROW_GEOMETRY_NOT_ESTABLISHED",
            "INDEPENDENT_SHADE_HOLDOUT_NOT_ESTABLISHED",
        ],
    }
    manifest = {**stable, "artifactVersion": artifact_version(stable)}
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "manifestPath": str(manifest_path),
                "artifactVersion": manifest["artifactVersion"],
                "summary": manifest["summary"],
                "clips": [
                    {
                        "clipId": clip["clipId"],
                        "title": clip["title"],
                        "videoMetadata": clip["videoMetadata"],
                        "sampleCount": clip["sampleCount"],
                        "contactSheetCount": len(clip["contactSheets"]),
                    }
                    for clip in clips
                ],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
