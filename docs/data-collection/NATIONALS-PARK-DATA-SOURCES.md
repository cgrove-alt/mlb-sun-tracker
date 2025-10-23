# Nationals Park (Washington Nationals) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 41,313 seats (from stadiums.ts configuration)
**Sections**: ~128 sections across 5 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Presidents Club (Premium Field Level)**
- Sections: A-E (5 sections behind home plate)
- Row range: Premium rows (typically A-L or similar)
- Features: Lexus Presidents Club access, all-inclusive gourmet buffet
- VIP amenities: Oval Office Bar, batting cage views
- Note: Rows E-L in sections A and E may be PNC Diamond Club
- Estimated capacity: ~500 seats

**100 Level (Field Level)**
- Sections: 100-143 (44 sections)
- Row range varies by location:
  * Center sections (114-131): D-Z, AA-YY (~50 rows)
  * End sections (109-113, 132-137): A-Z, AA-WW (~49 rows)
  * Corner sections (100-108, 138-143): A-Z, AA-WW (~49 rows)
- PNC Diamond Club: Some rows in sections 119-126 (between dugouts)
- Dugout locations:
  * Nationals dugout: Sections 127-130
  * Visitors dugout: Sections 115-118
- Estimated capacity: ~18,000 seats

**200 Level (Club/Mezzanine Level)**
- Sections: 201-243 (approximately 40-43 sections, not all numbers used)
- Club sections: 206-221 (16 sections with Champions Club access)
- Mezzanine sections: 201-205, 222-243
- Row range: A-P (16 rows across all sections)
- Premium: Delta Sky360 Club (206-221), Champions Club
- Includes 79 luxury suites on three levels around infield
- Estimated capacity: ~10,000 seats

**300 Level (Lower Gallery)**
- Sections: 301-321 (21 sections)
- Distribution:
  * 3rd base side: 306-311 (6 sections)
  * Behind home plate: 312-315 (4 sections)
  * 1st base side: 316-321 (6 sections)
  * Outfield corners: 301-306, 321 (remaining sections)
- Row range: A-P (16 rows)
- Shares concourse with 400 level
- Estimated capacity: ~7,500 seats

**400 Level (Upper Gallery)**
- Sections: 401-409, 416-420 (15 sections total)
- Split by Shirley Povich Media Center
- Sections 410-415: Press box (not ticketed seating)
- Row range: A-N (14 rows)
- Highest seating tier
- Homage to Griffith Stadium split upper deck design
- Estimated capacity: ~5,000 seats

### Seating Distribution (Total: 41,313)

**Estimated Breakdown:**
- Presidents Club (A-E): ~500 seats (1.2%)
- 100 Level: ~18,000 seats (43.6%)
- 200 Level: ~10,000 seats (24.2%)
- 300 Level: ~7,500 seats (18.2%)
- 400 Level: ~5,300 seats (12.8%)

### Special Features

**Premium Clubs:**
- **Lexus Presidents Club** (Sections A-E): Most premium seating behind home plate
- **PNC Diamond Club**: Field level between dugouts, two floors, gourmet buffet
- **Terra Club**: Directly behind home plate, most expensive seats
- **FIS Champions Club**: Two-story indoor lounge (33,000 sq ft), sections 206-221
- **Delta Sky360 Club**: Sections 206-221 (may be same as Champions Club)

**Special Areas:**
- Center Field Social
- Coca-Cola Social Lounge
- Club 24
- K Street Boxes
- Silver Slugger Suite
- Scoreboard Pavilion
- Right Field Terrace

**Luxury Suites:**
- 79 suites on three levels
- All around the infield
- Part of the 200-level structure

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (toward lower-numbered adjacent section)
- Varying seats per row by location and level

**Row Numbering**:
- Presidents Club (A-E): Premium row labels (A-L or similar)
- 100 level center: D-Z, AA-YY (50 rows)
- 100 level ends/corners: A-Z, AA-WW (49 rows)
- 200 level: A-P (16 rows)
- 300 level: A-P (16 rows)
- 400 level: A-N (14 rows)

**Covered Sections**:
- Upper levels (300, 400) have partial overhang coverage
- Back rows of 300 and 400 levels typically covered
- Check specific sections for overhang details

**Sun-Exposed Sections (avoid for day games)**:
- 100 level 1st base side: Sections 109-120 (east side, morning/afternoon sun)
- 300 level exposed sections: Sections without overhang coverage
- Outfield sections: Scoreboard Pavilion, Right Field Terrace

---

## Data Sources

### 1. Wikipedia - Nationals Park ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Nationals_Park
- **Pros**:
  - Current capacity: 41,373 seats (2023-present)
  - Historical capacity changes documented
  - Five seating levels described
  - Premium club details
  - 79 suites mentioned
- **Best For**: Capacity verification and stadium history

### 2. TicketIQ - Nationals Park Seating Chart ⭐ RECOMMENDED
- **URL**: https://blog.ticketiq.com/blog/nationals-park-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Detailed section ranges by level
  - Row ranges for each section type
  - Center/End/Corner section breakdown
  - Specific row letter ranges (D-Z, AA-YY, etc.)
- **Best For**: Section organization and row details

### 3. MLB.com Nationals Official
- **URL**: https://www.mlb.com/nationals/ballpark/seatmap
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

### 4. RateYourSeats.com
- **URL**: https://www.rateyourseats.com/nationals-park/seating/seating-chart/nationals
- **Pros**:
  - Premium seating categories
  - User reviews and ratings
  - Section-specific information
- **Best For**: Section validation and user feedback

### 5. From This Seat
- **URL**: https://www.fromthisseat.com/index.php/blog/19925-breakdown-of-the-nationals-park-seating-chart
- **Pros**:
  - Level-by-level breakdown
  - Premium club descriptions
  - Section distribution details
- **Best For**: Overall seating layout understanding

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 87° (from stadiums.ts - home plate to center field, nearly due East)
- **Latitude**: 38.8730°N
- **Longitude**: -77.0074°W
- **Timezone**: America/New_York (Eastern Time, UTC-5/UTC-4)
- **Opened**: March 30, 2008
- **Location**: 1500 South Capitol Street SE, Washington, DC 20003

### Physical Characteristics
- **Roof**: Open (no roof)
- **Playing Surface**: Natural grass
- **Climate**: Washington DC (humid subtropical, hot summers, mild winters)
- **Home Team**: Washington Nationals
- **Type**: MLB stadium, open-air

### Dimensions
- LF Line: 336 ft
- LF-Center: 377 ft
- CF: 402 ft
- RF-Center: 370 ft
- RF Line: 335 ft
- Backstop: 58 ft
- Asymmetrical design

---

## Capacity History

- **Opening (2008-2009)**: 41,888 seats
- **2010-2011**: 41,546 seats
- **2016**: 41,313 seats
- **2019-2020**: 42,531 seats (peak capacity)
- **2023-present**: 41,373 seats (current Wikipedia)
- **stadiums.ts**: 41,313 seats (configuration in codebase)
- **Target for Generation**: 41,313 seats (exact match required)

**Note**: Using 41,313 from stadiums.ts as authoritative capacity for this implementation.

---

## Data Collection Strategy

### Approach
Given the capacity (41,313 seats) and five-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Five distinct levels (Presidents Club, Field, Club, Gallery, Upper Gallery)
   - Well-documented section organization
   - Validate against total capacity

2. **Section Grouping**
   - Presidents Club (A-E): ~5 sections → ~500 seats (100 avg/section)
   - 100 Level: ~44 sections → ~18,000 seats (409 avg/section)
   - 200 Level: ~42 sections → ~10,000 seats (238 avg/section)
   - 300 Level: ~21 sections → ~7,500 seats (357 avg/section)
   - 400 Level: ~15 sections → ~5,313 seats (354 avg/section)
   - **Total**: ~127 sections

3. **Known Section Ranges**
   - Presidents Club: A-E
   - 100 Level: 100-143
   - 200 Level: 201-243 (not all numbers used, ~42 sections)
   - 300 Level: 301-321
   - 400 Level: 401-409, 416-420

### Validation Targets
- ✅ Total capacity: 41,313 seats (exact match required)
- ✅ Five distinct levels
- ✅ Premium sections A-E (Presidents Club)
- ✅ Club sections 206-221 (Champions Club access)
- ✅ Split upper deck (400 level with gap at 410-415)
- ✅ ~127 sections total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- East orientation (87°) - favorable for afternoon games
- Open roof (no retractable cover)
- Five-level structure with premium ground-level sections
- Natural grass field
- 2008 construction (modern design)
- Split upper deck honoring Griffith Stadium

**Seating Pattern**:
- Alphabetic premium sections (A-E) at field level
- Varying row counts by level (14-50 rows)
- Club level wraps around infield with suite integration
- Gallery levels share concourse
- Press box splits upper gallery (410-415 gap)

**Complexity**:
- Moderate-high complexity
- Five distinct levels with varying structures
- Premium alphabet sections require special handling
- Not all section numbers used in 200-level
- Well-documented modern stadium

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-75 minutes (estimated)
- Validation: 60-75 minutes (iterative tuning for exact capacity)
- Pre-computation: 5-6 minutes (41,313 seats)
- **Total**: ~3-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateNationalsSeats.ts`)
3. Generate seat coordinates for ~127 sections
4. Validate total capacity matches 41,313 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 19/30 completion (63.3% progress)

---

## References

- Official Nationals Ballpark: https://www.mlb.com/nationals/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Nationals_Park
- Opened: March 30, 2008
- Location: 1500 South Capitol Street SE, Washington, DC 20003
- Architect: HOK Sport (now Populous)
- Cost: $693 million

---

## Special Considerations

**Sun Exposure Notes**:
- East orientation (87°) means:
  - Morning games: sun from east (behind 1st base)
  - Afternoon games: sun from south/southwest (3rd base side exposed)
  - Best shade: Back rows of 300/400 levels under overhang
  - Worst sun: 100 level 1st base side (109-120), outfield terraces
- Open roof: full sun exposure on clear days
- DC climate: Hot and humid April-September
- Sun precomputation critical for all seating areas

**Open Roof Considerations**:
- April-May: Mild, 60-75°F, pleasant for day games
- June-August: Hot and humid, 85-95°F, sun exposure critical
- September-October: Cooler, 65-80°F, more comfortable
- Rain delays possible (no roof protection)
- Sun exposure varies significantly by time of day

**Washington DC Timezone**:
- America/New_York (Eastern Time)
- Observes Daylight Saving Time (UTC-5 winter, UTC-4 summer)
- Same timezone as NYM, NYY, PHI, BAL, ATL, TB, MIA

**Validation Priorities**:
- Target exact capacity (41,313 seats)
- Verify 5 levels distributed properly
- Include premium sections A-E
- Handle 200-level gaps (not all numbers 201-243 exist)
- Handle 400-level split (410-415 press box gap)
- Total = exactly 41,313 seats (100.00% match)

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/nationals-obstructions.ts
- May need to create obstruction definitions
- Obstructions include upper deck overhangs, light towers, scoreboard
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 41,313 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~127 sections (5 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 19/30 in completion sequence (63.3% after completion)
