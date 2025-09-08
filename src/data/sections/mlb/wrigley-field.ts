import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Wrigley Field - Chicago Cubs
// Opened: 1914
// Capacity: 41,649
// Orientation: 75° (Home plate to center field)
// Features: Ivy-covered walls, Manual scoreboard, Wind patterns, Historic neighborhood

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

export const wrigleyFieldSections: DetailedSection[] = [
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
  // Bleachers - Left Field
  {
    id: 'bleachers-lf',
    name: 'Bleachers - Left Field',
    level: 'field',
    baseAngle: 225,
    angleSpan: 40,
    rows: generateRows('A', 'T', 24, 8, 2.5, 20),
    vertices3D: [
      { x: -150, y: 8, z: 280 },
      { x: -120, y: 8, z: 320 },
      { x: -125, y: 58, z: 370 },
      { x: -155, y: 58, z: 330 }
    ] as Vector3D[],
    covered: false,
    distance: 335,
    height: 8,
    rake: 20
  },
  // Bleachers - Right Field
  {
    id: 'bleachers-rf',
    name: 'Bleachers - Right Field',
    level: 'field',
    baseAngle: 90,
    angleSpan: 40,
    rows: generateRows('A', 'T', 24, 8, 2.5, 20),
    vertices3D: [
      { x: 120, y: 8, z: 280 },
      { x: 150, y: 8, z: 320 },
      { x: 155, y: 58, z: 370 },
      { x: 125, y: 58, z: 330 }
    ] as Vector3D[],
    covered: false,
    distance: 335,
    height: 8,
    rake: 20
  },
  // Terrace Reserved
  {
    id: 'terrace-reserved',
    name: 'Terrace Reserved',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 180,
    rows: generateRows('A', 'S', 26, 45, 3, 15),
    vertices3D: [
      { x: -120, y: 45, z: 70 },
      { x: 120, y: 45, z: 70 },
      { x: 125, y: 102, z: 127 },
      { x: -125, y: 102, z: 127 }
    ] as Vector3D[],
    covered: false,
    distance: 120,
    height: 45,
    rake: 15
  },
  // Upper Deck
  {
    id: 'upper-deck',
    name: 'Upper Deck',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 90,
    rows: generateRows('A', 'Y', 28, 85, 3.5, 18),
    vertices3D: [
      { x: -100, y: 85, z: 130 },
      { x: 100, y: 85, z: 130 },
      { x: 105, y: 186, z: 231 },
      { x: -105, y: 186, z: 231 }
    ] as Vector3D[],
    covered: false,
    distance: 180,
    height: 85,
    rake: 18
  }
];

// Stadium features
export const wrigleyFieldFeatures = {
  retractableRoof: false,
  roofHeight: 0,
  roofMaterial: {
    opacity: 0.0,
    reflectivity: 0.0
  }
};

// Export section map for easy lookup
export const wrigleyFieldSectionMap = new Map(
  wrigleyFieldSections.map(section => [section.id, section])
);