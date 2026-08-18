#!/usr/bin/env python3
"""Acquire official Denver GPS range points near one stadium.

The output is an immutable discovery artifact. Denver describes the coordinates
as established by GPS observation, but the public service does not state a
numeric 95-percent accuracy. The artifact therefore cannot establish a release
frame until visible orthophoto correspondences are reviewed and residuals pass.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ANALYSIS_VERSION = "denver-gps-range-point-acquisition-v1"
ITEM_ID = "6f0b0beed633401d9226e32eaff943bb"
SERVICE_ROOT = (
    "https://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/"
    "ODC_ENG_SRVRANGEPOINT_P/FeatureServer"
)
LAYER_ID = 51
LAYER_URL = f"{SERVICE_ROOT}/{LAYER_ID}"
ITEM_URL = f"https://www.arcgis.com/sharing/rest/content/items/{ITEM_ID}"
DENVER_SURVEY_CONTROL_URL = (
    "https://www.denvergov.org/Government/Agencies-Departments-Offices/"
    "Agencies-Departments-Offices-Directory/Department-of-Transportation-and-"
    "Infrastructure/Programs-Services/Right-of-Way-Survey/Survey-Control"
)
OUTPUT_CRS = 6428
EXPECTED_SOURCE_CRS = 2877


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


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


def build_url(base: str, parameters: dict[str, str]) -> str:
    return f"{base}?{urlencode(parameters)}"


def spatial_query_parameters(
    center_x: float,
    center_y: float,
    half_width_feet: float,
    half_height_feet: float,
) -> dict[str, str]:
    bounds = (
        center_x - half_width_feet,
        center_y - half_height_feet,
        center_x + half_width_feet,
        center_y + half_height_feet,
    )
    return {
        "where": "1=1",
        "geometry": ",".join(f"{value:.6f}" for value in bounds),
        "geometryType": "esriGeometryEnvelope",
        "inSR": str(OUTPUT_CRS),
        "spatialRel": "esriSpatialRelIntersects",
    }


def fetch_bytes(url: str) -> tuple[bytes, dict[str, str | int | None]]:
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "mlb-sun-tracker-range-control-audit/1.0",
        },
    )
    with urlopen(request, timeout=60) as response:
        value = response.read()
        metadata: dict[str, str | int | None] = {
            "requestedUrl": url,
            "resolvedUrl": response.geturl(),
            "status": response.status,
            "contentType": response.headers.get("Content-Type"),
            "contentLength": response.headers.get("Content-Length"),
            "etag": response.headers.get("ETag"),
            "lastModified": response.headers.get("Last-Modified"),
        }
    return value, metadata


def parse_arcgis_json(value: bytes, source_name: str) -> dict[str, Any]:
    try:
        payload = json.loads(value)
    except json.JSONDecodeError as error:
        raise ValueError(f"{source_name} did not return JSON") from error
    if not isinstance(payload, dict):
        raise ValueError(f"{source_name} did not return a JSON object")
    if payload.get("error"):
        raise ValueError(f"{source_name} returned ArcGIS error {payload['error']}")
    return payload


def validate_service(service: dict[str, Any]) -> None:
    description = str(service.get("serviceDescription", ""))
    if "established by GPS" not in description:
        raise ValueError("Denver service no longer states that coordinates use GPS")
    if service.get("spatialReference", {}).get("latestWkid") != EXPECTED_SOURCE_CRS:
        if service.get("spatialReference", {}).get("wkid") != EXPECTED_SOURCE_CRS:
            raise ValueError("Unexpected Denver range-point source CRS")
    layers = service.get("layers", [])
    if not any(
        layer.get("id") == LAYER_ID
        and layer.get("geometryType") == "esriGeometryPoint"
        for layer in layers
    ):
        raise ValueError("Expected Denver point layer is missing")


def validate_layer(layer: dict[str, Any]) -> str:
    if layer.get("id") != LAYER_ID:
        raise ValueError("Unexpected Denver range-point layer ID")
    if layer.get("geometryType") != "esriGeometryPoint":
        raise ValueError("Denver range-point layer is not a point layer")
    object_id_fields = [
        field.get("name")
        for field in layer.get("fields", [])
        if field.get("type") == "esriFieldTypeOID"
    ]
    if len(object_id_fields) != 1 or not isinstance(object_id_fields[0], str):
        raise ValueError("Denver range-point layer lacks one object ID field")
    return object_id_fields[0]


def validate_features(
    response: dict[str, Any],
    object_id_field: str,
    expected_count: int,
) -> list[dict[str, Any]]:
    features = response.get("features")
    if not isinstance(features, list) or len(features) != expected_count:
        raise ValueError("Denver range-point feature count does not match count query")
    response_crs = response.get("spatialReference", {})
    if response_crs.get("latestWkid") != OUTPUT_CRS and response_crs.get("wkid") != OUTPUT_CRS:
        raise ValueError("Denver range points were not returned in EPSG:6428")
    seen_ids: set[int] = set()
    for feature in features:
        object_id = feature.get("attributes", {}).get(object_id_field)
        x = feature.get("geometry", {}).get("x")
        y = feature.get("geometry", {}).get("y")
        if not isinstance(object_id, int) or object_id in seen_ids:
            raise ValueError(f"Invalid or duplicate range-point object ID: {object_id}")
        if not all(isinstance(value, (int, float)) and math.isfinite(value) for value in (x, y)):
            raise ValueError(f"Range point {object_id} lacks finite coordinates")
        seen_ids.add(object_id)
    return features


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--stadium-id", required=True)
    parser.add_argument("--center-x", type=float, required=True)
    parser.add_argument("--center-y", type=float, required=True)
    parser.add_argument("--half-width-feet", type=float, required=True)
    parser.add_argument("--half-height-feet", type=float, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    numeric = (
        args.center_x,
        args.center_y,
        args.half_width_feet,
        args.half_height_feet,
    )
    if not all(math.isfinite(value) for value in numeric):
        raise ValueError("Coordinates and dimensions must be finite")
    if args.half_width_feet <= 0 or args.half_height_feet <= 0:
        raise ValueError("Query half-dimensions must be positive")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    request_specs = {
        "item": build_url(ITEM_URL, {"f": "pjson"}),
        "service": build_url(SERVICE_ROOT, {"f": "pjson"}),
        "layer": build_url(LAYER_URL, {"f": "pjson"}),
    }
    raw: dict[str, bytes] = {}
    request_metadata: dict[str, dict[str, str | int | None]] = {}
    parsed: dict[str, dict[str, Any]] = {}
    for name, url in request_specs.items():
        raw[name], request_metadata[name] = fetch_bytes(url)
        parsed[name] = parse_arcgis_json(raw[name], name)

    item = parsed["item"]
    if item.get("id") != ITEM_ID or item.get("type") != "Feature Service":
        raise ValueError("Unexpected ArcGIS item identity or type")
    validate_service(parsed["service"])
    object_id_field = validate_layer(parsed["layer"])

    spatial_parameters = spatial_query_parameters(
        args.center_x,
        args.center_y,
        args.half_width_feet,
        args.half_height_feet,
    )
    count_url = build_url(
        f"{LAYER_URL}/query",
        {**spatial_parameters, "returnCountOnly": "true", "f": "pjson"},
    )
    raw["count"], request_metadata["count"] = fetch_bytes(count_url)
    count_response = parse_arcgis_json(raw["count"], "count")
    count = count_response.get("count")
    if not isinstance(count, int) or count < 0:
        raise ValueError("Denver range-point count response is invalid")
    maximum_record_count = int(parsed["layer"].get("maxRecordCount", 0))
    if count > maximum_record_count:
        raise ValueError("Range-point result exceeds the layer record limit")

    feature_url = build_url(
        f"{LAYER_URL}/query",
        {
            **spatial_parameters,
            "outFields": "*",
            "returnGeometry": "true",
            "outSR": str(OUTPUT_CRS),
            "orderByFields": f"{object_id_field} ASC",
            "resultRecordCount": str(maximum_record_count),
            "f": "pjson",
        },
    )
    raw["features"], request_metadata["features"] = fetch_bytes(feature_url)
    feature_response = parse_arcgis_json(raw["features"], "features")
    if feature_response.get("exceededTransferLimit"):
        raise ValueError("Denver range-point response exceeded its transfer limit")
    features = validate_features(feature_response, object_id_field, count)

    local_files: dict[str, str] = {}
    for name, value in raw.items():
        path = args.output_dir / f"{name}.json"
        path.write_bytes(value)
        local_files[name] = str(path.resolve())

    bounds = {
        "minimumX": args.center_x - args.half_width_feet,
        "minimumY": args.center_y - args.half_height_feet,
        "maximumX": args.center_x + args.half_width_feet,
        "maximumY": args.center_y + args.half_height_feet,
    }
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": args.stadium_id,
        "source": {
            "itemId": ITEM_ID,
            "itemTitle": item.get("title"),
            "itemOwner": item.get("owner"),
            "itemOrganisationId": item.get("orgId"),
            "itemCreatedEpochMs": item.get("created"),
            "itemModifiedEpochMs": item.get("modified"),
            "itemAccess": item.get("access"),
            "itemUrl": f"https://www.arcgis.com/home/item.html?id={ITEM_ID}",
            "serviceUrl": SERVICE_ROOT,
            "layerUrl": LAYER_URL,
            "denverSurveyControlUrl": DENVER_SURVEY_CONTROL_URL,
            "copyrightText": parsed["service"].get("copyrightText"),
            "serviceDescription": parsed["service"].get("serviceDescription"),
            "layerDescription": parsed["layer"].get("description"),
            "layerLastEditEpochMs": parsed["layer"].get("editingInfo", {}).get("lastEditDate"),
        },
        "query": {
            "centerProjectedFeet": [args.center_x, args.center_y],
            "boundsProjectedFeet": bounds,
            "inputCoordinateReferenceSystem": f"EPSG:{OUTPUT_CRS}",
            "outputCoordinateReferenceSystem": f"EPSG:{OUTPUT_CRS}",
            "sourceCoordinateReferenceSystem": f"EPSG:{EXPECTED_SOURCE_CRS}",
        },
        "requests": {
            name: {
                **request_metadata[name],
                "sha256": sha256_bytes(raw[name]),
            }
            for name in raw
        },
        "objectIdField": object_id_field,
        "featureCount": count,
        "featureObjectIds": [
            feature["attributes"][object_id_field] for feature in features
        ],
        "localFiles": local_files,
    }
    blockers = [
        "RANGE_POINT_NUMERIC_HORIZONTAL_ACCURACY_95_UNVERIFIED",
        "RANGE_POINT_ORTHOPHOTO_CORRESPONDENCES_NOT_REVIEWED",
        "ORTHOPHOTO_CONTROL_RESIDUALS_NOT_COMPUTED",
    ]
    if count < 3:
        blockers.append("FEWER_THAN_THREE_RANGE_POINTS_IN_QUERY")
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "denver-gps-range-point-acquisition",
        "artifactVersion": f"sha256:{stable_sha256(stable)}",
        **stable,
        "geometryBoundary": {
            "establishesOfficialGpsCoordinateCandidates": True,
            "establishesNumeric95PercentHorizontalAccuracy": False,
            "establishesVisibleOrthophotoCorrespondences": False,
            "establishesOrthophotoTranslationOrRotation": False,
            "note": (
                "Denver states that range-point coordinates are established by GPS. "
                "The public service does not provide a numeric 95-percent accuracy, "
                "and acquisition alone does not prove which monuments are visible."
            ),
        },
        "publication": {"eligible": False, "blockers": blockers},
    }
    manifest_path = args.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifestPath": str(manifest_path.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "featureCount": count,
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
