import type { StadiumSection } from '../stadiumSectionTypes';

// Progressive Field - Cleveland Guardians
// Capacity: 34,820 (smallest full-capacity MLB park)
// Field orientation: Home plate faces N (center field S)
// Sections based on actual Progressive Field layout from research

export const stadiumSections = {
  stadiumId: 'guardians',
  sections: [
    // ========================================
    // 100 LEVEL - Lower Bowl
    // Sections 101-177
    // Rows vary by section
    // ========================================

    // Right Field Corner (101-108)
    { id: '101', name: 'Lower 101', level: 'lower', baseAngle: 40, angleSpan: 6, covered: false, price: 'moderate', rows: 25, seatsPerRow: 16, distanceFromField: 150 } as StadiumSection,
    { id: '102', name: 'Lower 102', level: 'lower', baseAngle: 46, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 16, distanceFromField: 170 } as StadiumSection,
    { id: '103', name: 'Lower 103', level: 'lower', baseAngle: 52, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 16, distanceFromField: 190 } as StadiumSection,
    { id: '104', name: 'Lower 104', level: 'lower', baseAngle: 58, angleSpan: 6, covered: false, price: 'moderate', rows: 30, seatsPerRow: 18, distanceFromField: 210 } as StadiumSection,
    { id: '105', name: 'Lower 105', level: 'lower', baseAngle: 64, angleSpan: 6, covered: false, price: 'value', rows: 30, seatsPerRow: 18, distanceFromField: 240 } as StadiumSection,
    { id: '106', name: 'Lower 106', level: 'lower', baseAngle: 70, angleSpan: 6, covered: false, price: 'value', rows: 28, seatsPerRow: 18, distanceFromField: 280 } as StadiumSection,
    { id: '107', name: 'Lower 107', level: 'lower', baseAngle: 76, angleSpan: 6, covered: false, price: 'value', rows: 28, seatsPerRow: 18, distanceFromField: 320 } as StadiumSection,
    { id: '108', name: 'Lower 108', level: 'lower', baseAngle: 82, angleSpan: 6, covered: false, price: 'value', rows: 26, seatsPerRow: 17, distanceFromField: 360 } as StadiumSection,

    // 1st Base Line (130-141)
    { id: '130', name: 'Lower 130', level: 'lower', baseAngle: 10, angleSpan: 5, covered: false, price: 'premium', rows: 33, seatsPerRow: 18, distanceFromField: 100 } as StadiumSection,
    { id: '131', name: 'Lower 131', level: 'lower', baseAngle: 15, angleSpan: 5, covered: false, price: 'premium', rows: 32, seatsPerRow: 18, distanceFromField: 105 } as StadiumSection,
    { id: '132', name: 'Lower 132', level: 'lower', baseAngle: 20, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 18, distanceFromField: 110 } as StadiumSection,
    { id: '133', name: 'Lower 133', level: 'lower', baseAngle: 25, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 18, distanceFromField: 120 } as StadiumSection,
    { id: '134', name: 'Lower 134', level: 'lower', baseAngle: 30, angleSpan: 5, covered: false, price: 'moderate', rows: 28, seatsPerRow: 18, distanceFromField: 130 } as StadiumSection,
    { id: '135', name: 'Lower 135', level: 'lower', baseAngle: 35, angleSpan: 5, covered: false, price: 'moderate', rows: 28, seatsPerRow: 18, distanceFromField: 140 } as StadiumSection,

    // Behind Home Plate (140-160) - Premium seating
    { id: '140', name: 'Home 140', level: 'field', baseAngle: 320, angleSpan: 5, covered: false, price: 'premium', rows: 25, seatsPerRow: 16, distanceFromField: 80, partialCoverage: true, coveredRows: '20-25' } as StadiumSection,
    { id: '141', name: 'Home 141', level: 'field', baseAngle: 325, angleSpan: 5, covered: false, price: 'premium', rows: 25, seatsPerRow: 16, distanceFromField: 75, partialCoverage: true, coveredRows: '20-25' } as StadiumSection,
    { id: '142', name: 'Home 142', level: 'field', baseAngle: 330, angleSpan: 5, covered: false, price: 'luxury', rows: 22, seatsPerRow: 16, distanceFromField: 65, partialCoverage: true, coveredRows: '18-22' } as StadiumSection,
    { id: '143', name: 'Home 143', level: 'field', baseAngle: 335, angleSpan: 5, covered: false, price: 'luxury', rows: 22, seatsPerRow: 16, distanceFromField: 60, partialCoverage: true, coveredRows: '18-22' } as StadiumSection,
    { id: '144', name: 'Home 144', level: 'field', baseAngle: 340, angleSpan: 5, covered: false, price: 'luxury', rows: 20, seatsPerRow: 14, distanceFromField: 55, partialCoverage: true, coveredRows: '16-20' } as StadiumSection,
    { id: '145', name: 'Home 145', level: 'field', baseAngle: 345, angleSpan: 5, covered: false, price: 'luxury', rows: 20, seatsPerRow: 14, distanceFromField: 50, partialCoverage: true, coveredRows: '16-20' } as StadiumSection,
    { id: '146', name: 'Home 146', level: 'field', baseAngle: 350, angleSpan: 5, covered: false, price: 'luxury', rows: 20, seatsPerRow: 14, distanceFromField: 50, partialCoverage: true, coveredRows: '16-20' } as StadiumSection,
    { id: '147', name: 'Home 147', level: 'field', baseAngle: 355, angleSpan: 5, covered: false, price: 'luxury', rows: 20, seatsPerRow: 14, distanceFromField: 50, partialCoverage: true, coveredRows: '16-20' } as StadiumSection,
    { id: '148', name: 'Home 148', level: 'field', baseAngle: 0, angleSpan: 5, covered: false, price: 'luxury', rows: 20, seatsPerRow: 14, distanceFromField: 55, partialCoverage: true, coveredRows: '16-20' } as StadiumSection,
    { id: '149', name: 'Home 149', level: 'field', baseAngle: 5, angleSpan: 5, covered: false, price: 'luxury', rows: 22, seatsPerRow: 16, distanceFromField: 60, partialCoverage: true, coveredRows: '18-22' } as StadiumSection,

    // 3rd Base Line (150-165)
    { id: '150', name: 'Lower 150', level: 'lower', baseAngle: 316, angleSpan: 5, covered: false, price: 'premium', rows: 25, seatsPerRow: 16, distanceFromField: 85, partialCoverage: true, coveredRows: '20-25' } as StadiumSection,
    { id: '151', name: 'Lower 151', level: 'lower', baseAngle: 311, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 16, distanceFromField: 90, partialCoverage: true, coveredRows: '22-28' } as StadiumSection,
    { id: '152', name: 'Lower 152', level: 'lower', baseAngle: 306, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 100, partialCoverage: true, coveredRows: '22-28' } as StadiumSection,
    { id: '153', name: 'Lower 153', level: 'lower', baseAngle: 301, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 18, distanceFromField: 110 } as StadiumSection,
    { id: '154', name: 'Lower 154', level: 'lower', baseAngle: 296, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 18, distanceFromField: 120 } as StadiumSection,
    { id: '155', name: 'Lower 155', level: 'lower', baseAngle: 291, angleSpan: 5, covered: false, price: 'moderate', rows: 30, seatsPerRow: 18, distanceFromField: 130 } as StadiumSection,
    { id: '156', name: 'Lower 156', level: 'lower', baseAngle: 286, angleSpan: 5, covered: false, price: 'moderate', rows: 30, seatsPerRow: 18, distanceFromField: 140 } as StadiumSection,
    { id: '157', name: 'Lower 157', level: 'lower', baseAngle: 281, angleSpan: 5, covered: false, price: 'moderate', rows: 28, seatsPerRow: 17, distanceFromField: 150 } as StadiumSection,
    { id: '158', name: 'Lower 158', level: 'lower', baseAngle: 276, angleSpan: 5, covered: false, price: 'moderate', rows: 28, seatsPerRow: 17, distanceFromField: 160 } as StadiumSection,
    { id: '159', name: 'Lower 159', level: 'lower', baseAngle: 271, angleSpan: 5, covered: false, price: 'moderate', rows: 26, seatsPerRow: 17, distanceFromField: 170 } as StadiumSection,
    { id: '160', name: 'Lower 160', level: 'lower', baseAngle: 266, angleSpan: 5, covered: false, price: 'moderate', rows: 26, seatsPerRow: 17, distanceFromField: 180 } as StadiumSection,
    { id: '161', name: 'Lower 161', level: 'lower', baseAngle: 261, angleSpan: 5, covered: false, price: 'moderate', rows: 24, seatsPerRow: 17, distanceFromField: 200 } as StadiumSection,
    { id: '162', name: 'Lower 162', level: 'lower', baseAngle: 256, angleSpan: 5, covered: false, price: 'moderate', rows: 24, seatsPerRow: 17, distanceFromField: 220 } as StadiumSection,
    { id: '163', name: 'Lower 163', level: 'lower', baseAngle: 251, angleSpan: 5, covered: false, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 250 } as StadiumSection,
    { id: '164', name: 'Lower 164', level: 'lower', baseAngle: 246, angleSpan: 5, covered: false, price: 'value', rows: 22, seatsPerRow: 17, distanceFromField: 280 } as StadiumSection,
    { id: '165', name: 'Lower 165', level: 'lower', baseAngle: 241, angleSpan: 5, covered: false, price: 'value', rows: 20, seatsPerRow: 17, distanceFromField: 310 } as StadiumSection,

    // Left Field Corner (166-177)
    { id: '166', name: 'Lower 166', level: 'lower', baseAngle: 236, angleSpan: 6, covered: false, price: 'value', rows: 20, seatsPerRow: 17, distanceFromField: 340 } as StadiumSection,
    { id: '167', name: 'Lower 167', level: 'lower', baseAngle: 230, angleSpan: 6, covered: false, price: 'value', rows: 18, seatsPerRow: 17, distanceFromField: 360 } as StadiumSection,
    { id: '168', name: 'Lower 168', level: 'lower', baseAngle: 224, angleSpan: 6, covered: false, price: 'value', rows: 18, seatsPerRow: 17, distanceFromField: 370 } as StadiumSection,
    { id: '169', name: 'Lower 169', level: 'lower', baseAngle: 218, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 380 } as StadiumSection,
    { id: '170', name: 'Lower 170', level: 'lower', baseAngle: 212, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 390 } as StadiumSection,
    { id: '171', name: 'Lower 171', level: 'lower', baseAngle: 206, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 395 } as StadiumSection,
    { id: '172', name: 'Lower 172', level: 'lower', baseAngle: 200, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 400 } as StadiumSection,
    { id: '173', name: 'Lower 173', level: 'lower', baseAngle: 194, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 16, distanceFromField: 405 } as StadiumSection,
    { id: '174', name: 'Lower 174', level: 'lower', baseAngle: 188, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 17, distanceFromField: 410 } as StadiumSection,
    { id: '175', name: 'Lower 175', level: 'lower', baseAngle: 182, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 17, distanceFromField: 415 } as StadiumSection,
    { id: '176', name: 'Lower 176', level: 'lower', baseAngle: 176, angleSpan: 6, covered: false, price: 'value', rows: 12, seatsPerRow: 16, distanceFromField: 420 } as StadiumSection,
    { id: '177', name: 'Lower 177', level: 'lower', baseAngle: 170, angleSpan: 6, covered: false, price: 'value', rows: 12, seatsPerRow: 16, distanceFromField: 425 } as StadiumSection,

    // Left Field Bleachers (180-185)
    { id: '180', name: 'Bleachers 180', level: 'lower', baseAngle: 164, angleSpan: 8, covered: false, price: 'value', rows: 15, seatsPerRow: 21, distanceFromField: 400 } as StadiumSection,
    { id: '181', name: 'Bleachers 181', level: 'lower', baseAngle: 156, angleSpan: 8, covered: false, price: 'value', rows: 15, seatsPerRow: 21, distanceFromField: 405 } as StadiumSection,
    { id: '182', name: 'Bleachers 182', level: 'lower', baseAngle: 148, angleSpan: 8, covered: false, price: 'value', rows: 15, seatsPerRow: 21, distanceFromField: 410 } as StadiumSection,
    { id: '183', name: 'Bleachers 183', level: 'lower', baseAngle: 140, angleSpan: 8, covered: false, price: 'value', rows: 15, seatsPerRow: 21, distanceFromField: 415 } as StadiumSection,
    { id: '184', name: 'Bleachers 184', level: 'lower', baseAngle: 132, angleSpan: 8, covered: false, price: 'value', rows: 15, seatsPerRow: 21, distanceFromField: 420 } as StadiumSection,
    { id: '185', name: 'Bleachers 185', level: 'lower', baseAngle: 124, angleSpan: 8, covered: false, price: 'value', rows: 15, seatsPerRow: 21, distanceFromField: 425 } as StadiumSection,

    // ========================================
    // 300 LEVEL - Club Lounge
    // Sections 326-348
    // Covered, premium amenities
    // ========================================

    { id: '326', name: 'Club 326', level: 'club', baseAngle: 280, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 200 } as StadiumSection,
    { id: '327', name: 'Club 327', level: 'club', baseAngle: 286, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 195 } as StadiumSection,
    { id: '328', name: 'Club 328', level: 'club', baseAngle: 292, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 190 } as StadiumSection,
    { id: '329', name: 'Club 329', level: 'club', baseAngle: 298, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 185 } as StadiumSection,
    { id: '330', name: 'Club 330', level: 'club', baseAngle: 304, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 180 } as StadiumSection,
    { id: '331', name: 'Club 331', level: 'club', baseAngle: 309, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 175 } as StadiumSection,
    { id: '332', name: 'Club 332', level: 'club', baseAngle: 314, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 170 } as StadiumSection,
    { id: '333', name: 'Club 333', level: 'club', baseAngle: 319, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 168 } as StadiumSection,
    { id: '334', name: 'Club 334', level: 'club', baseAngle: 324, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 168 } as StadiumSection,
    { id: '335', name: 'Club 335', level: 'club', baseAngle: 329, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 168 } as StadiumSection,
    { id: '336', name: 'Club 336', level: 'club', baseAngle: 334, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 168 } as StadiumSection,
    { id: '337', name: 'Club 337', level: 'club', baseAngle: 339, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 170 } as StadiumSection,
    { id: '338', name: 'Club 338', level: 'club', baseAngle: 344, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 175 } as StadiumSection,
    { id: '339', name: 'Club 339', level: 'club', baseAngle: 349, angleSpan: 5, covered: true, price: 'luxury', rows: 10, seatsPerRow: 17, distanceFromField: 180 } as StadiumSection,
    { id: '340', name: 'Club 340', level: 'club', baseAngle: 354, angleSpan: 5, covered: true, price: 'premium', rows: 10, seatsPerRow: 17, distanceFromField: 185 } as StadiumSection,
    { id: '341', name: 'Club 341', level: 'club', baseAngle: 359, angleSpan: 5, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 190 } as StadiumSection,
    { id: '342', name: 'Club 342', level: 'club', baseAngle: 4, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 195 } as StadiumSection,
    { id: '343', name: 'Club 343', level: 'club', baseAngle: 10, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 200 } as StadiumSection,
    { id: '344', name: 'Club 344', level: 'club', baseAngle: 16, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 205 } as StadiumSection,
    { id: '345', name: 'Club 345', level: 'club', baseAngle: 22, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 210 } as StadiumSection,
    { id: '346', name: 'Club 346', level: 'club', baseAngle: 28, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 215 } as StadiumSection,
    { id: '347', name: 'Club 347', level: 'club', baseAngle: 34, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 220 } as StadiumSection,
    { id: '348', name: 'Club 348', level: 'club', baseAngle: 40, angleSpan: 6, covered: true, price: 'premium', rows: 10, seatsPerRow: 16, distanceFromField: 225 } as StadiumSection,

    // ========================================
    // 400-500 LEVEL - Upper Deck
    // Sections 420-560
    // Steep incline, skyline views
    // ========================================

    // Upper Infield (430-456)
    { id: '430', name: 'Upper 430', level: 'upper', baseAngle: 290, angleSpan: 6, covered: false, price: 'value', rows: 18, seatsPerRow: 16, distanceFromField: 280, partialCoverage: true, coveredRows: '12-18' } as StadiumSection,
    { id: '431', name: 'Upper 431', level: 'upper', baseAngle: 296, angleSpan: 6, covered: false, price: 'value', rows: 18, seatsPerRow: 16, distanceFromField: 275, partialCoverage: true, coveredRows: '12-18' } as StadiumSection,
    { id: '432', name: 'Upper 432', level: 'upper', baseAngle: 302, angleSpan: 5, covered: false, price: 'value', rows: 20, seatsPerRow: 17, distanceFromField: 268, partialCoverage: true, coveredRows: '14-20' } as StadiumSection,
    { id: '433', name: 'Upper 433', level: 'upper', baseAngle: 307, angleSpan: 5, covered: false, price: 'value', rows: 20, seatsPerRow: 17, distanceFromField: 262, partialCoverage: true, coveredRows: '14-20' } as StadiumSection,
    { id: '434', name: 'Upper 434', level: 'upper', baseAngle: 312, angleSpan: 5, covered: false, price: 'value', rows: 20, seatsPerRow: 17, distanceFromField: 256, partialCoverage: true, coveredRows: '14-20' } as StadiumSection,
    { id: '435', name: 'Upper 435', level: 'upper', baseAngle: 317, angleSpan: 5, covered: true, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 250 } as StadiumSection,
    { id: '436', name: 'Upper 436', level: 'upper', baseAngle: 322, angleSpan: 5, covered: true, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 248 } as StadiumSection,
    { id: '437', name: 'Upper 437', level: 'upper', baseAngle: 327, angleSpan: 5, covered: true, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 246 } as StadiumSection,
    { id: '438', name: 'Upper 438', level: 'upper', baseAngle: 332, angleSpan: 5, covered: true, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 245 } as StadiumSection,
    { id: '439', name: 'Upper 439', level: 'upper', baseAngle: 337, angleSpan: 5, covered: true, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 245 } as StadiumSection,
    { id: '440', name: 'Upper 440', level: 'upper', baseAngle: 342, angleSpan: 5, covered: true, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 245 } as StadiumSection,
    { id: '441', name: 'Upper 441', level: 'upper', baseAngle: 347, angleSpan: 5, covered: true, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 246 } as StadiumSection,
    { id: '442', name: 'Upper 442', level: 'upper', baseAngle: 352, angleSpan: 5, covered: true, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 248 } as StadiumSection,
    { id: '443', name: 'Upper 443', level: 'upper', baseAngle: 357, angleSpan: 5, covered: true, price: 'moderate', rows: 22, seatsPerRow: 17, distanceFromField: 250 } as StadiumSection,
    { id: '444', name: 'Upper 444', level: 'upper', baseAngle: 2, angleSpan: 5, covered: false, price: 'value', rows: 20, seatsPerRow: 17, distanceFromField: 256, partialCoverage: true, coveredRows: '14-20' } as StadiumSection,
    { id: '445', name: 'Upper 445', level: 'upper', baseAngle: 7, angleSpan: 5, covered: false, price: 'value', rows: 20, seatsPerRow: 17, distanceFromField: 262, partialCoverage: true, coveredRows: '14-20' } as StadiumSection,
    { id: '446', name: 'Upper 446', level: 'upper', baseAngle: 12, angleSpan: 5, covered: false, price: 'value', rows: 20, seatsPerRow: 17, distanceFromField: 268, partialCoverage: true, coveredRows: '14-20' } as StadiumSection,
    { id: '447', name: 'Upper 447', level: 'upper', baseAngle: 17, angleSpan: 6, covered: false, price: 'value', rows: 18, seatsPerRow: 16, distanceFromField: 275, partialCoverage: true, coveredRows: '12-18' } as StadiumSection,
    { id: '448', name: 'Upper 448', level: 'upper', baseAngle: 23, angleSpan: 6, covered: false, price: 'value', rows: 18, seatsPerRow: 16, distanceFromField: 280, partialCoverage: true, coveredRows: '12-18' } as StadiumSection,

    // Upper Outfield/Corners (520-560)
    { id: '530', name: 'Upper 530', level: 'upper', baseAngle: 270, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 380 } as StadiumSection,
    { id: '531', name: 'Upper 531', level: 'upper', baseAngle: 262, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 390 } as StadiumSection,
    { id: '532', name: 'Upper 532', level: 'upper', baseAngle: 254, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 400 } as StadiumSection,
    { id: '546', name: 'Upper 546', level: 'upper', baseAngle: 50, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 360 } as StadiumSection,
    { id: '552', name: 'Upper 552', level: 'upper', baseAngle: 58, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 370 } as StadiumSection,
    { id: '553', name: 'Upper 553', level: 'upper', baseAngle: 66, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 380 } as StadiumSection,
    { id: '558', name: 'Upper 558', level: 'upper', baseAngle: 74, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 17, distanceFromField: 390 } as StadiumSection,
  ] as StadiumSection[],
};
