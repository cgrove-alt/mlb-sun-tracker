# Product Requirements Document (PRD)
## 2026 Row-Level Sun Calculations & World Cup Feature Expansion

**Project**: TheStadium.com Enhancement
**Version**: 1.0
**Date**: January 22, 2025
**Status**: Draft - Awaiting Approval

---

## 1. Executive Summary

TheStadium.com is the most accurate stadium seat shade finder for sports venues in North America. Currently, the platform provides **section-level** sun exposure calculations for 160+ stadiums across MLB (30), NFL (32), and MiLB (100+).

This project aims to transform the platform from section-level to **row-level precision** while adding comprehensive **2026 FIFA World Cup** support. These enhancements will significantly improve accuracy and expand market reach during a major international sporting event.

### Core Objectives
1. **Upgrade sun calculations from section-level to row-level granularity** for all existing stadiums
2. **Add 2026 World Cup venues** (16 North American stadiums hosting matches)
3. **Enhance UX/UI** for improved usability and modern design patterns
4. **Maintain performance** while handling increased data complexity

---

## 2. Current State Analysis

### 2.1 Technical Architecture
- **Framework**: Next.js 15.5.7 (App Router) with TypeScript 5.0
- **Styling**: CSS Modules + Tailwind CSS 3.4.17
- **Deployment**: Vercel with automated CI/CD
- **Data Storage**: Static TypeScript/JSON files (no database)
- **Sun Calculations**: SunCalc library v1.9.0 with custom shadow algorithms

### 2.2 Current Coverage
| Sport | Venues | Granularity | Data Quality |
|-------|---------|-------------|--------------|
| MLB | 30 stadiums | Section-level | Complete |
| NFL | 32 stadiums | Section-level | Complete |
| MiLB | 100+ stadiums | Section-level | Complete |
| Soccer/World Cup | 0 stadiums | N/A | Missing |

**Total**: 213 section definition files covering 160+ unique venues

### 2.3 Current Sun Calculation System

**Location**: `/src/utils/sunCalculator.ts` (477 lines)

**Algorithm (Section-Level)**:
```typescript
interface ShadowData {
  sectionId: string;
  coverage: number;        // 0-100% shadow
  inShadow: boolean;       // coverage >= 50%
  shadowSources: {
    roof: number;          // Roof shadow %
    upperDeck: number;     // Upper deck shadow %
    bowl: number;          // Bowl structure shadow %
  };
  sunExposure: number;     // 0-100% direct sun
}
```

**Current Calculation Steps**:
1. Calculate sun position (altitude & azimuth) using SunCalc
2. Determine section angle relative to sun
3. Calculate base sun exposure (0-100%)
4. Apply shadow from roof structures
5. Apply shadow from upper deck (for lower/field sections)
6. Apply shadow from bowl geometry (low sun angles)
7. Return single exposure percentage for entire section

**Limitations**:
- ❌ Cannot distinguish between Row A (front) and Row Z (back)
- ❌ Treats entire section uniformly
- ❌ `coveredRows` field exists but not parsed/used
- ❌ No depth modeling per row
- ❌ No individual seat-level precision

### 2.4 Data Structure Analysis

**Current (Section-Level)**:
```typescript
interface StadiumSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  baseAngle: number;      // 0-360° from home plate
  angleSpan: number;      // Degrees this section spans
  rows?: number;          // Count only, not used
  covered: boolean;       // Binary: full or no coverage
  coveredRows?: string;   // "M-Z" notation (not parsed)
  price?: 'value' | 'moderate' | 'premium' | 'luxury';
}
```

**Available But Unused** (`/src/types/stadium-complete.ts`):
```typescript
interface RowDetail {
  rowNumber: string;
  seats: number;
  elevation: number;      // Height above field
  depth: number;          // Distance from section front
  covered: boolean;       // Row-specific coverage
  overhangHeight?: number;
  seatPositions?: Vector3D[];
}

interface DetailedSection {
  id: string;
  name: string;
  level: string;
  baseAngle: number;
  angleSpan: number;
  rows: RowDetail[];      // ⭐ Row-level array
  vertices3D: Vector3D[];
  covered: boolean;
  partialCoverage?: CoverageDetail;
  // ... additional fields
}
```

**Key Finding**: The infrastructure for row-level data already exists in type definitions but is not actively used in calculations or populated for most stadiums.

### 2.5 Current UX/UI Components

**Component Count**: 115+ React components organized by feature

**Key UI Patterns**:
- ✅ Mobile-first responsive design
- ✅ Virtual scrolling for large section lists
- ✅ Advanced filtering (shade, level, price)
- ✅ Real-time sun calculation updates
- ✅ Accessibility support (ARIA, keyboard nav)
- ✅ PWA features (offline, install prompt)

**Component Examples**:
- `SectionResults.tsx` - Main section list display
- `EnhancedSunFilter.tsx` - Advanced filtering UI
- `GameSelector.tsx` - Date/time picker
- `SectionAccordion.tsx` - Expandable section details
- `SunExposureBadge.tsx` - Visual shade indicator

**UX Opportunities Identified**:
- 🔧 Row-level detail display (currently shows section only)
- 🔧 Visual row-by-row shade gradients
- 🔧 Specific row recommendations ("Rows A-M in shade, N-Z in sun")
- 🔧 Interactive seat maps with shade overlay
- 🔧 Comparison tools for different dates/times

### 2.6 World Cup Feature Gap

**Current Status**: Zero soccer/World Cup support

**What Exists**:
- ✅ Type definitions for soccer venues in `/src/types/venues.ts`
- ✅ Placeholder for "venueType: soccer" (8 venues marked)

**What's Missing**:
- ❌ 2026 World Cup venue data (16 stadiums)
- ❌ Soccer field geometry (rectangular vs baseball diamond)
- ❌ Soccer-specific sun calculations
- ❌ World Cup match schedule integration
- ❌ International team branding/naming
- ❌ Multi-language support (Spanish, French)
- ❌ World Cup-specific UI components

### 2.7 Performance Characteristics

**Current Optimizations**:
- ✅ Code splitting (213 section files as separate chunks)
- ✅ Lazy loading with Suspense boundaries
- ✅ Virtual scrolling for large lists
- ✅ Image optimization (AVIF, WebP)
- ✅ API caching (3600s server, 86400s SWR)

**Concerns with Row-Level Data**:
- 📊 Data size will increase significantly (30-50 rows per section)
- 📊 Calculation complexity grows proportionally
- 📊 Need efficient data structures to maintain speed

---

## 3. Problem Statement

### 3.1 Accuracy Limitation (Section-Level)

**Problem**: Current section-level calculations provide average sun exposure across entire sections, which can span 20-50 rows and 50-200 feet in depth. This creates significant accuracy gaps.

**Real-World Impact**:
- User selects "100% shade section" at 2:00 PM game
- Reality: Rows A-K (front) are in full shade, Rows L-Z (back) are in direct sun
- User experience: Inaccurate recommendation, poor seat selection

**Example Scenario**:
```
Yankee Stadium Section 114B (current calculation):
- Section average: 65% sun exposure
- Actual breakdown (row-level):
  - Rows A-G: 0% sun (full upper deck shadow)
  - Rows H-M: 30% sun (partial shadow)
  - Rows N-Z: 100% sun (no coverage)
```

Users cannot make informed decisions without row-level precision.

### 3.2 Market Gap (World Cup)

**Problem**: The 2026 FIFA World Cup will be the largest sporting event in North American history (48 teams, 80+ matches) with significant ticket-buying activity. TheStadium.com has zero World Cup coverage.

**Business Impact**:
- 🚫 Missing major traffic opportunity (millions of international visitors)
- 🚫 Competitor advantage (if they add shade tools first)
- 🚫 Lost revenue potential (affiliate links, ads, partnerships)

**2026 World Cup Details**:
- **Dates**: June 11 - July 19, 2026
- **Host Countries**: USA (11 cities), Canada (2 cities), Mexico (3 cities)
- **Stadiums**: 16 venues (many are NFL stadiums already in database)
- **Matches**: 104 total (78 in USA, 13 in Mexico, 13 in Canada)
- **Expected Attendance**: 5+ million people

**World Cup Venues** (North America):
1. **USA (11 stadiums)**:
   - MetLife Stadium (New York/NJ) - Already in DB as NFL
   - SoFi Stadium (Los Angeles) - Already in DB as NFL
   - AT&T Stadium (Dallas) - Already in DB as NFL
   - Mercedes-Benz Stadium (Atlanta) - Already in DB as NFL
   - Arrowhead Stadium (Kansas City) - Already in DB as NFL
   - Hard Rock Stadium (Miami) - Already in DB as NFL
   - Lincoln Financial Field (Philadelphia) - Already in DB as NFL
   - Levi's Stadium (San Francisco) - Already in DB as NFL
   - Gillette Stadium (Boston) - Already in DB as NFL
   - NRG Stadium (Houston) - Already in DB as NFL
   - Lumen Field (Seattle) - Already in DB as NFL

2. **Mexico (3 stadiums)**:
   - Estadio Azteca (Mexico City) - NOT in DB
   - Estadio Akron (Guadalajara) - NOT in DB
   - Estadio BBVA (Monterrey) - NOT in DB

3. **Canada (2 stadiums)**:
   - BC Place (Vancouver) - NOT in DB
   - BMO Field (Toronto) - NOT in DB

**Key Insight**: 11 of 16 World Cup venues are already NFL stadiums in the database. Primary work is adapting them for soccer configuration and adding 5 new international venues.

### 3.3 UX/UI Modernization Needs

**Identified Pain Points**:
1. **Lack of visual feedback** - No seat maps showing shade gradients
2. **Limited comparison tools** - Can't easily compare sections/rows side-by-side
3. **No row-specific guidance** - "Section 114" vs "Section 114, Rows A-M"
4. **Mobile navigation complexity** - 160+ stadiums difficult to browse
5. **Static recommendations** - No "best seats for your budget + shade preference"

---

## 4. Goals & Success Metrics

### 4.1 Primary Goals

1. **Achieve Row-Level Precision**
   - Success: Every section has row-by-row sun exposure data
   - Metric: 100% of existing 213 section files upgraded to row-level

2. **Launch 2026 World Cup Support**
   - Success: All 16 World Cup venues with row-level data
   - Metric: Live before World Cup ticketing (target: Q1 2025)

3. **Maintain/Improve Performance**
   - Success: Page load times remain under 2 seconds
   - Metric: Lighthouse score ≥90 after upgrades

4. **Enhance User Experience**
   - Success: Users can identify specific rows with desired shade
   - Metric: Reduced bounce rate, increased time-on-site

### 4.2 Key Performance Indicators (KPIs)

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Calculation Granularity | Section-level | Row-level | 100% of venues |
| World Cup Coverage | 0 stadiums | 16 stadiums | Full data + UI |
| Page Load Time | 1.8s avg | <2.0s avg | Lighthouse |
| Data Accuracy | ±30% variance | ±5% variance | Field verification |
| User Task Success | 70% estimate | 90%+ | User testing |
| Mobile Performance | 85 Lighthouse | 90+ Lighthouse | Mobile audit |

### 4.3 Non-Goals (Out of Scope)

- ❌ Real-time weather integration (future phase)
- ❌ Ticket purchasing integration (future phase)
- ❌ 3D stadium visualization (types exist, but not building renderer)
- ❌ Individual seat-level precision (row-level is sufficient)
- ❌ International soccer leagues beyond World Cup
- ❌ Database migration (keeping static file approach)
- ❌ User accounts/saved preferences (future phase)

---

## 5. User Stories & Requirements

### 5.1 Core User Personas

**Persona 1: The Shade Seeker**
- **Profile**: Family attending day game, wants to avoid sun for young children
- **Current Pain**: Books "shaded section" but kids still get sunburned in back rows
- **Needs**: Row-specific shade recommendations

**Persona 2: The Sun Lover**
- **Profile**: Fan who wants maximum sun for tanning/warmth at evening games
- **Current Pain**: Can't identify which rows get most sun exposure
- **Needs**: Row-level sun exposure data to maximize vitamin D

**Persona 3: The International Tourist**
- **Profile**: European fan traveling to 2026 World Cup, unfamiliar with stadiums
- **Current Pain**: No shade information for World Cup venues
- **Needs**: World Cup-specific stadium guides with shade data

**Persona 4: The Price-Conscious Fan**
- **Profile**: Budget-conscious fan looking for best value seats
- **Current Pain**: Premium prices for entire section when only front rows are shaded
- **Needs**: Row-level filtering to find affordable rows with desired shade

### 5.2 User Stories - Row-Level Precision

**US-001: View Row-Level Shade Data**
```
As a ticket buyer
I want to see shade percentages for individual rows
So that I can choose a specific row with my desired sun exposure
```
**Acceptance Criteria**:
- Display row-by-row breakdown in section details
- Show shade percentage for each row at selected time
- Visual indicator (gradient, color coding) for quick scanning
- Mobile-responsive layout

**US-002: Filter Sections by Row Availability**
```
As a shade seeker
I want to filter sections that have shaded rows available
So that I don't waste time looking at fully exposed sections
```
**Acceptance Criteria**:
- Filter option: "Has rows with >80% shade"
- Filter option: "Has rows with <20% shade"
- Filter combines with existing filters (price, level)
- Shows count of matching rows per section

**US-003: Compare Rows Across Sections**
```
As a comparison shopper
I want to compare row-level shade data across multiple sections
So that I can make the best seat choice
```
**Acceptance Criteria**:
- Select up to 3 sections for side-by-side comparison
- Display row-by-row shade breakdown for each
- Highlight best rows meeting criteria
- Export/share comparison results

**US-004: See Time-Based Row Shade Changes**
```
As a strategic planner
I want to see how shade changes by row during the game
So that I can plan for sun exposure throughout the event
```
**Acceptance Criteria**:
- Timeline visualization showing shade evolution
- Per-row shade percentage at game start, middle, end
- Option to adjust game start time and see impact
- "Best row" recommendation based on full game duration

**US-005: Get Row-Specific Recommendations**
```
As a first-time user
I want the system to recommend specific rows
So that I don't need to analyze data myself
```
**Acceptance Criteria**:
- Input: shade preference, budget, section level preference
- Output: "Best rows for you: Section 114, Rows A-H"
- Explanation of why recommended
- Alternative options if budget doesn't match

### 5.3 User Stories - World Cup Features

**US-101: Browse World Cup Stadiums**
```
As a World Cup attendee
I want to see all 16 World Cup venues
So that I can explore shade information for matches I'm attending
```
**Acceptance Criteria**:
- Dedicated World Cup landing page
- List all 16 venues with country/city
- Filter by country (USA, Mexico, Canada)
- Show venue capacity and key features
- Link to individual stadium pages

**US-102: View Match Schedule with Shade Data**
```
As a World Cup ticket holder
I want to see shade information for specific match dates/times
So that I can prepare for weather conditions
```
**Acceptance Criteria**:
- Import World Cup match schedule (dates, times, venues)
- Show shade data pre-calculated for match kickoff times
- Display expected sun exposure during match (halves)
- Weather forecast integration if available
- Filter by team, round, or date

**US-103: Understand Soccer Stadium Layout**
```
As someone unfamiliar with soccer stadiums
I want to understand how sections are organized
So that I can navigate the seating chart
```
**Acceptance Criteria**:
- Soccer-specific section naming (e.g., "East Stand", "North End")
- Explain sideline vs end zone seating differences
- Show field orientation relative to sun path
- Visual diagram of stadium layout

**US-104: Access Multi-Language Support**
```
As an international visitor
I want to view content in my preferred language (English, Spanish, French)
So that I can understand stadium information
```
**Acceptance Criteria**:
- Language selector (EN, ES, FR)
- Translate UI labels and navigation
- Translate stadium guides (key sections)
- Preserve language preference across pages
- Default to browser language if supported

**US-105: Compare Soccer vs Other Sports Layouts**
```
As a multi-sport fan
I want to understand how soccer configurations differ from NFL
So that I can leverage my existing stadium knowledge
```
**Acceptance Criteria**:
- For dual-use stadiums (e.g., MetLife), show both layouts
- Explain section renaming/renumbering for soccer
- Highlight shade differences based on field orientation
- Toggle between NFL and World Cup mode

### 5.4 User Stories - UX/UI Enhancements

**US-201: Visual Shade Map**
```
As a visual learner
I want to see a color-coded seat map
So that I can quickly identify shaded areas
```
**Acceptance Criteria**:
- 2D stadium diagram with section outlines
- Color gradient: blue (shade) to yellow (sun)
- Interactive: hover/tap for row details
- Time slider to animate shade movement
- Works on mobile and desktop

**US-202: Mobile-Optimized Row Display**
```
As a mobile user
I want row-level data formatted for small screens
So that I can browse on my phone while buying tickets
```
**Acceptance Criteria**:
- Collapsible row lists (expand section to see rows)
- Swipe gestures for navigation
- Touch-friendly buttons (min 44px)
- Readable font sizes (16px+ for body text)
- Fast rendering with virtual scrolling

**US-203: Simplified Search Flow**
```
As a new user
I want a guided search experience
So that I can find my ideal seats quickly
```
**Acceptance Criteria**:
- Step-by-step wizard: (1) Select stadium → (2) Pick date/time → (3) Choose preferences → (4) See results
- Progress indicator showing current step
- Back button to revise choices
- Skip wizard option for advanced users
- Pre-fill if returning user (browser storage)

**US-204: Share & Save Recommendations**
```
As someone shopping with friends
I want to share specific row recommendations
So that we can coordinate ticket purchases
```
**Acceptance Criteria**:
- Generate shareable URL with selections
- URL includes: stadium, date, time, sections, rows
- Copy link button
- Social media share buttons (Twitter, Facebook, WhatsApp)
- QR code generation for in-person sharing

**US-205: Accessibility Improvements**
```
As a user with visual impairments
I want screen reader support for shade data
So that I can independently research tickets
```
**Acceptance Criteria**:
- ARIA labels for all interactive elements
- Keyboard navigation (tab order)
- High contrast mode support
- Screen reader announces shade percentages
- Focus indicators visible
- WCAG 2.1 AA compliance

---

## 6. Functional Requirements

### 6.1 Row-Level Sun Calculation System

**FR-001: Enhanced Sun Calculator**
- **Description**: Extend `/src/utils/sunCalculator.ts` to calculate per-row sun exposure
- **Inputs**:
  - Stadium geometry (latitude, longitude, orientation)
  - Section definition with `RowDetail[]` array
  - Date/time for calculation
- **Processing**:
  - For each row:
    - Calculate row position in 3D space (elevation, depth from section front)
    - Determine if row is covered by roof overhang based on `overhangHeight`
    - Calculate shadow cast by upper deck on lower rows
    - Compute sun ray intersection with row position
    - Apply shadow reduction factors
  - Return `ShadowData` per row instead of per section
- **Outputs**:
  ```typescript
  interface RowShadowData {
    rowNumber: string;
    coverage: number;        // 0-100%
    inShadow: boolean;       // coverage >= 50%
    shadowSources: {
      roof: number;
      upperDeck: number;
      bowl: number;
      overhang: number;      // NEW: overhang shadow
    };
    sunExposure: number;     // 0-100%
    elevation: number;       // Height above field
    depth: number;           // Distance from section front
  }

  interface SectionShadowData {
    sectionId: string;
    rows: RowShadowData[];
    averageCoverage: number; // Section average for filtering
  }
  ```
- **Performance Target**: Calculate 1 section (30 rows) in <10ms
- **Accuracy Target**: ±5% variance from field measurements

**FR-002: Row Data Population**
- **Description**: Populate `RowDetail[]` arrays for all existing stadiums
- **Data Sources**:
  1. Official stadium seating charts (verify row counts)
  2. Stadium architecture diagrams (for elevations, depths)
  3. Venue websites (for covered row information)
  4. Field verification (manual checks where possible)
- **Scope**:
  - 30 MLB stadiums × ~80 sections/stadium × ~25 rows/section = ~60,000 rows
  - 32 NFL stadiums × ~75 sections/stadium × ~30 rows/section = ~72,000 rows
  - 100 MiLB stadiums × ~40 sections/stadium × ~20 rows/section = ~80,000 rows
  - **Total**: ~212,000 individual row records
- **Data Structure** (per row):
  ```typescript
  {
    rowNumber: "A" | "1" | "AA",
    seats: 18,                    // Number of seats in row
    elevation: 12.5,              // Feet above field level
    depth: 8.4,                   // Feet from section front
    covered: false,               // This specific row covered?
    overhangHeight: undefined     // Height of overhang if covered
  }
  ```
- **Implementation Strategy**:
  1. Start with template-based generation (geometric assumptions)
  2. Validate against known data (verify row counts match reality)
  3. Iteratively refine with real measurements
  4. Prioritize high-traffic stadiums first (MLB > NFL > MiLB)

**FR-003: Partial Coverage Calculation**
- **Description**: Handle sections with partial row coverage (e.g., "Rows M-Z covered")
- **Logic**:
  ```
  For each row:
    if row.covered == true:
      return 0% sun exposure
    else if section has overhang:
      shadowLength = overhangHeight / tan(sunAltitude)
      if row.depth <= shadowLength:
        apply proportional shadow based on depth
      else:
        no shadow from overhang
  ```
- **Edge Cases**:
  - Retractable roofs (open vs closed states)
  - Low sun angles (long shadows from far overhangs)
  - Time-varying coverage (overhang shadow moves during game)

### 6.2 World Cup Feature Set

**FR-101: World Cup Venue Database**
- **Description**: Add 16 World Cup stadiums to `/src/data/stadiums.ts`
- **Required Fields** (per venue):
  ```typescript
  {
    id: "metlife-stadium-wc",
    name: "MetLife Stadium",
    worldCupName: "New York New Jersey Stadium", // Official FIFA name
    team: "N/A",
    league: "World Cup",
    sport: "soccer",
    city: "East Rutherford",
    state: "NJ",
    country: "USA",                // NEW field
    latitude: 40.8128,
    longitude: -74.0742,
    elevation: 10,
    timezone: "America/New_York",
    capacity: 82500,
    soccerCapacity: 87157,         // NEW: Soccer configuration
    fieldOrientation: 90,          // NEW: Soccer field angle
    sectionMapping: {              // NEW: NFL → Soccer section renaming
      "101": "South Stand 101",
      // ... mappings
    }
  }
  ```
- **Scope**:
  - 11 existing NFL stadiums (adapt for soccer)
  - 5 new international stadiums (full data entry)
- **Data Sources**:
  - FIFA 2026 official venue list
  - Stadium websites
  - Google Maps (coordinates)
  - SeatGeek/StubHub seating charts

**FR-102: Soccer Field Geometry**
- **Description**: Add soccer-specific field geometry to stadium types
- **New Interface**:
  ```typescript
  interface SoccerVenue extends BaseVenue {
    sport: 'soccer';
    seatingGeometry: {
      bowlShape: 'rectangular' | 'oval';
      fieldLength: number;        // 100-130 yards
      fieldWidth: number;         // 50-100 yards
      fieldOrientation: number;   // 0-360° from north
      sidelineAngles: {
        east: number;
        west: number;
      };
      endZoneAngles: {
        north: number;
        south: number;
      };
    };
  }
  ```
- **Sun Calculation Adjustments**:
  - Soccer fields are rectangular (not diamond-shaped)
  - Sideline sections align with long edges
  - End zone sections align with short edges
  - Field orientation affects shade differently than baseball

**FR-103: World Cup Match Schedule**
- **Description**: Import and display World Cup match schedule
- **Data Format**:
  ```typescript
  interface WorldCupMatch {
    matchId: string;
    date: string;              // ISO 8601
    kickoffTime: string;       // Local time
    venue: string;             // Stadium ID
    round: string;             // "Group Stage", "Round of 16", etc.
    teamA: string;             // Team name or TBD
    teamB: string;
    tvChannel?: string;
  }
  ```
- **Data Source**: FIFA official schedule (public API or manual entry)
- **UI Integration**:
  - Filter stadiums by upcoming matches
  - Pre-populate date/time for match shade lookup
  - Display "Next World Cup match" on stadium pages

**FR-104: Multi-Language Support**
- **Description**: Internationalization (i18n) for English, Spanish, French
- **Implementation**: Next.js `next-intl` or `react-i18next`
- **Translatable Content**:
  - Navigation labels ("Home", "Stadiums", "About")
  - Filter labels ("Shade Level", "Price Range")
  - Stadium guides (key paragraphs)
  - Error messages
  - SEO metadata (titles, descriptions)
- **Non-Translatable**: Stadium names, section IDs, raw data
- **Scope**:
  - Core UI: 100% translated
  - Stadium guides: 50% translated (key sections only)
  - Blog content: English only (future expansion)

**FR-105: World Cup Landing Page**
- **Description**: Dedicated `/world-cup-2026` page
- **Content**:
  - Hero section: "2026 FIFA World Cup Shade Guide"
  - Venue map (North America with pins)
  - List of 16 stadiums (sortable by country, capacity)
  - Match schedule preview (next 10 matches)
  - CTA: "Find your perfect World Cup seats"
- **SEO**: Optimize for "2026 World Cup tickets shade", "World Cup stadium sun"

### 6.3 UX/UI Requirements

**FR-201: Row-Level Display Component**
- **Description**: Create `RowBreakdownView.tsx` component
- **Inputs**: Section ID, date/time, row shadow data
- **Display**:
  - Table view: Row | Seats | Shade % | Recommendation
  - Visual bar chart: Shade percentage gradient per row
  - Collapsible (mobile) / always-visible (desktop)
- **Interactions**:
  - Sort by row number or shade percentage
  - Filter: "Show only rows with >70% shade"
  - Highlight best rows based on user preference

**FR-202: Enhanced Section Card**
- **Description**: Update `SectionCard.tsx` to show row summary
- **Before (section-level)**:
  ```
  Section 114
  Average Shade: 65%
  Price: Moderate
  ```
- **After (row-level)**:
  ```
  Section 114
  Rows A-M: 0-20% sun ☂️
  Rows N-Z: 80-100% sun ☀️
  Price: Moderate
  ```
- **Interaction**: Click to expand full row breakdown

**FR-203: Visual Seat Map (Optional - Phase 2)**
- **Description**: 2D stadium diagram with color-coded sections/rows
- **Libraries**: SVG-based custom rendering or Canvas API
- **Features**:
  - Zoom/pan on mobile
  - Tooltip on hover (desktop) / tap (mobile)
  - Toggle between section-view and row-view
- **Priority**: Medium (nice-to-have, not MVP)

**FR-204: Comparison Tool**
- **Description**: Side-by-side section/row comparison
- **UI Flow**:
  1. User selects "Compare" on 2-3 sections
  2. Open comparison modal/page
  3. Display rows side-by-side in columns
  4. Highlight differences (one section more shaded, etc.)
- **Mobile**: Stack vertically instead of side-by-side

**FR-205: Accessibility Enhancements**
- **Requirements**:
  - All images have `alt` text
  - Form inputs have `<label>` associations
  - Focus styles visible (2px outline)
  - Color contrast ≥4.5:1 (WCAG AA)
  - Skip links to main content
  - ARIA landmarks (`<main>`, `<nav>`, `<aside>`)
  - Screen reader announcements for dynamic updates
- **Testing**: Run `@axe-core/playwright` tests in CI/CD

---

## 7. Non-Functional Requirements

### 7.1 Performance

**NFR-001: Page Load Time**
- **Target**: <2 seconds (median, mobile 4G)
- **Measurement**: Lighthouse Performance score ≥90
- **Optimizations**:
  - Code splitting (per-stadium chunks)
  - Lazy load row data (only when section expanded)
  - Image optimization (next/image with srcset)
  - API response caching (3600s server, 86400s SWR)

**NFR-002: Calculation Speed**
- **Target**: <100ms for full stadium row-level calculation (3000+ rows)
- **Strategy**:
  - Pre-calculate common game times (2:00 PM, 7:00 PM)
  - Cache calculations in browser (IndexedDB or localStorage)
  - Web Worker for heavy calculations (don't block UI)
  - Batch calculations (calculate all rows in section at once)

**NFR-003: Data Size**
- **Current**: 170KB `venues.json`
- **Projected**: 800KB-1.2MB with row-level data
- **Mitigation**:
  - Gzip compression (reduce to ~200-300KB)
  - Lazy load per-stadium (only fetch data for selected stadium)
  - Incremental loading (load section data as user scrolls)

### 7.2 Scalability

**NFR-004: Data Management**
- **Challenge**: 212,000 row records to maintain
- **Solution**:
  - Template-based generation scripts (auto-generate baseline data)
  - Version control (Git tracks all data changes)
  - Validation scripts (detect missing/invalid data)
  - Prioritized data entry (MLB first, then NFL, then MiLB)

**NFR-005: Build Time**
- **Current**: ~90 seconds for full build
- **Projected**: ~120-180 seconds with row data
- **Mitigation**:
  - Incremental Static Regeneration (ISR) for stadium pages
  - Parallel builds (Vercel supports)
  - Pre-build data validation (fail fast on errors)

### 7.3 Reliability

**NFR-006: Calculation Accuracy**
- **Target**: ±5% variance from real-world measurements
- **Validation**:
  - Field testing (attend games, verify shade at recorded times)
  - Compare with stadium diagrams
  - User feedback loop (report inaccurate data)

**NFR-007: Error Handling**
- **Requirements**:
  - Graceful degradation (if row data missing, fall back to section-level)
  - User-friendly error messages (no technical jargon)
  - Logging (track calculation failures)
  - Fallback UI (show partial data if API fails)

### 7.4 Maintainability

**NFR-008: Code Quality**
- **Standards**:
  - TypeScript strict mode enabled
  - ESLint rules enforced (no warnings in production)
  - 80%+ test coverage (unit + integration)
  - Component documentation (JSDoc comments)
  - Consistent naming conventions

**NFR-009: Data Updates**
- **Process**:
  - Document data update workflow
  - Scripts to add new stadiums (templates)
  - Validation on every commit (GitHub Actions)
  - Changelog for data changes

### 7.5 Security

**NFR-010: Security Headers**
- **Headers** (already implemented in `vercel.json`):
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Content-Security-Policy` (CSP)
- **Action**: Verify still applied after changes

**NFR-011: Data Privacy**
- **Requirements**:
  - No personally identifiable information (PII) collected
  - Google Analytics with IP anonymization
  - Cookie consent (if adding analytics)
  - GDPR compliance (data retention policies)

---

## 8. Technical Approach & Constraints

### 8.1 Architectural Decisions

**Decision 1: Keep Static File Approach (No Database)**
- **Rationale**:
  - Current system works well for read-heavy use case
  - No database hosting costs
  - Simple deployment (no migrations)
  - Version control tracks all changes
  - Vercel CDN caches files globally
- **Trade-off**: Manual data entry instead of admin UI
- **Status**: Approved ✅

**Decision 2: Template-Based Row Generation**
- **Rationale**:
  - Manually entering 212,000 rows is infeasible
  - Most sections follow geometric patterns (rake angle, row spacing)
  - Can generate baseline data, then refine with real measurements
- **Process**:
  1. Define section templates (field-level, lower, upper, etc.)
  2. Generate rows based on template (elevation, depth calculations)
  3. Validate against real stadium data (row counts, covered rows)
  4. Manual overrides for exceptions (irregular sections)
- **Tool**: Create `/scripts/generateRowData.ts` script
- **Status**: Proposed, needs approval

**Decision 3: Incremental Rollout**
- **Rationale**:
  - Don't need to complete all 160+ stadiums at once
  - Prioritize high-traffic stadiums for quick wins
  - Allows testing and refinement before full rollout
- **Rollout Phases**:
  1. **Phase 1 (MVP)**: 5 MLB stadiums + 5 World Cup stadiums (2 weeks)
  2. **Phase 2**: Remaining 25 MLB stadiums (4 weeks)
  3. **Phase 3**: 32 NFL stadiums (6 weeks)
  4. **Phase 4**: 100 MiLB stadiums (8 weeks)
- **Status**: Proposed, needs approval

**Decision 4: World Cup as Separate League**
- **Rationale**:
  - World Cup is temporary event (June-July 2026)
  - Many World Cup stadiums overlap with NFL (dual-use)
  - Need separate section IDs for soccer configuration
- **Implementation**:
  - Create `league: 'WorldCup'` category
  - Duplicate NFL stadiums with `*-wc` ID suffix (e.g., `metlife-stadium-wc`)
  - Add section mapping to translate NFL sections to soccer sections
- **Status**: Proposed, needs approval

### 8.2 Technical Constraints

**Constraint 1: Browser Compatibility**
- **Target**: Last 2 versions of Chrome, Firefox, Safari, Edge
- **No Support**: IE11, legacy browsers
- **Feature Detection**: Use polyfills for missing APIs (IndexedDB, Web Workers)

**Constraint 2: Mobile Performance**
- **Challenge**: Row-level data increases memory usage on mobile
- **Mitigation**:
  - Virtual scrolling for row lists (only render visible rows)
  - Lazy load images
  - Reduce JavaScript bundle size (tree shaking)

**Constraint 3: Data Accuracy**
- **Challenge**: Cannot verify every row in every stadium manually
- **Mitigation**:
  - Start with geometric templates (baseline accuracy)
  - User feedback system (report inaccurate data)
  - Iterative refinement based on field testing

**Constraint 4: Time to Market**
- **Deadline**: World Cup features must launch by Q1 2025 (before ticketing)
- **Risk**: If row-level data entry takes too long, delay MiLB stadiums
- **Mitigation**: Prioritize World Cup + MLB, defer MiLB to later phase

### 8.3 Technology Stack (No Changes)

**Current Stack** (keeping as-is):
- **Framework**: Next.js 15.5.7 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.17 + CSS Modules
- **Sun Calculations**: SunCalc v1.9.0
- **Deployment**: Vercel
- **Testing**: Jest (unit), Playwright (E2E)
- **Analytics**: Google Analytics 4

**Potential Additions** (if needed):
- **i18n**: `next-intl` or `react-i18next` for multi-language
- **Data Validation**: Zod or Yup for schema validation
- **Storage**: IndexedDB (for client-side caching)
- **3D Rendering** (optional): Three.js (already in dependencies)

---

## 9. Data Requirements

### 9.1 Row-Level Data Schema

**Schema Definition**:
```typescript
// Extends existing DetailedSection interface
interface EnhancedStadiumSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  baseAngle: number;
  angleSpan: number;
  covered: boolean;
  price?: 'value' | 'moderate' | 'premium' | 'luxury';

  // NEW: Row-level array
  rows: RowDetail[];
}

interface RowDetail {
  rowNumber: string;          // "A", "1", "AA", "Terrace A"
  seats: number;              // 12-30 typical
  elevation: number;          // Feet above field level
  depth: number;              // Feet from section front
  covered: boolean;           // Is this row under overhang?
  overhangHeight?: number;    // If covered, height of overhang
}
```

### 9.2 Data Collection Process

**Step 1: Gather Source Data**
- **Official Seating Charts**: Download PDFs from stadium websites
- **Architecture Diagrams**: Find cross-section views showing elevations
- **Field Verification**: Attend games, take measurements (photo + notes)
- **SeatGeek/StubHub**: Scrape row counts and section layouts

**Step 2: Extract Key Metrics**
- **Row Count**: Total rows per section (e.g., "Section 114 has rows A-Z")
- **Covered Rows**: Identify which rows have overhang (e.g., "Rows M-Z covered")
- **Elevation Rise**: Measure or estimate rise per row (typically 2-3 feet)
- **Section Depth**: Total depth from front to back (calculate row depths)

**Step 3: Generate Initial Data**
- **Script**: `/scripts/generateRowData.ts`
- **Inputs**: Section ID, row range, template type
- **Process**:
  ```typescript
  function generateRows(
    section: StadiumSection,
    template: SectionTemplate
  ): RowDetail[] {
    const rows: RowDetail[] = [];
    const rowCount = section.rows || template.defaultRowCount;

    for (let i = 0; i < rowCount; i++) {
      const rowNumber = getRowNumber(i, template.rowNaming); // "A", "1", etc.
      const elevation = template.baseElevation + (i * template.rakeHeight);
      const depth = i * template.rowSpacing;
      const covered = i >= template.coveredRowStart;

      rows.push({
        rowNumber,
        seats: template.seatsPerRow - Math.floor(i * template.seatTaper),
        elevation,
        depth,
        covered,
        overhangHeight: covered ? template.overhangHeight : undefined
      });
    }

    return rows;
  }
  ```
- **Output**: TypeScript file with row data array

**Step 4: Validate & Refine**
- **Validation Script**: Check row counts match reality
- **Manual Review**: Compare generated data to seating charts
- **Adjustments**: Override template for irregular sections
- **Field Testing**: Verify shade calculations at real games

### 9.3 World Cup Data Requirements

**Required for Each World Cup Venue**:
1. **Basic Info**:
   - FIFA official name
   - City, country
   - Coordinates (lat/long)
   - Timezone
   - Capacity (soccer configuration)

2. **Field Geometry**:
   - Field orientation (degrees from north)
   - Field dimensions (length × width)
   - Section angles relative to field

3. **Section Data**:
   - Section ID mapping (NFL → Soccer if dual-use)
   - Row-level data (same as other stadiums)
   - Covered sections

4. **Match Schedule**:
   - Date/time of World Cup matches at this venue
   - Teams playing (or TBD)
   - Round (Group Stage, Knockout, etc.)

**Data Sources**:
- **FIFA**: Official venue list, match schedule
- **Stadium Websites**: Seating charts, dimensions
- **Wikipedia**: Historical data, coordinates
- **Google Maps**: Verify coordinates, field orientation

### 9.4 Data Validation Rules

**Validation Checks**:
1. **Row Count**: `rows.length` matches documented row count
2. **Row Numbers**: Sequential (A, B, C or 1, 2, 3) with no gaps
3. **Elevation**: Monotonically increasing (back rows higher than front)
4. **Depth**: Monotonically increasing (back rows deeper than front)
5. **Covered Rows**: If section is covered, at least some rows have `covered: true`
6. **Seat Count**: Reasonable range (8-40 seats per row)
7. **Overhang Height**: If row is covered, `overhangHeight` is defined
8. **No Duplicates**: No duplicate row numbers in same section

**Validation Script**:
```bash
npm run validate:row-data
```
Outputs:
```
✅ Yankees Stadium: 82 sections, 2,456 rows validated
❌ Fenway Park: Section 33 missing rows Q-Z
⚠️  Dodger Stadium: Section 12 has only 8 seats in Row A (check if correct)
```

---

## 10. UI/UX Design Specifications

### 10.1 Row-Level Display Patterns

**Pattern 1: Collapsed Section Card (Default)**
```
┌─────────────────────────────────────┐
│ Section 114B                  [▼]   │
│ ☀️ Rows A-M: Mostly Shaded         │
│ ☂️ Rows N-Z: Full Sun              │
│ Price: Moderate • 26 rows          │
└─────────────────────────────────────┘
```

**Pattern 2: Expanded Row Breakdown**
```
┌─────────────────────────────────────┐
│ Section 114B                  [▲]   │
│ ☀️ Rows A-M: Mostly Shaded         │
│ ☂️ Rows N-Z: Full Sun              │
│ Price: Moderate • 26 rows          │
│                                     │
│ Detailed Row Breakdown:             │
│ ┌─────┬───────┬─────────┐          │
│ │ Row │ Seats │  Shade  │          │
│ ├─────┼───────┼─────────┤          │
│ │  A  │  18   │ ████░░ 85% │       │
│ │  B  │  18   │ ████░░ 82% │       │
│ │  C  │  18   │ ███░░░ 78% │       │
│ │  D  │  18   │ ███░░░ 74% │       │
│ │  ...│  ...  │    ...     │       │
│ │  Z  │  14   │ ░░░░░░  5% │       │
│ └─────┴───────┴─────────┘          │
│                                     │
│ [View on Map] [Compare]             │
└─────────────────────────────────────┘
```

**Pattern 3: Visual Gradient Bar**
```
Section 114B Shade Overview (2:00 PM):

Front ████████░░░░░░░░░░░ Back
Rows   A                Z
      100%              0%
```

### 10.2 Filter UI Updates

**Current Filters**:
- Shade Level: Excellent / Good / Partial / Full Sun
- Price: Value / Moderate / Premium / Luxury
- Level: Field / Lower / Club / Upper / Suite

**New Row-Level Filters**:
- **"Has rows with >80% shade"** (checkbox)
- **"Has rows with <20% shade"** (checkbox)
- **"Show only best rows"** (toggle - hides rows not meeting criteria)

**Filter Logic**:
```typescript
// Section qualifies if ANY row meets criteria
if (filter.hasShadeRows) {
  const hasShadeRows = section.rows.some(row => row.sunExposure <= 20);
  if (!hasShadeRows) return false; // Exclude this section
}
```

### 10.3 Mobile Optimizations

**Mobile Row Display**:
- Use accordion pattern (tap to expand section, tap row for details)
- Show top 3 rows and bottom 3 rows by default (hide middle rows)
- "Show all X rows" button to expand full list
- Swipe left/right to navigate between sections
- Sticky section header while scrolling rows

**Touch Targets**:
- Minimum 44×44 px for buttons
- Adequate spacing between interactive elements (16px)

**Performance**:
- Virtual scrolling for row lists (only render visible rows)
- Lazy load images (stadium photos)
- Reduce animations on low-end devices

### 10.4 Accessibility Design

**Screen Reader Announcements**:
```html
<div role="region" aria-label="Section 114B shade breakdown">
  <button aria-expanded="false" aria-controls="rows-114b">
    Section 114B
  </button>
  <div id="rows-114b" hidden>
    <table role="table" aria-label="Row-by-row shade percentages">
      <tr>
        <td>Row A</td>
        <td>18 seats</td>
        <td aria-label="85 percent shaded">85%</td>
      </tr>
      <!-- ... -->
    </table>
  </div>
</div>
```

**Keyboard Navigation**:
- `Tab`: Focus next interactive element
- `Enter/Space`: Expand/collapse section
- `Arrow keys`: Navigate row table
- `Esc`: Close modal/comparison view

**High Contrast Mode**:
- Use semantic color variables (CSS custom properties)
- Ensure 7:1 contrast for text (WCAG AAA)
- Icons have text alternatives

### 10.5 World Cup UI Components

**Component: World Cup Venue Card**
```
┌─────────────────────────────────────┐
│ 🏟️ MetLife Stadium                  │
│ 📍 East Rutherford, NJ, USA         │
│ 🎫 Capacity: 87,157 (Soccer)        │
│                                     │
│ Upcoming Matches:                   │
│ • Jun 15: Group A • 5:00 PM         │
│ • Jun 22: Group D • 2:00 PM         │
│                                     │
│ [View Shade Guide] [See All Matches]│
└─────────────────────────────────────┘
```

**Component: World Cup Landing Hero**
```
╔═══════════════════════════════════════╗
║                                       ║
║   ⚽ 2026 FIFA WORLD CUP SHADE GUIDE  ║
║                                       ║
║   Find the perfect seats at all 16   ║
║   North American World Cup venues    ║
║                                       ║
║   [Browse Stadiums] [View Schedule]  ║
║                                       ║
╚═══════════════════════════════════════╝
```

**Language Selector**:
```
┌──────────────────┐
│ 🌐 EN ▼          │  ← Dropdown
├──────────────────┤
│ English          │
│ Español          │
│ Français         │
└──────────────────┘
```

---

## 11. Testing & Quality Assurance

### 11.1 Testing Strategy

**Unit Tests** (Jest):
- **Sun Calculation Logic**: Test row-level shade calculations
  - Input: Stadium, section, row, date/time
  - Expected: Correct shade percentage ±5%
  - Edge cases: Sunrise, sunset, noon, low sun angles
- **Data Validation**: Test row data validators
  - Valid data passes
  - Invalid data (gaps, duplicates) fails
- **Component Logic**: Test UI component state management
  - Expand/collapse sections
  - Filter application
  - Sort order

**Integration Tests** (Playwright):
- **End-to-End User Flows**:
  1. Navigate to stadium page
  2. Select date/time
  3. View section list
  4. Expand section to see rows
  5. Filter by shade level
  6. Verify results match expected
- **World Cup Flows**:
  1. Navigate to World Cup landing page
  2. Select venue
  3. View match schedule
  4. Check shade for specific match time
- **Mobile Flows**:
  1. Open on mobile viewport (375px)
  2. Test touch interactions
  3. Verify virtual scrolling works
  4. Check performance (no jank)

**Visual Regression Tests** (Playwright):
- Capture screenshots of key pages
- Compare against baseline (flag differences)
- Pages to test:
  - Home page
  - Stadium page (section list)
  - Section detail (expanded rows)
  - World Cup landing page
  - Mobile versions of all

**Accessibility Tests** (axe-core + Playwright):
- Run automated accessibility checks
- Verify WCAG 2.1 AA compliance
- Check keyboard navigation
- Test screen reader compatibility

### 11.2 Validation Criteria

**Row-Level Calculation Accuracy**:
- **Method**: Field verification at 5-10 stadiums
- **Process**:
  1. Attend game with sun meter (measure sun intensity)
  2. Record time, section, row
  3. Compare measured shade vs calculated shade
  4. Calculate error percentage
- **Success**: <10% average error

**Performance Benchmarks**:
- **Lighthouse Scores** (mobile):
  - Performance: ≥90
  - Accessibility: 100
  - Best Practices: ≥95
  - SEO: 100
- **Page Load Time**: <2s (median, mobile 4G)
- **Calculation Speed**: <100ms for full stadium (3000+ rows)

**Data Completeness**:
- **Row Data Coverage**: 100% of sections have row arrays populated
- **World Cup Coverage**: All 16 venues with complete data
- **Validation Pass Rate**: 100% of stadiums pass validation script

### 11.3 User Acceptance Testing (UAT)

**Test Group**: 10-20 beta users (mix of personas)

**UAT Scenarios**:
1. **Shade Seeker**:
   - Task: Find shaded rows for a day game at Yankee Stadium
   - Success: User identifies specific rows (e.g., "Rows A-K in Section 114")
   - Metric: Task completion time <2 minutes

2. **Sun Lover**:
   - Task: Find sunniest rows for evening game at Wrigley Field
   - Success: User identifies rows with >90% sun exposure
   - Metric: User rates ease-of-use ≥4/5

3. **World Cup Tourist**:
   - Task: Find shade information for a World Cup match in Dallas
   - Success: User navigates to AT&T Stadium, views match schedule, sees shade data
   - Metric: Task completion without assistance

4. **Comparison Shopper**:
   - Task: Compare rows across 3 sections to find best value
   - Success: User uses comparison tool, makes informed decision
   - Metric: User confidence rating ≥4/5

**Feedback Collection**:
- Post-task survey (5 questions)
- Open-ended feedback (what worked, what didn't)
- Bug reports (if encountered issues)

---

## 12. Risks & Mitigation

### 12.1 Technical Risks

**Risk 1: Data Entry Volume**
- **Severity**: High
- **Probability**: High
- **Impact**: 212,000 rows to populate - manual entry infeasible
- **Mitigation**:
  - Use template-based generation (80% automated)
  - Prioritize high-traffic stadiums (20% of stadiums = 80% of users)
  - Incremental rollout (MVP with 10 stadiums, expand over time)
  - Accept baseline accuracy, refine iteratively

**Risk 2: Calculation Performance**
- **Severity**: Medium
- **Probability**: Medium
- **Impact**: Row-level calculations could be slow on mobile devices
- **Mitigation**:
  - Pre-calculate common game times (cache results)
  - Use Web Workers for heavy calculations
  - Batch row calculations (all rows in section at once)
  - Profile and optimize hot paths

**Risk 3: Data Accuracy**
- **Severity**: Medium
- **Probability**: Medium
- **Impact**: Inaccurate shade data leads to poor user experience
- **Mitigation**:
  - Field verification for top 10 stadiums
  - User feedback system ("Report inaccurate data")
  - Conservative estimates (if unsure, err on side of less shade)
  - Disclaimers ("Estimates based on typical conditions")

**Risk 4: World Cup Timeline**
- **Severity**: High
- **Probability**: Low
- **Impact**: If World Cup features delay, miss ticketing window
- **Mitigation**:
  - Prioritize World Cup venues in Phase 1
  - Parallel development (World Cup + row-level separate tracks)
  - MVP approach (11 existing NFL stadiums easier than 5 new international)
  - Contingency: Launch World Cup without row-level if needed

### 12.2 Product Risks

**Risk 5: User Adoption**
- **Severity**: Medium
- **Probability**: Low
- **Impact**: Users don't understand row-level data or find it confusing
- **Mitigation**:
  - Clear UI design (gradual disclosure - section summary, then rows)
  - User testing (iterate based on feedback)
  - Educational content ("How to read row shade data")
  - Default to section-level, opt-in to row-level

**Risk 6: Mobile Performance**
- **Severity**: Medium
- **Probability**: Medium
- **Impact**: Large row lists cause jank on low-end devices
- **Mitigation**:
  - Virtual scrolling (only render visible rows)
  - Progressive enhancement (row-level optional on slow devices)
  - Performance budgets (monitor bundle size)
  - Test on low-end devices (not just high-end)

### 12.3 Business Risks

**Risk 7: Competitor Entry**
- **Severity**: Low
- **Probability**: Medium
- **Impact**: Competitor launches similar row-level shade tool
- **Mitigation**:
  - First-mover advantage (launch quickly)
  - Data quality (focus on accuracy)
  - SEO (rank for "row-level shade" keywords)
  - Network effects (user-generated feedback improves data)

**Risk 8: World Cup Interest Lower Than Expected**
- **Severity**: Low
- **Probability**: Low
- **Impact**: Effort on World Cup features doesn't drive traffic
- **Mitigation**:
  - Dual-use infrastructure (World Cup features reusable for MLS, future events)
  - SEO benefits (World Cup keywords)
  - Data reusable post-World Cup (stadiums remain relevant for NFL)

---

## 13. Success Criteria & Metrics

### 13.1 Launch Criteria (MVP)

**Must-Have for Launch**:
- ✅ Row-level data for 10 stadiums (5 MLB + 5 World Cup)
- ✅ Row-level sun calculation algorithm implemented
- ✅ UI displays row breakdown (expand/collapse)
- ✅ World Cup landing page with 16 venues
- ✅ Basic multi-language support (English + Spanish)
- ✅ Lighthouse Performance ≥85 (acceptable for MVP)
- ✅ No critical bugs (P0/P1)
- ✅ Accessibility audit passes (WCAG AA)

**Nice-to-Have (Can Defer)**:
- 🔄 Full 160+ stadium row-level coverage (incremental)
- 🔄 Visual seat map (Phase 2)
- 🔄 Comparison tool (Phase 2)
- 🔄 French translation (add post-launch)

### 13.2 Success Metrics (Post-Launch)

**Usage Metrics** (3 months post-launch):
- **Traffic**: 50% increase in stadium page views
- **Engagement**: 30% increase in time-on-site
- **Bounce Rate**: 10% reduction (users find relevant data)
- **Row-Level Adoption**: 60% of users expand row breakdown
- **World Cup Traffic**: 100k+ page views on World Cup pages

**Quality Metrics**:
- **Lighthouse Performance**: ≥90 (improve from MVP)
- **Accuracy**: <5% average error (field-verified)
- **Errors**: <1% error rate in calculations
- **Accessibility**: 100% WCAG AA compliance

**User Satisfaction** (via surveys):
- **Task Success Rate**: 85%+ users find desired shade info
- **Ease-of-Use**: 4+/5 average rating
- **Net Promoter Score (NPS)**: 40+ (good for niche tool)
- **Feedback Sentiment**: 80%+ positive

**Business Metrics**:
- **SEO Rankings**: Top 5 for "2026 World Cup stadium shade"
- **Backlinks**: 20+ high-quality backlinks
- **Ad Revenue**: (if applicable) 25% increase
- **Partnerships**: 1-2 partnerships (ticket sites, tourism boards)

### 13.3 Continuous Improvement

**Quarterly Reviews**:
- Analyze usage data (which stadiums most popular?)
- Review user feedback (common complaints?)
- Prioritize next batch of stadiums for row-level data
- Update World Cup match schedule (as details announced)

**Data Refinement**:
- Field verification program (attend games, verify data)
- User feedback integration ("Report inaccurate data" button)
- Seasonal adjustments (retractable roof schedules)

---

## 14. Timeline & Milestones

### 14.1 Proposed Rollout Phases

**Phase 0: Planning & Setup** (1 week)
- ✅ PRD creation (this document)
- ⏳ Technical specification
- ⏳ Implementation plan
- ⏳ Stakeholder approval

**Phase 1: MVP Development** (3 weeks)
- **Week 1-2**:
  - Enhance sun calculator for row-level calculations
  - Create row data generation scripts
  - Populate 5 MLB stadiums with row data
  - Build row breakdown UI component
- **Week 3**:
  - Add 5 World Cup venues (prioritize existing NFL stadiums)
  - Create World Cup landing page
  - Implement basic multi-language (EN + ES)
  - QA testing + bug fixes

**Phase 2: World Cup Expansion** (2 weeks)
- Add remaining 11 World Cup venues
- Import World Cup match schedule
- Enhanced World Cup UI features
- French translation

**Phase 3: MLB Completion** (4 weeks)
- Populate remaining 25 MLB stadiums with row data
- Field verification for top 10 MLB stadiums
- Data refinement based on testing

**Phase 4: NFL Rollout** (6 weeks)
- Populate 32 NFL stadiums with row-level data
- Adapt soccer configurations (dual-use stadiums)
- Performance optimization for large datasets

**Phase 5: MiLB Completion** (8 weeks)
- Populate 100 MiLB stadiums with row data
- Automated validation and data quality checks
- Final polish and optimization

### 14.2 Critical Path

**Critical Dependencies**:
1. PRD approval → Tech spec (blocks development)
2. Sun calculator enhancement → Row data population (blocks UI work)
3. Row data generation script → Stadium data entry (blocks testing)
4. World Cup venue data → World Cup UI (blocks World Cup launch)

**Parallel Tracks**:
- Track A: Row-level calculation algorithm (no dependencies)
- Track B: World Cup infrastructure (no dependencies)
- Track C: UI/UX enhancements (depends on Track A for data shape)

**Target Launch Date**:
- **MVP (Phase 1)**: 3 weeks from approval
- **World Cup Complete (Phase 2)**: 5 weeks from approval
- **Full Platform (Phase 5)**: 20 weeks from approval

---

## 15. Open Questions & Decisions Needed

### 15.1 Questions for Stakeholder

**Q1: Phased Rollout vs All-At-Once?**
- **Option A**: Launch MVP with 10 stadiums, expand over time
- **Option B**: Complete all 160+ stadiums before launch
- **Recommendation**: Option A (MVP approach)
  - **Why**: Faster time-to-market, user feedback informs later work
  - **Risk**: Incomplete coverage initially
- **Decision Needed**: ✅ Approve Option A or B?

**Q2: World Cup Priority Level?**
- **Option A**: High priority (complete Phase 2 by Q1 2025)
- **Option B**: Medium priority (can defer to Q2 2025)
- **Recommendation**: Option A (high priority)
  - **Why**: World Cup ticketing starts Q1 2025, must be ready
  - **Risk**: If World Cup interest lower than expected, wasted effort
- **Decision Needed**: ✅ Confirm World Cup timeline?

**Q3: Data Accuracy Standard?**
- **Option A**: Template-based generation (80% automated, baseline accuracy)
- **Option B**: Manual verification for every stadium (slower, more accurate)
- **Recommendation**: Option A with selective verification
  - **Why**: Infeasible to manually verify 212,000 rows
  - **Mitigation**: Verify top 10-20 high-traffic stadiums
- **Decision Needed**: ✅ Acceptable accuracy standard?

**Q4: Multi-Language Scope?**
- **Option A**: English + Spanish only (MVP)
- **Option B**: English + Spanish + French (full World Cup support)
- **Recommendation**: Option A for MVP, add French in Phase 2
  - **Why**: Spanish covers 95% of non-English World Cup visitors
  - **French Nice-to-Have**: Canada, some international visitors
- **Decision Needed**: ✅ Language requirements?

**Q5: 3D Visualization Investment?**
- **Option A**: Build 3D stadium viewer with shade overlay
- **Option B**: Defer 3D to future (focus on 2D tables/lists)
- **Recommendation**: Option B (defer)
  - **Why**: 3D is complex, may not justify development time
  - **Types Already Exist**: Can revisit later if needed
- **Decision Needed**: ✅ Defer 3D visualization?

### 15.2 Technical Clarifications

**Clarification 1: Row Naming Conventions**
- **Question**: How to handle inconsistent row naming (A, 1, AA, Terrace A)?
- **Proposal**: Store as string, display as-is, sort alphabetically
- **Validation**: Check row numbers match stadium docs

**Clarification 2: Dual-Use Stadiums (NFL + World Cup)**
- **Question**: How to handle same stadium with different configurations?
- **Proposal**: Duplicate venue entries with `*-wc` suffix
  - `metlife-stadium` (NFL) vs `metlife-stadium-wc` (World Cup)
  - Maintain section ID mapping in World Cup version
- **Alternative**: Single venue with `configuation: 'nfl' | 'soccer'` toggle

**Clarification 3: Performance Budget**
- **Question**: What's the max acceptable data size per stadium?
- **Proposal**: 50KB per stadium (uncompressed), 10-15KB gzipped
- **Calculation**: 80 sections × 30 rows × 50 bytes/row = ~120KB (too large)
- **Mitigation**: Lazy load row data, not included in initial bundle

### 15.3 Design Decisions

**Design Decision 1: Row Display Format**
- **Option A**: Table format (Row | Seats | Shade %)
- **Option B**: Card list (each row is a card)
- **Option C**: Visual gradient bar only (no row-by-row detail)
- **Recommendation**: Option A (table) + Option C (gradient) combined
- **Decision Needed**: ✅ Mockup approval?

**Design Decision 2: World Cup Branding**
- **Question**: Use FIFA branding/logos or generic "World Cup"?
- **Risk**: Trademark concerns with FIFA logos
- **Recommendation**: Generic "2026 World Cup" text, no official logos
- **Decision Needed**: ✅ Legal clearance for branding?

**Design Decision 3: Mobile Row Display**
- **Question**: Show all rows or paginate/collapse?
- **Recommendation**: Accordion with "Show all X rows" button
- **Why**: Balance between completeness and performance
- **Decision Needed**: ✅ Acceptable UX pattern?

---

## 16. Assumptions

**Assumption 1: Data Sources Available**
- We can obtain row counts and covered row information from stadium websites or seating charts
- If data unavailable, we'll use geometric templates (acknowledged as baseline accuracy)

**Assumption 2: Browser Compatibility**
- Target modern browsers only (last 2 versions)
- No IE11 support required
- Users have JavaScript enabled

**Assumption 3: Static Site Approach**
- Current static file + Vercel deployment is sufficient
- No need for database or real-time updates
- Build time increases (to ~3 minutes) are acceptable

**Assumption 4: World Cup Match Schedule**
- FIFA will publish full match schedule by Q1 2025
- Schedule includes dates, times, venues (not just TBD)
- Can update schedule post-launch as details emerge

**Assumption 5: User Behavior**
- Users understand row-level concept (Row A vs Row Z)
- Users care about row-specific shade (not just section-level)
- Mobile users will primarily use filters, desktop users will explore all rows

**Assumption 6: Performance Acceptable**
- Lighthouse score drop from 95 to 90 is acceptable trade-off for features
- 2-second page load time is acceptable for mobile
- Users will wait 100-200ms for calculation results

---

## 17. Appendices

### Appendix A: Glossary

- **Section**: Grouping of seats (e.g., "Section 114")
- **Row**: Horizontal line of seats within a section (e.g., "Row A")
- **Shade Percentage**: 0% = full sun, 100% = full shade
- **Sun Exposure**: Inverse of shade (100% - shade percentage)
- **Overhang**: Roof structure extending over back rows
- **Rake**: Angle of seating (steepness)
- **Elevation**: Height above field level
- **Depth**: Distance from front of section
- **Base Angle**: Compass angle from home plate (0° = behind home, 90° = first base, etc.)
- **Angle Span**: How many degrees a section spans (e.g., 15° wide section)
- **Dual-Use Stadium**: Stadium hosting multiple sports (e.g., NFL + World Cup)

### Appendix B: Competitive Analysis

**Competitor**: SeatGeek, StubHub, Ticketmaster
- **Strengths**: Large ticket inventory, established brands
- **Weaknesses**: No shade information, no row-level detail
- **Differentiation**: TheStadium.com is ONLY shade-focused tool

**Competitor**: ShadedSeats.com (if exists)
- **Strengths**: Similar concept
- **Weaknesses**: (Research needed)
- **Differentiation**: Row-level precision, World Cup coverage

**Competitor**: General stadium seating chart sites
- **Strengths**: Visual seat maps
- **Weaknesses**: No sun calculation, static images
- **Differentiation**: Dynamic sun calculations based on date/time

**Key Insight**: No competitor offers row-level shade precision. This is a unique market position.

### Appendix C: Reference Data

**Example: Yankee Stadium Section 114B**
- **Level**: Field (lower level)
- **Rows**: A-Z (26 rows)
- **Seats per Row**: 18-20
- **Covered**: Rows M-Z under upper deck overhang
- **Base Angle**: 350° (behind home plate, first base side)
- **Angle Span**: 10°
- **Price**: Moderate

**Example: MetLife Stadium (World Cup Configuration)**
- **NFL Name**: MetLife Stadium
- **World Cup Name**: New York New Jersey Stadium
- **Capacity**: 82,500 (NFL) → 87,157 (World Cup)
- **Field Orientation**: 90° (east-west for NFL, rotated for soccer?)
- **Section Mapping**: Section 101 (NFL) → South Stand 101 (World Cup)

---

## 18. Approval & Sign-Off

**Document Status**: ✅ Draft Complete - Awaiting Review

**Approval Required From**:
- [ ] Product Owner / Project Lead
- [ ] Technical Lead / Architect
- [ ] UX/UI Designer (mockup approval)
- [ ] QA Lead (testing plan approval)

**Next Steps**:
1. Review this PRD with stakeholders
2. Answer open questions (Section 15)
3. Approve phased rollout plan (Section 14)
4. Proceed to Technical Specification (next artifact)

**Change Log**:
- **v1.0 (2025-01-22)**: Initial draft created

---

## 19. Summary & Recommendations

### Key Findings

1. **Current State**: Section-level sun calculations are functional but lack precision. Row-level data types exist but are unused.

2. **Opportunity**: World Cup 2026 is a major untapped market with 16 venues (11 already in database).

3. **Feasibility**: Row-level calculations are technically feasible. Data entry is the primary challenge (212,000 rows).

4. **User Value**: Row-level precision directly addresses user pain points (avoid sun in back rows, find budget-friendly shaded rows).

5. **Performance**: With optimizations (lazy loading, caching, Web Workers), row-level data should not degrade UX.

### Recommended Approach

**Prioritization**:
1. **Phase 1 (MVP)**: 5 MLB + 5 World Cup stadiums with row-level data
2. **Phase 2**: Complete World Cup (16 venues) + multi-language
3. **Phase 3**: Complete MLB (30 venues)
4. **Phase 4**: Complete NFL (32 venues)
5. **Phase 5**: Complete MiLB (100 venues)

**Why This Approach**:
- ✅ Fast time-to-value (MVP in 3 weeks)
- ✅ Risk mitigation (test accuracy with small batch first)
- ✅ World Cup deadline met (Phase 2 by Q1 2025)
- ✅ User feedback informs later work (iterate on UI based on Phase 1 learnings)

**Critical Success Factors**:
- 🎯 Automated row data generation (infeasible to do manually)
- 🎯 Performance optimization (don't slow down existing site)
- 🎯 Incremental rollout (don't wait for perfection)
- 🎯 Field verification for accuracy (at least top 10 stadiums)

### Conclusion

This project transforms TheStadium.com from a good tool to the definitive standard for shade information. Row-level precision addresses real user pain points, and World Cup support positions the platform for major growth during a historic sporting event.

**Recommended Decision**: ✅ Approve PRD and proceed to Technical Specification.

---

**End of Product Requirements Document**

---

**Metadata**:
- **Document**: PRD - 2026 Row-Level & World Cup Features
- **Version**: 1.0
- **Author**: Claude (AI Assistant)
- **Date**: January 22, 2025
- **Word Count**: ~9,800 words
- **Page Count**: ~45 pages (estimated)
