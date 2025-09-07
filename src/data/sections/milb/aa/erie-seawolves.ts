// UPMC Park - Erie SeaWolves (Detroit Tigers AA)
// Opened: 1995
// Capacity: 6,000
// Known for Lake Erie views and downtown Erie location

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

export const erieSeaWolvesSections: DetailedSection[] = [
  // ========== WOLVES DEN CLUB ==========
  {
    id: 'wolves-den-club',
    name: 'Wolves Den Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 22,
    rows: generateRows('A', 'G', 26, 17, 21),
    vertices3D: [
      { x: -32, y: 17, z: 49 },
      { x: 32, y: 17, z: 49 },
      { x: 37, y: 33, z: 65 },
      { x: -37, y: 33, z: 65 }
    ],
    covered: true,
    distance: 49,
    height: 17,
    rake: 21,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 23,
    rows: generateRows('A', 'I', 16, 5, 16),
    vertices3D: [
      { x: -27, y: 5, z: 39 },
      { x: 27, y: 5, z: 39 },
      { x: 32, y: 19, z: 53 },
      { x: -32, y: 19, z: 53 }
    ],
    covered: false,
    distance: 39,
    height: 5,
    rake: 16,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-107',
    name: 'Field Box 107',
    level: 'field',
    baseAngle: 23,
    angleSpan: 25,
    rows: generateRows('A', 'I', 17, 5, 16),
    vertices3D: [
      { x: 27, y: 5, z: 39 },
      { x: 46, y: 5, z: 47 },
      { x: 51, y: 19, z: 61 },
      { x: 32, y: 19, z: 53 }
    ],
    covered: false,
    distance: 43,
    height: 5,
    rake: 16,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 337,
    angleSpan: 25,
    rows: generateRows('A', 'I', 17, 5, 16),
    vertices3D: [
      { x: -46, y: 5, z: 47 },
      { x: -27, y: 5, z: 39 },
      { x: -32, y: 19, z: 53 },
      { x: -51, y: 19, z: 61 }
    ],
    covered: false,
    distance: 43,
    height: 5,
    rake: 16,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-113',
    name: 'Field Box 113',
    level: 'field',
    baseAngle: 56,
    angleSpan: 26,
    rows: generateRows('A', 'I', 18, 5, 16),
    vertices3D: [
      { x: 55, y: 5, z: 71 },
      { x: 81, y: 5, z: 97 },
      { x: 86, y: 19, z: 111 },
      { x: 60, y: 19, z: 85 }
    ],
    covered: false,
    distance: 84,
    height: 5,
    rake: 16,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-121',
    name: 'Field Box 121',
    level: 'field',
    baseAngle: 304,
    angleSpan: 26,
    rows: generateRows('A', 'I', 18, 5, 16),
    vertices3D: [
      { x: -81, y: 5, z: 97 },
      { x: -55, y: 5, z: 71 },
      { x: -60, y: 19, z: 85 },
      { x: -86, y: 19, z: 111 }
    ],
    covered: false,
    distance: 84,
    height: 5,
    rake: 16,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 29,
    rows: generateRows(1, 13, 23, 17, 18),
    vertices3D: [
      { x: -25, y: 17, z: 54 },
      { x: 25, y: 17, z: 54 },
      { x: 30, y: 30, z: 67 },
      { x: -30, y: 30, z: 67 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['7', '8', '9', '10', '11', '12', '13'],
      coveragePercentage: 54
    },
    distance: 54,
    height: 17,
    rake: 18,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-207',
    name: 'Reserved 207',
    level: 'lower',
    baseAngle: 61,
    angleSpan: 28,
    rows: generateRows(1, 13, 21, 17, 18),
    vertices3D: [
      { x: 64, y: 17, z: 105 },
      { x: 90, y: 17, z: 131 },
      { x: 95, y: 30, z: 144 },
      { x: 69, y: 30, z: 118 }
    ],
    covered: false,
    distance: 118,
    height: 17,
    rake: 18,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-215',
    name: 'Reserved 215',
    level: 'lower',
    baseAngle: 299,
    angleSpan: 28,
    rows: generateRows(1, 13, 21, 17, 18),
    vertices3D: [
      { x: -90, y: 17, z: 131 },
      { x: -64, y: 17, z: 105 },
      { x: -69, y: 30, z: 118 },
      { x: -95, y: 30, z: 144 }
    ],
    covered: false,
    distance: 118,
    height: 17,
    rake: 18,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== LAKE ERIE DECK ==========
  {
    id: 'lake-erie-deck',
    name: 'Lake Erie Deck',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 20,
    rows: [],
    vertices3D: [
      { x: 85, y: 7, z: 220 },
      { x: 108, y: 7, z: 243 },
      { x: 113, y: 13, z: 249 },
      { x: 90, y: 13, z: 226 }
    ],
    covered: true,
    distance: 231,
    height: 7,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD PICNIC ==========
  {
    id: 'left-field-picnic',
    name: 'Left Field Picnic',
    level: 'field',
    baseAngle: 220,
    angleSpan: 38,
    rows: [],
    vertices3D: [
      { x: -88, y: 5, z: 208 },
      { x: -65, y: 5, z: 231 },
      { x: -70, y: 10, z: 241 },
      { x: -93, y: 10, z: 218 }
    ],
    covered: false,
    distance: 219,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PEPSI PORCH ==========
  {
    id: 'pepsi-porch',
    name: 'Pepsi Porch',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 21,
    rows: [],
    vertices3D: [
      { x: -30, y: 10, z: 305 },
      { x: 30, y: 10, z: 305 },
      { x: 35, y: 16, z: 315 },
      { x: -35, y: 16, z: 315 }
    ],
    covered: false,
    distance: 305,
    height: 10,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== FAMILY FUN ZONE ==========
  {
    id: 'family-fun-zone',
    name: 'Family Fun Zone',
    level: 'field',
    baseAngle: 45,
    angleSpan: 17,
    rows: generateRows(1, 4, 19, 6, 14),
    vertices3D: [
      { x: 110, y: 6, z: 228 },
      { x: 128, y: 6, z: 246 },
      { x: 133, y: 12, z: 252 },
      { x: 115, y: 12, z: 234 }
    ],
    covered: false,
    distance: 237,
    height: 6,
    rake: 14,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const erieSeaWolvesConfig = {
  stadiumName: 'UPMC Park',
  team: 'Erie SeaWolves',
  parentOrg: 'Detroit Tigers',
  city: 'Erie',
  state: 'PA',
  level: 'AA',
  capacity: 6000,
  opened: 1995,
  orientation: 330,
  dimensions: {
    leftField: 317,
    leftCenter: 365,
    centerField: 400,
    rightCenter: 365,
    rightField: 320
  },
  features: {
    lakeErieViews: true,
    downtownErieLocation: true,
    wolvesDenClub: true,
    lakeErieDeck: true,
    pepsiPorch: true,
    leftFieldPicnic: true,
    familyFunZone: true,
    coveredSeating: 1500
  }
};