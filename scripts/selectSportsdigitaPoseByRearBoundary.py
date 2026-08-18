#!/usr/bin/env python3
"""Select the unique provider-local pose compatible with the reviewed rear boundary."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


ANALYSIS_VERSION = "sportsdigita-rear-boundary-pose-selection-v1"


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def row_number(row_key: str) -> int:
    return int(row_key.split(":", 1)[1])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("pose_solutions", type=Path)
    parser.add_argument("rear_tier_audit", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    rows_bytes = arguments.rows.read_bytes()
    pose_bytes = arguments.pose_solutions.read_bytes()
    audit_bytes = arguments.rear_tier_audit.read_bytes()
    rows = json.loads(rows_bytes)
    poses = json.loads(pose_bytes)
    audit = json.loads(audit_bytes)
    if poses.get("analysisVersion") != "sportsdigita-verified-tier-camera-pose-v3":
        raise ValueError("Pose solutions use an unsupported analysis version")
    if audit.get("analysisVersion") != "sportsdigita-rear-tier-sequence-audit-v1":
        raise ValueError("Rear-tier audit uses an unsupported analysis version")
    if poses["inputs"]["rowsSha256"] != hashlib.sha256(rows_bytes).hexdigest():
        raise ValueError("Provider-row checksum mismatch")
    if len(poses["solutions"]) != int(poses["candidateSolutionCount"]):
        raise ValueError("Pose artifact does not contain every candidate solution")
    if not audit["rearBoundaryImmediatelyAfterLastTier"]:
        raise ValueError("Rear-tier audit does not establish an immediate rear boundary")

    section_id = str(poses["sectionId"])
    section_row_numbers = sorted(
        row_number(row["rowKey"])
        for row in rows["geometryRows"]
        if str(row["sectionId"]) == section_id
    )
    if not section_row_numbers:
        raise ValueError("Provider geometry has no rows for the selected section")
    maximum_provider_row = max(section_row_numbers)
    minimum_provider_row = min(section_row_numbers)
    if section_row_numbers != list(range(minimum_provider_row, maximum_provider_row + 1)):
        raise ValueError("Provider row numbers are not contiguous")

    reference_tier_id = str(audit["referenceVisualTierId"])
    rear_tier_count = int(audit["rearTierCount"])
    compatible: list[dict[str, Any]] = []
    diagnostics: list[dict[str, Any]] = []
    for solution_index, solution in enumerate(poses["solutions"]):
        training_row = row_number(solution["trainingRowKey"])
        holdouts = {
            assignment["tierId"]: row_number(assignment["rowKey"])
            for assignment in solution["holdoutAssignments"]
        }
        if reference_tier_id not in holdouts:
            raise ValueError("Pose solution omits the reviewed reference tier")
        other_tiers = [
            value for tier_id, value in holdouts.items() if tier_id != reference_tier_id
        ]
        if len(other_tiers) != 1:
            raise ValueError("Expected exactly one fieldward prefit holdout tier")
        lower_row = other_tiers[0]
        upper_row = holdouts[reference_tier_id]
        consecutive_reviewed_tiers = bool(
            lower_row == training_row - 1 and upper_row == training_row + 1
        )
        projected_last_visible_row = upper_row + rear_tier_count
        ends_at_provider_rear_boundary = projected_last_visible_row == maximum_provider_row
        record = {
            "solutionIndex": solution_index,
            "trainingRow": training_row,
            "fieldwardPrefitHoldoutRow": lower_row,
            "rearwardPrefitHoldoutRow": upper_row,
            "reviewedRearTierCount": rear_tier_count,
            "projectedLastVisibleProviderRow": projected_last_visible_row,
            "maximumProviderRow": maximum_provider_row,
            "reviewedTiersAreConsecutiveProviderRows": consecutive_reviewed_tiers,
            "visibleSequenceEndsAtProviderRearBoundary": ends_at_provider_rear_boundary,
            "compatible": bool(consecutive_reviewed_tiers and ends_at_provider_rear_boundary),
        }
        diagnostics.append(record)
        if record["compatible"]:
            compatible.append({"diagnostic": record, "solution": solution})
    if len(compatible) != 1:
        raise ValueError(
            f"Rear-boundary policy selected {len(compatible)} pose solutions instead of one"
        )

    selected = compatible[0]
    solution = selected["solution"]
    assigned_rows = {
        solution["trainingTierId"]: {
            "rowKey": solution["trainingRowKey"],
            "relativeBadgeHeightFeet": solution[
                "trainingBadgeHeightRelativeToCameraFeet"
            ],
            "partition": "training",
        }
    }
    for assignment in solution["holdoutAssignments"]:
        assigned_rows[assignment["tierId"]] = {
            "rowKey": assignment["rowKey"],
            "relativeBadgeHeightFeet": assignment["relativeBadgeHeightFeet"],
            "horizontalP95Feet": assignment["horizontalP95Feet"],
            "verticalP95Feet": assignment["verticalP95Feet"],
            "partition": "prefit-holdout",
        }

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "rowsPath": str(arguments.rows),
            "rowsSha256": hashlib.sha256(rows_bytes).hexdigest(),
            "rowsArtifactVersion": rows.get("artifactVersion"),
            "poseSolutionsPath": str(arguments.pose_solutions),
            "poseSolutionsSha256": hashlib.sha256(pose_bytes).hexdigest(),
            "poseSolutionsArtifactVersion": poses["artifactVersion"],
            "rearTierAuditPath": str(arguments.rear_tier_audit),
            "rearTierAuditSha256": hashlib.sha256(audit_bytes).hexdigest(),
            "rearTierAuditArtifactVersion": audit["artifactVersion"],
        },
        "sectionId": section_id,
        "selectionPolicy": {
            "allPoseCandidatesEvaluated": True,
            "reviewedLowerTrainingUpperTiersMustBeConsecutive": True,
            "upperTierPlusReviewedRearTierCountMustEqualMaximumProviderRow": True,
            "providerRowsCannotRemainBehindReviewedRearBoundary": True,
            "postfitValidationDiagnosticsUsedForSelection": False,
            "shadowObservationsUsedForSelection": False,
        },
        "candidateSolutionCount": int(poses["candidateSolutionCount"]),
        "compatibleSolutionCount": len(compatible),
        "selectionDiagnostics": diagnostics,
        "selectedSolutionIndex": selected["diagnostic"]["solutionIndex"],
        "selectedPoseProviderLocal": solution["cameraPoseProviderLocal"],
        "selectedTierAssignments": assigned_rows,
        "selectedTrainingMetrics": {
            "totalScoreFeet2": solution["totalScoreFeet2"],
            "trainingCostFeet2": solution["trainingCostFeet2"],
            "holdoutScoreFeet2": solution["holdoutScoreFeet2"],
            "trainingHorizontalP95Feet": solution["trainingHorizontalP95Feet"],
            "trainingHeightSpreadFeet": solution["trainingHeightSpreadFeet"],
        },
        "absoluteProviderRowSelection": {
            "status": "selected-provider-local",
            "referenceVisualTierProviderRow": row_number(
                assigned_rows[reference_tier_id]["rowKey"]
            ),
            "reviewedRearTierCount": rear_tier_count,
            "lastVisibleTierProviderRow": maximum_provider_row,
            "providerRowRange": [minimum_provider_row, maximum_provider_row],
        },
        "publicationEligible": False,
        "blockers": [
            "ROW_ELEVATIONS_INCOMPLETE",
            "PROVIDER_LOCAL_FRAME_NOT_RELEASE_REGISTERED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "provider-local-camera-pose-selection",
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
                "compatibleSolutionCount": len(compatible),
                "selectedSolutionIndex": artifact["selectedSolutionIndex"],
                "selectedTierAssignments": assigned_rows,
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
