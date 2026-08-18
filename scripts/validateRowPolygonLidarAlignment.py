#!/usr/bin/env python3
"""Validate georeferenced row polygons against independent LiDAR raster edges."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from collections import defaultdict
from pathlib import Path

import numpy as np
from scipy.ndimage import gaussian_filter, map_coordinates


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


def finite_filled(values: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    finite = np.isfinite(values)
    if not finite.any():
        raise ValueError("Raster contains no finite values")
    fill = float(np.median(values[finite]))
    return np.where(finite, values, fill).astype(np.float64), finite


def robust_scale(values: np.ndarray, finite: np.ndarray) -> np.ndarray:
    sample = values[finite]
    lower = float(np.percentile(sample, 5))
    upper = float(np.percentile(sample, 95))
    span = max(upper - lower, 1e-9)
    return np.clip((values - lower) / span, 0.0, 1.0)


def edge_strength(values: np.ndarray, finite: np.ndarray, sigma_cells: float) -> np.ndarray:
    normalized = robust_scale(values, finite)
    blurred = gaussian_filter(normalized, sigma=sigma_cells, mode="nearest")
    north_gradient, east_gradient = np.gradient(blurred)
    magnitude = np.hypot(north_gradient, east_gradient)
    support = gaussian_filter(finite.astype(np.float64), sigma=sigma_cells, mode="constant")
    magnitude[support < 0.80] = np.nan
    return magnitude


def sample_ring_edges(
    raw_ring: list[list[float]],
    spacing_metres: float,
    stadium_center: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    ring = np.asarray(raw_ring, dtype=np.float64)
    if ring.shape[0] < 4:
        return np.empty((0, 2), dtype=np.float64), np.zeros(2, dtype=np.float64)
    if not np.allclose(ring[0], ring[-1]):
        ring = np.vstack((ring, ring[0]))
    unique = ring[:-1]
    centered = unique - unique.mean(axis=0)
    _, _, right_vectors = np.linalg.svd(centered, full_matrices=False)
    normal = right_vectors[-1]
    away_from_center = unique.mean(axis=0) - stadium_center
    if float(normal @ away_from_center) < 0:
        normal = -normal
    samples = []
    for start, end in zip(ring[:-1], ring[1:]):
        length = float(np.linalg.norm(end - start))
        count = max(2, int(math.ceil(length / spacing_metres)) + 1)
        positions = np.linspace(0.0, 1.0, count, endpoint=True)
        segment = start[None, :] + positions[:, None] * (end - start)[None, :]
        samples.append(segment)
    return (
        np.concatenate(samples) if samples else np.empty((0, 2), dtype=np.float64),
        normal,
    )


def percentile(values: list[float], amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values else None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("raster_metadata", type=Path)
    parser.add_argument("intensity_npy", type=Path)
    parser.add_argument("dsm_npy", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--search-radius-metres", type=float, default=0.90)
    parser.add_argument("--search-step-metres", type=float, default=0.10)
    parser.add_argument("--edge-spacing-metres", type=float, default=0.30)
    parser.add_argument("--minimum-section-rings", type=int, default=8)
    parser.add_argument("--ambiguity-distance-metres", type=float, default=0.30)
    parser.add_argument("--minimum-score-improvement", type=float, default=0.03)
    arguments = parser.parse_args()

    control = json.loads(arguments.row_control.read_text(encoding="utf-8"))
    raster = json.loads(arguments.raster_metadata.read_text(encoding="utf-8"))
    if control.get("artifactKind") != "independent-georeferenced-row-polygon-control":
        raise ValueError("Invalid row-control artifact")
    if raster.get("artifactKind") != "lidar-registration-control-raster":
        raise ValueError("Invalid raster metadata artifact")
    if arguments.search_step_metres <= 0 or arguments.search_radius_metres <= 0:
        raise ValueError("Search radius and step must be positive")

    intensity_path_hash = sha256_file(arguments.intensity_npy)
    dsm_path_hash = sha256_file(arguments.dsm_npy)
    outputs = raster.get("rasterOutputs", {})
    expected_intensity = outputs.get("meanIntensity", {}).get("sha256")
    expected_dsm = outputs.get("dsmMaximumZMetres", {}).get("sha256")
    if expected_intensity and expected_intensity != intensity_path_hash:
        raise ValueError("Intensity raster fingerprint does not match metadata")
    if expected_dsm and expected_dsm != dsm_path_hash:
        raise ValueError("DSM fingerprint does not match metadata")

    intensity_raw = np.load(arguments.intensity_npy, allow_pickle=False)
    dsm_raw = np.load(arguments.dsm_npy, allow_pickle=False)
    if intensity_raw.shape != dsm_raw.shape:
        raise ValueError("Raster shapes do not match")
    grid = raster["grid"]
    if list(intensity_raw.shape) != [grid["rows"], grid["columns"]]:
        raise ValueError("Raster shape does not match metadata")

    intensity, intensity_finite = finite_filled(intensity_raw)
    dsm, dsm_finite = finite_filled(dsm_raw)
    sigma_cells = max(0.5, 0.20 / float(grid["cellMetres"]))
    intensity_edge = edge_strength(intensity, intensity_finite, sigma_cells)
    dsm_edge = edge_strength(dsm, dsm_finite, sigma_cells)
    intensity_edge = robust_scale(
        np.nan_to_num(intensity_edge, nan=0.0), np.isfinite(intensity_edge)
    )
    dsm_edge = robust_scale(np.nan_to_num(dsm_edge, nan=0.0), np.isfinite(dsm_edge))
    combined_edge = 0.55 * intensity_edge + 0.45 * dsm_edge

    minimum_x = float(grid["minimumXMetres"])
    minimum_y = float(grid["minimumYMetres"])
    cell_metres = float(grid["cellMetres"])
    stadium_center = np.asarray([
        float(grid["centerProjectedXMetres"]),
        float(grid["centerProjectedYMetres"]),
    ])
    sections: dict[str, list[tuple[np.ndarray, np.ndarray]]] = defaultdict(list)
    for feature in control["features"]:
        attributes = feature["attributes"]
        section_id = str(attributes.get("section", "")).strip()
        if not section_id:
            continue
        for raw_ring in feature.get("geometry", {}).get("rings", []):
            samples, normal = sample_ring_edges(
                raw_ring, arguments.edge_spacing_metres, stadium_center
            )
            if samples.size:
                sections[section_id].append((samples, normal))

    offsets = np.arange(
        -arguments.search_radius_metres,
        arguments.search_radius_metres + arguments.search_step_metres * 0.5,
        arguments.search_step_metres,
        dtype=np.float64,
    )
    def score(rings: list[tuple[np.ndarray, np.ndarray]], normal_offset: float) -> float:
        shifted = np.concatenate([
            points + normal_offset * normal[None, :]
            for points, normal in rings
        ])
        columns = (shifted[:, 0] - minimum_x) / cell_metres
        rows = (shifted[:, 1] - minimum_y) / cell_metres
        values = map_coordinates(
            combined_edge,
            np.vstack((rows, columns)),
            order=1,
            mode="constant",
            cval=np.nan,
            prefilter=False,
        )
        finite = values[np.isfinite(values)]
        return float(np.mean(finite)) if finite.size else float("nan")

    section_results = []
    for section_id, rings in sorted(sections.items()):
        if len(rings) < arguments.minimum_section_rings:
            continue
        points = np.concatenate([points for points, _ in rings])
        scores = np.asarray([score(rings, offset) for offset in offsets])
        if not np.isfinite(scores).any():
            continue
        best_index = int(np.nanargmax(scores))
        best_offset = float(offsets[best_index])
        best_score = float(scores[best_index])
        identity_index = int(np.argmin(np.abs(offsets)))
        identity_score = float(scores[identity_index])
        far = np.abs(offsets - best_offset) >= arguments.ambiguity_distance_metres
        runner_score = float(np.nanmax(scores[far])) if far.any() else float("nan")
        improvement = (
            (best_score - runner_score) / max(abs(best_score), 1e-9)
            if math.isfinite(runner_score)
            else None
        )
        offset_distance = abs(best_offset)
        mean_normal = np.mean(np.asarray([normal for _, normal in rings]), axis=0)
        mean_normal_length = float(np.linalg.norm(mean_normal))
        if mean_normal_length > 1e-9:
            mean_normal /= mean_normal_length
        representative_offset = best_offset * mean_normal
        identifiable = bool(
            improvement is not None and improvement >= arguments.minimum_score_improvement
        )
        section_results.append({
            "sectionId": section_id,
            "split": "holdout" if stable_holdout(section_id) else "control",
            "ringCount": len(rings),
            "edgeSampleCount": int(points.shape[0]),
            "bestNormalOffsetMetres": best_offset,
            "bestOffsetEastMetres": float(representative_offset[0]),
            "bestOffsetNorthMetres": float(representative_offset[1]),
            "bestOffsetDistanceMetres": offset_distance,
            "bestScore": best_score,
            "identityScore": identity_score,
            "bestToRunnerRelativeImprovement": improvement,
            "identifiable": identifiable,
            "withinOneFoot": bool(offset_distance <= ONE_FOOT_METRES),
            "publicationEligible": bool(identifiable and offset_distance <= ONE_FOOT_METRES),
        })

    controls = [item for item in section_results if item["split"] == "control"]
    holdouts = [item for item in section_results if item["split"] == "holdout"]
    identifiable_holdouts = [item for item in holdouts if item["identifiable"]]
    holdout_distances = [item["bestOffsetDistanceMetres"] for item in identifiable_holdouts]
    holdout_pass = bool(
        len(identifiable_holdouts) >= 10
        and len(identifiable_holdouts) == len(holdouts)
        and percentile(holdout_distances, 50) <= ONE_FOOT_METRES
        and percentile(holdout_distances, 95) <= ONE_FOOT_METRES
    )
    stable_payload = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "rasterArtifactVersion": raster["artifactVersion"],
        "intensitySha256": intensity_path_hash,
        "dsmSha256": dsm_path_hash,
        "parameters": {
            "searchRadiusMetres": arguments.search_radius_metres,
            "searchStepMetres": arguments.search_step_metres,
            "edgeSpacingMetres": arguments.edge_spacing_metres,
            "minimumSectionRings": arguments.minimum_section_rings,
            "ambiguityDistanceMetres": arguments.ambiguity_distance_metres,
            "minimumScoreImprovement": arguments.minimum_score_improvement,
        },
        "sections": section_results,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable_payload, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "row-polygon-lidar-horizontal-alignment-validation",
        "artifactVersion": artifact_version,
        "stadiumId": control["stadiumId"],
        "sources": {
            "rowControlArtifactVersion": control["artifactVersion"],
            "rasterArtifactVersion": raster["artifactVersion"],
            "intensitySha256": intensity_path_hash,
            "dsmSha256": dsm_path_hash,
        },
        "method": {
            "description": "Section-level row-normal translation search against combined LiDAR intensity and DSM edge strength",
            "sectionSplit": "sha256(sectionId) modulo 5",
            **stable_payload["parameters"],
            "oneFootThresholdMetres": ONE_FOOT_METRES,
            "limitations": [
                "LiDAR edges do not independently prove current row identities",
                "Aerial occlusion can make covered rows unidentifiable",
                "Raster cell size limits horizontal precision",
            ],
        },
        "counts": {
            "sectionsEvaluated": len(section_results),
            "controlSections": len(controls),
            "holdoutSections": len(holdouts),
            "identifiableHoldoutSections": len(identifiable_holdouts),
            "eligibleHoldoutSections": sum(item["publicationEligible"] for item in holdouts),
        },
        "holdoutValidation": {
            "medianBestOffsetMetres": percentile(holdout_distances, 50),
            "p95BestOffsetMetres": percentile(holdout_distances, 95),
            "pass": holdout_pass,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if holdout_pass else ["HORIZONTAL_LIDAR_HOLDOUT_FAILED"]),
                "ROW_CONTROL_CURRENCY_NOT_VERIFIED",
                "CURRENT_ROW_SET_NOT_FULLY_GEOREFERENCED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
        "sections": section_results,
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
