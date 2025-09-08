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
  // Field Box - Behind Home Plate
  {
    id: 'field-box-home',
    name: 'Field Box - Home Plate',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'M', 20, 2, 2.5, 10),
    vertices3D: [
      { x: -25, y: 2, z: 8 },
      { x: 25, y: 2, z: 8 },
      { x: 30, y: 35, z: 40 },
      { x: -30, y: 35, z: 40 }
    ] as Vector3D[],
    covered: false,
    distance: 45,
    height: 2,
    rake: 10
  },
  // Field Box - First Base
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'P', 18, 2, 2.5, 11),
    vertices3D: [
      { x: 25, y: 2, z: 8 },
      { x: 95, y: 2, z: 25 },
      { x: 100, y: 47.5, z: 70 },
      { x: 30, y: 47.5, z: 53 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 2,
    rake: 11
  },
  // Field Box - Third Base
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'P', 18, 2, 2.5, 11),
    vertices3D: [
      { x: -25, y: 2, z: 8 },
      { x: -95, y: 2, z: 25 },
      { x: -100, y: 47.5, z: 70 },
      { x: -30, y: 47.5, z: 53 }
    ] as Vector3D[],
    covered: false,
    distance: 55,
    height: 2,
    rake: 11
  },
  // Berm (Outfield)
  {
    id: 'berm',
    name: 'Outfield Berm',
    level: 'field',
    baseAngle: 180,
    angleSpan: 120,
    rows: [
      { rowNumber: "1", seats: 200, elevation: 8, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -80, y: 8, z: 250 },
      { x: 80, y: 8, z: 250 },
      { x: 85, y: 8, z: 290 },
      { x: -85, y: 8, z: 290 }
    ] as Vector3D[],
    covered: false,
    distance: 270,
    height: 8,
    rake: 0
  },
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 120,
    rows: [
      { rowNumber: "1", seats: 150, elevation: 45, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -60, y: 45, z: 60 },
      { x: 60, y: 45, z: 60 },
      { x: 60, y: 55, z: 70 },
      { x: -60, y: 55, z: 70 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 45,
    rake: 5
  },
  // General Admission
  {
    id: 'general-admission',
    name: 'General Admission',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 90,
    rows: generateRows('A', 'R', 24, 25, 3, 15),
    vertices3D: [
      { x: -70, y: 25, z: 80 },
      { x: 70, y: 25, z: 80 },
      { x: 75, y: 79, z: 134 },
      { x: -75, y: 79, z: 134 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 25,
    rake: 15
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