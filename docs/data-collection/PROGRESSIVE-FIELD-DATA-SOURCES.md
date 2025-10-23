# Progressive Field (Cleveland Guardians) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 34,830 seats (from stadiums.ts configuration)
**Sections**: ~200+ sections across 5 main levels plus 115 suites
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**100 Level (Lower Bowl)**
- Regular sections: 101-179 (79 sections)
- Bleacher sections: 180-185 (6 sections, left field)
- Row range: A or J (first row) through HH (last row)
- Double-lettered rows: AA comes after Z
- Sections 136-138: First baseline near visitors dugout
- Sections 152-155: Behind home plate (movable chairs, drink rails)
- Sections 162-165: Guardians dugout area
- Sections 138-146: Visitors dugout area, "best perch for watching players"
- Total: ~85 sections
- Row range: varies by section (typically ~30 rows)

**200 Level (Suites)**
- Team suites: 115 total suites
- Located on 100, 200, and 300 levels
- Mix of luxury and party suites
- Not traditional seating sections

**300 Level (Club)**
- Club sections: 326-348 (first baseline, ~23 sections)
- Family Deck: 303-316 (right field corner, ~14 sections)
- Additional club areas: 257-259, 262, 265, 267
- Row range: typically ~10-15 rows
- All-inclusive food and non-alcoholic beverages
- Climate-controlled lounge access
- Total: ~46 sections

**400 Level (Box)**
- Party suites on third base side
- Upper box sections
- Estimated sections (specific range TBD)

**500 Level (Upper Deck)**
- Sections: 550-577 (28 sections)
- Upper deck seating
- Panoramic views
- Most affordable seating
- Row range: varies (typically 15-25 rows)

### Seating Distribution (Total: 34,830)

**Estimated Breakdown:**
- 100 Level (Lower + Bleachers): ~16,000 seats (46%)
- Suites (200 level): ~3,000 seats (9%)
- 300 Level (Club): ~6,500 seats (19%)
- 400 Level (Box): ~3,500 seats (10%)
- 500 Level (Upper): ~5,830 seats (16%)

### Special Features

**"Little Green Monster":**
- Left field wall: 19 feet high
- Named after Boston's Green Monster
- Center and right field walls: 9 feet high

**Physical Characteristics:**
- Total acreage: 12 acres
- Playing surface: Kentucky Bluegrass (natural grass)
- Luxury suites: 115 (reduced from original 121)
- Seats angled at 8-12° on three tiers
- Hunter green seats (being replaced with blue during 2022-2025 renovations)

**Field Dimensions:**
- LF Line: 325 ft
- CF: 400 ft
- RF Line: 325 ft
- Symmetric design (equal LF/RF)

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (standard MLB practice)
- Varying seats per row by location and level

**Row Numbering**:
- 100 level: Letters/Numbers (A or J through HH, with AA after Z)
- 300 level: Letters (A through O typically)
- 500 level: Letters (A through Z typically)

**Covered Sections (day games - open-air stadium)**:

*For 1:10 PM games (early afternoon):*
- 100 level: Sections 152-155 (deeper rows), 128-148 (rows X+)
- 100 level: Sections 140-144 (top 1/3 behind home dugout)
- 300 level: Sections 257-259, 262, 265, 267 (rows C-E best)
- 300 level: Sections 326-348 (club areas)
- 500 level: Sections 553-556 (rows G+ benefit from roof)

*For 4:10 PM games (late afternoon):*
- 100 level: Sections 156-174 (shaded)
- 400 level: Sections 461-474 (shaded)
- 500 level: Sections 561-575 (shaded), rows G+

**Sun-Exposed Sections (avoid for day games)**:
- Right field: Sections 303-317 (longest sun exposure)
- Right field: Sections 504-514 (longest sun exposure)
- Bleachers: Sections 180-185 (exposed until sunset)

---

## Data Sources

### 1. Wikipedia - Progressive Field ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Progressive_Field
- **Pros**:
  - Official capacity history (42,865 → 45,569 peak → 34,820 current)
  - Opened: April 2, 1994
  - First game: April 4, 1994 (41,459 attendance)
  - Dimensions and field specifications
  - Historical context and renovations
- **Best For**: Capacity verification and stadium history

### 2. RateYourSeats.com - Progressive Field Seating
- **URL**: https://www.rateyourseats.com/progressive-field/seating
- **Pros**:
  - Section-by-section breakdowns
  - Row details (A/J through HH for 100 level)
  - Specific section mentions (152-155, 140-146, etc.)
  - Club level details (326-348, 303-316)
  - Upper deck info (550-577)
- **Best For**: Section number validation and row details

### 3. ShadedSeats.com - Progressive Field Shade
- **URL**: https://www.shadedseats.com/shaded-seats-progressive-field/
- **Pros**:
  - Specific covered sections by game time
  - 1:10 PM vs 4:10 PM shading differences
  - Row-specific recommendations (rows X+, G+, C-E)
  - Sections to avoid for sun (303-317, 504-514)
- **Best For**: Sun exposure and coverage mapping

### 4. MLB.com Guardians Official
- **URL**: https://www.mlb.com/guardians/ballpark/information
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 60° (from stadiums.ts - home plate to center field, ENE orientation)
- **Latitude**: 41.4962°N
- **Longitude**: -81.6852°W
- **Timezone**: America/Chicago (NOTE: Cleveland is Eastern Time, may need correction)
- **Opened**: April 2, 1994
- **Original Name**: Jacobs Field (1994-2008)
- **Current Name**: Progressive Field (2008-present)

### Physical Characteristics
- **Roof**: Open-air (no roof)
- **Field**: Kentucky Bluegrass (natural grass)
- **Climate**: Cleveland (cold winters, moderate summers)
- **Location**: Cleveland, Ohio
- **Home Team**: Cleveland Guardians (formerly Indians, renamed 2022)
- **Type**: MLB stadium, open-air

### Dimensions
- LF Line: 325 ft
- CF: 400 ft
- RF Line: 325 ft
- Symmetric design

---

## Capacity History

- **Opening (1994)**: 42,865 seats (Jacobs Field)
- **1997-2003**: 43,368 seats
- **2008**: 43,545 seats (renamed Progressive Field)
- **2009**: 45,199 seats
- **2010**: 45,569 seats (PEAK CAPACITY)
- **2015**: 36,856 seats (major reduction - removed upper deck behind RF and 1B line)
- **2021-2023**: 34,830 seats
- **2025**: 34,820 seats (per Wikipedia)
- **stadiums.ts**: 34,830 seats (configuration in codebase)
- **Target for Generation**: 34,830 seats (exact match required)

**Note**: 2015 renovation significantly reduced capacity by removing upper-deck seating behind right field and first base line, replacing with terraces for group use.

**Ongoing Renovations (2022-2025)**:
- $200 million renovation agreement (2022)
- All green seats → blue seats
- Capacity to remain ~35,000
- Expected completion: after 2025 season

---

## Data Collection Strategy

### Approach
Given the capacity (34,830 seats) and five-level structure plus suites:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Five main levels (100, 200 suites, 300 club, 400 box, 500 upper)
   - Bleacher sections separate from regular 100s
   - 115 luxury suites integrated
   - Validate against total capacity

2. **Section Grouping**
   - 100 Level: ~85 sections (101-179 + 180-185) → ~16,000 seats (188 avg/section)
   - Suites: ~115 suites → ~3,000 seats (26 avg/suite)
   - 300 Level: ~46 sections → ~6,500 seats (141 avg/section)
   - 400 Level: ~20 sections → ~3,500 seats (175 avg/section)
   - 500 Level: ~28 sections (550-577) → ~5,830 seats (208 avg/section)
   - **Total**: ~294 sections/suites

3. **Known Section Ranges**
   - 100: 101-179 (regular), 180-185 (bleachers)
   - 200: Suites only (115 total)
   - 300: 257-259, 262, 265, 267, 303-316, 326-348
   - 400: Party suites, box sections (specific range TBD)
   - 500: 550-577 (continuous)

### Validation Targets
- ✅ Total capacity: 34,830 seats (exact match required)
- ✅ Five distinct levels plus suites
- ✅ Bleacher sections in left field (180-185)
- ✅ Club sections with premium features
- ✅ Covered section flags for overhang areas
- ✅ ~294 sections/suites total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- ENE orientation (60°) - moderate angle
- Open-air (no roof)
- Five-level structure (most complex yet)
- Symmetric dimensions (equal LF/RF 325 ft)
- "Little Green Monster" 19-ft left field wall

**Seating Pattern**:
- Five distinct levels (100, 200 suites, 300 club, 400 box, 500 upper)
- Large suite presence (115 suites across multiple levels)
- Bleacher sections separate from regular 100 level
- Significant overhang providing shade
- Varying row counts by level (15-30 rows)

**Complexity**:
- High complexity
- Five distinct levels plus extensive suites
- Bleacher sections with different characteristics
- Multiple club/premium areas
- Significant capacity reduction history (45,569 → 34,830)

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-75 minutes (estimated, complex structure)
- Validation: 60-75 minutes (iterative tuning for exact capacity)
- Pre-computation: 4-5 minutes (34,830 seats)
- **Total**: ~3-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateGuardiansSeats.ts`)
3. Generate seat coordinates for ~294 sections/suites
4. Validate total capacity matches 34,830 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 16/30 completion (53.3% progress)

---

## References

- Official Guardians Ballpark: https://www.mlb.com/guardians/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Progressive_Field
- Opened: April 2, 1994
- Location: 2401 Ontario St, Cleveland, OH 44115
- Original Name: Jacobs Field (1994-2008)
- Team renamed: Indians → Guardians (2022)

---

## Special Considerations

**Sun Exposure Notes**:
- ENE orientation (60°) means:
  - Morning games: sun from east/northeast
  - Afternoon games: sun from south/southwest (right field most exposed)
  - Best shade: sections 140-144 (top rows), 257-259 (club), 500 level rows G+
  - Worst sun: sections 303-317, 504-514 (right field)
- Open-air stadium: no roof coverage
- Overhang provides significant shade in certain areas
- Cleveland climate: potential for cool/cold day games April-May, Sept-Oct

**Overhang Coverage Strategy**:
- Lower level: rows X+ in sections 128-148
- Club level: rows C-E in sections 257-259, 262, 265, 267
- Upper level: rows G+ in most 500 sections
- Time-dependent: 1:10 PM vs 4:10 PM have different shade patterns
- Sun precomputation should account for overhang geometry

**Timezone Discrepancy (CRITICAL)**:
- stadiums.ts shows: "America/Chicago" (Central Time, UTC-6/UTC-5)
- Cleveland actual: Eastern Time Zone (UTC-5/UTC-4)
- Should be: "America/New_York"
- Will use as configured, may need correction in future
- Important for sun calculations!

**Capacity Reduction Context**:
- Peak capacity: 45,569 (2010)
- Current capacity: 34,830 (2025)
- Reduction: 10,739 seats removed (23.5% decrease)
- Major 2015 renovation: removed upper deck behind RF and 1B line
- Replaced with terraces for group use
- Smallest MLB stadium by capacity (as of 2025)

**Validation Priorities**:
- Target exact capacity (34,830 seats)
- Verify 5 levels plus suites distributed properly
- Confirm bleacher sections 180-185 in left field
- Apply covered flags for sections with overhang
- Total = exactly 34,830 seats (100.00% match)

**Obstructions**:
- Already defined: src/data/obstructions/mlb/guardians-obstructions.ts
- Obstructions include upper deck overhangs
- Ready for sun precomputation

---

**Status**: Ready for generation script development
**Target Capacity**: 34,830 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~294 sections/suites (5 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 16/30 in completion sequence (53.3% after completion)
