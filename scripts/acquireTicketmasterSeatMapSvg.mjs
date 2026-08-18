#!/usr/bin/env node

/** Acquire the public SVG backdrop bound to a Ticketmaster geometry artifact. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
for (const name of ['acquisition', 'output', 'manifest']) {
  if (typeof args[name] !== 'string') throw new Error(`Required: --${name}=PATH`);
}
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const acquisitionBytes = await readFile(args.acquisition);
const acquisition = JSON.parse(acquisitionBytes.toString('utf8'));
if (acquisition.artifactKind !== 'ticketmaster-seat-map-geometry-acquisition') {
  throw new Error('Input is not a Ticketmaster geometry acquisition');
}
const rawBytes = await readFile(resolve(acquisition.output));
if (sha256(rawBytes) !== acquisition.sha256) {
  throw new Error('Ticketmaster raw geometry hash does not match its acquisition');
}
const raw = JSON.parse(rawBytes.toString('utf8'));
if (raw.pages.length !== 1) {
  throw new Error(`Expected one Ticketmaster map page, received ${raw.pages.length}`);
}
const page = raw.pages[0];
const svgImages = (page.images ?? []).filter((image) => image.type === 'SVG');
if (svgImages.length !== 1) {
  throw new Error(`Expected one Ticketmaster SVG image, received ${svgImages.length}`);
}
const image = svgImages[0];
if (!/^\d{2}\/\d{2}\/\d+$/.test(image.url)) {
  throw new Error(`Unexpected Ticketmaster SVG identifier ${image.url}`);
}
const imageUrl = new URL(`https://mapsapi.tmol.io/maps/geometry/image/${image.url}`);
imageUrl.searchParams.set('removeFilters', 'ISM_Shadow');
imageUrl.searchParams.set('avertaFonts', 'true');
imageUrl.searchParams.set('app', 'PRD2663_EDP_NA');
const response = await fetch(imageUrl, {
  redirect: 'follow',
  headers: {
    Accept: 'image/svg+xml,text/xml;q=0.9,*/*;q=0.8',
    'User-Agent': 'theshadium-current-ticket-map-audit/1.0',
  },
});
if (!response.ok) throw new Error(`Ticketmaster SVG returned HTTP ${response.status}`);
const resolvedUrl = new URL(response.url);
if (resolvedUrl.protocol !== 'https:' || resolvedUrl.hostname !== 'mapsapi.tmol.io') {
  throw new Error(`Unexpected Ticketmaster SVG redirect: ${response.url}`);
}
const svgBytes = Buffer.from(await response.arrayBuffer());
const svg = svgBytes.toString('utf8');
const root = svg.match(/<svg\b([^>]*)>/i)?.[1] ?? null;
if (!root) throw new Error('Ticketmaster response is not an SVG document');
const viewBox = root.match(/\bviewBox="([^"]+)"/i)?.[1]
  ?.trim().split(/\s+/).map(Number) ?? [];
if (
  viewBox.length !== 4
  || viewBox.some((value) => !Number.isFinite(value))
  || viewBox[0] !== 0
  || viewBox[1] !== 0
  || viewBox[2] !== page.width
  || viewBox[3] !== page.height
) {
  throw new Error('Ticketmaster SVG viewBox does not match its geometry page');
}
const output = resolve(args.output);
const manifestPath = resolve(args.manifest);
await mkdir(dirname(output), { recursive: true });
await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(output, svgBytes);
const stable = {
  stadiumId: acquisition.stadiumId,
  eventId: acquisition.eventId,
  sourceUrl: imageUrl.toString(),
  resolvedUrl: response.url,
  retrievedOn: new Date().toISOString(),
  output,
  byteLength: svgBytes.length,
  sha256: sha256(svgBytes),
  geometryAcquisition: {
    path: args.acquisition,
    sha256: sha256(acquisitionBytes),
    artifactVersion: acquisition.artifactVersion,
    rawSha256: acquisition.sha256,
  },
  imagePlacement: {
    type: image.type,
    providerImageId: image.url,
    x: image.x,
    y: image.y,
    width: image.width,
    height: image.height,
  },
  coordinateFrame: {
    viewBox,
    geometryPageWidth: page.width,
    geometryPageHeight: page.height,
    sharesProviderMapCoordinatesWithSeats: true,
  },
  responseHeaders: {
    date: response.headers.get('date'),
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
    contentType: response.headers.get('content-type'),
    cacheControl: response.headers.get('cache-control'),
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'ticketmaster-seat-map-svg-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  ...stable,
};
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId: artifact.stadiumId,
  eventId: artifact.eventId,
  viewBox,
  byteLength: artifact.byteLength,
  svgSha256: artifact.sha256,
}, null, 2));
