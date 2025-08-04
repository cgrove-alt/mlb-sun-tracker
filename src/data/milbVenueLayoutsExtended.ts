// Extended venue-specific layouts for additional MiLB stadiums
// Focuses on remaining AAA and AA stadiums

import { VenueLayout, VenueSection } from './milbVenueLayouts';

// Additional AAA Stadium Layouts
export const additionalAAALayouts: VenueLayout[] = [
  {
    venueId: 'durham-bulls',
    venueName: 'Durham Bulls Athletic Park',
    lastUpdated: '2024-01',
    sections: [
      // Diamond View Box Seats
      { id: 'dvb-101', name: 'Diamond View Box 101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dvb-102', name: 'Diamond View Box 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dvb-103', name: 'Diamond View Box 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dvb-104', name: 'Diamond View Box 104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dvb-105', name: 'Diamond View Box 105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Infield Box Seats
      { id: 'ib-106', name: 'Infield Box 106', level: 'lower', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-107', name: 'Infield Box 107', level: 'lower', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-108', name: 'Infield Box 108', level: 'lower', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-109', name: 'Infield Box 109', level: 'lower', baseAngle: 60, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-110', name: 'Infield Box 110', level: 'lower', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Third Base Side
      { id: 'ib-111', name: 'Infield Box 111', level: 'lower', baseAngle: 290, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-112', name: 'Infield Box 112', level: 'lower', baseAngle: 300, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-113', name: 'Infield Box 113', level: 'lower', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-114', name: 'Infield Box 114', level: 'lower', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-115', name: 'Infield Box 115', level: 'lower', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Outfield Reserved
      { id: 'or-201', name: 'Outfield Reserved 201', level: 'lower', baseAngle: 80, angleSpan: 15, covered: false, price: 'value' },
      { id: 'or-202', name: 'Outfield Reserved 202', level: 'lower', baseAngle: 95, angleSpan: 15, covered: false, price: 'value' },
      { id: 'or-203', name: 'Outfield Reserved 203', level: 'lower', baseAngle: 265, angleSpan: 15, covered: false, price: 'value' },
      { id: 'or-204', name: 'Outfield Reserved 204', level: 'lower', baseAngle: 280, angleSpan: 15, covered: false, price: 'value' },
      
      // Blue Monster (Left Field Wall)
      { id: 'blue-monster', name: 'Blue Monster', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' },
      
      // Club Level
      { id: 'capitol-club', name: 'Capitol Broadcasting Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' },
      
      // Suites
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 320, angleSpan: 60, covered: true, price: 'luxury' }
    ],
    notes: 'Historic DBAP, features Blue Monster wall in LF, oriented north'
  },
  
  {
    venueId: 'buffalo-bisons',
    venueName: 'Sahlen Field',
    lastUpdated: '2024-01',
    sections: [
      // Field Level Box
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 335, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 346, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 357, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 8, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 19, angleSpan: 11, covered: false, price: 'premium' },
      
      // 100 Level
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 90, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 270, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-113', name: 'Section 113', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-115', name: 'Section 115', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-116', name: 'Section 116', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },
      
      // 200 Level (Upper Deck)
      { id: 'sec-200', name: 'Section 200', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-201', name: 'Section 201', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-202', name: 'Section 202', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-203', name: 'Section 203', level: 'upper', baseAngle: 40, angleSpan: 20, covered: true, price: 'value' },
      
      // Bison Berm (Outfield)
      { id: 'berm', name: 'Bison Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club-seats', name: 'Club Seats', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Buffalo location, upper deck provides cover, oriented northeast'
  },
  
  {
    venueId: 'charlotte-knights',
    venueName: 'Truist Field',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Box
      { id: 'db-101', name: 'Dugout Box 101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'db-102', name: 'Dugout Box 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'db-103', name: 'Dugout Box 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'db-104', name: 'Dugout Box 104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'db-105', name: 'Dugout Box 105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Infield Box
      { id: 'ib-106', name: 'Infield Box 106', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-107', name: 'Infield Box 107', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-108', name: 'Infield Box 108', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-109', name: 'Infield Box 109', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-110', name: 'Infield Box 110', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'ib-111', name: 'Infield Box 111', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'ib-112', name: 'Infield Box 112', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-113', name: 'Infield Box 113', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-114', name: 'Infield Box 114', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-115', name: 'Infield Box 115', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Outfield Reserved
      { id: 'or-201', name: 'Outfield Reserved 201', level: 'lower', baseAngle: 90, angleSpan: 20, covered: false, price: 'value' },
      { id: 'or-202', name: 'Outfield Reserved 202', level: 'lower', baseAngle: 110, angleSpan: 20, covered: false, price: 'value' },
      { id: 'or-203', name: 'Outfield Reserved 203', level: 'lower', baseAngle: 250, angleSpan: 20, covered: false, price: 'value' },
      { id: 'or-204', name: 'Outfield Reserved 204', level: 'lower', baseAngle: 270, angleSpan: 20, covered: false, price: 'value' },
      
      // Knights Deck (RF)
      { id: 'knights-deck', name: 'Knights Deck', level: 'ga', baseAngle: 130, angleSpan: 50, covered: false, price: 'value' },
      
      // Skyline View (CF)
      { id: 'skyline', name: 'Skyline View', level: 'berm', baseAngle: 180, angleSpan: 40, covered: false, price: 'value' },
      
      // Club Level
      { id: 'crown-club', name: 'Crown Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' },
      
      // Suites
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 330, angleSpan: 60, covered: true, price: 'luxury' }
    ],
    notes: 'Uptown Charlotte with city skyline views, oriented northeast'
  }
];

// Additional AA Stadium Layouts
export const additionalAALayouts: VenueLayout[] = [
  {
    venueId: 'harrisburg-senators',
    venueName: 'FNB Field',
    lastUpdated: '2024-01',
    sections: [
      // Infield Box
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Infield Reserved
      { id: 'res-5', name: 'Reserved 5', level: 'lower', baseAngle: 28, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-6', name: 'Reserved 6', level: 'lower', baseAngle: 42, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-7', name: 'Reserved 7', level: 'lower', baseAngle: 56, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-8', name: 'Reserved 8', level: 'lower', baseAngle: 70, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'res-9', name: 'Reserved 9', level: 'lower', baseAngle: 290, angleSpan: 14, covered: false, price: 'value' },
      { id: 'res-10', name: 'Reserved 10', level: 'lower', baseAngle: 304, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-11', name: 'Reserved 11', level: 'lower', baseAngle: 318, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-12', name: 'Reserved 12', level: 'lower', baseAngle: 332, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Outfield Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 84, angleSpan: 46, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 230, angleSpan: 46, covered: false, price: 'value' },
      
      // Riverside Picnic Area
      { id: 'riverside', name: 'Riverside Picnic Area', level: 'ga', baseAngle: 130, angleSpan: 50, covered: false, price: 'value' },
      
      // Boardwalk (CF)
      { id: 'boardwalk', name: 'Boardwalk', level: 'berm', baseAngle: 180, angleSpan: 50, covered: false, price: 'value' },
      
      // Skybox Suites
      { id: 'skybox', name: 'Skybox Suites', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Located on City Island in Susquehanna River, oriented northeast'
  },
  
  {
    venueId: 'portland-sea-dogs',
    venueName: 'Hadlock Field',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-1', name: 'Field Box 1', level: 'field', baseAngle: 335, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-2', name: 'Field Box 2', level: 'field', baseAngle: 348, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-3', name: 'Field Box 3', level: 'field', baseAngle: 1, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-4', name: 'Field Box 4', level: 'field', baseAngle: 14, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-5', name: 'Field Box 5', level: 'field', baseAngle: 27, angleSpan: 13, covered: false, price: 'premium' },
      
      // Reserved Grandstand
      { id: 'rg-101', name: 'Reserved 101', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rg-102', name: 'Reserved 102', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rg-103', name: 'Reserved 103', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'value' },
      { id: 'rg-104', name: 'Reserved 104', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'rg-105', name: 'Reserved 105', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'rg-106', name: 'Reserved 106', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'value' },
      { id: 'rg-107', name: 'Reserved 107', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rg-108', name: 'Reserved 108', level: 'lower', baseAngle: 320, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Maine Monster (LF Wall - 37 feet high)
      { id: 'monster', name: 'Maine Monster', level: 'ga', baseAngle: 180, angleSpan: 40, covered: false, price: 'value' },
      
      // Pavilion
      { id: 'pavilion', name: 'Pavilion', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      
      // Picnic Area
      { id: 'picnic', name: 'Picnic Area', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' },
      
      // Sea Dog Suites
      { id: 'suites', name: 'Sea Dog Suites', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Features Maine Monster (Green Monster replica), oriented northeast'
  },
  
  {
    venueId: 'richmond-flying-squirrels',
    venueName: 'The Diamond',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-101', name: 'Box 101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-102', name: 'Box 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-103', name: 'Box 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-104', name: 'Box 104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-105', name: 'Box 105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Lower Reserved
      { id: 'lr-201', name: 'Lower Reserved 201', level: 'lower', baseAngle: 30, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-202', name: 'Lower Reserved 202', level: 'lower', baseAngle: 45, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-203', name: 'Lower Reserved 203', level: 'lower', baseAngle: 60, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-204', name: 'Lower Reserved 204', level: 'lower', baseAngle: 75, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'lr-205', name: 'Lower Reserved 205', level: 'lower', baseAngle: 285, angleSpan: 15, covered: false, price: 'value' },
      { id: 'lr-206', name: 'Lower Reserved 206', level: 'lower', baseAngle: 300, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-207', name: 'Lower Reserved 207', level: 'lower', baseAngle: 315, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-208', name: 'Lower Reserved 208', level: 'lower', baseAngle: 330, angleSpan: 15, covered: false, price: 'moderate' },
      
      // General Admission
      { id: 'ga-rf', name: 'Right Field GA', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'ga-lf', name: 'Left Field GA', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      
      // Funnville (Kids Area)
      { id: 'funnville', name: 'Funnville', level: 'ga', baseAngle: 135, angleSpan: 45, covered: false, price: 'value' },
      
      // Party Deck
      { id: 'party-deck', name: 'Party Deck', level: 'club', baseAngle: 180, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Classic stadium opened 1985, future replacement planned'
  }
];

// Combine all extended layouts
export const allExtendedLayouts = [
  ...additionalAAALayouts,
  ...additionalAALayouts
];