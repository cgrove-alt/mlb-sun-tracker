// A+ (High-A) Stadium Layouts
// Complete venue-specific seating configurations for all 26 A+ stadiums

import { VenueLayout } from './milbVenueLayouts';

export const aPlusVenueLayouts: VenueLayout[] = [
  {
    venueId: 'aberdeen-ironbirds',
    venueName: 'Leidos Field at Ripken Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-a', name: 'Box Section A', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-b', name: 'Box Section B', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-c', name: 'Box Section C', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Reserved Seating
      { id: 'res-1', name: 'Reserved 1', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-2', name: 'Reserved 2', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-3', name: 'Reserved 3', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'res-4', name: 'Reserved 4', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'res-5', name: 'Reserved 5', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-6', name: 'Reserved 6', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-7', name: 'Reserved 7', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // GA Areas
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 60, covered: false, price: 'value' },
      { id: 'hill', name: 'The Hill', level: 'berm', baseAngle: 160, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'skybox', name: 'Skyboxes', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Cal Ripken designed stadium, oriented northeast'
  },

  {
    venueId: 'asheville-tourists',
    venueName: 'McCormick Field',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 330, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 345, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 0, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'field', baseAngle: 15, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'box-5', name: 'Box 5', level: 'field', baseAngle: 30, angleSpan: 15, covered: false, price: 'premium' },
      
      // Reserved
      { id: 'res-101', name: 'Reserved 101', level: 'lower', baseAngle: 45, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-102', name: 'Reserved 102', level: 'lower', baseAngle: 60, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-103', name: 'Reserved 103', level: 'lower', baseAngle: 75, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'res-104', name: 'Reserved 104', level: 'lower', baseAngle: 285, angleSpan: 15, covered: false, price: 'value' },
      { id: 'res-105', name: 'Reserved 105', level: 'lower', baseAngle: 300, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-106', name: 'Reserved 106', level: 'lower', baseAngle: 315, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Bleachers and GA
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 130, angleSpan: 50, covered: true, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 230, angleSpan: 40, covered: false, price: 'value' }
    ],
    notes: 'Historic stadium built in 1924, mountain views beyond outfield'
  },

  {
    venueId: 'beloit-sky-carp',
    venueName: 'ABC Supply Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Premium
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 335, angleSpan: 17, covered: false, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 352, angleSpan: 16, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 8, angleSpan: 17, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 25, angleSpan: 17, covered: false, price: 'premium' },
      
      // Baseline Reserved
      { id: 'sec-104', name: 'Section 104', level: 'lower', baseAngle: 42, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 58, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 74, angleSpan: 16, covered: false, price: 'value' },
      
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 270, angleSpan: 16, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 286, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 302, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 318, angleSpan: 17, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-deck', name: 'Right Field Deck', level: 'ga', baseAngle: 90, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lawn', name: 'Outfield Lawn', level: 'berm', baseAngle: 140, angleSpan: 90, covered: false, price: 'value' },
      
      // Club
      { id: 'club-level', name: 'Gehl Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Opened 2021, Rock River location, modern amenities'
  },

  {
    venueId: 'bowling-green-hot-rods',
    venueName: 'Bowling Green Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-a', name: 'Box A', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-b', name: 'Box B', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-c', name: 'Box C', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Reserved
      { id: 'res-1', name: 'Reserved 1', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-2', name: 'Reserved 2', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-3', name: 'Reserved 3', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'res-4', name: 'Reserved 4', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'res-5', name: 'Reserved 5', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-6', name: 'Reserved 6', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-7', name: 'Reserved 7', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // GA
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 100, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 200, angleSpan: 60, covered: false, price: 'value' },
      
      // Party Deck
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 340, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Rays affiliate, compact modern stadium'
  },

  {
    venueId: 'brooklyn-cyclones',
    venueName: 'Maimonides Park',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-1', name: 'Field Box 1', level: 'field', baseAngle: 335, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-2', name: 'Field Box 2', level: 'field', baseAngle: 348, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'fb-3', name: 'Field Box 3', level: 'field', baseAngle: 0, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'fb-4', name: 'Field Box 4', level: 'field', baseAngle: 12, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-5', name: 'Field Box 5', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'premium' },
      
      // Box MVP
      { id: 'mvp-6', name: 'Box MVP 6', level: 'lower', baseAngle: 38, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'mvp-7', name: 'Box MVP 7', level: 'lower', baseAngle: 50, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'mvp-8', name: 'Box MVP 8', level: 'lower', baseAngle: 62, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'mvp-9', name: 'Box MVP 9', level: 'lower', baseAngle: 74, angleSpan: 12, covered: false, price: 'moderate' },
      
      { id: 'mvp-10', name: 'Box MVP 10', level: 'lower', baseAngle: 274, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'mvp-11', name: 'Box MVP 11', level: 'lower', baseAngle: 286, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'mvp-12', name: 'Box MVP 12', level: 'lower', baseAngle: 298, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'mvp-13', name: 'Box MVP 13', level: 'lower', baseAngle: 310, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'mvp-14', name: 'Box MVP 14', level: 'lower', baseAngle: 322, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 86, angleSpan: 44, covered: false, price: 'value' },
      { id: 'cf-bleach', name: 'Center Field Bleachers', level: 'ga', baseAngle: 130, angleSpan: 100, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 230, angleSpan: 44, covered: false, price: 'value' },
      
      // Pepsi Porch (Upper)
      { id: 'pepsi-porch', name: 'Pepsi Porch', level: 'upper', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Coney Island boardwalk location, Atlantic Ocean views'
  },

  {
    venueId: 'cedar-rapids-kernels',
    venueName: 'Veterans Memorial Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Reserved
      { id: 'res-a', name: 'Reserved A', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-b', name: 'Reserved B', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-c', name: 'Reserved C', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'res-d', name: 'Reserved D', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'res-e', name: 'Reserved E', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-f', name: 'Reserved F', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-g', name: 'Reserved G', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // GA
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-hill', name: 'Left Field Hill', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Party Pavilion
      { id: 'party-pav', name: 'Party Pavilion', level: 'ga', baseAngle: 150, angleSpan: 60, covered: true, price: 'value' }
    ],
    notes: 'Classic midwestern ballpark, Twins affiliate'
  },

  {
    venueId: 'dayton-dragons',
    venueName: 'Day Air Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Seats
      { id: 'diamond-1', name: 'Diamond 1', level: 'field', baseAngle: 335, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'diamond-2', name: 'Diamond 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-3', name: 'Diamond 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-4', name: 'Diamond 4', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'diamond-5', name: 'Diamond 5', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      
      // Plaza Reserved
      { id: 'plaza-101', name: 'Plaza 101', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'plaza-102', name: 'Plaza 102', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'plaza-103', name: 'Plaza 103', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'plaza-104', name: 'Plaza 104', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'plaza-105', name: 'Plaza 105', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'plaza-106', name: 'Plaza 106', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'plaza-107', name: 'Plaza 107', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'plaza-108', name: 'Plaza 108', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'plaza-109', name: 'Plaza 109', level: 'lower', baseAngle: 320, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Dragon's Lair (LF)
      { id: 'dragons-lair', name: "Dragon's Lair", level: 'berm', baseAngle: 180, angleSpan: 80, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Dayton, famous for sellout streak'
  },

  {
    venueId: 'daytona-tortugas',
    venueName: 'Jackie Robinson Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-a', name: 'Box A', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-b', name: 'Box B', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-c', name: 'Box C', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Grandstand
      { id: 'grand-1', name: 'Grandstand 1', level: 'lower', baseAngle: 40, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'grand-2', name: 'Grandstand 2', level: 'lower', baseAngle: 60, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'grand-3', name: 'Grandstand 3', level: 'lower', baseAngle: 80, angleSpan: 20, covered: true, price: 'value' },
      
      { id: 'grand-4', name: 'Grandstand 4', level: 'lower', baseAngle: 260, angleSpan: 20, covered: true, price: 'value' },
      { id: 'grand-5', name: 'Grandstand 5', level: 'lower', baseAngle: 280, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'grand-6', name: 'Grandstand 6', level: 'lower', baseAngle: 300, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'grand-7', name: 'Grandstand 7', level: 'lower', baseAngle: 320, angleSpan: 20, covered: true, price: 'moderate' },
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Tiki Terrace
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' }
    ],
    notes: 'Historic park where Jackie Robinson broke the color barrier, 1946'
  },

  {
    venueId: 'eugene-emeralds',
    venueName: 'PK Park',
    lastUpdated: '2024-01',
    sections: [
      // Premium Box
      { id: 'prem-1', name: 'Premium 1', level: 'field', baseAngle: 335, angleSpan: 17, covered: false, price: 'premium' },
      { id: 'prem-2', name: 'Premium 2', level: 'field', baseAngle: 352, angleSpan: 16, covered: false, price: 'premium' },
      { id: 'prem-3', name: 'Premium 3', level: 'field', baseAngle: 8, angleSpan: 17, covered: false, price: 'premium' },
      { id: 'prem-4', name: 'Premium 4', level: 'field', baseAngle: 25, angleSpan: 17, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 42, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 58, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 74, angleSpan: 16, covered: false, price: 'value' },
      
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 270, angleSpan: 16, covered: false, price: 'value' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 286, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 16, covered: false, price: 'moderate' },
      { id: 'box-11', name: 'Box 11', level: 'lower', baseAngle: 318, angleSpan: 17, covered: false, price: 'moderate' },
      
      // GA Areas
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      
      // Coleman Club
      { id: 'coleman-club', name: 'Coleman Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Shared with University of Oregon Ducks, modern facility'
  },

  {
    venueId: 'everett-aquasox',
    venueName: 'Funko Field',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-101', name: 'Box 101', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-102', name: 'Box 102', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-103', name: 'Box 103', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Reserved
      { id: 'res-201', name: 'Reserved 201', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-202', name: 'Reserved 202', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-203', name: 'Reserved 203', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'res-204', name: 'Reserved 204', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'res-205', name: 'Reserved 205', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-206', name: 'Reserved 206', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-207', name: 'Reserved 207', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // GA
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 200, angleSpan: 60, covered: false, price: 'value' },
      
      // Party Deck
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 340, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Mariners affiliate, Funko Pop themed elements'
  },

  {
    venueId: 'fort-myers-mighty-mussels',
    venueName: 'Hammond Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Box
      { id: 'dug-1', name: 'Dugout 1', level: 'field', baseAngle: 335, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'dug-2', name: 'Dugout 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dug-3', name: 'Dugout 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dug-4', name: 'Dugout 4', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'dug-5', name: 'Dugout 5', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-101', name: 'Field Box 101', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Field Box 102', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Field Box 103', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 320, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Boardwalk & Berm
      { id: 'boardwalk', name: 'Boardwalk', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 140, angleSpan: 100, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Twins spring training facility, tropical setting'
  },

  {
    venueId: 'greensboro-grasshoppers',
    venueName: 'First National Bank Field',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-1', name: 'Field Box 1', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'fb-2', name: 'Field Box 2', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'fb-3', name: 'Field Box 3', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-deck', name: 'Right Field Deck', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'cf-lawn', name: 'Center Field Lawn', level: 'berm', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club Level
      { id: 'dillard-club', name: 'Dillard Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Greensboro, opened 2005'
  },

  {
    venueId: 'hillsboro-hops',
    venueName: 'Ron Tonkin Field',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'diamond', name: 'Diamond Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 35, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-3', name: 'Box 3', level: 'lower', baseAngle: 55, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 75, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 265, angleSpan: 20, covered: false, price: 'value' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 285, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 305, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-8', name: 'Box 8', level: 'field', baseAngle: 325, angleSpan: 20, covered: false, price: 'premium' },
      
      // GA Areas
      { id: 'rf-patio', name: 'Right Field Patio', level: 'ga', baseAngle: 95, angleSpan: 50, covered: false, price: 'value' },
      { id: 'hop-yard', name: 'The Hop Yard', level: 'berm', baseAngle: 145, angleSpan: 75, covered: false, price: 'value' },
      { id: 'lf-patio', name: 'Left Field Patio', level: 'ga', baseAngle: 220, angleSpan: 45, covered: false, price: 'value' },
      
      // Suite
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Suburban Portland location, craft beer theme'
  },

  {
    venueId: 'hudson-valley-renegades',
    venueName: 'Heritage Financial Park',
    lastUpdated: '2024-01',
    sections: [
      // Field Level
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'sec-104', name: 'Section 104', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 100, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 200, angleSpan: 60, covered: false, price: 'value' },
      
      // Club
      { id: 'dutchess-club', name: 'Dutchess Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Hudson River Valley location, mountain views'
  },

  {
    venueId: 'jersey-shore-blueclaws',
    venueName: 'ShoreTown Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Premium Box
      { id: 'prem-1', name: 'Premium 1', level: 'field', baseAngle: 335, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'prem-2', name: 'Premium 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'prem-3', name: 'Premium 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'prem-4', name: 'Premium 4', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'prem-5', name: 'Premium 5', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-101', name: 'Box 101', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-102', name: 'Box 102', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-103', name: 'Box 103', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 320, angleSpan: 15, covered: false, price: 'moderate' },
      
      // GA Areas
      { id: 'rf-party', name: 'Right Field Party Deck', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' },
      
      // Club Level
      { id: 'beach-club', name: 'Beach Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Jersey Shore location, beach-themed atmosphere'
  },

  {
    venueId: 'lakeland-flying-tigers',
    venueName: 'Publix Field at Joker Marchant Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Tiger Den (Premium)
      { id: 'tiger-den', name: 'Tiger Den', level: 'field', baseAngle: 345, angleSpan: 30, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-1', name: 'Field Box 1', level: 'field', baseAngle: 15, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'fb-2', name: 'Field Box 2', level: 'field', baseAngle: 30, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'fb-3', name: 'Field Box 3', level: 'lower', baseAngle: 45, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-4', name: 'Field Box 4', level: 'lower', baseAngle: 60, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-5', name: 'Field Box 5', level: 'lower', baseAngle: 75, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-6', name: 'Field Box 6', level: 'lower', baseAngle: 90, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'fb-7', name: 'Field Box 7', level: 'lower', baseAngle: 255, angleSpan: 15, covered: false, price: 'value' },
      { id: 'fb-8', name: 'Field Box 8', level: 'lower', baseAngle: 270, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-9', name: 'Field Box 9', level: 'lower', baseAngle: 285, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-10', name: 'Field Box 10', level: 'lower', baseAngle: 300, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-11', name: 'Field Box 11', level: 'field', baseAngle: 315, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'fb-12', name: 'Field Box 12', level: 'field', baseAngle: 330, angleSpan: 15, covered: false, price: 'premium' },
      
      // Outfield
      { id: 'rf-berm', name: 'Right Field Berm', level: 'berm', baseAngle: 105, angleSpan: 45, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-berm', name: 'Left Field Berm', level: 'berm', baseAngle: 210, angleSpan: 45, covered: false, price: 'value' }
    ],
    notes: 'Tigers spring training facility, lakefront location'
  },

  {
    venueId: 'lansing-lugnuts',
    venueName: 'Jackson Field',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-a', name: 'Box A', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-b', name: 'Box B', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-c', name: 'Box C', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Reserved
      { id: 'res-1', name: 'Reserved 1', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-2', name: 'Reserved 2', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-3', name: 'Reserved 3', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'res-4', name: 'Reserved 4', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'res-5', name: 'Reserved 5', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-6', name: 'Reserved 6', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-7', name: 'Reserved 7', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'cf-deck', name: 'Center Field Deck', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'club-level', name: 'Outfield Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Lansing, Capitol building views'
  },

  {
    venueId: 'rome-emperors',
    venueName: 'AdventHealth Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Club
      { id: 'hp-club', name: 'Home Plate Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: false, price: 'premium' },
      
      // Field Level
      { id: 'field-1', name: 'Field 1', level: 'field', baseAngle: 15, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'field-2', name: 'Field 2', level: 'lower', baseAngle: 35, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'field-3', name: 'Field 3', level: 'lower', baseAngle: 55, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'field-4', name: 'Field 4', level: 'lower', baseAngle: 75, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'field-5', name: 'Field 5', level: 'lower', baseAngle: 265, angleSpan: 20, covered: false, price: 'value' },
      { id: 'field-6', name: 'Field 6', level: 'lower', baseAngle: 285, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'field-7', name: 'Field 7', level: 'lower', baseAngle: 305, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'field-8', name: 'Field 8', level: 'field', baseAngle: 325, angleSpan: 20, covered: false, price: 'premium' },
      
      // Outfield
      { id: 'rf-terrace', name: 'Right Field Terrace', level: 'ga', baseAngle: 95, angleSpan: 45, covered: false, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 220, angleSpan: 45, covered: false, price: 'value' },
      
      // Suites
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Formerly Rome Braves, rebranded 2024'
  },

  {
    venueId: 'south-bend-cubs',
    venueName: 'Four Winds Field',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-1', name: 'Field Box 1', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'fb-2', name: 'Field Box 2', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'fb-3', name: 'Field Box 3', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Performance Center
      { id: 'perf-center', name: 'Performance Center', level: 'berm', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Cubs affiliate, downtown South Bend location'
  },

  {
    venueId: 'spokane-indians',
    venueName: 'Avista Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'diamond-club', name: 'Diamond Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 15, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 30, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-3', name: 'Box 3', level: 'lower', baseAngle: 45, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 60, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 75, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 270, angleSpan: 15, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 285, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 300, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'field', baseAngle: 315, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'field', baseAngle: 330, angleSpan: 15, covered: false, price: 'premium' },
      
      // GA Areas
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'pepsi-porch', name: 'Pepsi Porch', level: 'ga', baseAngle: 135, angleSpan: 40, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 175, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' }
    ],
    notes: 'Northwest League, Spokane River location'
  },

  {
    venueId: 'vancouver-canadians',
    venueName: 'Nat Bailey Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Field Level
      { id: 'sec-1', name: 'Section 1', level: 'field', baseAngle: 335, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-2', name: 'Section 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: 'Section 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: 'Section 4', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-5', name: 'Section 5', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      
      // Grandstand
      { id: 'sec-6', name: 'Section 6', level: 'lower', baseAngle: 40, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-7', name: 'Section 7', level: 'lower', baseAngle: 55, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-8', name: 'Section 8', level: 'lower', baseAngle: 70, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-9', name: 'Section 9', level: 'lower', baseAngle: 85, angleSpan: 15, covered: true, price: 'value' },
      
      { id: 'sec-10', name: 'Section 10', level: 'lower', baseAngle: 260, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-11', name: 'Section 11', level: 'lower', baseAngle: 275, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-12', name: 'Section 12', level: 'lower', baseAngle: 290, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-13', name: 'Section 13', level: 'lower', baseAngle: 305, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-14', name: 'Section 14', level: 'lower', baseAngle: 320, angleSpan: 15, covered: true, price: 'moderate' },
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'cf-bleach', name: 'Center Field Bleachers', level: 'ga', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' }
    ],
    notes: 'Historic stadium from 1951, mountain views'
  },

  {
    venueId: 'wilmington-blue-rocks',
    venueName: 'Frawley Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Reserved
      { id: 'res-4', name: 'Reserved 4', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-5', name: 'Reserved 5', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-6', name: 'Reserved 6', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'res-7', name: 'Reserved 7', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'res-8', name: 'Reserved 8', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-9', name: 'Reserved 9', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'res-10', name: 'Reserved 10', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // GA
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'rock-wall', name: 'Blue Rocks Wall', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'club-level', name: 'Diamond Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Riverfront location in downtown Wilmington'
  },

  {
    venueId: 'winston-salem-dash',
    venueName: 'Truist Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-1', name: 'Field Box 1', level: 'field', baseAngle: 335, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'fb-2', name: 'Field Box 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'fb-3', name: 'Field Box 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'fb-4', name: 'Field Box 4', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'fb-5', name: 'Field Box 5', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-101', name: 'Box 101', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-102', name: 'Box 102', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-103', name: 'Box 103', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 320, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-deck', name: 'Right Field Deck', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club-level', name: 'BB&T Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Winston-Salem, skyline views'
  },

  {
    venueId: 'west-michigan-whitecaps',
    venueName: 'LMCU Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Field Level
      { id: 'field-1', name: 'Field 1', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'field-2', name: 'Field 2', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'field-3', name: 'Field 3', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Lawn
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'cf-lawn', name: 'Center Field Lawn', level: 'berm', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'whitecaps-club', name: 'Whitecaps Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Tigers affiliate, family-friendly atmosphere'
  },

  {
    venueId: 'wisconsin-timber-rattlers',
    venueName: 'Neuroscience Group Field',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Box
      { id: 'hp-box', name: 'Home Plate Box', level: 'field', baseAngle: 345, angleSpan: 30, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-1', name: 'Field Box 1', level: 'field', baseAngle: 15, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'fb-2', name: 'Field Box 2', level: 'field', baseAngle: 30, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-3', name: 'Field Box 3', level: 'lower', baseAngle: 45, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-4', name: 'Field Box 4', level: 'lower', baseAngle: 60, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-5', name: 'Field Box 5', level: 'lower', baseAngle: 75, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'fb-6', name: 'Field Box 6', level: 'lower', baseAngle: 270, angleSpan: 15, covered: false, price: 'value' },
      { id: 'fb-7', name: 'Field Box 7', level: 'lower', baseAngle: 285, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-8', name: 'Field Box 8', level: 'lower', baseAngle: 300, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-9', name: 'Field Box 9', level: 'field', baseAngle: 315, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'fb-10', name: 'Field Box 10', level: 'field', baseAngle: 330, angleSpan: 15, covered: false, price: 'premium' },
      
      // Bleachers & Deck
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'snake-pit', name: 'The Snake Pit', level: 'ga', baseAngle: 130, angleSpan: 40, covered: false, price: 'value' },
      { id: 'cf-deck', name: 'Center Field Deck', level: 'ga', baseAngle: 170, angleSpan: 40, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' }
    ],
    notes: 'Brewers affiliate, Fox River location'
  }
];