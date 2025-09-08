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
  // ========== BEHIND HOME PLATE CLUB ==========
  {
    id: 'BHPC-14',
    name: 'Behind Home Plate Club 14',
    level: 'field',
    baseAngle: 67, // Wrigley orientation 75°
    angleSpan: 8,
    rows: generateRows('A', 'M', 18, 2, 2.5, 10),
    vertices3D: [
      { x: -12, y: 48, z: 2 },
      { x: -4, y: 48, z: 2 },
      { x: -4, y: 65, z: 7 },
      { x: -12, y: 65, z: 7 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  {
    id: 'BHPC-15',
    name: 'Behind Home Plate Club 15',
    level: 'field',
    baseAngle: 75,
    angleSpan: 8,
    rows: generateRows('A', 'M', 18, 2, 2.5, 10),
    vertices3D: [
      { x: -4, y: 48, z: 2 },
      { x: 4, y: 48, z: 2 },
      { x: 4, y: 65, z: 7 },
      { x: -4, y: 65, z: 7 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  {
    id: 'BHPC-16',
    name: 'Behind Home Plate Club 16',
    level: 'field',
    baseAngle: 83,
    angleSpan: 8,
    rows: generateRows('A', 'M', 18, 2, 2.5, 10),
    vertices3D: [
      { x: 4, y: 48, z: 2 },
      { x: 12, y: 48, z: 2 },
      { x: 12, y: 65, z: 7 },
      { x: 4, y: 65, z: 7 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 2,
    rake: 10
  },
  // ========== FIELD BOX ==========
  {
    id: 'FB-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 91,
    angleSpan: 9,
    rows: generateRows('A', 'R', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 12, y: 50, z: 2 },
      { x: 21, y: 53, z: 2 },
      { x: 24, y: 74, z: 10 },
      { x: 14, y: 71, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 54,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-109',
    name: 'Field Box 109',
    level: 'field',
    baseAngle: 100,
    angleSpan: 9,
    rows: generateRows('A', 'R', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 21, y: 53, z: 2 },
      { x: 30, y: 58, z: 2 },
      { x: 34, y: 79, z: 10 },
      { x: 24, y: 74, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 59,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-110',
    name: 'Field Box 110',
    level: 'field',
    baseAngle: 109,
    angleSpan: 9,
    rows: generateRows('A', 'R', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 58, z: 2 },
      { x: 39, y: 65, z: 2 },
      { x: 44, y: 86, z: 10 },
      { x: 34, y: 79, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 64,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-111',
    name: 'Field Box 111',
    level: 'field',
    baseAngle: 118,
    angleSpan: 9,
    rows: generateRows('A', 'R', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 39, y: 65, z: 2 },
      { x: 48, y: 73, z: 2 },
      { x: 54, y: 95, z: 10 },
      { x: 44, y: 86, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 69,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-7',
    name: 'Field Box 7',
    level: 'field',
    baseAngle: 59,
    angleSpan: 9,
    rows: generateRows('A', 'R', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -12, y: 50, z: 2 },
      { x: -21, y: 53, z: 2 },
      { x: -24, y: 74, z: 10 },
      { x: -14, y: 71, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 54,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-6',
    name: 'Field Box 6',
    level: 'field',
    baseAngle: 50,
    angleSpan: 9,
    rows: generateRows('A', 'R', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -21, y: 53, z: 2 },
      { x: -30, y: 58, z: 2 },
      { x: -34, y: 79, z: 10 },
      { x: -24, y: 74, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 59,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-5',
    name: 'Field Box 5',
    level: 'field',
    baseAngle: 41,
    angleSpan: 9,
    rows: generateRows('A', 'R', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 58, z: 2 },
      { x: -39, y: 65, z: 2 },
      { x: -44, y: 86, z: 10 },
      { x: -34, y: 79, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 64,
    height: 2,
    rake: 11
  },
  {
    id: 'FB-4',
    name: 'Field Box 4',
    level: 'field',
    baseAngle: 32,
    angleSpan: 9,
    rows: generateRows('A', 'R', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -39, y: 65, z: 2 },
      { x: -48, y: 73, z: 2 },
      { x: -54, y: 95, z: 10 },
      { x: -44, y: 86, z: 10 }
    ] as Vector3D[],
    covered: false,
    distance: 69,
    height: 2,
    rake: 11
  },
  // ========== TERRACE BOX ==========
  {
    id: 'TB-208',
    name: 'Terrace Box 208',
    level: 'lower',
    baseAngle: 72,
    angleSpan: 10,
    rows: generateRows('A', 'P', 24, 12, 2.6, 13),
    vertices3D: [
      { x: -8, y: 65, z: 12 },
      { x: 2, y: 65, z: 12 },
      { x: 2, y: 90, z: 23 },
      { x: -8, y: 90, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 70,
    height: 12,
    rake: 13
  },
  {
    id: 'TB-209',
    name: 'Terrace Box 209',
    level: 'lower',
    baseAngle: 82,
    angleSpan: 10,
    rows: generateRows('A', 'P', 24, 12, 2.6, 13),
    vertices3D: [
      { x: 2, y: 65, z: 12 },
      { x: 12, y: 66, z: 12 },
      { x: 13, y: 91, z: 23 },
      { x: 2, y: 90, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 71,
    height: 12,
    rake: 13
  },
  {
    id: 'TB-210',
    name: 'Terrace Box 210',
    level: 'lower',
    baseAngle: 92,
    angleSpan: 10,
    rows: generateRows('A', 'P', 24, 12, 2.6, 13),
    vertices3D: [
      { x: 12, y: 66, z: 12 },
      { x: 22, y: 68, z: 12 },
      { x: 24, y: 93, z: 23 },
      { x: 13, y: 91, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 73,
    height: 12,
    rake: 13
  },
  {
    id: 'TB-204',
    name: 'Terrace Box 204',
    level: 'lower',
    baseAngle: 58,
    angleSpan: 10,
    rows: generateRows('A', 'P', 24, 12, 2.6, 13),
    vertices3D: [
      { x: -22, y: 68, z: 12 },
      { x: -12, y: 66, z: 12 },
      { x: -13, y: 91, z: 23 },
      { x: -24, y: 93, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 73,
    height: 12,
    rake: 13
  },
  // ========== BLEACHERS ==========
  {
    id: 'BL-501',
    name: 'Left Field Bleachers 501',
    level: 'field',
    baseAngle: 127,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: 48, y: 73, z: 8 },
      { x: 58, y: 84, z: 8 },
      { x: 64, y: 109, z: 23 },
      { x: 53, y: 97, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 79,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-502',
    name: 'Left Field Bleachers 502',
    level: 'field',
    baseAngle: 138,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: 58, y: 84, z: 8 },
      { x: 67, y: 97, z: 8 },
      { x: 74, y: 123, z: 23 },
      { x: 64, y: 109, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 91,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-503',
    name: 'Left Field Bleachers 503',
    level: 'field',
    baseAngle: 149,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: 67, y: 97, z: 8 },
      { x: 75, y: 112, z: 8 },
      { x: 83, y: 139, z: 23 },
      { x: 74, y: 123, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 105,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-504',
    name: 'Left-Center Bleachers 504',
    level: 'field',
    baseAngle: 160,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: 75, y: 112, z: 8 },
      { x: 81, y: 128, z: 8 },
      { x: 89, y: 156, z: 23 },
      { x: 83, y: 139, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 120,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-505',
    name: 'Center Field Bleachers 505',
    level: 'field',
    baseAngle: 171,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: 81, y: 128, z: 8 },
      { x: 85, y: 145, z: 8 },
      { x: 93, y: 174, z: 23 },
      { x: 89, y: 156, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 137,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-506',
    name: 'Center Field Bleachers 506',
    level: 'field',
    baseAngle: 182,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: 85, y: 145, z: 8 },
      { x: 87, y: 163, z: 8 },
      { x: 95, y: 193, z: 23 },
      { x: 93, y: 174, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 154,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-508',
    name: 'Right Field Bleachers 508',
    level: 'field',
    baseAngle: 23,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: -48, y: 73, z: 8 },
      { x: -58, y: 84, z: 8 },
      { x: -64, y: 109, z: 23 },
      { x: -53, y: 97, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 79,
    height: 8,
    rake: 20
  },
  {
    id: 'BL-509',
    name: 'Right Field Bleachers 509',
    level: 'field',
    baseAngle: 12,
    angleSpan: 11,
    rows: generateRows('A', 'T', 26, 8, 2.5, 20),
    vertices3D: [
      { x: -58, y: 84, z: 8 },
      { x: -67, y: 97, z: 8 },
      { x: -74, y: 123, z: 23 },
      { x: -64, y: 109, z: 23 }
    ] as Vector3D[],
    covered: false,
    distance: 91,
    height: 8,
    rake: 20
  },
  // ========== CLUB BOX ==========
  {
    id: 'CB-301',
    name: 'Club Box 301',
    level: 'club',
    baseAngle: 65,
    angleSpan: 10,
    rows: generateRows('A', 'J', 20, 28, 2.8, 12),
    vertices3D: [
      { x: -16, y: 90, z: 28 },
      { x: -6, y: 90, z: 28 },
      { x: -6, y: 108, z: 36 },
      { x: -16, y: 108, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 94,
    height: 28,
    rake: 12
  },
  {
    id: 'CB-302',
    name: 'Club Box 302',
    level: 'club',
    baseAngle: 75,
    angleSpan: 10,
    rows: generateRows('A', 'J', 20, 28, 2.8, 12),
    vertices3D: [
      { x: -6, y: 90, z: 28 },
      { x: 4, y: 90, z: 28 },
      { x: 4, y: 108, z: 36 },
      { x: -6, y: 108, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 94,
    height: 28,
    rake: 12
  },
  {
    id: 'CB-303',
    name: 'Club Box 303',
    level: 'club',
    baseAngle: 85,
    angleSpan: 10,
    rows: generateRows('A', 'J', 20, 28, 2.8, 12),
    vertices3D: [
      { x: 4, y: 90, z: 28 },
      { x: 14, y: 91, z: 28 },
      { x: 15, y: 109, z: 36 },
      { x: 4, y: 108, z: 36 }
    ] as Vector3D[],
    covered: true,
    distance: 95,
    height: 28,
    rake: 12
  },
  // ========== UPPER DECK ==========
  {
    id: 'UD-401',
    name: 'Upper Deck 401',
    level: 'upper',
    baseAngle: 55,
    angleSpan: 11,
    rows: generateRows('A', 'W', 28, 38, 3.2, 17),
    vertices3D: [
      { x: -30, y: 108, z: 38 },
      { x: -19, y: 108, z: 38 },
      { x: -20, y: 165, z: 72 },
      { x: -32, y: 165, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 114,
    height: 38,
    rake: 17
  },
  {
    id: 'UD-402',
    name: 'Upper Deck 402',
    level: 'upper',
    baseAngle: 66,
    angleSpan: 11,
    rows: generateRows('A', 'W', 28, 38, 3.2, 17),
    vertices3D: [
      { x: -19, y: 108, z: 38 },
      { x: -8, y: 108, z: 38 },
      { x: -8, y: 165, z: 72 },
      { x: -20, y: 165, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 114,
    height: 38,
    rake: 17
  },
  {
    id: 'UD-403',
    name: 'Upper Deck 403',
    level: 'upper',
    baseAngle: 77,
    angleSpan: 11,
    rows: generateRows('A', 'W', 28, 38, 3.2, 17),
    vertices3D: [
      { x: -8, y: 108, z: 38 },
      { x: 3, y: 108, z: 38 },
      { x: 3, y: 165, z: 72 },
      { x: -8, y: 165, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 114,
    height: 38,
    rake: 17
  },
  {
    id: 'UD-404',
    name: 'Upper Deck 404',
    level: 'upper',
    baseAngle: 88,
    angleSpan: 11,
    rows: generateRows('A', 'W', 28, 38, 3.2, 17),
    vertices3D: [
      { x: 3, y: 108, z: 38 },
      { x: 14, y: 109, z: 38 },
      { x: 15, y: 166, z: 72 },
      { x: 3, y: 165, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 115,
    height: 38,
    rake: 17
  },
  {
    id: 'UD-405',
    name: 'Upper Deck 405',
    level: 'upper',
    baseAngle: 99,
    angleSpan: 11,
    rows: generateRows('A', 'W', 28, 38, 3.2, 17),
    vertices3D: [
      { x: 14, y: 109, z: 38 },
      { x: 25, y: 111, z: 38 },
      { x: 27, y: 168, z: 72 },
      { x: 15, y: 166, z: 72 }
    ] as Vector3D[],
    covered: false,
    distance: 117,
    height: 38,
    rake: 17
  },
  // ========== GALLAGHER WAY (Behind Bleachers) ==========
  {
    id: 'GALLAGHER',
    name: 'Gallagher Way',
    level: 'standing',
    baseAngle: 195,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: 70, y: 180, z: 25 },
      { x: 40, y: 195, z: 25 },
      { x: 35, y: 215, z: 25 },
      { x: 68, y: 200, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 188,
    height: 25,
    rake: 0
  },
  // ========== BUDWEISER BUDWEISER BLEACHERS ==========
  {
    id: 'BUD-BL',
    name: 'Budweiser Bleachers',
    level: 'standing',
    baseAngle: 165,
    angleSpan: 15,
    rows: [],
    vertices3D: [
      { x: 83, y: 139, z: 25 },
      { x: 88, y: 156, z: 25 },
      { x: 92, y: 174, z: 25 },
      { x: 87, y: 157, z: 25 }
    ] as Vector3D[],
    covered: false,
    distance: 148,
    height: 25,
    rake: 0
  },
  // ========== CATALINA CLUB ==========
  {
    id: 'CATALINA',
    name: 'Catalina Club',
    level: 'suite',
    baseAngle: 70,
    angleSpan: 10,
    rows: [{ rowNumber: "1", seats: 20, elevation: 35, depth: 0, covered: true }],
    vertices3D: [
      { x: -10, y: 105, z: 35 },
      { x: 0, y: 105, z: 35 },
      { x: 0, y: 125, z: 35 },
      { x: -10, y: 125, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 115,
    height: 35,
    rake: 0
  },
  {
    id: 'CATALINA-2',
    name: 'Catalina Club 2',
    level: 'suite',
    baseAngle: 80,
    angleSpan: 10,
    rows: [{ rowNumber: "1", seats: 20, elevation: 35, depth: 0, covered: true }],
    vertices3D: [
      { x: 0, y: 105, z: 35 },
      { x: 10, y: 105, z: 35 },
      { x: 10, y: 125, z: 35 },
      { x: 0, y: 125, z: 35 }
    ] as Vector3D[],
    covered: true,
    distance: 115,
    height: 35,
    rake: 0
  },
  // ========== ROOFTOP BOXES ==========
  {
    id: 'ROOFTOP-1',
    name: 'Sheffield Rooftop 1',
    level: 'standing',
    baseAngle: 15,
    angleSpan: 12,
    rows: [],
    vertices3D: [
      { x: -75, y: 130, z: 45 },
      { x: -85, y: 145, z: 45 },
      { x: -88, y: 165, z: 45 },
      { x: -78, y: 150, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 138,
    height: 45,
    rake: 0
  },
  {
    id: 'ROOFTOP-2',
    name: 'Waveland Rooftop',
    level: 'standing',
    baseAngle: 165,
    angleSpan: 12,
    rows: [],
    vertices3D: [
      { x: 85, y: 165, z: 45 },
      { x: 88, y: 185, z: 45 },
      { x: 90, y: 205, z: 45 },
      { x: 87, y: 185, z: 45 }
    ] as Vector3D[],
    covered: false,
    distance: 175,
    height: 45,
    rake: 0
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