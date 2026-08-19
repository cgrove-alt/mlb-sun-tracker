# Shade Diagram — Future Backlog (restore MiLB/NFL coverage)

**Status:** documented, out of scope for the current build. This is a **data project**,
not a UI change.

## Context
The interactive section-level shade diagram (`InteractiveSeatingBowl`) is MLB-only. It was
removed from the 152 MiLB + NFL venue pages in Phase 3B because those venues' data can't
support a trustworthy section-level shade call (see the Phase 3A data-honesty assessment).
MiLB/NFL pages fall back to their structural section/guide content, which is
orientation-independent and honest. Restoring the diagram there requires fixing the data
below — do NOT re-enable the diagram for a league until its item is complete and re-verified.

## Backlog items

### 1. NFL — measure real stadium orientations (done 2026-08-18)
- **Was:** 14 of 32 NFL venues had `orientation: 0` as an unset default; several others
  were leftover E-W / previous-building values (SoFi 90°, U.S. Bank 88° / TCF, Lambeau 45°,
  Mercedes-Benz 0° / Georgia Dome, AT&T 340° perpendicular).
- **Now:** every franchise id has a row in `nflOrientationProvenance.ts`. Open-air parks
  are multi-source (OSM pitch PCA + Bliss azimuth, plus vizual-statistix where the 2015
  building still exists). `0°` remains only where the field is actually N–S (Highmark 2026,
  Empower, Lambeau, Raymond James, Lumen). Highmark lat/lon/capacity/opened moved to the
  2026 stadium west of Abbott Road.
- **Still not done:** this does **not** unlock NFL section-level shade %. Official
  section IDs are now sourced; row/3-D geometry is still modeled. See item 2.

### 2. NFL — fix the section angle convention (done 2026-08-18)
- **Was:** live math ran every football `baseAngle` through the baseball
  `(orientation + 90 − local)` converter, rotating every NFL bowl.
- **Now:** `sectionAngleConventionFor` uses `compass-from-north` for NFL / football.
  Club-linked IOMEDIA / official static charts replaced the generic 101–136 ring
  for every franchise id. Still do **not** publish section % — unmeasured bowl
  geometry and the venue publication gate remain.

### 3. MiLB — build real per-venue section layouts (blocking)
- **Orientations (done 2026-08-18):** every MiLB id has a row in
  `milbOrientationProvenance.ts`. Coordinates were re-pinned to the current 2026 home
  (MLB Stats API / Wikipedia / Nominatim) — leftover venueIds still pointed at Kodak
  Smokies Stadium, Smith's Ballpark, Trustmark Park, Polar Park-as-DCU-Center, and
  Coolray-as-airport. HP→CF was read from north-up Esri tiles; Clem / Harbor Park /
  First Horizon published bearings lock the verified AAA subset. `0°` remains only
  where CF actually faces north (Syracuse, Rome, Lansing).
- **Still blocking diagrams:** the live path no longer emits `generateBaseballSections`
  or Field-100 clones. Parks without a transcribed official chart now return empty
  (fail closed). Ninety-two parks have source-backed inventories (Aberdeen, Akron,
  Albuquerque [partial], Altoona, Amarillo, Arkansas, Asheville, Beloit, Biloxi,
  Birmingham, Bowling Green, Bradenton, Brooklyn, Buffalo, Cedar Rapids, Charleston,
  Charlotte, Clearwater, Columbia, Columbus Clippers, Corpus Christi, Dayton,
  Delmarva, Durham, Erie, Everett, Fayetteville, Fort Myers, Fort Wayne [partial],
  Fredericksburg, Fresno [partial], Frisco, Great Lakes, Greensboro [partial],
  Greenville, Gwinnett, Harrisburg, Hartford, Hickory, Hillsboro, Hudson Valley,
  Indianapolis [partial], Inland Empire, Iowa, Jacksonville, Jersey Shore,
  Kannapolis [partial], Knoxville, Lakeland, Las Vegas, Lehigh Valley, Louisville,
  Lynchburg, Memphis [partial], Midland [partial], Montgomery, Myrtle Beach,
  Nashville, New Hampshire [partial], Norfolk, Northwest Arkansas, Oklahoma City,
  Omaha [partial], Pensacola, Peoria, Portland, Rancho Cucamonga, Reading,
  Richmond, Rocket City, Rome, Round Rock [partial], Sacramento, Salem, Salt Lake,
  San Jose, Scranton/Wilkes-Barre, Somerset, Springfield, St. Lucie, St. Paul,
  Stockton, Sugar Land, Syracuse, Tacoma [partial], Tampa, Toledo,
  Vancouver [partial], Visalia, Winston-Salem [partial], Wisconsin,
  Worcester [partial]). The other 28 still need official chart IDs — do **not**
  fill them with a template. Do **not** publish section %.
- **Work remaining:** transcribe the remaining official club charts / maps into
  `MILB_OFFICIAL_INVENTORIES` the same way, unique except shared bowls (Roger Dean).
- **Done when:** all 120 MiLB ids have real, non-template sections + measured
  orientation; the coverage script passes with official (not generated) data.

### 4. Re-enable + verify (per league, after its data is fixed)
- Gate the diagram on a data-quality check (real per-venue sections AND measured, non-default
  orientation). Re-run: the reconciliation invariant test, curl SSR proof, a per-league
  worked example vs known reality, and mobile Lighthouse. Only ship where it passes.

## Guardrails to preserve
- The reconciliation invariant (`src/utils/sectionShadeTier.ts` + the invariant test) must
  keep passing: the diagram never shows more sun than the section table's structural tier.
- Fixed domes → all shaded; retractable → dynamic with the open-roof note; estimated
  orientation → the lower-confidence note.
- Visual honesty: section-level label, discrete zones, the "actual shade varies by row,
  overhang, and weather" note, evening default. No fake row-level precision.
