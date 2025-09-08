// Coca-Cola Park - Lehigh Valley IronPigs (Philadelphia Phillies AAA)
// Opened: 2008
// Capacity: 10,100
// Known for bacon-themed concessions and Lehigh Valley views

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

export const lehighValleyIronPigsSections: DetailedSection[] = [
  // ========== PIG PEN (Premium Club) ==========
  {
    id: 'pig-pen',
    name: 'Pig Pen',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'L', 36, 24, 27),
    vertices3D: [
      { x: -43, y: 24, z: 58 },
      { x: 43, y: 24, z: 58 },
      { x: 48, y: 51, z: 85 },
      { x: -48, y: 51, z: 85 }
    ],
    covered: true,
    distance: 58,
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
    angleSpan: 19,
    rows: generateRows('A', 'P', 23, 4, 23),
    vertices3D: [
      { x: -23, y: 4, z: 48 },
      { x: 23, y: 4, z: 48 },
      { x: 28, y: 35, z: 79 },
      { x: -28, y: 35, z: 79 }
    ],
    covered: false,
    distance: 48,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-106',
    name: 'Field Box 106',
    level: 'field',
    baseAngle: 43,
    angleSpan: 24,
    rows: generateRows('A', 'P', 25, 4, 23),
    vertices3D: [
      { x: 49, y: 4, z: 80 },
      { x: 80, y: 4, z: 111 },
      { x: 85, y: 35, z: 142 },
      { x: 54, y: 35, z: 111 }
    ],
    covered: false,
    distance: 95,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-114',
    name: 'Field Box 114',
    level: 'field',
    baseAngle: 317,
    angleSpan: 24,
    rows: generateRows('A', 'P', 25, 4, 23),
    vertices3D: [
      { x: -80, y: 4, z: 111 },
      { x: -49, y: 4, z: 80 },
      { x: -54, y: 35, z: 111 },
      { x: -85, y: 35, z: 142 }
    ],
    covered: false,
    distance: 95,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== INFIELD RESERVED ==========
  {
    id: 'infield-reserved-200',
    name: 'Infield Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 21,
    rows: generateRows(1, 26, 31, 11, 25),
    vertices3D: [
      { x: -33, y: 11, z: 66 },
      { x: 33, y: 11, z: 66 },
      { x: 38, y: 52, z: 107 },
      { x: -38, y: 52, z: 107 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['17', '18', '19', '20', '21', '22', '23', '24', '25', '26'],
      coveragePercentage: 38
    },
    distance: 66,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'infield-reserved-207',
    name: 'Infield Reserved 207',
    level: 'lower',
    baseAngle: 49,
    angleSpan: 26,
    rows: generateRows(1, 26, 29, 11, 25),
    vertices3D: [
      { x: 69, y: 11, z: 118 },
      { x: 100, y: 11, z: 149 },
      { x: 105, y: 52, z: 190 },
      { x: 74, y: 52, z: 159 }
    ],
    covered: false,
    distance: 133,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'infield-reserved-215',
    name: 'Infield Reserved 215',
    level: 'lower',
    baseAngle: 311,
    angleSpan: 26,
    rows: generateRows(1, 26, 29, 11, 25),
    vertices3D: [
      { x: -100, y: 11, z: 149 },
      { x: -69, y: 11, z: 118 },
      { x: -74, y: 52, z: 159 },
      { x: -105, y: 52, z: 190 }
    ],
    covered: false,
    distance: 133,
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
    angleSpan: 55,
    rows: [
      { rowNumber: 'Suite', seats: 310, elevation: 32, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -71, y: 32, z: 83 },
      { x: 71, y: 32, z: 83 },
      { x: 76, y: 42, z: 93 },
      { x: -76, y: 42, z: 93 }
    ],
    covered: true,
    distance: 83,
    height: 32,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== BACON STRIP (Party Deck) ==========
  {
    id: 'bacon-strip',
    name: 'Bacon Strip',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: 120, y: 16, z: 285 },
      { x: 155, y: 16, z: 320 },
      { x: 160, y: 22, z: 326 },
      { x: 125, y: 22, z: 291 }
    ],
    covered: true,
    distance: 302,
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
    baseAngle: 250,
    angleSpan: 25,
    rows: generateRows(1, 19, 37, 7, 21),
    vertices3D: [
      { x: -128, y: 7, z: 268 },
      { x: -103, y: 7, z: 293 },
      { x: -108, y: 33, z: 319 },
      { x: -133, y: 33, z: 294 }
    ],
    covered: false,
    distance: 280,
    height: 7,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== TIKI TERRACE ==========
  {
    id: 'tiki-terrace',
    name: 'Tiki Terrace',
    level: 'upper',
    baseAngle: 125,
    angleSpan: 30,
    rows: generateRows(1, 11, 46, 34, 23),
    vertices3D: [
      { x: 98, y: 34, z: 328 },
      { x: 138, y: 34, z: 368 },
      { x: 143, y: 53, z: 387 },
      { x: 103, y: 53, z: 347 }
    ],
    covered: false,
    distance: 348,
    height: 34,
    rake: 23,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== BERKS PICNIC PATIO ==========
  {
    id: 'berks-picnic-patio',
    name: 'Berks Picnic Patio',
    level: 'field',
    baseAngle: 270,
    angleSpan: 22,
    rows: [],
    vertices3D: [
      { x: -158, y: 8, z: 300 },
      { x: -133, y: 8, z: 325 },
      { x: -138, y: 14, z: 331 },
      { x: -163, y: 14, z: 306 }
    ],
    covered: false,
    distance: 312,
    height: 8,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== LAWN SEATING ==========
  {
    id: 'lawn',
    name: 'Lawn',
    level: 'field',
    baseAngle: 165,
    angleSpan: 38,
    rows: [],
    vertices3D: [
      { x: 125, y: 5, z: 365 },
      { x: 175, y: 5, z: 395 },
      { x: 180, y: 10, z: 405 },
      { x: 130, y: 10, z: 375 }
    ],
    covered: false,
    distance: 380,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== COCA-COLA CORNER ==========
  {
    id: 'coca-cola-corner',
    name: 'Coca-Cola Corner',
    level: 'standing',
    baseAngle: 45,
    angleSpan: 18,
    rows: [],
    vertices3D: [
      { x: 148, y: 17, z: 350 },
      { x: 170, y: 17, z: 372 },
      { x: 175, y: 23, z: 378 },
      { x: 153, y: 23, z: 356 }
    ],
    covered: false,
    distance: 361,
    height: 17,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== PIG ALLEY ==========
  {
    id: 'pig-alley',
    name: 'Pig Alley',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: -42, y: 18, z: 392 },
      { x: 42, y: 18, z: 392 },
      { x: 47, y: 24, z: 402 },
      { x: -47, y: 24, z: 402 }
    ],
    covered: false,
    distance: 392,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const lehighValleyIronPigsConfig = {
  stadiumName: 'Coca-Cola Park',
  team: 'Lehigh Valley IronPigs',
  parentOrg: 'Philadelphia Phillies',
  city: 'Allentown',
  state: 'PA',
  level: 'AAA',
  capacity: 10100,
  opened: 2008,
  orientation: 90,
  dimensions: {
    leftField: 334,
    leftCenter: 374,
    centerField: 400,
    rightCenter: 369,
    rightField: 325
  },
  features: {
    pigPen: true,
    baconStrip: true,
    tikiTerrace: true,
    berksPicnicPatio: true,
    cocaColaCorner: true,
    pigAlley: true,
    lawn: true,
    baconThemedConcessions: true,
    lehighValleyViews: true,
    coveredSeating: 3000
  }
};