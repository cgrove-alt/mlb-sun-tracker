# Busch Stadium Seating Data Sources

**Last Updated**: 2025-10-21
**Official Capacity**: 44,494 seats (official) / ~50,228 (ticketing capacity)
**Sections**: ~200+ sections across 4 main levels
**Status**: Research Complete - Ready for Data Generation

---

## Stadium Organization

### Level Structure

**100 Level (Field Level / Lower Deck)**
- Sections: 101-172 (approximate range)
- Infield premium sections
- Dugout Boxes: 132-139 (Cardinals), 161-166 (Visitors)
- Green Seats: Premium behind home plate
- Typical rows: 10-20 per section
- Seats per row: 8-14 (infield), varies by location
- Closest to field

**200 Level (Club Level / Mezzanine)**
- Sections: 241-257 (Club sections documented)
- Mid-level seating with club amenities
- Typical rows: 10-20 per section
- Seats per row: ~16 average
- Premium viewing angle

**300 Level (Upper Deck)**
- Sections: ~300 range
- More affordable seating
- Typical rows: 10-20 per section
- Seats per row: 5-30 (varies widely)
- Good sight lines despite height

**400 Level (Terrace Level)**
- Sections: 428-454 (documented range)
- Highest level of seating
- Located along right field line wrapping to near 3rd base
- Seats per row: 10-30
- Most affordable seats

### Special Sections

**Field Boxes**
- Field A1-A7 (infield field level)
- Field B2-B7 (infield field level)
- Premium closest-to-field seating

**Club Sections**
- Budweiser 703 Club: Sections A-F
- UMB Champions Club: Sections 1-9
- Premium amenities and access

**Specialty Areas**
- Budweiser Terrace: Right field
- Family Plaza: Center field
- Freese's Landing: Special seating area
- Standing Room areas: Various locations

### Seating Conventions

**Seat Numbering**:
- Seats number from RIGHT to LEFT when facing the field
- Seat 1 is closer to the HIGHER numbered adjacent section
- Example: In Section 145, Seat 1 is on the aisle next to Section 146
- Highest seat number is on the aisle next to the lower numbered section

**Row Numbering**:
- Varies by section and level
- Field/Club levels: Typically letters (A-Z)
- Upper levels: May use numbers
- Typical: 10-20 rows per section
- Some sections have wheelchair accessible rows

**Covered Sections**:
- Some sections have overhang coverage from upper decks
- Generally sections under 200-level overhang
- Provides shade but may obstruct foul ball views
- Sharp angles in corner sections

---

## Data Sources

### 1. Interactive Seating Chart Websites

#### MLB.com Cardinals Official ⭐ RECOMMENDED
- **URL**: https://www.mlb.com/cardinals/ballpark/seat-map
- **Pros**:
  - Official Cardinals source
  - 3D interactive seat map
  - Accurate section numbering
  - View from seat perspectives
- **Cons**: May not show all seat-level details
- **Best For**: Authoritative section layout

#### MapaPlan.com ⭐ RECOMMENDED
- **URL**: https://www.mapaplan.com/seating-plan/st-louis-busch-cardinals-stadium-detailed-interactive-seat-row-numbers-chart-plan/st-louis-busch-cardinals-stadium-seating-chart-plan.htm
- **Pros**:
  - Extremely detailed interactive chart
  - Shows seat and row numbers
  - Section-by-section breakdown
  - Complete venue coverage
- **Cons**: May require manual exploration
- **Best For**: Detailed row/seat validation

#### RateYourSeats.com
- **URL**: https://www.rateyourseats.com/busch-stadium/seating/seating-chart
- **Pros**:
  - Detailed section-by-section views
  - User photos from actual seats
  - Row and seat number information
  - Reviews for quality assessment
- **Cons**: Requires manual browsing
- **Best For**: Seat-level validation and photos

#### TickPick.com
- **URL**: https://www.tickpick.com/busch-stadium-seating-chart/
- **Pros**:
  - Row and seat number reference
  - Section details
  - Interactive chart
- **Cons**: Less detailed than others
- **Best For**: Quick reference

#### TicketIQ / Blog.TicketIQ.com
- **URL**: https://blog.ticketiq.com/blog/busch-stadium-seating-chart-rows-seats-and-club-seats
- **Pros**:
  - Comprehensive level breakdown
  - Club seat details
  - Seat count information
- **Cons**: May not be fully up-to-date
- **Best For**: Level organization understanding

#### AViewFromMySeat.com
- **URL**: https://aviewfrommyseat.com/venue/Busch+Stadium/seating-chart/baseball/
- **Pros**:
  - User-submitted photos
  - Organized by section
  - Real viewing perspectives
- **Cons**: Not all sections may have photos
- **Best For**: View quality validation

---

## Stadium Specifications

### Geometry & Orientation
- **Orientation**: 92° (from stadiums.ts)
- **Latitude**: 38.6226°N
- **Longitude**: -90.1928°W
- **Timezone**: America/Chicago (Central Time)
- **Opened**: 2006 (modern stadium)

### Physical Characteristics
- **Roof**: Open air
- **Climate**: Hot summers (sun exposure important)
- **Location**: St. Louis, Missouri
- **Home Team**: St. Louis Cardinals

---

## Data Collection Strategy

### Approach
Given the comprehensive capacity (~44,000-50,000 seats) and well-organized structure:

1. **Programmatic Generation** (Recommended)
   - Use algorithmic generation based on documented patterns
   - Four distinct levels with clear numbering schemes
   - Standard MLB-style stadium layout
   - Validate against official sources

2. **Section Grouping**
   - 100 Level: ~70 sections (101-172 range)
   - 200 Level: ~30 sections (241-257 club + others)
   - 300 Level: ~50 sections
   - 400 Level: ~27 sections (428-454)
   - Special: Field boxes, club sections

### Validation Targets
- ✅ Total capacity: 44,494 seats (official)
- ✅ ~200+ sections
- ✅ Average 16 seats/row
- ✅ 10-20 rows/section typically
- ✅ Field boxes, club sections, terrace level

---

## Key Differences from Dodger Stadium

**Stadium Layout**:
- More modern (2006 vs 1962)
- More uniform section sizes
- Clearer level organization
- Smaller capacity (44k vs 56k)

**Seating Pattern**:
- Same seat numbering (right to left)
- More consistent row counts
- Better documented in official sources

**Complexity**:
- Lower complexity than Dodger Stadium
- More predictable section patterns
- Fewer unique section types

---

## Estimated Data Collection Time

**Programmatic Generation Approach**:
- Research & planning: 3 hours ✅ (Complete)
- Script development: 4-5 hours (estimated)
- Validation: 1 hour
- **Total**: ~8-9 hours

**Manual CSV Approach** (if needed):
- Section-by-section data entry: 12-15 hours
- Import & validation: 1-2 hours
- **Total**: ~13-17 hours

**Recommendation**: Programmatic generation given clear patterns

---

## Next Steps

1. ✅ Research Complete
2. Create generation script (`scripts/generateBuschSeats.ts`)
3. Generate seat coordinates for all ~200 sections
4. Validate total capacity matches 44,494 ±5%
5. Pre-compute sun exposure data
6. Build and test integration
7. Quality assurance spot-checks

---

## References

- Official Cardinals Ballpark Info: https://www.mlb.com/cardinals/ballpark
- Seating Capacity: 44,494 (official)
- Stadium Opened: April 10, 2006
- Previous Stadium: Busch Stadium II (1966-2005)

---

**Status**: Ready for generation script development
**Estimated Seats**: ~44,000-45,000
**Estimated Sections**: ~200
**Generation Method**: Programmatic (recommended)
