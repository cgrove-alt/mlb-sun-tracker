#!/usr/bin/env node

/**
 * Extract metric seat-camera anchors from a public 3D Digital Venue map linked
 * by an MLB club. The output is a venue-local research artifact. It is never a
 * georeferenced stadium model and can never make public shade results eligible
 * without registration, current obstruction geometry, and a shadow holdout.
 *
 * Usage:
 *   node scripts/extract3dVenueMetricSeats.mjs \
 *     --stadium=phillies \
 *     --url=https://map.3ddigitalvenue.com/philadelphia-phillies \
 *     --section=123 \
 *     --output=tmp/lidar/phillies-section-123-metric-seats.json
 */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { chromium } from 'playwright';
import sharp from 'sharp';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));

const stadiumId = typeof args.stadium === 'string' ? args.stadium : null;
const mapUrl = typeof args.url === 'string' ? args.url : null;
const sectionId = typeof args.section === 'string' ? args.section : null;
const outputPath = typeof args.output === 'string' ? args.output : null;

if (!stadiumId || !mapUrl || !sectionId || !outputPath) {
  console.error('Required: --stadium=ID --url=URL --section=ID --output=PATH');
  process.exit(2);
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

let venueId = null;
let sectionManifest = null;
let sectionManifestMetadata = null;
let targetPanoConfigUrl = null;
let targetPanoMetadata = null;
let resolveSectionManifest;
let resolveTargetPano;
const sectionManifestReady = new Promise((resolve) => { resolveSectionManifest = resolve; });
const targetPanoReady = new Promise((resolve) => { resolveTargetPano = resolve; });

function safePublicUrl(rawUrl) {
  const url = new URL(rawUrl);
  const sensitive = /(?:token|signature|credential|key-pair-id|policy|expires|auth|cookie)/i;
  for (const key of Array.from(url.searchParams.keys())) {
    if (sensitive.test(key)) url.searchParams.set(key, '[redacted]');
  }
  return url.toString();
}

function finiteVector(value, length) {
  return Array.isArray(value)
    && value.length === length
    && value.every((coordinate) => Number.isFinite(coordinate));
}

function responseMetadata(response) {
  const headers = response.headers();
  return {
    url: safePublicUrl(response.url()),
    status: response.status(),
    contentLength: Number(headers['content-length']) || null,
    lastModified: headers['last-modified'] ?? null,
    etag: headers.etag ?? null,
  };
}

function seatNodesFromManifest(manifest) {
  if (!Array.isArray(manifest?.n)) return [];
  return manifest.n
    .filter((group) => group?.h?.t === 'seat' && Array.isArray(group?.n))
    .flatMap((group) => group.n)
    .filter((node) => typeof node?.i === 'string' && finiteVector(node?.c, 2))
    .map((node) => ({ id: node.i, mapCenter: node.c }));
}

function rowAndSeatFromId(seatId) {
  const prefix = `S_${sectionId}-`;
  if (!seatId.startsWith(prefix)) return null;
  const suffix = seatId.slice(prefix.length);
  const splitAt = suffix.lastIndexOf('-');
  if (splitAt <= 0 || splitAt === suffix.length - 1) return null;
  return { row: suffix.slice(0, splitAt), seat: suffix.slice(splitAt + 1) };
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

async function findSelectedSeatPixel(pngBuffer, canvasRect) {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const minX = Math.max(0, Math.floor(canvasRect.x));
  const maxX = Math.min(info.width - 1, Math.ceil(canvasRect.x + canvasRect.width));
  const minY = Math.max(0, Math.floor(canvasRect.y));
  const maxY = Math.min(info.height - 1, Math.ceil(canvasRect.y + canvasRect.height));
  let count = 0;
  let sumX = 0;
  let sumY = 0;
  let matchMinX = maxX;
  let matchMaxX = minX;
  let matchMinY = maxY;
  let matchMaxY = minY;
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const offset = (y * info.width + x) * 4;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      if (!(
        red >= 170 && red <= 235
        && green >= 50 && green <= 135
        && blue >= 80 && blue <= 165
        && red > green * 1.35
        && red > blue * 1.2
      )) continue;
      count += 1;
      sumX += x;
      sumY += y;
      matchMinX = Math.min(matchMinX, x);
      matchMaxX = Math.max(matchMaxX, x);
      matchMinY = Math.min(matchMinY, y);
      matchMaxY = Math.max(matchMaxY, y);
    }
  }
  if (count < 100) {
    throw new Error(`Could not isolate selected seat pixels; found only ${count}`);
  }
  return {
    matchingPixelCount: count,
    centroid: { x: sumX / count, y: sumY / count },
    bounds: {
      x: matchMinX,
      y: matchMinY,
      width: matchMaxX - matchMinX + 1,
      height: matchMaxY - matchMinY + 1,
    },
  };
}

function numericSeatOrder(left, right) {
  const leftDetails = rowAndSeatFromId(left.id);
  const rightDetails = rowAndSeatFromId(right.id);
  const leftNumber = Number(leftDetails?.seat);
  const rightNumber = Number(rightDetails?.seat);
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) return leftNumber - rightNumber;
  return (leftDetails?.seat ?? '').localeCompare(rightDetails?.seat ?? '', undefined, { numeric: true });
}

function summarizePositions(positions) {
  const axes = [0, 1, 2].map((axis) => ({
    min: Math.min(...positions.map((position) => position.position[axis])),
    max: Math.max(...positions.map((position) => position.position[axis])),
  }));
  const rows = new Map();
  for (const position of positions) {
    const details = rowAndSeatFromId(position.id);
    if (!details) continue;
    if (!rows.has(details.row)) rows.set(details.row, []);
    rows.get(details.row).push(position);
  }
  const adjacentDistances = [];
  const rowSummaries = [];
  for (const [row, rowPositions] of rows) {
    const sorted = rowPositions.toSorted(numericSeatOrder);
    for (let index = 1; index < sorted.length; index += 1) {
      const previousDetails = rowAndSeatFromId(sorted[index - 1].id);
      const currentDetails = rowAndSeatFromId(sorted[index].id);
      const previousSeat = Number(previousDetails?.seat);
      const currentSeat = Number(currentDetails?.seat);
      if (!Number.isFinite(previousSeat) || currentSeat !== previousSeat + 1) continue;
      adjacentDistances.push(Math.hypot(
        sorted[index].position[0] - sorted[index - 1].position[0],
        sorted[index].position[1] - sorted[index - 1].position[1],
        sorted[index].position[2] - sorted[index - 1].position[2],
      ));
    }
    rowSummaries.push({
      row,
      seatCount: sorted.length,
      firstSeatId: sorted[0]?.id ?? null,
      lastSeatId: sorted.at(-1)?.id ?? null,
    });
  }
  return {
    coordinateBounds: axes,
    rowCount: rows.size,
    rows: rowSummaries.toSorted((left, right) =>
      left.row.localeCompare(right.row, undefined, { numeric: true })),
    adjacentSeatDistanceMetres: adjacentDistances.length > 0 ? {
      count: adjacentDistances.length,
      min: Math.min(...adjacentDistances),
      max: Math.max(...adjacentDistances),
      mean: adjacentDistances.reduce((sum, distance) => sum + distance, 0) / adjacentDistances.length,
    } : null,
  };
}

page.on('response', async (response) => {
  const url = response.url();
  const tokenMatch = url.match(/\/api\/v1\/dvm\/token\/venue\/([^/?#]+)/);
  if (tokenMatch) venueId = tokenMatch[1];
  try {
    if (new RegExp(`/maps/S_${sectionId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/master_full\\.json(?:[?#]|$)`).test(url)) {
      sectionManifest = await response.json();
      sectionManifestMetadata = responseMetadata(response);
      resolveSectionManifest(sectionManifest);
    }
    if (new RegExp(`/panos/[^/]+/S_${sectionId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-[^/]+/config\\.json(?:[?#]|$)`).test(url)) {
      targetPanoConfigUrl ??= url;
      targetPanoMetadata ??= responseMetadata(response);
      resolveTargetPano(targetPanoConfigUrl);
    }
  } catch (error) {
    console.error(`Ignoring unreadable public venue response: ${error instanceof Error ? error.message : error}`);
  }
});

try {
  await page.goto(mapUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(2_000);
  const rejectCookiesAtLanding = page.getByText('REJECT ALL', { exact: true });
  if (await rejectCookiesAtLanding.count() > 0) {
    await rejectCookiesAtLanding.first().click({ force: true });
  } else {
    await page.mouse.click(1083, 628);
  }
  await page.waitForTimeout(750);
  await page.mouse.click(34, 52);
  const sectionDropdown = page.locator('ng-multiselect-dropdown').nth(0);
  await sectionDropdown.locator('input[type="checkbox"]').first().waitFor({
    state: 'attached',
    timeout: 30_000,
  });
  const sectionOption = sectionDropdown.locator(`input[type="checkbox"][aria-label="${sectionId}"]`);
  if (await sectionOption.count() !== 1) {
    throw new Error(`Section ${sectionId} is not uniquely available in the current public map`);
  }
  await sectionOption.evaluate((element) => element.click());
  const selectedValues = [];
  for (const [dropdownIndex, label] of [[1, 'row'], [2, 'seat']]) {
    const option = page.locator('ng-multiselect-dropdown')
      .nth(dropdownIndex)
      .locator('input[type="checkbox"]')
      .first();
    await option.first().waitFor({ state: 'attached', timeout: 15_000 });
    const value = await option.getAttribute('aria-label');
    if (!value) throw new Error(`No current ${label} value is available for section ${sectionId}`);
    await option.first().evaluate((element) => element.click());
    selectedValues.push(value);
    await page.waitForTimeout(500);
  }
  const [targetRow, targetSeatNumber] = selectedValues;
  const targetSeatId = `S_${sectionId}-${targetRow}-${targetSeatNumber}`;

  const search = page.getByText('Search', { exact: true });
  await search.first().waitFor({ state: 'attached', timeout: 15_000 });
  await search.first().evaluate((element) => element.click());
  await page.waitForTimeout(8_000);
  await withTimeout(sectionManifestReady, 30_000, `section ${sectionId} manifest`);

  const seatNodes = seatNodesFromManifest(sectionManifest);
  if (seatNodes.length === 0) throw new Error(`Section ${sectionId} has no published seat nodes`);
  const targetSeat = seatNodes.find((seat) => seat.id === targetSeatId);
  if (!targetSeat) throw new Error(`Section manifest does not contain selected seat ${targetSeatId}`);

  const canvasRect = await page.locator('canvas').evaluateAll((canvases) => {
    const visible = canvases.find((canvas) => {
      const rect = canvas.getBoundingClientRect();
      return rect.width > 100 && rect.height > 100;
    });
    if (!visible) return null;
    const rect = visible.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
  if (!canvasRect) throw new Error('No visible section-map canvas found');
  const screenshot = await page.screenshot({ fullPage: false });
  const selectedPixel = await findSelectedSeatPixel(screenshot, canvasRect);
  const rejectCookies = page.getByText('Reject All', { exact: true });
  if (await rejectCookies.count() > 0) await rejectCookies.first().click();
  await page.mouse.click(selectedPixel.centroid.x, selectedPixel.centroid.y);
  await withTimeout(targetPanoReady, 30_000, `target panorama ${targetSeat.id}`);

  const rawResults = await page.evaluate(async ({ seats, templateUrl, targetSeatId }) => {
    const results = [];
    const batchSize = 12;
    for (let offset = 0; offset < seats.length; offset += batchSize) {
      const batch = seats.slice(offset, offset + batchSize);
      const batchResults = await Promise.all(batch.map(async (seat) => {
        const requestUrl = templateUrl.replace(
          `/${targetSeatId}/config.json`,
          `/${seat.id}/config.json`,
        );
        let lastFailure = null;
        for (let attempt = 1; attempt <= 2; attempt += 1) {
          try {
            const response = await fetch(requestUrl, { credentials: 'include' });
            if (response.ok) {
              return {
                id: seat.id,
                mapCenter: seat.mapCenter,
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
          await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
        }
        return { id: seat.id, mapCenter: seat.mapCenter, ...lastFailure };
      }));
      results.push(...batchResults);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    return results;
  }, {
    seats: seatNodes,
    templateUrl: targetPanoConfigUrl,
    targetSeatId: targetSeat.id,
  });

  const failures = rawResults.filter((result) => !finiteVector(result.config?.p, 3));
  if (failures.length > 0) {
    throw new Error(
      `Metric extraction is incomplete: ${failures.length} of ${seatNodes.length} seat configs failed`,
    );
  }
  const positions = rawResults.map((result) => ({
    id: result.id,
    mapCenter: result.mapCenter,
    position: result.config.p,
    rotationPosition: finiteVector(result.config.rp, 3) ? result.config.rp : null,
    rotationCenter: finiteVector(result.config.rc, 3) ? result.config.rc : null,
    sourceLastModified: result.lastModified,
    sourceEtag: result.etag,
  }));
  const summary = summarizePositions(positions);
  const fingerprintInput = {
    stadiumId,
    venueId,
    sectionId,
    sectionManifestEtag: sectionManifestMetadata?.etag ?? null,
    positions: positions.map(({ id, mapCenter, position, rotationPosition, rotationCenter }) => ({
      id,
      mapCenter,
      position,
      rotationPosition,
      rotationCenter,
    })),
  };
  const artifactVersion = `sha256:${createHash('sha256')
    .update(JSON.stringify(fingerprintInput))
    .digest('hex')}`;
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-local-metric-seat-anchors',
    artifactVersion,
    stadiumId,
    venueId,
    sectionId,
    extractedOn: new Date().toISOString(),
    source: {
      provider: '3D Digital Venue',
      clubLinkedMapUrl: mapUrl,
      finalMapUrl: page.url(),
      sectionManifest: sectionManifestMetadata,
      targetPanoConfig: targetPanoMetadata,
      license: 'published-for-public-access',
    },
    coordinateSystem: {
      kind: 'venue-local-cartesian',
      linearUnit: 'metre',
      georeferenced: false,
      axisDirections: 'not established',
      note: 'Camera anchors are metric and internally coherent but require a measured rigid registration to the stadium CRS.',
    },
    completeness: {
      expectedSeatAnchors: seatNodes.length,
      extractedSeatAnchors: positions.length,
      percent: positions.length / seatNodes.length * 100,
    },
    interactionVerification: {
      targetSeatId: targetSeat.id,
      selectedPixel,
      targetPosition: positions.find((position) => position.id === targetSeat.id)?.position ?? null,
    },
    summary,
    positions,
    publication: {
      eligible: false,
      blockers: [
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
    sectionId,
    expectedSeatAnchors: seatNodes.length,
    extractedSeatAnchors: positions.length,
    rowCount: summary.rowCount,
    adjacentSeatDistanceMetres: summary.adjacentSeatDistanceMetres,
    publication: artifact.publication,
  }, null, 2));
} catch (error) {
  const diagnosticPath = outputPath.replace(/\.json$/i, '-failure.png');
  await mkdir(dirname(diagnosticPath), { recursive: true });
  await page.screenshot({ path: diagnosticPath, fullPage: true }).catch(() => null);
  console.error(JSON.stringify({
    diagnosticPath,
    finalUrl: page.url(),
    title: await page.title().catch(() => null),
    visibleText: (await page.locator('body').innerText().catch(() => '')).slice(0, 4000),
  }, null, 2));
  throw error;
} finally {
  await browser.close();
}
