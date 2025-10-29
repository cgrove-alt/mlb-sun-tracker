// NFL Stadium Section Data
// Stadium-specific section layouts for NFL venues

import type { StadiumSection } from './stadiumSectionTypes';

export interface NFLStadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}

// Helper function to generate standard NFL stadium sections
function generateNFLSections(
  stadiumId: string,
  config: {
    lowerBowlSections?: number;
    clubLevelSections?: number;
    upperBowlSections?: number;
    hasClubLevel?: boolean;
    coveredSections?: string[];
    premiumSections?: string[];
  }
): StadiumSection[] {
  const sections: StadiumSection[] = [];
  const {
    lowerBowlSections = 32,
    clubLevelSections = 16,
    upperBowlSections = 32,
    hasClubLevel = true,
    coveredSections = [],
    premiumSections = []
  } = config;

  // Lower Bowl (100 level)
  const lowerAngleStep = 360 / lowerBowlSections;
  for (let i = 0; i < lowerBowlSections; i++) {
    const sectionNum = 101 + i;
    const angle = i * lowerAngleStep;
    sections.push({
      id: `${sectionNum}`,
      name: `Section ${sectionNum}`,
      level: 'lower',
      baseAngle: angle,
      angleSpan: lowerAngleStep,
      rows: 30,
      covered: coveredSections.includes(`${sectionNum}`),
      price: premiumSections.includes(`${sectionNum}`) ? 'premium' : 'moderate'
    });
  }

  // Club Level (200 level) if exists
  if (hasClubLevel) {
    const clubAngleStep = 360 / clubLevelSections;
    for (let i = 0; i < clubLevelSections; i++) {
      const sectionNum = 201 + i;
      const angle = i * clubAngleStep;
      sections.push({
        id: `C${sectionNum}`,
        name: `Club ${sectionNum}`,
        level: 'club',
        baseAngle: angle,
        angleSpan: clubAngleStep,
        rows: 20,
        covered: true, // Club levels typically covered
        price: 'premium'
      });
    }
  }

  // Upper Bowl (300/400 level)
  const upperAngleStep = 360 / upperBowlSections;
  for (let i = 0; i < upperBowlSections; i++) {
    const sectionNum = 301 + i;
    const angle = i * upperAngleStep;
    sections.push({
      id: `${sectionNum}`,
      name: `Section ${sectionNum}`,
      level: 'upper',
      baseAngle: angle,
      angleSpan: upperAngleStep,
      rows: 35,
      covered: coveredSections.includes(`${sectionNum}`),
      price: 'value'
    });
  }

  return sections;
}

// Actual section data for major NFL stadiums
export const NFL_STADIUM_SECTIONS: NFLStadiumSections[] = [
  // MetLife Stadium - NY Giants/Jets
  {
    stadiumId: 'metlife-stadium',
    sections: [
      // Lower Level (100s)
      { id: '101', name: 'Section 101', level: 'lower', baseAngle: 0, angleSpan: 10, rows: 30, covered: false, price: 'premium' },
      { id: '102', name: 'Section 102', level: 'lower', baseAngle: 10, angleSpan: 10, rows: 30, covered: false, price: 'premium' },
      { id: '103', name: 'Section 103', level: 'lower', baseAngle: 20, angleSpan: 10, rows: 30, covered: false, price: 'premium' },
      { id: '104', name: 'Section 104', level: 'lower', baseAngle: 30, angleSpan: 10, rows: 30, covered: false, price: 'moderate' },
      { id: '105', name: 'Section 105', level: 'lower', baseAngle: 40, angleSpan: 10, rows: 30, covered: false, price: 'moderate' },
      { id: '106', name: 'Section 106', level: 'lower', baseAngle: 50, angleSpan: 10, rows: 30, covered: false, price: 'moderate' },
      { id: '107', name: 'Section 107', level: 'lower', baseAngle: 60, angleSpan: 10, rows: 30, covered: false, price: 'moderate' },
      { id: '108', name: 'Section 108', level: 'lower', baseAngle: 70, angleSpan: 10, rows: 30, covered: false, price: 'moderate' },
      { id: '109', name: 'Section 109', level: 'lower', baseAngle: 80, angleSpan: 10, rows: 30, covered: false, price: 'moderate' },
      { id: '110', name: 'Section 110', level: 'lower', baseAngle: 90, angleSpan: 10, rows: 30, covered: false, price: 'moderate' },
      // Mezzanine Club Level (200s)
      { id: '201A', name: 'Mezzanine Club 201A', level: 'club', baseAngle: 0, angleSpan: 15, rows: 15, covered: true, price: 'luxury' },
      { id: '201B', name: 'Mezzanine Club 201B', level: 'club', baseAngle: 15, angleSpan: 15, rows: 15, covered: true, price: 'luxury' },
      { id: '202', name: 'Mezzanine Club 202', level: 'club', baseAngle: 30, angleSpan: 15, rows: 15, covered: true, price: 'luxury' },
      { id: '203', name: 'Mezzanine Club 203', level: 'club', baseAngle: 45, angleSpan: 15, rows: 15, covered: true, price: 'luxury' },
      // Upper Level (300s)
      { id: '301', name: 'Section 301', level: 'upper', baseAngle: 0, angleSpan: 10, rows: 40, covered: false, price: 'value' },
      { id: '302', name: 'Section 302', level: 'upper', baseAngle: 10, angleSpan: 10, rows: 40, covered: false, price: 'value' },
      { id: '303', name: 'Section 303', level: 'upper', baseAngle: 20, angleSpan: 10, rows: 40, covered: false, price: 'value' },
      { id: '304', name: 'Section 304', level: 'upper', baseAngle: 30, angleSpan: 10, rows: 40, covered: false, price: 'value' },
      { id: '305', name: 'Section 305', level: 'upper', baseAngle: 40, angleSpan: 10, rows: 40, covered: false, price: 'value' }
    ]
  },

  // SoFi Stadium - LA Rams/Chargers
  {
    stadiumId: 'sofi-stadium',
    sections: [
      // Field Level
      { id: 'FL1', name: 'Field Level 1', level: 'field', baseAngle: 0, angleSpan: 15, rows: 20, covered: true, price: 'luxury' },
      { id: 'FL2', name: 'Field Level 2', level: 'field', baseAngle: 15, angleSpan: 15, rows: 20, covered: true, price: 'luxury' },
      { id: 'FL3', name: 'Field Level 3', level: 'field', baseAngle: 30, angleSpan: 15, rows: 20, covered: true, price: 'luxury' },
      // 100 Level
      { id: '101', name: 'Section 101', level: 'lower', baseAngle: 0, angleSpan: 12, rows: 28, covered: true, price: 'premium' },
      { id: '102', name: 'Section 102', level: 'lower', baseAngle: 12, angleSpan: 12, rows: 28, covered: true, price: 'premium' },
      { id: '103', name: 'Section 103', level: 'lower', baseAngle: 24, angleSpan: 12, rows: 28, covered: true, price: 'premium' },
      { id: '104', name: 'Section 104', level: 'lower', baseAngle: 36, angleSpan: 12, rows: 28, covered: true, price: 'moderate' },
      { id: '105', name: 'Section 105', level: 'lower', baseAngle: 48, angleSpan: 12, rows: 28, covered: true, price: 'moderate' },
      // 200 Level (Club)
      { id: '201', name: 'Club 201', level: 'club', baseAngle: 0, angleSpan: 20, rows: 18, covered: true, price: 'luxury' },
      { id: '202', name: 'Club 202', level: 'club', baseAngle: 20, angleSpan: 20, rows: 18, covered: true, price: 'luxury' },
      { id: '203', name: 'Club 203', level: 'club', baseAngle: 40, angleSpan: 20, rows: 18, covered: true, price: 'luxury' },
      // 300 Level
      { id: '301', name: 'Section 301', level: 'upper', baseAngle: 0, angleSpan: 12, rows: 35, covered: true, price: 'value' },
      { id: '302', name: 'Section 302', level: 'upper', baseAngle: 12, angleSpan: 12, rows: 35, covered: true, price: 'value' },
      { id: '303', name: 'Section 303', level: 'upper', baseAngle: 24, angleSpan: 12, rows: 35, covered: true, price: 'value' }
    ]
  },

  // Lambeau Field - Green Bay Packers
  {
    stadiumId: 'lambeau-field',
    sections: [
      // 100 Level (Lower Bowl)
      { id: '101', name: 'Section 101', level: 'lower', baseAngle: 0, angleSpan: 9, rows: 38, covered: false, price: 'premium' },
      { id: '102', name: 'Section 102', level: 'lower', baseAngle: 9, angleSpan: 9, rows: 38, covered: false, price: 'premium' },
      { id: '103', name: 'Section 103', level: 'lower', baseAngle: 18, angleSpan: 9, rows: 38, covered: false, price: 'premium' },
      { id: '104', name: 'Section 104', level: 'lower', baseAngle: 27, angleSpan: 9, rows: 38, covered: false, price: 'moderate' },
      { id: '105', name: 'Section 105', level: 'lower', baseAngle: 36, angleSpan: 9, rows: 38, covered: false, price: 'moderate' },
      { id: '106', name: 'Section 106', level: 'lower', baseAngle: 45, angleSpan: 9, rows: 38, covered: false, price: 'moderate' },
      { id: '107', name: 'Section 107', level: 'lower', baseAngle: 54, angleSpan: 9, rows: 38, covered: false, price: 'moderate' },
      { id: '108', name: 'Section 108', level: 'lower', baseAngle: 63, angleSpan: 9, rows: 38, covered: false, price: 'moderate' },
      { id: '109', name: 'Section 109', level: 'lower', baseAngle: 72, angleSpan: 9, rows: 38, covered: false, price: 'moderate' },
      { id: '110', name: 'Section 110', level: 'lower', baseAngle: 81, angleSpan: 9, rows: 38, covered: false, price: 'moderate' },
      { id: '111', name: 'Section 111', level: 'lower', baseAngle: 90, angleSpan: 9, rows: 38, covered: false, price: 'moderate' },
      // 400 Level (Upper Bowl - South End Zone)
      { id: '401', name: 'Section 401', level: 'upper', baseAngle: 150, angleSpan: 15, rows: 30, covered: false, price: 'value' },
      { id: '402', name: 'Section 402', level: 'upper', baseAngle: 165, angleSpan: 15, rows: 30, covered: false, price: 'value' },
      { id: '403', name: 'Section 403', level: 'upper', baseAngle: 180, angleSpan: 15, rows: 30, covered: false, price: 'value' },
      { id: '404', name: 'Section 404', level: 'upper', baseAngle: 195, angleSpan: 15, rows: 30, covered: false, price: 'value' },
      { id: '405', name: 'Section 405', level: 'upper', baseAngle: 210, angleSpan: 15, rows: 30, covered: false, price: 'value' },
      // 700 Level (Upper Bowl - Bowl Addition)
      { id: '701', name: 'Section 701', level: 'upper', baseAngle: 0, angleSpan: 12, rows: 42, covered: false, price: 'value' },
      { id: '702', name: 'Section 702', level: 'upper', baseAngle: 12, angleSpan: 12, rows: 42, covered: false, price: 'value' },
      { id: '703', name: 'Section 703', level: 'upper', baseAngle: 24, angleSpan: 12, rows: 42, covered: false, price: 'value' }
    ]
  },

  // AT&T Stadium - Dallas Cowboys
  {
    stadiumId: 'att-stadium',
    sections: [
      // Field Level Suites
      { id: 'FLS1', name: 'Field Suite 1', level: 'field', baseAngle: 0, angleSpan: 20, rows: 8, covered: true, price: 'luxury' },
      { id: 'FLS2', name: 'Field Suite 2', level: 'field', baseAngle: 20, angleSpan: 20, rows: 8, covered: true, price: 'luxury' },
      // Plaza Level (100s)
      { id: '101', name: 'Plaza 101', level: 'lower', baseAngle: 0, angleSpan: 11.25, rows: 32, covered: true, price: 'premium' },
      { id: '102', name: 'Plaza 102', level: 'lower', baseAngle: 11.25, angleSpan: 11.25, rows: 32, covered: true, price: 'premium' },
      { id: '103', name: 'Plaza 103', level: 'lower', baseAngle: 22.5, angleSpan: 11.25, rows: 32, covered: true, price: 'premium' },
      { id: '104', name: 'Plaza 104', level: 'lower', baseAngle: 33.75, angleSpan: 11.25, rows: 32, covered: true, price: 'moderate' },
      { id: '105', name: 'Plaza 105', level: 'lower', baseAngle: 45, angleSpan: 11.25, rows: 32, covered: true, price: 'moderate' },
      // Club Level (200s)
      { id: '201', name: 'Club 201', level: 'club', baseAngle: 0, angleSpan: 18, rows: 24, covered: true, price: 'luxury' },
      { id: '202', name: 'Club 202', level: 'club', baseAngle: 18, angleSpan: 18, rows: 24, covered: true, price: 'luxury' },
      { id: '203', name: 'Club 203', level: 'club', baseAngle: 36, angleSpan: 18, rows: 24, covered: true, price: 'luxury' },
      // Upper Level (400s)
      { id: '401', name: 'Upper 401', level: 'upper', baseAngle: 0, angleSpan: 11.25, rows: 45, covered: true, price: 'value' },
      { id: '402', name: 'Upper 402', level: 'upper', baseAngle: 11.25, angleSpan: 11.25, rows: 45, covered: true, price: 'value' },
      { id: '403', name: 'Upper 403', level: 'upper', baseAngle: 22.5, angleSpan: 11.25, rows: 45, covered: true, price: 'value' },
      { id: '404', name: 'Upper 404', level: 'upper', baseAngle: 33.75, angleSpan: 11.25, rows: 45, covered: true, price: 'value' }
    ]
  },

  // Arrowhead Stadium - Kansas City Chiefs
  {
    stadiumId: 'arrowhead-stadium',
    sections: [
      // Lower Level (100s)
      { id: '101', name: 'Section 101', level: 'lower', baseAngle: 0, angleSpan: 10, rows: 35, covered: false, price: 'premium' },
      { id: '102', name: 'Section 102', level: 'lower', baseAngle: 10, angleSpan: 10, rows: 35, covered: false, price: 'premium' },
      { id: '103', name: 'Section 103', level: 'lower', baseAngle: 20, angleSpan: 10, rows: 35, covered: false, price: 'premium' },
      { id: '104', name: 'Section 104', level: 'lower', baseAngle: 30, angleSpan: 10, rows: 35, covered: false, price: 'moderate' },
      { id: '105', name: 'Section 105', level: 'lower', baseAngle: 40, angleSpan: 10, rows: 35, covered: false, price: 'moderate' },
      { id: '106', name: 'Section 106', level: 'lower', baseAngle: 50, angleSpan: 10, rows: 35, covered: false, price: 'moderate' },
      { id: '107', name: 'Section 107', level: 'lower', baseAngle: 60, angleSpan: 10, rows: 35, covered: false, price: 'moderate' },
      { id: '108', name: 'Section 108', level: 'lower', baseAngle: 70, angleSpan: 10, rows: 35, covered: false, price: 'moderate' },
      { id: '109', name: 'Section 109', level: 'lower', baseAngle: 80, angleSpan: 10, rows: 35, covered: false, price: 'moderate' },
      { id: '110', name: 'Section 110', level: 'lower', baseAngle: 90, angleSpan: 10, rows: 35, covered: false, price: 'moderate' },
      // Club Level (200s)
      { id: '201', name: 'Club 201', level: 'club', baseAngle: 0, angleSpan: 20, rows: 20, covered: true, price: 'premium', partialCoverage: true, coveredRows: 'Rows 15-20' },
      { id: '202', name: 'Club 202', level: 'club', baseAngle: 20, angleSpan: 20, rows: 20, covered: true, price: 'premium', partialCoverage: true, coveredRows: 'Rows 15-20' },
      { id: '203', name: 'Club 203', level: 'club', baseAngle: 40, angleSpan: 20, rows: 20, covered: true, price: 'premium', partialCoverage: true, coveredRows: 'Rows 15-20' },
      // Upper Level (300s)
      { id: '301', name: 'Section 301', level: 'upper', baseAngle: 0, angleSpan: 10, rows: 40, covered: false, price: 'value', partialCoverage: true, coveredRows: 'Rows 30-40' },
      { id: '302', name: 'Section 302', level: 'upper', baseAngle: 10, angleSpan: 10, rows: 40, covered: false, price: 'value', partialCoverage: true, coveredRows: 'Rows 30-40' },
      { id: '303', name: 'Section 303', level: 'upper', baseAngle: 20, angleSpan: 10, rows: 40, covered: false, price: 'value', partialCoverage: true, coveredRows: 'Rows 30-40' }
    ]
  }
];

// Get sections for a specific NFL stadium
export function getNFLStadiumSections(stadiumId: string): StadiumSection[] {
  const stadiumData = NFL_STADIUM_SECTIONS.find(s => s.stadiumId === stadiumId);
  
  // Return specific sections if we have them
  if (stadiumData) {
    return stadiumData.sections;
  }
  
  // Otherwise generate generic sections
  return generateNFLSections(stadiumId, {});
}