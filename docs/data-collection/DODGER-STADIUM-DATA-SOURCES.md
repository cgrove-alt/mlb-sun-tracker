# Dodger Stadium Seating Data Sources

**Last Updated**: 2025-10-21
**Official Capacity**: 54,656 - 56,000 seats
**Sections**: ~120 sections across 4 main levels
**Status**: Research Complete - Ready for Data Collection

---

## Stadium Organization

### Level Structure

**Field Level (Sections 1-25)**
- Closest to the field
- Zone A through Zone N
- Zone A rows: AA-JJ
- Typical rows: Variable by section
- Seat count: Infield sections typically 8 seats wide (seats 1-8)

**Loge Level (100-level: Sections 100-169)**
- Mid-level seating
- Rows: A-X (24 rows typical)
- Seat count: Infield sections typically 8 seats wide (seats 1-8)
- Most popular seating area

**Reserve Level (Upper Deck: Sections 1RS-52RS)**
- Upper deck seating
- Wider sections: 19-24 seats per row
- More affordable than lower levels

**Outfield Pavilions (Sections 300s)**
- Left Field Pavilion: Sections 301-315
- Right Field Pavilion: Sections 302-316
- General admission or reserved bleacher seating

**Top Deck (Sections 1TD-13TD)**
- Highest seating level
- Most affordable seats in stadium
- Good views but farthest from field

### Seating Conventions

**Seat Numbering**:
- Seats number from **RIGHT to LEFT** when facing the field
- Seat 1 is on the far RIGHT of each section
- This is opposite of many other stadiums!

**Row Numbering**:
- Varies by section
- Field/Loge: Typically letters (A-Z, sometimes AA-JJ)
- Reserve/Top Deck: Typically numbers (1-30+)

---

## Data Sources

### 1. Interactive Seating Chart Websites

#### RateYourSeats.com ⭐ RECOMMENDED
- **URL**: https://www.rateyourseats.com/dodger-stadium/seating/seating-chart
- **Pros**:
  - Most detailed section-by-section views
  - Shows row and seat numbers
  - User reviews from actual seats
  - Photos from seats
- **Cons**: Requires manual browsing section-by-section
- **Best For**: Validating seat counts and row labels

#### SeatGeek.com
- **URL**: https://seatgeek.com/venues/dodger-stadium/seating-chart
- **Pros**:
  - Clean interactive map
  - Section hover shows details
  - View from seat photos
- **Cons**: Less detailed than RateYourSeats
- **Best For**: Quick overview and section layout

#### TickPick.com
- **URL**: https://www.tickpick.com/dodger-stadium-seating-chart/
- **Pros**:
  - Shows row and seat numbers
  - Clean layout
  - Section-by-section breakdown
- **Cons**: Some sections may be incomplete
- **Best For**: Row/seat number reference

#### SimpleSeats.com
- **URL**: https://www.simpleseats.com/dodger-stadium-seating-chart/
- **Pros**:
  - In-seat view photos
  - Interactive exploration
- **Cons**: Focus on photos, less on data
- **Best For**: View quality assessment

#### AViewFromMySeat.com
- **URL**: https://aviewfrommyseat.com/venue/Dodger+Stadium/seating-chart/
- **Pros**:
  - Extensive user-submitted photos
  - Organized by section
- **Cons**: Not structured for data extraction
- **Best For**: Visual reference

#### MapaPlan.com
- **URL**: https://www.mapaplan.com/seating-plan/los-angeles-dodger-stadium-detailed-interactive-seat-row-numbers-chart-plan/los-angeles-dodger-stadium-seating-chart-plan.htm
- **Pros**:
  - Very detailed interactive map
  - Shows individual seat positions
- **Cons**: Complex interface
- **Best For**: Detailed seat positioning

#### 3DDigitalVenue.com
- **URL**: https://venues.3ddigitalvenue.com/dodgers
- **Pros**:
  - 3D venue model
  - Good for understanding stadium geometry
- **Cons**: May not have granular seat data
- **Best For**: Obstruction and coverage mapping

### 2. Official MLB/Dodgers Sources

#### MLB.com - Stadium Guide
- **URL**: https://www.mlb.com/news/featured/dodger-stadium-guide-capacity-seating-chart-parking-and-more
- **Pros**:
  - Official information
  - Accurate capacity numbers
  - Parking and amenities
- **Cons**: Limited seat-level detail
- **Best For**: Official capacity validation

#### TheStadiumInsiders.com
- **URL**: https://thestadiuminsiders.com/stadium_guides/los-angeles-dodgers/seating-chart/
- **Pros**:
  - Comprehensive stadium guide
  - Section recommendations
- **Cons**: May not have complete seat data
- **Best For**: Context and recommendations

### 3. Ticketing Platform APIs (Requires API Access)

#### Ticketmaster API
- **API Portal**: https://developer.ticketmaster.com/
- **Relevant APIs**:
  - Discovery API (v2): Event and venue information
  - Availability API: Seat availability and inventory
  - Top Picks API: Seat recommendations with section/row/seat IDs
  - Partner API: Detailed seat reservations
- **Access**: Requires API key and partnership
- **Rate Limits**: Varies by API tier
- **Pros**:
  - Programmatic access to real-time seat data
  - Official Ticketmaster data
  - Includes section, row, seat identifiers
- **Cons**:
  - Requires business partnership for detailed access
  - API key approval process
  - May have usage limits
- **Best For**: Automated data collection (if access granted)

#### SeatGeek API
- **API Portal**: https://developer.seatgeek.com/
- **Access via**: RapidAPI (https://rapidapi.com/seatgeek/api/seatgeek)
- **Capabilities**:
  - Venue information (lat/lon, capacity)
  - Seat maps and seating location data
  - Event listings
- **Access**: Requires API key registration
- **Pros**:
  - RESTful API with JSON/JSONP/XML responses
  - Includes venue lat/lon coordinates
  - Visual seat map data
- **Cons**:
  - May require paid plan for detailed data
  - Rate limits apply
- **Best For**: Venue metadata and basic seating info

### 4. Open Data Sources

#### Kaggle - MLB Ballparks Dataset
- **URL**: https://www.kaggle.com/datasets/paulrjohnson/mlb-ballparks
- **Last Updated**: April 2023
- **Content**: Physical & environmental dimensions
- **Pros**: Free, structured dataset
- **Cons**: **Does NOT include seat-level data** - only stadium dimensions
- **Best For**: Stadium orientation and field dimensions (already have this)

#### Seamheads.com Ballparks Database
- **URL**: https://www.seamheads.com/ballparks/
- **Content**: Historical ballpark information
- **Pros**: Comprehensive historical data
- **Cons**: Not seat-level data
- **Best For**: Historical context

#### No Comprehensive Open Dataset Found
- Multiple researchers have noted the lack of premade seating datasets
- Most have resorted to manual collection from Wikipedia or venue websites
- **This confirms manual data collection is the standard approach**

---

## Recommended Data Collection Strategy

### Primary Source: RateYourSeats.com
**Why**: Most complete section-by-section data with row/seat numbers

### Validation Sources:
1. **SeatGeek** - Cross-reference section layout
2. **TickPick** - Verify row/seat counts
3. **MLB.com** - Confirm total capacity

### Process:
1. Start with Field Level sections (1-25) - most critical for sun exposure
2. Move to Loge Level (100-169) - highest volume
3. Complete Reserve Level (1RS-52RS)
4. Finish with Pavilions (300s) and Top Deck (1TD-13TD)
5. Validate total = 54,656-56,000 seats

---

## Key Data Points to Collect Per Section

### Required:
- [ ] Section ID (e.g., "1", "120", "15RS", "305", "5TD")
- [ ] Section Name (e.g., "Field Box 1", "Loge Box 120")
- [ ] Level (field, lower, club, upper, suite)
- [ ] Row labels (A-Z or 1-30)
- [ ] Seats per row (count for each row)
- [ ] Covered status (boolean)
- [ ] Base angle (degrees from home plate)

### Optional but Helpful:
- [ ] Accessibility seats (wheelchair, companion)
- [ ] Aisle seat positions
- [ ] View obstructions (poles, railings)
- [ ] Price tier (value, moderate, premium, luxury)

---

## Estimated Data Collection Time

| Section Group | Count | Time per Section | Total Time |
|---------------|-------|------------------|------------|
| Field Level (1-25) | 25 | 5 min | 2 hours |
| Loge Level (100-169) | 70 | 4 min | 4.5 hours |
| Reserve Level (1RS-52RS) | 52 | 3 min | 2.5 hours |
| Pavilions (300s) | 30 | 2 min | 1 hour |
| Top Deck (1TD-13TD) | 13 | 3 min | 40 min |
| **Total** | **~190 sections** | **Avg 3.5 min** | **~11 hours** |

**Recommendation**: Spread over 2-3 days, collect 60-80 sections per session

---

## Next Steps

1. ✅ **Research Complete** - This document
2. ⏳ **Create CSV Template** - See DATA-COLLECTION-GUIDE.md
3. ⏳ **Begin Data Collection** - Start with Field Level
4. ⏳ **Import and Validate** - Use scripts to generate coordinates
5. ⏳ **Test with UI** - Verify in application

---

## Notes

### Dodger Stadium Unique Characteristics:
- **Right-to-left seat numbering** (Seat 1 on right, not left!)
- Multiple section naming conventions (numbers, letters, RS, TD suffixes)
- Pavilions are general admission in some games
- Club areas may have different row labeling
- Some sections have irregular shapes (tapered or curved)

### Data Quality Tips:
- When in doubt, cross-reference with 2+ sources
- User reviews on RateYourSeats often mention seat numbers
- Photos can help validate row counts
- Total section capacity should sum to ~54,656-56,000

---

**Prepared for**: MLB Sun Tracker - Seat-Level Implementation
**By**: Phase 7.2.1 Research
**Date**: 2025-10-21
