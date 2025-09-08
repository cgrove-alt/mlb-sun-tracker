import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Helper function to generate rows with consistent numbering
const generateRows = (
  startRow: string,
  endRow: string,
  seatsPerRow: number,
  startElevation: number,
  rowDepth: number = 3,
  rakeAngle: number = 30
): RowDetail[] => {
  const start = startRow.charCodeAt(0);
  const end = endRow.charCodeAt(0);
  
  return Array.from({ length: end - start + 1 }, (_, i) => ({
    rowNumber: String.fromCharCode(start + i),
    seats: seatsPerRow,
    elevation: startElevation + (i * 0.5),
    depth: i * rowDepth,
    covered: false
  }));
};

export const camdenYardsSections: DetailedSection[] = [
  // Lower Box - Home Plate
  {
    id: 'lower-box-home',
    name: 'Lower Box - Home Plate',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 40,
    rows: generateRows('A', 'Z', 22, 15, 3, 28),
    vertices3D: [
      { x: -30, y: 15, z: 15 },
      { x: 30, y: 15, z: 15 },
      { x: 35, y: 85, z: 45 },
      { x: -35, y: 85, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 15,
    rake: 28,
  },
  
  // Lower Box - First Base
  {
    id: 'lower-box-1b',
    name: 'Lower Box - First Base',
    level: 'lower',
    baseAngle: 45,
    angleSpan: 45,
    rows: generateRows('A', 'Z', 20, 18, 3, 28),
    vertices3D: [
      { x: 35, y: 20, z: 18 },
      { x: 85, y: 45, z: 25 },
      { x: 90, y: 115, z: 55 },
      { x: 40, y: 90, z: 48 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 18,
    rake: 28,
  },
  
  // Lower Box - Third Base
  {
    id: 'lower-box-3b',
    name: 'Lower Box - Third Base',
    level: 'lower',
    baseAngle: 315,
    angleSpan: 45,
    rows: generateRows('A', 'Z', 20, 18, 3, 28),
    vertices3D: [
      { x: -35, y: 20, z: 18 },
      { x: -85, y: 45, z: 25 },
      { x: -90, y: 115, z: 55 },
      { x: -40, y: 90, z: 48 }
    ] as Vector3D[],
    covered: false,
    distance: 65,
    height: 18,
    rake: 28,
  },
  
  // Club Box - Home
  {
    id: 'club-box-home',
    name: 'Club Box - Home Plate',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'M', 16, 25, 3.5, 26),
    vertices3D: [
      { x: -25, y: 30, z: 25 },
      { x: 25, y: 30, z: 25 },
      { x: 28, y: 75, z: 48 },
      { x: -28, y: 75, z: 48 }
    ] as Vector3D[],
    covered: true,
    distance: 55,
    height: 25,
    rake: 26,
  },
  
  // Upper Deck - Home
  {
    id: 'upper-deck-home',
    name: 'Upper Deck - Home Plate',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 50,
    rows: generateRows('A', 'CC', 26, 75, 3.5, 32),
    vertices3D: [
      { x: -40, y: 110, z: 75 },
      { x: 40, y: 110, z: 75 },
      { x: 50, y: 210, z: 165 },
      { x: -50, y: 210, z: 165 }
    ] as Vector3D[],
    covered: true,
    distance: 160,
    height: 75,
    rake: 32
  },
  
  // Upper Deck - First Base
  {
    id: 'upper-deck-1b',
    name: 'Upper Deck - First Base',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 50,
    rows: generateRows('A', 'CC', 24, 78, 3.5, 32),
    vertices3D: [
      { x: 50, y: 115, z: 78 },
      { x: 120, y: 140, z: 88 },
      { x: 135, y: 240, z: 178 },
      { x: 65, y: 215, z: 168 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 78,
    rake: 32
  },
  
  // Upper Deck - Third Base
  {
    id: 'upper-deck-3b',
    name: 'Upper Deck - Third Base',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 50,
    rows: generateRows('A', 'CC', 24, 78, 3.5, 32),
    vertices3D: [
      { x: -50, y: 115, z: 78 },
      { x: -120, y: 140, z: 88 },
      { x: -135, y: 240, z: 178 },
      { x: -65, y: 215, z: 168 }
    ] as Vector3D[],
    covered: true,
    distance: 175,
    height: 78,
    rake: 32
  },
  
  // Bleachers - Left Field
  {
    id: 'bleachers-lf',
    name: 'Bleachers - Left Field',
    level: 'field',
    baseAngle: 225,
    angleSpan: 45,
    rows: generateRows('A', 'W', 30, 12, 2.5, 18),
    vertices3D: [
      { x: -95, y: 25, z: 12 },
      { x: -135, y: 55, z: 18 },
      { x: -150, y: 105, z: 45 },
      { x: -110, y: 75, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 320,
    height: 12,
    rake: 18,
  },
  
  // Bleachers - Right Field
  {
    id: 'bleachers-rf',
    name: 'Bleachers - Right Field',  
    level: 'field',
    baseAngle: 135,
    angleSpan: 45,
    rows: generateRows('A', 'W', 30, 12, 2.5, 18),
    vertices3D: [
      { x: 95, y: 25, z: 12 },
      { x: 135, y: 55, z: 18 },
      { x: 150, y: 105, z: 45 },
      { x: 110, y: 75, z: 39 }
    ] as Vector3D[],
    covered: false,
    distance: 320,
    height: 12,
    rake: 18,
  },
  
  // The Warehouse Premium
  {
    id: 'warehouse-premium',
    name: 'Warehouse Premium',
    level: 'field',
    baseAngle: 90,
    angleSpan: 20,
    rows: generateRows('A', 'F', 12, 8, 2.5, 15),
    vertices3D: [
      { x: 85, y: 8, z: 8 },
      { x: 110, y: 12, z: 10 },
      { x: 112, y: 25, z: 23 },
      { x: 87, y: 21, z: 21 }
    ] as Vector3D[],
    covered: false,
    distance: 300,
    height: 8,
    rake: 15,
  },
  
  // Eutaw Street Standing Room
  {
    id: 'eutaw-street-standing',
    name: 'Eutaw Street Standing Room',
    level: 'standing',
    baseAngle: 100,
    angleSpan: 15,
    rows: [
      { rowNumber: "1", seats: 200, elevation: 5, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 75, y: 5, z: 5 },
      { x: 95, y: 8, z: 5 },
      { x: 95, y: 12, z: 5 },
      { x: 75, y: 9, z: 5 }
    ] as Vector3D[],
    covered: false,
    distance: 285,
    height: 5,
    rake: 0,
  },
  
  // Suites Level
  {
    id: 'suites-level',
    name: 'Suites Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 180,
    rows: [
      { rowNumber: "1", seats: 400, elevation: 45, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -80, y: 85, z: 45 },
      { x: 80, y: 85, z: 45 },
      { x: 85, y: 105, z: 55 },
      { x: -85, y: 105, z: 55 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 45,
    rake: 10,
  }
];

// Export section map for easy lookup
export const camdenYardsSectionMap = new Map(
  camdenYardsSections.map(section => [section.id, section])
);
