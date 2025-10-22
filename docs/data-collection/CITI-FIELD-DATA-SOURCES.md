# Citi Field Seating Data Sources

**Last Updated**: 2025-10-21
**Official Capacity**: 41,922 seats
**Sections**: ~200+ sections across 5 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**Field Level (100s)**
- Sections: 1-19, 101-143
- Premium Delta Club: Sections 11-19
- Metropolitan Club: Sections 111-114, 121-124
- Hyundai Club: Sections 115-120 (behind home plate)
- Field Gold: Sections 109-110, 124-125 (rows A-B)
- Field Silver: Sections 109-110 (rows C-E, 1-6)
- Field Box: Rows 7-34
- Baseline Boxes: Sections 104-108, 127-132
- Typical rows: 10-20 per section
- Seats per row: 2-36 (varies widely)
- Closest to field

**Excelsior Level (200s)**
- Sections: 212-228 (center), corner sections
- Only 1 row per section
- Mid-level seating with excellent views
- Premium viewing angle

**Promenade Level (300s)**
- Center sections: 316-322 (rows 1-7)
- Corner sections: 327-331, 308-311 (rows 1-12)
- End sections: 312-315, 322-326 (rows 1-7)
- Upper deck seating
- Good sight lines despite height

**400 Level (Upper Deck)**
- Center sections: 411-418 (rows 1-8)
- Corner sections: 405-410, 419-424 (rows 1-8)
- End sections: 401-404, 425-437 (rows 1-8)
- More affordable seating
- Typically 8 rows per section

**500 Level (Highest)**
- Typical rows: 1-17 per section
- Most affordable seats
- Covered by overhang

### Special Sections

**Premium Clubs**
- Delta Club 360: Sections 11-19 (full-service premium)
- Hyundai Club: Sections 115-120 (behind home plate)
- Metropolitan Club: Sections 111-114, 121-124
- Sterling Suites: Behind home plate, above Delta Club
- Excelsior Club: Various sections on Excelsior level

**Specialty Areas**
- Big Apple Reserved: Outfield seating
- Coca-Cola Corner: Right field area
- Clover Home Plate Club: Premium behind plate
- Empire Club: Premium access
- Baseline Club: Premium baseline seating
- Citi Pavilion: Group seating area
- Standing Room Only: Various locations

### Seating Conventions

**Seat Numbering**:
- Seats typically number from RIGHT to LEFT when facing the field
- Seat 1 usually closer to higher numbered adjacent section
- Lowest seat count in a row: 2 (Row 5, Section 101)
- Highest seat count in a row: 36 (Row 1, Section 143)

**Row Numbering**:
- Field level: Numbers (1-34) or Letters (A-Z)
- 200 level: Typically only 1 row per section
- 300 level: 1-12 rows depending on location
- 400 level: 1-8 rows
- 500 level: 1-17 rows

**Covered Sections**:
- 500 level sections fully covered by upper deck overhang
- Some 400 level sections partially covered
- Provides shade but may obstruct views of fly balls
- Better protection from weather

---

## Data Sources

### 1. Interactive Seating Chart Websites

#### MLB.com Mets Official ⭐ RECOMMENDED
- **URL**: https://www.mlb.com/mets/ballpark/seat-map
- **Pros**:
  - Official Mets source
  - Interactive seat map
  - Accurate section numbering
  - View from seat perspectives
- **Cons**: Dynamic content, requires interaction
- **Best For**: Authoritative section layout

#### MapaPlan.com ⭐ RECOMMENDED
- **URL**: https://www.mapaplan.com/seating-plan/new-york-citi-field-mets-stadium-detailed-interactive-seat-row-numbers-chart-plan/new-york-citi-field-mets-stadium-seating-chart-plan.htm
- **Pros**:
  - Extremely detailed interactive chart
  - Shows seat and row numbers
  - Section-by-section breakdown
  - Complete venue coverage
- **Cons**: May require manual exploration
- **Best For**: Detailed row/seat validation

#### RateYourSeats.com
- **URL**: https://www.rateyourseats.com/citi-field/seating/sections
- **Pros**:
  - Detailed section-by-section views
  - User photos from actual seats
  - Row and seat number information
  - Reviews for quality assessment
- **Cons**: Requires manual browsing
- **Best For**: Seat-level validation and photos

#### TickPick.com
- **URL**: https://www.tickpick.com/blog/new-york-mets-seating-chart-with-seat-views/
- **Pros**:
  - Interactive seating chart
  - Row and seat references
  - View from seat photos
- **Cons**: Less technical detail
- **Best For**: Visual validation

#### TicketIQ / Blog.TicketIQ.com
- **URL**: https://blog.ticketiq.com/blog/citi-field-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Comprehensive level breakdown
  - Club seat details
  - Row count information by level
- **Cons**: May not be fully up-to-date
- **Best For**: Level organization understanding

#### AViewFromMySeat.com
- **URL**: https://aviewfrommyseat.com/venue/Citi+Field/seating-chart/baseball/
- **Pros**:
  - User-submitted photos
  - Organized by section
  - Real viewing perspectives
  - Timestamp data on many photos
- **Cons**: Not all sections may have photos
- **Best For**: View quality validation and photo reference

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 90° (from stadiums.ts - home plate to center field)
- **Latitude**: 40.7571°N
- **Longitude**: -73.8458°W
- **Timezone**: America/New_York (Eastern Time)
- **Opened**: 2009 (modern stadium, replaces Shea Stadium)

### Physical Characteristics
- **Roof**: Open air
- **Climate**: Hot summers, cold springs/falls
- **Location**: Queens, New York
- **Home Team**: New York Mets
- **Unique Features**:
  - Home Run Apple (center field)
  - Jackie Robinson Rotunda (main entrance)
  - Shea Stadium Memorial
  - Mt. Fuji-inspired design elements

---

## Data Collection Strategy

### Approach
Given the capacity (~41,922 seats) and well-organized structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented patterns
   - Five distinct levels with clear numbering schemes
   - Modern stadium with consistent layout
   - Validate against official sources

2. **Section Grouping**
   - Field Level: ~60 sections (1-19, 101-143)
   - 200 Level: ~20 sections (212-228 + corners)
   - 300 Level: ~30 sections (308-331)
   - 400 Level: ~40 sections (401-437)
   - 500 Level: ~40 sections (501-538)
   - Premium/Club: Multiple specialty sections

### Validation Targets
- ✅ Total capacity: 41,922 seats (official)
- ✅ ~190-200 sections
- ✅ Varying seats/row (2-36 range documented)
- ✅ 1-34 rows/section depending on level
- ✅ Premium clubs, field boxes, standing room

---

## Key Differences from Other Stadiums

**Stadium Layout**:
- Modern design (2009)
- Five distinct levels (more than most)
- Unique 200-level with single rows
- Extensive club/premium seating
- Smaller capacity than Dodger Stadium (41,922 vs 56,000)

**Seating Pattern**:
- Consistent modern numbering
- Wide variation in seats per row (2-36)
- Different row patterns per level
- Extensive premium seating integration

**Complexity**:
- Moderate complexity
- Many small premium sections
- Five-level structure adds organization
- Newer stadium = better documentation

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 3 hours ✅ (Complete)
- Script development: 5-7 hours (estimated)
- Validation: 2 hours
- Photo collection: 3-4 hours
- Real-world validation: 3-4 hours
- **Total**: ~16-20 hours

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateMetsSeats.ts`)
3. Generate seat coordinates for all ~190-200 sections
4. Validate total capacity matches 41,922 ±0.1% (±42 seats tolerance)
5. Enhance obstruction data (overhangs, roof structures)
6. Collect 100+ timestamped validation photos
7. Pre-compute sun exposure data for 2026 home games
8. Build and test integration
9. Achieve 95+ accuracy score

---

## References

- Official Mets Ballpark Info: https://www.mlb.com/mets/ballpark
- Seating Capacity: 41,922 (official current capacity)
- Stadium Opened: April 13, 2009
- Previous Stadium: Shea Stadium (1964-2008)
- Location: 123-01 Roosevelt Avenue, Queens, NY 11368

---

## Special Considerations

**Sun Exposure Notes**:
- East-facing orientation means afternoon sun in right field
- Left field seats get evening sun
- 500-level fully covered (no direct sun exposure)
- Premium clubs mostly indoor/covered
- Field level exposed throughout day games

**Validation Priorities**:
- Focus on 100s level (most variable seat counts)
- Verify 200s level single-row structure
- Validate premium section boundaries
- Confirm covered vs uncovered sections
- Check standing room areas

---

**Status**: Ready for generation script development
**Target Capacity**: 41,922 seats
**Target Accuracy**: ±0.1% (within 42 seats)
**Estimated Sections**: ~190-200
**Generation Method**: Programmatic (recommended)
