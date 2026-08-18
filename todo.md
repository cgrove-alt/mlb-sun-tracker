# theshadium.com — Sun/Shade Accuracy Audit (2026-08-07)

## Verdict

**Historical audit finding:** the site told users to sit on the sunny side. Three of the four production
shade models have the sun/shade sides **exactly inverted**. All 900 existing
tests pass, because no test ever compared model output against the physical rule
using realistic section data.

## Ground truth (the rule everything must obey)

A grandstand shades its own seats. The stands on the **same compass side as the
sun** are in their own shadow (**shaded**); the stands **across the bowl from the
sun** take the light in the face (**sunny**).

This is not my invention — it is the convention already documented in
`src/utils/sectionSunCalculations.ts` (header), used by `src/utils/shadeSide.ts`
and `app/stadium/[stadiumId]/StadiumPageSSR.tsx`, and confirmed by the sourced
sun-pattern notes already sitting in `src/data/stadiums.ts`:

- Rogers Centre (orientation 0°/N): *"3rd base side is the shade side, 1st base
  side is sunny."* 3B compass = 270° (W) = where the afternoon sun is. ✔
- Guaranteed Rate / Progressive / Busch notes all read *"3B shade side"* for
  parks whose 3B side faces west. ✔
- Matches Wrigley (3B shaded, 1B bakes), Fenway (3B grandstand shaded, CF/RF
  bleachers roast), Oracle Park (1B side shaded in the afternoon).

## Measured evidence

Probe: all 30 MLB parks × 1 PM / 4 PM / 7 PM on 2025-07-15 (87 daylight samples).
For each, compare the section whose compass bearing equals the sun azimuth
(**must be shadier**) against the section 180° opposite (**must be sunnier**).

| # | Model | File | Powers | Correct |
|---|-------|------|--------|---------|
| A | `getSectionSunExposure` | `src/utils/sectionSunCalculations.ts` | stadium-page shade diagram | **30/87** |
| B | `SunCalculator` *as UnifiedApp calls it* | `src/utils/sunCalculator.ts` | homepage MLB section list, MobileApp | **31/87** |
| B′ | `SunCalculator` given correct compass angles | " | " | **1/87** |
| C | `calculateRowShadows`, rows **with** overhang | `src/utils/sunCalculator.ts` | `/api/stadium/*/rows/shade` | **0/87** |
| C | `calculateRowShadows`, rows without overhang | " | " | 29/87 |
| D | `getUnifiedVenueShade` | `src/utils/getUnifiedVenueShade.ts` | homepage shade % + "most shaded first" sort, **all 180+ venues** | **0/87** |

B and B′ differ because UnifiedApp/MobileApp also pass the wrong angle — the two
bugs partially cancel into noise. A scores 30/87 because it is directionally
right but goes flat at high sun (see H-1); it never actually points the wrong way.

## Root cause

There is no single tested primitive for "which side of the bowl is in shade."
Four independent implementations each re-derived it from scratch; three inverted
the sign. Comments in `sunCalculator.ts` and `getUnifiedVenueShade.ts` even
*mislabel* the branches ("Section faces away from sun" on the branch where the
seats face into the sun), which is how the inversion survived review.

The test suite locked in the defect rather than catching it:
`src/utils/__tests__/shadeSanity.test.ts` asserts the correct physical ordering,
but only for sections built with `overhangHeight: 0` — a configuration that does
not exist in the real data (6,877 of 30,551 real MLB rows carry an overhang). On
those synthetic sections model C is right; on every real section it is inverted.

---

## Todo

**Status:** Trust patch complete. The directional physics defect is fixed, and
public seat-level outputs remain withheld until measured stadium geometry
passes an independent validation gate. All 30 MLB section inventories are now
reconciled against current official charts or club-linked venue maps.

### Phase 1 — one source of truth
- [x] 1.1 Add `src/utils/bowlGeometry.ts`: the single documented primitive —
      `sectionCompassAngle()` (moved from `sectionSunCalculations`) plus
      `sunIncidence(sunAz, sectionCompass) → { sunBehindFactor, sunFacingFactor }`,
      continuous, no branch at 90°, with the physics derivation in the header.
- [x] 1.2 Add `src/utils/__tests__/bowlGeometry.test.ts` — sign, continuity,
      symmetry, wrap-around.

### Phase 2 — fix the three inverted models (user-facing, highest impact)
- [x] 2.1 `getUnifiedVenueShade.ts`: swap the inverted branches, rebuild on the
      Phase-1 primitive. (Homepage shade % for every venue.)
- [x] 2.2 `sunCalculator.ts#calculateSectionShadow`: swap the inverted branch;
      delete the false "angles are already absolute compass" comment on
      `getSectionAngle`.
- [x] 2.3 `UnifiedApp.tsx:224` + `MobileApp.tsx:193`: stop passing raw
      stadium-local `baseAngle` as a compass `angle`; use `sectionCompassAngle`.
      Also fix the two different, both-wrong `side` derivations.
- [x] 2.4 `sunCalculator.ts#calculateRowShadows`: swap which regime the overhang
      term belongs to — the deep shade case is *sun behind the section*; the
      *sun-in-your-face* case is back-rows-only under the lip. Keep the
      continuous blend (no 90° discontinuity).

### Phase 3 — the model that points the right way but says nothing
- [x] 3.1 `sectionSunCalculations.ts#getSectionSunExposure`: azimuth
      discrimination currently vanishes at sun altitude ≥ 45°, so at 1 PM and
      4 PM the stadium-page diagram is orientation-blind — every open section
      reads identical. Rebuild on the Phase-1 primitive so azimuth still
      separates sides at high sun, damped but non-zero.
- [x] 3.2 Remove the discontinuity at exactly 90° (adjacent sections currently
      jump ~3× across an invisible seam).

### Phase 4 — row-level data degeneracy
- [x] 4.1 `calculateRowShadows` divides by `Math.max(row.depth, 0.001)`. 647 real
      rows have an overhang and `depth: 0`, so they are pinned to 100% coverage
      whatever the sun does. Treat missing depth as unknown and fall back to the
      section-level answer instead of fabricating full shade.
- [x] 4.2 Audit the 2,310 rows with `depth: 0` — they are valid front-row
      offsets, not missing data. Derive distance behind the overhang lip from
      the section's row set and fall back to section geometry when no positive
      deck depth exists.

### Phase 5 — 3D path (public API `?use3d=true`)
- [x] 5.1 `shadeCalculation3DOptimized.ts#getSunRayDirection` returns the
      direction light *travels* (downward). The occlusion ray is cast from the
      seat along it, i.e. into the ground — a roof above a seat can never
      occlude. Negate it (cast toward the sun).
- [x] 5.2 `estimateSectionShadeQuick`: mixes stadium-local `baseAngle` with
      `sunAz − orientation`, never wraps `angleDiff` to [0,180], and inverts the
      branch. Rebuild on the Phase-1 primitive.

### Phase 6 — unsourced fudge factors
- [x] 6.1 `getUnifiedVenueShade` stacks additive bonuses on top of the physical
      term: upper deck +25/+30, `opened > 2000` +5, retractable +15, and a
      "third base side" +15 applied at **every** park regardless of orientation.
      These can move a section two tiers on no evidence. Remove or ground them.
- [x] 6.2 Weather multiplier conflates UV intensity with geometric shade —
      clouds do not move the shadow line. Separate the two concepts.

### Phase 7 — tests that would have caught this
- [x] 7.1 Replace the synthetic `overhangHeight: 0` sanity sections with **real**
      sections from `getStadiumSections`, all 30 parks × 1 PM/4 PM/7 PM,
      asserting sun-side-shadier for every production entry point.
- [x] 7.2 Pin the published sun-pattern claims from `stadiums.ts` (Rogers Centre
      3B-shade, Chase Field sunrise-over-RF, etc.) as regression tests.
- [x] 7.3 Cross-model consistency test: all four paths must agree on which half
      of the bowl is shaded, for every park and hour.
- [x] 7.4 Re-run the probe; require 87/87 on every model before calling it done.

### Phase 8 — verify
- [x] 8.1 Full `npx jest` green.
- [x] 8.2 `npm run type-check` + `npm run lint` clean (lint has pre-existing
      warnings, zero errors).
- [x] 8.3 Spot-check the rendered site (homepage + Rate Field, Fenway Park,
      and Oracle Park) against the
      published shade guidance for those parks.

### Phase 9 — source the remaining 27 MLB section maps
- [x] 9.1 Replace every generated 65-section team file. The replacements now use
      screen-space placement from club-linked public maps: 20 exact polygon
      charts, three virtual-venue hotspot maps, and four static club charts.
- [x] 9.2 Calibrate each screen map from named behind-home and center-field
      anchors to the park's recorded compass orientation; derive modeled section
      placement from each SVG footprint. These are not surveyed coordinates.
- [x] 9.3 Keep the evidence boundary explicit: section identity and chart order
      are source-backed; screen placement (where available), per-row elevation,
      rake, depth, overhangs, and obstructions remain modeled.
- [x] 9.4 Unify `getStadiumSectionsAsync` with the detailed aggregator so the
      rendered stadium page, homepage, row API, 3-D calculator and audits no
      longer read two drifting MLB datasets.
- [x] 9.5 Add provenance for all 30 parks and inventory/geometry/page-loader
      regression tests for all 27 replacements.

### Phase 10 — trust patch: fail closed at the measurement boundary
- [x] 10.1 Replace the blanket `real` fidelity label with `source-backed` section
      inventory and separate confidence fields for placement, row geometry,
      obstruction geometry, observation validation, and roof state.
- [x] 10.2 Keep the release gate fail-closed until metric geometry and
      independent time-stamped shadow observations pass.
- [x] 10.3 Return HTTP 409 from the public row/3-D shade API for unvalidated
      parks; include conservative status and field-level confidence metadata.
- [x] 10.4 Withhold section percentages, row rankings, legacy shade tips, and
      the interactive color model on the stadium page and desktop/mobile finder.
- [x] 10.5 Publish only `verified-shaded`, `verified-sun`, `uncertain`, or
      `roof-state-dependent` states, with permanent-roof/nighttime conclusions
      kept separate from unvalidated row geometry.
- [x] 10.6 Replace public copy and structured-data overclaims with prominent
      measurement notices and conservative planning guidance.
- [x] 10.7 Run the full suite, strict audits, production build, API probes, and
      rendered desktop/mobile browser checks before declaring the patch complete.

### Phase 11 — live Internet source reconciliation
- [x] 11.1 Re-scrape the live club-linked viewers. De-duplicate the Twins'
      responsive SVG copies (162 products, not 324) and preserve official
      labels plus published row/seat manifest counts where available.
- [x] 11.2 Add read-only extractors for IOMEDIA hotspot maps and Sportsdigita
      JSON5/SVG paths. Integrate Atlanta (273), Arizona (149), Seattle (169),
      and Colorado (190) without inferring roofs or overhangs from map pixels.
- [x] 11.3 Render and visually inspect Toronto's official 2026 PDF, then replace
      the incomplete 124-entry model with all 252 published numbered products,
      including the 300/400 suite levels.
- [x] 11.4 Reconcile the Athletics, Giants, and Padres static charts; remove
      invented/obsolete IDs and restore published premium and suite levels.
- [x] 11.5 Preserve source mismatches as evidence before replacement: Fenway's
      viewer has 483 ticket products, 401 direct product polygons, 82 Field Box
      subdivision aliases, and 15 non-ticket overlays; Yankee Stadium has 222
      live products versus 184 obsolete legacy entries.
- [x] 11.6 Add an explicit inventory reconciliation status to provenance, expose
      it in the trust notice/API metadata, and require `reconciled` inventory in
      addition to measured geometry and observation validation before exact
      shade can ever be published.
- [x] 11.7 Replace Fenway with all 483 live products, Yankee Stadium with all
      222 live zero-padded/accessibility products, and Rate Field with the 132
      numbered/named products on its current chart. Do not infer coverage from
      their screen polygons.
- [x] 11.8 Reconcile Petco Park's numbered sections with the stable suite types
      on the official suite site and the small suite/party codes printed on its
      static chart. Do not confuse event-specific suite availability with a
      permanent section inventory.
- [x] 11.9 Replace the literal on-site/survey-only boundary with an evidence
      gate that accepts remote metric reconstruction while preserving quantified
      uncertainty and independent shadow-observation requirements.

### Phase 12 — remote metric geometry acquisition
- [x] 12.1 Add executable evidence stages and conservative release thresholds:
      complete metric coverage, no more than one foot horizontal/vertical and
      one degree orientation uncertainty, plus a 30-observation holdout across
      three dates and a 25-degree solar-altitude span. The strict stadium audit
      now rejects broken source references, unsupported measured stages,
      missing artifact versions, and invalid holdout claims.
- [x] 12.2 Add a reproducible USGS TNM lidar discovery audit. On 2026-08-07 it
      found centre-covering tiles for all 29 U.S. MLB parks with zero request
      failures. The 2026-08-08 correction now groups tiles by the official
      project URL and requires a same-project union to cover at least 99.9% of a
      conservative 700-foot footprint; all 29 U.S. parks have at least one
      complete-footprint candidate, though many complete acquisitions are old.
      Toronto is correctly routed outside USGS jurisdiction.
- [x] 12.3 Download and inspect Petco's official 2014 USGS point cloud. The
      8,278,730-point source resolves the bowl/decks; a reproducible extractor
      produced a provenance-stamped 61,283-cell candidate heightfield and kept
      `publication.eligible=false`.
- [x] 12.4 Register the City of Toronto's licensed citywide 3-D massing dataset
      as an exterior/roof candidate for Rogers Centre, preserve the city's
      precision/fitness disclaimer, and do not pretend it exposes the closed
      building's interior rows.
- [x] 12.5a Add a reproducible Petco surface audit using the real flight-line
      IDs. The unit-correct v2 298,603-return footprint has 32.63% one-foot sampling coverage,
      3.19% two-flight-line coverage at that scale, and explicitly candidate-
      only connected surface components.
- [x] 12.5b Audit official post-2014 changes and add geometry currency as an
      independent hard release gate. Petco's 2014 source is marked stale after
      documented 2015 left-field, 2016 right-center, 2024 Gallagher Square, and
      2025 Western Metal work.
- [x] 12.5c Build an official MLB highlight-to-play candidate pipeline with
      stadium-local dates, solar positions, independent source keys, explicit
      review blockers, and repeatable frame sampling. The eight-game Petco
      pilot produced 107 candidates covering 105 independent play events across
      eight local dates, now with official media assets and a weather-aware
      review queue. Alternate edits share an independence key. Five clips were
      correctly rejected; the best current wide shot shows tier-scale shadows
      but cannot resolve an unambiguous row boundary or camera/time control.
- [ ] 12.5d Acquire current metric coverage for the changed Petco structures,
      independently control the stadium frame, produce reviewed semantic
      row/obstruction meshes, and pass the timestamped broadcast/photo holdout.
- [ ] 12.6 Repeat the measured-artifact and holdout pipeline park by park,
      prioritizing recent high-density lidar candidates and open-air venues.
- [x] 12.6a Make discovery and extraction multi-tile and unit-safe. The audit
      rejects centre-only/partial projects, while both lidar scripts hash every
      tile, validate matching CRS/units, and convert metres or U.S. survey feet
      explicitly before any stadium-centred calculation.
- [x] 12.6b Run the next open-air pilots without promotion. Angel Stadium's 2023
      QL1 project covers only 67.86% of the audit footprint and its rendered
      eastern bowl is truncated. Dodger Stadium's complete two-tile 2023 source
      has 92.83% one-foot sampling and 69.06% two-flight-line coverage, but no
      stadium-surface horizontal control, semantic row/obstruction mesh, current
      whole-scope geometry, or observation holdout. Both remain fail-closed.
- [x] 12.6c Audit the official 2024-2025 Philadelphia QL1 tile without promotion.
      The clean 163,167,866-byte source decompresses to all 28,721,465 declared
      points and the stadium footprint contains 3,479,061 non-noise returns from
      2024-12-17 and 2025-04-02 passes. It achieves 95.60% one-foot sampling and
      68.36% one-foot two-flight-line coverage, with 0.295 ft p95 stable-surface
      flight-line disagreement. The source is still stale for exact publication
      because the club documented an expanded team-store footprint and five new
      25-foot LED towers for 2026. Semantic rows, current obstruction deltas, and
      an independent shadow holdout also remain unproved.

---

## Review

### What changed

- Added `bowlGeometry.ts` as the one coordinate/physics source for compass
  conversion, continuous sun incidence, shadow reach, rim occlusion, structural
  shade, and direct-sun percentage.
- Refit the homepage, mobile, venue diagram, row API, and optimized 3D paths to
  that primitive. Stadium orientation is no longer discarded by passing a
  local `baseAngle` as an absolute compass angle.
- Corrected the 3D ray direction and coordinate frame, normalized obstruction
  bounding boxes, and combined ray-cast obstructions with the bowl's own
  structural self-shading.
- Replaced invented venue bonuses with geometry and separated geometric shade
  from weather-damped effective sunlight.
- Added all-park, real-production-data direction tests, published-guidance
  regressions, cross-model agreement checks, and route-level sign coverage.

### Verification

| Check | Result |
|---|---|
| `npm test -- --runInBand` | ✅ 1,037 / 1,037, 36 suites |
| Row shade route trust gate | ✅ 2-D + 3-D withheld; no section payload; 409 is `no-store` at production runtime |
| `npm run type-check` | ✅ exit 0 |
| `npm run lint` | ✅ exit 0; existing warnings only |
| `npm run validate-stadium-data` | ✅ 6,727 MLB sections; no hard data errors |
| `npm run build` | ✅ 460 static pages generated |
| `npm run test:local` | ✅ 10 / 10 accessibility, mobile-overflow, console, asset, and trust-boundary checks |
| Browser smoke check | ✅ desktop/mobile stadium + finder trust states; no console errors |

### Remaining precision boundary

All 30 MLB parks now carry source-backed, reconciled section identities. Screen
placement, row, overhang, and obstruction geometry remains modeled unless a
remote evidence entry says otherwise. The strict audit reports
`source-backed=30`, `approximate=0`, and no duplicate section files.
The public charts do **not** provide metric elevation, rake, row depth or
roof/overhang meshes. USGS lidar and municipal 3-D data now provide a remote
acquisition route, but source discovery is not measurement validation. Those
calculator inputs stay withheld until extraction uncertainty and independent
observations pass `src/data/stadiumGeometryEvidence.ts`.
