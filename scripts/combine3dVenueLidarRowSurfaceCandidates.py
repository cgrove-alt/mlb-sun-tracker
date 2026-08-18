#!/usr/bin/env python3
"""Combine independent Marlins LiDAR row-surface candidate evidence."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

from audit3dVenueRowsAgainstOpenRoofLidar import percentile, stable_version


ANALYSIS_VERSION = "3ddv-lidar-row-surface-candidate-union-v1"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("world_rows", type=Path)
    parser.add_argument("reference_audit", type=Path)
    parser.add_argument("two_epoch_audit", type=Path)
    parser.add_argument("vertical_datum_audit", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--maximum-reconciled-elevation-disagreement-feet", type=float, default=1.0)
    arguments = parser.parse_args()
    if arguments.maximum_reconciled_elevation_disagreement_feet <= 0:
        raise ValueError("Maximum reconciled disagreement must be positive")

    world: dict[str, Any] = json.loads(arguments.world_rows.read_text())
    reference: dict[str, Any] = json.loads(arguments.reference_audit.read_text())
    two_epoch: dict[str, Any] = json.loads(arguments.two_epoch_audit.read_text())
    vertical_datum: dict[str, Any] = json.loads(arguments.vertical_datum_audit.read_text())
    world_hash = sha256_file(arguments.world_rows)
    reference_hash = sha256_file(arguments.reference_audit)
    two_epoch_hash = sha256_file(arguments.two_epoch_audit)
    vertical_datum_hash = sha256_file(arguments.vertical_datum_audit)
    if world.get("artifactKind") != "3ddv-survey-orthophoto-world-registration-candidate":
        raise ValueError("World-row input has the wrong artifact kind")
    if reference.get("artifactKind") != "3ddv-open-roof-lidar-row-surface-audit":
        raise ValueError("Reference audit has the wrong artifact kind")
    if two_epoch.get("artifactKind") != "3ddv-two-epoch-lidar-row-surface-audit":
        raise ValueError("Two-epoch audit has the wrong artifact kind")
    if vertical_datum.get("artifactKind") != "noaa-copc-local-vertical-datum-correction-audit":
        raise ValueError("Vertical-datum audit has the wrong artifact kind")
    if reference.get("inputs", {}).get("worldRowsSha256") != world_hash:
        raise ValueError("Reference audit does not bind the supplied world rows")
    if two_epoch.get("inputs", {}).get("worldRowsSha256") != world_hash:
        raise ValueError("Two-epoch audit does not bind the supplied world rows")
    if two_epoch.get("inputs", {}).get("referenceAuditSha256") != reference_hash:
        raise ValueError("Two-epoch audit does not bind the supplied reference audit")
    if two_epoch.get("inputs", {}).get("comparisonVerticalDatumAuditSha256") != vertical_datum_hash:
        raise ValueError("Two-epoch audit does not bind the supplied vertical-datum audit")
    stadium_ids = {
        world.get("stadiumId"),
        reference.get("stadiumId"),
        two_epoch.get("stadiumId"),
        vertical_datum.get("stadiumId"),
    }
    if stadium_ids != {"marlins"}:
        raise ValueError("Inputs do not all target the Marlins")

    reference_rows = {row["rowKey"]: row for row in reference["rows"]}
    two_epoch_rows = {row["rowKey"]: row for row in two_epoch["rows"]}
    if set(reference_rows) != {row["rowKey"] for row in world["rows"]}:
        raise ValueError("Reference audit row inventory differs from world rows")
    if set(two_epoch_rows) != {row["rowKey"] for row in world["rows"]}:
        raise ValueError("Two-epoch audit row inventory differs from world rows")

    records: list[dict[str, Any]] = []
    overlap_disagreements: list[float] = []
    evidence_class_counts = {
        "2018-multiflightline-only": 0,
        "control-corrected-two-epoch-only": 0,
        "both": 0,
        "unresolved": 0,
    }
    for world_row in world["rows"]:
        row_key = world_row["rowKey"]
        reference_row = reference_rows[row_key]
        two_epoch_row = two_epoch_rows[row_key]
        reference_surfaces = [
            float(anchor["selectedSurface"]["elevationFeet"])
            for anchor in reference_row["anchors"]
            if anchor.get("selectedSurface")
        ]
        reference_elevation = (
            float(np.median(reference_surfaces)) if reference_surfaces else None
        )
        two_epoch_elevation = two_epoch_row.get("candidateReferenceSurfaceElevationFeet")
        if two_epoch_elevation is not None:
            two_epoch_elevation = float(two_epoch_elevation)

        evidence_class = "unresolved"
        selected_elevation = None
        reconciled_disagreement = None
        if reference_elevation is not None and two_epoch_elevation is not None:
            reconciled_disagreement = two_epoch_elevation - reference_elevation
            overlap_disagreements.append(abs(reconciled_disagreement))
            if abs(reconciled_disagreement) <= arguments.maximum_reconciled_elevation_disagreement_feet:
                evidence_class = "both"
                selected_elevation = two_epoch_elevation
        elif reference_elevation is not None:
            evidence_class = "2018-multiflightline-only"
            selected_elevation = reference_elevation
        elif two_epoch_elevation is not None:
            evidence_class = "control-corrected-two-epoch-only"
            selected_elevation = two_epoch_elevation
        evidence_class_counts[evidence_class] += 1

        records.append({
            "rowKey": row_key,
            "sectionId": world_row["sectionId"],
            "rowId": world_row["rowId"],
            "holdout": bool(reference_row["holdout"]),
            "evidenceClass": evidence_class,
            "candidateSurfaceElevationNavd88Feet": selected_elevation,
            "reference2018": {
                "matchedAnchorCount": len(reference_surfaces),
                "candidateSurfaceElevationNavd88Feet": reference_elevation,
            },
            "controlCorrectedTwoEpoch": {
                "matchedAnchorCount": int(two_epoch_row["matchedAnchorCount"]),
                "candidateReferenceSurfaceElevationNavd88Feet": two_epoch_elevation,
                "correctedCrossEpochDisagreementP95Feet": two_epoch_row[
                    "correctedCrossEpochDisagreementP95Feet"
                ],
            },
            "overlapElevationDisagreementFeet": reconciled_disagreement,
            "semanticReview": {
                "seatingTreadIdentityEstablished": False,
                "acceptedForMeasuredRowGeometry": False,
            },
        })

    candidate_rows = [
        record for record in records
        if record["candidateSurfaceElevationNavd88Feet"] is not None
    ]
    training_rows = [record for record in records if not record["holdout"]]
    holdout_rows = [record for record in records if record["holdout"]]

    def split_summary(rows: list[dict[str, Any]]) -> dict[str, Any]:
        candidates = [
            row for row in rows
            if row["candidateSurfaceElevationNavd88Feet"] is not None
        ]
        return {
            "rowCount": len(rows),
            "candidateRowCount": len(candidates),
            "candidateRowCoveragePercent": 100 * len(candidates) / len(rows),
        }

    inputs = {
        "worldRowsPath": str(arguments.world_rows.resolve()),
        "worldRowsSha256": world_hash,
        "worldRowsArtifactVersion": world.get("artifactVersion"),
        "referenceAuditPath": str(arguments.reference_audit.resolve()),
        "referenceAuditSha256": reference_hash,
        "referenceAuditArtifactVersion": reference.get("artifactVersion"),
        "twoEpochAuditPath": str(arguments.two_epoch_audit.resolve()),
        "twoEpochAuditSha256": two_epoch_hash,
        "twoEpochAuditArtifactVersion": two_epoch.get("artifactVersion"),
        "verticalDatumAuditPath": str(arguments.vertical_datum_audit.resolve()),
        "verticalDatumAuditSha256": vertical_datum_hash,
        "verticalDatumAuditArtifactVersion": vertical_datum.get("artifactVersion"),
    }
    validation = {
        "all": split_summary(records),
        "training": split_summary(training_rows),
        "holdout": split_summary(holdout_rows),
        "evidenceClassCounts": evidence_class_counts,
        "overlapElevationDisagreementAbsoluteFeet": {
            "count": len(overlap_disagreements),
            "median": percentile(overlap_disagreements, 50),
            "p95": percentile(overlap_disagreements, 95),
            "maximum": max(overlap_disagreements) if overlap_disagreements else None,
        },
    }
    publication = {
        "eligible": False,
        "blockers": [
            "CANDIDATE_ROW_COVERAGE_IS_NOT_100_PERCENT",
            "SEATING_TREAD_SEMANTIC_IDENTITY_NOT_REVIEWED",
            "WORLD_REGISTRATION_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_INCLUDED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    result = {
        "schemaVersion": 1,
        "artifactKind": "3ddv-lidar-row-surface-candidate-union",
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "inputs": inputs,
        "parameters": {
            "maximumReconciledElevationDisagreementFeet": (
                arguments.maximum_reconciled_elevation_disagreement_feet
            ),
            "conflictRule": (
                "Rows with both evidence classes use the two-epoch reference elevation only "
                "when its difference from the 2018 multi-flightline median is within the "
                "declared limit. Other conflicts remain unresolved."
            ),
        },
        "validation": validation,
        "rows": records,
        "geometryBoundary": {
            "candidateRowCount": len(candidate_rows),
            "establishesMeasuredRowGeometry": False,
            "establishesSeatingTreadSemanticIdentity": False,
            "establishesCurrentGeometry": False,
            "establishesCompleteMeasuredRows": False,
            "establishesIndependentShadowValidation": False,
        },
        "publication": publication,
    }
    result["artifactVersion"] = stable_version({
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": result["stadiumId"],
        "inputs": inputs,
        "parameters": result["parameters"],
        "validation": validation,
        "rows": records,
        "geometryBoundary": result["geometryBoundary"],
        "publication": publication,
    })
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": result["artifactVersion"],
        "validation": validation,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
