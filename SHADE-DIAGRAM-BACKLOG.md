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

### 1. NFL — measure real stadium orientations (blocking)
- **Problem:** 14 of 32 NFL venues have `orientation: 0` (an unset default); the rest are
  ungraded (no provenance). With a wrong/absent orientation the sun-vs-shade call is invalid.
- **Work:** measure HP→CF-equivalent (field long-axis) bearing for all 32 NFL venues from
  satellite imagery (Esri/OSM), record in a provenance file like
  `stadiumOrientationProvenance.ts` with `precisionDeg` + source count.
- **Done when:** 0 venues at the default; each has a documented confidence.

### 2. NFL — fix the section angle convention (blocking)
- **Problem:** `NFL_SECTIONS` `baseAngle` is documented as "angle from north (0-360)", a
  different convention than the baseball stadium-local frame (`0=1B … 270=HP`) that
  `sectionCompassAngle` / `getSectionSunExposure` assume. Feeding NFL angles into the
  baseball model mis-rotates every section.
- **Work:** either convert NFL section angles to the stadium-local convention, or add an
  NFL-aware compass mapping and select it by venue type.
- **Done when:** an NFL worked example (verified orientation) matches known reality.

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
