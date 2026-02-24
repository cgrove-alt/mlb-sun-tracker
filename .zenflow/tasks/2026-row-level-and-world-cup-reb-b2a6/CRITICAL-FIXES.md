# Critical Fixes - Task 0.3 & 0.4

**Date**: January 22, 2026
**Issue**: Root cause analysis revealed critical API contract mismatch

---

## Issue #1: Worker API Contract Mismatch (CRITICAL)

### Problem

**Severity**: 🔴 BLOCKER
**Impact**: Complete runtime failure when `includeRows=true`

The Web Worker (Task 0.3) expected a different payload structure than the hook (Task 0.4) sent:

**Hook sends** (correct per spec):
```javascript
{
  type: 'CALCULATE_ROW_SHADOWS',
  payload: { sections, sunPosition, stadium }
}
```

**Worker expected** (WRONG):
```javascript
const { section, sunAltitude, sunAzimuth, stadiumOrientation } = payload;
```

**Result**: Runtime error - worker cannot destructure payload, calculations fail.

### Root Cause

Task 0.3 (Web Worker) was implemented with incorrect API contract. The smoke test only validated isolated functions via `eval()`, not the message handler integration.

### Fix Applied

**File**: `public/workers/sunCalculations.worker.js` (lines 27-46)

**Before**:
```javascript
const { section, sunAltitude, sunAzimuth, stadiumOrientation } = payload;
const result = calculateRowShadows(section, sunAltitude, sunAzimuth, stadiumOrientation);
```

**After**:
```javascript
const { sections, sunPosition, stadium } = payload;
const sunAltitude = sunPosition.altitudeDegrees || sunPosition.altitude;
const sunAzimuth = sunPosition.azimuthDegrees || sunPosition.azimuth;
const stadiumOrientation = stadium.orientation || 0;
const results = sections.map(section =>
  calculateRowShadows(section, sunAltitude, sunAzimuth, stadiumOrientation)
);
```

### Verification

Created `scripts/integration-test-worker-hook.js` to validate API contract:

```
✅ Hook sends CALCULATE_ROW_SHADOWS message type
✅ Hook sends "sections" (plural array)
✅ Hook sends "sunPosition" (object)
✅ Hook sends "stadium" (object)
✅ Worker expects "sections"
✅ Worker expects "sunPosition"
✅ Worker expects "stadium"
✅ Worker uses sections.map() to process array
✅ Worker returns results array in payload

Result: ALL TESTS PASSED - API CONTRACT IS CORRECT
```

---

## Issue #2: Inaccurate Line Count Claims

### Problem

**Severity**: 🟡 MEDIUM
**Impact**: Documentation credibility

**Claimed**: `src/hooks/useSunCalculations.ts` (142 → 189 lines)
**Actual**: 141 → 172 lines (+31 lines, not +47)

### Root Cause

Line counts not verified with `wc -l` before documenting.

### Fix Applied

- Updated PROGRESS.md with accurate counts
- Added verification step to process

---

## Issue #3: Missing Runtime Tests

### Problem

**Severity**: 🔴 HIGH
**Impact**: Critical bugs not caught

**Tests created**: Type-only tests (6 tests)
**Tests missing**: Runtime behavior validation

**Coverage Results**:
- `sunCalculator.ts`: 35.82% (target: >90%)
- `useSunCalculations.ts`: 0% (no runtime execution)

### Root Cause

Tests only validate TypeScript types, not actual hook behavior with Web Worker.

### Mitigation

- Added integration test for API contract
- Documented coverage gap in PROGRESS.md
- Flagged for additional testing in Task 0.7

---

## Lessons Learned

1. **Integration tests are mandatory** for cross-module communication
2. **Smoke tests must validate message handlers**, not just isolated functions
3. **Coverage reports must be run** before claiming verification complete
4. **Line counts must be verified** with actual tools, not estimated

---

## Status

✅ **Critical bug fixed** - Worker now accepts correct payload
✅ **Integration test added** - API contract validated
✅ **Documentation corrected** - Accurate line counts
⚠️ **Coverage gap documented** - Runtime tests still needed (Task 0.7)

**No shortcuts. Root cause fixed.**
