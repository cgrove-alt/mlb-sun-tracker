// Louisville Slugger Field - Louisville Bats (Cincinnati Reds AAA)
// Opened: 2000
// Capacity: 13,131
// Known for downtown Louisville skyline and Ohio River views

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

export const louisvilleBatsSections: DetailedSection[] = [
  // ========== CHAMPIONS CLUB ==========
  {
    id: 'champions-club',
    name: 'Champions Club',
    level: 'club',
    baseAngle: 0,
    angleSpan: 32,
    rows: generateRows('A', 'M', 44, 26, 28),
    vertices3D: [
      { x: -47, y: 26, z: 61 },
      { x: 47, y: 26, z: 61 },
      { x: 52, y: 56, z: 91 },
      { x: -52, y: 56, z: 91 }
    ],
    covered: true,
    distance: 61,
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
    baseAngle: 345,
    angleSpan: 19,
    rows: generateRows('A', 'Q', 25, 3, 24),
    vertices3D: [
      { x: -27, y: 3, z: 49 },
      { x: -8, y: 3, z: 49 },
      { x: -3, y: 38, z: 84 },
      { x: -22, y: 38, z: 84 }
    ],
    covered: false,
    distance: 49,
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
    angleSpan: 15,
    rows: generateRows('A', 'Q', 25, 3, 24),
    vertices3D: [
      { x: -8, y: 3, z: 49 },
      { x: 8, y: 3, z: 49 },
      { x: 13, y: 38, z: 84 },
      { x: -3, y: 38, z: 84 }
    ],
    covered: false,
    distance: 49,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-103',
    name: 'Field Box 103',
    level: 'field',
    baseAngle: 15,
    angleSpan: 19,
    rows: generateRows('A', 'Q', 25, 3, 24),
    vertices3D: [
      { x: 8, y: 3, z: 49 },
      { x: 27, y: 3, z: 49 },
      { x: 22, y: 38, z: 84 },
      { x: 3, y: 38, z: 84 }
    ],
    covered: false,
    distance: 49,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'premium'
  },

  {
    id: 'field-box-111',
    name: 'Field Box 111',
    level: 'field',
    baseAngle: 46,
    angleSpan: 25,
    rows: generateRows('A', 'Q', 27, 3, 24),
    vertices3D: [
      { x: 53, y: 3, z: 84 },
      { x: 87, y: 3, z: 118 },
      { x: 92, y: 38, z: 153 },
      { x: 58, y: 38, z: 119 }
    ],
    covered: false,
    distance: 101,
    height: 3,
    rake: 24,
    viewQuality: 'excellent',
    price: 'moderate'
  },

  {
    id: 'field-box-119',
    name: 'Field Box 119',
    level: 'field',
    baseAngle: 314,
    angleSpan: 25,
    rows: generateRows('A', 'Q', 27, 3, 24),
    vertices3D: [
      { x: -87, y: 3, z: 118 },
      { x: -53, y: 3, z: 84 },
      { x: -58, y: 38, z: 119 },
      { x: -92, y: 38, z: 153 }
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
    id: 'reserved-201',
    name: 'Reserved 201',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 23,
    rows: generateRows(1, 29, 35, 10, 26),
    vertices3D: [
      { x: -37, y: 10, z: 69 },
      { x: 37, y: 10, z: 69 },
      { x: 42, y: 60, z: 119 },
      { x: -42, y: 60, z: 119 }
    ],
    covered: true,
    partialCoverage: {
      type: 'partial',
      coveredRows: ['21', '22', '23', '24', '25', '26', '27', '28', '29'],
      coveragePercentage: 31
    },
    distance: 69,
    height: 10,
    rake: 26,
    viewQuality: 'good',
    price: 'moderate'
  },

  {
    id: 'reserved-209',
    name: 'Reserved 209',
    level: 'lower',
    baseAngle: 52,
    angleSpan: 27,
    rows: generateRows(1, 29, 33, 10, 26),
    vertices3D: [
      { x: 73, y: 10, z: 124 },
      { x: 107, y: 10, z: 158 },
      { x: 112, y: 60, z: 208 },
      { x: 78, y: 60, z: 174 }
    ],
    covered: false,
    distance: 141,
    height: 10,
    rake: 26,
    viewQuality: 'good',
    price: 'value'
  },

  {
    id: 'reserved-217',
    name: 'Reserved 217',
    level: 'lower',
    baseAngle: 308,
    angleSpan: 27,
    rows: generateRows(1, 29, 33, 10, 26),
    vertices3D: [
      { x: -107, y: 10, z: 158 },
      { x: -73, y: 10, z: 124 },
      { x: -78, y: 60, z: 174 },
      { x: -112, y: 60, z: 208 }
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
    angleSpan: 62,
    rows: [
      { rowNumber: 'Suite', seats: 380, elevation: 35, depth: 0, covered: true }
    ],
    vertices3D: [
      { x: -77, y: 35, z: 89 },
      { x: 77, y: 35, z: 89 },
      { x: 82, y: 45, z: 99 },
      { x: -82, y: 45, z: 99 }
    ],
    covered: true,
    distance: 89,
    height: 35,
    rake: 0,
    viewQuality: 'excellent',
    price: 'luxury'
  },

  // ========== JIM BEAM BOURBON BAR ==========
  {
    id: 'jim-beam-bourbon-bar',
    name: 'Jim Beam Bourbon Bar',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 27,
    rows: [],
    vertices3D: [
      { x: 125, y: 17, z: 290 },
      { x: 160, y: 17, z: 325 },
      { x: 165, y: 23, z: 331 },
      { x: 130, y: 23, z: 296 }
    ],
    covered: true,
    distance: 307,
    height: 17,
    rake: 0,
    viewQuality: 'fair',
    price: 'premium'
  },

  // ========== BLEACHERS ==========
  {
    id: 'left-field-bleachers',
    name: 'Left Field Bleachers',
    level: 'field',
    baseAngle: 122,
    angleSpan: 33,
    rows: generateRows(1, 24, 40, 5, 22),
    vertices3D: [
      { x: 185, y: 5, z: 285 },
      { x: 225, y: 5, z: 325 },
      { x: 230, y: 47, z: 367 },
      { x: 190, y: 47, z: 327 }
    ],
    covered: false,
    distance: 305,
    height: 5,
    rake: 22,
    viewQuality: 'fair',
    price: 'value'
  },

  {
    id: 'right-field-bleachers',
    name: 'Right Field Bleachers',
    level: 'field',
    baseAngle: 238,
    angleSpan: 33,
    rows: generateRows(1, 24, 40, 5, 22),
    vertices3D: [
      { x: -225, y: 5, z: 325 },
      { x: -185, y: 5, z: 285 },
      { x: -190, y: 47, z: 327 },
      { x: -230, y: 47, z: 367 }
    ],
    covered: false,
    distance: 305,
    height: 5,
    rake: 22,
    viewQuality: 'fair',
    price: 'value'
  },

  // ========== PARTY PERCH ==========
  {
    id: 'party-perch',
    name: 'Party Perch',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 28,
    rows: generateRows(1, 10, 50, 37, 24),
    vertices3D: [
      { x: 105, y: 37, z: 335 },
      { x: 145, y: 37, z: 375 },
      { x: 150, y: 55, z: 393 },
      { x: 110, y: 55, z: 353 }
    ],
    covered: false,
    distance: 355,
    height: 37,
    rake: 24,
    viewQuality: 'good',
    price: 'premium'
  },

  // ========== SLUGGER LANDING ==========
  {
    id: 'slugger-landing',
    name: 'Slugger Landing',
    level: 'standing',
    baseAngle: 180,
    angleSpan: 32,
    rows: [],
    vertices3D: [
      { x: -48, y: 19, z: 398 },
      { x: 48, y: 19, z: 398 },
      { x: 53, y: 25, z: 408 },
      { x: -53, y: 25, z: 408 }
    ],
    covered: false,
    distance: 398,
    height: 19,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  },

  // ========== BUDWEISER BOWTIE BAR ==========
  {
    id: 'budweiser-bowtie-bar',
    name: 'Budweiser Bowtie Bar',
    level: 'standing',
    baseAngle: 270,
    angleSpan: 23,
    rows: [],
    vertices3D: [
      { x: -170, y: 15, z: 315 },
      { x: -145, y: 15, z: 340 },
      { x: -150, y: 21, z: 346 },
      { x: -175, y: 21, z: 321 }
    ],
    covered: false,
    distance: 327,
    height: 15,
    rake: 0,
    viewQuality: 'fair',
    price: 'moderate'
  }
];

// Stadium configuration
export const louisvilleBatsConfig = {
  stadiumName: 'Louisville Slugger Field',
  team: 'Louisville Bats',
  parentOrg: 'Cincinnati Reds',
  city: 'Louisville',
  state: 'KY',
  level: 'AAA',
  capacity: 13131,
  opened: 2000,
  orientation: 225,
  dimensions: {
    leftField: 325,
    leftCenter: 375,
    centerField: 405,
    rightCenter: 375,
    rightField: 320
  },
  features: {
    championsClub: true,
    jimBeamBourbonBar: true,
    partyPerch: true,
    sluggerLanding: true,
    budweiserBowtieBar: true,
    downtownLouisvilleView: true,
    ohioRiverView: true,
    coveredSeating: 3600,
    largeCapacity: true
  }
};