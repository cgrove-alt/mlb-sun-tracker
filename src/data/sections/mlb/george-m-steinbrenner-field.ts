import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// George M. Steinbrenner Field - New York Yankees Spring Training
// Opened: 1996, Renovated: 2008
// Capacity: 11,026
// Orientation: 99° (Home plate to center field)
// Features: Spring Training facility, Smaller intimate setting

const generateRows = (startRow: string, endRow: string, seatsPerRow: number, startElevation: number, depthPerRow: number, rakeAngle: number = 12): RowDetail[] => {
  const rows: RowDetail[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  const startIdx = rowLetters.indexOf(startRow);
  const endIdx = rowLetters.indexOf(endRow);
  
  for (let i = startIdx; i <= endIdx; i++) {
    const rowNum = i - startIdx;
    const verticalRise = Math.sin(rakeAngle * Math.PI / 180) * depthPerRow * rowNum;
    
    rows.push({
      rowNumber: rowLetters[i],
      seats: seatsPerRow - Math.floor(rowNum * 0.2),
      elevation: startElevation + verticalRise,
      depth: rowNum * depthPerRow,
      covered: false
    });
  }
  
  return rows;
};

export const georgeMSteinbrennerFieldSections: DetailedSection[] = [
  // ========== PREMIUM BOX SEATS - Behind Home Plate ==========
  {
    id: 'PB-101',
    name: 'Premium Box 101',
    level: 'field',
    baseAngle: 91, // Adjusted for 99° orientation
    angleSpan: 8,
    rows: generateRows('A', 'M', 18, 2, 2.5, 10),
    vertices3D: [
      { x: -12, y: 50, z: 2 },
      { x: -4, y: 50, z: 2 },
      { x: -4, y: 72, z: 8 },
      { x: -12, y: 72, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 52,
    height: 2,
    rake: 10
  },
  {
    id: 'PB-102',
    name: 'Premium Box 102',
    level: 'field',
    baseAngle: 99,
    angleSpan: 8,
    rows: generateRows('A', 'M', 18, 2, 2.5, 10),
    vertices3D: [
      { x: -4, y: 50, z: 2 },
      { x: 4, y: 50, z: 2 },
      { x: 4, y: 72, z: 8 },
      { x: -4, y: 72, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 52,
    height: 2,
    rake: 10
  },
  {
    id: 'PB-103',
    name: 'Premium Box 103',
    level: 'field',
    baseAngle: 107,
    angleSpan: 8,
    rows: generateRows('A', 'M', 18, 2, 2.5, 10),
    vertices3D: [
      { x: 4, y: 50, z: 2 },
      { x: 12, y: 50, z: 2 },
      { x: 12, y: 72, z: 8 },
      { x: 4, y: 72, z: 8 }
    ] as Vector3D[],
    covered: false,
    distance: 52,
    height: 2,
    rake: 10
  },
  // ========== FIELD BOX SEATS - First Base Line ==========
  {
    id: 'FB-104',
    name: 'Field Box 104',
    level: 'field',
    baseAngle: 115,
    angleSpan: 9,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: [
      { x: 12, y: 52, z: 2 },
      { x: 22, y: 56, z: 2 },
      { x: 25, y: 78, z: 10 },
      { x: 14, y: 74, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 58,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-105',
    name: 'Field Box 105',
    level: 'field',
    baseAngle: 124,
    angleSpan: 9,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: [
      { x: 22, y: 56, z: 2 },
      { x: 32, y: 62, z: 2 },
      { x: 36, y: 84, z: 10 },
      { x: 25, y: 78, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-106',
    name: 'Field Box 106',
    level: 'field',
    baseAngle: 133,
    angleSpan: 9,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: [
      { x: 32, y: 62, z: 2 },
      { x: 42, y: 70, z: 2 },
      { x: 47, y: 92, z: 10 },
      { x: 36, y: 84, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 68,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-107',
    name: 'Field Box 107',
    level: 'field',
    baseAngle: 142,
    angleSpan: 9,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: [
      { x: 42, y: 70, z: 2 },
      { x: 52, y: 80, z: 2 },
      { x: 58, y: 102, z: 10 },
      { x: 47, y: 92, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 2,
    rake: 11
  },
  // ========== FIELD BOX SEATS - Third Base Line ==========
  {
    id: 'FB-114',
    name: 'Field Box 114',
    level: 'field',
    baseAngle: 83,
    angleSpan: 9,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: [
      { x: -12, y: 52, z: 2 },
      { x: -22, y: 56, z: 2 },
      { x: -25, y: 78, z: 10 },
      { x: -14, y: 74, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 58,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-115',
    name: 'Field Box 115',
    level: 'field',
    baseAngle: 74,
    angleSpan: 9,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: [
      { x: -22, y: 56, z: 2 },
      { x: -32, y: 62, z: 2 },
      { x: -36, y: 84, z: 10 },
      { x: -25, y: 78, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 62,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-116',
    name: 'Field Box 116',
    level: 'field',
    baseAngle: 65,
    angleSpan: 9,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: [
      { x: -32, y: 62, z: 2 },
      { x: -42, y: 70, z: 2 },
      { x: -47, y: 92, z: 10 },
      { x: -36, y: 84, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 68,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-117',
    name: 'Field Box 117',
    level: 'field',
    baseAngle: 56,
    angleSpan: 9,
    rows: generateRows('A', 'P', 20, 2, 2.5, 11),
    vertices3D: [
      { x: -42, y: 70, z: 2 },
      { x: -52, y: 80, z: 2 },
      { x: -58, y: 102, z: 10 },
      { x: -47, y: 92, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 75,
    height: 2,
    rake: 11
  },
  // ========== RESERVED GRANDSTAND ==========
  {
    id: 'RG-201',
    name: 'Reserved Grandstand 201',
    level: 'lower',
    baseAngle: 95,
    angleSpan: 10,
    rows: generateRows('A', 'R', 22, 12, 2.8, 14),
    vertices3D: [
      { x: -8, y: 72, z: 12 },
      { x: 2, y: 72, z: 12 },
      { x: 2, y: 102, z: 25 },
      { x: -8, y: 102, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 77,
    height: 12,
    rake: 14
  },
  {
    id: 'RG-202',
    name: 'Reserved Grandstand 202',
    level: 'lower',
    baseAngle: 105,
    angleSpan: 10,
    rows: generateRows('A', 'R', 22, 12, 2.8, 14),
    vertices3D: [
      { x: 2, y: 72, z: 12 },
      { x: 12, y: 72, z: 12 },
      { x: 12, y: 102, z: 25 },
      { x: 2, y: 102, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 77,
    height: 12,
    rake: 14
  },
  {
    id: 'RG-203',
    name: 'Reserved Grandstand 203',
    level: 'lower',
    baseAngle: 115,
    angleSpan: 10,
    rows: generateRows('A', 'R', 22, 12, 2.8, 14),
    vertices3D: [
      { x: 12, y: 74, z: 12 },
      { x: 22, y: 76, z: 12 },
      { x: 24, y: 106, z: 25 },
      { x: 12, y: 102, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 79,
    height: 12,
    rake: 14
  },
  {
    id: 'RG-213',
    name: 'Reserved Grandstand 213',
    level: 'lower',
    baseAngle: 85,
    angleSpan: 10,
    rows: generateRows('A', 'R', 22, 12, 2.8, 14),
    vertices3D: [
      { x: -12, y: 74, z: 12 },
      { x: -22, y: 76, z: 12 },
      { x: -24, y: 106, z: 25 },
      { x: -12, y: 102, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 79,
    height: 12,
    rake: 14
  },
  // ========== BLEACHERS ==========
  {
    id: 'BL-141',
    name: 'Left Field Bleachers 141',
    level: 'field',
    baseAngle: 151,
    angleSpan: 12,
    rows: generateRows('A', 'M', 24, 8, 2.6, 12),
    vertices3D: [
      { x: 60, y: 88, z: 8 },
      { x: 72, y: 102, z: 8 },
      { x: 78, y: 125, z: 18 },
      { x: 64, y: 110, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 8,
    rake: 12
  },
  {
    id: 'BL-142',
    name: 'Left Field Bleachers 142',
    level: 'field',
    baseAngle: 163,
    angleSpan: 12,
    rows: generateRows('A', 'M', 24, 8, 2.6, 12),
    vertices3D: [
      { x: 72, y: 102, z: 8 },
      { x: 82, y: 118, z: 8 },
      { x: 90, y: 142, z: 18 },
      { x: 78, y: 125, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 8,
    rake: 12
  },
  {
    id: 'BL-143',
    name: 'Center Field Bleachers 143',
    level: 'field',
    baseAngle: 175,
    angleSpan: 14,
    rows: generateRows('A', 'M', 28, 8, 2.6, 12),
    vertices3D: [
      { x: 82, y: 118, z: 8 },
      { x: 88, y: 138, z: 8 },
      { x: 96, y: 165, z: 18 },
      { x: 90, y: 142, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 128,
    height: 8,
    rake: 12
  },
  {
    id: 'BL-144',
    name: 'Center Field Bleachers 144',
    level: 'field',
    baseAngle: 189,
    angleSpan: 14,
    rows: generateRows('A', 'M', 28, 8, 2.6, 12),
    vertices3D: [
      { x: 88, y: 138, z: 8 },
      { x: 88, y: 160, z: 8 },
      { x: 96, y: 188, z: 18 },
      { x: 96, y: 165, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 149,
    height: 8,
    rake: 12
  },
  {
    id: 'BL-131',
    name: 'Right Field Bleachers 131',
    level: 'field',
    baseAngle: 47,
    angleSpan: 12,
    rows: generateRows('A', 'M', 24, 8, 2.6, 12),
    vertices3D: [
      { x: -60, y: 88, z: 8 },
      { x: -72, y: 102, z: 8 },
      { x: -78, y: 125, z: 18 },
      { x: -64, y: 110, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 95,
    height: 8,
    rake: 12
  },
  {
    id: 'BL-132',
    name: 'Right Field Bleachers 132',
    level: 'field',
    baseAngle: 35,
    angleSpan: 12,
    rows: generateRows('A', 'M', 24, 8, 2.6, 12),
    vertices3D: [
      { x: -72, y: 102, z: 8 },
      { x: -82, y: 118, z: 8 },
      { x: -90, y: 142, z: 18 },
      { x: -78, y: 125, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 8,
    rake: 12
  },
  // ========== BERM (Outfield) ==========
  {
    id: 'BERM-LF',
    name: 'Left Field Berm',
    level: 'standing',
    baseAngle: 203,
    angleSpan: 20,
    rows: [
      { rowNumber: "1", seats: 150, elevation: 10, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 88, y: 188, z: 10 },
      { x: 70, y: 210, z: 10 },
      { x: 75, y: 235, z: 10 },
      { x: 95, y: 215, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 199,
    height: 10,
    rake: 0
  },
  {
    id: 'BERM-CF',
    name: 'Center Field Berm',
    level: 'standing',
    baseAngle: 223,
    angleSpan: 24,
    rows: [
      { rowNumber: "1", seats: 200, elevation: 10, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 70, y: 210, z: 10 },
      { x: 35, y: 228, z: 10 },
      { x: 38, y: 255, z: 10 },
      { x: 75, y: 235, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 219,
    height: 10,
    rake: 0
  },
  {
    id: 'BERM-RF',
    name: 'Right Field Berm',
    level: 'standing',
    baseAngle: 247,
    angleSpan: 20,
    rows: [
      { rowNumber: "1", seats: 150, elevation: 10, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 35, y: 228, z: 10 },
      { x: -5, y: 235, z: 10 },
      { x: -8, y: 262, z: 10 },
      { x: 38, y: 255, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 231,
    height: 10,
    rake: 0
  },
  // ========== SUITE LEVEL ==========
  {
    id: 'SUITE-1',
    name: 'Suite 1',
    level: 'suite',
    baseAngle: 93,
    angleSpan: 12,
    rows: [
      { rowNumber: "1", seats: 20, elevation: 28, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -12, y: 95, z: 28 },
      { x: 0, y: 95, z: 28 },
      { x: 0, y: 110, z: 28 },
      { x: -12, y: 110, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 102,
    height: 28,
    rake: 0
  },
  {
    id: 'SUITE-2',
    name: 'Suite 2',
    level: 'suite',
    baseAngle: 105,
    angleSpan: 12,
    rows: [
      { rowNumber: "1", seats: 20, elevation: 28, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: 0, y: 95, z: 28 },
      { x: 12, y: 95, z: 28 },
      { x: 12, y: 110, z: 28 },
      { x: 0, y: 110, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 102,
    height: 28,
    rake: 0
  },
  {
    id: 'SUITE-3',
    name: 'Suite 3',
    level: 'suite',
    baseAngle: 117,
    angleSpan: 12,
    rows: [
      { rowNumber: "1", seats: 20, elevation: 28, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: 12, y: 96, z: 28 },
      { x: 24, y: 98, z: 28 },
      { x: 26, y: 113, z: 28 },
      { x: 12, y: 110, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 104,
    height: 28,
    rake: 0
  },
  {
    id: 'SUITE-4',
    name: 'Suite 4',
    level: 'suite',
    baseAngle: 81,
    angleSpan: 12,
    rows: [
      { rowNumber: "1", seats: 20, elevation: 28, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -12, y: 96, z: 28 },
      { x: -24, y: 98, z: 28 },
      { x: -26, y: 113, z: 28 },
      { x: -12, y: 110, z: 28 }
    ] as Vector3D[],
    covered: true,
    distance: 104,
    height: 28,
    rake: 0
  },
  // ========== UPPER RESERVED ==========
  {
    id: 'UR-301',
    name: 'Upper Reserved 301',
    level: 'upper',
    baseAngle: 90,
    angleSpan: 11,
    rows: generateRows('A', 'L', 26, 25, 3, 15),
    vertices3D: [
      { x: -16, y: 102, z: 25 },
      { x: -5, y: 102, z: 25 },
      { x: -5, y: 138, z: 42 },
      { x: -16, y: 138, z: 42 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 25,
    rake: 15
  },
  {
    id: 'UR-302',
    name: 'Upper Reserved 302',
    level: 'upper',
    baseAngle: 101,
    angleSpan: 11,
    rows: generateRows('A', 'L', 26, 25, 3, 15),
    vertices3D: [
      { x: -5, y: 102, z: 25 },
      { x: 6, y: 102, z: 25 },
      { x: 6, y: 138, z: 42 },
      { x: -5, y: 138, z: 42 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 25,
    rake: 15
  },
  {
    id: 'UR-303',
    name: 'Upper Reserved 303',
    level: 'upper',
    baseAngle: 112,
    angleSpan: 11,
    rows: generateRows('A', 'L', 26, 25, 3, 15),
    vertices3D: [
      { x: 6, y: 102, z: 25 },
      { x: 17, y: 104, z: 25 },
      { x: 19, y: 140, z: 42 },
      { x: 6, y: 138, z: 42 }
    ] as Vector3D[],
    covered: false,
    distance: 112,
    height: 25,
    rake: 15
  },
  {
    id: 'UR-304',
    name: 'Upper Reserved 304',
    level: 'upper',
    baseAngle: 123,
    angleSpan: 11,
    rows: generateRows('A', 'L', 26, 25, 3, 15),
    vertices3D: [
      { x: 17, y: 104, z: 25 },
      { x: 28, y: 108, z: 25 },
      { x: 32, y: 144, z: 42 },
      { x: 19, y: 140, z: 42 }
    ] as Vector3D[],
    covered: false,
    distance: 116,
    height: 25,
    rake: 15
  },
  {
    id: 'UR-313',
    name: 'Upper Reserved 313',
    level: 'upper',
    baseAngle: 79,
    angleSpan: 11,
    rows: generateRows('A', 'L', 26, 25, 3, 15),
    vertices3D: [
      { x: -17, y: 104, z: 25 },
      { x: -28, y: 108, z: 25 },
      { x: -32, y: 144, z: 42 },
      { x: -19, y: 140, z: 42 }
    ] as Vector3D[],
    covered: false,
    distance: 116,
    height: 25,
    rake: 15
  },
  {
    id: 'UR-314',
    name: 'Upper Reserved 314',
    level: 'upper',
    baseAngle: 68,
    angleSpan: 11,
    rows: generateRows('A', 'L', 26, 25, 3, 15),
    vertices3D: [
      { x: -28, y: 108, z: 25 },
      { x: -39, y: 114, z: 25 },
      { x: -44, y: 150, z: 42 },
      { x: -32, y: 144, z: 42 }
    ] as Vector3D[],
    covered: false,
    distance: 122,
    height: 25,
    rake: 15
  },
  // ========== PAVILION AREAS ==========
  {
    id: 'PAV-LF',
    name: 'Left Field Pavilion',
    level: 'standing',
    baseAngle: 134,
    angleSpan: 15,
    rows: [],
    vertices3D: [
      { x: 40, y: 112, z: 20 },
      { x: 55, y: 125, z: 20 },
      { x: 60, y: 145, z: 20 },
      { x: 44, y: 132, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 119,
    height: 20,
    rake: 0
  },
  {
    id: 'PAV-RF',
    name: 'Right Field Pavilion',
    level: 'standing',
    baseAngle: 64,
    angleSpan: 15,
    rows: [],
    vertices3D: [
      { x: -40, y: 112, z: 20 },
      { x: -55, y: 125, z: 20 },
      { x: -60, y: 145, z: 20 },
      { x: -44, y: 132, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 119,
    height: 20,
    rake: 0
  }
];

// Stadium features
export const georgeMSteinbrennerFieldFeatures = {
  retractableRoof: false,
  roofHeight: 0,
  roofMaterial: {
    opacity: 0.0,
    reflectivity: 0.0
  }
};

// Export section map for easy lookup
export const georgeMSteinbrennerFieldSectionMap = new Map(
  georgeMSteinbrennerFieldSections.map(section => [section.id, section])
);