# Truist Park Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 41,084 seats (current capacity in stadiums.ts)
**Wikipedia Capacity**: 41,108 seats
**Sections**: ~150-180 sections across 4 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**100 Level (Field Level)**
- Dugout Club: Sections 16-21 (Braves dugout), 31-35 (visiting dugout)
- Premium seating: Truist Club, Chairman's, Executive seats between bases
- Diamond seats: Three pricing tiers extending down lines
- Bullpen sections: 144-145 (visiting), 152-153 (Braves)
- Overhang coverage: Begins around rows 8-10
- Right field corner: Mostly covered for shade
- Dugout sections: Comfortable mesh fabric construction

**200 Level (Terrace/Mezzanine)**
- Xfinity Club: Premium seating between bases
- Hank Aaron Terrace: Left field (reserved for groups)
- Overhang protection: Rows 14+ typically covered
- Corner sections extend farther from field
- Premium club access dominates concourse

**300 Level (Vista Level)**
- Most affordable behind-home-plate viewing
- Vista Reserved: Sections 315-317, 335-339
- Coca-Cola Corner: Left field (includes complimentary beverages)
- Overhang coverage: Approximately final 3 rows
- Benefits from frequent breezes
- Challenging concourse navigation when sold out

**400 Level (Grandstand)**
- Nearly all seats covered by extensive roof
- 5 general admission sections in left field corner (first-come basis)
- Access requires climbing past ductwork/HVAC from 300-level
- Plexiglass railings in lower rows may obstruct views
- Panoramic views with natural breeze in upper rows

### Special Features

**Premium Clubs:**
- Truist Club (behind home plate)
- Chairman's Club
- Executive Club
- Xfinity Club (200 level)
- Dugout Club (sections 16-21, 31-35)
- Rooftop Club (right field, 300-level area)

**Unique Characteristics:**
- Cantilever design pushes seats closer to field than most MLB parks
- "Highest percentage of seats in close proximity to field" claim
- Upper deck seats 21 feet closer to field than Turner Field
- Built into sloped, rocky landscape
- 90-foot-wide protective canopy around top level

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (standard MLB practice)
- Varying seats per row by location and level

**Row Numbering**:
- 100 level: Numbers 1-30+ (varies by section)
- 200 level: Premium sections ~9 rows, others deeper
- 300 level: Variable rows
- 400 level: Upper deck rows

**Covered Sections**:
- 100 level: Rows 8-10+ in most sections
- 200 level: Rows 14+ typically covered
- 300 level: Final 3 rows covered
- 400 level: Nearly all seats covered by roof
- First base side receives afternoon shade before third base side

---

## Data Sources

### 1. Interactive Seating Chart Websites

#### MLB.com Braves Official
- **URL**: https://www.mlb.com/braves/ballpark/seating-map
- **Status**: 404 error encountered
- **Best For**: Authoritative source (when accessible)

#### BallparkEGuides.com ⭐ RECOMMENDED
- **URL**: https://ballparkeguides.com/truist-park-seating/
- **Pros**:
  - Comprehensive level breakdown
  - Coverage information (overhang details)
  - Specific section examples
  - Shade pattern descriptions
- **Best For**: Understanding coverage and level organization

#### RateYourSeats.com
- **URL**: https://www.rateyourseats.com/truist-park/seating
- **Pros**:
  - Section examples (112, 320, 322)
  - Premium area descriptions
  - User photos from actual seats
- **Cons**: Limited technical specifications
- **Best For**: Visual validation

#### Wikipedia
- **URL**: https://en.wikipedia.org/wiki/Truist_Park
- **Pros**:
  - Official capacity reference (41,108 listed)
  - Opening date and history
  - Architectural features
- **Note**: Shows 41,108 vs 41,084 in stadiums.ts

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 45° (from stadiums.ts - home plate to center field, NE)
- **Latitude**: 33.8908°N
- **Longitude**: 84.4678°W
- **Timezone**: America/New_York (Eastern Time)
- **Opened**: April 14, 2017 (regular season debut)
- **Record Attendance**: 43,619 (August 17, 2019)

### Physical Characteristics
- **Roof**: Open air with 90-foot protective canopy
- **Climate**: Hot, humid summers
- **Location**: Atlanta (Cobb County), Georgia
- **Home Team**: Atlanta Braves
- **Previous Venue**: Turner Field (1997-2016)
- **Unique Features**:
  - Cantilever design for closer seating
  - Built into sloped, rocky landscape
  - Multi-level entry (enter from middle, descend to seats)
  - Compact configuration maximizes field proximity

---

## Capacity History

- **Opening (2017)**: 41,084 seats (stadiums.ts current value)
- **Wikipedia Reference**: 41,108 seats
- **Target for Generation**: 41,084 seats (exact match required)

**Note**: Using 41,084 as official target based on stadiums.ts configuration

---

## Data Collection Strategy

### Approach
Given the capacity (41,084 seats) and modern stadium design:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented patterns
   - Four distinct levels with clear organization
   - Modern stadium (2017) with consistent layout
   - Validate against capacity target

2. **Estimated Section Grouping**
   - 100 Level: ~50-60 sections (field level, premium clubs)
   - 200 Level: ~30-40 sections (terrace/mezzanine, Xfinity Club)
   - 300 Level: ~40-50 sections (vista level)
   - 400 Level: ~30-40 sections (grandstand)
   - Total: ~150-190 sections estimated

### Validation Targets
- ✅ Total capacity: 41,084 seats (exact match required)
- ✅ ~150-180 sections estimated
- ✅ Varying seats/row by location and premium level
- ✅ Coverage patterns: Rows 8-10+ (100), 14+ (200), final 3 (300), nearly all (400)
- ✅ Premium clubs, dugout clubs, general admission areas

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- Modern design (2017)
- NE orientation (45°) - morning sun in right field, afternoon sun in left field
- Cantilever design pushes seating unusually close to field
- Extensive protective canopy (90-foot-wide)
- Built into sloped terrain (multi-level entry)

**Seating Pattern**:
- Compact configuration emphasizes field proximity
- Upper deck significantly closer than typical (21 feet closer than Turner Field)
- Nearly entire 400-level covered
- Progressive overhang coverage from lower to upper levels

**Complexity**:
- Moderate complexity
- Well-documented modern stadium
- Clear four-level organization
- Extensive premium seating integration

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 2 hours ✅ (Complete)
- Script development: 3-4 hours (estimated)
- Validation: 1-2 hours
- Pre-computation: 2 hours
- **Total**: ~8-10 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateBravesSeats.ts`)
3. Generate seat coordinates for all ~150-180 sections
4. Validate total capacity matches 41,084 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 9/30 completion

---

## References

- Official Braves Ballpark Info: https://www.mlb.com/braves/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Truist_Park
- BallparkEGuides: https://ballparkeguides.com/truist-park-seating/
- Stadium Opened: April 14, 2017
- Previous Stadium: Turner Field (1997-2016)
- Location: 755 Battery Avenue SE, Atlanta, GA 30339

---

## Special Considerations

**Sun Exposure Notes**:
- NE orientation (45°) means:
  - Morning sun in right field
  - Afternoon sun shifts to left field
  - First base side gets afternoon shade before third base
- 400-level nearly fully covered (minimal sun exposure)
- 90-foot protective canopy around top level
- Progressive overhang coverage by row/level
- Right field corner sections mostly covered

**Validation Priorities**:
- Focus on 100-level premium sections (dugout clubs, diamond seats)
- Verify 200-level Xfinity Club configuration
- Validate 300-level Vista Reserved sections
- Confirm 400-level general admission areas
- Check overhang coverage patterns by level

---

**Status**: Ready for generation script development
**Target Capacity**: 41,084 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~150-180
**Generation Method**: Programmatic (recommended)
**Stadium**: 9/30 in completion sequence
