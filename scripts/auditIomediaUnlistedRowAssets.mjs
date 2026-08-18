#!/usr/bin/env node

/**
 * Probe a bounded IOMEDIA row and seat naming grid with one-byte HTTP ranges.
 *
 * The result tests whether public panorama assets exist beyond the viewpoints
 * declared in a prior IOMEDIA inventory. It cannot prove that the naming grid
 * is exhaustive and never establishes assigned-row or publication coverage.
 *
 * Usage:
 *   node scripts/auditIomediaUnlistedRowAssets.mjs \
 *     --input=tmp/lidar/braves-iomedia-representative-viewpoints-v1.json \
 *     --section=150 --row-min=1 --row-max=27 --seat-min=1 --seat-max=25 \
 *     --output=tmp/lidar/braves-iomedia-section150-unlisted-row-audit-v1.json
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const options = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));

const requiredString = (name) => {
  const value = options[name];
  if (typeof value !== 'string' || value.length === 0) throw new Error(`Required: --${name}=VALUE`);
  return value;
};
const requiredInteger = (name) => {
  const value = Number.parseInt(requiredString(name), 10);
  if (!Number.isSafeInteger(value)) throw new Error(`--${name} must be an integer`);
  return value;
};
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const inputPath = resolve(requiredString('input'));
const outputPath = resolve(requiredString('output'));
const sectionId = requiredString('section');
const rowMinimum = requiredInteger('row-min');
const rowMaximum = requiredInteger('row-max');
const seatMinimum = requiredInteger('seat-min');
const seatMaximum = requiredInteger('seat-max');
const concurrency = Number.parseInt(options.concurrency ?? '12', 10);

if (!/^[A-Za-z0-9]+$/.test(sectionId)) throw new Error('Section must be alphanumeric');
if (rowMinimum < 1 || rowMaximum < rowMinimum) throw new Error('Row range is invalid');
if (seatMinimum < 1 || seatMaximum < seatMinimum) throw new Error('Seat range is invalid');
if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 24) {
  throw new Error('Concurrency must be an integer from 1 through 24');
}
const probeCount = (rowMaximum - rowMinimum + 1) * (seatMaximum - seatMinimum + 1);
if (probeCount > 5_000) throw new Error('Probe grid exceeds the 5,000-request safety limit');

const inputBytes = await readFile(inputPath);
const inventory = JSON.parse(inputBytes.toString('utf8'));
if (inventory.artifactKind !== 'iomedia-representative-viewpoint-inventory') {
  throw new Error('Input is not an IOMEDIA representative viewpoint inventory');
}
const appUrl = new URL(inventory.source?.appUrl);
if (appUrl.protocol !== 'https:' || !appUrl.hostname.endsWith('.io-media.com')) {
  throw new Error('Input application URL is not an HTTPS IOMEDIA host');
}
const providerRoot = `${appUrl.protocol}//${appUrl.host}`;
const configuredViewpoints = inventory.viewpoints
  .filter((viewpoint) => viewpoint.sectionId === sectionId)
  .map((viewpoint) => ({
    rowId: String(viewpoint.representativeRowId),
    seatId: String(viewpoint.representativeSeatId),
    elementModelName: viewpoint.elementModelName,
  }));
if (configuredViewpoints.length === 0) {
  throw new Error(`Input inventory has no configured viewpoints for section ${sectionId}`);
}
const configuredKeys = new Set(configuredViewpoints.map((viewpoint) => (
  `${viewpoint.rowId}:${viewpoint.seatId}`
)));

const candidates = [];
for (let row = rowMinimum; row <= rowMaximum; row += 1) {
  for (let seat = seatMinimum; seat <= seatMaximum; seat += 1) {
    const resourceId = `VR_Section_${sectionId}_${row}_${seat}`;
    candidates.push({
      row,
      seat,
      configured: configuredKeys.has(`${row}:${seat}`),
      url: `${providerRoot}/media/vrview/images_2048/Section_${sectionId}/${resourceId}/${resourceId}_Front.jpg`,
    });
  }
}

const statusCounts = {};
const found = [];
let nextIndex = 0;
const worker = async () => {
  while (nextIndex < candidates.length) {
    const index = nextIndex;
    nextIndex += 1;
    const candidate = candidates[index];
    const response = await fetch(candidate.url, {
      headers: {
        Accept: 'image/jpeg,*/*;q=0.1',
        Range: 'bytes=0-0',
        'User-Agent': 'theshadium-iomedia-row-asset-audit/1.0',
      },
    });
    const responseBytes = Buffer.from(await response.arrayBuffer());
    statusCounts[response.status] = (statusCounts[response.status] ?? 0) + 1;
    if (response.status === 200 || response.status === 206) {
      found.push({
        row: candidate.row,
        seat: candidate.seat,
        configured: candidate.configured,
        url: candidate.url,
        status: response.status,
        responseBytes: responseBytes.length,
        contentRange: response.headers.get('content-range'),
        sourceByteLength: Number.parseInt(
          response.headers.get('content-range')?.match(/\/(\d+)$/)?.[1] ?? '',
          10,
        ) || null,
        lastModified: response.headers.get('last-modified'),
        etag: response.headers.get('etag'),
      });
    }
  }
};
await Promise.all(Array.from({ length: Math.min(concurrency, probeCount) }, () => worker()));
found.sort((left, right) => left.row - right.row || left.seat - right.seat);

const foundKeys = new Set(found.map((record) => `${record.row}:${record.seat}`));
const configuredWithinGrid = configuredViewpoints.filter((viewpoint) => {
  const row = Number.parseInt(viewpoint.rowId, 10);
  const seat = Number.parseInt(viewpoint.seatId, 10);
  return Number.isSafeInteger(row) && Number.isSafeInteger(seat)
    && row >= rowMinimum && row <= rowMaximum
    && seat >= seatMinimum && seat <= seatMaximum;
});
const missingConfiguredAssets = configuredWithinGrid.filter((viewpoint) => (
  !foundKeys.has(`${viewpoint.rowId}:${viewpoint.seatId}`)
));
const unlistedFound = found.filter((record) => !record.configured);

const stable = {
  schemaVersion: 1,
  artifactKind: 'iomedia-unlisted-row-panorama-audit',
  stadiumId: inventory.stadiumId,
  source: {
    inventoryPath: inputPath,
    inventorySha256: sha256(inputBytes),
    inventoryArtifactVersion: inventory.artifactVersion,
    providerRoot,
    configuredViewpoints,
  },
  probe: {
    sectionId,
    rowMinimum,
    rowMaximum,
    seatMinimum,
    seatMaximum,
    probeCount,
    concurrency,
    requestMethod: 'GET with Range bytes=0-0',
    resourceTemplate: `${providerRoot}/media/vrview/images_2048/Section_{section}/VR_Section_{section}_{row}_{seat}/VR_Section_{section}_{row}_{seat}_Front.jpg`,
    statusCounts,
  },
  findings: {
    configuredViewpointsWithinGrid: configuredWithinGrid.length,
    configuredAssetsFound: found.filter((record) => record.configured).length,
    missingConfiguredAssets,
    unlistedAssetsFound: unlistedFound.length,
    found,
  },
  assessment: {
    configuredPathConventionValidated: (
      configuredWithinGrid.length > 0 && missingConfiguredAssets.length === 0
    ),
    unlistedRowAssetsFound: unlistedFound.length > 0,
    completeAssignedRowCoverageEstablished: false,
    publicationEligible: false,
    blockers: [
      ...(unlistedFound.length === 0 ? ['NO_UNLISTED_ROW_ASSETS_FOUND_IN_PROBED_GRID'] : []),
      'PROBE_GRID_CANNOT_PROVE_GLOBAL_ASSET_NONEXISTENCE',
      'CONFIGURED_VIEWPOINTS_REMAIN_REPRESENTATIVE_ONLY',
      'VENUE_LOCAL_METRIC_FRAME_NOT_AVAILABLE',
      'SOURCE_UNCERTAINTY_NOT_QUALIFIED',
      'SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  ...stable,
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  auditedOn: new Date().toISOString(),
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  probeCount,
  statusCounts,
  findings: artifact.findings,
  assessment: artifact.assessment,
}, null, 2));
