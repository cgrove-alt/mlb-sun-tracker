# Kauffman Stadium (Kansas City Royals) Seating Data Sources

**Last Updated**: 2025-10-23
**Official Capacity**: 37,903 seats (from stadiums.ts - 2012-present configuration)
**Sections**: ~142 sections across 5 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Premium/Diamond Level (Sections 1-6, A-F)**
- BATS Club: Sections 1-6 (6 sections, behind home plate)
- Diamond Club Seats: Sections A-F (6 sections)
- Row range: Approximately 2-4 rows (estimated)
- Premium features:
  * Most exclusive seating with wait service
  * Indoor club access with premium dining
  * Private restrooms and lounges
  * Closest to field level
- Dugouts:
  * Royals dugout: Sections 132-136
  * Visitors dugout: Sections 119-123
- Estimated capacity: ~700 seats

**100-Level / Field Level (Sections 101-152)**
- Total sections: 39 sections (approximate with gaps)
- Center sections: 121-133 (13 sections behind home plate)
- End sections: 115-120, 134-140 (13 sections down baselines)
- Corner sections: 101-107, 148-152 (13 sections in outfield)
- Row range varies by location:
  * Center sections (121-133): Rows A-U (21 rows)
  * End sections (115-120, 134-140): Rows A-X (24 rows)
  * Corner sections (101-107, 148-152): Rows A-X (24 rows)
- Special areas:
  * Royals bullpen: Sections 150-152 (right field)
  * Visitors bullpen: Sections 104-106 (left field)
- Estimated capacity: ~18,000 seats

**200-Level / Plaza Level (Sections 201-252)**
- Total sections: ~36 sections (some gaps/SRO)
- Center sections: 221-225, 230-234 (10 sections)
- End sections: 201-208, 241-252 (20 sections)
- Corner sections: 209-214 (6 sections)
- Row range: AA-TT (20 rows all sections)
- Special features:
  * Fountain Seats: Sections 201-203 (overlook left-center field)
  * Standing Room Only: Sections 206-208, 247-249
  * Outfield Plaza seating with hybrid lower-level experience
- Estimated capacity: ~11,000 seats

**300-Level / Loge Level (Sections 301-325)**
- Total sections: 24 sections (approximate)
- Center sections: 304-308, 312-315 (9 sections)
- End sections: 309-311, 316-320 (8 sections)
- Corner sections: 301-302, 321-325 (7 sections)
- Row range: A-J (10 rows all sections)
- Premium features:
  * Smaller sections with less foot traffic
  * Elevated views of entire field
  * Some overhang coverage
- Estimated capacity: ~4,500 seats

**400-Level / View Level (Sections 401-439)**
- Total sections: 37 sections (approximate)
- Center sections: 415-425 (11 sections behind home plate)
- Corner sections: 401-413, 427-439 (26 sections)
- Row range: A-V, then AA-ZZ (46 rows)
- Special features:
  * View Box: Front sections with smaller size
  * View Reserved: Middle sections
  * View Outfield: Corner sections
  * Brew and View: Includes complimentary beer
  * Most economical seating options
- Estimated capacity: ~3,700 seats

### Seating Distribution (Total: 37,903)

**Estimated Breakdown:**
- Premium/Diamond (1-6, A-F): ~700 seats (1.8%)
- 100-Level (101-152): ~18,000 seats (47.5%)
- 200-Level (201-252): ~11,000 seats (29.0%)
- 300-Level (301-325): ~4,500 seats (11.9%)
- 400-Level (401-439): ~3,700 seats (9.8%)

### Special Features

**Premium Seating:**
- BATS Club (1-6): Most exclusive behind home plate
- Diamond Club (A-F): Premium field-level seating
- Crown Club: Premium seats added 1999
- Dugout Box: Close-up experience with shade coverage
- Lexus Complete Seats: All-inclusive food and drinks
- 18 Triple-Crown luxury suites
- Craft and Draft: Social atmosphere with enhanced food

**Unique Features:**
- **Water Spectacular**: 322-foot-wide fountain display behind right field
- **Steep Upper Deck**: Characteristic late-1970s stadium design
- **Natural Grass**: Traditional playing surface
- **Opened**: April 10, 1973 (one of MLB's classic stadiums)
- **Major Renovation**: 2007-2009 ($250 million) - reduced capacity by ~2,900 seats
- **Symmetrical Design**: Traditional ballpark dimensions

**Stadium Features:**
- Surface: Natural grass (Kentucky Bluegrass)
- Location: Eastern Kansas City, Missouri (Truman Sports Complex)
- Shares parking with Arrowhead Stadium (Chiefs)
- Record attendance: 42,633 (1980 ALCS Game 2)

### Seating Conventions

**Seat Numbering**:
- Average seats per row varies by level:
  * Premium: 8-12 seats per row (intimate setting)
  * 100-Level: 18-24 seats per row (varies by location)
  * 200-Level: 18-22 seats per row
  * 300-Level: 14-18 seats per row (smaller sections)
  * 400-Level: 18-24 seats per row

**Row Numbering**:
- Premium (1-6, A-F): 2-4 rows (estimated)
- 100-Level Center: A-U (21 rows)
- 100-Level End/Corner: A-X (24 rows)
- 200-Level: AA-TT (20 rows all sections)
- 300-Level: A-J (10 rows all sections)
- 400-Level: A-V (22 rows), then AA-ZZ (26 rows) = 48 rows total

**Section Numbering Pattern**:
- 1-6: BATS Club (premium behind home plate)
- A-F: Diamond Club (premium field level)
- 101-152: 100-Level (Field Level) - 39 sections
- 201-252: 200-Level (Plaza Level) - ~36 sections
- 301-325: 300-Level (Loge Level) - 24 sections
- 401-439: 400-Level (View Level) - 37 sections

**Covered/Shaded Sections**:
- 300-Level: Some overhang protection
- 400-Level: Back rows partially covered
- Most 100-Level and 200-Level: Fully exposed to sun
- 58° orientation (ENE) affects sun exposure patterns

**Sun-Exposed Sections (afternoon games)**:
- 58° orientation (ENE) means:
  - Morning: Eastern sections exposed
  - Afternoon: Southern/southwestern sections most exposed
  - First base side receives more afternoon sun
  - Third base side partially shaded in late innings
- Open roof: All seats exposed to elements
- Best shade: 300-Level with overhang, 400-Level back rows
- Worst sun: 100-Level first base side, 200-Level first base side

---

## Data Sources

### 1. Wikipedia - Kauffman Stadium ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Kauffman_Stadium
- **Pros**:
  - Complete capacity history:
    * 2012-present: 37,903 seats
    * 2010-2011: 37,840 seats
    * 2005-2009: 40,785 seats
    * 2003-2004: 40,793 seats
    * 1973-2002: 40,625 seats
  - Record attendance: 42,633 (1980 ALCS Game 2)
  - Opened: April 10, 1973
  - Major renovation details (2007-2009, $250M)
  - Field dimensions and architectural features
- **Best For**: Capacity verification and stadium history

### 2. TicketIQ - Kauffman Stadium Seating Chart ⭐ RECOMMENDED
- **URL**: https://blog.ticketiq.com/blog/kauffman-stadium-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Detailed section ranges by level
  - 100-Level: Center 121-133, End 115-120/134-140, Corner 101-107/148-152
  - 200-Level: Center 221-225/230-234, End 201-208/241-252, Corner 209-214
  - 300-Level: Center 304-308/312-315, End 309-311/316-320, Corner 301-302/321-325
  - 400-Level: Center 415-425, Corner 401-413/427-439
  - Row ranges specified for each level
  - Premium seating details
- **Best For**: Section organization and row details

### 3. Web Search - Kauffman Stadium Sections
- **Sources**: Multiple fan sites and ticketing platforms
- **Pros**:
  - Premium sections: 1-6 (BATS Club), A-F (Diamond Club)
  - Fountain Seats: 201-203
  - Standing Room Only: 206-208, 247-249
  - Dugout and bullpen locations
- **Best For**: Premium seating and special areas

### 4. Royals Reporter - Seating Rankings
- **URL**: https://royalsreporter.com/2025/03/19/the-royals-fan-guide-kauffman-stadium-seating-rankings/
- **Pros**:
  - Top 10 seating recommendations with pricing
  - View Box, View Reserved, View Outfield details
  - Dugout Box, Fountain Seats information
  - Shade coverage notes for day games
- **Best For**: User experience and seating recommendations

### 5. MLB.com - Royals Ballpark
- **URL**: https://www.mlb.com/royals/ballpark
- **Status**: Official source
- **Best For**: Official Royals information and seating map

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 58° (from stadiums.ts - home plate to center field, ENE)
- **Latitude**: 39.0517°N
- **Longitude**: -94.4803°W
- **Timezone**: America/Chicago (Central Time, UTC-6/UTC-5)
- **Opened**: April 10, 1973
- **Location**: 1 Royal Way, Kansas City, MO 64129
- **Complex**: Truman Sports Complex (shares with Arrowhead Stadium)

### Physical Characteristics
- **Roof**: Open (no retractable roof)
- **Playing Surface**: Natural grass (Kentucky Bluegrass)
- **Climate**: Kansas City (humid continental, cold winters, hot summers)
- **Home Team**: Kansas City Royals
- **Type**: MLB stadium, open-air with traditional design

### Dimensions
- LF Line: 330 ft (101 m)
- LF-Center: 387 ft (118 m)
- CF: 410 ft (125 m)
- RF-Center: 387 ft (118 m)
- RF Line: 330 ft (101 m)
- Backstop: 60 ft (18 m)
- Symmetrical design (classic ballpark)

### Unique Features
- **Water Spectacular**: 322-foot fountain display behind right field
- **Steep Upper Deck**: Classic 1970s stadium architecture
- **Crown Vision Board**: Large HD video board
- **Renovation 2007-2009**: $250 million upgrade
- **Truman Sports Complex**: Shared with Arrowhead Stadium
- **Original Name**: Royals Stadium (1973-1993)
- **Renamed**: Ewing M. Kauffman Stadium (1993-present)

---

## Capacity History

- **Current (2012-present)**: 37,903 seats
- **2010-2011**: 37,840 seats
- **2005-2009**: 40,785 seats
- **2003-2004**: 40,793 seats
- **Opening (1973-2002)**: 40,625 seats
- **stadiums.ts**: 37,903 seats
- **Target for Generation**: 37,903 seats (exact match required)

**Note**: Using 37,903 from stadiums.ts as authoritative capacity. This represents the post-renovation configuration (2012-present).

---

## Data Collection Strategy

### Approach
Given the capacity (37,903 seats) and five-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Five distinct levels (Premium, 100, 200, 300, 400)
   - Variable row counts by level
   - Validate against total capacity

2. **Section Grouping**
   - Premium (1-6, A-F): 12 sections → ~700 seats (58 avg/section)
   - 100-Level (101-152): ~39 sections → ~18,000 seats (462 avg/section)
   - 200-Level (201-252): ~36 sections → ~11,000 seats (306 avg/section)
   - 300-Level (301-325): 24 sections → ~4,500 seats (188 avg/section)
   - 400-Level (401-439): 37 sections → ~3,700 seats (100 avg/section)
   - **Total**: ~148 sections (some are SRO or special areas)

3. **Known Section Ranges**
   - Premium: 1-6, A-F
   - 100-Level: 101-152 (with some gaps)
   - 200-Level: 201-252 (with SRO and gaps)
   - 300-Level: 301-325
   - 400-Level: 401-439

### Validation Targets
- ✅ Total capacity: 37,903 seats (exact match required)
- ✅ Five distinct levels
- ✅ Variable row counts (2-48 rows by level)
- ✅ ~142-148 sections total
- ✅ Premium sections behind home plate

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- 58° orientation (ENE)
- Open roof, natural grass
- Classic 1970s stadium design
- Symmetrical field dimensions (traditional)
- Opened 1973 (pre-modern era)
- Five-level structure with premium areas

**Seating Pattern**:
- Five clear levels with distinct characteristics
- Premium level separate from main bowl
- 200-Level uses double-letter rows (AA-TT)
- 400-Level has extended rows (A-V, AA-ZZ = 48 total)
- Variable row counts across levels (2-48 rows)
- Steep upper deck design

**Complexity**:
- Moderate complexity
- ~142-148 sections (mid-size for MLB)
- Five levels with different row structures
- Some non-continuous section numbering
- Standing room only sections to account for
- Well-documented classic stadium

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-75 minutes (estimated)
- Validation: 60-75 minutes (iterative tuning for exact capacity)
- Pre-computation: 5-6 minutes (37,903 seats)
- **Total**: ~3-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateRoyalsSeats.ts`)
3. Generate seat coordinates for ~142 sections
4. Validate total capacity matches 37,903 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 27/30 completion (90.0% progress)

---

## References

- Official Royals Ballpark: https://www.mlb.com/royals/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Kauffman_Stadium
- Opened: April 10, 1973
- Location: 1 Royal Way, Kansas City, MO 64129
- Architect: Kivett and Myers
- Renovation: HNTB Corporation (2007-2009)
- Cost: $70 million (original), $250 million (renovation)

---

## Special Considerations

**Sun Exposure Notes**:
- 58° orientation (ENE) means:
  - Morning games: sun from east/northeast
  - Afternoon games: sun from south/southwest
  - First base side receives more afternoon sun exposure
  - Third base side better shaded in afternoon
  - Best shade: 300-Level with overhang, 400-Level back rows
  - Worst sun: 100-Level first base side, 200-Level outfield
- Open roof: full sun exposure on clear days
- Kansas City climate: Cold winters, hot/humid summers
- Sun precomputation critical for all seating areas

**Open Roof Considerations**:
- April-May: Cool to mild, 50-70°F
- June-August: Hot and humid, 75-95°F, sun exposure critical
- September-October: Mild, 60-75°F
- Rain delays possible (no roof protection)
- Traditional outdoor baseball experience

**Central Timezone**:
- America/Chicago (Central Time)
- Observes Daylight Saving Time (UTC-6 winter, UTC-5 summer)
- Same timezone as other Central teams (Cardinals, Brewers, Cubs, White Sox, Twins, Astros)

**Validation Priorities**:
- Target exact capacity (37,903 seats)
- Verify 5 levels distributed properly
- Account for premium sections (1-6, A-F)
- Exclude Standing Room Only sections from seat count
- 100-Level should contain ~47-48% of total capacity
- Total = exactly 37,903 seats (100.00% match)

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/royals-obstructions.ts
- May need to create obstruction definitions
- Classic stadium has some structural obstructions
- Steep upper deck may create overhang issues
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 37,903 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~142 sections (5 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 27/30 in completion sequence (90.0% after completion)
