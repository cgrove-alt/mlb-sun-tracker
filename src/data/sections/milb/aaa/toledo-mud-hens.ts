// Fifth Third Field - Toledo Mud Hens (Detroit Tigers AAA)
// Opened: 2002
// Capacity: 10,300
// Known for downtown Toledo skyline and warehouse district location

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

export const toledoMudHensSections: DetailedSection[] = [
  // ========== ROOST CLUB ==========
  {
    id: 'roost-club',
    name: 'Roost Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'L', 36, 24, 27),
    vertices3D: [
      { x: -44, y: 24, z: 57 },
      { x: 44, y: 24, z: 57 },
      { x: 49, y: 52, z: 85 },
      { x: -49, y: 52, z: 85 }
    ],
    covered: true,
    distance: 57,
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
    angleSpan: 16,
    rows: generateRows('A', 'N', 23, 3, 22),
    vertices3D: [
      { x: -20, y: 3, z: 46 },
      { x: 20, y: 3, z: 46 },
      { x: 25, y: 31, z: 74 },
      { x: -25, y: 31, z: 74 }
    ],
    covered: false,
    distance: 46,
    height: 3,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 16,
    angleSpan: 21,
    rows: generateRows('A', 'N', 24, 3, 22),
    vertices3D: [
      { x: 20, y: 3, z: 46 },
      { x: 40, y: 3, z: 55 },
      { x: 45, y: 31, z: 83 },
      { x: 25, y: 31, z: 74 }
    ],
    covered: false,
    distance: 50,
    height: 3,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-102',
    name: 'Field Box 102',
    level: 'field',
    baseAngle: 344,
    angleSpan: 21,
    rows: generateRows('A', 'N', 24, 3, 22),
    vertices3D: [
      { x: -40, y: 3, z: 55 },
      { x: -20, y: 3, z: 46 },
      { x: -25, y: 31, z: 74 },
      { x: -45, y: 31, z: 83 }
    ],
    covered: false,
    distance: 50,
    height: 3,
    rake: 22,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-106',
    name: 'Field Box 106',
    level: 'field',
    baseAngle: 43,
    angleSpan: 24,
    rows: generateRows('A', 'N', 25, 3, 22),
    vertices3D: [
      { x: 49, y: 3, z: 78 },
      { x: 79, y: 3, z: 108 },
      { x: 84, y: 31, z: 136 },
      { x: 54, y: 31, z: 106 }
    ],
    covered: false,
    distance: 93,
    height: 3,
    rake: 22,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-114',
    name: 'Field Box 114',
    level: 'field',
    baseAngle: 317,
    angleSpan: 24,
    rows: generateRows('A', 'N', 25, 3, 22),
    vertices3D: [
      { x: -79, y: 3, z: 108 },
      { x: -49, y: 3, z: 78 },
      { x: -54, y: 31, z: 106 },
      { x: -84, y: 31, z: 136 }
    ],
    covered: false,
    distance: 93,
    height: 3,
    rake: 22,
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
    rows: generateRows(1, 24, 31, 11, 24),
    vertices3D: [
      { x: -33, y: 11, z: 65 },
      { x: 33, y: 11, z: 65 },
      { x: 38, y: 49, z: 103 },
      { x: -38, y: 49, z: 103 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
      coveragePercentage: 42
    },
    distance: 65,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-206',
    name: 'Reserved 206',
    level: 'lower',
    baseAngle: 47,
    angleSpan: 25,
    rows: generateRows(1, 24, 29, 11, 24),
    vertices3D: [
      { x: 68, y: 11, z: 117 },
      { x: 98, y: 11, z: 147 },
      { x: 103, y: 49, z: 185 },
      { x: 73, y: 49, z: 155 }
    ],
    covered: false,
    distance: 132,
    height: 11,
    rake: 24,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-214',
    name: 'Reserved 214',
    level: 'lower',
    baseAngle: 313,
    angleSpan: 25,
    rows: generateRows(1, 24, 29, 11, 24),
    vertices3D: [
      { x: -98, y: 11, z: 147 },
      { x: -68, y: 11, z: 117 },
      { x: -73, y: 49, z: 155 },
      { x: -103, y: 49, z: 185 }
    ],
    covered: false,
    distance: 132,
    height: 11,
    rake: 24,
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
      { rowNumber: 'Suite', seats: 330, elevation: 32, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -72, y: 32, z: 83 },
      { x: 72, y: 32, z: 83 },
      { x: 77, y: 42, z: 93 },
      { x: -77, y: 42, z: 93 }
    ],
    covered: true,
    distance: 83,
    height: 32,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== HOLY TOLEDO TAVERN ==========
  {
    id: 'holy-toledo-tavern',
    name: 'Holy Toledo Tavern',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 28,
    rows: [],
    vertices3D: [
      { x: 115, y: 14, z: 282 },
      { x: 149, y: 14, z: 316 },
      { x: 154, y: 20, z: 322 },
      { x: 120, y: 20, z: 288 }
    ],
    covered: true,
    distance: 299,
    height: 14,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== FLEETWOOD'S TAP ROOM ==========
  {
    id: 'fleetwoods-tap-room',
    name: "Fleetwood's Tap Room",
    level: 'upper',
    baseAngle: 126,
    angleSpan: 31,
    rows: generateRows(1, 8, 45, 33, 22),
    vertices3D: [
      { x: 100, y: 33, z: 330 },
      { x: 139, y: 33, z: 369 },
      { x: 144, y: 49, z: 385 },
      { x: 105, y: 49, z: 346 }
    ],
    covered: false,
    distance: 349,
    height: 33,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== LEFT FIELD PAVILION ==========
  {
    id: 'left-field-pavilion',
    name: 'Left Field Pavilion',
    level: 'field',
    baseAngle: 248,
    angleSpan: 26,
    rows: generateRows(1, 17, 35, 6, 20),
    vertices3D: [
      { x: -125, y: 6, z: 266 },
      { x: -101, y: 6, z: 290 },
      { x: -106, y: 30, z: 314 },
      { x: -130, y: 30, z: 290 }
    ],
    covered: false,
    distance: 278,
    height: 6,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== WAREHOUSE DISTRICT DECK ==========
  {
    id: 'warehouse-deck',
    name: 'Warehouse District Deck',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 29,
    rows: [],
    vertices3D: [
      { x: -44, y: 17, z: 390 },
      { x: 44, y: 17, z: 390 },
      { x: 49, y: 23, z: 400 },
      { x: -49, y: 23, z: 400 }
    ],
    covered: false,
    distance: 390,
    height: 17,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== MILLER LITE LANDING ==========
  {
    id: 'miller-lite-landing',
    name: 'Miller Lite Landing',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 22,
    rows: [],
    vertices3D: [
      { x: -162, y: 13, z: 308 },
      { x: -138, y: 13, z: 332 },
      { x: -143, y: 19, z: 338 },
      { x: -167, y: 19, z: 314 }
    ],
    covered: false,
    distance: 320,
    height: 13,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== FAMILY FUN ZONE ==========
  {
    id: 'family-fun-zone',
    name: 'Family Fun Zone',
    level: 'field',
    baseAngle: 58,
    angleSpan: 25,
    rows: generateRows(1, 14, 32, 7, 19),
    vertices3D: [
      { x: 150, y: 7, z: 278 },
      { x: 175, y: 7, z: 303 },
      { x: 180, y: 26, z: 322 },
      { x: 155, y: 26, z: 297 }
    ],
    covered: false,
    distance: 290,
    height: 7,
    rake: 19,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const toledoMudHensConfig = {
  stadiumName: 'Fifth Third Field',
  team: 'Toledo Mud Hens',
  parentOrg: 'Detroit Tigers',
  city: 'Toledo',
  state: 'OH',
  level: 'AAA',
  capacity: 10300,
  opened: 2002,
  orientation: 90,
  dimensions: {
    leftField: 320,
    leftCenter: 368,
    centerField: 408,
    rightCenter: 368,
    rightField: 325
  },
  features: {
    downtownToledoSkyline: true,
    warehouseDistrictLocation: true,
    roostClub: true,
    holyToledoTavern: true,
    fleetwoodsTapRoom: true,
    warehouseDistrictDeck: true,
    millerLiteLanding: true,
    familyFunZone: true,
    coveredSeating: 3200
  }
};