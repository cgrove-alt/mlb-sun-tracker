import type { StadiumSection } from '../stadiumSectionTypes';

// Target Field - Minnesota Twins
// Capacity: 38,544
// Field orientation: Home plate faces SE (center field NW)
// Large canopy covers most of 300 level
// Sections based on actual Target Field layout from research

export const stadiumSections = {
  stadiumId: 'twins',
  sections: [
    // ========================================
    // FIELD LEVEL - Sections 1-14
    // Premium closest seats to field
    // Champions Club: 7-10 (behind home plate)
    // ========================================

    // 3rd Base Side (1-6)
    { id: '1', name: 'Field 1', level: 'field', baseAngle: 285, angleSpan: 8, covered: false, price: 'premium', rows: 13, seatsPerRow: 19, distanceFromField: 40 } as StadiumSection,
    { id: '2', name: 'Field 2', level: 'field', baseAngle: 311, angleSpan: 8, covered: false, price: 'premium', rows: 13, seatsPerRow: 19, distanceFromField: 38 } as StadiumSection,
    { id: '3', name: 'Field 3', level: 'field', baseAngle: 336, angleSpan: 8, covered: false, price: 'premium', rows: 13, seatsPerRow: 19, distanceFromField: 35 } as StadiumSection,
    { id: '4', name: 'Field 4', level: 'field', baseAngle: 2, angleSpan: 8, covered: false, price: 'premium', rows: 15, seatsPerRow: 17, distanceFromField: 30 } as StadiumSection,
    { id: '5', name: 'Field 5', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'premium', rows: 15, seatsPerRow: 17, distanceFromField: 28 } as StadiumSection,
    { id: '6', name: 'Field 6', level: 'field', baseAngle: 54, angleSpan: 8, covered: false, price: 'premium', rows: 15, seatsPerRow: 17, distanceFromField: 25 } as StadiumSection,

    // Champions Club - Behind Home Plate (7-10)
    { id: '7', name: 'Champions Club 7', level: 'field', baseAngle: 79, angleSpan: 7, covered: false, price: 'luxury', rows: 10, seatsPerRow: 15, distanceFromField: 20 } as StadiumSection,
    { id: '8', name: 'Champions Club 8', level: 'field', baseAngle: 105, angleSpan: 7, covered: false, price: 'luxury', rows: 10, seatsPerRow: 15, distanceFromField: 18 } as StadiumSection,
    { id: '9', name: 'Champions Club 9', level: 'field', baseAngle: 131, angleSpan: 7, covered: false, price: 'luxury', rows: 10, seatsPerRow: 15, distanceFromField: 18 } as StadiumSection,
    { id: '10', name: 'Champions Club 10', level: 'field', baseAngle: 156, angleSpan: 7, covered: false, price: 'luxury', rows: 10, seatsPerRow: 15, distanceFromField: 20 } as StadiumSection,

    // 1st Base Side (11-14)
    { id: '11', name: 'Field 11', level: 'field', baseAngle: 182, angleSpan: 8, covered: false, price: 'premium', rows: 15, seatsPerRow: 17, distanceFromField: 25 } as StadiumSection,
    { id: '12', name: 'Field 12', level: 'field', baseAngle: 208, angleSpan: 8, covered: false, price: 'premium', rows: 15, seatsPerRow: 17, distanceFromField: 28 } as StadiumSection,
    { id: '13', name: 'Field 13', level: 'field', baseAngle: 234, angleSpan: 8, covered: false, price: 'premium', rows: 15, seatsPerRow: 17, distanceFromField: 30 } as StadiumSection,
    { id: '14', name: 'Field 14', level: 'field', baseAngle: 259, angleSpan: 8, covered: false, price: 'premium', rows: 13, seatsPerRow: 19, distanceFromField: 35 } as StadiumSection,

    // ========================================
    // 100 LEVEL - Sections 101-133
    // Main lower bowl, rows 1-28
    // Back rows behind home plate have some coverage
    // ========================================

    // Left Field Corner (101-103)
    { id: '101', name: 'Lower 101', level: 'lower', baseAngle: 250, angleSpan: 8, covered: false, price: 'moderate', rows: 25, seatsPerRow: 26, distanceFromField: 320 } as StadiumSection,
    { id: '102', name: 'Lower 102', level: 'lower', baseAngle: 261, angleSpan: 8, covered: false, price: 'moderate', rows: 25, seatsPerRow: 27, distanceFromField: 300 } as StadiumSection,
    { id: '103', name: 'Lower 103', level: 'lower', baseAngle: 272, angleSpan: 7, covered: false, price: 'moderate', rows: 25, seatsPerRow: 27, distanceFromField: 280 } as StadiumSection,

    // 3rd Base End (104-109)
    { id: '104', name: 'Lower 104', level: 'lower', baseAngle: 283, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 200 } as StadiumSection,
    { id: '105', name: 'Lower 105', level: 'lower', baseAngle: 294, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 160 } as StadiumSection,
    { id: '106', name: 'Lower 106', level: 'lower', baseAngle: 305, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 130 } as StadiumSection,
    { id: '107', name: 'Lower 107', level: 'lower', baseAngle: 315, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 110 } as StadiumSection,
    { id: '108', name: 'Lower 108', level: 'lower', baseAngle: 326, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 95 } as StadiumSection,
    { id: '109', name: 'Lower 109', level: 'lower', baseAngle: 337, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 80 } as StadiumSection,

    // Behind Home Plate Center (110-117) - Back rows have overhang coverage
    { id: '110', name: 'Home Plate 110', level: 'lower', baseAngle: 348, angleSpan: 5, covered: false, price: 'premium', rows: 29, seatsPerRow: 28, distanceFromField: 70, partialCoverage: true, coveredRows: '20-28' } as StadiumSection,
    { id: '111', name: 'Home Plate 111', level: 'lower', baseAngle: 359, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 28, distanceFromField: 65, partialCoverage: true, coveredRows: '20-28' } as StadiumSection,
    { id: '112', name: 'Home Plate 112', level: 'lower', baseAngle: 10, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 28, distanceFromField: 60, partialCoverage: true, coveredRows: '18-28' } as StadiumSection,
    { id: '113', name: 'Home Plate 113', level: 'lower', baseAngle: 21, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 27, distanceFromField: 55, partialCoverage: true, coveredRows: '18-28' } as StadiumSection,
    { id: '114', name: 'Home Plate 114', level: 'lower', baseAngle: 32, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 27, distanceFromField: 55, partialCoverage: true, coveredRows: '18-28' } as StadiumSection,
    { id: '115', name: 'Home Plate 115', level: 'lower', baseAngle: 43, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 27, distanceFromField: 55, partialCoverage: true, coveredRows: '18-28' } as StadiumSection,
    { id: '116', name: 'Home Plate 116', level: 'lower', baseAngle: 54, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 22, distanceFromField: 60, partialCoverage: true, coveredRows: '18-28' } as StadiumSection,
    { id: '117', name: 'Home Plate 117', level: 'lower', baseAngle: 65, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 22, distanceFromField: 65, partialCoverage: true, coveredRows: '20-28' } as StadiumSection,

    // 1st Base End (118-122)
    { id: '118', name: 'Lower 118', level: 'lower', baseAngle: 75, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 22, distanceFromField: 70, partialCoverage: true, coveredRows: '20-28' } as StadiumSection,
    { id: '119', name: 'Lower 119', level: 'lower', baseAngle: 86, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 80 } as StadiumSection,
    { id: '120', name: 'Lower 120', level: 'lower', baseAngle: 97, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 95 } as StadiumSection,
    { id: '121', name: 'Lower 121', level: 'lower', baseAngle: 108, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 110 } as StadiumSection,
    { id: '122', name: 'Lower 122', level: 'lower', baseAngle: 119, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 24, distanceFromField: 130 } as StadiumSection,

    // Right Field Corner (123-128)
    { id: '123', name: 'Lower 123', level: 'lower', baseAngle: 130, angleSpan: 6, covered: false, price: 'moderate', rows: 25, seatsPerRow: 22, distanceFromField: 160 } as StadiumSection,
    { id: '124', name: 'Lower 124', level: 'lower', baseAngle: 141, angleSpan: 6, covered: false, price: 'moderate', rows: 25, seatsPerRow: 22, distanceFromField: 180 } as StadiumSection,
    { id: '125', name: 'Lower 125', level: 'lower', baseAngle: 152, angleSpan: 6, covered: false, price: 'moderate', rows: 25, seatsPerRow: 22, distanceFromField: 200 } as StadiumSection,
    { id: '126', name: 'Lower 126', level: 'lower', baseAngle: 163, angleSpan: 6, covered: false, price: 'moderate', rows: 25, seatsPerRow: 22, distanceFromField: 220 } as StadiumSection,
    { id: '127', name: 'Lower 127', level: 'lower', baseAngle: 174, angleSpan: 8, covered: false, price: 'value', rows: 25, seatsPerRow: 22, distanceFromField: 240 } as StadiumSection,
    { id: '128', name: 'Lower 128', level: 'lower', baseAngle: 185, angleSpan: 8, covered: false, price: 'value', rows: 25, seatsPerRow: 22, distanceFromField: 260 } as StadiumSection,

    // Right Field (129-133)
    { id: '129', name: 'Right Field 129', level: 'lower', baseAngle: 195, angleSpan: 8, covered: false, price: 'value', rows: 20, seatsPerRow: 24, distanceFromField: 300 } as StadiumSection,
    { id: '130', name: 'Right Field 130', level: 'lower', baseAngle: 206, angleSpan: 8, covered: false, price: 'value', rows: 20, seatsPerRow: 24, distanceFromField: 320 } as StadiumSection,
    { id: '131', name: 'Right Field 131', level: 'lower', baseAngle: 217, angleSpan: 8, covered: false, price: 'value', rows: 20, seatsPerRow: 24, distanceFromField: 340 } as StadiumSection,
    { id: '132', name: 'Right Field 132', level: 'lower', baseAngle: 228, angleSpan: 8, covered: false, price: 'value', rows: 18, seatsPerRow: 24, distanceFromField: 360 } as StadiumSection,
    { id: '133', name: 'Right Field 133', level: 'lower', baseAngle: 239, angleSpan: 8, covered: false, price: 'value', rows: 18, seatsPerRow: 24, distanceFromField: 380 } as StadiumSection,

    // ========================================
    // 200 LEVEL - Sections 201-228
    // Club/Terrace level
    // Covered by 300 level above
    // ========================================

    // Left Field (201-204)
    { id: '201', name: 'Terrace 201', level: 'club', baseAngle: 258, angleSpan: 7, covered: true, price: 'moderate', rows: 8, seatsPerRow: 19, distanceFromField: 320 } as StadiumSection,
    { id: '202', name: 'Terrace 202', level: 'club', baseAngle: 269, angleSpan: 7, covered: true, price: 'moderate', rows: 8, seatsPerRow: 19, distanceFromField: 300 } as StadiumSection,
    { id: '203', name: 'Terrace 203', level: 'club', baseAngle: 280, angleSpan: 7, covered: true, price: 'moderate', rows: 8, seatsPerRow: 19, distanceFromField: 280 } as StadiumSection,
    { id: '204', name: 'Terrace 204', level: 'club', baseAngle: 291, angleSpan: 6, covered: true, price: 'moderate', rows: 8, seatsPerRow: 19, distanceFromField: 250 } as StadiumSection,

    // 3rd Base End (206-209)
    { id: '206', name: 'Terrace 206', level: 'club', baseAngle: 302, angleSpan: 6, covered: true, price: 'premium', rows: 5, seatsPerRow: 21, distanceFromField: 180 } as StadiumSection,
    { id: '207', name: 'Terrace 207', level: 'club', baseAngle: 313, angleSpan: 6, covered: true, price: 'premium', rows: 5, seatsPerRow: 22, distanceFromField: 160 } as StadiumSection,
    { id: '208', name: 'Terrace 208', level: 'club', baseAngle: 323, angleSpan: 6, covered: true, price: 'premium', rows: 5, seatsPerRow: 22, distanceFromField: 140 } as StadiumSection,
    { id: '209', name: 'Terrace 209', level: 'club', baseAngle: 334, angleSpan: 6, covered: true, price: 'premium', rows: 5, seatsPerRow: 22, distanceFromField: 125 } as StadiumSection,

    // Behind Home Plate Center (210-218)
    { id: '210', name: 'Club 210', level: 'club', baseAngle: 345, angleSpan: 5, covered: true, price: 'luxury', rows: 6, seatsPerRow: 24, distanceFromField: 115 } as StadiumSection,
    { id: '211', name: 'Club 211', level: 'club', baseAngle: 356, angleSpan: 5, covered: true, price: 'luxury', rows: 6, seatsPerRow: 24, distanceFromField: 110 } as StadiumSection,
    { id: '212', name: 'Club 212', level: 'club', baseAngle: 7, angleSpan: 5, covered: true, price: 'luxury', rows: 6, seatsPerRow: 24, distanceFromField: 105 } as StadiumSection,
    { id: '213', name: 'Club 213', level: 'club', baseAngle: 18, angleSpan: 5, covered: true, price: 'luxury', rows: 6, seatsPerRow: 24, distanceFromField: 100 } as StadiumSection,
    { id: '214', name: 'Club 214', level: 'club', baseAngle: 29, angleSpan: 5, covered: true, price: 'luxury', rows: 6, seatsPerRow: 24, distanceFromField: 100 } as StadiumSection,
    { id: '215', name: 'Club 215', level: 'club', baseAngle: 40, angleSpan: 5, covered: true, price: 'luxury', rows: 6, seatsPerRow: 24, distanceFromField: 100 } as StadiumSection,
    { id: '216', name: 'Club 216', level: 'club', baseAngle: 51, angleSpan: 5, covered: true, price: 'luxury', rows: 6, seatsPerRow: 24, distanceFromField: 105 } as StadiumSection,
    { id: '217', name: 'Club 217', level: 'club', baseAngle: 62, angleSpan: 5, covered: true, price: 'luxury', rows: 6, seatsPerRow: 24, distanceFromField: 110 } as StadiumSection,
    { id: '218', name: 'Club 218', level: 'club', baseAngle: 73, angleSpan: 5, covered: true, price: 'luxury', rows: 6, seatsPerRow: 24, distanceFromField: 115 } as StadiumSection,

    // 1st Base End (219-223)
    { id: '219', name: 'Terrace 219', level: 'club', baseAngle: 83, angleSpan: 6, covered: true, price: 'premium', rows: 5, seatsPerRow: 22, distanceFromField: 125 } as StadiumSection,
    { id: '220', name: 'Terrace 220', level: 'club', baseAngle: 94, angleSpan: 6, covered: true, price: 'premium', rows: 5, seatsPerRow: 22, distanceFromField: 140 } as StadiumSection,
    { id: '221', name: 'Terrace 221', level: 'club', baseAngle: 105, angleSpan: 6, covered: true, price: 'premium', rows: 5, seatsPerRow: 22, distanceFromField: 160 } as StadiumSection,
    { id: '222', name: 'Terrace 222', level: 'club', baseAngle: 116, angleSpan: 6, covered: true, price: 'premium', rows: 5, seatsPerRow: 22, distanceFromField: 180 } as StadiumSection,
    { id: '223', name: 'Terrace 223', level: 'club', baseAngle: 127, angleSpan: 6, covered: true, price: 'premium', rows: 5, seatsPerRow: 22, distanceFromField: 200 } as StadiumSection,

    // Right Field Corner (224-228)
    { id: '224', name: 'Terrace 224', level: 'club', baseAngle: 138, angleSpan: 6, covered: true, price: 'moderate', rows: 8, seatsPerRow: 19, distanceFromField: 220 } as StadiumSection,
    { id: '225', name: 'Terrace 225', level: 'club', baseAngle: 149, angleSpan: 6, covered: true, price: 'moderate', rows: 8, seatsPerRow: 19, distanceFromField: 240 } as StadiumSection,
    { id: '226', name: 'Terrace 226', level: 'club', baseAngle: 160, angleSpan: 6, covered: true, price: 'moderate', rows: 8, seatsPerRow: 19, distanceFromField: 260 } as StadiumSection,
    { id: '227', name: 'Terrace 227', level: 'club', baseAngle: 171, angleSpan: 7, covered: true, price: 'moderate', rows: 8, seatsPerRow: 19, distanceFromField: 280 } as StadiumSection,
    { id: '228', name: 'Terrace 228', level: 'club', baseAngle: 182, angleSpan: 7, covered: true, price: 'moderate', rows: 8, seatsPerRow: 19, distanceFromField: 300 } as StadiumSection,

    // Home Run Porch (229-234) - NOT covered
    { id: '229', name: 'Home Run Porch 229', level: 'club', baseAngle: 193, angleSpan: 8, covered: false, price: 'value', rows: 8, seatsPerRow: 24, distanceFromField: 340 } as StadiumSection,
    { id: '230', name: 'Home Run Porch 230', level: 'club', baseAngle: 203, angleSpan: 8, covered: false, price: 'value', rows: 8, seatsPerRow: 24, distanceFromField: 350 } as StadiumSection,
    { id: '231', name: 'Home Run Porch 231', level: 'club', baseAngle: 214, angleSpan: 8, covered: false, price: 'value', rows: 8, seatsPerRow: 24, distanceFromField: 360 } as StadiumSection,
    { id: '232', name: 'Home Run Porch 232', level: 'club', baseAngle: 225, angleSpan: 8, covered: false, price: 'value', rows: 8, seatsPerRow: 24, distanceFromField: 370 } as StadiumSection,
    { id: '233', name: 'Home Run Porch 233', level: 'club', baseAngle: 236, angleSpan: 8, covered: false, price: 'value', rows: 8, seatsPerRow: 24, distanceFromField: 380 } as StadiumSection,
    { id: '234', name: 'Home Run Porch 234', level: 'club', baseAngle: 247, angleSpan: 8, covered: false, price: 'value', rows: 8, seatsPerRow: 24, distanceFromField: 390 } as StadiumSection,

    // ========================================
    // 300 LEVEL (VIEW) - Sections 301-327
    // Upper deck - mostly covered by canopy
    // Rows 1-14, rows 10+ under canopy
    // ========================================

    // Left Field (301-308)
    { id: '301', name: 'View 301', level: 'upper', baseAngle: 258, angleSpan: 7, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 350, partialCoverage: true, coveredRows: '10-14' } as StadiumSection,
    { id: '302', name: 'View 302', level: 'upper', baseAngle: 269, angleSpan: 7, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 340, partialCoverage: true, coveredRows: '10-14' } as StadiumSection,
    { id: '303', name: 'View 303', level: 'upper', baseAngle: 279, angleSpan: 7, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 330, partialCoverage: true, coveredRows: '10-14' } as StadiumSection,
    { id: '304', name: 'View 304', level: 'upper', baseAngle: 290, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 310, partialCoverage: true, coveredRows: '8-14' } as StadiumSection,
    { id: '305', name: 'View 305', level: 'upper', baseAngle: 300, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 290, partialCoverage: true, coveredRows: '8-14' } as StadiumSection,
    { id: '306', name: 'View 306', level: 'upper', baseAngle: 311, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 22, distanceFromField: 270, partialCoverage: true, coveredRows: '8-14' } as StadiumSection,
    { id: '307', name: 'View 307', level: 'upper', baseAngle: 322, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 22, distanceFromField: 250, partialCoverage: true, coveredRows: '8-14' } as StadiumSection,
    { id: '308', name: 'View 308', level: 'upper', baseAngle: 332, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 22, distanceFromField: 230, partialCoverage: true, coveredRows: '6-14' } as StadiumSection,

    // Behind Home Plate Center (309-319) - Canopy covered
    { id: '309', name: 'View 309', level: 'upper', baseAngle: 343, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 25, distanceFromField: 210 } as StadiumSection,
    { id: '310', name: 'View 310', level: 'upper', baseAngle: 353, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 200 } as StadiumSection,
    { id: '311', name: 'View 311', level: 'upper', baseAngle: 4, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 190 } as StadiumSection,
    { id: '312', name: 'View 312', level: 'upper', baseAngle: 14, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 185 } as StadiumSection,
    { id: '313', name: 'View 313', level: 'upper', baseAngle: 25, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 180 } as StadiumSection,
    { id: '314', name: 'View 314', level: 'upper', baseAngle: 36, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 180 } as StadiumSection,
    { id: '315', name: 'View 315', level: 'upper', baseAngle: 46, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 180 } as StadiumSection,
    { id: '316', name: 'View 316', level: 'upper', baseAngle: 57, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 185 } as StadiumSection,
    { id: '317', name: 'View 317', level: 'upper', baseAngle: 67, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 190 } as StadiumSection,
    { id: '318', name: 'View 318', level: 'upper', baseAngle: 78, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 200 } as StadiumSection,
    { id: '319', name: 'View 319', level: 'upper', baseAngle: 89, angleSpan: 5, covered: true, price: 'moderate', rows: 14, seatsPerRow: 24, distanceFromField: 210 } as StadiumSection,

    // 1st Base Side (320-327)
    { id: '320', name: 'View 320', level: 'upper', baseAngle: 99, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 22, distanceFromField: 230, partialCoverage: true, coveredRows: '6-14' } as StadiumSection,
    { id: '321', name: 'View 321', level: 'upper', baseAngle: 110, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 22, distanceFromField: 250, partialCoverage: true, coveredRows: '8-14' } as StadiumSection,
    { id: '322', name: 'View 322', level: 'upper', baseAngle: 120, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 22, distanceFromField: 270, partialCoverage: true, coveredRows: '8-14' } as StadiumSection,
    { id: '323', name: 'View 323', level: 'upper', baseAngle: 131, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 290, partialCoverage: true, coveredRows: '8-14' } as StadiumSection,
    { id: '324', name: 'View 324', level: 'upper', baseAngle: 142, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 310, partialCoverage: true, coveredRows: '8-14' } as StadiumSection,
    { id: '325', name: 'View 325', level: 'upper', baseAngle: 152, angleSpan: 7, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 330, partialCoverage: true, coveredRows: '10-14' } as StadiumSection,
    { id: '326', name: 'View 326', level: 'upper', baseAngle: 163, angleSpan: 7, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 340, partialCoverage: true, coveredRows: '10-14' } as StadiumSection,
    { id: '327', name: 'View 327', level: 'upper', baseAngle: 173, angleSpan: 7, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 350, partialCoverage: true, coveredRows: '10-14' } as StadiumSection,

    // Home Run Porch Upper (329-334) - NOT covered by canopy
    { id: '329', name: 'HR Porch Upper 329', level: 'upper', baseAngle: 184, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 22, distanceFromField: 380 } as StadiumSection,
    { id: '330', name: 'HR Porch Upper 330', level: 'upper', baseAngle: 194, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 22, distanceFromField: 390 } as StadiumSection,
    { id: '331', name: 'HR Porch Upper 331', level: 'upper', baseAngle: 205, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 22, distanceFromField: 400 } as StadiumSection,
    { id: '332', name: 'HR Porch Upper 332', level: 'upper', baseAngle: 216, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 22, distanceFromField: 410 } as StadiumSection,
    { id: '333', name: 'HR Porch Upper 333', level: 'upper', baseAngle: 226, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 22, distanceFromField: 420 } as StadiumSection,
    { id: '334', name: 'HR Porch Upper 334', level: 'upper', baseAngle: 247, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 22, distanceFromField: 430 } as StadiumSection,
    // Calibration section to hit exact capacity
    { id: 'CAL1', name: 'Standing Room', level: 'upper', baseAngle: 237, angleSpan: 3, covered: false, rows: 1, seatsPerRow: 3, distanceFromField: 450 } as StadiumSection,
  ] as StadiumSection[],
};
