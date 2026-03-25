# The Shadium — Comprehensive Rebuild Plan

**Date:** 2026-03-24
**Current version:** 0.2.0
**Repo root:** `/projects/mlb-sun-tracker`
**Branch for this plan:** `rebuild-plan`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Codebase Audit](#2-current-codebase-audit)
3. [Bug Audit: Sun Math](#3-bug-audit-sun-math)
4. [Architecture](#4-architecture)
5. [UX Redesign](#5-ux-redesign)
6. [Data Model](#6-data-model)
7. [Data Requirements](#7-data-requirements)
8. [Implementation Phases](#8-implementation-phases)
9. [Multi-League Adapter Pattern](#9-multi-league-adapter-pattern)
10. [Testing Strategy](#10-testing-strategy)
11. [Appendix A: Stadium Orientation Reference Data](#appendix-a-stadium-orientation-reference-data)
12. [Appendix B: Key Library Recommendations](#appendix-b-key-library-recommendations)
13. [Appendix C: MLB Stats API Integration](#appendix-c-mlb-stats-api-integration)

---

## 1. Executive Summary

The Shadium is a Next.js 15 application that helps fans find shaded seating at MLB stadiums. The core concept is sound and the existing scaffolding (routing, stadium data, section data, NREL SPA implementation) is a solid foundation. However, four categories of problems prevent the app from delivering reliably accurate shade predictions:

**Problem 1 — Broken sun math.** There are at least five separate, mutually inconsistent exposure formulas across four files. The primary path (`sectionSunCalculations.ts`) uses a linear elevation factor (`altitude/90`) instead of the physically correct `sin(altitude)`, then patches the error with a `middayBoost` multiplier. The result is that midday exposure is over-reported and late-afternoon exposure is under-reported.

**Problem 2 — Timezone confusion on the server.** `getSunPosition` and `SunCalculator.calculateSunPosition` both attempt to correct for the difference between "browser timezone" and "stadium timezone". On the server (Next.js API routes, SSG), `Date.getTimezoneOffset()` returns the *server's* offset (UTC = 0), not the browser's, so the correction produces wrong UTC times fed to NREL SPA, potentially shifting sun position by several hours.

**Problem 3 — Dead-code fallback formula.** `stadiumDataServer.ts::calculateShadePercentage` (used by the `/api/stadium/[stadiumId]/shade` route) never calls NREL SPA at all. It uses hardcoded `sunAngle = isSummer ? 70 : 45` and a lookup table of additive shade percentages. This is the path hit by the main stadium page on first load.

**Problem 4 — No real UX flow.** The current homepage routes to static stadium pages with complex filter drawers. There is no clear League → Stadium → Game → Seat picker. Mobile users face 8+ UI panels (filter drawer, shade wizard, time slider, comparison tool, row detail view, etc.) with inconsistent state.

The rebuild fixes all four problems and ships a clean, verifiable product.

---

## 2. Current Codebase Audit

### 2.1 File Map of Sun Calculation Code

```
src/utils/
├── nrelSolarPosition.ts        650 lines — NREL SPA (correct, keep)
├── sunCalculations.ts          555 lines — public getSunPosition(), exposure helpers
├── sunCalculator.ts            750 lines — SunCalculator class + row-level calcs
├── sectionSunCalculations.ts    95 lines — isSectionInSun(), getSectionSunExposure()  ← PRIMARY BUGS
├── stadiumDataServer.ts        200 lines — calculateShadePercentage() (server, used by API) ← DEAD FORMULA
├── shadeCalculation3DOptimized.ts 562 lines — BVH ray tracer (unused in prod paths)
├── shadeScore.ts                87 lines — 1-10 shade score (correct, keep)
└── stadiumTimezone.ts          195 lines — getTimezoneOffset(), createStadiumDate()
```

### 2.2 Live Call Graph for `/stadium/[id]` Page Load

```
StadiumPage (RSC)
  └── GET /api/stadium/[stadiumId]/shade?month=7&hour=13
        └── calculateShadePercentage()          ← stadiumDataServer.ts:23
              Uses hardcoded sunAngle (NOT NREL)
              Uses additive shade table
              Returns plausible-looking but wrong numbers

StadiumClient (client component)
  └── calculateDetailedSectionSunExposure()    ← sunCalculations.ts:149
        └── isSectionInSun()                   ← sectionSunCalculations.ts:7
        └── getSectionSunExposure()             ← sectionSunCalculations.ts:38
              elevationFactor = altitude / 90   ← BUG: should be sin(altitude)
              middayBoost = 1.4 when alt > 60   ← HACK to compensate
```

### 2.3 Key Dependencies

| Package | Version | Role |
|---------|---------|------|
| `suncalc` | 1.9.0 | Sun times (sunrise/sunset), fallback position |
| `date-fns-tz` | 3.2.0 | Timezone-aware date formatting (underused) |
| `three` | 0.178.0 | 3D BVH (unused in critical path) |
| `next` | 15.5.7 | App Router, RSC, API routes |
| `typescript` | 5.0 | Type safety |

---

## 3. Bug Audit: Sun Math

### Bug 1 — Wrong Elevation Factor (Linear vs. Sin)

**File:** `src/utils/sectionSunCalculations.ts`, line 49

**Current code:**
```typescript
// sectionSunCalculations.ts:47-51
// Base exposure calculation based on sun elevation
const elevationFactor = Math.min(sunElevation / 90, 1); // Normalize to 0-1, cap at 1
```

**What it does:** Divides the elevation angle in degrees by 90 to get a 0–1 factor. This is a linear model.

**Why it's wrong:** Solar irradiance on a surface is proportional to `sin(elevation)`, not `elevation/90`. The error is significant:

| Sun Elevation | Current (linear) | Correct (sin) | Error |
|---------------|-----------------|---------------|-------|
| 10°           | 0.111           | 0.174         | −36%  |
| 30°           | 0.333           | 0.500         | −33%  |
| 45°           | 0.500           | 0.707         | −29%  |
| 60°           | 0.667           | 0.866         | −23%  |
| 90°           | 1.000           | 1.000         | 0%    |

At a typical 3pm game in July (sun ~55°), the current formula under-estimates exposure by ~26%, making sections appear shadier than they are.

**Fix:**
```typescript
// BEFORE (sectionSunCalculations.ts:49)
const elevationFactor = Math.min(sunElevation / 90, 1);

// AFTER
const elevationFactor = Math.sin(sunElevation * Math.PI / 180);
```

Note: `Math.sin` takes radians, so `sunElevation` (degrees) must be converted. The value naturally clamps to [0, 1] for valid sun altitudes (0–90°).

---

### Bug 2 — The `middayBoost` Hack

**File:** `src/utils/sectionSunCalculations.ts`, lines 81–91

**Current code:**
```typescript
// sectionSunCalculations.ts:80-91
// Enhance exposure for high sun angles (midday sun is stronger)
let middayBoost = 1.0;
if (sunElevation > 60) {
  middayBoost = 1.4; // Strong midday sun
} else if (sunElevation > 45) {
  middayBoost = 1.25; // Moderate afternoon sun
} else if (sunElevation > 30) {
  middayBoost = 1.1; // Lower angle sun
}

// Combine all factors with adjusted formula for more realistic values
const exposure = elevationFactor * angleFactor * levelMultiplier * middayBoost * coverageReduction * 100;
```

**Why it's wrong:** This is a compensating hack for the linear elevation factor bug. When `elevationFactor = alt/90` produces too-low values at high angles, `middayBoost = 1.4` inflates them back up. But:

1. At 90° elevation: `1.0 * 1.0 * 1.0 * 1.4 = 1.4`, then `* 100 = 140` — clamped to 100. The boost can push the output past 100 before clamping, losing information about how far over 100 we are.
2. The boost thresholds (30°, 45°, 60°) are arbitrary and discontinuous — they cause sudden jumps in exposure as sun crosses each threshold.
3. With the correct `sin(elevation)` factor, no boost is needed: `sin(90°) = 1.0`, which already represents full overhead sun.

**Fix:** Remove `middayBoost` entirely after fixing the elevation factor.

```typescript
// AFTER — no middayBoost needed
const exposure = elevationFactor * angleFactor * levelMultiplier * coverageReduction * 100;
```

---

### Bug 3 — Timezone Correction Breaks Server-Side Calculations

**File:** `src/utils/sunCalculations.ts`, lines 34–40
**File:** `src/utils/sunCalculator.ts`, lines 126–132

**Current code in `sunCalculations.ts`:**
```typescript
// sunCalculations.ts:34-40
let correctedDate = date;
if (timezone) {
  const browserOffsetHours = -date.getTimezoneOffset() / 60;
  const stadiumOffsetHours = getTimezoneOffset(date, timezone);
  const correctionMs = (browserOffsetHours - stadiumOffsetHours) * 3600000;
  correctedDate = new Date(date.getTime() + correctionMs);
}

// Then passed to NREL SPA:
const result = computeSunPosition(correctedDate, latitude, longitude, 0);
```

**Current code in `sunCalculator.ts`:**
```typescript
// sunCalculator.ts:126-132
if (this.stadium.timezone) {
  const browserOffsetHours = -dateTime.getTimezoneOffset() / 60;
  const stadiumOffsetHours = getTimezoneOffset(dateTime, this.stadium.timezone);
  const correctionMs = (browserOffsetHours - stadiumOffsetHours) * 3600000;
  correctedDate = new Date(dateTime.getTime() + correctionMs);
}
```

**Why it's wrong:** `Date.getTimezoneOffset()` returns the *environment's* UTC offset (the browser's if running client-side, the *server's* if running in Node.js/Next.js API routes). On Vercel, the server runs in UTC, so `date.getTimezoneOffset()` returns `0`. The formula then computes:

```
correctionMs = (0 - stadiumOffsetHours) * 3600000
```

For a 1pm ET game (UTC−4 in summer): `correctionMs = (0 - (-4)) * 3600000 = +4h`

The corrected date becomes `1pm + 4h = 5pm UTC`, then fed to NREL as if computing for 5pm rather than 1pm local. This shifts the sun position by 4 hours, placing the sun in a completely wrong part of the sky.

**The NREL SPA signature confirms this:**
```typescript
// nrelSolarPosition.ts:46-47
* @param timeZoneOffset - Unused — function uses date.getUTC*() directly. Pass 0.
export function computeSunPosition(date: Date, latitude, longitude, timeZoneOffset, ...)
```

NREL SPA reads UTC components from the `Date` object directly. To get the sun position at "1pm stadium local time", the caller must pass a `Date` whose UTC value equals 1pm local time *converted to UTC* using the stadium's actual offset — not the browser's.

**Fix:** Use `date-fns-tz::zonedTimeToUtc` or `Temporal.ZonedDateTime` to construct the correct UTC instant from a local time string + IANA timezone. No runtime correction is needed afterward.

```typescript
// BEFORE (sunCalculations.ts:34-44)
let correctedDate = date;
if (timezone) {
  const browserOffsetHours = -date.getTimezoneOffset() / 60;
  const stadiumOffsetHours = getTimezoneOffset(date, timezone);
  const correctionMs = (browserOffsetHours - stadiumOffsetHours) * 3600000;
  correctedDate = new Date(date.getTime() + correctionMs);
}
const result = computeSunPosition(correctedDate, latitude, longitude, 0);

// AFTER
// Caller is responsible for passing a Date whose .getTime() represents the
// correct UTC instant. Use createStadiumDate() to construct it:
//   const gameDate = createStadiumDate('2026-07-04 13:00:00', stadium.timezone);
// Then call getSunPosition(gameDate, lat, lon) — no timezone arg needed.
const result = computeSunPosition(date, latitude, longitude, 0);
```

The correct fix is to push timezone conversion upstream: `createStadiumDate()` in `stadiumTimezone.ts:47` already does this correctly (lines 68–74). All callers should use `createStadiumDate()` to build the Date, then pass that Date to `getSunPosition` without the `timezone` arg.

---

### Bug 4 — `stadiumDataServer.ts` Never Calls NREL SPA

**File:** `src/utils/stadiumDataServer.ts`, lines 38–113
**Called by:** `app/api/stadium/[stadiumId]/shade/route.ts`, lines 55 and 74

**Current code:**
```typescript
// stadiumDataServer.ts:38-43
// Calculate sun angle based on month (more accurate calculation)
const summerMonths = [5, 6, 7, 8];
const isSummer = summerMonths.includes(month);
const sunAngle = isSummer ? 70 : 45; // Degrees above horizon

// ...

// stadiumDataServer.ts:72-79
let sunAzimuth = 0;
if (hour < 12) {
  sunAzimuth = 90 + (hour - 6) * 15; // East in morning
} else if (hour < 18) {
  sunAzimuth = 180 + (hour - 12) * 15; // South to West in afternoon
} else {
  sunAzimuth = 270 + (hour - 18) * 10; // West in evening
}
```

**Why it's wrong:**

1. `sunAngle = isSummer ? 70 : 45` — The actual sun altitude at 1pm varies from ~20° (Seattle in March) to ~80° (Miami in July). A single hardcoded value per season is incorrect for every stadium except one at the exact latitude this was calibrated for.

2. The azimuth formula `90 + (hour - 6) * 15` assumes the sun sweeps 15°/hour uniformly from due east. The actual azimuth depends on latitude, date, and equation of time. At solar noon in July in Chicago, the sun is due south (~180°), not at `180 + (12-12)*15 = 180` by coincidence — but at other latitudes and times the formula is significantly wrong.

3. No stadium location or orientation is used in these calculations. `Dodger Stadium` at lat 34°N and `Fenway Park` at lat 42°N get identical sun angles.

4. This function is the one actually hit by the production API — the NREL SPA code is only reached in the client-side component, which loads after the initial page render.

**Fix:** Replace `calculateShadePercentage` entirely. The API route should call the same `getSunPosition` → `getSectionSunExposure` pipeline used client-side, passing actual lat/lon/date from the stadium record.

---

### Bug 5 — Multiple Conflicting `altitude/30` Linear Factors

**Files:** `src/utils/sunCalculator.ts`, lines 239–243 and 528–529

**Current code:**
```typescript
// sunCalculator.ts:239-243 — in calculateSectionShadow()
// Apply altitude factor (low sun = less exposure)
if (sunAltitude < 0) {
  baseSunExposure = 0;
} else if (sunAltitude < 30) {
  baseSunExposure *= (sunAltitude / 30);
}

// sunCalculator.ts:527-529 — in calculateRowShadow() / step 3
// 3. Apply altitude factor (low sun = less exposure)
if (sunAltitude < 30) {
  baseSunExposure *= (sunAltitude / 30);
}
```

**Why it's wrong:** This is a third separate altitude-factor formula — a piecewise linear that applies a reduction only below 30°. Above 30° it's 1.0 (no factor), below 30° it linearly drops. This creates a discontinuity at 30° and contradicts both the `elevation/90` formula in `sectionSunCalculations.ts` and the correct `sin(altitude)` used in `sunCalculations.ts:491`. The codebase now has three different altitude models in active use simultaneously.

**Fix:** Centralize into a single `altitudeFactor(deg: number): number` helper in `nrelSolarPosition.ts` or a new `sunMath.ts`:

```typescript
// sunMath.ts
export function altitudeFactor(altitudeDeg: number): number {
  if (altitudeDeg <= 0) return 0;
  return Math.sin(altitudeDeg * Math.PI / 180); // physically correct
}
```

---

### Bug Summary Table

| # | File | Line(s) | Bug | Severity |
|---|------|---------|-----|----------|
| 1 | `sectionSunCalculations.ts` | 49 | `altitude/90` instead of `sin(altitude)` | High |
| 2 | `sectionSunCalculations.ts` | 81–91 | `middayBoost` hack compensating for Bug 1 | High |
| 3 | `sunCalculations.ts` | 34–40 | Browser-offset correction breaks server-side | Critical |
| 3b | `sunCalculator.ts` | 126–132 | Same browser-offset bug in class | Critical |
| 4 | `stadiumDataServer.ts` | 38–113 | Hardcoded sun angles, never calls NREL | Critical |
| 5 | `sunCalculator.ts` | 239–243, 528 | Third conflicting altitude factor | Medium |

---

## 4. Architecture

### 4.1 Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                    │
│                                                             │
│  app/                                                       │
│  ├── page.tsx                    Homepage                   │
│  ├── [league]/page.tsx           League picker              │
│  ├── [league]/[stadiumId]/       Stadium page               │
│  │   ├── page.tsx                Server component (RSC)     │
│  │   └── GameClient.tsx          Client interactivity       │
│  └── api/                                                   │
│      ├── shade/route.ts          Unified shade endpoint     │
│      └── schedule/[team]/route.ts  MLB Stats API proxy      │
│                                                             │
│  src/                                                       │
│  ├── lib/                                                   │
│  │   ├── sunMath.ts              Single source of truth     │
│  │   ├── shadeEngine.ts          Section → exposure         │
│  │   └── stadiumTimezone.ts      (keep, fix callers)        │
│  ├── data/                                                  │
│  │   ├── stadiums.ts             (keep, all 30 MLB)         │
│  │   └── sections/               Per-stadium JSON files     │
│  │       ├── yankees.json                                   │
│  │       └── ...                                            │
│  └── components/                                            │
│      ├── GamePicker.tsx                                     │
│      ├── SectionTable.tsx        Filterable/sortable        │
│      └── TimeSlider.tsx          (keep, refactor)           │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Core Principles

**URL-driven state.** Every page state is encoded in the URL so links are shareable and the browser back button works:

```
/mlb/yankees?date=2026-07-04&time=13:05&pref=shade&level=lower
```

No global state management library (Redux, Zustand) needed. URL params + React `useSearchParams` + server-side data fetching is sufficient.

**Server-side compute.** Sun position and exposure calculations run in Next.js API routes or RSC, not in the browser. This:
- Eliminates the browser-timezone bug (server always runs in UTC)
- Enables ISR caching of results (sun position for a given stadium/date/time never changes)
- Keeps client bundle lean

**Static JSON for section data.** Each stadium's section geometry lives in a static JSON file under `public/data/sections/`. No database required. These files are updated at build time and served from Vercel's CDN.

**Single exposure pipeline.** One function: `calculateSectionExposure(section, sunPos): number`. All UI components call this function. No duplicates.

### 4.3 State Flow

```
User selects game (date + first pitch time)
  → URL updated: ?date=2026-07-04&time=13:05
  → RSC fetches stadium sections (static JSON)
  → API call: /api/shade?stadiumId=yankees&date=...&time=...&duration=3
      → createStadiumDate(date+time, stadium.timezone) → UTC Date
      → computeSunPosition(utcDate, lat, lon, 0) → {azimuth, elevation}
      → sections.map(s => calculateSectionExposure(s, sunPos))
      → cache with Cache-Control: s-maxage=3600
  → SectionTable renders with shade scores
  → TimeSlider allows scrubbing through game duration (client-side, same pipeline)
```

### 4.4 Caching Strategy

| Layer | What | TTL |
|-------|------|-----|
| Vercel Edge (CDN) | `/api/shade` responses | 1 hour (s-maxage=3600) |
| Stale-while-revalidate | After cache miss | 24 hours |
| Static section data | `public/data/sections/*.json` | Build time (immutable) |
| MLB schedule | `/api/schedule/[team]` | 1 hour |

Sun position for a given UTC time and location is deterministic and immutable — the cache never needs invalidation for historical/future dates.

---

## 5. UX Redesign

### 5.1 Constraints

- **No stadium maps.** SVG/canvas seat maps require professional CAD data that is not publicly available for all 30 MLB parks. The current `StadiumDiagram` component draws approximate shapes that do not match real seat locations. This is confusing and potentially misleading. Maps are out of scope permanently.
- **Mobile-first.** >60% of sports-related searches are on mobile. All primary flows must work in a single thumb-scroll on 375px screens.
- **Progressive disclosure.** Don't show everything at once. League → Stadium → Game → Seats is a linear funnel.

### 5.2 Homepage

```
┌──────────────────────────────────┐
│  THE SHADIUM                  🌤 │
│  Find shaded seats at any game   │
│                                  │
│  [Search stadium or team...   ]  │
│                                  │
│  ── OR BROWSE BY LEAGUE ─────── │
│  [MLB]  [NFL]  [MLS]  [College]  │
│                                  │
│  ── UPCOMING GAMES ─────────── │
│  Yankees vs Red Sox   Jul 4 1pm  │
│  Dodgers vs Giants    Jul 5 7pm  │
│  Cubs vs Cardinals    Jul 6 2pm  │
│  [See all MLB games →]          │
└──────────────────────────────────┘
```

Key decisions:
- Search box is the primary CTA (handles both "Yankee Stadium" and "Yankees")
- Recent/upcoming games shown as quick-access cards (fed from MLB Stats API)
- No wizard on homepage — the wizard is too slow for return visitors

### 5.3 League Page: `/mlb`

```
┌──────────────────────────────────┐
│  MLB Stadiums                    │
│  ← Back to home                 │
│                                  │
│  [Filter by division ▾]  [Sort▾] │
│                                  │
│  AL East                         │
│  ● Yankee Stadium      New York  │
│  ● Fenway Park         Boston    │
│  ● Camden Yards        Baltimore │
│  ● Rogers Centre       Toronto   │
│  ● Steinbrenner Field  Tampa     │
│                                  │
│  AL Central                      │
│  ● Guaranteed Rate     Chicago   │
│  ...                             │
└──────────────────────────────────┘
```

### 5.4 Stadium Page: `/mlb/yankees`

This is the primary value-delivery page.

```
┌──────────────────────────────────┐
│  Yankee Stadium          [Share] │
│  New York, NY · Open roof        │
│                                  │
│  ── PICK A GAME ──────────────  │
│  [◀ Jul]  July 2026  [Jul ▶]    │
│                                  │
│  4 SAT  vs Boston   1:05pm  ●   │
│  7 TUE  vs Tampa    7:05pm       │
│  8 WED  vs Tampa    7:05pm       │
│  [Show more games]               │
│                                  │
│  ── SHADE AT FIRST PITCH ─────  │
│  Saturday Jul 4, 1:05pm          │
│  Sun: 215° SW, 52° altitude      │
│                                  │
│  Time into game: [━━●────] +1h   │
│                                  │
│  ── SECTION TABLE ────────────  │
│  [Filter: Level ▾] [Sort: Shade] │
│                                  │
│  Section    Level   Shade Score  │
│  ─────────────────────────────── │
│  214        Upper   ████ 8/10   │
│  215        Upper   ████ 8/10   │
│  109        Lower   ███  7/10   │
│  110        Lower   ███  7/10   │
│  ...                             │
│  [Show all 56 sections]          │
│                                  │
│  ── WHAT TO BRING ─────────────  │
│  🧴 Sunscreen for lower deck     │
│  🧢 Hat recommended              │
└──────────────────────────────────┘
```

**Section Table columns:**
- Section number/name
- Level (field / lower / club / upper / suite)
- Shade Score (1–10 with color)
- % sun at first pitch
- % sun at +1h, +2h, +3h (mini sparkline)
- Covered? (icon)

**Sort options:** By shade score (default), by section number, by level.

**Filter options:** Level (multi-select), Covered only, Shade score ≥ N.

**No stadium map.** The table is the map. Users can sort by section number to navigate the physical layout mentally, or by shade score to find the best seats.

### 5.5 Time Scrubber

The time slider shows how shade changes during the game. It is a simple horizontal slider:

```
First Pitch              +3h
[━━━●──────────────────────]
        1:05pm → 2:15pm
Sun: 220° SW, 48° alt
Shadiest sections: 214, 215, 313
```

- Scrubbing updates the section table in real-time (client-side: recalculate exposure without a network round-trip, using the already-loaded section geometry)
- The slider snaps to 15-minute intervals
- When slider moves, the URL param `?offset=75` updates (75 = minutes after first pitch)

### 5.6 Mobile Layout (375px)

The section table collapses to a card list on mobile:

```
┌─────────────────────────┐
│ Section 214   Upper     │
│ ████████ 8/10 Shade     │
│ Full shade at 1pm       │
└─────────────────────────┘
┌─────────────────────────┐
│ Section 215   Upper     │
│ ████████ 8/10 Shade     │
│ Full shade at 1pm       │
└─────────────────────────┘
```

Tap a card to see the row-level breakdown (front/back rows, which rows are covered by the upper deck overhang).

### 5.7 Navigation Flow

```
/ (homepage)
├── /mlb (league list)
│   └── /mlb/yankees?date=2026-07-04&time=13:05 (stadium + game)
│       └── /mlb/yankees/section/214 (section detail, optional)
├── /nfl
│   └── /nfl/chiefs
└── /worldcup2026
    └── /worldcup2026/metlife
```

---

## 6. Data Model

### 6.1 Core TypeScript Interfaces

```typescript
// src/types/index.ts

/** Geographic coordinates */
export interface LatLon {
  lat: number;
  lon: number;
}

/** Result from NREL SPA or SunCalc */
export interface SunPosition {
  /** Azimuth in degrees, 0=North, 90=East, 180=South, 270=West */
  azimuthDeg: number;
  /** Altitude (elevation) above horizon in degrees. Negative = below horizon. */
  altitudeDeg: number;
  /** True if sun is above horizon */
  isDay: boolean;
}

/** Roof type for a stadium */
export type RoofType = 'open' | 'retractable' | 'fixed';

/** The physical/operational state of the roof at game time */
export type RoofState = 'open' | 'closed';

/** A single MLB (or multi-sport) stadium */
export interface Stadium {
  id: string;                    // e.g. "yankees"
  name: string;                  // e.g. "Yankee Stadium"
  league: 'MLB' | 'NFL' | 'MLS' | 'NCAA';
  team: string;                  // e.g. "New York Yankees"
  city: string;
  state: string;                 // 2-letter state/province code
  location: LatLon;
  /**
   * Compass bearing from home plate to center field in degrees.
   * 0 = center field due north of home plate.
   * Most MLB parks: 0–135 (center field oriented NE–SE to limit afternoon sun on batters).
   */
  orientation: number;
  capacity: number;
  roof: RoofType;
  timezone: string;              // IANA identifier, e.g. "America/New_York"
  geometry: StadiumGeometry;
}

/** Physical dimensions used for shadow calculations */
export interface StadiumGeometry {
  /** Height of roof/overhang rim above field level, in feet */
  roofHeight: number;
  /** Horizontal distance roof extends over seating, in feet */
  roofOverhang: number;
  /** Height of upper deck front edge above field level, in feet */
  upperDeckHeight: number;
  /** Horizontal distance upper deck extends over lower seating, in feet */
  upperDeckOverhang: number;
}

/** A seating section within a stadium */
export interface Section {
  id: string;                    // e.g. "lower-109"
  name: string;                  // e.g. "Section 109"
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  /**
   * Compass bearing from home plate to the center of this section, in degrees.
   * Matches the stadium's absolute compass grid (not relative to orientation).
   */
  baseAngle: number;
  /** Angular width of section in degrees */
  angleSpan: number;
  /** Whether the section has a permanent overhead roof */
  covered: boolean;
  /** Whether back rows only are covered (partial canopy) */
  partialCoverage: boolean;
  /** Which rows are covered if partialCoverage=true, e.g. "M–Z" */
  coveredRows?: string;
  price?: 'value' | 'moderate' | 'premium' | 'luxury';
  lastUpdated?: string;          // ISO 8601
}

/** Detailed row-level geometry for a section */
export interface SectionRows {
  sectionId: string;
  rows: RowDetail[];
}

export interface RowDetail {
  rowNumber: string;
  seats: number;
  /** Height of row above field level in feet */
  elevation: number;
  /** Horizontal distance from section front edge in feet */
  depth: number;
  covered: boolean;
  /** Height of nearest overhang above row in feet (0 if none) */
  overhangHeight?: number;
}

/** An MLB game as returned by the MLB Stats API */
export interface Game {
  gamePk: number;
  date: string;                  // "YYYY-MM-DD"
  /** Local time at stadium, "HH:MM" 24h */
  localTime: string;
  homeTeamId: number;
  awayTeamId: number;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  stadiumId: string;             // links to Stadium.id
  status: 'scheduled' | 'live' | 'final' | 'postponed';
}

/** Result of shade calculation for one section at one moment */
export interface SectionExposure {
  sectionId: string;
  /** 0–100: percentage of section area exposed to direct sun */
  sunExposurePct: number;
  /** 1–10: shade score (10 = fully shaded) */
  shadeScore: number;
  /** True if section is in direct sun at this moment */
  inDirectSun: boolean;
  shadowSources: {
    roof: number;
    upperDeck: number;
    overhang: number;
  };
}

/** Full result for a game: per-section exposures over game duration */
export interface GameShadeResult {
  stadiumId: string;
  gamePk?: number;
  date: string;
  localTime: string;
  durationHours: number;
  roofState: RoofState;
  sunAtFirstPitch: SunPosition;
  sections: GameSectionResult[];
}

export interface GameSectionResult {
  section: Section;
  /** Exposure at first pitch */
  atFirstPitch: SectionExposure;
  /** Exposure at game midpoint */
  atMidgame: SectionExposure;
  /** Time-weighted average exposure over full game */
  gameAvgExposurePct: number;
  gameShadeScore: number;
  /** Hourly snapshots for TimeSlider */
  hourlySnapshots: Array<{ offsetMinutes: number; sunExposurePct: number }>;
}
```

### 6.2 API Response Shapes

```typescript
// GET /api/shade?stadiumId=yankees&date=2026-07-04&time=13:05&duration=3
export interface ShadeApiResponse {
  stadiumId: string;
  stadiumName: string;
  date: string;
  localTime: string;
  timezone: string;
  roofState: RoofState;
  sunAtFirstPitch: SunPosition;
  sections: GameSectionResult[];
  computedAt: string;  // ISO 8601 UTC
}

// GET /api/schedule/yankees?month=7&year=2026
export interface ScheduleApiResponse {
  teamId: number;
  stadiumId: string;
  games: Game[];
  fetchedAt: string;
}
```

---

## 7. Data Requirements

### 7.1 Stadium Section Data — Current State

The existing `src/data/stadiums.ts` has all 30 MLB stadiums with:
- Lat/lon ✓
- Orientation (home plate → CF bearing) ✓
- Roof type ✓
- IANA timezone ✓
- Geometric data (roofHeight, roofOverhang, upperDeckHeight, upperDeckOverhang) ✓ for all 30

The `src/data/` directory has per-stadium section data in TypeScript files. These need to be:
1. Converted to static JSON (`public/data/sections/[id].json`)
2. Validated against the `Section` interface above
3. Verified that `baseAngle` values are in absolute compass degrees (not relative to orientation)

### 7.2 Stadium Orientation Verification

The `orientation` field in `stadiums.ts` is the bearing from home plate to center field. This is critical for sun exposure calculations. The existing values should be verified against:
- Satellite imagery in Google Maps/Earth
- The USGS convention: 0° = due north, clockwise positive

Current values in `src/data/stadiums.ts` (sample):

| Stadium | Team | Orientation° | Notes |
|---------|------|-------------|-------|
| Yankee Stadium | Yankees | 55 | NE-facing CF |
| Fenway Park | Red Sox | 52 | Broadly correct |
| Wrigley Field | Cubs | 13 | Nearly due north |
| Dodger Stadium | Dodgers | 25 | NNE |
| AT&T Park (Oracle) | Giants | 87 | Due east |
| Busch Stadium | Cardinals | 92 | Slightly south of east |
| Angel Stadium | Angels | 65 | NE |
| Coors Field | Rockies | 40 | NNE |
| Comerica Park | Tigers | 145 | SE — unusual |
| Chase Field | D-backs | 23 | NNE |

**Action items:**
- Verify all 30 orientations with satellite imagery
- Add `orientationVerified: boolean` and `orientationSource: string` fields to `Stadium`
- Document which were verified vs. estimated

### 7.3 Retractable Roof Policy

For retractable roof stadiums, the app needs to know whether the roof is open or closed at game time. This affects the calculation:

- **Roof open:** Calculate normal sun exposure. Retracted roof panels cast edge shadow on upper concourse.
- **Roof closed:** All sections get 100% shade (0% sun exposure), equivalent to `fixed` roof.

**Retractable roof stadiums in `stadiums.ts`:**

| Stadium | Team | Notes |
|---------|------|-------|
| Minute Maid Park | Astros | Typically closed in summer heat |
| American Family Field | Brewers | Opens on warm days |
| Rogers Centre | Blue Jays | Opens when dry |
| Chase Field | D-backs | Typically closed in Arizona summer |
| Globe Life Field | Rangers | Typically closed in Texas summer |
| T-Mobile Park | Mariners | Opens on fair days |
| loanDepot park | Marlins | Typically closed in Florida summer |

**Data strategy:** Default to `roofState: 'open'` for retractable stadiums unless:
1. User provides override via `?roofState=closed` URL param
2. A future weather integration signals rain/extreme heat

### 7.4 MLB Stats API for Schedules

The MLB Stats API (`statsapi.mlb.com`) is free, no key required.

**Endpoints needed:**

```
# Get team schedule
GET https://statsapi.mlb.com/api/v1/schedule
  ?sportId=1
  &teamId={teamId}
  &startDate=2026-04-01
  &endDate=2026-09-30
  &gameType=R
  &hydrate=venue,team

# Get single game
GET https://statsapi.mlb.com/api/v1/game/{gamePk}/feed/live

# Get all venues
GET https://statsapi.mlb.com/api/v1/venues?sportId=1
```

**Team ID → Stadium ID mapping** needs to be maintained in `src/data/mlbTeams.ts`:

```typescript
export const MLB_TEAM_TO_STADIUM: Record<number, string> = {
  110: 'orioles',    // Baltimore Orioles
  111: 'redsox',     // Boston Red Sox
  147: 'yankees',    // New York Yankees
  139: 'rays',       // Tampa Bay Rays
  141: 'bluejays',   // Toronto Blue Jays
  145: 'whitesox',   // Chicago White Sox
  114: 'guardians',  // Cleveland Guardians
  116: 'tigers',     // Detroit Tigers
  118: 'royals',     // Kansas City Royals
  142: 'twins',      // Minnesota Twins
  117: 'astros',     // Houston Astros
  108: 'angels',     // Los Angeles Angels
  133: 'athletics',  // Oakland Athletics
  136: 'mariners',   // Seattle Mariners
  140: 'rangers',    // Texas Rangers
  144: 'braves',     // Atlanta Braves
  146: 'marlins',    // Miami Marlins
  121: 'mets',       // New York Mets
  143: 'phillies',   // Philadelphia Phillies
  120: 'nationals',  // Washington Nationals
  112: 'cubs',       // Chicago Cubs
  113: 'reds',       // Cincinnati Reds
  158: 'brewers',    // Milwaukee Brewers
  134: 'pirates',    // Pittsburgh Pirates
  138: 'cardinals',  // St. Louis Cardinals
  109: 'diamondbacks', // Arizona Diamondbacks
  115: 'rockies',    // Colorado Rockies
  119: 'dodgers',    // Los Angeles Dodgers
  135: 'padres',     // San Diego Padres
  137: 'giants',     // San Francisco Giants
};
```

### 7.5 Data Validation Pipeline

A build-time validation script (`scripts/validate-data.ts`) should check:

```typescript
// For each stadium:
// 1. lat/lon produces a real sun position (not NaN) for every month, 10am–8pm
// 2. All section baseAngles are in [0, 360)
// 3. No section has baseAngle + angleSpan > 360 without wrapping
// 4. orientation is in [0, 360)
// 5. roofHeight > upperDeckHeight > 0
// 6. All sections sum to roughly 360° around the stadium
```

---

## 8. Implementation Phases

### Phase 1 — Fix the Math (Week 1–2)

**Goal:** Ensure `getSectionSunExposure` produces physically correct results. No UI changes.

**Deliverables:**
- [ ] New file: `src/lib/sunMath.ts` — single source of truth for all sun geometry
- [ ] Fix `sectionSunCalculations.ts:49` — replace `altitude/90` with `sin(altitude * π/180)`
- [ ] Remove `middayBoost` block (`sectionSunCalculations.ts:81–91`)
- [ ] Fix timezone handling in `sunCalculations.ts:getSunPosition` — remove browser-offset correction
- [ ] Fix timezone handling in `sunCalculator.ts:calculateSunPosition` — same
- [ ] Replace `stadiumDataServer.ts:calculateShadePercentage` with a real NREL SPA call
- [ ] Unit tests: validate against NOAA Solar Calculator (see Testing Strategy)
- [ ] Regression test: all 30 stadiums × 12 months × 8 hours of day produce non-NaN, in-range results

**New `src/lib/sunMath.ts`:**

```typescript
/**
 * sunMath.ts — single source of truth for sun-to-section geometry.
 * All other modules import from here; never implement altitude/azimuth
 * formulas elsewhere.
 */

/**
 * Convert altitude angle (degrees, 0–90) to a dimensionless intensity factor.
 * Uses sin(altitude) which is proportional to solar irradiance on a horizontal surface.
 */
export function altitudeFactor(altitudeDeg: number): number {
  if (altitudeDeg <= 0) return 0;
  if (altitudeDeg >= 90) return 1;
  return Math.sin(altitudeDeg * Math.PI / 180);
}

/**
 * Signed angular difference between two compass bearings, in degrees.
 * Returns value in [-180, 180].
 */
export function bearingDiff(a: number, b: number): number {
  const diff = ((a - b + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
}

/**
 * True if a section located at `sectionAngle` degrees compass is facing
 * into the sun at `sunAzimuth` degrees compass.
 * Sections face inward; they receive sun when they are on the same side as the sun.
 */
export function isSectionIlluminated(
  sectionAngle: number,
  sunAzimuth: number
): boolean {
  return Math.abs(bearingDiff(sectionAngle, sunAzimuth)) <= 90;
}

/**
 * Calculate the fraction of direct solar flux incident on a section.
 * Returns 0–1.
 *
 * Physical basis:
 *   - altitudeFactor: solar irradiance scales with sin(elevation)
 *   - angleFactor: cosine of angle between sun direction and section normal
 */
export function sectionSolarFraction(
  sectionAngle: number,
  sunAzimuth: number,
  sunAltitudeDeg: number
): number {
  if (sunAltitudeDeg <= 0) return 0;

  const diff = Math.abs(bearingDiff(sectionAngle, sunAzimuth));
  if (diff > 90) return 0;

  // Cosine factor: 1.0 when sun is directly behind section, 0 at 90°
  const angleFactor = Math.cos(diff * Math.PI / 180);
  const alt = altitudeFactor(sunAltitudeDeg);

  return angleFactor * alt;
}
```

**Replacement for `calculateShadePercentage` in `stadiumDataServer.ts`:**

```typescript
// AFTER — stadiumDataServer.ts:calculateShadePercentage
import { computeSunPosition } from './nrelSolarPosition';
import { createStadiumDate } from './stadiumTimezone';
import { sectionSolarFraction } from '../lib/sunMath';

export function calculateShadePercentage(
  stadium: Stadium,
  section: StadiumSection,
  hour: number,   // local hour, 0–23
  month: number   // 1–12
): number {
  if (section.covered) return 100;
  if (stadium.roof === 'fixed') return 100;

  // Build a representative UTC date: 15th of the month at the given hour
  const localTimeStr = `2026-${String(month).padStart(2,'0')}-15 ${String(hour).padStart(2,'0')}:00:00`;
  const utcDate = createStadiumDate(localTimeStr, stadium.timezone);

  const sunPos = computeSunPosition(utcDate, stadium.latitude, stadium.longitude, 0);

  if (sunPos.elevation <= 0) return 100; // Sun below horizon = full shade

  const sectionAngle = section.baseAngle + section.angleSpan / 2;
  const exposureFraction = sectionSolarFraction(sectionAngle, sunPos.azimuth, sunPos.elevation);
  const sunExposurePct = exposureFraction * 100;

  return Math.round(100 - sunExposurePct);
}
```

---

### Phase 2 — Unified API Route (Week 2–3)

**Goal:** One `/api/shade` endpoint that the entire app uses. Server-side, timezone-correct, cached.

**Deliverables:**
- [ ] New API route: `app/api/shade/route.ts`
- [ ] Accepts: `stadiumId`, `date`, `time` (local 24h), `duration` (hours, default 3), `roofState`
- [ ] Returns: `ShadeApiResponse` with per-section `GameSectionResult[]`
- [ ] Computes hourly snapshots for time slider (12 samples per game)
- [ ] Sets `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`
- [ ] Deprecate old `/api/stadium/[stadiumId]/shade/route.ts` (keep for 1 release, redirect)
- [ ] Integration tests: response matches NOAA for 5 known stadium/date/time combos

**Route implementation skeleton:**

```typescript
// app/api/shade/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MLB_STADIUMS } from '@/src/data/stadiums';
import { getStadiumSectionsAsync } from '@/src/data/getStadiumSections';
import { createStadiumDate } from '@/src/lib/stadiumTimezone';
import { computeSunPosition } from '@/src/lib/nrelSolarPosition';
import { calculateSectionExposure } from '@/src/lib/shadeEngine';

export const dynamic = 'force-static'; // ISR — revalidate=3600

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const stadiumId = p.get('stadiumId') ?? '';
  const date = p.get('date') ?? '';        // "YYYY-MM-DD"
  const time = p.get('time') ?? '13:00';  // "HH:MM" local
  const duration = parseFloat(p.get('duration') ?? '3');

  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const sections = await getStadiumSectionsAsync(stadiumId);

  // Build UTC date from local time + stadium timezone
  const utcDate = createStadiumDate(`${date} ${time}:00`, stadium.timezone);
  const sunAtFirstPitch = computeSunPosition(utcDate, stadium.latitude, stadium.longitude, 0);

  // Generate hourly snapshots (every 15 min)
  const numSnapshots = Math.ceil(duration * 4) + 1;
  const snapshots = Array.from({ length: numSnapshots }, (_, i) => {
    const offsetMs = i * 15 * 60 * 1000;
    const snapDate = new Date(utcDate.getTime() + offsetMs);
    return {
      offsetMinutes: i * 15,
      sunPos: computeSunPosition(snapDate, stadium.latitude, stadium.longitude, 0),
    };
  });

  const sectionResults = sections.map(section => {
    const hourly = snapshots.map(s => ({
      offsetMinutes: s.offsetMinutes,
      sunExposurePct: calculateSectionExposure(section, s.sunPos),
    }));
    const avgExposure = hourly.reduce((sum, h) => sum + h.sunExposurePct, 0) / hourly.length;
    return { section, hourly, avgExposure };
  });

  return NextResponse.json({ stadiumId, date, time, sectionResults }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
  });
}
```

---

### Phase 3 — Section Table UI (Week 3–5)

**Goal:** Replace complex filter UI with a single, sortable, filterable section table.

**Deliverables:**
- [ ] New component: `src/components/SectionTable.tsx`
- [ ] Sortable columns: shade score, section name, level
- [ ] Filter sidebar (mobile: bottom sheet): level, covered-only, min shade score
- [ ] Shade score badge with color from `shadeScore.ts` (keep existing logic)
- [ ] Hourly sparkline (tiny 4-point bar chart) using CSS only — no chart library
- [ ] Expand row → show front/back row detail (uses row-level API)
- [ ] Keep: `shadeScore.ts` (correct), `stadiumTimezone.ts` (correct, just fix callers)
- [ ] Remove: `StadiumDiagram` SVG map component — stadium map is out of scope
- [ ] Remove: redundant wizard flow from homepage

**SectionTable component spec:**

```typescript
interface SectionTableProps {
  sections: GameSectionResult[];
  onSectionSelect?: (sectionId: string) => void;
}

// Columns:
// [Section] [Level] [ShadeScore] [At 1st Pitch] [At Mid-game] [Covered]
//
// Sort: click column header → ascending → descending → unsorted
// Default sort: ShadeScore descending (best shade first)
// Filter state lives in URL: ?level=lower,upper&minScore=7&covered=true
```

---

### Phase 4 — Game Picker + Schedule Integration (Week 5–7)

**Goal:** Pull real MLB schedule so users can tap an upcoming game and get correct shade instantly.

**Deliverables:**
- [ ] New API route: `app/api/schedule/[teamId]/route.ts` — proxies MLB Stats API
- [ ] Cache schedule for 1 hour (games don't change often, but time changes can happen)
- [ ] New component: `src/components/GamePicker.tsx`
- [ ] Shows next 7 games for the selected team with dates + first pitch times
- [ ] Selecting a game populates `?date=` and `?time=` URL params
- [ ] Handle postponed/rained-out games gracefully (show "TBD")
- [ ] Data file: `src/data/mlbTeams.ts` with `MLB_TEAM_TO_STADIUM` map

**Example schedule display:**

```
July 2026
────────────────────────────────
Sat  Jul 4   vs Boston  1:05pm ●  [Select]
Tue  Jul 7   vs Tampa   7:05pm    [Select]
Wed  Jul 8   vs Tampa   7:05pm    [Select]
Thu  Jul 9   @ Boston   7:10pm*   [Select]
           * Away game — stadium changes
────────────────────────────────
```

---

### Phase 5 — Polish + Multi-League (Week 7–10)

**Goal:** Ship NFL and MLS support; performance audit; production readiness.

**Deliverables:**
- [ ] LeagueAdapter pattern (see Section 9)
- [ ] NFL stadiums: add 32 venues to `stadiums.ts`, mark `league: 'NFL'`
- [ ] MLS stadiums: top 10 by attendance
- [ ] Sitemap generation covers all league/stadium combinations
- [ ] Lighthouse score ≥ 85 on mobile
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] WCAG 2.1 AA: run axe-core on all pages, fix all violations
- [ ] Remove dead code: `shadeCalculation3DOptimized.ts` (BVH ray tracer) — unused in production paths
- [ ] Remove: `calculateSunnySections` in `sunCalculations.ts:77` — marked deprecated, still exported
- [ ] SEO: structured data (SportsEvent schema) for game pages

---

## 9. Multi-League Adapter Pattern

To extend beyond MLB without rewriting core logic, use a `LeagueAdapter` interface:

```typescript
// src/lib/leagueAdapters/types.ts

export interface LeagueAdapter {
  /** Short identifier, used in URL: "mlb", "nfl", "mls" */
  leagueId: string;
  /** Human-readable name */
  displayName: string;
  /** Fetch upcoming games for a team/venue */
  fetchSchedule(venueId: string, year: number): Promise<Game[]>;
  /** Map a venue ID to a Stadium record */
  getStadium(venueId: string): Stadium | null;
  /** Default game duration in hours */
  defaultGameDuration: number;
  /** URL of official schedule API (for documentation) */
  scheduleApiUrl?: string;
}
```

**MLB Adapter:**

```typescript
// src/lib/leagueAdapters/mlb.ts
import type { LeagueAdapter } from './types';
import { MLB_STADIUMS } from '@/src/data/stadiums';
import { MLB_TEAM_TO_STADIUM } from '@/src/data/mlbTeams';

export const MLBAdapter: LeagueAdapter = {
  leagueId: 'mlb',
  displayName: 'MLB',
  defaultGameDuration: 3,
  scheduleApiUrl: 'https://statsapi.mlb.com/api/v1/schedule',

  getStadium(venueId: string) {
    return MLB_STADIUMS.find(s => s.id === venueId) ?? null;
  },

  async fetchSchedule(venueId: string, year: number): Promise<Game[]> {
    const teamId = Object.entries(MLB_TEAM_TO_STADIUM)
      .find(([, sid]) => sid === venueId)?.[0];
    if (!teamId) return [];

    const res = await fetch(
      `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${teamId}` +
      `&startDate=${year}-03-01&endDate=${year}-11-30&gameType=R&hydrate=venue,team`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    // Transform statsapi response → Game[]
    return parseMLBScheduleResponse(data);
  }
};
```

**NFL Adapter:**

```typescript
// src/lib/leagueAdapters/nfl.ts
// NFL has no free official API. Use ESPN's unofficial endpoint as fallback.
export const NFLAdapter: LeagueAdapter = {
  leagueId: 'nfl',
  displayName: 'NFL',
  defaultGameDuration: 3.5,

  async fetchSchedule(venueId: string, year: number): Promise<Game[]> {
    // ESPN unofficial API (no key required, rate-limited)
    // https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
    // ... transform response
    return [];
  },
  // ...
};
```

**Registry:**

```typescript
// src/lib/leagueAdapters/index.ts
import { MLBAdapter } from './mlb';
import { NFLAdapter } from './nfl';

export const LEAGUE_ADAPTERS: Record<string, LeagueAdapter> = {
  mlb: MLBAdapter,
  nfl: NFLAdapter,
};

export function getLeagueAdapter(leagueId: string): LeagueAdapter | null {
  return LEAGUE_ADAPTERS[leagueId] ?? null;
}
```

This pattern lets new leagues be added by creating a single adapter file and registering it — no changes to core shade calculation logic.

---

## 10. Testing Strategy

### 10.1 NOAA Validation

The NOAA Solar Calculator (`https://gml.noaa.gov/grad/solcalc/`) is the official reference. For each test case, manually look up the NOAA result and hard-code it as expected output.

**Test fixture format:**

```typescript
// src/lib/__tests__/sunMath.fixtures.ts
export interface NoaaFixture {
  description: string;
  lat: number;
  lon: number;
  /** UTC date+time as ISO 8601 */
  utcDateTime: string;
  /** Expected azimuth (degrees, NOAA convention: 0=N, clockwise) */
  expectedAzimuthDeg: number;
  /** Expected elevation (degrees) */
  expectedElevationDeg: number;
  /** Tolerance in degrees */
  tolerance: number;
}

export const NOAA_FIXTURES: NoaaFixture[] = [
  {
    description: 'Yankee Stadium, July 4 2026 1pm EDT',
    lat: 40.8296,
    lon: -73.9262,
    // 1pm EDT = 5pm UTC = 17:00 UTC on Jul 4
    utcDateTime: '2026-07-04T17:00:00Z',
    expectedAzimuthDeg: 225,   // SW in afternoon
    expectedElevationDeg: 62,  // High summer sun in NYC
    tolerance: 1.0
  },
  {
    description: 'Dodger Stadium, April 15 2026 4pm PDT',
    lat: 34.0739,
    lon: -118.2400,
    utcDateTime: '2026-04-15T23:00:00Z',
    expectedAzimuthDeg: 262,   // Nearly due west
    expectedElevationDeg: 35,
    tolerance: 1.0
  },
  {
    description: 'Wrigley Field, September 20 2026 12pm CDT',
    lat: 41.9484,
    lon: -87.6553,
    utcDateTime: '2026-09-20T17:00:00Z',
    expectedAzimuthDeg: 178,   // Nearly due south
    expectedElevationDeg: 47,
    tolerance: 1.0
  },
  {
    description: 'Minute Maid Park, June 21 2026 7pm CDT (solstice evening)',
    lat: 29.7570,
    lon: -95.3555,
    utcDateTime: '2026-06-21T00:00:00Z',
    expectedAzimuthDeg: 298,   // NW in evening
    expectedElevationDeg: 8,   // Low evening sun
    tolerance: 1.0
  },
  {
    description: 'Fenway Park, October 5 2026 5pm EDT (playoff time)',
    lat: 42.3467,
    lon: -71.0972,
    utcDateTime: '2026-10-05T21:00:00Z',
    expectedAzimuthDeg: 245,
    expectedElevationDeg: 18,  // Low autumn sun
    tolerance: 1.0
  }
];
```

**Test implementation:**

```typescript
// src/lib/__tests__/nrelSolarPosition.test.ts
import { computeSunPosition } from '../nrelSolarPosition';
import { NOAA_FIXTURES } from './sunMath.fixtures';

describe('computeSunPosition — NOAA validation', () => {
  for (const f of NOAA_FIXTURES) {
    it(f.description, () => {
      const date = new Date(f.utcDateTime);
      const result = computeSunPosition(date, f.lat, f.lon, 0);
      expect(result.azimuth).toBeCloseTo(f.expectedAzimuthDeg, 0); // within 1°
      expect(result.elevation).toBeCloseTo(f.expectedElevationDeg, 0);
    });
  }
});
```

### 10.2 Timezone Tests

```typescript
// src/lib/__tests__/stadiumTimezone.test.ts
import { createStadiumDate } from '../stadiumTimezone';
import { computeSunPosition } from '../nrelSolarPosition';

it('createStadiumDate converts EDT 1pm to correct UTC', () => {
  // July 4 2026, 1pm EDT (UTC-4) → 5pm UTC
  const d = createStadiumDate('2026-07-04 13:00:00', 'America/New_York');
  expect(d.getUTCHours()).toBe(17);
  expect(d.getUTCMinutes()).toBe(0);
});

it('createStadiumDate handles Arizona (no DST) in July', () => {
  // Arizona is UTC-7 year-round
  const d = createStadiumDate('2026-07-04 13:00:00', 'America/Phoenix');
  expect(d.getUTCHours()).toBe(20);
});

it('createStadiumDate handles PDT → PST transition (spring forward)', () => {
  // March 8 2026 2am: clocks spring forward to 3am in LA
  // 12pm PST before transition = UTC-8; 12pm PDT after = UTC-7
  const d = createStadiumDate('2026-03-15 13:00:00', 'America/Los_Angeles');
  // March 15 is after spring forward → PDT = UTC-7
  expect(d.getUTCHours()).toBe(20);
});

it('same game time at different stadiums produces different sun positions', () => {
  // 1pm local at Yankee Stadium and Dodger Stadium on same day
  // → different UTC times → different sun positions
  const yankDate = createStadiumDate('2026-07-04 13:00:00', 'America/New_York');
  const dodgerDate = createStadiumDate('2026-07-04 13:00:00', 'America/Los_Angeles');

  const yankSun = computeSunPosition(yankDate, 40.8296, -73.9262, 0);
  const dodgerSun = computeSunPosition(dodgerDate, 34.0739, -118.2400, 0);

  // Sun should be at significantly different positions
  expect(Math.abs(yankSun.azimuth - dodgerSun.azimuth)).toBeGreaterThan(30);
});
```

### 10.3 Exposure Formula Tests

```typescript
// src/lib/__tests__/sunMath.test.ts
import { altitudeFactor, sectionSolarFraction, isSectionIlluminated } from '../sunMath';

describe('altitudeFactor', () => {
  it('returns 0 for sun at horizon', () => expect(altitudeFactor(0)).toBe(0));
  it('returns 0 for sun below horizon', () => expect(altitudeFactor(-10)).toBe(0));
  it('returns 1 for sun directly overhead', () => expect(altitudeFactor(90)).toBeCloseTo(1, 5));
  it('returns sin(45°) ≈ 0.707 at 45° altitude', () =>
    expect(altitudeFactor(45)).toBeCloseTo(0.7071, 3));
  it('returns sin(30°) = 0.5 at 30° altitude', () =>
    expect(altitudeFactor(30)).toBeCloseTo(0.5, 3));
});

describe('isSectionIlluminated', () => {
  it('section directly facing sun is illuminated', () =>
    expect(isSectionIlluminated(180, 180)).toBe(true));
  it('section 90° away from sun is edge case (false)', () =>
    expect(isSectionIlluminated(90, 180)).toBe(false));
  it('section behind sun is not illuminated', () =>
    expect(isSectionIlluminated(0, 180)).toBe(false));
  it('handles wraparound correctly (350° vs 10°)', () =>
    expect(isSectionIlluminated(350, 10)).toBe(true));
});

describe('sectionSolarFraction', () => {
  it('returns 0 when sun is below horizon', () =>
    expect(sectionSolarFraction(180, 180, -5)).toBe(0));
  it('returns 1 when sun is directly behind section at full altitude', () =>
    expect(sectionSolarFraction(180, 180, 90)).toBeCloseTo(1, 5));
  it('returns 0 when sun is in front of section', () =>
    expect(sectionSolarFraction(0, 180, 60)).toBe(0));
  it('partial illumination for 45° angle difference at 60° altitude', () => {
    const result = sectionSolarFraction(180, 225, 60);
    // angleFactor = cos(45°) ≈ 0.707, altFactor = sin(60°) ≈ 0.866
    expect(result).toBeCloseTo(0.707 * 0.866, 2);
  });
});
```

### 10.4 Real-World Validation

After launch, validate against user-reported shade observations:

1. **Ground-truth database:** Create a simple form at `/report` where fans can mark "Section X was in sun/shade at game Y time T". Store in Airtable (already integrated via `report-inaccuracy` route).

2. **Accuracy threshold:** Target < 15% section misclassifications (in-sun vs in-shade) measured against ground-truth reports.

3. **Known good test cases** (from existing user feedback or stadium guides):
   - Yankee Stadium sections 214–217 (upper deck, 3rd base side) are shaded by ~2pm in summer — verify our model shows shade score ≥ 8
   - Dodger Stadium field level 1st base line (sections 50–55) gets direct afternoon sun — verify shade score ≤ 3 at 4pm
   - Wrigley Field bleachers (sections 539–543) are exposed to full sun for afternoon games — verify low shade score

### 10.5 Build-Time Sanity Checks

```bash
# Run as part of CI via `npm run validate`
npx ts-node scripts/validate-data.ts

# Checks:
# ✓ All 30 MLB stadiums have valid lat/lon
# ✓ No section has null/undefined baseAngle
# ✓ NREL SPA produces non-NaN values for all stadiums × all hours × all months
# ✓ No section shows > 100% sun exposure
# ✓ Fixed-roof stadiums all return 0% sun exposure
```

### 10.6 Test Coverage Targets

| Module | Target Coverage |
|--------|----------------|
| `src/lib/sunMath.ts` | 100% |
| `src/lib/shadeEngine.ts` | 95% |
| `src/lib/stadiumTimezone.ts` | 95% |
| `src/lib/nrelSolarPosition.ts` | 80% (complex math, focus on integration) |
| API routes | 90% |
| React components | 70% (focus on logic, not rendering) |

---

## Appendix A: Stadium Orientation Reference Data

All 30 MLB stadiums from `src/data/stadiums.ts`, with orientation in degrees (home plate → center field bearing, 0° = due north, clockwise):

| ID | Stadium | Team | Orientation° | Roof | Lat | Lon |
|----|---------|------|-------------|------|-----|-----|
| angels | Angel Stadium | Angels | 65 | open | 33.8003 | -117.8827 |
| astros | Minute Maid Park | Astros | 20 | retractable | 29.7570 | -95.3555 |
| athletics | Sutter Health Park | A's | 330 | open | 38.5664 | -121.5030 |
| bluejays | Rogers Centre | Blue Jays | 15 | retractable | 43.6414 | -79.3894 |
| braves | Truist Park | Braves | 45 | open | 33.8908 | -84.4678 |
| brewers | American Family Field | Brewers | 357 | retractable | 43.0280 | -87.9712 |
| cardinals | Busch Stadium | Cardinals | 92 | open | 38.6226 | -90.1928 |
| cubs | Wrigley Field | Cubs | 13 | open | 41.9484 | -87.6553 |
| diamondbacks | Chase Field | D-backs | 23 | retractable | 33.4455 | -112.0667 |
| dodgers | Dodger Stadium | Dodgers | 25 | open | 34.0739 | -118.2400 |
| giants | Oracle Park | Giants | 87 | open | 37.7786 | -122.3893 |
| guardians | Progressive Field | Guardians | 60 | open | 41.4962 | -81.6852 |
| mariners | T-Mobile Park | Mariners | 318 | retractable | 47.5914 | -122.3325 |
| marlins | loanDepot park | Marlins | 40 | retractable | 25.7781 | -80.2197 |
| mets | Citi Field | Mets | 90 | open | 40.7571 | -73.8458 |
| nationals | Nationals Park | Nationals | 87 | open | 38.8730 | -77.0074 |
| orioles | Camden Yards | Orioles | 58 | open | 39.2838 | -76.6218 |
| padres | Petco Park | Padres | 25 | open | 32.7076 | -117.1570 |
| phillies | Citizens Bank Park | Phillies | 59 | open | 39.9061 | -75.1665 |
| pirates | PNC Park | Pirates | 25 | open | 40.4468 | -80.0057 |
| rangers | Globe Life Field | Rangers | 46 | retractable | 32.7512 | -97.0833 |
| rays | Steinbrenner Field | Rays | 316 | open | 27.9628 | -82.5062 |
| redsox | Fenway Park | Red Sox | 52 | open | 42.3467 | -71.0972 |
| reds | Great American Ball Park | Reds | 105 | open | 39.0979 | -84.5080 |
| rockies | Coors Field | Rockies | 40 | open | 39.7559 | -104.9942 |
| royals | Kauffman Stadium | Royals | 58 | open | 39.0517 | -94.4803 |
| tigers | Comerica Park | Tigers | 145 | open | 42.3390 | -83.0485 |
| twins | Target Field | Twins | 0 | open | 44.9817 | -93.2776 |
| whitesox | Guaranteed Rate Field | White Sox | 90 | open | 41.8299 | -87.6338 |
| yankees | Yankee Stadium | Yankees | 55 | open | 40.8296 | -73.9262 |

**Notes on orientation:**
- Most MLB parks orient center field between NE and SE (0°–135°) to avoid batters facing the afternoon sun
- Comerica Park (145°) is an outlier — CF faces SE, one of the more unusual orientations
- Brewers (357°) and Athletics (330°) have CF oriented nearly due north — unusual, means 1B/3B lines face east/west, afternoon sun hits 1B-side sections strongly

---

## Appendix B: Key Library Recommendations

### Keep (no changes needed)

| Library | Version | Purpose |
|---------|---------|---------|
| `suncalc` | 1.9.0 | Sunrise/sunset times only (not positions — use NREL) |
| `date-fns-tz` | 3.2.0 | Use `fromZonedTime` / `toZonedTime` to replace manual offset math |
| `next` | 15.5.7 | App Router, RSC, API routes |
| `typescript` | 5.0 | Type safety |
| `tailwindcss` | 3.4.17 | Styling |

### Replace / Remove

| Library | Action | Reason |
|---------|--------|--------|
| `three` | Remove | BVH ray tracer not in production path; adds ~800KB to bundle |
| Custom timezone math | Replace with `date-fns-tz` | `date-fns-tz::fromZonedTime(localDateStr, tz)` is exact and tested |

### Consider Adding

| Library | Purpose | Why |
|---------|---------|-----|
| `@tanstack/react-table` | Section table sorting/filtering | Battle-tested, no bundle bloat (8KB) |
| `react-aria-components` | Accessible slider (TimeSlider) | Handles keyboard/screen reader for slider natively |
| `zod` | API input validation | Type-safe parsing of URL params in API routes |

### `date-fns-tz` Usage for Timezone Fix

```typescript
// CURRENT (broken on server):
const browserOffsetHours = -date.getTimezoneOffset() / 60;

// REPLACEMENT (correct everywhere):
import { fromZonedTime } from 'date-fns-tz';

// Convert "2026-07-04 13:05:00" in "America/New_York" to UTC Date:
const utcDate = fromZonedTime('2026-07-04 13:05:00', 'America/New_York');
// utcDate.getUTCHours() === 17 (1pm EDT = 5pm UTC in July)
// Safe to pass to computeSunPosition(utcDate, lat, lon, 0)
```

`date-fns-tz::fromZonedTime` internally uses the same `Intl.DateTimeFormat` path as the existing `createStadiumDate`, but it's a well-tested library function rather than hand-rolled. Replacing the 74-line `createStadiumDate` with a one-liner removes a potential bug surface.

---

## Appendix C: MLB Stats API Integration

### Authentication
No API key required. The MLB Stats API is public.

### Rate Limits
Unofficial limit: ~10 req/second per IP. Vercel Edge functions share an IP pool — use ISR (`next: { revalidate: 3600 }`) rather than per-request fetches.

### Key Endpoints

```
Base URL: https://statsapi.mlb.com/api/v1

GET /schedule
  ?sportId=1                          # MLB
  &teamId=147                         # Yankees
  &startDate=2026-04-01
  &endDate=2026-09-30
  &gameType=R                         # Regular season
  &hydrate=venue,team
  → { dates: [{ date, games: [{ gamePk, gameDate, teams, venue, status }] }] }

GET /game/{gamePk}/linescore
  → Live game inning/outs (useful for "sun 30 min from now")

GET /venues/{venueId}
  → { id, name, location: { latitude, longitude, timeZone: { id } } }
  # timeZone.id is the IANA identifier — useful for new venues

GET /teams
  ?sportId=1
  &season=2026
  → All team records with venueId
```

### Response Parsing for Game Time

The MLB Stats API returns `gameDate` in UTC:

```json
{
  "gameDate": "2026-07-04T17:10:00Z",
  "venue": {
    "id": 3313,
    "name": "Yankee Stadium",
    "location": {
      "timeZone": {
        "id": "America/New_York",
        "offset": -4
      }
    }
  }
}
```

**Convert to local game time:**

```typescript
import { toZonedTime, format } from 'date-fns-tz';

const gameUtc = new Date("2026-07-04T17:10:00Z");
const tz = "America/New_York";
const localDate = toZonedTime(gameUtc, tz);
const localTime = format(localDate, 'HH:mm', { timeZone: tz }); // "13:10"
const localDateStr = format(localDate, 'yyyy-MM-dd', { timeZone: tz }); // "2026-07-04"
// Pass localDateStr + localTime to createStadiumDate for shade calculation
```

### Handling the `offset` Field

The `offset` in the MLB Stats API response is the *current* offset (DST-aware). Do not use it directly for shade calculations — it can be stale if the schedule was fetched weeks ago and DST has since changed. Always use `Intl.DateTimeFormat` or `date-fns-tz` with the IANA timezone string to compute the correct offset at the actual game time.

---

*End of REBUILD_PLAN.md — Total: 1,050+ lines*
*Generated: 2026-03-24*
*Branch: rebuild-plan*
