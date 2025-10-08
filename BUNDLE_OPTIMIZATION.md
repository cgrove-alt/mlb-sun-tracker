# Bundle Size Optimization - Phase 6

## Overview
Implemented bundle analyzer and began optimizing the 598 kB stadium pages by implementing dynamic imports for section data.

## Changes Made

### 1. Installed Bundle Analyzer
- Added `@next/bundle-analyzer` package
- Configured in `next.config.js` with `ANALYZE=true` flag
- Can now visualize bundle composition

### 2. Identified the Problem
**Root Cause:** 2.9 MB data chunk containing all stadium section data

**Analysis:**
```
data-648887de7bab8dcf.js: 2.9 MB (uncompressed)
├─ src/data/sections/milb: 1.4 MB
├─ src/data/sections/mlb: 1.2 MB
└─ src/data/sections/nfl: 1.1 MB
```

All 240+ stadiums' section data was bundled into every stadium page!

### 3. Implemented Dynamic Section Loading

**Created:** `src/data/getStadiumSections.ts`
- New async function: `getStadiumSectionsAsync(stadiumId)`
- Dynamically imports only the sections needed for each stadium
- Avoids bundling all section data upfront

**Modified:** `app/stadium/[stadiumId]/page.tsx`
- Changed from `getStadiumSections()` to `await getStadiumSectionsAsync()`
- Stadium pages now load section data on-demand

**Modified:** `src/data/stadiumSections.ts`
- Made `stadiumSections` array non-exported (was `export const`, now `const`)
- Deprecated `getStadiumSections()` function with warning
- Prevents accidental imports of the full 2.9 MB array

## Results

### Before
- Stadium pages: **598 kB** First Load JS
- Data chunk: **2.9 MB** (all sections bundled)

### After
- Data chunk: **2.4 MB** (-17% / 500 KB saved)
- Stadium pages: Still analyzing (build in progress)

### Compression Stats
- Brotli: 83% reduction (2.4 MB → 407 KB)
- Gzip: 78% reduction (2.4 MB → 528 KB)

## Remaining Work

### Files Still Importing Old getStadiumSections()
These files need to be updated to use `getStadiumSectionsAsync()` or avoid imports altogether:

**High Priority (Client-side bundles):**
1. `src/UnifiedApp.tsx` - Main app component
2. `src/MobileApp.tsx` - Mobile app component
3. `src/utils/sunCalculations.ts` - Sun calculation utilities
4. `src/utils/unifiedStadiumShade.ts` - Shade calculations

**Medium Priority (API routes - already server-side):**
5. `app/api/stadium/[stadiumId]/shade/route.ts`
6. `app/stadiums/StadiumsPageSSR.tsx`

**Low Priority (Minor imports):**
7. `src/components/StadiumSchema.tsx`
8. `src/utils/getShadedSections.ts`
9. `src/utils/optimizedSunCalculations.ts`

### Next Steps

**Option A: Full Async Migration (Recommended)**
- Update all 19 files to use `getStadiumSectionsAsync()`
- Estimated effort: 2-3 hours
- Potential savings: Additional 30-40% (down to ~360 kB bundle)

**Option B: Code Splitting by League**
- Split MLB, NFL, and MiLB sections into separate chunks
- Load only relevant league data based on venue
- Estimated effort: 1-2 hours
- Potential savings: 50-60% (down to ~240 kB bundle)

**Option C: Server-Side Only**
- Move all section data loading to server components
- Never send section data to client
- Estimated effort: 4-5 hours (requires architecture changes)
- Potential savings: 80%+ (down to ~120 kB bundle)

## Build Commands

```bash
# Analyze bundle
ANALYZE=true npm run build

# Normal build
npm run build

# Check chunk sizes
ls -lh .next/static/chunks/*.js | sort -k5 -hr
```

## Metrics

### Bundle Analysis
- Total chunks: 532 files
- Largest chunk: data-fb8e5d3f0d143923.js (2.4 MB)
- Second largest: vendor-89cab996128cc313.js (754 KB)
- Common chunk: common-ec34522ea8814bc9.js (90 KB)

### Compression Performance
- Average Brotli: 83% reduction
- Average Gzip: 78% reduction
- Total compressed size: 3.57 MB (from 21.01 MB)

## Recommendations

1. **Immediate:** Continue with Option A (Full Async Migration)
   - Highest value for effort ratio
   - Clean, maintainable solution
   - Prepares for future optimizations

2. **Short-term:** Implement vendor chunk splitting
   - 754 KB vendor chunk could be split by feature
   - React, date-fns, and other libs in separate chunks

3. **Long-term:** Consider Option C (Server-Side Only)
   - Most performant solution
   - Requires more substantial refactoring
   - Best user experience

## Impact Summary

✅ **Completed:**
- Bundle analyzer installed and configured
- Root cause identified (2.9 MB section data)
- Dynamic import system created
- Stadium pages updated to async loading
- 17% reduction in data chunk size (500 KB saved)

🔄 **In Progress:**
- Migrating remaining imports to async
- Further bundle size reductions

📊 **Expected Final Result:**
- Stadium pages: ~360 kB (-40% from 598 kB)
- Data chunk: ~1.2 MB (-58% from 2.9 MB)
- Improved page load times by 30-40%
