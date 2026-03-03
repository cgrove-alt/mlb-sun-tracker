# SEO & AEO Sprint - Implementation Plan

## Task 1: Fix Schema.org Structured Data on Venue Pages
- [x] Remove `verification.other` block (lines 124-159) from `generateMetadata()` in `app/venue/[venueId]/page.tsx`
- [x] Add `generateStadiumOrArenaSchema()` to `src/utils/seoSchema.ts`
- [x] Add `generateVenueFAQSchema()` to `src/utils/seoSchema.ts`
- [x] Render `<SafeSchema>` in venue page body for Article, StadiumOrArena, FAQPage, and BreadcrumbList schemas

## Task 2: Dynamic Sitemap via Next.js App Router
- [x] Create `app/sitemap.ts` with `MetadataRoute.Sitemap` export
- [x] Include static pages, league pages, all venue pages, stadium pages, WC venue pages, guide pages

## Task 3: Dynamic robots.txt with AI Bot Access
- [x] Create `app/robots.ts` with `MetadataRoute.Robots` export
- [x] Allow AI bots (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, etc.)
- [x] Keep blocking bad bots (AhrefsBot, SemrushBot, etc.)
- [x] Rename `public/robots.txt` to `public/robots.txt.bak`

## Task 4: AEO "Quick Facts" Section on Venue Pages
- [x] Create `src/components/VenueQuickFacts.tsx` with semantic `<dl>` layout
- [x] Render `<VenueQuickFacts>` in venue page body

## Task 5: Meta Tags Audit
- [x] Add `og:image` to World Cup venue metadata (was missing from /venue/[venueId] WC branch)
- [x] Verify homepage/layout OG tags are consistent (already good — title, description, og:image, twitter:card all present)

## Task 6: Internal Linking (Nearby Venues)
- [x] Create `src/utils/getNearbyVenues.ts`
- [x] Create `src/components/NearbyVenues.tsx`
- [x] Render `<NearbyVenues>` at bottom of venue page

## Task 7: Long-Tail Sub-Pages
- [x] Create `app/venue/[venueId]/shade-guide/page.tsx`
- [x] Create `app/venue/[venueId]/best-seats/page.tsx`
- [x] Create `app/venue/[venueId]/weather/page.tsx`
- [x] Add sub-pages to sitemap in `app/sitemap.ts`

---

## Review

### Changes Summary

**New files (8):**
1. `app/sitemap.ts` — Dynamic sitemap via Next.js MetadataRoute, auto-generates entries from ALL_UNIFIED_VENUES, ALL_WORLD_CUP_VENUES, and MLB_STADIUMS. Includes sub-pages.
2. `app/robots.ts` — Dynamic robots.txt allowing AI bots (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended) while blocking bad bots.
3. `src/components/VenueQuickFacts.tsx` — Server component with semantic `<dl>` showing Capacity, Roof Type, Field Orientation, Location, League, Home Team, Sport, Timezone.
4. `src/utils/getNearbyVenues.ts` — Finds 5 closest venues using haversine distance from `venueDistance.ts`.
5. `src/components/NearbyVenues.tsx` — Server component rendering linked list of nearby venues with league badges and distances.
6. `app/venue/[venueId]/shade-guide/page.tsx` — Shade analysis at 1 PM, 4 PM, 7 PM using real `getSunPosition()` calculations. Shows shaded/sunny sides per game time.
7. `app/venue/[venueId]/best-seats/page.tsx` — Ranked seating areas by shade coverage at 1 PM reference time.
8. `app/venue/[venueId]/weather/page.tsx` — Weather averages (WC venues from weatherAverages.ts, others from latitude estimates), climate zone, game day tips.

**Modified files (3):**
1. `app/venue/[venueId]/page.tsx` — Removed broken `verification.other` schema; added SafeSchema for Article, StadiumOrArena, FAQPage, BreadcrumbList; added VenueQuickFacts and NearbyVenues; added og:image + twitter to WC venue metadata.
2. `src/utils/seoSchema.ts` — Added `generateStadiumOrArenaSchema()`, `generateVenueFAQSchema()`, `generateArticleSchema()`.
3. `public/robots.txt` → renamed to `public/robots.txt.bak`.

### Verification
- `npx tsc --noEmit` — zero TypeScript errors
- `npm run build` — 883 static pages generated successfully
- `/sitemap.xml` and `/robots.txt` routes present as dynamic (○ Static)
- All 3 sub-page routes generating for all venues (shade-guide, best-seats, weather)
- Schema data now in proper `<script type="application/ld+json">` tags via SafeSchema
