#!/usr/bin/env node

/**
 * Resolve one current 3D Digital Venue panorama from a checksum-locked metric
 * row artifact and probe the viewer's documented resource layouts. This audit
 * records config fields and asset headers only. It does not treat rendered
 * imagery as measured obstruction geometry.
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const inventoryPath = typeof args.inventory === 'string' ? args.inventory : null;
const rowsPath = typeof args.rows === 'string' ? args.rows : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
const requestedSeatId = typeof args['seat-id'] === 'string' ? args['seat-id'] : null;
const downloadImagePath = typeof args['download-image'] === 'string'
  ? args['download-image']
  : null;
if (!inventoryPath || !rowsPath || !outputPath) {
  console.error('Required: --inventory=PATH --rows=PATH --output=PATH [--seat-id=ID]');
  process.exit(2);
}

const [inventory, rows] = await Promise.all([
  readFile(inventoryPath, 'utf8').then(JSON.parse),
  readFile(rowsPath, 'utf8').then(JSON.parse),
]);
if (inventory?.artifactKind !== 'venue-metric-seat-inventory') {
  throw new Error('Inventory is not a venue-metric-seat-inventory artifact');
}
if (rows?.artifactKind !== 'venue-local-metric-row-anchors') {
  throw new Error('Rows input is not a venue-local-metric-row-anchors artifact');
}
if (rows.inventoryArtifactVersion !== inventory.artifactVersion) {
  throw new Error('Rows do not match the inventory artifact version');
}
const allAnchors = rows.rows.flatMap((row) => row.anchors ?? []);
const selectedAnchor = requestedSeatId
  ? allAnchors.find((anchor) => anchor.seatId === requestedSeatId)
  : allAnchors[0];
if (!selectedAnchor) throw new Error(`Seat is absent from row anchors: ${requestedSeatId}`);

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
let rootMapManifestUrl = null;
let liveVenueId = null;
let resolveRootMap;
const rootMapReady = new Promise((resolve) => { resolveRootMap = resolve; });
page.on('response', (response) => {
  const url = response.url();
  const tokenMatch = url.match(/\/api\/v1\/dvm\/token\/venue\/([^/?#]+)/);
  if (tokenMatch) liveVenueId = tokenMatch[1];
  if (/\/maps\/(?:blockmap|pricescalemap)\/master_full\.json(?:[?#]|$)/.test(url)) {
    rootMapManifestUrl ??= url;
    resolveRootMap(rootMapManifestUrl);
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

function fingerprint(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex');
}

try {
  await page.goto(inventory.source.clubLinkedMapUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await withTimeout(rootMapReady, 30_000, 'root map manifest');
  if (liveVenueId !== inventory.venueId) {
    throw new Error(`Live venue ID ${liveVenueId} does not match ${inventory.venueId}`);
  }
  const parsedRootMapUrl = new URL(rootMapManifestUrl);
  const markerMatch = parsedRootMapUrl.pathname.match(
    /\/map-viewer\/sets\/default\/maps\/[^/]+\/master_full\.json$/,
  );
  if (!markerMatch) throw new Error('Unexpected current root map resource path');
  const markerIndex = parsedRootMapUrl.pathname.lastIndexOf(markerMatch[0]);
  const venueResourceRoot = `${parsedRootMapUrl.origin}${parsedRootMapUrl.pathname.slice(0, markerIndex)}`;
  const viewerVersion = '1.6.18';
  const viewerConfigUrl = `${venueResourceRoot}/viewer3d/config.json?v=${viewerVersion}`;
  const viewerConfigResult = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: 'include' });
    return {
      status: response.status,
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      config: response.ok ? await response.json() : null,
    };
  }, viewerConfigUrl);
  const panoramaSet = viewerConfigResult.config?.si;
  if (viewerConfigResult.status !== 200 || typeof panoramaSet !== 'string') {
    throw new Error(`Cannot resolve panorama set from ${viewerConfigUrl}`);
  }
  const panoramaRoot = `${venueResourceRoot}/viewer3d/panos/${encodeURIComponent(panoramaSet)}`;
  const seatConfigUrl = `${panoramaRoot}/${encodeURIComponent(selectedAnchor.seatId)}/config.json?v=${viewerVersion}`;
  const seatConfigResult = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: 'include' });
    const text = await response.text();
    return {
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      text,
    };
  }, seatConfigUrl);
  if (seatConfigResult.status !== 200) {
    throw new Error(`Seat config failed with HTTP ${seatConfigResult.status}`);
  }
  const seatConfig = JSON.parse(seatConfigResult.text);
  const imageCandidates = [];
  for (const resolution of ['hres', 'lres']) {
    for (let face = 0; face < 6; face += 1) {
      for (const extension of ['jpg', 'webp', 'png']) {
        imageCandidates.push(
          `${panoramaRoot}/${encodeURIComponent(selectedAnchor.seatId)}`
          + `/cubemap/${resolution}/${face}.${extension}`,
        );
      }
    }
  }
  for (const extension of ['jpg', 'webp', 'png']) {
    imageCandidates.push(
      `${panoramaRoot}/${encodeURIComponent(selectedAnchor.seatId)}/spherical/hres/pano.${extension}`,
    );
    imageCandidates.push(
      `${panoramaRoot}/${encodeURIComponent(selectedAnchor.seatId)}/spherical/lres/pano.${extension}`,
    );
  }
  const probes = await page.evaluate(async (urls) => {
    const results = [];
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          credentials: 'include',
        });
        results.push({
          url,
          status: response.status,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length'),
          lastModified: response.headers.get('last-modified'),
          etag: response.headers.get('etag'),
        });
      } catch (error) {
        results.push({ url, status: null, error: String(error) });
      }
    }
    return results;
  }, imageCandidates);
  const successfulProbes = probes.filter((probe) => probe.status === 200);
  let downloadedImage = null;
  if (downloadImagePath) {
    const selectedImage = successfulProbes.find((probe) =>
      probe.url.includes('/spherical/hres/'));
    if (!selectedImage) throw new Error('No high-resolution spherical image is available');
    const response = await page.request.get(selectedImage.url);
    if (!response.ok()) {
      throw new Error(`Panorama image download failed with HTTP ${response.status()}`);
    }
    const bytes = await response.body();
    if (String(bytes.length) !== selectedImage.contentLength) {
      throw new Error(
        `Panorama image byte mismatch: expected ${selectedImage.contentLength}, received ${bytes.length}`,
      );
    }
    await writeFile(downloadImagePath, bytes);
    downloadedImage = {
      url: selectedImage.url,
      path: downloadImagePath,
      byteLength: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      contentType: response.headers()['content-type'] ?? null,
      lastModified: response.headers()['last-modified'] ?? null,
    };
  }
  const fingerprintInput = {
    inventoryArtifactVersion: inventory.artifactVersion,
    rowArtifactVersion: rows.artifactVersion,
    venueId: inventory.venueId,
    panoramaSet,
    seatId: selectedAnchor.seatId,
    seatConfigSha256: sha256Text(seatConfigResult.text),
    successfulProbes,
    downloadedImage: downloadedImage && {
      url: downloadedImage.url,
      byteLength: downloadedImage.byteLength,
      sha256: downloadedImage.sha256,
    },
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-panorama-resource-audit',
    artifactVersion: `sha256:${fingerprint(fingerprintInput)}`,
    inventoryArtifactVersion: inventory.artifactVersion,
    rowArtifactVersion: rows.artifactVersion,
    stadiumId: inventory.stadiumId,
    venueId: inventory.venueId,
    auditedOn: new Date().toISOString(),
    viewerVersion,
    viewerConfigUrl,
    viewerConfig: viewerConfigResult,
    panoramaSet,
    seat: {
      seatId: selectedAnchor.seatId,
      rowKey: selectedAnchor.rowKey,
      knownMetricPosition: selectedAnchor.position,
      configUrl: seatConfigUrl,
      configSha256: sha256Text(seatConfigResult.text),
      configHeaders: {
        contentType: seatConfigResult.contentType,
        contentLength: seatConfigResult.contentLength,
        lastModified: seatConfigResult.lastModified,
        etag: seatConfigResult.etag,
      },
      config: seatConfig,
    },
    probes,
    successfulProbes,
    downloadedImage,
    conclusion: {
      imageResourceLocated: successfulProbes.length > 0,
      measuredGeometryEstablished: false,
      note: 'Rendered panorama availability does not establish metric obstruction geometry or physical accuracy.',
    },
    publication: {
      eligible: false,
      blockers: [
        'PANORAMA_IS_RENDERED_IMAGERY_NOT_MEASURED_GEOMETRY',
        'OBSTRUCTION_RECONSTRUCTION_NOT_VALIDATED',
        'SOURCE_ACCURACY_NOT_ESTABLISHED',
        'SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    stadiumId: artifact.stadiumId,
    seatId: selectedAnchor.seatId,
    panoramaSet,
    seatConfigKeys: Object.keys(seatConfig).sort(),
    successfulProbes,
    downloadedImage,
    publication: artifact.publication,
  }, null, 2));
} finally {
  await browser.close();
}
