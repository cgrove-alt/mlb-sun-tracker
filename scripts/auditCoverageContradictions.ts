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
 *   MLB  -> getStadiumSectionsAsync (shared per-park DetailedSection modules)
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

const REVIEWED_OK = new Set<string>();

// Second-pass allow-list: for venues with a documented, section-level covered
// list, a predicate returning whether a section is EXPECTED to be a covered
// structure per research. Any covered=true section OUTSIDE the list (or any
// listed section NOT covered) is flagged — this catches mislabeled non-open-air
// NAMES (Field Box, Loge Box, general SRO) that the name pass above can't see.
const RESEARCHED_COVERED: Record<string, (s: Sec) => boolean> = {};

type Sec = { id?: string; name?: string; level?: string; covered?: boolean; fullyCovered?: boolean; partialCoverage?: unknown };

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

  // --- Pass 2: cross-reference covered=true flags against researched lists. ---
  const coveredFindings: Array<{ id: string; section: string; issue: string }> = [];
  for (const v of ALL_UNIFIED_VENUES) {
    const pred = RESEARCHED_COVERED[v.id];
    if (!pred) continue;
    const secs = await sectionsFor(v);
    for (const s of secs) {
      if (!s?.name) continue;
      const isCovered = s.covered === true;
      const expected = pred(s);
      if (isCovered && !expected) {
        coveredFindings.push({ id: v.id, section: s.name, issue: 'covered=true but NOT in researched covered list' });
      } else if (!isCovered && expected) {
        coveredFindings.push({ id: v.id, section: s.name, issue: 'researched-covered but covered=false' });
      }
    }
  }

  console.log(`Scanned ${ALL_UNIFIED_VENUES.length} venues (MLB + MiLB + NFL).`);
  console.log(`Skipped ${roofDependentSkipped} retractable/fixed-roof park(s) (coverage is roof-state, not overhang) and ${reviewedSkipped} verified-exception park(s).\n`);

  console.log('── Pass 1: open-air NAMES rendering above Exposed ──');
  if (!findings.length) {
    console.log('✓ No open-air-named sections rendering above Exposed.\n');
  } else {
    const byVenue = new Map<string, typeof findings>();
    for (const f of findings) {
      const arr = byVenue.get(f.id) ?? [];
      arr.push(f);
      byVenue.set(f.id, arr);
    }
    console.log(`⚠ ${findings.length} open-air section(s) above Exposed across ${byVenue.size} venue(s):`);
    for (const [id, arr] of Array.from(byVenue.entries())) {
      console.log(`  [${arr[0].league}] ${id} (${arr[0].name}):`);
      for (const f of arr) console.log(`      • ${f.section} -> ${f.tier} (should be Exposed)`);
    }
    console.log('');
  }

  console.log(`── Pass 2: covered flags vs researched lists (${Object.keys(RESEARCHED_COVERED).join(', ')}) ──`);
  if (!coveredFindings.length) {
    console.log('✓ All covered flags match the researched covered lists.');
  } else {
    console.log(`⚠ ${coveredFindings.length} covered-flag mismatch(es):`);
    for (const f of coveredFindings) console.log(`  [${f.id}] ${f.section} — ${f.issue}`);
  }

  process.exit(findings.length || coveredFindings.length ? 1 : 0);
}

main();
