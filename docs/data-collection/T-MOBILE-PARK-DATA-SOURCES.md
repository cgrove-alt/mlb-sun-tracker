# T-Mobile Park (Seattle Mariners) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 47,929 seats (from stadiums.ts configuration)
**Sections**: ~140 sections across 5 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**100 Level (Main Concourse)**
- Regular sections: 102-151 (50 sections)
- Row range: 1-41 (most sections), some start at row 4 or 5 (behind dugouts)
- Diamond Club: Sections 25, 35 (premium seating behind home plate)
- Dugouts: Mariners (sections 121-124), Visitors (sections 136-139)
- Bullpens: Located in front of left field sections, next to section 152
- Protective netting: Sections 115-146
- Total: ~50 sections
- Estimated capacity: ~20,634 seats

**200 Level (Club/Terrace Level)**
- Third base side: 211-226 (16 sections)
- First base side: 233-249 (17 sections)
- Row range: 1-12 across all sections
- Premium features: concession vouchers ($5-$10), waitress service, lounge access, padded seats
- Last 2-3 rows: positioned below overhang for early shade
- Total: ~33 sections
- Estimated capacity: ~4,585 seats

**300 Level (Upper Concourse/View Level)**
- Sections: 306-347 (42 sections)
- Row range: 1-25 across all sections
- Best value sections: 333-344 (covered by roof, shade during late afternoon)
- Permanent roof coverage: 306-310 (note: sun shifts during afternoon)
- Total: ~42 sections
- Estimated capacity: ~15,955 seats

**Bleachers (Outfield)**
- Sections: 180-195 (16 sections total)
- Left field bleachers: 12 rows (1-12)
- Right field bleachers: 17 rows (1-17)
- Total: ~16 sections
- Estimated capacity: ~3,706 seats

**Suite Level**
- Luxury and party suites integrated throughout stadium
- Estimated capacity: ~1,945 seats
- Mix of locations across multiple levels

### Seating Distribution (Total: 47,929)

**Estimated Breakdown:**
- 100 Level (Main): ~20,634 seats (43.1%)
- 200 Level (Club): ~4,585 seats (9.6%)
- 300 Level (Upper): ~15,955 seats (33.3%)
- Bleachers: ~3,706 seats (7.7%)
- Suites: ~1,945 seats (4.1%)
- Misc/Premium: ~2,104 seats (2.2%)

### Special Features

**Retractable Roof:**
- **Type**: Partial retractable roof (does not fully enclose ballpark)
- **Operation Time**: 10-20 minutes to fully open or close
- **Coverage**: 9 acres
- **Weight**: 22 million pounds
- **Mechanism**: Moves on 128 wheels along rails
- **Usage**: 300-500 times per year (mostly for grass management)
- **Height**: 269 feet above field level (top), 217 feet (bottom)
- **Note**: Wind and temperatures still impact game when roof is closed

**Playing Surface**:
- Natural grass
- Requires frequent roof movement for proper growth and maintenance

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (standard MLB practice)
- Varying seats per row by location and level

**Row Numbering**:
- 100 level: Numbers 1-41 (some sections start at row 4 or 5)
- 200 level: Numbers 1-12
- 300 level: Numbers 1-25
- Bleachers: Numbers 1-12 (LF), 1-17 (RF)

**Covered Sections (when roof open)**:

*Best shade for day games:*
- 100 level: Rows 35+ in sections 116-144 (fully covered, guaranteed shade)
- 100 level: Sections 127-133 (directly below press box)
- 200 level: Last 2-3 rows in each section (below overhang)
- 300 level: Sections 326-335, 333-344 (covered by upper deck roof)
- 300 level: Rows 15-25 in sections 334-344 (covered, sun behind during late afternoon)

**Sun-Exposed Sections (when roof open - avoid for day games)**:
- Right field: Upper deck sections (longest sun exposure)
- Lower level RF: Sections 106-124 (front rows, most susceptible)
- Lower level LF: Sections 136-151 (fully in sun)
- Upper deck: Sections 306-310 (trap sections - covered pre-game but sun shifts during afternoon)

---

## Data Sources

### 1. Wikipedia - T-Mobile Park ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/T-Mobile_Park
- **Pros**:
  - Official capacity history (46,621 → 47,929)
  - Opened: July 15, 1999
  - First game: July 15, 1999 (44,607 attendance)
  - Retractable roof specifications (10-20 min, 22 million lbs, 9 acres)
  - Dimensions and field specifications
  - Historical context and renovations
- **Best For**: Capacity verification and stadium history

### 2. TicketIQ - T-Mobile Park Seating Chart
- **URL**: https://blog.ticketiq.com/blog/t-mobile-park-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Exact section ranges for all levels (100, 200, 300)
  - Row ranges for each section type
  - Center/corner/end section breakdowns
  - Club seat locations and premium areas
  - Detailed seating organization
- **Best For**: Section number validation and row details

### 3. RateYourSeats.com - Shaded/Covered Seats
- **URL**: https://www.rateyourseats.com/t-mobile-park/seating/shaded-covered-seats
- **Pros**:
  - Specific sections for shade (rows 35+, sections 116-144, 127-133, etc.)
  - Sections to avoid for sun (right field, 106-124, 136-151)
  - Row-specific shade information
  - Time-of-day sun patterns
  - Upper deck coverage details
- **Best For**: Sun exposure and coverage mapping

### 4. ShadedSeats.com - T-Mobile Park Shade
- **URL**: https://www.shadedseats.com/t-mobile-park-shaded-seats/
- **Pros**:
  - Detailed shade analysis by time of day
  - Retractable roof usage patterns
  - Row-specific recommendations
  - Sections to avoid for sun protection
- **Best For**: Sun exposure strategy and covered seating

### 5. MLB.com Mariners Official
- **URL**: https://www.mlb.com/mariners/ballpark/seat-map
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 318° (from stadiums.ts - home plate to center field, NW orientation)
- **Latitude**: 47.5914°N
- **Longitude**: -122.3325°W
- **Timezone**: America/Los_Angeles (Pacific Time, UTC-8/UTC-7)
- **Opened**: July 15, 1999
- **Original Name**: Safeco Field (1999-2018)
- **Current Name**: T-Mobile Park (2018-present)

### Physical Characteristics
- **Roof**: Retractable (10-20 minutes operation, partial coverage)
- **Field**: Natural grass (Kentucky Bluegrass)
- **Climate**: Seattle (rainy winters, mild summers)
- **Location**: Seattle, Washington
- **Home Team**: Seattle Mariners
- **Type**: MLB stadium with retractable roof

### Dimensions
- LF Line: 331 ft
- LF-Center: 378 ft
- CF: 401 ft
- RF-Center: 381 ft
- RF Line: 326 ft
- Backstop: 69 ft
- Asymmetrical design

---

## Capacity History

- **Opening (1999)**: 46,621 seats (Safeco Field)
- **2003**: 47,772 seats
- **2004-2008**: 47,447 seats
- **2009-2011**: 47,878 seats
- **2012**: 47,860 seats
- **2013-2014**: 47,476 seats
- **2015**: 47,574 seats
- **2016-2017**: 47,943 seats
- **2018**: 47,715 seats (renamed T-Mobile Park)
- **2019-present**: 47,929 seats (current capacity)
- **stadiums.ts**: 47,929 seats (configuration in codebase)
- **Target for Generation**: 47,929 seats (exact match required)

**Note**: Capacity has fluctuated slightly over the years due to various renovations and seating reconfigurations. Current capacity (47,929) has been stable since 2019.

---

## Data Collection Strategy

### Approach
Given the capacity (47,929 seats) and five-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Five main levels (100, 200, 300, bleachers, suites)
   - Well-documented section organization
   - Validate against total capacity

2. **Section Grouping**
   - 100 Level: ~50 sections → ~20,634 seats (413 avg/section)
   - 200 Level: ~33 sections → ~4,585 seats (139 avg/section)
   - 300 Level: ~42 sections → ~15,955 seats (380 avg/section)
   - Bleachers: ~16 sections → ~3,706 seats (232 avg/section)
   - Suites: distributed → ~1,945 seats
   - Misc: ~2,104 seats
   - **Total**: ~140 sections

3. **Known Section Ranges**
   - 100: 102-151 (including Diamond Club 25, 35)
   - 200: 211-226, 233-249
   - 300: 306-347
   - Bleachers: 180-195

### Validation Targets
- ✅ Total capacity: 47,929 seats (exact match required)
- ✅ Five distinct levels plus suites
- ✅ Bleacher sections in outfield (180-195)
- ✅ Club seats in 200 level (~4,585 seats)
- ✅ Covered section flags for overhang areas
- ✅ ~140 sections total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- NW orientation (318°) - uncommon in MLB
- Retractable roof (partial coverage, doesn't fully enclose)
- Five-level structure with integrated suites
- Natural grass with roof management for growth
- Significant overhang at row 35+ in 100 level

**Seating Pattern**:
- Clear level organization (100, 200, 300, bleachers, suites)
- Varying row counts by level (12-41 rows)
- Diamond Club premium seating
- Two separate bleacher sections (LF and RF with different row counts)
- Upper deck provides shade for club level

**Complexity**:
- Moderate-high complexity
- Five distinct levels with clear ranges
- Retractable roof adds unique sun patterns
- Bleacher sections have different row counts
- Well-documented section organization

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 45 minutes ✅ (Complete)
- Script development: 45-60 minutes (estimated)
- Validation: 45-60 minutes (iterative tuning for exact capacity)
- Pre-computation: 5-6 minutes (47,929 seats)
- **Total**: ~2.5-3 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateMarinersSeats.ts`)
3. Generate seat coordinates for ~140 sections
4. Validate total capacity matches 47,929 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 17/30 completion (56.7% progress)

---

## References

- Official Mariners Ballpark: https://www.mlb.com/mariners/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/T-Mobile_Park
- Opened: July 15, 1999
- Location: 1250 1st Avenue S, Seattle, WA 98134
- Original Name: Safeco Field (1999-2018)

---

## Special Considerations

**Sun Exposure Notes**:
- NW orientation (318°) means:
  - Morning games: sun from east/northeast
  - Afternoon games: sun from south/southwest (right field most exposed)
  - Best shade: rows 35+ in sections 116-144, sections 127-133 (below press box)
  - Worst sun: right field upper deck, lower level RF sections 106-124 (front rows)
- Retractable roof: partial coverage, doesn't eliminate sun entirely
- Overhang provides significant shade at rows 35+ in 100 level
- Seattle climate: cloudy/rainy April-May, sunny June-September

**Retractable Roof Strategy**:
- April-May: Often open (rainy season, 55-65°F)
- June-September: Often open (dry season, 65-75°F, sunnier)
- October: Often open (cooling off, 55-65°F, some rain)
- Roof closes for rain, not heat (stadium hotter when closed)
- Roof movements primarily for grass management (300-500 times/year)
- Sun precomputation should account for roof-open scenario

**Seattle Timezone**:
- America/Los_Angeles (Pacific Time)
- Observes Daylight Saving Time (UTC-8 winter, UTC-7 summer)
- Same timezone as LA, SF, Oakland, San Diego, Anaheim

**Validation Priorities**:
- Target exact capacity (47,929 seats)
- Verify 5 levels plus suites distributed properly
- Confirm bleacher sections 180-195 (LF 12 rows, RF 17 rows)
- Apply covered flags for sections with overhang (rows 35+ in 116-144)
- Total = exactly 47,929 seats (100.00% match)

**Obstructions**:
- Already defined: src/data/obstructions/mlb/mariners-obstructions.ts
- Obstructions include retractable roof, upper deck overhangs, light towers
- Ready for sun precomputation

---

**Status**: Ready for generation script development
**Target Capacity**: 47,929 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~140 sections (5 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 17/30 in completion sequence (56.7% after completion)
