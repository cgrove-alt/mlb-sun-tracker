# R1 — Venue-Page Data Refactor (ship only the current venue's data)

**Status:** planned / not started. Prerequisite for the interactive shade diagram (see §6).
**Owner:** TBD
**Related:** `PERF-SCOPING.md` (§2 R1), PR #78 (Stage 1 + Stage 2 config fix — merged).

---

## 1. Problem

After the Stage 2 bundler fix (PR #78), the homepage and static pages are lean
(First Load JS 593→133 kB, static 251→107 kB), but **a venue page still ships all
~240 venues' guide + section data on first load**. The monolithic 2.92 MB `data`
chunk is gone, but the same data now rides in the venue route's own first-load
chunks because **client components statically import the full datasets**.

This is why venue mobile Lighthouse barely moved (69 → 72, LCP 8.3 s → 7.7 s) while
the homepage jumped to 94. A bundler config change cannot fix this — the imports are
in the module graph of first-load client components. It requires a code change.

## 2. Evidence (measured on the Stage 2 build)

Venue (`/stadium/[stadiumId]`) first-load composition, from the bundle analyzer:

| First-load chunk | Parsed | Dominated by | Pulled in by |
|---|---|---|---|
| `app/stadium/[stadiumId]/page-*.js` | 1,475 kB | **`src/data/guides` — 3,126 kB (stat, all leagues)** | `ComprehensiveStadiumGuide` → `import { getStadiumGuide } from '../data/guides'` |
| `625-*.js` (shared) | 991 kB | **`stadium-data-aggregator` 2,164 kB + `venueSections` 749 kB + `sections` 139 kB** | `SeatRecommendationsSection` → `getStadiumCompleteData`; `GameWindowShade` → `getStadiumSections`; `UnifiedApp`/utils → `getVenueSections` |

### Why the data is first-load (not code-split)
- `app/stadium/[stadiumId]/page.tsx` **statically** imports `ComprehensiveStadiumGuide`
  (line 12) for the MiLB/NFL branch, and `ComprehensiveStadiumGuide` **statically**
  imports `getStadiumGuide` from `src/data/guides`. `src/data/guides/index.ts` imports
  **every** league guide file and merges them into `Record`s, so importing
  `getStadiumGuide` pulls the entire 3.13 MB guide corpus.
- `ComprehensiveStadiumGuide` also statically imports `getVenueSections`
  (`src/data/venueSections`, 0.75 MB) and computes sections at render time.
- `SeatRecommendationsSection` (dynamic `ssr:false`) and `GameWindowShade` statically
  import `stadium-data-aggregator` (2.16 MB). Even where the component is deferred, the
  aggregator lands in a shared first-load chunk (`625-*.js`) because it is referenced by
  ≥2 chunks.

### What is already correct (do not undo)
- `src/data/getStadiumSections.ts` **already** loads section data per venue via
  `import(\`./stadiumSections-split/${stadiumId}\`)` and the split files exist in
  `src/data/stadiumSections-split/*` (one per MLB stadium). Stage 2 preserved these as
  on-demand async chunks. R1 should **extend the same per-venue pattern to guides** and
  route the client components through per-venue data instead of the full-corpus imports.

## 3. Goal

A venue page's first load contains **only the current venue's** guide + section data,
while the guide content stays **server-rendered (SSR) and indexable for all leagues**
(MLB, MiLB, NFL). Target: cut ~3–4 MB (stat) / ~300 kB (gzip) of all-venue data from the
venue first load, moving venue mobile Lighthouse toward the homepage's ~90+.

## 4. Approach (two prongs)

### A. Guides — feed the single venue's guide, keep SSR
`page.tsx` is a Server Component and already computes `const guide = getStadiumGuide(stadium.id)`
server-side (its import stays server-only — that's fine, servers don't ship JS). Two options:

1. **Pass `guide` as a prop** into `ComprehensiveStadiumGuide` and **remove the
   `getStadiumGuide` import from that client component.** `StadiumPageClient` already
   receives `guide` from `page.tsx` (line ~352) — forward it to
   `ComprehensiveStadiumGuide`. For the MiLB/NFL branch (`page.tsx` line ~296), pass the
   server-computed guide too. Once no client component imports `src/data/guides`, the
   3.13 MB corpus becomes server-only and leaves the client bundle entirely. **Preferred
   — lowest client weight, SSR preserved automatically because the value is serialized
   from the server render.**
2. **Per-venue dynamic import** (mirror `getStadiumSections`): split
   `src/data/guides/*` into per-venue files and load one via `import()`. Heavier lift
   (guide files are currently per-league, e.g. `mlbStadiumGuides.ts` holds all 30 MLB
   guides) and risks SSR gaps if loaded client-side. Only needed if the guide must be
   fetched somewhere without a server parent. `src/data/guides/dynamicLoader.ts` already
   has a **per-league** async loader — a stepping stone, but per-league still overfetches.

**Recommendation:** Option A (props). Keep `getStadiumGuide` usage confined to Server
Components; make `ComprehensiveStadiumGuide` a presentational client component that
receives `guide` (and `sections`, see B) as props.

### B. Sections / aggregator — route through per-venue data
- `ComprehensiveStadiumGuide`: replace the internal `getVenueSections(venue.id)` /
  `generateBaseballSections` computation with a `sections` prop supplied by the server
  (`page.tsx` already has per-venue `sections` from `getStadiumSectionsAsync`). Remove the
  `src/data/venueSections` import from the client component.
- `SeatRecommendationsSection` / `GameWindowShade`: replace static
  `stadium-data-aggregator` imports (`getStadiumCompleteData`, `getStadiumSections`) with
  **per-venue** data — either passed as props from the server or loaded via a per-venue
  dynamic import keyed by `stadiumId`. The aggregator's all-venue tables must not be in a
  first-load client chunk.
- Server-only consumers of `stadium-data-aggregator` (`app/api/.../route.ts`,
  `stadiumDataFidelity.ts`) can keep static imports — they don't ship to the client.

### Files in scope
- `app/stadium/[stadiumId]/page.tsx` (already computes guide + sections; wire them down)
- `app/stadium/[stadiumId]/StadiumPageClient.tsx` (forward `guide`/`sections` props)
- `src/components/ComprehensiveStadiumGuide.tsx` (props instead of full-corpus imports)
- `src/components/SeatRecommendationsSection.tsx`, `src/components/GameWindowShade.tsx`
  (per-venue aggregator data)
- Possibly `src/data/venueSections.ts` / `stadium-data-aggregator.ts` (add per-venue
  accessors), and `src/data/guides/*` only if Option 2 is chosen.

## 5. Risks & how to verify
- **SSR/SEO regression (highest risk):** the guide text is indexable content. Verify the
  server-rendered HTML for MLB **and** MiLB **and** NFL venues still contains the full
  guide markup (`curl` the page, diff the guide section against pre-refactor output).
- **Hydration mismatch:** props must match what the client previously computed. Compare
  rendered section tables for several venues before/after (byte-diff the SSR body).
- **MiLB/NFL branch:** the `page.tsx` line ~296 path renders `ComprehensiveStadiumGuide`
  directly in a Server Component — confirm those venues still get guide + generated
  sections.
- **Regression guard:** re-run `npm test` (666 tests), `type-check`, and the bundle
  analyzer; confirm `src/data/guides` and `stadium-data-aggregator` no longer appear in
  any **first-load** venue chunk. Re-run mobile Lighthouse (3-run median) on
  `/stadium/yankees` and expect a large LCP drop.

## 6. Why R1 is the prerequisite for the shade diagram — do them together

The planned interactive **SVG shade diagram** on venue pages must read the **current
venue's** section geometry: each `StadiumSection` carries `baseAngle` and `angleSpan`
(see `src/data/stadiumSectionTypes.ts`; compass mapping is
`compass = (stadium.orientation + 90 - baseAngle) mod 360`), already present in the
per-venue `stadiumSections-split/*` files.

If the diagram is added **before** R1, the easiest implementation would re-import the
full section/aggregator dataset (exactly today's anti-pattern) and re-inflate the venue
first load — the same trap that caused the original 2.92 MB chunk. After R1, the single
venue's `sections` (with `baseAngle`/`angleSpan`) already flow as props to the venue
client tree, so the diagram can consume them directly with **zero additional data import**.

**Plan:** build R1 and the shade diagram as **one effort** — R1 establishes the per-venue
data path (props), and the diagram is a below-the-fold, lazily-hydrated, dependency-free
SVG consumer of that same per-venue `sections` prop (see `PERF-SCOPING.md` §4 for the
diagram guard-rails: keep it out of the LCP element, lazy-hydrate, no charting library).

## 7. Out of scope (separate future work)
- Replacing `react-select` (279 kB), dropping `react-helmet-async`, trimming `date-fns`
  (see `PERF-SCOPING.md` §2b). These are independent of R1.
