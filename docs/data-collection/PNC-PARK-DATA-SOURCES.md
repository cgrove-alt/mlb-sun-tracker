# PNC Park (Pittsburgh Pirates) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 38,362 seats (from stadiums.ts - 2008-2017 configuration)
**Sections**: ~117 sections across 3 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Lower Level - Premium (Sections 1-32)**
- Sections: 1-32 (32 sections behind home plate)
- Row range: A-M (13 rows typical)
- Premium seating:
  * Lexus Club/Hyundai Club (sections 14-20L)
  * Home Plate Club (6 sections directly behind home plate)
  * Field Club (400 seats)
- Dugout locations:
  * Pirates dugout: Sections 20-23 (3rd base side - unique)
  * Visitors dugout: Sections 10-13 (1st base side)
- Features: Wide padded seats, in-seat service, chef-prepared buffets
- Estimated capacity: ~4,000 seats

**Lower Level - Main Bowl (Sections 101-147)**
- Sections: 101-147 (47 sections)
- Row range varies by location:
  * Center sections (109-124): Rows A-Z, AA-HH (~50 rows)
  * End sections (105-108, 125-129): Rows A-Z, AA-HH (~50 rows)
  * Corner sections (130-138, 142-147): Rows A-Z, AA-HH (~50 rows)
- Special areas:
  * Bleachers: sections 133-138
  * All You Can Eat: sections 146-147
  * Budweiser Bow Tie Bar
  * Miller Lite Skull Bar (near section 147)
- Note: 26,000 seats total on first level
- Estimated capacity: ~22,000 seats

**Club Level (Sections 201-238)**
- Sections: 201-238 (38 sections, includes some gaps)
- Row range: A-K (11 rows)
- Premium areas:
  * Pittsburgh Baseball Club (PBC): sections 207-228
  * Pirates Cove: sections 201-205
  * Club Cambria (3rd base side)
- Bleachers: sections 235-238
- Center sections: 211-221 (11 sections)
- Corner sections: 208-210, 222-225 (7 sections)
- End sections: 201-207, 227-228 (20 sections)
- Features: 69 luxury suites, 2,500 club seats, climate-controlled clubs
- Estimated capacity: ~5,500 seats

**Grandstand Level (Sections 301-338)**
- Sections: 301-338 (38 sections)
- Row range varies by location:
  * Center sections (313-319): Rows D-R (15 rows)
  * End sections (307-312, 320-327): Rows A-Y (22 rows)
  * Corner sections (301-305, 328-333): Rows A-Y (22 rows)
- Coverage: Rows Q+ typically have roof coverage
- Note: Highest seat only 88 feet above playing surface
- Obstructions: Glass stairway landings in some sections (313, 315, etc.)
- Support poles behind home plate in sections 315-317
- Estimated capacity: ~6,800 seats

### Seating Distribution (Total: 38,362)

**Estimated Breakdown:**
- Lower Level Premium (1-32): ~4,000 seats (10.4%)
- Lower Level Main (101-147): ~22,000 seats (57.3%)
- Club Level (201-238): ~5,500 seats (14.3%)
- Grandstand Level (301-338): ~6,862 seats (17.9%)

### Special Features

**Premium Seating:**
- Home Plate Club (400 seats) - most expensive seats
- Lexus Club/Hyundai Club (sections 14-20L)
- Pittsburgh Baseball Club (PBC) - sections 207-228
- Club Cambria (3rd base side)
- Pirates Cove (sections 201-205)
- 69 Luxury Suites (accommodate ~15 people each)
- World Series Suites (accommodate up to 100 people)

**Special Areas:**
- Budweiser Bow Tie Bar (lower level)
- Miller Lite Skull Bar (near section 147)
- Left Field Terrace (standing room)
- All You Can Eat sections (146-147)
- Ballpark Pass (monthly standing room - $29.99)

**Unique Features:**
- Pirates dugout on 3rd base line (opposite of most MLB parks)
- View of Pittsburgh skyline from most seats
- View of Allegheny River (443'4" from home plate)
- Roberto Clemente Wall (21-foot scoreboard in right field)
- Natural grass playing surface
- Closest seats 45 feet from bases
- Average 19 seats per row

### Seating Conventions

**Seat Numbering**:
- Average ~19 seats per row
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (toward lower-numbered adjacent section)
- Lowest number of seats in a row: 1 (Row GG, Section 101)

**Row Numbering**:
- Premium sections (1-32): Rows A-M (13 rows)
- Lower level (101-147): Rows A-Z, then AA-HH (up to 50 rows)
- Club level (201-238): Rows A-K (11 rows)
- Grandstand center (313-319): Rows D-R (15 rows)
- Grandstand ends/corners: Rows A-Y (22 rows)

**Section Numbering Pattern**:
- 1-32: Premium field level (behind home plate)
- 101-147: Lower level main bowl
- 201-238: Club level
- 301-338: Grandstand level

**Covered Sections**:
- Grandstand level rows Q and higher typically covered
- Club level has climate-controlled areas
- Luxury suites fully enclosed
- Lower level mostly uncovered

**Sun-Exposed Sections (avoid for day games)**:
- 3rd base side and left field: Setting sun exposure
- Lower level 3rd base sections
- Grandstand front rows without overhang
- Note: Field orientation causes setting sun to affect 3rd base/left field

---

## Data Sources

### 1. Wikipedia - PNC Park ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/PNC_Park
- **Pros**:
  - Complete capacity history (2001-present)
  - Current: 38,747 seats (2018-present)
  - Historical: 38,362 seats (2008-2017) - matches stadiums.ts
  - Stadium opened March 31, 2001
  - Record attendance: 40,889 (October 7, 2015)
- **Best For**: Capacity verification and stadium history

### 2. TicketIQ - PNC Park Seating Chart ⭐ RECOMMENDED
- **URL**: https://blog.ticketiq.com/blog/pnc-park-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Detailed section ranges by level
  - Lower Level: 1-32 (premium), 101-147 (main bowl)
  - Club Level: 201-238
  - Grandstand: 301-338
  - Row ranges specified for each area
- **Best For**: Section organization and row details

### 3. MLB.com Pirates Official
- **URL**: https://www.mlb.com/pirates/ballpark/seating-map/3d
- **Status**: Official source (3D interactive map)
- **Best For**: Visual reference and official confirmation

### 4. Ballpark Guides - PNC Park ⭐ RECOMMENDED
- **URL**: https://ballparkeguides.com/pnc-park-seating-guide/
- **Pros**:
  - Comprehensive seating guide
  - Premium seating descriptions
  - Coverage information (rows Q+ covered in grandstand)
  - Sun exposure warnings
  - Obstruction details
- **Best For**: Overall seating layout and special considerations

### 5. RateYourSeats.com
- **URL**: https://www.rateyourseats.com/pnc-park/seating/seating-chart
- **Pros**:
  - User reviews and ratings
  - Section-specific information
  - Coverage and shade details
- **Best For**: Section validation and user feedback

### 6. Ballparks of Baseball - PNC Park
- **URL**: https://www.ballparksofbaseball.com/ballparks/pnc-park/
- **Pros**:
  - Historical information
  - Capacity breakdowns
  - 26,000 seats on first level noted
  - 69 luxury suites documented
- **Best For**: Historical context and capacity distribution

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 25° (from stadiums.ts - home plate to center field, NE)
- **Latitude**: 40.4468°N
- **Longitude**: -80.0057°W
- **Timezone**: America/New_York (Eastern Time, UTC-5/UTC-4)
- **Opened**: March 31, 2001
- **Location**: 115 Federal Street, Pittsburgh, PA 15212

### Physical Characteristics
- **Roof**: Open (no roof)
- **Playing Surface**: Natural grass (Kentucky bluegrass)
- **Climate**: Pittsburgh (humid continental, cold winters, warm summers)
- **Home Team**: Pittsburgh Pirates
- **Type**: MLB stadium, open-air with river views

### Dimensions
- LF Line: 325 ft
- LF-Center: 383 ft
- Deep LF-Center: 410 ft
- CF: 399 ft
- RF-Center: 375 ft
- RF Line: 320 ft
- Backstop: 51 ft
- Allegheny River: 443'4" from home plate

---

## Capacity History

- **Opening (2001-2003)**: 37,898 seats
- **2004-2007**: 38,496 seats
- **2008-2017**: 38,362 seats
- **2018-present**: 38,747 seats (current)
- **stadiums.ts**: 38,362 seats (2008-2017 configuration)
- **Target for Generation**: 38,362 seats (exact match required)

**Note**: Using 38,362 from stadiums.ts as authoritative capacity. This represents the 2008-2017 configuration.

---

## Data Collection Strategy

### Approach
Given the capacity (38,362 seats) and three-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Three distinct levels (Lower Premium & Main, Club, Grandstand)
   - Well-documented section organization
   - Validate against total capacity

2. **Section Grouping**
   - Lower Premium (1-32): ~32 sections → ~4,000 seats (125 avg/section)
   - Lower Main (101-147): ~47 sections → ~22,000 seats (468 avg/section)
   - Club Level (201-238): ~38 sections → ~5,500 seats (145 avg/section)
   - Grandstand (301-338): ~38 sections → ~6,862 seats (181 avg/section)
   - **Total**: ~155 sections (but actual ~117 due to gaps)

3. **Known Section Ranges**
   - Lower Premium: 1-32
   - Lower Main: 101-147
   - Club Level: 201-238
   - Grandstand: 301-338

### Validation Targets
- ✅ Total capacity: 38,362 seats (exact match required)
- ✅ Three distinct levels
- ✅ Lower level contains ~26,000 seats (67.7% of total)
- ✅ Highest seat 88 feet above field
- ✅ ~117 sections total (accounting for numbering gaps)

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- 25° orientation (NE) - favorable for afternoon games
- Open roof, natural grass
- Pittsburgh skyline and Allegheny River views
- Three-level structure with integrated suites
- 2001 construction (retro classic design)
- Pirates dugout on 3rd base line (opposite of most MLB parks)

**Seating Pattern**:
- Two-tier main structure with suites between
- Varying row counts (13-50 rows depending on section)
- Lower level has 26,000 seats (majority of capacity)
- Highest seat only 88 feet above field (intimate setting)
- Average 19 seats per row

**Complexity**:
- Moderate complexity
- Three main levels with clear organization
- Some section number gaps (not all 1-338 exist)
- Obstructions in certain grandstand sections
- Well-documented stadium

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-75 minutes (estimated)
- Validation: 60-75 minutes (iterative tuning for exact capacity)
- Pre-computation: 5-6 minutes (38,362 seats)
- **Total**: ~3-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generatePiratesSeats.ts`)
3. Generate seat coordinates for ~117 sections
4. Validate total capacity matches 38,362 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 22/30 completion (73.3% progress)

---

## References

- Official Pirates Ballpark: https://www.mlb.com/pirates/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/PNC_Park
- Opened: March 31, 2001
- Location: 115 Federal Street, Pittsburgh, PA 15212
- Architect: HOK Sport (now Populous)
- Cost: $216 million

---

## Special Considerations

**Sun Exposure Notes**:
- 25° orientation (NE) means:
  - Morning games: sun from east
  - Afternoon games: sun from south/southwest
  - Setting sun affects 3rd base side and left field
  - Best shade: Grandstand rows Q+ (covered), club level (climate-controlled)
  - Worst sun: Lower level 3rd base side, left field sections
- Open roof: full sun exposure on clear days
- Pittsburgh climate: Cold winters, warm/humid summers
- Sun precomputation critical for all seating areas

**Open Roof Considerations**:
- April-May: Cool to mild, 50-70°F
- June-August: Warm and humid, 75-85°F, sun exposure critical
- September-October: Mild, 60-75°F
- Rain delays possible (no roof protection)
- Traditional outdoor baseball experience

**Eastern Timezone**:
- America/New_York (Eastern Time)
- Observes Daylight Saving Time (UTC-5 winter, UTC-4 summer)
- Same timezone as NYM, NYY, PHI, BAL, WSH, ATL, TB, MIA

**Validation Priorities**:
- Target exact capacity (38,362 seats)
- Verify 3 levels distributed properly
- Lower level should contain ~26,000 seats
- Average ~19 seats per row across stadium
- Total = exactly 38,362 seats (100.00% match)

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/pirates-obstructions.ts
- May need to create obstruction definitions
- Obstructions include glass stairway landings, support poles, overhang shadows
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 38,362 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~117 sections (3 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 22/30 in completion sequence (73.3% after completion)
