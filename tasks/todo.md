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
