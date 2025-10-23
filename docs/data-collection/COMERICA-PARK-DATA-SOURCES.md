# Comerica Park (Detroit Tigers) Seating Data Sources

**Last Updated**: 2025-10-23
**Official Capacity**: 41,083 seats (from stadiums.ts - 2017-present configuration)
**Sections**: ~90-110 sections across 3 main levels + subsections
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**100-Level / Lower Bowl (Sections 101-150 + Subsections)**
- Main sections: 101-150 (50 sections)
- Tiger Den subsections: Many sections have A/B/C suffixes (e.g., 116A, 116B, 116C)
- Row range varies by location:
  * On-Deck Circle (123-132 center): Rows 1-13 (closest to field)
  * Tiger Den subsections (116A-139A type): Rows A-H (8 rows, terrace seating)
  * End sections (116-122, 133-139): Rows 1-35
  * Corner sections (101-114, 140-150): Rows A-Z, AA-GG (~33 rows)
- Dugout locations:
  * Tigers dugout: Third base side (sections 131-135)
  * Visitors dugout: First base side (sections 120-124)
- Special areas:
  * Kaline's Corner: Right field foul line
  * Right Field Balcony: 426 seats with amenities
  * Pavilion: Left field under scoreboard
  * Bleachers: Right field benches
- Estimated capacity: ~24,000-26,000 seats

**200-Level / Mezzanine (Sections 210-219)**
- Located on first base side only (not a full bowl)
- Sections: 210-219 (10 sections) or 211-219 (9 sections)
- Row range: A-G, 1-22 (variable, ~20 rows)
- Among cheapest tickets with good scoreboard visibility
- Estimated capacity: ~2,000-3,000 seats

**300-Level / Upper Bowl (Sections 321-346)**
- Total sections: ~25 sections (section 335 missing from numbering)
- Center sections: 325-331 (7 sections)
- End sections: 322-324, 332-333 (5 sections)
- Corner sections: 334-346 except 335 (12 sections)
- Row range varies by location:
  * Center/Corner sections (325-331, 334-346): Rows A-F, 1-20 (~26 rows)
  * End sections (322-324, 332-333): Rows A-G, 1-22 (~29 rows)
- Premium features:
  * Club Seats: First 3-5 rows between bases (padded, wider)
  * Rows 17+: Covered by small roof overhang
  * Skyline Seats (344-345): Budget-friendly but foul pole obstruction
- Estimated capacity: ~13,000-15,000 seats

### Seating Distribution (Total: 41,083)

**Estimated Breakdown:**
- 100-Level (Lower Bowl): ~24,000-26,000 seats (58-63%)
- 200-Level (Mezzanine): ~2,000-3,000 seats (5-7%)
- 300-Level (Upper Bowl): ~13,000-15,000 seats (32-37%)

### Special Features

**Premium Seating:**
- On-Deck Circle Seats (rows 1-13): Most expensive, includes wait service
- Tiger Den: Wooden chairs with tables, premium terrace seating (rows A-H)
- Club Seats: First 3-5 rows of 300-level between bases
- Terrace Seats: Beyond Tiger Den, protected from elements
- Right Field Balcony: 426 seats with fire pit and bar
- Upper Box Club: Premium upper level seating
- 102 luxury suites
- 3,039 club seats total

**Unique Architectural Features:**
- **Asymmetrical Design**: Deep center field (420 ft)
- **Distinctive Features**: Dirt path from mound to home plate, Ferris wheel in left-center
- **Tiger Statues**: Large tiger sculptures throughout ballpark
- **Fountain**: Center field water feature
- **Open Concourses**: Views of Detroit skyline
- **Left Field Scoreboard**: One of MLB's largest

**Stadium Features:**
- Surface: Kentucky Bluegrass (natural grass)
- Opened: April 11, 2000 (replaced Tiger Stadium)
- Location: Downtown Detroit
- Record attendance: 45,280 (July 26, 2008 vs. Chicago White Sox)

### Seating Conventions

**Seat Numbering**:
- Average seats per row: ~16 seats
- Smallest row: 1 seat (Row 39, Section 108)
- Largest row: 36 seats (Row 22, Section AA - concert configuration)
- Tiger Den rows (A-H): 6-12 seats per row (terrace seating)

**Row Numbering**:
- On-Deck Circle: 1-13 (center sections 123-132)
- Tiger Den subsections: A-H (8 rows, terrace/table seating)
- 100-Level End: 1-35 (35 rows)
- 100-Level Corner: A-Z, AA-GG (~33 rows)
- 200-Level: A-G, 1-22 (~20 rows variable)
- 300-Level Center/Corner: A-F, 1-20 (~26 rows)
- 300-Level End: A-G, 1-22 (~29 rows)

**Section Numbering Pattern**:
- 101-150: 100-Level (Lower Bowl) - 50 main sections
- Subsections: 116A-139A, 116B-139B, 116C (Tiger Den terrace seating)
- 210-219: 200-Level (Mezzanine, first base side only) - ~10 sections
- 321-346: 300-Level (Upper Bowl) - ~25 sections (missing 335)
- AA-KK: Concert floor sections (not regular baseball seating)
- PIT: Standing Room Only

**Covered/Shaded Sections**:
- 300-Level rows 17+: Small roof overhang provides some coverage
- Tiger Den: Shaded seating row D and above
- Most 100-Level and 200-Level: Fully exposed to sun

**Sun-Exposed Sections (afternoon games)**:
- 145° orientation (SE) means:
  - Morning: Eastern sections exposed
  - Afternoon: Southern/western sections most exposed
  - First base side receives significant afternoon sun
  - Third base side better shaded in late afternoon
- Open roof: All seats exposed to elements
- Best shade: 300-Level rows 17+, Tiger Den rows D+
- Worst sun: 100-Level first base side, bleachers, right field areas

---

## Data Sources

### 1. Wikipedia - Comerica Park ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Comerica_Park
- **Pros**:
  - Complete capacity history:
    * 2017-present: 41,083 seats (matches stadiums.ts)
    * 2016: 41,299 seats
    * 2015: 41,574 seats
    * 2014: 41,681 seats
    * 2009-2013: 41,255 seats
    * 2008: 41,000 seats
    * 2003-2007: 41,070 seats
    * 2000-2002: 40,120 seats
  - Record attendance: 45,280 (July 26, 2008)
  - Opened: April 11, 2000
  - Field dimensions and architectural details
  - Special features (fountains, statues, Ferris wheel)
- **Best For**: Capacity verification and stadium history

### 2. TicketIQ - Comerica Park Seating Chart ⭐ RECOMMENDED
- **URL**: https://blog.ticketiq.com/blog/comerica-park-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Detailed section ranges by level
  - 100-Level: Center 123-132, End 116-122/133-139, Corner 101-114/140-150
  - 200-Level: Corner 211-219
  - 300-Level: Center 325-331, End 322-324/332-333, Corner 334-345
  - Row ranges specified for each area
  - Premium seating details (Tiger Den, Club Seats)
- **Best For**: Section organization and row details

### 3. Web Search - Complete Section List
- **Sources**: Multiple seating chart platforms
- **Pros**:
  - Complete section list including all subsections
  - 100-level subsections: 116A-C, 117A-C, 118, 119, 120A, 121A, 122A-B, etc.
  - Confirms 3-level structure
  - Total capacity: 45,447 (includes standing room and concert config)
- **Best For**: Complete section enumeration

### 4. Ballpark Guides - Comerica Park Seating
- **URL**: https://ballparkeguides.com/comerica-park-seating/
- **Pros**:
  - Detailed breakdown of seating areas
  - On-Deck Circle (rows 1-13) details
  - Tiger Den and Terrace Seats information
  - Right Field Balcony capacity (426 seats)
  - Coverage information (rows 17+ covered)
- **Best For**: Premium seating and amenities

### 5. MLB.com - Tigers Official Seating Map
- **URL**: https://www.mlb.com/tigers/ballpark/seat-map
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 145° (from stadiums.ts - home plate to center field, SE)
- **Latitude**: 42.3390°N
- **Longitude**: -83.0485°W
- **Timezone**: America/Chicago (Central Time, UTC-6/UTC-5)
  * Note: Detroit is actually in Eastern Time zone, stadiums.ts may have error
- **Opened**: April 11, 2000
- **Location**: 2100 Woodward Avenue, Detroit, MI 48201

### Physical Characteristics
- **Roof**: Open (no retractable roof)
- **Playing Surface**: Natural grass (Kentucky Bluegrass)
- **Climate**: Detroit (humid continental, cold winters, hot summers)
- **Home Team**: Detroit Tigers
- **Type**: MLB stadium, open-air downtown ballpark

### Dimensions
- LF Line: 345 ft (105 m)
- LF-Center: 370 ft (113 m)
- CF: 420 ft (128 m) - deepest in AL
- RF-Center: 365 ft (111 m)
- RF Line: 330 ft (101 m)
- Backstop: 50 ft (15 m)
- Asymmetrical design with deep center field

### Unique Features
- **Tiger Statues**: Large tiger sculptures at main entrance and throughout
- **Fountain**: Center field water feature
- **Ferris wheel**: In left-center field (removed in 2022)
- **Dirt path**: From pitcher's mound to home plate (traditional feature)
- **Kaline's Corner**: Right field section honoring Al Kaline
- **Open Concourses**: Views of downtown Detroit skyline
- **Replaced**: Tiger Stadium (1912-1999)

---

## Capacity History

- **Current (2017-present)**: 41,083 seats
- **2016**: 41,299 seats
- **2015**: 41,574 seats
- **2014**: 41,681 seats
- **2009-2013**: 41,255 seats
- **2008**: 41,000 seats
- **2003-2007**: 41,070 seats
- **Opening (2000-2002)**: 40,120 seats
- **stadiums.ts**: 41,083 seats
- **Target for Generation**: 41,083 seats (exact match required)

**Note**: Using 41,083 from stadiums.ts as authoritative capacity. This represents the 2017-present configuration.

---

## Data Collection Strategy

### Approach
Given the capacity (41,083 seats) and three-level structure with subsections:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Three distinct levels (100, 200, 300)
   - Handle Tiger Den subsections (A, B, C) separately
   - Variable row counts by level and location
   - Validate against total capacity

2. **Section Grouping**
   - 100-Level (101-150 + subsections): ~60-80 total sections → ~24,000-26,000 seats (400 avg/section)
   - 200-Level (210-219): ~10 sections → ~2,000-3,000 seats (250 avg/section)
   - 300-Level (321-346): ~25 sections → ~13,000-15,000 seats (550 avg/section)
   - **Total**: ~95-115 sections (including subsections)

3. **Known Section Ranges**
   - 100-Level main: 101-150 (50 sections)
   - 100-Level subsections: 116A-139A, 116B-139B, 116C, etc. (Tiger Den areas)
   - 200-Level: 210-219 (first base side only)
   - 300-Level: 321-346 (skip 335)

### Validation Targets
- ✅ Total capacity: 41,083 seats (exact match required)
- ✅ Three distinct levels
- ✅ Average ~16 seats per row
- ✅ Subsections for Tiger Den areas (A, B, C)
- ✅ ~90-110 total sections (including subsections)

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- 145° orientation (SE)
- Open roof, natural grass
- Three-level structure with subsections
- Asymmetrical field (deep center at 420 ft)
- Opened 2000 (modern era)
- First base side mezzanine only (200-level not full bowl)

**Seating Pattern**:
- Three clear levels with distinct characteristics
- Subsections (A, B, C) for Tiger Den terrace seating
- 200-Level only on first base side (unique)
- Variable row counts (8-35 rows depending on level/location)
- Average 16 seats per row (range: 1-36)
- Section 335 missing from 300-level numbering

**Complexity**:
- Moderate-high complexity
- ~90-110 sections (including subsections)
- Tiger Den subsections add complexity (A, B, C suffixes)
- Three levels with different row structures
- Non-continuous section numbering (gaps exist)
- Well-documented modern stadium

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-90 minutes (estimated - subsections add complexity)
- Validation: 60-90 minutes (iterative tuning for exact capacity)
- Pre-computation: 6-7 minutes (41,083 seats)
- **Total**: ~3-4 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateTigersSeats.ts`)
3. Generate seat coordinates for ~90-110 sections (including subsections)
4. Validate total capacity matches 41,083 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 28/30 completion (93.3% progress)

---

## References

- Official Tigers Ballpark: https://www.mlb.com/tigers/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Comerica_Park
- Opened: April 11, 2000
- Location: 2100 Woodward Avenue, Detroit, MI 48201
- Architect: HOK Sport (now Populous)
- Cost: $300 million

---

## Special Considerations

**Sun Exposure Notes**:
- 145° orientation (SE) means:
  - Morning games: sun from east/southeast
  - Afternoon games: sun from south/southwest
  - First base side receives significant afternoon sun exposure
  - Third base side better shaded in late afternoon
  - Best shade: 300-Level rows 17+, Tiger Den rows D+
  - Worst sun: 100-Level first base side, bleachers, right field
- Open roof: full sun exposure on clear days
- Detroit climate: Cold winters, hot/humid summers
- Sun precomputation critical for all seating areas

**Open Roof Considerations**:
- April: Cool, 40-60°F
- May-June: Mild to warm, 60-80°F
- July-August: Hot and humid, 75-90°F, sun exposure critical
- September: Mild, 60-75°F
- Rain delays possible (no roof protection)
- Traditional outdoor baseball experience

**Timezone Issue**:
- **Actual**: America/New_York (Eastern Time)
- **stadiums.ts**: America/Chicago (Central Time) - LIKELY ERROR
- Detroit is in Eastern Time zone (UTC-5 winter, UTC-4 summer)
- Same timezone as CLE, CIN, PIT, WSH, BAL, NYM, NYY, BOS, TOR, ATL, MIA, TB
- Should be corrected in stadiums.ts

**Validation Priorities**:
- Target exact capacity (41,083 seats)
- Verify 3 levels distributed properly
- Handle Tiger Den subsections (A, B, C) correctly
- Account for 200-Level being first base side only
- Average ~16 seats per row across stadium
- 100-Level should contain ~58-63% of total capacity
- Total = exactly 41,083 seats (100.00% match)

**Subsection Strategy**:
- Tiger Den subsections (A, B, C) are terrace/table seating
- Typically 8 rows (A-H) with 6-12 seats per row
- Sections 116-139 have various subsection combinations
- May need to generate main section + subsections separately
- Validate subsection counts contribute to exact total

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/tigers-obstructions.ts
- May need to create obstruction definitions
- Modern stadium has minimal structural obstructions
- Skyline Seats (344-345) have foul pole obstruction
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 41,083 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~90-110 sections (3 levels + subsections)
**Generation Method**: Programmatic (recommended)
**Stadium**: 28/30 in completion sequence (93.3% after completion)
