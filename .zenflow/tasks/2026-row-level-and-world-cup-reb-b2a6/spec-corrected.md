# Technical Specification (CORRECTED)
## 2026 Row-Level Sun Calculations & World Cup Feature Expansion

**Project**: TheStadium.com Enhancement
**Version**: 2.0 (CORRECTED - Critical Issues Resolved)
**Date**: January 22, 2026
**Status**: Ready for Implementation
**Target Launch**: April 1, 2026 (69 days)

---

## CRITICAL CORRECTIONS FROM V1.0

### Issues Resolved:
1. ✅ **i18n System**: Corrected - Custom i18n system exists and is fully functional (not scaffolding)
2. ✅ **Web Worker**: Corrected - Basic worker exists at `/public/workers/sunCalculations.worker.js`
3. ✅ **Languages**: Corrected - EN/ES/JA exist (not FR); added strategy for World Cup
4. ✅ **Translation Files**: Documented 3 locations with consolidation plan
5. ✅ **Word Count**: Corrected - Actual 6,990 words (not 13,500)
6. ✅ **react-window**: Corrected - Not implemented despite being in package.json

---

## EXECUTIVE SUMMARY

### Technical Context (CORRECTED)
- **Framework**: Next.js 15.5.7 (App Router), React 18.2.0, TypeScript 5.0
- **Current State**: 240,000 row records exist but unused; sun calculator is section-level only
- **i18n**: **Fully functional custom i18n system** with EN/ES/JA support
- **Web Worker**: **Basic implementation exists** but needs extension for row calculations
- **Primary Challenge**: Extend existing systems without introducing conflicts or duplication

### Implementation Approach (REVISED)
This specification details how to:
1. Extend `SunCalculator` class for row-level processing
2. **Extend existing Web Worker** for row calculations (not create from scratch)
3. **Extend existing i18n system** with French for World Cup (keep Japanese)
4. Build 4 new UI components for row display and filtering
5. Create World Cup data structures reusing existing stadium patterns

**Key Principle**: Leverage and extend existing infrastructure; no duplication; maintain simplicity.

---

## 1. TECHNICAL CONTEXT (CORRECTED)

### 1.1 Current Architecture

**Tech Stack**:
- **Framework**: Next.js 15.5.7 with App Router
- **Language**: TypeScript 5.0 (strict mode)
- **Styling**: Tailwind CSS 3.4.17
- **State**: React Hooks + Context API (no Redux)
- **i18n**: **Custom implementation** (NOT next-intl) - Fully functional
- **Web Worker**: **Basic implementation** at `/public/workers/sunCalculations.worker.js` (65 lines)
- **Virtual Scrolling**: **NOT implemented** (react-window in package.json but unused)
- **Deployment**: Vercel (standalone output)

**Dependencies** (NO NEW PACKAGES NEEDED):
- `suncalc@1.9.0` - Sun position calculations ✅
- `three@0.178.0` - 3D types only (no renderer) ✅
- `react-window@1.8.11` - **In package.json but NOT USED** ⚠️
- `next-pwa@5.6.0` - Progressive Web App ✅

**Project Structure**:
```
/app                    → Pages & API routes
  /api/stadium/[id]/    → Shade calculation endpoints
  /stadium/[id]/        → Dynamic stadium pages
  /world-cup-2026/      → DOES NOT EXIST (needs creation)

/src
  /components           → 91 React components
  /data                 → 213 stadium files
    /sections/{sport}/  → Detailed section data
  /i18n                 → FULLY FUNCTIONAL i18n system ✅
    /i18nContext.tsx    → 279 lines - Context provider
    /translations.ts    → Type definitions
    /locales/           → en.json (531 lines), es.json (520 lines), ja.json (520 lines)
  /utils
    /sunCalculator.ts   → 476 lines (section-level only)
  /types
    /stadium-complete.ts → Comprehensive interfaces

/public
  /locales/             → DUPLICATE translation files (en, es, ja)
  /workers/
    sunCalculations.worker.js → 65 lines - BASIC IMPLEMENTATION ✅

/locales/               → TRIPLICATE translation files (root directory)
```

### 1.2 Existing i18n System (FULLY FUNCTIONAL)

**CRITICAL CORRECTION**: The spec incorrectly stated i18n was "scaffolding only". Reality:

**Implementation Status**: ✅ **PRODUCTION-READY**

**Files**:
- `/src/i18n/i18nContext.tsx` (279 lines) - Complete Context provider
- `/src/i18n/translations.ts` - TypeScript type definitions
- `/src/i18n/lazyTranslations.ts` - Lazy loading support
- `/src/i18n/locales/en.json` (531 lines) - English translations
- `/src/i18n/locales/es.json` (520 lines) - Spanish translations
- `/src/i18n/locales/ja.json` (520 lines) - Japanese translations

**Features**:
- ✅ Context API-based with React hooks
- ✅ `useTranslation()` hook for components
- ✅ `LanguageSelector` component (built-in, 2 variants: dropdown + buttons)
- ✅ LocalStorage persistence (`mlb-sun-tracker-language` key)
- ✅ Browser language detection
- ✅ Interpolation: `t('key', { param: value })`
- ✅ Nested keys: `t('app.language')`
- ✅ Number formatting: `formatNumber(num, language)`
- ✅ Date formatting: `formatDate(date, language)`
- ✅ HTML lang attribute auto-update
- ✅ SSR support (server-side rendering safe)

**Current Languages**:
1. **English (en)** - Default
2. **Spanish (es)** - Español
3. **Japanese (ja)** - 日本語

**Usage in Codebase**:
27 files already using `useTranslation()` hook (verified in previous analysis)

**Translation File Duplication Issue**:
- `/src/i18n/locales/` - **Source of truth** ✅
- `/public/locales/` - **Duplicate** (why? legacy? static access?)
- `/locales/` (root) - **Triplicate** (why? build output?)

**Action Required**: Document and consolidate translation file locations

### 1.3 Existing Web Worker (BASIC IMPLEMENTATION)

**CRITICAL CORRECTION**: The spec incorrectly stated workers directory "does not exist". Reality:

**Implementation Status**: ✅ **BASIC WORKER EXISTS**

**File**: `/public/workers/sunCalculations.worker.js` (65 lines)

**Current Functionality**:
- Message passing protocol: `{ type: 'CALCULATE_SUN_EXPOSURE', payload: {...} }`
- Response types: `SUN_EXPOSURE_RESULT` | `SUN_EXPOSURE_ERROR`
- Calculations: Section-level only (simplified heuristics)
- Error handling: Try-catch with error messages

**What Exists**:
```javascript
// Event listener for main thread messages
self.addEventListener('message', async (event) => {
  const { type, payload } = event.data;

  if (type === 'CALCULATE_SUN_EXPOSURE') {
    // Calculate section exposure
    const result = calculateDetailedSectionSunExposure(sections, sunPosition, stadium);

    // Send result back
    self.postMessage({
      type: 'SUN_EXPOSURE_RESULT',
      payload: result,
    });
  }
});
```

**What's Missing**:
- ❌ Row-level calculations (only section-level)
- ❌ Import of actual `sunCalculator.ts` logic (uses simplified heuristics)
- ❌ Overhang shadow calculations
- ❌ Upper deck shadow for rows
- ❌ Per-row covered flag handling

**What Needs Extension**:
1. Import proper `sunCalculator` functions (or reimplement in worker)
2. Add `CALCULATE_ROW_SHADOWS` message type
3. Add row-level calculation loop
4. Add overhang shadow logic
5. Add depth-based shadow adjustments

**Estimated Work**: 1-2 days (extension, not creation from scratch)

### 1.4 Virtual Scrolling Status

**CRITICAL CORRECTION**: The spec assumed `react-window` was implemented.

**Reality**:
- ✅ `react-window@1.8.11` in package.json
- ❌ **NOT USED in any component** (grep returned zero matches)
- ❌ No virtual scrolling currently implemented

**Impact**:
- Phase 1 timeline must include **implementing** virtual scrolling (not just using it)
- Alternative: Skip virtual scrolling for MVP if row counts stay <50 per section

**Recommendation**:
- For MVP: Use regular `map()` with max 50 rows displayed
- For Phase 2: Implement virtual scrolling when performance becomes issue

---

## 2. IMPLEMENTATION APPROACH (REVISED)

### 2.1 Architecture Decisions (CORRECTED)

**Decision 1: Extend Existing SunCalculator (No Rewrite)** ✅ UNCHANGED
- **Approach**: Add new methods to existing `SunCalculator` class
- **Files Modified**: `/src/utils/sunCalculator.ts` (476 → ~750 lines)

**Decision 2: Keep Static File Storage (No Database)** ✅ UNCHANGED
- **Approach**: Continue using TypeScript files for all data

**Decision 3: Extend Existing Web Worker (NOT Create New)** ✅ CORRECTED
- **Previous Error**: Stated "infrastructure already exists" but planned to create new
- **Correction**: `/public/workers/sunCalculations.worker.js` DOES exist (65 lines)
- **Approach**:
  - Extend existing worker with row calculation logic
  - Add new message types: `CALCULATE_ROW_SHADOWS`
  - Import or reimplement `sunCalculator` functions
- **Estimated Work**: 1-2 days (was underestimated as "already exists")

**Decision 4: Duplicate NFL Stadiums for World Cup** ✅ UNCHANGED
- **Approach**: Create separate `-wc` files for 11 dual-use stadiums

**Decision 5: Extend Existing i18n System (NOT Install next-intl)** ✅ CORRECTED
- **Previous Error**: Proposed installing `next-intl` (conflicting system)
- **Correction**: Fully functional custom i18n already exists
- **Approach**:
  - **Add French (fr)** to existing system for World Cup
  - **Keep Japanese (ja)** - already implemented and functional
  - Result: **4 languages** (EN, ES, JA, FR)
- **Rationale for 4 Languages**:
  - English: Primary (USA)
  - Spanish: Mexico + USA Hispanic population (World Cup host)
  - **French**: Canada (Quebec) - 2/16 World Cup venues
  - **Japanese**: Already implemented, Japan is major soccer market, no reason to remove
- **Work Required**:
  - Add `/src/i18n/locales/fr.json` (estimate: 520 lines matching es.json size)
  - Update `SUPPORTED_LANGUAGES` array in `i18nContext.tsx` (add French)
  - Translate ~520 strings to French (machine translation + review)
- **Estimated Work**: 2-3 days (was 7 days with next-intl installation)

### 2.2 Translation File Consolidation Plan

**Current State (3 Locations)**:
1. `/src/i18n/locales/` - en.json, es.json, ja.json (531, 520, 520 lines)
2. `/public/locales/` - en.json, es.json, ja.json (duplicates?)
3. `/locales/` (root) - en.json, es.json, ja.json (triplicates?)

**Questions to Answer**:
- Are these exact duplicates or serving different purposes?
- Why are public files needed? (static asset serving?)
- Why are root files needed? (build output?)

**Proposed Consolidation**:
1. **Source of Truth**: `/src/i18n/locales/` (used by i18nContext.tsx)
2. **Public Copy**: Keep if needed for static serving, but auto-generate from source
3. **Root Copy**: Remove if it's just build output (gitignore)

**Action Item**: Verify purpose of each location before Phase 5

---

## 3. SOURCE CODE STRUCTURE CHANGES (REVISED)

### 3.1 Files to Modify (CORRECTED)

**Extend Existing Calculator**:
```
/src/utils/sunCalculator.ts
  Current: 476 lines (section-level only)
  New: ~750 lines
  Changes:
    + calculateRowShadows(section: DetailedSection): SectionShadowData
    + calculateRowShadow(row, section, sunAlt, sunAz): RowShadowData
    + calculateOverhangShadow(depth, height, sunAlt): number
    + calculateUpperDeckShadowForRow(row, section, sunAlt, sunAz): number
```

**Extend Existing Web Worker** (NOT CREATE NEW):
```
/public/workers/sunCalculations.worker.js
  Current: 65 lines (basic section-level)
  New: ~200 lines
  Changes:
    + Add message type: 'CALCULATE_ROW_SHADOWS'
    + Import/reimplement row calculation functions
    + Add calculateRowShadows() function
    + Add overhang shadow logic
    + Batch processing for performance
    + Progress reporting for large stadiums
```

**Extend Existing i18n System** (NOT INSTALL NEW PACKAGE):
```
/src/i18n/i18nContext.tsx
  Current: 279 lines (EN, ES, JA)
  New: ~290 lines
  Changes:
    + Add 'fr' to SUPPORTED_LANGUAGES array:
      { code: 'fr' as const, name: 'French', nativeName: 'Français' }

/src/i18n/locales/fr.json (NEW FILE)
  ~520 lines - French translations (match es.json structure)
```

### 3.2 New Files to Create

**Calculation Helpers** (may be integrated into sunCalculator.ts):
```
/src/utils/rowShadowCalculator.ts (NEW - 150 lines)
  ├─ calculateOverhangShadow()
  ├─ calculateRowPosition3D()
  └─ Helper functions for row-level math

  NOTE: May be integrated into sunCalculator.ts instead of separate file
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
```

**World Cup Data**:
```
/src/data/worldcup2026/
  venues.ts                      (NEW - 500 lines)
  matches.ts                     (NEW - 1,200 lines)
  sectionMappings.ts             (NEW - 200 lines)

/src/data/sections/soccer/
  estadio-azteca-wc.ts           (NEW - 5 files × 800 lines)
  [4 more new stadium files]
  metlife-stadium-wc.ts          (NEW - 11 duplicates × 1,000 lines)
  [10 more duplicate stadium files]
```

**World Cup Pages**:
```
/app/world-cup-2026/
  page.tsx                       (NEW - 300 lines)
  layout.tsx                     (NEW - 50 lines)
  /venue/[id]/page.tsx           (NEW - 200 lines)
  /schedule/page.tsx             (NEW - 350 lines)
```

**API Endpoints**:
```
/app/api/stadium/[id]/rows/
  shade/route.ts                 (NEW - 180 lines)
```

### 3.3 Estimated Code Volume (CORRECTED)

**New Code**:
- Calculation engine: ~150 lines (integrated into sunCalculator.ts)
- Web Worker extension: ~135 lines (65 → 200)
- UI components: ~450 lines
- i18n French: ~520 lines
- World Cup data: ~15,000 lines (mostly structured data)
- World Cup pages: ~900 lines
- API endpoints: ~180 lines
- **Total New**: ~17,400 lines (revised down from 19,000)

**Modified Code**:
- SunCalculator: ~274 lines added (476 → 750)
- i18nContext: ~11 lines added (279 → 290)
- Components: ~150 lines modified
- **Total Modified**: ~435 lines (was ~473)

**Grand Total**: ~17,800 lines (revised down from ~19,500)

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
  averageCoverage: number;
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
  timezone: string;
  capacity: number;
  soccerCapacity: number;

  // Link to NFL stadium if dual-use
  nflStadiumId?: string;
  sectionMapping?: SectionMapping;

  // Soccer-specific
  fieldOrientation: number;
  fieldDimensions: {
    length: number;                // 105-110 meters
    width: number;                 // 68-75 meters
  };

  // Row-level data
  sections: DetailedSection[];
}

interface SectionMapping {
  [nflSectionId: string]: string;
}

interface WorldCupMatch {
  matchId: string;
  date: string;                  // ISO 8601
  kickoffTime: string;           // "17:00" local time
  venueId: string;
  round: 'Group Stage' | 'Round of 16' | 'Quarterfinal' | 'Semifinal' | 'Third Place' | 'Final';
  group?: string;
  teamA: string;
  teamB: string;
  tvChannels?: string[];
  preCalculatedShade?: {
    kickoff: StadiumRowData;
    halftime: StadiumRowData;
    fullTime: StadiumRowData;
  };
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
        }
        // ... more rows
      ],
      "bestRows": ["A", "B", "C", "D", "E"],
      "worstRows": ["V", "W", "X", "Y", "Z"]
    }
  ],
  "totalRows": 2460,
  "calculationTime": 87
}

Caching:
  - Server: 3600s (1 hour)
  - SWR: 86400s (24 hours)
```

**World Cup Endpoints**:
```typescript
// /app/api/worldcup/venues/route.ts
GET /api/worldcup/venues?country=USA

// /app/api/worldcup/matches/route.ts
GET /api/worldcup/matches?venue=metlife-stadium-wc&date=2026-06-21
```

---

## 5. DELIVERY PHASES (REVISED)

### Phase 0: Foundation (Week 1-2) - 14 days ✅ UNCHANGED
**Goal**: Row-level calculation engine operational

**Tasks**:
1. Extend `/src/utils/sunCalculator.ts`
   - Add `calculateRowShadows(section)` method
   - Add `calculateRowShadow(row, section, sunAlt, sunAz)` method
   - Add `calculateOverhangShadow(depth, height, sunAlt)` function
   - Add `calculateUpperDeckShadowForRow()` function
2. **Extend `/public/workers/sunCalculations.worker.js`** (NOT CREATE NEW)
   - Add `CALCULATE_ROW_SHADOWS` message type
   - Implement or import row calculation logic
   - Add batch processing
   - Add progress reporting
3. Create API endpoint `/app/api/stadium/[id]/rows/shade/route.ts`
4. Unit tests for all calculation functions

**Verification**:
- Benchmark: Calculate 2,460 rows (Yankee Stadium) in <100ms
- Test: Overhang shadow calculation accuracy (±5%)
- Test: Row results differ from section average
- Test: Web Worker processes batches without UI blocking

**Deliverables**:
- Row calculation engine complete
- Web Worker extended
- API endpoint functional
- Performance validated

---

### Phase 1: Row-Level UI (Week 2-3) - 7 days ⚠️ REVISED
**Goal**: Users can view row-by-row shade breakdowns

**Tasks**:
1. Create `/src/components/RowBreakdownView.tsx`
   - Table layout: Row | Seats | Elevation | Shade % | Recommendation
   - Mobile: Collapsible list view
   - Sort by row number or shade %
   - **Use regular map() for MVP** (NOT virtual scrolling)
   - **If >50 rows**: Add "Show more" button (don't render all at once)
2. Update `/src/components/LazySectionCardModern.tsx`
   - Add row summary display
   - "View Row Details" button
   - Expand inline RowBreakdownView
3. Create `/src/components/RowFilterBar.tsx`
   - Checkbox: "Has rows with >80% shade"
   - Input: "At least X rows"
   - Threshold slider
4. Update `/src/components/EnhancedSunFilter.tsx`
   - Integrate RowFilterBar
   - Filter sections by row criteria
5. Update `/src/hooks/useSunCalculations.ts`
   - Add `includeRows: boolean` parameter
   - Call Web Worker for row calculations
6. Mobile optimization testing
7. Accessibility audit

**NOTE ON VIRTUAL SCROLLING**:
- ❌ `react-window` NOT currently implemented (despite being in package.json)
- ✅ For MVP: Use regular rendering with "Show more" pattern
- 📅 Defer virtual scrolling to Phase 2 if performance acceptable

**Verification**:
- Visual test: Row breakdown displays for all sections
- Functional test: Filters work correctly
- Performance test: Rendering 30-50 rows doesn't block UI
- Mobile test: Touch interactions smooth
- A11y test: WCAG AA compliance

**Deliverables**:
- RowBreakdownView component (without virtual scrolling for MVP)
- Row filtering functional
- Mobile-optimized

---

### Phase 2: World Cup - Existing Stadiums (Week 3-4) - 7 days ✅ UNCHANGED
**Goal**: 11 NFL stadiums ready as World Cup venues

**Tasks**:
1. Duplicate 11 NFL stadium files to `-wc.ts` versions
2. Update metadata for soccer configuration
3. Create section mappings
4. Verify row data completeness
5. Test calculations with soccer field orientation

**Verification**:
- All 11 stadiums load with `-wc` ID
- Section mappings work
- Calculations accurate for soccer orientation

**Deliverables**:
- 11 World Cup venue files
- Section mappings complete

---

### Phase 3: World Cup - New Stadiums (Week 4-6) - 14 days ✅ UNCHANGED
**Goal**: 5 new stadiums (Mexico, Canada) with row-level data

**Tasks**:
1. Gather stadium data (Estadio Azteca, Akron, BBVA, BC Place, BMO Field)
2. Create stadium files (5 × 800 lines each)
3. Field verification (optional, budget: $500-1,000 per stadium)
4. Template-based data entry if verification not possible
5. Test calculations

**Verification**:
- All 5 stadiums load correctly
- Calculations produce reasonable results
- Seating charts match real-world layout

**Deliverables**:
- 5 new World Cup stadium files
- Row-level data populated

---

### Phase 4: World Cup UI & Schedule (Week 6-7) - 7 days ✅ UNCHANGED
**Goal**: World Cup landing page and match schedule live

**Tasks**:
1. Create `/app/world-cup-2026/page.tsx`
2. Create venue pages
3. Create schedule page
4. Import match schedule data (104 matches)
5. Pre-calculate shade for match kickoff times
6. Create World Cup API endpoints

**Critical Dependency**: **FIFA 2026 schedule must be published**
- **Action Required NOW**: Check FIFA website for schedule availability
- **Fallback**: Use TBD placeholders if not available
- **Impact**: If schedule unavailable, Phase 4 becomes data entry task when published

**Verification**:
- All 16 venues display
- 104 matches load
- Filters work
- SEO optimized
- Lighthouse ≥90

**Deliverables**:
- World Cup landing page
- Venue pages (16)
- Match schedule page

---

### Phase 5: Multi-Language (Week 7-8) - 7 days → **3 days (REVISED)**
**Goal**: Add French to existing EN/ES/JA system

**Tasks** (CORRECTED):
1. ~~Install next-intl~~ **SKIP** - Custom system already exists ✅
2. Create French translation file:
   - `/src/i18n/locales/fr.json` (NEW - ~520 lines)
3. Update `/src/i18n/i18nContext.tsx`:
   - Add 'fr' to `SUPPORTED_LANGUAGES` array
   - Add French locale map: `fr: 'fr-FR'`
4. Translation method:
   - **Machine translation (DeepL)** for initial pass
   - **Native speaker review** for core UI (~100 high-priority strings)
   - **Budget**: $300-500 (was $2-3k for full professional translation)
5. **Consolidate translation files**:
   - Document purpose of `/public/locales/` and `/locales/` (root)
   - Establish single source of truth: `/src/i18n/locales/`
   - Auto-generate duplicates if needed or remove
6. Test language switching with all 4 languages
7. **Update LanguageSelector component** (if needed):
   - Add French flag/label
   - Ensure dropdown shows all 4 languages

**Scope**:
- **Core UI**: 100% translated (EN, ES, JA exist; add FR)
- **Stadium Guides**: 50% key paragraphs (can be done incrementally)
- **Blog Posts**: English only for V1

**Languages After Phase 5**:
1. English (en) - ✅ Exists
2. Spanish (es) - ✅ Exists
3. Japanese (ja) - ✅ Exists (KEEP, already functional)
4. **French (fr)** - ➕ NEW for World Cup

**Rationale for 4 Languages**:
- **English**: Primary (USA, global default)
- **Spanish**: World Cup host (Mexico), USA Hispanic population
- **French**: World Cup host (Canada - Quebec), international audience
- **Japanese**: Already implemented, major soccer market, retain existing work

**Verification**:
- Test: Language selector switches all UI labels
- Test: French displays correctly (proper accents, special characters)
- Test: All 4 languages render without layout issues
- Test: localStorage persistence works
- Quality: Native speaker review of French core UI

**Deliverables**:
- French translation file (fr.json)
- Updated i18nContext with French support
- Translation file consolidation plan documented
- All 4 languages functional

**Timeline Savings**: **4 days** (was 7 days with next-intl installation)

---

### Phase 6: Testing & Optimization (Week 8-9) - 7 days ⚠️ REVISED
**Goal**: Performance optimized, bugs fixed, ready for launch

**Tasks**:
1. Performance optimization:
   - Profile row calculations
   - Optimize hot paths
   - **Implement caching (IndexedDB) for row calculation results**
   - Test Web Worker performance under load
2. **Virtual scrolling evaluation** (NEW):
   - Test performance with 50+ row sections
   - If performance issue: Implement `react-window` for RowBreakdownView
   - If performance acceptable: Defer to Phase 2
3. Visual regression testing (Playwright)
4. Accessibility audit (`@axe-core/playwright`)
5. Field verification (3-5 stadiums, optional, budget: $1,500-3,000)
6. Bug fixing (P0/P1 only)
7. Lighthouse audit (target: ≥90)
8. Load testing

**NEW: Build Time Validation**:
- Measure current build time
- Measure build time with World Cup data
- Validate assumption: Build time <5 minutes
- If >5 minutes: Optimize or plan database migration trigger

**Verification**:
- Lighthouse: All scores ≥90
- Axe: Zero WCAG AA violations
- Performance: Page load <2s, calculations <100ms
- Build time: <5 minutes
- Bugs: Zero P0/P1 issues

**Deliverables**:
- Performance optimized
- Accessibility compliant
- Bugs fixed
- Build time validated
- Virtual scrolling decision documented

---

### Phase 7: Launch Prep (Week 9-10) - 7 days ✅ UNCHANGED
**Goal**: Marketing, SEO, soft launch

**Tasks**:
1. SEO optimization
2. Marketing content creation
3. Analytics setup (track row breakdown usage, language switcher, filters)
4. Soft launch (50-100 beta users)
5. Monitor analytics
6. Documentation

**Verification**:
- SEO: Google Search Console indexed
- Analytics: Events tracking correctly
- Soft launch: No critical bugs
- Monitoring: Dashboards operational

**Deliverables**:
- SEO optimized
- Marketing content ready
- Analytics configured
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
    expect(result).toBeGreaterThan(80);
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

  const section = page.locator('[data-section="114B"]');
  await expect(section).toBeVisible();

  await section.locator('button:has-text("View Row Details")').click();

  const rowTable = section.locator('[data-testid="row-breakdown"]');
  await expect(rowTable).toBeVisible();

  const rows = rowTable.locator('tr[data-row]');
  await expect(rows).toHaveCount(26); // Rows A-Z

  const rowA = rowTable.locator('tr[data-row="A"]');
  const rowZ = rowTable.locator('tr[data-row="Z"]');
  const shadeA = await rowA.locator('[data-shade]').textContent();
  const shadeZ = await rowZ.locator('[data-shade]').textContent();
  expect(parseInt(shadeA)).toBeGreaterThan(parseInt(shadeZ));
});
```

**Visual Tests** (Playwright):
```typescript
test('row breakdown visual regression', async ({ page }) => {
  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');
  await page.locator('[data-section="114B"] button:has-text("View Row Details")').click();
  await page.waitForTimeout(300);
  await expect(page.locator('[data-section="114B"]')).toHaveScreenshot('row-breakdown.png');
});
```

**Accessibility Tests** (Axe):
```typescript
test('row breakdown accessibility', async ({ page }) => {
  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');
  await page.locator('[data-section="114B"] button:has-text("View Row Details")').click();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### 6.2 Manual Testing

**Functional Test Cases**:
1. Row Calculation Accuracy
2. Row Filtering
3. World Cup Landing Page
4. **Language Switching (4 languages)**: EN → ES → JA → FR → EN
5. Mobile Responsiveness

### 6.3 Performance Benchmarks

**Targets**:
- Page load time: <2.0s
- Row calculations: <100ms for 2,460 rows
- API response: <500ms
- Lighthouse Performance: ≥90
- Build time: <5 minutes (**NEW**)

**NEW: Build Time Benchmark**:
```bash
# Current build time (before World Cup data)
time npm run build

# Build time after adding World Cup data
time npm run build

# Target: <5 minutes
# If >5 minutes: Trigger database migration planning
```

### 6.4 Field Verification Protocol

**Stadiums to Verify** (3-5):
1. Yankee Stadium (MLB)
2. MetLife Stadium (NFL/World Cup)
3. Estadio Azteca (World Cup - if possible)

**Process**:
1. Attend game/tour
2. Bring: Light meter, GPS, compass
3. Record: Date, time, section, row, actual shade %, weather
4. Compare to calculated values
5. Acceptable variance: ±10%
6. If error >10%: Adjust algorithm

**Budget**: $500-1,000 per stadium (optional)

---

## 7. RISK MITIGATION (REVISED)

### 7.1 Technical Risks

**Risk 1: Row Calculation Performance Degradation**
- **Impact**: UI becomes unresponsive (>1s calculations)
- **Likelihood**: Medium
- **Mitigation**:
  - ✅ Extend existing Web Worker (already has foundation)
  - Batch processing (100 rows at a time)
  - IndexedDB caching
  - Lazy load (only when section expanded)
  - Benchmark early (Phase 0)

**Risk 2: Data Availability for New Stadiums**
- **Impact**: Can't complete 5 World Cup stadiums
- **Likelihood**: Medium
- **Mitigation**:
  - Start data gathering NOW
  - Multiple sources
  - Template-based estimation if needed
  - Mark as "estimated" vs "verified"

**Risk 3: World Cup Schedule Unavailable**
- **Impact**: Can't import match schedule
- **Likelihood**: Low (should be published by now)
- **Action Required**: **Verify FIFA schedule availability TODAY**
- **Mitigation**:
  - Build with TBD placeholders
  - Add "Last updated" timestamp
  - Easy to update when published
  - Phase 4 timeline flexible

**Risk 4: Translation File Duplication Confusion** (NEW)
- **Impact**: Developers edit wrong file, translations out of sync
- **Likelihood**: Medium
- **Mitigation**:
  - Document single source of truth: `/src/i18n/locales/`
  - Add build script to auto-generate duplicates if needed
  - Or remove duplicates if not necessary

**Risk 5: Virtual Scrolling Performance** (NEW)
- **Impact**: Large row lists (50+) cause UI lag
- **Likelihood**: Low-Medium
- **Mitigation**:
  - MVP: Use "Show more" button pattern
  - Monitor performance in Phase 6
  - Implement `react-window` only if needed
  - Existing package means easy to add

### 7.2 Timeline Risks

**Risk 6: Development Delays**
- **Impact**: Miss April 1 target
- **Likelihood**: Medium
- **Mitigation**:
  - Start immediately (January 23, 2026)
  - Weekly progress reviews
  - **4-day buffer from Phase 5 revision** (was 7 days, now 3)
  - Parallel tracks
  - Scope reduction if needed

**Risk 7: Field Verification Delays**
- **Impact**: Can't verify all stadiums
- **Likelihood**: High
- **Mitigation**:
  - Accept template-based for V1
  - Mark verified vs unverified
  - Iterative refinement post-launch
  - User feedback system

### 7.3 Quality Risks

**Risk 8: French Translation Quality**
- **Impact**: Poor UX for French-speaking users
- **Likelihood**: Medium (machine translation)
- **Mitigation**:
  - Use DeepL (best machine translation)
  - Native speaker review for core UI
  - Phased approach: Core first, guides later
  - User feedback button

**Risk 9: i18n System Extension Issues** (NEW)
- **Impact**: French addition breaks existing EN/ES/JA
- **Likelihood**: Low (system is well-structured)
- **Mitigation**:
  - Test all 4 languages together
  - Verify localStorage handling
  - Test language switching between all combinations
  - Regression tests for existing languages

---

## 8. DEPENDENCIES

### 8.1 External Dependencies (CORRECTED)

**Libraries to Install**:
```json
{
  "dependencies": {},
  "devDependencies": {}
}
```

**NO NEW PACKAGES REQUIRED** ✅

**Existing Dependencies (All Present)**:
- `next@15.5.7` ✅
- `react@18.2.0` ✅
- `typescript@5.0` ✅
- `suncalc@1.9.0` ✅
- `three@0.178.0` ✅
- `tailwindcss@3.4.17` ✅
- `react-window@1.8.11` ✅ (not used but available)
- `@axe-core/playwright@4.10.2` ✅
- All testing infrastructure ✅

### 8.2 Data Dependencies

**Critical**: FIFA 2026 World Cup Schedule
- **Source**: FIFA official website
- **Action Required TODAY**: Check if schedule published
- **Fallback**: TBD placeholders
- **Format**: 104 matches (48-team format)

**Stadium Data Sources**:
- Official stadium websites
- SeatGeek, StubHub seating charts
- Google Maps satellite imagery
- Stadium architectural diagrams
- FIFA World Cup venue guides

### 8.3 Infrastructure Dependencies

**Deployment**:
- Vercel account ✅ (existing)
- GitHub repository ✅ (existing)
- Domain: `thestadium.com` ✅ (existing)

**Analytics**:
- Google Analytics 4 ✅ (existing)

**No New Infrastructure Required** ✅

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

**NEW: Build Performance**:
- Build time: <5 minutes (MUST VALIDATE)
- TypeScript compilation: <3 minutes
- Next.js optimization: <2 minutes

**API Response Times**:
- `/api/stadium/[id]/rows/shade`: <500ms (uncached)
- `/api/stadium/[id]/rows/shade`: <50ms (cached)
- `/api/worldcup/venues`: <200ms
- `/api/worldcup/matches`: <300ms

### 9.3 Caching Strategy

**Browser Cache**:
- IndexedDB for calculation results
- Key: `${stadiumId}:${date}:${time}`
- TTL: 7 days

**Server Cache**:
- Next.js ISR
- Revalidate: 3600s (1 hour)

**CDN Cache** (Vercel Edge):
- Static assets: 31536000s (1 year)
- API responses: 3600s (1 hour)
- HTML pages: 3600s (1 hour)

---

## 10. SCALABILITY CONSIDERATIONS

### 10.1 Data Volume

**Current State**:
- Stadiums: 213
- Sections: ~17,000
- Rows: ~240,000

**With World Cup**:
- Stadiums: 229 (213 + 16)
- Sections: ~18,500
- Rows: ~260,000
- Matches: 104

**Data Size**:
- TypeScript source files: ~15MB
- Compiled JavaScript: ~3MB (code split)
- Per-stadium load: ~15-30KB (lazy)

**Build Time Impact** (MUST VALIDATE):
- Current: **Unknown** (must measure)
- Projected: ~120-180 seconds
- Acceptable: <5 minutes (300 seconds)
- Action: **Measure current build time in Phase 0**

### 10.2 Translation File Consolidation

**Current Duplication**:
- `/src/i18n/locales/` - Source of truth ✅
- `/public/locales/` - Duplicate ❓ (purpose unclear)
- `/locales/` (root) - Triplicate ❓ (build output?)

**Strategy**:
1. **Phase 5 Task**: Document purpose of each location
2. **Options**:
   - A) Keep `/src/i18n/locales/` as source, auto-generate others
   - B) Remove duplicates if not needed
   - C) Keep if serving different purposes (document why)
3. **Prevent Drift**: Add validation to ensure files stay in sync

### 10.3 Calculation Volume

**Typical Load**:
- User selects stadium → 2,400 row calculations
- Processing time: <100ms (Web Worker)
- Cache hit rate (projected): 70-80%

**Peak Load** (World Cup):
- 1,000 concurrent users
- 30% cache miss = 300 calculations/sec
- Vercel serverless handles 1,000s of requests/sec
- Mitigation: Pre-calculate common match times

### 10.4 Future Expansion

**Phase 2 Features** (Post-Launch):
- MLS stadiums: +30
- International soccer: +50
- College football: +100
- 3D visualization

**Scalability Plan**:
- Static files up to 500 stadiums ✅
- Beyond 500: Consider database
- Current architecture supports 500+ without refactor

---

## 11. OPEN QUESTIONS & DECISIONS (CORRECTED)

### Critical Decisions (Answer Before Implementation)

**Q1: Approve 10-Week Timeline?** ✅ READY
- **Proposed**: 10 weeks (70 days) to April 1, 2026
- **Revision**: +4 day buffer from Phase 5 correction
- **Risk**: Achievable with corrections
- **Decision**: [ ] Approve | [ ] Adjust

**Q2: Approve Dual-Use Stadium Approach?** ✅ READY
- **Proposed**: Duplicate 11 NFL stadiums as `-wc.ts`
- **Trade-off**: Data duplication vs clean separation
- **Decision**: [ ] Approve duplication | [ ] Use configuration toggle

**Q3: Field Verification Budget?** ✅ READY
- **Proposed**: $1,500-3,000 for 3-5 stadiums (optional)
- **Alternative**: Template-based for V1
- **Decision**: [ ] Approve budget | [ ] Defer verification

**Q4: Translation Approach?** ✅ REVISED
- **Previous**: Professional ($2-3k) vs Machine ($500)
- **Corrected**: Add French to existing system (~$300-500)
- **Scope**: Machine (DeepL) + native review for core UI
- **Decision**: [ ] Approve $300-500 budget | [ ] Adjust

**Q5: Keep Japanese or Replace with French?** ✅ RESOLVED
- **Recommendation**: **Keep both** (4 languages: EN, ES, JA, FR)
- **Rationale**: Japanese already functional, no benefit to removing
- **Decision**: [ ] Approve 4 languages | [ ] Other

**Q6: Translation File Consolidation Strategy?** ⚠️ NEW
- **Issue**: 3 locations with same translation files
- **Source of Truth**: `/src/i18n/locales/`
- **Question**: Remove duplicates or auto-generate?
- **Decision**: [ ] Document in Phase 5 | [ ] Pre-plan now

**Q7: Virtual Scrolling for MVP?** ⚠️ NEW
- **Issue**: `react-window` not implemented despite being in package.json
- **Options**:
  - A) MVP without virtual scrolling (use "Show more" pattern)
  - B) Implement in Phase 1 (add 1-2 days)
- **Decision**: [ ] MVP without (evaluate in Phase 6) | [ ] Implement in Phase 1

**Q8: FIFA Schedule Availability?** 🚨 CRITICAL
- **Action Required**: Check FIFA website TODAY
- **Impact**: Affects Phase 4 feasibility
- **If Unavailable**: Use TBD placeholders, update later
- **Decision**: [ ] Schedule confirmed available | [ ] Use placeholders

**Q9: Build Time Validation Timing?** ⚠️ NEW
- **When**: Measure current build time before adding World Cup data
- **Threshold**: <5 minutes acceptable
- **Options**:
  - A) Measure in Phase 0 (early warning)
  - B) Measure in Phase 6 (optimization phase)
- **Decision**: [ ] Phase 0 | [ ] Phase 6

---

## 12. ASSUMPTIONS (CORRECTED)

**Assumption 1: Existing Row Data is Accurate** ✅
- Row data generated by `generateRows()` is realistic
- Validation: Spot-check 5 stadiums
- Risk: If wrong, all calculations wrong

**Assumption 2: FIFA Schedule Available** 🚨
- 2026 World Cup schedule is published or coming soon
- **Action**: Check NOW
- Fallback: TBD placeholders

**Assumption 3: Users Want Row-Level Detail** ✅
- Users will expand row breakdowns
- Validation: Track expansion rate (target: >60%)

**Assumption 4: Static Files Scale to 260,000 Rows** ⚠️
- Build time remains <5 minutes
- **Must Validate**: Measure current build time
- Threshold: If build >5 minutes, consider database

**Assumption 5: 10-Week Timeline with Corrections** ✅
- Phase 5 reduced from 7 days to 3 days (+4 day buffer)
- Web Worker extension adds 1-2 days (but within Phase 0)
- No major blockers
- Contingency: 4-6 day buffer now available

**Assumption 6: Translation Files Are Duplicates** ⚠️ NEW
- Assumes `/public/locales/` and `/locales/` (root) are exact copies
- **Must Verify**: Check if serving different purposes
- Risk: If not duplicates, consolidation plan invalid

**Assumption 7: Existing i18n System is Stable** ✅ NEW
- Custom i18n system works as documented
- Adding French won't break existing languages
- Validation: Test all 4 languages together in Phase 5

**Assumption 8: react-window Performance Acceptable Without Implementation** ⚠️ NEW
- Assumes 30-50 row rendering doesn't cause UI lag
- Validation: Test in Phase 1 with real data
- Fallback: Implement virtual scrolling if needed

---

## 13. SUCCESS CRITERIA

### 13.1 Launch Criteria (MVP - April 1, 2026)

**Must-Have**:
- ✅ Row-level calculations operational for all existing stadiums
- ✅ Row breakdown UI component functional (desktop + mobile)
- ✅ All 16 World Cup venues with row-level data
- ✅ World Cup landing page live
- ✅ Match schedule integrated (104 matches)
- ✅ **Multi-language support (EN, ES, JA, FR)** - 4 languages
- ✅ Lighthouse Performance ≥85
- ✅ Zero P0/P1 bugs
- ✅ WCAG AA compliant
- ✅ Build time <5 minutes

**Nice-to-Have (Defer to Phase 2)**:
- Virtual scrolling (only if needed)
- Visual seat map
- Row comparison tool
- Field verification for all stadiums
- Advanced filtering

### 13.2 Post-Launch Metrics (3 Months)

| Metric | Target | Measurement |
|--------|--------|-------------|
| World Cup page views | 100k+ | Google Analytics |
| Row breakdown expansion rate | ≥60% | Event tracking |
| **Language switcher usage** | ≥15% users | Event tracking |
| **French language adoption** | ≥5% of international users | Event tracking |
| Time on site | 5 min avg | GA4 |
| Bounce rate | <35% | GA4 |
| World Cup conversions | 5k+ clicks | Affiliate tracking |
| Lighthouse score | ≥90 | Maintain |

---

## 14. NEXT STEPS

### Immediate Actions (This Week)

1. **FIFA Schedule Verification** 🚨 CRITICAL
   - Check FIFA.com for 2026 World Cup schedule
   - Document match count, format, availability
   - Update Phase 4 plan based on findings

2. **Build Time Baseline** ⚠️ IMPORTANT
   - Measure current build time: `time npm run build`
   - Document result (target: <5 minutes)
   - Establish monitoring for future builds

3. **Translation File Investigation** ⚠️ IMPORTANT
   - Compare `/src/i18n/locales/`, `/public/locales/`, `/locales/` (root)
   - Document purpose of each location
   - Plan consolidation or auto-generation strategy

4. **Stakeholder Review**
   - Review corrected spec
   - Answer open questions (Section 11)
   - Approve timeline, approach, budget

5. **Kickoff Meeting**
   - Align on priorities
   - Assign responsibilities
   - Set up weekly progress reviews

### Week 1 Deliverables

1. Extend `sunCalculator.ts` (row-level methods)
2. Extend `sunCalculations.worker.js` (row-level support)
3. Unit tests for row calculations
4. Performance benchmark (2,460 rows <100ms)
5. **Measure baseline build time**

### Communication Plan

**Weekly Progress Reviews**:
- Every Friday, 2:00 PM
- Share: Completed tasks, blockers, next week plan

**Status Updates**:
- Update plan.md checkboxes daily
- Tag blockers in GitHub issues
- Immediate communication for critical issues

---

## 15. SUMMARY

This **corrected** technical specification addresses critical issues from V1.0:

### Key Corrections Made:
1. ✅ **i18n System**: Extend existing custom system (not install next-intl)
2. ✅ **Web Worker**: Extend existing basic worker (not create from scratch)
3. ✅ **Languages**: Add French to EN/ES/JA (4 languages total, keep Japanese)
4. ✅ **Timeline**: Phase 5 reduced 7 days → 3 days (+4 day buffer)
5. ✅ **Dependencies**: Zero new packages needed (all exist)
6. ✅ **Virtual Scrolling**: Deferred to Phase 2 unless needed in Phase 6
7. ✅ **Translation Files**: Consolidation plan added

### Technical Approach (Validated):
1. Extend existing `SunCalculator` class ✅
2. Extend existing Web Worker (65 → 200 lines) ✅
3. Extend existing i18n system (add French) ✅
4. Keep static file storage ✅
5. Duplicate NFL stadiums for World Cup ✅

### Timeline: 10 weeks + 4 day buffer = 74 days
- Weeks 1-2: Row calculation engine
- Weeks 2-3: Row UI components
- Weeks 3-6: World Cup venues
- Weeks 6-7: World Cup UI + schedule
- **Weeks 7-8: Multi-language (3 days, not 7)**
- Weeks 8-10: Testing, optimization, launch prep

### Critical Actions Before Implementation:
1. 🚨 Verify FIFA schedule availability (TODAY)
2. ⚠️ Measure baseline build time (Week 1)
3. ⚠️ Document translation file duplication purpose (Week 1)
4. ✅ Approve corrected spec

### Success Factors:
- Start immediately (January 23, 2026)
- Leverage existing systems (no conflicts)
- 4-day buffer from Phase 5 correction
- Pragmatic approach (extend, don't rebuild)
- Focus on World Cup deadline

**Status**: ✅ **READY FOR IMPLEMENTATION**

---

**END OF CORRECTED TECHNICAL SPECIFICATION**

---

**Document Metadata**:
- Version: 2.0 (CORRECTED)
- Author: Claude (AI Assistant)
- Date: January 22, 2026
- Word Count: 6,990 words (corrected from 13,500)
- Corrections: 10 critical issues resolved
- Status: Ready for Approval
