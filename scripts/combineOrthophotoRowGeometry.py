#!/usr/bin/env python3
"""Combine multi-year orthophoto and LiDAR row candidates conservatively."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path

import numpy as np


ONE_FOOT_METRES = 0.3048


def percentile(values: list[float], amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values else None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("inputs", nargs="+", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    if len(arguments.inputs) < 2:
        raise ValueError("At least two input artifacts are required")

    artifacts = [json.loads(path.read_text(encoding="utf-8")) for path in arguments.inputs]
    for artifact in artifacts:
        if artifact.get("artifactKind") != "orthophoto-lidar-current-row-geometry-candidate":
            raise ValueError("Invalid row-geometry candidate artifact")
    stadium_ids = {artifact["stadiumId"] for artifact in artifacts}
    if len(stadium_ids) != 1:
        raise ValueError("Input stadium identifiers do not match")
    venue_versions = {artifact["sources"]["venueArtifactVersion"] for artifact in artifacts}
    if len(venue_versions) != 1:
        raise ValueError("Input current venue-row versions do not match")
    current_counts = {artifact["counts"]["currentRows"] for artifact in artifacts}
    if len(current_counts) != 1:
        raise ValueError("Input current row counts do not match")

    observations: dict[str, list[dict]] = defaultdict(list)
    row_identity = {}
    for artifact in artifacts:
        source_year = None
        for row in artifact["rows"]:
            row_identity[row["rowKey"]] = {
                "sectionId": row["sectionId"],
                "rowId": row["rowId"],
                "publishedSeatCount": row["publishedSeatCount"],
            }
            if not row["measurementEligible"]:
                continue
            if source_year is None:
                source_year = artifact.get("sources", {}).get("orthophotoSourceYear")
            observations[row["rowKey"]].append({
                "artifactVersion": artifact["artifactVersion"],
                "sourceYear": source_year,
                "horizontalCentroidMetres": row["horizontalCentroidMetres"],
                "rowSurfaceElevationMetresNavd88": row["rowSurfaceElevationMetresNavd88"],
                "elevationReference": row["elevationReference"],
                "rings": row["rings"],
            })

    rows = []
    disagreement_distances = []
    agreeing_distances = []
    for row_key, identity in sorted(row_identity.items()):
        row_observations = observations.get(row_key, [])
        pairwise_horizontal = []
        pairwise_vertical = []
        for first_index, first in enumerate(row_observations):
            for second in row_observations[first_index + 1:]:
                first_xy = np.asarray(first["horizontalCentroidMetres"], dtype=np.float64)
                second_xy = np.asarray(second["horizontalCentroidMetres"], dtype=np.float64)
                pairwise_horizontal.append(float(np.linalg.norm(first_xy - second_xy)))
                first_z = first["rowSurfaceElevationMetresNavd88"]
                second_z = second["rowSurfaceElevationMetresNavd88"]
                if first_z is not None and second_z is not None:
                    pairwise_vertical.append(abs(float(first_z) - float(second_z)))
        cross_year_agreement = bool(
            len(row_observations) >= 2
            and pairwise_horizontal
            and max(pairwise_horizontal) <= ONE_FOOT_METRES
            and pairwise_vertical
            and max(pairwise_vertical) <= ONE_FOOT_METRES
        )
        if len(row_observations) >= 2:
            target = agreeing_distances if cross_year_agreement else disagreement_distances
            target.extend(pairwise_horizontal)
        centroids = np.asarray([
            observation["horizontalCentroidMetres"] for observation in row_observations
        ], dtype=np.float64)
        elevations = [
            float(observation["rowSurfaceElevationMetresNavd88"])
            for observation in row_observations
            if observation["rowSurfaceElevationMetresNavd88"] is not None
        ]
        rows.append({
            "rowKey": row_key,
            **identity,
            "coordinateReferenceSystem": "EPSG:6347",
            "observationCount": len(row_observations),
            "observationArtifactVersions": [
                observation["artifactVersion"] for observation in row_observations
            ],
            "sourceYears": sorted({
                observation["sourceYear"] for observation in row_observations
                if observation["sourceYear"] is not None
            }),
            "crossYearMaximumHorizontalDisagreementMetres": max(pairwise_horizontal) if pairwise_horizontal else None,
            "crossYearMaximumVerticalDisagreementMetres": max(pairwise_vertical) if pairwise_vertical else None,
            "horizontalCentroidMetres": (
                [float(value) for value in np.median(centroids, axis=0)]
                if centroids.size else None
            ),
            "rowSurfaceElevationMetresNavd88": float(np.median(elevations)) if elevations else None,
            "elevationReference": "lidar-dsm-top-of-visible-row-band" if elevations else None,
            "measurementTier": (
                "cross-year-image-agreement" if cross_year_agreement
                else "single-year-candidate" if len(row_observations) == 1
                else "cross-year-disagreement" if len(row_observations) >= 2
                else "unresolved"
            ),
            "measurementEligible": cross_year_agreement,
            "publicationEligible": False,
            "blockers": [
                *([] if cross_year_agreement else [
                    "INSUFFICIENT_CROSS_YEAR_AGREEMENT" if len(row_observations) < 2
                    else "CROSS_YEAR_GEOMETRY_DISAGREEMENT"
                ]),
                "DSM_RETURN_SEMANTICS_NOT_SEAT_PAN",
                "OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        })

    cross_year_rows = [row for row in rows if row["observationCount"] >= 2]
    agreeing_rows = [row for row in rows if row["measurementEligible"]]
    single_year_rows = [row for row in rows if row["measurementTier"] == "single-year-candidate"]
    stable = {
        "inputArtifactVersions": [artifact["artifactVersion"] for artifact in artifacts],
        "rows": rows,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "multi-year-orthophoto-lidar-current-row-geometry-candidate",
        "artifactVersion": artifact_version,
        "stadiumId": next(iter(stadium_ids)),
        "sources": {
            "venueArtifactVersion": next(iter(venue_versions)),
            "inputArtifactVersions": stable["inputArtifactVersions"],
        },
        "method": {
            "description": "Cross-year agreement of independently resolved orthophoto seat bands using a common LiDAR DSM",
            "oneFootThresholdMetres": ONE_FOOT_METRES,
            "limitations": [
                "Both years use the same historical row-identity control",
                "Both years use the same LiDAR elevation raster",
                "Cross-year agreement validates image localization but not current row labels",
            ],
        },
        "counts": {
            "currentRows": next(iter(current_counts)),
            "rowsRepresentedInCandidateArtifacts": len(rows),
            "uniqueSingleOrMultiYearMetricCandidates": len(observations),
            "singleYearCandidateRows": len(single_year_rows),
            "crossYearCandidateRows": len(cross_year_rows),
            "crossYearAgreementRows": len(agreeing_rows),
            "crossYearDisagreementRows": len(cross_year_rows) - len(agreeing_rows),
        },
        "crossYearValidation": {
            "agreeingPairMedianDistanceMetres": percentile(agreeing_distances, 50),
            "agreeingPairP95DistanceMetres": percentile(agreeing_distances, 95),
            "disagreeingPairMedianDistanceMetres": percentile(disagreement_distances, 50),
            "disagreeingPairP95DistanceMetres": percentile(disagreement_distances, 95),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "CURRENT_ROW_SET_NOT_FULLY_GEOREFERENCED",
                "DSM_RETURN_SEMANTICS_NOT_SEAT_PAN",
                "OBSTRUCTION_GEOMETRY_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "rows": rows,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact_version,
        "counts": artifact["counts"],
        "crossYearValidation": artifact["crossYearValidation"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
