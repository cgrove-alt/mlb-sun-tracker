// Sutter Health Park - Sacramento River Cats (San Francisco Giants AAA)
// Opened: 2000
// Capacity: 14,014
// Known for Tower Bridge views and Sacramento River proximity

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

export const sacramentoRiverCatsSections: DetailedSection[] = [
  // ========== SOLON CLUB ==========
  {
    id: 'solon-club',
    name: 'Solon Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 33,
    rows: generateRows('A', 'M', 41, 26, 29),
    vertices3D: [
      { x: -48, y: 26, z: 61 },
      { x: 48, y: 26, z: 61 },
      { x: 53, y: 58, z: 93 },
      { x: -53, y: 58, z: 93 }
    ],
    covered: true,
    distance: 61,
    height: 26,
    rake: 29,
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
    rows: generateRows('A', 'P', 26, 3, 24),
    vertices3D: [
      { x: -21, y: 3, z: 49 },
      { x: 21, y: 3, z: 49 },
      { x: 26, y: 37, z: 83 },
      { x: -26, y: 37, z: 83 }
    ],
    covered: false,
    distance: 49,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 17,
    angleSpan: 22,
    rows: generateRows('A', 'P', 27, 3, 24),
    vertices3D: [
      { x: 21, y: 3, z: 49 },
      { x: 43, y: 3, z: 59 },
      { x: 48, y: 37, z: 93 },
      { x: 26, y: 37, z: 83 }
    ],
    covered: false,
    distance: 54,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 343,
    angleSpan: 22,
    rows: generateRows('A', 'P', 27, 3, 24),
    vertices3D: [
      { x: -43, y: 3, z: 59 },
      { x: -21, y: 3, z: 49 },
      { x: -26, y: 37, z: 83 },
      { x: -48, y: 37, z: 93 }
    ],
    covered: false,
    distance: 54,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 47,
    angleSpan: 26,
    rows: generateRows('A', 'P', 28, 3, 24),
    vertices3D: [
      { x: 53, y: 3, z: 86 },
      { x: 88, y: 3, z: 121 },
      { x: 93, y: 37, z: 155 },
      { x: 58, y: 37, z: 120 }
    ],
    covered: false,
    distance: 103,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-116',
    name: 'Field Box 116',
    level: 'field',
    baseAngle: 313,
    angleSpan: 26,
    rows: generateRows('A', 'P', 28, 3, 24),
    vertices3D: [
      { x: -88, y: 3, z: 121 },
      { x: -53, y: 3, z: 86 },
      { x: -58, y: 37, z: 120 },
      { x: -93, y: 37, z: 155 }
    ],
    covered: false,
    distance: 103,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 24,
    rows: generateRows(1, 28, 35, 11, 26),
    vertices3D: [
      { x: -36, y: 11, z: 71 },
      { x: 36, y: 11, z: 71 },
      { x: 41, y: 58, z: 118 },
      { x: -41, y: 58, z: 118 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 32
    },
    distance: 71,
    height: 11,
    rake: 26,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-208',
    name: 'Reserved 208',
    level: 'lower',
    baseAngle: 53,
    angleSpan: 29,
    rows: generateRows(1, 28, 33, 11, 26),
    vertices3D: [
      { x: 75, y: 11, z: 129 },
      { x: 110, y: 11, z: 164 },
      { x: 115, y: 58, z: 211 },
      { x: 80, y: 58, z: 176 }
    ],
    covered: false,
    distance: 146,
    height: 11,
    rake: 26,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-216',
    name: 'Reserved 216',
    level: 'lower',
    baseAngle: 307,
    angleSpan: 29,
    rows: generateRows(1, 28, 33, 11, 26),
    vertices3D: [
      { x: -110, y: 11, z: 164 },
      { x: -75, y: 11, z: 129 },
      { x: -80, y: 58, z: 176 },
      { x: -115, y: 58, z: 211 }
    ],
    covered: false,
    distance: 146,
    height: 11,
    rake: 26,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 62,
    rows: [
      { rowNumber: 'Suite', seats: 400, elevation: 36, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -81, y: 36, z: 91 },
      { x: 81, y: 36, z: 91 },
      { x: 86, y: 46, z: 101 },
      { x: -86, y: 46, z: 101 }
    ],
    covered: true,
    distance: 91,
    height: 36,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== TOWER BRIDGE VIEW DECK ==========
  {
    id: 'tower-bridge-deck',
    name: 'Tower Bridge View Deck',
    level: 'upper',
    baseAngle: 132,
    angleSpan: 36,
    rows: generateRows(1, 11, 52, 38, 25),
    vertices3D: [
      { x: 112, y: 38, z: 365 },
      { x: 157, y: 38, z: 410 },
      { x: 162, y: 59, z: 431 },
      { x: 117, y: 59, z: 386 }
    ],
    covered: false,
    distance: 387,
    height: 38,
    rake: 25,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== RIVER CATS COVE ==========
  {
    id: 'river-cats-cove',
    name: 'River Cats Cove',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 31,
    rows: [],
    vertices3D: [
      { x: 125, y: 17, z: 302 },
      { x: 164, y: 17, z: 341 },
      { x: 169, y: 23, z: 347 },
      { x: 130, y: 23, z: 308 }
    ],
    covered: true,
    distance: 321,
    height: 17,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 256,
    angleSpan: 30,
    rows: generateRows(1, 22, 42, 8, 22),
    vertices3D: [
      { x: -138, y: 8, z: 288 },
      { x: -110, y: 8, z: 316 },
      { x: -115, y: 40, z: 348 },
      { x: -143, y: 40, z: 320 }
    ],
    covered: false,
    distance: 302,
    height: 8,
    rake: 22,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== TOYOTA HOME RUN HILL ==========
  {
    id: 'toyota-home-run-hill',
    name: 'Toyota Home Run Hill',
    level: 'field',
    baseAngle: 168,
    angleSpan: 40,
    rows: [],
    vertices3D: [
      { x: 143, y: 6, z: 402 },
      { x: 198, y: 6, z: 437 },
      { x: 203, y: 12, z: 447 },
      { x: 148, y: 12, z: 412 }
    ],
    covered: false,
    distance: 419,
    height: 6,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PARTY PLAZA ==========
  {
    id: 'party-plaza',
    name: 'Party Plaza',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: -178, y: 16, z: 338 },
      { x: -151, y: 16, z: 365 },
      { x: -156, y: 22, z: 371 },
      { x: -183, y: 22, z: 344 }
    ],
    covered: false,
    distance: 351,
    height: 16,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== RIVER VIEW TERRACE ==========
  {
    id: 'river-view-terrace',
    name: 'River View Terrace',
    level: 'field',
    baseAngle: 63,
    angleSpan: 28,
    rows: generateRows(1, 15, 34, 8, 20),
    vertices3D: [
      { x: 171, y: 8, z: 315 },
      { x: 200, y: 8, z: 344 },
      { x: 205, y: 28, z: 364 },
      { x: 176, y: 28, z: 335 }
    ],
    covered: false,
    distance: 329,
    height: 8,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const sacramentoRiverCatsConfig = {
  stadiumName: 'Sutter Health Park',
  team: 'Sacramento River Cats',
  parentOrg: 'San Francisco Giants',
  city: 'West Sacramento',
  state: 'CA',
  level: 'AAA',
  capacity: 14014,
  opened: 2000,
  orientation: 20,
  dimensions: {
    leftField: 330,
    leftCenter: 375,
    centerField: 403,
    rightCenter: 375,
    rightField: 325
  },
  features: {
    towerBridgeView: true,
    sacramentoRiverProximity: true,
    solonClub: true,
    towerBridgeDeck: true,
    riverCatsCove: true,
    toyotaHomeRunHill: true,
    partyPlaza: true,
    riverViewTerrace: true,
    coveredSeating: 4100
  }
};