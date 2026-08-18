#!/usr/bin/env python3
"""Build checksum-locked Section 207 repeated-rail shadow sample geometry.

This joins the registered row footprints, the panorama-derived repeated rail
profile, and the independently validated absolute offset. The resulting origin
is the measured repeated rail feature, not a seating tread or seated eye.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np


ANALYSIS_VERSION = "rockies-section-207-georeferenced-rail-samples-v1"
FEET_TO_METRES = 0.3048


def artifact_version(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def input_record(path: Path, data: bytes, artifact: dict[str, Any]) -> dict[str, Any]:
    return {
        "path": str(path),
        "sha256": hashlib.sha256(data).hexdigest(),
        "artifactVersion": artifact.get("artifactVersion"),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rail_rows", type=Path)
    parser.add_argument("row_footprints", type=Path)
    parser.add_argument("vertical_audit", type=Path)
    parser.add_argument("semantic_identity_audit", type=Path)
    parser.add_argument("output_rows", type=Path)
    parser.add_argument("output_datum", type=Path)
    arguments = parser.parse_args()

    rail_bytes = arguments.rail_rows.read_bytes()
    footprint_bytes = arguments.row_footprints.read_bytes()
    audit_bytes = arguments.vertical_audit.read_bytes()
    semantic_bytes = arguments.semantic_identity_audit.read_bytes()
    rail = json.loads(rail_bytes)
    footprints = json.loads(footprint_bytes)
    audit = json.loads(audit_bytes)
    semantic = json.loads(semantic_bytes)
    if rail.get("analysisVersion") != "rockies-section-207-provider-local-metric-rail-rows-v1":
        raise ValueError("Rail-row input has the wrong analysis version")
    if footprints.get("analysisVersion") != "registered-row-footprint-section-subset-v1":
        raise ValueError("Footprint input has the wrong analysis version")
    if audit.get("artifactKind") != "rockies-section-rail-profile-independent-lidar-audit":
        raise ValueError("Vertical audit has the wrong artifact kind")
    if not audit["validation"]["passedOneFootResidualGate"]:
        raise ValueError("Independent LiDAR validation did not pass the one-foot gate")
    if audit["selection"]["sameLengthMatchCount"] != 1:
        raise ValueError("The selected longest 2020 alignment is not unique")
    if semantic.get("artifactKind") != "rockies-section-rail-lidar-semantic-identity-audit":
        raise ValueError("Semantic identity audit has the wrong artifact kind")
    semantic_profile = semantic.get("inputs", {}).get("profileAudit", {})
    if semantic_profile.get("sha256") != hashlib.sha256(audit_bytes).hexdigest():
        raise ValueError("Semantic identity audit is not locked to the supplied vertical audit")
    if semantic.get("quarantine", {}).get("active") is not False:
        raise ValueError(
            "Matched LiDAR surface identity is unresolved; rail datum transfer is quarantined"
        )
    if semantic.get("semanticIdentity", {}).get("matchedSurfaceFeatureIdentity") != (
        "section-207-repeated-rail"
    ):
        raise ValueError("Semantic identity audit does not identify the Section 207 repeated rail")
    if semantic.get("semanticIdentity", {}).get("allowRailDatumTransfer") is not True:
        raise ValueError("Semantic identity audit does not authorize rail datum transfer")

    section_id = str(rail["sectionId"])
    if footprints.get("sections") != [section_id] or str(audit["sectionId"]) != section_id:
        raise ValueError("Input section identities do not agree")
    rail_by_key = {str(row["rowKey"]): row for row in rail["rows"]}
    footprint_by_key = {
        str(feature["attributes"]["rowKey"]): feature
        for feature in footprints["features"]
    }
    if set(rail_by_key) != set(footprint_by_key):
        raise ValueError("Rail rows and footprint rows do not have identical coverage")

    offset_feet = float(
        audit["selection"]["selected"]["fittedRailToAbsoluteOffsetFeet"]
    )
    offset_metres = offset_feet * FEET_TO_METRES
    uncertainty_p95_feet = float(
        audit["validation"]["combinedRootSumSquareP95Feet"]
    )
    rows = []
    for row_key in sorted(rail_by_key, key=lambda value: int(value.split(":", 1)[1])):
        source_row = rail_by_key[row_key]
        footprint = footprint_by_key[row_key]
        anchors = source_row["anchors"]
        positions = np.asarray([anchor["position"] for anchor in anchors], dtype=np.float64)
        relative_height_metres = float(np.median(positions[:, 1]))
        row_number = int(source_row["rowId"])
        rows.append(
            {
                "rowKey": row_key,
                "sectionId": section_id,
                "rowId": str(row_number),
                "publishedSeatCount": int(footprint["attributes"]["seatCount"]),
                "sourceAnchorIds": source_row["anchorSeatIds"],
                "venueLocalPosition": [
                    float(np.median(positions[:, 0])),
                    relative_height_metres,
                    float(np.median(positions[:, 2])),
                ],
                "horizontalGeometry": {
                    "coordinateReferenceSystem": "EPSG:6342",
                    "verticalCoordinateReferenceSystem": "EPSG:5703 using Geoid18",
                    "source": "current-provider row identity joined to registered UTM 13N footprint candidate",
                    "rings": footprint["geometry"]["rings"],
                },
                "verticalGeometry": {
                    "method": "panorama repeated-rail profile plus independently validated LiDAR offset",
                    "sampleSemantic": "fieldward repeated rail-height proxy",
                    "relativeRailHeightMetres": relative_height_metres,
                    "elevationMetresNavd88": relative_height_metres + offset_metres,
                    "combinedIndependentValidationP95Metres": uncertainty_p95_feet * FEET_TO_METRES,
                    "publicationEligible": False,
                    "blockers": [
                        "RAIL_TO_TREAD_OR_SEATED_EYE_OFFSET_NOT_MEASURED",
                        "PANORAMA_PIXEL_ASSET_CURRENCY_NOT_ESTABLISHED",
                    ],
                },
            }
        )

    inputs = {
        "railRows": input_record(arguments.rail_rows, rail_bytes, rail),
        "rowFootprints": input_record(arguments.row_footprints, footprint_bytes, footprints),
        "verticalAudit": input_record(arguments.vertical_audit, audit_bytes, audit),
        "semanticIdentityAudit": input_record(
            arguments.semantic_identity_audit, semantic_bytes, semantic
        ),
    }
    stable_rows = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": inputs,
        "stadiumId": "rockies",
        "sectionId": section_id,
        "coordinateReference": {
            "horizontal": "NAD83(2011) / UTM zone 13N, EPSG:6342",
            "vertical": "NAVD88 height using Geoid18, EPSG:5703",
            "units": "metre",
        },
        "sampleSemantic": "fieldward repeated rail-height proxy",
        "rows": rows,
    }
    row_artifact = {
        "schemaVersion": 1,
        "artifactKind": "georeferenced-repeated-rail-sample-geometry-candidate",
        "artifactVersion": artifact_version(stable_rows),
        **stable_rows,
        "counts": {
            "rowCount": len(rows),
            "seatSampleAnchorCount": sum(row["publishedSeatCount"] for row in rows),
            "rowCoveragePercent": 100.0,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "SAMPLE_ORIGIN_IS_RAIL_NOT_SEATED_EYE",
                "PANORAMA_PIXEL_ASSET_CURRENCY_NOT_ESTABLISHED",
                "CURRENT_COMPLETE_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    stable_datum = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": inputs,
        "stadiumId": "rockies",
        "sectionId": section_id,
        "verticalDatum": {
            "providerLocalToNavd88": {
                "offsetMetres": offset_metres,
                "offsetFeet": offset_feet,
                "sampleSemantic": "fieldward repeated rail-height proxy",
                "independentValidationCombinedP95Metres": uncertainty_p95_feet * FEET_TO_METRES,
            }
        },
    }
    datum_artifact = {
        "schemaVersion": 1,
        "artifactKind": "provider-local-rail-to-navd88-datum-candidate",
        "artifactVersion": artifact_version(stable_datum),
        **stable_datum,
        "publication": {
            "eligible": False,
            "blockers": [
                "RAIL_TO_TREAD_OR_SEATED_EYE_OFFSET_NOT_MEASURED",
                "PANORAMA_PIXEL_ASSET_CURRENCY_NOT_ESTABLISHED",
            ],
        },
    }
    arguments.output_rows.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_datum.parent.mkdir(parents=True, exist_ok=True)
    arguments.output_rows.write_text(json.dumps(row_artifact, indent=2) + "\n", encoding="utf-8")
    arguments.output_datum.write_text(json.dumps(datum_artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "rowsOutput": str(arguments.output_rows),
                "rowsArtifactVersion": row_artifact["artifactVersion"],
                "datumOutput": str(arguments.output_datum),
                "datumArtifactVersion": datum_artifact["artifactVersion"],
                "rowCount": len(rows),
                "absoluteOffsetFeet": offset_feet,
                "combinedValidationP95Feet": uncertainty_p95_feet,
                "sampleSemantic": stable_rows["sampleSemantic"],
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
