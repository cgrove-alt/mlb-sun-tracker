# Technical Specification
## 2026 Row-Level Sun Calculations & World Cup Feature Expansion

**Project**: TheStadium.com Enhancement
**Version**: 1.0
**Date**: January 22, 2026
**Status**: Draft - Awaiting Approval
**Target Launch**: April 1, 2026 (69 days)

---

## EXECUTIVE SUMMARY

### Technical Context
- **Framework**: Next.js 15.5.7 (App Router), React 18.2.0, TypeScript 5.0
- **Current State**: 240,000 row records exist but unused; sun calculator is section-level only
- **Primary Challenge**: Extend existing sun calculation engine to process row-level data without performance degradation
- **World Cup Deadline**: 139 days to first match; must launch by April 1 (69 days) to capture ticketing window

### Implementation Approach
This specification details how to:
1. Extend `SunCalculator` class for row-level processing (minimal architectural change)
2. Build 4 new UI components for row display and filtering
3. Create World Cup data structures reusing existing stadium patterns
4. Implement i18n using `next-intl` (framework standard)
5. Optimize performance with Web Workers and caching

**Key Principle**: Leverage existing infrastructure; avoid massive refactoring; prioritize simplicity.

---

## 1. TECHNICAL CONTEXT

### 1.1 Current Architecture

**Tech Stack**:
- **Framework**: Next.js 15.5.7 with App Router
- **Language**: TypeScript 5.0 (strict mode)
- **Styling**: Tailwind CSS 3.4.17
- **State**: React Hooks + Context API (no Redux)
- **Deployment**: Vercel (standalone output)
- **Dependencies**:
  - `suncalc@1.9.0` - Sun position calculations
  - `three@0.178.0` - 3D types only (no renderer)
  - `next-pwa@5.6.0` - Progressive Web App

**Project Structure**:
```
/app                    → Pages & API routes
  /api/stadium/[id]/    → Shade calculation endpoints
  /stadium/[id]/        → Dynamic stadium pages
  /world-cup-2026/      → PLACEHOLDER (not implemented)

/src
  /components           → 91 React components
  /data                 → 213 stadium files
    /sections/{sport}/  → Detailed section data
  /utils
    /sunCalculator.ts   → 477 lines (section-level only)
  /types
    /stadium-complete.ts → Comprehensive interfaces
  /workers              → Web Workers (infrastructure exists)

/public
  /locales/             → i18n files (scaffolding only)
```

### 1.2 Existing Data Models

**Stadium Data** (`/src/data/stadiums.ts`):
```typescript
interface Stadium {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  orientation: number;     // Home plate → center field bearing
  timezone: string;        // IANA format
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
}
```

**Section Data** (`/src/types/stadium-complete.ts`):
```typescript
interface DetailedSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  baseAngle: number;      // 0-360°
  angleSpan: number;
  rows: RowDetail[];      // ← EXISTS but UNUSED in calculations
  covered: boolean;
  price?: 'value' | 'moderate' | 'premium' | 'luxury';
  distance: number;       // Feet from home plate
  height: number;
  rake: number;          // Seating angle
  vertices3D: Vector3D[];
}

interface RowDetail {
  rowNumber: string;
  seats: number;
  elevation: number;      // Feet above field
  depth: number;          // Feet from section front
  covered: boolean;       // Per-row coverage flag
  overhangHeight?: number;
}
```

**Current Coverage**:
- 213 stadium files
- 240,000+ row records (MLB 61%, NFL 100%, MiLB 99%)
- All data in TypeScript source files (no database)

### 1.3 Existing Patterns

**Component Patterns**:
- Lazy loading with dynamic imports
- Virtual scrolling for large lists (`react-window`)
- Mobile-first responsive design
- Accessibility: WCAG AA compliant components

**API Patterns**:
```typescript
// Current endpoint structure
GET /api/stadium/[stadiumId]/shade?month=6&hour=13&section=114B
Response: { sections: ShadowData[] }

// Caching: 1 hour server, 24 hours SWR
```

**State Management**:
- Custom hooks: `useSunCalculations()`, `useLocalStorage()`
- Context API for global state
- No Redux/Zustand

---

## 2. IMPLEMENTATION APPROACH

### 2.1 Architecture Decisions

**Decision 1: Extend Existing SunCalculator (No Rewrite)**
- **Approach**: Add new methods to existing `SunCalculator` class
- **Rationale**:
  - Preserve existing section-level calculations (backwards compatible)
  - Reuse sun position logic
  - Minimize risk of breaking existing functionality
- **Files Modified**: `/src/utils/sunCalculator.ts` (extend from 477 lines to ~750 lines)

**Decision 2: Keep Static File Storage (No Database)**
- **Approach**: Continue using TypeScript files for all data
- **Rationale**:
  - No hosting costs
  - Version control for data
  - Fast CDN delivery (pre-compiled)
  - Simple deployment
- **Trade-off**: No real-time updates (requires redeploy)

**Decision 3: Web Worker for Row Calculations**
- **Approach**: Move row calculations to Web Worker thread
- **Rationale**:
  - 240,000 rows × calculations = significant CPU time
  - Don't block main thread (keep UI responsive)
  - Infrastructure already exists (`/src/workers/`)
- **Implementation**: `/src/workers/sunCalculationWorker.ts` (new file)

**Decision 4: Duplicate NFL Stadiums for World Cup**
- **Approach**: Create separate `-wc` files for 11 dual-use stadiums
- **Example**: `metlife-stadium.ts` → `metlife-stadium-wc.ts`
- **Rationale**:
  - Clean separation of NFL vs soccer configurations
  - Different field orientations, section mappings
  - Easier to maintain than conditional logic
- **Trade-off**: 11 stadiums × 2 = data duplication (~270KB extra)

**Decision 5: Use next-intl for i18n**
- **Approach**: Install `next-intl` package (Next.js recommended)
- **Languages**: English (EN), Spanish (ES), French (FR)
- **Rationale**:
  - Standard Next.js integration
  - App Router support
  - Built-in server-side rendering
- **Scope**: Core UI 100%, stadium guides 50%

### 2.2 Data Flow Changes

**Current Flow (Section-Level)**:
```
User selects stadium + date/time
    ↓
Component calls useSunCalculations()
    ↓
SunCalculator.calculateSectionShadow() for each section
    ↓
Returns: ShadowData[] (80 sections)
    ↓
UI renders section cards with single shade %
```

**New Flow (Row-Level)**:
```
User selects stadium + date/time
    ↓
Component calls useSunCalculations({ includeRows: true })
    ↓
Web Worker: SunCalculator.calculateRowShadows() for each section
    ↓
Returns: SectionShadowData[] (80 sections × 30 rows = 2,400 rows)
    ↓
UI renders section cards with row summary
    ↓
User expands section
    ↓
RowBreakdownView displays per-row table
```

---

## 3. SOURCE CODE STRUCTURE CHANGES

### 3.1 New Files to Create

**Calculation Engine**:
```
/src/utils/
  rowShadowCalculator.ts         (NEW - 300 lines)
    ├─ calculateRowShadow()
    ├─ calculateOverhangShadow()
    └─ calculateUpperDeckShadowForRow()

/src/workers/
  sunCalculationWorker.ts        (NEW - 150 lines)
    └─ Worker thread for batch row calculations
```

**UI Components**:
```
/src/components/
  RowBreakdownView.tsx           (NEW - 250 lines)
    └─ Table/list of rows with shade percentages
  RowFilterBar.tsx               (NEW - 120 lines)
    └─ Filter by row shade level
  RowShadeGradient.tsx           (NEW - 80 lines)
    └─ Visual gradient showing row-by-row shade
  RowComparisonTool.tsx          (FUTURE - defer to Phase 2)
```

**World Cup Data**:
```
/src/data/worldcup2026/
  venues.ts                      (NEW - 500 lines)
    └─ 16 World Cup venue definitions
  matches.ts                     (NEW - 1,200 lines)
    └─ 104 match schedule entries
  sectionMappings.ts             (NEW - 200 lines)
    └─ NFL → Soccer section ID mappings

/src/data/sections/soccer/
  estadio-azteca-wc.ts           (NEW - 5 files × 800 lines)
  estadio-akron-wc.ts
  estadio-bbva-wc.ts
  bc-place-wc.ts
  bmo-field-wc.ts
  metlife-stadium-wc.ts          (NEW - 11 duplicates × 1,000 lines)
  sofi-stadium-wc.ts
  [... 9 more duplicates]
```

**World Cup Pages**:
```
/app/world-cup-2026/
  page.tsx                       (NEW - 300 lines)
    └─ Landing page with venue list
  layout.tsx                     (NEW - 50 lines)
  /venue/[id]/page.tsx           (NEW - 200 lines)
    └─ Individual venue pages
  /schedule/page.tsx             (NEW - 350 lines)
    └─ Match schedule with shade
```

**i18n Files**:
```
/messages/
  en.json                        (EXPAND - 500 lines)
  es.json                        (NEW - 500 lines)
  fr.json                        (NEW - 500 lines)

/src/components/
  LanguageSelector.tsx           (NEW - 80 lines)
```

**API Endpoints**:
```
/app/api/stadium/[id]/rows/
  shade/route.ts                 (NEW - 180 lines)
    └─ Row-level shade calculations
```

### 3.2 Files to Modify

**Extend Existing Calculator**:
```
/src/utils/sunCalculator.ts
  Current: 477 lines (section-level only)
  New: ~750 lines
  Changes:
    + calculateRowShadows(section: DetailedSection): SectionShadowData
    + calculateAllStadiumRows(stadium, date, time): StadiumRowData
    + Enable row-level mode flag
```

**Enhance Section Cards**:
```
/src/components/LazySectionCardModern.tsx
  Current: Section average display
  Changes:
    + Display row summary: "Rows A-M: 80-95% shade"
    + "View Row Details" button
    + Expand inline RowBreakdownView component
```

**Update Filters**:
```
/src/components/EnhancedSunFilter.tsx
  Changes:
    + Add "Has rows with >80% shade" checkbox
    + Add "Minimum rows meeting criteria" input
    + Filter logic for row-level data
```

**Update Hooks**:
```
/src/hooks/useSunCalculations.ts
  Changes:
    + Add includeRows: boolean parameter
    + Call Web Worker for row calculations
    + Handle RowShadowData[] responses
```

### 3.3 Estimated Code Volume

**New Code**:
- Calculation engine: ~450 lines
- UI components: ~530 lines
- World Cup data: ~15,000 lines (mostly structured data)
- World Cup pages: ~900 lines
- i18n files: ~1,500 lines
- API endpoints: ~180 lines
- **Total New**: ~19,000 lines

**Modified Code**:
- SunCalculator: ~273 lines added
- Components: ~150 lines modified
- Hooks: ~50 lines modified
- **Total Modified**: ~473 lines

**Grand Total**: ~19,500 lines (mostly data, not complex logic)

---

## 4. DATA MODEL / API / INTERFACE CHANGES

### 4.1 New TypeScript Interfaces

**Row Shadow Data**:
```typescript
// /src/types/shadow.ts (extend existing file)

interface RowShadowData {
  rowNumber: string;
  seats: number;
  elevation: number;
  depth: number;
  coverage: number;          // 0-100%
  sunExposure: number;       // 0-100%
  inShadow: boolean;
  shadowSources: {
    roof: number;
    upperDeck: number;
    overhang: number;        // NEW
    bowl: number;
  };
  recommendation?: 'excellent' | 'good' | 'fair' | 'poor';
}

interface SectionShadowData {
  sectionId: string;
  sectionName: string;
  rows: RowShadowData[];
  averageCoverage: number;   // For sorting/filtering
  bestRows: string[];        // Top 5 rows by shade
  worstRows: string[];       // Top 5 rows by sun
}

interface StadiumRowData {
  stadiumId: string;
  date: string;
  time: string;
  sunPosition: SunPosition;
  sections: SectionShadowData[];
  totalRows: number;
  calculationTime: number;   // Milliseconds
}
```

**World Cup Interfaces**:
```typescript
// /src/types/worldcup.ts (NEW FILE)

interface WorldCupVenue {
  id: string;                      // "metlife-stadium-wc"
  fifaName: string;                // "New York New Jersey Stadium"
  commonName: string;              // "MetLife Stadium"
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';
  latitude: number;
  longitude: number;
  timezone: string;                // IANA format
  capacity: number;
  soccerCapacity: number;          // Different from NFL

  // Link to NFL stadium if dual-use
  nflStadiumId?: string;           // "metlife-stadium"
  sectionMapping?: SectionMapping;

  // Soccer-specific
  fieldOrientation: number;        // Degrees from north
  fieldDimensions: {
    length: number;                // 105-110 meters
    width: number;                 // 68-75 meters
  };

  // Row-level data (same structure as NFL)
  sections: DetailedSection[];
}

interface SectionMapping {
  [nflSectionId: string]: string;  // NFL ID → Soccer name
  // Example: "114B" → "114"
}

interface WorldCupMatch {
  matchId: string;               // "wc2026-001"
  date: string;                  // "2026-06-11" (ISO 8601)
  kickoffTime: string;           // "17:00" (local time)
  venueId: string;               // Links to WorldCupVenue.id
  round: 'Group Stage' | 'Round of 16' | 'Quarterfinal' | 'Semifinal' | 'Third Place' | 'Final';
  group?: string;                // "Group A" (if group stage)
  teamA: string;                 // "Mexico" or "TBD"
  teamB: string;                 // "USA" or "TBD"
  tvChannels?: string[];
  preCalculatedShade?: {         // Cache for common matches
    kickoff: StadiumRowData;
    halftime: StadiumRowData;
    fullTime: StadiumRowData;
  };
}
```

**Filter Extensions**:
```typescript
// /src/types/filters.ts (extend existing)

interface FilterOptions {
  // Existing
  shadeLevel: 'excellent' | 'good' | 'partial' | 'sun';
  priceRange: string[];
  levels: string[];

  // NEW - Row-level filters
  hasRowsWithShade: boolean;     // "Has rows with >80% shade"
  hasRowsWithSun: boolean;       // "Has rows with <20% shade"
  minShadeRows: number;          // "At least X rows meet criteria"
  rowShadeThreshold: number;     // 0-100 (default: 80)
}
```

### 4.2 New API Endpoints

**Row-Level Shade Endpoint**:
```typescript
// /app/api/stadium/[id]/rows/shade/route.ts

GET /api/stadium/yankees/rows/shade?date=2026-06-15&time=14:00

Request Query Params:
  - date: string (ISO 8601: "YYYY-MM-DD")
  - time: string (24-hour: "HH:MM")
  - sections?: string (comma-separated: "114B,115,116")

Response:
{
  "stadium": "yankees",
  "date": "2026-06-15",
  "time": "14:00",
  "sunPosition": {
    "altitude": 62.5,
    "azimuth": 195.3,
    "elevation": "high"
  },
  "sections": [
    {
      "sectionId": "114B",
      "sectionName": "Section 114B",
      "averageCoverage": 65,
      "rows": [
        {
          "rowNumber": "A",
          "seats": 18,
          "elevation": 8.0,
          "depth": 0,
          "sunExposure": 5,
          "coverage": 95,
          "inShadow": true,
          "shadowSources": {
            "roof": 0,
            "upperDeck": 70,
            "overhang": 25,
            "bowl": 0
          },
          "recommendation": "excellent"
        },
        // ... rows B-Z
      ],
      "bestRows": ["A", "B", "C", "D", "E"],
      "worstRows": ["V", "W", "X", "Y", "Z"]
    }
    // ... more sections
  ],
  "totalRows": 2460,
  "calculationTime": 87  // milliseconds
}

Caching:
  - Server: 3600s (1 hour)
  - SWR: 86400s (24 hours)
  - Cache key: `${stadiumId}:${date}:${time}`
```

**World Cup Venues Endpoint**:
```typescript
// /app/api/worldcup/venues/route.ts

GET /api/worldcup/venues?country=USA

Response:
{
  "venues": [
    {
      "id": "metlife-stadium-wc",
      "fifaName": "New York New Jersey Stadium",
      "commonName": "MetLife Stadium",
      "city": "East Rutherford",
      "country": "USA",
      "capacity": 82500,
      "soccerCapacity": 82500,
      "matchCount": 7,
      "nextMatch": {
        "matchId": "wc2026-015",
        "date": "2026-06-21",
        "teams": "TBD vs TBD"
      }
    }
    // ... 15 more venues
  ]
}
```

**World Cup Matches Endpoint**:
```typescript
// /app/api/worldcup/matches/route.ts

GET /api/worldcup/matches?venue=metlife-stadium-wc&date=2026-06-21

Response:
{
  "matches": [
    {
      "matchId": "wc2026-015",
      "date": "2026-06-21",
      "kickoffTime": "15:00",
      "venue": "metlife-stadium-wc",
      "round": "Group Stage",
      "group": "Group C",
      "teamA": "TBD",
      "teamB": "TBD",
      "shadeAtKickoff": {
        "sunAltitude": 65,
        "topShadedSections": ["114", "115", "116"],
        "topSunnySections": ["228", "229", "230"]
      }
    }
  ]
}
```

### 4.3 Database Schema

**N/A - Static Files Only**

All data stored in TypeScript source files:
- Venues: `/src/data/worldcup2026/venues.ts`
- Matches: `/src/data/worldcup2026/matches.ts`
- Sections: `/src/data/sections/soccer/*.ts`

---

## 5. DELIVERY PHASES

### Phase 0: Foundation (Week 1-2) - 14 days
**Goal**: Row-level calculation engine operational

**Tasks**:
1. Create `/src/utils/rowShadowCalculator.ts`
   - `calculateRowShadow()` function
   - `calculateOverhangShadow()` function
   - `calculateUpperDeckShadowForRow()` function
2. Extend `/src/utils/sunCalculator.ts`
   - Add `calculateRowShadows(section)` method
   - Add `calculateAllStadiumRows(stadium, date, time)` method
3. Create Web Worker `/src/workers/sunCalculationWorker.ts`
   - Batch processing for 2,000+ rows
   - Post message API for results
4. Create API endpoint `/app/api/stadium/[id]/rows/shade/route.ts`
5. Unit tests for all calculation functions

**Verification**:
- Benchmark: Calculate 2,460 rows (Yankee Stadium) in <100ms
- Test: Overhang shadow calculation accuracy (±5%)
- Test: Row results differ from section average

**Deliverables**:
- Row calculation engine complete
- API endpoint functional
- Performance validated

---

### Phase 1: Row-Level UI (Week 2-3) - 7 days
**Goal**: Users can view row-by-row shade breakdowns

**Tasks**:
1. Create `/src/components/RowBreakdownView.tsx`
   - Table layout: Row | Seats | Elevation | Shade % | Recommendation
   - Mobile: Collapsible list view
   - Sort by row number or shade %
   - Virtual scrolling for 50+ row sections
2. Update `/src/components/LazySectionCardModern.tsx`
   - Add row summary: "Rows A-M: 80-95% shade"
   - "View Row Details" button
   - Expand inline RowBreakdownView
3. Create `/src/components/RowFilterBar.tsx`
   - Checkbox: "Has rows with >80% shade"
   - Input: "At least X rows"
   - Threshold slider: 60-100%
4. Update `/src/components/EnhancedSunFilter.tsx`
   - Integrate RowFilterBar
   - Filter sections by row criteria
5. Update `/src/hooks/useSunCalculations.ts`
   - Add `includeRows: boolean` parameter
   - Call Web Worker for row calculations
6. Mobile optimization testing (iOS Safari, Chrome)
7. Accessibility audit (keyboard navigation, screen readers)

**Verification**:
- Visual test: Row breakdown displays for all sections
- Functional test: Filters work correctly
- Performance test: No UI blocking during calculations
- Mobile test: Touch interactions smooth
- A11y test: WCAG AA compliance

**Deliverables**:
- RowBreakdownView component
- Row filtering functional
- Mobile-optimized

---

### Phase 2: World Cup - Existing Stadiums (Week 3-4) - 7 days
**Goal**: 11 NFL stadiums ready as World Cup venues

**Tasks**:
1. Duplicate 11 NFL stadium files to `-wc.ts` versions
   - MetLife, SoFi, AT&T, Mercedes-Benz, Arrowhead
   - Hard Rock, Lincoln Financial, Levi's, Gillette
   - NRG, Lumen Field
2. Update stadium metadata:
   - `fieldOrientation`: Soccer field bearing
   - `fieldDimensions`: { length: 105, width: 68 } (meters)
   - `soccerCapacity`: Adjust if different from NFL
3. Create section mappings (NFL ID → Soccer name)
   - `/src/data/worldcup2026/sectionMappings.ts`
   - Example: "114B" → "114" (remove subsection letters)
4. Verify row data completeness
   - Check all 11 stadiums have `generateRows()` populated
   - Validate elevation, depth, covered fields
5. Test calculations with soccer field orientation
   - Ensure sun angles calculate correctly

**Verification**:
- Test: All 11 stadiums load with `-wc` ID
- Test: Section mappings work (NFL names → Soccer names)
- Test: Row calculations accurate for soccer orientation
- Visual: Stadium pages render correctly

**Deliverables**:
- 11 World Cup venue files (duplicates)
- Section mappings complete
- Calculations validated

---

### Phase 3: World Cup - New Stadiums (Week 4-6) - 14 days
**Goal**: 5 new stadiums (Mexico, Canada) with row-level data

**Tasks**:
1. Gather stadium data:
   - Estadio Azteca (Mexico City, Mexico)
   - Estadio Akron (Guadalajara, Mexico)
   - Estadio BBVA (Monterrey, Mexico)
   - BC Place (Vancouver, Canada)
   - BMO Field (Toronto, Canada)

   **Data Sources**:
   - Official stadium websites
   - SeatGeek, StubHub seating charts
   - FIFA World Cup venue guides
   - Google Maps satellite imagery
   - Stadium architectural diagrams

2. Create stadium files (5 files × 800 lines each):
   - Basic stadium metadata (GPS, capacity, timezone)
   - Section definitions (30-80 sections per stadium)
   - Row data using `generateRows()` templates
   - Cover status, elevation, depth estimates

3. Field verification (if possible):
   - Attend matches or stadium tours
   - Measure actual shade with light meter
   - Compare to calculated values
   - **Budget**: $500-1,000 per stadium (optional)

4. Template-based data entry (if verification not possible):
   - Use geometric templates (similar to MiLB approach)
   - Mark as "estimated" vs "verified"
   - Iterative refinement post-launch

5. Test calculations for new stadiums

**Verification**:
- Test: All 5 stadiums load correctly
- Test: Row calculations produce reasonable results
- Visual: Seating charts match real-world layout (Google Images)
- Data quality: Spot-check 10% of sections

**Deliverables**:
- 5 new World Cup stadium files
- Row-level data populated (estimated or verified)
- Calculations functional

---

### Phase 4: World Cup UI & Schedule (Week 6-7) - 7 days
**Goal**: World Cup landing page and match schedule live

**Tasks**:
1. Create `/app/world-cup-2026/page.tsx`
   - Hero section: "2026 FIFA World Cup Shade Guide"
   - Venue list: 16 stadiums with filter by country
   - Upcoming matches widget
   - Language selector
   - SEO optimization (title, meta, OG image)

2. Create `/app/world-cup-2026/venue/[id]/page.tsx`
   - Individual venue pages
   - Link to full stadium guide
   - Match schedule for that venue
   - Row-level shade for upcoming matches

3. Create `/app/world-cup-2026/schedule/page.tsx`
   - Full 104-match schedule
   - Filter by date, country, round, team
   - Display kickoff time (local timezone)
   - Link to venue shade guide

4. Import match schedule data:
   - Manual entry of 104 matches
   - **Data Source**: FIFA official schedule
   - **Action**: Check FIFA website for published schedule
   - Fields: Date, time, venue, teams, round, group, TV channels

5. Pre-calculate shade for match kickoff times:
   - Run calculations for all 104 matches
   - Cache results in match data
   - Display: "Best shaded sections at kickoff: 114, 115, 116"

6. Create World Cup API endpoints:
   - `/api/worldcup/venues`
   - `/api/worldcup/matches`

**Verification**:
- Test: All 16 venues display correctly
- Test: 104 matches load with correct data
- Test: Filters work (country, date, round)
- SEO: Meta tags, structured data, sitemap
- Performance: Lighthouse ≥90

**Deliverables**:
- World Cup landing page
- Venue pages (16)
- Match schedule page
- Pre-calculated shade data

---

### Phase 5: Multi-Language (Week 7-8) - 7 days
**Goal**: English, Spanish, French support

**Tasks**:
1. Install `next-intl`:
   ```bash
   npm install next-intl
   ```

2. Create translation files:
   - `/messages/en.json` (expand existing)
   - `/messages/es.json` (new - Spanish)
   - `/messages/fr.json` (new - French)

3. Translation scope:
   - **100% Core UI**: Navigation, filters, buttons, errors, forms
   - **50% Stadium Guides**: Key paragraphs, section descriptions
   - **0% Blog Posts**: English only for V1
   - **Proper Nouns**: Keep as-is (stadium names, section IDs)

4. Translation method:
   - **Option A**: Professional translator ($2-3k for 1,500 words × 2 languages)
   - **Option B**: Machine translation (DeepL) + native speaker review ($500)
   - **Recommended**: Option B for V1, Option A for refinement

5. Create `/src/components/LanguageSelector.tsx`:
   - Dropdown: 🇺🇸 English | 🇪🇸 Español | 🇫🇷 Français
   - Persist choice in `localStorage`
   - Update Next.js locale

6. Configure `next-intl` middleware:
   - Detect browser language
   - Route: `/en/...`, `/es/...`, `/fr/...`
   - Default: English

7. Update all components:
   - Replace hardcoded strings with `t('key')`
   - Test language switching

**Verification**:
- Test: Language selector switches all UI labels
- Test: URL routing works (`/en/...`, `/es/...`, `/fr/...`)
- Test: Preference persists across sessions
- Quality: Native speaker review of translations
- A11y: Screen readers read translated content

**Deliverables**:
- Translation files (EN, ES, FR)
- Language selector component
- All UI strings translatable

---

### Phase 6: Testing & Optimization (Week 8-9) - 7 days
**Goal**: Performance optimized, bugs fixed, ready for launch

**Tasks**:
1. Performance optimization:
   - Profile row calculations (Chrome DevTools)
   - Optimize hot paths (e.g., reduce array allocations)
   - Implement caching (IndexedDB for calculation results)
   - Test Web Worker offloading

2. Visual regression testing:
   - Playwright visual tests
   - Compare screenshots before/after
   - Test: Section cards, row breakdown, filters

3. Accessibility audit:
   - Run `@axe-core/playwright`
   - Fix WCAG AA violations
   - Keyboard navigation testing
   - Screen reader testing (NVDA, VoiceOver)

4. Field verification (3-5 stadiums):
   - Attend games with light meter
   - Record actual shade at recorded times
   - Compare to calculated values
   - Adjust algorithm if error >10%
   - **Budget**: $1,500-3,000 total

5. Bug fixing:
   - Fix P0/P1 bugs (blockers, critical)
   - Defer P2/P3 to post-launch

6. Lighthouse audit:
   - Target: Performance ≥90, Accessibility ≥95
   - Optimize images (WebP, lazy loading)
   - Minimize JavaScript bundle

7. Load testing:
   - Simulate 1,000 concurrent users
   - Verify API response times <500ms
   - Test caching under load

**Verification**:
- Lighthouse: All scores ≥90
- Axe: Zero WCAG AA violations
- Performance: Page load <2s, calculations <100ms
- Bugs: Zero P0/P1 open issues

**Deliverables**:
- Performance optimized
- Accessibility compliant
- Bugs fixed
- Field verification data

---

### Phase 7: Launch Prep (Week 9-10) - 7 days
**Goal**: Marketing, SEO, soft launch

**Tasks**:
1. SEO optimization:
   - Meta tags: "2026 FIFA World Cup Stadium Shade Guide"
   - Keywords: "World Cup 2026 tickets shade", "FIFA stadium sun"
   - Structured data: Event schema for matches
   - Sitemap: Include all World Cup pages
   - Open Graph images: World Cup branded graphics

2. Create marketing content:
   - Landing page hero image (World Cup themed)
   - Social media graphics (Twitter, Facebook)
   - Blog post: "Find Shaded Seats at 2026 World Cup"
   - Press release draft

3. Analytics setup:
   - Track: Row breakdown expansion rate
   - Track: World Cup page views
   - Track: Language switcher usage
   - Track: Filter usage (row-level filters)

4. Soft launch:
   - Beta test with 50-100 users
   - Gather feedback
   - Fix critical issues

5. Monitor:
   - Google Analytics 4 dashboard
   - Error tracking (Sentry or similar)
   - Performance monitoring (Vercel Analytics)

6. Documentation:
   - Update README with new features
   - Create changelog
   - Write deployment guide

**Verification**:
- SEO: Google Search Console indexed pages
- Analytics: Events tracking correctly
- Soft launch: No critical bugs reported
- Monitoring: Dashboards operational

**Deliverables**:
- SEO optimized
- Marketing content ready
- Analytics configured
- Soft launch completed
- Ready for public launch

---

## 6. VERIFICATION APPROACH

### 6.1 Automated Testing

**Unit Tests** (Jest):
```typescript
// /src/utils/__tests__/rowShadowCalculator.test.ts

describe('calculateRowShadow', () => {
  it('should return 100% coverage for covered rows', () => {
    const row = { rowNumber: 'A', covered: true, ... };
    const result = calculateRowShadow(row, section, 45, 180);
    expect(result.coverage).toBe(100);
  });

  it('should calculate overhang shadow based on depth', () => {
    const row = { depth: 0, overhangHeight: 30, ... };
    const result = calculateOverhangShadow(row.depth, row.overhangHeight, 45);
    expect(result).toBeGreaterThan(80); // Front row should be shaded
  });

  it('should process 2,460 rows in <100ms', () => {
    const start = performance.now();
    const results = calculateAllStadiumRows(yankees, date, time);
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
    expect(results.totalRows).toBe(2460);
  });
});
```

**Integration Tests** (Playwright):
```typescript
// /tests/e2e/row-breakdown.spec.ts

test('row breakdown displays correctly', async ({ page }) => {
  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');

  // Find section card
  const section = page.locator('[data-section="114B"]');
  await expect(section).toBeVisible();

  // Click "View Row Details"
  await section.locator('button:has-text("View Row Details")').click();

  // Verify row table appears
  const rowTable = section.locator('[data-testid="row-breakdown"]');
  await expect(rowTable).toBeVisible();

  // Verify rows displayed
  const rows = rowTable.locator('tr[data-row]');
  await expect(rows).toHaveCount(26); // Rows A-Z

  // Verify shade percentages differ
  const rowA = rowTable.locator('tr[data-row="A"]');
  const rowZ = rowTable.locator('tr[data-row="Z"]');
  const shadeA = await rowA.locator('[data-shade]').textContent();
  const shadeZ = await rowZ.locator('[data-shade]').textContent();
  expect(parseInt(shadeA)).toBeGreaterThan(parseInt(shadeZ));
});
```

**Visual Tests** (Playwright):
```typescript
// /tests/visual/row-breakdown.spec.ts

test('row breakdown visual regression', async ({ page }) => {
  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');
  await page.locator('[data-section="114B"] button:has-text("View Row Details")').click();

  // Wait for animation
  await page.waitForTimeout(300);

  // Screenshot
  await expect(page.locator('[data-section="114B"]')).toHaveScreenshot('row-breakdown.png');
});
```

**Accessibility Tests** (Axe):
```typescript
// /tests/a11y/row-breakdown.spec.ts

test('row breakdown accessibility', async ({ page }) => {
  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');
  await page.locator('[data-section="114B"] button:has-text("View Row Details")').click();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### 6.2 Manual Testing

**Functional Test Cases**:
1. **Row Calculation Accuracy**:
   - Load Yankee Stadium, Section 114B
   - Date: June 15, 2026, Time: 2:00 PM
   - Verify: Row A has higher shade % than Row Z
   - Expected: Row A ≥80%, Row Z ≤30%

2. **Row Filtering**:
   - Enable "Has rows with >80% shade"
   - Set minimum: 5 rows
   - Verify: Only sections with 5+ rows >80% shade display

3. **World Cup Landing Page**:
   - Navigate to `/world-cup-2026`
   - Verify: 16 venues listed
   - Filter by "USA" → 11 venues
   - Filter by "Mexico" → 3 venues

4. **Language Switching**:
   - Switch to Spanish
   - Verify: Navigation, filters, buttons in Spanish
   - Refresh page → Language persists

5. **Mobile Responsiveness**:
   - Test on iPhone SE (375px width)
   - Verify: Row breakdown is collapsible
   - Verify: Touch targets ≥48px

### 6.3 Performance Benchmarks

**Targets**:
- Page load time: <2.0s (median, mobile 4G)
- Row calculations: <100ms for 2,460 rows
- API response: <500ms for row shade endpoint
- Lighthouse Performance: ≥90
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s

**Measurement**:
```typescript
// Performance monitoring
const start = performance.now();
const results = await calculateAllStadiumRows(stadium, date, time);
const end = performance.now();

console.log(`Calculated ${results.totalRows} rows in ${end - start}ms`);
// Target: <100ms
```

### 6.4 Field Verification Protocol

**Stadiums to Verify** (3-5):
1. Yankee Stadium (MLB)
2. MetLife Stadium (NFL/World Cup)
3. Estadio Azteca (World Cup - if possible)

**Verification Process**:
1. Attend game/tour
2. Bring: Light meter, GPS, compass, notepad
3. Record:
   - Date, time (local)
   - Section, row
   - Actual shade percentage (light meter reading)
   - Weather conditions
4. Compare to calculated values
5. Acceptable variance: ±10%
6. If error >10%: Adjust algorithm parameters

**Budget**: $500-1,000 per stadium (tickets, travel, equipment)

---

## 7. RISK MITIGATION

### 7.1 Technical Risks

**Risk 1: Row Calculation Performance Degradation**
- **Impact**: UI becomes unresponsive (>1s calculations)
- **Likelihood**: Medium
- **Mitigation**:
  - Implement Web Worker (offload from main thread)
  - Batch processing (calculate 100 rows at a time)
  - Cache results (IndexedDB, key: `${stadiumId}:${date}:${time}`)
  - Lazy load row calculations (only when section expanded)
  - Benchmark early (Phase 0) to validate performance

**Risk 2: Data Availability for New Stadiums**
- **Impact**: Can't complete 5 World Cup stadiums (Mexico, Canada)
- **Likelihood**: Medium
- **Mitigation**:
  - Start data gathering immediately (don't wait for Phase 3)
  - Use multiple sources (official sites, SeatGeek, StubHub, Google Maps)
  - Template-based estimation if exact data unavailable
  - Mark as "estimated" vs "verified" in UI
  - Iterative refinement post-launch

**Risk 3: World Cup Schedule Unavailable/Changes**
- **Impact**: Can't import match schedule or data becomes stale
- **Likelihood**: Low (FIFA usually publishes 6+ months before)
- **Mitigation**:
  - Check FIFA website NOW for published schedule
  - Build schedule as static TypeScript file (easy to update)
  - Add "Last updated" timestamp to UI
  - Monitor FIFA website for changes
  - Quick redeploy if schedule changes

### 7.2 Timeline Risks

**Risk 4: Development Delays**
- **Impact**: Miss April 1 target, lose World Cup ticketing window
- **Likelihood**: Medium
- **Mitigation**:
  - Start immediately (January 23, 2026)
  - Weekly progress reviews (every Friday)
  - Parallel tracks: Row-level + World Cup simultaneously
  - Buffer time: 10 weeks includes 2-week buffer
  - Scope reduction: Defer Phase 2 features if needed

**Risk 5: Field Verification Delays**
- **Impact**: Can't verify accuracy for all stadiums
- **Likelihood**: High (travel, schedules, budget)
- **Mitigation**:
  - Accept template-based data for V1
  - Mark verified vs unverified stadiums in UI
  - Iterative refinement post-launch
  - User feedback system: "Report inaccurate data"

### 7.3 Quality Risks

**Risk 6: Translation Quality Issues**
- **Impact**: Poor UX for Spanish/French users
- **Likelihood**: Medium (if using machine translation)
- **Mitigation**:
  - Use DeepL (best machine translation)
  - Native speaker review for core UI
  - Phased translation: Core UI first (100%), guides later (50%)
  - User feedback: "Report translation error" button

**Risk 7: Accessibility Violations**
- **Impact**: Legal compliance issues, poor UX for disabled users
- **Likelihood**: Low (existing components compliant)
- **Mitigation**:
  - Use existing component patterns (already WCAG AA)
  - Automated testing: `@axe-core/playwright`
  - Manual testing: Keyboard navigation, screen readers
  - Fix violations before launch (Phase 6)

---

## 8. DEPENDENCIES

### 8.1 External Dependencies

**Libraries to Install**:
```json
{
  "dependencies": {
    "next-intl": "^3.4.0"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.8.0"
  }
}
```

**Existing Dependencies (No Changes)**:
- `next@15.5.7`
- `react@18.2.0`
- `typescript@5.0`
- `suncalc@1.9.0`
- `three@0.178.0`
- `tailwindcss@3.4.17`

### 8.2 Data Dependencies

**Critical**: FIFA 2026 World Cup Schedule
- **Source**: FIFA official website
- **Action Required**: Check if schedule published (as of Jan 22, 2026)
- **Fallback**: Placeholder TBD entries, update when available
- **Format**: 104 matches (48-team format)

**Stadium Data Sources**:
- Official stadium websites
- SeatGeek, StubHub seating charts
- Google Maps satellite imagery
- Stadium architectural diagrams
- FIFA World Cup venue guides

### 8.3 Infrastructure Dependencies

**Deployment**:
- Vercel account (existing)
- GitHub repository (existing)
- Domain: `thestadium.com` (existing)

**Analytics**:
- Google Analytics 4 (existing)
- Optional: Sentry (error tracking)

**No New Infrastructure Required**

---

## 9. PERFORMANCE TARGETS

### 9.1 Page Load Performance

**Lighthouse Targets**:
- Performance: ≥90 (currently 95, maintain)
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥95

**Core Web Vitals**:
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- First Input Delay (FID): <100ms

**Bundle Size**:
- Main bundle: <250KB (gzipped)
- Per-page chunks: <100KB
- Total JS: <500KB (with code splitting)

### 9.2 Calculation Performance

**Row-Level Calculations**:
- Single row: <0.1ms
- Single section (30 rows): <3ms
- Full stadium (2,460 rows): <100ms
- Web Worker overhead: <10ms

**API Response Times**:
- `/api/stadium/[id]/rows/shade`: <500ms (uncached)
- `/api/stadium/[id]/rows/shade`: <50ms (cached)
- `/api/worldcup/venues`: <200ms
- `/api/worldcup/matches`: <300ms

### 9.3 Caching Strategy

**Browser Cache**:
- IndexedDB for calculation results
- Key: `${stadiumId}:${date}:${time}`
- TTL: 7 days (invalidate on new deployment)

**Server Cache**:
- Next.js ISR (Incremental Static Regeneration)
- Revalidate: 3600s (1 hour) for API routes
- Static pages: 86400s (24 hours)

**CDN Cache** (Vercel Edge):
- Static assets: 31536000s (1 year)
- API responses: 3600s (1 hour)
- HTML pages: 3600s (1 hour)

---

## 10. SCALABILITY CONSIDERATIONS

### 10.1 Data Volume

**Current State**:
- Stadiums: 213
- Sections: ~17,000 (80 sections × 213 stadiums)
- Rows: ~240,000

**With World Cup**:
- Stadiums: 229 (213 + 16 World Cup)
- Sections: ~18,500
- Rows: ~260,000
- Matches: 104

**Data Size**:
- TypeScript source files: ~15MB (uncompiled)
- Compiled JavaScript: ~3MB (with code splitting)
- Per-stadium load: ~15-30KB (lazy loaded)

**Build Time Impact**:
- Current: ~90 seconds
- Projected: ~120-180 seconds (with row data validation)
- Acceptable: <3 minutes
- Mitigation: Parallelize TypeScript compilation

### 10.2 Calculation Volume

**Typical Load**:
- User selects stadium → Calculate 80 sections × 30 rows = 2,400 rows
- Processing time: <100ms (Web Worker)
- Cache hit rate (projected): 70-80% (common dates/times)

**Peak Load** (World Cup traffic):
- 1,000 concurrent users
- Assume: 30% cache miss rate = 300 calculations/second
- Server capacity: Vercel serverless handles 1,000s of requests/sec
- Mitigation: Pre-calculate common match times (kickoff, halftime)

### 10.3 Future Expansion

**Phase 2 Features** (Post-Launch):
- MLS stadiums: +30 stadiums
- International soccer: +50 stadiums (EPL, La Liga, etc.)
- College football: +100 stadiums
- 3D visualization: Three.js renderer

**Scalability Plan**:
- Continue static file approach up to 500 stadiums
- Beyond 500: Consider database (Supabase, PlanetScale)
- Current architecture supports 500+ stadiums without major refactor

---

## 11. SECURITY CONSIDERATIONS

### 11.1 API Security

**Rate Limiting**:
```typescript
// /middleware.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}
```

**Input Validation**:
```typescript
// Validate date/time inputs
function validateDateInput(date: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}
```

**CORS Policy**:
- Allow: `thestadium.com`, `*.thestadium.com`
- Block: All other origins
- Exceptions: Public API endpoints (if future feature)

### 11.2 Data Privacy

**No PII Collection**:
- No user accounts (Phase 1)
- No email/phone collection
- No tracking beyond Google Analytics (anonymized IPs)

**GDPR Compliance**:
- Cookie consent banner (existing)
- Privacy policy (existing)
- Data retention: Analytics only (no user data)

### 11.3 Content Security

**Content Security Policy (CSP)**:
```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://www.google-analytics.com;
```

**XSS Prevention**:
- React auto-escapes user input
- No `dangerouslySetInnerHTML` usage
- Sanitize any dynamic content

---

## 12. ACCESSIBILITY (A11Y) REQUIREMENTS

### 12.1 WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- All interactive elements: Tab-accessible
- Focus indicators: 2px solid outline
- Skip links: "Skip to main content"
- No keyboard traps

**Screen Readers**:
- ARIA labels for all buttons/links
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`
- Alt text for all images
- Live regions for dynamic content

**Color Contrast**:
- Text: ≥4.5:1 (normal), ≥3:1 (large)
- Interactive elements: ≥3:1
- Test: Chrome DevTools, Axe

**Responsive Text**:
- Zoom: 200% without horizontal scroll
- Font sizes: rem units (not px)
- Line height: ≥1.5 for body text

### 12.2 Component-Specific A11y

**RowBreakdownView**:
```tsx
<table role="table" aria-label="Row-by-row shade breakdown for Section 114B">
  <thead>
    <tr>
      <th scope="col">Row</th>
      <th scope="col">Seats</th>
      <th scope="col">Shade Percentage</th>
    </tr>
  </thead>
  <tbody>
    <tr data-row="A">
      <td>A</td>
      <td>18</td>
      <td aria-label="95% shade">95%</td>
    </tr>
  </tbody>
</table>
```

**LanguageSelector**:
```tsx
<select aria-label="Select language" onChange={handleChange}>
  <option value="en">English</option>
  <option value="es">Español</option>
  <option value="fr">Français</option>
</select>
```

### 12.3 Testing Strategy

**Automated**:
- `@axe-core/playwright` in CI/CD
- Run on every PR
- Zero violations required for merge

**Manual**:
- Keyboard-only navigation test
- Screen reader test: NVDA (Windows), VoiceOver (macOS)
- Voice control test: Dragon NaturallySpeaking

---

## 13. MONITORING & OBSERVABILITY

### 13.1 Analytics Tracking

**Key Events**:
```typescript
// Track row breakdown usage
gtag('event', 'row_breakdown_expand', {
  section_id: '114B',
  stadium_id: 'yankees',
  date: '2026-06-15',
  time: '14:00'
});

// Track World Cup page views
gtag('event', 'page_view', {
  page_title: '2026 World Cup Shade Guide',
  page_location: '/world-cup-2026'
});

// Track language switching
gtag('event', 'language_change', {
  from_language: 'en',
  to_language: 'es'
});

// Track filter usage
gtag('event', 'row_filter_applied', {
  filter_type: 'has_rows_with_shade',
  threshold: 80,
  min_rows: 5
});
```

### 13.2 Error Tracking

**Client-Side Errors**:
```typescript
// Error boundary logging
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to Sentry or similar
    console.error('Error boundary caught:', error, errorInfo);

    // Track in analytics
    gtag('event', 'exception', {
      description: error.message,
      fatal: true
    });
  }
}
```

**Server-Side Errors**:
```typescript
// API error handling
export async function GET(request: NextRequest) {
  try {
    // ... calculation logic
  } catch (error) {
    console.error('API error:', error);

    return new Response(JSON.stringify({ error: 'Calculation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### 13.3 Performance Monitoring

**Real User Monitoring (RUM)**:
```typescript
// Track calculation performance
const start = performance.now();
const results = await calculateAllStadiumRows(stadium, date, time);
const end = performance.now();

gtag('event', 'timing_complete', {
  name: 'row_calculation',
  value: Math.round(end - start),
  event_category: 'performance',
  event_label: stadium.id
});
```

**Vercel Analytics**:
- Enable Vercel Speed Insights
- Track Core Web Vitals
- Monitor API response times

---

## 14. DEPLOYMENT STRATEGY

### 14.1 Deployment Pipeline

**Environments**:
1. **Development**: Local (`npm run dev`)
2. **Preview**: Vercel PR previews (automatic)
3. **Staging**: `staging.thestadium.com` (optional)
4. **Production**: `thestadium.com`

**CI/CD Flow**:
```yaml
# .github/workflows/deploy.yml

name: Deploy
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e
      - run: npm run test:a11y

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/actions/cli@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 14.2 Rollout Plan

**Phase 0-1 (Weeks 1-3)**: Development only
- Deploy to preview environments
- No production impact

**Phase 2-3 (Weeks 3-6)**: Soft launch
- Deploy to production
- Feature flag: `ENABLE_ROW_LEVEL=true`
- Limited visibility (no homepage links)
- Beta users only

**Phase 4-7 (Weeks 6-10)**: Full launch
- World Cup landing page live
- Homepage hero: "2026 World Cup Shade Guide"
- SEO optimization
- Marketing push

### 14.3 Rollback Plan

**Automatic Rollback**:
- Vercel deployment fails → Auto-rollback to previous
- Error rate >5% → Manual rollback

**Manual Rollback**:
```bash
# Revert to previous deployment
vercel rollback thestadium-production --token=$VERCEL_TOKEN
```

**Feature Flags**:
```typescript
// Enable/disable row-level features
const FEATURE_FLAGS = {
  ENABLE_ROW_LEVEL: process.env.ENABLE_ROW_LEVEL === 'true',
  ENABLE_WORLD_CUP: process.env.ENABLE_WORLD_CUP === 'true',
  ENABLE_I18N: process.env.ENABLE_I18N === 'true'
};
```

---

## 15. DOCUMENTATION REQUIREMENTS

### 15.1 Code Documentation

**TypeScript JSDoc**:
```typescript
/**
 * Calculates shade coverage for an individual row.
 *
 * @param row - Row details (elevation, depth, covered status)
 * @param section - Parent section configuration
 * @param sunAltitude - Sun altitude in degrees (0-90)
 * @param sunAzimuth - Sun azimuth in degrees (0-360)
 * @returns Row-level shadow data with coverage percentage
 *
 * @example
 * ```typescript
 * const rowData = calculateRowShadow(
 *   { rowNumber: 'A', elevation: 8, depth: 0, covered: false },
 *   section,
 *   62.5,
 *   195.3
 * );
 * console.log(rowData.coverage); // 95
 * ```
 */
export function calculateRowShadow(
  row: RowDetail,
  section: DetailedSection,
  sunAltitude: number,
  sunAzimuth: number
): RowShadowData {
  // ... implementation
}
```

**README Updates**:
- Add "Row-Level Calculations" section
- Add "World Cup 2026" section
- Update feature list
- Add screenshots

### 15.2 User Documentation

**Help Pages** (Optional for V1):
- "How Row-Level Shade Works"
- "2026 World Cup Guide"
- "FAQ: Shade Calculations"

**In-App Tooltips**:
- Row breakdown: "Click to see shade for each row"
- Filters: "Find sections with specific row shade levels"

### 15.3 Developer Documentation

**Internal Docs** (`/docs/`):
- `architecture.md`: System architecture overview
- `calculations.md`: Sun calculation algorithms
- `data-entry.md`: How to add new stadiums
- `deployment.md`: Deployment procedures
- `testing.md`: Test strategy and procedures

---

## 16. OPEN QUESTIONS & DECISIONS

### Critical Decisions (Answer Before Implementation)

**Q1: Approve 10-Week Timeline?**
- **Proposed**: 10 weeks (70 days) to April 1, 2026 launch
- **Risk**: Aggressive but achievable with focus
- **Alternative**: 12 weeks (more buffer, but closer to World Cup)
- **Decision**: [ ] Approve | [ ] Adjust

**Q2: Approve Dual-Use Stadium Approach?**
- **Proposed**: Duplicate 11 NFL stadiums as `-wc.ts` files
- **Trade-off**: Data duplication (~270KB) vs clean separation
- **Alternative**: Single stadium with `configuration: 'nfl' | 'soccer'` toggle
- **Decision**: [ ] Approve duplication | [ ] Use configuration toggle

**Q3: Field Verification Budget?**
- **Proposed**: $1,500-3,000 for 3-5 stadiums
- **Alternative**: Accept template-based data for V1, refine post-launch
- **Decision**: [ ] Approve budget | [ ] Defer verification

**Q4: Translation Approach?**
- **Option A**: Professional translator ($2-3k)
- **Option B**: Machine translation (DeepL) + review ($500)
- **Recommended**: Option B for V1
- **Decision**: [ ] Option A | [ ] Option B | [ ] Other

**Q5: Defer Features to Phase 2?**
- **Candidates**: 3D visualization, row comparison tool, advanced filtering
- **Rationale**: Focus on World Cup deadline
- **Decision**: [ ] Approve deferrals | [ ] Include in V1

---

## 17. ASSUMPTIONS

**Assumption 1: Existing Row Data is Accurate**
- Row data generated by `generateRows()` templates is realistic
- Validation: Spot-check 5 stadiums against seating charts
- Risk: If templates are wrong, calculations are wrong

**Assumption 2: FIFA Schedule Available**
- 2026 World Cup full schedule is published or will be soon
- Action: Check FIFA website immediately
- Fallback: Use TBD placeholders, update when available

**Assumption 3: Users Want Row-Level Detail**
- Users will expand row breakdown (not ignore it)
- Validation: Track expansion rate in analytics (target: >60%)
- Risk: If usage <30%, reconsider prominence in UI

**Assumption 4: Static Files Scale to 500 Stadiums**
- Build time remains <5 minutes
- Page load time remains <2s
- Validation: Benchmark with 300 stadiums
- Threshold: If build >5 minutes, consider database

**Assumption 5: 10-Week Timeline is Sufficient**
- No major blockers or unforeseen issues
- All 5 new stadiums have accessible data
- No significant scope creep
- Contingency: 2-week buffer included

---

## 18. SUCCESS CRITERIA

### 18.1 Launch Criteria (MVP - April 1, 2026)

**Must-Have**:
- ✅ Row-level calculations operational for all existing stadiums
- ✅ Row breakdown UI component functional (desktop + mobile)
- ✅ All 16 World Cup venues with row-level data
- ✅ World Cup landing page live
- ✅ Match schedule integrated (104 matches)
- ✅ Multi-language support (EN, ES, FR)
- ✅ Lighthouse Performance ≥85
- ✅ Zero P0/P1 bugs
- ✅ WCAG AA compliant

**Nice-to-Have (Defer to Phase 2)**:
- Visual seat map
- Row comparison tool
- Field verification for all stadiums
- Advanced filtering
- User accounts

### 18.2 Post-Launch Metrics (3 Months)

| Metric | Target | Measurement |
|--------|--------|-------------|
| World Cup page views | 100k+ | Google Analytics |
| Row breakdown expansion rate | ≥60% | Event tracking |
| Time on site | 5 min avg | GA4 |
| Bounce rate | <35% | GA4 |
| World Cup conversions | 5k+ clicks | Affiliate tracking |
| Lighthouse score | ≥90 | Maintain |
| User satisfaction | 4+/5 | Surveys |

---

## 19. NEXT STEPS

### Immediate Actions (This Week)

1. **Stakeholder Review**: Review this spec, answer open questions (Section 16)
2. **Approval**: Approve timeline, approach, budget
3. **Data Gathering**: Start researching 5 new World Cup stadiums
4. **FIFA Schedule**: Check if 2026 match schedule published
5. **Kickoff Meeting**: Align on priorities, assign responsibilities

### Week 1 Deliverables

1. Create `rowShadowCalculator.ts` (calculation engine)
2. Extend `sunCalculator.ts` (row-level methods)
3. Unit tests for row calculations
4. Performance benchmark (2,460 rows <100ms)

### Communication Plan

**Weekly Progress Reviews**:
- Every Friday, 2:00 PM
- Share: Completed tasks, blockers, next week plan
- Format: Written update + optional call

**Status Updates**:
- Update plan.md checkboxes daily
- Tag blockers in GitHub issues
- Slack/email for urgent issues

---

## 20. SUMMARY

This technical specification details how to extend TheStadium.com from section-level to row-level sun calculations while adding 2026 FIFA World Cup coverage. The approach leverages existing infrastructure (Next.js, TypeScript, static files) and follows established patterns to minimize risk.

**Key Technical Decisions**:
1. Extend existing `SunCalculator` class (no rewrite)
2. Use Web Workers for calculations (don't block UI)
3. Keep static file storage (no database)
4. Duplicate NFL stadiums for World Cup (clean separation)
5. Use `next-intl` for i18n (standard Next.js integration)

**Timeline**: 10 weeks (70 days) to April 1, 2026 launch
- Weeks 1-2: Row calculation engine
- Weeks 2-3: Row UI components
- Weeks 3-6: World Cup venues (11 + 5 new)
- Weeks 6-7: World Cup UI + schedule
- Weeks 7-8: Multi-language
- Weeks 8-10: Testing, optimization, launch prep

**Success Factors**:
- Start immediately (every week counts)
- Parallel tracks (row-level + World Cup)
- Focus on World Cup deadline (April 1, 2026)
- Pragmatic data quality (template-based OK for V1)
- Performance monitoring (maintain Lighthouse ≥90)

**Next Action**: Approve spec and proceed to implementation planning.

---

**END OF TECHNICAL SPECIFICATION**

---

**Document Metadata**:
- Version: 1.0
- Author: Claude (AI Assistant)
- Date: January 22, 2026
- Word Count: ~13,500 words
- Pages: 55
- Status: Draft - Awaiting Approval
