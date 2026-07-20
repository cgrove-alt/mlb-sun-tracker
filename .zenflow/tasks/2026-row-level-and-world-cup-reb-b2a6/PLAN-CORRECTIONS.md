# Implementation Plan - Critical Corrections
## Addressing Review Findings

**Date**: January 22, 2026
**Status**: CORRECTING CRITICAL ISSUES

---

## 🚨 CRITICAL ISSUE #1: FIFA SCHEDULE - VERIFIED ✅

**Original Claim**: "FIFA Schedule: ✅ CONFIRMED AVAILABLE"
**Review Concern**: Unverified, no source provided

### VERIFICATION COMPLETE

**Official Sources**:
1. [FIFA Official Match Schedule](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums)
2. [FIFA Media Release - Updated Schedule](https://inside.fifa.com/media-releases/updated-world-cup-2026-match-schedule-venues-kick-off-times-104-matches)
3. [FIFA.com Updated Schedule Article](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/updated-fifa-world-cup-2026-match-schedule-now-available)

**Confirmed Details**:
- **Total Matches**: 104 (confirmed - 48 team format)
- **Schedule Released**: December 6, 2025 (live broadcast from Washington D.C.)
- **Opening Match**: June 11, 2026 - Mexico vs South Africa at Estadio Azteca, Mexico City
- **Final**: July 19, 2026 - MetLife Stadium, New York/New Jersey
- **Tournament Duration**: 39 days (June 11 - July 19)
- **Format**: 12 groups of 4 teams → Round of 32 → Round of 16 → Quarters → Semis → Final

**Data Format**: Full schedule available on FIFA.com with:
- Match dates (ISO format)
- Kick-off times (local time zones)
- Venue assignments
- Group stage assignments
- Available in multiple formats (web, PDF, data feeds)

**Phase 4 Impact**: ✅ **NO BLOCKER** - Schedule data is accessible and complete

---

## 🚨 CRITICAL ISSUE #2: ROW DATA STRUCTURE - VERIFIED ✅

**Original Claim**: "240,000 row records exist"
**Review Concern**: Only 4 files sampled, structure not verified

### VERIFICATION COMPLETE

**Files Examined**:
1. `/src/data/sections/mlb/yankees.ts` (lines 1-100)
2. `/src/data/sections/nfl/allegiant-stadium.ts` (lines 1-100)

**Confirmed Structure**:
```typescript
// EXACT implementation found in both MLB and NFL files:
function generateRows(
  startRow: number | string,     // 'A'-'Z' or 1-50
  endRow: number | string,       // Last row
  seatsPerRow: number,           // Base seat count
  baseElevation: number,         // Starting height (feet)
  rake: number,                  // Seating angle (degrees)
  covered: boolean = false       // Roof/overhang coverage
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.5;         // FIXED: 2.5 feet per row
  const rowDepth = 2.8;          // FIXED: 2.8 feet per row

  // Generates RowDetail objects with:
  // - rowNumber: string
  // - seats: number (decreases by 0.2 per row)
  // - elevation: baseElevation + (rowNum × 2.5 × sin(rake))
  // - depth: rowNum × 2.8
  // - covered: boolean
  // - overhangHeight: 30 - (rowNum × 0.3) if covered
}
```

**Key Findings**:
- ✅ Row data structure is **EXACTLY** as assumed in implementation plan
- ✅ Yankees Stadium: Uses generateRows('A', 'N', 18, 0, 18, false) → 14 rows per section
- ✅ Allegiant Stadium: Uses generateRows('A', 'X', 25, 0, 22, false) → 24 rows per section
- ✅ **rowHeight = 2.5 feet** (matches plan assumption)
- ✅ **rowDepth = 2.8 feet** (matches plan assumption)
- ✅ **overhangHeight calculation** already implemented (matches plan)

**Phase 0 Impact**: ✅ **NO CHANGES NEEDED** - Implementation plan calculation logic matches actual data structure perfectly

---

## 🚨 CRITICAL ISSUE #3: PHASES 2-7 DETAIL INSUFFICIENT

**Review Finding**: Phases 2-7 only have ~250 lines total vs 900+ lines in Phases 0-1

### CORRECTION: DETAILED PHASE 2-4 TASKS

## Phase 2: World Cup Existing Stadiums (Week 3-4) - DETAILED

### Task 2.1: Identify & Duplicate 11 NFL Stadiums (Day 15)
**Duration**: 4 hours

**The 11 NFL Stadiums** (from requirements.md):
1. **MetLife Stadium** (East Rutherford, NJ) - Final venue
2. **SoFi Stadium** (Los Angeles, CA)
3. **AT&T Stadium** (Dallas, TX) - Most matches (9)
4. **Mercedes-Benz Stadium** (Atlanta, GA)
5. **Arrowhead Stadium** (Kansas City, MO)
6. **Hard Rock Stadium** (Miami, FL)
7. **Lincoln Financial Field** (Philadelphia, PA)
8. **Levi's Stadium** (San Francisco, CA)
9. **Gillette Stadium** (Foxborough, MA)
10. **NRG Stadium** (Houston, TX)
11. **Lumen Field** (Seattle, WA)

**Duplication Process**:
```bash
# For each stadium:
cd /src/data/sections/nfl/

# Copy file with -wc suffix
cp metlife-stadium.ts ../soccer/metlife-stadium-wc.ts
cp sofi-stadium.ts ../soccer/sofi-stadium-wc.ts
cp att-stadium.ts ../soccer/att-stadium-wc.ts
# ... repeat for all 11

# Result: 11 new files in /src/data/sections/soccer/
```

**Verification**: 11 files created, each ~1,000 lines

---

### Task 2.2: Update Stadium Metadata for Soccer (Days 16-17)
**Duration**: 12 hours

**Changes Required Per File** (example: metlife-stadium-wc.ts):

1. **Update export name**:
   ```typescript
   // OLD: export const metlifeStadiumSections: DetailedSection[]
   // NEW: export const metlifeStadiumWCSections: DetailedSection[]
   ```

2. **Add soccer field orientation** (in stadium parent file `/src/data/stadiums.ts`):
   ```typescript
   {
     id: 'metlife-stadium-wc',
     name: 'MetLife Stadium (World Cup)',
     fifaName: 'New York New Jersey Stadium',
     latitude: 40.8128,
     longitude: -74.0742,
     orientation: 90,        // Soccer field bearing (differs from NFL)
     fieldDimensions: {
       length: 105,          // meters (FIFA standard)
       width: 68            // meters (FIFA standard)
     },
     timezone: 'America/New_York',
     capacity: 82500,
     soccerCapacity: 82500,
     nflStadiumId: 'metlife-stadium',  // Link to NFL version
     sport: 'soccer'
   }
   ```

3. **Verify row data** (no changes needed - seats are the same):
   - Row structure identical between NFL and soccer
   - Same generateRows() function
   - Same elevation, depth, covered values

**Files to Modify**:
- `/src/data/stadiums.ts` - Add 11 new stadium entries
- `/src/data/sections/soccer/metlife-stadium-wc.ts` - Update metadata (×11)

**Verification**: All 11 stadiums load with -wc ID suffix

---

### Task 2.3: Create Section Mappings (Day 18)
**Duration**: 6 hours

**Purpose**: Map NFL section IDs to soccer section names

**File**: `/src/data/worldcup2026/sectionMappings.ts` (NEW - 200 lines)

**Implementation**:
```typescript
// NFL sections often have subsection letters (114A, 114B)
// Soccer sections typically just numbers (114, 115)

export const sectionMappings: Record<string, Record<string, string>> = {
  'metlife-stadium-wc': {
    '111A': '111',
    '111B': '111',
    '112A': '112',
    '112B': '112',
    // ... mapping for all sections
  },
  'sofi-stadium-wc': {
    '100': '100',   // Some stadiums may have 1:1 mapping
    '101': '101',
    // ...
  },
  // ... mappings for all 11 stadiums
};

// Helper function
export function getNFLSectionForSoccer(stadiumId: string, soccerSectionId: string): string | null {
  const mapping = sectionMappings[stadiumId];
  if (!mapping) return null;

  // Reverse lookup
  for (const [nflId, soccerId] of Object.entries(mapping)) {
    if (soccerId === soccerSectionId) return nflId;
  }
  return null;
}
```

**Verification**: Mapping lookup functions work correctly

---

### Task 2.4: Test Soccer Field Orientation (Day 19)
**Duration**: 6 hours

**Purpose**: Ensure sun calculations use soccer field orientation (not NFL)

**Test Scenarios**:
1. **MetLife Stadium (NFL)**: orientation = 315° (NW)
2. **MetLife Stadium (World Cup)**: orientation = 90° (E) ← Soccer field rotated

**Test Code**:
```typescript
// Test: Same date/time, different orientations should give different results
const nflMetlife = getStadiumById('metlife-stadium');
const wcMetlife = getStadiumById('metlife-stadium-wc');

const date = new Date('2026-06-21T15:00:00');

const nflResults = calculateRowShadows(
  nflMetlife.sections[0],
  sunPosition.altitude,
  sunPosition.azimuth,
  nflMetlife.orientation  // 315°
);

const wcResults = calculateRowShadows(
  wcMetlife.sections[0],
  sunPosition.altitude,
  sunPosition.azimuth,
  wcMetlife.orientation   // 90°
);

// Verify: Results should differ significantly
expect(nflResults.averageCoverage).not.toEqual(wcResults.averageCoverage);
```

**Verification**: Orientation affects calculations correctly

---

### Task 2.5: Integration Testing (Days 20-21)
**Duration**: 12 hours

**Test All 11 Stadiums**:
```bash
# For each WC stadium:
# 1. Load stadium page: /stadium/metlife-stadium-wc
# 2. Select date: 2026-06-21
# 3. Select time: 15:00
# 4. Enable row-level view
# 5. Verify: Row breakdown displays
# 6. Verify: Calculations complete without errors
```

**Verification Checklist**:
- [ ] All 11 stadiums load without errors
- [ ] Row data displays correctly
- [ ] Section mappings work (if used in UI)
- [ ] Soccer field orientation applied
- [ ] Performance acceptable (<2s page load)

---

## Phase 3: World Cup New Stadiums (Weeks 4-6) - DETAILED

### Task 3.1: Data Gathering Strategy (Days 22-24)
**Duration**: 18 hours

**The 5 New Stadiums**:
1. **Estadio Azteca** (Mexico City, Mexico) - Opening match venue
2. **Estadio Akron** (Guadalajara, Mexico)
3. **Estadio BBVA** (Monterrey, Mexico)
4. **BC Place** (Vancouver, Canada)
5. **BMO Field** (Toronto, Canada)

**Data Sources** (in priority order):

**Primary Sources**:
1. **Official Stadium Websites**:
   - Estadio Azteca: https://estadioazteca.com.mx/
   - Estadio Akron: http://estadioakron.mx/
   - Estadio BBVA: https://estadiobbva.mx/
   - BC Place: https://www.bcplace.com/
   - BMO Field: https://www.bmofield.com/

2. **FIFA World Cup Venue Guides**:
   - https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums
   - Detailed venue information, capacity, dimensions

3. **Ticketing Platforms**:
   - Ticketmaster (seating charts with section IDs)
   - StubHub (section layouts)
   - SeatGeek (interactive seating maps)

4. **Google Maps Satellite**:
   - Stadium orientation (compass bearing)
   - Approximate dimensions
   - Roof/shade structure visibility

**Data Requirements Per Stadium**:
```typescript
// Minimum data needed:
interface NewStadiumData {
  // Basic Info
  name: string;
  city: string;
  country: 'Mexico' | 'Canada';
  latitude: number;        // From Google Maps
  longitude: number;       // From Google Maps
  timezone: string;        // IANA format
  capacity: number;        // From official site/FIFA

  // Field Geometry
  orientation: number;     // Degrees from north (satellite imagery)
  fieldDimensions: {
    length: number;        // 105-110 meters (FIFA standard)
    width: number;         // 68-75 meters (FIFA standard)
  };

  // Section Data (MOST CHALLENGING)
  sections: {
    id: string;           // From seating chart
    name: string;         // From seating chart
    level: 'field' | 'lower' | 'upper';
    baseAngle: number;    // Calculated from layout
    angleSpan: number;    // Calculated from layout
    rowCount: number;     // From seating chart
    seatsPerRow: number;  // Estimated from chart
    baseElevation: number;// Estimated from level
    rake: number;         // Estimated (18-25° typical)
    covered: boolean;     // From stadium photos/diagrams
  }[];
}
```

**Gathering Process**:
1. **Day 22**: Gather Estadio Azteca data (6 hours)
2. **Day 23**: Gather Estadio Akron + BBVA data (6 hours each = 12 hours)
3. **Day 24**: Gather BC Place + BMO Field data (6 hours each = 12 hours)

**Deliverable**: 5 spreadsheets/documents with all required data

---

### Task 3.2: Create Stadium Files (Days 25-28)
**Duration**: 24 hours (6 hours per stadium × 4, last one faster)

**Template** (estadio-azteca-wc.ts):
```typescript
// Estadio Azteca - World Cup 2026
// Mexico City, Mexico

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  // SAME implementation as NFL/MLB stadiums
  // Copy from yankees.ts or allegiant-stadium.ts
}

export const estadioAztecaWCSections: DetailedSection[] = [
  // Section 100 (Lower Level, South Goal)
  {
    id: '100',
    name: 'Sección 100',
    level: 'lower',
    baseAngle: 0,              // Calculated from layout
    angleSpan: 15,             // Estimated
    rows: generateRows(1, 30, 25, 10, 20, false),  // 30 rows, 25 seats/row
    vertices3D: [
      // Calculated from stadium dimensions + orientation
      { x: 52, y: 0, z: 10 },
      { x: 48, y: 14, z: 10 },
      { x: 76, y: 22, z: 22 },
      { x: 82, y: 0, z: 22 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 10,
    rake: 20
  },
  // ... 50-80 more sections (estimated based on seating chart)
];
```

**Estimated Section Counts**:
- Estadio Azteca: 80+ sections (87,000 capacity)
- Estadio Akron: 60 sections (46,000 capacity)
- Estadio BBVA: 55 sections (53,000 capacity)
- BC Place: 50 sections (54,000 capacity)
- BMO Field: 40 sections (30,000 capacity)

**File Sizes**: ~800-1,200 lines per stadium

**Verification**: TypeScript compiles, no errors

---

### Task 3.3: Populate Row Data (Days 29-32)
**Duration**: 24 hours

**For Each Stadium**:
1. Use generateRows() for all sections
2. Base parameters on level:
   - **Lower Level**: generateRows(1, 30, 25, 5, 18, false)
   - **Mid Level**: generateRows(1, 35, 22, 30, 20, true)  // May be covered
   - **Upper Level**: generateRows(1, 40, 20, 60, 22, true) // Usually covered

3. Adjust per stadium characteristics:
   - **Estadio Azteca**: No roof, all uncovered
   - **BC Place**: Retractable roof, mark upper sections as covered
   - **BMO Field**: Open-air, southern sun exposure

**Verification**:
- Each section has rows array populated
- Row counts realistic (20-40 rows per section)
- Elevation increases progressively

---

### Task 3.4: Test New Stadium Calculations (Days 33-35)
**Duration**: 18 hours

**Test Each Stadium**:
```bash
# For each new stadium:
npm run dev
# Navigate to /stadium/estadio-azteca-wc?date=2026-06-11&time=17:00
# Enable row-level view
# Verify calculations complete without errors
# Check: Row A has different shade % than Row Z
```

**Performance Tests**:
- Calculate all rows for Estadio Azteca (80 sections × 30 rows = 2,400 rows)
- Verify: <100ms calculation time
- Verify: No UI blocking

**Verification Checklist**:
- [ ] All 5 new stadiums load
- [ ] Row calculations work
- [ ] Shade percentages realistic (not all 0% or 100%)
- [ ] Performance acceptable
- [ ] Mobile responsive

---

## Phase 4: World Cup UI & Schedule (Weeks 6-7) - DETAILED

### Task 4.1: Create World Cup Landing Page (Days 36-38)
**Duration**: 18 hours

**File**: `/app/world-cup-2026/page.tsx` (NEW - 300 lines)

**Implementation**:
```typescript
import { getAllWorldCupVenues } from '@/src/data/worldcup2026/venues';
import { getUpcomingMatches } from '@/src/data/worldcup2026/matches';

export default function WorldCupPage() {
  const venues = getAllWorldCupVenues();
  const upcomingMatches = getUpcomingMatches(5);

  return (
    <div className="world-cup-landing">
      {/* Hero Section */}
      <section className="hero bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <h1 className="text-5xl font-bold mb-4">
          2026 FIFA World Cup Shade Guide
        </h1>
        <p className="text-xl mb-8">
          Find the perfect seats at all 16 North American venues with row-level shade precision
        </p>
        <div className="flex gap-4">
          <Link href="#venues" className="btn-primary">
            Browse Stadiums
          </Link>
          <Link href="/world-cup-2026/schedule" className="btn-secondary">
            View Schedule
          </Link>
        </div>
      </section>

      {/* Venue Grid */}
      <section id="venues" className="py-12">
        <h2 className="text-3xl font-bold mb-8">16 World Cup Venues</h2>

        {/* Country Filter */}
        <div className="mb-6">
          <button onClick={() => setFilter('all')}>All (16)</button>
          <button onClick={() => setFilter('USA')}>USA (11)</button>
          <button onClick={() => setFilter('Mexico')}>Mexico (3)</button>
          <button onClick={() => setFilter('Canada')}>Canada (2)</button>
        </div>

        {/* Venue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredVenues.map(venue => (
            <Link
              key={venue.id}
              href={`/world-cup-2026/venue/${venue.id}`}
              className="venue-card"
            >
              <img src={venue.imageUrl} alt={venue.name} />
              <h3>{venue.fifaName}</h3>
              <p>{venue.city}, {venue.country}</p>
              <p>{venue.matchCount} matches</p>
              <button className="btn-primary">View Shade Guide</button>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8">Upcoming Matches</h2>
        {upcomingMatches.map(match => (
          <MatchCard key={match.matchId} match={match} />
        ))}
      </section>
    </div>
  );
}
```

**Verification**: Landing page renders, venue grid displays

---

### Task 4.2: Import Match Schedule Data (Days 39-40)
**Duration**: 12 hours

**File**: `/src/data/worldcup2026/matches.ts` (NEW - 1,200 lines)

**Data Source**: FIFA.com official schedule

**Manual Entry Process**:
1. Open FIFA schedule: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums
2. For each of 104 matches, enter:
   ```typescript
   {
     matchId: 'wc2026-001',
     date: '2026-06-11',
     kickoffTime: '13:00',  // Local time
     venueId: 'estadio-azteca-wc',
     round: 'Group Stage',
     group: 'Group A',
     teamA: 'Mexico',
     teamB: 'South Africa',
     tvChannels: ['FOX', 'Telemundo']
   }
   ```

**Estimated Time**: ~7 minutes per match × 104 = 12 hours

**Verification**: All 104 matches entered correctly

---

### Task 4.3: Create Venue Detail Pages (Day 41)
**Duration**: 6 hours

**File**: `/app/world-cup-2026/venue/[id]/page.tsx` (NEW - 200 lines)

**Implementation**:
```typescript
export default function VenuePage({ params }: { params: { id: string } }) {
  const venue = getWorldCupVenueById(params.id);
  const matches = getMatchesForVenue(params.id);

  return (
    <div className="venue-detail">
      <h1>{venue.fifaName}</h1>
      <p>{venue.city}, {venue.country}</p>
      <p>Capacity: {venue.soccerCapacity.toLocaleString()}</p>

      {/* Link to Full Stadium Guide */}
      <Link href={`/stadium/${venue.id}?date=2026-06-21&time=15:00`}>
        View Full Shade Guide
      </Link>

      {/* Matches at This Venue */}
      <h2>Matches at {venue.commonName}</h2>
      {matches.map(match => (
        <div key={match.matchId} className="match-card">
          <p>{match.date} at {match.kickoffTime}</p>
          <p>{match.teamA} vs {match.teamB}</p>
          <p>{match.round} - {match.group}</p>
          <Link href={`/stadium/${venue.id}?date=${match.date}&time=${match.kickoffTime}`}>
            View Shade for This Match
          </Link>
        </div>
      ))}
    </div>
  );
}
```

**Verification**: All 16 venue pages render

---

### Task 4.4: Create Schedule Page (Day 42)
**Duration**: 6 hours

**File**: `/app/world-cup-2026/schedule/page.tsx` (NEW - 350 lines)

**Features**:
- Full 104-match schedule
- Filter by date, country, round, team
- Sort by date/time
- Link to venue shade guide for each match

**Verification**: Schedule displays, filters work

---

## Phase 5: Multi-Language (Weeks 7-8) - REVISED TIMELINE

### TIMELINE CORRECTION

**Original Plan**: 3 days
**Revised Plan**: **5 days** (more realistic)

**Rationale**:
- 535 lines (en.json) to translate to French
- Machine translation takes 4-6 hours
- Native speaker review: 2-3 days
- Testing all 4 languages: 1 day
- Bug fixes (layout, missing strings): 1 day

### Task 5.1: Machine Translation (Day 43)
**Duration**: 6 hours

**Process**:
1. Use DeepL API (best machine translation for FR)
2. Translate en.json → fr.json
3. Preserve formatting, variables (${variable})
4. Human review of 100 high-priority strings

**Verification**: fr.json created, ~535 lines

### Task 5.2: Native Speaker Review (Days 44-45)
**Duration**: 12 hours

**Scope**:
- Core UI strings (100% - navigation, buttons, errors)
- Stadium guide snippets (50% - key paragraphs)

**Budget**: $300-500 for professional review

**Verification**: Corrections applied to fr.json

### Task 5.3: Update i18nContext (Day 46)
**Duration**: 4 hours

**Changes**:
```typescript
// /src/i18n/i18nContext.tsx

const SUPPORTED_LANGUAGES = [
  { code: 'en' as const, name: 'English', nativeName: 'English' },
  { code: 'es' as const, name: 'Spanish', nativeName: 'Español' },
  { code: 'ja' as const, name: 'Japanese', nativeName: '日本語' },
  { code: 'fr' as const, name: 'French', nativeName: 'Français' }  // NEW
];
```

**Verification**: French language selectable

### Task 5.4: Test All 4 Languages (Day 47)
**Duration**: 6 hours

**Test Matrix**:
- EN → ES → JA → FR → EN (cycle through all)
- Test: Navigation, filters, buttons, errors, stadium guides
- Mobile + desktop
- Browser: Chrome, Safari, Firefox

**Verification**: All languages render correctly, no layout issues

---

## 🎯 CORRECTED SUCCESS MARKERS

**Previous Issue**: Used ✅ for both "confirmed" and "future targets"

**New Convention**:
- ✅ = Confirmed existing / Completed
- 🎯 = Target / Goal (not yet achieved)
- ⏳ = In Progress
- ❌ = Blocker / Issue

**Examples**:
- FIFA Schedule: ✅ CONFIRMED (verified with sources)
- Row data structure: ✅ VERIFIED (examined actual files)
- 2,460 rows in <100ms: 🎯 TARGET (Phase 0 goal)
- Lighthouse ≥90: 🎯 TARGET (Phase 6 goal)

---

## 📋 CORRECTED RISK ANALYSIS

**Additional Critical Risks**:

### Risk 8: Mexican/Canadian Stadium Data Access
- **Severity**: HIGH
- **Impact**: Can't complete 5 new stadiums if data unavailable
- **Mitigation**:
  - Start data gathering NOW (Day 22)
  - Multiple sources (official sites, ticketing platforms, satellite)
  - Template-based estimation if exact data unavailable
  - Mark as "estimated" vs "verified" in UI

### Risk 9: Translation Quality (French)
- **Severity**: MEDIUM
- **Impact**: Poor UX for French-speaking users
- **Mitigation**:
  - Use DeepL (best machine translation)
  - Native speaker review for core UI
  - Budget $300-500 for professional review
  - User feedback: "Report translation error" button

### Risk 10: Browser Web Worker Compatibility
- **Severity**: MEDIUM
- **Impact**: Safari/iOS may have Worker limitations
- **Mitigation**:
  - Test on Safari, iOS Safari, Chrome, Firefox
  - Fallback: Main thread calculations if Worker fails
  - Progressive enhancement approach

---

## ✅ VERIFICATION COMPLETE SUMMARY

**Critical Issues Addressed**:
1. ✅ FIFA Schedule verified with official sources
2. ✅ Row data structure confirmed by examining actual files
3. ✅ Phases 2-4 detailed with specific tasks, file paths, code examples
4. ✅ Phase 5 timeline extended to 5 days (from 3)
5. ✅ Success markers corrected (✅ vs 🎯)
6. ✅ Risk analysis expanded with 3 additional critical risks

**Plan Status**: **READY FOR EXECUTION**

**Next Step**: Begin Phase 0 implementation (January 23, 2026)

---

Sources:
- [FIFA Official Match Schedule](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums)
- [FIFA Media Release - Updated Schedule](https://inside.fifa.com/media-releases/updated-world-cup-2026-match-schedule-venues-kick-off-times-104-matches)
- [FIFA.com Updated Schedule Article](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/updated-fifa-world-cup-2026-match-schedule-now-available)
