#!/usr/bin/env python3
"""Score fixed-occluder transition intervals against observed row boundaries."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

from analyzeObservedBoundarySunRayGeometry import interpolate_segment_at_x


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("metric_rows", type=Path)
    parser.add_argument("panorama_manifest", type=Path)
    parser.add_argument("material_validation", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument(
        "--observation",
        nargs=3,
        action="append",
        metavar=("BOUNDARY_JSON", "REGISTRATION_JSON", "POINT_SUPPORT_JSON"),
        required=True,
    )
    parser.add_argument("--maximum-nearest-seat-distance-metres", type=float, default=0.3048)
    return parser.parse_args()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def summary(values: list[float]) -> dict[str, float | int | None]:
    if not values:
        return {"count": 0, "median": None, "p95": None, "maximum": None}
    array = np.asarray(values, dtype=np.float64)
    return {
        "count": len(values),
        "median": round(float(np.percentile(array, 50)), 6),
        "p95": round(float(np.percentile(array, 95)), 6),
        "maximum": round(float(np.max(array)), 6),
    }


def main() -> None:
    args = parse_args()
    if args.maximum_nearest_seat_distance_metres > 0.3048:
        raise ValueError("Nearest-seat distance may not exceed one foot")
    metric = json.loads(args.metric_rows.read_text())
    manifest = json.loads(args.panorama_manifest.read_text())
    material = json.loads(args.material_validation.read_text())
    if not material.get("assessment", {}).get("materialHoldoutValidationPassed"):
        raise ValueError("Material holdout validation has not passed")
    metric_rows = {
        str(row["rowId"]): row
        for row in metric["rows"]
        if str(row.get("sectionId")) == "SEC35"
    }
    manifest_images = {item["seatId"]: item for item in manifest["images"]}
    observation_results = []
    input_observations = []
    midpoint_errors = []
    interval_errors = []
    nearest_distances = []
    for boundary_name, registration_name, support_name in args.observation:
        boundary_path = Path(boundary_name)
        registration_path = Path(registration_name)
        support_path = Path(support_name)
        boundary = json.loads(boundary_path.read_text())
        registration = json.loads(registration_path.read_text())
        support = json.loads(support_path.read_text())
        if (
            boundary["inputs"]["rowRegistration"]["sha256"]
            != sha256_file(registration_path)
        ):
            raise ValueError("Observed boundary does not lock its registration")
        if not boundary["measurementValidation"]["eligibleAsObservedBoundaryMeasurement"]:
            raise ValueError("Observed boundary is not measurement eligible")
        if not support.get("assessment", {}).get("pointSupportDiagnosticEligible"):
            raise ValueError("Point-support artifact is not diagnostic eligible")
        row_registrations = {
            str(row["rowId"]): row for row in registration["rows"]
        }
        row_order = [str(row["rowId"]) for row in registration["rows"]]
        support_by_seat = {
            result["seatId"]: result["classification"]
            for result in support["results"]
        }
        sample_results = []
        for sample in boundary["samples"]:
            x_value = float(sample["observedBoundaryPixel"][0])
            available = set(str(value) for value in sample["availableRowIdsAtX"])
            row_results = []
            for row_id in row_order:
                if row_id not in available or row_id not in metric_rows:
                    continue
                registered = row_registrations[row_id]
                anchors = {
                    anchor["seatId"]: anchor for anchor in metric_rows[row_id]["anchors"]
                }
                anchor_ids = registered["anchorSeatIds"]
                if any(anchor_id not in anchors for anchor_id in anchor_ids):
                    raise ValueError("Registration names an unknown metric anchor")
                projected = np.asarray(
                    registered["projectedAnchorPixels"], dtype=np.float64
                )
                provider = np.asarray(
                    [anchors[anchor_id]["position"] for anchor_id in anchor_ids],
                    dtype=np.float64,
                )
                row_point, _ = interpolate_segment_at_x(
                    projected, provider, x_value
                )
                candidates = [
                    item
                    for item in manifest_images.values()
                    if item["seatId"].startswith(f"S_SEC35-{row_id}-")
                    and item["seatId"] in support_by_seat
                ]
                if not candidates:
                    continue
                distances = [
                    float(np.linalg.norm(
                        np.asarray(item["config"]["p"], dtype=np.float64) - row_point
                    ))
                    for item in candidates
                ]
                nearest_index = int(np.argmin(distances))
                distance = distances[nearest_index]
                nearest_distances.append(distance)
                if distance > args.maximum_nearest_seat_distance_metres:
                    raise ValueError("Nearest panorama seat exceeds the one-foot gate")
                seat = candidates[nearest_index]
                row_results.append({
                    "rowId": row_id,
                    "rowCoordinateFromFront": row_order.index(row_id),
                    "nearestSeatId": seat["seatId"],
                    "nearestSeatDistanceMetres": round(distance, 6),
                    "classification": support_by_seat[seat["seatId"]],
                })
            movable = [
                item
                for item in row_results
                if item["classification"] == "confirmed-movable-background-envelope"
            ]
            fixed = [
                item
                for item in row_results
                if item["classification"] == "confirmed-fixed-envelope"
            ]
            nonmonotonic = bool(
                movable and fixed
                and min(item["rowCoordinateFromFront"] for item in movable)
                > min(item["rowCoordinateFromFront"] for item in fixed)
            )
            resolved = False
            lower = upper = midpoint = midpoint_error = interval_error = None
            if movable and fixed and not nonmonotonic:
                last_movable = max(
                    item["rowCoordinateFromFront"] for item in movable
                )
                later_fixed = [
                    item["rowCoordinateFromFront"]
                    for item in fixed
                    if item["rowCoordinateFromFront"] > last_movable
                ]
                if later_fixed:
                    first_fixed = min(later_fixed)
                    lower = last_movable + 0.5
                    upper = first_fixed - 0.5
                    if lower <= upper:
                        resolved = True
                        midpoint = 0.5 * (lower + upper)
                        observed = float(sample["boundaryRowCoordinateFromFront"])
                        midpoint_error = abs(midpoint - observed)
                        interval_error = (
                            lower - observed
                            if observed < lower
                            else observed - upper
                            if observed > upper
                            else 0.0
                        )
                        midpoint_errors.append(midpoint_error)
                        interval_errors.append(interval_error)
            sample_results.append({
                "sampleId": sample["id"],
                "observedBoundaryRowCoordinateFromFront": sample[
                    "boundaryRowCoordinateFromFront"
                ],
                "nearestObservedBoundaryRowId": sample[
                    "nearestObservedBoundaryRowId"
                ],
                "combinedObservedLabelUncertaintyRows": sample[
                    "combinedLabelUncertaintyRows"
                ],
                "rowClassifications": row_results,
                "transitionResolved": resolved,
                "nonmonotonicConfirmedClasses": nonmonotonic,
                "predictedTransitionIntervalFromFront": (
                    None if not resolved else [round(lower, 6), round(upper, 6)]
                ),
                "predictedTransitionMidpointFromFront": (
                    None if midpoint is None else round(midpoint, 6)
                ),
                "absoluteMidpointErrorRows": (
                    None if midpoint_error is None else round(midpoint_error, 6)
                ),
                "distanceOutsidePredictedIntervalRows": (
                    None if interval_error is None else round(interval_error, 6)
                ),
            })
        observation_results.append({
            "candidateId": support["queryCandidateId"],
            "eventMidpointTime": boundary["timestampEvidence"]["eventMidpointTime"],
            "samples": sample_results,
        })
        input_observations.append({
            "boundary": {
                "path": str(boundary_path),
                "sha256": sha256_file(boundary_path),
                "artifactVersion": boundary["artifactVersion"],
            },
            "registration": {
                "path": str(registration_path),
                "sha256": sha256_file(registration_path),
                "artifactVersion": registration["artifactVersion"],
            },
            "pointSupport": {
                "path": str(support_path),
                "sha256": sha256_file(support_path),
                "artifactVersion": support["artifactVersion"],
            },
        })
    sample_count = sum(len(item["samples"]) for item in observation_results)
    resolved_count = sum(
        bool(sample["transitionResolved"])
        for item in observation_results
        for sample in item["samples"]
    )
    stable = {
        "inputs": {
            "metricRows": {
                "path": str(args.metric_rows),
                "sha256": sha256_file(args.metric_rows),
                "artifactVersion": metric["artifactVersion"],
            },
            "panoramaManifest": {
                "path": str(args.panorama_manifest),
                "sha256": sha256_file(args.panorama_manifest),
                "artifactVersion": manifest["artifactVersion"],
            },
            "materialValidation": {
                "path": str(args.material_validation),
                "sha256": sha256_file(args.material_validation),
                "artifactVersion": material["artifactVersion"],
            },
            "observations": input_observations,
        },
        "parameters": {
            "maximumNearestSeatDistanceMetres": args.maximum_nearest_seat_distance_metres,
            "transitionRule": (
                "interval from half a row behind the last confirmed movable-background row "
                "to half a row ahead of the first later confirmed fixed row; uncertain rows widen the interval"
            ),
        },
        "observations": observation_results,
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "point-support-observed-boundary-interval-score-v1",
        "artifactStage": "diagnostic-fixed-occluder-row-boundary-score",
        "artifactVersion": fingerprint(stable),
        **stable,
        "summary": {
            "observationCount": len(observation_results),
            "sampleCount": sample_count,
            "resolvedSampleCount": resolved_count,
            "resolvedSampleFraction": resolved_count / sample_count,
            "nearestSeatDistanceMetres": summary(nearest_distances),
            "absoluteMidpointErrorRows": summary(midpoint_errors),
            "distanceOutsidePredictedIntervalRows": summary(interval_errors),
        },
        "assessment": {
            "boundaryScoreDiagnosticEligible": True,
            "publicationEligible": False,
            "blockers": [
                "SAMPLES_WITHIN_ONE_FRAME_ARE_NOT_INDEPENDENT_OBSERVATIONS",
                "LEAVE_ONE_OBSERVATION_OUT_GEOMETRY_IS_RETROSPECTIVE_NOT_BLIND",
                "THIRTY_INDEPENDENT_OBSERVATIONS_NOT_YET_AVAILABLE",
                "THREE_UNIQUE_DATES_AND_TWENTY_FIVE_DEGREE_ALTITUDE_SPAN_NOT_YET_MET",
                "ONE_HUNDRED_PERCENT_TRANSITION_COVERAGE_NOT_MET",
                "MOVABLE_BACKGROUND_IS_NOT_OPEN_SUN_WITHOUT_PARKED_ROOF_GEOMETRY",
                "ONLY_ONE_SECTION_IS_SCORED",
            ],
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "output": str(args.output_json),
        "artifactVersion": artifact["artifactVersion"],
        "summary": artifact["summary"],
        "publicationEligible": False,
    }, indent=2))


if __name__ == "__main__":
    main()
