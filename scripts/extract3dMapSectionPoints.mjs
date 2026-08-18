#!/usr/bin/env node

/**
 * Read a public 3D Digital Venue map linked from an MLB club's official seat
 * map page and emit compact TypeScript polygon-centre data to stdout.
 *
 * Usage:
 *   node scripts/extract3dMapSectionPoints.mjs <exportName> <mapUrl>
 *
 * The script is intentionally read-only. It records the selectable SVG
 * polygon bounds supplied by the chart; callers review and check in the output.
 */

import { chromium } from 'playwright';

const [exportName, mapUrl] = process.argv.slice(2);
if (!exportName || !mapUrl) {
  console.error('Usage: node scripts/extract3dMapSectionPoints.mjs <exportName> <mapUrl>');
  process.exit(2);
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();

let finish;
let settled = false;
const svgFound = new Promise((resolve) => { finish = resolve; });
let svgMarkup = null;
let translations = {};
let searchManifest = {};

page.on('response', async (response) => {
  if (settled) return;
  const responseUrl = response.url();
  try {
    if (responseUrl.includes('mainlayer.svg') && !svgMarkup) {
      svgMarkup = await response.text();
      finish(true);
    } else if (responseUrl.includes('translation.json')) {
      translations = await response.json();
    } else if (responseUrl.includes('advanced_search.json')) {
      searchManifest = await response.json();
    }
  } catch (error) {
    // Some legacy map hosts abort duplicate responses as the page settles.
    if (!settled) console.error(`Ignoring unreadable map response: ${error.message}`);
  }
});

await page.goto(mapUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
const found = await Promise.race([
  svgFound,
  page.waitForTimeout(30_000).then(() => false),
]);

if (!found || !svgMarkup) {
  settled = true;
  await browser.close();
  console.error(`No mainlayer.svg response observed for ${mapUrl}`);
  process.exit(1);
}

// Give optional official label and row manifests time to settle after the SVG.
await page.waitForTimeout(1_500);
const points = await page.evaluate((markup) => {
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
    host.innerHTML = markup;
    document.body.appendChild(host);
    const byId = new Map();
    for (const element of host.querySelectorAll('[id^="S_"]')) {
      const bounds = element.getBBox();
      const point = [
        element.id.slice(2),
        Math.round((bounds.x + bounds.width / 2) * 10) / 10,
        Math.round((bounds.y + bounds.height / 2) * 10) / 10,
        Math.round(bounds.width * 10) / 10,
        Math.round(bounds.height * 10) / 10,
      ];
      const existing = byId.get(point[0]);
      // Some responsive maps contain both desktop and mobile copies. Preserve
      // one public footprint per selectable product, preferring the copy with
      // the larger coordinate-space area for better angular precision.
      if (!existing || point[3] * point[4] > existing[3] * existing[4]) {
        byId.set(point[0], point);
      }
    }
    const result = Array.from(byId.values());
    host.remove();
    return result;
}, svgMarkup);

console.log("import type { ChartSectionPoint } from '../parkSectionBuilder';");
console.log('');
console.log(`export const ${exportName}: readonly ChartSectionPoint[] = [`);
for (const [id, x, y, width, height] of points) {
  const key = `S_${id}`;
  const officialLabel = translations[key];
  const namePrefix = `${id} - `;
  const name = typeof officialLabel === 'string'
    ? (officialLabel.startsWith(namePrefix) ? officialLabel.slice(namePrefix.length) : officialLabel)
    : undefined;
  const sectionSearch = searchManifest[key];
  const rows = sectionSearch && typeof sectionSearch === 'object'
    ? sectionSearch[key] ?? Object.values(sectionSearch)[0]
    : undefined;
  const seatRows = rows && typeof rows === 'object'
    ? Object.values(rows).filter(Array.isArray)
    : [];
  const rowCount = seatRows.length || undefined;
  const seatsPerRow = seatRows.length
    ? Math.max(...seatRows.map((seats) => seats.length))
    : undefined;
  const optional = [
    name ? `name: ${JSON.stringify(name)}` : null,
    rowCount ? `rowCount: ${rowCount}` : null,
    seatsPerRow ? `seatsPerRow: ${seatsPerRow}` : null,
  ].filter(Boolean).join(', ');
  const suffix = optional ? `, ${optional}` : '';
  console.log(`  { id: ${JSON.stringify(id)}, x: ${x}, y: ${y}, width: ${width}, height: ${height}${suffix} },`);
}
console.log('];');

settled = true;
await browser.close();
