/**
 * Visual check for an NFL field's axis: fetch the USGS NAIP aerial photo
 * (north-up Web Mercator, which keeps angles true) and draw the axis as a red
 * line through the field's center. If the line runs along the sidelines,
 * the axis is right; if it cuts across the yard lines, it is not.
 *
 * Where the turf is visible it also measures the axis on its own: the
 * principal axis of the green pixels within 70 m of the center (a field is
 * 110 x 49 m), drawn in cyan. Covered fields and green seats defeat this,
 * so read it next to the picture.
 *
 *   npx tsx scripts/checkNflOrientationImagery.ts <venueId> <axisDeg> <lat> <lon> [halfWidthMeters]
 *
 * Writes tmp/nfl-orientation/<venueId>-check.png (git-ignored).
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

const NAIP = 'https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage';
const CACHE = path.resolve(__dirname, '../tmp/nfl-orientation');
const EARTH_RADIUS = 6378137;
let HALF_WIDTH_METERS = 130;
const SIZE_PX = 520;

async function fetchImage(id: string, lat: number, lon: number): Promise<string> {
  mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, `${id}-${lat.toFixed(5)}-${lon.toFixed(5)}-${HALF_WIDTH_METERS}.png`);
  if (existsSync(file)) return file;
  const x = (lon * Math.PI / 180) * EARTH_RADIUS;
  const y = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2)) * EARTH_RADIUS;
  const half = HALF_WIDTH_METERS / Math.cos(lat * Math.PI / 180);
  const bbox = [x - half, y - half, x + half, y + half].map((v) => v.toFixed(2)).join(',');
  const url = `${NAIP}?bbox=${bbox}&bboxSR=3857&imageSR=3857&size=${SIZE_PX},${SIZE_PX}&format=png&f=image`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url);
    if (res.ok) { writeFileSync(file, Buffer.from(await res.arrayBuffer())); return file; }
    if (attempt === 4) throw new Error(`NAIP request failed: ${res.status}`);
    await new Promise((resolve) => setTimeout(resolve, 4000 * attempt));
  }
}

/** Principal axis of green pixels within 70 m of the image center. */
async function turfAxis(file: string): Promise<{ bearing: number; pixels: number; elongation: number } | null> {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const metersPerPx = (2 * HALF_WIDTH_METERS) / SIZE_PX;
  const r = 70 / metersPerPx;
  const c = SIZE_PX / 2;
  let n = 0; let sx = 0; let sy = 0; let sxx = 0; let syy = 0; let sxy = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const ex = x - c;
      const ny = c - y; // north up
      if (ex * ex + ny * ny > r * r) continue;
      const i = (y * info.width + x) * info.channels;
      const [red, green, blue] = [data[i], data[i + 1], data[i + 2]];
      if (!(green > red + 10 && green > blue + 5)) continue;
      n++; sx += ex; sy += ny; sxx += ex * ex; syy += ny * ny; sxy += ex * ny;
    }
  }
  if (n < 4000) return null;
  const mx = sx / n; const my = sy / n;
  const cxx = sxx / n - mx * mx; const cyy = syy / n - my * my; const cxy = sxy / n - mx * my;
  // Major eigenvector of the 2x2 covariance, as an angle from east
  // (counterclockwise), then converted to a compass bearing.
  const theta = 0.5 * Math.atan2(2 * cxy, cxx - cyy);
  const tr = cxx + cyy; const det = cxx * cyy - cxy * cxy;
  const l1 = tr / 2 + Math.sqrt(tr * tr / 4 - det); const l2 = tr / 2 - Math.sqrt(tr * tr / 4 - det);
  const bearing = (((90 - (theta * 180) / Math.PI) % 180) + 180) % 180;
  return { bearing, pixels: n, elongation: Math.sqrt(l1 / Math.max(l2, 1e-9)) };
}

async function main() {
  const [id, axisArg, latArg, lonArg, halfArg] = process.argv.slice(2);
  if (halfArg) HALF_WIDTH_METERS = Number(halfArg);
  const axis = Number(axisArg);
  const lat = Number(latArg);
  const lon = Number(lonArg);
  if (!id || [axis, lat, lon].some((n) => !Number.isFinite(n))) {
    throw new Error('usage: checkNflOrientationImagery.ts <venueId> <axisDeg> <lat> <lon>');
  }
  const image = await fetchImage(id, lat, lon);
  const c = SIZE_PX / 2;
  const turf = await turfAxis(image);
  if (turf) console.log(`turf axis ${turf.bearing.toFixed(1)}° from ${turf.pixels} green px (elongation ${turf.elongation.toFixed(2)})`);
  else console.log('turf axis: not enough visible turf');
  const reach = SIZE_PX * 0.48;
  const dx = Math.sin(axis * Math.PI / 180) * reach;
  const dy = -Math.cos(axis * Math.PI / 180) * reach;
  const overlay = Buffer.from(
    `<svg width="${SIZE_PX}" height="${SIZE_PX}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${c - dx}" y1="${c - dy}" x2="${c + dx}" y2="${c + dy}" stroke="red" stroke-width="2"/>
      ${turf ? `<line x1="${c - Math.sin(turf.bearing * Math.PI / 180) * reach * 0.6}" y1="${c + Math.cos(turf.bearing * Math.PI / 180) * reach * 0.6}" x2="${c + Math.sin(turf.bearing * Math.PI / 180) * reach * 0.6}" y2="${c - Math.cos(turf.bearing * Math.PI / 180) * reach * 0.6}" stroke="cyan" stroke-width="2" stroke-dasharray="6 4"/>` : ''}
      <text x="8" y="20" fill="yellow" font-size="16" font-family="sans-serif">${id} axis ${axis}° (north up)</text>
    </svg>`,
  );
  const out = path.join(CACHE, `${id}-check.png`);
  await sharp(image).composite([{ input: overlay }]).png().toFile(out);
  console.log(out);
}

main().catch((err) => { console.error(err); process.exit(1); });
