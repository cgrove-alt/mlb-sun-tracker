// Real sections for all 30 A+ stadiums
export const allAPlusStadiums: Record<string, { name: string; sections: any[] }> = {
  // South Atlantic League
  '2837': { // Aberdeen IronBirds - Leidos Field at Ripken Stadium
    name: 'Leidos Field at Ripken Stadium',
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
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 350, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 0, angleSpan: 10, covered: false, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 40, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2807': { // Asheville Tourists - McCormick Field
    name: 'McCormick Field',
    sections: [
      // Historic ballpark with unique layout
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 110, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 120, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 130, angleSpan: 10, covered: false, price: 'standard' },
      // Grandstand
      { id: 'grandstand-1', name: 'Grandstand 1', level: 'main', baseAngle: 60, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'grandstand-2', name: 'Grandstand 2', level: 'main', baseAngle: 75, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'grandstand-3', name: 'Grandstand 3', level: 'main', baseAngle: 90, angleSpan: 15, covered: true, price: 'value' },
      { id: 'grandstand-4', name: 'Grandstand 4', level: 'main', baseAngle: 105, angleSpan: 15, covered: true, price: 'value' },
      // Outfield
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 140, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 170, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '3569': { // Bowling Green Hot Rods - Bowling Green Ballpark
    name: 'Bowling Green Ballpark',
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
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'ga-lawn', name: 'GA Lawn', level: 'berm', baseAngle: 5, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 45, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2795': { // Brooklyn Cyclones - Maimonides Park
    name: 'Maimonides Park',
    sections: [
      // Field Box
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 165, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 175, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 185, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 195, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 205, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 215, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 225, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 235, angleSpan: 10, covered: false, price: 'standard' },
      // Box MVP
      { id: 'sec-9', name: '9', level: 'main', baseAngle: 165, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-10', name: '10', level: 'main', baseAngle: 175, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-11', name: '11', level: 'main', baseAngle: 185, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-12', name: '12', level: 'main', baseAngle: 195, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-13', name: '13', level: 'main', baseAngle: 205, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-14', name: '14', level: 'main', baseAngle: 215, angleSpan: 10, covered: false, price: 'value' },
      // Special Areas
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 245, angleSpan: 30, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 275, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2723': { // Greensboro Grasshoppers - First National Bank Field
    name: 'First National Bank Field',
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
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 50, angleSpan: 40, covered: false, price: 'value' },
      { id: 'red-wings-deck', name: 'Red Wings Deck', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '3429': { // Greenville Drive - Fluor Field at the West End
    name: 'Fluor Field at the West End',
    sections: [
      // Field Boxes (Green Monster replica)
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      // Pavilion Reserved
      { id: 'sec-200', name: '200', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Special Areas
      { id: 'green-monster', name: 'Green Monster', level: 'field', baseAngle: 30, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2796': { // Hickory Crawdads - L.P. Frans Stadium
    name: 'L.P. Frans Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Grandstand
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2757': { // Hudson Valley Renegades - Heritage Financial Park
    name: 'Heritage Financial Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 30, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2866': { // Jersey Shore BlueClaws - ShoreTown Ballpark
    name: 'ShoreTown Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 0, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 100, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '3394': { // Rome Braves - AdventHealth Stadium
    name: 'AdventHealth Stadium',
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
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 30, angleSpan: 40, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 70, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2793': { // Wilmington Blue Rocks - Daniel S. Frawley Stadium
    name: 'Daniel S. Frawley Stadium',
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
      { id: 'riverfront-club', name: 'Riverfront Club', level: 'club', baseAngle: 330, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  '4089': { // Winston-Salem Dash - Truist Stadium
    name: 'Truist Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 350, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 0, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'outfield-reserved', name: 'Outfield Reserved', level: 'field', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  // Midwest League
  '5525': { // Beloit Sky Carp - ABC Supply Stadium
    name: 'ABC Supply Stadium',
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
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2857': { // Cedar Rapids Kernels - Veterans Memorial Stadium
    name: 'Veterans Memorial Stadium',
    sections: [
      // Box Seats
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-8', name: '8', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-9', name: '9', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-10', name: '10', level: 'main', baseAngle: 60, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-11', name: '11', level: 'main', baseAngle: 70, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-12', name: '12', level: 'main', baseAngle: 80, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 110, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 140, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2766': { // Dayton Dragons - Day Air Ballpark
    name: 'Day Air Ballpark',
    sections: [
      // Field Level
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'standard' },
      // Plaza Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 25, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 35, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 45, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 55, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 65, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'main', baseAngle: 75, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 105, angleSpan: 40, covered: false, price: 'value' },
      { id: 'dragon-lair', name: 'Dragon Lair', level: 'field', baseAngle: 145, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '3790': { // Fort Wayne TinCaps - Parkview Field
    name: 'Parkview Field',
    sections: [
      // Field Level
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'standard' },
      // Upper Level
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 60, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'harrison-square-club', name: 'Harrison Square Club', level: 'club', baseAngle: 40, angleSpan: 30, covered: true, price: 'luxury' }
    ]
  },

  '3189': { // Great Lakes Loons - Dow Diamond
    name: 'Dow Diamond',
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
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2759': { // Lake County Captains - Classic Park
    name: 'Classic Park',
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

  '2822': { // Lansing Lugnuts - Jackson Field
    name: 'Jackson Field',
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
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 25, angleSpan: 40, covered: false, price: 'value' },
      { id: 'pepsi-porch', name: 'Pepsi Porch', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2821': { // Peoria Chiefs - Dozer Park
    name: 'Dozer Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 105, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 35, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 45, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 55, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 65, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 75, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 115, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 155, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2790': { // Quad Cities River Bandits - Modern Woodmen Park
    name: 'Modern Woodmen Park',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 130, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 140, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 150, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 160, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 170, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 180, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 190, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 200, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 130, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 140, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 150, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 160, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 170, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'field', baseAngle: 210, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'bandits-landing', name: 'Bandits Landing', level: 'field', baseAngle: 230, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 250, angleSpan: 30, covered: false, price: 'value' }
    ]
  },

  '2850': { // South Bend Cubs - Four Winds Field
    name: 'Four Winds Field',
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
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 130, angleSpan: 40, covered: false, price: 'value' },
      { id: 'performance-center', name: 'Performance Center', level: 'field', baseAngle: 170, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2765': { // West Michigan Whitecaps - LMCU Ballpark
    name: 'LMCU Ballpark',
    sections: [
      // Box Seats
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Seating
      { id: 'sec-200', name: '200', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 25, angleSpan: 40, covered: false, price: 'value' },
      { id: 'left-field-lofts', name: 'Left Field Lofts', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2771': { // Wisconsin Timber Rattlers - Neuroscience Group Field
    name: 'Neuroscience Group Field at Fox Cities Stadium',
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
      // Reserved Seating
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 285, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 295, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 5, angleSpan: 40, covered: false, price: 'value' },
      { id: 'snake-pit', name: 'Snake Pit', level: 'field', baseAngle: 45, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  // Northwest League
  '4109': { // Eugene Emeralds - PK Park
    name: 'PK Park',
    sections: [
      // Box Seats
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      // General Admission
      { id: 'sec-8', name: '8', level: 'main', baseAngle: 310, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-9', name: '9', level: 'main', baseAngle: 320, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-10', name: '10', level: 'main', baseAngle: 330, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-11', name: '11', level: 'main', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      // Outfield
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-plaza', name: 'Party Plaza', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2762': { // Everett AquaSox - Funko Field
    name: 'Funko Field',
    sections: [
      // Grandstand
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 310, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 325, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 355, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'standard' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'standard' },
      // General Admission
      { id: 'ga-1', name: 'GA 1', level: 'main', baseAngle: 310, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ga-2', name: 'GA 2', level: 'main', baseAngle: 330, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ga-3', name: 'GA 3', level: 'main', baseAngle: 350, angleSpan: 20, covered: true, price: 'value' },
      // Outfield
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 40, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '4429': { // Hillsboro Hops - Ron Tonkin Field
    name: 'Ron Tonkin Field',
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
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 355, angleSpan: 40, covered: false, price: 'value' },
      { id: 'hop-yard', name: 'Hop Yard', level: 'field', baseAngle: 35, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2730': { // Spokane Indians - Avista Stadium
    name: 'Avista Stadium',
    sections: [
      // Box Seats
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      // Reserved Grandstand
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 300, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 20, angleSpan: 30, covered: false, price: 'value' },
      { id: 'pepsi-porch', name: 'Pepsi Porch', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2826': { // Tri-City Dust Devils - Gesa Stadium
    name: 'Gesa Stadium',
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
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ]
  },

  '2817': { // Vancouver Canadians - Nat Bailey Stadium
    name: 'Nat Bailey Stadium',
    sections: [
      // Box Seats
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'standard' },
      // Grandstand
      { id: 'sec-11', name: '11', level: 'main', baseAngle: 15, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-12', name: '12', level: 'main', baseAngle: 25, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-13', name: '13', level: 'main', baseAngle: 35, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-14', name: '14', level: 'main', baseAngle: 45, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-15', name: '15', level: 'main', baseAngle: 55, angleSpan: 10, covered: true, price: 'value' },
      // Outfield
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 85, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-zone', name: 'Party Zone', level: 'field', baseAngle: 115, angleSpan: 20, covered: false, price: 'standard' }
    ]
  }
};