import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Chase Field - Arizona Diamondbacks
// Opened: 1998
// Capacity: 48,686
// Orientation: 23° (Home plate to center field)
// Features: Retractable roof, Swimming pool, Natural grass with retractable panels

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
      seats: seatsPerRow - Math.floor(rowNum * 0.3), // Slight reduction in upper rows
      elevation: startElevation + verticalRise,
      depth: rowNum * depthPerRow,
      covered: true // All sections covered by retractable roof
    });
  }
  
  return rows;
  }
export const chaseFieldSections: DetailedSection[] = [
  // Diamond Level - Behind Home Plate
  {
    id: 'diamond-level',
    name: 'Diamond Level',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'P', 24, 2, 2.5, 10),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 40, z: 50 },
      { x: -35, y: 40, z: 50 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Infield Box - First Base
  {
    id: 'infield-box-1b',
    name: 'Infield Box - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 118, y: 2, z: 29 },
      { x: 123, y: 55, z: 82 },
      { x: 35, y: 55, z: 63 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Infield Box - Third Base
  {
    id: 'infield-box-3b',
    name: 'Infield Box - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -118, y: 2, z: 29 },
      { x: -123, y: 55, z: 82 },
      { x: -35, y: 55, z: 63 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Swimming Pool Suite (Right-Center Field)
  {
    id: 'swimming-pool',
    name: 'Swimming Pool Suite',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
  ],
    vertices3D: [
      { x: 100, y: 25, z: 385 },
      { x: 130, y: 25, z: 400 },
      { x: 130, y: 35, z: 410 },
      { x: 100, y: 35, z: 395 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Friday's Front Row Grill
  {
    id: 'fridays-front-row',
    name: "Friday's Front Row Grill",
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true }
  ],
    vertices3D: [
      { x: -20, y: 30, z: 390 },
      { x: 20, y: 30, z: 390 },
      { x: 20, y: 30, z: 410 },
      { x: -20, y: 30, z: 410 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Club Level - Behind Home
  {
    id: 'club-level-home',
    name: 'Club Level - Home Plate',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'N', 26, 75, 3, 12),
    vertices3D: [
      { x: -40, y: 75, z: 70 },
      { x: 40, y: 75, z: 70 },
      { x: 45, y: 117, z: 112 },
      { x: -45, y: 117, z: 112 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Club Level - First Base
  {
    id: 'club-level-1b',
    name: 'Club Level - First Base',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'P', 28, 75, 3, 13),
    vertices3D: [
      { x: 45, y: 75, z: 75 },
      { x: 125, y: 75, z: 100 },
      { x: 130, y: 123, z: 148 },
      { x: 50, y: 123, z: 123 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Club Level - Third Base
  {
    id: 'club-level-3b',
    name: 'Club Level - Third Base',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'P', 28, 75, 3, 13),
    vertices3D: [
      { x: -45, y: 75, z: 75 },
      { x: -125, y: 75, z: 100 },
      { x: -130, y: 123, z: 148 },
      { x: -50, y: 123, z: 123 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Upper Level - Behind Home
  {
    id: 'upper-level-home',
    name: 'Upper Level - Home Plate',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 26, 130, 3.5, 15),
    vertices3D: [
      { x: -45, y: 130, z: 125 },
      { x: 45, y: 130, z: 125 },
      { x: 50, y: 231, z: 226 },
      { x: -50, y: 231, z: 226 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Upper Level - First Base
  {
    id: 'upper-level-1b',
    name: 'Upper Level - First Base',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 28, 130, 3.5, 16),
    vertices3D: [
      { x: 50, y: 130, z: 135 },
      { x: 135, y: 130, z: 165 },
      { x: 140, y: 238, z: 273 },
      { x: 55, y: 238, z: 243 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Upper Level - Third Base
  {
    id: 'upper-level-3b',
    name: 'Upper Level - Third Base',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Z', 28, 130, 3.5, 16),
    vertices3D: [
      { x: -50, y: 130, z: 135 },
      { x: -135, y: 130, z: 165 },
      { x: -140, y: 238, z: 273 },
      { x: -55, y: 238, z: 243 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Bleachers - Left Field
  {
    id: 'bleachers-lf',
    name: 'Left Field Bleachers',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'U', 24, 20, 2.5, 19),
    vertices3D: [
      { x: -150, y: 20, z: 280 },
      { x: -120, y: 20, z: 320 },
      { x: -125, y: 72.5, z: 372.5 },
      { x: -155, y: 72.5, z: 332.5 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Bleachers - Right Field
  {
    id: 'bleachers-rf',
    name: 'Right Field Bleachers',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'U', 24, 20, 2.5, 19),
    vertices3D: [
      { x: 120, y: 20, z: 280 },
      { x: 150, y: 20, z: 320 },
      { x: 155, y: 72.5, z: 372.5 },
      { x: 125, y: 72.5, z: 332.5 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // The Draft Room
  {
    id: 'draft-room',
    name: 'The Draft Room',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
  ],
    vertices3D: [
      { x: -80, y: 35, z: 350 },
      { x: -40, y: 35, z: 365 },
      { x: -40, y: 35, z: 385 },
      { x: -80, y: 35, z: 370 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Sandlot (Kids Area)
  {
    id: 'sandlot',
    name: 'The Sandlot',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
  ],
    vertices3D: [
      { x: -140, y: 15, z: 310 },
      { x: -110, y: 15, z: 330 },
      { x: -110, y: 15, z: 350 },
      { x: -140, y: 15, z: 330 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
  ],
    vertices3D: [
      { x: -60, y: 95, z: 90 },
      { x: 60, y: 95, z: 90 },
      { x: 60, y: 105, z: 100 },
      { x: -60, y: 105, z: 100 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Cox Terrace
  {
    id: 'cox-terrace',
    name: 'Cox Terrace',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'H', 20, 40, 2.5, 20),
    vertices3D: [
      { x: 80, y: 40, z: 370 },
      { x: 110, y: 40, z: 385 },
      { x: 115, y: 60, z: 405 },
      { x: 85, y: 60, z: 390 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Coors Light Strike Zone
  {
    id: 'coors-strike-zone',
    name: 'Coors Light Strike Zone',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
  ],
    vertices3D: [
      { x: -30, y: 25, z: 400 },
      { x: 30, y: 25, z: 400 },
      { x: 30, y: 25, z: 420 },
      { x: -30, y: 25, z: 420 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Legends Suite
  {
    id: 'legends-suite',
    name: 'Legends Suite',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'J', 30, 80, 3, 11),
    vertices3D: [
      { x: -50, y: 80, z: 80 },
      { x: -130, y: 80, z: 100 },
      { x: -135, y: 113, z: 133 },
      { x: -55, y: 113, z: 113 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Bullpen Reserve
  {
    id: 'bullpen-reserve',
    name: 'Bullpen Reserve',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'F', 15, 8, 2.5, 15),
    vertices3D: [
      { x: -130, y: 8, z: 200 },
      { x: -110, y: 8, z: 220 },
      { x: -115, y: 23, z: 235 },
      { x: -135, y: 23, z: 215 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // PetSmart Patio
  {
    id: 'petsmart-patio',
    name: 'PetSmart Patio',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
  ],
    vertices3D: [
      { x: -100, y: 30, z: 340 },
      { x: -70, y: 30, z: 355 },
      { x: -70, y: 30, z: 375 },
      { x: -100, y: 30, z: 360 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Draft Room Concourse
  {
    id: 'draft-room-concourse',
    name: 'Draft Room Concourse',
    level: 'club',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
  ],
    vertices3D: [
      { x: 110, y: 25, z: 320 },
      { x: 140, y: 25, z: 340 },
      { x: 140, y: 35, z: 350 },
      { x: 110, y: 35, z: 330 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Sandbar (Pool Area)
  {
    id: 'sandbar',
    name: 'Sandbar',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 85, y: 8, z: 385 },
      { x: 115, y: 8, z: 400 },
      { x: 115, y: 12, z: 404 },
      { x: 85, y: 12, z: 389 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  }
];

// Stadium features
export const chaseFieldFeatures = {
  retractableRoof: true,
  roofHeight: 200,
  roofMaterial: {
    opacity: 1.0, // Fully opaque when closed
    reflectivity: 0.4
  },
  climateControlled: true
};

// Export section map for easy lookup
export const chaseFieldSectionMap = new Map(
  chaseFieldSections.map(section => [section.id, section]));
