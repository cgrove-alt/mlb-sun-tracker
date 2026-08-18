/**
 * Stadium Data Fidelity (Phase 9 A3)
 *
 * One source of truth for the provenance of a stadium's section inventory.
 * Every MLB park now has source-backed section identity; the classifier still
 * detects a regression
 * to the old 65-section template or generic fallback. This flag
 * lets the UI disclose that honestly ("approximate seating data") and lets the
 * audit harness count low-fidelity parks — both read the SAME classifier here.
 *
 *   - 'source-backed' — section IDs come from a published seating map. This
 *                       does not imply surveyed row or obstruction geometry.
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

// NOTE: this module deliberately does NOT import `stadium-data-aggregator`.
// Doing so used to drag all 30 MLB section files (~988 KB) into the bundle of
// every client component that wanted a one-word fidelity label, because
// STADIUM_DATA_FIDELITY was computed at module scope over every stadium. The
// classification is now a checked-in table (see below) and the aggregator is
// only reached through a dynamic import in `computeStadiumDataFidelity`.
import type { DetailedSection } from '../types/stadium-complete';

export type DataFidelity = 'source-backed' | 'partial' | 'approximate';

/**
 * Parks whose section identities and placement come from a published club
 * chart or club-linked public 3-D map. Row elevation and rake remain modeled;
 * see `stadiumSectionProvenance.ts` for that explicit boundary.
 */
export const SOURCE_BACKED_INVENTORY_STADIUMS: ReadonlySet<string> = new Set([
  'angels', 'astros', 'athletics', 'bluejays', 'braves', 'brewers',
  'cardinals', 'cubs', 'diamondbacks', 'dodgers', 'giants', 'guardians',
  'mariners', 'marlins', 'mets', 'nationals', 'orioles', 'padres',
  'phillies', 'pirates', 'rangers', 'rays', 'reds', 'redsox', 'rockies',
  'royals', 'tigers', 'twins', 'whitesox', 'yankees',
  'acrisure-stadium', 'allegiant-stadium', 'at-t-stadium', 'bank-of-america-stadium',
  'caesars-superdome', 'empower-field', 'everbank-stadium', 'ford-field',
  'geha-field-arrowhead', 'gillette-stadium', 'hard-rock-stadium', 'highmark-stadium',
  'huntington-bank-field', 'lambeau-field', 'levis-stadium', 'lincoln-financial-field',
  'lucas-oil-stadium', 'lumen-field', 'm-t-bank-stadium', 'mercedes-benz-stadium',
  'metlife-stadium-giants', 'metlife-stadium-jets', 'nissan-stadium', 'northwest-stadium',
  'nrg-stadium', 'paycor-stadium', 'raymond-james-stadium', 'sofi-stadium-chargers',
  'sofi-stadium-rams', 'soldier-field', 'state-farm-stadium', 'us-bank-stadium',
  'buffalo-bisons', 'dayton-dragons', 'durham-bulls', 'erie-seawolves',
  'frisco-roughriders', 'indianapolis-indians', 'jacksonville-jumbo-shrimp',
  'las-vegas-aviators', 'montgomery-biscuits', 'norfolk-tides', 'oklahoma-city-dodgers',
  'salem-red-sox', 'somerset-patriots', 'toledo-mud-hens',
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
  // No registered file → the generic 45°-wedge fallback generator.
  if (!hasSpecific || sections.length === 0) return 'approximate';

  // The auto-generated 65-section bowl template — modeled wedges, not a real
  // seating map. (Corroborated by body-duplicate detection in the audit: many
  // of these parks share an identical section body.)
  if (sections.length === TEMPLATE_SECTION_COUNT) return 'approximate';

  if (SOURCE_BACKED_INVENTORY_STADIUMS.has(stadiumId)) return 'source-backed';

  // Any other generator whose wedges are perfectly uniform — real maps vary.
  const spans = sections.map((s) => s.angleSpan);
  if (stdev(spans) < 0.5 && new Set(spans).size <= 2) return 'approximate';

  // Registered, park-specific counts not yet backed by checked provenance.
  return 'partial';
}

/**
 * Fidelity for every MLB stadium.
 *
 * This is a checked-in table rather than a runtime computation. Deriving it by
 * calling classifyFidelity() over all 30 stadiums meant importing every section
 * file just to produce 30 enum values — which is what put ~988 KB of section
 * data into the client bundle of anything that rendered a fidelity notice.
 *
 * `stadiumDataFidelity.test.ts` recomputes this from the real section data and
 * fails if it drifts, so hand-authoring a new park's seating map surfaces as a
 * failing test telling you to update this table.
 */
export const STADIUM_DATA_FIDELITY: Record<string, DataFidelity> = {
  angels: 'source-backed',
  astros: 'source-backed',
  athletics: 'source-backed',
  bluejays: 'source-backed',
  braves: 'source-backed',
  brewers: 'source-backed',
  cardinals: 'source-backed',
  cubs: 'source-backed',
  diamondbacks: 'source-backed',
  dodgers: 'source-backed',
  giants: 'source-backed',
  guardians: 'source-backed',
  mariners: 'source-backed',
  marlins: 'source-backed',
  mets: 'source-backed',
  nationals: 'source-backed',
  orioles: 'source-backed',
  padres: 'source-backed',
  phillies: 'source-backed',
  pirates: 'source-backed',
  rangers: 'source-backed',
  rays: 'source-backed',
  reds: 'source-backed',
  redsox: 'source-backed',
  rockies: 'source-backed',
  royals: 'source-backed',
  tigers: 'source-backed',
  twins: 'source-backed',
  whitesox: 'source-backed',
  yankees: 'source-backed',
};

/**
 * Fidelity for one stadium. Reads the table above — cheap, synchronous, and
 * safe to call from a client component.
 */
export function getStadiumDataFidelity(stadiumId: string): DataFidelity {
  if (SOURCE_BACKED_INVENTORY_STADIUMS.has(stadiumId)) return 'source-backed';
  return STADIUM_DATA_FIDELITY[stadiumId] ?? 'approximate';
}

/**
 * Recompute one stadium's fidelity from its actual section data.
 *
 * The aggregator is pulled in via a dynamic import so it never enters the
 * static graph of anything importing this module. Used by the drift test and
 * available to node-side tooling; the UI should use getStadiumDataFidelity().
 */
export async function computeStadiumDataFidelity(stadiumId: string): Promise<DataFidelity> {
  const { getStadiumSections, hasSpecificData } = await import('./stadium-data-aggregator');
  const sections = await getStadiumSections(stadiumId, 'MLB');
  const has = hasSpecificData(stadiumId).hasSections;
  return classifyFidelity(sections, stadiumId, has);
}

/** User-facing note for a fidelity level (used by the UI disclosure in Track B). */
export function fidelityNote(fidelity: DataFidelity): string | null {
  switch (fidelity) {
    case 'source-backed':
      return 'Section inventory is source-backed. Metric row, overhang, and obstruction geometry has not passed remote reconstruction and independent observation validation; exact seat-level shade results are unavailable.';
    case 'partial':
      return 'Seating data is partially hand-verified; some sections are approximate.';
    case 'approximate':
      return 'Seating layout is approximate. Individual section placement and metric shade geometry are modeled and have not passed independent observation validation.';
    default:
      return null;
  }
}
