#!/usr/bin/env python3
"""Index newly published official 2026 Marlins stand-focused clips."""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path
from typing import Any

from indexMarlinsOfficialCurrentSection4CandidateClips import (
    artifact_version,
    index_clip,
)


CLIP_PAGES = (
    {
        "id": "ivan-rodriguez",
        "pageFilename": "ivan-rodriguez.html",
        "videoFilename": "ivan-rodriguez.mp4",
        "pageUrl": "https://www.mlb.com/video/ivan-rodriguez-spotted-in-marlins-stands",
    },
    {
        "id": "fan-foul-ball",
        "pageFilename": "fan-foul-ball.html",
        "videoFilename": "fan-foul-ball.mp4",
        "pageUrl": "https://www.mlb.com/video/fan-takes-home-jakob-marsee-s-foul-ball",
    },
    {
        "id": "viral-dog",
        "pageFilename": "viral-dog.html",
        "videoFilename": "viral-dog.mp4",
        "pageUrl": "https://www.mlb.com/video/viral-dog-jonah-makes-appearance-at-loandepot-park-x2222",
    },
    {
        "id": "one-dog-food",
        "pageFilename": "one-dog-food.html",
        "videoFilename": "one-dog-food.mp4",
        "pageUrl": "https://www.mlb.com/video/one-dog-gets-fed-another-longs-for-food",
    },
    {
        "id": "barehanded-catch",
        "pageFilename": "barehanded-catch.html",
        "videoFilename": "barehanded-catch.mp4",
        "pageUrl": "https://www.mlb.com/video/marlins-fan-makes-incredible-barehanded-catch",
    },
    {
        "id": "tyler-clark",
        "pageFilename": "tyler-clark.html",
        "videoFilename": "tyler-clark.mp4",
        "pageUrl": "https://www.mlb.com/video/tyler-clark-discusses-catching-home-run-thunderbirds",
    },
    {
        "id": "phillips-son",
        "pageFilename": "phillips-son.html",
        "videoFilename": "phillips-son.mp4",
        "pageUrl": "https://www.mlb.com/video/tyler-phillips-son-enjoys-ice-cream",
    },
)


def video_object(page_path: Path) -> dict[str, Any]:
    page_text = page_path.read_text(encoding="utf-8")
    candidates = re.findall(
        r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',
        page_text,
        flags=re.DOTALL,
    )
    records = []
    for candidate in candidates:
        try:
            value = json.loads(html.unescape(candidate.strip()))
        except json.JSONDecodeError:
            continue
        if isinstance(value, dict) and value.get("@type") == "VideoObject":
            records.append(value)
    if len(records) != 1:
        raise ValueError(
            f"{page_path} contains {len(records)} VideoObject records; expected one"
        )
    record = records[0]
    for key in ("name", "uploadDate", "duration", "contentUrl"):
        if not isinstance(record.get(key), str) or not record[key]:
            raise ValueError(f"{page_path} VideoObject is missing {key}")
    match = re.search(
        r'<meta property="og:video" content="([^"]+_4000K\.mp4)"',
        page_text,
    )
    if not match:
        raise ValueError(f"{page_path} is missing the official 4000K MP4 URL")
    return {**record, "mp4Url": html.unescape(match.group(1))}


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
    configs = []
    for fixed in CLIP_PAGES:
        metadata = video_object(arguments.source_directory / fixed["pageFilename"])
        configs.append({
            **fixed,
            "title": metadata["name"],
            "durationIso8601": metadata["duration"],
            "sourceDate": metadata["uploadDate"],
            "videoUrl": metadata["mp4Url"],
            "metadataContentUrl": metadata["contentUrl"],
        })
    clips = [
        index_clip(
            config,
            arguments.source_directory,
            arguments.output_directory,
            arguments.interval_seconds,
            arguments.thumbnail_width,
            arguments.columns,
            arguments.rows_per_sheet,
        )
        for config in configs
    ]
    stable = {
        "schemaVersion": 1,
        "analysisVersion": "marlins-official-current-stands-candidate-frame-index-v1",
        "artifactKind": "marlins-official-current-stands-candidate-frame-index",
        "stadiumId": "marlins",
        "source": {
            "publisher": "Major League Baseball",
            "sourceDirectory": str(arguments.source_directory.resolve()),
            "provenanceValidation": (
                "Each local page must contain exactly one official schema.org VideoObject, "
                "and its exact title, upload date, ISO duration, and official MP4 URL must "
                "remain present before the downloaded video enters the review corpus."
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
            "earliestSourceDate": min(clip["sourceDate"] for clip in clips),
            "latestSourceDate": max(clip["sourceDate"] for clip in clips),
        },
        "evidenceScope": {
            "allowed": [
                "Dated visual evidence of physical stadium conditions visible in a reviewed frame",
                "Current physical persistence only when a section is uniquely identifiable",
                "Shade-boundary candidacy only when exact rows and game time can be independently established",
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
            "SECTION_AND_ROW_UNIQUE_IDENTIFICATION_NOT_REVIEWED",
            "CAMERA_REGISTRATION_NOT_ESTABLISHED",
            "INDEPENDENT_SHADE_HOLDOUT_NOT_ESTABLISHED",
        ],
    }
    manifest = {**stable, "artifactVersion": artifact_version(stable)}
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(manifest_path),
        "artifactVersion": manifest["artifactVersion"],
        "summary": manifest["summary"],
    }, indent=2))


if __name__ == "__main__":
    main()
