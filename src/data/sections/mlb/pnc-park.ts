// PNC Park - Complete Section Data with 3D Geometry
// Pittsburgh, PA - Opened 2001 - Capacity 38,362
// Home of the Pittsburgh Pirates
// Beautiful ballpark with skyline and river views

import { DetailedSection, Vector3D, RowDetail } from '../../../types/stadium-complete';

// Helper to generate row details with enhanced parameters
const generateRows = (
  startRow: number,
  endRow: number,
  elevation: number,
  depth: number,
  rakeAngle: number = 32
): RowDetail[] => {
  return Array.from({ length: endRow - startRow + 1 }, (_, i) => ({
    row: `${startRow + i}`,
    elevation: elevation + (i * 0.5),
    depth: depth - (i * 0.3),
    rakeAngle
  });
};

// Stadium configuration with all unique features
export const pncParkConfig = {
  name: 'PNC Park',
  team: 'Pittsburgh Pirates',
  city: 'Pittsburgh',
  state: 'PA',
  opened: 2001,
  capacity: 38362,
  roof: 'open',
  dimensions: {
    leftField: 325,
    leftCenter: 383,
    centerField: 399,
    rightCenter: 375,
    rightField: 320
  }
};

// PNC Park Sections - Complete Implementation (25 sections)
export const pncParkSections: DetailedSection[] = [
  // ========== PIRATES COVE (Behind Home Plate) ==========
  {
    id: 'pirates-cove',
    name: 'Pirates Cove',
    level: 'field',
    rows: generateRows(1, 8, -1, 14, 17),
    sunExposure: {
      morning: 5,
      afternoon: 20,
      evening: 40
    },
    covered: false
    vertices3D: [
      { x: -8, y: 50, z: -1 },
      { x: 8, y: 50, z: -1 },
      { x: 8, y: 60, z: 4 },
      { x: -8, y: 60, z: 4 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== FIELD BOX ==========
  {
    id: 'field-box-16',
    name: 'Field Box 16',
    level: 'field',
    rows: generateRows(1, 25, 0, 14, 19),
    sunExposure: {
      morning: 10,
      afternoon: 30,
      evening: 45
    },
    covered: false
    vertices3D: [
      { x: -10, y: 58, z: 0 },
      { x: 0, y: 58, z: 0 },
      { x: 0, y: 85, z: 13 },
      { x: -10, y: 85, z: 13 }
    ],
    accessibility: 4,
    viewQuality: 5
  },

  {
    id: 'field-box-108',
    name: 'Field Box 108',
    level: 'field',
    rows: generateRows(1, 25, 0, 14, 19),
    sunExposure: {
      morning: 15,
      afternoon: 35,
      evening: 40
    },
    covered: false
    vertices3D: [
      { x: 58, y: 58, z: 0 },
      { x: 72, y: 72, z: 0 },
      { x: 85, y: 85, z: 13 },
      { x: 71, y: 71, z: 13 }
    ],
    accessibility: 4,
    viewQuality: 5
  },

  // ========== JIM BEAM LEFT FIELD LOUNGE & PORCH ==========
  {
    id: 'jim-beam-lounge',
    name: 'Jim Beam Left Field Lounge',
    level: 'lounge',
    rows: [],
    sunExposure: {
      morning: 20,
      afternoon: 45,
      evening: 60
    },
    covered: true
    vertices3D: [
      { x: -95, y: 340, z: 20 },
      { x: -75, y: 355, z: 20 },
      { x: -75, y: 375, z: 20 },
      { x: -95, y: 360, z: 20 }
    ],
    accessibility: 5,
    viewQuality: 4
  },

  {
    id: 'jim-beam-porch',
    name: 'Jim Beam Porch',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 25,
      afternoon: 50,
      evening: 65
    },
    covered: false
    vertices3D: [
      { x: -95, y: 375, z: 20 },
      { x: -75, y: 390, z: 20 },
      { x: -75, y: 405, z: 20 },
      { x: -95, y: 390, z: 20 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  // ========== THE ROOFTOP (Left Field) ==========
  {
    id: 'rooftop-335',
    name: 'The Rooftop 335',
    level: 'upper',
    rows: generateRows(1, 12, 38, 18, 26),
    sunExposure: {
      morning: 30,
      afternoon: 55,
      evening: 70
    },
    covered: false
    vertices3D: [
      { x: -85, y: 320, z: 38 },
      { x: -65, y: 335, z: 38 },
      { x: -65, y: 355, z: 48 },
      { x: -85, y: 340, z: 48 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  // ========== RIVERWALK ==========
  {
    id: 'riverwalk-outfield',
    name: 'Riverwalk Outfield Seating',
    level: 'field',
    rows: generateRows(1, 8, 2, 12, 15),
    sunExposure: {
      morning: 35,
      afternoon: 60,
      evening: 75
    },
    covered: false
    vertices3D: [
      { x: -30, y: 400, z: 2 },
      { x: 30, y: 400, z: 2 },
      { x: 30, y: 420, z: 8 },
      { x: -30, y: 420, z: 8 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  {
    id: 'ahn-picnic-park',
    name: 'AHN Picnic Park',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 40,
      afternoon: 65,
      evening: 80
    },
    covered: false
    vertices3D: [
      { x: 40, y: 380, z: 3 },
      { x: 80, y: 370, z: 3 },
      { x: 80, y: 400, z: 3 },
      { x: 40, y: 410, z: 3 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  {
    id: 'fat-heads-bullpen',
    name: "Fat Head's Bullpen Bar",
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 30,
      afternoon: 55,
      evening: 70
    },
    covered: false
    vertices3D: [
      { x: 85, y: 340, z: 5 },
      { x: 105, y: 330, z: 5 },
      { x: 105, y: 350, z: 5 },
      { x: 85, y: 360, z: 5 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  // ========== THE PORCH (Center Field) ==========
  {
    id: 'the-porch',
    name: 'The Porch',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 45,
      afternoon: 70,
      evening: 85
    },
    covered: false
    vertices3D: [
      { x: -20, y: 430, z: 15 },
      { x: 20, y: 430, z: 15 },
      { x: 20, y: 450, z: 15 },
      { x: -20, y: 450, z: 15 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  // ========== PITTSBURGH BASEBALL CLUB LEVEL ==========
  {
    id: 'pittsburgh-baseball-club',
    name: 'Pittsburgh Baseball Club Level',
    level: 'suite',
    rows: generateRows(1, 8, 28, 16, 15),
    sunExposure: {
      morning: 10,
      afternoon: 25,
      evening: 35
    },
    covered: true
    vertices3D: [
      { x: -75, y: 120, z: 28 },
      { x: -55, y: 135, z: 28 },
      { x: -55, y: 155, z: 34 },
      { x: -75, y: 140, z: 34 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== WORLD SERIES SUITES ==========
  {
    id: 'world-series-suites',
    name: 'World Series Suites',
    level: 'suite',
    rows: generateRows(1, 1, 28, 0, 0),
    sunExposure: {
      morning: 5,
      afternoon: 20,
      evening: 30
    },
    covered: true
    vertices3D: [
      { x: -65, y: 140, z: 28 },
      { x: -45, y: 155, z: 28 },
      { x: -45, y: 175, z: 28 },
      { x: -65, y: 160, z: 28 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== CLUB CAMBRIA ==========
  {
    id: 'club-cambria',
    name: 'Club Cambria',
    level: 'club',
    rows: generateRows(1, 12, 22, 14, 18),
    sunExposure: {
      morning: 8,
      afternoon: 22,
      evening: 32
    },
    covered: true
    vertices3D: [
      { x: -20, y: 95, z: 22 },
      { x: 20, y: 95, z: 22 },
      { x: 20, y: 115, z: 30 },
      { x: -20, y: 115, z: 30 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== LOWER OUTFIELD BOX ==========
  {
    id: 'lower-outfield-133',
    name: 'Lower Outfield Box 133',
    level: 'field',
    rows: generateRows(1, 20, 5, 14, 21),
    sunExposure: {
      morning: 35,
      afternoon: 60,
      evening: 75
    },
    covered: false
    vertices3D: [
      { x: -80, y: 300, z: 5 },
      { x: -60, y: 315, z: 5 },
      { x: -60, y: 340, z: 20 },
      { x: -80, y: 325, z: 20 }
    ],
    accessibility: 3,
    viewQuality: 4
  },

  // ========== BLEACHER BOX (Right Field Wall) ==========
  {
    id: 'bleacher-box-139',
    name: 'Bleacher Box 139',
    level: 'field',
    rows: generateRows(1, 18, 8, 12, 24),
    sunExposure: {
      morning: 40,
      afternoon: 65,
      evening: 80
    },
    covered: false
    vertices3D: [
      { x: 80, y: 300, z: 8 },
      { x: 100, y: 290, z: 8 },
      { x: 100, y: 315, z: 22 },
      { x: 80, y: 325, z: 22 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  // ========== GRANDSTAND ==========
  {
    id: 'grandstand-209',
    name: 'Grandstand 209',
    level: 'lower',
    rows: generateRows(1, 28, 14, 16, 23),
    sunExposure: {
      morning: 12,
      afternoon: 28,
      evening: 38
    },
    covered: true
    vertices3D: [
      { x: -18, y: 85, z: 14 },
      { x: -5, y: 85, z: 14 },
      { x: -5, y: 120, z: 34 },
      { x: -18, y: 120, z: 34 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  {
    id: 'grandstand-218',
    name: 'Grandstand 218',
    level: 'lower',
    rows: generateRows(1, 28, 14, 16, 23),
    sunExposure: {
      morning: 18,
      afternoon: 32,
      evening: 42
    },
    covered: true
    vertices3D: [
      { x: 45, y: 85, z: 14 },
      { x: 60, y: 95, z: 14 },
      { x: 60, y: 130, z: 34 },
      { x: 45, y: 120, z: 34 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  // ========== UPPER DECK ==========
  {
    id: 'upper-deck-306',
    name: 'Upper Deck 306',
    level: 'upper',
    rows: generateRows(1, 32, 34, 18, 28),
    sunExposure: {
      morning: 15,
      afternoon: 30,
      evening: 40
    },
    covered: true
    vertices3D: [
      { x: -25, y: 120, z: 34 },
      { x: -8, y: 120, z: 34 },
      { x: -6, y: 170, z: 68 },
      { x: -23, y: 170, z: 68 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  {
    id: 'upper-deck-325',
    name: 'Upper Deck 325',
    level: 'upper',
    rows: generateRows(1, 32, 34, 18, 28),
    sunExposure: {
      morning: 25,
      afternoon: 45,
      evening: 60
    },
    covered: false
    vertices3D: [
      { x: -70, y: 160, z: 34 },
      { x: -50, y: 175, z: 34 },
      { x: -50, y: 225, z: 68 },
      { x: -70, y: 210, z: 68 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  // ========== ALL YOU CAN EAT SEATS ==========
  {
    id: 'all-you-can-eat',
    name: 'All You Can Eat Seats',
    level: 'upper',
    rows: generateRows(1, 20, 36, 16, 27),
    sunExposure: {
      morning: 50,
      afternoon: 75,
      evening: 90
    },
    covered: false
    vertices3D: [
      { x: 60, y: 340, z: 36 },
      { x: 80, y: 330, z: 36 },
      { x: 80, y: 360, z: 52 },
      { x: 60, y: 370, z: 52 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  // ========== STANDING ROOM ONLY ==========
  {
    id: 'standing-room-rotunda',
    name: 'Rotunda Standing Room',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 20,
      afternoon: 40,
      evening: 55
    },
    covered: false
    vertices3D: [
      { x: -40, y: 380, z: 10 },
      { x: 40, y: 380, z: 10 },
      { x: 40, y: 395, z: 10 },
      { x: -40, y: 395, z: 10 }
    ],
    accessibility: 4,
    viewQuality: 2
  },

  // ========== PIRATES CHARITIES DECK ==========
  {
    id: 'pirates-charities-deck',
    name: 'Pirates Charities Deck',
    level: 'deck',
    rows: generateRows(1, 10, 25, 14, 20),
    sunExposure: {
      morning: 22,
      afternoon: 42,
      evening: 58
    },
    covered: false
    vertices3D: [
      { x: -60, y: 200, z: 25 },
      { x: -40, y: 215, z: 25 },
      { x: -40, y: 235, z: 33 },
      { x: -60, y: 220, z: 33 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  // ========== DIAMOND CLUB ==========
  {
    id: 'diamond-club',
    name: 'Diamond Club',
    level: 'field',
    rows: generateRows(1, 6, -1, 12, 16),
    sunExposure: {
      morning: 3,
      afternoon: 15,
      evening: 25
    },
    covered: true
    vertices3D: [
      { x: -8, y: 48, z: -1 },
      { x: 8, y: 48, z: -1 },
      { x: 8, y: 58, z: 3 },
      { x: -8, y: 58, z: 3 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== HALL OF FAME CLUB ==========
  {
    id: 'hall-of-fame-club',
    name: 'Hall of Fame Club',
    level: 'club',
    rows: generateRows(1, 10, 18, 14, 17),
    sunExposure: {
      morning: 5,
      afternoon: 18,
      evening: 28
    },
    covered: true
    vertices3D: [
      { x: 25, y: 90, z: 18 },
      { x: 45, y: 95, z: 18 },
      { x: 45, y: 110, z: 26 },
      { x: 25, y: 105, z: 26 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== LEGACY SQUARE ==========
  {
    id: 'legacy-square',
    name: 'Legacy Square',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 60,
      afternoon: 85,
      evening: 95
    },
    covered: false
    vertices3D: [
      { x: -50, y: 420, z: 5 },
      { x: -20, y: 430, z: 5 },
      { x: -20, y: 450, z: 5 },
      { x: -50, y: 440, z: 5 }
    ],
    accessibility: 4,
    viewQuality: 2
  }
];