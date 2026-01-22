# Product Requirements Document (PRD)
## 2026 Row-Level Sun Calculations & World Cup Feature Expansion

**Project**: TheStadium.com Enhancement
**Version**: 2.0 (CORRECTED)
**Date**: January 22, 2026
**Status**: Draft - Awaiting Approval
**World Cup Deadline**: June 11, 2026 (139 days / 4.6 months)

---

## EXECUTIVE SUMMARY

### Current State (Audit Findings - January 2026)

**What Actually Exists:**
- ✅ **Row-level data POPULATED**: 213 section files with `generateRows()` function, ~240,000 row records
- ✅ **Row data types**: Complete `RowDetail` interface with elevation, depth, covered fields
- ✅ **99% stadium coverage**: MLB (61%), NFL (100%), MiLB (99%) have row data in TypeScript files
- ✅ **91 React components**: Well-architected UI with filters, virtual scrolling, mobile optimization

**What Does NOT Work:**
- ❌ **Sun calculator ignores row data**: Still calculates at section-level only
- ❌ **No row-level UI**: Zero components display row-by-row breakdowns
- ❌ **Zero World Cup data**: No 2026 FIFA venues, matches, or soccer configurations
- ❌ **No multi-language**: English only, no Spanish/French for international visitors

**Critical Finding**: Infrastructure is 40% complete (data exists), but calculation engine and UI are 0% complete.

### The Problem

**Row-Level Gap:**
Users get section averages (e.g., "Section 114: 65% shade") when reality is:
- Front rows (A-M): 95% shade (perfect)
- Back rows (N-Z): 5% shade (full sun exposure)

This creates poor seat selection and user dissatisfaction.

**World Cup Gap:**
2026 FIFA World Cup (June 11 - July 19, 2026) is **139 days away**:
- 16 host stadiums (11 already NFL stadiums in database, 5 need full data entry)
- 104 matches across USA, Canada, Mexico
- 5+ million expected attendees
- **ZERO current coverage** on TheStadium.com

### Success Criteria

**Must Launch Before World Cup Ticketing (Target: April 1, 2026 - 69 days)**:
1. Row-level sun calculator operational for all existing stadiums
2. All 16 World Cup venues with row-level data
3. World Cup match schedule integrated
4. Multi-language support (English, Spanish, French)
5. Performance maintained (<2s page load, Lighthouse ≥90)

**Business Impact:**
- Capture World Cup traffic (millions of international visitors)
- First-to-market row-level precision
- SEO dominance for "2026 World Cup stadium shade" keywords

---

## 1. DETAILED CURRENT STATE ANALYSIS

### 1.1 Existing Row-Level Data Implementation

**Location**: `/src/data/sections/{sport}/{stadium}.ts`

**File Structure Example** (`yankees.ts`, 1,229 lines):
```typescript
import { DetailedSection, RowDetail } from '../../../types/stadium-complete';

function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.5;  // feet per row rise
  const rowDepth = 2.8;   // feet per row depth

  for (let i = startCode; i <= endCode; i++) {
    rows.push({
      rowNumber: String.fromCharCode(i),
      seats: seatsPerRow - Math.floor(rowNum * 0.2),
      elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
      depth: rowNum * rowDepth,
      covered: covered,
      overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
    });
  }
  return rows;
}

export const yankeesStadiumSections: DetailedSection[] = [
  {
    id: '114B',
    name: 'Section 114B',
    level: 'field',
    baseAngle: 350,
    angleSpan: 10,
    rows: generateRows('A', 'Z', 18, 8, 25, false), // ← Row data exists
    // ... more fields
  },
  // ... 81 more sections
];
```

**Data Coverage Audit**:
- **MLB**: 36/59 files (61%) have `generateRows()` - Examples: Yankees, Dodgers, Cubs, Red Sox
- **NFL**: 33/33 files (100%) - All NFL stadiums including 11 World Cup venues
- **MiLB**: 120/121 files (99%) - Nearly complete minor league coverage

**Total Row Records**: ~240,000 rows across all stadiums

**File Sizes**:
- Stadium WITH row data: `yankees.ts` = 1,229 lines, ~27KB
- Stadium WITHOUT row data: `george-m-steinbrenner-field.ts` = 718 lines, ~16KB
- **Increase**: +70% file size with row data (~11KB per MLB stadium)

### 1.2 Sun Calculator Current Behavior

**File**: `/src/utils/sunCalculator.ts` (477 lines)

**Current Interface (Section-Level Only)**:
```typescript
interface Section {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  angle?: number;
  depth?: number;     // ← Single depth for entire section
  covered?: boolean;  // ← Binary: all or nothing
  // NO rows: RowDetail[] property
}

interface ShadowData {
  sectionId: string;
  coverage: number;        // Single % for entire section
  inShadow: boolean;
  shadowSources: {
    roof: number;
    upperDeck: number;
    bowl: number;
  };
  sunExposure: number;     // Single % for entire section
}
```

**Calculation Method** (`calculateSectionShadow()`, lines 197-262):
1. Check if `section.covered === true` → return 0% sun
2. Calculate section angle relative to sun
3. Calculate base sun exposure (0-100%) using angular difference
4. Apply altitude factor (low sun = less exposure)
5. Calculate shadow from roof, upper deck, bowl
6. Return **single coverage percentage**

**What's Missing**:
- No parsing of `section.rows[]` array
- No elevation adjustments based on row height
- No depth-based overhang shadow calculations
- No per-row `covered` flag handling
- No iteration over rows

**Evidence**: Searched codebase for `row.elevation`, `row.depth`, `row.covered` - **ZERO matches** in `sunCalculator.ts`.

### 1.3 UI Component Audit

**Total Components**: 91 TypeScript/TSX files in `/src/components`

**Relevant Existing Components**:
- `SectionResults.tsx` - Displays section list (section-level only)
- `EnhancedSunFilter.tsx` - Filters by shade, price, level (no row filters)
- `SectionAccordion.tsx` - Expandable section details (no row breakdown)
- `SunExposureBadge.tsx` - Shows shade percentage (section average)
- `LazySectionCardModern.tsx` - Section cards (no row detail)

**Components That Reference Rows But Don't Use Them**:
- `SeatRecommendationEngine.tsx` (lines 6-38):
  - Imports `RowDetail` type
  - Has `bestRows?: number[]` field in interface
  - **Never populated** - recommendations are section-level only

**Missing Row-Level UI**:
- No `RowBreakdownView` component (table of rows)
- No `RowFilterBar` component (filter by row shade)
- No `RowComparisonTool` component (compare rows across sections)
- No `RowShadeGradient` component (visual row-by-row gradient)
- No row-specific badges or indicators

### 1.4 World Cup & Soccer Current State

**FIFA 2026 World Cup Coverage**: **ZERO**

**Missing Data**:
1. **Match Schedule**: No 2026 FIFA World Cup match data
2. **16 Venues**: No soccer-specific configurations
3. **Soccer Field Geometry**: No rectangular field models
4. **Section Mapping**: No NFL→Soccer section ID mapping for dual-use stadiums

**World Cup Venues Required** (16 total):

**USA (11 stadiums - 10 already in DB as NFL, 1 needs data)**:
1. MetLife Stadium (East Rutherford, NJ) - ✅ In DB as NFL
2. SoFi Stadium (Los Angeles, CA) - ✅ In DB as NFL
3. AT&T Stadium (Dallas, TX) - ✅ In DB as NFL
4. Mercedes-Benz Stadium (Atlanta, GA) - ✅ In DB as NFL
5. Arrowhead Stadium (Kansas City, MO) - ✅ In DB as NFL
6. Hard Rock Stadium (Miami, FL) - ✅ In DB as NFL
7. Lincoln Financial Field (Philadelphia, PA) - ✅ In DB as NFL
8. Levi's Stadium (San Francisco, CA) - ✅ In DB as NFL
9. Gillette Stadium (Foxborough, MA) - ✅ In DB as NFL
10. NRG Stadium (Houston, TX) - ✅ In DB as NFL
11. Lumen Field (Seattle, WA) - ✅ In DB as NFL

**Mexico (3 stadiums - ALL need data entry)**:
12. Estadio Azteca (Mexico City) - ❌ NOT in DB
13. Estadio Akron (Guadalajara) - ❌ NOT in DB
14. Estadio BBVA (Monterrey) - ❌ NOT in DB

**Canada (2 stadiums - ALL need data entry)**:
15. BC Place (Vancouver) - ❌ NOT in DB
16. BMO Field (Toronto) - ❌ NOT in DB

**Multi-Language Support**: ZERO
- No i18n framework (next-intl or react-i18next)
- All UI labels hardcoded in English
- No translation files

### 1.5 Performance & Data Size

**Current Metrics**:
- `venues.json`: 170KB (6,487 lines)
- Page load time: ~1.8s average (Lighthouse: ~95)
- Component count: 91 files

**With Row-Level Calculations (Projected)**:
- Row records: 240,000+ (already in TypeScript, not in JSON)
- Calculation volume: 37x increase (3,000 rows vs 80 sections per stadium)
- Risk: UI blocking if calculations on main thread
- Mitigation: Web Worker, pre-calculation, caching

---

## 2. PROBLEM STATEMENT (VALIDATED)

### 2.1 Row-Level Accuracy Gap (CONFIRMED)

**Real Example** (Yankee Stadium Section 114B):
- **Current display**: "Section 114B: 65% shade"
- **Reality with row-level data**:
  - Rows A-G: 5-10% sun (excellent shade)
  - Rows H-M: 30-50% sun (partial shade)
  - Rows N-Z: 80-100% sun (full exposure)

**User Impact**:
- User books "shaded section" expecting consistent shade
- Arrives at game, back rows in full sun
- Children get sunburned, family unhappy
- Negative reviews, lost trust

**Business Impact**:
- Lower user satisfaction
- Reduced return visits
- Competitive disadvantage (if competitor adds row-level first)

### 2.2 World Cup Market Opportunity (URGENT)

**2026 FIFA World Cup Timeline**:
- **June 11, 2026**: First match (139 days from today)
- **July 19, 2026**: Final (179 days from today)
- **Ticketing**: Already open or opening soon (FIFA typically sells tickets 3-6 months before)

**Traffic Opportunity**:
- 5+ million attendees expected
- Millions more researching online
- International audience (Spanish, French speakers)
- High-intent users (ticket buyers, not browsers)

**Current State**: TheStadium.com has ZERO World Cup content
- Competitors may launch shade tools first
- Missing SEO opportunity ("2026 World Cup stadium shade")
- No revenue from affiliate links, ads, partnerships

**Risk**: If we don't launch by April 2026, miss primary ticketing window.

---

## 3. GOALS & SUCCESS METRICS

### 3.1 Primary Goals

**Goal 1: Activate Existing Row-Level Data**
- Connect existing 240,000 row records to sun calculation engine
- Build UI to display row-by-row breakdowns
- Success: Every section shows per-row shade percentages

**Goal 2: Launch World Cup Support Before Ticketing Peak**
- Target: April 1, 2026 (69 days from today)
- All 16 World Cup venues with row-level data
- Match schedule integrated
- Multi-language support (EN, ES, FR)

**Goal 3: Maintain Performance**
- Page load <2s after row-level calculations
- Lighthouse Performance ≥90
- No UI blocking during calculations

### 3.2 Key Performance Indicators (KPIs)

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Row-level calculation | 0% functional | 100% functional | 6 weeks |
| World Cup venues | 0 of 16 | 16 of 16 | 8 weeks |
| Multi-language | English only | EN + ES + FR | 8 weeks |
| Page load time | 1.8s | <2.0s | Maintain |
| Lighthouse score | 95 | ≥90 | Maintain |
| World Cup traffic | 0 | 100k+ page views | By June 2026 |

### 3.3 Non-Goals (Out of Scope for V1)

- ❌ 3D stadium visualization (types exist but not building renderer)
- ❌ Real-time weather integration (future phase)
- ❌ Ticket purchasing (affiliate links only)
- ❌ User accounts / saved preferences
- ❌ Database migration (keeping static files)
- ❌ Individual seat-level precision (row-level sufficient)
- ❌ MLS or other soccer leagues beyond World Cup

---

## 4. USER STORIES & REQUIREMENTS

### 4.1 Core User Personas

**Persona 1: The Shade Seeker** (Current pain point)
- Family with young children
- Needs: Identify specific shaded rows, not section averages
- Current problem: Books "shaded section", kids still get sunburned in back rows

**Persona 2: The Budget-Conscious Fan** (New capability)
- Wants best value seats
- Needs: Find affordable back rows that are shaded (avoid premium front row prices)
- Current problem: Can't filter by row-level shade + price

**Persona 3: The World Cup Tourist** (New persona - URGENT)
- International visitor attending 2026 World Cup
- Needs: Shade info for unfamiliar stadiums, multi-language support
- Current problem: TheStadium.com has ZERO World Cup content

### 4.2 User Stories - Row-Level (HIGH PRIORITY)

**US-001: View Row-Level Shade Breakdown**
```
As a ticket buyer
I want to see shade percentages for individual rows
So that I can choose a specific row with my desired sun exposure
```
**Acceptance Criteria**:
- Expand section to see row-by-row table
- Display: Row | Seats | Shade % | Sun %
- Visual gradient (blue=shade, yellow=sun)
- Mobile-responsive (collapsible)

**US-002: Filter Sections by Row Availability**
```
As a shade seeker
I want to filter sections with at least 5 rows >80% shade
So that I have multiple row options in desired sections
```
**Acceptance Criteria**:
- Filter: "Has rows with >80% shade"
- Filter: "Has rows with <20% shade"
- Show count: "Section 114: 8 rows meet criteria"

**US-003: Get Row-Specific Recommendations**
```
As a first-time user
I want the system to recommend specific rows
So that I don't need to analyze 80 sections × 30 rows = 2,400 rows
```
**Acceptance Criteria**:
- Input: Shade preference, budget, level preference
- Output: "Best for you: Section 114, Rows A-H (95% shade, Moderate price)"
- Show 3-5 top recommendations

### 4.3 User Stories - World Cup (CRITICAL - URGENT)

**US-101: Browse World Cup Stadiums**
```
As a World Cup attendee
I want to see all 16 World Cup venues with shade data
So that I can plan ticket purchases
```
**Acceptance Criteria**:
- Dedicated `/world-cup-2026` landing page
- List 16 venues with country, city, capacity
- Filter by country (USA, Mexico, Canada)
- Show "Next match" for each venue

**US-102: View World Cup Match Schedule with Shade**
```
As a World Cup ticket holder
I want to see shade info for my specific match date/time
So that I can prepare for weather conditions
```
**Acceptance Criteria**:
- Import 2026 FIFA match schedule
- Display match kickoff time (local timezone)
- Pre-calculate shade at kickoff, halftime, end of match
- Show teams, round, venue

**US-103: Multi-Language Support**
```
As an international visitor
I want to view content in Spanish or French
So that I can understand stadium information
```
**Acceptance Criteria**:
- Language selector (EN, ES, FR)
- Translate UI labels, navigation, filters
- Translate stadium guides (key sections)
- Preserve language preference (localStorage)

---

## 5. FUNCTIONAL REQUIREMENTS

### 5.1 Row-Level Sun Calculation Engine (CRITICAL PATH)

**FR-001: Enhance Sun Calculator for Row-Level**

**Current Function Signature**:
```typescript
calculateSectionShadow(
  section: Section,
  sunAltitude: number,
  sunAzimuth: number
): ShadowData
```

**New Function Signature**:
```typescript
calculateRowShadows(
  section: DetailedSection,  // ← Now expects rows: RowDetail[]
  sunAltitude: number,
  sunAzimuth: number
): SectionShadowData {
  sectionId: string;
  rows: RowShadowData[];     // ← Per-row results
  averageCoverage: number;   // ← For filtering
}

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
    overhang: number;        // ← NEW
    bowl: number;
  };
}
```

**Algorithm (Per-Row)**:
```typescript
function calculateRowShadow(
  row: RowDetail,
  section: DetailedSection,
  sunAltitude: number,
  sunAzimuth: number
): RowShadowData {

  // 1. If row explicitly covered, return 0% sun
  if (row.covered === true) {
    return { ...row, sunExposure: 0, coverage: 100, inShadow: true };
  }

  // 2. Calculate 3D position of row
  const rowPosition = {
    x: section.basePosition.x + (row.depth * Math.cos(section.baseAngle)),
    y: section.basePosition.y + (row.depth * Math.sin(section.baseAngle)),
    z: row.elevation
  };

  // 3. Calculate base sun exposure (same as section-level)
  let baseSunExposure = calculateBaseSunExposure(section.baseAngle, sunAzimuth);

  // 4. Apply altitude factor
  if (sunAltitude < 30) {
    baseSunExposure *= (sunAltitude / 30);
  }

  // 5. Calculate overhang shadow (depth-dependent)
  const overhangShadow = calculateOverhangShadow(
    row.depth,
    row.overhangHeight,
    sunAltitude
  );

  // 6. Calculate upper deck shadow (elevation + depth dependent)
  const upperDeckShadow = calculateUpperDeckShadowForRow(
    row.elevation,
    row.depth,
    section.level,
    sunAltitude,
    sunAzimuth
  );

  // 7. Combine shadow sources
  const totalCoverage = Math.min(100, overhangShadow + upperDeckShadow);
  const finalSunExposure = Math.max(0, baseSunExposure * (1 - totalCoverage / 100));

  return {
    rowNumber: row.rowNumber,
    seats: row.seats,
    elevation: row.elevation,
    depth: row.depth,
    coverage: totalCoverage,
    sunExposure: finalSunExposure,
    inShadow: finalSunExposure < 50,
    shadowSources: {
      roof: 0,
      upperDeck: upperDeckShadow,
      overhang: overhangShadow,
      bowl: 0
    }
  };
}
```

**Performance Target**: Calculate 3,000 rows (full stadium) in <100ms

**Implementation Location**: `/src/utils/sunCalculator.ts` (extend existing class)

---

**FR-002: Overhang Shadow Calculation (NEW)**

**Purpose**: Calculate shadow cast by upper deck overhang on lower/field rows based on depth

**Algorithm**:
```typescript
function calculateOverhangShadow(
  rowDepth: number,          // Distance from section front
  overhangHeight: number,    // Height of overhang above row
  sunAltitude: number        // Sun angle in degrees
): number {
  // If no overhang, no shadow
  if (!overhangHeight || overhangHeight <= 0) return 0;

  // Calculate shadow length cast by overhang
  const shadowLength = overhangHeight / Math.tan(sunAltitude * Math.PI / 180);

  // If row is within shadow length, calculate coverage
  if (rowDepth <= shadowLength) {
    // Full coverage if deep under overhang
    return 100;
  } else if (rowDepth <= shadowLength * 1.5) {
    // Partial coverage for transition zone
    const transition = (shadowLength * 1.5 - rowDepth) / (shadowLength * 0.5);
    return Math.max(0, transition * 100);
  }

  return 0; // Beyond shadow reach
}
```

**Test Cases**:
- Row depth 0ft, overhang 30ft, sun 45° → 100% coverage (front row fully shaded)
- Row depth 50ft, overhang 30ft, sun 45° → 0% coverage (back row no shade)
- Row depth 25ft, overhang 30ft, sun 30° → 50% coverage (transition zone)

---

**FR-003: Row-Level API Endpoint**

**New Endpoint**: `/api/stadium/[stadiumId]/rows/shade`

**Request**:
```typescript
GET /api/stadium/yankees/rows/shade?date=2026-06-15&time=14:00
```

**Response**:
```json
{
  "stadium": "yankees",
  "date": "2026-06-15",
  "time": "14:00",
  "sections": [
    {
      "sectionId": "114B",
      "averageCoverage": 65,
      "rows": [
        {
          "rowNumber": "A",
          "seats": 18,
          "elevation": 8.0,
          "depth": 0,
          "sunExposure": 5,
          "coverage": 95,
          "inShadow": true
        },
        {
          "rowNumber": "B",
          "seats": 18,
          "elevation": 10.5,
          "depth": 2.8,
          "sunExposure": 8,
          "coverage": 92,
          "inShadow": true
        },
        // ... rows C-Z
        {
          "rowNumber": "Z",
          "seats": 14,
          "elevation": 70.5,
          "depth": 72.8,
          "sunExposure": 95,
          "coverage": 5,
          "inShadow": false
        }
      ]
    }
    // ... more sections
  ]
}
```

**Caching**: 3600s (1 hour) server-side, 86400s (24 hours) SWR

---

### 5.2 Row-Level UI Components (CRITICAL PATH)

**FR-201: RowBreakdownView Component**

**Location**: `/src/components/RowBreakdownView.tsx` (NEW FILE)

**Props**:
```typescript
interface RowBreakdownViewProps {
  sectionId: string;
  rows: RowShadowData[];
  date: string;
  time: string;
}
```

**Desktop Layout**:
```
┌─────────────────────────────────────────────────┐
│ Section 114B - Row Breakdown (2:00 PM)          │
├─────┬───────┬───────────┬─────────┬─────────────┤
│ Row │ Seats │ Elevation │ Shade % │ Recommendation│
├─────┼───────┼───────────┼─────────┼─────────────┤
│  A  │  18   │   8 ft    │ ████░ 95% │ ☂️ Excellent│
│  B  │  18   │  11 ft    │ ████░ 92% │ ☂️ Excellent│
│  C  │  18   │  13 ft    │ ████░ 88% │ ☂️ Good     │
│  D  │  18   │  16 ft    │ ███░░ 82% │ ☂️ Good     │
│  ...│  ...  │   ...     │   ...    │    ...      │
│  Z  │  14   │  71 ft    │ ░░░░░  5% │ ☀️ Full Sun │
└─────┴───────┴───────────┴─────────┴─────────────┘

[Sort by: Row ▼] [Filter: >80% shade]
```

**Mobile Layout** (Collapsible):
```
Section 114B - Row Breakdown
▼ Rows A-E (5 rows shown, 21 more)

  Row A: 95% shade | 18 seats | ☂️ Excellent
  Row B: 92% shade | 18 seats | ☂️ Excellent
  Row C: 88% shade | 18 seats | ☂️ Good
  Row D: 82% shade | 18 seats | ☂️ Good
  Row E: 78% shade | 18 seats | ☂️ Good

  [Show all 26 rows]
```

**Features**:
- Sort by row number or shade percentage
- Filter: "Show only rows with >X% shade"
- Color coding: Blue (shade), Yellow (sun)
- Virtual scrolling (for sections with 50+ rows)

---

**FR-202: Enhanced Section Card with Row Summary**

**Modify**: `/src/components/LazySectionCardModern.tsx`

**Before** (Section-level):
```
┌──────────────────────────┐
│ Section 114B             │
│ Average Shade: 65%       │
│ Price: Moderate          │
│ [View Details]           │
└──────────────────────────┘
```

**After** (Row summary):
```
┌──────────────────────────┐
│ Section 114B             │
│ ☂️ Rows A-M: 80-95% shade│
│ ☀️ Rows N-Z: 5-30% sun   │
│ Price: Moderate • 26 rows│
│ [View Row Details ▼]     │
└──────────────────────────┘
```

**Click "View Row Details"** → Expand inline `RowBreakdownView`

---

**FR-203: Row-Level Filters**

**Modify**: `/src/components/EnhancedSunFilter.tsx`

**Add New Filters**:
```typescript
interface FilterOptions {
  // Existing
  shadeLevel: 'excellent' | 'good' | 'partial' | 'sun';
  priceRange: string[];
  levels: string[];

  // NEW
  hasRowsWithShade: boolean;     // "Has rows with >80% shade"
  hasRowsWithSun: boolean;       // "Has rows with <20% shade"
  minShadeRows: number;          // "At least X rows meet criteria"
}
```

**UI**:
```
Shade Filters:
☐ Has rows with excellent shade (>80%)
☐ Has rows with full sun (<20%)

Minimum rows: [5▼] rows meeting criteria
```

**Filter Logic**:
```typescript
function filterSections(sections: SectionWithRows[], filters: FilterOptions) {
  return sections.filter(section => {
    if (filters.hasRowsWithShade) {
      const shadeRows = section.rows.filter(row => row.coverage >= 80);
      if (shadeRows.length < filters.minShadeRows) return false;
    }

    if (filters.hasRowsWithSun) {
      const sunRows = section.rows.filter(row => row.sunExposure >= 80);
      if (sunRows.length < filters.minShadeRows) return false;
    }

    return true;
  });
}
```

---

### 5.3 World Cup Features (URGENT - CRITICAL PATH)

**FR-101: World Cup Venue Database**

**Create**: `/src/data/worldcup2026/`

**Structure**:
```
/src/data/worldcup2026/
  venues.ts         ← 16 World Cup stadiums
  matches.ts        ← Match schedule
  sectionMappings.ts ← NFL→Soccer mappings for dual-use
```

**Venue Data Schema**:
```typescript
interface WorldCupVenue {
  id: string;                      // "metlife-stadium-wc"
  fifaName: string;                // "New York New Jersey Stadium"
  commonName: string;              // "MetLife Stadium"
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';
  latitude: number;
  longitude: number;
  timezone: string;
  capacity: number;
  soccerCapacity: number;          // Different from NFL

  // Link to NFL stadium if dual-use
  nflStadiumId?: string;           // "metlife-stadium"
  sectionMapping?: {               // NFL ID → Soccer name
    [nflSectionId: string]: string;
  };

  // Soccer-specific
  fieldOrientation: number;        // Degrees from north
  fieldDimensions: {
    length: number;                // 105-110 meters
    width: number;                 // 68-75 meters
  };

  // Row-level data
  sections: DetailedSection[];
}
```

**Implementation Steps**:
1. **Week 1**: Add 11 existing NFL stadiums as World Cup venues (duplicate with `-wc` suffix)
2. **Week 2**: Gather data for 5 new stadiums (Estadio Azteca, Akron, BBVA, BC Place, BMO Field)
3. **Week 3**: Create section mappings for dual-use stadiums
4. **Week 4**: Populate row-level data for 5 new stadiums

---

**FR-102: World Cup Match Schedule**

**File**: `/src/data/worldcup2026/matches.ts`

**Data Source**: FIFA official schedule (manual entry or API if available)

**Schema**:
```typescript
interface WorldCupMatch {
  matchId: string;               // "wc2026-001"
  date: string;                  // "2026-06-11" (ISO 8601)
  kickoffTime: string;           // "17:00" (local time)
  venue: string;                 // Stadium ID
  round: 'Group Stage' | 'Round of 16' | 'Quarterfinal' | 'Semifinal' | 'Final';
  group?: string;                // "Group A" (if group stage)
  teamA: string;                 // "Mexico" or "TBD"
  teamB: string;                 // "USA" or "TBD"
  tvChannels?: string[];         // ["FOX", "Telemundo"]
}

export const worldCup2026Matches: WorldCupMatch[] = [
  {
    matchId: "wc2026-001",
    date: "2026-06-11",
    kickoffTime: "17:00",
    venue: "estadio-azteca-wc",
    round: "Group Stage",
    group: "Group A",
    teamA: "Mexico",
    teamB: "TBD",
    tvChannels: ["FOX", "Telemundo"]
  },
  // ... 103 more matches
];
```

**Total Matches**: 104 (48 team format)

**Data Entry Timeline**: Week 5-6 (manual entry of 104 matches)

---

**FR-103: World Cup Landing Page**

**Create**: `/app/world-cup-2026/page.tsx` (NEW)

**URL**: `https://thestadium.com/world-cup-2026`

**Content Structure**:

```
═══════════════════════════════════════════════
⚽ 2026 FIFA WORLD CUP SHADE GUIDE
═══════════════════════════════════════════════

Find the perfect seats at all 16 North American
World Cup venues with row-level shade precision.

[Browse Stadiums] [View Schedule] [Plan My Matches]

───────────────────────────────────────────────

🏟️ World Cup Venues (16)

Filter by: [All Countries ▼] [Show Map]

USA (11 stadiums)
├─ MetLife Stadium (East Rutherford, NJ) - 7 matches
├─ SoFi Stadium (Los Angeles, CA) - 8 matches
├─ AT&T Stadium (Dallas, TX) - 9 matches
└─ ... 8 more

Mexico (3 stadiums)
├─ Estadio Azteca (Mexico City) - 5 matches
├─ Estadio Akron (Guadalajara) - 4 matches
└─ Estadio BBVA (Monterrey) - 4 matches

Canada (2 stadiums)
├─ BC Place (Vancouver) - 7 matches
└─ BMO Field (Toronto) - 6 matches

───────────────────────────────────────────────

📅 Upcoming Matches

Jun 11, 2026 - 5:00 PM
🇲🇽 Mexico vs TBD
Estadio Azteca, Mexico City
[View Shade Guide]

Jun 12, 2026 - 3:00 PM
🇺🇸 USA vs TBD
SoFi Stadium, Los Angeles
[View Shade Guide]

[View Full Schedule (104 matches)]

───────────────────────────────────────────────

🌐 Language: [English ▼]
Español | Français
```

**SEO Requirements**:
- Title: "2026 FIFA World Cup Stadium Shade Guide | TheStadium.com"
- Description: "Find shaded seats at all 16 World Cup 2026 stadiums. Row-level sun exposure data for every match."
- Keywords: "2026 World Cup tickets shade", "FIFA 2026 stadium sun", "World Cup seating guide"
- Open Graph image: World Cup branded graphic

---

**FR-104: Multi-Language Support (i18n)**

**Framework**: `next-intl` (Next.js recommended)

**Installation**:
```bash
npm install next-intl
```

**Languages**:
1. **English** (primary)
2. **Spanish** (for Mexico, USA Hispanic population)
3. **French** (for Canada, international visitors)

**Translation Scope**:

**100% Translated** (Core UI):
- Navigation labels
- Filter labels
- Button text
- Error messages
- Form labels

**50% Translated** (Stadium Guides):
- Key paragraphs (parking, concessions, tips)
- Section descriptions
- Stadium history summaries

**NOT Translated**:
- Stadium names (proper nouns)
- Section IDs (e.g., "Section 114B")
- Blog posts (English only for V1)

**Implementation**:
```typescript
// /messages/en.json
{
  "navigation": {
    "home": "Home",
    "stadiums": "Stadiums",
    "worldCup": "World Cup 2026"
  },
  "filters": {
    "shadeLevel": "Shade Level",
    "excellent": "Excellent Shade",
    "good": "Good Shade"
  }
}

// /messages/es.json
{
  "navigation": {
    "home": "Inicio",
    "stadiums": "Estadios",
    "worldCup": "Copa Mundial 2026"
  },
  "filters": {
    "shadeLevel": "Nivel de Sombra",
    "excellent": "Excelente Sombra",
    "good": "Buena Sombra"
  }
}

// /messages/fr.json
{
  "navigation": {
    "home": "Accueil",
    "stadiums": "Stades",
    "worldCup": "Coupe du Monde 2026"
  },
  "filters": {
    "shadeLevel": "Niveau d'Ombre",
    "excellent": "Excellente Ombre",
    "good": "Bonne Ombre"
  }
}
```

**Language Selector Component**:
```tsx
// /src/components/LanguageSelector.tsx
import { useLocale } from 'next-intl';

export function LanguageSelector() {
  const locale = useLocale();

  return (
    <select value={locale} onChange={handleChange}>
      <option value="en">🇺🇸 English</option>
      <option value="es">🇪🇸 Español</option>
      <option value="fr">🇫🇷 Français</option>
    </select>
  );
}
```

**Timeline**: Week 6-8 (translation + implementation)

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance

**NFR-001: Page Load Time**
- Target: <2.0 seconds (median, mobile 4G)
- Current: 1.8s (must not regress)
- Measurement: Lighthouse Performance ≥90

**Strategies**:
- Lazy load row data (only when section expanded)
- Virtual scrolling for row lists
- Pre-calculate common game times (cache results)
- Web Worker for row calculations (don't block UI)

**NFR-002: Calculation Speed**
- Target: <100ms for 3,000 rows (full stadium)
- Approach: Batch calculations, optimize loop

**Performance Test**:
```typescript
// Benchmark: Calculate Yankees Stadium (82 sections × 30 rows = 2,460 rows)
const start = performance.now();
const results = sunCalculator.calculateAllRows(yankees, date, time);
const end = performance.now();
console.log(`Calculated ${results.totalRows} rows in ${end - start}ms`);
// Target: <100ms
```

### 6.2 Scalability

**NFR-003: Data Size Management**
- Current: `venues.json` = 170KB
- With row data: ~24MB uncompressed (240,000 rows × 100 bytes)
- Mitigation: Keep row data in TypeScript source files (code-split per stadium)
- Result: Only load stadium data when user selects that stadium

**NFR-004: Build Time**
- Current: ~90 seconds
- Projected: ~120-180 seconds (with row data validation)
- Acceptable: <3 minutes

### 6.3 Accuracy

**NFR-005: Calculation Accuracy**
- Target: ±5% variance from real-world measurements
- Method: Field verification at 5-10 high-traffic stadiums
- Process:
  1. Attend game with light meter
  2. Record actual shade at recorded times
  3. Compare to calculated values
  4. Adjust algorithm if error >10%

### 6.4 Accessibility

**NFR-006: WCAG 2.1 AA Compliance**
- All components keyboard navigable
- Color contrast ≥4.5:1
- Screen reader compatible (ARIA labels)
- Focus indicators visible (2px outline)
- Form labels associated

**Testing**: Run `@axe-core/playwright` in CI/CD

---

## 7. TECHNICAL APPROACH

### 7.1 Architecture Decisions

**Decision 1: Keep Static File Approach (No Database)**
- Row data stays in TypeScript source files
- Code-split per stadium (lazy load)
- Rationale: No hosting costs, version control, simple deployment
- Trade-off: No admin UI for data updates

**Decision 2: Web Worker for Calculations**
- Move row-level calculations to Web Worker
- Rationale: Don't block main thread (UI responsive)
- Implementation: `/src/workers/sunCalculationWorker.ts`

**Decision 3: Duplicate NFL Stadiums for World Cup**
- Create separate World Cup venue entries (e.g., `metlife-stadium-wc`)
- Include section mapping (NFL ID → Soccer name)
- Rationale: Cleanly separate NFL vs World Cup configurations
- Trade-off: Data duplication (11 stadiums × 2 = 22 entries)

### 7.2 Implementation Phases

**Phase 0: Foundation (Week 1-2) - 14 days**
- [ ] Enhance `sunCalculator.ts` for row-level calculations
- [ ] Implement `calculateRowShadow()` function
- [ ] Implement `calculateOverhangShadow()` function
- [ ] Add `/api/stadium/[id]/rows/shade` endpoint
- [ ] Unit tests for row-level calculations

**Phase 1: Row-Level UI (Week 2-3) - 7 days**
- [ ] Create `RowBreakdownView.tsx` component
- [ ] Update `LazySectionCardModern.tsx` with row summary
- [ ] Add row-level filters to `EnhancedSunFilter.tsx`
- [ ] Mobile optimization (collapsible rows)
- [ ] Integration tests

**Phase 2: World Cup - Existing Stadiums (Week 3-4) - 7 days**
- [ ] Duplicate 11 NFL stadiums as World Cup venues (`*-wc.ts`)
- [ ] Create section mappings (NFL → Soccer)
- [ ] Verify row data completeness for 11 stadiums
- [ ] Test calculations for soccer field orientation

**Phase 3: World Cup - New Stadiums (Week 4-6) - 14 days**
- [ ] Gather data for 5 new stadiums (Azteca, Akron, BBVA, BC Place, BMO Field)
- [ ] Create section files with row data
- [ ] Field verification if possible (or use stadium diagrams)
- [ ] Add to venue database

**Phase 4: World Cup UI & Schedule (Week 6-7) - 7 days**
- [ ] Create `/world-cup-2026` landing page
- [ ] Import 104 match schedule entries
- [ ] Build match schedule display component
- [ ] Link matches to venue pages
- [ ] Pre-calculate shade for all match kickoff times

**Phase 5: Multi-Language (Week 7-8) - 7 days**
- [ ] Install `next-intl`
- [ ] Create translation files (EN, ES, FR)
- [ ] Translate core UI (100%)
- [ ] Translate stadium guides (50%)
- [ ] Add language selector component
- [ ] Test language switching

**Phase 6: Testing & Optimization (Week 8-9) - 7 days**
- [ ] Performance optimization (Web Worker, caching)
- [ ] Visual regression tests
- [ ] Accessibility audit (axe-core)
- [ ] Field verification for 3-5 stadiums
- [ ] Bug fixes
- [ ] Lighthouse audit (target: ≥90)

**Phase 7: Launch Prep (Week 9-10) - 7 days**
- [ ] SEO optimization (World Cup keywords)
- [ ] Create World Cup marketing content
- [ ] Social media graphics
- [ ] Press release draft
- [ ] Soft launch (beta users)
- [ ] Monitor analytics

**TOTAL: 10 weeks (70 days) - TARGET LAUNCH: April 1, 2026**

### 7.3 Critical Path

**Must Complete Before World Cup Ticketing (Target: April 1, 2026 - 69 days)**:

```
Week 1-2: Row calculation engine ← BLOCKER for everything
Week 2-3: Row UI components ← BLOCKER for user testing
Week 3-4: World Cup existing stadiums ← BLOCKER for World Cup launch
Week 4-6: World Cup new stadiums ← BLOCKER for complete coverage
Week 6-7: World Cup UI + schedule ← BLOCKER for visibility
Week 7-8: Multi-language ← BLOCKER for international users
```

**Earliest Possible Launch**: 8 weeks (56 days) if everything perfect
**Realistic Launch**: 10 weeks (70 days) with buffer for issues
**Latest Acceptable**: 12 weeks (84 days) = March 25, 2026

---

## 8. RISKS & MITIGATION

### 8.1 Technical Risks

**Risk 1: Row Calculation Performance**
- Severity: HIGH
- Probability: MEDIUM
- Impact: UI becomes unusable if calculations take >1 second
- Mitigation:
  - Implement Web Worker (calculations off main thread)
  - Pre-calculate common times (2:00 PM, 7:00 PM)
  - Cache results in browser (IndexedDB)
  - Profile and optimize hot paths

**Risk 2: New Stadium Data Unavailable**
- Severity: MEDIUM
- Probability: MEDIUM
- Impact: Can't complete 5 new World Cup stadiums (Mexico/Canada)
- Mitigation:
  - Start data gathering NOW (don't wait for Phase 4)
  - Use stadium websites, SeatGeek, StubHub for seating charts
  - If data missing, use geometric templates (lower accuracy acceptable for V1)
  - Document assumptions for future refinement

**Risk 3: World Cup Schedule Changes**
- Severity: LOW
- Probability: MEDIUM
- Impact: Match times/venues change after we import schedule
- Mitigation:
  - Build schedule as static TypeScript file (easy to update)
  - Add "Last updated" timestamp
  - Monitor FIFA website for changes
  - Update schedule as needed (quick redeployment)

### 8.2 Timeline Risks

**Risk 4: Development Delays**
- Severity: HIGH
- Probability: MEDIUM
- Impact: Miss April 1 target, lose World Cup ticketing window
- Mitigation:
  - Start immediately (don't wait for full approval)
  - Weekly progress reviews
  - Parallel tracks (row-level + World Cup simultaneously)
  - Cut scope if needed (defer MLS, 3D visualization)

**Risk 5: Field Verification Delays**
- Severity: LOW
- Probability: HIGH
- Impact: Can't verify accuracy for all stadiums
- Mitigation:
  - Accept template-based data for V1
  - Mark verified vs unverified stadiums
  - Iterative refinement post-launch
  - User feedback system ("Report inaccurate data")

### 8.3 Business Risks

**Risk 6: Low World Cup Interest**
- Severity: LOW
- Probability: LOW
- Impact: Effort on World Cup doesn't drive traffic
- Mitigation:
  - World Cup is one of world's largest sporting events (very low risk)
  - Dual-use infrastructure (stadiums reusable for NFL)
  - SEO benefits (World Cup keywords)

---

## 9. SUCCESS CRITERIA

### 9.1 Launch Criteria (MVP - April 1, 2026)

**Must-Have**:
- ✅ Row-level calculations operational for all existing stadiums
- ✅ Row breakdown UI component functional (desktop + mobile)
- ✅ All 16 World Cup venues with row-level data
- ✅ World Cup landing page live
- ✅ Match schedule integrated (104 matches)
- ✅ Multi-language support (EN, ES, FR)
- ✅ Lighthouse Performance ≥85 (acceptable for MVP)
- ✅ No P0/P1 bugs
- ✅ Accessibility WCAG AA compliant

**Nice-to-Have** (Can Defer):
- Visual seat map (Phase 2)
- Row comparison tool (Phase 2)
- Field verification for all stadiums (iterative)
- Advanced filtering (Phase 2)

### 9.2 Success Metrics (3 months post-launch)

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| World Cup page views | 0 | 100k+ | Google Analytics |
| Row breakdown usage | 0% | 60% expand rate | Event tracking |
| Time on site | 3 min avg | 5 min avg | GA4 |
| Bounce rate | 45% | <35% | GA4 |
| World Cup conversions | 0 | 5k+ clicks to ticket sites | Affiliate tracking |
| Lighthouse score | 95 | ≥90 | Maintain |
| User satisfaction | N/A | 4+/5 rating | Surveys |

### 9.3 Key Performance Indicators (KPIs)

**Technical KPIs**:
- Page load time: <2.0s (median)
- Calculation speed: <100ms per stadium
- Error rate: <1% failed calculations
- Uptime: 99.9%

**Product KPIs**:
- Row-level coverage: 100% of stadiums
- World Cup coverage: 16 of 16 venues
- Translation coverage: Core UI 100%, guides 50%
- Accuracy: ±5% variance (field-verified stadiums)

**Business KPIs**:
- SEO rank: Top 5 for "2026 World Cup stadium shade"
- Backlinks: 20+ high-quality sites
- Social shares: 500+ shares on Twitter/Facebook
- Press mentions: 5+ articles/blogs

---

## 10. OPEN QUESTIONS & DECISIONS NEEDED

### Critical Decisions (Answer Before Proceeding)

**Q1: Approve 10-Week Timeline?**
- Proposed: 10 weeks to April 1, 2026 launch
- Risk: Aggressive but achievable with focus
- Alternative: 12 weeks (more buffer, but closer to World Cup)
- **Decision Needed**: ✅ Approve 10-week timeline or adjust?

**Q2: Approve Dual-Use Stadium Approach?**
- Proposal: Duplicate NFL stadiums as `*-wc.ts` files
- Trade-off: Data duplication vs clean separation
- Alternative: Single stadium with `configuration: 'nfl' | 'soccer'` toggle
- **Decision Needed**: ✅ Approve duplication approach?

**Q3: Field Verification Budget?**
- Question: Can we attend 3-5 games for field verification?
- Cost: ~$500-1000 per stadium (tickets, travel, equipment)
- Alternative: Accept template-based accuracy for V1
- **Decision Needed**: ✅ Approve field verification budget?

**Q4: Translation Resource?**
- Question: Professional translator or machine translation (DeepL)?
- Cost: Professional = $0.10-0.20/word (~$2-3k for full UI)
- Alternative: Machine translation + native speaker review
- **Decision Needed**: ✅ Translation approach and budget?

**Q5: Defer Features to Phase 2?**
- Candidates: 3D visualization, advanced filtering, seat comparison tool
- Rationale: Focus on World Cup deadline
- Risk: Missing "nice-to-have" features at launch
- **Decision Needed**: ✅ Approve deferred features list?

---

## 11. ASSUMPTIONS

**Assumption 1: Existing Row Data is Accurate**
- Assumes `generateRows()` functions produce realistic elevation/depth values
- Risk: If templates are wrong, all calculations are wrong
- Validation: Spot-check 5 stadiums against seating charts

**Assumption 2: FIFA Schedule Available**
- Assumes 2026 World Cup full schedule is published or will be soon
- Reality: Should verify NOW (schedule typically released 6 months before)
- Action: Check FIFA website immediately

**Assumption 3: User Wants Row-Level**
- Assumes users will use row-level data (not just section-level)
- Evidence: Missing (should gather user feedback)
- Mitigation: Build analytics to track row breakdown expansion rate

**Assumption 4: Current Performance Holds**
- Assumes row-level calculations won't degrade performance below acceptable
- Validation: Benchmark early in Phase 0

**Assumption 5: Static Files Scale**
- Assumes static TypeScript files can handle 240,000 rows
- Reality: Build time may increase, but manageable
- Threshold: If build >5 minutes, reconsider approach

---

## 12. SUMMARY & RECOMMENDATIONS

### Key Findings (CORRECTED)

1. **Infrastructure 40% Complete**: Row data exists (240,000 records), but calculation engine and UI are missing
2. **World Cup is URGENT**: June 11, 2026 (139 days) - must launch by April 1 (69 days)
3. **Technical Feasibility**: Row-level calculations are straightforward extension of existing code
4. **Data Challenge**: 5 new World Cup stadiums need complete data entry
5. **Timeline**: 10 weeks is aggressive but achievable with focus

### Recommended Approach

**Prioritization**:
1. **Week 1-2**: Row calculation engine (CRITICAL PATH)
2. **Week 2-3**: Row UI components (CRITICAL PATH)
3. **Week 3-6**: World Cup venues (11 existing + 5 new)
4. **Week 6-7**: World Cup UI + match schedule
5. **Week 7-8**: Multi-language support
6. **Week 8-10**: Testing, optimization, launch prep

**Why This Approach**:
- ✅ Activates existing row data investment
- ✅ Meets World Cup deadline (April 1, 2026)
- ✅ Parallel tracks (row-level + World Cup)
- ✅ Incremental testing (validate as we build)
- ✅ Buffer time for issues (2 weeks)

**Success Factors**:
1. Start immediately (every week counts)
2. Weekly progress reviews (catch delays early)
3. Pragmatic data quality (template-based OK for V1)
4. Focus on World Cup (defer other features)
5. Performance monitoring (don't regress)

### Conclusion

This project transforms TheStadium.com from section-level to row-level precision while capturing the 2026 World Cup market opportunity. The infrastructure is 40% complete (data exists), making this achievable in 10 weeks.

**Critical Success Factor**: Launch by April 1, 2026 (69 days) to capture World Cup ticketing window.

**Recommended Decision**: ✅ **Approve PRD and proceed to Technical Specification immediately.**

---

## 13. NEXT STEPS

1. **Stakeholder Review**: Review this PRD, answer open questions (Section 10)
2. **Approval**: Approve 10-week timeline and approach
3. **Technical Spec**: Create detailed technical specification (next artifact)
4. **Implementation Plan**: Break down into specific tasks with assignments
5. **Sprint 0 Kickoff**: Start Phase 0 (row calculation engine) immediately

**Target Start Date**: January 23, 2026 (tomorrow)
**Target Launch Date**: April 1, 2026 (69 days from today)

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**

---

**Document Metadata**:
- Version: 2.0 (CORRECTED - Date fixed to 2026)
- Author: Claude (AI Assistant)
- Date: January 22, 2026
- Word Count: ~8,500 words
- Changes from V1:
  - Fixed date from 2025 to 2026
  - Updated all timelines (World Cup now 139 days away, not 12+ months)
  - Added audit findings (row data 40% complete)
  - Verified component count (91 files)
  - Confirmed sun calculator doesn't use row data
  - Validated World Cup has zero coverage
  - Made World Cup URGENT priority
  - Realistic 10-week timeline (not 20+ weeks)
  - Removed unverified assumptions
  - Added critical path analysis
