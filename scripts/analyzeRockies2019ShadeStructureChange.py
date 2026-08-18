#!/usr/bin/env python3
"""Audit the two Coors Field shade structures bracketed by the 2019 permit."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any
from urllib.parse import unquote

import cv2
import laspy
import numpy as np
from pyproj import Transformer


ANALYSIS_VERSION = "rockies-2019-shade-structure-change-audit-v1"
STATE_PLANE_CRS = 6428
HISTORIC_LIDAR_CRS = 26913
POST_LIDAR_CRS = 6342
METRES_TO_FEET = 3.280839895013123
ELEVATED_THRESHOLD_METRES = 2.0
HISTORIC_MAXIMUM_ELEVATED_RATIO = 0.02
POST_MINIMUM_ELEVATED_RATIO = 0.70
POST_MINIMUM_ELEVATED_RETURNS = 100


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


def load_json(path: Path) -> tuple[bytes, dict[str, Any]]:
    payload = path.read_bytes()
    return payload, json.loads(payload)


def input_record(path: Path, payload: bytes, artifact: dict[str, Any]) -> dict[str, Any]:
    return {
        "path": str(path.resolve()),
        "sha256": hashlib.sha256(payload).hexdigest(),
        "artifactVersion": artifact.get("artifactVersion"),
        "analysisVersion": artifact.get("analysisVersion"),
    }


def minimum_area_dimensions(polygon: np.ndarray) -> tuple[float, float]:
    rectangle = cv2.minAreaRect(np.asarray(polygon, dtype=np.float32))
    dimensions = sorted((float(rectangle[1][0]), float(rectangle[1][1])))
    return dimensions[1], dimensions[0]


def point_in_polygon_mask(points: np.ndarray, polygon: np.ndarray) -> np.ndarray:
    contour = np.asarray(polygon, dtype=np.float32)
    return np.fromiter(
        (
            cv2.pointPolygonTest(
                contour,
                (float(point[0]), float(point[1])),
                False,
            )
            >= 0
            for point in points
        ),
        dtype=bool,
        count=len(points),
    )


def fit_ground_plane(points: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    if len(points) < 100:
        raise ValueError("Fewer than 100 local ground returns are available")
    origin = np.mean(points[:, :2], axis=0)
    design = np.column_stack((points[:, 0] - origin[0], points[:, 1] - origin[1], np.ones(len(points))))
    coefficients = np.linalg.lstsq(design, points[:, 2], rcond=None)[0]
    return origin, coefficients


def plane_height(
    x: np.ndarray,
    y: np.ndarray,
    origin: np.ndarray,
    coefficients: np.ndarray,
) -> np.ndarray:
    return (
        coefficients[0] * (x - origin[0])
        + coefficients[1] * (y - origin[1])
        + coefficients[2]
    )


def local_lidar_points(
    lidar_directory: Path,
    polygon: np.ndarray,
    expected_files: list[dict[str, Any]],
    buffer_metres: float = 20.0,
) -> tuple[np.ndarray, list[dict[str, Any]]]:
    minimum = np.min(polygon, axis=0) - buffer_metres
    maximum = np.max(polygon, axis=0) + buffer_metres
    parts: list[np.ndarray] = []
    locked_files: list[dict[str, Any]] = []
    for source in expected_files:
        name = Path(unquote(source["sourceUrl"])).name
        path = lidar_directory / name
        actual_hash = sha256_file(path)
        if actual_hash != source["localFileSha256"]:
            raise ValueError(f"LiDAR checksum differs for {name}")
        with laspy.open(path) as reader:
            if int(reader.header.point_count) != int(source["pointCount"]):
                raise ValueError(f"LiDAR point count differs for {name}")
            selected_count = 0
            for points in reader.chunk_iterator(2_000_000):
                x = np.asarray(points.x)
                y = np.asarray(points.y)
                selected = (
                    (x >= minimum[0])
                    & (x <= maximum[0])
                    & (y >= minimum[1])
                    & (y <= maximum[1])
                )
                if not np.any(selected):
                    continue
                part = np.column_stack(
                    (
                        x[selected],
                        y[selected],
                        np.asarray(points.z)[selected],
                        np.asarray(points.classification)[selected],
                    )
                )
                selected_count += len(part)
                parts.append(part)
            locked_files.append(
                {
                    "path": str(path.resolve()),
                    "sha256": actual_hash,
                    "pointCount": int(source["pointCount"]),
                    "selectedLocalPointCount": selected_count,
                }
            )
    if not parts:
        raise ValueError("No LiDAR points intersect the local analysis buffer")
    return np.concatenate(parts), locked_files


def quantiles(values: np.ndarray) -> dict[str, float]:
    if not len(values):
        return {}
    results = np.quantile(values, [0.05, 0.5, 0.95])
    return {
        "p05": float(results[0]),
        "median": float(results[1]),
        "p95": float(results[2]),
    }


def analyze_lidar_epoch(
    points: np.ndarray,
    polygon: np.ndarray,
) -> dict[str, Any]:
    inside = point_in_polygon_mask(points[:, :2], polygon)
    classifications = points[:, 3].astype(np.uint8)
    ground = (classifications == 2) & ~inside
    origin, coefficients = fit_ground_plane(points[ground, :3])
    relative_height = points[:, 2] - plane_height(points[:, 0], points[:, 1], origin, coefficients)
    valid = inside & ~np.isin(classifications, [7, 11])
    elevated = valid & (relative_height >= ELEVATED_THRESHOLD_METRES)
    class_values, class_counts = np.unique(classifications[inside], return_counts=True)
    ground_residual = relative_height[ground]
    elevated_height_metres = relative_height[elevated]
    height_metres = quantiles(elevated_height_metres)
    height_feet = {
        name: value * METRES_TO_FEET for name, value in height_metres.items()
    }
    return {
        "localPointCount": int(len(points)),
        "insideFootprintPointCount": int(np.count_nonzero(inside)),
        "insideFootprintClassificationCounts": {
            str(int(value)): int(count)
            for value, count in zip(class_values, class_counts)
        },
        "validInsideFootprintPointCount": int(np.count_nonzero(valid)),
        "elevatedInsideFootprintPointCount": int(np.count_nonzero(elevated)),
        "elevatedInsideFootprintRatio": float(
            np.count_nonzero(elevated) / np.count_nonzero(valid)
        ),
        "elevatedThresholdMetres": ELEVATED_THRESHOLD_METRES,
        "elevatedThresholdFeet": ELEVATED_THRESHOLD_METRES * METRES_TO_FEET,
        "elevatedSurfaceHeightAboveLocalGroundMetres": height_metres,
        "elevatedSurfaceHeightAboveLocalGroundFeet": height_feet,
        "localGroundPlane": {
            "originMetres": origin.tolist(),
            "coefficients": coefficients.tolist(),
            "groundReturnCount": int(np.count_nonzero(ground)),
            "absoluteResidualP95Metres": float(np.quantile(np.abs(ground_residual), 0.95)),
            "absoluteResidualP95Feet": float(
                np.quantile(np.abs(ground_residual), 0.95) * METRES_TO_FEET
            ),
        },
    }


def validate_page_manifest(path: Path, expected_kind: str) -> tuple[bytes, dict[str, Any], str]:
    payload, manifest = load_json(path)
    if manifest.get("artifactKind") != expected_kind:
        raise ValueError(f"Unexpected page manifest kind at {path}")
    local_path = Path(manifest["output"])
    actual_hash = sha256_file(local_path)
    if actual_hash != manifest.get("sha256"):
        raise ValueError(f"Page or image checksum differs at {local_path}")
    return payload, manifest, local_path.read_text(encoding="utf-8", errors="replace") if local_path.suffix == ".html" else ""


def validate_crop(path: Path) -> tuple[bytes, dict[str, Any]]:
    payload, crop = load_json(path)
    if crop.get("artifactKind") != "drcog-orthophoto-crop":
        raise ValueError(f"Unexpected orthophoto crop at {path}")
    image_path = Path(crop["outputImage"]["path"])
    if sha256_file(image_path) != crop["outputImage"]["sha256"]:
        raise ValueError(f"Orthophoto crop checksum differs at {image_path}")
    return payload, crop


def polygon_pixels(crop: dict[str, Any], polygon: np.ndarray) -> np.ndarray:
    pixel_width, pixel_height = (float(value) for value in crop["pixelSizeFeet"])
    minimum_x = float(crop["projectedBoundsFeet"]["minimumX"])
    maximum_y = float(crop["projectedBoundsFeet"]["maximumY"])
    pixels = np.column_stack(
        (
            (polygon[:, 0] - minimum_x) / pixel_width,
            (polygon[:, 1] - maximum_y) / pixel_height,
        )
    )
    return np.rint(pixels).astype(np.int32)


def render_panel(
    crop: dict[str, Any],
    polygon: np.ndarray,
    title: str,
    target_size: tuple[int, int] = (720, 500),
) -> np.ndarray:
    image = cv2.imread(crop["outputImage"]["path"], cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode orthophoto crop")
    pixels = polygon_pixels(crop, polygon)
    cv2.polylines(image, [pixels.reshape((-1, 1, 2))], True, (0, 0, 255), 5, cv2.LINE_AA)
    x, y, width, height = cv2.boundingRect(pixels)
    cv2.rectangle(image, (x, y), (x + width, y + height), (0, 255, 255), 2, cv2.LINE_AA)
    scale = min(target_size[0] / image.shape[1], target_size[1] / image.shape[0])
    resized = cv2.resize(
        image,
        (max(1, round(image.shape[1] * scale)), max(1, round(image.shape[0] * scale))),
        interpolation=cv2.INTER_AREA,
    )
    panel = np.full((target_size[1] + 52, target_size[0], 3), 255, dtype=np.uint8)
    left = (target_size[0] - resized.shape[1]) // 2
    top = 52 + (target_size[1] - resized.shape[0]) // 2
    panel[top : top + resized.shape[0], left : left + resized.shape[1]] = resized
    cv2.putText(panel, title, (14, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (20, 20, 20), 2, cv2.LINE_AA)
    return panel


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--permit-detail", type=Path, default=Path("tmp/lidar/rockies-denver-epermits-record-detail-2019-sudp-0000843-v4.json"))
    parser.add_argument("--review-controls", type=Path, default=Path("scripts/rockies_2019_shade_structure_review_controls.json"))
    parser.add_argument("--roofprint-manifest", type=Path, default=Path("tmp/lidar/rockies-drcog-roofprints-2024/manifest.json"))
    parser.add_argument("--lidar-2013-audit", type=Path, default=Path("tmp/lidar/rockies-usgs-south-platte-2013/stadium-surface-audit.json"))
    parser.add_argument("--lidar-2020-audit", type=Path, default=Path("tmp/lidar/rockies-usgs-co-drcog-2020-b20/stadium-surface-audit.json"))
    parser.add_argument("--picnic-page-manifest", type=Path, default=Path("tmp/lidar/rockies-official-picnic-page.json"))
    parser.add_argument("--guide-page-manifest", type=Path, default=Path("tmp/lidar/rockies-official-ballpark-guide-page.json"))
    parser.add_argument("--picnic-image-manifest", action="append", type=Path, default=[Path("tmp/lidar/rockies-official-picnic-pavilions-ggbmyuiojf4jzglld3ql.json"), Path("tmp/lidar/rockies-official-picnic-pavilion-v5nujjtmp0s2qxx6a1h6.json")])
    parser.add_argument("--output-json", type=Path, default=Path("tmp/lidar/rockies-2019-shade-structure-change-audit-2026.json"))
    parser.add_argument("--output-overlay", type=Path, default=Path("tmp/lidar/rockies-2019-shade-structure-change-audit-2026.png"))
    args = parser.parse_args()

    permit_bytes, permit = load_json(args.permit_detail)
    if permit.get("analysisVersion") != "denver-epermits-public-record-detail-v4":
        raise ValueError("Permit detail is not the reviewed v4 acquisition")
    controls_bytes, controls = load_json(args.review_controls)
    if controls.get("artifactKind") != "rockies-2019-shade-structure-review-controls":
        raise ValueError("Unexpected review controls")
    if controls["permitScopeText"] not in json.dumps(permit):
        raise ValueError("Permit detail no longer contains the reviewed shade scope")

    roofprint_bytes, roofprint_manifest = load_json(args.roofprint_manifest)
    if roofprint_manifest.get("artifactKind") != "drcog-arcgis-feature-acquisition":
        raise ValueError("Unexpected roofprint acquisition")
    feature_path = Path(roofprint_manifest["localFiles"]["features"])
    if sha256_file(feature_path) != roofprint_manifest["features"]["sha256"]:
        raise ValueError("Roofprint feature checksum differs")
    feature_response = json.loads(feature_path.read_text(encoding="utf-8"))
    feature_by_id = {
        int(feature["attributes"]["OBJECTID"]): feature
        for feature in feature_response["features"]
    }

    lidar_2013_bytes, lidar_2013 = load_json(args.lidar_2013_audit)
    lidar_2020_bytes, lidar_2020 = load_json(args.lidar_2020_audit)
    if lidar_2013.get("analysisVersion") != "lidar-stadium-surface-audit-v3":
        raise ValueError("Unexpected 2013 LiDAR audit")
    if lidar_2020.get("analysisVersion") != "usgs-stadium-surface-audit-v2":
        raise ValueError("Unexpected 2020 LiDAR audit")

    picnic_page_bytes, picnic_page, picnic_html = validate_page_manifest(
        args.picnic_page_manifest,
        "official-mlb-page-acquisition",
    )
    guide_page_bytes, guide_page, guide_html = validate_page_manifest(
        args.guide_page_manifest,
        "official-mlb-page-acquisition",
    )
    for required in [
        "Coors Outfield Picnic Area",
        "ggbmyuiojf4jzglld3ql",
        "v5nujjtmp0s2qxx6a1h6",
    ]:
        if required not in picnic_html:
            raise ValueError(f"Official picnic page no longer contains {required}")
    for required in ["Section 111, right-field corner, 22nd and Blake Streets", "Gate B -"]:
        if required not in guide_html:
            raise ValueError(f"Official guide no longer contains {required}")
    picnic_image_inputs = []
    for path in args.picnic_image_manifest:
        payload, image_manifest, _ = validate_page_manifest(path, "official-mlb-image-acquisition")
        picnic_image_inputs.append(input_record(path, payload, image_manifest))

    transformers = {
        "2013": Transformer.from_crs(STATE_PLANE_CRS, HISTORIC_LIDAR_CRS, always_xy=True),
        "2020": Transformer.from_crs(STATE_PLANE_CRS, POST_LIDAR_CRS, always_xy=True),
    }
    lidar_directories = {
        "2013": args.lidar_2013_audit.parent,
        "2020": args.lidar_2020_audit.parent,
    }
    lidar_artifacts = {"2013": lidar_2013, "2020": lidar_2020}
    panels = []
    candidates = []
    locked_lidar_files: dict[str, dict[str, dict[str, Any]]] = {"2013": {}, "2020": {}}
    crop_inputs: dict[str, Any] = {}
    for control in controls["candidates"]:
        object_id = int(control["objectId"])
        feature = feature_by_id.get(object_id)
        if feature is None:
            raise ValueError(f"Roofprint object {object_id} is missing")
        polygon = np.asarray(feature["geometry"]["rings"][0], dtype=np.float64)
        if not np.allclose(polygon[0], polygon[-1]):
            raise ValueError(f"Roofprint object {object_id} is not closed")
        length_feet, width_feet = minimum_area_dimensions(polygon)
        lidar_results = {}
        for epoch in ["2013", "2020"]:
            transformer = transformers[epoch]
            projected_x, projected_y = transformer.transform(polygon[:, 0], polygon[:, 1])
            projected_polygon = np.column_stack((projected_x, projected_y))
            points, source_files = local_lidar_points(
                lidar_directories[epoch],
                projected_polygon,
                lidar_artifacts[epoch]["source"]["files"],
            )
            lidar_results[epoch] = analyze_lidar_epoch(points, projected_polygon)
            for source in source_files:
                locked_lidar_files[epoch][source["path"]] = source
        change_passes = (
            lidar_results["2013"]["elevatedInsideFootprintRatio"]
            <= HISTORIC_MAXIMUM_ELEVATED_RATIO
            and lidar_results["2020"]["elevatedInsideFootprintRatio"]
            >= POST_MINIMUM_ELEVATED_RATIO
            and lidar_results["2020"]["elevatedInsideFootprintPointCount"]
            >= POST_MINIMUM_ELEVATED_RETURNS
        )
        if not change_passes:
            raise ValueError(f"LiDAR presence change gates failed for object {object_id}")

        candidate_crop_inputs = {}
        for epoch in ["2018", "2020", "2022"]:
            crop_path = Path(control["orthophotoCrops"][epoch])
            payload, crop = validate_crop(crop_path)
            candidate_crop_inputs[epoch] = input_record(crop_path, payload, crop)
            panels.append(
                render_panel(
                    crop,
                    polygon,
                    f"{control['candidateId']} | {epoch}",
                )
            )
        crop_inputs[control["candidateId"]] = candidate_crop_inputs
        attributes = feature["attributes"]
        candidates.append(
            {
                "candidateId": control["candidateId"],
                "permitLocation": control["permitLocation"],
                "objectId": object_id,
                "buildingId": int(attributes["Building_ID"]),
                "currentRoofprint": {
                    "coordinateReferenceSystem": "EPSG:6428",
                    "polygonProjectedFeet": polygon.tolist(),
                    "areaSquareFeet": float(attributes["SHAPE.STArea()"]),
                    "minimumAreaRectangleLengthFeet": length_feet,
                    "minimumAreaRectangleWidthFeet": width_feet,
                    "reportedMaximumHeightFeet": float(attributes["Bldg_Height"]),
                    "reportedGroundElevationFeet": float(attributes["Ground_Elevation"]),
                    "source": attributes.get("Source"),
                    "updateStatus": attributes.get("Update_Status"),
                    "createDateMilliseconds": int(attributes["CreateDate"]),
                },
                "manualOrthophotoReview": control["review"],
                "lidarPresenceChange": {
                    "acceptedForCandidateIdentity": change_passes,
                    "gates": {
                        "historicMaximumElevatedRatio": HISTORIC_MAXIMUM_ELEVATED_RATIO,
                        "postMinimumElevatedRatio": POST_MINIMUM_ELEVATED_RATIO,
                        "postMinimumElevatedReturns": POST_MINIMUM_ELEVATED_RETURNS,
                    },
                    "historic2013": lidar_results["2013"],
                    "postConstruction2020": lidar_results["2020"],
                },
                "geometryBoundary": {
                    "establishesCurrentRoofEaveCandidate": True,
                    "establishesTopSurfaceHeightCandidate": True,
                    "establishesOverhangUnderside": False,
                    "establishesSubFootAbsoluteHorizontalAccuracy": False,
                    "establishesExactPermitPlanMatch": False,
                    "note": "The current roofprint and post-construction LiDAR prove an elevated footprint candidate, but not its underside or release-grade absolute position.",
                },
            }
        )

    if len(panels) != 6:
        raise ValueError("Expected six orthophoto review panels")
    first_row = np.hstack(panels[:3])
    second_row = np.hstack(panels[3:])
    overlay = np.vstack((first_row, second_row))
    args.output_overlay.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_overlay), overlay):
        raise ValueError("Could not write review overlay")

    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": "rockies",
        "inputs": {
            "permitDetail": input_record(args.permit_detail, permit_bytes, permit),
            "reviewControls": input_record(args.review_controls, controls_bytes, controls),
            "roofprints": input_record(args.roofprint_manifest, roofprint_bytes, roofprint_manifest),
            "lidar2013": input_record(args.lidar_2013_audit, lidar_2013_bytes, lidar_2013),
            "lidar2020": input_record(args.lidar_2020_audit, lidar_2020_bytes, lidar_2020),
            "lidarFiles": {
                epoch: list(records.values())
                for epoch, records in locked_lidar_files.items()
            },
            "officialPicnicPage": input_record(args.picnic_page_manifest, picnic_page_bytes, picnic_page),
            "officialBallparkGuide": input_record(args.guide_page_manifest, guide_page_bytes, guide_page),
            "officialPicnicImages": picnic_image_inputs,
            "orthophotoCrops": crop_inputs,
        },
        "permitScope": {
            "recordNumber": controls["permitRecordNumber"],
            "scopeText": controls["permitScopeText"],
            "structureCount": 2,
            "namedLocations": ["Entrance B", "Picnic area"],
        },
        "candidates": candidates,
        "reviewOverlay": {
            "path": str(args.output_overlay.resolve()),
            "sha256": sha256_file(args.output_overlay),
            "panelOrder": [
                f"{candidate['candidateId']}:{epoch}"
                for candidate in candidates
                for epoch in ["2018", "2020", "2022"]
            ],
            "legend": "Red polygon is the current DRCOG roof eave candidate. Yellow rectangle is its panel bounding box.",
        },
        "changeValidation": {
            "allCandidatesPassPresenceChangeGates": all(
                candidate["lidarPresenceChange"]["acceptedForCandidateIdentity"]
                for candidate in candidates
            ),
            "historicEpoch": "2013-11-03 USGS LiDAR and 2018-03-11/17 DRCOG orthophoto",
            "postConstructionEpoch": "2020-05-03 DRCOG orthophoto and 2020-05-27 USGS LiDAR",
            "currentCorroborationEpoch": "2022 DRCOG orthophoto, 2024 DRCOG roofprints, and current official Rockies imagery retrieved 2026-08-11",
            "interpretation": "Two permanent elevated footprints appear after the historic epochs at the two named permit locations. Attribution remains an inference because the public permit plan is unavailable.",
        },
        "publication": {
            "eligibleForExactRowShade": False,
            "blockers": [
                "PERMIT_SITE_PLAN_NOT_PUBLICLY_AVAILABLE",
                "ROOFPRINT_HORIZONTAL_ACCURACY_NOT_VERIFIED_AT_95_PERCENT",
                "LIDAR_TO_ABSOLUTE_FRAME_UNCERTAINTY_NOT_BELOW_ONE_FOOT",
                "OVERHANG_UNDERSIDES_NOT_MEASURED",
                "SEATING_ROW_GEOMETRY_NOT_MEASURED",
                "INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED",
            ],
        },
    }
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "rockies-2019-shade-structure-change-audit",
        "artifactVersion": "sha256:" + stable_sha256(stable),
        **stable,
    }
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "outputJson": str(args.output_json.resolve()),
        "outputOverlay": str(args.output_overlay.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "candidateCount": len(candidates),
        "allPresenceChangeGatesPass": artifact["changeValidation"]["allCandidatesPassPresenceChangeGates"],
        "publicationEligible": artifact["publication"]["eligibleForExactRowShade"],
    }, indent=2))


if __name__ == "__main__":
    main()
