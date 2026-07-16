#!/usr/bin/env tsx
/**
 * Suspicious shade-coverage audit (audit Phase 3, step 6).
 *
 * Run with: npx tsx scripts/auditSuspiciousCoverage.ts
 *
 * Scans every MLB stadium's section data and FLAGS records whose coverage
 * pattern looks implausible, so a human can review them. It does NOT modify
 * any data. Heuristics:
 *   - field-covered:   a field-level section marked fully covered (rare in reality)
 *   - all-upper-covered: 100% of upper-deck sections fully covered (the classic
 *                        "entire upper deck = guaranteed shade" error)
 *   - mostly-covered:  >= 85% of all sections fully covered
 *   - none-covered:    0% covered despite 10+ sections (likely missing data)
 */
import { MLB_STADIUMS } from '../src/data/stadiums';
import { getStadiumSections } from '../src/data/stadium-data-aggregator';
import type { DetailedSection } from '../src/types/stadium-complete';

const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 100));

interface Finding {
  id: string;
  name: string;
  total: number;
  coveredPct: number;
  flags: string[];
}

const findings: Finding[] = [];

for (const stadium of MLB_STADIUMS) {
  let sections: DetailedSection[] = [];
  try {
    sections = getStadiumSections(stadium.id, 'MLB');
  } catch {
    continue;
  }
  if (!sections.length) continue;

  const covered = sections.filter((s) => s.covered);
  const partial = sections.filter((s) => !s.covered && s.partialCoverage);
  const upper = sections.filter((s) => s.level === 'upper');
  const upperCovered = upper.filter((s) => s.covered);
  const field = sections.filter((s) => s.level === 'field');
  const fieldCovered = field.filter((s) => s.covered);

  const flags: string[] = [];
  if (fieldCovered.length > 0) {
    flags.push(`field-covered (${fieldCovered.length}/${field.length} field sections fully covered)`);
  }
  if (upper.length >= 5 && upperCovered.length === upper.length) {
    flags.push(`all-upper-covered (100% of ${upper.length} upper-deck sections fully covered)`);
  }
  if (pct(covered.length, sections.length) >= 85) {
    flags.push(`mostly-covered (${pct(covered.length, sections.length)}% of all sections fully covered)`);
  }
  if (covered.length === 0 && partial.length === 0 && sections.length >= 10) {
    flags.push(`none-covered (0 covered/partial across ${sections.length} sections)`);
  }

  if (flags.length) {
    findings.push({
      id: stadium.id,
      name: stadium.name,
      total: sections.length,
      coveredPct: pct(covered.length, sections.length),
      flags,
    });
  }
}

console.log(`Scanned ${MLB_STADIUMS.length} MLB stadiums.\n`);
if (!findings.length) {
  console.log('✓ No suspicious coverage patterns found.');
} else {
  console.log(`⚠ ${findings.length} stadium(s) to review (NOT modified):\n`);
  for (const f of findings.sort((a, b) => b.coveredPct - a.coveredPct)) {
    console.log(`  ${f.id} (${f.name}) — ${f.total} sections, ${f.coveredPct}% fully covered`);
    for (const flag of f.flags) console.log(`      • ${flag}`);
  }
  console.log('\nThese are flagged for manual review only. No shade data was rewritten.');
}
