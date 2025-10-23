# Coors Field (Colorado Rockies) Seating Data Sources

**Last Updated**: 2025-10-23
**Official Capacity**: 50,144 seats (from stadiums.ts)
**Sections**: ~139 sections across 4 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**100-Level / Lower Bowl (Sections 105-160)**
- Total sections: 56 sections
- Center sections: 123-138 (16 sections behind home plate)
- End sections: 116-122, 139-144 (14 sections down baselines)
- Corner sections: 105-115, 145-160 (26 sections in outfield)
- Row range varies by location:
  * Center sections (123-138): Rows 5-39 (35 rows)
  * End sections (116-122, 139-144): Rows 1-39 (39 rows)
  * Corner sections (105-115, 145-160): Rows 12-39 (28 rows)
- Dugout locations:
  * Rockies dugout: Sections 121-125
  * Visitors dugout: Sections 136-140
- Bullpens: In front of sections 201-204
- Estimated capacity: ~30,000 seats

**200-Level / Club Level (Sections 201-209, 214-247)**
- Total sections: ~33 sections (with gaps in numbering)
- Continuous ranges:
  * 201-209 (9 sections - behind home plate)
  * 214-219 (6 sections)
  * 221-223 (3 sections)
  * 225-227 (3 sections)
  * 234-236 (3 sections)
  * 238-239 (2 sections)
  * 241-247 (7 sections)
- Row range: 1-13 (13 rows all sections)
- Premium features:
  * Wells Fargo Club (sections 214-227, 234-247)
  * Toyota Land Cruiser Club (behind home plate, lower press level)
  * INFINITI Club (behind section 136)
  * Mountain Ranch Bar & Grille (sections 111, 114)
- Estimated capacity: ~6,000 seats

**300-Level / Upper Reserved (Sections 301-347)**
- Total sections: 47 sections (continuous)
- Center sections: 321-342 (22 sections)
- Corner sections: 301-319, 343-347 (25 sections)
- Row range: 1-25 (25 rows all sections)
- Special features:
  * Purple seats in row 20 mark mile-high elevation (5,280 feet)
  * Rows 19+ guaranteed shade
  * Lower Reserved: Front third of each section
  * Upper Reserved: Back two-thirds of each section
- Estimated capacity: ~11,500 seats

**400-Level / Rockpile (Sections 401-403)**
- Total sections: 3 sections (center field bleachers)
- Sections: 401, 402, 403
- Row range: 1-32 (32 rows all sections)
- **Fixed capacity: 2,300 bleacher seats**
- Unique features:
  * 600 feet from home plate (furthest seats in MLB)
  * Bleacher seating (no cup holders or seat backs)
  * Cheapest tickets in MLB ($4 adults, $1 children/seniors)
  * Most tickets sold day-of-game at center field gate
  * Historic "cheap seats" tradition

### Seating Distribution (Total: 50,144)

**Estimated Breakdown:**
- 100-Level (Lower Bowl): ~30,000 seats (59.8%)
- 200-Level (Club): ~6,000 seats (12.0%)
- 300-Level (Upper Reserved): ~11,500 seats (22.9%)
- 400-Level (Rockpile): 2,300 seats (4.6% - FIXED)

### Special Features

**Premium Seating:**
- 63 luxury suites (between 200- and 300-levels)
- 4,526 club seats
- Wells Fargo Club (214-227, 234-247): Upscale dining
- Toyota Land Cruiser Club: Behind home plate
- INFINITI Club: Premium dining behind section 136
- Mountain Ranch Bar & Grille: Sections 111, 114 (right field)

**Unique Architectural Features:**
- **Mile-High Marker**: Purple seats in row 20 of upper deck (5,280 ft elevation)
- **The Rockpile**: Historic center field bleachers (sections 401-403)
- **Highest MLB Stadium**: 5,200 feet above sea level
- **Center Field Features**: Waterfalls, fountains, pine trees behind The Rockpile
- **Humidor Room**: Stores baseballs to counteract thin, dry air effects

**Stadium Features:**
- Surface: Kentucky Bluegrass/Perennial Ryegrass (natural grass)
- Opened: April 26, 1995
- Location: Lower Downtown (LoDo) neighborhood, Denver
- Address: 2001 Blake Street, Denver, CO 80205
- Record attendance: 51,267 (1998 MLB All-Star Game)

### Seating Conventions

**Seat Numbering**:
- Average seats per row varies by level:
  * 100-Level: 18-30 seats per row (varies by location)
  * 200-Level: 15-20 seats per row (club seating)
  * 300-Level: 20-25 seats per row
  * 400-Level: Variable (bleacher seating)

**Row Numbering**:
- 100-Level Center: 5-39 (35 rows)
- 100-Level Ends: 1-39 (39 rows)
- 100-Level Corners: 12-39 (28 rows)
- 200-Level: 1-13 (13 rows all sections)
- 300-Level: 1-25 (25 rows all sections)
- 400-Level: 1-32 (32 rows all sections)

**Section Numbering Pattern**:
- 105-160: 100-Level (Lower Bowl) - 56 sections
- 201-209, 214-247: 200-Level (Club) - ~33 sections (gaps exist)
- 301-347: 300-Level (Upper Reserved) - 47 sections
- 401-403: 400-Level (Rockpile) - 3 sections

**Covered/Shaded Sections**:
- 300-Level rows 19+ guaranteed shade
- 200-Level club areas have indoor/outdoor access
- Most 100-Level sections fully exposed to sun
- Denver's high elevation = intense sun exposure

**Sun-Exposed Sections (afternoon games)**:
- 40° orientation (NE) means:
  - Morning: Eastern sections exposed
  - Afternoon: Southern/southwestern sections most exposed
  - First base side receives more afternoon sun
  - Third base side partially shaded in late innings
- Open roof: All seats exposed to intense high-altitude sun
- Sunglasses and hat recommended for all day games
- Special concern: Thin air at 5,200 ft = stronger UV radiation

---

## Data Sources

### 1. Wikipedia - Coors Field ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Coors_Field
- **Pros**:
  - Complete capacity history:
    * 2018-present: 46,897 (50,144 with standing room)
    * 2012-2017: 50,398 seats
    * 2011: 50,490 seats
    * 2001-2010: 50,445 seats
    * 1999-2000: 50,381 seats
    * 1995-1998: 50,200 seats (opening configuration)
  - Record attendance: 51,267 (1998 MLB All-Star Game)
  - Opened: April 26, 1995
  - Field dimensions and elevation details (5,200 feet)
  - Unique features: The Rockpile, purple mile-high seats
- **Best For**: Capacity verification and stadium history

### 2. TicketIQ - Coors Field Seating Chart ⭐ RECOMMENDED
- **URL**: https://blog.ticketiq.com/blog/coors-field-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Detailed section ranges by level
  - 100-Level: Center 123-138, Ends 116-122/139-144, Corners 105-115/145-160
  - 200-Level: 214-227, 234-247 (Wells Fargo Club)
  - 300-Level: 321-342 (center), 301-319/343-347 (corners)
  - Row ranges specified for each level
  - Premium seating details
- **Best For**: Section organization and row details

### 3. RateYourSeats - Coors Field Rockpile
- **URL**: https://www.rateyourseats.com/coors-field/seating/rockpile
- **Pros**:
  - Rockpile sections 401-403 details
  - 32 rows per section
  - 2,300 total bleacher seats
  - 600 feet from home plate (furthest in MLB)
  - Pricing: $4 adults, $1 children/seniors
- **Best For**: Rockpile-specific information

### 4. MLB.com - Rockies Official Seating Chart
- **URL**: https://www.mlb.com/rockies/ballpark/seating-chart
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

### 5. A View From My Seat
- **URL**: https://aviewfrommyseat.com/venue/Coors+Field/
- **Pros**:
  - Complete section list (105-160, 201-247, 301-347, 401-403)
  - User-submitted photos from each section
  - Section-specific details and views
- **Best For**: Section validation and visual reference

### 6. From This Seat - Coors Field Breakdown
- **URL**: https://www.fromthisseat.com/blog/19908-breakdown-of-the-coors-field-seating-chart
- **Pros**:
  - Detailed breakdown of seating areas
  - Right Field Box: 105-109
  - Pavilion Seats: 151-160
  - Club seat pricing and amenities
- **Best For**: Section-specific details

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 40° (from stadiums.ts - home plate to center field, NE)
- **Latitude**: 39.7559°N
- **Longitude**: -104.9942°W
- **Elevation**: 5,200 feet above sea level (highest in MLB)
- **Timezone**: America/Denver (Mountain Time, UTC-7/UTC-6)
- **Opened**: April 26, 1995
- **Location**: 2001 Blake Street, Denver, CO 80205

### Physical Characteristics
- **Roof**: Open (no retractable roof)
- **Playing Surface**: Natural grass (Kentucky Bluegrass/Perennial Ryegrass)
- **Climate**: Denver (semi-arid, thin air, intense sun, cold winters)
- **Home Team**: Colorado Rockies
- **Type**: MLB stadium, open-air at high elevation

### Dimensions
- LF Line: 347 ft (106 m)
- LF-Center: 390 ft (119 m)
- CF: 415 ft (126 m)
- RF-Center: 375 ft (114 m)
- RF Line: 350 ft (107 m)
- Backstop: 56 ft (17 m)
- Asymmetrical design

### Unique Features
- **Mile-High Marker**: Purple seats in row 20 of upper deck (5,280 ft)
- **The Rockpile**: 2,300-seat center field bleachers (sections 401-403)
- **Furthest Seats**: Rockpile is 600 ft from home plate (furthest in MLB)
- **Humidor**: Ball storage room to counteract thin air effects
- **Center Field**: Waterfalls, fountains, pine trees
- **Elevation Effects**: Thin air causes more home runs ("Coors Effect")

---

## Capacity History

- **Current (2018-present)**: 46,897 seats (50,144 with standing room)
- **2012-2017**: 50,398 seats
- **2011**: 50,490 seats
- **2001-2010**: 50,445 seats
- **1999-2000**: 50,381 seats
- **Opening (1995-1998)**: 50,200 seats
- **stadiums.ts**: 50,144 seats
- **Target for Generation**: 50,144 seats (exact match required)

**Note**: Using 50,144 from stadiums.ts as authoritative capacity. This represents the current configuration with standing room.

---

## Data Collection Strategy

### Approach
Given the capacity (50,144 seats) and four-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Four distinct levels (100, 200, 300, 400)
   - Variable row counts by level and location
   - Fixed Rockpile capacity (2,300 seats)
   - Validate against total capacity

2. **Section Grouping**
   - 100-Level (105-160): 56 sections → ~30,000 seats (536 avg/section)
   - 200-Level (201-247 with gaps): ~33 sections → ~6,000 seats (182 avg/section)
   - 300-Level (301-347): 47 sections → ~11,500 seats (245 avg/section)
   - 400-Level (401-403): 3 sections → 2,300 seats (767 avg/section - FIXED)
   - **Total**: ~139 sections

3. **Known Section Ranges**
   - 100-Level: 105-160 (continuous)
   - 200-Level: 201-209, 214-247 (with gaps)
   - 300-Level: 301-347 (continuous)
   - 400-Level: 401-403 (continuous)

### Validation Targets
- ✅ Total capacity: 50,144 seats (exact match required)
- ✅ Four distinct levels
- ✅ Rockpile fixed at 2,300 seats (sections 401-403)
- ✅ Variable row counts (28-39 rows for 100-Level)
- ✅ ~139 sections total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- 40° orientation (NE)
- Open roof, natural grass
- Four-level structure with unique Rockpile
- Highest elevation in MLB (5,200 feet)
- Opened 1995 (modern era)
- Asymmetrical field dimensions

**Seating Pattern**:
- Four clear levels with varying characteristics
- 100-Level has variable row counts (28-39 rows)
- 200-Level has gaps in section numbering
- 300-Level continuous, uniform (25 rows all sections)
- 400-Level fixed at 2,300 bleacher seats
- Purple "mile-high" seats in upper deck row 20

**Complexity**:
- Moderate-high complexity
- ~139 sections (large for MLB)
- Variable 100-Level row structure
- 200-Level non-continuous numbering
- Fixed Rockpile capacity constraint
- Well-documented modern stadium

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-75 minutes (estimated)
- Validation: 60-90 minutes (iterative tuning for exact capacity)
- Pre-computation: 7-8 minutes (50,144 seats - 2nd largest remaining)
- **Total**: ~3-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateRockiesSeats.ts`)
3. Generate seat coordinates for ~139 sections
4. Validate total capacity matches 50,144 exactly (±0 seats tolerance)
5. Maintain Rockpile at exactly 2,300 seats
6. Pre-compute sun exposure data for 2026 home games
7. Build and test integration
8. Commit Stadium 26/30 completion (86.7% progress)

---

## References

- Official Rockies Ballpark: https://www.mlb.com/rockies/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Coors_Field
- Opened: April 26, 1995
- Location: 2001 Blake Street, Denver, CO 80205
- Architect: HOK Sport (now Populous)
- Cost: $215 million

---

## Special Considerations

**Sun Exposure Notes**:
- 40° orientation (NE) means:
  - Morning games: sun from east/northeast
  - Afternoon games: sun from south/southwest
  - First base side receives more afternoon sun exposure
  - Third base side partially shaded in late innings
  - Best shade: 300-Level rows 19+, club areas
  - Worst sun: 100-Level first base side, The Rockpile (full exposure)
- Open roof: full sun exposure on clear days
- **High elevation = intense UV**: 5,200 ft means ~25% more UV radiation
- Denver climate: 300+ days of sunshine per year
- Sun precomputation critical for all seating areas

**Elevation Considerations**:
- Highest MLB stadium: 5,200 feet above sea level
- Thin air effects:
  - Stronger UV radiation (25% more than sea level)
  - Lower oxygen levels (affects fans and players)
  - "Coors Effect": More home runs due to less air resistance
  - Dry climate: Balls travel farther
- Humidor used to store baseballs since 2002
- Purple seats mark exact mile-high elevation (5,280 ft)

**Mountain Timezone**:
- America/Denver (Mountain Time)
- Observes Daylight Saving Time (UTC-7 summer, UTC-6 winter)
- Same timezone as ARI (Arizona doesn't observe DST)
- Only stadium in Mountain Time zone

**Validation Priorities**:
- Target exact capacity (50,144 seats)
- Verify Rockpile = exactly 2,300 seats (sections 401-403)
- Verify 4 levels distributed properly
- Account for 200-Level section gaps (not continuous)
- 100-Level variable row counts (28-39 rows)
- Total = exactly 50,144 seats (100.00% match)

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/rockies-obstructions.ts
- May need to create obstruction definitions
- Modern stadium has minimal structural obstructions
- Purple seats may affect sightlines (row 20)
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 50,144 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~139 sections (4 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 26/30 in completion sequence (86.7% after completion)
