import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Oracle Park - San Francisco Giants
// Opened: 2000
// Capacity: 41,915
// Orientation: 109° (Home plate to center field)
// Features: McCovey Cove, Garlic Fries, Fog, Wind patterns from Bay

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

export const oracleParkSections: DetailedSection[] = [
  // ========== ORACLE PARK SUITES (Behind Home Plate) ==========
  {
    id: 'OPS-114',
    name: 'Oracle Park Suite 114',
    level: 'field',
    baseAngle: 101, // Oracle Park orientation 109°
    angleSpan: 8,
    rows: generateRows('A', 'L', 18, 2, 2.5, 10),
    vertices3D: [
      { x: -12, y: 48, z: 2 },
      { x: -4, y: 48, z: 2 },
      { x: -4, y: 66, z: 7 },
      { x: -12, y: 66, z: 7 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  {
    id: 'OPS-115',
    name: 'Oracle Park Suite 115',
    level: 'field',
    baseAngle: 109,
    angleSpan: 8,
    rows: generateRows('A', 'L', 18, 2, 2.5, 10),
    vertices3D: [
      { x: -4, y: 48, z: 2 },
      { x: 4, y: 48, z: 2 },
      { x: 4, y: 66, z: 7 },
      { x: -4, y: 66, z: 7 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  {
    id: 'OPS-116',
    name: 'Oracle Park Suite 116',
    level: 'field',
    baseAngle: 117,
    angleSpan: 8,
    rows: generateRows('A', 'L', 18, 2, 2.5, 10),
    vertices3D: [
      { x: 4, y: 48, z: 2 },
      { x: 12, y: 48, z: 2 },
      { x: 12, y: 66, z: 7 },
      { x: 4, y: 66, z: 7 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  // ========== FIELD BOX ==========
  {
    id: 'FB-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 125,
    angleSpan: 9,
    rows: generateRows('A', 'S', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 12, y: 50, z: 2 },
      { x: 21, y: 54, z: 2 },
      { x: 24, y: 76, z: 11 },
      { x: 14, y: 72, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 134,
    angleSpan: 9,
    rows: generateRows('A', 'S', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 21, y: 54, z: 2 },
      { x: 30, y: 60, z: 2 },
      { x: 34, y: 82, z: 11 },
      { x: 24, y: 76, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-103',
    name: 'Field Box 103',
    level: 'field',
    baseAngle: 143,
    angleSpan: 9,
    rows: generateRows('A', 'S', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 60, z: 2 },
      { x: 39, y: 68, z: 2 },
      { x: 44, y: 90, z: 11 },
      { x: 34, y: 82, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 2,
    rake: 11
  },
  // Field Box - Third Base Side
  {
    id: 'FB-113',
    name: 'Field Box 113',
    level: 'field',
    baseAngle: 93,
    angleSpan: 9,
    rows: generateRows('A', 'S', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -12, y: 50, z: 2 },
      { x: -21, y: 54, z: 2 },
      { x: -24, y: 76, z: 11 },
      { x: -14, y: 72, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 84,
    angleSpan: 9,
    rows: generateRows('A', 'S', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -21, y: 54, z: 2 },
      { x: -30, y: 60, z: 2 },
      { x: -34, y: 82, z: 11 },
      { x: -24, y: 76, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-111',
    name: 'Field Box 111',
    level: 'field',
    baseAngle: 75,
    angleSpan: 9,
    rows: generateRows('A', 'S', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 60, z: 2 },
      { x: -39, y: 68, z: 2 },
      { x: -44, y: 90, z: 11 },
      { x: -34, y: 82, z: 11 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 2,
    rake: 11
  },
  // ========== LOWER BOX ==========
  {
    id: 'LB-201',
    name: 'Lower Box 201',
    level: 'lower',
    baseAngle: 100,
    angleSpan: 10,
    rows: generateRows('A', 'P', 24, 12, 2.6, 13),
    vertices3D: [
      { x: -8, y: 66, z: 12 },
      { x: 2, y: 66, z: 12 },
      { x: 2, y: 92, z: 24 },
      { x: -8, y: 92, z: 24 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-202',
    name: 'Lower Box 202',
    level: 'lower',
    baseAngle: 110,
    angleSpan: 10,
    rows: generateRows('A', 'P', 24, 12, 2.6, 13),
    vertices3D: [
      { x: 2, y: 66, z: 12 },
      { x: 12, y: 66, z: 12 },
      { x: 12, y: 92, z: 24 },
      { x: 2, y: 92, z: 24 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 12,
    rake: 13
  },
  {
    id: 'LB-203',
    name: 'Lower Box 203',
    level: 'lower',
    baseAngle: 120,
    angleSpan: 10,
    rows: generateRows('A', 'P', 24, 12, 2.6, 13),
    vertices3D: [
      { x: 12, y: 68, z: 12 },
      { x: 22, y: 70, z: 12 },
      { x: 24, y: 96, z: 24 },
      { x: 12, y: 92, z: 24 }
    ] as Vector3D[],
    covered: false,
    distance: 72,
    height: 12,
    rake: 13
  },
  // ========== BLEACHERS ==========
  {
    id: 'BL-136',
    name: 'Left Field Bleachers 136',
    level: 'field',
    baseAngle: 152,
    angleSpan: 11,
    rows: generateRows('A', 'U', 26, 8, 2.5, 18),
    vertices3D: [
      { x: 39, y: 68, z: 8 },
      { x: 50, y: 78, z: 8 },
      { x: 55, y: 103, z: 23 },
      { x: 43, y: 92, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 73,
    height: 8,
    rake: 18
  },
  {
    id: 'BL-137',
    name: 'Left Field Bleachers 137',
    level: 'field',
    baseAngle: 163,
    angleSpan: 11,
    rows: generateRows('A', 'U', 26, 8, 2.5, 18),
    vertices3D: [
      { x: 50, y: 78, z: 8 },
      { x: 60, y: 90, z: 8 },
      { x: 66, y: 115, z: 23 },
      { x: 55, y: 103, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 85,
    height: 8,
    rake: 18
  },
  {
    id: 'BL-138',
    name: 'Center Field Bleachers 138',
    level: 'field',
    baseAngle: 174,
    angleSpan: 11,
    rows: generateRows('A', 'U', 26, 8, 2.5, 18),
    vertices3D: [
      { x: 60, y: 90, z: 8 },
      { x: 68, y: 104, z: 8 },
      { x: 75, y: 130, z: 23 },
      { x: 66, y: 115, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 97,
    height: 8,
    rake: 18
  },
  {
    id: 'BL-139',
    name: 'Center Field Bleachers 139',
    level: 'field',
    baseAngle: 185,
    angleSpan: 11,
    rows: generateRows('A', 'U', 26, 8, 2.5, 18),
    vertices3D: [
      { x: 68, y: 104, z: 8 },
      { x: 74, y: 120, z: 8 },
      { x: 82, y: 148, z: 23 },
      { x: 75, y: 130, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 112,
    height: 8,
    rake: 18
  },
  {
    id: 'BL-140',
    name: 'Center Field Bleachers 140',
    level: 'field',
    baseAngle: 196,
    angleSpan: 11,
    rows: generateRows('A', 'U', 26, 8, 2.5, 18),
    vertices3D: [
      { x: 74, y: 120, z: 8 },
      { x: 78, y: 138, z: 8 },
      { x: 86, y: 168, z: 23 },
      { x: 82, y: 148, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 129,
    height: 8,
    rake: 18
  },
  // ========== MCCOVEY COVE (Right Field) ==========
  {
    id: 'MC-148',
    name: 'McCovey Cove Bleachers 148',
    level: 'field',
    baseAngle: 207,
    angleSpan: 10,
    rows: generateRows('A', 'S', 24, 10, 2.5, 16),
    vertices3D: [
      { x: 78, y: 138, z: 10 },
      { x: 80, y: 158, z: 10 },
      { x: 88, y: 185, z: 24 },
      { x: 86, y: 168, z: 24 }
    ] as Vector3D[],
    covered: false,
    distance: 148,
    height: 10,
    rake: 16
  },
  {
    id: 'MC-149',
    name: 'McCovey Cove Bleachers 149',
    level: 'field',
    baseAngle: 217,
    angleSpan: 10,
    rows: generateRows('A', 'S', 24, 10, 2.5, 16),
    vertices3D: [
      { x: 80, y: 158, z: 10 },
      { x: 80, y: 178, z: 10 },
      { x: 88, y: 208, z: 24 },
      { x: 88, y: 185, z: 24 }
    ] as Vector3D[],
    covered: false,
    distance: 168,
    height: 10,
    rake: 16
  },
  {
    id: 'MC-150',
    name: 'McCovey Cove Standing',
    level: 'standing',
    baseAngle: 227,
    angleSpan: 12,
    rows: [],
    vertices3D: [
      { x: 80, y: 178, z: 12 },
      { x: 78, y: 200, z: 12 },
      { x: 78, y: 215, z: 12 },
      { x: 80, y: 193, z: 12 }
    ] as Vector3D[],
    covered: false,
    distance: 189,
    height: 12,
    rake: 0
  },
  // ========== CLUB LEVEL ==========
  {
    id: 'CL-301',
    name: 'Club Level 301',
    level: 'club',
    baseAngle: 85,
    angleSpan: 10,
    rows: generateRows('A', 'K', 20, 28, 2.8, 12),
    vertices3D: [
      { x: -22, y: 92, z: 28 },
      { x: -32, y: 96, z: 28 },
      { x: -35, y: 118, z: 38 },
      { x: -24, y: 114, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 94,
    height: 28,
    rake: 12
  },
  {
    id: 'CL-302',
    name: 'Club Level 302',
    level: 'club',
    baseAngle: 95,
    angleSpan: 10,
    rows: generateRows('A', 'K', 20, 28, 2.8, 12),
    vertices3D: [
      { x: -12, y: 92, z: 28 },
      { x: -22, y: 92, z: 28 },
      { x: -24, y: 114, z: 38 },
      { x: -13, y: 114, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 92,
    height: 28,
    rake: 12
  },
  {
    id: 'CL-303',
    name: 'Club Level 303',
    level: 'club',
    baseAngle: 105,
    angleSpan: 10,
    rows: generateRows('A', 'K', 20, 28, 2.8, 12),
    vertices3D: [
      { x: -2, y: 92, z: 28 },
      { x: -12, y: 92, z: 28 },
      { x: -13, y: 114, z: 38 },
      { x: -2, y: 114, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 92,
    height: 28,
    rake: 12
  },
  {
    id: 'CL-304',
    name: 'Club Level 304',
    level: 'club',
    baseAngle: 115,
    angleSpan: 10,
    rows: generateRows('A', 'K', 20, 28, 2.8, 12),
    vertices3D: [
      { x: 8, y: 92, z: 28 },
      { x: -2, y: 92, z: 28 },
      { x: -2, y: 114, z: 38 },
      { x: 9, y: 114, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 92,
    height: 28,
    rake: 12
  },
  {
    id: 'CL-305',
    name: 'Club Level 305',
    level: 'club',
    baseAngle: 125,
    angleSpan: 10,
    rows: generateRows('A', 'K', 20, 28, 2.8, 12),
    vertices3D: [
      { x: 18, y: 94, z: 28 },
      { x: 8, y: 92, z: 28 },
      { x: 9, y: 114, z: 38 },
      { x: 20, y: 116, z: 38 }
    ] as Vector3D[],
    covered: true,
    distance: 94,
    height: 28,
    rake: 12
  },
  // ========== VIEW BOX ==========
  {
    id: 'VB-301',
    name: 'View Box 301',
    level: 'upper',
    baseAngle: 70,
    angleSpan: 11,
    rows: generateRows('A', 'V', 28, 38, 3.2, 16),
    vertices3D: [
      { x: -38, y: 114, z: 38 },
      { x: -50, y: 122, z: 38 },
      { x: -56, y: 186, z: 72 },
      { x: -42, y: 178, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 118,
    height: 38,
    rake: 16
  },
  {
    id: 'VB-302',
    name: 'View Box 302',
    level: 'upper',
    baseAngle: 81,
    angleSpan: 11,
    rows: generateRows('A', 'V', 28, 38, 3.2, 16),
    vertices3D: [
      { x: -26, y: 114, z: 38 },
      { x: -38, y: 114, z: 38 },
      { x: -42, y: 178, z: 72 },
      { x: -29, y: 178, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 114,
    height: 38,
    rake: 16
  },
  {
    id: 'VB-303',
    name: 'View Box 303',
    level: 'upper',
    baseAngle: 92,
    angleSpan: 11,
    rows: generateRows('A', 'V', 28, 38, 3.2, 16),
    vertices3D: [
      { x: -14, y: 114, z: 38 },
      { x: -26, y: 114, z: 38 },
      { x: -29, y: 178, z: 72 },
      { x: -15, y: 178, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 114,
    height: 38,
    rake: 16
  },
  {
    id: 'VB-304',
    name: 'View Box 304',
    level: 'upper',
    baseAngle: 103,
    angleSpan: 11,
    rows: generateRows('A', 'V', 28, 38, 3.2, 16),
    vertices3D: [
      { x: -2, y: 114, z: 38 },
      { x: -14, y: 114, z: 38 },
      { x: -15, y: 178, z: 72 },
      { x: -2, y: 178, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 114,
    height: 38,
    rake: 16
  },
  {
    id: 'VB-305',
    name: 'View Box 305',
    level: 'upper',
    baseAngle: 114,
    angleSpan: 11,
    rows: generateRows('A', 'V', 28, 38, 3.2, 16),
    vertices3D: [
      { x: 10, y: 114, z: 38 },
      { x: -2, y: 114, z: 38 },
      { x: -2, y: 178, z: 72 },
      { x: 11, y: 178, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 114,
    height: 38,
    rake: 16
  },
  {
    id: 'VB-334',
    name: 'View Box 334',
    level: 'upper',
    baseAngle: 140,
    angleSpan: 11,
    rows: generateRows('A', 'V', 28, 38, 3.2, 16),
    vertices3D: [
      { x: 34, y: 116, z: 38 },
      { x: 46, y: 124, z: 38 },
      { x: 52, y: 188, z: 72 },
      { x: 38, y: 180, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 120,
    height: 38,
    rake: 16
  },
  // ========== ARCADE ==========
  {
    id: 'ARC-415',
    name: 'Arcade 415',
    level: 'upper',
    baseAngle: 190,
    angleSpan: 12,
    rows: generateRows('A', 'R', 26, 45, 3, 15),
    vertices3D: [
      { x: 68, y: 148, z: 45 },
      { x: 72, y: 168, z: 45 },
      { x: 80, y: 225, z: 72 },
      { x: 75, y: 205, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 158,
    height: 45,
    rake: 15
  },
  {
    id: 'ARC-420',
    name: 'Arcade 420',
    level: 'upper',
    baseAngle: 202,
    angleSpan: 12,
    rows: generateRows('A', 'R', 26, 45, 3, 15),
    vertices3D: [
      { x: 72, y: 168, z: 45 },
      { x: 74, y: 188, z: 45 },
      { x: 82, y: 248, z: 72 },
      { x: 80, y: 225, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 178,
    height: 45,
    rake: 15
  },
  // ========== COCA-COLA FAN LOT ==========
  {
    id: 'COCA-COLA',
    name: 'Coca-Cola Fan Lot',
    level: 'standing',
    baseAngle: 50,
    angleSpan: 15,
    rows: [],
    vertices3D: [
      { x: -55, y: 125, z: 25 },
      { x: -65, y: 138, z: 25 },
      { x: -68, y: 155, z: 25 },
      { x: -58, y: 142, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 132,
    height: 25,
    rake: 0
  },
  // ========== GARDEN ==========
  {
    id: 'GARDEN',
    name: 'Garden',
    level: 'standing',
    baseAngle: 235,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: 35, y: 210, z: 30 },
      { x: 20, y: 225, z: 30 },
      { x: 15, y: 245, z: 30 },
      { x: 32, y: 230, z: 30 }
    ] as Vector3D[],
    covered: false,
    distance: 220,
    height: 30,
    rake: 0
  }
];

// Stadium features
export const oracleParkFeatures = {
  retractableRoof: false,
  roofHeight: 0,
  roofMaterial: {
    opacity: 0.0,
    reflectivity: 0.0
  }
};

// Export section map for easy lookup
export const oracleParkSectionMap = new Map(
  oracleParkSections.map(section => [section.id, section])
);