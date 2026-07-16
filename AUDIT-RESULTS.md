# AUDIT-RESULTS.md — SEO/GEO/UX audit remediation

Branch: `audit-fixes` · PR: #70 → `main` · Not yet deployed (deploy triggers on merge).

All eight phases are implemented, each as its own commit, and verified against the
**built HTML** (and the test suite where relevant) rather than assumptions.

---

## Summary of changes by phase

### Phase 1 — URL duplication
- Consolidated all 182 venues under the single canonical `/stadium/{id}`. The `/stadium` route now serves MLB (rich SSR+client) and MiLB/NFL (comprehensive guide); the old `/venue` route was deleted.
- Repointed every internal `/venue/` link to `/stadium/` (HomePage, league page + client, StickyTopNav, UnifiedApp, MobileApp) and fixed 3 pre-existing broken homepage links (`metlife-stadium` → `metlife-stadium-giants`, `las-vegas-ballpark` → `las-vegas-aviators`, `sofi-stadium` → `sofi-stadium-rams`).
- Sitemap emits only `/stadium/` URLs (182, zero `/venue/`). Removed stale, unserved root `robots.txt` and `sitemap.xml`; the served copies live in `public/`.

### Phase 2 — double-render
- Removed the second `<h1>`: each venue page now renders exactly one `StadiumTitleBlock`. Header facts (location, capacity, orientation, league) now come from the structured venue record, fixing the "South Bronx," (missing state) bug, the 46,537-vs-47,309 capacity conflict, and the hardcoded "MLB" league on MiLB/NFL pages.
- Added `scripts/auditVenueData.js` (182 venues, 0 malformed).

### Phase 3 — shade-data accuracy (3-tier model)
- Replaced the binary `covered` flag with **Covered / Partial (back rows) / Exposed**. Corrected Yankee Stadium (bleachers + field not covered; 100/200/300/400 back-rows-only under overhang/roof); White Sox (upper deck was 100% "guaranteed shade" → back-rows partial, per the file's own docs).
- FAQ now orientation-derived (Yankees → first base for 1 PM). De-duplicated the repeating month recommendations.
- Left Fenway as-is — the flagged field coverage is documented/defensible (press-box overhang, roofed Grandstand, indoor EMC Club).
- Added `scripts/auditSuspiciousCoverage.ts` (now clean).

### Phase 4 — structured data
- Every venue page emits **Article + StadiumOrArena + FAQPage + BreadcrumbList** as `<script type="application/ld+json">` (MiLB/NFL previously emitted none). The suspected JSON-LD-in-`<meta>` bug lived in the deleted `/venue` route.
- Homepage: added **Organization + WebSite (SearchAction)**. Real `datePublished` (2025-04-01, replacing the hardcoded 2024-01-01) + build-stamped `dateModified`. StadiumOrArena has geo + `sameAs` Wikipedia for the 30 MLB parks.
- Added `scripts/validateSchema.js` (0 issues across homepage / MLB / MiLB / NFL / blog).

### Phase 5 — 2026 freshness
- **Rays → Tropicana Field** (St. Petersburg, `roof: 'fixed'`). **Athletics** → team "Athletics" (dropped "Oakland"), West Sacramento. **Rate Field** rename (kept "formerly Guaranteed Rate Field" as a searchable alias).
- Added "Shade data last verified: May 21, 2026" to every venue page (real field). 12-hour game times on the league page; "Baseball Shade Tips" capitalization fix.

### Phase 6 — internal linking & architecture
- `/stadiums` is now a real all-leagues index (was a redirect); added "Browse by League"; fixed a latent division-grouping bug via `src/data/mlbDivisions.ts`.
- Each blog post links to its venue guide via a programmatic match (30/30 venue posts). Fixed third-person voice ("their shade map" → "our"). Added a "Nearby / same-division stadiums" block to every venue page.

### Phase 7 — GEO / AI-search
- Added `/how-it-works` (NREL SPA, orientation/geometry, Open-Meteo, MLB StatsAPI + honest limitations), linked from footer and every venue page. Added an "answer-first" summary at the top of every venue page. Added `public/llms.txt`.
- Shortened the covered-seating FAQ to a by-level summary + expandable list. Removed obsolete meta-keyword arrays. Corrected the inaccurate "250+" venue count → "180+".

### Phase 8 — social/visual & UX polish
- **Per-venue OG images** (182 branded 1200×630 PNGs via `opengraph-image.tsx`), replacing the generic logo512. Emoji action buttons confirmed labeled (+ `aria-hidden` glyphs). **At-a-glance color-coded seating-bowl SVG** on MLB pages (SSR). Verified critical content is server-rendered and interactive components show loading states.

---

## 301 redirects created

| Source | Destination | Status | Mechanism |
|---|---|---|---|
| `/venue/:venueId` (all 182) | `/stadium/:venueId` | **301** | `next.config.js` `redirects()` with explicit `statusCode: 301` |

(Existing slug-alias redirects inside the `/stadium` route are unchanged.)

---

## Remaining known issues / scoped follow-ups

1. **Seating-bowl on MiLB/NFL** — the SVG bowl is MLB-only for now (verified section geometry). Extending to the 152 MiLB/NFL pages needs sections loaded into `ComprehensiveStadiumGuide` and a MiLB `baseAngle` data-quality audit. Est. ~0.5 day.
2. **OG images are venue-only** — homepage, league, and blog pages still use the default image. Adding `opengraph-image.tsx` to those routes is a small follow-up.
3. **Partial-coverage back-row cutoff is modeled** (back ~40% of rows), not individually surveyed per section; White Sox/Fenway use a generic rule vs. Yankees' section-by-section research.
4. **`sameAs` Wikipedia is MLB-only** ("where available"); MiLB/NFL can be added to `src/data/stadiumWikipedia.ts` over time.
5. **Interactive game-time bowl** — the current bowl is a static 1 PM snapshot; a game-time-interactive version tied to the picker is a larger client-side lift (not built).

---

## Manual tasks for you (post-merge / post-deploy)

- [ ] **Merge PR #70** → this triggers the Vercel production deploy.
- [ ] **Google Search Console:** submit the updated sitemap (`https://theshadium.com/sitemap-index.xml`) and **request re-indexing** of the canonical `/stadium/` URLs. Watch the "Duplicate, Google chose different canonical" report drop as the `/venue/` 301s are recrawled.
- [ ] **Validate structured data:** run the [Rich Results Test](https://search.google.com/test/rich-results) on the homepage, one venue page, and one blog post (our `scripts/validateSchema.js` is a structural lint, not a substitute).
- [ ] **Verify 2026 venues** are correct in production: Rays = Tropicana Field (St. Petersburg); Athletics = Sutter Health Park (West Sacramento), name "Athletics"; White Sox = Rate Field.
- [ ] **PageSpeed / Lighthouse before-and-after** on a venue page (the SSR content + per-venue OG image should help; watch the OG image render cost).
- [ ] **Social preview check:** paste a `/stadium/{id}` URL into the [X card validator](https://cards-dev.twitter.com/validator) / Facebook Sharing Debugger to confirm the new per-venue OG image renders.
- [ ] **Confirm `llms.txt`** is reachable at `https://theshadium.com/llms.txt` after deploy.
- [ ] Optionally schedule the scoped follow-ups above (MiLB/NFL bowl, homepage/league/blog OG images).

---

## New repeatable scripts

- `node scripts/auditVenueData.js` — flags malformed venue city/state/capacity/orientation.
- `npx tsx scripts/auditSuspiciousCoverage.ts` — flags implausible coverage patterns.
- `node scripts/validateSchema.js` — validates JSON-LD on built pages (run after `npm run build`).
