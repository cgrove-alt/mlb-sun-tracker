// AAA Stadium Real Layouts
// Accurate stadium-specific section data for all Triple-A venues

import { RealStadiumLayout, calculateSectionAngle, calculateSunExposure } from '../realStadiumSections';

// Columbus Clippers - Huntington Park
export const columbusClippersLayout: RealStadiumLayout = {
  venueId: 'columbus-clippers',
  venueName: 'Huntington Park',
  orientation: 315, // Northwest orientation
  lastVerified: '2024-01',
  dataSource: 'verified',
  sections: [
    // Home Plate Club Level
    {
      id: 'club-1',
      name: 'Tansky Terrace Club 1',
      level: 'club',
      baseAngle: calculateSectionAngle(315, 'home', -15),
      angleSpan: 15,
      rows: 8,
      seatsPerRow: 20,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['In-seat service', 'Climate controlled', 'All-inclusive food/beverage'],
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', -15), true, true)
    },
    {
      id: 'club-2',
      name: 'Tansky Terrace Club 2',
      level: 'club',
      baseAngle: calculateSectionAngle(315, 'home', 0),
      angleSpan: 15,
      rows: 8,
      seatsPerRow: 20,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['In-seat service', 'Climate controlled', 'All-inclusive food/beverage'],
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', 0), true, true)
    },
    {
      id: 'club-3',
      name: 'Tansky Terrace Club 3',
      level: 'club',
      baseAngle: calculateSectionAngle(315, 'home', 15),
      angleSpan: 15,
      rows: 8,
      seatsPerRow: 20,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['In-seat service', 'Climate controlled', 'All-inclusive food/beverage'],
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', 15), true, true)
    },
    
    // Lower Box Seats
    {
      id: 'section-11',
      name: 'Section 11',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'home', -20),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 22,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', -20), false)
    },
    {
      id: 'section-12',
      name: 'Section 12',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'home', -10),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 22,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', -10), false)
    },
    {
      id: 'section-13',
      name: 'Section 13',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'home', 0),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 22,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', 0), false)
    },
    {
      id: 'section-14',
      name: 'Section 14',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'home', 10),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 22,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', 10), false)
    },
    {
      id: 'section-15',
      name: 'Section 15',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'home', 20),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 22,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', 20), false)
    },
    
    // First Base Line
    {
      id: 'section-16',
      name: 'Section 16',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'first-base', -22),
      angleSpan: 11,
      rows: 18,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'first-base', -22), false)
    },
    {
      id: 'section-17',
      name: 'Section 17',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'first-base', -11),
      angleSpan: 11,
      rows: 18,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'first-base', -11), false)
    },
    {
      id: 'section-18',
      name: 'Section 18',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'first-base', 0),
      angleSpan: 11,
      rows: 18,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'first-base', 0), false)
    },
    {
      id: 'section-19',
      name: 'Section 19',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'first-base', 11),
      angleSpan: 11,
      rows: 16,
      seatsPerRow: 18,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'first-base', 11), false)
    },
    
    // Third Base Line
    {
      id: 'section-6',
      name: 'Section 6',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'third-base', 22),
      angleSpan: 11,
      rows: 18,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'third-base', 22), false)
    },
    {
      id: 'section-7',
      name: 'Section 7',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'third-base', 11),
      angleSpan: 11,
      rows: 18,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'third-base', 11), false)
    },
    {
      id: 'section-8',
      name: 'Section 8',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'third-base', 0),
      angleSpan: 11,
      rows: 18,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'third-base', 0), false)
    },
    {
      id: 'section-9',
      name: 'Section 9',
      level: 'lower',
      baseAngle: calculateSectionAngle(315, 'third-base', -11),
      angleSpan: 11,
      rows: 16,
      seatsPerRow: 18,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'third-base', -11), false)
    },
    
    // Upper Level
    {
      id: 'section-21',
      name: 'Section 21',
      level: 'upper',
      baseAngle: calculateSectionAngle(315, 'home', -25),
      angleSpan: 25,
      rows: 12,
      seatsPerRow: 24,
      covered: true,
      hasOverhang: true,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', -25), true, true)
    },
    {
      id: 'section-22',
      name: 'Section 22',
      level: 'upper',
      baseAngle: calculateSectionAngle(315, 'home', 0),
      angleSpan: 25,
      rows: 12,
      seatsPerRow: 24,
      covered: true,
      hasOverhang: true,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', 0), true, true)
    },
    {
      id: 'section-23',
      name: 'Section 23',
      level: 'upper',
      baseAngle: calculateSectionAngle(315, 'home', 25),
      angleSpan: 25,
      rows: 12,
      seatsPerRow: 24,
      covered: true,
      hasOverhang: true,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'home', 25), true, true)
    },
    
    // Right Field
    {
      id: 'section-20',
      name: 'Section 20',
      level: 'ga',
      baseAngle: calculateSectionAngle(315, 'right-field', -15),
      angleSpan: 30,
      rows: 8,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'right-field', -15), false)
    },
    
    // Left Field
    {
      id: 'section-5',
      name: 'Section 5',
      level: 'ga',
      baseAngle: calculateSectionAngle(315, 'left-field', 15),
      angleSpan: 30,
      rows: 8,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'left-field', 15), false)
    },
    
    // AEP Power Pavilion (Right Field Bar)
    {
      id: 'aep-pavilion',
      name: 'AEP Power Pavilion',
      level: 'club',
      baseAngle: calculateSectionAngle(315, 'right-field', 10),
      angleSpan: 35,
      rows: 4,
      covered: true,
      price: 'moderate',
      accessibility: 'full',
      amenities: ['Bar seating', 'Standing room', 'Group area'],
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'right-field', 10), true)
    },
    
    // The Rooftop (Left Field)
    {
      id: 'rooftop',
      name: 'The Rooftop',
      level: 'club',
      baseAngle: calculateSectionAngle(315, 'left-field', -10),
      angleSpan: 40,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['Rooftop bar', 'Standing room', 'City views'],
      sunExposure: calculateSunExposure(calculateSectionAngle(315, 'left-field', -10), true, true)
    }
  ],
  specialFeatures: [
    {
      name: 'Downtown Location',
      description: 'Located in Arena District with city skyline views',
      location: 'Throughout',
      sunImpact: 'Buildings provide some late afternoon shade to first base side'
    },
    {
      name: 'Tansky Terrace',
      description: 'Premium club level with all-inclusive amenities',
      location: 'Behind home plate',
      sunImpact: 'Fully covered, no sun exposure'
    },
    {
      name: 'The Rooftop',
      description: 'Unique rooftop bar area with city views',
      location: 'Left field',
      sunImpact: 'Covered area provides complete shade'
    }
  ],
  notes: 'Northwest orientation helps minimize sun in batters eyes. Upper deck provides shade to lower sections in afternoon games.'
};

// Durham Bulls - Durham Bulls Athletic Park
export const durhamBullsLayout: RealStadiumLayout = {
  venueId: 'durham-bulls',
  venueName: 'Durham Bulls Athletic Park',
  orientation: 90, // Due east orientation
  lastVerified: '2024-01',
  dataSource: 'verified',
  sections: [
    // Diamond View Box Seats (Behind Home)
    {
      id: 'section-100',
      name: 'Section 100',
      level: 'field',
      baseAngle: calculateSectionAngle(90, 'home', -18),
      angleSpan: 9,
      rows: 10,
      seatsPerRow: 20,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', -18), false)
    },
    {
      id: 'section-101',
      name: 'Section 101',
      level: 'field',
      baseAngle: calculateSectionAngle(90, 'home', -9),
      angleSpan: 9,
      rows: 10,
      seatsPerRow: 22,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', -9), false)
    },
    {
      id: 'section-102',
      name: 'Section 102',
      level: 'field',
      baseAngle: calculateSectionAngle(90, 'home', 0),
      angleSpan: 9,
      rows: 10,
      seatsPerRow: 24,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', 0), false)
    },
    {
      id: 'section-103',
      name: 'Section 103',
      level: 'field',
      baseAngle: calculateSectionAngle(90, 'home', 9),
      angleSpan: 9,
      rows: 10,
      seatsPerRow: 22,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', 9), false)
    },
    {
      id: 'section-104',
      name: 'Section 104',
      level: 'field',
      baseAngle: calculateSectionAngle(90, 'home', 18),
      angleSpan: 9,
      rows: 10,
      seatsPerRow: 20,
      covered: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', 18), false)
    },
    
    // First Base Side (105-110)
    {
      id: 'section-105',
      name: 'Section 105',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'first-base', -20),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'first-base', -20), false)
    },
    {
      id: 'section-106',
      name: 'Section 106',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'first-base', -10),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'first-base', -10), false)
    },
    {
      id: 'section-107',
      name: 'Section 107',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'first-base', 0),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'first-base', 0), false)
    },
    {
      id: 'section-108',
      name: 'Section 108',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'first-base', 10),
      angleSpan: 10,
      rows: 14,
      seatsPerRow: 18,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'first-base', 10), false)
    },
    {
      id: 'section-109',
      name: 'Section 109',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'first-base', 20),
      angleSpan: 10,
      rows: 12,
      seatsPerRow: 16,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'first-base', 20), false)
    },
    {
      id: 'section-110',
      name: 'Section 110',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'first-base', 30),
      angleSpan: 10,
      rows: 10,
      seatsPerRow: 14,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'first-base', 30), false)
    },
    
    // Third Base Side (113-118)
    {
      id: 'section-113',
      name: 'Section 113',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'third-base', 20),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'third-base', 20), false)
    },
    {
      id: 'section-114',
      name: 'Section 114',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'third-base', 10),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'third-base', 10), false)
    },
    {
      id: 'section-115',
      name: 'Section 115',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'third-base', 0),
      angleSpan: 10,
      rows: 16,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'third-base', 0), false)
    },
    {
      id: 'section-116',
      name: 'Section 116',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'third-base', -10),
      angleSpan: 10,
      rows: 14,
      seatsPerRow: 18,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'third-base', -10), false)
    },
    {
      id: 'section-117',
      name: 'Section 117',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'third-base', -20),
      angleSpan: 10,
      rows: 12,
      seatsPerRow: 16,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'third-base', -20), false)
    },
    {
      id: 'section-118',
      name: 'Section 118',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'third-base', -30),
      angleSpan: 10,
      rows: 10,
      seatsPerRow: 14,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'third-base', -30), false)
    },
    
    // PNC Triangle Club (Upper Level Behind Home)
    {
      id: 'pnc-club',
      name: 'PNC Triangle Club',
      level: 'club',
      baseAngle: calculateSectionAngle(90, 'home', 0),
      angleSpan: 50,
      rows: 6,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['Climate controlled', 'In-seat service', 'Private concessions', 'Lounge access'],
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', 0), true, true)
    },
    
    // Upper Reserved (200 Level)
    {
      id: 'section-202',
      name: 'Section 202',
      level: 'upper',
      baseAngle: calculateSectionAngle(90, 'home', -30),
      angleSpan: 15,
      rows: 14,
      seatsPerRow: 26,
      covered: true,
      hasOverhang: true,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', -30), true, true)
    },
    {
      id: 'section-204',
      name: 'Section 204',
      level: 'upper',
      baseAngle: calculateSectionAngle(90, 'home', -15),
      angleSpan: 15,
      rows: 14,
      seatsPerRow: 26,
      covered: true,
      hasOverhang: true,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', -15), true, true)
    },
    {
      id: 'section-206',
      name: 'Section 206',
      level: 'upper',
      baseAngle: calculateSectionAngle(90, 'home', 0),
      angleSpan: 15,
      rows: 14,
      seatsPerRow: 26,
      covered: true,
      hasOverhang: true,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', 0), true, true)
    },
    {
      id: 'section-208',
      name: 'Section 208',
      level: 'upper',
      baseAngle: calculateSectionAngle(90, 'home', 15),
      angleSpan: 15,
      rows: 14,
      seatsPerRow: 26,
      covered: true,
      hasOverhang: true,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', 15), true, true)
    },
    {
      id: 'section-210',
      name: 'Section 210',
      level: 'upper',
      baseAngle: calculateSectionAngle(90, 'home', 30),
      angleSpan: 15,
      rows: 14,
      seatsPerRow: 26,
      covered: true,
      hasOverhang: true,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'home', 30), true, true)
    },
    
    // Blue Monster Seats
    {
      id: 'blue-monster',
      name: 'Blue Monster',
      level: 'ga',
      baseAngle: calculateSectionAngle(90, 'left-field', 0),
      angleSpan: 60,
      rows: 6,
      covered: false,
      price: 'value',
      accessibility: 'partial',
      amenities: ['Unique seating on left field wall'],
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'left-field', 0), false)
    },
    
    // Right Field Picnic Area
    {
      id: 'rf-picnic',
      name: 'Right Field Picnic Area',
      level: 'ga',
      baseAngle: calculateSectionAngle(90, 'right-field', 0),
      angleSpan: 45,
      covered: false,
      price: 'value',
      amenities: ['Picnic tables', 'Group seating'],
      sunExposure: calculateSunExposure(calculateSectionAngle(90, 'right-field', 0), false)
    }
  ],
  specialFeatures: [
    {
      name: 'Blue Monster',
      description: '32-foot high left field wall with seating on top',
      location: 'Left field',
      sunImpact: 'Provides shade to left field corner seats in late afternoon'
    },
    {
      name: 'Bull Durham House',
      description: 'Actual house from the movie visible beyond right field',
      location: 'Beyond right field',
      sunImpact: 'No impact on seating'
    },
    {
      name: 'Due East Orientation',
      description: 'Stadium faces directly east',
      location: 'Throughout',
      sunImpact: 'First base side gets afternoon sun, third base side shaded'
    }
  ],
  notes: 'Famous for Bull Durham movie connection. Due east orientation means strong afternoon sun on first base side.'
};

// Las Vegas Aviators - Las Vegas Ballpark
export const lasVegasAviatorsLayout: RealStadiumLayout = {
  venueId: 'las-vegas-aviators',
  venueName: 'Las Vegas Ballpark',
  orientation: 330, // Northwest orientation
  lastVerified: '2024-01',
  dataSource: 'verified',
  sections: [
    // Premium Seats Behind Home
    {
      id: 'section-101',
      name: 'Section 101',
      level: 'field',
      baseAngle: calculateSectionAngle(330, 'home', -16),
      angleSpan: 8,
      rows: 8,
      seatsPerRow: 18,
      covered: false,
      hasOverhang: true,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'home', -16), false, true)
    },
    {
      id: 'section-102',
      name: 'Section 102',
      level: 'field',
      baseAngle: calculateSectionAngle(330, 'home', -8),
      angleSpan: 8,
      rows: 8,
      seatsPerRow: 20,
      covered: false,
      hasOverhang: true,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'home', -8), false, true)
    },
    {
      id: 'section-103',
      name: 'Section 103',
      level: 'field',
      baseAngle: calculateSectionAngle(330, 'home', 0),
      angleSpan: 8,
      rows: 8,
      seatsPerRow: 20,
      covered: false,
      hasOverhang: true,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'home', 0), false, true)
    },
    {
      id: 'section-104',
      name: 'Section 104',
      level: 'field',
      baseAngle: calculateSectionAngle(330, 'home', 8),
      angleSpan: 8,
      rows: 8,
      seatsPerRow: 20,
      covered: false,
      hasOverhang: true,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'home', 8), false, true)
    },
    {
      id: 'section-105',
      name: 'Section 105',
      level: 'field',
      baseAngle: calculateSectionAngle(330, 'home', 16),
      angleSpan: 8,
      rows: 8,
      seatsPerRow: 18,
      covered: false,
      hasOverhang: true,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'home', 16), false, true)
    },
    
    // First Base Line (106-112)
    {
      id: 'section-106',
      name: 'Section 106',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'first-base', -24),
      angleSpan: 12,
      rows: 14,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'first-base', -24), false)
    },
    {
      id: 'section-107',
      name: 'Section 107',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'first-base', -12),
      angleSpan: 12,
      rows: 14,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'first-base', -12), false)
    },
    {
      id: 'section-108',
      name: 'Section 108',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'first-base', 0),
      angleSpan: 12,
      rows: 14,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'first-base', 0), false)
    },
    {
      id: 'section-109',
      name: 'Section 109',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'first-base', 12),
      angleSpan: 12,
      rows: 12,
      seatsPerRow: 18,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'first-base', 12), false)
    },
    {
      id: 'section-110',
      name: 'Section 110',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'first-base', 24),
      angleSpan: 12,
      rows: 10,
      seatsPerRow: 16,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'first-base', 24), false)
    },
    {
      id: 'section-111',
      name: 'Section 111',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'first-base', 36),
      angleSpan: 12,
      rows: 8,
      seatsPerRow: 14,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'first-base', 36), false)
    },
    {
      id: 'section-112',
      name: 'Section 112',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'first-base', 48),
      angleSpan: 12,
      rows: 6,
      seatsPerRow: 12,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'first-base', 48), false)
    },
    
    // Third Base Line (116-122)
    {
      id: 'section-116',
      name: 'Section 116',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'third-base', 24),
      angleSpan: 12,
      rows: 14,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'third-base', 24), false)
    },
    {
      id: 'section-117',
      name: 'Section 117',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'third-base', 12),
      angleSpan: 12,
      rows: 14,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'third-base', 12), false)
    },
    {
      id: 'section-118',
      name: 'Section 118',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'third-base', 0),
      angleSpan: 12,
      rows: 14,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'third-base', 0), false)
    },
    {
      id: 'section-119',
      name: 'Section 119',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'third-base', -12),
      angleSpan: 12,
      rows: 12,
      seatsPerRow: 18,
      covered: false,
      price: 'moderate',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'third-base', -12), false)
    },
    {
      id: 'section-120',
      name: 'Section 120',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'third-base', -24),
      angleSpan: 12,
      rows: 10,
      seatsPerRow: 16,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'third-base', -24), false)
    },
    {
      id: 'section-121',
      name: 'Section 121',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'third-base', -36),
      angleSpan: 12,
      rows: 8,
      seatsPerRow: 14,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'third-base', -36), false)
    },
    {
      id: 'section-122',
      name: 'Section 122',
      level: 'lower',
      baseAngle: calculateSectionAngle(330, 'third-base', -48),
      angleSpan: 12,
      rows: 6,
      seatsPerRow: 12,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'third-base', -48), false)
    },
    
    // Club Level (200s)
    {
      id: 'section-201',
      name: 'Section 201 - Strip View Club',
      level: 'club',
      baseAngle: calculateSectionAngle(330, 'home', -20),
      angleSpan: 20,
      rows: 4,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['Strip views', 'In-seat service', 'Climate controlled', 'Premium dining'],
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'home', -20), true, true)
    },
    {
      id: 'section-202',
      name: 'Section 202 - Strip View Club',
      level: 'club',
      baseAngle: calculateSectionAngle(330, 'home', 0),
      angleSpan: 20,
      rows: 4,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['Strip views', 'In-seat service', 'Climate controlled', 'Premium dining'],
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'home', 0), true, true)
    },
    {
      id: 'section-203',
      name: 'Section 203 - Strip View Club',
      level: 'club',
      baseAngle: calculateSectionAngle(330, 'home', 20),
      angleSpan: 20,
      rows: 4,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['Strip views', 'In-seat service', 'Climate controlled', 'Premium dining'],
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'home', 20), true, true)
    },
    
    // Party Deck Areas
    {
      id: 'rf-party-deck',
      name: 'Right Field Party Deck',
      level: 'ga',
      baseAngle: calculateSectionAngle(330, 'right-field', 0),
      angleSpan: 40,
      covered: false,
      price: 'moderate',
      amenities: ['Bar service', 'Standing room', 'Group area'],
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'right-field', 0), false)
    },
    {
      id: 'lf-party-deck',
      name: 'Left Field Party Deck',
      level: 'ga',
      baseAngle: calculateSectionAngle(330, 'left-field', 0),
      angleSpan: 40,
      covered: false,
      price: 'moderate',
      amenities: ['Bar service', 'Standing room', 'Group area'],
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'left-field', 0), false)
    },
    
    // Mesh Home Run Porch
    {
      id: 'mesh-porch',
      name: 'Mesh Home Run Porch',
      level: 'ga',
      baseAngle: calculateSectionAngle(330, 'center-field', 0),
      angleSpan: 50,
      covered: true,
      price: 'value',
      amenities: ['Unique mesh seating', 'Center field views'],
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'center-field', 0), true)
    },
    
    // Swimming Pool
    {
      id: 'pool',
      name: 'Swimming Pool',
      level: 'suite',
      baseAngle: calculateSectionAngle(330, 'right-field', 20),
      angleSpan: 20,
      covered: false,
      price: 'luxury',
      amenities: ['Swimming pool', 'Cabanas', 'Premium service'],
      sunExposure: calculateSunExposure(calculateSectionAngle(330, 'right-field', 20), false)
    }
  ],
  specialFeatures: [
    {
      name: 'Las Vegas Strip Views',
      description: 'Views of the Strip from club level and upper sections',
      location: 'Club level',
      sunImpact: 'No impact on sun exposure'
    },
    {
      name: 'Swimming Pool',
      description: 'Pool and cabana area beyond right field',
      location: 'Right field',
      sunImpact: 'Full sun exposure, desert heat intensifies need for shade'
    },
    {
      name: 'Desert Climate',
      description: 'Extreme heat in summer months',
      location: 'Throughout',
      sunImpact: 'Intense sun exposure, covered sections highly desirable'
    },
    {
      name: 'Mesh Home Run Porch',
      description: 'Unique seating area with mesh chairs in center field',
      location: 'Center field',
      sunImpact: 'Covered area provides shade'
    }
  ],
  notes: 'Opened in 2019, newest AAA ballpark. Desert location means intense sun, especially in summer. Northwest orientation helps with evening games.'
};