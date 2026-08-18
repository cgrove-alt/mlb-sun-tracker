#!/usr/bin/env python3
"""Register current 2D venue-map rows to independent mapped row controls."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path

import numpy as np

from registerCurrentRowsBySection import (
    ONE_FOOT_METRES,
    apply_affine,
    control_row_geometry,
    normalized_key,
    percentile,
    predicted_ring,
    section_fit,
)


def map_row_geometry(row: dict) -> dict:
    seats = row["seats"]
    centers = np.asarray([seat["center"] for seat in seats], dtype=np.float64)
    return {
        "centroid": np.median(centers, axis=0),
        "endpoints": np.asarray([centers[0], centers[-1]]),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("venue_map_rows", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    control = json.loads(arguments.row_control.read_text(encoding="utf-8"))
    venue_map = json.loads(arguments.venue_map_rows.read_text(encoding="utf-8"))
    if control.get("artifactKind") != "independent-georeferenced-row-polygon-control":
        raise ValueError("Invalid row-control artifact")
    if venue_map.get("artifactKind") != "current-venue-map-row-geometry":
        raise ValueError("Invalid current venue-map artifact")

    control_by_key: dict[str, list[dict]] = defaultdict(list)
    for feature in control["features"]:
        attributes = feature["attributes"]
        control_by_key[normalized_key(attributes.get("section"), attributes.get("row"))].append(feature)

    current_rows = []
    matched_by_section: dict[str, list[dict]] = defaultdict(list)
    for section in venue_map["sections"]:
        for row in section["rows"]:
            row_key = normalized_key(row["sectionId"], row["rowId"])
            current = {
                "rowKey": row_key,
                "sectionId": str(row["sectionId"]),
                "rowId": str(row["rowId"]),
                "publishedSeatCount": row["publishedSeatCount"],
                "venue": map_row_geometry(row),
            }
            features = control_by_key.get(row_key)
            if features:
                geometry = control_row_geometry(features)
                if geometry is not None:
                    current["control"] = geometry
                    matched_by_section[current["sectionId"]].append(current)
            current_rows.append(current)

    fits = {
        section_id: fit
        for section_id, rows in matched_by_section.items()
        if (fit := section_fit(rows)) is not None
    }
    section_widths = {
        section_id: float(np.median([row["control"]["widthMetres"] for row in rows]))
        for section_id, rows in matched_by_section.items()
    }
    output_rows = []
    unresolved_rows = []
    for row in current_rows:
        fit = fits.get(row["sectionId"])
        direct = row.get("control")
        if direct is not None:
            output_rows.append({
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "publishedSeatCount": row["publishedSeatCount"],
                "horizontalGeometry": {
                    "coordinateReferenceSystem": "EPSG:6347",
                    "method": "exact-identity-matched-independent-row-control",
                    "centroidMetres": [float(value) for value in direct["centroid"]],
                    "rings": direct["rings"],
                },
                "sectionRegistrationMeasurementEligible": bool(fit and fit["measurementEligible"]),
                "publicationEligible": False,
            })
            continue
        if fit is None:
            unresolved_rows.append({
                "rowKey": row["rowKey"],
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "blockers": ["NO_SECTION_LOCAL_MAP_REGISTRATION_FIT"],
            })
            continue
        parameters = np.asarray(fit["affineParameters"], dtype=np.float64)
        endpoints = apply_affine(row["venue"]["endpoints"], parameters)
        centroid = apply_affine(row["venue"]["centroid"][None, :], parameters)[0]
        width = section_widths[row["sectionId"]]
        output_rows.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "publishedSeatCount": row["publishedSeatCount"],
            "horizontalGeometry": {
                "coordinateReferenceSystem": "EPSG:6347",
                "method": "section-local-current-seat-map-prediction",
                "centroidMetres": [float(value) for value in centroid],
                "rings": [predicted_ring(endpoints, width)],
                "estimatedWidthMetres": width,
            },
            "sectionRegistrationMeasurementEligible": fit["measurementEligible"],
            "publicationEligible": False,
            "blockers": ["PREDICTED_ROW_REQUIRES_INDEPENDENT_CURRENT_CONFIRMATION"],
        })

    holdout_residuals = [
        residual
        for fit in fits.values()
        for result in fit["rowResiduals"]
        if result["partition"] == "holdout"
        for residual in [result["centroidResidualMetres"], *result["endpointResidualsMetres"]]
    ]
    stable_payload = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "venueMapArtifactVersion": venue_map["artifactVersion"],
        "fits": fits,
        "rows": output_rows,
        "unresolvedRows": unresolved_rows,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    ).hexdigest()
    predicted_count = sum(
        row["horizontalGeometry"]["method"] == "section-local-current-seat-map-prediction"
        for row in output_rows
    )
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "section-local-current-map-row-registration-candidate",
        "artifactVersion": artifact_version,
        "stadiumId": venue_map["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": control["artifactVersion"],
            "venueMapArtifactVersion": venue_map["artifactVersion"],
        },
        "counts": {
            "currentVenueRows": len(current_rows),
            "exactIdentityMatchedRows": sum("control" in row for row in current_rows),
            "predictedCurrentOnlyRows": predicted_count,
            "representedRows": len(output_rows),
            "unresolvedRows": len(unresolved_rows),
            "sectionsWithFits": len(fits),
            "measurementEligibleSectionFits": sum(fit["measurementEligible"] for fit in fits.values()),
        },
        "holdout": {
            "oneFootThresholdMetres": ONE_FOOT_METRES,
            "sampleCount": len(holdout_residuals),
            "medianResidualMetres": percentile(holdout_residuals, 50),
            "p95ResidualMetres": percentile(holdout_residuals, 95),
            "maximumResidualMetres": max(holdout_residuals) if holdout_residuals else None,
            "withinOneFootPercent": float(
                np.mean(np.asarray(holdout_residuals) <= ONE_FOOT_METRES) * 100.0
            ) if holdout_residuals else None,
        },
        "sectionFits": fits,
        "rows": output_rows,
        "unresolvedRows": unresolved_rows,
        "publication": {
            "eligible": False,
            "blockers": [
                "STALE_ROW_CONTROL_REQUIRES_CURRENT_ORTHOPHOTO_CONFIRMATION",
                "PREDICTED_CURRENT_ONLY_ROWS_REQUIRE_INDEPENDENT_CONFIRMATION",
                "VERTICAL_SEAT_SURFACE_NOT_COMPLETE",
                "OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED"
            ]
        }
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact_version,
        "counts": artifact["counts"],
        "holdout": artifact["holdout"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
