#!/usr/bin/env python3
"""Cross-validate panorama translation directions against provider camera positions.

The calibration pair and independent holdout pair must share no camera images.
Stereo translation magnitude is injected from provider positions by the upstream
validator, so this artifact validates only the horizontal axis relationship and
view-dependent parallax. It does not independently validate metric scale,
physical accuracy, true north, or publication eligibility.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any


ANALYSIS_VERSION = "panorama-provider-frame-cross-validation-v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("stereo_artifact", type=Path, nargs="+")
    parser.add_argument("--calibration-left", required=True)
    parser.add_argument("--calibration-right", required=True)
    parser.add_argument("--holdout-left", required=True)
    parser.add_argument("--holdout-right", required=True)
    parser.add_argument("--maximum-holdout-error-degrees", type=float, default=1.0)
    parser.add_argument("--minimum-stereo-holdout-percent", type=float, default=70.0)
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def wrap_degrees(value: float) -> float:
    return (value + 180.0) % 360.0 - 180.0


def bearing_degrees(vector: list[float]) -> float:
    if len(vector) != 3:
        raise ValueError("Expected a three-component vector")
    horizontal_length = math.hypot(float(vector[0]), float(vector[2]))
    if horizontal_length <= 1e-9:
        raise ValueError("Horizontal vector length is too small")
    return math.degrees(math.atan2(float(vector[2]), float(vector[0])))


def pair_key(left: str, right: str) -> tuple[str, str]:
    return left, right


def main() -> None:
    args = parse_args()
    if args.maximum_holdout_error_degrees <= 0.0:
        raise ValueError("Maximum holdout error must be positive")
    if not 0.0 < args.minimum_stereo_holdout_percent <= 100.0:
        raise ValueError("Minimum stereo holdout percent must be within 0 to 100")

    manifest = json.loads(args.manifest.read_text())
    manifest_images = {entry["seatId"]: entry for entry in manifest.get("images", [])}
    calibration_ids = {args.calibration_left, args.calibration_right}
    holdout_ids = {args.holdout_left, args.holdout_right}
    if calibration_ids & holdout_ids:
        raise ValueError("Calibration and holdout pairs must not share camera images")
    requested_ids = calibration_ids | holdout_ids
    missing_ids = requested_ids - set(manifest_images)
    if missing_ids:
        raise ValueError(f"Manifest is missing requested seat IDs: {sorted(missing_ids)}")

    records = []
    records_by_pair: dict[tuple[str, str], dict[str, Any]] = {}
    for artifact_path in args.stereo_artifact:
        artifact = json.loads(artifact_path.read_text())
        if artifact.get("analysisVersion") != "spherical-panorama-stereo-validation-v1":
            raise ValueError(f"Unexpected stereo analysis version in {artifact_path}")
        inputs = artifact["inputs"]
        if inputs.get("manifestSha256") != file_sha256(args.manifest):
            raise ValueError(f"Manifest checksum mismatch in {artifact_path}")
        left_id = inputs["leftSeatId"]
        right_id = inputs["rightSeatId"]
        key = pair_key(left_id, right_id)
        if key in records_by_pair:
            raise ValueError(f"Duplicate stereo pair {left_id}, {right_id}")
        left_position = [float(value) for value in inputs["providerLocalLeftPositionMetres"]]
        right_position = [float(value) for value in inputs["providerLocalRightPositionMetres"]]
        provider_displacement = [
            right_position[index] - left_position[index] for index in range(3)
        ]
        recovered_translation = [
            float(value)
            for value in artifact["sharedFrameTranslationFit"]["chosenTranslationVectorMetres"]
        ]
        provider_bearing = bearing_degrees(provider_displacement)
        recovered_bearing = bearing_degrees(recovered_translation)
        frame_offset = wrap_degrees(provider_bearing - recovered_bearing)
        record = {
            "leftSeatId": left_id,
            "rightSeatId": right_id,
            "stereoArtifactPath": str(artifact_path),
            "stereoArtifactSha256": file_sha256(artifact_path),
            "stereoArtifactVersion": artifact["artifactVersion"],
            "providerDisplacementMetres": [round(value, 9) for value in provider_displacement],
            "providerHorizontalBearingDegrees": round(provider_bearing, 9),
            "recoveredTranslationMetres": [round(value, 9) for value in recovered_translation],
            "recoveredHorizontalBearingDegrees": round(recovered_bearing, 9),
            "providerMinusRecoveredFrameOffsetDegrees": round(frame_offset, 9),
            "stereoMatchHoldoutInlierPercent": float(
                artifact["sharedFrameTranslationFit"]["holdoutInlierPercent"]
            ),
            "sharedPanoramaFrameSupported": bool(
                artifact["assessment"]["sharedPanoramaFrameSupported"]
            ),
        }
        records.append(record)
        records_by_pair[key] = record

    calibration_key = pair_key(args.calibration_left, args.calibration_right)
    holdout_key = pair_key(args.holdout_left, args.holdout_right)
    if calibration_key not in records_by_pair:
        raise ValueError("Calibration pair stereo artifact is missing")
    if holdout_key not in records_by_pair:
        raise ValueError("Holdout pair stereo artifact is missing")

    calibration = records_by_pair[calibration_key]
    calibrated_offset = float(calibration["providerMinusRecoveredFrameOffsetDegrees"])
    for record in records:
        predicted_provider_bearing = wrap_degrees(
            float(record["recoveredHorizontalBearingDegrees"]) + calibrated_offset
        )
        error = abs(
            wrap_degrees(
                predicted_provider_bearing - float(record["providerHorizontalBearingDegrees"])
            )
        )
        record["calibratedProviderBearingDegrees"] = round(predicted_provider_bearing, 9)
        record["calibratedAngularErrorDegrees"] = round(error, 9)
        record["role"] = (
            "axis-calibration"
            if pair_key(record["leftSeatId"], record["rightSeatId"]) == calibration_key
            else "independent-camera-pair-holdout"
            if pair_key(record["leftSeatId"], record["rightSeatId"]) == holdout_key
            else "correlated-diagnostic"
        )

    holdout = records_by_pair[holdout_key]
    holdout_error = float(holdout["calibratedAngularErrorDegrees"])
    calibration_stereo_pass = (
        float(calibration["stereoMatchHoldoutInlierPercent"])
        >= args.minimum_stereo_holdout_percent
    )
    holdout_stereo_pass = (
        float(holdout["stereoMatchHoldoutInlierPercent"])
        >= args.minimum_stereo_holdout_percent
    )
    axis_holdout_pass = holdout_error <= args.maximum_holdout_error_degrees
    internal_frame_cross_validation_pass = (
        calibration_stereo_pass and holdout_stereo_pass and axis_holdout_pass
    )

    stable = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "provider-internal-panorama-frame-cross-validation",
        "inputs": {
            "manifestPath": str(args.manifest),
            "manifestSha256": file_sha256(args.manifest),
            "calibrationPair": [args.calibration_left, args.calibration_right],
            "independentHoldoutPair": [args.holdout_left, args.holdout_right],
            "stereoArtifacts": [str(path) for path in args.stereo_artifact],
        },
        "parameters": {
            "maximumHoldoutErrorDegrees": args.maximum_holdout_error_degrees,
            "minimumStereoHoldoutPercent": args.minimum_stereo_holdout_percent,
            "horizontalBearingDefinition": "atan2(provider z, provider x)",
            "scaleTreatment": "provider baseline magnitude injected upstream; not independently validated",
        },
        "calibration": {
            "providerMinusRecoveredFrameOffsetDegrees": round(calibrated_offset, 9),
            "stereoMatchHoldoutPass": calibration_stereo_pass,
        },
        "independentHoldout": {
            "calibratedAngularErrorDegrees": round(holdout_error, 9),
            "axisHoldoutPass": axis_holdout_pass,
            "stereoMatchHoldoutPass": holdout_stereo_pass,
        },
        "pairs": sorted(records, key=lambda record: (record["leftSeatId"], record["rightSeatId"])),
        "assessment": {
            "viewDependentParallaxSupported": internal_frame_cross_validation_pass,
            "providerInternalHorizontalAxisCrossValidated": internal_frame_cross_validation_pass,
            "providerMetricScaleIndependentlyValidated": False,
            "trueNorthOrientationValidated": False,
            "physicalSourceAccuracyValidated": False,
            "publicationEligible": False,
            "blockers": [
                "PROVIDER_METRIC_SCALE_NOT_INDEPENDENTLY_VALIDATED",
                "PROVIDER_PHYSICAL_ACCURACY_NOT_ESTABLISHED",
                "VENUE_LOCAL_FRAME_NOT_REGISTERED_TO_RELEASE_CONTROL",
                "TRUE_NORTH_ORIENTATION_NOT_VALIDATED",
                "SEMANTIC_OBSTRUCTION_MESH_NOT_RECONSTRUCTED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    artifact = {
        **stable,
        "artifactVersion": fingerprint(stable),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n")
    print(
        json.dumps(
            {
                "output": str(args.output),
                "artifactVersion": artifact["artifactVersion"],
                "calibratedFrameOffsetDegrees": round(calibrated_offset, 9),
                "independentHoldoutAngularErrorDegrees": round(holdout_error, 9),
                "viewDependentParallaxSupported": internal_frame_cross_validation_pass,
                "publicationEligible": False,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
