# Minute Maid Park (Daikin Park) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 41,168 seats (2017-present)
**Recent Name Change**: Now "Daikin Park" (2024+), previously "Minute Maid Park" (2002-2024)
**Sections**: ~120-150 sections across 4 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure (Official Breakdown)

**Lower Level (Field Level)**
- **Capacity**: 19,201 seats (46.6% of total)
- Crawford Boxes: Sections 100-104 (left field, elevated, 315 ft to wall)
- Field-level seating wraps from RF to LF
- Includes premium Diamond Club sections
- Sections: Estimated 100-179

**Second Level (Club/Mezzanine)**
- **Capacity**: 7,132 seats (17.3% of total)
- Club seating with premium amenities
- 5,197 club seats distributed across levels
- Historical note: Sections 256-258 removed in 2017 (Tal's Hill elimination)
- Sections: Estimated 200-259 (with 256-258 gaps)

**Suite Level**
- **Capacity**: 880 seats (2.1% of total)
- 63 luxury suites
- Located between lower and upper levels
- Private viewing areas

**Upper Level (View Deck)**
- **Capacity**: 13,750 seats (33.4% of total)
- Highest seating tier
- Most affordable options
- Confirmed sections include: 336, 431, 323
- Sections: Estimated 300-449

### Seating Distribution

**Total Breakdown:**
- Lower: 19,201 (46.6%)
- Second: 7,132 (17.3%)
- Suite: 880 (2.1%)
- Upper: 13,750 (33.4%)
- **Total: 41,168 seats**

**Premium Seating:**
- Club seats: 5,197 (integrated across levels)
- Luxury suites: 63 (suite level)

### Special Features

**Crawford Boxes (Left Field)**
- Sections 100-104
- Elevated seating above out-of-town scoreboard
- 315-foot distance to wall (shortest in park)
- Iconic architectural feature

**Retractable Roof**
- Typically open: April and May only
- Closed: June-September (Houston summer heat)
- Fully climate-controlled when closed

**Unique Characteristics:**
- Train runs on tracks above left field wall (visual landmark)
- Tal's Hill removed 2017 (center field incline eliminated)
- Natural grass field
- Built 2000, opened March 30, 2000

**2017 Renovation Impact:**
- Removed sections 256, 257, 258 (center field mezzanine)
- Moved CF fence from 436 ft to 409 ft
- Eliminated 90-foot-wide Tal's Hill incline

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (standard MLB practice)
- Varying seats per row by location and level

**Row Numbering**:
- Lower level: Mix of letter and number rows
- Club level: Typically numbered rows
- Upper level: Numbered rows

**Covered Sections**:
- Retractable roof provides full coverage when closed
- When open: Upper deck has overhang coverage
- Second level: Partial coverage from upper deck overhang
- Lower level: Mostly uncovered when roof open

---

## Data Sources

### 1. Wikipedia - Minute Maid Park ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Minute_Maid_Park
- **Pros**:
  - Official capacity: 41,168 (2017-present)
  - Exact level breakdown (Lower, Second, Suite, Upper)
  - Premium seating counts (5,197 club, 63 suites)
  - 2017 renovation details (sections 256-258 removed)
  - Crawford Boxes information (sections 100-104)
- **Best For**: Capacity verification and level organization

### 2. RateYourSeats.com
- **URL**: https://www.rateyourseats.com/minute-maid-park/seating
- **Pros**:
  - Section examples (336, 431, 109, 323, 219)
  - Premium area mentions
  - User photos from actual seats
- **Cons**: Limited structural specifications
- **Best For**: Section number validation

### 3. MLB.com Astros Official
- **URL**: https://www.mlb.com/astros/ballpark/seating-map
- **Status**: Interactive map (data not extractable)
- **Best For**: Visual reference (when accessible)

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 20° (from stadiums.ts - home plate to center field, NNE)
- **Latitude**: 29.7570°N
- **Longitude**: -95.3555°W
- **Timezone**: America/Chicago (Central Time)
- **Opened**: March 30, 2000 (vs. Phillies exhibition)
- **First Regular Season**: April 7, 2000
- **Architect**: HOK Sport (now Populous)

### Physical Characteristics
- **Roof**: Retractable (typically closed June-Sept)
- **Field**: Natural grass
- **Climate**: Hot, humid summers (hence roof usage)
- **Location**: Houston, Texas
- **Home Team**: Houston Astros
- **Previous Stadium**: Astrodome (1965-1999)
- **Notable**: First MLB park with retractable roof and natural grass

### Dimensions
- LF Line: 315 ft (Crawford Boxes)
- CF: 409 ft (reduced from 436 ft in 2017)
- RF Line: 326 ft
- LF Power Alley: 362 ft
- RF Power Alley: 373 ft

---

## Capacity History

- **Opening (2000)**: 40,950 seats
- **Post-2001 Expansion**: 42,000 seats
- **Post-2017 Renovation**: 41,168 seats (current)
  - Removed sections 256-258 (center field)
  - Eliminated Tal's Hill
  - Moved CF fence inward
- **Record Attendance**: 43,823 (September 22, 2017)
- **Target for Generation**: 41,168 seats (exact match required)

**Name History:**
- 2000-2002: Enron Field
- 2002-2024: Minute Maid Park
- 2024-present: Daikin Park

**Note**: Using 41,168 as official target from stadiums.ts

---

## Data Collection Strategy

### Approach
Given the capacity (41,168 seats) and known level distribution:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation with official level capacities
   - Four distinct levels with documented seat counts
   - Modern stadium (2000) with clear organization
   - Validate against both total and per-level capacities

2. **Estimated Section Grouping**
   - Lower Level: ~80 sections → 19,201 seats (240 avg/section)
   - Second Level: ~40 sections → 7,132 seats (178 avg/section)
   - Suite Level: 63 suites → 880 seats (14 avg/suite)
   - Upper Level: ~60 sections → 13,750 seats (229 avg/section)
   - **Total**: ~180 sections + 63 suites = ~243 total

3. **Known Sections**
   - Crawford Boxes: 100-104
   - Removed: 256-258 (skip in generation)
   - Upper examples: 336, 431, 323
   - Lower example: 109
   - Second example: 219

### Validation Targets
- ✅ Total capacity: 41,168 seats (exact match required)
- ✅ Lower level: 19,201 seats (46.6%)
- ✅ Second level: 7,132 seats (17.3%)
- ✅ Suite level: 880 seats (2.1%)
- ✅ Upper level: 13,750 seats (33.4%)
- ✅ Skip sections 256-258 (removed 2017)
- ✅ 5,197 club seats distributed
- ✅ 63 luxury suites

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- NNE orientation (20°) - morning sun from NE, afternoon sun from W
- Retractable roof (typically closed in summer)
- Built into urban downtown Houston
- Crawford Boxes create asymmetric left field
- Train tracks above left field wall (unique visual)

**Seating Pattern**:
- Clear four-level structure with documented capacities
- Heavy lower-level emphasis (46.6% of seats)
- Moderate upper deck (33.4%)
- Integrated club seats across levels
- 2017 renovation removed center field sections

**Complexity**:
- Moderate complexity
- Well-documented modern stadium
- Clear level organization with known capacities
- Section gaps (256-258) require special handling

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 1.5 hours ✅ (Complete)
- Script development: 3-4 hours (estimated)
- Validation: 1-2 hours
- Pre-computation: 2 hours
- **Total**: ~7.5-9.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateAstrosSeats.ts`)
3. Generate seat coordinates targeting per-level capacities
4. Validate:
   - Total: 41,168 seats (±0 tolerance)
   - Lower: 19,201 seats
   - Second: 7,132 seats
   - Suite: 880 seats
   - Upper: 13,750 seats
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 11/30 completion

---

## References

- Official Astros Ballpark: https://www.mlb.com/astros/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Minute_Maid_Park
- Stadium Opened: March 30, 2000
- Location: 501 Crawford Street, Houston, TX 77002
- Previous Names: Enron Field (2000-2002), Minute Maid Park (2002-2024)
- Current Name: Daikin Park (2024-present)

---

## Special Considerations

**Sun Exposure Notes**:
- NNE orientation (20°) means:
  - Morning games: sun from northeast
  - Afternoon games: sun from west (first base side)
- Retractable roof typically closed June-September
- When roof closed: no sun exposure
- When roof open (April-May): sun patterns vary
- Houston climate: hot, humid, strong UV

**Retractable Roof Strategy**:
- April-May: Often open (70-85°F)
- June-September: Almost always closed (90-100°F+)
- Rain events: Roof closes
- Sun precomputation should account for both scenarios

**Validation Priorities**:
- Verify per-level capacity matches exactly
- Crawford Boxes (100-104) premium positioning
- Skip sections 256-258 (removed)
- 5,197 club seats distributed properly
- 63 suites with ~14 seats each
- Total = 41,168 exactly

---

**Status**: Ready for generation script development
**Target Capacity**: 41,168 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Level Targets**: L:19,201 | S:7,132 | Su:880 | U:13,750
**Generation Method**: Programmatic (recommended)
**Stadium**: 11/30 in completion sequence
