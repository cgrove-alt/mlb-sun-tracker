#!/usr/bin/env python3
"""Identify and visualize DRCOG roofprints associated with a stadium bowl."""

from __future__ import annotations

import argparse
from collections import defaultdict
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np


ANALYSIS_VERSION = "drcog-stadium-roofprint-analysis-v1"


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


def feature_contains_points(
    rings: list[np.ndarray],
    points: np.ndarray,
) -> np.ndarray:
    inside = np.zeros(len(points), dtype=bool)
    for ring in rings:
        values = np.fromiter(
            (
                cv2.pointPolygonTest(
                    ring.astype(np.float32),
                    (float(point[0]), float(point[1])),
                    False,
                )
                >= 0
                for point in points
            ),
            dtype=bool,
            count=len(points),
        )
        inside ^= values
    return inside


def polygon_centroid(ring: np.ndarray) -> np.ndarray:
    coordinates = ring
    if np.allclose(coordinates[0], coordinates[-1]):
        coordinates = coordinates[:-1]
    shifted = np.roll(coordinates, -1, axis=0)
    cross = coordinates[:, 0] * shifted[:, 1] - shifted[:, 0] * coordinates[:, 1]
    twice_area = float(np.sum(cross))
    if abs(twice_area) < 1e-9:
        return np.mean(coordinates, axis=0)
    return np.asarray(
        [
            np.sum((coordinates[:, 0] + shifted[:, 0]) * cross),
            np.sum((coordinates[:, 1] + shifted[:, 1]) * cross),
        ],
        dtype=np.float64,
    ) / (3.0 * twice_area)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--acquisition-manifest", type=Path, required=True)
    parser.add_argument("--row-registration", type=Path, required=True)
    parser.add_argument("--overlay-crop-json", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-overlay", type=Path, required=True)
    args = parser.parse_args()

    manifest_bytes = args.acquisition_manifest.read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get("artifactKind") != "drcog-arcgis-feature-acquisition":
        raise ValueError("Input manifest is not a DRCOG feature acquisition")
    feature_path = Path(manifest["localFiles"]["features"])
    feature_hash = sha256_file(feature_path)
    if feature_hash != manifest.get("features", {}).get("sha256"):
        raise ValueError("Feature response hash does not match its acquisition manifest")
    feature_response = json.loads(feature_path.read_text(encoding="utf-8"))
    features = feature_response.get("features", [])
    if len(features) != manifest.get("features", {}).get("featureCount"):
        raise ValueError("Feature count does not match the acquisition manifest")

    row_bytes = args.row_registration.read_bytes()
    registration = json.loads(row_bytes)
    if registration.get("artifactKind") != "ticketmaster-drcog-row-registration-candidate":
        raise ValueError("Input rows are not a Ticketmaster DRCOG registration")
    if registration.get("stadiumId") != manifest.get("stadiumId"):
        raise ValueError("Feature and row stadium identifiers do not agree")
    seats = np.asarray(
        [
            seat["positionProjectedFeet"]
            for row in registration["rows"]
            for seat in row["seats"]
        ],
        dtype=np.float64,
    )
    if len(seats) != registration.get("coverage", {}).get("seatCount"):
        raise ValueError("Registered seat count does not reproduce")

    feature_results: list[dict[str, Any]] = []
    group_seat_masks: dict[int, np.ndarray] = defaultdict(
        lambda: np.zeros(len(seats), dtype=bool)
    )
    group_feature_counts: dict[int, int] = defaultdict(int)
    for feature in features:
        attributes = feature["attributes"]
        rings = [
            np.asarray(ring, dtype=np.float64) for ring in feature["geometry"]["rings"]
        ]
        inside = feature_contains_points(rings, seats)
        building_id = int(attributes["Building_ID"])
        group_seat_masks[building_id] |= inside
        group_feature_counts[building_id] += 1
        centroid = polygon_centroid(rings[0])
        height = float(attributes["Bldg_Height"])
        ground = float(attributes["Ground_Elevation"])
        feature_results.append(
            {
                "objectId": int(attributes["OBJECTID"]),
                "buildingId": building_id,
                "buildingType": attributes.get("Bldg_Type"),
                "heightFeet": height,
                "groundElevationFeet": ground,
                "maximumRoofElevationFeet": ground + height,
                "source": attributes.get("Source"),
                "updateStatus": attributes.get("Update_Status"),
                "areaSquareFeet": float(attributes["SHAPE.STArea()"]),
                "ringCount": len(rings),
                "vertexCount": sum(len(ring) for ring in rings),
                "centroidProjectedFeet": centroid.tolist(),
                "registeredSeatInsideCount": int(np.count_nonzero(inside)),
            }
        )

    group_results = []
    for building_id, mask in group_seat_masks.items():
        group_features = [
            result for result in feature_results if result["buildingId"] == building_id
        ]
        group_results.append(
            {
                "buildingId": building_id,
                "featureCount": group_feature_counts[building_id],
                "registeredSeatInsideUnionCount": int(np.count_nonzero(mask)),
                "buildingTypes": sorted(
                    {
                        str(result["buildingType"])
                        for result in group_features
                        if result["buildingType"] is not None
                    }
                ),
                "groundElevationsFeet": sorted(
                    {result["groundElevationFeet"] for result in group_features}
                ),
                "minimumHeightFeet": min(
                    result["heightFeet"] for result in group_features
                ),
                "maximumHeightFeet": max(
                    result["heightFeet"] for result in group_features
                ),
                "totalAreaSquareFeet": sum(
                    result["areaSquareFeet"] for result in group_features
                ),
            }
        )
    group_results.sort(
        key=lambda value: (
            value["registeredSeatInsideUnionCount"],
            value["totalAreaSquareFeet"],
        ),
        reverse=True,
    )
    if not group_results or group_results[0]["registeredSeatInsideUnionCount"] == 0:
        raise ValueError("No roofprint building group overlaps registered seats")
    primary_building_id = int(group_results[0]["buildingId"])
    primary_features = [
        result
        for result in feature_results
        if result["buildingId"] == primary_building_id
    ]
    secondary_overlap_features = [
        result
        for result in feature_results
        if result["buildingId"] != primary_building_id
        and result["registeredSeatInsideCount"] > 0
    ]

    crop_bytes = args.overlay_crop_json.read_bytes()
    crop = json.loads(crop_bytes)
    if crop.get("artifactKind") != "drcog-orthophoto-crop":
        raise ValueError("Overlay input is not a DRCOG orthophoto crop")
    image_path = Path(crop["outputImage"]["path"])
    if sha256_file(image_path) != crop["outputImage"]["sha256"]:
        raise ValueError("Overlay crop image hash does not reproduce")
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("OpenCV could not read the overlay crop")
    pixel_width, pixel_height = (float(value) for value in crop["pixelSizeFeet"])
    minimum_x = float(crop["projectedBoundsFeet"]["minimumX"])
    maximum_y = float(crop["projectedBoundsFeet"]["maximumY"])
    primary_ids = {result["objectId"] for result in primary_features}
    secondary_ids = {result["objectId"] for result in secondary_overlap_features}
    translucent = image.copy()
    for feature in features:
        object_id = int(feature["attributes"]["OBJECTID"])
        pixel_rings = []
        for ring in feature["geometry"]["rings"]:
            projected = np.asarray(ring, dtype=np.float64)
            pixels = np.column_stack(
                (
                    (projected[:, 0] - minimum_x) / pixel_width,
                    (projected[:, 1] - maximum_y) / pixel_height,
                )
            )
            pixel_rings.append(np.rint(pixels).astype(np.int32))
        if object_id in primary_ids:
            colour = (0, 80, 255)
            thickness = 3
            cv2.fillPoly(translucent, pixel_rings, colour)
        elif object_id in secondary_ids:
            colour = (255, 0, 255)
            thickness = 3
            cv2.fillPoly(translucent, pixel_rings, colour)
        else:
            colour = (255, 255, 255)
            thickness = 1
        cv2.polylines(
            translucent,
            [ring.reshape((-1, 1, 2)) for ring in pixel_rings],
            True,
            colour,
            thickness,
            cv2.LINE_AA,
        )
    overlay = cv2.addWeighted(translucent, 0.38, image, 0.62, 0.0)
    for result in sorted(
        primary_features + secondary_overlap_features,
        key=lambda value: value["areaSquareFeet"],
        reverse=True,
    ):
        centroid = np.asarray(result["centroidProjectedFeet"], dtype=np.float64)
        pixel = np.rint(
            [
                (centroid[0] - minimum_x) / pixel_width,
                (centroid[1] - maximum_y) / pixel_height,
            ]
        ).astype(int)
        if 0 <= pixel[0] < image.shape[1] and 0 <= pixel[1] < image.shape[0]:
            cv2.putText(
                overlay,
                f"{result['objectId']}:{result['heightFeet']:.0f}ft",
                tuple(pixel),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.42,
                (0, 0, 0),
                3,
                cv2.LINE_AA,
            )
            cv2.putText(
                overlay,
                f"{result['objectId']}:{result['heightFeet']:.0f}ft",
                tuple(pixel),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.42,
                (255, 255, 255),
                1,
                cv2.LINE_AA,
            )
    args.output_overlay.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_overlay), overlay):
        raise ValueError("OpenCV could not write the roofprint overlay")

    primary_group = next(
        group for group in group_results if group["buildingId"] == primary_building_id
    )
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": manifest.get("stadiumId"),
        "inputs": {
            "acquisitionManifestPath": str(args.acquisition_manifest.resolve()),
            "acquisitionManifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "acquisitionArtifactVersion": manifest.get("artifactVersion"),
            "featurePath": str(feature_path.resolve()),
            "featureSha256": feature_hash,
            "rowRegistrationPath": str(args.row_registration.resolve()),
            "rowRegistrationSha256": hashlib.sha256(row_bytes).hexdigest(),
            "rowRegistrationArtifactVersion": registration.get("artifactVersion"),
            "overlayCropPath": str(args.overlay_crop_json.resolve()),
            "overlayCropSha256": hashlib.sha256(crop_bytes).hexdigest(),
            "overlayCropArtifactVersion": crop.get("artifactVersion"),
        },
        "sourceDescription": manifest.get("layer", {}).get("description"),
        "accuracyEvidence": {
            "serviceMetadataUrl": manifest.get("metadata", {}).get("serviceUrl"),
            "serviceMetadataSha256": manifest.get("metadata", {}).get(
                "serviceSha256"
            ),
            "layerMetadataUrl": manifest.get("metadata", {}).get("layerUrl"),
            "layerMetadataSha256": manifest.get("metadata", {}).get("layerSha256"),
            "horizontalAccuracyStatement": manifest.get("metadata", {}).get(
                "horizontalAccuracyStatement"
            ),
            "verticalAccuracyStatement": manifest.get("metadata", {}).get(
                "verticalAccuracyStatement"
            ),
            "reports95PercentSubFootHorizontalAccuracy": manifest.get(
                "metadata", {}
            ).get("reports95PercentSubFootHorizontalAccuracy"),
        },
        "inventory": {
            "featureCount": len(feature_results),
            "buildingGroupCount": len(group_results),
            "registeredSeatCount": len(seats),
            "featuresWithNullHeight": manifest.get("features", {}).get(
                "nullHeightCount"
            ),
            "featuresWithNullGroundElevation": manifest.get("features", {}).get(
                "nullGroundElevationCount"
            ),
        },
        "semanticSelection": {
            "method": "maximum registered-seat overlap by Building_ID group",
            "primaryStadiumBuildingId": primary_building_id,
            "primaryFeatureCount": len(primary_features),
            "primaryRegisteredSeatInsideUnionCount": primary_group[
                "registeredSeatInsideUnionCount"
            ],
            "secondaryOverlapFeatureCount": len(secondary_overlap_features),
            "secondaryOverlapObjectIds": [
                result["objectId"] for result in secondary_overlap_features
            ],
            "selectionIndependentOfProviderRegistration": False,
        },
        "buildingGroups": group_results,
        "features": feature_results,
        "primaryStadiumFeatures": primary_features,
        "secondaryOverlapFeatures": secondary_overlap_features,
        "overlay": {
            "path": str(args.output_overlay.resolve()),
            "sha256": sha256_file(args.output_overlay),
            "primaryStadiumColour": "orange-red",
            "secondaryOverlapColour": "magenta",
            "otherNeighbourhoodColour": "white-outline",
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "drcog-stadium-roofprint-candidate-analysis",
        "artifactVersion": "sha256:" + stable_sha256(stable),
        **stable,
        "geometryBoundary": {
            "establishesCurrentNeighbourhoodRoofprintCandidates": True,
            "establishesPrimaryStadiumBuildingGroupCandidate": True,
            "establishesRoofEavePolygons": True,
            "establishesMaximumRoofHeightAttributes": True,
            "establishesOverhangUndersides": False,
            "establishesSeatingDeckSurfaces": False,
            "establishesSubFootAbsoluteHorizontalAccuracy": False,
            "allowsSolidExtrusionAsExactObstruction": False,
            "note": (
                "All neighbourhood roofprints are retained. Building_ID 33132 is the "
                "primary stadium candidate, but provider-overlap selection is not an "
                "independent semantic validation."
            ),
        },
        "publication": {
            "eligible": False,
            "blockers": [
                "ROOFPRINT_HORIZONTAL_ACCURACY_NOT_VERIFIED_AT_95_PERCENT",
                "STADIUM_ROOFPRINT_SELECTION_NOT_INDEPENDENTLY_VALIDATED",
                "SECONDARY_SEAT_OVERLAP_FEATURES_REQUIRE_SEMANTIC_REVIEW",
                "OVERHANG_UNDERSIDES_NOT_MEASURED",
                "SEATING_DECK_GEOMETRY_NOT_MEASURED",
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
                "inventory": artifact["inventory"],
                "semanticSelection": artifact["semanticSelection"],
                "primaryGroup": primary_group,
                "secondaryOverlapFeatures": secondary_overlap_features,
                "publication": artifact["publication"],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
