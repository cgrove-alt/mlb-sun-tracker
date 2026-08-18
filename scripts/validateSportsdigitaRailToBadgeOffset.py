#!/usr/bin/env python3
"""Compare measured tier rails with numbered badge heights excluded from rail fitting."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


ANALYSIS_VERSION = "sportsdigita-rail-to-badge-offset-validation-v1"


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def row_number(row_key: str) -> int:
    return int(row_key.split(":", 1)[1])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("selected_pose", type=Path)
    parser.add_argument("pose_solutions", type=Path)
    parser.add_argument("relative_heights", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    selected_bytes = arguments.selected_pose.read_bytes()
    solutions_bytes = arguments.pose_solutions.read_bytes()
    heights_bytes = arguments.relative_heights.read_bytes()
    selected = json.loads(selected_bytes)
    solutions = json.loads(solutions_bytes)
    heights = json.loads(heights_bytes)
    if selected.get("analysisVersion") != "sportsdigita-rear-boundary-pose-selection-v1":
        raise ValueError("Selected pose uses an unsupported analysis version")
    if solutions.get("analysisVersion") != "sportsdigita-verified-tier-camera-pose-v3":
        raise ValueError("Pose solutions use an unsupported analysis version")
    if heights.get("analysisVersion") != "sportsdigita-rear-tier-relative-heights-v1":
        raise ValueError("Relative heights use an unsupported analysis version")
    if selected["inputs"]["poseSolutionsSha256"] != hashlib.sha256(
        solutions_bytes
    ).hexdigest():
        raise ValueError("Selected-pose solution checksum mismatch")
    if heights["inputs"]["selectedPoseSha256"] != hashlib.sha256(
        selected_bytes
    ).hexdigest():
        raise ValueError("Relative-height selected-pose checksum mismatch")

    solution = solutions["solutions"][selected["selectedSolutionIndex"]]
    rail_by_row = {
        row_number(record["rowKey"]): record for record in heights["measuredRows"]
    }
    reference_tier_id = "section-207-front-face-upper-tier"
    reference_assignment = selected["selectedTierAssignments"][reference_tier_id]
    reference_row = row_number(reference_assignment["rowKey"])
    reference_badge_height = float(reference_assignment["relativeBadgeHeightFeet"])
    reference_rail_height = float(rail_by_row[reference_row]["relativeRailHeightFeet"])
    reference_offset = reference_rail_height - reference_badge_height

    postfit_diagnostic = solution["postfitValidationDiagnostics"][0]
    candidate_rows = postfit_diagnostic["candidateRowsByGeometricError"]
    comparisons: list[dict[str, Any]] = []
    for candidate in candidate_rows:
        candidate_row = row_number(candidate["rowKey"])
        if candidate_row not in rail_by_row:
            continue
        rail_height = float(rail_by_row[candidate_row]["relativeRailHeightFeet"])
        badge_height = float(candidate["relativeBadgeHeightFeet"])
        rail_to_badge_offset = rail_height - badge_height
        comparisons.append(
            {
                "rowKey": candidate["rowKey"],
                "horizontalP95Feet": candidate["horizontalP95Feet"],
                "verticalP95Feet": candidate["verticalP95Feet"],
                "relativeBadgeHeightFeet": badge_height,
                "relativeRailHeightFeet": rail_height,
                "railToBadgeOffsetFeet": round(rail_to_badge_offset, 6),
                "absoluteOffsetDifferenceFromPrefitReferenceFeet": round(
                    abs(rail_to_badge_offset - reference_offset), 6
                ),
            }
        )
    comparisons.sort(
        key=lambda record: record["absoluteOffsetDifferenceFromPrefitReferenceFeet"]
    )
    if not comparisons:
        raise ValueError("No postfit badge candidate rows overlap measured rails")
    best = comparisons[0]
    next_reference_row = reference_row + 1
    if row_number(best["rowKey"]) != next_reference_row:
        raise ValueError("Postfit badge offset is not most consistent with the next rear tier")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "selectedPosePath": str(arguments.selected_pose),
            "selectedPoseSha256": hashlib.sha256(selected_bytes).hexdigest(),
            "selectedPoseArtifactVersion": selected["artifactVersion"],
            "poseSolutionsPath": str(arguments.pose_solutions),
            "poseSolutionsSha256": hashlib.sha256(solutions_bytes).hexdigest(),
            "poseSolutionsArtifactVersion": solutions["artifactVersion"],
            "relativeHeightsPath": str(arguments.relative_heights),
            "relativeHeightsSha256": hashlib.sha256(heights_bytes).hexdigest(),
            "relativeHeightsArtifactVersion": heights["artifactVersion"],
        },
        "sectionId": str(selected["sectionId"]),
        "validationPolicy": {
            "postfitBadgeControlsExcludedFromPoseFit": True,
            "postfitBadgeControlsExcludedFromPoseRanking": True,
            "postfitBadgeControlsExcludedFromRailLineSelection": True,
            "postfitBadgeControlsCountAsIndependentHoldout": False,
            "comparison": "rail-to-badge vertical offset consistency",
        },
        "prefitReference": {
            "tierId": reference_tier_id,
            "rowKey": reference_assignment["rowKey"],
            "relativeBadgeHeightFeet": reference_badge_height,
            "relativeRailHeightFeet": reference_rail_height,
            "railToBadgeOffsetFeet": round(reference_offset, 6),
        },
        "postfitCandidateRowsByOffsetConsistency": comparisons,
        "validationDecision": {
            "status": "supports-next-rear-tier-identity",
            "supportedRowKey": best["rowKey"],
            "absoluteOffsetDifferenceFeet": best[
                "absoluteOffsetDifferenceFromPrefitReferenceFeet"
            ],
            "horizontalP95Feet": best["horizontalP95Feet"],
            "verticalP95Feet": best["verticalP95Feet"],
            "independentHoldout": False,
        },
        "publicationEligible": False,
        "blockers": [
            "VALIDATION_CONTROL_IS_POSTFIT",
            "ROWS_1_THROUGH_8_RAIL_HEIGHTS_NOT_MEASURED",
            "RAIL_TO_SEAT_OR_TREAD_VERTICAL_OFFSET_NOT_ESTABLISHED",
            "ABSOLUTE_VERTICAL_DATUM_NOT_ESTABLISHED",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "rail-to-badge-offset-validation",
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
                "validationDecision": artifact["validationDecision"],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
