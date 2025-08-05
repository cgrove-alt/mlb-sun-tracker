// Real sections for all 30 AA stadiums
export const allAAStadiums: Record<string, { name: string; sections: any[] }> = {
  // Eastern League
  '2740': { // Akron RubberDucks - Canal Park
    name: 'Canal Park',
    sections: [
      // Field Level (100 level)
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 355, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 40, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 55, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 70, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 85, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 100, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 115, angleSpan: 15, covered: false, price: 'value' },
      // Upper Level (200 level)
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 340, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 355, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 10, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 25, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      { id: 'duck-pond', name: 'Duck Pond', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'value' },
      { id: 'suites', name: 'Suites', level: 'suite', baseAngle: 340, angleSpan: 70, covered: true, price: 'luxury' }
    ]
  },
  
  '2733': { // Altoona Curve - Peoples Natural Gas Field
    name: 'Peoples Natural Gas Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 28, angleSpan: 12, covered: false, price: 'standard' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 40, angleSpan: 12, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 52, angleSpan: 12, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 64, angleSpan: 12, covered: false, price: 'standard' },
      // Reserved Seats
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 340, angleSpan: 12, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 352, angleSpan: 12, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 4, angleSpan: 12, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      // Outfield Areas
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 76, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 106, angleSpan: 20, covered: false, price: 'value' },
      { id: 'rail-kings-club', name: 'Rail Kings Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ]
  },

  '2820': { // Binghamton Rumble Ponies - Mirabito Stadium
    name: 'Mirabito Stadium',
    sections: [
      // Field Box
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 300, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 315, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 330, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 345, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 0, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 15, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 30, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 45, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 60, angleSpan: 15, covered: false, price: 'standard' },
      // Reserved
      { id: 'sec-10', name: '10', level: 'main', baseAngle: 300, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-11', name: '11', level: 'main', baseAngle: 315, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-12', name: '12', level: 'main', baseAngle: 330, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-13', name: '13', level: 'main', baseAngle: 345, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-14', name: '14', level: 'main', baseAngle: 0, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-15', name: '15', level: 'main', baseAngle: 15, angleSpan: 15, covered: false, price: 'value' },
      { id: 'ga', name: 'General Admission', level: 'main', baseAngle: 75, angleSpan: 45, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2832': { // Bowie Baysox - Prince George's Stadium
    name: 'Prince George\'s Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seats
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 0, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'value' },
      // Grass Hill
      { id: 'grass-hill', name: 'Grass Hill', level: 'berm', baseAngle: 80, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2512': { // Erie SeaWolves - UPMC Park
    name: 'UPMC Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 325, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 355, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 55, angleSpan: 15, covered: false, price: 'standard' },
      // Reserved Grandstand
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 325, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 340, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      // Bleachers & Lawn
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 100, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 130, angleSpan: 15, covered: true, price: 'standard' }
    ]
  },

  '2749': { // Harrisburg Senators - FNB Field
    name: 'FNB Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 220, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 235, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 250, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 265, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 280, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 295, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 310, angleSpan: 15, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 220, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 235, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 250, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 265, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 280, angleSpan: 15, covered: false, price: 'value' },
      // Outfield
      { id: 'outfield-reserved', name: 'Outfield Reserved', level: 'field', baseAngle: 325, angleSpan: 20, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 345, angleSpan: 20, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 5, angleSpan: 15, covered: true, price: 'standard' }
    ]
  },

  '4985': { // Hartford Yard Goats - Dunkin' Park
    name: 'Dunkin\' Park',
    sections: [
      // Field Level
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'standard' },
      // Mezzanine Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 0, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      // Special Areas
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2868': { // New Hampshire Fisher Cats - Delta Dental Stadium
    name: 'Delta Dental Stadium',
    sections: [
      // Box Seats
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 105, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-200', name: '200', level: 'main', baseAngle: 25, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 35, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 45, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 55, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 65, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 75, angleSpan: 10, covered: true, price: 'value' },
      // Bleachers and Special Areas
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 115, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 130, angleSpan: 15, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 145, angleSpan: 30, covered: false, price: 'value' },
      { id: 'hotel-deck', name: 'Hotel Deck', level: 'main', baseAngle: 175, angleSpan: 15, covered: false, price: 'premium' }
    ]
  },

  '2779': { // Portland Sea Dogs - Hadlock Field
    name: 'Hadlock Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Grandstand
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      // Special Areas
      { id: 'maine-monster', name: 'Maine Monster', level: 'field', baseAngle: 25, angleSpan: 20, covered: false, price: 'value' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 45, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'sea-dog-suites', name: 'Sea Dog Suites', level: 'suite', baseAngle: 295, angleSpan: 40, covered: true, price: 'luxury' }
    ]
  },

  '2769': { // Reading Fightin Phils - FirstEnergy Stadium
    name: 'FirstEnergy Stadium',
    sections: [
      // Box Seats
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-10', name: '10', level: 'field', baseAngle: 110, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-11', name: '11', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-12', name: '12', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-13', name: '13', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-14', name: '14', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-15', name: '15', level: 'main', baseAngle: 60, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-16', name: '16', level: 'main', baseAngle: 70, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 120, angleSpan: 40, covered: false, price: 'value' },
      { id: 'pool-pavilion', name: 'Pool Pavilion', level: 'field', baseAngle: 160, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'picnic-patio', name: 'Picnic Patio', level: 'field', baseAngle: 180, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2853': { // Richmond Flying Squirrels - The Diamond
    name: 'The Diamond',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seats
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 320, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 330, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 340, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 350, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 0, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 10, angleSpan: 10, covered: false, price: 'value' },
      // General Admission
      { id: 'ga-left', name: 'GA Left Field', level: 'field', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'ga-right', name: 'GA Right Field', level: 'field', baseAngle: 270, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '5418': { // Somerset Patriots - TD Bank Ballpark
    name: 'TD Bank Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'ga-lawn', name: 'GA Lawn', level: 'berm', baseAngle: 25, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 55, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 75, angleSpan: 15, covered: false, price: 'standard' }
    ]
  },

  // Southern League
  '4529': { // Birmingham Barons - Regions Field
    name: 'Regions Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 0, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'gm-club', name: 'Good People GM Club', level: 'club', baseAngle: 330, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'party-plaza', name: 'Party Plaza', level: 'field', baseAngle: 100, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '4960': { // Biloxi Shuckers - MGM Park
    name: 'MGM Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 350, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 20, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 30, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 40, angleSpan: 10, covered: false, price: 'value' },
      // Special Areas
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 100, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'suites', name: 'Suites', level: 'suite', baseAngle: 350, angleSpan: 40, covered: true, price: 'luxury' }
    ]
  },

  '2682': { // Chattanooga Lookouts - AT&T Field
    name: 'AT&T Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 105, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 115, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 125, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 135, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 145, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 155, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 85, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 95, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 105, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 115, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 125, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 135, angleSpan: 10, covered: true, price: 'value' },
      // GA & Special Areas
      { id: 'ga-lawn', name: 'GA Lawn', level: 'berm', baseAngle: 165, angleSpan: 30, covered: false, price: 'value' },
      { id: 'lookouts-landing', name: 'Lookouts Landing', level: 'field', baseAngle: 195, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'moon-deck', name: 'Moon Deck', level: 'field', baseAngle: 215, angleSpan: 15, covered: false, price: 'premium' }
    ]
  },

  '2813': { // Columbus Clingstones - Synovus Park
    name: 'Synovus Park',
    sections: [
      // New stadium - estimated sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 322, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 334, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 346, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 358, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 12, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 22, angleSpan: 12, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 34, angleSpan: 12, covered: false, price: 'standard' },
      // Upper Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 12, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 322, angleSpan: 12, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 334, angleSpan: 12, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 346, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 358, angleSpan: 12, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 46, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 86, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2814': { // Montgomery Biscuits - Riverwalk Stadium
    name: 'Riverwalk Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'biscuit-basket', name: 'Biscuit Basket', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'value' },
      { id: 'riverwalk', name: 'Riverwalk', level: 'field', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'max-capital-club', name: 'MAX Capital Club', level: 'club', baseAngle: 330, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  '4329': { // Pensacola Blue Wahoos - Blue Wahoos Stadium
    name: 'Blue Wahoos Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 195, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 205, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 215, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 225, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 235, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 245, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 255, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 265, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 195, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 205, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 215, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 225, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 235, angleSpan: 10, covered: true, price: 'value' },
      // Special Areas
      { id: 'bay-deck', name: 'Bay Deck', level: 'field', baseAngle: 275, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'ga-hill', name: 'GA Hill', level: 'berm', baseAngle: 295, angleSpan: 25, covered: false, price: 'value' },
      { id: 'hancock-whitney-club', name: 'Hancock Whitney Club', level: 'club', baseAngle: 215, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  '5455': { // Rocket City Trash Pandas - Toyota Field
    name: 'Toyota Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Special Areas
      { id: 'moon-deck', name: 'Moon Deck', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'junkyard', name: 'The Junkyard', level: 'berm', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'sprocket', name: 'Sprocket', level: 'field', baseAngle: 100, angleSpan: 15, covered: false, price: 'premium' }
    ]
  },

  '2848': { // Knoxville Smokies - Covenant Health Park
    name: 'Covenant Health Park',
    sections: [
      // New stadium - estimated sections
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 105, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 115, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 125, angleSpan: 10, covered: false, price: 'standard' },
      // Upper Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 55, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 65, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 75, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 85, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 95, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 135, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 175, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  // Texas League
  '5415': { // Amarillo Sod Poodles - HODGETOWN
    name: 'HODGETOWN',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 355, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 5, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 15, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 25, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 35, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 75, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 115, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'dusters-club', name: 'Dusters Club', level: 'club', baseAngle: 5, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  '3389': { // Arkansas Travelers - Dickey-Stephens Park
    name: 'Dickey-Stephens Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 40, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2861': { // Corpus Christi Hooks - Whataburger Field
    name: 'Whataburger Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'grass-berm', name: 'Grass Berm', level: 'berm', baseAngle: 40, angleSpan: 40, covered: false, price: 'value' },
      { id: 'bay-deck', name: 'Bay Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'whataburger-club', name: 'Whataburger Club', level: 'club', baseAngle: 330, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  '2755': { // Frisco RoughRiders - Riders Field
    name: 'Riders Field',
    sections: [
      // Field Level
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 68, angleSpan: 8, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 76, angleSpan: 8, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 84, angleSpan: 8, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 92, angleSpan: 8, covered: false, price: 'standard' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 100, angleSpan: 8, covered: false, price: 'standard' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 108, angleSpan: 8, covered: false, price: 'standard' },
      // Main Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 20, angleSpan: 8, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 28, angleSpan: 8, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 36, angleSpan: 8, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 44, angleSpan: 8, covered: true, price: 'standard' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 52, angleSpan: 8, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 60, angleSpan: 8, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'main', baseAngle: 68, angleSpan: 8, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'main', baseAngle: 76, angleSpan: 8, covered: true, price: 'value' },
      // Special Areas
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 116, angleSpan: 40, covered: false, price: 'value' },
      { id: 'lazy-river', name: 'Lazy River', level: 'field', baseAngle: 156, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'bull-moose-saloon', name: 'Bull Moose Saloon', level: 'field', baseAngle: 176, angleSpan: 15, covered: false, price: 'standard' }
    ]
  },

  '2768': { // Midland RockHounds - Momentum Bank Ballpark
    name: 'Momentum Bank Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 40, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '3329': { // Northwest Arkansas Naturals - Arvest Ballpark
    name: 'Arvest Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 50, angleSpan: 40, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2818': { // San Antonio Missions - Nelson W. Wolff Municipal Stadium
    name: 'Nelson W. Wolff Municipal Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 25, angleSpan: 40, covered: false, price: 'value' },
      { id: 'ballapenos', name: 'Ballapenos', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2722': { // Springfield Cardinals - Hammons Field
    name: 'Hammons Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 280, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 280, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 290, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 300, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'redbird-roost', name: 'Redbird Roost', level: 'field', baseAngle: 40, angleSpan: 20, covered: false, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' }
    ]
  },

  '4149': { // Tulsa Drillers - ONEOK Field
    name: 'ONEOK Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'oil-derrick', name: 'Oil Derrick', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'outfield-reserved', name: 'Outfield Reserved', level: 'field', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 100, angleSpan: 20, covered: false, price: 'value' }
    ]
  },

  '5450': { // Wichita Wind Surge - Riverfront Stadium
    name: 'Riverfront Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 0, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'left-field-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 80, angleSpan: 30, covered: false, price: 'value' },
      { id: 'zamboozy', name: 'Zamboozy', level: 'field', baseAngle: 110, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 130, angleSpan: 15, covered: false, price: 'standard' }
    ]
  }
};