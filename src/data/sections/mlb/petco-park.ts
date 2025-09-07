// Petco Park - Complete Section Data with 3D Geometry
// San Diego, CA - Opened 2004 - Capacity 40,209
// Home of the San Diego Padres
// Unique downtown ballpark with Western Metal Supply Building

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
  }));
};

// Stadium configuration with all unique features
export const petcoParkConfig = {
  name: 'Petco Park',
  team: 'San Diego Padres',
  city: 'San Diego',
  state: 'CA',
  opened: 2004,
  capacity: 40209,
  roof: 'open',
  dimensions: {
    leftField: 334,
    leftCenter: 357,
    centerField: 396,
    rightCenter: 391,
    rightField: 322
  }
};

// Petco Park Sections - Complete Implementation (25 sections)
export const petcoParkSections: DetailedSection[] = [
  // ========== LEXUS PREMIER CLUB (Behind Home Plate) ==========
  {
    id: 'lexus-premier-club',
    name: 'Lexus Premier Club',
    level: 'field',
    rows: generateRows(1, 8, -1, 14, 17),
    sunExposure: {
      morning: 10,
      afternoon: 35,
      evening: 65
    },
    covered: true
    vertices3D: [
      { x: -8, y: 52, z: -1 },
      { x: 8, y: 52, z: -1 },
      { x: 8, y: 62, z: 4 },
      { x: -8, y: 62, z: 4 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== FIELD LEVEL ==========
  {
    id: 'field-level-101',
    name: 'Field Level 101',
    level: 'field',
    rows: generateRows(1, 26, 0, 14, 20),
    sunExposure: {
      morning: 15,
      afternoon: 40,
      evening: 70
    },
    covered: false
    vertices3D: [
      { x: -12, y: 62, z: 0 },
      { x: 0, y: 62, z: 0 },
      { x: 0, y: 92, z: 16 },
      { x: -12, y: 92, z: 16 }
    ],
    accessibility: 4,
    viewQuality: 5
  },

  {
    id: 'field-level-117',
    name: 'Field Level 117',
    level: 'field',
    rows: generateRows(1, 26, 0, 14, 20),
    sunExposure: {
      morning: 20,
      afternoon: 45,
      evening: 65
    },
    covered: false
    vertices3D: [
      { x: 62, y: 62, z: 0 },
      { x: 77, y: 77, z: 0 },
      { x: 92, y: 92, z: 16 },
      { x: 77, y: 77, z: 16 }
    ],
    accessibility: 4,
    viewQuality: 5
  },

  // ========== WESTERN METAL SUPPLY BUILDING ==========
  {
    id: 'western-metal-rail',
    name: 'The Rail - Western Metal',
    level: 'metal',
    rows: generateRows(1, 4, 18, 10, 15),
    sunExposure: {
      morning: 30,
      afternoon: 55,
      evening: 80
    },
    covered: false
    vertices3D: [
      { x: -100, y: 334, z: 18 },
      { x: -85, y: 344, z: 18 },
      { x: -85, y: 354, z: 22 },
      { x: -100, y: 344, z: 22 }
    ],
    accessibility: 4,
    viewQuality: 5
  },

  {
    id: 'budweiser-loft',
    name: 'Budweiser Loft - 5th Level',
    level: 'metal',
    rows: [],
    sunExposure: {
      morning: 25,
      afternoon: 50,
      evening: 75
    },
    covered: true
    vertices3D: [
      { x: -100, y: 334, z: 45 },
      { x: -80, y: 349, z: 45 },
      { x: -80, y: 364, z: 45 },
      { x: -100, y: 349, z: 45 }
    ],
    accessibility: 5,
    viewQuality: 4
  },

  {
    id: 'western-metal-rooftop',
    name: 'Western Metal Rooftop',
    level: 'metal',
    rows: [],
    sunExposure: {
      morning: 35,
      afternoon: 60,
      evening: 85
    },
    covered: false
    vertices3D: [
      { x: -100, y: 334, z: 55 },
      { x: -75, y: 354, z: 55 },
      { x: -75, y: 369, z: 55 },
      { x: -100, y: 349, z: 55 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  {
    id: 'foul-pole-suite',
    name: 'Foul Pole Suite',
    level: 'metal',
    rows: generateRows(1, 3, 28, 12, 12),
    sunExposure: {
      morning: 40,
      afternoon: 65,
      evening: 90
    },
    covered: true
    vertices3D: [
      { x: -100, y: 336, z: 28 },
      { x: -90, y: 346, z: 28 },
      { x: -90, y: 356, z: 32 },
      { x: -100, y: 346, z: 32 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== GALLAGHER SQUARE (formerly Park at the Park) ==========
  {
    id: 'gallagher-square-lawn',
    name: 'Gallagher Square Lawn',
    level: 'lawn',
    rows: [],
    sunExposure: {
      morning: 50,
      afternoon: 75,
      evening: 95
    },
    covered: false
    vertices3D: [
      { x: -30, y: 420, z: 3 },
      { x: 30, y: 420, z: 3 },
      { x: 30, y: 460, z: 12 },
      { x: -30, y: 460, z: 12 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  {
    id: 'tony-gwynn-terrace',
    name: 'Tony Gwynn Terrace',
    level: 'terrace',
    rows: generateRows(1, 8, 15, 12, 18),
    sunExposure: {
      morning: 45,
      afternoon: 70,
      evening: 90
    },
    covered: false
    vertices3D: [
      { x: -20, y: 440, z: 15 },
      { x: 20, y: 440, z: 15 },
      { x: 20, y: 455, z: 20 },
      { x: -20, y: 455, z: 20 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  {
    id: 'gallagher-playground',
    name: 'Gallagher Square Playground',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 55,
      afternoon: 80,
      evening: 95
    },
    covered: false
    vertices3D: [
      { x: 35, y: 430, z: 5 },
      { x: 55, y: 430, z: 5 },
      { x: 55, y: 450, z: 5 },
      { x: 35, y: 450, z: 5 }
    ],
    accessibility: 5,
    viewQuality: 2
  },

  // ========== TOYOTA BEACH ==========
  {
    id: 'toyota-beach',
    name: 'Toyota Beach',
    level: 'beach',
    rows: [],
    sunExposure: {
      morning: 35,
      afternoon: 60,
      evening: 85
    },
    covered: false
    vertices3D: [
      { x: 80, y: 380, z: 8 },
      { x: 100, y: 370, z: 8 },
      { x: 100, y: 395, z: 8 },
      { x: 80, y: 405, z: 8 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  // ========== ESTRELLA JALISCO LANDING ==========
  {
    id: 'estrella-jalisco-landing',
    name: 'Estrella Jalisco Landing',
    level: 'landing',
    rows: [],
    sunExposure: {
      morning: 40,
      afternoon: 65,
      evening: 90
    },
    covered: false
    vertices3D: [
      { x: -80, y: 380, z: 12 },
      { x: -60, y: 395, z: 12 },
      { x: -60, y: 415, z: 18 },
      { x: -80, y: 400, z: 18 }
    ],
    accessibility: 4,
    viewQuality: 3
  },

  // ========== PACIFICO PORCH ==========
  {
    id: 'pacifico-porch',
    name: 'Pacifico Porch',
    level: 'porch',
    rows: generateRows(1, 6, 14, 12, 20),
    sunExposure: {
      morning: 25,
      afternoon: 45,
      evening: 70
    },
    covered: true
    vertices3D: [
      { x: -95, y: 350, z: 14 },
      { x: -75, y: 365, z: 14 },
      { x: -75, y: 380, z: 20 },
      { x: -95, y: 365, z: 20 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  // ========== CITY CRUISES HOME RUN DECK ==========
  {
    id: 'home-run-deck',
    name: 'City Cruises Home Run Deck',
    level: 'deck',
    rows: generateRows(1, 10, 10, 14, 22),
    sunExposure: {
      morning: 30,
      afternoon: 55,
      evening: 80
    },
    covered: false
    vertices3D: [
      { x: 85, y: 322, z: 10 },
      { x: 105, y: 312, z: 10 },
      { x: 105, y: 337, z: 20 },
      { x: 85, y: 347, z: 20 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  // ========== SUNSET PATIO ==========
  {
    id: 'sunset-patio',
    name: 'Sunset Patio',
    level: 'patio',
    rows: [],
    sunExposure: {
      morning: 15,
      afternoon: 40,
      evening: 75
    },
    covered: false
    vertices3D: [
      { x: 70, y: 100, z: 18 },
      { x: 90, y: 110, z: 18 },
      { x: 90, y: 130, z: 18 },
      { x: 70, y: 120, z: 18 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  // ========== SKYLINE PATIO ==========
  {
    id: 'skyline-patio',
    name: 'Skyline Patio',
    level: 'patio',
    rows: [],
    sunExposure: {
      morning: 20,
      afternoon: 45,
      evening: 70
    },
    covered: false
    vertices3D: [
      { x: -70, y: 100, z: 18 },
      { x: -50, y: 115, z: 18 },
      { x: -50, y: 135, z: 18 },
      { x: -70, y: 120, z: 18 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  // ========== FIELD CLUB ==========
  {
    id: 'field-club',
    name: 'Field Club',
    level: 'club',
    rows: generateRows(1, 12, 8, 14, 18),
    sunExposure: {
      morning: 10,
      afternoon: 30,
      evening: 55
    },
    covered: true
    vertices3D: [
      { x: -25, y: 75, z: 8 },
      { x: 25, y: 75, z: 8 },
      { x: 25, y: 95, z: 16 },
      { x: -25, y: 95, z: 16 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== PRESS CLUB ==========
  {
    id: 'press-club',
    name: 'Press Club',
    level: 'lower',
    rows: generateRows(1, 28, 14, 16, 23),
    sunExposure: {
      morning: 12,
      afternoon: 35,
      evening: 60
    },
    covered: true
    vertices3D: [
      { x: -18, y: 92, z: 14 },
      { x: -5, y: 92, z: 14 },
      { x: -5, y: 130, z: 36 },
      { x: -18, y: 130, z: 36 }
    ],
    accessibility: 4,
    viewQuality: 4
  },

  // ========== TERRACE LEVEL ==========
  {
    id: 'terrace-205',
    name: 'Terrace Level 205',
    level: 'terrace',
    rows: generateRows(1, 24, 22, 16, 25),
    sunExposure: {
      morning: 18,
      afternoon: 42,
      evening: 68
    },
    covered: true
    vertices3D: [
      { x: 15, y: 110, z: 22 },
      { x: 35, y: 115, z: 22 },
      { x: 35, y: 145, z: 40 },
      { x: 15, y: 140, z: 40 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  // ========== UPPER DECK ==========
  {
    id: 'upper-deck-301',
    name: 'Upper Deck 301',
    level: 'upper',
    rows: generateRows(1, 30, 38, 18, 28),
    sunExposure: {
      morning: 25,
      afternoon: 50,
      evening: 75
    },
    covered: false
    vertices3D: [
      { x: -30, y: 130, z: 38 },
      { x: -10, y: 130, z: 38 },
      { x: -8, y: 185, z: 75 },
      { x: -28, y: 185, z: 75 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  // ========== CLUB SUITES ==========
  {
    id: 'club-suites',
    name: 'Club Suites',
    level: 'suite',
    rows: generateRows(1, 1, 26, 0, 0),
    sunExposure: {
      morning: 8,
      afternoon: 25,
      evening: 45
    },
    covered: true
    vertices3D: [
      { x: -40, y: 105, z: 26 },
      { x: 40, y: 105, z: 26 },
      { x: 40, y: 125, z: 26 },
      { x: -40, y: 125, z: 26 }
    ],
    accessibility: 5,
    viewQuality: 5
  },

  // ========== THE BEACH BLEACHERS ==========
  {
    id: 'beach-bleachers',
    name: 'Beach Bleachers',
    level: 'bleachers',
    rows: generateRows(1, 18, 6, 12, 24),
    sunExposure: {
      morning: 45,
      afternoon: 70,
      evening: 90
    },
    covered: false
    vertices3D: [
      { x: 60, y: 360, z: 6 },
      { x: 80, y: 350, z: 6 },
      { x: 80, y: 380, z: 22 },
      { x: 60, y: 390, z: 22 }
    ],
    accessibility: 3,
    viewQuality: 3
  },

  // ========== STANDING ROOM AREAS ==========
  {
    id: 'craft-pier-standing',
    name: 'Craft Pier Standing Room',
    level: 'standing',
    rows: [],
    sunExposure: {
      morning: 35,
      afternoon: 60,
      evening: 85
    },
    covered: false
    vertices3D: [
      { x: -60, y: 400, z: 10 },
      { x: -30, y: 410, z: 10 },
      { x: -30, y: 425, z: 10 },
      { x: -60, y: 415, z: 10 }
    ],
    accessibility: 4,
    viewQuality: 2
  },

  // ========== SANDLOT ==========
  {
    id: 'sandlot',
    name: 'The Sandlot',
    level: 'field',
    rows: [],
    sunExposure: {
      morning: 60,
      afternoon: 85,
      evening: 95
    },
    covered: false
    vertices3D: [
      { x: -10, y: 470, z: 3 },
      { x: 10, y: 470, z: 3 },
      { x: 10, y: 490, z: 3 },
      { x: -10, y: 490, z: 3 }
    ],
    accessibility: 5,
    viewQuality: 2
  },

  // ========== ENTERTAINMENT SUITE (Western Metal) ==========
  {
    id: 'entertainment-suite',
    name: 'Entertainment Suite',
    level: 'metal',
    rows: generateRows(1, 1, 35, 0, 0),
    sunExposure: {
      morning: 20,
      afternoon: 45,
      evening: 70
    },
    covered: true
    vertices3D: [
      { x: -100, y: 334, z: 35 },
      { x: -82, y: 348, z: 35 },
      { x: -82, y: 362, z: 35 },
      { x: -100, y: 348, z: 35 }
    ],
    accessibility: 5,
    viewQuality: 5
  }
];