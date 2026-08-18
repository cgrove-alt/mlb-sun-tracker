#!/usr/bin/env python3
"""Register current 3D Digital Venue row cameras to a surveyed ortho frame.

The provider frame is translated through independently measured home-plate
candidates in the provider model and orthophoto. Every output remains a
candidate until the provider semantic offset, orthophoto control independence,
provider coordinate accuracy, and shadow holdouts pass their release gates.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image
from pyproj import CRS, Geod, Transformer


ANALYSIS_VERSION = "3ddv-survey-orthophoto-world-registration-v2"
METRES_TO_US_SURVEY_FEET = 3937.0 / 1200.0
VERTICAL_ACCURACY_PATTERN = re.compile(
    r"tested\s+0\.204\s+feet\s+vertical\s+accuracy\s+at\s+95\s+percent\s+confidence\s+level",
    re.IGNORECASE,
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def stable_sha256(value: Any) -> str:
    encoded = json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_bytes())


def resolve_input(path: Path) -> Path:
    resolved = path.resolve()
    if not resolved.is_file():
        raise ValueError(f"Input file is missing: {resolved}")
    return resolved


def raster_metadata(manifest: dict[str, Any]) -> dict[str, Any]:
    value = manifest.get("raster", manifest.get("export"))
    if not isinstance(value, dict):
        raise ValueError("Orthophoto manifest lacks raster metadata")
    return value


def raster_pixel_uncertainty_feet(
    pixel_uncertainty: float,
    raster: dict[str, Any],
    source_crs: CRS,
) -> float:
    if pixel_uncertainty < 0:
        raise ValueError("Pixel uncertainty cannot be negative")
    source_unit_to_metres = float(source_crs.axis_info[0].unit_conversion_factor)
    return (
        pixel_uncertainty
        * max(float(raster["pixelSizeX"]), float(raster["pixelSizeY"]))
        * source_unit_to_metres
        * METRES_TO_US_SURVEY_FEET
    )


def apply_rigid_correction(
    point: tuple[float, float],
    correction: dict[str, Any],
) -> tuple[float, float]:
    rotation = np.asarray(correction["rotationMatrix"], dtype=float)
    translation = np.asarray(correction["translationFeet"], dtype=float)
    transformed = np.asarray(point, dtype=float) @ rotation + translation
    return float(transformed[0]), float(transformed[1])


def sample_dem(
    path: Path,
    x_feet: float,
    y_feet: float,
    radius_pixels: int,
) -> dict[str, Any]:
    image = Image.open(path)
    values = np.asarray(image, dtype=float)
    tags = image.tag_v2
    tiepoint = tags.get(33922)
    pixel_scale = tags.get(33550)
    if not tiepoint or not pixel_scale:
        raise ValueError("DEM GeoTIFF lacks tiepoint or pixel scale tags")
    xmin = float(tiepoint[3])
    ymax = float(tiepoint[4])
    pixel_size_x = float(pixel_scale[0])
    pixel_size_y = float(pixel_scale[1])
    column = (x_feet - xmin) / pixel_size_x
    row = (ymax - y_feet) / pixel_size_y
    nearest_column = int(round(column))
    nearest_row = int(round(row))
    if not (0 <= nearest_column < values.shape[1] and 0 <= nearest_row < values.shape[0]):
        raise ValueError("Reference point falls outside DEM crop")
    row_start = max(0, nearest_row - radius_pixels)
    row_end = min(values.shape[0], nearest_row + radius_pixels + 1)
    column_start = max(0, nearest_column - radius_pixels)
    column_end = min(values.shape[1], nearest_column + radius_pixels + 1)
    sample = values[row_start:row_end, column_start:column_end]
    finite = sample[np.isfinite(sample) & (sample > -1_000)]
    if finite.size == 0:
        raise ValueError("DEM reference sample has no finite values")
    return {
        "coordinatePixel": [column, row],
        "nearestPixel": [nearest_column, nearest_row],
        "nearestElevationNavd88Feet": float(values[nearest_row, nearest_column]),
        "sampleRadiusPixels": radius_pixels,
        "sampleCount": int(finite.size),
        "sampleMinimumFeet": float(np.min(finite)),
        "sampleMedianFeet": float(np.median(finite)),
        "sampleMaximumFeet": float(np.max(finite)),
        "sampleStandardDeviationFeet": float(np.std(finite)),
        "pixelSizeFeet": [pixel_size_x, pixel_size_y],
        "tiepointProjectedFeet": [xmin, ymax],
        "dimensionsPixels": [int(values.shape[1]), int(values.shape[0])],
    }


def project_provider_point(
    position: list[float],
    reference_position: list[float],
    reference_lon: float,
    reference_lat: float,
    provider_x_bearing_degrees: float,
    geod: Geod,
    target_transformer: Transformer,
    origin_elevation_feet: float,
) -> dict[str, Any]:
    provider_x, provider_y, provider_z = map(float, position)
    reference_x, reference_y, reference_z = map(float, reference_position)
    offset_x = provider_x - reference_x
    offset_y = provider_y - reference_y
    offset_z = provider_z - reference_z
    theta = math.radians(provider_x_bearing_degrees)
    east_metres = (
        offset_x * math.sin(theta)
        + offset_z * math.sin(theta + math.pi / 2.0)
    )
    north_metres = (
        offset_x * math.cos(theta)
        + offset_z * math.cos(theta + math.pi / 2.0)
    )
    distance_metres = math.hypot(east_metres, north_metres)
    bearing_degrees = math.degrees(math.atan2(east_metres, north_metres))
    longitude, latitude, _ = geod.fwd(
        reference_lon,
        reference_lat,
        bearing_degrees,
        distance_metres,
    )
    projected_x, projected_y = target_transformer.transform(longitude, latitude)
    return {
        "providerPositionMetres": [provider_x, provider_y, provider_z],
        "providerOffsetFromReferenceMetres": [offset_x, offset_y, offset_z],
        "horizontalDistanceFromReferenceMetres": distance_metres,
        "trueBearingFromReferenceDegrees": bearing_degrees % 360.0,
        "longitudeLatitude": [longitude, latitude],
        "projectedCoordinateUsSurveyFeet": [projected_x, projected_y],
        "candidateCameraElevationNavd88Feet": (
            origin_elevation_feet + offset_y * METRES_TO_US_SURVEY_FEET
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=Path, required=True)
    parser.add_argument("--orientation", type=Path, required=True)
    parser.add_argument("--provider-home-control", type=Path, required=True)
    parser.add_argument("--true-north", type=Path, required=True)
    parser.add_argument("--ground-frame-audit", type=Path, required=True)
    parser.add_argument("--dem", type=Path, required=True)
    parser.add_argument("--dem-manifest", type=Path, required=True)
    parser.add_argument("--dem-metadata", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--dem-sample-radius-pixels", type=int, default=5)
    args = parser.parse_args()
    if args.dem_sample_radius_pixels < 1:
        raise ValueError("DEM sample radius must be positive")

    rows_path = resolve_input(args.rows)
    orientation_path = resolve_input(args.orientation)
    provider_home_path = resolve_input(args.provider_home_control)
    true_north_path = resolve_input(args.true_north)
    ground_frame_path = resolve_input(args.ground_frame_audit)
    dem_path = resolve_input(args.dem)
    dem_manifest_path = resolve_input(args.dem_manifest)
    dem_metadata_path = resolve_input(args.dem_metadata)
    rows = read_json(rows_path)
    orientation = read_json(orientation_path)
    provider_home = read_json(provider_home_path)
    true_north = read_json(true_north_path)
    ground_frame = read_json(ground_frame_path)
    dem_manifest = read_json(dem_manifest_path)
    if rows.get("artifactKind") != "venue-local-metric-row-anchors":
        raise ValueError("Rows artifact is not current 3D Digital Venue geometry")
    if rows.get("stadiumId") != "marlins":
        raise ValueError("Rows artifact is not for the Marlins")
    if orientation.get("artifactKind") != "reviewed-orthophoto-foul-line-orientation":
        raise ValueError("Orientation artifact is not the reviewed foul-line measurement")
    if not orientation.get("assessment", {}).get("orientationMeasurementEligible"):
        raise ValueError("Foul-line orientation did not pass its measurement gate")
    if provider_home.get("artifactKind") != "provider-local-home-plate-arc-center":
        raise ValueError("Provider home control has the wrong artifact kind")
    if not provider_home.get("assessment", {}).get("numericArcCenterMeasurementEligible"):
        raise ValueError("Provider home-plate arc control did not pass its numeric gate")
    if true_north.get("artifactKind") != "provider-global-true-north-orientation":
        raise ValueError("True-north artifact has the wrong kind")
    if not true_north.get("assessment", {}).get(
        "globalProviderTrueNorthOrientationMeasurementEligible"
    ):
        raise ValueError("Provider true-north orientation did not pass its measurement gate")
    if ground_frame.get("artifactKind") != "survey-qc-orthophoto-registration-audit":
        raise ValueError("Ground frame artifact has the wrong kind")
    if not ground_frame.get("numericRegistrationAcceptance", {}).get("accepted"):
        raise ValueError("Ground frame did not pass its numeric gates")
    if dem_manifest.get("artifactKind") != "official-arcgis-dem-export":
        raise ValueError("DEM manifest has the wrong artifact kind")
    dem_export = dem_manifest.get("export", {})
    if Path(str(dem_export.get("path"))).resolve() != dem_path:
        raise ValueError("DEM manifest points to a different raster")
    if dem_export.get("sha256") != sha256_file(dem_path):
        raise ValueError("DEM raster hash does not match its manifest")
    if Path(str(dem_manifest.get("source", {}).get("officialMetadataPath"))).resolve() != dem_metadata_path:
        raise ValueError("DEM manifest points to different official metadata")
    if dem_manifest.get("source", {}).get("officialMetadataSha256") != sha256_file(
        dem_metadata_path
    ):
        raise ValueError("DEM metadata hash does not match its manifest")

    orientation_manifest_path = resolve_input(
        Path(str(orientation["inputs"]["manifest"]["path"]))
    )
    orientation_manifest = read_json(orientation_manifest_path)
    if orientation["inputs"]["manifest"]["sha256"] != sha256_file(
        orientation_manifest_path
    ):
        raise ValueError("Orientation manifest hash does not match its artifact")
    raster = raster_metadata(orientation_manifest)
    extent = raster["extent"]
    home_pixel = orientation["measurements"]["homePlateFoulLineIntersectionPixel"]
    home_source_x = float(extent["xmin"]) + float(home_pixel[0]) * float(
        raster["pixelSizeX"]
    )
    home_source_y = float(extent["ymax"]) - float(home_pixel[1]) * float(
        raster["pixelSizeY"]
    )
    source_crs = CRS.from_user_input(raster["coordinateReferenceSystem"])
    target_crs = CRS.from_epsg(6438)
    source_to_target = Transformer.from_crs(source_crs, target_crs, always_xy=True)
    target_to_lonlat = Transformer.from_crs(target_crs, 4326, always_xy=True)
    lonlat_to_target = Transformer.from_crs(4326, target_crs, always_xy=True)
    home_target_uncorrected = source_to_target.transform(home_source_x, home_source_y)
    home_target = apply_rigid_correction(
        home_target_uncorrected,
        ground_frame["rigidCorrection"],
    )
    reference_lon, reference_lat = target_to_lonlat.transform(*home_target)

    dem_metadata_text = dem_metadata_path.read_text(encoding="utf-8", errors="replace")
    if not VERTICAL_ACCURACY_PATTERN.search(dem_metadata_text):
        raise ValueError("Official DEM metadata lacks the expected 0.204-foot accuracy text")
    dem_sample = sample_dem(
        dem_path,
        home_target[0],
        home_target[1],
        args.dem_sample_radius_pixels,
    )
    home_elevation = dem_sample["nearestElevationNavd88Feet"]
    provider_home_position = list(
        map(
            float,
            provider_home["measurement"]["homePlateArcCenterProviderPositionMetres"],
        )
    )
    provider_x_bearing = float(
        true_north["orientation"]["providerPositiveXTrueBearingDegrees"]
    )
    true_north_uncertainty = float(
        true_north["uncertainty"]["combinedTrueNorthOrientationDegrees"]
    )
    geod = Geod(ellps="GRS80")

    output_rows: list[dict[str, Any]] = []
    plan_distances_feet: list[float] = []
    combined_horizontal_uncertainties: list[float] = []
    ground_frame_uncertainty = float(
        ground_frame["uncertainty"]["combinedAbsoluteHorizontalUncertainty95Feet"]
    )
    home_intersection_uncertainty_pixels = float(
        orientation["measurements"]["homePlateIntersectionUncertaintyPixels"]
    )
    home_intersection_uncertainty_feet = raster_pixel_uncertainty_feet(
        home_intersection_uncertainty_pixels,
        raster,
        source_crs,
    )
    provider_home_uncertainty_feet = float(
        provider_home["measurement"]["combinedHorizontalUncertainty95Metres"]
    ) * METRES_TO_US_SURVEY_FEET
    for row in rows["rows"]:
        anchors = []
        for anchor in row["anchors"]:
            projected = project_provider_point(
                anchor["position"],
                provider_home_position,
                reference_lon,
                reference_lat,
                provider_x_bearing,
                geod,
                lonlat_to_target,
                home_elevation,
            )
            distance_feet = (
                projected["horizontalDistanceFromReferenceMetres"]
                * METRES_TO_US_SURVEY_FEET
            )
            angular_uncertainty_feet = distance_feet * math.sin(
                math.radians(true_north_uncertainty)
            )
            combined_horizontal = (
                ground_frame_uncertainty
                + home_intersection_uncertainty_feet
                + provider_home_uncertainty_feet
                + angular_uncertainty_feet
            )
            plan_distances_feet.append(distance_feet)
            combined_horizontal_uncertainties.append(combined_horizontal)
            anchors.append({
                "seatId": anchor["seatId"],
                **projected,
                "candidateHorizontalUncertainty95Feet": combined_horizontal,
                "horizontalUncertaintyComponents95Feet": {
                    "groundOrthophotoFrame": ground_frame_uncertainty,
                    "orthophotoHomePlateIntersection": home_intersection_uncertainty_feet,
                    "providerHomePlateArcCenter": provider_home_uncertainty_feet,
                    "trueNorthAtAnchorRadius": angular_uncertainty_feet,
                },
            })
        output_rows.append({
            "rowKey": row["rowKey"],
            "sectionId": row["sectionId"],
            "rowId": row["rowId"],
            "publishedSeatCount": row["publishedSeatCount"],
            "anchors": anchors,
        })

    row_count = len(output_rows)
    seat_count = sum(len(row["anchors"]) for row in output_rows)
    under_one_foot = sum(value <= 1.0 for value in combined_horizontal_uncertainties)
    ground_registration_accepted = bool(
        ground_frame.get("registrationAcceptance", {}).get("accepted")
    )
    provider_home_semantics_proven = bool(
        provider_home.get("assessment", {}).get("providerHomePlateSemanticsIndependentlyProven")
    )
    provider_accuracy_reported = False
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "inputs": {
            "rowsArtifactVersion": rows.get("artifactVersion"),
            "orientationArtifactVersion": orientation.get("artifactVersion"),
            "providerHomeArtifactVersion": provider_home.get("artifactVersion"),
            "trueNorthArtifactVersion": true_north.get("artifactVersion"),
            "groundFrameArtifactVersion": ground_frame.get("artifactVersion"),
            "demManifestArtifactVersion": dem_manifest.get("artifactVersion"),
            "demSha256": sha256_file(dem_path),
            "demMetadataSha256": sha256_file(dem_metadata_path),
        },
        "referenceProjectedFeet": home_target,
        "referenceElevationNavd88Feet": home_elevation,
        "providerReferencePositionMetres": provider_home_position,
        "providerXTrueBearingDegrees": provider_x_bearing,
        "rows": output_rows,
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "3ddv-survey-orthophoto-world-registration-candidate",
        "artifactVersion": stable_sha256(stable),
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "marlins",
        "inputs": {
            "rowsPath": str(rows_path),
            "rowsSha256": sha256_file(rows_path),
            "rowsArtifactVersion": rows.get("artifactVersion"),
            "orientationPath": str(orientation_path),
            "orientationSha256": sha256_file(orientation_path),
            "orientationArtifactVersion": orientation.get("artifactVersion"),
            "orientationManifestPath": str(orientation_manifest_path),
            "orientationManifestSha256": sha256_file(orientation_manifest_path),
            "providerHomeControlPath": str(provider_home_path),
            "providerHomeControlSha256": sha256_file(provider_home_path),
            "providerHomeControlArtifactVersion": provider_home.get("artifactVersion"),
            "trueNorthPath": str(true_north_path),
            "trueNorthSha256": sha256_file(true_north_path),
            "trueNorthArtifactVersion": true_north.get("artifactVersion"),
            "groundFrameAuditPath": str(ground_frame_path),
            "groundFrameAuditSha256": sha256_file(ground_frame_path),
            "groundFrameAuditArtifactVersion": ground_frame.get("artifactVersion"),
            "demPath": str(dem_path),
            "demSha256": sha256_file(dem_path),
            "demManifestPath": str(dem_manifest_path),
            "demManifestSha256": sha256_file(dem_manifest_path),
            "demManifestArtifactVersion": dem_manifest.get("artifactVersion"),
            "demMetadataPath": str(dem_metadata_path),
            "demMetadataSha256": sha256_file(dem_metadata_path),
        },
        "coordinateReference": {
            "horizontal": "NAD83(2011) Florida East, EPSG:6438, US survey feet",
            "vertical": "NAVD88 Geoid18, US survey feet",
            "providerLocalUnit": "metre",
            "coordinateSemantics": "candidate seated-camera or panorama-eye position",
        },
        "origin": {
            "provisionalSemanticRole": "home-plate foul-line intersection tied to provider seating-arc center",
            "providerLocalPositionMetres": provider_home_position,
            "reviewedOrthophotoPixel": home_pixel,
            "orthophotoSourceCoordinate": [home_source_x, home_source_y],
            "projectedCoordinateBeforeGroundFrameCorrectionFeet": list(
                home_target_uncorrected
            ),
            "projectedCoordinateAfterGroundFrameCorrectionFeet": list(home_target),
            "longitudeLatitude": [reference_lon, reference_lat],
            "candidateElevationNavd88Feet": home_elevation,
            "providerOriginAtMoundAssumptionRejected": True,
            "providerHomePlateSemanticsIndependentlyProven": provider_home_semantics_proven,
        },
        "dem": {
            "source": "Miami-Dade County 2021 5-foot hydro-enforced bare-earth DEM",
            "reportedVerticalAccuracy95Feet": 0.204,
        "homePlateSample": dem_sample,
            "geometryBoundary": (
                "The DEM establishes a candidate home-plate field datum. It does not measure "
                "provider camera heights, rows, roofs, or overhang undersides."
            ),
        },
        "transform": {
            "method": "GRS80 geodesic offsets from candidate home-plate reference",
            "providerPositiveXTrueBearingDegrees": provider_x_bearing,
            "providerPositiveZTrueBearingDegrees": (
                provider_x_bearing + 90.0
            ) % 360.0,
            "providerPositiveYDirection": "up",
            "metresToUsSurveyFeet": METRES_TO_US_SURVEY_FEET,
        },
        "coverage": {
            "rowCount": row_count,
            "seatCount": seat_count,
            "rowsWithProjectedCoordinates": row_count,
            "seatsWithProjectedCoordinates": seat_count,
            "rowsWithCandidateCameraElevations": row_count,
            "rowsWithMeasuredElevation": 0,
        },
        "diagnostics": {
            "orthophotoGroundFrameHorizontalUncertainty95Feet": ground_frame_uncertainty,
            "groundOrthophotoFramePassedNumericGates": True,
            "groundOrthophotoFrameAcceptedForPublication": ground_registration_accepted,
            "orthophotoHomePlateIntersectionUncertaintyPixels": (
                home_intersection_uncertainty_pixels
            ),
            "orthophotoHomePlateIntersectionUncertaintyFeet": (
                home_intersection_uncertainty_feet
            ),
            "providerHomePlateArcCenterUncertainty95Feet": provider_home_uncertainty_feet,
            "trueNorthOrientationUncertainty95Degrees": true_north_uncertainty,
            "maximumAnchorRadiusFromHomeReferenceFeet": max(plan_distances_feet),
            "combinedAnchorHorizontalUncertainty95Feet": {
                "minimum": min(combined_horizontal_uncertainties),
                "median": float(np.median(combined_horizontal_uncertainties)),
                "p95": float(np.percentile(combined_horizontal_uncertainties, 95)),
                "maximum": max(combined_horizontal_uncertainties),
            },
            "anchorsAtOrBelowOneFootHorizontalUncertainty": under_one_foot,
            "anchorsAtOrBelowOneFootHorizontalUncertaintyPercent": (
                under_one_foot / seat_count * 100.0
            ),
            "providerCameraCoordinateAccuracyReported": provider_accuracy_reported,
        },
        "rows": output_rows,
        "geometryBoundary": {
            "establishesCandidateProjectedPlanCoordinates": True,
            "establishesCandidateNavd88CameraElevations": True,
            "establishesSubFootGroundOrthophotoFrame": ground_registration_accepted,
            "establishesSubFootAbsoluteHorizontalAccuracy": False,
            "establishesMeasuredRowElevations": False,
            "establishesCurrentObstructionGeometry": False,
            "establishesIndependentShadowValidation": False,
        },
        "publication": {
            "eligible": False,
            "blockers": [
                *(
                    [] if ground_registration_accepted else [
                        "QC_POINT_EXCLUSION_FROM_ORTHOPHOTO_ADJUSTMENT_NOT_EXPLICIT"
                    ]
                ),
                *(
                    [] if provider_home_semantics_proven else [
                        "PROVIDER_HOME_PLATE_SEMANTIC_OFFSET_NOT_INDEPENDENTLY_PROVEN"
                    ]
                ),
                *(
                    [] if max(combined_horizontal_uncertainties) <= 1.0 else [
                        "COMBINED_ROW_HORIZONTAL_UNCERTAINTY_EXCEEDS_ONE_FOOT"
                    ]
                ),
                "PROVIDER_CAMERA_COORDINATE_ACCURACY_NOT_REPORTED",
                "ROW_ELEVATIONS_NOT_INDEPENDENTLY_MEASURED",
                "CURRENT_OBSTRUCTION_GEOMETRY_NOT_INCLUDED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "artifactVersion": artifact["artifactVersion"],
        "coverage": artifact["coverage"],
        "origin": artifact["origin"],
        "diagnostics": artifact["diagnostics"],
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
