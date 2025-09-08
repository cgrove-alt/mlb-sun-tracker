// FNB Field - Harrisburg Senators (Washington Nationals AA)
// Opened: 1987
// Capacity: 6,187
// Known for City Island location on Susquehanna River and state capitol views

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

export const harrisburgSenatorsSections: DetailedSection[] = [
  // ========== CAPITAL CLUB ==========
  {
    id: 'capital-club',
    name: 'Capital Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 21,
    rows: generateRows('A', 'G', 25, 16, 20),
    vertices3D: [
      { x: -31, y: 16, z: 48 },
      { x: 31, y: 16, z: 48 },
      { x: 36, y: 31, z: 63 },
      { x: -36, y: 31, z: 63 }
    ],
    covered: true,
    distance: 48,
    height: 16,
    rake: 20,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 0,
    angleSpan: 24,
    rows: generateRows('A', 'H', 15, 6, 15),
    vertices3D: [
      { x: -28, y: 6, z: 38 },
      { x: 28, y: 6, z: 38 },
      { x: 33, y: 18, z: 50 },
      { x: -33, y: 18, z: 50 }
    ],
    covered: false,
    distance: 38,
    height: 6,
    rake: 15,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-109',
    name: 'Field Box 109',
    level: 'field',
    baseAngle: 24,
    angleSpan: 26,
    rows: generateRows('A', 'H', 16, 6, 15),
    vertices3D: [
      { x: 28, y: 6, z: 38 },
      { x: 47, y: 6, z: 46 },
      { x: 52, y: 18, z: 58 },
      { x: 33, y: 18, z: 50 }
    ],
    covered: false,
    distance: 42,
    height: 6,
    rake: 15,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-110',
    name: 'Field Box 110',
    level: 'field',
    baseAngle: 336,
    angleSpan: 26,
    rows: generateRows('A', 'H', 16, 6, 15),
    vertices3D: [
      { x: -47, y: 6, z: 46 },
      { x: -28, y: 6, z: 38 },
      { x: -33, y: 18, z: 50 },
      { x: -52, y: 18, z: 58 }
    ],
    covered: false,
    distance: 42,
    height: 6,
    rake: 15,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-115',
    name: 'Field Box 115',
    level: 'field',
    baseAngle: 58,
    angleSpan: 27,
    rows: generateRows('A', 'H', 17, 6, 15),
    vertices3D: [
      { x: 56, y: 6, z: 70 },
      { x: 82, y: 6, z: 96 },
      { x: 87, y: 18, z: 108 },
      { x: 61, y: 18, z: 82 }
    ],
    covered: false,
    distance: 83,
    height: 6,
    rake: 15,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-123',
    name: 'Field Box 123',
    level: 'field',
    baseAngle: 302,
    angleSpan: 27,
    rows: generateRows('A', 'H', 17, 6, 15),
    vertices3D: [
      { x: -82, y: 6, z: 96 },
      { x: -56, y: 6, z: 70 },
      { x: -61, y: 18, z: 82 },
      { x: -87, y: 18, z: 108 }
    ],
    covered: false,
    distance: 83,
    height: 6,
    rake: 15,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-201',
    name: 'Reserved 201',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows(1, 12, 22, 18, 17),
    vertices3D: [
      { x: -24, y: 18, z: 53 },
      { x: 24, y: 18, z: 53 },
      { x: 29, y: 29, z: 64 },
      { x: -29, y: 29, z: 64 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['6', '7', '8', '9', '10', '11', '12'],
      coveragePercentage: 58
    },
    distance: 53,
    height: 18,
    rake: 17,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-209',
    name: 'Reserved 209',
    level: 'lower',
    baseAngle: 63,
    angleSpan: 29,
    rows: generateRows(1, 12, 20, 18, 17),
    vertices3D: [
      { x: 65, y: 18, z: 104 },
      { x: 91, y: 18, z: 130 },
      { x: 96, y: 29, z: 141 },
      { x: 70, y: 29, z: 115 }
    ],
    covered: false,
    distance: 117,
    height: 18,
    rake: 17,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-217',
    name: 'Reserved 217',
    level: 'lower',
    baseAngle: 297,
    angleSpan: 29,
    rows: generateRows(1, 12, 20, 18, 17),
    vertices3D: [
      { x: -91, y: 18, z: 130 },
      { x: -65, y: 18, z: 104 },
      { x: -70, y: 29, z: 115 },
      { x: -96, y: 29, z: 141 }
    ],
    covered: false,
    distance: 117,
    height: 18,
    rake: 17,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== RIVER DECK ==========
  {
    id: 'river-deck',
    name: 'River Deck',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 19,
    rows: [],
    vertices3D: [
      { x: 82, y: 6, z: 215 },
      { x: 104, y: 6, z: 237 },
      { x: 109, y: 12, z: 243 },
      { x: 87, y: 12, z: 221 }
    ],
    covered: true,
    distance: 226,
    height: 6,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD BERM ==========
  {
    id: 'left-field-berm',
    name: 'Left Field Berm',
    level: 'field',
    baseAngle: 215,
    angleSpan: 40,
    rows: [],
    vertices3D: [
      { x: -84, y: 5, z: 202 },
      { x: -61, y: 5, z: 225 },
      { x: -66, y: 10, z: 235 },
      { x: -89, y: 10, z: 212 }
    ],
    covered: false,
    distance: 213,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== CITY ISLAND OVERLOOK ==========
  {
    id: 'city-island-overlook',
    name: 'City Island Overlook',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: -28, y: 9, z: 298 },
      { x: 28, y: 9, z: 298 },
      { x: 33, y: 15, z: 308 },
      { x: -33, y: 15, z: 308 }
    ],
    covered: false,
    distance: 298,
    height: 9,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== PICNIC PLAZA ==========
  {
    id: 'picnic-plaza',
    name: 'Picnic Plaza',
    level: 'field',
    baseAngle: 42,
    angleSpan: 16,
    rows: generateRows(1, 3, 18, 6, 13),
    vertices3D: [
      { x: 105, y: 6, z: 222 },
      { x: 122, y: 6, z: 239 },
      { x: 127, y: 10, z: 243 },
      { x: 110, y: 10, z: 226 }
    ],
    covered: false,
    distance: 230,
    height: 6,
    rake: 13,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const harrisburgSenatorsConfig = {
  stadiumName: 'FNB Field',
  team: 'Harrisburg Senators',
  parentOrg: 'Washington Nationals',
  city: 'Harrisburg',
  state: 'PA',
  level: 'AA',
  capacity: 6187,
  opened: 1987,
  orientation: 315,
  dimensions: {
    leftField: 325,
    leftCenter: 365,
    centerField: 400,
    rightCenter: 365,
    rightField: 325
  },
  features: {
    cityIslandLocation: true,
    susquehannaRiverViews: true,
    stateCapitolViews: true,
    capitalClub: true,
    riverDeck: true,
    cityIslandOverlook: true,
    leftFieldBerm: true,
    picnicPlaza: true,
    coveredSeating: 1400
  }
};