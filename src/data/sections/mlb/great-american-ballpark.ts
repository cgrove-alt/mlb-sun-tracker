// Great American Ball Park - Complete Section Data with 3D Geometry
// Cincinnati, OH - Opened 2003 - Capacity 42,319
// Home of the Cincinnati Reds

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper to generate row details
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
        seats: seatsPerRow,
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 29 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow,
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 29 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Great American Ball Park Sections
export const greatAmericanBallparkSections: DetailedSection[] = [
  // ========== DIAMOND SEATS (Behind Home Plate) ==========
  {
    id: 'DS',
    name: 'Diamond Seats',
    level: 'field',
    baseAngle: 105, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'P', 16, 0, 17, false),
    vertices3D: [
      { x: -10, y: 58, z: 0 },
      { x: 0, y: 58, z: 0 },
      { x: 0, y: 82, z: 10 },
      { x: -10, y: 82, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 0,
    rake: 17
  },
  {
    id: '235',
    name: 'Terrace 235',
    level: 'lower',
    baseAngle: 60, // Third base
    angleSpan: 10,
    rows: generateRows(1, 31, 24, 16, 24, false),
    vertices3D: [
      { x: -95, y: 20, z: 16 },
      { x: -95, y: 5, z: 16 },
      { x: -135, y: 5, z: 39 },
      { x: -135, y: 20, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // ========== VIEW LEVEL ==========
  {
    id: '404',
    name: 'View Level 404',
    level: 'upper',
    baseAngle: 105,
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: -30, y: 135, z: 39 },
      { x: -12, y: 135, z: 39 },
      { x: -10, y: 190, z: 78 },
      { x: -28, y: 190, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 163,
    height: 39,
    rake: 28,
  },
  {
    id: '432',
    name: 'View Level 432',
    level: 'upper',
    baseAngle: 195, // Right field
    angleSpan: 11,
    rows: generateRows(1, 29, 26, 39, 28, true),
    vertices3D: [
      { x: 135, y: -30, z: 39 },
      { x: 135, y: -12, z: 39 },
      { x: 190, y: -10, z: 78 },
      { x: 190, y: -28, z: 78 }
    ] as Vector3D[],
    covered: true,
    distance: 163,
    height: 39,
    rake: 28,
  },
  // ========== RIVERBOAT DECK (Center Field) ==========
  {
    id: 'RIVER',
    name: 'Riverboat Deck',
    level: 'standing',
    baseAngle: 285, // Center field
    angleSpan: 18,
    rows: [], // Standing room deck
    vertices3D: [
      { x: -40, y: -400, z: 25 },
      { x: 40, y: -400, z: 25 },
      { x: 40, y: -420, z: 25 },
      { x: -40, y: -420, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 420,
    height: 25,
    rake: 0
  }
];

// Export section map for easy lookup
export const greatAmericanBallparkSectionMap = new Map(
  greatAmericanBallparkSections.map(section => [section.id, section])
);
