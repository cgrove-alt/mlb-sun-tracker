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

### P0 — Quick wins (schema + metadata)

- [ ] **S3-1** Fix homepage H1: "Find Your Shade" → "Find Seats in the Shade"
      - File: app/HomePage.tsx line 37
      - Exact keyword match for "seats in the shade" / "find shaded seats"

- [ ] **S3-2** Add standalone StadiumOrArena + GeoCoordinates JSON-LD to all 30 stadium pages
      - File: app/stadium/[stadiumId]/page.tsx
      - Current: Article schema has a nested `about.StadiumOrArena` stub — not a standalone entity
      - Add: separate `<script type="application/ld+json">` with StadiumOrArena @type, name, geo.latitude, geo.longitude, address (city + state + addressRegion), sport: "Baseball", url
      - This tells Google precisely what entity the page describes

- [ ] **S3-3** Add HowTo schema to how-to-find-shaded-seats guide
      - File: app/guide/how-to-find-shaded-seats/page.tsx
      - Steps map to the "Quick Tips" ordered list (5 steps already in the page)
      - Add JSON-LD inline in the page component

- [ ] **S3-4** Add HowTo schema to avoid-sun-baseball-games guide
      - File: app/guide/avoid-sun-baseball-games/page.tsx
      - Same approach as S3-3

- [ ] **S3-5** Add BreadcrumbList schema to all 4 guide pages
      - Files: all app/guide/***/page.tsx
      - Matches the visible breadcrumb nav already in the HTML (Home / Guides / [page name])

- [ ] **S3-6** Add `lastmod` to all sitemap files + create image sitemap
      - Files: public/sitemap.xml, public/sitemap-stadiums.xml, public/sitemap-guides.xml
      - Add `<lastmod>2026-03-26</lastmod>` to every `<url>` block (today's date = last deploy date)
      - Create public/sitemap-images.xml with logo/OG image entries for key pages
      - Update public/sitemap-index.xml to include the new image sitemap

### P1 — SSR fix for stadium pages

- [ ] **S3-7** Fix SSR on stadium pages: move StadiumPageSSR out of `<noscript>`
      - File: app/stadium/[stadiumId]/page.tsx lines 208-218
      - Problem: SSR content is inside `<noscript>` — Googlebot RUNS JavaScript so it never sees this block
      - Fix: render StadiumPageSSR as always-visible server content (static info section below the interactive tool)
      - This gives Google real stadium content to index on each /stadium/[id] page

### P2 — Blog content (30 MLB stadium posts)

- [ ] **S3-8** Write 10 MLB stadium shade guide blog posts (batch 1 — highest-traffic teams)
      - Stadiums: yankees, dodgers, redsox (fenway), cubs (wrigley), giants (oracle), mets (citi), cardinals, phillies, braves, astros
      - Format: MDX frontmatter + 600-900 word guide per stadium
      - Include: stadium orientation, best shaded sections, day game vs evening game tips, specific sections by name
      - File path: content/blog/shaded-seats-[stadium-name].mdx

- [ ] **S3-9** Write 10 MLB stadium shade guide blog posts (batch 2)
      - Stadiums: rangers, padres, mariners, tigers, twins, guardians, rockies, pirates, brewers, diamondbacks

- [ ] **S3-10** Write 10 MLB stadium shade guide blog posts (batch 3)
      - Stadiums: reds, royals, orioles, marlins, rays, whitesox, athletics, bluejays, angels, nationals

### Already done (crossed off from original list)
- [x] Add FAQPage schema to /faq page — already present with 22 detailed Q&As ✓

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

---

## Sprint 3 Review (Completed)

**Homepage H1** (`app/HomePage.tsx`):
- Changed "Find Your Shade" → "Find Seats in the Shade" (exact keyword match for primary search intent)

**StadiumOrArena JSON-LD schema** (`app/stadium/[stadiumId]/page.tsx`):
- Added standalone `StadiumOrArena` entity with GeoCoordinates, PostalAddress, capacity, and sport fields
- Added third `<script type="application/ld+json">` block alongside existing Article and FAQ schemas
- Updated `about` stub in Article schema to use `@id` reference to the new entity

**HowTo schemas** (guide pages):
- Added 6-step HowTo schema to `app/guide/how-to-find-shaded-seats/page.tsx`
- Added 6-step HowTo schema to `app/guide/avoid-sun-baseball-games/page.tsx`
- Steps derived from actual guide content — Google can render these as rich results

**BreadcrumbList schemas** (all 4 guide pages):
- Added BreadcrumbList JSON-LD to all 4 guide pages (`/guide`, `/guide/best-shaded-seats-mlb`, `/guide/how-to-find-shaded-seats`, `/guide/avoid-sun-baseball-games`)
- All schemas match the visible breadcrumb nav already in the page markup

**Sitemap lastmod** (`public/sitemap.xml`, `public/sitemap-stadiums.xml`, `public/sitemap-guides.xml`):
- Added `<lastmod>2026-03-26</lastmod>` to all URLs across all sitemaps
- Proper `changefreq` set: daily for homepage, weekly for guides/stadiums, yearly for privacy/terms

**Image sitemap** (`public/sitemap-images.xml`, `public/sitemap-index.xml`):
- Created new `sitemap-images.xml` with `xmlns:image` extension
- Covers homepage (logo512.png, og-image.png) and 3 guide pages
- Added to `sitemap-index.xml`

**SSR fix on stadium pages** (`app/stadium/[stadiumId]/page.tsx`):
- Root cause: `StadiumPageSSR` was wrapped in `<noscript>` — Googlebot runs JS and never sees noscript content
- Fix: removed `<noscript>` wrapper so rich SEO content (orientation recs, sections table, FAQs) is always rendered
- Also removed dead `isBot`/`preferSSR` variables that served no purpose

**28 MLB stadium blog posts** (`content/blog/shaded-seats-*.mdx`):
- Created one shade guide post per MLB stadium (28 new posts + 3 existing = 31 total)
- Each post: ~650-900 words, accurate shade analysis based on orientation data from stadiums.ts
- Special handling for retractable roof stadiums (Astros, Rangers, Brewers, Diamondbacks, Marlins, Blue Jays) and unusual orientations (Mariners, Rays, Athletics, Twins all have NNW-ish orientation → first base shade)
- Noted Rays' temporary home (Steinbrenner Field) and Athletics' Sacramento relocation

**Blog sitemap update** (`public/sitemap-guides.xml`):
- Added all 31 blog post URLs with lastmod 2026-03-26, changefreq monthly, priority 0.6
