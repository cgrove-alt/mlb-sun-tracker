// MiLB Stadium Section Data
// Stadium-specific section layouts for Minor League Baseball venues

import type { StadiumSection } from './stadiumSectionTypes';

export interface MiLBStadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}

// Helper function to generate standard MiLB sections with proper coverage
function generateMiLBSections(
  stadiumId: string,
  config: {
    fieldBoxCount?: number;
    lowerBoxCount?: number;
    upperDeckExists?: boolean;
    upperSections?: number;
    hasLawn?: boolean;
    hasBerm?: boolean;
    coveredSections?: string[];
  }
): StadiumSection[] {
  const sections: StadiumSection[] = [];
  const {
    fieldBoxCount = 8,
    lowerBoxCount = 12,
    upperDeckExists = false,
    upperSections = 8,
    hasLawn = false,
    hasBerm = false,
    coveredSections = []
  } = config;

  // Field Box sections (behind home plate and baselines)
  const fieldBoxAngleStep = 120 / fieldBoxCount; // Cover home plate to first/third base
  for (let i = 0; i < fieldBoxCount; i++) {
    const angle = 330 + (i * fieldBoxAngleStep);
    const normalizedAngle = angle >= 360 ? angle - 360 : angle;
    sections.push({
      id: `FB${i + 1}`,
      name: `Field Box ${i + 1}`,
      level: 'field',
      baseAngle: normalizedAngle,
      angleSpan: fieldBoxAngleStep,
      rows: 12,
      covered: coveredSections.includes(`FB${i + 1}`),
      price: 'premium'
    });
  }

  // Lower Box sections (main seating bowl)
  const lowerBoxAngleStep = 240 / lowerBoxCount; // Wider coverage including outfield
  for (let i = 0; i < lowerBoxCount; i++) {
    const angle = 300 + (i * lowerBoxAngleStep);
    const normalizedAngle = angle >= 360 ? angle - 360 : angle;
    sections.push({
      id: `LB${i + 1}`,
      name: `Lower Box ${i + 1}`,
      level: 'lower',
      baseAngle: normalizedAngle,
      angleSpan: lowerBoxAngleStep,
      rows: 20,
      covered: coveredSections.includes(`LB${i + 1}`),
      price: 'moderate'
    });
  }

  // Upper Deck sections (if exists)
  if (upperDeckExists) {
    const upperAngleStep = 180 / upperSections; // Usually behind home plate
    for (let i = 0; i < upperSections; i++) {
      const angle = 270 + (i * upperAngleStep);
      const normalizedAngle = angle >= 360 ? angle - 360 : angle;
      sections.push({
        id: `UD${i + 1}`,
        name: `Upper Deck ${i + 1}`,
        level: 'upper',
        baseAngle: normalizedAngle,
        angleSpan: upperAngleStep,
        rows: 15,
        covered: coveredSections.includes(`UD${i + 1}`) || true, // Upper deck usually covered
        price: 'value'
      });
    }
  }

  // Lawn/Berm sections (if exists)
  if (hasLawn || hasBerm) {
    sections.push({
      id: 'LAWN',
      name: hasBerm ? 'Berm' : 'Lawn',
      level: 'field',
      baseAngle: 180, // Center field
      angleSpan: 60,
      rows: 0, // General admission
      covered: false,
      price: 'value'
    });
  }

  return sections;
}

// Actual section data for top AAA stadiums
export const MILB_STADIUM_SECTIONS: MiLBStadiumSections[] = [
  // Buffalo Bisons - Sahlen Field
  {
    stadiumId: 'buffalo-bisons',
    sections: generateMiLBSections('buffalo-bisons', {
      fieldBoxCount: 10,
      lowerBoxCount: 16,
      upperDeckExists: true,
      upperSections: 10,
      coveredSections: ['UD1', 'UD2', 'UD3', 'UD8', 'UD9', 'UD10']
    })
  },

  // Las Vegas Aviators - Las Vegas Ballpark
  {
    stadiumId: 'las-vegas-aviators',
    sections: [
      // Premium Field Level
      { id: 'DC1', name: 'Dugout Club 1', level: 'field', baseAngle: 340, angleSpan: 10, rows: 8, covered: false, price: 'luxury' },
      { id: 'DC2', name: 'Dugout Club 2', level: 'field', baseAngle: 350, angleSpan: 10, rows: 8, covered: false, price: 'luxury' },
      { id: 'DC3', name: 'Dugout Club 3', level: 'field', baseAngle: 0, angleSpan: 10, rows: 8, covered: false, price: 'luxury' },
      { id: 'DC4', name: 'Dugout Club 4', level: 'field', baseAngle: 10, angleSpan: 10, rows: 8, covered: false, price: 'luxury' },
      { id: 'DC5', name: 'Dugout Club 5', level: 'field', baseAngle: 20, angleSpan: 10, rows: 8, covered: false, price: 'luxury' },
      // Field Boxes
      { id: 'FB101', name: 'Field Box 101', level: 'field', baseAngle: 30, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'FB102', name: 'Field Box 102', level: 'field', baseAngle: 45, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'FB103', name: 'Field Box 103', level: 'field', baseAngle: 60, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'FB104', name: 'Field Box 104', level: 'field', baseAngle: 75, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'FB105', name: 'Field Box 105', level: 'field', baseAngle: 90, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'FB106', name: 'Field Box 106', level: 'field', baseAngle: 270, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'FB107', name: 'Field Box 107', level: 'field', baseAngle: 285, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'FB108', name: 'Field Box 108', level: 'field', baseAngle: 300, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'FB109', name: 'Field Box 109', level: 'field', baseAngle: 315, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'FB110', name: 'Field Box 110', level: 'field', baseAngle: 330, angleSpan: 10, rows: 12, covered: false, price: 'premium' },
      // Plaza Level
      { id: 'PL201', name: 'Plaza 201', level: 'lower', baseAngle: 340, angleSpan: 20, rows: 18, covered: true, price: 'moderate' },
      { id: 'PL202', name: 'Plaza 202', level: 'lower', baseAngle: 0, angleSpan: 20, rows: 18, covered: true, price: 'moderate' },
      { id: 'PL203', name: 'Plaza 203', level: 'lower', baseAngle: 20, angleSpan: 20, rows: 18, covered: true, price: 'moderate' },
      { id: 'PL204', name: 'Plaza 204', level: 'lower', baseAngle: 40, angleSpan: 20, rows: 18, covered: false, price: 'moderate' },
      { id: 'PL205', name: 'Plaza 205', level: 'lower', baseAngle: 60, angleSpan: 20, rows: 18, covered: false, price: 'moderate' },
      { id: 'PL206', name: 'Plaza 206', level: 'lower', baseAngle: 80, angleSpan: 20, rows: 18, covered: false, price: 'moderate' },
      // Pavilion (Outfield)
      { id: 'PAV', name: 'Pavilion', level: 'lower', baseAngle: 120, angleSpan: 120, rows: 25, covered: false, price: 'value' }
    ]
  },

  // Worcester Red Sox - Polar Park
  {
    stadiumId: 'worcester-red-sox',
    sections: generateMiLBSections('worcester-red-sox', {
      fieldBoxCount: 8,
      lowerBoxCount: 14,
      upperDeckExists: true,
      upperSections: 8,
      hasLawn: true,
      coveredSections: ['UD1', 'UD2', 'UD3', 'UD6', 'UD7', 'UD8']
    })
  },

  // Charlotte Knights - Truist Field
  {
    stadiumId: 'charlotte-knights',
    sections: [
      // Diamond View Box (Premium behind home)
      { id: 'DVB1', name: 'Diamond View Box 1', level: 'field', baseAngle: 340, angleSpan: 20, rows: 10, covered: false, price: 'luxury' },
      { id: 'DVB2', name: 'Diamond View Box 2', level: 'field', baseAngle: 0, angleSpan: 20, rows: 10, covered: false, price: 'luxury' },
      // Dugout Boxes
      { id: 'DG101', name: 'Dugout Box 101', level: 'field', baseAngle: 20, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'DG102', name: 'Dugout Box 102', level: 'field', baseAngle: 35, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'DG103', name: 'Dugout Box 103', level: 'field', baseAngle: 50, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'DG108', name: 'Dugout Box 108', level: 'field', baseAngle: 310, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      { id: 'DG109', name: 'Dugout Box 109', level: 'field', baseAngle: 325, angleSpan: 15, rows: 12, covered: false, price: 'premium' },
      // Baseline Boxes
      { id: 'BL104', name: 'Baseline Box 104', level: 'lower', baseAngle: 65, angleSpan: 15, rows: 20, covered: false, price: 'moderate' },
      { id: 'BL105', name: 'Baseline Box 105', level: 'lower', baseAngle: 80, angleSpan: 15, rows: 20, covered: false, price: 'moderate' },
      { id: 'BL106', name: 'Baseline Box 106', level: 'lower', baseAngle: 95, angleSpan: 15, rows: 20, covered: false, price: 'moderate' },
      { id: 'BL107', name: 'Baseline Box 107', level: 'lower', baseAngle: 295, angleSpan: 15, rows: 20, covered: false, price: 'moderate' },
      // Outfield Reserved
      { id: 'OF201', name: 'Outfield Reserved 201', level: 'lower', baseAngle: 110, angleSpan: 35, rows: 22, covered: false, price: 'value' },
      { id: 'OF202', name: 'Outfield Reserved 202', level: 'lower', baseAngle: 145, angleSpan: 35, rows: 22, covered: false, price: 'value' },
      { id: 'OF203', name: 'Outfield Reserved 203', level: 'lower', baseAngle: 180, angleSpan: 35, rows: 22, covered: false, price: 'value' },
      { id: 'OF204', name: 'Outfield Reserved 204', level: 'lower', baseAngle: 215, angleSpan: 35, rows: 22, covered: false, price: 'value' },
      { id: 'OF205', name: 'Outfield Reserved 205', level: 'lower', baseAngle: 250, angleSpan: 35, rows: 22, covered: false, price: 'value' }
    ]
  },

  // Durham Bulls - Durham Bulls Athletic Park
  {
    stadiumId: 'durham-bulls',
    sections: [
      // Premium Diamond View
      { id: 'DV1', name: 'Diamond View 1', level: 'field', baseAngle: 345, angleSpan: 15, rows: 8, covered: false, price: 'luxury' },
      { id: 'DV2', name: 'Diamond View 2', level: 'field', baseAngle: 0, angleSpan: 15, rows: 8, covered: false, price: 'luxury' },
      { id: 'DV3', name: 'Diamond View 3', level: 'field', baseAngle: 15, angleSpan: 15, rows: 8, covered: false, price: 'luxury' },
      // Box Seats
      { id: 'BOX101', name: 'Box 101', level: 'field', baseAngle: 30, angleSpan: 12, rows: 14, covered: false, price: 'premium' },
      { id: 'BOX102', name: 'Box 102', level: 'field', baseAngle: 42, angleSpan: 12, rows: 14, covered: false, price: 'premium' },
      { id: 'BOX103', name: 'Box 103', level: 'field', baseAngle: 54, angleSpan: 12, rows: 14, covered: false, price: 'premium' },
      { id: 'BOX104', name: 'Box 104', level: 'field', baseAngle: 66, angleSpan: 12, rows: 14, covered: false, price: 'premium' },
      { id: 'BOX105', name: 'Box 105', level: 'field', baseAngle: 78, angleSpan: 12, rows: 14, covered: false, price: 'premium' },
      { id: 'BOX113', name: 'Box 113', level: 'field', baseAngle: 282, angleSpan: 12, rows: 14, covered: false, price: 'premium' },
      { id: 'BOX114', name: 'Box 114', level: 'field', baseAngle: 294, angleSpan: 12, rows: 14, covered: false, price: 'premium' },
      { id: 'BOX115', name: 'Box 115', level: 'field', baseAngle: 306, angleSpan: 12, rows: 14, covered: false, price: 'premium' },
      { id: 'BOX116', name: 'Box 116', level: 'field', baseAngle: 318, angleSpan: 12, rows: 14, covered: false, price: 'premium' },
      { id: 'BOX117', name: 'Box 117', level: 'field', baseAngle: 330, angleSpan: 15, rows: 14, covered: false, price: 'premium' },
      // Reserved Seating
      { id: 'RES201', name: 'Reserved 201', level: 'lower', baseAngle: 90, angleSpan: 20, rows: 22, covered: false, price: 'moderate' },
      { id: 'RES202', name: 'Reserved 202', level: 'lower', baseAngle: 110, angleSpan: 20, rows: 22, covered: false, price: 'moderate' },
      { id: 'RES203', name: 'Reserved 203', level: 'lower', baseAngle: 130, angleSpan: 20, rows: 22, covered: false, price: 'moderate' },
      { id: 'RES208', name: 'Reserved 208', level: 'lower', baseAngle: 230, angleSpan: 20, rows: 22, covered: false, price: 'moderate' },
      { id: 'RES209', name: 'Reserved 209', level: 'lower', baseAngle: 250, angleSpan: 20, rows: 22, covered: false, price: 'moderate' },
      { id: 'RES210', name: 'Reserved 210', level: 'lower', baseAngle: 270, angleSpan: 20, rows: 22, covered: false, price: 'moderate' },
      // Blue Monster (Left Field Wall)
      { id: 'BLUE', name: 'Blue Monster', level: 'lower', baseAngle: 150, angleSpan: 80, rows: 30, covered: false, price: 'value' }
    ]
  }
];

// Get sections for a specific MiLB stadium
export function getMiLBStadiumSections(stadiumId: string): StadiumSection[] {
  const stadiumData = MILB_STADIUM_SECTIONS.find(s => s.stadiumId === stadiumId);
  
  // Return specific sections if we have them
  if (stadiumData) {
    return stadiumData.sections;
  }
  
  // Otherwise generate generic sections
  return generateMiLBSections(stadiumId, {});
}