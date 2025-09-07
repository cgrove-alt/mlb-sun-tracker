// AutoZone Park - Memphis Redbirds (St. Louis Cardinals AAA)
// Opened: 2000
// Capacity: 10,000
// Known for downtown Memphis skyline and Beale Street proximity

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

export const memphisRedbirdsSections: DetailedSection[] = [
  // ========== REDBIRDS CLUB ==========
  {
    id: 'redbirds-club',
    name: 'Redbirds Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 29,
    rows: generateRows('A', 'K', 37, 25, 27),
    vertices3D: [
      { x: -45, y: 25, z: 59 },
      { x: 45, y: 25, z: 59 },
      { x: 50, y: 52, z: 86 },
      { x: -50, y: 52, z: 86 }
    ],
    covered: true,
    distance: 59,
    height: 25,
    rake: 27,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== DUGOUT BOXES ==========
  {
    id: 'dugout-box-home',
    name: 'Home Dugout Box',
    level: 'field',
    baseAngle: 340,
    angleSpan: 20,
    rows: generateRows('A', 'H', 20, 2, 21),
    vertices3D: [
      { x: -35, y: 2, z: 45 },
      { x: -15, y: 2, z: 45 },
      { x: -10, y: 20, z: 63 },
      { x: -30, y: 20, z: 63 }
    ],
    covered: false,
    distance: 45,
    height: 2,
    rake: 21,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  {
    id: 'dugout-box-visitor',
    name: 'Visitor Dugout Box',
    level: 'field',
    baseAngle: 20,
    angleSpan: 20,
    rows: generateRows('A', 'H', 20, 2, 21),
    vertices3D: [
      { x: 15, y: 2, z: 45 },
      { x: 35, y: 2, z: 45 },
      { x: 30, y: 20, z: 63 },
      { x: 10, y: 20, z: 63 }
    ],
    covered: false,
    distance: 45,
    height: 2,
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
    angleSpan: 18,
    rows: generateRows('A', 'O', 24, 4, 23),
    vertices3D: [
      { x: -22, y: 4, z: 48 },
      { x: 22, y: 4, z: 48 },
      { x: 27, y: 34, z: 78 },
      { x: -27, y: 34, z: 78 }
    ],
    covered: false,
    distance: 48,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-107',
    name: 'Field Box 107',
    level: 'field',
    baseAngle: 44,
    angleSpan: 24,
    rows: generateRows('A', 'O', 26, 4, 23),
    vertices3D: [
      { x: 50, y: 4, z: 81 },
      { x: 81, y: 4, z: 112 },
      { x: 86, y: 34, z: 142 },
      { x: 55, y: 34, z: 111 }
    ],
    covered: false,
    distance: 96,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-115',
    name: 'Field Box 115',
    level: 'field',
    baseAngle: 316,
    angleSpan: 24,
    rows: generateRows('A', 'O', 26, 4, 23),
    vertices3D: [
      { x: -81, y: 4, z: 112 },
      { x: -50, y: 4, z: 81 },
      { x: -55, y: 34, z: 111 },
      { x: -86, y: 34, z: 142 }
    ],
    covered: false,
    distance: 96,
    height: 4,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== PLAZA LEVEL ==========
  {
    id: 'plaza-200',
    name: 'Plaza 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 22,
    rows: generateRows(1, 25, 32, 11, 25),
    vertices3D: [
      { x: -34, y: 11, z: 67 },
      { x: 34, y: 11, z: 67 },
      { x: 39, y: 51, z: 107 },
      { x: -39, y: 51, z: 107 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
      coveragePercentage: 40
    },
    distance: 67,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'plaza-207',
    name: 'Plaza 207',
    level: 'lower',
    baseAngle: 50,
    angleSpan: 26,
    rows: generateRows(1, 25, 30, 11, 25),
    vertices3D: [
      { x: 70, y: 11, z: 120 },
      { x: 101, y: 11, z: 151 },
      { x: 106, y: 51, z: 191 },
      { x: 75, y: 51, z: 160 }
    ],
    covered: false,
    distance: 135,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'plaza-215',
    name: 'Plaza 215',
    level: 'lower',
    baseAngle: 310,
    angleSpan: 26,
    rows: generateRows(1, 25, 30, 11, 25),
    vertices3D: [
      { x: -101, y: 11, z: 151 },
      { x: -70, y: 11, z: 120 },
      { x: -75, y: 51, z: 160 },
      { x: -106, y: 51, z: 191 }
    ],
    covered: false,
    distance: 135,
    height: 11,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITES ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 57,
    rows: [
      { rowNumber: 'Suite', seats: 330, elevation: 33, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -74, y: 33, z: 85 },
      { x: 74, y: 33, z: 85 },
      { x: 79, y: 43, z: 95 },
      { x: -79, y: 43, z: 95 }
    ],
    covered: true,
    distance: 85,
    height: 33,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== BLUFF ==========
  {
    id: 'bluff',
    name: 'Bluff',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows(1, 16, 44, 9, 21),
    vertices3D: [
      { x: 115, y: 9, z: 280 },
      { x: 150, y: 9, z: 315 },
      { x: 155, y: 33, z: 339 },
      { x: 120, y: 33, z: 304 }
    ],
    covered: false,
    distance: 297,
    height: 9,
    rake: 21,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== TOYOTA TERRACE ==========
  {
    id: 'toyota-terrace',
    name: 'Toyota Terrace',
    level: 'upper',
    baseAngle: 130,
    angleSpan: 32,
    rows: generateRows(1, 9, 48, 35, 23),
    vertices3D: [
      { x: 102, y: 35, z: 332 },
      { x: 142, y: 35, z: 372 },
      { x: 147, y: 51, z: 388 },
      { x: 107, y: 51, z: 348 }
    ],
    covered: false,
    distance: 352,
    height: 35,
    rake: 23,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== BEALE STREET LANDING ==========
  {
    id: 'beale-street-landing',
    name: 'Beale Street Landing',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 30,
    rows: [],
    vertices3D: [
      { x: -45, y: 18, z: 390 },
      { x: 45, y: 18, z: 390 },
      { x: 50, y: 24, z: 400 },
      { x: -50, y: 24, z: 400 }
    ],
    covered: false,
    distance: 390,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== HOME RUN PORCH ==========
  {
    id: 'home-run-porch',
    name: 'Home Run Porch',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 24,
    rows: [],
    vertices3D: [
      { x: -165, y: 14, z: 308 },
      { x: -140, y: 14, z: 333 },
      { x: -145, y: 20, z: 339 },
      { x: -170, y: 20, z: 314 }
    ],
    covered: true,
    distance: 320,
    height: 14,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== FedEx FAMILY FUN ZONE ==========
  {
    id: 'fedex-family-fun-zone',
    name: 'FedEx Family Fun Zone',
    level: 'field',
    baseAngle: 60,
    angleSpan: 25,
    rows: generateRows(1, 14, 35, 6, 20),
    vertices3D: [
      { x: 155, y: 6, z: 285 },
      { x: 180, y: 6, z: 310 },
      { x: 185, y: 28, z: 332 },
      { x: 160, y: 28, z: 307 }
    ],
    covered: false,
    distance: 297,
    height: 6,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const memphisRedbirdsConfig = {
  stadiumName: 'AutoZone Park',
  team: 'Memphis Redbirds',
  parentOrg: 'St. Louis Cardinals',
  city: 'Memphis',
  state: 'TN',
  level: 'AAA',
  capacity: 10000,
  opened: 2000,
  orientation: 340,
  dimensions: {
    leftField: 319,
    leftCenter: 360,
    centerField: 400,
    rightCenter: 373,
    rightField: 322
  },
  features: {
    redbirdsClub: true,
    dugoutBoxes: true,
    bluff: true,
    toyotaTerrace: true,
    bealeStreetLanding: true,
    homeRunPorch: true,
    fedexFamilyFunZone: true,
    downtownMemphisView: true,
    bealeStreetProximity: true,
    coveredSeating: 3200
  }
};