# Great American Ball Park (Cincinnati Reds) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 42,319 seats (from stadiums.ts - 2008-2020 configuration)
**Sections**: ~92-100 sections across 5 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Diamond Seats / Scout Level (Sections 1-5, 22-25)**
- Diamond Seats: 1-5 (5 sections, behind home plate)
- Scout Seats: 22-25 (4 sections)
- Row range: Approximately A-H (8-10 rows estimated)
- Premium features:
  * Diamond Club: Most expensive seats, food/drink included, wait service
  * Scout Seats: Wait service available, access to Scouts Alley
  * Private concessions and restrooms
- Dugouts:
  * Reds dugout: Sections 128-131
  * Visitors dugout: Sections 115-118
- Estimated capacity: ~900 seats

**100-Level / Lower Deck (Sections 101-146)**
- Sections: 101-146 (46 sections)
- Row range varies by location:
  * Center sections (119-126): Rows A-I (9 rows)
  * End sections (111-118, 129-135): Rows F-Z, AA-KK (~40 rows)
  * Corner sections (101-110, 136-146): Rows A-Z (~26 rows)
- Special areas:
  * Sun Deck/Moon Deck: Sections 140-146 (right field)
  * Bullpens: Reds near section 101 (center field), Visitors between 139-140
- Estimated capacity: ~20,000 seats

**300-Level / Club (Sections 301-307+)**
- Sections: 301-307 (7+ sections, first base side)
- Row range: A-M (13 rows), some sections have N-O
- Premium features:
  * Fox Sports Ohio Champions Club access
  * Complimentary buffet and non-alcoholic beverages
  * Indoor/outdoor bar areas
  * Private restrooms
  * Wider, more comfortable seats
- Coverage: Overhang provides shade for most rows
- This level also includes luxury suites (exact section numbers vary)
- Estimated capacity: ~3,000 seats

**400-Level / Mezzanine (Sections 410-437)**
- Sections: 410-437 (27+ sections)
- Row range varies by location:
  * Center sections (420-427): Rows A-F (6 rows) - "View Box" seats
  * End sections (410-413, 435-437): Rows A-R (18 rows)
  * Corner sections (414-419, 428-434): Rows A-R (18 rows)
- Created by "The Gap" architectural feature
- First base side called "View Box", third base side called "Mezzanine"
- Same level as club seating
- Estimated capacity: ~7,500 seats

**500-Level / Upper / View Level (Sections 509-537)**
- Sections: 509-537 (29 sections)
- Row range: A-V (22 rows all sections)
- Organization:
  * Center sections: 520-527 (8 sections)
  * Corner sections: 509-519, 528-537 (21 sections)
- Highest seating level
- Largest row: 36 seats (Row R, Section 510)
- Estimated capacity: ~10,919 seats

### Seating Distribution (Total: 42,319)

**Estimated Breakdown:**
- Diamond/Scout (1-5, 22-25): ~900 seats (2.1%)
- 100-Level (101-146): ~20,000 seats (47.3%)
- 300-Level (301-307+): ~3,000 seats (7.1%)
- 400-Level (410-437): ~7,500 seats (17.7%)
- 500-Level (509-537): ~10,919 seats (25.8%)

### Special Features

**Premium Seating:**
- Diamond Seats (1-5): Most expensive, food/drink included, Mercedes-Benz Diamond Club
- Scout Seats (22-25): Wait service, Scouts Alley access
- 300-Level Club (301-307): Fox Sports Ohio Champions Club, buffet, bars
- Luxury suites throughout

**Unique Architectural Feature - "The Gap":**
- 35-foot-wide break in stands between home plate and third base
- Aligned with Sycamore Street
- Bridged by concourse levels on each tier
- Creates sightlines into/out of stadium
- Results in 400-Level Mezzanine/View Box seating

**Stadium Features:**
- Scoreboard: 215 ft wide × 40 ft high (9th-largest in MLB)
- Surface: Kentucky Bluegrass (natural grass)
- Opened: March 31, 2003 (replaced Cinergy Field)
- 850 parking spaces on-site

### Seating Conventions

**Seat Numbering**:
- Average ~18 seats per row
- Smallest row: 2 seats (Row M, Section 109)
- Largest row: 36 seats (Row R, Section 510)
- Seat 1 closest to higher-numbered adjacent section (opposite of typical)

**Row Numbering**:
- Diamond/Scout: A-H (estimated 8-10 rows)
- 100-Level Center: A-I (9 rows)
- 100-Level End: F-Z, AA-KK (~40 rows)
- 100-Level Corner: A-Z (~26 rows)
- 300-Level: A-M (13 rows), some N-O
- 400-Level Center: A-F (6 rows)
- 400-Level End/Corner: A-R (18 rows)
- 500-Level: A-V (22 rows)

**Section Numbering Pattern**:
- 1-5: Diamond Seats (behind home plate)
- 22-25: Scout Seats
- 101-146: 100-Level (Lower Deck)
- 301-307+: 300-Level (Club/Suites)
- 410-437: 400-Level (Mezzanine)
- 509-537: 500-Level (Upper/View)

**Covered Sections**:
- 300-Level: Overhang provides shade/coverage (rows F+ recommended)
- 500-Level: Some partial coverage in back rows
- 400-Level: Limited coverage

**Sun-Exposed Sections (afternoon games)**:
- 105° orientation (ENE) means:
  - Morning: Eastern sections exposed
  - Afternoon: Southern/southwestern sections most exposed
  - First base side receives more afternoon sun
  - Third base side better shaded in afternoon

---

## Data Sources

### 1. Wikipedia - Great American Ball Park ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Great_American_Ball_Park
- **Pros**:
  - Complete capacity history:
    * 2003-2007: 42,271 seats
    * 2008-2020: 42,319 seats (matches stadiums.ts)
    * 2021-present: 43,500 seats
  - Record attendance: 44,599 (2010 NLDS Game 3)
  - Opened: March 31, 2003
  - Field dimensions and architectural details
  - "The Gap" feature explained
- **Best For**: Capacity verification and stadium history

### 2. TicketIQ - Great American Ballpark Seating Chart ⭐ RECOMMENDED
- **URL**: https://blog.ticketiq.com/blog/great-american-ballpark-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Detailed section ranges by level
  - Row counts for each level
  - 100-Level: Center 119-126, End 111-118/129-135, Corner 101-110/136-146
  - 400-Level: Center 420-427, End 410-413/435-437, Corner 414-419/428-434
  - 500-Level: Center 520-527, Corner 509-519/528-537
  - Row ranges specified (100: A-KK, 300: A-M, 400: A-R, 500: A-V)
- **Best For**: Section organization and row details

### 3. MLB.com - Great American Ball Park Guide
- **URL**: https://www.mlb.com/news/featured/great-american-ball-park-guide-capacity-seating-chart-parking-and-more
- **Status**: Official source
- **Best For**: Official Reds information

### 4. A View From My Seat
- **URL**: https://aviewfrommyseat.com/venue/Great+American+Ball+Park/sections/
- **Pros**:
  - Complete section list
  - User-submitted photos from each section
  - Section-specific details
- **Best For**: Visual reference and section validation

### 5. RateYourSeats.com
- **URL**: https://www.rateyourseats.com/great-american-ball-park/seating/seating-chart
- **Pros**:
  - User reviews and ratings
  - Shade/coverage information
  - Section-specific feedback
- **Best For**: User experience and shade details

### 6. Ballparks of Baseball
- **URL**: https://www.ballparksofbaseball.com/ballparks/great-american-ball-park/
- **Pros**:
  - Historical context
  - Capacity evolution
  - Stadium features
- **Best For**: Historical information

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 105° (from stadiums.ts - home plate to center field, ENE)
- **Latitude**: 39.0979°N
- **Longitude**: -84.5080°W
- **Timezone**: America/Chicago (Central Time, UTC-6/UTC-5)
  * Note: Cincinnati is in Eastern Time zone, stadiums.ts may have error
- **Opened**: March 31, 2003
- **Location**: 100 Joe Nuxhall Way, Cincinnati, OH 45202

### Physical Characteristics
- **Roof**: Open (no retractable roof)
- **Playing Surface**: Natural grass (Kentucky Bluegrass)
- **Climate**: Cincinnati (humid continental, cold winters, hot summers)
- **Home Team**: Cincinnati Reds
- **Type**: MLB stadium, open-air with riverfront location

### Dimensions
- LF Line: 328 ft (100 m)
- LF-Center: 379 ft (116 m)
- CF: 404 ft (123 m)
- RF-Center: 370 ft (110 m)
- RF Line: 325 ft (99 m)
- Backstop: 55 ft (17 m)
- Asymmetrical design

### Unique Features
- **"The Gap"**: 35-foot break in stands aligned with Sycamore Street
- **Scoreboard**: 215 ft × 40 ft (9th-largest in MLB)
- **Location**: Riverfront in downtown Cincinnati
- **Replaced**: Cinergy Field (formerly Riverfront Stadium)

---

## Capacity History

- **Opening (2003-2007)**: 42,271 seats
- **Expansion (2008-2020)**: 42,319 seats
- **Current (2021-present)**: 43,500 seats
- **stadiums.ts**: 42,319 seats (2008-2020 configuration)
- **Target for Generation**: 42,319 seats (exact match required)

**Note**: Using 42,319 from stadiums.ts as authoritative capacity. This represents the 2008-2020 configuration.

---

## Data Collection Strategy

### Approach
Given the capacity (42,319 seats) and five-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Five distinct levels (Diamond/Scout, 100, 300, 400, 500)
   - Well-documented section organization
   - Validate against total capacity

2. **Section Grouping**
   - Diamond/Scout (1-5, 22-25): ~9 sections → ~900 seats (100 avg/section)
   - 100-Level (101-146): 46 sections → ~20,000 seats (435 avg/section)
   - 300-Level (301-307+): ~10 sections → ~3,000 seats (300 avg/section)
   - 400-Level (410-437): ~27 sections → ~7,500 seats (278 avg/section)
   - 500-Level (509-537): 29 sections → ~10,919 seats (377 avg/section)
   - **Total**: ~121 sections (accounting for some gaps/suites)

3. **Known Section Ranges**
   - Diamond/Scout: 1-5, 22-25
   - 100-Level: 101-146
   - 300-Level: 301-307 (+ suites)
   - 400-Level: 410-437
   - 500-Level: 509-537

### Validation Targets
- ✅ Total capacity: 42,319 seats (exact match required)
- ✅ Five distinct levels
- ✅ Average ~18 seats per row
- ✅ Largest row: 36 seats (Section 510, Row R)
- ✅ ~92-100 sections total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- 105° orientation (ENE)
- Open roof, natural grass
- Riverfront downtown location
- "The Gap" - unique 35-foot break in stands
- Five-level structure
- Opened 2003 (modern era)

**Seating Pattern**:
- Five clear levels with distinct characteristics
- Variable row counts (9-40 rows depending on level/location)
- 100-Level uses double-letter rows (AA-KK) for end sections
- 500-Level uniform (22 rows all sections)
- Average 18 seats per row (range: 2-36)

**Complexity**:
- Moderate complexity
- ~92-100 sections (mid-size for MLB)
- Five levels with different row structures
- "The Gap" creates unique 400-Level configuration
- Well-documented modern stadium

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-75 minutes (estimated)
- Validation: 60-75 minutes (iterative tuning for exact capacity)
- Pre-computation: 6-7 minutes (42,319 seats)
- **Total**: ~3-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateRedsSeats.ts`)
3. Generate seat coordinates for ~92-100 sections
4. Validate total capacity matches 42,319 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 25/30 completion (83.3% progress)

---

## References

- Official Reds Ballpark: https://www.mlb.com/reds/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Great_American_Ball_Park
- Opened: March 31, 2003
- Location: 100 Joe Nuxhall Way, Cincinnati, OH 45202
- Architect: HOK Sport (now Populous)
- Cost: $290 million

---

## Special Considerations

**Sun Exposure Notes**:
- 105° orientation (ENE) means:
  - Morning games: sun from east/northeast
  - Afternoon games: sun from south/southwest
  - First base side receives more afternoon sun exposure
  - Third base side better shaded in afternoon
  - Best shade: 300-Level Club (rows F+), 500-Level back rows
  - Worst sun: 100-Level first base side, Sun/Moon Deck (140-146)
- Open roof: full sun exposure on clear days
- Cincinnati climate: Cold winters, hot/humid summers
- Sun precomputation critical for all seating areas

**Open Roof Considerations**:
- April-May: Cool to warm, 50-75°F
- June-August: Hot and humid, 75-90°F, sun exposure critical
- September-October: Mild, 60-75°F
- Rain delays possible (no roof protection)
- Traditional outdoor baseball experience

**Timezone Issue**:
- **Actual**: America/New_York (Eastern Time)
- **stadiums.ts**: America/Chicago (Central Time) - LIKELY ERROR
- Cincinnati is in Eastern Time zone (UTC-5 winter, UTC-4 summer)
- Same timezone as CLE, DET, PIT, WSH, BAL, NYM, NYY, BOS, TOR, ATL, MIA, TB
- Should be corrected in stadiums.ts

**Validation Priorities**:
- Target exact capacity (42,319 seats)
- Verify 5 levels distributed properly
- Average ~18 seats per row across stadium
- Account for "The Gap" unique configuration
- 100-Level should contain ~47% of total capacity
- Total = exactly 42,319 seats (100.00% match)

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/reds-obstructions.ts
- May need to create obstruction definitions
- Modern stadium has minimal obstructions
- "The Gap" may create some sightline quirks
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 42,319 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~92-100 sections
**Generation Method**: Programmatic (recommended)
**Stadium**: 25/30 in completion sequence (83.3% after completion)
