#!/usr/bin/env python3
"""Compare observed row shade boundaries with measured provider-frame anchors.

The analysis lifts every reviewed broadcast boundary sample back onto the
registered metric row surface, casts a ray from that point toward the sun, and
measures each independently reconstructed panorama anchor against those rays.
Training and holdout observations are kept explicit and disjoint. The output is
diagnostic only: proximity to a boundary ray does not turn an unsegmented point
cloud into a closed or publication-eligible obstruction.
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
from scipy.spatial import cKDTree


ANALYSIS_VERSION = "observed-boundary-sun-ray-anchor-consistency-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("metric_rows", type=Path)
    parser.add_argument("true_north_orientation", type=Path)
    parser.add_argument("anchor_artifact", type=Path)
    parser.add_argument("anchor_npz", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument(
        "--training-observation",
        nargs=2,
        action="append",
        metavar=("BOUNDARY_JSON", "REGISTRATION_JSON"),
        default=[],
    )
    parser.add_argument(
        "--holdout-observation",
        nargs=2,
        action="append",
        metavar=("BOUNDARY_JSON", "REGISTRATION_JSON"),
        default=[],
    )
    parser.add_argument("--section-id", default="SEC35")
    parser.add_argument("--maximum-nominal-ray-distance-metres", type=float, default=0.3048)
    parser.add_argument("--cluster-link-distance-metres", type=float, default=0.5)
    parser.add_argument("--minimum-cluster-points", type=int, default=3)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


def percentile(values: np.ndarray, probability: float) -> float | None:
    finite = values[np.isfinite(values)]
    if finite.size == 0:
        return None
    return round(float(np.percentile(finite, probability)), 6)


def value_summary(values: np.ndarray) -> dict[str, float | int | None]:
    finite = values[np.isfinite(values)]
    return {
        "count": int(finite.size),
        "minimum": None if finite.size == 0 else round(float(np.min(finite)), 6),
        "median": percentile(finite, 50),
        "p95": percentile(finite, 95),
        "maximum": None if finite.size == 0 else round(float(np.max(finite)), 6),
    }


def sun_direction_provider(
    altitude_degrees: float,
    azimuth_degrees: float,
    provider_x_bearing_degrees: float,
    provider_z_bearing_degrees: float,
) -> np.ndarray:
    altitude = math.radians(altitude_degrees)
    azimuth = math.radians(azimuth_degrees)
    east_north = np.asarray(
        [
            math.cos(altitude) * math.sin(azimuth),
            math.cos(altitude) * math.cos(azimuth),
        ],
        dtype=np.float64,
    )

    def basis(bearing_degrees: float) -> np.ndarray:
        bearing = math.radians(bearing_degrees)
        return np.asarray([math.sin(bearing), math.cos(bearing)], dtype=np.float64)

    direction = np.asarray(
        [
            float(east_north @ basis(provider_x_bearing_degrees)),
            math.sin(altitude),
            float(east_north @ basis(provider_z_bearing_degrees)),
        ],
        dtype=np.float64,
    )
    direction /= np.linalg.norm(direction)
    return direction


def interpolate_segment_at_x(
    projected_pixels: np.ndarray,
    provider_points: np.ndarray,
    x_value: float,
) -> tuple[np.ndarray, float]:
    if projected_pixels.shape != provider_points[:, :2].shape:
        raise ValueError("Projected and provider anchor counts do not match")
    candidates: list[tuple[np.ndarray, float]] = []
    for index in range(projected_pixels.shape[0] - 1):
        first_pixel = projected_pixels[index]
        second_pixel = projected_pixels[index + 1]
        first_x = float(first_pixel[0])
        second_x = float(second_pixel[0])
        if not min(first_x, second_x) <= x_value <= max(first_x, second_x):
            continue
        span = second_x - first_x
        fraction = 0.5 if abs(span) <= 1e-12 else (x_value - first_x) / span
        point = provider_points[index] + fraction * (
            provider_points[index + 1] - provider_points[index]
        )
        projected_y = float(first_pixel[1] + fraction * (second_pixel[1] - first_pixel[1]))
        candidates.append((point, projected_y))
    if not candidates:
        raise ValueError(f"No registered row segment covers x={x_value}")
    y_values = np.asarray([item[1] for item in candidates], dtype=np.float64)
    if float(np.ptp(y_values)) > 0.25:
        raise ValueError("A projected row is not single-valued at a boundary sample")
    return (
        np.mean(np.asarray([item[0] for item in candidates], dtype=np.float64), axis=0),
        float(np.mean(y_values)),
    )


def load_metric_row_lookup(metric_rows: dict[str, Any], section_id: str) -> dict[str, dict[str, Any]]:
    rows = {
        str(row["rowId"]): row
        for row in metric_rows.get("rows", [])
        if str(row.get("sectionId")) == section_id
    }
    if not rows:
        raise ValueError(f"No metric rows found for section {section_id}")
    return rows


def lift_boundary_samples(
    boundary_path: Path,
    registration_path: Path,
    metric_rows: dict[str, Any],
    metric_row_lookup: dict[str, dict[str, Any]],
    orientation: dict[str, Any],
    section_id: str,
    partition: str,
) -> dict[str, Any]:
    boundary = json.loads(boundary_path.read_text())
    registration = json.loads(registration_path.read_text())
    boundary_sha = sha256_file(boundary_path)
    registration_sha = sha256_file(registration_path)
    expected_registration = boundary.get("inputs", {}).get("rowRegistration", {})
    if expected_registration.get("sha256") != registration_sha:
        raise ValueError(f"Boundary {boundary_path} does not lock the supplied registration")
    if boundary.get("sectionId") != section_id or registration.get("sectionId") != section_id:
        raise ValueError("Boundary or registration section does not match the requested section")
    if not boundary.get("measurementValidation", {}).get("eligibleAsObservedBoundaryMeasurement"):
        raise ValueError(f"Boundary {boundary_path} is not measurement eligible")
    if not registration.get("registrationEligibleForManualShadeReview"):
        raise ValueError(f"Registration {registration_path} is not review eligible")

    registered_rows = {str(row["rowId"]): row for row in registration.get("rows", [])}
    registration_row_order = [str(row["rowId"]) for row in registration.get("rows", [])]
    orientation_values = orientation["orientation"]
    solar = boundary["solarPositionAtEventMidpoint"]
    direction = sun_direction_provider(
        float(solar["altitudeDegrees"]),
        float(solar["azimuthDegrees"]),
        float(orientation_values["providerPositiveXTrueBearingDegrees"]),
        float(orientation_values["providerPositiveZTrueBearingDegrees"]),
    )

    row_points: dict[tuple[str, float], tuple[np.ndarray, float]] = {}

    def row_point(row_id: str, x_value: float) -> tuple[np.ndarray, float]:
        key = (row_id, x_value)
        if key in row_points:
            return row_points[key]
        registered = registered_rows.get(row_id)
        metric = metric_row_lookup.get(row_id)
        if registered is None or metric is None:
            raise ValueError(f"Row {row_id} is absent from registration or metric rows")
        metric_anchors = {anchor["seatId"]: anchor for anchor in metric["anchors"]}
        anchor_ids = registered.get("anchorSeatIds", [])
        if any(anchor_id not in metric_anchors for anchor_id in anchor_ids):
            raise ValueError(f"Registration row {row_id} names an unknown metric anchor")
        projected = np.asarray(registered["projectedAnchorPixels"], dtype=np.float64)
        provider = np.asarray(
            [metric_anchors[anchor_id]["position"] for anchor_id in anchor_ids],
            dtype=np.float64,
        )
        value = interpolate_segment_at_x(projected, provider, x_value)
        row_points[key] = value
        return value

    samples = []
    for sample in boundary.get("samples", []):
        x_value = float(sample["observedBoundaryPixel"][0])
        front_row = str(sample["frontBracketRowId"])
        back_row = str(sample["backBracketRowId"])
        if registration_row_order.index(back_row) != registration_row_order.index(front_row) + 1:
            raise ValueError("Boundary sample bracket rows are not adjacent in registration order")
        front_point, front_y = row_point(front_row, x_value)
        back_point, back_y = row_point(back_row, x_value)
        fraction = float(sample["fractionFromFrontBracketRow"])
        point = front_point + fraction * (back_point - front_point)
        reconstructed_y = front_y + fraction * (back_y - front_y)
        observed_y = float(sample["observedBoundaryPixel"][1])
        if abs(reconstructed_y - observed_y) > 1e-6:
            raise ValueError("Lifted sample does not reproduce the reviewed broadcast pixel")
        samples.append(
            {
                "sampleId": str(sample["id"]),
                "originProviderMetres": [round(float(value), 9) for value in point],
                "sunDirectionProviderUnit": [round(float(value), 12) for value in direction],
                "frontRowId": front_row,
                "backRowId": back_row,
                "fractionFromFrontRow": fraction,
                "localMetricRowSpacingMetres": round(float(np.linalg.norm(back_point - front_point)), 9),
                "combinedLabelUncertaintyRows": float(sample["combinedLabelUncertaintyRows"]),
                "nominalBoundaryPointUncertaintyMetres": round(
                    float(
                        np.linalg.norm(back_point - front_point)
                        * float(sample["combinedLabelUncertaintyRows"])
                    ),
                    9,
                ),
            }
        )
    if not samples:
        raise ValueError(f"Boundary {boundary_path} contains no samples")
    return {
        "observationId": boundary["artifactVersion"],
        "partition": partition,
        "boundary": {
            "path": str(boundary_path),
            "sha256": boundary_sha,
            "artifactVersion": boundary["artifactVersion"],
        },
        "registration": {
            "path": str(registration_path),
            "sha256": registration_sha,
            "artifactVersion": registration["artifactVersion"],
        },
        "eventMidpointTime": boundary["timestampEvidence"]["eventMidpointTime"],
        "solarPositionAtEventMidpoint": solar,
        "samples": samples,
    }


def ray_distances(points: np.ndarray, observation: dict[str, Any]) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    minimum_distances = np.full(points.shape[0], np.inf, dtype=np.float64)
    closest_sample_indices = np.full(points.shape[0], -1, dtype=np.int32)
    closest_ray_parameters = np.full(points.shape[0], np.nan, dtype=np.float64)
    for sample_index, sample in enumerate(observation["samples"]):
        origin = np.asarray(sample["originProviderMetres"], dtype=np.float64)
        direction = np.asarray(sample["sunDirectionProviderUnit"], dtype=np.float64)
        relative = points - origin[None, :]
        parameters = np.einsum("ij,j->i", relative, direction)
        closest = origin[None, :] + parameters[:, None] * direction[None, :]
        distances = np.linalg.norm(points - closest, axis=1)
        distances[parameters <= 0.0] = np.inf
        better = distances < minimum_distances
        minimum_distances[better] = distances[better]
        closest_sample_indices[better] = sample_index
        closest_ray_parameters[better] = parameters[better]
    return minimum_distances, closest_sample_indices, closest_ray_parameters


def connected_components(points: np.ndarray, link_distance: float) -> list[np.ndarray]:
    if points.shape[0] == 0:
        return []
    tree = cKDTree(points)
    pairs = tree.query_pairs(link_distance, output_type="ndarray")
    parent = np.arange(points.shape[0], dtype=np.int32)

    def find(index: int) -> int:
        while parent[index] != index:
            parent[index] = parent[parent[index]]
            index = int(parent[index])
        return index

    def union(first: int, second: int) -> None:
        first_root = find(first)
        second_root = find(second)
        if first_root != second_root:
            parent[second_root] = first_root

    for first, second in pairs:
        union(int(first), int(second))
    groups: dict[int, list[int]] = {}
    for index in range(points.shape[0]):
        groups.setdefault(find(index), []).append(index)
    return [np.asarray(indices, dtype=np.int32) for indices in groups.values()]


def render_diagnostic(
    output_path: Path,
    all_points: np.ndarray,
    selected_points: np.ndarray,
    observations: list[dict[str, Any]],
) -> None:
    width = 1500
    height = 760
    margin = 55
    canvas = np.full((height, width, 3), 248, dtype=np.uint8)
    panels = [
        ("provider X versus Z", 0, 2, (margin, margin, 720, height - margin)),
        ("provider Z versus Y", 2, 1, (780, margin, width - margin, height - margin)),
    ]
    colors = {"training": (35, 130, 255), "holdout": (190, 80, 40)}
    for title, axis_x, axis_y, (left, top, right, bottom) in panels:
        combined = all_points
        minima = np.min(combined[:, [axis_x, axis_y]], axis=0)
        maxima = np.max(combined[:, [axis_x, axis_y]], axis=0)
        padding = np.maximum((maxima - minima) * 0.05, 0.1)
        minima -= padding
        maxima += padding

        def pixel(point: np.ndarray) -> tuple[int, int]:
            x_value = left + (float(point[axis_x]) - minima[0]) / (maxima[0] - minima[0]) * (right - left)
            y_value = bottom - (float(point[axis_y]) - minima[1]) / (maxima[1] - minima[1]) * (bottom - top)
            return int(round(x_value)), int(round(y_value))

        cv2.rectangle(canvas, (left, top), (right, bottom), (180, 180, 180), 1)
        cv2.putText(canvas, title, (left, top - 16), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (30, 30, 30), 1, cv2.LINE_AA)
        for point in all_points:
            cv2.circle(canvas, pixel(point), 1, (205, 205, 205), -1, cv2.LINE_AA)
        for point in selected_points:
            cv2.circle(canvas, pixel(point), 3, (35, 35, 220), -1, cv2.LINE_AA)
        for observation in observations:
            color = colors[observation["partition"]]
            for sample in observation["samples"]:
                origin = np.asarray(sample["originProviderMetres"], dtype=np.float64)
                direction = np.asarray(sample["sunDirectionProviderUnit"], dtype=np.float64)
                start = pixel(origin)
                end = pixel(origin + direction * 100.0)
                cv2.line(canvas, start, end, color, 1, cv2.LINE_AA)
    cv2.putText(
        canvas,
        "gray: all anchors   red: training-consistent candidates   orange: training rays   blue: holdout rays",
        (margin, height - 18),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.52,
        (30, 30, 30),
        1,
        cv2.LINE_AA,
    )
    if not cv2.imwrite(str(output_path), canvas, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write diagnostic PNG")


def main() -> None:
    args = parse_args()
    if len(args.training_observation) < 2:
        raise ValueError("At least two training observations are required")
    if len(args.holdout_observation) < 1:
        raise ValueError("At least one holdout observation is required")
    if args.maximum_nominal_ray_distance_metres <= 0.0:
        raise ValueError("Maximum ray distance must be positive")
    if args.cluster_link_distance_metres <= 0.0 or args.minimum_cluster_points < 1:
        raise ValueError("Invalid cluster thresholds")

    metric_rows = json.loads(args.metric_rows.read_text())
    orientation = json.loads(args.true_north_orientation.read_text())
    anchor_artifact = json.loads(args.anchor_artifact.read_text())
    if not orientation.get("assessment", {}).get("globalProviderTrueNorthOrientationMeasurementEligible"):
        raise ValueError("True-north orientation is not measurement eligible")
    if not anchor_artifact.get("assessment", {}).get("providerLocalDirectAnchorMeasurementEligible"):
        raise ValueError("Provider anchors are not measurement eligible")
    metric_row_lookup = load_metric_row_lookup(metric_rows, args.section_id)

    arrays = np.load(args.anchor_npz)
    points = np.asarray(arrays["provider_points_metres"], dtype=np.float64)
    disagreement = np.asarray(arrays["disagreement_radius_metres"], dtype=np.float64)
    if points.ndim != 2 or points.shape[1] != 3 or disagreement.shape != (points.shape[0],):
        raise ValueError("Anchor NPZ has invalid array shapes")
    if not np.all(np.isfinite(points)) or not np.all(np.isfinite(disagreement)):
        raise ValueError("Anchor NPZ contains non-finite values")

    observations = []
    for partition, specs in (
        ("training", args.training_observation),
        ("holdout", args.holdout_observation),
    ):
        for boundary_raw, registration_raw in specs:
            observations.append(
                lift_boundary_samples(
                    Path(boundary_raw),
                    Path(registration_raw),
                    metric_rows,
                    metric_row_lookup,
                    orientation,
                    args.section_id,
                    partition,
                )
            )
    observation_ids = [item["observationId"] for item in observations]
    if len(observation_ids) != len(set(observation_ids)):
        raise ValueError("Training and holdout observations are not disjoint")

    distance_columns = []
    sample_index_columns = []
    parameter_columns = []
    for observation in observations:
        distances, indices, parameters = ray_distances(points, observation)
        distance_columns.append(distances)
        sample_index_columns.append(indices)
        parameter_columns.append(parameters)
    distances_by_observation = np.column_stack(distance_columns)
    sample_indices_by_observation = np.column_stack(sample_index_columns)
    parameters_by_observation = np.column_stack(parameter_columns)
    training_indices = [index for index, item in enumerate(observations) if item["partition"] == "training"]
    holdout_indices = [index for index, item in enumerate(observations) if item["partition"] == "holdout"]
    maximum_training_distance = np.max(distances_by_observation[:, training_indices], axis=1)
    selected_mask = maximum_training_distance <= args.maximum_nominal_ray_distance_metres
    selected_indices = np.flatnonzero(selected_mask)
    selected_points = points[selected_mask]

    components = connected_components(selected_points, args.cluster_link_distance_metres)
    cluster_records = []
    for component in components:
        if component.size < args.minimum_cluster_points:
            continue
        global_indices = selected_indices[component]
        cluster_distances = distances_by_observation[global_indices]
        bounds_minimum = np.min(points[global_indices], axis=0)
        bounds_maximum = np.max(points[global_indices], axis=0)
        cluster_records.append(
            {
                "pointCount": int(component.size),
                "anchorIndices": [int(value) for value in global_indices],
                "centroidProviderMetres": [round(float(value), 6) for value in np.mean(points[global_indices], axis=0)],
                "boundsProviderMetres": {
                    "minimum": [round(float(value), 6) for value in bounds_minimum],
                    "maximum": [round(float(value), 6) for value in bounds_maximum],
                    "extent": [round(float(value), 6) for value in bounds_maximum - bounds_minimum],
                },
                "trainingMaximumDistanceMetres": value_summary(
                    np.max(cluster_distances[:, training_indices], axis=1)
                ),
                "holdoutDistanceMetresByObservation": [
                    {
                        "observationId": observations[index]["observationId"],
                        "distance": value_summary(cluster_distances[:, index]),
                        "pointCountWithinNominalThreshold": int(
                            np.count_nonzero(
                                cluster_distances[:, index]
                                <= args.maximum_nominal_ray_distance_metres
                            )
                        ),
                    }
                    for index in holdout_indices
                ],
            }
        )
    cluster_records.sort(key=lambda item: item["pointCount"], reverse=True)

    for observation_index, observation in enumerate(observations):
        observation["anchorRayDistanceMetres"] = value_summary(
            distances_by_observation[:, observation_index]
        )
        observation["selectedCandidateRayDistanceMetres"] = value_summary(
            distances_by_observation[selected_mask, observation_index]
        )
        observation["selectedCandidateCountWithinNominalThreshold"] = int(
            np.count_nonzero(
                distances_by_observation[selected_mask, observation_index]
                <= args.maximum_nominal_ray_distance_metres
            )
        )

    output_npz = args.output_json.with_suffix(".npz")
    output_png = args.output_json.with_suffix(".png")
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        output_npz,
        provider_points_metres=points,
        disagreement_radius_metres=disagreement,
        distances_by_observation_metres=distances_by_observation,
        closest_sample_indices_by_observation=sample_indices_by_observation,
        closest_ray_parameters_by_observation_metres=parameters_by_observation,
        training_consistent_candidate_mask=selected_mask,
    )
    render_diagnostic(output_png, points, selected_points, observations)

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "inputs": {
            "metricRowsSha256": sha256_file(args.metric_rows),
            "trueNorthOrientationSha256": sha256_file(args.true_north_orientation),
            "anchorArtifactSha256": sha256_file(args.anchor_artifact),
            "anchorNpzSha256": sha256_file(args.anchor_npz),
            "observations": [
                {
                    "partition": item["partition"],
                    "boundarySha256": item["boundary"]["sha256"],
                    "registrationSha256": item["registration"]["sha256"],
                }
                for item in observations
            ],
        },
        "parameters": {
            "sectionId": args.section_id,
            "maximumNominalRayDistanceMetres": args.maximum_nominal_ray_distance_metres,
            "clusterLinkDistanceMetres": args.cluster_link_distance_metres,
            "minimumClusterPoints": args.minimum_cluster_points,
        },
        "selectedAnchorIndices": [int(value) for value in selected_indices],
        "clusterAnchorIndices": [item["anchorIndices"] for item in cluster_records],
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "observed-boundary-sun-ray-anchor-consistency",
        "artifactVersion": artifact_version(stable),
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "sectionId": args.section_id,
        "inputs": {
            "metricRows": {"path": str(args.metric_rows), "sha256": sha256_file(args.metric_rows), "artifactVersion": metric_rows.get("artifactVersion")},
            "trueNorthOrientation": {"path": str(args.true_north_orientation), "sha256": sha256_file(args.true_north_orientation), "artifactVersion": orientation.get("artifactVersion")},
            "anchorArtifact": {"path": str(args.anchor_artifact), "sha256": sha256_file(args.anchor_artifact), "artifactVersion": anchor_artifact.get("artifactVersion")},
            "anchorNpz": {"path": str(args.anchor_npz), "sha256": sha256_file(args.anchor_npz)},
        },
        "parameters": stable["parameters"],
        "observations": observations,
        "anchorCount": int(points.shape[0]),
        "trainingConsistentCandidateCount": int(selected_indices.size),
        "trainingConsistentCandidateIndices": [int(value) for value in selected_indices],
        "clusters": cluster_records,
        "outputs": {
            "npzPath": str(output_npz),
            "npzSha256": sha256_file(output_npz),
            "diagnosticPngPath": str(output_png),
            "diagnosticPngSha256": sha256_file(output_png),
        },
        "assessment": {
            "diagnosticEligible": True,
            "obstructionMeasurementEligible": False,
            "publicationEligible": False,
            "blockers": [
                "OBSERVED_BOUNDARIES_USED_FOR_CANDIDATE_SELECTION",
                "ANCHORS_NOT_SEMANTICALLY_SEGMENTED",
                "ANCHORS_DO_NOT_FORM_A_CLOSED_OCCLUDER",
                "HOLDOUT_COUNT_BELOW_THIRTY",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(
        json.dumps(
            {
                "artifactVersion": artifact["artifactVersion"],
                "trainingConsistentCandidateCount": artifact["trainingConsistentCandidateCount"],
                "clusterCount": len(cluster_records),
                "output": str(args.output_json),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
