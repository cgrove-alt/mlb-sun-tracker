#!/usr/bin/env python3
"""Lock the complete manual review of the 2021 low-sun Savant corpus."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


TARGET_REGION_VISIBLE = {1, 2, 3, 4, 12}
OPEN_ROOF_PROOF = {
    9: {
        "sourceDate": "2021-04-05",
        "reviewedSamples": [29, 30],
    },
    17: {
        "sourceDate": "2021-04-06",
        "reviewedSamples": [1, 2, 3],
    },
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
    parser.add_argument("native_review_manifest", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    frame_bytes = arguments.frame_index_manifest.read_bytes()
    frame_index = json.loads(frame_bytes)
    if frame_index.get("artifactStage") != "official-mlb-observation-frame-review-index":
        raise ValueError("Input is not an official MLB observation frame index")
    validate_versioned_artifact(frame_index, "frame index")
    expected_scope = {
        "sourceCandidateCount": 19,
        "candidateCount": 19,
        "unavailableCount": 0,
        "totalSampleCount": 519,
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
    validate_versioned_artifact(native_review, "native review")
    if native_review.get("frameCount") != 5:
        raise ValueError("Native review frame count changed")

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
    roof_condition_observations: list[dict[str, Any]] = []
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

        roof_proof = OPEN_ROOF_PROOF.get(candidate_index)
        if roof_proof is not None:
            if source_date != roof_proof["sourceDate"]:
                raise ValueError(f"Candidate {candidate_index} date changed")
            native_frames = sorted(
                native_by_candidate.get(candidate_index, []),
                key=lambda item: item["sampleIndex"],
            )
            actual_samples = [item["sampleIndex"] for item in native_frames]
            if actual_samples != roof_proof["reviewedSamples"]:
                raise ValueError(
                    f"Candidate {candidate_index} native review sample scope changed"
                )
            roof_condition_observations.append(
                {
                    "candidateIndex": candidate_index,
                    "candidateId": candidate["candidateId"],
                    "sourceDate": source_date,
                    "eventMidpointTime": candidate["eventMidpointTime"],
                    "solarPosition": candidate["solarPosition"],
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
                    "broadcastGraphicText": (
                        "THE ROOF IS OPEN FOR TONIGHT'S GAME"
                    ),
                    "roofOpenConditionAccepted": True,
                    "directSolarIlluminationEstablished": False,
                    "section35ShadeBoundaryEstablished": False,
                    "countedObservedBoundary": False,
                    "scoredShadowHoldout": False,
                }
            )

        region_visible = candidate_index in TARGET_REGION_VISIBLE
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
                "directSolarIlluminationEstablished": False,
                "withinBankShadeBoundaryAccepted": False,
                "decision": (
                    "SECTION35_REGION_VISIBLE_BUT_NO_EXACT_ROW_BOUNDARY"
                    if region_visible
                    else "NO_EXACT_SECTION35_ROW_BOUNDARY_ESTABLISHED"
                ),
            }
        )

    if sorted(native_by_candidate) != sorted(OPEN_ROOF_PROOF):
        raise ValueError("Native review contains an unexpected candidate")
    if source_dates != {"2021-04-05", "2021-04-06"}:
        raise ValueError("Source-date scope changed")
    if len(roof_condition_observations) != 2:
        raise ValueError("Open-roof observation count changed")

    altitudes = [
        candidate["solarPosition"]["altitudeDegrees"]
        for candidate in reviewed_candidates
    ]
    stable = {
        "analysisVersion": "marlins-2021-low-sun-savant-adjudication-v1",
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
        },
        "reviewedCandidates": reviewed_candidates,
        "roofConditionObservations": roof_condition_observations,
        "summary": {
            "candidateCount": len(reviewed_candidates),
            "reviewSheetCount": len(reviewed_candidates),
            "sampleCount": sum(
                candidate["sampleCount"] for candidate in reviewed_candidates
            ),
            "sourceDateCount": len(source_dates),
            "nativeReviewedFrameCount": sum(
                len(observation["nativeFrames"])
                for observation in roof_condition_observations
            ),
            "openRoofDateCount": len(roof_condition_observations),
            "section35RegionVisibleCandidateCount": len(TARGET_REGION_VISIBLE),
            "exactObservedBoundaryCount": 0,
            "newCountedObservedBoundaryCount": 0,
            "newScoredShadowHoldoutCount": 0,
            "minimumSolarAltitudeDegrees": min(altitudes),
            "maximumSolarAltitudeDegrees": max(altitudes),
            "solarAltitudeSpanDegrees": round(max(altitudes) - min(altitudes), 2),
        },
        "evidenceSemantics": {
            "openRoofConditionIsExactRowBoundary": False,
            "openRoofConditionEstablishesDirectSolarIllumination": False,
            "uniformLowLightIsExactRowBoundary": False,
            "statement": (
                "The broadcast graphic establishes that the roof was open on both "
                "dates. It does not establish direct solar illumination or a visible "
                "within-bank row boundary. Uniform dusk illumination cannot be converted "
                "into an exact row label."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "NO_WITHIN_BANK_EXACT_ROW_BOUNDARIES",
                "TARGET_SECTION_NOT_VISIBLE_AT_EXACT_ROW_RESOLUTION",
                "DIRECT_SOLAR_ILLUMINATION_NOT_ESTABLISHED",
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
