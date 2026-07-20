# Implementation Plan
## 2026 Row-Level Sun Calculations & World Cup Feature Expansion

**Project**: TheStadium.com Enhancement
**Version**: 1.0
**Date**: January 22, 2026
**Status**: Ready for Execution
**Target Launch**: April 1, 2026 (69 days)

---

## PLAN OVERVIEW

### Timeline Summary
- **Total Duration**: 10 weeks (70 days)
- **Start Date**: January 23, 2026 (tomorrow)
- **Launch Date**: April 1, 2026
- **Buffer**: 4 days from Phase 5 optimization

### Phase Breakdown
```
Phase 0: Foundation          (Week 1-2)   14 days  → Row calculation engine
Phase 1: Row UI              (Week 2-3)    7 days  → User interface components
Phase 2: WC Existing         (Week 3-4)    7 days  → 11 NFL → WC duplicates
Phase 3: WC New Stadiums     (Week 4-6)   14 days  → 5 new venues
Phase 4: WC UI & Schedule    (Week 6-7)    7 days  → Landing page + matches
Phase 5: Multi-Language      (Week 7-8)    3 days  → Add French to EN/ES/JA
Phase 6: Testing & Opt       (Week 8-9)    7 days  → Performance + bugs
Phase 7: Launch Prep         (Week 9-10)   7 days  → Marketing + soft launch
```

### Critical Dependencies
1. **FIFA Schedule**: ✅ CONFIRMED AVAILABLE (104 matches published)
2. **Row Data**: ✅ EXISTS (240,000 rows in TypeScript files)
3. **i18n System**: ✅ FUNCTIONAL (custom system, need to add French)
4. **Web Worker**: ✅ EXISTS (basic implementation, needs row extension)

---

## PHASE 0: FOUNDATION (Week 1-2) - 14 days

**Goal**: Row-level calculation engine operational

### Week 1: Core Calculation Logic

#### Task 0.1: Performance Baseline & Setup (Day 1 - Jan 23)
**Owner**: TBD
**Duration**: 4 hours

**Deliverables**:
1. Measure current build time: `time npm run build`
   - Record: ____ seconds (target: <5 minutes)
   - Create baseline document in `/docs/performance-baseline.md`

2. Benchmark current section-level calculations:
   ```bash
   # Create benchmark script
   node scripts/benchmark-sun-calculator.js
   ```
   - Test: Yankees Stadium (82 sections)
   - Record: Current calculation time
   - Target: Establish acceptable threshold

3. Set up development branch:
   ```bash
   git checkout -b feat/row-level-calculations
   ```

**Verification**:
- [ ] Build time documented
- [ ] Performance baseline recorded
- [ ] Development environment ready

---

#### Task 0.2: Extend SunCalculator - Core Row Method (Days 1-2 - Jan 23-24)
**Owner**: TBD
**Duration**: 12 hours
**File**: `/src/utils/sunCalculator.ts` (476 → ~600 lines)

**Implementation Steps**:

1. **Add Row Shadow Data Interface** (lines ~480-510):
   ```typescript
   // /src/types/shadow.ts (extend existing file)

   export interface RowShadowData {
     rowNumber: string;
     seats: number;
     elevation: number;      // feet above field
     depth: number;          // feet from section front
     coverage: number;       // 0-100%
     sunExposure: number;    // 0-100%
     inShadow: boolean;
     shadowSources: {
       roof: number;
       upperDeck: number;
       overhang: number;     // NEW
       bowl: number;
     };
     recommendation?: 'excellent' | 'good' | 'fair' | 'poor';
   }

   export interface SectionShadowData {
     sectionId: string;
     sectionName: string;
     rows: RowShadowData[];
     averageCoverage: number;
     bestRows: string[];     // Top 5 rows by shade
     worstRows: string[];    // Top 5 rows by sun
   }
   ```

2. **Add calculateRowShadow() Method** (lines ~511-600):
   ```typescript
   export function calculateRowShadow(
     row: RowDetail,
     section: DetailedSection,
     sunAltitude: number,
     sunAzimuth: number,
     stadiumOrientation: number = 0
   ): RowShadowData {

     // 1. If row explicitly covered, return 100% shade
     if (row.covered === true) {
       return {
         rowNumber: row.rowNumber,
         seats: row.seats,
         elevation: row.elevation,
         depth: row.depth,
         coverage: 100,
         sunExposure: 0,
         inShadow: true,
         shadowSources: { roof: 100, upperDeck: 0, overhang: 0, bowl: 0 },
         recommendation: 'excellent'
       };
     }

     // 2. Calculate base sun exposure (reuse existing section logic)
     const sectionAngle = section.baseAngle + stadiumOrientation;
     let baseSunExposure = calculateBaseSunExposure(sectionAngle, sunAzimuth);

     // 3. Apply altitude factor
     if (sunAltitude < 30) {
       baseSunExposure *= (sunAltitude / 30);
     }

     // 4. Calculate overhang shadow (NEW - depth-dependent)
     const overhangShadow = calculateOverhangShadow(
       row.depth,
       row.overhangHeight || 0,
       sunAltitude
     );

     // 5. Calculate upper deck shadow (elevation + depth dependent)
     const upperDeckShadow = calculateUpperDeckShadowForRow(
       row.elevation,
       row.depth,
       section,
       sunAltitude,
       sunAzimuth
     );

     // 6. Calculate roof shadow (if applicable)
     const roofShadow = section.covered ? 100 : 0;

     // 7. Combine shadow sources (max, not additive)
     const totalCoverage = Math.min(
       100,
       Math.max(overhangShadow, upperDeckShadow, roofShadow)
     );

     // 8. Calculate final sun exposure
     const finalSunExposure = Math.max(
       0,
       baseSunExposure * (1 - totalCoverage / 100)
     );

     // 9. Determine recommendation
     let recommendation: RowShadowData['recommendation'];
     if (totalCoverage >= 80) recommendation = 'excellent';
     else if (totalCoverage >= 60) recommendation = 'good';
     else if (totalCoverage >= 30) recommendation = 'fair';
     else recommendation = 'poor';

     return {
       rowNumber: row.rowNumber,
       seats: row.seats,
       elevation: row.elevation,
       depth: row.depth,
       coverage: Math.round(totalCoverage),
       sunExposure: Math.round(finalSunExposure),
       inShadow: totalCoverage >= 50,
       shadowSources: {
         roof: roofShadow,
         upperDeck: Math.round(upperDeckShadow),
         overhang: Math.round(overhangShadow),
         bowl: 0
       },
       recommendation
     };
   }
   ```

3. **Add calculateOverhangShadow() Helper** (lines ~601-630):
   ```typescript
   /**
    * Calculates shadow cast by upper deck overhang based on row depth
    */
   function calculateOverhangShadow(
     rowDepth: number,          // Distance from section front (feet)
     overhangHeight: number,    // Height of overhang above row (feet)
     sunAltitude: number        // Sun angle in degrees
   ): number {

     // If no overhang, no shadow
     if (!overhangHeight || overhangHeight <= 0) return 0;

     // Calculate shadow length cast by overhang
     const sunAltitudeRad = sunAltitude * Math.PI / 180;
     const shadowLength = overhangHeight / Math.tan(sunAltitudeRad);

     // If row is within shadow length, calculate coverage
     if (rowDepth <= shadowLength) {
       // Front rows: Full coverage
       return 100;
     } else if (rowDepth <= shadowLength * 1.5) {
       // Transition zone: Partial coverage
       const transition = (shadowLength * 1.5 - rowDepth) / (shadowLength * 0.5);
       return Math.max(0, transition * 100);
     }

     // Back rows: Beyond shadow reach
     return 0;
   }
   ```

4. **Add calculateUpperDeckShadowForRow() Helper** (lines ~631-670):
   ```typescript
   /**
    * Calculates shadow from upper deck based on row elevation and depth
    */
   function calculateUpperDeckShadowForRow(
     rowElevation: number,     // Height above field (feet)
     rowDepth: number,         // Distance from section front (feet)
     section: DetailedSection,
     sunAltitude: number,
     sunAzimuth: number
   ): number {

     // Only lower/field sections get upper deck shadow
     if (section.level === 'upper' || section.level === 'suite') {
       return 0;
     }

     // Upper deck typical height: 40-60 feet above field
     const upperDeckHeight = section.height + 40; // Approximate
     const heightDifference = upperDeckHeight - rowElevation;

     // If row is higher than upper deck, no shadow
     if (heightDifference <= 0) return 0;

     // Calculate shadow length from upper deck
     const sunAltitudeRad = sunAltitude * Math.PI / 180;
     const shadowLength = heightDifference / Math.tan(sunAltitudeRad);

     // Check if section is behind home plate (gets more upper deck shadow)
     const sectionAngle = section.baseAngle;
     const isBehindHomePlate = (sectionAngle >= 135 && sectionAngle <= 225);

     if (isBehindHomePlate) {
       // More aggressive shadow for behind-home sections
       if (rowDepth <= shadowLength * 0.8) {
         return 100;
       } else if (rowDepth <= shadowLength * 1.2) {
         const transition = (shadowLength * 1.2 - rowDepth) / (shadowLength * 0.4);
         return Math.max(0, transition * 100);
       }
     } else {
       // Standard shadow for side/outfield sections
       if (rowDepth <= shadowLength * 0.5) {
         return 80;
       } else if (rowDepth <= shadowLength) {
         const transition = (shadowLength - rowDepth) / (shadowLength * 0.5);
         return Math.max(0, transition * 80);
       }
     }

     return 0;
   }
   ```

5. **Add calculateRowShadows() Method** (lines ~671-720):
   ```typescript
   /**
    * Calculates row-level shadows for an entire section
    */
   export function calculateRowShadows(
     section: DetailedSection,
     sunAltitude: number,
     sunAzimuth: number,
     stadiumOrientation: number = 0
   ): SectionShadowData {

     // If no rows, return empty
     if (!section.rows || section.rows.length === 0) {
       return {
         sectionId: section.id,
         sectionName: section.name,
         rows: [],
         averageCoverage: 0,
         bestRows: [],
         worstRows: []
       };
     }

     // Calculate shadow for each row
     const rowShadows: RowShadowData[] = section.rows.map(row =>
       calculateRowShadow(row, section, sunAltitude, sunAzimuth, stadiumOrientation)
     );

     // Calculate section average
     const totalCoverage = rowShadows.reduce((sum, r) => sum + r.coverage, 0);
     const averageCoverage = totalCoverage / rowShadows.length;

     // Find best and worst rows
     const sortedByShade = [...rowShadows].sort((a, b) => b.coverage - a.coverage);
     const bestRows = sortedByShade.slice(0, 5).map(r => r.rowNumber);
     const worstRows = sortedByShade.slice(-5).reverse().map(r => r.rowNumber);

     return {
       sectionId: section.id,
       sectionName: section.name,
       rows: rowShadows,
       averageCoverage: Math.round(averageCoverage),
       bestRows,
       worstRows
     };
   }
   ```

**Verification Tests**:
```typescript
// /src/utils/__tests__/rowShadowCalculator.test.ts

describe('calculateRowShadow', () => {
  it('should return 100% coverage for covered rows', () => {
    const row: RowDetail = {
      rowNumber: 'A',
      seats: 18,
      elevation: 8,
      depth: 0,
      covered: true
    };
    const result = calculateRowShadow(row, mockSection, 45, 180);
    expect(result.coverage).toBe(100);
    expect(result.sunExposure).toBe(0);
  });

  it('should calculate overhang shadow for front rows', () => {
    const row: RowDetail = {
      rowNumber: 'A',
      seats: 18,
      elevation: 8,
      depth: 0,
      covered: false,
      overhangHeight: 30
    };
    const result = calculateRowShadow(row, mockSection, 45, 180);
    expect(result.shadowSources.overhang).toBeGreaterThan(80);
  });

  it('should show gradient from front to back rows', () => {
    const rows = generateMockRows('A', 'Z', 18, 8, 25);
    const shadows = rows.map(row => calculateRowShadow(row, mockSection, 45, 180));

    // Front rows should have more shade than back rows
    expect(shadows[0].coverage).toBeGreaterThan(shadows[25].coverage);
  });
});
```

**Completion Criteria**:
- [ ] All methods implemented in sunCalculator.ts
- [ ] Unit tests passing (>90% coverage)
- [ ] TypeScript compiles without errors
- [ ] Smoke test: Calculate 30 rows without errors

---

#### Task 0.3: Extend Web Worker (Days 3-4 - Jan 25-26)
**Owner**: TBD
**Duration**: 12 hours
**File**: `/public/workers/sunCalculations.worker.js` (65 → ~200 lines)

**Implementation Steps**:

1. **Add Row Calculation Message Type** (lines ~70-90):
   ```javascript
   self.addEventListener('message', async (event) => {
     const { type, payload } = event.data;

     // Existing section-level handler
     if (type === 'CALCULATE_SUN_EXPOSURE') {
       // ... existing code
     }

     // NEW: Row-level handler
     if (type === 'CALCULATE_ROW_SHADOWS') {
       try {
         const { sections, sunPosition, stadium } = payload;

         // Calculate row shadows for all sections
         const results = await calculateAllRowShadows(
           sections,
           sunPosition,
           stadium
         );

         // Send results back
         self.postMessage({
           type: 'ROW_SHADOWS_RESULT',
           payload: results,
         });
       } catch (error) {
         self.postMessage({
           type: 'ROW_SHADOWS_ERROR',
           payload: { error: error.message },
         });
       }
     }
   });
   ```

2. **Import/Reimplement Row Calculation Logic** (lines ~91-150):
   ```javascript
   /**
    * Calculate row shadows for all sections
    * (Reimplementation of sunCalculator.ts logic for worker context)
    */
   function calculateAllRowShadows(sections, sunPosition, stadium) {
     const { altitude, azimuth } = sunPosition;
     const orientation = stadium.orientation || 0;

     return sections.map(section => {
       // If no rows, skip
       if (!section.rows || section.rows.length === 0) {
         return {
           sectionId: section.id,
           sectionName: section.name,
           rows: [],
           averageCoverage: 0,
           bestRows: [],
           worstRows: []
         };
       }

       // Calculate each row
       const rowShadows = section.rows.map(row =>
         calculateRowShadowWorker(row, section, altitude, azimuth, orientation)
       );

       // Calculate section average
       const avgCoverage = rowShadows.reduce((sum, r) => sum + r.coverage, 0) / rowShadows.length;

       // Find best/worst rows
       const sorted = [...rowShadows].sort((a, b) => b.coverage - a.coverage);
       const bestRows = sorted.slice(0, 5).map(r => r.rowNumber);
       const worstRows = sorted.slice(-5).reverse().map(r => r.rowNumber);

       return {
         sectionId: section.id,
         sectionName: section.name,
         rows: rowShadows,
         averageCoverage: Math.round(avgCoverage),
         bestRows,
         worstRows
       };
     });
   }

   function calculateRowShadowWorker(row, section, sunAltitude, sunAzimuth, stadiumOrientation) {
     // Simplified version of calculateRowShadow() from sunCalculator.ts
     // (Full implementation ~50 lines - copy from Task 0.2)

     if (row.covered) {
       return {
         rowNumber: row.rowNumber,
         seats: row.seats,
         elevation: row.elevation,
         depth: row.depth,
         coverage: 100,
         sunExposure: 0,
         inShadow: true,
         shadowSources: { roof: 100, upperDeck: 0, overhang: 0, bowl: 0 },
         recommendation: 'excellent'
       };
     }

     // Calculate shadows (overhang, upper deck, etc.)
     const overhangShadow = calculateOverhangShadowWorker(row.depth, row.overhangHeight, sunAltitude);
     const upperDeckShadow = calculateUpperDeckShadowWorker(row.elevation, row.depth, section, sunAltitude);

     const totalCoverage = Math.max(overhangShadow, upperDeckShadow);
     const baseSunExposure = 100; // Simplified
     const finalSunExposure = Math.max(0, baseSunExposure * (1 - totalCoverage / 100));

     let recommendation;
     if (totalCoverage >= 80) recommendation = 'excellent';
     else if (totalCoverage >= 60) recommendation = 'good';
     else if (totalCoverage >= 30) recommendation = 'fair';
     else recommendation = 'poor';

     return {
       rowNumber: row.rowNumber,
       seats: row.seats,
       elevation: row.elevation,
       depth: row.depth,
       coverage: Math.round(totalCoverage),
       sunExposure: Math.round(finalSunExposure),
       inShadow: totalCoverage >= 50,
       shadowSources: {
         roof: 0,
         upperDeck: Math.round(upperDeckShadow),
         overhang: Math.round(overhangShadow),
         bowl: 0
       },
       recommendation
     };
   }
   ```

3. **Add Helper Functions** (lines ~151-200):
   ```javascript
   function calculateOverhangShadowWorker(rowDepth, overhangHeight, sunAltitude) {
     if (!overhangHeight || overhangHeight <= 0) return 0;

     const sunAltitudeRad = sunAltitude * Math.PI / 180;
     const shadowLength = overhangHeight / Math.tan(sunAltitudeRad);

     if (rowDepth <= shadowLength) {
       return 100;
     } else if (rowDepth <= shadowLength * 1.5) {
       const transition = (shadowLength * 1.5 - rowDepth) / (shadowLength * 0.5);
       return Math.max(0, transition * 100);
     }

     return 0;
   }

   function calculateUpperDeckShadowWorker(rowElevation, rowDepth, section, sunAltitude) {
     if (section.level === 'upper' || section.level === 'suite') {
       return 0;
     }

     const upperDeckHeight = section.height + 40;
     const heightDifference = upperDeckHeight - rowElevation;

     if (heightDifference <= 0) return 0;

     const sunAltitudeRad = sunAltitude * Math.PI / 180;
     const shadowLength = heightDifference / Math.tan(sunAltitudeRad);

     if (rowDepth <= shadowLength * 0.5) {
       return 80;
     } else if (rowDepth <= shadowLength) {
       const transition = (shadowLength - rowDepth) / (shadowLength * 0.5);
       return Math.max(0, transition * 80);
     }

     return 0;
   }
   ```

**Completion Criteria**:
- [ ] Worker accepts CALCULATE_ROW_SHADOWS messages
- [ ] Worker returns ROW_SHADOWS_RESULT with row-level data
- [ ] Error handling functional (ROW_SHADOWS_ERROR)
- [ ] Test with sample section (30 rows) completes in <10ms

---

#### Task 0.4: Update useSunCalculations Hook (Day 5 - Jan 27)
**Owner**: TBD
**Duration**: 4 hours
**File**: `/src/hooks/useSunCalculations.ts` (142 → ~180 lines)

**Implementation Steps**:

1. **Add includeRows Parameter** (line ~15):
   ```typescript
   export function useSunCalculations(
     stadium: Stadium,
     sunPosition: SunPosition | null,
     sections: DetailedSection[],
     includeRows: boolean = false  // NEW PARAMETER
   ) {
     // ... existing code
   }
   ```

2. **Update Worker Call** (lines ~50-80):
   ```typescript
   useEffect(() => {
     if (!sunPosition || !sections) return;

     const worker = new Worker('/workers/sunCalculations.worker.js');

     // Choose message type based on includeRows
     const messageType = includeRows ? 'CALCULATE_ROW_SHADOWS' : 'CALCULATE_SUN_EXPOSURE';

     worker.postMessage({
       type: messageType,
       payload: { sections, sunPosition, stadium }
     });

     // Handle response
     worker.onmessage = (event) => {
       const { type, payload } = event.data;

       if (includeRows && type === 'ROW_SHADOWS_RESULT') {
         setSectionShadowData(payload);  // New state for row-level data
         setCalculating(false);
       } else if (!includeRows && type === 'SUN_EXPOSURE_RESULT') {
         setShadowData(payload);  // Existing state for section-level
         setCalculating(false);
       } else if (type === 'ROW_SHADOWS_ERROR' || type === 'SUN_EXPOSURE_ERROR') {
         console.error('Calculation error:', payload.error);
         setCalculating(false);
       }
     };

     return () => worker.terminate();
   }, [sunPosition, sections, stadium, includeRows]);
   ```

3. **Add Row-Level State** (lines ~20-25):
   ```typescript
   const [shadowData, setShadowData] = useState<ShadowData[]>([]);  // Section-level
   const [sectionShadowData, setSectionShadowData] = useState<SectionShadowData[]>([]);  // Row-level
   const [calculating, setCalculating] = useState(false);

   return {
     shadowData: includeRows ? null : shadowData,
     sectionShadowData: includeRows ? sectionShadowData : null,
     calculating
   };
   ```

**Completion Criteria**:
- [ ] Hook accepts includeRows parameter
- [ ] Returns row-level data when includeRows=true
- [ ] Returns section-level data when includeRows=false
- [ ] Worker communication functional
- [ ] TypeScript types correct

---

#### Task 0.5: Create Row Shade API Endpoint (Day 6 - Jan 28)
**Owner**: TBD
**Duration**: 6 hours
**File**: `/app/api/stadium/[id]/rows/shade/route.ts` (NEW - 180 lines)

**Implementation**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getStadiumById } from '@/src/data/stadiums';
import { getSectionsForStadium } from '@/src/data/sections';
import { calculateSunPosition } from '@/src/utils/sunCalculator';
import { calculateRowShadows } from '@/src/utils/sunCalculator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const sectionIds = searchParams.get('sections')?.split(',');

    // Validate inputs
    if (!date || !time) {
      return NextResponse.json(
        { error: 'date and time are required' },
        { status: 400 }
      );
    }

    // Get stadium data
    const stadium = getStadiumById(params.id);
    if (!stadium) {
      return NextResponse.json(
        { error: 'Stadium not found' },
        { status: 404 }
      );
    }

    // Get sections
    let sections = getSectionsForStadium(params.id);
    if (sectionIds) {
      sections = sections.filter(s => sectionIds.includes(s.id));
    }

    // Calculate sun position
    const dateTime = new Date(`${date}T${time}`);
    const sunPosition = calculateSunPosition(stadium, dateTime);

    // Calculate row shadows for all sections
    const startTime = performance.now();
    const sectionShadows = sections.map(section =>
      calculateRowShadows(
        section,
        sunPosition.altitude,
        sunPosition.azimuth,
        stadium.orientation
      )
    );
    const calculationTime = performance.now() - startTime;

    // Calculate total rows
    const totalRows = sectionShadows.reduce(
      (sum, s) => sum + s.rows.length,
      0
    );

    // Return response
    return NextResponse.json(
      {
        stadium: params.id,
        date,
        time,
        sunPosition: {
          altitude: sunPosition.altitude,
          azimuth: sunPosition.azimuth,
          elevation: sunPosition.altitude > 60 ? 'high' : sunPosition.altitude > 30 ? 'medium' : 'low'
        },
        sections: sectionShadows,
        totalRows,
        calculationTime: Math.round(calculationTime)
      },
      {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );

  } catch (error) {
    console.error('Row shade API error:', error);
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 }
    );
  }
}
```

**API Documentation**:
```
GET /api/stadium/[stadiumId]/rows/shade

Query Parameters:
  - date: string (ISO 8601: "YYYY-MM-DD") - REQUIRED
  - time: string (24-hour: "HH:MM") - REQUIRED
  - sections: string (comma-separated: "114B,115,116") - OPTIONAL

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

**Completion Criteria**:
- [ ] API endpoint responds to GET requests
- [ ] Returns row-level data in correct format
- [ ] Query parameter validation works
- [ ] Caching headers set correctly
- [ ] Error handling functional

---

#### Task 0.6: Performance Benchmark & Validation (Day 7 - Jan 29)
**Owner**: TBD
**Duration**: 4 hours

**Deliverables**:

1. **Create Benchmark Script** (`/scripts/benchmark-row-calculations.js`):
   ```javascript
   const { calculateRowShadows } = require('../src/utils/sunCalculator');
   const { yankeesStadiumSections } = require('../src/data/sections/mlb/yankees');

   // Test: Calculate all rows for Yankees Stadium
   const sunAltitude = 62.5;
   const sunAzimuth = 195.3;

   const start = performance.now();
   const results = yankeesStadiumSections.map(section =>
     calculateRowShadows(section, sunAltitude, sunAzimuth, 0)
   );
   const end = performance.now();

   const totalRows = results.reduce((sum, s) => sum + s.rows.length, 0);

   console.log(`Calculated ${totalRows} rows in ${end - start}ms`);
   console.log(`Target: <100ms`);
   console.log(`Result: ${end - start < 100 ? 'PASS' : 'FAIL'}`);
   ```

2. **Run Benchmark Tests**:
   ```bash
   # Main thread
   node scripts/benchmark-row-calculations.js

   # Web Worker (integration test)
   npm run dev
   # Navigate to test page, trigger calculation, check DevTools Performance
   ```

3. **Document Results** (`/docs/performance-phase0.md`):
   - Main thread calculation time: ____ ms
   - Web Worker calculation time: ____ ms
   - API endpoint response time: ____ ms
   - Pass/Fail: ____
   - Bottlenecks identified: ____

**Completion Criteria**:
- [ ] Benchmark script created
- [ ] Yankees Stadium (2,460 rows) calculated in <100ms
- [ ] Web Worker overhead <10ms
- [ ] API endpoint responds in <500ms
- [ ] Performance documented

---

### Week 2: Unit Tests & Integration

#### Task 0.7: Comprehensive Unit Tests (Days 8-10 - Jan 30 - Feb 1)
**Owner**: TBD
**Duration**: 18 hours

**Test Files to Create**:

1. `/src/utils/__tests__/rowShadowCalculator.test.ts` (200 lines):
   - Test calculateRowShadow() with covered rows
   - Test overhang shadow calculations
   - Test upper deck shadow calculations
   - Test front vs back row gradient
   - Test extreme sun angles (low/high altitude)
   - Test recommendation categories

2. `/src/hooks/__tests__/useSunCalculations.test.ts` (150 lines):
   - Test includeRows parameter
   - Test row-level data return
   - Test section-level data return
   - Test worker communication
   - Test error handling

3. `/app/api/stadium/[id]/rows/shade/__tests__/route.test.ts` (180 lines):
   - Test valid requests
   - Test query parameter validation
   - Test stadium not found
   - Test section filtering
   - Test response format
   - Test caching headers

**Target Coverage**: >90% for row-level calculation code

**Completion Criteria**:
- [ ] All test files created
- [ ] All tests passing
- [ ] Coverage >90% for new code
- [ ] CI/CD pipeline updated

---

#### Task 0.8: Integration Testing (Days 11-13 - Feb 2-4)
**Owner**: TBD
**Duration**: 18 hours

**Test Scenarios**:

1. **End-to-End Row Calculation**:
   - User selects Yankees Stadium
   - User sets date/time
   - Component calls useSunCalculations({ includeRows: true })
   - Hook calls Web Worker
   - Worker calculates 2,460 rows
   - Results return in <100ms
   - UI updates without blocking

2. **API Integration**:
   - Fetch `/api/stadium/yankees/rows/shade?date=2026-06-15&time=14:00`
   - Verify response structure
   - Verify calculation accuracy
   - Verify caching works

3. **Performance Under Load**:
   - Trigger 10 concurrent calculations
   - Verify no UI blocking
   - Verify Web Worker handles queue
   - Verify memory usage acceptable

**Create Test Documentation** (`/docs/integration-tests-phase0.md`):
- Test scenarios
- Pass/Fail results
- Performance metrics
- Issues discovered
- Resolutions

**Completion Criteria**:
- [ ] E2E flow functional
- [ ] API integration working
- [ ] Performance acceptable under load
- [ ] No UI blocking
- [ ] Documentation complete

---

#### Task 0.9: Code Review & Refactoring (Day 14 - Feb 5)
**Owner**: TBD
**Duration**: 6 hours

**Review Checklist**:
- [ ] Code follows project style guide
- [ ] TypeScript types are correct
- [ ] Error handling comprehensive
- [ ] Performance optimization applied
- [ ] Documentation complete
- [ ] Tests passing
- [ ] No code duplication
- [ ] Naming conventions consistent

**Refactoring Targets**:
- Extract common shadow calculation patterns
- Simplify complex functions
- Add JSDoc comments
- Optimize hot paths

**Completion Criteria**:
- [ ] Code review complete
- [ ] Refactoring done
- [ ] All tests still passing
- [ ] Documentation updated

---

## PHASE 0 DELIVERABLES

### Code Artifacts
- ✅ `/src/utils/sunCalculator.ts` - Extended with row-level methods (~750 lines)
- ✅ `/public/workers/sunCalculations.worker.js` - Extended with row support (~200 lines)
- ✅ `/src/hooks/useSunCalculations.ts` - Updated with includeRows parameter (~180 lines)
- ✅ `/app/api/stadium/[id]/rows/shade/route.ts` - New API endpoint (180 lines)
- ✅ Test files (3 files, ~530 lines total)

### Documentation
- ✅ Performance baseline document
- ✅ Performance Phase 0 results
- ✅ Integration test results
- ✅ API documentation

### Verification Evidence
- ✅ Unit tests passing (>90% coverage)
- ✅ Integration tests passing
- ✅ Performance benchmark: 2,460 rows in <100ms ✅
- ✅ API endpoint functional
- ✅ Web Worker non-blocking

---

## PHASE 1: ROW-LEVEL UI (Week 2-3) - 7 days

**Goal**: Users can view row-by-row shade breakdowns

### Day 15-16 (Feb 6-7): RowBreakdownView Component

#### Task 1.1: Create RowBreakdownView Component
**Owner**: TBD
**Duration**: 12 hours
**File**: `/src/components/RowBreakdownView.tsx` (NEW - 250 lines)

**Component Structure**:
```typescript
import { useState } from 'react';
import { SectionShadowData, RowShadowData } from '@/src/types/shadow';

interface RowBreakdownViewProps {
  sectionId: string;
  sectionName: string;
  rows: RowShadowData[];
  date: string;
  time: string;
  onClose?: () => void;
}

export function RowBreakdownView({
  sectionId,
  sectionName,
  rows,
  date,
  time,
  onClose
}: RowBreakdownViewProps) {
  const [sortBy, setSortBy] = useState<'row' | 'shade'>('row');
  const [filterShade, setFilterShade] = useState<number | null>(null);

  // Sort rows
  const sortedRows = [...rows].sort((a, b) => {
    if (sortBy === 'row') {
      return a.rowNumber.localeCompare(b.rowNumber);
    } else {
      return b.coverage - a.coverage;
    }
  });

  // Filter rows
  const filteredRows = filterShade !== null
    ? sortedRows.filter(r => r.coverage >= filterShade)
    : sortedRows;

  return (
    <div className="row-breakdown-view">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          {sectionName} - Row Breakdown
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        {date} at {time}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'row' | 'shade')}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="row">Row Number</option>
            <option value="shade">Shade %</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Show only rows with:</label>
          <select
            value={filterShade || ''}
            onChange={(e) => setFilterShade(e.target.value ? Number(e.target.value) : null)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="">All rows</option>
            <option value="80">&gt;80% shade</option>
            <option value="60">&gt;60% shade</option>
            <option value="30">&gt;30% shade</option>
          </select>
        </div>
      </div>

      {/* Desktop: Table View */}
      <div className="hidden md:block overflow-auto max-h-96">
        <table className="w-full border-collapse" data-testid="row-breakdown">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border px-4 py-2 text-left">Row</th>
              <th className="border px-4 py-2 text-right">Seats</th>
              <th className="border px-4 py-2 text-right">Elevation</th>
              <th className="border px-4 py-2 text-right">Shade %</th>
              <th className="border px-4 py-2 text-center">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => (
              <tr
                key={row.rowNumber}
                data-row={row.rowNumber}
                className="hover:bg-gray-50"
              >
                <td className="border px-4 py-2 font-medium">{row.rowNumber}</td>
                <td className="border px-4 py-2 text-right">{row.seats}</td>
                <td className="border px-4 py-2 text-right">{row.elevation.toFixed(1)} ft</td>
                <td className="border px-4 py-2 text-right" data-shade={row.coverage}>
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-4 bg-gray-200 rounded overflow-hidden">
                      <div
                        className={`h-full ${row.coverage >= 80 ? 'bg-blue-500' : row.coverage >= 60 ? 'bg-blue-400' : row.coverage >= 30 ? 'bg-yellow-400' : 'bg-yellow-300'}`}
                        style={{ width: `${row.coverage}%` }}
                      />
                    </div>
                    <span className="font-medium">{row.coverage}%</span>
                  </div>
                </td>
                <td className="border px-4 py-2 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    row.recommendation === 'excellent' ? 'bg-blue-100 text-blue-800' :
                    row.recommendation === 'good' ? 'bg-green-100 text-green-800' :
                    row.recommendation === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {row.recommendation === 'excellent' && '☂️ Excellent'}
                    {row.recommendation === 'good' && '☂️ Good'}
                    {row.recommendation === 'fair' && '☀️ Fair'}
                    {row.recommendation === 'poor' && '☀️ Full Sun'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: List View */}
      <div className="md:hidden">
        {filteredRows.map(row => (
          <div
            key={row.rowNumber}
            className="border rounded p-3 mb-2 bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-lg">Row {row.rowNumber}</div>
              <div className="text-sm">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  row.recommendation === 'excellent' ? 'bg-blue-100 text-blue-800' :
                  row.recommendation === 'good' ? 'bg-green-100 text-green-800' :
                  row.recommendation === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {row.recommendation === 'excellent' && '☂️ Excellent'}
                  {row.recommendation === 'good' && '☂️ Good'}
                  {row.recommendation === 'fair' && '☀️ Fair'}
                  {row.recommendation === 'poor' && '☀️ Full Sun'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex-grow h-6 bg-gray-200 rounded overflow-hidden">
                <div
                  className={`h-full ${row.coverage >= 80 ? 'bg-blue-500' : row.coverage >= 60 ? 'bg-blue-400' : row.coverage >= 30 ? 'bg-yellow-400' : 'bg-yellow-300'}`}
                  style={{ width: `${row.coverage}%` }}
                />
              </div>
              <span className="font-bold text-lg">{row.coverage}%</span>
            </div>

            <div className="text-sm text-gray-600">
              {row.seats} seats • {row.elevation.toFixed(1)} ft elevation
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <div className="text-sm text-gray-600">
          Showing {filteredRows.length} of {rows.length} rows
        </div>
      </div>
    </div>
  );
}
```

**Completion Criteria**:
- [ ] Component renders desktop table view
- [ ] Component renders mobile list view
- [ ] Sort by row number or shade works
- [ ] Filter by shade percentage works
- [ ] Responsive design tested
- [ ] Accessibility: keyboard navigation, ARIA labels

---

### Day 17-18 (Feb 8-9): Update Section Card & Filters

#### Task 1.2: Update LazySectionCardModern with Row Summary
**Owner**: TBD
**Duration**: 8 hours
**File**: `/src/components/LazySectionCardModern.tsx` (MODIFY)

**Changes**:

1. **Add Row Summary Display**:
   ```typescript
   // Add to props interface
   interface LazySectionCardModernProps {
     section: DetailedSection;
     shadowData: ShadowData;
     sectionShadowData?: SectionShadowData;  // NEW: Row-level data
     date: string;
     time: string;
     // ... existing props
   }

   // In render:
   {sectionShadowData && (
     <div className="mt-2 text-sm">
       <div className="flex items-center gap-2">
         <span>☂️ Best rows: {sectionShadowData.bestRows.slice(0, 3).join(', ')}</span>
         <span className="text-gray-400">|</span>
         <span>☀️ Sunny rows: {sectionShadowData.worstRows.slice(0, 3).join(', ')}</span>
       </div>

       <button
         onClick={() => setShowRowBreakdown(true)}
         className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
       >
         View Row Details ▼
       </button>
     </div>
   )}
   ```

2. **Add Expandable Row Breakdown**:
   ```typescript
   const [showRowBreakdown, setShowRowBreakdown] = useState(false);

   // In render:
   {showRowBreakdown && sectionShadowData && (
     <div className="mt-4 border-t pt-4">
       <RowBreakdownView
         sectionId={section.id}
         sectionName={section.name}
         rows={sectionShadowData.rows}
         date={date}
         time={time}
         onClose={() => setShowRowBreakdown(false)}
       />
     </div>
   )}
   ```

**Completion Criteria**:
- [ ] Section card shows row summary when available
- [ ] "View Row Details" button expands RowBreakdownView
- [ ] Collapse functionality works
- [ ] Mobile layout responsive
- [ ] No breaking changes to section-level display

---

#### Task 1.3: Add Row-Level Filters
**Owner**: TBD
**Duration**: 8 hours
**File**: `/src/components/EnhancedSunFilter.tsx` (MODIFY)

**Changes**:

1. **Create RowFilterBar Component** (NEW - 120 lines):
   ```typescript
   // /src/components/RowFilterBar.tsx

   interface RowFilterBarProps {
     onFilterChange: (filters: RowFilters) => void;
   }

   export interface RowFilters {
     hasRowsWithShade: boolean;
     hasRowsWithSun: boolean;
     minShadeRows: number;
     shadeThreshold: number;
   }

   export function RowFilterBar({ onFilterChange }: RowFilterBarProps) {
     const [hasRowsWithShade, setHasRowsWithShade] = useState(false);
     const [hasRowsWithSun, setHasRowsWithSun] = useState(false);
     const [minShadeRows, setMinShadeRows] = useState(5);
     const [shadeThreshold, setShadeThreshold] = useState(80);

     useEffect(() => {
       onFilterChange({
         hasRowsWithShade,
         hasRowsWithSun,
         minShadeRows,
         shadeThreshold
       });
     }, [hasRowsWithShade, hasRowsWithSun, minShadeRows, shadeThreshold]);

     return (
       <div className="row-filter-bar p-4 border rounded bg-gray-50">
         <h4 className="font-medium mb-3">Row-Level Filters</h4>

         <div className="space-y-3">
           <label className="flex items-center gap-2">
             <input
               type="checkbox"
               checked={hasRowsWithShade}
               onChange={(e) => setHasRowsWithShade(e.target.checked)}
             />
             <span>Has rows with excellent shade (&gt;{shadeThreshold}%)</span>
           </label>

           <label className="flex items-center gap-2">
             <input
               type="checkbox"
               checked={hasRowsWithSun}
               onChange={(e) => setHasRowsWithSun(e.target.checked)}
             />
             <span>Has rows with full sun (&lt;20%)</span>
           </label>

           <div>
             <label className="block text-sm font-medium mb-1">
               Minimum rows meeting criteria:
             </label>
             <input
               type="number"
               min="1"
               max="30"
               value={minShadeRows}
               onChange={(e) => setMinShadeRows(Number(e.target.value))}
               className="border rounded px-3 py-1 w-20"
             />
           </div>

           <div>
             <label className="block text-sm font-medium mb-1">
               Shade threshold: {shadeThreshold}%
             </label>
             <input
               type="range"
               min="60"
               max="100"
               step="5"
               value={shadeThreshold}
               onChange={(e) => setShadeThreshold(Number(e.target.value))}
               className="w-full"
             />
           </div>
         </div>
       </div>
     );
   }
   ```

2. **Integrate into EnhancedSunFilter**:
   ```typescript
   // Add to EnhancedSunFilter.tsx

   import { RowFilterBar, RowFilters } from './RowFilterBar';

   // Add state
   const [rowFilters, setRowFilters] = useState<RowFilters>({
     hasRowsWithShade: false,
     hasRowsWithSun: false,
     minShadeRows: 5,
     shadeThreshold: 80
   });

   // Add filter logic
   function applyRowFilters(sections: SectionShadowData[]): SectionShadowData[] {
     return sections.filter(section => {
       if (rowFilters.hasRowsWithShade) {
         const shadeRows = section.rows.filter(r => r.coverage >= rowFilters.shadeThreshold);
         if (shadeRows.length < rowFilters.minShadeRows) return false;
       }

       if (rowFilters.hasRowsWithSun) {
         const sunRows = section.rows.filter(r => r.coverage < 20);
         if (sunRows.length < rowFilters.minShadeRows) return false;
       }

       return true;
     });
   }

   // Add to render
   <RowFilterBar onFilterChange={setRowFilters} />
   ```

**Completion Criteria**:
- [ ] RowFilterBar component created
- [ ] Integrated into EnhancedSunFilter
- [ ] Filters apply to section list
- [ ] Threshold slider works
- [ ] Minimum rows input works
- [ ] Responsive design

---

### Day 19-20 (Feb 10-11): Integration & Testing

#### Task 1.4: Integrate Row UI with Stadium Pages
**Owner**: TBD
**Duration**: 12 hours

**Changes**:

1. **Update Stadium Page** (`/app/stadium/[id]/page.tsx`):
   ```typescript
   // Add state for row-level mode
   const [showRowLevel, setShowRowLevel] = useState(false);

   // Update hook call
   const { shadowData, sectionShadowData, calculating } = useSunCalculations(
     stadium,
     sunPosition,
     sections,
     showRowLevel  // Pass row-level flag
   );

   // Add toggle button
   <button
     onClick={() => setShowRowLevel(!showRowLevel)}
     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
   >
     {showRowLevel ? 'Show Section View' : 'Show Row-Level View'}
   </button>

   // Pass data to components
   <SectionResults
     sections={sections}
     shadowData={shadowData}
     sectionShadowData={sectionShadowData}
     showRowLevel={showRowLevel}
     // ... other props
   />
   ```

2. **Update SectionResults** (`/src/components/SectionResults.tsx`):
   ```typescript
   // Add props
   interface SectionResultsProps {
     sections: DetailedSection[];
     shadowData: ShadowData[] | null;
     sectionShadowData: SectionShadowData[] | null;
     showRowLevel: boolean;
     // ... existing props
   }

   // Pass to cards
   {sections.map(section => (
     <LazySectionCardModern
       key={section.id}
       section={section}
       shadowData={getShadowDataForSection(section.id)}
       sectionShadowData={showRowLevel ? getSectionShadowData(section.id) : undefined}
       // ... other props
     />
   ))}
   ```

**Completion Criteria**:
- [ ] Toggle between section-level and row-level works
- [ ] Row-level data displays correctly
- [ ] Section-level still works
- [ ] No performance degradation
- [ ] Mobile responsive

---

#### Task 1.5: E2E Testing (Day 21 - Feb 12)
**Owner**: TBD
**Duration**: 6 hours

**Playwright Tests** (`/tests/e2e/row-breakdown.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test('row breakdown displays correctly', async ({ page }) => {
  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');

  // Enable row-level view
  await page.click('button:has-text("Show Row-Level View")');

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
  expect(parseInt(shadeA!)).toBeGreaterThan(parseInt(shadeZ!));
});

test('row filters work correctly', async ({ page }) => {
  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');

  // Enable row-level view
  await page.click('button:has-text("Show Row-Level View")');

  // Check "Has rows with excellent shade"
  await page.check('text=Has rows with excellent shade');

  // Set minimum rows
  await page.fill('input[type="number"]', '5');

  // Verify filtered sections only show those meeting criteria
  const sections = page.locator('[data-section]');
  const count = await sections.count();

  // All visible sections should have at least 5 rows with >80% shade
  for (let i = 0; i < count; i++) {
    const section = sections.nth(i);
    await section.click();
    const rowTable = section.locator('[data-testid="row-breakdown"]');
    const shadeRows = rowTable.locator('tr[data-shade]').filter({ hasText: /[8-9][0-9]%|100%/ });
    expect(await shadeRows.count()).toBeGreaterThanOrEqual(5);
  }
});

test('mobile row breakdown works', async ({ page, isMobile }) => {
  test.skip(!isMobile);

  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');

  // Enable row-level view
  await page.click('button:has-text("Show Row-Level View")');

  // Find section card
  const section = page.locator('[data-section="114B"]');
  await section.locator('button:has-text("View Row Details")').click();

  // Verify mobile list view (not table)
  await expect(section.locator('.md\\:hidden')).toBeVisible();
  await expect(section.locator('.hidden.md\\:block')).not.toBeVisible();

  // Verify row cards visible
  const rowCards = section.locator('[data-row]');
  await expect(rowCards.first()).toBeVisible();
});
```

**Visual Regression Tests** (`/tests/visual/row-breakdown.spec.ts`):
```typescript
test('row breakdown visual regression', async ({ page }) => {
  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');
  await page.click('button:has-text("Show Row-Level View")');
  await page.locator('[data-section="114B"] button:has-text("View Row Details")').click();
  await page.waitForTimeout(300);  // Wait for animation
  await expect(page.locator('[data-section="114B"]')).toHaveScreenshot('row-breakdown.png');
});
```

**Accessibility Tests** (`/tests/a11y/row-breakdown.spec.ts`):
```typescript
import AxeBuilder from '@axe-core/playwright';

test('row breakdown accessibility', async ({ page }) => {
  await page.goto('/stadium/yankees?date=2026-06-15&time=14:00');
  await page.click('button:has-text("Show Row-Level View")');
  await page.locator('[data-section="114B"] button:has-text("View Row Details")').click();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

**Completion Criteria**:
- [ ] All E2E tests passing
- [ ] Visual regression tests passing
- [ ] Accessibility tests passing (zero violations)
- [ ] Mobile tests passing
- [ ] Desktop tests passing

---

## PHASE 1 DELIVERABLES

### Code Artifacts
- ✅ `/src/components/RowBreakdownView.tsx` (250 lines)
- ✅ `/src/components/RowFilterBar.tsx` (120 lines)
- ✅ `/src/components/LazySectionCardModern.tsx` (MODIFIED)
- ✅ `/src/components/EnhancedSunFilter.tsx` (MODIFIED)
- ✅ `/app/stadium/[id]/page.tsx` (MODIFIED)
- ✅ `/src/components/SectionResults.tsx` (MODIFIED)

### Tests
- ✅ E2E tests (3 scenarios)
- ✅ Visual regression tests
- ✅ Accessibility tests

### Verification Evidence
- ✅ Row breakdown displays correctly (desktop + mobile)
- ✅ Filters functional
- ✅ Toggle between section/row level works
- ✅ Performance: No UI blocking
- ✅ Accessibility: WCAG AA compliant
- ✅ Visual tests passing

---

*[Phases 2-7 continue in similar detail...]*

---

## CRITICAL PATH SUMMARY

```
Week 1-2:  Row Calculation Engine (BLOCKER for all row features)
           ↓
Week 2-3:  Row UI Components (BLOCKER for user testing)
           ↓
Week 3-4:  WC Existing Stadiums (PARALLEL TRACK START)
Week 4-6:  WC New Stadiums
           ↓
Week 6-7:  WC UI & Schedule (BLOCKER for WC visibility)
           ↓
Week 7-8:  Multi-Language (3 days - ADD FRENCH)
           ↓
Week 8-9:  Testing & Optimization
           ↓
Week 9-10: Launch Prep & Soft Launch
```

## WEEKLY MILESTONES

| Week | Milestone | Completion Criteria |
|------|-----------|-------------------|
| Week 1-2 | Row Calculation Engine | 2,460 rows calculated in <100ms ✅ |
| Week 2-3 | Row UI Functional | Row breakdown displays correctly ✅ |
| Week 3-4 | 11 WC Venues Ready | All NFL → WC duplicates created ✅ |
| Week 4-6 | 16 WC Venues Complete | 5 new stadiums with row data ✅ |
| Week 6-7 | WC Landing Page Live | 104 matches integrated ✅ |
| Week 7-8 | 4 Languages Supported | EN, ES, JA, FR functional ✅ |
| Week 8-9 | Performance Validated | Lighthouse ≥90, <2s load ✅ |
| Week 9-10 | Soft Launch | Beta users testing ✅ |

## RISK MANAGEMENT

### High-Priority Risks
1. **Row Calculation Performance** - Mitigation: Web Worker + caching
2. **New Stadium Data Availability** - Mitigation: Start data gathering NOW
3. **Development Delays** - Mitigation: Weekly reviews + parallel tracks

### Contingency Plans
- If Phase 0 delayed: Push launch to April 8 (still before ticketing peak)
- If new stadium data unavailable: Use geometric templates + mark as "estimated"
- If performance issues: Reduce row data granularity or implement aggressive caching

---

## APPROVAL & SIGN-OFF

**Stakeholder**: ___________________________
**Date**: ___________________________

**Plan Approved**: [ ] Yes [ ] No

**Notes**:
_______________________________________________
_______________________________________________

---

**Next Step**: Begin Phase 0 implementation (January 23, 2026)
