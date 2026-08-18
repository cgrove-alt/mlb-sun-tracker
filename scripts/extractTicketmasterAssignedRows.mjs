#!/usr/bin/env node

/** Extract direct provider-pixel assigned-row geometry from a Ticketmaster map. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const acquisitionPath = typeof args.acquisition === 'string' ? args.acquisition : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!acquisitionPath || !outputPath) {
  throw new Error('Required: --acquisition=PATH --output=PATH');
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const acquisitionBytes = await readFile(acquisitionPath);
const acquisition = JSON.parse(acquisitionBytes.toString('utf8'));
if (acquisition.artifactKind !== 'ticketmaster-seat-map-geometry-acquisition') {
  throw new Error('Input is not a Ticketmaster seat-map geometry acquisition');
}
const rawBytes = await readFile(resolve(acquisition.output));
if (sha256(rawBytes) !== acquisition.sha256) {
  throw new Error('Ticketmaster raw geometry hash does not match its acquisition');
}
const raw = JSON.parse(rawBytes.toString('utf8'));
const rows = [];
const rowKeys = new Set();
const seatIds = new Set();
let providerTotalPlaces = 0;

const walk = (node, context) => {
  const nextContext = { ...context };
  if (node.segmentCategory === 'COMPOSITE') {
    nextContext.compositeId = node.id;
    nextContext.compositeName = node.name;
  }
  if (node.segmentCategory === 'SECTION') {
    nextContext.sectionNodeId = node.id;
    nextContext.sectionName = node.name;
  }
  if (node.segmentCategory === 'ROW') {
    if (!nextContext.sectionName || !node.name) {
      throw new Error(`Ticketmaster row ${node.id ?? ''} lacks section or row identity`);
    }
    const rowKey = `${nextContext.sectionName}:${node.name}`;
    if (rowKeys.has(rowKey)) throw new Error(`Duplicate Ticketmaster row key ${rowKey}`);
    rowKeys.add(rowKey);
    if (!Array.isArray(node.placesNoKeys) || node.placesNoKeys.length !== node.totalPlaces) {
      throw new Error(`Ticketmaster row ${rowKey} has incomplete place geometry`);
    }
    const seats = node.placesNoKeys.map((place, index) => {
      if (
        !Array.isArray(place)
        || place.length < 5
        || typeof place[0] !== 'string'
        || typeof place[1] !== 'string'
        || !Number.isFinite(place[2])
        || !Number.isFinite(place[3])
      ) {
        throw new Error(`Invalid Ticketmaster place in ${rowKey}`);
      }
      if (seatIds.has(place[0])) throw new Error(`Duplicate Ticketmaster seat ID ${place[0]}`);
      seatIds.add(place[0]);
      return {
        providerPlaceId: place[0],
        seatLabel: place[1],
        positionProviderPixels: [place[2], place[3]],
        providerRotation: place[4],
        providerAttributes: place.slice(5),
        providerOrder: index,
      };
    });
    providerTotalPlaces += node.totalPlaces;
    const middleIndex = Math.floor((seats.length - 1) / 2);
    rows.push({
      rowKey,
      compositeId: nextContext.compositeId ?? null,
      compositeName: nextContext.compositeName ?? null,
      sectionNodeId: nextContext.sectionNodeId,
      sectionName: nextContext.sectionName,
      rowNodeId: node.id,
      rowName: node.name,
      providerPlaceSizePixels: node.placeSize ?? null,
      providerTotalPlaces: node.totalPlaces,
      seats,
      anchors: {
        first: seats[0],
        middle: seats[middleIndex],
        last: seats[seats.length - 1],
      },
    });
  }
  for (const child of node.segments ?? []) walk(child, nextContext);
};
for (let pageIndex = 0; pageIndex < raw.pages.length; pageIndex += 1) {
  for (const segment of raw.pages[pageIndex].segments ?? []) {
    walk(segment, { pageIndex });
  }
}
rows.sort((left, right) => left.rowKey.localeCompare(right.rowKey, undefined, {
  numeric: true,
}));

const pageFrames = raw.pages.map((page, pageIndex) => ({
  pageIndex,
  widthProviderPixels: page.width,
  heightProviderPixels: page.height,
  images: (page.images ?? []).map((image) => ({
    type: image.type,
    url: image.url,
    x: image.x,
    y: image.y,
    width: image.width,
    height: image.height,
  })),
}));
const fingerprintInput = {
  acquisitionArtifactVersion: acquisition.artifactVersion,
  rawSha256: acquisition.sha256,
  pageFrames,
  rows,
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'ticketmaster-assigned-row-map-geometry',
  artifactVersion: `sha256:${sha256(JSON.stringify(fingerprintInput))}`,
  stadiumId: acquisition.stadiumId,
  provider: 'Ticketmaster',
  eventId: acquisition.eventId,
  eventUrl: acquisition.eventUrl,
  extractedOn: new Date().toISOString(),
  inputs: {
    acquisition: {
      path: resolve(acquisitionPath),
      sha256: sha256(acquisitionBytes),
      artifactVersion: acquisition.artifactVersion,
    },
    rawGeometry: {
      path: resolve(acquisition.output),
      sha256: acquisition.sha256,
    },
    ...(acquisition.officialTicketProviderAudit?.path
      && acquisition.officialTicketProviderAudit?.sha256
      ? {
        officialTicketProviderAudit: {
          path: resolve(acquisition.officialTicketProviderAudit.path),
          sha256: acquisition.officialTicketProviderAudit.sha256,
          artifactVersion: acquisition.officialTicketProviderAudit.artifactVersion,
        },
      }
      : {}),
  },
  acquisition: {
    path: acquisitionPath,
    artifactVersion: acquisition.artifactVersion,
    rawSha256: acquisition.sha256,
    retrievedOn: acquisition.retrievedOn,
    sourceUrl: acquisition.sourceUrl,
    officialTicketProviderAudit: acquisition.officialTicketProviderAudit,
  },
  coordinateReference: {
    kind: 'TICKETMASTER_PROVIDER_MAP_PIXELS',
    dimensions: 2,
    metric: false,
    elevationIncluded: false,
    trueNorthRegistered: false,
    note: 'Coordinates are direct Ticketmaster seat-map pixels. They are not metres, survey coordinates, world coordinates, or evidence of row elevation.',
  },
  pageFrames,
  completeness: {
    providerRowNodes: rows.length,
    extractedRows: rows.length,
    providerTotalPlaces,
    extractedPlaces: seatIds.size,
    providerMapCoordinateCoveragePercent: providerTotalPlaces === 0
      ? 0
      : (seatIds.size / providerTotalPlaces) * 100,
    duplicateRowKeys: 0,
    duplicatePlaceIds: 0,
    providerMapInternalCompletenessPassed:
      rows.length > 0 && providerTotalPlaces > 0 && providerTotalPlaces === seatIds.size,
    assignedSeatCoverageClaimAllowed: false,
    assignedSeatCoverageBlockers: [
      'NON_ROW_TICKET_PRODUCTS_NOT_SEMANTICALLY_AUDITED',
      'PROVIDER_MAP_NOT_REGISTERED_TO_METRIC_STADIUM_FRAME',
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
  stadiumId: artifact.stadiumId,
  rows: rows.length,
  seats: seatIds.size,
  providerMapCoordinateCoveragePercent:
    artifact.completeness.providerMapCoordinateCoveragePercent,
  assignedSeatCoverageClaimAllowed:
    artifact.completeness.assignedSeatCoverageClaimAllowed,
  publication: artifact.publication,
}, null, 2));
