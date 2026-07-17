#!/usr/bin/env tsx
/**
 * Coverage-contradiction audit (audit follow-up, extended).
 *
 * Flags sections whose NAME says open-air / full-sun (bleacher, pavilion, berm,
 * lawn, porch, rooftop, sun deck, outfield reserved) but whose rendered shade
 * TIER is above Exposed (Covered or Partial) — i.e. the shade table would claim
 * shade the seating tips say those seats don't have.
 *
 * Runs across ALL leagues using the SAME section sources the pages render from:
 *   MLB  -> getStadiumSectionsAsync (stadiumSections-split/*)
 *   MiLB -> generateBaseballSections(venue)
 *   NFL  -> getVenueSections(venue.id)
 *
 * Run: npx tsx scripts/auditCoverageContradictions.ts
 */
import { ALL_UNIFIED_VENUES } from '../src/data/unifiedVenues';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { getStadiumSectionsAsync } from '../src/data/getStadiumSections';
import { generateBaseballSections } from '../src/utils/generateBaseballSections';
import { getVenueSections } from '../src/data/venueSections';

const OPEN_AIR = /bleacher|pavilion|berm|lawn|porch|rooftop|sun deck|home run|batter'?s eye|outfield reserved/i;
const INDOOR_OK = /club|suite|lounge|indoor|cafe|café|bar|grill|restaurant/i;

// Retractable/fixed-roof parks are shaded everywhere when the roof is closed, so
// an open-air-NAMED section reading "covered" is roof-state, not a data error.
const ROOF = new Map(MLB_STADIUMS.map((s) => [s.id, s.roof]));

// Verified-correct exceptions on OPEN-roof parks (real overhang, not a bug):
//   redsox — Fenway's Pavilion level sits under the stadium roof; Pavilion Box &
//            First/Third-Base Pavilion SRO rows B+ are genuinely covered
//            (rateyourseats.com/fenway-park). Only the LF Pavilion Reserved is
//            exposed, and that is already covered:false.
const REVIEWED_OK = new Set(['redsox']);

type Sec = { name?: string; level?: string; covered?: boolean; fullyCovered?: boolean; partialCoverage?: unknown };

// Mirror of StadiumPageSSR.shadeTierOf.
function tier(s: Sec): 'covered' | 'partial' | 'exposed' {
  if (s.fullyCovered) return 'covered';
  if (s.partialCoverage) return 'partial';
  if (s.covered) return s.level === 'suite' || s.level === 'club' ? 'covered' : 'partial';
  return 'exposed';
}

async function sectionsFor(v: (typeof ALL_UNIFIED_VENUES)[number]): Promise<Sec[]> {
  try {
    if (v.league === 'MLB') return (await getStadiumSectionsAsync(v.id)) as unknown as Sec[];
    if (v.league === 'MiLB') return generateBaseballSections(v) as unknown as Sec[];
    return getVenueSections(v.id) as unknown as Sec[];
  } catch {
    return [];
  }
}

async function main() {
  const findings: Array<{ id: string; name: string; league: string; section: string; tier: string }> = [];
  let roofDependentSkipped = 0;
  let reviewedSkipped = 0;
  for (const v of ALL_UNIFIED_VENUES) {
    if (v.league === 'MLB' && ROOF.get(v.id) !== 'open') { roofDependentSkipped++; continue; }
    if (REVIEWED_OK.has(v.id)) { reviewedSkipped++; continue; }
    const secs = await sectionsFor(v);
    for (const s of secs) {
      if (!s?.name) continue;
      if (INDOOR_OK.test(s.name)) continue;
      if (!OPEN_AIR.test(s.name)) continue;
      const t = tier(s);
      if (t !== 'exposed') {
        findings.push({ id: v.id, name: v.name, league: v.league, section: s.name, tier: t });
      }
    }
  }

  console.log(`Scanned ${ALL_UNIFIED_VENUES.length} venues (MLB + MiLB + NFL).`);
  console.log(`Skipped ${roofDependentSkipped} retractable/fixed-roof park(s) (coverage is roof-state, not overhang) and ${reviewedSkipped} verified-exception park(s).\n`);
  if (!findings.length) {
    console.log('✓ No open-air sections rendering above Exposed.');
    process.exit(0);
  }
  const byVenue = new Map<string, typeof findings>();
  for (const f of findings) {
    const arr = byVenue.get(f.id) ?? [];
    arr.push(f);
    byVenue.set(f.id, arr);
  }
  console.log(`⚠ ${findings.length} open-air section(s) above Exposed across ${byVenue.size} venue(s):\n`);
  for (const [id, arr] of Array.from(byVenue.entries())) {
    console.log(`  [${arr[0].league}] ${id} (${arr[0].name}):`);
    for (const f of arr) console.log(`      • ${f.section} -> ${f.tier} (should be Exposed)`);
  }
  process.exit(1);
}

main();
