#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback) {
  const prefix = `--${name}=`;
  return path.resolve(
    process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
      ?? fallback,
  );
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

async function readJson(sourcePath) {
  return JSON.parse(await readFile(sourcePath, 'utf8'));
}

async function fileDigest(sourcePath) {
  return sha256(await readFile(sourcePath));
}

function relative(sourcePath) {
  return path.relative(process.cwd(), sourcePath);
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

function requireText(source, expected, label) {
  if (!source.includes(expected)) {
    throw new Error(`${label}: required text is absent`);
  }
}

const paths = {
  sourceManifest: option(
    'source-manifest',
    'tmp/lidar/astros-current-geometry-sources-2026/manifest.json',
  ),
  sourceReview: option(
    'source-review',
    'tmp/lidar/astros-current-geometry-source-review-v1.json',
  ),
  mediaIndex: option(
    'media-index',
    'tmp/lidar/astros-hchsa-official-media-index-2024-2026.json',
  ),
  surfaceAudit: option(
    'surface-audit',
    'tmp/lidar/astros-usgs-tx-houston-b24/stadium-surface-audit.json',
  ),
  providerRows: option(
    'provider-rows',
    'tmp/lidar/astros-3ddv-metric-rows-v2.json',
  ),
  outputDirectory: option(
    'output-dir',
    'tmp/lidar/astros-current-geometry-delta-2026',
  ),
};

const [sourceManifest, sourceReview, mediaIndex, surfaceAudit, providerRows] = await Promise.all([
  readJson(paths.sourceManifest),
  readJson(paths.sourceReview),
  readJson(paths.mediaIndex),
  readJson(paths.surfaceAudit),
  readJson(paths.providerRows),
]);

requireEqual(
  sourceManifest.artifactKind,
  'astros-current-geometry-source-acquisition',
  'source artifact kind',
);
requireEqual(sourceManifest.stadiumId, 'astros', 'source stadiumId');
requireEqual(
  sourceReview.artifactKind,
  'astros-current-geometry-manual-source-review',
  'review artifact kind',
);
requireEqual(sourceReview.stadiumId, 'astros', 'review stadiumId');
requireEqual(
  sourceReview.sourceAcquisitionArtifactVersion,
  sourceManifest.artifactVersion,
  'reviewed source-acquisition artifact version',
);
requireEqual(mediaIndex.artifactKind, 'hchsa-official-media-index', 'media-index artifact kind');
requireEqual(mediaIndex.stadiumId, 'astros', 'media-index stadiumId');
requireEqual(
  sourceReview.officialMediaIndexArtifactVersion,
  mediaIndex.artifactVersion,
  'reviewed official-media-index artifact version',
);
requireEqual(surfaceAudit.stadiumId, 'astros', 'surface-audit stadiumId');
requireEqual(providerRows.stadiumId, 'astros', 'provider-row stadiumId');

const sourceRecords = new Map(sourceManifest.sources.map((source) => [source.key, source]));
const requiredSourceKeys = [
  'astros-samsung-displays-2022',
  'astros-daikin-naming-2024',
  'astros-train-refurbishment-2025',
  'hchsa-public-information-current',
  'hchsa-pia-current',
  'hchsa-project-agreement-astros-1998',
  'hchsa-stadium-lease-astros-1998',
  'hchsa-first-omnibus-amendment-2018',
  'walter-p-moore-daikin-park-current',
  'tnris-state-orthoimagery-statement-of-work-current',
];
for (const key of requiredSourceKeys) {
  if (!sourceRecords.has(key)) throw new Error(`Required source is absent: ${key}`);
}

for (const source of sourceManifest.sources) {
  const sourcePath = path.resolve(source.localPath);
  requireEqual(await fileDigest(sourcePath), source.sha256, `${source.key} local SHA-256`);
  requireEqual(source.response.status, 200, `${source.key} HTTP status`);
}

const htmlByKey = new Map(await Promise.all(
  sourceManifest.sources
    .filter((source) => source.mediaType === 'text/html')
    .map(async (source) => [source.key, await readFile(path.resolve(source.localPath), 'utf8')]),
));
const samsung = htmlByKey.get('astros-samsung-displays-2022');
const naming = htmlByKey.get('astros-daikin-naming-2024');
const train = htmlByKey.get('astros-train-refurbishment-2025');
const publicInformation = htmlByKey.get('hchsa-public-information-current');
const pia = htmlByKey.get('hchsa-pia-current');
const engineer = htmlByKey.get('walter-p-moore-daikin-park-current');

requireText(
  samsung,
  'main outfield display, ribbon boards, center field mezzanine and more',
  '2023 display scope',
);
requireText(samsung, 'scheduled completion by Opening Day 2023', '2023 display completion target');
requireText(naming, 'effective January 1, 2025', 'Daikin naming effective date');
requireText(train, 'Minor tune ups', '2025 train tuneups');
requireText(train, '25 baseballs', '2025 train tender additions');
requireText(train, 'Astros home run celebrations', 'current train operation');
requireText(publicInformation, 'Project_Agreement_Astros.pdf', 'published Astros project agreement');
requireText(
  publicInformation,
  'Stadium_Lease_Agreement_Astros.pdf',
  'published Astros stadium lease',
);
requireText(pia, 'Texas Public Information Act Requests', 'official records-request process');
requireText(engineer, '580-ft-span retractable roof', 'retractable roof span');
requireText(engineer, '115-ft-tall moving-glass left field wall', 'moving glass wall height');

for (const reviewedDocument of sourceReview.reviewedDocuments) {
  const source = sourceRecords.get(reviewedDocument.sourceKey);
  if (!source) throw new Error(`Reviewed PDF source is absent: ${reviewedDocument.sourceKey}`);
  requireEqual(
    source.sha256,
    reviewedDocument.sourceSha256,
    `${reviewedDocument.sourceKey} reviewed SHA-256`,
  );
  for (const renderedPage of reviewedDocument.renderedPages ?? []) {
    requireEqual(
      await fileDigest(path.resolve(renderedPage.path)),
      renderedPage.sha256,
      `${reviewedDocument.sourceKey} rendered page ${renderedPage.pdfPage}`,
    );
  }
  if (reviewedDocument.renderManifestPath) {
    const renderManifestPath = path.resolve(reviewedDocument.renderManifestPath);
    const renderManifest = await readJson(renderManifestPath);
    requireEqual(
      await fileDigest(renderManifestPath),
      reviewedDocument.renderManifestSha256,
      `${reviewedDocument.sourceKey} render manifest SHA-256`,
    );
    requireEqual(
      renderManifest.artifactVersion,
      reviewedDocument.renderManifestArtifactVersion,
      `${reviewedDocument.sourceKey} render artifact version`,
    );
    requireEqual(
      renderManifest.source.sha256,
      reviewedDocument.sourceSha256,
      `${reviewedDocument.sourceKey} rendered source SHA-256`,
    );
  }
}

requireEqual(mediaIndex.source.serverReportedMediaCount, 893, 'server-reported media count');
requireEqual(mediaIndex.source.accessibleMediaCount, 874, 'accessible media count');
requireEqual(mediaIndex.source.inaccessibleMediaCount, 19, 'inaccessible media count');
requireEqual(mediaIndex.source.pdfCount, 255, 'accessible PDF count');
requireEqual(mediaIndex.candidateRecords.length, 198, 'candidate record count');
requireEqual(
  mediaIndex.geometryBoundary.completeOfficialMediaEnumerationSinceAfterDate,
  false,
  'complete media enumeration claim',
);

requireEqual(surfaceAudit.schemaVersion, 2, 'surface-audit schema');
requireEqual(surfaceAudit.source.reportedHorizontalAccuracy95Ft, 1.05, 'reported horizontal 95');
requireEqual(
  surfaceAudit.source.reportedRawFundamentalVerticalAccuracy95Ft,
  0.2087,
  'reported raw vertical 95',
);
const oneFootSampling = surfaceAudit.samplingAndRepeatability.find(
  (record) => record.cellSizeFt === 1,
);
if (!oneFootSampling) throw new Error('One-foot LiDAR sampling record is absent');
requireEqual(oneFootSampling.samplingCoveragePercent, 72.04, 'one-foot sampling coverage');
requireEqual(oneFootSampling.multipleFlightLineCoveragePercent, 0, 'one-foot repeat coverage');
requireEqual(
  surfaceAudit.releaseAssessment.reportedHorizontalAccuracyWithinThreshold,
  false,
  'surface horizontal threshold result',
);
requireEqual(surfaceAudit.releaseAssessment.publicationEligible, false, 'surface publication');

requireEqual(providerRows.completeness.expectedRows, 2304, 'provider expected rows');
requireEqual(providerRows.completeness.extractedRows, 2304, 'provider extracted rows');
requireEqual(providerRows.completeness.expectedAnchors, 18513, 'provider expected anchors');
requireEqual(providerRows.completeness.extractedAnchors, 18513, 'provider extracted anchors');
requireEqual(providerRows.coordinateSystem.georeferenced, false, 'provider georeferencing');
requireEqual(providerRows.publication.eligible, false, 'provider publication');

const changes = [
  {
    changeId: '2023-main-scoreboard-ribbon-and-mezzanine-displays',
    location: 'main outfield board, ribbon boards, center-field mezzanine, infield and outfield',
    sourceStatus: 'officially scheduled for completion by Opening Day 2023 and predates the 2024 LiDAR',
    structuralRelevance: [
      'top and front display surfaces may be present in the 2024 returns',
      'support members, back surfaces, panel thicknesses, and undersides are not semantically reconstructed',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: '2025-daikin-naming-and-branding',
    location: 'ballpark naming and associated unspecified branded surfaces',
    sourceStatus: 'official naming-rights agreement effective 2025-01-01, after the 2024 LiDAR',
    structuralRelevance: [
      'exact signage locations and envelopes are not published',
      'the agreement announces investment in amenities without publishing an exhaustive current change list',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: '2025-home-run-train-refurbishment',
    location: 'left-field train track and train tender',
    sourceStatus: 'officially unveiled 2025-03-27 with tuneups, paint, and 25 baseballs added to the tender',
    structuralRelevance: [
      'the train remains in use during introductions and home-run celebrations',
      'its time-dependent operational envelope can cast moving shadows',
    ],
    exactAsBuiltGeometryEstablished: false,
    everyOperationalPositionEstablished: false,
  },
  {
    changeId: 'retractable-roof-operational-positions',
    location: '580-foot-span retractable roof and tracks',
    sourceStatus: 'the 2024 LiDAR is a 5.736-second nighttime acquisition of one roof state',
    structuralRelevance: [
      'roof position materially changes direct-sun occlusion',
      'one acquisition does not establish every current open, closed, or intermediate position',
    ],
    exactAsBuiltGeometryEstablished: false,
    everyOperationalPositionEstablished: false,
  },
  {
    changeId: 'moving-glass-left-field-wall-positions',
    location: '115-foot-tall moving glass left-field wall',
    sourceStatus: 'the engineer-of-record page confirms the moving feature but publishes no position geometry',
    structuralRelevance: [
      'wall position changes the shadow-casting volume',
      'permitted travel, stops, and current as-built panel coordinates are not published',
    ],
    exactAsBuiltGeometryEstablished: false,
    everyOperationalPositionEstablished: false,
  },
  {
    changeId: 'current-assigned-row-provider-map',
    location: '2,304 ticket-addressable assigned rows with 18,513 provider anchors',
    sourceStatus: 'current provider inventory last modified in June 2026',
    structuralRelevance: [
      'provider-local positions are complete within the assigned-row product scope',
      'provider coordinates are rendering coordinates, not defensible physical measurements',
      'non-assigned-row zones remain outside the extracted scope',
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
  officialMediaIndex: {
    path: relative(paths.mediaIndex),
    sha256: await fileDigest(paths.mediaIndex),
    artifactVersion: mediaIndex.artifactVersion,
  },
  usgsSurfaceAudit: {
    path: relative(paths.surfaceAudit),
    sha256: await fileDigest(paths.surfaceAudit),
    analysisInputFingerprintSha256: surfaceAudit.analysisInputFingerprintSha256,
  },
  providerRows: {
    path: relative(paths.providerRows),
    sha256: await fileDigest(paths.providerRows),
    artifactVersion: providerRows.artifactVersion,
  },
  officialSourceFiles: sourceManifest.sources.map((source) => ({
    path: source.localPath,
    sha256: source.sha256,
  })),
};

const stable = {
  analysisVersion: 'astros-current-geometry-delta-audit-v1',
  inputs,
  stadiumId: 'astros',
  assessedOn: '2026-08-10',
  sourceEvidence: {
    sourceAcquisitionArtifactVersion: sourceManifest.artifactVersion,
    officialMediaIndexArtifactVersion: mediaIndex.artifactVersion,
    sourceUrls: sourceManifest.sources.map((source) => source.resolvedUrl),
    originalRecordDrawingCustodyChainEstablished: true,
    currentMetricAsBuiltDrawingLocated: false,
    accessibleOfficialMediaRecordsSince2024: 874,
    inaccessibleOfficialMediaRecordsSince2024: 19,
  },
  changes,
  currentGeometryAssessment: {
    lidarEpoch: surfaceAudit.source.gpsTimeRangeUtc.join(' through '),
    lidarAcquisitionDurationSeconds: 5.736282,
    lidarReportedHorizontalAccuracy95Ft: 1.05,
    lidarReportedRawVerticalAccuracy95Ft: 0.2087,
    lidarReportedHorizontalAccuracyWithinThreshold: false,
    lidarOneFootSamplingCoveragePercent: 72.04,
    lidarOneFootMultiFlightLineCoveragePercent: 0,
    assignedRowProviderCoordinateCount: 2304,
    assignedRowProviderAnchorCount: 18513,
    assignedRowProviderCoordinatesCurrent: true,
    assignedRowProviderCoordinatesEstablishPhysicalMeasurement: false,
    lidarPredatesDocumented2025Changes: true,
    currentChangeInventoryEstablished: false,
    currentRowTreadAndRiserGeometryEstablished: false,
    exactCurrentAsBuiltCoordinatesEstablished: false,
    exactCurrentObstructionHeightsEstablished: false,
    exactCurrentOverhangUndersidesEstablished: false,
    everyCurrentOperationalRoofPositionEstablished: false,
    everyCurrentMovingGlassWallPositionEstablished: false,
    trainOperationalEnvelopeEstablished: false,
    currentWatertightShadowCastingVolumeEstablished: false,
  },
  geometryBoundary: {
    establishesOriginalRecordDrawingCustodyChain: true,
    establishesRecordClassesToRequest: true,
    establishesCurrentChangeClasses: false,
    establishesCurrentOfficialProductIdentity: true,
    establishesMeasuredHorizontalCoordinates: false,
    establishesMeasuredVerticalCoordinates: false,
    establishesAsBuiltDimensions: false,
    establishesRowTreadAndRiserGeometry: false,
    establishesOverhangUndersides: false,
    establishesEveryOperationalRoofPosition: false,
    establishesEveryMovingGlassWallPosition: false,
    establishesTrainOperationalEnvelope: false,
    establishesCurrentWatertightShadowCastingVolume: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'LIDAR_REPORTED_HORIZONTAL_ACCURACY_EXCEEDS_ONE_FOOT',
      'LIDAR_ROW_SCALE_COVERAGE_INCOMPLETE',
      'LIDAR_REPEAT_FLIGHTLINE_COVERAGE_ABSENT',
      '2024_LIDAR_PREDATES_2025_GEOMETRY_CHANGES',
      'OFFICIAL_MEDIA_INDEX_SERVER_COUNT_MISMATCH',
      'CURRENT_METRIC_AS_BUILT_DRAWINGS_NOT_PUBLICLY_LOCATED',
      'CURRENT_ROW_GEOMETRY_NOT_MEASURED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_MEASURED',
      'EVERY_OPERATIONAL_ROOF_POSITION_NOT_ESTABLISHED',
      'EVERY_MOVING_GLASS_WALL_POSITION_NOT_ESTABLISHED',
      'TRAIN_OPERATIONAL_ENVELOPE_NOT_ESTABLISHED',
      'CURRENT_WATERTIGHT_SHADOW_CASTING_VOLUME_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  schemaVersion: 1,
  artifactKind: 'astros-current-geometry-delta-audit',
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
