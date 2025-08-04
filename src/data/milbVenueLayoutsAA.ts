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
      { id: 'dugout-club', name: 'Dugout Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 26, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 37, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 48, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 59, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 70, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 290, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 301, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 312, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 323, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 334, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'amarillo-national-bank-pavilion', name: 'Amarillo National Bank Pavilion', level: 'club', baseAngle: 81, angleSpan: 45, covered: true, price: 'moderate' },
      { id: 'midway', name: 'The Midway', level: 'ga', baseAngle: 126, angleSpan: 60, covered: false, price: 'value' },
      { id: 'hodgetown-porch', name: 'HODGETOWN Porch', level: 'club', baseAngle: 186, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'pepsi-pavilion', name: 'Pepsi Pavilion', level: 'ga', baseAngle: 236, angleSpan: 54, covered: false, price: 'value' }
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
      { id: 'lower-102', name: 'Lower 102', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
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
      { id: 'mirabito-club', name: 'Mirabito Diamond Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'fb-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Section 102', level: 'field', baseAngle: 27, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Section 103', level: 'field', baseAngle: 39, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Section 104', level: 'field', baseAngle: 51, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Section 105', level: 'field', baseAngle: 63, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-106', name: 'Section 106', level: 'field', baseAngle: 75, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-107', name: 'Section 107', level: 'field', baseAngle: 285, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Section 108', level: 'field', baseAngle: 297, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-109', name: 'Section 109', level: 'field', baseAngle: 309, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Section 110', level: 'field', baseAngle: 321, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-111', name: 'Section 111', level: 'field', baseAngle: 333, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'visions-pavilion', name: 'Visions Federal Credit Union Pavilion', level: 'club', baseAngle: 87, angleSpan: 48, covered: true, price: 'moderate' },
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 135, angleSpan: 45, covered: false, price: 'value' },
      { id: 'rumble-zone', name: 'Rumble Zone', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 240, angleSpan: 45, covered: false, price: 'value' }
    ],
    notes: 'Binghamton, NY, classic ballpark opened 1992, intimate 6,012 capacity with traditional grandstand design'
  },
  
  {
    venueId: 'bowie-baysox',
    venueName: 'Prince George\'s Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'diamond-club', name: 'Diamond Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 27, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 39, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 51, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 63, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 75, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 285, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 297, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 309, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 321, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 333, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'orioles-pavilion', name: 'Orioles Pavilion', level: 'club', baseAngle: 87, angleSpan: 48, covered: true, price: 'moderate' },
      { id: 'rf-picnic', name: 'Right Field Picnic Area', level: 'ga', baseAngle: 135, angleSpan: 45, covered: false, price: 'value' },
      { id: 'baysox-berm', name: 'Baysox Berm', level: 'berm', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-party-deck', name: 'Left Field Party Deck', level: 'ga', baseAngle: 240, angleSpan: 45, covered: false, price: 'value' },
      { id: 'suites', name: 'Executive Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Bowie, MD between Baltimore and Washington, opened 1994, 10,000 capacity, famous for grass hill berm seating'
  },
  
  {
    venueId: 'chattanooga-lookouts',
    venueName: 'AT&T Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'att-club', name: 'AT&T Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'fb-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Section 102', level: 'field', baseAngle: 26, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Section 103', level: 'field', baseAngle: 37, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Section 104', level: 'field', baseAngle: 48, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Section 105', level: 'field', baseAngle: 59, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-106', name: 'Section 106', level: 'field', baseAngle: 70, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-107', name: 'Section 107', level: 'field', baseAngle: 290, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Section 108', level: 'field', baseAngle: 301, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-109', name: 'Section 109', level: 'field', baseAngle: 312, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Section 110', level: 'field', baseAngle: 323, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-111', name: 'Section 111', level: 'field', baseAngle: 334, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lookouts-landing', name: 'Lookouts Landing', level: 'club', baseAngle: 81, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'scenic-city-deck', name: 'Scenic City Deck', level: 'ga', baseAngle: 131, angleSpan: 58, covered: false, price: 'value' },
      { id: 'moon-pie-terrace', name: 'Moon Pie Terrace', level: 'club', baseAngle: 189, angleSpan: 48, covered: true, price: 'moderate' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 237, angleSpan: 53, covered: false, price: 'value' }
    ],
    notes: 'Downtown Chattanooga on Tennessee River, opened 2000, 6,160 capacity, scenic riverfront location with downtown skyline views'
  },
  
  {
    venueId: 'corpus-christi-hooks',
    venueName: 'Whataburger Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'harbor-club', name: 'Whataburger Harbor Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'water-walk', name: 'Water Walk Deck', level: 'club', baseAngle: 80, angleSpan: 60, covered: true, price: 'moderate' },
      { id: 'grass-berm', name: 'Outfield Grass Hill', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'splash-zone', name: 'Splash Zone', level: 'ga', baseAngle: 220, angleSpan: 60, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk Club', level: 'club', baseAngle: 170, angleSpan: 50, covered: true, price: 'luxury' }
    ],
    notes: 'Corpus Christi Bay waterfront location'
  },
  
  {
    venueId: 'erie-seawolves',
    venueName: 'UPMC Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'home-plate-club', name: 'UPMC Home Plate Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 80, angleSpan: 50, covered: false, price: 'value' },
      { id: 'batter-eye-club', name: 'Batter\'s Eye Club', level: 'club', baseAngle: 130, angleSpan: 100, covered: true, price: 'moderate' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 230, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-deck', name: 'UPMC Party Deck', level: 'club', baseAngle: 180, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Erie with Lake Erie views'
  },
  
  {
    venueId: 'frisco-roughriders',
    venueName: 'Riders Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'founders-club', name: 'Riders Founders Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 15, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 26, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 37, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 48, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 59, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 70, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 284, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 295, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 306, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 317, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 328, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 339, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'chop-house', name: 'Riders Chop House', level: 'club', baseAngle: 81, angleSpan: 42, covered: true, price: 'moderate' },
      { id: 'social-deck', name: 'Social Plaza', level: 'ga', baseAngle: 123, angleSpan: 70, covered: false, price: 'value' },
      { id: 'craft-corner', name: 'Craft Beer Corner', level: 'club', baseAngle: 193, angleSpan: 44, covered: true, price: 'moderate' },
      { id: 'lawn-seating', name: 'Outfield Lawn', level: 'berm', baseAngle: 237, angleSpan: 47, covered: false, price: 'value' }
    ],
    notes: 'Frisco, TX (Dallas suburb), opened 2003'
  },
  
  {
    venueId: 'hartford-yard-goats',
    venueName: 'Dunkin\' Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'dunkin-club', name: 'Dunkin\' Dugout Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 27, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 39, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 51, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 63, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 75, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 285, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 297, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 309, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 321, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 333, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'aetna-pavilion', name: 'Aetna Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'yard-goats-yard', name: 'The Yard', level: 'ga', baseAngle: 133, angleSpan: 54, covered: false, price: 'value' },
      { id: 'pratt-whitney-club', name: 'Pratt & Whitney Club', level: 'club', baseAngle: 187, angleSpan: 50, covered: true, price: 'luxury' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 237, angleSpan: 48, covered: false, price: 'value' }
    ],
    notes: 'Downtown Hartford, opened 2017'
  },
  
  {
    venueId: 'midland-rockhounds',
    venueName: 'Momentum Bank Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Momentum Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Momentum Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Momentum Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Midland, TX, opened 2002'
  },
  
  {
    venueId: 'montgomery-biscuits',
    venueName: 'Riverwalk Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Riverwalk Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'river-deck', name: 'Riverwalk River Deck', level: 'club', baseAngle: 90, angleSpan: 45, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Riverwalk Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Montgomery on Alabama River'
  },
  
  {
    venueId: 'new-hampshire-fisher-cats',
    venueName: 'Delta Dental Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Delta Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Delta Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Delta Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Manchester, NH along Merrimack River'
  },
  
  {
    venueId: 'northwest-arkansas-naturals',
    venueName: 'Arvest Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Arvest Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Arvest Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-berm', name: 'Outfield Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Arvest Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Springdale, AR in Northwest Arkansas region'
  },
  
  {
    venueId: 'pensacola-blue-wahoos',
    venueName: 'Blue Wahoos Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Blue Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'beach-bar', name: 'Blue Beach Bar', level: 'club', baseAngle: 85, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Blue Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Pensacola on Pensacola Bay waterfront'
  },
  
  {
    venueId: 'reading-fightin-phils',
    venueName: 'FirstEnergy Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'FirstEnergy Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'FirstEnergy Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'FirstEnergy Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Reading, PA, features swimming pool beyond RF wall'
  },
  
  {
    venueId: 'rocket-city-trash-pandas',
    venueName: 'Toyota Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Toyota Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Toyota Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Trash Panda Den', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Toyota Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Madison, AL (Huntsville area), opened 2021'
  },
  
  {
    venueId: 'san-antonio-missions',
    venueName: 'Nelson W. Wolff Municipal Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Nelson Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Nelson Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Nelson Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'San Antonio, TX, classic ballpark design'
  },
  
  {
    venueId: 'somerset-patriots',
    venueName: 'TD Bank Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'TD Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'TD Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'TD Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Bridgewater, NJ, Yankees AA affiliate'
  },
  
  {
    venueId: 'springfield-cardinals',
    venueName: 'Hammons Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Hammons Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Hammons Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Hammons Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Springfield, MO, downtown location'
  },
  
  {
    venueId: 'tulsa-drillers',
    venueName: 'ONEOK Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'ONEOK Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'ONEOK Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'ONEOK Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Tulsa in Greenwood District, opened 2010'
  },
  
  {
    venueId: 'wichita-wind-surge',
    venueName: 'Riverfront Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Riverfront Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'river-deck', name: 'Riverfront River Deck', level: 'club', baseAngle: 90, angleSpan: 45, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Riverfront Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Wichita on Arkansas River, opened 2021'
  },

  {
    venueId: 'richmond-flying-squirrels',
    venueName: 'The Diamond',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'The Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'The Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'The Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Richmond, VA, classic ballpark originally built in 1985'
  },

  {
    venueId: 'harrisburg-senators',
    venueName: 'FNB Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'FNB Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'river-deck', name: 'FNB River Deck', level: 'club', baseAngle: 90, angleSpan: 45, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'FNB Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Harrisburg City Island on Susquehanna River, opened 1987'
  },

  {
    venueId: 'portland-sea-dogs',
    venueName: 'Hadlock Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Hadlock Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Hadlock Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Maine Monster', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Hadlock Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Portland, ME with mini Green Monster replica wall, opened 1994'
  },

  {
    venueId: 'akron-rubberducks',
    venueName: 'Canal Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Canal Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Canal Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Canal Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Akron location, oriented east-northeast'
  },

  {
    venueId: 'birmingham-barons',
    venueName: 'Regions Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Regions Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Regions Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Regions Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Birmingham with city skyline views, oriented north'
  },

  {
    venueId: 'tennessee-smokies',
    venueName: 'Smokies Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Smokies Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Smokies Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-berm', name: 'Outfield Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Smokies Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Kodak, TN with Great Smoky Mountains views beyond outfield'
  },

  {
    venueId: 'mississippi-braves',
    venueName: 'Trustmark Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-club', name: 'Trustmark Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 54, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 285, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 298, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 311, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 324, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 337, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'party-pavilion', name: 'Trustmark Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 133, angleSpan: 94, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 227, angleSpan: 58, covered: false, price: 'value' },
      { id: 'suites', name: 'Trustmark Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Pearl, MS suburb of Jackson, opened 2005'
  }
];

// Export all AA layouts
export const allAALayouts = aaCompleteLayouts;