#!/usr/bin/env python3
"""Render three deterministic thumbnail samples per MLB observation candidate."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
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
    parser.add_argument("frame_manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--columns", type=int, default=6)
    parser.add_argument("--thumbnail-width", type=int, default=320)
    arguments = parser.parse_args()
    if arguments.columns < 1 or arguments.thumbnail_width < 240:
        raise ValueError("Invalid overview dimensions")

    manifest_bytes = arguments.frame_manifest.read_bytes()
    manifest = json.loads(manifest_bytes)
    stadium_id = manifest.get("stadiumId") or "MLB"
    grouped: dict[str, list[dict]] = defaultdict(list)
    for candidate in manifest["candidates"]:
        frames = candidate["frames"]
        if not frames:
            continue
        selected_indices = sorted({
            round((len(frames) - 1) * fraction) for fraction in (0.2, 0.5, 0.8)
        })
        for selected_index in selected_indices:
            grouped[candidate["eventMidpointTime"][:10]].append({
                "candidateIndex": candidate["candidateIndex"],
                "eventMidpointTime": candidate["eventMidpointTime"],
                "solarPosition": candidate["solarPosition"],
                **frames[selected_index],
            })

    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    outputs = []
    for date, frames in sorted(grouped.items()):
        first = Image.open(frames[0]["thumbnailPath"])
        thumbnail_height = round(first.height / first.width * arguments.thumbnail_width)
        label_height = 54
        title_height = 46
        rows = math.ceil(len(frames) / arguments.columns)
        sheet = Image.new(
            "RGB",
            (
                arguments.columns * arguments.thumbnail_width,
                title_height + rows * (label_height + thumbnail_height),
            ),
            "white",
        )
        draw = ImageDraw.Draw(sheet)
        draw.text(
            (10, 14),
            f"{stadium_id} official MLB observation overview {date}",
            fill="black",
        )
        for index, frame in enumerate(frames):
            source = Image.open(frame["thumbnailPath"]).convert("RGB")
            source = source.resize(
                (arguments.thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS
            )
            column = index % arguments.columns
            row = index // arguments.columns
            x_value = column * arguments.thumbnail_width
            y_value = title_height + row * (label_height + thumbnail_height)
            label = (
                f"{frame['candidateIndex']:03d}/{frame['sampleIndex']:03d} "
                f"{frame['seconds']:.1f}s\n"
                f"alt {frame['solarPosition']['altitudeDegrees']:.1f} "
                f"az {frame['solarPosition']['azimuthDegrees']:.1f}"
            )
            draw.text((x_value + 5, y_value + 4), label, fill="black")
            sheet.paste(source, (x_value, y_value + label_height))
        output = arguments.output_directory / f"overview-{date}.jpg"
        sheet.save(output, format="JPEG", quality=93, optimize=True, progressive=True)
        outputs.append({
            "date": date,
            "path": str(output),
            "sha256": sha256_file(output),
            "frameCount": len(frames),
            "dimensions": list(sheet.size),
        })

    artifact_without_version = {
        "schemaVersion": 1,
        "artifactKind": "mlb-observation-corpus-overview",
        "inputPath": str(arguments.frame_manifest),
        "inputSha256": hashlib.sha256(manifest_bytes).hexdigest(),
        "selection": "samples nearest 20, 50, and 80 percent of each clip",
        "outputs": outputs,
        "publicationEligible": False,
        "note": "Overview sheets are review aids only. Full-resolution source frames remain authoritative.",
    }
    serialized = json.dumps(
        artifact_without_version, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")
    artifact = {
        **artifact_without_version,
        "artifactVersion": f"sha256:{hashlib.sha256(serialized).hexdigest()}",
    }
    output_manifest = arguments.output_directory / "manifest.json"
    output_manifest.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputManifest": str(output_manifest),
        "artifactVersion": artifact["artifactVersion"],
        "outputs": outputs,
    }, indent=2))


if __name__ == "__main__":
    main()
