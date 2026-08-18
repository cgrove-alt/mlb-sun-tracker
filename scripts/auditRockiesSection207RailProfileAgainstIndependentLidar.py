#!/usr/bin/env python3
"""Test the Section 207 panorama rail profile against independent LiDAR epochs.

The current-provider panorama supplies relative heights for one repeated rail
feature on every numbered row. This audit searches only the 2020 two-flightline
LiDAR candidates for a consecutive constant-offset match. It then applies that
unchanged offset and row band to the 2008 and 2013 acquisitions. The historical
epochs are validation data, not inputs to the 2020 band or offset selection.

The output remains a candidate. A matching rail profile does not by itself prove
the rail-to-tread offset, current pixel currency, or current obstruction volume.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np


ANALYSIS_VERSION = "rockies-section-207-rail-profile-independent-lidar-audit-v1"


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def percentile(values: list[float], probability: float) -> float | None:
    if not values:
        return None
    return float(np.percentile(np.asarray(values, dtype=np.float64), probability))


def residual_summary(values: list[float]) -> dict[str, float | int | None]:
    absolute = [abs(value) for value in values]
    return {
        "count": len(absolute),
        "medianFeet": percentile(absolute, 50),
        "p95Feet": percentile(absolute, 95),
        "maximumFeet": max(absolute) if absolute else None,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("relative_rails", type=Path)
    parser.add_argument("vertical_cluster_2020", type=Path)
    parser.add_argument("cross_epoch_lidar", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", default="207")
    parser.add_argument("--selection-epoch", default="drcog-2020")
    parser.add_argument(
        "--validation-epoch", action="append", default=["denver-2008", "south-platte-2013"]
    )
    parser.add_argument("--minimum-run-rows", type=int, default=5)
    parser.add_argument("--maximum-fit-residual-feet", type=float, default=1.0)
    arguments = parser.parse_args()
    if arguments.minimum_run_rows < 3:
        raise ValueError("Minimum run length must be at least three rows")
    if arguments.maximum_fit_residual_feet <= 0:
        raise ValueError("Maximum fit residual must be positive")

    rail_bytes = arguments.relative_rails.read_bytes()
    vertical_bytes = arguments.vertical_cluster_2020.read_bytes()
    lidar_bytes = arguments.cross_epoch_lidar.read_bytes()
    rail_artifact = json.loads(rail_bytes)
    vertical_artifact = json.loads(vertical_bytes)
    lidar_artifact = json.loads(lidar_bytes)
    if rail_artifact.get("analysisVersion") != "sportsdigita-complete-section-relative-rail-heights-v1":
        raise ValueError("Relative-rail input has the wrong analysis version")
    if lidar_artifact.get("artifactKind") != "ticketmaster-cross-epoch-lidar-row-cluster-audit":
        raise ValueError("LiDAR input has the wrong artifact kind")
    if vertical_artifact.get("artifactKind") != "ticketmaster-lidar-vertical-cluster-profile-audit":
        raise ValueError("2020 vertical-cluster input has the wrong artifact kind")
    if arguments.section not in lidar_artifact.get("selectedSections", []):
        raise ValueError("Requested section is absent from the LiDAR audit")

    rail_by_key = {
        str(row["rowKey"]): float(row["relativeRailHeightFeet"])
        for row in rail_artifact["rows"]
    }
    validation_lidar_rows = [
        row
        for row in lidar_artifact["rows"]
        if str(row.get("sectionName")) == arguments.section
    ]
    selection_rows = [
        row
        for row in vertical_artifact["rows"]
        if str(row.get("sectionName")) == arguments.section
    ]
    validation_lidar_rows.sort(key=lambda row: int(row["rowName"]))
    selection_rows.sort(key=lambda row: int(row["rowName"]))
    expected_numbers = list(range(1, len(selection_rows) + 1))
    actual_numbers = [int(row["rowName"]) for row in selection_rows]
    if actual_numbers != expected_numbers:
        raise ValueError("2020 selection rows are not a complete consecutive numeric sequence")
    if [row["rowKey"] for row in validation_lidar_rows] != [row["rowKey"] for row in selection_rows]:
        raise ValueError("Selection and validation row identities do not agree")
    missing_rails = [row["rowKey"] for row in selection_rows if row["rowKey"] not in rail_by_key]
    if missing_rails:
        raise ValueError(f"Relative-rail input is missing rows: {missing_rails}")

    selection_options: list[list[dict[str, Any]]] = []
    for row in selection_rows:
        options = []
        for candidate_index, candidate in enumerate(row["verticalModes"]):
            if not candidate["profileEligible"]:
                continue
            options.append(
                {
                    "candidateIndex": candidate_index,
                    "candidate": candidate,
                    "offsetFeet": float(candidate["medianElevationFeet"]) - rail_by_key[row["rowKey"]],
                }
            )
        selection_options.append(options)

    matches: list[dict[str, Any]] = []
    for start in range(len(selection_rows)):
        chosen: list[dict[str, Any]] = []

        def visit(index: int) -> None:
            if index > start and len(chosen) >= arguments.minimum_run_rows:
                offsets = [option["offsetFeet"] for option in chosen]
                fitted = float(np.median(np.asarray(offsets, dtype=np.float64)))
                residuals = [value - fitted for value in offsets]
                if max(abs(value) for value in residuals) <= arguments.maximum_fit_residual_feet:
                    selected_rows = selection_rows[start:index]
                    matches.append(
                        {
                            "firstRowNumber": int(selected_rows[0]["rowName"]),
                            "lastRowNumber": int(selected_rows[-1]["rowName"]),
                            "rowCount": len(selected_rows),
                            "fittedRailToAbsoluteOffsetFeet": fitted,
                            "residualSummary": residual_summary(residuals),
                            "totalSelectedPointCount": sum(
                                int(option["candidate"]["matchedSeatCount"]) for option in chosen
                            ),
                            "rows": [
                                {
                                    "rowKey": row["rowKey"],
                                    "rowNumber": int(row["rowName"]),
                                    "relativeRailHeightFeet": rail_by_key[row["rowKey"]],
                                    "candidateIndex": option["candidateIndex"],
                                    "candidateMatchedSeatCount": int(option["candidate"]["matchedSeatCount"]),
                                    "candidateSeatCoveragePercent": float(option["candidate"]["coveragePercent"]),
                                    "candidateFlightlineDisagreementP95Feet": float(option["candidate"]["flightlineDisagreementP95Feet"]),
                                    "candidateAbsoluteElevationFeet": float(option["candidate"]["medianElevationFeet"]),
                                    "residualFeet": residual,
                                }
                                for row, option, residual in zip(selected_rows, chosen, residuals)
                            ],
                        }
                    )
            if index >= len(selection_rows) or not selection_options[index]:
                return
            for option in selection_options[index]:
                proposed = chosen + [option]
                offsets = [value["offsetFeet"] for value in proposed]
                # A median fit cannot put both extremes within the threshold if
                # their separation exceeds twice the allowed residual.
                if max(offsets) - min(offsets) > 2.0 * arguments.maximum_fit_residual_feet:
                    continue
                chosen.append(option)
                visit(index + 1)
                chosen.pop()

        visit(start)

    if not matches:
        raise ValueError("No qualifying consecutive 2020 rail-to-LiDAR match was found")
    matches.sort(
        key=lambda item: (
            -item["rowCount"],
            float(item["residualSummary"]["p95Feet"]),
            float(item["residualSummary"]["maximumFeet"]),
            -item["totalSelectedPointCount"],
            item["firstRowNumber"],
        )
    )
    selected = matches[0]
    selection_field_datum = float(
        lidar_artifact["fieldDatumControls"]["epochs"][arguments.selection_epoch]["fieldDatumFeet"]
    )
    selected["selectionEpochFieldDatumFeet"] = selection_field_datum
    selected["fittedRailToFieldOffsetFeet"] = (
        selected["fittedRailToAbsoluteOffsetFeet"] - selection_field_datum
    )
    same_length = [match for match in matches if match["rowCount"] == selected["rowCount"]]
    second_same_length = same_length[1] if len(same_length) > 1 else None

    validation_results = []
    for label in list(dict.fromkeys(arguments.validation_epoch)):
        rows = []
        residuals: list[float] = []
        missing = []
        for selected_row in selected["rows"]:
            row = next(
                row for row in validation_lidar_rows if row["rowKey"] == selected_row["rowKey"]
            )
            epoch = row["epochs"].get(label)
            if epoch is None or not epoch["candidates"]:
                missing.append(row["rowKey"])
                continue
            predicted = (
                selected["fittedRailToFieldOffsetFeet"]
                + selected_row["relativeRailHeightFeet"]
            )
            ranked = sorted(
                enumerate(epoch["candidates"]),
                key=lambda pair: (
                    abs(float(pair[1]["relativeToFieldFeet"]) - predicted),
                    -int(pair[1]["pointSourceCount"]),
                    -int(pair[1]["pointCount"]),
                    pair[0],
                ),
            )
            candidate_index, candidate = ranked[0]
            residual = float(candidate["relativeToFieldFeet"]) - predicted
            residuals.append(residual)
            second_residual = (
                None
                if len(ranked) < 2
                else abs(float(ranked[1][1]["relativeToFieldFeet"]) - predicted)
            )
            rows.append(
                {
                    "rowKey": row["rowKey"],
                    "rowNumber": int(row["rowName"]),
                    "predictedRelativeToFieldFeet": predicted,
                    "selectedCandidateIndex": candidate_index,
                    "selectedCandidatePointCount": int(candidate["pointCount"]),
                    "selectedCandidatePointSourceCount": int(candidate["pointSourceCount"]),
                    "selectedCandidateRelativeToFieldFeet": float(candidate["relativeToFieldFeet"]),
                    "residualFeet": residual,
                    "nextCandidateAbsoluteResidualFeet": second_residual,
                }
            )
        summary = residual_summary(residuals)
        validation_results.append(
            {
                "epoch": label,
                "rowCount": len(rows),
                "missingRowKeys": missing,
                "residualSummary": summary,
                "withinOneFootForEveryRow": bool(
                    not missing
                    and summary["maximumFeet"] is not None
                    and float(summary["maximumFeet"]) <= arguments.maximum_fit_residual_feet
                ),
                "rows": rows,
            }
        )

    validation_passed = all(
        result["withinOneFootForEveryRow"] for result in validation_results
    )
    maximum_rail_measurement_p95 = max(
        float(row["lineAndPixelP95Feet"])
        for row in rail_artifact["rows"]
        if selected["firstRowNumber"] <= int(str(row["rowKey"]).split(":", 1)[1]) <= selected["lastRowNumber"]
    )
    maximum_validation_p95 = max(
        float(result["residualSummary"]["p95Feet"])
        for result in validation_results
        if result["residualSummary"]["p95Feet"] is not None
    )
    combined_rss_p95 = float(
        np.hypot(maximum_rail_measurement_p95, maximum_validation_p95)
    )

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "relativeRails": {
                "path": str(arguments.relative_rails),
                "sha256": hashlib.sha256(rail_bytes).hexdigest(),
                "artifactVersion": rail_artifact.get("artifactVersion"),
            },
            "verticalCluster2020": {
                "path": str(arguments.vertical_cluster_2020),
                "sha256": hashlib.sha256(vertical_bytes).hexdigest(),
                "artifactVersion": vertical_artifact.get("artifactVersion"),
            },
            "crossEpochLidar": {
                "path": str(arguments.cross_epoch_lidar),
                "sha256": hashlib.sha256(lidar_bytes).hexdigest(),
                "artifactVersion": lidar_artifact.get("artifactVersion"),
            },
        },
        "sectionId": arguments.section,
        "policy": {
            "selectionEpoch": arguments.selection_epoch,
            "selectionUsesValidationEpochs": False,
            "validationEpochs": list(dict.fromkeys(arguments.validation_epoch)),
            "selectionRequiresProfileEligibleTwoFlightlineModes": True,
            "minimumRunRows": arguments.minimum_run_rows,
            "maximumFitResidualFeet": arguments.maximum_fit_residual_feet,
            "rowBandAndOffsetFrozenBeforeValidation": True,
        },
        "selection": {
            "qualifyingMatchCount": len(matches),
            "selected": selected,
            "sameLengthMatchCount": len(same_length),
            "secondSameLengthMatch": second_same_length,
        },
        "validation": {
            "passedOneFootResidualGate": validation_passed,
            "epochs": validation_results,
            "maximumRailLineAndPixelP95Feet": maximum_rail_measurement_p95,
            "maximumIndependentEpochResidualP95Feet": maximum_validation_p95,
            "combinedRootSumSquareP95Feet": combined_rss_p95,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-section-rail-profile-independent-lidar-audit",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishes": [
                "one uniquely selected consecutive 2020 two-flightline rail-profile alignment",
                "unchanged-offset residual tests against separate 2008 and 2013 acquisitions",
                "a cross-source absolute vertical-datum candidate for the repeated rail feature",
            ],
            "doesNotEstablish": [
                "a measured rail-to-seating-tread or seated-eye offset",
                "current 2026 panorama pixel currency",
                "current complete obstruction geometry",
                "independent shadow-boundary accuracy",
            ],
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "RAIL_TO_TREAD_OR_SEATED_EYE_OFFSET_NOT_MEASURED",
                "PANORAMA_PIXEL_ASSET_CURRENCY_NOT_ESTABLISHED",
                "CURRENT_COMPLETE_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(arguments.output),
                "artifactVersion": artifact["artifactVersion"],
                "selectedRowBand": [selected["firstRowNumber"], selected["lastRowNumber"]],
                "selectionResiduals": selected["residualSummary"],
                "validationPassed": validation_passed,
                "validationResiduals": {
                    result["epoch"]: result["residualSummary"] for result in validation_results
                },
                "combinedRootSumSquareP95Feet": combined_rss_p95,
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
