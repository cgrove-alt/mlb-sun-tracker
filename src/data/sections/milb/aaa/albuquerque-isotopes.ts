// Rio Grande Credit Union Field - Albuquerque Isotopes (Colorado Rockies AAA)
// Opened: 2003
// Capacity: 11,124
// Known for Sandia Mountains views and high altitude baseball

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

export const albuquerqueIsotopesSections: DetailedSection[] = [
  // ========== COORS LIGHT CLUB ==========
  {
    id: 'coors-light-club',
    name: 'Coors Light Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 31,
    rows: generateRows('A', 'L', 38, 25, 28),
    vertices3D: [
      { x: -46, y: 25, z: 59 },
      { x: 46, y: 25, z: 59 },
      { x: 51, y: 54, z: 88 },
      { x: -51, y: 54, z: 88 }
    ],
    covered: true,
    distance: 59,
    height: 25,
    rake: 28,
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
    rows: generateRows('A', 'O', 24, 3, 23),
    vertices3D: [
      { x: -21, y: 3, z: 48 },
      { x: 21, y: 3, z: 48 },
      { x: 26, y: 34, z: 79 },
      { x: -26, y: 34, z: 79 }
    ],
    covered: false,
    distance: 48,
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
    angleSpan: 21,
    rows: generateRows('A', 'O', 25, 3, 23),
    vertices3D: [
      { x: 21, y: 3, z: 48 },
      { x: 41, y: 3, z: 57 },
      { x: 46, y: 34, z: 88 },
      { x: 26, y: 34, z: 79 }
    ],
    covered: false,
    distance: 52,
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
    angleSpan: 21,
    rows: generateRows('A', 'O', 25, 3, 23),
    vertices3D: [
      { x: -41, y: 3, z: 57 },
      { x: -21, y: 3, z: 48 },
      { x: -26, y: 34, z: 79 },
      { x: -46, y: 34, z: 88 }
    ],
    covered: false,
    distance: 52,
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
    rows: generateRows('A', 'O', 26, 3, 23),
    vertices3D: [
      { x: 51, y: 3, z: 82 },
      { x: 84, y: 3, z: 115 },
      { x: 89, y: 34, z: 146 },
      { x: 56, y: 34, z: 113 }
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
    rows: generateRows('A', 'O', 26, 3, 23),
    vertices3D: [
      { x: -84, y: 3, z: 115 },
      { x: -51, y: 3, z: 82 },
      { x: -56, y: 34, z: 113 },
      { x: -89, y: 34, z: 146 }
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
    angleSpan: 23,
    rows: generateRows(1, 26, 33, 11, 25),
    vertices3D: [
      { x: -34, y: 11, z: 68 },
      { x: 34, y: 11, z: 68 },
      { x: 39, y: 54, z: 111 },
      { x: -39, y: 54, z: 111 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['18', '19', '20', '21', '22', '23', '24', '25', '26'],
      coveragePercentage: 35
    },
    distance: 68,
    height: 11,
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
    rows: generateRows(1, 26, 31, 11, 25),
    vertices3D: [
      { x: 71, y: 11, z: 122 },
      { x: 103, y: 11, z: 154 },
      { x: 108, y: 54, z: 197 },
      { x: 76, y: 54, z: 165 }
    ],
    covered: false,
    distance: 138,
    height: 11,
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
    rows: generateRows(1, 26, 31, 11, 25),
    vertices3D: [
      { x: -103, y: 11, z: 154 },
      { x: -71, y: 11, z: 122 },
      { x: -76, y: 54, z: 165 },
      { x: -108, y: 54, z: 197 }
    ],
    covered: false,
    distance: 138,
    height: 11,
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
    angleSpan: 58,
    rows: [
      { rowNumber: 'Suite', seats: 360, elevation: 34, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -75, y: 34, z: 86 },
      { x: 75, y: 34, z: 86 },
      { x: 80, y: 44, z: 96 },
      { x: -80, y: 44, z: 96 }
    ],
    covered: true,
    distance: 86,
    height: 34,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== SANDIA MOUNTAIN TERRACE ==========
  {
    id: 'sandia-mountain-terrace',
    name: 'Sandia Mountain Terrace',
    level: 'upper',
    baseAngle: 128,
    angleSpan: 34,
    rows: generateRows(1, 9, 48, 36, 24),
    vertices3D: [
      { x: 104, y: 36, z: 341 },
      { x: 146, y: 36, z: 383 },
      { x: 151, y: 54, z: 401 },
      { x: 109, y: 54, z: 359 }
    ],
    covered: false,
    distance: 362,
    height: 36,
    rake: 24,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== HOMER'S LANDING ==========
  {
    id: 'homers-landing',
    name: "Homer's Landing",
    level: 'standing',
    baseAngle: 90,
    angleSpan: 29,
    rows: [],
    vertices3D: [
      { x: 119, y: 16, z: 288 },
      { x: 155, y: 16, z: 324 },
      { x: 160, y: 22, z: 330 },
      { x: 124, y: 22, z: 294 }
    ],
    covered: true,
    distance: 306,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 252,
    angleSpan: 28,
    rows: generateRows(1, 20, 38, 7, 21),
    vertices3D: [
      { x: -131, y: 7, z: 275 },
      { x: -105, y: 7, z: 301 },
      { x: -110, y: 36, z: 330 },
      { x: -136, y: 36, z: 304 }
    ],
    covered: false,
    distance: 288,
    height: 7,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== ISOTOPES HILL ==========
  {
    id: 'isotopes-hill',
    name: 'Isotopes Hill',
    level: 'field',
    baseAngle: 163,
    angleSpan: 35,
    rows: [],
    vertices3D: [
      { x: 135, y: 8, z: 385 },
      { x: 185, y: 8, z: 415 },
      { x: 190, y: 14, z: 425 },
      { x: 140, y: 14, z: 395 }
    ],
    covered: false,
    distance: 400,
    height: 8,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PARTY PAVILION ==========
  {
    id: 'party-pavilion',
    name: 'Party Pavilion',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 24,
    rows: [],
    vertices3D: [
      { x: -168, y: 15, z: 318 },
      { x: -143, y: 15, z: 343 },
      { x: -148, y: 21, z: 349 },
      { x: -173, y: 21, z: 324 }
    ],
    covered: false,
    distance: 330,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== BERM SEATING ==========
  {
    id: 'berm',
    name: 'Berm',
    level: 'field',
    baseAngle: 61,
    angleSpan: 26,
    rows: [],
    vertices3D: [
      { x: 161, y: 6, z: 295 },
      { x: 188, y: 6, z: 322 },
      { x: 193, y: 11, z: 332 },
      { x: 166, y: 11, z: 305 }
    ],
    covered: false,
    distance: 308,
    height: 6,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const albuquerqueIsotopesConfig = {
  stadiumName: 'Rio Grande Credit Union Field',
  team: 'Albuquerque Isotopes',
  parentOrg: 'Colorado Rockies',
  city: 'Albuquerque',
  state: 'NM',
  level: 'AAA',
  capacity: 11124,
  opened: 2003,
  orientation: 20,
  dimensions: {
    leftField: 340,
    leftCenter: 375,
    centerField: 400,
    rightCenter: 375,
    rightField: 340
  },
  features: {
    sandiaMountainsView: true,
    highAltitude: true,
    coorsLightClub: true,
    sandiaMountainTerrace: true,
    homersLanding: true,
    isotopesHill: true,
    partyPavilion: true,
    berm: true,
    coveredSeating: 3500,
    elevation: 5312
  }
};