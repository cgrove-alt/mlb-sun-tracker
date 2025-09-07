// Progressive Field - Complete Section Data with 3D Geometry
// Cleveland, OH - Opened 1994 - Capacity 34,830
// Home of the Cleveland Guardians

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
        overhangHeight: covered ? 27 - (rowNum * 0.3) : undefined
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
        overhangHeight: covered ? 27 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}
  // Progressive Field Sections
export const progressiveFieldSections: DetailedSection[] = [
  // ========== FIELD BOX ==========
  {
    id: '125',
    name: 'Field Box 125',
    level: 'field',
    baseAngle: 60, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'X', 20, 0, 19, false),
    vertices3D: [
      { x: -12, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 87, z: 13 },
      { x: -12, y: 87, z: 13 }
    ] as Vector3D[],
    covered: false,
    distance: 62,
    height: 0,
    rake: 18
  },
  {
    id: '264',
    name: 'Lower Box 264',
    level: 'lower',
    baseAngle: 15,
    angleSpan: 9,
    rows: generateRows(1, 30, 22, 13, 23, false),
    vertices3D: [
      { x: -87, y: 18, z: 13 },
      { x: -87, y: 5, z: 13 },
      { x: -123, y: 5, z: 34 },
      { x: -123, y: 18, z: 34 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // ========== MEZZANINE ==========
  {
    id: '441',
    name: 'Mezzanine 441',
    level: 'upper',
    baseAngle: 60,
    angleSpan: 11,
    rows: generateRows(1, 27, 26, 34, 27, true),
    vertices3D: [
      { x: -28, y: 123, z: 34 },
      { x: -10, y: 123, z: 34 },
      { x: -8, y: 175, z: 69 },
      { x: -26, y: 175, z: 69 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27'],
      coveragePercentage: 52,
      overhangDepth: 24,
      overhangHeight: 21,
      material: 'solid'
  },
    price: 'value',
    distance: 149,
    height: 34,
    rake: 27,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },
  {
    id: '467',
    name: 'Mezzanine 467',
    level: 'upper',
    baseAngle: 150, // Right field
    angleSpan: 11,
    rows: generateRows(1, 27, 26, 34, 27, true),
    vertices3D: [
      { x: 123, y: -28, z: 34 },
      { x: 123, y: -10, z: 34 },
      { x: 175, y: -8, z: 69 },
      { x: 175, y: -26, z: 69 }
    ] as Vector3D[],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27'],
      coveragePercentage: 52,
      overhangDepth: 24,
      overhangHeight: 21,
      material: 'solid'
  },
    price: 'value',
    distance: 149,
    height: 34,
    rake: 27,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },
  // ========== UPPER BOX ==========
  {
    id: '541',
    name: 'Upper Box 541',
    level: 'upper',
    baseAngle: 60,
    angleSpan: 10,
    rows: generateRows(1, 22, 28, 50, 29, true),
    vertices3D: [
      { x: -32, y: 150, z: 50 },
      { x: -15, y: 150, z: 50 },
      { x: -13, y: 195, z: 82 },
      { x: -30, y: 195, z: 82 }
    ] as Vector3D[],
    price: 'value',
    distance: 173,
    height: 50,
    rake: 29,
    seatWidth: 18,
    rowSpacing: 29,
    viewQuality: 'good'
  },
  // ========== CORNER BAR (Left Field) ==========
  {
    id: 'CORNER',
    name: 'Corner Bar',
    level: 'standing',
    baseAngle: 330, // Left field corner
    angleSpan: 12,
    rows: [], // Bar/standing area with drink rails
    vertices3D: [
      { x: -110, y: 30, z: 20 },
      { x: -95, y: 45, z: 20 },
      { x: -95, y: 60, z: 20 },
      { x: -110, y: 45, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // ========== TERRACE HALL (New 2025) ==========
  {
    id: 'TERRACEHALL',
    name: 'Terrace Hall',
    level: 'club',
    baseAngle: 240,
    angleSpan: 15,
    rows: generateRows('A', 'H', 40, 65, 28, true),
    vertices3D: [
      { x: -110, y: 65, z: 260 },
      { x: -85, y: 65, z: 280 },
      { x: -90, y: 87, z: 302 },
      { x: -115, y: 87, z: 282 }
    ] as Vector3D[],
    price: 'luxury',
    distance: 270,
    height: 65,
    rake: 28,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },
  // ========== NORTH COAST SOCIAL BOXES (New 2025) ==========
  {
    id: 'NORTHCOAST',
    name: 'North Coast Social Boxes',
    level: 'club',
    baseAngle: 255,
    angleSpan: 12,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -130, y: 55, z: 240 },
      { x: -110, y: 55, z: 255 },
      { x: -110, y: 65, z: 265 },
      { x: -130, y: 65, z: 250 }
    ] as Vector3D[],
    price: 'luxury'
  },
  // ========== ECHO VICTORY CLUB ==========
  {
    id: 'ECHOVICTORY',
    name: 'ECHO Victory Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 25,
    rows: generateRows('A', 'J', 26, 60, 26, true),
    vertices3D: [
      { x: -30, y: 60, z: 70 },
      { x: 30, y: 60, z: 70 },
      { x: 35, y: 86, z: 96 },
      { x: -35, y: 86, z: 96 }
    ] as Vector3D[],
    price: 'luxury',
    distance: 70,
    height: 60,
    rake: 26,
    seatWidth: 22,
    rowSpacing: 40,
    viewQuality: 'excellent'
  }
];

// Calculate total capacity
export const progressiveFieldCapacity = progressiveFieldSections.reduce((total, section) => {
  const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
  return total + sectionCapacity;
}, 0);

// Export section map for quick lookup
export const progressiveFieldSectionMap = new Map(
  progressiveFieldSections.map(section => [section.id, section]));

// Stadium-specific features
export const progressiveFieldFeatures = {
  cornerBar: {
    location: 'left_field',
    twoLevels: true,
    drinkRails: true,
    socialSpace: true
  },
  heritagePark: {
    location: 'center_field',
    historicalDisplays: true,
    statues: true,
    indiansHistory: true
  },
  kidsClubhouse: {
    location: 'right_field',
    playground: true,
    familyArea: true,
    interactive: true
  },
  dimensions: {
    leftField: 325,
    leftCenter: 370,
    centerField: 405,
    rightCenter: 375,
    rightField: 325
  },
  toothbrush: {
    lightTowers: true,
    nickname: 'toothbrushes',
    iconic: true,
    whiteColor: true
  },
  districtTicket: {
    affordable: true,
    standingRoom: true,
    socialArea: true,
    youngProfessionals: true
  },
  downtown: {
    location: 'Gateway_District',
    walkable: true,
    cityViews: true
  }
  }
