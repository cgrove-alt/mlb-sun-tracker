#!/usr/bin/env python3
"""Render cross-target depth components onto current section 35 panoramas."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from validatePanoramaOverhangFrontEdge import project_provider_points


ANALYSIS_VERSION = "marlins-sec35-depth-component-review-v1"
DEFAULT_SEAT_IDS = (
    "S_SEC35-10-16",
    "S_SEC35-11wc-10",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("anchors_json", type=Path)
    parser.add_argument("anchors_npz", type=Path)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("calibration", type=Path)
    parser.add_argument("output_json", type=Path)
    parser.add_argument("output_png", type=Path)
    parser.add_argument("--seat-id", action="append", default=[])
    parser.add_argument("--minimum-component-points", type=int, default=3)
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def value_fingerprint(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def component_color(component_id: int) -> tuple[int, int, int]:
    hue = int((component_id * 47) % 180)
    hsv = np.asarray([[[hue, 230, 255]]], dtype=np.uint8)
    bgr = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)[0, 0]
    return tuple(int(value) for value in bgr)


def main() -> None:
    args = parse_args()
    anchors = json.loads(args.anchors_json.read_text())
    manifest = json.loads(args.manifest.read_text())
    calibration = json.loads(args.calibration.read_text())
    if not anchors["assessment"].get(
        "crossTargetProviderModelDepthAnchorCandidateEligible"
    ):
        raise ValueError("Cross-target anchors are not candidate eligible")
    if anchors["geometry"]["npzSha256"] != file_sha256(args.anchors_npz):
        raise ValueError("Anchor NPZ checksum mismatch")
    if not calibration["assessment"].get("measurementEligible"):
        raise ValueError("Panorama calibration is not measurement eligible")
    with np.load(args.anchors_npz, allow_pickle=False) as arrays:
        points = arrays["provider_points_metres"]
        component_ids = arrays["connected_component_id"]
    component_counts = np.bincount(component_ids)
    keep = component_counts[component_ids] >= args.minimum_component_points
    points = points[keep]
    component_ids = component_ids[keep]
    seat_ids = tuple(args.seat_id) if args.seat_id else DEFAULT_SEAT_IDS
    entries = {entry["seatId"]: entry for entry in manifest["images"]}
    missing = sorted(set(seat_ids) - set(entries))
    if missing:
        raise ValueError(f"Manifest is missing requested seats: {missing}")
    provider_to_panorama = np.asarray(
        calibration["rotation"]["providerVectorToPanoramaVector"],
        dtype=float,
    )
    panels = []
    projection_records = []
    for seat_id in seat_ids:
        entry = entries[seat_id]
        image_path = Path(entry["localPath"])
        actual_sha256 = file_sha256(image_path)
        if entry.get("imageSha256") not in (None, actual_sha256):
            raise ValueError(f"Panorama checksum mismatch for {seat_id}")
        source = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
        if source is None:
            raise ValueError(f"Could not load {image_path}")
        height, width = source.shape[:2]
        pixels = project_provider_points(
            points,
            np.asarray(entry["config"]["p"], dtype=float),
            provider_to_panorama,
            float(entry["config"]["rp"][1]),
            width,
            height,
        )
        for point, component_id, pixel in zip(points, component_ids, pixels):
            color = component_color(int(component_id))
            cv2.circle(
                source,
                tuple(np.round(pixel).astype(int)),
                11,
                color,
                4,
                cv2.LINE_AA,
            )
        for component_id in sorted(set(component_ids.tolist())):
            selected = pixels[component_ids == component_id]
            center = np.median(selected, axis=0)
            cv2.putText(
                source,
                str(component_id),
                tuple(np.round(center).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX,
                2.0,
                component_color(int(component_id)),
                6,
                cv2.LINE_AA,
            )
        cv2.putText(
            source,
            f"{seat_id}: component ids, minimum {args.minimum_component_points} anchors",
            (30, 75),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.7,
            (0, 255, 255),
            5,
            cv2.LINE_AA,
        )
        panels.append(cv2.resize(source, (2048, 1024), interpolation=cv2.INTER_AREA))
        projection_records.append({
            "seatId": seat_id,
            "imagePath": str(image_path),
            "imageSha256": actual_sha256,
            "projectedPointCount": int(points.shape[0]),
        })
    diagnostic = np.vstack(panels)
    args.output_png.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(args.output_png), diagnostic):
        raise ValueError(f"Could not write {args.output_png}")
    stable = {
        "anchorsJsonSha256": file_sha256(args.anchors_json),
        "anchorsNpzSha256": file_sha256(args.anchors_npz),
        "manifestSha256": file_sha256(args.manifest),
        "calibrationSha256": file_sha256(args.calibration),
        "projectionRecords": projection_records,
        "outputPngSha256": file_sha256(args.output_png),
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": ANALYSIS_VERSION,
        "artifactStage": "current-provider-depth-component-semantic-review",
        "artifactVersion": f"sha256:{value_fingerprint(stable)}",
        "inputs": {
            "anchorsJson": {
                "path": str(args.anchors_json),
                "sha256": stable["anchorsJsonSha256"],
                "artifactVersion": anchors["artifactVersion"],
            },
            "anchorsNpz": {
                "path": str(args.anchors_npz),
                "sha256": stable["anchorsNpzSha256"],
            },
            "manifest": {
                "path": str(args.manifest),
                "sha256": stable["manifestSha256"],
            },
            "calibration": {
                "path": str(args.calibration),
                "sha256": stable["calibrationSha256"],
                "artifactVersion": calibration["artifactVersion"],
            },
            "panoramas": projection_records,
        },
        "parameters": {
            "minimumComponentPointCount": args.minimum_component_points,
        },
        "reviewScope": {
            "projectedAnchorCount": int(points.shape[0]),
            "componentIds": sorted(set(component_ids.tolist())),
            "seatIds": list(seat_ids),
        },
        "outputPng": {
            "path": str(args.output_png),
            "sha256": stable["outputPngSha256"],
        },
        "assessment": {
            "semanticReviewEligible": True,
            "publicationEligible": False,
            "blockers": [
                "COMPONENTS_REQUIRE_REVIEWED_SURFACE_LABELS",
                "COMPONENTS_DO_NOT_FORM_CLOSED_OCCLUDER_VOLUMES",
            ],
        },
    }
    args.output_json.write_text(json.dumps(artifact, indent=2) + "\n")
    print(json.dumps({
        "outputJson": str(args.output_json),
        "outputPng": str(args.output_png),
        "projectedAnchorCount": int(points.shape[0]),
        "componentIds": sorted(set(component_ids.tolist())),
        "artifactVersion": artifact["artifactVersion"],
    }, indent=2))


if __name__ == "__main__":
    main()
