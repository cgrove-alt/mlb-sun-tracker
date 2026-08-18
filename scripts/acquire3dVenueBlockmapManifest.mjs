#!/usr/bin/env node

/**
 * Acquire a 3D Digital Venue block-map manifest through the public viewer's
 * signed browser session. The raw response and a checksum-locked acquisition
 * manifest are written separately so provider labels can be audited without
 * relying on the rendered SVG or product identifiers alone.
 *
 * Usage:
 *   node scripts/acquire3dVenueBlockmapManifest.mjs \
 *     --inventory=tmp/lidar/reds-3ddv-metric-inventory.json \
 *     --output=tmp/lidar/reds-3ddv-blockmap-master.json \
 *     --manifest=tmp/lidar/reds-3ddv-blockmap-master-acquisition.json
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const inventoryPath = typeof args.inventory === 'string' ? args.inventory : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
const manifestPath = typeof args.manifest === 'string' ? args.manifest : null;
if (!inventoryPath || !outputPath || !manifestPath) {
  throw new Error('Required: --inventory=PATH --output=PATH --manifest=PATH');
}

const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
if (inventory?.artifactKind !== 'venue-metric-seat-inventory') {
  throw new Error('Input is not a venue-metric-seat-inventory artifact');
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
let resolveUrl;
const urlReady = new Promise((resolvePromise) => { resolveUrl = resolvePromise; });
page.on('response', (response) => {
  if (/\/maps\/blockmap\/master_full\.json(?:[?#]|$)/.test(response.url())) {
    resolveUrl(response.url());
  }
});

function withTimeout(promise, milliseconds, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error(`Timed out after ${milliseconds} ms waiting for ${label}`)),
      milliseconds,
    )),
  ]);
}

try {
  await page.goto(inventory.source.clubLinkedMapUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  const sourceUrl = await withTimeout(urlReady, 30_000, 'block-map manifest');
  const acquisition = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: 'include' });
    const body = await response.text();
    return {
      status: response.status,
      resolvedUrl: response.url,
      contentType: response.headers.get('content-type'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      body,
    };
  }, sourceUrl);
  if (acquisition.status !== 200) {
    throw new Error(`Block-map manifest returned HTTP ${acquisition.status}`);
  }
  const parsed = JSON.parse(acquisition.body);
  const normalized = `${JSON.stringify(parsed, null, 2)}\n`;
  const bytes = Buffer.from(normalized, 'utf8');
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const output = resolve(outputPath);
  const acquisitionManifest = resolve(manifestPath);
  const stable = {
    inventoryArtifactVersion: inventory.artifactVersion,
    stadiumId: inventory.stadiumId,
    venueId: inventory.venueId,
    sourceUrl,
    resolvedUrl: acquisition.resolvedUrl,
    retrievedOn: new Date().toISOString(),
    output,
    byteLength: bytes.length,
    sha256,
    responseHeaders: {
      contentType: acquisition.contentType,
      lastModified: acquisition.lastModified,
      etag: acquisition.etag,
    },
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-blockmap-manifest-acquisition',
    artifactVersion: `sha256:${createHash('sha256')
      .update(JSON.stringify(stable))
      .digest('hex')}`,
    ...stable,
    publication: {
      eligible: false,
      blockers: [
        'PRODUCT_SEMANTICS_NOT_REVIEWED',
        'METRIC_ZONE_GEOMETRY_NOT_EXTRACTED',
        'SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, bytes);
  await writeFile(acquisitionManifest, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(JSON.stringify({
    output,
    acquisitionManifest,
    sha256,
    byteLength: bytes.length,
    artifactVersion: artifact.artifactVersion,
  }, null, 2));
} finally {
  await browser.close();
}
