// A+ (High-A) Stadium Layouts
// Complete venue-specific seating configurations for all 26 A+ stadiums

import { VenueLayout } from './milbVenueLayouts';

export const aPlusVenueLayouts: VenueLayout[] = [
  {
    venueId: 'aberdeen-ironbirds',
    venueName: 'Leidos Field at Ripken Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Leidos Field at Ripken Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
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
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'ABC Supply Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Opened 2021, Rock River location, modern amenities'
  },

  {
    venueId: 'bowling-green-hot-rods',
    venueName: 'Bowling Green Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Bowling Green Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Rays affiliate, compact modern stadium'
  },

  {
    venueId: 'brooklyn-cyclones',
    venueName: 'Maimonides Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Maimonides Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
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
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Day Air Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
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
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'PK Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Shared with University of Oregon Ducks, modern facility'
  },

  {
    venueId: 'everett-aquasox',
    venueName: 'Funko Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Funko Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Mariners affiliate, Funko Pop themed elements'
  },

  {
    venueId: 'fort-myers-mighty-mussels',
    venueName: 'Hammond Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Hammond Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Twins spring training facility, tropical setting'
  },

  {
    venueId: 'greensboro-grasshoppers',
    venueName: 'First National Bank Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'First National Bank Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Greensboro, opened 2005'
  },

  {
    venueId: 'greenville-drive',
    venueName: 'Fluor Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'home-plate-club', name: 'Main Street Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'green-monster', name: 'The Green Monster', level: 'club', baseAngle: 225, angleSpan: 30, covered: false, price: 'moderate' },
      { id: 'brew-lab', name: 'RJ Rockers Brew Lab', level: 'club', baseAngle: 75, angleSpan: 40, covered: true, price: 'moderate' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'ga', baseAngle: 115, angleSpan: 60, covered: false, price: 'value' },
      { id: 'rooftop', name: 'Fluor Rooftop', level: 'club', baseAngle: 175, angleSpan: 50, covered: true, price: 'luxury' }
    ],
    notes: 'Fenway Park replica with Green Monster, downtown Greenville SC'
  },

  {
    venueId: 'hillsboro-hops',
    venueName: 'Ron Tonkin Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Ron Tonkin Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Suburban Portland location, craft beer theme'
  },

  {
    venueId: 'hudson-valley-renegades',
    venueName: 'Heritage Financial Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Heritage Financial Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Hudson River Valley location, mountain views'
  },

  {
    venueId: 'jersey-shore-blueclaws',
    venueName: 'ShoreTown Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'ShoreTown Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Jersey Shore location, beach-themed atmosphere'
  },

  {
    venueId: 'lakeland-flying-tigers',
    venueName: 'Publix Field at Joker Marchant Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'tiger-den', name: 'Tiger Den', level: 'field', baseAngle: 345, angleSpan: 30, covered: false, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 26, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'lower', baseAngle: 37, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'lower', baseAngle: 48, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 59, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 70, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 81, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 269, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 280, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 291, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 302, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 313, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 324, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'boardwalk', name: 'The Boardwalk', level: 'ga', baseAngle: 92, angleSpan: 60, covered: false, price: 'value' },
      { id: 'tiki-deck', name: 'Tiki Party Deck', level: 'club', baseAngle: 152, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'publix-porch', name: 'Publix Porch', level: 'club', baseAngle: 202, angleSpan: 40, covered: true, price: 'moderate' },
      { id: 'left-field-berm', name: 'Left Field Berm', level: 'berm', baseAngle: 242, angleSpan: 27, covered: false, price: 'value' }
    ],
    notes: 'Tigers spring training facility, lakefront location'
  },

  {
    venueId: 'lansing-lugnuts',
    venueName: 'Jackson Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Jackson Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Lansing, Capitol building views'
  },

  {
    venueId: 'rome-emperors',
    venueName: 'AdventHealth Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'AdventHealth Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Formerly Rome Braves, rebranded 2024'
  },

  {
    venueId: 'south-bend-cubs',
    venueName: 'Four Winds Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Four Winds Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
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
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Nat Bailey Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Historic stadium from 1951, mountain views'
  },

  {
    venueId: 'wilmington-blue-rocks',
    venueName: 'Frawley Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Frawley Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Riverfront location in downtown Wilmington'
  },

  {
    venueId: 'winston-salem-dash',
    venueName: 'Truist Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Truist Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Winston-Salem, skyline views'
  },

  {
    venueId: 'west-michigan-whitecaps',
    venueName: 'LMCU Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'LMCU Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Tigers affiliate, family-friendly atmosphere'
  },

  {
    venueId: 'wisconsin-timber-rattlers',
    venueName: 'Neuroscience Group Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'home-plate-club', name: 'Fox Communities Credit Union Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'snake-pit', name: 'The Snake Pit', level: 'club', baseAngle: 75, angleSpan: 45, covered: true, price: 'moderate' },
      { id: 'bratcho-pavilion', name: 'Bratcho Pavilion', level: 'ga', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'fox-cities-deck', name: 'Fox Cities Stadium Deck', level: 'club', baseAngle: 180, angleSpan: 60, covered: true, price: 'moderate' },
      { id: 'left-field-hill', name: 'Left Field Hill', level: 'berm', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' }
    ],
    notes: 'Brewers affiliate, Fox River location'
  },

  {
    venueId: 'peoria-chiefs',
    venueName: 'Dozer Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Dozer Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Peoria, IL along Illinois River, Cardinals affiliate'
  },

  {
    venueId: 'quad-cities-river-bandits',
    venueName: 'Modern Woodmen Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Modern Woodmen Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Davenport, IA on Mississippi River, opened 1931'
  },

  {
    venueId: 'great-lakes-loons',
    venueName: 'Dow Diamond',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Dow Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Midland, MI, Dodgers affiliate, opened 2007'
  },

  {
    venueId: 'lake-county-captains',
    venueName: 'Classic Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'classic-club', name: 'Classic Auto Group Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 15, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 24, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 33, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 42, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 51, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 60, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 69, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 291, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 300, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 309, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 318, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 327, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 336, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'captains-deck', name: 'Captain\'s Deck', level: 'club', baseAngle: 78, angleSpan: 48, covered: true, price: 'moderate' },
      { id: 'kidz-zone', name: 'Kidz Zone Hill', level: 'berm', baseAngle: 126, angleSpan: 72, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 198, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Shipyard Party Pavilion', level: 'club', baseAngle: 248, angleSpan: 43, covered: true, price: 'moderate' }
    ],
    notes: 'Eastlake, OH near Lake Erie, Guardians affiliate'
  },

  {
    venueId: 'tri-city-dust-devils',
    venueName: 'Gesa Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 344, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 358, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 12, angleSpan: 14, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'lower', baseAngle: 26, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-5', name: 'Box 5', level: 'lower', baseAngle: 40, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-6', name: 'Box 6', level: 'lower', baseAngle: 246, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-7', name: 'Box 7', level: 'lower', baseAngle: 260, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-8', name: 'Box 8', level: 'lower', baseAngle: 274, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-9', name: 'Box 9', level: 'lower', baseAngle: 288, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-10', name: 'Box 10', level: 'lower', baseAngle: 302, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'rf-bleachers', name: 'Right Field Bleachers', level: 'ga', baseAngle: 74, angleSpan: 52, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 126, angleSpan: 108, covered: false, price: 'value' },
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 234, angleSpan: 52, covered: false, price: 'value' },
      { id: 'party-area', name: 'Gesa Party Zone', level: 'club', baseAngle: 90, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Pasco, WA in Columbia River valley, Angels affiliate'
  }
];