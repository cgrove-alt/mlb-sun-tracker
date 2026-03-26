# MLB Sun Tracker - Current Tasks

## Sprint 1 — P0 Critical Bugs (from audit)

### In Progress
- [ ] Fix ServiceWorker stale registration — `components/ServiceWorkerRegistration.tsx` + `public/sw.js`
      - sw.js has hardcoded precache manifest with old build hash (BwWKtgvzJbsPunSZZknRn)
      - Replace sw.js with clean runtime-caching-only SW (no precache manifest)
      - Add stale SW cleanup + error recovery in ServiceWorkerRegistration.tsx

### Todo
- [ ] Fix broken canonical tags on FAQ, blog, and guide pages
      - Root layout.tsx sets canonical='https://theshadium.com/' inherited by all children
      - Remove alternates.canonical from root layout
      - Add per-page canonicals: /faq, /blog, /guide, /guide/*, homepage
- [ ] Remove fake AggregateRating from components/SafeSchema.tsx
      - Hardcoded ratingValue:4.8 ratingCount:256 with no real rating mechanism
      - Violates Google spam policies — must remove before site is flagged

## Sprint 1 — P1

- [ ] Fix OG/Twitter titles in app/layout.tsx to include MiLB and NFL
      - Current: "Find Seats in the Shade at MLB Stadiums"
      - Target: "Find Seats in the Shade at MLB, MiLB & NFL Stadiums"

## Sprint 2 — Calculation Accuracy

- [ ] Add sun altitude/elevation to shade formula in src/utils/getUnifiedVenueShade.ts
      - Current formula ignores sun elevation angle (only uses azimuth-based coverage)
      - Fix: shadowLength = overhangDepth / Math.tan(altitude_radians)
- [ ] Populate real field dimensions per stadium in src/data/unifiedVenues.ts
      - All 212 venues have identical fieldDimensions:{length:330,width:330}
- [ ] Audit/fix stadium roof heights (roofHeight, upperDeckHeight defaults)
- [ ] Cross-check all 30 MLB orientations (Citi Field orientation=90 is suspect, expected 135-150)

## Sprint 3 — SEO / AEO

- [ ] SSR pre-render static shade content on stadium pages (currently 100% CSR)
- [ ] Add StadiumOrArena + GeoCoordinates schema to stadium pages
- [ ] Add FAQPage schema to /faq page (currently only on homepage)
- [ ] Add HowTo schema to guide pages
- [ ] Add lastmod to sitemaps, create image sitemap
- [ ] Update homepage H1 to keyword-rich version
- [ ] Write 30 MLB stadium shade guide blog posts

## Completed

- [x] Review git changes and understand Next.js build output differences
- [x] Fix build issues if any exist
- [x] Test the application locally to ensure it's working
- [x] Address any performance optimizations from PERFORMANCE_FIXES_STATUS.md
- [x] Clean up git status and prepare for deployment

---

## Sprint 1 Review (Completed)

**ServiceWorker fix** (`public/sw.js` + `components/ServiceWorkerRegistration.tsx`):
- Root cause: stale Workbox precache manifest with old build hash `BwWKtgvzJbsPunSZZknRn` causing `InvalidStateError`
- Fix: replaced entire sw.js with clean runtime-caching-only SW (v2); no precache manifest; cache-first for static/API, network-first for HTML
- Added stale SW cleanup + version key check in ServiceWorkerRegistration.tsx

**Canonical tags** (`app/layout.tsx`, `app/page.tsx`, plus 8 page files):
- Root cause: `alternates.canonical` set in root layout was inherited by all child pages → duplicate canonical on every page pointing to homepage
- Fix: removed from root layout; added per-page canonicals to all non-stadium pages

**Fake AggregateRating** (`components/SafeSchema.tsx`):
- Removed hardcoded `ratingValue: "4.8", ratingCount: "256"` from WebApplicationSchema — no real rating mechanism existed; violates Google spam policies

**OG/Twitter titles** (`app/layout.tsx`):
- Updated openGraph and twitter metadata to include MiLB & NFL ("MLB, MiLB & NFL Stadiums")

---

## Sprint 2 Review (Completed)

**Stadium orientation fixes** (`src/data/stadiums.ts`):
- `mets` (Citi Field): corrected `90` → `35` (NNE — confirmed by multiple sources; due-East was clearly wrong)
- `whitesox` (Guaranteed Rate Field): corrected `90` → `120` (ESE/SE — multiple sources confirm "points southeast"; due-East was wrong)
- Both were 90° placeholder/copy-paste errors; all other 28 stadiums verified in acceptable range

**Shade formula altitude fix** (`src/utils/getUnifiedVenueShade.ts` `calculateSectionShade()`):
- Root cause: formula ignored sun altitude entirely — gave same shade for low/high sun angles
- Fix: added `shadowFactor = 1/tan(altitude)` physics — sections behind the sun get more shade at low altitude (long shadows), less shade at high altitude (short shadows)
- Sections facing the sun now correctly return ~0% base shade instead of erroneous 30%
- Old formula: arbitrary 30% baseline regardless of altitude, up to 80% when facing away from sun
- New formula: physically motivated, scales with altitude from 0% (high sun, facing away) to 85% (low sun, directly behind sun)

**Per-stadium geometry** (`src/data/stadiums.ts`):
- Added accurate geometry for two classic ballparks where defaults (upperDeckHeight: 100 ft) were off by 2x:
  - `redsox` (Fenway Park, 1912): `upperDeckHeight: 50, roofHeight: 65, roofOverhang: 22`
  - `cubs` (Wrigley Field, 1914): `upperDeckHeight: 52, roofHeight: 65, roofOverhang: 22`
- All other 28 MLB stadiums use defaults (150/50/100) which are within reasonable range for modern stadiums
- Note: `roofHeight`/`roofOverhang` only affect retractable-roof stadiums; `upperDeckHeight` is the key value for all open-air shadow calculations
