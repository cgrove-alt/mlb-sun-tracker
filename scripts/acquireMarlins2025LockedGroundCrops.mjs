#!/usr/bin/env node

/** Acquire native 0.25-foot official crops for already locked ground controls. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const SERVICE_URL = 'https://imageserverintra.miamidade.gov/arcgis/rest/services/WGS1984_WebMercator/2025_Woolpert_WGS1984_WebMercator/ImageServer';
const HALF_WIDTH_FEET = 90;
const PIXEL_SIZE_FEET = 0.25;
const DIMENSION = Math.round((HALF_WIDTH_FEET * 2) / PIXEL_SIZE_FEET);
const CONCURRENCY = 4;

function argument(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function required(name) {
  const value = argument(name);
  if (!value) throw new Error(`Required: --${name}`);
  return value;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function stableVersion(value) {
  return `sha256:${sha256(JSON.stringify(value))}`;
}

async function fetchResponse(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json,image/png',
      'user-agent': 'mlb-sun-tracker-locked-ground-crop-acquisition/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url.origin}${url.pathname}`);
  return response;
}

async function mapConcurrent(values, limit, callback) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= values.length) return;
      results[index] = await callback(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker));
  return results;
}

const controlsPath = required('controls');
const outputDirectory = required('output-dir');
const outputIndex = required('output-index');
const requestedRole = argument('role');
if (requestedRole && !['training', 'final-holdout'].includes(requestedRole)) {
  throw new Error('--role must be training or final-holdout');
}
const controlsBytes = await readFile(controlsPath);
const controls = JSON.parse(controlsBytes);
const acceptedLockStates = new Set([
  'reviewed-marlins-2025-full-tile-ground-controls|locked-before-full-tile-ground-localization',
  'reviewed-marlins-2025-fresh-full-tile-ground-controls|locked-before-fresh-full-tile-ground-localization',
  'reviewed-marlins-2025-fresh-hard-curb-controls|locked-before-v7-hard-curb-localization',
]);
const lockState = `${controls.artifactKind}|${controls.reviewStatus}`;
if (!acceptedLockStates.has(lockState)) {
  throw new Error('Input is not the locked full-tile ground controls');
}
if (controls.reviewProtocol.crossSensorOffsetsInspectedBeforeLock) {
  throw new Error('Ground controls were selected after offsets were inspected');
}
const allAccepted = controls.controls;
const expectedRoleCount = controls.artifactKind === 'reviewed-marlins-2025-fresh-hard-curb-controls'
  ? 12
  : 15;
if (!Array.isArray(allAccepted) || allAccepted.length !== expectedRoleCount * 2) {
  throw new Error(`Expected exactly ${expectedRoleCount * 2} locked ground controls`);
}
if (allAccepted.filter((record) => record.role === 'training').length !== expectedRoleCount) {
  throw new Error(`Expected ${expectedRoleCount} locked training controls`);
}
if (allAccepted.filter((record) => record.role === 'final-holdout').length !== expectedRoleCount) {
  throw new Error(`Expected ${expectedRoleCount} locked final holdouts`);
}
const accepted = requestedRole
  ? allAccepted.filter((record) => record.role === requestedRole)
  : allAccepted;

const metadataUrl = new URL(SERVICE_URL);
metadataUrl.searchParams.set('f', 'json');
const metadataResponse = await fetchResponse(metadataUrl);
const metadataText = await metadataResponse.text();
const metadata = JSON.parse(metadataText);
if (metadata.error) throw new Error(`ArcGIS metadata error: ${metadata.error.message}`);
if (metadata.maxImageWidth < DIMENSION || metadata.maxImageHeight < DIMENSION) {
  throw new Error('ArcGIS service limits do not permit the locked native crops');
}

await mkdir(outputDirectory, { recursive: true });
const crops = await mapConcurrent(accepted, CONCURRENCY, async (control) => {
  const [x, y] = control.statePlaneFeet;
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new Error(`Locked control ${control.candidateId} lacks a finite coordinate`);
  }
  const extent = {
    xmin: x - HALF_WIDTH_FEET,
    ymin: y - HALF_WIDTH_FEET,
    xmax: x + HALF_WIDTH_FEET,
    ymax: y + HALF_WIDTH_FEET,
  };
  const exportUrl = new URL(`${SERVICE_URL}/exportImage`);
  exportUrl.searchParams.set('bbox', [extent.xmin, extent.ymin, extent.xmax, extent.ymax].join(','));
  exportUrl.searchParams.set('bboxSR', '6438');
  exportUrl.searchParams.set('imageSR', '6438');
  exportUrl.searchParams.set('size', `${DIMENSION},${DIMENSION}`);
  exportUrl.searchParams.set('format', 'png');
  exportUrl.searchParams.set('pixelType', 'U8');
  exportUrl.searchParams.set('noData', '0');
  exportUrl.searchParams.set('interpolation', 'RSP_NearestNeighbor');
  exportUrl.searchParams.set('f', 'image');
  const response = await fetchResponse(exportUrl);
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('image/png')) {
    throw new Error(`Unexpected content type for ${control.candidateId}: ${contentType}`);
  }
  const imageBytes = Buffer.from(await response.arrayBuffer());
  if (imageBytes.length < 10_000) {
    throw new Error(`Native crop is unexpectedly small for ${control.candidateId}`);
  }
  const imagePath = join(outputDirectory, `${control.candidateId}.png`);
  const manifestPath = join(outputDirectory, `${control.candidateId}.json`);
  const stable = {
    candidateId: control.candidateId,
    role: control.role,
    semanticIdentity: control.semanticIdentity,
    lockedStatePlaneFeet: control.statePlaneFeet,
    serviceUrl: SERVICE_URL,
    extent,
    coordinateReferenceSystem: 'EPSG:6438',
    dimensionsPixels: [DIMENSION, DIMENSION],
    pixelSizeFeet: PIXEL_SIZE_FEET,
    resampling: 'nearest-neighbor',
    requestUrl: exportUrl.toString(),
    imageSha256: sha256(imageBytes),
    imageByteLength: imageBytes.length,
  };
  const manifest = {
    schemaVersion: 1,
    artifactKind: 'official-locked-ground-control-orthophoto-crop',
    artifactVersion: stableVersion(stable),
    stadiumId: 'marlins',
    sourceYear: 2025,
    sourceControlArtifact: {
      path: controlsPath,
      sha256: sha256(controlsBytes),
      artifactVersion: controls.artifactVersion,
    },
    ...stable,
    imagePath,
    publication: {
      eligibleByItself: false,
      blockers: [
        'NATIVE_GROUND_LOCALIZATION_NOT_YET_AUDITED',
        'FINAL_HOLDOUT_RESIDUALS_NOT_YET_SCORED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  await Promise.all([
    writeFile(imagePath, imageBytes),
    writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8'),
  ]);
  return {
    candidateId: control.candidateId,
    role: control.role,
    manifestPath,
    manifestSha256: sha256(await readFile(manifestPath)),
    artifactVersion: manifest.artifactVersion,
    imagePath,
    imageSha256: stable.imageSha256,
    imageByteLength: stable.imageByteLength,
  };
});

const stableIndex = {
  controlsPath,
  controlsSha256: sha256(controlsBytes),
  controlsArtifactVersion: controls.artifactVersion,
  serviceUrl: SERVICE_URL,
  serviceMetadataSha256: sha256(metadataText),
  cropHalfWidthFeet: HALF_WIDTH_FEET,
  pixelSizeFeet: PIXEL_SIZE_FEET,
  dimensionsPixels: [DIMENSION, DIMENSION],
  requestedRole: requestedRole ?? 'all',
  offsetsComputedDuringAcquisition: false,
  residualsComputedDuringAcquisition: false,
  crops,
};
const index = {
  schemaVersion: 1,
  artifactKind: 'marlins-2025-locked-ground-control-orthophoto-crop-index',
  artifactVersion: stableVersion(stableIndex),
  stadiumId: 'marlins',
  ...stableIndex,
  publication: {
    eligibleByItself: false,
    blockers: [
      'NATIVE_GROUND_LOCALIZATION_NOT_YET_AUDITED',
      'FINAL_HOLDOUT_RESIDUALS_NOT_YET_SCORED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
await mkdir(join(outputIndex, '..'), { recursive: true });
await writeFile(outputIndex, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputIndex,
  artifactVersion: index.artifactVersion,
  controlSource: basename(controlsPath),
  cropCount: crops.length,
  trainingCropCount: crops.filter((record) => record.role === 'training').length,
  finalHoldoutCropCount: crops.filter((record) => record.role === 'final-holdout').length,
  totalImageBytes: crops.reduce((sum, record) => sum + record.imageByteLength, 0),
  offsetsComputedDuringAcquisition: false,
  residualsComputedDuringAcquisition: false,
}, null, 2));
