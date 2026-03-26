// Busch Stadium - Comprehensive Section Data
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

export const buschstadiumSections: DetailedSection[] = [
  // Field Level - Behind Home Plate
  {
    id: 'field-145',
    name: 'Field Box 145',
    level: 'field',
    baseAngle: 0,
    angleSpan: 6,
    rows: generateRows('A', 'Z', 20, 2, 18, false),
    vertices3D: [
      { x: -15, y: 2, z: 50 },
      { x: -10, y: 2, z: 50 },
      { x: -12, y: 45, z: 85 },
      { x: -17, y: 45, z: 85 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 18
  },
  {
    id: 'field-146',
    name: 'Field Box 146',
    level: 'field',
    baseAngle: 6,
    angleSpan: 6,
    rows: generateRows('A', 'Z', 20, 2, 18, false),
    vertices3D: [
      { x: -10, y: 2, z: 50 },
      { x: -5, y: 2, z: 50 },
      { x: -7, y: 45, z: 85 },
      { x: -12, y: 45, z: 85 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 18
  },
  {
    id: 'field-147',
    name: 'Field Box 147',
    level: 'field',
    baseAngle: 354,
    angleSpan: 6,
    rows: generateRows('A', 'Z', 20, 2, 18, false),
    vertices3D: [
      { x: -5, y: 2, z: 50 },
      { x: 0, y: 2, z: 50 },
      { x: -2, y: 45, z: 85 },
      { x: -7, y: 45, z: 85 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 18
  },
  {
    id: 'field-148',
    name: 'Field Box 148',
    level: 'field',
    baseAngle: 0,
    angleSpan: 6,
    rows: generateRows('A', 'Z', 20, 2, 18, false),
    vertices3D: [
      { x: 0, y: 2, z: 50 },
      { x: 5, y: 2, z: 50 },
      { x: 3, y: 45, z: 85 },
      { x: -2, y: 45, z: 85 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 18
  },
  {
    id: 'field-149',
    name: 'Field Box 149',
    level: 'field',
    baseAngle: 6,
    angleSpan: 6,
    rows: generateRows('A', 'Z', 20, 2, 18, false),
    vertices3D: [
      { x: 5, y: 2, z: 50 },
      { x: 10, y: 2, z: 50 },
      { x: 8, y: 45, z: 85 },
      { x: 3, y: 45, z: 85 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 18
  },
  {
    id: 'field-150',
    name: 'Field Box 150',
    level: 'field',
    baseAngle: 12,
    angleSpan: 6,
    rows: generateRows('A', 'Z', 20, 2, 18, false),
    vertices3D: [
      { x: 10, y: 2, z: 50 },
      { x: 15, y: 2, z: 50 },
      { x: 13, y: 45, z: 85 },
      { x: 8, y: 45, z: 85 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 18
  },
  // Field Level - First Base Line
  {
    id: 'field-131',
    name: 'Field Box 131',
    level: 'field',
    baseAngle: 18,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 22, 2, 20, false),
    vertices3D: [
      { x: 15, y: 2, z: 50 },
      { x: 25, y: 2, z: 55 },
      { x: 27, y: 50, z: 95 },
      { x: 17, y: 50, z: 90 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 20,
    rake: 20
  },
  {
    id: 'field-132',
    name: 'Field Box 132',
    level: 'field',
    baseAngle: 25,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 22, 2, 20, false),
    vertices3D: [
      { x: 25, y: 2, z: 55 },
      { x: 35, y: 2, z: 60 },
      { x: 38, y: 50, z: 100 },
      { x: 27, y: 50, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 20,
    rake: 20
  },
  {
    id: 'field-133',
    name: 'Field Box 133',
    level: 'field',
    baseAngle: 32,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 22, 2, 20, false),
    vertices3D: [
      { x: 35, y: 2, z: 60 },
      { x: 45, y: 2, z: 65 },
      { x: 48, y: 50, z: 105 },
      { x: 38, y: 50, z: 100 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 20,
    rake: 20
  },
  {
    id: 'field-134',
    name: 'Field Box 134',
    level: 'field',
    baseAngle: 39,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 22, 2, 20, false),
    vertices3D: [
      { x: 45, y: 2, z: 65 },
      { x: 55, y: 2, z: 70 },
      { x: 58, y: 50, z: 110 },
      { x: 48, y: 50, z: 105 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 20,
    rake: 20
  },
  // Field Level - Third Base Line
  {
    id: 'field-161',
    name: 'Field Box 161',
    level: 'field',
    baseAngle: 342,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 22, 2, 20, false),
    vertices3D: [
      { x: -15, y: 2, z: 50 },
      { x: -25, y: 2, z: 55 },
      { x: -27, y: 50, z: 95 },
      { x: -17, y: 50, z: 90 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 20,
    rake: 20
  },
  {
    id: 'field-162',
    name: 'Field Box 162',
    level: 'field',
    baseAngle: 335,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 22, 2, 20, false),
    vertices3D: [
      { x: -25, y: 2, z: 55 },
      { x: -35, y: 2, z: 60 },
      { x: -38, y: 50, z: 100 },
      { x: -27, y: 50, z: 95 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 20,
    rake: 20
  },
  {
    id: 'field-163',
    name: 'Field Box 163',
    level: 'field',
    baseAngle: 328,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 22, 2, 20, false),
    vertices3D: [
      { x: -35, y: 2, z: 60 },
      { x: -45, y: 2, z: 65 },
      { x: -48, y: 50, z: 105 },
      { x: -38, y: 50, z: 100 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 20,
    rake: 20
  },
  {
    id: 'field-164',
    name: 'Field Box 164',
    level: 'field',
    baseAngle: 321,
    angleSpan: 7,
    rows: generateRows('A', 'Z', 22, 2, 20, false),
    vertices3D: [
      { x: -45, y: 2, z: 65 },
      { x: -55, y: 2, z: 70 },
      { x: -58, y: 50, z: 110 },
      { x: -48, y: 50, z: 105 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 20,
    rake: 20
  },
  // Pavilion Level - Right Field
  {
    id: 'pavilion-101',
    name: 'Pavilion 101',
    level: 'field',
    baseAngle: 46,
    angleSpan: 8,
    rows: generateRows(1, 18, 24, 8, 22, false),
    vertices3D: [
      { x: 70, y: 8, z: 85 },
      { x: 85, y: 8, z: 100 },
      { x: 90, y: 48, z: 145 },
      { x: 75, y: 48, z: 130 }
    ] as Vector3D[],
    covered: false,
    distance: 100,
    height: 25,
    rake: 22
  },
  {
    id: 'pavilion-102',
    name: 'Pavilion 102',
    level: 'field',
    baseAngle: 54,
    angleSpan: 8,
    rows: generateRows(1, 18, 24, 8, 22, false),
    vertices3D: [
      { x: 85, y: 8, z: 100 },
      { x: 100, y: 8, z: 120 },
      { x: 105, y: 48, z: 165 },
      { x: 90, y: 48, z: 145 }
    ] as Vector3D[],
    covered: false,
    distance: 120,
    height: 25,
    rake: 22
  },
  {
    id: 'pavilion-103',
    name: 'Pavilion 103',
    level: 'field',
    baseAngle: 62,
    angleSpan: 8,
    rows: generateRows(1, 18, 24, 8, 22, false),
    vertices3D: [
      { x: 100, y: 8, z: 120 },
      { x: 115, y: 8, z: 145 },
      { x: 120, y: 48, z: 190 },
      { x: 105, y: 48, z: 165 }
    ] as Vector3D[],
    covered: false,
    distance: 145,
    height: 25,
    rake: 22
  },
  // Pavilion Level - Left Field
  {
    id: 'pavilion-191',
    name: 'Pavilion 191',
    level: 'field',
    baseAngle: 314,
    angleSpan: 8,
    rows: generateRows(1, 18, 24, 8, 22, false),
    vertices3D: [
      { x: -70, y: 8, z: 85 },
      { x: -85, y: 8, z: 100 },
      { x: -90, y: 48, z: 145 },
      { x: -75, y: 48, z: 130 }
    ] as Vector3D[],
    covered: false,
    distance: 100,
    height: 25,
    rake: 22
  },
  {
    id: 'pavilion-192',
    name: 'Pavilion 192',
    level: 'field',
    baseAngle: 306,
    angleSpan: 8,
    rows: generateRows(1, 18, 24, 8, 22, false),
    vertices3D: [
      { x: -85, y: 8, z: 100 },
      { x: -100, y: 8, z: 120 },
      { x: -105, y: 48, z: 165 },
      { x: -90, y: 48, z: 145 }
    ] as Vector3D[],
    covered: false,
    distance: 120,
    height: 25,
    rake: 22
  },
  {
    id: 'pavilion-193',
    name: 'Pavilion 193',
    level: 'field',
    baseAngle: 298,
    angleSpan: 8,
    rows: generateRows(1, 18, 24, 8, 22, false),
    vertices3D: [
      { x: -100, y: 8, z: 120 },
      { x: -115, y: 8, z: 145 },
      { x: -120, y: 48, z: 190 },
      { x: -105, y: 48, z: 165 }
    ] as Vector3D[],
    covered: false,
    distance: 145,
    height: 25,
    rake: 22
  },
  // Terrace Level
  {
    id: 'terrace-245',
    name: 'Terrace 245',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 6,
    rows: generateRows(1, 24, 18, 55, 24, false),
    vertices3D: [
      { x: -12, y: 55, z: 90 },
      { x: -6, y: 55, z: 90 },
      { x: -8, y: 95, z: 130 },
      { x: -14, y: 95, z: 130 }
    ] as Vector3D[],
    covered: false,
    distance: 90,
    height: 55,
    rake: 24
  },
  {
    id: 'terrace-246',
    name: 'Terrace 246',
    level: 'lower',
    baseAngle: 6,
    angleSpan: 6,
    rows: generateRows(1, 24, 18, 55, 24, false),
    vertices3D: [
      { x: -6, y: 55, z: 90 },
      { x: 0, y: 55, z: 90 },
      { x: -2, y: 95, z: 130 },
      { x: -8, y: 95, z: 130 }
    ] as Vector3D[],
    covered: false,
    distance: 90,
    height: 55,
    rake: 24
  },
  {
    id: 'terrace-247',
    name: 'Terrace 247',
    level: 'lower',
    baseAngle: 354,
    angleSpan: 6,
    rows: generateRows(1, 24, 18, 55, 24, false),
    vertices3D: [
      { x: 0, y: 55, z: 90 },
      { x: 6, y: 55, z: 90 },
      { x: 4, y: 95, z: 130 },
      { x: -2, y: 95, z: 130 }
    ] as Vector3D[],
    covered: false,
    distance: 90,
    height: 55,
    rake: 24
  },
  {
    id: 'terrace-248',
    name: 'Terrace 248',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 6,
    rows: generateRows(1, 24, 18, 55, 24, false),
    vertices3D: [
      { x: 6, y: 55, z: 90 },
      { x: 12, y: 55, z: 90 },
      { x: 10, y: 95, z: 130 },
      { x: 4, y: 95, z: 130 }
    ] as Vector3D[],
    covered: false,
    distance: 90,
    height: 55,
    rake: 24
  },
  // Redbird Club Level
  {
    id: 'redbird-club-345',
    name: 'Redbird Club 345',
    level: 'club',
    baseAngle: 0,
    angleSpan: 8,
    rows: generateRows('A', 'P', 16, 100, 16, true),
    vertices3D: [
      { x: -20, y: 100, z: 135 },
      { x: -10, y: 100, z: 135 },
      { x: -12, y: 130, z: 165 },
      { x: -22, y: 130, z: 165 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 100,
    rake: 16
  },
  {
    id: 'redbird-club-346',
    name: 'Redbird Club 346',
    level: 'club',
    baseAngle: 8,
    angleSpan: 8,
    rows: generateRows('A', 'P', 16, 100, 16, true),
    vertices3D: [
      { x: -10, y: 100, z: 135 },
      { x: 0, y: 100, z: 135 },
      { x: -2, y: 130, z: 165 },
      { x: -12, y: 130, z: 165 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 100,
    rake: 16
  },
  {
    id: 'redbird-club-347',
    name: 'Redbird Club 347',
    level: 'club',
    baseAngle: 352,
    angleSpan: 8,
    rows: generateRows('A', 'P', 16, 100, 16, true),
    vertices3D: [
      { x: 0, y: 100, z: 135 },
      { x: 10, y: 100, z: 135 },
      { x: 8, y: 130, z: 165 },
      { x: -2, y: 130, z: 165 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 100,
    rake: 16
  },
  {
    id: 'redbird-club-348',
    name: 'Redbird Club 348',
    level: 'club',
    baseAngle: 0,
    angleSpan: 8,
    rows: generateRows('A', 'P', 16, 100, 16, true),
    vertices3D: [
      { x: 10, y: 100, z: 135 },
      { x: 20, y: 100, z: 135 },
      { x: 18, y: 130, z: 165 },
      { x: 8, y: 130, z: 165 }
    ] as Vector3D[],
    covered: true,
    distance: 135,
    height: 100,
    rake: 16
  },
  // Upper Deck
  {
    id: 'upper-445',
    name: 'Upper Deck 445',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 6,
    rows: generateRows(1, 32, 20, 135, 28, false),
    vertices3D: [
      { x: -18, y: 135, z: 170 },
      { x: -12, y: 135, z: 170 },
      { x: -14, y: 180, z: 215 },
      { x: -20, y: 180, z: 215 }
    ] as Vector3D[],
    covered: false,
    distance: 170,
    height: 135,
    rake: 28
  },
  {
    id: 'upper-446',
    name: 'Upper Deck 446',
    level: 'upper',
    baseAngle: 6,
    angleSpan: 6,
    rows: generateRows(1, 32, 20, 135, 28, false),
    vertices3D: [
      { x: -12, y: 135, z: 170 },
      { x: -6, y: 135, z: 170 },
      { x: -8, y: 180, z: 215 },
      { x: -14, y: 180, z: 215 }
    ] as Vector3D[],
    covered: false,
    distance: 170,
    height: 135,
    rake: 28
  },
  {
    id: 'upper-447',
    name: 'Upper Deck 447',
    level: 'upper',
    baseAngle: 354,
    angleSpan: 6,
    rows: generateRows(1, 32, 20, 135, 28, false),
    vertices3D: [
      { x: -6, y: 135, z: 170 },
      { x: 0, y: 135, z: 170 },
      { x: -2, y: 180, z: 215 },
      { x: -8, y: 180, z: 215 }
    ] as Vector3D[],
    covered: false,
    distance: 170,
    height: 135,
    rake: 28
  },
  {
    id: 'upper-448',
    name: 'Upper Deck 448',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 6,
    rows: generateRows(1, 32, 20, 135, 28, false),
    vertices3D: [
      { x: 0, y: 135, z: 170 },
      { x: 6, y: 135, z: 170 },
      { x: 4, y: 180, z: 215 },
      { x: -2, y: 180, z: 215 }
    ] as Vector3D[],
    covered: false,
    distance: 170,
    height: 135,
    rake: 28
  },
  {
    id: 'upper-449',
    name: 'Upper Deck 449',
    level: 'upper',
    baseAngle: 6,
    angleSpan: 6,
    rows: generateRows(1, 32, 20, 135, 28, false),
    vertices3D: [
      { x: 6, y: 135, z: 170 },
      { x: 12, y: 135, z: 170 },
      { x: 10, y: 180, z: 215 },
      { x: 4, y: 180, z: 215 }
    ] as Vector3D[],
    covered: false,
    distance: 170,
    height: 135,
    rake: 28
  },
  {
    id: 'upper-450',
    name: 'Upper Deck 450',
    level: 'upper',
    baseAngle: 12,
    angleSpan: 6,
    rows: generateRows(1, 32, 20, 135, 28, false),
    vertices3D: [
      { x: 12, y: 135, z: 170 },
      { x: 18, y: 135, z: 170 },
      { x: 16, y: 180, z: 215 },
      { x: 10, y: 180, z: 215 }
    ] as Vector3D[],
    covered: false,
    distance: 170,
    height: 135,
    rake: 28
  },
  // Big Mac Land (Left Field)
  {
    id: 'big-mac-land',
    name: 'Big Mac Land',
    level: 'field',
    baseAngle: 270,
    angleSpan: 20,
    rows: generateRows(1, 15, 30, 15, 20, false),
    vertices3D: [
      { x: -140, y: 15, z: 240 },
      { x: -130, y: 15, z: 260 },
      { x: -135, y: 45, z: 290 },
      { x: -145, y: 45, z: 270 }
    ] as Vector3D[],
    covered: false,
    distance: 250,
    height: 15,
    rake: 20
  },
  // Budweiser Terrace (Right Field)
  {
    id: 'budweiser-terrace',
    name: 'Budweiser Terrace',
    level: 'field',
    baseAngle: 90,
    angleSpan: 20,
    rows: generateRows(1, 12, 25, 25, 18, false),
    vertices3D: [
      { x: 130, y: 25, z: 260 },
      { x: 140, y: 25, z: 240 },
      { x: 145, y: 45, z: 270 },
      { x: 135, y: 45, z: 290 }
    ] as Vector3D[],
    covered: false,
    distance: 250,
    height: 25,
    rake: 18
  },
  // Cardinals Nation (Center Field)
  {
    id: 'cardinals-nation',
    name: 'Cardinals Nation',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 30,
    rows: generateRows(1, 5, 100, 120, 5, false),
    vertices3D: [
      { x: -30, y: 120, z: 400 },
      { x: 30, y: 120, z: 400 },
      { x: 30, y: 125, z: 420 },
      { x: -30, y: 125, z: 420 }
    ] as Vector3D[],
    covered: false,
    distance: 400,
    height: 120,
    rake: 5
  },
  // Bleachers - Left Center
  {
    id: 'bleachers-501',
    name: 'Bleachers 501',
    level: 'field',
    baseAngle: 210,
    angleSpan: 15,
    rows: generateRows(1, 20, 28, 10, 25, false),
    vertices3D: [
      { x: -110, y: 10, z: 320 },
      { x: -90, y: 10, z: 340 },
      { x: -95, y: 60, z: 390 },
      { x: -115, y: 60, z: 370 }
    ] as Vector3D[],
    covered: false,
    distance: 330,
    height: 10,
    rake: 25
  },
  {
    id: 'bleachers-502',
    name: 'Bleachers 502',
    level: 'field',
    baseAngle: 195,
    angleSpan: 15,
    rows: generateRows(1, 20, 28, 10, 25, false),
    vertices3D: [
      { x: -90, y: 10, z: 340 },
      { x: -70, y: 10, z: 360 },
      { x: -75, y: 60, z: 410 },
      { x: -95, y: 60, z: 390 }
    ] as Vector3D[],
    covered: false,
    distance: 350,
    height: 10,
    rake: 25
  },
  // Bleachers - Right Center
  {
    id: 'bleachers-505',
    name: 'Bleachers 505',
    level: 'field',
    baseAngle: 150,
    angleSpan: 15,
    rows: generateRows(1, 20, 28, 10, 25, false),
    vertices3D: [
      { x: 110, y: 10, z: 320 },
      { x: 90, y: 10, z: 340 },
      { x: 95, y: 60, z: 390 },
      { x: 115, y: 60, z: 370 }
    ] as Vector3D[],
    covered: false,
    distance: 330,
    height: 10,
    rake: 25
  },
  {
    id: 'bleachers-506',
    name: 'Bleachers 506',
    level: 'field',
    baseAngle: 165,
    angleSpan: 15,
    rows: generateRows(1, 20, 28, 10, 25, false),
    vertices3D: [
      { x: 90, y: 10, z: 340 },
      { x: 70, y: 10, z: 360 },
      { x: 75, y: 60, z: 410 },
      { x: 95, y: 60, z: 390 }
    ] as Vector3D[],
    covered: false,
    distance: 350,
    height: 10,
    rake: 25
  }
];

// Export section map for easy lookup
export const buschstadiumSectionMap = new Map(
  buschstadiumSections.map(section => [section.id, section])
);