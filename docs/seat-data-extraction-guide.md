# Manual Seat Data Extraction Guide

## Overview

This guide explains how to manually extract accurate seat data from interactive seating charts for all 30 MLB stadiums. This is the only reliable way to get 100% accurate seats-per-row counts.

## Best Interactive Seating Chart Sources

### Primary Sources (Recommended)

1. **SeatGeek** - https://seatgeek.com/venues/[stadium-name]/seating-chart
   - Click on any section to see row labels and seat numbers
   - Shows highest seat number in each row when hovering
   - Best for seeing actual seat inventory

2. **RateYourSeats** - https://www.rateyourseats.com/[stadium-name]/seating/sections
   - Lists all sections with row information
   - Click individual sections for detail
   - Shows row ranges (e.g., "Rows A-Z")

3. **Official MLB Team Sites** - https://www.mlb.com/[team]/ballpark
   - Sometimes have interactive maps
   - Most accurate section names

### Secondary Sources

4. **TickPick** - https://www.tickpick.com/[stadium]-seating-chart/
5. **Vivid Seats** - https://www.vividseats.com/[stadium]-tickets/venue/
6. **StubHub** - https://www.stubhub.com/[stadium]-tickets/

## Data Extraction Process

### Step 1: Open the Interactive Seating Chart

Go to SeatGeek or RateYourSeats for your target stadium.

### Step 2: For Each Section, Record:

| Field | How to Find |
|-------|-------------|
| **Section ID** | Listed on the chart (e.g., "101", "FB1", "1DG") |
| **Section Name** | Full name shown when clicking (e.g., "Field Box 101") |
| **Level** | Usually indicated by color or grouping (field/lower/club/upper/suite) |
| **First Row** | Click section, note the first row letter/number (e.g., "Row A" or "Row 1") |
| **Last Row** | Click section, scroll to find last row (e.g., "Row Z" or "Row 30") |
| **Total Rows** | Count from first to last row |
| **Seats in Row 1** | Click Row 1, count seat numbers or note highest seat # |
| **Seats in Last Row** | Click last row, count seats (often different from row 1) |
| **Average Seats/Row** | (Row 1 seats + Last row seats) / 2 |

### Step 3: Use This Template

Create a spreadsheet with these columns:

```
Stadium | Section ID | Section Name | Level | First Row | Last Row | Total Rows | Seats Row 1 | Seats Last Row | Avg Seats/Row | Total Seats | Notes
```

### Step 4: Calculate Totals

- Sum all section totals
- Compare to official stadium capacity
- Variance should be <5%

## Example: Extracting Tropicana Field Section 107

1. Go to: https://seatgeek.com/venues/tropicana-field/seating-chart
2. Click on Section 107
3. Note it shows: "Dex Imaging Home Plate Club"
4. Click through rows to find:
   - First Row: D
   - Last Row: J
   - Total Rows: 7 (D, E, F, G, H, I, J)
5. Click Row D, count seats: Seat 1 to Seat X (record highest #)
6. Click Row J, count seats: May differ from Row D
7. Record average and calculate total

## Tips for Efficiency

1. **Work by level** - Do all 100-level sections first, then 200-level, etc.
2. **Use patterns** - Many stadiums have consistent row counts within a level
3. **Take screenshots** - Document as you go for reference
4. **Cross-reference** - Verify with another source for key sections
5. **Note anomalies** - Some sections have odd configurations (wheelchair areas, etc.)

## Stadium-Specific Notes

### Domed Stadiums (roof: 'fixed')
- Tropicana Field, Rogers Centre (when closed), Minute Maid (when closed)
- All sections should be marked `covered: true`
- Sun exposure will always be 0%

### Retractable Roof Stadiums
- Chase Field, Globe Life Field, LoanDepot Park, Minute Maid Park, T-Mobile Park, Rogers Centre, American Family Field
- Check if roof is typically open or closed for day games
- May need separate covered/uncovered configurations

### Unique Sections to Watch For
- **Green Monster (Fenway)** - Unusual row configuration
- **Bleachers** - Often bench seating, count differently
- **Standing Room Only** - May not have seat numbers
- **Party Decks** - Often group/flexible seating
- **Suites** - Usually excluded from general capacity

## Data Format for This Project

After extraction, format data for `src/data/stadiumSections-split/[team].ts`:

```typescript
{
  id: '107',
  name: 'Dex Imaging Home Plate Club 107',
  level: 'field',
  baseAngle: 355,  // existing value
  angleSpan: 10,   // existing value
  covered: true,   // true for domes/covered sections
  rows: 7,         // FROM YOUR EXTRACTION
  seatsPerRow: 18, // FROM YOUR EXTRACTION (average)
  distanceFromField: 50, // estimated based on level
  rowLabels: ['D', 'E', 'F', 'G', 'H', 'I', 'J'], // optional but helpful
}
```

## Validation Checklist

After extracting all sections for a stadium:

- [ ] Total seats within 5% of official capacity
- [ ] All section IDs are unique
- [ ] All rows have positive seat counts
- [ ] Level assignments make sense
- [ ] Covered sections are marked correctly

## Time Estimate

Per stadium: 30-60 minutes depending on complexity
- Simple stadiums (fewer sections): 30 min
- Complex stadiums (many levels/sections): 60 min
- 30 stadiums total: 15-30 hours

## Priority Order

Start with the stadiums that have the worst current data:

1. Rays (Tropicana Field) - 364% over
2. Royals (Kauffman Stadium) - 133% over
3. Pirates (PNC Park) - 129% over
4. Twins (Target Field) - 126% over
5. Tigers (Comerica Park) - 112% over
6. Guardians (Progressive Field) - 97.5% over
7. Rangers (Globe Life Field) - 77.7% over
8. Brewers (American Family Field) - 73.7% over
9. ... continue with remaining stadiums

## Output Files

After extraction, update:
1. `src/data/stadiumSections-split/[team].ts` - Add rows, seatsPerRow, distanceFromField
2. Run: `npx tsx scripts/generateSeatDataForStadium.ts [team]`
3. Verify generated seat count matches your extraction total
