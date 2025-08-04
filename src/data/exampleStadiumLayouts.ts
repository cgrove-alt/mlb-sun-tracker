// Example Real Stadium Layouts
// Implementation examples for 3 different stadium types and sizes

import { RealStadiumLayout, calculateSectionAngle, calculateSunExposure } from './realStadiumSections';

// Example 1: Polar Park (Worcester Red Sox) - AAA, New Stadium (2021)
// Capacity: 9,508, Orientation: 45°
export const polarParkLayout: RealStadiumLayout = {
  stadiumId: 'worcester-red-sox',
  stadiumName: 'Polar Park',
  lastUpdated: '2024-12-01',
  dataSource: 'official',
  sections: [
    // Field Level - Home Plate Area (Sections 1-3)
    {
      id: 'sec-1',
      name: 'Section 1',
      level: 'field',
      baseAngle: calculateSectionAngle(45, 'third', -15), // ~345°
      angleSpan: 8,
      covered: false,
      price: 'premium',
      capacity: 200,
      rows: 12,
      characteristics: {
        sunExposure: calculateSunExposure(345, 42.27, false),
        viewQuality: 'excellent',
        accessibility: true,
        amenities: ['concessions', 'restrooms']
      }
    },
    {
      id: 'sec-2',
      name: 'Section 2',
      level: 'field',
      baseAngle: calculateSectionAngle(45, 'home', 0), // 45°
      angleSpan: 8,
      covered: false,
      price: 'premium',
      capacity: 220,
      rows: 12,
      characteristics: {
        sunExposure: calculateSunExposure(45, 42.27, false),
        viewQuality: 'excellent',
        accessibility: true
      }
    },
    {
      id: 'sec-3',
      name: 'Section 3',
      level: 'field',
      baseAngle: calculateSectionAngle(45, 'first', -15), // ~75°
      angleSpan: 8,
      covered: false,
      price: 'premium',
      capacity: 200,
      rows: 12,
      characteristics: {
        sunExposure: calculateSunExposure(75, 42.27, false),
        viewQuality: 'excellent',
        accessibility: true
      }
    },
    
    // Lower Bowl - First Base Side (Sections 4-8)
    {
      id: 'sec-4',
      name: 'Section 4',
      level: 'lower',
      baseAngle: calculateSectionAngle(45, 'first', 0), // 90°
      angleSpan: 12,
      covered: false,
      price: 'moderate',
      capacity: 280,
      rows: 16,
      characteristics: {
        sunExposure: calculateSunExposure(90, 42.27, false),
        viewQuality: 'good',
        accessibility: true
      }
    },
    {
      id: 'sec-5',
      name: 'Section 5',
      level: 'lower',
      baseAngle: calculateSectionAngle(45, 'first', 15), // 105°
      angleSpan: 12,
      covered: false,
      price: 'moderate',
      capacity: 260,
      rows: 15,
      characteristics: {
        sunExposure: calculateSunExposure(105, 42.27, false),
        viewQuality: 'good',
        accessibility: true
      }
    },
    
    // Right Field Sections
    {
      id: 'sec-108',
      name: 'Section 108 (Berm)',
      level: 'berm',
      baseAngle: calculateSectionAngle(45, 'cf', -30), // ~195°
      angleSpan: 30,
      covered: false,
      price: 'value',
      capacity: 400,
      characteristics: {
        sunExposure: calculateSunExposure(195, 42.27, false),
        viewQuality: 'fair',
        accessibility: true,
        amenities: ['lawn_seating']
      }
    },
    
    // DCU Club (Premium Club Level)
    {
      id: 'dcu-club',
      name: 'DCU Club',
      level: 'club',
      baseAngle: calculateSectionAngle(45, 'home', 0),
      angleSpan: 20,
      covered: true,
      price: 'luxury',
      capacity: 150,
      rows: 8,
      characteristics: {
        sunExposure: 'low',
        viewQuality: 'excellent',
        accessibility: true,
        amenities: ['premium_dining', 'climate_control', 'exclusive_access']
      }
    }
  ],
  notes: 'Modern AAA facility with unique urban integration including the Worcester Wall',
  specialFeatures: {
    walls: [
      { name: 'Worcester Wall', height: 32, location: 'right_field' }
    ],
    berms: [
      { name: 'University Dental Group Berm', capacity: 400, location: 'center_field' }
    ],
    clubs: [
      { name: 'DCU Club', level: 'club', premium: true }
    ]
  }
};

// Example 2: Durham Bulls Athletic Park - AAA, Classic Stadium (1995)
// Capacity: 10,000, Orientation: 90°
export const durhamBullsLayout: RealStadiumLayout = {
  stadiumId: 'durham-bulls',
  stadiumName: 'Durham Bulls Athletic Park',
  lastUpdated: '2024-12-01',
  dataSource: 'verified',
  sections: [
    // Field Level Premium
    {
      id: 'sec-100',
      name: 'Section 100',
      level: 'field',
      baseAngle: calculateSectionAngle(90, 'home', -10), // 80°
      angleSpan: 10,
      covered: false,
      price: 'premium',
      capacity: 180,
      rows: 10,
      characteristics: {
        sunExposure: calculateSunExposure(80, 35.99, false),
        viewQuality: 'excellent',
        accessibility: true
      }
    },
    
    // Main Bowl Sections
    {
      id: 'sec-103',
      name: 'Section 103',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'first', -10), // 125°
      angleSpan: 12,
      covered: false,
      price: 'moderate',
      capacity: 320,
      rows: 18,
      characteristics: {
        sunExposure: calculateSunExposure(125, 35.99, false),
        viewQuality: 'good',
        accessibility: true
      }
    },
    
    // Third Base Side
    {
      id: 'sec-116',
      name: 'Section 116',
      level: 'lower',
      baseAngle: calculateSectionAngle(90, 'third', 10), // 55°
      angleSpan: 12,
      covered: false,
      price: 'moderate',
      capacity: 300,
      rows: 17,
      characteristics: {
        sunExposure: calculateSunExposure(55, 35.99, false),
        viewQuality: 'good',
        accessibility: true
      }
    },
    
    // Upper Level
    {
      id: 'sec-130',
      name: 'Section 130',
      level: 'upper',
      baseAngle: calculateSectionAngle(90, 'home', 5),
      angleSpan: 15,
      covered: true,
      price: 'value',
      capacity: 250,
      rows: 12,
      characteristics: {
        sunExposure: 'low',
        viewQuality: 'good',
        accessibility: true
      }
    }
  ],
  notes: 'Famous for the Blue Monster wall and snorting bull, featured in Bull Durham movie',
  specialFeatures: {
    walls: [
      { name: 'Blue Monster', height: 32, location: 'left_field' }
    ],
    clubs: [
      { name: 'PNC Triangle Club', level: 'club', premium: true }
    ]
  }
};

// Example 3: Akron RubberDucks Canal Park - AA, Mid-Size Stadium (1997)
// Capacity: 7,630, Orientation: 45°
export const akronRubberDucksLayout: RealStadiumLayout = {
  stadiumId: 'akron-rubberducks',
  stadiumName: 'Canal Park',
  lastUpdated: '2024-12-01',
  dataSource: 'estimated', // Based on typical AA stadium layouts
  sections: [
    // Field Boxes
    {
      id: 'field-1',
      name: 'Field Box 1',
      level: 'field',
      baseAngle: calculateSectionAngle(45, 'home', -8),
      angleSpan: 8,
      covered: false,
      price: 'premium',
      capacity: 150,
      rows: 8,
      characteristics: {
        sunExposure: calculateSunExposure(calculateSectionAngle(45, 'home', -8), 41.08, false),
        viewQuality: 'excellent',
        accessibility: false
      }
    },
    
    // Lower Reserved
    {
      id: 'lower-101',
      name: 'Lower 101',
      level: 'lower',
      baseAngle: calculateSectionAngle(45, 'first', 0),
      angleSpan: 15,
      covered: false,
      price: 'moderate',
      capacity: 280,
      rows: 14,
      characteristics: {
        sunExposure: calculateSunExposure(90, 41.08, false),
        viewQuality: 'good',
        accessibility: true
      }
    },
    
    // General Admission
    {
      id: 'ga-bleachers',
      name: 'General Admission Bleachers',
      level: 'ga',
      baseAngle: calculateSectionAngle(45, 'rf', 15),
      angleSpan: 45,
      covered: false,
      price: 'value',
      capacity: 500,
      characteristics: {
        sunExposure: calculateSunExposure(120, 41.08, false),
        viewQuality: 'fair',
        accessibility: true,
        amenities: ['concessions']
      }
    },
    
    // Suites (limited in AA)
    {
      id: 'suite-level',
      name: 'Suite Level',
      level: 'suite',
      baseAngle: calculateSectionAngle(45, 'home', 0),
      angleSpan: 30,
      covered: true,
      price: 'luxury',
      capacity: 80,
      characteristics: {
        sunExposure: 'low',
        viewQuality: 'excellent',
        accessibility: true,
        amenities: ['premium_dining', 'climate_control']
      }
    }
  ],
  notes: 'AA stadium with downtown Akron skyline views, typical mid-market facility'
};

// Export all examples
export const exampleStadiumLayouts = {
  'worcester-red-sox': polarParkLayout,
  'durham-bulls': durhamBullsLayout,
  'akron-rubberducks': akronRubberDucksLayout
};