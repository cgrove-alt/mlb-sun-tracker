#!/usr/bin/env python3
"""Build a compact representative sheet from a dense MLB frame index."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("index_manifest", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--samples-per-candidate", type=int, default=3)
    parser.add_argument("--columns", type=int, default=3)
    parser.add_argument("--thumbnail-width", type=int, default=480)
    parser.add_argument("--start-candidate", type=int, default=1)
    parser.add_argument("--end-candidate", type=int)
    arguments = parser.parse_args()
    if (
        arguments.samples_per_candidate < 1
        or arguments.columns < 1
        or arguments.start_candidate < 1
        or (
            arguments.end_candidate is not None
            and arguments.end_candidate < arguments.start_candidate
        )
    ):
        raise ValueError("Sheet dimensions must be positive")

    manifest = json.loads(arguments.index_manifest.read_text(encoding="utf-8"))
    available_indices = [
        candidate["candidateIndex"] for candidate in manifest["candidates"]
    ]
    end_candidate = arguments.end_candidate or max(available_indices)
    scoped_candidates = [
        candidate
        for candidate in manifest["candidates"]
        if arguments.start_candidate <= candidate["candidateIndex"] <= end_candidate
    ]
    if not scoped_candidates:
        raise ValueError("Candidate range contains no indexed candidates")
    selected: list[dict] = []
    for candidate in scoped_candidates:
        frames = candidate["frames"]
        if not frames:
            continue
        if arguments.samples_per_candidate == 1:
            indices = [len(frames) // 2]
        else:
            indices = sorted({
                round(fraction * (len(frames) - 1) / (arguments.samples_per_candidate - 1))
                for fraction in range(arguments.samples_per_candidate)
            })
        for index in indices:
            selected.append({
                "candidateIndex": candidate["candidateIndex"],
                "candidateId": candidate["candidateId"],
                "eventMidpointTime": candidate["eventMidpointTime"],
                **frames[index],
            })

    first = Image.open(selected[0]["thumbnailPath"])
    thumbnail_height = round(first.height / first.width * arguments.thumbnail_width)
    label_height = 50
    rows = math.ceil(len(selected) / arguments.columns)
    sheet = Image.new(
        "RGB",
        (
            arguments.columns * arguments.thumbnail_width,
            rows * (thumbnail_height + label_height),
        ),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    for index, record in enumerate(selected):
        image = Image.open(record["thumbnailPath"]).convert("RGB")
        image.thumbnail((arguments.thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS)
        column = index % arguments.columns
        row = index // arguments.columns
        left = column * arguments.thumbnail_width
        top = row * (thumbnail_height + label_height)
        draw.text(
            (left + 6, top + 5),
            f"clip {record['candidateIndex']:03d} sample {record['sampleIndex']:03d} {record['seconds']:.2f}s",
            fill="black",
        )
        draw.text((left + 6, top + 25), record["eventMidpointTime"], fill="black")
        sheet.paste(image, (left, top + label_height))
    arguments.output_png.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(arguments.output_png, format="PNG", optimize=True)
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "dense-video-index-representative-sheet",
        "inputs": {
            "indexManifest": {
                "path": str(arguments.index_manifest),
                "sha256": sha256_file(arguments.index_manifest),
                "artifactVersion": manifest["artifactVersion"],
            }
        },
        "samplesPerCandidate": arguments.samples_per_candidate,
        "candidateRange": {
            "start": arguments.start_candidate,
            "end": end_candidate,
        },
        "candidateCount": len(scoped_candidates),
        "renderedFrameCount": len(selected),
        "frames": selected,
        "outputPng": str(arguments.output_png),
        "outputPngSha256": sha256_file(arguments.output_png),
        "publicationEligible": False,
        "note": "Review aid only. Full-resolution frame inspection remains required.",
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputPng": str(arguments.output_png),
        "outputJson": str(arguments.output_json),
        "candidateCount": artifact["candidateCount"],
        "renderedFrameCount": artifact["renderedFrameCount"],
        "outputPngSha256": artifact["outputPngSha256"],
    }, indent=2))


if __name__ == "__main__":
    main()
