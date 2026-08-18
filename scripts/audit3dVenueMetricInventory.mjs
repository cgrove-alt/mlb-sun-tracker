#!/usr/bin/env node

/**
 * Inventory every current section manifest exposed by a club-linked public 3D
 * Digital Venue map. This records the exact seat-anchor extraction scope but
 * does not claim metric geometry, georeferencing, or publication eligibility.
 *
 * Usage:
 *   node scripts/audit3dVenueMetricInventory.mjs \
 *     --stadium=phillies \
 *     --url=https://map.3ddigitalvenue.com/philadelphia-phillies \
 *     --output=tmp/lidar/phillies-3ddv-metric-inventory.json
 */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const stadiumId = typeof args.stadium === 'string' ? args.stadium : null;
const mapUrl = typeof args.url === 'string' ? args.url : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!stadiumId || !mapUrl || !outputPath) {
  console.error('Required: --stadium=ID --url=URL --output=PATH');
  process.exit(2);
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
let venueId = null;
let rootMapManifestUrl = null;
let resolveRootMap;
const rootMapReady = new Promise((resolve) => { resolveRootMap = resolve; });

function withTimeout(promise, milliseconds, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error(`Timed out after ${milliseconds} ms waiting for ${label}`)),
      milliseconds,
    )),
  ]);
}

page.on('response', (response) => {
  const url = response.url();
  const tokenMatch = url.match(/\/api\/v1\/dvm\/token\/venue\/([^/?#]+)/);
  if (tokenMatch) venueId = tokenMatch[1];
  if (/\/maps\/(?:blockmap|pricescalemap)\/master_full\.json(?:[?#]|$)/.test(url)) {
    rootMapManifestUrl ??= url;
    resolveRootMap(rootMapManifestUrl);
  }
});

try {
  await page.goto(mapUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await withTimeout(rootMapReady, 30_000, 'root map manifest');
  const sectionInputs = page.locator('ng-multiselect-dropdown')
    .nth(0)
    .locator('input[type="checkbox"]');
  let sourceMapIds = [];
  try {
    await sectionInputs.first().waitFor({ state: 'attached', timeout: 5_000 });
    sourceMapIds = await sectionInputs.evaluateAll((inputs) => inputs
      .map((input) => input.getAttribute('aria-label'))
      .filter((value) => typeof value === 'string' && value.length > 0)
      .map((value) => `S_${value}`));
  } catch {
    const rootMapSvgUrl = rootMapManifestUrl.replace(
      '/master_full.json',
      '/mainlayer.svg',
    );
    sourceMapIds = await page.evaluate(async (url) => {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error(`Root map SVG request failed with ${response.status}`);
      const markup = await response.text();
      const document = new DOMParser().parseFromString(markup, 'image/svg+xml');
      return Array.from(new Set(Array.from(document.querySelectorAll('[id^="S_"], [id^="G_"]'))
        .map((element) => element.id)
        .filter(Boolean)));
    }, rootMapSvgUrl);
  }
  if (sourceMapIds.length === 0) throw new Error('Current public map exposes no seat-map IDs');
  const expectedVenueId = venueId;
  if (expectedVenueId === null) throw new Error('Current public map exposed no venue ID');

  const fetchInventoryChunk = async (ids) => page.evaluate(async ({ ids: requestIds, rootMapUrl }) => {
    const results = [];
    const parsed = new URL(rootMapUrl);
    const markerMatch = parsed.pathname.match(/\/maps\/[^/]+\/master_full\.json$/);
    if (!markerMatch) throw new Error('Unexpected root map resource URL');
    const markerIndex = parsed.pathname.lastIndexOf(markerMatch[0]);
    const mapRoot = `${parsed.origin}${parsed.pathname.slice(0, markerIndex)}/maps`;
    const version = parsed.searchParams.get('v');
    for (let offset = 0; offset < requestIds.length; offset += 12) {
      const batch = requestIds.slice(offset, offset + 12);
      const batchResults = await Promise.all(batch.map(async (sourceMapId) => {
        const sectionId = sourceMapId.startsWith('S_') ? sourceMapId.slice(2) : sourceMapId;
        const url = `${mapRoot}/${encodeURIComponent(sourceMapId)}/master_full.json${version ? `?v=${encodeURIComponent(version)}` : ''}`;
        try {
          const response = await fetch(url, { credentials: 'include' });
          if (!response.ok) {
            return { sectionId, sourceMapId, status: response.status, seatIds: [], rowIds: [] };
          }
          const manifest = await response.json();
          const seatIds = Array.isArray(manifest?.n)
            ? manifest.n
              .filter((group) => group?.h?.t === 'seat' && Array.isArray(group?.n))
              .flatMap((group) => group.n)
              .map((node) => node?.i)
              .filter((id) => typeof id === 'string')
            : [];
          const rowIds = Array.from(new Set(seatIds.map((seatId) => {
            const match = seatId.match(/^S_(.+)-([^-]+)-([^-]+)$/);
            if (!match) return null;
            const [, ticketSectionId, rowId] = match;
            return ticketSectionId === sectionId ? rowId : `${ticketSectionId}:${rowId}`;
          }).filter(Boolean)));
          return {
            sectionId,
            sourceMapId,
            status: response.status,
            lastModified: response.headers.get('last-modified'),
            etag: response.headers.get('etag'),
            seatIds,
            rowIds,
          };
        } catch (error) {
          return { sectionId, sourceMapId, error: String(error), seatIds: [], rowIds: [] };
        }
      }));
      results.push(...batchResults);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    return results;
  }, { ids, rootMapUrl: rootMapManifestUrl });

  const refreshVenueAccess = async () => {
    venueId = null;
    await page.goto(mapUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    for (let attempt = 0; attempt < 40 && venueId === null; attempt += 1) {
      await page.waitForTimeout(250);
    }
    if (venueId !== expectedVenueId) {
      throw new Error(`Refreshed venue ID ${venueId} does not match ${expectedVenueId}`);
    }
  };
  const inventory = [];
  const authorizationChunkSize = 48;
  for (let offset = 0; offset < sourceMapIds.length; offset += authorizationChunkSize) {
    if (offset > 0) await refreshVenueAccess();
    const chunkIds = sourceMapIds.slice(offset, offset + authorizationChunkSize);
    let chunk = await fetchInventoryChunk(chunkIds);
    const retryIds = chunk
      .filter((record) => record.status === 401 || record.status === 403 || record.error)
      .map((record) => record.sourceMapId);
    if (retryIds.length > 0) {
      await refreshVenueAccess();
      const retries = await fetchInventoryChunk(retryIds);
      const retryById = new Map(retries.map((record) => [record.sourceMapId, record]));
      chunk = chunk.map((record) => retryById.get(record.sourceMapId) ?? record);
    }
    inventory.push(...chunk);
  }

  const claimedSeatIds = new Set();
  let duplicateSeatReferences = 0;
  const canonicalInventory = inventory.map((section) => {
    const uniqueSeatIds = section.seatIds.filter((seatId) => {
      if (claimedSeatIds.has(seatId)) {
        duplicateSeatReferences += 1;
        return false;
      }
      claimedSeatIds.add(seatId);
      return true;
    });
    const rowIds = Array.from(new Set(uniqueSeatIds.map((seatId) => {
      const match = seatId.match(/^S_(.+)-([^-]+)-([^-]+)$/);
      if (!match) return null;
      const [, ticketSectionId, rowId] = match;
      return ticketSectionId === section.sectionId ? rowId : `${ticketSectionId}:${rowId}`;
    }).filter(Boolean)));
    return {
      ...section,
      seatIds: uniqueSeatIds,
      rowIds,
      duplicateSeatReferencesRemoved: section.seatIds.length - uniqueSeatIds.length,
    };
  });

  const sectionsWithSeats = canonicalInventory.filter((section) => section.seatIds.length > 0);
  const requestFailures = canonicalInventory.filter((section) => section.status !== 200).length;
  const totalSeatAnchors = sectionsWithSeats.reduce(
    (sum, section) => sum + section.seatIds.length,
    0,
  );
  const totalRows = sectionsWithSeats.reduce((sum, section) => sum + section.rowIds.length, 0);
  const ticketSectionIds = Array.from(new Set(sectionsWithSeats.flatMap((section) =>
    section.seatIds.map((seatId) => seatId.match(/^S_(.+)-([^-]+)-([^-]+)$/)?.[1])
      .filter(Boolean))));
  const modifiedDates = sectionsWithSeats
    .map((section) => section.lastModified)
    .filter(Boolean)
    .toSorted((left, right) => Date.parse(left) - Date.parse(right));
  const fingerprintInput = {
    stadiumId,
    venueId,
    inventory: canonicalInventory.map((section) => ({
      sectionId: section.sectionId,
      sourceMapId: section.sourceMapId,
      status: section.status ?? null,
      lastModified: section.lastModified ?? null,
      etag: section.etag ?? null,
      seatIds: section.seatIds,
      rowIds: section.rowIds,
    })),
  };
  const artifactVersion = `sha256:${createHash('sha256')
    .update(JSON.stringify(fingerprintInput))
    .digest('hex')}`;
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-metric-seat-inventory',
    artifactVersion,
    stadiumId,
    venueId,
    auditedOn: new Date().toISOString(),
    source: {
      provider: '3D Digital Venue',
      clubLinkedMapUrl: mapUrl,
      finalMapUrl: page.url(),
      rootMapId: new URL(rootMapManifestUrl).pathname.match(/\/maps\/([^/]+)\/master_full\.json$/)?.[1] ?? null,
      liveSourceMapCount: sourceMapIds.length,
      liveSectionCount: ticketSectionIds.length,
      license: 'published-for-public-access',
    },
    summary: {
      requestedSections: sourceMapIds.length,
      ticketSections: ticketSectionIds.length,
      successfulSectionManifests: inventory.length - requestFailures,
      requestFailures,
      sectionsWithSeatAnchors: sectionsWithSeats.length,
      totalRows,
      totalSeatAnchors,
      duplicateSeatReferencesRemoved: duplicateSeatReferences,
      earliestLastModified: modifiedDates[0] ?? null,
      latestLastModified: modifiedDates.at(-1) ?? null,
    },
    sections: canonicalInventory,
    publication: {
      eligible: false,
      blockers: [
        'METRIC_ANCHORS_NOT_EXTRACTED',
        'VENUE_LOCAL_FRAME_NOT_REGISTERED',
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
    artifactVersion,
    stadiumId,
    venueId,
    ...artifact.summary,
    publication: artifact.publication,
  }, null, 2));
} finally {
  await browser.close();
}
