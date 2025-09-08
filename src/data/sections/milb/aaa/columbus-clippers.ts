// Huntington Park - Columbus Clippers (Cleveland Guardians AAA)
// Opened: 2009
// Capacity: 10,100
// Known for downtown Columbus views and the AEP Power Pavilion

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

export const columbusClippersSections: DetailedSection[] = [
  // ========== CLUB SEATS (Behind Home) ==========
  {
    id: 'club-seats-home',
    name: 'Club Seats Home',
    level: 'club',
    baseAngle: 0,
    angleSpan: 25,
    rows: generateRows('A', 'L', 35, 22, 26),
    vertices3D: [
      { x: -40, y: 22, z: 55 },
      { x: 40, y: 22, z: 55 },
      { x: 45, y: 50, z: 83 },
      { x: -45, y: 50, z: 83 }
    ],
    covered: true,
    distance: 55,
    height: 22,
    rake: 26,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== AEP POWER PAVILION ==========
  {
    id: 'aep-power-pavilion',
    name: 'AEP Power Pavilion',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows(1, 12, 55, 12, 22),
    vertices3D: [
      { x: 110, y: 12, z: 270 },
      { x: 140, y: 12, z: 300 },
      { x: 145, y: 36, z: 324 },
      { x: 115, y: 36, z: 294 }
    ],
    covered: true,
    distance: 285,
    height: 12,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== FIELD LEVEL BOXES ==========
  {
    id: 'field-box-100',
    name: 'Field Box 100',
    level: 'field',
    baseAngle: 0,
    angleSpan: 20,
    rows: generateRows('A', 'R', 25, 3, 23),
    vertices3D: [
      { x: -25, y: 3, z: 45 },
      { x: 25, y: 3, z: 45 },
      { x: 30, y: 38, z: 80 },
      { x: -30, y: 38, z: 80 }
    ],
    covered: false,
    distance: 45,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 45,
    angleSpan: 25,
    rows: generateRows('A', 'R', 26, 3, 23),
    vertices3D: [
      { x: 45, y: 3, z: 75 },
      { x: 80, y: 3, z: 110 },
      { x: 85, y: 38, z: 145 },
      { x: 50, y: 38, z: 110 }
    ],
    covered: false,
    distance: 92,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-114',
    name: 'Field Box 114',
    level: 'field',
    baseAngle: 315,
    angleSpan: 25,
    rows: generateRows('A', 'R', 26, 3, 23),
    vertices3D: [
      { x: -80, y: 3, z: 110 },
      { x: -45, y: 3, z: 75 },
      { x: -50, y: 38, z: 110 },
      { x: -85, y: 38, z: 145 }
    ],
    covered: false,
    distance: 92,
    height: 3,
    rake: 23,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  // ========== PLAZA RESERVED ==========
  {
    id: 'plaza-reserved-200',
    name: 'Plaza Reserved 200',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 18,
    rows: generateRows(1, 26, 30, 10, 25),
    vertices3D: [
      { x: -35, y: 10, z: 65 },
      { x: 35, y: 10, z: 65 },
      { x: 40, y: 55, z: 110 },
      { x: -40, y: 55, z: 110 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['18', '19', '20', '21', '22', '23', '24', '25', '26'],
      coveragePercentage: 35
    },
    distance: 65,
    height: 10,
    rake: 25,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'plaza-reserved-208',
    name: 'Plaza Reserved 208',
    level: 'lower',
    baseAngle: 50,
    angleSpan: 22,
    rows: generateRows(1, 26, 28, 10, 25),
    vertices3D: [
      { x: 65, y: 10, z: 115 },
      { x: 95, y: 10, z: 145 },
      { x: 100, y: 55, z: 190 },
      { x: 70, y: 55, z: 160 }
    ],
    covered: false,
    distance: 130,
    height: 10,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'plaza-reserved-216',
    name: 'Plaza Reserved 216',
    level: 'lower',
    baseAngle: 310,
    angleSpan: 22,
    rows: generateRows(1, 26, 28, 10, 25),
    vertices3D: [
      { x: -95, y: 10, z: 145 },
      { x: -65, y: 10, z: 115 },
      { x: -70, y: 55, z: 160 },
      { x: -100, y: 55, z: 190 }
    ],
    covered: false,
    distance: 130,
    height: 10,
    rake: 25,
    viewQuality: 'good',
    price: 'value'
  },

  // ========== SUITES ==========
  {
    id: 'luxury-suites',
    name: 'Luxury Suites',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 50,
    rows: [
      { rowNumber: 'Suite', seats: 280, elevation: 28, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -65, y: 28, z: 75 },
      { x: 65, y: 28, z: 75 },
      { x: 70, y: 38, z: 85 },
      { x: -70, y: 38, z: 85 }
    ],
    covered: true,
    distance: 75,
    height: 28,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== PICNIC PAVILION ==========
  {
    id: 'picnic-pavilion',
    name: 'Picnic Pavilion',
    level: 'field',
    baseAngle: 270,
    angleSpan: 25,
    rows: [
      { rowNumber: 'Picnic', seats: 120, elevation: 8, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: -140, y: 8, z: 280 },
      { x: -110, y: 8, z: 310 },
      { x: -115, y: 15, z: 317 },
      { x: -145, y: 15, z: 287 }
    ],
    covered: false,
    distance: 295,
    height: 8,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== LEFT FIELD BLEACHERS ==========
  {
    id: 'left-field-bleachers',
    name: 'Left Field Bleachers',
    level: 'field',
    baseAngle: 245,
    angleSpan: 20,
    rows: generateRows(1, 18, 32, 6, 20),
    vertices3D: [
      { x: -120, y: 6, z: 260 },
      { x: -100, y: 6, z: 280 },
      { x: -105, y: 32, z: 306 },
      { x: -125, y: 32, z: 286 }
    ],
    covered: false,
    distance: 270,
    height: 6,
    rake: 20,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== ROOFTOP TERRACE ==========
  {
    id: 'rooftop-terrace',
    name: 'Rooftop Terrace',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 30,
    rows: generateRows(1, 8, 45, 35, 22),
    vertices3D: [
      { x: 90, y: 35, z: 320 },
      { x: 130, y: 35, z: 360 },
      { x: 135, y: 52, z: 377 },
      { x: 95, y: 52, z: 337 }
    ],
    covered: false,
    distance: 340,
    height: 35,
    rake: 22,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== BAR AREA ==========
  {
    id: 'bar-area',
    name: 'Bar Area',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 25,
    rows: [],
    vertices3D: [
      { x: -40, y: 18, z: 390 },
      { x: 40, y: 18, z: 390 },
      { x: 45, y: 23, z: 400 },
      { x: -45, y: 23, z: 400 }
    ],
    covered: false,
    distance: 390,
    height: 18,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== GRASS BERM ==========
  {
    id: 'grass-berm',
    name: 'Grass Berm',
    level: 'field',
    baseAngle: 150,
    angleSpan: 35,
    rows: [],
    vertices3D: [
      { x: 120, y: 5, z: 340 },
      { x: 170, y: 5, z: 370 },
      { x: 175, y: 10, z: 380 },
      { x: 125, y: 10, z: 350 }
    ],
    covered: false,
    distance: 355,
    height: 5,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== STANDING ROOM ==========
  {
    id: 'standing-room-concourse',
    name: 'Standing Room Concourse',
    level: 'standing',
    baseAngle: 0,
    angleSpan: 360,
    rows: [],
    vertices3D: [
      { x: -100, y: 15, z: 300 },
      { x: 100, y: 15, z: 300 },
      { x: 105, y: 20, z: 310 },
      { x: -105, y: 20, z: 310 }
    ],
    covered: false,
    distance: 300,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'value'
  }
];

// Stadium configuration
export const columbusClippersConfig = {
  stadiumName: 'Huntington Park',
  team: 'Columbus Clippers',
  parentOrg: 'Cleveland Guardians',
  city: 'Columbus',
  state: 'OH',
  level: 'AAA',
  capacity: 10100,
  opened: 2009,
  orientation: 45,
  dimensions: {
    leftField: 325,
    leftCenter: 370,
    centerField: 400,
    rightCenter: 375,
    rightField: 318
  },
  features: {
    downtownColumbusView: true,
    aepPowerPavilion: true,
    rooftopTerrace: true,
    picnicPavilion: true,
    grassBerm: true,
    coveredSeating: 2800,
    standingRoom: true
  }
};