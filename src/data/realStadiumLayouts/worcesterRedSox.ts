// Worcester Red Sox - Polar Park
// Real stadium section layout based on actual seating chart

import { RealStadiumLayout, calculateSectionAngle, calculateSunExposure } from '../realStadiumSections';

const POLAR_PARK_ORIENTATION = 45; // Northeast orientation

export const polarParkLayout: RealStadiumLayout = {
  venueId: 'worcester-red-sox',
  venueName: 'Polar Park',
  orientation: POLAR_PARK_ORIENTATION,
  lastVerified: '2024-01',
  dataSource: 'verified',
  sections: [
    // Field Level - Behind Home Plate
    {
      id: 'section-1',
      name: 'Section 1',
      level: 'field',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'home', -15),
      angleSpan: 10,
      rows: 15,
      seatsPerRow: 18,
      covered: false,
      hasOverhang: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'home', -15), false)
    },
    {
      id: 'section-2',
      name: 'Section 2',
      level: 'field',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'home', -5),
      angleSpan: 10,
      rows: 15,
      seatsPerRow: 20,
      covered: false,
      hasOverhang: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'home', -5), false)
    },
    {
      id: 'section-3',
      name: 'Section 3',
      level: 'field',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'home', 5),
      angleSpan: 10,
      rows: 15,
      seatsPerRow: 20,
      covered: false,
      hasOverhang: false,
      price: 'premium',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'home', 5), false)
    },
    
    // First Base Line
    {
      id: 'section-4',
      name: 'Section 4',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'first-base', -20),
      angleSpan: 12,
      rows: 20,
      seatsPerRow: 22,
      covered: false,
      price: 'moderate',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'first-base', -20), false)
    },
    {
      id: 'section-5',
      name: 'Section 5',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'first-base', -8),
      angleSpan: 12,
      rows: 20,
      seatsPerRow: 22,
      covered: false,
      price: 'moderate',
      accessibility: 'partial',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'first-base', -8), false)
    },
    {
      id: 'section-6',
      name: 'Section 6',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'first-base', 4),
      angleSpan: 12,
      rows: 18,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      accessibility: 'partial',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'first-base', 4), false)
    },
    
    // Third Base Line
    {
      id: 'section-14',
      name: 'Section 14',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'third-base', 20),
      angleSpan: 12,
      rows: 20,
      seatsPerRow: 22,
      covered: false,
      price: 'moderate',
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'third-base', 20), false)
    },
    {
      id: 'section-15',
      name: 'Section 15',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'third-base', 8),
      angleSpan: 12,
      rows: 20,
      seatsPerRow: 22,
      covered: false,
      price: 'moderate',
      accessibility: 'partial',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'third-base', 8), false)
    },
    {
      id: 'section-16',
      name: 'Section 16',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'third-base', -4),
      angleSpan: 12,
      rows: 18,
      seatsPerRow: 20,
      covered: false,
      price: 'moderate',
      accessibility: 'partial',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'third-base', -4), false)
    },
    
    // DCU Club (Premium Club Level)
    {
      id: 'dcu-club',
      name: 'DCU Club',
      level: 'club',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'home', 0),
      angleSpan: 60,
      rows: 8,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['In-seat service', 'Climate controlled', 'Private restrooms', 'Premium food options'],
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'home', 0), true, true)
    },
    
    // Right Field
    {
      id: 'section-7',
      name: 'Section 7',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'right-field', -25),
      angleSpan: 15,
      rows: 12,
      seatsPerRow: 18,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'right-field', -25), false)
    },
    {
      id: 'section-8',
      name: 'Section 8',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'right-field', -10),
      angleSpan: 15,
      rows: 10,
      seatsPerRow: 16,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'right-field', -10), false)
    },
    
    // Left Field (including Worcester Wall)
    {
      id: 'section-11',
      name: 'Section 11',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'left-field', 10),
      angleSpan: 15,
      rows: 10,
      seatsPerRow: 16,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'left-field', 10), false)
    },
    {
      id: 'section-12',
      name: 'Section 12',
      level: 'lower',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'left-field', 25),
      angleSpan: 15,
      rows: 12,
      seatsPerRow: 18,
      covered: false,
      price: 'value',
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'left-field', 25), false)
    },
    
    // Berm (General Admission)
    {
      id: 'berm',
      name: 'University Dental Group Berm',
      level: 'berm',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'center-field', -30),
      angleSpan: 60,
      covered: false,
      price: 'value',
      accessibility: 'full',
      amenities: ['Picnic area', 'Kids play area'],
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'center-field', 0), false)
    },
    
    // Summit Suites (Left Field Line)
    {
      id: 'summit-suites',
      name: 'Summit Suites',
      level: 'suite',
      baseAngle: calculateSectionAngle(POLAR_PARK_ORIENTATION, 'third-base', 30),
      angleSpan: 30,
      covered: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['Private suite', 'Catering', 'Indoor/outdoor seating', 'Private restroom'],
      sunExposure: calculateSunExposure(calculateSectionAngle(POLAR_PARK_ORIENTATION, 'third-base', 30), true)
    }
  ],
  specialFeatures: [
    {
      name: 'Worcester Wall',
      description: 'Left field wall similar to Green Monster, 30 feet high',
      location: 'Left field',
      sunImpact: 'Provides shade to left field seats in late afternoon'
    },
    {
      name: 'Heart of the Commonwealth',
      description: 'Large heart-shaped art installation in center field',
      location: 'Center field',
      sunImpact: 'No significant sun impact'
    },
    {
      name: 'Canal District Views',
      description: 'Views of Worcester Canal District from upper sections',
      location: 'Throughout stadium',
      sunImpact: 'Western views can have sun glare during evening games'
    }
  ],
  notes: 'Opened in 2021, northeast orientation minimizes sun in batters eyes. DCU Club provides excellent covered seating.'
};