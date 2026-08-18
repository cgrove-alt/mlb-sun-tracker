#!/usr/bin/env node

/**
 * Extract first, middle, and last metric camera anchors for every row in a
 * complete 3D Digital Venue inventory artifact. Only tiny public config JSON
 * files are requested. Panorama images are never downloaded.
 *
 * Usage:
 *   node scripts/extract3dVenueMetricRows.mjs \
 *     --inventory=tmp/lidar/phillies-3ddv-metric-inventory.json \
 *     --output=tmp/lidar/phillies-3ddv-metric-rows.json
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
const productAuditPath = typeof args['product-audit'] === 'string' ? args['product-audit'] : null;
const modeledRecoveryPath = typeof args['modeled-recovery'] === 'string'
  ? args['modeled-recovery']
  : null;
const allowIncomplete = args['allow-incomplete'] === true;
const allowUnresolvedProducts = args['allow-unresolved-products'] === true;
if (!inventoryPath || !outputPath) {
  console.error('Required: --inventory=PATH --output=PATH');
  process.exit(2);
}

const inventoryBytes = await readFile(inventoryPath);
const inventory = JSON.parse(inventoryBytes.toString('utf8'));
if (inventory?.artifactKind !== 'venue-metric-seat-inventory') {
  throw new Error('Input is not a venue-metric-seat-inventory artifact');
}
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
let modeledRecoveryArtifactVersion = null;
let modeledRecoverySha256 = null;
let modeledRecoveryBySeat = new Map();
if (modeledRecoveryPath) {
  const recoveryBytes = await readFile(modeledRecoveryPath);
  const recovery = JSON.parse(recoveryBytes.toString('utf8'));
  if (recovery?.artifactKind !== 'venue-local-modeled-seat-config-recovery') {
    throw new Error('Modeled recovery input has the wrong artifact kind');
  }
  if (recovery.stadiumId !== inventory.stadiumId || recovery.venueId !== inventory.venueId) {
    throw new Error('Modeled recovery does not match the inventory venue');
  }
  if (recovery.validation?.uncertainty?.gatePassed !== true) {
    throw new Error('Modeled recovery did not pass its uncertainty gate');
  }
  const maximumAllowedUncertaintyM = recovery.validation.uncertainty.maximumAllowedM;
  if (
    maximumAllowedUncertaintyM !== 0.3048
    || recovery.validation.uncertainty.horizontalM > maximumAllowedUncertaintyM
    || recovery.validation.uncertainty.verticalM > maximumAllowedUncertaintyM
  ) {
    throw new Error('Modeled recovery does not preserve the one-foot uncertainty ceiling');
  }
  for (const input of recovery.inputs ?? []) {
    if (!input?.path || !input.sha256) {
      throw new Error('Modeled recovery has incomplete input provenance');
    }
    const inputBytes = await readFile(input.path);
    if (sha256(inputBytes) !== input.sha256) {
      throw new Error(`Modeled recovery input hash does not match ${input.path}`);
    }
    const inputArtifact = JSON.parse(inputBytes.toString('utf8'));
    const inputInventoryVersion = inputArtifact.inventory?.artifactVersion
      ?? inputArtifact.inventoryArtifactVersion
      ?? null;
    if (
      inputInventoryVersion !== null
      && inputInventoryVersion !== inventory.artifactVersion
    ) {
      throw new Error(`Modeled recovery input ${input.path} uses a different inventory`);
    }
  }
  const inventorySeatIds = new Set(inventory.sections.flatMap((section) =>
    section.seatIds ?? []));
  modeledRecoveryBySeat = new Map((recovery.recoveredSeats ?? []).map((seat) => {
    if (
      !seat?.seatId
      || !inventorySeatIds.has(seat.seatId)
      || !Array.isArray(seat.position)
      || seat.position.length !== 3
      || !seat.position.every((coordinate) => Number.isFinite(coordinate))
      || seat.coordinateProvenance
        !== 'MODELED_FROM_PROVIDER_2D_MAP_WITH_CROSS_VALIDATED_LOCAL_TRANSFORM'
      || seat.horizontalUncertaintyM > maximumAllowedUncertaintyM
      || seat.verticalUncertaintyM > maximumAllowedUncertaintyM
    ) {
      throw new Error(`Invalid modeled recovery seat ${seat?.seatId ?? ''}`);
    }
    return [seat.seatId, seat];
  }));
  if (modeledRecoveryBySeat.size === 0) {
    throw new Error('Modeled recovery contains no validated seat coordinates');
  }
  modeledRecoveryArtifactVersion = recovery.artifactVersion;
  modeledRecoverySha256 = sha256(recoveryBytes);
}
let excludedNonAssignedRowProducts = [];
let unresolvedBlockmapProducts = [];
let productAuditArtifactVersion = null;
let productAuditSha256 = null;
if (inventory.summary?.requestFailures !== 0) {
  if (!productAuditPath) {
    throw new Error(
      `Inventory has ${inventory.summary?.requestFailures ?? 'unknown'} unresolved section requests`,
    );
  }
  const productAuditBytes = await readFile(productAuditPath);
  const productAudit = JSON.parse(productAuditBytes.toString('utf8'));
  if (![
    'venue-blockmap-product-audit',
    'venue-blockmap-product-semantics-review',
  ].includes(productAudit?.artifactKind)) {
    throw new Error('Product audit is not a supported blockmap product evidence artifact');
  }
  if (productAudit.inventoryArtifactVersion !== inventory.artifactVersion) {
    throw new Error('Product audit does not match the inventory artifact version');
  }
  productAuditArtifactVersion = productAudit.artifactVersion;
  productAuditSha256 = sha256(productAuditBytes);
  if (
    productAudit.conclusion?.assignedSeatCoverageClaimAllowed !== true
    && !allowUnresolvedProducts
  ) {
    throw new Error('Product audit has unresolved assigned-row semantics');
  }
  excludedNonAssignedRowProducts = productAudit.products.filter((product) =>
    product.assignedRowApplicable === false);
  unresolvedBlockmapProducts = productAudit.products.filter((product) =>
    product.assignedRowApplicable !== false);
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
}

function parseSeatId(sectionId, seatId) {
  const prefix = `S_${sectionId}-`;
  if (seatId.startsWith(prefix)) {
    const suffix = seatId.slice(prefix.length);
    const splitAt = suffix.lastIndexOf('-');
    if (splitAt <= 0 || splitAt === suffix.length - 1) return null;
    return {
      ticketSectionId: sectionId,
      row: suffix.slice(0, splitAt),
      seat: suffix.slice(splitAt + 1),
    };
  }
  const match = seatId.match(/^S_(.+)-([^-]+)-([^-]+)$/);
  if (!match) return null;
  return { ticketSectionId: match[1], row: match[2], seat: match[3] };
}

function seatOrder(sectionId, left, right) {
  const leftValue = parseSeatId(sectionId, left)?.seat ?? '';
  const rightValue = parseSeatId(sectionId, right)?.seat ?? '';
  const leftNumber = Number(leftValue);
  const rightNumber = Number(rightValue);
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) return leftNumber - rightNumber;
  return leftValue.localeCompare(rightValue, undefined, { numeric: true });
}

const requestedRows = [];
const requestedAnchors = [];
const requestedRowKeys = new Set();
for (const section of inventory.sections) {
  if (!Array.isArray(section.seatIds) || section.seatIds.length === 0) continue;
  const rows = new Map();
  for (const seatId of section.seatIds) {
    const details = parseSeatId(section.sectionId, seatId);
    if (!details) throw new Error(`Cannot parse inventory seat ID ${seatId}`);
    const sourceRowKey = `${details.ticketSectionId}\u0000${details.row}`;
    if (!rows.has(sourceRowKey)) {
      rows.set(sourceRowKey, {
        ticketSectionId: details.ticketSectionId,
        rowId: details.row,
        seatIds: [],
      });
    }
    rows.get(sourceRowKey).seatIds.push(seatId);
  }
  for (const { ticketSectionId, rowId, seatIds } of rows.values()) {
    const sorted = seatIds.toSorted((left, right) =>
      seatOrder(section.sectionId, left, right));
    const selected = Array.from(new Set([
      sorted[0],
      sorted[Math.floor(sorted.length / 2)],
      sorted.at(-1),
    ].filter(Boolean)));
    const rowKey = `${ticketSectionId}:${rowId}`;
    if (requestedRowKeys.has(rowKey)) {
      throw new Error(`Duplicate ticket row key ${rowKey}`);
    }
    requestedRowKeys.add(rowKey);
    requestedRows.push({
      rowKey,
      sectionId: ticketSectionId,
      sourceManifestSectionId: section.sectionId,
      rowId,
      publishedSeatCount: sorted.length,
      publishedSeatIds: sorted,
      anchorSeatIds: selected,
    });
    for (const seatId of selected) {
      requestedAnchors.push({
        rowKey,
        sectionId: ticketSectionId,
        sourceManifestSectionId: section.sectionId,
        rowId,
        seatId,
      });
    }
  }
}
if (requestedRows.length !== inventory.summary.totalRows) {
  throw new Error(
    `Inventory row mismatch: parsed ${requestedRows.length}, expected ${inventory.summary.totalRows}`,
  );
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
let rootMapManifestUrl = null;
let liveVenueId = null;
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

function finiteVector(value, length) {
  return Array.isArray(value)
    && value.length === length
    && value.every((coordinate) => Number.isFinite(coordinate));
}

function distance(left, right) {
  return Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);
}

function pointToSegmentDistance(point, start, end) {
  const delta = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
  const lengthSquared = delta[0] ** 2 + delta[1] ** 2 + delta[2] ** 2;
  if (lengthSquared === 0) return distance(point, start);
  const fromStart = [point[0] - start[0], point[1] - start[1], point[2] - start[2]];
  const parameter = Math.max(0, Math.min(1,
    (fromStart[0] * delta[0] + fromStart[1] * delta[1] + fromStart[2] * delta[2])
      / lengthSquared));
  return distance(point, [
    start[0] + parameter * delta[0],
    start[1] + parameter * delta[1],
    start[2] + parameter * delta[2],
  ]);
}

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
    throw new Error(`Live venue ID ${liveVenueId} does not match inventory ${inventory.venueId}`);
  }
  const parsedRootMapUrl = new URL(rootMapManifestUrl);
  const markerMatch = parsedRootMapUrl.pathname.match(
    /\/map-viewer\/sets\/default\/maps\/[^/]+\/master_full\.json$/,
  );
  if (!markerMatch) throw new Error('Unexpected current root map resource path');
  const markerIndex = parsedRootMapUrl.pathname.lastIndexOf(markerMatch[0]);
  const venueResourceRoot = `${parsedRootMapUrl.origin}${parsedRootMapUrl.pathname.slice(0, markerIndex)}`;
  const viewerVersion = '1.6.18';
  const viewerConfigUrl = `${venueResourceRoot}/viewer3d/config.json?v=${encodeURIComponent(viewerVersion)}`;
  const viewerConfigResult = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: 'include' });
    return {
      status: response.status,
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      config: response.ok ? await response.json() : null,
    };
  }, viewerConfigUrl);
  if (
    viewerConfigResult.status !== 200
    || typeof viewerConfigResult.config?.si !== 'string'
    || !/^v\d+(?:\.\d+)*$/.test(viewerConfigResult.config.si)
  ) {
    throw new Error(
      `Cannot discover panorama set from ${viewerConfigUrl}: ${JSON.stringify(viewerConfigResult)}`,
    );
  }
  const panoramaSet = viewerConfigResult.config.si;
  const panoRoot = `${venueResourceRoot}/viewer3d/panos/${encodeURIComponent(panoramaSet)}`;

  const refreshVenueAccess = async () => {
    liveVenueId = null;
    await page.goto(inventory.source.clubLinkedMapUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    for (let attempt = 0; attempt < 30 && liveVenueId === null; attempt += 1) {
      await page.waitForTimeout(250);
    }
    if (liveVenueId !== inventory.venueId) {
      throw new Error(`Refreshed venue ID ${liveVenueId} does not match ${inventory.venueId}`);
    }
  };
  const fetchConfigChunk = async (anchors) => page.evaluate(async ({ requests, root, version }) => {
    const results = [];
    const batchSize = 16;
    for (let offset = 0; offset < requests.length; offset += batchSize) {
      const batch = requests.slice(offset, offset + batchSize);
      const batchResults = await Promise.all(batch.map(async (anchor) => {
        const url = `${root}/${encodeURIComponent(anchor.seatId)}/config.json?v=${encodeURIComponent(version)}`;
        let lastFailure = null;
        for (let attempt = 1; attempt <= 3; attempt += 1) {
          try {
            const response = await fetch(url, { credentials: 'include' });
            if (response.ok) {
              return {
                ...anchor,
                status: response.status,
                lastModified: response.headers.get('last-modified'),
                etag: response.headers.get('etag'),
                config: await response.json(),
              };
            }
            lastFailure = { status: response.status };
          } catch (error) {
            lastFailure = { error: String(error) };
          }
          await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
        }
        return { ...anchor, ...lastFailure };
      }));
      results.push(...batchResults);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    return results;
  }, { requests: anchors, root: panoRoot, version: viewerVersion });

  const fetchAnchorConfigs = async (anchorRequests) => {
    const results = [];
    const authorizationChunkSize = 512;
    for (let offset = 0; offset < anchorRequests.length; offset += authorizationChunkSize) {
      if (offset > 0 && offset % (authorizationChunkSize * 8) === 0) {
        await refreshVenueAccess();
      }
      const requests = anchorRequests.slice(offset, offset + authorizationChunkSize);
      let chunkResults = await fetchConfigChunk(requests);
      const transientFailures = chunkResults.filter((result) =>
        !finiteVector(result.config?.p, 3)
        && (typeof result.error === 'string' || result.status === 401));
      const authorizationFailures = chunkResults.filter((result) =>
        !finiteVector(result.config?.p, 3) && result.status === 403);
      const likelyExpiredAuthorization = offset > 0
        && authorizationFailures.length / requests.length > 0.8;
      if (transientFailures.length > 0 || likelyExpiredAuthorization) {
        await refreshVenueAccess();
        const retryRequests = likelyExpiredAuthorization
          ? requests
          : transientFailures.map((failure) => requests.find((request) =>
            request.seatId === failure.seatId)).filter(Boolean);
        const retryResults = await fetchConfigChunk(retryRequests);
        const retryBySeat = new Map(retryResults.map((result) => [result.seatId, result]));
        chunkResults = chunkResults.map((result) => retryBySeat.get(result.seatId) ?? result);
      }
      results.push(...chunkResults);
    }
    return results;
  };

  const requireComplete = async (results, label, stage) => {
    const failures = results.filter((result) => !finiteVector(result.config?.p, 3));
    if (failures.length === 0) return;
    const sample = failures.slice(0, 10).map((failure) => ({
      seatId: failure.seatId,
      status: failure.status ?? null,
      error: failure.error ?? null,
      configKeys: failure.config && typeof failure.config === 'object'
        ? Object.keys(failure.config).sort()
        : [],
      positionValue: failure.config?.p ?? null,
    }));
    const failureRows = Array.from(new Map(failures.map((failure) => [
      failure.rowKey,
      {
        rowKey: failure.rowKey,
        sectionId: failure.sectionId,
        sourceManifestSectionId: failure.sourceManifestSectionId,
        rowId: failure.rowId,
      },
    ])).values()).sort((left, right) => left.rowKey.localeCompare(right.rowKey));
    const failureRecords = failures.map((failure) => ({
      rowKey: failure.rowKey,
      sectionId: failure.sectionId,
      sourceManifestSectionId: failure.sourceManifestSectionId,
      rowId: failure.rowId,
      seatId: failure.seatId,
      status: failure.status ?? null,
      error: failure.error ?? null,
      configKeys: failure.config && typeof failure.config === 'object'
        ? Object.keys(failure.config).sort()
        : [],
      positionValue: failure.config?.p ?? null,
    }));
    const fingerprintInput = {
      inventoryArtifactVersion: inventory.artifactVersion,
      stage,
      requestedAnchors: results.length,
      successfulAnchors: results.length - failures.length,
      failures: failureRecords,
    };
    const failureArtifact = {
      schemaVersion: 1,
      artifactKind: 'venue-local-metric-row-anchor-extraction-failure',
      artifactVersion: `sha256:${createHash('sha256')
        .update(JSON.stringify(fingerprintInput))
        .digest('hex')}`,
      inventoryArtifactVersion: inventory.artifactVersion,
      stadiumId: inventory.stadiumId,
      venueId: inventory.venueId,
      attemptedOn: new Date().toISOString(),
      stage,
      requestedAnchors: results.length,
      successfulAnchors: results.length - failures.length,
      failedAnchors: failures.length,
      affectedRows: failureRows.length,
      failureRows,
      failures: failureRecords,
      publication: {
        eligible: false,
        blockers: ['METRIC_ROW_ANCHOR_EXTRACTION_INCOMPLETE'],
      },
    };
    const failurePath = `${outputPath.replace(/\.json$/i, '')}-${stage}-failures.json`;
    await mkdir(dirname(failurePath), { recursive: true });
    await writeFile(failurePath, `${JSON.stringify(failureArtifact, null, 2)}\n`, 'utf8');
    if (!allowIncomplete) {
      throw new Error(
        `${label} failed for ${failures.length} anchors; wrote ${failurePath}: ${JSON.stringify(sample)}`,
      );
    }
    return failures;
  };
  const toAnchor = (result) => ({
    rowKey: result.rowKey,
    sectionId: result.sectionId,
    sourceManifestSectionId: result.sourceManifestSectionId,
    rowId: result.rowId,
    seatId: result.seatId,
    position: result.config.p,
    rotationPosition: finiteVector(result.config.rp, 3) ? result.config.rp : null,
    rotationCenter: finiteVector(result.config.rc, 3) ? result.config.rc : null,
    sourceLastModified: result.lastModified,
    sourceEtag: result.etag,
    coordinateProvenance: result.modeledRecovery
      ? result.modeledRecovery.coordinateProvenance
      : 'DIRECT_PROVIDER_3D_CONFIG',
    directProvider3dCoordinate: !result.modeledRecovery,
    horizontalUncertaintyM: result.modeledRecovery?.horizontalUncertaintyM ?? null,
    verticalUncertaintyM: result.modeledRecovery?.verticalUncertaintyM ?? null,
    modeledRecoveryArtifactVersion: result.modeledRecovery
      ? modeledRecoveryArtifactVersion
      : null,
  });
  const applyModeledRecovery = (results) => results.map((result) => {
    if (finiteVector(result.config?.p, 3)) return result;
    const modeledRecovery = modeledRecoveryBySeat.get(result.seatId);
    if (!modeledRecovery) return result;
    return {
      ...result,
      status: 200,
      lastModified: null,
      etag: null,
      config: { p: modeledRecovery.position },
      modeledRecovery,
    };
  });
  const buildRows = (allAnchors) => {
    const anchorsByRow = new Map();
    for (const anchor of allAnchors) {
      if (!anchorsByRow.has(anchor.rowKey)) anchorsByRow.set(anchor.rowKey, []);
      anchorsByRow.get(anchor.rowKey).push(anchor);
    }
    return requestedRows.map((row) => {
      const available = anchorsByRow.get(row.rowKey) ?? [];
      const fullyRefined = available.length === row.publishedSeatIds.length;
      const selectedIds = fullyRefined ? row.publishedSeatIds : row.anchorSeatIds;
      const rowAnchors = selectedIds.map((seatId) =>
        available.find((anchor) => anchor.seatId === seatId)).filter(Boolean);
      const missingAnchorSeatIds = row.anchorSeatIds.filter((seatId) =>
        !available.some((anchor) => anchor.seatId === seatId));
      const metricAnchorComplete = missingAnchorSeatIds.length === 0;
      const directProviderAnchorComplete = metricAnchorComplete
        && row.anchorSeatIds.every((seatId) => available.some((anchor) =>
          anchor.seatId === seatId && anchor.directProvider3dCoordinate));
      const first = rowAnchors[0];
      const middle = rowAnchors[Math.floor(rowAnchors.length / 2)];
      const last = rowAnchors.at(-1);
      const { publishedSeatIds, ...publicRow } = row;
      return {
        ...publicRow,
        requestedAnchorSeatIds: row.anchorSeatIds,
        anchorSeatIds: rowAnchors.map((anchor) => anchor.seatId),
        missingAnchorSeatIds,
        anchors: rowAnchors,
        metricAnchorComplete,
        directProviderAnchorComplete,
        directProviderAnchorSeatIds: rowAnchors
          .filter((anchor) => anchor.directProvider3dCoordinate)
          .map((anchor) => anchor.seatId),
        recoveredProviderAnchorSeatIds: rowAnchors
          .filter((anchor) => !anchor.directProvider3dCoordinate)
          .map((anchor) => anchor.seatId),
        fullyRefined,
        endToEndMetres: metricAnchorComplete && first && last
          ? distance(first.position, last.position)
          : null,
        middleDeviationFromChordMetres: metricAnchorComplete && rowAnchors.length >= 3
          ? pointToSegmentDistance(middle.position, first.position, last.position)
          : null,
      };
    });
  };

  const rawResults = applyModeledRecovery(await fetchAnchorConfigs(requestedAnchors));
  await requireComplete(rawResults, 'Initial metric row extraction', 'initial-row-anchors');
  let anchors = rawResults
    .filter((result) => finiteVector(result.config?.p, 3))
    .map(toAnchor);
  const initialRows = buildRows(anchors);
  const curvedRowKeys = new Set(initialRows
    .filter((row) => row.metricAnchorComplete && row.middleDeviationFromChordMetres > 0.1)
    .map((row) => row.rowKey));
  const existingIds = new Set(anchors.map((anchor) => anchor.seatId));
  const refinementRequests = requestedRows
    .filter((row) => curvedRowKeys.has(row.rowKey))
    .flatMap((row) => row.publishedSeatIds
      .filter((seatId) => !existingIds.has(seatId))
      .map((seatId) => ({
        rowKey: row.rowKey,
        sectionId: row.sectionId,
        sourceManifestSectionId: row.sourceManifestSectionId,
        rowId: row.rowId,
        seatId,
      })));
  if (refinementRequests.length > 0) {
    const refinementResults = applyModeledRecovery(
      await fetchAnchorConfigs(refinementRequests),
    );
    await requireComplete(refinementResults, 'Curved-row refinement', 'curved-row-refinement');
    anchors = anchors.concat(refinementResults
      .filter((result) => finiteVector(result.config?.p, 3))
      .map(toAnchor));
  }
  const rows = buildRows(anchors);
  const modifiedDates = anchors
    .map((anchor) => anchor.sourceLastModified)
    .filter(Boolean)
    .toSorted((left, right) => Date.parse(left) - Date.parse(right));
  const chordDeviations = rows
    .map((row) => row.middleDeviationFromChordMetres)
    .filter((value) => Number.isFinite(value));
  const completeRows = rows.filter((row) => row.metricAnchorComplete);
  const directProviderCompleteRows = rows.filter((row) => row.directProviderAnchorComplete);
  const fingerprintInput = {
    inputs: {
      inventory: {
        path: inventoryPath,
        sha256: sha256(inventoryBytes),
        artifactVersion: inventory.artifactVersion,
      },
      ...(productAuditPath ? {
        productAudit: {
          path: productAuditPath,
          sha256: productAuditSha256,
          artifactVersion: productAuditArtifactVersion,
        },
      } : {}),
      ...(modeledRecoveryPath ? {
        modeledRecovery: {
          path: modeledRecoveryPath,
          sha256: modeledRecoverySha256,
          artifactVersion: modeledRecoveryArtifactVersion,
        },
      } : {}),
    },
    inventoryArtifactVersion: inventory.artifactVersion,
    productAuditArtifactVersion,
    modeledRecoveryArtifactVersion,
    excludedNonAssignedRowProducts: excludedNonAssignedRowProducts.map((product) => ({
      sectionId: product.sectionId,
      classification: product.classification,
    })),
    unresolvedBlockmapProducts: unresolvedBlockmapProducts.map((product) => ({
      sectionId: product.sectionId,
      classification: product.classification,
    })),
    stadiumId: inventory.stadiumId,
    venueId: inventory.venueId,
    panoramaSet,
    viewerConfigEtag: viewerConfigResult.etag,
    rows: rows.map((row) => ({
      rowKey: row.rowKey,
      publishedSeatCount: row.publishedSeatCount,
      anchors: row.anchors.map((anchor) => ({
        seatId: anchor.seatId,
        position: anchor.position,
        rotationPosition: anchor.rotationPosition,
        rotationCenter: anchor.rotationCenter,
        coordinateProvenance: anchor.coordinateProvenance,
        directProvider3dCoordinate: anchor.directProvider3dCoordinate,
        horizontalUncertaintyM: anchor.horizontalUncertaintyM,
        verticalUncertaintyM: anchor.verticalUncertaintyM,
      })),
    })),
  };
  const artifactVersion = `sha256:${createHash('sha256')
    .update(JSON.stringify(fingerprintInput))
    .digest('hex')}`;
  const artifact = {
    schemaVersion: 4,
    artifactKind: 'venue-local-provider-coordinate-row-anchors',
    artifactVersion,
    inputs: fingerprintInput.inputs,
    inventoryArtifactVersion: inventory.artifactVersion,
    productAuditArtifactVersion,
    modeledRecoveryArtifactVersion,
    stadiumId: inventory.stadiumId,
    venueId: inventory.venueId,
    extractedOn: new Date().toISOString(),
    source: {
      provider: '3D Digital Venue',
      clubLinkedMapUrl: inventory.source.clubLinkedMapUrl,
      finalMapUrl: page.url(),
      viewerVersion,
      panoramaSet,
      viewerConfigUrl,
      viewerConfigLastModified: viewerConfigResult.lastModified,
      viewerConfigEtag: viewerConfigResult.etag,
      license: 'published-for-public-access',
      earliestLastModified: modifiedDates[0] ?? null,
      latestLastModified: modifiedDates.at(-1) ?? null,
    },
    coordinateSystem: {
      kind: 'venue-local-cartesian',
      linearUnit: 'metre',
      georeferenced: false,
      axisDirections: 'not established',
    },
    measurementStatus: {
      establishesPhysicalMeasurement: false,
      classification: 'provider-rendering-coordinate',
      note: 'Direct means fetched from the provider viewer. It does not mean surveyed or remotely measured.',
    },
    completeness: {
      scope: unresolvedBlockmapProducts.length > 0
        ? 'known-ticket-addressable-assigned-rows-partial'
        : 'ticket-addressable-assigned-rows',
      assignedSeatCoverageClaimAllowed: unresolvedBlockmapProducts.length === 0,
      expectedRows: requestedRows.length,
      extractedRows: completeRows.length,
      providerDirectRows: directProviderCompleteRows.length,
      providerRecoveredRows: rows.filter((row) =>
        row.metricAnchorComplete && !row.directProviderAnchorComplete).length,
      partiallyExtractedRows: rows.filter((row) =>
        !row.metricAnchorComplete && row.anchors.length > 0).length,
      missingRows: rows.filter((row) => row.anchors.length === 0).length,
      percent: completeRows.length / requestedRows.length * 100,
      providerDirectPercent: directProviderCompleteRows.length / requestedRows.length * 100,
      expectedAnchors: requestedAnchors.length + refinementRequests.length,
      extractedAnchors: anchors.length,
      providerDirectAnchors: anchors.filter((anchor) =>
        anchor.directProvider3dCoordinate).length,
      providerRecoveredAnchors: anchors.filter((anchor) =>
        !anchor.directProvider3dCoordinate).length,
      excludedNonAssignedRowProducts: excludedNonAssignedRowProducts.map((product) => ({
        sectionId: product.sectionId,
        classification: product.classification,
        providerNodeType: product.providerNodeType,
        assignedRowApplicable: product.assignedRowApplicable,
      })),
      unresolvedBlockmapProducts: unresolvedBlockmapProducts.map((product) => ({
        sectionId: product.sectionId,
        classification: product.classification,
        providerNodeType: product.providerNodeType,
        assignedRowApplicable: product.assignedRowApplicable,
      })),
    },
    shapeDiagnostics: {
      maximumMiddleDeviationFromChordMetres: chordDeviations.length > 0
        ? Math.max(...chordDeviations)
        : null,
      meanMiddleDeviationFromChordMetres: chordDeviations.length > 0
        ? chordDeviations.reduce((sum, value) => sum + value, 0) / chordDeviations.length
        : null,
      curvedRowThresholdMetres: 0.1,
      detectedCurvedRows: curvedRowKeys.size,
      fullyRefinedCurvedRows: rows.filter((row) =>
        curvedRowKeys.has(row.rowKey) && row.fullyRefined).length,
      additionalCurvedRowAnchors: refinementRequests.length,
      note: 'Chord deviation is descriptive only. It is not registration or survey uncertainty.',
    },
    rows,
    publication: {
      eligible: false,
      blockers: [
        'VENUE_LOCAL_FRAME_NOT_REGISTERED',
        'OBSTRUCTION_GEOMETRY_NOT_INCLUDED',
        'SOURCE_CURRENCY_NOT_VERIFIED',
        'SHADOW_HOLDOUT_NOT_PASSED',
        ...(completeRows.length < requestedRows.length
          ? ['METRIC_ROW_ANCHOR_EXTRACTION_INCOMPLETE']
          : []),
        ...(directProviderCompleteRows.length < requestedRows.length
          ? ['DIRECT_PROVIDER_ROW_COORDINATE_COVERAGE_INCOMPLETE']
          : []),
        ...(unresolvedBlockmapProducts.length > 0
          ? ['UNRESOLVED_BLOCKMAP_PRODUCT_SEMANTICS']
          : []),
        ...(excludedNonAssignedRowProducts.length > 0
          ? ['NON_ASSIGNED_ROW_ZONE_GEOMETRY_NOT_EXTRACTED']
          : []),
      ],
    },
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    artifactVersion,
    stadiumId: artifact.stadiumId,
    venueId: artifact.venueId,
    ...artifact.completeness,
    source: artifact.source,
    shapeDiagnostics: artifact.shapeDiagnostics,
    publication: artifact.publication,
  }, null, 2));
} finally {
  await browser.close();
}
