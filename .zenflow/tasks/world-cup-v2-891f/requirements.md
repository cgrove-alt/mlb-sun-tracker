# Product Requirements Document: TheShadium.com World Cup v2 Improvements

**Product:** TheShadium.com - Stadium Shade Finder
**Version:** 2.0 (World Cup v2)
**Date:** January 27, 2026
**Status:** Requirements Phase

---

## Executive Summary

TheShadium.com is the most accurate stadium shade finder for sports in North America, helping fans avoid the sun at MLB, MiLB, NFL, and FIFA World Cup 2026 venues. The platform currently supports 250+ venues with sophisticated sun calculation algorithms and varying levels of data granularity.

This document defines requirements for **World Cup v2 improvements** to achieve row-level accuracy for ALL venues, modernize the UX/UI, enhance World Cup 2026 features, and establish theshadium.com as the definitive shade-finding platform for sports fans worldwide.

**No shortcuts. No excuses. Never lazy.**

---

## 1. Current State Analysis

### 1.1 Strengths

✅ **Comprehensive Coverage**: 250+ venues (30 MLB, 32 NFL, 120+ MiLB, 16 World Cup)
✅ **Advanced Sun Calculations**: Astronomical algorithms with 3D ray tracing
✅ **World Cup Integration**: All 16 venues with row-level data already implemented
✅ **Modern Tech Stack**: Next.js 15, React 18, TypeScript, Vercel deployment
✅ **SEO Optimized**: Static generation, sitemap, structured data
✅ **PWA Support**: Offline capability, installable
✅ **Multi-league Support**: Unified venue system across all sports
✅ **Weather Integration**: Real-time weather data with Open-Meteo API
✅ **Performance**: Code splitting, lazy loading, caching strategies

### 1.2 Critical Gaps

❌ **Inconsistent Data Granularity**:
- MLB: Section-level only (100+ sections per stadium, but no row data)
- NFL: Row-level (218 detailed section files) ✅
- MiLB: Mixed - section-level for most, some custom layouts
- World Cup: Row-level (all 16 venues) ✅
- **Impact**: Users get different quality experiences based on sport/venue

❌ **Limited Row-Level MLB Coverage**:
- **Current**: 0/30 MLB stadiums have row-level data
- **Required**: 30/30 MLB stadiums need row-level accuracy
- **Challenge**: MLB stadiums are the primary use case (most traffic)

❌ **MiLB Data Quality Issues**:
- 120+ stadiums but many use auto-generated section layouts
- Generic geometry doesn't account for unique stadium features
- Missing row-level data for popular MiLB venues (Las Vegas Ballpark, etc.)

❌ **3D Calculation Engine Underutilized**:
- Advanced `OptimizedShadeCalculator3D` exists (src/utils/shadeCalculation3DOptimized.ts)
- BVH acceleration, spatial grid, worker pool support
- **But**: Only used where row-level data exists (NFL, World Cup)
- MLB users get simpler section-angle calculations

❌ **UX/UI Modernization Needed**:
- Hero section is functional but generic
- No visual stadium preview/diagram
- Section cards are text-heavy with limited visual hierarchy
- No seat-level visualization (even where row data exists)
- Mobile experience is adequate but not optimized for touch gestures
- Filter UI is functional but not intuitive

❌ **World Cup Feature Underexposed**:
- World Cup landing page exists but minimal content
- No match schedule page (referenced but not implemented)
- Limited marketing of this major feature
- No country-specific filtering or grouping
- Missing FIFA branding opportunities

❌ **Data Management Complexity**:
- 218+ section data files scattered across directories
- No validation tools for data integrity
- Manual curation required for each stadium
- Difficult to maintain and update

### 1.3 Technical Debt

⚠️ **Code Quality Issues**:
- Debug logs recently cleaned up (40+ removed)
- Some TODO/FIXME comments in codebase
- Inconsistent error handling patterns

⚠️ **Testing Gaps**:
- Only 9 unit tests, 6 E2E tests
- Coverage threshold: 70% (should be 90%+)
- No visual regression testing beyond basic screenshots
- Missing integration tests for sun calculations

⚠️ **Performance Concerns**:
- Large section data files (5,277 lines in stadiumSections.ts)
- Potential bundle size issues with 250+ venues
- No progressive data loading for sections

---

## 2. Business Objectives

### 2.1 Primary Goals

1. **Achieve Row-Level Accuracy for ALL Venues**
   - Target: 100% of MLB stadiums (30/30) with row-level data
   - Target: 100% of top 30 MiLB stadiums with row-level data
   - Target: Maintain 100% NFL and World Cup row-level coverage
   - **Metric**: % of venues with row-level data

2. **Modernize User Experience**
   - Create best-in-class shade finding UX
   - Visual stadium diagrams with interactive section selection
   - Intuitive mobile-first design
   - **Metric**: User engagement time, bounce rate reduction

3. **Maximize World Cup 2026 Opportunity**
   - Position as THE shade finder for World Cup 2026
   - Complete match schedule integration
   - Country-specific branding and marketing
   - **Metric**: World Cup page traffic, conversions

4. **Establish Data Quality Leadership**
   - Most accurate shade predictions in the industry
   - Transparent methodology
   - Regular data validation and updates
   - **Metric**: Prediction accuracy, user trust ratings

### 2.2 Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| MLB row-level coverage | 0% (0/30) | 100% (30/30) | Phase 1 |
| MiLB row-level coverage | ~5% | 25% (30/120) | Phase 2 |
| World Cup page traffic | Low | 20% of total | Pre-WC 2026 |
| Avg session duration | Unknown | 3+ minutes | Post-launch |
| Mobile bounce rate | Unknown | <40% | Post-launch |
| Calculation accuracy | High | 95%+ validated | Phase 1 |
| Page load time (FCP) | Unknown | <1.5s | Phase 2 |
| Core Web Vitals | Unknown | All "Good" | Phase 2 |

---

## 3. User Personas

### 3.1 Primary: The Planned Fan (Sarah, 32)

**Profile**:
- Plans game attendance 1-2 weeks in advance
- Purchases tickets online (StubHub, SeatGeek)
- Researches seat quality before buying
- Values comfort and experience
- Uses mobile device primarily

**Pain Points**:
- "Are my seats in the shade?" - critical question before purchase
- Ticket sites don't show sun exposure
- Stadium seating charts don't indicate shade
- Doesn't want to guess and regret $100+ ticket purchase

**Goals**:
- Find shaded seats before purchasing tickets
- Understand sun exposure for specific row/seat
- Compare multiple sections visually
- Share findings with group attending game

**How TheShadium Helps**:
- Real-time shade predictions for any game time
- Row-level accuracy for precise seat selection
- Visual section comparison
- Mobile-optimized for on-the-go research

### 3.2 Secondary: The Spontaneous Fan (Mike, 45)

**Profile**:
- Already has tickets (season ticket holder or last-minute purchase)
- Wants to know what to expect
- May arrive early to find alternate seating
- Values practical game day tips

**Pain Points**:
- Already bought tickets, now concerned about sun
- Wants to know best arrival time
- Needs to know if sunglasses/hat/sunscreen needed
- May want to move to better seats if available

**Goals**:
- Check sun exposure for existing seats
- Plan arrival time to avoid hottest period
- Understand which innings/quarters have shade
- Find alternative sections if moving

**How TheShadium Helps**:
- Time-based shade evolution (inning-by-inning)
- Weather-adjusted predictions
- Nearby section comparisons
- Accessibility info for alternate seats

### 3.3 Tertiary: The World Cup Traveler (Elena, 28)

**Profile**:
- International or out-of-state visitor
- Attending World Cup 2026 match
- Unfamiliar with host stadium
- Planning multi-day trip around match

**Pain Points**:
- Doesn't know local climate
- Unfamiliar with stadium layout
- High ticket prices ($200-$2,000+)
- Want best possible experience for once-in-lifetime event

**Goals**:
- Find best shaded seats across unfamiliar venues
- Understand local weather patterns
- Compare venues across cities (USA, Mexico, Canada)
- Plan comprehensive game day experience

**How TheShadium Helps**:
- World Cup-specific match schedule integration
- Venue comparisons across countries
- Local weather context for game day
- Row-level accuracy at all 16 venues

---

## 4. Functional Requirements

### 4.1 Row-Level Data Implementation

#### FR-1.1: MLB Row-Level Data Collection

**Priority**: P0 (Critical)
**Effort**: High

**Requirements**:
1. Obtain row-level geometry for all 30 MLB stadiums:
   - Row elevations (height above field)
   - Row depths (distance from section front)
   - Seat positions (3D coordinates)
   - Overhang/coverage details
   - Obstruction geometry (upper decks, roofs, scoreboards)

2. Data sources:
   - Official stadium seating charts (team websites)
   - Ticketing platform data (StubHub, SeatGeek APIs if available)
   - Manual measurements from venue visits (if necessary)
   - Architectural drawings (public records or partnerships)
   - Photogrammetry from high-resolution stadium photos

3. Data structure:
   - Follow existing `DetailedSection` interface (src/types/stadium-complete.ts)
   - Include `RowDetail[]` for each section
   - 3D vertices (`vertices3D`) for section boundaries
   - Coverage details (`CoverageDetail`) for partial overhangs
   - Accessibility info (`AccessibilityInfo`)

4. File organization:
   - Create `/src/data/sections/mlb/` directory
   - One file per stadium: `yankee-stadium.ts`, `dodger-stadium.ts`, etc.
   - Follow NFL file naming convention: lowercase, hyphenated

5. Validation:
   - Each stadium must have 60-100+ sections with row data
   - All sections must have valid 3D coordinates
   - No missing elevation or depth values
   - Coverage data matches stadium roof configuration

**Acceptance Criteria**:
- [ ] All 30 MLB stadiums have row-level data files created
- [ ] Each file exports `DetailedSection[]` array
- [ ] Data passes validation tests (see FR-1.4)
- [ ] 3D obstruction models defined for roofs/overhangs
- [ ] Documentation explains data collection methodology

#### FR-1.2: MiLB Priority Venues Row-Level Data

**Priority**: P1 (High)
**Effort**: High

**Requirements**:
1. Identify top 30 MiLB venues by:
   - Attendance figures (2024-2025 seasons)
   - Market size (Las Vegas, Nashville, Sacramento, etc.)
   - New/renovated stadiums (2020+)
   - AAA and AA priority over Single-A

2. Collect row-level data for top 30:
   - Same data structure as MLB (DetailedSection)
   - Focus on venues with unique geometry
   - Prioritize stadiums with partial roofs/overhangs

3. Update existing auto-generated sections:
   - Replace generic layouts with accurate data
   - Fix Las Vegas Ballpark (current layout is generic)
   - Fix other popular venues with known inaccuracies

**Acceptance Criteria**:
- [ ] Top 30 MiLB venues identified and prioritized
- [ ] Row-level data collected for all 30
- [ ] Files created in `/src/data/sections/milb/` with league subdirectories
- [ ] Generic layouts replaced with accurate data
- [ ] Validation tests pass for all 30 venues

#### FR-1.3: 3D Obstruction Modeling

**Priority**: P0 (Critical)
**Effort**: Medium

**Requirements**:
1. Define 3D obstruction models for each MLB stadium:
   - Roof structures (retractable, fixed, open)
   - Upper deck overhangs (precise geometry)
   - Scoreboard structures (large video boards)
   - Unique features (Green Monster at Fenway, etc.)

2. Obstruction properties:
   - Bounding boxes (min/max coordinates)
   - Full mesh geometry (vertices, faces, normals)
   - Material properties (opacity, reflectivity)
   - Seasonal/movable elements (retractable roofs)

3. Integration with shade calculator:
   - Use existing `OptimizedShadeCalculator3D` class
   - BVH tree for fast ray-obstruction intersection
   - Spatial grid for efficient lookups

**Acceptance Criteria**:
- [ ] All MLB stadiums have obstruction models defined
- [ ] Obstructions include roofs, upper decks, scoreboards
- [ ] Retractable roof stadiums have open/closed positions
- [ ] Obstruction data integrated into shade calculations
- [ ] Visual validation (3D preview) confirms accuracy

#### FR-1.4: Data Validation System

**Priority**: P1 (High)
**Effort**: Medium

**Requirements**:
1. Create automated validation tools:
   - Section data completeness checker
   - 3D coordinate bounds validation
   - Duplicate section ID detection
   - Row numbering consistency check
   - Elevation/depth monotonicity check (rows should ascend)

2. Build validation CLI tool:
   - `npm run validate-stadium-data <stadiumId>`
   - Reports errors, warnings, coverage stats
   - Generates validation report for each stadium

3. Integration tests:
   - Load all stadium data files
   - Validate structure matches TypeScript interfaces
   - Check for missing required fields
   - Verify 3D coordinates are within reasonable bounds

4. Validation report format:
   ```typescript
   interface ValidationResult {
     stadiumId: string;
     valid: boolean;
     errors: string[];     // Critical issues
     warnings: string[];   // Non-blocking issues
     coverage: {
       sections: number;
       rowsTotal: number;
       obstructions: number;
       geometryComplete: boolean;
     };
   }
   ```

**Acceptance Criteria**:
- [ ] Validation CLI tool created (`scripts/validate-stadium-data.ts`)
- [ ] All MLB stadiums pass validation with zero errors
- [ ] Integration tests cover all data files
- [ ] Validation runs in CI/CD pipeline
- [ ] Validation reports saved to artifacts

### 4.2 Enhanced Sun Calculation Engine

#### FR-2.1: Row-Level Shade Calculation for MLB

**Priority**: P0 (Critical)
**Effort**: Medium

**Requirements**:
1. Enable `OptimizedShadeCalculator3D` for all MLB stadiums:
   - Load row-level data for each MLB stadium
   - Build stadium 3D models with sections + obstructions
   - Use BVH acceleration for performance

2. Calculation features:
   - Per-seat sun exposure (0-100%)
   - Time-based shade evolution (inning-by-inning)
   - Weather-adjusted calculations (cloud cover, precipitation)
   - Multiple LOD levels (high/medium/low) based on performance

3. Caching strategy:
   - Cache seat-level calculations by sun position
   - Invalidate cache on weather changes
   - Use service worker for offline calculations

4. API endpoints:
   - Existing: `/api/stadium/[stadiumId]/rows/shade`
   - Add: `/api/stadium/[stadiumId]/rows/[sectionId]/shade`
   - Add: `/api/stadium/[stadiumId]/seat/[sectionId]/[row]/[seat]/shade`

**Acceptance Criteria**:
- [ ] All MLB stadiums use `OptimizedShadeCalculator3D`
- [ ] Row-level shade percentages calculated for each section
- [ ] API endpoints return seat-level shade data
- [ ] Calculations complete within 2 seconds for any stadium
- [ ] Cache hit rate >80% for repeated queries

#### FR-2.2: Inning/Quarter-by-Quarter Shade Tracking

**Priority**: P1 (High)
**Effort**: Low

**Requirements**:
1. Calculate shade for each period of play:
   - MLB: Each inning (9-15 innings)
   - NFL: Each quarter (4 quarters)
   - MiLB: Each inning
   - World Cup: Each half + extra time

2. Display shade evolution:
   - Timeline visualization showing shade movement
   - "Your seats will be in shade starting inning 5"
   - Percentage shade for each time period

3. Optimal arrival time recommendation:
   - "Arrive at 3:45 PM for maximum shade"
   - "Seats are in full sun until 6:30 PM"

**Acceptance Criteria**:
- [ ] Shade calculated for each inning/quarter
- [ ] Timeline UI component created
- [ ] Optimal arrival time displayed
- [ ] Works for all game durations (including extra innings)

#### FR-2.3: Weather-Adjusted Predictions

**Priority**: P1 (High)
**Effort**: Low (already partially implemented)

**Requirements**:
1. Enhance existing weather integration:
   - Current: Cloud cover, precipitation, temperature
   - Add: UV index warnings, heat index, wind chill
   - Add: Hourly forecast (shade may improve later in game)

2. Weather impact messaging:
   - "Heavy clouds expected - 60% less sun exposure"
   - "Clear skies - full sun exposure in this section"
   - "Rain expected - covered seats recommended"

3. Real-time weather updates:
   - Refresh weather data every 15 minutes
   - Update shade calculations if conditions change
   - Show "weather updated" indicator

**Acceptance Criteria**:
- [ ] UV index displayed for game time
- [ ] Heat index calculated and shown
- [ ] Weather-adjusted shade percentages accurate
- [ ] Hourly forecast shown for game duration
- [ ] Weather updates automatically refresh

### 4.3 UX/UI Modernization

#### FR-3.1: Visual Stadium Diagrams

**Priority**: P0 (Critical)
**Effort**: High

**Requirements**:
1. Interactive stadium diagram component:
   - 2D top-down view of stadium seating bowl
   - Sections color-coded by shade percentage:
     - Green: 0-20% sun (full shade)
     - Yellow-green: 20-40% sun (mostly shade)
     - Yellow: 40-60% sun (partial shade)
     - Orange: 60-80% sun (mostly sun)
     - Red: 80-100% sun (full sun)
   - Click section to view details
   - Hover to show section name and shade %

2. 3D stadium preview (optional, nice-to-have):
   - Three.js-based 3D rendering
   - Rotate stadium to see sun angle
   - Sun position indicator
   - Shadow overlay on seating bowl

3. Responsive design:
   - Desktop: Large stadium diagram with section list alongside
   - Mobile: Diagram above, sections below in scrollable list
   - Tablet: Hybrid layout with collapsible sections

4. Accessibility:
   - Color blind safe palette
   - Text labels for all sections
   - Keyboard navigation for section selection
   - Screen reader descriptions for shade levels

**Acceptance Criteria**:
- [ ] Stadium diagram component created (`StadiumDiagram.tsx`)
- [ ] Color-coded sections by shade percentage
- [ ] Click/tap to select section
- [ ] Responsive design for all screen sizes
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] 3D preview (optional) implemented or scoped for future

#### FR-3.2: Enhanced Section Cards

**Priority**: P1 (High)
**Effort**: Medium

**Requirements**:
1. Redesign section card UI:
   - **Visual hierarchy**:
     - Large shade percentage prominently displayed
     - Section name and level clearly labeled
     - Row range shown (e.g., "Rows 1-25")
   - **Visual elements**:
     - Sun/shade icon based on exposure
     - Price tier badge (value, moderate, premium, luxury)
     - Covered/uncovered indicator with icon
   - **Expandable row details**:
     - Click to expand and see row-by-row shade %
     - Row-level breakdown: "Row 1: 80% sun, Row 10: 40% sun"
     - Timeline: Shade at each inning/quarter

2. Comparison mode:
   - Select multiple sections to compare side-by-side
   - Compare shade %, price, view quality, distance
   - Mobile: Swipe between selected sections

3. Seat-level detail view (where row data exists):
   - Click row to see individual seat shade %
   - "Seat 15: 20% sun (mostly shaded)"
   - Hover/tap seat for detailed info

**Acceptance Criteria**:
- [ ] Section cards redesigned with visual hierarchy
- [ ] Expandable row details implemented
- [ ] Comparison mode allows selecting 2-4 sections
- [ ] Seat-level view (for row-level venues) implemented
- [ ] Mobile swipe gestures work smoothly

#### FR-3.3: Improved Filtering & Sorting

**Priority**: P1 (High)
**Effort**: Low

**Requirements**:
1. Enhanced filter options:
   - **Shade level**: Slider 0-100% or discrete buckets
   - **Price tier**: Value, Moderate, Premium, Luxury
   - **Seating level**: Field, Lower, Club, Upper, Suite
   - **Covered**: Yes/No toggle
   - **Accessibility**: Wheelchair accessible toggle
   - **View quality**: Excellent, Good, Fair (if data available)
   - **Distance from field**: Slider (min-max feet)

2. Smart sort options:
   - Most shade (default)
   - Least shade (for cool weather games)
   - Best value (shade per dollar)
   - Closest to field
   - Best view quality

3. Filter presets:
   - "Maximum Shade" (0-20% sun, covered preferred)
   - "Budget Friendly" (value/moderate price, >50% shade)
   - "Close & Shaded" (field/lower level, <30% sun)
   - "Accessible" (wheelchair accessible, >50% shade)

4. Mobile filter drawer:
   - Bottom sheet design
   - Swipe up to open, swipe down to close
   - Apply/Reset buttons
   - Filter count badge on button

**Acceptance Criteria**:
- [ ] All filter options implemented and functional
- [ ] Sort options work correctly
- [ ] Filter presets applied with one click
- [ ] Mobile filter drawer UX smooth and intuitive
- [ ] Filter state persisted in URL params (shareable links)

#### FR-3.4: Homepage Redesign

**Priority**: P1 (High)
**Effort**: Medium

**Requirements**:
1. Hero section improvements:
   - More engaging headline: "Don't Sweat It. Find Your Shade."
   - Animated background (subtle sun/shadow movement)
   - Prominent league selector (MLB, NFL, MiLB, World Cup)
   - Quick venue search (autocomplete)
   - Feature highlights: "250+ Stadiums | Row-Level Accuracy | Real-Time Sun Tracking"

2. World Cup 2026 showcase:
   - Larger, more prominent section
   - Match countdown timer ("48 days until opening match")
   - Featured venues carousel
   - CTA: "Plan Your World Cup Experience"

3. Social proof:
   - User testimonials (if available)
   - Usage stats: "Over 100,000 fans found their shade"
   - Media mentions (if any)

4. How it works section:
   - 3-step process:
     1. Select your stadium
     2. Choose game time
     3. Find your shade
   - Visual illustrations for each step

**Acceptance Criteria**:
- [ ] Hero section redesigned with improved copy and visuals
- [ ] World Cup section more prominent with countdown
- [ ] "How it works" section added
- [ ] Social proof elements integrated
- [ ] Mobile-optimized hero section

### 4.4 World Cup 2026 Feature Enhancements

#### FR-4.1: World Cup Match Schedule Integration

**Priority**: P0 (Critical)
**Effort**: Medium

**Requirements**:
1. Create match schedule page (`/worldcup2026/schedule`):
   - List all 104 matches with:
     - Match date & time (local timezone + user timezone)
     - Teams (placeholders for group stage: "Winner Group A" etc.)
     - Venue name and city
     - Match phase (Group Stage, Round of 16, Quarterfinal, Semifinal, Final)
   - Filter by:
     - Country (USA, Mexico, Canada)
     - Venue
     - Match phase
     - Date range

2. Link to venue shade finder:
   - Each match has "Find Shaded Seats" button
   - Pre-selects venue and match date/time
   - Shows shade predictions for that specific match

3. Countdown timers:
   - Days until each match
   - "Next match in [venue]" widget

4. Ticket information (optional):
   - Links to official FIFA ticketing (if available)
   - Price estimates by section (if data available)

**Acceptance Criteria**:
- [ ] Match schedule page created with all 104 matches
- [ ] Filtering by country, venue, phase works
- [ ] "Find Shaded Seats" links to shade finder with pre-filled data
- [ ] Countdown timers displayed correctly
- [ ] Timezone conversions accurate

#### FR-4.2: World Cup Venue Comparison Tool

**Priority**: P1 (High)
**Effort**: Medium

**Requirements**:
1. Multi-venue comparison page:
   - Select 2-4 World Cup venues
   - Side-by-side comparison:
     - Capacity
     - Roof type (open, fixed, retractable)
     - Average shade coverage %
     - Climate zone (hot-dry, hot-humid, temperate)
     - Typical weather for June-July
     - Accessibility features
     - Transportation options (if data available)

2. Visual comparison:
   - Stadium diagrams side-by-side
   - Color-coded shade maps
   - Sun path overlays for typical match time (e.g., 5 PM local)

3. Travel planning integration:
   - Distance between venues (for multi-match travelers)
   - Climate comparison (for packing/planning)
   - "Best shade" recommendation for travelers prioritizing comfort

**Acceptance Criteria**:
- [ ] Venue comparison page created
- [ ] Side-by-side comparison of 2-4 venues
- [ ] Visual stadium diagrams compared
- [ ] Travel planning features integrated
- [ ] Mobile-responsive comparison layout

#### FR-4.3: Country-Specific Branding

**Priority**: P2 (Medium)
**Effort**: Low

**Requirements**:
1. Country filter badges:
   - USA 🇺🇸, Mexico 🇲🇽, Canada 🇨🇦 flags
   - Filter venues by country
   - Show venue count per country

2. Regional climate context:
   - USA venues: "Summer heat - shade critical"
   - Mexico venues: "High altitude - intense sun"
   - Canada venues: "Mild climate - less sun concern"

3. Language support (optional, future):
   - Spanish for Mexico venues
   - French for Canada venues
   - Translation keys for World Cup content

**Acceptance Criteria**:
- [ ] Country filters with flag icons
- [ ] Climate context messaging per region
- [ ] Venue grouping by country option
- [ ] (Optional) Multi-language support scoped

### 4.5 Data Management & Quality

#### FR-5.1: Stadium Data CMS (Future Consideration)

**Priority**: P3 (Low)
**Effort**: High

**Requirements** (scoped for future, not v2):
1. Admin interface for managing stadium data:
   - Add/edit stadiums, sections, rows
   - Upload section geometry files
   - 3D obstruction editor
   - Validation before publishing

2. Version control:
   - Track changes to stadium data
   - Rollback capability
   - Audit log

3. Collaborative editing:
   - Multiple admins can contribute
   - Review/approval workflow

**Acceptance Criteria** (not for v2):
- Scoped and documented for future implementation
- User stories written for CMS features
- Technical architecture proposed

#### FR-5.2: Data Quality Monitoring

**Priority**: P1 (High)
**Effort**: Low

**Requirements**:
1. Data freshness tracking:
   - Timestamp for each stadium data file
   - "Last updated" displayed on stadium pages
   - Alert if data is >1 year old

2. User feedback mechanism:
   - "Report inaccuracy" button on each stadium page
   - Form: Section, description, contact info
   - Save to database or send email to admin

3. Analytics for data usage:
   - Track which stadiums are most viewed
   - Identify stadiums needing data updates
   - Monitor error rates by stadium

**Acceptance Criteria**:
- [ ] Data freshness timestamps added to all files
- [ ] "Last updated" displayed on UI
- [ ] "Report inaccuracy" form implemented
- [ ] Feedback saved to system (database or email)
- [ ] Analytics dashboard for data quality metrics

---

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-1.1: Page Load Performance**
- First Contentful Paint (FCP): <1.5 seconds
- Largest Contentful Paint (LCP): <2.5 seconds
- Time to Interactive (TTI): <3.5 seconds
- Core Web Vitals: All "Good" (green)

**NFR-1.2: Calculation Performance**
- Row-level shade calculation: <2 seconds per stadium
- Seat-level calculation: <5 seconds per section
- API response time: <500ms (p95)

**NFR-1.3: Bundle Size**
- Initial bundle: <300 KB (gzipped)
- Per-stadium data: <100 KB (lazy loaded)
- Total bundle growth: <20% from current

### 5.2 Scalability

**NFR-2.1: Data Scalability**
- Support 500+ venues without performance degradation
- Handle 10,000+ sections across all stadiums
- Process 1M+ shade calculations per day

**NFR-2.2: Traffic Scalability**
- Handle 10,000 concurrent users
- Peak traffic during World Cup: 100,000 users/day
- 99.9% uptime during World Cup (June-July 2026)

### 5.3 Accessibility

**NFR-3.1: WCAG Compliance**
- WCAG 2.1 Level AA compliance
- Screen reader support for all interactive elements
- Keyboard navigation throughout application
- Color contrast ratios: 4.5:1 minimum

**NFR-3.2: Device Compatibility**
- Mobile: iOS 14+, Android 10+
- Desktop: Chrome, Firefox, Safari, Edge (last 2 versions)
- Tablet: iPad, Android tablets
- Progressive enhancement for older browsers

### 5.4 Security

**NFR-4.1: Data Security**
- HTTPS only (Vercel default)
- No sensitive user data stored (privacy-first)
- GDPR compliance (EU users)
- Security headers configured (CSP, HSTS, etc.)

**NFR-4.2: API Security**
- Rate limiting: 100 requests/minute per IP
- CORS configured for known origins only
- Input validation on all API endpoints
- No injection vulnerabilities (SQL, XSS, etc.)

### 5.5 SEO & Discoverability

**NFR-5.1: Search Engine Optimization**
- All stadium pages indexed by Google
- Meta descriptions for all pages (<160 chars)
- Open Graph tags for social sharing
- Structured data (Schema.org) for stadiums
- Sitemap.xml auto-generated and submitted

**NFR-5.2: Social Sharing**
- Shareable links with pre-filled parameters
- "Share my seats" feature with shade info
- Social media preview cards (Open Graph)

---

## 6. User Stories

### 6.1 Epic: Row-Level Shade Finding

**US-1.1: As a fan buying tickets, I want to see row-level shade data so I can choose specific rows within a section.**
- Given I am viewing a section with row-level data
- When I click "View Row Details"
- Then I see a list of all rows with individual shade percentages
- And I can click a row to see seat-level details

**US-1.2: As a fan planning my visit, I want to know what time my seats will be in shade so I can plan arrival time.**
- Given I have selected my section and game time
- When I view shade details
- Then I see an inning-by-inning breakdown of shade coverage
- And I see a recommendation: "Your seats will be in full shade starting inning 5 (approx. 3:45 PM)"

**US-1.3: As a season ticket holder, I want to compare shade across multiple games so I can choose which games to attend.**
- Given I have season tickets in a specific section
- When I select multiple game dates
- Then I see shade comparison for that section across all dates
- And I can see which games have the most shade

### 6.2 Epic: Visual Stadium Experience

**US-2.1: As a visual learner, I want to see a stadium diagram so I can understand section locations.**
- Given I am viewing stadium results
- When the page loads
- Then I see a color-coded stadium diagram with all sections
- And I can click a section on the diagram to view details

**US-2.2: As a mobile user, I want to easily filter sections on my phone so I can find shaded seats quickly.**
- Given I am on a mobile device
- When I tap the "Filter" button
- Then a bottom sheet opens with filter options
- And I can apply filters with one tap on presets like "Maximum Shade"

**US-2.3: As a fan comparing seats, I want to see multiple sections side-by-side so I can make an informed decision.**
- Given I am viewing section results
- When I select 2-3 sections using checkboxes
- Then I see a comparison view with shade %, price, distance, view quality
- And I can toggle between sections on mobile

### 6.3 Epic: World Cup 2026 Planning

**US-3.1: As a World Cup traveler, I want to see all matches at a specific venue so I can plan my trip.**
- Given I am on the World Cup venues page
- When I select a venue (e.g., MetLife Stadium)
- Then I see all matches hosted at that venue with dates and times
- And I can click "Find Shaded Seats" for any match

**US-3.2: As an international fan, I want to compare venues across countries so I can choose which matches to attend.**
- Given I am planning a World Cup trip
- When I access the venue comparison tool
- Then I can select 2-4 venues and compare shade, climate, capacity
- And I see travel distance between venues

**US-3.3: As a USA-based fan, I want to filter World Cup venues by country so I can focus on domestic options.**
- Given I am on the World Cup venues page
- When I click the "USA" filter
- Then I see only the 11 USA venues
- And the map zooms to show USA venues

### 6.4 Epic: Data Quality & Trust

**US-4.1: As a skeptical user, I want to understand the methodology so I can trust the predictions.**
- Given I am viewing shade predictions
- When I click "How is this calculated?"
- Then I see a clear explanation of:
  - Sun position algorithms (astronomical calculations)
  - 3D ray tracing for obstructions
  - Weather adjustments
- And I see a "Data updated: [date]" timestamp

**US-4.2: As a user who finds an error, I want to report inaccurate data so it can be corrected.**
- Given I notice shade predictions don't match my experience
- When I click "Report Inaccuracy"
- Then I see a form to describe the issue
- And I receive confirmation: "Thank you. We'll review this within 48 hours."

---

## 7. Technical Architecture

### 7.1 Data Layer

**Stadium Data Storage**:
- **Current**: TypeScript files in `/src/data/`
- **v2**: Same approach, with enhanced structure
- **Files**:
  - `/src/data/sections/mlb/` - 30 new files for MLB row-level data
  - `/src/data/sections/milb/` - 30 updated/new files for top MiLB venues
  - `/src/data/obstructions/` - New directory for 3D obstruction models

**Data Loading Strategy**:
- **Static imports** for MLB/NFL/World Cup (included in bundle)
- **Dynamic imports** for MiLB (lazy loaded on demand)
- **Code splitting** by league: `mlb.chunk.js`, `nfl.chunk.js`, etc.

### 7.2 Calculation Engine

**3D Shade Calculator**:
- **Current**: `OptimizedShadeCalculator3D` (src/utils/shadeCalculation3DOptimized.ts)
- **v2 Enhancements**:
  - Enable for all MLB stadiums (currently NFL/World Cup only)
  - Add worker pool for parallel processing (multi-threading)
  - Improve caching (seat-level results)
  - Progressive calculation (show results as they compute)

**API Endpoints**:
- Existing: `/api/stadium/[stadiumId]/rows/shade`
- New: `/api/stadium/[stadiumId]/section/[sectionId]/rows/shade`
- New: `/api/stadium/[stadiumId]/seat/[sectionId]/[row]/[seat]/shade`

### 7.3 UI Components

**New Components**:
- `StadiumDiagram.tsx` - Interactive stadium diagram
- `RowDetailView.tsx` - Expandable row-level details
- `SectionComparison.tsx` - Side-by-side section comparison
- `ShadeTimeline.tsx` - Inning-by-inning shade evolution
- `WorldCupSchedule.tsx` - Match schedule grid
- `VenueComparison.tsx` - Multi-venue comparison

**Component Library**:
- Continue using React + CSS Modules
- Consider Tailwind utility classes for rapid development
- Ensure mobile-first responsive design

### 7.4 Testing Strategy

**Unit Tests**:
- Target: 90%+ code coverage (up from 70%)
- Focus areas:
  - Sun calculation algorithms
  - Data validation functions
  - 3D geometry utilities
  - API route handlers

**Integration Tests**:
- Load all stadium data and validate structure
- Test shade calculations for sample stadiums
- API endpoint response validation

**E2E Tests (Playwright)**:
- Critical user flows:
  - Select stadium → choose game → view shade results
  - Filter sections → compare → view row details
  - World Cup: Select venue → view matches → find shade
- Visual regression: Screenshot comparison for section cards, diagrams
- Accessibility: Axe-core audits on key pages

**Performance Tests**:
- Lighthouse CI in GitHub Actions
- Bundle size monitoring
- API response time benchmarks

---

## 8. Implementation Phases

### Phase 1: MLB Row-Level Data Foundation (Weeks 1-4)

**Goals**:
- Collect and validate row-level data for all 30 MLB stadiums
- Enable 3D shade calculator for MLB
- Create validation tools

**Deliverables**:
- 30 MLB section data files (`/src/data/sections/mlb/`)
- 3D obstruction models for all MLB stadiums
- Data validation CLI tool
- Integration tests for data integrity
- API endpoint for row-level shade calculations

**Success Metrics**:
- 30/30 MLB stadiums with row-level data
- All data passes validation (zero errors)
- Row-level API returns results in <2 seconds

### Phase 2: UX/UI Modernization (Weeks 5-7)

**Goals**:
- Redesign section cards and filtering
- Create interactive stadium diagrams
- Improve mobile experience

**Deliverables**:
- Stadium diagram component (2D, color-coded)
- Enhanced section cards with row details
- Improved filter/sort UI
- Section comparison mode
- Homepage redesign
- Mobile filter drawer

**Success Metrics**:
- All UI components responsive (mobile, tablet, desktop)
- WCAG 2.1 AA compliance
- User testing: 80%+ positive feedback

### Phase 3: World Cup Feature Completion (Weeks 8-9)

**Goals**:
- Complete World Cup match schedule integration
- Build venue comparison tool
- Country-specific features

**Deliverables**:
- Match schedule page (`/worldcup2026/schedule`)
- Venue comparison tool
- Country filters and branding
- Countdown timers
- SEO optimization for World Cup pages

**Success Metrics**:
- All 104 matches listed with accurate data
- Venue comparison supports 2-4 venues
- World Cup pages rank in top 10 Google results (target keywords)

### Phase 4: MiLB & Polish (Weeks 10-12)

**Goals**:
- Add row-level data for top 30 MiLB venues
- Data quality monitoring
- Performance optimization
- Bug fixes and polish

**Deliverables**:
- 30 MiLB section data files (top venues)
- Data freshness tracking
- User feedback ("Report Inaccuracy") form
- Performance optimizations (bundle size, load time)
- Comprehensive testing (unit, E2E, visual regression)

**Success Metrics**:
- 30/120 MiLB venues with row-level data (25% coverage)
- Core Web Vitals: All "Good"
- Zero P0/P1 bugs
- 90%+ test coverage

---

## 9. Risks & Mitigations

### Risk 1: Data Collection Difficulty

**Risk**: Obtaining accurate row-level data for 30 MLB stadiums is time-consuming and may be incomplete.

**Likelihood**: High
**Impact**: Critical

**Mitigation**:
1. Start with publicly available seating charts (team websites, ticketing sites)
2. Use photogrammetry from high-res photos as fallback
3. Prioritize high-traffic stadiums first (Yankee Stadium, Dodger Stadium, etc.)
4. Accept reasonable approximations for less critical details (within 5% accuracy)
5. Community contributions: Allow users to submit corrections

### Risk 2: Performance Degradation

**Risk**: Adding row-level data increases bundle size and calculation time, degrading performance.

**Likelihood**: Medium
**Impact**: High

**Mitigation**:
1. Lazy load stadium-specific data (not in initial bundle)
2. Use web workers for calculations (non-blocking)
3. Implement aggressive caching (seat-level results)
4. Progressive rendering (show results as they compute)
5. Monitor bundle size in CI/CD (fail if >20% growth)

### Risk 3: World Cup Timeline Pressure

**Risk**: World Cup 2026 starts June 11, 2026. Missing this deadline loses significant opportunity.

**Likelihood**: Medium
**Impact**: High

**Mitigation**:
1. Prioritize World Cup features in Phase 3 (Weeks 8-9)
2. Soft launch World Cup pages by April 2026 (2 months buffer)
3. Incremental releases: Match schedule first, then venue comparison
4. Reduce scope if needed (defer "nice-to-have" features)
5. Have contingency plan: Basic World Cup integration vs. full feature set

### Risk 4: Testing Gaps

**Risk**: Inadequate testing leads to bugs in production, especially for sun calculations.

**Likelihood**: Medium
**Impact**: High

**Mitigation**:
1. Increase test coverage to 90% (unit + integration)
2. Visual regression tests for all UI components
3. Manual testing for critical user flows
4. Beta testing with real users before launch
5. Monitor production errors with Sentry or similar

### Risk 5: Competitive Landscape

**Risk**: Competitors (SeatGeek, StubHub, etc.) may add shade-finding features.

**Likelihood**: Low-Medium
**Impact**: Medium

**Mitigation**:
1. Speed to market: Launch row-level MLB data ASAP
2. Differentiation: Best-in-class accuracy and UX
3. SEO dominance: Rank #1 for "shaded seats [stadium]" keywords
4. Network effects: User feedback improves data quality over time
5. Build brand trust: Transparent methodology, regular updates

---

## 10. Success Criteria

### 10.1 Feature Completeness

✅ **MLB Row-Level Data**: 30/30 stadiums (100%)
✅ **MiLB Row-Level Data**: 30/120 stadiums (25% of top venues)
✅ **World Cup Features**: Match schedule, venue comparison, country filters
✅ **UI Modernization**: Stadium diagrams, enhanced section cards, improved filters
✅ **Data Quality**: Validation tools, freshness tracking, user feedback

### 10.2 Performance Metrics

✅ **Core Web Vitals**: All "Good" (LCP <2.5s, FID <100ms, CLS <0.1)
✅ **API Response Time**: <500ms (p95) for shade calculations
✅ **Bundle Size**: <300 KB initial, <100 KB per stadium (lazy loaded)
✅ **Test Coverage**: 90%+ (unit + integration)

### 10.3 User Engagement

✅ **Session Duration**: 3+ minutes (up from unknown)
✅ **Bounce Rate**: <40% (down from unknown)
✅ **World Cup Traffic**: 20% of total site traffic by June 2026
✅ **User Feedback**: 80%+ positive (via in-app surveys)

### 10.4 SEO & Discoverability

✅ **Google Rankings**: Top 5 for "shaded seats [stadium]" (30 MLB keywords)
✅ **Organic Traffic**: 50% increase within 3 months of launch
✅ **Sitemap**: All 250+ venue pages indexed
✅ **Social Shares**: 100+ shares per month (via share buttons)

---

## 11. Future Considerations (Post-v2)

### 11.1 Features Not in Scope (Defer to v3)

- **Ticket Purchasing Integration**: Partner with SeatGeek/StubHub for in-app ticket purchases
- **User Accounts**: Save favorite stadiums, track past searches, personalized recommendations
- **Stadium Data CMS**: Admin interface for managing data (defer complexity)
- **Multi-language Support**: Full i18n for Spanish (Mexico) and French (Canada)
- **AR Seat Preview**: Augmented reality view of seat perspective
- **Real-time Crowd Insights**: Heat maps of where fans are sitting (requires partnerships)

### 11.2 Technology Evolution

- **Serverless Architecture**: Move calculations to edge functions (Vercel Edge)
- **Real-time Collaboration**: Allow users to share seat selections with friends
- **Machine Learning**: Predict optimal seats based on user preferences
- **Mobile App**: Native iOS/Android apps (currently PWA only)

### 11.3 Business Model (Not in v2)

- **Affiliate Revenue**: Earn commission on ticket sales via SeatGeek/StubHub links
- **Premium Features**: Advanced filters, unlimited comparisons, historical data
- **API Access**: Offer API for third-party integrations (ticketing sites, blogs)
- **Sponsorships**: Stadium-specific sponsorships (e.g., "Shaded seats brought to you by...")

---

## 12. Open Questions

### Q1: Data Collection Method for MLB
**Question**: What is the most efficient way to collect row-level data for 30 MLB stadiums?

**Options**:
1. Manual curation from official seating charts (time-intensive but accurate)
2. Photogrammetry from stadium photos (faster but less accurate)
3. Partner with ticketing platforms (SeatGeek, StubHub) for data access
4. Crowdsource from community (via "Report Inaccuracy" submissions)

**Recommendation**: Combination of #1 (official charts) and #2 (photogrammetry) for initial data, with #4 (community) for ongoing refinements. Explore #3 (partnerships) for long-term scalability.

**Decision Needed**: By Week 1 of Phase 1

---

### Q2: 3D Stadium Preview Priority
**Question**: Should we build a 3D stadium preview in v2, or defer to v3?

**Options**:
1. Include in v2 (high effort, high value for visual learners)
2. Defer to v3 (reduce scope, focus on core features)
3. Prototype in v2, launch in v3 (validate user interest first)

**Recommendation**: Option 3 - Build a simple prototype to gauge user interest, but don't commit to full 3D rendering in v2. 2D diagrams are sufficient for MVP.

**Decision Needed**: By Phase 2 planning

---

### Q3: World Cup Match Data Source
**Question**: How do we keep World Cup match schedule accurate as teams are determined?

**Options**:
1. Manually update static data file (`matches.ts`) as tournament progresses
2. Integrate with FIFA official API (if available)
3. Scrape match data from trusted sources (ESPN, FIFA.com)

**Recommendation**: Start with #1 (manual updates) for group stage matches. Explore #2 (API) or #3 (scraping) for knockout rounds when teams are determined.

**Decision Needed**: By Phase 3

---

### Q4: User Feedback Storage
**Question**: Where should we store user-submitted feedback ("Report Inaccuracy")?

**Options**:
1. Email to admin (simple but hard to track)
2. Database (PostgreSQL, Supabase) for structured storage
3. GitHub Issues (transparent, collaborative)
4. Airtable or Google Sheets (quick setup, easy review)

**Recommendation**: Option 4 (Airtable) for v2 - Quick to set up, easy to review, low overhead. Migrate to #2 (database) in v3 if volume grows.

**Decision Needed**: By Phase 4

---

### Q5: Mobile App vs. PWA
**Question**: Should we build native mobile apps (iOS, Android) or rely on PWA?

**Options**:
1. PWA only (current approach, lower cost)
2. Native apps (better performance, app store discoverability)
3. Hybrid (React Native) - single codebase for both

**Recommendation**: Option 1 (PWA) for v2. Defer native apps to v3 based on user demand. PWA is sufficient for most use cases and has lower development cost.

**Decision Needed**: Post-v2 (not blocking)

---

## 13. Appendix

### 13.1 Glossary

- **Row-Level Data**: Geometric data for individual rows within a stadium section, including elevation, depth, and seat positions
- **3D Ray Tracing**: Technique to calculate sun obstruction by tracing rays from seats to sun position and checking for intersections with obstructions
- **BVH (Bounding Volume Hierarchy)**: Acceleration structure for fast ray-intersection tests in 3D space
- **LOD (Level of Detail)**: Rendering/calculation strategy that reduces complexity for distant or less important elements
- **Core Web Vitals**: Google's performance metrics (LCP, FID, CLS) for measuring user experience
- **Obstruction**: Any stadium structure that blocks sunlight (roof, upper deck, scoreboard, etc.)
- **Section**: A contiguous group of seats in a stadium, typically labeled with numbers/letters (e.g., Section 120)
- **Shade Percentage**: Percentage of time (or area) that a seat/section is in shade, calculated from 0-100%

### 13.2 Reference Links

**Codebase**:
- GitHub: (private repository)
- Vercel: https://theshadium.com

**Data Sources**:
- Open-Meteo Weather API: https://open-meteo.com/
- MLB Stats API: https://statsapi.mlb.com/
- SunCalc Library: https://github.com/mourner/suncalc

**Design Inspiration**:
- SeatGeek: https://seatgeek.com/
- StubHub: https://www.stubhub.com/
- Ticketmaster 3D Venue Maps: https://www.ticketmaster.com/

**World Cup 2026**:
- FIFA Official Site: https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026
- USA Venues: https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026/news/fifa-world-cup-2026tm-match-schedule-cities-venues-and-kick-off-times-revealed

### 13.3 File Locations (Key)

**Data Files**:
- MLB Stadiums: `/src/data/stadiums.ts`
- NFL Venues: `/src/data/nflStadiums.ts`
- MiLB Stadiums: `/src/data/milbStadiums.ts`
- World Cup Venues: `/src/data/worldcup2026/venues.ts`
- Unified Venues: `/src/data/unifiedVenues.ts`

**Section Data**:
- NFL Sections: `/src/data/sections/nfl/` (32 files)
- World Cup Sections: `/src/data/sections/worldcup/` (5 files)
- MiLB Sections: `/src/data/sections/milb/` (organized by level)

**Calculation Engine**:
- Sun Calculations: `/src/utils/sunCalculations.ts`
- 3D Shade Calculator: `/src/utils/shadeCalculation3DOptimized.ts`
- Sun Calculator: `/src/utils/sunCalculator.ts`

**Type Definitions**:
- Stadium Complete: `/src/types/stadium-complete.ts`
- Section Types: `/src/data/stadiumSectionTypes.ts`

**UI Components**:
- Game Selector: `/src/components/UnifiedGameSelector.tsx`
- Section Cards: `/src/components/LazySectionCardModern.tsx`
- Filters: `/src/components/EnhancedSunFilter.tsx`
- Mobile App: `/src/MobileApp.tsx`

**Pages**:
- Homepage: `/app/HomePage.tsx`
- Stadium Detail: `/app/stadium/[stadiumId]/page.tsx`
- World Cup Landing: `/app/worldcup2026/page.tsx`

---

## 14. Approval & Sign-off

This PRD defines the requirements for TheShadium.com World Cup v2. Implementation will proceed in phases as outlined in Section 8.

**Key Stakeholders**:
- Product Owner: [Name]
- Engineering Lead: [Name]
- Design Lead: [Name]

**Approval Process**:
1. Review this PRD for completeness and accuracy
2. Clarify any open questions (Section 12)
3. Approve to proceed to Technical Specification phase
4. Implementation begins after spec approval

---

**Document Status**: ✅ Complete - Ready for Review
**Next Step**: Technical Specification (spec.md)
**Target Start Date**: Week 1, Phase 1 (upon approval)

---

*End of Product Requirements Document*
