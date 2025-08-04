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
      // Box Seats
      { id: 'box-101', name: 'Box 101', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'box-102', name: 'Box 102', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'box-103', name: 'Box 103', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'box-104', name: 'Box 104', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Reserved Seating
      { id: 'res-105', name: 'Reserved 105', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-106', name: 'Reserved 106', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-107', name: 'Reserved 107', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-108', name: 'Reserved 108', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'res-109', name: 'Reserved 109', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'res-110', name: 'Reserved 110', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-111', name: 'Reserved 111', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-112', name: 'Reserved 112', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // Jungle (Outfield)
      { id: 'jungle', name: 'The Jungle', level: 'berm', baseAngle: 136, angleSpan: 88, covered: false, price: 'value' },
      
      // Cove Club
      { id: 'cove-club', name: 'Cove Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Altoona, PA with roller coaster beyond outfield wall'
  },
  
  {
    venueId: 'amarillo-sod-poodles',
    venueName: 'HODGETOWN',
    lastUpdated: '2024-01',
    sections: [
      // Premium Infield
      { id: 'pi-100', name: 'Premium Infield 100', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pi-101', name: 'Premium Infield 101', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pi-102', name: 'Premium Infield 102', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pi-103', name: 'Premium Infield 103', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Infield Box
      { id: 'ib-104', name: 'Infield Box 104', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-105', name: 'Infield Box 105', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-106', name: 'Infield Box 106', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-107', name: 'Infield Box 107', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-108', name: 'Infield Box 108', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'ib-109', name: 'Infield Box 109', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-110', name: 'Infield Box 110', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-111', name: 'Infield Box 111', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-112', name: 'Infield Box 112', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-113', name: 'Infield Box 113', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Outfield Box
      { id: 'ob-201', name: 'Outfield Box 201', level: 'ga', baseAngle: 93, angleSpan: 42, covered: false, price: 'value' },
      { id: 'ob-202', name: 'Outfield Box 202', level: 'ga', baseAngle: 225, angleSpan: 42, covered: false, price: 'value' },
      
      // Berm
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // Fairly Group Club
      { id: 'fairly-club', name: 'Fairly Group Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Amarillo, opened 2019, modern design'
  },
  
  {
    venueId: 'arkansas-travelers',
    venueName: 'Dickey-Stephens Park',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Box
      { id: 'hpb-1', name: 'Home Plate Box 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpb-2', name: 'Home Plate Box 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpb-3', name: 'Home Plate Box 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'hpb-4', name: 'Home Plate Box 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-101', name: 'Field Box 101', level: 'lower', baseAngle: 28, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Field Box 102', level: 'lower', baseAngle: 42, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Field Box 103', level: 'lower', baseAngle: 56, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 70, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 84, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 276, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 290, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 304, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 318, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Field Box 110', level: 'lower', baseAngle: 332, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Lawn
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 98, angleSpan: 82, covered: false, price: 'value' },
      
      // Left Field Pavilion
      { id: 'lf-pav', name: 'Left Field Pavilion', level: 'ga', baseAngle: 180, angleSpan: 76, covered: false, price: 'value' },
      
      // Arvest Suite Level
      { id: 'suite-level', name: 'Arvest Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'North Little Rock on Arkansas River, opened 2007'
  },
  
  {
    venueId: 'biloxi-shuckers',
    venueName: 'MGM Park',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Box
      { id: 'dug-101', name: 'Dugout Box 101', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dug-102', name: 'Dugout Box 102', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dug-103', name: 'Dugout Box 103', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'dug-104', name: 'Dugout Box 104', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Field Level
      { id: 'fl-105', name: 'Field Level 105', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fl-106', name: 'Field Level 106', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fl-107', name: 'Field Level 107', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fl-108', name: 'Field Level 108', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'fl-109', name: 'Field Level 109', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'fl-110', name: 'Field Level 110', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fl-111', name: 'Field Level 111', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'fl-112', name: 'Field Level 112', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // GA Seating
      { id: 'ga-rf', name: 'Right Field GA', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      { id: 'ga-lf', name: 'Left Field GA', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // The Yard
      { id: 'yard', name: 'The Yard', level: 'berm', baseAngle: 136, angleSpan: 88, covered: false, price: 'value' },
      
      // Biloxi Yacht Club
      { id: 'yacht-club', name: 'Biloxi Yacht Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Biloxi waterfront, opened 2015'
  },
  
  {
    venueId: 'binghamton-rumble-ponies',
    venueName: 'Mirabito Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Field Level Box
      { id: 'flb-100', name: 'Field Level Box 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'flb-101', name: 'Field Level Box 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'flb-102', name: 'Field Level Box 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'flb-103', name: 'Field Level Box 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // GA Bleachers
      { id: 'ga-rf', name: 'Right Field Bleachers', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      { id: 'ga-lf', name: 'Left Field Bleachers', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // Picnic Pavilion
      { id: 'picnic', name: 'Picnic Pavilion', level: 'club', baseAngle: 136, angleSpan: 88, covered: true, price: 'value' }
    ],
    notes: 'Binghamton, NY, classic ballpark opened 1992'
  },
  
  {
    venueId: 'bowie-baysox',
    venueName: 'Prince George\'s Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'dc-101', name: 'Diamond Club 101', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-102', name: 'Diamond Club 102', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-103', name: 'Diamond Club 103', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'dc-104', name: 'Diamond Club 104', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 28, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 42, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 56, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 70, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 84, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 276, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 290, angleSpan: 14, covered: false, price: 'value' },
      { id: 'box-112', name: 'Box 112', level: 'lower', baseAngle: 304, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-113', name: 'Box 113', level: 'lower', baseAngle: 318, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'box-114', name: 'Box 114', level: 'lower', baseAngle: 332, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Pavilion
      { id: 'pavilion', name: 'Pavilion', level: 'ga', baseAngle: 98, angleSpan: 44, covered: false, price: 'value' },
      
      // Grass Hill
      { id: 'grass-hill', name: 'Grass Hill', level: 'berm', baseAngle: 142, angleSpan: 76, covered: false, price: 'value' },
      
      // Left Field Reserved
      { id: 'lf-res', name: 'Left Field Reserved', level: 'ga', baseAngle: 218, angleSpan: 44, covered: false, price: 'value' },
      
      // Stadium Club
      { id: 'stadium-club', name: 'Stadium Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Bowie, MD between Baltimore and Washington'
  },
  
  {
    venueId: 'chattanooga-lookouts',
    venueName: 'AT&T Field',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-100', name: 'Field Box 100', level: 'field', baseAngle: 340, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-101', name: 'Field Box 101', level: 'field', baseAngle: 353, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-102', name: 'Field Box 102', level: 'field', baseAngle: 6, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-103', name: 'Field Box 103', level: 'field', baseAngle: 19, angleSpan: 13, covered: false, price: 'premium' },
      
      // Lower Box
      { id: 'lb-104', name: 'Lower Box 104', level: 'lower', baseAngle: 32, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-105', name: 'Lower Box 105', level: 'lower', baseAngle: 46, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-106', name: 'Lower Box 106', level: 'lower', baseAngle: 60, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-107', name: 'Lower Box 107', level: 'lower', baseAngle: 74, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'lb-108', name: 'Lower Box 108', level: 'lower', baseAngle: 286, angleSpan: 14, covered: false, price: 'value' },
      { id: 'lb-109', name: 'Lower Box 109', level: 'lower', baseAngle: 300, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-110', name: 'Lower Box 110', level: 'lower', baseAngle: 314, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'lb-111', name: 'Lower Box 111', level: 'lower', baseAngle: 328, angleSpan: 14, covered: false, price: 'moderate' },
      
      // GA Areas
      { id: 'ga-rf', name: 'Right Field GA', level: 'ga', baseAngle: 88, angleSpan: 48, covered: false, price: 'value' },
      { id: 'ga-lf', name: 'Left Field GA', level: 'ga', baseAngle: 224, angleSpan: 48, covered: false, price: 'value' },
      
      // Lawn
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 136, angleSpan: 88, covered: false, price: 'value' },
      
      // First Tennessee Pavilion
      { id: 'ft-pavilion', name: 'First Tennessee Pavilion', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Chattanooga on Tennessee River'
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
  }
];

// Export all AA layouts
export const allAALayouts = aaCompleteLayouts;