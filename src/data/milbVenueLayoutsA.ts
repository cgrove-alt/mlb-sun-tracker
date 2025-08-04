// A (Low-A) Stadium Layouts
// Complete venue-specific seating configurations for all 35 A stadiums

import { VenueLayout } from './milbVenueLayouts';

export const aVenueLayouts: VenueLayout[] = [
  {
    venueId: 'augusta-greenjackets',
    venueName: 'SRP Park',
    lastUpdated: '2024-01',
    sections: [
      // Field Level
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 335, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      
      // Plaza Level
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-112', name: 'Section 112', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'lower', baseAngle: 320, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Terrace Level
      { id: 'terrace-201', name: 'Terrace 201', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'terrace-202', name: 'Terrace 202', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'terrace-203', name: 'Terrace 203', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'moderate' },
      
      // Outfield
      { id: 'rf-porch', name: 'Right Field Porch', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'river-club', name: 'River Club', level: 'ga', baseAngle: 140, angleSpan: 40, covered: false, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 180, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 230, angleSpan: 30, covered: false, price: 'value' },
      
      // Club
      { id: 'dugout-club', name: 'Dugout Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Opened 2018, Savannah River views, downtown North Augusta'
  },

  {
    venueId: 'bradenton-marauders',
    venueName: 'LECOM Park',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-100', name: 'Field Box 100', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'fb-101', name: 'Field Box 101', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'fb-102', name: 'Field Box 102', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-103', name: 'Box 103', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // GA
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 100, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 200, angleSpan: 60, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Pirates spring training facility, Gulf Coast location'
  },

  {
    venueId: 'carolina-mudcats',
    venueName: 'Five County Stadium',
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
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'cattails', name: 'The Cattails', level: 'berm', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Party Deck
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 340, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Brewers affiliate, rural North Carolina setting'
  },

  {
    venueId: 'charleston-riverdogs',
    venueName: 'Joseph P. Riley Jr. Park',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-5', name: 'Box 5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-6', name: 'Box 6', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      
      // Reserved
      { id: 'res-7', name: 'Reserved 7', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-8', name: 'Reserved 8', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-9', name: 'Reserved 9', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-10', name: 'Reserved 10', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'res-11', name: 'Reserved 11', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'res-12', name: 'Reserved 12', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-13', name: 'Reserved 13', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-14', name: 'Reserved 14', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-15', name: 'Reserved 15', level: 'lower', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'res-16', name: 'Reserved 16', level: 'lower', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      
      // GA
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Piazza
      { id: 'piazza', name: 'The Piazza', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' }
    ],
    notes: 'Downtown Charleston on the Ashley River, "The Joe"'
  },

  {
    venueId: 'clearwater-threshers',
    venueName: 'BayCare Ballpark',
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
      
      // Outfield
      { id: 'rf-berm', name: 'Right Field Berm', level: 'berm', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'tiki-bar', name: 'Tiki Bar', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-berm', name: 'Left Field Berm', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'club-seats', name: 'Club Seats', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Phillies spring training complex, Clearwater Beach nearby'
  },

  {
    venueId: 'columbia-fireflies',
    venueName: 'Segra Park',
    lastUpdated: '2024-01',
    sections: [
      // Premium Box
      { id: 'prem-1', name: 'Premium 1', level: 'field', baseAngle: 335, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'prem-2', name: 'Premium 2', level: 'field', baseAngle: 348, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'prem-3', name: 'Premium 3', level: 'field', baseAngle: 0, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'prem-4', name: 'Premium 4', level: 'field', baseAngle: 12, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'prem-5', name: 'Premium 5', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-101', name: 'Field Box 101', level: 'lower', baseAngle: 38, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Field Box 102', level: 'lower', baseAngle: 50, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Field Box 103', level: 'lower', baseAngle: 62, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Field Box 104', level: 'lower', baseAngle: 74, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Field Box 105', level: 'lower', baseAngle: 86, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'fb-106', name: 'Field Box 106', level: 'lower', baseAngle: 262, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-107', name: 'Field Box 107', level: 'lower', baseAngle: 274, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-108', name: 'Field Box 108', level: 'lower', baseAngle: 286, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-109', name: 'Field Box 109', level: 'lower', baseAngle: 298, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Field Box 110', level: 'lower', baseAngle: 310, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-111', name: 'Field Box 111', level: 'lower', baseAngle: 322, angleSpan: 13, covered: false, price: 'moderate' },
      
      // GA Areas
      { id: 'rf-deck', name: 'Right Field Deck', level: 'ga', baseAngle: 98, angleSpan: 42, covered: false, price: 'value' },
      { id: 'liberty-lawn', name: 'Liberty Lawn', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 220, angleSpan: 42, covered: false, price: 'value' },
      
      // Club
      { id: 'founders-club', name: 'Founders Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Opened 2016, downtown Columbia views of State House'
  },

  {
    venueId: 'delmarva-shorebirds',
    venueName: 'Arthur W. Perdue Stadium',
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
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 200, angleSpan: 60, covered: false, price: 'value' },
      
      // Picnic Pavilion
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 340, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Eastern Shore of Maryland, Orioles affiliate'
  },

  {
    venueId: 'down-east-wood-ducks',
    venueName: 'Grainger Stadium',
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
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' }
    ],
    notes: 'Historic stadium from 1949, Eastern North Carolina'
  },

  {
    venueId: 'dunedin-blue-jays',
    venueName: 'TD Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Premium
      { id: 'prem-100', name: 'Premium 100', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'prem-101', name: 'Premium 101', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'prem-102', name: 'Premium 102', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-103', name: 'Box 103', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-deck', name: 'Right Field Deck', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-berm', name: 'Left Field Berm', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'club-level', name: 'TD Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Blue Jays spring training facility, renovated 2020'
  },

  {
    venueId: 'fayetteville-woodpeckers',
    venueName: 'Segra Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Field Level
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 5, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 20, angleSpan: 15, covered: false, price: 'premium' },
      
      // Lower Bowl
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 50, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 65, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 80, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 265, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 280, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 295, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-112', name: 'Section 112', level: 'lower', baseAngle: 310, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'lower', baseAngle: 325, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-deck', name: 'Right Field Deck', level: 'ga', baseAngle: 95, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-grass', name: 'Center Field Grass', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 220, angleSpan: 45, covered: false, price: 'value' },
      
      // Club
      { id: 'club-seats', name: 'Airborne Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Opened 2019, downtown Fayetteville, Fort Liberty nearby'
  },

  {
    venueId: 'fort-wayne-tincaps',
    venueName: 'Parkview Field',
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
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 330, angleSpan: 60, covered: true, price: 'luxury' },
      
      // Outfield
      { id: 'harrison-sq', name: 'Harrison Square', level: 'ga', baseAngle: 100, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 180, angleSpan: 80, covered: false, price: 'value' },
      
      // Club
      { id: 'parkview-club', name: 'Parkview Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Fort Wayne, award-winning design, opened 2009'
  },

  {
    venueId: 'fredericksburg-nationals',
    venueName: 'Virginia Credit Union Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Level
      { id: 'diamond-1', name: 'Diamond 1', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'diamond-2', name: 'Diamond 2', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'diamond-3', name: 'Diamond 3', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Field Level
      { id: 'field-4', name: 'Field 4', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'field-5', name: 'Field 5', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'field-6', name: 'Field 6', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'field-7', name: 'Field 7', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'field-8', name: 'Field 8', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'field-9', name: 'Field 9', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'field-10', name: 'Field 10', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-terrace', name: 'Right Field Terrace', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-plaza', name: 'Party Plaza', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'founders-club', name: 'Founders Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Opened 2020, Nationals affiliate, modern amenities'
  },

  {
    venueId: 'fresno-grizzlies',
    venueName: 'Chukchansi Park',
    lastUpdated: '2024-01',
    sections: [
      // Field Level
      { id: 'field-1', name: 'Field 1', level: 'field', baseAngle: 335, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'field-2', name: 'Field 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-3', name: 'Field 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'field-4', name: 'Field 4', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'field-5', name: 'Field 5', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      
      // Lower Box
      { id: 'box-101', name: 'Box 101', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-102', name: 'Box 102', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-103', name: 'Box 103', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 320, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Club Level
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' },
      
      // Outfield
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'cf-bleach', name: 'Center Field Bleachers', level: 'ga', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' }
    ],
    notes: 'Downtown Fresno, formerly AAA, now Single-A'
  },

  {
    venueId: 'great-lakes-loons',
    venueName: 'Dow Diamond',
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
      { id: 'cf-deck', name: 'Center Field Deck', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Suite Level
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Midland, Michigan, Great Lakes Bay Region'
  },

  {
    venueId: 'hickory-crawdads',
    venueName: 'L.P. Frans Stadium',
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
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 200, angleSpan: 60, covered: false, price: 'value' },
      
      // Picnic Area
      { id: 'picnic', name: 'Picnic Area', level: 'ga', baseAngle: 340, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Rangers affiliate, foothills of North Carolina'
  },

  {
    venueId: 'inland-empire-66ers',
    venueName: 'San Manuel Stadium',
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
      
      // Outfield
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-zone', name: 'Party Zone', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'stadium-club', name: 'Stadium Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'San Bernardino, historic Route 66 theme'
  },

  {
    venueId: 'jupiter-hammerheads',
    venueName: 'Roger Dean Chevrolet Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Level
      { id: 'dugout-1', name: 'Dugout 1', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'dugout-2', name: 'Dugout 2', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'dugout-3', name: 'Dugout 3', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-4', name: 'Field Box 4', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'fb-5', name: 'Field Box 5', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'fb-6', name: 'Field Box 6', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'fb-7', name: 'Field Box 7', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'fb-8', name: 'Field Box 8', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'fb-9', name: 'Field Box 9', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'fb-10', name: 'Field Box 10', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-berm', name: 'Right Field Berm', level: 'berm', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'tiki-bar', name: 'Tiki Bar', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-berm', name: 'Left Field Berm', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'club-seats', name: 'Club Seats', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Shared with Cardinals spring training, Palm Beach County'
  },

  {
    venueId: 'kannapolis-cannon-ballers',
    venueName: 'Atrium Health Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Field Level
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 5, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 20, angleSpan: 15, covered: false, price: 'premium' },
      
      // Lower Bowl
      { id: 'sec-104', name: 'Section 104', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 50, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 65, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 80, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 265, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 280, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 295, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 310, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-112', name: 'Section 112', level: 'lower', baseAngle: 325, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-deck', name: 'Right Field Deck', level: 'ga', baseAngle: 95, angleSpan: 45, covered: false, price: 'value' },
      { id: 'lawn', name: 'Outfield Lawn', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 220, angleSpan: 45, covered: false, price: 'value' },
      
      // Club
      { id: 'cannon-club', name: 'Cannon Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Opened 2020, downtown Kannapolis, White Sox affiliate'
  },

  {
    venueId: 'lake-elsinore-storm',
    venueName: 'Lake Elsinore Diamond',
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
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-hill', name: 'Party Hill', level: 'berm', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'diamond-club', name: 'Diamond Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Padres affiliate, lake views, Southern California'
  },

  {
    venueId: 'lynchburg-hillcats',
    venueName: 'Bank of the James Stadium',
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
      { id: 'hill', name: 'The Hill', level: 'berm', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Pavilion
      { id: 'pavilion', name: 'Party Pavilion', level: 'ga', baseAngle: 340, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Blue Ridge Mountain views, Guardians affiliate'
  },

  {
    venueId: 'modesto-nuts',
    venueName: 'John Thurman Field',
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
      { id: 'nuts-club', name: 'Nuts Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Central Valley location, Mariners affiliate'
  },

  {
    venueId: 'myrtle-beach-pelicans',
    venueName: 'Pelicans Ballpark',
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
      
      // Outfield
      { id: 'rf-party', name: 'Right Field Party Deck', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'The Boardwalk', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-berm', name: 'Left Field Berm', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'coastal-club', name: 'Coastal Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Near Myrtle Beach attractions, Cubs affiliate'
  },

  {
    venueId: 'palm-beach-cardinals',
    venueName: 'Roger Dean Chevrolet Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Level
      { id: 'dugout-1', name: 'Dugout 1', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'dugout-2', name: 'Dugout 2', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'dugout-3', name: 'Dugout 3', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Field Box
      { id: 'fb-4', name: 'Field Box 4', level: 'lower', baseAngle: 40, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'fb-5', name: 'Field Box 5', level: 'lower', baseAngle: 60, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'fb-6', name: 'Field Box 6', level: 'lower', baseAngle: 80, angleSpan: 20, covered: false, price: 'value' },
      
      { id: 'fb-7', name: 'Field Box 7', level: 'lower', baseAngle: 260, angleSpan: 20, covered: false, price: 'value' },
      { id: 'fb-8', name: 'Field Box 8', level: 'lower', baseAngle: 280, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'fb-9', name: 'Field Box 9', level: 'lower', baseAngle: 300, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'fb-10', name: 'Field Box 10', level: 'lower', baseAngle: 320, angleSpan: 20, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-berm', name: 'Right Field Berm', level: 'berm', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'tiki-bar', name: 'Tiki Bar', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-berm', name: 'Left Field Berm', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'club-seats', name: 'Club Seats', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Shared with Jupiter Hammerheads, Cardinals spring training'
  },

  {
    venueId: 'quad-cities-river-bandits',
    venueName: 'Modern Woodmen Park',
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
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'tiki-hut', name: 'Tiki Hut', level: 'ga', baseAngle: 140, angleSpan: 40, covered: false, price: 'value' },
      { id: 'cf-lawn', name: 'Center Field Lawn', level: 'berm', baseAngle: 180, angleSpan: 40, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' },
      
      // Club
      { id: 'river-club', name: 'River Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Mississippi River location, historic ballpark from 1931'
  },

  {
    venueId: 'rancho-cucamonga-quakes',
    venueName: 'LoanMart Field',
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
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-zone', name: 'Party Zone', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'quakes-club', name: 'Quakes Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'San Bernardino County, mountain views'
  },

  {
    venueId: 'salem-red-sox',
    venueName: 'Carilion Clinic Field',
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
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 200, angleSpan: 60, covered: false, price: 'value' },
      
      // Picnic Area
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 340, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Roanoke Valley, Blue Ridge Mountains backdrop'
  },

  {
    venueId: 'san-jose-giants',
    venueName: 'Excite Ballpark',
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
      { id: 'bbq-terrace', name: 'BBQ Terrace', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'giants-club', name: 'Giants Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Silicon Valley location, Giants affiliate'
  },

  {
    venueId: 'st-lucie-mets',
    venueName: 'Clover Park',
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
      
      // Outfield
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'club-seats', name: 'Club Seats', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Mets spring training facility, Port St. Lucie'
  },

  {
    venueId: 'stockton-ports',
    venueName: 'Banner Island Ballpark',
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
      { id: 'lawn', name: 'Lawn Seating', level: 'berm', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Club
      { id: 'marina-club', name: 'Marina Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown waterfront location, Athletics affiliate'
  },

  {
    venueId: 'tampa-tarpons',
    venueName: 'George M. Steinbrenner Field',
    lastUpdated: '2024-01',
    sections: [
      // Legends Suite Level
      { id: 'legends', name: 'Legends Suite', level: 'field', baseAngle: 345, angleSpan: 30, covered: false, price: 'premium' },
      
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
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 105, angleSpan: 45, covered: false, price: 'value' },
      { id: 'batter-eye', name: 'Batter\'s Eye Deck', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 210, angleSpan: 45, covered: false, price: 'value' }
    ],
    notes: 'Yankees spring training facility, Tampa Bay area'
  },

  {
    venueId: 'visalia-rawhide',
    venueName: 'Valley Strong Ballpark',
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
      { id: 'rawhide-club', name: 'Rawhide Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Central Valley location, Diamondbacks affiliate'
  }
];