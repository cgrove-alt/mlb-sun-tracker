#!/usr/bin/env node

/**
 * Acquire the currently rendered 3D Digital Venue block-map tile responses.
 *
 * The public viewer establishes the provider session and decides which tile
 * URLs represent the current venue map. Every captured response is stored by
 * content hash, while the acquisition artifact records the exact response
 * metadata and a screenshot of the rendered viewer for audit review.
 *
 * Usage:
 *   node scripts/acquire3dVenueBlockmapTiles.mjs \
 *     --inventory=tmp/lidar/marlins-3ddv-metric-inventory.json \
 *     --output=tmp/lidar/marlins-3ddv-blockmap-tile-acquisition-v1.json \
 *     --tile-directory=tmp/lidar/marlins-3ddv-blockmap-tiles-v1 \
 *     --screenshot=tmp/lidar/marlins-3ddv-blockmap-render-v1.png
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, resolve } from 'node:path';

import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const inventoryPath = typeof args.inventory === 'string' ? args.inventory : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
const tileDirectoryPath = typeof args['tile-directory'] === 'string'
  ? args['tile-directory']
  : null;
const screenshotPath = typeof args.screenshot === 'string' ? args.screenshot : null;
if (!inventoryPath || !outputPath || !tileDirectoryPath || !screenshotPath) {
  throw new Error(
    'Required: --inventory=PATH --output=PATH --tile-directory=PATH --screenshot=PATH',
  );
}

const inventoryBytes = await readFile(inventoryPath);
const inventory = JSON.parse(inventoryBytes.toString('utf8'));
if (inventory?.artifactKind !== 'venue-metric-seat-inventory') {
  throw new Error('Input is not a venue-metric-seat-inventory artifact');
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const tileUrlPattern = /\/maps\/(?:blockmap|pricescalemap)\/tilemap\/.*\.(?:jpe?g|png)(?:[?#]|$)/i;
const manifestUrlPattern = /\/maps\/(?:blockmap|pricescalemap)\/master_full\.json(?:[?#]|$)/i;

function publicResourceUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  const version = parsed.searchParams.get('v');
  parsed.search = '';
  if (version) parsed.searchParams.set('v', version);
  parsed.hash = '';
  return parsed.toString();
}

function withTimeout(promise, milliseconds, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error(`Timed out after ${milliseconds} ms waiting for ${label}`)),
      milliseconds,
    )),
  ]);
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
const responseTasks = [];
let resolveManifest;
const manifestReady = new Promise((resolvePromise) => { resolveManifest = resolvePromise; });
let manifestUrl = null;

page.on('response', (response) => {
  const url = response.url();
  if (manifestUrlPattern.test(url)) {
    manifestUrl ??= url;
    resolveManifest(manifestUrl);
  }
  if (!tileUrlPattern.test(url)) return;
  responseTasks.push((async () => {
    const body = await response.body();
    return {
      url: publicResourceUrl(url),
      status: response.status(),
      contentType: response.headers()['content-type'] ?? null,
      lastModified: response.headers()['last-modified'] ?? null,
      etag: response.headers().etag ?? null,
      body,
      sha256: sha256(body),
    };
  })());
});

try {
  await page.goto(inventory.source.clubLinkedMapUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await withTimeout(manifestReady, 30_000, 'block-map manifest');
  await page.waitForTimeout(8_000);
  await mkdir(dirname(resolve(screenshotPath)), { recursive: true });
  await page.screenshot({ path: resolve(screenshotPath), fullPage: true });

  const settled = await Promise.allSettled(responseTasks);
  const failedResponses = settled
    .filter((result) => result.status === 'rejected')
    .map((result) => String(result.reason));
  const capturedByUrl = new Map();
  for (const result of settled) {
    if (result.status === 'fulfilled') capturedByUrl.set(result.value.url, result.value);
  }
  const captures = Array.from(capturedByUrl.values())
    .sort((left, right) => left.url.localeCompare(right.url));
  if (captures.length === 0) {
    const performanceUrls = await page.evaluate(() => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => /\/tilemap\/.*\.(?:jpe?g|png)(?:[?#]|$)/i.test(url)));
    throw new Error(
      `No block-map tiles were captured. Performance entries: ${JSON.stringify(performanceUrls)}`,
    );
  }

  const tileDirectory = resolve(tileDirectoryPath);
  await mkdir(tileDirectory, { recursive: true });
  const tileRecords = [];
  for (const capture of captures) {
    const urlPath = new URL(capture.url).pathname;
    const extension = extname(urlPath).toLowerCase() || '.bin';
    const fileName = `${capture.sha256}${extension}`;
    const filePath = resolve(tileDirectory, fileName);
    await writeFile(filePath, capture.body);
    tileRecords.push({
      url: capture.url,
      status: capture.status,
      contentType: capture.contentType,
      lastModified: capture.lastModified,
      etag: capture.etag,
      byteLength: capture.body.length,
      sha256: capture.sha256,
      file: `${basename(tileDirectory)}/${fileName}`,
    });
  }

  const screenshotBytes = await readFile(screenshotPath);
  const stable = {
    inputs: {
      inventory: {
        path: inventoryPath,
        sha256: sha256(inventoryBytes),
        artifactVersion: inventory.artifactVersion,
      },
    },
    stadiumId: inventory.stadiumId,
    venueId: inventory.venueId,
    source: {
      clubLinkedMapUrl: inventory.source.clubLinkedMapUrl,
      manifestUrl: publicResourceUrl(manifestUrl),
    },
    screenshot: {
      path: screenshotPath,
      byteLength: screenshotBytes.length,
      sha256: sha256(screenshotBytes),
    },
    tiles: tileRecords,
    failedResponseCaptures: failedResponses,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-blockmap-tile-acquisition',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    acquiredOn: new Date().toISOString(),
    ...stable,
    publication: {
      eligible: false,
      blockers: [
        'PROVIDER_BLOCKMAP_IS_NOT_SURVEY_CONTROL',
        'PROVIDER_ORIGIN_NOT_INDEPENDENTLY_VALIDATED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  await mkdir(dirname(resolve(outputPath)), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(JSON.stringify({
    outputPath: resolve(outputPath),
    artifactVersion: artifact.artifactVersion,
    screenshot: artifact.screenshot,
    capturedTileCount: tileRecords.length,
    failedResponseCaptureCount: failedResponses.length,
    sampleUrls: tileRecords.slice(0, 10).map((record) => record.url),
  }, null, 2));
} finally {
  await browser.close();
}
