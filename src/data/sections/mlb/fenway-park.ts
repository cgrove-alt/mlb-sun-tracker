import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Fenway Park - Boston Red Sox
// Opened: 1912 (oldest MLB ballpark)
// Capacity: 37,755
// Orientation: Home plate to CF = 110° from north
// Features: Green Monster (37ft wall), Pesky's Pole (302ft RF), Manual scoreboard, Triangle in CF
// Unique: Intimate setting, quirky dimensions, historic venue

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

// Helper for calculating vertices
const calcVertices = (angle: number, angleSpan: number, frontDist: number, backDist: number, frontElev: number, backElev: number): Vector3D[] => {
  const deg2rad = Math.PI / 180;
  return [
    { x: frontDist * Math.cos(angle * deg2rad), y: frontDist * Math.sin(angle * deg2rad), z: frontElev },
    { x: frontDist * Math.cos((angle + angleSpan) * deg2rad), y: frontDist * Math.sin((angle + angleSpan) * deg2rad), z: frontElev },
    { x: backDist * Math.cos((angle + angleSpan) * deg2rad), y: backDist * Math.sin((angle + angleSpan) * deg2rad), z: backElev },
    { x: backDist * Math.cos(angle * deg2rad), y: backDist * Math.sin(angle * deg2rad), z: backElev }
  ];
};

export const fenwayParkSections: DetailedSection[] = [
  // ========== FIELD BOX - Third Base Side (Sections 1-42) ==========
  {
    id: 'FB-1',
    name: 'Field Box 1',
    level: 'field',
    baseAngle: 76,
    angleSpan: 7,
    rows: generateRows('A', 'P', 18, 2, 2.5, 10),
    vertices3D: calcVertices(76, 7, 48, 68, 2, 8) as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  {
    id: 'FB-2',
    name: 'Field Box 2',
    level: 'field',
    baseAngle: 83,
    angleSpan: 7,
    rows: generateRows('A', 'P', 18, 2, 2.5, 10),
    vertices3D: calcVertices(83, 7, 48, 68, 2, 8) as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  {
    id: 'FB-3',
    name: 'Field Box 3',
    level: 'field',
    baseAngle: 90,
    angleSpan: 7,
    rows: generateRows('A', 'P', 19, 2, 2.5, 10),
    vertices3D: calcVertices(90, 7, 48, 68, 2, 8) as Vector3D[],
    covered: false,
    distance: 49,
    height: 2,
    rake: 10
  },
  {
    id: 'FB-14',
    name: 'Field Box 14',
    level: 'field',
    baseAngle: 102,
    angleSpan: 8,
    rows: generateRows('A', 'P', 20, 2, 2.5, 10),
    vertices3D: calcVertices(102, 8, 48, 68, 2, 8) as Vector3D[],
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
    vertices3D: calcVertices(110, 8, 48, 68, 2, 8) as Vector3D[],
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
    vertices3D: calcVertices(118, 8, 48, 68, 2, 8) as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  {
    id: 'FB-27',
    name: 'Field Box 27',
    level: 'field',
    baseAngle: 130,
    angleSpan: 8,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: calcVertices(130, 8, 52, 72, 2, 9) as Vector3D[],
    covered: false,
    distance: 54,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-28',
    name: 'Field Box 28',
    level: 'field',
    baseAngle: 138,
    angleSpan: 8,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: calcVertices(138, 8, 54, 74, 2, 9) as Vector3D[],
    covered: false,
    distance: 56,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-39',
    name: 'Field Box 39',
    level: 'field',
    baseAngle: 126,
    angleSpan: 9,
    rows: generateRows('A', 'R', 18, 2, 2.5, 11),
    vertices3D: calcVertices(126, 9, 50, 74, 2, 10) as Vector3D[],
    covered: false,
    distance: 55,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-40',
    name: 'Field Box 40',
    level: 'field',
    baseAngle: 135,
    angleSpan: 9,
    rows: generateRows('A', 'R', 18, 2, 2.5, 11),
    vertices3D: calcVertices(135, 9, 53, 79, 2, 10) as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-41',
    name: 'Field Box 41',
    level: 'field',
    baseAngle: 144,
    angleSpan: 10,
    rows: generateRows('A', 'R', 18, 2, 2.5, 12),
    vertices3D: calcVertices(144, 10, 58, 87, 2, 11) as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 12
  },
  {
    id: 'FB-42',
    name: 'Field Box 42',
    level: 'field',
    baseAngle: 154,
    angleSpan: 10,
    rows: generateRows('A', 'S', 20, 2, 2.5, 12),
    vertices3D: calcVertices(154, 10, 65, 96, 2, 11) as Vector3D[],
    covered: false,
    distance: 70,
    height: 2,
    rake: 12
  },

  // ========== DUGOUT BOX ==========
  {
    id: 'DB-6',
    name: 'Dugout Box 6',
    level: 'field',
    baseAngle: 66,
    angleSpan: 10,
    rows: generateRows('A', 'R', 22, 2, 2.5, 12),
    vertices3D: calcVertices(66, 10, 65, 96, 2, 11) as Vector3D[],
    covered: false,
    distance: 70,
    height: 2,
    rake: 12
  },
  {
    id: 'DB-7',
    name: 'Dugout Box 7',
    level: 'field',
    baseAngle: 76,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: calcVertices(76, 10, 58, 87, 2, 11) as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 12
  },
  {
    id: 'DB-12',
    name: 'Dugout Box 12',
    level: 'field',
    baseAngle: 85,
    angleSpan: 9,
    rows: generateRows('A', 'R', 18, 2, 2.5, 11),
    vertices3D: calcVertices(85, 9, 53, 79, 2, 10) as Vector3D[],
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
    vertices3D: calcVertices(94, 9, 50, 74, 2, 10) as Vector3D[],
    covered: false,
    distance: 55,
    height: 2,
    rake: 11
  },
  {
    id: 'DB-39',
    name: 'Dugout Box 39',
    level: 'field',
    baseAngle: 126,
    angleSpan: 9,
    rows: generateRows('A', 'R', 18, 2, 2.5, 11),
    vertices3D: calcVertices(126, 9, 50, 74, 2, 10) as Vector3D[],
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
    vertices3D: calcVertices(135, 9, 53, 79, 2, 10) as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 11
  },

  // ========== LOGE BOX (Behind Field Level) - Sections 93-168 ==========
  {
    id: 'LB-93',
    name: 'Loge Box 93',
    level: 'lower',
    baseAngle: 66,
    angleSpan: 8,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: calcVertices(66, 8, 75, 96, 12, 22) as Vector3D[],
    covered: false,
    distance: 78,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-94',
    name: 'Loge Box 94',
    level: 'lower',
    baseAngle: 74,
    angleSpan: 8,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: calcVertices(74, 8, 73, 96, 12, 22) as Vector3D[],
    covered: false,
    distance: 76,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-101',
    name: 'Loge Box 101',
    level: 'lower',
    baseAngle: 94,
    angleSpan: 9,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: calcVertices(94, 9, 68, 92, 12, 22) as Vector3D[],
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
    vertices3D: calcVertices(103, 9, 68, 92, 12, 22) as Vector3D[],
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
    vertices3D: calcVertices(112, 9, 68, 92, 12, 22) as Vector3D[],
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
    vertices3D: calcVertices(121, 9, 70, 94, 12, 22) as Vector3D[],
    covered: false,
    distance: 75,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-130',
    name: 'Loge Box 130',
    level: 'lower',
    baseAngle: 130,
    angleSpan: 8,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: calcVertices(130, 8, 72, 96, 12, 22) as Vector3D[],
    covered: false,
    distance: 76,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-131',
    name: 'Loge Box 131',
    level: 'lower',
    baseAngle: 138,
    angleSpan: 8,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: calcVertices(138, 8, 74, 98, 12, 22) as Vector3D[],
    covered: false,
    distance: 78,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-146',
    name: 'Loge Box 146',
    level: 'lower',
    baseAngle: 146,
    angleSpan: 8,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: calcVertices(146, 8, 76, 100, 12, 22) as Vector3D[],
    covered: false,
    distance: 80,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-154',
    name: 'Loge Box 154',
    level: 'lower',
    baseAngle: 154,
    angleSpan: 8,
    rows: generateRows('A', 'M', 20, 12, 2.6, 13),
    vertices3D: calcVertices(154, 8, 80, 104, 12, 22) as Vector3D[],
    covered: false,
    distance: 84,
    height: 12,
    rake: 13
  },

  // ========== GREEN MONSTER SEATS (Sections 1-11 on the Monster) ==========
  {
    id: 'GM-1',
    name: 'Green Monster 1',
    level: 'field',
    baseAngle: 20,
    angleSpan: 8,
    rows: generateRows('A', 'C', 12, 37, 2, 8),
    vertices3D: [
      { x: -95, y: 152, z: 37 },
      { x: -87, y: 157, z: 37 },
      { x: -87, y: 163, z: 39 },
      { x: -95, y: 158, z: 39 }
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
      { x: -87, y: 157, z: 37 },
      { x: -79, y: 162, z: 37 },
      { x: -79, y: 168, z: 39 },
      { x: -87, y: 163, z: 39 }
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
      { x: -79, y: 162, z: 37 },
      { x: -71, y: 167, z: 37 },
      { x: -71, y: 173, z: 39 },
      { x: -79, y: 168, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 310,
    height: 37,
    rake: 8
  },
  {
    id: 'GM-4',
    name: 'Green Monster 4',
    level: 'field',
    baseAngle: 44,
    angleSpan: 7,
    rows: generateRows('A', 'C', 11, 37, 2, 8),
    vertices3D: [
      { x: -71, y: 167, z: 37 },
      { x: -64, y: 171, z: 37 },
      { x: -64, y: 177, z: 39 },
      { x: -71, y: 173, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 310,
    height: 37,
    rake: 8
  },
  {
    id: 'GM-5',
    name: 'Green Monster 5',
    level: 'field',
    baseAngle: 51,
    angleSpan: 7,
    rows: generateRows('A', 'C', 11, 37, 2, 8),
    vertices3D: [
      { x: -64, y: 171, z: 37 },
      { x: -57, y: 175, z: 37 },
      { x: -57, y: 181, z: 39 },
      { x: -64, y: 177, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 310,
    height: 37,
    rake: 8
  },

  // ========== INFIELD BOX (Right Field Sections) ==========
  {
    id: 'IB-68',
    name: 'Infield Box 68',
    level: 'field',
    baseAngle: 134,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: calcVertices(134, 10, 54, 85, 2, 11) as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 12
  },
  {
    id: 'IB-69',
    name: 'Infield Box 69',
    level: 'field',
    baseAngle: 144,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: calcVertices(144, 10, 58, 87, 2, 11) as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 12
  },
  {
    id: 'IB-70',
    name: 'Infield Box 70',
    level: 'field',
    baseAngle: 154,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: calcVertices(154, 10, 62, 89, 2, 11) as Vector3D[],
    covered: false,
    distance: 65,
    height: 2,
    rake: 12
  },
  {
    id: 'IB-71',
    name: 'Infield Box 71',
    level: 'field',
    baseAngle: 164,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: calcVertices(164, 10, 68, 96, 2, 11) as Vector3D[],
    covered: false,
    distance: 70,
    height: 2,
    rake: 12
  },
  {
    id: 'IB-5',
    name: 'Infield Box 5',
    level: 'field',
    baseAngle: 56,
    angleSpan: 10,
    rows: generateRows('A', 'S', 22, 2, 2.5, 12),
    vertices3D: calcVertices(56, 10, 68, 96, 2, 11) as Vector3D[],
    covered: false,
    distance: 70,
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
    vertices3D: calcVertices(66, 10, 65, 96, 2, 11) as Vector3D[],
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
    vertices3D: calcVertices(76, 10, 58, 87, 2, 11) as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 12
  },

  // ========== PAVILION BOX (Upper Level Behind Home Plate) ==========
  {
    id: 'PB-1',
    name: 'Pavilion Box 1',
    level: 'upper',
    baseAngle: 80,
    angleSpan: 10,
    rows: generateRows('A', 'L', 24, 25, 2.8, 14),
    vertices3D: calcVertices(80, 10, 92, 126, 25, 38) as Vector3D[],
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
    vertices3D: calcVertices(90, 10, 92, 120, 25, 38) as Vector3D[],
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
    vertices3D: calcVertices(100, 10, 92, 120, 25, 38) as Vector3D[],
    covered: true,
    distance: 94,
    height: 25,
    rake: 14
  },
  {
    id: 'PB-4',
    name: 'Pavilion Box 4',
    level: 'upper',
    baseAngle: 110,
    angleSpan: 10,
    rows: generateRows('A', 'L', 24, 25, 2.8, 14),
    vertices3D: calcVertices(110, 10, 92, 120, 25, 38) as Vector3D[],
    covered: true,
    distance: 94,
    height: 25,
    rake: 14
  },
  {
    id: 'PB-5',
    name: 'Pavilion Box 5',
    level: 'upper',
    baseAngle: 120,
    angleSpan: 10,
    rows: generateRows('A', 'L', 24, 25, 2.8, 14),
    vertices3D: calcVertices(120, 10, 94, 122, 25, 38) as Vector3D[],
    covered: true,
    distance: 96,
    height: 25,
    rake: 14
  },
  {
    id: 'PB-6',
    name: 'Pavilion Box 6',
    level: 'upper',
    baseAngle: 130,
    angleSpan: 10,
    rows: generateRows('A', 'L', 24, 25, 2.8, 14),
    vertices3D: calcVertices(130, 10, 94, 122, 25, 38) as Vector3D[],
    covered: true,
    distance: 96,
    height: 25,
    rake: 14
  },

  // ========== GRANDSTAND (Upper Level) - Sections 1-33 ==========
  {
    id: 'GS-1',
    name: 'Grandstand 1',
    level: 'upper',
    baseAngle: 65,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: calcVertices(65, 11, 98, 165, 30, 57) as Vector3D[],
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
    vertices3D: calcVertices(76, 11, 96, 155, 30, 57) as Vector3D[],
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
    vertices3D: calcVertices(87, 11, 94, 153, 30, 57) as Vector3D[],
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
    vertices3D: calcVertices(98, 11, 92, 151, 30, 57) as Vector3D[],
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
    vertices3D: calcVertices(109, 11, 92, 149, 30, 57) as Vector3D[],
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
    vertices3D: calcVertices(120, 11, 92, 149, 30, 57) as Vector3D[],
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
    vertices3D: calcVertices(131, 11, 94, 151, 30, 57) as Vector3D[],
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
    vertices3D: calcVertices(142, 11, 96, 153, 30, 57) as Vector3D[],
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
    vertices3D: calcVertices(153, 11, 100, 157, 30, 57) as Vector3D[],
    covered: true,
    distance: 104,
    height: 30,
    rake: 15
  },
  {
    id: 'GS-18',
    name: 'Grandstand 18',
    level: 'upper',
    baseAngle: 164,
    angleSpan: 11,
    rows: generateRows('A', 'S', 26, 30, 3, 15),
    vertices3D: calcVertices(164, 11, 105, 165, 30, 57) as Vector3D[],
    covered: true,
    distance: 110,
    height: 30,
    rake: 15
  },

  // ========== BLEACHERS (Center Field) - Sections 34-43 ==========
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
  {
    id: 'BL-38',
    name: 'Bleachers 38',
    level: 'field',
    baseAngle: 244,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: -28, y: 222, z: 8 },
      { x: -39, y: 225, z: 8 },
      { x: -40, y: 275, z: 28 },
      { x: -29, y: 272, z: 28 }
    ] as Vector3D[],
    covered: false,
    distance: 223,
    height: 8,
    rake: 20
  },

  // ========== RIGHT FIELD BOX ==========
  {
    id: 'RF-85',
    name: 'Right Field Box 85',
    level: 'field',
    baseAngle: 154,
    angleSpan: 10,
    rows: generateRows('A', 'R', 20, 5, 2.5, 15),
    vertices3D: calcVertices(154, 10, 74, 108, 5, 15) as Vector3D[],
    covered: false,
    distance: 80,
    height: 5,
    rake: 15
  },
  {
    id: 'RF-86',
    name: 'Right Field Box 86',
    level: 'field',
    baseAngle: 164,
    angleSpan: 10,
    rows: generateRows('A', 'R', 20, 5, 2.5, 15),
    vertices3D: calcVertices(164, 10, 80, 114, 5, 15) as Vector3D[],
    covered: false,
    distance: 85,
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
    vertices3D: calcVertices(174, 10, 88, 120, 5, 15) as Vector3D[],
    covered: false,
    distance: 92,
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
    vertices3D: calcVertices(184, 10, 95, 135, 5, 15) as Vector3D[],
    covered: false,
    distance: 103,
    height: 5,
    rake: 15
  },
  {
    id: 'RF-89',
    name: 'Right Field Box 89',
    level: 'field',
    baseAngle: 194,
    angleSpan: 10,
    rows: generateRows('A', 'P', 18, 6, 2.5, 16),
    vertices3D: calcVertices(194, 10, 100, 138, 6, 16) as Vector3D[],
    covered: false,
    distance: 108,
    height: 6,
    rake: 16
  },

  // ========== EMC CLUB (Premium Level) ==========
  {
    id: 'EMC-404',
    name: 'EMC Club 404',
    level: 'club',
    baseAngle: 94,
    angleSpan: 10,
    rows: generateRows('A', 'H', 18, 35, 2.7, 12),
    vertices3D: calcVertices(94, 10, 105, 125, 35, 42) as Vector3D[],
    covered: true,
    distance: 110,
    height: 35,
    rake: 12
  },
  {
    id: 'EMC-405',
    name: 'EMC Club 405',
    level: 'club',
    baseAngle: 104,
    angleSpan: 10,
    rows: generateRows('A', 'H', 18, 35, 2.7, 12),
    vertices3D: calcVertices(104, 10, 105, 125, 35, 42) as Vector3D[],
    covered: true,
    distance: 110,
    height: 35,
    rake: 12
  },
  {
    id: 'EMC-406',
    name: 'EMC Club 406',
    level: 'club',
    baseAngle: 114,
    angleSpan: 10,
    rows: generateRows('A', 'H', 18, 35, 2.7, 12),
    vertices3D: calcVertices(114, 10, 105, 125, 35, 42) as Vector3D[],
    covered: true,
    distance: 110,
    height: 35,
    rake: 12
  },
  {
    id: 'EMC-407',
    name: 'EMC Club 407',
    level: 'club',
    baseAngle: 124,
    angleSpan: 10,
    rows: generateRows('A', 'H', 18, 35, 2.7, 12),
    vertices3D: calcVertices(124, 10, 105, 125, 35, 42) as Vector3D[],
    covered: true,
    distance: 110,
    height: 35,
    rake: 12
  },

  // ========== STANDING ROOM ONLY AREAS ==========
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
  {
    id: 'COCA-COLA-CORNER',
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
  },
  {
    id: 'RIGHT-FIELD-ROOF-DECK',
    name: 'Right Field Roof Deck',
    level: 'standing',
    baseAngle: 175,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: 88, y: 125, z: 32 },
      { x: 105, y: 145, z: 32 },
      { x: 108, y: 165, z: 32 },
      { x: 92, y: 145, z: 32 }
    ] as Vector3D[],
    covered: false,
    distance: 135,
    height: 32,
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
