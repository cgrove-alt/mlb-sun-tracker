#!/usr/bin/env python3
"""Lock the manual shade review of official 2026 Marlins stand-focused clips."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


EXPECTED_CLIPS = {
    "ivan-rodriguez": {
        "sourceDate": "2026-07-28",
        "sampleCount": 99,
        "contactSheetCount": 4,
        "roofState": "closed",
        "sceneClasses": [
            "tight fan close-up behind home plate",
            "enclosed-roof championship-banner camera",
        ],
        "numberedSeatPlaqueSheetIndexes": [],
        "finding": (
            "The broadcast identifies the game state and shows current seats, netting, "
            "and the enclosed roof, but no direct solar illumination or shade boundary "
            "appears on any visible row."
        ),
    },
    "fan-foul-ball": {
        "sourceDate": "2026-07-28",
        "sampleCount": 53,
        "contactSheetCount": 2,
        "roofState": "closed",
        "sceneClasses": [
            "standard center-field game camera",
            "foul-ball crowd tracking camera",
        ],
        "numberedSeatPlaqueSheetIndexes": [],
        "finding": (
            "The crowd pan shows multiple current rows and aisles, but the enclosed-roof "
            "lighting produces no direct solar footprint or row-level shade boundary."
        ),
    },
    "viral-dog": {
        "sourceDate": "2026-07-12",
        "sampleCount": 521,
        "contactSheetCount": 18,
        "roofState": "closed",
        "sceneClasses": [
            "tight fan and dog cameras",
            "pregame field ceremony cameras",
            "standard center-field game camera",
            "enclosed club camera",
        ],
        "numberedSeatPlaqueSheetIndexes": [],
        "finding": (
            "The compilation exposes the field, club, lower-bowl seats, and roof interior "
            "at several moments. It contains no direct solar illumination or visible "
            "shade boundary on a seating row."
        ),
    },
    "one-dog-food": {
        "sourceDate": "2026-06-22",
        "sampleCount": 54,
        "contactSheetCount": 2,
        "roofState": "not-assessable-from-tight-shot",
        "sceneClasses": ["tight fan and dog close-up"],
        "numberedSeatPlaqueSheetIndexes": [],
        "finding": (
            "The clip never widens enough to assess the roof position or identify a row. "
            "No direct solar illumination or shade boundary is visible."
        ),
    },
    "barehanded-catch": {
        "sourceDate": "2026-05-23",
        "sampleCount": 116,
        "contactSheetCount": 4,
        "roofState": "closed",
        "sceneClasses": [
            "standard center-field game camera",
            "left-field foul-ball tracking camera",
            "tight fan close-up",
        ],
        "numberedSeatPlaqueSheetIndexes": [3, 4],
        "finding": (
            "The left-field pan and close-up show current rows, rails, and legible seat "
            "number plaques. A seat number is not a row label or a metric position. The "
            "enclosed-roof scene contains no direct solar footprint or shade boundary."
        ),
    },
    "tyler-clark": {
        "sourceDate": "2026-05-21",
        "sampleCount": 439,
        "contactSheetCount": 15,
        "roofState": "closed",
        "sceneClasses": [
            "wide upper-bowl crowd camera",
            "in-seat interview camera",
            "standard center-field game camera",
            "picture-in-picture broadcast camera",
        ],
        "numberedSeatPlaqueSheetIndexes": [],
        "finding": (
            "Wide and tight views show current upper-bowl rows under the enclosed roof. "
            "No direct solar illumination or row-level shade boundary is visible."
        ),
    },
    "phillips-son": {
        "sourceDate": "2026-05-04",
        "sampleCount": 574,
        "contactSheetCount": 20,
        "roofState": "closed",
        "sceneClasses": [
            "suite and family close-up",
            "standard center-field game camera",
            "wide outfield game camera",
            "dugout camera",
        ],
        "numberedSeatPlaqueSheetIndexes": [],
        "finding": (
            "The broadcast shows the enclosed roof, field, outfield seating, suite area, "
            "and dugout. No direct solar illumination or seating shade boundary appears."
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
    if manifest.get("artifactKind") != "marlins-official-current-stands-candidate-frame-index":
        raise ValueError("Input is not the official stands candidate frame index")
    stable_manifest = {
        key: value for key, value in manifest.items() if key != "artifactVersion"
    }
    if manifest.get("artifactVersion") != artifact_version(stable_manifest):
        raise ValueError("Frame index artifact version does not reproduce")
    expected_summary = {
        "clipCount": 7,
        "sourceDateCount": 6,
        "sampleCount": 1856,
        "contactSheetCount": 65,
        "earliestSourceDate": "2026-05-04",
        "latestSourceDate": "2026-07-28",
    }
    if manifest.get("summary") != expected_summary:
        raise ValueError("Official stands frame index scope changed")

    reviewed_clips: list[dict[str, Any]] = []
    reviewed_sheets: list[dict[str, Any]] = []
    for clip in manifest["clips"]:
        clip_id = clip["clipId"]
        expected = EXPECTED_CLIPS.get(clip_id)
        if expected is None:
            raise ValueError(f"Unexpected official clip: {clip_id}")
        if clip["sourceDate"] != expected["sourceDate"]:
            raise ValueError(f"Source date changed for {clip_id}")
        if clip["sampleCount"] != expected["sampleCount"]:
            raise ValueError(f"Sample count changed for {clip_id}")
        if len(clip["contactSheets"]) != expected["contactSheetCount"]:
            raise ValueError(f"Contact-sheet count changed for {clip_id}")

        page_path = require_locked_file(
            clip["pagePath"], clip["pageSha256"], f"official page {clip_id}"
        )
        video_path = require_locked_file(
            clip["videoPath"], clip["videoSha256"], f"official video {clip_id}"
        )
        for frame in clip["frames"]:
            require_locked_file(
                frame["thumbnailPath"],
                frame["thumbnailSha256"],
                f"official clip {clip_id} thumbnail {frame['sampleIndex']}",
            )
        numbered_sheet_indexes = set(expected["numberedSeatPlaqueSheetIndexes"])
        for sheet in clip["contactSheets"]:
            sheet_path = require_locked_file(
                sheet["path"],
                sheet["sha256"],
                f"official clip {clip_id} contact sheet {sheet['sheetIndex']}",
            )
            numbered_seat_plaque_visible = sheet["sheetIndex"] in numbered_sheet_indexes
            reviewed_sheets.append(
                {
                    "clipId": clip_id,
                    "sheetIndex": sheet["sheetIndex"],
                    "firstSampleIndex": sheet["firstSampleIndex"],
                    "lastSampleIndex": sheet["lastSampleIndex"],
                    "path": str(sheet_path.resolve()),
                    "sha256": sheet["sha256"],
                    "manualVisualReviewCompleted": True,
                    "directSolarIlluminationVisible": False,
                    "seatingShadeBoundaryVisible": False,
                    "exactSectionLabelVisible": False,
                    "exactRowLabelVisible": False,
                    "numberedSeatPlaqueVisible": numbered_seat_plaque_visible,
                    "publicationShadeObservation": False,
                    "decision": (
                        "CURRENT_SEAT_NUMBER_EVIDENCE_ONLY"
                        if numbered_seat_plaque_visible
                        else "NO_ROW_LEVEL_SOLAR_SHADE_OBSERVATION"
                    ),
                }
            )

        reviewed_clips.append(
            {
                "clipId": clip_id,
                "title": clip["title"],
                "sourceDate": clip["sourceDate"],
                "officialPageUrl": clip["officialPageUrl"],
                "officialVideoUrl": clip["officialVideoUrl"],
                "pagePath": str(page_path.resolve()),
                "pageSha256": clip["pageSha256"],
                "videoPath": str(video_path.resolve()),
                "videoSha256": clip["videoSha256"],
                "sampleCount": clip["sampleCount"],
                "contactSheetCount": len(clip["contactSheets"]),
                "sceneClasses": expected["sceneClasses"],
                "roofState": expected["roofState"],
                "directSolarIlluminationFrameCount": 0,
                "seatingShadeBoundaryFrameCount": 0,
                "exactRowShadeObservationCount": 0,
                "numberedSeatPlaqueSheetIndexes": expected[
                    "numberedSeatPlaqueSheetIndexes"
                ],
                "finding": expected["finding"],
            }
        )

    if {item["clipId"] for item in reviewed_clips} != set(EXPECTED_CLIPS):
        raise ValueError("One or more expected official clips were not reviewed")

    stable = {
        "analysisVersion": "marlins-official-current-stands-candidate-adjudication-v1",
        "artifactKind": "marlins-official-current-stands-candidate-adjudication",
        "stadiumId": "marlins",
        "reviewedOn": "2026-08-11",
        "inputs": {
            "frameIndexManifestPath": str(arguments.frame_index_manifest.resolve()),
            "frameIndexManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "frameIndexManifestArtifactVersion": manifest["artifactVersion"],
        },
        "reviewScope": {
            **expected_summary,
            "samplingIntervalSeconds": manifest["sampling"]["intervalSeconds"],
            "manualVisualReviewCompletedForEveryContactSheet": True,
            "reviewedAtFullContactSheetResolution": True,
        },
        "clips": reviewed_clips,
        "reviewedContactSheets": reviewed_sheets,
        "summary": {
            "reviewedClipCount": len(reviewed_clips),
            "reviewedSourceDateCount": len(
                {item["sourceDate"] for item in reviewed_clips}
            ),
            "reviewedSampleCount": sum(item["sampleCount"] for item in reviewed_clips),
            "reviewedContactSheetCount": len(reviewed_sheets),
            "roofClosedClipCount": sum(
                item["roofState"] == "closed" for item in reviewed_clips
            ),
            "roofStateNotAssessableClipCount": sum(
                item["roofState"] != "closed" for item in reviewed_clips
            ),
            "numberedSeatPlaqueContactSheetCount": sum(
                item["numberedSeatPlaqueVisible"] for item in reviewed_sheets
            ),
            "directSolarIlluminationFrameCount": 0,
            "seatingShadeBoundaryFrameCount": 0,
            "exactRowShadeObservationCount": 0,
            "independentShadeBoundaryObservationCount": 0,
        },
        "evidenceBoundary": {
            "establishesDatedOfficialGameFootage": True,
            "establishesGeneralCurrentStadiumVisualCondition": True,
            "establishesCurrentNumberedSeatPlaques": True,
            "establishesExactSectionIdentity": False,
            "establishesExactRowIdentity": False,
            "establishesMetricSeatOrRowGeometry": False,
            "establishesDirectSolarIllumination": False,
            "establishesSeatingShadeBoundary": False,
            "establishesIndependentShadeHoldout": False,
            "note": (
                "All 65 quarter-second contact sheets were manually reviewed. Six clips "
                "visibly show the stadium under a closed roof; the tight-only June 22 "
                "clip does not expose enough roof to assess its position. None of the "
                "1,856 samples contains direct solar illumination or a seating shade "
                "boundary. May 23 sheets 3 and 4 show numbered seat plaques, but a seat "
                "number does not establish a row label, a metric position, or shade."
            ),
        },
        "publicationEligible": False,
        "blockers": [
            "DIRECT_SOLAR_ILLUMINATION_NOT_OBSERVED",
            "SEATING_SHADE_BOUNDARY_NOT_OBSERVED",
            "EXACT_SECTION_IDENTITY_NOT_ESTABLISHED",
            "EXACT_ROW_IDENTITY_NOT_ESTABLISHED",
            "METRIC_ROW_GEOMETRY_NOT_ESTABLISHED",
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
