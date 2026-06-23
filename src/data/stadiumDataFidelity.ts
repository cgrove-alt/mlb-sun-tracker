/**
 * Stadium Data Fidelity (Phase 9 A3)
 *
 * One source of truth for "how real is this stadium's per-section seating
 * data." The shade engine is physically correct, but its precision is capped
 * by the section data feeding it: a few parks have hand-authored real seating
 * maps, most still use the auto-generated 65-section bowl template. This flag
 * lets the UI disclose that honestly ("approximate seating data") and lets the
 * audit harness count low-fidelity parks — both read the SAME classifier here.
 *
 *   - 'real'        — hand-authored from a real seating map (per-section IDs,
 *                     varied spans, measured coverage). The allowlist below.
 *   - 'approximate' — the auto-generated template (uniform angular wedges, no
 *                     real section identities) or the generic fallback. The
 *                     bowl SIDE (sun vs shade) is still physically correct, but
 *                     individual section identity/geometry is modeled, not real.
 *   - 'partial'     — registered, hand-touched data that isn't the full real
 *                     treatment and isn't the uniform template.
 *
 * NOTE on direction: this module is imported at runtime (UI) and is dependency-
 * light on purpose. `scripts/auditSectionData.ts` imports `classifyFidelity`
 * FROM here (not the reverse) so the node-only audit deps never reach the
 * client bundle.
 */

import { MLB_STADIUMS } from './stadiums';
import { getStadiumSections, hasSpecificData } from './stadium-data-aggregator';
import type { DetailedSection } from '../types/stadium-complete';

export type DataFidelity = 'real' | 'partial' | 'approximate';

/**
 * Parks whose section files have been replaced with hand-authored real seating
 * data (see the 2026-05-21 section audit + the "Real X section data" commits).
 * Extend this as more parks are re-authored.
 */
export const REAL_DATA_STADIUMS: ReadonlySet<string> = new Set([
  'yankees', // 184 real sections
  'redsox',  // 277 real sections (Fenway)
  'whitesox', // 132 real sections (Rate Field)
]);

function stdev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length);
}

/**
 * Classify a stadium's section data. Pure: operates only on the in-memory
 * sections + two booleans, so both runtime and the audit script can call it.
 *
 * @param sections     the stadium's DetailedSection[]
 * @param stadiumId    canonical stadium id
 * @param hasSpecific  whether the id has a registered (non-fallback) section file
 */
// The auto-generated bowl template (scripts/generate-all-sections.ts) always
// emits exactly this many sections (26 field + 14 lower + 8 club + 12 upper +
// 4 suite + 1 standing). Real hand-authored parks land on their own
// park-specific counts (e.g. Fenway 277, Yankees 184), never this exact value.
const TEMPLATE_SECTION_COUNT = 65;

export function classifyFidelity(
  sections: Pick<DetailedSection, 'angleSpan'>[],
  stadiumId: string,
  hasSpecific: boolean,
): DataFidelity {
  if (REAL_DATA_STADIUMS.has(stadiumId)) return 'real';
  // No registered file → the generic 45°-wedge fallback generator.
  if (!hasSpecific || sections.length === 0) return 'approximate';

  // The auto-generated 65-section bowl template — modeled wedges, not a real
  // seating map. (Corroborated by body-duplicate detection in the audit: many
  // of these parks share an identical section body.)
  if (sections.length === TEMPLATE_SECTION_COUNT) return 'approximate';

  // Any other generator whose wedges are perfectly uniform — real maps vary.
  const spans = sections.map((s) => s.angleSpan);
  if (stdev(spans) < 0.5 && new Set(spans).size <= 2) return 'approximate';

  // Registered, park-specific counts, not yet on the real allowlist: a
  // partially hand-authored file. (Currently none — it's 3 real + 27 template.)
  return 'partial';
}

/** Fidelity for one stadium, computed from its current section data. */
export function getStadiumDataFidelity(stadiumId: string): DataFidelity {
  const sections = getStadiumSections(stadiumId, 'MLB');
  const has = hasSpecificData(stadiumId).hasSections;
  return classifyFidelity(sections, stadiumId, has);
}

/** Precomputed fidelity for every MLB stadium (single source for UI + audit). */
export const STADIUM_DATA_FIDELITY: Record<string, DataFidelity> = Object.fromEntries(
  MLB_STADIUMS.map((s) => [s.id, getStadiumDataFidelity(s.id)]),
);

/** User-facing note for a fidelity level (used by the UI disclosure in Track B). */
export function fidelityNote(fidelity: DataFidelity): string | null {
  switch (fidelity) {
    case 'real':
      return null; // no disclaimer needed
    case 'partial':
      return 'Seating data is partially hand-verified; some sections are approximate.';
    case 'approximate':
      return 'Seating layout is approximate — the shaded vs sunny side is accurate, but individual section details are modeled, not from this park’s real seating map.';
    default:
      return null;
  }
}
