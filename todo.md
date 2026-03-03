# Seat-Level Shade Precision (Row-Level Interpolation)

## Tasks

- [x] **Task 1: Create Centralized Row Generator** — Extracted `generateRows()` into `src/utils/rowGenerator.ts` and updated 36 team-name section files to import from it (removed local copies). The 23 stadium-name files kept their custom implementations (different parameters/behavior).

- [x] **Task 2: Add `upperDeckOverhang` to Stadium Interface & Populate Geometry** — Added `upperDeckOverhang` field to `Stadium` interface. Populated `roofHeight`, `roofOverhang`, `upperDeckHeight`, `upperDeckOverhang` for all 30 stadiums with architecture-based values.

- [x] **Task 3: Improve Shadow Calculations to Use Real Geometry** — Added `RowShadowGeometry` interface and optional parameter to `calculateRowShadow()`, `calculateUpperDeckShadowForRow()`, and `calculateRowShadows()`. Uses real `upperDeckHeight` instead of `+40` hardcode, and adds `upperDeckOverhang` as physical offset to shadow reach.

- [x] **Task 4: Fix Timezone in Rows/Shade API** — Passed `stadium.timezone` to `getSunPosition()` and created+passed `stadiumGeometry` to all `calculateRowShadows()` calls in the API endpoint.

- [x] **Task 5: Wire RowDetailView into Section Selection Flow** — Threaded `selectedSectionId` prop from `StadiumPageClient` → `SeatRecommendationsSection` → `SectionList`. Added auto-expand `useEffect` in `SectionList` that enables row-level view when a section is selected via diagram click.

- [x] **Task 6: Verify** — `npx tsc --noEmit` passes with zero errors. `npm run build` succeeds (287 static pages generated).

## Review

### Changes Summary
- **New file:** `src/utils/rowGenerator.ts` (~55 lines) — centralized row generation
- **36 stadium files** — removed local `generateRows()`, added import from utility
- **`src/data/stadiums.ts`** — added `upperDeckOverhang` to interface, populated geometry data for all 30 stadiums
- **`src/utils/sunCalculator.ts`** — added `RowShadowGeometry` interface, threaded through 3 functions, replaced hardcoded `+40` with real data, added `upperDeckOverhang` offset to shadow reach
- **`app/api/stadium/[stadiumId]/rows/shade/route.ts`** — fixed timezone bug, passes stadium geometry to calculations
- **`app/stadium/[stadiumId]/StadiumPageClient.tsx`** — passes `selectedSectionId` to recommendations section
- **`src/components/SeatRecommendationsSection.tsx`** — new `selectedSectionId` prop, forwarded to SectionList
- **`src/components/SectionList.tsx`** — new `selectedSectionId` prop, auto-expands row details on diagram selection

### Notes
- Named the new interface `RowShadowGeometry` (not `StadiumGeometry`) to avoid conflict with the existing `StadiumGeometry` used by the `SunCalculator` class
- The 23 stadium-name section files (e.g., `angel-stadium.ts`, `fenway-park.ts`) have different `generateRows()` implementations with custom parameters, so they kept their local versions
- All new parameters are optional — existing callers continue to work with fallback behavior
