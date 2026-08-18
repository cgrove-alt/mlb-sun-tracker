#!/usr/bin/env node

/** Extract current 2D seat-map row geometry and blockmap section footprints. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const inventoryPath = typeof args.inventory === 'string' ? args.inventory : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
const productAuditPath = typeof args['product-audit'] === 'string' ? args['product-audit'] : null;
if (!inventoryPath || !outputPath) {
  throw new Error('Required: --inventory=PATH --output=PATH');
}
const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
if (inventory?.artifactKind !== 'venue-metric-seat-inventory') {
  throw new Error('Input is not a venue-metric-seat-inventory artifact');
}
let productAuditArtifactVersion = null;
let excludedNonAssignedRowProducts = [];
if (inventory.summary?.requestFailures !== 0) {
  if (!productAuditPath) {
    throw new Error('Input inventory has unresolved section requests');
  }
  const productAudit = JSON.parse(await readFile(productAuditPath, 'utf8'));
  if (![
    'venue-blockmap-product-audit',
    'venue-blockmap-product-semantics-review',
  ].includes(productAudit?.artifactKind)) {
    throw new Error('Product audit is not a supported blockmap product evidence artifact');
  }
  if (productAudit.inventoryArtifactVersion !== inventory.artifactVersion) {
    throw new Error('Product audit does not match the inventory artifact version');
  }
  if (productAudit.conclusion?.assignedSeatCoverageClaimAllowed !== true) {
    throw new Error('Product audit has unresolved assigned-row semantics');
  }
  const failedSectionIds = inventory.sections
    .filter((section) => section.status !== 200)
    .map((section) => section.sectionId)
    .sort();
  const auditedSectionIds = productAudit.products
    .map((product) => product.sectionId)
    .sort();
  if (JSON.stringify(failedSectionIds) !== JSON.stringify(auditedSectionIds)) {
    throw new Error('Product audit does not exactly cover inventory request failures');
  }
  excludedNonAssignedRowProducts = productAudit.products.filter((product) =>
    product.assignedRowApplicable === false);
  if (excludedNonAssignedRowProducts.length !== productAudit.products.length) {
    throw new Error('Every failed map product must be established as non-assigned-row');
  }
  productAuditArtifactVersion = productAudit.artifactVersion;
}
const excludedSectionIds = new Set(excludedNonAssignedRowProducts.map((product) => product.sectionId));
const assignedSections = inventory.sections.filter((section) =>
  !excludedSectionIds.has(section.sectionId));

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
let blockmapManifestUrl = null;
let resolveBlockmap;
const blockmapReady = new Promise((resolve) => { resolveBlockmap = resolve; });
page.on('response', (response) => {
  if (/\/maps\/blockmap\/master_full\.json(?:[?#]|$)/.test(response.url())) {
    blockmapManifestUrl ??= response.url();
    resolveBlockmap(blockmapManifestUrl);
  }
});

function withTimeout(promise, milliseconds, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error(`Timed out waiting for ${label}`)),
      milliseconds,
    )),
  ]);
}

function parseSeatId(sectionId, seatId) {
  const prefix = `S_${sectionId}-`;
  if (!seatId.startsWith(prefix)) return null;
  const suffix = seatId.slice(prefix.length);
  const splitAt = suffix.lastIndexOf('-');
  if (splitAt <= 0 || splitAt >= suffix.length - 1) return null;
  return { rowId: suffix.slice(0, splitAt), seatId: suffix.slice(splitAt + 1) };
}

function seatOrder(sectionId, left, right) {
  const leftSeat = parseSeatId(sectionId, left.id)?.seatId ?? '';
  const rightSeat = parseSeatId(sectionId, right.id)?.seatId ?? '';
  const leftNumber = Number(leftSeat);
  const rightNumber = Number(rightSeat);
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) return leftNumber - rightNumber;
  return leftSeat.localeCompare(rightSeat, undefined, { numeric: true });
}

try {
  await page.goto(inventory.source.clubLinkedMapUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await withTimeout(blockmapReady, 30_000, 'blockmap manifest');
  const raw = await page.evaluate(async ({ blockmapUrl, sections }) => {
    const parsed = new URL(blockmapUrl);
    const marker = '/maps/blockmap/master_full.json';
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex < 0) throw new Error('Unexpected blockmap resource URL');
    const mapRoot = `${parsed.origin}${parsed.pathname.slice(0, markerIndex)}/maps`;
    const version = parsed.searchParams.get('v');
    const suffix = version ? `?v=${encodeURIComponent(version)}` : '';
    const sectionResults = [];
    for (let offset = 0; offset < sections.length; offset += 12) {
      const batch = sections.slice(offset, offset + 12);
      const results = await Promise.all(batch.map(async (section) => {
        const url = `${mapRoot}/${encodeURIComponent(`S_${section.sectionId}`)}/master_full.json${suffix}`;
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) return { sectionId: section.sectionId, status: response.status };
        return {
          sectionId: section.sectionId,
          status: response.status,
          lastModified: response.headers.get('last-modified'),
          etag: response.headers.get('etag'),
          url,
          manifest: await response.json(),
        };
      }));
      sectionResults.push(...results);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    const blockmapSvgUrl = `${mapRoot}/blockmap/mainlayer.svg${suffix}`;
    const svgResponse = await fetch(blockmapSvgUrl, { credentials: 'include' });
    if (!svgResponse.ok) throw new Error(`Blockmap SVG request failed with ${svgResponse.status}`);
    return {
      mapRoot,
      version,
      sectionResults,
      blockmapSvgUrl,
      blockmapSvgLastModified: svgResponse.headers.get('last-modified'),
      blockmapSvgEtag: svgResponse.headers.get('etag'),
      blockmapSvg: await svgResponse.text(),
    };
  }, { blockmapUrl: blockmapManifestUrl, sections: assignedSections });

  const blockmapSections = await page.evaluate(({ svgMarkup, sectionIds }) => {
    const host = document.createElement('div');
    host.style.position = 'absolute';
    host.style.left = '-100000px';
    host.style.top = '-100000px';
    host.style.width = '8192px';
    host.style.height = '8192px';
    host.innerHTML = svgMarkup;
    document.body.appendChild(host);
    const svg = host.querySelector('svg');
    if (!svg) throw new Error('Blockmap SVG did not parse');
    const results = sectionIds.map((sectionId) => {
      const element = svg.getElementById(`S_${sectionId}`);
      if (!(element instanceof SVGGeometryElement)) {
        return { sectionId, found: false };
      }
      const bounds = element.getBBox();
      const length = element.getTotalLength();
      const points = Array.from({ length: 65 }, (_, index) => {
        const point = element.getPointAtLength(length * index / 64);
        return [point.x, point.y];
      });
      return {
        sectionId,
        found: true,
        tagName: element.tagName,
        bounds: [bounds.x, bounds.y, bounds.width, bounds.height],
        pathLength: length,
        sampledBoundary: points,
      };
    });
    host.remove();
    return results;
  }, {
    svgMarkup: raw.blockmapSvg,
    sectionIds: assignedSections.map((section) => section.sectionId),
  });
  const blockmapBySection = new Map(blockmapSections.map((section) => [section.sectionId, section]));

  const sections = raw.sectionResults.map((result) => {
    if (result.status !== 200 || !result.manifest) {
      return { sectionId: result.sectionId, status: result.status, rows: [] };
    }
    const manifest = result.manifest;
    const groups = Array.isArray(manifest.n) ? manifest.n : [];
    const seatNodes = groups
      .filter((group) => group?.h?.t === 'seat' && Array.isArray(group?.n))
      .flatMap((group) => group.n)
      .filter((node) => typeof node?.i === 'string' && Array.isArray(node?.c));
    const sectionNode = groups
      .filter((group) => group?.h?.t === 'section' && Array.isArray(group?.n))
      .flatMap((group) => group.n)
      .find((node) => node?.i === `S_${result.sectionId}`) ?? null;
    const rowsById = new Map();
    for (const node of seatNodes) {
      const details = parseSeatId(result.sectionId, node.i);
      if (!details) continue;
      if (!rowsById.has(details.rowId)) rowsById.set(details.rowId, []);
      rowsById.get(details.rowId).push({
        id: node.i,
        center: node.c,
        anchor: Array.isArray(node.a) ? node.a : null,
        polygonOffsets: Array.isArray(node.pl) ? node.pl : null,
      });
    }
    const rows = Array.from(rowsById, ([rowId, nodes]) => ({
      rowKey: `${result.sectionId}:${rowId}`,
      sectionId: result.sectionId,
      rowId,
      publishedSeatCount: nodes.length,
      seats: nodes.toSorted((left, right) => seatOrder(result.sectionId, left, right)),
    }));
    return {
      sectionId: result.sectionId,
      status: result.status,
      sourceUrl: result.url,
      sourceLastModified: result.lastModified,
      sourceEtag: result.etag,
      localMapBounds: manifest?.m?.bb ?? null,
      sectionNode,
      blockmapGeometry: blockmapBySection.get(result.sectionId) ?? null,
      rows,
    };
  });
  const failures = sections.filter((section) => section.status !== 200);
  const missingBlockmapSections = sections.filter(
    (section) => !section.blockmapGeometry?.found,
  );
  const rows = sections.flatMap((section) => section.rows);
  const seats = rows.reduce((sum, row) => sum + row.publishedSeatCount, 0);
  const fingerprintInput = {
    inventoryArtifactVersion: inventory.artifactVersion,
    productAuditArtifactVersion,
    blockmapSvgEtag: raw.blockmapSvgEtag,
    sections: sections.map((section) => ({
      sectionId: section.sectionId,
      sourceEtag: section.sourceEtag,
      localMapBounds: section.localMapBounds,
      sectionNode: section.sectionNode,
      blockmapGeometry: section.blockmapGeometry,
      rows: section.rows,
    })),
  };
  const artifactVersion = `sha256:${createHash('sha256')
    .update(JSON.stringify(fingerprintInput))
    .digest('hex')}`;
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'current-venue-map-row-geometry',
    artifactVersion,
    inventoryArtifactVersion: inventory.artifactVersion,
    productAuditArtifactVersion,
    stadiumId: inventory.stadiumId,
    venueId: inventory.venueId,
    extractedOn: new Date().toISOString(),
    source: {
      provider: '3D Digital Venue',
      clubLinkedMapUrl: inventory.source.clubLinkedMapUrl,
      finalMapUrl: page.url(),
      blockmapSvgUrl: raw.blockmapSvgUrl,
      blockmapSvgLastModified: raw.blockmapSvgLastModified,
      blockmapSvgEtag: raw.blockmapSvgEtag,
      license: 'published-for-public-access',
    },
    coordinateSystems: {
      sectionMaps: 'provider-local-2d-seat-map-units',
      blockmap: 'provider-global-2d-svg-units',
      georeferenced: false,
    },
    completeness: {
      expectedSections: assignedSections.length,
      extractedSections: sections.length - failures.length,
      failedSections: failures.length,
      missingBlockmapSections: missingBlockmapSections.length,
      expectedRows: inventory.summary.totalRows,
      extractedRows: rows.length,
      expectedSeats: inventory.summary.totalSeatAnchors,
      extractedSeats: seats,
      excludedNonAssignedRowProducts,
    },
    sections,
    publication: {
      eligible: false,
      blockers: [
        'SECTION_MAPS_NOT_GEOREFERENCED',
        'CURRENT_OBSTRUCTION_GEOMETRY_NOT_INCLUDED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED'
      ],
    },
  };
  if (
    failures.length > 0
    || sections.length !== assignedSections.length
    || rows.length !== inventory.summary.totalRows
    || seats !== inventory.summary.totalSeatAnchors
  ) {
    throw new Error(`Incomplete venue-map extraction: ${JSON.stringify(artifact.completeness)}`);
  }
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    artifactVersion,
    completeness: artifact.completeness,
    publication: artifact.publication,
  }, null, 2));
} finally {
  await browser.close();
}
