# World Cup v2 Implementation Plan

## Overview

This plan breaks down the technical specification into concrete, actionable implementation steps. Each step is designed to be a coherent unit of work that can be completed, tested, and verified independently.

**Key Principles:**
- Simplicity first: minimal code impact per change
- Incremental delivery: working features at each step
- Root cause fixes: no temporary solutions
- 2025+ data: current and accurate

---

## Phase 1: MLB Row-Level Data Foundation (4 weeks)

### Step 1.1: Setup Data Infrastructure & Validation Tools

**Duration:** 3 days
**Priority:** P0
**Dependencies:** None

**Tasks:**
1. Create validation script (`scripts/validate-stadium-data.ts`)
   - Load and parse stadium data files
   - Validate TypeScript interface compliance
   - Check 3D coordinate bounds
   - Verify row numbering consistency
   - Detect duplicate IDs
   - Report coverage statistics

2. Create validation test suite
   - Integration test: load all MLB files
   - Unit tests for validation logic
   - Test edge cases (missing fields, invalid coords)

3. Set up CI/CD validation
   - `.github/workflows/validate-data.yml`
   - Run validation on every PR
   - Fail build if critical errors found

4. Create obstruction file template
   - `src/data/obstructions/mlb/template.ts`
   - Document 3D model creation process
   - Include example obstruction models

**Verification:**
- [ ] `npm run validate-stadium-data` command works
- [ ] All validation tests pass
- [ ] CI/CD pipeline validates data on PR
- [ ] Template file created with documentation

**Files Created:**
- `scripts/validate-stadium-data.ts`
- `scripts/__tests__/validate-stadium-data.test.ts`
- `.github/workflows/validate-data.yml`
- `src/data/obstructions/mlb/template.ts`

---

### Step 1.2: MLB Stadium Data Research & Collection Plan

**Duration:** 2 days
**Priority:** P0
**Dependencies:** Step 1.1

**Tasks:**
1. Document data sources for all 30 MLB stadiums
   - Official team websites (seating charts)
   - Ticketing platforms (SeatGeek, StubHub, Vivid Seats)
   - Stadium architectural data (public records)
   - High-resolution photos for photogrammetry

2. Prioritize stadiums by traffic/importance
   - Tier 1 (High priority): 10 stadiums (Yankee Stadium, Dodger Stadium, etc.)
   - Tier 2 (Medium priority): 10 stadiums
   - Tier 3 (Remaining): 10 stadiums

3. Create data collection methodology document
   - Row elevation calculation formulas
   - 3D coordinate system standards
   - Coverage determination process
   - Quality acceptance criteria

4. Create data collection template/worksheet
   - Standardized format for gathering measurements
   - Checklist for each stadium
   - Fields: sections, rows, elevations, vertices, obstructions

**Verification:**
- [ ] Data source list compiled for all 30 stadiums
- [ ] Stadium priority tiers defined
- [ ] Methodology document written
- [ ] Collection template created

**Files Created:**
- `.zenflow/tasks/world-cup-v2-891f/mlb-data-sources.md`
- `.zenflow/tasks/world-cup-v2-891f/data-collection-methodology.md`
- `.zenflow/tasks/world-cup-v2-891f/stadium-data-template.md`

---

### Step 1.3: Tier 1 MLB Stadiums - Row-Level Data (Week 2)

**Duration:** 5 days
**Priority:** P0
**Dependencies:** Step 1.2

**Stadiums (10):**
1. Yankee Stadium (Yankees)
2. Fenway Park (Red Sox)
3. Dodger Stadium (Dodgers)
4. Wrigley Field (Cubs)
5. Oracle Park (Giants)
6. Camden Yards (Orioles)
7. Petco Park (Padres)
8. Coors Field (Rockies)
9. Busch Stadium (Cardinals)
10. T-Mobile Park (Mariners)

**Tasks per stadium:**
1. Research official seating charts
2. Extract section geometry (60-100+ sections)
3. Calculate row elevations and depths
4. Define 3D vertices for section boundaries
5. Document coverage (roof/overhang details)
6. Create obstruction models (roof, upper deck, scoreboards)
7. Validate data with validation script
8. Fix any validation errors

**Current State Analysis:**
- Camden Yards: Has basic row data, needs enhancement
- Fenway Park: Has detailed sections, needs verification
- Others: Check existing files, enhance or create new

**Verification per stadium:**
- [ ] 60+ sections with row-level data
- [ ] All rows have elevation, depth, seat count
- [ ] 3D vertices defined for each section
- [ ] Obstruction file created
- [ ] Passes validation with zero critical errors
- [ ] Visual spot-check against official charts

**Files Modified/Created:**
- `src/data/sections/mlb/yankee-stadium.ts` (enhance existing)
- `src/data/sections/mlb/fenway-park.ts` (verify/enhance)
- `src/data/sections/mlb/dodger-stadium.ts`
- `src/data/sections/mlb/wrigley-field.ts`
- `src/data/sections/mlb/oracle-park.ts`
- `src/data/sections/mlb/camden-yards.ts` (enhance)
- `src/data/sections/mlb/petco-park.ts`
- `src/data/sections/mlb/coors-field.ts`
- `src/data/sections/mlb/busch-stadium.ts`
- `src/data/sections/mlb/t-mobile-park.ts`
- `src/data/obstructions/mlb/yankee-stadium-obstructions.ts` (10 files)

---

### Step 1.4: Tier 2 MLB Stadiums - Row-Level Data (Week 2-3)

**Duration:** 5 days
**Priority:** P0
**Dependencies:** Step 1.3

**Stadiums (10):**
1. Truist Park (Braves)
2. Minute Maid Park (Astros)
3. Globe Life Field (Rangers)
4. Chase Field (Diamondbacks)
5. Great American Ball Park (Reds)
6. PNC Park (Pirates)
7. Citi Field (Mets)
8. Nationals Park (Nationals)
9. Target Field (Twins)
10. Progressive Field (Guardians)

**Tasks:** Same as Step 1.3

**Verification:** Same as Step 1.3

**Files Modified/Created:**
- 10 section files in `src/data/sections/mlb/`
- 10 obstruction files in `src/data/obstructions/mlb/`

---

### Step 1.5: Tier 3 MLB Stadiums - Row-Level Data (Week 3)

**Duration:** 5 days
**Priority:** P0
**Dependencies:** Step 1.4

**Stadiums (10):**
1. Citizens Bank Park (Phillies)
2. Guaranteed Rate Field (White Sox)
3. Comerica Park (Tigers)
4. Kauffman Stadium (Royals)
5. American Family Field (Brewers)
6. Rogers Centre (Blue Jays)
7. Angel Stadium (Angels)
8. LoanDepot Park (Marlins)
9. Tropicana Field (Rays)
10. Oakland Coliseum (Athletics)

**Tasks:** Same as Step 1.3

**Verification:** Same as Step 1.3

**Files Modified/Created:**
- 10 section files in `src/data/sections/mlb/`
- 10 obstruction files in `src/data/obstructions/mlb/`

---

### Step 1.6: Enable 3D Shade Calculator for MLB

**Duration:** 2 days
**Priority:** P0
**Dependencies:** Steps 1.3, 1.4, 1.5

**Tasks:**
1. Update stadium loading logic
   - Modify `src/utils/shadeCalculation3DOptimized.ts`
   - Enable `OptimizedShadeCalculator3D` for MLB stadiums
   - Load obstruction models for MLB
   - Configure web worker pool (4 workers)

2. Update API endpoints
   - Verify `/api/stadium/[stadiumId]/rows/shade` works for MLB
   - Add response time monitoring
   - Optimize query performance

3. Add progressive calculation support
   - Show section-level results first
   - Stream row-level results as they compute
   - Progress callbacks for UI updates

4. Implement IndexedDB caching
   - Cache seat-level results (7-day expiry)
   - Key: stadiumId + gameTime + weather
   - Automatic cache invalidation

**Verification:**
- [ ] All 30 MLB stadiums load with 3D calculator
- [ ] Row-level shade calculations complete <2 seconds
- [ ] API endpoints return correct data
- [ ] Web workers parallelizing calculations
- [ ] Caching reduces repeat calculation time by >80%

**Files Modified:**
- `src/utils/shadeCalculation3DOptimized.ts`
- `app/api/stadium/[stadiumId]/rows/shade/route.ts`
- `src/utils/cacheManager.ts` (new file for IndexedDB)

---

### Step 1.7: MLB Data Integration Tests

**Duration:** 2 days
**Priority:** P1
**Dependencies:** Step 1.6

**Tasks:**
1. Create integration test suite
   - Test loading all 30 MLB stadiums
   - Verify data structure matches interfaces
   - Test shade calculations for sample stadiums
   - Benchmark calculation performance

2. Add data integrity tests
   - Verify no duplicate section IDs
   - Check row numbering consistency
   - Validate 3D coordinate bounds
   - Ensure obstructions have valid geometry

3. Performance benchmarks
   - Measure calculation time for each stadium
   - Track bundle size impact
   - Monitor API response times
   - Test concurrent user load

4. Create validation reports
   - Generate report for each stadium
   - Document coverage statistics
   - List any warnings or non-critical issues

**Verification:**
- [ ] All integration tests pass
- [ ] 30/30 stadiums load without errors
- [ ] Average calculation time <2 seconds
- [ ] Bundle size increase <20%
- [ ] Validation reports generated

**Files Created:**
- `src/data/__tests__/mlbDataIntegrity.test.ts`
- `src/data/__tests__/shadeCalculationPerformance.test.ts`
- `scripts/generate-validation-reports.ts`
- `.zenflow/tasks/world-cup-v2-891f/validation-reports/` (30 reports)

---

## Phase 2: UX/UI Modernization (3 weeks)

### Step 2.1: Stadium Diagram Component (2D Interactive Map)

**Duration:** 3 days
**Priority:** P0
**Dependencies:** Phase 1 complete

**Tasks:**
1. Create `StadiumDiagram` component
   - SVG-based 2D top-down view
   - Render section polygons from vertices3D
   - Color-code by shade percentage (5-color scale)
   - Responsive design (mobile/tablet/desktop)

2. Implement interactivity
   - Click/tap to select section
   - Hover for quick preview tooltip
   - Highlight selected section
   - Sync with section list below

3. Create color scale legend
   - 5 colors: Green (0-20%) → Red (80-100%)
   - Color-blind safe palette
   - Clear percentage labels
   - Position: bottom-right of diagram

4. Add accessibility features
   - Keyboard navigation (tab through sections)
   - Screen reader labels for each section
   - ARIA attributes for interactive elements
   - Focus indicators

**Verification:**
- [ ] Diagram renders correctly on all screen sizes
- [ ] Section selection works via click/tap/keyboard
- [ ] Colors accurately represent shade percentages
- [ ] WCAG 2.1 AA compliant (color contrast, keyboard nav)
- [ ] Performance: renders <500ms for 100-section stadium

**Files Created:**
- `src/components/StadiumDiagram/StadiumDiagram.tsx`
- `src/components/StadiumDiagram/StadiumDiagram.module.css`
- `src/components/StadiumDiagram/SectionPolygon.tsx`
- `src/components/StadiumDiagram/ShadeColorScale.tsx`
- `src/components/StadiumDiagram/__tests__/StadiumDiagram.test.tsx`

---

### Step 2.2: Enhanced Section Cards with Row Details

**Duration:** 3 days
**Priority:** P0
**Dependencies:** Phase 1 complete

**Tasks:**
1. Redesign `LazySectionCardModern` component
   - Larger shade percentage display (48px font)
   - Visual icons: sun/shade, covered/uncovered
   - Price tier badges (value/moderate/premium/luxury)
   - Distance and view quality indicators
   - Improved visual hierarchy

2. Create `RowDetailView` component
   - Expandable row breakdown (accordion style)
   - Row-by-row shade percentages
   - Inning-by-inning timeline
   - Optimal arrival time recommendation

3. Add expand/collapse functionality
   - Smooth animation (300ms transition)
   - "View Row Details" button
   - Preserve scroll position on expand
   - Mobile-optimized touch targets (44px min)

4. Integrate with existing section cards
   - Minimal breaking changes
   - Preserve existing filters/sorts
   - Backward compatible with non-row data

**Verification:**
- [ ] Section cards visually improved
- [ ] Row details expand smoothly
- [ ] Inning-by-inning timeline shows shade evolution
- [ ] Mobile touch targets meet accessibility standards
- [ ] Performance: no lag when expanding rows

**Files Modified:**
- `src/components/LazySectionCardModern.tsx`

**Files Created:**
- `src/components/RowDetailView/RowDetailView.tsx`
- `src/components/RowDetailView/RowDetailView.module.css`
- `src/components/RowDetailView/ShadeTimeline.tsx`
- `src/components/RowDetailView/__tests__/RowDetailView.test.tsx`

---

### Step 2.3: Section Comparison Feature

**Duration:** 2 days
**Priority:** P1
**Dependencies:** Step 2.2

**Tasks:**
1. Add comparison mode toggle
   - "Compare Sections" button in filter bar
   - Checkbox on each section card when in comparison mode
   - Select 2-4 sections maximum
   - Visual indication of selected sections

2. Create `SectionComparison` component
   - Side-by-side comparison table
   - Compare: shade %, price, distance, view quality
   - Highlight best value in each category
   - "Winner" badges for top performers

3. Mobile swipe view
   - Swipeable cards for mobile
   - Dots indicator showing position
   - Swipe left/right to compare sections

4. Add comparison state management
   - Track selected sections in React state
   - Persist in URL params for sharing
   - "Clear Comparison" button

**Verification:**
- [ ] Comparison mode toggle works
- [ ] Can select 2-4 sections
- [ ] Side-by-side view on desktop clear and useful
- [ ] Mobile swipe gestures smooth
- [ ] URL params allow sharing comparisons

**Files Created:**
- `src/components/SectionComparison/SectionComparison.tsx`
- `src/components/SectionComparison/ComparisonCard.tsx`
- `src/components/SectionComparison/SectionComparison.module.css`
- `src/components/SectionComparison/__tests__/SectionComparison.test.tsx`

---

### Step 2.4: Filter Presets & Enhanced Filtering

**Duration:** 2 days
**Priority:** P1
**Dependencies:** None (parallel with other steps)

**Tasks:**
1. Define filter presets
   - "Maximum Shade": sunExposure 0-20%, covered preferred
   - "Budget Friendly": value/moderate price, sunExposure 0-50%
   - "Close & Shaded": field/lower level, sunExposure 0-30%
   - "Accessible": wheelchair accessible, sunExposure 0-50%

2. Update `EnhancedSunFilter` component
   - Add preset buttons above filters
   - One-click to apply preset
   - Visual indication of active preset
   - "Custom" label if user modifies preset

3. Improve mobile filter drawer
   - Smoother slide-up animation
   - Better touch targets
   - "Apply" and "Reset" buttons
   - Filter count badge on drawer button

4. Add filter state persistence
   - Save filters to URL params
   - Restore on page load
   - Shareable filter links

**Verification:**
- [ ] All 4 presets work correctly
- [ ] One-click application of presets
- [ ] Mobile drawer smooth and intuitive
- [ ] Filters persist in URL and restore on reload

**Files Modified:**
- `src/components/EnhancedSunFilter.tsx`
- `src/components/MobileFilterSheet.tsx`

**Files Created:**
- `src/components/FilterPresets/FilterPresets.tsx`
- `src/components/FilterPresets/__tests__/FilterPresets.test.tsx`

---

### Step 2.5: Integrate Stadium Diagram into Stadium Detail Page

**Duration:** 1 day
**Priority:** P0
**Dependencies:** Steps 2.1, 2.2

**Tasks:**
1. Update stadium detail page layout
   - Add diagram above section list
   - Desktop: diagram on left, sections on right (60/40 split)
   - Mobile: diagram at top, sections scrollable below
   - Tablet: full-width diagram, sections below

2. Sync diagram with section list
   - Clicking diagram section scrolls to card
   - Selecting card highlights diagram section
   - Bidirectional selection state

3. Add loading states
   - Skeleton loader for diagram while calculating
   - Progressive rendering (show diagram before calculations complete)
   - Spinner for active calculations

4. Performance optimization
   - Lazy load diagram component
   - Debounce selection events
   - Virtual scrolling for section list

**Verification:**
- [ ] Diagram integrated into all stadium pages
- [ ] Bidirectional selection works
- [ ] Layout responsive across screen sizes
- [ ] Loading states clear and smooth

**Files Modified:**
- `app/stadium/[stadiumId]/StadiumPageClient.tsx`
- `app/stadium/[stadiumId]/page.tsx`

---

### Step 2.6: Homepage Redesign

**Duration:** 2 days
**Priority:** P1
**Dependencies:** None (parallel)

**Tasks:**
1. Redesign hero section
   - New headline: "Find Your Shade. Enjoy the Game."
   - Animated background (subtle sun/shadow movement)
   - Prominent league selector
   - Quick venue search (autocomplete)
   - Feature highlights: "250+ Stadiums | Row-Level Accuracy | Real-Time Sun Tracking"

2. Add World Cup 2026 showcase
   - Prominent section below hero
   - Countdown timer to opening match (June 11, 2026)
   - Featured venues carousel (16 venues)
   - CTA button: "Explore World Cup Venues"

3. Create "How It Works" section
   - 3 steps with icons:
     1. Select your stadium
     2. Choose game time
     3. Find your shade
   - Brief explanation of methodology
   - Link to detailed methodology page

4. Add social proof (if available)
   - Usage stats: "Over 100,000 fans found their shade"
   - Testimonials (collect from beta testers)
   - Media mentions (if any)

**Verification:**
- [ ] Hero section engaging and clear
- [ ] World Cup section prominent
- [ ] "How it works" explains value proposition
- [ ] Mobile-optimized layout

**Files Modified:**
- `app/page.tsx`
- `app/HomePage.tsx`

**Files Created:**
- `src/components/HeroSection/HeroSection.tsx`
- `src/components/HowItWorks/HowItWorks.tsx`
- `src/components/WorldCupShowcase/WorldCupShowcase.tsx`

---

### Step 2.7: Mobile UX Polish

**Duration:** 2 days
**Priority:** P1
**Dependencies:** Steps 2.1-2.6

**Tasks:**
1. Optimize touch targets
   - Ensure all buttons ≥44px
   - Increase spacing between interactive elements
   - Improve tap feedback (visual + haptic if available)

2. Enhance mobile filter drawer
   - Faster animation (200ms)
   - Swipe-to-close gesture
   - Backdrop blur effect
   - Better visual hierarchy

3. Improve scrolling performance
   - Virtual scrolling for long section lists
   - Lazy load images
   - Debounce scroll events
   - Optimize re-renders

4. Add mobile-specific features
   - Pull-to-refresh on stadium pages
   - Share button with mobile-optimized sheet
   - PWA install prompt (if not installed)

**Verification:**
- [ ] All touch targets meet accessibility standards
- [ ] Filter drawer smooth and fast
- [ ] No scroll lag with 100+ sections
- [ ] PWA features work correctly

**Files Modified:**
- `src/components/MobileFilterSheet.tsx`
- `app/stadium/[stadiumId]/StadiumPageClient.tsx`
- Multiple component files for touch target improvements

---

### Step 2.8: Performance Optimization & Core Web Vitals

**Duration:** 2 days
**Priority:** P0
**Dependencies:** Phase 2 steps complete

**Tasks:**
1. Bundle analysis and optimization
   - Run `npm run analyze`
   - Identify large dependencies
   - Implement code splitting for stadium data
   - Lazy load non-critical components

2. Image optimization
   - Use Next.js Image component everywhere
   - Implement blur placeholders
   - Lazy load below-fold images
   - Optimize logo/icon sizes

3. Optimize Core Web Vitals
   - LCP: Preload hero image, optimize above-fold content
   - FID: Defer non-critical JavaScript
   - CLS: Reserve space for dynamic content, use aspect ratios

4. Add performance monitoring
   - Implement `web-vitals` library
   - Send metrics to analytics
   - Monitor p75 percentile
   - Set up alerts for regressions

**Verification:**
- [ ] Initial bundle <300 KB (gzipped)
- [ ] Per-stadium chunk <100 KB (gzipped)
- [ ] LCP <2.5s (p75)
- [ ] FID <100ms (p75)
- [ ] CLS <0.1 (p75)
- [ ] Lighthouse Performance score >90

**Files Modified:**
- `next.config.js` (bundle optimization)
- `app/layout.tsx` (performance monitoring)
- Multiple component files (Image optimization)

**Files Created:**
- `src/utils/webVitals.ts`
- `src/utils/performanceMonitoring.ts`

---

## Phase 3: World Cup Feature Completion (2 weeks)

### Step 3.1: World Cup Match Schedule Data

**Duration:** 2 days
**Priority:** P0
**Dependencies:** None

**Tasks:**
1. Create comprehensive match data file
   - All 104 matches with accurate dates/times
   - Group stage matches (48 matches)
   - Knockout rounds (56 matches: R16, QF, SF, 3rd place, Final)
   - Team placeholders for group stage
   - Venue assignments for all matches

2. Add timezone handling
   - Convert all times to UTC
   - Display in user's local timezone
   - Show venue local time
   - Handle DST correctly

3. Create match schedule types
   - Extend existing World Cup types
   - Add match phase enum
   - Include ticketing URLs (if available)
   - Price estimates by section

4. Validate match data
   - Ensure all venues exist in system
   - Check date/time formatting
   - Verify 104 total matches

**Verification:**
- [ ] 104 matches with complete data
- [ ] All venues correctly linked
- [ ] Timezone conversions accurate
- [ ] Data validates against TypeScript types

**Files Modified:**
- `src/data/worldcup2026/matches.ts`

**Files Created:**
- `src/data/worldcup2026/types.ts`
- `src/data/worldcup2026/__tests__/matchData.test.ts`

---

### Step 3.2: Match Schedule Page UI

**Duration:** 3 days
**Priority:** P0
**Dependencies:** Step 3.1

**Tasks:**
1. Create `MatchScheduleGrid` component
   - Table/grid layout showing all matches
   - Columns: Date, Time, Teams, Venue, Phase, Actions
   - Sortable columns
   - Responsive: table on desktop, cards on mobile

2. Implement filtering
   - Country filter (USA, Mexico, Canada)
   - Venue filter (16 venues)
   - Phase filter (Group, R16, QF, SF, Final)
   - Date range picker

3. Add "Find Shaded Seats" integration
   - Button for each match
   - Pre-fills venue and match datetime
   - Navigates to stadium shade finder

4. Create countdown timers
   - "Days until match" for each match
   - Prominent countdown for opening match
   - Update in real-time (or on page load)

**Verification:**
- [ ] All 104 matches displayed
- [ ] Filters work correctly
- [ ] "Find Shaded Seats" links pre-fill correctly
- [ ] Countdown timers accurate
- [ ] Responsive layout works on all devices

**Files Created:**
- `src/components/worldcup/MatchScheduleGrid.tsx`
- `src/components/worldcup/MatchCard.tsx`
- `src/components/worldcup/MatchFilters.tsx`
- `app/worldcup2026/schedule/page.tsx`

---

### Step 3.3: Individual World Cup Venue Pages

**Duration:** 2 days
**Priority:** P1
**Dependencies:** Step 3.2

**Tasks:**
1. Create venue detail pages
   - Route: `/worldcup2026/venues/[venueId]/page.tsx`
   - Show all matches at this venue
   - Display venue info (capacity, roof, city, country)
   - Shade finder link for each match

2. Add venue comparison metadata
   - Climate zone description
   - Typical June weather
   - Accessibility features
   - Transportation info (if available)

3. Create venue cards for venue listing
   - Grid of all 16 World Cup venues
   - Country flag badges
   - Match count per venue
   - Climate zone indicator

4. SEO optimization
   - Meta descriptions for each venue
   - Open Graph tags
   - Schema.org structured data
   - Sitemap inclusion

**Verification:**
- [ ] 16 venue pages created and accessible
- [ ] Matches correctly displayed per venue
- [ ] Venue comparison data complete
- [ ] SEO metadata present on all pages

**Files Created:**
- `app/worldcup2026/venues/[venueId]/page.tsx`
- `src/components/worldcup/VenueCard.tsx`
- `app/worldcup2026/venues/page.tsx`

---

### Step 3.4: Venue Comparison Tool

**Duration:** 2 days
**Priority:** P1
**Dependencies:** Step 3.3

**Tasks:**
1. Create `VenueComparison` component
   - Select 2-4 World Cup venues
   - Side-by-side comparison table
   - Categories: capacity, roof, shade %, climate, accessibility
   - Visual diagrams side-by-side

2. Add comparison features
   - Highlight best/worst in each category
   - "Best for shade" recommendation
   - Distance calculator between venues (for multi-match travelers)
   - Climate comparison for packing tips

3. Implement selection UI
   - Checkbox on venue cards
   - "Compare Selected" button
   - Persist selection in URL params
   - Clear all button

4. Mobile optimization
   - Swipeable cards on mobile
   - Collapsible comparison categories
   - Horizontal scroll for comparison table

**Verification:**
- [ ] Can select and compare 2-4 venues
- [ ] Comparison data accurate and useful
- [ ] Distance calculations correct
- [ ] Mobile experience smooth

**Files Created:**
- `src/components/worldcup/VenueComparison.tsx`
- `src/components/worldcup/VenueComparisonCard.tsx`
- `app/worldcup2026/compare/page.tsx`

---

### Step 3.5: Country-Specific Features & Branding

**Duration:** 1 day
**Priority:** P2
**Dependencies:** Steps 3.2, 3.3

**Tasks:**
1. Add country filter UI
   - Flag icons: USA 🇺🇸, Mexico 🇲🇽, Canada 🇨🇦
   - Filter buttons on venue and match pages
   - Show venue/match count per country

2. Create regional climate messaging
   - USA: "Summer heat - shade critical for comfort"
   - Mexico: "High altitude - intense sun exposure"
   - Canada: "Mild climate - less sun concern, but still check"

3. Add country grouping
   - Group venues by country on venues page
   - Collapsible sections per country
   - Map view showing venue locations (optional)

4. Prepare for i18n (future)
   - Extract hardcoded strings to constants
   - Document translation keys
   - Scope Spanish/French support for v3

**Verification:**
- [ ] Country filters work correctly
- [ ] Climate messaging displays appropriately
- [ ] Venues grouped by country
- [ ] Translation keys documented

**Files Modified:**
- `app/worldcup2026/schedule/page.tsx`
- `app/worldcup2026/venues/page.tsx`

**Files Created:**
- `src/components/worldcup/CountryFilter.tsx`
- `src/components/worldcup/ClimateMessaging.tsx`
- `src/i18n/worldcup-strings.ts` (translation keys)

---

### Step 3.6: World Cup Landing Page Enhancement

**Duration:** 1 day
**Priority:** P1
**Dependencies:** Steps 3.2-3.5

**Tasks:**
1. Enhance existing World Cup landing page
   - Larger hero section with opening match countdown
   - Feature carousel of 16 venues
   - Quick links to schedule and venue comparison
   - Key dates timeline (group stage, knockout dates)

2. Add World Cup branding
   - FIFA World Cup 2026 logo (if licensing allows)
   - USA/Mexico/Canada co-host branding
   - Color scheme matching World Cup theme

3. Create engaging content
   - "Planning your World Cup experience" section
   - Travel tips for multi-match attendees
   - Climate guide by month (June-July 2026)
   - Link to official FIFA ticketing (when available)

4. SEO optimization
   - Target keywords: "World Cup 2026 shaded seats"
   - Meta descriptions optimized
   - Open Graph images
   - Schema.org event markup

**Verification:**
- [ ] Landing page engaging and informative
- [ ] Countdown timer prominent
- [ ] All links functional
- [ ] SEO metadata optimized

**Files Modified:**
- `app/worldcup2026/page.tsx`

**Files Created:**
- `src/components/worldcup/WorldCupHero.tsx`
- `src/components/worldcup/VenueCarousel.tsx`
- `src/components/worldcup/TravelGuide.tsx`

---

### Step 3.7: World Cup SEO & Marketing Preparation

**Duration:** 1 day
**Priority:** P1
**Dependencies:** Steps 3.2-3.6

**Tasks:**
1. Optimize all World Cup pages for SEO
   - Title tags for all pages
   - Meta descriptions (<160 chars)
   - H1 tags optimized with keywords
   - Internal linking structure

2. Create sitemap entries
   - Add all World Cup pages to sitemap
   - Priority weighting (landing page highest)
   - Update frequency hints

3. Prepare social sharing
   - Open Graph images for all pages
   - Twitter card metadata
   - Share buttons on key pages
   - Pre-populated share text

4. Create marketing content assets
   - Blog post: "Ultimate Guide to Shaded Seats at World Cup 2026"
   - Infographic: "16 Venues Shade Comparison"
   - Social media templates
   - Email announcement template

**Verification:**
- [ ] All pages have SEO metadata
- [ ] Sitemap includes all World Cup pages
- [ ] Social sharing works correctly
- [ ] Marketing assets ready for launch

**Files Modified:**
- Multiple World Cup page files (SEO metadata)
- `app/sitemap.ts`

**Files Created:**
- `.zenflow/tasks/world-cup-v2-891f/marketing/blog-post.md`
- `.zenflow/tasks/world-cup-v2-891f/marketing/infographic-spec.md`
- `.zenflow/tasks/world-cup-v2-891f/marketing/social-templates.md`

---

## Phase 4: MiLB Improvements & Final Polish (3 weeks)

### Step 4.1: Identify & Prioritize Top 30 MiLB Venues

**Duration:** 1 day
**Priority:** P1
**Dependencies:** None

**Tasks:**
1. Research MiLB attendance data (2024-2025)
2. Identify top 30 venues by:
   - Attendance figures
   - Market size
   - New/renovated stadiums (2020+)
   - AAA priority over AA/Single-A

3. Create prioritized list with rationale
4. Document current data quality for each

**Verification:**
- [ ] 30 venues identified
- [ ] Prioritization criteria documented
- [ ] Current data state assessed

**Files Created:**
- `.zenflow/tasks/world-cup-v2-891f/milb-priority-venues.md`

---

### Step 4.2: Top 30 MiLB Venues - Row-Level Data Collection

**Duration:** 8 days (Week 10-11)
**Priority:** P1
**Dependencies:** Step 4.1

**Tasks:**
Same as MLB data collection (Steps 1.3-1.5), but for MiLB venues

**Notable MiLB Stadiums:**
- Las Vegas Ballpark (AAA - Aviators)
- First Horizon Park (AAA - Sounds, Nashville)
- Sahlen Field (AAA - Bisons, Buffalo)
- AutoZone Park (AAA - Redbirds, Memphis)
- Durham Bulls Athletic Park (AAA - Bulls)
- 25 more top venues

**Verification:**
- [ ] 30/30 MiLB venues with row-level data
- [ ] All pass validation
- [ ] Obstruction models created

**Files Modified/Created:**
- 30 section files in `src/data/sections/milb/`
- 30 obstruction files in `src/data/obstructions/milb/`

---

### Step 4.3: Data Freshness Tracking System

**Duration:** 2 days
**Priority:** P1
**Dependencies:** None (parallel)

**Tasks:**
1. Add timestamps to data files
   - `lastUpdated` field in each section file
   - ISO 8601 format
   - Update on any data change

2. Create freshness display component
   - Show "Last updated: [date]" on stadium pages
   - Alert icon if data >1 year old
   - Link to "Report Inaccuracy" form

3. Create freshness monitoring script
   - Check all stadiums for outdated data
   - Generate report of stadiums needing updates
   - Email alerts (optional)

4. Add to CI/CD
   - Warn on PR if data timestamp not updated
   - Require timestamp on new data files

**Verification:**
- [ ] All data files have timestamps
- [ ] Freshness displayed on UI
- [ ] Monitoring script runs successfully
- [ ] CI/CD checks timestamps

**Files Modified:**
- All section data files (add timestamps)
- `app/stadium/[stadiumId]/page.tsx` (display freshness)

**Files Created:**
- `scripts/check-data-freshness.ts`
- `src/components/DataFreshness/DataFreshness.tsx`

---

### Step 4.4: User Feedback "Report Inaccuracy" Feature

**Duration:** 2 days
**Priority:** P1
**Dependencies:** None (parallel)

**Tasks:**
1. Create feedback submission form
   - Fields: stadium, section (optional), description, email (optional)
   - Client-side validation
   - Submission confirmation message

2. Create API endpoint
   - `POST /api/report-inaccuracy`
   - Validate input
   - Send to Airtable (or email)
   - Return success/error response

3. Set up Airtable base (or alternative)
   - Create form responses table
   - Fields: timestamp, stadium, section, description, email, status
   - Set up API key in environment variables

4. Add "Report Inaccuracy" button to stadium pages
   - Prominent but not intrusive placement
   - Opens modal with form
   - Mobile-optimized

**Verification:**
- [ ] Form validates correctly
- [ ] API endpoint works
- [ ] Submissions saved to Airtable
- [ ] User receives confirmation
- [ ] Button accessible on all stadium pages

**Files Created:**
- `src/components/ReportInaccuracy/ReportInaccuracyForm.tsx`
- `src/components/ReportInaccuracy/ReportInaccuracyButton.tsx`
- `app/api/report-inaccuracy/route.ts`

**Environment Variables:**
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`

---

### Step 4.5: Analytics Dashboard for Data Quality

**Duration:** 2 days
**Priority:** P2
**Dependencies:** Step 4.4

**Tasks:**
1. Create admin dashboard page
   - Route: `/admin/data-quality` (protected)
   - Show most-viewed stadiums
   - Display API error rates by stadium
   - List stadiums with outdated data

2. Add analytics tracking
   - Track stadium page views
   - Monitor API response times
   - Log calculation errors
   - Track user feedback submissions

3. Create visualizations
   - Bar chart: top 20 stadiums by views
   - Line chart: API response times over time
   - Table: stadiums needing updates

4. Set up authentication (simple)
   - Password-protected route
   - Environment variable for password
   - Redirect to login if not authenticated

**Verification:**
- [ ] Dashboard accessible and functional
- [ ] Data accurately reflects usage
- [ ] Protected by authentication
- [ ] Visualizations clear and useful

**Files Created:**
- `app/admin/data-quality/page.tsx`
- `src/components/admin/DataQualityDashboard.tsx`
- `src/utils/analyticsCollector.ts`

---

### Step 4.6: Comprehensive Testing Suite

**Duration:** 3 days
**Priority:** P0
**Dependencies:** All previous steps

**Tasks:**
1. Expand unit test coverage to 90%+
   - Test all sun calculation functions
   - Test data validation logic
   - Test 3D geometry utilities
   - Test React components (critical paths)

2. Add integration tests
   - Test full shade calculation flow
   - Test API endpoints (all routes)
   - Test data loading for all stadiums
   - Test caching mechanisms

3. Create E2E test suite (Playwright)
   - Critical flow: Homepage → Stadium → Shade results
   - Filter and sort sections
   - Expand row details
   - Section comparison
   - World Cup: Schedule → Venue → Shade finder

4. Visual regression tests
   - Screenshot key pages
   - Compare against baseline
   - Fail on visual changes >2% diff

5. Accessibility tests
   - Run axe-core on all pages
   - Ensure WCAG 2.1 AA compliance
   - Test keyboard navigation
   - Test screen reader compatibility

**Verification:**
- [ ] Unit test coverage >90%
- [ ] All integration tests pass
- [ ] E2E tests cover critical flows
- [ ] Visual regression baseline created
- [ ] Accessibility tests pass (zero violations)

**Files Created:**
- `src/utils/__tests__/sunCalculations.test.ts`
- `src/utils/__tests__/shadeCalculation3D.test.ts`
- `src/utils/__tests__/dataValidation.test.ts`
- `tests/e2e/shade-finder.spec.ts`
- `tests/e2e/world-cup.spec.ts`
- `tests/visual/stadium-pages.spec.ts`
- `tests/a11y/accessibility.spec.ts`

---

### Step 4.7: Performance Optimization & Final Polish

**Duration:** 2 days
**Priority:** P0
**Dependencies:** All previous steps

**Tasks:**
1. Final bundle analysis
   - Identify any remaining large dependencies
   - Optimize dynamic imports
   - Tree-shake unused code
   - Compress assets

2. Lighthouse CI setup
   - `.github/workflows/lighthouse.yml`
   - Run on every PR
   - Fail if scores drop below thresholds
   - Comment scores on PR

3. Image and asset optimization
   - Compress all images with Sharp
   - Convert to WebP where possible
   - Add blur placeholders
   - Lazy load all below-fold images

4. Final Core Web Vitals optimization
   - Measure on real devices
   - Fix any LCP/FID/CLS issues
   - Preload critical resources
   - Minimize render-blocking resources

**Verification:**
- [ ] Initial bundle <300 KB gzipped
- [ ] Per-stadium chunk <100 KB gzipped
- [ ] Lighthouse Performance >90
- [ ] Lighthouse Accessibility 100
- [ ] Lighthouse Best Practices >90
- [ ] Lighthouse SEO 100
- [ ] All Core Web Vitals "Good"

**Files Modified:**
- `next.config.js`
- Multiple component files (optimization)

**Files Created:**
- `.github/workflows/lighthouse.yml`

---

### Step 4.8: Bug Fixes & Final QA

**Duration:** 3 days
**Priority:** P0
**Dependencies:** All previous steps

**Tasks:**
1. Manual testing on real devices
   - iPhone (iOS 14+)
   - Android phone (Android 10+)
   - iPad
   - Desktop (Chrome, Firefox, Safari)

2. Test all critical user flows
   - Find shaded seats for MLB game
   - Compare sections
   - View row details
   - World Cup match → shade finder
   - Filter/sort sections

3. Fix all P0/P1 bugs
   - Prioritize by user impact
   - Root cause analysis
   - No temporary workarounds

4. Final polish
   - UI inconsistencies
   - Animation smoothness
   - Loading state improvements
   - Error message clarity

**Verification:**
- [ ] All critical flows work on all devices
- [ ] Zero P0 bugs
- [ ] Zero P1 bugs
- [ ] P2 bugs documented for future

**Files Modified:**
- Various (bug fixes)

---

### Step 4.9: Documentation & Deployment Prep

**Duration:** 1 day
**Priority:** P1
**Dependencies:** Step 4.8

**Tasks:**
1. Update README
   - Project overview
   - Setup instructions
   - Development workflow
   - Testing commands
   - Deployment process

2. Create CHANGELOG
   - List all v2 features
   - Document breaking changes (if any)
   - Migration guide (if needed)

3. Write deployment guide
   - Pre-deployment checklist
   - Environment variables needed
   - Database migrations (if any)
   - Rollback procedure

4. Create validation report
   - Summary of all 30 MLB stadiums
   - Summary of 30 MiLB stadiums
   - Coverage statistics
   - Known limitations

**Verification:**
- [ ] README up to date
- [ ] CHANGELOG complete
- [ ] Deployment guide clear and accurate
- [ ] Validation reports generated

**Files Modified:**
- `README.md`

**Files Created:**
- `CHANGELOG.md`
- `.zenflow/tasks/world-cup-v2-891f/deployment-guide.md`
- `.zenflow/tasks/world-cup-v2-891f/validation-summary.md`

---

## Summary & Metrics

### Total Steps: 37
- Phase 1 (MLB Data): 7 steps (4 weeks)
- Phase 2 (UX/UI): 8 steps (3 weeks)
- Phase 3 (World Cup): 7 steps (2 weeks)
- Phase 4 (MiLB & Polish): 9 steps (3 weeks)

### Key Deliverables:
- ✅ 30/30 MLB stadiums with row-level data
- ✅ 30/120 MiLB stadiums with row-level data (25%)
- ✅ 16/16 World Cup venues (already complete)
- ✅ Interactive stadium diagrams
- ✅ Enhanced section cards with row details
- ✅ Section comparison feature
- ✅ Filter presets
- ✅ World Cup match schedule (104 matches)
- ✅ Venue comparison tool
- ✅ Data validation & quality monitoring
- ✅ User feedback system
- ✅ 90%+ test coverage
- ✅ Core Web Vitals: All "Good"

### Success Criteria:
- Performance: LCP <2.5s, FID <100ms, CLS <0.1
- Bundle: <300 KB initial, <100 KB per stadium
- Accuracy: 95%+ validated data
- Accessibility: WCAG 2.1 AA compliant
- User Engagement: 3+ min session duration, <40% bounce rate

---

## Notes for Implementation

1. **Parallel Work Opportunities:**
   - Phase 2 UX/UI work can start while Phase 1 data collection is ongoing (after Step 1.3)
   - Phase 3 World Cup features can be developed in parallel with Phase 2
   - Phase 4 MiLB data can be collected in parallel with Phase 2-3 UX work

2. **Risk Mitigation:**
   - Data collection is highest risk; allocate extra buffer time
   - Performance optimization should be continuous, not just end-of-phase
   - User testing should happen in Week 8-9 for feedback incorporation

3. **Quality Gates:**
   - Each phase ends with verification step
   - No proceeding to next phase without passing tests
   - Performance budgets enforced in CI/CD

4. **Simplicity Principle:**
   - Every step minimizes code changes
   - Reuse existing components where possible
   - Avoid premature abstraction
   - Delete unused code immediately

---

*End of Implementation Plan*
