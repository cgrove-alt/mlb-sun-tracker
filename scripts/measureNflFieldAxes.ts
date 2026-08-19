/**
 * Measure NFL field long-axis bearings from OpenStreetMap pitch polygons.
 *
 * One Overpass query for every unique NFL coordinate, then PCA on the
 * most elongated american_football pitch near each park.
 *
 * Usage: npx tsx scripts/measureNflFieldAxes.ts
 */
import { writeFileSync } from 'fs';
import { NFL_STADIUMS } from '../src/data/nflStadiums';

interface OsmWay {
  id: number;
  tags?: Record<string, string>;
  geometry?: { lat: number; lon: number }[];
}

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

function toRad(d: number): number {
  return (d * Math.PI) / 180;
}

function toDeg(r: number): number {
  return (r * 180) / Math.PI;
}

function toLocalMeters(
  lat: number,
  lon: number,
  originLat: number,
  originLon: number,
): { x: number; y: number } {
  const rLat = 111320;
  const rLon = 111320 * Math.cos(toRad(originLat));
  return {
    x: (lon - originLon) * rLon,
    y: (lat - originLat) * rLat,
  };
}

function normalize180(deg: number): number {
  return ((deg % 180) + 180) % 180;
}

function normalize360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function angularDistance180(a: number, b: number): number {
  const d = Math.abs(normalize180(a) - normalize180(b));
  return Math.min(d, 180 - d);
}

function pcaAxis(points: { x: number; y: number }[]): { bearing: number; aspect: number } | null {
  if (points.length < 4) return null;
  const n = points.length;
  const mx = points.reduce((s, p) => s + p.x, 0) / n;
  const my = points.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const p of points) {
    const dx = p.x - mx;
    const dy = p.y - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  sxx /= n;
  syy /= n;
  sxy /= n;
  const trace = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.max(0, (trace * trace) / 4 - det);
  const l1 = trace / 2 + Math.sqrt(disc);
  const l2 = trace / 2 - Math.sqrt(disc);
  if (l1 <= 0) return null;
  let vx: number;
  let vy: number;
  if (Math.abs(sxy) > 1e-9) {
    vx = l1 - syy;
    vy = sxy;
  } else if (sxx >= syy) {
    vx = 1;
    vy = 0;
  } else {
    vx = 0;
    vy = 1;
  }
  const bearing = normalize360(toDeg(Math.atan2(vx, vy)));
  const aspect = l2 > 0 ? Math.sqrt(l1 / l2) : Infinity;
  return { bearing: normalize180(bearing), aspect };
}

const uniqueParks = NFL_STADIUMS.filter(
  (s, i, arr) => arr.findIndex((o) => o.latitude === s.latitude && o.longitude === s.longitude) === i,
);

function buildQuery(radiusM: number): string {
  const around = uniqueParks
    .map((s) => `  way["leisure"="pitch"](around:${radiusM},${s.latitude},${s.longitude});`)
    .join('\n');
  return `
[out:json][timeout:90];
(
${around}
);
out geom;
`.trim();
}

async function overpass(query: string): Promise<OsmWay[]> {
  let lastErr: unknown;
  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (!res.ok) {
        lastErr = new Error(`Overpass ${res.status} ${res.statusText} from ${url}`);
        continue;
      }
      const json = await res.json() as { elements?: OsmWay[] };
      return json.elements ?? [];
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

function isFootballPitch(way: OsmWay): boolean {
  const sport = (way.tags?.sport ?? '').toLowerCase();
  const name = (way.tags?.name ?? '').toLowerCase();
  if (sport.includes('soccer') || sport.includes('baseball') || sport.includes('tennis')) return false;
  if (sport.includes('american_football') || sport.includes('american football')) return true;
  if (sport === 'football' && !name.includes('soccer')) return true;
  if (name.includes('football field') || name.includes('nfl') || name.includes('end zone')) return true;
  return sport === '' && (way.tags?.leisure === 'pitch');
}

function haversineM(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371000;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const s =
    Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function wayCentroid(way: OsmWay): { lat: number; lon: number } | null {
  const g = way.geometry;
  if (!g || g.length === 0) return null;
  return {
    lat: g.reduce((s, p) => s + p.lat, 0) / g.length,
    lon: g.reduce((s, p) => s + p.lon, 0) / g.length,
  };
}

async function main() {
  process.stderr.write(`Querying Overpass for ${uniqueParks.length} unique NFL sites...\n`);
  const ways = await overpass(buildQuery(600));
  process.stderr.write(`Got ${ways.length} pitch ways.\n`);

  const results = uniqueParks.map((stadium) => {
    const nearby = ways
      .map((way) => {
        const c = wayCentroid(way);
        if (!c) return null;
        const distM = haversineM(stadium.latitude, stadium.longitude, c.lat, c.lon);
        if (distM > 700) return null;
        const pts = (way.geometry ?? []).map((g) =>
          toLocalMeters(g.lat, g.lon, stadium.latitude, stadium.longitude),
        );
        const axis = pcaAxis(pts);
        if (!axis) return null;
        return {
          wayId: way.id,
          tags: way.tags,
          football: isFootballPitch(way),
          bearing180: axis.bearing,
          aspect: axis.aspect,
          distM,
          n: pts.length,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => {
        const rank = (s: typeof a) =>
          (s.football ? 0 : 20) + (s.aspect >= 1.5 ? 0 : 8) + s.distM / 80 - Math.min(s.aspect, 4);
        return rank(a) - rank(b);
      });

    const best = nearby[0] ?? null;
    return {
      id: stadium.id,
      name: stadium.name,
      lat: stadium.latitude,
      lon: stadium.longitude,
      recorded: stadium.orientation,
      recordedAxis: Math.round(normalize180(stadium.orientation) * 10) / 10,
      best: best
        ? {
            wayId: best.wayId,
            sport: best.tags?.sport ?? '',
            name: best.tags?.name ?? '',
            football: best.football,
            bearing180: Math.round(best.bearing180 * 10) / 10,
            aspect: Math.round(best.aspect * 100) / 100,
            distM: Math.round(best.distM),
            n: best.n,
            delta: Math.round(angularDistance180(best.bearing180, stadium.orientation) * 10) / 10,
          }
        : null,
      candidates: nearby.slice(0, 4).map((s) => ({
        wayId: s.wayId,
        sport: s.tags?.sport ?? '',
        football: s.football,
        bearing180: Math.round(s.bearing180 * 10) / 10,
        aspect: Math.round(s.aspect * 100) / 100,
        distM: Math.round(s.distM),
      })),
    };
  });

  writeFileSync('/tmp/nfl-osm-axes.json', JSON.stringify(results, null, 2));
  for (const row of results) {
    const b = row.best;
    const mark = !b ? 'NONE' : b.delta > 20 ? 'DIFF' : 'OK  ';
    console.log(
      `${mark} ${row.id.padEnd(28)} rec=${String(row.recorded).padStart(3)} axis=${String(row.recordedAxis).padStart(5)} `
      + (b
        ? `osm=${String(b.bearing180).padStart(5)} Δ=${String(b.delta).padStart(4)} asp=${b.aspect} d=${b.distM}m way=${b.wayId} ${b.sport}`
        : 'no pitch'),
    );
  }
  const hits = results.filter((r) => r.best);
  console.error(`\n${hits.length}/${results.length} parks matched an OSM pitch. Wrote /tmp/nfl-osm-axes.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
