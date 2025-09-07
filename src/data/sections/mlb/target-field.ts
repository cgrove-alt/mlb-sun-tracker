// Target Field - Complete Section Data with 3D Geometry
// Minneapolis, MN - Opened 2010 - Capacity 38,544
// Home of the Minnesota Twins

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
        overhangHeight: covered ? 28 - (rowNum * 0.3) : undefined
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
        overhangHeight: covered ? 28 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Target Field Sections
export const targetFieldSections: DetailedSection[] = [
  // ========== CHAMPIONS CLUB (Behind Home Plate) ==========
  {
    id: 'CC',
    name: 'Champions Club',
    level: 'field',
    baseAngle: 0, // Unique north-facing orientation
    angleSpan: 8,
    rows: generateRows('A', 'R', 16, 0, 18, false),
    vertices3D: [
      { x: -10, y: 58, z: 0 },
      { x: 0, y: 58, z: 0 },
      { x: 0, y: 82, z: 11 },
      { x: -10, y: 82, z: 11 }
    ],
,

  {
    id: '235',
    name: 'Home Plate Terrace 235',
    level: 'lower',
    baseAngle: 315, // Third base
    angleSpan: 10,
    rows: generateRows(1, 30, 22, 14, 23, false),
    vertices3D: [
      { x: -92, y: 20, z: 14 },
      { x: -92, y: 6, z: 14 },
      { x: -128, y: 6, z: 35 },
      { x: -128, y: 20, z: 35 }
    ],
,

  // ========== VIEW LEVEL ==========
  {
    id: '301',
    name: 'View Level 301',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 35, 28, true),
    vertices3D: [
      { x: -28, y: 128, z: 35 },
      { x: -10, y: 128, z: 35 },
      { x: -8, y: 180, z: 72 },
      { x: -26, y: 180, z: 72 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 54,
      overhangDepth: 25,
      overhangHeight: 22,
      material: 'solid'
    },
    price: 'value',
    distance: 154,
    height: 35,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '327',
    name: 'View Level 327',
    level: 'upper',
    baseAngle: 90, // Right field
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 35, 28, true),
    vertices3D: [
      { x: 128, y: 28, z: 35 },
      { x: 128, y: 10, z: 35 },
      { x: 180, y: 8, z: 72 },
      { x: 180, y: 26, z: 72 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 54,
      overhangDepth: 25,
      overhangHeight: 22,
      material: 'solid'
    },
    price: 'value',
    distance: 154,
    height: 35,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== OVERLOOK (Center Field) ==========
  {
    id: 'OVER',
    name: 'Overlook',
    level: 'standing',
    baseAngle: 180, // Center field
    angleSpan: 20,
    rows: [], // Standing room with drink rails
    vertices3D: [
      { x: -35, y: 395, z: 25 },
      { x: 35, y: 395, z: 25 },
      { x: 35, y: 415, z: 25 },
      { x: -35, y: 415, z: 25 }
    ],
,
  
  // ========== DELTA SKY360 LEGENDS CLUB ==========
  {
    id: 'SKY360',
    name: 'Delta Sky360 Legends Club',
    level: 'club',
    baseAngle: 180,
    angleSpan: 30,
    rows: generateRows('A', 'J', 24, 65, 30, true),
    vertices3D: [
      { x: -40, y: 65, z: 380 },
      { x: 40, y: 65, z: 380 },
      { x: 45, y: 95, z: 410 },
      { x: -45, y: 95, z: 410 }
    ],
    price: 'luxury',
    distance: 380,
    height: 65,
    rake: 30,
    seatWidth: 22,
    rowSpacing: 38,
    viewQuality: 'excellent'
  },
  
  // ========== BUDWEISER ROOF DECK ==========
  {
    id: 'BUDROOF',
    name: 'Budweiser Roof Deck',
    level: 'upper',
    baseAngle: 225,
    angleSpan: 20,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -150, y: 75, z: 320 },
      { x: -120, y: 75, z: 340 },
      { x: -120, y: 85, z: 350 },
      { x: -150, y: 85, z: 330 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['Fixed', 'SRO'],
      coveragePercentage: 60
    },
    price: 'premium'
  },
  
  // ========== TOWN BALL TAVERN ==========
  {
    id: 'TOWNBALL',
    name: 'Town Ball Tavern',
    level: 'club',
    baseAngle: 240,
    angleSpan: 15,
    rows: generateRows('A', 'H', 30, 55, 28, true),
    vertices3D: [
      { x: -140, y: 55, z: 280 },
      { x: -120, y: 55, z: 300 },
      { x: -125, y: 77, z: 322 },
      { x: -145, y: 77, z: 302 }
    ],
    price: 'premium',
    distance: 290,
    height: 55,
    rake: 28,
    seatWidth: 20,
    rowSpacing: 35,
    viewQuality: 'good'
  },
  
  // ========== BAT & BARREL ==========
  {
    id: 'BATBARREL',
    name: 'Bat & Barrel',
    level: 'club',
    baseAngle: 90,
    angleSpan: 18,
    rows: generateRows('A', 'F', 35, 60, 26, true),
    vertices3D: [
      { x: 100, y: 60, z: 120 },
      { x: 120, y: 60, z: 130 },
      { x: 125, y: 76, z: 146 },
      { x: 105, y: 76, z: 136 }
    ],
    price: 'premium',
    distance: 125,
    height: 60,
    rake: 26,
    seatWidth: 21,
    rowSpacing: 36,
    viewQuality: 'excellent'
  },
  
  // ========== GRAY DUCK DECK ==========
  {
    id: 'GRAYDUCK',
    name: 'Gray Duck Deck',
    level: 'upper',
    baseAngle: 255,
    angleSpan: 12,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: -160, y: 70, z: 340 },
      { x: -145, y: 70, z: 355 },
      { x: -145, y: 70, z: 365 },
      { x: -160, y: 70, z: 350 }
    ],
      covered: false