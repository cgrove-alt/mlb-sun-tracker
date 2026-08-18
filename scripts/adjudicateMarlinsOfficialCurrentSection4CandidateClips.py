#!/usr/bin/env python3
"""Lock the manual Section 4 review of official 2026 candidate clips."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


EXPECTED_CLIPS = {
    "young-fan-netting": {
        "sourceDate": "2026-04-21",
        "sampleCount": 229,
        "contactSheetCount": 8,
        "sceneClasses": [
            "standard center-field game camera",
            "protective-net and dugout-rail camera",
            "front-row fan close-up",
        ],
        "explicitNonSection4Markers": [
            (
                "Samples 121 through 134 show red Cardinals caps and personnel along the "
                "dugout rail. The official game feed identifies St. Louis as the away club."
            )
        ],
        "finding": (
            "The clip supplies current physical detail for protective netting, front-row "
            "seats, a dugout rail, and the open bowl. It does not show a section number or "
            "a unique Section 4 portal. The visible away-club context cannot be converted "
            "into a Section 4 identity through the non-metric design-plan overlay."
        ),
    },
    "ball-boy-snag": {
        "sourceDate": "2026-05-03",
        "sampleCount": 66,
        "contactSheetCount": 3,
        "sceneClasses": [
            "standard center-field game camera",
            "foul-line tracking camera",
            "ball-boy and low-bowl rail camera",
        ],
        "explicitNonSection4Markers": [],
        "finding": (
            "The foul-line pan shows current seating, aisle rails, and a triangular camera "
            "or service bay, but no section number or uniquely registered feature fixes the "
            "view to Section 4. Visual similarity is not accepted as section identity."
        ),
    },
    "anthony-rizzo-stands": {
        "sourceDate": "2026-04-09",
        "sampleCount": 46,
        "contactSheetCount": 2,
        "sceneClasses": [
            "tight fan close-up",
            "standard center-field game camera",
        ],
        "explicitNonSection4Markers": [],
        "finding": (
            "The fan close-up has no field, aisle, portal, or section marker that can "
            "uniquely identify Section 4."
        ),
    },
    "scottish-fans": {
        "sourceDate": "2026-06-22",
        "sampleCount": 150,
        "contactSheetCount": 5,
        "sceneClasses": [
            "exterior fan procession",
            "wide crowd camera",
            "standard game cameras",
        ],
        "explicitNonSection4Markers": [],
        "finding": (
            "The clip includes exterior and wide crowd views but no legible section marker "
            "or unique Section 4 geometry."
        ),
    },
    "camp-day": {
        "sourceDate": "2026-06-24",
        "sampleCount": 301,
        "contactSheetCount": 11,
        "sceneClasses": [
            "wide camp-group crowd camera",
            "tight batter and fan cameras",
            "standard center-field game camera",
        ],
        "explicitNonSection4Markers": [
            (
                "Samples 95 through 106 and 226 through 233 visibly show lower-bowl "
                "portal markers 24 and 25, which explicitly identify those views as not "
                "Section 4."
            )
        ],
        "finding": (
            "The only legible section identifiers in the reviewed clip are 24 and 25. "
            "Other crowd close-ups lack a unique Section 4 marker or camera registration."
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


def validate_game_feed(feed: dict[str, Any]) -> None:
    if feed.get("gamePk") != 823880:
        raise ValueError("Official game feed identifier changed")
    game_data = feed.get("gameData", {})
    if game_data.get("datetime", {}).get("originalDate") != "2026-04-21":
        raise ValueError("Official game date changed")
    if game_data.get("venue", {}).get("name") != "loanDepot park":
        raise ValueError("Official game venue changed")
    if game_data.get("teams", {}).get("away", {}).get("name") != "St. Louis Cardinals":
        raise ValueError("Official away club changed")
    if game_data.get("teams", {}).get("home", {}).get("name") != "Miami Marlins":
        raise ValueError("Official home club changed")
    matching_plays = [
        play
        for play in feed.get("liveData", {}).get("plays", {}).get("allPlays", [])
        if play.get("about", {}).get("inning") == 1
        and play.get("about", {}).get("halfInning") == "bottom"
        and play.get("matchup", {}).get("batter", {}).get("fullName") == "Jakob Marsee"
    ]
    if len(matching_plays) != 1:
        raise ValueError("Jakob Marsee bottom-first plate appearance is not unique")
    play = matching_plays[0]
    if play.get("matchup", {}).get("batSide", {}).get("code") != "L":
        raise ValueError("Jakob Marsee batting side changed")
    pitch_calls = [
        event.get("details", {}).get("call", {}).get("description")
        for event in play.get("playEvents", [])
    ]
    if pitch_calls[:3] != ["Ball", "Ball", "Foul"]:
        raise ValueError("Jakob Marsee plate-appearance event sequence changed")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_index_manifest", type=Path)
    parser.add_argument("official_game_feed", type=Path)
    parser.add_argument("section4_plan_provider_review", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    manifest_bytes = arguments.frame_index_manifest.read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get("artifactKind") != "marlins-official-current-section4-candidate-frame-index":
        raise ValueError("Input is not the official Section 4 candidate frame index")
    stable_manifest = {
        key: value for key, value in manifest.items() if key != "artifactVersion"
    }
    if manifest.get("artifactVersion") != artifact_version(stable_manifest):
        raise ValueError("Frame review index artifact version does not reproduce")
    if manifest.get("summary") != {
        "clipCount": 5,
        "sourceDateCount": 5,
        "sampleCount": 792,
        "contactSheetCount": 29,
    }:
        raise ValueError("Official candidate frame index scope changed")

    game_feed_bytes = arguments.official_game_feed.read_bytes()
    game_feed = json.loads(game_feed_bytes)
    validate_game_feed(game_feed)

    plan_review_bytes = arguments.section4_plan_provider_review.read_bytes()
    plan_review = json.loads(plan_review_bytes)
    if plan_review.get("artifactKind") != "design-plan-current-provider-section-review":
        raise ValueError("Section 4 plan/provider review artifact kind changed")
    if plan_review.get("sectionId") != "SEC4" or plan_review.get("rowCount") != 38:
        raise ValueError("Section 4 plan/provider review scope changed")
    if plan_review.get("geometryBoundary") != {
        "establishesMetricRegistration": False,
        "establishesAsBuiltRowGeometry": False,
        "establishesCurrentPhysicalPersistence": False,
    }:
        raise ValueError("Section 4 plan/provider evidence boundary changed")
    plan_review_image = require_locked_file(
        plan_review["output"]["imagePath"],
        plan_review["output"]["imageSha256"],
        "Section 4 plan/provider review image",
    )

    review_records: list[dict[str, Any]] = []
    reviewed_sheet_records: list[dict[str, Any]] = []
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
                "explicitNonSection4Markers": expected["explicitNonSection4Markers"],
                "section4UniquelyIdentifiedFrameCount": 0,
                "finding": expected["finding"],
            }
        )

    stable = {
        "analysisVersion": "marlins-official-current-section4-candidate-adjudication-v1",
        "artifactKind": "marlins-official-current-section4-candidate-adjudication",
        "stadiumId": "marlins",
        "sectionId": "SEC4",
        "reviewedOn": "2026-08-11",
        "inputs": {
            "frameIndexManifestPath": str(arguments.frame_index_manifest.resolve()),
            "frameIndexManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "frameIndexManifestArtifactVersion": manifest["artifactVersion"],
            "officialGameFeedPath": str(arguments.official_game_feed.resolve()),
            "officialGameFeedSha256": hashlib.sha256(game_feed_bytes).hexdigest(),
            "officialGamePk": game_feed["gamePk"],
            "section4PlanProviderReviewPath": str(
                arguments.section4_plan_provider_review.resolve()
            ),
            "section4PlanProviderReviewSha256": hashlib.sha256(
                plan_review_bytes
            ).hexdigest(),
            "section4PlanProviderReviewArtifactVersion": plan_review["artifactVersion"],
            "section4PlanProviderReviewImagePath": str(plan_review_image.resolve()),
            "section4PlanProviderReviewImageSha256": plan_review["output"][
                "imageSha256"
            ],
        },
        "reviewScope": {
            "sourceDateCount": 5,
            "earliestSourceDate": "2026-04-09",
            "latestSourceDate": "2026-06-24",
            "clipCount": 5,
            "sampleCount": 792,
            "contactSheetCount": 29,
            "samplingIntervalSeconds": manifest["sampling"]["intervalSeconds"],
            "manualVisualReviewCompletedForEveryContactSheet": True,
            "reviewedAtFullContactSheetResolution": True,
        },
        "clips": review_records,
        "reviewedContactSheets": reviewed_sheet_records,
        "summary": {
            "reviewedClipCount": len(review_records),
            "reviewedSourceDateCount": len(
                {item["sourceDate"] for item in review_records}
            ),
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
                "All 29 quarter-second contact sheets were visually reviewed. The footage "
                "adds current physical detail for several stadium zones, but Section 4 is "
                "not uniquely identified in any sampled frame. Legible portal markers in "
                "the Camp Day footage identify Sections 24 and 25, not Section 4."
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
