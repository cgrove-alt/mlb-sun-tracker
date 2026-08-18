#!/usr/bin/env python3
"""Lock the complete manual review of the 2025 open-roof Savant corpus."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


# These candidates show the Section 35 region, but not at a defensible exact-row
# boundary resolution. The remaining clips either omit the region or do not
# establish its identity well enough to support a row label.
SECTION35_REGION_VISIBLE = {10, 12, 13, 14, 32, 33, 50, 54, 56}
LOW_SUN_NATIVE_REVIEW_CANDIDATE = 10
MAY_7_BOUNDARY_ARTIFACT = (
    "tmp/lidar/marlins-2025-05-07-sec35-observed-shade-boundary-v1.json"
)
MAY_7_BOUNDARY_EVENT_MIDPOINT = "2025-05-07T21:00:26.400Z"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode(
        "utf-8"
    )
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


def validate_versioned_artifact(artifact: dict[str, Any], label: str) -> None:
    stable = {key: value for key, value in artifact.items() if key != "artifactVersion"}
    if artifact.get("artifactVersion") != artifact_version(stable):
        raise ValueError(f"{label} artifact version does not reproduce")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_index_manifest", type=Path)
    parser.add_argument("observed_boundary_inventory", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    frame_bytes = arguments.frame_index_manifest.read_bytes()
    frame_index = json.loads(frame_bytes)
    if frame_index.get("artifactStage") != "official-mlb-observation-frame-review-index":
        raise ValueError("Input is not an official MLB observation frame index")
    validate_versioned_artifact(frame_index, "frame index")
    if frame_index.get("candidateCount") != 65:
        raise ValueError("Frame index candidate count changed")
    if frame_index.get("totalSampleCount") != 2608:
        raise ValueError("Frame index sample count changed")

    inventory_bytes = arguments.observed_boundary_inventory.read_bytes()
    inventory = json.loads(inventory_bytes)
    if inventory.get("artifactKind") != "observed-shade-boundary-inventory":
        raise ValueError("Input is not an observed shade boundary inventory")
    if inventory.get("stadiumId") != "marlins" or inventory.get("sectionId") != "SEC35":
        raise ValueError("Observed boundary inventory scope changed")
    inventory_observations = {
        observation["artifactPath"]: observation
        for observation in inventory.get("observations", [])
    }
    may_7_inventory = inventory_observations.get(MAY_7_BOUNDARY_ARTIFACT)
    if may_7_inventory is None:
        raise ValueError("May 7 exact boundary is absent from inventory")
    may_7_path = require_locked_file(
        MAY_7_BOUNDARY_ARTIFACT,
        may_7_inventory["artifactFileSha256"],
        "May 7 exact boundary",
    )
    may_7_boundary = json.loads(may_7_path.read_bytes())
    if may_7_boundary.get("timestampEvidence", {}).get("eventMidpointTime") != (
        MAY_7_BOUNDARY_EVENT_MIDPOINT
    ):
        raise ValueError("May 7 exact-boundary event midpoint changed")

    reviewed_candidates: list[dict[str, Any]] = []
    source_dates: set[str] = set()
    candidate_midpoints: set[str] = set()
    for candidate in frame_index["candidates"]:
        candidate_index = candidate["candidateIndex"]
        source_date = candidate["eventMidpointTime"][:10]
        source_dates.add(source_date)
        candidate_midpoints.add(candidate["eventMidpointTime"])
        video_path = require_locked_file(
            candidate["videoPath"],
            candidate["videoSha256"],
            f"candidate {candidate_index} video",
        )
        review_sheet_path = require_locked_file(
            candidate["reviewSheetPath"],
            candidate["reviewSheetSha256"],
            f"candidate {candidate_index} review sheet",
        )
        for frame in candidate["frames"]:
            require_locked_file(
                frame["thumbnailPath"],
                frame["thumbnailSha256"],
                f"candidate {candidate_index} thumbnail {frame['sampleIndex']}",
            )

        region_visible = candidate_index in SECTION35_REGION_VISIBLE
        low_sun_native_reviewed = candidate_index == LOW_SUN_NATIVE_REVIEW_CANDIDATE
        reviewed_candidates.append(
            {
                "candidateIndex": candidate_index,
                "candidateId": candidate["candidateId"],
                "sourceDate": source_date,
                "eventMidpointTime": candidate["eventMidpointTime"],
                "eventWindowSeconds": candidate["eventWindowSeconds"],
                "solarPosition": candidate["solarPosition"],
                "videoPath": str(video_path.resolve()),
                "videoSha256": candidate["videoSha256"],
                "sampleCount": len(candidate["frames"]),
                "reviewSheetPath": str(review_sheet_path.resolve()),
                "reviewSheetSha256": candidate["reviewSheetSha256"],
                "manualVisualReviewCompleted": True,
                "section35RegionVisible": region_visible,
                "section35RowBankVisibleAtExactRowResolution": False,
                "nativeResolutionFollowUpCompleted": low_sun_native_reviewed,
                "withinBankShadeBoundaryAccepted": False,
                "countedObservedBoundary": False,
                "scoredShadowHoldout": False,
                "decision": (
                    "SECTION35_REGION_VISIBLE_BUT_NO_EXACT_ROW_BOUNDARY"
                    if region_visible
                    else "NO_EXACT_SECTION35_ROW_BOUNDARY_ESTABLISHED"
                ),
            }
        )

    expected_dates = {
        "2025-03-27",
        "2025-04-13",
        "2025-04-17",
        "2025-05-07",
    }
    if source_dates != expected_dates:
        raise ValueError("Source-date scope changed")
    if MAY_7_BOUNDARY_EVENT_MIDPOINT in candidate_midpoints:
        raise ValueError("May 7 outside-corpus exact boundary unexpectedly entered corpus")

    altitudes = [
        candidate["solarPosition"]["altitudeDegrees"]
        for candidate in reviewed_candidates
    ]
    accepted_outside_corpus = {
        "artifactPath": str(may_7_path.resolve()),
        "artifactSha256": may_7_inventory["artifactFileSha256"],
        "artifactVersion": may_7_inventory["artifactVersion"],
        "eventMidpointTime": MAY_7_BOUNDARY_EVENT_MIDPOINT,
        "solarPosition": may_7_boundary["solarPositionAtEventMidpoint"],
        "maximumLabelUncertaintyRows": may_7_inventory[
            "maximumLabelUncertaintyRows"
        ],
        "timestampUncertaintySeconds": may_7_inventory[
            "timestampUncertaintySeconds"
        ],
        "presentInReviewed65ClipCorpus": False,
        "alreadyCountedInObservedBoundaryInventory": True,
        "newCountedObservedBoundary": False,
        "scoredShadowHoldout": False,
    }

    stable = {
        "analysisVersion": "marlins-2025-open-roof-savant-adjudication-v1",
        "artifactKind": "marlins-savant-observation-corpus-adjudication",
        "stadiumId": "marlins",
        "sectionId": "SEC35",
        "sourceDates": sorted(source_dates),
        "reviewedOn": "2026-08-11",
        "inputs": {
            "frameIndexPath": str(arguments.frame_index_manifest.resolve()),
            "frameIndexSha256": hashlib.sha256(frame_bytes).hexdigest(),
            "frameIndexArtifactVersion": frame_index["artifactVersion"],
            "observedBoundaryInventoryPath": str(
                arguments.observed_boundary_inventory.resolve()
            ),
            "observedBoundaryInventorySha256": hashlib.sha256(
                inventory_bytes
            ).hexdigest(),
            "observedBoundaryInventoryArtifactVersion": inventory[
                "artifactVersion"
            ],
        },
        "reviewedCandidates": reviewed_candidates,
        "acceptedBoundariesOutsideCorpus": [accepted_outside_corpus],
        "summary": {
            "candidateCount": len(reviewed_candidates),
            "reviewSheetCount": len(reviewed_candidates),
            "sampleCount": sum(
                candidate["sampleCount"] for candidate in reviewed_candidates
            ),
            "sourceDateCount": len(source_dates),
            "section35RegionVisibleCandidateCount": len(SECTION35_REGION_VISIBLE),
            "nativeResolutionFollowUpCandidateCount": 1,
            "exactObservedBoundaryInCorpusCount": 0,
            "existingExactBoundaryOutsideCorpusCrossReferenceCount": 1,
            "newCountedObservedBoundaryCount": 0,
            "newScoredShadowHoldoutCount": 0,
            "minimumSolarAltitudeDegrees": min(altitudes),
            "maximumSolarAltitudeDegrees": max(altitudes),
            "solarAltitudeSpanDegrees": round(max(altitudes) - min(altitudes), 2),
        },
        "evidenceSemantics": {
            "corpusSolarAltitudeSpanIsBoundarySolarAltitudeSpan": False,
            "regionVisibilityIsExactRowBoundary": False,
            "existingOutsideCorpusBoundaryIncreasesNewObservationCount": False,
            "statement": (
                "All 65 open-roof corpus review sheets and 2,608 indexed samples were "
                "manually reviewed. No clip establishes a Section 35 within-bank exact "
                "row transition. The accepted May 7 boundary is an independently locked "
                "official in-play event outside this 65-clip corpus and was already "
                "counted in the observed-boundary inventory."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "NO_WITHIN_CORPUS_EXACT_ROW_BOUNDARIES",
                "CORPUS_SOLAR_SPAN_CANNOT_BE_USED_AS_BOUNDARY_SOLAR_SPAN",
                "NO_NEW_COUNTED_OBSERVATIONS",
                "NO_GEOMETRY_PREDICTIONS_ATTACHED",
                "NO_SCORED_SHADOW_HOLDOUTS",
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(
        json.dumps(artifact, indent=2) + "\n", encoding="utf-8"
    )
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "summary": artifact["summary"],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
