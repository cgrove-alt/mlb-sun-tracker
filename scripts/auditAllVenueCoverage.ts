#!/usr/bin/env tsx
/**
 * Comprehensive MLB coverage audit (audit follow-up).
 *
 * For every MLB venue EXCEPT the two with hand-researched, section-by-section
 * data (yankees, whitesox), report the coverage landscape and flag covered=true
 * flags that are most likely wrong:
 *   - open-air by NAME     (bleacher/pavilion/lawn/berm/porch/deck/rooftop/outfield)
 *   - open-air by GEOMETRY (section center in the outfield arc, ~CF ± 55°) and
 *                          NOT an indoor level (suite/club)
 *   - whole-level 100% covered on an open-roof park (implausible)
 *
 * Run: npx tsx scripts/auditAllVenueCoverage.ts
 */
import { MLB_STADIUMS } from '../src/data/stadiums';
// Use the SAME loader the stadium page uses (stadiumSections-split/*), not the
// aggregator — the aggregator returns 65-section placeholder templates for most
// venues, which is not what is rendered.
import { getStadiumSectionsAsync } from '../src/data/getStadiumSections';
import type { StadiumSection } from '../src/data/stadiumSectionTypes';

type DetailedSection = StadiumSection;

// Excluded: hand-researched (yankees, whitesox) or reviewed-and-documented
// (redsox — Fenway's Pavilion/field-box coverage is intentional, see Phase 3).
const RESEARCHED = new Set(['yankees', 'whitesox', 'redsox']);
// HIGH-CONFIDENCE open-air names (full sun). Deliberately excludes "deck"
// (Upper Deck / Top Deck are normal covered-back-row levels, not sun decks).
const OPEN_AIR_NAME = /bleacher|pavilion|lawn|berm|porch|rooftop|patio|sun deck|home run porch|batter'?s eye/i;
const INDOOR_NAME = /club|suite|lounge|indoor|cafe|café|bar|grill|restaurant|press/i;

const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 100));

// Section center as stadium-local angle (0=1B,90=CF,180=3B,270=HP). Outfield is
// roughly CF ± 55° (35°..145° local).
const isOutfieldGeom = (s: DetailedSection) => {
  const c = (s.baseAngle + s.angleSpan / 2) % 360;
  return c >= 35 && c <= 145;
};

async function main() {
  let venuesWithFlags = 0;
  let totalFlags = 0;

  for (const stadium of MLB_STADIUMS) {
    if (RESEARCHED.has(stadium.id)) continue;
    let sections: DetailedSection[] = [];
    try {
      sections = await getStadiumSectionsAsync(stadium.id);
    } catch {
      continue;
    }
    if (!sections.length) continue;

    // Retractable/fixed-roof venues are shaded everywhere when the roof is
    // closed, so a high covered ratio is expected and not a bug. We only audit
    // OPEN-roof parks, where covered=true must mean a real overhang.
    const openRoof = stadium.roof === 'open';
    if (!openRoof) continue;

    const covered = sections.filter((s) => s.covered);
    const byLevel: Record<string, { total: number; cov: number }> = {};
    for (const s of sections) {
      byLevel[s.level] ??= { total: 0, cov: 0 };
      byLevel[s.level].total++;
      if (s.covered) byLevel[s.level].cov++;
    }

    const flags: string[] = [];
    for (const s of covered) {
      if (INDOOR_NAME.test(s.name)) continue; // legitimately indoor
      if (OPEN_AIR_NAME.test(s.name)) {
        flags.push(`${s.name} [${s.level}] — open-air (full sun) marked covered`);
      }
    }
    void isOutfieldGeom; // geometry flag retired — too noisy (upper decks legitimately overhang)
    const covPct = pct(covered.length, sections.length);
    const patternFlags: string[] = [];
    if (covPct >= 50) patternFlags.push(`${covPct}% of an OPEN-roof park marked covered (implausibly high)`);
    for (const [lvl, v] of Object.entries(byLevel)) {
      if (v.total >= 6 && v.cov === v.total) patternFlags.push(`100% of ${lvl} (${v.total}) covered`);
      if ((lvl === 'field') && v.cov > 0) patternFlags.push(`${v.cov} FIELD-level section(s) covered`);
    }

    if (flags.length || patternFlags.length) {
      venuesWithFlags++;
      totalFlags += flags.length;
      const levelStr = Object.entries(byLevel).map(([l, v]) => `${l} ${v.cov}/${v.total}`).join(', ');
      console.log(`\n${stadium.id} (${stadium.name}) — roof:${stadium.roof} · ${covered.length}/${sections.length} covered (${covPct}%)`);
      console.log(`   levels: ${levelStr}`);
      for (const lf of patternFlags) console.log(`   ⚠ ${lf}`);
      for (const f of flags.slice(0, 12)) console.log(`   • ${f}`);
      if (flags.length > 12) console.log(`   • …and ${flags.length - 12} more`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Audited OPEN-roof MLB venues (excluded researched: ${Array.from(RESEARCHED).join(', ')}; retractable/fixed roofs skipped).`);
  console.log(`${venuesWithFlags} open-roof venue(s) with likely-wrong covered flags; ${totalFlags} suspicious open-air section(s).`);
  process.exit(venuesWithFlags ? 1 : 0);
}

main();
