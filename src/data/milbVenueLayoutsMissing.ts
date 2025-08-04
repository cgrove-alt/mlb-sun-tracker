// Missing venue layouts to complete the 120 stadium coverage
import { VenueLayout } from './milbVenueLayouts';

export const missingVenueLayouts: VenueLayout[] = [
  // A+ (High-A) Missing Venues
  {
    venueId: 'greenville-drive',
    venueName: 'Fluor Field',
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
      
      // Green Monster (LF)
      { id: 'monster', name: 'Green Monster', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' },
      
      // Right Field
      { id: 'rf-plaza', name: 'Right Field Plaza', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      
      // Upper Deck
      { id: 'upper-deck', name: 'Upper Deck', level: 'upper', baseAngle: 340, angleSpan: 40, covered: true, price: 'moderate' },
      
      // Club
      { id: 'main-st-club', name: 'Main Street Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Fenway Park replica with 37-foot Green Monster, downtown Greenville'
  },

  {
    venueId: 'peoria-chiefs',
    venueName: 'Dozer Park',
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
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'club-level', name: 'Chiefs Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Renovated 2013, Illinois River views'
  },

  {
    venueId: 'rome-braves',
    venueName: 'State Mutual Stadium',
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
    notes: 'Northwest Georgia location, opened 2003'
  },

  // A (Low-A) Missing Venues
  {
    venueId: 'knoxville-smokies',
    venueName: 'Smokies Stadium',
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
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn Seating', level: 'berm', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'club-level', name: 'Smokies Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Sevier County, Great Smoky Mountains views'
  },

  {
    venueId: 'lake-county-captains',
    venueName: 'Classic Auto Group Park',
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
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'captains-club', name: 'Captains Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Eastlake, Ohio, Lake Erie region'
  },

  {
    venueId: 'tri-city-dust-devils',
    venueName: 'Gesa Stadium',
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
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-area', name: 'Party Area', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'stadium-club', name: 'Stadium Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Pasco, Washington, Columbia River region'
  }
];