#!/usr/bin/env python3
"""Build a checksum-locked panorama review queue without asserting shade labels."""

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


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("solar_windows", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--candidate-index", type=int, action="append", default=[])
    parser.add_argument("--visible-row-scope", default="pending panorama ray review")
    args = parser.parse_args()

    source_bytes = args.solar_windows.read_bytes()
    source = json.loads(source_bytes)
    requested = set(args.candidate_index)
    indexed_candidates = list(enumerate(source["candidates"], start=1))
    candidates = [
        (index, item)
        for index, item in indexed_candidates
        if not requested or index in requested
    ]
    selected_indices = {index for index, _ in candidates}
    if requested and requested != selected_indices:
        missing = sorted(requested - selected_indices)
        raise ValueError(f"Candidate indices were not found: {missing}")
    if not candidates:
        raise ValueError("No candidates selected")

    queue = []
    for index, item in candidates:
        queue.append(
            {
                "candidateIndex": index,
                "candidateId": item["candidateId"],
                "eventMidpointTime": item["midpointTime"],
                "solarPosition": item["solarPositionAtMidpoint"],
                "manualDecision": {
                    "reviewer": "not-yet-reviewed",
                    "reviewedAt": None,
                    "cameraView": "not-applicable-panorama-ray-query",
                    "directSunEvidence": "pending-reference-sky-classification",
                    "rowBankState": "pending-boundary-review",
                    "visibleRowScope": args.visible_row_scope,
                    "notes": "Queue membership does not assert a shade or sun label.",
                },
            }
        )

    stable = {
        "solarWindowsSha256": hashlib.sha256(source_bytes).hexdigest(),
        "candidateIndices": [item["candidateIndex"] for item in queue],
        "candidateIds": [item["candidateId"] for item in queue],
        "visibleRowScope": args.visible_row_scope,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "panorama-pending-review-queue-v1",
        "artifactStage": "panorama-solar-ray-review-queue",
        "artifactVersion": fingerprint(stable),
        "inputs": {
            "solarWindowsPath": str(args.solar_windows),
            "solarWindowsSha256": stable["solarWindowsSha256"],
        },
        "manualReviewQueue": queue,
        "publicationEligible": False,
        "blockers": ["SHADE_AND_SUN_LABELS_NOT_YET_CLASSIFIED"],
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(args.output_json),
                "candidateCount": len(queue),
                "artifactVersion": artifact["artifactVersion"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
