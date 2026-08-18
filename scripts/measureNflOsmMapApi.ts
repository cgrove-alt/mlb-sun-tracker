/**
 * Fetch a small OSM map extract around each unique NFL stadium and
 * PCA the american_football pitch polygons. Uses the main OSM API
 * (not Overpass) so we are not fighting the public Overpass limiter.
 *
 * Usage: npx tsx scripts/measureNflOsmMapApi.ts
 */
import { writeFileSync } from 'fs';
import { NFL_STADIUMS } from '../src/data/nflStadiums';

const uniqueParks = NFL_STADIUMS.filter(
  (s, i, arr) => arr.findIndex((o) => o.latitude === s.latitude && o.longitude === s.longitude) === i,
);

function toRad(d: number): number {
  return (d * Math.PI) / 180;
}
function toDeg(r: number): number {
  return (r * 180) / Math.PI;
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

function parseOsmXml(xml: string): { nodes: Map<string, { lat: number; lon: number }>; ways: { id: string; nd: string[]; tags: Record<string, string> }[] } {
  const nodes = new Map<string, { lat: number; lon: number }>();
  const nodeRe = /<node id="(\d+)"[^>]*lat="([^"]+)"[^>]*lon="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = nodeRe.exec(xml))) {
    nodes.set(m[1], { lat: Number(m[2]), lon: Number(m[3]) });
  }
  const ways: { id: string; nd: string[]; tags: Record<string, string> }[] = [];
  const wayRe = /<way id="(\d+)"[\s\S]*?<\/way>/g;
  let w: RegExpExecArray | null;
  while ((w = wayRe.exec(xml))) {
    const body = w[0];
    const nd = [...body.matchAll(/<nd ref="(\d+)"/g)].map((x) => x[1]);
    const tags: Record<string, string> = {};
    for (const t of body.matchAll(/<tag k="([^"]+)" v="([^"]+)"/g)) {
      tags[t[1]] = t[2];
    }
    ways.push({ id: w[1], nd, tags });
  }
  return { nodes, ways };
}

function isFootball(tags: Record<string, string>): boolean {
  const sport = (tags.sport ?? '').toLowerCase();
  const name = (tags.name ?? '').toLowerCase();
  if (sport.includes('soccer') || sport.includes('baseball')) return false;
  return (
    sport.includes('american_football')
    || sport.includes('american football')
    || name.includes('football field')
    || (tags.leisure === 'pitch' && sport.includes('football') && !sport.includes('soccer'))
  );
}

async function fetchMap(lat: number, lon: number): Promise<string> {
  const d = 0.0035; // ~350–400 m
  const bbox = `${lon - d},${lat - d},${lon + d},${lat + d}`;
  const url = `https://api.openstreetmap.org/api/0.6/map?bbox=${bbox}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'theshadium-nfl-orientation-audit/1.0' } });
  if (!res.ok) throw new Error(`OSM map ${res.status} ${res.statusText}`);
  return res.text();
}

async function main() {
  const results = [];
  for (const stadium of uniqueParks) {
    process.stderr.write(`OSM map ${stadium.id}...\n`);
    try {
      const xml = await fetchMap(stadium.latitude, stadium.longitude);
      const { nodes, ways } = parseOsmXml(xml);
      const footballWays = ways.filter((w) => isFootball(w.tags));
      const scored = footballWays
        .map((w) => {
          const pts = w.nd
            .map((id) => nodes.get(id))
            .filter((n): n is { lat: number; lon: number } => !!n)
            .map((n) => {
              const rLat = 111320;
              const rLon = 111320 * Math.cos(toRad(stadium.latitude));
              return {
                x: (n.lon - stadium.longitude) * rLon,
                y: (n.lat - stadium.latitude) * rLat,
              };
            });
          const axis = pcaAxis(pts);
          if (!axis) return null;
          return { wayId: w.id, tags: w.tags, ...axis, n: pts.length };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .sort((a, b) => b.aspect - a.aspect);

      const best = scored[0] ?? null;
      results.push({
        id: stadium.id,
        recorded: stadium.orientation,
        osm: best
          ? {
              wayId: best.wayId,
              bearing180: Math.round(best.bearing * 10) / 10,
              aspect: Math.round(best.aspect * 100) / 100,
              n: best.n,
              sport: best.tags.sport ?? '',
              name: best.tags.name ?? '',
              delta: Math.round(angularDistance180(best.bearing, stadium.orientation) * 10) / 10,
            }
          : null,
        nFootballWays: footballWays.length,
      });
      const b = best;
      console.log(
        `${stadium.id.padEnd(28)} rec=${String(stadium.orientation).padStart(3)} `
        + (b
          ? `osm=${best.bearing.toFixed(1).padStart(5)} asp=${best.aspect.toFixed(2)} way=${best.wayId}`
          : `no-football-pitch (ways=${ways.length})`),
      );
    } catch (err) {
      console.error(`FAIL ${stadium.id}:`, err);
      results.push({ id: stadium.id, error: String(err) });
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
  writeFileSync('/tmp/nfl-osm-map-axes.json', JSON.stringify(results, null, 2));
  console.error(`Wrote /tmp/nfl-osm-map-axes.json (${results.length} parks)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
