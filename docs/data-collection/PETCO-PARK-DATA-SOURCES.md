# Petco Park (San Diego Padres) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 40,209 seats (from stadiums.ts - 2017-2018 configuration)
**Sections**: ~120 sections across 4 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Premium Club (A-L)**
- Sections: A-L (12 alphabetic sections behind home plate)
- Located above field level, below 200 level
- Row range: 1-20 (typically 15-18 rows)
- Features: Premium Club access, padded seats, in-seat wait service
- Note: Compass Premier Club seats
- Estimated capacity: ~1,500 seats

**Field Level (100-Level)**
- Sections: 101-137 (37 sections)
- Row range varies by location:
  * Center sections (101-111): Rows A-I (9 letter rows)
  * End sections (118-137): Rows 1-25
  * Some sections extend to rows 43-46
- Dugout locations:
  * Padres dugout: Sections 107-109
  * Visitors dugout: Sections 108-110
- Special: All You Can Eat seats in sections 125, 127
- Estimated capacity: ~12,000 seats

**Club Level (200-Level / Toyota Terrace)**
- Sections: 201-235 (approximately 35 sections)
- Center sections: 201-208
- Corner sections: 210-212
- End sections: 213-235
- Row range: 1-15 (center), 1-13 (ends/corners)
- Premium: Terrace VIP seats (sections 201-204)
- Cutwater Coronado Club (third base side)
- Agave Club seating
- Estimated capacity: ~11,000 seats (includes premium/suites)

**Upper Level (300-Level)**
- Sections: 300-328 (29 sections)
- Center sections: 300-302
- Corner/end sections: 304-328
- Row range: 1-27 (most sections)
- Upper Box: Rows 1-6
- Upper Reserved: Rows 7+
- Coverage: Rows 19+ typically covered by overhang
- Estimated capacity: ~16,000 seats

**Western Metal Supply Co. Building**
- Historic 1909 brick structure integrated into ballpark
- Southeast corner serves as left field foul pole
- Multi-level seating structure:
  * Ground floor: Team store
  * 2nd-3rd floors: Suites (Foul Pole Suite, Entertainment Suite)
  * 5th floor: Budweiser Loft with The Rail seating
  * Rooftop: 4,000 sq ft deck with bleachers, party area
- Connected to main seating via cantilevered balconies
- Estimated capacity: ~300 seats (included in totals above)

### Seating Distribution (Total: 40,209)

**Estimated Breakdown:**
- Premium Club (A-L): ~1,500 seats (3.7%)
- Field Level (100s): ~12,000 seats (29.9%)
- Club Level (200s): ~11,000 seats (27.4%)
- Upper Level (300s): ~16,000 seats (39.8%)

**Alternative Breakdown from Sources:**
- Field Level: ~12,000 seats
- Toyota Terrace: ~4,000 seats
- Suites & Premium: ~7,200 seats
- Upper Infield: ~8,000 seats
- Upper Outfield: ~6,000 seats
- Bleachers: ~3,000 seats

### Special Features

**Premium Seating:**
- Compass Premier Club (sections A-L)
- Field Box VIP seating
- Home Plate Club
- Dugout Club
- Toyota Terrace VIP (sections 201-204)
- Cutwater Coronado Club (3rd base side)
- Agave Club
- The Rail (Budweiser Loft, Western Metal Supply Co.)
- Luxury suites throughout

**Special Areas:**
- Gallagher Square (lawn seating, standing room)
- Western Metal Supply Co. rooftop deck
- All You Can Eat sections (125, 127)
- Bullpens: Left-center field (right of section 134)

**Unique Features:**
- Seat #1 is always closest to home plate (different from most MLB parks)
- Batter faces due north (unique orientation)
- Views of San Diego Bay and skyline beyond left field
- Historic warehouse integration (Western Metal)

### Seating Conventions

**Seat Numbering**:
- Seat #1 always closest to home plate (unique to Petco Park)
- Average seats per row: ~26 (varies by section and location)
- Seats number away from home plate

**Row Numbering**:
- Premium Club (A-L): Rows 1-20 (typically 15-18)
- Field Level center (101-111): Rows A-I (letter rows)
- Field Level ends (118-137): Rows 1-25
- Field Level extended: Some sections to rows 43-46
- Club Level center: Rows 1-15
- Club Level ends: Rows 1-13
- Upper Level: Rows 1-27

**Section Numbering Pattern**:
- Odd numbers (101, 103, etc.): 1st base side and right field
- Even numbers (100, 102, etc.): 3rd base side and left field
- A-L: Premium Club (alphabetic, behind home plate)
- 100s: Field Level (101-137)
- 200s: Club Level (201-235)
- 300s: Upper Level (300-328)

**Covered Sections**:
- Upper Level rows 19+ typically covered by overhang
- Western Metal Supply Co. rooftop has covered trellis areas
- Club Level sections may have partial coverage

**Sun-Exposed Sections (avoid for day games)**:
- Field Level 3rd base side: Afternoon sun exposure
- Upper Level front rows (1-18): No overhang coverage
- Right field sections: Morning sun exposure
- Western Metal rooftop: Full sun exposure (has trellis for partial shade)

---

## Data Sources

### 1. Wikipedia - Petco Park ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Petco_Park
- **Pros**:
  - Complete capacity history (2004-present)
  - Current: 39,860 seats (2024)
  - Historical: 40,209 seats (2017-2018) - matches stadiums.ts
  - 40,162 seats (2016)
  - Stadium opened April 8, 2004
  - Batter faces due north orientation
- **Best For**: Capacity verification and stadium history

### 2. TicketIQ - Petco Park Seating Chart ⭐ RECOMMENDED
- **URL**: https://blog.ticketiq.com/blog/petco-park-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Detailed section ranges by level
  - Field Level: 101-137 (center 101-111, corner 113-119, end 118-137)
  - Club Level: 201-235 (center 201-208, corner 210-212, end 213-235)
  - Upper Level: 300-328 (center 300-302, corner/end 304-328)
  - Row ranges specified for each area
- **Best For**: Section organization and row details

### 3. MLB.com Padres Official
- **URL**: https://www.mlb.com/padres/ballpark/seat-map
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

### 4. Petco Park Insider ⭐ RECOMMENDED
- **URL**: https://www.petcoparkinsider.com/padres-seating-chart
- **Pros**:
  - Comprehensive seating guide
  - Level descriptions and features
  - Odd/even section numbering pattern explained
  - Seat #1 closest to home plate (unique feature)
- **Best For**: Overall seating layout understanding

### 5. RateYourSeats.com
- **URL**: https://www.rateyourseats.com/petco-park/seating/seating-chart/padres
- **Pros**:
  - User reviews and ratings
  - Section-specific information
  - Coverage and shade details
- **Best For**: Section validation and user feedback

### 6. Cloud California Adventures - Capacity Breakdown
- **URL**: https://cloud.visitcalifornia.com/petco-park-seating-capacity
- **Pros**:
  - Detailed capacity breakdown by level
  - Field Level: ~12,000 seats
  - Toyota Terrace: ~4,000 seats
  - Suites/Premium: ~7,200 seats
  - Upper Infield: ~8,000 seats
  - Upper Outfield: ~6,000 seats
  - Bleachers: ~3,000 seats
- **Best For**: Capacity distribution validation

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 25° (from stadiums.ts - home plate to center field)
- **Field Orientation**: Batter faces due north (per Wikipedia)
- **Latitude**: 32.7076°N
- **Longitude**: -117.1570°W
- **Timezone**: America/Los_Angeles (Pacific Time, UTC-8/UTC-7)
- **Opened**: April 8, 2004
- **Location**: 100 Park Boulevard, San Diego, CA 92101

### Physical Characteristics
- **Roof**: Open (no roof)
- **Playing Surface**: Natural grass
- **Climate**: San Diego (Mediterranean, mild year-round)
- **Home Team**: San Diego Padres
- **Type**: MLB stadium, open-air with historic building integration

### Dimensions
- LF Line: 334 ft
- LF: 357 ft
- LF-Center: 390 ft
- CF: 396 ft
- RF-Center: 391 ft
- RF: 382 ft
- RF Line: 322 ft
- Backstop: 52 ft
- Asymmetrical design

---

## Capacity History

- **Opening (2004-2007)**: 42,445 seats
- **2008-2012**: 42,691 seats
- **2013**: 42,524 seats
- **2014**: 42,302 seats
- **2015**: 41,164 seats
- **2016**: 40,162 seats
- **2017-2018**: 40,209 seats
- **2019**: 40,204 seats
- **2020-2021**: 40,019 seats
- **2022-2023**: 39,909 seats
- **2024-present**: 39,860 seats (current)
- **stadiums.ts**: 40,209 seats (2017-2018 configuration)
- **Target for Generation**: 40,209 seats (exact match required)

**Note**: Using 40,209 from stadiums.ts as authoritative capacity. This represents the 2017-2018 configuration.

---

## Data Collection Strategy

### Approach
Given the capacity (40,209 seats) and four-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Four distinct levels (Premium A-L, Field 100s, Club 200s, Upper 300s)
   - Handle alphabetic premium sections
   - Validate against total capacity

2. **Section Grouping**
   - Premium Club (A-L): ~12 sections → ~1,500 seats (125 avg/section)
   - Field Level (101-137): ~37 sections → ~12,000 seats (324 avg/section)
   - Club Level (201-235): ~35 sections → ~11,000 seats (314 avg/section)
   - Upper Level (300-328): ~29 sections → ~15,709 seats (542 avg/section)
   - **Total**: ~113 sections

3. **Known Section Ranges**
   - Premium: A-L (12 sections)
   - Field Level: 101-137
   - Club Level: 201-235
   - Upper Level: 300-328

### Validation Targets
- ✅ Total capacity: 40,209 seats (exact match required)
- ✅ Four distinct levels
- ✅ Alphabetic premium sections (A-L)
- ✅ Odd/even section pattern (odd=1st base/RF, even=3rd base/LF)
- ✅ Western Metal Supply Co. seating integrated
- ✅ ~113 sections total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- 25° orientation (NE) - batter faces due north
- Open roof, natural grass
- Historic Western Metal Supply Co. building integration (left field foul pole)
- San Diego Bay and skyline views
- Four-level structure with alphabetic premium tier
- 2004 construction (modern design)

**Seating Pattern**:
- Unique: Seat #1 always closest to home plate (different from most MLB)
- Alphabetic premium sections (A-L)
- Varying row counts (9-46 rows depending on section)
- Letter rows (A-I) in field level center
- Numeric rows elsewhere
- Odd sections on 1st base/RF, even on 3rd base/LF

**Complexity**:
- Moderate-high complexity
- Four distinct levels with varying structures
- Alphabetic premium sections require special handling
- Western Metal Supply Co. building adds unique geometry
- Not all section numbers used (gaps in numbering)
- Well-documented modern stadium

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-75 minutes (estimated)
- Validation: 60-75 minutes (iterative tuning for exact capacity)
- Pre-computation: 5-6 minutes (40,209 seats)
- **Total**: ~3-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generatePadresSeats.ts`)
3. Generate seat coordinates for ~113 sections
4. Validate total capacity matches 40,209 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 21/30 completion (70.0% progress)

---

## References

- Official Padres Ballpark: https://www.mlb.com/padres/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Petco_Park
- Opened: April 8, 2004
- Location: 100 Park Boulevard, San Diego, CA 92101
- Architect: HOK Sport (now Populous)
- Cost: $474 million (opened), $411 million (adjusted)

---

## Special Considerations

**Sun Exposure Notes**:
- 25° orientation (NE) means:
  - Morning games: sun from east (behind 1st base)
  - Afternoon games: sun from south/southwest (3rd base side exposed)
  - Best shade: Upper deck rows 19+ (overhang coverage)
  - Worst sun: Field level 3rd base side, upper front rows
- Open roof: full sun exposure on clear days
- San Diego climate: Mild year-round, 60-75°F typical
- Sun precomputation critical for all seating areas

**Open Roof Considerations**:
- March-October: Very mild, 65-75°F, excellent baseball weather
- San Diego rarely exceeds 80°F at the coast
- Marine layer can provide natural shade/cooling
- Rain extremely rare during baseball season
- Consistent comfortable conditions for day games

**Pacific Timezone**:
- America/Los_Angeles (Pacific Time)
- Observes Daylight Saving Time (UTC-8 winter, UTC-7 summer)
- Same timezone as LAD, LAA, OAK, SF, SEA

**Validation Priorities**:
- Target exact capacity (40,209 seats)
- Verify 4 levels distributed properly
- Include premium sections A-L (alphabetic)
- Handle odd/even section numbering correctly
- Western Metal Supply Co. seating integrated
- Total = exactly 40,209 seats (100.00% match)

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/padres-obstructions.ts
- May need to create obstruction definitions
- Obstructions include upper deck overhangs, Western Metal building
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 40,209 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~113 sections (4 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 21/30 in completion sequence (70.0% after completion)
