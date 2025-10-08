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
    stadiumId: 'cardinals',
    sections: [
      // Field Level - Home Plate Box
      { id: '140', name: 'Home Plate Box 140', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '141', name: 'Home Plate Box 141', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '142', name: 'Home Plate Box 142', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '143', name: 'Home Plate Box 143', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'luxury' },
      
      // Field Level - Field Box
      { id: '144', name: 'Field Box 144', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'premium' },
      { id: '145', name: 'Field Box 145', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'premium' },
      { id: '146', name: 'Field Box 146', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'premium' },
      { id: '147', name: 'Field Box 147', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'premium' },
      { id: '148', name: 'Field Box 148', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'premium' },
      { id: '149', name: 'Field Box 149', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'premium' },
      { id: '150', name: 'Field Box 150', level: 'field', baseAngle: 68, angleSpan: 8, covered: false, price: 'premium' },
      { id: '151', name: 'Field Box 151', level: 'field', baseAngle: 76, angleSpan: 8, covered: false, price: 'premium' },
      { id: '152', name: 'Field Box 152', level: 'field', baseAngle: 84, angleSpan: 8, covered: false, price: 'premium' },
      { id: '153', name: 'Field Box 153', level: 'field', baseAngle: 92, angleSpan: 8, covered: false, price: 'premium' },
      { id: '154', name: 'Field Box 154', level: 'field', baseAngle: 100, angleSpan: 8, covered: false, price: 'premium' },
      { id: '155', name: 'Field Box 155', level: 'field', baseAngle: 108, angleSpan: 8, covered: false, price: 'premium' },
      { id: '156', name: 'Field Box 156', level: 'field', baseAngle: 116, angleSpan: 8, covered: false, price: 'premium' },
      { id: '157', name: 'Field Box 157', level: 'field', baseAngle: 124, angleSpan: 8, covered: false, price: 'premium' },
      { id: '158', name: 'Field Box 158', level: 'field', baseAngle: 132, angleSpan: 8, covered: false, price: 'premium' },
      
      // Field Level - Outfield Box
      { id: '159', name: 'Outfield Box 159', level: 'field', baseAngle: 140, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '160', name: 'Outfield Box 160', level: 'field', baseAngle: 148, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '161', name: 'Outfield Box 161', level: 'field', baseAngle: 156, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '162', name: 'Outfield Box 162', level: 'field', baseAngle: 164, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '163', name: 'Outfield Box 163', level: 'field', baseAngle: 172, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '164', name: 'Outfield Box 164', level: 'field', baseAngle: 180, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '165', name: 'Outfield Box 165', level: 'field', baseAngle: 188, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '166', name: 'Outfield Box 166', level: 'field', baseAngle: 196, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '167', name: 'Outfield Box 167', level: 'field', baseAngle: 204, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '168', name: 'Outfield Box 168', level: 'field', baseAngle: 212, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '169', name: 'Outfield Box 169', level: 'field', baseAngle: 220, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '170', name: 'Outfield Box 170', level: 'field', baseAngle: 228, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '171', name: 'Outfield Box 171', level: 'field', baseAngle: 236, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '172', name: 'Outfield Box 172', level: 'field', baseAngle: 244, angleSpan: 8, covered: false, price: 'moderate' },
      { id: '173', name: 'Outfield Box 173', level: 'field', baseAngle: 252, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Lower Level - Busch Stadium Club
      { id: '140A', name: 'Busch Stadium Club 140A', level: 'lower', baseAngle: 340, angleSpan: 8, covered: true, price: 'premium' },
      { id: '141A', name: 'Busch Stadium Club 141A', level: 'lower', baseAngle: 348, angleSpan: 8, covered: true, price: 'premium' },
      { id: '142A', name: 'Busch Stadium Club 142A', level: 'lower', baseAngle: 356, angleSpan: 8, covered: true, price: 'premium' },
      { id: '143A', name: 'Busch Stadium Club 143A', level: 'lower', baseAngle: 4, angleSpan: 8, covered: true, price: 'premium' },
      { id: '144A', name: 'Busch Stadium Club 144A', level: 'lower', baseAngle: 12, angleSpan: 8, covered: true, price: 'premium' },
      { id: '145A', name: 'Lower Box 145A', level: 'lower', baseAngle: 20, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '146A', name: 'Lower Box 146A', level: 'lower', baseAngle: 26, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '147A', name: 'Lower Box 147A', level: 'lower', baseAngle: 32, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '148A', name: 'Lower Box 148A', level: 'lower', baseAngle: 38, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '149A', name: 'Lower Box 149A', level: 'lower', baseAngle: 44, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '150A', name: 'Lower Box 150A', level: 'lower', baseAngle: 50, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '151A', name: 'Lower Box 151A', level: 'lower', baseAngle: 56, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '152A', name: 'Lower Box 152A', level: 'lower', baseAngle: 62, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '153A', name: 'Lower Box 153A', level: 'lower', baseAngle: 68, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '154A', name: 'Lower Box 154A', level: 'lower', baseAngle: 74, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '155A', name: 'Lower Box 155A', level: 'lower', baseAngle: 80, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '156A', name: 'Lower Box 156A', level: 'lower', baseAngle: 86, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '157A', name: 'Lower Box 157A', level: 'lower', baseAngle: 92, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '158A', name: 'Lower Box 158A', level: 'lower', baseAngle: 98, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '159A', name: 'Lower Box 159A', level: 'lower', baseAngle: 104, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '160A', name: 'Lower Box 160A', level: 'lower', baseAngle: 110, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '161A', name: 'Lower Box 161A', level: 'lower', baseAngle: 116, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '162A', name: 'Lower Box 162A', level: 'lower', baseAngle: 122, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '163A', name: 'Lower Box 163A', level: 'lower', baseAngle: 128, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '164A', name: 'Lower Box 164A', level: 'lower', baseAngle: 134, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '165A', name: 'Lower Box 165A', level: 'lower', baseAngle: 140, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '166A', name: 'Lower Box 166A', level: 'lower', baseAngle: 146, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '167A', name: 'Lower Box 167A', level: 'lower', baseAngle: 152, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '168A', name: 'Lower Box 168A', level: 'lower', baseAngle: 158, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '169A', name: 'Lower Box 169A', level: 'lower', baseAngle: 164, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '170A', name: 'Lower Box 170A', level: 'lower', baseAngle: 170, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '171A', name: 'Lower Box 171A', level: 'lower', baseAngle: 176, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '172A', name: 'Lower Box 172A', level: 'lower', baseAngle: 182, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '173A', name: 'Lower Box 173A', level: 'lower', baseAngle: 188, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '174A', name: 'Lower Box 174A', level: 'lower', baseAngle: 194, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '175A', name: 'Lower Box 175A', level: 'lower', baseAngle: 200, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '176A', name: 'Lower Box 176A', level: 'lower', baseAngle: 206, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '177A', name: 'Lower Box 177A', level: 'lower', baseAngle: 212, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '178A', name: 'Lower Box 178A', level: 'lower', baseAngle: 218, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '179A', name: 'Lower Box 179A', level: 'lower', baseAngle: 224, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '180A', name: 'Lower Box 180A', level: 'lower', baseAngle: 230, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '181A', name: 'Lower Box 181A', level: 'lower', baseAngle: 236, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '182A', name: 'Lower Box 182A', level: 'lower', baseAngle: 242, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '183A', name: 'Lower Box 183A', level: 'lower', baseAngle: 248, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '184A', name: 'Lower Box 184A', level: 'lower', baseAngle: 254, angleSpan: 6, covered: false, price: 'moderate' },
      { id: '185A', name: 'Lower Box 185A', level: 'lower', baseAngle: 260, angleSpan: 6, covered: false, price: 'moderate' },
      
      // Club Level - Redbird Club
      { id: '240', name: 'Redbird Club 240', level: 'club', baseAngle: 340, angleSpan: 8, covered: true, price: 'premium' },
      { id: '241', name: 'Redbird Club 241', level: 'club', baseAngle: 348, angleSpan: 8, covered: true, price: 'premium' },
      { id: '242', name: 'Redbird Club 242', level: 'club', baseAngle: 356, angleSpan: 8, covered: true, price: 'premium' },
      { id: '243', name: 'Redbird Club 243', level: 'club', baseAngle: 4, angleSpan: 8, covered: true, price: 'premium' },
      { id: '244', name: 'Redbird Club 244', level: 'club', baseAngle: 12, angleSpan: 8, covered: true, price: 'premium' },
      { id: '245', name: 'Redbird Club 245', level: 'club', baseAngle: 20, angleSpan: 6, covered: false, price: 'premium' },
      { id: '246', name: 'Redbird Club 246', level: 'club', baseAngle: 26, angleSpan: 6, covered: false, price: 'premium' },
      { id: '247', name: 'Redbird Club 247', level: 'club', baseAngle: 32, angleSpan: 6, covered: false, price: 'premium' },
      { id: '248', name: 'Redbird Club 248', level: 'club', baseAngle: 38, angleSpan: 6, covered: false, price: 'premium' },
      { id: '249', name: 'Redbird Club 249', level: 'club', baseAngle: 44, angleSpan: 6, covered: false, price: 'premium' },
      { id: '250', name: 'Redbird Club 250', level: 'club', baseAngle: 50, angleSpan: 6, covered: false, price: 'premium' },
      { id: '251', name: 'Redbird Club 251', level: 'club', baseAngle: 56, angleSpan: 6, covered: false, price: 'premium' },
      { id: '252', name: 'Redbird Club 252', level: 'club', baseAngle: 62, angleSpan: 6, covered: false, price: 'premium' },
      { id: '253', name: 'Redbird Club 253', level: 'club', baseAngle: 68, angleSpan: 6, covered: false, price: 'premium' },
      { id: '254', name: 'Redbird Club 254', level: 'club', baseAngle: 74, angleSpan: 6, covered: false, price: 'premium' },
      { id: '255', name: 'Redbird Club 255', level: 'club', baseAngle: 80, angleSpan: 6, covered: false, price: 'premium' },
      { id: '256', name: 'Redbird Club 256', level: 'club', baseAngle: 86, angleSpan: 6, covered: false, price: 'premium' },
      { id: '257', name: 'Redbird Club 257', level: 'club', baseAngle: 92, angleSpan: 6, covered: false, price: 'premium' },
      { id: '258', name: 'Redbird Club 258', level: 'club', baseAngle: 98, angleSpan: 6, covered: false, price: 'premium' },
      { id: '259', name: 'Redbird Club 259', level: 'club', baseAngle: 104, angleSpan: 6, covered: false, price: 'premium' },
      { id: '260', name: 'Redbird Club 260', level: 'club', baseAngle: 110, angleSpan: 6, covered: false, price: 'premium' },
      { id: '261', name: 'Redbird Club 261', level: 'club', baseAngle: 116, angleSpan: 6, covered: false, price: 'premium' },
      { id: '262', name: 'Redbird Club 262', level: 'club', baseAngle: 122, angleSpan: 6, covered: false, price: 'premium' },
      { id: '263', name: 'Redbird Club 263', level: 'club', baseAngle: 128, angleSpan: 6, covered: false, price: 'premium' },
      { id: '264', name: 'Redbird Club 264', level: 'club', baseAngle: 134, angleSpan: 6, covered: false, price: 'premium' },
      { id: '265', name: 'Redbird Club 265', level: 'club', baseAngle: 140, angleSpan: 6, covered: false, price: 'premium' },
      { id: '266', name: 'Redbird Club 266', level: 'club', baseAngle: 146, angleSpan: 6, covered: false, price: 'premium' },
      { id: '267', name: 'Redbird Club 267', level: 'club', baseAngle: 152, angleSpan: 6, covered: false, price: 'premium' },
      { id: '268', name: 'Redbird Club 268', level: 'club', baseAngle: 158, angleSpan: 6, covered: false, price: 'premium' },
      { id: '269', name: 'Redbird Club 269', level: 'club', baseAngle: 164, angleSpan: 6, covered: false, price: 'premium' },
      { id: '270', name: 'Redbird Club 270', level: 'club', baseAngle: 170, angleSpan: 6, covered: false, price: 'premium' },
      { id: '271', name: 'Redbird Club 271', level: 'club', baseAngle: 176, angleSpan: 6, covered: false, price: 'premium' },
      { id: '272', name: 'Redbird Club 272', level: 'club', baseAngle: 182, angleSpan: 6, covered: false, price: 'premium' },
      { id: '273', name: 'Redbird Club 273', level: 'club', baseAngle: 188, angleSpan: 6, covered: false, price: 'premium' },
      { id: '274', name: 'Redbird Club 274', level: 'club', baseAngle: 194, angleSpan: 6, covered: false, price: 'premium' },
      { id: '275', name: 'Redbird Club 275', level: 'club', baseAngle: 200, angleSpan: 6, covered: false, price: 'premium' },
      { id: '276', name: 'Redbird Club 276', level: 'club', baseAngle: 206, angleSpan: 6, covered: false, price: 'premium' },
      { id: '277', name: 'Redbird Club 277', level: 'club', baseAngle: 212, angleSpan: 6, covered: false, price: 'premium' },
      { id: '278', name: 'Redbird Club 278', level: 'club', baseAngle: 218, angleSpan: 6, covered: false, price: 'premium' },
      { id: '279', name: 'Redbird Club 279', level: 'club', baseAngle: 224, angleSpan: 6, covered: false, price: 'premium' },
      { id: '280', name: 'Redbird Club 280', level: 'club', baseAngle: 230, angleSpan: 6, covered: true, price: 'premium' },
      { id: '281', name: 'Redbird Club 281', level: 'club', baseAngle: 236, angleSpan: 6, covered: true, price: 'premium' },
      { id: '282', name: 'Redbird Club 282', level: 'club', baseAngle: 242, angleSpan: 6, covered: true, price: 'premium' },
      { id: '283', name: 'Redbird Club 283', level: 'club', baseAngle: 248, angleSpan: 6, covered: true, price: 'premium' },
      
      // Upper Level - Terrace
      { id: '340', name: 'Terrace 340', level: 'upper', baseAngle: 340, angleSpan: 8, covered: true, price: 'value' },
      { id: '341', name: 'Terrace 341', level: 'upper', baseAngle: 348, angleSpan: 8, covered: true, price: 'value' },
      { id: '342', name: 'Terrace 342', level: 'upper', baseAngle: 356, angleSpan: 8, covered: true, price: 'value' },
      { id: '343', name: 'Terrace 343', level: 'upper', baseAngle: 4, angleSpan: 8, covered: true, price: 'value' },
      { id: '344', name: 'Terrace 344', level: 'upper', baseAngle: 12, angleSpan: 8, covered: true, price: 'value' },
      { id: '345', name: 'Terrace 345', level: 'upper', baseAngle: 20, angleSpan: 6, covered: false, price: 'value' },
      { id: '346', name: 'Terrace 346', level: 'upper', baseAngle: 26, angleSpan: 6, covered: false, price: 'value' },
      { id: '347', name: 'Terrace 347', level: 'upper', baseAngle: 32, angleSpan: 6, covered: false, price: 'value' },
      { id: '348', name: 'Terrace 348', level: 'upper', baseAngle: 38, angleSpan: 6, covered: false, price: 'value' },
      { id: '349', name: 'Terrace 349', level: 'upper', baseAngle: 44, angleSpan: 6, covered: false, price: 'value' },
      { id: '350', name: 'Terrace 350', level: 'upper', baseAngle: 50, angleSpan: 6, covered: false, price: 'value' },
      { id: '351', name: 'Terrace 351', level: 'upper', baseAngle: 56, angleSpan: 6, covered: false, price: 'value' },
      { id: '352', name: 'Terrace 352', level: 'upper', baseAngle: 62, angleSpan: 6, covered: false, price: 'value' },
      { id: '353', name: 'Terrace 353', level: 'upper', baseAngle: 68, angleSpan: 6, covered: false, price: 'value' },
      { id: '354', name: 'Terrace 354', level: 'upper', baseAngle: 74, angleSpan: 6, covered: false, price: 'value' },
      { id: '355', name: 'Terrace 355', level: 'upper', baseAngle: 80, angleSpan: 6, covered: false, price: 'value' },
      { id: '356', name: 'Terrace 356', level: 'upper', baseAngle: 86, angleSpan: 6, covered: false, price: 'value' },
      { id: '357', name: 'Terrace 357', level: 'upper', baseAngle: 92, angleSpan: 6, covered: false, price: 'value' },
      { id: '358', name: 'Terrace 358', level: 'upper', baseAngle: 98, angleSpan: 6, covered: false, price: 'value' },
      { id: '359', name: 'Terrace 359', level: 'upper', baseAngle: 104, angleSpan: 6, covered: false, price: 'value' },
      { id: '360', name: 'Terrace 360', level: 'upper', baseAngle: 110, angleSpan: 6, covered: false, price: 'value' },
      { id: '361', name: 'Terrace 361', level: 'upper', baseAngle: 116, angleSpan: 6, covered: false, price: 'value' },
      { id: '362', name: 'Terrace 362', level: 'upper', baseAngle: 122, angleSpan: 6, covered: false, price: 'value' },
      { id: '363', name: 'Terrace 363', level: 'upper', baseAngle: 128, angleSpan: 6, covered: false, price: 'value' },
      { id: '364', name: 'Terrace 364', level: 'upper', baseAngle: 134, angleSpan: 6, covered: false, price: 'value' },
      { id: '365', name: 'Terrace 365', level: 'upper', baseAngle: 140, angleSpan: 6, covered: false, price: 'value' },
      { id: '366', name: 'Terrace 366', level: 'upper', baseAngle: 146, angleSpan: 6, covered: false, price: 'value' },
      { id: '367', name: 'Terrace 367', level: 'upper', baseAngle: 152, angleSpan: 6, covered: false, price: 'value' },
      { id: '368', name: 'Terrace 368', level: 'upper', baseAngle: 158, angleSpan: 6, covered: false, price: 'value' },
      { id: '369', name: 'Terrace 369', level: 'upper', baseAngle: 164, angleSpan: 6, covered: false, price: 'value' },
      { id: '370', name: 'Terrace 370', level: 'upper', baseAngle: 170, angleSpan: 6, covered: false, price: 'value' },
      { id: '371', name: 'Terrace 371', level: 'upper', baseAngle: 176, angleSpan: 6, covered: false, price: 'value' },
      { id: '372', name: 'Terrace 372', level: 'upper', baseAngle: 182, angleSpan: 6, covered: false, price: 'value' },
      { id: '373', name: 'Terrace 373', level: 'upper', baseAngle: 188, angleSpan: 6, covered: false, price: 'value' },
      { id: '374', name: 'Terrace 374', level: 'upper', baseAngle: 194, angleSpan: 6, covered: false, price: 'value' },
      { id: '375', name: 'Terrace 375', level: 'upper', baseAngle: 200, angleSpan: 6, covered: false, price: 'value' },
      { id: '376', name: 'Terrace 376', level: 'upper', baseAngle: 206, angleSpan: 6, covered: false, price: 'value' },
      { id: '377', name: 'Terrace 377', level: 'upper', baseAngle: 212, angleSpan: 6, covered: false, price: 'value' },
      { id: '378', name: 'Terrace 378', level: 'upper', baseAngle: 218, angleSpan: 6, covered: false, price: 'value' },
      { id: '379', name: 'Terrace 379', level: 'upper', baseAngle: 224, angleSpan: 6, covered: false, price: 'value' },
      { id: '380', name: 'Terrace 380', level: 'upper', baseAngle: 230, angleSpan: 6, covered: false, price: 'value' },
      { id: '381', name: 'Terrace 381', level: 'upper', baseAngle: 236, angleSpan: 6, covered: false, price: 'value' },
      { id: '382', name: 'Terrace 382', level: 'upper', baseAngle: 242, angleSpan: 6, covered: false, price: 'value' },
      { id: '383', name: 'Terrace 383', level: 'upper', baseAngle: 248, angleSpan: 6, covered: false, price: 'value' },
      { id: '384', name: 'Terrace 384', level: 'upper', baseAngle: 254, angleSpan: 6, covered: false, price: 'value' },
      { id: '385', name: 'Terrace 385', level: 'upper', baseAngle: 260, angleSpan: 6, covered: false, price: 'value' },
    ]
  };
