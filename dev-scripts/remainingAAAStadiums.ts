// Remaining AAA Stadium Sections Research
// Based on official sources and stadium information

export const remainingAAAStadiums: Record<string, any> = {
  // Jacksonville Jumbo Shrimp - VyStar Ballpark
  'jacksonville-jumbo-shrimp': {
    name: 'VyStar Ballpark',
    sections: [
      // Field Reserved sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Dugout Reserved sections
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 280, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 270, angleSpan: 10, covered: false, price: 'premium' },
      
      // Outfield Reserved sections  
      { id: 'sec-118', name: '118', level: 'ga', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'sec-119', name: '119', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'sec-120', name: '120', level: 'ga', baseAngle: 240, angleSpan: 30, covered: false, price: 'value' },
      
      // Special areas
      { id: 'skyboxes', name: 'Luxury Skyboxes', level: 'suite', baseAngle: 350, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'skydecks', name: 'Skydecks', level: 'club', baseAngle: 20, angleSpan: 40, covered: true, price: 'luxury' },
      { id: 'grass-berm', name: 'Grass Berm', level: 'berm', baseAngle: 140, angleSpan: 100, covered: false, price: 'value' }
    ]
  },

  // Lehigh Valley IronPigs - Coca-Cola Park
  'lehigh-valley-ironpigs': {
    name: 'Coca-Cola Park',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-118', name: '118', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-119', name: '119', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-120', name: '120', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Special areas
      { id: 'bacon-strip', name: 'The Bacon Strip', level: 'ga', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'pig-pen', name: 'Pig Pen', level: 'ga', baseAngle: 280, angleSpan: 30, covered: false, price: 'value' },
      { id: 'grass-berm', name: 'Grass Berm', level: 'berm', baseAngle: 90, angleSpan: 90, covered: false, price: 'value' },
      { id: 'dugout-suites', name: 'Dugout Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'club', baseAngle: 240, angleSpan: 40, covered: false, price: 'moderate' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' }
    ]
  },

  // Louisville Bats - Louisville Slugger Field
  'louisville-bats': {
    name: 'Louisville Slugger Field',
    sections: [
      // Field Box sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Upper sections
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 305, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      
      // Special areas
      { id: 'jim-beam-bourbon-bar', name: 'Jim Beam Bourbon Bar', level: 'club', baseAngle: 55, angleSpan: 25, covered: false, price: 'moderate' },
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 80, angleSpan: 40, covered: false, price: 'value' },
      { id: 'budweiser-berm', name: 'Budweiser Berm', level: 'berm', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'left-field-lounge', name: 'Left Field Lounge', level: 'ga', baseAngle: 240, angleSpan: 40, covered: false, price: 'value' },
      { id: 'champions-club', name: 'Champions Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ]
  },

  // Memphis Redbirds - AutoZone Park
  'memphis-redbirds': {
    name: 'AutoZone Park',
    sections: [
      // Field Box sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 349, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 358, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 6, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 15, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 24, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 33, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 42, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 51, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 310, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 319, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 328, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 337, angleSpan: 3, covered: false, price: 'moderate' },
      
      // Dugout boxes
      { id: 'dugout-box-a', name: 'Dugout Box A', level: 'field', baseAngle: 20, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'dugout-box-b', name: 'Dugout Box B', level: 'field', baseAngle: 330, angleSpan: 10, covered: true, price: 'luxury' },
      
      // Special areas
      { id: 'bluff', name: 'The Bluff', level: 'ga', baseAngle: 70, angleSpan: 50, covered: false, price: 'value' },
      { id: 'toyota-terrace', name: 'Toyota Terrace', level: 'club', baseAngle: 240, angleSpan: 60, covered: false, price: 'moderate' },
      { id: 'home-plate-club', name: 'Home Plate Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'autozone-deck', name: 'AutoZone Deck', level: 'ga', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 0, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  // Nashville Sounds - First Horizon Park
  'nashville-sounds': {
    name: 'First Horizon Park',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Club level sections
      { id: 'sec-201', name: '201', level: 'club', baseAngle: 340, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'sec-202', name: '202', level: 'club', baseAngle: 355, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'sec-203', name: '203', level: 'club', baseAngle: 10, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'sec-204', name: '204', level: 'club', baseAngle: 25, angleSpan: 15, covered: true, price: 'luxury' },
      
      // Special areas
      { id: 'the-band-box', name: 'The Band Box', level: 'ga', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'right-field-porch', name: 'Right Field Porch', level: 'ga', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'guitar-scoreboard', name: 'Guitar Scoreboard Deck', level: 'ga', baseAngle: 130, angleSpan: 50, covered: false, price: 'value' },
      { id: 'left-field-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 230, angleSpan: 50, covered: false, price: 'value' },
      { id: 'jack-daniels-club', name: 'Jack Daniels Club', level: 'club', baseAngle: 280, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'first-tennessee-club', name: 'First Tennessee Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ]
  },

  // Norfolk Tides - Harbor Park
  'norfolk-tides': {
    name: 'Harbor Park',
    sections: [
      // Box seats
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Upper level
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 296, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      
      // Special areas
      { id: 'picnic-plaza', name: 'Picnic Plaza', level: 'ga', baseAngle: 64, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 104, angleSpan: 40, covered: false, price: 'moderate' },
      { id: 'hits-at-the-park', name: 'Hits at the Park', level: 'ga', baseAngle: 216, angleSpan: 40, covered: false, price: 'value' },
      { id: 'left-field-landing', name: 'Left Field Landing', level: 'ga', baseAngle: 256, angleSpan: 40, covered: false, price: 'value' },
      { id: 'plaza-club', name: 'Plaza Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'harbor-club', name: 'Harbor Club', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  // Omaha Storm Chasers - Werner Park
  'omaha-storm-chasers': {
    name: 'Werner Park',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Special areas
      { id: 'home-run-hill', name: 'Home Run Hill', level: 'berm', baseAngle: 70, angleSpan: 50, covered: false, price: 'value' },
      { id: 'outfield-terrace', name: 'Outfield Terrace', level: 'ga', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'left-field-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 240, angleSpan: 60, covered: false, price: 'value' },
      { id: 'werner-enterprises-club', name: 'Werner Enterprises Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'corporate-suites', name: 'Corporate Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  // Rochester Red Wings - Innovative Field
  'rochester-red-wings': {
    name: 'Innovative Field',
    sections: [
      // Field level sections
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Upper level
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      
      // Special areas
      { id: 'right-field-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'kodak-picnic-area', name: 'Kodak Picnic Area', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'left-field-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      { id: 'frontier-field-club', name: 'Frontier Field Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  // Scranton/Wilkes-Barre RailRiders - PNC Field
  'scranton-railriders': {
    name: 'PNC Field',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Club level
      { id: 'sec-201', name: '201', level: 'club', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-202', name: '202', level: 'club', baseAngle: 0, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-203', name: '203', level: 'club', baseAngle: 20, angleSpan: 20, covered: true, price: 'luxury' },
      
      // Special areas
      { id: 'mohegan-sun-terrace', name: 'Mohegan Sun Terrace', level: 'ga', baseAngle: 70, angleSpan: 40, covered: false, price: 'value' },
      { id: 'budweiser-party-pavilion', name: 'Budweiser Party Pavilion', level: 'ga', baseAngle: 110, angleSpan: 70, covered: false, price: 'moderate' },
      { id: 'left-field-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 240, angleSpan: 60, covered: false, price: 'value' },
      { id: 'pinstripe-club', name: 'Pinstripe Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ]
  },

  // St. Paul Saints - CHS Field
  'st-paul-saints': {
    name: 'CHS Field',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Special areas
      { id: 'treasure-island', name: 'Treasure Island', level: 'suite', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'lowertown-landing', name: 'Lowertown Landing', level: 'ga', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'green-roof', name: 'Green Roof', level: 'ga', baseAngle: 100, angleSpan: 80, covered: false, price: 'value' },
      { id: 'left-field-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 240, angleSpan: 70, covered: false, price: 'value' },
      { id: 'capital-view-club', name: 'Capital View Club', level: 'club', baseAngle: 0, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  // Syracuse Mets - NBT Bank Stadium
  'syracuse-mets': {
    name: 'NBT Bank Stadium',
    sections: [
      // Field Box sections
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Reserved seating
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 305, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      
      // Special areas
      { id: 'outback-steakhouse-picnic-pavilion', name: 'Outback Steakhouse Picnic Pavilion', level: 'ga', baseAngle: 70, angleSpan: 40, covered: false, price: 'value' },
      { id: 'salt-city-deck', name: 'Salt City Deck', level: 'ga', baseAngle: 110, angleSpan: 70, covered: false, price: 'value' },
      { id: 'left-field-wall', name: 'Left Field Wall', level: 'ga', baseAngle: 260, angleSpan: 40, covered: false, price: 'value' },
      { id: 'hank-sauer-room', name: 'Hank Sauer Room', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ]
  },

  // Toledo Mud Hens - Fifth Third Field
  'toledo-mud-hens': {
    name: 'Fifth Third Field',
    sections: [
      // Field level sections
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Mezzanine level
      { id: 'sec-200', name: '200', level: 'mezzanine', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-201', name: '201', level: 'mezzanine', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'mezzanine', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'mezzanine', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'mezzanine', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'mezzanine', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'mezzanine', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'mezzanine', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'mezzanine', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'mezzanine', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      
      // Special areas
      { id: 'roost', name: 'The Roost', level: 'ga', baseAngle: 64, angleSpan: 46, covered: false, price: 'value' },
      { id: 'fleetwood-tap-room', name: 'Fleetwood Tap Room', level: 'club', baseAngle: 260, angleSpan: 40, covered: true, price: 'moderate' },
      { id: 'holy-toledo-tavern', name: 'Holy Toledo Tavern', level: 'club', baseAngle: 110, angleSpan: 50, covered: false, price: 'moderate' },
      { id: 'huntington-club', name: 'Huntington Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'miller-lite-landing', name: 'Miller Lite Landing', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' }
    ]
  },

  // Worcester Red Sox - Polar Park
  'worcester-red-sox': {
    name: 'Polar Park',
    sections: [
      // Field level sections
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-10', name: '10', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-11', name: '11', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-12', name: '12', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-13', name: '13', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Club level
      { id: 'sec-201', name: '201', level: 'club', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-202', name: '202', level: 'club', baseAngle: 0, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-203', name: '203', level: 'club', baseAngle: 20, angleSpan: 20, covered: true, price: 'luxury' },
      
      // Special areas
      { id: 'summit-suites', name: 'Summit Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'right-field-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 70, angleSpan: 40, covered: false, price: 'value' },
      { id: 'berm', name: 'The Berm', level: 'berm', baseAngle: 110, angleSpan: 70, covered: false, price: 'value' },
      { id: 'left-field-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 250, angleSpan: 50, covered: false, price: 'value' },
      { id: 'dcyf-kids-fun-zone', name: 'DCU Kids Fun Zone', level: 'ga', baseAngle: 180, angleSpan: 30, covered: false, price: 'value' },
      { id: 'worcester-wall', name: 'Worcester Wall', level: 'ga', baseAngle: 210, angleSpan: 40, covered: false, price: 'value' }
    ]
  },

  // Oklahoma City Dodgers - Chickasaw Bricktown Ballpark
  'oklahoma-city-dodgers': {
    name: 'Chickasaw Bricktown Ballpark',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Upper level
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 304, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 316, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 328, angleSpan: 12, covered: true, price: 'value' },
      
      // Special areas
      { id: 'corona-beach-house', name: 'Corona Beach House', level: 'ga', baseAngle: 64, angleSpan: 46, covered: false, price: 'value' },
      { id: 'center-field-plaza', name: 'Center Field Plaza', level: 'ga', baseAngle: 110, angleSpan: 70, covered: false, price: 'value' },
      { id: 'left-field-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 260, angleSpan: 40, covered: false, price: 'value' },
      { id: 'oil-derrick-club', name: 'Oil Derrick Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  // Reno Aces - Greater Nevada Field
  'reno-aces': {
    name: 'Greater Nevada Field',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Plaza level
      { id: 'sec-201', name: '201', level: 'plaza', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'plaza', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'plaza', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'plaza', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'plaza', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      
      // Special areas
      { id: 'freight-house-district', name: 'Freight House District', level: 'ga', baseAngle: 60, angleSpan: 50, covered: false, price: 'value' },
      { id: 'aces-alley', name: 'Aces Alley', level: 'ga', baseAngle: 110, angleSpan: 70, covered: false, price: 'value' },
      { id: 'party-zone', name: 'Party Zone', level: 'ga', baseAngle: 250, angleSpan: 60, covered: false, price: 'moderate' },
      { id: 'sk-baseball-club', name: 'SK Baseball Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  // Round Rock Express - Dell Diamond
  'round-rock-express': {
    name: 'Dell Diamond',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Upper deck
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      
      // Special areas
      { id: 'rock-porch', name: 'Rock Porch', level: 'ga', baseAngle: 64, angleSpan: 46, covered: false, price: 'value' },
      { id: 'fun-zone', name: 'Fun Zone', level: 'ga', baseAngle: 110, angleSpan: 50, covered: false, price: 'value' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 160, angleSpan: 80, covered: false, price: 'value' },
      { id: 'home-run-porch', name: 'Home Run Porch', level: 'ga', baseAngle: 240, angleSpan: 40, covered: false, price: 'value' },
      { id: 'united-heritage-center-club', name: 'United Heritage Center Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  // Sacramento River Cats - Sutter Health Park
  'sacramento-river-cats': {
    name: 'Sutter Health Park',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 68, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 76, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 84, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 276, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 284, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 292, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-118', name: '118', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-119', name: '119', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-120', name: '120', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-121', name: '121', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-122', name: '122', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Upper level
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 320, angleSpan: 20, covered: true, price: 'value' },
      
      // Special areas
      { id: 'toyota-home-run-hill', name: 'Toyota Home Run Hill', level: 'berm', baseAngle: 92, angleSpan: 88, covered: false, price: 'value' },
      { id: 'solon-club', name: 'Solon Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'river-view-landing', name: 'River View Landing', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'moderate' },
      { id: 'party-plaza', name: 'Party Plaza', level: 'ga', baseAngle: 240, angleSpan: 36, covered: false, price: 'value' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 40, angleSpan: 40, covered: true, price: 'luxury' }
    ]
  },

  // Salt Lake Bees - The Ballpark at America First Square (opening 2025)
  'salt-lake-bees': {
    name: 'The Ballpark at America First Square',
    sections: [
      // Note: This is a new ballpark opening in 2025, so sections are estimated based on capacity and modern AAA stadium designs
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Upper level
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 305, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      
      // Special areas (planned features for new stadium)
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 70, angleSpan: 50, covered: false, price: 'value' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 120, angleSpan: 90, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 240, angleSpan: 60, covered: false, price: 'moderate' },
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 40, covered: true, price: 'luxury' }
    ]
  },

  // Sugar Land Space Cowboys - Constellation Field
  'sugar-land-space-cowboys': {
    name: 'Constellation Field',
    sections: [
      // Field level sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Club level
      { id: 'sec-201', name: '201', level: 'club', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-202', name: '202', level: 'club', baseAngle: 0, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-203', name: '203', level: 'club', baseAngle: 20, angleSpan: 20, covered: true, price: 'luxury' },
      
      // Special areas
      { id: 'imperial-suites', name: 'Imperial Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'ob-brewery-deck', name: 'OB Brewery Deck', level: 'ga', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'home-run-alley', name: 'Home Run Alley', level: 'ga', baseAngle: 100, angleSpan: 80, covered: false, price: 'value' },
      { id: 'left-field-corner', name: 'Left Field Corner', level: 'ga', baseAngle: 260, angleSpan: 50, covered: false, price: 'value' },
      { id: 'insperity-club', name: 'Insperity Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ]
  },

  // Tacoma Rainiers - Cheney Stadium
  'tacoma-rainiers': {
    name: 'Cheney Stadium',
    sections: [
      // Field level sections
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-10', name: '10', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-11', name: '11', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-12', name: '12', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-13', name: '13', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Grandstand sections
      { id: 'sec-14', name: '14', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-15', name: '15', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-16', name: '16', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-17', name: '17', level: 'upper', baseAngle: 320, angleSpan: 20, covered: true, price: 'value' },
      
      // Special areas
      { id: 'sandstone-point', name: 'Sandstone Point', level: 'ga', baseAngle: 70, angleSpan: 50, covered: false, price: 'value' },
      { id: 'left-field-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 250, angleSpan: 50, covered: false, price: 'value' },
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'mt-rainier-deck', name: 'Mt. Rainier Deck', level: 'ga', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'suites', name: 'Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  }
};