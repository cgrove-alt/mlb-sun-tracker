#!/usr/bin/env python3
"""Lock the complete manual review of the April 18, 2026 Savant corpus."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


EXACT_BOUNDARY_ARTIFACTS = {
    28: "tmp/lidar/marlins-2026-04-18-c028-sec35-observed-shade-boundary-v1.json",
    32: "tmp/lidar/marlins-2026-04-18-c032-sec35-observed-shade-boundary-v1.json",
    33: "tmp/lidar/marlins-2026-04-18-sec35-observed-shade-boundary-v1.json",
}

CENSORED_ALL_SHADED = {
    5: {
        "reviewedSamples": [10, 11, 12, 13, 14],
        "finding": (
            "The center-field Section 35 row bank is identifiable at native resolution, "
            "but every visible row is shaded. No within-bank sun/shade boundary exists to "
            "label or score."
        ),
    },
    14: {
        "reviewedSamples": [10, 11, 12, 13, 14, 15],
        "finding": (
            "The center-field Section 35 row bank is identifiable at native resolution, "
            "but every visible row is shaded. No within-bank sun/shade boundary exists to "
            "label or score."
        ),
    },
    17: {
        "reviewedSamples": [10, 11, 12, 13, 14, 15],
        "finding": (
            "The center-field Section 35 row bank is identifiable at native resolution, "
            "but every visible row is shaded. No within-bank sun/shade boundary exists to "
            "label or score."
        ),
    },
    41: {
        "reviewedSamples": [9, 10, 11, 12, 13, 14],
        "finding": (
            "The center-field Section 35 row bank is identifiable at native resolution, "
            "but every visible row is shaded. No within-bank sun/shade boundary exists to "
            "label or score."
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


def validate_versioned_artifact(artifact: dict[str, Any], label: str) -> None:
    stable = {key: value for key, value in artifact.items() if key != "artifactVersion"}
    if artifact.get("artifactVersion") != artifact_version(stable):
        raise ValueError(f"{label} artifact version does not reproduce")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_index_manifest", type=Path)
    parser.add_argument("native_review_manifest", type=Path)
    parser.add_argument("observed_boundary_inventory", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    frame_bytes = arguments.frame_index_manifest.read_bytes()
    frame_index = json.loads(frame_bytes)
    if frame_index.get("artifactStage") != "official-mlb-observation-frame-review-index":
        raise ValueError("Input is not an official MLB observation frame index")
    validate_versioned_artifact(frame_index, "frame index")
    expected_scope = {
        "sourceCandidateCount": 58,
        "candidateCount": 58,
        "unavailableCount": 0,
        "totalSampleCount": 1461,
    }
    for key, expected in expected_scope.items():
        if frame_index.get(key) != expected:
            raise ValueError(f"Frame index {key} changed")

    native_bytes = arguments.native_review_manifest.read_bytes()
    native_review = json.loads(native_bytes)
    if native_review.get("artifactStage") != "official-mlb-full-resolution-shadow-observation-review":
        raise ValueError("Input is not a full-resolution observation review")
    validate_versioned_artifact(native_review, "native review")
    if native_review.get("frameCount") != 23:
        raise ValueError("Native review frame count changed")

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
    exact_observations: list[dict[str, Any]] = []
    censored_observations: list[dict[str, Any]] = []
    for candidate in frame_index["candidates"]:
        candidate_index = candidate["candidateIndex"]
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

        exact_path_value = EXACT_BOUNDARY_ARTIFACTS.get(candidate_index)
        censored = CENSORED_ALL_SHADED.get(candidate_index)
        if exact_path_value is not None:
            observation = inventory_observations.get(exact_path_value)
            if observation is None:
                raise ValueError(
                    f"Candidate {candidate_index} exact boundary is absent from inventory"
                )
            boundary_path = require_locked_file(
                exact_path_value,
                observation["artifactFileSha256"],
                f"candidate {candidate_index} exact boundary",
            )
            exact_record = {
                "candidateIndex": candidate_index,
                "candidateId": candidate["candidateId"],
                "eventMidpointTime": candidate["eventMidpointTime"],
                "solarPosition": candidate["solarPosition"],
                "artifactPath": str(boundary_path.resolve()),
                "artifactSha256": observation["artifactFileSha256"],
                "artifactVersion": observation["artifactVersion"],
                "maximumLabelUncertaintyRows": observation[
                    "maximumLabelUncertaintyRows"
                ],
                "timestampUncertaintySeconds": observation[
                    "timestampUncertaintySeconds"
                ],
                "countedObservedBoundary": True,
                "scoredShadowHoldout": False,
            }
            exact_observations.append(exact_record)
            decision = "EXACT_OBSERVED_BOUNDARY_ALREADY_IN_INVENTORY"
            target_visible = True
            all_visible_rows_shaded = False
            native_frame_records: list[dict[str, Any]] = []
        elif censored is not None:
            native_frame_records = sorted(
                native_by_candidate.get(candidate_index, []),
                key=lambda item: item["sampleIndex"],
            )
            actual_samples = [item["sampleIndex"] for item in native_frame_records]
            if actual_samples != censored["reviewedSamples"]:
                raise ValueError(
                    f"Candidate {candidate_index} native review sample scope changed"
                )
            censored_record = {
                "candidateIndex": candidate_index,
                "candidateId": candidate["candidateId"],
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
                    for item in native_frame_records
                ],
                "section35RowBankVisible": True,
                "allVisibleRowsShaded": True,
                "withinBankShadeBoundaryVisible": False,
                "countedObservedBoundary": False,
                "scoredShadowHoldout": False,
                "decision": "CENSORED_ALL_VISIBLE_ROWS_SHADED",
                "finding": censored["finding"],
            }
            censored_observations.append(censored_record)
            decision = "CENSORED_ALL_VISIBLE_ROWS_SHADED"
            target_visible = True
            all_visible_rows_shaded = True
        else:
            decision = "NO_EXACT_SECTION35_ROW_BOUNDARY_ESTABLISHED"
            target_visible = False
            all_visible_rows_shaded = False
            native_frame_records = []

        reviewed_candidates.append(
            {
                "candidateIndex": candidate_index,
                "candidateId": candidate["candidateId"],
                "eventMidpointTime": candidate["eventMidpointTime"],
                "eventWindowSeconds": candidate["eventWindowSeconds"],
                "solarPosition": candidate["solarPosition"],
                "videoPath": str(video_path.resolve()),
                "videoSha256": candidate["videoSha256"],
                "sampleCount": len(candidate["frames"]),
                "reviewSheetPath": str(review_sheet_path.resolve()),
                "reviewSheetSha256": candidate["reviewSheetSha256"],
                "manualVisualReviewCompleted": True,
                "section35RowBankVisibleAtRowResolution": target_visible,
                "allVisibleRowsShaded": all_visible_rows_shaded,
                "withinBankShadeBoundaryAccepted": exact_path_value is not None,
                "decision": decision,
            }
        )

    if sorted(native_by_candidate) != sorted(CENSORED_ALL_SHADED):
        raise ValueError("Native review contains an unexpected candidate")
    if len(exact_observations) != 3 or len(censored_observations) != 4:
        raise ValueError("Manual adjudication result count changed")

    censored_altitudes = [
        observation["solarPosition"]["altitudeDegrees"]
        for observation in censored_observations
    ]
    stable = {
        "analysisVersion": "marlins-2026-04-18-savant-observation-adjudication-v1",
        "artifactKind": "marlins-savant-observation-corpus-adjudication",
        "stadiumId": "marlins",
        "sectionId": "SEC35",
        "sourceDate": "2026-04-18",
        "reviewedOn": "2026-08-11",
        "inputs": {
            "frameIndexPath": str(arguments.frame_index_manifest.resolve()),
            "frameIndexSha256": hashlib.sha256(frame_bytes).hexdigest(),
            "frameIndexArtifactVersion": frame_index["artifactVersion"],
            "nativeReviewPath": str(arguments.native_review_manifest.resolve()),
            "nativeReviewSha256": hashlib.sha256(native_bytes).hexdigest(),
            "nativeReviewArtifactVersion": native_review["artifactVersion"],
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
        "exactObservedBoundaries": exact_observations,
        "censoredAllShadedObservations": censored_observations,
        "summary": {
            "candidateCount": len(reviewed_candidates),
            "reviewSheetCount": len(reviewed_candidates),
            "sampleCount": sum(
                candidate["sampleCount"] for candidate in reviewed_candidates
            ),
            "nativeReviewedFrameCount": sum(
                len(observation["nativeFrames"])
                for observation in censored_observations
            ),
            "exactObservedBoundaryCount": len(exact_observations),
            "censoredAllShadedObservationCount": len(censored_observations),
            "newCountedObservedBoundaryCount": 0,
            "newScoredShadowHoldoutCount": 0,
            "censoredMinimumSolarAltitudeDegrees": min(censored_altitudes),
            "censoredMaximumSolarAltitudeDegrees": max(censored_altitudes),
            "censoredSolarAltitudeSpanDegrees": round(
                max(censored_altitudes) - min(censored_altitudes), 2
            ),
        },
        "evidenceSemantics": {
            "allShadedStateIsExactRowBoundary": False,
            "allShadedStateIncreasesObservedBoundaryCount": False,
            "allShadedStateIncreasesScoredHoldoutCount": False,
            "allShadedStateIncreasesBoundarySolarAltitudeSpan": False,
            "statement": (
                "A fully shaded visible row bank is censored state evidence. Without a "
                "within-bank boundary, it cannot produce an exact-row error and is not "
                "counted as an observed boundary or scored shadow holdout."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "NO_NEW_WITHIN_BANK_EXACT_ROW_BOUNDARIES",
                "CENSORED_ALL_SHADED_STATES_CANNOT_BE_ROW_ERROR_HOLDOUTS",
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
