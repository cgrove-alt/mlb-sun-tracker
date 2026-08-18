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
- **Still not done:** this does **not** unlock NFL section-level shade %. Section rings
  are still generic. See item 2 (convention already fixed) and the seating-geometry work.

### 2. NFL — fix the section angle convention (done 2026-08-18)
- **Was:** live math ran every football `baseAngle` through the baseball
  `(orientation + 90 − local)` converter, rotating every NFL bowl.
- **Now:** `sectionAngleConventionFor` uses `compass-from-north` for NFL / football.
  Still do **not** publish section % — generic rings plus unmeasured bowl geometry.

### 3. MiLB — build real per-venue section layouts (blocking)
- **Problem:** MiLB sections come from `generateBaseballSections`, a single generic template
  emitted identically for all 120 venues; positions are not measured. Orientations are also
  mostly shared defaults (28 unique across 120).
- **Work:** author per-venue MiLB section geometry (angular position + coverage) like the
  MLB `stadiumSections-split/*` files, and measure per-venue orientations.
- **Done when:** MiLB venues have real, non-template sections + measured orientation; the
  `baseAngle/angleSpan` coverage script passes with real (not generated) data.

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
