// Dell Diamond - Round Rock Express (Texas Rangers AAA)
// Opened: 2000
// Capacity: 11,842
// Known for Texas Hill Country views and nightly fireworks

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

export const roundRockExpressSections: DetailedSection[] = [
  // ========== UNITED HERITAGE CENTER CLUB ==========
  {
    id: 'united-heritage-club',
    name: 'United Heritage Center Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 31,
    rows: generateRows('A', 'L', 39, 24, 27),
    vertices3D: [
      { x: -46, y: 24, z: 59 },
      { x: 46, y: 24, z: 59 },
      { x: 51, y: 52, z: 87 },
      { x: -51, y: 52, z: 87 }
    ],
    covered: true,
    distance: 59,
    height: 24,
    rake: 27,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD LEVEL BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 17,
    rows: generateRows('A', 'N', 24, 3, 23),
    vertices3D: [
      { x: -21, y: 3, z: 47 },
      { x: 21, y: 3, z: 47 },
      { x: 26, y: 33, z: 77 },
      { x: -26, y: 33, z: 77 }
    ],
    covered: false,
    distance: 47,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 17,
    angleSpan: 20,
    rows: generateRows('A', 'N', 25, 3, 23),
    vertices3D: [
      { x: 21, y: 3, z: 47 },
      { x: 40, y: 3, z: 56 },
      { x: 45, y: 33, z: 86 },
      { x: 26, y: 33, z: 77 }
    ],
    covered: false,
    distance: 51,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 343,
    angleSpan: 20,
    rows: generateRows('A', 'N', 25, 3, 23),
    vertices3D: [
      { x: -40, y: 3, z: 56 },
      { x: -21, y: 3, z: 47 },
      { x: -26, y: 33, z: 77 },
      { x: -45, y: 33, z: 86 }
    ],
    covered: false,
    distance: 51,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-107',
    name: 'Field Box 107',
    level: 'field',
    baseAngle: 45,
    angleSpan: 25,
    rows: generateRows('A', 'N', 26, 3, 23),
    vertices3D: [
      { x: 50, y: 3, z: 82 },
      { x: 83, y: 3, z: 115 },
      { x: 88, y: 33, z: 145 },
      { x: 55, y: 33, z: 112 }
    ],
    covered: false,
    distance: 98,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-115',
    name: 'Field Box 115',
    level: 'field',
    baseAngle: 315,
    angleSpan: 25,
    rows: generateRows('A', 'N', 26, 3, 23),
    vertices3D: [
      { x: -83, y: 3, z: 115 },
      { x: -50, y: 3, z: 82 },
      { x: -55, y: 33, z: 112 },
      { x: -88, y: 33, z: 145 }
    ],
    covered: false,
    distance: 98,
    height: 3,
    rake: 23,
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
    rows: generateRows(1, 25, 32, 10, 25),
    vertices3D: [
      { x: -33, y: 10, z: 67 },
      { x: 33, y: 10, z: 67 },
      { x: 38, y: 52, z: 109 },
      { x: -38, y: 52, z: 109 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['17', '18', '19', '20', '21', '22', '23', '24', '25'],
      coveragePercentage: 36
    },
    distance: 67,
    height: 10,
    rake: 25,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-207',
    name: 'Reserved 207',
    level: 'lower',
    baseAngle: 50,
    angleSpan: 27,
    rows: generateRows(1, 25, 30, 10, 25),
    vertices3D: [
      { x: 70, y: 10, z: 121 },
      { x: 102, y: 10, z: 153 },
      { x: 107, y: 52, z: 195 },
      { x: 75, y: 52, z: 163 }
    ],
    covered: false,
    distance: 137,
    height: 10,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-215',
    name: 'Reserved 215',
    level: 'lower',
    baseAngle: 310,
    angleSpan: 27,
    rows: generateRows(1, 25, 30, 10, 25),
    vertices3D: [
      { x: -102, y: 10, z: 153 },
      { x: -70, y: 10, z: 121 },
      { x: -75, y: 52, z: 163 },
      { x: -107, y: 52, z: 195 }
    ],
    covered: false,
    distance: 137,
    height: 10,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 57,
    rows: [
      { rowNumber: 'Suite', seats: 350, elevation: 33, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -74, y: 33, z: 85 },
      { x: 74, y: 33, z: 85 },
      { x: 79, y: 43, z: 95 },
      { x: -79, y: 43, z: 95 }
    ],
    covered: true,
    distance: 85,
    height: 33,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== ROCK PORCH ==========
  {
    id: 'rock-porch',
    name: 'Rock Porch',
    level: 'upper',
    baseAngle: 127,
    angleSpan: 33,
    rows: generateRows(1, 8, 47, 34, 23),
    vertices3D: [
      { x: 102, y: 34, z: 336 },
      { x: 143, y: 34, z: 377 },
      { x: 148, y: 50, z: 393 },
      { x: 107, y: 50, z: 352 }
    ],
    covered: false,
    distance: 356,
    height: 34,
    rake: 23,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== HOME RUN PORCH ==========
  {
    id: 'home-run-porch',
    name: 'Home Run Porch',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: 117, y: 15, z: 285 },
      { x: 152, y: 15, z: 320 },
      { x: 157, y: 21, z: 326 },
      { x: 122, y: 21, z: 291 }
    ],
    covered: true,
    distance: 302,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== HILL COUNTRY LAWN ==========
  {
    id: 'hill-country-lawn',
    name: 'Hill Country Lawn',
    level: 'field',
    baseAngle: 162,
    angleSpan: 38,
    rows: [],
    vertices3D: [
      { x: 128, y: 5, z: 378 },
      { x: 180, y: 5, z: 410 },
      { x: 185, y: 10, z: 420 },
      { x: 133, y: 10, z: 388 }
    ],
    covered: false,
    distance: 394,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 251,
    angleSpan: 27,
    rows: generateRows(1, 19, 37, 7, 21),
    vertices3D: [
      { x: -128, y: 7, z: 270 },
      { x: -103, y: 7, z: 295 },
      { x: -108, y: 34, z: 322 },
      { x: -133, y: 34, z: 297 }
    ],
    covered: false,
    distance: 282,
    height: 7,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== EXPRESS WAY PARTY DECK ==========
  {
    id: 'express-way-deck',
    name: 'Express Way Party Deck',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 22,
    rows: [],
    vertices3D: [
      { x: -165, y: 14, z: 313 },
      { x: -141, y: 14, z: 337 },
      { x: -146, y: 20, z: 343 },
      { x: -170, y: 20, z: 319 }
    ],
    covered: false,
    distance: 325,
    height: 14,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== FUN ZONE ==========
  {
    id: 'fun-zone',
    name: 'Fun Zone',
    level: 'field',
    baseAngle: 60,
    angleSpan: 25,
    rows: generateRows(1, 13, 31, 7, 19),
    vertices3D: [
      { x: 155, y: 7, z: 288 },
      { x: 180, y: 7, z: 313 },
      { x: 185, y: 24, z: 330 },
      { x: 160, y: 24, z: 305 }
    ],
    covered: false,
    distance: 300,
    height: 7,
    rake: 19,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const roundRockExpressConfig = {
  stadiumName: 'Dell Diamond',
  team: 'Round Rock Express',
  parentOrg: 'Texas Rangers',
  city: 'Round Rock',
  state: 'TX',
  level: 'AAA',
  capacity: 11842,
  opened: 2000,
  orientation: 30,
  dimensions: {
    leftField: 330,
    leftCenter: 375,
    centerField: 407,
    rightCenter: 375,
    rightField: 325
  },
  features: {
    texasHillCountryView: true,
    nightlyFireworks: true,
    unitedHeritageClub: true,
    rockPorch: true,
    homeRunPorch: true,
    hillCountryLawn: true,
    expressWayDeck: true,
    funZone: true,
    coveredSeating: 3400
  }
};