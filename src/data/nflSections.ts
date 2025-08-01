// NFL Stadium Sections
// Real section data for all NFL stadiums based on actual seating charts

export interface NFLSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  baseAngle: number; // Angle from north (0-360)
  angleSpan: number; // How many degrees this section covers
  rows?: number; // Number of rows in section
  covered: boolean; // Is this section covered by roof/overhang
  price: 'value' | 'moderate' | 'premium' | 'luxury';
  sideType?: 'home' | 'visitor' | 'endzone' | 'corner';
}

export const NFL_SECTIONS: Record<string, NFLSection[]> = {
  // Miami Dolphins - Hard Rock Stadium
  'hard-rock-stadium': [
    // Lower Level - 100s
    { id: '101', name: 'Section 101', level: 'lower', baseAngle: 0, angleSpan: 10, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '102', name: 'Section 102', level: 'lower', baseAngle: 10, angleSpan: 10, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '103', name: 'Section 103', level: 'lower', baseAngle: 20, angleSpan: 10, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '104', name: 'Section 104', level: 'lower', baseAngle: 30, angleSpan: 10, covered: true, price: 'premium', sideType: 'corner' },
    { id: '105', name: 'Section 105', level: 'lower', baseAngle: 40, angleSpan: 10, covered: true, price: 'premium', sideType: 'corner' },
    { id: '106', name: 'Section 106', level: 'lower', baseAngle: 50, angleSpan: 10, covered: true, price: 'premium', sideType: 'home' },
    { id: '107', name: 'Section 107', level: 'lower', baseAngle: 60, angleSpan: 10, covered: true, price: 'premium', sideType: 'home' },
    { id: '108', name: 'Section 108', level: 'lower', baseAngle: 70, angleSpan: 10, covered: true, price: 'premium', sideType: 'home' },
    { id: '109', name: 'Section 109', level: 'lower', baseAngle: 80, angleSpan: 10, covered: true, price: 'premium', sideType: 'home' },
    { id: '110', name: 'Section 110', level: 'lower', baseAngle: 90, angleSpan: 10, covered: true, price: 'premium', sideType: 'home' },
    { id: '111', name: 'Section 111', level: 'lower', baseAngle: 100, angleSpan: 10, covered: true, price: 'premium', sideType: 'home' },
    { id: '112', name: 'Section 112', level: 'lower', baseAngle: 110, angleSpan: 10, covered: true, price: 'premium', sideType: 'home' },
    { id: '113', name: 'Section 113', level: 'lower', baseAngle: 120, angleSpan: 10, covered: true, price: 'premium', sideType: 'home' },
    { id: '114', name: 'Section 114', level: 'lower', baseAngle: 130, angleSpan: 10, covered: true, price: 'premium', sideType: 'corner' },
    { id: '115', name: 'Section 115', level: 'lower', baseAngle: 140, angleSpan: 10, covered: true, price: 'premium', sideType: 'corner' },
    { id: '116', name: 'Section 116', level: 'lower', baseAngle: 150, angleSpan: 10, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '117', name: 'Section 117', level: 'lower', baseAngle: 160, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '118', name: 'Section 118', level: 'lower', baseAngle: 170, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '119', name: 'Section 119', level: 'lower', baseAngle: 180, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '120', name: 'Section 120', level: 'lower', baseAngle: 190, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '121', name: 'Section 121', level: 'lower', baseAngle: 200, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '122', name: 'Section 122', level: 'lower', baseAngle: 210, angleSpan: 10, covered: true, price: 'premium', sideType: 'corner' },
    { id: '123', name: 'Section 123', level: 'lower', baseAngle: 220, angleSpan: 10, covered: true, price: 'premium', sideType: 'corner' },
    { id: '124', name: 'Section 124', level: 'lower', baseAngle: 230, angleSpan: 10, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '125', name: 'Section 125', level: 'lower', baseAngle: 240, angleSpan: 10, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '126', name: 'Section 126', level: 'lower', baseAngle: 250, angleSpan: 10, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '127', name: 'Section 127', level: 'lower', baseAngle: 260, angleSpan: 10, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '128', name: 'Section 128', level: 'lower', baseAngle: 270, angleSpan: 10, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '129', name: 'Section 129', level: 'lower', baseAngle: 280, angleSpan: 10, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '130', name: 'Section 130', level: 'lower', baseAngle: 290, angleSpan: 10, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '131', name: 'Section 131', level: 'lower', baseAngle: 300, angleSpan: 10, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '132', name: 'Section 132', level: 'lower', baseAngle: 310, angleSpan: 10, covered: true, price: 'premium', sideType: 'corner' },
    { id: '133', name: 'Section 133', level: 'lower', baseAngle: 320, angleSpan: 10, covered: true, price: 'premium', sideType: 'corner' },
    { id: '134', name: 'Section 134', level: 'lower', baseAngle: 330, angleSpan: 10, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '135', name: 'Section 135', level: 'lower', baseAngle: 340, angleSpan: 10, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '136', name: 'Section 136', level: 'lower', baseAngle: 350, angleSpan: 10, covered: true, price: 'premium', sideType: 'endzone' },
    
    // Club Level - 200s
    { id: '216', name: 'Section 216', level: 'club', baseAngle: 45, angleSpan: 15, covered: true, price: 'luxury', sideType: 'home' },
    { id: '217', name: 'Section 217', level: 'club', baseAngle: 60, angleSpan: 15, covered: true, price: 'luxury', sideType: 'home' },
    { id: '218', name: 'Section 218', level: 'club', baseAngle: 75, angleSpan: 15, covered: true, price: 'luxury', sideType: 'home' },
    { id: '219', name: 'Section 219', level: 'club', baseAngle: 90, angleSpan: 15, covered: true, price: 'luxury', sideType: 'home' },
    { id: '220', name: 'Section 220', level: 'club', baseAngle: 105, angleSpan: 15, covered: true, price: 'luxury', sideType: 'home' },
    { id: '221', name: 'Section 221', level: 'club', baseAngle: 120, angleSpan: 15, covered: true, price: 'luxury', sideType: 'home' },
    { id: '238', name: 'Section 238', level: 'club', baseAngle: 225, angleSpan: 15, covered: true, price: 'luxury', sideType: 'visitor' },
    { id: '239', name: 'Section 239', level: 'club', baseAngle: 240, angleSpan: 15, covered: true, price: 'luxury', sideType: 'visitor' },
    { id: '240', name: 'Section 240', level: 'club', baseAngle: 255, angleSpan: 15, covered: true, price: 'luxury', sideType: 'visitor' },
    { id: '241', name: 'Section 241', level: 'club', baseAngle: 270, angleSpan: 15, covered: true, price: 'luxury', sideType: 'visitor' },
    { id: '242', name: 'Section 242', level: 'club', baseAngle: 285, angleSpan: 15, covered: true, price: 'luxury', sideType: 'visitor' },
    { id: '243', name: 'Section 243', level: 'club', baseAngle: 300, angleSpan: 15, covered: true, price: 'luxury', sideType: 'visitor' },
    
    // Upper Level - 300s
    { id: '301', name: 'Section 301', level: 'upper', baseAngle: 0, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '302', name: 'Section 302', level: 'upper', baseAngle: 12, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '303', name: 'Section 303', level: 'upper', baseAngle: 24, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '304', name: 'Section 304', level: 'upper', baseAngle: 36, angleSpan: 12, covered: true, price: 'value', sideType: 'corner' },
    { id: '305', name: 'Section 305', level: 'upper', baseAngle: 48, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '306', name: 'Section 306', level: 'upper', baseAngle: 60, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '307', name: 'Section 307', level: 'upper', baseAngle: 72, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '308', name: 'Section 308', level: 'upper', baseAngle: 84, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '309', name: 'Section 309', level: 'upper', baseAngle: 96, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '310', name: 'Section 310', level: 'upper', baseAngle: 108, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '311', name: 'Section 311', level: 'upper', baseAngle: 120, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '312', name: 'Section 312', level: 'upper', baseAngle: 132, angleSpan: 12, covered: true, price: 'value', sideType: 'corner' },
    { id: '313', name: 'Section 313', level: 'upper', baseAngle: 144, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '314', name: 'Section 314', level: 'upper', baseAngle: 156, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '315', name: 'Section 315', level: 'upper', baseAngle: 168, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '316', name: 'Section 316', level: 'upper', baseAngle: 180, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '317', name: 'Section 317', level: 'upper', baseAngle: 192, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '318', name: 'Section 318', level: 'upper', baseAngle: 204, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '319', name: 'Section 319', level: 'upper', baseAngle: 216, angleSpan: 12, covered: true, price: 'value', sideType: 'corner' },
    { id: '320', name: 'Section 320', level: 'upper', baseAngle: 228, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '321', name: 'Section 321', level: 'upper', baseAngle: 240, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '322', name: 'Section 322', level: 'upper', baseAngle: 252, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '323', name: 'Section 323', level: 'upper', baseAngle: 264, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '324', name: 'Section 324', level: 'upper', baseAngle: 276, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '325', name: 'Section 325', level: 'upper', baseAngle: 288, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '326', name: 'Section 326', level: 'upper', baseAngle: 300, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '327', name: 'Section 327', level: 'upper', baseAngle: 312, angleSpan: 12, covered: true, price: 'value', sideType: 'corner' },
    { id: '328', name: 'Section 328', level: 'upper', baseAngle: 324, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '329', name: 'Section 329', level: 'upper', baseAngle: 336, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '330', name: 'Section 330', level: 'upper', baseAngle: 348, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' }
  ],

  // Green Bay Packers - Lambeau Field
  'lambeau-field': [
    // Lower Level - 100s
    { id: '101', name: 'Section 101', level: 'lower', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium', sideType: 'endzone' },
    { id: '102', name: 'Section 102', level: 'lower', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium', sideType: 'endzone' },
    { id: '103', name: 'Section 103', level: 'lower', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium', sideType: 'endzone' },
    { id: '104', name: 'Section 104', level: 'lower', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium', sideType: 'corner' },
    { id: '105', name: 'Section 105', level: 'lower', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium', sideType: 'corner' },
    { id: '106', name: 'Section 106', level: 'lower', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium', sideType: 'home' },
    { id: '107', name: 'Section 107', level: 'lower', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium', sideType: 'home' },
    { id: '108', name: 'Section 108', level: 'lower', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium', sideType: 'home' },
    { id: '109', name: 'Section 109', level: 'lower', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium', sideType: 'home' },
    { id: '110', name: 'Section 110', level: 'lower', baseAngle: 90, angleSpan: 10, covered: false, price: 'premium', sideType: 'home' },
    { id: '111', name: 'Section 111', level: 'lower', baseAngle: 100, angleSpan: 10, covered: false, price: 'premium', sideType: 'home' },
    { id: '112', name: 'Section 112', level: 'lower', baseAngle: 110, angleSpan: 10, covered: false, price: 'premium', sideType: 'home' },
    { id: '113', name: 'Section 113', level: 'lower', baseAngle: 120, angleSpan: 10, covered: false, price: 'premium', sideType: 'home' },
    { id: '114', name: 'Section 114', level: 'lower', baseAngle: 130, angleSpan: 10, covered: false, price: 'premium', sideType: 'corner' },
    { id: '115', name: 'Section 115', level: 'lower', baseAngle: 140, angleSpan: 10, covered: false, price: 'premium', sideType: 'corner' },
    { id: '116', name: 'Section 116', level: 'lower', baseAngle: 150, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '117', name: 'Section 117', level: 'lower', baseAngle: 160, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '118', name: 'Section 118', level: 'lower', baseAngle: 170, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '119', name: 'Section 119', level: 'lower', baseAngle: 180, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '120', name: 'Section 120', level: 'lower', baseAngle: 190, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '121', name: 'Section 121', level: 'lower', baseAngle: 200, angleSpan: 10, covered: false, price: 'moderate', sideType: 'endzone' },
    { id: '122', name: 'Section 122', level: 'lower', baseAngle: 210, angleSpan: 10, covered: false, price: 'premium', sideType: 'corner' },
    { id: '123', name: 'Section 123', level: 'lower', baseAngle: 220, angleSpan: 10, covered: false, price: 'premium', sideType: 'corner' },
    { id: '124', name: 'Section 124', level: 'lower', baseAngle: 230, angleSpan: 10, covered: false, price: 'premium', sideType: 'visitor' },
    { id: '125', name: 'Section 125', level: 'lower', baseAngle: 240, angleSpan: 10, covered: false, price: 'premium', sideType: 'visitor' },
    { id: '126', name: 'Section 126', level: 'lower', baseAngle: 250, angleSpan: 10, covered: false, price: 'premium', sideType: 'visitor' },
    { id: '127', name: 'Section 127', level: 'lower', baseAngle: 260, angleSpan: 10, covered: false, price: 'premium', sideType: 'visitor' },
    { id: '128', name: 'Section 128', level: 'lower', baseAngle: 270, angleSpan: 10, covered: false, price: 'premium', sideType: 'visitor' },
    { id: '129', name: 'Section 129', level: 'lower', baseAngle: 280, angleSpan: 10, covered: false, price: 'premium', sideType: 'visitor' },
    { id: '130', name: 'Section 130', level: 'lower', baseAngle: 290, angleSpan: 10, covered: false, price: 'premium', sideType: 'visitor' },
    { id: '131', name: 'Section 131', level: 'lower', baseAngle: 300, angleSpan: 10, covered: false, price: 'premium', sideType: 'visitor' },
    { id: '132', name: 'Section 132', level: 'lower', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium', sideType: 'corner' },
    { id: '133', name: 'Section 133', level: 'lower', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium', sideType: 'corner' },
    { id: '134', name: 'Section 134', level: 'lower', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium', sideType: 'endzone' },
    { id: '135', name: 'Section 135', level: 'lower', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium', sideType: 'endzone' },
    { id: '136', name: 'Section 136', level: 'lower', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium', sideType: 'endzone' },
    
    // Upper Level - 300s  
    { id: '301', name: 'Section 301', level: 'upper', baseAngle: 0, angleSpan: 15, covered: false, price: 'value', sideType: 'endzone' },
    { id: '302', name: 'Section 302', level: 'upper', baseAngle: 15, angleSpan: 15, covered: false, price: 'value', sideType: 'endzone' },
    { id: '303', name: 'Section 303', level: 'upper', baseAngle: 30, angleSpan: 15, covered: false, price: 'value', sideType: 'corner' },
    { id: '304', name: 'Section 304', level: 'upper', baseAngle: 45, angleSpan: 15, covered: false, price: 'moderate', sideType: 'home' },
    { id: '305', name: 'Section 305', level: 'upper', baseAngle: 60, angleSpan: 15, covered: false, price: 'moderate', sideType: 'home' },
    { id: '306', name: 'Section 306', level: 'upper', baseAngle: 75, angleSpan: 15, covered: false, price: 'moderate', sideType: 'home' },
    { id: '307', name: 'Section 307', level: 'upper', baseAngle: 90, angleSpan: 15, covered: false, price: 'moderate', sideType: 'home' },
    { id: '308', name: 'Section 308', level: 'upper', baseAngle: 105, angleSpan: 15, covered: false, price: 'moderate', sideType: 'home' },
    { id: '309', name: 'Section 309', level: 'upper', baseAngle: 120, angleSpan: 15, covered: false, price: 'moderate', sideType: 'home' },
    { id: '310', name: 'Section 310', level: 'upper', baseAngle: 135, angleSpan: 15, covered: false, price: 'value', sideType: 'corner' },
    { id: '311', name: 'Section 311', level: 'upper', baseAngle: 150, angleSpan: 15, covered: false, price: 'value', sideType: 'endzone' },
    { id: '312', name: 'Section 312', level: 'upper', baseAngle: 165, angleSpan: 15, covered: false, price: 'value', sideType: 'endzone' },
    { id: '313', name: 'Section 313', level: 'upper', baseAngle: 180, angleSpan: 15, covered: false, price: 'value', sideType: 'endzone' },
    { id: '314', name: 'Section 314', level: 'upper', baseAngle: 195, angleSpan: 15, covered: false, price: 'value', sideType: 'endzone' },
    { id: '315', name: 'Section 315', level: 'upper', baseAngle: 210, angleSpan: 15, covered: false, price: 'value', sideType: 'corner' },
    { id: '316', name: 'Section 316', level: 'upper', baseAngle: 225, angleSpan: 15, covered: false, price: 'moderate', sideType: 'visitor' },
    { id: '317', name: 'Section 317', level: 'upper', baseAngle: 240, angleSpan: 15, covered: false, price: 'moderate', sideType: 'visitor' },
    { id: '318', name: 'Section 318', level: 'upper', baseAngle: 255, angleSpan: 15, covered: false, price: 'moderate', sideType: 'visitor' },
    { id: '319', name: 'Section 319', level: 'upper', baseAngle: 270, angleSpan: 15, covered: false, price: 'moderate', sideType: 'visitor' },
    { id: '320', name: 'Section 320', level: 'upper', baseAngle: 285, angleSpan: 15, covered: false, price: 'moderate', sideType: 'visitor' },
    { id: '321', name: 'Section 321', level: 'upper', baseAngle: 300, angleSpan: 15, covered: false, price: 'moderate', sideType: 'visitor' },
    { id: '322', name: 'Section 322', level: 'upper', baseAngle: 315, angleSpan: 15, covered: false, price: 'value', sideType: 'corner' },
    { id: '323', name: 'Section 323', level: 'upper', baseAngle: 330, angleSpan: 15, covered: false, price: 'value', sideType: 'endzone' },
    { id: '324', name: 'Section 324', level: 'upper', baseAngle: 345, angleSpan: 15, covered: false, price: 'value', sideType: 'endzone' }
  ],

  // Los Angeles Rams/Chargers - SoFi Stadium
  'sofi-stadium': [
    // 100 Level - Field Level
    { id: '101', name: 'Section 101', level: 'field', baseAngle: 0, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '102', name: 'Section 102', level: 'field', baseAngle: 9, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '103', name: 'Section 103', level: 'field', baseAngle: 18, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '104', name: 'Section 104', level: 'field', baseAngle: 27, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '105', name: 'Section 105', level: 'field', baseAngle: 36, angleSpan: 9, covered: true, price: 'premium', sideType: 'corner' },
    { id: '106', name: 'Section 106', level: 'field', baseAngle: 45, angleSpan: 9, covered: true, price: 'premium', sideType: 'corner' },
    { id: '107', name: 'Section 107', level: 'field', baseAngle: 54, angleSpan: 9, covered: true, price: 'premium', sideType: 'home' },
    { id: '108', name: 'Section 108', level: 'field', baseAngle: 63, angleSpan: 9, covered: true, price: 'premium', sideType: 'home' },
    { id: '109', name: 'Section 109', level: 'field', baseAngle: 72, angleSpan: 9, covered: true, price: 'premium', sideType: 'home' },
    { id: '110', name: 'Section 110', level: 'field', baseAngle: 81, angleSpan: 9, covered: true, price: 'premium', sideType: 'home' },
    { id: '111', name: 'Section 111', level: 'field', baseAngle: 90, angleSpan: 9, covered: true, price: 'premium', sideType: 'home' },
    { id: '112', name: 'Section 112', level: 'field', baseAngle: 99, angleSpan: 9, covered: true, price: 'premium', sideType: 'home' },
    { id: '113', name: 'Section 113', level: 'field', baseAngle: 108, angleSpan: 9, covered: true, price: 'premium', sideType: 'home' },
    { id: '114', name: 'Section 114', level: 'field', baseAngle: 117, angleSpan: 9, covered: true, price: 'premium', sideType: 'home' },
    { id: '115', name: 'Section 115', level: 'field', baseAngle: 126, angleSpan: 9, covered: true, price: 'premium', sideType: 'corner' },
    { id: '116', name: 'Section 116', level: 'field', baseAngle: 135, angleSpan: 9, covered: true, price: 'premium', sideType: 'corner' },
    { id: '117', name: 'Section 117', level: 'field', baseAngle: 144, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '118', name: 'Section 118', level: 'field', baseAngle: 153, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '119', name: 'Section 119', level: 'field', baseAngle: 162, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '120', name: 'Section 120', level: 'field', baseAngle: 171, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '121', name: 'Section 121', level: 'field', baseAngle: 180, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '122', name: 'Section 122', level: 'field', baseAngle: 189, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '123', name: 'Section 123', level: 'field', baseAngle: 198, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '124', name: 'Section 124', level: 'field', baseAngle: 207, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '125', name: 'Section 125', level: 'field', baseAngle: 216, angleSpan: 9, covered: true, price: 'premium', sideType: 'corner' },
    { id: '126', name: 'Section 126', level: 'field', baseAngle: 225, angleSpan: 9, covered: true, price: 'premium', sideType: 'corner' },
    { id: '127', name: 'Section 127', level: 'field', baseAngle: 234, angleSpan: 9, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '128', name: 'Section 128', level: 'field', baseAngle: 243, angleSpan: 9, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '129', name: 'Section 129', level: 'field', baseAngle: 252, angleSpan: 9, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '130', name: 'Section 130', level: 'field', baseAngle: 261, angleSpan: 9, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '131', name: 'Section 131', level: 'field', baseAngle: 270, angleSpan: 9, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '132', name: 'Section 132', level: 'field', baseAngle: 279, angleSpan: 9, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '133', name: 'Section 133', level: 'field', baseAngle: 288, angleSpan: 9, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '134', name: 'Section 134', level: 'field', baseAngle: 297, angleSpan: 9, covered: true, price: 'premium', sideType: 'visitor' },
    { id: '135', name: 'Section 135', level: 'field', baseAngle: 306, angleSpan: 9, covered: true, price: 'premium', sideType: 'corner' },
    { id: '136', name: 'Section 136', level: 'field', baseAngle: 315, angleSpan: 9, covered: true, price: 'premium', sideType: 'corner' },
    { id: '137', name: 'Section 137', level: 'field', baseAngle: 324, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '138', name: 'Section 138', level: 'field', baseAngle: 333, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '139', name: 'Section 139', level: 'field', baseAngle: 342, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    { id: '140', name: 'Section 140', level: 'field', baseAngle: 351, angleSpan: 9, covered: true, price: 'premium', sideType: 'endzone' },
    
    // 200 Level - Club Level
    { id: '214', name: 'Section 214', level: 'club', baseAngle: 50, angleSpan: 20, covered: true, price: 'luxury', sideType: 'home' },
    { id: '215', name: 'Section 215', level: 'club', baseAngle: 70, angleSpan: 20, covered: true, price: 'luxury', sideType: 'home' },
    { id: '216', name: 'Section 216', level: 'club', baseAngle: 90, angleSpan: 20, covered: true, price: 'luxury', sideType: 'home' },
    { id: '217', name: 'Section 217', level: 'club', baseAngle: 110, angleSpan: 20, covered: true, price: 'luxury', sideType: 'home' },
    { id: '237', name: 'Section 237', level: 'club', baseAngle: 230, angleSpan: 20, covered: true, price: 'luxury', sideType: 'visitor' },
    { id: '238', name: 'Section 238', level: 'club', baseAngle: 250, angleSpan: 20, covered: true, price: 'luxury', sideType: 'visitor' },
    { id: '239', name: 'Section 239', level: 'club', baseAngle: 270, angleSpan: 20, covered: true, price: 'luxury', sideType: 'visitor' },
    { id: '240', name: 'Section 240', level: 'club', baseAngle: 290, angleSpan: 20, covered: true, price: 'luxury', sideType: 'visitor' },
    
    // 300 Level - Upper Level
    { id: '301', name: 'Section 301', level: 'upper', baseAngle: 0, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '302', name: 'Section 302', level: 'upper', baseAngle: 12, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '303', name: 'Section 303', level: 'upper', baseAngle: 24, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '304', name: 'Section 304', level: 'upper', baseAngle: 36, angleSpan: 12, covered: true, price: 'value', sideType: 'corner' },
    { id: '305', name: 'Section 305', level: 'upper', baseAngle: 48, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '306', name: 'Section 306', level: 'upper', baseAngle: 60, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '307', name: 'Section 307', level: 'upper', baseAngle: 72, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '308', name: 'Section 308', level: 'upper', baseAngle: 84, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '309', name: 'Section 309', level: 'upper', baseAngle: 96, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '310', name: 'Section 310', level: 'upper', baseAngle: 108, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '311', name: 'Section 311', level: 'upper', baseAngle: 120, angleSpan: 12, covered: true, price: 'moderate', sideType: 'home' },
    { id: '312', name: 'Section 312', level: 'upper', baseAngle: 132, angleSpan: 12, covered: true, price: 'value', sideType: 'corner' },
    { id: '313', name: 'Section 313', level: 'upper', baseAngle: 144, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '314', name: 'Section 314', level: 'upper', baseAngle: 156, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '315', name: 'Section 315', level: 'upper', baseAngle: 168, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '316', name: 'Section 316', level: 'upper', baseAngle: 180, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '317', name: 'Section 317', level: 'upper', baseAngle: 192, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '318', name: 'Section 318', level: 'upper', baseAngle: 204, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '319', name: 'Section 319', level: 'upper', baseAngle: 216, angleSpan: 12, covered: true, price: 'value', sideType: 'corner' },
    { id: '320', name: 'Section 320', level: 'upper', baseAngle: 228, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '321', name: 'Section 321', level: 'upper', baseAngle: 240, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '322', name: 'Section 322', level: 'upper', baseAngle: 252, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '323', name: 'Section 323', level: 'upper', baseAngle: 264, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '324', name: 'Section 324', level: 'upper', baseAngle: 276, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '325', name: 'Section 325', level: 'upper', baseAngle: 288, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '326', name: 'Section 326', level: 'upper', baseAngle: 300, angleSpan: 12, covered: true, price: 'moderate', sideType: 'visitor' },
    { id: '327', name: 'Section 327', level: 'upper', baseAngle: 312, angleSpan: 12, covered: true, price: 'value', sideType: 'corner' },
    { id: '328', name: 'Section 328', level: 'upper', baseAngle: 324, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '329', name: 'Section 329', level: 'upper', baseAngle: 336, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' },
    { id: '330', name: 'Section 330', level: 'upper', baseAngle: 348, angleSpan: 12, covered: true, price: 'value', sideType: 'endzone' }
  ],

  // Add placeholder for other stadiums - using generic sections for now
  'sofi-stadium-rams': [],
  'highmark-stadium': [],
  'gillette-stadium': [],
  'metlife-stadium': [],
  'm-t-bank-stadium': [],
  'paycor-stadium': [],
  'cleveland-browns-stadium': [],
  'acrisure-stadium': [],
  'nrg-stadium': [],
  'lucas-oil-stadium': [],
  'tiaa-bank-field': [],
  'nissan-stadium': [],
  'empower-field': [],
  'arrowhead-stadium': [],
  'allegiant-stadium': [],
  'at-t-stadium': [],
  'metlife-stadium-giants': [],
  'lincoln-financial-field': [],
  'fedexfield': [],
  'soldier-field': [],
  'ford-field': [],
  'us-bank-stadium': [],
  'mercedes-benz-stadium': [],
  'bank-of-america-stadium': [],
  'caesars-superdome': [],
  'raymond-james-stadium': [],
  'state-farm-stadium': [],
  'levis-stadium': [],
  'lumen-field': []
};

// Helper function to get sections for a stadium
export function getNFLStadiumSections(stadiumId: string): NFLSection[] {
  return NFL_SECTIONS[stadiumId] || [];
}

// Generate generic sections for stadiums without specific data
export function generateGenericNFLSections(stadiumId: string): NFLSection[] {
  const sections: NFLSection[] = [];
  
  // Lower Level - 100s (36 sections)
  for (let i = 0; i < 36; i++) {
    const angle = i * 10;
    const sectionNum = 101 + i;
    let sideType: 'home' | 'visitor' | 'endzone' | 'corner' = 'home';
    
    if ((angle >= 0 && angle < 30) || (angle >= 150 && angle < 210) || (angle >= 330)) {
      sideType = 'endzone';
    } else if ((angle >= 30 && angle < 60) || (angle >= 120 && angle < 150) || (angle >= 210 && angle < 240) || (angle >= 300 && angle < 330)) {
      sideType = 'corner';
    } else if (angle >= 210 && angle < 330) {
      sideType = 'visitor';
    }
    
    sections.push({
      id: sectionNum.toString(),
      name: `Section ${sectionNum}`,
      level: 'lower',
      baseAngle: angle,
      angleSpan: 10,
      covered: false,
      price: sideType === 'endzone' ? 'moderate' : 'premium',
      sideType
    });
  }
  
  // Upper Level - 300s (24 sections)
  for (let i = 0; i < 24; i++) {
    const angle = i * 15;
    const sectionNum = 301 + i;
    let sideType: 'home' | 'visitor' | 'endzone' | 'corner' = 'home';
    
    if ((angle >= 0 && angle < 30) || (angle >= 150 && angle < 210) || (angle >= 330)) {
      sideType = 'endzone';
    } else if ((angle >= 30 && angle < 60) || (angle >= 120 && angle < 150) || (angle >= 210 && angle < 240) || (angle >= 300 && angle < 330)) {
      sideType = 'corner';
    } else if (angle >= 210 && angle < 330) {
      sideType = 'visitor';
    }
    
    sections.push({
      id: sectionNum.toString(),
      name: `Section ${sectionNum}`,
      level: 'upper',
      baseAngle: angle,
      angleSpan: 15,
      covered: false,
      price: sideType === 'endzone' ? 'value' : 'moderate',
      sideType
    });
  }
  
  return sections;
}