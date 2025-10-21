# Data Collection Guide - Dodger Stadium Seat Data

**Purpose**: Step-by-step guide for collecting and formatting seat data for import
**Target Stadium**: Dodger Stadium (Template for all 30 MLB stadiums)
**Date**: 2025-10-21

---

## Overview

This guide walks through collecting seat data from interactive seating charts and formatting it for automated import into the MLB Sun Tracker system.

### Process Summary:
1. **Collect** - Browse seating charts, document section data
2. **Format** - Enter data into CSV template
3. **Import** - Run script to generate 3D coordinates
4. **Validate** - Verify accuracy with validation script
5. **Deploy** - Commit TypeScript files to repository

---

## Step 1: Data Collection

### Tools Needed:
- Web browser
- Spreadsheet software (Excel, Google Sheets, Numbers)
- CSV template (see below)
- Notepad for observations

### Recommended Workflow:

#### Session Planning
- **Goal**: Collect 60-80 sections per session
- **Duration**: 3-4 hours per session
- **Sessions**: 2-3 sessions to complete all ~120 sections

#### Collection Sequence:
1. **Field Level** (Sections 1-25) - Start here
   - Highest value for sun exposure calculations
   - Most complex seating (varied row counts)

2. **Loge Level** (Sections 100-169) - Largest volume
   - Most consistent layout
   - Majority of stadium capacity

3. **Reserve Level** (Sections 1RS-52RS)
   - Upper deck sections
   - Wider sections (more seats per row)

4. **Pavilions** (Sections 300s)
   - Outfield bleachers
   - Simpler layout

5. **Top Deck** (Sections 1TD-13TD)
   - Highest and most affordable
   - Good views despite distance

### Data Collection per Section:

**Open**: RateYourSeats.com Dodger Stadium page

**For Each Section**:

1. **Navigate to Section** (e.g., "Field Box 1" or "Loge 120")

2. **Record Section Info**:
   - Section ID: `1` (just the number/identifier)
   - Section Name: `Field Box 1` (full name)
   - Level: `field` | `lower` | `club` | `upper` | `suite`

3. **Document Rows**:
   - Row Labels: `A,B,C,D,E,F,G,H,I,J` (comma-separated)
   - Count: `10` (total rows)

4. **Count Seats Per Row**:
   - Look at interactive map or zoom view
   - Count left-to-right (but remember seat 1 is on right!)
   - Example: Row A has 8 seats, Row B has 8 seats, etc.
   - If all rows same: `8` (single number)
   - If varies: `8,8,8,10,10,10,8,8` (comma-separated, one per row)

5. **Note Coverage**:
   - Covered: `true` | `false`
   - If partial: Note which rows (e.g., "Rows M-Z covered")

6. **Estimate Angle**:
   - Behind home plate: `0°`
   - First base side: `45-90°`
   - Outfield: `180°`
   - Third base side: `270-315°`
   - (Import script will calculate precise angles)

7. **Accessibility**:
   - Note if section has wheelchair seats
   - Record row if specified (e.g., "Row A")

---

## Step 2: CSV Format

### Template Structure

```csv
section_id,section_name,level,rows,seats_per_row,covered,partial_coverage,covered_rows,base_angle,angle_span,price_tier,wheelchair_rows,notes
1,Field Box 1,field,"A,B,C,D,E,F,G,H",8,false,,,45,10,premium,,Great view behind home
120,Loge Box 120,lower,"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X",8,false,,,90,8,moderate,,First base side
15RS,Reserve 15,upper,"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20","22,22,22,22,22,22,22,22,22,22,24,24,24,24,24,24,24,24,24,24",false,,,135,12,value,,
305,Left Field Pavilion 305,field,"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15",28,true,partial,"11,12,13,14,15",180,15,value,,Covered back rows only
```

### Column Definitions:

| Column | Required | Format | Example | Description |
|--------|----------|--------|---------|-------------|
| `section_id` | ✅ Yes | String | `1`, `120`, `15RS` | Unique identifier |
| `section_name` | ✅ Yes | String | `Field Box 1` | Full section name |
| `level` | ✅ Yes | Enum | `field`, `lower`, `upper` | Seating level |
| `rows` | ✅ Yes | Quoted CSV | `"A,B,C,D"` | Row labels, comma-separated |
| `seats_per_row` | ✅ Yes | Number or Quoted CSV | `8` or `"8,8,10,10"` | Seats per row |
| `covered` | ✅ Yes | Boolean | `true`, `false` | Permanent roof coverage |
| `partial_coverage` | ⚪ Optional | Boolean | `true`, `false` | Some rows covered |
| `covered_rows` | ⚪ Optional | Quoted CSV | `"M,N,O,P"` | Which rows are covered |
| `base_angle` | ✅ Yes | Number | `45`, `90`, `180` | Degrees from home (0-360) |
| `angle_span` | ✅ Yes | Number | `8`, `10`, `15` | Degrees section spans |
| `price_tier` | ⚪ Optional | Enum | `value`, `moderate`, `premium`, `luxury` | Price category |
| `wheelchair_rows` | ⚪ Optional | Quoted CSV | `"A,B"` | Rows with wheelchair seats |
| `notes` | ⚪ Optional | String | `Great view!` | Any special notes |

### Important CSV Rules:

1. **Quote comma-separated values**: `"A,B,C,D"` not `A,B,C,D`
2. **No spaces after commas** inside quotes: `"A,B,C"` not `"A, B, C"`
3. **Empty fields**: Leave blank, don't use NULL or N/A
4. **Boolean**: Use lowercase `true` or `false`
5. **Numbers**: No quotes, just digits: `45` not `"45"`
6. **Seat counts**: If all rows same, use single number: `8`
7. **Seat counts**: If varies by row, use quoted CSV: `"8,8,10,10,8,8"`

---

## Step 3: Import Process

### Prerequisites:
- CSV file completed and saved
- Node.js and TypeScript installed
- Project cloned and dependencies installed

### Run Import Script:

```bash
cd /Users/sygrovefamily/mlb-sun-tracker
npm run import-seat-data -- --stadium=dodger-stadium --csv=path/to/your-data.csv
```

### What the Script Does:

1. **Parse CSV** - Read and validate CSV format
2. **Generate Config** - Create `SeatGenerationConfig` for each section
3. **Calculate Coordinates** - Use `generateSeatPositions()` to create 3D positions
4. **Export TypeScript** - Generate `.ts` files in `/src/data/seatData/dodger-stadium/sections/`
5. **Update Metadata** - Update stadium metadata with totals

### Output Example:

```
✅ Parsed 120 sections from CSV
✅ Validated all sections (0 errors, 3 warnings)
⚙️  Generating seat coordinates for Field Box 1...
⚙️  Generating seat coordinates for Loge Box 120...
...
✅ Generated 56,234 seats across 120 sections
✅ Exported 120 TypeScript files
✅ Updated metadata.ts
⚠️  Warning: Total seats (56,234) slightly exceeds official capacity (56,000)
   This is acceptable (within 1% tolerance)
```

---

## Step 4: Validation

### Run Validation Script:

```bash
npm run validate-stadium-data -- --stadium=dodger-stadium
```

### Validation Checks:

1. **Capacity Match** ✅
   - Total seats should equal 54,656-56,000
   - Tolerance: ±1% (500-600 seats)

2. **No Duplicate Seat IDs** ✅
   - Each seat ID must be unique
   - Format: `dodger-stadium-{sectionId}-{row}-{seatNum}`

3. **Coordinate Bounds** ✅
   - X: -500 to 500 feet (reasonable stadium width)
   - Y: -500 to 500 feet (reasonable stadium depth)
   - Z: 0 to 150 feet (field to top deck)

4. **Distribution Totals** ✅
   - Sum of all seat types equals total seats
   - Standard + aisle + wheelchair + companion = total

5. **Section Continuity** ⚠️
   - Check for missing sections in sequence
   - Flag unusual gaps

### Validation Report Example:

```
📊 Dodger Stadium Validation Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PASSED: Capacity Check
   Total Seats: 56,234
   Official Capacity: 56,000
   Difference: +234 seats (+0.4%)
   Status: Within acceptable tolerance

✅ PASSED: Unique Seat IDs
   Total IDs: 56,234
   Unique IDs: 56,234
   Duplicates: 0

✅ PASSED: Coordinate Bounds
   X Range: -380.5 to 380.5 ft
   Y Range: -420.0 to 420.0 ft
   Z Range: 10.0 to 125.0 ft
   Status: All within bounds

✅ PASSED: Distribution Totals
   Standard: 52,890
   Aisle: 2,640
   Wheelchair: 420
   Companion: 284
   Total: 56,234 ✅

⚠️  WARNING: Section Gaps
   Missing: 26-99 (expected Field sections)
   Note: This is normal (Field sections 1-25, Loge starts at 100)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULT: ✅ VALIDATION PASSED (1 warning)
Ready for deployment!
```

---

## Step 5: Manual Verification

### Spot Checks:

**Pick 5-10 random sections and verify**:

1. Open section on RateYourSeats
2. Check generated TypeScript file
3. Verify:
   - Row count matches
   - Seat count matches
   - Row labels match
   - Total seats for section matches

### Example Verification:

**Section**: Field Box 1

**From RateYourSeats**:
- Rows: A through H (8 rows)
- Seats per row: 8
- Total: 64 seats

**From Generated File** (`field-box-1.ts`):
```typescript
totalSeats: 64, ✅
totalRows: 8, ✅
rows: [
  { rowNumber: 'A', seatCount: 8 }, ✅
  { rowNumber: 'B', seatCount: 8 }, ✅
  ...
  { rowNumber: 'H', seatCount: 8 }  ✅
]
```

**Result**: ✅ Matches perfectly

---

## Step 6: Deployment

### Commit Generated Files:

```bash
git add src/data/seatData/dodger-stadium/
git commit -m "Add complete seat data for Dodger Stadium (56,234 seats across 120 sections)"
git push origin seat-level
```

### Update Documentation:

Update `/src/data/seatData/dodger-stadium/metadata.ts`:
- Change `validated: false` → `validated: true`
- Update `sectionsComplete`, `seatsComplete` counts
- Add `validationDate: '2025-10-21'`

---

## Tips & Best Practices

### Data Collection:
1. **Work in batches** - 60-80 sections per session
2. **Cross-reference** - Use 2+ sources when unsure
3. **Take breaks** - Accuracy decreases with fatigue
4. **Document oddities** - Use notes column for unusual layouts

### Accuracy:
1. **Exact row labels** - Preserve casing and format (A vs a)
2. **Count carefully** - Seat counts are critical
3. **Note irregularities** - Tapered sections, obstructed views
4. **Verify totals** - Section should match published capacity

### Efficiency:
1. **Use keyboard shortcuts** - Speed up data entry
2. **Copy similar sections** - Many sections have identical row layouts
3. **Work by level** - Field level sections often similar
4. **Validate incrementally** - Run import after each 20-30 sections

### Common Errors:
1. ❌ **Forgetting quotes** - `"A,B,C"` not `A,B,C`
2. ❌ **Extra spaces** - `"A,B"` not `"A, B"`
3. ❌ **Wrong level** - Field vs field, lower vs Lower
4. ❌ **Off-by-one** - Counting rows: A-H is 8 rows, not 7
5. ❌ **Seat numbering** - Remember Dodger seats go right-to-left!

---

## Troubleshooting

### "CSV Parse Error"
- Check for missing quotes around comma-separated values
- Ensure no extra commas at end of lines
- Verify column count matches header

### "Validation Failed: Capacity Mismatch"
- Recount total seats manually
- Check for duplicated sections
- Verify each row's seat count

### "Coordinate Out of Bounds"
- Check base_angle (should be 0-360)
- Verify angle_span (typically 5-20 degrees)
- Ensure level is valid enum value

### "Duplicate Seat ID"
- Check for duplicate section IDs
- Verify no duplicate row labels within section
- Ensure seat numbers are unique per row

---

## Next Steps After Data Collection

1. ✅ Complete CSV data collection (this guide)
2. ⏳ Run import script
3. ⏳ Validate data
4. ⏳ Build UI components (Phase 3)
5. ⏳ Pre-compute sun exposure (Phase 2.3)
6. ⏳ Scale to 29 more stadiums

---

## Templates & Examples

See companion files:
- `example-section-template.csv` - Sample CSV with 5 example sections
- `DODGER-STADIUM-DATA-SOURCES.md` - Detailed source list
- `/scripts/importSeatData.ts` - Import script source code
- `/scripts/validateStadiumData.ts` - Validation script source code

---

**Created**: 2025-10-21
**For**: MLB Sun Tracker - Phase 7.2.1
**By**: Seat-Level Implementation Team
