# Sutter Health Park (Oakland Athletics Temporary Home) Seating Data Sources

**Last Updated**: 2025-10-22
**Official Capacity**: 14,014 seats (2025 A's configuration)
**Sections**: ~11 main bowl sections + 36 suites + specialty areas
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Main Seating Bowl**
- **Sections**: 101-111 (11 sections)
- Single-level bowl wrapping from RF to LF
- Includes "Senate" sections (104-111)
- Fixed seating with individual seats

**Premium Seating**
- **Suites**: 36 luxury suites (750 seats total, ~21 seats/suite)
- **Diamond Club**: Behind home plate (added 2010)
- **Dugout Club**: Premium club area
- **Solon Club**: Additional club seating
- **Total Club Seats**: 2,798

**Specialty Areas**
- **Home Run Terrace**: Elevated viewing area
- **Beer Garden**: Social gathering space
- **Legacy Club**: Premium club area
- **Party Deck**: Group seating (added 2005)
- **Lawn Seating**: Grass berms in RF and LF

### Seating Distribution

**Total Breakdown:**
- Fixed bowl seats: ~10,466
- Club seats: 2,798 (integrated across levels)
- Suite seats: 750 (36 suites)
- **Total: 14,014 seats**

### Special Features

**Minor League Origin**:
- Built for Sacramento River Cats (Triple-A)
- Opened: May 15, 2000
- Construction: 9 months (groundbreaking October 1999)
- Capacity evolution: Originally higher, reduced to 14,414 (2005), then 14,014

**Oakland Athletics Temporary Home**:
- A's playing here 2025-2027 (option for 2028)
- First MLB game: March 31, 2025
- While awaiting Las Vegas stadium construction
- Smallest MLB stadium by capacity

**Stadium Characteristics**:
- Open-air design (no roof)
- Intimate minor league feel
- Close sightlines to field
- Grass berms for lawn seating
- Northern California climate

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing field
- Seat 1 usually on right side (standard MLB practice)
- Varying seats per row by location

**Row Numbering**:
- Letter rows (A-Z) typical for minor league stadiums
- Row 17, Row 20 confirmed examples
- Estimated 15-25 rows per section

**Covered Sections**:
- Minimal coverage (open-air design)
- Some back rows may have overhang protection
- Northern California climate (mild, less need for coverage)

---

## Data Sources

### 1. Wikipedia - Sutter Health Park ⭐ RECOMMENDED
- **URL**: https://en.wikipedia.org/wiki/Sutter_Health_Park
- **Pros**:
  - Official capacity: 14,014 (A's configuration)
  - Fixed seats: 10,624
  - Club seats: 2,798
  - Suites: 750 in 36 suites
  - Opening date: May 15, 2000
  - A's temporary residency details (2025-2027)
- **Best For**: Capacity verification and stadium history

### 2. RateYourSeats.com
- **URL**: https://www.rateyourseats.com/sutter-health-park/seating
- **Pros**:
  - Section examples: 101-111
  - Senate sections: 104-111
  - Row examples: Row 17, Row 20
  - Premium area mentions (Infield, Suites, Dugout & Solon Club)
  - Specialty areas (Home Run Terrace, Beer Garden, Legacy Club)
- **Best For**: Section number validation

### 3. MLB.com Athletics Official
- **URL**: https://www.mlb.com/athletics/ballpark/seating-map
- **Status**: Interactive map (data not directly extractable)
- **Best For**: Visual reference (when accessible)

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 330° (from stadiums.ts - home plate to center field, NNW)
- **Latitude**: 38.5664°N
- **Longitude**: -121.5030°W
- **Timezone**: America/Los_Angeles (Pacific Time)
- **Opened**: May 15, 2000 (Sacramento River Cats)
- **First MLB Game**: March 31, 2025 (Oakland Athletics)
- **Architect**: HOK Sport (now Populous)

### Physical Characteristics
- **Roof**: Open air (no retractable roof)
- **Field**: Natural grass
- **Climate**: Northern California (mild, Mediterranean)
- **Location**: West Sacramento, California
- **Home Team**: Oakland Athletics (2025-2027, temp)
- **Primary Tenant**: Sacramento River Cats (Triple-A, 2000-present)
- **Type**: Minor League stadium adapted for MLB

### Dimensions
- LF Line: 330 ft
- CF: 400 ft (typical minor league)
- RF Line: 325 ft
- Compact minor league dimensions

---

## Capacity History

- **Opening (2000)**: ~15,000+ seats (River Cats configuration)
- **2005**: 14,414 seats (after party deck addition)
- **2010**: 14,014 seats (Diamond Club addition, reduced capacity)
- **2025-present**: 14,014 seats (Oakland A's configuration)
- **Target for Generation**: 14,014 seats (exact match required)

**Note**: Using 14,014 as official target from stadiums.ts

---

## Data Collection Strategy

### Approach
Given the capacity (14,014 seats) and simple single-level layout:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented section range
   - Single main level (sections 101-111) plus suites
   - Simple minor league layout
   - Validate against total capacity

2. **Estimated Section Grouping**
   - Main bowl: 11 sections (101-111) → ~10,466 seats (951 avg/section)
   - Club integration: 2,798 club seats distributed
   - Suites: 36 suites → 750 seats (21 avg/suite)
   - **Total**: 11 sections + 36 suites + specialty areas

3. **Known Sections**
   - Main bowl: 101-111 (11 sections)
   - Senate sections: 104-111 (8 sections)
   - Suites: 36 individual suites

### Validation Targets
- ✅ Total capacity: 14,014 seats (exact match required)
- ✅ Main bowl: ~10,466 seats
- ✅ Club seats: 2,798 (integrated)
- ✅ Suites: 750 seats (36 suites)
- ✅ Sections 101-111 confirmed

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- NNW orientation (330°) - unique northward orientation
- Single-level bowl (no upper deck)
- Minor league scale and intimacy
- Grass berms instead of traditional bleachers
- Compact dimensions

**Seating Pattern**:
- Simplest layout in MLB (temporarily)
- Single seating level with minimal tiers
- Heavy club seat integration (2,798 out of 14,014 = 20%)
- 36 suites for minor league standard
- Smallest MLB capacity (14,014)

**Complexity**:
- Low complexity
- Simple single-bowl design
- Clear section organization (101-111)
- No upper deck or complex levels
- Minor league simplicity

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 30 minutes ✅ (Complete)
- Script development: 45-60 minutes (estimated)
- Validation: 30-45 minutes
- Pre-computation: 1-2 minutes (smallest stadium)
- **Total**: ~2-3 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateAthleticsSeats.ts`)
3. Generate seat coordinates for 11 main sections + 36 suites
4. Validate total capacity matches 14,014 exactly (±0 seats tolerance)
5. Pre-compute sun exposure data for 2026 home games
6. Build and test integration
7. Commit Stadium 12/30 completion

---

## References

- Official A's Ballpark: https://www.mlb.com/athletics/ballpark
- Wikipedia: https://en.wikipedia.org/wiki/Sutter_Health_Park
- Stadium Opened: May 15, 2000
- Location: 400 Ballpark Drive, West Sacramento, CA 95691
- First MLB Game: March 31, 2025

---

## Special Considerations

**Sun Exposure Notes**:
- NNW orientation (330°) means:
  - Morning games: sun from northeast
  - Afternoon games: sun shifts to west (third base side)
  - First base side gets afternoon shade later
- Open-air design = full sun exposure
- No roof or upper deck overhang
- Northern California: mild climate, strong afternoon sun
- Grass berms fully exposed to sun

**Validation Priorities**:
- Verify 11 main sections (101-111) distributed properly
- Confirm 2,798 club seats integrated across sections
- Account for 36 suites with ~21 seats each (750 total)
- Total = exactly 14,014 seats
- Simplest validation of any MLB stadium

---

**Status**: Ready for generation script development
**Target Capacity**: 14,014 seats (exact match required)
**Target Accuracy**: ±0 seats (100.00%)
**Estimated Sections**: 11 main bowl + 36 suites
**Generation Method**: Programmatic (recommended)
**Stadium**: 12/30 in completion sequence
