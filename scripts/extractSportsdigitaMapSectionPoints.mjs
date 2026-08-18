#!/usr/bin/env node

/**
 * Read Sportsdigita SVG section paths from a club-linked seat viewer and emit
 * compact TypeScript polygon bounds. Sportsdigita's JSON is JSON5 (comments
 * and trailing commas are present), so it must not be parsed as strict JSON.
 *
 * Usage:
 *   node scripts/extractSportsdigitaMapSectionPoints.mjs <exportName> <url> [url...]
 */

import JSON5 from 'json5';
import { chromium } from 'playwright';

const [exportName, ...urls] = process.argv.slice(2);
if (!exportName || !urls.length) {
  console.error('Usage: node scripts/extractSportsdigitaMapSectionPoints.mjs <exportName> <url> [url...]');
  process.exit(2);
}

const sectionPaths = new Map();
for (const url of urls) {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Unable to read ${url}: ${response.status} ${response.statusText}`);
    process.exit(1);
  }
  const data = JSON5.parse(await response.text());
  const sourceLayer = url.match(/\/([^/]+)\.json(?:\?|$)/)?.[1];
  if (!['seats', 'suites', 'clubs'].includes(sourceLayer)) {
    console.error(`Unrecognized Sportsdigita product layer in ${url}`);
    process.exit(1);
  }
  for (const [displayName, section] of Object.entries(data.sections ?? {})) {
    const id = String(section.id ?? displayName);
    const paths = (section.subsections ?? [])
      .map((subsectionId) => data.subsections?.[subsectionId]?.path)
      .filter((path) => typeof path === 'string' && path.length > 0);
    if (!paths.length) continue;
    const current = sectionPaths.get(id) ?? { id, name: displayName, sourceLayer, paths: [] };
    if (current.sourceLayer !== sourceLayer) {
      console.error(`Section ${id} occurs in both ${current.sourceLayer} and ${sourceLayer}`);
      process.exit(1);
    }
    current.paths.push(...paths);
    sectionPaths.set(id, current);
  }
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body></body></html>');
const bounds = await page.evaluate((sections) => {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('width', '1024');
  svg.setAttribute('height', '1024');
  document.body.appendChild(svg);

  return sections.map((section) => {
    const boxes = section.paths.map((pathData) => {
      const path = document.createElementNS(namespace, 'path');
      path.setAttribute('d', pathData);
      svg.appendChild(path);
      const box = path.getBBox();
      path.remove();
      return { minX: box.x, maxX: box.x + box.width, minY: box.y, maxY: box.y + box.height };
    });
    const minX = Math.min(...boxes.map((box) => box.minX));
    const maxX = Math.max(...boxes.map((box) => box.maxX));
    const minY = Math.min(...boxes.map((box) => box.minY));
    const maxY = Math.max(...boxes.map((box) => box.maxY));
    return {
      id: section.id,
      name: section.name,
      sourceLayer: section.sourceLayer,
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY,
    };
  });
}, Array.from(sectionPaths.values()));
await browser.close();

const round = (value) => Math.round(value * 10) / 10;
console.log("import type { ChartSectionPoint } from '../parkSectionBuilder';");
console.log('');
console.log(`export const ${exportName}: readonly ChartSectionPoint[] = [`);
for (const point of bounds) {
  console.log(`  { id: ${JSON.stringify(point.id)}, x: ${round(point.x)}, y: ${round(point.y)}, width: ${round(point.width)}, height: ${round(point.height)}, name: ${JSON.stringify(point.name)}, sourceLayer: ${JSON.stringify(point.sourceLayer)} },`);
}
console.log('];');
