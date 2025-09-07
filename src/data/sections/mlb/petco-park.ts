import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Petco Park - San Diego Padres
// Opened: 2004
// Capacity: 40,209
// Orientation: 97° (Home plate to center field)
// Features: Western Metal Supply Building, Park at the Park, Beach

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

export const petcoParkSections: DetailedSection[] = [
  // Field Box - Behind Home Plate
  {
    id: 'field-box-home',
    name: 'Field Box - Home Plate',
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
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 118, y: 2, z: 29 },
      { x: 123, y: 55, z: 82 },
      { x: 35, y: 55, z: 63 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
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
    rows: generateRows('A', 'V', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -118, y: 2, z: 29 },
      { x: -123, y: 55, z: 82 },
      { x: -35, y: 55, z: 63 }
    ] as Vector3D[],
    covered: false,
    distance: 60,
    height: 2,
    rake: 11
  },
  // Western Metal Supply Building (Left Field)
  {
    id: 'western-metal-supply',
    name: 'Western Metal Supply Building',
    level: 'field',
    baseAngle: 225,
    angleSpan: 15,
    rows: [
      { rowNumber: "1", seats: 50, elevation: 15, depth: 0, covered: false },
      { rowNumber: "2", seats: 45, elevation: 25, depth: 0, covered: false },
      { rowNumber: "3", seats: 40, elevation: 35, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -150, y: 15, z: 325 },
      { x: -130, y: 15, z: 340 },
      { x: -130, y: 35, z: 340 },
      { x: -150, y: 35, z: 325 }
    ] as Vector3D[],
    covered: false,
    distance: 332,
    height: 15,
    rake: 25
  },
  // Park at the Park (Center Field)
  {
    id: 'park-at-park',
    name: 'Park at the Park',
    level: 'field',
    baseAngle: 180,
    angleSpan: 60,
    rows: [
      { rowNumber: "BERM", seats: 300, elevation: 12, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -60, y: 12, z: 400 },
      { x: 60, y: 12, z: 400 },
      { x: 80, y: 12, z: 450 },
      { x: -80, y: 12, z: 450 }
    ] as Vector3D[],
    covered: false,
    distance: 425,
    height: 12,
    rake: 0
  },
  // Beach (Right Field)
  {
    id: 'beach',
    name: 'Beach',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "SAND", seats: 100, elevation: 8, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 120, y: 8, z: 350 },
      { x: 150, y: 8, z: 380 },
      { x: 150, y: 8, z: 400 },
      { x: 120, y: 8, z: 370 }
    ] as Vector3D[],
    covered: false,
    distance: 385,
    height: 8,
    rake: 0
  },
  // Toyota Terrace
  {
    id: 'toyota-terrace',
    name: 'Toyota Terrace',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 90,
    rows: generateRows('A', 'N', 28, 65, 3, 12),
    vertices3D: [
      { x: 50, y: 65, z: 85 },
      { x: 135, y: 65, z: 105 },
      { x: 140, y: 107, z: 147 },
      { x: 55, y: 107, z: 127 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 65,
    rake: 12
  },
  // Upper Box
  {
    id: 'upper-box',
    name: 'Upper Box',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 150,
    rows: generateRows('A', 'Y', 28, 95, 3.5, 18),
    vertices3D: [
      { x: -100, y: 95, z: 150 },
      { x: 100, y: 95, z: 150 },
      { x: 105, y: 196, z: 251 },
      { x: -105, y: 196, z: 251 }
    ] as Vector3D[],
    covered: false,
    distance: 200,
    height: 95,
    rake: 18
  }
];

// Stadium features
export const petcoParkFeatures = {
  retractableRoof: false,
  roofHeight: 0,
  roofMaterial: {
    opacity: 0.0,
    reflectivity: 0.0
  }
};

// Export section map for easy lookup
export const petcoParkSectionMap = new Map(
  petcoParkSections.map(section => [section.id, section])
);