// Delta Dental Stadium - New Hampshire Fisher Cats (Toronto Blue Jays AA)
// Opened: 2005
// Capacity: 6,500
// Known for Manchester skyline views and Northeast Delta Dental Tower

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

export const newHampshireFisherCatsSections: DetailedSection[] = [
  // ========== FISHER CAT CLUB ==========
  {
    id: 'fisher-cat-club',
    name: 'Fisher Cat Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 23,
    rows: generateRows('A', 'H', 27, 18, 22),
    vertices3D: [
      { x: -33, y: 18, z: 49 },
      { x: 33, y: 18, z: 49 },
      { x: 38, y: 35, z: 66 },
      { x: -38, y: 35, z: 66 }
    ],
    covered: true,
    distance: 49,
    height: 18,
    rake: 22,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== FIELD BOXES ==========
  {
    id: 'field-box-101',
    name: 'Field Box 101',
    level: 'field',
    baseAngle: 0,
    angleSpan: 22,
    rows: generateRows('A', 'I', 17, 5, 17),
    vertices3D: [
      { x: -26, y: 5, z: 39 },
      { x: 26, y: 5, z: 39 },
      { x: 31, y: 20, z: 54 },
      { x: -31, y: 20, z: 54 }
    ],
    covered: false,
    distance: 39,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    baseAngle: 22,
    angleSpan: 24,
    rows: generateRows('A', 'I', 18, 5, 17),
    vertices3D: [
      { x: 26, y: 5, z: 39 },
      { x: 45, y: 5, z: 47 },
      { x: 50, y: 20, z: 62 },
      { x: 31, y: 20, z: 54 }
    ],
    covered: false,
    distance: 43,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-109',
    name: 'Field Box 109',
    level: 'field',
    baseAngle: 338,
    angleSpan: 24,
    rows: generateRows('A', 'I', 18, 5, 17),
    vertices3D: [
      { x: -45, y: 5, z: 47 },
      { x: -26, y: 5, z: 39 },
      { x: -31, y: 20, z: 54 },
      { x: -50, y: 20, z: 62 }
    ],
    covered: false,
    distance: 43,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-114',
    name: 'Field Box 114',
    level: 'field',
    baseAngle: 55,
    angleSpan: 25,
    rows: generateRows('A', 'I', 19, 5, 17),
    vertices3D: [
      { x: 54, y: 5, z: 71 },
      { x: 80, y: 5, z: 97 },
      { x: 85, y: 20, z: 112 },
      { x: 59, y: 20, z: 86 }
    ],
    covered: false,
    distance: 84,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-122',
    name: 'Field Box 122',
    level: 'field',
    baseAngle: 305,
    angleSpan: 25,
    rows: generateRows('A', 'I', 19, 5, 17),
    vertices3D: [
      { x: -80, y: 5, z: 97 },
      { x: -54, y: 5, z: 71 },
      { x: -59, y: 20, z: 86 },
      { x: -85, y: 20, z: 112 }
    ],
    covered: false,
    distance: 84,
    height: 5,
    rake: 17,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== RESERVED SEATING ==========
  {
    id: 'reserved-201',
    name: 'Reserved 201',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 28,
    rows: generateRows(1, 13, 23, 17, 19),
    vertices3D: [
      { x: -26, y: 17, z: 54 },
      { x: 26, y: 17, z: 54 },
      { x: 31, y: 31, z: 68 },
      { x: -31, y: 31, z: 68 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['7', '8', '9', '10', '11', '12', '13'],
      coveragePercentage: 54
    },
    distance: 54,
    height: 17,
    rake: 19,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-208',
    name: 'Reserved 208',
    level: 'lower',
    baseAngle: 60,
    angleSpan: 27,
    rows: generateRows(1, 13, 21, 17, 19),
    vertices3D: [
      { x: 63, y: 17, z: 105 },
      { x: 89, y: 17, z: 131 },
      { x: 94, y: 31, z: 145 },
      { x: 68, y: 31, z: 119 }
    ],
    covered: false,
    distance: 118,
    height: 17,
    rake: 19,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-216',
    name: 'Reserved 216',
    level: 'lower',
    baseAngle: 300,
    angleSpan: 27,
    rows: generateRows(1, 13, 21, 17, 19),
    vertices3D: [
      { x: -89, y: 17, z: 131 },
      { x: -63, y: 17, z: 105 },
      { x: -68, y: 31, z: 119 },
      { x: -94, y: 31, z: 145 }
    ],
    covered: false,
    distance: 118,
    height: 17,
    rake: 19,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== DELTA DECK ==========
  {
    id: 'delta-deck',
    name: 'Delta Deck',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 21,
    rows: [],
    vertices3D: [
      { x: 87, y: 8, z: 225 },
      { x: 111, y: 8, z: 249 },
      { x: 116, y: 14, z: 255 },
      { x: 92, y: 14, z: 231 }
    ],
    covered: true,
    distance: 237,
    height: 8,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== LEFT FIELD HILL ==========
  {
    id: 'left-field-hill',
    name: 'Left Field Hill',
    level: 'field',
    baseAngle: 223,
    angleSpan: 37,
    rows: [],
    vertices3D: [
      { x: -91, y: 5, z: 212 },
      { x: -68, y: 5, z: 235 },
      { x: -73, y: 10, z: 245 },
      { x: -96, y: 10, z: 222 }
    ],
    covered: false,
    distance: 223,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== MANCHESTER VIEW ==========
  {
    id: 'manchester-view',
    name: 'Manchester View',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 22,
    rows: [],
    vertices3D: [
      { x: -31, y: 10, z: 308 },
      { x: 31, y: 10, z: 308 },
      { x: 36, y: 16, z: 318 },
      { x: -36, y: 16, z: 318 }
    ],
    covered: false,
    distance: 308,
    height: 10,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== PICNIC PAVILION ==========
  {
    id: 'picnic-pavilion',
    name: 'Picnic Pavilion',
    level: 'field',
    baseAngle: 46,
    angleSpan: 17,
    rows: generateRows(1, 4, 20, 6, 14),
    vertices3D: [
      { x: 113, y: 6, z: 232 },
      { x: 131, y: 6, z: 250 },
      { x: 136, y: 12, z: 256 },
      { x: 118, y: 12, z: 238 }
    ],
    covered: false,
    distance: 241,
    height: 6,
    rake: 14,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const newHampshireFisherCatsConfig = {
  stadiumName: 'Delta Dental Stadium',
  team: 'New Hampshire Fisher Cats',
  parentOrg: 'Toronto Blue Jays',
  city: 'Manchester',
  state: 'NH',
  level: 'AA',
  capacity: 6500,
  opened: 2005,
  orientation: 355,
  dimensions: {
    leftField: 306,
    leftCenter: 365,
    centerField: 396,
    rightCenter: 365,
    rightField: 325
  },
  features: {
    manchesterSkylineView: true,
    deltaDentalTower: true,
    fisherCatClub: true,
    deltaDeck: true,
    manchesterView: true,
    leftFieldHill: true,
    picnicPavilion: true,
    coveredSeating: 1650
  }
};