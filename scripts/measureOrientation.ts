/**
 * Re-measure a ballpark's orientation from USGS NAIP imagery and compare it
 * with the value recorded in src/data/orientationMeasurements.ts.
 *
 *   npx tsx scripts/measureOrientation.ts yankees
 *
 * Method (see the header of orientationMeasurements.ts):
 *   1. Fetch a north-up Web Mercator image centered on the park (USGS, or
 *      an older NAIP flight from the Planetary Computer when recorded).
 *   2. Find the home-plate circle and the pitcher's mound as the centroid of
 *      non-grass pixels around each seed point (works for dirt and for tarps).
 *   3. Bearing home → mound.
 *   4. Independent check: the axis through home plate about which the
 *      infield's non-grass pixels are most mirror-symmetric.
 *
 * Images are cached in tmp/orientation/ (git-ignored).
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { ORIENTATION_MEASUREMENTS, type OrientationMeasurement } from '../src/data/orientationMeasurements';

const NAIP = 'https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage';
// Every NAIP flight since 2010, for parks whose newest flight shows a closed roof.
const PLANETARY_COMPUTER = 'https://planetarycomputer.microsoft.com/api/data/v1/item/bbox';
const CACHE = path.resolve(__dirname, '../tmp/orientation');
const EARTH_RADIUS = 6378137;

function mercatorBbox(m: OrientationMeasurement): [number, number, number, number] {
  const { latitude, longitude } = m.imageCenter;
  const x = (longitude * Math.PI / 180) * EARTH_RADIUS;
  const y = Math.log(Math.tan(Math.PI / 4 + (latitude * Math.PI / 180) / 2)) * EARTH_RADIUS;
  const half = m.imageHalfWidthMeters / Math.cos(latitude * Math.PI / 180);
  return [x - half, y - half, x + half, y + half];
}

async function fetchImage(m: OrientationMeasurement): Promise<string> {
  mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, `${m.stadiumId}.png`);
  if (existsSync(file)) return file;
  const bbox = mercatorBbox(m).map((v) => v.toFixed(2)).join(',');
  const size = m.imageSizePx;
  const url = m.planetaryComputerItem
    ? `${PLANETARY_COMPUTER}/${bbox}/${size}x${size}.png?collection=naip&item=${m.planetaryComputerItem}` +
      '&assets=image&asset_bidx=image%7C1%2C2%2C3&coord_crs=epsg:3857&dst_crs=epsg:3857&nodata=0'
    : `${NAIP}?bbox=${bbox}&bboxSR=3857&imageSR=3857&size=${size},${size}&format=png&f=image`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NAIP request failed: ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

const bearing = (from: [number, number], to: [number, number]) =>
  ((Math.atan2(to[0] - from[0], from[1] - to[1]) * 180) / Math.PI + 360) % 360;

async function measure(m: OrientationMeasurement) {
  const file = await fetchImage(m);
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const C = info.channels;
  const metersPerPx = (2 * m.imageHalfWidthMeters) / m.imageSizePx;
  const isGrass = (x: number, y: number) => {
    const i = (y * W + x) * C;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    // Grass is clearly greener than red and blue. Some flights have a blue
    // cast that lifts grass's blue to its green (Oracle Park 2022: 95, 115,
    // 115); those measurements set grassRule 'blue-cast', where blue is
    // only required not to dominate.
    if (m.grassRule === 'blue-cast') return g > r + 8 && g >= b - 10;
    // A fainter cast (Nationals Park 2023: grass 85, 99, 97) next to a
    // bluish mound cover (85, 103, 107): grass only needs more green than blue.
    if (m.grassRule === 'slight-blue-cast') return g > r + 8 && g > b;
    return g > r + 8 && g > b + 8;
  };

  const centroid = (seed: [number, number], radiusMeters: number): [number, number] => {
    const r = Math.round(radiusMeters / metersPerPx);
    let c = seed;
    for (let pass = 0; pass < 8; pass++) {
      let sx = 0;
      let sy = 0;
      let n = 0;
      const [cx, cy] = [Math.round(c[0]), Math.round(c[1])];
      for (let y = cy - r; y <= cy + r; y++) {
        for (let x = cx - r; x <= cx + r; x++) {
          if ((x - cx) ** 2 + (y - cy) ** 2 > r * r || isGrass(x, y)) continue;
          sx += x;
          sy += y;
          n++;
        }
      }
      c = [sx / n, sy / n];
    }
    return c;
  };

  // The mound (9 ft radius) sits in infield grass, so its non-grass centroid
  // is well defined. The home-plate circle often merges with dirt and tarps
  // around it, so home is not refined here; the symmetry search below finds
  // the axis without needing an exact home point.
  const mound = centroid(m.moundSeedPx, 2.7);
  const homeSeed = m.homeSeedPx;
  const seedBearing = bearing(homeSeed, mound);

  // Mirror symmetry of non-grass pixels within 40 m of home: search the
  // axis angle AND its sideways offset, so the answer comes from the whole
  // infield rather than from one hand-placed point.
  const reach = Math.round(40 / metersPerPx);
  const pts: [number, number][] = [];
  const mask = new Set<number>();
  for (let y = Math.round(homeSeed[1]) - reach; y <= Math.round(homeSeed[1]) + reach; y++) {
    for (let x = Math.round(homeSeed[0]) - reach; x <= Math.round(homeSeed[0]) + reach; x++) {
      if ((x - homeSeed[0]) ** 2 + (y - homeSeed[1]) ** 2 <= reach * reach && !isGrass(x, y)) {
        mask.add(y * W + x);
        pts.push([x, y]);
      }
    }
  }
  let best = { angle: seedBearing, offsetPx: 0, hits: -1 };
  const maxOffset = Math.round(3 / metersPerPx);
  for (let a = seedBearing - 8; a <= seedBearing + 8; a += 0.1) {
    const t = (a * Math.PI) / 180;
    const ux = Math.sin(t);
    const uy = -Math.cos(t);
    for (let off = -maxOffset; off <= maxOffset; off += 1) {
      // Axis passes through the seed shifted sideways by `off` pixels.
      const ox = homeSeed[0] - uy * off;
      const oy = homeSeed[1] + ux * off;
      let hits = 0;
      for (const [x, y] of pts) {
        const vx = x - ox;
        const vy = y - oy;
        const d = vx * ux + vy * uy;
        const rx = Math.round(ox + 2 * d * ux - vx);
        const ry = Math.round(oy + 2 * d * uy - vy);
        if (mask.has(ry * W + rx)) hits++;
      }
      if (hits > best.hits) best = { angle: a, offsetPx: off, hits };
    }
  }

  return {
    stadiumId: m.stadiumId,
    moundCenterPx: mound.map((v) => +v.toFixed(2)),
    bearingSeedHomeToMoundDeg: +seedBearing.toFixed(2),
    bearingInfieldSymmetryDeg: +(((best.angle % 360) + 360) % 360).toFixed(1),
    symmetryAxisOffsetMeters: +(best.offsetPx * metersPerPx).toFixed(2),
    symmetryOverlapPct: +((best.hits / mask.size) * 100).toFixed(1),
    recordedOrientationDeg: m.orientationDeg,
  };
}

async function main() {
  const ids = process.argv.slice(2);
  const targets = ids.length
    ? ORIENTATION_MEASUREMENTS.filter((m) => ids.includes(m.stadiumId))
    : ORIENTATION_MEASUREMENTS;
  for (const m of targets) console.log(JSON.stringify(await measure(m)));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
