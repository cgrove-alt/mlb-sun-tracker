import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Helper function to generate rows with consistent numbering
const generateRows = (
  startRow: string,
  endRow: string,
  seatsPerRow: number,
  startElevation: number,
  depthPerRow: number = 3,
  rakeAngle: number = 30
): RowDetail[] => {
  const start = startRow.charCodeAt(0);
  const end = endRow.charCodeAt(0);
  
  return Array.from({ length: end - start + 1 }, (_, i) => ({
    rowNumber: String.fromCharCode(start + i),
    seats: seatsPerRow,
    elevation: startElevation + (i * 0.5),
    depth: i * depthPerRow,

  }));
  }
export const citiFieldSections: DetailedSection[] = [
  // Field Level Box - Behind Home Plate
  {
    id: 'field-box-home',
    name: 'Field Box - Home Plate',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'P', 22, 4, 2.5, 28),
    vertices3D: [
      { x: -25, y: 4, z: 4 },
      { x: 25, y: 4, z: 4 },
      { x: 25, y: 42, z: 20 },
      { x: -25, y: 42, z: 20 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Field Level Box - First Base
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'R', 20, 4, 2.5, 29),
    vertices3D: [
      { x: 25, y: 4, z: 4 },
      { x: 55, y: 30, z: 4 },
      { x: 55, y: 72, z: 25 },
      { x: 25, y: 46, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Field Level Box - Third Base
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'R', 20, 4, 2.5, 29),
    vertices3D: [
      { x: -25, y: 4, z: 4 },
      { x: -55, y: 30, z: 4 },
      { x: -55, y: 72, z: 25 },
      { x: -25, y: 46, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Metropolitan Club
  {
    id: 'metropolitan-club',
    name: 'Metropolitan Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 60,
    rows: generateRows('A', 'F', 30, 18, 3, 25),
    vertices3D: [
      { x: -40, y: 18, z: 35 },
      { x: 40, y: 18, z: 35 },
      { x: 40, y: 38, z: 47 },
      { x: -40, y: 38, z: 47 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Delta Sky360 Club
  {
    id: 'delta-sky360',
    name: 'Delta Sky360 Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 40,
    rows: generateRows('A', 'H', 20, 8, 3, 24),
    vertices3D: [
      { x: -20, y: 8, z: 5 },
      { x: 20, y: 8, z: 5 },
      { x: 20, y: 32, z: 18 },
      { x: -20, y: 32, z: 18 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Excelsior Level - Home Plate
  {
    id: 'excelsior-home',
    name: 'Excelsior Level - Home Plate',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 50,
    rows: generateRows('A', 'T', 26, 38, 3.5, 32),
    vertices3D: [
      { x: -35, y: 38, z: 45 },
      { x: 35, y: 38, z: 45 },
      { x: 35, y: 108, z: 115 },
      { x: -35, y: 108, z: 115 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Promenade Level - First Base
  {
    id: 'promenade-1b',
    name: 'Promenade Level - First Base',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 45,
    rows: generateRows('A', 'R', 24, 45, 3.5, 33),
    vertices3D: [
      { x: 35, y: 45, z: 50 },
      { x: 65, y: 70, z: 75 },
      { x: 65, y: 132, z: 137 },
      { x: 35, y: 107, z: 112 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Promenade Level - Third Base
  {
    id: 'promenade-3b',
    name: 'Promenade Level - Third Base',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 45,
    rows: generateRows('A', 'R', 24, 45, 3.5, 33),
    vertices3D: [
      { x: -35, y: 45, z: 50 },
      { x: -65, y: 70, z: 75 },
      { x: -65, y: 132, z: 137 },
      { x: -35, y: 107, z: 112 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Pepsi Porch - Right Field
  {
    id: 'pepsi-porch',
    name: 'Pepsi Porch',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'J', 18, 8, 2.5, 28),
    vertices3D: [
      { x: 75, y: 8, z: 60 },
      { x: 95, y: 25, z: 80 },
      { x: 95, y: 50, z: 95 },
      { x: 75, y: 33, z: 75 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Left Field Landing
  {
    id: 'left-field-landing',
    name: 'Left Field Landing',
    level: 'field',
    baseAngle: 225,
    angleSpan: 35,
    rows: generateRows('A', 'N', 16, 6, 2.5, 29),
    vertices3D: [
      { x: -75, y: 6, z: 60 },
      { x: -95, y: 25, z: 80 },
      { x: -95, y: 55, z: 95 },
      { x: -75, y: 36, z: 75 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Sterling Level Suites
  {
    id: 'sterling-suites',
    name: 'Sterling Level Suites',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 180,
    rows: [
      { rowNumber: "1", seats: 16, elevation: 24, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -45, y: 24, z: 48 },
      { x: 45, y: 24, z: 48 },
      { x: 45, y: 32, z: 58 },
      { x: -45, y: 32, z: 58 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  }
];

// Stadium configuration
export const citiFieldConfig = {
  stadiumName: 'Citi Field',
  team: 'New York Mets',
  location: 'Queens, New York',
  capacity: 41922,
  yearBuilt: 2009,
  orientation: 75,
  dimensions: {
    leftField: 335,
    center: 408,
    rightField: 330
  }
  }

// Export section map for easy lookup
export const citiFieldSectionMap = new Map(
  citiFieldSections.map(section => [section.id, section])
);
