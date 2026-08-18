#!/usr/bin/env python3
"""Extract strict orthophoto-identified Marlins row-surface candidates in 2018 LiDAR."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("cross_epoch_diagnostic", type=Path)
    parser.add_argument("reference_survey_review", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    diagnostic_bytes = args.cross_epoch_diagnostic.read_bytes()
    diagnostic = json.loads(diagnostic_bytes)
    review_bytes = args.reference_survey_review.read_bytes()
    review = json.loads(review_bytes)
    if diagnostic.get("artifactKind") != (
        "orthophoto-identified-two-epoch-lidar-row-surface-audit"
    ):
        raise ValueError("Cross-epoch diagnostic has the wrong kind")
    if review.get("artifactKind") != "lidar-survey-report-review":
        raise ValueError("Reference survey review has the wrong kind")
    if diagnostic["sources"]["referenceSurveyReviewArtifactVersion"] != (
        review["artifactVersion"]
    ):
        raise ValueError("Reference survey review does not match the diagnostic")
    if sha256_file(Path(review["source"]["tilePath"])) != (
        review["source"]["tileSha256"]
    ):
        raise ValueError("Reference LiDAR checksum mismatch")
    if not review["conservativeInterpretation"][
        "passesOneFootHorizontalThreshold"
    ]:
        raise ValueError("Reference LiDAR does not pass the horizontal gate")
    if not review["conservativeInterpretation"][
        "passesOneFootVerticalThreshold"
    ]:
        raise ValueError("Reference LiDAR does not pass the vertical gate")

    provider_window_feet = float(
        diagnostic["method"]["providerSurfaceToleranceFeet"]
    )
    reference_horizontal95 = float(
        review["conservativeInterpretation"]["horizontalAccuracy95Feet"]
    )
    reference_vertical95 = float(
        review["conservativeInterpretation"]["verticalAccuracy95Feet"]
    )
    rows = []
    for row in diagnostic["rows"]:
        anchor_results = []
        for anchor in row["anchorSurfaces"]:
            expected = float(anchor["expectedReferenceSurfaceElevationFeet"])
            candidates = [
                candidate
                for candidate in anchor["referenceCandidates"]
                if abs(float(candidate["medianElevationFeet"]) - expected)
                <= provider_window_feet
            ]
            selected = None
            if candidates:
                selected = min(
                    candidates,
                    key=lambda candidate: (
                        abs(float(candidate["medianElevationFeet"]) - expected),
                        float(candidate["crossSourceDisagreementFeet"]),
                        -int(candidate["pointCount"]),
                    ),
                )
            vertical_uncertainty = (
                reference_vertical95
                + float(selected["crossSourceDisagreementFeet"])
                if selected is not None
                else None
            )
            anchor_results.append({
                "seatId": anchor["seatId"],
                "anchorIndex": anchor["anchorIndex"],
                "expectedSurfaceElevationFeetNavd88": expected,
                "selectedSurface": selected,
                "surfaceElevationFeetNavd88": (
                    float(selected["medianElevationFeet"])
                    if selected is not None
                    else None
                ),
                "verticalUncertainty95Feet": vertical_uncertainty,
                "withinOneFootVertical": bool(
                    vertical_uncertainty is not None
                    and vertical_uncertainty <= 1.0
                ),
            })
        full_coverage = bool(
            anchor_results
            and all(anchor["selectedSurface"] is not None for anchor in anchor_results)
        )
        vertical_pass = bool(
            full_coverage
            and all(anchor["withinOneFootVertical"] for anchor in anchor_results)
        )
        row_frame_horizontal95 = float(row["horizontalUncertainty95Feet"])
        row_to_lidar_horizontal95 = math.hypot(
            row_frame_horizontal95, reference_horizontal95
        )
        horizontal_pass = row_to_lidar_horizontal95 <= 1.0
        metric_surface_candidate = bool(
            full_coverage and vertical_pass and horizontal_pass
        )
        rows.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "publishedSeatCount": row["publishedSeatCount"],
            "correctedPlanAnchorPathEpsg6438UsSurveyFeet": row[
                "correctedPlanAnchorPathEpsg6438UsSurveyFeet"
            ],
            "orthophotoControlOffsetFeet": row["orthophotoControlOffsetFeet"],
            "orthophotoControlHoldoutResidualFeet": row[
                "orthophotoControlHoldoutResidualFeet"
            ],
            "rowFrameHorizontalUncertainty95Feet": row_frame_horizontal95,
            "referenceLidarHorizontalUncertainty95Feet": reference_horizontal95,
            "combinedRowToLidarHorizontalUncertainty95Feet": (
                row_to_lidar_horizontal95
            ),
            "anchorCount": len(anchor_results),
            "matchedAnchorCount": sum(
                anchor["selectedSurface"] is not None for anchor in anchor_results
            ),
            "anchors": anchor_results,
            "metricSurfaceCandidate": metric_surface_candidate,
            "measuredRowEligible": False,
            "publicationEligible": False,
            "blockers": [
                *([] if full_coverage else ["INCOMPLETE_LIDAR_ANCHOR_COVERAGE"]),
                *([] if vertical_pass else ["VERTICAL_UNCERTAINTY_EXCEEDS_ONE_FOOT"]),
                *([] if horizontal_pass else ["COMBINED_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT"]),
                "SURFACE_SEMANTIC_ROLE_NOT_INDEPENDENTLY_PROVEN_AS_SEATING_TREAD",
                "CURRENT_ROW_PERSISTENCE_NOT_ESTABLISHED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        })

    candidates = [row for row in rows if row["metricSurfaceCandidate"]]
    stable = {
        "diagnosticSha256": hashlib.sha256(diagnostic_bytes).hexdigest(),
        "referenceSurveyReviewSha256": hashlib.sha256(review_bytes).hexdigest(),
        "parameters": {
            "providerSurfaceWindowFeet": provider_window_feet,
            "horizontalCombinationRule": "root sum of squares",
            "verticalCombinationRule": "survey 95 percent plus observed cross-source disagreement",
            "horizontalThresholdFeet": 1.0,
            "verticalThresholdFeet": 1.0,
        },
        "rows": rows,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "orthophoto-identified-2018-lidar-row-surface-audit",
        "artifactVersion": artifact_version(stable),
        "stadiumId": "marlins",
        "inputs": {
            "crossEpochDiagnosticPath": str(args.cross_epoch_diagnostic),
            "crossEpochDiagnosticSha256": stable["diagnosticSha256"],
            "crossEpochDiagnosticArtifactVersion": diagnostic["artifactVersion"],
            "referenceSurveyReviewPath": str(args.reference_survey_review),
            "referenceSurveyReviewSha256": stable[
                "referenceSurveyReviewSha256"
            ],
            "referenceSurveyReviewArtifactVersion": review["artifactVersion"],
            "referenceLidarSha256": review["source"]["tileSha256"],
        },
        "method": stable["parameters"],
        "counts": {
            "orthophotoLocalizedRows": len(rows),
            "rowsWithAnyMatchedAnchor": sum(
                row["matchedAnchorCount"] > 0 for row in rows
            ),
            "rowsWithFullAnchorCoverage": sum(
                row["matchedAnchorCount"] == row["anchorCount"] for row in rows
            ),
            "metricSurfaceCandidateRows": len(candidates),
            "measuredRows": 0,
        },
        "geometryBoundary": {
            "establishesMetricSurfaceCandidates": bool(candidates),
            "establishesSeatingTreadSemanticIdentity": False,
            "establishesCurrentPersistence": False,
            "establishesMeasuredRows": False,
            "establishesPublicationReadyRows": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "SURFACE_SEMANTIC_ROLE_NOT_INDEPENDENTLY_PROVEN_AS_SEATING_TREAD",
                "CURRENT_ROW_PERSISTENCE_NOT_ESTABLISHED",
                "MEASURED_ROW_COVERAGE_NOT_COMPLETE",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "rows": rows,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "counts": artifact["counts"],
        "candidateRows": [row["rowKey"] for row in candidates],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
