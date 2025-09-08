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
  // McCovey Cove Area (Right Field)
  {
    id: 'mccovey-cove',
    name: 'McCovey Cove Area',
    level: 'field',
    baseAngle: 90,
    angleSpan: 35,
    rows: [
      { rowNumber: "1", seats: 150, elevation: 8, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 120, y: 8, z: 280 },
      { x: 160, y: 8, z: 320 },
      { x: 160, y: 8, z: 360 },
      { x: 120, y: 8, z: 320 }
    ] as Vector3D[],
    covered: false,
    distance: 340,
    height: 8,
    rake: 0
  },
  // Arcade
  {
    id: 'arcade',
    name: 'Arcade',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 180,
    rows: generateRows('A', 'S', 26, 65, 3, 15),
    vertices3D: [
      { x: -120, y: 65, z: 90 },
      { x: 120, y: 65, z: 90 },
      { x: 125, y: 122, z: 147 },
      { x: -125, y: 122, z: 147 }
    ] as Vector3D[],
    covered: false,
    distance: 140,
    height: 65,
    rake: 15
  },
  // Upper Deck
  {
    id: 'upper-deck',
    name: 'Upper Deck',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 90,
    rows: generateRows('A', 'Y', 28, 105, 3.5, 18),
    vertices3D: [
      { x: -100, y: 105, z: 150 },
      { x: 100, y: 105, z: 150 },
      { x: 105, y: 206, z: 251 },
      { x: -105, y: 206, z: 251 }
    ] as Vector3D[],
    covered: false,
    distance: 200,
    height: 105,
    rake: 18
  },
  // Club Level
  {
    id: 'club-level',
    name: 'Club Level',
    level: 'club',
    baseAngle: 45,
    angleSpan: 90,
    rows: generateRows('A', 'N', 28, 75, 3, 12),
    vertices3D: [
      { x: 50, y: 75, z: 85 },
      { x: 135, y: 75, z: 105 },
      { x: 140, y: 117, z: 147 },
      { x: 55, y: 117, z: 127 }
    ] as Vector3D[],
    covered: false,
    distance: 110,
    height: 75,
    rake: 12
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