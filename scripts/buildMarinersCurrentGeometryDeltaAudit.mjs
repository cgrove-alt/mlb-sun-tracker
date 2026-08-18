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
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]));
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
  if (!source.includes(expected)) throw new Error(`${label}: required text is absent`);
}

const paths = {
  sourceManifest: option(
    'source-manifest',
    'tmp/lidar/mariners-current-geometry-sources-2026/manifest.json',
  ),
  pdfReview: option(
    'pdf-review',
    'tmp/lidar/mariners-current-geometry-pdf-review-v1.json',
  ),
  outputDirectory: option(
    'output-dir',
    'tmp/lidar/mariners-current-geometry-delta-2026',
  ),
};

const [sourceManifest, pdfReview] = await Promise.all([
  readJson(paths.sourceManifest),
  readJson(paths.pdfReview),
]);
requireEqual(sourceManifest.artifactKind, 'mariners-current-geometry-source-acquisition', 'source artifact kind');
requireEqual(sourceManifest.stadiumId, 'mariners', 'source stadiumId');
requireEqual(pdfReview.artifactKind, 'mariners-current-geometry-manual-pdf-review', 'PDF review artifact kind');
requireEqual(pdfReview.stadiumId, 'mariners', 'PDF review stadiumId');
requireEqual(
  pdfReview.sourceAcquisitionArtifactVersion,
  sourceManifest.artifactVersion,
  'reviewed source-acquisition artifact version',
);

const sourceRecords = new Map(sourceManifest.sources.map((source) => [source.key, source]));
const requiredSourceKeys = [
  'mariners-premium-amenities-2022',
  'mariners-whats-new-2023',
  'mariners-diamond-club-unveiled-2023',
  'mariners-premium-seating-current',
  'mariners-fire-tv-2026',
  'pfd-february-2026-board-packet',
  'pfd-june-2026-provisional-plan-review',
];
for (const key of requiredSourceKeys) {
  if (!sourceRecords.has(key)) throw new Error(`Required official source is absent: ${key}`);
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
const premiumAnnouncement = htmlByKey.get('mariners-premium-amenities-2022');
const whatsNew = htmlByKey.get('mariners-whats-new-2023');
const diamondClubUnveiled = htmlByKey.get('mariners-diamond-club-unveiled-2023');
const currentPremium = htmlByKey.get('mariners-premium-seating-current');
const fireTv = htmlByKey.get('mariners-fire-tv-2026');
requireText(premiumAnnouncement, 'interior and exterior seating', 'Press Club exterior seating');
requireText(premiumAnnouncement, '13,000 square feet', 'Diamond Club footprint');
requireText(premiumAnnouncement, 'first eight rows behind home plate', 'Diamond Club row scope');
requireText(premiumAnnouncement, 'reduced by 104 seats', 'Terrace Club seat removal');
requireText(whatsNew, 'What\'s new at T-Mobile Park', '2023 opening-season source');
requireText(diamondClubUnveiled, 'unveiled the all-new Muckleshoot Diamond Club', 'Diamond Club completion');
requireText(currentPremium, 'Diamond Club', 'current Diamond Club product');
requireText(currentPremium, 'Press Club', 'current Press Club product');
requireText(currentPremium, 'indoor-outdoor experience', 'current Press Club configuration');
requireText(currentPremium, '2026', 'current premium source season');
requireText(fireTv, 'brand new, fully upgraded, 209-foot screen', '2026 main-board replacement');

const reviewedSourceKeys = new Set();
const renderInputs = [];
for (const reviewedDocument of pdfReview.reviewedDocuments) {
  const source = sourceRecords.get(reviewedDocument.sourceKey);
  if (!source) throw new Error(`Reviewed PDF source is absent: ${reviewedDocument.sourceKey}`);
  requireEqual(source.sha256, reviewedDocument.sourceSha256, `${reviewedDocument.sourceKey} reviewed SHA-256`);
  const renderManifestPath = path.resolve(reviewedDocument.renderManifestPath);
  const renderManifest = await readJson(renderManifestPath);
  requireEqual(
    renderManifest.artifactVersion,
    reviewedDocument.renderManifestArtifactVersion,
    `${reviewedDocument.sourceKey} render artifact`,
  );
  requireEqual(renderManifest.source.sha256, source.sha256, `${reviewedDocument.sourceKey} rendered source`);
  const renderedPages = new Set(renderManifest.pages.map((page) => page.pageNumber));
  for (const reviewedPage of reviewedDocument.reviewedPdfPages) {
    if (!renderedPages.has(reviewedPage)) {
      throw new Error(`${reviewedDocument.sourceKey} reviewed page ${reviewedPage} was not rendered`);
    }
  }
  renderInputs.push({
    path: relative(renderManifestPath),
    sha256: await fileDigest(renderManifestPath),
    artifactVersion: renderManifest.artifactVersion,
  });
  reviewedSourceKeys.add(reviewedDocument.sourceKey);
}
for (const requiredPdfKey of [
  'pfd-february-2026-board-packet',
  'pfd-june-2026-provisional-plan-review',
]) {
  if (!reviewedSourceKeys.has(requiredPdfKey)) {
    throw new Error(`Required official PFD PDF was not reviewed: ${requiredPdfKey}`);
  }
}

const changes = [
  {
    changeId: 'press-club-former-press-box-indoor-outdoor-seating',
    location: 'directly behind home plate below the Dave Niehaus Broadcast Center',
    sourceStatus: 'announced in 2022, built for 2023, and present in the current 2026 premium inventory',
    structuralRelevance: [
      'former press box converted to indoor and exterior premium seating',
      'new exterior seating and club-edge surfaces behind home plate',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: 'diamond-club-expansion-and-exterior-seating',
    location: 'first eight rows behind home plate and interior club footprint',
    sourceStatus: 'officially unveiled in 2023 and present in the current 2026 premium inventory',
    structuralRelevance: [
      '13,000-square-foot expanded club footprint',
      'fully renovated exterior seating in the first eight rows behind home plate',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: 'working-press-box-relocation-to-terrace-club',
    location: 'Terrace Club Level next to the Dave Niehaus Broadcast Center',
    sourceStatus: 'officially scheduled to open during 2022 before Press Club construction',
    structuralRelevance: [
      'Terrace Club capacity reduced by 104 seats',
      'new enclosed working press-box volume on Terrace Club Level',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: '2026-stadium-seat-replacement',
    location: 'unspecified individual seats and entire sections throughout the ballpark',
    sourceStatus: 'official PFD review reports 2026 work in progress and approximately 25 percent of seats replaced',
    structuralRelevance: [
      'current section-level replacement locations are not published',
      'seat stanchions, brackets, and trays are part of the physical seating assembly',
    ],
    exactAsBuiltGeometryEstablished: false,
    currentCompletionIndependentlyEstablished: false,
  },
  {
    changeId: '2026-mariners-vision-main-led-replacement',
    location: 'center-field main video board',
    sourceStatus: 'official 2026 sources describe a new 209-foot screen and PFD work in progress as of April 2026',
    structuralRelevance: [
      'the PFD records a qualitative statement that the board looks the same as the old board when off',
      'exact panel, support, and attachment coordinates are not published',
    ],
    exactAsBuiltGeometryEstablished: false,
    qualitativeExteriorEnvelopeContinuityStated: true,
    currentCompletionIndependentlyEstablished: false,
  },
  {
    changeId: 'retractable-roof-operational-positions',
    location: 'movable roof panels and east-side parked position',
    sourceStatus: 'the 2021 LiDAR records one parked roof state; a 2027 control-repowering project is planned',
    structuralRelevance: [
      'roof position materially changes direct-sun occlusion',
      'one aerial acquisition cannot establish all current operational panel positions',
    ],
    exactAsBuiltGeometryEstablished: false,
    everyOperationalPositionEstablished: false,
  },
];

const sourceInputs = sourceManifest.sources.map((source) => ({
  path: source.localPath,
  sha256: source.sha256,
}));
const inputs = {
  sourceManifest: {
    path: relative(paths.sourceManifest),
    sha256: await fileDigest(paths.sourceManifest),
    artifactVersion: sourceManifest.artifactVersion,
  },
  officialSourceFiles: sourceInputs,
  manualPdfReview: {
    path: relative(paths.pdfReview),
    sha256: await fileDigest(paths.pdfReview),
  },
  renderManifests: renderInputs,
};

const stable = {
  analysisVersion: 'mariners-current-geometry-delta-audit-v1',
  inputs,
  stadiumId: 'mariners',
  assessedOn: '2026-08-10',
  sourceEvidence: {
    sourceAcquisitionArtifactVersion: sourceManifest.artifactVersion,
    sourceUrls: sourceManifest.sources.map((source) => source.resolvedUrl),
    currentPremiumProductsConfirmed: ['Diamond Club', 'Press Club'],
    reviewedPfdDocuments: pdfReview.reviewedDocuments,
  },
  changes,
  futureChangeRisks: [
    {
      changeId: '2027-lower-bowl-seat-replacement',
      sourceStatus: 'listed in the June 2026 provisional plan',
      exactAsBuiltGeometryEstablished: false,
    },
    {
      changeId: '2027-roof-control-repowering-phase-one',
      sourceStatus: 'listed in the June 2026 provisional plan',
      physicalRoofGeometryChangeEstablished: false,
    },
  ],
  currentGeometryAssessment: {
    lidarEpoch: '2021-04-14T00:39:21.868073Z through 2021-04-14T01:07:51.344876Z',
    lidarPredatesDocumentedStructuralChanges: true,
    assignedRowProviderCoordinatesCurrent: true,
    assignedRowProviderCoordinatesEstablishPhysicalMeasurement: false,
    currentChangeInventoryEstablished: true,
    currentCompletionOfEvery2026ProjectEstablished: false,
    currentSeatReplacementLocationsEstablished: false,
    currentMainBoardExactEnvelopeEstablished: false,
    everyCurrentOperationalRoofPositionEstablished: false,
    exactCurrentAsBuiltCoordinatesEstablished: false,
    exactCurrentObstructionHeightsEstablished: false,
    exactCurrentOverhangUndersidesEstablished: false,
    currentWatertightShadowCastingVolumeEstablished: false,
  },
  geometryBoundary: {
    establishesCurrentChangeClasses: true,
    establishesCurrentOfficialProductIdentity: true,
    establishesMeasuredHorizontalCoordinates: false,
    establishesMeasuredVerticalCoordinates: false,
    establishesAsBuiltDimensions: false,
    establishesOverhangUndersides: false,
    establishesEveryOperationalRoofPosition: false,
    establishesCurrentWatertightShadowCastingVolume: false,
  },
  publication: {
    eligible: false,
    blockers: [
      '2021_LIDAR_PREDATES_2022_THROUGH_2026_GEOMETRY_CHANGES',
      'CURRENT_SEAT_REPLACEMENT_LOCATIONS_NOT_PUBLISHED',
      'CURRENT_MAIN_BOARD_AS_BUILT_GEOMETRY_NOT_PUBLISHED',
      'CURRENT_ROOF_POSITION_VOLUMES_NOT_PUBLISHED',
      'CURRENT_OVERHANG_UNDERSIDES_NOT_PUBLISHED',
      'CURRENT_WATERTIGHT_SHADOW_CASTING_VOLUME_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'mariners-current-geometry-delta-audit',
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
  futureChangeRiskCount: artifact.futureChangeRisks.length,
  currentGeometryAssessment: artifact.currentGeometryAssessment,
  publication: artifact.publication,
}, null, 2));
