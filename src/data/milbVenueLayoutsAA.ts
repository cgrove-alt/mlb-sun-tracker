// Complete AA Stadium Layouts (All 28 Teams)
// Double-A venues typically have 5,000-12,000 capacity

import { VenueLayout, VenueSection } from './milbVenueLayouts';

export const aaCompleteLayouts: VenueLayout[] = [
  // Existing 6 stadiums from previous files would be imported here
  // Adding the remaining 22 AA stadiums:
  
  {
    venueId: 'altoona-curve',
    venueName: 'Peoples Natural Gas Field',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club (100 Level) - behind home plate
      { id: 'dc-101', name: 'Diamond Club 101', level: 'field', baseAngle: 355, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'dc-102', name: 'Diamond Club 102', level: 'field', baseAngle: 3, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'dc-103', name: 'Diamond Club 103', level: 'field', baseAngle: 11, angleSpan: 8, covered: false, price: 'premium' },
      
      // Terrace Level (200 Level) - mid-tier seating
      { id: 'ter-201', name: 'Terrace 201', level: 'lower', baseAngle: 19, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'ter-202', name: 'Terrace 202', level: 'lower', baseAngle: 34, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'ter-203', name: 'Terrace 203', level: 'lower', baseAngle: 49, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'ter-204', name: 'Terrace 204', level: 'lower', baseAngle: 64, angleSpan: 15, covered: false, price: 'value' },
      
      // Third base side
      { id: 'ter-205', name: 'Terrace 205', level: 'lower', baseAngle: 296, angleSpan: 15, covered: false, price: 'value' },
      { id: 'ter-206', name: 'Terrace 206', level: 'lower', baseAngle: 311, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'ter-207', name: 'Terrace 207', level: 'lower', baseAngle: 326, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'ter-208', name: 'Terrace 208', level: 'lower', baseAngle: 341, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Grandstand Level (300 Level) - upper seating
      { id: 'gs-301', name: 'Grandstand 301', level: 'upper', baseAngle: 25, angleSpan: 20, covered: true, price: 'value' },
      { id: 'gs-302', name: 'Grandstand 302', level: 'upper', baseAngle: 45, angleSpan: 20, covered: true, price: 'value' },
      { id: 'gs-303', name: 'Grandstand 303', level: 'upper', baseAngle: 315, angleSpan: 20, covered: true, price: 'value' },
      { id: 'gs-304', name: 'Grandstand 304', level: 'upper', baseAngle: 335, angleSpan: 20, covered: true, price: 'value' },
      
      // UPMC Health Plan Home Run Junction (RF Bleachers)
      { id: 'upmc-hrj', name: 'UPMC Home Run Junction', level: 'ga', baseAngle: 79, angleSpan: 45, covered: false, price: 'value' },
      
      // Third Base Picnic Pavilion
      { id: 'tb-picnic', name: 'Third Base Picnic Pavilion', level: 'ga', baseAngle: 241, angleSpan: 35, covered: true, price: 'value' },
      
      // First Base Bleachers
      { id: 'fb-bleachers', name: 'First Base Bleachers', level: 'ga', baseAngle: 124, angleSpan: 32, covered: false, price: 'value' },
      
      // Budweiser Party Deck (Left Field)
      { id: 'bud-party', name: 'Budweiser Party Deck', level: 'club', baseAngle: 276, angleSpan: 25, covered: false, price: 'moderate' },
      
      // Rail Kings (Party Deck edge seating with TVs)
      { id: 'rail-kings', name: 'Rail Kings', level: 'club', baseAngle: 266, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Hillside Seating (behind left field bleachers)
      { id: 'hillside', name: 'Hillside Seating', level: 'berm', baseAngle: 156, angleSpan: 85, covered: false, price: 'value' }
    ],
    notes: 'Altoona, PA with Skyliner roller coaster beyond RF wall, Allegheny Mountains backdrop, double-deck design, 7,210 capacity'
  },
  
  {
    venueId: 'amarillo-sod-poodles',
    venueName: 'HODGETOWN',
    lastUpdated: '2024-01',
    sections: [
      // Club Seats (Premium behind home plate with club access)
      { id: 'club-101', name: 'Club Seats 101', level: 'field', baseAngle: 8, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-102', name: 'Club Seats 102', level: 'field', baseAngle: 18, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-103', name: 'Club Seats 103', level: 'field', baseAngle: 342, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-104', name: 'Club Seats 104', level: 'field', baseAngle: 352, angleSpan: 10, covered: false, price: 'premium' },
      
      // Dugout Seats (Close to team dugouts)
      { id: 'dug-105', name: 'Dugout Seats 105', level: 'field', baseAngle: 28, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dug-106', name: 'Dugout Seats 106', level: 'field', baseAngle: 40, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dug-107', name: 'Dugout Seats 107', level: 'field', baseAngle: 320, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dug-108', name: 'Dugout Seats 108', level: 'field', baseAngle: 332, angleSpan: 12, covered: false, price: 'premium' },
      
      // Field Level Seats (Wrap around field)
      { id: 'field-201', name: 'Field Level 201', level: 'lower', baseAngle: 52, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'field-202', name: 'Field Level 202', level: 'lower', baseAngle: 68, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'field-203', name: 'Field Level 203', level: 'lower', baseAngle: 84, angleSpan: 16, covered: false, price: 'value' },
      
      // Third Base Field Level
      { id: 'field-204', name: 'Field Level 204', level: 'lower', baseAngle: 276, angleSpan: 16, covered: false, price: 'value' },
      { id: 'field-205', name: 'Field Level 205', level: 'lower', baseAngle: 292, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'field-206', name: 'Field Level 206', level: 'lower', baseAngle: 308, angleSpan: 16, covered: false, price: 'moderate' },
      
      // Fairly Group Club Level (Upper level with 360-degree concourse)
      { id: 'fgc-301', name: 'Fairly Group Club 301', level: 'club', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'fgc-302', name: 'Fairly Group Club 302', level: 'club', baseAngle: 360, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'fgc-303', name: 'Fairly Group Club 303', level: 'club', baseAngle: 20, angleSpan: 20, covered: true, price: 'luxury' },
      
      // Party Suites (Luxury boxes with indoor/outdoor seating)
      { id: 'party-suite-1', name: 'Party Suite 1', level: 'suite', baseAngle: 355, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'party-suite-2', name: 'Party Suite 2', level: 'suite', baseAngle: 5, angleSpan: 5, covered: true, price: 'luxury' },
      
      // Pepsi Party Deck (ADA accessible with unique views)
      { id: 'pepsi-deck', name: 'Pepsi Party Deck', level: 'ga', baseAngle: 100, angleSpan: 35, covered: false, price: 'moderate' },
      
      // Left Field Bleachers
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 225, angleSpan: 40, covered: false, price: 'value' },
      
      // Outfield Berm (General admission lawn seating)
      { id: 'of-berm', name: 'Outfield Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' }
    ],
    notes: 'Downtown Amarillo, opened 2019, modern design, 6,631 capacity with 360-degree concourse'
  },
  
  {
    venueId: 'arkansas-travelers',
    venueName: 'Dickey-Stephens Park',
    lastUpdated: '2024-01',
    sections: [
      // Lower Deck Green Stadium Seats (5 rows)
      { id: 'lower-101', name: 'Lower 101', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'lower-102', name: 'Lower 102', level: 'field', baseAngle: 360, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'lower-103', name: 'Lower 103', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'lower-104', name: 'Lower 104', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'lower-105', name: 'Lower 105', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'lower-106', name: 'Lower 106', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'lower-107', name: 'Lower 107', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'lower-108', name: 'Lower 108', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      
      // Third base side lower
      { id: 'lower-109', name: 'Lower 109', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'lower-110', name: 'Lower 110', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'lower-111', name: 'Lower 111', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'lower-112', name: 'Lower 112', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'lower-113', name: 'Lower 113', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Upper Level (12 rows)
      { id: 'upper-201', name: 'Upper 201', level: 'upper', baseAngle: 335, angleSpan: 15, covered: true, price: 'value' },
      { id: 'upper-202', name: 'Upper 202', level: 'upper', baseAngle: 350, angleSpan: 15, covered: true, price: 'value' },
      { id: 'upper-203', name: 'Upper 203', level: 'upper', baseAngle: 5, angleSpan: 15, covered: true, price: 'value' },
      { id: 'upper-204', name: 'Upper 204', level: 'upper', baseAngle: 20, angleSpan: 15, covered: true, price: 'value' },
      { id: 'upper-205', name: 'Upper 205', level: 'upper', baseAngle: 35, angleSpan: 15, covered: true, price: 'value' },
      
      // 360 Concourse behind seating
      { id: 'concourse', name: '360 Concourse', level: 'ga', baseAngle: 0, angleSpan: 360, covered: true, price: 'value' },
      
      // Skyboxes (24 climate-controlled)
      { id: 'skybox-1', name: 'Skybox 1', level: 'suite', baseAngle: 345, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'skybox-2', name: 'Skybox 2', level: 'suite', baseAngle: 350, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'skybox-3', name: 'Skybox 3', level: 'suite', baseAngle: 355, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'skybox-4', name: 'Skybox 4', level: 'suite', baseAngle: 5, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'skybox-5', name: 'Skybox 5', level: 'suite', baseAngle: 10, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'skybox-6', name: 'Skybox 6', level: 'suite', baseAngle: 15, angleSpan: 5, covered: true, price: 'luxury' },
      
      // Outdoor Box Seats (12 total)
      { id: 'outdoor-box-1', name: 'Outdoor Box 1', level: 'club', baseAngle: 25, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'outdoor-box-2', name: 'Outdoor Box 2', level: 'club', baseAngle: 335, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Berm Seating (1,500 capacity)
      { id: 'berm-rf', name: 'Right Field Berm', level: 'berm', baseAngle: 70, angleSpan: 50, covered: false, price: 'value' },
      { id: 'berm-cf', name: 'Center Field Berm', level: 'berm', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'berm-lf', name: 'Left Field Berm', level: 'berm', baseAngle: 180, angleSpan: 50, covered: false, price: 'value' },
      
      // Club Car Area (First base side premium)
      { id: 'club-car', name: 'Club Car Area', level: 'club', baseAngle: 30, angleSpan: 20, covered: true, price: 'luxury' },
      
      // Dickey Room (First base side premium)
      { id: 'dickey-room', name: 'Dickey Room', level: 'club', baseAngle: 50, angleSpan: 15, covered: true, price: 'luxury' }
    ],
    notes: 'North Little Rock on Arkansas River, opened 2007, 7,300 capacity (5,800 fixed seats + 1,500 berm), features Arkansas River views'
  },
  
  {
    venueId: 'biloxi-shuckers',
    venueName: 'Keesler Federal Park',
    lastUpdated: '2024-01',
    sections: [
      // Club Seating (Lower rows of sections 100-110)
      { id: 'club-101', name: 'Club 101', level: 'field', baseAngle: 345, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'club-102', name: 'Club 102', level: 'field', baseAngle: 353, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'club-103', name: 'Club 103', level: 'field', baseAngle: 1, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'club-104', name: 'Club 104', level: 'field', baseAngle: 9, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'club-105', name: 'Club 105', level: 'field', baseAngle: 17, angleSpan: 8, covered: false, price: 'premium' },
      
      // Box Seats (Upper rows of sections 100-110)
      { id: 'box-101', name: 'Box 101', level: 'lower', baseAngle: 345, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'box-102', name: 'Box 102', level: 'lower', baseAngle: 353, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'box-103', name: 'Box 103', level: 'lower', baseAngle: 1, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 9, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 17, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 25, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 33, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 41, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 319, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 327, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Suites (12 total, each holds up to 12 people)
      { id: 'suite-1', name: 'Suite 1', level: 'suite', baseAngle: 348, angleSpan: 4, covered: true, price: 'luxury' },
      { id: 'suite-2', name: 'Suite 2', level: 'suite', baseAngle: 352, angleSpan: 4, covered: true, price: 'luxury' },
      { id: 'suite-3', name: 'Suite 3', level: 'suite', baseAngle: 356, angleSpan: 4, covered: true, price: 'luxury' },
      { id: 'suite-4', name: 'Suite 4', level: 'suite', baseAngle: 4, angleSpan: 4, covered: true, price: 'luxury' },
      { id: 'suite-5', name: 'Suite 5', level: 'suite', baseAngle: 8, angleSpan: 4, covered: true, price: 'luxury' },
      { id: 'suite-6', name: 'Suite 6', level: 'suite', baseAngle: 12, angleSpan: 4, covered: true, price: 'luxury' },
      
      // Left Field Terrace (Group seating with all-you-can-eat)
      { id: 'lf-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 225, angleSpan: 35, covered: false, price: 'value' },
      
      // Third Base Party Deck (30 people with buffet)
      { id: 'tb-party', name: 'Third Base Party Deck', level: 'club', baseAngle: 260, angleSpan: 25, covered: false, price: 'moderate' },
      
      // Right Field Beach Paradise (2024 renovation with tiki bar and splash pad)
      { id: 'rf-beach', name: 'Beach Paradise', level: 'berm', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      
      // Boardwalk (Right field with tiki bar)
      { id: 'boardwalk', name: 'Boardwalk', level: 'ga', baseAngle: 49, angleSpan: 41, covered: false, price: 'value' },
      
      // General Admission Berm
      { id: 'ga-berm', name: 'General Admission Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' }
    ],
    notes: 'Biloxi waterfront, opened 2015, renamed Keesler Federal Park in 2024, single-level seating foul pole to foul pole, 6,067 capacity with beach theme'
  },
  
  {
    venueId: 'binghamton-rumble-ponies',
    venueName: 'Mirabito Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Box (Premium behind home plate)
      { id: 'hp-box-1', name: 'Home Plate Box 1', level: 'field', baseAngle: 12, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'hp-box-2', name: 'Home Plate Box 2', level: 'field', baseAngle: 21, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'hp-box-3', name: 'Home Plate Box 3', level: 'field', baseAngle: 339, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'hp-box-4', name: 'Home Plate Box 4', level: 'field', baseAngle: 348, angleSpan: 9, covered: false, price: 'premium' },
      
      // Infield Box (Down the lines)
      { id: 'if-box-101', name: 'Infield Box 101', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'if-box-102', name: 'Infield Box 102', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'if-box-103', name: 'Infield Box 103', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'if-box-104', name: 'Infield Box 104', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Third base infield
      { id: 'if-box-105', name: 'Infield Box 105', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'if-box-106', name: 'Infield Box 106', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'if-box-107', name: 'Infield Box 107', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'if-box-108', name: 'Infield Box 108', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Reserved Grandstand (Upper level)
      { id: 'res-201', name: 'Reserved 201', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'res-202', name: 'Reserved 202', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'res-203', name: 'Reserved 203', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      
      // General Admission Bleachers
      { id: 'ga-rf', name: 'Right Field GA', level: 'ga', baseAngle: 78, angleSpan: 42, covered: false, price: 'value' },
      { id: 'ga-lf', name: 'Left Field GA', level: 'ga', baseAngle: 240, angleSpan: 42, covered: false, price: 'value' },
      
      // Mirabito Outfield Deck (Group seating)
      { id: 'mirabito-deck', name: 'Mirabito Outfield Deck', level: 'club', baseAngle: 120, angleSpan: 60, covered: false, price: 'moderate' },
      
      // Family Fun Zone (Kids area)
      { id: 'family-zone', name: 'Family Fun Zone', level: 'ga', baseAngle: 180, angleSpan: 40, covered: false, price: 'value' },
      
      // Party Pavilion (Group area)
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'club', baseAngle: 220, angleSpan: 20, covered: true, price: 'moderate' }
    ],
    notes: 'Binghamton, NY, classic ballpark opened 1992, intimate 6,012 capacity with traditional grandstand design'
  },
  
  {
    venueId: 'bowie-baysox',
    venueName: 'Prince George\'s Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club (Premium seating behind home plate)
      { id: 'diamond-club-1', name: 'Diamond Club 1', level: 'field', baseAngle: 5, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'diamond-club-2', name: 'Diamond Club 2', level: 'field', baseAngle: 13, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'diamond-club-3', name: 'Diamond Club 3', level: 'field', baseAngle: 347, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'diamond-club-4', name: 'Diamond Club 4', level: 'field', baseAngle: 355, angleSpan: 8, covered: false, price: 'premium' },
      
      // Field Box (Along baselines)
      { id: 'field-box-101', name: 'Field Box 101', level: 'lower', baseAngle: 21, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'field-box-102', name: 'Field Box 102', level: 'lower', baseAngle: 32, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'field-box-103', name: 'Field Box 103', level: 'lower', baseAngle: 43, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'field-box-104', name: 'Field Box 104', level: 'lower', baseAngle: 54, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'field-box-105', name: 'Field Box 105', level: 'lower', baseAngle: 65, angleSpan: 11, covered: false, price: 'value' },
      
      // Third base field box
      { id: 'field-box-106', name: 'Field Box 106', level: 'lower', baseAngle: 295, angleSpan: 11, covered: false, price: 'value' },
      { id: 'field-box-107', name: 'Field Box 107', level: 'lower', baseAngle: 306, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'field-box-108', name: 'Field Box 108', level: 'lower', baseAngle: 317, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'field-box-109', name: 'Field Box 109', level: 'lower', baseAngle: 328, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'field-box-110', name: 'Field Box 110', level: 'lower', baseAngle: 339, angleSpan: 11, covered: false, price: 'moderate' },
      
      // Upper Deck Reserved
      { id: 'upper-res-201', name: 'Upper Reserved 201', level: 'upper', baseAngle: 330, angleSpan: 20, covered: true, price: 'value' },
      { id: 'upper-res-202', name: 'Upper Reserved 202', level: 'upper', baseAngle: 350, angleSpan: 20, covered: true, price: 'value' },
      { id: 'upper-res-203', name: 'Upper Reserved 203', level: 'upper', baseAngle: 10, angleSpan: 20, covered: true, price: 'value' },
      { id: 'upper-res-204', name: 'Upper Reserved 204', level: 'upper', baseAngle: 30, angleSpan: 20, covered: true, price: 'value' },
      
      // Right Field Pavilion (Group seating)
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 76, angleSpan: 38, covered: false, price: 'value' },
      
      // The Grass Hill (Famous berm seating)
      { id: 'grass-hill', name: 'The Grass Hill', level: 'berm', baseAngle: 114, angleSpan: 72, covered: false, price: 'value' },
      
      // Left Field Reserved
      { id: 'lf-reserved', name: 'Left Field Reserved', level: 'ga', baseAngle: 186, angleSpan: 44, covered: false, price: 'value' },
      
      // Luxury Suites
      { id: 'suite-1', name: 'Luxury Suite 1', level: 'suite', baseAngle: 345, angleSpan: 6, covered: true, price: 'luxury' },
      { id: 'suite-2', name: 'Luxury Suite 2', level: 'suite', baseAngle: 351, angleSpan: 6, covered: true, price: 'luxury' },
      { id: 'suite-3', name: 'Luxury Suite 3', level: 'suite', baseAngle: 3, angleSpan: 6, covered: true, price: 'luxury' },
      { id: 'suite-4', name: 'Luxury Suite 4', level: 'suite', baseAngle: 9, angleSpan: 6, covered: true, price: 'luxury' },
      { id: 'suite-5', name: 'Luxury Suite 5', level: 'suite', baseAngle: 15, angleSpan: 6, covered: true, price: 'luxury' },
      
      // Stadium Club (Premium dining and viewing)
      { id: 'stadium-club', name: 'Stadium Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Bowie, MD between Baltimore and Washington, opened 1994, 10,000 capacity, famous for grass hill berm seating'
  },
  
  {
    venueId: 'chattanooga-lookouts',
    venueName: 'AT&T Field',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Club (Premium behind home plate)
      { id: 'hp-club-1', name: 'Home Plate Club 1', level: 'field', baseAngle: 15, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'hp-club-2', name: 'Home Plate Club 2', level: 'field', baseAngle: 23, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'hp-club-3', name: 'Home Plate Club 3', level: 'field', baseAngle: 337, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'hp-club-4', name: 'Home Plate Club 4', level: 'field', baseAngle: 345, angleSpan: 8, covered: false, price: 'premium' },
      
      // Field Box (Prime infield seating)
      { id: 'field-box-101', name: 'Field Box 101', level: 'lower', baseAngle: 31, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-box-102', name: 'Field Box 102', level: 'lower', baseAngle: 43, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-box-103', name: 'Field Box 103', level: 'lower', baseAngle: 55, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-box-104', name: 'Field Box 104', level: 'lower', baseAngle: 67, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Third base field box
      { id: 'field-box-105', name: 'Field Box 105', level: 'lower', baseAngle: 293, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-box-106', name: 'Field Box 106', level: 'lower', baseAngle: 305, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-box-107', name: 'Field Box 107', level: 'lower', baseAngle: 317, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-box-108', name: 'Field Box 108', level: 'lower', baseAngle: 329, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Grandstand (Upper level covered seating)
      { id: 'grandstand-201', name: 'Grandstand 201', level: 'upper', baseAngle: 325, angleSpan: 18, covered: true, price: 'value' },
      { id: 'grandstand-202', name: 'Grandstand 202', level: 'upper', baseAngle: 343, angleSpan: 18, covered: true, price: 'value' },
      { id: 'grandstand-203', name: 'Grandstand 203', level: 'upper', baseAngle: 1, angleSpan: 18, covered: true, price: 'value' },
      { id: 'grandstand-204', name: 'Grandstand 204', level: 'upper', baseAngle: 19, angleSpan: 18, covered: true, price: 'value' },
      { id: 'grandstand-205', name: 'Grandstand 205', level: 'upper', baseAngle: 37, angleSpan: 18, covered: true, price: 'value' },
      
      // Tennessee Lookouts Deck (Right field party area with Tennessee River views)
      { id: 'lookouts-deck', name: 'Tennessee Lookouts Deck', level: 'club', baseAngle: 79, angleSpan: 35, covered: false, price: 'moderate' },
      
      // Left Field Lawn (Berm seating with downtown views)
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 210, angleSpan: 65, covered: false, price: 'value' },
      
      // Chattanooga Choo Choo Pavilion (Group area)
      { id: 'choo-choo-pavilion', name: 'Chattanooga Choo Choo Pavilion', level: 'club', baseAngle: 275, angleSpan: 18, covered: true, price: 'moderate' },
      
      // Tennessee River Suites (Luxury boxes with river views)
      { id: 'river-suite-1', name: 'Tennessee River Suite 1', level: 'suite', baseAngle: 350, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'river-suite-2', name: 'Tennessee River Suite 2', level: 'suite', baseAngle: 355, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'river-suite-3', name: 'Tennessee River Suite 3', level: 'suite', baseAngle: 5, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'river-suite-4', name: 'Tennessee River Suite 4', level: 'suite', baseAngle: 10, angleSpan: 5, covered: true, price: 'luxury' },
      
      // General Admission Bleachers
      { id: 'ga-bleachers', name: 'General Admission Bleachers', level: 'ga', baseAngle: 114, angleSpan: 96, covered: false, price: 'value' }
    ],
    notes: 'Downtown Chattanooga on Tennessee River, opened 2000, 6,160 capacity, scenic riverfront location with downtown skyline views'
  },
  
  {
    venueId: 'corpus-christi-hooks',
    venueName: 'Whataburger Field',
    lastUpdated: '2024-01',
    sections: [
      // Premium Box
      { id: 'pb-100', name: 'Premium Box 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pb-101', name: 'Premium Box 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pb-102', name: 'Premium Box 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pb-103', name: 'Premium Box 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-110', name: 'Field Box 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-111', name: 'Field Box 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-112', name: 'Field Box 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-113', name: 'Field Box 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Whataburger Deck
      { id: 'w-deck', name: 'Whataburger Deck', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      
      // Grassy Knoll
      { id: 'grassy-knoll', name: 'Grassy Knoll', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Left Field Bleachers
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Executive Club
      { id: 'exec-club', name: 'Executive Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Corpus Christi Bay waterfront location'
  },
  
  {
    venueId: 'erie-seawolves',
    venueName: 'UPMC Park',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Box
      { id: 'dug-100', name: 'Dugout Box 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dug-101', name: 'Dugout Box 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dug-102', name: 'Dugout Box 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dug-103', name: 'Dugout Box 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Picnic Pavilion
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      
      // Park at the Park
      { id: 'park', name: 'Park at the Park', level: 'berm', baseAngle: 136, angleSpan: 88, covered: false, price: 'value' },
      
      // Left Field Seats
      { id: 'lf-seats', name: 'Left Field Seats', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // Dugout Suite
      { id: 'dug-suite', name: 'Dugout Suite', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Erie with Lake Erie views'
  },
  
  {
    venueId: 'frisco-roughriders',
    venueName: 'Riders Field',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Club
      { id: 'hpc-101', name: 'Home Plate Club 101', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-102', name: 'Home Plate Club 102', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-103', name: 'Home Plate Club 103', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-104', name: 'Home Plate Club 104', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Infield Box
      { id: 'ib-105', name: 'Infield Box 105', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-106', name: 'Infield Box 106', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-107', name: 'Infield Box 107', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-108', name: 'Infield Box 108', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-109', name: 'Infield Box 109', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'ib-110', name: 'Infield Box 110', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-111', name: 'Infield Box 111', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-112', name: 'Infield Box 112', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-113', name: 'Infield Box 113', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-114', name: 'Infield Box 114', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Outfield Reserved
      { id: 'or-201', name: 'Outfield Reserved 201', level: 'upper', baseAngle: 93, angleSpan: 42, covered: false, price: 'value' },
      { id: 'or-202', name: 'Outfield Reserved 202', level: 'upper', baseAngle: 225, angleSpan: 42, covered: false, price: 'value' },
      
      // Berm
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // ChopHouse
      { id: 'chophouse', name: 'ChopHouse', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Frisco, TX (Dallas suburb), opened 2003'
  },
  
  {
    venueId: 'hartford-yard-goats',
    venueName: 'Dunkin\' Park',
    lastUpdated: '2024-01',
    sections: [
      // Premium Box
      { id: 'prem-100', name: 'Premium Box 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'prem-101', name: 'Premium Box 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'prem-102', name: 'Premium Box 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'prem-103', name: 'Premium Box 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-110', name: 'Field Box 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-111', name: 'Field Box 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-112', name: 'Field Box 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-113', name: 'Field Box 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Picnic Pavilion
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 93, angleSpan: 42, covered: false, price: 'value' },
      
      // Right Field Porch
      { id: 'rf-porch', name: 'Right Field Porch', level: 'club', baseAngle: 135, angleSpan: 45, covered: true, price: 'value' },
      
      // Left Field Landing
      { id: 'lf-landing', name: 'Left Field Landing', level: 'ga', baseAngle: 225, angleSpan: 42, covered: false, price: 'value' },
      
      // Aetna Club
      { id: 'aetna-club', name: 'Aetna Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Hartford, opened 2017'
  },
  
  {
    venueId: 'midland-rockhounds',
    venueName: 'Momentum Bank Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Behind Home Plate
      { id: 'bhp-100', name: 'Behind Home Plate 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'bhp-101', name: 'Behind Home Plate 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'bhp-102', name: 'Behind Home Plate 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'bhp-103', name: 'Behind Home Plate 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Lower Reserved
      { id: 'lr-104', name: 'Lower Reserved 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lr-105', name: 'Lower Reserved 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lr-106', name: 'Lower Reserved 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lr-107', name: 'Lower Reserved 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'lr-108', name: 'Lower Reserved 108', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'lr-109', name: 'Lower Reserved 109', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lr-110', name: 'Lower Reserved 110', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lr-111', name: 'Lower Reserved 111', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // GA Lawn
      { id: 'ga-lawn', name: 'GA Lawn', level: 'berm', baseAngle: 88, angleSpan: 92, covered: false, price: 'value' },
      
      // Left Field Reserved
      { id: 'lf-res', name: 'Left Field Reserved', level: 'ga', baseAngle: 180, angleSpan: 92, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club', name: 'Club Level', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Midland, TX, opened 2002'
  },
  
  {
    venueId: 'montgomery-biscuits',
    venueName: 'Riverwalk Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-100', name: 'Box 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'box-101', name: 'Box 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'box-102', name: 'Box 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'box-103', name: 'Box 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Reserved Seating
      { id: 'res-104', name: 'Reserved 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-105', name: 'Reserved 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-106', name: 'Reserved 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-107', name: 'Reserved 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'res-108', name: 'Reserved 108', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'res-109', name: 'Reserved 109', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-110', name: 'Reserved 110', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-111', name: 'Reserved 111', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Biscuit Basket
      { id: 'biscuit', name: 'Biscuit Basket', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      
      // Riverwalk
      { id: 'riverwalk', name: 'Riverwalk', level: 'berm', baseAngle: 136, angleSpan: 88, covered: false, price: 'value' },
      
      // Left Field
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // Max Capital Club
      { id: 'max-club', name: 'Max Capital Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Montgomery on Alabama River'
  },
  
  {
    venueId: 'new-hampshire-fisher-cats',
    venueName: 'Delta Dental Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-100', name: 'Field Box 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'fb-101', name: 'Field Box 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'fb-102', name: 'Field Box 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'fb-103', name: 'Field Box 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-112', name: 'Box 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-113', name: 'Box 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Hotel Deck
      { id: 'hotel-deck', name: 'Hotel Deck', level: 'club', baseAngle: 93, angleSpan: 44, covered: true, price: 'luxury' },
      
      // Grass Berm
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Left Field
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Samuel Adams Bar & Grill
      { id: 'sam-adams', name: 'Samuel Adams Bar & Grill', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Manchester, NH along Merrimack River'
  },
  
  {
    venueId: 'northwest-arkansas-naturals',
    venueName: 'Arvest Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Box
      { id: 'dug-100', name: 'Dugout Box 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dug-101', name: 'Dugout Box 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dug-102', name: 'Dugout Box 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dug-103', name: 'Dugout Box 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Field Box 110', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-111', name: 'Field Box 111', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Bullpen Party Deck
      { id: 'bullpen', name: 'Bullpen Party Deck', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      
      // Berm
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 136, angleSpan: 88, covered: false, price: 'value' },
      
      // Left Field Deck
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Springdale, AR in Northwest Arkansas region'
  },
  
  {
    venueId: 'pensacola-blue-wahoos',
    venueName: 'Blue Wahoos Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Hancock Whitney Club
      { id: 'hw-club', name: 'Hancock Whitney Club', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hw-101', name: 'HW Club 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hw-102', name: 'HW Club 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hw-103', name: 'HW Club 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Field Reserved
      { id: 'fr-104', name: 'Field Reserved 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fr-105', name: 'Field Reserved 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fr-106', name: 'Field Reserved 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fr-107', name: 'Field Reserved 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fr-108', name: 'Field Reserved 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'fr-109', name: 'Field Reserved 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fr-110', name: 'Field Reserved 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fr-111', name: 'Field Reserved 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fr-112', name: 'Field Reserved 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fr-113', name: 'Field Reserved 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Right Field GA
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 93, angleSpan: 42, covered: false, price: 'value' },
      
      // Berm
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // Left Field GA
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 225, angleSpan: 42, covered: false, price: 'value' },
      
      // Cox Club
      { id: 'cox-club', name: 'Cox Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Pensacola on Pensacola Bay waterfront'
  },
  
  {
    venueId: 'reading-fightin-phils',
    venueName: 'FirstEnergy Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Deck Circle Suites
      { id: 'dcs-100', name: 'Deck Circle Suite 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dcs-101', name: 'Deck Circle Suite 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dcs-102', name: 'Deck Circle Suite 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dcs-103', name: 'Deck Circle Suite 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // 1st Base Picnic Pavilion
      { id: '1b-picnic', name: '1st Base Picnic Pavilion', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      
      // Pool Pavilion
      { id: 'pool', name: 'Pool Pavilion', level: 'club', baseAngle: 136, angleSpan: 88, covered: false, price: 'value' },
      
      // 3rd Base Picnic
      { id: '3b-picnic', name: '3rd Base Picnic', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // DoubleTree Club
      { id: 'dt-club', name: 'DoubleTree Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Reading, PA, features swimming pool beyond RF wall'
  },
  
  {
    venueId: 'rocket-city-trash-pandas',
    venueName: 'Toyota Field',
    lastUpdated: '2024-01',
    sections: [
      // Moon Deck
      { id: 'moon-100', name: 'Moon Deck 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'moon-101', name: 'Moon Deck 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'moon-102', name: 'Moon Deck 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'moon-103', name: 'Moon Deck 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-110', name: 'Field Box 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-111', name: 'Field Box 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-112', name: 'Field Box 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-113', name: 'Field Box 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Gravity Deck
      { id: 'gravity', name: 'Gravity Deck', level: 'ga', baseAngle: 93, angleSpan: 42, covered: false, price: 'value' },
      
      // Rocket City Landing
      { id: 'rc-landing', name: 'Rocket City Landing', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // Left Field Terrace
      { id: 'lf-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 225, angleSpan: 42, covered: false, price: 'value' },
      
      // Space Club
      { id: 'space-club', name: 'Space Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Madison, AL (Huntsville area), opened 2021'
  },
  
  {
    venueId: 'san-antonio-missions',
    venueName: 'Nelson W. Wolff Municipal Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-1', name: 'Field Box 1', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-2', name: 'Field Box 2', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-3', name: 'Field Box 3', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-4', name: 'Field Box 4', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Lower Box
      { id: 'lb-101', name: 'Lower Box 101', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-102', name: 'Lower Box 102', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-103', name: 'Lower Box 103', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-104', name: 'Lower Box 104', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'lb-105', name: 'Lower Box 105', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'lb-106', name: 'Lower Box 106', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-107', name: 'Lower Box 107', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-108', name: 'Lower Box 108', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Berm
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 88, angleSpan: 92, covered: false, price: 'value' },
      
      // Left Field Reserved
      { id: 'lf-res', name: 'Left Field Reserved', level: 'ga', baseAngle: 180, angleSpan: 92, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'San Antonio, TX, classic ballpark design'
  },
  
  {
    venueId: 'somerset-patriots',
    venueName: 'TD Bank Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Club
      { id: 'hpc-100', name: 'Home Plate Club 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-101', name: 'Home Plate Club 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-102', name: 'Home Plate Club 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-103', name: 'Home Plate Club 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Field Level
      { id: 'fl-104', name: 'Field Level 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fl-105', name: 'Field Level 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fl-106', name: 'Field Level 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fl-107', name: 'Field Level 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fl-108', name: 'Field Level 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'fl-109', name: 'Field Level 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fl-110', name: 'Field Level 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fl-111', name: 'Field Level 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fl-112', name: 'Field Level 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fl-113', name: 'Field Level 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Patriots Pavilion
      { id: 'pavilion', name: 'Patriots Pavilion', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      
      // Family Fun Zone
      { id: 'fun-zone', name: 'Family Fun Zone', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Left Field Deck
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Somerset Club
      { id: 'som-club', name: 'Somerset Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Bridgewater, NJ, Yankees AA affiliate'
  },
  
  {
    venueId: 'springfield-cardinals',
    venueName: 'Hammons Field',
    lastUpdated: '2024-01',
    sections: [
      // Redbird Roost
      { id: 'roost-100', name: 'Redbird Roost 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'roost-101', name: 'Redbird Roost 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'roost-102', name: 'Redbird Roost 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'roost-103', name: 'Redbird Roost 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Party Patio
      { id: 'party-patio', name: 'Party Patio', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      
      // Midway
      { id: 'midway', name: 'Midway', level: 'berm', baseAngle: 136, angleSpan: 88, covered: false, price: 'value' },
      
      // Left Field
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // Price Cutter Pavilion
      { id: 'pc-pavilion', name: 'Price Cutter Pavilion', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Springfield, MO, downtown location'
  },
  
  {
    venueId: 'tulsa-drillers',
    venueName: 'ONEOK Field',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Club
      { id: 'hpc-100', name: 'Home Plate Club 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-101', name: 'Home Plate Club 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-102', name: 'Home Plate Club 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-103', name: 'Home Plate Club 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Reserved Seating
      { id: 'res-104', name: 'Reserved 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-105', name: 'Reserved 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-106', name: 'Reserved 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-107', name: 'Reserved 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'res-108', name: 'Reserved 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'res-109', name: 'Reserved 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'res-110', name: 'Reserved 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'res-111', name: 'Reserved 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-112', name: 'Reserved 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-113', name: 'Reserved 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Budweiser Terrace
      { id: 'bud-terrace', name: 'Budweiser Terrace', level: 'ga', baseAngle: 93, angleSpan: 42, covered: false, price: 'value' },
      
      // Oil Derrick (CF)
      { id: 'oil-derrick', name: 'Oil Derrick', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // Greenwood District
      { id: 'greenwood', name: 'Greenwood District', level: 'ga', baseAngle: 225, angleSpan: 42, covered: false, price: 'value' },
      
      // ONEOK Club
      { id: 'oneok-club', name: 'ONEOK Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Tulsa in Greenwood District, opened 2010'
  },
  
  {
    venueId: 'wichita-wind-surge',
    venueName: 'Riverfront Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'dc-100', name: 'Diamond Club 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dc-101', name: 'Diamond Club 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dc-102', name: 'Diamond Club 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dc-103', name: 'Diamond Club 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Party Deck
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      
      // Outfield Hill
      { id: 'of-hill', name: 'Outfield Hill', level: 'berm', baseAngle: 136, angleSpan: 88, covered: false, price: 'value' },
      
      // Left Field Plaza
      { id: 'lf-plaza', name: 'Left Field Plaza', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // Emprise Bank Club
      { id: 'emprise-club', name: 'Emprise Bank Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Wichita on Arkansas River, opened 2021'
  },

  {
    venueId: 'richmond-flying-squirrels',
    venueName: 'The Diamond',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'diamond-100', name: 'Diamond Club 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'diamond-101', name: 'Diamond Club 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'diamond-102', name: 'Diamond Club 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'diamond-103', name: 'Diamond Club 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },

      // Field Box
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },

      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-110', name: 'Field Box 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'fb-111', name: 'Field Box 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-112', name: 'Field Box 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'fb-113', name: 'Field Box 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },

      // Upper Reserved
      { id: 'ur-201', name: 'Upper Reserved 201', level: 'upper', baseAngle: 340, angleSpan: 30, covered: true, price: 'value' },
      { id: 'ur-202', name: 'Upper Reserved 202', level: 'upper', baseAngle: 10, angleSpan: 30, covered: true, price: 'value' },

      // Flying Squirrels Landing
      { id: 'fs-landing', name: 'Flying Squirrels Landing', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      
      // Nutzy Hill
      { id: 'nutzy-hill', name: 'Nutzy Hill', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },

      // Left Field Plaza
      { id: 'lf-plaza', name: 'Left Field Plaza', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },

      // Richmond Club
      { id: 'richmond-club', name: 'Richmond Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Richmond, VA, classic ballpark originally built in 1985'
  },

  {
    venueId: 'harrisburg-senators',
    venueName: 'FNB Field',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'dc-100', name: 'Diamond Club 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-101', name: 'Diamond Club 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-102', name: 'Diamond Club 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-103', name: 'Diamond Club 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },

      // Field Box
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },

      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-112', name: 'Box 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-113', name: 'Box 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },

      // City Island Party Deck
      { id: 'ci-party', name: 'City Island Party Deck', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      
      // Outfield Berm
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },

      // Left Field Picnic
      { id: 'lf-picnic', name: 'Left Field Picnic', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },

      // Susquehanna Club
      { id: 'susq-club', name: 'Susquehanna Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Harrisburg City Island on Susquehanna River, opened 1987'
  },

  {
    venueId: 'portland-sea-dogs',
    venueName: 'Hadlock Field',
    lastUpdated: '2024-01',
    sections: [
      // Green Monster Seats
      { id: 'monster-1', name: 'Green Monster 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'monster-2', name: 'Green Monster 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'monster-3', name: 'Green Monster 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'monster-4', name: 'Green Monster 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },

      // Box Seats
      { id: 'box-101', name: 'Box 101', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-102', name: 'Box 102', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-103', name: 'Box 103', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },

      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },

      // Maine Monster
      { id: 'maine-monster', name: 'Maine Monster', level: 'ga', baseAngle: 220, angleSpan: 60, covered: false, price: 'value' },
      
      // Shipyard Pavilion
      { id: 'shipyard', name: 'Shipyard Pavilion', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },

      // Big Wave Berm
      { id: 'big-wave', name: 'Big Wave Berm', level: 'berm', baseAngle: 137, angleSpan: 83, covered: false, price: 'value' },

      // Sea Dogs Club
      { id: 'seadogs-club', name: 'Sea Dogs Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Portland, ME with mini Green Monster replica wall, opened 1994'
  },

  {
    venueId: 'akron-rubberducks',
    venueName: 'Canal Park',
    lastUpdated: '2024-01',
    sections: [
      // Infield Box
      { id: 'box-100', name: 'Box 100', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-101', name: 'Box 101', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-102', name: 'Box 102', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-103', name: 'Box 103', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-104', name: 'Box 104', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },

      // First Base Reserved
      { id: 'res-105', name: 'Reserved 105', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-106', name: 'Reserved 106', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-107', name: 'Reserved 107', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-108', name: 'Reserved 108', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'value' },
      { id: 'res-109', name: 'Reserved 109', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },

      // Third Base Reserved
      { id: 'res-110', name: 'Reserved 110', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'res-111', name: 'Reserved 111', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'value' },
      { id: 'res-112', name: 'Reserved 112', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-113', name: 'Reserved 113', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-114', name: 'Reserved 114', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },

      // Bleachers
      { id: 'rf-bleacher', name: 'Right Field Bleachers', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'Left Field Bleachers', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },

      // Duck Row (Upper)
      { id: 'duck-row', name: 'Duck Row', level: 'upper', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Akron location, oriented east-northeast'
  },

  {
    venueId: 'birmingham-barons',
    venueName: 'Regions Field',
    lastUpdated: '2024-01',
    sections: [
      // Premium Seating
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 335, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 350, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 5, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 20, angleSpan: 15, covered: false, price: 'premium' },

      // Baseline Box
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 50, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 65, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 80, angleSpan: 15, covered: false, price: 'value' },

      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 280, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 295, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 310, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-112', name: 'Section 112', level: 'lower', baseAngle: 325, angleSpan: 15, covered: false, price: 'moderate' },

      // Outfield
      { id: 'rf-plaza', name: 'Right Field Plaza', level: 'ga', baseAngle: 95, angleSpan: 50, covered: false, price: 'value' },
      { id: 'bernie-brew', name: "Bernie's Brewhouse", level: 'ga', baseAngle: 145, angleSpan: 35, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 215, angleSpan: 50, covered: false, price: 'value' },

      // Club Level
      { id: 'press-club', name: 'Press Box Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Birmingham with city skyline views, oriented north'
  },

  {
    venueId: 'tennessee-smokies',
    venueName: 'Smokies Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Club
      { id: 'hp-100', name: 'Home Plate Club 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hp-101', name: 'Home Plate Club 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hp-102', name: 'Home Plate Club 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hp-103', name: 'Home Plate Club 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },

      // Field Level
      { id: 'field-104', name: 'Field Level 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'field-105', name: 'Field Level 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'field-106', name: 'Field Level 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'field-107', name: 'Field Level 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'field-108', name: 'Field Level 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },

      { id: 'field-109', name: 'Field Level 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'field-110', name: 'Field Level 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'field-111', name: 'Field Level 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'field-112', name: 'Field Level 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'field-113', name: 'Field Level 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },

      // Mountain View Deck
      { id: 'mountain-view', name: 'Mountain View Deck', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      
      // Smoky Mountain Berm
      { id: 'smoky-berm', name: 'Smoky Mountain Berm', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },

      // Left Field Terrace
      { id: 'lf-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },

      // Great Smoky Mountains Club
      { id: 'gsm-club', name: 'Great Smoky Mountains Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Kodak, TN with Great Smoky Mountains views beyond outfield'
  },

  {
    venueId: 'mississippi-braves',
    venueName: 'Trustmark Park',
    lastUpdated: '2024-01',
    sections: [
      // Premium Infield
      { id: 'prem-100', name: 'Premium Infield 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'prem-101', name: 'Premium Infield 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'prem-102', name: 'Premium Infield 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'prem-103', name: 'Premium Infield 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },

      // Reserved Seating
      { id: 'res-104', name: 'Reserved 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-105', name: 'Reserved 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-106', name: 'Reserved 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-107', name: 'Reserved 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'res-108', name: 'Reserved 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },

      { id: 'res-109', name: 'Reserved 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'res-110', name: 'Reserved 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'res-111', name: 'Reserved 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-112', name: 'Reserved 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'res-113', name: 'Reserved 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },

      // Outfield Areas
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      
      // Mississippi Braves Berm
      { id: 'braves-berm', name: 'Braves Berm', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },

      // Left Field Deck
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },

      // Trustmark Club
      { id: 'trustmark-club', name: 'Trustmark Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Pearl, MS suburb of Jackson, opened 2005'
  }
];

// Export all AA layouts
export const allAALayouts = aaCompleteLayouts;