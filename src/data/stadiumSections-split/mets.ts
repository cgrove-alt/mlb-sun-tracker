export interface StadiumSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  baseAngle: number; // Angle from home plate (0 = behind home, 90 = first base, 180 = center field, 270 = third base)
  angleSpan: number; // How many degrees this section spans
  rows?: number; // Number of rows in section
  covered: boolean; // Whether section has overhead coverage
  partialCoverage?: boolean; // Whether section has partial coverage (e.g., back rows only)
  coveredRows?: string; // Which rows are covered (e.g., "M-Z" or "last 5 rows")
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

export const stadiumSections = {
    stadiumId: 'mets',
    sections: [
      // Field Level - Delta Club
      { id: '15', name: 'Delta Club 15', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '16', name: 'Delta Club 16', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '17', name: 'Delta Club 17', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '18', name: 'Delta Club 18', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'luxury' },
      
      // Field Level - Field Box
      { id: '19', name: 'Field Box 19', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'premium' },
      { id: '20', name: 'Field Box 20', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'premium' },
      { id: '21', name: 'Field Box 21', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'premium' },
      { id: '22', name: 'Field Box 22', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'premium' },
      { id: '23', name: 'Field Box 23', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'premium' },
      { id: '24', name: 'Field Box 24', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'premium' },
      { id: '25', name: 'Field Box 25', level: 'field', baseAngle: 68, angleSpan: 8, covered: false, price: 'premium' },
      { id: '26', name: 'Field Box 26', level: 'field', baseAngle: 76, angleSpan: 8, covered: false, price: 'premium' },
      { id: '27', name: 'Field Box 27', level: 'field', baseAngle: 84, angleSpan: 8, covered: false, price: 'premium' },
      { id: '28', name: 'Field Box 28', level: 'field', baseAngle: 92, angleSpan: 8, covered: false, price: 'premium' },
      { id: '29', name: 'Field Box 29', level: 'field', baseAngle: 100, angleSpan: 8, covered: false, price: 'premium' },
      { id: '30', name: 'Field Box 30', level: 'field', baseAngle: 108, angleSpan: 8, covered: false, price: 'premium' },
      { id: '31', name: 'Field Box 31', level: 'field', baseAngle: 116, angleSpan: 8, covered: false, price: 'premium' },
      { id: '32', name: 'Field Box 32', level: 'field', baseAngle: 124, angleSpan: 8, covered: false, price: 'premium' },
      { id: '33', name: 'Field Box 33', level: 'field', baseAngle: 132, angleSpan: 8, covered: false, price: 'premium' },
      
      // Field Level - Outfield
      { id: '34', name: 'Left Field 34', level: 'field', baseAngle: 140, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '35', name: 'Left Field 35', level: 'field', baseAngle: 148, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '36', name: 'Left Field 36', level: 'field', baseAngle: 156, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '37', name: 'Left Field 37', level: 'field', baseAngle: 164, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '38', name: 'Left Field 38', level: 'field', baseAngle: 172, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '39', name: 'Center Field 39', level: 'field', baseAngle: 180, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '40', name: 'Center Field 40', level: 'field', baseAngle: 188, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '41', name: 'Right Field 41', level: 'field', baseAngle: 196, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '42', name: 'Right Field 42', level: 'field', baseAngle: 204, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '43', name: 'Right Field 43', level: 'field', baseAngle: 212, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '44', name: 'Right Field 44', level: 'field', baseAngle: 220, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '45', name: 'Right Field 45', level: 'field', baseAngle: 228, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '46', name: 'Right Field 46', level: 'field', baseAngle: 236, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '47', name: 'Right Field 47', level: 'field', baseAngle: 244, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '48', name: 'Right Field 48', level: 'field', baseAngle: 252, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Promenade Level
      { id: '101', name: 'Promenade 101', level: 'lower', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: '102', name: 'Promenade 102', level: 'lower', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: '103', name: 'Promenade 103', level: 'lower', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: '104', name: 'Promenade 104', level: 'lower', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: '105', name: 'Promenade 105', level: 'lower', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: '106', name: 'Promenade 106', level: 'lower', baseAngle: 20, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '107', name: 'Promenade 107', level: 'lower', baseAngle: 26, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '108', name: 'Promenade 108', level: 'lower', baseAngle: 32, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '109', name: 'Promenade 109', level: 'lower', baseAngle: 38, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '110', name: 'Promenade 110', level: 'lower', baseAngle: 44, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '111', name: 'Promenade 111', level: 'lower', baseAngle: 50, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '112', name: 'Promenade 112', level: 'lower', baseAngle: 56, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '113', name: 'Promenade 113', level: 'lower', baseAngle: 62, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '114', name: 'Promenade 114', level: 'lower', baseAngle: 68, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '115', name: 'Promenade 115', level: 'lower', baseAngle: 74, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '116', name: 'Promenade 116', level: 'lower', baseAngle: 80, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '117', name: 'Promenade 117', level: 'lower', baseAngle: 86, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '118', name: 'Promenade 118', level: 'lower', baseAngle: 92, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '119', name: 'Promenade 119', level: 'lower', baseAngle: 98, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '120', name: 'Promenade 120', level: 'lower', baseAngle: 104, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '121', name: 'Promenade 121', level: 'lower', baseAngle: 110, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '122', name: 'Promenade 122', level: 'lower', baseAngle: 116, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '123', name: 'Promenade 123', level: 'lower', baseAngle: 122, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '124', name: 'Promenade 124', level: 'lower', baseAngle: 128, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '125', name: 'Promenade 125', level: 'lower', baseAngle: 134, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '126', name: 'Promenade 126', level: 'lower', baseAngle: 140, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '127', name: 'Promenade 127', level: 'lower', baseAngle: 146, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '128', name: 'Promenade 128', level: 'lower', baseAngle: 152, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '129', name: 'Promenade 129', level: 'lower', baseAngle: 158, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '130', name: 'Promenade 130', level: 'lower', baseAngle: 164, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '131', name: 'Promenade 131', level: 'lower', baseAngle: 170, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '132', name: 'Promenade 132', level: 'lower', baseAngle: 176, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '133', name: 'Promenade 133', level: 'lower', baseAngle: 182, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '134', name: 'Promenade 134', level: 'lower', baseAngle: 188, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '135', name: 'Promenade 135', level: 'lower', baseAngle: 194, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '136', name: 'Promenade 136', level: 'lower', baseAngle: 200, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '137', name: 'Promenade 137', level: 'lower', baseAngle: 206, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '138', name: 'Promenade 138', level: 'lower', baseAngle: 212, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '139', name: 'Promenade 139', level: 'lower', baseAngle: 218, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '140', name: 'Promenade 140', level: 'lower', baseAngle: 224, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '141', name: 'Promenade 141', level: 'lower', baseAngle: 230, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '142', name: 'Promenade 142', level: 'lower', baseAngle: 236, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '143', name: 'Promenade 143', level: 'lower', baseAngle: 242, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '144', name: 'Promenade 144', level: 'lower', baseAngle: 248, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '145', name: 'Promenade 145', level: 'lower', baseAngle: 254, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '146', name: 'Promenade 146', level: 'lower', baseAngle: 260, angleSpan: 6, covered: false, price: 'moderate' },
      
      // Excelsior Level
      { id: '301', name: 'Excelsior 301', level: 'upper', baseAngle: 340, angleSpan: 8, covered: true, price: 'value' },
      { id: '302', name: 'Excelsior 302', level: 'upper', baseAngle: 348, angleSpan: 8, covered: true, price: 'value' },
      { id: '303', name: 'Excelsior 303', level: 'upper', baseAngle: 356, angleSpan: 8, covered: true, price: 'value' },
      { id: '304', name: 'Excelsior 304', level: 'upper', baseAngle: 4, angleSpan: 8, covered: true, price: 'value' },
      { id: '305', name: 'Excelsior 305', level: 'upper', baseAngle: 12, angleSpan: 8, covered: true, price: 'value' },
      { id: '306', name: 'Excelsior 306', level: 'upper', baseAngle: 20, angleSpan: 6, covered: false, price: 'value' },
      { id: '307', name: 'Excelsior 307', level: 'upper', baseAngle: 26, angleSpan: 6, covered: false, price: 'value' },
      { id: '308', name: 'Excelsior 308', level: 'upper', baseAngle: 32, angleSpan: 6, covered: false, price: 'value' },
      { id: '309', name: 'Excelsior 309', level: 'upper', baseAngle: 38, angleSpan: 6, covered: false, price: 'value' },
      { id: '310', name: 'Excelsior 310', level: 'upper', baseAngle: 44, angleSpan: 6, covered: false, price: 'value' },
      { id: '311', name: 'Excelsior 311', level: 'upper', baseAngle: 50, angleSpan: 6, covered: false, price: 'value' },
      { id: '312', name: 'Excelsior 312', level: 'upper', baseAngle: 56, angleSpan: 6, covered: false, price: 'value' },
      { id: '313', name: 'Excelsior 313', level: 'upper', baseAngle: 62, angleSpan: 6, covered: false, price: 'value' },
      { id: '314', name: 'Excelsior 314', level: 'upper', baseAngle: 68, angleSpan: 6, covered: false, price: 'value' },
      { id: '315', name: 'Excelsior 315', level: 'upper', baseAngle: 74, angleSpan: 6, covered: false, price: 'value' },
      { id: '316', name: 'Excelsior 316', level: 'upper', baseAngle: 80, angleSpan: 6, covered: false, price: 'value' },
      { id: '317', name: 'Excelsior 317', level: 'upper', baseAngle: 86, angleSpan: 6, covered: false, price: 'value' },
      { id: '318', name: 'Excelsior 318', level: 'upper', baseAngle: 92, angleSpan: 6, covered: false, price: 'value' },
      { id: '319', name: 'Excelsior 319', level: 'upper', baseAngle: 98, angleSpan: 6, covered: false, price: 'value' },
      { id: '320', name: 'Excelsior 320', level: 'upper', baseAngle: 104, angleSpan: 6, covered: false, price: 'value' },
      { id: '321', name: 'Excelsior 321', level: 'upper', baseAngle: 110, angleSpan: 6, covered: false, price: 'value' },
      { id: '322', name: 'Excelsior 322', level: 'upper', baseAngle: 116, angleSpan: 6, covered: false, price: 'value' },
      { id: '323', name: 'Excelsior 323', level: 'upper', baseAngle: 122, angleSpan: 6, covered: false, price: 'value' },
      { id: '324', name: 'Excelsior 324', level: 'upper', baseAngle: 128, angleSpan: 6, covered: false, price: 'value' },
      { id: '325', name: 'Excelsior 325', level: 'upper', baseAngle: 134, angleSpan: 6, covered: false, price: 'value' },
      { id: '326', name: 'Excelsior 326', level: 'upper', baseAngle: 140, angleSpan: 6, covered: false, price: 'value' },
      { id: '327', name: 'Excelsior 327', level: 'upper', baseAngle: 146, angleSpan: 6, covered: false, price: 'value' },
      { id: '328', name: 'Excelsior 328', level: 'upper', baseAngle: 152, angleSpan: 6, covered: false, price: 'value' },
      { id: '329', name: 'Excelsior 329', level: 'upper', baseAngle: 158, angleSpan: 6, covered: false, price: 'value' },
      { id: '330', name: 'Excelsior 330', level: 'upper', baseAngle: 164, angleSpan: 6, covered: false, price: 'value' },
      { id: '331', name: 'Excelsior 331', level: 'upper', baseAngle: 170, angleSpan: 6, covered: false, price: 'value' },
      { id: '332', name: 'Excelsior 332', level: 'upper', baseAngle: 176, angleSpan: 6, covered: false, price: 'value' },
      { id: '333', name: 'Excelsior 333', level: 'upper', baseAngle: 182, angleSpan: 6, covered: false, price: 'value' },
      { id: '334', name: 'Excelsior 334', level: 'upper', baseAngle: 188, angleSpan: 6, covered: false, price: 'value' },
      { id: '335', name: 'Excelsior 335', level: 'upper', baseAngle: 194, angleSpan: 6, covered: false, price: 'value' },
      { id: '336', name: 'Excelsior 336', level: 'upper', baseAngle: 200, angleSpan: 6, covered: false, price: 'value' },
      { id: '337', name: 'Excelsior 337', level: 'upper', baseAngle: 206, angleSpan: 6, covered: false, price: 'value' },
      { id: '338', name: 'Excelsior 338', level: 'upper', baseAngle: 212, angleSpan: 6, covered: false, price: 'value' },
      { id: '339', name: 'Excelsior 339', level: 'upper', baseAngle: 218, angleSpan: 6, covered: false, price: 'value' },
      { id: '340', name: 'Excelsior 340', level: 'upper', baseAngle: 224, angleSpan: 6, covered: false, price: 'value' },
      
      // Upper Deck
      { id: '401', name: 'Upper Deck 401', level: 'upper', baseAngle: 340, angleSpan: 8, covered: true, price: 'value' },
      { id: '402', name: 'Upper Deck 402', level: 'upper', baseAngle: 348, angleSpan: 8, covered: true, price: 'value' },
      { id: '403', name: 'Upper Deck 403', level: 'upper', baseAngle: 356, angleSpan: 8, covered: true, price: 'value' },
      { id: '404', name: 'Upper Deck 404', level: 'upper', baseAngle: 4, angleSpan: 8, covered: true, price: 'value' },
      { id: '405', name: 'Upper Deck 405', level: 'upper', baseAngle: 12, angleSpan: 8, covered: true, price: 'value' },
      { id: '406', name: 'Upper Deck 406', level: 'upper', baseAngle: 20, angleSpan: 6, covered: false, price: 'value' },
      { id: '407', name: 'Upper Deck 407', level: 'upper', baseAngle: 26, angleSpan: 6, covered: false, price: 'value' },
      { id: '408', name: 'Upper Deck 408', level: 'upper', baseAngle: 32, angleSpan: 6, covered: false, price: 'value' },
      { id: '409', name: 'Upper Deck 409', level: 'upper', baseAngle: 38, angleSpan: 6, covered: false, price: 'value' },
      { id: '410', name: 'Upper Deck 410', level: 'upper', baseAngle: 44, angleSpan: 6, covered: false, price: 'value' },
      { id: '411', name: 'Upper Deck 411', level: 'upper', baseAngle: 50, angleSpan: 6, covered: false, price: 'value' },
      { id: '412', name: 'Upper Deck 412', level: 'upper', baseAngle: 56, angleSpan: 6, covered: false, price: 'value' },
      { id: '413', name: 'Upper Deck 413', level: 'upper', baseAngle: 62, angleSpan: 6, covered: false, price: 'value' },
      { id: '414', name: 'Upper Deck 414', level: 'upper', baseAngle: 68, angleSpan: 6, covered: false, price: 'value' },
      { id: '415', name: 'Upper Deck 415', level: 'upper', baseAngle: 74, angleSpan: 6, covered: false, price: 'value' },
      { id: '416', name: 'Upper Deck 416', level: 'upper', baseAngle: 80, angleSpan: 6, covered: false, price: 'value' },
      { id: '417', name: 'Upper Deck 417', level: 'upper', baseAngle: 86, angleSpan: 6, covered: false, price: 'value' },
      { id: '418', name: 'Upper Deck 418', level: 'upper', baseAngle: 92, angleSpan: 6, covered: false, price: 'value' },
      { id: '419', name: 'Upper Deck 419', level: 'upper', baseAngle: 98, angleSpan: 6, covered: false, price: 'value' },
      { id: '420', name: 'Upper Deck 420', level: 'upper', baseAngle: 104, angleSpan: 6, covered: false, price: 'value' },
      { id: '421', name: 'Upper Deck 421', level: 'upper', baseAngle: 110, angleSpan: 6, covered: false, price: 'value' },
      { id: '422', name: 'Upper Deck 422', level: 'upper', baseAngle: 116, angleSpan: 6, covered: false, price: 'value' },
      { id: '423', name: 'Upper Deck 423', level: 'upper', baseAngle: 122, angleSpan: 6, covered: false, price: 'value' },
      { id: '424', name: 'Upper Deck 424', level: 'upper', baseAngle: 128, angleSpan: 6, covered: false, price: 'value' },
      { id: '425', name: 'Upper Deck 425', level: 'upper', baseAngle: 134, angleSpan: 6, covered: false, price: 'value' },
      { id: '426', name: 'Upper Deck 426', level: 'upper', baseAngle: 140, angleSpan: 6, covered: false, price: 'value' },
      { id: '427', name: 'Upper Deck 427', level: 'upper', baseAngle: 146, angleSpan: 6, covered: false, price: 'value' },
      { id: '428', name: 'Upper Deck 428', level: 'upper', baseAngle: 152, angleSpan: 6, covered: false, price: 'value' },
      { id: '429', name: 'Upper Deck 429', level: 'upper', baseAngle: 158, angleSpan: 6, covered: false, price: 'value' },
      { id: '430', name: 'Upper Deck 430', level: 'upper', baseAngle: 164, angleSpan: 6, covered: false, price: 'value' },
      { id: '431', name: 'Upper Deck 431', level: 'upper', baseAngle: 170, angleSpan: 6, covered: false, price: 'value' },
      { id: '432', name: 'Upper Deck 432', level: 'upper', baseAngle: 176, angleSpan: 6, covered: false, price: 'value' },
      { id: '433', name: 'Upper Deck 433', level: 'upper', baseAngle: 182, angleSpan: 6, covered: false, price: 'value' },
      { id: '434', name: 'Upper Deck 434', level: 'upper', baseAngle: 188, angleSpan: 6, covered: false, price: 'value' },
      { id: '435', name: 'Upper Deck 435', level: 'upper', baseAngle: 194, angleSpan: 6, covered: false, price: 'value' },
      { id: '436', name: 'Upper Deck 436', level: 'upper', baseAngle: 200, angleSpan: 6, covered: false, price: 'value' },
      { id: '437', name: 'Upper Deck 437', level: 'upper', baseAngle: 206, angleSpan: 6, covered: false, price: 'value' },
      { id: '438', name: 'Upper Deck 438', level: 'upper', baseAngle: 212, angleSpan: 6, covered: false, price: 'value' },
      { id: '439', name: 'Upper Deck 439', level: 'upper', baseAngle: 218, angleSpan: 6, covered: false, price: 'value' },
      { id: '440', name: 'Upper Deck 440', level: 'upper', baseAngle: 224, angleSpan: 6, covered: false, price: 'value' },
      { id: '441', name: 'Upper Deck 441', level: 'upper', baseAngle: 230, angleSpan: 6, covered: false, price: 'value' },
      { id: '442', name: 'Upper Deck 442', level: 'upper', baseAngle: 236, angleSpan: 6, covered: false, price: 'value' },
      { id: '443', name: 'Upper Deck 443', level: 'upper', baseAngle: 242, angleSpan: 6, covered: false, price: 'value' },
      { id: '444', name: 'Upper Deck 444', level: 'upper', baseAngle: 248, angleSpan: 6, covered: false, price: 'value' },
      { id: '445', name: 'Upper Deck 445', level: 'upper', baseAngle: 254, angleSpan: 6, covered: false, price: 'value' },
      { id: '446', name: 'Upper Deck 446', level: 'upper', baseAngle: 260, angleSpan: 6, covered: false, price: 'value' },
    ]
  };
