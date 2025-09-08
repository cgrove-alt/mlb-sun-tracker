// NBT Bank Stadium - Syracuse Mets (New York Mets AAA)
// Opened: 1997
// Capacity: 10,815
// Known for downtown Syracuse skyline and Onondaga Lake views

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

export const syracuseMetsSections: DetailedSection[] = [
  // ========== EXCELSIOR CLUB ==========
  {
    id: 'excelsior-club',
    name: 'Excelsior Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 31,
    rows: generateRows('A', 'L', 37, 24, 27),
    vertices3D: [
      { x: -45, y: 24, z: 58 },
      { x: 45, y: 24, z: 58 },
      { x: 50, y: 53, z: 87 },
      { x: -50, y: 53, z: 87 }
    ],
    covered: true,
    distance: 58,
    height: 24,
    rake: 27,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 17,
    rows: generateRows('A', 'O', 24, 3, 23),
    vertices3D: [
      { x: -21, y: 3, z: 47 },
      { x: 21, y: 3, z: 47 },
      { x: 26, y: 34, z: 78 },
      { x: -26, y: 34, z: 78 }
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
    rows: generateRows('A', 'O', 25, 3, 23),
    vertices3D: [
      { x: 21, y: 3, z: 47 },
      { x: 40, y: 3, z: 55 },
      { x: 45, y: 34, z: 86 },
      { x: 26, y: 34, z: 78 }
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
    rows: generateRows('A', 'O', 25, 3, 23),
    vertices3D: [
      { x: -40, y: 3, z: 55 },
      { x: -21, y: 3, z: 47 },
      { x: -26, y: 34, z: 78 },
      { x: -45, y: 34, z: 86 }
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
    baseAngle: 44,
    angleSpan: 25,
    rows: generateRows('A', 'O', 26, 3, 23),
    vertices3D: [
      { x: 50, y: 3, z: 81 },
      { x: 82, y: 3, z: 113 },
      { x: 87, y: 34, z: 144 },
      { x: 55, y: 34, z: 112 }
    ],
    covered: false,
    distance: 97,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-115',
    name: 'Field Box 115',
    level: 'field',
    baseAngle: 316,
    angleSpan: 25,
    rows: generateRows('A', 'O', 26, 3, 23),
    vertices3D: [
      { x: -82, y: 3, z: 113 },
      { x: -50, y: 3, z: 81 },
      { x: -55, y: 34, z: 112 },
      { x: -87, y: 34, z: 144 }
    ],
    covered: false,
    distance: 97,
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
    rows: generateRows(1, 25, 33, 10, 25),
    vertices3D: [
      { x: -34, y: 10, z: 67 },
      { x: 34, y: 10, z: 67 },
      { x: 39, y: 52, z: 109 },
      { x: -39, y: 52, z: 109 }
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
    baseAngle: 49,
    angleSpan: 26,
    rows: generateRows(1, 25, 31, 10, 25),
    vertices3D: [
      { x: 70, y: 10, z: 120 },
      { x: 101, y: 10, z: 151 },
      { x: 106, y: 52, z: 193 },
      { x: 75, y: 52, z: 162 }
    ],
    covered: false,
    distance: 135,
    height: 10,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-215',
    name: 'Reserved 215',
    level: 'lower',
    baseAngle: 311,
    angleSpan: 26,
    rows: generateRows(1, 25, 31, 10, 25),
    vertices3D: [
      { x: -101, y: 10, z: 151 },
      { x: -70, y: 10, z: 120 },
      { x: -75, y: 52, z: 162 },
      { x: -106, y: 52, z: 193 }
    ],
    covered: false,
    distance: 135,
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

  // ========== SALT CITY DECK ==========
  {
    id: 'salt-city-deck',
    name: 'Salt City Deck',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 29,
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

  // ========== ONONDAGA LAKE VIEW TERRACE ==========
  {
    id: 'onondaga-terrace',
    name: 'Onondaga Lake View Terrace',
    level: 'upper',
    baseAngle: 128,
    angleSpan: 33,
    rows: generateRows(1, 9, 47, 35, 23),
    vertices3D: [
      { x: 102, y: 35, z: 335 },
      { x: 143, y: 35, z: 376 },
      { x: 148, y: 52, z: 393 },
      { x: 107, y: 52, z: 352 }
    ],
    covered: false,
    distance: 355,
    height: 35,
    rake: 23,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== PICNIC PAVILION ==========
  {
    id: 'picnic-pavilion',
    name: 'Picnic Pavilion',
    level: 'field',
    baseAngle: 270,
    angleSpan: 24,
    rows: [],
    vertices3D: [
      { x: -165, y: 8, z: 313 },
      { x: -140, y: 8, z: 338 },
      { x: -145, y: 14, z: 344 },
      { x: -170, y: 14, z: 319 }
    ],
    covered: false,
    distance: 325,
    height: 8,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== HANK SAUER ROOM ==========
  {
    id: 'hank-sauer-room',
    name: 'Hank Sauer Room',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -45, y: 18, z: 395 },
      { x: 45, y: 18, z: 395 },
      { x: 50, y: 24, z: 405 },
      { x: -50, y: 24, z: 405 }
    ],
    covered: false,
    distance: 395,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== BERM SEATING ==========
  {
    id: 'berm',
    name: 'Berm',
    level: 'field',
    baseAngle: 60,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: 158, y: 5, z: 288 },
      { x: 183, y: 5, z: 313 },
      { x: 188, y: 10, z: 323 },
      { x: 163, y: 10, z: 298 }
    ],
    covered: false,
    distance: 300,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const syracuseMetsConfig = {
  stadiumName: 'NBT Bank Stadium',
  team: 'Syracuse Mets',
  parentOrg: 'New York Mets',
  city: 'Syracuse',
  state: 'NY',
  level: 'AAA',
  capacity: 10815,
  opened: 1997,
  orientation: 315,
  dimensions: {
    leftField: 330,
    leftCenter: 370,
    centerField: 400,
    rightCenter: 370,
    rightField: 330
  },
  features: {
    downtownSyracuseView: true,
    onondagaLakeView: true,
    excelsiorClub: true,
    saltCityDeck: true,
    onondagaTerrace: true,
    hankSauerRoom: true,
    picnicPavilion: true,
    berm: true,
    coveredSeating: 3400
  }
};