# Technical Specification: TheShadium.com World Cup v2

**Project:** TheShadium.com - Stadium Shade Finder
**Version:** 2.0 (World Cup v2)
**Date:** January 27, 2026
**Status:** Technical Specification Phase

---

## 1. Executive Summary

This technical specification defines the implementation approach for World Cup v2 improvements to TheShadium.com, building on the comprehensive requirements outlined in `requirements.md`. The implementation will achieve row-level shade accuracy for all MLB stadiums, modernize the UX/UI, enhance World Cup 2026 features, and establish robust data quality systems.

**Core Principles:**
- **Simplicity First**: Every change impacts minimal code; avoid complex refactoring
- **Incremental Delivery**: Ship working features in phases, not all at once
- **Root Cause Fixes**: No temporary solutions; fix issues at their source
- **2025+ Data**: Use current, accurate data for all calculations
- **No Laziness**: Thorough investigation and implementation for every feature

---

## 2. Technical Context

### 2.1 Current Tech Stack

**Frontend:**
- **Framework**: Next.js 15.5.7 (App Router)
- **Runtime**: React 18.2.0
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.17 + CSS Modules
- **3D Graphics**: Three.js 0.178.0

**Build & Deploy:**
- **Hosting**: Vercel (static generation + serverless functions)
- **Build Tools**: Next.js built-in, Bundle Analyzer
- **PWA**: next-pwa 5.6.0
- **Image Optimization**: Sharp 0.34.4

**Data & Calculations:**
- **Sun Calculations**: SunCalc 1.9.0 (astronomical algorithms)
- **Weather API**: Open-Meteo (free tier)
- **Date/Time**: date-fns 4.1.0, date-fns-tz 3.2.0
- **Geometry**: Custom 3D ray tracing engine

**Testing:**
- **Unit Tests**: Jest 30.1.3, Testing Library 16.3.2
- **E2E Tests**: Playwright 1.55.0
- **Accessibility**: @axe-core/playwright 4.10.2
- **Current Coverage**: 70% (target: 90%+)

### 2.2 Current Architecture

**Data Layer:**
```
src/data/
├── stadiums.ts              # MLB stadium metadata (30 stadiums)
├── nflStadiums.ts           # NFL stadium metadata (32 stadiums)
├── milbStadiums.ts          # MiLB stadium metadata (120+ stadiums)
├── sections/
│   ├── mlb/                 # MLB section data (30 files, ~51k lines total)
│   │   ├── camden-yards.ts  # Row-level data with 3D coordinates
│   │   ├── yankee-stadium.ts
│   │   └── ...              # 28 more MLB stadiums
│   ├── nfl/                 # NFL section data (32 files with row-level)
│   ├── milb/                # MiLB sections (organized by level: AAA, AA, etc.)
│   └── worldcup/            # World Cup sections (5 files, row-level)
├── obstructions/            # 3D obstruction models
│   ├── milb/                # MiLB obstruction files
│   │   ├── aaa/, aa/, high-a/, low-a/
│   └── ...
└── worldcup2026/
    ├── venues.ts            # 16 World Cup venues
    └── matches.ts           # Match schedule data
```

**Calculation Engine:**
```
src/utils/
├── sunCalculations.ts              # Sun position algorithms
├── shadeCalculation3DOptimized.ts  # 3D ray tracing with BVH acceleration
├── sunCalculator.ts                # Wrapper for SunCalc library
└── weatherAPI.ts                   # Open-Meteo integration
```

**UI Components:**
```
src/components/
├── UnifiedGameSelector.tsx         # Game date/time selection
├── LazySectionCardModern.tsx       # Section result cards
├── EnhancedSunFilter.tsx           # Filter/sort UI
├── StadiumHeader/                  # Stadium detail page header
├── MobileFilterSheet.tsx           # Mobile filter drawer
└── WorldCupBadge.tsx               # World Cup branding
```

**Pages (App Router):**
```
app/
├── page.tsx                        # Homepage
├── stadium/[stadiumId]/page.tsx    # Stadium detail page
├── league/[leagueId]/page.tsx      # League landing pages
└── worldcup2026/
    ├── page.tsx                    # World Cup landing page
    └── schedule/page.tsx           # Match schedule (exists but minimal)
```

### 2.3 Key Existing Patterns

**Data Structure:**
- All stadiums use `DetailedSection` interface (defined in `src/types/stadium-complete.ts`)
- Row-level data includes: `RowDetail[]` with elevation, depth, seat count
- 3D coordinates: `Vector3D` arrays for section boundaries
- Obstructions: `Obstruction3D` with mesh geometry and bounding boxes

**Calculation Approach:**
- `OptimizedShadeCalculator3D` class for row-level stadiums (NFL, World Cup)
- BVH (Bounding Volume Hierarchy) acceleration for ray-obstruction tests
- Spatial grid for efficient lookups
- Worker pool support (currently unused)

**Current Limitations:**
1. **MLB stadiums have section data but lack row-level details** - files exist but use generic row generation
2. **No 3D obstruction models for MLB** - only basic section geometry
3. **MiLB uses auto-generated sections** for most stadiums (not venue-specific)
4. **World Cup schedule page is minimal** - exists but needs full implementation

---

## 3. Implementation Approach

### 3.1 Data-First Strategy

**Rationale:** UI/UX improvements depend on having accurate row-level data. We must prioritize data collection and validation before building visual features.

**Phases:**
1. **Phase 1**: MLB row-level data collection and validation (4 weeks)
2. **Phase 2**: UX/UI modernization using new MLB data (3 weeks)
3. **Phase 3**: World Cup feature completion (2 weeks)
4. **Phase 4**: MiLB improvements and polish (3 weeks)

### 3.2 Existing Code Reuse

**High Reuse Potential:**
- `OptimizedShadeCalculator3D` - Already handles row-level calculations (NFL, World Cup)
- `DetailedSection` type system - Perfectly suited for MLB expansion
- Section data file structure - Proven pattern from NFL implementation
- Mobile filter UI - `MobileFilterSheet.tsx` works well, needs minor enhancements
- World Cup landing page - Foundation exists, needs content expansion

**Minimal Changes Needed:**
- Stadium detail page - Already displays row breakdowns when data exists
- API routes - Existing `/api/stadium/[stadiumId]/rows/shade` works for row data
- Calculation caching - Already implemented in `shadeCalculation3DOptimized.ts`

### 3.3 Architectural Decisions

#### 3.3.1 Data Storage: File-Based vs Database

**Decision: Continue with TypeScript files (current approach)**

**Rationale:**
- ✅ Already have 51k+ lines of MLB section data in TypeScript files
- ✅ Type safety at compile time (catch errors early)
- ✅ No runtime database queries (faster page loads)
- ✅ Version control via Git (track data changes)
- ✅ Vercel static generation - pre-renders all stadium pages
- ❌ No admin UI for data editing (acceptable for v2; defer CMS to v3)

**Implementation:**
- Keep existing file structure: `src/data/sections/mlb/*.ts`
- Add validation scripts to ensure data integrity
- Use dynamic imports for lazy loading (reduce initial bundle)

#### 3.3.2 3D Calculation: Client vs Server

**Decision: Client-side calculations with aggressive caching**

**Rationale:**
- ✅ Current approach works well for NFL/World Cup stadiums
- ✅ Offloads compute from Vercel serverless (cost savings)
- ✅ Can use Web Workers for non-blocking calculations
- ✅ Cache results in localStorage/IndexedDB for repeat visits
- ❌ Requires JavaScript (acceptable - progressive enhancement)

**Enhancement:**
- Enable Web Worker pool (already scaffolded in `OptimizedShadeCalculator3D`)
- Add IndexedDB caching for seat-level results (expires after 7 days)
- Progressive rendering: show section-level results first, then row-level as they compute

#### 3.3.3 Bundle Size Management

**Decision: Aggressive code splitting + lazy loading**

**Current State:**
- Initial bundle: Unknown (need to measure)
- MLB section data: 51k lines (~1-2 MB uncompressed)

**Strategy:**
```typescript
// Dynamic imports for stadium-specific data
const loadMLBStadiumSections = async (stadiumId: string) => {
  const module = await import(`@/data/sections/mlb/${stadiumId}.ts`);
  return module.default;
};

// Code splitting by league
export const mlbSections = () => import('@/data/sections/mlb');
export const nflSections = () => import('@/data/sections/nfl');
export const milbSections = () => import('@/data/sections/milb');
```

**Bundle Targets:**
- Initial JS: <300 KB (gzipped)
- Per-stadium chunk: <100 KB (gzipped)
- Defer Three.js until 3D visualization needed (Phase 2+)

#### 3.3.4 UI Component Library

**Decision: Continue with Tailwind + Custom Components (no new library)**

**Rationale:**
- ✅ Tailwind already integrated and working well
- ✅ Custom components give full control over mobile UX
- ✅ No new dependencies = smaller bundle
- ❌ No pre-built component library (acceptable - we need custom designs anyway)

**Patterns to Follow:**
- Mobile-first: Design for 375px width, scale up
- CSS Modules for component-specific styles (avoid global pollution)
- Shared Tailwind utilities for spacing, colors, typography

---

## 4. Source Code Structure Changes

### 4.1 New Files to Create

#### Phase 1: Data & Validation

```
src/data/obstructions/mlb/
├── yankee-stadium-obstructions.ts
├── fenway-park-obstructions.ts
├── wrigley-field-obstructions.ts
└── ...                              # 30 total MLB obstruction files

scripts/
├── validate-stadium-data.ts         # CLI tool for data validation
└── generate-stadium-report.ts       # Generate validation reports

src/data/__tests__/
├── mlbDataIntegrity.test.ts         # Test all MLB data files load correctly
└── obstructionGeometry.test.ts      # Validate 3D obstruction models
```

#### Phase 2: UI Components

```
src/components/
├── StadiumDiagram/
│   ├── StadiumDiagram.tsx           # Interactive 2D stadium diagram
│   ├── StadiumDiagram.module.css    # Component styles
│   ├── SectionPolygon.tsx           # Individual section rendering
│   └── ShadeColorScale.tsx          # Color legend for shade levels
├── RowDetailView/
│   ├── RowDetailView.tsx            # Expandable row breakdown
│   └── RowDetailView.module.css
├── SectionComparison/
│   ├── SectionComparison.tsx        # Side-by-side section comparison
│   └── ComparisonCard.tsx           # Individual section in comparison
├── ShadeTimeline/
│   ├── ShadeTimeline.tsx            # Inning-by-inning shade evolution
│   └── TimelineSlider.tsx           # Interactive timeline scrubber
└── FilterPresets/
    └── FilterPresets.tsx            # One-click filter presets
```

#### Phase 3: World Cup Features

```
src/components/worldcup/
├── MatchScheduleGrid.tsx            # Match schedule table/grid
├── MatchCard.tsx                    # Individual match display
├── VenueComparison.tsx              # Multi-venue comparison
├── CountryFilter.tsx                # Filter by USA/Mexico/Canada
└── MatchCountdownWidget.tsx         # Countdown to specific match

app/worldcup2026/
├── venues/
│   └── [venueId]/page.tsx           # Individual World Cup venue pages
└── compare/
    └── page.tsx                     # Venue comparison tool

src/data/worldcup2026/
├── matches-full.ts                  # Complete 104-match schedule
└── venue-comparisons.ts             # Comparison metadata
```

#### Phase 4: Data Quality

```
src/utils/
├── dataFreshness.ts                 # Track data update timestamps
└── feedbackHandler.ts               # User feedback processing

app/api/
├── report-inaccuracy/
│   └── route.ts                     # API endpoint for user feedback
└── stadium-validation/
    └── [stadiumId]/route.ts         # Validation report endpoint

.github/workflows/
└── validate-data.yml                # CI/CD data validation
```

### 4.2 Files to Modify

#### Existing MLB Section Files (30 files)

**Current State:** Generic row generation
```typescript
// Example: camden-yards.ts (current)
const generateRows = (startRow, endRow, seatsPerRow, startElevation) => {
  // Generic elevation calculation
  return Array.from({ length }, (_, i) => ({
    rowNumber: String.fromCharCode(start + i),
    seats: seatsPerRow,
    elevation: startElevation + (i * 0.5),  // Generic increment
    depth: i * 3,                           // Generic depth
    covered: false                          // No coverage data
  }));
};
```

**Updated State:** Accurate row-level data
```typescript
// Example: camden-yards.ts (updated)
export const camdenYardsSections: DetailedSection[] = [
  {
    id: 'section-12',
    name: 'Lower Box 12',
    level: 'lower',
    rows: [
      { rowNumber: 'A', seats: 22, elevation: 15.0, depth: 0, covered: false },
      { rowNumber: 'B', seats: 22, elevation: 15.4, depth: 2.8, covered: false },
      { rowNumber: 'C', seats: 22, elevation: 15.9, depth: 5.7, covered: false },
      // ... exact measurements for each row
      { rowNumber: 'Z', seats: 22, elevation: 28.2, depth: 72.0, covered: false }
    ],
    vertices3D: [
      { x: -30.5, y: 15.0, z: 15.0 },  // Accurate coordinates
      { x: 30.5, y: 15.0, z: 15.0 },
      { x: 35.2, y: 85.0, z: 45.8 },
      { x: -35.2, y: 85.0, z: 45.8 }
    ],
    // ... rest of section data
  },
  // ... 60-100 sections per stadium
];
```

**Modification Strategy:**
1. Research actual stadium geometry (seating charts, photos, dimensions)
2. Calculate accurate row elevations based on stadium rake angle
3. Add 3D vertices for section boundaries
4. Define coverage zones for upper deck overhangs
5. Include accessibility metadata where available

#### Calculation Engine Enhancement

**File:** `src/utils/shadeCalculation3DOptimized.ts`

**Changes:**
```typescript
// Enable for MLB stadiums (currently only NFL/World Cup)
export class OptimizedShadeCalculator3D {
  constructor(stadium: Stadium3DModel, useWebWorkers: boolean = true) {
    this.stadium = stadium;
    this.useWebWorkers = useWebWorkers && typeof Worker !== 'undefined';

    // NEW: Always enable web workers for MLB (large stadiums)
    if (stadium.league === 'MLB' && typeof Worker !== 'undefined') {
      this.useWebWorkers = true;
      this.initializeWorkerPool(4); // 4 workers for parallelization
    }

    this.buildBVH();
    this.buildSpatialGrid();
  }

  // NEW: Progressive calculation with callbacks
  async calculateSectionShadeProgressive(
    sectionId: string,
    sunPosition: SunPosition,
    onProgress?: (percentComplete: number) => void
  ): Promise<SectionShadeResult> {
    // Calculate rows in batches, report progress
    // ...
  }
}
```

#### Stadium Detail Page

**File:** `app/stadium/[stadiumId]/StadiumPageClient.tsx`

**Changes:**
```typescript
// Add row detail expansion
const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

// Add section comparison mode
const [comparisonMode, setComparisonMode] = useState(false);
const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

// Render row details when expanded
{expandedSections.has(section.id) && (
  <RowDetailView
    section={section}
    sunPosition={currentSunPosition}
    gameTime={selectedGameTime}
  />
)}
```

#### Filter Component

**File:** `src/components/EnhancedSunFilter.tsx`

**Changes:**
```typescript
// Add filter presets
const FILTER_PRESETS = {
  maximumShade: { sunExposure: [0, 20], covered: true },
  budgetFriendly: { price: ['value', 'moderate'], sunExposure: [0, 50] },
  closeAndShaded: { level: ['field', 'lower'], sunExposure: [0, 30] },
  accessible: { accessibility: true, sunExposure: [0, 50] }
};

// Add one-click preset buttons
<div className="filter-presets">
  {Object.entries(FILTER_PRESETS).map(([key, preset]) => (
    <button onClick={() => applyPreset(preset)}>
      {presetLabels[key]}
    </button>
  ))}
</div>
```

---

## 5. Data Model / API / Interface Changes

### 5.1 Type System Extensions

**No Breaking Changes** - All changes are additive

#### Enhanced DetailedSection (additive)

```typescript
// src/types/stadium-complete.ts
export interface DetailedSection {
  // ... existing fields ...

  // NEW: Row-level shade percentages (calculated)
  rowShadePercentages?: Map<string, number>; // rowNumber -> shade %

  // NEW: Optimal viewing times
  optimalArrivalTime?: Date;  // When section reaches >50% shade
  fullShadeTime?: Date;        // When section reaches >80% shade

  // NEW: Enhanced price metadata
  priceRange?: {
    min: number;
    max: number;
    currency: 'USD' | 'CAD' | 'MXN';
  };

  // NEW: Enhanced view quality
  viewMetadata?: {
    quality: 'excellent' | 'good' | 'fair' | 'obstructed';
    distanceFromAction: number;  // feet
    sightlineAngle: number;       // degrees
    obstructions?: string[];       // description of view obstructions
  };
}
```

#### Stadium Validation Result (new)

```typescript
// src/types/validation.ts
export interface StadiumValidationResult {
  stadiumId: string;
  valid: boolean;
  timestamp: Date;

  errors: ValidationError[];      // Critical issues
  warnings: ValidationWarning[];  // Non-blocking issues

  coverage: {
    sectionsTotal: number;
    sectionsWithRows: number;
    rowsTotal: number;
    obstructions: number;
    geometryComplete: boolean;
    dataFreshness: 'current' | 'outdated' | 'unknown';
  };

  metrics: {
    avgRowsPerSection: number;
    avgSeatsPerRow: number;
    coveragePercentage: number;  // % of seats with shade data
  };
}

export interface ValidationError {
  type: 'missing_data' | 'invalid_geometry' | 'duplicate_id' | 'type_mismatch';
  severity: 'critical' | 'high';
  field: string;
  message: string;
  suggestion?: string;
}
```

### 5.2 API Endpoints

**Existing Endpoints (no changes):**
- `GET /api/weather/[stadiumId]` - Weather data
- `GET /api/stadium/[stadiumId]` - Stadium metadata
- `GET /api/stadium/[stadiumId]/rows/shade` - Row-level shade (already exists!)

**New Endpoints:**

```typescript
// 1. Seat-level shade calculation
GET /api/stadium/[stadiumId]/seat/[sectionId]/[row]/[seat]/shade
Query params: gameTime (ISO 8601 datetime)
Response: {
  seatId: string;
  shadePercentage: number;
  inShade: boolean;
  obstructedBy: string[];
  sunPosition: { azimuth, elevation };
  timeline: Array<{ time: Date, shadePercentage: number }>;
}

// 2. Section comparison
POST /api/stadium/[stadiumId]/sections/compare
Body: { sectionIds: string[], gameTime: string }
Response: {
  sections: Array<{
    sectionId: string;
    shadePercentage: number;
    price: { min, max };
    distance: number;
    viewQuality: string;
    accessibility: boolean;
  }>;
}

// 3. User feedback submission
POST /api/report-inaccuracy
Body: {
  stadiumId: string;
  sectionId?: string;
  description: string;
  userContact?: string;
}
Response: { success: boolean, submissionId: string }

// 4. Stadium validation report
GET /api/stadium-validation/[stadiumId]
Response: StadiumValidationResult (see type above)
```

### 5.3 World Cup Data Model

```typescript
// src/data/worldcup2026/types.ts
export interface WorldCupMatch {
  id: string;
  matchNumber: number;
  phase: 'group' | 'round_16' | 'quarter' | 'semi' | 'third_place' | 'final';

  date: Date;
  time: string;              // Local time (e.g., "17:00")
  timezone: string;

  venueId: string;
  venueName: string;
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';

  // Teams (placeholders for group stage)
  homeTeam: string;          // "Winner Group A" or actual team name
  awayTeam: string;
  group?: string;            // "A", "B", etc. for group stage

  // Ticketing (optional)
  ticketUrl?: string;
  estimatedPriceRange?: { min: number, max: number };
}

export interface WorldCupVenue {
  id: string;
  name: string;
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';

  // Stadium data reference
  stadiumId: string;         // Links to existing stadium data

  // World Cup specific
  capacity: number;
  matches: WorldCupMatch[];  // All matches at this venue

  // Climate context
  climateZone: 'hot-dry' | 'hot-humid' | 'temperate' | 'mild';
  typicalJuneWeather: {
    avgHigh: number;
    avgLow: number;
    precipitationChance: number;
  };
}
```

---

## 6. Delivery Phases

### Phase 1: MLB Row-Level Data Foundation (4 weeks)

**Goal:** Collect, validate, and integrate accurate row-level data for all 30 MLB stadiums.

#### Week 1: Data Collection & Infrastructure

**Tasks:**
1. Create validation tooling (`scripts/validate-stadium-data.ts`)
   - Load all MLB section files
   - Check for missing fields, invalid coordinates
   - Report coverage statistics

2. Set up CI/CD validation (`/.github/workflows/validate-data.yml`)
   - Run validation on every PR
   - Fail build if critical errors found

3. Research data sources for top 10 MLB stadiums
   - Official team seating charts
   - Ticketing platform data (SeatGeek, StubHub)
   - Photogrammetry from high-res photos

4. Create template for obstruction files
   - `src/data/obstructions/mlb/template.ts`
   - Document process for creating obstructions

**Deliverables:**
- ✅ Validation CLI tool working
- ✅ CI/CD pipeline configured
- ✅ Data sources identified for all 30 stadiums
- ✅ 3D obstruction template documented

#### Week 2-3: Data Collection for All 30 MLB Stadiums

**Parallel Workstreams:**

**Stream A: Section Data (Priority Stadiums)**
1. High-traffic stadiums (10): Yankee Stadium, Fenway Park, Dodger Stadium, Wrigley Field, AT&T Park, Camden Yards, Petco Park, Oracle Park, Coors Field, Busch Stadium
2. Medium-traffic stadiums (10): Next 10 by attendance
3. Remaining stadiums (10): Complete remaining 10

**Stream B: 3D Obstruction Models (Parallel)**
- Create obstruction files for each stadium as section data is collected
- Focus on:
  - Roof structures (retractable: Chase Field, Rogers Centre, etc.)
  - Upper deck overhangs (all multi-level stadiums)
  - Scoreboards (major video boards that block sun)
  - Unique features (Green Monster at Fenway, etc.)

**Data Quality Standards:**
- Each stadium: 60-100+ sections with row data
- Row elevation accuracy: ±1 foot acceptable
- Section boundary vertices: ±5 feet acceptable
- Coverage data: Must match stadium roof configuration
- All obstructions must have bounding boxes defined

**Deliverables:**
- ✅ 30/30 MLB stadiums have updated section files
- ✅ 30/30 MLB stadiums have obstruction files
- ✅ All files pass validation (zero critical errors)
- ✅ Documentation of data collection methodology

#### Week 4: Integration & Testing

**Tasks:**
1. Update stadium loading logic
   - Ensure MLB stadiums load obstruction models
   - Enable `OptimizedShadeCalculator3D` for MLB

2. Create integration tests
   - Test loading all 30 MLB stadiums
   - Test shade calculations complete within 2 seconds
   - Test API endpoints return row-level data

3. Performance optimization
   - Measure bundle size impact
   - Implement lazy loading if needed
   - Enable web worker pool for calculations

4. Documentation
   - Document each stadium's unique features
   - Create data changelog
   - Write validation report for each stadium

**Deliverables:**
- ✅ All MLB stadiums calculate row-level shade
- ✅ Integration tests passing (90%+ coverage)
- ✅ Performance targets met (<2s calculations)
- ✅ Documentation complete

**Success Metrics:**
- 30/30 MLB stadiums with row-level data
- Zero critical validation errors
- API response time <500ms (p95)
- Bundle size increase <20% from Phase 0

---

### Phase 2: UX/UI Modernization (3 weeks)

**Goal:** Create intuitive, visual interfaces for exploring shade data.

#### Week 5: Stadium Diagram Component

**Tasks:**
1. Create `StadiumDiagram` component
   - 2D top-down view using SVG or Canvas
   - Color-coded sections by shade percentage
   - Responsive design (mobile/tablet/desktop)

2. Implement section selection
   - Click/tap to select section
   - Hover for quick preview
   - Highlight selected section

3. Create `ShadeColorScale` legend
   - 5-color scale (green → red)
   - Clear labeling (0-20%, 20-40%, etc.)
   - Color-blind safe palette

4. Integrate into stadium detail page
   - Place diagram above section list
   - Sync selection with section cards

**Deliverables:**
- ✅ `StadiumDiagram.tsx` component created
- ✅ Works on mobile, tablet, desktop
- ✅ WCAG 2.1 AA compliant (color contrast, keyboard nav)
- ✅ Integrated into stadium pages

#### Week 6: Enhanced Section Cards & Filtering

**Tasks:**
1. Redesign `LazySectionCardModern.tsx`
   - Larger shade percentage display
   - Visual icons for covered/uncovered
   - Price tier badges
   - Expandable row details

2. Create `RowDetailView` component
   - Row-by-row breakdown
   - Shade percentage per row
   - Timeline showing shade evolution (inning-by-inning)

3. Add filter presets to `EnhancedSunFilter.tsx`
   - "Maximum Shade", "Budget Friendly", "Close & Shaded", "Accessible"
   - One-click application

4. Create `SectionComparison` component
   - Select 2-4 sections
   - Side-by-side comparison table
   - Mobile swipe between sections

**Deliverables:**
- ✅ Section cards redesigned with visual hierarchy
- ✅ Row detail view expandable
- ✅ Filter presets working
- ✅ Comparison mode functional

#### Week 7: Homepage Redesign & Mobile Polish

**Tasks:**
1. Redesign homepage hero section
   - More engaging copy
   - Prominent league selector
   - Feature highlights

2. World Cup showcase section
   - Countdown timer to opening match
   - Featured venues carousel
   - CTA button to World Cup landing

3. Mobile filter drawer enhancement
   - Smoother animations
   - Haptic feedback (if supported)
   - Better touch targets (min 44px)

4. Performance optimization
   - Lazy load images
   - Defer non-critical JS
   - Optimize LCP, FID, CLS

**Deliverables:**
- ✅ Homepage redesigned
- ✅ World Cup section prominent
- ✅ Mobile UX polished
- ✅ Core Web Vitals: All "Good"

**Success Metrics:**
- Mobile bounce rate <40%
- Avg session duration >3 minutes
- LCP <2.5s, FID <100ms, CLS <0.1
- User testing: 80%+ positive feedback

---

### Phase 3: World Cup Feature Completion (2 weeks)

**Goal:** Complete World Cup 2026 features to maximize June 2026 opportunity.

#### Week 8: Match Schedule & Venue Pages

**Tasks:**
1. Create full match schedule data
   - All 104 matches with dates, times, venues
   - Group stage, knockout rounds
   - Timezone conversions for all venues

2. Build `MatchScheduleGrid` component
   - Table/grid view of all matches
   - Filters: country, venue, phase, date range
   - "Find Shaded Seats" CTA for each match

3. Create individual World Cup venue pages
   - `/worldcup2026/venues/[venueId]/page.tsx`
   - Show all matches at venue
   - Pre-fill game time when clicking "Find Shade"

4. Add countdown timers
   - "Days until opening match" on landing page
   - Per-match countdowns on schedule page

**Deliverables:**
- ✅ Match schedule page fully functional
- ✅ 104 matches with accurate data
- ✅ Filters working correctly
- ✅ Venue detail pages created (16 venues)

#### Week 9: Venue Comparison & Country Features

**Tasks:**
1. Build `VenueComparison` component
   - Select 2-4 World Cup venues
   - Compare: capacity, roof, shade %, climate, accessibility
   - Visual diagrams side-by-side

2. Add country filters
   - USA 🇺🇸 (11 venues)
   - Mexico 🇲🇽 (3 venues)
   - Canada 🇨🇦 (2 venues)
   - Filter icons and venue grouping

3. Climate context messaging
   - USA: "Summer heat - shade critical"
   - Mexico: "High altitude - intense sun"
   - Canada: "Mild climate - less sun concern"

4. SEO optimization for World Cup pages
   - Meta descriptions, Open Graph tags
   - Structured data (Schema.org)
   - Sitemap inclusion

**Deliverables:**
- ✅ Venue comparison tool working
- ✅ Country filters functional
- ✅ Climate messaging added
- ✅ SEO optimized (target top 10 Google rankings)

**Success Metrics:**
- All 104 matches listed with accurate data
- Venue comparison supports 2-4 venues
- World Cup pages indexed by Google
- Target 20% of site traffic from World Cup pages by June 2026

---

### Phase 4: MiLB Improvements & Polish (3 weeks)

**Goal:** Improve MiLB data quality, add monitoring, and final polish.

#### Week 10: MiLB Top 30 Venues

**Tasks:**
1. Identify top 30 MiLB venues
   - AAA priority (highest attendance)
   - New stadiums (Las Vegas Ballpark, etc.)
   - Market size (Nashville, Sacramento, etc.)

2. Collect row-level data for top 30
   - Same process as MLB (seating charts, photos)
   - Create section files in `src/data/sections/milb/`
   - Add obstruction models

3. Replace generic layouts
   - Identify stadiums currently using auto-generated sections
   - Replace with accurate data

4. Validation and testing
   - Run validation on all MiLB data
   - Integration tests for top 30

**Deliverables:**
- ✅ Top 30 MiLB venues identified
- ✅ Row-level data for 30/120 stadiums (25%)
- ✅ Validation passing for all 30

#### Week 11: Data Quality Monitoring

**Tasks:**
1. Add data freshness tracking
   - Timestamp in each section file
   - "Last updated" displayed on stadium pages
   - Alert if data >1 year old

2. Create "Report Inaccuracy" feature
   - Button on each stadium page
   - Form: section, description, contact
   - API endpoint: `POST /api/report-inaccuracy`
   - Store in Airtable or Google Sheets

3. Analytics dashboard
   - Track most-viewed stadiums
   - Monitor API error rates
   - Identify data needing updates

**Deliverables:**
- ✅ Data freshness tracking implemented
- ✅ "Report Inaccuracy" form live
- ✅ Analytics dashboard created

#### Week 12: Final Polish & Testing

**Tasks:**
1. Comprehensive testing
   - Unit tests: 90%+ coverage
   - E2E tests: All critical flows
   - Visual regression: Screenshot comparisons
   - Accessibility: Axe-core audits on all pages

2. Performance optimization
   - Bundle analysis and optimization
   - Image optimization (Sharp)
   - Code splitting review

3. Bug fixes
   - Fix all P0/P1 bugs
   - Address user feedback

4. Documentation
   - Update README
   - Write deployment guide
   - Create changelog

**Deliverables:**
- ✅ Test coverage >90%
- ✅ Zero P0/P1 bugs
- ✅ Core Web Vitals: All "Good"
- ✅ Documentation complete

**Success Metrics:**
- 30/120 MiLB venues with row-level data
- User feedback form receiving submissions
- Performance targets met across all metrics
- Ready for production launch

---

## 7. Verification Approach

### 7.1 Automated Testing Strategy

#### Unit Tests (Jest + Testing Library)

**Target Coverage: 90%+** (up from current 70%)

**Priority Test Areas:**
1. **Sun Calculation Algorithms** (`src/utils/sunCalculations.ts`)
   ```typescript
   describe('sunCalculations', () => {
     test('calculates correct sun position for known datetime/location', () => {
       const position = calculateSunPosition(
         new Date('2025-06-15T15:00:00-04:00'),
         40.7128, -74.0060 // NYC coordinates
       );
       expect(position.elevation).toBeCloseTo(62.5, 1);
       expect(position.azimuth).toBeCloseTo(210, 5);
     });
   });
   ```

2. **3D Geometry Utilities** (`src/utils/shadeCalculation3DOptimized.ts`)
   - BVH tree construction
   - Ray-obstruction intersection
   - Bounding box calculations

3. **Data Validation** (`scripts/validate-stadium-data.ts`)
   - All MLB stadiums load without errors
   - Section IDs are unique
   - Row elevations increase monotonically
   - 3D vertices form valid polygons

4. **API Route Handlers** (`app/api/*`)
   - Correct response format
   - Error handling (404, 500)
   - Input validation

#### Integration Tests (Jest)

**Test Scenarios:**
1. Load all stadium data files (MLB, NFL, MiLB, World Cup)
2. Validate TypeScript interfaces match data structure
3. Test shade calculation for sample stadiums
4. Test API endpoints return expected structure

```typescript
describe('Stadium Data Integration', () => {
  test('all MLB stadiums load successfully', async () => {
    const mlbStadiums = await loadAllMLBStadiums();
    expect(mlbStadiums).toHaveLength(30);
    mlbStadiums.forEach(stadium => {
      expect(stadium.sections.length).toBeGreaterThan(50);
      expect(stadium.obstructions.length).toBeGreaterThan(0);
    });
  });
});
```

#### E2E Tests (Playwright)

**Critical User Flows:**
1. **Find Shaded Seats (MLB)**
   - Navigate to homepage
   - Select MLB league
   - Select Yankee Stadium
   - Choose game date/time
   - Filter for "Maximum Shade"
   - Verify section results displayed
   - Expand row details
   - Verify shade percentages shown

2. **Section Comparison**
   - Select stadium
   - Choose 3 sections for comparison
   - Open comparison view
   - Verify side-by-side display
   - Mobile: verify swipe works

3. **World Cup Flow**
   - Navigate to World Cup landing
   - Open match schedule
   - Filter by "USA" venues
   - Select specific match
   - Click "Find Shaded Seats"
   - Verify venue and time pre-filled

**Visual Regression Tests:**
```typescript
// tests/visual.spec.ts
test('stadium diagram renders correctly', async ({ page }) => {
  await page.goto('/stadium/yankee-stadium?gameTime=2025-06-15T15:00');
  await page.waitForSelector('[data-testid="stadium-diagram"]');
  await expect(page).toHaveScreenshot('yankee-stadium-diagram.png', {
    maxDiffPixels: 100
  });
});
```

#### Accessibility Tests (Axe-core + Playwright)

```typescript
// tests/a11y.spec.ts
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('stadium page is accessible', async ({ page }) => {
  await page.goto('/stadium/yankee-stadium');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
});
```

**Accessibility Checklist:**
- ✅ Color contrast ratio ≥4.5:1 (WCAG AA)
- ✅ All interactive elements keyboard accessible
- ✅ Screen reader labels on all buttons/links
- ✅ Focus indicators visible
- ✅ Semantic HTML (proper heading hierarchy)

### 7.2 Performance Verification

#### Lighthouse CI (GitHub Actions)

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install && npm run build
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

**Lighthouse Targets:**
- Performance: >90
- Accessibility: 100
- Best Practices: >90
- SEO: 100

#### Core Web Vitals Monitoring

**Targets:**
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

**Measurement:**
- RUM (Real User Monitoring) via `web-vitals` library
- Report to analytics endpoint
- Monitor p75 percentile

#### Bundle Size Monitoring

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}
```

**Thresholds:**
- Initial JS bundle: <300 KB (gzipped)
- Per-stadium chunk: <100 KB (gzipped)
- Fail CI build if bundles exceed thresholds

### 7.3 Manual Testing & QA

#### Pre-Launch Checklist

**Data Quality:**
- [ ] All 30 MLB stadiums load without errors
- [ ] Validation reports show zero critical errors
- [ ] Spot-check 5 stadiums for data accuracy (compare to official seating charts)
- [ ] Test retractable roof stadiums (open/closed positions)

**UI/UX:**
- [ ] Test on 3 devices: iPhone, Android, Desktop
- [ ] Test on 3 browsers: Chrome, Safari, Firefox
- [ ] Verify all interactive elements work (clicks, hovers, swipes)
- [ ] Check responsive breakpoints (375px, 768px, 1024px, 1440px)

**World Cup Features:**
- [ ] All 104 matches displayed correctly
- [ ] Timezone conversions accurate
- [ ] Countdown timers working
- [ ] Venue comparison tool functional

**Performance:**
- [ ] Test on 3G network (throttled)
- [ ] Verify progressive rendering (content appears quickly)
- [ ] Check bundle sizes with analyzer
- [ ] Test offline mode (PWA)

**Accessibility:**
- [ ] Test with VoiceOver (iOS) and TalkBack (Android)
- [ ] Verify keyboard navigation works
- [ ] Check color contrast in light/dark mode
- [ ] Test with zoom at 200%

#### Beta Testing

**Approach:**
- Invite 20-30 users (mix of MLB, NFL, World Cup fans)
- Provide survey: 5-point scale on usability, accuracy, design
- Collect feedback on:
  - Data accuracy ("Did shade predictions match your experience?")
  - UI clarity ("Was it easy to find what you needed?")
  - Mobile UX ("How was the mobile experience?")
  - Feature requests ("What would make this better?")

**Success Criteria:**
- 80%+ positive feedback (4-5 stars)
- <5 critical bugs reported
- <10 feature requests (indicates we covered core needs)

---

## 8. Risk Mitigation Strategies

### Risk 1: Data Collection Difficulty

**Mitigation Plan:**

1. **Tiered Data Quality Approach**
   - Tier 1 (High-traffic stadiums): Manual research, photogrammetry, partnerships
   - Tier 2 (Medium-traffic): Official seating charts + reasonable estimates
   - Tier 3 (Low-traffic): Generic but accurate templates

2. **Acceptable Accuracy Thresholds**
   - Row elevation: ±1 foot (acceptable for shade calculations)
   - Section boundaries: ±5 feet
   - Seat positions: ±2 feet

3. **Progressive Data Improvement**
   - Ship with "good enough" data (80% accurate)
   - Use "Report Inaccuracy" feedback to refine
   - Update data incrementally based on user reports

4. **Fallback to Section-Level**
   - If row data unavailable for a stadium, show section-level only
   - Clearly label "Section-level estimate" vs "Row-level accuracy"

### Risk 2: Performance Degradation

**Mitigation Plan:**

1. **Aggressive Code Splitting**
   ```typescript
   // Only load stadium data when needed
   const stadiumData = await import(`@/data/sections/mlb/${stadiumId}.ts`);
   ```

2. **Web Worker Calculations**
   - Offload shade calculations to workers (non-blocking)
   - Show loading indicator during calculation
   - Progressive rendering (show partial results)

3. **Caching Strategy**
   - Cache seat-level results in IndexedDB (7-day expiry)
   - Cache API responses in service worker
   - Precompute shade for common game times

4. **Performance Budget**
   - Monitor bundle size in CI/CD
   - Fail builds if >300 KB initial bundle
   - Use Lighthouse CI to enforce metrics

5. **Fallback for Slow Devices**
   - Detect device capability (navigator.hardwareConcurrency)
   - Use lower LOD (Level of Detail) for weak devices
   - Offer "simplified view" toggle

### Risk 3: World Cup Timeline Pressure

**Mitigation Plan:**

1. **Phased World Cup Launch**
   - **April 2026**: Launch basic match schedule (MVP)
   - **May 2026**: Add venue comparison, country filters
   - **June 2026** (pre-tournament): Final polish, marketing push

2. **Parallel Development**
   - World Cup features developed in Phase 3 (parallel to UI work)
   - Can ship World Cup pages independently of MLB data completion

3. **MVP Scope**
   - **Must Have**: Match schedule, venue shade finder links
   - **Nice to Have**: Venue comparison, 3D stadium views
   - **Defer if Needed**: Multi-language support, advanced filters

4. **Content Pre-Production**
   - Write World Cup marketing copy now
   - Design graphics/assets in advance
   - Prepare SEO content for early indexing

### Risk 4: Testing Gaps

**Mitigation Plan:**

1. **Test-Driven Development**
   - Write tests BEFORE implementation
   - No PR merges without tests
   - Coverage threshold: 90% (fail CI if below)

2. **Automated Regression Testing**
   - Visual regression tests (Playwright screenshots)
   - Run on every PR
   - Alert on any UI changes

3. **Continuous Monitoring**
   - Error tracking (Sentry or similar)
   - Real User Monitoring (web-vitals)
   - Weekly review of production errors

4. **Beta Testing Program**
   - Recruit 20-30 users for early access
   - Collect feedback before public launch
   - Iterate based on real-world usage

### Risk 5: Competitive Landscape

**Mitigation Plan:**

1. **Speed to Market**
   - Launch Phase 1 (MLB data) ASAP (even if UI not perfect)
   - Iterate quickly based on feedback
   - Beat competitors to row-level accuracy

2. **Differentiation Through Quality**
   - Most accurate data (90%+ validated)
   - Best mobile UX (mobile-first design)
   - Transparent methodology (build trust)

3. **SEO Dominance**
   - Target keywords: "shaded seats [stadium name]"
   - Create unique content per stadium
   - Build backlinks (blog posts, social media)

4. **Network Effects**
   - User feedback improves data quality
   - "Report Inaccuracy" creates community contribution
   - Share buttons encourage viral growth

5. **Brand Trust**
   - Show "How it works" methodology
   - Display data freshness timestamps
   - Respond to user feedback quickly

---

## 9. Technical Constraints & Assumptions

### 9.1 Constraints

**Vercel Limits:**
- Serverless function timeout: 10 seconds (hobby), 60 seconds (pro)
- Edge function timeout: 30 seconds
- Bandwidth: 100 GB/month (hobby), 1 TB/month (pro)
- Build size: 50 MB compressed

**Implication:** Client-side calculations preferred; no heavy server processing.

**Browser Compatibility:**
- Target: Last 2 versions of Chrome, Firefox, Safari, Edge
- iOS: 14+
- Android: 10+

**Implication:** Can use modern JS (ES6+), Web Workers, IndexedDB. No IE11 support.

**Data Storage:**
- No database (file-based approach)
- Git repository size limit: ~1 GB (GitHub)

**Implication:** Keep section files reasonably sized; compress if needed.

**API Rate Limits:**
- Open-Meteo: 10,000 requests/day (free tier)

**Implication:** Cache weather data aggressively; consider paid tier if traffic increases.

### 9.2 Assumptions

**Data Accuracy:**
- ✅ Assume official seating charts are accurate within ±5 feet
- ✅ Assume photogrammetry estimates are acceptable for low-priority stadiums
- ✅ Assume user feedback will correct inaccuracies over time

**User Behavior:**
- ✅ Assume 80%+ users are on mobile devices
- ✅ Assume users primarily search for specific stadiums (not browsing all)
- ✅ Assume users care more about accuracy than speed (willing to wait 2-3s for results)

**Technology:**
- ✅ Assume Web Workers are available on target browsers (98%+ support)
- ✅ Assume IndexedDB is available for caching (95%+ support)
- ✅ Assume JavaScript is enabled (progressive enhancement not required)

**World Cup 2026:**
- ✅ Assume FIFA will provide official match schedule by March 2026
- ✅ Assume team assignments finalized by group stage (April 2026)
- ✅ Assume knockout brackets determined during tournament

**Business:**
- ✅ Assume no monetization required in v2 (defer to v3)
- ✅ Assume organic traffic is primary acquisition channel (no paid ads)
- ✅ Assume SEO will drive most World Cup traffic

---

## 10. Open Questions & Decisions

### Q1: Data Collection Method for MLB

**Question:** What is the most efficient way to collect row-level data for 30 MLB stadiums?

**Options:**
1. Manual curation from official seating charts (time-intensive, accurate)
2. Photogrammetry from stadium photos (faster, less accurate)
3. Partner with ticketing platforms for data access (scalable, uncertain availability)
4. Crowdsource from community (ongoing refinement)

**Recommendation:** Combination of #1 (official charts) + #2 (photogrammetry) for initial data, with #4 (community) for ongoing refinements. Explore #3 (partnerships) for long-term.

**Decision:** Approved - Use hybrid approach (manual + photogrammetry). Allocate 2-3 weeks in Phase 1 for data collection.

---

### Q2: 3D Stadium Preview Priority

**Question:** Should we build a 3D stadium preview in v2, or defer to v3?

**Options:**
1. Include in v2 (high effort, high value for visual learners)
2. Defer to v3 (reduce scope, focus on core features)
3. Prototype in v2, launch in v3 (validate user interest first)

**Recommendation:** Option 2 (Defer to v3). 2D diagrams are sufficient for MVP. 3D would require Three.js (~500 KB bundle increase) and significant development time (2+ weeks). Focus on core features first.

**Decision:** Deferred to v3. Revisit after Phase 2 completion based on user feedback.

---

### Q3: World Cup Match Data Source

**Question:** How do we keep World Cup match schedule accurate as teams are determined?

**Options:**
1. Manually update static data file (`matches.ts`) as tournament progresses
2. Integrate with FIFA official API (if available)
3. Scrape match data from trusted sources (ESPN, FIFA.com)

**Recommendation:** Start with #1 (manual updates) for group stage matches. Explore #2 (API) or #3 (scraping) for knockout rounds when teams are determined. Manual updates are acceptable for 104 matches (1-2 hour task per update).

**Decision:** Manual updates for v2. Assign one developer to monitor FIFA announcements and update `matches.ts` as needed (weekly during tournament).

---

### Q4: User Feedback Storage

**Question:** Where should we store user-submitted feedback ("Report Inaccuracy")?

**Options:**
1. Email to admin (simple but hard to track)
2. Database (PostgreSQL, Supabase) for structured storage
3. GitHub Issues (transparent, collaborative)
4. Airtable or Google Sheets (quick setup, easy review)

**Recommendation:** Option 4 (Airtable) for v2. Quick to set up, easy to review, low overhead. Migrate to #2 (database) in v3 if volume grows.

**Decision:** Approved - Use Airtable. Create form submissions API endpoint that writes to Airtable via REST API.

---

### Q5: Mobile App vs. PWA

**Question:** Should we build native mobile apps (iOS, Android) or rely on PWA?

**Options:**
1. PWA only (current approach, lower cost)
2. Native apps (better performance, app store discoverability)
3. Hybrid (React Native) - single codebase for both

**Recommendation:** Option 1 (PWA) for v2. PWA is sufficient for most use cases (offline support, installable, push notifications). Native apps require 4-6 weeks development + app store approval (1-2 weeks). Defer to v3 based on user demand.

**Decision:** PWA only for v2. Monitor user feedback for requests for native apps. Revisit in v3 planning.

---

## 11. Success Criteria Summary

### 11.1 Feature Completeness

✅ **MLB Row-Level Data**: 30/30 stadiums (100%)
✅ **MiLB Row-Level Data**: 30/120 stadiums (25% of top venues)
✅ **World Cup Features**: Match schedule (104 matches), venue comparison, country filters
✅ **UI Modernization**: Stadium diagrams, enhanced section cards, filter presets
✅ **Data Quality**: Validation tools, freshness tracking, user feedback system

### 11.2 Performance Metrics

✅ **Core Web Vitals**: All "Good" (LCP <2.5s, FID <100ms, CLS <0.1)
✅ **API Response Time**: <500ms (p95) for shade calculations
✅ **Bundle Size**: <300 KB initial, <100 KB per stadium (gzipped)
✅ **Test Coverage**: 90%+ (unit + integration tests)

### 11.3 User Engagement

✅ **Session Duration**: 3+ minutes (up from unknown)
✅ **Bounce Rate**: <40% (mobile)
✅ **World Cup Traffic**: 20% of total site traffic by June 2026
✅ **User Feedback**: 80%+ positive (via beta testing surveys)

### 11.4 SEO & Discoverability

✅ **Google Rankings**: Top 5 for "shaded seats [stadium]" (30 MLB keywords)
✅ **Organic Traffic**: 50% increase within 3 months of launch
✅ **Sitemap**: All 250+ venue pages indexed
✅ **Social Shares**: 100+ shares per month (via share buttons)

---

## 12. Next Steps

### Immediate Actions (Week 1)

1. **Review & Approve This Spec**
   - Stakeholder review
   - Address any questions/concerns
   - Finalize technical decisions

2. **Set Up Development Environment**
   - Create feature branch: `feature/world-cup-v2`
   - Configure CI/CD for data validation
   - Set up Lighthouse CI

3. **Begin Phase 1 (MLB Data Collection)**
   - Create validation tooling
   - Research data sources for top 10 MLB stadiums
   - Start data collection for Yankee Stadium (pilot)

4. **Plan Handoff**
   - Create detailed implementation tasks in plan.md
   - Assign to development team
   - Schedule weekly check-ins

### Long-Term Roadmap

**Q1 2026 (Jan-Mar):**
- Phase 1: MLB row-level data foundation
- Phase 2: UX/UI modernization begins

**Q2 2026 (Apr-Jun):**
- Phase 2: UX/UI completion
- Phase 3: World Cup feature completion (launch by April)
- **June 11, 2026**: World Cup 2026 begins 🎉

**Q3 2026 (Jul-Sep):**
- Phase 4: MiLB improvements, data quality monitoring
- Post-launch analysis, user feedback collection

**Q4 2026 (Oct-Dec):**
- v2.1 refinements based on feedback
- Plan v3 features (native apps, CMS, monetization)

---

## 13. Appendix

### 13.1 Reference Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Next.js App (React 18 + TypeScript)                      │  │
│  │                                                             │  │
│  │  Components:                                                │  │
│  │  - StadiumDiagram (SVG/Canvas)                            │  │
│  │  - SectionCards (with RowDetailView)                      │  │
│  │  - FilterBar (with presets)                               │  │
│  │  - WorldCupSchedule                                        │  │
│  │                                                             │  │
│  │  State Management:                                          │  │
│  │  - React Context (filters, game selection)                │  │
│  │  - Local Storage (user preferences)                       │  │
│  │  - IndexedDB (shade calculation cache)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Web Workers (Parallel Shade Calculations)                │  │
│  │  - OptimizedShadeCalculator3D                             │  │
│  │  - BVH ray tracing                                         │  │
│  │  - 4 worker threads                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Static Assets (CDN)                                       │  │
│  │  - Pre-rendered stadium pages                             │  │
│  │  - Code-split bundles (mlb.chunk.js, etc.)               │  │
│  │  - Optimized images (Sharp)                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Serverless Functions (API Routes)                        │  │
│  │  - /api/weather/[stadiumId]                               │  │
│  │  - /api/report-inaccuracy                                 │  │
│  │  - /api/stadium-validation/[stadiumId]                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  - Open-Meteo Weather API                                       │
│  - Airtable (user feedback storage)                            │
│  - Google Analytics (RUM, web vitals)                          │
└─────────────────────────────────────────────────────────────────┘

Data Layer (Build Time):
┌─────────────────────────────────────────────────────────────────┐
│  src/data/                                                       │
│  ├── sections/mlb/*.ts (30 files, row-level data)              │
│  ├── sections/nfl/*.ts (32 files, row-level data)              │
│  ├── sections/milb/*.ts (120+ files, mixed granularity)        │
│  ├── obstructions/mlb/*.ts (30 files, 3D models)               │
│  └── worldcup2026/matches.ts (104 matches)                     │
└─────────────────────────────────────────────────────────────────┘
```

### 13.2 Data Flow: Shade Calculation

```
User Input: Select Stadium + Game Time
           │
           ▼
┌─────────────────────────────────────────┐
│ 1. Load Stadium Data (Dynamic Import)  │
│    - Section geometry                   │
│    - 3D obstructions                    │
│    - Row details                        │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 2. Calculate Sun Position               │
│    - Use SunCalc library               │
│    - Lat/Long + DateTime → Azimuth/Elev │
│    - Account for timezone               │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 3. Fetch Weather Data (API)            │
│    - Open-Meteo API                     │
│    - Cloud cover, precipitation         │
│    - Adjust sun exposure accordingly    │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 4. 3D Ray Tracing (Web Worker)         │
│    - For each seat:                     │
│      - Cast ray from seat to sun       │
│      - Check BVH for intersections     │
│      - Determine if obstructed          │
│    - Parallel processing (4 workers)    │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 5. Aggregate Results                    │
│    - Section shade % (avg of rows)     │
│    - Row shade % (avg of seats)        │
│    - Individual seat shade (if needed) │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 6. Cache Results                        │
│    - IndexedDB (7-day expiry)          │
│    - Key: stadiumId + gameTime + weather│
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 7. Render UI                            │
│    - Stadium diagram (color-coded)     │
│    - Section cards (sorted by shade)   │
│    - Row details (expandable)          │
└─────────────────────────────────────────┘
```

### 13.3 File Size Estimates

**MLB Section Data (per stadium):**
- 60-100 sections
- 20-30 rows per section
- ~1,200-3,000 row entries
- Estimated file size: 30-50 KB (uncompressed), 8-12 KB (gzipped)

**MLB Obstruction Data (per stadium):**
- 5-15 obstructions (roof, upper deck, scoreboards)
- 3D mesh data (vertices, faces)
- Estimated file size: 15-30 KB (uncompressed), 4-8 KB (gzipped)

**Total MLB Data:**
- 30 stadiums × (40 KB sections + 20 KB obstructions) = ~1.8 MB (uncompressed)
- Gzipped: ~450 KB
- **Per-stadium chunk (lazy loaded):** ~20 KB gzipped ✅ Well under 100 KB target

**Initial Bundle (without stadium data):**
- React + Next.js: ~80 KB (gzipped)
- Tailwind CSS: ~20 KB (purged)
- SunCalc + date-fns: ~15 KB
- Custom components: ~50 KB
- **Total:** ~165 KB ✅ Well under 300 KB target

### 13.4 Validation Script Example

```typescript
// scripts/validate-stadium-data.ts
import { DetailedSection } from '../src/types/stadium-complete';

interface ValidationResult {
  stadiumId: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  coverage: {
    sections: number;
    rowsTotal: number;
    obstructions: number;
    geometryComplete: boolean;
  };
}

export async function validateStadium(stadiumId: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    stadiumId,
    valid: true,
    errors: [],
    warnings: [],
    coverage: { sections: 0, rowsTotal: 0, obstructions: 0, geometryComplete: true }
  };

  try {
    // Load section data
    const module = await import(`../src/data/sections/mlb/${stadiumId}.ts`);
    const sections: DetailedSection[] = module.default || module[`${stadiumId}Sections`];

    if (!sections || sections.length === 0) {
      result.errors.push('No sections found');
      result.valid = false;
      return result;
    }

    result.coverage.sections = sections.length;

    // Validate each section
    sections.forEach((section, idx) => {
      // Check required fields
      if (!section.id) result.errors.push(`Section ${idx}: Missing ID`);
      if (!section.rows || section.rows.length === 0) {
        result.errors.push(`Section ${section.id}: No rows defined`);
      }

      // Check 3D geometry
      if (!section.vertices3D || section.vertices3D.length < 3) {
        result.warnings.push(`Section ${section.id}: Insufficient vertices (need 3+)`);
        result.coverage.geometryComplete = false;
      }

      // Check row data integrity
      section.rows?.forEach((row, rowIdx) => {
        result.coverage.rowsTotal++;

        // Elevation should increase with row number
        if (rowIdx > 0 && row.elevation <= section.rows![rowIdx - 1].elevation) {
          result.warnings.push(
            `Section ${section.id}, Row ${row.rowNumber}: Elevation not increasing`
          );
        }

        // Depth should increase with row number
        if (rowIdx > 0 && row.depth <= section.rows![rowIdx - 1].depth) {
          result.warnings.push(
            `Section ${section.id}, Row ${row.rowNumber}: Depth not increasing`
          );
        }
      });
    });

    // Load obstruction data
    try {
      const obstructionModule = await import(
        `../src/data/obstructions/mlb/${stadiumId}-obstructions.ts`
      );
      const obstructions = obstructionModule.default || [];
      result.coverage.obstructions = obstructions.length;
    } catch (e) {
      result.warnings.push('No obstruction data found');
    }

    // Check for duplicate section IDs
    const sectionIds = sections.map(s => s.id);
    const duplicates = sectionIds.filter((id, idx) => sectionIds.indexOf(id) !== idx);
    if (duplicates.length > 0) {
      result.errors.push(`Duplicate section IDs: ${duplicates.join(', ')}`);
      result.valid = false;
    }

  } catch (error) {
    result.errors.push(`Failed to load stadium data: ${error}`);
    result.valid = false;
  }

  if (result.errors.length > 0) result.valid = false;

  return result;
}

// CLI usage: npx ts-node scripts/validate-stadium-data.ts yankee-stadium
if (require.main === module) {
  const stadiumId = process.argv[2];
  if (!stadiumId) {
    console.error('Usage: validate-stadium-data.ts <stadiumId>');
    process.exit(1);
  }

  validateStadium(stadiumId).then(result => {
    console.log('\n=== Validation Report ===');
    console.log(`Stadium: ${result.stadiumId}`);
    console.log(`Status: ${result.valid ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`\nCoverage:`);
    console.log(`  Sections: ${result.coverage.sections}`);
    console.log(`  Rows: ${result.coverage.rowsTotal}`);
    console.log(`  Obstructions: ${result.coverage.obstructions}`);
    console.log(`  Geometry Complete: ${result.coverage.geometryComplete ? 'Yes' : 'No'}`);

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(err => console.log(`  - ${err}`));
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warn => console.log(`  - ${warn}`));
    }

    process.exit(result.valid ? 0 : 1);
  });
}
```

---

## Document Status

**Status:** ✅ Complete - Ready for Planning Phase
**Next Step:** Create detailed implementation plan in `plan.md`
**Approvals Required:** Product Owner, Engineering Lead

---

*End of Technical Specification Document*
