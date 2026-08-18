#!/usr/bin/env python3
"""Lock the manual Section 4 review of dated official Marlins game clips."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


EXPECTED_CLIPS = {
    "d6c41cd4": {
        "sampleCount": 198,
        "contactSheetCount": 7,
        "sceneClasses": [
            "press conference",
            "standard center-field broadcast camera",
            "player and dugout cutaways",
        ],
        "finding": (
            "The clip is primarily a press conference with brief broadcast cutaways. "
            "No frame uniquely identifies Section 4."
        ),
    },
    "4fefb8e9": {
        "sampleCount": 237,
        "contactSheetCount": 8,
        "sceneClasses": [
            "mound and home-plate broadcast camera",
            "field and outfield tracking camera",
            "field-level wide camera",
        ],
        "finding": (
            "The clip contains current game action and wide stadium views, but no "
            "legible section marker or unique geometry establishes Section 4."
        ),
    },
    "d88207b6": {
        "sampleCount": 42,
        "contactSheetCount": 2,
        "sceneClasses": [
            "home-plate broadcast camera",
            "outfield hit-tracking camera",
        ],
        "finding": (
            "The clip follows a hit from the standard game cameras. No frame uniquely "
            "identifies Section 4."
        ),
    },
}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def resolved_path(value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else Path.cwd() / path


def require_locked_file(path_value: str, expected_sha256: str, label: str) -> Path:
    path = resolved_path(path_value)
    if not path.is_file():
        raise ValueError(f"{label} is missing: {path}")
    actual = sha256_file(path)
    if actual != expected_sha256:
        raise ValueError(f"{label} checksum changed: {path}")
    return path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_index_manifest", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    manifest_bytes = arguments.frame_index_manifest.read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get("artifactKind") != "marlins-official-current-game-frame-review-index":
        raise ValueError("Input is not the official current-game frame review index")
    stable_manifest = {
        key: value for key, value in manifest.items() if key != "artifactVersion"
    }
    if manifest.get("artifactVersion") != artifact_version(stable_manifest):
        raise ValueError("Frame review index artifact version does not reproduce")
    if manifest.get("source", {}).get("gameDateLocal") != "2026-04-07":
        raise ValueError("Official clip game date changed")
    if manifest.get("summary") != {
        "clipCount": 3,
        "sampleCount": 477,
        "contactSheetCount": 17,
    }:
        raise ValueError("Official clip frame index scope changed")

    source = manifest["source"]
    article_path = require_locked_file(
        source["articlePath"], source["articleSha256"], "official MLB article"
    )
    review_records: list[dict[str, Any]] = []
    reviewed_sheet_records: list[dict[str, Any]] = []
    for clip in manifest["clips"]:
        clip_id = clip["clipId"]
        expected = EXPECTED_CLIPS.get(clip_id)
        if expected is None:
            raise ValueError(f"Unexpected official clip: {clip_id}")
        if clip["sampleCount"] != expected["sampleCount"]:
            raise ValueError(f"Sample count changed for {clip_id}")
        if len(clip["contactSheets"]) != expected["contactSheetCount"]:
            raise ValueError(f"Contact-sheet count changed for {clip_id}")
        video_path = require_locked_file(
            clip["videoPath"], clip["videoSha256"], f"official clip {clip_id}"
        )
        for frame in clip["frames"]:
            require_locked_file(
                frame["thumbnailPath"],
                frame["thumbnailSha256"],
                f"official clip {clip_id} thumbnail {frame['sampleIndex']}",
            )
        for sheet in clip["contactSheets"]:
            sheet_path = require_locked_file(
                sheet["path"],
                sheet["sha256"],
                f"official clip {clip_id} contact sheet {sheet['sheetIndex']}",
            )
            reviewed_sheet_records.append(
                {
                    "clipId": clip_id,
                    "sheetIndex": sheet["sheetIndex"],
                    "firstSampleIndex": sheet["firstSampleIndex"],
                    "lastSampleIndex": sheet["lastSampleIndex"],
                    "path": str(sheet_path.resolve()),
                    "sha256": sheet["sha256"],
                    "manualVisualReviewCompleted": True,
                }
            )
        review_records.append(
            {
                "clipId": clip_id,
                "title": clip["title"],
                "officialUrl": clip["officialUrl"],
                "videoPath": str(video_path.resolve()),
                "videoSha256": clip["videoSha256"],
                "sampleCount": clip["sampleCount"],
                "contactSheetCount": len(clip["contactSheets"]),
                "sceneClasses": expected["sceneClasses"],
                "section4UniquelyIdentifiedFrameCount": 0,
                "finding": expected["finding"],
            }
        )

    stable = {
        "analysisVersion": "marlins-official-current-game-section4-adjudication-v1",
        "artifactKind": "marlins-official-current-game-section4-adjudication",
        "stadiumId": "marlins",
        "reviewedOn": "2026-08-11",
        "inputs": {
            "frameIndexManifestPath": str(arguments.frame_index_manifest.resolve()),
            "frameIndexManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "frameIndexManifestArtifactVersion": manifest["artifactVersion"],
            "officialArticlePath": str(article_path.resolve()),
            "officialArticleSha256": source["articleSha256"],
        },
        "reviewScope": {
            "gameDateLocal": source["gameDateLocal"],
            "articlePublishedUtc": source["articlePublishedUtc"],
            "clipCount": 3,
            "sampleCount": 477,
            "contactSheetCount": 17,
            "samplingIntervalSeconds": manifest["sampling"]["intervalSeconds"],
            "manualVisualReviewCompletedForEveryContactSheet": True,
            "reviewedAtFullContactSheetResolution": True,
        },
        "clips": review_records,
        "reviewedContactSheets": reviewed_sheet_records,
        "summary": {
            "reviewedClipCount": len(review_records),
            "reviewedSampleCount": sum(item["sampleCount"] for item in review_records),
            "reviewedContactSheetCount": len(reviewed_sheet_records),
            "section4UniquelyIdentifiedFrameCount": 0,
            "section4PhysicalPersistenceEstablished": False,
            "metricRowGeometryEstablished": False,
            "currentObstructionGeometryEstablished": False,
            "independentShadeBoundaryObservationCount": 0,
        },
        "geometryBoundary": {
            "establishesDatedOfficialGameFootage": True,
            "establishesGeneralCurrentStadiumVisualCondition": True,
            "establishesSection4UniqueIdentification": False,
            "establishesSection4PhysicalPersistence": False,
            "establishesMetricRowGeometry": False,
            "establishesCurrentObstructionGeometry": False,
            "establishesIndependentShadeHoldout": False,
            "note": (
                "All 17 half-second contact sheets were visually reviewed. The footage is "
                "dated official MLB material, but no sampled frame uniquely identifies "
                "Section 4."
            ),
        },
        "publicationEligible": False,
        "blockers": [
            "SECTION_4_NOT_UNIQUELY_IDENTIFIED",
            "SECTION_4_PHYSICAL_PERSISTENCE_NOT_ESTABLISHED",
            "METRIC_ROW_GEOMETRY_NOT_ESTABLISHED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED",
            "INDEPENDENT_SHADE_HOLDOUT_NOT_ESTABLISHED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "summary": artifact["summary"],
                "blockers": artifact["blockers"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
