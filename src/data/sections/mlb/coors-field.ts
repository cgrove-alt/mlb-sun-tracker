// Coors Field - Complete Section Data with 3D Geometry
// Denver, CO - Opened 1995 - Capacity 50,144
// Home of the Colorado Rockies

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
        overhangHeight: covered ? 32 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      // Special handling for purple row (Row 20 in upper deck)
      const isPurpleRow = i === 20 && baseElevation > 30;
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow,
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 32 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

// Coors Field Sections
export const coorsFieldSections: DetailedSection[] = [
  // ========== INFIELD BOX ==========
  {
    id: '117',
    name: 'Infield Box 117',
    level: 'field',
    baseAngle: 40, // Park orientation
    angleSpan: 8,
    rows: generateRows('A', 'Z', 22, 0, 19, false), // 26 rows
    vertices3D: [
      { x: -12, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 88, z: 14 },
      { x: -12, y: 88, z: 14 }
    ],
,

  {
    id: '157',
    name: 'Outfield Box 157',
    level: 'field',
    baseAngle: 310, // Left field
    angleSpan: 9,
    rows: generateRows(1, 35, 24, 0, 21, false),
    vertices3D: [
      { x: -88, y: -20, z: 0 },
      { x: -103, y: -35, z: 0 },
      { x: -120, y: -18, z: 19 },
      { x: -105, y: -3, z: 19 }
    ],
,

  // ========== ROCKPILE (Center Field Bleachers) ==========
  {
    id: 'ROCK',
    name: 'Rockpile',
    level: 'field',
    baseAngle: 220, // Center field
    angleSpan: 18,
    rows: generateRows(1, 40, 30, 8, 23, false), // 40 rows, affordable seating
    vertices3D: [
      { x: -40, y: 470, z: 8 },
      { x: 40, y: 470, z: 8 },
      { x: 40, y: 510, z: 38 },
      { x: -40, y: 510, z: 38 }
    ],
,

  {
    id: 'U343',
    name: 'Upper Mezzanine 343',
    level: 'upper',
    baseAngle: 130,
    angleSpan: 11,
    rows: generateRows(1, 38, 28, 42, 29, true),
    vertices3D: [
      { x: 135, y: -32, z: 42 },
      { x: 135, y: -14, z: 42 },
      { x: 195, y: -12, z: 88 },
      { x: 195, y: -30, z: 88 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'],
      coveragePercentage: 50,
      overhangDepth: 28,
      overhangHeight: 25,
      material: 'solid'
    },
    price: 'value',
    distance: 165,
    height: 42,
    rake: 29,
    seatWidth: 18,
    rowSpacing: 30,
    viewQuality: 'fair'
  },

  // ========== ROOFTOP (Largest Rooftop Deck in MLB) ==========
  {
    id: 'ROOF1',
    name: 'Rooftop Bar',
    level: 'standing',
    baseAngle: 175,
    angleSpan: 15,
    rows: [], // Standing room bar area
    vertices3D: [
      { x: 135, y: -60, z: 48 },
      { x: 165, y: -80, z: 48 },
      { x: 165, y: -55, z: 48 },
      { x: 135, y: -35, z: 48 }
    ],
,
  
  // ========== PURPLE ROW (Mile High Marker) ==========
  {
    id: 'PURPLE',
    name: 'Purple Row - Mile High',
    level: 'upper',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    baseAngle: 0,
    angleSpan: 360,
    distance: 250,
    height: 88.0,
    rake: 35,
    vertices3D: [
      { x: -180, y: 88, z: 180 },
      { x: 180, y: 88, z: 180 },
      { x: 180, y: 90, z: 200 },
      { x: -180, y: 90, z: 200 }
    ],
,
  
  // ========== JACK DANIELS TERRACE BAR ==========
  {
    id: 'JDBAR',
    name: 'Jack Daniels Terrace Bar',
    level: 'upper',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    baseAngle: 45,
    angleSpan: 30,
    distance: 420,
    height: 95.0,
    rake: 0,
    vertices3D: [
      { x: 150, y: 95, z: 380 },
      { x: 180, y: 95, z: 400 },
      { x: 180, y: 95, z: 420 },
      { x: 150, y: 95, z: 400 }
    ],

    ],
    baseAngle: 315,
    angleSpan: 35,
    distance: 410,
    height: 92.0,
    rake: 0,
    vertices3D: [
      { x: -150, y: 92, z: 380 },
      { x: -120, y: 92, z: 400 },
      { x: -120, y: 92, z: 420 },
      { x: -150, y: 92, z: 400 }
    ],
,
  
  // ========== COORS LIGHT SILVER BULLET BAR ==========
  {
    id: 'SILVER',
    name: 'Coors Light Silver Bullet Bar',
    level: 'field',
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    baseAngle: 270,
    angleSpan: 20,
    distance: 330,
    height: 12.0,
    rake: 0,
    vertices3D: [
      { x: -160, y: 12, z: 300 },
      { x: -140, y: 12, z: 320 },
      { x: -140, y: 12, z: 340 },
      { x: -160, y: 12, z: 320 }
    ],
      covered: false