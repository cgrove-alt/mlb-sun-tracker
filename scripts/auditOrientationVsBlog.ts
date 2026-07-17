#!/usr/bin/env tsx
/**
 * Orientation cross-check (audit follow-up).
 *
 * For every blog post that maps to a venue, extract any orientation figure in
 * degrees from the post body and compare it to the single source of truth (the
 * venue's `orientation` in the data). Lists mismatches so the prose can't drift
 * from the data (e.g. the Wrigley post said 13° while the data says 30°).
 *
 * Run: npx tsx scripts/auditOrientationVsBlog.ts
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { findVenueForPost } from '../src/utils/venueForPost';
import { getUnifiedVenueById } from '../src/data/unifiedVenues';

const DIR = path.join(__dirname, '../content/blog');
// "13°", "30 degrees", "orientation of 55" (only when near an orientation word)
const DEG = /(\d{1,3})\s*(?:°|degrees?\b)/g;

const TOL = 8; // allow small wording differences

let mismatches = 0;
let checked = 0;

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx'))) {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf-8');
  const { content, data } = matter(raw);
  const slug = file.replace(/\.mdx$/, '');
  const venue = findVenueForPost({ slug, tags: data.tags || [] });
  if (!venue) continue;

  const dataOri = getUnifiedVenueById(venue.id)?.orientation;
  if (dataOri == null) continue;

  // Collect degree figures that appear near an orientation/facing context.
  const figs: number[] = [];
  let m: RegExpExecArray | null;
  DEG.lastIndex = 0;
  while ((m = DEG.exec(content))) {
    const start = Math.max(0, m.index - 60);
    const ctx = content.slice(start, m.index + 20).toLowerCase();
    if (/orient|home plate|center field|faces?|facing|bearing|degrees?/.test(ctx)) {
      figs.push(Number(m[1]));
    }
  }
  if (!figs.length) continue;
  checked++;

  const bad = figs.filter((f) => Math.abs(f - dataOri) > TOL);
  if (bad.length) {
    mismatches++;
    console.log(`✗ ${slug} -> venue ${venue.id}: data=${dataOri}°, blog says ${Array.from(new Set(bad)).map((f) => f + '°').join(', ')}`);
  }
}

console.log(`\nChecked ${checked} posts with an orientation figure; ${mismatches} mismatch(es) (>${TOL}° off data).`);
process.exit(mismatches ? 1 : 0);
