# Where to See Row-Level Detail - Implementation Status

**Date**: January 26, 2026
**Status**: ❌ **NOT VISIBLE YET** - Phase 0 backend complete, Phase 1 UI not implemented

---

## Current State: What You CAN See Now

### ✅ Section-Level View (Already Working)
**Location**: `https://theshadium.com/stadium/yankees`

**What you see**:
- Section cards showing **section-level** shade (e.g., "Section 100: 56% coverage")
- Overall sun exposure per section
- Best/worst sections for shade
- No row-level detail

**Files**:
- `app/stadium/[stadiumId]/page.tsx` - Stadium page
- `src/components/SectionList.tsx` - Renders section cards
- `src/components/LazySectionCardModern.tsx` - Individual section card

---

## What You SHOULD See (Not Built Yet)

### ❌ Row-Level View (Phase 1 - Not Implemented)

#### Where it SHOULD appear:

**Option 1: Expandable Section Cards** (Recommended - Task 1.2)
```
Section 100 - 56% coverage
  ↓ Click "View Row Details" button

  Row Breakdown:
  ┌─────────────────────────────────────┐
  │ Row A: 80% shade ☁️ EXCELLENT      │
  │ Row B: 80% shade ☁️ EXCELLENT      │
  │ Row C: 80% shade ☁️ EXCELLENT      │
  │ Row D: 72% shade ☁️ GOOD           │
  │ Row E: 40% shade 🌤️ FAIR           │
  │ Row F: 7% shade  ☀️ POOR           │
  │ Row G: 0% shade  ☀️ POOR           │
  └─────────────────────────────────────┘
```

**Option 2: Separate Row View Tab** (Task 1.4)
```
[ Section View ] [ Row View ] ← Toggle
         ↑ Currently here        ↑ Not built yet
```

---

## Backend vs Frontend Status

### ✅ Backend (Phase 0 - COMPLETE)

**API Endpoint**: Working
```bash
curl "http://localhost:3000/api/stadium/yankees/rows/shade?date=2025-06-15&time=14:00"
```

**Response**: Returns 686 rows with detailed data
```json
{
  "sections": [
    {
      "sectionId": "100",
      "sectionName": "Field Level 100",
      "rows": [
        {
          "rowNumber": "A",
          "seats": 18,
          "coverage": 80,
          "recommendation": "excellent"
        },
        ...14 rows total
      ],
      "averageCoverage": 26,
      "bestRows": ["A", "B", "C", "D", "E"],
      "worstRows": ["N", "M", "L", "K", "J"]
    }
  ],
  "summary": {
    "totalRows": 686,
    "excellentShadeRows": 250
  }
}
```

**Calculation Engine**: Working
- `src/utils/sunCalculator.ts` - Row calculations (259 lines added)
- `public/workers/sunCalculations.worker.js` - Web Worker (224 lines added)
- `src/hooks/useSunCalculations.ts` - React Hook (67 lines modified)

**Tests**: 51/51 passing ✅
**Performance**: 24.16ms for 604 rows ✅

---

### ❌ Frontend (Phase 1 - NOT IMPLEMENTED)

**Missing Components**:
1. `src/components/RowBreakdownView.tsx` - **DOES NOT EXIST**
2. Row display in `LazySectionCardModern.tsx` - **NOT ADDED**
3. Row-level filters - **NOT ADDED**
4. Section/Row toggle - **NOT ADDED**

**Current Section Card**: Only shows section-level data
```tsx
// File: src/components/LazySectionCardModern.tsx (line 16-22)
interface LazySectionCardProps {
  section: StadiumSection;
  sunExposure: number;      // ← Section-level only
  inSun: boolean;
  index: number;
  timeInSun?: number;
  // ❌ NO ROW DATA PROP
}
```

---

## Why You Don't See Row Data Yet

### The Problem:
1. **UI components don't call the API** - They use the old section-level calculations
2. **No row display component** - `RowBreakdownView.tsx` doesn't exist
3. **Section cards not updated** - `LazySectionCardModern` doesn't show rows
4. **No user control** - No toggle to switch between section/row view

### The Data Flow (Current vs. Needed):

**Current (Section-Level Only)**:
```
Stadium Page
  ↓
useSunCalculations(false)  ← includeRows=false (default)
  ↓
Section-level data only
  ↓
LazySectionCardModern (shows section)
```

**Needed (Row-Level)**:
```
Stadium Page
  ↓
useSunCalculations(true)   ← includeRows=true (NEW PARAMETER)
  ↓
Row-level data + section-level data
  ↓
LazySectionCardModern
  ↓
"View Row Details" button
  ↓
RowBreakdownView component (NOT BUILT YET)
  ↓
Display 14 rows for Section 100
```

---

## How to See Row Data Right Now (Manual Testing Only)

### Method 1: API Endpoint (Terminal)
```bash
# Start dev server
npm run dev

# Test API
curl "http://localhost:3000/api/stadium/yankees/rows/shade?date=2025-06-15&time=14:00" | jq .
```

### Method 2: Browser Console
```javascript
// In browser at http://localhost:3000/stadium/yankees
fetch('/api/stadium/yankees/rows/shade?date=2025-06-15&time=14:00')
  .then(r => r.json())
  .then(data => {
    console.log('Total rows:', data.summary.totalRows);
    console.log('Section 100 rows:', data.sections[0].rows);
  });
```

### Method 3: React DevTools (Hook State)
```javascript
// In StadiumPageClient.tsx, change:
const { data, loading, error } = useSunCalculations(
  selectedDate,
  selectedTime,
  stadium,
  sections,
  false  // ← Change to true
);

// Then inspect hook state in React DevTools
```

---

## What Needs to Be Built (Phase 1 Tasks)

### Task 1.1: Create RowBreakdownView Component (2 days)
**File**: `src/components/RowBreakdownView.tsx` (NEW - 250 lines)
- Desktop: Table view with sortable columns
- Mobile: Card list view
- Shows: Row number, seats, coverage %, recommendation

### Task 1.2: Update LazySectionCardModern (1 day)
**File**: `src/components/LazySectionCardModern.tsx` (MODIFY)
- Add "View Row Details" button
- Add row summary (Best: A-E, Worst: J-N)
- Add expand/collapse state
- Render RowBreakdownView when expanded

### Task 1.3: Add Row-Level Filters (1 day)
**File**: `src/components/RowFilterBar.tsx` (NEW - 120 lines)
- Filter by recommendation (Excellent, Good, Fair, Poor)
- "Best Rows Only" toggle
- Minimum coverage slider

### Task 1.4: Integration (2 days)
**Files**: Multiple
- Add section/row toggle to stadium page
- Update useSunCalculations call with includeRows parameter
- Test responsive behavior
- Verify no breaking changes

### Task 1.5: E2E Testing (1 day)
- Playwright tests for row view
- Visual regression tests
- Accessibility audit

**Total**: 7 days / ~40 hours of work

---

## Timeline

### ✅ Phase 0 (Weeks 1-2): Backend - COMPLETE
- Row calculations: Done
- Web Worker: Done
- React Hook: Done
- API Endpoint: Done
- Tests: Done (51/51 passing)
- Performance: Done (24.16ms)

### ⏳ Phase 1 (Weeks 2-3): Frontend - NOT STARTED
- **Estimated Start**: Now
- **Estimated Completion**: 7 days
- **Dependencies**: None (Phase 0 complete)
- **Blocker**: None

---

## Bottom Line

**Q: Where can I see row-level detail?**
**A: Nowhere in the UI yet. Only via API endpoint or browser console.**

**The backend works perfectly (686 rows, <25ms), but the UI doesn't display it yet.**

**Next step: Implement Phase 1 (5 tasks, 7 days) to make row data visible in the actual site.**

---

**No shortcuts. No excuses.**
The data exists and is accurate, but the UI to display it hasn't been built yet.
