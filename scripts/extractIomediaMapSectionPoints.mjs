#!/usr/bin/env node

/**
 * Read a public IOMEDIA Virtual Venue image-map layer linked from an MLB
 * club's official site and emit TypeScript section/view coordinates.
 *
 * Usage:
 *   node scripts/extractIomediaMapSectionPoints.mjs <exportName> <mapJsonUrl> [camera]
 *
 * IOMEDIA publishes several representative row/seat hotspots for many
 * sections. Their combined bounds locate the section on the public screen
 * map; they are not surveyed section-boundary polygons.
 */

const [exportName, mapJsonUrl, camera = 'Aerial_Camera_HomePlate'] = process.argv.slice(2);
if (!exportName || !mapJsonUrl) {
  console.error('Usage: node scripts/extractIomediaMapSectionPoints.mjs <exportName> <mapJsonUrl> [camera]');
  process.exit(2);
}

const response = await fetch(mapJsonUrl);
if (!response.ok) {
  console.error(`Unable to read ${mapJsonUrl}: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const mapData = await response.json();
const areaMarkup = mapData[camera]?.areas;
if (typeof areaMarkup !== 'string') {
  console.error(`Camera ${camera} is not present in ${mapJsonUrl}`);
  process.exit(1);
}

const byId = new Map();
for (const [areaTag] of areaMarkup.matchAll(/<area\b[^>]*>/gi)) {
  const coordinates = areaTag.match(/coords=['"]([^'"]+)['"]/i)?.[1];
  const label = areaTag.match(/alt=['"]([^'"]+)['"]/i)?.[1];
  const view = label?.match(/^Sub_Section_(.+)_([^_]+)_([^_]+)$/);
  if (!coordinates || !view) continue;

  const values = coordinates.split(',').map(Number);
  const xs = values.filter((_, index) => index % 2 === 0);
  const ys = values.filter((_, index) => index % 2 === 1);
  if (!xs.length || xs.some(Number.isNaN) || ys.some(Number.isNaN)) continue;

  const id = view[1];
  const bounds = {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
  const current = byId.get(id);
  byId.set(id, current ? {
    minX: Math.min(current.minX, bounds.minX),
    maxX: Math.max(current.maxX, bounds.maxX),
    minY: Math.min(current.minY, bounds.minY),
    maxY: Math.max(current.maxY, bounds.maxY),
  } : bounds);
}

console.log("import type { ChartSectionPoint } from '../parkSectionBuilder';");
console.log('');
console.log(`export const ${exportName}: readonly ChartSectionPoint[] = [`);
for (const [id, bounds] of byId) {
  const x = Math.round(((bounds.minX + bounds.maxX) / 2) * 10) / 10;
  const y = Math.round(((bounds.minY + bounds.maxY) / 2) * 10) / 10;
  const width = Math.round((bounds.maxX - bounds.minX) * 10) / 10;
  const height = Math.round((bounds.maxY - bounds.minY) * 10) / 10;
  console.log(`  { id: ${JSON.stringify(id)}, x: ${x}, y: ${y}, width: ${width}, height: ${height} },`);
}
console.log('];');
