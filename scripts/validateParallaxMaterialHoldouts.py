#!/usr/bin/env python3
"""Validate parallax material predictions against locked manual holdouts."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("review_queue", type=Path)
    parser.add_argument("reviewed_holdouts", type=Path)
    parser.add_argument("output_json", type=Path)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    args = parse_args()
    queue = json.loads(args.review_queue.read_text())
    reviewed = json.loads(args.reviewed_holdouts.read_text())
    if queue.get("artifactKind") != "parallax-material-holdout-review-queue":
        raise ValueError("Input is not a parallax material review queue")
    if reviewed.get("reviewStatus") != "complete":
        raise ValueError("Manual material review is incomplete")
    if reviewed["inputs"]["reviewQueue"]["sha256"] != sha256_file(args.review_queue):
        raise ValueError("Reviewed holdouts do not lock the supplied queue")
    contact_path = Path(reviewed["inputs"]["contactSheet"]["path"])
    if reviewed["inputs"]["contactSheet"]["sha256"] != sha256_file(contact_path):
        raise ValueError("Reviewed contact-sheet hash does not match")
    queued = {item["holdoutId"]: item for item in queue["manualReviewQueue"]}
    decisions = {item["holdoutId"]: item for item in reviewed["decisions"]}
    if len(queued) != len(queue["manualReviewQueue"]):
        raise ValueError("Review queue contains duplicate holdout IDs")
    if len(decisions) != len(reviewed["decisions"]):
        raise ValueError("Manual decisions contain duplicate holdout IDs")
    if set(queued) != set(decisions):
        raise ValueError("Manual decisions must cover the review queue exactly")
    prediction_to_material = {
        "confirmed-fixed-envelope": "fixed-structure",
        "confirmed-movable-background-envelope": "movable-roof-background",
    }
    results = []
    for holdout_id, item in queued.items():
        prediction = prediction_to_material.get(item["predictedEnvelopeClass"])
        if prediction is None:
            raise ValueError("Review queue contains a non-confirmed prediction")
        observed = decisions[holdout_id]["material"]
        if observed not in set(prediction_to_material.values()):
            raise ValueError("Manual decision uses an unknown material label")
        results.append({
            "holdoutId": holdout_id,
            "candidateId": item["candidateId"],
            "seatId": item["seatId"],
            "directionIndex": item["directionIndex"],
            "predictedMaterial": prediction,
            "observedMaterial": observed,
            "agree": prediction == observed,
        })
    agreement_count = sum(bool(result["agree"]) for result in results)
    fixed = [result for result in results if result["observedMaterial"] == "fixed-structure"]
    movable = [
        result
        for result in results
        if result["observedMaterial"] == "movable-roof-background"
    ]
    candidate_ids = sorted(set(result["candidateId"] for result in results))
    stable = {
        "inputs": {
            "reviewQueue": {
                "path": str(args.review_queue),
                "sha256": sha256_file(args.review_queue),
                "artifactVersion": queue["artifactVersion"],
            },
            "reviewedHoldouts": {
                "path": str(args.reviewed_holdouts),
                "sha256": sha256_file(args.reviewed_holdouts),
            },
            "contactSheet": reviewed["inputs"]["contactSheet"],
        },
        "results": results,
    }
    all_agree = agreement_count == len(results)
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "parallax-material-holdout-validation-v1",
        "artifactStage": "independent-parallax-material-holdout-validation",
        "artifactVersion": fingerprint(stable),
        **stable,
        "summary": {
            "holdoutCount": len(results),
            "candidateCount": len(candidate_ids),
            "uniqueSeatCount": len(set(result["seatId"] for result in results)),
            "fixedStructureHoldoutCount": len(fixed),
            "movableRoofBackgroundHoldoutCount": len(movable),
            "agreementCount": agreement_count,
            "accuracyFraction": agreement_count / len(results),
        },
        "assessment": {
            "materialHoldoutValidationPassed": all_agree,
            "publicationEligible": False,
            "blockers": [
                "MATERIAL_HOLDOUTS_COVER_ONLY_SEC35_AND_TWO_2026_SOLAR_DIRECTIONS",
                "INDEPENDENT_SHADOW_BOUNDARY_HOLDOUT_REMAINS_REQUIRED",
                "PARKED_OPEN_ROOF_PANEL_GEOMETRY_REMAINS_REQUIRED",
            ],
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "summary": artifact["summary"],
        "materialHoldoutValidationPassed": all_agree,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
