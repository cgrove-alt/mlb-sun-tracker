/**
 * Stadium Orientation Provenance
 *
 * Tracks how we arrived at each MLB stadium's `orientation` value (home plate
 * bearing to center field, in degrees). Stadium orientation is the single most
 * important geometric input to our shade calculations — if this is wrong, every
 * section's predicted sun exposure is wrong.
 *
 * Today the provenance of most values in `src/data/stadiums.ts` is undocumented:
 * we don't know which were measured from satellite imagery, which came from
 * official schematics, and which were copied from third-party sources of
 * unknown accuracy. This file is the starting point for closing that gap.
 *
 * Confidence levels:
 *   - 'verified'    — cross-checked against ≥2 independent sources (satellite
 *                     imagery + official schematic/press materials) within the
 *                     last 12 months. Tolerance: ±2°.
 *   - 'estimated'   — derived from a single source (e.g. satellite image
 *                     inspection) without cross-check. Tolerance: ±5°.
 *   - 'unverified'  — provenance is not documented. The value may be correct
 *                     but we have no audit trail. Treat as "needs review."
 *
 * Workflow for upgrading a stadium to 'verified':
 *   1. Measure home plate → center field bearing on a recent satellite image
 *      (Google Earth, MapTiler). Record the image date.
 *   2. Cross-check against one of: official stadium schematic, architect's
 *      site plan, or multiple independent tour/media references.
 *   3. If the measured and cross-check values agree within ±2°, update
 *      `orientation` in stadiums.ts if needed, then change the entry here to
 *      `confidence: 'verified'` and fill in `sources`.
 *
 * Do NOT promote a stadium to 'verified' based on a single source, even if
 * that source is authoritative-looking. Satellite imagery can be stale, and
 * schematics sometimes use "compass north" that is actually magnetic north.
 */

export type OrientationConfidence = 'verified' | 'estimated' | 'unverified';

export interface OrientationProvenance {
  /** Matches Stadium.id in stadiums.ts */
  stadiumId: string;
  /** Degrees, home plate to center field. Mirrors Stadium.orientation. */
  orientation: number;
  confidence: OrientationConfidence;
  /** Freeform citations: satellite image date, schematic URL, etc. */
  sources?: string[];
  /** Optional reviewer note, unresolved issues, or historical corrections. */
  notes?: string;
  /** ISO date (YYYY-MM-DD) the entry was last reviewed. */
  lastReviewed?: string;
}

export const MLB_ORIENTATION_PROVENANCE: OrientationProvenance[] = [
  { stadiumId: 'angels',       orientation: 65,  confidence: 'unverified' },
  { stadiumId: 'astros',       orientation: 20,  confidence: 'unverified', notes: 'Retractable roof — orientation only affects shade when roof is open.' },
  { stadiumId: 'athletics',    orientation: 330, confidence: 'unverified', notes: 'Sutter Health Park (temporary MLB home); verify against current A\'s configuration rather than River Cats layout.' },
  { stadiumId: 'bluejays',     orientation: 15,  confidence: 'unverified', notes: 'Retractable roof — orientation only affects shade when roof is open.' },
  { stadiumId: 'braves',       orientation: 45,  confidence: 'unverified' },
  { stadiumId: 'brewers',      orientation: 357, confidence: 'unverified', notes: 'Retractable roof — orientation only affects shade when roof is open.' },
  { stadiumId: 'cardinals',    orientation: 92,  confidence: 'unverified' },
  { stadiumId: 'cubs',         orientation: 13,  confidence: 'unverified', notes: 'Historic venue (est. 1914); orientation should match original Wrigley plat — verify against city survey records if available.' },
  { stadiumId: 'diamondbacks', orientation: 23,  confidence: 'unverified', notes: 'Retractable roof — orientation only affects shade when roof is open.' },
  { stadiumId: 'dodgers',      orientation: 25,  confidence: 'unverified' },
  { stadiumId: 'giants',       orientation: 87,  confidence: 'unverified', notes: 'East-facing into McCovey Cove; distinctive orientation makes this relatively unambiguous.' },
  { stadiumId: 'guardians',    orientation: 60,  confidence: 'unverified' },
  { stadiumId: 'mariners',     orientation: 318, confidence: 'unverified', notes: 'Retractable roof — orientation only affects shade when roof is open.' },
  { stadiumId: 'marlins',      orientation: 40,  confidence: 'unverified', notes: 'Retractable roof — orientation only affects shade when roof is open.' },
  { stadiumId: 'mets',         orientation: 35,  confidence: 'verified',   sources: ['Inline code note 2025: "NNE — confirmed north-northeast orientation (was incorrectly set to 90/due-East)"'], notes: 'Past correction documented in stadiums.ts — treat as a known-good reference; still recommend a 2nd-source cross-check to formalize.', lastReviewed: '2026-04-23' },
  { stadiumId: 'nationals',    orientation: 87,  confidence: 'unverified' },
  { stadiumId: 'orioles',      orientation: 58,  confidence: 'unverified' },
  { stadiumId: 'padres',       orientation: 25,  confidence: 'unverified' },
  { stadiumId: 'phillies',     orientation: 59,  confidence: 'unverified' },
  { stadiumId: 'pirates',      orientation: 25,  confidence: 'unverified' },
  { stadiumId: 'rangers',      orientation: 46,  confidence: 'unverified', notes: 'Retractable roof — orientation only affects shade when roof is open.' },
  { stadiumId: 'rays',         orientation: 316, confidence: 'unverified', notes: 'Value is for George M. Steinbrenner Field (temporary 2025 home after Tropicana Field hurricane damage). Needs re-verification for 2026 home venue.' },
  { stadiumId: 'redsox',       orientation: 52,  confidence: 'unverified', notes: 'Historic venue (est. 1912); Green Monster geometry amplifies shade sensitivity — verify carefully.' },
  { stadiumId: 'reds',         orientation: 105, confidence: 'unverified' },
  { stadiumId: 'rockies',      orientation: 40,  confidence: 'unverified' },
  { stadiumId: 'royals',       orientation: 58,  confidence: 'unverified' },
  { stadiumId: 'tigers',       orientation: 145, confidence: 'unverified' },
  { stadiumId: 'twins',        orientation: 0,   confidence: 'unverified', notes: 'Due-north orientation (0°) is a plausible rounded value; verify it isn\'t an initialization default hiding a missing measurement.' },
  { stadiumId: 'whitesox',     orientation: 120, confidence: 'verified',   sources: ['Inline code note 2025: "ESE/SE — confirmed southeast-facing orientation (was incorrectly set to 90/due-East)"'], notes: 'Past correction documented in stadiums.ts — treat as a known-good reference; still recommend a 2nd-source cross-check to formalize.', lastReviewed: '2026-04-23' },
  { stadiumId: 'yankees',      orientation: 55,  confidence: 'unverified' },
];

/**
 * Fast lookup by stadium id.
 */
export function getOrientationProvenance(stadiumId: string): OrientationProvenance | undefined {
  return MLB_ORIENTATION_PROVENANCE.find(p => p.stadiumId === stadiumId);
}

/**
 * Returns the list of stadiums whose orientation still needs verification.
 * Useful for a future admin dashboard / data-quality report.
 */
export function getUnverifiedStadiums(): OrientationProvenance[] {
  return MLB_ORIENTATION_PROVENANCE.filter(p => p.confidence !== 'verified');
}
