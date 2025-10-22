# Chase Field (Arizona Diamondbacks) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 48,686 seats (from stadiums.ts configuration)
**Sections**: ~102 sections across 3 main levels plus suites
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**100 Level (Lower Bowl)**
- Center sections: 116-128 (behind home plate)
- End sections: 101-110 (LF line), 134-143 (RF line)
- Corner sections: 111-115 (3B), 129-133 (1B)
- Special sections: 100W (Diamond Club), 145W (Picnic Pavilion)
- Suite sections: A, B (3B boxes), C-Q (infield suites), R, S (1B boxes)
- Total: ~44 sections
- Row range: 1-40 (corner), 14-40 (end), 21-40 (center)
- Suites: 7 rows (A, B, R, S), 13 rows (C-Q)

**200 Level (Club Level)**
- Center sections: 207-214 (infield)
- Corner sections: 205-206 (3B), 215-217 (1B)
- End sections: 200-204 (LF), 218-224 (RF, includes 224W)
- Total: ~25 sections
- Row range: 1-11 across all sections
- Contains 4,400 club seats and 57 luxury suites
- All-You-Can-Eat sections included

**300 Level (Upper Deck)**
- Center sections: 313-319 (behind home plate)
- Corner sections: 310-312 (3B), 320-322 (1B)
- End sections: 300-309 (LF, includes 300W), 323-332 (RF, includes 332W)
- Total: ~33 sections
- Row range: 1-40 (center and corner), 1-32 (some end sections)
- MVP Boxes: sections 310-322 (behind home plate)

### Seating Distribution (Total: 48,686)

**Estimated Breakdown:**
- 100 Level: ~24,000 seats (49%)
- 200 Level: ~11,000 seats (23%)
- 300 Level: ~13,686 seats (28%)

### Special Features

**Retractable Roof**:
- **Type**: Convertible roof with panels
- **Operation Time**: 4.5 minutes to fully open or close
- **Motors**: Two 200-horsepower motors
- **HVAC**: Cools interior to ~78°F when closed, capacity for 2,500 homes
- **Material**: Allows natural light when closed
- **Status 2025**: Fully functional as of March 27, 2025 home opener

**Premium Seating**:
- 4,400 club seats (200 level)
- 57 luxury suites
- 6 party suites
- Diamond Club (section 100W)
- Pool Suite (accommodates 35 guests)
- Picnic Pavilion (section 145W)

**Playing Surface**:
- Artificial turf (Shaw Sports B1K) since 2019
- Previously natural grass (1998-2018)

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (standard MLB practice)
- Varying seats per row by location and level

**Row Numbering**:
- 100 level: Numbers/Letters (1-40, or 14-40, or 21-40 depending on section)
- 200 level: Numbers (1-11 all sections)
- 300 level: Numbers (1-40 center/corner, 1-32 some ends)
- Suite sections: Rows A-M (13 rows) or A-G (7 rows)

**Covered Sections (when roof open)**:
- Sections 300-302, 330-332 (upper deck, best shade)
- Sections 106-109, 111 (corner infield, 3B side)
- Sections 135-138 (corner infield, 1B side)
- Sections 220-223 (club level corners)
- Sections 314-318 (upper deck, back rows)
- Sections 319-327 (upper deck, back rows)
- Sections 328-332 (upper deck, back rows)

**Sun-Exposed Sections (when roof open)**:
- Right field sections (most sun exposure)
- First base side (except back rows of 300-level)
- Sections to avoid for sun protection: RF baseline and corner

---

## Data Sources

### 1. Wikipedia - Chase Field ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Chase_Field
- **Pros**:
  - Official capacity: 48,330 (2023-present)
  - Historical capacity data (48,500 at opening, peak 49,033 in 2002-2007)
  - Retractable roof specifications (4.5 min, 200hp motors)
  - Opened: March 31, 1998
  - Construction cost: $354 million ($683M in 2024 dollars)
  - Field dimensions and surface details
- **Best For**: Capacity verification and stadium features

### 2. TicketIQ - Chase Field Seating Chart
- **URL**: https://blog.ticketiq.com/blog/chase-field-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Exact section ranges for all levels (100, 200, 300)
  - Row ranges for each section type
  - Center/corner/end section breakdowns
  - Club seat locations and premium areas
  - Detailed seating organization
- **Best For**: Section number validation and row details

### 3. RateYourSeats.com - Shaded/Covered Seats
- **URL**: https://www.rateyourseats.com/chase-field/seating/shaded-covered-seats
- **Pros**:
  - Specific sections for shade (300-302, 330-332, 106-109, 111, 135-138, 220-223)
  - Sections to avoid for sun (right field)
  - Row-specific shade information
  - Time-of-day sun patterns
  - Upper deck coverage details
- **Best For**: Sun exposure and coverage mapping

### 4. MLB.com Diamondbacks Official
- **URL**: https://www.mlb.com/dbacks/ballpark/information
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 23° (from stadiums.ts - home plate to center field, NNE orientation)
- **Latitude**: 33.4455°N
- **Longitude**: -112.0667°W
- **Timezone**: America/Phoenix (NO DAYLIGHT SAVING TIME - year-round MST/UTC-7)
- **Opened**: March 31, 1998
- **Original Name**: Bank One Ballpark (1998-2005)
- **Current Name**: Chase Field (2005-present)
- **Architect**: Ellerbe Becket

### Physical Characteristics
- **Roof**: Retractable (4.5 minutes operation)
- **Field**: Artificial turf (Shaw Sports B1K, since 2019)
- **Climate**: Phoenix (extreme heat summers, mild winters)
- **Location**: Phoenix, Arizona
- **Home Team**: Arizona Diamondbacks
- **Type**: MLB stadium with retractable roof

### Dimensions
- LF Line: 330 ft
- CF: 407 ft
- RF Line: 334 ft
- Deep Power Alleys: 413 ft
- Asymmetrical design

---

## Capacity History

- **Opening (1998)**: 48,500 seats (Bank One Ballpark)
- **2002-2007**: 49,033 seats (peak capacity)
- **2008-2022**: Various configurations (48,400-48,700)
- **2023-present**: 48,330 seats (per Wikipedia)
- **stadiums.ts**: 48,686 seats (configuration in codebase)
- **Target for Generation**: 48,686 seats (exact match required)

**Note**: Capacity discrepancy exists between sources. Using stadiums.ts value (48,686) as authoritative for this implementation.

---

## Data Collection Strategy

### Approach
Given the capacity (48,686 seats) and three-level structure plus suites:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Three main levels (100, 200, 300) plus suite sections
   - Well-documented section organization
   - Validate against total capacity

2. **Section Grouping**
   - 100 Level: ~44 sections → ~24,000 seats (545 avg/section)
   - 200 Level: ~25 sections → ~11,000 seats (440 avg/section)
   - 300 Level: ~33 sections → ~13,686 seats (415 avg/section)
   - **Total**: ~102 sections

3. **Known Section Ranges**
   - 100: 101-145, plus A, B, C-Q, R, S, 100W, 145W
   - 200: 200-224 (including 214L, 215L, 224W)
   - 300: 300-332 (including 300W, 332W)

### Validation Targets
- ✅ Total capacity: 48,686 seats (exact match required)
- ✅ Three distinct levels plus suites
- ✅ Club seats in 200 level (4,400 seats)
- ✅ Covered section flags for roof-open scenario
- ✅ ~102 sections total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- NNE orientation (23°) - uncommon in MLB
- Retractable roof (4.5 min operation, fast!)
- Three-level structure plus extensive suite system
- Artificial turf (since 2019)
- Pool suite (unique feature)

**Seating Pattern**:
- Clear level organization (100, 200, 300)
- Club level integrated (200s)
- Varying row counts by level (11-40 rows)
- Upper deck wraps around (300-332)
- Letter-named suite sections (A, B, C-Q, R, S)

**Complexity**:
- Moderate-high complexity
- Three distinct levels with clear ranges
- Suite sections add complexity
- Special sections (100W, 145W, etc.)
- Well-documented section organization

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 45 minutes ✅ (Complete)
- Script development: 45-60 minutes (estimated)
- Validation: 45-60 minutes (iterative tuning for exact capacity)
- Pre-computation: 5-6 minutes (48,686 seats)
- **Total**: ~2.5-3 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateDiamondbacksSeats.ts`)
3. Generate seat coordinates for ~102 sections
4. Validate total capacity matches 48,686 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 15/30 completion (50% milestone!)

---

## References

- Official Diamondbacks Ballpark: https://www.mlb.com/dbacks/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Chase_Field
- Opened: March 31, 1998
- Location: 401 E Jefferson St, Phoenix, AZ 85004
- Original Name: Bank One Ballpark (1998-2005)

---

## Special Considerations

**Sun Exposure Notes**:
- NNE orientation (23°) means:
  - Morning/early games: sun from east (first base side)
  - Afternoon games: sun from west/southwest (right field most exposed)
  - Sections 300-302, 330-332 have best shade (upper deck overhang)
  - Sections 106-109, 111, 135-138, 220-223 also well-shaded
- Retractable roof provides full coverage when closed
- When roof open: upper deck provides significant shade
- Phoenix climate: extreme heat (110°F+ in summer), roof often closed June-Aug

**Retractable Roof Strategy**:
- April-May: Often open (pleasant weather, 80-95°F)
- June-August: Often closed (extreme heat, 105-115°F)
- September-October: Often open (cooling off, 85-100°F)
- Fastest MLB retractable roof (4.5 minutes)
- Sun precomputation should account for roof-open scenario

**Arizona Timezone (CRITICAL)**:
- America/Phoenix does NOT observe Daylight Saving Time
- Year-round UTC-7 (Mountain Standard Time)
- No spring forward / fall back adjustments
- Simplifies sun calculations (constant offset)
- Different from most of North America

**Validation Priorities**:
- Target exact capacity (48,686 seats)
- Verify 3 levels plus suites distributed properly
- Confirm club seats in 200 level (~4,400)
- Apply covered flags for sections with natural overhang
- Total = exactly 48,686 seats (100.00% match)

**Obstructions**:
- Already defined: src/data/obstructions/mlb/diamondbacks-obstructions.ts
- 8 obstructions: upper deck overhangs (3), scoreboard, light towers (4), retractable roof, press box
- Ready for sun precomputation

---

**Status**: Ready for generation script development
**Target Capacity**: 48,686 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~102 sections (3 levels + suites)
**Generation Method**: Programmatic (recommended)
**Stadium**: 15/30 in completion sequence (50% MILESTONE!)
