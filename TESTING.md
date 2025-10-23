# Testing Guide - Seat-Level Sun Exposure

Complete testing instructions for the seat-level sun exposure feature across all 30 MLB stadiums.

## Quick Test (5 minutes)

Run the quick test script:

```bash
./test-seat-level.sh
```

This tests:
- ✅ Tier 1 stadiums (Dodgers, Yankees, Red Sox, Cubs, Giants, Cardinals)
- ✅ Sample stadiums from other divisions
- ✅ Build output verification
- ✅ Public assets (SVG maps, search index)

## Comprehensive Test (10 minutes)

Run the comprehensive test script:

```bash
./test-all-stadiums.sh
```

This verifies:
- ✅ All 30 MLB stadiums
- ✅ Section file counts
- ✅ Metadata files
- ✅ Precomputed sun data
- ✅ Complete coverage report

## Manual Testing Checklist

### 1. Build the Application

```bash
# Install dependencies (if needed)
npm install

# Run production build
NODE_OPTIONS='--max-old-space-size=8192' npm run build
```

**Expected Result:**
- ✅ Build completes in ~5-6 minutes
- ✅ 4,918 static pages generated
- ✅ No TypeScript errors
- ✅ Compression: 82.99% Brotli, 78.42% Gzip

### 2. Start Development Server

```bash
npm run dev
```

**Expected Result:**
- ✅ Server starts on http://localhost:3000
- ✅ No console errors
- ✅ Ready in <5 seconds

### 3. Test Stadium Pages

Visit these URLs in your browser:

#### Dodger Stadium (Pilot)
```
http://localhost:3000/stadium/dodgers
http://localhost:3000/stadium/dodgers/section/101
http://localhost:3000/stadium/dodgers/section/1
```

**Expected:**
- ✅ Section cards show sun exposure percentages
- ✅ "View Seats →" links present on all sections
- ✅ Clicking "View Seats" navigates to section detail page
- ✅ Seat grid displays with color-coded seats:
  - 🟢 Green (0-20% sun) - Full shade
  - 🟡 Yellow (20-40% sun) - Mostly shade
  - 🟠 Orange (40-60% sun) - Mixed
  - 🔴 Light red (60-80% sun) - Mostly sun
  - 🔥 Dark red (80-100% sun) - Full sun
- ✅ Clicking a seat opens detail modal
- ✅ Modal shows sun exposure percentage and timeline
- ✅ Filters work (Show Only Shaded / Show Only Sunny)
- ✅ Loading states appear briefly
- ✅ "✅ Sun exposure data loaded" success message appears

#### Yankee Stadium
```
http://localhost:3000/stadium/yankees/section/114
http://localhost:3000/stadium/yankees/section/205
```

**Expected:**
- ✅ Same seat grid functionality as Dodgers
- ✅ Pre-computed sun data loads correctly
- ✅ Different sections show different sun patterns

#### Fenway Park (Green Monster)
```
http://localhost:3000/stadium/redsox/section/18
http://localhost:3000/stadium/redsox/section/37
```

**Expected:**
- ✅ Green Monster section (18) has unique seating
- ✅ Sun exposure reflects actual stadium geometry

#### Wrigley Field (Bleachers)
```
http://localhost:3000/stadium/cubs/section/214
http://localhost:3000/stadium/cubs/section/107
```

**Expected:**
- ✅ Bleacher sections have different layout
- ✅ Color coding reflects afternoon sun patterns

### 4. Test Across All 30 Stadiums

Quick verification for each division:

#### AL East
```
/stadium/yankees/section/114
/stadium/redsox/section/18
/stadium/bluejays/section/101
/stadium/rays/section/101
/stadium/orioles/section/101
```

#### AL Central
```
/stadium/guardians/section/101
/stadium/twins/section/101
/stadium/tigers/section/101
/stadium/whitesox/section/101
/stadium/royals/section/101
```

#### AL West
```
/stadium/astros/section/101
/stadium/mariners/section/101
/stadium/rangers/section/101
/stadium/athletics/section/101
/stadium/angels/section/101
```

#### NL East
```
/stadium/braves/section/101
/stadium/phillies/section/101
/stadium/mets/section/101
/stadium/nationals/section/101
/stadium/marlins/section/101
```

#### NL Central
```
/stadium/cardinals/section/146
/stadium/cubs/section/214
/stadium/brewers/section/101
/stadium/reds/section/101
/stadium/pirates/section/101
```

#### NL West
```
/stadium/dodgers/section/101
/stadium/giants/section/136
/stadium/padres/section/101
/stadium/diamondbacks/section/101
/stadium/rockies/section/101
```

**Expected for All:**
- ✅ Section page loads
- ✅ Seat grid renders
- ✅ Sun exposure data loads
- ✅ No console errors
- ✅ Filters work
- ✅ Seat detail modal opens

### 5. Test Mobile Experience

Use Chrome DevTools device emulation (iPhone 12 Pro):

```
http://localhost:3000/stadium/dodgers/section/101
```

**Expected:**
- ✅ Seat grid is responsive
- ✅ Seats are tappable (touch targets)
- ✅ Modal opens on mobile
- ✅ Filters work on mobile
- ✅ Scrolling is smooth

### 6. Test Performance

Open Chrome DevTools > Network tab:

```
http://localhost:3000/stadium/dodgers/section/101
```

**Expected:**
- ✅ Initial page load: <2 seconds
- ✅ Precomputed sun data: ~200-500KB (gzipped)
- ✅ Data decompression: <100ms
- ✅ Seat grid renders: <500ms
- ✅ No memory leaks (check in DevTools > Memory)

### 7. Test Error Handling

#### Missing Section Data
```
http://localhost:3000/stadium/rays/section/LB1
```

**Expected:**
- ✅ Page loads (doesn't crash)
- ✅ Shows "No seat data found" message
- ✅ Graceful degradation

#### Invalid Section ID
```
http://localhost:3000/stadium/dodgers/section/999
```

**Expected:**
- ✅ 404 page or error state
- ✅ No crashes

### 8. Test Search Functionality

On any stadium page:

**Expected:**
- ✅ Search bar appears in header
- ✅ Typing filters sections
- ✅ Results show section names
- ✅ Clicking result navigates to section

### 9. Test Stadium Map

```
http://localhost:3000/stadium/dodgers
```

**Expected:**
- ✅ Interactive SVG stadium map appears
- ✅ Clicking section on map navigates to section detail
- ✅ Hover shows section tooltip
- ✅ Color coding (if sun data available)

### 10. Test Breadcrumb Navigation

On section pages:

**Expected:**
- ✅ Breadcrumb: Home / Stadium Name / Section ID
- ✅ All breadcrumb links work
- ✅ Proper hierarchy

## Performance Benchmarks

### Build Performance
- **Build time:** 5-6 minutes
- **Pages generated:** 4,918
- **Memory used:** <8GB
- **Bundle size:** Optimized (<3.6MB Brotli)

### Runtime Performance
- **Initial load:** <2 seconds
- **Seat grid render:** <500ms
- **Sun data load:** <300ms
- **Seat detail modal:** <100ms

### Data Sizes
- **Per stadium (precomputed):** 150KB - 550KB (gzipped)
- **Total precomputed data:** ~12MB
- **Search index:** ~1.4MB (minified)
- **Stadium SVG maps:** ~2-20KB each

## Known Issues

### Rays Stadium
Some sections missing data (LB1-LB8, DC1-DC12):
- These are luxury boxes/club sections
- Build warns but completes successfully
- Pages show "No seat data" message
- Can be added later with manual data collection

## Success Criteria

✅ **All tests pass:**
- 30/30 stadiums verified
- 4,675+ section files present
- All pages build successfully
- No TypeScript errors
- No runtime errors
- Sun exposure data loads correctly
- Interactive features work on desktop and mobile

## Troubleshooting

### Build Fails
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
NODE_OPTIONS='--max-old-space-size=8192' npm run build
```

### Sun Data Not Loading
```bash
# Check if precomputed files exist
ls -lh src/data/seatData/*/precomputed-sun-1310pm.json.gz

# Regenerate if missing
npx tsx scripts/precomputeSunData.ts --stadium=dodgers --game-time=13:10
```

### Seat Grid Not Rendering
1. Check browser console for errors
2. Verify section data file exists
3. Check network tab for failed requests
4. Clear browser cache

### Memory Issues During Build
```bash
# Increase Node memory
NODE_OPTIONS='--max-old-space-size=16384' npm run build
```

## Production Deployment Checklist

Before deploying to production:

- [ ] Run `./test-all-stadiums.sh` (all pass)
- [ ] Run `npm run build` (successful)
- [ ] Test 10+ section pages manually
- [ ] Test mobile experience
- [ ] Check performance (Lighthouse score >90)
- [ ] Verify SEO metadata on section pages
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Check analytics tracking (if configured)
- [ ] Verify all 30 stadiums accessible
- [ ] Test error states (invalid sections)
- [ ] Check compression working
- [ ] Verify sitemap includes all section pages

## Next Steps

After successful testing:

1. **Deploy to Vercel/Production**
   ```bash
   git push origin seat-level
   # Vercel will auto-deploy
   ```

2. **Monitor Analytics**
   - Track section page views
   - Monitor seat grid interactions
   - Check conversion rates

3. **SEO Optimization**
   - Submit updated sitemap to Google
   - Monitor search rankings for section pages
   - Add schema markup (future enhancement)

4. **User Feedback**
   - Collect feedback on seat-level feature
   - Monitor error rates
   - Track user engagement metrics

---

**Last Updated:** 2025-10-23
**Test Coverage:** 30/30 MLB Stadiums (100%)
**Production Ready:** YES ✅
