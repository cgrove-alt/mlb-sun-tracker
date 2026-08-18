#!/usr/bin/env python3
"""Render every PDF page and labeled contact sheets for visual/OCR review."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def artifact_version(value: object) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(encoded).hexdigest()}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--scale", type=float, default=1.5)
    parser.add_argument("--sheet-columns", type=int, default=4)
    parser.add_argument("--sheet-pages", type=int, default=16)
    parser.add_argument("--sheet-thumbnail-width", type=int, default=320)
    parser.add_argument("--first-page", type=int, default=1)
    parser.add_argument("--last-page", type=int)
    arguments = parser.parse_args()
    if arguments.scale <= 0:
        raise ValueError("Render scale must be positive")
    if arguments.sheet_columns < 1 or arguments.sheet_pages < 1:
        raise ValueError("Contact-sheet dimensions must be positive")
    if arguments.sheet_thumbnail_width < 120:
        raise ValueError("Contact-sheet thumbnails must be at least 120 pixels wide")

    source_path = arguments.pdf.resolve()
    if not source_path.is_file():
        raise FileNotFoundError(source_path)
    output_directory = arguments.output_directory.resolve()
    pages_directory = output_directory / "pages"
    sheets_directory = output_directory / "sheets"
    pages_directory.mkdir(parents=True, exist_ok=True)
    sheets_directory.mkdir(parents=True, exist_ok=True)

    document = pdfium.PdfDocument(source_path)
    last_page = arguments.last_page or len(document)
    if arguments.first_page < 1 or last_page < arguments.first_page:
        raise ValueError("PDF page range is invalid")
    if last_page > len(document):
        raise ValueError("Last page exceeds the PDF page count")
    page_records: list[dict[str, object]] = []
    for page_index in range(arguments.first_page - 1, last_page):
        page_number = page_index + 1
        output_path = pages_directory / f"page-{page_number:04d}.png"
        bitmap = document[page_index].render(scale=arguments.scale)
        image = bitmap.to_pil().convert("RGB")
        image.save(output_path, format="PNG", optimize=True)
        page_records.append({
            "pageNumber": page_number,
            "path": str(output_path.relative_to(Path.cwd())),
            "width": image.width,
            "height": image.height,
            "sha256": sha256_file(output_path),
        })

    sheet_records: list[dict[str, object]] = []
    for offset in range(0, len(page_records), arguments.sheet_pages):
        selected = page_records[offset:offset + arguments.sheet_pages]
        first_path = Path(str(selected[0]["path"]))
        with Image.open(first_path) as first_image:
            aspect_ratio = first_image.height / first_image.width
        thumbnail_height = round(arguments.sheet_thumbnail_width * aspect_ratio)
        label_height = 32
        rows = math.ceil(len(selected) / arguments.sheet_columns)
        sheet = Image.new(
            "RGB",
            (
                arguments.sheet_columns * arguments.sheet_thumbnail_width,
                rows * (thumbnail_height + label_height),
            ),
            "white",
        )
        draw = ImageDraw.Draw(sheet)
        for selected_index, page_record in enumerate(selected):
            with Image.open(Path(str(page_record["path"]))) as source_image:
                thumbnail = source_image.convert("RGB").resize(
                    (arguments.sheet_thumbnail_width, thumbnail_height),
                    Image.Resampling.LANCZOS,
                )
            column = selected_index % arguments.sheet_columns
            row = selected_index // arguments.sheet_columns
            x_value = column * arguments.sheet_thumbnail_width
            y_value = row * (thumbnail_height + label_height)
            sheet.paste(thumbnail, (x_value, y_value + label_height))
            draw.text(
                (x_value + 8, y_value + 9),
                f"page {page_record['pageNumber']}",
                fill="black",
            )
        first_page = int(selected[0]["pageNumber"])
        last_page = int(selected[-1]["pageNumber"])
        sheet_path = sheets_directory / f"pages-{first_page:04d}-{last_page:04d}.png"
        sheet.save(sheet_path, format="PNG", optimize=True)
        sheet_records.append({
            "firstPage": first_page,
            "lastPage": last_page,
            "path": str(sheet_path.relative_to(Path.cwd())),
            "sha256": sha256_file(sheet_path),
        })

    stable = {
        "source": {
            "path": str(source_path.relative_to(Path.cwd())),
            "sha256": sha256_file(source_path),
        },
        "renderScale": arguments.scale,
        "sourcePageCount": len(document),
        "renderedPageRange": [arguments.first_page, last_page],
        "pageCount": len(page_records),
        "pages": page_records,
        "contactSheets": sheet_records,
        "publicationEligible": False,
        "note": "Rendered review images are derivative discovery aids, not measured geometry.",
    }
    artifact = {
        "schemaVersion": 1,
        "analysisVersion": "pdf-review-render-v1",
        "artifactVersion": artifact_version(stable),
        **stable,
    }
    manifest_path = output_directory / "manifest.json"
    manifest_path.write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "manifest": str(manifest_path),
        "artifactVersion": artifact["artifactVersion"],
        "pageCount": artifact["pageCount"],
        "contactSheetCount": len(sheet_records),
    }, indent=2))


if __name__ == "__main__":
    main()
