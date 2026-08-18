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

function requireEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    );
  }
}

function requireIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label}: required text was not found: ${JSON.stringify(expected)}`);
  }
}

function requireIsoYear(value, year, label) {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.getUTCFullYear() !== year) {
    throw new Error(`${label}: expected a valid ${year} date, received ${JSON.stringify(value)}`);
  }
}

async function readLockedFile(inputPath, encoding = null) {
  const resolvedPath = path.resolve(inputPath);
  const bytes = await readFile(resolvedPath);
  return {
    path: path.relative(process.cwd(), resolvedPath),
    sha256: sha256(bytes),
    bytes,
    text: encoding ? bytes.toString(encoding) : null,
  };
}

async function readLockedJson(inputPath) {
  const input = await readLockedFile(inputPath, 'utf8');
  return {
    ...input,
    value: JSON.parse(input.text),
  };
}

function lockedInput(input, additions = {}) {
  return {
    path: input.path,
    sha256: input.sha256,
    ...additions,
  };
}

const officialMapUrl = 'https://www.mlb.com/marlins/ballpark/seating-map/3d';
const providerMapUrl = 'https://venues.3ddigitalvenue.com/marlins?iframeMode=true';
const paths = {
  officialPage: option(
    'official-page',
    'tmp/lidar/marlins-current-provider-provenance-2026/official-mlb-3d-seating-map.html',
  ),
  officialManifest: option(
    'official-manifest',
    'tmp/lidar/marlins-current-provider-provenance-2026/'
      + 'official-mlb-3d-seating-map-manifest.json',
  ),
  metricRows: option('metric-rows', 'tmp/lidar/marlins-3ddv-metric-rows.json'),
  currentProviderAudit: option(
    'current-provider-audit',
    'tmp/lidar/marlins-current-3ddv-native-geometry-audit-v1-2026.json',
  ),
  output: option(
    'output',
    'tmp/lidar/marlins-current-provider-provenance-audit-v1-2026.json',
  ),
};

const [officialPage, officialManifest, metricRows, currentProviderAudit] = await Promise.all([
  readLockedFile(paths.officialPage, 'utf8'),
  readLockedJson(paths.officialManifest),
  readLockedJson(paths.metricRows),
  readLockedJson(paths.currentProviderAudit),
]);

requireEqual(
  officialManifest.value.artifactKind,
  'official-mlb-page-acquisition',
  'official page manifest kind',
);
requireEqual(officialManifest.value.sourceUrl, officialMapUrl, 'official page source URL');
requireEqual(officialManifest.value.resolvedUrl, officialMapUrl, 'official page resolved URL');
requireEqual(officialManifest.value.sha256, officialPage.sha256, 'official page checksum');
requireIncludes(
  officialPage.text,
  '<title data-next-head="">loanDepot park 3D Seating Map | Miami Marlins</title>',
  'official page title',
);
requireIncludes(
  officialPage.text,
  `data-src="${providerMapUrl}"`,
  'official page provider iframe',
);
requireEqual(metricRows.value.stadiumId, 'marlins', 'metric rows stadium');
requireEqual(
  metricRows.value.artifactKind,
  'venue-local-metric-row-anchors',
  'metric rows artifact kind',
);
requireEqual(
  metricRows.value.source?.provider,
  '3D Digital Venue',
  'metric rows provider',
);
requireEqual(
  metricRows.value.source?.clubLinkedMapUrl,
  providerMapUrl,
  'metric rows club-linked map URL',
);
requireEqual(
  currentProviderAudit.value.artifactKind,
  'marlins-current-3ddv-native-geometry-audit',
  'current provider audit kind',
);
requireEqual(currentProviderAudit.value.stadiumId, 'marlins', 'current provider stadium');
requireEqual(
  currentProviderAudit.value.inputs?.siteMaster?.path,
  'tmp/lidar/marlins-current-3ddv-viewer-source-audit-2026/master.json',
  'current provider site configuration input',
);

requireIsoYear(officialManifest.value.retrievedOn, 2026, 'official page retrieval');
requireIsoYear(
  officialManifest.value.responseHeaders?.date,
  2026,
  'official page HTTP response',
);
requireIsoYear(
  metricRows.value.source?.viewerConfigLastModified,
  2026,
  'metric rows viewer configuration last-modified',
);
requireIsoYear(
  metricRows.value.source?.latestLastModified,
  2026,
  'metric rows latest provider resource',
);
for (const [label, value] of [
  ['current viewer response', currentProviderAudit.value.inputs?.viewerHtml?.responseDate],
  ['current site configuration', currentProviderAudit.value.inputs?.siteMaster?.lastModified],
  ['current module manager', currentProviderAudit.value.inputs?.dvmManager?.lastModified],
  ['current 3D module', currentProviderAudit.value.inputs?.dvm3dModule?.lastModified],
  ['current 3D runtime', currentProviderAudit.value.inputs?.viewer3dRuntime?.lastModified],
]) {
  requireIsoYear(value, 2026, label);
}

const stable = {
  schemaVersion: 1,
  analysisVersion: 'marlins-current-provider-provenance-audit-v1',
  artifactKind: 'current-provider-source-provenance-audit',
  stadiumId: 'marlins',
  auditedOn: '2026-08-11',
  inputs: {
    officialPage: lockedInput(officialPage),
    officialManifest: lockedInput(officialManifest, {
      artifactVersion: officialManifest.value.artifactVersion,
    }),
    metricRows: lockedInput(metricRows, {
      artifactVersion: metricRows.value.artifactVersion,
    }),
    currentProviderAudit: lockedInput(currentProviderAudit, {
      artifactVersion: currentProviderAudit.value.artifactVersion,
    }),
  },
  officialPublication: {
    sourceUrl: officialManifest.value.sourceUrl,
    resolvedUrl: officialManifest.value.resolvedUrl,
    retrievedOn: officialManifest.value.retrievedOn,
    responseDate: officialManifest.value.responseHeaders.date,
    responseEtag: officialManifest.value.responseHeaders.etag,
    pageTitle: 'loanDepot park 3D Seating Map | Miami Marlins',
    embeddedProviderUrl: providerMapUrl,
  },
  providerSource: {
    provider: metricRows.value.source.provider,
    clubLinkedMapUrl: metricRows.value.source.clubLinkedMapUrl,
    venueId: metricRows.value.venueId,
    viewerVersion: metricRows.value.source.viewerVersion,
    panoramaSet: metricRows.value.source.panoramaSet,
    viewerConfigLastModified: metricRows.value.source.viewerConfigLastModified,
    earliestMetricResourceLastModified: metricRows.value.source.earliestLastModified,
    latestMetricResourceLastModified: metricRows.value.source.latestLastModified,
    liveViewerResponseDate:
      currentProviderAudit.value.inputs.viewerHtml.responseDate,
    liveViewerLastModified:
      currentProviderAudit.value.inputs.viewerHtml.lastModified,
    siteConfigurationLastModified:
      currentProviderAudit.value.inputs.siteMaster.lastModified,
    moduleManagerLastModified:
      currentProviderAudit.value.inputs.dvmManager.lastModified,
    viewer3dModuleLastModified:
      currentProviderAudit.value.inputs.dvm3dModule.lastModified,
    viewer3dRuntimeLastModified:
      currentProviderAudit.value.inputs.viewer3dRuntime.lastModified,
  },
  sourceCurrencyAssessment: {
    officialMlbPageRetrievedIn2026: true,
    officialMlbPageDirectlyEmbedsProviderUrl: true,
    metricArtifactUsesOfficiallyEmbeddedProviderUrl: true,
    providerViewerResourcesAcquiredLiveIn2026: true,
    providerMetricResourcesLastModifiedIn2026: true,
    currentProviderSourceProvenanceVerified: true,
    providerFeedPhysicalAccuracyVerified: false,
    currentPhysicalRowGeometryVerified: false,
  },
  evidenceBoundary: {
    establishesOfficialClubPublicationOfProviderMap: true,
    establishesOfficialIframeProviderIdentity: true,
    establishesCurrentProviderResourceAcquisition: true,
    establishesCurrentProviderSourceProvenance: true,
    resolvesProviderFeedSourceCurrencyBlocker: true,
    establishesProviderCoordinateAccuracy: false,
    establishesCurrentPhysicalRowGeometry: false,
    establishesPhysicalMeasurement: false,
    establishesVenueLocalFrameRegistration: false,
    establishesCurrentMetricObstructionGeometry: false,
    establishesIndependentShadowHoldout: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'PROVIDER_COORDINATE_ACCURACY_NOT_ESTABLISHED',
      'CURRENT_PHYSICAL_ROW_GEOMETRY_NOT_ESTABLISHED',
      'VENUE_LOCAL_FRAME_NOT_REGISTERED',
      'CURRENT_METRIC_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  ...stable,
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
};
const outputPath = path.resolve(paths.output);
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  output: path.relative(process.cwd(), outputPath),
  artifactVersion: artifact.artifactVersion,
  officialMapUrl,
  providerMapUrl,
  currentProviderSourceProvenanceVerified:
    artifact.sourceCurrencyAssessment.currentProviderSourceProvenanceVerified,
  publicationEligible: artifact.publication.eligible,
}, null, 2));
