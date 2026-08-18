#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function fileDigest(filePath) {
  return sha256(await readFile(filePath));
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

function requireText(value, expected, label) {
  if (!value.includes(expected)) throw new Error(`${label}: missing ${JSON.stringify(expected)}`);
}

const paths = {
  sourceManifest: path.resolve(option(
    'source-manifest',
    'tmp/lidar/whitesox-current-geometry-sources-2026/manifest.json',
  )),
  sourceReview: path.resolve(option(
    'source-review',
    'tmp/lidar/whitesox-current-geometry-source-review-v1.json',
  )),
  lidarManifest: path.resolve(option(
    'lidar-manifest',
    'tmp/lidar/whitesox-cook-2022/manifest.json',
  )),
  surfaceAudit: path.resolve(option(
    'surface-audit',
    'tmp/lidar/whitesox-cook-2022/stadium-surface-audit-v1.json',
  )),
  providerRows: path.resolve(option(
    'provider-rows',
    'tmp/lidar/whitesox-ticketmaster-assigned-rows-2026.json',
  )),
  fieldControls: path.resolve(option(
    'field-controls',
    'tmp/lidar/whitesox-ticketmaster-field-controls-2026.json',
  )),
  orthophoto: path.resolve(option(
    'orthophoto',
    'tmp/lidar/whitesox-cook-2022/cook-ortho-2025-rate-field-acquisition.json',
  )),
  outputDirectory: path.resolve(option(
    'output-dir',
    'tmp/lidar/whitesox-current-geometry-delta-2026',
  )),
};

const relative = (filePath) => path.relative(process.cwd(), filePath);
const [
  sourceManifest,
  sourceReview,
  lidarManifest,
  surfaceAudit,
  providerRows,
  fieldControls,
  orthophoto,
] = await Promise.all([
  readJson(paths.sourceManifest),
  readJson(paths.sourceReview),
  readJson(paths.lidarManifest),
  readJson(paths.surfaceAudit),
  readJson(paths.providerRows),
  readJson(paths.fieldControls),
  readJson(paths.orthophoto),
]);

requireEqual(
  sourceManifest.artifactKind,
  'whitesox-current-geometry-source-acquisition',
  'source-manifest kind',
);
requireEqual(sourceManifest.stadiumId, 'whitesox', 'source-manifest stadiumId');
requireEqual(
  sourceReview.artifactKind,
  'whitesox-current-geometry-manual-source-review',
  'source-review kind',
);
requireEqual(sourceReview.stadiumId, 'whitesox', 'source-review stadiumId');
requireEqual(
  sourceReview.sourceAcquisitionArtifactVersion,
  sourceManifest.artifactVersion,
  'source review acquisition version',
);
requireEqual(lidarManifest.artifactKind, 'lidar-project-acquisition', 'LiDAR manifest kind');
requireEqual(lidarManifest.stadiumId, 'whitesox', 'LiDAR manifest stadiumId');
requireEqual(surfaceAudit.analysisVersion, 'lidar-stadium-surface-audit-v4', 'surface version');
requireEqual(surfaceAudit.stadiumId, 'whitesox', 'surface stadiumId');
requireEqual(
  providerRows.artifactKind,
  'ticketmaster-assigned-row-map-geometry',
  'provider rows kind',
);
requireEqual(providerRows.stadiumId, 'whitesox', 'provider rows stadiumId');
requireEqual(
  fieldControls.artifactKind,
  'ticketmaster-regulation-field-control-candidate',
  'field controls kind',
);
requireEqual(fieldControls.stadiumId, 'whitesox', 'field controls stadiumId');
requireEqual(
  orthophoto.artifactKind,
  'official-arcgis-orthophoto-export',
  'orthophoto kind',
);
requireEqual(orthophoto.stadiumId, 'whitesox', 'orthophoto stadiumId');

requireEqual(
  await fileDigest(paths.sourceManifest),
  sourceReview.inputs.sourceManifest.sha256,
  'source manifest reviewed SHA-256',
);
requireEqual(
  sourceReview.inputs.sourceManifest.artifactVersion,
  sourceManifest.artifactVersion,
  'source manifest reviewed artifact version',
);
for (const input of Object.values(sourceReview.inputs)) {
  requireEqual(
    await fileDigest(path.resolve(input.path)),
    input.sha256,
    `manual review input ${input.path}`,
  );
}

const sourceRecords = new Map(sourceManifest.sources.map((source) => [source.key, source]));
const expectedSourceKeys = [
  'whitesox-rate-field-rebrand-2024',
  'whitesox-fanatics-flagship-store-2025',
  'whitesox-rate-field-guide-2026',
  'isfa-about-current',
  'isfa-board-meetings-current',
  'isfa-procurement-current',
  'isfa-foia-current',
  'isgs-cook-county-2022-lidar-dataset',
  'isfa-september-2025-minutes',
  'isfa-february-2026-agenda',
  'isfa-february-2026-minutes',
  'isfa-may-2026-agenda',
  'isfa-field-level-led-rfp-2026',
  'isfa-field-level-led-bid-form-2026',
  'isfa-field-level-led-specifications-2026',
];
requireEqual(sourceRecords.size, expectedSourceKeys.length, 'official source count');
for (const key of expectedSourceKeys) {
  if (!sourceRecords.has(key)) throw new Error(`Required official source is absent: ${key}`);
}

for (const source of sourceManifest.sources) {
  requireEqual(
    await fileDigest(path.resolve(source.localPath)),
    source.sha256,
    `${source.key} local source SHA-256`,
  );
}
for (const reviewedDocument of sourceReview.reviewedDocuments) {
  const source = sourceRecords.get(reviewedDocument.sourceKey);
  if (source && reviewedDocument.sourceSha256) {
    requireEqual(
      reviewedDocument.sourceSha256,
      source.sha256,
      `${reviewedDocument.sourceKey} reviewed SHA-256`,
    );
  }
  for (const renderedPage of reviewedDocument.renderedPages ?? []) {
    requireEqual(
      await fileDigest(path.resolve(renderedPage.path)),
      renderedPage.sha256,
      `${reviewedDocument.sourceKey} rendered page ${renderedPage.pdfPage}`,
    );
  }
  if (reviewedDocument.workbookReview) {
    requireEqual(
      await fileDigest(path.resolve(reviewedDocument.workbookReview.renderedWorkbookPath)),
      reviewedDocument.workbookReview.renderedWorkbookSha256,
      `${reviewedDocument.sourceKey} rendered workbook`,
    );
  }
}

const htmlByKey = new Map();
for (const source of sourceManifest.sources.filter((item) => item.mediaType === 'text/html')) {
  htmlByKey.set(source.key, await readFile(path.resolve(source.localPath), 'utf8'));
}
requireText(
  htmlByKey.get('whitesox-rate-field-rebrand-2024'),
  'new signage at Rate Field',
  'official rebrand source',
);
requireText(
  htmlByKey.get('whitesox-fanatics-flagship-store-2025'),
  'newly renovated, two-level flagship store spanning more than 12,000 square feet',
  'official flagship-store source',
);
requireText(
  htmlByKey.get('whitesox-rate-field-guide-2026'),
  '2026-03-18T18:36:00Z',
  'current official guide date',
);
requireText(
  htmlByKey.get('isfa-procurement-current'),
  'Backstop and Dugout LED Display',
  'current ISFA procurement source',
);
requireText(
  htmlByKey.get('isfa-board-meetings-current'),
  'Board Meeting 5.13.26',
  'current ISFA board source',
);

requireEqual(lidarManifest.projectCoverage.coveragePercent, 100, 'LiDAR file coverage');
requireEqual(lidarManifest.projectCoverage.tileCount, 2, 'LiDAR tile count');
requireEqual(
  lidarManifest.surfaceAudit.sha256,
  await fileDigest(paths.surfaceAudit),
  'LiDAR manifest surface-audit SHA-256',
);
requireEqual(surfaceAudit.source.reportedHorizontalAccuracy95Ft, 3.8, 'LiDAR horizontal 95');
requireEqual(surfaceAudit.source.reportedRawFundamentalVerticalAccuracy95Ft, 0.6, 'LiDAR vertical 95');
const oneFootSampling = surfaceAudit.samplingAndRepeatability.find(
  (record) => record.cellSizeFt === 1,
);
if (!oneFootSampling) throw new Error('One-foot LiDAR sampling record is absent');
requireEqual(oneFootSampling.samplingCoveragePercent, 99.2, 'one-foot sampling coverage');
requireEqual(
  oneFootSampling.multipleFlightLineCoveragePercent,
  93.21,
  'one-foot multi-flightline coverage',
);
requireEqual(
  surfaceAudit.releaseAssessment.reportedHorizontalAccuracyWithinThreshold,
  false,
  'LiDAR horizontal threshold result',
);
requireEqual(surfaceAudit.releaseAssessment.publicationEligible, false, 'surface publication');
if (!lidarManifest.publication.blockers.includes(
  'REPORTED_HORIZONTAL_ACCURACY_EXCEEDS_RELEASE_THRESHOLD',
)) {
  throw new Error('LiDAR manifest dropped the official horizontal-accuracy blocker');
}

requireEqual(providerRows.completeness.extractedRows, 3007, 'provider row count');
requireEqual(providerRows.completeness.extractedPlaces, 42300, 'provider place count');
requireEqual(
  providerRows.completeness.providerMapCoordinateCoveragePercent,
  100,
  'provider coordinate coverage',
);
requireEqual(providerRows.coordinateReference.metric, false, 'provider metric claim');
requireEqual(providerRows.coordinateReference.elevationIncluded, false, 'provider elevation claim');
requireEqual(fieldControls.geometryBoundary.establishesProviderMapScale, true, 'provider scale');
requireEqual(fieldControls.geometryBoundary.establishesProviderFieldAxis, true, 'provider field axis');
requireEqual(
  fieldControls.geometryBoundary.establishesSurveyedWorldCoordinates,
  false,
  'provider world coordinates',
);
requireEqual(
  fieldControls.controls.moundDistanceResidualFeet,
  0.8240312332768553,
  'provider mound-distance residual',
);

requireEqual(orthophoto.source.sourceYear, 2025, 'orthophoto source year');
requireEqual(orthophoto.export.coordinateReferenceSystem, 'EPSG:6455', 'orthophoto CRS');
requireEqual(orthophoto.export.pixelSizeX, 0.5, 'orthophoto pixel size x');
requireEqual(orthophoto.export.pixelSizeY, 0.5, 'orthophoto pixel size y');
requireEqual(orthophoto.source.catalogItem.groundConditionDate, null, 'orthophoto date');
requireEqual(orthophoto.source.catalogItem.groundConditionTime, null, 'orthophoto time');
requireEqual(
  await fileDigest(path.resolve(orthophoto.localImagePath)),
  orthophoto.export.sha256,
  'orthophoto image SHA-256',
);
if (!orthophoto.publication.blockers.includes(
  'SOURCE_HORIZONTAL_ACCURACY_NOT_ESTABLISHED_WITHIN_ONE_FOOT',
)) {
  throw new Error('Orthophoto artifact dropped the horizontal-accuracy blocker');
}

const changes = [
  {
    changeId: '2024-rate-field-name-and-signage',
    status: 'completed-current-change',
    sourceStatus: 'officially announced 2024-12-18',
    structuralRelevance: [
      'new signage may alter local shadow-casting surfaces',
      'the official announcement supplies no exact sign locations, dimensions, or attachments',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: '2025-two-level-flagship-store-renovation',
    status: 'completed-current-change',
    sourceStatus: 'officially opened 2025-03-22',
    structuralRelevance: [
      'the renovation spans more than 12,000 square feet across two levels',
      'the official source supplies no metric plan, exterior envelope, or obstruction dimensions',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: '2026-capital-repair-program',
    status: 'reported-current-work',
    sourceStatus: 'reported at official board meetings through 2026-05-13',
    structuralRelevance: [
      'identified classes include HVAC, LED lighting, and 300-level door upgrades',
      'the public minutes omit detailed exhibits, exact locations, and completion certifications',
    ],
    exactCompletedScopeEstablished: false,
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: '2026-future-field-level-led-displays',
    status: 'planned-not-installed-on-assessment-date',
    sourceStatus: 'bids due 2026-09-02 with mobilization planned for 2026-09-28 or after the season',
    structuralRelevance: [
      'one minimum 2.1-by-23.5-foot home-plate display is specified',
      'two minimum 1.1-by-65.1-foot dugout-lip displays are specified',
      'primary and secondary support steel must be designed by the future contractor',
    ],
    exactAsBuiltGeometryEstablished: false,
    installedOnAssessmentDate: false,
  },
  {
    changeId: 'current-assigned-row-provider-map',
    status: 'current-provider-coordinate-product',
    sourceStatus: '3,007 provider row nodes and 42,300 provider places',
    structuralRelevance: [
      'provider map coordinate coverage is internally complete',
      'provider pixels are rendering coordinates and include no elevations',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
];

const inputs = {
  sourceManifest: {
    path: relative(paths.sourceManifest),
    sha256: await fileDigest(paths.sourceManifest),
    artifactVersion: sourceManifest.artifactVersion,
  },
  manualSourceReview: {
    path: relative(paths.sourceReview),
    sha256: await fileDigest(paths.sourceReview),
  },
  lidarManifest: {
    path: relative(paths.lidarManifest),
    sha256: await fileDigest(paths.lidarManifest),
    artifactVersion: lidarManifest.artifactVersion,
  },
  surfaceAudit: {
    path: relative(paths.surfaceAudit),
    sha256: await fileDigest(paths.surfaceAudit),
    analysisInputFingerprintSha256: surfaceAudit.analysisInputFingerprintSha256,
  },
  providerRows: {
    path: relative(paths.providerRows),
    sha256: await fileDigest(paths.providerRows),
    artifactVersion: providerRows.artifactVersion,
  },
  fieldControls: {
    path: relative(paths.fieldControls),
    sha256: await fileDigest(paths.fieldControls),
    artifactVersion: fieldControls.artifactVersion,
  },
  orthophoto: {
    path: relative(paths.orthophoto),
    sha256: await fileDigest(paths.orthophoto),
    artifactVersion: orthophoto.artifactVersion,
  },
  officialSourceFiles: sourceManifest.sources.map((source) => ({
    path: source.localPath,
    sha256: source.sha256,
  })),
};

const stable = {
  analysisVersion: 'whitesox-current-geometry-delta-audit-v1',
  stadiumId: 'whitesox',
  assessedOn: '2026-08-10',
  inputs,
  sourceEvidence: {
    sourceAcquisitionArtifactVersion: sourceManifest.artifactVersion,
    sourceUrls: sourceManifest.sources.map((source) => source.resolvedUrl),
    officialLiDARProjectCoveragePercent: 100,
    officialOrthophotoSourceYear: 2025,
    currentMetricAsBuiltDrawingLocated: false,
    currentDetailedCapitalProjectExhibitsLocated: false,
    futureFieldLevelLedBidPackageLocated: true,
    futureFieldLevelLedAsBuiltDrawingAvailable: false,
  },
  changes,
  currentGeometryAssessment: {
    lidarEpoch: surfaceAudit.source.acquiredOn,
    lidarReportedHorizontalAccuracy95Ft: 3.8,
    lidarReportedVerticalAccuracy95Ft: 0.6,
    lidarReportedHorizontalAccuracyWithinThreshold: false,
    lidarOneFootSamplingCoveragePercent: 99.2,
    lidarOneFootMultiFlightLineCoveragePercent: 93.21,
    lidarPredatesDocumented2024Through2026Changes: true,
    orthophotoSourceYear: 2025,
    orthophotoPixelSizeFt: 0.5,
    orthophotoHorizontalAccuracyWithinThresholdEstablished: false,
    orthophotoGroundConditionDateEstablished: false,
    orthophotoGroundConditionTimeEstablished: false,
    assignedRowProviderCoordinateCount: 3007,
    assignedPlaceProviderCoordinateCount: 42300,
    assignedRowProviderCoordinatesCurrent: true,
    assignedRowProviderCoordinatesEstablishPhysicalMeasurement: false,
    providerPlanScaleEstablished: true,
    providerFieldAxisEstablished: true,
    providerPlanWorldRegistrationEstablished: false,
    currentChangeInventoryEstablished: false,
    currentRowTreadAndRiserGeometryEstablished: false,
    exactCurrentAsBuiltCoordinatesEstablished: false,
    exactCurrentObstructionHeightsEstablished: false,
    exactCurrentOverhangUndersidesEstablished: false,
    currentWatertightShadowCastingVolumeEstablished: false,
    futureFieldLevelLedInstalledOnAssessmentDate: false,
    futureFieldLevelLedAsBuiltGeometryEstablished: false,
  },
  geometryBoundary: {
    establishesChecksumLockedCurrentOfficialSources: true,
    establishesCurrentOfficialProductIdentity: true,
    establishesLiDARSourceHorizontalAccuracyAtOrBelowOneFoot: false,
    establishesCurrentChangeClasses: false,
    establishesMeasuredHorizontalCoordinates: false,
    establishesMeasuredVerticalCoordinates: false,
    establishesAsBuiltDimensions: false,
    establishesRowTreadAndRiserGeometry: false,
    establishesOverhangUndersides: false,
    establishesCurrentWatertightShadowCastingVolume: false,
    establishesFutureFieldLevelLedInstalled: false,
    establishesFutureFieldLevelLedAsBuiltGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'LIDAR_REPORTED_HORIZONTAL_ACCURACY_EXCEEDS_ONE_FOOT',
      '2022_LIDAR_PREDATES_2024_THROUGH_2026_GEOMETRY_CHANGES',
      'ORTHOPHOTO_HORIZONTAL_ACCURACY_NOT_ESTABLISHED_WITHIN_ONE_FOOT',
      'ORTHOPHOTO_GROUND_CONDITION_DATE_AND_TIME_NOT_ESTABLISHED',
      'CURRENT_METRIC_AS_BUILT_DRAWINGS_NOT_PUBLICLY_LOCATED',
      'CURRENT_CAPITAL_PROJECT_EXHIBITS_NOT_PUBLICLY_LOCATED',
      'CURRENT_CHANGE_INVENTORY_INCOMPLETE',
      'CURRENT_ROW_GEOMETRY_NOT_MEASURED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED',
      'FUTURE_FIELD_LEVEL_LED_REQUIRES_POST_INSTALLATION_REACQUISITION',
      'CURRENT_WATERTIGHT_SHADOW_CASTING_VOLUME_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  schemaVersion: 1,
  artifactKind: 'whitesox-current-geometry-delta-audit',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};

await mkdir(paths.outputDirectory, { recursive: true });
const manifestPath = path.join(paths.outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  changeCount: changes.length,
  currentGeometryAssessment: artifact.currentGeometryAssessment,
  publication: artifact.publication,
}, null, 2));
