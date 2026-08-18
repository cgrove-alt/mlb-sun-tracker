#!/usr/bin/env python3
"""Test the Section 207 provider-plan camera position against field rays.

The panorama row and adjacent seat are resolved in provider-plan coordinates by
the existing rear-tier audit. This diagnostic transfers only the camera offset
from that seat into the NGS-corrected provider plan, fixes horizontal camera
position, and refits camera elevation and rotation. It does not promote the
provider plan to surveyed row geometry.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation

from fitRockiesPanoramaAllFieldGradePose import (
    graded_residuals,
    predicted_graded_circle_tangent_pixels,
)
from fitRockiesPanoramaFullOrientationFieldPose import (
    cubemap_ray,
    provider_ray_to_pixel,
    rotation_diagnostics,
)
from fitRockiesPanoramaRegulationFieldPose import artifact_version


ANALYSIS_VERSION = "rockies-panorama-provider-plan-camera-control-audit-v1"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def load_json(path: Path) -> tuple[bytes, dict[str, Any]]:
    raw = path.read_bytes()
    return raw, json.loads(raw)


def find_geometry_seat(
    rows: list[dict[str, Any]], row_key: str, seat_label: str
) -> dict[str, Any]:
    matches = [
        seat
        for row in rows
        if row.get("rowKey") == row_key
        for seat in row.get("seats", [])
        if str(seat.get("seatLabel")) == seat_label
    ]
    if len(matches) != 1:
        raise ValueError(
            f"Expected one provider seat {row_key} seat {seat_label}, found {len(matches)}"
        )
    return matches[0]


def rotate_bearing_frame(vector: np.ndarray, delta_degrees: float) -> np.ndarray:
    """Rotate east/north vector when field bearing increases by delta."""
    angle = math.radians(delta_degrees)
    cosine = math.cos(angle)
    sine = math.sin(angle)
    return np.asarray(
        [
            cosine * vector[0] + sine * vector[1],
            -sine * vector[0] + cosine * vector[1],
        ],
        dtype=np.float64,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("two_ground_pose", type=Path)
    parser.add_argument("selected_provider_pose", type=Path)
    parser.add_argument("ngs_provider_plan", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--review-image", type=Path)
    args = parser.parse_args()

    pose_bytes, pose = load_json(args.two_ground_pose)
    selected_bytes, selected = load_json(args.selected_provider_pose)
    ngs_bytes, ngs = load_json(args.ngs_provider_plan)
    if pose.get("analysisVersion") != "rockies-panorama-field-grade-left-field-calibration-pose-v1":
        raise ValueError("Unsupported two-ground pose")
    if len(pose.get("inputs", {}).get("calibrationElevations", [])) != 2:
        raise ValueError("The camera-control audit requires the two-ground pose")
    if selected.get("analysisVersion") != "sportsdigita-rear-boundary-pose-selection-v1":
        raise ValueError("Unsupported provider-local camera selection")
    if ngs.get("analysisVersion") != "ticketmaster-drcog-field-registration-v2":
        raise ValueError("Unsupported NGS-corrected provider plan")
    if not ngs.get("diagnostics", {}).get(
        "orthophotoGroundFrameHorizontalAccuracyVerifiedAt95Percent"
    ):
        raise ValueError("NGS-corrected provider plan lacks an accepted ground frame")

    candidate_path = Path(selected["inputs"]["rowsPath"])
    candidate_bytes, candidate = load_json(candidate_path)
    if sha256_bytes(candidate_bytes) != selected["inputs"]["rowsSha256"]:
        raise ValueError("Selected provider pose binds a different candidate plan")
    if candidate.get("artifactVersion") != selected["inputs"]["rowsArtifactVersion"]:
        raise ValueError("Selected provider pose candidate-plan version differs")

    nearest = selected["selectedPoseProviderLocal"]["nearestProviderSeat"]
    row_key = str(nearest["rowKey"])
    seat_label = str(nearest["seatLabel"])
    candidate_seat = find_geometry_seat(
        candidate["geometryRows"], row_key, seat_label
    )
    ngs_seat = find_geometry_seat(ngs["rows"], row_key, seat_label)
    camera_candidate = np.asarray(
        selected["selectedPoseProviderLocal"]["eastNorthFeetFromInputCenter"],
        dtype=np.float64,
    )
    seat_candidate = np.asarray(
        candidate_seat["eastNorthFeetFromInputCenter"], dtype=np.float64
    )
    offset_candidate = camera_candidate - seat_candidate
    candidate_bearing = float(candidate["transform"]["fittedCenterFieldBearingDegrees"])
    ngs_bearing = float(ngs["transform"]["fieldAxisBearingDegreesEastOfGridNorth"])
    bearing_delta = ngs_bearing - candidate_bearing
    offset_ngs = rotate_bearing_frame(offset_candidate, bearing_delta)
    fixed_xy = np.asarray(ngs_seat["positionProjectedFeet"], dtype=np.float64) + offset_ngs

    controls = pose["pointControlFit"]
    world_points = np.asarray(
        [item["worldProjectedFeet"] for item in controls], dtype=np.float64
    )
    size = 2048
    provider_rays = np.asarray(
        [
            cubemap_ray(
                str(item["observedFace"]), tuple(item["observedPixel"]), size
            )
            for item in controls
        ],
        dtype=np.float64,
    )
    angular_sigmas = np.asarray(
        [
            float(item["pixelUncertainty95"]) / 1.96 / (size / 2.0)
            for item in controls
        ],
        dtype=np.float64,
    )
    mound = pose["metricMoundCircle"]
    mound_center = np.asarray(mound["centerProjectedFeet"], dtype=np.float64)
    mound_radius = float(mound["nominalRadiusFeet"])
    field_plane = np.asarray(
        pose["fieldGrade"]["planeRelativeToHomeFeet"], dtype=np.float64
    )
    mound_fit = pose["moundTangentFit"]
    observed_tangents = np.asarray(mound_fit["observedPixelX"], dtype=np.float64)
    tangent_uncertainties = np.asarray(
        mound_fit["uncertaintyPixels95"], dtype=np.float64
    )
    tangent_sigmas = tangent_uncertainties / 1.96
    original_camera = np.asarray(
        pose["selectedPose"]["cameraProjectedFeet"], dtype=np.float64
    )
    original_rotation = np.asarray(
        pose["selectedPose"]["rotationMatrixProviderToWorld"], dtype=np.float64
    )

    def fixed_xy_residuals(parameters: np.ndarray) -> np.ndarray:
        full = np.concatenate((fixed_xy, parameters[:1], parameters[1:]))
        return graded_residuals(
            full,
            world_points,
            provider_rays,
            angular_sigmas,
            mound_center,
            mound_radius,
            field_plane,
            observed_tangents,
            tangent_sigmas,
            "l",
            size,
        )

    initial = np.concatenate(
        (
            original_camera[2:3],
            Rotation.from_matrix(original_rotation).as_rotvec(),
        )
    )
    fitted = least_squares(
        fixed_xy_residuals,
        initial,
        max_nfev=50_000,
        xtol=1e-13,
        ftol=1e-13,
        gtol=1e-13,
    )
    if not np.all(np.isfinite(fitted.x)) or not np.all(np.isfinite(fitted.fun)):
        raise ValueError("Fixed-horizontal camera fit produced non-finite values")
    fitted_full = np.concatenate((fixed_xy, fitted.x[:1], fitted.x[1:]))
    rotation = Rotation.from_rotvec(fitted.x[1:]).as_matrix()

    fit_records = []
    for item, world in zip(controls, world_points):
        direction = world - fitted_full[:3]
        range_feet = float(np.linalg.norm(direction))
        direction /= range_feet
        predicted_face, predicted_x, predicted_y = provider_ray_to_pixel(
            rotation.T @ direction, size
        )
        residual = (
            math.hypot(
                predicted_x - float(item["observedPixel"][0]),
                predicted_y - float(item["observedPixel"][1]),
            )
            if predicted_face == item["observedFace"]
            else None
        )
        projected_world_uncertainty = math.atan2(
            float(item["horizontalWorldUncertainty95Feet"])
            + float(item["relativeElevationUncertainty95Feet"]),
            range_feet,
        ) * (size / 2.0)
        combined_uncertainty = (
            float(item["pixelUncertainty95"]) + projected_world_uncertainty
        )
        fit_records.append(
            {
                "controlId": item["controlId"],
                "role": item["role"],
                "observedFace": item["observedFace"],
                "observedPixel": item["observedPixel"],
                "predictedFace": predicted_face,
                "predictedPixel": [predicted_x, predicted_y],
                "radialResidualPixels": residual,
                "imageOnlyRadialUncertaintyPixels95": item["pixelUncertainty95"],
                "projectedWorldAndElevationUncertaintyPixels95": projected_world_uncertainty,
                "combinedConservativeRadialUncertaintyPixels95": combined_uncertainty,
                "withinImageOnlyPixelUncertainty": (
                    residual is not None
                    and residual <= float(item["pixelUncertainty95"])
                ),
                "withinCombinedInputUncertainty": (
                    residual is not None and residual <= combined_uncertainty
                ),
            }
        )

    fitted_tangents = predicted_graded_circle_tangent_pixels(
        fitted_full,
        mound_center,
        mound_radius,
        field_plane,
        "l",
        size,
    )
    if fitted_tangents is None:
        raise ValueError("Fixed-horizontal camera fit does not project mound tangencies")
    tangent_residuals = np.abs(
        np.asarray(fitted_tangents, dtype=np.float64) - observed_tangents
    )
    image_pass = all(item["withinImageOnlyPixelUncertainty"] for item in fit_records)
    combined_pass = all(item["withinCombinedInputUncertainty"] for item in fit_records)
    tangent_pass = bool(np.all(tangent_residuals <= tangent_uncertainties))
    original_xy_delta = float(np.linalg.norm(fixed_xy - original_camera[:2]))

    review_output = None
    if args.review_image is not None:
        crop_metadata_path = Path(ngs["inputs"]["overlayCropPath"])
        crop_metadata_bytes, crop_metadata = load_json(crop_metadata_path)
        if sha256_bytes(crop_metadata_bytes) != ngs["inputs"]["overlayCropSha256"]:
            raise ValueError("Provider-plan audit binds different orthophoto crop metadata")
        source_image = Image.open(ngs["overlay"]["path"]).convert("RGB")
        bounds = crop_metadata["projectedBoundsFeet"]
        pixel_size_x = float(crop_metadata["pixelSizeFeet"][0])
        pixel_size_y = float(crop_metadata["pixelSizeFeet"][1])

        def world_to_pixel(point: np.ndarray) -> tuple[float, float]:
            return (
                (float(point[0]) - float(bounds["minimumX"])) / pixel_size_x,
                (float(point[1]) - float(bounds["maximumY"])) / pixel_size_y,
            )

        fixed_pixel = world_to_pixel(fixed_xy)
        original_pixel = world_to_pixel(original_camera[:2])
        center_x = (fixed_pixel[0] + original_pixel[0]) / 2.0
        center_y = (fixed_pixel[1] + original_pixel[1]) / 2.0
        half_size = 350
        left = int(round(center_x)) - half_size
        top = int(round(center_y)) - half_size
        review = source_image.crop((left, top, left + 2 * half_size, top + 2 * half_size))
        draw = ImageDraw.Draw(review)

        for row in ngs["rows"]:
            row_key_value = str(row.get("rowKey", ""))
            if not row_key_value.startswith("207:"):
                continue
            row_number = int(row_key_value.split(":", 1)[1])
            row_pixels = [
                world_to_pixel(np.asarray(seat["positionProjectedFeet"], dtype=np.float64))
                for seat in row.get("seats", [])
            ]
            local_row_pixels = [
                (float(pixel[0]) - left, float(pixel[1]) - top)
                for pixel in row_pixels
            ]
            if row_number == 6:
                row_color = (255, 40, 40)
                row_width = 5
            elif row_number == 13:
                row_color = (255, 0, 255)
                row_width = 5
            else:
                row_color = (245, 245, 245)
                row_width = 2
            if len(local_row_pixels) >= 2:
                draw.line(local_row_pixels, fill=row_color, width=row_width)
                label_x, label_y = local_row_pixels[-1]
                label = f"r{row_number}"
                draw.rectangle(
                    (label_x + 2, label_y - 8, label_x + 26, label_y + 6),
                    fill=(0, 0, 0),
                )
                draw.text((label_x + 4, label_y - 7), label, fill=row_color)

        def draw_marker(
            pixel: tuple[float, float], color: tuple[int, int, int], label: str
        ) -> None:
            x = float(pixel[0]) - left
            y = float(pixel[1]) - top
            radius = 12
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), outline=color, width=5)
            draw.line((x - 18, y, x + 18, y), fill=color, width=4)
            draw.line((x, y - 18, x, y + 18), fill=color, width=4)
            draw.rectangle((x + 20, y - 15, x + 20 + 8 * len(label), y + 5), fill=(0, 0, 0))
            draw.text((x + 23, y - 13), label, fill=color)

        draw_marker(fixed_pixel, (255, 40, 40), "row 6 seat 13 camera")
        draw_marker(original_pixel, (0, 255, 255), "field-ray camera")
        draw.rectangle((8, 8, 390, 78), fill=(0, 0, 0))
        draw.text((16, 16), "red: provider row identity", fill=(255, 40, 40))
        draw.text((16, 36), "cyan: unconstrained field-ray pose", fill=(0, 255, 255))
        draw.text((16, 56), "magenta: provider row 13", fill=(255, 0, 255))
        args.review_image.parent.mkdir(parents=True, exist_ok=True)
        review.save(args.review_image)
        review_output = {
            "path": str(args.review_image),
            "sha256": sha256_bytes(args.review_image.read_bytes()),
            "sourcePixelWindow": [left, top, left + 2 * half_size, top + 2 * half_size],
        }

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "sectionId": "207",
        "inputs": {
            "twoGroundPosePath": str(args.two_ground_pose),
            "twoGroundPoseSha256": sha256_bytes(pose_bytes),
            "twoGroundPoseArtifactVersion": pose["artifactVersion"],
            "selectedProviderPosePath": str(args.selected_provider_pose),
            "selectedProviderPoseSha256": sha256_bytes(selected_bytes),
            "selectedProviderPoseArtifactVersion": selected["artifactVersion"],
            "candidateProviderPlanPath": str(candidate_path),
            "candidateProviderPlanSha256": sha256_bytes(candidate_bytes),
            "candidateProviderPlanArtifactVersion": candidate["artifactVersion"],
            "ngsProviderPlanPath": str(args.ngs_provider_plan),
            "ngsProviderPlanSha256": sha256_bytes(ngs_bytes),
            "ngsProviderPlanArtifactVersion": ngs["artifactVersion"],
        },
        "providerCameraControl": {
            "rowKey": row_key,
            "seatLabel": seat_label,
            "cameraToSeatOffsetCandidateEastNorthFeet": offset_candidate.tolist(),
            "cameraToSeatDistanceFeet": float(np.linalg.norm(offset_candidate)),
            "candidateFieldBearingDegrees": candidate_bearing,
            "ngsFieldBearingDegrees": ngs_bearing,
            "bearingFrameRotationDegrees": bearing_delta,
            "cameraToSeatOffsetNgsStatePlaneFeet": offset_ngs.tolist(),
            "ngsSeatProjectedFeet": ngs_seat["positionProjectedFeet"],
            "fixedCameraHorizontalProjectedFeet": fixed_xy.tolist(),
        },
        "poseComparison": {
            "unconstrainedTwoGroundCameraProjectedFeet": original_camera.tolist(),
            "horizontalDifferenceFeet": original_xy_delta,
            "unconstrainedWeightedSquaredError": float(
                pose["selectedPose"]["weightedSquaredError"]
            ),
            "fixedHorizontalWeightedSquaredError": float(np.sum(fitted.fun**2)),
        },
        "fixedHorizontalPose": {
            "cameraProjectedFeet": fitted_full[:3].tolist(),
            "rotationMatrixProviderToWorld": rotation.tolist(),
            "rotationDiagnostics": rotation_diagnostics(rotation),
        },
        "pointControlFit": fit_records,
        "moundTangentFit": {
            "observedPixelX": observed_tangents.tolist(),
            "uncertaintyPixels95": tangent_uncertainties.tolist(),
            "predictedPixelX": list(fitted_tangents),
            "residualPixels": tangent_residuals.tolist(),
        },
        "reviewOutput": review_output,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-panorama-provider-plan-camera-control-audit",
        "artifactStage": "provider-plan-camera-control-consistency-diagnostic",
        "artifactVersion": artifact_version(stable),
        **stable,
        "geometryBoundary": {
            "establishesIndependentPanoramaRowIdentity": True,
            "establishesCandidateFixedHorizontalCameraPose": combined_pass
            and tangent_pass,
            "establishesSurveyedHorizontalCameraPosition": False,
            "establishesReleaseCameraPose": False,
            "allPointControlsWithinImageOnlyUncertainty": image_pass,
            "allPointControlsWithinCombinedInputUncertainty": combined_pass,
            "moundTangenciesWithinLockedUncertainty": tangent_pass,
            "providerPlanHorizontalUncertaintyEstablishedAt95Percent": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *([] if combined_pass else ["PROVIDER_CAMERA_POSITION_CONFLICTS_WITH_FIELD_CONTROLS"]),
                *([] if image_pass else ["POINT_CONTROL_FIT_EXCEEDS_IMAGE_ONLY_UNCERTAINTY"]),
                *([] if tangent_pass else ["MOUND_TANGENT_FIT_EXCEEDS_PIXEL_UNCERTAINTY"]),
                "PROVIDER_PLAN_ABOVE_GROUND_HORIZONTAL_UNCERTAINTY_NOT_ESTABLISHED",
                "PROVIDER_PLAN_IS_NOT_AN_INDEPENDENT_SURVEY",
                "ACTUAL_MOUND_DIAMETER_NOT_SURVEYED",
                "CURRENT_FIELD_GRADE_NOT_CONFIRMED",
                "CURRENT_ROW_GEOMETRY_NOT_MEASURED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "artifactVersion": artifact["artifactVersion"],
                "providerCameraControl": artifact["providerCameraControl"],
                "poseComparison": artifact["poseComparison"],
                "fixedHorizontalPose": artifact["fixedHorizontalPose"],
                "pointControlFit": artifact["pointControlFit"],
                "moundTangentFit": artifact["moundTangentFit"],
                "geometryBoundary": artifact["geometryBoundary"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
