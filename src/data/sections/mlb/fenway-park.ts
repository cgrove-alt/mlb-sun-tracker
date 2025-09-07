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
  // Green Monster Seats
  {
    id: 'green-monster',
    name: 'Green Monster Seats',
    level: 'field',
    baseAngle: 270,
    angleSpan: 25,
    rows: generateRows('A', 'C', 12, 37, 2, 8),
    vertices3D: [
      { x: -90, y: 37, z: 310 },
      { x: -75, y: 37, z: 325 },
      { x: -75, y: 43, z: 331 },
      { x: -90, y: 43, z: 316 }
    ] as Vector3D[],
    covered: false,
    distance: 320,
    height: 37,
    rake: 8
  },
  // Dugout Box - First Base
  {
    id: 'dugout-box-1b',
    name: 'Dugout Box - First Base',
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
  // Dugout Box - Third Base
  {
    id: 'dugout-box-3b',
    name: 'Dugout Box - Third Base',
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
  // Bleachers - Center Field
  {
    id: 'bleachers-cf',
    name: 'Bleachers - Center Field',
    level: 'field',
    baseAngle: 180,
    angleSpan: 40,
    rows: generateRows('A', 'T', 24, 8, 2.5, 20),
    vertices3D: [
      { x: -60, y: 8, z: 400 },
      { x: 60, y: 8, z: 400 },
      { x: 65, y: 58, z: 450 },
      { x: -65, y: 58, z: 450 }
    ] as Vector3D[],
    covered: false,
    distance: 425,
    height: 8,
    rake: 20
  },
  // Right Field Box
  {
    id: 'right-field-box',
    name: 'Right Field Box',
    level: 'field',
    baseAngle: 90,
    angleSpan: 35,
    rows: generateRows('A', 'R', 20, 5, 2.5, 15),
    vertices3D: [
      { x: 75, y: 5, z: 250 },
      { x: 105, y: 5, z: 280 },
      { x: 110, y: 55, z: 330 },
      { x: 80, y: 55, z: 300 }
    ] as Vector3D[],
    covered: false,
    distance: 290,
    height: 5,
    rake: 15
  },
  // Grandstand
  {
    id: 'grandstand',
    name: 'Grandstand',
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