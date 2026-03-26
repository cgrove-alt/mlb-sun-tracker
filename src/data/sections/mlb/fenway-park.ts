import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Fenway Park - Boston Red Sox
// Opened: 1912
// Capacity: 37,755
// Orientation: 110° (Home plate to center field)
// Features: Green Monster, Pesky's Pole, Manual scoreboard, Triangle

const generateRows = (startRow: string, endRow: string, seatsPerRow: number, startElevation: number, depthPerRow: number, rakeAngle: number = 12): RowDetail[] => {
  const rows: RowDetail[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG'];
  
  const startIdx = rowLetters.indexOf(startRow);
  const endIdx = rowLetters.indexOf(endRow);
  
  for (let i = startIdx; i <= endIdx; i++) {
    const rowNum = i - startIdx;
    const verticalRise = Math.sin(rakeAngle * Math.PI / 180) * depthPerRow * rowNum;
    
    rows.push({
      rowNumber: rowLetters[i],
      seats: seatsPerRow - Math.floor(rowNum * 0.3),
      elevation: startElevation + verticalRise,
      depth: rowNum * depthPerRow,
      covered: false
    });
  }
  
  return rows;
};

export const fenwayParkSections: DetailedSection[] = [
  // ========== FIELD BOX - Behind Home Plate ==========
  {
    id: 'FB-14',
    name: 'Field Box 14',
    level: 'field',
    baseAngle: 102, // Fenway orientation 110°
    angleSpan: 8,
    rows: generateRows('A', 'P', 20, 2, 2.5, 10),
    vertices3D: [
      { x: -12, y: 48, z: 2 },
      { x: -4, y: 48, z: 2 },
      { x: -4, y: 68, z: 8 },
      { x: -12, y: 68, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  {
    id: 'FB-15',
    name: 'Field Box 15',
    level: 'field',
    baseAngle: 110,
    angleSpan: 8,
    rows: generateRows('A', 'P', 20, 2, 2.5, 10),
    vertices3D: [
      { x: -4, y: 48, z: 2 },
      { x: 4, y: 48, z: 2 },
      { x: 4, y: 68, z: 8 },
      { x: -4, y: 68, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  {
    id: 'FB-16',
    name: 'Field Box 16',
    level: 'field',
    baseAngle: 118,
    angleSpan: 8,
    rows: generateRows('A', 'P', 20, 2, 2.5, 10),
    vertices3D: [
      { x: 4, y: 48, z: 2 },
      { x: 12, y: 48, z: 2 },
      { x: 12, y: 68, z: 8 },
      { x: 4, y: 68, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  // ========== DUGOUT BOX ==========
  {
    id: 'DB-39',
    name: 'Dugout Box 39',
    level: 'field',
    baseAngle: 126,
    angleSpan: 9,
    rows: generateRows('A', 'R', 18, 2, 2.5, 11),
    vertices3D: [
      { x: 12, y: 50, z: 2 },
      { x: 21, y: 53, z: 2 },
      { x: 24, y: 74, z: 10 },
      { x: 14, y: 70, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 2,
    rake: 11
  },
  {
    id: 'DB-40',
    name: 'Dugout Box 40',
    level: 'field',
    baseAngle: 135,
    angleSpan: 9,
    rows: generateRows('A', 'R', 18, 2, 2.5, 11),
    vertices3D: [
      { x: 21, y: 53, z: 2 },
      { x: 30, y: 58, z: 2 },
      { x: 34, y: 79, z: 10 },
      { x: 24, y: 74, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 11
  },
  {
    id: 'DB-13',
    name: 'Dugout Box 13',
    level: 'field',
    baseAngle: 94,
    angleSpan: 9,
    rows: generateRows('A', 'R', 18, 2, 2.5, 11),
    vertices3D: [
      { x: -12, y: 50, z: 2 },
      { x: -21, y: 53, z: 2 },
      { x: -24, y: 74, z: 10 },
      { x: -14, y: 70, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 2,
    rake: 11
  },
  {
    id: 'DB-12',
    name: 'Dugout Box 12',
    level: 'field',
    baseAngle: 85,
    angleSpan: 9,
    rows: generateRows('A', 'R', 18, 2, 2.5, 11),
    vertices3D: [
      { x: -21, y: 53, z: 2 },
      { x: -30, y: 58, z: 2 },
      { x: -34, y: 79, z: 10 },
      { x: -24, y: 74, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 11
  },
  // ========== LOGE BOX ==========
  {
    id: 'LB-101',
    name: 'Loge Box 101',
    level: 'lower',
    baseAngle: 94,
    angleSpan: 9,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: [
      { x: -15, y: 68, z: 12 },
      { x: -24, y: 72, z: 12 },
      { x: -27, y: 96, z: 22 },
      { x: -17, y: 92, z: 22 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-102',
    name: 'Loge Box 102',
    level: 'lower',
    baseAngle: 103,
    angleSpan: 9,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: [
      { x: -6, y: 68, z: 12 },
      { x: -15, y: 68, z: 12 },
      { x: -17, y: 92, z: 22 },
      { x: -7, y: 92, z: 22 }
    ] as Vector3D[],
    covered: false,
    distance: 73,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-103',
    name: 'Loge Box 103',
    level: 'lower',
    baseAngle: 112,
    angleSpan: 9,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: [
      { x: 3, y: 68, z: 12 },
      { x: -6, y: 68, z: 12 },
      { x: -7, y: 92, z: 22 },
      { x: 3, y: 92, z: 22 }
    ] as Vector3D[],
    covered: false,
    distance: 73,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-104',
    name: 'Loge Box 104',
    level: 'lower',
    baseAngle: 121,
    angleSpan: 9,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: [
      { x: 12, y: 70, z: 12 },
      { x: 3, y: 68, z: 12 },
      { x: 3, y: 92, z: 22 },
      { x: 13, y: 94, z: 22 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 13
  },
  // ========== GREEN MONSTER SEATS ==========
  {
    id: 'GM-1',
    name: 'Green Monster 1',
    level: 'field',
    baseAngle: 20,
    angleSpan: 8,
    rows: generateRows('A', 'C', 12, 37, 2, 8),
    vertices3D: [
      { x: -90, y: 150, z: 37 },
      { x: -82, y: 155, z: 37 },
      { x: -82, y: 161, z: 39 },
      { x: -90, y: 156, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 310,
    height: 37,
    rake: 8
  },
  {
    id: 'GM-2',
    name: 'Green Monster 2',
    level: 'field',
    baseAngle: 28,
    angleSpan: 8,
    rows: generateRows('A', 'C', 12, 37, 2, 8),
    vertices3D: [
      { x: -82, y: 155, z: 37 },
      { x: -74, y: 160, z: 37 },
      { x: -74, y: 166, z: 39 },
      { x: -82, y: 161, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 310,
    height: 37,
    rake: 8
  },
  {
    id: 'GM-3',
    name: 'Green Monster 3',
    level: 'field',
    baseAngle: 36,
    angleSpan: 8,
    rows: generateRows('A', 'C', 12, 37, 2, 8),
    vertices3D: [
      { x: -74, y: 160, z: 37 },
      { x: -66, y: 165, z: 37 },
      { x: -66, y: 171, z: 39 },
      { x: -74, y: 166, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 310,
    height: 37,
    rake: 8
  },
  // ========== INFIELD BOX ==========
  {
    id: 'IB-70',
    name: 'Infield Box 70',
    level: 'field',
    baseAngle: 144,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: [
      { x: 30, y: 58, z: 2 },
      { x: 40, y: 65, z: 2 },
      { x: 44, y: 87, z: 11 },
      { x: 33, y: 79, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 12
  },
  {
    id: 'IB-71',
    name: 'Infield Box 71',
    level: 'field',
    baseAngle: 154,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: [
      { x: 40, y: 65, z: 2 },
      { x: 50, y: 74, z: 2 },
      { x: 55, y: 96, z: 11 },
      { x: 44, y: 87, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 2,
    rake: 12
  },
  {
    id: 'IB-7',
    name: 'Infield Box 7',
    level: 'field',
    baseAngle: 76,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: [
      { x: -30, y: 58, z: 2 },
      { x: -40, y: 65, z: 2 },
      { x: -44, y: 87, z: 11 },
      { x: -33, y: 79, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 12
  },
  {
    id: 'IB-6',
    name: 'Infield Box 6',
    level: 'field',
    baseAngle: 66,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: [
      { x: -40, y: 65, z: 2 },
      { x: -50, y: 74, z: 2 },
      { x: -55, y: 96, z: 11 },
      { x: -44, y: 87, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 2,
    rake: 12
  },
  // ========== PAVILION BOX ==========
  {
    id: 'PB-1',
    name: 'Pavilion Box 1',
    level: 'upper',
    baseAngle: 80,
    angleSpan: 10,
    rows: generateRows('A', 'L', 24, 25, 2.8, 14),
    vertices3D: [
      { x: -35, y: 92, z: 25 },
      { x: -45, y: 98, z: 25 },
      { x: -50, y: 126, z: 38 },
      { x: -38, y: 120, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 25,
    rake: 14
  },
  {
    id: 'PB-2',
    name: 'Pavilion Box 2',
    level: 'upper',
    baseAngle: 90,
    angleSpan: 10,
    rows: generateRows('A', 'L', 24, 25, 2.8, 14),
    vertices3D: [
      { x: -25, y: 92, z: 25 },
      { x: -35, y: 92, z: 25 },
      { x: -38, y: 120, z: 38 },
      { x: -27, y: 120, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 94,
    height: 25,
    rake: 14
  },
  {
    id: 'PB-3',
    name: 'Pavilion Box 3',
    level: 'upper',
    baseAngle: 100,
    angleSpan: 10,
    rows: generateRows('A', 'L', 24, 25, 2.8, 14),
    vertices3D: [
      { x: -15, y: 92, z: 25 },
      { x: -25, y: 92, z: 25 },
      { x: -27, y: 120, z: 38 },
      { x: -16, y: 120, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 94,
    height: 25,
    rake: 14
  },
  // ========== BLEACHERS ==========
  {
    id: 'BL-34',
    name: 'Bleachers 34',
    level: 'field',
    baseAngle: 200,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: 15, y: 195, z: 8 },
      { x: 5, y: 205, z: 8 },
      { x: 7, y: 255, z: 28 },
      { x: 18, y: 245, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 200,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-35',
    name: 'Bleachers 35',
    level: 'field',
    baseAngle: 211,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: 5, y: 205, z: 8 },
      { x: -6, y: 212, z: 8 },
      { x: -5, y: 262, z: 28 },
      { x: 7, y: 255, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 208,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-36',
    name: 'Bleachers 36',
    level: 'field',
    baseAngle: 222,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: -6, y: 212, z: 8 },
      { x: -17, y: 218, z: 8 },
      { x: -17, y: 268, z: 28 },
      { x: -5, y: 262, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 215,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-37',
    name: 'Bleachers 37',
    level: 'field',
    baseAngle: 233,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: -17, y: 218, z: 8 },
      { x: -28, y: 222, z: 8 },
      { x: -29, y: 272, z: 28 },
      { x: -17, y: 268, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 8,
    rake: 20
  },
  // ========== RIGHT FIELD BOX ==========
  {
    id: 'RF-86',
    name: 'Right Field Box 86',
    level: 'field',
    baseAngle: 164,
    angleSpan: 10,
    rows: generateRows('A', 'R', 20, 5, 2.5, 15),
    vertices3D: [
      { x: 50, y: 74, z: 5 },
      { x: 60, y: 84, z: 5 },
      { x: 65, y: 108, z: 15 },
      { x: 54, y: 98, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 80,
    height: 5,
    rake: 15
  },
  {
    id: 'RF-87',
    name: 'Right Field Box 87',
    level: 'field',
    baseAngle: 174,
    angleSpan: 10,
    rows: generateRows('A', 'R', 20, 5, 2.5, 15),
    vertices3D: [
      { x: 60, y: 84, z: 5 },
      { x: 68, y: 96, z: 5 },
      { x: 74, y: 120, z: 15 },
      { x: 65, y: 108, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 90,
    height: 5,
    rake: 15
  },
  {
    id: 'RF-88',
    name: 'Right Field Box 88',
    level: 'field',
    baseAngle: 184,
    angleSpan: 10,
    rows: generateRows('A', 'R', 20, 5, 2.5, 15),
    vertices3D: [
      { x: 68, y: 96, z: 5 },
      { x: 75, y: 110, z: 5 },
      { x: 82, y: 135, z: 15 },
      { x: 74, y: 120, z: 15 }
    ] as Vector3D[],
    covered: false,
    distance: 103,
    height: 5,
    rake: 15
  },
  // ========== GRANDSTAND ==========
  {
    id: 'GS-1',
    name: 'Grandstand 1',
    level: 'upper',
    baseAngle: 65,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: [
      { x: -55, y: 98, z: 30 },
      { x: -66, y: 108, z: 30 },
      { x: -72, y: 165, z: 57 },
      { x: -60, y: 155, z: 57 }
    ] as Vector3D[],
    covered: true,
    distance: 103,
    height: 30,
    rake: 15
  },
  {
    id: 'GS-2',
    name: 'Grandstand 2',
    level: 'upper',
    baseAngle: 76,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: [
      { x: -44, y: 96, z: 30 },
      { x: -55, y: 98, z: 30 },
      { x: -60, y: 155, z: 57 },
      { x: -48, y: 153, z: 57 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 30,
    rake: 15
  },
  {
    id: 'GS-3',
    name: 'Grandstand 3',
    level: 'upper',
    baseAngle: 87,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: [
      { x: -33, y: 94, z: 30 },
      { x: -44, y: 96, z: 30 },
      { x: -48, y: 153, z: 57 },
      { x: -36, y: 151, z: 57 }
    ] as Vector3D[],
    covered: true,
    distance: 98,
    height: 30,
    rake: 15
  },
  {
    id: 'GS-4',
    name: 'Grandstand 4',
    level: 'upper',
    baseAngle: 98,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: [
      { x: -22, y: 92, z: 30 },
      { x: -33, y: 94, z: 30 },
      { x: -36, y: 151, z: 57 },
      { x: -24, y: 149, z: 57 }
    ] as Vector3D[],
    covered: true,
    distance: 96,
    height: 30,
    rake: 15
  },
  {
    id: 'GS-5',
    name: 'Grandstand 5',
    level: 'upper',
    baseAngle: 109,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: [
      { x: -11, y: 92, z: 30 },
      { x: -22, y: 92, z: 30 },
      { x: -24, y: 149, z: 57 },
      { x: -12, y: 149, z: 57 }
    ] as Vector3D[],
    covered: true,
    distance: 96,
    height: 30,
    rake: 15
  },
  {
    id: 'GS-14',
    name: 'Grandstand 14',
    level: 'upper',
    baseAngle: 120,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: [
      { x: 0, y: 92, z: 30 },
      { x: -11, y: 92, z: 30 },
      { x: -12, y: 149, z: 57 },
      { x: 0, y: 149, z: 57 }
    ] as Vector3D[],
    covered: true,
    distance: 96,
    height: 30,
    rake: 15
  },
  {
    id: 'GS-15',
    name: 'Grandstand 15',
    level: 'upper',
    baseAngle: 131,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: [
      { x: 11, y: 94, z: 30 },
      { x: 0, y: 92, z: 30 },
      { x: 0, y: 149, z: 57 },
      { x: 12, y: 151, z: 57 }
    ] as Vector3D[],
    covered: true,
    distance: 98,
    height: 30,
    rake: 15
  },
  {
    id: 'GS-16',
    name: 'Grandstand 16',
    level: 'upper',
    baseAngle: 142,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: [
      { x: 22, y: 96, z: 30 },
      { x: 11, y: 94, z: 30 },
      { x: 12, y: 151, z: 57 },
      { x: 24, y: 153, z: 57 }
    ] as Vector3D[],
    covered: true,
    distance: 100,
    height: 30,
    rake: 15
  },
  {
    id: 'GS-17',
    name: 'Grandstand 17',
    level: 'upper',
    baseAngle: 153,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: [
      { x: 33, y: 100, z: 30 },
      { x: 22, y: 96, z: 30 },
      { x: 24, y: 153, z: 57 },
      { x: 36, y: 157, z: 57 }
    ] as Vector3D[],
    covered: true,
    distance: 104,
    height: 30,
    rake: 15
  },
  // ========== EMC CLUB ==========
  {
    id: 'EMC-406',
    name: 'EMC Club 406',
    level: 'club',
    baseAngle: 104,
    angleSpan: 10,
    rows: generateRows('A', 'H', 18, 35, 2.7, 12),
    vertices3D: [
      { x: -8, y: 105, z: 35 },
      { x: 2, y: 105, z: 35 },
      { x: 2, y: 125, z: 42 },
      { x: -8, y: 125, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 110,
    height: 35,
    rake: 12
  },
  {
    id: 'EMC-407',
    name: 'EMC Club 407',
    level: 'club',
    baseAngle: 114,
    angleSpan: 10,
    rows: generateRows('A', 'H', 18, 35, 2.7, 12),
    vertices3D: [
      { x: 2, y: 105, z: 35 },
      { x: 12, y: 105, z: 35 },
      { x: 12, y: 125, z: 42 },
      { x: 2, y: 125, z: 42 }
    ] as Vector3D[],
    covered: true,
    distance: 110,
    height: 35,
    rake: 12
  },
  // ========== MONSTER STANDING ROOM ==========
  {
    id: 'MONSTER-SRO',
    name: 'Monster Standing Room',
    level: 'standing',
    baseAngle: 30,
    angleSpan: 15,
    rows: [],
    vertices3D: [
      { x: -85, y: 165, z: 40 },
      { x: -70, y: 172, z: 40 },
      { x: -70, y: 185, z: 40 },
      { x: -85, y: 178, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 315,
    height: 40,
    rake: 0
  },
  // ========== SAM DECK ==========
  {
    id: 'SAM-DECK',
    name: 'Sam Deck',
    level: 'standing',
    baseAngle: 165,
    angleSpan: 12,
    rows: [],
    vertices3D: [
      { x: 75, y: 110, z: 28 },
      { x: 85, y: 122, z: 28 },
      { x: 88, y: 138, z: 28 },
      { x: 78, y: 126, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 118,
    height: 28,
    rake: 0
  },
  // ========== COCA-COLA CORNER ==========
  {
    id: 'COCA-COLA',
    name: 'Coca-Cola Corner',
    level: 'standing',
    baseAngle: 45,
    angleSpan: 10,
    rows: [],
    vertices3D: [
      { x: -60, y: 165, z: 25 },
      { x: -50, y: 170, z: 25 },
      { x: -50, y: 185, z: 25 },
      { x: -60, y: 180, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 310,
    height: 25,
    rake: 0
  }
];

// Stadium features
export const fenwayParkFeatures = {
  retractableRoof: false,
  roofHeight: 0,
  roofMaterial: {
    opacity: 0.0,
    reflectivity: 0.0
  }
};

// Export section map for easy lookup
export const fenwayParkSectionMap = new Map(
  fenwayParkSections.map(section => [section.id, section])
);