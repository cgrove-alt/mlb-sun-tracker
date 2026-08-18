#!/usr/bin/env python3
"""Build a checksum-locked frame index of official 2026 Section 4 candidate clips."""

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


OFFICIAL_CLIPS = (
    {
        "id": "young-fan-netting",
        "pageFilename": "young-fan-netting.html",
        "videoFilename": "young-fan-netting.mp4",
        "title": "Young fan untangles Jakob Marsee's bat from netting",
        "durationIso8601": "P0Y0M0DT0H0M57S",
        "sourceDate": "2026-04-21",
        "pageUrl": (
            "https://www.mlb.com/marlins/video/"
            "young-fan-untangles-jakob-marsee-s-bat-from-netting"
        ),
        "videoUrl": (
            "https://mlb-cuts-diamond.mlb.com/FORGE/2026/2026-04/21/"
            "c2d82cca-298c8b15-791afe96-csvm-diamondgcp-asset_1280x720_59_4000K.mp4"
        ),
    },
    {
        "id": "ball-boy-snag",
        "pageFilename": "ball-boy-snag.html",
        "videoFilename": "ball-boy-snag.mp4",
        "title": "Marlins Ball Boy makes a sweet snag ",
        "durationIso8601": "P0Y0M0DT0H0M16S",
        "sourceDate": "2026-05-03",
        "pageUrl": "https://www.mlb.com/video/marlins-ball-boy-makes-a-sweet-snag",
        "videoUrl": (
            "https://mlb-cuts-diamond.mlb.com/FORGE/2026/2026-05/03/"
            "6c86d98c-2c5f93b2-c08658d4-csvm-diamondgcp-asset_1280x720_59_4000K.mp4"
        ),
    },
    {
        "id": "anthony-rizzo-stands",
        "pageFilename": "anthony-rizzo-stands.html",
        "videoFilename": "anthony-rizzo-stands.mp4",
        "title": "Anthony Rizzo spotted in the stands",
        "durationIso8601": "P0Y0M0DT0H0M11S",
        "sourceDate": "2026-04-09",
        "pageUrl": (
            "https://www.mlb.com/marlins/video/anthony-rizzo-spotted-in-the-stands"
        ),
        "videoUrl": (
            "https://mlb-cuts-diamond.mlb.com/FORGE/2026/2026-04/09/"
            "40a83d78-25f3a706-ccb6a9ec-csvm-diamondgcp-asset_1280x720_59_4000K.mp4"
        ),
    },
    {
        "id": "scottish-fans",
        "pageFilename": "scottish-fans.html",
        "videoFilename": "scottish-fans.mp4",
        "title": "Scottish fans take on loanDepot park",
        "durationIso8601": "P0Y0M0DT0H0M38S",
        "sourceDate": "2026-06-22",
        "pageUrl": (
            "https://www.mlb.com/marlins/video/scottish-fans-take-on-loandepot-park"
        ),
        "videoUrl": (
            "https://mlb-cuts-diamond.mlb.com/FORGE/2026/2026-06/22/"
            "8e11e6a2-866b717a-d1fd4a94-csvm-diamondgcp-asset_1280x720_59_4000K.mp4"
        ),
    },
    {
        "id": "camp-day",
        "pageFilename": "camp-day.html",
        "videoFilename": "camp-day.mp4",
        "title": "Camp Day gets loud at LoanDepot Park",
        "durationIso8601": "P0Y0M0DT0H1M15S",
        "sourceDate": "2026-06-24",
        "pageUrl": (
            "https://www.mlb.com/marlins/video/camp-day-gets-loud-at-loandepot-park"
        ),
        "videoUrl": (
            "https://mlb-cuts-diamond.mlb.com/FORGE/2026/2026-06/24/"
            "bfbadeb0-3ddd9884-ff09571f-csvm-diamondgcp-asset_1280x720_59_4000K.mp4"
        ),
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
    source_directory: Path,
    output_directory: Path,
    interval_seconds: float,
    thumbnail_width: int,
    columns: int,
    rows_per_sheet: int,
) -> dict[str, Any]:
    page_path = source_directory / clip["pageFilename"]
    video_path = source_directory / clip["videoFilename"]
    page_bytes = page_path.read_bytes()
    page_text = page_bytes.decode("utf-8")
    required_page_strings = (
        f'"name":"{clip["title"]}"',
        f'"duration":"{clip["durationIso8601"]}"',
        clip["videoUrl"],
    )
    missing = [value for value in required_page_strings if value not in page_text]
    if missing:
        raise ValueError(
            f"Official page changed or required provenance is missing for {clip['id']}: {missing}"
        )

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
                f"Official MLB {clip['sourceDate']} {clip['id']} samples "
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
        "title": clip["title"].strip(),
        "sourceDate": clip["sourceDate"],
        "officialPageUrl": clip["pageUrl"],
        "officialVideoUrl": clip["videoUrl"],
        "pagePath": str(page_path.resolve()),
        "pageSha256": sha256_bytes(page_bytes),
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
    parser.add_argument("source_directory", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--interval-seconds", type=float, default=0.25)
    parser.add_argument("--thumbnail-width", type=int, default=320)
    parser.add_argument("--columns", type=int, default=6)
    parser.add_argument("--rows-per-sheet", type=int, default=5)
    arguments = parser.parse_args()
    if not 0.125 <= arguments.interval_seconds <= 5.0:
        raise ValueError("Interval must be from 0.125 through 5 seconds")
    if arguments.thumbnail_width < 240:
        raise ValueError("Thumbnail width must be at least 240 pixels")
    if arguments.columns < 1 or arguments.rows_per_sheet < 1:
        raise ValueError("Contact-sheet dimensions must be positive")

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    clips = [
        index_clip(
            clip,
            arguments.source_directory,
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
        "analysisVersion": "marlins-official-current-section4-candidate-frame-index-v1",
        "artifactKind": "marlins-official-current-section4-candidate-frame-index",
        "stadiumId": "marlins",
        "source": {
            "publisher": "Major League Baseball",
            "sourceDirectory": str(arguments.source_directory.resolve()),
            "provenanceValidation": (
                "Each page must retain the exact MLB title, ISO duration, and dated official "
                "MP4 URL before its downloaded video can enter the review corpus."
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
            "sourceDateCount": len({clip["sourceDate"] for clip in clips}),
            "sampleCount": sum(clip["sampleCount"] for clip in clips),
            "contactSheetCount": sum(len(clip["contactSheets"]) for clip in clips),
        },
        "evidenceScope": {
            "allowed": [
                "Dated visual evidence of physical stadium conditions visible in a reviewed frame",
                "Current physical persistence only when Section 4 is uniquely identifiable",
            ],
            "prohibited": [
                "Metric row geometry without a separately validated camera solution and scale",
                "Section or row identity inferred from visual similarity alone",
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
                        "sourceDate": clip["sourceDate"],
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
