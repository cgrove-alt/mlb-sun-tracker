// Expanded real stadium sections for AAA stadiums
// Based on research from official sources

export const expandedRealStadiumSections: Record<string, any> = {
  // Already researched stadiums
  'buffalo-bisons': {
    name: 'Sahlen Field',
    sections: [
      // 100 Level (Field Box)
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
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-123', name: '123', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-124', name: '124', level: 'field', baseAngle: 284, angleSpan: 8, covered: false, price: 'value' },
      
      // 200 Level (Upper Reserved)
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 64, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 296, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-211', name: '211', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-212', name: '212', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      
      // Special areas
      { id: 'coca-cola-field-club', name: 'Coca-Cola Field Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'bully-hill-deck', name: 'The Bully Hill Party Deck', level: 'club', baseAngle: 76, angleSpan: 35, covered: false, price: 'moderate' },
      { id: 'pub-at-the-park', name: 'Pub at the Park', level: 'club', baseAngle: 270, angleSpan: 20, covered: true, price: 'moderate' }
    ]
  },

  // New researched stadiums
  'albuquerque-isotopes': {
    name: 'Isotopes Park',
    sections: [
      // 100 Level (Field Level)
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // 200 Level (Suite Level)
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 305, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 290, angleSpan: 15, covered: true, price: 'value' },
      
      // 300 Level (Club Level)
      { id: 'sec-311', name: 'Club 311', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      
      // Special areas
      { id: 'pepsi-porch', name: 'Pepsi Porch', level: 'club', baseAngle: 270, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'tecate-alta-terrace', name: 'Tecate Alta Terrace', level: 'club', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'tequila-herradura-fiesta-deck', name: 'Tequila Herradura Fiesta Deck', level: 'ga', baseAngle: 70, angleSpan: 25, covered: false, price: 'moderate' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 95, angleSpan: 85, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 235, angleSpan: 35, covered: false, price: 'value' }
    ]
  },

  'el-paso-chihuahuas': {
    name: 'Southwest University Park',
    sections: [
      // Field Box sections
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-10', name: '10', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-11', name: '11', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-12', name: '12', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-13', name: '13', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-14', name: '14', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-15', name: '15', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Upper sections
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 320, angleSpan: 20, covered: true, price: 'value' },
      
      // Special areas
      { id: 'weststar-club', name: 'WestStar Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'city-hall-grill', name: 'City Hall Grill', level: 'club', baseAngle: 270, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'santa-fe-pavilion', name: 'Santa Fe Pavilion', level: 'ga', baseAngle: 80, angleSpan: 35, covered: false, price: 'moderate' },
      { id: 'sun-kings-saloon', name: 'Sun Kings Saloon', level: 'ga', baseAngle: 115, angleSpan: 40, covered: false, price: 'value' },
      { id: 'tequila-cazadores-cantina', name: 'Tequila Cazadores Cantina', level: 'ga', baseAngle: 155, angleSpan: 40, covered: false, price: 'value' },
      { id: 'wooftop-deck', name: 'Wooftop Deck', level: 'ga', baseAngle: 195, angleSpan: 40, covered: false, price: 'value' },
      { id: 'mountainstar-suite', name: 'MountainStar Suite', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  'gwinnett-stripers': {
    name: 'Coolray Field',
    sections: [
      // Field level sections  
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 349, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 358, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 7, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 16, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 25, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 34, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 43, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 61, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 299, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 317, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 326, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 335, angleSpan: 5, covered: false, price: 'moderate' },
      
      // Special areas
      { id: 'coca-cola-pavilion', name: 'Coca-Cola Pavilion', level: 'ga', baseAngle: 70, angleSpan: 40, covered: false, price: 'value' },
      { id: 'right-field-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 110, angleSpan: 50, covered: false, price: 'value' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 160, angleSpan: 60, covered: false, price: 'value' },
      { id: 'left-field-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 220, angleSpan: 50, covered: false, price: 'value' },
      { id: 'georgia-power-pavilion', name: 'Georgia Power Pavilion', level: 'club', baseAngle: 270, angleSpan: 29, covered: true, price: 'moderate' },
      { id: 'delta-sky360-club', name: 'Delta Sky360 Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'mercedes-benz-club', name: 'Mercedes-Benz Club', level: 'club', baseAngle: 10, angleSpan: 25, covered: true, price: 'luxury' }
    ]
  },

  'indianapolis-indians': {
    name: 'Victory Field',
    sections: [
      // Main seating bowl
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
      
      // Lawn and special areas
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 92, angleSpan: 88, covered: false, price: 'value' },
      { id: 'elements-financial-club', name: 'Elements Financial Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'knot-hole-gang', name: 'Knot Hole Gang', level: 'ga', baseAngle: 240, angleSpan: 36, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'moderate' }
    ]
  }
};