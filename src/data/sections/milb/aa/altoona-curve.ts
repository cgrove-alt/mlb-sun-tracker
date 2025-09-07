// Peoples Natural Gas Field - Altoona Curve (Pittsburgh Pirates AA)
// Opened: 1999
// Capacity: 7,210
// Known for Allegheny Mountains views and roller coaster beyond center field

import { DetailedSection } from '../../../../types/stadium-complete';

// Helper function for row generation
const generateRows = (
  startRow: string | number,
  endRow: string | number,
  seatsPerRow: number,
  startElevation: number,
  rakeAngle: number
): any[] => {
  const rows = [];
  const rowHeight = 2.5;
  const rowDepth = 2.8;
  
  if (typeof startRow === 'string') {
    const startCode = startRow.charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);
    
    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow,
        elevation: startElevation + (rowNum * rowHeight * Math.sin(rakeAngle * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: false
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow,
        elevation: startElevation + (rowNum * rowHeight * Math.sin(rakeAngle * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: false
      });
    }
  }
  
  return rows;
};

export const altoonaCurveSections: DetailedSection[] = [
  // ========== CLUB LEVEL ==========
  {
    id: 'club-level',
    name: 'Club Level',
    level: 'club',
    baseAngle: 0,
    angleSpan: 24,
    rows: generateRows('A', 'H', 29, 19, 23),
    vertices3D: [
      { x: -35, y: 19, z: 51 },
      { x: 35, y: 19, z: 51 },
      { x: 40, y: 38, z: 70 },
      { x: -40, y: 38, z: 70 }
    ],
    covered: true,
    distance: 51,
    height: 19,
    rake: 23,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 0,
    angleSpan: 21,
    rows: generateRows('A', 'K', 18, 4, 18),
    vertices3D: [
      { x: -25, y: 4, z: 41 },
      { x: 25, y: 4, z: 41 },
      { x: 30, y: 23, z: 60 },
      { x: -30, y: 23, z: 60 }
    ],
    covered: false,
    distance: 41,
    height: 4,
    rake: 18,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-106',
    name: 'Field Box 106',
    level: 'field',
    baseAngle: 21,
    angleSpan: 23,
    rows: generateRows('A', 'K', 19, 4, 18),
    vertices3D: [
      { x: 25, y: 4, z: 41 },
      { x: 44, y: 4, z: 49 },
      { x: 49, y: 23, z: 68 },
      { x: 30, y: 23, z: 60 }
    ],
    covered: false,
    distance: 45,
    height: 4,
    rake: 18,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-107',
    name: 'Field Box 107',
    level: 'field',
    baseAngle: 339,
    angleSpan: 23,
    rows: generateRows('A', 'K', 19, 4, 18),
    vertices3D: [
      { x: -44, y: 4, z: 49 },
      { x: -25, y: 4, z: 41 },
      { x: -30, y: 23, z: 60 },
      { x: -49, y: 23, z: 68 }
    ],
    covered: false,
    distance: 45,
    height: 4,
    rake: 18,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 52,
    angleSpan: 24,
    rows: generateRows('A', 'K', 20, 4, 18),
    vertices3D: [
      { x: 53, y: 4, z: 73 },
      { x: 78, y: 4, z: 98 },
      { x: 83, y: 23, z: 117 },
      { x: 58, y: 23, z: 92 }
    ],
    covered: false,
    distance: 85,
    height: 4,
    rake: 18,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-120',
    name: 'Field Box 120',
    level: 'field',
    baseAngle: 308,
    angleSpan: 24,
    rows: generateRows('A', 'K', 20, 4, 18),
    vertices3D: [
      { x: -78, y: 4, z: 98 },
      { x: -53, y: 4, z: 73 },
      { x: -58, y: 23, z: 92 },
      { x: -83, y: 23, z: 117 }
    ],
    covered: false,
    distance: 85,
    height: 4,
    rake: 18,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-201',
    name: 'Reserved 201',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 27,
    rows: generateRows(1, 15, 25, 15, 20),
    vertices3D: [
      { x: -27, y: 15, z: 56 },
      { x: 27, y: 15, z: 56 },
      { x: 32, y: 33, z: 74 },
      { x: -32, y: 33, z: 74 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['9', '10', '11', '12', '13', '14', '15'],
      coveragePercentage: 47
    },
    distance: 56,
    height: 15,
    rake: 20,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-204',
    name: 'Reserved 204',
    level: 'lower',
    baseAngle: 57,
    angleSpan: 26,
    rows: generateRows(1, 15, 23, 15, 20),
    vertices3D: [
      { x: 60, y: 15, z: 101 },
      { x: 86, y: 15, z: 127 },
      { x: 91, y: 33, z: 145 },
      { x: 65, y: 33, z: 119 }
    ],
    covered: false,
    distance: 113,
    height: 15,
    rake: 20,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-212',
    name: 'Reserved 212',
    level: 'lower',
    baseAngle: 303,
    angleSpan: 26,
    rows: generateRows(1, 15, 23, 15, 20),
    vertices3D: [
      { x: -86, y: 15, z: 127 },
      { x: -60, y: 15, z: 101 },
      { x: -65, y: 33, z: 119 },
      { x: -91, y: 33, z: 145 }
    ],
    covered: false,
    distance: 113,
    height: 15,
    rake: 20,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SKYBOX DECK ==========
  {
    id: 'skybox-deck',
    name: 'Skybox Deck',
    level: 'upper',
    baseAngle: 180,
    angleSpan: 35,
    rows: [],
    vertices3D: [
      { x: -48, y: 26, z: 345 },
      { x: 48, y: 26, z: 345 },
      { x: 53, y: 32, z: 355 },
      { x: -53, y: 32, z: 355 }
    ],
    covered: true,
    distance: 345,
    height: 26,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== ROLLER COASTER DECK ==========
  {
    id: 'roller-coaster-deck',
    name: 'Roller Coaster Deck',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 24,
    rows: [],
    vertices3D: [
      { x: 92, y: 9, z: 230 },
      { x: 117, y: 9, z: 255 },
      { x: 122, y: 15, z: 261 },
      { x: 97, y: 15, z: 236 }
    ],
    covered: true,
    distance: 242,
    height: 9,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD GRASS ==========
  {
    id: 'left-field-grass',
    name: 'Left Field Grass',
    level: 'field',
    baseAngle: 230,
    angleSpan: 34,
    rows: [],
    vertices3D: [
      { x: -98, y: 5, z: 222 },
      { x: -75, y: 5, z: 245 },
      { x: -80, y: 10, z: 255 },
      { x: -103, y: 10, z: 232 }
    ],
    covered: false,
    distance: 233,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== ALLEGHENY OVERLOOK ==========
  {
    id: 'allegheny-overlook',
    name: 'Allegheny Overlook',
    level: 'standing',
    baseAngle: 108,
    angleSpan: 28,
    rows: generateRows(1, 4, 32, 24, 17),
    vertices3D: [
      { x: 75, y: 24, z: 260 },
      { x: 105, y: 24, z: 290 },
      { x: 110, y: 32, z: 298 },
      { x: 80, y: 32, z: 268 }
    ],
    covered: false,
    distance: 275,
    height: 24,
    rake: 17,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== PICNIC PAVILION ==========
  {
    id: 'picnic-pavilion',
    name: 'Picnic Pavilion',
    level: 'field',
    baseAngle: 50,
    angleSpan: 19,
    rows: [],
    vertices3D: [
      { x: 120, y: 6, z: 240 },
      { x: 140, y: 6, z: 260 },
      { x: 145, y: 12, z: 270 },
      { x: 125, y: 12, z: 250 }
    ],
    covered: false,
    distance: 250,
    height: 6,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const altoonaCurveConfig = {
  stadiumName: 'Peoples Natural Gas Field',
  team: 'Altoona Curve',
  parentOrg: 'Pittsburgh Pirates',
  city: 'Altoona',
  state: 'PA',
  level: 'AA',
  capacity: 7210,
  opened: 1999,
  orientation: 25,
  dimensions: {
    leftField: 325,
    leftCenter: 360,
    centerField: 405,
    rightCenter: 360,
    rightField: 320
  },
  features: {
    alleghenyMountainsView: true,
    rollerCoasterBeyondCF: true,
    clubLevel: true,
    skyboxDeck: true,
    rollerCoasterDeck: true,
    alleghenyOverlook: true,
    leftFieldGrass: true,
    picnicPavilion: true,
    coveredSeating: 1800
  }
};