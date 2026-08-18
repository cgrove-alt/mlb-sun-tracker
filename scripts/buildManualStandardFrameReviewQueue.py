#!/usr/bin/env python3
"""Build a checksum-locked manual standard-camera frame review queue."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_manifest", type=Path)
    parser.add_argument("selections", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    manifest_bytes = arguments.frame_manifest.read_bytes()
    selections_bytes = arguments.selections.read_bytes()
    manifest = json.loads(manifest_bytes)
    selection_input = json.loads(selections_bytes)
    candidates = {item["candidateIndex"]: item for item in manifest["candidates"]}
    queue: list[dict[str, Any]] = []
    seen: set[tuple[int, int]] = set()

    for decision in selection_input["selections"]:
        identity = (decision["candidateIndex"], decision["sampleIndex"])
        if identity in seen:
            raise ValueError(f"Duplicate manual selection: {identity}")
        seen.add(identity)
        candidate = candidates[decision["candidateIndex"]]
        indexed = next(
            item
            for item in candidate["frames"]
            if item["sampleIndex"] == decision["sampleIndex"]
        )
        thumbnail_path = Path(indexed["thumbnailPath"])
        if sha256_file(thumbnail_path) != indexed["thumbnailSha256"]:
            raise ValueError(f"Thumbnail checksum changed: {thumbnail_path}")
        if candidate["eventWindowSeconds"] > 30.0:
            raise ValueError(
                f"Event window exceeds the 30 second gate: {candidate['candidateIndex']}"
            )
        if decision["cameraView"] != "standard-center-field-home-plate":
            raise ValueError("Only the standard center-field home-plate view is accepted")
        if decision["directSunEvidence"] not in {
            "hard-edged-field-shadow",
            "high-contrast-sunlit-field-patch",
        }:
            raise ValueError("Manual selection lacks an accepted direct-sun cue")
        if decision["rowBankState"] not in {
            "shade",
            "sun",
            "mixed",
            "pending-boundary-review",
        }:
            raise ValueError("Row bank state is not a supported review state")
        queue.append(
            {
                "candidateIndex": candidate["candidateIndex"],
                "candidateId": candidate["candidateId"],
                "eventMidpointTime": candidate["eventMidpointTime"],
                "eventWindowSeconds": candidate["eventWindowSeconds"],
                "solarPosition": candidate["solarPosition"],
                "sampleIndex": indexed["sampleIndex"],
                "frameIndex": indexed["frameIndex"],
                "seconds": indexed["seconds"],
                "thumbnailPath": str(thumbnail_path),
                "thumbnailSha256": indexed["thumbnailSha256"],
                "decodedPixelsSha256": indexed["decodedPixelsSha256"],
                "acceptedForManualReview": True,
                "manualDecision": {
                    "reviewer": selection_input["reviewer"],
                    "reviewedAt": selection_input["reviewedAt"],
                    "cameraView": decision["cameraView"],
                    "directSunEvidence": decision["directSunEvidence"],
                    "rowBankState": decision["rowBankState"],
                    "visibleRowScope": decision["visibleRowScope"],
                    "notes": decision["notes"],
                },
            }
        )

    artifact_without_version = {
        "schemaVersion": 1,
        "analysisVersion": "checksum-locked-manual-camera-review-v1",
        "artifactStage": "official-mlb-standard-homeplate-camera-review-queue",
        "inputs": {
            "frameManifestPath": str(arguments.frame_manifest),
            "frameManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "manualSelectionsPath": str(arguments.selections),
            "manualSelectionsSha256": hashlib.sha256(selections_bytes).hexdigest(),
        },
        "manualReviewQueue": queue,
        "acceptedCount": len(queue),
        "reviewPolicy": {
            "cameraView": "standard center-field home-plate live view",
            "atmosphericVisibility": "visible direct-sun cue in the same exact frame",
            "rowBank": (
                "home-plate D and E bank visibly sunlit, shaded, mixed, or explicitly "
                "pending row-boundary review"
            ),
            "eventWindowMaximumSeconds": 30.0,
            "automatedCameraMatchRequired": False,
            "automatedCameraMatchReason": (
                "Manual visual review is authoritative for camera identity. The automated "
                "matcher is only a triage queue and can reject genuine views after graphics "
                "or framing changes."
            ),
        },
        "publicationEligible": False,
        "blockers": [
            "EXACT_FULL_RESOLUTION_FRAMES_NOT_EXTRACTED",
            "ROW_BOUNDARY_LABELS_NOT_SCORED",
            "SHADOW_MODEL_UNCERTAINTY_NOT_PROPAGATED",
        ],
    }
    artifact = {
        **artifact_without_version,
        "artifactVersion": artifact_version(artifact_without_version),
    }
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "acceptedCount": len(queue),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
