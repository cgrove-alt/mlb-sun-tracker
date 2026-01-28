# Step 4.2: Top 30 MiLB Venues - Row-Level Data Collection Analysis

**Date:** 2026-01-27
**Status:** In Progress
**Agent:** Step 4.2 Implementation

---

## Executive Summary

This document analyzes the current state of the top 30 MiLB venues and outlines the work required to achieve the 60+ section row-level data requirement for each stadium.

### Current State
- **All 30 top-priority MiLB venues exist** in the codebase
- **Current section counts: 17-29 sections per stadium**
- **Target: 60+ sections per stadium** (matching MLB standard)
- **Shortfall: ~31-43 additional sections needed per stadium**

### Required Work
- **Tier 1 (10 stadiums):** Expand from 17-29 → 60+ sections
- **Tier 2 (10 stadiums):** Expand from 29 → 60+ sections
- **Tier 3 (10 stadiums):** Expand from 17-29 → 60+ sections
- **Total new sections to create: ~930-1,290 sections** across 30 stadiums

---

## Detailed Analysis by Tier

### Tier 1: Elite Attendance Leaders (Venues 1-10)

| Rank | Venue | File Location | Current Sections | Needed | Status |
|------|-------|---------------|------------------|---------|---------|
| 1 | Lehigh Valley IronPigs | `aaa/lehigh-valley-ironpigs.ts` | 29 | +31 | ⚠️ Needs expansion |
| 2 | Dayton Dragons | `high-a/dayton-dragons.ts` | 17 | +43 | ⚠️ Needs expansion |
| 3 | Richmond Flying Squirrels | `aa/richmond-flying-squirrels.ts` | 23 | +37 | ⚠️ Needs expansion |
| 4 | Sacramento River Cats | `aaa/sacramento-river-cats.ts` | 29 | +31 | ⚠️ Needs expansion |
| 5 | Charlotte Knights | `aaa/charlotte-knights.ts` | 29 | +31 | ⚠️ Needs expansion |
| 6 | Nashville Sounds | `aaa/nashville-sounds.ts` | 29 | +31 | ⚠️ Needs expansion |
| 7 | Durham Bulls | `aaa/durham-bulls.ts` | 29 | +31 | ⚠️ Needs expansion |
| 8 | Toledo Mud Hens | `aaa/toledo-mud-hens.ts` | 29 | +31 | ⚠️ Needs expansion |
| 9 | Indianapolis Indians | `aaa/indianapolis-indians.ts` | 29 | +31 | ⚠️ Needs expansion |
| 10 | Las Vegas Aviators | `aaa/las-vegas-aviators.ts` | 29 | +31 | ⚠️ Needs expansion |

**Tier 1 Total:** 279 current sections → **600+ target** = **~321 new sections needed**

---

### Tier 2: Strong Regional Markets (Venues 11-20)

| Rank | Venue | File Location | Current Sections | Needed | Status |
|------|-------|---------------|------------------|---------|---------|
| 11 | Oklahoma City Comets | `aaa/oklahoma-city-dodgers.ts` | 29 | +31 | ⚠️ Needs expansion |
| 12 | Omaha Storm Chasers | `aaa/omaha-storm-chasers.ts` | 29 | +31 | ⚠️ Needs expansion |
| 13 | Albuquerque Isotopes | `aaa/albuquerque-isotopes.ts` | 29 | +31 | ⚠️ Needs expansion |
| 14 | Round Rock Express | `aaa/round-rock-express.ts` | 29 | +31 | ⚠️ Needs expansion |
| 15 | Columbus Clippers | `aaa/columbus-clippers.ts` | 29 | +31 | ⚠️ Needs expansion |
| 16 | Memphis Redbirds | `aaa/memphis-redbirds.ts` | 29 | +31 | ⚠️ Needs expansion |
| 17 | Jacksonville Jumbo Shrimp | `aaa/jacksonville-jumbo-shrimp.ts` | 29 | +31 | ⚠️ Needs expansion |
| 18 | Reno Aces | `aaa/reno-aces.ts` | 29 | +31 | ⚠️ Needs expansion |
| 19 | El Paso Chihuahuas | `aaa/el-paso-chihuahuas.ts` | 29 | +31 | ⚠️ Needs expansion |
| 20 | Sugar Land Space Cowboys | `aaa/sugar-land-space-cowboys.ts` | 29 | +31 | ⚠️ Needs expansion |

**Tier 2 Total:** 290 current sections → **600+ target** = **~310 new sections needed**

---

### Tier 3: Solid Performers (Venues 21-30)

| Rank | Venue | File Location | Current Sections | Needed | Status |
|------|-------|---------------|------------------|---------|---------|
| 21 | Greenville Drive | `high-a/greenville-drive.ts` | 17 | +43 | ⚠️ Needs expansion |
| 22 | Worcester Red Sox | `aaa/worcester-red-sox.ts` | 29 | +31 | ⚠️ Needs expansion |
| 23 | Buffalo Bisons | `aaa/buffalo-bisons.ts` | 29 | +31 | ⚠️ Needs expansion |
| 24 | Scranton/W-B RailRiders | `aaa/scranton-railriders.ts` | 29 | +31 | ⚠️ Needs expansion |
| 25 | Tacoma Rainiers | `aaa/tacoma-rainiers.ts` | 29 | +31 | ⚠️ Needs expansion |
| 26 | Gwinnett Stripers | `aaa/gwinnett-stripers.ts` | 29 | +31 | ⚠️ Needs expansion |
| 27 | Louisville Bats | `aaa/louisville-bats.ts` | 29 | +31 | ⚠️ Needs expansion |
| 28 | Portland Sea Dogs | `aa/portland-sea-dogs.ts` | 23 | +37 | ⚠️ Needs expansion |
| 29 | Fresno Grizzlies | `aaa/fresno-grizzlies.ts` | 29 | +31 | ⚠️ Needs expansion |
| 30 | Hartford Yard Goats | `aa/hartford-yard-goats.ts` | 23 | +37 | ⚠️ Needs expansion |

**Tier 3 Total:** 265 current sections → **600+ target** = **~335 new sections needed**

---

## Implementation Strategy

### Phase 1: Research & Data Collection Setup

**Goal:** Establish methodology and gather comprehensive seating data for all 30 venues

**Tasks:**
1. Research official seating charts for each venue (team websites, Ticketmaster, etc.)
2. Document section numbering schemes and naming conventions
3. Identify unique seating areas:
   - Field boxes / loge boxes
   - Club seats / premium seating
   - Upper decks / grandstand
   - Bleachers / outfield sections
   - Standing room / party decks
   - Suites (if separately ticketed)
4. Gather stadium architectural data for 3D geometry

**Timeline:** 2 hours (research for all 30 venues in parallel)

---

### Phase 2: Tier-by-Tier Expansion

#### Tier 1 Implementation (Venues 1-10)
- **Priority:** P0 - Highest attendance venues
- **Approach:** Start with Lehigh Valley IronPigs (#1) to establish quality benchmark
- **Estimated Time:** 6-8 hours per stadium
- **Total:** 60-80 hours for Tier 1

**Process per stadium:**
1. Read current file to understand existing structure
2. Research actual seating chart from official sources
3. Identify all missing sections (typically: additional upper deck, bleachers, club seats, standing room)
4. Add comprehensive row-level data using `generateRows()` helper
5. Calculate accurate 3D vertices using stadium geometry
6. Validate TypeScript compilation
7. Run validation script
8. Test calculations

#### Tier 2 Implementation (Venues 11-20)
- **Priority:** P1 - Strong regional markets
- **Approach:** Apply proven methodology from Tier 1
- **Estimated Time:** 6-8 hours per stadium
- **Total:** 60-80 hours for Tier 2

#### Tier 3 Implementation (Venues 21-30)
- **Priority:** P1 - Strategic importance
- **Approach:** Efficient implementation using established patterns
- **Estimated Time:** 6-8 hours per stadium
- **Total:** 60-80 hours for Tier 3

---

## Quality Standards (NO SHORTCUTS)

### Data Accuracy Requirements
- ✅ **60+ sections minimum** per stadium
- ✅ **Row-level data** for all sections (using RowDetail[] with elevation, depth, seats)
- ✅ **Accurate 3D vertices** (x, y, z coordinates) for shade calculations
- ✅ **Covered status** correctly identified for all sections
- ✅ **Obstruction mapping** for unique stadium features
- ✅ **Zero TypeScript errors**
- ✅ **Zero validation errors**

### Research Standards
- **Primary sources:** Official team seating charts, Ticketmaster interactive maps
- **Secondary sources:** StubHub, SeatGeek, A View From My Seat
- **Verification:** Cross-reference 2-3 sources for each stadium
- **When uncertain:** Mark for review rather than guess

### Implementation Standards
- **Use existing helper functions:** `generateRows()` for consistency
- **Follow MLB patterns:** Reference Fenway Park (74 sections) as gold standard
- **Maintain code quality:** Clean TypeScript, proper types, descriptive naming
- **Document unique features:** Add comments for stadium-specific characteristics

---

## Data Sources by Venue

### Tier 1 Data Sources

1. **Lehigh Valley IronPigs** (Coca-Cola Park)
   - Official: https://www.milb.com/lehigh-valley/ballpark/seating-chart
   - Ticketmaster: Coca-Cola Park seating map
   - Capacity: 10,100 | Opened: 2008

2. **Dayton Dragons** (Day Air Ballpark)
   - Official: https://www.milb.com/dayton/ballpark/seating-chart
   - Unique: Sellout streak stadium, intimate seating
   - Capacity: 7,230 | Opened: 2000

3. **Richmond Flying Squirrels** (The Diamond)
   - Official: https://www.milb.com/richmond/ballpark/seating-chart
   - Note: Final season before new stadium (2026)
   - Capacity: 12,134 | Opened: 1985

4. **Sacramento River Cats** (Sutter Health Park)
   - Official: https://www.milb.com/sacramento/ballpark/seating-chart
   - Capacity: 14,014 | Opened: 2000

5. **Charlotte Knights** (Truist Field)
   - Official: https://www.milb.com/charlotte/ballpark/seating-chart
   - Modern downtown ballpark
   - Capacity: 10,200 | Opened: 2014

6. **Nashville Sounds** (First Horizon Park)
   - Official: https://www.milb.com/nashville/ballpark/seating-chart
   - Features: Guitar-shaped scoreboard, skyline views
   - Capacity: 10,000 | Opened: 2015

7. **Durham Bulls** (Durham Bulls Athletic Park)
   - Official: https://www.milb.com/durham/ballpark/seating-chart
   - Iconic: "Bull Durham" movie fame
   - Capacity: 10,000 | Opened: 1995

8. **Toledo Mud Hens** (Fifth Third Field)
   - Official: https://www.milb.com/toledo/ballpark/seating-chart
   - Downtown location
   - Capacity: 10,300 | Opened: 2002

9. **Indianapolis Indians** (Victory Field)
   - Official: https://www.milb.com/indianapolis/ballpark/seating-chart
   - Consistently rated #1 MiLB ballpark
   - Capacity: 14,230 | Opened: 1996

10. **Las Vegas Aviators** (Las Vegas Ballpark)
    - Official: https://www.milb.com/las-vegas/ballpark/seating-chart
    - Newest: State-of-the-art facility
    - Capacity: 10,000 | Opened: 2019

### Tier 2 & 3 Data Sources
*(Similar documentation for venues 11-30 available in prioritization doc)*

---

## Timeline & Milestones

### Overall Timeline: 8 days (180-240 hours total)

**Day 1:** Research & setup (2 hours)
- Gather all seating charts
- Document section schemes
- Prepare data collection templates

**Days 2-4:** Tier 1 Implementation (60-80 hours)
- 10 stadiums × 6-8 hours
- Venues 1-10 expanded to 60+ sections
- Continuous validation

**Days 4-6:** Tier 2 Implementation (60-80 hours)
- 10 stadiums × 6-8 hours
- Venues 11-20 expanded to 60+ sections
- Continuous validation

**Days 6-8:** Tier 3 Implementation (60-80 hours)
- 10 stadiums × 6-8 hours
- Venues 21-30 expanded to 60+ sections
- Final validation

**Day 8:** Final QA (4 hours)
- Run comprehensive validation suite
- Test 3D calculations on sample stadiums
- Create summary report
- Update plan.md

---

## Success Metrics

### Quantitative Targets
- ✅ **30/30 stadiums** with 60+ sections (100% completion)
- ✅ **1,800+ total sections** across all 30 venues
- ✅ **Zero TypeScript errors** across all files
- ✅ **Zero validation errors** from validation script
- ✅ **100% row-level coverage** (all sections have RowDetail[])

### Qualitative Goals
- Establish theshadium.com as the definitive MiLB shade resource
- Match MLB data quality standards for top MiLB venues
- Enable accurate 3D shade calculations for 12-13.5M annual MiLB fans
- Build foundation for expanding to remaining 90 MiLB venues

---

## Risk Mitigation

### Challenge: Limited Public Data
**Risk:** Some MiLB stadiums may have less detailed public seating data than MLB venues
**Mitigation:**
- Use multiple data sources for cross-verification
- Focus on ticketing platform interactive maps (Ticketmaster, StubHub)
- Leverage fan photo sites (A View From My Seat) for real-world verification
- When data gaps exist, apply reasonable estimates based on similar stadiums

### Challenge: Stadium Variations
**Risk:** MiLB stadiums have more varied layouts than MLB (different capacities, unique designs)
**Mitigation:**
- Study each stadium individually, don't template blindly
- Document unique features in code comments
- Use flexible section numbering to accommodate non-standard layouts
- Test calculations on representative sections before full expansion

### Challenge: Time Constraints
**Risk:** 180-240 hours across 30 stadiums is substantial
**Mitigation:**
- Phased approach allows quality validation at each tier
- Proven methodology from MLB Phase 1 reduces learning curve
- Can adjust scope if necessary (e.g., target 60 sections exactly vs. 70+)
- Prioritize accuracy over speed (quality first principle)

---

## Next Steps

1. ✅ **Complete this analysis** ← Current step
2. **Begin Tier 1 implementation** starting with Lehigh Valley IronPigs
3. **Validate continuously** after each stadium
4. **Document findings** for methodology refinement
5. **Create summary report** upon completion
6. **Update plan.md** marking step 4.2 complete

---

## Conclusion

All 30 top-priority MiLB venues exist in the codebase with foundational data (17-29 sections each). The task is to **expand each venue to 60+ sections with comprehensive row-level data**, matching the MLB standard established in Phase 1.

**This is achievable** using the proven methodology from MLB data collection. With disciplined research, systematic implementation, and continuous validation, we will deliver the most comprehensive MiLB shade data in the industry.

**NO SHORTCUTS. NO EXCUSES. FIND THE ROOT CAUSE AND DELIVER QUALITY.**

---

**Status:** Analysis complete, ready to begin Tier 1 implementation
**Next:** Start with Lehigh Valley IronPigs expansion
