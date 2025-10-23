# Oriole Park at Camden Yards (Baltimore Orioles) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 45,971 seats (from stadiums.ts - 2011-2021 configuration)
**Sections**: ~140 sections across 4 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Field Level (Lower Bowl)**
- Field Box sections: 4-98 (even numbers only - 48 sections)
- Lower Reserve sections: 1-87 (odd numbers only - 44 sections)
- Row range: Typically 24-29 rows for field box sections
- Row 1 is always the first row in field box sections
- Special: Eutaw Street sections 90-98 (located adjacent to Eutaw Street, not in main stadium)
- Estimated capacity: ~24,000 seats

**Club Level (200s)**
- Sections: 204-288 (wraps around entire stadium)
- Row range: 1-13 rows (most sections have rows 1-9)
- Corner sections: 242-270, 216-230
- End sections: 272-288, 214-204
- Premium features: 4,631 club seats total
- Luxury suites: 72 suites integrated into this level
- Club concourse with exclusive food, waiter service
- Estimated capacity: ~10,000 seats

**Terrace Level**
- Sections: 31-43 (adjacent to field sections)
- Coverage: All covered except sections 1-7
- Integrated with field level structure
- Estimated capacity: ~4,000 seats

**Upper Level (300s)**
- Center sections: 322-346 (rows vary: 1-5, 9-25)
- Corner sections: 348-364, 316-330 (rows 1-25)
- End sections: 388-374, 306-322 (rows 1-25)
- Estimated capacity: ~7,500 seats

### Seating Distribution (Total: 45,971)

**Estimated Breakdown:**
- Field Level: ~24,000 seats (52.2%)
- Club Level: ~10,000 seats (21.7%)
- Terrace Level: ~4,000 seats (8.7%)
- Upper Level: ~7,971 seats (17.3%)

### Special Features

**Eutaw Street Palace:**
- Sections 90-98 located adjacent to Eutaw Street (not in main stadium)
- Unique viewing experience with historic warehouse backdrop
- Commemorative plaques mark home run landing spots

**Protective Netting:**
- Extends from Section 6 through Section 70
- Enhanced fan safety around home plate area

**Standing Room Areas:**
- Left field bullpen standing room
- Above scoreboard in right field

**Premium Seating:**
- 4,631 club seats throughout 200-level
- 72 luxury suites
- Miller Light Flight Deck (casual party suites)
- All-Star Cafe in club level

**Historic Orange Seats:**
- All seats green except orange seats marking historic home run locations
- Notable: Cal Ripken Jr. 278th home run seat

### Seating Conventions

**Seat Numbering**:
- Average seats per row: ~18 seats
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (toward lower-numbered adjacent section)

**Row Numbering**:
- Field Box: Row 1-29 (varies by section)
- Club Level: Rows 1-13 (most sections 1-9)
- Terrace: Varies by section
- Upper Level: Rows 1-25 (center sections 1-5, 9-25)

**Section Numbering Pattern**:
- Even numbers (4, 6, 8...98): Field Box sections
- Odd numbers (1, 3, 5...87): Lower Reserve sections
- 200s: Club Level (204-288)
- 300s: Upper Level (306-388)

**Covered Sections**:
- All Terrace Level covered (except sections 1-7)
- Upper deck provides overhang coverage for field level back rows
- Club Level fully enclosed and climate controlled

**Sun-Exposed Sections (avoid for day games)**:
- Field Level 1st base side: Sections 50-70 (full sun exposure)
- Upper Level exposed sections without overhang
- Left field sections: Full sun exposure in afternoon

---

## Data Sources

### 1. Wikipedia - Oriole Park at Camden Yards ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Oriole_Park_at_Camden_Yards
- **Pros**:
  - Complete capacity history (1992-present)
  - Current: 44,487 seats (2022-present)
  - Historical: 45,971 seats (2011-2021) - matches stadiums.ts
  - Premium seating details: 4,631 club seats, 72 suites
  - 2022 renovations documented (removed ~1,100 seats in sections 72-86)
- **Best For**: Capacity verification and stadium history

### 2. TicketIQ - Camden Yards Seating Chart ⭐ RECOMMENDED
- **URL**: https://blog.ticketiq.com/blog/camden-yards-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Detailed section ranges by level
  - Row ranges for each section type
  - Field Level: sections 4-98 (field box), 1-87 (lower reserve)
  - Club Level: sections 204-288, rows 1-13
  - Upper Level: sections 306-388
- **Best For**: Section organization and row details

### 3. MLB.com Orioles Official
- **URL**: https://www.mlb.com/orioles/ballpark/seating-map
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

### 4. TickPick Baltimore Orioles Seating
- **URL**: https://www.tickpick.com/blog/baltimore-orioles-seating-chart-with-seat-views/
- **Pros**:
  - Field box sections: 24-29 rows typically
  - Average seats per row: ~18
  - Dugout locations: Orioles (22-26), Visitors (48-52)
- **Best For**: Row counts and seating details

### 5. Ballpark Guides - Camden Yards
- **URL**: https://ballparkeguides.com/camden-yards-seating-tips/
- **Pros**:
  - Seating tips and recommendations
  - Coverage information (terrace all covered except 1-7)
  - Standing room details
- **Best For**: Coverage and special seating features

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 58° (from stadiums.ts - home plate to center field, NE orientation)
- **Latitude**: 39.2838°N
- **Longitude**: -76.6218°W
- **Timezone**: America/New_York (Eastern Time, UTC-5/UTC-4)
- **Opened**: April 6, 1992
- **Location**: 333 West Camden Street, Baltimore, MD 21201

### Physical Characteristics
- **Roof**: Open (no roof)
- **Playing Surface**: Natural grass (Kentucky bluegrass)
- **Climate**: Baltimore (humid subtropical, hot summers, cold winters)
- **Home Team**: Baltimore Orioles
- **Type**: MLB stadium, retro classic design
- **Architect**: HOK Sport (now Populous)

### Dimensions
- LF Line: 333 ft
- LF-Center: 364 ft
- CF: 410 ft (deepest in AL)
- RF-Center: 373 ft
- RF Line: 318 ft
- Backstop: 57 ft
- Asymmetrical design with deep center field

---

## Capacity History

- **Opening (1992-1996)**: 48,041 seats
- **1997-2000**: 48,079 seats
- **2001-2004**: 48,190 seats
- **2005-2010**: 48,290 seats (peak capacity)
- **2011-2021**: 45,971 seats
- **2022-present**: 44,487 seats (current)
- **stadiums.ts**: 45,971 seats (2011-2021 configuration)
- **Target for Generation**: 45,971 seats (exact match required)

**Note**: Using 45,971 from stadiums.ts as authoritative capacity. The 2022 reduction to 44,487 was due to left field renovations removing ~1,100 seats in sections 72-86.

---

## Data Collection Strategy

### Approach
Given the capacity (45,971 seats) and four-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Four distinct levels (Field, Club, Terrace, Upper)
   - Handle even/odd section numbering pattern
   - Validate against total capacity

2. **Section Grouping**
   - Field Level: ~92 sections → ~24,000 seats (261 avg/section)
   - Club Level: ~40 sections → ~10,000 seats (250 avg/section)
   - Terrace Level: ~13 sections → ~4,000 seats (308 avg/section)
   - Upper Level: ~40 sections → ~7,971 seats (199 avg/section)
   - **Total**: ~185 sections (may be fewer due to numbering gaps)

3. **Known Section Ranges**
   - Field Box: 4-98 (even numbers)
   - Lower Reserve: 1-87 (odd numbers)
   - Club Level: 204-288
   - Upper Level: 306-388

### Validation Targets
- ✅ Total capacity: 45,971 seats (exact match required)
- ✅ Four distinct levels
- ✅ Even/odd section pattern for field level
- ✅ Eutaw Street sections (90-98) included
- ✅ Club seats and suites properly distributed
- ✅ ~140 sections total (accounting for numbering gaps)

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- NE orientation (58°) - retro classic design
- Open roof with natural grass
- Iconic B&O Warehouse backdrop beyond right field
- Eutaw Street running through ballpark complex
- Four-level structure with integrated terrace

**Seating Pattern**:
- Even/odd section numbering (even=field box, odd=lower reserve)
- Varying row counts by level (9-29 rows)
- Deep center field (410 ft) affects upper deck geometry
- Terrace level integrated with field level
- Historic 1992 design (first retro ballpark)

**Complexity**:
- Moderate-high complexity
- Four distinct levels with varying structures
- Even/odd section pattern requires special handling
- Not all section numbers used (gaps in numbering)
- Well-documented classic stadium

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-75 minutes (estimated)
- Validation: 60-75 minutes (iterative tuning for exact capacity)
- Pre-computation: 5-6 minutes (45,971 seats)
- **Total**: ~3-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateOriolesSeats.ts`)
3. Generate seat coordinates for ~140 sections
4. Validate total capacity matches 45,971 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 20/30 completion (66.7% progress)

---

## References

- Official Orioles Ballpark: https://www.mlb.com/orioles/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Oriole_Park_at_Camden_Yards
- Opened: April 6, 1992
- Location: 333 West Camden Street, Baltimore, MD 21201
- Architect: HOK Sport (now Populous)
- Cost: $110 million (1992)

---

## Special Considerations

**Sun Exposure Notes**:
- NE orientation (58°) means:
  - Morning games: sun from east (behind 1st base)
  - Afternoon games: sun from south/southwest (3rd base side exposed)
  - Best shade: Terrace level (all covered except 1-7), upper deck overhangs
  - Worst sun: Field level 1st base side (50-70), left field sections
- Open roof: full sun exposure on clear days
- Baltimore climate: Hot and humid April-September
- Sun precomputation critical for all seating areas

**Open Roof Considerations**:
- April-May: Mild, 60-75°F, pleasant for day games
- June-August: Hot and humid, 80-95°F, sun exposure critical
- September-October: Cooler, 65-80°F, more comfortable
- Rain delays possible (no roof protection)
- Historic ballpark with traditional outdoor experience

**Baltimore Timezone**:
- America/New_York (Eastern Time)
- Observes Daylight Saving Time (UTC-5 winter, UTC-4 summer)
- Same timezone as NYM, NYY, PHI, WSH, ATL, TB, MIA

**Validation Priorities**:
- Target exact capacity (45,971 seats)
- Verify 4 levels distributed properly
- Handle even/odd section numbering correctly
- Include Eutaw Street sections (90-98)
- Account for 2022 renovations (reduced sections 72-86)
- Total = exactly 45,971 seats (100.00% match)

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/orioles-obstructions.ts
- May need to create obstruction definitions
- Obstructions include upper deck overhangs, light towers, B&O Warehouse
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 45,971 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~140 sections (4 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 20/30 in completion sequence (66.7% after completion)
