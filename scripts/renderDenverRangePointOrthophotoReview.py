#!/usr/bin/env python3
"""Render official Denver range-point positions on a DRCOG orthophoto.

The reticles show survey coordinates only. A reviewer must identify an actual
range box or monument before the point can become a registration control.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


ANALYSIS_VERSION = "denver-range-point-orthophoto-review-queue-v1"


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


def source_pixel_from_world(
    x: float,
    y: float,
    world_values: list[float],
) -> tuple[float, float]:
    pixel_width, row_rotation, column_rotation, pixel_height, origin_x, origin_y = (
        float(value) for value in world_values
    )
    if row_rotation != 0 or column_rotation != 0:
        raise ValueError("Rotated world files are not supported")
    if pixel_width <= 0 or pixel_height >= 0:
        raise ValueError("Orthophoto must be north-up")
    return (x - origin_x) / pixel_width, (y - origin_y) / pixel_height


def draw_reticle(
    image: Image.Image,
    center_x: float,
    center_y: float,
    scale: int,
    gap_source_pixels: int,
) -> Image.Image:
    review = image.resize(
        (image.width * scale, image.height * scale),
        Image.Resampling.NEAREST,
    )
    draw = ImageDraw.Draw(review)
    x = center_x * scale
    y = center_y * scale
    gap = gap_source_pixels * scale
    colour = (255, 0, 200)
    width = max(2, scale // 2)
    draw.line((x, 0, x, max(0, y - gap)), fill=colour, width=width)
    draw.line((x, min(review.height - 1, y + gap), x, review.height - 1), fill=colour, width=width)
    draw.line((0, y, max(0, x - gap), y), fill=colour, width=width)
    draw.line((min(review.width - 1, x + gap), y, review.width - 1, y), fill=colour, width=width)
    return review


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--range-manifest", type=Path, required=True)
    parser.add_argument("--orthophoto-manifest", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--half-size-feet", type=float, default=15.0)
    parser.add_argument("--scale", type=int, default=6)
    parser.add_argument("--reticle-gap-pixels", type=int, default=5)
    args = parser.parse_args()
    if args.half_size_feet <= 0 or args.scale <= 0 or args.reticle_gap_pixels < 0:
        raise ValueError("Review dimensions and scale must be valid")

    range_manifest_bytes = args.range_manifest.read_bytes()
    range_manifest = json.loads(range_manifest_bytes)
    if range_manifest.get("artifactKind") != "denver-gps-range-point-acquisition":
        raise ValueError("Range manifest has the wrong artifact kind")
    if range_manifest.get("query", {}).get("outputCoordinateReferenceSystem") != "EPSG:6428":
        raise ValueError("Range points are not in the orthophoto CRS")
    feature_path = Path(range_manifest["localFiles"]["features"])
    feature_hash = sha256_file(feature_path)
    if feature_hash != range_manifest["requests"]["features"]["sha256"]:
        raise ValueError("Range-point feature response hash mismatch")
    feature_response = json.loads(feature_path.read_bytes())

    orthophoto_manifest_bytes = args.orthophoto_manifest.read_bytes()
    orthophoto_manifest = json.loads(orthophoto_manifest_bytes)
    if orthophoto_manifest.get("artifactKind") != "drcog-orthophoto-tile-acquisition":
        raise ValueError("Orthophoto manifest has the wrong artifact kind")
    world_values = orthophoto_manifest.get("worldFile", {}).get("values")
    if not isinstance(world_values, list) or len(world_values) != 6:
        raise ValueError("Orthophoto manifest lacks a six-value world file")
    pixel_width = float(world_values[0])
    pixel_height = float(world_values[3])
    if not math.isclose(pixel_width, -pixel_height, rel_tol=0, abs_tol=1e-12):
        raise ValueError("Orthophoto pixels must be square")
    orthophoto_path = Path(orthophoto_manifest["localFiles"]["orthophoto"])
    orthophoto_hash = sha256_file(orthophoto_path)
    if orthophoto_hash != orthophoto_manifest["orthophoto"]["sha256"]:
        raise ValueError("Orthophoto hash mismatch")

    features = feature_response.get("features", [])
    object_id_field = range_manifest["objectIdField"]
    half_pixels = math.ceil(args.half_size_feet / pixel_width)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    review_records: list[dict[str, Any]] = []
    Image.MAX_IMAGE_PIXELS = None
    with Image.open(orthophoto_path) as source_image:
        for feature in features:
            object_id = feature["attributes"][object_id_field]
            x = float(feature["geometry"]["x"])
            y = float(feature["geometry"]["y"])
            source_x, source_y = source_pixel_from_world(x, y, world_values)
            nearest_x = int(round(source_x))
            nearest_y = int(round(source_y))
            left = nearest_x - half_pixels
            top = nearest_y - half_pixels
            right = nearest_x + half_pixels + 1
            bottom = nearest_y + half_pixels + 1
            inside = (
                left >= 0
                and top >= 0
                and right <= source_image.width
                and bottom <= source_image.height
            )
            record: dict[str, Any] = {
                "objectId": object_id,
                "attributes": feature["attributes"],
                "surveyCoordinateProjectedFeet": [x, y],
                "sourcePixelCoordinate": [source_x, source_y],
                "insideOrthophoto": inside,
            }
            if inside:
                chip = source_image.crop((left, top, right, bottom)).convert("RGB")
                local_x = source_x - left
                local_y = source_y - top
                review = draw_reticle(
                    chip,
                    local_x,
                    local_y,
                    args.scale,
                    args.reticle_gap_pixels,
                )
                native_path = args.output_dir / f"range-point-{object_id}-native.png"
                review_path = args.output_dir / f"range-point-{object_id}-review.png"
                chip.save(native_path, format="PNG", optimize=True)
                review.save(review_path, format="PNG", optimize=True)
                record.update({
                    "cropPixelWindow": {
                        "left": left,
                        "top": top,
                        "right": right,
                        "bottom": bottom,
                    },
                    "surveyCoordinateChipPixel": [local_x, local_y],
                    "nativeImage": {
                        "path": str(native_path.resolve()),
                        "sha256": sha256_file(native_path),
                    },
                    "reviewImage": {
                        "path": str(review_path.resolve()),
                        "sha256": sha256_file(review_path),
                    },
                })
            review_records.append(record)

    visible_candidates = [record for record in review_records if record["insideOrthophoto"]]
    tile_blocker = "NO_RANGE_POINTS_INSIDE_ORTHOPHOTO" if not visible_candidates else None
    stable = {
        "analysisVersion": ANALYSIS_VERSION,
        "stadiumId": range_manifest.get("stadiumId"),
        "source": {
            "rangeManifestPath": str(args.range_manifest.resolve()),
            "rangeManifestSha256": hashlib.sha256(range_manifest_bytes).hexdigest(),
            "rangeArtifactVersion": range_manifest.get("artifactVersion"),
            "featureResponsePath": str(feature_path.resolve()),
            "featureResponseSha256": feature_hash,
            "orthophotoManifestPath": str(args.orthophoto_manifest.resolve()),
            "orthophotoManifestSha256": hashlib.sha256(orthophoto_manifest_bytes).hexdigest(),
            "orthophotoArtifactVersion": orthophoto_manifest.get("artifactVersion"),
            "orthophotoPath": str(orthophoto_path.resolve()),
            "orthophotoSha256": orthophoto_hash,
        },
        "reviewParameters": {
            "halfSizeFeet": args.half_size_feet,
            "scale": args.scale,
            "reticleGapSourcePixels": args.reticle_gap_pixels,
            "pixelSizeFeet": [pixel_width, pixel_height],
            "worldFileValues": [float(value) for value in world_values],
            "worldFileOriginConvention": "center of upper-left pixel",
        },
        "sourceRangePointCount": len(features),
        "pointsInsideOrthophotoCount": len(visible_candidates),
        "points": review_records,
    }
    blockers = [
        "RANGE_BOX_VISIBILITY_NOT_REVIEWED",
        "RANGE_POINT_PIXEL_CORRESPONDENCES_NOT_ACCEPTED",
        "ORTHOPHOTO_CONTROL_RESIDUALS_NOT_COMPUTED",
    ]
    if tile_blocker:
        blockers.append(tile_blocker)
    artifact = {
        "schemaVersion": 1,
        "artifactKind": "denver-range-point-orthophoto-review-queue",
        "artifactVersion": f"sha256:{stable_sha256(stable)}",
        **stable,
        "geometryBoundary": {
            "establishesSurveyCoordinateReticles": True,
            "establishesVisibleMonumentCenters": False,
            "establishesOrthophotoTranslationOrRotation": False,
            "note": (
                "A reticle is a coordinate prediction, not an observed range-box center. "
                "Each correspondence requires visual acceptance with pixel uncertainty."
            ),
        },
        "publication": {"eligible": False, "blockers": blockers},
    }
    manifest_path = args.output_dir / "manifest.json"
    manifest_bytes = (json.dumps(artifact, indent=2) + "\n").encode("utf-8")
    manifest_path.write_bytes(manifest_bytes)
    review_template = {
        "schemaVersion": 1,
        "artifactKind": "denver-range-point-orthophoto-correspondence-review",
        "reviewState": "template-pending",
        "sourceReviewQueue": {
            "path": str(manifest_path.resolve()),
            "sha256": hashlib.sha256(manifest_bytes).hexdigest(),
            "artifactVersion": artifact["artifactVersion"],
        },
        "reviewProtocol": {
            "reviewerId": None,
            "completedAtUtc": None,
            "method": None,
        },
        "surveySourceAccuracyEvidence": None,
        "points": [
            {
                "objectId": record["objectId"],
                "acceptedForRegistration": None,
                "rejectionReason": "PENDING_VISUAL_REVIEW",
                "observedSourcePixelCoordinate": None,
                "pixelCenterUncertainty95Pixels": None,
                "visibleFeatureKind": None,
                "evidenceNote": None,
                "surveyCoordinateReticleSourcePixel": record["sourcePixelCoordinate"],
                "nativeImage": record.get("nativeImage"),
                "reviewImage": record.get("reviewImage"),
            }
            for record in visible_candidates
        ],
        "instructions": [
            "Set reviewState to completed only after every included point has an explicit decision.",
            "A survey-coordinate reticle is not an observed monument center.",
            "Accept only a clearly identifiable range box or monument and record its source-image pixel center.",
            "Record a radial 95-percent pixel-center uncertainty for every accepted control.",
            "Rejected points require a specific rejectionReason.",
            "Leave surveySourceAccuracyEvidence null until an official numeric 95-percent source is checksum locked.",
        ],
    }
    review_template_path = args.output_dir / "correspondence-review-template.json"
    review_template_path.write_text(
        json.dumps(review_template, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "manifestPath": str(manifest_path.resolve()),
        "correspondenceReviewTemplatePath": str(review_template_path.resolve()),
        "artifactVersion": artifact["artifactVersion"],
        "sourceRangePointCount": len(features),
        "pointsInsideOrthophotoCount": len(visible_candidates),
        "publication": artifact["publication"],
    }, indent=2))


if __name__ == "__main__":
    main()
