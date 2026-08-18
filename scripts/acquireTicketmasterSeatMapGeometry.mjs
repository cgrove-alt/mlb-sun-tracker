#!/usr/bin/env node

/** Acquire public Ticketmaster seat-map geometry linked by an official MLB ticket page. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const stadiumId = typeof args['stadium-id'] === 'string' ? args['stadium-id'] : null;
const officialAuditPath = typeof args['official-audit'] === 'string'
  ? args['official-audit']
  : null;
const eventUrl = typeof args['event-url'] === 'string' ? args['event-url'] : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
const manifestPath = typeof args.manifest === 'string' ? args.manifest : null;
const allowNoAssignedRows = args['allow-no-assigned-rows'] === true;
if (!stadiumId || !officialAuditPath || !eventUrl || !outputPath || !manifestPath) {
  throw new Error(
    'Required: --stadium-id=ID --official-audit=PATH --event-url=URL '
      + '--output=PATH --manifest=PATH',
  );
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const officialAuditBytes = await readFile(officialAuditPath);
const officialAudit = JSON.parse(officialAuditBytes.toString('utf8'));
if (
  officialAudit.artifactKind !== 'official-mlb-rendered-ticket-provider-audit'
  || officialAudit.stadiumId !== stadiumId
) {
  throw new Error('Official ticket-provider audit does not match the requested stadium');
}
const auditedEventUrls = new Set((officialAudit.ticketProviderAnchors ?? [])
  .map((anchor) => anchor.href));
if (!auditedEventUrls.has(eventUrl)) {
  throw new Error('Event URL is not linked by the official ticket-provider audit');
}
const parsedEventUrl = new URL(eventUrl);
if (
  parsedEventUrl.protocol !== 'https:'
  || !['www.ticketmaster.com', 'www.ticketmaster.ca'].includes(parsedEventUrl.hostname)
) {
  throw new Error('Event URL is not an approved Ticketmaster HTTPS event page');
}
const eventIdMatch = parsedEventUrl.pathname.match(/^\/event\/([A-Za-z0-9]+)$/);
if (!eventIdMatch) throw new Error('Could not parse Ticketmaster event ID');
const eventId = eventIdMatch[1];
const geometryUrl = new URL(
  `https://mapsapi.tmol.io/maps/geometry/3/event/${eventId}/placeDetailNoKeys`,
);
geometryUrl.searchParams.set('useHostGrids', 'true');
geometryUrl.searchParams.set('app', 'PRD2663_EDP_NA');
geometryUrl.searchParams.set('sectionLevel', 'true');
geometryUrl.searchParams.set('systemId', 'HOST');

const response = await fetch(geometryUrl, {
  redirect: 'follow',
  headers: {
    Accept: 'application/json',
    'User-Agent': 'theshadium-current-ticket-map-audit/1.0',
  },
});
if (!response.ok) throw new Error(`Ticketmaster geometry returned HTTP ${response.status}`);
const resolvedUrl = new URL(response.url);
if (resolvedUrl.protocol !== 'https:' || resolvedUrl.hostname !== 'mapsapi.tmol.io') {
  throw new Error(`Unexpected Ticketmaster geometry redirect: ${response.url}`);
}
const bytes = Buffer.from(await response.arrayBuffer());
const raw = JSON.parse(bytes.toString('utf8'));
if (!Array.isArray(raw.pages) || raw.pages.length === 0) {
  throw new Error('Ticketmaster geometry has no pages');
}
let rowNodes = 0;
let seatPlaces = 0;
let sectionNodes = 0;
let compositeNodes = 0;
const walk = (node) => {
  if (node.segmentCategory === 'COMPOSITE') compositeNodes += 1;
  if (node.segmentCategory === 'SECTION') sectionNodes += 1;
  if (node.segmentCategory === 'ROW') {
    if (!Array.isArray(node.placesNoKeys) || node.placesNoKeys.length !== node.totalPlaces) {
      throw new Error(`Incomplete Ticketmaster row ${node.id ?? node.name ?? ''}`);
    }
    rowNodes += 1;
    seatPlaces += node.placesNoKeys.length;
  }
  for (const child of node.segments ?? []) walk(child);
};
for (const page of raw.pages) {
  if (!Number.isFinite(page.width) || !Number.isFinite(page.height)) {
    throw new Error('Ticketmaster geometry page dimensions are invalid');
  }
  for (const segment of page.segments ?? []) walk(segment);
}
if (!allowNoAssignedRows && (rowNodes === 0 || seatPlaces === 0)) {
  throw new Error('Ticketmaster geometry contains no assigned-row places');
}
if (sectionNodes === 0) throw new Error('Ticketmaster geometry contains no sections');

const output = resolve(outputPath);
const manifest = resolve(manifestPath);
await mkdir(dirname(output), { recursive: true });
await mkdir(dirname(manifest), { recursive: true });
await writeFile(output, bytes);
const stable = {
  stadiumId,
  eventId,
  eventUrl,
  sourceUrl: geometryUrl.toString(),
  resolvedUrl: response.url,
  retrievedOn: new Date().toISOString(),
  output,
  byteLength: bytes.length,
  sha256: sha256(bytes),
  officialTicketProviderAudit: {
    path: officialAuditPath,
    sha256: sha256(officialAuditBytes),
    artifactVersion: officialAudit.artifactVersion,
    officialPageArtifactVersion: officialAudit.officialPageArtifactVersion,
  },
  responseHeaders: {
    date: response.headers.get('date'),
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
    contentType: response.headers.get('content-type'),
    cacheControl: response.headers.get('cache-control'),
  },
  inventory: {
    pages: raw.pages.length,
    compositeNodes,
    sectionNodes,
    rowNodes,
    seatPlaces,
    noAssignedRowsAccepted: allowNoAssignedRows && rowNodes === 0,
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'ticketmaster-seat-map-geometry-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  ...stable,
};
await writeFile(manifest, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath: manifest,
  artifactVersion: artifact.artifactVersion,
  stadiumId,
  eventId,
  compositeNodes,
  sectionNodes,
  rowNodes,
  seatPlaces,
  rawSha256: artifact.sha256,
}, null, 2));
