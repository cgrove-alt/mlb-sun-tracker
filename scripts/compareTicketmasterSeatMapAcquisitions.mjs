#!/usr/bin/env node

/** Prove whether two official Ticketmaster event maps have identical bytes. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
for (const name of ['baseline', 'comparison', 'output']) {
  if (typeof args[name] !== 'string') throw new Error(`Required: --${name}=PATH`);
}
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const load = async (path) => {
  const manifestBytes = await readFile(path);
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  if (manifest.artifactKind !== 'ticketmaster-seat-map-geometry-acquisition') {
    throw new Error(`${path} is not a Ticketmaster geometry acquisition`);
  }
  const rawBytes = await readFile(resolve(manifest.output));
  if (sha256(rawBytes) !== manifest.sha256) {
    throw new Error(`${path} raw geometry hash does not match its manifest`);
  }
  return { path, manifestBytes, manifest, rawBytes };
};
const baseline = await load(args.baseline);
const comparison = await load(args.comparison);
if (baseline.manifest.stadiumId !== comparison.manifest.stadiumId) {
  throw new Error('Ticketmaster acquisitions do not describe the same stadium');
}
if (baseline.manifest.eventId === comparison.manifest.eventId) {
  throw new Error('Ticketmaster acquisitions do not describe distinct events');
}
if (baseline.manifest.sha256 !== comparison.manifest.sha256) {
  throw new Error('Ticketmaster event maps are not byte-identical');
}
if (!baseline.rawBytes.equals(comparison.rawBytes)) {
  throw new Error('Ticketmaster raw responses differ despite matching hashes');
}
const inventoryFields = ['pages', 'compositeNodes', 'sectionNodes', 'rowNodes', 'seatPlaces'];
for (const field of inventoryFields) {
  if (baseline.manifest.inventory?.[field] !== comparison.manifest.inventory?.[field]) {
    throw new Error(`Ticketmaster event map inventories differ at ${field}`);
  }
}
const record = ({ path, manifestBytes, manifest }) => ({
  acquisitionPath: path,
  acquisitionSha256: sha256(manifestBytes),
  artifactVersion: manifest.artifactVersion,
  eventId: manifest.eventId,
  eventUrl: manifest.eventUrl,
  sourceUrl: manifest.sourceUrl,
  retrievedOn: manifest.retrievedOn,
  rawSha256: manifest.sha256,
  inventory: manifest.inventory,
  responseHeaders: manifest.responseHeaders,
  officialTicketProviderAudit: manifest.officialTicketProviderAudit,
});
const stable = {
  stadiumId: baseline.manifest.stadiumId,
  baseline: record(baseline),
  comparison: record(comparison),
  assessment: {
    distinctOfficialEvents: true,
    rawGeometryByteIdentical: true,
    inventoryIdentical: true,
    stableProviderMapAcrossComparedEvents: true,
    metricGeometryEstablished: false,
    rowElevationEstablished: false,
    limitation: 'This proves provider-map identity only for the two compared events. It does not establish metric scale, elevation, true north, obstructions, or complete ticket-product semantics.',
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'ticketmaster-cross-event-seat-map-comparison',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  comparedOn: new Date().toISOString(),
  ...stable,
};
await mkdir(dirname(args.output), { recursive: true });
await writeFile(args.output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath: args.output,
  artifactVersion: artifact.artifactVersion,
  stadiumId: artifact.stadiumId,
  baselineEventId: artifact.baseline.eventId,
  comparisonEventId: artifact.comparison.eventId,
  rawSha256: artifact.baseline.rawSha256,
  assessment: artifact.assessment,
}, null, 2));
