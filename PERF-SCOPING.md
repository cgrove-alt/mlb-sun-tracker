# Mobile Performance Scoping — The Shadium

**Status:** investigation only. No code changed. Decide what to greenlight after reading.
**Date:** 2026-07-20
**Branch:** `perf/scoping-doc`

---

## TL;DR

- **The problem is not primarily "a heavy JS bundle running slowly." It is bandwidth
  contention on a throttled mobile link, driven by ~780 kB of first-load JS.** The
  single biggest offender is a **2.92 MB (≈338 kB gzip) `data` chunk that ships the
  section/guide data for *all ~240 venues* on the homepage AND every venue page** — even
  though the code already tries to load that data per-venue on demand.
- **The metric dragging the score down is LCP, not TBT.** Lab LCP is **5.4 s on the
  homepage (score 20/100)** and **8.3 s on a venue page (score 2/100)**. Everything else
  scores well (FCP 1.2–1.4 s, CLS 0, TBT 210–300 ms).
- The LCP element is **plain server-rendered text** in both cases. It paints in ~200–400 ms
  when measured un-throttled; Lighthouse's simulated Slow-4G model inflates it because the
  oversized JS saturates the link and **21 render-blocking CSS files** add round-trips.
- **Low-risk wins alone should reach ~mid-80s.** With the code-splitting refactor the
  realistic ceiling is **~92–96**. A perfect 100 on mobile is not realistic while the
  interactive app + Google Analytics load.
- **A new interactive SVG shade diagram is feasible, but the venue page should be slimmed
  first.** Today it is the heaviest page on the site; dropping a widget on it as-is would
  make LCP/TBT worse. Details in §4.

---

## How this was measured

- `ANALYZE=true npm run build` (Next 15.5, production) → route table + `@next/bundle-analyzer`
  reports in `.next/analyze/*.html`.
- Chunk→route attribution from `.next/app-build-manifest.json`.
- Chunk→dependency attribution by parsing the analyzer module tree.
- `npm run start` (real production server) + **Lighthouse 13.4 mobile** (`--form-factor=mobile`,
  simulated throttling) against `/` and `/stadium/yankees`.

Lab scores differ slightly from the field numbers you quoted (65–71). Field/CrUX blends real
devices and networks; the lab run here gives **Home 76 / Venue 69**, same shape and same
bottleneck. Treat absolute numbers as directional; the **relative** findings are solid.

---

## 1. Bundle breakdown & what actually loads

### Route sizes (production build)

| Route | Page size | **First Load JS** |
|---|---|---|
| `/` (homepage) | 4.6 kB | **593 kB** |
| `/stadium/[stadiumId]` (venue) | 16.3 kB | **605 kB** |
| Shared by all routes | — | 251 kB |
| Most static pages (`/faq`, `/blog`, …) | ~120 B | 251 kB |

The gap between the 251 kB shared baseline and the 593–605 kB on the two important pages is
almost entirely **one chunk**.

### The largest chunks (raw, uncompressed)

| Chunk | Raw size | Gzip (transfer) | Loaded on |
|---|---|---|---|
| `data-*.js` | **2.92 MB** | **≈338 kB** | homepage **and** every venue page (first load) |
| `vendor-*.js` | 750 kB | ≈228 kB | all pages |
| `956.*.js` (the dynamic `UnifiedApp`) | 154 kB | ≈50 kB | homepage, when the app reveals |
| `polyfills-*.js` | 112 kB | — | all pages |
| `common-*.js` | 50 kB | 15 kB | all pages |

### What's inside the `data` chunk (2.92 MB) — the root cause

Attributed from the analyzer module tree:

| Source | Stat size |
|---|---|
| `src/data/guides` (comprehensive guide prose for all venues) | 3.13 MB |
| `src/data/stadium-data-aggregator.ts` (+66 concatenated modules) | 2.16 MB |
| `src/data/stadiumSections-split` (per-stadium section geometry) | 0.93 MB |
| `src/data/venueSections.ts` (+5 modules) | 0.75 MB |
| `src/data/unifiedVenues.ts` | 0.18 MB |
| `src/data/sections` | 0.14 MB |
| … + `venueCount.ts` (1 kB) and other small files | — |

**Root cause of the regression.** `BUNDLE_OPTIMIZATION.md` documents prior work to load
section data per-venue via `getStadiumSectionsAsync()` + `import(\`./stadiumSections-split/${id}\`)`.
That splitting is **defeated by the custom `splitChunks` config in `next.config.js`**:

```js
// next.config.js
data: {
  name: 'data',                 // ← single fixed chunk name
  test: /[\\/]src[\\/]data[\\/]/,
  chunks: 'all',                // ← sync AND async
  priority: 25,
  enforce: true,                // ← always create it
},
```

Because the cache group forces **every** `src/data/*` module into **one** chunk named
`data`, the tiny always-needed files (e.g. `venueCount.ts`, imported by the layout and
homepage) are merged into the same chunk as the giant lazy guide/section data. Since the
tiny part is required on first paint, webpack marks the **entire merged chunk** as a
first-load dependency. Net effect: the per-venue dynamic imports still exist in the source,
but the bundler re-collapses all of it back into one 2.92 MB blob that every page downloads
up front. **The optimization work is being undone at bundle time.**

### What's inside the `vendor` chunk (750 kB)

| Dependency | Stat size | Notes |
|---|---|---|
| `next` (framework runtime) | 1.52 MB | mostly unavoidable |
| **`react-select`** | **279 kB** | used only in the game-selector dropdowns |
| `react-dom` | 131 kB | required |
| `date-fns` + `date-fns-tz` | 168 kB | tree-shakeable; likely broader import than needed |
| `react-helmet-async` | 27 kB | SEO `<head>` mgmt; overlaps Next's native metadata |
| `suncalc` | 9 kB | fine, core to the product |
| styled-jsx, react-is, hoist-non-react-statics, etc. | ~45 kB | transitive |

### Homepage vs venue page — what's different

- **Both** pull the same 2.92 MB `data` chunk + 750 kB `vendor` chunk on first load.
- Homepage additionally loads `956.js` (the `UnifiedApp`, `dynamic(ssr:false)`) only after
  the user taps "Select Your Stadium" — this part of the lazy-loading works correctly.
- Venue page ships a **43 kB server-rendered HTML document** (vs 12 kB for the homepage)
  because the full guide + section tables are SSR'd for SEO. Larger DOM = more parse/layout
  cost, which is why its LCP (8.3 s) is worse than the homepage's (5.4 s).
- `react-select`, `react-helmet-async`, and the MLB/weather API clients are in the client
  islands on both pages.

### LCP element & what delays it

| | Homepage | Venue page |
|---|---|---|
| **LCP element** | `<p class="hero-subheadline">` "Avoid the sun and enjoy the game…" | `<p>` "For a day game at Yankee Stadium, the first base side falls into shade first…" |
| Type | SSR text | SSR text (inside the guide) |
| FCP | 1.2 s | 1.4 s |
| **LCP** | **5.4 s (score 20)** | **8.3 s (score 2)** |
| TBT | 210 ms | 300 ms |
| CLS | 0 | 0 |
| Observed LCP render delay (un-throttled) | 202 ms | 408 ms |
| Total transfer | 874 kB (JS 764 kB, CSS 40 kB / **21 files**) | 1,059 kB (JS 781 kB, CSS 49 kB / **21 files**, Doc 43 kB) |

**Why an SSR text element paints at 5–8 s.** It doesn't, really — un-throttled it paints in
~200–400 ms. The inflation is a *bandwidth/critical-path* effect under Lighthouse's simulated
Slow-4G (~1.6 Mbps, 150 ms RTT) + 4× CPU model:

1. **~780 kB of JS is downloaded on first load.** Scripts are `defer`'d (not render-blocking),
   but on Slow-4G ~780 kB ≈ 4 s of transfer time, and it **saturates the connection**,
   starving the render-blocking CSS and font that the LCP text needs to reach its final paint.
2. **21 render-blocking CSS files.** Small in bytes (~40–49 kB total) but each is a separate
   request; over a 150 ms-RTT link with a limited connection pool they serialize into extra
   round-trips. Lighthouse estimates ~530 ms of render-blocking savings available.
3. The venue page adds a 43 kB HTML doc + larger DOM to lay out → its LCP is ~3 s worse.

So the lever is **fewer bytes and fewer requests on the critical path**, not "make the JS run
faster." Removing the 2.92 MB `data` chunk from first load is the highest-value single change.

Also flagged by Lighthouse: **414 KiB of unused JavaScript** on the homepage (214 kB of it is
the `data` chunk, 133 kB the `vendor` chunk, 66 kB Google Analytics).

---

## 2. Fixable wins by effort & risk

Point estimates are for **mobile Performance** and are deliberately conservative; LCP is the
gating metric (currently 20/2), so anything that shortens the critical path moves the needle
most.

### (a) Low-risk quick wins

| # | Change | Effort | Risk | Est. gain |
|---|---|---|---|---|
| L1 | **Un-merge the `data` cache group.** Give lazy data its own async chunk(s) so `venueCount`-style always-needed files aren't dragging the 2.92 MB blob into first load. Smallest version: drop/relax the `data` cacheGroup in `next.config.js` (with `enforce:true`) and let Next's default splitting keep the per-venue dynamic imports separate. | S (config) | Low–Med | **+8 to +14** (biggest single win; removes ~338 kB gzip from first-load bandwidth on the homepage and most of it on venue pages) |
| L2 | **Consolidate render-blocking CSS** (21 files → a handful). Merge the 7 global stylesheets imported in `layout.tsx`; rely on the existing critical-CSS inline for above-the-fold. | S–M | Low | **+2 to +4** (~530 ms render-blocking) |
| L3 | **Confirm Google Analytics is truly deferred / idle-loaded** (gtag = 163 kB transfer, 66 kB unused). It's already behind `GoogleAnalyticsLazy`; verify it loads post-interaction, not during the LCP window. | S | Low | **+1 to +3** |
| L4 | **Lazy-load below-fold venue widgets** — `RelatedStadiums`, `SeatRecommendationsSection` (already `ssr:false`), `ShadeDataVerified`, `PWAInstallPrompt` — behind `IntersectionObserver`/`next/dynamic` so they don't compete for first-load bandwidth. | S–M | Low | **+1 to +3** |
| L5 | **Image sizing:** none of the heavy pages currently ship above-the-fold raster images (Img ≈ 0 kB in the audit), so there's little to win here today — but it's a prerequisite to keep clean if the SVG widget or hero art is added later. | — | — | ~0 now (preventive) |

**Low-risk subtotal:** roughly **+12 to +20 points**, dominated by L1.

### (b) Higher-risk refactors

| # | Change | Effort | Risk / blast radius | Est. gain |
|---|---|---|---|---|
| R1 | **Never ship guide/section data to the client.** Render the guide + section tables entirely in Server Components and pass only the small, selected slice the client island needs. This is the clean version of L1 and kills most of the 2.92 MB chunk for good. Touches `getStadiumSectionsAsync`, `ComprehensiveStadiumGuide`, `StadiumPageClient`, `UnifiedApp`, and the ~19 files listed in `BUNDLE_OPTIMIZATION.md` that still import section data. | L | **High** — data flows through many components; risk of hydration mismatches and SEO regressions if SSR output changes. Needs the full Playwright/visual/a11y suite. | **+6 to +12** on top of L1 |
| R2 | **Replace `react-select`** (279 kB) with a native `<select>` or a ~5–10 kB combobox for the venue/game pickers. | M | Med — the pickers are central UX; keyboard/a11y and mobile behavior must be re-verified. | **+2 to +5** |
| R3 | **Drop `react-helmet-async`** (27 kB + transitive) in favor of Next's native metadata API, which the app already uses elsewhere. | M | Med — `SEOHelmet`/`UnifiedApp` rely on it; must confirm no `<head>` tags are lost for SEO. | **+1 to +2** |
| R4 | **Trim `date-fns` imports** to per-function imports (or swap for a smaller formatter) to shrink the 168 kB date footprint. | S–M | Low–Med | **+1 to +2** |
| R5 | **Split the `vendor` chunk by feature** so the game-selector libs aren't in the baseline every route pays for. | M | Med — interacts with R1/L1; measure, don't assume. | **+1 to +3** |

**Refactor subtotal (on top of low-risk):** roughly **+10 to +20 more points**, dominated by
R1 (the data refactor) and R2 (`react-select`).

---

## 3. Realistic projection

Starting point (lab): **Home 76 / Venue 69** (field 65–71).

| Scenario | Homepage | Venue page | Reasoning |
|---|---|---|---|
| **Low-risk wins only (L1–L4)** | **~85–90** | **~80–85** | L1 removes ~338 kB gzip from the first-load critical path; LCP drops from ~5.4 s toward ~3–3.5 s (home) / ~8.3 s toward ~5 s (venue). LCP is still the ceiling because both are text elements over a throttled link. |
| **Low-risk + refactors (add R1–R3)** | **~93–96** | **~90–94** | With guide/section data off the client entirely and `react-select` gone, first-load JS drops toward ~200–260 kB. LCP can reach the ~2–2.5 s "green" band. Venue page stays a touch lower due to its larger SSR DOM. |
| **Theoretical ceiling** | ~96–98 | ~94–97 | A perfect 100 mobile is unrealistic while Google Analytics and the interactive shade app load; ~95 is the practical target. |

Confidence: **high** that low-risk gets to the mid-80s (L1 is a direct, measurable removal of
critical-path bytes); **medium** on the exact refactor ceiling (LCP under simulated Slow-4G is
sensitive to the last few round-trips).

---

## 4. Impact on adding a NEW interactive SVG shade diagram to venue pages

Short answer: **feasible, but slim the venue page first (do at least L1).** Today the venue
page is already the worst page on the site — LCP 8.3 s, TBT 300 ms, 605 kB first-load JS,
43 kB SSR HTML. Adding an interactive widget to it as-is will regress those numbers.

Specific risks and guard-rails for the widget:

1. **Don't let it become the LCP element.** A large SVG placed above/near the fold will be
   the largest contentful element and inherit the current 8.3 s LCP problem. Keep the shade
   diagram **below the fold**, or ensure the SSR guide text still out-sizes it, so LCP stays a
   fast-path text node.
2. **Lazy-load the interactivity.** SSR a static SVG shape for SEO/first paint if you want it
   indexed, then hydrate interactivity via `next/dynamic(ssr:false)` gated on
   `IntersectionObserver`. This keeps it off the first-load critical path (same pattern already
   used for `SeatRecommendationsSection`).
3. **Do not add a charting/viz library.** `d3` (full), `recharts`, `visx`, etc. would re-bloat
   the `vendor` chunk by 100–300 kB and undo the wins above. Hand-roll the SVG (paths + a few
   event handlers) or use a <10 kB helper. The app already computes shade geometry
   (`suncalc`, `sunCalculations`, `getUnifiedVenueShade`) — reuse that data, don't add a
   rendering dependency.
4. **Reuse existing data, don't ship more.** The widget will want section geometry/orientation.
   After R1 that data lives server-side; pass the *single venue's* slice to the widget as props.
   If R1 isn't done, the widget importing section data risks pulling the 2.92 MB `data` chunk
   into its client bundle — the exact trap that caused today's problem.
5. **Watch TBT and CLS.** Interactive SVG hit-testing/animation adds main-thread work (TBT is
   already 300 ms). Reserve the widget's box (fixed aspect-ratio container) so it doesn't shift
   layout — CLS is currently a perfect 0 and is easy to lose.

**Verdict:** the venue page **cannot comfortably absorb a heavy interactive widget in its
current state**, but it **can** absorb a lazy-loaded, dependency-free, below-fold SVG **after
L1** (and ideally R1). Sequence it: ship L1 → confirm venue LCP improves → then add the widget
behind lazy hydration.

---

## Appendix — key evidence

- Route table: `/` = 593 kB First Load JS; `/stadium/[stadiumId]` = 605 kB.
- `app-build-manifest.json`: `data-*.js` (2.92 MB) listed as a first-load chunk for **both**
  `/page` and `/stadium/[stadiumId]/page`.
- Analyzer attribution of `data` chunk: `guides` 3.13 MB, `stadium-data-aggregator` 2.16 MB,
  `stadiumSections-split` 0.93 MB, `venueSections` 0.75 MB.
- Analyzer attribution of `vendor` chunk: `next` 1.52 MB, `react-select` 279 kB,
  `react-dom` 131 kB, `date-fns(+tz)` 168 kB, `react-helmet-async` 27 kB.
- Lighthouse mobile: Home 76 (LCP 5.4 s / 20, TBT 210 ms, CLS 0); Venue 69 (LCP 8.3 s / 2,
  TBT 300 ms, CLS 0).
- LCP elements: homepage hero subheadline `<p>`; venue guide paragraph `<p>` — both SSR text.
- Render-blocking: 21 CSS files; est. 530 ms savings. Unused JS: 414 KiB on homepage.
- Root-cause config: `next.config.js` `splitChunks.cacheGroups.data` (`name:'data'`,
  `enforce:true`, `chunks:'all'`) merges lazy + always-needed `src/data/*` into one first-load chunk.
