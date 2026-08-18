#!/usr/bin/env node

/**
 * Audit block-map nodes whose section manifests are unavailable.
 *
 * This tool deliberately does not infer that an unavailable node is rowless.
 * It records the public SVG node, its rendered bounds, overlap with nodes that
 * have seat manifests, and the exact HTTP result for independent review.
 *
 * Usage:
 *   node scripts/audit3dVenueBlockmapProducts.mjs \
 *     --inventory=tmp/lidar/astros-3ddv-metric-inventory.json \
 *     --output=tmp/lidar/astros-3ddv-blockmap-products.json
 */

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
const svgOutputPath = typeof args['svg-output'] === 'string' ? args['svg-output'] : null;
const mapManifestOutputPath = typeof args['map-manifest-output'] === 'string'
  ? args['map-manifest-output']
  : null;
if (!inventoryPath || !outputPath) {
  console.error('Required: --inventory=PATH --output=PATH');
  process.exit(2);
}

const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
if (inventory?.artifactKind !== 'venue-metric-seat-inventory') {
  throw new Error('Input is not a venue-metric-seat-inventory artifact');
}
const unresolvedTargets = inventory.sections
  .filter((section) => section.status !== 200)
  .map((section) => ({
    sectionId: section.sectionId,
    sourceMapId: section.sourceMapId ?? `S_${section.sectionId}`,
  }));
if (unresolvedTargets.length === 0) {
  throw new Error('Inventory has no unresolved section manifests to audit');
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
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
  const audit = await page.evaluate(async ({ manifestUrl, targets, successfulIds }) => {
    const mapManifestResponse = await fetch(manifestUrl, { credentials: 'include' });
    if (!mapManifestResponse.ok) {
      throw new Error(`Block-map manifest request failed with ${mapManifestResponse.status}`);
    }
    const mapManifestMarkup = await mapManifestResponse.text();
    const svgUrl = manifestUrl.replace('/master_full.json', '/mainlayer.svg');
    const svgResponse = await fetch(svgUrl, { credentials: 'include' });
    if (!svgResponse.ok) {
      throw new Error(`Block-map SVG request failed with ${svgResponse.status}`);
    }
    const svgMarkup = await svgResponse.text();
    const parsedSvg = new DOMParser().parseFromString(svgMarkup, 'image/svg+xml');
    const parsedRoot = parsedSvg.documentElement;
    const measurementRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    measurementRoot.setAttribute('width', '1');
    measurementRoot.setAttribute('height', '1');
    measurementRoot.style.position = 'fixed';
    measurementRoot.style.left = '-10000px';
    measurementRoot.style.top = '-10000px';
    measurementRoot.style.visibility = 'hidden';
    for (const attribute of parsedRoot.attributes) {
      measurementRoot.setAttribute(attribute.name, attribute.value);
    }
    for (const child of Array.from(parsedRoot.children)) {
      measurementRoot.appendChild(document.importNode(child, true));
    }
    document.body.appendChild(measurementRoot);

    const elementRecord = (sectionId, sourceMapId = `S_${sectionId}`) => {
      const element = measurementRoot.querySelector(`[id="${CSS.escape(sourceMapId)}"]`);
      if (!element) return null;
      let bounds = null;
      let pathLength = null;
      try {
        const box = element.getBBox();
        bounds = { x: box.x, y: box.y, width: box.width, height: box.height };
      } catch {
        bounds = null;
      }
      try {
        if (typeof element.getTotalLength === 'function') pathLength = element.getTotalLength();
      } catch {
        pathLength = null;
      }
      return {
        sectionId,
        sourceMapId,
        tagName: element.tagName,
        insideDefinitions: Boolean(element.closest('defs')),
        attributes: Object.fromEntries(Array.from(element.attributes)
          .filter((attribute) => attribute.name !== 'd')
          .map((attribute) => [attribute.name, attribute.value])),
        pathData: element.getAttribute('d'),
        text: element.textContent?.trim() || null,
        bounds,
        pathLength,
      };
    };
    const successfulNodes = successfulIds
      .map((target) => elementRecord(target.sectionId, target.sourceMapId))
      .filter(Boolean);
    const unresolvedNodes = targets
      .map((target) => elementRecord(target.sectionId, target.sourceMapId))
      .filter(Boolean);
    const overlap = (left, right) => {
      if (!left || !right) return null;
      const x = Math.max(left.x, right.x);
      const y = Math.max(left.y, right.y);
      const width = Math.max(0, Math.min(left.x + left.width, right.x + right.width) - x);
      const height = Math.max(0, Math.min(left.y + left.height, right.y + right.height) - y);
      const area = width * height;
      const leftArea = left.width * left.height;
      const rightArea = right.width * right.height;
      return {
        area,
        fractionOfTargetBounds: leftArea > 0 ? area / leftArea : 0,
        fractionOfCandidateBounds: rightArea > 0 ? area / rightArea : 0,
      };
    };

    const parsed = new URL(manifestUrl);
    const markerMatch = parsed.pathname.match(/\/maps\/[^/]+\/master_full\.json$/);
    if (!markerMatch) throw new Error('Unexpected root map resource URL');
    const markerIndex = parsed.pathname.lastIndexOf(markerMatch[0]);
    const mapRoot = `${parsed.origin}${parsed.pathname.slice(0, markerIndex)}/maps`;
    const version = parsed.searchParams.get('v');
    const targetRecords = [];
    for (const target of targets) {
      const { sectionId, sourceMapId } = target;
      const node = elementRecord(sectionId, sourceMapId);
      const overlaps = successfulNodes
        .map((candidate) => ({
          sectionId: candidate.sectionId,
          overlap: overlap(node?.bounds, candidate.bounds),
        }))
        .filter((candidate) => candidate.overlap?.area > 0)
        .sort((left, right) =>
          right.overlap.fractionOfTargetBounds - left.overlap.fractionOfTargetBounds)
        .slice(0, 20);
      const unresolvedProductOverlaps = unresolvedNodes
        .filter((candidate) => candidate.sectionId !== sectionId)
        .map((candidate) => ({
          sectionId: candidate.sectionId,
          overlap: overlap(node?.bounds, candidate.bounds),
        }))
        .filter((candidate) => candidate.overlap?.area > 0)
        .sort((left, right) =>
          right.overlap.fractionOfTargetBounds - left.overlap.fractionOfTargetBounds);
      const sectionUrl = `${mapRoot}/${encodeURIComponent(sourceMapId)}/master_full.json${version ? `?v=${encodeURIComponent(version)}` : ''}`;
      let responseRecord;
      try {
        const response = await fetch(sectionUrl, { credentials: 'include' });
        const body = await response.arrayBuffer();
        responseRecord = {
          status: response.status,
          contentType: response.headers.get('content-type'),
          contentLength: body.byteLength,
          lastModified: response.headers.get('last-modified'),
          etag: response.headers.get('etag'),
          bodyBytes: Array.from(new Uint8Array(body)),
        };
      } catch (error) {
        responseRecord = { error: String(error), bodyBytes: [] };
      }
      targetRecords.push({
        sectionId,
        sourceMapId,
        node,
        overlaps,
        unresolvedProductOverlaps,
        response: responseRecord,
      });
    }
    measurementRoot.remove();
    return {
      svgUrl,
      svgMarkup,
      mapManifestMarkup,
      liveDomTargetPresence: Object.fromEntries(targets.map(({ sectionId, sourceMapId }) => [
        sectionId,
        Boolean(document.querySelector(`[id="${CSS.escape(sourceMapId)}"]`)),
      ])),
      targetRecords,
    };
  }, {
    manifestUrl: rootMapManifestUrl,
    targets: unresolvedTargets,
    successfulIds: inventory.sections
      .filter((section) => section.status === 200)
      .map((section) => ({
        sectionId: section.sectionId,
        sourceMapId: section.sourceMapId ?? `S_${section.sectionId}`,
      })),
  });

  const svgSha256 = sha256(audit.svgMarkup);
  const products = audit.targetRecords.map((record) => {
    const body = Buffer.from(record.response.bodyBytes);
    const pathData = record.node?.pathData ?? null;
    const providerNodeType = record.node?.attributes?.['data-type'] ?? null;
    const isGeneralAdmission = providerNodeType === 'general_admission';
    const isNavigationGroup = record.sourceMapId.startsWith('G_')
      && providerNodeType === 'sm';
    const isStructuralDefinition = record.node?.insideDefinitions === true;
    return {
      sectionId: record.sectionId,
      sourceMapId: record.sourceMapId,
      blockmapNodePresent: Boolean(record.node),
      liveDomNodePresent: audit.liveDomTargetPresence[record.sectionId],
      blockmapNode: record.node ? {
        tagName: record.node.tagName,
        insideDefinitions: record.node.insideDefinitions,
        attributes: record.node.attributes,
        text: record.node.text,
        bounds: record.node.bounds,
        pathLength: record.node.pathLength,
        pathDataSha256: pathData ? sha256(pathData) : null,
      } : null,
      overlappingManifestBackedSectionBounds: record.overlaps,
      overlappingUnresolvedProductBounds: record.unresolvedProductOverlaps,
      manifestResponse: {
        status: record.response.status ?? null,
        error: record.response.error ?? null,
        contentType: record.response.contentType ?? null,
        contentLength: record.response.contentLength ?? body.length,
        lastModified: record.response.lastModified ?? null,
        etag: record.response.etag ?? null,
        bodySha256: sha256(body),
        bodyUtf8: body.length <= 2_000 ? body.toString('utf8') : null,
      },
      providerNodeType,
      assignedRowApplicable: isGeneralAdmission || isNavigationGroup || isStructuralDefinition
        ? false
        : null,
      classification: isGeneralAdmission
        ? 'GENERAL_ADMISSION_NO_ASSIGNED_ROW'
        : isNavigationGroup
          ? 'NAVIGATION_GROUP_NO_ASSIGNED_ROW'
          : isStructuralDefinition
            ? 'STRUCTURAL_MAP_ELEMENT_NO_ASSIGNED_ROW'
            : 'UNRESOLVED_BLOCKMAP_PRODUCT',
      physicallyRowless: null,
      note: isGeneralAdmission
        ? 'The current provider labels this ticket product general_admission. It is outside assigned-row geometry scope, but still requires zone geometry before any shade claim can be published for the product.'
        : isNavigationGroup
          ? 'The current provider encodes this as an SVG navigation group rather than a ticket section. It has no assigned-row manifest and is outside assigned-row geometry scope.'
          : isStructuralDefinition
            ? 'The current provider stores this path only inside the SVG definitions block. It is not a rendered selectable ticket product and is outside assigned-row geometry scope.'
            : 'A block-map node without a section manifest is not proof that the area has no assigned rows.',
    };
  });
  const generalAdmissionProducts = products.filter((product) =>
    product.classification === 'GENERAL_ADMISSION_NO_ASSIGNED_ROW');
  const structuralDefinitionProducts = products.filter((product) =>
    product.classification === 'STRUCTURAL_MAP_ELEMENT_NO_ASSIGNED_ROW');
  const unresolvedProducts = products.filter((product) =>
    product.classification === 'UNRESOLVED_BLOCKMAP_PRODUCT');
  const stableProducts = products.map((product) => ({
    ...product,
    manifestResponse: {
      status: product.manifestResponse.status,
      error: product.manifestResponse.error,
      contentType: product.manifestResponse.contentType,
      contentLength: product.manifestResponse.contentLength,
      lastModified: product.manifestResponse.lastModified,
      etag: product.manifestResponse.etag,
    },
  }));
  const fingerprintInput = {
    inventoryArtifactVersion: inventory.artifactVersion,
    blockmapSvgSha256: svgSha256,
    products: stableProducts,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-blockmap-product-audit',
    artifactVersion: `sha256:${sha256(JSON.stringify(fingerprintInput))}`,
    inventoryArtifactVersion: inventory.artifactVersion,
    stadiumId: inventory.stadiumId,
    venueId: inventory.venueId,
    auditedOn: new Date().toISOString(),
    source: {
      provider: '3D Digital Venue',
      clubLinkedMapUrl: inventory.source.clubLinkedMapUrl,
      finalMapUrl: page.url(),
      blockmapSvgUrl: audit.svgUrl,
      blockmapSvgSha256: svgSha256,
      license: 'published-for-public-access',
    },
    products,
    conclusion: {
      excludedGeneralAdmissionProducts: generalAdmissionProducts.length,
      excludedStructuralDefinitionProducts: structuralDefinitionProducts.length,
      unresolvedProducts: unresolvedProducts.length,
      assignedSeatCoverageClaimAllowed: unresolvedProducts.length === 0,
      blockers: [
        ...(unresolvedProducts.length > 0 ? ['UNRESOLVED_BLOCKMAP_PRODUCT_SEMANTICS'] : []),
        ...(generalAdmissionProducts.length > 0
          ? ['GENERAL_ADMISSION_ZONE_GEOMETRY_NOT_EXTRACTED']
          : []),
      ],
    },
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  if (svgOutputPath) {
    await mkdir(dirname(svgOutputPath), { recursive: true });
    await writeFile(svgOutputPath, audit.svgMarkup, 'utf8');
  }
  if (mapManifestOutputPath) {
    await mkdir(dirname(mapManifestOutputPath), { recursive: true });
    await writeFile(mapManifestOutputPath, audit.mapManifestMarkup, 'utf8');
  }
  console.log(JSON.stringify({
    outputPath,
    svgOutputPath,
    mapManifestOutputPath,
    artifactVersion: artifact.artifactVersion,
    stadiumId: artifact.stadiumId,
    products: products.map((product) => ({
      sectionId: product.sectionId,
      blockmapNodePresent: product.blockmapNodePresent,
      liveDomNodePresent: product.liveDomNodePresent,
      bounds: product.blockmapNode?.bounds ?? null,
      overlappingManifestBackedSections: product.overlappingManifestBackedSectionBounds.length,
      manifestStatus: product.manifestResponse.status,
      manifestBodySha256: product.manifestResponse.bodySha256,
    })),
    conclusion: artifact.conclusion,
  }, null, 2));
} finally {
  await browser.close();
}
