export interface StadiumSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  baseAngle: number; // Angle from home plate (0 = behind home, 90 = first base, 180 = center field, 270 = third base)
  angleSpan: number; // How many degrees this section spans
  rows?: number; // Number of rows in section
  covered: boolean; // Whether section has overhead coverage
  price?: 'value' | 'moderate' | 'premium' | 'luxury';
}

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}

// Helper function to generate sections for a standard stadium layout
function generateStandardSections(prefix: string, startAngle: number, anglePerSection: number, count: number, level: 'field' | 'lower' | 'club' | 'upper', covered: boolean = false): StadiumSection[] {
  const sections: StadiumSection[] = [];
  for (let i = 0; i < count; i++) {
    sections.push({
      id: `${prefix}${i + 1}`,
      name: `Section ${prefix}${i + 1}`,
      level,
      baseAngle: startAngle + (i * anglePerSection),
      angleSpan: anglePerSection,
      covered,
      price: level === 'field' ? 'premium' : level === 'upper' ? 'value' : 'moderate'
    });
  }
  return sections;
}

export const stadiumSections: StadiumSections[] = [
  // Yankee Stadium
  {
    stadiumId: 'yankees',
    sections: [
      // Field Level
      ...generateStandardSections('', 340, 10, 4, 'field'), // Sections 1-4 (behind home)
      ...generateStandardSections('', 20, 10, 14, 'field'), // Sections 5-18 (third base line)
      ...generateStandardSections('', 160, 10, 8, 'field'), // Sections 19-26 (left field)
      ...generateStandardSections('', 240, 10, 8, 'field'), // Sections 27-34 (right field)
      ...generateStandardSections('', 320, 10, 2, 'field'), // Sections 35-36 (first base line)
      
      // Main Level (200s)
      ...generateStandardSections('2', 340, 8, 5, 'lower', true), // Sections 201-205
      ...generateStandardSections('2', 20, 8, 17, 'lower'), // Sections 206-222
      ...generateStandardSections('2', 156, 8, 10, 'lower'), // Sections 223-232
      ...generateStandardSections('2', 236, 8, 10, 'lower'), // Sections 233-242
      ...generateStandardSections('2', 316, 8, 3, 'lower', true), // Sections 243-245
      
      // Upper Level (300s/400s)
      ...generateStandardSections('3', 340, 6, 6, 'upper', true), // Sections 301-306
      ...generateStandardSections('3', 22, 6, 20, 'upper'), // Sections 307-326
      ...generateStandardSections('3', 142, 6, 12, 'upper'), // Sections 327-338
      ...generateStandardSections('3', 214, 6, 12, 'upper'), // Sections 339-350
      ...generateStandardSections('3', 286, 6, 10, 'upper', true), // Sections 351-360
      
      // Bleachers
      { id: 'bleachers-lf', name: 'Left Field Bleachers', level: 'upper', baseAngle: 135, angleSpan: 30, covered: false, price: 'value' },
      { id: 'bleachers-cf', name: 'Center Field Bleachers', level: 'upper', baseAngle: 165, angleSpan: 30, covered: false, price: 'value' },
      { id: 'bleachers-rf', name: 'Right Field Bleachers', level: 'upper', baseAngle: 195, angleSpan: 30, covered: false, price: 'value' },
    ]
  },

  // Fenway Park
  {
    stadiumId: 'redsox',
    sections: [
      // Field Box
      ...generateStandardSections('FB', 340, 12, 3, 'field', true), // FB1-3 (behind home)
      ...generateStandardSections('FB', 16, 8, 10, 'field'), // FB4-13 (third base)
      ...generateStandardSections('FB', 96, 8, 10, 'field'), // FB14-23 (first base)
      
      // Infield Box
      ...generateStandardSections('IB', 340, 10, 4, 'lower', true), // IB1-4
      ...generateStandardSections('IB', 20, 8, 8, 'lower'), // IB5-12
      ...generateStandardSections('IB', 84, 8, 8, 'lower'), // IB13-20
      
      // Grandstand
      ...generateStandardSections('G', 340, 8, 5, 'lower', true), // G1-5
      ...generateStandardSections('G', 20, 6, 15, 'lower', true), // G6-20
      ...generateStandardSections('G', 110, 6, 15, 'lower', true), // G21-35
      
      // Pavilion
      ...generateStandardSections('P', 270, 10, 6, 'lower'), // P1-6 (third base pavilion)
      ...generateStandardSections('P', 330, 10, 6, 'lower'), // P7-12 (first base pavilion)
      
      // Right Field
      ...generateStandardSections('RF', 45, 15, 6, 'lower'), // RF1-6
      
      // Bleachers
      { id: 'bleachers-cf', name: 'Center Field Bleachers', level: 'upper', baseAngle: 165, angleSpan: 30, covered: false, price: 'value' },
      { id: 'bleachers-rf', name: 'Right Field Bleachers', level: 'upper', baseAngle: 195, angleSpan: 20, covered: false, price: 'value' },
      
      // Green Monster
      { id: 'monster-1', name: 'Green Monster 1', level: 'upper', baseAngle: 130, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'monster-2', name: 'Green Monster 2', level: 'upper', baseAngle: 140, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'monster-3', name: 'Green Monster 3', level: 'upper', baseAngle: 150, angleSpan: 10, covered: false, price: 'premium' },
    ]
  },

  // Dodger Stadium
  {
    stadiumId: 'dodgers',
    sections: [
      // Field Level
      ...generateStandardSections('FD', 340, 10, 4, 'field'), // FD1-4 (behind home)
      ...generateStandardSections('FD', 20, 10, 8, 'field'), // FD5-12 (third base)
      ...generateStandardSections('FD', 100, 10, 8, 'field'), // FD13-20 (first base)
      
      // Loge Level
      ...generateStandardSections('LG', 340, 8, 5, 'club', true), // LG1-5
      ...generateStandardSections('LG', 20, 8, 10, 'club'), // LG6-15
      ...generateStandardSections('LG', 100, 8, 10, 'club'), // LG16-25
      
      // Reserve Level
      ...generateStandardSections('RS', 340, 6, 8, 'upper', true), // RS1-8
      ...generateStandardSections('RS', 28, 6, 15, 'upper'), // RS9-23
      ...generateStandardSections('RS', 118, 6, 15, 'upper'), // RS24-38
      
      // Top Deck
      ...generateStandardSections('TD', 340, 6, 6, 'upper', true), // TD1-6
      ...generateStandardSections('TD', 22, 6, 10, 'upper'), // TD7-16
      ...generateStandardSections('TD', 82, 6, 10, 'upper'), // TD17-26
      
      // Pavilions
      { id: 'pavilion-lf', name: 'Left Field Pavilion', level: 'upper', baseAngle: 135, angleSpan: 30, covered: false, price: 'value' },
      { id: 'pavilion-rf', name: 'Right Field Pavilion', level: 'upper', baseAngle: 195, angleSpan: 30, covered: false, price: 'value' },
    ]
  },

  // Wrigley Field
  {
    stadiumId: 'cubs',
    sections: [
      // Box Seats
      ...generateStandardSections('', 340, 12, 3, 'field', true), // 1-3 (behind home)
      ...generateStandardSections('', 16, 8, 15, 'field'), // 4-18 (third base)
      ...generateStandardSections('', 136, 8, 15, 'field'), // 19-33 (first base)
      
      // Lower Level (100s)
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 20, 'lower'), // 106-125
      ...generateStandardSections('1', 140, 6, 20, 'lower'), // 126-145
      
      // Upper Level (200s)
      ...generateStandardSections('2', 340, 8, 5, 'upper', true), // 201-205
      ...generateStandardSections('2', 20, 6, 20, 'upper'), // 206-225
      ...generateStandardSections('2', 140, 6, 20, 'upper'), // 226-245
      
      // Upper Level (300s)
      ...generateStandardSections('3', 340, 8, 5, 'upper', true), // 301-305
      ...generateStandardSections('3', 20, 6, 20, 'upper'), // 306-325
      ...generateStandardSections('3', 140, 6, 20, 'upper'), // 326-345
      
      // Upper Level (400s)
      ...generateStandardSections('4', 340, 8, 5, 'upper', true), // 401-405
      ...generateStandardSections('4', 20, 6, 20, 'upper'), // 406-425
      ...generateStandardSections('4', 140, 6, 20, 'upper'), // 426-445
      
      // Bleachers
      { id: 'bleachers-lf', name: 'Left Field Bleachers', level: 'upper', baseAngle: 120, angleSpan: 30, covered: false, price: 'value' },
      { id: 'bleachers-cf', name: 'Center Field Bleachers', level: 'upper', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' },
      { id: 'bleachers-rf', name: 'Right Field Bleachers', level: 'upper', baseAngle: 210, angleSpan: 30, covered: false, price: 'value' },
    ]
  },

  // Oracle Park
  {
    stadiumId: 'giants',
    sections: [
      // Field Level
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      ...generateStandardSections('', 20, 8, 12, 'field'), // 5-16
      ...generateStandardSections('', 116, 8, 12, 'field'), // 17-28
      
      // Lower Box (100s)
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 18, 'lower'), // 106-123
      ...generateStandardSections('1', 128, 6, 18, 'lower'), // 124-141
      
      // View Level (300s)
      ...generateStandardSections('3', 340, 8, 5, 'upper', true), // 301-305
      ...generateStandardSections('3', 20, 6, 20, 'upper'), // 306-325
      ...generateStandardSections('3', 140, 6, 20, 'upper'), // 326-345
      
      // Bleachers
      { id: 'bleachers-lf', name: 'Left Field Bleachers', level: 'upper', baseAngle: 135, angleSpan: 30, covered: false, price: 'value' },
      { id: 'bleachers-cf', name: 'Center Field Bleachers', level: 'upper', baseAngle: 165, angleSpan: 30, covered: false, price: 'value' },
      
      // Arcade
      { id: 'arcade', name: 'Right Field Arcade', level: 'lower', baseAngle: 195, angleSpan: 45, covered: false, price: 'value' },
    ]
  },

  // Petco Park
  {
    stadiumId: 'padres',
    sections: [
      // Field Level
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      ...generateStandardSections('', 20, 8, 12, 'field'), // 5-16
      ...generateStandardSections('', 116, 8, 12, 'field'), // 17-28
      
      // Toyota Terrace (100s)
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 18, 'lower'), // 106-123
      ...generateStandardSections('1', 128, 6, 18, 'lower'), // 124-141
      
      // Upper Level (300s)
      ...generateStandardSections('3', 340, 8, 5, 'upper', true), // 301-305
      ...generateStandardSections('3', 20, 6, 18, 'upper'), // 306-323
      ...generateStandardSections('3', 128, 6, 18, 'upper'), // 324-341
      
      // Park at the Park
      { id: 'park', name: 'Park at the Park', level: 'field', baseAngle: 165, angleSpan: 30, covered: false, price: 'value' },
      
      // Western Metal Supply Co. Building
      { id: 'western-metal', name: 'Western Metal Building', level: 'lower', baseAngle: 135, angleSpan: 10, covered: true, price: 'premium' },
    ]
  },

  // Coors Field
  {
    stadiumId: 'rockies',
    sections: [
      // Infield Box
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      ...generateStandardSections('', 20, 8, 15, 'field'), // 5-19
      ...generateStandardSections('', 140, 8, 15, 'field'), // 20-34
      
      // Lower Level (100s)
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 20, 'lower'), // 106-125
      ...generateStandardSections('1', 140, 6, 20, 'lower'), // 126-145
      
      // Club Level (200s)
      ...generateStandardSections('2', 340, 8, 5, 'club', true), // 201-205
      ...generateStandardSections('2', 20, 6, 18, 'club', true), // 206-223
      ...generateStandardSections('2', 128, 6, 18, 'club', true), // 224-241
      
      // Upper Level (300s)
      ...generateStandardSections('3', 340, 8, 5, 'upper', true), // 301-305
      ...generateStandardSections('3', 20, 6, 20, 'upper'), // 306-325
      ...generateStandardSections('3', 140, 6, 20, 'upper'), // 326-345
      
      // Rockpile
      { id: 'rockpile', name: 'Rockpile', level: 'upper', baseAngle: 165, angleSpan: 30, covered: false, price: 'value' },
      
      // Rooftop
      { id: 'rooftop', name: 'Rooftop', level: 'upper', baseAngle: 195, angleSpan: 30, covered: false, price: 'moderate' },
    ]
  },

  // Chase Field (Arizona - Retractable Roof)
  {
    stadiumId: 'diamondbacks',
    sections: [
      // Infield
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      ...generateStandardSections('', 20, 8, 12, 'field', true), // 5-16
      ...generateStandardSections('', 116, 8, 12, 'field', true), // 17-28
      
      // Lower Level (100s)
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 18, 'lower', true), // 106-123
      ...generateStandardSections('1', 128, 6, 18, 'lower', true), // 124-141
      
      // Club Level (200s)
      ...generateStandardSections('2', 340, 8, 5, 'club', true), // 201-205
      ...generateStandardSections('2', 20, 6, 16, 'club', true), // 206-221
      ...generateStandardSections('2', 116, 6, 16, 'club', true), // 222-237
      
      // Upper Level (300s)
      ...generateStandardSections('3', 340, 8, 5, 'upper', true), // 301-305
      ...generateStandardSections('3', 20, 6, 18, 'upper', true), // 306-323
      ...generateStandardSections('3', 128, 6, 18, 'upper', true), // 324-341
    ]
  },

  // Tropicana Field (Tampa Bay - Fixed Dome)
  {
    stadiumId: 'rays',
    sections: [
      // Lower Level
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      ...generateStandardSections('', 20, 8, 15, 'field', true), // 5-19
      ...generateStandardSections('', 140, 8, 15, 'field', true), // 20-34
      
      // 100 Level
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 20, 'lower', true), // 106-125
      ...generateStandardSections('1', 140, 6, 20, 'lower', true), // 126-145
      
      // 200 Level
      ...generateStandardSections('2', 340, 8, 5, 'club', true), // 201-205
      ...generateStandardSections('2', 20, 6, 18, 'club', true), // 206-223
      ...generateStandardSections('2', 128, 6, 18, 'club', true), // 224-241
      
      // 300 Level
      ...generateStandardSections('3', 340, 8, 5, 'upper', true), // 301-305
      ...generateStandardSections('3', 20, 6, 18, 'upper', true), // 306-323
      ...generateStandardSections('3', 128, 6, 18, 'upper', true), // 324-341
    ]
  },

  // Minute Maid Park (Houston - Retractable Roof)
  {
    stadiumId: 'astros',
    sections: [
      // Field Level
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      ...generateStandardSections('', 20, 8, 12, 'field', true), // 5-16
      ...generateStandardSections('', 116, 8, 12, 'field', true), // 17-28
      
      // 100 Level
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 18, 'lower', true), // 106-123
      ...generateStandardSections('1', 128, 6, 18, 'lower', true), // 124-141
      
      // Club Level (200s)
      ...generateStandardSections('2', 340, 8, 5, 'club', true), // 201-205
      ...generateStandardSections('2', 20, 6, 16, 'club', true), // 206-221
      ...generateStandardSections('2', 116, 6, 16, 'club', true), // 222-237
      
      // Upper Deck (400s)
      ...generateStandardSections('4', 340, 8, 5, 'upper', true), // 401-405
      ...generateStandardSections('4', 20, 6, 18, 'upper', true), // 406-423
      ...generateStandardSections('4', 128, 6, 18, 'upper', true), // 424-441
    ]
  },

  // T-Mobile Park (Seattle - Retractable Roof)
  {
    stadiumId: 'mariners',
    sections: [
      // Diamond Club
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      
      // Field Level
      ...generateStandardSections('', 20, 8, 12, 'field', true), // 5-16
      ...generateStandardSections('', 116, 8, 12, 'field', true), // 17-28
      
      // Main Level (100s)
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 18, 'lower', true), // 106-123
      ...generateStandardSections('1', 128, 6, 18, 'lower', true), // 124-141
      
      // Club Level (200s)
      ...generateStandardSections('2', 340, 8, 5, 'club', true), // 201-205
      ...generateStandardSections('2', 20, 6, 16, 'club', true), // 206-221
      ...generateStandardSections('2', 116, 6, 16, 'club', true), // 222-237
      
      // View Level (300s)
      ...generateStandardSections('3', 340, 8, 5, 'upper', true), // 301-305
      ...generateStandardSections('3', 20, 6, 18, 'upper', true), // 306-323
      ...generateStandardSections('3', 128, 6, 18, 'upper', true), // 324-341
    ]
  },

  // Globe Life Field (Texas - Retractable Roof)
  {
    stadiumId: 'rangers',
    sections: [
      // Field Level
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      ...generateStandardSections('', 20, 8, 12, 'field', true), // 5-16
      ...generateStandardSections('', 116, 8, 12, 'field', true), // 17-28
      
      // 100 Level
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 18, 'lower', true), // 106-123
      ...generateStandardSections('1', 128, 6, 18, 'lower', true), // 124-141
      
      // 200 Level
      ...generateStandardSections('2', 340, 8, 5, 'club', true), // 201-205
      ...generateStandardSections('2', 20, 6, 16, 'club', true), // 206-221
      ...generateStandardSections('2', 116, 6, 16, 'club', true), // 222-237
      
      // 300 Level
      ...generateStandardSections('3', 340, 8, 5, 'upper', true), // 301-305
      ...generateStandardSections('3', 20, 6, 18, 'upper', true), // 306-323
      ...generateStandardSections('3', 128, 6, 18, 'upper', true), // 324-341
    ]
  },

  // American Family Field (Milwaukee - Retractable Roof)
  {
    stadiumId: 'brewers',
    sections: [
      // Field Level
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      ...generateStandardSections('', 20, 8, 12, 'field', true), // 5-16
      ...generateStandardSections('', 116, 8, 12, 'field', true), // 17-28
      
      // Loge Level (100s)
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 18, 'lower', true), // 106-123
      ...generateStandardSections('1', 128, 6, 18, 'lower', true), // 124-141
      
      // Club Level (200s)
      ...generateStandardSections('2', 340, 8, 5, 'club', true), // 201-205
      ...generateStandardSections('2', 20, 6, 16, 'club', true), // 206-221
      ...generateStandardSections('2', 116, 6, 16, 'club', true), // 222-237
      
      // Terrace Level (400s)
      ...generateStandardSections('4', 340, 8, 5, 'upper', true), // 401-405
      ...generateStandardSections('4', 20, 6, 18, 'upper', true), // 406-423
      ...generateStandardSections('4', 128, 6, 18, 'upper', true), // 424-441
    ]
  },

  // Rogers Centre (Toronto - Retractable Roof)
  {
    stadiumId: 'bluejays',
    sections: [
      // 100 Level
      ...generateStandardSections('1', 340, 8, 5, 'field', true), // 101-105
      ...generateStandardSections('1', 20, 6, 18, 'field', true), // 106-123
      ...generateStandardSections('1', 128, 6, 18, 'field', true), // 124-141
      
      // 200 Level
      ...generateStandardSections('2', 340, 8, 5, 'lower', true), // 201-205
      ...generateStandardSections('2', 20, 6, 20, 'lower', true), // 206-225
      ...generateStandardSections('2', 140, 6, 20, 'lower', true), // 226-245
      
      // 300 Level
      ...generateStandardSections('3', 340, 8, 5, 'club', true), // 301-305
      ...generateStandardSections('3', 20, 6, 16, 'club', true), // 306-321
      ...generateStandardSections('3', 116, 6, 16, 'club', true), // 322-337
      
      // 500 Level
      ...generateStandardSections('5', 340, 6, 8, 'upper', true), // 501-508
      ...generateStandardSections('5', 28, 6, 20, 'upper', true), // 509-528
      ...generateStandardSections('5', 148, 6, 20, 'upper', true), // 529-548
    ]
  },

  // LoanDepot Park (Miami - Retractable Roof)
  {
    stadiumId: 'marlins',
    sections: [
      // Field Level
      ...generateStandardSections('', 340, 10, 4, 'field', true), // 1-4
      ...generateStandardSections('', 20, 8, 12, 'field', true), // 5-16
      ...generateStandardSections('', 116, 8, 12, 'field', true), // 17-28
      
      // 100 Level
      ...generateStandardSections('1', 340, 8, 5, 'lower', true), // 101-105
      ...generateStandardSections('1', 20, 6, 18, 'lower', true), // 106-123
      ...generateStandardSections('1', 128, 6, 18, 'lower', true), // 124-141
      
      // 200 Level
      ...generateStandardSections('2', 340, 8, 5, 'club', true), // 201-205
      ...generateStandardSections('2', 20, 6, 16, 'club', true), // 206-221
      ...generateStandardSections('2', 116, 6, 16, 'club', true), // 222-237
      
      // 300 Level
      ...generateStandardSections('3', 340, 8, 5, 'upper', true), // 301-305
      ...generateStandardSections('3', 20, 6, 18, 'upper', true), // 306-323
      ...generateStandardSections('3', 128, 6, 18, 'upper', true), // 324-341
    ]
  },

  // Remaining stadiums with standard layouts
  {
    stadiumId: 'orioles',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
    ]
  },

  {
    stadiumId: 'phillies',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club', true),
      ...generateStandardSections('2', 20, 6, 18, 'club', true),
      ...generateStandardSections('2', 128, 6, 18, 'club', true),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
    ]
  },

  {
    stadiumId: 'nationals',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club', true),
      ...generateStandardSections('2', 20, 6, 18, 'club', true),
      ...generateStandardSections('2', 128, 6, 18, 'club', true),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
    ]
  },

  {
    stadiumId: 'mets',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
      ...generateStandardSections('4', 340, 8, 5, 'upper', true),
      ...generateStandardSections('4', 20, 6, 18, 'upper'),
      ...generateStandardSections('4', 128, 6, 18, 'upper'),
    ]
  },

  {
    stadiumId: 'braves',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club', true),
      ...generateStandardSections('2', 20, 6, 18, 'club', true),
      ...generateStandardSections('2', 128, 6, 18, 'club', true),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
    ]
  },

  {
    stadiumId: 'cardinals',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club', true),
      ...generateStandardSections('2', 20, 6, 18, 'club', true),
      ...generateStandardSections('2', 128, 6, 18, 'club', true),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
    ]
  },

  {
    stadiumId: 'whitesox',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
      ...generateStandardSections('5', 340, 8, 5, 'upper', true),
      ...generateStandardSections('5', 20, 6, 18, 'upper'),
      ...generateStandardSections('5', 128, 6, 18, 'upper'),
    ]
  },

  {
    stadiumId: 'reds',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('4', 340, 8, 5, 'upper', true),
      ...generateStandardSections('4', 20, 6, 18, 'upper'),
      ...generateStandardSections('4', 128, 6, 18, 'upper'),
      ...generateStandardSections('5', 340, 8, 5, 'upper', true),
      ...generateStandardSections('5', 20, 6, 18, 'upper'),
      ...generateStandardSections('5', 128, 6, 18, 'upper'),
    ]
  },

  {
    stadiumId: 'guardians',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('3', 340, 8, 5, 'club', true),
      ...generateStandardSections('3', 20, 6, 18, 'club', true),
      ...generateStandardSections('3', 128, 6, 18, 'club', true),
      ...generateStandardSections('5', 340, 8, 5, 'upper', true),
      ...generateStandardSections('5', 20, 6, 18, 'upper'),
      ...generateStandardSections('5', 128, 6, 18, 'upper'),
    ]
  },

  {
    stadiumId: 'tigers',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club', true),
      ...generateStandardSections('2', 20, 6, 18, 'club', true),
      ...generateStandardSections('2', 128, 6, 18, 'club', true),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
    ]
  },

  {
    stadiumId: 'royals',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club', true),
      ...generateStandardSections('2', 20, 6, 18, 'club', true),
      ...generateStandardSections('2', 128, 6, 18, 'club', true),
      ...generateStandardSections('4', 340, 8, 5, 'upper', true),
      ...generateStandardSections('4', 20, 6, 18, 'upper'),
      ...generateStandardSections('4', 128, 6, 18, 'upper'),
    ]
  },

  {
    stadiumId: 'twins',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club', true),
      ...generateStandardSections('2', 20, 6, 18, 'club', true),
      ...generateStandardSections('2', 128, 6, 18, 'club', true),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
    ]
  },

  {
    stadiumId: 'pirates',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club', true),
      ...generateStandardSections('2', 20, 6, 18, 'club', true),
      ...generateStandardSections('2', 128, 6, 18, 'club', true),
      ...generateStandardSections('3', 340, 8, 5, 'upper', true),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
    ]
  },

  {
    stadiumId: 'angels',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field', true),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower', true),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club', true),
      ...generateStandardSections('2', 20, 6, 18, 'club', true),
      ...generateStandardSections('2', 128, 6, 18, 'club', true),
      ...generateStandardSections('4', 340, 8, 5, 'upper', true),
      ...generateStandardSections('4', 20, 6, 18, 'upper'),
      ...generateStandardSections('4', 128, 6, 18, 'upper'),
      ...generateStandardSections('5', 340, 8, 5, 'upper', true),
      ...generateStandardSections('5', 20, 6, 18, 'upper'),
      ...generateStandardSections('5', 128, 6, 18, 'upper'),
    ]
  },

  {
    stadiumId: 'athletics',
    sections: [
      ...generateStandardSections('', 340, 10, 4, 'field'),
      ...generateStandardSections('', 20, 8, 15, 'field'),
      ...generateStandardSections('', 140, 8, 15, 'field'),
      ...generateStandardSections('1', 340, 8, 5, 'lower'),
      ...generateStandardSections('1', 20, 6, 20, 'lower'),
      ...generateStandardSections('1', 140, 6, 20, 'lower'),
      ...generateStandardSections('2', 340, 8, 5, 'club'),
      ...generateStandardSections('2', 20, 6, 18, 'club'),
      ...generateStandardSections('2', 128, 6, 18, 'club'),
      ...generateStandardSections('3', 340, 8, 5, 'upper'),
      ...generateStandardSections('3', 20, 6, 20, 'upper'),
      ...generateStandardSections('3', 140, 6, 20, 'upper'),
    ]
  },
];

// Helper function to get sections for a specific stadium
export function getStadiumSections(stadiumId: string): StadiumSection[] {
  const stadiumData = stadiumSections.find(s => s.stadiumId === stadiumId);
  return stadiumData ? stadiumData.sections : [];
}

// Helper function to check if a section is in sun based on sun position
export function isSectionInSun(section: StadiumSection, sunAzimuth: number, sunElevation: number): boolean {
  // If section is covered, it's not in direct sun
  if (section.covered) return false;
  
  // If sun is below horizon, no sections are sunny
  if (sunElevation < 0) return false;
  
  // Normalize angles to 0-360 range
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
  
  const sunAngle = normalizeAngle(sunAzimuth);
  
  // For baseball stadiums, we need to check if the sun is behind the section
  // (i.e., the sun is shining from the opposite direction onto the section)
  // The sun illuminates sections that are roughly facing it (±90 degrees)
  
  // Calculate angle difference between sun and section center
  const sectionCenter = normalizeAngle(section.baseAngle + section.angleSpan / 2);
  let angleDiff = Math.abs(sunAngle - sectionCenter);
  if (angleDiff > 180) {
    angleDiff = 360 - angleDiff;
  }
  
  // Section is in sun if it's generally facing the sun (within ~120 degrees)
  // This accounts for the fact that sun can illuminate sections at an angle
  return angleDiff <= 120;
}

// Helper function to calculate sun exposure percentage for a section
export function getSectionSunExposure(section: StadiumSection, sunElevation: number, sunAzimuth: number): number {
  if (section.covered || sunElevation < 0) return 0;
  
  // Check if section is actually in sun first
  if (!isSectionInSun(section, sunAzimuth, sunElevation)) return 0;
  
  // Base exposure calculation based on sun elevation
  const elevationFactor = Math.min(sunElevation / 90, 1); // Normalize to 0-1, cap at 1
  
  // Calculate angle-based intensity (how directly the sun hits the section)
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
  const sectionCenter = normalizeAngle(section.baseAngle + section.angleSpan / 2);
  const sunAngle = normalizeAngle(sunAzimuth);
  
  let angleDiff = Math.abs(sunAngle - sectionCenter);
  if (angleDiff > 180) {
    angleDiff = 360 - angleDiff;
  }
  
  // Angle factor: 1.0 when sun is directly behind section, decreases as angle increases
  const angleFactor = Math.max(0, (120 - angleDiff) / 120);
  
  // Level-based adjustments
  let levelMultiplier = 1.0;
  if (section.level === 'field') {
    levelMultiplier = 1.0; // Field level gets full exposure
  } else if (section.level === 'lower') {
    levelMultiplier = 0.9; // Slight reduction due to possible overhangs
  } else if (section.level === 'club') {
    levelMultiplier = 0.8; // More protection from overhangs
  } else if (section.level === 'upper') {
    levelMultiplier = 0.95; // Upper sections often more exposed
  } else if (section.level === 'suite') {
    levelMultiplier = 0.7; // Suites often have more protection
  }
  
  // Combine all factors
  const exposure = elevationFactor * angleFactor * levelMultiplier * 100;
  
  return Math.round(Math.max(0, Math.min(100, exposure)));
}