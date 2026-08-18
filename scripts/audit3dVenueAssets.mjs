#!/usr/bin/env node

/**
 * Audit the public asset manifest loaded by a club-linked 3D Digital Venue map.
 *
 * This is a read-only discovery tool. It reports request metadata and compact
 * JSON shapes without writing response bodies or treating viewer coordinates
 * as surveyed geometry.
 *
 * Usage:
 *   node scripts/audit3dVenueAssets.mjs <mapUrl>
 */

import { chromium } from 'playwright';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const [mapUrl, sectionId, rowId, seatId, outputPath] = process.argv.slice(2);
if (!mapUrl) {
  console.error(
    'Usage: node scripts/audit3dVenueAssets.mjs <mapUrl> [sectionId rowId seatId [outputPath]]',
  );
  process.exit(2);
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
const responses = [];
let searchTriggered = false;
let selectedSeatMapCoordinate = null;
let selectedSectionSeats = [];
let selectedPanoConfigUrl = null;
let selectedPanoId = null;

const SENSITIVE_QUERY_KEY = /(?:token|signature|credential|key-pair-id|policy|expires|auth|cookie)/i;
const INTERESTING_KEY = /(?:^|_)(?:x|y|z|lat|lon|lng|latitude|longitude|elevation|altitude|height|position|coordinate|camera|heading|bearing|rotation|transform|matrix|origin|center|centroid|vertex|vertices|point|points)(?:$|_)/i;

function safeUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (SENSITIVE_QUERY_KEY.test(key)) parsed.searchParams.set(key, '[redacted]');
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

function valueShape(value, depth = 0) {
  if (depth >= 3) return Array.isArray(value) ? `array(${value.length})` : typeof value;
  if (Array.isArray(value)) {
    return {
      type: 'array',
      length: value.length,
      first: value.length ? valueShape(value[0], depth + 1) : null,
    };
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    return {
      type: 'object',
      keyCount: keys.length,
      keys: keys.slice(0, 40),
      sample: Object.fromEntries(
        keys.slice(0, 8).map((key) => [key, valueShape(value[key], depth + 1)]),
      ),
    };
  }
  return value === null ? 'null' : typeof value;
}

function serializedSize(value) {
  try {
    return JSON.stringify(value).length;
  } catch {
    return null;
  }
}

function findInterestingValues(value, path = '$', results = [], depth = 0) {
  if (results.length >= 80 || depth > 12 || value === null || value === undefined) {
    return results;
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < Math.min(value.length, 20); index += 1) {
      findInterestingValues(value[index], `${path}[${index}]`, results, depth + 1);
      if (results.length >= 80) break;
    }
    return results;
  }
  if (typeof value !== 'object') return results;
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    if (INTERESTING_KEY.test(key)) {
      results.push({
        path: childPath,
        value: serializedSize(child) !== null && serializedSize(child) <= 1_200
          ? child
          : valueShape(child),
      });
    }
    findInterestingValues(child, childPath, results, depth + 1);
    if (results.length >= 80) break;
  }
  return results;
}

function summarizeNodes(nodes) {
  if (!Array.isArray(nodes)) return valueShape(nodes);
  const groups = nodes.map((group, groupIndex) => ({
    groupIndex,
    keys: group && typeof group === 'object' ? Object.keys(group) : [],
    nodeCount: Array.isArray(group?.n) ? group.n.length : null,
    header: group?.h ?? null,
    firstNodes: Array.isArray(group?.n) ? group.n.slice(0, 3) : [],
  }));
  return {
    groupCount: groups.length,
    totalNodeCount: groups.reduce((sum, group) => sum + (group.nodeCount ?? 0), 0),
    groups,
  };
}

function summarizeOptions(options) {
  if (!options || typeof options !== 'object') return valueShape(options);
  return {
    keys: Object.keys(options),
    neighbors: options.neighbors ?? null,
    rows: Array.isArray(options.rows)
      ? options.rows.map((row) => ({
          id: row?.i ?? null,
          seatCount: Array.isArray(row?.n) ? row.n.length : null,
          firstSeats: Array.isArray(row?.n) ? row.n.slice(0, 3) : [],
          lastSeats: Array.isArray(row?.n) ? row.n.slice(-3) : [],
        }))
      : valueShape(options.rows),
    related: options.related ?? null,
  };
}

function summarizeVenueJson(url, json) {
  const size = serializedSize(json);
  if (size !== null && size <= 5_000) return { serializedSize: size, value: json };

  const summary = {
    serializedSize: size,
    shape: valueShape(json),
    interestingValues: findInterestingValues(json),
  };
  if (/\/maps\/[^/]+\/master_full\.json(?:[?#]|$)/i.test(url)) {
    summary.sectionMap = {
      specification: json?.s ?? null,
      configuration: json?.c ?? null,
      layers: json?.l ?? null,
      metadata: json?.m ?? null,
      nodes: summarizeNodes(json?.n),
      options: summarizeOptions(json?.o),
    };
  } else if (/seatNeighbours\.json(?:[?#]|$)/i.test(url)) {
    const entries = json && typeof json === 'object' ? Object.entries(json) : [];
    summary.seatNeighbours = {
      entryCount: entries.length,
      sample: entries.slice(0, 5),
    };
  }
  return summary;
}

function isVenueRelatedUrl(rawUrl) {
  try {
    const { hostname, pathname } = new URL(rawUrl);
    return (
      hostname.endsWith('3ddvapis.com')
      || hostname.endsWith('3ddigitalvenue.com')
      || hostname.endsWith('3ddvfactory.com')
    ) && !(
      /\.(?:js|css|woff2?|ttf|ico)(?:$|[?#])/i.test(pathname)
      || /\/(?:analytics|telemetry|events)(?:\/|$)/i.test(pathname)
      || /\/tilemap\/.*\.(?:jpg|png)(?:$|[?#])/i.test(pathname)
    );
  } catch {
    return false;
  }
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
      const selectedFill = (
        red >= 170 && red <= 235
        && green >= 50 && green <= 135
        && blue >= 80 && blue <= 165
        && red > green * 1.35
        && red > blue * 1.2
      );
      if (!selectedFill) continue;
      count += 1;
      sumX += x;
      sumY += y;
      matchMinX = Math.min(matchMinX, x);
      matchMaxX = Math.max(matchMaxX, x);
      matchMinY = Math.min(matchMinY, y);
      matchMaxY = Math.max(matchMaxY, y);
    }
  }
  if (count < 100) return { found: false, matchingPixelCount: count };
  return {
    found: true,
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

async function findAvailableSeatCenters(pngBuffer, canvasRect) {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const mask = new Uint8Array(info.width * info.height);
  const minX = Math.max(0, Math.floor(canvasRect.x));
  const maxX = Math.min(info.width - 1, Math.ceil(canvasRect.x + canvasRect.width));
  const minY = Math.max(0, Math.floor(canvasRect.y));
  const maxY = Math.min(info.height - 1, Math.ceil(canvasRect.y + canvasRect.height));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const offset = (y * info.width + x) * 4;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      if (
        red >= 20 && red <= 115
        && green >= 100 && green <= 205
        && blue >= 35 && blue <= 155
        && green > red * 1.45
        && green > blue * 1.12
      ) {
        mask[y * info.width + x] = 1;
      }
    }
  }
  const components = [];
  const rowBands = [];
  let currentBand = null;
  for (let y = minY; y <= maxY; y += 1) {
    let count = 0;
    let rowMinX = maxX;
    let rowMaxX = minX;
    for (let x = minX; x <= maxX; x += 1) {
      if (mask[y * info.width + x] !== 1) continue;
      count += 1;
      rowMinX = Math.min(rowMinX, x);
      rowMaxX = Math.max(rowMaxX, x);
    }
    if (count >= 20) {
      if (!currentBand || y > currentBand.maxY + 1) {
        currentBand = { minY: y, maxY: y, minX: rowMinX, maxX: rowMaxX };
        rowBands.push(currentBand);
      } else {
        currentBand.maxY = y;
        currentBand.minX = Math.min(currentBand.minX, rowMinX);
        currentBand.maxX = Math.max(currentBand.maxX, rowMaxX);
      }
    }
  }
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const start = y * info.width + x;
      if (mask[start] !== 1) continue;
      mask[start] = 2;
      const stack = [start];
      let count = 0;
      let sumX = 0;
      let sumY = 0;
      let componentMinX = x;
      let componentMaxX = x;
      let componentMinY = y;
      let componentMaxY = y;
      while (stack.length > 0) {
        const index = stack.pop();
        const pixelY = Math.floor(index / info.width);
        const pixelX = index - pixelY * info.width;
        count += 1;
        sumX += pixelX;
        sumY += pixelY;
        componentMinX = Math.min(componentMinX, pixelX);
        componentMaxX = Math.max(componentMaxX, pixelX);
        componentMinY = Math.min(componentMinY, pixelY);
        componentMaxY = Math.max(componentMaxY, pixelY);
        for (const neighbor of [index - 1, index + 1, index - info.width, index + info.width]) {
          const neighborY = Math.floor(neighbor / info.width);
          const neighborX = neighbor - neighborY * info.width;
          if (
            neighborX < minX || neighborX > maxX
            || neighborY < minY || neighborY > maxY
            || mask[neighbor] !== 1
          ) continue;
          mask[neighbor] = 2;
          stack.push(neighbor);
        }
      }
      const width = componentMaxX - componentMinX + 1;
      const height = componentMaxY - componentMinY + 1;
      if (count >= 100 && width >= 8 && height >= 8 && width <= 80 && height <= 80) {
        components.push({
          pixelCount: count,
          center: { x: sumX / count, y: sumY / count },
          bounds: {
            x: componentMinX,
            y: componentMinY,
            width,
            height,
          },
        });
      }
    }
  }
  return {
    components: components.sort((left, right) =>
      left.center.y - right.center.y || left.center.x - right.center.x),
    rowBands: rowBands.filter((band) => band.maxY - band.minY + 1 >= 8),
  };
}

function matchSeatCenter(sectionSeats, components, targetId) {
  const rows = new Map();
  for (const seat of sectionSeats) {
    const parts = seat.id.split('-');
    const rowId = parts.at(-2);
    if (!rows.has(rowId)) rows.set(rowId, []);
    rows.get(rowId).push(seat);
  }
  const mapRows = Array.from(rows, ([rowId, seats]) => ({
    rowId,
    seats: seats.toSorted((left, right) => left.mapCenter[0] - right.mapCenter[0]),
    medianY: seats.map((seat) => seat.mapCenter[1]).toSorted((left, right) => left - right)[
      Math.floor(seats.length / 2)
    ],
  })).toSorted((left, right) => left.medianY - right.medianY);
  const screenRows = [];
  for (const component of components) {
    const row = screenRows.at(-1);
    if (!row || Math.abs(component.center.y - row.meanY) > 18) {
      screenRows.push({ meanY: component.center.y, components: [component] });
    } else {
      row.components.push(component);
      row.meanY = row.components.reduce((sum, item) => sum + item.center.y, 0)
        / row.components.length;
    }
  }
  for (const row of screenRows) {
    row.components.sort((left, right) => left.center.x - right.center.x);
  }
  const countsMatch = mapRows.length === screenRows.length
    && mapRows.every((row, index) => row.seats.length === screenRows[index].components.length);
  if (!countsMatch) {
    return {
      matched: false,
      mapRowCounts: mapRows.map((row) => ({ rowId: row.rowId, count: row.seats.length })),
      screenRowCounts: screenRows.map((row) => row.components.length),
    };
  }
  for (let rowIndex = 0; rowIndex < mapRows.length; rowIndex += 1) {
    const seatIndex = mapRows[rowIndex].seats.findIndex((seat) => seat.id === targetId);
    if (seatIndex >= 0) {
      return {
        matched: true,
        mapRowCounts: mapRows.map((row) => ({ rowId: row.rowId, count: row.seats.length })),
        screenRowCounts: screenRows.map((row) => row.components.length),
        targetCenter: screenRows[rowIndex].components[seatIndex].center,
      };
    }
  }
  return { matched: false, reason: 'TARGET_SEAT_NOT_FOUND' };
}

function matchSeatCenterFromBands(sectionSeats, rowBands, targetId) {
  const rows = new Map();
  for (const seat of sectionSeats) {
    const parts = seat.id.split('-');
    const rowId = parts.at(-2);
    if (!rows.has(rowId)) rows.set(rowId, []);
    rows.get(rowId).push(seat);
  }
  const mapRows = Array.from(rows, ([rowId, seats]) => ({
    rowId,
    seats: seats.toSorted((left, right) => left.mapCenter[0] - right.mapCenter[0]),
    medianY: seats.map((seat) => seat.mapCenter[1]).toSorted((left, right) => left - right)[
      Math.floor(seats.length / 2)
    ],
  })).toSorted((left, right) => left.medianY - right.medianY);
  if (mapRows.length !== rowBands.length) {
    return { matched: false, mapRowCount: mapRows.length, screenBandCount: rowBands.length };
  }
  for (let rowIndex = 0; rowIndex < mapRows.length; rowIndex += 1) {
    const seatIndex = mapRows[rowIndex].seats.findIndex((seat) => seat.id === targetId);
    if (seatIndex < 0) continue;
    const band = rowBands[rowIndex];
    const fraction = (seatIndex + 0.5) / mapRows[rowIndex].seats.length;
    return {
      matched: true,
      rowId: mapRows[rowIndex].rowId,
      seatIndex,
      screenBand: band,
      targetCenter: {
        x: band.minX + fraction * (band.maxX - band.minX + 1),
        y: (band.minY + band.maxY) / 2,
      },
    };
  }
  return { matched: false, reason: 'TARGET_SEAT_NOT_FOUND' };
}

page.on('response', async (response) => {
  const request = response.request();
  const headers = response.headers();
  const contentType = headers['content-type'] ?? '';
  const record = {
    url: safeUrl(response.url()),
    status: response.status(),
    resourceType: request.resourceType(),
    contentType,
    contentLength: Number(headers['content-length']) || null,
    phase: searchTriggered ? 'after-search' : 'initial',
  };
  if (contentType.includes('json') || /\.json(?:[?#]|$)/i.test(record.url)) {
    try {
      const json = await response.json();
      if (/resources-contentdistribution\.3ddvapis\.com\/v2-resources-[^/]+\/nam-/i.test(record.url)) {
        record.jsonSummary = summarizeVenueJson(record.url, json);
        if (sectionId && rowId && seatId && /\/maps\/S_[^/]+\/master_full\.json(?:[?#]|$)/i.test(record.url)) {
          const targetId = `S_${sectionId}-${rowId}-${seatId}`;
          const seatNode = Array.isArray(json?.n)
            ? json.n.flatMap((group) => Array.isArray(group?.n) ? group.n : [])
              .find((node) => node?.i === targetId)
            : null;
          if (seatNode && Array.isArray(seatNode.c) && Array.isArray(json?.m?.bb)) {
            selectedSeatMapCoordinate = {
              id: targetId,
              center: seatNode.c,
              mapBounds: json.m.bb,
            };
          }
          selectedSectionSeats = Array.isArray(json?.n)
            ? json.n.flatMap((group) => Array.isArray(group?.n) ? group.n : [])
              .filter((node) => /^S_[^-]+-[^-]+-[^-]+$/.test(node?.i ?? '') && Array.isArray(node?.c))
              .map((node) => ({ id: node.i, mapCenter: node.c }))
            : [];
        }
      } else {
        record.jsonShape = valueShape(json);
      }
    } catch (error) {
      record.jsonError = error instanceof Error ? error.message : String(error);
    }
  }
  responses.push(record);
  const panoramaConfigMatch = record.url.match(
    /\/panos\/[^/]+\/(S_[^/]+)\/config\.json(?:[?#]|$)/,
  );
  if (
    sectionId
    && panoramaConfigMatch
    && record.url.includes(`/S_${sectionId}-`)
  ) {
    selectedPanoConfigUrl = response.url();
    selectedPanoId = panoramaConfigMatch[1];
  }
});

try {
  await page.goto(mapUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(5_000);
  const initialRejectButton = page.locator('button').filter({ hasText: /reject all/i });
  if (await initialRejectButton.count() > 0) {
    await initialRejectButton.first().click({ force: true });
    await page.waitForTimeout(5_000);
  }
  if (sectionId) {
    const searchControl = page.locator(
      'app-search-simple button:visible, app-search button:visible',
    ).first();
    if (await searchControl.count() > 0) {
      await searchControl.click({ force: true });
    } else {
      await page.mouse.click(34, 52);
    }
    await page.waitForTimeout(3_000);
  }
  let sectionSearchSelection = null;
  if (sectionId) {
    const searchInput = page.locator(
      'input[placeholder="Enter section number..."]:visible, input[placeholder="Enter section number"]:visible',
    ).first();
    sectionSearchSelection = {
      inputCount: await searchInput.count(),
      suggestionCount: 0,
      suggestionTexts: [],
      clickedSuggestion: false,
      pressedEnter: false,
    };
    if (sectionSearchSelection.inputCount > 0) {
      searchTriggered = true;
      await searchInput.fill(sectionId);
      await page.waitForTimeout(2_000);
      const suggestions = page.getByText(sectionId, { exact: true });
      const suggestionCount = await suggestions.count();
      sectionSearchSelection.suggestionCount = suggestionCount;
      sectionSearchSelection.suggestionTexts = await page.locator(
        'app-searcher-bar li:visible, app-searcher-bar [role="option"]:visible, app-searcher-bar .result:visible',
      ).allTextContents();
      for (let index = 0; index < suggestionCount; index += 1) {
        if (await suggestions.nth(index).isVisible()) {
          await suggestions.nth(index).click({ force: true });
          sectionSearchSelection.clickedSuggestion = true;
          break;
        }
      }
      if (!sectionSearchSelection.clickedSuggestion) {
        await searchInput.press('Enter');
        sectionSearchSelection.pressedEnter = true;
      }
      await page.waitForTimeout(8_000);
    }
  }
  let sectionSelection = null;
  if (sectionId) {
    const svgLocator = page.locator(`[id="S_${sectionId}"]`);
    const sectionDropdown = page.locator('ng-multiselect-dropdown').nth(0);
    const checkboxLocator = sectionDropdown.locator(`input[type="checkbox"][aria-label="${sectionId}"]`);
    const svgMatchCount = await svgLocator.count();
    const checkboxMatchCount = await checkboxLocator.count();
    sectionSelection = {
      sectionId,
      svgMatchCount,
      checkboxMatchCount,
      method: null,
      clicked: false,
    };
    if (checkboxMatchCount > 0) {
      await checkboxLocator.first().evaluate((element) => element.click());
      sectionSelection.method = 'search-checkbox';
      sectionSelection.clicked = true;
      await page.waitForTimeout(8_000);
    } else if (svgMatchCount > 0) {
      await svgLocator.first().click({ force: true });
      sectionSelection.method = 'svg-node';
      sectionSelection.clicked = true;
      await page.waitForTimeout(8_000);
    }
  } else {
    await page.waitForTimeout(3_000);
  }
  const followupSelections = [];
  for (const [dropdownIndex, label, value] of [
    [1, 'row', rowId],
    [2, 'seat', seatId],
  ]) {
    if (!value) continue;
    const locator = page
      .locator('ng-multiselect-dropdown')
      .nth(dropdownIndex)
      .locator(`input[type="checkbox"][aria-label="${value}"]`);
    const matchCount = await locator.count();
    const selection = { label, value, matchCount, clicked: false };
    if (matchCount > 0) {
      await locator.first().evaluate((element) => element.click());
      selection.clicked = true;
      await page.waitForTimeout(2_000);
    }
    followupSelections.push(selection);
  }
  let searchSelection = null;
  let seatNodeSelection = null;
  if (rowId) {
    const roleButton = page.getByRole('button', { name: 'Search', exact: true });
    const textControl = page.getByText('Search', { exact: true });
    const roleCount = await roleButton.count();
    const textCount = await textControl.count();
    searchSelection = { roleCount, textCount, clicked: false, method: null };
    if (roleCount > 0) {
      searchTriggered = true;
      await roleButton.first().evaluate((element) => element.click());
      searchSelection.clicked = true;
      searchSelection.method = 'button-role';
      await page.waitForTimeout(8_000);
    } else if (textCount > 0) {
      searchTriggered = true;
      await textControl.first().evaluate((element) => element.click());
      searchSelection.clicked = true;
      searchSelection.method = 'exact-text';
      await page.waitForTimeout(8_000);
    }
  }
  if (sectionId && rowId && seatId) {
    const seatNodeId = `S_${sectionId}-${rowId}-${seatId}`;
    const seatNode = page.locator(`[id="${seatNodeId}"]`);
    const matchCount = await seatNode.count();
    seatNodeSelection = { seatNodeId, matchCount, clicked: false };
    if (matchCount > 0) {
      await seatNode.first().click({ force: true });
      seatNodeSelection.clicked = true;
      await page.waitForTimeout(12_000);
    }
  }
  const canvasDetails = await page.locator('canvas').evaluateAll((canvases) =>
    canvases.map((canvas, index) => {
      const rect = canvas.getBoundingClientRect();
      return {
        index,
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
        style: canvas.getAttribute('style'),
        className: canvas.className,
      };
    }),
  );
  const screenshotPath = sectionId && rowId && seatId
    ? outputPath
      ? outputPath.replace(/\.json$/i, '.png')
      : `tmp/3ddv-${sectionId}-${rowId}-${seatId}.png`
    : null;
  let screenshotSha256 = null;
  let seatCanvasSelection = null;
  let afterSeatClickScreenshotPath = null;
  let afterSeatClickScreenshotSha256 = null;
  let sampledPanoPositions = null;
  if (screenshotPath) {
    const screenshotBuffer = await page.screenshot({ path: screenshotPath, fullPage: false });
    screenshotSha256 = createHash('sha256').update(screenshotBuffer).digest('hex');
    const visibleCanvas = canvasDetails.find((canvas) => canvas.rect.width > 0 && canvas.rect.height > 0);
    if (visibleCanvas) {
      const pixelMatch = await findSelectedSeatPixel(screenshotBuffer, visibleCanvas.rect);
      const availableSeatDetection = await findAvailableSeatCenters(
        screenshotBuffer,
        visibleCanvas.rect,
      );
      const targetId = `S_${sectionId}-${rowId}-${seatId}`;
      const availableSeatMatch = matchSeatCenter(
        selectedSectionSeats,
        availableSeatDetection.components,
        targetId,
      );
      const availableSeatBandMatch = matchSeatCenterFromBands(
        selectedSectionSeats,
        availableSeatDetection.rowBands,
        targetId,
      );
      const rejectButton = page.getByText('Reject All', { exact: true });
      const rejectButtonCount = await rejectButton.count();
      seatCanvasSelection = {
        pixelMatch,
        availableSeatComponentCount: availableSeatDetection.components.length,
        availableSeatRowBands: availableSeatDetection.rowBands,
        availableSeatMatch,
        availableSeatBandMatch,
        rejectButtonCount,
        privacyRejected: false,
        clicked: false,
      };
      const largestAvailableSeatBand = availableSeatDetection.rowBands
        .toSorted((left, right) => (
          (right.maxX - right.minX + 1) * (right.maxY - right.minY + 1)
          - (left.maxX - left.minX + 1) * (left.maxY - left.minY + 1)
        ))[0] ?? null;
      seatCanvasSelection.largestAvailableSeatBand = largestAvailableSeatBand;
      if (
        pixelMatch.found
        || availableSeatMatch.matched
        || availableSeatBandMatch.matched
        || largestAvailableSeatBand
      ) {
        if (rejectButtonCount > 0) {
          await rejectButton.first().click();
          seatCanvasSelection.privacyRejected = true;
          await page.waitForTimeout(500);
        }
        const clickPoint = availableSeatMatch.matched
          ? availableSeatMatch.targetCenter
          : availableSeatBandMatch.matched
            ? availableSeatBandMatch.targetCenter
            : pixelMatch.found
              ? pixelMatch.centroid
              : {
                  x: (largestAvailableSeatBand.minX + largestAvailableSeatBand.maxX) / 2,
                  y: (largestAvailableSeatBand.minY + largestAvailableSeatBand.maxY) / 2,
                };
        seatCanvasSelection.clickPoint = clickPoint;
        seatCanvasSelection.clickMethod = availableSeatMatch.matched
          ? 'matched-component'
          : availableSeatBandMatch.matched
            ? 'matched-row-band'
            : pixelMatch.found
              ? 'selected-fill'
              : 'largest-available-seat-band-probe';
        await page.mouse.click(clickPoint.x, clickPoint.y);
        seatCanvasSelection.clicked = true;
        await page.waitForTimeout(12_000);
        afterSeatClickScreenshotPath = `tmp/3ddv-${sectionId}-${rowId}-${seatId}-after-click.png`;
        const afterSeatClickScreenshotBuffer = await page.screenshot({
          path: afterSeatClickScreenshotPath,
          fullPage: false,
        });
        afterSeatClickScreenshotSha256 = createHash('sha256')
          .update(afterSeatClickScreenshotBuffer)
          .digest('hex');
        if (selectedPanoConfigUrl && selectedSectionSeats.length > 0) {
          const rows = new Map();
          for (const seat of selectedSectionSeats) {
            const parts = seat.id.split('-');
            const row = parts.at(-2);
            if (!rows.has(row)) rows.set(row, []);
            rows.get(row).push(seat);
          }
          const sampleSeats = [];
          for (const [row, seats] of rows) {
            const sorted = seats.toSorted((left, right) => {
              const leftSeat = Number(left.id.split('-').at(-1));
              const rightSeat = Number(right.id.split('-').at(-1));
              return leftSeat - rightSeat;
            });
            const candidates = row === rowId
              ? sorted
              : [sorted[0], sorted[Math.floor(sorted.length / 2)], sorted.at(-1)];
            for (const candidate of candidates) {
              if (candidate && !sampleSeats.some((seat) => seat.id === candidate.id)) {
                sampleSeats.push(candidate);
              }
            }
          }
          const templateUrl = new URL(selectedPanoConfigUrl);
          const configs = await page.evaluate(async ({ samples, template, target }) => {
            const results = [];
            for (let index = 0; index < samples.length; index += 8) {
              const batch = samples.slice(index, index + 8);
              const batchResults = await Promise.all(batch.map(async (sample) => {
                const url = template.replace(`/${target}/config.json`, `/${sample.id}/config.json`);
                try {
                  const response = await fetch(url, { credentials: 'include' });
                  return {
                    id: sample.id,
                    mapCenter: sample.mapCenter,
                    status: response.status,
                    config: response.ok ? await response.json() : null,
                  };
                } catch (error) {
                  return { id: sample.id, mapCenter: sample.mapCenter, error: String(error) };
                }
              }));
              results.push(...batchResults);
            }
            return results;
          }, {
            samples: sampleSeats,
            template: templateUrl.toString(),
            target: selectedPanoId,
          });
          const successful = configs.filter((config) => Array.isArray(config.config?.p));
          const distances = [];
          for (const config of successful) {
            const seatNumber = Number(config.id.split('-').at(-1));
            const adjacentId = config.id.replace(/-\d+$/, `-${seatNumber + 1}`);
            const adjacent = successful.find((candidate) => candidate.id === adjacentId);
            if (!adjacent) continue;
            distances.push(Math.hypot(
              config.config.p[0] - adjacent.config.p[0],
              config.config.p[1] - adjacent.config.p[1],
              config.config.p[2] - adjacent.config.p[2],
            ));
          }
          sampledPanoPositions = {
            requested: configs.length,
            successful: successful.length,
            failed: configs.length - successful.length,
            coordinateBounds: successful.length > 0 ? [0, 1, 2].map((axis) => ({
              min: Math.min(...successful.map((config) => config.config.p[axis])),
              max: Math.max(...successful.map((config) => config.config.p[axis])),
            })) : null,
            adjacentSeatDistance: distances.length > 0 ? {
              count: distances.length,
              min: Math.min(...distances),
              max: Math.max(...distances),
              mean: distances.reduce((sum, distance) => sum + distance, 0) / distances.length,
            } : null,
            positions: successful.map((config) => ({
              id: config.id,
              mapCenter: config.mapCenter,
              position: config.config.p,
              rotationPosition: config.config.rp,
              rotationCenter: config.config.rc,
            })),
            failures: configs.filter((config) => !Array.isArray(config.config?.p)),
          };
        }
      }
    }
  }
  const performanceUrls = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((entry) => entry.name),
  );
  const pageStructure = await page.evaluate(() => ({
    bodyText: document.body.innerText.slice(0, 2_000),
    svgCount: document.querySelectorAll('svg').length,
    canvasCount: document.querySelectorAll('canvas').length,
    iframeCount: document.querySelectorAll('iframe').length,
    customElements: Array.from(new Set(
      Array.from(document.querySelectorAll('*'))
        .map((element) => element.tagName.toLowerCase())
        .filter((tagName) => tagName.includes('-')),
    )).sort(),
    dropdowns: Array.from(document.querySelectorAll('ng-multiselect-dropdown')).map((dropdown) => ({
      text: (dropdown.textContent ?? '').trim().slice(0, 240),
      valueCount: dropdown.querySelectorAll('input[type="checkbox"]').length,
      firstValues: Array.from(dropdown.querySelectorAll('input[type="checkbox"]'))
        .map((element) => element.getAttribute('aria-label'))
        .filter(Boolean)
        .slice(0, 8),
      lastValues: Array.from(dropdown.querySelectorAll('input[type="checkbox"]'))
        .map((element) => element.getAttribute('aria-label'))
        .filter(Boolean)
        .slice(-8),
      checkedValues: Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked'))
        .map((element) => element.getAttribute('aria-label'))
        .filter(Boolean),
    })),
    inputs: Array.from(document.querySelectorAll('input')).map((element) => ({
      type: element.type,
      name: element.name,
      placeholder: element.placeholder,
      ariaLabel: element.getAttribute('aria-label'),
      value: element.value,
    })).slice(0, 40),
    buttons: Array.from(document.querySelectorAll('button')).map((element) => ({
      text: (element.textContent ?? '').trim().slice(0, 120),
      ariaLabel: element.getAttribute('aria-label'),
      title: element.getAttribute('title'),
      className: element.className,
    })).slice(0, 60),
  }));
  const scriptSources = await page.evaluate(() =>
    Array.from(document.scripts)
      .map((script) => script.src)
      .filter(Boolean)
      .sort(),
  );
  const deduplicated = Array.from(
    new Map(responses.map((record) => [record.url, record])).values(),
  ).sort((left, right) => left.url.localeCompare(right.url));
  const venueResponses = deduplicated.filter((record) =>
    isVenueRelatedUrl(record.url)
    && (
      record.phase === 'after-search'
      || record.url.includes('contentdistribution.3ddvapis.com/api/v1/dvm/token/venue/')
      || record.url.includes('resources-contentdistribution.3ddvapis.com/v2-resources-')
    ),
  );
  const afterSearchResponses = deduplicated
    .filter((record) =>
      record.phase === 'after-search'
      && !/\/tilemap\/.*\.(?:jpg|png)(?:[?#]|$)/i.test(record.url)
      && !/(?:google-analytics\.com|googletagmanager\.com)/i.test(record.url),
    )
    .map(({ url, status, resourceType, contentType, contentLength }) => ({
      url,
      status,
      resourceType,
      contentType,
      contentLength,
    }));
  const audit = {
    auditedOn: new Date().toISOString(),
    mapUrl,
    finalUrl: page.url(),
    title: await page.title(),
    sectionSearchSelection,
    sectionSelection,
    followupSelections,
    searchSelection,
    seatNodeSelection,
    selectedSeatMapCoordinate,
    canvasDetails,
    screenshotPath,
    screenshotSha256,
    seatCanvasSelection,
    afterSeatClickScreenshotPath,
    afterSeatClickScreenshotSha256,
    sampledPanoPositions,
    pageStructure,
    scriptSources,
    scriptPerformanceUrls: Array.from(new Set(performanceUrls))
      .filter((url) => /\.(?:m?js)(?:[?#]|$)/i.test(url))
      .map((url) => safeUrl(url))
      .sort(),
    responseCount: deduplicated.length,
    venueResponseCount: venueResponses.length,
    responses: venueResponses,
    afterSearchResponseCount: afterSearchResponses.length,
    afterSearchResponses,
    performanceUrls: Array.from(new Set(performanceUrls))
      .filter((url) => isVenueRelatedUrl(url))
      .map((url) => safeUrl(url))
      .sort(),
  };
  const serializedAudit = `${JSON.stringify(audit, null, 2)}\n`;
  if (outputPath) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, serializedAudit, 'utf8');
    console.log(JSON.stringify({
      outputPath,
      responseCount: audit.responseCount,
      venueResponseCount: audit.venueResponseCount,
      selectedPanoConfigUrl,
      selectedPanoId,
      publicationEligible: false,
    }, null, 2));
  } else {
    process.stdout.write(serializedAudit);
  }
} finally {
  await browser.close();
}
