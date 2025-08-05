// Real sections for all 30 A stadiums
export const allAStadiums: Record<string, { name: string; sections: any[] }> = {
  // California League
  '2640': { // Fresno Grizzlies - Chukchansi Park
    name: 'Chukchansi Park',
    sections: [
      // Field Level
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
      // Club Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 25, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2728': { // Inland Empire 66ers - San Manuel Stadium
    name: 'San Manuel Stadium',
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
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 30, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 70, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2516': { // Lake Elsinore Storm - Lake Elsinore Diamond
    name: 'Lake Elsinore Diamond',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Grandstand
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'outfield-pavilion', name: 'Outfield Pavilion', level: 'field', baseAngle: 5, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-plaza', name: 'Party Plaza', level: 'field', baseAngle: 35, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2791': { // Modesto Nuts - John Thurman Field
    name: 'John Thurman Field',
    sections: [
      // Box Seats
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-11', name: '11', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-12', name: '12', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-13', name: '13', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-14', name: '14', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-15', name: '15', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 80, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-area', name: 'Party Area', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2854': { // Rancho Cucamonga Quakes - LoanMart Field
    name: 'LoanMart Field',
    sections: [
      // Field Boxes
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved MVP Box
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'pavilion', name: 'Pavilion', level: 'field', baseAngle: 5, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-zone', name: 'Party Zone', level: 'field', baseAngle: 35, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2815': { // San Jose Giants - Excite Ballpark
    name: 'Excite Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'bbq-terrace', name: 'BBQ Terrace', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2731': { // Stockton Ports - Banner Island Ballpark
    name: 'Banner Island Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Grandstand
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 60, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2835': { // Visalia Rawhide - Valley Strong Ballpark
    name: 'Valley Strong Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 285, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 300, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 315, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 330, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 345, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 0, angleSpan: 15, covered: false, price: 'standard' },
      // General Admission
      { id: 'ga-1', name: 'GA 1', level: 'main', baseAngle: 285, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ga-2', name: 'GA 2', level: 'main', baseAngle: 305, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ga-3', name: 'GA 3', level: 'main', baseAngle: 325, angleSpan: 20, covered: true, price: 'value' },
      // Outfield
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 35, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  // Carolina League
  '5345': { // Augusta GreenJackets - SRP Park
    name: 'SRP Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 195, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 205, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 215, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 225, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 235, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 245, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 255, angleSpan: 10, covered: false, price: 'standard' },
      // Club Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 195, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 205, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 215, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 225, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 265, angleSpan: 40, covered: false, price: 'value' },
      { id: 'terrace-club', name: 'Terrace Club', level: 'club', baseAngle: 215, angleSpan: 20, covered: true, price: 'luxury' }
    ]
  },

  '2625': { // Carolina Mudcats - Five County Stadium
    name: 'Five County Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'cattails', name: 'Cattails', level: 'field', baseAngle: 20, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2540': { // Charleston RiverDogs - Joseph P. Riley Jr. Park
    name: 'Joseph P. Riley Jr. Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Grandstand
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 0, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 50, angleSpan: 40, covered: false, price: 'value' },
      { id: 'piazza', name: 'Piazza', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '4980': { // Columbia Fireflies - Segra Park
    name: 'Segra Park',
    sections: [
      // Field Level
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      // Upper Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 30, angleSpan: 40, covered: false, price: 'value' },
      { id: 'outfield-terrace', name: 'Outfield Terrace', level: 'field', baseAngle: 70, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2729': { // Delmarva Shorebirds - Arthur W. Perdue Stadium
    name: 'Arthur W. Perdue Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 110, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 120, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 60, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 70, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 80, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 90, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 100, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'picnic-porch', name: 'Picnic Porch', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 150, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2777': { // Down East Wood Ducks - Grainger Stadium
    name: 'Grainger Stadium',
    sections: [
      // Box Seats
      { id: 'sec-a', name: 'A', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-b', name: 'B', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-c', name: 'C', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-d', name: 'D', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-e', name: 'E', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-f', name: 'F', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-g', name: 'G', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      // Grandstand
      { id: 'grandstand-1', name: 'Grandstand 1', level: 'main', baseAngle: 10, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'grandstand-2', name: 'Grandstand 2', level: 'main', baseAngle: 25, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'grandstand-3', name: 'Grandstand 3', level: 'main', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'grandstand-4', name: 'Grandstand 4', level: 'main', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      // Outfield
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 100, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '5400': { // Fayetteville Woodpeckers - Segra Stadium
    name: 'Segra Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 0, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 50, angleSpan: 40, covered: false, price: 'value' },
      { id: 'peck-deck', name: 'Peck Deck', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '5520': { // Fredericksburg Nationals - Virginia Credit Union Stadium
    name: 'Virginia Credit Union Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'founders-club', name: 'Founders Club', level: 'club', baseAngle: 330, angleSpan: 20, covered: true, price: 'luxury' }
    ]
  },

  '2764': { // Kannapolis Cannon Ballers - Atrium Health Ballpark
    name: 'Atrium Health Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'homers-porch', name: 'Homer\'s Porch', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2803': { // Lynchburg Hillcats - Bank of the James Stadium
    name: 'Bank of the James Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 355, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2747': { // Myrtle Beach Pelicans - Pelicans Ballpark
    name: 'Pelicans Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 30, angleSpan: 30, covered: false, price: 'value' },
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2840': { // Salem Red Sox - Carilion Clinic Field
    name: 'Carilion Clinic Field at Salem Memorial Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 355, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 5, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 15, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 25, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 35, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 85, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  // Florida State League
  '2526': { // Bradenton Marauders - LECOM Park
    name: 'LECOM Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      // Grandstand
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 0, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 40, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 70, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2700': { // Clearwater Threshers - BayCare Ballpark
    name: 'BayCare Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      // Club Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'tiki-pavilion', name: 'Tiki Pavilion', level: 'field', baseAngle: 30, angleSpan: 30, covered: false, price: 'standard' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' }
    ]
  },

  '2787': { // Daytona Tortugas - Jackie Robinson Ballpark
    name: 'Jackie Robinson Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'standard' },
      // Grandstand
      { id: 'grandstand-1', name: 'Grandstand 1', level: 'main', baseAngle: 40, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'grandstand-2', name: 'Grandstand 2', level: 'main', baseAngle: 55, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'grandstand-3', name: 'Grandstand 3', level: 'main', baseAngle: 70, angleSpan: 15, covered: true, price: 'value' },
      { id: 'grandstand-4', name: 'Grandstand 4', level: 'main', baseAngle: 85, angleSpan: 15, covered: true, price: 'value' },
      // Outfield
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 110, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2536': { // Dunedin Blue Jays - TD Ballpark
    name: 'TD Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'tiki-bar', name: 'Tiki Bar', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 35, angleSpan: 30, covered: false, price: 'value' }
    ]
  },

  '2862': { // Fort Myers Mighty Mussels - Hammond Stadium
    name: 'Hammond Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 345, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 25, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 55, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2520': { // Jupiter Hammerheads & Palm Beach Cardinals - Roger Dean Chevrolet Stadium
    name: 'Roger Dean Chevrolet Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 345, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 15, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 55, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2511': { // Lakeland Flying Tigers - Publix Field
    name: 'Publix Field at Joker Marchant Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2856': { // St. Lucie Mets - Clover Park
    name: 'Clover Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 35, angleSpan: 30, covered: false, price: 'value' }
    ]
  },

  '2523': { // Tampa Tarpons - George M. Steinbrenner Field
    name: 'George M. Steinbrenner Field',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 60, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 70, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 80, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 110, angleSpan: 30, covered: false, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 140, angleSpan: 30, covered: false, price: 'value' }
    ]
  }
};