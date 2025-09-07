// Truist Park - Complete Section Data with 3D Geometry
// Atlanta, GA - Opened 2017 - Capacity 41,084
// Home of the Atlanta Braves

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
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
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
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Truist Park Sections
export const truistParkSections: DetailedSection[] = [
  // ========== FIELD LEVEL ==========
  {
    id: '13',
    name: 'Field Level 13',
    level: 'field',
    baseAngle: 45, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'AA', 22, 0, 20, false), // 27 rows
    vertices3D: [
      { x: -12, y: 62, z: 0 },
      { x: 0, y: 62, z: 0 },
      { x: 0, y: 92, z: 17 },
      { x: -12, y: 92, z: 17 }
    ],
      covered: false  },

  {
    id: '227',
    name: 'Terrace Level 227',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 10,
    rows: generateRows(1, 32, 24, 17, 24, false),
    vertices3D: [
      { x: 92, y: 20, z: 17 },
      { x: 92, y: 5, z: 17 },
      { x: 130, y: 5, z: 40 },
      { x: 130, y: 20, z: 40 }
    ],
      covered: false  },

  // ========== PAVILION LEVEL ==========
  {
    id: '313',
    name: 'Pavilion Level 313',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: -30, y: 130, z: 40 },
      { x: -12, y: 130, z: 40 },
      { x: -10, y: 185, z: 78 },
      { x: -28, y: 185, z: 78 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 50,
      overhangDepth: 26,
      overhangHeight: 23,
      material: 'solid'
    },
    price: 'value',
    distance: 158,
    height: 40,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'good'
  },

  {
    id: '345',
    name: 'Pavilion Level 345',
    level: 'upper',
    baseAngle: 135, // Right field
    angleSpan: 11,
    rows: generateRows(1, 28, 26, 40, 28, true),
    vertices3D: [
      { x: 130, y: -30, z: 40 },
      { x: 130, y: -12, z: 40 },
      { x: 185, y: -10, z: 78 },
      { x: 185, y: -28, z: 78 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 50,
      overhangDepth: 26,
      overhangHeight: 23,
      material: 'solid'
    },
    price: 'value',
    distance: 158,
    height: 40,
    rake: 28,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== CHOPHOUSE (Right Field) ==========
  {
    id: 'CHOP',
    name: 'Chophouse',
    level: 'field',
    baseAngle: 135,
    angleSpan: 12,
    rows: generateRows(1, 18, 20, 8, 19, false),
    vertices3D: [
      { x: 100, y: -30, z: 8 },
      { x: 120, y: -45, z: 8 },
      { x: 130, y: -35, z: 25 },
      { x: 110, y: -20, z: 25 }
    ],
      covered: false  },

  {
    id: 'CHOP-TERR',
    name: 'Chophouse Terrace',
    level: 'standing',
    baseAngle: 135,
    angleSpan: 10,
    rows: [], // Standing/dining area
    vertices3D: [
      { x: 110, y: -40, z: 25 },
      { x: 130, y: -55, z: 25 },
      { x: 130, y: -40, z: 25 },
      { x: 110, y: -25, z: 25 }
    ],
      covered: false