#!/usr/bin/env python3
"""Build a closed conservative obstruction from two validated visual hulls.

Only voxels occupied in both disjoint panorama groups are retained. Each voxel
is a closed axis-aligned cube, so their union is a closed obstruction volume.
The artifact remains section-local and cannot become publication eligible
without full venue coverage and independent shadow validation.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from scipy.ndimage import label


ANALYSIS_VERSION = "conservative-closed-voxel-obstruction-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("visual_hull", type=Path)
    parser.add_argument("visual_hull_npz", type=Path)
    parser.add_argument("surface", type=Path)
    parser.add_argument("vertical_datum", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("output_npz", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--minimum-underside-contact-voxels", type=int, default=1_000)
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def values_summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 6),
        "median": None if finite.size == 0 else round(float(np.median(finite)), 6),
        "p95": None if finite.size == 0 else round(float(np.percentile(finite, 95)), 6),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 6),
    }


def render_projection(
    path: Path,
    occupancy: np.ndarray,
    x_values: np.ndarray,
    y_values: np.ndarray,
    z_values: np.ndarray,
) -> None:
    bottom = np.full((x_values.size, z_values.size), np.nan, dtype=float)
    x_indices, y_indices, z_indices = np.nonzero(occupancy)
    for x_index, y_index, z_index in zip(x_indices, y_indices, z_indices):
        current = bottom[x_index, z_index]
        value = y_values[y_index]
        if not math.isfinite(current) or value < current:
            bottom[x_index, z_index] = value
    finite = np.isfinite(bottom)
    normalized = np.zeros(bottom.shape, dtype=np.uint8)
    if np.any(finite):
        minimum = float(np.min(bottom[finite]))
        maximum = float(np.max(bottom[finite]))
        normalized[finite] = np.clip(
            255.0 * (bottom[finite] - minimum) / max(maximum - minimum, 1e-9),
            0,
            255,
        ).astype(np.uint8)
    image = cv2.applyColorMap(normalized, cv2.COLORMAP_TURBO)
    image[~finite] = (240, 240, 240)
    image = cv2.resize(image, (1400, 900), interpolation=cv2.INTER_NEAREST)
    cv2.putText(
        image,
        "consensus closed-voxel bottom envelope, provider x versus z",
        (25, 48),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.0,
        (15, 15, 15),
        3,
        cv2.LINE_AA,
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(path), image):
        raise ValueError("Could not write obstruction diagnostic")


def main() -> None:
    args = parse_args()
    visual_hull = json.loads(args.visual_hull.read_text())
    surface = json.loads(args.surface.read_text())
    datum = json.loads(args.vertical_datum.read_text())
    if not visual_hull["assessment"].get("sectionLocalVisualHullMeasurementEligible"):
        raise ValueError("Visual hull is not measurement eligible")
    if not surface["assessment"].get("providerLocalOverhangingDeckUndersideMeasurementEligible"):
        raise ValueError("Deck underside is not measurement eligible")
    if not datum["assessment"].get("sectionLocalVerticalDatumMeasurementEligible"):
        raise ValueError("Vertical datum is not measurement eligible")

    arrays = np.load(args.visual_hull_npz)
    x_values = np.asarray(arrays["provider_x_metres"], dtype=float)
    y_values = np.asarray(arrays["provider_y_metres"], dtype=float)
    z_values = np.asarray(arrays["provider_z_metres"], dtype=float)
    training = np.asarray(arrays["training_occupancy"], dtype=bool)
    holdout = np.asarray(arrays["holdout_occupancy"], dtype=bool)
    expected_shape = (x_values.size, y_values.size, z_values.size)
    if training.shape != expected_shape or holdout.shape != expected_shape:
        raise ValueError("Visual-hull array dimensions do not match the coordinate axes")
    consensus = training & holdout
    labels, component_count = label(consensus)
    component_sizes = np.bincount(labels.ravel())[1:]
    occupied_count = int(np.count_nonzero(consensus))
    if occupied_count == 0:
        raise ValueError("The disjoint visual hulls have no consensus voxels")

    voxel_size = float(visual_hull["parameters"]["voxelSizeMetres"])
    coordinate_steps = [
        np.diff(axis)
        for axis in (x_values, y_values, z_values)
        if axis.size > 1
    ]
    if any(not np.allclose(step, voxel_size, atol=1e-9) for step in coordinate_steps):
        raise ValueError("Voxel coordinate axes do not match the declared voxel size")
    x_indices, y_indices, z_indices = np.nonzero(consensus)
    occupied_points = np.column_stack([
        x_values[x_indices],
        y_values[y_indices],
        z_values[z_indices],
    ])

    plane_normal = np.asarray(surface["training"]["plane"]["normalProviderLocal"], dtype=float)
    plane_offset = float(surface["training"]["plane"]["offsetMetres"])
    with np.errstate(all="ignore"):
        plane_signed_distance = occupied_points @ plane_normal + plane_offset
    if not np.all(np.isfinite(plane_signed_distance)):
        raise ValueError("Underside plane distance calculation produced a non-finite value")
    underside_contact = np.abs(plane_signed_distance) <= (
        voxel_size * math.sqrt(3.0) / 2.0
    )
    underside_contact_count = int(np.count_nonzero(underside_contact))

    affine = np.asarray(
        datum["inputs"]["sectionRegistration"]["sectionFit"]["affineParameters"],
        dtype=float,
    )
    plan_corners = np.asarray([
        [x, z, 1.0]
        for x in (x_values[0] - voxel_size / 2.0, x_values[-1] + voxel_size / 2.0)
        for z in (z_values[0] - voxel_size / 2.0, z_values[-1] + voxel_size / 2.0)
    ])
    with np.errstate(all="ignore"):
        projected_corners = plan_corners @ affine
    if not np.all(np.isfinite(projected_corners)):
        raise ValueError("Obstruction corner georeferencing produced a non-finite value")
    vertical_offset = float(
        datum["verticalDatum"]["fittedTrainingOffsetNavd88MinusProviderYMetres"]
    )

    args.output_npz.parent.mkdir(parents=True, exist_ok=True)
    packed = np.packbits(consensus.ravel(order="C"), bitorder="little")
    np.savez_compressed(
        args.output_npz,
        provider_x_metres=x_values,
        provider_y_metres=y_values,
        provider_z_metres=z_values,
        occupancy_shape=np.asarray(consensus.shape, dtype=np.int64),
        occupancy_packbits_little=packed,
    )
    render_projection(args.output_png, consensus, x_values, y_values, z_values)

    single_connected_component = bool(
        component_count == 1 and component_sizes.size == 1 and component_sizes[0] == occupied_count
    )
    obstruction_measurement_eligible = bool(
        single_connected_component
        and underside_contact_count >= args.minimum_underside_contact_voxels
        and visual_hull["combinedAccuracy"]["withinOneFoot"]
    )
    artifact: dict[str, Any] = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "closed-conservative-section-local-voxel-obstruction",
        "artifactVersion": "sha256:pending",
        "inputs": {
            "visualHull": {"path": str(args.visual_hull), "sha256": file_sha256(args.visual_hull), "artifactVersion": visual_hull["artifactVersion"]},
            "visualHullVoxels": {"path": str(args.visual_hull_npz), "sha256": file_sha256(args.visual_hull_npz)},
            "surface": {"path": str(args.surface), "sha256": file_sha256(args.surface), "artifactVersion": surface["artifactVersion"]},
            "verticalDatum": {"path": str(args.vertical_datum), "sha256": file_sha256(args.vertical_datum), "artifactVersion": datum["artifactVersion"]},
        },
        "construction": {
            "rule": "retain only voxels occupied by both disjoint panorama visual hulls",
            "primitive": "closed axis-aligned cube for every retained voxel",
            "topology": "closed union of cubes represented by a packed occupancy grid",
            "voxelSizeMetres": voxel_size,
            "gridShapeXyz": [int(value) for value in consensus.shape],
            "occupiedVoxelCount": occupied_count,
            "closedVolumeCubicMetres": round(occupied_count * voxel_size ** 3, 6),
            "connectedComponentCount": int(component_count),
            "componentVoxelCounts": sorted(
                [int(value) for value in component_sizes],
                reverse=True,
            ),
            "singleConnectedComponent": single_connected_component,
        },
        "undersideConnection": {
            "planeEquation": surface["training"]["plane"]["equation"],
            "contactDistanceLimitMetres": round(voxel_size * math.sqrt(3.0) / 2.0, 6),
            "contactVoxelCount": underside_contact_count,
            "occupiedVoxelPlaneSignedDistanceMetres": values_summary(plane_signed_distance),
        },
        "coordinateReference": {
            "providerLocalBoundsMetres": {
                "x": [round(float(x_values[0] - voxel_size / 2.0), 6), round(float(x_values[-1] + voxel_size / 2.0), 6)],
                "y": [round(float(y_values[0] - voxel_size / 2.0), 6), round(float(y_values[-1] + voxel_size / 2.0), 6)],
                "z": [round(float(z_values[0] - voxel_size / 2.0), 6), round(float(z_values[-1] + voxel_size / 2.0), 6)],
            },
            "georeferencedPlanCornerBounds": {
                "coordinateReferenceSystem": "EPSG:6347 metres",
                "eastMinimumMetres": round(float(np.min(projected_corners[:, 0])), 6),
                "eastMaximumMetres": round(float(np.max(projected_corners[:, 0])), 6),
                "northMinimumMetres": round(float(np.min(projected_corners[:, 1])), 6),
                "northMaximumMetres": round(float(np.max(projected_corners[:, 1])), 6),
            },
            "verticalReference": {
                "coordinateReferenceSystem": "EPSG:5703 NAVD88 Geoid18 metres",
                "minimumMetres": round(float(y_values[0] - voxel_size / 2.0 + vertical_offset), 6),
                "maximumMetres": round(float(y_values[-1] + voxel_size / 2.0 + vertical_offset), 6),
            },
        },
        "combinedAccuracy": visual_hull["combinedAccuracy"],
        "providerLocalAccuracy": {
            "geometry95Metres": visual_hull["crossValidation"]["geometryUncertainty95Metres"],
            "source": "disjoint visual-hull envelope disagreement combined with half the voxel diagonal",
        },
        "voxelArtifact": {
            "path": str(args.output_npz),
            "sha256": file_sha256(args.output_npz),
            "encoding": "C-order occupancy bits packed least-significant-bit first",
        },
        "diagnosticPng": {"path": str(args.output_png), "sha256": file_sha256(args.output_png)},
        "semanticScope": {
            "established": "one closed conservative forward-overhang obstruction volume over section 123 provider x 0 to 7 metres and z 40 to 46 metres",
            "notEstablished": [
                "obstructions behind provider z 46 metres",
                "adjacent-section obstruction coverage",
                "full section 123 obstruction coverage outside the bounded volume",
                "full stadium obstruction coverage",
            ],
        },
        "assessment": {
            "closedSectionLocalObstructionMeasurementEligible": obstruction_measurement_eligible,
            "publicationEligible": False,
            "blockers": [
                "SECTION_123_SCOPE_OUTSIDE_FORWARD_VOLUME_NOT_COMPLETE",
                "ADJACENT_SECTION_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "FULL_STADIUM_OBSTRUCTION_SCOPE_NOT_COMPLETE",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    stable = dict(artifact)
    stable.pop("artifactVersion")
    artifact["artifactVersion"] = f"sha256:{value_fingerprint(stable)}"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "occupiedVoxels": occupied_count,
        "closedVolumeCubicMetres": round(occupied_count * voxel_size ** 3, 6),
        "connectedComponents": int(component_count),
        "undersideContactVoxels": underside_contact_count,
        "measurementEligible": obstruction_measurement_eligible,
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
