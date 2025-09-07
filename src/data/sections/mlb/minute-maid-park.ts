// Minute Maid Park (Daikin Park as of 2025) - Complete Section Data with 3D Geometry
// Houston, TX - Opened 2000 - Capacity 41,168
// Home of the Houston Astros
// Retractable roof stadium with unique train feature and Crawford Boxes

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
export const minuteMaidParkConfig = {
  name: 'Minute Maid Park (Daikin Park)',
  team: 'Houston Astros',
  city: 'Houston',
  state: 'TX',
  opened: 2000,
  capacity: 41168,
  roof: 'retractable',
  dimensions: {
    leftField: 315, // Crawford Boxes - very short
    leftCenter: 369,
    centerField: 409,
    rightCenter: 373,
    rightField: 326
  }
};

// Minute Maid Park Sections - Complete Implementation (24 sections)
export const minuteMaidParkSections: DetailedSection[] = [
  // ========== DIAMOND CLUB (Behind Home Plate) ==========
  {
    id: 'diamond-club-aa',
    name: 'Diamond Club AA',
    level: 'field',
    rows: generateRows(1, 6, -2, 14, 16),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -8, y: 52, z: -2 },
      { x: 8, y: 52, z: -2 },
      { x: 8, y: 62, z: 3 },
      { x: -8, y: 62, z: 3 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== FIELD BOX ==========
  {
    id: 'field-box-112',
    name: 'Field Box 112',
    level: 'field',
    baseAngle: 20,
    angleSpan: 8,
    rows: generateRows(1, 26, 0, 14, 19),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -10, y: 60, z: 0 },
      { x: 0, y: 60, z: 0 },
      { x: 0, y: 88, z: 14 },
      { x: -10, y: 88, z: 14 }
    ],
    accessibility: 4,
    viewQuality: 5
  },

  {
    id: 'field-box-126',
    name: 'Field Box 126',
    level: 'field',
    baseAngle: 65,
    angleSpan: 8,
    rows: generateRows(1, 26, 0, 14, 19),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: 60, y: 60, z: 0 },
      { x: 74, y: 74, z: 0 },
      { x: 88, y: 88, z: 14 },
      { x: 74, y: 74, z: 14 }
    ],
    accessibility: 4,
    viewQuality: 5
  },

  // ========== CRAWFORD BOXES (Left Field) ==========
  {
    id: 'crawford-boxes-100',
    name: 'Crawford Boxes 100',
    level: 'field',
    baseAngle: 290,
    angleSpan: 10,
    rows: generateRows(1, 22, 8, 14, 20),
    sunExposure: {
      morning: 10,
      afternoon: 0,
      evening: 5
    },
    covered: true
    vertices3D: [
      { x: -100, y: 300, z: 8 },
      { x: -80, y: 315, z: 8 },
      { x: -75, y: 340, z: 28 },
      { x: -95, y: 325, z: 28 }
    ],
    accessibility: 3,
    viewQuality: 4
  },

  {
    id: 'crawford-boxes-101',
    name: 'Crawford Boxes 101',
    level: 'field',
    baseAngle: 280,
    angleSpan: 10,
    rows: generateRows(1, 22, 8, 14, 20),
    sunExposure: {
      morning: 10,
      afternoon: 0,
      evening: 5
    },
    covered: true
    vertices3D: [
      { x: -80, y: 315, z: 8 },
      { x: -60, y: 325, z: 8 },
      { x: -55, y: 350, z: 28 },
      { x: -75, y: 340, z: 28 }
    ],
    accessibility: 3,
    viewQuality: 4
  },

  // ========== INSPERITY CLUB (Sections 70-75) ==========
  {
    id: 'insperity-club-70',
    name: 'Insperity Club 70',
    level: 'club',
    rows: generateRows(1, 12, 25, 14, 18),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -22, y: 105, z: 25 },
      { x: -8, y: 105, z: 25 },
      { x: -8, y: 130, z: 36 },
      { x: -22, y: 130, z: 36 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== GALLAGHER CLUB (Left Field Line) ==========
  {
    id: 'gallagher-club',
    name: 'Gallagher Club',
    level: 'suite',
    rows: generateRows(1, 8, 32, 16, 15),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -95, y: 150, z: 32 },
      { x: -75, y: 165, z: 32 },
      { x: -75, y: 185, z: 38 },
      { x: -95, y: 170, z: 38 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== BULLPEN BOX ==========
  {
    id: 'bullpen-box-155',
    name: 'Bullpen Box 155',
    level: 'field',
    rows: generateRows(1, 18, 2, 12, 22),
    sunExposure: {
      morning: 15,
      afternoon: 10,
      evening: 20
    },
    covered: false
    vertices3D: [
      { x: 85, y: 340, z: 2 },
      { x: 100, y: 330, z: 2 },
      { x: 100, y: 350, z: 18 },
      { x: 85, y: 360, z: 18 }
    ],
    accessibility: 3,
    viewQuality: 4
  },

  // ========== HOME RUN ALLEY (Left Field Concourse) ==========
  {
    id: 'home-run-alley',
    name: 'Home Run Alley',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 5,
      afternoon: 0,
      evening: 10
    },
    covered: true
    vertices3D: [
      { x: -100, y: 320, z: 15 },
      { x: -70, y: 340, z: 15 },
      { x: -70, y: 355, z: 15 },
      { x: -100, y: 335, z: 15 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  // ========== UNION STATION LOBBY ==========
  {
    id: 'union-station-lobby',
    name: 'Union Station Lobby',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -120, y: 280, z: 0 },
      { x: -90, y: 300, z: 0 },
      { x: -90, y: 320, z: 0 },
      { x: -120, y: 300, z: 0 }
    ],
    accessibility: 5,
    viewQuality: 2
  },

  // ========== MEZZANINE ==========
  {
    id: 'mezzanine-206',
    name: 'Mezzanine 206',
    level: 'lower',
    baseAngle: 20,
    angleSpan: 9,
    rows: generateRows(1, 28, 14, 16, 23),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -18, y: 88, z: 14 },
      { x: -5, y: 88, z: 14 },
      { x: -5, y: 125, z: 36 },
      { x: -18, y: 125, z: 36 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  {
    id: 'mezzanine-254',
    name: 'Mezzanine 254',
    level: 'lower',
    baseAngle: 110,
    angleSpan: 9,
    rows: generateRows(1, 28, 14, 16, 23),
    sunExposure: {
      morning: 5,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: 88, y: -18, z: 14 },
      { x: 88, y: -5, z: 14 },
      { x: 125, y: -5, z: 36 },
      { x: 125, y: -18, z: 36 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  // ========== TERRACE DECK ==========
  {
    id: 'terrace-deck-305',
    name: 'Terrace Deck 305',
    level: 'terrace',
    rows: generateRows(1, 9, 24, 14, 26),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -28, y: 115, z: 24 },
      { x: -10, y: 115, z: 24 },
      { x: -8, y: 150, z: 40 },
      { x: -26, y: 150, z: 40 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  // ========== VIEW DECK ==========
  {
    id: 'view-deck-406',
    name: 'View Deck 406',
    level: 'upper',
    baseAngle: 20,
    angleSpan: 11,
    rows: generateRows(1, 30, 36, 18, 28),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -28, y: 125, z: 36 },
      { x: -10, y: 125, z: 36 },
      { x: -8, y: 180, z: 75 },
      { x: -26, y: 180, z: 75 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  {
    id: 'view-deck-432',
    name: 'View Deck 432',
    level: 'upper',
    baseAngle: 335,
    angleSpan: 11,
    rows: generateRows(1, 30, 36, 18, 28),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -125, y: 28, z: 36 },
      { x: -125, y: 10, z: 36 },
      { x: -180, y: 8, z: 75 },
      { x: -180, y: 26, z: 75 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  // ========== HOME RUN PUMP (Center Field) ==========
  {
    id: 'home-run-pump',
    name: 'Home Run Pump',
    level: 'standing',
    baseAngle: 200,
    angleSpan: 15,
    rows: [],
    sunExposure: {
      morning: 20,
      afternoon: 5,
      evening: 15
    },
    covered: true
    vertices3D: [
      { x: -30, y: 430, z: 12 },
      { x: 30, y: 430, z: 12 },
      { x: 30, y: 450, z: 12 },
      { x: -30, y: 450, z: 12 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  // ========== TORCHY'S TACOS DECK (Left Field) ==========
  {
    id: 'torchys-tacos',
    name: "Torchy's Tacos Deck",
    level: 'standing',
    baseAngle: 270,
    angleSpan: 12,
    rows: [],
    sunExposure: {
      morning: 10,
      afternoon: 0,
      evening: 15
    },
    covered: true
    vertices3D: [
      { x: -95, y: 340, z: 30 },
      { x: -75, y: 355, z: 30 },
      { x: -75, y: 370, z: 30 },
      { x: -95, y: 355, z: 30 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  // ========== DUGOUT BOX ==========
  {
    id: 'dugout-box-a',
    name: 'Dugout Box A',
    level: 'field',
    rows: generateRows(1, 8, -1, 12, 17),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: false
    vertices3D: [
      { x: -45, y: 45, z: -1 },
      { x: -30, y: 50, z: -1 },
      { x: -30, y: 65, z: 6 },
      { x: -45, y: 60, z: 6 }
    ],
    accessibility: 4,
    viewQuality: 5
  },

  // ========== SUITE LEVEL ==========
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 20,
    angleSpan: 12,
    rows: generateRows(1, 1, 32, 0, 0),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -20, y: 115, z: 32 },
      { x: 20, y: 115, z: 32 },
      { x: 20, y: 135, z: 32 },
      { x: -20, y: 135, z: 32 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== TRAIN DECK (Above Left Field Wall) ==========
  {
    id: 'train-deck',
    name: 'Train Deck',
    level: 'standing',
    baseAngle: 290,
    angleSpan: 8,
    rows: [],
    sunExposure: {
      morning: 5,
      afternoon: 0,
      evening: 10
    },
    covered: true
    vertices3D: [
      { x: -100, y: 315, z: 35 },
      { x: -85, y: 325, z: 35 },
      { x: -85, y: 335, z: 35 },
      { x: -100, y: 325, z: 35 }
    ],
    accessibility: 3,
    viewQuality: 4
  },

  // ========== BUDWEISER BREW HOUSE ==========
  {
    id: 'budweiser-brew-house',
    name: 'Budweiser Brew House',
    level: 'standing',
    baseAngle: 110,
    angleSpan: 10,
    rows: [],
    sunExposure: {
      morning: 15,
      afternoon: 5,
      evening: 10
    },
    covered: true
    vertices3D: [
      { x: 100, y: -30, z: 15 },
      { x: 120, y: -40, z: 15 },
      { x: 120, y: -25, z: 15 },
      { x: 100, y: -15, z: 15 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  // ========== CLUB TIER I ==========
  {
    id: 'club-tier-i',
    name: 'Club Tier I',
    level: 'club',
    rows: generateRows(1, 15, 22, 14, 20),
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    covered: true
    vertices3D: [
      { x: -15, y: 95, z: 22 },
      { x: 15, y: 95, z: 22 },
      { x: 15, y: 115, z: 32 },
      { x: -15, y: 115, z: 32 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== FORMER TAL'S HILL MEMORIAL AREA ==========
  {
    id: 'tals-hill-memorial',
    name: "Former Tal's Hill Area",
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 25,
      afternoon: 15,
      evening: 20
    },
    covered: false
    vertices3D: [
      { x: -20, y: 420, z: 8 },
      { x: 20, y: 420, z: 8 },
      { x: 20, y: 436, z: 10 },
      { x: -20, y: 436, z: 10 }
    ],
    accessibility: 3,
    viewQuality: 3
  }
];