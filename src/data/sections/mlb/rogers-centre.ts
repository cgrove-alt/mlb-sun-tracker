import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Rogers Centre - Toronto Blue Jays
// Opened: 1989
// Capacity: 49,282
// Orientation: 15° (Home plate to center field)
// Features: Retractable roof, Hotel windows in outfield, CN Tower views

const generateRows = (startRow: string, endRow: string, seatsPerRow: number, startElevation: number, depthPerRow: number, rakeAngle: number = 12): RowDetail[] => {
  const rows: RowDetail[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG'];
  
  const startIdx = rowLetters.indexOf(startRow);
  const endIdx = rowLetters.indexOf(endRow);
  
  for (let i = startIdx; i <= endIdx; i++) {
    const rowNum = i - startIdx;
    const verticalRise = Math.sin(rakeAngle * Math.PI / 180) * depthPerRow * rowNum;
    
    rows.push({
      rowNumber: rowLetters[i],
      seats: seatsPerRow - Math.floor(rowNum * 0.3), // Slight reduction in upper rows
      elevation: startElevation + verticalRise,
      depth: rowNum * depthPerRow,
      covered: true // All sections covered when roof is closed
    });
  }
  
  return rows;
};

export const rogersCentreSections: DetailedSection[] = [
  // Premium Dugout - Behind Home Plate
  {
    id: 'premium-dugout',
    name: 'Premium Dugout',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'R', 25, 2, 2.5, 10),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 45, z: 55 },
      { x: -35, y: 45, z: 55 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Field Level Infield - First Base
  {
    id: 'field-level-1b',
    name: 'Field Level - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'W', 23, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 120, y: 2, z: 30 },
      { x: 125, y: 57.5, z: 85.5 },
      { x: 35, y: 57.5, z: 65.5 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Field Level Infield - Third Base
  {
    id: 'field-level-3b',
    name: 'Field Level - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'W', 23, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -120, y: 2, z: 30 },
      { x: -125, y: 57.5, z: 85.5 },
      { x: -35, y: 57.5, z: 65.5 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // TD Comfort Club
  {
    id: 'td-comfort-club',
    name: 'TD Comfort Club',
    level: 'club',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'M', 28, 75, 3, 12),
    vertices3D: [
      { x: 40, y: 75, z: 70 },
      { x: 130, y: 75, z: 95 },
      { x: 135, y: 114, z: 134 },
      { x: 45, y: 114, z: 109 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // 100 Level - Behind Home
  {
    id: '100-level-home',
    name: '100 Level - Home Plate',
    level: '100',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'U', 24, 60, 3, 13),
    vertices3D: [
      { x: -40, y: 60, z: 60 },
      { x: 40, y: 60, z: 60 },
      { x: 45, y: 123, z: 123 },
      { x: -45, y: 123, z: 123 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // 200 Level - First Base
  {
    id: '200-level-1b',
    name: '200 Level - First Base',
    level: '200',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 85, 3, 14),
    vertices3D: [
      { x: 45, y: 85, z: 80 },
      { x: 135, y: 85, z: 105 },
      { x: 140, y: 166, z: 186 },
      { x: 50, y: 166, z: 161 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // 200 Level - Third Base
  {
    id: '200-level-3b',
    name: '200 Level - Third Base',
    level: '200',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'X', 26, 85, 3, 14),
    vertices3D: [
      { x: -45, y: 85, z: 80 },
      { x: -135, y: 85, z: 105 },
      { x: -140, y: 166, z: 186 },
      { x: -50, y: 166, z: 161 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Renaissance Hotel Windows
  {
    id: 'renaissance-hotel',
    name: 'Renaissance Hotel Windows',
    level: 'Hotel',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -30, y: 100, z: 400 },
      { x: 30, y: 100, z: 400 },
      { x: 30, y: 120, z: 420 },
      { x: -30, y: 120, z: 420 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // 500 Level - Upper Deck Home
  {
    id: '500-level-home',
    name: '500 Level - Home Plate',
    level: '500',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'AA', 28, 170, 3.5, 18),
    vertices3D: [
      { x: -55, y: 170, z: 165 },
      { x: 55, y: 170, z: 165 },
      { x: 60, y: 275, z: 270 },
      { x: -60, y: 275, z: 270 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // 500 Level - First Base
  {
    id: '500-level-1b',
    name: '500 Level - First Base',
    level: '500',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'BB', 30, 170, 3.5, 19),
    vertices3D: [
      { x: 60, y: 170, z: 175 },
      { x: 150, y: 170, z: 210 },
      { x: 155, y: 282, z: 322 },
      { x: 65, y: 282, z: 287 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // 500 Level - Third Base
  {
    id: '500-level-3b',
    name: '500 Level - Third Base',
    level: '500',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'BB', 30, 170, 3.5, 19),
    vertices3D: [
      { x: -60, y: 170, z: 175 },
      { x: -150, y: 170, z: 210 },
      { x: -155, y: 282, z: 322 },
      { x: -65, y: 282, z: 287 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // WestJet Flight Deck
  {
    id: 'westjet-flight-deck',
    name: 'WestJet Flight Deck',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -40, y: 35, z: 380 },
      { x: 40, y: 35, z: 380 },
      { x: 40, y: 35, z: 410 },
      { x: -40, y: 35, z: 410 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Outfield District - Left Field
  {
    id: 'outfield-district-lf',
    name: 'Outfield District - Left',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'P', 22, 25, 2.5, 17),
    vertices3D: [
      { x: -145, y: 25, z: 280 },
      { x: -115, y: 25, z: 320 },
      { x: -120, y: 65, z: 360 },
      { x: -150, y: 65, z: 320 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Outfield District - Right Field
  {
    id: 'outfield-district-rf',
    name: 'Outfield District - Right',
    level: 'field',
    baseAngle: 90,
    angleSpan: 30,
    rows: generateRows('A', 'P', 22, 25, 2.5, 17),
    vertices3D: [
      { x: 145, y: 25, z: 280 },
      { x: 115, y: 25, z: 320 },
      { x: 120, y: 65, z: 360 },
      { x: 150, y: 65, z: 320 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Corona Rooftop Patio
  {
    id: 'corona-rooftop-patio',
    name: 'Corona Rooftop Patio',
    level: 'Rooftop',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: 80, y: 95, z: 350 },
      { x: 120, y: 95, z: 370 },
      { x: 120, y: 95, z: 390 },
      { x: 80, y: 95, z: 370 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Sportsnet Grill
  {
    id: 'sportsnet-grill',
    name: 'Sportsnet Grill',
    level: 'Restaurant',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -25, y: 40, z: 390 },
      { x: 25, y: 40, z: 390 },
      { x: 25, y: 40, z: 415 },
      { x: -25, y: 40, z: 415 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Suite Level
  {
    id: 'suite-level',
    name: 'Suite Level',
    level: 'suite',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -65, y: 110, z: 105 },
      { x: 65, y: 110, z: 105 },
      { x: 65, y: 120, z: 115 },
      { x: -65, y: 120, z: 115 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // CN Tower Club
  {
    id: 'cn-tower-club',
    name: 'CN Tower Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'L', 30, 90, 3, 13),
    vertices3D: [
      { x: -50, y: 90, z: 90 },
      { x: -140, y: 90, z: 115 },
      { x: -145, y: 129, z: 154 },
      { x: -55, y: 129, z: 129 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Action Zone (Kids Area)
  {
    id: 'action-zone',
    name: 'Action Zone',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -100, y: 20, z: 340 },
      { x: -70, y: 20, z: 355 },
      { x: -70, y: 20, z: 375 },
      { x: -100, y: 20, z: 360 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // WestJet Flight Deck
  {
    id: 'westjet-flight-deck',
    name: 'WestJet Flight Deck',
    level: 'upper',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: -30, y: 85, z: 400 },
      { x: 30, y: 85, z: 400 },
      { x: 35, y: 95, z: 410 },
      { x: -35, y: 95, z: 410 }
    ] as Vector3D[],
,
  
  // Corona Rooftop Patio
  {
    id: 'corona-rooftop',
    name: 'Corona Rooftop Patio',
    level: 'upper',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },

    ],
    vertices3D: [
      { x: 100, y: 90, z: 350 },
      { x: 130, y: 90, z: 370 },
      { x: 135, y: 100, z: 380 },
      { x: 105, y: 100, z: 360 }
    ] as Vector3D[],
,
  
  // TD Park Social
  {
    id: 'td-park-social',
    name: 'TD Park Social',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'H', 32, 65, 3, 28),
    vertices3D: [
      { x: -90, y: 65, z: 140 },
      { x: -70, y: 65, z: 160 },
      { x: -75, y: 89, z: 184 },
      { x: -95, y: 89, z: 164 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  },
  
  // Renaissance Hotel Windows
  {
    id: 'hotel-windows',
    name: 'Renaissance Hotel Windows',
    level: 'field',
    baseAngle: 135,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 20, depth: 0, covered: true },
    ],
    vertices3D: [
      { x: -40, y: 120, z: 420 },
      { x: 40, y: 120, z: 420 },
      { x: 40, y: 135, z: 435 },
      { x: -40, y: 135, z: 435 }
    ] as Vector3D[],
    covered: true,
    distance: 50,
    height: 20, 
    rake: 25,
    viewQuality: 'good'
  }
];

// Stadium features
export const rogersCentreFeatures = {
  retractableRoof: true,
  roofHeight: 180,
  roofMaterial: {
    opacity: 1.0, // Fully opaque when closed
    reflectivity: 0.35
  },
  climateControlled: true
};

// Export section map for easy lookup
export const rogersCentreSectionMap = new Map(
  rogersCentreSections.map(section => [section.id, section]));