// Victory Field - Indianapolis Indians (Pittsburgh Pirates AAA)
// Opened: 1996
// Capacity: 14,230
// Known for downtown skyline views and best AAA ballpark awards

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

export const indianapolisIndiansSections: DetailedSection[] = [
  // ========== ELEMENTS FINANCIAL CLUB ==========
  {
    id: 'elements-financial-club',
    name: 'Elements Financial Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 32,
    rows: generateRows('A', 'M', 42, 26, 28),
    vertices3D: [
      { x: -48, y: 26, z: 62 },
      { x: 48, y: 26, z: 62 },
      { x: 53, y: 56, z: 92 },
      { x: -53, y: 56, z: 92 }
    ],
    covered: true,
    distance: 62,
    height: 26,
    rake: 28,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 340,
    angleSpan: 20,
    rows: generateRows('A', 'R', 26, 3, 24),
    vertices3D: [
      { x: -28, y: 3, z: 50 },
      { x: -8, y: 3, z: 50 },
      { x: -3, y: 40, z: 87 },
      { x: -23, y: 40, z: 87 }
    ],
    covered: false,
    distance: 50,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows('A', 'R', 26, 3, 24),
    vertices3D: [
      { x: -8, y: 3, z: 50 },
      { x: 8, y: 3, z: 50 },
      { x: 13, y: 40, z: 87 },
      { x: -3, y: 40, z: 87 }
    ],
    covered: false,
    distance: 50,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-103',
    name: 'Field Box 103',
    level: 'field',
    baseAngle: 20,
    angleSpan: 20,
    rows: generateRows('A', 'R', 26, 3, 24),
    vertices3D: [
      { x: 8, y: 3, z: 50 },
      { x: 28, y: 3, z: 50 },
      { x: 23, y: 40, z: 87 },
      { x: 3, y: 40, z: 87 }
    ],
    covered: false,
    distance: 50,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 48,
    angleSpan: 24,
    rows: generateRows('A', 'R', 28, 3, 24),
    vertices3D: [
      { x: 52, y: 3, z: 85 },
      { x: 85, y: 3, z: 118 },
      { x: 90, y: 40, z: 155 },
      { x: 57, y: 40, z: 122 }
    ],
    covered: false,
    distance: 101,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-118',
    name: 'Field Box 118',
    level: 'field',
    baseAngle: 312,
    angleSpan: 24,
    rows: generateRows('A', 'R', 28, 3, 24),
    vertices3D: [
      { x: -85, y: 3, z: 118 },
      { x: -52, y: 3, z: 85 },
      { x: -57, y: 40, z: 122 },
      { x: -90, y: 40, z: 155 }
    ],
    covered: false,
    distance: 101,
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
    angleSpan: 22,
    rows: generateRows(1, 28, 34, 10, 26),
    vertices3D: [
      { x: -36, y: 10, z: 70 },
      { x: 36, y: 10, z: 70 },
      { x: 41, y: 58, z: 118 },
      { x: -41, y: 58, z: 118 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['20', '21', '22', '23', '24', '25', '26', '27', '28'],
      coveragePercentage: 32
    },
    distance: 70,
    height: 10,
    rake: 26,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-208',
    name: 'Reserved 208',
    level: 'lower',
    baseAngle: 54,
    angleSpan: 26,
    rows: generateRows(1, 28, 32, 10, 26),
    vertices3D: [
      { x: 72, y: 10, z: 125 },
      { x: 105, y: 10, z: 158 },
      { x: 110, y: 58, z: 206 },
      { x: 77, y: 58, z: 173 }
    ],
    covered: false,
    distance: 141,
    height: 10,
    rake: 26,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-216',
    name: 'Reserved 216',
    level: 'lower',
    baseAngle: 306,
    angleSpan: 26,
    rows: generateRows(1, 28, 32, 10, 26),
    vertices3D: [
      { x: -105, y: 10, z: 158 },
      { x: -72, y: 10, z: 125 },
      { x: -77, y: 58, z: 173 },
      { x: -110, y: 58, z: 206 }
    ],
    covered: false,
    distance: 141,
    height: 10,
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
    angleSpan: 65,
    rows: [
      { rowNumber: 'Suite', seats: 360, elevation: 34, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -78, y: 34, z: 88 },
      { x: 78, y: 34, z: 88 },
      { x: 83, y: 44, z: 98 },
      { x: -83, y: 44, z: 98 }
    ],
    covered: true,
    distance: 88,
    height: 34,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== LAWN ==========
  {
    id: 'lawn',
    name: 'Lawn',
    level: 'field',
    baseAngle: 150,
    angleSpan: 40,
    rows: [],
    vertices3D: [
      { x: 125, y: 5, z: 355 },
      { x: 175, y: 5, z: 385 },
      { x: 180, y: 10, z: 395 },
      { x: 130, y: 10, z: 365 }
    ],
    covered: false,
    distance: 370,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== KNOT HOLE GANG ==========
  {
    id: 'knot-hole-gang',
    name: 'Knot Hole Gang',
    level: 'field',
    baseAngle: 270,
    angleSpan: 28,
    rows: generateRows(1, 22, 40, 6, 21),
    vertices3D: [
      { x: -155, y: 6, z: 275 },
      { x: -125, y: 6, z: 305 },
      { x: -130, y: 38, z: 337 },
      { x: -160, y: 38, z: 307 }
    ],
    covered: false,
    distance: 290,
    height: 6,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== OUTFIELD TERRACE ==========
  {
    id: 'outfield-terrace',
    name: 'Outfield Terrace',
    level: 'upper',
    baseAngle: 110,
    angleSpan: 32,
    rows: generateRows(1, 10, 48, 32, 23),
    vertices3D: [
      { x: 115, y: 32, z: 315 },
      { x: 155, y: 32, z: 355 },
      { x: 160, y: 50, z: 373 },
      { x: 120, y: 50, z: 333 }
    ],
    covered: false,
    distance: 335,
    height: 32,
    rake: 23,
    viewQuality: 'good',
    price: 'moderate'
  },

  // ========== INDIANAPOLIS SKYLINE DECK ==========
  {
    id: 'skyline-deck',
    name: 'Indianapolis Skyline Deck',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -45, y: 20, z: 395 },
      { x: 45, y: 20, z: 395 },
      { x: 50, y: 25, z: 405 },
      { x: -50, y: 25, z: 405 }
    ],
    covered: false,
    distance: 395,
    height: 20,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== CAPTAIN MORGAN BAR ==========
  {
    id: 'captain-morgan-bar',
    name: 'Captain Morgan Bar',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 22,
    rows: [],
    vertices3D: [
      { x: 140, y: 18, z: 345 },
      { x: 165, y: 18, z: 370 },
      { x: 170, y: 24, z: 376 },
      { x: 145, y: 24, z: 351 }
    ],
    covered: true,
    distance: 357,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  }
];

// Stadium configuration
export const indianapolisIndiansConfig = {
  stadiumName: 'Victory Field',
  team: 'Indianapolis Indians',
  parentOrg: 'Pittsburgh Pirates',
  city: 'Indianapolis',
  state: 'IN',
  level: 'AAA',
  capacity: 14230,
  opened: 1996,
  orientation: 315,
  dimensions: {
    leftField: 330,
    leftCenter: 375,
    centerField: 402,
    rightCenter: 375,
    rightField: 325
  },
  features: {
    downtownIndianapolisView: true,
    elementsFinancialClub: true,
    skylineDeck: true,
    captainMorganBar: true,
    knotHoleGang: true,
    lawn: true,
    outfieldTerrace: true,
    coveredSeating: 3800,
    bestAAABallpark: true
  }
};