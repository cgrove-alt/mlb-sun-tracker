// Dunkin' Park - Hartford Yard Goats (Colorado Rockies AA)
// Opened: 2017
// Capacity: 6,121
// Known for downtown Hartford skyline and modern amenities

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

export const hartfordYardGoatsSections: DetailedSection[] = [
  // ========== GOAT CLUB ==========
  {
    id: 'goat-club',
    name: 'Goat Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 24,
    rows: generateRows('A', 'H', 28, 19, 23),
    vertices3D: [
      { x: -34, y: 19, z: 50 },
      { x: 34, y: 19, z: 50 },
      { x: 39, y: 37, z: 68 },
      { x: -39, y: 37, z: 68 }
    ],
    covered: true,
    distance: 50,
    height: 19,
    rake: 23,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 21,
    rows: generateRows('A', 'J', 18, 5, 18),
    vertices3D: [
      { x: -25, y: 5, z: 40 },
      { x: 25, y: 5, z: 40 },
      { x: 30, y: 22, z: 57 },
      { x: -30, y: 22, z: 57 }
    ],
    covered: false,
    distance: 40,
    height: 5,
    rake: 18,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-106',
    name: 'Field Box 106',
    level: 'field',
    baseAngle: 21,
    angleSpan: 23,
    rows: generateRows('A', 'J', 19, 5, 18),
    vertices3D: [
      { x: 25, y: 5, z: 40 },
      { x: 44, y: 5, z: 48 },
      { x: 49, y: 22, z: 65 },
      { x: 30, y: 22, z: 57 }
    ],
    covered: false,
    distance: 44,
    height: 5,
    rake: 18,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-107',
    name: 'Field Box 107',
    level: 'field',
    baseAngle: 339,
    angleSpan: 23,
    rows: generateRows('A', 'J', 19, 5, 18),
    vertices3D: [
      { x: -44, y: 5, z: 48 },
      { x: -25, y: 5, z: 40 },
      { x: -30, y: 22, z: 57 },
      { x: -49, y: 22, z: 65 }
    ],
    covered: false,
    distance: 44,
    height: 5,
    rake: 18,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 53,
    angleSpan: 24,
    rows: generateRows('A', 'J', 20, 5, 18),
    vertices3D: [
      { x: 53, y: 5, z: 72 },
      { x: 79, y: 5, z: 98 },
      { x: 84, y: 22, z: 115 },
      { x: 58, y: 22, z: 89 }
    ],
    covered: false,
    distance: 85,
    height: 5,
    rake: 18,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-120',
    name: 'Field Box 120',
    level: 'field',
    baseAngle: 307,
    angleSpan: 24,
    rows: generateRows('A', 'J', 20, 5, 18),
    vertices3D: [
      { x: -79, y: 5, z: 98 },
      { x: -53, y: 5, z: 72 },
      { x: -58, y: 22, z: 89 },
      { x: -84, y: 22, z: 115 }
    ],
    covered: false,
    distance: 85,
    height: 5,
    rake: 18,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-200',
    name: 'Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 27,
    rows: generateRows(1, 14, 24, 16, 20),
    vertices3D: [
      { x: -27, y: 16, z: 55 },
      { x: 27, y: 16, z: 55 },
      { x: 32, y: 33, z: 72 },
      { x: -32, y: 33, z: 72 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['8', '9', '10', '11', '12', '13', '14'],
      coveragePercentage: 50
    },
    distance: 55,
    height: 16,
    rake: 20,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-206',
    name: 'Reserved 206',
    level: 'lower',
    baseAngle: 58,
    angleSpan: 26,
    rows: generateRows(1, 14, 22, 16, 20),
    vertices3D: [
      { x: 62, y: 16, z: 106 },
      { x: 88, y: 16, z: 132 },
      { x: 93, y: 33, z: 149 },
      { x: 67, y: 33, z: 123 }
    ],
    covered: false,
    distance: 119,
    height: 16,
    rake: 20,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-214',
    name: 'Reserved 214',
    level: 'lower',
    baseAngle: 302,
    angleSpan: 26,
    rows: generateRows(1, 14, 22, 16, 20),
    vertices3D: [
      { x: -88, y: 16, z: 132 },
      { x: -62, y: 16, z: 106 },
      { x: -67, y: 33, z: 123 },
      { x: -93, y: 33, z: 149 }
    ],
    covered: false,
    distance: 119,
    height: 16,
    rake: 20,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== HARTFORD OVERLOOK ==========
  {
    id: 'hartford-overlook',
    name: 'Hartford Overlook',
    level: 'upper',
    baseAngle: 95,
    angleSpan: 25,
    rows: generateRows(1, 5, 34, 25, 19),
    vertices3D: [
      { x: 76, y: 25, z: 260 },
      { x: 106, y: 25, z: 290 },
      { x: 111, y: 35, z: 300 },
      { x: 81, y: 35, z: 270 }
    ],
    covered: false,
    distance: 275,
    height: 25,
    rake: 19,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== BILLY GOAT BAR ==========
  {
    id: 'billy-goat-bar',
    name: 'Billy Goat Bar',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 22,
    rows: [],
    vertices3D: [
      { x: 90, y: 9, z: 230 },
      { x: 115, y: 9, z: 255 },
      { x: 120, y: 15, z: 261 },
      { x: 95, y: 15, z: 236 }
    ],
    covered: true,
    distance: 242,
    height: 9,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD LAWN ==========
  {
    id: 'left-field-lawn',
    name: 'Left Field Lawn',
    level: 'field',
    baseAngle: 228,
    angleSpan: 35,
    rows: [],
    vertices3D: [
      { x: -95, y: 5, z: 218 },
      { x: -72, y: 5, z: 241 },
      { x: -77, y: 10, z: 251 },
      { x: -100, y: 10, z: 228 }
    ],
    covered: false,
    distance: 229,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== KIDS ZONE ==========
  {
    id: 'kids-zone',
    name: 'Kids Zone',
    level: 'field',
    baseAngle: 48,
    angleSpan: 18,
    rows: generateRows(1, 5, 21, 7, 15),
    vertices3D: [
      { x: 118, y: 7, z: 238 },
      { x: 136, y: 7, z: 256 },
      { x: 141, y: 15, z: 264 },
      { x: 123, y: 15, z: 246 }
    ],
    covered: false,
    distance: 247,
    height: 7,
    rake: 15,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const hartfordYardGoatsConfig = {
  stadiumName: "Dunkin' Park",
  team: 'Hartford Yard Goats',
  parentOrg: 'Colorado Rockies',
  city: 'Hartford',
  state: 'CT',
  level: 'AA',
  capacity: 6121,
  opened: 2017,
  orientation: 25,
  dimensions: {
    leftField: 325,
    leftCenter: 363,
    centerField: 400,
    rightCenter: 363,
    rightField: 315
  },
  features: {
    downtownHartfordSkyline: true,
    modernAmenities: true,
    goatClub: true,
    hartfordOverlook: true,
    billyGoatBar: true,
    leftFieldLawn: true,
    kidsZone: true,
    coveredSeating: 1700
  }
};