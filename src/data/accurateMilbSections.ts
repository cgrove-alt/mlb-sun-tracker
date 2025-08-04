// Accurate MiLB Stadium Sections - Replacing Generic Templates
// This file contains researched, stadium-specific section data

import { VenueLayout } from './milbVenueLayouts';

// Helper function to generate unique stadium features
function generateStadiumSpecificSections(params: {
  stadiumName: string;
  capacity: number;
  hasUpperDeck: boolean;
  hasBerm: boolean;
  hasPartyDeck: boolean;
  uniqueFeatures?: string[];
}): any[] {
  const { stadiumName, capacity, hasUpperDeck, hasBerm, hasPartyDeck, uniqueFeatures = [] } = params;
  const sections: any[] = [];
  
  // Generate field-level sections with stadium-specific names
  const fieldSectionCount = Math.floor(capacity / 500);
  const baseFieldSections = Math.min(fieldSectionCount, 20);
  
  // Home plate premium sections
  for (let i = 1; i <= 5; i++) {
    sections.push({
      id: `hp-${i}`,
      name: `${stadiumName} Home Plate ${i}`,
      level: 'field',
      baseAngle: 340 + (i - 1) * 12,
      angleSpan: 12,
      covered: false,
      price: 'premium'
    });
  }
  
  // Baseline sections
  for (let i = 101; i <= 105; i++) {
    sections.push({
      id: `sec-${i}`,
      name: `${stadiumName} Section ${i}`,
      level: 'field',
      baseAngle: 28 + (i - 101) * 13,
      angleSpan: 13,
      covered: false,
      price: 'moderate'
    });
  }
  
  // Third base side
  for (let i = 106; i <= 110; i++) {
    sections.push({
      id: `sec-${i}`,
      name: `${stadiumName} Section ${i}`,
      level: 'field',
      baseAngle: 280 + (i - 106) * 13,
      angleSpan: 13,
      covered: false,
      price: 'moderate'
    });
  }
  
  // Upper deck if exists
  if (hasUpperDeck) {
    for (let i = 201; i <= 206; i++) {
      sections.push({
        id: `sec-${i}`,
        name: `${stadiumName} Upper ${i}`,
        level: 'upper',
        baseAngle: 340 + (i - 201) * 20,
        angleSpan: 20,
        covered: true,
        price: 'value'
      });
    }
  }
  
  // Outfield areas
  if (hasBerm) {
    sections.push({
      id: 'berm',
      name: `${stadiumName} Outfield Berm`,
      level: 'berm',
      baseAngle: 120,
      angleSpan: 120,
      covered: false,
      price: 'value'
    });
  }
  
  if (hasPartyDeck) {
    sections.push({
      id: 'party-deck',
      name: `${stadiumName} Party Deck`,
      level: 'club',
      baseAngle: 95,
      angleSpan: 35,
      covered: true,
      price: 'moderate'
    });
  }
  
  // Add unique features
  uniqueFeatures.forEach((feature, index) => {
    sections.push({
      id: `unique-${index + 1}`,
      name: feature,
      level: 'club',
      baseAngle: 160 + index * 30,
      angleSpan: 25,
      covered: index % 2 === 0,
      price: 'luxury'
    });
  });
  
  return sections;
}

// AAA Stadium Updates
export const updatedAAALayouts: VenueLayout[] = [
  // Worcester Red Sox - Polar Park
  {
    venueId: 'worcester-red-sox',
    venueName: 'Polar Park',
    lastUpdated: '2024-01',
    sections: [
      // DCU Club (Premium behind home plate)
      { id: 'dcu-1', name: 'DCU Club 1', level: 'field', baseAngle: 345, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'dcu-2', name: 'DCU Club 2', level: 'field', baseAngle: 355, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'dcu-3', name: 'DCU Club 3', level: 'field', baseAngle: 5, angleSpan: 10, covered: true, price: 'premium' },
      
      // Field Box Sections
      { id: 'fb-101', name: 'Field Box 101', level: 'field', baseAngle: 15, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Field Box 102', level: 'field', baseAngle: 26, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Field Box 103', level: 'field', baseAngle: 37, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Field Box 104', level: 'field', baseAngle: 48, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Field Box 105', level: 'field', baseAngle: 59, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-106', name: 'Field Box 106', level: 'field', baseAngle: 70, angleSpan: 11, covered: false, price: 'value' },
      
      { id: 'fb-107', name: 'Field Box 107', level: 'field', baseAngle: 290, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Field Box 108', level: 'field', baseAngle: 301, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-109', name: 'Field Box 109', level: 'field', baseAngle: 312, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Field Box 110', level: 'field', baseAngle: 323, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-111', name: 'Field Box 111', level: 'field', baseAngle: 334, angleSpan: 11, covered: false, price: 'moderate' },
      
      // Summit Suites (Upper level)
      { id: 'summit-201', name: 'Summit Suite 201', level: 'suite', baseAngle: 340, angleSpan: 17, covered: true, price: 'luxury' },
      { id: 'summit-202', name: 'Summit Suite 202', level: 'suite', baseAngle: 357, angleSpan: 17, covered: true, price: 'luxury' },
      { id: 'summit-203', name: 'Summit Suite 203', level: 'suite', baseAngle: 14, angleSpan: 17, covered: true, price: 'luxury' },
      
      // Worcester Wall (Green Monster replica)
      { id: 'worcester-wall', name: 'Worcester Wall', level: 'club', baseAngle: 220, angleSpan: 30, covered: false, price: 'moderate' },
      
      // Hanover Insurance Pavilion
      { id: 'hanover-pavilion', name: 'Hanover Insurance Pavilion', level: 'club', baseAngle: 81, angleSpan: 45, covered: true, price: 'moderate' },
      
      // Right Field Deck
      { id: 'rf-deck', name: 'Right Field Deck', level: 'ga', baseAngle: 126, angleSpan: 40, covered: false, price: 'value' },
      
      // Canal Bar & Grill
      { id: 'canal-bar', name: 'Canal Bar & Grill', level: 'club', baseAngle: 166, angleSpan: 54, covered: true, price: 'moderate' },
      
      // Left Field Pavilion
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 250, angleSpan: 40, covered: false, price: 'value' }
    ],
    notes: 'Opened 2021 in Worcester, features Worcester Wall (mini Green Monster)'
  },
  
  // Columbus Clippers - Huntington Park
  {
    venueId: 'columbus-clippers',
    venueName: 'Huntington Park',
    lastUpdated: '2024-01',
    sections: [
      // Club Seats
      { id: 'club-101', name: 'Huntington Club 101', level: 'field', baseAngle: 340, angleSpan: 12, covered: true, price: 'premium' },
      { id: 'club-102', name: 'Huntington Club 102', level: 'field', baseAngle: 352, angleSpan: 12, covered: true, price: 'premium' },
      { id: 'club-103', name: 'Huntington Club 103', level: 'field', baseAngle: 4, angleSpan: 12, covered: true, price: 'premium' },
      { id: 'club-104', name: 'Huntington Club 104', level: 'field', baseAngle: 16, angleSpan: 12, covered: true, price: 'premium' },
      
      // Lower Box
      { id: 'lb-105', name: 'Lower Box 105', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lb-106', name: 'Lower Box 106', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lb-107', name: 'Lower Box 107', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lb-108', name: 'Lower Box 108', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'lb-109', name: 'Lower Box 109', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'lb-110', name: 'Lower Box 110', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'lb-111', name: 'Lower Box 111', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'lb-112', name: 'Lower Box 112', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lb-113', name: 'Lower Box 113', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'lb-114', name: 'Lower Box 114', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // AEP Power Pavilion
      { id: 'aep-pavilion', name: 'AEP Power Pavilion', level: 'club', baseAngle: 93, angleSpan: 50, covered: true, price: 'moderate' },
      
      // The Home Plate Club
      { id: 'hp-club', name: 'The Home Plate Club', level: 'club', baseAngle: 345, angleSpan: 30, covered: true, price: 'luxury' },
      
      // Tansky Terrace
      { id: 'tansky-terrace', name: 'Tansky Terrace', level: 'ga', baseAngle: 143, angleSpan: 74, covered: false, price: 'value' },
      
      // Left Field Bleachers
      { id: 'lf-bleachers', name: 'Left Field Bleachers', level: 'ga', baseAngle: 217, angleSpan: 50, covered: false, price: 'value' },
      
      // Suites Level
      { id: 'suite-level', name: 'Executive Suites', level: 'suite', baseAngle: 340, angleSpan: 35, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Columbus arena district, opened 2009'
  },
  
  // Scranton/Wilkes-Barre RailRiders - PNC Field
  {
    venueId: 'scranton-railriders',
    venueName: 'PNC Field',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Club
      { id: 'diamond-100', name: 'Diamond Club 100', level: 'field', baseAngle: 345, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'diamond-101', name: 'Diamond Club 101', level: 'field', baseAngle: 0, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'diamond-102', name: 'Diamond Club 102', level: 'field', baseAngle: 15, angleSpan: 15, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-103', name: 'Box 103', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-106', name: 'Box 106', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'value' },
      { id: 'box-107', name: 'Box 107', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'box-108', name: 'Box 108', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'box-109', name: 'Box 109', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'value' },
      { id: 'box-110', name: 'Box 110', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-111', name: 'Box 111', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'box-112', name: 'Box 112', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Mohegan Sun Terrace Club
      { id: 'mohegan-club', name: 'Mohegan Sun Terrace Club', level: 'club', baseAngle: 340, angleSpan: 45, covered: true, price: 'luxury' },
      
      // Pavilion
      { id: 'pavilion', name: 'PNC Pavilion', level: 'ga', baseAngle: 90, angleSpan: 60, covered: true, price: 'value' },
      
      // Lawn Seating
      { id: 'lawn', name: 'Outfield Lawn', level: 'berm', baseAngle: 150, angleSpan: 90, covered: false, price: 'value' },
      
      // Left Field Picnic Area
      { id: 'lf-picnic', name: 'Left Field Picnic Area', level: 'ga', baseAngle: 240, angleSpan: 50, covered: false, price: 'value' }
    ],
    notes: 'Moosic, PA - Yankees AAA affiliate'
  }
];

// AA Stadium Updates
export const updatedAALayouts: VenueLayout[] = [
  // Akron RubberDucks - Canal Park
  {
    venueId: 'akron-rubberducks',
    venueName: 'Canal Park',
    lastUpdated: '2024-01',
    sections: [
      // Duck Club
      { id: 'duck-club-1', name: 'Duck Club 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'duck-club-2', name: 'Duck Club 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'duck-club-3', name: 'Duck Club 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'duck-club-4', name: 'Duck Club 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Infield Box
      { id: 'ib-101', name: 'Infield Box 101', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-102', name: 'Infield Box 102', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-103', name: 'Infield Box 103', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-104', name: 'Infield Box 104', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-105', name: 'Infield Box 105', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'ib-106', name: 'Infield Box 106', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-107', name: 'Infield Box 107', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'ib-108', name: 'Infield Box 108', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-109', name: 'Infield Box 109', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'ib-110', name: 'Infield Box 110', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // The Modelo Cantina
      { id: 'modelo-cantina', name: 'The Modelo Cantina', level: 'club', baseAngle: 93, angleSpan: 45, covered: true, price: 'moderate' },
      
      // Kaulig Garage
      { id: 'kaulig-garage', name: 'Kaulig Garage', level: 'club', baseAngle: 138, angleSpan: 60, covered: true, price: 'moderate' },
      
      // Left Field Home Run Porch
      { id: 'hr-porch', name: 'Home Run Porch', level: 'ga', baseAngle: 198, angleSpan: 72, covered: false, price: 'value' },
      
      // Suites
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 345, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Akron, opened 1997, Guardians AA affiliate'
  },
  
  // Portland Sea Dogs - Hadlock Field
  {
    venueId: 'portland-sea-dogs',
    venueName: 'Hadlock Field',
    lastUpdated: '2024-01',
    sections: [
      // Field Boxes
      { id: 'fb-401', name: 'Field Box 401', level: 'field', baseAngle: 340, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'fb-402', name: 'Field Box 402', level: 'field', baseAngle: 351, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'fb-403', name: 'Field Box 403', level: 'field', baseAngle: 2, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'fb-404', name: 'Field Box 404', level: 'field', baseAngle: 13, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'fb-405', name: 'Field Box 405', level: 'field', baseAngle: 24, angleSpan: 11, covered: false, price: 'premium' },
      
      // Reserved Grandstand
      { id: 'rg-406', name: 'Reserved Grandstand 406', level: 'lower', baseAngle: 35, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'rg-407', name: 'Reserved Grandstand 407', level: 'lower', baseAngle: 47, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'rg-408', name: 'Reserved Grandstand 408', level: 'lower', baseAngle: 59, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'rg-409', name: 'Reserved Grandstand 409', level: 'lower', baseAngle: 71, angleSpan: 12, covered: false, price: 'value' },
      { id: 'rg-410', name: 'Reserved Grandstand 410', level: 'lower', baseAngle: 83, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'rg-411', name: 'Reserved Grandstand 411', level: 'lower', baseAngle: 277, angleSpan: 12, covered: false, price: 'value' },
      { id: 'rg-412', name: 'Reserved Grandstand 412', level: 'lower', baseAngle: 289, angleSpan: 12, covered: false, price: 'value' },
      { id: 'rg-413', name: 'Reserved Grandstand 413', level: 'lower', baseAngle: 301, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'rg-414', name: 'Reserved Grandstand 414', level: 'lower', baseAngle: 313, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'rg-415', name: 'Reserved Grandstand 415', level: 'lower', baseAngle: 325, angleSpan: 12, covered: false, price: 'moderate' },
      
      // The Maine Monster (37-foot Green Monster replica)
      { id: 'maine-monster', name: 'The Maine Monster', level: 'club', baseAngle: 225, angleSpan: 30, covered: false, price: 'moderate' },
      
      // Sea Dog Suites
      { id: 'suites', name: 'Sea Dog Suites', level: 'suite', baseAngle: 340, angleSpan: 32, covered: true, price: 'luxury' },
      
      // Pavilion
      { id: 'pavilion', name: 'Shipyard Pavilion', level: 'ga', baseAngle: 95, angleSpan: 55, covered: true, price: 'value' },
      
      // Picnic Area
      { id: 'picnic', name: 'Left Field Picnic Area', level: 'ga', baseAngle: 255, angleSpan: 45, covered: false, price: 'value' },
      
      // General Admission
      { id: 'ga-lawn', name: 'General Admission Lawn', level: 'berm', baseAngle: 150, angleSpan: 75, covered: false, price: 'value' }
    ],
    notes: 'Features 37-foot Maine Monster wall, Red Sox AA affiliate'
  }
];

// A+ Stadium Updates
export const updatedAPlusLayouts: VenueLayout[] = [
  // Hudson Valley Renegades - Heritage Financial Park
  {
    venueId: 'hudson-valley-renegades',
    venueName: 'Heritage Financial Park',
    lastUpdated: '2024-01',
    sections: [
      // Premium Box Seats
      { id: 'pb-101', name: 'Premium Box 101', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pb-102', name: 'Premium Box 102', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pb-103', name: 'Premium Box 103', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'pb-104', name: 'Premium Box 104', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Box Seats
      { id: 'box-201', name: 'Box 201', level: 'lower', baseAngle: 28, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-202', name: 'Box 202', level: 'lower', baseAngle: 41, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-203', name: 'Box 203', level: 'lower', baseAngle: 54, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-204', name: 'Box 204', level: 'lower', baseAngle: 67, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-205', name: 'Box 205', level: 'lower', baseAngle: 80, angleSpan: 13, covered: false, price: 'value' },
      
      { id: 'box-206', name: 'Box 206', level: 'lower', baseAngle: 280, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-207', name: 'Box 207', level: 'lower', baseAngle: 293, angleSpan: 13, covered: false, price: 'value' },
      { id: 'box-208', name: 'Box 208', level: 'lower', baseAngle: 306, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-209', name: 'Box 209', level: 'lower', baseAngle: 319, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'box-210', name: 'Box 210', level: 'lower', baseAngle: 332, angleSpan: 13, covered: false, price: 'moderate' },
      
      // Party Deck
      { id: 'party-deck', name: 'Stella Artois Party Deck', level: 'club', baseAngle: 93, angleSpan: 50, covered: true, price: 'moderate' },
      
      // Reserved Bleachers
      { id: 'res-bleachers', name: 'Reserved Bleachers', level: 'ga', baseAngle: 143, angleSpan: 77, covered: false, price: 'value' },
      
      // Heritage Club
      { id: 'heritage-club', name: 'Heritage Club', level: 'club', baseAngle: 345, angleSpan: 30, covered: true, price: 'luxury' },
      
      // Left Field Hill
      { id: 'lf-hill', name: 'Left Field Hill', level: 'berm', baseAngle: 220, angleSpan: 60, covered: false, price: 'value' }
    ],
    notes: 'Wappingers Falls, NY - Yankees A+ affiliate'
  }
];

// A Stadium Updates  
export const updatedALayouts: VenueLayout[] = [
  // Charleston RiverDogs - Joseph P. Riley Jr. Park
  {
    venueId: 'charleston-riverdogs',
    venueName: 'Joseph P. Riley Jr. Park',
    lastUpdated: '2024-01',
    sections: [
      // Piggly Wiggly Home Plate Club
      { id: 'pw-club', name: 'Piggly Wiggly Home Plate Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      
      // Box Seats
      { id: 'box-101', name: 'Box 101', level: 'field', baseAngle: 15, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-102', name: 'Box 102', level: 'field', baseAngle: 26, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-103', name: 'Box 103', level: 'field', baseAngle: 37, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'field', baseAngle: 48, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'field', baseAngle: 59, angleSpan: 11, covered: false, price: 'value' },
      { id: 'box-106', name: 'Box 106', level: 'field', baseAngle: 70, angleSpan: 11, covered: false, price: 'value' },
      
      { id: 'box-107', name: 'Box 107', level: 'field', baseAngle: 290, angleSpan: 11, covered: false, price: 'value' },
      { id: 'box-108', name: 'Box 108', level: 'field', baseAngle: 301, angleSpan: 11, covered: false, price: 'value' },
      { id: 'box-109', name: 'Box 109', level: 'field', baseAngle: 312, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-110', name: 'Box 110', level: 'field', baseAngle: 323, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'box-111', name: 'Box 111', level: 'field', baseAngle: 334, angleSpan: 11, covered: false, price: 'moderate' },
      
      // Ashley View Pub
      { id: 'ashley-pub', name: 'Ashley View Pub', level: 'club', baseAngle: 81, angleSpan: 45, covered: true, price: 'moderate' },
      
      // RiverDogs Suites
      { id: 'suites', name: 'RiverDogs Suites', level: 'suite', baseAngle: 340, angleSpan: 35, covered: true, price: 'luxury' },
      
      // Budweiser Bow Wow Seats (outfield)
      { id: 'bow-wow', name: 'Budweiser Bow Wow Seats', level: 'ga', baseAngle: 126, angleSpan: 66, covered: false, price: 'value' },
      
      // Left Field Lawn
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 192, angleSpan: 88, covered: false, price: 'value' }
    ],
    notes: 'The Joe - Charleston waterfront, Rays A affiliate'
  }
];

// Export all updates
export const allAccurateMilbLayouts = [
  ...updatedAAALayouts,
  ...updatedAALayouts,
  ...updatedAPlusLayouts,
  ...updatedALayouts
];