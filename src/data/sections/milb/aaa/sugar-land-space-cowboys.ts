// Constellation Field - Sugar Land Space Cowboys (Houston Astros AAA)
// Opened: 2012
// Capacity: 9,500
// Known for space-themed features and Houston skyline views

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

export const sugarLandSpaceCowboysSections: DetailedSection[] = [
  // ========== INSPERITY CLUB ==========
  {
    id: 'insperity-club',
    name: 'Insperity Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 29,
    rows: generateRows('A', 'K', 35, 23, 26),
    vertices3D: [
      { x: -43, y: 23, z: 56 },
      { x: 43, y: 23, z: 56 },
      { x: 48, y: 49, z: 82 },
      { x: -48, y: 49, z: 82 }
    ],
    covered: true,
    distance: 56,
    height: 23,
    rake: 26,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 18,
    rows: generateRows('A', 'M', 22, 4, 22),
    vertices3D: [
      { x: -22, y: 4, z: 45 },
      { x: 22, y: 4, z: 45 },
      { x: 27, y: 30, z: 71 },
      { x: -27, y: 30, z: 71 }
    ],
    covered: false,
    distance: 45,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-103',
    name: 'Field Box 103',
    level: 'field',
    baseAngle: 18,
    angleSpan: 20,
    rows: generateRows('A', 'M', 23, 4, 22),
    vertices3D: [
      { x: 22, y: 4, z: 45 },
      { x: 40, y: 4, z: 54 },
      { x: 45, y: 30, z: 80 },
      { x: 27, y: 30, z: 71 }
    ],
    covered: false,
    distance: 49,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-104',
    name: 'Field Box 104',
    level: 'field',
    baseAngle: 342,
    angleSpan: 20,
    rows: generateRows('A', 'M', 23, 4, 22),
    vertices3D: [
      { x: -40, y: 4, z: 54 },
      { x: -22, y: 4, z: 45 },
      { x: -27, y: 30, z: 71 },
      { x: -45, y: 30, z: 80 }
    ],
    covered: false,
    distance: 49,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-109',
    name: 'Field Box 109',
    level: 'field',
    baseAngle: 46,
    angleSpan: 24,
    rows: generateRows('A', 'M', 24, 4, 22),
    vertices3D: [
      { x: 49, y: 4, z: 78 },
      { x: 79, y: 4, z: 108 },
      { x: 84, y: 30, z: 134 },
      { x: 54, y: 30, z: 104 }
    ],
    covered: false,
    distance: 93,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-117',
    name: 'Field Box 117',
    level: 'field',
    baseAngle: 314,
    angleSpan: 24,
    rows: generateRows('A', 'M', 24, 4, 22),
    vertices3D: [
      { x: -79, y: 4, z: 108 },
      { x: -49, y: 4, z: 78 },
      { x: -54, y: 30, z: 104 },
      { x: -84, y: 30, z: 134 }
    ],
    covered: false,
    distance: 93,
    height: 4,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 22,
    rows: generateRows(1, 21, 30, 11, 24),
    vertices3D: [
      { x: -32, y: 11, z: 64 },
      { x: 32, y: 11, z: 64 },
      { x: 37, y: 44, z: 97 },
      { x: -37, y: 44, z: 97 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['13', '14', '15', '16', '17', '18', '19', '20', '21'],
      coveragePercentage: 43
    },
    distance: 64,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-208',
    name: 'Reserved 208',
    level: 'lower',
    baseAngle: 51,
    angleSpan: 25,
    rows: generateRows(1, 21, 28, 11, 24),
    vertices3D: [
      { x: 68, y: 11, z: 116 },
      { x: 97, y: 11, z: 145 },
      { x: 102, y: 44, z: 178 },
      { x: 73, y: 44, z: 149 }
    ],
    covered: false,
    distance: 130,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-216',
    name: 'Reserved 216',
    level: 'lower',
    baseAngle: 309,
    angleSpan: 25,
    rows: generateRows(1, 21, 28, 11, 24),
    vertices3D: [
      { x: -97, y: 11, z: 145 },
      { x: -68, y: 11, z: 116 },
      { x: -73, y: 44, z: 149 },
      { x: -102, y: 44, z: 178 }
    ],
    covered: false,
    distance: 130,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 50,
    rows: [
      { rowNumber: 'Suite', seats: 280, elevation: 30, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -66, y: 30, z: 78 },
      { x: 66, y: 30, z: 78 },
      { x: 71, y: 40, z: 88 },
      { x: -71, y: 40, z: 88 }
    ],
    covered: true,
    distance: 78,
    height: 30,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== ORBIT'S OUTPOST ==========
  {
    id: 'orbits-outpost',
    name: "Orbit's Outpost",
    level: 'standing',
    baseAngle: 90,
    angleSpan: 26,
    rows: [],
    vertices3D: [
      { x: 108, y: 13, z: 268 },
      { x: 139, y: 13, z: 299 },
      { x: 144, y: 19, z: 305 },
      { x: 113, y: 19, z: 274 }
    ],
    covered: true,
    distance: 283,
    height: 13,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== GALAXY PAVILION ==========
  {
    id: 'galaxy-pavilion',
    name: 'Galaxy Pavilion',
    level: 'upper',
    baseAngle: 118,
    angleSpan: 29,
    rows: generateRows(1, 7, 42, 31, 22),
    vertices3D: [
      { x: 92, y: 31, z: 308 },
      { x: 127, y: 31, z: 343 },
      { x: 132, y: 45, z: 357 },
      { x: 97, y: 45, z: 322 }
    ],
    covered: false,
    distance: 325,
    height: 31,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== LEFT FIELD LAWN ==========
  {
    id: 'left-field-lawn',
    name: 'Left Field Lawn',
    level: 'field',
    baseAngle: 245,
    angleSpan: 27,
    rows: [],
    vertices3D: [
      { x: -118, y: 5, z: 255 },
      { x: -94, y: 5, z: 279 },
      { x: -99, y: 10, z: 289 },
      { x: -123, y: 10, z: 265 }
    ],
    covered: false,
    distance: 267,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== SPACE CITY DECK ==========
  {
    id: 'space-city-deck',
    name: 'Space City Deck',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: -42, y: 15, z: 372 },
      { x: 42, y: 15, z: 372 },
      { x: 47, y: 21, z: 382 },
      { x: -47, y: 21, z: 382 }
    ],
    covered: false,
    distance: 372,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== MISSION CONTROL PARTY DECK ==========
  {
    id: 'mission-control-deck',
    name: 'Mission Control Party Deck',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 21,
    rows: [],
    vertices3D: [
      { x: -155, y: 12, z: 297 },
      { x: -132, y: 12, z: 320 },
      { x: -137, y: 18, z: 326 },
      { x: -160, y: 18, z: 303 }
    ],
    covered: false,
    distance: 308,
    height: 12,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== KIDS ZONE ==========
  {
    id: 'kids-zone',
    name: 'Kids Zone',
    level: 'field',
    baseAngle: 58,
    angleSpan: 23,
    rows: generateRows(1, 10, 27, 6, 18),
    vertices3D: [
      { x: 148, y: 6, z: 273 },
      { x: 171, y: 6, z: 296 },
      { x: 176, y: 20, z: 310 },
      { x: 153, y: 20, z: 287 }
    ],
    covered: false,
    distance: 284,
    height: 6,
    rake: 18,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const sugarLandSpaceCowboysConfig = {
  stadiumName: 'Constellation Field',
  team: 'Sugar Land Space Cowboys',
  parentOrg: 'Houston Astros',
  city: 'Sugar Land',
  state: 'TX',
  level: 'AAA',
  capacity: 9500,
  opened: 2012,
  orientation: 315,
  dimensions: {
    leftField: 315,
    leftCenter: 365,
    centerField: 404,
    rightCenter: 365,
    rightField: 345
  },
  features: {
    spaceTheme: true,
    houstonSkylineView: true,
    insperityClub: true,
    orbitsOutpost: true,
    galaxyPavilion: true,
    spaceCityDeck: true,
    missionControlDeck: true,
    leftFieldLawn: true,
    kidsZone: true,
    coveredSeating: 2600
  }
};