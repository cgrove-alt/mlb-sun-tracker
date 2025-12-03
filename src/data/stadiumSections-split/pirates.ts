import type { StadiumSection } from '../stadiumSectionTypes';

// PNC Park - Pittsburgh Pirates
// Capacity: 38,362
// Field orientation: Home plate faces NE (center field SW)
// Sections based on actual PNC Park layout from research

export const stadiumSections = {
  stadiumId: 'pirates',
  sections: [
    // ========================================
    // FIELD LEVEL - Sections 1-32
    // Premium seating closest to field
    // Rows D-M (approximately 10 rows)
    // ========================================

    // 3rd Base Side (1-9)
    { id: '1', name: 'Field Level 1', level: 'field', baseAngle: 305, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '2', name: 'Field Level 2', level: 'field', baseAngle: 316, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '3', name: 'Field Level 3', level: 'field', baseAngle: 328, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '4', name: 'Field Level 4', level: 'field', baseAngle: 339, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '5', name: 'Field Level 5', level: 'field', baseAngle: 350, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '6', name: 'Field Level 6', level: 'field', baseAngle: 1, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '7', name: 'Field Level 7', level: 'field', baseAngle: 13, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '8', name: 'Field Level 8', level: 'field', baseAngle: 24, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '9', name: 'Field Level 9', level: 'field', baseAngle: 35, angleSpan: 7, covered: false, price: 'luxury', rows: 10, seatsPerRow: 11, distanceFromField: 25 } as StadiumSection,

    // Behind Home Plate - Hyundai Club (10-23)
    { id: '10', name: 'Hyundai Club 10', level: 'field', baseAngle: 46, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '11', name: 'Hyundai Club 11', level: 'field', baseAngle: 58, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '12', name: 'Hyundai Club 12', level: 'field', baseAngle: 69, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '13', name: 'Hyundai Club 13', level: 'field', baseAngle: 80, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '14', name: 'Hyundai Club 14', level: 'field', baseAngle: 91, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '15', name: 'Hyundai Club 15', level: 'field', baseAngle: 103, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '16', name: 'Hyundai Club 16', level: 'field', baseAngle: 114, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '17', name: 'Hyundai Club 17', level: 'field', baseAngle: 125, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '18', name: 'Hyundai Club 18', level: 'field', baseAngle: 136, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '19', name: 'Hyundai Club 19', level: 'field', baseAngle: 148, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '20', name: 'Hyundai Club 20', level: 'field', baseAngle: 159, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '21', name: 'Hyundai Club 21', level: 'field', baseAngle: 170, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '22', name: 'Hyundai Club 22', level: 'field', baseAngle: 181, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,
    { id: '23', name: 'Hyundai Club 23', level: 'field', baseAngle: 193, angleSpan: 5, covered: false, price: 'luxury', rows: 8, seatsPerRow: 11, distanceFromField: 20 } as StadiumSection,

    // 1st Base Side (24-32)
    { id: '24', name: 'Field Level 24', level: 'field', baseAngle: 204, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '25', name: 'Field Level 25', level: 'field', baseAngle: 215, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '26', name: 'Field Level 26', level: 'field', baseAngle: 226, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '27', name: 'Field Level 27', level: 'field', baseAngle: 238, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '28', name: 'Field Level 28', level: 'field', baseAngle: 249, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '29', name: 'Field Level 29', level: 'field', baseAngle: 260, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '30', name: 'Field Level 30', level: 'field', baseAngle: 271, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '31', name: 'Field Level 31', level: 'field', baseAngle: 283, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,
    { id: '32', name: 'Field Level 32', level: 'field', baseAngle: 294, angleSpan: 7, covered: false, price: 'premium', rows: 10, seatsPerRow: 11, distanceFromField: 30 } as StadiumSection,

    // ========================================
    // BOX LEVEL - Sections 101-147
    // Rows A-Z then AA-HH (up to 32 rows)
    // Back rows (AA-HH) covered by overhang
    // ========================================

    // 3rd Base Side (101-108)
    { id: '101', name: 'Box 101', level: 'lower', baseAngle: 299, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 80, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '102', name: 'Box 102', level: 'lower', baseAngle: 307, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 80, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '103', name: 'Box 103', level: 'lower', baseAngle: 314, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 80, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '104', name: 'Box 104', level: 'lower', baseAngle: 322, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 80, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '105', name: 'Box 105', level: 'lower', baseAngle: 330, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 75, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '106', name: 'Box 106', level: 'lower', baseAngle: 337, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 75, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '107', name: 'Box 107', level: 'lower', baseAngle: 345, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 75, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '108', name: 'Box 108', level: 'lower', baseAngle: 353, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 70, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,

    // Behind Home Plate (109-124) - Infield Box
    { id: '109', name: 'Infield Box 109', level: 'lower', baseAngle: 0, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 15, distanceFromField: 65, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '110', name: 'Infield Box 110', level: 'lower', baseAngle: 8, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 15, distanceFromField: 60, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '111', name: 'Infield Box 111', level: 'lower', baseAngle: 16, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 15, distanceFromField: 55, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '112', name: 'Infield Box 112', level: 'lower', baseAngle: 23, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '113', name: 'Infield Box 113', level: 'lower', baseAngle: 31, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '114', name: 'Infield Box 114', level: 'lower', baseAngle: 39, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '115', name: 'Infield Box 115', level: 'lower', baseAngle: 46, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '116', name: 'Infield Box 116', level: 'lower', baseAngle: 54, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '117', name: 'Infield Box 117', level: 'lower', baseAngle: 61, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '118', name: 'Infield Box 118', level: 'lower', baseAngle: 69, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '119', name: 'Infield Box 119', level: 'lower', baseAngle: 77, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '120', name: 'Infield Box 120', level: 'lower', baseAngle: 84, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '121', name: 'Infield Box 121', level: 'lower', baseAngle: 92, angleSpan: 5, covered: false, price: 'premium', rows: 28, seatsPerRow: 17, distanceFromField: 50, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '122', name: 'Infield Box 122', level: 'lower', baseAngle: 100, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 15, distanceFromField: 55, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '123', name: 'Infield Box 123', level: 'lower', baseAngle: 107, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 15, distanceFromField: 60, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '124', name: 'Infield Box 124', level: 'lower', baseAngle: 115, angleSpan: 5, covered: false, price: 'premium', rows: 30, seatsPerRow: 15, distanceFromField: 65, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,

    // 1st Base Side (125-132)
    { id: '125', name: 'Box 125', level: 'lower', baseAngle: 123, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 70, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '126', name: 'Box 126', level: 'lower', baseAngle: 130, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 75, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '127', name: 'Box 127', level: 'lower', baseAngle: 138, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 75, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '128', name: 'Box 128', level: 'lower', baseAngle: 146, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 75, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '129', name: 'Box 129', level: 'lower', baseAngle: 153, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 15, distanceFromField: 80, partialCoverage: true, coveredRows: 'AA-HH' } as StadiumSection,
    { id: '130', name: 'Box 130', level: 'lower', baseAngle: 161, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 15, distanceFromField: 85 } as StadiumSection,
    { id: '131', name: 'Box 131', level: 'lower', baseAngle: 169, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 14, distanceFromField: 90 } as StadiumSection,
    { id: '132', name: 'Box 132', level: 'lower', baseAngle: 176, angleSpan: 6, covered: false, price: 'moderate', rows: 28, seatsPerRow: 14, distanceFromField: 95 } as StadiumSection,

    // Right Field Bleachers (133-138)
    { id: '133', name: 'Bleachers 133', level: 'lower', baseAngle: 184, angleSpan: 8, covered: false, price: 'value', rows: 20, seatsPerRow: 19, distanceFromField: 350 } as StadiumSection,
    { id: '134', name: 'Bleachers 134', level: 'lower', baseAngle: 192, angleSpan: 8, covered: false, price: 'value', rows: 20, seatsPerRow: 19, distanceFromField: 360 } as StadiumSection,
    { id: '135', name: 'Bleachers 135', level: 'lower', baseAngle: 199, angleSpan: 8, covered: false, price: 'value', rows: 18, seatsPerRow: 19, distanceFromField: 370 } as StadiumSection,
    { id: '136', name: 'Bleachers 136', level: 'lower', baseAngle: 207, angleSpan: 8, covered: false, price: 'value', rows: 18, seatsPerRow: 19, distanceFromField: 380 } as StadiumSection,
    { id: '137', name: 'Bleachers 137', level: 'lower', baseAngle: 215, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 19, distanceFromField: 390 } as StadiumSection,
    { id: '138', name: 'Bleachers 138', level: 'lower', baseAngle: 222, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 19, distanceFromField: 400 } as StadiumSection,

    // Left Field Corner (139-147)
    { id: '139', name: 'Left Field 139', level: 'lower', baseAngle: 230, angleSpan: 7, covered: false, price: 'value', rows: 24, seatsPerRow: 14, distanceFromField: 320 } as StadiumSection,
    { id: '140', name: 'Left Field 140', level: 'lower', baseAngle: 237, angleSpan: 7, covered: false, price: 'value', rows: 24, seatsPerRow: 14, distanceFromField: 310 } as StadiumSection,
    { id: '141', name: 'Left Field 141', level: 'lower', baseAngle: 244, angleSpan: 7, covered: false, price: 'value', rows: 24, seatsPerRow: 14, distanceFromField: 300 } as StadiumSection,
    { id: '142', name: 'Left Field 142', level: 'lower', baseAngle: 251, angleSpan: 7, covered: false, price: 'value', rows: 26, seatsPerRow: 14, distanceFromField: 280 } as StadiumSection,
    { id: '143', name: 'Left Field 143', level: 'lower', baseAngle: 261, angleSpan: 7, covered: false, price: 'moderate', rows: 28, seatsPerRow: 14, distanceFromField: 260 } as StadiumSection,
    { id: '144', name: 'Left Field 144', level: 'lower', baseAngle: 268, angleSpan: 7, covered: false, price: 'moderate', rows: 30, seatsPerRow: 14, distanceFromField: 220 } as StadiumSection,
    { id: '145', name: 'Left Field 145', level: 'lower', baseAngle: 276, angleSpan: 7, covered: false, price: 'moderate', rows: 30, seatsPerRow: 14, distanceFromField: 180 } as StadiumSection,
    { id: '146', name: 'Left Field 146', level: 'lower', baseAngle: 284, angleSpan: 6, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 140 } as StadiumSection,
    { id: '147', name: 'Left Field 147', level: 'lower', baseAngle: 291, angleSpan: 5, covered: false, price: 'moderate', rows: 32, seatsPerRow: 14, distanceFromField: 100 } as StadiumSection,

    // ========================================
    // CLUB LEVEL - Sections 201-238
    // Pittsburgh Baseball Club (PBC)
    // Rows A-K (11 rows)
    // Covered by upper deck overhang
    // ========================================

    // 3rd Base Side (201-210)
    { id: '201', name: 'Club 201', level: 'club', baseAngle: 265, angleSpan: 6, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 140 } as StadiumSection,
    { id: '202', name: 'Club 202', level: 'club', baseAngle: 274, angleSpan: 6, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 130 } as StadiumSection,
    { id: '203', name: 'Club 203', level: 'club', baseAngle: 284, angleSpan: 6, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 120 } as StadiumSection,
    { id: '204', name: 'Club 204', level: 'club', baseAngle: 293, angleSpan: 6, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 115 } as StadiumSection,
    { id: '205', name: 'Club 205', level: 'club', baseAngle: 303, angleSpan: 6, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 110 } as StadiumSection,
    { id: '206', name: 'Club 206', level: 'club', baseAngle: 312, angleSpan: 6, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 105 } as StadiumSection,
    { id: '207', name: 'Club 207', level: 'club', baseAngle: 322, angleSpan: 6, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 100 } as StadiumSection,
    { id: '208', name: 'Club 208', level: 'club', baseAngle: 331, angleSpan: 5, covered: true, price: 'premium', rows: 11, seatsPerRow: 14, distanceFromField: 95 } as StadiumSection,
    { id: '209', name: 'Club 209', level: 'club', baseAngle: 341, angleSpan: 5, covered: true, price: 'premium', rows: 11, seatsPerRow: 14, distanceFromField: 90 } as StadiumSection,
    { id: '210', name: 'Club 210', level: 'club', baseAngle: 350, angleSpan: 5, covered: true, price: 'premium', rows: 11, seatsPerRow: 14, distanceFromField: 85 } as StadiumSection,

    // Behind Home Plate (211-221)
    { id: '211', name: 'PBC Club 211', level: 'club', baseAngle: 360, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 80 } as StadiumSection,
    { id: '212', name: 'PBC Club 212', level: 'club', baseAngle: 9, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 75 } as StadiumSection,
    { id: '213', name: 'PBC Club 213', level: 'club', baseAngle: 19, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 72 } as StadiumSection,
    { id: '214', name: 'PBC Club 214', level: 'club', baseAngle: 28, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 70 } as StadiumSection,
    { id: '215', name: 'PBC Club 215', level: 'club', baseAngle: 38, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 68 } as StadiumSection,
    { id: '216', name: 'PBC Club 216', level: 'club', baseAngle: 47, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 68 } as StadiumSection,
    { id: '217', name: 'PBC Club 217', level: 'club', baseAngle: 57, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 68 } as StadiumSection,
    { id: '218', name: 'PBC Club 218', level: 'club', baseAngle: 66, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 68 } as StadiumSection,
    { id: '219', name: 'PBC Club 219', level: 'club', baseAngle: 76, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 70 } as StadiumSection,
    { id: '220', name: 'PBC Club 220', level: 'club', baseAngle: 85, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 72 } as StadiumSection,
    { id: '221', name: 'PBC Club 221', level: 'club', baseAngle: 94, angleSpan: 5, covered: true, price: 'luxury', rows: 11, seatsPerRow: 15, distanceFromField: 75 } as StadiumSection,

    // 1st Base Side (222-228)
    { id: '222', name: 'Club 222', level: 'club', baseAngle: 104, angleSpan: 5, covered: true, price: 'premium', rows: 11, seatsPerRow: 14, distanceFromField: 80 } as StadiumSection,
    { id: '223', name: 'Club 223', level: 'club', baseAngle: 113, angleSpan: 5, covered: true, price: 'premium', rows: 11, seatsPerRow: 14, distanceFromField: 85 } as StadiumSection,
    { id: '224', name: 'Club 224', level: 'club', baseAngle: 123, angleSpan: 5, covered: true, price: 'premium', rows: 11, seatsPerRow: 14, distanceFromField: 90 } as StadiumSection,
    { id: '225', name: 'Club 225', level: 'club', baseAngle: 132, angleSpan: 5, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 95 } as StadiumSection,
    { id: '226', name: 'Club 226', level: 'club', baseAngle: 142, angleSpan: 5, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 100 } as StadiumSection,
    { id: '227', name: 'Club 227', level: 'club', baseAngle: 151, angleSpan: 5, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 105 } as StadiumSection,
    { id: '228', name: 'Club 228', level: 'club', baseAngle: 161, angleSpan: 6, covered: true, price: 'premium', rows: 11, seatsPerRow: 12, distanceFromField: 110 } as StadiumSection,

    // Right Field Club/Bleachers (229-238)
    { id: '229', name: 'Club 229', level: 'club', baseAngle: 170, angleSpan: 6, covered: true, price: 'moderate', rows: 10, seatsPerRow: 12, distanceFromField: 120 } as StadiumSection,
    { id: '230', name: 'Club 230', level: 'club', baseAngle: 180, angleSpan: 6, covered: true, price: 'moderate', rows: 10, seatsPerRow: 12, distanceFromField: 130 } as StadiumSection,
    { id: '231', name: 'Club 231', level: 'club', baseAngle: 189, angleSpan: 6, covered: true, price: 'moderate', rows: 10, seatsPerRow: 12, distanceFromField: 140 } as StadiumSection,
    { id: '232', name: 'Club 232', level: 'club', baseAngle: 199, angleSpan: 6, covered: true, price: 'moderate', rows: 10, seatsPerRow: 12, distanceFromField: 150 } as StadiumSection,
    { id: '233', name: 'Club 233', level: 'club', baseAngle: 208, angleSpan: 7, covered: true, price: 'moderate', rows: 10, seatsPerRow: 12, distanceFromField: 160 } as StadiumSection,
    { id: '234', name: 'Club 234', level: 'club', baseAngle: 218, angleSpan: 7, covered: true, price: 'moderate', rows: 10, seatsPerRow: 12, distanceFromField: 170 } as StadiumSection,
    { id: '235', name: 'Bleachers 235', level: 'club', baseAngle: 227, angleSpan: 8, covered: false, price: 'value', rows: 10, seatsPerRow: 17, distanceFromField: 380 } as StadiumSection,
    { id: '236', name: 'Bleachers 236', level: 'club', baseAngle: 237, angleSpan: 8, covered: false, price: 'value', rows: 10, seatsPerRow: 17, distanceFromField: 390 } as StadiumSection,
    { id: '237', name: 'Bleachers 237', level: 'club', baseAngle: 246, angleSpan: 8, covered: false, price: 'value', rows: 10, seatsPerRow: 17, distanceFromField: 400 } as StadiumSection,
    { id: '238', name: 'Bleachers 238', level: 'club', baseAngle: 256, angleSpan: 8, covered: false, price: 'value', rows: 8, seatsPerRow: 17, distanceFromField: 410 } as StadiumSection,

    // ========================================
    // UPPER LEVEL - Sections 301-338
    // Grandstand
    // Rows D-R center (15 rows), D-Y ends (22 rows)
    // Front rows exposed, back rows under roof
    // ========================================

    // 3rd Base Side (301-312)
    { id: '301', name: 'Grandstand 301', level: 'upper', baseAngle: 265, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 200, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '302', name: 'Grandstand 302', level: 'upper', baseAngle: 274, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 195, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '303', name: 'Grandstand 303', level: 'upper', baseAngle: 284, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 190, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '304', name: 'Grandstand 304', level: 'upper', baseAngle: 293, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 185, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '305', name: 'Grandstand 305', level: 'upper', baseAngle: 303, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 180, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '306', name: 'Grandstand 306', level: 'upper', baseAngle: 312, angleSpan: 6, covered: false, price: 'value', rows: 20, seatsPerRow: 12, distanceFromField: 175, partialCoverage: true, coveredRows: 'N-Y' } as StadiumSection,
    { id: '307', name: 'Grandstand 307', level: 'upper', baseAngle: 322, angleSpan: 6, covered: false, price: 'value', rows: 20, seatsPerRow: 14, distanceFromField: 170, partialCoverage: true, coveredRows: 'N-Y' } as StadiumSection,
    { id: '308', name: 'Grandstand 308', level: 'upper', baseAngle: 331, angleSpan: 5, covered: false, price: 'value', rows: 18, seatsPerRow: 14, distanceFromField: 165, partialCoverage: true, coveredRows: 'L-R' } as StadiumSection,
    { id: '309', name: 'Grandstand 309', level: 'upper', baseAngle: 341, angleSpan: 5, covered: false, price: 'value', rows: 18, seatsPerRow: 14, distanceFromField: 160, partialCoverage: true, coveredRows: 'L-R' } as StadiumSection,
    { id: '310', name: 'Grandstand 310', level: 'upper', baseAngle: 350, angleSpan: 5, covered: false, price: 'value', rows: 18, seatsPerRow: 14, distanceFromField: 155, partialCoverage: true, coveredRows: 'L-R' } as StadiumSection,
    { id: '311', name: 'Grandstand 311', level: 'upper', baseAngle: 360, angleSpan: 5, covered: false, price: 'value', rows: 16, seatsPerRow: 15, distanceFromField: 150, partialCoverage: true, coveredRows: 'K-R' } as StadiumSection,
    { id: '312', name: 'Grandstand 312', level: 'upper', baseAngle: 9, angleSpan: 5, covered: false, price: 'value', rows: 16, seatsPerRow: 15, distanceFromField: 145, partialCoverage: true, coveredRows: 'K-R' } as StadiumSection,

    // Behind Home Plate (313-319)
    { id: '313', name: 'Grandstand 313', level: 'upper', baseAngle: 19, angleSpan: 5, covered: false, price: 'moderate', rows: 15, seatsPerRow: 17, distanceFromField: 140, partialCoverage: true, coveredRows: 'J-R' } as StadiumSection,
    { id: '314', name: 'Grandstand 314', level: 'upper', baseAngle: 28, angleSpan: 5, covered: false, price: 'moderate', rows: 15, seatsPerRow: 17, distanceFromField: 135, partialCoverage: true, coveredRows: 'J-R' } as StadiumSection,
    { id: '315', name: 'Grandstand 315', level: 'upper', baseAngle: 38, angleSpan: 5, covered: false, price: 'moderate', rows: 15, seatsPerRow: 17, distanceFromField: 130, partialCoverage: true, coveredRows: 'J-R' } as StadiumSection,
    { id: '316', name: 'Grandstand 316', level: 'upper', baseAngle: 47, angleSpan: 5, covered: false, price: 'moderate', rows: 15, seatsPerRow: 17, distanceFromField: 128, partialCoverage: true, coveredRows: 'J-R' } as StadiumSection,
    { id: '317', name: 'Grandstand 317', level: 'upper', baseAngle: 57, angleSpan: 5, covered: false, price: 'moderate', rows: 15, seatsPerRow: 17, distanceFromField: 128, partialCoverage: true, coveredRows: 'J-R' } as StadiumSection,
    { id: '318', name: 'Grandstand 318', level: 'upper', baseAngle: 66, angleSpan: 5, covered: false, price: 'moderate', rows: 15, seatsPerRow: 17, distanceFromField: 130, partialCoverage: true, coveredRows: 'J-R' } as StadiumSection,
    { id: '319', name: 'Grandstand 319', level: 'upper', baseAngle: 76, angleSpan: 5, covered: false, price: 'moderate', rows: 15, seatsPerRow: 17, distanceFromField: 135, partialCoverage: true, coveredRows: 'J-R' } as StadiumSection,

    // 1st Base Side (320-338)
    { id: '320', name: 'Grandstand 320', level: 'upper', baseAngle: 85, angleSpan: 5, covered: false, price: 'value', rows: 16, seatsPerRow: 15, distanceFromField: 140, partialCoverage: true, coveredRows: 'K-R' } as StadiumSection,
    { id: '321', name: 'Grandstand 321', level: 'upper', baseAngle: 94, angleSpan: 5, covered: false, price: 'value', rows: 16, seatsPerRow: 15, distanceFromField: 145, partialCoverage: true, coveredRows: 'K-R' } as StadiumSection,
    { id: '322', name: 'Grandstand 322', level: 'upper', baseAngle: 104, angleSpan: 5, covered: false, price: 'value', rows: 18, seatsPerRow: 14, distanceFromField: 150, partialCoverage: true, coveredRows: 'L-R' } as StadiumSection,
    { id: '323', name: 'Grandstand 323', level: 'upper', baseAngle: 113, angleSpan: 5, covered: false, price: 'value', rows: 18, seatsPerRow: 14, distanceFromField: 155, partialCoverage: true, coveredRows: 'L-R' } as StadiumSection,
    { id: '324', name: 'Grandstand 324', level: 'upper', baseAngle: 123, angleSpan: 5, covered: false, price: 'value', rows: 18, seatsPerRow: 14, distanceFromField: 160, partialCoverage: true, coveredRows: 'L-R' } as StadiumSection,
    { id: '325', name: 'Grandstand 325', level: 'upper', baseAngle: 132, angleSpan: 6, covered: false, price: 'value', rows: 20, seatsPerRow: 14, distanceFromField: 165, partialCoverage: true, coveredRows: 'N-Y' } as StadiumSection,
    { id: '326', name: 'Grandstand 326', level: 'upper', baseAngle: 142, angleSpan: 6, covered: false, price: 'value', rows: 20, seatsPerRow: 12, distanceFromField: 170, partialCoverage: true, coveredRows: 'N-Y' } as StadiumSection,
    { id: '327', name: 'Grandstand 327', level: 'upper', baseAngle: 151, angleSpan: 6, covered: false, price: 'value', rows: 20, seatsPerRow: 12, distanceFromField: 175, partialCoverage: true, coveredRows: 'N-Y' } as StadiumSection,
    { id: '328', name: 'Grandstand 328', level: 'upper', baseAngle: 161, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 180, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '329', name: 'Grandstand 329', level: 'upper', baseAngle: 170, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 185, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '330', name: 'Grandstand 330', level: 'upper', baseAngle: 180, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 190, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '331', name: 'Grandstand 331', level: 'upper', baseAngle: 189, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 195, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '332', name: 'Grandstand 332', level: 'upper', baseAngle: 199, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 200, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '333', name: 'Grandstand 333', level: 'upper', baseAngle: 208, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 205, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '334', name: 'Grandstand 334', level: 'upper', baseAngle: 218, angleSpan: 6, covered: false, price: 'value', rows: 22, seatsPerRow: 12, distanceFromField: 210, partialCoverage: true, coveredRows: 'P-Y' } as StadiumSection,
    { id: '335', name: 'Grandstand 335', level: 'upper', baseAngle: 227, angleSpan: 6, covered: false, price: 'value', rows: 20, seatsPerRow: 12, distanceFromField: 215, partialCoverage: true, coveredRows: 'N-Y' } as StadiumSection,
    { id: '336', name: 'Grandstand 336', level: 'upper', baseAngle: 237, angleSpan: 6, covered: false, price: 'value', rows: 18, seatsPerRow: 12, distanceFromField: 220, partialCoverage: true, coveredRows: 'L-Y' } as StadiumSection,
    { id: '337', name: 'Grandstand 337', level: 'upper', baseAngle: 246, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 12, distanceFromField: 225, partialCoverage: true, coveredRows: 'K-Y' } as StadiumSection,
    { id: '338', name: 'Grandstand 338', level: 'upper', baseAngle: 256, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 12, distanceFromField: 230, partialCoverage: true, coveredRows: 'J-Y' } as StadiumSection,
  ] as StadiumSection[],
};
