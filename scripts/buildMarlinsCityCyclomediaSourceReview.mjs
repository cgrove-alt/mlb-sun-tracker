#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
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

const indexManifestPath = path.resolve(option(
  'index-manifest',
  'tmp/lidar/marlins-city-cyclomedia-index-2026/manifest.json',
));
const accessManifestPath = path.resolve(option(
  'access-manifest',
  'tmp/lidar/marlins-city-cyclomedia-streetsmart-review-2026/manifest.json',
));
const recordReviewPath = path.resolve(option(
  'record-review',
  'tmp/lidar/marlins-city-weblink-cyclomedia-record-review-2026.json',
));
const outputPath = path.resolve(option(
  'output',
  'tmp/lidar/marlins-city-cyclomedia-source-review-2026.json',
));

const indexManifestBytes = await readFile(indexManifestPath);
const indexManifest = JSON.parse(indexManifestBytes.toString('utf8'));
requireEqual(indexManifest.artifactKind, 'marlins-city-cyclomedia-index', 'index kind');
requireEqual(indexManifest.inventory?.featureCount, 6645, 'stadium-envelope feature count');
requireEqual(indexManifest.inventory?.recordedAtCount, 6645, 'capture timestamp count');
requireEqual(indexManifest.inventory?.zCoordinateCount, 6645, 'Z coordinate count');
requireEqual(indexManifest.inventory?.minimumZ, 0, 'minimum recording-point Z');
requireEqual(indexManifest.inventory?.maximumZ, 0, 'maximum recording-point Z');

const accessManifestBytes = await readFile(accessManifestPath);
const accessManifest = JSON.parse(accessManifestBytes.toString('utf8'));
requireEqual(
  accessManifest.artifactKind,
  'marlins-city-cyclomedia-streetsmart-review',
  'Street Smart review kind',
);
requireEqual(
  accessManifest.inputs?.indexManifest?.sha256,
  sha256(indexManifestBytes),
  'Street Smart review locked index checksum',
);
requireEqual(accessManifest.accessFindings?.loginPromptVisible, true, 'login prompt visibility');
requireEqual(accessManifest.accessFindings?.publicAccessEstablished, false, 'public image access');
requireEqual(
  accessManifest.geometryBoundary?.establishesSuccessfulMetricMeasurement,
  false,
  'successful metric measurement',
);

const screenshotPath = path.resolve(accessManifest.inputs.screenshot.path);
const screenshotBytes = await readFile(screenshotPath);
requireEqual(
  sha256(screenshotBytes),
  accessManifest.inputs.screenshot.sha256,
  'Street Smart screenshot checksum',
);

const recordReviewBytes = await readFile(recordReviewPath);
const recordReview = JSON.parse(recordReviewBytes.toString('utf8'));
requireEqual(
  recordReview.artifactKind,
  'marlins-city-weblink-cyclomedia-record-review',
  'City Clerk Cyclomedia record review kind',
);
requireEqual(
  recordReview.reviewScope?.allRenderedPagesVisuallyReviewed,
  true,
  'City Clerk Cyclomedia page review completion',
);
requireEqual(
  recordReview.findings?.cityClerkCyclomediaContractFound,
  false,
  'City Clerk Cyclomedia contract finding',
);
requireEqual(
  recordReview.findings?.cityClerkPositionalAccuracyAcceptanceFound,
  false,
  'City Clerk Cyclomedia accuracy-acceptance finding',
);

const stable = {
  analysisVersion: 'marlins-city-cyclomedia-source-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    recordingPointIndex: {
      path: path.relative(process.cwd(), indexManifestPath),
      sha256: sha256(indexManifestBytes),
      artifactVersion: indexManifest.artifactVersion,
    },
    streetSmartAccessReview: {
      path: path.relative(process.cwd(), accessManifestPath),
      sha256: sha256(accessManifestBytes),
      artifactVersion: accessManifest.artifactVersion,
    },
    cityClerkRecordReview: {
      path: path.relative(process.cwd(), recordReviewPath),
      sha256: sha256(recordReviewBytes),
      artifactVersion: recordReview.artifactVersion,
    },
    visuallyReviewedScreenshot: {
      path: path.relative(process.cwd(), screenshotPath),
      sha256: sha256(screenshotBytes),
      byteLength: screenshotBytes.length,
      width: accessManifest.inputs.screenshot.width,
      height: accessManifest.inputs.screenshot.height,
    },
  },
  inventoryFindings: {
    officialCityEnvelopePointCount: indexManifest.inventory.featureCount,
    uniqueImageIdCount: indexManifest.inventory.uniqueImageIdCount,
    nearestPointDistanceToStadiumCenterMeters:
      indexManifest.nearestPointSamples[0].distanceToStadiumCenterMeters,
    earliestCaptureLocalTimeWithoutTimeZone: indexManifest.inventory.earliestRecordedAt,
    latestCaptureLocalTimeWithoutTimeZone: indexManifest.inventory.latestRecordedAt,
    captureYear: 2019,
    serviceCopyrightYear: 2024,
    sourceIsCurrentFor2026Geometry: false,
    allPublishedZCoordinatesAreZero: indexManifest.inventory.minimumZ === 0
      && indexManifest.inventory.maximumZ === 0,
  },
  accessFindings: {
    cityPublishedHyperlinkResolvesToStreetSmartLandingPage: true,
    streetSmartRedirectsToIdentityService: true,
    loginRequired: true,
    queriedStadiumImageRendered: false,
    measurementWorkspaceRendered: false,
    metricMeasurementCompleted: false,
    publicUnauthenticatedGeometryAccessEstablished: false,
  },
  cityClerkRecordFindings: {
    exactPhraseQueryCount: recordReview.reviewScope.exactPhraseQueryCount,
    uniqueSearchResultCount: recordReview.reviewScope.uniqueSearchResultCount,
    cyclomediaNamedResultCount: recordReview.reviewScope.cyclomediaNamedResultCount,
    reviewedMatchedAndAdjacentPageCount:
      recordReview.reviewScope.reviewedMatchedAndAdjacentPageCount,
    allCyclomediaNamedHitsWereUnrelatedSupplierNotificationLists: true,
    cyclomediaContractFound: false,
    imagerySpecificationFound: false,
    cameraCalibrationFound: false,
    positionalAccuracyAcceptanceFound: false,
    streetSmartAccessAgreementFound: false,
  },
  visualReview: {
    status: 'complete',
    reviewedScreenshotSha256: sha256(screenshotBytes),
    observation:
      'The screenshot shows a Cyclomedia Street Smart username login screen over a generic city background.',
    queriedStadiumExteriorVisible: false,
    measurementInterfaceVisible: false,
    measurementResultVisible: false,
    geometryDigitizedFromScreenshot: false,
  },
  sourceDisposition: {
    status: 'access-controlled-stale-exterior-candidate',
    usefulForGeometryWithoutAuthorizedAccess: false,
    couldPotentiallySupportExteriorMeasurementsWithAuthorizedAccess: true,
    couldSupportInteriorSeatingRows: false,
    couldAloneEstablishCurrent2026Geometry: false,
    followUpRoute:
      'Request authorized Cyclomedia access, the governing department or procurement contract, and published accuracy/calibration documentation from the City only if the records route cannot supply current native survey or BIM geometry. The completed City Clerk exact-phrase searches did not expose those records.',
  },
  geometryBoundary: {
    establishesOfficialCityRecordingPointInventoryForEnvelope: true,
    establishesStreetLevelCaptureCoverageIn2019: true,
    establishesServiceAdvertisedForThreeDimensionalMeasurements: true,
    establishesPublicImageAccess: false,
    establishesSuccessfulMetricMeasurement: false,
    establishesPublishedElevationValues: false,
    establishesPositionalAccuracy: false,
    establishesCurrentExteriorGeometry: false,
    establishesInteriorSeatingGeometry: false,
    establishesCurrentMeasuredRowGeometry: false,
    establishesCurrentObstructionGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'STREETSMART_AUTHORIZATION_REQUIRED',
      'CAPTURE_DATA_IS_FROM_2019',
      'PUBLISHED_POINT_Z_VALUES_ARE_ZERO',
      'SUCCESSFUL_METRIC_MEASUREMENT_NOT_ESTABLISHED',
      'POSITIONAL_ACCURACY_NOT_ESTABLISHED',
      'INTERIOR_SEATING_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-cyclomedia-source-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  inventoryFindings: artifact.inventoryFindings,
  accessFindings: artifact.accessFindings,
  visualReview: artifact.visualReview,
  sourceDisposition: artifact.sourceDisposition,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
