#!/usr/bin/env python3
"""Build checksum-locked Section 207 provider-local metric rail proxies."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


ANALYSIS_VERSION = "rockies-section-207-provider-local-metric-rail-rows-v1"
FEET_TO_METRES = 0.3048


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def input_record(path: Path, artifact: dict[str, Any]) -> dict[str, Any]:
    return {
        "path": str(path),
        "sha256": sha256_file(path),
        "artifactVersion": artifact.get("artifactVersion"),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rows", type=Path)
    parser.add_argument("selected_pose", type=Path)
    parser.add_argument("complete_heights", type=Path)
    parser.add_argument("projection_review", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--section", default="207")
    arguments = parser.parse_args()

    rows_bytes = arguments.rows.read_bytes()
    pose_bytes = arguments.selected_pose.read_bytes()
    heights_bytes = arguments.complete_heights.read_bytes()
    review_bytes = arguments.projection_review.read_bytes()
    rows = json.loads(rows_bytes)
    pose = json.loads(pose_bytes)
    heights = json.loads(heights_bytes)
    review = json.loads(review_bytes)

    rows_sha = hashlib.sha256(rows_bytes).hexdigest()
    pose_sha = hashlib.sha256(pose_bytes).hexdigest()
    heights_sha = hashlib.sha256(heights_bytes).hexdigest()
    if pose.get("analysisVersion") != "sportsdigita-rear-boundary-pose-selection-v1":
        raise ValueError("Selected pose uses an unsupported analysis version")
    if heights.get("analysisVersion") != "sportsdigita-complete-section-relative-rail-heights-v1":
        raise ValueError("Complete heights use an unsupported analysis version")
    if review.get("analysisVersion") != "sportsdigita-complete-rail-projection-review-v1":
        raise ValueError("Projection review uses an unsupported analysis version")
    if review.get("reviewStatus") != "reviewed-all-six-cube-faces-for-relative-rail-chain":
        raise ValueError("Complete rail projection has not passed all-face review")
    if rows.get("artifactVersion") != pose["inputs"].get("rowsArtifactVersion"):
        raise ValueError("Selected pose references a different row artifact version")
    if rows_sha != pose["inputs"].get("rowsSha256"):
        raise ValueError("Selected pose row checksum mismatch")
    if rows_sha != heights["inputs"].get("rowsSha256"):
        raise ValueError("Complete-height row checksum mismatch")
    if pose_sha != heights["inputs"].get("selectedPoseSha256"):
        raise ValueError("Complete-height pose checksum mismatch")
    if rows_sha != review["inputs"].get("rowsSha256"):
        raise ValueError("Projection-review row checksum mismatch")
    if pose_sha != review["inputs"].get("selectedPoseSha256"):
        raise ValueError("Projection-review pose checksum mismatch")
    if heights_sha != review["inputs"].get("completeHeightsSha256"):
        raise ValueError("Projection-review height checksum mismatch")

    section_id = str(arguments.section)
    if str(pose.get("sectionId")) != section_id:
        raise ValueError("Selected pose section does not match the requested section")
    if str(heights.get("sectionId")) != section_id:
        raise ValueError("Complete-height section does not match the requested section")
    if str(review.get("sectionId")) != section_id:
        raise ValueError("Projection-review section does not match the requested section")

    height_by_row = {
        str(record["rowKey"]): float(record["relativeRailHeightFeet"])
        for record in heights["rows"]
    }
    source_rows = [
        row for row in rows["geometryRows"] if str(row["sectionId"]) == section_id
    ]
    if len(source_rows) != 17:
        raise ValueError(f"Section {section_id} does not have exactly 17 provider rows")
    source_keys = [str(row["rowKey"]) for row in source_rows]
    if len(source_keys) != len(set(source_keys)):
        raise ValueError("Provider rows contain duplicate row keys")
    if set(source_keys) != set(height_by_row):
        raise ValueError("Complete-height rows do not exactly cover the provider rows")

    expected_keys = [f"{section_id}:{number}" for number in range(1, 18)]
    if sorted(source_keys, key=lambda value: int(value.split(":", 1)[1])) != expected_keys:
        raise ValueError("Provider rows are not the complete numeric 1 through 17 sequence")

    output_rows: list[dict[str, Any]] = []
    anchor_count = 0
    for row in sorted(source_rows, key=lambda value: int(value["rowKey"].split(":", 1)[1])):
        row_key = str(row["rowKey"])
        row_id = row_key.split(":", 1)[1]
        rail_height_metres = height_by_row[row_key] * FEET_TO_METRES
        anchors: list[dict[str, Any]] = []
        for seat in row["seats"]:
            east_feet, north_feet = (
                float(value) for value in seat["eastNorthFeetFromInputCenter"]
            )
            anchors.append(
                {
                    "id": f"{row_key}:seat:{seat['seatLabel']}",
                    "seatLabel": str(seat["seatLabel"]),
                    "providerPlaceId": seat.get("providerPlaceId"),
                    "position": [
                        round(east_feet * FEET_TO_METRES, 9),
                        round(rail_height_metres, 9),
                        round(north_feet * FEET_TO_METRES, 9),
                    ],
                }
            )
        if len(anchors) < 2:
            raise ValueError(f"Row {row_key} has fewer than two rail anchors")
        anchor_count += len(anchors)
        output_rows.append(
            {
                "sectionId": section_id,
                "rowId": row_id,
                "rowKey": row_key,
                "geometrySemantic": "fieldward rail-height proxy at provider seat plan anchors",
                "anchorSeatIds": [anchor["id"] for anchor in anchors],
                "anchors": anchors,
            }
        )

    reviewed_row_keys = {str(record["rowKey"]) for record in review["projectedSeats"]}
    if reviewed_row_keys != set(source_keys):
        raise ValueError("Projection review does not cover every provider row")
    reviewed_seat_count = len(review["projectedSeats"])
    if reviewed_seat_count != anchor_count:
        raise ValueError("Projection review does not cover every output anchor")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": section_id,
        "inputs": {
            "rows": input_record(arguments.rows, rows),
            "selectedPose": input_record(arguments.selected_pose, pose),
            "completeHeights": input_record(arguments.complete_heights, heights),
            "projectionReview": input_record(arguments.projection_review, review),
        },
        "coordinateReference": {
            "kind": "PROVIDER_LOCAL_CANDIDATE_METRIC_RAIL_FRAME",
            "axisOrder": ["provider-candidate-east", "relative-rail-up", "provider-candidate-north"],
            "unit": "metre",
            "horizontalOrigin": "ticket-provider plan registration input center",
            "verticalOrigin": "selected Sportsdigita camera relative rail datum",
            "absoluteVerticalDatumEstablished": False,
            "releaseSurveyRegistrationEstablished": False,
            "physicalSeatOrTreadSurfaceEstablished": False,
        },
        "rows": output_rows,
        "coverage": {
            "providerRows": len(source_rows),
            "outputRows": len(output_rows),
            "providerRailAnchors": anchor_count,
            "reviewedProjectionAnchors": reviewed_seat_count,
            "rowCoveragePercent": 100.0,
            "anchorCoveragePercent": 100.0,
        },
        "interpretation": {
            "supportedUse": "camera registration against the same physical fieldward rail or riser feature",
            "unsupportedUses": [
                "seat-eye elevation",
                "tread elevation",
                "release survey control",
                "current obstruction geometry",
                "publication shade prediction",
            ],
            "ticketProviderRowsAreCurrentEventGeometry": True,
            "panoramaPixelAssetCurrency": "not established by this artifact; inspect the checksum-locked panorama manifest",
            "note": "The 17 explicit provider row identities are complete. Horizontal coordinates remain a candidate provider-plan registration, and relative vertical coordinates are rail proxies derived from rendered panorama pixels.",
        },
        "publicationEligible": False,
        "blockers": [
            "HORIZONTAL_PROVIDER_FRAME_NOT_RELEASE_SURVEY_REGISTERED",
            "RAIL_TO_SEAT_OR_TREAD_VERTICAL_OFFSET_NOT_ESTABLISHED",
            "ABSOLUTE_VERTICAL_DATUM_NOT_ESTABLISHED",
            "PANORAMA_PIXEL_ASSET_CURRENCY_NOT_ESTABLISHED",
            "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
            "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
        ],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactStage": "candidate-provider-local-metric-rail-rows",
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
                "rowCount": len(output_rows),
                "anchorCount": anchor_count,
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
