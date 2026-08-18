#!/usr/bin/env python3
"""Validate row polygons against a high-resolution georeferenced orthophoto."""

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
from scipy.ndimage import gaussian_filter, map_coordinates


ONE_FOOT_METRES = 0.3048


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_holdout(section_id: str) -> bool:
    digest = hashlib.sha256(section_id.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], "big") % 5 == 0


def percentile(values: list[float], amount: float) -> float | None:
    return float(np.percentile(values, amount)) if values else None


def robust_scale(values: np.ndarray) -> np.ndarray:
    lower, upper = np.percentile(values, [5, 99])
    span = max(float(upper - lower), 1e-9)
    return np.clip((values - lower) / span, 0.0, 1.0)


def image_edge_strength(image: np.ndarray, sigma_pixels: float) -> np.ndarray:
    channels = []
    for channel in range(image.shape[2]):
        blurred = gaussian_filter(image[..., channel], sigma=sigma_pixels, mode="nearest")
        vertical, horizontal = np.gradient(blurred)
        channels.append(np.hypot(vertical, horizontal))
    combined = np.sqrt(np.sum(np.square(channels), axis=0))
    return robust_scale(combined)


def long_edge_samples(
    raw_ring: list[list[float]],
    spacing_metres: float,
    stadium_center: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    ring = np.asarray(raw_ring, dtype=np.float64)
    if ring.shape[0] < 4:
        return np.empty((0, 2), dtype=np.float64), np.empty((0, 2), dtype=np.float64)
    if np.allclose(ring[0], ring[-1]):
        ring = ring[:-1]
    centered = ring - ring.mean(axis=0)
    _, _, right_vectors = np.linalg.svd(centered, full_matrices=False)
    normal = right_vectors[-1]
    if float(normal @ (ring.mean(axis=0) - stadium_center)) < 0:
        normal = -normal
    ends = np.roll(ring, -1, axis=0)
    lengths = np.linalg.norm(ends - ring, axis=1)
    if not lengths.size or float(lengths.max()) < 0.5:
        return np.empty((0, 2), dtype=np.float64), np.empty((0, 2), dtype=np.float64)
    selected = np.flatnonzero(lengths >= float(lengths.max()) * 0.55)
    points = []
    normals = []
    for index in selected:
        start = ring[index]
        end = ends[index]
        length = float(lengths[index])
        inset = min(0.35, length * 0.10)
        count = max(2, int(math.ceil(max(length - 2.0 * inset, 0.1) / spacing_metres)) + 1)
        fractions = np.linspace(inset / length, 1.0 - inset / length, count)
        segment = start[None, :] + fractions[:, None] * (end - start)[None, :]
        points.append(segment)
        normals.append(np.repeat(normal[None, :], count, axis=0))
    return (
        np.concatenate(points) if points else np.empty((0, 2), dtype=np.float64),
        np.concatenate(normals) if normals else np.empty((0, 2), dtype=np.float64),
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("row_control", type=Path)
    parser.add_argument("overlay_metadata", type=Path)
    parser.add_argument("orthophoto", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--search-radius-metres", type=float, default=0.50)
    parser.add_argument("--search-step-metres", type=float, default=0.025)
    parser.add_argument("--edge-spacing-metres", type=float, default=0.12)
    parser.add_argument("--minimum-section-rings", type=int, default=8)
    parser.add_argument("--ambiguity-distance-metres", type=float, default=0.15)
    parser.add_argument("--minimum-score-improvement", type=float, default=0.015)
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

    image = np.asarray(Image.open(arguments.orthophoto).convert("RGB"), dtype=np.float64) / 255.0
    edge = image_edge_strength(image, sigma_pixels=1.0)
    extent = overlay["imageExtent"]
    transformer = Transformer.from_crs(
        overlay["rowCoordinateReferenceSystem"],
        extent["coordinateReferenceSystem"],
        always_xy=True,
    )
    inverse_transformer = Transformer.from_crs(
        extent["coordinateReferenceSystem"],
        overlay["rowCoordinateReferenceSystem"],
        always_xy=True,
    )
    center_longitude = (extent["xmin"] + extent["xmax"]) / 2.0
    center_latitude = (extent["ymin"] + extent["ymax"]) / 2.0
    center_x, center_y = inverse_transformer.transform(center_longitude, center_latitude)
    stadium_center = np.asarray([center_x, center_y], dtype=np.float64)

    sections: dict[str, list[tuple[np.ndarray, np.ndarray]]] = defaultdict(list)
    for feature in control["features"]:
        section_id = str(feature.get("attributes", {}).get("section", "")).strip()
        if not section_id:
            continue
        for raw_ring in feature.get("geometry", {}).get("rings", []):
            points, normals = long_edge_samples(
                raw_ring, arguments.edge_spacing_metres, stadium_center
            )
            if points.size:
                sections[section_id].append((points, normals))

    offsets = np.arange(
        -arguments.search_radius_metres,
        arguments.search_radius_metres + arguments.search_step_metres * 0.5,
        arguments.search_step_metres,
        dtype=np.float64,
    )

    def score(points: np.ndarray, normals: np.ndarray, offset: float) -> float:
        shifted = points + offset * normals
        longitude, latitude = transformer.transform(shifted[:, 0], shifted[:, 1])
        columns = (
            (np.asarray(longitude) - extent["xmin"])
            / (extent["xmax"] - extent["xmin"])
            * image.shape[1]
        )
        rows = (
            (extent["ymax"] - np.asarray(latitude))
            / (extent["ymax"] - extent["ymin"])
            * image.shape[0]
        )
        values = map_coordinates(
            edge,
            np.vstack((rows, columns)),
            order=1,
            mode="constant",
            cval=np.nan,
            prefilter=False,
        )
        finite = values[np.isfinite(values)]
        if not finite.size:
            return float("nan")
        lower, upper = np.percentile(finite, [5, 95])
        trimmed = finite[(finite >= lower) & (finite <= upper)]
        return float(np.mean(trimmed)) if trimmed.size else float("nan")

    section_results = []
    for section_id, rings in sorted(sections.items()):
        if len(rings) < arguments.minimum_section_rings:
            continue
        points = np.concatenate([item[0] for item in rings])
        normals = np.concatenate([item[1] for item in rings])
        scores = np.asarray([score(points, normals, offset) for offset in offsets])
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
        identifiable = bool(
            improvement is not None and improvement >= arguments.minimum_score_improvement
        )
        section_results.append({
            "sectionId": section_id,
            "split": "holdout" if stable_holdout(section_id) else "control",
            "ringCount": len(rings),
            "edgeSampleCount": int(points.shape[0]),
            "bestNormalOffsetMetres": best_offset,
            "bestScore": best_score,
            "identityScore": identity_score,
            "bestToRunnerRelativeImprovement": improvement,
            "identifiable": identifiable,
        })

    controls = [item for item in section_results if item["split"] == "control"]
    identifiable_controls = [item for item in controls if item["identifiable"]]
    holdouts = [item for item in section_results if item["split"] == "holdout"]
    identifiable_holdouts = [item for item in holdouts if item["identifiable"]]
    control_offsets = [item["bestNormalOffsetMetres"] for item in identifiable_controls]
    fitted_offset = percentile(control_offsets, 50)
    for item in section_results:
        residual = (
            abs(item["bestNormalOffsetMetres"] - fitted_offset)
            if fitted_offset is not None and item["identifiable"]
            else None
        )
        item["controlFitResidualMetres"] = residual
        item["withinOneFootOfControlFit"] = bool(
            residual is not None and residual <= ONE_FOOT_METRES
        )
        item["publicationEligible"] = bool(
            item["identifiable"] and item["withinOneFootOfControlFit"]
        )
    holdout_residuals = [
        item["controlFitResidualMetres"]
        for item in identifiable_holdouts
        if item["controlFitResidualMetres"] is not None
    ]
    holdout_pass = bool(
        fitted_offset is not None
        and abs(fitted_offset) <= ONE_FOOT_METRES
        and len(identifiable_holdouts) >= 10
        and len(identifiable_holdouts) == len(holdouts)
        and percentile(holdout_residuals, 50) <= ONE_FOOT_METRES
        and percentile(holdout_residuals, 95) <= ONE_FOOT_METRES
    )
    parameters = {
        "searchRadiusMetres": arguments.search_radius_metres,
        "searchStepMetres": arguments.search_step_metres,
        "edgeSpacingMetres": arguments.edge_spacing_metres,
        "minimumSectionRings": arguments.minimum_section_rings,
        "ambiguityDistanceMetres": arguments.ambiguity_distance_metres,
        "minimumScoreImprovement": arguments.minimum_score_improvement,
    }
    stable = {
        "rowControlArtifactVersion": control["artifactVersion"],
        "overlayArtifactVersion": overlay["artifactVersion"],
        "orthophotoSha256": orthophoto_hash,
        "parameters": parameters,
        "sections": section_results,
    }
    artifact_version = "sha256:" + hashlib.sha256(
        json.dumps(stable, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "row-polygon-orthophoto-horizontal-alignment-validation",
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
            "description": "Section-level row-normal fit of long row-polygon boundaries to orthophoto colour edges",
            "sectionSplit": "sha256(sectionId) modulo 5",
            "oneFootThresholdMetres": ONE_FOOT_METRES,
            **parameters,
            "limitations": [
                "Roofed and deeply shadowed seating can be visually unidentifiable",
                "Image edges validate physical alignment but do not independently prove row labels",
                "The source year does not prove geometry remained unchanged after acquisition",
            ],
        },
        "counts": {
            "sectionsEvaluated": len(section_results),
            "controlSections": len(controls),
            "identifiableControlSections": len(identifiable_controls),
            "holdoutSections": len(holdouts),
            "identifiableHoldoutSections": len(identifiable_holdouts),
            "eligibleHoldoutSections": sum(item["publicationEligible"] for item in holdouts),
        },
        "controlFit": {
            "normalOffsetMetres": fitted_offset,
            "absoluteOffsetMetres": abs(fitted_offset) if fitted_offset is not None else None,
        },
        "holdoutValidation": {
            "medianResidualMetres": percentile(holdout_residuals, 50),
            "p95ResidualMetres": percentile(holdout_residuals, 95),
            "pass": holdout_pass,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if holdout_pass else ["ORTHOPHOTO_HORIZONTAL_HOLDOUT_FAILED"]),
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
        "controlFit": artifact["controlFit"],
        "holdoutValidation": artifact["holdoutValidation"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
