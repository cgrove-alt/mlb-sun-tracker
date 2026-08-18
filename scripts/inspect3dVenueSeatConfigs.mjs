#!/usr/bin/env node

/** Acquire and seal the current public config JSON for selected venue seats. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { chromium } from 'playwright';

const [inventoryPath, outputPath, ...selectionArguments] = process.argv.slice(2);
if (!inventoryPath || !outputPath || selectionArguments.length === 0) {
  console.error(
    'Usage: node scripts/inspect3dVenueSeatConfigs.mjs INVENTORY OUTPUT SEAT_ID... [--sections=ID,ID]',
  );
  process.exit(2);
}

const inventoryBytes = await readFile(inventoryPath);
const inventory = JSON.parse(inventoryBytes.toString('utf8'));
if (inventory?.artifactKind !== 'venue-metric-seat-inventory') {
  throw new Error('Input is not a venue-metric-seat-inventory artifact');
}
const sectionIds = selectionArguments
  .filter((argument) => argument.startsWith('--sections='))
  .flatMap((argument) => argument.slice('--sections='.length).split(','))
  .filter(Boolean);
const explicitSeatIds = selectionArguments.filter((argument) =>
  !argument.startsWith('--sections='));
const sectionSeatIds = sectionIds.flatMap((sectionId) => {
  const section = inventory.sections.find((candidate) => candidate.sectionId === sectionId);
  if (!section) throw new Error(`Section ${sectionId} is absent from the inventory`);
  return section.seatIds ?? [];
});
const seatIds = Array.from(new Set([...explicitSeatIds, ...sectionSeatIds]));
if (seatIds.length === 0) throw new Error('No seat IDs were selected');
if (!seatIds.every((seatId) => /^S_.+-[^-]+-[^-]+$/.test(seatId))) {
  throw new Error('Every seat ID must use the S_section-row-seat form');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function fingerprint(value) {
  return sha256(JSON.stringify(value));
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
const page = await browser.newPage();
let blockmapManifestUrl = null;
let liveVenueId = null;
let resolveBlockmap;
const blockmapReady = new Promise((resolve) => { resolveBlockmap = resolve; });

page.on('response', (response) => {
  const url = response.url();
  const tokenMatch = url.match(/\/api\/v1\/dvm\/token\/venue\/([^/?#]+)/);
  if (tokenMatch) liveVenueId = tokenMatch[1];
  if (/\/maps\/blockmap\/master_full\.json(?:[?#]|$)/.test(url)) {
    blockmapManifestUrl ??= url;
    resolveBlockmap(blockmapManifestUrl);
  }
});

try {
  await page.goto(inventory.source.clubLinkedMapUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await withTimeout(blockmapReady, 30_000, 'blockmap manifest');
  if (liveVenueId !== inventory.venueId) {
    throw new Error(`Live venue ID ${liveVenueId} does not match ${inventory.venueId}`);
  }
  const parsedBlockmapUrl = new URL(blockmapManifestUrl);
  const marker = '/map-viewer/sets/default/maps/blockmap/master_full.json';
  const markerIndex = parsedBlockmapUrl.pathname.indexOf(marker);
  if (markerIndex < 0) throw new Error('Unexpected current blockmap resource path');
  const resourceRoot = `${parsedBlockmapUrl.origin}${parsedBlockmapUrl.pathname.slice(0, markerIndex)}`;
  const viewerVersion = '1.6.18';
  const viewerConfigUrl = `${resourceRoot}/viewer3d/config.json?v=${encodeURIComponent(viewerVersion)}`;
  const viewerConfig = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: 'include' });
    return {
      status: response.status,
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      value: response.ok ? await response.json() : null,
    };
  }, viewerConfigUrl);
  const panoramaSet = viewerConfig.value?.si;
  if (
    viewerConfig.status !== 200
    || typeof panoramaSet !== 'string'
    || !/^v\d+(?:\.\d+)*$/.test(panoramaSet)
  ) {
    throw new Error('Could not establish the current panorama set');
  }
  const panoramaRoot = `${resourceRoot}/viewer3d/panos/${encodeURIComponent(panoramaSet)}`;
  const configs = [];
  for (const seatId of seatIds) {
    configs.push(await page.evaluate(async ({ root, id, version }) => {
      const url = `${root}/${encodeURIComponent(id)}/config.json?v=${encodeURIComponent(version)}`;
      const response = await fetch(url, { credentials: 'include' });
      return {
        seatId: id,
        url,
        status: response.status,
        lastModified: response.headers.get('last-modified'),
        etag: response.headers.get('etag'),
        contentType: response.headers.get('content-type'),
        config: response.ok ? await response.json() : null,
      };
    }, { root: panoramaRoot, id: seatId, version: viewerVersion }));
  }
  const stable = {
    inventorySha256: sha256(inventoryBytes),
    inventoryArtifactVersion: inventory.artifactVersion,
    venueId: inventory.venueId,
    resourceRoot,
    viewerVersion,
    panoramaSet,
    viewerConfigEtag: viewerConfig.etag,
    configs,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-public-seat-config-inspection',
    artifactVersion: `sha256:${fingerprint(stable)}`,
    inspectedOn: new Date().toISOString(),
    inventory: {
      path: inventoryPath,
      sha256: stable.inventorySha256,
      artifactVersion: inventory.artifactVersion,
    },
    stadiumId: inventory.stadiumId,
    venueId: inventory.venueId,
    source: {
      clubLinkedMapUrl: inventory.source.clubLinkedMapUrl,
      resourceRoot,
      viewerVersion,
      panoramaSet,
      viewerConfigUrl,
      viewerConfigLastModified: viewerConfig.lastModified,
      viewerConfigEtag: viewerConfig.etag,
    },
    configs,
    publication: {
      eligible: false,
      blockers: [
        'DIAGNOSTIC_CONFIG_SAMPLE_ONLY',
        'VENUE_LOCAL_FRAME_NOT_REGISTERED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    configs: configs.map((item) => ({
      seatId: item.seatId,
      status: item.status,
      configKeys: item.config && typeof item.config === 'object'
        ? Object.keys(item.config).sort()
        : [],
      positionValue: item.config?.p ?? null,
    })),
    publicationEligible: false,
  }, null, 2));
} finally {
  await browser.close();
}
