# MLB Stadium Data Collection Methodology

**Created:** 2026-01-27
**Step:** 1.2 - MLB Stadium Data Research & Collection Plan
**Purpose:** Step-by-step guide for collecting accurate row-level stadium data

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Collection Setup](#pre-collection-setup)
3. [Phase 1: Stadium Research](#phase-1-stadium-research)
4. [Phase 2: Section Mapping](#phase-2-section-mapping)
5. [Phase 3: Row-Level Data](#phase-3-row-level-data)
6. [Phase 4: 3D Geometry](#phase-4-3d-geometry)
7. [Phase 5: Obstruction Modeling](#phase-5-obstruction-modeling)
8. [Phase 6: Validation & Testing](#phase-6-validation--testing)
9. [Common Patterns & Shortcuts](#common-patterns--shortcuts)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## Overview

This methodology ensures consistent, high-quality data collection across all 30 MLB stadiums. Each stadium takes approximately 9-14 hours to complete.

### Quality First Principle
**NO SHORTCUTS. NO EXCUSES. FIND THE ROOT CAUSE.**
- Always verify data from multiple sources
- When uncertain, mark for review rather than guess
- Every section must pass validation
- Accuracy > Speed

### Process Flow
```
Research → Section Mapping → Row Data → 3D Geometry → Obstructions → Validation
   2h          3h              3h           2h              3h            1h
```

---

## Pre-Collection Setup

### Tools Checklist
- [ ] Google Earth Pro installed
- [ ] Browser tabs open:
  - Team's official MLB.com seating map
  - StubHub stadium page
  - SeatGeek stadium page
  - A View From My Seat
- [ ] VS Code open with project loaded
- [ ] Validation script tested (`npm run validate-stadium-data`)

### File Preparation
1. Create section file: `src/data/sections/mlb/[stadium-name].ts`
2. Create obstruction file: `src/data/obstructions/mlb/[team-name]-obstructions.ts`
3. Use kebab-case for filenames (e.g., `yankee-stadium.ts`, `yankees-obstructions.ts`)

### Reference Materials
- Keep `template.ts` open for reference
- Have existing stadium file open (e.g., `yankees.ts`) as example
- Print or display this methodology guide

---

## Phase 1: Stadium Research (1-2 hours)

### Step 1.1: Gather Basic Information

**Sources:**
- Wikipedia: Stadium page for official data
- MLB.com: Official team ballpark information
- Ballparks.com: Historical and dimension data

**Data to Collect:**
```typescript
// Basic Info
Stadium Name: _________________
Team: _________________
City/State: _________________
Opened: _____ (year)
Capacity: _________
Latitude: __________ (Google Earth)
Longitude: __________ (Google Earth)
Orientation: ___° (Google Earth, from home plate to north)
```

### Step 1.2: Identify Section Structure

**Task:** Understand the stadium's seating layout

**Questions to Answer:**
- How many levels? (field, lower, club, upper, suites)
- What's the section numbering scheme?
  - Sequential? (100-150)
  - By level? (100s=field, 200s=club, 400s=upper)
  - Named sections? (Bleachers, Pavilion, etc.)
- Are there special seating areas?
  - Party decks, standing room, suites
  - Unique named sections
- What rows use letters vs numbers?
- Any sections with partial coverage?

**Deliverable:** Section inventory list
```
Field Level: Sections 100-136 (Rows A-N)
Club Level: Sections 200-232 (Rows 1-10)
Upper Level: Sections 400-439 (Rows 1-18)
Bleachers: Sections 201-204 (Rows 1-20)
Special: Delta Sky360 Suites, etc.
```

### Step 1.3: Download Seating Chart Images

**Sources:**
- Official MLB.com seating map (screenshot)
- Ticketing sites (StubHub, SeatGeek) for detailed views
- Google Images: "[Stadium name] seating chart"

**Save to:** Reference folder (not committed to repo)

**Requirements:**
- High resolution (readable section numbers)
- Shows full bowl from above
- Angle/orientation indicators if available

### Step 1.4: Identify Major Obstructions

**Visual Inspection (Google Earth 3D view):**
- [ ] Roof (retractable, fixed, or open)
- [ ] Upper deck overhangs
- [ ] Scoreboards/video boards
- [ ] Light towers
- [ ] Facade structures
- [ ] Canopies or awnings

**Document:**
```
Major Obstructions:
- Upper deck: Covers sections _____ to _____
- Roof/Canopy: Type _______, covers _______
- Scoreboard: Location _______, dimensions _______
```

---

## Phase 2: Section Mapping (2-3 hours)

### Step 2.1: Create Section Skeleton

**Start with file template:**

```typescript
// [Stadium Name] - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper function to generate rows
function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.5; // feet between rows vertically
  const rowDepth = 2.8; // feet between rows horizontally

  const isLetterRows = typeof startRow === 'string';

  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);

    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow - Math.floor(rowNum * 0.2), // Slight taper
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.2),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  }

  return rows;
}

export const [teamName]Sections: DetailedSection[] = [
  // Sections will be added here
];
```

### Step 2.2: Map Sections to Angles

**Goal:** Assign baseAngle and angleSpan to each section

**Method:**

1. **Determine Home Plate Position**
   - In our coordinate system, home plate is typically at angle 270° (facing 90°)
   - Verify from seating chart orientation

2. **Divide the Bowl**
   - Most stadiums: ~360° total (full bowl)
   - Some stadiums: 270-320° (missing deep outfield sections)

3. **Calculate Angles**
   - Count total sections at a given level
   - If 36 sections cover 360°: angleSpan = 10° per section
   - Start at right field (typically 0° or 10°), go counter-clockwise

**Example Calculation:**
```
Dodger Stadium Field Level: 136 sections
Right field starts at 10°
Each section spans ~5°

Section 100: baseAngle = 10°, angleSpan = 5°
Section 101: baseAngle = 15°, angleSpan = 5°
Section 102: baseAngle = 20°, angleSpan = 5°
...
```

**Sources for Verification:**
- Seating charts often show orientation (N/S/E/W markers)
- Google Earth: Measure angles from home plate
- Fan photos: Sun position reports

### Step 2.3: Determine Level Classification

**Level Types:**
- `'field'`: Ground level, close to field
- `'lower'`: First tier of elevated seating
- `'club'`: Premium mid-level (typically rows 1-10, extra amenities)
- `'upper'`: Top tier
- `'suite'`: Luxury suites
- `'standing'`: Standing room only areas

**Guidelines:**
- Field level: Rows start at field level (elevation 0-10ft)
- Lower level: Elevation 10-30ft, below upper deck
- Club level: Mid-bowl, often covered, premium pricing
- Upper level: Above concourse, under roof/sky
- Use official nomenclature when possible

---

## Phase 3: Row-Level Data (2-3 hours)

### Step 3.1: Collect Row Ranges

**Sources:**
- Team seating chart (shows row letters/numbers)
- Ticketing sites (select section, view available rows)
- A View From My Seat (user photos include row info)

**For Each Section, Document:**
```
Section ID: _____
First Row: _____ (letter or number)
Last Row: _____
Estimated Seats Per Row: _____
```

**Typical Patterns:**
- Field level: Rows A-N (14 rows) or A-Z (26 rows)
- Lower level: Rows 1-20 or A-T
- Club level: Rows 1-10 (fewer rows, premium)
- Upper level: Rows 1-25 or 1-30

### Step 3.2: Estimate Seats Per Row

**Methods:**

1. **Ticketing Sites**
   - StubHub/SeatGeek show seat numbers
   - Example: "Seat 1-18" = 18 seats/row

2. **Official Seating Charts**
   - Some charts label seat counts

3. **Visual Estimation**
   - Measure section arc length on seating chart
   - Typical seat width: 18-22 inches
   - Calculate: arc_length / seat_width

4. **Neighboring Sections**
   - Sections in same level usually similar
   - Use known section as baseline

**Quality Check:**
- Field level center: 18-24 seats/row (wider arcs)
- Corners: 12-18 seats/row (tighter arcs)
- Upper level: May have slightly more due to larger radius

### Step 3.3: Calculate Elevations

**Standard Calculation:**
```typescript
rowHeight = 2.5 // feet (vertical rise between rows)
rake = 18 // degrees (typical seating slope)
baseElevation = 0 // for field level, higher for other levels

elevation = baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180))
```

**Base Elevations by Level:**
- Field: 0-5 feet
- Lower: 10-20 feet
- Club: 30-50 feet
- Upper: 60-120 feet

**Rake Angles:**
- Steep (upper decks): 25-35°
- Standard (most seating): 15-25°
- Shallow (field level): 10-18°

**Sources for Verification:**
- Architectural diagrams (if available)
- Fan reports: "steep climb" = higher rake
- Similar stadiums as reference

---

## Phase 4: 3D Geometry (1-2 hours)

### Step 4.1: Understand Coordinate System

**Our 3D Coordinate System:**
```
Origin: Home plate at (0, 0, 0)
X-axis: Right field line (increases to right field)
Y-axis: Center field (increases toward center/left)
Z-axis: Elevation (increases upward)
Units: Feet
```

**Polar to Cartesian Conversion:**
```typescript
// Given:
angle: degrees from right field line
distance: feet from home plate
height: feet above field

// Convert to (x, y, z):
x = distance * cos(angle * PI/180)
y = distance * sin(angle * PI/180)
z = height
```

### Step 4.2: Measure Section Positions

**Tool: Google Earth Pro**

1. **Set Home Plate Origin**
   - Find home plate on satellite view
   - Add placemark, note coordinates

2. **Measure Section Distance**
   - Use ruler tool
   - Measure from home plate to front of section
   - Measure to back of section
   - Record both distances

3. **Measure Section Width**
   - Measure along the arc from one side to other

**Example Measurements:**
```
Section 100 (Field Level, Right Field):
- Front distance: 55 feet
- Back distance: 63 feet
- Start angle: 10°
- End angle: 15°
- Elevation front: 0 feet
- Elevation back: 8 feet
```

### Step 4.3: Calculate 4 Vertices

**Each Section = Quadrilateral (4 corner points)**

```
Vertex Layout:
  1 -------- 2    (front of section, lower)
  |          |
  |          |
  3 -------- 4    (back of section, higher)
```

**Calculation:**
```typescript
// Section 100 example
const baseAngle = 10; // degrees
const angleSpan = 5;
const distanceFront = 55; // feet
const distanceBack = 63;
const elevationFront = 0;
const elevationBack = 8;

const vertices: Vector3D[] = [
  // Vertex 1: Front-left
  {
    x: distanceFront * Math.cos(baseAngle * Math.PI / 180),
    y: distanceFront * Math.sin(baseAngle * Math.PI / 180),
    z: elevationFront
  },
  // Vertex 2: Front-right
  {
    x: distanceFront * Math.cos((baseAngle + angleSpan) * Math.PI / 180),
    y: distanceFront * Math.sin((baseAngle + angleSpan) * Math.PI / 180),
    z: elevationFront
  },
  // Vertex 3: Back-right
  {
    x: distanceBack * Math.cos((baseAngle + angleSpan) * Math.PI / 180),
    y: distanceBack * Math.sin((baseAngle + angleSpan) * Math.PI / 180),
    z: elevationBack
  },
  // Vertex 4: Back-left
  {
    x: distanceBack * Math.cos(baseAngle * Math.PI / 180),
    y: distanceBack * Math.sin(baseAngle * Math.PI / 180),
    z: elevationBack
  }
];
```

**Verification:**
- Do the 4 points form a reasonable quadrilateral?
- Are adjacent sections roughly the same size?
- Does the elevation increase toward the back (positive rake)?

### Step 4.4: Quick Calculation Method

**For faster data entry, use this helper:**

```typescript
// Add to your stadium file
function calculateSectionVertices(
  baseAngle: number,
  angleSpan: number,
  distanceFront: number,
  distanceBack: number,
  elevationFront: number,
  elevationBack: number
): Vector3D[] {
  const deg2rad = Math.PI / 180;

  return [
    { // Front-left
      x: distanceFront * Math.cos(baseAngle * deg2rad),
      y: distanceFront * Math.sin(baseAngle * deg2rad),
      z: elevationFront
    },
    { // Front-right
      x: distanceFront * Math.cos((baseAngle + angleSpan) * deg2rad),
      y: distanceFront * Math.sin((baseAngle + angleSpan) * deg2rad),
      z: elevationFront
    },
    { // Back-right
      x: distanceBack * Math.cos((baseAngle + angleSpan) * deg2rad),
      y: distanceBack * Math.sin((baseAngle + angleSpan) * deg2rad),
      z: elevationBack
    },
    { // Back-left
      x: distanceBack * Math.cos(baseAngle * deg2rad),
      y: distanceBack * Math.sin(baseAngle * deg2rad),
      z: elevationBack
    }
  ];
}
```

---

## Phase 5: Obstruction Modeling (2-3 hours)

### Step 5.1: Identify Obstruction Types

**Common MLB Stadium Obstructions:**

1. **Upper Deck Overhang** (90% of stadiums)
   - Covers back rows of lower level
   - Typically 15-40 feet deep
   - 40-80 feet above covered seats

2. **Partial Roof/Canopy** (30% of stadiums)
   - Covers premium seating
   - Varies by section

3. **Retractable Roof** (8 MLB stadiums)
   - Complete roof geometry
   - Open vs closed positions

4. **Scoreboards** (all stadiums)
   - Large video boards
   - Cast shadows in early/late innings

5. **Facade/Architectural Features**
   - Structural elements
   - Light towers

### Step 5.2: Model Upper Deck Overhang

**Most Common Obstruction - Template:**

```typescript
import { Obstruction3D, Vector3D, Mesh3D } from '../../../types/stadium-complete';

// Helper: Create box mesh
function createBoxMesh(
  centerX: number,
  centerY: number,
  centerZ: number,
  width: number,
  depth: number,
  height: number
): Mesh3D {
  const hw = width / 2;
  const hd = depth / 2;
  const hh = height / 2;

  return {
    vertices: [
      { x: centerX - hw, y: centerY - hd, z: centerZ - hh }, // 0: front-left-bottom
      { x: centerX + hw, y: centerY - hd, z: centerZ - hh }, // 1: front-right-bottom
      { x: centerX + hw, y: centerY + hd, z: centerZ - hh }, // 2: back-right-bottom
      { x: centerX - hw, y: centerY + hd, z: centerZ - hh }, // 3: back-left-bottom
      { x: centerX - hw, y: centerY - hd, z: centerZ + hh }, // 4: front-left-top
      { x: centerX + hw, y: centerY - hd, z: centerZ + hh }, // 5: front-right-top
      { x: centerX + hw, y: centerY + hd, z: centerZ + hh }, // 6: back-right-top
      { x: centerX - hw, y: centerY + hd, z: centerZ + hh }  // 7: back-left-top
    ],
    faces: [
      [0, 1, 5, 4], // front
      [1, 2, 6, 5], // right
      [2, 3, 7, 6], // back
      [3, 0, 4, 7], // left
      [4, 5, 6, 7], // top
      [0, 3, 2, 1]  // bottom (shadow-casting surface)
    ]
  };
}

export const teamNameObstructions: Obstruction3D[] = [
  {
    id: 'upper-deck-overhang-third-base',
    name: 'Upper Deck Overhang - Third Base Side',
    type: 'upper_deck',
    geometry: createBoxMesh(
      -50, // centerX (third base side is negative x)
      80,  // centerY (distance from home plate)
      70,  // centerZ (height above field)
      120, // width (spans many sections)
      30,  // depth (how far overhang extends)
      5    // height (thickness of deck)
    ),
    boundingBox: {
      min: { x: -110, y: 65, z: 67.5 },
      max: { x: 10, y: 95, z: 72.5 }
    },
    material: {
      opacity: 1.0, // Concrete is fully opaque
      reflectivity: 0.1, // Low reflectivity
      color: '#808080' // Gray
    },
    castsShadow: true
  }
];
```

### Step 5.3: Model Retractable Roof (if applicable)

**Stadiums with Retractable Roofs:**
- Chase Field (Arizona)
- Globe Life Field (Texas)
- LoanDepot Park (Miami)
- Minute Maid Park (Houston)
- Rogers Centre (Toronto)
- T-Mobile Park (Seattle)
- American Family Field (Milwaukee)

**Approach:**
- Model closed position (full coverage)
- Use `movable: true` flag
- Opacity: 0.8-1.0 (varies by material)

**Example (simplified):**
```typescript
{
  id: 'retractable-roof',
  name: 'Retractable Roof',
  type: 'roof',
  geometry: createBoxMesh(0, 0, 150, 400, 400, 20),
  movable: true,
  material: {
    opacity: 0.9, // Some roofs have translucent panels
    reflectivity: 0.2
  },
  castsShadow: true
}
```

### Step 5.4: Calculate Bounding Boxes

**Bounding Box = Minimum volume containing the geometry**

```typescript
// For a box mesh, bounding box is:
boundingBox: {
  min: {
    x: centerX - width/2,
    y: centerY - depth/2,
    z: centerZ - height/2
  },
  max: {
    x: centerX + width/2,
    y: centerY + depth/2,
    z: centerZ + height/2
  }
}
```

**Purpose:** Fast shadow intersection tests

---

## Phase 6: Validation & Testing (1 hour)

### Step 6.1: Run Validation Script

```bash
npm run validate-stadium-data
```

**Expected Output:**
```
✅ Validating section files...
✅ Validating obstruction files...

Statistics:
Total section files: 31 (was 30, now +1)
Total sections: 7,800+ (was 7,722)
Total obstructions: 1,000+
Row-level coverage: 100.0%

✅ Validation complete - No critical errors found!
```

**If Errors Found:**
- Read error message carefully
- Fix issue in TypeScript file
- Re-run validation
- Repeat until zero errors

### Step 6.2: TypeScript Type Check

```bash
npm run type-check
```

**Common TypeScript Errors:**

1. **Missing Vector3D type assertion**
   ```typescript
   // Wrong:
   vertices3D: [{ x: 10, y: 20, z: 0 }, ...]

   // Correct:
   vertices3D: [{ x: 10, y: 20, z: 0 }, ...] as Vector3D[]
   ```

2. **Incorrect level value**
   ```typescript
   // Wrong:
   level: 'main'

   // Correct:
   level: 'field' // Must be exact type
   ```

3. **Row type mismatch**
   ```typescript
   // Wrong:
   rows: [{ row: 'A', seats: 18 }]

   // Correct:
   rows: generateRows('A', 'N', 18, 0, 18)
   ```

### Step 6.3: Visual Inspection

**Checklist:**
- [ ] All section IDs are unique
- [ ] Angles add up to ~360° (or expected coverage)
- [ ] Row counts match official sources
- [ ] Vertices form reasonable quadrilaterals
- [ ] Obstructions positioned logically
- [ ] No duplicate section IDs (validation catches this)

**Use VS Code Search:**
```
Search: "id: '"
Result: Should see all section IDs, check for duplicates
```

### Step 6.4: Test in Development Environment

```bash
npm run dev
```

**Manual Tests:**
1. Navigate to stadium page
2. Verify sections load without errors
3. Check section names display correctly
4. Test shade calculator (if 3D enabled)
5. Verify no console errors

### Step 6.5: Commit & Document

**Git Workflow:**
```bash
git add src/data/sections/mlb/[stadium-name].ts
git add src/data/obstructions/mlb/[team-name]-obstructions.ts
git commit -m "Add row-level data for [Stadium Name]

- 60+ sections with row-level detail
- 3D vertices for all sections
- Major obstruction modeling
- Passes all validation checks
- Zero critical errors

Part of Step 1.3/1.4/1.5 - Tier X MLB data collection"
```

**Update Progress Tracking:**
- Mark stadium complete in collection checklist
- Note any issues or assumptions made
- Document data sources used

---

## Common Patterns & Shortcuts

### Pattern 1: Symmetric Stadiums

**Many stadiums are symmetric around centerfield axis**

**Shortcut:**
1. Map right field sections (angles 0-180°)
2. Mirror for left field (angles 180-360°)
3. Adjust for asymmetric elements (scoreboards, etc.)

**Example:**
```typescript
// Right field section
{
  id: '100',
  baseAngle: 10,
  angleSpan: 5,
  // ... other properties
}

// Mirror to left field
{
  id: '150',
  baseAngle: 350, // 360 - 10 = 350
  angleSpan: 5,
  // ... mirror x-coordinates (negate x values in vertices)
}
```

### Pattern 2: Repeating Sections

**Sections in same level often identical except angle/position**

**Shortcut: Section Factory Function**
```typescript
function createFieldSection(
  sectionNum: number,
  baseAngle: number
): DetailedSection {
  return {
    id: sectionNum.toString(),
    name: `Field Level ${sectionNum}`,
    level: 'field',
    baseAngle: baseAngle,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: calculateSectionVertices(baseAngle, 5, 55, 63, 0, 8),
    covered: false,
    distance: 55,
    height: 0,
    rake: 18
  };
}

// Generate 36 field sections
const fieldSections = Array.from({ length: 36 }, (_, i) =>
  createFieldSection(100 + i, 10 + i * 5)
);
```

### Pattern 3: Standard Upper Deck Overhang

**Most stadiums: upper deck covers back ~15 rows of lower bowl**

**Template:**
```typescript
// Identify coverage
coveredSections = ['115', '116', ..., '125']; // 10 sections
overhangDepth = 25; // feet
overhangHeight = 70; // feet above field

// Mark sections as covered in back rows
rows: generateRows(1, 20, 20, 15, 22, true) // last param = covered
```

### Pattern 4: Quick Vertex Approximation

**For initial data entry, approximate vertices:**

```typescript
// Standard section formula
distanceFront = 50 + (level * 20); // field=50, lower=70, upper=110
distanceBack = distanceFront + 8; // typical depth
elevationFront = levelHeight[level];
elevationBack = elevationFront + (rowCount * 2.5 * sin(rake));

// Use calculateSectionVertices helper
vertices3D: calculateSectionVertices(
  baseAngle,
  angleSpan,
  distanceFront,
  distanceBack,
  elevationFront,
  elevationBack
)
```

**Refine later with exact measurements**

---

## Troubleshooting Guide

### Issue 1: Validation Error - "Invalid baseAngle"

**Error:**
```
Section 'abc': baseAngle 380 is invalid (must be 0-359)
```

**Fix:**
- Angles must be 0-359°
- If angle > 360, subtract 360
- If angle < 0, add 360

### Issue 2: Validation Error - "vertices3D must have exactly 4 vertices"

**Error:**
```
Section 'xyz': vertices3D must have exactly 4 vertices (got 3)
```

**Fix:**
- Count array elements
- Ensure `[vertex1, vertex2, vertex3, vertex4]`
- Check for missing closing brace `}`

### Issue 3: TypeScript Error - "Type 'string' not assignable to type Level"

**Error:**
```
Type '"main"' is not assignable to type '"field" | "lower" | "club" | "upper" | "suite" | "standing"'
```

**Fix:**
- Use only valid level values: `field`, `lower`, `club`, `upper`, `suite`, `standing`
- Check spelling exactly

### Issue 4: Sections Don't Sum to 360°

**Problem:** Total angle coverage ≠ 360°

**Diagnosis:**
```typescript
// Calculate total
const totalAngle = sections.reduce((sum, s) => sum + s.angleSpan, 0);
console.log(`Total coverage: ${totalAngle}°`);
```

**Fix:**
- Some stadiums don't have full 360° (e.g., 320° missing deep outfield)
- Verify against seating chart
- Adjust angleSpan values proportionally

### Issue 5: Row Generation Errors

**Problem:** `generateRows` produces wrong count

**Debug:**
```typescript
// For letter rows
startCode = 'A'.charCodeAt(0); // 65
endCode = 'N'.charCodeAt(0);   // 78
rowCount = endCode - startCode + 1; // 78 - 65 + 1 = 14 ✓

// For number rows
startRow = 1;
endRow = 20;
rowCount = endRow - startRow + 1; // 20 - 1 + 1 = 20 ✓
```

**Fix:**
- Verify start/end row letters/numbers
- Check for off-by-one errors
- Test with simple range first

### Issue 6: Duplicate Section IDs

**Error:**
```
Duplicate section ID 'club-100' found in file yankee-stadium.ts
```

**Fix:**
- Search file for duplicate ID
- Rename one section (e.g., 'club-100a', 'club-100-left')
- Ensure all IDs unique within file

### Issue 7: Bounding Box Min > Max

**Error:**
```
Obstruction 'roof': boundingBox.min.x (100) > boundingBox.max.x (50)
```

**Fix:**
- min values must be less than max values
- Swap if reversed
- Check calculation logic

### Issue 8: Performance Issues (File Too Large)

**Problem:** File >200KB, slow to load

**Diagnosis:**
- Large files usually from excessive row detail
- Check row count per section

**Fix:**
- Remove `seatPositions` array if present (not required)
- Simplify row generation (fewer optional fields)
- Split into multiple files if necessary

---

## Example Walkthrough: Yankee Stadium

**Let's walk through collecting data for Yankee Stadium as a complete example.**

### Step 1: Research (30 min)

**Gather Basic Info:**
- Stadium: Yankee Stadium (2009)
- Team: New York Yankees
- Location: Bronx, NY
- Coordinates: 40.8296° N, 73.9262° W
- Capacity: 46,537
- Opened: 2009

**Section Structure:**
- Field Level: Sections 100-136 (Rows A-N)
- Main Level: Sections 200-232 (Rows 1-20)
- Terrace Level: Sections 300-334 (Rows 1-12)
- Grandstand Level: Sections 400-439 (Rows 1-18)
- Bleachers: Sections 201-204 (Rows 1-20)

**Major Obstructions:**
- Upper deck overhang (covers back Main Level rows)
- Scoreboards (center field, right field)

### Step 2: Section Mapping (45 min)

**Field Level Angles:**
- 37 sections (100-136)
- Right field to left field
- Coverage: ~270° (no deep CF sections)
- angleSpan: 270° / 37 ≈ 7.3° per section

**Calculate Angles:**
```typescript
// Start at right field (angle 0)
Section 100: baseAngle = 0°, angleSpan = 7.3°
Section 101: baseAngle = 7.3°, angleSpan = 7.3°
...
Section 136: baseAngle = 262.7°, angleSpan = 7.3°
```

### Step 3: Row Data (1 hour)

**Field Level (100s):**
- Rows: A-N (14 rows)
- Seats per row: 16-20 (varies by angle)
- Base elevation: 0 feet
- Rake: 18°

**Main Level (200s):**
- Rows: 1-20 (20 rows)
- Seats per row: 18-22
- Base elevation: 20 feet
- Rake: 22°
- Back 8 rows covered by upper deck

### Step 4: 3D Geometry (1 hour)

**Field Level Measurements (Google Earth):**
- Front distance: 55 feet from home plate
- Back distance: 63 feet
- Elevation front: 0 feet
- Elevation back: 8 feet (14 rows × 2.5 ft/row × sin(18°))

**Calculate Vertices (Section 100 example):**
```typescript
vertices3D: [
  { x: 55, y: 0, z: 0 },      // Front-left (0°)
  { x: 54.7, y: 7, z: 0 },    // Front-right (7.3°)
  { x: 62.7, y: 8, z: 8 },    // Back-right
  { x: 63, y: 0, z: 8 }       // Back-left
] as Vector3D[]
```

### Step 5: Obstructions (1.5 hours)

**Upper Deck Overhang:**
```typescript
{
  id: 'upper-deck-overhang',
  name: 'Grandstand Upper Deck Overhang',
  type: 'upper_deck',
  geometry: createBoxMesh(0, 90, 85, 300, 25, 5),
  boundingBox: {
    min: { x: -150, y: 77.5, z: 82.5 },
    max: { x: 150, y: 102.5, z: 87.5 }
  },
  material: {
    opacity: 1.0,
    reflectivity: 0.1,
    color: '#404040'
  },
  castsShadow: true
}
```

### Step 6: Validation (30 min)

```bash
npm run validate-stadium-data
```

**Result:**
```
✅ Validating section files...
  yankee-stadium.ts: 137 sections, 0 errors

✅ Validating obstruction files...
  yankees-obstructions.ts: 3 obstructions, 0 errors

✅ Validation complete!
```

**Commit:**
```bash
git add src/data/sections/mlb/yankee-stadium.ts
git add src/data/obstructions/mlb/yankees-obstructions.ts
git commit -m "Add row-level data for Yankee Stadium

- 137 sections with complete row detail
- Field, Main, Terrace, Grandstand levels
- Upper deck overhang obstruction modeled
- Passes validation with zero errors

Part of Step 1.3 - Tier 1 MLB data collection"
```

**Total Time: ~4.5 hours** (first stadium takes longer, subsequent ones faster)

---

## Quality Assurance Checklist

**Before marking a stadium complete:**

### Data Completeness
- [ ] All 60+ sections mapped
- [ ] Every section has row-level data
- [ ] All sections have 4 valid 3D vertices
- [ ] Angles and spans are reasonable
- [ ] Major obstructions modeled

### Validation
- [ ] `npm run validate-stadium-data` passes (0 errors)
- [ ] `npm run type-check` passes
- [ ] File compiles without warnings
- [ ] No duplicate section IDs

### Accuracy
- [ ] Section count matches official seating chart
- [ ] Row ranges verified from multiple sources
- [ ] Covered sections correctly identified
- [ ] Distances/elevations reasonable (no 500ft sections)

### Documentation
- [ ] Data sources documented in commit message
- [ ] Any assumptions or approximations noted
- [ ] Progress tracking updated
- [ ] Files follow naming conventions

---

## Success Criteria

**A stadium data collection is COMPLETE when:**

1. ✅ File passes validation with **zero critical errors**
2. ✅ **60+ sections** with complete data
3. ✅ **100% row-level coverage** (every section has rows array)
4. ✅ **All 3D vertices** calculated (4 per section)
5. ✅ **Major obstructions** modeled (upper deck minimum)
6. ✅ **Committed to git** with descriptive message
7. ✅ **Manual QA** passed (visual inspection, test in dev)

---

**Document Status:** ✅ COMPLETE
**Next Action:** Begin Tier 1 stadium data collection (Step 1.3)
