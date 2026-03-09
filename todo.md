# Find Your Shade UX Overhaul

## Tasks
- [x] Task 1: Fix broken hero browse links (`/mlb` → `/league/mlb`, etc.)
- [x] Task 2: Fix broken "Shade Finder Tool" nav link in StickyTopNav
- [x] Task 3: Build guided ShadeFinder component (league → stadium → go)
- [x] Task 4: Change hero CTA to scroll to `#shade-finder`
- [x] Task 5: Replace VenueSelector with ShadeFinder on homepage, reorder sections
- [x] Task 6: Add CTA to HowItWorks section
- [x] Task 7: CSS cleanup — rename dead `.hero-cta-button` references
- [x] Bonus: Fix HeroSection test file (removed `onGetStarted` prop)

## Review

### Changes Summary

**New file (1):**
1. `src/components/ShadeFinder/ShadeFinder.tsx` — Guided 2-step picker: league buttons (2x2 mobile, 4-across desktop) → searchable stadium dropdown → Go button navigates to `/stadium/{id}` or `/venue/{id}`. Uses existing `getVenuesByLeague()` data. Styled with JSX CSS, mobile-first, 48px touch targets, reduced-motion support.

**Modified files (7):**

1. `src/components/HeroSection/HeroSection.tsx` — Fixed 4 broken browse hrefs (`/mlb` → `/league/mlb`, `/nfl` → `/league/nfl`, `/world-cup-2026` → `/worldcup2026`, `/milb` → `/league/milb`). Changed CTA from `<button>` scrolling to `#app-section` to `<a href="#shade-finder">` with text "Find Your Shade". Removed unused `onGetStarted` prop and `HeroSectionProps` interface.

2. `components/StickyTopNav.tsx` — Changed "Shade Finder Tool" link from `/#app-section` to `/#shade-finder`. Removed broken `setTimeout`/`querySelector('.hero-cta-button')` hack.

3. `app/HomePage.tsx` — Replaced `VenueDataProvider` + `#app-section` with `ShadeFinder` component. Removed `Suspense`, `HomePageSkeleton`, `VenueDataProvider` imports. Reordered: Hero → ShadeFinder → TodaysGames → HowItWorks → Popular Stadiums → WorldCup.

4. `src/components/HowItWorks/HowItWorks.tsx` — Added "Find Your Shade" `<a href="#shade-finder">` CTA button below methodology paragraph with gradient styling.

5. `app/critical-styles-inline.tsx` — Renamed `.hero-cta-button` → `.hero-cta-primary` (2 occurrences).

6. `src/styles/mobile-optimizations.css` — Renamed `.hero-cta-button` → `.hero-cta-primary` (1 occurrence).

7. `src/components/HeroSection/__tests__/HeroSection.test.tsx` — Updated tests: removed `onGetStarted` prop, changed CTA assertions from `getByRole('button')` to `getByRole('link')` with `href="#shade-finder"`.

### Verification
- `npx tsc --noEmit` — zero TypeScript errors
- `npm run build` — production build succeeds (536 files compressed)
