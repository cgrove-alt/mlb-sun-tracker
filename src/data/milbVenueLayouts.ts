// Venue-specific seating layouts for MiLB stadiums
// Consolidated file containing AAA and AA stadium layouts
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

// AAA Stadium Layouts (All AAA venues consolidated from multiple files)
export const aaaVenueLayouts: VenueLayout[] = [
  // Las Vegas Aviators - Las Vegas Ballpark
  {
    venueId: 'las-vegas-aviators',
    venueName: 'Las Vegas Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 292, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 284, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'party-deck', name: 'Party Deck', level: 'club', baseAngle: 52, angleSpan: 30, covered: true, price: 'moderate' },
      { id: 'home-run-porch', name: 'Home Run Porch', level: 'ga', baseAngle: 82, angleSpan: 40, covered: false, price: 'value' },
      { id: 'pool-area', name: 'Pool Area', level: 'club', baseAngle: 122, angleSpan: 30, covered: false, price: 'luxury' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 152, angleSpan: 60, covered: false, price: 'value' },
      { id: 'left-field-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 212, angleSpan: 40, covered: false, price: 'value' },
      { id: 'las-vegas-club', name: 'Las Vegas Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Desert ballpark with swimming pool, opened 2019 in Summerlin'
  },
  
  {
    venueId: 'durham-bulls',
    venueName: 'Durham Bulls Athletic Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 350, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 0, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 10, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 20, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 30, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 39, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 48, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 57, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 66, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 75, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 285, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 294, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 303, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 312, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 321, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-118', name: '118', level: 'field', baseAngle: 330, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 40, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 60, angleSpan: 20, covered: true, price: 'value' },
      { id: 'blue-monster', name: 'Blue Monster', level: 'club', baseAngle: 225, angleSpan: 30, covered: false, price: 'moderate' },
      { id: 'pnc-triangle-club', name: 'PNC Triangle Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'rf-picnic', name: 'Right Field Picnic Area', level: 'ga', baseAngle: 84, angleSpan: 40, covered: false, price: 'value' },
      { id: 'jackie-robinson-deck', name: 'Jackie Robinson Deck', level: 'ga', baseAngle: 124, angleSpan: 50, covered: false, price: 'value' },
      { id: 'tobacco-road-sports-cafe', name: 'Tobacco Road Sports Cafe', level: 'club', baseAngle: 270, angleSpan: 15, covered: true, price: 'moderate' }
    ],
    notes: 'Durham, NC, opened 1995, expanded to 10,000 capacity in 1998, features famous Blue Monster (32-ft left field wall), 360-degree ballpark, $16M brick construction'
  },
  
  {
    venueId: 'albuquerque-isotopes',
    venueName: 'Isotopes Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 305, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 290, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-311', name: 'Club 311', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'pepsi-porch', name: 'Pepsi Porch', level: 'club', baseAngle: 270, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'tecate-alta-terrace', name: 'Tecate Alta Terrace', level: 'club', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'tequila-herradura-fiesta-deck', name: 'Tequila Herradura Fiesta Deck', level: 'ga', baseAngle: 70, angleSpan: 25, covered: false, price: 'moderate' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 95, angleSpan: 85, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 235, angleSpan: 35, covered: false, price: 'value' }
    ],
    notes: 'High altitude (5,300 ft), oriented northeast'
  },
  
  {
    venueId: 'columbus-clippers',
    venueName: 'Huntington Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 20, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 32, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 44, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 56, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 68, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 80, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-10', name: '10', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-11', name: '11', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-12', name: '12', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-13', name: '13', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-14', name: '14', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-15', name: '15', level: 'field', baseAngle: 280, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-16', name: '16', level: 'field', baseAngle: 292, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-17', name: '17', level: 'field', baseAngle: 304, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-18', name: '18', level: 'field', baseAngle: 316, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-19', name: '19', level: 'field', baseAngle: 328, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-20', name: '20', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-27', name: '27', level: 'ga', baseAngle: 92, angleSpan: 20, covered: false, price: 'value' },
      { id: 'sec-28', name: '28', level: 'ga', baseAngle: 112, angleSpan: 20, covered: false, price: 'value' },
      { id: 'sec-29', name: '29', level: 'ga', baseAngle: 132, angleSpan: 20, covered: false, price: 'value' },
      { id: 'sec-30', name: '30', level: 'ga', baseAngle: 152, angleSpan: 20, covered: false, price: 'value' },
      { id: 'sec-31', name: '31', level: 'ga', baseAngle: 172, angleSpan: 20, covered: false, price: 'value' },
      { id: 'aep-power-pavilion', name: 'AEP Power Pavilion', level: 'club', baseAngle: 192, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'home-plate-club', name: 'The Home Plate Club', level: 'club', baseAngle: 345, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'left-field-building', name: 'Left Field Building', level: 'club', baseAngle: 242, angleSpan: 38, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Columbus in Arena District, opened 2009'
  },
  
  {
    venueId: 'el-paso-chihuahuas',
    venueName: 'Southwest University Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-10', name: '10', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-11', name: '11', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-12', name: '12', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-13', name: '13', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-14', name: '14', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-15', name: '15', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 320, angleSpan: 20, covered: true, price: 'value' },
      { id: 'weststar-club', name: 'WestStar Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'city-hall-grill', name: 'City Hall Grill', level: 'club', baseAngle: 270, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'santa-fe-pavilion', name: 'Santa Fe Pavilion', level: 'ga', baseAngle: 80, angleSpan: 35, covered: false, price: 'moderate' },
      { id: 'sun-kings-saloon', name: 'Sun Kings Saloon', level: 'ga', baseAngle: 115, angleSpan: 40, covered: false, price: 'value' },
      { id: 'tequila-cazadores-cantina', name: 'Tequila Cazadores Cantina', level: 'ga', baseAngle: 155, angleSpan: 40, covered: false, price: 'value' },
      { id: 'wooftop-deck', name: 'Wooftop Deck', level: 'ga', baseAngle: 195, angleSpan: 40, covered: false, price: 'value' },
      { id: 'mountainstar-suite', name: 'MountainStar Suite', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown El Paso with mountain views, opened 2014'
  },
  
  {
    venueId: 'gwinnett-stripers',
    venueName: 'Coolray Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 349, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 358, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 7, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 16, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 25, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 34, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 43, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 61, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 299, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 317, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 326, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 335, angleSpan: 5, covered: false, price: 'moderate' },
      { id: 'coca-cola-pavilion', name: 'Coca-Cola Pavilion', level: 'ga', baseAngle: 70, angleSpan: 40, covered: false, price: 'value' },
      { id: 'right-field-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 110, angleSpan: 50, covered: false, price: 'value' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 160, angleSpan: 60, covered: false, price: 'value' },
      { id: 'left-field-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 220, angleSpan: 50, covered: false, price: 'value' },
      { id: 'georgia-power-pavilion', name: 'Georgia Power Pavilion', level: 'club', baseAngle: 270, angleSpan: 29, covered: true, price: 'moderate' },
      { id: 'delta-sky360-club', name: 'Delta Sky360 Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'mercedes-benz-club', name: 'Mercedes-Benz Club', level: 'club', baseAngle: 10, angleSpan: 25, covered: true, price: 'luxury' }
    ],
    notes: 'Lawrenceville, GA - suburban Atlanta location'
  },
  
  {
    venueId: 'indianapolis-indians',
    venueName: 'Victory Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 68, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 76, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 84, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 276, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 284, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 292, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-118', name: '118', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-119', name: '119', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-120', name: '120', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-121', name: '121', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-122', name: '122', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 92, angleSpan: 88, covered: false, price: 'value' },
      { id: 'elements-financial-club', name: 'Elements Financial Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'knot-hole-gang', name: 'Knot Hole Gang', level: 'ga', baseAngle: 240, angleSpan: 36, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Indianapolis, rated best MiLB ballpark experience'
  },
  
  {
    venueId: 'iowa-cubs',
    venueName: 'Principal Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'budweiser-club', name: 'Budweiser Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'skybox-suites', name: 'BMW of Des Moines Skybox Suites', level: 'suite', baseAngle: 10, angleSpan: 40, covered: true, price: 'luxury' },
      { id: 'left-field-building', name: 'Left Field Building', level: 'club', baseAngle: 240, angleSpan: 40, covered: true, price: 'moderate' }
    ],
    notes: 'Confluence of rivers location, renovated 2004'
  },
  
  {
    venueId: 'jacksonville-jumbo-shrimp',
    venueName: '121 Financial Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 280, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 270, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-118', name: '118', level: 'ga', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'sec-119', name: '119', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'sec-120', name: '120', level: 'ga', baseAngle: 240, angleSpan: 30, covered: false, price: 'value' },
      { id: 'skyboxes', name: 'Luxury Skyboxes', level: 'suite', baseAngle: 350, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'skydecks', name: 'Skydecks', level: 'club', baseAngle: 20, angleSpan: 40, covered: true, price: 'luxury' },
      { id: 'grass-berm', name: 'Grass Berm', level: 'berm', baseAngle: 140, angleSpan: 100, covered: false, price: 'value' }
    ],
    notes: 'Downtown Jacksonville, renovated 2017 with modern amenities'
  },
  
  {
    venueId: 'lehigh-valley-ironpigs',
    venueName: 'Coca-Cola Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-118', name: '118', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-119', name: '119', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-120', name: '120', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'bacon-strip', name: 'The Bacon Strip', level: 'ga', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'pig-pen', name: 'Pig Pen', level: 'ga', baseAngle: 280, angleSpan: 30, covered: false, price: 'value' },
      { id: 'grass-berm', name: 'Grass Berm', level: 'berm', baseAngle: 90, angleSpan: 90, covered: false, price: 'value' },
      { id: 'dugout-suites', name: 'Dugout Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'club', baseAngle: 240, angleSpan: 40, covered: false, price: 'moderate' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' }
    ],
    notes: 'Allentown, PA - known for Bacon USA concession stand'
  },
  
  {
    venueId: 'louisville-bats',
    venueName: 'Louisville Slugger Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 305, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      { id: 'jim-beam-bourbon-bar', name: 'Jim Beam Bourbon Bar', level: 'club', baseAngle: 55, angleSpan: 25, covered: false, price: 'moderate' },
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 80, angleSpan: 40, covered: false, price: 'value' },
      { id: 'budweiser-berm', name: 'Budweiser Berm', level: 'berm', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'left-field-lounge', name: 'Left Field Lounge', level: 'ga', baseAngle: 240, angleSpan: 40, covered: false, price: 'value' },
      { id: 'champions-club', name: 'Champions Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Louisville on Ohio River, opened 2000'
  },
  
  {
    venueId: 'memphis-redbirds',
    venueName: 'AutoZone Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 349, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 358, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 6, angleSpan: 9, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 15, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 24, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 33, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 42, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 51, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 310, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 319, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 328, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 337, angleSpan: 3, covered: false, price: 'moderate' },
      { id: 'dugout-box-a', name: 'Dugout Box A', level: 'field', baseAngle: 20, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'dugout-box-b', name: 'Dugout Box B', level: 'field', baseAngle: 330, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'bluff', name: 'The Bluff', level: 'ga', baseAngle: 70, angleSpan: 50, covered: false, price: 'value' },
      { id: 'toyota-terrace', name: 'Toyota Terrace', level: 'club', baseAngle: 240, angleSpan: 60, covered: false, price: 'moderate' },
      { id: 'home-plate-club', name: 'Home Plate Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'autozone-deck', name: 'AutoZone Deck', level: 'ga', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 0, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Memphis, classic brick design, opened 2000'
  },
  
  {
    venueId: 'nashville-sounds',
    venueName: 'First Horizon Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'club', baseAngle: 340, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'sec-202', name: '202', level: 'club', baseAngle: 355, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'sec-203', name: '203', level: 'club', baseAngle: 10, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'sec-204', name: '204', level: 'club', baseAngle: 25, angleSpan: 15, covered: true, price: 'luxury' },
      { id: 'the-band-box', name: 'The Band Box', level: 'ga', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'right-field-porch', name: 'Right Field Porch', level: 'ga', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'guitar-scoreboard', name: 'Guitar Scoreboard Deck', level: 'ga', baseAngle: 130, angleSpan: 50, covered: false, price: 'value' },
      { id: 'left-field-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 230, angleSpan: 50, covered: false, price: 'value' },
      { id: 'jack-daniels-club', name: 'Jack Daniels Club', level: 'club', baseAngle: 280, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'first-tennessee-club', name: 'First Tennessee Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Nashville with guitar-shaped scoreboard, opened 2015'
  },
  
  {
    venueId: 'norfolk-tides',
    venueName: 'Harbor Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 296, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      { id: 'picnic-plaza', name: 'Picnic Plaza', level: 'ga', baseAngle: 64, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 104, angleSpan: 40, covered: false, price: 'moderate' },
      { id: 'hits-at-the-park', name: 'Hits at the Park', level: 'ga', baseAngle: 216, angleSpan: 40, covered: false, price: 'value' },
      { id: 'left-field-landing', name: 'Left Field Landing', level: 'ga', baseAngle: 256, angleSpan: 40, covered: false, price: 'value' },
      { id: 'plaza-club', name: 'Plaza Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'harbor-club', name: 'Harbor Club', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Norfolk on Elizabeth River, skyline views'
  },
  
  {
    venueId: 'oklahoma-city-dodgers',
    venueName: 'Chickasaw Bricktown Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 304, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 316, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 328, angleSpan: 12, covered: true, price: 'value' },
      { id: 'corona-beach-house', name: 'Corona Beach House', level: 'ga', baseAngle: 64, angleSpan: 46, covered: false, price: 'value' },
      { id: 'center-field-plaza', name: 'Center Field Plaza', level: 'ga', baseAngle: 110, angleSpan: 70, covered: false, price: 'value' },
      { id: 'left-field-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 260, angleSpan: 40, covered: false, price: 'value' },
      { id: 'oil-derrick-club', name: 'Oil Derrick Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Bricktown entertainment district, opened 1998'
  },
  
  {
    venueId: 'omaha-storm-chasers',
    venueName: 'Werner Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'home-run-hill', name: 'Home Run Hill', level: 'berm', baseAngle: 70, angleSpan: 50, covered: false, price: 'value' },
      { id: 'outfield-terrace', name: 'Outfield Terrace', level: 'ga', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'left-field-deck', name: 'Left Field Deck', level: 'ga', baseAngle: 240, angleSpan: 60, covered: false, price: 'value' },
      { id: 'werner-enterprises-club', name: 'Werner Enterprises Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'corporate-suites', name: 'Corporate Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Papillion, NE (Omaha suburb), opened 2011'
  },
  
  {
    venueId: 'reno-aces',
    venueName: 'Greater Nevada Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'lower', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'lower', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'lower', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'lower', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'lower', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'freight-house-district', name: 'Freight House District', level: 'ga', baseAngle: 60, angleSpan: 50, covered: false, price: 'value' },
      { id: 'aces-alley', name: 'Aces Alley', level: 'ga', baseAngle: 110, angleSpan: 70, covered: false, price: 'value' },
      { id: 'party-zone', name: 'Party Zone', level: 'ga', baseAngle: 250, angleSpan: 60, covered: false, price: 'moderate' },
      { id: 'sk-baseball-club', name: 'SK Baseball Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Reno, opened 2009 with mountain views'
  },
  
  {
    venueId: 'rochester-red-wings',
    venueName: 'Innovative Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      { id: 'right-field-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'kodak-picnic-area', name: 'Kodak Picnic Area', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'left-field-terrace', name: 'Left Field Terrace', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      { id: 'frontier-field-club', name: 'Frontier Field Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Rochester, renovated 2021'
  },
  
  {
    venueId: 'round-rock-express',
    venueName: 'Dell Diamond',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      { id: 'rock-porch', name: 'Rock Porch', level: 'ga', baseAngle: 64, angleSpan: 46, covered: false, price: 'value' },
      { id: 'fun-zone', name: 'Fun Zone', level: 'ga', baseAngle: 110, angleSpan: 50, covered: false, price: 'value' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 160, angleSpan: 80, covered: false, price: 'value' },
      { id: 'home-run-porch', name: 'Home Run Porch', level: 'ga', baseAngle: 240, angleSpan: 40, covered: false, price: 'value' },
      { id: 'united-heritage-center-club', name: 'United Heritage Center Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Round Rock, TX (Austin suburb), opened 2000, AAA affiliate of Texas Rangers, famous for close-up views (backstop 55ft from home plate vs 60ft 6in to mound), 11,631 capacity, state-of-the-art HD LED boards installed 2024'
  },
  
  {
    venueId: 'salt-lake-bees',
    venueName: 'Smith\'s Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 305, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      { id: 'outfield-plaza', name: 'Outfield Plaza', level: 'ga', baseAngle: 70, angleSpan: 50, covered: false, price: 'value' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 120, angleSpan: 90, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'ga', baseAngle: 240, angleSpan: 60, covered: false, price: 'moderate' },
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Salt Lake City with mountain views, high altitude'
  },
  
  {
    venueId: 'scranton-railriders',
    venueName: 'PNC Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'club', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-202', name: '202', level: 'club', baseAngle: 0, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-203', name: '203', level: 'club', baseAngle: 20, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'mohegan-sun-terrace', name: 'Mohegan Sun Terrace', level: 'ga', baseAngle: 70, angleSpan: 40, covered: false, price: 'value' },
      { id: 'budweiser-party-pavilion', name: 'Budweiser Party Pavilion', level: 'ga', baseAngle: 110, angleSpan: 70, covered: false, price: 'moderate' },
      { id: 'left-field-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 240, angleSpan: 60, covered: false, price: 'value' },
      { id: 'pinstripe-club', name: 'Pinstripe Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Moosic, PA (near Scranton), opened 2013'
  },
  
  {
    venueId: 'st-paul-saints',
    venueName: 'CHS Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'treasure-island', name: 'Treasure Island', level: 'suite', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'lowertown-landing', name: 'Lowertown Landing', level: 'ga', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'green-roof', name: 'Green Roof', level: 'ga', baseAngle: 100, angleSpan: 80, covered: false, price: 'value' },
      { id: 'left-field-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 240, angleSpan: 70, covered: false, price: 'value' },
      { id: 'capital-view-club', name: 'Capital View Club', level: 'club', baseAngle: 0, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Lowertown St. Paul, opened 2015, downtown skyline views'
  },
  
  {
    venueId: 'sugar-land-space-cowboys',
    venueName: 'Constellation Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'club', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-202', name: '202', level: 'club', baseAngle: 0, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'sec-203', name: '203', level: 'club', baseAngle: 20, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'imperial-suites', name: 'Imperial Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'ob-brewery-deck', name: 'OB Brewery Deck', level: 'ga', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'home-run-alley', name: 'Home Run Alley', level: 'ga', baseAngle: 100, angleSpan: 80, covered: false, price: 'value' },
      { id: 'left-field-corner', name: 'Left Field Corner', level: 'ga', baseAngle: 260, angleSpan: 50, covered: false, price: 'value' },
      { id: 'insperity-club', name: 'Insperity Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Sugar Land, TX (Houston suburb), opened 2012'
  },
  
  {
    venueId: 'syracuse-mets',
    venueName: 'NBT Bank Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 305, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 320, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      { id: 'outback-steakhouse-picnic-pavilion', name: 'Outback Steakhouse Picnic Pavilion', level: 'ga', baseAngle: 70, angleSpan: 40, covered: false, price: 'value' },
      { id: 'salt-city-deck', name: 'Salt City Deck', level: 'ga', baseAngle: 110, angleSpan: 70, covered: false, price: 'value' },
      { id: 'left-field-wall', name: 'Left Field Wall', level: 'ga', baseAngle: 260, angleSpan: 40, covered: false, price: 'value' },
      { id: 'hank-sauer-room', name: 'Hank Sauer Room', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ],
    notes: 'Syracuse, NY, renovated 2010'
  },
  
  {
    venueId: 'tacoma-rainiers',
    venueName: 'Cheney Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-10', name: '10', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-11', name: '11', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-12', name: '12', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-13', name: '13', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-14', name: '14', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-15', name: '15', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-16', name: '16', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-17', name: '17', level: 'upper', baseAngle: 320, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sandstone-point', name: 'Sandstone Point', level: 'ga', baseAngle: 70, angleSpan: 50, covered: false, price: 'value' },
      { id: 'left-field-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 250, angleSpan: 50, covered: false, price: 'value' },
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'mt-rainier-deck', name: 'Mt. Rainier Deck', level: 'ga', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'suites', name: 'Suites', level: 'suite', baseAngle: 10, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Tacoma, WA, historic stadium opened 1960'
  },
  
  {
    venueId: 'toledo-mud-hens',
    venueName: 'Fifth Third Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      { id: 'roost', name: 'The Roost', level: 'ga', baseAngle: 64, angleSpan: 46, covered: false, price: 'value' },
      { id: 'fleetwood-tap-room', name: 'Fleetwood Tap Room', level: 'club', baseAngle: 260, angleSpan: 40, covered: true, price: 'moderate' },
      { id: 'holy-toledo-tavern', name: 'Holy Toledo Tavern', level: 'club', baseAngle: 110, angleSpan: 50, covered: false, price: 'moderate' },
      { id: 'huntington-club', name: 'Huntington Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'miller-lite-landing', name: 'Miller Lite Landing', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' }
    ],
    notes: 'Downtown Toledo on Maumee River, opened 2002'
  },

  {
    venueId: 'buffalo-bisons',
    venueName: 'Sahlen Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-123', name: '123', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-124', name: '124', level: 'field', baseAngle: 284, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 64, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 296, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-211', name: '211', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-212', name: '212', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      { id: 'coca-cola-field-club', name: 'Coca-Cola Field Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'bully-hill-deck', name: 'The Bully Hill Party Deck', level: 'club', baseAngle: 76, angleSpan: 35, covered: false, price: 'moderate' },
      { id: 'pub-at-the-park', name: 'Pub at the Park', level: 'club', baseAngle: 270, angleSpan: 20, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Buffalo, highest-capacity Triple-A ballpark (16,600)'
  },

  {
    venueId: 'charlotte-knights',
    venueName: 'Truist Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 29, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 38, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 47, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 56, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 304, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 313, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 322, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 331, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 353, angleSpan: 14, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 7, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 20, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 33, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 46, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 59, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 72, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 85, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 98, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-211', name: '211', level: 'upper', baseAngle: 111, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-212', name: '212', level: 'upper', baseAngle: 124, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-213', name: '213', level: 'upper', baseAngle: 137, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-214', name: '214', level: 'upper', baseAngle: 223, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-215', name: '215', level: 'upper', baseAngle: 236, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-216', name: '216', level: 'upper', baseAngle: 249, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-217', name: '217', level: 'upper', baseAngle: 262, angleSpan: 14, covered: true, price: 'value' },
      { id: 'sec-218', name: '218', level: 'upper', baseAngle: 276, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-219', name: '219', level: 'upper', baseAngle: 289, angleSpan: 13, covered: true, price: 'value' },
      { id: 'belfor-dugout-suites', name: 'BELFOR Dugout Suites', level: 'suite', baseAngle: 319, angleSpan: 21, covered: true, price: 'luxury' },
      { id: 'knights-castle', name: 'Knights Castle', level: 'ga', baseAngle: 149, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-terrace', name: 'Picnic Terrace', level: 'ga', baseAngle: 179, angleSpan: 44, covered: false, price: 'value' },
      { id: 'skyline-beer-garden', name: 'Skyline Beer Garden', level: 'club', baseAngle: 65, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Charlotte with city skyline views, opened 2014'
  },

  {
    venueId: 'durham-bulls',
    venueName: 'Durham Bulls Athletic Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Durham Bulls Athletic Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Durham Bulls Athletic Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Durham Bulls Athletic Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Durham Bulls Athletic Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Durham Bulls Athletic Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Made famous by Bull Durham movie, iconic snorting bull, opened 1995'
  },

  {
    venueId: 'norfolk-tides',
    venueName: 'Harbor Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Harbor Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Harbor Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Harbor Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Harbor Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Harbor Park Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Norfolk Southern Right Field Pavilion', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' },
      { id: 'unique-3', name: 'Wells Fargo Picnic Area', level: 'club', baseAngle: 275, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Norfolk waterfront with harbor views, opened 1993'
  },


  {
    venueId: 'fresno-grizzlies',
    venueName: 'Chukchansi Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 351, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 2, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 13, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 24, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 35, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 46, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 57, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 68, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 79, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 90, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 270, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 277.77777777777777, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 285.55555555555554, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 293.3333333333333, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 301.1111111111111, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 308.8888888888889, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-118', name: '118', level: 'field', baseAngle: 316.6666666666667, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-119', name: '119', level: 'field', baseAngle: 324.44444444444446, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-120', name: '120', level: 'field', baseAngle: 332.22222222222223, angleSpan: 8, covered: false, price: 'value' },
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'luxury-suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 40, covered: true, price: 'luxury' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Downtown Fresno, mountain views beyond outfield'
  },

  {
    venueId: 'indianapolis-indians',
    venueName: 'Victory Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'premium-1', name: 'Victory Premium 1', level: 'field', baseAngle: 340, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-2', name: 'Victory Premium 2', level: 'field', baseAngle: 355, angleSpan: 15, covered: true, price: 'premium' },
      { id: 'premium-3', name: 'Victory Premium 3', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'premium-4', name: 'Victory Premium 4', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 25, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 38, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 51, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 64, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 77, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 282, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 295, angleSpan: 13, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 321, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 334, angleSpan: 13, covered: false, price: 'moderate' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'cf-seats', name: 'Center Field Seats', level: 'ga', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      { id: 'unique-1', name: 'Victory Club', level: 'club', baseAngle: 95, angleSpan: 35, covered: true, price: 'luxury' },
      { id: 'unique-2', name: 'Party Deck', level: 'club', baseAngle: 185, angleSpan: 35, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Indianapolis with city skyline views, opened 1996'
  },
  {
    venueId: 'durham-bulls',
    venueName: 'Durham Bulls Athletic Park',
    lastUpdated: '2024-01',
    sections: [
      // Diamond View Box Seats
      { id: 'dvb-101', name: 'Diamond View Box 101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dvb-102', name: 'Diamond View Box 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dvb-103', name: 'Diamond View Box 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dvb-104', name: 'Diamond View Box 104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'dvb-105', name: 'Diamond View Box 105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Infield Box Seats
      { id: 'ib-106', name: 'Infield Box 106', level: 'lower', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-107', name: 'Infield Box 107', level: 'lower', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-108', name: 'Infield Box 108', level: 'lower', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-109', name: 'Infield Box 109', level: 'lower', baseAngle: 60, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-110', name: 'Infield Box 110', level: 'lower', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Third Base Side
      { id: 'ib-111', name: 'Infield Box 111', level: 'lower', baseAngle: 290, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-112', name: 'Infield Box 112', level: 'lower', baseAngle: 300, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-113', name: 'Infield Box 113', level: 'lower', baseAngle: 310, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-114', name: 'Infield Box 114', level: 'lower', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'ib-115', name: 'Infield Box 115', level: 'lower', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Outfield Reserved
      { id: 'or-201', name: 'Outfield Reserved 201', level: 'lower', baseAngle: 80, angleSpan: 15, covered: false, price: 'value' },
      { id: 'or-202', name: 'Outfield Reserved 202', level: 'lower', baseAngle: 95, angleSpan: 15, covered: false, price: 'value' },
      { id: 'or-203', name: 'Outfield Reserved 203', level: 'lower', baseAngle: 265, angleSpan: 15, covered: false, price: 'value' },
      { id: 'or-204', name: 'Outfield Reserved 204', level: 'lower', baseAngle: 280, angleSpan: 15, covered: false, price: 'value' },
      
      // Blue Monster (Left Field Wall)
      { id: 'blue-monster', name: 'Blue Monster', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' },
      
      // Club Level
      { id: 'capitol-club', name: 'Capitol Broadcasting Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' },
      
      // Suites
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 320, angleSpan: 60, covered: true, price: 'luxury' }
    ],
    notes: 'Historic DBAP, features Blue Monster wall in LF, oriented north'
  },
  
  {
    venueId: 'buffalo-bisons',
    venueName: 'Sahlen Field',
    lastUpdated: '2024-01',
    sections: [
      // Field Level Box
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 335, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 346, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 357, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 8, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 19, angleSpan: 11, covered: false, price: 'premium' },
      
      // 100 Level
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 90, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 270, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-112', name: 'Section 112', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-113', name: 'Section 113', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-114', name: 'Section 114', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-115', name: 'Section 115', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-116', name: 'Section 116', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },
      
      // 200 Level (Upper Deck)
      { id: 'sec-200', name: 'Section 200', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-201', name: 'Section 201', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-202', name: 'Section 202', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-203', name: 'Section 203', level: 'upper', baseAngle: 40, angleSpan: 20, covered: true, price: 'value' },
      
      // Bison Berm (Outfield)
      { id: 'berm', name: 'Bison Berm', level: 'berm', baseAngle: 135, angleSpan: 90, covered: false, price: 'value' },
      
      // Club Level
      { id: 'club-seats', name: 'Club Seats', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Buffalo location, upper deck provides cover, oriented northeast'
  },
  
  {
    venueId: 'charlotte-knights',
    venueName: 'Truist Field',
    lastUpdated: '2024-01',
    sections: [
      // Dugout Box
      { id: 'db-101', name: 'Dugout Box 101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'db-102', name: 'Dugout Box 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'db-103', name: 'Dugout Box 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'db-104', name: 'Dugout Box 104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'db-105', name: 'Dugout Box 105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Infield Box
      { id: 'ib-106', name: 'Infield Box 106', level: 'lower', baseAngle: 30, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-107', name: 'Infield Box 107', level: 'lower', baseAngle: 42, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-108', name: 'Infield Box 108', level: 'lower', baseAngle: 54, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-109', name: 'Infield Box 109', level: 'lower', baseAngle: 66, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-110', name: 'Infield Box 110', level: 'lower', baseAngle: 78, angleSpan: 12, covered: false, price: 'value' },
      
      { id: 'ib-111', name: 'Infield Box 111', level: 'lower', baseAngle: 282, angleSpan: 12, covered: false, price: 'value' },
      { id: 'ib-112', name: 'Infield Box 112', level: 'lower', baseAngle: 294, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-113', name: 'Infield Box 113', level: 'lower', baseAngle: 306, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-114', name: 'Infield Box 114', level: 'lower', baseAngle: 318, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'ib-115', name: 'Infield Box 115', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Outfield Reserved
      { id: 'or-201', name: 'Outfield Reserved 201', level: 'lower', baseAngle: 90, angleSpan: 20, covered: false, price: 'value' },
      { id: 'or-202', name: 'Outfield Reserved 202', level: 'lower', baseAngle: 110, angleSpan: 20, covered: false, price: 'value' },
      { id: 'or-203', name: 'Outfield Reserved 203', level: 'lower', baseAngle: 250, angleSpan: 20, covered: false, price: 'value' },
      { id: 'or-204', name: 'Outfield Reserved 204', level: 'lower', baseAngle: 270, angleSpan: 20, covered: false, price: 'value' },
      
      // Knights Deck (RF)
      { id: 'knights-deck', name: 'Knights Deck', level: 'ga', baseAngle: 130, angleSpan: 50, covered: false, price: 'value' },
      
      // Skyline View (CF)
      { id: 'skyline', name: 'Skyline View', level: 'berm', baseAngle: 180, angleSpan: 40, covered: false, price: 'value' },
      
      // Club Level
      { id: 'crown-club', name: 'Crown Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' },
      
      // Suites
      { id: 'suite-level', name: 'Suite Level', level: 'suite', baseAngle: 330, angleSpan: 60, covered: true, price: 'luxury' }
    ],
    notes: 'Uptown Charlotte with city skyline views, oriented northeast'
  }
];

// AA Stadium Layouts (All AA venues consolidated from multiple files) 
export const aaVenueLayouts: VenueLayout[] = [
  // Existing 6 stadiums from previous files would be imported here
  // Adding the remaining 22 AA stadiums:
  
  {
    venueId: 'altoona-curve',
    venueName: 'Peoples Natural Gas Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 28, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 40, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 52, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 64, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 76, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 106, angleSpan: 20, covered: false, price: 'value' },
      { id: 'rail-kings-club', name: 'Rail Kings Club', level: 'club', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Altoona, PA with Skyliner roller coaster beyond RF wall, Allegheny Mountains backdrop, double-deck design, 7,210 capacity'
  },
  
  {
    venueId: 'amarillo-sod-poodles',
    venueName: 'HODGETOWN',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 355, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 5, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 15, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 25, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 35, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 75, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 115, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'dusters-club', name: 'Dusters Club', level: 'club', baseAngle: 5, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Amarillo, opened 2019, modern design, 6,631 capacity with 360-degree concourse'
  },
  
  {
    venueId: 'arkansas-travelers',
    venueName: 'Dickey-Stephens Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 40, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'North Little Rock on Arkansas River, opened 2007, 7,300 capacity (5,800 fixed seats + 1,500 berm), features Arkansas River views'
  },
  
  {
    venueId: 'biloxi-shuckers',
    venueName: 'Keesler Federal Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 350, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 20, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 30, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 10, covered: false, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 100, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'suites', name: 'Suites', level: 'suite', baseAngle: 350, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Biloxi waterfront, opened 2015, renamed Keesler Federal Park in 2024, single-level seating foul pole to foul pole, 6,067 capacity with beach theme'
  },
  
  {
    venueId: 'binghamton-rumble-ponies',
    venueName: 'Mirabito Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 300, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 315, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 330, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 345, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 0, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 15, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 30, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 45, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 60, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-10', name: '10', level: 'upper', baseAngle: 300, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-11', name: '11', level: 'upper', baseAngle: 315, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-12', name: '12', level: 'upper', baseAngle: 330, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-13', name: '13', level: 'upper', baseAngle: 345, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-14', name: '14', level: 'upper', baseAngle: 0, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-15', name: '15', level: 'upper', baseAngle: 15, angleSpan: 15, covered: false, price: 'value' },
      { id: 'ga', name: 'General Admission', level: 'upper', baseAngle: 75, angleSpan: 45, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Binghamton, NY, classic ballpark opened 1992, intimate 6,012 capacity with traditional grandstand design'
  },
  
  {
    venueId: 'bowie-baysox',
    venueName: 'Prince George\'s Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'value' },
      { id: 'grass-hill', name: 'Grass Hill', level: 'berm', baseAngle: 80, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Bowie, MD between Baltimore and Washington, opened 1994, 10,000 capacity, famous for grass hill berm seating'
  },
  
  {
    venueId: 'chattanooga-lookouts',
    venueName: 'AT&T Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 105, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 115, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 125, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 135, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 145, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 155, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 85, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 95, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 105, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 115, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 125, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 135, angleSpan: 10, covered: true, price: 'value' },
      { id: 'ga-lawn', name: 'GA Lawn', level: 'berm', baseAngle: 165, angleSpan: 30, covered: false, price: 'value' },
      { id: 'lookouts-landing', name: 'Lookouts Landing', level: 'field', baseAngle: 195, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'moon-deck', name: 'Moon Deck', level: 'field', baseAngle: 215, angleSpan: 15, covered: false, price: 'premium' }
    ],
    notes: 'Downtown Chattanooga on Tennessee River, opened 2000, 6,160 capacity, scenic riverfront location with downtown skyline views'
  },
  
  {
    venueId: 'corpus-christi-hooks',
    venueName: 'Whataburger Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'grass-berm', name: 'Grass Berm', level: 'berm', baseAngle: 40, angleSpan: 40, covered: false, price: 'value' },
      { id: 'bay-deck', name: 'Bay Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'whataburger-club', name: 'Whataburger Club', level: 'club', baseAngle: 330, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Corpus Christi Bay waterfront location'
  },
  
  {
    venueId: 'erie-seawolves',
    venueName: 'UPMC Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 325, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 355, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 325, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 100, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 130, angleSpan: 15, covered: true, price: 'moderate' }
    ],
    notes: 'Downtown Erie with Lake Erie views'
  },
  
  {
    venueId: 'frisco-roughriders',
    venueName: 'Riders Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 68, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 76, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 84, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 92, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 100, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 108, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 20, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 28, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 36, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 44, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 52, angleSpan: 8, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 60, angleSpan: 8, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 68, angleSpan: 8, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 76, angleSpan: 8, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 116, angleSpan: 40, covered: false, price: 'value' },
      { id: 'lazy-river', name: 'Lazy River', level: 'field', baseAngle: 156, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'bull-moose-saloon', name: 'Bull Moose Saloon', level: 'field', baseAngle: 176, angleSpan: 15, covered: false, price: 'moderate' }
    ],
    notes: 'Frisco, TX (Dallas suburb), opened 2003'
  },
  
  {
    venueId: 'hartford-yard-goats',
    venueName: 'Dunkin\' Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'bleachers', name: 'Bleachers', level: 'field', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 120, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Hartford, opened 2017'
  },
  
  {
    venueId: 'midland-rockhounds',
    venueName: 'Momentum Bank Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 40, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 80, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Midland, TX, opened 2002'
  },
  
  {
    venueId: 'montgomery-biscuits',
    venueName: 'Riverwalk Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'biscuit-basket', name: 'Biscuit Basket', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'value' },
      { id: 'riverwalk', name: 'Riverwalk', level: 'field', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'max-capital-club', name: 'MAX Capital Club', level: 'club', baseAngle: 330, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Montgomery on Alabama River'
  },
  
  {
    venueId: 'new-hampshire-fisher-cats',
    venueName: 'Delta Dental Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 105, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-200', name: '200', level: 'upper', baseAngle: 25, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 35, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 45, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 55, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 65, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 75, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 115, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 130, angleSpan: 15, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 145, angleSpan: 30, covered: false, price: 'value' },
      { id: 'hotel-deck', name: 'Hotel Deck', level: 'upper', baseAngle: 175, angleSpan: 15, covered: false, price: 'premium' }
    ],
    notes: 'Manchester, NH along Merrimack River'
  },
  
  {
    venueId: 'northwest-arkansas-naturals',
    venueName: 'Arvest Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 50, angleSpan: 40, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Springdale, AR in Northwest Arkansas region'
  },
  
  {
    venueId: 'pensacola-blue-wahoos',
    venueName: 'Blue Wahoos Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 195, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 205, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 215, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 225, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 235, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 245, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 255, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 265, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 195, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 205, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 215, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 225, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 235, angleSpan: 10, covered: true, price: 'value' },
      { id: 'bay-deck', name: 'Bay Deck', level: 'field', baseAngle: 275, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'ga-hill', name: 'GA Hill', level: 'berm', baseAngle: 295, angleSpan: 25, covered: false, price: 'value' },
      { id: 'hancock-whitney-club', name: 'Hancock Whitney Club', level: 'club', baseAngle: 215, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Pensacola on Pensacola Bay waterfront'
  },
  
  {
    venueId: 'reading-fightin-phils',
    venueName: 'FirstEnergy Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-1', name: '1', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-2', name: '2', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-3', name: '3', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-10', name: '10', level: 'field', baseAngle: 110, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-11', name: '11', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-12', name: '12', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-13', name: '13', level: 'upper', baseAngle: 40, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-14', name: '14', level: 'upper', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-15', name: '15', level: 'upper', baseAngle: 60, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-16', name: '16', level: 'upper', baseAngle: 70, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 120, angleSpan: 40, covered: false, price: 'value' },
      { id: 'pool-pavilion', name: 'Pool Pavilion', level: 'field', baseAngle: 160, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'picnic-patio', name: 'Picnic Patio', level: 'field', baseAngle: 180, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Reading, PA, features swimming pool beyond RF wall'
  },
  
  {
    venueId: 'rocket-city-trash-pandas',
    venueName: 'Toyota Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'moon-deck', name: 'Moon Deck', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'junkyard', name: 'The Junkyard', level: 'berm', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'sprocket', name: 'Sprocket', level: 'field', baseAngle: 100, angleSpan: 15, covered: false, price: 'premium' }
    ],
    notes: 'Madison, AL (Huntsville area), opened 2021'
  },
  
  {
    venueId: 'san-antonio-missions',
    venueName: 'Nelson W. Wolff Municipal Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 25, angleSpan: 40, covered: false, price: 'value' },
      { id: 'ballapenos', name: 'Ballapenos', level: 'field', baseAngle: 65, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'San Antonio, TX, classic ballpark design'
  },
  
  {
    venueId: 'somerset-patriots',
    venueName: 'TD Bank Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'ga-lawn', name: 'GA Lawn', level: 'berm', baseAngle: 25, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 55, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 75, angleSpan: 15, covered: false, price: 'moderate' }
    ],
    notes: 'Bridgewater, NJ, Yankees AA affiliate'
  },
  
  {
    venueId: 'springfield-cardinals',
    venueName: 'Hammons Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 280, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 280, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 290, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 300, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'redbird-roost', name: 'Redbird Roost', level: 'field', baseAngle: 40, angleSpan: 20, covered: false, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Springfield, MO, downtown location'
  },
  
  {
    venueId: 'tulsa-drillers',
    venueName: 'ONEOK Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'oil-derrick', name: 'Oil Derrick', level: 'field', baseAngle: 50, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'outfield-reserved', name: 'Outfield Reserved', level: 'field', baseAngle: 70, angleSpan: 30, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 100, angleSpan: 20, covered: false, price: 'value' }
    ],
    notes: 'Downtown Tulsa in Greenwood District, opened 2010'
  },
  
  {
    venueId: 'wichita-wind-surge',
    venueName: 'Riverfront Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'value' },
      { id: 'left-field-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 80, angleSpan: 30, covered: false, price: 'value' },
      { id: 'zamboozy', name: 'Zamboozy', level: 'field', baseAngle: 110, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 130, angleSpan: 15, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Wichita on Arkansas River, opened 2021'
  },

  {
    venueId: 'richmond-flying-squirrels',
    venueName: 'The Diamond',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 320, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 330, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 340, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 350, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 0, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 10, angleSpan: 10, covered: false, price: 'value' },
      { id: 'ga-left', name: 'GA Left Field', level: 'field', baseAngle: 60, angleSpan: 30, covered: false, price: 'value' },
      { id: 'ga-right', name: 'GA Right Field', level: 'field', baseAngle: 270, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 90, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Richmond, VA, classic ballpark originally built in 1985'
  },

  {
    venueId: 'harrisburg-senators',
    venueName: 'FNB Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 220, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 235, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 250, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 265, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 280, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 295, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 310, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 220, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 235, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 250, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 265, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 280, angleSpan: 15, covered: false, price: 'value' },
      { id: 'outfield-reserved', name: 'Outfield Reserved', level: 'field', baseAngle: 325, angleSpan: 20, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 345, angleSpan: 20, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' }
    ],
    notes: 'Harrisburg City Island on Susquehanna River, opened 1987'
  },

  {
    venueId: 'portland-sea-dogs',
    venueName: 'Hadlock Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 285, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 285, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 295, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 305, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 315, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 325, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      { id: 'maine-monster', name: 'Maine Monster', level: 'field', baseAngle: 25, angleSpan: 20, covered: false, price: 'value' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 45, angleSpan: 20, covered: false, price: 'moderate' },
      { id: 'sea-dog-suites', name: 'Sea Dog Suites', level: 'suite', baseAngle: 295, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Portland, ME with mini Green Monster replica wall, opened 1994'
  },

  {
    venueId: 'akron-rubberducks',
    venueName: 'Canal Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 355, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 70, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 85, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 100, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 115, angleSpan: 15, covered: false, price: 'value' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 355, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 10, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 25, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 40, angleSpan: 15, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 55, angleSpan: 15, covered: true, price: 'value' },
      { id: 'duck-pond', name: 'Duck Pond', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'value' },
      { id: 'suites', name: 'Suites', level: 'suite', baseAngle: 340, angleSpan: 70, covered: true, price: 'luxury' }
    ],
    notes: 'Downtown Akron location, oriented east-northeast'
  },

  {
    venueId: 'birmingham-barons',
    venueName: 'Regions Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Outfield Berm', level: 'berm', baseAngle: 60, angleSpan: 40, covered: false, price: 'value' },
      { id: 'gm-club', name: 'Good People GM Club', level: 'club', baseAngle: 330, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'party-plaza', name: 'Party Plaza', level: 'field', baseAngle: 100, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Downtown Birmingham with city skyline views, oriented north'
  },

  {
    venueId: 'tennessee-smokies',
    venueName: 'Smokies Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 352.22222222222223, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4.444444444444457, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 28.888888888888914, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 41.111111111111086, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 65.55555555555554, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 77.77777777777777, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 277.77777777777777, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 285.55555555555554, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 293.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 301.1111111111111, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 308.8888888888889, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 316.6666666666667, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-118', name: '118', level: 'field', baseAngle: 324.44444444444446, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-119', name: '119', level: 'field', baseAngle: 332.22222222222223, angleSpan: 10, covered: false, price: 'value' },
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'luxury-suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 40, covered: true, price: 'luxury' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Kodak, TN with Great Smoky Mountains views beyond outfield'
  },

  {
    venueId: 'mississippi-braves',
    venueName: 'Trustmark Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 352.22222222222223, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4.444444444444457, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 16.666666666666686, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 28.888888888888914, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 41.111111111111086, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 53.333333333333314, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 65.55555555555554, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 77.77777777777777, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 277.77777777777777, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 285.55555555555554, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 293.3333333333333, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 301.1111111111111, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 308.8888888888889, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 316.6666666666667, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-118', name: '118', level: 'field', baseAngle: 324.44444444444446, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-119', name: '119', level: 'field', baseAngle: 332.22222222222223, angleSpan: 10, covered: false, price: 'value' },
      { id: 'club-level', name: 'Club Level', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'luxury-suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 40, covered: true, price: 'luxury' },
      { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 90, angleSpan: 30, covered: false, price: 'value' },
      { id: 'cf-seating', name: 'Center Field Seating', level: 'ga', baseAngle: 135, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 225, angleSpan: 30, covered: false, price: 'value' }
    ],
    notes: 'Pearl, MS suburb of Jackson, opened 2005'
  }
,
  
  {
    venueId: 'columbus-clingstones',
    venueName: 'Synovus Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 322, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 334, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 346, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 358, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 22, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 34, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 310, angleSpan: 12, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 322, angleSpan: 12, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 334, angleSpan: 12, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 346, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 358, angleSpan: 12, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 46, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 86, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Columbus, GA - New stadium opening 2025, 5,000 capacity'
  },
  
  {
    venueId: 'knoxville-smokies',
    venueName: 'Covenant Health Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 105, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 115, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 125, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 55, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 65, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 75, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 85, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 95, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 135, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 175, angleSpan: 20, covered: false, price: 'moderate' }
    ],
    notes: 'Knoxville, TN - New stadium opening 2025, 7,000 capacity'
  },
  {
    venueId: 'harrisburg-senators',
    venueName: 'FNB Field',
    lastUpdated: '2024-01',
    sections: [
      // Infield Box
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 352, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 4, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'field', baseAngle: 16, angleSpan: 12, covered: false, price: 'premium' },
      
      // Infield Reserved
      { id: 'res-5', name: 'Reserved 5', level: 'lower', baseAngle: 28, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-6', name: 'Reserved 6', level: 'lower', baseAngle: 42, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-7', name: 'Reserved 7', level: 'lower', baseAngle: 56, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-8', name: 'Reserved 8', level: 'lower', baseAngle: 70, angleSpan: 14, covered: false, price: 'value' },
      
      { id: 'res-9', name: 'Reserved 9', level: 'lower', baseAngle: 290, angleSpan: 14, covered: false, price: 'value' },
      { id: 'res-10', name: 'Reserved 10', level: 'lower', baseAngle: 304, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-11', name: 'Reserved 11', level: 'lower', baseAngle: 318, angleSpan: 14, covered: false, price: 'moderate' },
      { id: 'res-12', name: 'Reserved 12', level: 'lower', baseAngle: 332, angleSpan: 14, covered: false, price: 'moderate' },
      
      // Outfield Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 84, angleSpan: 46, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 230, angleSpan: 46, covered: false, price: 'value' },
      
      // Riverside Picnic Area
      { id: 'riverside', name: 'Riverside Picnic Area', level: 'ga', baseAngle: 130, angleSpan: 50, covered: false, price: 'value' },
      
      // Boardwalk (CF)
      { id: 'boardwalk', name: 'Boardwalk', level: 'berm', baseAngle: 180, angleSpan: 50, covered: false, price: 'value' },
      
      // Skybox Suites
      { id: 'skybox', name: 'Skybox Suites', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Located on City Island in Susquehanna River, oriented northeast'
  },
  
  {
    venueId: 'portland-sea-dogs',
    venueName: 'Hadlock Field',
    lastUpdated: '2024-01',
    sections: [
      // Field Box
      { id: 'fb-1', name: 'Field Box 1', level: 'field', baseAngle: 335, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-2', name: 'Field Box 2', level: 'field', baseAngle: 348, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-3', name: 'Field Box 3', level: 'field', baseAngle: 1, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-4', name: 'Field Box 4', level: 'field', baseAngle: 14, angleSpan: 13, covered: false, price: 'premium' },
      { id: 'fb-5', name: 'Field Box 5', level: 'field', baseAngle: 27, angleSpan: 13, covered: false, price: 'premium' },
      
      // Reserved Grandstand
      { id: 'rg-101', name: 'Reserved 101', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rg-102', name: 'Reserved 102', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rg-103', name: 'Reserved 103', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'value' },
      { id: 'rg-104', name: 'Reserved 104', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'rg-105', name: 'Reserved 105', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'rg-106', name: 'Reserved 106', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'value' },
      { id: 'rg-107', name: 'Reserved 107', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rg-108', name: 'Reserved 108', level: 'lower', baseAngle: 320, angleSpan: 15, covered: false, price: 'moderate' },
      
      // Maine Monster (LF Wall - 37 feet high)
      { id: 'monster', name: 'Maine Monster', level: 'ga', baseAngle: 180, angleSpan: 40, covered: false, price: 'value' },
      
      // Pavilion
      { id: 'pavilion', name: 'Pavilion', level: 'ga', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      
      // Picnic Area
      { id: 'picnic', name: 'Picnic Area', level: 'ga', baseAngle: 220, angleSpan: 40, covered: false, price: 'value' },
      
      // Sea Dog Suites
      { id: 'suites', name: 'Sea Dog Suites', level: 'suite', baseAngle: 340, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Features Maine Monster (Green Monster replica), oriented northeast'
  },
  
  {
    venueId: 'richmond-flying-squirrels',
    venueName: 'The Diamond',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-101', name: 'Box 101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-102', name: 'Box 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-103', name: 'Box 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-104', name: 'Box 104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-105', name: 'Box 105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Lower Reserved
      { id: 'lr-201', name: 'Lower Reserved 201', level: 'lower', baseAngle: 30, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-202', name: 'Lower Reserved 202', level: 'lower', baseAngle: 45, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-203', name: 'Lower Reserved 203', level: 'lower', baseAngle: 60, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-204', name: 'Lower Reserved 204', level: 'lower', baseAngle: 75, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'lr-205', name: 'Lower Reserved 205', level: 'lower', baseAngle: 285, angleSpan: 15, covered: false, price: 'value' },
      { id: 'lr-206', name: 'Lower Reserved 206', level: 'lower', baseAngle: 300, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-207', name: 'Lower Reserved 207', level: 'lower', baseAngle: 315, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'lr-208', name: 'Lower Reserved 208', level: 'lower', baseAngle: 330, angleSpan: 15, covered: false, price: 'moderate' },
      
      // General Admission
      { id: 'ga-rf', name: 'Right Field GA', level: 'ga', baseAngle: 90, angleSpan: 45, covered: false, price: 'value' },
      { id: 'ga-lf', name: 'Left Field GA', level: 'ga', baseAngle: 225, angleSpan: 45, covered: false, price: 'value' },
      
      // Funnville (Kids Area)
      { id: 'funnville', name: 'Funnville', level: 'ga', baseAngle: 135, angleSpan: 45, covered: false, price: 'value' },
      
      // Party Deck
      { id: 'party-deck', name: 'Party Deck', level: 'club', baseAngle: 180, angleSpan: 40, covered: true, price: 'luxury' }
    ],
    notes: 'Classic stadium opened 1985, future replacement planned'
  }
];

// Function to get venue layout by ID
export function getVenueLayout(venueId: string): VenueLayout | undefined {
  return [...aaaVenueLayouts, ...aaVenueLayouts]
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
  ...aaVenueLayouts
];
