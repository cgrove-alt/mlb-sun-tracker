// Missing venue layouts to complete the 120 stadium coverage
import { VenueLayout } from './milbVenueLayouts';

export const missingVenueLayouts: VenueLayout[] = [
  // A+ (High-A) Missing Venues
  {
    venueId: 'greenville-drive',
    venueName: 'Fluor Field',
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
    notes: 'Fenway Park replica with 37-foot Green Monster, downtown Greenville'
  },

  {
    venueId: 'peoria-chiefs',
    venueName: 'Dozer Park',
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
    notes: 'Renovated 2013, Illinois River views'
  },

  {
    venueId: 'rome-braves',
    venueName: 'State Mutual Stadium',
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
    notes: 'Northwest Georgia location, opened 2003'
  },

  // A (Low-A) Missing Venues
  {
    venueId: 'knoxville-smokies',
    venueName: 'Smokies Stadium',
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
    notes: 'Sevier County, Great Smoky Mountains views'
  },

  {
    venueId: 'lake-county-captains',
    venueName: 'Classic Auto Group Park',
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
    notes: 'Eastlake, Ohio, Lake Erie region'
  },

  {
    venueId: 'tri-city-dust-devils',
    venueName: 'Gesa Stadium',
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
    notes: 'Pasco, Washington, Columbia River region'
  }
];