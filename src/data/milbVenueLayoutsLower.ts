// Lower level MiLB venue layouts (A+ and A levels)
// Consolidated from multiple files for A+ (High-A) and A (Low-A) venues

import { VenueLayout, VenueSection } from './milbVenueLayouts';

// A+ (High-A) Stadium Layouts - All A+ venues consolidated
export const aPlusVenueLayouts: VenueLayout[] = [
  {
    venueId: 'aberdeen-ironbirds',
    venueName: 'Leidos Field at Ripken Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 0, angleSpan: 10, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 40, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Cal Ripken designed stadium, oriented northeast'
  },

  {
    venueId: 'asheville-tourists',
    venueName: 'McCormick Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 110, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 120, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 130, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'grandstand-1', name: 'Grandstand 1', level: 'upper', baseAngle: 60, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'grandstand-2', name: 'Grandstand 2', level: 'upper', baseAngle: 75, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'grandstand-3', name: 'Grandstand 3', level: 'upper', baseAngle: 90, angleSpan: 15, covered: true, price: 'value' },
      { id: 'grandstand-4', name: 'Grandstand 4', level: 'upper', baseAngle: 105, angleSpan: 15, covered: true, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 140, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 170, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Historic stadium built in 1924, mountain views beyond outfield'
  },

  {
    venueId: 'beloit-sky-carp',
    venueName: 'ABC Supply Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Opened 2021, Rock River location, modern amenities'
  },

  {
    venueId: 'bowling-green-hot-rods',
    venueName: 'Bowling Green Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'ga-lawn', name: 'GA Lawn', level: 'berm', baseAngle: 5, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 45, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Rays affiliate, compact modern stadium'
  },

  {
    venueId: 'brooklyn-cyclones',
    venueName: 'Maimonides Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 165, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 175, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 185, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 195, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 205, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 215, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 225, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 235, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-9', name: '9', level: 'upper', baseAngle: 165, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-10', name: '10', level: 'upper', baseAngle: 175, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-11', name: '11', level: 'upper', baseAngle: 185, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-12', name: '12', level: 'upper', baseAngle: 195, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-13', name: '13', level: 'upper', baseAngle: 205, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-14', name: '14', level: 'upper', baseAngle: 215, angleSpan: 10, covered: false, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 245, angleSpan: 30, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 275, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Coney Island boardwalk location, Atlantic Ocean views'
  },

  {
    venueId: 'cedar-rapids-kernels',
    venueName: 'Veterans Memorial Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'upper', baseAngle: 40, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-9', name: '9', level: 'upper', baseAngle: 50, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-10', name: '10', level: 'upper', baseAngle: 60, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-11', name: '11', level: 'upper', baseAngle: 70, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-12', name: '12', level: 'upper', baseAngle: 80, angleSpan: 10, covered: true, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 110, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 140, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Classic midwestern ballpark, Twins affiliate'
  },

  {
    venueId: 'dayton-dragons',
    venueName: 'Day Air Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 25, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 35, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 45, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 55, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 65, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 75, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 105, angleSpan: 40, covered: false, price: 'value' },
      { id: 'dragon-lair', name: 'Dragon Lair', level: 'field', baseAngle: 145, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Dayton, famous for sellout streak'
  },

  {
    venueId: 'daytona-tortugas',
    venueName: 'Jackie Robinson Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 355.7142857142857, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 11.428571428571445, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 27.14285714285711, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 42.85714285714283, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 58.571428571428555, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 74.28571428571428, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 280, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Historic park where Jackie Robinson broke the color barrier, 1946'
  },

  {
    venueId: 'eugene-emeralds',
    venueName: 'PK Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'upper', baseAngle: 310, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-9', name: '9', level: 'upper', baseAngle: 320, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-10', name: '10', level: 'upper', baseAngle: 330, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-11', name: '11', level: 'upper', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-plaza', name: 'Party Plaza', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Shared with University of Oregon Ducks, modern facility'
  },

  {
    venueId: 'everett-aquasox',
    venueName: 'Funko Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 310, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 325, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 355, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'ga-1', name: 'GA 1', level: 'upper', baseAngle: 310, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ga-2', name: 'GA 2', level: 'upper', baseAngle: 330, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ga-3', name: 'GA 3', level: 'upper', baseAngle: 350, angleSpan: 20, covered: true, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Mariners affiliate, Funko Pop themed elements'
  },

  {
    venueId: 'fort-myers-mighty-mussels',
    venueName: 'Hammond Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 355.7142857142857, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 11.428571428571445, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 27.14285714285711, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 42.85714285714283, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 58.571428571428555, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 74.28571428571428, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 280, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Twins spring training facility, tropical setting'
  },

  {
    venueId: 'greensboro-grasshoppers',
    venueName: 'First National Bank Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 50, angleSpan: 40, covered: false, price: 'value' },
      { id: 'red-wings-deck', name: 'Red Wings Deck', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Greensboro, opened 2005'
  },

  {
    venueId: 'greenville-drive',
    venueName: 'Fluor Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'green-monster', name: 'Green Monster', level: 'field', baseAngle: 30, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Fenway Park replica with Green Monster, downtown Greenville SC'
  },

  {
    venueId: 'hillsboro-hops',
    venueName: 'Ron Tonkin Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 355, angleSpan: 40, covered: false, price: 'value' },
      { id: 'hop-yard', name: 'Hop Yard', level: 'field', baseAngle: 35, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Suburban Portland location, craft beer theme'
  },

  {
    venueId: 'hudson-valley-renegades',
    venueName: 'Heritage Financial Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 30, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Hudson River Valley location, mountain views'
  },

  {
    venueId: 'jersey-shore-blueclaws',
    venueName: 'ShoreTown Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 100, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Jersey Shore location, beach-themed atmosphere'
  },

  {
    venueId: 'lakeland-flying-tigers',
    venueName: 'Publix Field at Joker Marchant Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 355.7142857142857, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 11.428571428571445, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 27.14285714285711, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 42.85714285714283, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 58.571428571428555, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 74.28571428571428, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 280, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Tigers spring training facility, lakefront location'
  },

  {
    venueId: 'lansing-lugnuts',
    venueName: 'Jackson Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 25, angleSpan: 40, covered: false, price: 'value' },
      { id: 'pepsi-porch', name: 'Pepsi Porch', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Lansing, Capitol building views'
  },

  {
    venueId: 'rome-emperors',
    venueName: 'AdventHealth Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 30, angleSpan: 40, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 70, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Formerly Rome Braves, rebranded 2024'
  },

  {
    venueId: 'south-bend-cubs',
    venueName: 'Four Winds Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 110, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 120, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 60, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 70, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 80, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 90, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 100, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 130, angleSpan: 40, covered: false, price: 'value' },
      { id: 'performance-center', name: 'Performance Center', level: 'field', baseAngle: 170, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Cubs affiliate, downtown South Bend location'
  },

  {
    venueId: 'spokane-indians',
    venueName: 'Avista Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 300, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 20, angleSpan: 30, covered: false, price: 'value' },
      { id: 'pepsi-porch', name: 'Pepsi Porch', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Northwest League, Spokane River location'
  },

  {
    venueId: 'vancouver-canadians',
    venueName: 'Nat Bailey Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-11', name: '11', level: 'upper', baseAngle: 15, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-12', name: '12', level: 'upper', baseAngle: 25, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-13', name: '13', level: 'upper', baseAngle: 35, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-14', name: '14', level: 'upper', baseAngle: 45, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-15', name: '15', level: 'upper', baseAngle: 55, angleSpan: 10, covered: true, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 85, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-zone', name: 'Party Zone', level: 'field', baseAngle: 115, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Historic stadium from 1951, mountain views'
  },

  {
    venueId: 'wilmington-blue-rocks',
    venueName: 'Frawley Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 30, angleSpan: 40, covered: false, price: 'value' },
      { id: 'riverfront-club', name: 'Riverfront Club', level: 'club', baseAngle: 330, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Riverfront location in downtown Wilmington'
  },

  {
    venueId: 'winston-salem-dash',
    venueName: 'Truist Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'value' },
      { id: 'outfield-reserved', name: 'Outfield Reserved', level: 'field', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Winston-Salem, skyline views'
  },

  {
    venueId: 'west-michigan-whitecaps',
    venueName: 'LMCU Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 25, angleSpan: 40, covered: false, price: 'value' },
      { id: 'left-field-lofts', name: 'Left Field Lofts', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Tigers affiliate, family-friendly atmosphere'
  },

  {
    venueId: 'wisconsin-timber-rattlers',
    venueName: 'Neuroscience Group Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 5, angleSpan: 40, covered: false, price: 'value' },
      { id: 'snake-pit', name: 'Snake Pit', level: 'field', baseAngle: 45, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Brewers affiliate, Fox River location'
  },

  {
    venueId: 'peoria-chiefs',
    venueName: 'Dozer Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 105, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 35, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 45, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 55, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 65, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 75, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 115, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 155, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Peoria, IL along Illinois River, Cardinals affiliate'
  },

  {
    venueId: 'quad-cities-river-bandits',
    venueName: 'Modern Woodmen Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 130, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 140, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 150, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 160, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 170, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 180, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 190, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 200, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 130, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 140, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 150, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 160, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 170, angleSpan: 10, covered: true, price: 'value' },
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'field', baseAngle: 210, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'bandits-landing', name: 'Bandits Landing', level: 'field', baseAngle: 230, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 250, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Davenport, IA on Mississippi River, opened 1931'
  },

  {
    venueId: 'great-lakes-loons',
    venueName: 'Dow Diamond',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Midland, MI, Dodgers affiliate, opened 2007'
  },

  {
    venueId: 'lake-county-captains',
    venueName: 'Classic Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 40, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Eastlake, OH near Lake Erie, Guardians affiliate'
  },

  {
    venueId: 'tri-city-dust-devils',
    venueName: 'Gesa Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Pasco, WA in Columbia River valley, Angels affiliate'
  }
,
  
  {
    venueId: 'hickory-crawdads',
    venueName: 'L.P. Frans Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 40, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Hickory, NC with mountain views'
  },
  
  {
    venueId: 'fort-wayne-tincaps',
    venueName: 'Parkview Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 40, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 60, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'harrison-square-club', name: 'Harrison Square Club', level: 'club', baseAngle: 40, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Fort Wayne, IN - Downtown ballpark with city skyline views'
  },
];

// A (Low-A) Stadium Layouts - All A venues consolidated  
export const aVenueLayouts: VenueLayout[] = [
  {
    venueId: 'augusta-greenjackets',
    venueName: 'SRP Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 195, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 205, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 215, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 225, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 235, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 245, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 255, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 195, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 205, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 215, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 225, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 265, angleSpan: 40, covered: false, price: 'value' },
      { id: 'terrace-club', name: 'Terrace Club', level: 'club', baseAngle: 215, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Opened 2018, Savannah River views, downtown North Augusta'
  },

  {
    venueId: 'bradenton-marauders',
    venueName: 'LECOM Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 40, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 70, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Pirates spring training facility, Gulf Coast location'
  },

  {
    venueId: 'carolina-mudcats',
    venueName: 'Five County Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'cattails', name: 'Cattails', level: 'field', baseAngle: 20, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Brewers affiliate, rural North Carolina setting'
  },

  {
    venueId: 'charleston-riverdogs',
    venueName: 'Joseph P. Riley Jr. Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 50, angleSpan: 40, covered: false, price: 'value' },
      { id: 'piazza', name: 'Piazza', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Charleston on the Ashley River, "The Joe"'
  },

  {
    venueId: 'clearwater-threshers',
    venueName: 'BayCare Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'tiki-pavilion', name: 'Tiki Pavilion', level: 'field', baseAngle: 30, angleSpan: 30, covered: false, price: 'moderate' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Phillies spring training complex, Clearwater Beach nearby'
  },

  {
    venueId: 'columbia-fireflies',
    venueName: 'Segra Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 30, angleSpan: 40, covered: false, price: 'value' },
      { id: 'outfield-terrace', name: 'Outfield Terrace', level: 'field', baseAngle: 70, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Opened 2016, downtown Columbia views of State House'
  },

  {
    venueId: 'delmarva-shorebirds',
    venueName: 'Arthur W. Perdue Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 110, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 120, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 60, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 70, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 80, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 90, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 100, angleSpan: 10, covered: true, price: 'value' },
      { id: 'picnic-porch', name: 'Picnic Porch', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 150, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Eastern Shore of Maryland, Orioles affiliate'
  },

  {
    venueId: 'down-east-wood-ducks',
    venueName: 'Grainger Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-a', name: 'A', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-b', name: 'B', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-c', name: 'C', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-d', name: 'D', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-e', name: 'E', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-f', name: 'F', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-g', name: 'G', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'grandstand-1', name: 'Grandstand 1', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'grandstand-2', name: 'Grandstand 2', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'grandstand-3', name: 'Grandstand 3', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'grandstand-4', name: 'Grandstand 4', level: 'upper', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 100, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Historic stadium from 1949, Eastern North Carolina'
  },

  {
    venueId: 'dunedin-blue-jays',
    venueName: 'TD Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      { id: 'tiki-bar', name: 'Tiki Bar', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 35, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Blue Jays spring training facility, renovated 2020'
  },

  {
    venueId: 'fayetteville-woodpeckers',
    venueName: 'Segra Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 50, angleSpan: 40, covered: false, price: 'value' },
      { id: 'peck-deck', name: 'Peck Deck', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Opened 2019, downtown Fayetteville, Fort Liberty nearby'
  },

  {
    venueId: 'fort-wayne-tincaps',
    venueName: 'Parkview Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 358.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 71.66666666666663, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 284, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 298, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 312, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 326, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Downtown Fort Wayne, award-winning design, opened 2009'
  },

  {
    venueId: 'fredericksburg-nationals',
    venueName: 'Virginia Credit Union Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'founders-club', name: 'Founders Club', level: 'club', baseAngle: 330, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Opened 2020, Nationals affiliate, modern amenities'
  },

  {
    venueId: 'fresno-grizzlies',
    venueName: 'Chukchansi Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 25, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Fresno, formerly AAA, now Single-A'
  },

  {
    venueId: 'great-lakes-loons',
    venueName: 'Dow Diamond',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 358.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 71.66666666666663, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 284, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 298, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 312, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 326, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Midland, Michigan, Great Lakes Bay Region'
  },

  {
    venueId: 'hickory-crawdads',
    venueName: 'L.P. Frans Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 358.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 71.66666666666663, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 284, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 298, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 312, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 326, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Rangers affiliate, foothills of North Carolina'
  },

  {
    venueId: 'inland-empire-66ers',
    venueName: 'San Manuel Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 30, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 70, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'San Bernardino, historic Route 66 theme'
  },

  {
    venueId: 'jupiter-hammerheads',
    venueName: 'Roger Dean Chevrolet Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 345, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 15, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 55, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Shared with Cardinals spring training, Palm Beach County'
  },

  {
    venueId: 'kannapolis-cannon-ballers',
    venueName: 'Atrium Health Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'homers-porch', name: 'Homer\'s Porch', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Opened 2020, downtown Kannapolis, White Sox affiliate'
  },

  {
    venueId: 'lake-elsinore-storm',
    venueName: 'Lake Elsinore Diamond',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'outfield-pavilion', name: 'Outfield Pavilion', level: 'field', baseAngle: 5, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-plaza', name: 'Party Plaza', level: 'field', baseAngle: 35, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Padres affiliate, lake views, Southern California'
  },

  {
    venueId: 'lynchburg-hillcats',
    venueName: 'Bank of the James Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 355, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Blue Ridge Mountain views, Guardians affiliate'
  },

  {
    venueId: 'modesto-nuts',
    venueName: 'John Thurman Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-11', name: '11', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-12', name: '12', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-13', name: '13', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-14', name: '14', level: 'upper', baseAngle: 40, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-15', name: '15', level: 'upper', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 80, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-area', name: 'Party Area', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Central Valley location, Mariners affiliate'
  },

  {
    venueId: 'myrtle-beach-pelicans',
    venueName: 'Pelicans Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 30, angleSpan: 30, covered: false, price: 'value' },
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Near Myrtle Beach attractions, Cubs affiliate'
  },

  {
    venueId: 'palm-beach-cardinals',
    venueName: 'Roger Dean Chevrolet Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 345, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 15, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 55, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Shared with Jupiter Hammerheads, Cardinals spring training'
  },

  {
    venueId: 'quad-cities-river-bandits',
    venueName: 'Modern Woodmen Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 358.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 71.66666666666663, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 284, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 298, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 312, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 326, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Mississippi River location, historic ballpark from 1931'
  },

  {
    venueId: 'rancho-cucamonga-quakes',
    venueName: 'LoanMart Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'pavilion', name: 'Pavilion', level: 'field', baseAngle: 5, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-zone', name: 'Party Zone', level: 'field', baseAngle: 35, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'San Bernardino County, mountain views'
  },

  {
    venueId: 'salem-red-sox',
    venueName: 'Carilion Clinic Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 355, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 5, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 15, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 25, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 35, angleSpan: 10, covered: true, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 85, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Roanoke Valley, Blue Ridge Mountains backdrop'
  },

  {
    venueId: 'san-jose-giants',
    venueName: 'Excite Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 40, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'bbq-terrace', name: 'BBQ Terrace', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Silicon Valley location, Giants affiliate'
  },

  {
    venueId: 'st-lucie-mets',
    venueName: 'Clover Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 35, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Mets spring training facility, Port St. Lucie'
  },

  {
    venueId: 'stockton-ports',
    venueName: 'Banner Island Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 40, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 60, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown waterfront location, Athletics affiliate'
  },

  {
    venueId: 'tampa-tarpons',
    venueName: 'George M. Steinbrenner Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 40, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 50, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 60, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 70, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 80, angleSpan: 10, covered: true, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 110, angleSpan: 30, covered: false, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 140, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Yankees spring training facility, Tampa Bay area'
  },

  {
    venueId: 'visalia-rawhide',
    venueName: 'Valley Strong Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 285, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 300, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 315, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 330, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 345, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 0, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'ga-1', name: 'GA 1', level: 'upper', baseAngle: 285, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ga-2', name: 'GA 2', level: 'upper', baseAngle: 305, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ga-3', name: 'GA 3', level: 'upper', baseAngle: 325, angleSpan: 20, covered: true, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 35, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Central Valley location, Diamondbacks affiliate'
  },

  {
    venueId: 'west-virginia-power',
    venueName: 'Appalachian Power Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 358.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 71.66666666666663, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 284, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 298, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 312, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 326, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Charleston, WV on Kanawha River, Mariners affiliate'
  },

  {
    venueId: 'asheville-tourists-a',
    venueName: 'McCormick Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 358.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 71.66666666666663, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 284, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 298, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 312, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 326, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Historic ballpark in Blue Ridge Mountains, Astros affiliate'
  },

  {
    venueId: 'greensboro-grasshoppers-a',
    venueName: 'First National Bank Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 358.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 71.66666666666663, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 284, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 298, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 312, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 326, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Greensboro, NC, Pirates affiliate'
  },

  {
    venueId: 'lexington-legends',
    venueName: 'Legends Lane Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 358.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 71.66666666666663, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 284, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 298, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 312, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 326, angleSpan: 10, covered: false, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Lexington, KY, Reds affiliate'
  }
,
  
  {
    venueId: 'lakeland-flying-tigers',
    venueName: 'Publix Field at Joker Marchant Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Lakeland, FL - Spring training home of Detroit Tigers'
  },
  
  {
    venueId: 'daytona-tortugas',
    venueName: 'Jackie Robinson Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'grandstand-1', name: 'Grandstand 1', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'grandstand-2', name: 'Grandstand 2', level: 'upper', baseAngle: 55, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'grandstand-3', name: 'Grandstand 3', level: 'upper', baseAngle: 70, angleSpan: 15, covered: true, price: 'value' },
      { id: 'grandstand-4', name: 'Grandstand 4', level: 'upper', baseAngle: 85, angleSpan: 15, covered: true, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 110, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Daytona Beach, FL - Historic ballpark where Jackie Robinson broke the color barrier'
  },
  
  {
    venueId: 'fort-myers-mighty-mussels',
    venueName: 'Hammond Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 345, angleSpan: 10, covered: true, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 25, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 55, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Fort Myers, FL - Spring training home of Minnesota Twins'
  },
];

// Function to get lower level venue layout by ID
export function getLowerLevelVenueLayout(venueId: string): VenueLayout | undefined {
  return [...aPlusVenueLayouts, ...aVenueLayouts]
    .find(layout => layout.venueId === venueId);
}

// Export all lower level layouts for easy access
export const allLowerLevelLayouts = [
  ...aPlusVenueLayouts,
  ...aVenueLayouts
];
