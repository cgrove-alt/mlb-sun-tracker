import type { StadiumSection } from '../stadiumSectionTypes';

// Comerica Park - Detroit Tigers
// Capacity: 41,083
// Field orientation: Home plate faces N (center field S)
// Sections based on actual Comerica Park layout from research

export const stadiumSections = {
  stadiumId: 'tigers',
  sections: [
    // ========================================
    // FIELD LEVEL - On-Deck/Tiger Den
    // Sections 120-135 premium behind home plate
    // On-Deck: rows 1-12, Tiger Den: rows A-H
    // ========================================

    // 3rd Base Side (137-142)
    { id: '137', name: 'Field 137', level: 'field', baseAngle: 280, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 25, distanceFromField: 100 } as StadiumSection,
    { id: '138', name: 'Field 138', level: 'field', baseAngle: 296, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 25, distanceFromField: 90 } as StadiumSection,
    { id: '139', name: 'Field 139', level: 'field', baseAngle: 313, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 25, distanceFromField: 80 } as StadiumSection,
    { id: '140', name: 'Field 140', level: 'field', baseAngle: 329, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 25, distanceFromField: 70 } as StadiumSection,
    { id: '141', name: 'Field 141', level: 'field', baseAngle: 345, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 25, distanceFromField: 60 } as StadiumSection,
    { id: '142', name: 'Field 142', level: 'field', baseAngle: 2, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 25, distanceFromField: 50 } as StadiumSection,

    // Tiger Den - Behind Home Plate (131-135)
    { id: '131', name: 'Tiger Den 131', level: 'field', baseAngle: 18, angleSpan: 5, covered: false, price: 'luxury', rows: 12, seatsPerRow: 23, distanceFromField: 35 } as StadiumSection,
    { id: '132', name: 'Tiger Den 132', level: 'field', baseAngle: 35, angleSpan: 5, covered: false, price: 'luxury', rows: 12, seatsPerRow: 23, distanceFromField: 30 } as StadiumSection,
    { id: '133', name: 'Tiger Den 133', level: 'field', baseAngle: 51, angleSpan: 5, covered: false, price: 'luxury', rows: 12, seatsPerRow: 23, distanceFromField: 28 } as StadiumSection,
    { id: '134', name: 'Tiger Den 134', level: 'field', baseAngle: 67, angleSpan: 5, covered: false, price: 'luxury', rows: 12, seatsPerRow: 23, distanceFromField: 28 } as StadiumSection,
    { id: '135', name: 'Tiger Den 135', level: 'field', baseAngle: 84, angleSpan: 5, covered: false, price: 'luxury', rows: 12, seatsPerRow: 23, distanceFromField: 30 } as StadiumSection,

    // 1st Base Behind Plate (120-130) - Club seats
    { id: '120', name: 'Club 120', level: 'field', baseAngle: 100, angleSpan: 5, covered: false, price: 'luxury', rows: 15, seatsPerRow: 25, distanceFromField: 35 } as StadiumSection,
    { id: '121', name: 'Club 121', level: 'field', baseAngle: 116, angleSpan: 5, covered: false, price: 'luxury', rows: 15, seatsPerRow: 20, distanceFromField: 38 } as StadiumSection,
    { id: '122', name: 'Club 122', level: 'field', baseAngle: 133, angleSpan: 5, covered: false, price: 'luxury', rows: 15, seatsPerRow: 20, distanceFromField: 40 } as StadiumSection,
    { id: '123', name: 'Club 123', level: 'field', baseAngle: 149, angleSpan: 5, covered: false, price: 'premium', rows: 18, seatsPerRow: 20, distanceFromField: 45 } as StadiumSection,
    { id: '124', name: 'Club 124', level: 'field', baseAngle: 165, angleSpan: 5, covered: false, price: 'premium', rows: 18, seatsPerRow: 20, distanceFromField: 50 } as StadiumSection,
    { id: '125', name: 'Field 125', level: 'field', baseAngle: 182, angleSpan: 5, covered: false, price: 'premium', rows: 18, seatsPerRow: 20, distanceFromField: 55 } as StadiumSection,
    { id: '126', name: 'Field 126', level: 'field', baseAngle: 198, angleSpan: 5, covered: false, price: 'premium', rows: 18, seatsPerRow: 20, distanceFromField: 60 } as StadiumSection,
    { id: '127', name: 'Field 127', level: 'field', baseAngle: 215, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 20, distanceFromField: 70 } as StadiumSection,
    { id: '128', name: 'Field 128', level: 'field', baseAngle: 231, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 20, distanceFromField: 80 } as StadiumSection,
    { id: '129', name: 'Field 129', level: 'field', baseAngle: 247, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 20, distanceFromField: 90 } as StadiumSection,
    { id: '130', name: 'Field 130', level: 'field', baseAngle: 264, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 20, distanceFromField: 100 } as StadiumSection,

    // ========================================
    // 100 LEVEL - Main Bowl
    // Sections 101-114 (3rd base), 115-119 (LF)
    // Rows 1-35
    // 1st base side back rows are shaded
    // ========================================

    // Left Field (143-152)
    { id: '143', name: 'Lower 143', level: 'lower', baseAngle: 235, angleSpan: 7, covered: false, price: 'value', rows: 25, seatsPerRow: 24, distanceFromField: 380 } as StadiumSection,
    { id: '144', name: 'Lower 144', level: 'lower', baseAngle: 247, angleSpan: 7, covered: false, price: 'value', rows: 25, seatsPerRow: 23, distanceFromField: 370 } as StadiumSection,
    { id: '145', name: 'Lower 145', level: 'lower', baseAngle: 260, angleSpan: 7, covered: false, price: 'value', rows: 25, seatsPerRow: 23, distanceFromField: 360 } as StadiumSection,
    { id: '146', name: 'Lower 146', level: 'lower', baseAngle: 272, angleSpan: 7, covered: false, price: 'value', rows: 28, seatsPerRow: 23, distanceFromField: 350 } as StadiumSection,
    { id: '147', name: 'Lower 147', level: 'lower', baseAngle: 285, angleSpan: 7, covered: false, price: 'value', rows: 28, seatsPerRow: 23, distanceFromField: 340 } as StadiumSection,
    { id: '148', name: 'Lower 148', level: 'lower', baseAngle: 297, angleSpan: 7, covered: false, price: 'moderate', rows: 30, seatsPerRow: 23, distanceFromField: 320 } as StadiumSection,
    { id: '149', name: 'Lower 149', level: 'lower', baseAngle: 309, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 23, distanceFromField: 280 } as StadiumSection,
    { id: '150', name: 'Lower 150', level: 'lower', baseAngle: 322, angleSpan: 6, covered: false, price: 'moderate', rows: 33, seatsPerRow: 24, distanceFromField: 240 } as StadiumSection,
    { id: '151', name: 'Lower 151', level: 'lower', baseAngle: 334, angleSpan: 6, covered: false, price: 'moderate', rows: 33, seatsPerRow: 24, distanceFromField: 200 } as StadiumSection,
    { id: '152', name: 'Lower 152', level: 'lower', baseAngle: 347, angleSpan: 6, covered: false, price: 'moderate', rows: 33, seatsPerRow: 24, distanceFromField: 160 } as StadiumSection,

    // Right Field (101-114)
    { id: '101', name: 'Lower 101', level: 'lower', baseAngle: 61, angleSpan: 6, covered: false, price: 'moderate', rows: 33, seatsPerRow: 24, distanceFromField: 160 } as StadiumSection,
    { id: '102', name: 'Lower 102', level: 'lower', baseAngle: 74, angleSpan: 6, covered: false, price: 'moderate', rows: 33, seatsPerRow: 24, distanceFromField: 180 } as StadiumSection,
    { id: '103', name: 'Lower 103', level: 'lower', baseAngle: 86, angleSpan: 6, covered: false, price: 'moderate', rows: 33, seatsPerRow: 24, distanceFromField: 200 } as StadiumSection,
    { id: '104', name: 'Lower 104', level: 'lower', baseAngle: 98, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 23, distanceFromField: 220 } as StadiumSection,
    { id: '105', name: 'Lower 105', level: 'lower', baseAngle: 111, angleSpan: 6, covered: false, price: 'moderate', rows: 30, seatsPerRow: 23, distanceFromField: 250 } as StadiumSection,
    { id: '106', name: 'Lower 106', level: 'lower', baseAngle: 123, angleSpan: 7, covered: false, price: 'value', rows: 28, seatsPerRow: 23, distanceFromField: 280 } as StadiumSection,
    { id: '107', name: 'Lower 107', level: 'lower', baseAngle: 136, angleSpan: 7, covered: false, price: 'value', rows: 28, seatsPerRow: 23, distanceFromField: 310 } as StadiumSection,
    { id: '108', name: 'Lower 108', level: 'lower', baseAngle: 148, angleSpan: 7, covered: false, price: 'value', rows: 26, seatsPerRow: 23, distanceFromField: 340 } as StadiumSection,
    { id: '109', name: 'Lower 109', level: 'lower', baseAngle: 161, angleSpan: 7, covered: false, price: 'value', rows: 26, seatsPerRow: 23, distanceFromField: 360 } as StadiumSection,
    { id: '110', name: 'Lower 110', level: 'lower', baseAngle: 173, angleSpan: 7, covered: false, price: 'value', rows: 24, seatsPerRow: 23, distanceFromField: 380 } as StadiumSection,
    { id: '111', name: 'Lower 111', level: 'lower', baseAngle: 185, angleSpan: 7, covered: false, price: 'value', rows: 24, seatsPerRow: 23, distanceFromField: 390 } as StadiumSection,
    { id: '112', name: 'Lower 112', level: 'lower', baseAngle: 198, angleSpan: 7, covered: false, price: 'value', rows: 22, seatsPerRow: 23, distanceFromField: 400, partialCoverage: true, coveredRows: '18-22' } as StadiumSection,
    { id: '113', name: 'Lower 113', level: 'lower', baseAngle: 210, angleSpan: 7, covered: false, price: 'value', rows: 22, seatsPerRow: 23, distanceFromField: 410, partialCoverage: true, coveredRows: '18-22' } as StadiumSection,
    { id: '114', name: 'Lower 114', level: 'lower', baseAngle: 223, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 23, distanceFromField: 420, partialCoverage: true, coveredRows: '16-20' } as StadiumSection,

    // Behind Home Plate Main Bowl (115-119)
    { id: '115', name: 'Lower 115', level: 'lower', baseAngle: 359, angleSpan: 5, covered: false, price: 'premium', rows: 35, seatsPerRow: 24, distanceFromField: 130 } as StadiumSection,
    { id: '116', name: 'Lower 116', level: 'lower', baseAngle: 12, angleSpan: 5, covered: false, price: 'premium', rows: 35, seatsPerRow: 24, distanceFromField: 120 } as StadiumSection,
    { id: '117', name: 'Lower 117', level: 'lower', baseAngle: 24, angleSpan: 5, covered: false, price: 'premium', rows: 35, seatsPerRow: 24, distanceFromField: 115 } as StadiumSection,
    { id: '118', name: 'Lower 118', level: 'lower', baseAngle: 36, angleSpan: 5, covered: false, price: 'premium', rows: 35, seatsPerRow: 24, distanceFromField: 110 } as StadiumSection,
    { id: '119', name: 'Lower 119', level: 'lower', baseAngle: 49, angleSpan: 5, covered: false, price: 'premium', rows: 35, seatsPerRow: 24, distanceFromField: 110 } as StadiumSection,

    // ========================================
    // 200 LEVEL (Mezzanine/Club)
    // Sections 211-219
    // Rows A-G, 1-22
    // ========================================

    { id: '211', name: 'Mezzanine 211', level: 'club', baseAngle: 280, angleSpan: 7, covered: true, price: 'premium', rows: 12, seatsPerRow: 20, distanceFromField: 180 } as StadiumSection,
    { id: '212', name: 'Mezzanine 212', level: 'club', baseAngle: 320, angleSpan: 7, covered: true, price: 'premium', rows: 12, seatsPerRow: 20, distanceFromField: 170 } as StadiumSection,
    { id: '213', name: 'Mezzanine 213', level: 'club', baseAngle: 0, angleSpan: 6, covered: true, price: 'premium', rows: 14, seatsPerRow: 23, distanceFromField: 160 } as StadiumSection,
    { id: '214', name: 'Mezzanine 214', level: 'club', baseAngle: 40, angleSpan: 6, covered: true, price: 'luxury', rows: 14, seatsPerRow: 23, distanceFromField: 150 } as StadiumSection,
    { id: '215', name: 'Mezzanine 215', level: 'club', baseAngle: 80, angleSpan: 6, covered: true, price: 'luxury', rows: 14, seatsPerRow: 23, distanceFromField: 145 } as StadiumSection,
    { id: '216', name: 'Mezzanine 216', level: 'club', baseAngle: 120, angleSpan: 6, covered: true, price: 'luxury', rows: 14, seatsPerRow: 23, distanceFromField: 145 } as StadiumSection,
    { id: '217', name: 'Mezzanine 217', level: 'club', baseAngle: 160, angleSpan: 6, covered: true, price: 'luxury', rows: 14, seatsPerRow: 23, distanceFromField: 150 } as StadiumSection,
    { id: '218', name: 'Mezzanine 218', level: 'club', baseAngle: 200, angleSpan: 7, covered: true, price: 'premium', rows: 12, seatsPerRow: 20, distanceFromField: 160 } as StadiumSection,
    { id: '219', name: 'Mezzanine 219', level: 'club', baseAngle: 240, angleSpan: 7, covered: true, price: 'premium', rows: 12, seatsPerRow: 20, distanceFromField: 170 } as StadiumSection,

    // ========================================
    // 300 LEVEL (Upper)
    // Sections 322-345
    // Rows A-F, 1-20
    // Note: Upper deck is far from action
    // ========================================

    // 3rd Base Side (340-345)
    { id: '340', name: 'Upper 340', level: 'upper', baseAngle: 265, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 380, partialCoverage: true, coveredRows: '15-20' } as StadiumSection,
    { id: '341', name: 'Upper 341', level: 'upper', baseAngle: 280, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 360, partialCoverage: true, coveredRows: '15-20' } as StadiumSection,
    { id: '342', name: 'Upper 342', level: 'upper', baseAngle: 295, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 340, partialCoverage: true, coveredRows: '15-20' } as StadiumSection,
    { id: '343', name: 'Upper 343', level: 'upper', baseAngle: 310, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 23, distanceFromField: 320, partialCoverage: true, coveredRows: '16-22' } as StadiumSection,
    { id: '344', name: 'Upper 344', level: 'upper', baseAngle: 325, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 23, distanceFromField: 300, partialCoverage: true, coveredRows: '16-22' } as StadiumSection,
    { id: '345', name: 'Upper 345', level: 'upper', baseAngle: 340, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 23, distanceFromField: 280, partialCoverage: true, coveredRows: '16-22' } as StadiumSection,

    // Behind Home Plate (322-333)
    { id: '322', name: 'Upper 322', level: 'upper', baseAngle: 355, angleSpan: 5, covered: false, price: 'value', rows: 22, seatsPerRow: 23, distanceFromField: 260, partialCoverage: true, coveredRows: '14-22' } as StadiumSection,
    { id: '323', name: 'Upper 323', level: 'upper', baseAngle: 10, angleSpan: 5, covered: false, price: 'value', rows: 22, seatsPerRow: 23, distanceFromField: 250, partialCoverage: true, coveredRows: '14-22' } as StadiumSection,
    { id: '324', name: 'Upper 324', level: 'upper', baseAngle: 25, angleSpan: 5, covered: false, price: 'value', rows: 22, seatsPerRow: 23, distanceFromField: 240, partialCoverage: true, coveredRows: '14-22' } as StadiumSection,
    { id: '325', name: 'Upper 325', level: 'upper', baseAngle: 40, angleSpan: 5, covered: true, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 235 } as StadiumSection,
    { id: '326', name: 'Upper 326', level: 'upper', baseAngle: 55, angleSpan: 5, covered: true, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 230 } as StadiumSection,
    { id: '327', name: 'Upper 327', level: 'upper', baseAngle: 70, angleSpan: 5, covered: true, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 228 } as StadiumSection,
    { id: '328', name: 'Upper 328', level: 'upper', baseAngle: 85, angleSpan: 5, covered: true, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 228 } as StadiumSection,
    { id: '329', name: 'Upper 329', level: 'upper', baseAngle: 100, angleSpan: 5, covered: true, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 230 } as StadiumSection,
    { id: '330', name: 'Upper 330', level: 'upper', baseAngle: 115, angleSpan: 5, covered: true, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 235 } as StadiumSection,
    { id: '331', name: 'Upper 331', level: 'upper', baseAngle: 130, angleSpan: 5, covered: true, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 240 } as StadiumSection,
    { id: '332', name: 'Upper 332', level: 'upper', baseAngle: 145, angleSpan: 5, covered: false, price: 'value', rows: 22, seatsPerRow: 18, distanceFromField: 250, partialCoverage: true, coveredRows: '14-22' } as StadiumSection,
    { id: '333', name: 'Upper 333', level: 'upper', baseAngle: 160, angleSpan: 5, covered: false, price: 'value', rows: 22, seatsPerRow: 18, distanceFromField: 260, partialCoverage: true, coveredRows: '14-22' } as StadiumSection,

    // 1st Base Side (334-339)
    { id: '334', name: 'Upper 334', level: 'upper', baseAngle: 175, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 18, distanceFromField: 280, partialCoverage: true, coveredRows: '16-22' } as StadiumSection,
    { id: '335', name: 'Upper 335', level: 'upper', baseAngle: 190, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 18, distanceFromField: 300, partialCoverage: true, coveredRows: '16-22' } as StadiumSection,
    { id: '336', name: 'Upper 336', level: 'upper', baseAngle: 205, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 18, distanceFromField: 320, partialCoverage: true, coveredRows: '16-22' } as StadiumSection,
    { id: '337', name: 'Upper 337', level: 'upper', baseAngle: 220, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 340, partialCoverage: true, coveredRows: '15-20' } as StadiumSection,
    { id: '338', name: 'Upper 338', level: 'upper', baseAngle: 235, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 360, partialCoverage: true, coveredRows: '15-20' } as StadiumSection,
    { id: '339', name: 'Upper 339', level: 'upper', baseAngle: 250, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 380, partialCoverage: true, coveredRows: '15-20' } as StadiumSection,
  ] as StadiumSection[],
};
