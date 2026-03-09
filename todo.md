# Site Audit: Shade Calculation Fixes & UX Improvements

## Phase 1: Calculation Bug Fixes

- [x] **1.1** Fix double-counting stadiumOrientation in `calculateRowShadow()` — remove `+ stadiumOrientation` from sectionAngle calc in both `sunCalculator.ts:523` and `sunCalculations.worker.js:154`
- [x] **1.2** Fix retractable roof logic — update comment in `sunCalculator.ts:283-298`, replace flat `-15` penalty in worker with overhang-based shadow calc
- [x] **1.3** Fix worker `calculateUpperDeckShadowForRow()` — add `stadium` param, use `stadium.upperDeckHeight`/`stadium.upperDeckOverhang` when available
- [x] **1.4** Remove `console.log` in `StadiumPageClient.tsx:57-62`
- [x] **1.5** Add `@deprecated` to dead `calculateSunnySections` function in `sunCalculations.ts:73-142`

## Phase 2: UX Improvements

- [x] **2.1** Reorder stadium page: Shade Summary > Diagram > FindMyShade > Recommendations > Guide > DataFreshness
- [x] **2.2** Create `ShadeSummaryBanner.tsx` — compact at-a-glance shade stats from existing shadeData
- [x] **2.3** Enhance tooltip on diagram — reorder text, add SVG drop shadow filter, increase tooltip rect size
- [x] **2.4** Default time slider to current hour if daytime (10–21), else 13
- [x] **2.5** Add shade timeline to `SectionDetailSheet` — 3-block timeline at game start, +1.5hr, +3hr

## Phase 3: Minor Polish

- [x] **3.1** Update FindMyShade trigger text to "Find My Perfect Shade Seat"

## Review

### Changes Summary

**New file (1):**
1. `src/components/ShadeSummaryBanner.tsx` — Compact at-a-glance shade banner showing average shade score, % of sections in shade, best shade section, and sun direction. Derived from existing `shadeData` array with no new API calls.

**Modified files (7):**

1. `src/utils/sunCalculator.ts` — **Bug fix:** Removed `+ stadiumOrientation` from `calculateRowShadow()` sectionAngle (baseAngle is already absolute). **Bug fix:** Clarified retractable roof comment to document OPEN model (was misleading "assume closed").

2. `public/workers/sunCalculations.worker.js` — **Bug fix:** Removed `+ stadiumOrientation` from `calculateRowShadow()` (parity with TS). **Bug fix:** Replaced flat `-15` retractable roof penalty with proper overhang trig matching `sunCalculator.ts`. **Bug fix:** Added `stadium` param to `calculateUpperDeckShadowForRow()` to use real `upperDeckHeight`/`upperDeckOverhang` instead of always falling back to heuristic.

3. `app/stadium/[stadiumId]/StadiumPageClient.tsx` — Removed debug `console.log`. Added `ShadeSummaryBanner` import + rendering. Reordered page: Banner > Diagram > FindMyShade > Recommendations > Guide > DataFreshness. Added `getDefaultGameHour()` for smart time default. Passed new shade timeline props to `SectionDetailSheet`.

4. `src/utils/sunCalculations.ts` — Added `@deprecated` JSDoc to `calculateSunnySections()` pointing to `calculateDetailedSectionSunExposure`.

5. `src/components/StadiumDiagram/SectionPolygon.tsx` — Tooltip reordered: shade % shown first and larger. Tooltip rect widened (40→50) and taller (22→26). Uses `filter="url(#tooltip-shadow)"` for drop shadow.

6. `src/components/StadiumDiagram/StadiumDiagram.tsx` — Added `<defs>` with `<filter id="tooltip-shadow">` SVG drop shadow.

7. `src/components/SectionDetailSheet.tsx` — Added shade timeline: 3 blocks showing shade % at game start, +1.5hr, +3hr. Uses `getSunPosition()` + section angle for each time point. New optional props: `gameHour`, `stadiumLat`, `stadiumLng`, `stadiumTimezone`, `sectionBaseAngle`.

8. `src/components/FindMyShade/FindMyShadeWizard.tsx` — Trigger text updated to "Find My Perfect Shade Seat".

### Verification
- `npx tsc --noEmit` — zero TypeScript errors
- `npm run build` — production build succeeds (548 files compressed)
- Audit confirmed worker ↔ TS parity on all 3 critical calculation fixes
