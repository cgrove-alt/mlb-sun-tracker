# Angel Stadium Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 45,517 seats (2019-present)
**Sections**: ~150-180 sections across 3 main levels + suites
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**100 Level (Field Level)**
- Lower bowl seating closest to field
- Includes dugout boxes and premium Diamond Club
- Wraps from RF foul pole to LF foul pole
- Club seats: 5,075 total (integrated across levels)
- Sections: Estimated 101-149 (based on typical MLB patterns)

**200 Level (Terrace/Club Level)**
- Mid-level seating with club access
- Premium amenities and exclusive access areas
- Better viewing angles, elevated perspective
- Suite level separates 200 and 500 levels
- Sections: Estimated 201-249 (confirmed 201 exists)

**500 Level (View Level / Upper Deck)**
- Highest seating tier
- Most affordable options
- Panoramic views of field and surroundings
- Upper deck height: 80 feet (from stadiums.ts)
- Sections: Estimated 501-559 (confirmed 522 exists)

**Luxury Suites**
- 78 luxury suites total
- Located between 200 and 500 levels
- Private viewing areas with premium amenities

### Special Features

**Premium Seating:**
- Diamond Club (100 level premium)
- Club seats distributed across multiple levels (5,075 total)
- 78 luxury suites between main seating tiers

**Unique Characteristics:**
- Highly symmetrical layout (equitable views from both sides)
- "California Spectacular" display behind left-center field
- Outfield bleacher pavilions
- Open-air design with significant sun exposure
- Renovated 1996-1998 to baseball-only configuration
- Previously hosted NFL Rams (1980-1994) at 69,008 capacity

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (standard MLB practice)
- Varying seats per row by location and level

**Row Numbering**:
- 100 level: Letter rows (A, B, C...) common for premium, numbers for upper rows
- 200 level: Variable rows depending on section
- 500 level: Upper deck rows

**Covered Sections**:
- Upper levels have roof coverage (120 ft roof height, 40 ft overhang)
- First base side receives afternoon shade (ENE orientation, 65°)
- Shaded/covered seats noted but specific sections not publicly documented
- Sun exposure significant due to open-air design

---

## Data Sources

### 1. Interactive Seating Chart Websites

#### MLB.com Angels Official
- **URL**: https://www.mlb.com/angels/ballpark/seating-map
- **Status**: 404 error encountered
- **Best For**: Authoritative source (when accessible)

#### BallparkEGuides.com
- **URL**: https://ballparkeguides.com/angel-stadium-seating/
- **Status**: 404 error encountered
- **Best For**: Level breakdown (when accessible)

#### RateYourSeats.com ⭐ RECOMMENDED
- **URL**: https://www.rateyourseats.com/angel-stadium/seating
- **Pros**:
  - Three main seating levels confirmed
  - Suites between levels 2 and 3
  - Sections 201, 122, 522 confirmed
  - Symmetrical layout noted
  - Club seats and shaded areas mentioned
- **Best For**: General layout understanding

#### Wikipedia
- **URL**: https://en.wikipedia.org/wiki/Angel_Stadium
- **Pros**:
  - Official capacity: 45,517 (2019-present)
  - 5,075 club seats, 78 luxury suites
  - Historical context and renovation details
  - Sun exposure notes (scoreboards in direct sunshine)
- **Best For**: Capacity verification and historical context

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 65° (from stadiums.ts - home plate to center field, ENE)
- **Latitude**: 33.8003°N
- **Longitude**: -117.8827°W
- **Timezone**: America/Los_Angeles (Pacific Time)
- **Opened**: April 19, 1966 (originally Anaheim Stadium)
- **Major Renovation**: 1996-1998 (baseball-only conversion)
- **Record Attendance**: 64,593 (April 7, 1998 - Rams game, pre-renovation)

### Physical Characteristics
- **Roof**: Open air with partial coverage
- **Roof Height**: 120 feet (from stadiums.ts)
- **Roof Overhang**: 40 feet (from stadiums.ts)
- **Upper Deck Height**: 80 feet (from stadiums.ts)
- **Climate**: Mediterranean climate, warm and dry
- **Location**: Anaheim, California
- **Home Team**: Los Angeles Angels
- **Unique Features**:
  - "California Spectacular" water feature and rock display
  - "Big A" sign in parking lot (former scoreboard)
  - Highly symmetrical bowl design
  - Outfield bleacher pavilions

---

## Capacity History

- **Opening (1966)**: 43,250 seats (baseball)
- **Rams Era (1980-1994)**: 69,008 seats (football configuration)
- **Post-Renovation (1998)**: 45,050 seats
- **Current (2019-present)**: 45,517 seats (stadiums.ts value)
- **Target for Generation**: 45,517 seats (exact match required)

**Note**: Using 45,517 as official target based on stadiums.ts configuration

---

## Data Collection Strategy

### Approach
Given the capacity (45,517 seats) and modern renovated stadium:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented patterns
   - Three distinct main levels plus suites
   - Symmetrical layout simplifies modeling
   - Validate against capacity target

2. **Estimated Section Grouping**
   - 100 Level: ~50-55 sections (field level, Diamond Club)
   - 200 Level: ~45-50 sections (terrace/club level)
   - 500 Level: ~50-60 sections (view level/upper deck)
   - Suites: 78 luxury suites (between 200 and 500 levels)
   - Total: ~145-165 sections + 78 suites = ~223-243 total

3. **Club Seats Distribution**
   - 5,075 club seats spread across levels
   - Primarily in 100 and 200 levels
   - Premium pricing tiers

### Validation Targets
- ✅ Total capacity: 45,517 seats (exact match required)
- ✅ ~150-180 main sections + 78 suites
- ✅ 5,075 club seats integrated
- ✅ Symmetrical layout around home plate
- ✅ Coverage from roof overhang in upper sections

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- ENE orientation (65°) - morning sun in RF, afternoon sun shifts to LF
- Symmetrical bowl design (unlike asymmetric modern parks)
- Renovated 1996-1998 (baseball-only from dual-use)
- Three-tier structure with suites between upper levels
- Roof overhang provides shade to upper sections

**Seating Pattern**:
- Classic symmetrical bowl (pre-dates retro asymmetric trend)
- Consistent row/seat counts across similar sections
- Large capacity (10th largest MLB park)
- Significant club seat integration (5,075)

**Complexity**:
- Moderate complexity
- Well-documented renovation (1998)
- Clear three-level organization
- Symmetrical design simplifies generation

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 1.5 hours ✅ (Complete)
- Script development: 3-4 hours (estimated)
- Validation: 1-2 hours
- Pre-computation: 2-3 hours
- **Total**: ~7.5-10.5 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateAngelsSeats.ts`)
3. Generate seat coordinates for all ~150-180 sections
4. Validate total capacity matches 45,517 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 10/30 completion

---

## References

- Official Angels Ballpark Info: https://www.mlb.com/angels/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Angel_Stadium
- RateYourSeats: https://www.rateyourseats.com/angel-stadium/seating
- Stadium Opened: April 19, 1966
- Major Renovation: 1996-1998 (baseball-only conversion)
- Location: 2000 Gene Autry Way, Anaheim, CA 92806

---

## Special Considerations

**Sun Exposure Notes**:
- ENE orientation (65°) means:
  - Morning/early afternoon sun in right field
  - Sun shifts to left field in late afternoon
  - First base side gets afternoon shade before third base
- Upper deck has roof coverage (120 ft roof, 40 ft overhang)
- Scoreboards historically had sun exposure issues
- Open-air design = significant sun exposure lower levels
- California climate: warm, dry, strong UV

**Validation Priorities**:
- Focus on symmetrical distribution across sides
- Verify 5,075 club seats distributed properly
- Confirm 78 suite locations between levels
- Check roof overhang coverage in 500 level
- Validate total = exactly 45,517 seats

---

**Status**: Ready for generation script development
**Target Capacity**: 45,517 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: ~150-180 + 78 suites
**Generation Method**: Programmatic (recommended)
**Stadium**: 10/30 in completion sequence
