#!/usr/bin/env python3
"""Render the best review thumbnail for each ranked observation candidate."""

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


def artifact_version(value: dict) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(payload).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("ranking", type=Path)
    parser.add_argument("output_image", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--start-rank", type=int, default=1)
    parser.add_argument("--maximum-candidates", type=int, default=60)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--thumbnail-width", type=int, default=480)
    arguments = parser.parse_args()
    if (
        arguments.start_rank < 1
        or arguments.maximum_candidates < 1
        or arguments.columns < 1
        or arguments.thumbnail_width < 240
    ):
        raise ValueError("Sheet dimensions must be positive")

    ranking_bytes = arguments.ranking.read_bytes()
    ranking = json.loads(ranking_bytes)
    if ranking.get("artifactStage") != "review-only-stadium-section-frame-ranking":
        raise ValueError("Input is not a stadium-section frame ranking")
    start_index = arguments.start_rank - 1
    selected = ranking["rankedCandidates"][
        start_index : start_index + arguments.maximum_candidates
    ]
    if not selected:
        raise ValueError("Ranking contains no candidates")

    first_path = Path(selected[0]["bestFrame"]["thumbnailPath"])
    first = Image.open(first_path)
    thumbnail_height = round(first.height / first.width * arguments.thumbnail_width)
    label_height = 66
    title_height = 48
    rows = math.ceil(len(selected) / arguments.columns)
    sheet = Image.new(
        "RGB",
        (
            arguments.columns * arguments.thumbnail_width,
            title_height + rows * (label_height + thumbnail_height),
        ),
        "white",
    )
    draw = ImageDraw.Draw(sheet)
    draw.text((10, 15), "Ranked stadium-section frame review", fill="black")
    frames = []
    for rank, candidate in enumerate(selected, start=arguments.start_rank):
        frame = candidate["bestFrame"]
        path = Path(frame["thumbnailPath"])
        actual_sha256 = sha256_file(path)
        if actual_sha256 != frame["thumbnailSha256"]:
            raise ValueError(f"Thumbnail hash mismatch: {path}")
        image = Image.open(path).convert("RGB")
        image = image.resize(
            (arguments.thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS
        )
        sheet_index = rank - arguments.start_rank
        column = sheet_index % arguments.columns
        row = sheet_index // arguments.columns
        left = column * arguments.thumbnail_width
        top = title_height + row * (label_height + thumbnail_height)
        solar = candidate["solarPosition"]
        draw.text(
            (left + 6, top + 5),
            (
                f"rank {rank:02d} clip {candidate['candidateIndex']:03d} "
                f"matches {frame['goodMatchCount']} sample {frame['sampleIndex']:03d}\n"
                f"{candidate['eventMidpointTime']}\n"
                f"alt {solar['altitudeDegrees']:.2f} az {solar['azimuthDegrees']:.2f}"
            ),
            fill="black",
        )
        sheet.paste(image, (left, top + label_height))
        frames.append(
            {
                "rank": rank,
                "candidateIndex": candidate["candidateIndex"],
                "candidateId": candidate["candidateId"],
                "eventMidpointTime": candidate["eventMidpointTime"],
                "solarPosition": solar,
                "bestFrame": frame,
            }
        )

    arguments.output_image.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(arguments.output_image, format="JPEG", quality=94, optimize=True, progressive=True)
    stable = {
        "input": {
            "rankingPath": str(arguments.ranking),
            "rankingSha256": hashlib.sha256(ranking_bytes).hexdigest(),
            "rankingArtifactVersion": ranking.get("artifactVersion"),
        },
        "maximumCandidates": arguments.maximum_candidates,
        "startRank": arguments.start_rank,
        "renderedCandidateCount": len(frames),
        "frames": frames,
        "outputImage": str(arguments.output_image),
        "outputImageSha256": sha256_file(arguments.output_image),
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ranked-observation-frame-review-sheet",
        "artifactVersion": artifact_version(stable),
        **stable,
        "publicationEligible": False,
        "note": "Review aid only. Ranking does not identify a section or label a shade boundary.",
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "outputImage": str(arguments.output_image),
                "outputJson": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "renderedCandidateCount": len(frames),
                "outputImageSha256": stable["outputImageSha256"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
