// Principal Park - Iowa Cubs (Chicago Cubs AAA)
// Opened: 1992
// Capacity: 11,500
// Known for downtown Des Moines skyline and Iowa State Capitol views

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

export const iowaCubsSections: DetailedSection[] = [
  // ========== DIAMOND CLUB ==========
  {
    id: 'diamond-club',
    name: 'Diamond Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'L', 40, 25, 27),
    vertices3D: [
      { x: -46, y: 25, z: 60 },
      { x: 46, y: 25, z: 60 },
      { x: 51, y: 53, z: 88 },
      { x: -51, y: 53, z: 88 }
    ],
    covered: true,
    distance: 60,
    height: 25,
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
    angleSpan: 18,
    rows: generateRows('A', 'P', 25, 4, 23),
    vertices3D: [
      { x: -24, y: 4, z: 48 },
      { x: 24, y: 4, z: 48 },
      { x: 29, y: 35, z: 79 },
      { x: -29, y: 35, z: 79 }
    ],
    covered: false,
    distance: 48,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 44,
    angleSpan: 23,
    rows: generateRows('A', 'P', 27, 4, 23),
    vertices3D: [
      { x: 50, y: 4, z: 80 },
      { x: 82, y: 4, z: 112 },
      { x: 87, y: 35, z: 143 },
      { x: 55, y: 35, z: 111 }
    ],
    covered: false,
    distance: 96,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-116',
    name: 'Field Box 116',
    level: 'field',
    baseAngle: 316,
    angleSpan: 23,
    rows: generateRows('A', 'P', 27, 4, 23),
    vertices3D: [
      { x: -82, y: 4, z: 112 },
      { x: -50, y: 4, z: 80 },
      { x: -55, y: 35, z: 111 },
      { x: -87, y: 35, z: 143 }
    ],
    covered: false,
    distance: 96,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED GRANDSTAND ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows(1, 27, 32, 11, 25),
    vertices3D: [
      { x: -34, y: 11, z: 67 },
      { x: 34, y: 11, z: 67 },
      { x: 39, y: 54, z: 110 },
      { x: -39, y: 54, z: 110 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['19', '20', '21', '22', '23', '24', '25', '26', '27'],
      coveragePercentage: 33
    },
    distance: 67,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-206',
    name: 'Reserved 206',
    level: 'lower',
    baseAngle: 50,
    angleSpan: 25,
    rows: generateRows(1, 27, 30, 11, 25),
    vertices3D: [
      { x: 70, y: 11, z: 120 },
      { x: 102, y: 11, z: 152 },
      { x: 107, y: 54, z: 195 },
      { x: 75, y: 54, z: 163 }
    ],
    covered: false,
    distance: 136,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-214',
    name: 'Reserved 214',
    level: 'lower',
    baseAngle: 310,
    angleSpan: 25,
    rows: generateRows(1, 27, 30, 11, 25),
    vertices3D: [
      { x: -102, y: 11, z: 152 },
      { x: -70, y: 11, z: 120 },
      { x: -75, y: 54, z: 163 },
      { x: -107, y: 54, z: 195 }
    ],
    covered: false,
    distance: 136,
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
    angleSpan: 60,
    rows: [
      { rowNumber: 'Suite', seats: 320, elevation: 33, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -75, y: 33, z: 85 },
      { x: 75, y: 33, z: 85 },
      { x: 80, y: 43, z: 95 },
      { x: -80, y: 43, z: 95 }
    ],
    covered: true,
    distance: 85,
    height: 33,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 250,
    angleSpan: 28,
    rows: generateRows(1, 20, 38, 7, 21),
    vertices3D: [
      { x: -130, y: 7, z: 270 },
      { x: -105, y: 7, z: 295 },
      { x: -110, y: 35, z: 323 },
      { x: -135, y: 35, z: 298 }
    ],
    covered: false,
    distance: 282,
    height: 7,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== RIGHT FIELD PAVILION ==========
  {
    id: 'right-field-pavilion',
    name: 'Right Field Pavilion',
    level: 'field',
    baseAngle: 70,
    angleSpan: 28,
    rows: generateRows(1, 20, 38, 7, 21),
    vertices3D: [
      { x: 105, y: 7, z: 295 },
      { x: 130, y: 7, z: 270 },
      { x: 135, y: 35, z: 298 },
      { x: 110, y: 35, z: 323 }
    ],
    covered: false,
    distance: 282,
    height: 7,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== IOWA CLUB ==========
  {
    id: 'iowa-club',
    name: 'Iowa Club',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 40,
    rows: generateRows(1, 10, 50, 40, 25),
    vertices3D: [
      { x: -55, y: 40, z: 98 },
      { x: 55, y: 40, z: 98 },
      { x: 60, y: 58, z: 116 },
      { x: -60, y: 58, z: 116 }
    ],
    covered: true,
    distance: 98,
    height: 40,
    rake: 25,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== BERM SEATING ==========
  {
    id: 'berm',
    name: 'Berm',
    level: 'field',
    baseAngle: 160,
    angleSpan: 40,
    rows: [],
    vertices3D: [
      { x: 130, y: 4, z: 365 },
      { x: 180, y: 4, z: 395 },
      { x: 185, y: 9, z: 405 },
      { x: 135, y: 9, z: 375 }
    ],
    covered: false,
    distance: 380,
    height: 4,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PARTY PAVILION ==========
  {
    id: 'party-pavilion',
    name: 'Party Pavilion',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: 125, y: 15, z: 335 },
      { x: 155, y: 15, z: 365 },
      { x: 160, y: 21, z: 371 },
      { x: 130, y: 21, z: 341 }
    ],
    covered: true,
    distance: 350,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== CAPITOL VIEW ==========
  {
    id: 'capitol-view',
    name: 'Capitol View',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 30,
    rows: generateRows(1, 8, 45, 35, 22),
    vertices3D: [
      { x: 95, y: 35, z: 325 },
      { x: 135, y: 35, z: 365 },
      { x: 140, y: 50, z: 380 },
      { x: 100, y: 50, z: 340 }
    ],
    covered: false,
    distance: 345,
    height: 35,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== CRAFT BEER CORNER ==========
  {
    id: 'craft-beer-corner',
    name: 'Craft Beer Corner',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: -165, y: 16, z: 310 },
      { x: -140, y: 16, z: 335 },
      { x: -145, y: 22, z: 341 },
      { x: -170, y: 22, z: 316 }
    ],
    covered: false,
    distance: 322,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  }
];

// Stadium configuration
export const iowaCubsConfig = {
  stadiumName: 'Principal Park',
  team: 'Iowa Cubs',
  parentOrg: 'Chicago Cubs',
  city: 'Des Moines',
  state: 'IA',
  level: 'AAA',
  capacity: 11500,
  opened: 1992,
  orientation: 60,
  dimensions: {
    leftField: 335,
    leftCenter: 375,
    centerField: 400,
    rightCenter: 375,
    rightField: 325
  },
  features: {
    diamondClub: true,
    iowaClub: true,
    capitolView: true,
    berm: true,
    partyPavilion: true,
    craftBeerCorner: true,
    downtownDesMoinesView: true,
    iowaStateCapitolView: true,
    coveredSeating: 3400
  }
};