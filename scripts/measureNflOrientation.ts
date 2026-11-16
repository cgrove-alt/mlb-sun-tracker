/**
 * Measure each NFL field's long axis (end zone to end zone) from the pitch
 * outline mapped in OpenStreetMap, and compare it with the recorded value.
 *
 *   npx tsx scripts/measureNflOrientation.ts
 *
 * Method:
 *   1. Overpass query for leisure=pitch ways and multipolygons within 600 m
 *      of the venue.
 *   2. Keep football-sized outlines (a field with its surround is about
 *      100–140 m by 45–95 m), nearest the venue first. Stadiums often have a
 *      practice field next door, so every candidate is printed for review,
 *      and each answer is checked against aerial imagery
 *      (scripts/checkNflOrientationImagery.ts).
 *   3. Project the outline to local meters and take the long side of its
 *      minimum-area bounding rectangle. A field is symmetric end to end, so
 *      the axis is reported in [0, 180).
 *
 * Results are cached in tmp/nfl-orientation/ (git-ignored).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { ALL_UNIFIED_VENUES } from '../src/data/unifiedVenues';

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const CACHE = path.resolve(__dirname, '../tmp/nfl-orientation');

interface Way { id: number; type: 'way' | 'relation'; tags?: Record<string, string>; geometry: { lat: number; lon: number }[] }
interface RawElement { id: number; type: 'way' | 'relation'; tags?: Record<string, string>; geometry?: { lat: number; lon: number }[]; members?: { role: string; geometry?: { lat: number; lon: number }[] }[] }

async function pitchesNear(key: string, lat: number, lon: number): Promise<Way[]> {
  mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, `${key}.json`);
  if (!existsSync(file)) {
    const query = `[out:json][timeout:50];wr["leisure"="pitch"](around:600,${lat},${lon});out geom tags;`;
    // The public Overpass server sheds load with 429/502/504; wait and retry.
    for (let attempt = 1; ; attempt++) {
      const res = await fetch(OVERPASS, {
        method: 'POST',
        headers: { 'User-Agent': 'stadium-orientation-check/1.0', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (res.ok) { writeFileSync(file, await res.text()); break; }
      if (attempt === 5) throw new Error(`Overpass ${res.status} for ${key}`);
      await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  const elements = JSON.parse(readFileSync(file, 'utf-8')).elements as RawElement[];
  return elements
    .map((e): Way => ({
      id: e.id,
      type: e.type,
      tags: e.tags,
      geometry: e.geometry ?? (e.members ?? []).filter((m) => m.role === 'outer').flatMap((m) => m.geometry ?? []),
    }))
    .filter((w) => w.geometry.length >= 4);
}

type Pt = [number, number];

function toMeters(points: { lat: number; lon: number }[], lat0: number, lon0: number): Pt[] {
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180);
  return points.map((p) => [(p.lon - lon0) * kx, (p.lat - lat0) * 110540]);
}

function convexHull(points: Pt[]): Pt[] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: Pt[]) => {
    const out: Pt[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  return [...half(pts), ...half([...pts].reverse())];
}

/** Long-axis bearing (degrees from north, [0, 180)) and size of the minimum-area rectangle. */
export function longAxis(points: Pt[]): { bearing: number; length: number; width: number } {
  const hull = convexHull(points);
  let best = { area: Infinity, bearing: 0, length: 0, width: 0 };
  for (let i = 0; i < hull.length; i++) {
    const [ax, ay] = hull[i];
    const [bx, by] = hull[(i + 1) % hull.length];
    const theta = Math.atan2(by - ay, bx - ax);
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    let minU = Infinity; let maxU = -Infinity; let minV = Infinity; let maxV = -Infinity;
    for (const [x, y] of hull) {
      const u = x * c + y * s;
      const v = -x * s + y * c;
      minU = Math.min(minU, u); maxU = Math.max(maxU, u);
      minV = Math.min(minV, v); maxV = Math.max(maxV, v);
    }
    const along = maxU - minU;
    const across = maxV - minV;
    if (along * across < best.area) {
      // Direction of the long side, as a compass bearing.
      const longTheta = along >= across ? theta : theta + Math.PI / 2;
      const bearing = ((90 - (longTheta * 180) / Math.PI) % 180 + 180) % 180;
      best = { area: along * across, bearing, length: Math.max(along, across), width: Math.min(along, across) };
    }
  }
  return { bearing: best.bearing, length: best.length, width: best.width };
}

/** Smallest difference between two axes (mod 180). */
export const axisDifference = (a: number, b: number) => {
  const d = Math.abs(((a - b) % 180 + 180) % 180);
  return Math.min(d, 180 - d);
};

async function main() {
  const venues = ALL_UNIFIED_VENUES.filter((v) => v.league === 'NFL');
  const seen = new Map<string, string>();
  console.log('venue | recorded | measured | diff | OSM way | size (m) | from venue (m) | roof');
  for (const venue of venues) {
    const key = `${venue.latitude.toFixed(4)},${venue.longitude.toFixed(4)}`;
    if (seen.has(key)) { console.log(`${venue.id} | same field as ${seen.get(key)}`); continue; }
    seen.set(key, venue.id);
    const ways = await pitchesNear(venue.id, venue.latitude, venue.longitude);
    const candidates = ways.map((way) => {
      const pts = toMeters(way.geometry, venue.latitude, venue.longitude);
      const cx = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
      const cy = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
      const center = `${(venue.latitude + cy / 110540).toFixed(5)},${(venue.longitude + cx / (111320 * Math.cos((venue.latitude * Math.PI) / 180))).toFixed(5)}`;
      return { way, axis: longAxis(pts), distance: Math.hypot(cx, cy), center };
    })
      .filter((c) => c.axis.length >= 100 && c.axis.length <= 140 && c.axis.width >= 45 && c.axis.width <= 95)
      .sort((a, b) => a.distance - b.distance);
    if (!candidates.length) { console.log(`${venue.id} | ${venue.orientation} | NO FOOTBALL-SIZED PITCH MAPPED | ${venue.roof}`); continue; }
    candidates.slice(0, 3).forEach((c, i) => {
      console.log([
        i === 0 ? venue.id : '   alt', venue.orientation, c.axis.bearing.toFixed(1), axisDifference(venue.orientation, c.axis.bearing).toFixed(1),
        `${c.way.type}/${c.way.id}`, `${c.axis.length.toFixed(0)}x${c.axis.width.toFixed(0)}`, c.distance.toFixed(0), venue.roof,
        c.way.tags?.sport ?? '', c.way.tags?.name ?? '', `@${c.center}`,
      ].join(' | '));
    });
  }
}

if (require.main === module) main().catch((err) => { console.error(err); process.exit(1); });
