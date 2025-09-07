import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium';

// Helper function to generate rows with consistent numbering
const generateRows = (
  startRow: number,
  endRow: number,
  elevation: number,
  depth: number,
  rakeAngle: number = 28
): RowDetail[] => {
  return Array.from({ length: endRow - startRow + 1 }, (_, i) => ({
    row: `${startRow + i}`,
    elevation: elevation + (i * 0.5),
    depth: depth - (i * 0.3),
    rakeAngle
  });
};

export const georgeSteinbrennerFieldSections: DetailedSection[] = [
  // Premium Home Plate Seats
  {
    id: 'field-boxes-home',
    name: 'Field Boxes - Home Plate',
    category: 'premium',
    capacity: 280,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 8, 4, 10, 25),
    covered: false,
    sunExposure: {
      morning: 20,
      afternoon: 85,
      evening: 40
    },
    teamAreas: {
      dugout: 'below',
      bullpen: 'distant'
    },
    amenities: [
      'Padded seats',
      'Cup holders',
      'In-seat service',
      'Extra legroom'
    ],
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -20, y: 0, z: 4 },
      { x: 20, y: 0, z: 4 },
      { x: 20, y: 15, z: 8 },
      { x: -20, y: 15, z: 8 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // First Base Field Boxes
  {
    id: 'field-boxes-1b',
    name: 'Field Boxes - First Base',
    category: 'premium',
    capacity: 320,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 10, 4, 12, 26),
    covered: false,
    sunExposure: {
      morning: 30,
      afternoon: 90,
      evening: 45
    },
    teamAreas: {
      dugout: 'adjacent',
      bullpen: 'visible'
    },
    amenities: [
      'Padded seats',
      'Cup holders',
      'Close to action'
    ],
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: 20, y: 0, z: 4 },
      { x: 50, y: 30, z: 4 },
      { x: 50, y: 45, z: 8 },
      { x: 20, y: 15, z: 8 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Third Base Field Boxes
  {
    id: 'field-boxes-3b',
    name: 'Field Boxes - Third Base',
    category: 'premium',
    capacity: 320,
    type: 'fixed',
    elevation: 4,
    rows: generateRows(1, 10, 4, 12, 26),
    covered: false,
    sunExposure: {
      morning: 70,
      afternoon: 50,
      evening: 35
    },
    teamAreas: {
      dugout: 'adjacent',
      bullpen: 'visible'
    },
    amenities: [
      'Padded seats',
      'Cup holders',
      'Close to action'
    ],
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -20, y: 0, z: 4 },
      { x: -50, y: 30, z: 4 },
      { x: -50, y: 45, z: 8 },
      { x: -20, y: 15, z: 8 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Baseline Box Seats - First Base
  {
    id: 'baseline-boxes-1b',
    name: 'Baseline Boxes - First Base',
    category: 'standard',
    capacity: 420,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 12, 6, 14, 27),
    covered: false,
    sunExposure: {
      morning: 35,
      afternoon: 95,
      evening: 50
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Standard seats',
      'Cup holders'
    ],
    visibilityRating: 4,
    proximityToAction: 4,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: 50, y: 30, z: 6 },
      { x: 70, y: 50, z: 6 },
      { x: 70, y: 65, z: 10 },
      { x: 50, y: 45, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Baseline Box Seats - Third Base
  {
    id: 'baseline-boxes-3b',
    name: 'Baseline Boxes - Third Base',
    category: 'standard',
    capacity: 420,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 12, 6, 14, 27),
    covered: false,
    sunExposure: {
      morning: 75,
      afternoon: 45,
      evening: 30
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Standard seats',
      'Cup holders'
    ],
    visibilityRating: 4,
    proximityToAction: 4,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -50, y: 30, z: 6 },
      { x: -70, y: 50, z: 6 },
      { x: -70, y: 65, z: 10 },
      { x: -50, y: 45, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Reserved Grandstand - Behind Home
  {
    id: 'grandstand-home',
    name: 'Reserved Grandstand - Home',
    category: 'standard',
    capacity: 580,
    type: 'fixed',
    elevation: 10,
    rows: generateRows(1, 16, 10, 18, 30),
    covered: true
    coveragePercentage: 100,
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'distant'
    },
    amenities: [
      'Covered seating',
      'Standard seats',
      'Shade all day'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -25, y: 15, z: 10 },
      { x: 25, y: 15, z: 10 },
      { x: 25, y: 35, z: 16 },
      { x: -25, y: 35, z: 16 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Reserved Grandstand - First Base
  {
    id: 'grandstand-1b',
    name: 'Reserved Grandstand - First Base',
    category: 'standard',
    capacity: 640,
    type: 'fixed',
    elevation: 10,
    rows: generateRows(1, 18, 10, 20, 30),
    covered: true
    coveragePercentage: 80,
    coveredRows: ['10', '11', '12', '13', '14', '15', '16', '17', '18'],
    sunExposure: {
      morning: 15,
      afternoon: 25,
      evening: 10
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Partial coverage',
      'Standard seats'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: 25, y: 15, z: 10 },
      { x: 55, y: 45, z: 10 },
      { x: 55, y: 65, z: 16 },
      { x: 25, y: 35, z: 16 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Reserved Grandstand - Third Base
  {
    id: 'grandstand-3b',
    name: 'Reserved Grandstand - Third Base',
    category: 'standard',
    capacity: 640,
    type: 'fixed',
    elevation: 10,
    rows: generateRows(1, 18, 10, 20, 30),
    covered: true
    coveragePercentage: 80,
    coveredRows: ['10', '11', '12', '13', '14', '15', '16', '17', '18'],
    sunExposure: {
      morning: 20,
      afternoon: 15,
      evening: 10
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Partial coverage',
      'Standard seats'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -25, y: 15, z: 10 },
      { x: -55, y: 45, z: 10 },
      { x: -55, y: 65, z: 16 },
      { x: -25, y: 35, z: 16 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Left Field Reserved
  {
    id: 'left-field-reserved',
    name: 'Left Field Reserved',
    category: 'value',
    capacity: 480,
    type: 'fixed',
    elevation: 8,
    rows: generateRows(1, 14, 8, 16, 28),
    covered: false,
    sunExposure: {
      morning: 80,
      afternoon: 40,
      evening: 25
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Standard seats',
      'Outfield view'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -70, y: 50, z: 8 },
      { x: -85, y: 65, z: 8 },
      { x: -85, y: 80, z: 12 },
      { x: -70, y: 65, z: 12 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Right Field Reserved
  {
    id: 'right-field-reserved',
    name: 'Right Field Reserved',
    category: 'value',
    capacity: 480,
    type: 'fixed',
    elevation: 8,
    rows: generateRows(1, 14, 8, 16, 28),
    covered: false,
    sunExposure: {
      morning: 40,
      afternoon: 100,
      evening: 55
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Standard seats',
      'Outfield view'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: 70, y: 50, z: 8 },
      { x: 85, y: 65, z: 8 },
      { x: 85, y: 80, z: 12 },
      { x: 70, y: 65, z: 12 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Outfield Bleachers - Left
  {
    id: 'bleachers-left',
    name: 'Outfield Bleachers - Left',
    category: 'value',
    capacity: 420,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 12, 6, 14, 26),
    covered: false,
    sunExposure: {
      morning: 85,
      afternoon: 35,
      evening: 20
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'visible'
    },
    amenities: [
      'Bleacher seating',
      'Budget friendly'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -85, y: 65, z: 6 },
      { x: -95, y: 75, z: 6 },
      { x: -95, y: 88, z: 10 },
      { x: -85, y: 80, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Outfield Bleachers - Center
  {
    id: 'bleachers-center',
    name: 'Outfield Bleachers - Center',
    category: 'value',
    capacity: 380,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 10, 6, 12, 26),
    covered: false,
    sunExposure: {
      morning: 60,
      afternoon: 70,
      evening: 40
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'distant'
    },
    amenities: [
      'Bleacher seating',
      'Batter\'s eye view'
    ],
    visibilityRating: 3,
    proximityToAction: 1,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -95, y: 75, z: 6 },
      { x: -40, y: 95, z: 6 },
      { x: -40, y: 105, z: 9 },
      { x: -95, y: 88, z: 9 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Outfield Bleachers - Right
  {
    id: 'bleachers-right',
    name: 'Outfield Bleachers - Right',
    category: 'value',
    capacity: 420,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 12, 6, 14, 26),
    covered: false,
    sunExposure: {
      morning: 35,
      afternoon: 100,
      evening: 60
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'visible'
    },
    amenities: [
      'Bleacher seating',
      'Budget friendly'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: 85, y: 65, z: 6 },
      { x: 95, y: 75, z: 6 },
      { x: 95, y: 88, z: 10 },
      { x: 85, y: 80, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Batter's Eye Deck
  {
    id: 'batters-eye-deck',
    name: "Batter's Eye Deck",
    category: 'special',
    capacity: 180,
    type: 'flexible',
    elevation: 8,
    rows: generateRows(1, 6, 8, 10, 25),
    covered: false,
    sunExposure: {
      morning: 50,
      afternoon: 80,
      evening: 45
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'distant'
    },
    amenities: [
      'Standing room',
      'Drink rails',
      'Social area'
    ],
    visibilityRating: 3,
    proximityToAction: 1,
    concessionProximity: 4,
    restroomProximity: 3,
    vertices3D: [
      { x: -40, y: 95, z: 8 },
      { x: 40, y: 95, z: 8 },
      { x: 40, y: 105, z: 10 },
      { x: -40, y: 105, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Right Field Pavilion
  {
    id: 'right-field-pavilion',
    name: 'Right Field Pavilion',
    category: 'special',
    capacity: 240,
    type: 'flexible',
    elevation: 7,
    rows: generateRows(1, 8, 7, 12, 26),
    covered: false,
    sunExposure: {
      morning: 30,
      afternoon: 100,
      evening: 65
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Group seating',
      'Picnic tables',
      'Party deck'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    vertices3D: [
      { x: 95, y: 75, z: 7 },
      { x: 40, y: 95, z: 7 },
      { x: 40, y: 105, z: 10 },
      { x: 95, y: 88, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Luxury Suites
  {
    id: 'luxury-suites',
    name: 'Luxury Suites',
    category: 'luxury',
    capacity: 160,
    type: 'suite',
    elevation: 20,
    rows: generateRows(1, 2, 20, 8, 22),
    covered: true
    coveragePercentage: 100,
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Climate controlled',
      'Private restroom',
      'Catering service',
      'Premium parking',
      'Indoor/outdoor seating'
    ],
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -30, y: 25, z: 20 },
      { x: 30, y: 25, z: 20 },
      { x: 30, y: 35, z: 22 },
      { x: -30, y: 35, z: 22 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Press Box Level
  {
    id: 'press-box',
    name: 'Press Box',
    category: 'special',
    capacity: 60,
    type: 'media',
    elevation: 25,
    rows: generateRows(1, 3, 25, 6, 20),
    covered: true
    coveragePercentage: 100,
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Media facilities',
      'High-speed internet',
      'Power outlets',
      'Work stations'
    ],
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -15, y: 30, z: 25 },
      { x: 15, y: 30, z: 25 },
      { x: 15, y: 36, z: 27 },
      { x: -15, y: 36, z: 27 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Party Deck - First Base
  {
    id: 'party-deck-1b',
    name: 'Party Deck - First Base',
    category: 'special',
    capacity: 200,
    type: 'flexible',
    elevation: 12,
    rows: generateRows(1, 4, 12, 8, 24),
    covered: false,
    sunExposure: {
      morning: 25,
      afternoon: 95,
      evening: 50
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Standing room',
      'High-top tables',
      'Group friendly',
      'Bar service'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: 55, y: 45, z: 12 },
      { x: 70, y: 60, z: 12 },
      { x: 70, y: 68, z: 14 },
      { x: 55, y: 53, z: 14 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Party Deck - Third Base
  {
    id: 'party-deck-3b',
    name: 'Party Deck - Third Base',
    category: 'special',
    capacity: 200,
    type: 'flexible',
    elevation: 12,
    rows: generateRows(1, 4, 12, 8, 24),
    covered: false,
    sunExposure: {
      morning: 75,
      afternoon: 35,
      evening: 25
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Standing room',
      'High-top tables',
      'Group friendly',
      'Bar service'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: -55, y: 45, z: 12 },
      { x: -70, y: 60, z: 12 },
      { x: -70, y: 68, z: 14 },
      { x: -55, y: 53, z: 14 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Wheelchair Accessible - Main Level
  {
    id: 'wheelchair-main',
    name: 'Wheelchair Accessible - Main Level',
    category: 'accessible',
    capacity: 40,
    type: 'accessible',
    elevation: 8,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
      { row: 'WC', elevation: 8, depth: 6, rakeAngle: 0 }
    ],
    covered: false,
    sunExposure: {
      morning: 50,
      afternoon: 70,
      evening: 40
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Level access',
      'Companion seating',
      'Accessible restrooms',
      'Wide concourses'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -40, y: 20, z: 8 },
      { x: 40, y: 20, z: 8 },
      { x: 40, y: 26, z: 8 },
      { x: -40, y: 26, z: 8 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Standing Room Only
  {
    id: 'standing-room',
    name: 'Standing Room Only',
    category: 'standing',
    capacity: 300,
    type: 'standing',
    elevation: 14,
    rows: [],
    covered: false,
    sunExposure: {
      morning: 45,
      afternoon: 75,
      evening: 45
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Drink rails',
      'Various locations',
      'First-come basis'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 3,
    vertices3D: [
      { x: -60, y: 40, z: 14 },
      { x: 60, y: 40, z: 14 },
      { x: 60, y: 46, z: 14 },
      { x: -60, y: 46, z: 14 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Seminole Hard Rock Cabanas
  {
    id: 'hard-rock-cabanas',
    name: 'Seminole Hard Rock Cabanas',
    category: 'luxury',
    capacity: 120,
    type: 'flexible',
    elevation: 15,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    covered: true
    sunExposure: {
      morning: 20,
      afternoon: 30,
      evening: 25
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Private lounge area',
      'Cocktail service',
      'Wide variety of food options',
      'Premium seating',
      'Private cabana space'
    ],
    visibilityRating: 5,
    proximityToAction: 4,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: 85, y: 15, z: 120 },
      { x: 115, y: 15, z: 140 },
      { x: 115, y: 25, z: 150 },
      { x: 85, y: 25, z: 130 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Bullpen Club Rooftop Deck
  {
    id: 'bullpen-rooftop',
    name: 'Bullpen Club Rooftop Deck',
    category: 'premium',
    capacity: 200,
    type: 'flexible',
    elevation: 25,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    covered: true
    sunExposure: {
      morning: 30,
      afternoon: 40,
      evening: 35
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'adjacent'
    },
    amenities: [
      'All-inclusive food and beverage',
      '3-hour buffet',
      'Large bar',
      'Elevator access',
      '7 HD TVs',
      'Overhead shade',
      'High-top tables',
      'Social sitting areas'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: 90, y: 25, z: 80 },
      { x: 120, y: 25, z: 100 },
      { x: 120, y: 35, z: 110 },
      { x: 90, y: 35, z: 90 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  }
];

// Stadium configuration
export const georgeSteinbrennerFieldConfig = {
  stadiumName: 'George M. Steinbrenner Field',
  team: 'Tampa Bay Rays (2025 Temporary Home)',
  location: 'Tampa, Florida',
  capacity: 11026,
  yearBuilt: 1996,
  renovated: 2024,
  orientation: 35, // Northeast facing
  dimensions: {
    leftField: 318,
    leftCenter: 385,
    center: 408,
    rightCenter: 385,
    rightField: 314
  },
  sunExposureNotes: {
    morning: 'Sun rises over right field, affecting first base side',
    afternoon: 'Sun high overhead, maximum exposure in outfield bleachers',
    evening: 'Sun sets behind third base, left field gets shade first'
  },
  accessibilityFeatures: [
    'Elevator access to all levels',
    'Accessible seating throughout',
    'Accessible parking adjacent to stadium',
    'Wide concourses for navigation'
  ]
};