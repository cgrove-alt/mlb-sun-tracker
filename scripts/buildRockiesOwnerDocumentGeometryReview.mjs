#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function argument(name, fallback) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

async function sourceFile(relativePath) {
  const bytes = await readFile(path.resolve(relativePath));
  return { relativePath, bytes, sha256: sha256(bytes) };
}

async function reviewManifest(relativePath, expectedPageCount, expectedSheetCount) {
  const source = await sourceFile(relativePath);
  const json = JSON.parse(source.bytes.toString('utf8'));
  requireCondition(json.pageCount === expectedPageCount, `Unexpected page count in ${relativePath}`);
  requireCondition(
    json.contactSheets?.length === expectedSheetCount,
    `Unexpected contact-sheet count in ${relativePath}`,
  );
  requireCondition(json.contactSheets[0]?.firstPage === 1, `${relativePath} does not start at page 1`);
  requireCondition(
    json.contactSheets.at(-1)?.lastPage === expectedPageCount,
    `${relativePath} does not cover its final page`,
  );
  const pdf = await sourceFile(json.source.path);
  requireCondition(pdf.sha256 === json.source.sha256, `Rendered source changed for ${relativePath}`);
  return { ...source, json, pdf };
}

function manifestInput(manifest) {
  return {
    path: manifest.relativePath,
    sha256: manifest.sha256,
    artifactVersion: manifest.json.artifactVersion,
  };
}

function pdfInput(manifest) {
  return {
    path: manifest.pdf.relativePath,
    sha256: manifest.pdf.sha256,
  };
}

const outputPath = path.resolve(argument(
  'output',
  'tmp/lidar/rockies-owner-document-geometry-review-2026.json',
));
const lease2017 = await reviewManifest(
  'tmp/lidar/rockies-dmmlbsd-2017-lease-review/manifest.json',
  115,
  8,
);
const lease1995 = await reviewManifest(
  'tmp/lidar/rockies-dmmlbsd-baseball-lease-review/manifest.json',
  157,
  10,
);
const westLotRfp = await reviewManifest(
  'tmp/lidar/rockies-dmmlbsd-west-lot-geotechnical-rfp-review/manifest.json',
  6,
  1,
);

const stable = {
  stadiumId: 'rockies',
  reviewScope: 'archived-official-owner-document-geometry-review',
  inputs: {
    lease2017Manifest: manifestInput(lease2017),
    lease2017Pdf: pdfInput(lease2017),
    lease1995Manifest: manifestInput(lease1995),
    lease1995Pdf: pdfInput(lease1995),
    westLotRfpManifest: manifestInput(westLotRfp),
    westLotRfpPdf: pdfInput(westLotRfp),
  },
  visualReview: {
    performedOn: '2026-08-10',
    allRenderedPagesReviewed: true,
    reviewedPageCount: 278,
    documents: [
      {
        title: '2017 User Agreement, Lease and Management Agreement',
        pageCount: 115,
        finding: 'Exhibit title sheets A through G on PDF pages 109 through 115 contain no attached map, stadium plan, or dimensioned geometry.',
      },
      {
        title: '1995 Amended and Restated Lease and Management Agreement with amendments',
        pageCount: 157,
        finding: 'The original agreement has only title sheets for its listed exhibits on PDF pages 116 through 120. Exhibit B is labeled Map but contains no map. Later amendments contain legal text, not stadium seating or obstruction plans.',
      },
      {
        title: 'West Parking Lot Phase I Environmental Site Assessment and Geotechnical Sampling RFP',
        pageCount: 6,
        finding: 'PDF page 6 contains a plan for the separate west parking lot at 1901 Wazee Street, not the Coors Field seating bowl, roof, or overhangs.',
      },
    ],
  },
  geometryRecovery: {
    stadiumParcelOrLandExhibitRecovered: false,
    stadiumMapExhibitRecovered: false,
    seatingBowlPlanRecovered: false,
    dimensionedSeatingSectionRecovered: false,
    roofOrOverhangPlanRecovered: false,
    roofOrOverhangElevationRecovered: false,
    obstructionGeometryRecovered: false,
    usefulGeometryForExactRowShadeRecovered: false,
  },
  publication: {
    eligibleForExactRowShade: false,
    reason: 'The reviewed documents do not supply stadium seating or obstruction geometry.',
  },
};
const artifact = {
  schemaVersion: 1,
  artifactStage: 'official-owner-document-geometry-review',
  analysisVersion: 'rockies-owner-document-geometry-review-v1',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  createdOn: new Date().toISOString(),
  ...stable,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  reviewedPageCount: artifact.visualReview.reviewedPageCount,
  usefulGeometryRecovered: artifact.geometryRecovery.usefulGeometryForExactRowShadeRecovered,
}, null, 2)}\n`);
