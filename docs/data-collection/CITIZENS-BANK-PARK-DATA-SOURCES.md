# Citizens Bank Park Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 42,901 seats (2023-present)
**Sections**: ~120-140 sections across 4 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Field Level (100s)**
- Sections: 101-148
- Diamond Club: Sections A-G (behind home plate, premium)
- Baseline Box: Sections 108-114 (first base), 126-132 (third base)
- Rooftop Bleachers: Outfield sections (Budweiser Rooftop)
- Scoreboard Porch: Left field (below Big Board)
- Typical rows: 1-40 per section
- Row 1: Closest to field
- Rows 33+: Covered by overhang in infield sections

**Mezzanine/Hall of Fame Club Level (200s)**
- Hall of Fame Club: Sections 212-232 (6,600 seats per Wikipedia)
- Pavilion sections: Right field area (past the gap)
- Premium mid-level seating
- Above suites level
- Excellent sightlines

**Terrace Level (300s)**
- Sections: 312-333
- Pavilion Deck: Right field sections
- Typical rows: 1-20 per section
- Upper deck lower tier
- Good views despite height

**Terrace Deck (400s)**
- Sections: 412-428
- Highest level seating
- Typical rows: 1-20 per section
- Upper deck upper tier
- Rows 16-20: Covered by roof
- Most affordable seating
- Right field ends at gap (no 400 level past gap)

### Special Sections

**Premium Clubs**
- Diamond Club: Sections A-G (behind home plate, 18 rows)
- CP Rankin Club: Behind home plate (1,164 seats per Wikipedia)
- Hall of Fame Club: Sections 212-232 (6,600 seats per Wikipedia)
- Pavilion sections: 200 level in right field

**Specialty Areas**
- Rooftop Bleachers: Outfield (Budweiser Rooftop, cheapest seats)
- Scoreboard Porch: Left field below scoreboard
- Bullpen sections: Sections 201, 301 (right field, near visiting bullpen)
- Standing Room Only: Various locations
- Ashburn Alley: Center field walkway with restaurants

### Seating Conventions

**Seat Numbering**:
- Seats number from RIGHT to LEFT when facing the field
- Seat 1 always on the right (standard MLB practice)
- Average seats per row: 19
- Range: ~10-25 seats per row (varies by section)

**Row Numbering**:
- Field level: Numbers 1-40 (row 1 closest to field)
- Diamond Club: Rows 1-18
- 200 level: Variable rows (Club seating)
- 300 level: Rows 1-20
- 400 level: Rows 1-20

**Covered Sections**:
- Field level: Rows 33+ in infield sections
- 400 level: Rows 16-20 (top 4-5 rows)
- Protection from weather and sun

---

## Data Sources

### 1. Interactive Seating Chart Websites

#### MLB.com Phillies Official
- **URL**: https://www.mlb.com/phillies/tickets/seating-map
- **Pros**:
  - Official Phillies source
  - Interactive seat map
  - Accurate section numbering
- **Cons**: Dynamic content, requires interaction
- **Best For**: Authoritative section layout

#### RateYourSeats.com ⭐ RECOMMENDED
- **URL**: https://www.rateyourseats.com/citizens-bank-park/seating
- **Pros**:
  - Detailed section-by-section views
  - User photos from actual seats
  - Row and seat number information
- **Cons**: Requires manual browsing
- **Best For**: Seat-level validation and photos

#### MapaPlan.com ⭐ RECOMMENDED
- **URL**: https://www.mapaplan.com/seating-plan/philadelphia-citizens-bank-park-stadium-detailed-interactive-seat-row-numbers-chart-plan/philadelphia-citizens-bank-park-stadium-seating-chart-plan.htm
- **Pros**:
  - Extremely detailed interactive chart
  - Shows seat and row numbers
  - Section-by-section breakdown
- **Cons**: May require manual exploration
- **Best For**: Detailed row/seat validation

#### TickPick.com
- **URL**: https://www.tickpick.com/citizens-bank-park-seating-chart/
- **Pros**:
  - Interactive seating chart
  - Row and seat references
- **Cons**: Less technical detail
- **Best For**: Visual validation

#### BallparkEGuides.com
- **URL**: https://ballparkeguides.com/citizens-bank-park-seating-2/
- **Pros**:
  - Comprehensive level breakdown
  - Coverage information (overhang details)
  - Best/cheap seats recommendations
- **Cons**: Not all technical specs
- **Best For**: Understanding coverage and level organization

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 59° (from stadiums.ts - home plate to center field, NE orientation)
- **Latitude**: 39.9061°N
- **Longitude**: 75.1665°W
- **Timezone**: America/New_York (Eastern Time)
- **Opened**: April 3, 2004

### Physical Characteristics
- **Roof**: Open air
- **Climate**: Hot summers, moderate springs/falls
- **Location**: Philadelphia, Pennsylvania
- **Home Team**: Philadelphia Phillies
- **Unique Features**:
  - Liberty Bell (52-foot tall replica, activates after home runs)
  - Ashburn Alley (center field walkway)
  - Natural grass playing surface
  - PhanaVision HD scoreboard (152' x 86')

---

## Capacity History

Per Wikipedia:
- **2023-Present**: 42,901 seats (CURRENT TARGET)
- **2019-2021**: 42,792 seats
- **2018**: 43,035 seats
- **2011-2017**: 43,651 seats

**Note**: stadiums.ts currently shows 42,792 and needs updating to 42,901

---

## Data Collection Strategy

### Approach
Given the capacity (42,901 seats) and well-organized structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented patterns
   - Four distinct levels with clear numbering schemes
   - Modern stadium (2004) with consistent layout
   - Validate against official sources

2. **Section Grouping**
   - Field Level: ~55 sections (101-148, A-G, bleachers)
   - Hall of Fame Club: ~25 sections (212-232, pavilion)
   - Terrace: ~25 sections (312-333, pavilion deck)
   - Terrace Deck: ~20 sections (412-428)
   - Total: ~125 sections estimated

### Validation Targets
- ✅ Total capacity: 42,901 seats (official 2023-present)
- ✅ ~120-140 sections
- ✅ Varying seats/row (10-25 range, average 19)
- ✅ 1-40 rows/section depending on level
- ✅ Premium clubs, diamond club, standing room

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- Modern design (2004)
- Four distinct levels (Diamond/Field, Club, Terrace, Terrace Deck)
- NE orientation (59°) - afternoon sun in left field, evening sun in right field
- Right field gap (no 400-level seating past gap)

**Seating Pattern**:
- Consistent modern numbering (100s, 200s, 300s, 400s)
- Average 19 seats per row
- Deep field sections (up to 40 rows)
- Premium integration (Diamond Club A-G, Hall of Fame Club)

**Complexity**:
- Moderate complexity
- Well-documented modern stadium
- Clear level organization
- Extensive premium seating

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 2 hours ✅ (Complete)
- Script development: 4-6 hours (estimated)
- Validation: 2 hours
- Pre-computation: 2 hours
- **Total**: ~10-12 hours

---

## Next Steps

1. ✅ Research Complete
2. Update stadiums.ts capacity from 42,792 to 42,901
3. Create generation script (`scripts/generatePhilliesSeats.ts`)
4. Generate seat coordinates for all ~125 sections
5. Validate total capacity matches 42,901 exactly (±0 seats tolerance)
6. Pre-compute sun exposure data for 2026 home games
7. Build and test integration
8. Commit Phase 3 completion

---

## References

- Official Phillies Ballpark Info: https://www.mlb.com/phillies/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Citizens_Bank_Park
- Seating Capacity: 42,901 (official 2023-present capacity)
- Stadium Opened: April 3, 2004
- Location: 1 Citizens Bank Way, Philadelphia, PA 19148

---

## Special Considerations

**Sun Exposure Notes**:
- NE orientation (59°) means:
  - Morning/early afternoon sun in left field
  - Late afternoon/evening sun in right field
  - Third base side gets afternoon sun
  - First base side gets evening sun
- Field level exposed throughout day games
- Rows 33+ on field level covered by overhang
- Top 4-5 rows of 400 level covered by roof
- Diamond Club mostly indoor/covered

**Validation Priorities**:
- Focus on 100s level (most variable seat counts, 40 rows)
- Verify Hall of Fame Club 6,600 seat total
- Validate Diamond Club sections A-G layout
- Confirm covered vs uncovered rows
- Check right field gap (no 400-level seating)

---

**Status**: Ready for generation script development
**Target Capacity**: 42,901 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~120-140
**Generation Method**: Programmatic (recommended)
