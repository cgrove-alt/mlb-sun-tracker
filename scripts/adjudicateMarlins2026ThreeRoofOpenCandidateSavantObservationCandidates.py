#!/usr/bin/env python3
"""Lock manual review of three 2026 Marlins roof-open-candidate corpora."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


NATIVE_SECTION35_REVIEW = {
    3: {
        "reviewedSamples": [10, 11, 12, 13, 14],
        "rowBankVisibleAtRowResolution": True,
    },
    11: {
        "reviewedSamples": [9, 10, 11, 12, 13, 14],
        "rowBankVisibleAtRowResolution": True,
    },
    13: {
        "reviewedSamples": [10, 11, 12, 13, 14, 15, 16, 17],
        "rowBankVisibleAtRowResolution": True,
    },
    15: {
        "reviewedSamples": [10, 11, 12, 13, 14],
        "rowBankVisibleAtRowResolution": True,
    },
    29: {
        "reviewedSamples": [12, 13, 14, 15, 16, 17, 18, 19, 20],
        "rowBankVisibleAtRowResolution": False,
    },
}

EXPECTED_GAME_DATES = {
    823893: "2026-03-27",
    823888: "2026-03-31",
    823883: "2026-04-17",
}


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


def node_artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, separators=(",", ":")).encode("utf-8")
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


def validate_python_versioned_artifact(
    artifact: dict[str, Any], label: str
) -> None:
    stable = {key: value for key, value in artifact.items() if key != "artifactVersion"}
    if artifact.get("artifactVersion") != artifact_version(stable):
        raise ValueError(f"{label} artifact version does not reproduce")


def validate_condition_artifact(artifact: dict[str, Any]) -> None:
    if artifact.get("artifactKind") != "official-mlb-home-game-condition-audit":
        raise ValueError("Input is not an official MLB home-game condition audit")
    stable = {
        "inputArtifactVersion": artifact.get("inputArtifactVersion"),
        "teamId": artifact.get("teamId"),
        "venueId": artifact.get("venueId"),
        "records": artifact.get("records"),
    }
    if artifact.get("artifactVersion") != node_artifact_version(stable):
        raise ValueError("Condition-audit artifact version does not reproduce")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_index_manifest", type=Path)
    parser.add_argument("native_review_manifest", type=Path)
    parser.add_argument("condition_audit", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    frame_bytes = arguments.frame_index_manifest.read_bytes()
    frame_index = json.loads(frame_bytes)
    if frame_index.get("artifactStage") != "official-mlb-observation-frame-review-index":
        raise ValueError("Input is not an official MLB observation frame index")
    validate_python_versioned_artifact(frame_index, "frame index")
    expected_scope = {
        "sourceCandidateCount": 39,
        "candidateCount": 39,
        "unavailableCount": 0,
        "totalSampleCount": 960,
    }
    for key, expected in expected_scope.items():
        if frame_index.get(key) != expected:
            raise ValueError(f"Frame index {key} changed")

    native_bytes = arguments.native_review_manifest.read_bytes()
    native_review = json.loads(native_bytes)
    if native_review.get("artifactStage") != (
        "official-mlb-full-resolution-shadow-observation-review"
    ):
        raise ValueError("Input is not a full-resolution observation review")
    validate_python_versioned_artifact(native_review, "native review")
    if native_review.get("frameCount") != 33:
        raise ValueError("Native review frame count changed")

    condition_bytes = arguments.condition_audit.read_bytes()
    condition_audit = json.loads(condition_bytes)
    validate_condition_artifact(condition_audit)
    condition_records = {
        record["gamePk"]: record for record in condition_audit.get("records", [])
    }
    reviewed_conditions: list[dict[str, Any]] = []
    for game_pk, source_date in EXPECTED_GAME_DATES.items():
        record = condition_records.get(game_pk)
        if record is None:
            raise ValueError(f"Game {game_pk} is absent from condition audit")
        if record.get("officialDate") != source_date:
            raise ValueError(f"Game {game_pk} source date changed")
        if record.get("condition") != "Partly Cloudy":
            raise ValueError(f"Game {game_pk} official weather condition changed")
        if record.get("roofOpenCandidate") is not True:
            raise ValueError(f"Game {game_pk} is no longer a roof-open candidate")
        reviewed_conditions.append(
            {
                "gamePk": game_pk,
                "sourceDate": source_date,
                "officialCondition": record["condition"],
                "roofOpenCandidate": True,
                "roofOpenEstablishedByConditionField": False,
                "sourceUrl": record["sourceUrl"],
                "sourceSha256": record["sourceSha256"],
            }
        )

    native_by_candidate: dict[int, list[dict[str, Any]]] = {}
    for frame in native_review["frames"]:
        output_path = require_locked_file(
            frame["outputPath"],
            frame["outputPngSha256"],
            f"native review frame {frame['candidateIndex']}:{frame['sampleIndex']}",
        )
        record = {**frame, "outputPath": str(output_path.resolve())}
        native_by_candidate.setdefault(frame["candidateIndex"], []).append(record)

    reviewed_candidates: list[dict[str, Any]] = []
    native_observations: list[dict[str, Any]] = []
    source_dates: set[str] = set()
    for candidate in frame_index["candidates"]:
        candidate_index = candidate["candidateIndex"]
        source_date = candidate["eventMidpointTime"][:10]
        source_dates.add(source_date)
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

        native_config = NATIVE_SECTION35_REVIEW.get(candidate_index)
        if native_config is not None:
            native_frames = sorted(
                native_by_candidate.get(candidate_index, []),
                key=lambda item: item["sampleIndex"],
            )
            actual_samples = [item["sampleIndex"] for item in native_frames]
            if actual_samples != native_config["reviewedSamples"]:
                raise ValueError(
                    f"Candidate {candidate_index} native review sample scope changed"
                )
            at_row_resolution = native_config["rowBankVisibleAtRowResolution"]
            native_observations.append(
                {
                    "candidateIndex": candidate_index,
                    "candidateId": candidate["candidateId"],
                    "sourceDate": source_date,
                    "eventMidpointTime": candidate["eventMidpointTime"],
                    "eventWindowSeconds": candidate["eventWindowSeconds"],
                    "solarPosition": candidate["solarPosition"],
                    "reviewedSamples": actual_samples,
                    "nativeFrames": [
                        {
                            "sampleIndex": item["sampleIndex"],
                            "frameIndex": item["frameIndex"],
                            "seconds": item["seconds"],
                            "decodedPixelsSha256": item["decodedPixelsSha256"],
                            "outputPath": item["outputPath"],
                            "outputPngSha256": item["outputPngSha256"],
                        }
                        for item in native_frames
                    ],
                    "section35RegionIdentifiable": True,
                    "section35RowBankVisibleAtRowResolution": at_row_resolution,
                    "directSolarIlluminationOfSection35Established": False,
                    "withinBankShadeBoundaryVisible": False,
                    "countedObservedBoundary": False,
                    "scoredShadowHoldout": False,
                    "decision": (
                        "ROW_BANK_VISIBLE_BUT_NO_EXACT_SHADE_TRANSITION"
                        if at_row_resolution
                        else "REGION_VISIBLE_BUT_NOT_AT_EXACT_ROW_RESOLUTION"
                    ),
                }
            )
            decision = (
                "ROW_BANK_VISIBLE_BUT_NO_EXACT_SHADE_TRANSITION"
                if at_row_resolution
                else "REGION_VISIBLE_BUT_NOT_AT_EXACT_ROW_RESOLUTION"
            )
            target_visible = True
        else:
            decision = "NO_EXACT_SECTION35_ROW_BOUNDARY_ESTABLISHED"
            target_visible = False

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
                "section35RegionIdentifiable": target_visible,
                "nativeResolutionFollowUpCompleted": native_config is not None,
                "withinBankShadeBoundaryAccepted": False,
                "countedObservedBoundary": False,
                "scoredShadowHoldout": False,
                "decision": decision,
            }
        )

    if source_dates != set(EXPECTED_GAME_DATES.values()):
        raise ValueError("Source-date scope changed")
    if sorted(native_by_candidate) != sorted(NATIVE_SECTION35_REVIEW):
        raise ValueError("Native review contains an unexpected candidate")
    if len(native_observations) != 5:
        raise ValueError("Native observation count changed")

    altitudes = [
        candidate["solarPosition"]["altitudeDegrees"]
        for candidate in reviewed_candidates
    ]
    native_altitudes = [
        observation["solarPosition"]["altitudeDegrees"]
        for observation in native_observations
    ]
    stable = {
        "analysisVersion": (
            "marlins-2026-three-roof-open-candidate-savant-adjudication-v1"
        ),
        "artifactKind": "marlins-savant-observation-corpus-adjudication",
        "stadiumId": "marlins",
        "sectionId": "SEC35",
        "sourceDates": sorted(source_dates),
        "reviewedOn": "2026-08-11",
        "inputs": {
            "frameIndexPath": str(arguments.frame_index_manifest.resolve()),
            "frameIndexSha256": hashlib.sha256(frame_bytes).hexdigest(),
            "frameIndexArtifactVersion": frame_index["artifactVersion"],
            "nativeReviewPath": str(arguments.native_review_manifest.resolve()),
            "nativeReviewSha256": hashlib.sha256(native_bytes).hexdigest(),
            "nativeReviewArtifactVersion": native_review["artifactVersion"],
            "conditionAuditPath": str(arguments.condition_audit.resolve()),
            "conditionAuditSha256": hashlib.sha256(condition_bytes).hexdigest(),
            "conditionAuditArtifactVersion": condition_audit["artifactVersion"],
        },
        "officialGameConditions": sorted(
            reviewed_conditions, key=lambda item: item["sourceDate"]
        ),
        "reviewedCandidates": reviewed_candidates,
        "nativeSection35Observations": native_observations,
        "summary": {
            "candidateCount": len(reviewed_candidates),
            "reviewSheetCount": len(reviewed_candidates),
            "sampleCount": sum(
                candidate["sampleCount"] for candidate in reviewed_candidates
            ),
            "sourceDateCount": len(source_dates),
            "officialRoofOpenCandidateDateCount": len(reviewed_conditions),
            "nativeResolutionFollowUpCandidateCount": len(native_observations),
            "nativeReviewedFrameCount": sum(
                len(observation["nativeFrames"])
                for observation in native_observations
            ),
            "section35RegionIdentifiableCandidateCount": len(native_observations),
            "section35RowBankVisibleAtRowResolutionCandidateCount": sum(
                1
                for observation in native_observations
                if observation["section35RowBankVisibleAtRowResolution"]
            ),
            "directSolarIlluminationOfSection35EstablishedCount": 0,
            "exactObservedBoundaryCount": 0,
            "newCountedObservedBoundaryCount": 0,
            "newScoredShadowHoldoutCount": 0,
            "minimumCandidateSolarAltitudeDegrees": min(altitudes),
            "maximumCandidateSolarAltitudeDegrees": max(altitudes),
            "candidateSolarAltitudeSpanDegrees": round(
                max(altitudes) - min(altitudes), 2
            ),
            "minimumNativeReviewSolarAltitudeDegrees": min(native_altitudes),
            "maximumNativeReviewSolarAltitudeDegrees": max(native_altitudes),
            "nativeReviewSolarAltitudeSpanDegrees": round(
                max(native_altitudes) - min(native_altitudes), 2
            ),
        },
        "evidenceSemantics": {
            "officialNonClosedConditionEstablishesRoofOpen": False,
            "corpusSolarAltitudeSpanIsBoundarySolarAltitudeSpan": False,
            "uniformLowLightIsExactRowBoundary": False,
            "regionVisibilityIsExactRowBoundary": False,
            "statement": (
                "All 39 candidate review sheets and 960 indexed samples were manually "
                "reviewed. Thirty-three checksum-locked native frames across five "
                "promising candidates were also reviewed. The official Partly Cloudy "
                "condition makes each game a roof-open candidate, not proof that the "
                "roof was open or that Section 35 received direct sunlight. No native "
                "frame contains a defensible within-bank exact-row shade transition."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "NO_WITHIN_CORPUS_EXACT_ROW_BOUNDARIES",
                "CORPUS_SOLAR_SPAN_CANNOT_BE_USED_AS_BOUNDARY_SOLAR_SPAN",
                "DIRECT_SOLAR_ILLUMINATION_OF_TARGET_BANK_NOT_ESTABLISHED",
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
