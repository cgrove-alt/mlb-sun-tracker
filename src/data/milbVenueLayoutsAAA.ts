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
      { id: 'premium-1', name: 'Las Vegas Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Las Vegas Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Las Vegas Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Las Vegas Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Las Vegas Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Desert ballpark with swimming pool, opened 2019 in Summerlin'
  },
  
  {
    venueId: 'durham-bulls',
    venueName: 'Durham Bulls Athletic Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Durham Bulls Athletic Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Durham Bulls Athletic Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Durham Bulls Athletic Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Durham Bulls Athletic Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Durham Bulls Athletic Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Durham, NC, opened 1995, expanded to 10,000 capacity in 1998, features famous Blue Monster (32-ft left field wall), 360-degree ballpark, $16M brick construction'
  },
  
  {
    venueId: 'albuquerque-isotopes',
    venueName: 'Isotopes Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Isotopes Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Isotopes Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Isotopes Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Isotopes Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-201', name: 'Section 201', level: 'upper', baseAngle: 340, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-202', name: 'Section 202', level: 'upper', baseAngle: 358, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-203', name: 'Section 203', level: 'upper', baseAngle: 16, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-204', name: 'Section 204', level: 'upper', baseAngle: 34, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-205', name: 'Section 205', level: 'upper', baseAngle: 52, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-206', name: 'Section 206', level: 'upper', baseAngle: 70, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-207', name: 'Section 207', level: 'upper', baseAngle: 88, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-208', name: 'Section 208', level: 'upper', baseAngle: 106, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-209', name: 'Section 209', level: 'upper', baseAngle: 124, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-210', name: 'Section 210', level: 'upper', baseAngle: 142, angleSpan: 18, covered: true, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-berm', name: 'Center Field Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Isotopes Hill', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Coors Light Pavilion', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Party Pavilion', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'High altitude (5,300 ft), oriented northeast'
  },
  
  {
    venueId: 'columbus-clippers',
    venueName: 'Huntington Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Huntington Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Huntington Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Huntington Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Huntington Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Huntington Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Columbus in Arena District, opened 2009'
  },
  
  {
    venueId: 'el-paso-chihuahuas',
    venueName: 'Southwest University Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sante-fe-club', name: 'Santa Fe Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
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
      { id: 'mountain-star-deck', name: 'Mountain Star Sports Bar', level: 'club', baseAngle: 87, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'hunt-companies-pavilion', name: 'Hunt Companies Pavilion', level: 'ga', baseAngle: 137, angleSpan: 60, covered: false, price: 'value' },
      { id: 'fiesta-deck', name: 'Fiesta Deck', level: 'club', baseAngle: 197, angleSpan: 40, covered: true, price: 'moderate' },
      { id: 'mesa-lawn', name: 'Mesa Lawn', level: 'berm', baseAngle: 237, angleSpan: 48, covered: false, price: 'value' }
    ],
    notes: 'Downtown El Paso with mountain views, opened 2014'
  },
  
  {
    venueId: 'gwinnett-stripers',
    venueName: 'Coolray Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Coolray Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Coolray Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Coolray Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Coolray Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Coolray Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Lawrenceville, GA - suburban Atlanta location'
  },
  
  {
    venueId: 'indianapolis-indians',
    venueName: 'Victory Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Victory Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Victory Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Victory Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Victory Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Victory Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Indianapolis, rated best MiLB ballpark experience'
  },
  
  {
    venueId: 'iowa-cubs',
    venueName: 'Principal Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Principal Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Principal Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Principal Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Principal Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Left Field Building', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Principal Park Club', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Daktronics Deck', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Confluence of rivers location, renovated 2004'
  },
  
  {
    venueId: 'jacksonville-jumbo-shrimp',
    venueName: '121 Financial Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: '121 Financial Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: '121 Financial Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: '121 Financial Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: '121 Financial Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: '121 Financial Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Jacksonville, renovated 2017 with modern amenities'
  },
  
  {
    venueId: 'lehigh-valley-ironpigs',
    venueName: 'Coca-Cola Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Coca-Cola Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Coca-Cola Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Coca-Cola Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Coca-Cola Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-201', name: 'Section 201', level: 'upper', baseAngle: 340, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-202', name: 'Section 202', level: 'upper', baseAngle: 358, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-203', name: 'Section 203', level: 'upper', baseAngle: 16, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-204', name: 'Section 204', level: 'upper', baseAngle: 34, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-205', name: 'Section 205', level: 'upper', baseAngle: 52, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-206', name: 'Section 206', level: 'upper', baseAngle: 70, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-207', name: 'Section 207', level: 'upper', baseAngle: 88, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-208', name: 'Section 208', level: 'upper', baseAngle: 106, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-209', name: 'Section 209', level: 'upper', baseAngle: 124, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-210', name: 'Section 210', level: 'upper', baseAngle: 142, angleSpan: 18, covered: true, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Bacon Strip (outfield seating)', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Coca-Cola Park Club', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Tiki Terrace', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Allentown, PA - known for Bacon USA concession stand'
  },
  
  {
    venueId: 'louisville-bats',
    venueName: 'Louisville Slugger Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Louisville Slugger Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Louisville Slugger Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Louisville Slugger Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Louisville Slugger Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-201', name: 'Section 201', level: 'upper', baseAngle: 340, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-202', name: 'Section 202', level: 'upper', baseAngle: 358, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-203', name: 'Section 203', level: 'upper', baseAngle: 16, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-204', name: 'Section 204', level: 'upper', baseAngle: 34, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-205', name: 'Section 205', level: 'upper', baseAngle: 52, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-206', name: 'Section 206', level: 'upper', baseAngle: 70, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-207', name: 'Section 207', level: 'upper', baseAngle: 88, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-208', name: 'Section 208', level: 'upper', baseAngle: 106, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-209', name: 'Section 209', level: 'upper', baseAngle: 124, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-210', name: 'Section 210', level: 'upper', baseAngle: 142, angleSpan: 18, covered: true, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Jim Beam Bourbon Bar', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'First Base Terrace', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'PNC Club', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Louisville on Ohio River, opened 2000'
  },
  
  {
    venueId: 'memphis-redbirds',
    venueName: 'AutoZone Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'AutoZone Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'AutoZone Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'AutoZone Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'AutoZone Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-201', name: 'Section 201', level: 'upper', baseAngle: 340, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-202', name: 'Section 202', level: 'upper', baseAngle: 358, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-203', name: 'Section 203', level: 'upper', baseAngle: 16, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-204', name: 'Section 204', level: 'upper', baseAngle: 34, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-205', name: 'Section 205', level: 'upper', baseAngle: 52, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-206', name: 'Section 206', level: 'upper', baseAngle: 70, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-207', name: 'Section 207', level: 'upper', baseAngle: 88, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-208', name: 'Section 208', level: 'upper', baseAngle: 106, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-209', name: 'Section 209', level: 'upper', baseAngle: 124, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-210', name: 'Section 210', level: 'upper', baseAngle: 142, angleSpan: 18, covered: true, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Bluff Restaurant', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'AutoZone Park Club', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Toyota Terrace', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Memphis, classic brick design, opened 2000'
  },
  
  {
    venueId: 'nashville-sounds',
    venueName: 'First Horizon Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'First Horizon Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'First Horizon Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'First Horizon Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'First Horizon Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-201', name: 'Section 201', level: 'upper', baseAngle: 340, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-202', name: 'Section 202', level: 'upper', baseAngle: 358, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-203', name: 'Section 203', level: 'upper', baseAngle: 16, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-204', name: 'Section 204', level: 'upper', baseAngle: 34, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-205', name: 'Section 205', level: 'upper', baseAngle: 52, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-206', name: 'Section 206', level: 'upper', baseAngle: 70, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-207', name: 'Section 207', level: 'upper', baseAngle: 88, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-208', name: 'Section 208', level: 'upper', baseAngle: 106, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-209', name: 'Section 209', level: 'upper', baseAngle: 124, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-210', name: 'Section 210', level: 'upper', baseAngle: 142, angleSpan: 18, covered: true, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'The Band Box', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Budweiser Bowtie Bar', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'First Base Line Club', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Nashville with guitar-shaped scoreboard, opened 2015'
  },
  
  {
    venueId: 'norfolk-tides',
    venueName: 'Harbor Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Harbor Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Harbor Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Harbor Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Harbor Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Harbor Park Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Norfolk Southern Right Field Pavilion', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Wells Fargo Picnic Area', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Norfolk on Elizabeth River, skyline views'
  },
  
  {
    venueId: 'oklahoma-city-dodgers',
    venueName: 'Chickasaw Bricktown Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Chickasaw Bricktown Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Chickasaw Bricktown Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Chickasaw Bricktown Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Chickasaw Bricktown Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-201', name: 'Section 201', level: 'upper', baseAngle: 340, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-202', name: 'Section 202', level: 'upper', baseAngle: 358, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-203', name: 'Section 203', level: 'upper', baseAngle: 16, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-204', name: 'Section 204', level: 'upper', baseAngle: 34, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-205', name: 'Section 205', level: 'upper', baseAngle: 52, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-206', name: 'Section 206', level: 'upper', baseAngle: 70, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-207', name: 'Section 207', level: 'upper', baseAngle: 88, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-208', name: 'Section 208', level: 'upper', baseAngle: 106, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-209', name: 'Section 209', level: 'upper', baseAngle: 124, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-210', name: 'Section 210', level: 'upper', baseAngle: 142, angleSpan: 18, covered: true, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Mickey Mantle Plaza', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Bricktown Brewery Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Oil Derrick', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Bricktown entertainment district, opened 1998'
  },
  
  {
    venueId: 'omaha-storm-chasers',
    venueName: 'Werner Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Werner Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Werner Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Werner Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Werner Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-berm', name: 'Center Field Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Werner Park Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Sarpy County Tourism Pavilion', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Storm Chasers Brew Hall', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Papillion, NE (Omaha suburb), opened 2011'
  },
  
  {
    venueId: 'reno-aces',
    venueName: 'Greater Nevada Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Greater Nevada Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Greater Nevada Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Greater Nevada Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Greater Nevada Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Freight House District', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Aces Club', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'SK Baseball Club', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Reno, opened 2009 with mountain views'
  },
  
  {
    venueId: 'rochester-red-wings',
    venueName: 'Innovative Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Innovative Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Innovative Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Innovative Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Innovative Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-201', name: 'Section 201', level: 'upper', baseAngle: 340, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-202', name: 'Section 202', level: 'upper', baseAngle: 358, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-203', name: 'Section 203', level: 'upper', baseAngle: 16, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-204', name: 'Section 204', level: 'upper', baseAngle: 34, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-205', name: 'Section 205', level: 'upper', baseAngle: 52, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-206', name: 'Section 206', level: 'upper', baseAngle: 70, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-207', name: 'Section 207', level: 'upper', baseAngle: 88, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-208', name: 'Section 208', level: 'upper', baseAngle: 106, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-209', name: 'Section 209', level: 'upper', baseAngle: 124, angleSpan: 18, covered: true, price: 'value' },
      { id: 'sec-210', name: 'Section 210', level: 'upper', baseAngle: 142, angleSpan: 18, covered: true, price: 'value' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Frontier Field Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Wings Nest', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Genesee Brew House', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Rochester, renovated 2021'
  },
  
  {
    venueId: 'round-rock-express',
    venueName: 'Dell Diamond',
    lastUpdated: '2024-01',
    sections: [
      // Premium Seats (Behind home plate with tray tables and wait staff)
      { id: 'premium-hp', name: 'Premium Home Plate', level: 'field', baseAngle: 2, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'premium-106', name: 'Premium 106', level: 'field', baseAngle: 10, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'premium-107', name: 'Premium 107', level: 'field', baseAngle: 18, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'premium-108', name: 'Premium 108', level: 'field', baseAngle: 342, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'premium-109', name: 'Premium 109', level: 'field', baseAngle: 350, angleSpan: 8, covered: false, price: 'premium' },
      
      // Dugout Seats (Closest to field and dugouts)
      { id: 'dugout-105', name: 'Dugout 105', level: 'field', baseAngle: 26, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'dugout-104', name: 'Dugout 104', level: 'field', baseAngle: 34, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'dugout-103', name: 'Dugout 103', level: 'field', baseAngle: 42, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'dugout-102', name: 'Dugout 102', level: 'field', baseAngle: 318, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'dugout-101', name: 'Dugout 101', level: 'field', baseAngle: 326, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'dugout-100', name: 'Dugout 100', level: 'field', baseAngle: 334, angleSpan: 8, covered: false, price: 'premium' },
      
      // 200 Level (Chair-back seating with panoramic views)
      { id: 'section-201', name: 'Section 201', level: 'upper', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'section-202', name: 'Section 202', level: 'upper', baseAngle: 340, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'section-203', name: 'Section 203', level: 'upper', baseAngle: 350, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'section-204', name: 'Section 204', level: 'upper', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'section-205', name: 'Section 205', level: 'upper', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'section-206', name: 'Section 206', level: 'upper', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'section-207', name: 'Section 207', level: 'upper', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'section-208', name: 'Section 208', level: 'upper', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'section-209', name: 'Section 209', level: 'upper', baseAngle: 50, angleSpan: 10, covered: false, price: 'value' },
      { id: 'section-210', name: 'Section 210', level: 'upper', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      
      // 300 Level (Budget-friendly upper deck)
      { id: 'section-301', name: 'Section 301', level: 'upper', baseAngle: 315, angleSpan: 15, covered: true, price: 'value' },
      { id: 'section-302', name: 'Section 302', level: 'upper', baseAngle: 330, angleSpan: 15, covered: true, price: 'value' },
      { id: 'section-303', name: 'Section 303', level: 'upper', baseAngle: 345, angleSpan: 15, covered: true, price: 'value' },
      { id: 'section-304', name: 'Section 304', level: 'upper', baseAngle: 0, angleSpan: 15, covered: true, price: 'value' },
      { id: 'section-305', name: 'Section 305', level: 'upper', baseAngle: 15, angleSpan: 15, covered: true, price: 'value' },
      { id: 'section-306', name: 'Section 306', level: 'upper', baseAngle: 30, angleSpan: 15, covered: true, price: 'value' },
      { id: 'section-307', name: 'Section 307', level: 'upper', baseAngle: 45, angleSpan: 15, covered: true, price: 'value' },
      
      // The 4Topps (360-degree swivel chairs, Section 123 area)
      { id: 'fourtopps', name: 'The 4Topps', level: 'club', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Party Porch Left (30+ people group area)
      { id: 'party-porch-left', name: 'Party Porch Left', level: 'club', baseAngle: 225, angleSpan: 30, covered: false, price: 'moderate' },
      
      // Party Porch Right (40+ people group area)
      { id: 'party-porch-right', name: 'Party Porch Right', level: 'club', baseAngle: 75, angleSpan: 35, covered: false, price: 'moderate' },
      
      // Berm Seating (Grassy hill beyond outfield)
      { id: 'berm-seating', name: 'Berm Seating', level: 'berm', baseAngle: 110, angleSpan: 80, covered: false, price: 'value' },
      
      // Home Run Dugout (Right field reservation area)
      { id: 'hr-dugout', name: 'Home Run Dugout', level: 'club', baseAngle: 70, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Bullpen Bar (Right field bar area)
      { id: 'bullpen-bar', name: 'Bullpen Bar', level: 'club', baseAngle: 90, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Home Plate Suites (VIP with indoor/outdoor seating)
      { id: 'hp-suite-1', name: 'Home Plate Suite 1', level: 'suite', baseAngle: 355, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'hp-suite-2', name: 'Home Plate Suite 2', level: 'suite', baseAngle: 0, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'hp-suite-3', name: 'Home Plate Suite 3', level: 'suite', baseAngle: 5, angleSpan: 5, covered: true, price: 'luxury' },
      
      // Press Box Suites (Luxury with exclusive amenities)
      { id: 'pb-suite-1', name: 'Press Box Suite 1', level: 'suite', baseAngle: 350, angleSpan: 5, covered: true, price: 'luxury' },
      { id: 'pb-suite-2', name: 'Press Box Suite 2', level: 'suite', baseAngle: 10, angleSpan: 5, covered: true, price: 'luxury' }
    ],
    notes: 'Round Rock, TX (Austin suburb), opened 2000, AAA affiliate of Texas Rangers, famous for close-up views (backstop 55ft from home plate vs 60ft 6in to mound), 11,631 capacity, state-of-the-art HD LED boards installed 2024'
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
      { id: 'premium-1', name: 'PNC Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'PNC Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'PNC Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'PNC Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'PNC Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Moosic, PA (near Scranton), opened 2013'
  },
  
  {
    venueId: 'st-paul-saints',
    venueName: 'CHS Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'CHS Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'CHS Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'CHS Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'CHS Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Treasure Island Center', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Lowertown Ballpark Club', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Left Field Bar', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Lowertown St. Paul, opened 2015, downtown skyline views'
  },
  
  {
    venueId: 'sugar-land-space-cowboys',
    venueName: 'Constellation Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Constellation Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Constellation Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Constellation Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Constellation Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Insperity Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Diamond Club', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Torchy\'s Tacos Deck', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Sugar Land, TX (Houston suburb), opened 2012'
  },
  
  {
    venueId: 'syracuse-mets',
    venueName: 'NBT Bank Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'NBT Bank Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'NBT Bank Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'NBT Bank Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'NBT Bank Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Hank Sauer Room', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'NBT Bank Stadium Club', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Salt City Deck', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Syracuse, NY, renovated 2010'
  },
  
  {
    venueId: 'tacoma-rainiers',
    venueName: 'Cheney Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Cheney Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Cheney Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Cheney Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Cheney Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Mt. Rainier Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'R Bar', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'KeyBank Terrace', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Tacoma, WA, historic stadium opened 1960'
  },
  
  {
    venueId: 'toledo-mud-hens',
    venueName: 'Fifth Third Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Fifth Third Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Fifth Third Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Fifth Third Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Fifth Third Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'The Roost', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Fleetwood\'s Tap Room', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'KeyBank Club', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Toledo on Maumee River, opened 2002'
  },

  {
    venueId: 'buffalo-bisons',
    venueName: 'Sahlen Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Sahlen Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Sahlen Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Sahlen Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Sahlen Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Sahlen Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Buffalo, highest-capacity Triple-A ballpark (16,600)'
  },

  {
    venueId: 'charlotte-knights',
    venueName: 'Truist Field',
    lastUpdated: '2024-01',
    sections: [
      // Lower Level Sections (100 Level)
      { id: 'section-101', name: 'Section 101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'section-102', name: 'Section 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'section-103', name: 'Section 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'section-104', name: 'Section 104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'section-105', name: 'Section 105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'section-106', name: 'Section 106', level: 'field', baseAngle: 30, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'section-107', name: 'Section 107', level: 'field', baseAngle: 41, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'section-108', name: 'Section 108', level: 'field', baseAngle: 52, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'section-110', name: 'Section 110', level: 'field', baseAngle: 74, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'section-111', name: 'Section 111', level: 'field', baseAngle: 85, angleSpan: 11, covered: false, price: 'value' },
      { id: 'section-112', name: 'Section 112', level: 'field', baseAngle: 96, angleSpan: 11, covered: false, price: 'value' },
      { id: 'section-113', name: 'Section 113', level: 'field', baseAngle: 264, angleSpan: 11, covered: false, price: 'value' },
      { id: 'section-114', name: 'Section 114', level: 'field', baseAngle: 275, angleSpan: 11, covered: false, price: 'value' },
      { id: 'section-115', name: 'Section 115', level: 'field', baseAngle: 286, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'section-116', name: 'Section 116', level: 'field', baseAngle: 297, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'section-117', name: 'Section 117', level: 'field', baseAngle: 308, angleSpan: 11, covered: false, price: 'moderate' },
      
      // Upper Club Level (200 Level - 975 club seats)
      { id: 'section-201', name: 'Section 201', level: 'club', baseAngle: 340, angleSpan: 13, covered: true, price: 'luxury' },
      { id: 'section-202', name: 'Section 202', level: 'club', baseAngle: 353, angleSpan: 13, covered: true, price: 'luxury' },
      { id: 'section-203', name: 'Section 203', level: 'club', baseAngle: 6, angleSpan: 13, covered: true, price: 'luxury' },
      { id: 'section-204', name: 'Section 204', level: 'club', baseAngle: 19, angleSpan: 13, covered: true, price: 'luxury' },
      { id: 'section-205', name: 'Section 205', level: 'club', baseAngle: 32, angleSpan: 13, covered: true, price: 'luxury' },
      { id: 'section-206', name: 'Section 206', level: 'club', baseAngle: 45, angleSpan: 13, covered: true, price: 'luxury' },
      { id: 'section-207', name: 'Section 207', level: 'club', baseAngle: 58, angleSpan: 13, covered: true, price: 'luxury' },
      { id: 'section-208', name: 'Section 208', level: 'club', baseAngle: 71, angleSpan: 13, covered: true, price: 'luxury' },
      { id: 'section-209', name: 'Section 209', level: 'club', baseAngle: 84, angleSpan: 13, covered: true, price: 'luxury' },
      
      // Upper Level (210-219)
      { id: 'section-210', name: 'Section 210', level: 'upper', baseAngle: 97, angleSpan: 13, covered: true, price: 'value' },
      { id: 'section-211', name: 'Section 211', level: 'upper', baseAngle: 110, angleSpan: 13, covered: true, price: 'value' },
      { id: 'section-212', name: 'Section 212', level: 'upper', baseAngle: 123, angleSpan: 13, covered: true, price: 'value' },
      { id: 'section-213', name: 'Section 213', level: 'upper', baseAngle: 136, angleSpan: 13, covered: true, price: 'value' },
      { id: 'section-214', name: 'Section 214', level: 'upper', baseAngle: 224, angleSpan: 13, covered: true, price: 'value' },
      { id: 'section-215', name: 'Section 215', level: 'upper', baseAngle: 237, angleSpan: 13, covered: true, price: 'value' },
      { id: 'section-216', name: 'Section 216', level: 'upper', baseAngle: 250, angleSpan: 13, covered: true, price: 'value' },
      { id: 'section-217', name: 'Section 217', level: 'upper', baseAngle: 263, angleSpan: 13, covered: true, price: 'value' },
      { id: 'section-218', name: 'Section 218', level: 'upper', baseAngle: 276, angleSpan: 13, covered: true, price: 'value' },
      { id: 'section-219', name: 'Section 219', level: 'upper', baseAngle: 289, angleSpan: 13, covered: true, price: 'value' },
      
      // Special Areas
      { id: 'elevator-access', name: 'Elevator Access Behind 109', level: 'access', baseAngle: 63, angleSpan: 5, covered: false, price: 'moderate' },
      { id: 'belfor-dugout-suites', name: 'BELFOR Dugout Suites', level: 'suite', baseAngle: 319, angleSpan: 21, covered: true, price: 'luxury' },
      
      // Outfield Areas
      { id: 'knights-castle', name: 'Knights Castle', level: 'ga', baseAngle: 149, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-skyline-deck', name: 'Center Field Skyline Deck', level: 'club', baseAngle: 179, angleSpan: 45, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Charlotte with city skyline views, opened 2014'
  },

  {
    venueId: 'durham-bulls',
    venueName: 'Durham Bulls Athletic Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Durham Bulls Athletic Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Durham Bulls Athletic Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Durham Bulls Athletic Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Durham Bulls Athletic Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Durham Bulls Athletic Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Made famous by Bull Durham movie, iconic snorting bull, opened 1995'
  },

  {
    venueId: 'norfolk-tides',
    venueName: 'Harbor Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Harbor Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Harbor Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Harbor Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Harbor Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Harbor Park Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Norfolk Southern Right Field Pavilion', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Wells Fargo Picnic Area', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Norfolk waterfront with harbor views, opened 1993'
  },


  {
    venueId: 'fresno-grizzlies',
    venueName: 'Chukchansi Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Chukchansi Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Chukchansi Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Chukchansi Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Chukchansi Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Chukchansi Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Fresno, mountain views beyond outfield'
  },

  {
    venueId: 'indianapolis-indians',
    venueName: 'Victory Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Victory Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Victory Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Victory Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Victory Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Victory Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Indianapolis with city skyline views, opened 1996'
  }
];

// Export all AAA layouts (combining with existing ones)
export const allAAALayouts = aaaCompleteLayouts;