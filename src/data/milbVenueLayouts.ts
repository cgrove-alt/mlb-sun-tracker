// Venue-specific seating layouts for MiLB stadiums
// Each stadium has unique architecture and seating configurations

export interface VenueSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite' | 'ga' | 'berm';
  baseAngle: number; // 0-359 degrees
  angleSpan: number; // degrees of coverage
  covered: boolean;
  price: 'premium' | 'moderate' | 'value' | 'luxury';
  rows?: number;
  capacity?: number;
}

export interface VenueLayout {
  venueId: string;
  venueName: string;
  lastUpdated: string;
  sections: VenueSection[];
  notes?: string;
}

// AAA Stadium Layouts
export const aaaVenueLayouts: VenueLayout[] = [
  {
    venueId: 'worcester-red-sox',
    venueName: 'Polar Park',
    lastUpdated: '2024-01',
    sections: [
      // Home Plate Premium
      { id: 'sec-1', name: 'Section 1', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: 'Section 2', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: 'Section 3', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      
      // First Base Line
      { id: 'sec-4', name: 'Section 4', level: 'lower', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-5', name: 'Section 5', level: 'lower', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-6', name: 'Section 6', level: 'lower', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: 'Section 7', level: 'lower', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: 'Section 8', level: 'lower', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-9', name: 'Section 9', level: 'lower', baseAngle: 70, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-10', name: 'Section 10', level: 'lower', baseAngle: 80, angleSpan: 10, covered: false, price: 'value' },
      
      // Right Field
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      
      // Third Base Line
      { id: 'sec-11', name: 'Section 11', level: 'lower', baseAngle: 270, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-12', name: 'Section 12', level: 'lower', baseAngle: 280, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-13', name: 'Section 13', level: 'lower', baseAngle: 290, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-14', name: 'Section 14', level: 'lower', baseAngle: 300, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-15', name: 'Section 15', level: 'lower', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-16', name: 'Section 16', level: 'lower', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-17', name: 'Section 17', level: 'lower', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-18', name: 'Section 18', level: 'lower', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      
      // Left Field
      { id: 'lf-wall', name: 'Left Field Wall', level: 'ga', baseAngle: 210, angleSpan: 30, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club-1', name: 'DCU Club', level: 'club', baseAngle: 350, angleSpan: 30, covered: true, price: 'luxury' },
      
      // Suites
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 320, angleSpan: 60, covered: true, price: 'luxury' }
    ],
    notes: 'Polar Park opened in 2021, oriented northeast with home plate'
  },
  
  {
    venueId: 'sacramento-river-cats',
    venueName: 'Sutter Health Park',
    lastUpdated: '2024-01',
    sections: [
      // Diamond Level (Behind Home)
      { id: 'diamond-1', name: 'Diamond 101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-2', name: 'Diamond 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-3', name: 'Diamond 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-4', name: 'Diamond 104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'diamond-5', name: 'Diamond 105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Field Reserved (1B side)
      { id: 'fr-106', name: 'Field Reserved 106', level: 'lower', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-107', name: 'Field Reserved 107', level: 'lower', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-108', name: 'Field Reserved 108', level: 'lower', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-109', name: 'Field Reserved 109', level: 'lower', baseAngle: 60, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-110', name: 'Field Reserved 110', level: 'lower', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-111', name: 'Field Reserved 111', level: 'lower', baseAngle: 80, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Field Reserved (3B side)
      { id: 'fr-112', name: 'Field Reserved 112', level: 'lower', baseAngle: 280, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-113', name: 'Field Reserved 113', level: 'lower', baseAngle: 290, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-114', name: 'Field Reserved 114', level: 'lower', baseAngle: 300, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-115', name: 'Field Reserved 115', level: 'lower', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-116', name: 'Field Reserved 116', level: 'lower', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'fr-117', name: 'Field Reserved 117', level: 'lower', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Toyota Home Run Hill (LF)
      { id: 'hr-hill', name: 'Toyota Home Run Hill', level: 'berm', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' },
      
      // Solon Club Level
      { id: 'solon-club', name: 'Solon Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' },
      
      // Suites
      { id: 'suite-row', name: 'Suite Level', level: 'suite', baseAngle: 330, angleSpan: 60, covered: true, price: 'luxury' }
    ],
    notes: 'Home of the Athletics 2025+, oriented northwest'
  },
  
  {
    venueId: 'las-vegas-aviators',
    venueName: 'Las Vegas Ballpark',
    lastUpdated: '2024-01',
    sections: [
      // Premium Behind Home
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // First Base Side
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 28, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 40, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 52, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 64, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 76, angleSpan: 12, covered: false, price: 'value' },
      
      // Third Base Side
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 284, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 296, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'lower', baseAngle: 308, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-113', name: 'Section 113', level: 'lower', baseAngle: 320, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'lower', baseAngle: 332, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 88, angleSpan: 40, covered: false, price: 'value' },
      { id: 'pool-beyond', name: 'Pool Beyond', level: 'ga', baseAngle: 128, angleSpan: 52, covered: false, price: 'value' },
      { id: 'left-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 180, angleSpan: 52, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club-seats', name: 'Club Level', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' },
      
      // Suites (Upper Level)
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 330, angleSpan: 60, covered: true, price: 'luxury' }
    ],
    notes: 'Opened 2019, features swimming pool in RF, oriented north'
  }
];

// AA Stadium Layouts
export const aaVenueLayouts: VenueLayout[] = [
  {
    venueId: 'akron-rubberducks',
    venueName: 'Canal Park',
    lastUpdated: '2024-01',
    sections: [
      // Infield Box
      { id: 'box-100', name: 'Box 100', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-101', name: 'Box 101', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-102', name: 'Box 102', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-103', name: 'Box 103', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-104', name: 'Box 104', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // First Base Reserved
      { id: 'res-105', name: 'Reserved 105', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-106', name: 'Reserved 106', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-107', name: 'Reserved 107', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-108', name: 'Reserved 108', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'value' },
      { id: 'res-109', name: 'Reserved 109', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },
      
      // Third Base Reserved
      { id: 'res-110', name: 'Reserved 110', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'res-111', name: 'Reserved 111', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'value' },
      { id: 'res-112', name: 'Reserved 112', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-113', name: 'Reserved 113', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'res-114', name: 'Reserved 114', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Bleachers
      { id: 'rf-bleacher', name: 'Right Field Bleachers', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'Left Field Bleachers', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      
      // Duck Row (Upper)
      { id: 'duck-row', name: 'Duck Row', level: 'upper', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Akron location, oriented east-northeast'
  },
  
  {
    venueId: 'birmingham-barons',
    venueName: 'Regions Field',
    lastUpdated: '2024-01',
    sections: [
      // Premium Seating
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 335, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 350, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 5, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 20, angleSpan: 15, covered: false, price: 'premium' },
      
      // Baseline Box
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 50, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 65, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 80, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 280, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 295, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 310, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-112', name: 'Section 112', level: 'lower', baseAngle: 325, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Outfield
      { id: 'rf-plaza', name: 'Right Field Plaza', level: 'ga', baseAngle: 95, angleSpan: 50, covered: false, price: 'value' },
      { id: 'bernie-brew', name: 'Bernie\'s Brewhouse', level: 'ga', baseAngle: 145, angleSpan: 35, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 215, angleSpan: 50, covered: false, price: 'value' },
      
      // Club Level
      { id: 'press-club', name: 'Press Box Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Birmingham with city skyline views, oriented north'
  }
];

// A+ Stadium Layouts (Sample)
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
  }
];

// Function to get venue layout by ID
export function getVenueLayout(venueId: string): VenueLayout | undefined {
  return [...aaaVenueLayouts, ...aaVenueLayouts, ...aPlusVenueLayouts]
    .find(layout => layout.venueId === venueId);
}

// Function to validate all angles are within 0-359 range
export function validateVenueLayout(layout: VenueLayout): string[] {
  const errors: string[] = [];
  
  layout.sections.forEach(section => {
    if (section.baseAngle < 0 || section.baseAngle >= 360) {
      errors.push(`${layout.venueName} - ${section.name}: Invalid baseAngle ${section.baseAngle}`);
    }
    
    if (section.angleSpan < 0 || section.angleSpan > 360) {
      errors.push(`${layout.venueName} - ${section.name}: Invalid angleSpan ${section.angleSpan}`);
    }
    
    // Check if section extends beyond 360 degrees
    const endAngle = (section.baseAngle + section.angleSpan) % 360;
    if (section.baseAngle + section.angleSpan > 360) {
      // This is OK as long as we handle wraparound correctly
      // Just note it for awareness
      console.log(`${layout.venueName} - ${section.name}: Wraps around 360° (${section.baseAngle}° + ${section.angleSpan}°)`);
    }
  });
  
  return errors;
}

// Export all layouts for easy access
export const allMilbLayouts = [
  ...aaaVenueLayouts,
  ...aaVenueLayouts,
  ...aPlusVenueLayouts
];