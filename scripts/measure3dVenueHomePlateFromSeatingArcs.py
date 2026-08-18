#!/usr/bin/env python3
"""Measure a provider-local home-plate candidate from reviewed seating arcs."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path
from typing import Any

import numpy as np
from scipy.optimize import least_squares


REQUIRED_REVIEW_STATUS = "reviewed-current-home-plate-centered-field-level-arcs"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_hash(value: Any) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
    return f"sha256:{hashlib.sha256(payload).hexdigest()}"


def fit_circle(points: np.ndarray, robust_scale: float) -> dict[str, Any]:
    design = np.column_stack((2.0 * points[:, 0], 2.0 * points[:, 1], np.ones(len(points))))
    target = np.square(points).sum(axis=1)
    center_x, center_z, constant = np.linalg.lstsq(design, target, rcond=None)[0]
    radius = max(0.0, center_x ** 2 + center_z ** 2 + constant) ** 0.5
    fit = least_squares(
        lambda values: np.linalg.norm(points - values[:2], axis=1) - values[2],
        np.asarray([center_x, center_z, radius]),
        loss="soft_l1",
        f_scale=robust_scale,
        max_nfev=20_000,
    )
    residuals = np.abs(np.linalg.norm(points - fit.x[:2], axis=1) - fit.x[2])
    return {
        "center": fit.x[:2],
        "radius": float(fit.x[2]),
        "residuals": residuals,
        "optimizationSucceeded": bool(fit.success),
        "optimizationCost": float(fit.cost),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("controls", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    controls = json.loads(args.controls.read_text())
    if controls.get("artifactKind") != "reviewed-provider-home-plate-arc-controls":
        raise ValueError("Controls have the wrong artifact kind")
    if controls.get("review", {}).get("status") != REQUIRED_REVIEW_STATUS:
        raise ValueError(f"Controls must have review status {REQUIRED_REVIEW_STATUS}")
    source_documents = {}
    for key, source in controls["sources"].items():
        path = Path(source["path"])
        actual_hash = sha256_file(path)
        if actual_hash != source["sha256"]:
            raise ValueError(f"Source hash mismatch for {key}: {path}")
        source_documents[key] = json.loads(path.read_text()) if path.suffix == ".json" else None
    metric_rows = source_documents["metricRows"]
    section_geometry = source_documents["blockmapSectionGeometry"]
    if metric_rows.get("artifactVersion") != controls["sources"]["metricRows"]["artifactVersion"]:
        raise ValueError("Metric row artifact version does not match controls")
    if section_geometry.get("artifactVersion") != controls["sources"]["blockmapSectionGeometry"]["artifactVersion"]:
        raise ValueError("Block-map geometry artifact version does not match controls")
    if metric_rows.get("stadiumId") != controls["stadiumId"]:
        raise ValueError("Metric rows are for a different stadium")
    if section_geometry.get("stadiumId") != controls["stadiumId"]:
        raise ValueError("Block-map geometry is for a different stadium")

    selected_sections = set(controls["selectedSections"])
    selected_rows = {row["rowId"]: row["partition"] for row in controls["selectedRows"]}
    available_geometry = {
        section["sectionId"] for section in section_geometry["sections"] if section.get("found")
    }
    if not selected_sections.issubset(available_geometry):
        raise ValueError("A reviewed section is missing from the current block-map SVG")
    points_by_row: dict[str, list[list[float]]] = defaultdict(list)
    sections_by_row: dict[str, set[str]] = defaultdict(set)
    source_rows_by_row: dict[str, list[str]] = defaultdict(list)
    for row in metric_rows["rows"]:
        section_id = row["sectionId"]
        row_id = row["rowId"]
        if section_id not in selected_sections or row_id not in selected_rows:
            continue
        direct_anchors = [
            anchor for anchor in row["anchors"]
            if anchor.get("directProvider3dMeasurement", True)
            and anchor.get("coordinateProvenance", "DIRECT_PROVIDER_3D_CONFIG")
            == "DIRECT_PROVIDER_3D_CONFIG"
        ]
        points_by_row[row_id].extend(
            [[float(anchor["position"][0]), float(anchor["position"][2])] for anchor in direct_anchors]
        )
        if direct_anchors:
            sections_by_row[row_id].add(section_id)
            source_rows_by_row[row_id].append(row["rowKey"])

    fit_controls = controls["fit"]
    row_fits = []
    for row_id, partition in selected_rows.items():
        points = np.asarray(points_by_row[row_id], dtype=float)
        if len(sections_by_row[row_id]) < int(fit_controls["minimumSectionsPerRow"]):
            raise ValueError(f"Row {row_id} lacks the required section coverage")
        if len(points) < int(fit_controls["minimumAnchorsPerRow"]):
            raise ValueError(f"Row {row_id} lacks the required direct anchors")
        fit = fit_circle(points, float(fit_controls["robustScaleMetres"]))
        residuals = fit.pop("residuals")
        row_fits.append({
            "rowId": row_id,
            "partition": partition,
            "sourceRowKeys": sorted(source_rows_by_row[row_id]),
            "sectionCount": len(sections_by_row[row_id]),
            "anchorCount": len(points),
            "centerProviderXZMetres": [round(float(value), 9) for value in fit.pop("center")],
            "radiusMetres": round(float(fit.pop("radius")), 9),
            "radialResidualMetres": {
                "median": round(float(np.percentile(residuals, 50)), 9),
                "p95": round(float(np.percentile(residuals, 95)), 9),
                "maximum": round(float(np.max(residuals)), 9),
            },
            **fit,
        })

    centers = np.asarray([row["centerProviderXZMetres"] for row in row_fits], dtype=float)
    final_center = np.median(centers, axis=0)
    training_center = np.median(np.asarray([
        row["centerProviderXZMetres"] for row in row_fits if row["partition"] == "training"
    ]), axis=0)
    holdout_center = np.median(np.asarray([
        row["centerProviderXZMetres"] for row in row_fits if row["partition"] == "holdout"
    ]), axis=0)
    partition_disagreement = float(np.linalg.norm(training_center - holdout_center))
    rng = np.random.default_rng(int(fit_controls["bootstrapSeed"]))
    sample_indices = rng.integers(
        0, len(centers), (int(fit_controls["bootstrapSamples"]), len(centers))
    )
    bootstrap_centers = np.median(centers[sample_indices], axis=1)
    bootstrap_errors = np.linalg.norm(bootstrap_centers - final_center[None, :], axis=1)
    bootstrap_p95 = float(np.percentile(bootstrap_errors, 95))
    combined_uncertainty = bootstrap_p95 + partition_disagreement

    thresholds = controls["thresholds"]
    blockers = []
    if any(
        row["radialResidualMetres"]["p95"]
        > float(thresholds["maximumPerRowRadialResidualP95Metres"])
        for row in row_fits
    ):
        blockers.append("SEATING_ARC_RADIAL_RESIDUAL_TOO_HIGH")
    if partition_disagreement > float(
        thresholds["maximumTrainingHoldoutCenterDisagreementMetres"]
    ):
        blockers.append("SEATING_ARC_TRAINING_HOLDOUT_DISAGREEMENT_TOO_HIGH")
    if combined_uncertainty > float(thresholds["maximumCombinedCenterUncertaintyMetres"]):
        blockers.append("SEATING_ARC_CENTER_UNCERTAINTY_TOO_HIGH")

    stable = {
        "analysisVersion": "3ddv-home-plate-from-seating-arcs-v1",
        "stadiumId": controls["stadiumId"],
        "inputs": {
            "controls": {"path": str(args.controls), "sha256": sha256_file(args.controls)},
            **controls["sources"],
        },
        "review": controls["review"],
        "method": {
            "description": "Independent robust circle fits by reviewed row, followed by a median center",
            "coordinateAxes": fit_controls["coordinateAxes"],
            "finalRefitRule": "use the median of all row centers only after alternating-row holdout gates pass",
            "combinedUncertaintyRule": "row-bootstrap p95 plus training-holdout disagreement",
            "fit": fit_controls,
        },
        "thresholds": thresholds,
        "rowFits": row_fits,
        "crossValidation": {
            "trainingCenterProviderXZMetres": [round(float(value), 9) for value in training_center],
            "holdoutCenterProviderXZMetres": [round(float(value), 9) for value in holdout_center],
            "centerDisagreementMetres": round(partition_disagreement, 9),
        },
        "measurement": {
            "homePlateArcCenterProviderPositionMetres": [
                round(float(final_center[0]), 9), 0.0, round(float(final_center[1]), 9)
            ],
            "combinedHorizontalUncertainty95Metres": round(combined_uncertainty, 9),
            "uncertaintyComponentsMetres": {
                "rowBootstrapP95": round(bootstrap_p95, 9),
                "trainingHoldoutDisagreement": round(partition_disagreement, 9),
            },
            "bootstrapCenterErrorMetres": {
                "median": round(float(np.percentile(bootstrap_errors, 50)), 9),
                "p95": round(bootstrap_p95, 9),
                "p99": round(float(np.percentile(bootstrap_errors, 99)), 9),
                "maximum": round(float(np.max(bootstrap_errors)), 9),
            },
        },
        "assessment": {
            "numericArcCenterMeasurementEligible": not blockers,
            "providerHomePlateSemanticsIndependentlyProven": False,
            "numericBlockers": blockers,
            "semanticBlockers": [
                "SEATING_ARC_CENTER_TO_HOME_PLATE_POINT_OFFSET_NOT_INDEPENDENTLY_PROVEN"
            ],
        },
        "publication": {
            "eligibleByItself": False,
            "blockers": [
                *blockers,
                "SEATING_ARC_CENTER_TO_HOME_PLATE_POINT_OFFSET_NOT_INDEPENDENTLY_PROVEN",
                "PROVIDER_CAMERA_COORDINATE_ACCURACY_NOT_REPORTED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "provider-local-home-plate-arc-center",
        "artifactVersion": stable_hash(stable),
        **stable,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "measurement": artifact["measurement"],
        "crossValidation": artifact["crossValidation"],
        "assessment": artifact["assessment"],
    }, indent=2))


if __name__ == "__main__":
    main()
