#!/usr/bin/env python3
"""Convert reviewed raw-frame shade-boundary pixels to observed row coordinates.

This tool is deliberately limited to measurement. It verifies the exact raw
frame and accepted row registration, interpolates only rows that physically
cover each reviewed x-coordinate, and propagates both pixel-review and camera
registration error into row uncertainty. It never predicts a shade boundary.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from datetime import datetime
from pathlib import Path
from typing import Any

import cv2
import numpy as np


REVIEW_STATUS = "independently-reviewed-shade-boundary-pixels"
COORDINATE_CONVENTION = "zero-based-pixel-centers"
MAXIMUM_LABEL_UNCERTAINTY_ROWS = 1.0
MAXIMUM_TIMESTAMP_UNCERTAINTY_SECONDS = 30.0


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify_named_input(
    inputs: dict[str, Any], path_field: str, sha_field: str, label: str
) -> None:
    raw_path = inputs.get(path_field)
    expected_sha = inputs.get(sha_field)
    if not isinstance(raw_path, str) or not raw_path or not isinstance(expected_sha, str):
        raise ValueError(f"Boundary controls do not identify the {label} path and checksum")
    path = Path(raw_path)
    if not path.is_file():
        raise ValueError(f"Boundary-control {label} does not exist: {path}")
    if sha256_file(path) != expected_sha:
        raise ValueError(f"Boundary-control {label} checksum does not match")


def stable_version(value: dict[str, Any]) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


def parse_timestamp(value: Any, field: str) -> datetime:
    if not isinstance(value, str) or not value.endswith("Z"):
        raise ValueError(f"{field} must be an ISO-8601 UTC timestamp ending in Z")
    try:
        return datetime.fromisoformat(value[:-1] + "+00:00")
    except ValueError as error:
        raise ValueError(f"{field} is not a valid ISO-8601 timestamp") from error


def interpolate_polyline_y(polyline: list[list[float]], x: float) -> float | None:
    candidates: list[float] = []
    for first, second in zip(polyline[:-1], polyline[1:]):
        x1, y1 = (float(first[0]), float(first[1]))
        x2, y2 = (float(second[0]), float(second[1]))
        if min(x1, x2) <= x <= max(x1, x2):
            span = x2 - x1
            if abs(span) <= 1e-12:
                candidates.append((y1 + y2) / 2.0)
            else:
                candidates.append(y1 + (x - x1) * (y2 - y1) / span)
    if not candidates:
        return None
    if max(candidates) - min(candidates) > 0.25:
        raise ValueError("A projected row is not single-valued at a reviewed x-coordinate")
    return float(np.mean(candidates))


def percentile(values: list[float], probability: float) -> float:
    return float(np.percentile(np.asarray(values, dtype=np.float64), probability))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("frame", type=Path)
    parser.add_argument("registration", type=Path)
    parser.add_argument("reviewed_boundary_controls", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("--minimum-samples", type=int, default=3)
    parser.add_argument("--minimum-lateral-span-pixels", type=float, default=100.0)
    arguments = parser.parse_args()

    if arguments.minimum_samples < 3:
        raise ValueError("At least three independently reviewed samples are required")
    if arguments.minimum_lateral_span_pixels <= 0:
        raise ValueError("Minimum lateral span must be positive")

    frame = cv2.imread(str(arguments.frame), cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("Could not decode the raw official broadcast frame")
    frame_height, frame_width = frame.shape[:2]
    frame_sha = sha256_file(arguments.frame)

    registration_bytes = arguments.registration.read_bytes()
    controls_bytes = arguments.reviewed_boundary_controls.read_bytes()
    registration = json.loads(registration_bytes)
    controls = json.loads(controls_bytes)
    registration_sha = hashlib.sha256(registration_bytes).hexdigest()
    controls_sha = hashlib.sha256(controls_bytes).hexdigest()

    if registration.get("artifactKind") != "official-broadcast-metric-row-camera-registration":
        raise ValueError("Input is not a metric-row camera registration")
    if not registration.get("registrationEligibleForManualShadeReview"):
        raise ValueError("Camera registration is not eligible for manual shade review")
    if registration.get("registrationBlockers"):
        raise ValueError("Camera registration contains blockers")
    registration_frame = registration.get("inputs", {}).get("frame", {})
    if registration_frame.get("sha256") != frame_sha:
        raise ValueError("Camera registration was created from a different frame")

    if controls.get("reviewStatus") != REVIEW_STATUS:
        raise ValueError("Boundary controls are not marked as independently reviewed")
    if controls.get("coordinateConvention") != COORDINATE_CONVENTION:
        raise ValueError("Unsupported boundary-control coordinate convention")
    expected = controls.get("inputs", {})
    if expected.get("broadcastFrameSha256") != frame_sha:
        raise ValueError("Boundary-control frame checksum does not match")
    if expected.get("rowRegistrationSha256") != registration_sha:
        raise ValueError("Boundary-control registration checksum does not match")
    if expected.get("rowRegistrationArtifactVersion") != registration.get("artifactVersion"):
        raise ValueError("Boundary-control registration version does not match")
    decoded_pixels_sha = hashlib.sha256(frame.tobytes(order="C")).hexdigest()
    if expected.get("broadcastFrameDecodedPixelsSha256") != decoded_pixels_sha:
        raise ValueError("Boundary-control decoded-pixel checksum does not match")
    verify_named_input(
        expected,
        "sourceSegmentPath",
        "sourceSegmentSha256",
        "official source segment",
    )
    verify_named_input(
        expected,
        "sourceFrameManifestPath",
        "sourceFrameManifestSha256",
        "source-frame manifest",
    )
    verify_named_input(
        expected,
        "eventEvidencePath",
        "eventEvidenceSha256",
        "official event evidence",
    )
    if controls.get("stadiumId") != registration.get("stadiumId"):
        raise ValueError("Boundary controls and registration name different stadiums")
    if controls.get("sectionId") != registration.get("sectionId"):
        raise ValueError("Boundary controls and registration name different sections")

    timestamp = controls.get("timestampEvidence", {})
    event_start = parse_timestamp(timestamp.get("eventStartTime"), "eventStartTime")
    event_end = parse_timestamp(timestamp.get("eventEndTime"), "eventEndTime")
    event_midpoint = parse_timestamp(timestamp.get("eventMidpointTime"), "eventMidpointTime")
    if event_end <= event_start or not event_start <= event_midpoint <= event_end:
        raise ValueError("Timestamp evidence has an invalid event interval")
    computed_window = (event_end - event_start).total_seconds()
    stated_window = float(timestamp.get("eventWindowSeconds"))
    stated_uncertainty = float(timestamp.get("uncertaintySeconds"))
    if abs(computed_window - stated_window) > 0.002:
        raise ValueError("Stated event window does not match event timestamps")
    if stated_uncertainty + 1e-9 < computed_window / 2.0:
        raise ValueError("Timestamp uncertainty is smaller than half the event window")

    projected_rows = registration.get("rows", [])
    if len(projected_rows) < 2:
        raise ValueError("Registration contains fewer than two projected rows")
    row_ids = [str(row.get("rowId")) for row in projected_rows]
    if len(row_ids) != len(set(row_ids)):
        raise ValueError("Registration contains duplicate row identities")

    raw_samples = controls.get("samples", [])
    if len(raw_samples) < arguments.minimum_samples:
        raise ValueError("Too few independently reviewed boundary samples")
    sample_ids = [str(sample.get("id")) for sample in raw_samples]
    if any(not sample_id for sample_id in sample_ids) or len(sample_ids) != len(set(sample_ids)):
        raise ValueError("Boundary sample IDs must be non-empty and unique")

    maximum_registration_error_rows = float(
        registration.get("holdoutValidation", {}).get("maximumPointErrorRows")
    )
    if not math.isfinite(maximum_registration_error_rows) or maximum_registration_error_rows < 0:
        raise ValueError("Registration lacks a valid maximum holdout point error")

    measured_samples: list[dict[str, Any]] = []
    reviewed_x: list[float] = []
    label_uncertainties: list[float] = []
    for sample in raw_samples:
        pixel = np.asarray(sample.get("broadcastPixel"), dtype=np.float64)
        if pixel.shape != (2,) or not np.all(np.isfinite(pixel)):
            raise ValueError(f"Sample {sample.get('id')} has an invalid pixel")
        x, y = (float(pixel[0]), float(pixel[1]))
        if not (0 <= x < frame_width and 0 <= y < frame_height):
            raise ValueError(f"Sample {sample.get('id')} is outside the frame")
        pixel_uncertainty = float(sample.get("maxPixelUncertainty"))
        if not math.isfinite(pixel_uncertainty) or pixel_uncertainty <= 0:
            raise ValueError(f"Sample {sample.get('id')} lacks positive pixel uncertainty")
        if sample.get("reviewBasis") != "raw-official-frame-direct-visual-transition":
            raise ValueError(f"Sample {sample.get('id')} has an unsupported review basis")

        available: list[tuple[int, str, float]] = []
        for row_index, row in enumerate(projected_rows):
            row_y = interpolate_polyline_y(row.get("projectedAnchorPixels", []), x)
            if row_y is not None:
                available.append((row_index, row_ids[row_index], row_y))

        bracket: tuple[tuple[int, str, float], tuple[int, str, float]] | None = None
        for front, back in zip(available[:-1], available[1:]):
            if back[0] != front[0] + 1:
                continue
            if min(front[2], back[2]) <= y <= max(front[2], back[2]):
                bracket = (front, back)
                break
        if bracket is None:
            raise ValueError(
                f"Sample {sample.get('id')} lies outside every pair of adjacent rows "
                "that physically covers its x-coordinate"
            )

        front, back = bracket
        signed_spacing = front[2] - back[2]
        local_spacing = abs(signed_spacing)
        if local_spacing <= 1e-9:
            raise ValueError(f"Sample {sample.get('id')} has zero projected row spacing")
        fraction_from_front = (front[2] - y) / signed_spacing
        if not -1e-9 <= fraction_from_front <= 1.0 + 1e-9:
            raise ValueError(f"Sample {sample.get('id')} did not interpolate within its bracket")
        fraction_from_front = min(1.0, max(0.0, fraction_from_front))
        continuous_coordinate = front[0] + fraction_from_front
        nearest_index = int(round(continuous_coordinate))
        nearest_index = min(max(nearest_index, front[0]), back[0])
        pixel_uncertainty_rows = pixel_uncertainty / local_spacing
        combined_uncertainty_rows = (
            pixel_uncertainty_rows + maximum_registration_error_rows
        )
        reviewed_x.append(x)
        label_uncertainties.append(combined_uncertainty_rows)
        measured_samples.append(
            {
                "id": str(sample["id"]),
                "observedBoundaryPixel": [x, y],
                "maxPixelUncertainty": pixel_uncertainty,
                "availableRowIdsAtX": [item[1] for item in available],
                "frontBracketRowId": front[1],
                "backBracketRowId": back[1],
                "frontBracketProjectedY": front[2],
                "backBracketProjectedY": back[2],
                "fractionFromFrontBracketRow": fraction_from_front,
                "boundaryRowCoordinateFromFront": continuous_coordinate,
                "nearestObservedBoundaryRowId": row_ids[nearest_index],
                "localProjectedRowSpacingPixels": local_spacing,
                "pixelReviewUncertaintyRows": pixel_uncertainty_rows,
                "registrationMaximumHoldoutPointErrorRows": maximum_registration_error_rows,
                "combinedLabelUncertaintyRows": combined_uncertainty_rows,
                "sunSideInImage": controls.get("visualClassification", {}).get("sunSideInImage"),
                "shadeSideInImage": controls.get("visualClassification", {}).get("shadeSideInImage"),
                "evidenceClass": "observed-only",
            }
        )

    lateral_span = max(reviewed_x) - min(reviewed_x)
    maximum_label_uncertainty = max(label_uncertainties)
    measurement_blockers: list[str] = []
    if lateral_span < arguments.minimum_lateral_span_pixels:
        measurement_blockers.append("REVIEWED_BOUNDARY_LATERAL_SPAN_BELOW_THRESHOLD")
    if maximum_label_uncertainty > MAXIMUM_LABEL_UNCERTAINTY_ROWS:
        measurement_blockers.append("LABEL_UNCERTAINTY_EXCEEDS_ONE_ROW")
    if stated_uncertainty > MAXIMUM_TIMESTAMP_UNCERTAINTY_SECONDS:
        measurement_blockers.append("TIMESTAMP_UNCERTAINTY_EXCEEDS_THIRTY_SECONDS")

    rendered = frame.copy()
    for row in projected_rows:
        points = np.rint(np.asarray(row["projectedAnchorPixels"], dtype=np.float64)).astype(
            np.int32
        )
        cv2.polylines(rendered, [points], False, (0, 210, 255), 1, cv2.LINE_AA)
    for sample, measured in zip(raw_samples, measured_samples):
        x, y = (float(value) for value in sample["broadcastPixel"])
        uncertainty = float(sample["maxPixelUncertainty"])
        center = (int(round(x)), int(round(y)))
        cv2.line(
            rendered,
            (center[0], int(round(y - uncertainty))),
            (center[0], int(round(y + uncertainty))),
            (30, 30, 255),
            2,
            cv2.LINE_AA,
        )
        cv2.drawMarker(
            rendered,
            center,
            (30, 30, 255),
            cv2.MARKER_CROSS,
            13,
            2,
            cv2.LINE_AA,
        )
        label = f"{measured['frontBracketRowId']}/{measured['backBracketRowId']}"
        cv2.putText(
            rendered,
            label,
            (center[0] + 5, center[1] - 5),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.35,
            (30, 30, 255),
            1,
            cv2.LINE_AA,
        )

    output_png = arguments.output_json.with_suffix(".png")
    arguments.output_json.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(output_png), rendered, [cv2.IMWRITE_PNG_COMPRESSION, 6]):
        raise ValueError("Could not write the reviewed-boundary preview")

    stable = {
        "frameSha256": frame_sha,
        "registrationSha256": registration_sha,
        "registrationArtifactVersion": registration["artifactVersion"],
        "reviewedBoundaryControlsSha256": controls_sha,
        "sampleMeasurements": measured_samples,
        "timestampEvidence": timestamp,
        "thresholds": {
            "minimumSamples": arguments.minimum_samples,
            "minimumLateralSpanPixels": arguments.minimum_lateral_span_pixels,
            "maximumLabelUncertaintyRows": MAXIMUM_LABEL_UNCERTAINTY_ROWS,
            "maximumTimestampUncertaintySeconds": MAXIMUM_TIMESTAMP_UNCERTAINTY_SECONDS,
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "official-broadcast-observed-row-shade-boundary",
        "artifactVersion": stable_version(stable),
        "stadiumId": registration["stadiumId"],
        "sectionId": registration["sectionId"],
        "evidenceSemantics": {
            "class": "observed-only",
            "containsPredictedBoundary": False,
            "statement": "Every boundary pixel is directly reviewed on the named raw official frame; row coordinates are measurements through the accepted camera registration.",
        },
        "inputs": {
            "frame": {"path": str(arguments.frame), "sha256": frame_sha},
            "rowRegistration": {
                "path": str(arguments.registration),
                "sha256": registration_sha,
                "artifactVersion": registration["artifactVersion"],
            },
            "reviewedBoundaryControls": {
                "path": str(arguments.reviewed_boundary_controls),
                "sha256": controls_sha,
            },
            "officialSourceSegment": {
                "path": expected["sourceSegmentPath"],
                "sha256": expected["sourceSegmentSha256"],
                "url": expected.get("sourceSegmentUrl"),
            },
            "sourceFrameManifest": {
                "path": expected["sourceFrameManifestPath"],
                "sha256": expected["sourceFrameManifestSha256"],
            },
            "officialEventEvidence": {
                "path": expected["eventEvidencePath"],
                "sha256": expected["eventEvidenceSha256"],
            },
        },
        "timestampEvidence": timestamp,
        "solarPositionAtEventMidpoint": controls.get("solarPositionAtEventMidpoint"),
        "visualClassification": controls.get("visualClassification"),
        "registeredRowScope": registration["registrationScope"],
        "samples": measured_samples,
        "measurementValidation": {
            "sampleCount": len(measured_samples),
            "lateralSpanPixels": lateral_span,
            "medianCombinedLabelUncertaintyRows": float(np.median(label_uncertainties)),
            "p95CombinedLabelUncertaintyRows": percentile(label_uncertainties, 95),
            "maximumCombinedLabelUncertaintyRows": maximum_label_uncertainty,
            "eligibleAsObservedBoundaryMeasurement": not measurement_blockers,
            "blockers": measurement_blockers,
        },
        "thresholds": stable["thresholds"],
        "previewPng": str(output_png),
        "previewPngSha256": sha256_file(output_png),
        "publication": {
            "eligible": False,
            "blockers": [
                "OBSERVED_ONLY_BOUNDARY_IS_NOT_AN_OBSTRUCTION_PREDICTION",
                "ONLY_ONE_FRAME_AND_DATE_OBSERVED",
                "ROW_11WC_OUTSIDE_VISIBLE_REGISTRATION_SCOPE",
                "INDEPENDENT_OBSTRUCTION_PREDICTION_NOT_AVAILABLE",
                "THIRTY_OBSERVATION_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    arguments.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps(artifact, indent=2))


if __name__ == "__main__":
    main()
