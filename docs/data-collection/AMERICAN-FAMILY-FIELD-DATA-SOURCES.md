# American Family Field (Milwaukee Brewers) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 41,900 seats (current official capacity)
**Sections**: ~133 sections across 4 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**100 Level (Field Level)**
- Lower bowl seating closest to field
- Center sections: 112-123 (behind home plate)
- End sections: 107-111, 124-129 (baselines)
- Corner sections: 101-106, 130-131 (outfield)
- Total: ~31 sections
- Row range: 1-25 (corners start at row 10-30; end sections 1-27)

**200 Level (Loge Level)**
- Mid-level seating with better sightlines
- Center sections: 216-221 (infield)
- Corner sections: 206-211, 226-228 (baselines)
- End sections: 212-215, 222-225 (outfield)
- Total: ~23 sections
- Row range: 1-10 (corners and ends 1-20)
- Sections 216-223 benefit from natural roof overhang

**300 Level (Club Level)**
- Premium club seating with amenities
- Center sections: 326-332
- Corner sections: 306-319, 333-345
- Total: ~40 sections (306-345)
- Row range: 1-7 across all sections
- Club seats: sections 320-339 (PNC Club/Skyy Lounge)
- Sections 330-338 are climate-controlled

**400 Level (Terrace/Upper Level)**
- Upper deck, most affordable seating
- Center sections: 416-428 (behind home plate)
- Corner sections: 404-415, 429-442 (wrap around)
- Total: ~39 sections (404-442)
- Row range: 1-24 (centers), 1-25 (corners)
- Terrace Box: front 7 rows of sections 407-437
- Sections 420-428 benefit from natural roof overhang

### Seating Distribution (Total: 41,900)

**Estimated Breakdown:**
- 100 Level: ~13,000 seats (31%)
- 200 Level: ~7,000 seats (17%)
- 300 Level: ~10,000 seats (24%)
- 400 Level: ~11,900 seats (28%)

### Special Features

**Retractable Roof**:
- **Type**: Fan-shaped convertible roof (unique in North America)
- **Operation Time**: Less than 10 minutes to open or close
- **Material**: Glass panes allow natural light for Kentucky bluegrass
- **Control**: Can be left partially open for games

**Premium Seating**:
- Northwestern Mutual Legends Club
- Johnson Controls Stadium Club (PNC Club Level)
- Leinenkugel's Leinie Lodge (above right-field bleachers)
- Club seats occupy sections 320-339

**Special Areas**:
- Bernie's Chalet (left field)
- Power Playground (right field line)
- Right field picnic area (capacity 75)
- Sensory friendly area (established June 2022)

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (standard MLB practice)
- Varying seats per row by location and level

**Row Numbering**:
- 100 level: Numbers (1-25, some start at 10-30)
- 200 level: Numbers (1-10, corners/ends 1-20)
- 300 level: Numbers (1-7)
- 400 level: Numbers (1-24 centers, 1-25 corners)

**Covered Sections (when roof open)**:
- Sections 412-420 (very good shade)
- Sections 216-223 (Loge - natural overhang)
- Sections 420-428 (Terrace - natural overhang)
- Sections 117-125 (Field Infield - shade increases during 1:10 PM games)
- Sections 330-338 (Club - shaded & climate-controlled)
- Sections 212-215, rows 17+ (good shade)
- Upper deck third base side (under cover)

**Sun-Exposed Sections (when roof open)**:
- Sections 228-236 (avoid for sun protection)
- Sections 438-442 (avoid for sun protection)
- Lower level third base side (worst for staying out of sun)

---

## Data Sources

### 1. Wikipedia - American Family Field ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/American_Family_Field
- **Pros**:
  - Official capacity: 41,900
  - Retractable roof details (fan-shaped, <10 minutes operation)
  - Opened: April 6, 2001
  - Special areas and features
  - Historical context
- **Best For**: Capacity verification and stadium features

### 2. TicketIQ - Miller Park Seating Chart
- **URL**: https://blog.ticketiq.com/blog/miller-park-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Exact section ranges for all levels (100, 200, 300, 400)
  - Row ranges for each level
  - Center/corner/end section breakdowns
  - Club seat locations (320-339)
  - Detailed seating organization
- **Best For**: Section number validation and row details

### 3. RateYourSeats.com - Shaded/Covered Seats
- **URL**: https://www.rateyourseats.com/american-family-field/seating/shaded-covered-seats
- **Pros**:
  - Specific sections for shade (412-420, 216-223, 420-428)
  - Sections to avoid for sun (228-236, 438-442)
  - Row-specific shade information
  - 1:10 PM game sun patterns
  - Climate-controlled section details
- **Best For**: Sun exposure and coverage mapping

### 4. MLB.com Brewers Official
- **URL**: https://www.mlb.com/brewers/ballpark/seating-map
- **Status**: Interactive map (data not directly extractable)
- **Best For**: Visual reference (when accessible)

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 357° (from stadiums.ts - home plate to center field, essentially due north)
- **Latitude**: 43.0280°N
- **Longitude**: -87.9712°W
- **Timezone**: America/Chicago (Central Time)
- **Opened**: April 6, 2001
- **Original Name**: Miller Park (2001-2020)
- **Current Name**: American Family Field (2021-present)
- **Architect**: HKS, Inc. (with NBBJ, Eppstein Uhen Architects)

### Physical Characteristics
- **Roof**: Retractable (fan-shaped, unique design)
- **Roof Operation**: <10 minutes open/close
- **Field**: Kentucky bluegrass (natural grass grows under glass roof panels)
- **Climate**: Milwaukee (cold winters, moderate summers)
- **Location**: Milwaukee, Wisconsin
- **Home Team**: Milwaukee Brewers
- **Type**: MLB stadium with retractable roof

### Dimensions
- LF Line: 344 ft
- CF: 400 ft
- RF Line: 345 ft
- LF Power Alley: 371 ft
- RF Power Alley: 374 ft
- Nearly symmetrical design

---

## Capacity History

- **Opening (2001)**: 41,900 seats (Miller Park)
- **2001-2020**: 41,900 seats (Miller Park era)
- **2021-present**: 41,900 seats (American Family Field era)
- **Target for Generation**: 41,900 seats (exact match required)

**Note**: Capacity has remained stable since opening

---

## Data Collection Strategy

### Approach
Given the capacity (41,900 seats) and four-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Four distinct levels (100, 200, 300, 400)
   - Well-documented section organization
   - Validate against total capacity

2. **Section Grouping**
   - 100 Level: 31 sections (101-131) → ~13,000 seats (419 avg/section)
   - 200 Level: 23 sections (206-228) → ~7,000 seats (304 avg/section)
   - 300 Level: 40 sections (306-345) → ~10,000 seats (250 avg/section)
   - 400 Level: 39 sections (404-442) → ~11,900 seats (305 avg/section)
   - **Total**: 133 sections

3. **Known Section Ranges**
   - 100: 101-106, 107-111, 112-123, 124-129, 130-131
   - 200: 206-211, 212-215, 216-221, 222-225, 226-228
   - 300: 306-345 (continuous, club seats 320-339)
   - 400: 404-442 (continuous)

### Validation Targets
- ✅ Total capacity: 41,900 seats (exact match required)
- ✅ Four distinct levels (100, 200, 300, 400)
- ✅ Club seats in sections 320-339
- ✅ Covered section flags for roof-open scenario
- ✅ ~133 sections total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- North orientation (357°) - rare in MLB
- Fan-shaped retractable roof (unique design)
- Four-level structure
- Symmetric bowl design
- Natural grass under glass roof panels

**Seating Pattern**:
- Clear level organization (100, 200, 300, 400)
- Club level integrated (300s)
- Varying row counts by level (7-25 rows)
- Upper deck wraps around (404-442)

**Complexity**:
- Moderate complexity
- Four distinct levels with clear ranges
- Well-documented section organization
- Straightforward numbering scheme

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 45 minutes ✅ (Complete)
- Script development: 45-60 minutes (estimated)
- Validation: 45-60 minutes
- Pre-computation: 4-5 minutes (41,900 seats)
- **Total**: ~2.5-3 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateBrewersSeats.ts`)
3. Generate seat coordinates for ~133 sections
4. Validate total capacity matches 41,900 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 14/30 completion

---

## References

- Official Brewers Ballpark: https://www.mlb.com/brewers/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/American_Family_Field
- Opened: April 6, 2001
- Location: 1 Brewers Way, Milwaukee, WI 53214
- Original Name: Miller Park (2001-2020)

---

## Special Considerations

**Sun Exposure Notes**:
- North orientation (357°) means:
  - Morning games: sun from east (first base side)
  - Afternoon games: sun from west (third base side)
  - Sections 412-420, 216-223, 420-428 have best shade
  - Sections 228-236, 438-442 most sun-exposed
- Retractable roof provides full coverage when closed
- When roof open: natural overhangs provide partial shade
- Milwaukee climate: cold spring/fall, roof often closed April-May, Sept-Oct

**Retractable Roof Strategy**:
- April-May: Often closed (cold weather)
- June-August: Often open (favorable weather)
- September-October: Often closed (cooling weather)
- Can be left partially open during games
- Sun precomputation should account for roof-open scenario

**Validation Priorities**:
- Target exact capacity (41,900 seats)
- Verify 4 levels distributed properly
- Confirm club seats in sections 320-339
- Apply covered flags for sections with natural overhang
- Total = exactly 41,900 seats

**Milwaukee Timezone Note**:
- America/Chicago (Central Time, CT)
- Follows Daylight Saving Time
- Important for sun calculations

---

**Status**: Ready for generation script development
**Target Capacity**: 41,900 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: 133 sections (4 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 14/30 in completion sequence
