#!/usr/bin/env tsx
/**
 * Coverage-contradiction audit (audit follow-up).
 *
 * Flags sections whose shade-table classification is likely to contradict the
 * physical reality described in the seating tips: open-air, no-overhang areas
 * (bleachers, pavilions, outfield, berm/lawn, rooftop/deck, porch) that are
 * marked covered=true — they should be Exposed, not covered/partial.
 *
 * Run: npx tsx scripts/auditCoverageContradictions.ts
 */
import { MLB_STADIUMS } from '../src/data/stadiums';
import { getStadiumSections } from '../src/data/stadium-data-aggregator';
import type { DetailedSection } from '../src/types/stadium-complete';

// Section-name patterns that are almost always fully open to the sky.
const OPEN_AIR = /bleacher|pavilion|outfield|berm|lawn|rooftop|roof deck|porch|deck\b|patio|standing|sro|terrace bar|budweiser|home run/i;
// Patterns that legitimately ARE covered/indoor even if they match above.
const INDOOR_OK = /club|suite|lounge|indoor|cafe|café|bar & grill|restaurant/i;

const findings: Array<{ id: string; name: string; section: string; level: string }> = [];

for (const stadium of MLB_STADIUMS) {
  let sections: DetailedSection[] = [];
  try {
    sections = getStadiumSections(stadium.id, 'MLB');
  } catch {
    continue;
  }
  for (const s of sections) {
    // suite/club are indoor levels (e.g. Fenway's roofed Pavilion Box) — legit.
    const indoorLevel = s.level === 'suite' || s.level === 'club';
    if (s.covered && OPEN_AIR.test(s.name) && !INDOOR_OK.test(s.name) && !indoorLevel) {
      findings.push({ id: stadium.id, name: stadium.name, section: s.name, level: s.level });
    }
  }
}

console.log(`Scanned ${MLB_STADIUMS.length} MLB stadiums for open-air sections marked covered=true.\n`);
if (!findings.length) {
  console.log('✓ No contradictions found.');
  process.exit(0);
}
const byVenue = new Map<string, typeof findings>();
for (const f of findings) {
  const arr = byVenue.get(f.id) ?? [];
  arr.push(f);
  byVenue.set(f.id, arr);
}
console.log(`⚠ ${findings.length} suspicious section(s) across ${byVenue.size} venue(s):\n`);
for (const [id, arr] of Array.from(byVenue.entries())) {
  console.log(`  ${id} (${arr[0].name}):`);
  for (const f of arr) console.log(`      • ${f.section} [${f.level}] marked covered=true`);
}
console.log('\nThese open-air areas should be covered=false (Exposed).');
process.exit(1);
