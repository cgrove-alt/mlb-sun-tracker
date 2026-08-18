#!/usr/bin/env python3
"""Measure resolved physical seat bands inside georeferenced row polygons."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path

import numpy as np
from PIL import Image
from pyproj import Transformer
from scipy.ndimage import gaussian_filter1d, map_coordinates


ONE_FOOT_METRES = 0.3048


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalized_key(section: object, row: object) -> str:
    return f"{str(section).strip()}:{str(row).strip().upper()}"


def stable_holdout(section_id: str) -> bool:
    digest = hashlib.sha256(section_id.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def percentile(values: list[float], amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values else None


def polygon_centroid(ring: np.ndarray) -> np.ndarray:
    origin = ring[0]
    shifted = ring - origin
    x_values = shifted[:, 0]
    y_values = shifted[:, 1]
    next_x = np.roll(x_values, -1)
    next_y = np.roll(y_values, -1)
    cross = x_values * next_y - next_x * y_values
    signed_double_area = float(cross.sum())
    if abs(signed_double_area) < 1e-10:
        return ring.mean(axis=0)
    return origin + np.asarray([
        float(((x_values + next_x) * cross).sum() / (3.0 * signed_double_area)),
        float(((y_values + next_y) * cross).sum() / (3.0 * signed_double_area)),
    ])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("overlay_metadata", type=Path)
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--normal-step-metres", type=float, default=0.025)
    parser.add_argument("--along-spacing-metres", type=float, default=0.15)
    parser.add_argument("--edge-inset-metres", type=float, default=0.05)
    parser.add_argument("--minimum-profile-contrast", type=float, default=0.04)
    parser.add_argument("--minimum-profile-uniqueness", type=float, default=0.01)
    parser.add_argument("--ambiguity-distance-metres", type=float, default=0.15)
    arguments = parser.parse_args()

    control = json.loads(arguments.row_control.read_text(encoding="utf-8"))
    overlay = json.loads(arguments.overlay_metadata.read_text(encoding="utf-8"))
    if control.get("artifactKind") != "independent-georeferenced-row-polygon-control":
        raise ValueError("Invalid row-control artifact")
    if overlay.get("artifactKind") != "orthophoto-row-registration-overlay":
        raise ValueError("Invalid orthophoto metadata artifact")
    orthophoto_hash = sha256_file(arguments.orthophoto)
    if overlay["source"]["orthophotoSha256"] != orthophoto_hash:
        raise ValueError("Orthophoto fingerprint does not match metadata")
    if overlay["source"]["rowControlArtifactVersion"] != control["artifactVersion"]:
        raise ValueError("Row-control fingerprint does not match metadata")

    rgb = np.asarray(Image.open(arguments.orthophoto).convert("RGB"), dtype=np.float64) / 255.0
    luma = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    extent = overlay["imageExtent"]
    transformer = Transformer.from_crs(
        overlay["rowCoordinateReferenceSystem"],
        extent["coordinateReferenceSystem"],
        always_xy=True,
    )

    def sample_luma(points: np.ndarray) -> np.ndarray:
        longitude, latitude = transformer.transform(points[:, 0], points[:, 1])
        columns = (
            (np.asarray(longitude) - extent["xmin"])
            / (extent["xmax"] - extent["xmin"])
            * rgb.shape[1]
        )
        rows = (
            (extent["ymax"] - np.asarray(latitude))
            / (extent["ymax"] - extent["ymin"])
            * rgb.shape[0]
        )
        return map_coordinates(
            luma,
            np.vstack((rows, columns)),
            order=1,
            mode="constant",
            cval=np.nan,
            prefilter=False,
        )

    def profile_metrics(profile: np.ndarray, normal_offsets: np.ndarray) -> dict | None:
        if not np.isfinite(profile).any():
            return None
        filled = np.where(np.isfinite(profile), profile, np.nanmedian(profile))
        smoothed = gaussian_filter1d(filled, sigma=0.75, mode="nearest")
        best_index = int(np.argmin(smoothed))
        best_offset = float(normal_offsets[best_index])
        best_value = float(smoothed[best_index])
        contrast = float(np.percentile(smoothed, 90) - best_value)
        far = np.abs(normal_offsets - best_offset) >= arguments.ambiguity_distance_metres
        runner_value = float(np.min(smoothed[far])) if far.any() else float("nan")
        uniqueness = runner_value - best_value if math.isfinite(runner_value) else None
        identifiable = bool(
            contrast >= arguments.minimum_profile_contrast
            and uniqueness is not None
            and uniqueness >= arguments.minimum_profile_uniqueness
        )
        return {
            "bestOffsetMetres": best_offset,
            "contrast": contrast,
            "uniqueness": uniqueness,
            "identifiable": identifiable,
        }

    ring_results = []
    for feature in control["features"]:
        attributes = feature.get("attributes", {})
        section_id = str(attributes.get("section", "")).strip()
        row_id = str(attributes.get("row", "")).strip().upper()
        row_key = normalized_key(section_id, row_id)
        for ring_index, raw_ring in enumerate(feature.get("geometry", {}).get("rings", [])):
            ring = np.asarray(raw_ring, dtype=np.float64)
            if ring.shape[0] < 4:
                continue
            if np.allclose(ring[0], ring[-1]):
                ring = ring[:-1]
            center = polygon_centroid(ring)
            centered = ring - center
            _, _, right_vectors = np.linalg.svd(centered, full_matrices=False)
            major = right_vectors[0]
            normal = right_vectors[-1]
            major_projection = centered @ major
            normal_projection = centered @ normal
            major_low = float(major_projection.min())
            major_high = float(major_projection.max())
            major_inset = min(0.40, max(0.0, (major_high - major_low) * 0.12))
            along_count = max(
                8,
                int(math.ceil(
                    max(major_high - major_low - 2.0 * major_inset, 0.1)
                    / arguments.along_spacing_metres
                )) + 1,
            )
            along = np.linspace(major_low + major_inset, major_high - major_inset, along_count)
            normal_low = float(normal_projection.min()) + arguments.edge_inset_metres
            normal_high = float(normal_projection.max()) - arguments.edge_inset_metres
            if normal_high <= normal_low:
                continue
            normal_offsets = np.arange(
                normal_low,
                normal_high + arguments.normal_step_metres * 0.5,
                arguments.normal_step_metres,
            )
            sampled_rows = []
            for normal_offset in normal_offsets:
                points = (
                    center[None, :]
                    + along[:, None] * major[None, :]
                    + normal_offset * normal[None, :]
                )
                sampled_rows.append(sample_luma(points))
            sample_matrix = np.asarray(sampled_rows, dtype=np.float64)
            split_seed = hashlib.sha256(f"{row_key}:{ring_index}".encode("utf-8")).digest()[0] % 5
            along_indices = np.arange(along_count)
            holdout_mask = (along_indices + split_seed) % 5 == 0
            control_mask = ~holdout_mask
            if holdout_mask.sum() < 6 or control_mask.sum() < 12:
                continue
            control_profile = np.asarray([
                float(np.nanpercentile(values[control_mask], 35))
                if np.isfinite(values[control_mask]).any() else np.nan
                for values in sample_matrix
            ])
            holdout_profile = np.asarray([
                float(np.nanpercentile(values[holdout_mask], 35))
                if np.isfinite(values[holdout_mask]).any() else np.nan
                for values in sample_matrix
            ])
            control_metrics = profile_metrics(control_profile, normal_offsets)
            holdout_metrics = profile_metrics(holdout_profile, normal_offsets)
            if control_metrics is None or holdout_metrics is None:
                continue
            control_valid = int(np.isfinite(sample_matrix[:, control_mask]).sum())
            holdout_valid = int(np.isfinite(sample_matrix[:, holdout_mask]).sum())
            minimum_control_valid = int(sample_matrix[:, control_mask].size * 0.90)
            minimum_holdout_valid = int(sample_matrix[:, holdout_mask].size * 0.90)
            resolved = bool(
                control_metrics["identifiable"]
                and holdout_metrics["identifiable"]
                and control_valid >= minimum_control_valid
                and holdout_valid >= minimum_holdout_valid
            )
            fitted_offset = float(control_metrics["bestOffsetMetres"])
            holdout_offset = float(holdout_metrics["bestOffsetMetres"])
            residual = abs(holdout_offset - fitted_offset)
            corrected_center = center + fitted_offset * normal
            corrected_ring = ring + fitted_offset * normal[None, :]
            corrected_line = np.asarray([
                corrected_center + major_low * major,
                corrected_center + major_high * major,
            ])
            ring_results.append({
                "rowKey": row_key,
                "sectionId": section_id,
                "rowId": row_id,
                "ringIndex": ring_index,
                "split": "holdout" if stable_holdout(section_id) else "control",
                "ringDepthMetres": float(normal_projection.max() - normal_projection.min()),
                "alongSampleCount": along_count,
                "controlAlongSampleCount": int(control_mask.sum()),
                "holdoutAlongSampleCount": int(holdout_mask.sum()),
                "normalSampleCount": int(normal_offsets.size),
                "coordinateReferenceSystem": overlay["rowCoordinateReferenceSystem"],
                "sourcePolygonCentroidMetres": [float(value) for value in center],
                "rowNormalUnitVector": [float(value) for value in normal],
                "fittedSeatBandOffsetFromPolygonCenterMetres": fitted_offset,
                "holdoutSeatBandOffsetFromPolygonCenterMetres": holdout_offset,
                "absoluteSourcePolygonCorrectionMetres": abs(fitted_offset),
                "withinRowHoldoutResidualMetres": residual,
                "correctedSeatBandCenterMetres": [float(value) for value in corrected_center],
                "correctedSeatBandLineMetres": [
                    [float(value) for value in point] for point in corrected_line
                ],
                "correctedRowRingMetres": [
                    [float(value) for value in point] for point in corrected_ring
                ],
                "controlProfileContrast": control_metrics["contrast"],
                "controlProfileUniqueness": control_metrics["uniqueness"],
                "holdoutProfileContrast": holdout_metrics["contrast"],
                "holdoutProfileUniqueness": holdout_metrics["uniqueness"],
                "resolved": resolved,
                "withinOneFoot": bool(residual <= ONE_FOOT_METRES),
                "measurementEligible": bool(resolved and residual <= ONE_FOOT_METRES),
            })

    resolved = [item for item in ring_results if item["resolved"]]
    holdouts = [item for item in ring_results if item["split"] == "holdout"]
    resolved_holdouts = [item for item in holdouts if item["resolved"]]
    holdout_residuals = [item["withinRowHoldoutResidualMetres"] for item in resolved_holdouts]
    by_section: dict[str, list[dict]] = defaultdict(list)
    for item in ring_results:
        by_section[item["sectionId"]].append(item)
    section_summaries = []
    for section_id, items in sorted(by_section.items()):
        section_resolved = [item for item in items if item["resolved"]]
        offsets = [item["withinRowHoldoutResidualMetres"] for item in section_resolved]
        section_summaries.append({
            "sectionId": section_id,
            "split": "holdout" if stable_holdout(section_id) else "control",
            "ringCount": len(items),
            "resolvedRingCount": len(section_resolved),
            "resolvedPercent": len(section_resolved) / len(items) * 100.0,
            "medianWithinRowHoldoutResidualMetres": percentile(offsets, 50),
            "p95WithinRowHoldoutResidualMetres": percentile(offsets, 95),
            "allResolvedWithinOneFoot": bool(
                section_resolved and all(item["withinOneFoot"] for item in section_resolved)
            ),
        })
    holdout_sections = [item for item in section_summaries if item["split"] == "holdout"]
    measurable_holdout_sections = [item for item in holdout_sections if item["resolvedRingCount"] >= 4]
    eligible_holdout_sections = [
        item for item in measurable_holdout_sections
        if item["p95WithinRowHoldoutResidualMetres"] is not None
        and item["p95WithinRowHoldoutResidualMetres"] <= ONE_FOOT_METRES
    ]
    holdout_pass = bool(
        len(measurable_holdout_sections) >= 10
        and len(eligible_holdout_sections) == len(measurable_holdout_sections)
        and percentile(holdout_residuals, 50) <= ONE_FOOT_METRES
        and percentile(holdout_residuals, 95) <= ONE_FOOT_METRES
    )
    parameters = {
        "normalStepMetres": arguments.normal_step_metres,
        "alongSpacingMetres": arguments.along_spacing_metres,
        "edgeInsetMetres": arguments.edge_inset_metres,
        "minimumProfileContrast": arguments.minimum_profile_contrast,
        "minimumProfileUniqueness": arguments.minimum_profile_uniqueness,
        "ambiguityDistanceMetres": arguments.ambiguity_distance_metres,
    }
    stable = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "overlayArtifactVersion": overlay["artifactVersion"],
        "orthophotoSha256": orthophoto_hash,
        "parameters": parameters,
        "rings": ring_results,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 2,
        "artifactKind": "orthophoto-row-seat-band-validation",
        "artifactVersion": artifact_version,
        "stadiumId": control["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": control["artifactVersion"],
            "overlayArtifactVersion": overlay["artifactVersion"],
            "orthophotoSha256": orthophoto_hash,
            "orthophotoServiceUrl": overlay["source"]["serviceUrl"],
            "orthophotoSourceYear": overlay["source"]["sourceYear"],
        },
        "method": {
            "description": "Dark physical seat-band localization with deterministic within-row pixel holdout",
            "sectionSplit": "sha256(sectionId) modulo 5",
            "withinRowSplit": "sha256(rowKey:ringIndex) selects one of every five along-row samples",
            "oneFootThresholdMetres": ONE_FOOT_METRES,
            **parameters,
            "limitations": [
                "Roofed and deeply shadowed rows can be unresolved",
                "Dark non-seat objects can contaminate individual profiles",
                "Seat-band location does not independently prove row labels",
                "The source year does not prove geometry remained unchanged after acquisition",
            ],
        },
        "counts": {
            "ringsEvaluated": len(ring_results),
            "resolvedRings": len(resolved),
            "holdoutRings": len(holdouts),
            "resolvedHoldoutRings": len(resolved_holdouts),
            "measurementEligibleResolvedHoldoutRings": sum(item["measurementEligible"] for item in resolved_holdouts),
            "holdoutSections": len(holdout_sections),
            "measurableHoldoutSections": len(measurable_holdout_sections),
            "eligibleHoldoutSections": len(eligible_holdout_sections),
        },
        "holdoutValidation": {
            "medianWithinRowResidualMetres": percentile(holdout_residuals, 50),
            "p95WithinRowResidualMetres": percentile(holdout_residuals, 95),
            "pass": holdout_pass,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if holdout_pass else ["ORTHOPHOTO_SEAT_BAND_HOLDOUT_FAILED"]),
                "ORTHOPHOTO_DOES_NOT_RESOLVE_ALL_ROWS",
                "ROW_CONTROL_CURRENCY_NOT_VERIFIED",
                "CURRENT_ROW_SET_NOT_FULLY_GEOREFERENCED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "sectionSummaries": section_summaries,
        "rings": ring_results,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(arguments.output),
        "artifactVersion": artifact_version,
        "counts": artifact["counts"],
        "holdoutValidation": artifact["holdoutValidation"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
