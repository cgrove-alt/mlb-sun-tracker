import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium';

// Helper function to generate rows with consistent numbering
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

export const wrigleyFieldSections: DetailedSection[] = [
  // Behind Home Plate Box
  {
    id: 'field-box-home',
    name: 'Field Box - Home Plate',
    category: 'premium',
    capacity: 420,
    type: 'fixed',
    elevation: 3,
    rows: generateRows(1, 14, 3, 10, 28),
    covered: false
    sunExposure: {
      morning: 25,
      afternoon: 80,
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
      { x: -25, y: 0, z: 3 },
      { x: 25, y: 0, z: 3 },
      { x: 25, y: 22, z: 9 },
      { x: -25, y: 22, z: 9 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Field Box - First Base
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    category: 'premium',
    capacity: 480,
    type: 'fixed',
    elevation: 3,
    rows: generateRows(1, 16, 3, 12, 29),
    covered: false
    sunExposure: {
      morning: 35,
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
      'Close to Cubs dugout'
    ],
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: 25, y: 0, z: 3 },
      { x: 55, y: 30, z: 3 },
      { x: 55, y: 52, z: 10 },
      { x: 25, y: 22, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Field Box - Third Base
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    category: 'premium',
    capacity: 480,
    type: 'fixed',
    elevation: 3,
    rows: generateRows(1, 16, 3, 12, 29),
    covered: false
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
      'Close to visitor dugout'
    ],
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -25, y: 0, z: 3 },
      { x: -55, y: 30, z: 3 },
      { x: -55, y: 52, z: 10 },
      { x: -25, y: 22, z: 10 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Terrace Box - First Base
  {
    id: 'terrace-box-1b',
    name: 'Terrace Box - First Base',
    category: 'standard',
    capacity: 540,
    type: 'fixed',
    elevation: 8,
    rows: generateRows(1, 18, 8, 16, 31),
    covered: false
    sunExposure: {
      morning: 40,
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
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: 55, y: 30, z: 8 },
      { x: 75, y: 50, z: 8 },
      { x: 75, y: 72, z: 15 },
      { x: 55, y: 52, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Terrace Box - Third Base
  {
    id: 'terrace-box-3b',
    name: 'Terrace Box - Third Base',
    category: 'standard',
    capacity: 540,
    type: 'fixed',
    elevation: 8,
    rows: generateRows(1, 18, 8, 16, 31),
    covered: false
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
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -55, y: 30, z: 8 },
      { x: -75, y: 50, z: 8 },
      { x: -75, y: 72, z: 15 },
      { x: -55, y: 52, z: 15 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Bleachers - Left Field
  {
    id: 'bleachers-lf',
    name: 'Left Field Bleachers',
    category: 'value',
    capacity: 720,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 22, 6, 20, 30),
    covered: false
    sunExposure: {
      morning: 85,
      afternoon: 35,
      evening: 20
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Bleacher seating',
      'Party atmosphere',
      'Budget friendly'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -75, y: 50, z: 6 },
      { x: -95, y: 70, z: 6 },
      { x: -95, y: 92, z: 13 },
      { x: -75, y: 72, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Bleachers - Center Field
  {
    id: 'bleachers-cf',
    name: 'Center Field Bleachers',
    category: 'value',
    capacity: 680,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 20, 6, 18, 30),
    covered: false
    sunExposure: {
      morning: 65,
      afternoon: 85,
      evening: 50
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'distant'
    },
    amenities: [
      'Bleacher seating',
      'Scoreboard view',
      'Social atmosphere'
    ],
    visibilityRating: 3,
    proximityToAction: 1,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -95, y: 70, z: 6 },
      { x: -40, y: 100, z: 6 },
      { x: -40, y: 118, z: 12 },
      { x: -95, y: 92, z: 12 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Bleachers - Right Field
  {
    id: 'bleachers-rf',
    name: 'Right Field Bleachers',
    category: 'value',
    capacity: 720,
    type: 'fixed',
    elevation: 6,
    rows: generateRows(1, 22, 6, 20, 30),
    covered: false
    sunExposure: {
      morning: 30,
      afternoon: 100,
      evening: 60
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Bleacher seating',
      'Party atmosphere',
      'Budget friendly'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: 75, y: 50, z: 6 },
      { x: 95, y: 70, z: 6 },
      { x: 95, y: 92, z: 13 },
      { x: 75, y: 72, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Upper Deck Box - Home Plate
  {
    id: 'upper-box-home',
    name: 'Upper Box - Home Plate',
    category: 'standard',
    capacity: 640,
    type: 'fixed',
    elevation: 20,
    rows: generateRows(1, 20, 20, 18, 33),
    covered: true
    coveragePercentage: 90,
    coveredRows: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    sunExposure: {
      morning: 5,
      afternoon: 15,
      evening: 5
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'distant'
    },
    amenities: [
      'Covered seating',
      'Standard seats',
      'Protected from elements'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -35, y: 45, z: 20 },
      { x: 35, y: 45, z: 20 },
      { x: 35, y: 65, z: 27 },
      { x: -35, y: 65, z: 27 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Upper Deck Reserved - First Base
  {
    id: 'upper-reserved-1b',
    name: 'Upper Reserved - First Base',
    category: 'value',
    capacity: 580,
    type: 'fixed',
    elevation: 20,
    rows: generateRows(1, 18, 20, 16, 33),
    covered: true
    coveragePercentage: 70,
    coveredRows: ['10', '11', '12', '13', '14', '15', '16', '17', '18'],
    sunExposure: {
      morning: 15,
      afternoon: 30,
      evening: 10
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Partial coverage',
      'Budget seating'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: 35, y: 45, z: 20 },
      { x: 65, y: 65, z: 20 },
      { x: 65, y: 83, z: 26 },
      { x: 35, y: 65, z: 26 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Upper Deck Reserved - Third Base
  {
    id: 'upper-reserved-3b',
    name: 'Upper Reserved - Third Base',
    category: 'value',
    capacity: 580,
    type: 'fixed',
    elevation: 20,
    rows: generateRows(1, 18, 20, 16, 33),
    covered: true
    coveragePercentage: 70,
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
      'Budget seating'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 3,
    restroomProximity: 3,
    vertices3D: [
      { x: -35, y: 45, z: 20 },
      { x: -65, y: 65, z: 20 },
      { x: -65, y: 83, z: 26 },
      { x: -35, y: 65, z: 26 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Catalina Club
  {
    id: 'catalina-club',
    name: 'Catalina Club',
    category: 'luxury',
    capacity: 320,
    type: 'club',
    elevation: 24,
    rows: generateRows(1, 6, 24, 10, 25),
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
      'All-inclusive dining',
      'Premium bar',
      'Padded seats',
      'Private entrance'
    ],
    visibilityRating: 5,
    proximityToAction: 3,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -40, y: 52, z: 24 },
      { x: 40, y: 52, z: 24 },
      { x: 40, y: 64, z: 27 },
      { x: -40, y: 64, z: 27 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // American Airlines 1914 Club
  {
    id: 'aa-1914-club',
    name: 'American Airlines 1914 Club',
    category: 'luxury',
    capacity: 280,
    type: 'club',
    elevation: 15,
    rows: generateRows(1, 5, 15, 10, 24),
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
      'Field level club',
      'All-inclusive dining',
      'Premium location',
      'Historical memorabilia'
    ],
    visibilityRating: 5,
    proximityToAction: 4,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: -20, y: 10, z: 15 },
      { x: 20, y: 10, z: 15 },
      { x: 20, y: 22, z: 18 },
      { x: -20, y: 22, z: 18 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // W Club
  {
    id: 'w-club',
    name: 'W Club',
    category: 'luxury',
    capacity: 240,
    type: 'club',
    elevation: 18,
    rows: generateRows(1, 4, 18, 8, 24),
    covered: true
    coveragePercentage: 100,
    sunExposure: {
      morning: 0,
      afternoon: 0,
      evening: 0
    },
    teamAreas: {
      dugout: 'adjacent',
      bullpen: 'visible'
    },
    amenities: [
      'Exclusive club',
      'All-inclusive dining',
      'Championship displays',
      'Private entrance'
    ],
    visibilityRating: 5,
    proximityToAction: 4,
    concessionProximity: 5,
    restroomProximity: 5,
    vertices3D: [
      { x: 25, y: 8, z: 18 },
      { x: 45, y: 28, z: 18 },
      { x: 45, y: 37, z: 21 },
      { x: 25, y: 17, z: 21 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Maker's Mark Barrel Room
  {
    id: 'makers-mark-barrel',
    name: "Maker's Mark Barrel Room",
    category: 'special',
    capacity: 150,
    type: 'flexible',
    elevation: 12,
    rows: generateRows(1, 3, 12, 8, 25),
    covered: false
    sunExposure: {
      morning: 75,
      afternoon: 40,
      evening: 25
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Bourbon bar',
      'Standing room',
      'Unique atmosphere'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: -80, y: 60, z: 12 },
      { x: -65, y: 75, z: 12 },
      { x: -65, y: 83, z: 14 },
      { x: -80, y: 68, z: 14 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Budweiser Bleachers
  {
    id: 'budweiser-bleachers',
    name: 'Budweiser Bleachers',
    category: 'special',
    capacity: 380,
    type: 'flexible',
    elevation: 10,
    rows: generateRows(1, 10, 10, 12, 28),
    covered: false
    sunExposure: {
      morning: 40,
      afternoon: 95,
      evening: 55
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'adjacent'
    },
    amenities: [
      'Party deck',
      'Bar service',
      'Social atmosphere'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: 40, y: 100, z: 10 },
      { x: 95, y: 70, z: 10 },
      { x: 95, y: 80, z: 13 },
      { x: 40, y: 110, z: 13 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Gallagher Way Standing Room
  {
    id: 'gallagher-way-sro',
    name: 'Gallagher Way Standing Room',
    category: 'standing',
    capacity: 600,
    type: 'standing',
    elevation: 8,
    rows: [],
    covered: false
    sunExposure: {
      morning: 50,
      afternoon: 85,
      evening: 60
    },
    teamAreas: {
      dugout: 'distant',
      bullpen: 'distant'
    },
    amenities: [
      'Video board view',
      'Food trucks',
      'Entertainment plaza'
    ],
    visibilityRating: 2,
    proximityToAction: 1,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: -60, y: 110, z: 8 },
      { x: 60, y: 110, z: 8 },
      { x: 60, y: 125, z: 8 },
      { x: -60, y: 125, z: 8 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Sloan Park at Wrigley
  {
    id: 'sloan-park',
    name: 'Sloan Park at Wrigley',
    category: 'special',
    capacity: 220,
    type: 'flexible',
    elevation: 14,
    rows: generateRows(1, 6, 14, 10, 26),
    covered: false
    sunExposure: {
      morning: 30,
      afternoon: 90,
      evening: 50
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'adjacent'
    },
    amenities: [
      'Rooftop-style seating',
      'All-inclusive food',
      'Bar service'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: 80, y: 55, z: 14 },
      { x: 95, y: 70, z: 14 },
      { x: 95, y: 80, z: 17 },
      { x: 80, y: 65, z: 17 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Park at Wrigley
  {
    id: 'park-at-wrigley',
    name: 'Park at Wrigley',
    category: 'special',
    capacity: 200,
    type: 'flexible',
    elevation: 16,
    rows: generateRows(1, 5, 16, 10, 26),
    covered: false
    sunExposure: {
      morning: 70,
      afternoon: 35,
      evening: 20
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'adjacent'
    },
    amenities: [
      'Picnic area',
      'Group seating',
      'All-inclusive food'
    ],
    visibilityRating: 3,
    proximityToAction: 2,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: -80, y: 55, z: 16 },
      { x: -95, y: 70, z: 16 },
      { x: -95, y: 80, z: 19 },
      { x: -80, y: 65, z: 19 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Wintrust Scout Seats
  {
    id: 'wintrust-scout',
    name: 'Wintrust Scout Seats',
    category: 'premium',
    capacity: 160,
    type: 'fixed',
    elevation: 2,
    rows: generateRows(1, 4, 2, 6, 22),
    covered: false
    sunExposure: {
      morning: 20,
      afternoon: 85,
      evening: 45
    },
    teamAreas: {
      dugout: 'below',
      bullpen: 'distant'
    },
    amenities: [
      'Behind home plate',
      'Scout perspective',
      'Padded seats',
      'In-seat service'
    ],
    visibilityRating: 5,
    proximityToAction: 5,
    concessionProximity: 5,
    restroomProximity: 4,
    vertices3D: [
      { x: -15, y: -2, z: 2 },
      { x: 15, y: -2, z: 2 },
      { x: 15, y: 6, z: 4 },
      { x: -15, y: 6, z: 4 }
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
    category: 'media',
    capacity: 80,
    type: 'media',
    elevation: 28,
    rows: generateRows(1, 3, 28, 6, 20),
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
      { x: -20, y: 55, z: 28 },
      { x: 20, y: 55, z: 28 },
      { x: 20, y: 62, z: 30 },
      { x: -20, y: 62, z: 30 }
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
    capacity: 400,
    type: 'suite',
    elevation: 22,
    rows: generateRows(1, 2, 22, 8, 22),
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
      { x: -45, y: 48, z: 22 },
      { x: 45, y: 48, z: 22 },
      { x: 45, y: 58, z: 25 },
      { x: -45, y: 58, z: 25 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Terrace Reserved
  {
    id: 'terrace-reserved',
    name: 'Terrace Reserved',
    category: 'standard',
    capacity: 460,
    type: 'fixed',
    elevation: 12,
    rows: generateRows(1, 14, 12, 14, 30),
    covered: false
    sunExposure: {
      morning: 50,
      afternoon: 75,
      evening: 40
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'visible'
    },
    amenities: [
      'Reserved seating',
      'Standard seats'
    ],
    visibilityRating: 3,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -50, y: 35, z: 12 },
      { x: 50, y: 35, z: 12 },
      { x: 50, y: 50, z: 17 },
      { x: -50, y: 50, z: 17 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },

  // Family Section
  {
    id: 'family-section',
    name: 'Family Section',
    category: 'special',
    capacity: 320,
    type: 'fixed',
    elevation: 10,
    rows: generateRows(1, 10, 10, 12, 29),
    covered: false
    sunExposure: {
      morning: 60,
      afternoon: 70,
      evening: 35
    },
    teamAreas: {
      dugout: 'visible',
      bullpen: 'distant'
    },
    amenities: [
      'Alcohol-free zone',
      'Family friendly',
      'Kid activities nearby'
    ],
    visibilityRating: 4,
    proximityToAction: 3,
    concessionProximity: 4,
    restroomProximity: 4,
    vertices3D: [
      { x: -55, y: 40, z: 10 },
      { x: -35, y: 50, z: 10 },
      { x: -35, y: 63, z: 14 },
      { x: -55, y: 53, z: 14 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  }
];

// Stadium configuration
export const wrigleyFieldConfig = {
  stadiumName: 'Wrigley Field',
  team: 'Chicago Cubs',
  location: 'Chicago, Illinois',
  capacity: 41649,
  yearBuilt: 1914,
  orientation: 140, // Southeast facing
  dimensions: {
    leftField: 355,
    leftCenter: 368,
    center: 400,
    rightCenter: 368,
    rightField: 353,
    ivyWallHeight: 11.5
  },
  sunExposureNotes: {
    morning: 'Sun rises over left field, third base side gets early shade',
    afternoon: 'Sun high overhead, bleachers get maximum exposure',
    evening: 'Sun sets behind first base, right field gets shade first'
  },
  accessibilityFeatures: [
    'Elevator access to all levels',
    'Accessible seating throughout',
    'Accessible parking nearby',
    'Assistive listening devices available'
  ]
};