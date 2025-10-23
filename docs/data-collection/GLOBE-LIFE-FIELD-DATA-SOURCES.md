# Globe Life Field (Texas Rangers) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 40,300 seats (from stadiums.ts)
**Sections**: ~106 sections across 4 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Field Level (Sections 1-25)**
- Center sections: 7-20 (14 sections)
- End sections: 3-6, 21-23 (7 sections)
- Corner sections: 1, 25 (2 sections)
- Row range: 1-16 to 1-20 (varies by section)
- Premium areas:
  * Home Plate Club (behind home plate)
  * First Base Club
  * Third Base Club
  * Field Suites (12 suites directly behind home plate)
- Dugout locations:
  * Rangers dugout: First base side (sections 18-21)
  * Visitors dugout: Third base side
- Estimated capacity: ~10,000 seats

**100-Level / Mezzanine (Sections 101-134)**
- Center sections: 112-115 (4 sections)
- End sections: 107-111, 116-120 (9 sections)
- Corner sections: 101-106, 121-134 (20 sections)
- Row range: 1-20
- Features: Second tier, elevated views
- Estimated capacity: ~12,000 seats

**200-Level / Pavilion (Sections 211-244)**
- Center sections: 212-222 (11 sections)
- End sections: 233-236, 240-244 (9 sections)
- Corner sections: 211-240, 223-233 (varies)
- Row range: 1-10
- Features: Third tier, club level integration
- Premium: Various club seating areas
- Estimated capacity: ~8,000 seats

**300-Level / Upper (Sections 301-326)**
- Center sections: 310-314 (5 sections)
- Corner sections: 301-309, 316-326 (20 sections)
- Row range: 1-15
- Upper Box: Sections 308-317 (better views)
- Grandstand: Sections 325-326 (highest/farthest)
- Estimated capacity: ~10,300 seats

### Seating Distribution (Total: 40,300)

**Estimated Breakdown:**
- Field Level: ~10,000 seats (24.8%)
- 100-Level (Mezzanine): ~12,000 seats (29.8%)
- 200-Level (Pavilion): ~8,000 seats (19.8%)
- 300-Level (Upper): ~10,300 seats (25.6%)

### Special Features

**Premium Seating:**
- 120 executive suites (12 field suites + 71 Founders/Legacy/Classic + 16 party suites + others)
- **The Lexus Club**: Located behind home plate, upscale buffet options
- **Shift4 Club**: Premium club seating with enhanced amenities
- **Balcones Speakeasy**: Buffet-style plates, grab-and-go food, in-seat service, complimentary beverages
- **Germania Insurance Lounge**: Third base side premium area
- **Loge Boxes**: Private box seating for small groups
- **Party Suites**: 16 suites accommodating 30-420 people
- **Party Decks**: Group seating areas

**Seating Features:**
- All seats minimum 19 inches wide
- Average 19 seats per row
- Widest row: 35 seats (Row 16, Section 127)
- Narrowest row: 2 seats (Row 13, Section 321)
- Most sections: 15-30 seats per row

**Unique Features:**
- Retractable roof (climate-controlled when closed)
- Opened 2020 (newest MLB stadium)
- Synthetic turf playing surface (Shaw Sports Turf)
- Center field faces northeast (unique orientation)
- $1.1 billion construction cost

### Seating Conventions

**Seat Numbering**:
- Average ~19 seats per row
- Seats typically number from one side to the other
- Row numbering: 1-20 (field/100-level), 1-10 (200-level), 1-15 (300-level)

**Row Numbering**:
- Field Level: Rows 1-16 to 1-20 (varies by section)
- 100-Level: Rows 1-20
- 200-Level: Rows 1-10
- 300-Level: Rows 1-15

**Section Numbering Pattern**:
- 1-25: Field Level
- 101-134: 100-Level (Mezzanine)
- 211-244: 200-Level (Pavilion)
- 301-326: 300-Level (Upper)

**Covered Sections**:
- All sections can be covered when retractable roof is closed
- Roof operation depends on weather conditions
- Climate-controlled environment when roof closed
- Club areas have indoor/outdoor options

**Sun-Exposed Sections (when roof open)**:
- All sections exposed to sun when roof is open
- Afternoon games: western sections receive most sun
- Morning games: eastern sections exposed
- Center field faces NE (46° orientation)

---

## Data Sources

### 1. Wikipedia - Globe Life Field ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Globe_Life_Field
- **Pros**:
  - Official capacity: 40,300 seats
  - Record attendance: 43,598 (concert, 2022)
  - Stadium opened 2020
  - Retractable roof details
  - Center field faces northeast
  - Coordinates: 32.74750°N 97.08417°W
- **Best For**: Capacity verification and stadium specifications

### 2. TicketIQ - Globe Life Field Seating Chart ⭐ RECOMMENDED
- **URL**: https://blog.ticketiq.com/blog/globe-life-field-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Detailed section ranges by level
  - Field Level: 1-25 (center 7-20, end 3-6/21-23, corner 1/25)
  - 100-Level: 101-134 (center 112-115, end 107-111/116-120, corner 101-106/121-134)
  - 200-Level: 211-244 (center 212-222, end 233-236/240-244)
  - 300-Level: 301-326 (center 310-314, corner 301-309/316-326)
  - Row ranges specified for each level
  - Premium seating details
- **Best For**: Section organization and row details

### 3. MLB.com Rangers Official
- **URL**: https://www.mlb.com/rangers/ballpark/seat-map
- **Status**: Official source (interactive map)
- **Best For**: Visual reference and official confirmation

### 4. TickPick - Texas Rangers Seating
- **URL**: https://www.tickpick.com/blog/texas-rangers-seating-chart-with-seat-views/
- **Pros**:
  - Field level sections 1-26 with 16 rows typically
  - Average seats per row: ~19
  - Outfield sections: 24 seats per row
  - 100/200 level infield: ~20 seats per row
  - 300 level: 24-26 seats per row
- **Best For**: Row counts and seating details

### 5. RateYourSeats.com
- **URL**: https://www.rateyourseats.com/globe-life-field/seating/seating-chart
- **Pros**:
  - User reviews and ratings
  - Section-specific information
  - Coverage and roof details
- **Best For**: Section validation and user feedback

### 6. Stadium Journey - Globe Life Field
- **URL**: https://www.stadiumjourney.com/stadiums/globe-life-field-texas-rangers
- **Pros**:
  - Stadium features and amenities
  - Premium seating descriptions
  - Fan experience details
- **Best For**: Overall stadium experience

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 46° (from stadiums.ts - home plate to center field, NE)
- **Field Orientation**: Center field faces northeast (per Wikipedia)
- **Latitude**: 32.7512°N
- **Longitude**: -97.0833°W
- **Timezone**: America/Chicago (Central Time, UTC-6/UTC-5)
  * Note: stadiums.ts lists America/Denver, but Arlington, TX is in Central Time
- **Opened**: 2020 (first event: May 29, 2020)
- **Location**: 734 Stadium Drive, Arlington, TX 76011

### Physical Characteristics
- **Roof**: Retractable (climate-controlled when closed)
- **Playing Surface**: Synthetic turf (Shaw Sports Turf)
- **Climate**: Texas (hot summers, mild winters)
- **Home Team**: Texas Rangers
- **Type**: MLB stadium, retractable roof

### Dimensions
- LF Line: 329 ft
- LF-Center: 372 ft
- CF: 407 ft
- RF-Center: 374 ft
- RF Line: 326 ft
- Backstop: 42 ft
- Symmetrical design (balanced left/right)

---

## Capacity History

- **Opening (2020-present)**: 40,300 seats (current)
- **stadiums.ts**: 40,300 seats
- **Target for Generation**: 40,300 seats (exact match required)

**Note**: Globe Life Field opened in 2020 and has maintained consistent capacity.

---

## Data Collection Strategy

### Approach
Given the capacity (40,300 seats) and four-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section ranges
   - Four distinct levels (Field 1-25, 100-Level 101-134, 200-Level 211-244, 300-Level 301-326)
   - Modern stadium with clear organization (opened 2020)
   - Validate against total capacity

2. **Section Grouping**
   - Field Level (1-25): ~23 sections → ~10,000 seats (435 avg/section)
   - 100-Level (101-134): ~33 sections → ~12,000 seats (364 avg/section)
   - 200-Level (211-244): ~25 sections → ~8,000 seats (320 avg/section)
   - 300-Level (301-326): ~25 sections → ~10,300 seats (412 avg/section)
   - **Total**: ~106 sections

3. **Known Section Ranges**
   - Field: 1-25
   - 100-Level: 101-134
   - 200-Level: 211-244
   - 300-Level: 301-326

### Validation Targets
- ✅ Total capacity: 40,300 seats (exact match required)
- ✅ Four distinct levels
- ✅ Retractable roof functionality
- ✅ Modern stadium design (opened 2020)
- ✅ ~106 sections total

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- 46° orientation (NE, center field faces northeast)
- Retractable roof (climate-controlled)
- Synthetic turf playing surface
- Four-level modern design
- 2020 construction (newest MLB stadium)
- Symmetrical field dimensions

**Seating Pattern**:
- Four clear levels with consistent numbering
- Lower density per section (modern spacing)
- All seats 19+ inches wide
- Varying row counts by level (16-20 field, 20 mezzanine, 10 pavilion, 15 upper)
- 120 executive suites integrated throughout
- Average 19 seats per row

**Complexity**:
- Moderate complexity
- Four distinct levels with clear organization
- Modern construction with precise planning
- Some section number gaps (not all 1-244 exist)
- Well-documented new stadium

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 60 minutes ✅ (Complete)
- Script development: 60-75 minutes (estimated)
- Validation: 60-75 minutes (iterative tuning for exact capacity)
- Pre-computation: 5-6 minutes (40,300 seats)
- **Total**: ~3-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateRangersSeats.ts`)
3. Generate seat coordinates for ~106 sections
4. Validate total capacity matches 40,300 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games (account for retractable roof)
6. Build and test integration
7. Commit Stadium 23/30 completion (76.7% progress)

---

## References

- Official Rangers Ballpark: https://www.mlb.com/rangers/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Globe_Life_Field
- Opened: 2020
- Location: 734 Stadium Drive, Arlington, TX 76011
- Architect: HKS, Inc.
- Cost: $1.1 billion

---

## Special Considerations

**Sun Exposure Notes**:
- 46° orientation (NE) means:
  - Morning games: sun from east
  - Afternoon games: sun from south/southwest
  - Western sections most exposed in afternoon
  - Retractable roof provides full protection when closed
- Roof operation:
  - Closed during extreme heat (common in Texas summer)
  - Closed during rain
  - Climate-controlled environment when closed
  - Sun precomputation should account for typical roof operation
- Texas climate: Very hot and humid April-September (80-100°F+)

**Retractable Roof Considerations**:
- April-May: Mild to warm, roof may be open (70-85°F)
- June-August: Very hot and humid, roof typically closed (85-100°F+)
- September-October: Warm, roof operation varies (75-90°F)
- Roof closed = all seats covered
- Roof open = all seats exposed to sun
- Climate-controlled when closed (72°F typical)

**Central Timezone**:
- America/Chicago (Central Time)
- Observes Daylight Saving Time (UTC-6 winter, UTC-5 summer)
- Same timezone as MIL, CHC, CHW, KC, MIN, STL, HOU, TEX
- Note: stadiums.ts lists America/Denver (Mountain Time) - likely error

**Validation Priorities**:
- Target exact capacity (40,300 seats)
- Verify 4 levels distributed properly
- Account for retractable roof in sun calculations
- Include premium/suite seating in totals
- Total = exactly 40,300 seats (100.00% match)

**Obstructions**:
- Check if exists: src/data/obstructions/mlb/rangers-obstructions.ts
- May need to create obstruction definitions
- Modern stadium has minimal obstructions
- Retractable roof mechanism may create some shadows
- Ready for sun precomputation after creation

---

**Status**: Ready for generation script development
**Target Capacity**: 40,300 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~106 sections (4 levels)
**Generation Method**: Programmatic (recommended)
**Stadium**: 23/30 in completion sequence (76.7% after completion)
