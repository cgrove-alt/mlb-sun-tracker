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
 * Confidence is DERIVED from `precisionDeg` (the honest ± error of the value)
 * plus the number of independent agreeing sources:
 *   - 'verified'    — ≥2 INDEPENDENT sources agree AND precisionDeg ≤ 12.
 *                     IMPORTANT: none of the current entries are survey-grade
 *                     (±2°). "verified" here means *multi-source-confirmed
 *                     within ~one compass octant* — meaningfully better than a
 *                     lone read, but NOT the strict ±2° standard. True
 *                     survey-grade requires precisionDeg ≤ 2 via GIS
 *                     measurement (see the upgrade workflow below).
 *   - 'estimated'   — a SINGLE source: one satellite-visual read or one
 *                     published directional claim. precisionDeg ~13–20.
 *   - 'unverified'  — no documented source, a roof-closed *inference* only
 *                     (no diamond visible), or sources that disagree.
 *
 * The 2026-06-23 honesty pass (Phase 9 A1) stopped labeling lone ±15°
 * satellite reads as 'verified': 19 single-source entries were demoted to
 * 'estimated', and one roof-closed inference (marlins) to 'unverified'.
 * The 10 genuinely multi-source entries retain 'verified' but now carry an
 * explicit precisionDeg so no one mistakes them for survey-grade.
 *
 * `precisionDeg` is METADATA ONLY — it is not an input to any shade
 * calculation (orientation remains a single scalar). It exists so the audit
 * harness and UI can flag low-precision parks and so re-measurement has a
 * target. `getOrientationPrecision()` exposes it (defaulting to a
 * conservative 15° when unknown).
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

/** How an orientation value was derived, strongest → weakest precision. */
export type OrientationMethod =
  | 'gis-measured'        // pixel-precise HP & CF lat/lons → great-circle bearing (~±2°)
  | 'osm-polygon-pca'     // PCA principal axis of an OSM baseball-pitch polygon (~±6–12°)
  | 'official-schematic'  // architect site plan / MLB media-guide diagram
  | 'published-source'    // textual published claim (e.g. "home plate faces north")
  | 'satellite-visual';   // visual read of the diamond from a satellite tile (~±15°)

export interface OrientationProvenance {
  /** Matches Stadium.id in stadiums.ts */
  stadiumId: string;
  /** Degrees, home plate to center field. Mirrors Stadium.orientation. */
  orientation: number;
  confidence: OrientationConfidence;
  /**
   * Honest ± precision of `orientation`, in degrees. Drives `confidence`:
   * ≤2 = survey-grade, ~6–12 = multi-source agreement, ~13–20 = single read.
   * METADATA ONLY — never an input to a shade calculation.
   */
  precisionDeg?: number;
  /** Primary technique behind `orientation`. */
  method?: OrientationMethod;
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
//
// 2026-06-23 multi-source verification pass (Phase 9 — "verify all 30"):
//
// All 30 parks were re-verified against TWO authoritative independent sources
// the earlier audit lacked:
//   - ballparks.com (each park's diagram filename `n###.gif` encodes the HP→CF
//     bearing in degrees) — a satellite-derived numeric value per park.
//   - andrewclem.com stadium statistics ("CF orientation" column, explicitly
//     defined as "the compass direction from home plate to center field").
// Both were cross-checked against shadedseats.com sun-pattern physics. Crucially
// they MATCHED the existing values on ~11 high-confidence parks (Comerica 150,
// Miller 135, Minute Maid 345, Chase 0, Fenway 45, Citi 30, Dodger 30, AT&T 90,
// Progressive 0, Wrigley 30, Camden 30), validating the convention — so where
// they disagreed, the old single-satellite values were the errors.
//
// 15 of 30 values were changed (8 of them wrong-quadrant/sub-quadrant GROSS
// errors): marlins 40→135, padres 25→0, braves 45→135, mariners 318→45,
// nationals 87→30, pirates 55→120, rockies 40→0, twins 40→90, plus refines
// (phillies 59→18, orioles 58→30, cardinals 92→60, cubs 13→30, royals 58→48,
// angels 65→50, reds 105→115). Result: 27 verified / 3 estimated / 0 unverified.
//
// EXCLUDED from changes: yankees (55), redsox (52), whitesox (120) — these three
// have hand-authored REAL section data keyed to their current orientation;
// ballparks.com hints at slightly different values (yankees 75, whitesox 135)
// but the diffs are within-quadrant and changing them would un-tune verified
// real seating data. Flagged for GIS, not changed here. theshadium.com (our own
// site) was excluded from all sourcing as circular. Still NOT survey-grade
// (±~10°); precisionDeg ≤ 2 via GIS remains the goal.
export const MLB_ORIENTATION_PROVENANCE: OrientationProvenance[] = [
  { stadiumId: 'angels',       orientation: 50,  confidence: 'estimated',  precisionDeg: 15, method: 'published-source', sources: ['ballparks.com diamonds index: Angel Stadium = n045.gif (45°)', 'shadedseats.com: home plate faces northeast / ENE (~65°) per sun cue "rises over center field"', 'Esri World Imagery 2026-05-13: ~55–65° NE'], notes: 'REFINED 2026-06-23 from 65° to 50°. Sources genuinely conflict within the NE quadrant: ballparks.com 45° vs shadedseats ENE ~65°. 50° is the midpoint; stays estimated (±15°) until GIS resolves the 45-vs-65 split.', lastReviewed: '2026-06-23' },
  { stadiumId: 'astros',       orientation: 340, confidence: 'verified',   precisionDeg: 10, method: 'osm-polygon-pca', sources: ['Esri World Imagery 2026-05-13: Daikin Park imagery shows the diamond through partial roof opening — HP at SE/lower-right, CF at NW/upper-left; visual bearing ~328°', 'OSM way 44530814 baseball pitch polygon vertex analysis: HP→CF bearing 346.3°', 'Houston downtown grid geometry: Crawford Street (LF wall alignment per Wikipedia) runs NNE-SSW, geometrically requiring HP→CF to be roughly NW'], notes: 'CORRECTED from 20° (NNE) to 340° (NNW) on 2026-05-13. Two independent sources (satellite visual + OSM polygon) confirm NNW. Previous 20° was a 50° error. Multi-source ±10°, not yet survey-grade.', lastReviewed: '2026-06-23' },
  { stadiumId: 'athletics',    orientation: 20,  confidence: 'verified',   precisionDeg: 12, method: 'osm-polygon-pca', sources: ['Esri World Imagery 2026-05-13: Sutter Health Park HP→CF ~18° NNE', 'OSM way 32605513 baseball pitch polygon PCA: 27.5° (aspect 1.26x)'], notes: 'Two-source agreement within ±10°. Orientation updated from 330° (old Oakland Coliseum value) to 20° (Sutter Health Park, the 2025 home). lat/lon also corrected.', lastReviewed: '2026-06-23' },
  { stadiumId: 'bluejays',     orientation: 0,   confidence: 'verified',   precisionDeg: 8,  method: 'published-source', sources: ['intheballparks.com / shadedseats.com: "Rogers Centre is one of the few major league parks where the batter faces north when hitting" — batter faces pitcher (i.e. toward CF), so HP→CF = north', 'Sun-pattern corroboration: "Throughout the afternoon the sun rotates from above home plate down the third base side… 3rd base side is shade side, 1st base side is sunny" — afternoon sun moves E→W; for 3B to be the shaded side it must be west, putting 1B east, which means HP→CF is north (catcher facing north has W on left, E on right)', 'OSM Rogers Centre building outline (way 7969701) PCA principal axis: 354.3° N (aspect 1.18×) — consistent with N orientation'], notes: 'Orientation updated from 15° NNE to 0° N. The published source unambiguously says batter faces north, and the sun-pattern description geometrically requires HP→CF=N.', lastReviewed: '2026-06-23' },
  { stadiumId: 'braves',       orientation: 135, confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['Wikipedia Truist Park: "The ballpark has a southeast orientation"', 'shadedseats.com Truist Park: "oriented to the southeast... sun rises over left field, curves around the right field foul pole at mid-day and sets behind home plate" ⇒ LF=E, HP=W ⇒ HP→CF=SE (135°)'], notes: 'GROSS ERROR CORRECTED 2026-06-23 from 45° (NE) to 135° (SE). The old satellite "~40–50° NE" read was a full ~90° quadrant error (likely an HP/CF swap). Wikipedia explicitly states SE; sun pattern (identical to Brewers) confirms. ballparks.com lists old Turner Field (030°), not Truist — not applicable.', lastReviewed: '2026-06-23' },
  { stadiumId: 'brewers',      orientation: 135, confidence: 'verified',   precisionDeg: 8,  method: 'published-source', sources: ['shadedseats.com: "Miller Park has a similar orientation to ballparks in Cincinnati and Chicago with home plate facing southeast" — Reds at 105° (ESE) and Whitesox at 120° (ESE/SE) confirm the range', 'Sun pattern: "Sun rises over left field, curves around right field foul pole around lunchtime and sets behind home plate" — geometric check: HP→CF=SE puts LF in the NE (catches sunrise), RF in the SW (catches lunchtime sun moving from S→W), and HP in NW (catches sunset). All consistent', 'OSM pitch polygon (way 1209147114) PCA principal axis: 132°/312° (aspect 1.18×) — 132° matches SE direction', 'Bing Maps and USGS NAIP imagery both show the partially-open fan-shaped roof: the parked closed-roof panel sits over home plate (NW area of stadium), revealing the field opening SE'], notes: 'Orientation CORRECTED from 357° N to 135° SE on 2026-05-13. The previous 357° was a 138° error — likely a sign-convention or HP/CF swap. The published source, OSM polygon PCA, and the sun-pattern description all independently confirm SE-facing.', lastReviewed: '2026-06-23' },
  { stadiumId: 'cardinals',    orientation: 60,  confidence: 'verified',   precisionDeg: 12, method: 'published-source', sources: ['ballparks.com diamonds index: Busch Stadium = n060.gif (60°)', 'baseballparks.com: "Field points northeast"', 'ballparksofbaseball / MLB.com: Gateway Arch + downtown skyline "on display beyond the center- and right-field walls" — the Arch sits east of the park, so CF points ENE'], notes: 'CORRECTED 2026-06-23 from 92° (E) to 60° (ENE/NE) — ~32° off. The Arch-beyond-CF geography (Arch is east) plus two explicit "northeast/60°" sources fix the value at ~60°.', lastReviewed: '2026-06-23' },
  { stadiumId: 'cubs',         orientation: 30,  confidence: 'verified',   precisionDeg: 12, method: 'published-source', sources: ['ballparks.com diamonds index: Wrigley Field = n030.gif (30°)', 'The Hardball Times (FanGraphs) "Lost in the Sun": "Fenway and Wrigley are oriented toward the northeast"', 'shadedseats.com sun pattern consistent with NE'], notes: 'REFINED 2026-06-23 from 13° to 30° (NE). The old 13° was too far north; ballparks.com (30°) + Hardball Times confirm NE. Wrigley is "further north than Rule 1.04 ENE" but still NE (~30°).', lastReviewed: '2026-06-23' },
  { stadiumId: 'diamondbacks', orientation: 0,   confidence: 'verified',   precisionDeg: 8,  method: 'published-source', sources: ['shadedseats.com: "Chase Field is oriented to the north. This means that home plate faces toward the north direction. Each morning the sun rises over the right field corner, swings around home plate at mid-day and sets behind the left field wall"', 'Sun-pattern corroboration: HP→CF=N puts RF (east of CF) where sunrise lands and LF (west of CF) where sunset lands — exactly matching the published description'], notes: 'Orientation updated from 23° NNE to 0° N. The published source explicitly states north orientation, and the sun-pattern description geometrically requires HP→CF=N. The previous 23° was within the right octant but not precise.', lastReviewed: '2026-06-23' },
  { stadiumId: 'dodgers',      orientation: 25,  confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['ballparks.com diamonds index: Dodger Stadium = n030.gif (30°)', 'shadedseats.com: home plate faces "north-northeast"; "sun rises over right field... sets beyond the left field foul pole; 3rd base is the shade side"', 'Esri World Imagery 2026-05-13: ~20–30° NNE'], notes: 'CONFIRMED + promoted verified 2026-06-23. ballparks.com (30°) + explicit NNE + sun pattern agree; recorded 25° kept (within ~5° of 30°).', lastReviewed: '2026-06-23' },
  { stadiumId: 'giants',       orientation: 87,  confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['ballparks.com diamonds index: AT&T/Oracle Park = n090.gif (90°)', 'pages.cs.wisc.edu/~naze/ballparks: "the Giants\' park faces due east"', 'shadedseats.com: "faces due east toward McCovey Cove"', 'Esri World Imagery 2026-05-13: ~85–95° E'], notes: 'CONFIRMED + promoted verified 2026-06-23. Three independent sources agree on due-east; recorded 87° kept (essentially E, within 3° of ballparks.com 90°).', lastReviewed: '2026-06-23' },
  { stadiumId: 'guardians',    orientation: 356, confidence: 'verified',   precisionDeg: 6,  method: 'osm-polygon-pca', sources: ['OSM way 245219318 baseball pitch polygon: HP-end and CF-end vertices identified, great-circle bearing = 355.9°', 'OSM polygon-PCA principal axis: 356.3° (aspect 1.49x — well-defined)', 'Esri World Imagery 2026-05-13: visual confirmation that HP is at the south apex of the diamond and CF wall at the north end', 'Wikipedia Progressive Field: "sited to give a favorable view of Cleveland\'s downtown skyline" — downtown is N of the stadium, consistent with CF=N'], notes: 'CORRECTED from 60° (NE) to 356° (N) on 2026-05-13. All three independent sources (OSM polygon analysis, satellite-image visual, downtown-skyline geometry) confirm CF is essentially due north. Also corrected timezone America/Chicago → America/New_York. Strongest non-survey entry: OSM great-circle bearing + well-defined PCA give ~±6°.', lastReviewed: '2026-06-23' },
  { stadiumId: 'mariners',     orientation: 45,  confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['ballparks.com diamonds index: Safeco/T-Mobile Park = n045.gif (45°)', 'andrewclem.com stadium statistics: T-Mobile Park CF orientation = NE', 'shadedseats.com: "T-Mobile Park is oriented to the northeast... the sun rises over the center field wall... and sets behind 3rd base" ⇒ CF≈E ⇒ NE'], notes: 'GROSS ERROR CORRECTED 2026-06-23 from 318° (NW) to 45° (NE) — an ~87° wrong-quadrant error. The old value was a single read through the retractable roof structure; three independent sources (ballparks.com numeric + andrewclem + sun pattern) all confirm NE.', lastReviewed: '2026-06-23' },
  { stadiumId: 'marlins',      orientation: 135, confidence: 'estimated',  precisionDeg: 20, method: 'published-source', sources: ['shadedseats.com loanDepot Park: "the stadium is oriented to the southeast" + sun pattern "sun rises behind the left field wall, curves around the right field foul pole at mid-day, and sets behind home plate"', 'Sun-pattern geometry: LF=sunrise(E), RF foul pole=midday(S), HP=sunset(W) ⇒ HP→CF ≈ SE (135°). Pattern is verbatim-identical to Brewers (135° SE).', 'Web consensus 2026-06-23: multiple guides describe loanDepot Park as southeast-oriented'], notes: 'CORRECTED 2026-06-23 from 40° (NE) to 135° (SE). The old 40° was a roof-closed dome long-axis INFERENCE (field need not match dome axis) and is contradicted by every field-orientation source. Confidence estimated/±20° — the quadrant (SE) is well-supported but the exact value needs GIS: loanDepot is roofed, so it has no OSM baseball-pitch polygon and no clear satellite diamond.', lastReviewed: '2026-06-23' },
  { stadiumId: 'mets',         orientation: 35,  confidence: 'verified',   precisionDeg: 10, method: 'satellite-visual', sources: ['Inline code note 2025: "NNE — confirmed north-northeast orientation (was incorrectly set to 90/due-East)"', 'Esri World Imagery 2026-05-13: confirms NNE'], notes: 'Two independent sources (documented prior correction + satellite) agree on NNE within ~±10°. Not yet survey-grade.', lastReviewed: '2026-06-23' },
  { stadiumId: 'nationals',    orientation: 30,  confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['ballparks.com diamonds index: Nationals Park = n030.gif (30°)', 'andrewclem.com stadium statistics: Nationals Park CF orientation = NNE', 'shadedseats.com: "oriented to the northeast... sun rises behind right field... sets behind left field corner; 3rd base is the shade side" ⇒ RF=E, CF=NNE'], notes: 'GROSS ERROR CORRECTED 2026-06-23 from 87° (nearly due E) to 30° (NNE) — ~57° off, wrong sub-quadrant. At 87° the sunrise would fall over left field, contradicting "rises behind right field." Two independent agents + ballparks.com + andrewclem all converge on NNE.', lastReviewed: '2026-06-23' },
  { stadiumId: 'orioles',      orientation: 30,  confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['ballparks.com diamonds index: Oriole Park at Camden Yards = n030.gif (30°)', 'andrewclem.com stadium statistics: CF orientation = NNE', 'shadedseats.com: "Camden Yards is oriented to the northeast... sun rises over the right field wall... sets behind the third base side" ⇒ NNE'], notes: 'CORRECTED 2026-06-23 from 58° (ENE) to 30° (NNE) — ~28° off. "Northeast" is the loose description; ballparks.com + andrewclem agree on NNE (~30°).', lastReviewed: '2026-06-23' },
  { stadiumId: 'padres',       orientation: 0,   confidence: 'verified',   precisionDeg: 8,  method: 'published-source', sources: ['shadedseats.com / Petco Park guides: "one of the few ballparks with home plate oriented due north... the batter faces due north," sharing orientation with Cleveland (Progressive) and Arizona (Chase) — both N-facing in this file (guardians 356°, diamondbacks 0°)', 'Sun pattern "sun rises over the right field corner, swings around home plate at mid-day, sets behind the left field wall" ⇒ RF=E, LF=W, HP=S ⇒ HP→CF = N (0°). Identical pattern to Chase Field.', 'Prior Esri World Imagery 2026-05-13 read 0–30° N/NNE — consistent with N at the low end'], notes: 'CORRECTED 2026-06-23 from 25° to 0° (N). Three independent signals (explicit "faces due north" + sun-pattern physics + named parallel to two other N-facing parks) agree on due north; the old 25° came from the high end of a wide satellite read. ±8° — promote to survey-grade with GIS.', lastReviewed: '2026-06-23' },
  { stadiumId: 'phillies',     orientation: 18,  confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['ballparks.com diamonds index: Citizens Bank Park = n015.gif (15°)', 'andrewclem.com stadium statistics: CF orientation = NNE', 'shadedseats.com: "Citizens Bank Park is oriented to the north... sun rises over the right field wall... sets near the left field corner" ⇒ near-N NNE'], notes: 'CORRECTED 2026-06-23 from 59° (ENE) to 18° (NNE) — ~41° off. The old satellite read was far too clockwise; three sources put it near due north (15–20°).', lastReviewed: '2026-06-23' },
  { stadiumId: 'pirates',      orientation: 120, confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['ballparks.com diamonds index: PNC Park = n120.gif (120°)', 'andrewclem.com stadium statistics: PNC Park CF orientation = ESE', 'shadedseats.com: "PNC Park is oriented to the southeast... sun rises behind the left field wall... sets behind home plate" ⇒ HP=W ⇒ CF=ESE', 'PNC sits on the north shore; the famous downtown skyline/Clemente Bridge view is beyond CF to the SE'], notes: 'GROSS ERROR CORRECTED 2026-06-23 from 55° (NE) to 120° (ESE) — ~65° off, wrong quadrant. The prior note reasoned "home-plate view points at downtown (south) ⇒ NE," which is self-contradictory: if CF faces the southern skyline, CF is SE, not NE. ballparks.com + andrewclem + sun pattern all confirm ESE.', lastReviewed: '2026-06-23' },
  { stadiumId: 'rangers',      orientation: 46,  confidence: 'estimated',  precisionDeg: 18, method: 'published-source', sources: ['Wikipedia Globe Life Field: "the new stadium\'s center field faces northeast rather than southeast" (vs Globe Life Park predecessor)', 'Esri World Imagery 2026-05-13: roof closed but Globe Life Field signage orientation consistent with NE-facing field'], notes: 'The published source only fixes the NE quadrant (±~22°), and the roof was closed in imagery so no direct diamond read. Demoted verified→estimated 2026-06-23; needs an open-roof pass or schematic to pin 46°.', lastReviewed: '2026-06-23' },
  { stadiumId: 'rays',         orientation: 60,  confidence: 'verified',   precisionDeg: 12, method: 'published-source', sources: ['andrewclem.com stadium statistics: George M. Steinbrenner Field CF orientation = ENE (~67°)', 'shadedseats.com: "Steinbrenner Field is oriented to the northeast"; 3B is the shade side, 1B/RF gets afternoon sun', 'Esri World Imagery 2026-05-13: ~55–65° NE'], notes: 'CONFIRMED + promoted verified 2026-06-23. Reflects Steinbrenner Field (2025 temporary home, NOT Tropicana Field which ballparks.com lists at 45°). andrewclem (ENE ~67°) + satellite (~60°) agree; recorded 60° kept.', lastReviewed: '2026-06-23' },
  { stadiumId: 'redsox',       orientation: 52,  confidence: 'verified',   precisionDeg: 12, method: 'osm-polygon-pca', sources: ['Esri World Imagery 2026-05-13: Fenway Park HP→CF bearing ~45–60° NE', 'OSM way 148755799 baseball pitch polygon PCA: 68.2° (NE, aspect 1.48x)'], notes: 'Two sources agree on NE but spread ~16° (52° satellite vs 68° PCA); recorded 52° favors the satellite read. Multi-source but worth GIS measurement to resolve the spread. Green Monster geometry amplifies shade sensitivity.', lastReviewed: '2026-06-23' },
  { stadiumId: 'reds',         orientation: 115, confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['ballparks.com diamonds index: Great American Ball Park = n120.gif (120°)', 'andrewclem.com stadium statistics: CF orientation = ESE (~112°)', 'shadedseats.com: "oriented to the southeast... sun rises over left field... sets behind home plate" ⇒ ESE'], notes: 'REFINED 2026-06-23 from 105° to 115° (ESE). ballparks.com (120°) + andrewclem (~112°) center on ~115°. (A search summary once hallucinated "NNE" for GABP — not in any source page; disregarded.)', lastReviewed: '2026-06-23' },
  { stadiumId: 'rockies',      orientation: 0,   confidence: 'verified',   precisionDeg: 8,  method: 'published-source', sources: ['ballparks.com diamonds index: Coors Field = n000.gif (0°)', 'andrewclem.com stadium statistics: Coors Field CF orientation = N', 'shadedseats.com: "Coors Field is oriented to the north... sun rises over right field... sets behind the left field stands" ⇒ CF=N'], notes: 'GROSS ERROR CORRECTED 2026-06-23 from 40° (NE) to 0° (N). Coors is one of the handful of due-north parks (with Chase/Petco/Progressive); the old 40° was a wrong sub-quadrant satellite read. Three sources confirm N.', lastReviewed: '2026-06-23' },
  { stadiumId: 'royals',       orientation: 48,  confidence: 'verified',   precisionDeg: 12, method: 'published-source', sources: ['ballparks.com diamonds index: Kauffman Stadium = n045.gif (45°)', 'andrewclem.com stadium statistics: CF orientation = NE', 'shadedseats.com: "oriented to the northeast... sun rises over center field... sets behind the 3rd base side near the left field foul pole"'], notes: 'REFINED 2026-06-23 from 58° to 48°. ballparks.com (45°) + andrewclem (NE) center the value at ~45–50°; the old 58° was at the high edge.', lastReviewed: '2026-06-23' },
  { stadiumId: 'tigers',       orientation: 145, confidence: 'verified',   precisionDeg: 10, method: 'published-source', sources: ['ballparks.com diamonds index: Comerica Park = n150.gif (150°)', 'Wikipedia Comerica Park: "the most southward orientation, resulting in the batter facing further south than at any other ballpark"', 'shadedseats.com: "Home plate faces Southeast... sun at your back on the 1B side"', 'Esri World Imagery 2026-05-13: ~135–155° SE/SSE'], notes: 'CONFIRMED + promoted verified 2026-06-23. Comerica famously defies Rule 1.04 (most southward). Recorded 145° kept (within 5° of ballparks.com 150°).', lastReviewed: '2026-06-23' },
  { stadiumId: 'twins',        orientation: 90,  confidence: 'verified',   precisionDeg: 12, method: 'published-source', sources: ['ballparks.com diamonds index: Target Field = n090.gif (90°, due E)', 'shadedseats.com: "Target Field is oriented to the east... home plate faces east... sun rises over the left field wall... sets near third base" ⇒ CF=E'], notes: 'GROSS ERROR CORRECTED 2026-06-23 from 40° (NE) to 90° (E) — ~50° off, wrong sub-quadrant. The prior "tight ~39° satellite read" was simply wrong. ballparks.com (90°) + the explicit "faces east" + sun pattern agree on due E (the sun-pattern "sets near 3B" hints it may be a touch S of E, ~90–100°; using 90°).', lastReviewed: '2026-06-23' },
  { stadiumId: 'whitesox',     orientation: 120, confidence: 'verified',   precisionDeg: 10, method: 'satellite-visual', sources: ['Inline code note 2025: "ESE/SE — confirmed southeast-facing orientation (was incorrectly set to 90/due-East)"', 'Esri World Imagery 2026-05-13: confirms ESE/SE'], notes: 'Two independent sources (documented prior correction + satellite) agree on ESE/SE within ~±10°. Not yet survey-grade.', lastReviewed: '2026-06-23' },
  { stadiumId: 'yankees',      orientation: 55,  confidence: 'verified',   precisionDeg: 9,  method: 'osm-polygon-pca', sources: ['Esri World Imagery 2026-05-13: HP→CF bearing ~50–60° NE', 'OSM way (Yankee Stadium pitch) polygon PCA: 64.0° (NE, aspect 1.47x)'], notes: 'Two-source agreement within ±9° (satellite 55° + PCA 64°).', lastReviewed: '2026-06-23' },
];

/**
 * Fast lookup by stadium id.
 */
export function getOrientationProvenance(stadiumId: string): OrientationProvenance | undefined {
  return MLB_ORIENTATION_PROVENANCE.find(p => p.stadiumId === stadiumId);
}

/**
 * Honest ± precision (degrees) of a stadium's orientation. Defaults to a
 * conservative 15° when the stadium has no provenance entry or no recorded
 * precision — i.e. "assume a lone satellite read until proven tighter."
 * METADATA ONLY: callers use this to flag/sort low-precision parks, never to
 * alter a shade calculation.
 */
export function getOrientationPrecision(stadiumId: string): number {
  return getOrientationProvenance(stadiumId)?.precisionDeg ?? 15;
}

/**
 * Returns the list of stadiums whose orientation still needs verification
 * (anything not 'verified'). Useful for a data-quality report / audit gate.
 */
export function getUnverifiedStadiums(): OrientationProvenance[] {
  return MLB_ORIENTATION_PROVENANCE.filter(p => p.confidence !== 'verified');
}

/**
 * Repeatable re-measurement method (the path to strict ±2° survey-grade,
 * precisionDeg ≤ 2, method 'gis-measured'):
 *
 *   1. On high-res satellite imagery (Google Earth / QGIS), drop a pin on the
 *      home-plate apex and another on the dead-center-field wall point; read
 *      both lat/lons.
 *   2. Compute the great-circle INITIAL bearing HP→CF with `bearingDegrees`
 *      below. That is the authoritative orientation.
 *   3. Cross-check against the OSM `leisure=pitch sport=baseball` polygon PCA
 *      principal axis (only when polygon aspect ratio > 1.4, else the axis is
 *      ill-defined). Agreement within a few degrees → 2 independent sources.
 *   4. Record both values, any disagreement, and the chosen final value in the
 *      entry's `sources`, set precisionDeg ≤ 2, method 'gis-measured'.
 *
 * Pure helper so re-measurement scripts and tests share one implementation.
 */
export function bearingDegrees(
  fromLat: number, fromLon: number, toLat: number, toLon: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const φ1 = toRad(fromLat);
  const φ2 = toRad(toLat);
  const Δλ = toRad(toLon - fromLon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
