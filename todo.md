# World Cup 2026 — Complete Venue Data & Feature Sprint

## Task 1: Verify & Fix World Cup Venue Data
- [x] Check field orientations for Estadio Azteca, Estadio Akron, Estadio BBVA against reference values (~350°, ~15°, ~350°)
- [x] Fix any orientation discrepancies (Azteca 0→350°, Akron 0→15°, BBVA 0→350°)

## Task 2: Pre-compute Shade Guides
- [x] Create `src/data/worldcup2026/shadeGuides.ts` with VenueShadeGuide and KickoffShadeAnalysis interfaces
- [x] Write computation logic using getSunPosition + calculateRowShadows for 11 open-air venues at 4 kickoff times
- [x] Store pre-computed results as static data (roofed venues get shadeScore=10)

## Task 3: Fix Match Schedule (Critical Bug)
- [x] Fix R32 dates: July 4-11 → June 28-July 3
- [x] Fix R16 dates: July 13-16 → July 4-7 (with correct venue assignments per FIFA)
- [x] Fix QF dates: July 17-18 → July 9-11 (Foxborough, LA, KC, Miami)
- [x] Fix SF dates: July 21-22 → July 14-15
- [x] Fix 3rd Place date: July 26 → July 18
- [x] Update `types.ts`: thirdPlaceMatch.date → '2026-07-18', endDate → '2026-07-19'
- [x] Fix schedule page max date filter from 07-26 to 07-19

## Task 4: Improve World Cup Venue Detail Pages
- [x] Create `src/components/worldcup/ShadeAnalysisSection.tsx` — 4 kickoff time cards
- [x] Create `src/data/worldcup2026/weatherAverages.ts` — static weather data per venue city
- [x] Create `src/components/worldcup/ShadeTipCards.tsx` — contextual shade tips
- [x] Add shade analysis, weather, and tips sections to VenuePageClient.tsx
- [x] Fix schema rendering in venue page.tsx (moved to `<script type="application/ld+json">`)

## Task 5: World Cup Landing Page Upgrade
- [x] Create `src/components/worldcup/MatchShadeFinder.tsx` — match shade lookup tool
- [x] Create `src/components/worldcup/WorldCupFAQ.tsx` — FAQ section with 8 Q&As
- [x] Add shadeScore prop to VenueCard.tsx and display badge
- [x] Replace hardcoded shade scores in VenueComparisonCard.tsx with real data from shadeGuides
- [x] Add shade indicators to WorldCupScheduleClient.tsx for daytime matches at open-air venues
- [x] Integrate MatchShadeFinder and FAQ into WorldCupLandingClient.tsx
- [x] Add shade score badges to landing page venue grid

## Task 6: World Cup SEO
- [x] Add FAQPage JSON-LD schema to landing page (app/worldcup2026/page.tsx)
- [x] Add SportsEvent schema for key matches on schedule page (opening, semifinals, 3rd place, final)
- [x] Update sitemap generator to include all WC URLs (16 venue pages + compare + venues listing)

## Review

### Changes Summary

**New files (8):**
1. `src/data/worldcup2026/shadeGuides.ts` — Pre-computed shade data for all 16 venues (1164 lines, generated from real NREL sun calculations)
2. `src/data/worldcup2026/weatherAverages.ts` — Static June/July weather averages for 16 venue cities
3. `src/data/worldcup2026/faqData.ts` — FAQ Q&A data (shared between server and client components)
4. `src/components/worldcup/ShadeAnalysisSection.tsx` — Shade analysis with 4 kickoff time cards, weather context
5. `src/components/worldcup/ShadeTipCards.tsx` — 2-3 contextual shade tips per venue
6. `src/components/worldcup/MatchShadeFinder.tsx` — "Find Shade at Your Match" tool with match dropdown
7. `src/components/worldcup/WorldCupFAQ.tsx` — Accordion FAQ component
8. `scripts/generate-shade-guides.ts` — Build-time shade computation script

**Modified files (11):**
1. `src/data/worldcup2026/venues.ts` — Fixed Mexican venue orientations (Azteca 350°, Akron 15°, BBVA 350°)
2. `src/data/worldcup2026/matches.ts` — Fixed all knockout dates (R32, R16, QF, SF, 3rd Place)
3. `src/data/worldcup2026/types.ts` — Fixed endDate and thirdPlaceMatch date
4. `app/worldcup2026/venues/[venueId]/VenuePageClient.tsx` — Added shade analysis, weather, tips sections
5. `app/worldcup2026/venues/[venueId]/page.tsx` — Fixed schema rendering (moved to proper `<script>` tags)
6. `app/worldcup2026/WorldCupLandingClient.tsx` — Added MatchShadeFinder, FAQ, shade scores on venue cards
7. `app/worldcup2026/page.tsx` — Added FAQPage JSON-LD schema
8. `app/worldcup2026/schedule/page.tsx` — Added SportsEvent schema for key matches
9. `app/worldcup2026/schedule/WorldCupScheduleClient.tsx` — Added shade indicators, fixed date filter max
10. `src/components/worldcup/VenueCard.tsx` — Added shadeScore prop with badge display
11. `src/components/worldcup/VenueComparisonCard.tsx` — Replaced hardcoded shade scores with real data
12. `scripts/generate-sitemap.js` — Added 18 WC URLs (16 venues + compare + venues listing)

### Verification
- `npx tsc --noEmit` — zero TypeScript errors
- `npm run build` — 287 static pages generated, all 16 WC venue pages present
- Sitemap generator produces 253 total URLs including all WC pages
- Shade scores verified: open venues 6-9/10, roofed venues 10/10, computed from real sun positions
