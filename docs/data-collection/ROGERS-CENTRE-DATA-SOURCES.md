# Rogers Centre (Toronto Blue Jays) Seating Data Sources

**Last Updated**: 2025-10-22
**Target Capacity**: 49,282 seats (2013-2022 configuration, per stadiums.ts)
**Current Capacity**: 39,150 seats (2024-present, post-renovation)
**Sections**: ~150-200 sections across 3 main levels + 161 suites
**Status**: Research Complete - Ready for Data Generation

---

## IMPORTANT: Capacity Discrepancy

**Configuration vs Reality:**
- **stadiums.ts configuration**: 49,282 seats (2013-2022 capacity)
- **Current actual capacity (2024+)**: 39,150 seats (post-major renovation)
- **Renovation period**: 2022-2024
- **Changes**: Re-oriented outfield seats, removed seats to widen remaining seats

**Decision for Implementation:**
- **Target**: 49,282 seats (as specified in stadiums.ts)
- **Rationale**: Match the configuration file for consistency
- **Note**: This represents the pre-renovation capacity used during 2013-2022

---

## Stadium Organization

### Level Structure

**100 Level (Field Level)**
- Lower bowl seating closest to field
- Field-level seats in foul territory
- Recently renovated first and third base line sections
- Great sightlines to home plate
- Estimated sections: 101-180

**200 Level (Club/Terrace Level)**
- Mid-level seating with premium amenities
- Sections 227-231: Protection from sun (even during day games)
- HR Zone in left field
- 5,700 club seats distributed across level
- Estimated sections: 201-260

**500 Level (View/Upper Level)**
- Highest seating tier
- Most affordable options
- Social spaces, bars, outfield sections
- Corona Rooftop Patio (right field)
- TD Park Social with interactive games
- Estimated sections: 501-560

**Luxury Suites**
- **Count**: 161 luxury suites
- Located between 200 and 500 levels
- Private viewing areas

### Seating Distribution (Pre-Renovation: 49,282 total)

**Estimated Breakdown:**
- 100 Level: ~20,000 seats (40%)
- 200 Level: ~12,000 seats (24%) + 5,700 club seats
- 500 Level: ~15,000 seats (30%)
- Suites: ~2,282 seats (161 suites, ~14 seats/suite)
- **Total: 49,282 seats**

### Special Features

**Retractable Roof**:
- **Panels**: 4-panel motorized system
- **Operation Time**: 20 minutes to open or close
- **Limitation**: Cannot move in cold weather
- **Historical**: First MLB stadium with retractable roof (1989)

**Unique Characteristics**:
- 348-room hotel with 70 rooms overlooking field
- Underground parking (5 sections)
- Largest retractable roof in North America
- Multi-purpose venue (baseball, football, concerts)
- Originally named SkyDome (1989-2005)

**Notable Areas**:
- The Catch Bar (right field, overlooking bullpen)
- Corona Rooftop Patio (500 level, right field)
- TD Park Social (500 level, interactive games)
- Field-level renovated sections (first/third base lines)

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (standard MLB practice)
- Varying seats per row by location and level

**Row Numbering**:
- 100 level: Letter rows common (A, B, C...)
- 200 level: Mix of letters and numbers
- 500 level: Numbered rows typical
- Examples confirmed: Row references in sections 220, 511, 526

**Covered Sections**:
- Retractable roof provides full coverage when closed
- 200 level: Sections 227-231 noted for sun protection
- When roof open: Limited natural coverage
- 500 level: Some overhang protection

---

## Data Sources

### 1. Wikipedia - Rogers Centre ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Rogers_Centre
- **Pros**:
  - Historical capacity data (1989-present)
  - Target capacity: 49,282 (2013-2022)
  - Current capacity: 39,150 (2024-present)
  - 161 luxury suites
  - 5,700 club seats
  - Retractable roof details (4 panels, 20 min operation)
  - Opened: June 3, 1989
- **Best For**: Capacity verification and historical context

### 2. RateYourSeats.com
- **URL**: https://www.rateyourseats.com/rogers-centre/seating
- **Pros**:
  - Three main levels confirmed (100, 200, 500)
  - Section examples: 220, 511, 526, 2, 523, 148B
  - Sections 227-231 sun protection notes
  - Premium areas mentioned (HR Zone, Rooftop Patio, TD Park Social)
  - Field-level renovation details
- **Best For**: Section number validation and level organization

### 3. MLB.com Blue Jays Official
- **URL**: https://www.mlb.com/bluejays/ballpark/seating-map
- **Status**: Interactive map (data not directly extractable)
- **Best For**: Visual reference (when accessible)

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 15° (from stadiums.ts - home plate to center field, NNE)
- **Latitude**: 43.6414°N
- **Longitude**: -79.3894°W
- **Timezone**: America/Toronto (Eastern Time)
- **Opened**: June 3, 1989
- **Original Name**: SkyDome (1989-2005)
- **Current Name**: Rogers Centre (2005-present)
- **Architect**: Rod Robbie

### Physical Characteristics
- **Roof**: Retractable (4 panels, motorized)
- **Roof Operation**: 20 minutes open/close
- **Roof Limitation**: Cannot move in cold weather
- **Field**: Artificial turf (FieldTurf since 2010)
- **Climate**: Toronto (cold winters, roof typically closed)
- **Location**: Toronto, Ontario, Canada
- **Home Team**: Toronto Blue Jays
- **Historical**: First MLB stadium with retractable roof

### Dimensions
- LF Line: 328 ft
- CF: 400 ft
- RF Line: 328 ft
- LF Power Alley: 375 ft
- RF Power Alley: 375 ft
- Symmetrical design

---

## Capacity History

- **Opening (1989)**: 50,516 seats (original baseball configuration)
- **1999-2012**: ~50,000 seats (various minor adjustments)
- **2013-2022**: 49,282 seats (target capacity from stadiums.ts)
- **2023**: 41,500 seats (renovation phase 1)
- **2024-present**: 39,150 seats (post-major renovation)
- **Football configuration**: 53,506 seats (when used for CFL)

**Major 2022-2024 Renovation:**
- Re-oriented outfield seats to face home plate
- Removed seats to widen all remaining seats
- Enhanced sightlines and comfort
- Reduced capacity from 49,282 to 39,150 (-10,132 seats, -20.6%)

**Target for Generation**: 49,282 seats (exact match required, pre-renovation)

---

## Data Collection Strategy

### Approach
Given the target capacity (49,282 seats) and three-level structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on 2013-2022 configuration
   - Three distinct main levels (100, 200, 500) + 161 suites
   - Large capacity (2nd largest in project after Dodgers)
   - Validate against 49,282 total capacity

2. **Estimated Section Grouping**
   - 100 Level: ~80 sections → ~20,000 seats (250 avg/section)
   - 200 Level: ~60 sections → ~12,000 seats (200 avg/section) + club
   - 500 Level: ~60 sections → ~15,000 seats (250 avg/section)
   - Suites: 161 suites → ~2,282 seats (14 avg/suite)
   - **Total**: ~200 sections + 161 suites

3. **Known Sections**
   - 100 level examples: Section 2, 148B
   - 200 level examples: Section 220, 227-231
   - 500 level examples: Section 511, 526, 523

### Validation Targets
- ✅ Total capacity: 49,282 seats (exact match required)
- ✅ 161 luxury suites integrated
- ✅ 5,700 club seats distributed across 200 level
- ✅ Three main levels (100, 200, 500)
- ✅ Retractable roof coverage when closed

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- NNE orientation (15°) - morning sun from northeast, afternoon from west
- Retractable roof (like Astros, Brewers)
- Multi-purpose design (baseball, football, concerts)
- Integrated hotel with field-view rooms (unique in MLB)
- Artificial turf field

**Seating Pattern**:
- Three-tier structure (100, 200, 500)
- Large capacity (2nd largest: 49,282 seats)
- Heavy suite integration (161 suites)
- Symmetrical bowl design
- 5,700 club seats in 200 level

**Complexity**:
- Moderate-high complexity
- Large capacity requires careful parameter tuning
- Three distinct levels plus suites
- Pre-renovation configuration (not current)

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 45 minutes ✅ (Complete)
- Script development: 45-60 minutes (estimated)
- Validation: 45-75 minutes (larger stadium, more iterations)
- Pre-computation: 6-8 minutes (49K seats)
- **Total**: ~2.5-3.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateBlueJaysSeats.ts`)
3. Generate seat coordinates for ~200 sections + 161 suites
4. Validate total capacity matches 49,282 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 13/30 completion

---

## References

- Official Blue Jays Ballpark: https://www.mlb.com/bluejays/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Rogers_Centre
- Opened: June 3, 1989
- Location: 1 Blue Jays Way, Toronto, ON M5V 1J1, Canada
- Original Name: SkyDome (1989-2005)

---

## Special Considerations

**Sun Exposure Notes**:
- NNE orientation (15°) means:
  - Morning games: sun from northeast
  - Afternoon games: sun shifts to west (first base side)
  - Sections 227-231 noted for sun protection
- Retractable roof typically closed April-May, Sept-Oct (cold weather)
- When roof closed: no sun exposure
- When roof open: limited natural coverage except noted sections
- Toronto climate: cold winters, moderate summers

**Retractable Roof Strategy**:
- April-May: Often closed (cold weather)
- June-August: Often open (favorable weather)
- September-October: Often closed (cooling weather)
- Cannot operate in cold temperatures
- Sun precomputation should account for both scenarios

**Validation Priorities**:
- Target pre-renovation capacity (49,282 seats)
- Verify 161 suites integrated properly (~14 seats each)
- Confirm 5,700 club seats in 200 level
- Three main levels distributed appropriately
- Total = exactly 49,282 seats

**Toronto Timezone Note**:
- America/Toronto (Eastern Time, ET)
- Follows Daylight Saving Time
- Important for sun calculations

---

**Status**: Ready for generation script development
**Target Capacity**: 49,282 seats (exact match required, pre-renovation)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~200 main sections + 161 suites
**Generation Method**: Programmatic (recommended)
**Stadium**: 13/30 in completion sequence
