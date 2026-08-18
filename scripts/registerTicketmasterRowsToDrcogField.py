#!/usr/bin/env python3
"""Register Ticketmaster row geometry to DRCOG regulation field controls."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from pyproj import CRS, Transformer


ANALYSIS_VERSION = "ticketmaster-drcog-field-registration-v2"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    serialized = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def ordered_json_sha256(value: Any) -> str:
    serialized = json.dumps(value, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def validate_provider_rows(rows: dict[str, Any]) -> None:
    if rows.get("artifactKind") != "ticketmaster-assigned-row-map-geometry":
        raise ValueError("Rows input has the wrong artifact kind")
    fingerprint = {
        "acquisitionArtifactVersion": rows.get("acquisition", {}).get(
            "artifactVersion"
        ),
        "rawSha256": rows.get("acquisition", {}).get("rawSha256"),
        "pageFrames": rows.get("pageFrames"),
        "rows": rows.get("rows"),
    }
    if rows.get("artifactVersion") != "sha256:" + ordered_json_sha256(fingerprint):
        raise ValueError("Ticketmaster row artifact fingerprint does not reproduce")
    completeness = rows.get("completeness", {})
    if not completeness.get("providerMapInternalCompletenessPassed"):
        raise ValueError("Ticketmaster provider-map coordinates are incomplete")
    if completeness.get("providerMapCoordinateCoveragePercent") != 100:
        raise ValueError("Ticketmaster provider-map coordinate coverage is not 100 percent")


def validate_provider_controls(controls: dict[str, Any]) -> None:
    if controls.get("artifactKind") != "ticketmaster-regulation-field-control-candidate":
        raise ValueError("Provider controls have the wrong artifact kind")
    fingerprint = {
        "analysisVersion": controls.get("analysisVersion"),
        "stadiumId": controls.get("stadiumId"),
        "svgAcquisitionArtifactVersion": controls.get("source", {}).get(
            "svgAcquisitionArtifactVersion"
        ),
        "svgSha256": controls.get("source", {}).get("svgSha256"),
        "controls": controls.get("controls"),
        "selectedSubpaths": controls.get("selectedSubpaths"),
        "controlSelection": controls.get("controlSelection"),
    }
    if controls.get("artifactVersion") != "sha256:" + ordered_json_sha256(
        fingerprint
    ):
        raise ValueError("Provider-control artifact fingerprint does not reproduce")
    if not controls.get("validation", {}).get("regulationMoundCheckWithinOneFoot"):
        raise ValueError("Provider controls fail their regulation mound check")


def provider_to_local_feet(
    provider_positions: np.ndarray,
    home_plate: np.ndarray,
    field_axis: np.ndarray,
    pixels_per_foot: float,
) -> np.ndarray:
    delta = provider_positions - home_plate
    right_axis = np.asarray([-field_axis[1], field_axis[0]], dtype=np.float64)
    right_feet = (
        delta[:, 0] * right_axis[0] + delta[:, 1] * right_axis[1]
    ) / pixels_per_foot
    forward_feet = (
        delta[:, 0] * field_axis[0] + delta[:, 1] * field_axis[1]
    ) / pixels_per_foot
    return np.column_stack((right_feet, forward_feet))


def local_to_projected_feet(
    local_positions: np.ndarray,
    home_projected: np.ndarray,
    forward_axis: np.ndarray,
) -> np.ndarray:
    right_axis = np.asarray([forward_axis[1], -forward_axis[0]], dtype=np.float64)
    return (
        home_projected[None, :]
        + local_positions[:, 0, None] * right_axis[None, :]
        + local_positions[:, 1, None] * forward_axis[None, :]
    )


def angle_delta_degrees(first: float, second: float) -> float:
    return (first - second + 180.0) % 360.0 - 180.0


def apply_rigid_correction(
    points: np.ndarray,
    rotation: np.ndarray,
    translation: np.ndarray,
) -> np.ndarray:
    values = np.asarray(points, dtype=np.float64)
    if values.ndim != 2 or values.shape[1] != 2:
        raise ValueError("Rigid correction requires an N by 2 point array")
    return values @ rotation.T + translation


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=Path, required=True)
    parser.add_argument("--provider-controls", type=Path, required=True)
    parser.add_argument("--drcog-controls", type=Path, required=True)
    parser.add_argument("--overlay-crop-json", type=Path, required=True)
    parser.add_argument("--orthophoto-registration-audit", type=Path)
    parser.add_argument("--lidar-candidate", type=Path)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-overlay", type=Path, required=True)
    args = parser.parse_args()

    row_bytes = args.rows.read_bytes()
    provider_control_bytes = args.provider_controls.read_bytes()
    drcog_control_bytes = args.drcog_controls.read_bytes()
    rows = json.loads(row_bytes)
    provider_controls = json.loads(provider_control_bytes)
    drcog_controls = json.loads(drcog_control_bytes)
    validate_provider_rows(rows)
    validate_provider_controls(provider_controls)
    if drcog_controls.get("artifactKind") != "drcog-regulation-field-control-candidate":
        raise ValueError("DRCOG controls have the wrong artifact kind")
    if drcog_controls.get("geometryBoundary", {}).get(
        "establishesSubFootAbsoluteHorizontalAccuracy"
    ):
        raise ValueError("Unexpected absolute-accuracy claim in DRCOG controls")
    stadium_ids = {
        rows.get("stadiumId"),
        provider_controls.get("stadiumId"),
        drcog_controls.get("stadiumId"),
    }
    if len(stadium_ids) != 1 or None in stadium_ids:
        raise ValueError("Input stadium identifiers do not agree")
    stadium_id = str(next(iter(stadium_ids)))

    crop_path = Path(drcog_controls["source"]["cropJsonPath"])
    if sha256_file(crop_path) != drcog_controls["source"]["cropJsonSha256"]:
        raise ValueError("DRCOG field-control source crop hash does not reproduce")
    source_crop = json.loads(crop_path.read_text(encoding="utf-8"))
    if source_crop.get("artifactVersion") != drcog_controls["source"][
        "cropArtifactVersion"
    ]:
        raise ValueError("DRCOG field-control source crop version does not reproduce")

    registration_audit = None
    registration_audit_bytes = None
    registration_rotation = np.eye(2, dtype=np.float64)
    registration_translation = np.zeros(2, dtype=np.float64)
    if args.orthophoto_registration_audit:
        registration_audit_bytes = args.orthophoto_registration_audit.read_bytes()
        registration_audit = json.loads(registration_audit_bytes)
        if registration_audit.get("artifactKind") != (
            "ngs-drcog-orthophoto-registration-audit"
        ):
            raise ValueError("Orthophoto registration audit has the wrong artifact kind")
        if registration_audit.get("stadiumId") != stadium_id:
            raise ValueError("Orthophoto registration audit has the wrong stadium")
        if not registration_audit.get("registrationAcceptance", {}).get("accepted"):
            raise ValueError("Orthophoto registration audit did not pass")
        if not registration_audit.get("geometryBoundary", {}).get(
            "establishesCorrectedOrthophotoTranslationAndRotation"
        ):
            raise ValueError("Orthophoto registration audit does not establish correction")
        audit_target = registration_audit.get("inputs", {}).get(
            "targetOrthophoto", {}
        )
        acquisition_path = Path(source_crop["source"]["manifestPath"])
        acquisition_bytes = acquisition_path.read_bytes()
        acquisition = json.loads(acquisition_bytes)
        if (
            audit_target.get("sha256") != hashlib.sha256(acquisition_bytes).hexdigest()
            or audit_target.get("artifactVersion") != acquisition.get("artifactVersion")
        ):
            raise ValueError(
                "Orthophoto registration audit targets a different acquisition"
            )
        correction = registration_audit.get("rigidCorrection", {})
        registration_rotation = np.asarray(
            correction.get("rotationMatrix"),
            dtype=np.float64,
        )
        registration_translation = np.asarray(
            correction.get("translationFeet"),
            dtype=np.float64,
        )
        if (
            registration_rotation.shape != (2, 2)
            or registration_translation.shape != (2,)
            or not np.all(np.isfinite(registration_rotation))
            or not np.all(np.isfinite(registration_translation))
        ):
            raise ValueError("Orthophoto registration correction is malformed")

    provider = provider_controls["controls"]
    provider_home = np.asarray(provider["homePlateProviderPixels"], dtype=np.float64)
    provider_axis = np.asarray(
        provider["providerFieldAxisUnitVector"], dtype=np.float64
    )
    pixels_per_foot = float(provider["providerPixelsPerFoot"])
    uncorrected_home_projected = np.asarray(
        drcog_controls["controls"]["homePlateRearPointProjectedFeet"],
        dtype=np.float64,
    )
    uncorrected_second_projected = np.asarray(
        drcog_controls["controls"]["secondBasePointProjectedFeet"],
        dtype=np.float64,
    )
    corrected_field_controls = apply_rigid_correction(
        np.vstack((uncorrected_home_projected, uncorrected_second_projected)),
        registration_rotation,
        registration_translation,
    )
    home_projected = corrected_field_controls[0]
    second_projected = corrected_field_controls[1]
    uncorrected_forward_axis = (
        uncorrected_second_projected - uncorrected_home_projected
    )
    uncorrected_forward_axis /= np.linalg.norm(uncorrected_forward_axis)
    forward_axis = second_projected - home_projected
    forward_axis /= np.linalg.norm(forward_axis)

    output_rows: list[dict[str, Any]] = []
    overlay_row_points: list[np.ndarray] = []
    total_seats = 0
    for row in rows["rows"]:
        provider_positions = np.asarray(
            [seat["positionProviderPixels"] for seat in row["seats"]],
            dtype=np.float64,
        )
        local_positions = provider_to_local_feet(
            provider_positions,
            provider_home,
            provider_axis,
            pixels_per_foot,
        )
        projected_positions = local_to_projected_feet(
            local_positions,
            home_projected,
            forward_axis,
        )
        orthophoto_nominal_positions = local_to_projected_feet(
            local_positions,
            uncorrected_home_projected,
            uncorrected_forward_axis,
        )
        seats = []
        for seat, local, projected, orthophoto_nominal in zip(
            row["seats"],
            local_positions,
            projected_positions,
            orthophoto_nominal_positions,
        ):
            seats.append(
                {
                    "providerPlaceId": seat["providerPlaceId"],
                    "seatLabel": seat.get("seatLabel"),
                    "positionProviderPixels": seat["positionProviderPixels"],
                    "providerRotation": seat.get("providerRotation"),
                    "providerAttributes": seat.get("providerAttributes"),
                    "providerOrder": seat.get("providerOrder"),
                    "positionLocalFeet": local.tolist(),
                    "positionProjectedFeet": projected.tolist(),
                    "positionOrthophotoNominalProjectedFeet": (
                        orthophoto_nominal.tolist()
                    ),
                    "rowElevationFeet": None,
                }
            )
        total_seats += len(seats)
        overlay_row_points.append(
            np.vstack(
                (
                    orthophoto_nominal_positions[0],
                    orthophoto_nominal_positions[
                        len(orthophoto_nominal_positions) // 2
                    ],
                    orthophoto_nominal_positions[-1],
                )
            )
        )
        output_rows.append(
            {
                "rowKey": row["rowKey"],
                "compositeId": row.get("compositeId"),
                "compositeName": row.get("compositeName"),
                "sectionNodeId": row.get("sectionNodeId"),
                "sectionName": row.get("sectionName"),
                "rowNodeId": row.get("rowNodeId"),
                "rowName": row.get("rowName"),
                "providerPlaceSizePixels": row.get("providerPlaceSizePixels"),
                "providerTotalPlaces": row.get("providerTotalPlaces"),
                "seats": seats,
            }
        )

    overlay_crop_bytes = args.overlay_crop_json.read_bytes()
    overlay_crop = json.loads(overlay_crop_bytes)
    if overlay_crop.get("artifactKind") != "drcog-orthophoto-crop":
        raise ValueError("Overlay input is not a DRCOG orthophoto crop")
    overlay_image_path = Path(overlay_crop["outputImage"]["path"])
    if sha256_file(overlay_image_path) != overlay_crop["outputImage"]["sha256"]:
        raise ValueError("Overlay crop image hash does not reproduce")
    overlay_image = cv2.imread(str(overlay_image_path), cv2.IMREAD_COLOR)
    if overlay_image is None:
        raise ValueError("OpenCV could not read the overlay crop")
    pixel_width, pixel_height = (
        float(value) for value in overlay_crop["pixelSizeFeet"]
    )
    bounds = overlay_crop["projectedBoundsFeet"]
    minimum_x = float(bounds["minimumX"])
    maximum_y = float(bounds["maximumY"])
    translucent = overlay_image.copy()
    inside_row_anchor_count = 0
    outside_row_anchor_count = 0
    for projected in overlay_row_points:
        pixels = np.column_stack(
            (
                (projected[:, 0] - minimum_x) / pixel_width,
                (projected[:, 1] - maximum_y) / pixel_height,
            )
        )
        integer = np.rint(pixels).astype(np.int32)
        inside = (
            (integer[:, 0] >= 0)
            & (integer[:, 0] < overlay_image.shape[1])
            & (integer[:, 1] >= 0)
            & (integer[:, 1] < overlay_image.shape[0])
        )
        inside_row_anchor_count += int(np.count_nonzero(inside))
        outside_row_anchor_count += int(len(inside) - np.count_nonzero(inside))
        if np.count_nonzero(inside) >= 2:
            cv2.polylines(
                translucent,
                [integer[inside].reshape((-1, 1, 2))],
                False,
                (0, 220, 255),
                1,
                cv2.LINE_AA,
            )
        for point in integer[inside]:
            cv2.circle(translucent, tuple(point), 1, (0, 0, 255), -1)
    overlay = cv2.addWeighted(translucent, 0.72, overlay_image, 0.28, 0.0)
    home_pixel = np.asarray(
        [
            (uncorrected_home_projected[0] - minimum_x) / pixel_width,
            (uncorrected_home_projected[1] - maximum_y) / pixel_height,
        ]
    )
    cv2.circle(
        overlay,
        tuple(np.rint(home_pixel).astype(int)),
        12,
        (255, 0, 255),
        3,
    )
    args.output_overlay.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_overlay), overlay):
        raise ValueError("OpenCV could not write the row overlay")

    uncorrected_ortho_bearing = float(
        drcog_controls["controls"]["fieldAxisBearingDegreesEastOfGridNorth"]
    )
    ortho_bearing = math.degrees(math.atan2(forward_axis[0], forward_axis[1])) % 360.0
    lidar_comparison = None
    if args.lidar_candidate:
        lidar_bytes = args.lidar_candidate.read_bytes()
        lidar = json.loads(lidar_bytes)
        longitude, latitude = lidar["transform"]["homePlateLongitudeLatitude"]
        acquisition_path = Path(source_crop["source"]["manifestPath"])
        acquisition = json.loads(acquisition_path.read_text(encoding="utf-8"))
        latest_wkid = acquisition["spatialReference"]["latestWkid"]
        transformer = Transformer.from_crs(
            CRS.from_epsg(4326), CRS.from_epsg(int(latest_wkid)), always_xy=True
        )
        lidar_home_x, lidar_home_y = transformer.transform(longitude, latitude)
        lidar_home = np.asarray([lidar_home_x, lidar_home_y], dtype=np.float64)
        lidar_bearing = float(lidar["transform"]["fittedCenterFieldBearingDegrees"])
        lidar_comparison = {
            "candidatePath": str(args.lidar_candidate.resolve()),
            "candidateSha256": hashlib.sha256(lidar_bytes).hexdigest(),
            "projectedCrsLatestWkid": latest_wkid,
            "lidarCandidateHomePlateProjectedFeet": lidar_home.tolist(),
            "orthophotoCandidateHomePlateProjectedFeet": home_projected.tolist(),
            "homePlateDeltaFeet": float(np.linalg.norm(lidar_home - home_projected)),
            "lidarCandidateBearingDegrees": lidar_bearing,
            "orthophotoCandidateBearingDegrees": ortho_bearing,
            "bearingDeltaDegrees": abs(
                angle_delta_degrees(lidar_bearing, ortho_bearing)
            ),
        }

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": stadium_id,
        "inputs": {
            "rowsPath": str(args.rows.resolve()),
            "rowsSha256": hashlib.sha256(row_bytes).hexdigest(),
            "rowArtifactVersion": rows.get("artifactVersion"),
            "providerControlsPath": str(args.provider_controls.resolve()),
            "providerControlsSha256": hashlib.sha256(
                provider_control_bytes
            ).hexdigest(),
            "providerControlArtifactVersion": provider_controls.get(
                "artifactVersion"
            ),
            "drcogControlsPath": str(args.drcog_controls.resolve()),
            "drcogControlsSha256": hashlib.sha256(drcog_control_bytes).hexdigest(),
            "drcogControlArtifactVersion": drcog_controls.get("artifactVersion"),
            "overlayCropPath": str(args.overlay_crop_json.resolve()),
            "overlayCropSha256": hashlib.sha256(overlay_crop_bytes).hexdigest(),
            "overlayCropArtifactVersion": overlay_crop.get("artifactVersion"),
            "orthophotoRegistrationAudit": (
                None
                if registration_audit is None or registration_audit_bytes is None
                else {
                    "path": str(args.orthophoto_registration_audit.resolve()),
                    "sha256": hashlib.sha256(registration_audit_bytes).hexdigest(),
                    "artifactVersion": registration_audit.get("artifactVersion"),
                }
            ),
        },
        "projectedCoordinateReference": {
            "wkid": 103013,
            "latestWkid": 6428,
            "units": "US survey feet",
        },
        "transform": {
            "providerPixelsPerFoot": pixels_per_foot,
            "providerHomePlatePixels": provider_home.tolist(),
            "providerFieldAxisUnitVector": provider_axis.tolist(),
            "homePlateProjectedFeet": home_projected.tolist(),
            "secondBaseProjectedFeet": second_projected.tolist(),
            "fieldAxisProjectedUnitVector": forward_axis.tolist(),
            "fieldAxisBearingDegreesEastOfGridNorth": ortho_bearing,
            "orthophotoNominalHomePlateProjectedFeet": (
                uncorrected_home_projected.tolist()
            ),
            "orthophotoNominalSecondBaseProjectedFeet": (
                uncorrected_second_projected.tolist()
            ),
            "orthophotoNominalFieldAxisProjectedUnitVector": (
                uncorrected_forward_axis.tolist()
            ),
        },
        "coverage": {
            "rowCount": len(output_rows),
            "seatCount": total_seats,
            "rowsWithProjectedCoordinates": len(output_rows),
            "seatsWithProjectedCoordinates": total_seats,
            "rowsWithMeasuredElevation": 0,
            "seatsWithMeasuredElevation": 0,
            "insideOverlayRowAnchorCount": inside_row_anchor_count,
            "outsideOverlayRowAnchorCount": outside_row_anchor_count,
        },
        "rows": output_rows,
        "diagnostics": {
            "providerMoundResidualFeet": provider_controls["controls"][
                "moundDistanceResidualFeet"
            ],
            "orthophotoBaseSpacingResidualFeet": drcog_controls["validation"][
                "baseBagCentreSeparationResidualFeet"
            ],
            "orthophotoSegmentationHomeRepeatabilityFeet": drcog_controls[
                "validation"
            ]["maximumHomePointDeltaAcrossThresholdsFeet"],
            "orthophotoSegmentationBearingRepeatabilityDegrees": drcog_controls[
                "validation"
            ]["maximumBearingDeltaAcrossThresholdsDegrees"],
            "orthophotoAbsoluteAccuracyVerifiedAt95Percent": (
                registration_audit is not None
            ),
            "orthophotoGroundFrameHorizontalAccuracyVerifiedAt95Percent": (
                registration_audit is not None
            ),
            "orthophotoGroundFrameHorizontalUncertainty95Feet": (
                None
                if registration_audit is None
                else registration_audit.get("uncertainty", {}).get(
                    "combinedAbsoluteHorizontalUncertainty95Feet"
                )
            ),
            "orthophotoGroundFrameCorrection": (
                None
                if registration_audit is None
                else {
                    "rotationMatrix": registration_rotation.tolist(),
                    "translationFeet": registration_translation.tolist(),
                    "uncorrectedHomePlateProjectedFeet": (
                        uncorrected_home_projected.tolist()
                    ),
                    "uncorrectedSecondBaseProjectedFeet": (
                        uncorrected_second_projected.tolist()
                    ),
                    "uncorrectedFieldAxisBearingDegreesEastOfGridNorth": (
                        uncorrected_ortho_bearing
                    ),
                }
            ),
            "lidarCandidateComparison": lidar_comparison,
        },
        "overlay": {
            "path": str(args.output_overlay.resolve()),
            "sha256": sha256_file(args.output_overlay),
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "ticketmaster-drcog-row-registration-candidate",
        "artifactVersion": "sha256:" + stable_sha256(stable),
        **stable,
        "geometryBoundary": {
            "establishesProviderRowIdentity": True,
            "establishesCandidateProjectedPlanCoordinates": True,
            "establishesMeasuredRowElevations": False,
            "establishesSubFootAbsoluteHorizontalAccuracy": False,
            "establishesSubFootGroundOrthophotoFrame": registration_audit is not None,
            "establishesPublicationReadyMetricGeometry": False,
            "note": (
                "The transform is deterministic and complete. The ground orthophoto "
                "frame is NGS-controlled when an accepted audit is supplied, but "
                "above-ground rows still inherit relief displacement and regulation-"
                "derived field-control assumptions."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *(
                    []
                    if registration_audit is not None
                    else ["ORTHOPHOTO_HORIZONTAL_ACCURACY_NOT_VERIFIED_AT_95_PERCENT"]
                ),
                "FIELD_CONTROL_DERIVED_FROM_REGULATION_GEOMETRY_NOT_SURVEY",
                "HOME_PLATE_OBSCURED_AND_RECONSTRUCTED",
                "ROW_ELEVATIONS_NOT_MEASURED",
                "ABOVE_GROUND_RELIEF_DISPLACEMENT_NOT_RESOLVED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_REGISTERED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(args.output_json.resolve()),
                "artifactVersion": artifact["artifactVersion"],
                "stadiumId": stadium_id,
                "coverage": artifact["coverage"],
                "transform": artifact["transform"],
                "diagnostics": artifact["diagnostics"],
                "publication": artifact["publication"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
