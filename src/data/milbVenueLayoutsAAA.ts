// Complete AAA Stadium Layouts (All 30 Teams)
// Triple-A venues typically have 6,000-16,000 capacity with more premium seating options

import { VenueLayout, VenueSection } from './milbVenueLayouts';

export const aaaCompleteLayouts: VenueLayout[] = [
  // Las Vegas Aviators - Las Vegas Ballpark
  {
    venueId: 'las-vegas-aviators',
    venueName: 'Las Vegas Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Field Level Premium
      { id: 'field-1', name: 'Field 1', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-2', name: 'Field 2', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-3', name: 'Field 3', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-4', name: 'Field 4', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-5', name: 'Field 5', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-6', name: 'Field 6', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      
      // Baseline Box
      { id: 'bb-101', name: 'Baseline Box 101', level: 'lower', baseAngle: 35, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'bb-102', name: 'Baseline Box 102', level: 'lower', baseAngle: 47, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'bb-103', name: 'Baseline Box 103', level: 'lower', baseAngle: 59, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'bb-104', name: 'Baseline Box 104', level: 'lower', baseAngle: 71, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'bb-105', name: 'Baseline Box 105', level: 'lower', baseAngle: 289, angleSpan: 12, covered: false, price: 'value' },
      { id: 'bb-106', name: 'Baseline Box 106', level: 'lower', baseAngle: 301, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'bb-107', name: 'Baseline Box 107', level: 'lower', baseAngle: 313, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'bb-108', name: 'Baseline Box 108', level: 'lower', baseAngle: 325, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Upper Reserve
      { id: 'ur-201', name: 'Upper Reserve 201', level: 'upper', baseAngle: 335, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ur-202', name: 'Upper Reserve 202', level: 'upper', baseAngle: 355, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ur-203', name: 'Upper Reserve 203', level: 'upper', baseAngle: 15, angleSpan: 20, covered: true, price: 'value' },
      
      // Outfield Areas
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 83, angleSpan: 54, covered: false, price: 'value' },
      { id: 'centerfield', name: 'Centerfield', level: 'ga', baseAngle: 137, angleSpan: 46, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 183, angleSpan: 54, covered: false, price: 'value' },
      
      // Pool Area (Famous Feature)
      { id: 'pool-area', name: 'Pool & Cabana Area', level: 'ga', baseAngle: 237, angleSpan: 30, covered: false, price: 'luxury' },
      
      // Suites
      { id: 'club-suites', name: 'Club Level Suites', level: 'suite', baseAngle: 335, angleSpan: 50, covered: true, price: 'luxury' }
    ],
    notes: 'Desert ballpark with swimming pool, opened 2019 in Summerlin'
  },
  
  {
    venueId: 'albuquerque-isotopes',
    venueName: 'Isotopes Park',
    lastUpdated: '2024-01',
    sections: [
      // Premium Seating
      { id: 'club-1', name: 'Club 1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-2', name: 'Club 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-3', name: 'Club 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-4', name: 'Club 4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-5', name: 'Club 5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Field Level
      { id: 'sec-101', name: 'Section 101', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Pavilion Areas
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      
      // Berm
      { id: 'berm', name: 'Berm Hill', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'High altitude (5,300 ft), oriented northeast'
  },
  
  {
    venueId: 'columbus-clippers',
    venueName: 'Huntington Park',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Club
      { id: 'hpc-1', name: 'Home Plate Club 1', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'hpc-2', name: 'Home Plate Club 2', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'hpc-3', name: 'Home Plate Club 3', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'hpc-4', name: 'Home Plate Club 4', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      
      // Lower Box
      { id: 'lb-101', name: 'Lower Box 101', level: 'lower', baseAngle: 25, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lb-102', name: 'Lower Box 102', level: 'lower', baseAngle: 36, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lb-103', name: 'Lower Box 103', level: 'lower', baseAngle: 47, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lb-104', name: 'Lower Box 104', level: 'lower', baseAngle: 58, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lb-105', name: 'Lower Box 105', level: 'lower', baseAngle: 69, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lb-106', name: 'Lower Box 106', level: 'lower', baseAngle: 80, angleSpan: 11, covered: false, price: 'value' },
      
      { id: 'lb-107', name: 'Lower Box 107', level: 'lower', baseAngle: 280, angleSpan: 11, covered: false, price: 'value' },
      { id: 'lb-108', name: 'Lower Box 108', level: 'lower', baseAngle: 291, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lb-109', name: 'Lower Box 109', level: 'lower', baseAngle: 302, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lb-110', name: 'Lower Box 110', level: 'lower', baseAngle: 313, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lb-111', name: 'Lower Box 111', level: 'lower', baseAngle: 324, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lb-112', name: 'Lower Box 112', level: 'lower', baseAngle: 335, angleSpan: 11, covered: false, price: 'moderate' },
      
      // Upper Reserved
      { id: 'ur-201', name: 'Upper Reserved 201', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ur-202', name: 'Upper Reserved 202', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ur-203', name: 'Upper Reserved 203', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'ur-204', name: 'Upper Reserved 204', level: 'upper', baseAngle: 40, angleSpan: 20, covered: true, price: 'value' },
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 91, angleSpan: 44, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 225, angleSpan: 44, covered: false, price: 'value' },
      
      // Bar & Rooftop
      { id: 'rooftop', name: 'Rooftop Terrace', level: 'club', baseAngle: 135, angleSpan: 90, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Columbus in Arena District, opened 2009'
  },
  
  {
    venueId: 'el-paso-chihuahuas',
    venueName: 'Southwest University Park',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-100', name: 'Field Box 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'fb-101', name: 'Field Box 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'fb-102', name: 'Field Box 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'fb-103', name: 'Field Box 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Lower Reserved
      { id: 'lr-104', name: 'Lower Reserved 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lr-105', name: 'Lower Reserved 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lr-106', name: 'Lower Reserved 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lr-107', name: 'Lower Reserved 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'lr-108', name: 'Lower Reserved 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'lr-109', name: 'Lower Reserved 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'lr-110', name: 'Lower Reserved 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'lr-111', name: 'Lower Reserved 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lr-112', name: 'Lower Reserved 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lr-113', name: 'Lower Reserved 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Upper Level
      { id: 'ul-201', name: 'Upper Level 201', level: 'upper', baseAngle: 340, angleSpan: 30, covered: true, price: 'value' },
      { id: 'ul-202', name: 'Upper Level 202', level: 'upper', baseAngle: 10, angleSpan: 30, covered: true, price: 'value' },
      
      // Pavilion
      { id: 'party-pav', name: 'Party Pavilion', level: 'ga', baseAngle: 93, angleSpan: 42, covered: false, price: 'value' },
      { id: 'lf-patio', name: 'Left Field Patio', level: 'ga', baseAngle: 225, angleSpan: 42, covered: false, price: 'value' },
      
      // Santa Fe Grill
      { id: 'santa-fe', name: 'Santa Fe Grill', level: 'club', baseAngle: 135, angleSpan: 90, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown El Paso with mountain views, opened 2014'
  },
  
  {
    venueId: 'gwinnett-stripers',
    venueName: 'Coolray Field',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Box
      { id: 'db-1', name: 'Diamond Box 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'db-2', name: 'Diamond Box 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'db-3', name: 'Diamond Box 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'db-4', name: 'Diamond Box 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Field Reserved
      { id: 'fr-101', name: 'Field Reserved 101', level: 'lower', baseAngle: 28, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-102', name: 'Field Reserved 102', level: 'lower', baseAngle: 42, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-103', name: 'Field Reserved 103', level: 'lower', baseAngle: 56, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-104', name: 'Field Reserved 104', level: 'lower', baseAngle: 70, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fr-105', name: 'Field Reserved 105', level: 'lower', baseAngle: 84, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'fr-106', name: 'Field Reserved 106', level: 'lower', baseAngle: 276, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fr-107', name: 'Field Reserved 107', level: 'lower', baseAngle: 290, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fr-108', name: 'Field Reserved 108', level: 'lower', baseAngle: 304, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-109', name: 'Field Reserved 109', level: 'lower', baseAngle: 318, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-110', name: 'Field Reserved 110', level: 'lower', baseAngle: 332, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Pavilion
      { id: 'rf-pav', name: 'Right Field Pavilion', level: 'ga', baseAngle: 98, angleSpan: 40, covered: false, price: 'value' },
      { id: 'lf-pav', name: 'Left Field Pavilion', level: 'ga', baseAngle: 222, angleSpan: 40, covered: false, price: 'value' },
      
      // Outfield Plaza
      { id: 'of-plaza', name: 'Outfield Plaza', level: 'berm', baseAngle: 138, angleSpan: 84, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club', name: 'Infinity Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Lawrenceville, GA - suburban Atlanta location'
  },
  
  {
    venueId: 'indianapolis-indians',
    venueName: 'Victory Field',
    lastUpdated: '2024-01',
    sections: [
      // Club Seats
      { id: 'club-100', name: 'Club 100', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-101', name: 'Club 101', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-102', name: 'Club 102', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-103', name: 'Club 103', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'club-104', name: 'Club 104', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 30, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 41, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 52, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 63, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 74, angleSpan: 11, covered: false, price: 'value' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 85, angleSpan: 11, covered: false, price: 'value' },
      
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 275, angleSpan: 11, covered: false, price: 'value' },
      { id: 'box-112', name: 'Box 112', level: 'lower', baseAngle: 286, angleSpan: 11, covered: false, price: 'value' },
      { id: 'box-113', name: 'Box 113', level: 'lower', baseAngle: 297, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-114', name: 'Box 114', level: 'lower', baseAngle: 308, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-115', name: 'Box 115', level: 'lower', baseAngle: 319, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-116', name: 'Box 116', level: 'lower', baseAngle: 330, angleSpan: 11, covered: false, price: 'moderate' },
      
      // Lawn
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 96, angleSpan: 88, covered: false, price: 'value' },
      
      // Knot Hole Gang (Kids)
      { id: 'knot-hole', name: 'Knot Hole Gang', level: 'ga', baseAngle: 184, angleSpan: 40, covered: false, price: 'value' },
      
      // Upper Deck
      { id: 'upper-1', name: 'Upper Deck 1', level: 'upper', baseAngle: 340, angleSpan: 40, covered: true, price: 'value' },
      
      // Elements Financial Club
      { id: 'ef-club', name: 'Elements Financial Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Indianapolis, rated best MiLB ballpark experience'
  },
  
  {
    venueId: 'iowa-cubs',
    venueName: 'Principal Park',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-100', name: 'Field Box 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-101', name: 'Field Box 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-102', name: 'Field Box 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-103', name: 'Field Box 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Reserved Box
      { id: 'rb-104', name: 'Reserved Box 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-105', name: 'Reserved Box 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-106', name: 'Reserved Box 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-107', name: 'Reserved Box 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      { id: 'rb-108', name: 'Reserved Box 108', level: 'lower', baseAngle: 88, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'rb-109', name: 'Reserved Box 109', level: 'lower', baseAngle: 272, angleSpan: 14, covered: false, price: 'value' },
      { id: 'rb-110', name: 'Reserved Box 110', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'rb-111', name: 'Reserved Box 111', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-112', name: 'Reserved Box 112', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-113', name: 'Reserved Box 113', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 102, angleSpan: 38, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 220, angleSpan: 38, covered: false, price: 'value' },
      
      // Terrace
      { id: 'terrace', name: 'Terrace', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Confluence of rivers location, renovated 2004'
  },
  
  {
    venueId: 'jacksonville-jumbo-shrimp',
    venueName: '121 Financial Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Club
      { id: 'dc-101', name: 'Dugout Club 101', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dc-102', name: 'Dugout Club 102', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dc-103', name: 'Dugout Club 103', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dc-104', name: 'Dugout Club 104', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      
      // Field Level
      { id: 'fl-105', name: 'Field Level 105', level: 'lower', baseAngle: 25, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fl-106', name: 'Field Level 106', level: 'lower', baseAngle: 37, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fl-107', name: 'Field Level 107', level: 'lower', baseAngle: 49, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fl-108', name: 'Field Level 108', level: 'lower', baseAngle: 61, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fl-109', name: 'Field Level 109', level: 'lower', baseAngle: 73, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fl-110', name: 'Field Level 110', level: 'lower', baseAngle: 85, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'fl-111', name: 'Field Level 111', level: 'lower', baseAngle: 275, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fl-112', name: 'Field Level 112', level: 'lower', baseAngle: 287, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fl-113', name: 'Field Level 113', level: 'lower', baseAngle: 299, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fl-114', name: 'Field Level 114', level: 'lower', baseAngle: 311, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fl-115', name: 'Field Level 115', level: 'lower', baseAngle: 323, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fl-116', name: 'Field Level 116', level: 'lower', baseAngle: 335, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Terrace Level
      { id: 'tl-201', name: 'Terrace 201', level: 'upper', baseAngle: 340, angleSpan: 30, covered: true, price: 'value' },
      { id: 'tl-202', name: 'Terrace 202', level: 'upper', baseAngle: 10, angleSpan: 30, covered: true, price: 'value' },
      
      // Outfield
      { id: 'rf-deck', name: 'Right Field Deck', level: 'ga', baseAngle: 97, angleSpan: 40, covered: false, price: 'value' },
      { id: 'cf-berm', name: 'Center Field Berm', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 223, angleSpan: 40, covered: false, price: 'value' },
      
      // SeaWalk
      { id: 'seawalk', name: 'SeaWalk', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Jacksonville, renovated 2017 with modern amenities'
  },
  
  {
    venueId: 'lehigh-valley-ironpigs',
    venueName: 'Coca-Cola Park',
    lastUpdated: '2024-01',
    sections: [
      // PNC Club
      { id: 'pnc-1', name: 'PNC Club 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pnc-2', name: 'PNC Club 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pnc-3', name: 'PNC Club 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pnc-4', name: 'PNC Club 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Infield Box
      { id: 'ib-101', name: 'Infield Box 101', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-102', name: 'Infield Box 102', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-103', name: 'Infield Box 103', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-104', name: 'Infield Box 104', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-105', name: 'Infield Box 105', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'ib-106', name: 'Infield Box 106', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-107', name: 'Infield Box 107', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-108', name: 'Infield Box 108', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-109', name: 'Infield Box 109', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-110', name: 'Infield Box 110', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'bacon-usa', name: 'Bacon USA', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      { id: 'pig-pen', name: 'The Pig Pen', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      { id: 'lf-porch', name: 'Left Field Porch', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Allentown, PA - known for Bacon USA concession stand'
  },
  
  {
    venueId: 'louisville-bats',
    venueName: 'Louisville Slugger Field',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'dc-101', name: 'Diamond Club 101', level: 'field', baseAngle: 340, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'dc-102', name: 'Diamond Club 102', level: 'field', baseAngle: 351, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'dc-103', name: 'Diamond Club 103', level: 'field', baseAngle: 2, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'dc-104', name: 'Diamond Club 104', level: 'field', baseAngle: 13, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'dc-105', name: 'Diamond Club 105', level: 'field', baseAngle: 24, angleSpan: 11, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 35, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 47, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 59, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 71, angleSpan: 12, covered: false, price: 'value' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 83, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 277, angleSpan: 12, covered: false, price: 'value' },
      { id: 'box-112', name: 'Box 112', level: 'lower', baseAngle: 289, angleSpan: 12, covered: false, price: 'value' },
      { id: 'box-113', name: 'Box 113', level: 'lower', baseAngle: 301, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-114', name: 'Box 114', level: 'lower', baseAngle: 313, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-115', name: 'Box 115', level: 'lower', baseAngle: 325, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 95, angleSpan: 40, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 225, angleSpan: 40, covered: false, price: 'value' },
      
      // Budweiser Party Deck
      { id: 'party-deck', name: 'Budweiser Party Deck', level: 'club', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // Champions Club
      { id: 'champ-club', name: 'Champions Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Louisville on Ohio River, opened 2000'
  },
  
  {
    venueId: 'memphis-redbirds',
    venueName: 'AutoZone Park',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Box
      { id: 'dbox-100', name: 'Dugout Box 100', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dbox-101', name: 'Dugout Box 101', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dbox-102', name: 'Dugout Box 102', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dbox-103', name: 'Dugout Box 103', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dbox-104', name: 'Dugout Box 104', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fbox-105', name: 'Field Box 105', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fbox-106', name: 'Field Box 106', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fbox-107', name: 'Field Box 107', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fbox-108', name: 'Field Box 108', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fbox-109', name: 'Field Box 109', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'fbox-110', name: 'Field Box 110', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fbox-111', name: 'Field Box 111', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fbox-112', name: 'Field Box 112', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fbox-113', name: 'Field Box 113', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fbox-114', name: 'Field Box 114', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Plaza Level
      { id: 'plaza-201', name: 'Plaza 201', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'plaza-202', name: 'Plaza 202', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'plaza-203', name: 'Plaza 203', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      
      // Bluff
      { id: 'bluff', name: 'The Bluff', level: 'berm', baseAngle: 90, angleSpan: 90, covered: false, price: 'value' },
      
      // Toyota Terrace
      { id: 'terrace', name: 'Toyota Terrace', level: 'ga', baseAngle: 180, angleSpan: 90, covered: false, price: 'value' },
      
      // Redbirds Club
      { id: 'rb-club', name: 'Redbirds Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Memphis, classic brick design, opened 2000'
  },
  
  {
    venueId: 'nashville-sounds',
    venueName: 'First Horizon Park',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Club
      { id: 'hp-101', name: 'Home Plate Club 101', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hp-102', name: 'Home Plate Club 102', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hp-103', name: 'Home Plate Club 103', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hp-104', name: 'Home Plate Club 104', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Section 100s
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // The Band Box (Guitar shaped scoreboard)
      { id: 'band-box', name: 'The Band Box', level: 'berm', baseAngle: 93, angleSpan: 42, covered: false, price: 'value' },
      
      // Left Field
      { id: 'lf-corner', name: 'Left Field Corner', level: 'ga', baseAngle: 225, angleSpan: 42, covered: false, price: 'value' },
      
      // Outfield Bar
      { id: 'of-bar', name: 'Outfield Bar', level: 'club', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Nashville with guitar-shaped scoreboard, opened 2015'
  },
  
  {
    venueId: 'norfolk-tides',
    venueName: 'Harbor Park',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'diamond-1', name: 'Diamond Club 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'diamond-2', name: 'Diamond Club 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'diamond-3', name: 'Diamond Club 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'diamond-4', name: 'Diamond Club 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Lower Box
      { id: 'lb-101', name: 'Lower Box 101', level: 'lower', baseAngle: 28, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-102', name: 'Lower Box 102', level: 'lower', baseAngle: 42, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-103', name: 'Lower Box 103', level: 'lower', baseAngle: 56, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-104', name: 'Lower Box 104', level: 'lower', baseAngle: 70, angleSpan: 14, covered: false, price: 'value' },
      { id: 'lb-105', name: 'Lower Box 105', level: 'lower', baseAngle: 84, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'lb-106', name: 'Lower Box 106', level: 'lower', baseAngle: 276, angleSpan: 14, covered: false, price: 'value' },
      { id: 'lb-107', name: 'Lower Box 107', level: 'lower', baseAngle: 290, angleSpan: 14, covered: false, price: 'value' },
      { id: 'lb-108', name: 'Lower Box 108', level: 'lower', baseAngle: 304, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-109', name: 'Lower Box 109', level: 'lower', baseAngle: 318, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-110', name: 'Lower Box 110', level: 'lower', baseAngle: 332, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Picnic Area
      { id: 'picnic', name: 'Picnic Area', level: 'ga', baseAngle: 98, angleSpan: 40, covered: false, price: 'value' },
      
      // Left Field Landing
      { id: 'lf-landing', name: 'Left Field Landing', level: 'ga', baseAngle: 222, angleSpan: 40, covered: false, price: 'value' },
      
      // Party Deck
      { id: 'party-deck', name: 'Party Deck', level: 'club', baseAngle: 138, angleSpan: 84, covered: false, price: 'value' },
      
      // Suites
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Norfolk on Elizabeth River, skyline views'
  },
  
  {
    venueId: 'oklahoma-city-dodgers',
    venueName: 'Chickasaw Bricktown Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-100', name: 'Field Box 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-101', name: 'Field Box 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-102', name: 'Field Box 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-103', name: 'Field Box 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Reserve Box
      { id: 'rb-104', name: 'Reserve Box 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-105', name: 'Reserve Box 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-106', name: 'Reserve Box 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-107', name: 'Reserve Box 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      { id: 'rb-108', name: 'Reserve Box 108', level: 'lower', baseAngle: 88, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'rb-109', name: 'Reserve Box 109', level: 'lower', baseAngle: 272, angleSpan: 14, covered: false, price: 'value' },
      { id: 'rb-110', name: 'Reserve Box 110', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'rb-111', name: 'Reserve Box 111', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-112', name: 'Reserve Box 112', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rb-113', name: 'Reserve Box 113', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Upper Deck
      { id: 'ud-201', name: 'Upper Deck 201', level: 'upper', baseAngle: 340, angleSpan: 30, covered: true, price: 'value' },
      { id: 'ud-202', name: 'Upper Deck 202', level: 'upper', baseAngle: 10, angleSpan: 30, covered: true, price: 'value' },
      
      // Outfield
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 102, angleSpan: 38, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 220, angleSpan: 38, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club', name: 'Club Level', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Bricktown entertainment district, opened 1998'
  },
  
  {
    venueId: 'omaha-storm-chasers',
    venueName: 'Werner Park',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Suites
      { id: 'dug-1', name: 'Dugout Suite 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dug-2', name: 'Dugout Suite 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dug-3', name: 'Dugout Suite 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dug-4', name: 'Dugout Suite 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Field Reserved
      { id: 'fr-101', name: 'Field Reserved 101', level: 'lower', baseAngle: 28, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-102', name: 'Field Reserved 102', level: 'lower', baseAngle: 42, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-103', name: 'Field Reserved 103', level: 'lower', baseAngle: 56, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-104', name: 'Field Reserved 104', level: 'lower', baseAngle: 70, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fr-105', name: 'Field Reserved 105', level: 'lower', baseAngle: 84, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'fr-106', name: 'Field Reserved 106', level: 'lower', baseAngle: 276, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fr-107', name: 'Field Reserved 107', level: 'lower', baseAngle: 290, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fr-108', name: 'Field Reserved 108', level: 'lower', baseAngle: 304, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-109', name: 'Field Reserved 109', level: 'lower', baseAngle: 318, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fr-110', name: 'Field Reserved 110', level: 'lower', baseAngle: 332, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Berm
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 98, angleSpan: 84, covered: false, price: 'value' },
      
      // Party Porch
      { id: 'party-porch', name: 'Party Porch', level: 'ga', baseAngle: 182, angleSpan: 76, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club', name: 'Werner Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Papillion, NE (Omaha suburb), opened 2011'
  },
  
  {
    venueId: 'reno-aces',
    venueName: 'Greater Nevada Field',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Level
      { id: 'dia-100', name: 'Diamond 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dia-101', name: 'Diamond 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dia-102', name: 'Diamond 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dia-103', name: 'Diamond 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Plaza Infield
      { id: 'pi-104', name: 'Plaza Infield 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'pi-105', name: 'Plaza Infield 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'pi-106', name: 'Plaza Infield 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'pi-107', name: 'Plaza Infield 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'pi-108', name: 'Plaza Infield 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'pi-109', name: 'Plaza Infield 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'pi-110', name: 'Plaza Infield 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'pi-111', name: 'Plaza Infield 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'pi-112', name: 'Plaza Infield 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'pi-113', name: 'Plaza Infield 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Plaza Outfield
      { id: 'po-201', name: 'Plaza Outfield 201', level: 'upper', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      { id: 'po-202', name: 'Plaza Outfield 202', level: 'upper', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Freight House District
      { id: 'freight', name: 'Freight House District', level: 'club', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Club Level
      { id: 'sk-club', name: 'SK Baseball Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Reno, opened 2009 with mountain views'
  },
  
  {
    venueId: 'rochester-red-wings',
    venueName: 'Innovative Field',
    lastUpdated: '2024-01',
    sections: [
      // VIP Box
      { id: 'vip-1', name: 'VIP Box 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'vip-2', name: 'VIP Box 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'vip-3', name: 'VIP Box 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'vip-4', name: 'VIP Box 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Home Plate Reserved
      { id: 'hpr-101', name: 'Home Plate Reserved 101', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'hpr-102', name: 'Home Plate Reserved 102', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'hpr-103', name: 'Home Plate Reserved 103', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'hpr-104', name: 'Home Plate Reserved 104', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'hpr-105', name: 'Home Plate Reserved 105', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'hpr-106', name: 'Home Plate Reserved 106', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'hpr-107', name: 'Home Plate Reserved 107', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'hpr-108', name: 'Home Plate Reserved 108', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'hpr-109', name: 'Home Plate Reserved 109', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'hpr-110', name: 'Home Plate Reserved 110', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Outfield Reserved
      { id: 'ofr-201', name: 'Outfield Reserved 201', level: 'upper', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      { id: 'ofr-202', name: 'Outfield Reserved 202', level: 'upper', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Lawn
      { id: 'lawn', name: 'Lawn Seating', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Wings Nest
      { id: 'wings-nest', name: 'Wings Nest', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Rochester, renovated 2021'
  },
  
  {
    venueId: 'round-rock-express',
    venueName: 'Dell Diamond',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Club
      { id: 'hpc-1', name: 'Home Plate Club 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-2', name: 'Home Plate Club 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-3', name: 'Home Plate Club 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpc-4', name: 'Home Plate Club 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Infield Box
      { id: 'ib-101', name: 'Infield Box 101', level: 'lower', baseAngle: 28, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-102', name: 'Infield Box 102', level: 'lower', baseAngle: 40, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-103', name: 'Infield Box 103', level: 'lower', baseAngle: 52, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-104', name: 'Infield Box 104', level: 'lower', baseAngle: 64, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-105', name: 'Infield Box 105', level: 'lower', baseAngle: 76, angleSpan: 12, covered: false, price: 'value' },
      { id: 'ib-106', name: 'Infield Box 106', level: 'lower', baseAngle: 88, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'ib-107', name: 'Infield Box 107', level: 'lower', baseAngle: 272, angleSpan: 12, covered: false, price: 'value' },
      { id: 'ib-108', name: 'Infield Box 108', level: 'lower', baseAngle: 284, angleSpan: 12, covered: false, price: 'value' },
      { id: 'ib-109', name: 'Infield Box 109', level: 'lower', baseAngle: 296, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-110', name: 'Infield Box 110', level: 'lower', baseAngle: 308, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-111', name: 'Infield Box 111', level: 'lower', baseAngle: 320, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-112', name: 'Infield Box 112', level: 'lower', baseAngle: 332, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Rock Pile (RF)
      { id: 'rock-pile', name: 'Rock Pile', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      
      // Berm
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      
      // Left Field Deck
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' },
      
      // United Heritage Center
      { id: 'uh-center', name: 'United Heritage Center', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Round Rock, TX (Austin suburb), opened 2000'
  },
  
  {
    venueId: 'salt-lake-bees',
    venueName: 'Smith\'s Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Lexus Club
      { id: 'lexus-1', name: 'Lexus Club 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'lexus-2', name: 'Lexus Club 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'lexus-3', name: 'Lexus Club 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'lexus-4', name: 'Lexus Club 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Infield Box
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
      
      // Upper Reserved
      { id: 'upper-201', name: 'Upper 201', level: 'upper', baseAngle: 340, angleSpan: 30, covered: true, price: 'value' },
      { id: 'upper-202', name: 'Upper 202', level: 'upper', baseAngle: 10, angleSpan: 30, covered: true, price: 'value' },
      
      // Outfield
      { id: 'rf-res', name: 'Right Field Reserved', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      { id: 'lf-res', name: 'Left Field Reserved', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Outfield Berm
      { id: 'of-berm', name: 'Outfield Berm', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Salt Lake City with mountain views, high altitude'
  },
  
  {
    venueId: 'scranton-railriders',
    venueName: 'PNC Field',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'dc-100', name: 'Diamond Club 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-101', name: 'Diamond Club 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-102', name: 'Diamond Club 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-103', name: 'Diamond Club 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
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
      
      // Pavilion
      { id: 'rf-pav', name: 'Right Field Pavilion', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      { id: 'lf-pav', name: 'Left Field Pavilion', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Lawn
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Mohegan Sun Club
      { id: 'ms-club', name: 'Mohegan Sun Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Moosic, PA (near Scranton), opened 2013'
  },
  
  {
    venueId: 'st-paul-saints',
    venueName: 'CHS Field',
    lastUpdated: '2024-01',
    sections: [
      // Best Buy Club
      { id: 'bb-101', name: 'Best Buy Club 101', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'bb-102', name: 'Best Buy Club 102', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'bb-103', name: 'Best Buy Club 103', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'bb-104', name: 'Best Buy Club 104', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Infield Reserved
      { id: 'ir-105', name: 'Infield Reserved 105', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ir-106', name: 'Infield Reserved 106', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ir-107', name: 'Infield Reserved 107', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ir-108', name: 'Infield Reserved 108', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ir-109', name: 'Infield Reserved 109', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'ir-110', name: 'Infield Reserved 110', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ir-111', name: 'Infield Reserved 111', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ir-112', name: 'Infield Reserved 112', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ir-113', name: 'Infield Reserved 113', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ir-114', name: 'Infield Reserved 114', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Outfield Reserved
      { id: 'or-201', name: 'Outfield Reserved 201', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      { id: 'or-202', name: 'Outfield Reserved 202', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Lawn
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Treasure Island Center
      { id: 'ti-center', name: 'Treasure Island Center', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Lowertown St. Paul, opened 2015, downtown skyline views'
  },
  
  {
    venueId: 'sugar-land-space-cowboys',
    venueName: 'Constellation Field',
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
      
      // Bull Pen Bar
      { id: 'bull-pen', name: 'Bull Pen Bar', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      
      // Berm
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Left Field Reserved
      { id: 'lf-res', name: 'Left Field Reserved', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Insperity Club
      { id: 'ins-club', name: 'Insperity Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Sugar Land, TX (Houston suburb), opened 2012'
  },
  
  {
    venueId: 'syracuse-mets',
    venueName: 'NBT Bank Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Hank Sauer Room
      { id: 'hsr-100', name: 'Hank Sauer Room 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hsr-101', name: 'Hank Sauer Room 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hsr-102', name: 'Hank Sauer Room 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hsr-103', name: 'Hank Sauer Room 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
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
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Picnic Pavilion
      { id: 'picnic', name: 'Picnic Pavilion', level: 'club', baseAngle: 137, angleSpan: 86, covered: true, price: 'value' },
      
      // Executive Club
      { id: 'exec-club', name: 'Executive Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Syracuse, NY, renovated 2010'
  },
  
  {
    venueId: 'tacoma-rainiers',
    venueName: 'Cheney Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'dc-100', name: 'Diamond Club 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-101', name: 'Diamond Club 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-102', name: 'Diamond Club 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-103', name: 'Diamond Club 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
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
      
      // GA Seating
      { id: 'ga-rf', name: 'Right Field GA', level: 'ga', baseAngle: 93, angleSpan: 44, covered: false, price: 'value' },
      { id: 'ga-lf', name: 'Left Field GA', level: 'ga', baseAngle: 223, angleSpan: 44, covered: false, price: 'value' },
      
      // Terrace
      { id: 'terrace', name: 'Terrace', level: 'berm', baseAngle: 137, angleSpan: 86, covered: false, price: 'value' },
      
      // Metro Parks Club
      { id: 'mp-club', name: 'Metro Parks Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Tacoma, WA, historic stadium opened 1960'
  },
  
  {
    venueId: 'toledo-mud-hens',
    venueName: 'Fifth Third Field',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Box
      { id: 'dug-100', name: 'Dugout Box 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dug-101', name: 'Dugout Box 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dug-102', name: 'Dugout Box 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dug-103', name: 'Dugout Box 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
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
      
      // Reserved Seating
      { id: 'res-201', name: 'Reserved 201', level: 'upper', baseAngle: 340, angleSpan: 30, covered: true, price: 'value' },
      { id: 'res-202', name: 'Reserved 202', level: 'upper', baseAngle: 10, angleSpan: 30, covered: true, price: 'value' },
      
      // The Roost
      { id: 'roost', name: 'The Roost', level: 'ga', baseAngle: 93, angleSpan: 87, covered: false, price: 'value' },
      
      // Left Field Reserved
      { id: 'lf-res', name: 'Left Field Reserved', level: 'ga', baseAngle: 180, angleSpan: 87, covered: false, price: 'value' },
      
      // Huntington Club
      { id: 'hunt-club', name: 'Huntington Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Toledo on Maumee River, opened 2002'
  },

  {
    venueId: 'buffalo-bisons',
    venueName: 'Sahlen Field',
    lastUpdated: '2024-01',
    sections: [
      // Field Level Premium
      { id: 'field-1', name: 'Field Level 1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-2', name: 'Field Level 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-3', name: 'Field Level 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-4', name: 'Field Level 4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-5', name: 'Field Level 5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },

      // Lower Box
      { id: 'lower-101', name: 'Lower Box 101', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'lower-102', name: 'Lower Box 102', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'lower-103', name: 'Lower Box 103', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'lower-104', name: 'Lower Box 104', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'lower-105', name: 'Lower Box 105', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },

      { id: 'lower-106', name: 'Lower Box 106', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'lower-107', name: 'Lower Box 107', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'lower-108', name: 'Lower Box 108', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'lower-109', name: 'Lower Box 109', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'lower-110', name: 'Lower Box 110', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },

      // Upper Reserved
      { id: 'upper-201', name: 'Upper Reserved 201', level: 'upper', baseAngle: 340, angleSpan: 25, covered: true, price: 'value' },
      { id: 'upper-202', name: 'Upper Reserved 202', level: 'upper', baseAngle: 5, angleSpan: 25, covered: true, price: 'value' },
      { id: 'upper-203', name: 'Upper Reserved 203', level: 'upper', baseAngle: 30, angleSpan: 25, covered: true, price: 'value' },

      // Coca-Cola Field Right Field
      { id: 'rf-party', name: 'Right Field Party Deck', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'lf-party', name: 'Left Field Party Deck', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },

      // Center Field
      { id: 'cf-berm', name: 'Center Field Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },

      // Club Level
      { id: 'rich-club', name: 'Rich Products Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Buffalo, opened 1988, renovated extensively'
  },

  {
    venueId: 'charlotte-knights',
    venueName: 'Truist Field',
    lastUpdated: '2024-01',
    sections: [
      // Crown Club (Premium)
      { id: 'crown-1', name: 'Crown Club 1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'crown-2', name: 'Crown Club 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'crown-3', name: 'Crown Club 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'crown-4', name: 'Crown Club 4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'crown-5', name: 'Crown Club 5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },

      // Field Box
      { id: 'fb-101', name: 'Field Box 101', level: 'lower', baseAngle: 30, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Field Box 102', level: 'lower', baseAngle: 41, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Field Box 103', level: 'lower', baseAngle: 52, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 63, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 74, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 85, angleSpan: 11, covered: false, price: 'value' },

      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 275, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 286, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 297, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Field Box 110', level: 'lower', baseAngle: 308, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-111', name: 'Field Box 111', level: 'lower', baseAngle: 319, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-112', name: 'Field Box 112', level: 'lower', baseAngle: 330, angleSpan: 11, covered: false, price: 'moderate' },

      // Stadium Club Level
      { id: 'stadium-201', name: 'Stadium Club 201', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'stadium-202', name: 'Stadium Club 202', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'stadium-203', name: 'Stadium Club 203', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'luxury' },

      // Outfield Areas
      { id: 'home-run-porch', name: 'Home Run Porch', level: 'ga', baseAngle: 96, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'club', baseAngle: 136, angleSpan: 60, covered: true, price: 'moderate' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 196, angleSpan: 60, covered: false, price: 'value' },

      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Charlotte with city skyline views, opened 2014'
  },

  {
    venueId: 'durham-bulls',
    venueName: 'Durham Bulls Athletic Park',
    lastUpdated: '2024-01',
    sections: [
      // Blue Monster Premium
      { id: 'monster-1', name: 'Blue Monster 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'monster-2', name: 'Blue Monster 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'monster-3', name: 'Blue Monster 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'monster-4', name: 'Blue Monster 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },

      // Field Level
      { id: 'field-101', name: 'Field Level 101', level: 'lower', baseAngle: 28, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-102', name: 'Field Level 102', level: 'lower', baseAngle: 40, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-103', name: 'Field Level 103', level: 'lower', baseAngle: 52, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-104', name: 'Field Level 104', level: 'lower', baseAngle: 64, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-105', name: 'Field Level 105', level: 'lower', baseAngle: 76, angleSpan: 12, covered: false, price: 'value' },

      { id: 'field-106', name: 'Field Level 106', level: 'lower', baseAngle: 284, angleSpan: 12, covered: false, price: 'value' },
      { id: 'field-107', name: 'Field Level 107', level: 'lower', baseAngle: 296, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-108', name: 'Field Level 108', level: 'lower', baseAngle: 308, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-109', name: 'Field Level 109', level: 'lower', baseAngle: 320, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-110', name: 'Field Level 110', level: 'lower', baseAngle: 332, angleSpan: 12, covered: false, price: 'moderate' },

      // Club Level (El Toro)
      { id: 'toro-201', name: 'El Toro Club 201', level: 'club', baseAngle: 340, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'toro-202', name: 'El Toro Club 202', level: 'club', baseAngle: 355, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'toro-203', name: 'El Toro Club 203', level: 'club', baseAngle: 10, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'toro-204', name: 'El Toro Club 204', level: 'club', baseAngle: 25, angleSpan: 15, covered: true, price: 'luxury' },

      // Bull City Outfield
      { id: 'bull-city', name: 'Bull City Outfield', level: 'ga', baseAngle: 88, angleSpan: 44, covered: false, price: 'value' },
      { id: 'hit-bull', name: 'Hit Bull Win Steak', level: 'berm', baseAngle: 132, angleSpan: 96, covered: false, price: 'value' },
      { id: 'lf-reserved', name: 'Left Field Reserved', level: 'ga', baseAngle: 228, angleSpan: 44, covered: false, price: 'value' },

      // American Tobacco Suite Level
      { id: 'tobacco-suite', name: 'American Tobacco Suite', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Made famous by Bull Durham movie, iconic snorting bull, opened 1995'
  },

  {
    venueId: 'norfolk-tides',
    venueName: 'Harbor Park',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'diamond-1', name: 'Diamond Club 1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-2', name: 'Diamond Club 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-3', name: 'Diamond Club 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-4', name: 'Diamond Club 4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-5', name: 'Diamond Club 5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },

      // Field Box
      { id: 'fb-101', name: 'Field Box 101', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Field Box 102', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Field Box 103', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },

      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Field Box 110', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },

      // Harbor Club
      { id: 'harbor-201', name: 'Harbor Club 201', level: 'club', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'harbor-202', name: 'Harbor Club 202', level: 'club', baseAngle: 0, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'harbor-203', name: 'Harbor Club 203', level: 'club', baseAngle: 20, angleSpan: 20, covered: true, price: 'luxury' },

      // Outfield Areas
      { id: 'rf-picnic', name: 'Right Field Picnic', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'harbor-view', name: 'Harbor View Deck', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-party', name: 'Left Field Party Deck', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },

      // Suite Level
      { id: 'waterfront-suite', name: 'Waterfront Suite', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Norfolk waterfront with harbor views, opened 1993'
  },


  {
    venueId: 'fresno-grizzlies',
    venueName: 'Chukchansi Park',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club Premium
      { id: 'diamond-1', name: 'Diamond Club 1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-2', name: 'Diamond Club 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-3', name: 'Diamond Club 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-4', name: 'Diamond Club 4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-5', name: 'Diamond Club 5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },

      // Field Reserved
      { id: 'fr-101', name: 'Field Reserved 101', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fr-102', name: 'Field Reserved 102', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fr-103', name: 'Field Reserved 103', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fr-104', name: 'Field Reserved 104', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fr-105', name: 'Field Reserved 105', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },

      { id: 'fr-106', name: 'Field Reserved 106', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fr-107', name: 'Field Reserved 107', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fr-108', name: 'Field Reserved 108', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fr-109', name: 'Field Reserved 109', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fr-110', name: 'Field Reserved 110', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },

      // Club Level
      { id: 'grizzly-club', name: 'Grizzly Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' },

      // Outfield Areas  
      { id: 'rf-party', name: 'Right Field Party Deck', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'valley-view', name: 'Valley View Pavilion', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-landing', name: 'Left Field Landing', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },

      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Fresno, mountain views beyond outfield'
  },

  {
    venueId: 'indianapolis-indians',
    venueName: 'Victory Field',
    lastUpdated: '2024-01',
    sections: [
      // Victory Club Premium
      { id: 'victory-1', name: 'Victory Club 1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'victory-2', name: 'Victory Club 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'victory-3', name: 'Victory Club 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'victory-4', name: 'Victory Club 4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'victory-5', name: 'Victory Club 5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },

      // Field Level
      { id: 'field-101', name: 'Field Level 101', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-102', name: 'Field Level 102', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-103', name: 'Field Level 103', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-104', name: 'Field Level 104', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-105', name: 'Field Level 105', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },

      { id: 'field-106', name: 'Field Level 106', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'field-107', name: 'Field Level 107', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-108', name: 'Field Level 108', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-109', name: 'Field Level 109', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'field-110', name: 'Field Level 110', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },

      // Upper Reserved
      { id: 'upper-201', name: 'Upper Reserved 201', level: 'upper', baseAngle: 340, angleSpan: 25, covered: true, price: 'value' },
      { id: 'upper-202', name: 'Upper Reserved 202', level: 'upper', baseAngle: 5, angleSpan: 25, covered: true, price: 'value' },
      { id: 'upper-203', name: 'Upper Reserved 203', level: 'upper', baseAngle: 30, angleSpan: 25, covered: true, price: 'value' },

      // Indianapolis Skyline Deck
      { id: 'skyline-deck', name: 'Indianapolis Skyline Deck', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      
      // Victory Plaza
      { id: 'victory-plaza', name: 'Victory Plaza', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },

      // Left Field Terrace
      { id: 'lf-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },

      // Indianapolis Club
      { id: 'indy-club', name: 'Indianapolis Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Indianapolis with city skyline views, opened 1996'
  }
];

// Export all AAA layouts (combining with existing ones)
export const allAAALayouts = aaaCompleteLayouts;