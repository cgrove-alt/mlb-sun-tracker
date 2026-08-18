#!/usr/bin/env python3
"""Render checksum-locked nadir quadrants for seat-control review.

The diagnostics preserve source pixels and split each downward cubemap face
into overlapping quadrants so visible seat badges, anchors, tread edges, and
riser edges can be reviewed at native resolution. They are not row labels or
metric geometry.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2


ANALYSIS_VERSION = "sportsdigita-nadir-control-diagnostics-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--sections", default="205,206,207,208,209")
    parser.add_argument("--overlap-pixels", type=int, default=96)
    arguments = parser.parse_args()
    requested = [part.strip() for part in arguments.sections.split(",") if part.strip()]
    source_bytes = arguments.manifest.read_bytes()
    source = json.loads(source_bytes)
    if source.get("artifactKind") != "club-linked-section-panorama-research-input":
        raise ValueError("Input is not a club-linked panorama research artifact")
    by_section = {str(record["sectionId"]): record for record in source["sections"]}
    missing = [section for section in requested if section not in by_section]
    if missing:
        raise ValueError(f"Requested sections are absent: {missing}")
    arguments.output_directory.mkdir(parents=True, exist_ok=True)
    records = []
    for section in requested:
        panorama = by_section[section]
        down = next((entry for entry in panorama["images"] if entry["face"] == "d"), None)
        if down is None:
            raise ValueError(f"Section {section} has no downward face")
        source_path = Path(down["localPath"])
        source_sha = sha256_file(source_path)
        if source_sha != down["sha256"]:
            raise ValueError(f"Checksum mismatch for {source_path}")
        image = cv2.imread(str(source_path), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode {source_path}")
        height, width = image.shape[:2]
        if width != height:
            raise ValueError("Downward cubemap face must be square")
        half = width // 2
        overlap = arguments.overlap_pixels
        regions = {
            "top-left": (0, 0, min(width, half + overlap), min(height, half + overlap)),
            "top-right": (max(0, half - overlap), 0, width, min(height, half + overlap)),
            "bottom-left": (0, max(0, half - overlap), min(width, half + overlap), height),
            "bottom-right": (max(0, half - overlap), max(0, half - overlap), width, height),
        }
        outputs = []
        for label, (left, top, right, bottom) in regions.items():
            crop = image[top:bottom, left:right]
            output_path = arguments.output_directory / f"section-{section}-down-{label}.png"
            if not cv2.imwrite(
                str(output_path), crop, [cv2.IMWRITE_PNG_COMPRESSION, 4]
            ):
                raise ValueError(f"Could not write {output_path}")
            outputs.append({
                "label": label,
                "sourceBoundsPixels": [left, top, right, bottom],
                "path": str(output_path.resolve()),
                "sha256": sha256_file(output_path),
                "width": right - left,
                "height": bottom - top,
            })
        records.append({
            "sectionId": section,
            "panoramaId": panorama["panoramaId"],
            "sourcePath": str(source_path.resolve()),
            "sourceSha256": source_sha,
            "sourceWidth": width,
            "sourceHeight": height,
            "diagnostics": outputs,
        })
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "sourceManifest": {
            "path": str(arguments.manifest.resolve()),
            "sha256": hashlib.sha256(source_bytes).hexdigest(),
            "artifactVersion": source["artifactVersion"],
        },
        "parameters": {
            "sections": requested,
            "face": "d",
            "overlapPixels": arguments.overlap_pixels,
            "resampling": "none",
        },
        "sections": records,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "nadir-seat-control-review-diagnostics",
        "artifactVersion": version(stable),
        **stable,
        "publication": {
            "eligible": False,
            "blockers": [
                "DIAGNOSTIC_CROPS_ARE_NOT_REVIEWED_CONTROLS",
                "EXACT_ROW_IDENTITY_NOT_ESTABLISHED",
                "METRIC_REGISTRATION_NOT_ESTABLISHED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    manifest_path = arguments.output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(manifest_path.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "sectionCount": len(records),
        "diagnosticCount": sum(len(record["diagnostics"]) for record in records),
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
