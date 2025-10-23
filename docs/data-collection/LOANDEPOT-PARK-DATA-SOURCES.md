# loanDepot park (Miami Marlins) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 37,446 seats (from stadiums.ts configuration)
**Sections**: ~130 sections across 3 main levels + suites
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Promenade Level (Field/Lower Bowl)**
- Regular sections: 1-40 (40 sections)
- Bullpen sections: 134-141 (8 sections)
- Row range: Varies by section (AA-DD for Dugout Club, 1-20+ for regular sections)
- Diamond Club: Sections 4-8 (premium seating behind home plate)
- Dugout Clubs: Sections 1-3 (1st base), 9-11 (3rd base) - rows AA-DD
- Clubhouse Box: Sections 8-10, 19-21
- Bullpen Reserved: Sections 134-141 (outfield)
- Home Run Porch: Sections 38-40
- Protective netting: Sections behind home plate
- Total: ~48 sections
- Estimated capacity: ~16,000 seats

**Legends Level (Club/Mid Level)**
- Regular sections: 201-228 (28 sections)
- Suite sections: S15-S42 (28 sections)
- Row range: 1-12 across most sections
- Premium features: Legends Platinum (cushioned seats), club access
- Total: ~56 sections
- Estimated capacity: ~8,000 seats

**Vista Level (Upper Deck)**
- Sections: 302-327 (26 sections)
- Row range: 1-20 across sections
- Best value sections with clear views
- Covered sections: 304-309 (1st base line, under retractable roof)
- Total: ~26 sections
- Estimated capacity: ~13,500 seats

### Seating Distribution (Total: 37,446)

**Estimated Breakdown:**
- Promenade Level: ~16,000 seats (42.7%)
- Legends Level: ~8,000 seats (21.4%)
- Vista Level: ~13,500 seats (36.0%)

### Special Features

**Retractable Roof:**
- **Type**: Retractable roof (covers entire seating bowl)
- **Operation Time**: 14.5 minutes to open, 7-8 minutes to close
- **Weight**: 8,300 tons of steel covered with white membrane
- **Usage**: Opens for favorable weather conditions
- **Note**: Transparent outfield panels can open separately

**Playing Surface**:
- Bermuda grass (2012-2019)
- Shaw Sports B1K artificial turf (2020-present)
- Modern climate-controlled environment when roof closed

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (toward lower-numbered adjacent section)
- Varying seats per row by location and level

**Row Numbering**:
- Promenade level: AA-DD (Dugout Club), 1-20+ (regular sections)
- Legends level: 1-12
- Vista level: 1-20

**Covered Sections (when roof open)**:

*Best shade for day games:*
- Vista level: Sections 304-309 (1st base line, fully covered)
- Promenade level: Back rows of sections 34-40 (right field, under overhang)

**Sun-Exposed Sections (when roof open - avoid for day games)**:
- Left field: Sections 134-141 (full sun exposure)
- Lower promenade infield: Sections 11-30 (most sun exposure)

---

## Data Sources

### 1. Wikipedia - loanDepot Park ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/LoanDepot_Park
- **Pros**:
  - Official capacity history (36,742 seats, 37,442 with standing room)
  - Opened: April 4, 2012
  - Retractable roof specifications (14.5 min open, 8,300 tons)
  - Dimensions and field specifications
  - Historical context and renovations
- **Best For**: Capacity verification and stadium history

### 2. The Stadium Insiders - Miami Marlins
- **URL**: https://thestadiuminsiders.com/stadium_guides/miami-marlins/seating-chart/
- **Pros**:
  - Detailed seating level breakdown
  - Premium area information
  - Visual seating chart
- **Best For**: Level organization and premium sections

### 3. MLB.com Marlins Official
- **URL**: https://www.mlb.com/marlins/ballpark/seating-map
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

### 4. RateYourSeats.com
- **URL**: https://www.rateyourseats.com/loandepot-park/seating/seating-chart/marlins
- **Pros**:
  - Section ranges for all levels
  - User reviews and ratings
  - Premium seating details
- **Best For**: Section validation and user feedback

### 5. ShadedSeats.com
- **URL**: https://www.shadedseats.com/loandepot-park-shaded-seats/
- **Pros**:
  - Covered section information (304-309, 34-40 back rows)
  - Sun exposure patterns
  - Time-of-day recommendations
- **Best For**: Sun exposure and coverage mapping

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 40° (from stadiums.ts - home plate to center field, NE orientation)
- **Latitude**: 25.7781°N
- **Longitude**: -80.2197°W
- **Timezone**: America/New_York (Eastern Time, UTC-5/UTC-4)
- **Opened**: April 4, 2012
- **Original Name**: Marlins Park (2012-2020)
- **Current Name**: loanDepot park (2021-present)

### Physical Characteristics
- **Roof**: Retractable (14.5 min to open, covers entire seating bowl)
- **Field**: Artificial turf (Shaw Sports B1K, since 2020)
- **Climate**: Miami (hot, humid summers; warm winters)
- **Location**: Little Havana, Miami, Florida
- **Home Team**: Miami Marlins
- **Type**: MLB stadium with retractable roof

### Dimensions
- LF Line: 344 ft
- LF-Center: 386 ft
- CF: 400 ft
- RF-Center: 387 ft
- RF Line: 335 ft
- Backstop: 47 ft
- Symmetrical design with slight variations

---

## Capacity History

- **Opening (2012)**: 37,442 seats (with standing room)
- **Official Seating**: 36,742 seats
- **stadiums.ts**: 37,446 seats (configuration in codebase)
- **Target for Generation**: 37,446 seats (exact match required)

**Note**: Minor variations in reported capacity due to standing room areas and temporary seating adjustments.

---

## Data Collection Strategy

### Approach
Given the capacity (37,446 seats) and three-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Three main levels (Promenade, Legends, Vista) + suites
   - Well-documented section organization
   - Validate against total capacity

2. **Section Grouping**
   - Promenade: ~48 sections → ~16,000 seats (333 avg/section)
   - Legends: ~56 sections → ~8,000 seats (143 avg/section)
   - Vista: ~26 sections → ~13,500 seats (519 avg/section)
   - **Total**: ~130 sections

3. **Known Section Ranges**
   - Promenade: 1-40, 134-141
   - Legends: 201-228, S15-S42 (suites)
   - Vista: 302-327

### Validation Targets
- ✅ Total capacity: 37,446 seats (exact match required)
- ✅ Three distinct levels plus suites
- ✅ Bullpen sections in outfield (134-141)
- ✅ Club seats in Legends level (~8,000 seats)
- ✅ Covered section flags for overhang areas
- ✅ ~130 sections total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- NE orientation (40°) - favorable for afternoon games
- Retractable roof (full coverage, modern design)
- Three-level structure with integrated suites
- Artificial turf (climate control benefits)
- Modern 2012 construction

**Seating Pattern**:
- Clear level organization (Promenade, Legends, Vista, Suites)
- Varying row counts by level (4-20 rows)
- Dugout Club premium seating (rows AA-DD)
- Home Run Porch in right field
- Bullpen seating sections in outfield

**Complexity**:
- Moderate complexity
- Three distinct levels with clear ranges
- Retractable roof affects sun patterns
- Well-documented section organization
- Modern stadium with consistent design

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 45-60 minutes (estimated)
- Validation: 45-60 minutes (iterative tuning for exact capacity)
- Pre-computation: 4-5 minutes (37,446 seats)
- **Total**: ~2.5-3 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateMarlinsSeats.ts`)
3. Generate seat coordinates for ~130 sections
4. Validate total capacity matches 37,446 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 18/30 completion (60.0% progress)

---

## References

- Official Marlins Ballpark: https://www.mlb.com/marlins/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/LoanDepot_Park
- Opened: April 4, 2012
- Location: 501 Marlins Way, Miami, FL 33125
- Original Name: Marlins Park (2012-2020)

---

## Special Considerations

**Sun Exposure Notes**:
- NE orientation (40°) means:
  - Morning games: sun from east (less common)
  - Afternoon games: sun from south/southwest
  - Best shade: Vista sections 304-309, Promenade back rows 34-40
  - Worst sun: Left field bullpen sections 134-141, lower promenade infield
- Retractable roof: full coverage when closed
- Miami climate: hot and humid April-September (often closed for AC)
- Sun precomputation should account for roof-open scenario

**Retractable Roof Strategy**:
- April-May: Mixed (warm, 75-85°F, often closed for AC)
- June-September: Often closed (hot, humid, 85-95°F, AC needed)
- October: Often open (cooler, 75-85°F)
- Roof closes for heat/humidity, not just rain
- Stadium cooler when closed (AC system)
- Roof movements depend on weather and comfort
- Sun precomputation should account for roof-open scenario

**Miami Timezone**:
- America/New_York (Eastern Time)
- Observes Daylight Saving Time (UTC-5 winter, UTC-4 summer)
- Same timezone as NYM, PHI, BAL, TB, ATL, WSH

**Validation Priorities**:
- Target exact capacity (37,446 seats)
- Verify 3 levels plus suites distributed properly
- Confirm bullpen sections 134-141 in outfield
- Apply covered flags for sections with overhang (304-309, back rows 34-40)
- Total = exactly 37,446 seats (100.00% match)

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/marlins-obstructions.ts
- May need to create obstruction definitions
- Obstructions include retractable roof, upper deck overhangs, light towers
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 37,446 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~130 sections (3 levels + suites)
**Generation Method**: Programmatic (recommended)
**Stadium**: 18/30 in completion sequence (60.0% after completion)
