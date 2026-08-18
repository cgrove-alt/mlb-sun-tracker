#!/usr/bin/env node

/** Acquire checksum-locked 2D provider map nodes for selected seat IDs. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { chromium } from 'playwright';

const [inventoryPath, outputPath, ...seatIds] = process.argv.slice(2);
if (!inventoryPath || !outputPath || seatIds.length === 0) {
  console.error(
    'Usage: node scripts/inspect3dVenueSeatMapNodes.mjs INVENTORY OUTPUT SEAT_ID...',
  );
  process.exit(2);
}

const inventoryBytes = await readFile(inventoryPath);
const inventory = JSON.parse(inventoryBytes.toString('utf8'));
if (inventory?.artifactKind !== 'venue-metric-seat-inventory') {
  throw new Error('Input is not a venue-metric-seat-inventory artifact');
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const requested = seatIds.map((seatId) => {
  const section = inventory.sections.find((candidate) =>
    candidate.seatIds?.includes(seatId));
  if (!section) throw new Error(`Seat ${seatId} is absent from the inventory`);
  return {
    seatId,
    sectionId: section.sectionId,
    sourceMapId: section.sourceMapId ?? `S_${section.sectionId}`,
  };
});
const sourceMapIds = Array.from(new Set(requested.map((item) => item.sourceMapId)));

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

try {
  await page.goto(inventory.source.clubLinkedMapUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await withTimeout(rootMapReady, 30_000, 'root map manifest');
  if (liveVenueId !== inventory.venueId) {
    throw new Error(`Live venue ID ${liveVenueId} does not match ${inventory.venueId}`);
  }
  const parsed = new URL(rootMapManifestUrl);
  const markerMatch = parsed.pathname.match(/\/maps\/[^/]+\/master_full\.json$/);
  if (!markerMatch) throw new Error('Unexpected root map resource URL');
  const markerIndex = parsed.pathname.lastIndexOf(markerMatch[0]);
  const mapRoot = `${parsed.origin}${parsed.pathname.slice(0, markerIndex)}/maps`;
  const version = parsed.searchParams.get('v');

  const acquired = await page.evaluate(async ({ root, sourceIds, seats, mapVersion }) => {
    const sectionRecords = [];
    for (const sourceMapId of sourceIds) {
      const suffix = mapVersion ? `?v=${encodeURIComponent(mapVersion)}` : '';
      const manifestUrl = `${root}/${encodeURIComponent(sourceMapId)}/master_full.json${suffix}`;
      const svgUrl = `${root}/${encodeURIComponent(sourceMapId)}/mainlayer.svg${suffix}`;
      const [manifestResponse, svgResponse] = await Promise.all([
        fetch(manifestUrl, { credentials: 'include' }),
        fetch(svgUrl, { credentials: 'include' }),
      ]);
      const manifestText = await manifestResponse.text();
      const svgText = await svgResponse.text();
      let manifestJson = null;
      if (manifestResponse.ok) {
        try {
          manifestJson = JSON.parse(manifestText);
        } catch {
          manifestJson = null;
        }
      }
      const targetSeatIds = seats
        .filter((item) => item.sourceMapId === sourceMapId)
        .map((item) => item.seatId);
      const nodes = [];
      if (svgResponse.ok) {
        const parsedSvg = new DOMParser().parseFromString(svgText, 'image/svg+xml');
        const sourceRoot = parsedSvg.documentElement;
        const measurementRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        measurementRoot.style.position = 'fixed';
        measurementRoot.style.left = '-10000px';
        measurementRoot.style.top = '-10000px';
        measurementRoot.style.visibility = 'hidden';
        for (const attribute of sourceRoot.attributes) {
          measurementRoot.setAttribute(attribute.name, attribute.value);
        }
        for (const child of Array.from(sourceRoot.children)) {
          measurementRoot.appendChild(document.importNode(child, true));
        }
        document.body.appendChild(measurementRoot);
        for (const seatId of targetSeatIds) {
          const element = measurementRoot.querySelector(`[id="${CSS.escape(seatId)}"]`);
          let bounds = null;
          if (element) {
            try {
              const box = element.getBBox();
              bounds = { x: box.x, y: box.y, width: box.width, height: box.height };
            } catch {
              bounds = null;
            }
          }
          nodes.push({
            seatId,
            present: Boolean(element),
            tagName: element?.tagName ?? null,
            attributes: element
              ? Object.fromEntries(Array.from(element.attributes)
                .filter((attribute) => attribute.name !== 'd')
                .map((attribute) => [attribute.name, attribute.value]))
              : null,
            pathData: element?.getAttribute('d') ?? null,
            bounds,
          });
        }
        measurementRoot.remove();
      }
      sectionRecords.push({
        sourceMapId,
        manifestUrl,
        manifestStatus: manifestResponse.status,
        manifestLastModified: manifestResponse.headers.get('last-modified'),
        manifestEtag: manifestResponse.headers.get('etag'),
        manifestText,
        manifestJson,
        svgUrl,
        svgStatus: svgResponse.status,
        svgLastModified: svgResponse.headers.get('last-modified'),
        svgEtag: svgResponse.headers.get('etag'),
        svgText,
        nodes,
      });
    }
    return sectionRecords;
  }, {
    root: mapRoot,
    sourceIds: sourceMapIds,
    seats: requested,
    mapVersion: version,
  });

  const sections = acquired.map((section) => ({
    sourceMapId: section.sourceMapId,
    manifestUrl: section.manifestUrl,
    manifestStatus: section.manifestStatus,
    manifestLastModified: section.manifestLastModified,
    manifestEtag: section.manifestEtag,
    manifestByteLength: Buffer.byteLength(section.manifestText),
    manifestSha256: sha256(section.manifestText),
    manifestJson: section.manifestJson,
    svgUrl: section.svgUrl,
    svgStatus: section.svgStatus,
    svgLastModified: section.svgLastModified,
    svgEtag: section.svgEtag,
    svgByteLength: Buffer.byteLength(section.svgText),
    svgSha256: sha256(section.svgText),
    nodes: section.nodes.map((node) => ({
      seatId: node.seatId,
      present: node.present,
      tagName: node.tagName,
      attributes: node.attributes,
      pathDataSha256: node.pathData ? sha256(node.pathData) : null,
      bounds: node.bounds,
    })),
  }));
  const stable = {
    inventorySha256: sha256(inventoryBytes),
    inventoryArtifactVersion: inventory.artifactVersion,
    venueId: inventory.venueId,
    rootMapManifestUrl,
    mapRoot,
    version,
    requested,
    sections,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-public-seat-map-node-inspection',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
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
      rootMapManifestUrl,
      mapRoot,
      version,
    },
    requested,
    sections,
    publication: {
      eligible: false,
      blockers: [
        'DIAGNOSTIC_2D_MAP_NODES_ONLY',
        'VENUE_LOCAL_FRAME_NOT_REGISTERED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED'
      ]
    }
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    sections: sections.map((section) => ({
      sourceMapId: section.sourceMapId,
      manifestStatus: section.manifestStatus,
      svgStatus: section.svgStatus,
      nodesPresent: section.nodes.filter((node) => node.present).length,
      nodesRequested: section.nodes.length,
      nodes: section.nodes.map((node) => ({ seatId: node.seatId, bounds: node.bounds })),
    })),
    publicationEligible: false,
  }, null, 2));
} finally {
  await browser.close();
}
