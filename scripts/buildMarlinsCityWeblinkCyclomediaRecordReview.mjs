#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback = null) {
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

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

const searchManifestPath = path.resolve(option(
  'search-manifest',
  'tmp/lidar/marlins-city-weblink-cyclomedia-records-2026/manifest.json',
));
const pageManifestPath = path.resolve(option(
  'page-manifest',
  'tmp/lidar/marlins-city-weblink-cyclomedia-matched-pages-2026/manifest.json',
));
const outputPath = path.resolve(option(
  'output',
  'tmp/lidar/marlins-city-weblink-cyclomedia-record-review-2026.json',
));

const searchManifestBytes = await readFile(searchManifestPath);
const searchManifest = JSON.parse(searchManifestBytes.toString('utf8'));
requireEqual(
  searchManifest.artifactKind,
  'marlins-city-weblink-cyclomedia-record-discovery',
  'City Cyclomedia search kind',
);
requireEqual(searchManifest.inventory?.queryCount, 5, 'exact-phrase query count');
requireEqual(searchManifest.inventory?.uniqueResultCount, 29, 'unique search-result count');

const pageManifestBytes = await readFile(pageManifestPath);
const pageManifest = JSON.parse(pageManifestBytes.toString('utf8'));
requireEqual(
  pageManifest.artifactKind,
  'marlins-city-weblink-cyclomedia-matched-page-acquisition',
  'City Cyclomedia matched-page acquisition kind',
);
requireEqual(
  pageManifest.inputs?.searchManifest?.sha256,
  sha256(searchManifestBytes),
  'matched-page locked search checksum',
);
requireEqual(pageManifest.acquisitionSummary?.documentCount, 3, 'matched document count');
requireEqual(pageManifest.acquisitionSummary?.exportedPageCount, 9, 'matched and adjacent page count');

const lockedPdfs = [];
const lockedRenderedPages = [];
for (const document of pageManifest.acquiredPages) {
  const pdfPath = path.resolve(document.inputs.pdf.path);
  const pdfBytes = await readFile(pdfPath);
  requireEqual(sha256(pdfBytes), document.inputs.pdf.sha256, `${document.entryId} PDF checksum`);
  lockedPdfs.push({
    entryId: document.entryId,
    path: path.relative(process.cwd(), pdfPath),
    sha256: sha256(pdfBytes),
    byteLength: pdfBytes.length,
    exportRange: document.exportRange,
  });
  const renderDirectory = path.join(path.dirname(pageManifestPath), 'renders', String(document.entryId));
  const renderNames = (await readdir(renderDirectory)).filter((name) => name.endsWith('.png')).sort();
  requireEqual(renderNames.length, 3, `${document.entryId} rendered page count`);
  for (const renderName of renderNames) {
    const renderPath = path.join(renderDirectory, renderName);
    const renderBytes = await readFile(renderPath);
    lockedRenderedPages.push({
      entryId: document.entryId,
      path: path.relative(process.cwd(), renderPath),
      sha256: sha256(renderBytes),
      byteLength: renderBytes.length,
    });
  }
}

const relevantSearchResults = searchManifest.uniqueResults.filter((record) => (
  record.matchedQueries.includes('CycloMedia')
  || record.matchedQueries.includes('CycloMedia Technology')
));
requireEqual(relevantSearchResults.length, 3, 'Cyclomedia-named result count');
requireEqual(
  relevantSearchResults.every((record) => record.name === 'Back-Up Documents'),
  true,
  'Cyclomedia-named result titles',
);

const visualReviews = [
  {
    entryId: 1416380,
    officialRecordDescription: 'Authorize Access - Miami Dade County Catering Contract',
    matchedPrintedPage: '19/72',
    observation: 'CycloMedia appears as one alphabetical vendor entry in a BidSync bid-notification report.',
    cyclomediaContractPresent: false,
    imagerySpecificationPresent: false,
    calibrationOrAccuracyReportPresent: false,
    accessAgreementPresent: false,
  },
  {
    entryId: 1436539,
    officialRecordDescription: 'Piggyback - MDC Pre-Qualification Pool Contract - Park Op. Items',
    matchedPrintedPage: '154',
    observation: 'CycloMedia appears as one alphabetical vendor entry in a Miami-Dade County supplier-notification report.',
    cyclomediaContractPresent: false,
    imagerySpecificationPresent: false,
    calibrationOrAccuracyReportPresent: false,
    accessAgreementPresent: false,
  },
  {
    entryId: 1454990,
    officialRecordDescription: 'Authorize Access - MDC Invitation to Bid - Animal Food',
    matchedPrintedPage: '77',
    observation: 'CycloMedia and CycloMedia Technology appear as alphabetical vendor entries in a Miami-Dade County supplier-notification report.',
    cyclomediaContractPresent: false,
    imagerySpecificationPresent: false,
    calibrationOrAccuracyReportPresent: false,
    accessAgreementPresent: false,
  },
].map((review) => ({
  ...review,
  status: 'complete',
  renderedInputs: lockedRenderedPages.filter((record) => record.entryId === review.entryId),
}));

const stable = {
  analysisVersion: 'marlins-city-weblink-cyclomedia-record-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    searchManifest: {
      path: path.relative(process.cwd(), searchManifestPath),
      sha256: sha256(searchManifestBytes),
      artifactVersion: searchManifest.artifactVersion,
    },
    matchedPageManifest: {
      path: path.relative(process.cwd(), pageManifestPath),
      sha256: sha256(pageManifestBytes),
      artifactVersion: pageManifest.artifactVersion,
    },
    lockedPdfs,
    lockedRenderedPages,
  },
  reviewScope: {
    exactPhraseQueryCount: searchManifest.inventory.queryCount,
    uniqueSearchResultCount: searchManifest.inventory.uniqueResultCount,
    cyclomediaNamedResultCount: relevantSearchResults.length,
    reviewedDocumentCount: visualReviews.length,
    reviewedMatchedAndAdjacentPageCount: lockedRenderedPages.length,
    allRenderedPagesVisuallyReviewed: true,
  },
  visualReviews,
  findings: {
    cyclomediaNamedHitsAreUnrelatedSupplierNotificationLists: true,
    cityClerkCyclomediaContractFound: false,
    cityClerkImagerySpecificationFound: false,
    cityClerkCameraCalibrationFound: false,
    cityClerkPositionalAccuracyAcceptanceFound: false,
    cityClerkStreetSmartAccessAgreementFound: false,
    geometryExtracted: false,
  },
  recordsBoundary: {
    completedExactPhraseSearches: [
      'CycloMedia',
      'CycloMedia Technology',
      'Street Smart',
      'street-level imagery',
      '3D measurements',
    ],
    streetSmartPhraseFalsePositivesDominatedByUnrelatedNc4PoliceSoftware: true,
    noResponsiveCyclomediaContractOrAccuracyRecordFoundInCompletedSearches: true,
    cityDepartmentOrProcurementRecordsOutsideCityClerkRepositoryCouldStillExist: true,
  },
  geometryBoundary: {
    establishesCompleteVisualReviewOfCyclomediaNamedHits: true,
    establishesCyclomediaContractOrAccuracyRecord: false,
    establishesPublicStreetSmartAccess: false,
    establishesPositionalAccuracy: false,
    establishesCurrentExteriorGeometry: false,
    establishesInteriorSeatingGeometry: false,
    establishesCurrentMeasuredRowGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'NO_CYCLOMEDIA_CONTRACT_OR_ACCURACY_RECORD_FOUND_IN_CITY_CLERK_SEARCHES',
      'PUBLIC_STREETSMART_ACCESS_NOT_ESTABLISHED',
      'POSITIONAL_ACCURACY_NOT_ESTABLISHED',
      'CURRENT_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-cyclomedia-record-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  reviewScope: artifact.reviewScope,
  visualReviews: artifact.visualReviews.map(({ renderedInputs, ...review }) => review),
  findings: artifact.findings,
  recordsBoundary: artifact.recordsBoundary,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
