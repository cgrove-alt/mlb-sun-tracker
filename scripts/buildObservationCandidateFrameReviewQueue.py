#!/usr/bin/env python3
"""Build a checksum-locked full-frame review queue for selected candidates."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def candidate_sample(value: str) -> tuple[int, int]:
    try:
        candidate_text, sample_text = value.split(":", 1)
        candidate_index = int(candidate_text)
        sample_index = int(sample_text)
    except ValueError as error:
        raise argparse.ArgumentTypeError(
            "Candidate sample selections must use CANDIDATE:SAMPLE"
        ) from error
    if candidate_index < 1 or sample_index < 1:
        raise argparse.ArgumentTypeError(
            "Candidate and sample indices must both be positive"
        )
    return candidate_index, sample_index


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame_manifest", type=Path)
    parser.add_argument("output_json", type=Path)
    candidate_selection = parser.add_mutually_exclusive_group(required=True)
    candidate_selection.add_argument("--candidate-index", type=int, action="append")
    candidate_selection.add_argument("--all-candidates", action="store_true")
    candidate_selection.add_argument(
        "--candidate-sample",
        type=candidate_sample,
        action="append",
        help="Select an exact frame using CANDIDATE:SAMPLE; repeat as needed",
    )
    parser.add_argument("--first-sample", type=int, default=0)
    parser.add_argument("--last-sample", type=int)
    arguments = parser.parse_args()
    if arguments.first_sample < 0:
        raise ValueError("First sample must be nonnegative")
    if (
        arguments.last_sample is not None
        and arguments.last_sample < arguments.first_sample
    ):
        raise ValueError("Last sample precedes first sample")

    manifest_bytes = arguments.frame_manifest.read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get("artifactStage") != "official-mlb-observation-frame-review-index":
        raise ValueError("Input is not an official MLB observation frame index")
    candidates = {item["candidateIndex"]: item for item in manifest["candidates"]}
    exact_selections = list(dict.fromkeys(arguments.candidate_sample or []))
    requested = sorted(candidates) if arguments.all_candidates else list(
        dict.fromkeys(
            arguments.candidate_index
            or [candidate_index for candidate_index, _ in exact_selections]
        )
    )
    missing = [candidate_index for candidate_index in requested if candidate_index not in candidates]
    if missing:
        raise ValueError(f"Unknown candidate indices: {missing}")

    queue: list[dict[str, Any]] = []
    exact_selection_set = set(exact_selections)
    found_exact_selections: set[tuple[int, int]] = set()
    for candidate_index in requested:
        candidate = candidates[candidate_index]
        for frame in candidate["frames"]:
            sample_index = int(frame["sampleIndex"])
            if exact_selection_set and (candidate_index, sample_index) not in exact_selection_set:
                continue
            if sample_index < arguments.first_sample:
                continue
            if arguments.last_sample is not None and sample_index > arguments.last_sample:
                continue
            thumbnail = Path(frame["thumbnailPath"])
            if sha256_file(thumbnail) != frame["thumbnailSha256"]:
                raise ValueError(f"Thumbnail checksum changed: {thumbnail}")
            found_exact_selections.add((candidate_index, sample_index))
            queue.append(
                {
                    "candidateIndex": candidate_index,
                    "candidateId": candidate["candidateId"],
                    "eventMidpointTime": candidate["eventMidpointTime"],
                    "eventWindowSeconds": candidate["eventWindowSeconds"],
                    "solarPosition": candidate["solarPosition"],
                    "sampleIndex": sample_index,
                    "frameIndex": frame["frameIndex"],
                    "seconds": frame["seconds"],
                    "thumbnailPath": str(thumbnail),
                    "thumbnailSha256": frame["thumbnailSha256"],
                }
            )
    missing_exact_selections = sorted(exact_selection_set - found_exact_selections)
    if missing_exact_selections:
        raise ValueError(
            f"Unknown candidate/sample selections: {missing_exact_selections}"
        )
    if not queue:
        raise ValueError("Requested sample interval selected no frames")

    stable = {
        "input": {
            "frameManifestPath": str(arguments.frame_manifest),
            "frameManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "frameManifestArtifactVersion": manifest.get("artifactVersion"),
        },
        "candidateIndices": requested,
        "candidateSampleSelections": [
            {"candidateIndex": candidate_index, "sampleIndex": sample_index}
            for candidate_index, sample_index in exact_selections
        ],
        "sampleIntervalInclusive": [arguments.first_sample, arguments.last_sample],
        "manualReviewQueue": queue,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "selected-candidate-dense-frame-review-queue-v2",
        "artifactStage": "official-mlb-full-frame-manual-review-queue",
        "artifactVersion": artifact_version(stable),
        **stable,
        "publicationEligible": False,
        "note": (
            "Queue construction selects frames only and does not identify a section, "
            "confirm a live broadcast frame, or label a shade boundary."
        ),
    }
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output_json),
                "artifactVersion": artifact["artifactVersion"],
                "candidateCount": len(requested),
                "frameCount": len(queue),
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
