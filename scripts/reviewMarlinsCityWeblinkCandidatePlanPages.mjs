#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]),
    );
  }
  return value;
}

const acquisitionPath = path.resolve(option(
  'acquisition',
  'tmp/lidar/marlins-city-weblink-candidate-plan-pages-1464301-2026/manifest.json',
));
const outputPath = path.resolve(option(
  'output',
  'tmp/lidar/marlins-city-weblink-candidate-plan-pages-1464301-2026/review.json',
));
const acquisitionBytes = await readFile(acquisitionPath);
const acquisition = JSON.parse(acquisitionBytes.toString('utf8'));
if (
  acquisition.artifactKind !== 'marlins-city-weblink-candidate-plan-page-acquisition'
  || acquisition.source?.entryId !== 1464301
  || acquisition.source?.pageCount !== 253
  || acquisition.acquisitionSummary?.exportedPageCount !== 47
) {
  throw new Error('Unexpected City candidate-plan acquisition');
}

const renderDefinitions = [
  {
    sourcePage: 31,
    path: 'tmp/lidar/marlins-city-weblink-candidate-plan-pages-1464301-2026/rendered/original-page-031.png',
    finding: 'Regional study-area map labels Marlins Park outside the circled Overtown study area.',
  },
  {
    sourcePage: 85,
    path: 'tmp/lidar/marlins-city-weblink-candidate-plan-pages-1464301-2026/rendered/original-pages-085-086-04.png',
    finding: 'Cover identifies Overtown CRA Quadplex at 244 NW 16th Street and a December 16, 2016 permit submission.',
  },
  {
    sourcePage: 86,
    path: 'tmp/lidar/marlins-city-weblink-candidate-plan-pages-1464301-2026/rendered/original-pages-085-086-05.png',
    finding: 'Drawing index identifies multi-family housing scope and the same 244 NW 16th Street location.',
  },
];
const renderedPages = [];
for (const definition of renderDefinitions) {
  const resolvedPath = path.resolve(definition.path);
  const bytes = await readFile(resolvedPath);
  renderedPages.push({
    ...definition,
    path: path.relative(process.cwd(), resolvedPath),
    sha256: sha256(bytes),
    byteLength: bytes.length,
  });
}

const stable = {
  analysisVersion: 'marlins-city-weblink-candidate-plan-page-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    acquisition: {
      path: path.relative(process.cwd(), acquisitionPath),
      sha256: sha256(acquisitionBytes),
      artifactVersion: acquisition.artifactVersion,
    },
    renderedPages,
  },
  reviewScope: {
    sourceDocumentPageCount: 253,
    exportedPageCount: 47,
    textLayerReviewedAcrossExportedPages: true,
    fullResolutionVisualPageCount: renderedPages.length,
    fullSourceDocumentVisualReviewComplete: false,
    purpose: 'Resolve whether the construction-plan keyword hit is loanDepot Park stadium work.',
  },
  findings: {
    projectName: 'Overtown CRA Quadplex',
    projectAddress: '244 NW 16th Street, Miami, Florida 33136',
    projectType: 'multi-family housing',
    permitSubmissionDate: '2016-12-16',
    marlinsParkReferenceRole: 'regional map label outside the Overtown study area',
    stadiumProject: false,
    stadiumSeatingGeometryPresent: false,
    stadiumObstructionGeometryPresent: false,
    stadiumRoofGeometryPresent: false,
    currentStadiumGeometryEstablished: false,
  },
  evidenceBoundary: {
    establishesCandidateIsUnrelatedToStadiumGeometry: true,
    establishesComplete253PageReview: false,
    establishesAnyLoanDepotParkMetricGeometry: false,
    establishesAnyCurrentAsBuiltGeometry: false,
  },
  assessment: {
    excludeFromStadiumGeometryCandidateQueue: true,
    publicationEligible: false,
    reason: 'The decisive cover, index, address, project classification, and regional context establish a separate Overtown housing project.',
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-candidate-plan-page-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  findings: artifact.findings,
  evidenceBoundary: artifact.evidenceBoundary,
  assessment: artifact.assessment,
}, null, 2));
