#!/usr/bin/env node

/** Merge disjoint Ticketmaster ticket-product row maps without overstating scope. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const artifactPaths = typeof args.artifacts === 'string'
  ? args.artifacts.split(',').filter(Boolean)
  : [];
const nonRowAcquisitionPaths = typeof args['non-row-acquisitions'] === 'string'
  ? args['non-row-acquisitions'].split(',').filter(Boolean)
  : [];
const outputPath = typeof args.output === 'string' ? args.output : null;
if (artifactPaths.length < 2 || !outputPath) {
  throw new Error(
    'Required: --artifacts=PATH,PATH --output=PATH '
      + '[--non-row-acquisitions=PATH,PATH]',
  );
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const loadedArtifacts = await Promise.all(artifactPaths.map(async (path) => {
  const bytes = await readFile(path);
  const artifact = JSON.parse(bytes.toString('utf8'));
  if (artifact.artifactKind !== 'ticketmaster-assigned-row-map-geometry') {
    throw new Error(`${path} is not a Ticketmaster assigned-row map`);
  }
  const fingerprintInput = {
    acquisitionArtifactVersion: artifact.acquisition?.artifactVersion,
    rawSha256: artifact.acquisition?.rawSha256,
    pageFrames: artifact.pageFrames,
    rows: artifact.rows,
  };
  const expectedVersion = `sha256:${sha256(JSON.stringify(fingerprintInput))}`;
  if (artifact.artifactVersion !== expectedVersion) {
    throw new Error(`${path} artifact version does not match its contents`);
  }
  if (
    artifact.coordinateReference?.kind !== 'TICKETMASTER_PROVIDER_MAP_PIXELS'
    || artifact.coordinateReference?.metric !== false
    || artifact.coordinateReference?.elevationIncluded !== false
  ) {
    throw new Error(`${path} has an unexpected coordinate reference`);
  }
  return { path, bytes, artifact };
}));
const stadiumId = loadedArtifacts[0].artifact.stadiumId;
if (loadedArtifacts.some(({ artifact }) => artifact.stadiumId !== stadiumId)) {
  throw new Error('Ticketmaster row-map artifacts do not describe the same stadium');
}

const loadedNonRowAcquisitions = await Promise.all(nonRowAcquisitionPaths.map(async (path) => {
  const bytes = await readFile(path);
  const acquisition = JSON.parse(bytes.toString('utf8'));
  if (
    acquisition.artifactKind !== 'ticketmaster-seat-map-geometry-acquisition'
    || acquisition.stadiumId !== stadiumId
  ) {
    throw new Error(`${path} is not a matching Ticketmaster acquisition`);
  }
  const rawBytes = await readFile(resolve(acquisition.output));
  if (sha256(rawBytes) !== acquisition.sha256) {
    throw new Error(`${path} raw geometry hash does not match its manifest`);
  }
  if (
    acquisition.inventory?.rowNodes !== 0
    || acquisition.inventory?.seatPlaces !== 0
    || acquisition.inventory?.noAssignedRowsAccepted !== true
  ) {
    throw new Error(`${path} is not an explicitly accepted non-row product map`);
  }
  return { path, bytes, acquisition };
}));

const rowKeys = new Set();
const namespacedPlaceIds = new Set();
const rows = [];
for (const { artifact } of loadedArtifacts) {
  for (const row of artifact.rows) {
    if (rowKeys.has(row.rowKey)) {
      throw new Error(`Ticketmaster product maps overlap at row ${row.rowKey}`);
    }
    rowKeys.add(row.rowKey);
    for (const seat of row.seats) {
      const namespacedPlaceId = `${artifact.eventId}:${seat.providerPlaceId}`;
      if (namespacedPlaceIds.has(namespacedPlaceId)) {
        throw new Error(`Duplicate namespaced place ID ${namespacedPlaceId}`);
      }
      namespacedPlaceIds.add(namespacedPlaceId);
    }
    rows.push({
      ...row,
      sourceEventId: artifact.eventId,
      sourceEventUrl: artifact.eventUrl,
      sourceArtifactVersion: artifact.artifactVersion,
    });
  }
}
rows.sort((left, right) => left.rowKey.localeCompare(right.rowKey, undefined, {
  numeric: true,
}));
const providerTotalPlaces = loadedArtifacts.reduce(
  (total, { artifact }) => total + artifact.completeness.providerTotalPlaces,
  0,
);
if (providerTotalPlaces !== namespacedPlaceIds.size) {
  throw new Error('Merged Ticketmaster place count is incomplete');
}

const sources = loadedArtifacts.map(({ path, bytes, artifact }) => ({
  path,
  sha256: sha256(bytes),
  artifactVersion: artifact.artifactVersion,
  eventId: artifact.eventId,
  eventUrl: artifact.eventUrl,
  rows: artifact.completeness.extractedRows,
  places: artifact.completeness.extractedPlaces,
}));
const nonRowProductMaps = loadedNonRowAcquisitions.map(({ path, bytes, acquisition }) => ({
  path,
  sha256: sha256(bytes),
  artifactVersion: acquisition.artifactVersion,
  eventId: acquisition.eventId,
  eventUrl: acquisition.eventUrl,
  sections: acquisition.inventory.sectionNodes,
  rows: acquisition.inventory.rowNodes,
  places: acquisition.inventory.seatPlaces,
}));
const fingerprintInput = {
  stadiumId,
  sources,
  nonRowProductMaps,
  rows,
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'ticketmaster-multi-product-assigned-row-map-geometry',
  artifactVersion: `sha256:${sha256(JSON.stringify(fingerprintInput))}`,
  stadiumId,
  provider: 'Ticketmaster',
  extractedOn: new Date().toISOString(),
  sources,
  nonRowProductMaps,
  coordinateReference: {
    kind: 'TICKETMASTER_PROVIDER_MAP_PIXELS',
    dimensions: 2,
    metric: false,
    elevationIncluded: false,
    trueNorthRegistered: false,
    note: 'Coordinates are direct Ticketmaster seat-map pixels in separate event frames. They are not metres, survey coordinates, world coordinates, or evidence of row elevation.',
  },
  completeness: {
    assignedRowProductMaps: sources.length,
    nonRowProductMaps: nonRowProductMaps.length,
    extractedRows: rows.length,
    providerTotalPlaces,
    extractedPlaces: namespacedPlaceIds.size,
    providerMapCoordinateCoveragePercent: providerTotalPlaces === 0
      ? 0
      : (namespacedPlaceIds.size / providerTotalPlaces) * 100,
    duplicateRowKeysAcrossProducts: 0,
    duplicateNamespacedPlaceIds: 0,
    providerMapInternalCompletenessPassed:
      rows.length > 0 && providerTotalPlaces === namespacedPlaceIds.size,
    assignedSeatCoverageClaimAllowed: false,
    assignedSeatCoverageBlockers: [
      'OFFICIAL_TICKET_PRODUCT_SEMANTICS_NOT_FULLY_RESOLVED',
      'NON_ROW_TICKET_PRODUCTS_NOT_SHADE_ADDRESSABLE',
      'PROVIDER_MAPS_NOT_REGISTERED_TO_ONE_METRIC_STADIUM_FRAME',
      'ROW_ELEVATIONS_NOT_MEASURED',
    ],
  },
  rows,
  publication: {
    eligible: false,
    blockers: [
      'NO_METRIC_STADIUM_FRAME',
      'ROW_ELEVATIONS_NOT_MEASURED',
      'OBSTRUCTION_GEOMETRY_NOT_INCLUDED',
      'SOURCE_CURRENCY_NOT_VERIFIED',
      'SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId,
  assignedRowProductMaps: sources.length,
  nonRowProductMaps: nonRowProductMaps.length,
  rows: rows.length,
  seats: namespacedPlaceIds.size,
  providerMapCoordinateCoveragePercent:
    artifact.completeness.providerMapCoordinateCoveragePercent,
  assignedSeatCoverageClaimAllowed:
    artifact.completeness.assignedSeatCoverageClaimAllowed,
  publication: artifact.publication,
}, null, 2));
