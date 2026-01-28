# MLB Stadium Data Collection Template

**Quick Reference Guide for Data Entry**

---

## Pre-Collection Checklist

Stadium: _________________________ | Team: _________________________
Date Started: __________ | Collector: __________ | Tier: ___

**Tools Ready:**
- [ ] Google Earth Pro open
- [ ] MLB.com seating map open
- [ ] StubHub/SeatGeek tabs open
- [ ] A View From My Seat open
- [ ] VS Code project loaded
- [ ] This template printed/displayed

---

## Phase 1: Basic Information (15 min)

```
Stadium Name: _________________________________
Official Name: _________________________________
Team: _________________________________
City: _________________ State: _____
Opened: ________ (year)
Capacity: _________ seats
Surface: ☐ Grass  ☐ Turf  ☐ Hybrid

Coordinates (Google Earth):
  Latitude: ___________
  Longitude: ___________
  Elevation: _______ ft above sea level

Orientation (home plate to north): ______°

Roof Type:
  ☐ Open
  ☐ Retractable (closed/open/partial)
  ☐ Fixed dome

Climate Zone:
  ☐ Hot-dry  ☐ Hot-humid  ☐ Temperate  ☐ Cold
```

---

## Phase 2: Section Inventory (30 min)

**Level 1: ___________________**
- Section Range: _______ to _______
- Row Range: _______ to _______
- Typical Seats/Row: _______
- Base Elevation: _______ ft
- Rake Angle: _______°
- Covered: ☐ No  ☐ Yes  ☐ Partial (rows: _______)

**Level 2: ___________________**
- Section Range: _______ to _______
- Row Range: _______ to _______
- Typical Seats/Row: _______
- Base Elevation: _______ ft
- Rake Angle: _______°
- Covered: ☐ No  ☐ Yes  ☐ Partial (rows: _______)

**Level 3: ___________________**
- Section Range: _______ to _______
- Row Range: _______ to _______
- Typical Seats/Row: _______
- Base Elevation: _______ ft
- Rake Angle: _______°
- Covered: ☐ No  ☐ Yes  ☐ Partial (rows: _______)

**Level 4: ___________________**
- Section Range: _______ to _______
- Row Range: _______ to _______
- Typical Seats/Row: _______
- Base Elevation: _______ ft
- Rake Angle: _______°
- Covered: ☐ No  ☐ Yes  ☐ Partial (rows: _______)

**Special Sections:**
- Bleachers: ☐ Yes  ☐ No | Sections: _____________
- Suites: ☐ Yes  ☐ No | Sections: _____________
- Standing Room: ☐ Yes  ☐ No | Sections: _____________
- Party Decks: ☐ Yes  ☐ No | Sections: _____________

**Total Sections: _______**

---

## Phase 3: Angle Mapping (30 min)

**Stadium Coverage:**
- Full bowl: ☐ 360°
- Partial: ☐ _____° (missing outfield sections)

**Calculate angleSpan:**
```
Total coverage: _____°
Number of sections at level: _____
angleSpan = _____ / _____ = _____° per section
```

**Starting Angle (right field line):**
- Measured from north: _____°
- First section baseAngle: _____°

**Angle Verification:**
```
First section: _____ (baseAngle: _____°)
Last section: _____ (baseAngle: _____°)
Expected end: _____° (start + coverage)
Actual end: _____° (last baseAngle + angleSpan)
Difference: _____° (should be ~0°)
```

---

## Phase 4: Distance Measurements (Google Earth) (45 min)

**Field Level:**
- Front distance (from home plate): _______ ft
- Back distance: _______ ft
- Depth: _______ ft (back - front)

**Lower/Main Level:**
- Front distance: _______ ft
- Back distance: _______ ft
- Depth: _______ ft

**Club Level:**
- Front distance: _______ ft
- Back distance: _______ ft
- Depth: _______ ft

**Upper Level:**
- Front distance: _______ ft
- Back distance: _______ ft
- Depth: _______ ft

---

## Phase 5: Obstruction Identification (30 min)

**Upper Deck Overhang:**
- Present: ☐ Yes  ☐ No
- Covers sections: _____________ to _____________
- Covers rows (of lower level): _____________ to _____________
- Overhang depth: _______ ft
- Overhang height above seats: _______ ft
- Position (centerX, centerY, centerZ): (_____, _____, _____)
- Dimensions (width × depth × height): _____ × _____ × _____

**Roof/Canopy:**
- Type: ☐ None  ☐ Partial  ☐ Retractable  ☐ Fixed
- Covers sections: _____________
- Height above field: _______ ft
- Material: ☐ Solid  ☐ Mesh  ☐ Glass  ☐ Fabric
- Opacity: _____ (0.0-1.0)

**Scoreboards:**
- Main scoreboard location: ☐ CF  ☐ RF  ☐ LF
- Position: (_____, _____, _____)
- Dimensions (W × H × D): _____ × _____ × _____

**Other Obstructions:**
1. Name: _____________ | Type: _____________ | Position: (_____,_____,_____)
2. Name: _____________ | Type: _____________ | Position: (_____,_____,_____)
3. Name: _____________ | Type: _____________ | Position: (_____,_____,_____)

---

## Phase 6: Data Entry (2-3 hours)

**File Setup:**
```bash
# Create files
touch src/data/sections/mlb/[stadium-name].ts
touch src/data/obstructions/mlb/[team-name]-obstructions.ts
```

**Section File Template:**
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
  const rowHeight = 2.5;
  const rowDepth = 2.8;

  const isLetterRows = typeof startRow === 'string';

  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);

    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow - Math.floor(rowNum * 0.2),
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

// Helper to calculate section vertices
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
    {
      x: distanceFront * Math.cos(baseAngle * deg2rad),
      y: distanceFront * Math.sin(baseAngle * deg2rad),
      z: elevationFront
    },
    {
      x: distanceFront * Math.cos((baseAngle + angleSpan) * deg2rad),
      y: distanceFront * Math.sin((baseAngle + angleSpan) * deg2rad),
      z: elevationFront
    },
    {
      x: distanceBack * Math.cos((baseAngle + angleSpan) * deg2rad),
      y: distanceBack * Math.sin((baseAngle + angleSpan) * deg2rad),
      z: elevationBack
    },
    {
      x: distanceBack * Math.cos(baseAngle * deg2rad),
      y: distanceBack * Math.sin(baseAngle * deg2rad),
      z: elevationBack
    }
  ];
}

export const [teamName]Sections: DetailedSection[] = [
  {
    id: '100',
    name: 'Field Level 100',
    level: 'field',
    baseAngle: 10,
    angleSpan: 5,
    rows: generateRows('A', 'N', 18, 0, 18, false),
    vertices3D: calculateSectionVertices(10, 5, 55, 63, 0, 8),
    covered: false,
    distance: 55,
    height: 0,
    rake: 18
  },
  // ... add more sections
];
```

**Obstruction File Template:**
```typescript
import { Obstruction3D, Vector3D, Mesh3D } from '../../../types/stadium-complete';

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
      { x: centerX - hw, y: centerY - hd, z: centerZ - hh },
      { x: centerX + hw, y: centerY - hd, z: centerZ - hh },
      { x: centerX + hw, y: centerY + hd, z: centerZ - hh },
      { x: centerX - hw, y: centerY + hd, z: centerZ - hh },
      { x: centerX - hw, y: centerY - hd, z: centerZ + hh },
      { x: centerX + hw, y: centerY - hd, z: centerZ + hh },
      { x: centerX + hw, y: centerY + hd, z: centerZ + hh },
      { x: centerX - hw, y: centerY + hd, z: centerZ + hh }
    ],
    faces: [
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
      [4, 5, 6, 7],
      [0, 3, 2, 1]
    ]
  };
}

export const [teamName]Obstructions: Obstruction3D[] = [
  {
    id: 'upper-deck-overhang',
    name: 'Upper Deck Overhang',
    type: 'upper_deck',
    geometry: createBoxMesh(0, 80, 70, 200, 25, 5),
    boundingBox: {
      min: { x: -100, y: 67.5, z: 67.5 },
      max: { x: 100, y: 92.5, z: 72.5 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.1,
      color: '#808080'
    },
    castsShadow: true
  }
];
```

---

## Phase 7: Validation (30 min)

**Run Validation:**
```bash
npm run validate-stadium-data
```

**Validation Checklist:**
- [ ] Zero critical errors reported
- [ ] Section count matches expected (_______ sections)
- [ ] All sections have row-level data (100% coverage)
- [ ] All sections have 4 vertices
- [ ] No duplicate section IDs
- [ ] Obstruction file valid

**TypeScript Check:**
```bash
npm run type-check
```

**Test in Development:**
```bash
npm run dev
# Navigate to stadium page
# Verify sections load
# Check for console errors
```

**Visual Inspection:**
- [ ] All section IDs unique (search for "id: '")
- [ ] Angles reasonable (0-359°)
- [ ] Distances reasonable (30-200 ft typically)
- [ ] Elevations increase with rows
- [ ] Row counts match official data

---

## Phase 8: Documentation & Commit (15 min)

**Data Sources Used:**
- [ ] MLB.com seating map
- [ ] StubHub 3D view
- [ ] SeatGeek photos
- [ ] A View From My Seat
- [ ] Google Earth measurements
- [ ] Wikipedia
- [ ] Other: _________________

**Assumptions/Notes:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**Git Commit:**
```bash
git add src/data/sections/mlb/[stadium-name].ts
git add src/data/obstructions/mlb/[team-name]-obstructions.ts

git commit -m "Add row-level data for [Stadium Name]

- [#] sections with complete row detail
- 3D vertices for all sections
- Major obstruction modeling ([list obstructions])
- Passes validation with zero errors
- Row-level coverage: 100%

Data sources:
- MLB.com official seating map
- StubHub 3D views
- Google Earth measurements
- [other sources]

Part of Step 1.[3/4/5] - Tier [1/2/3] MLB data collection"
```

---

## Progress Tracking

**Tier 1 Stadiums (10 total):**
- [ ] 1. Yankee Stadium
- [ ] 2. Fenway Park
- [ ] 3. Dodger Stadium
- [ ] 4. Wrigley Field
- [ ] 5. Oracle Park
- [ ] 6. Camden Yards
- [ ] 7. Petco Park
- [ ] 8. Coors Field
- [ ] 9. Busch Stadium
- [ ] 10. T-Mobile Park

**Tier 2 Stadiums (10 total):**
- [ ] 11. Truist Park
- [ ] 12. Minute Maid Park
- [ ] 13. Globe Life Field
- [ ] 14. Chase Field
- [ ] 15. Great American Ball Park
- [ ] 16. PNC Park
- [ ] 17. Citi Field
- [ ] 18. Nationals Park
- [ ] 19. Target Field
- [ ] 20. Progressive Field

**Tier 3 Stadiums (10 total):**
- [ ] 21. Citizens Bank Park
- [ ] 22. Guaranteed Rate Field
- [ ] 23. Comerica Park
- [ ] 24. Kauffman Stadium
- [ ] 25. American Family Field
- [ ] 26. Rogers Centre
- [ ] 27. Angel Stadium
- [ ] 28. LoanDepot Park
- [ ] 29. Tropicana Field
- [ ] 30. Oakland Coliseum

---

## Time Tracking

**Estimated vs Actual:**

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| 1. Research | 1-2 hrs | _____ | _____ |
| 2. Section Mapping | 2-3 hrs | _____ | _____ |
| 3. Row Data | 2-3 hrs | _____ | _____ |
| 4. 3D Geometry | 1-2 hrs | _____ | _____ |
| 5. Obstructions | 2-3 hrs | _____ | _____ |
| 6. Validation | 1 hr | _____ | _____ |
| **Total** | **9-14 hrs** | **_____** | |

---

## Quick Reference: Common Values

### Typical Distances (from home plate)
- Field level front: 50-60 ft
- Field level back: 60-70 ft
- Lower level front: 65-80 ft
- Lower level back: 75-90 ft
- Club level front: 75-95 ft
- Club level back: 85-105 ft
- Upper level front: 100-140 ft
- Upper level back: 110-160 ft

### Typical Elevations
- Field level: 0-5 ft (base)
- Lower level: 10-25 ft (base)
- Club level: 30-60 ft (base)
- Upper level: 65-130 ft (base)

### Typical Rake Angles
- Field level: 12-20°
- Lower level: 18-25°
- Club level: 20-28°
- Upper level: 25-35°

### Typical Row Counts
- Field level: 12-18 rows (often A-N or A-R)
- Lower level: 15-25 rows
- Club level: 8-12 rows (premium, fewer rows)
- Upper level: 18-30 rows

### Typical Seats Per Row
- Corners/foul poles: 12-16 seats
- Mid-sections: 16-20 seats
- Behind plate: 18-24 seats (wider arc)

### Angle Spans (typical)
- 36 sections = 10° each (360° ÷ 36)
- 40 sections = 9° each
- 48 sections = 7.5° each
- 72 sections = 5° each

---

## Validation Error Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| "Invalid baseAngle" | Must be 0-359°, not 360+ |
| "Invalid level" | Use: field, lower, club, upper, suite, standing |
| "vertices3D must have 4" | Count array elements, need exactly 4 |
| "Duplicate section ID" | Search file for ID, rename one |
| "boundingBox min > max" | Swap min/max values |
| "Type 'X' not assignable" | Check spelling of level/type exactly |

---

## Success Criteria (Final Check)

**This stadium is COMPLETE when:**
- [x] ✅ Passes `npm run validate-stadium-data` with 0 errors
- [x] ✅ Passes `npm run type-check` with 0 errors
- [x] ✅ 60+ sections with complete data
- [x] ✅ 100% row-level coverage
- [x] ✅ All sections have 4 valid 3D vertices
- [x] ✅ Major obstructions modeled
- [x] ✅ Committed to git with descriptive message
- [x] ✅ Progress tracking updated

---

**Template Version:** 1.0
**Last Updated:** 2026-01-27
**Part of:** Step 1.2 - MLB Stadium Data Research & Collection Plan
