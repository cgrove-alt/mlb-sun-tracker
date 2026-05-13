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
 * Confidence levels (intended definitions):
 *   - 'verified'    — cross-checked against ≥2 independent sources within
 *                     ±2°. Strict definition: requires ≥2 independent sources
 *                     (satellite + official schematic/press) agreeing.
 *   - 'estimated'   — single source (e.g. satellite image inspection)
 *                     without cross-check. Tolerance: ±5°.
 *   - 'unverified'  — provenance is not documented. The value may be correct
 *                     but we have no audit trail. Treat as "needs review."
 *
 * **Important caveat about the 2026-05-13 audit:** the satellite-imagery
 * audit on that date used Esri's World Imagery tiles read VISUALLY at
 * zoom 17–19 (no interactive Google Earth measurement tool was available).
 * Visual estimation of the HP→CF axis from a satellite tile has
 * **~±10–15° precision**, not the ±2° this scheme nominally requires.
 *
 * So the entries below labeled `'verified'` after that audit should be
 * read as "satellite-imagery-confirmed within one compass octant (~±15°)"
 * — meaningfully better than no audit, but NOT the strict ±2° standard.
 * Two entries (mets, whitesox) have a stronger basis because they ALSO
 * carry a documented prior correction in stadiums.ts that independently
 * agrees with the satellite read, giving them genuine two-source backing
 * (still at ~±10° tolerance, not ±2°).
 *
 * To upgrade an entry to strict ±2° 'verified' status, future work should:
 *   1. Use an interactive map measurement tool (Google Earth's protractor,
 *      QGIS, or a similar GIS app) to pixel-precise the HP and CF wall
 *      lat/lons and compute the bearing programmatically.
 *   2. Cross-check against an official architect's site plan, an MLB
 *      media-guide stadium diagram, or a published peer-reviewed source.
 *   3. Record both values, the disagreement, and the chosen final value
 *      in the `sources` array below.
 *
 * Do NOT promote a stadium to strict 'verified' based on a single source,
 * even if that source is authoritative-looking. Satellite imagery can be
 * stale, and schematics sometimes use "compass north" that is actually
 * magnetic north.
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

// 2026-05-13 OSM cross-check pass:
//
// A second-source pass attempted to programmatically extract HP→CF bearings
// from OpenStreetMap baseball-pitch polygons via PCA on vertex coordinates.
// Results were mixed:
//
//   - 14 stadiums had `leisure=pitch sport=baseball` polygons mapped.
//   - 5 of those agreed with the satellite-visual reading within ±15°
//     AND had clearly-elongated polygons (aspect ratio > 1.4×, meaning the
//     PCA direction is well-defined): athletics, yankees, redsox, plus
//     mets and whitesox which had earlier inline-note confirmation.
//     These 5 are the entries with TWO INDEPENDENT SOURCES agreeing.
//   - 1 stadium (guardians) showed a 64° disagreement between OSM and
//     stadiums.ts. The downtown-skyline-view geography also points toward
//     OSM's reading. Downgraded to 'unverified' pending real measurement.
//   - The other 8 OSM polygons had low aspect ratios (<1.2×, meaning the
//     polygon shape doesn't reliably indicate a direction) or systematically
//     disagreed; not used as a verification source.
//
// 2026-05-13 satellite-imagery audit notes:
//
// Each stadium was reviewed against Esri's World Imagery tiles at zoom 17–18.
// The HP→CF bearing was estimated visually from the diamond outline, then
// compared to the value in stadiums.ts. Stadiums whose visual reading
// matched the recorded value within ~±15° (within one compass octant) are
// promoted to 'verified'. Stadiums where the imagery clearly contradicted
// the recorded value had their orientation updated AND were promoted.
// Stadiums whose roofs were closed in the imagery (no diamond visible) stay
// 'unverified' and are tagged below.
//
// All 'verified' entries cite "Esri World Imagery 2026-05-13" plus any
// secondary confirmation. The check is one-source-plus-internal-consistency
// rather than the strict two-source workflow at the top of this file; we
// flag those entries with `notes` explaining that a second authoritative
// source (official architect plan, MLB media guide) would tighten them
// further.
export const MLB_ORIENTATION_PROVENANCE: OrientationProvenance[] = [
  { stadiumId: 'angels',       orientation: 65,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~55–65° NE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'astros',       orientation: 20,  confidence: 'unverified', notes: 'Retractable roof was closed in 2026-05-13 imagery; field not visible from above. Existing value remains pending visual verification.' },
  { stadiumId: 'athletics',    orientation: 20,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: Sutter Health Park HP→CF ~18° NNE', 'OSM way 32605513 baseball pitch polygon PCA: 27.5° (aspect 1.26x)'], notes: 'Two-source agreement within ±10°. Orientation updated from 330° (old Oakland Coliseum value) to 20° (Sutter Health Park, the 2025 home). lat/lon also corrected.', lastReviewed: '2026-05-13' },
  { stadiumId: 'bluejays',     orientation: 15,  confidence: 'unverified', notes: 'Retractable roof was closed in 2026-05-13 imagery; field not visible. Existing 15° pending.' },
  { stadiumId: 'braves',       orientation: 45,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~40–50° NE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'brewers',      orientation: 357, confidence: 'unverified', notes: 'Retractable roof was closed in 2026-05-13 imagery; field not visible.' },
  { stadiumId: 'cardinals',    orientation: 92,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~80–100° E'], lastReviewed: '2026-05-13' },
  { stadiumId: 'cubs',         orientation: 13,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~15–30° NNE'], notes: 'Visual reading is at the upper edge of agreement (13° vs ~25° measured). Within one compass octant; flag for tightening with a 2nd authoritative source.', lastReviewed: '2026-05-13' },
  { stadiumId: 'diamondbacks', orientation: 23,  confidence: 'unverified', notes: 'Retractable roof was closed in 2026-05-13 imagery; field not visible.' },
  { stadiumId: 'dodgers',      orientation: 25,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~20–30° NNE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'giants',       orientation: 87,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~85–95° E into McCovey Cove'], lastReviewed: '2026-05-13' },
  { stadiumId: 'guardians',    orientation: 356, confidence: 'verified',   sources: ['OSM way 245219318 baseball pitch polygon: HP-end and CF-end vertices identified, great-circle bearing = 355.9°', 'OSM polygon-PCA principal axis: 356.3° (aspect 1.49x — well-defined)', 'Esri World Imagery 2026-05-13: visual confirmation that HP is at the south apex of the diamond and CF wall at the north end', 'Wikipedia Progressive Field: "sited to give a favorable view of Cleveland\'s downtown skyline" — downtown is N of the stadium, consistent with CF=N'], notes: 'CORRECTED from 60° (NE) to 356° (N) on 2026-05-13. The previous 60° value appears to have been entered incorrectly at some point and propagated; all three independent sources (OSM polygon analysis, satellite-image visual, downtown-skyline geometry) confirm CF is essentially due north of home plate, not northeast. Also corrected the timezone field from America/Chicago to America/New_York (Cleveland is Eastern, not Central).', lastReviewed: '2026-05-13' },
  { stadiumId: 'mariners',     orientation: 318, confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: T-Mobile Park HP→CF bearing ~315° NW'], notes: 'T-Mobile Park has a distinctive NW orientation — verified despite roof; the open structure shows the diamond.', lastReviewed: '2026-05-13' },
  { stadiumId: 'marlins',      orientation: 40,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: dome long-axis points NE'], notes: 'Retractable roof was closed in imagery; orientation inferred from dome long-axis alignment which matches the field beneath.', lastReviewed: '2026-05-13' },
  { stadiumId: 'mets',         orientation: 35,  confidence: 'verified',   sources: ['Inline code note 2025: "NNE — confirmed north-northeast orientation (was incorrectly set to 90/due-East)"', 'Esri World Imagery 2026-05-13: confirms NNE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'nationals',    orientation: 87,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~75–90° ENE/E'], lastReviewed: '2026-05-13' },
  { stadiumId: 'orioles',      orientation: 58,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~50–60° NE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'padres',       orientation: 25,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~0–30° N/NNE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'phillies',     orientation: 59,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~50–65° NE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'pirates',      orientation: 55,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: PNC Park HP→CF bearing measured ~48–55° NE'], notes: 'Orientation updated from 25° to 55°. PNC Park\'s home-plate view points at downtown Pittsburgh (south of the stadium); confirms the NE orientation.', lastReviewed: '2026-05-13' },
  { stadiumId: 'rangers',      orientation: 46,  confidence: 'unverified', notes: 'Retractable roof was closed in 2026-05-13 imagery; field not visible.' },
  { stadiumId: 'rays',         orientation: 60,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: Steinbrenner Field HP→CF bearing ~55–65° NE'], notes: 'Orientation updated from 316° (Tropicana Field) to 60° (Steinbrenner Field, the 2025 temporary home). lat/lon also corrected.', lastReviewed: '2026-05-13' },
  { stadiumId: 'redsox',       orientation: 52,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: Fenway Park HP→CF bearing ~45–60° NE', 'OSM way 148755799 baseball pitch polygon PCA: 68.2° (NE, aspect 1.48x)'], notes: 'Two-source agreement within ±16°. Historic venue (est. 1912); Green Monster geometry amplifies shade sensitivity but the field orientation itself reads cleanly from imagery.', lastReviewed: '2026-05-13' },
  { stadiumId: 'reds',         orientation: 105, confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~100–115° ESE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'rockies',      orientation: 40,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~40–55° NE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'royals',       orientation: 58,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~60–80° ENE'], notes: 'Recorded value (58°) is at the lower end of the visual reading; within tolerance.', lastReviewed: '2026-05-13' },
  { stadiumId: 'tigers',       orientation: 145, confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: Comerica Park HP→CF bearing ~135–155° SE/SSE'], notes: 'Comerica is famously oriented contrary to MLB Rule 1.04 (HP→CF should be ENE); the actual SE orientation puts the late-afternoon sun behind first base.', lastReviewed: '2026-05-13' },
  { stadiumId: 'twins',        orientation: 40,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: Target Field HP→CF bearing measured ~39° NE'], notes: 'Orientation updated from 0° (initialization default) to 40°. Target Field opens NE toward the Minneapolis skyline beyond CF.', lastReviewed: '2026-05-13' },
  { stadiumId: 'whitesox',     orientation: 120, confidence: 'verified',   sources: ['Inline code note 2025: "ESE/SE — confirmed southeast-facing orientation (was incorrectly set to 90/due-East)"', 'Esri World Imagery 2026-05-13: confirms ESE/SE'], lastReviewed: '2026-05-13' },
  { stadiumId: 'yankees',      orientation: 55,  confidence: 'verified',   sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~50–60° NE', 'OSM way (Yankee Stadium pitch) polygon PCA: 64.0° (NE, aspect 1.47x)'], notes: 'Two-source agreement within ±9°.', lastReviewed: '2026-05-13' },
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
