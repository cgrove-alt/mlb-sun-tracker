import type { StadiumSection } from '../stadiumSectionTypes';

// Globe Life Field - Texas Rangers
// Capacity: 41,171
// RETRACTABLE ROOF stadium - when closed all seats covered
// When roof is open, some sections have overhangs for shade
// Sections 301-314 under permanent roof section when open
// Field level sections 5-22, 27-33 have partial overhang coverage

export const stadiumSections = {
    stadiumId: 'rangers',
    sections: [
      // Field Level (1-26) - 16 rows each, ~20 seats per row
      // Third base corner
      { id: '1', name: 'Field 1', level: 'field', baseAngle: 252, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 11, distanceFromField: 50 } as StadiumSection,
      { id: '2', name: 'Field 2', level: 'field', baseAngle: 260, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 11, distanceFromField: 50 } as StadiumSection,
      { id: '3', name: 'Field 3', level: 'field', baseAngle: 268, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 13, distanceFromField: 48 } as StadiumSection,
      { id: '4', name: 'Field 4', level: 'field', baseAngle: 276, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 13, distanceFromField: 45 } as StadiumSection,
      // Third base line to home - sections 5-9 have partial overhang
      { id: '5', name: 'Field 5', level: 'field', baseAngle: 284, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 13, distanceFromField: 42, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '6', name: 'Field 6', level: 'field', baseAngle: 292, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 13, distanceFromField: 40, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '7', name: 'Field 7', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 13, distanceFromField: 38, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '8', name: 'Field 8', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 13, distanceFromField: 35, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '9', name: 'Field 9', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 11, distanceFromField: 32, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      // Behind home plate
      { id: '10', name: 'Field 10', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 13, distanceFromField: 30, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '11', name: 'Field 11', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 11, distanceFromField: 28, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '12', name: 'Field 12', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 11, distanceFromField: 25, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '13', name: 'Field 13', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 14, distanceFromField: 25, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '14', name: 'Field 14', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 14, distanceFromField: 25, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '15', name: 'Field 15', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 14, distanceFromField: 28, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '16', name: 'Field 16', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 16, distanceFromField: 30, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      // First base line - sections still have partial overhang
      { id: '17', name: 'Field 17', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 14, distanceFromField: 32, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '18', name: 'Field 18', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 16, distanceFromField: 35, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '19', name: 'Field 19', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'luxury', rows: 16, seatsPerRow: 16, distanceFromField: 38, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '20', name: 'Field 20', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 16, distanceFromField: 40, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '21', name: 'Field 21', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 16, distanceFromField: 42, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      { id: '22', name: 'Field 22', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 16, distanceFromField: 45, partialCoverage: true, coveredRows: '13-16' } as StadiumSection,
      // First base corner - no overhang (sunniest area)
      { id: '23', name: 'Field 23', level: 'field', baseAngle: 68, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 16, distanceFromField: 48 } as StadiumSection,
      { id: '24', name: 'Field 24', level: 'field', baseAngle: 76, angleSpan: 8, covered: false, price: 'premium', rows: 16, seatsPerRow: 14, distanceFromField: 50 } as StadiumSection,
      { id: '25', name: 'Field 25', level: 'field', baseAngle: 84, angleSpan: 8, covered: false, price: 'moderate', rows: 16, seatsPerRow: 14, distanceFromField: 52 } as StadiumSection,
      { id: '26', name: 'Field 26', level: 'field', baseAngle: 92, angleSpan: 8, covered: false, price: 'moderate', rows: 16, seatsPerRow: 20, distanceFromField: 55 } as StadiumSection,

      // Left Field sections (27-33) - larger sections, ~24 seats per row, partial overhang
      { id: '27', name: 'Left Field 27', level: 'field', baseAngle: 180, angleSpan: 10, covered: false, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 80, partialCoverage: true, coveredRows: '17-20' } as StadiumSection,
      { id: '28', name: 'Left Field 28', level: 'field', baseAngle: 190, angleSpan: 10, covered: false, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 85, partialCoverage: true, coveredRows: '17-20' } as StadiumSection,
      { id: '29', name: 'Left Field 29', level: 'field', baseAngle: 200, angleSpan: 10, covered: false, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 90, partialCoverage: true, coveredRows: '17-20' } as StadiumSection,
      { id: '30', name: 'Left Field 30', level: 'field', baseAngle: 210, angleSpan: 10, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 95, partialCoverage: true, coveredRows: '17-20' } as StadiumSection,
      { id: '31', name: 'Left Field 31', level: 'field', baseAngle: 220, angleSpan: 10, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 100, partialCoverage: true, coveredRows: '17-20' } as StadiumSection,
      { id: '32', name: 'Left Field 32', level: 'field', baseAngle: 230, angleSpan: 10, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 105, partialCoverage: true, coveredRows: '17-20' } as StadiumSection,
      { id: '33', name: 'Left Field 33', level: 'field', baseAngle: 240, angleSpan: 10, covered: false, price: 'value', rows: 20, seatsPerRow: 20, distanceFromField: 110, partialCoverage: true, coveredRows: '17-20' } as StadiumSection,

      // Mezzanine Level (100 Level) - sections 101-129, 136-142
      // Third base corner (101-106)
      { id: '101', name: 'Mezzanine 101', level: 'lower', baseAngle: 250, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 14, distanceFromField: 100 } as StadiumSection,
      { id: '102', name: 'Mezzanine 102', level: 'lower', baseAngle: 256, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 14, distanceFromField: 100 } as StadiumSection,
      { id: '103', name: 'Mezzanine 103', level: 'lower', baseAngle: 262, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 14, distanceFromField: 98 } as StadiumSection,
      { id: '104', name: 'Mezzanine 104', level: 'lower', baseAngle: 268, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 14, distanceFromField: 96 } as StadiumSection,
      { id: '105', name: 'Mezzanine 105', level: 'lower', baseAngle: 274, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 14, distanceFromField: 94 } as StadiumSection,
      { id: '106', name: 'Mezzanine 106', level: 'lower', baseAngle: 280, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 92 } as StadiumSection,
      // Third base line (107-111)
      { id: '107', name: 'Mezzanine 107', level: 'lower', baseAngle: 286, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 90 } as StadiumSection,
      { id: '108', name: 'Mezzanine 108', level: 'lower', baseAngle: 292, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 88 } as StadiumSection,
      { id: '109', name: 'Mezzanine 109', level: 'lower', baseAngle: 298, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 86 } as StadiumSection,
      { id: '110', name: 'Mezzanine 110', level: 'lower', baseAngle: 304, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 84 } as StadiumSection,
      { id: '111', name: 'Mezzanine 111', level: 'lower', baseAngle: 310, angleSpan: 6, covered: false, price: 'premium', rows: 18, seatsPerRow: 16, distanceFromField: 82 } as StadiumSection,
      // Behind home plate (112-115) - center sections
      { id: '112', name: 'Mezzanine 112', level: 'lower', baseAngle: 316, angleSpan: 6, covered: false, price: 'premium', rows: 18, seatsPerRow: 14, distanceFromField: 80 } as StadiumSection,
      { id: '113', name: 'Mezzanine 113', level: 'lower', baseAngle: 338, angleSpan: 10, covered: false, price: 'premium', rows: 18, seatsPerRow: 16, distanceFromField: 78 } as StadiumSection,
      { id: '114', name: 'Mezzanine 114', level: 'lower', baseAngle: 356, angleSpan: 12, covered: false, price: 'premium', rows: 18, seatsPerRow: 16, distanceFromField: 78 } as StadiumSection,
      { id: '115', name: 'Mezzanine 115', level: 'lower', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium', rows: 18, seatsPerRow: 14, distanceFromField: 80 } as StadiumSection,
      // First base line (116-120) - sunniest mezzanine sections
      { id: '116', name: 'Mezzanine 116', level: 'lower', baseAngle: 32, angleSpan: 6, covered: false, price: 'premium', rows: 18, seatsPerRow: 16, distanceFromField: 82 } as StadiumSection,
      { id: '117', name: 'Mezzanine 117', level: 'lower', baseAngle: 38, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 84 } as StadiumSection,
      { id: '118', name: 'Mezzanine 118', level: 'lower', baseAngle: 44, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 86 } as StadiumSection,
      { id: '119', name: 'Mezzanine 119', level: 'lower', baseAngle: 50, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 88 } as StadiumSection,
      { id: '120', name: 'Mezzanine 120', level: 'lower', baseAngle: 56, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 90 } as StadiumSection,
      // First base corner (121-129)
      { id: '121', name: 'Mezzanine 121', level: 'lower', baseAngle: 62, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 16, distanceFromField: 92 } as StadiumSection,
      { id: '122', name: 'Mezzanine 122', level: 'lower', baseAngle: 68, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 14, distanceFromField: 94 } as StadiumSection,
      { id: '123', name: 'Mezzanine 123', level: 'lower', baseAngle: 74, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 14, distanceFromField: 96 } as StadiumSection,
      { id: '124', name: 'Mezzanine 124', level: 'lower', baseAngle: 80, angleSpan: 6, covered: false, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 98 } as StadiumSection,
      { id: '125', name: 'Mezzanine 125', level: 'lower', baseAngle: 86, angleSpan: 6, covered: false, price: 'moderate', rows: 20, seatsPerRow: 20, distanceFromField: 100 } as StadiumSection,
      { id: '126', name: 'Mezzanine 126', level: 'lower', baseAngle: 92, angleSpan: 6, covered: false, price: 'moderate', rows: 22, seatsPerRow: 21, distanceFromField: 102 } as StadiumSection,
      { id: '127', name: 'Mezzanine 127', level: 'lower', baseAngle: 98, angleSpan: 6, covered: false, price: 'value', rows: 24, seatsPerRow: 24, distanceFromField: 105 } as StadiumSection,
      { id: '128', name: 'Mezzanine 128', level: 'lower', baseAngle: 104, angleSpan: 7, covered: false, price: 'value', rows: 28, seatsPerRow: 20, distanceFromField: 110 } as StadiumSection,
      { id: '129', name: 'Mezzanine 129', level: 'lower', baseAngle: 111, angleSpan: 7, covered: false, price: 'value', rows: 28, seatsPerRow: 20, distanceFromField: 115 } as StadiumSection,
      // Right field mezzanine (130-133) - largest sections, ~30 rows
      { id: '130', name: 'Mezzanine 130', level: 'lower', baseAngle: 118, angleSpan: 8, covered: false, price: 'value', rows: 30, seatsPerRow: 20, distanceFromField: 120 } as StadiumSection,
      { id: '131', name: 'Mezzanine 131', level: 'lower', baseAngle: 126, angleSpan: 8, covered: false, price: 'value', rows: 30, seatsPerRow: 20, distanceFromField: 125 } as StadiumSection,
      { id: '132', name: 'Mezzanine 132', level: 'lower', baseAngle: 134, angleSpan: 8, covered: false, price: 'value', rows: 30, seatsPerRow: 20, distanceFromField: 130 } as StadiumSection,
      { id: '133', name: 'Mezzanine 133', level: 'lower', baseAngle: 142, angleSpan: 8, covered: false, price: 'value', rows: 31, seatsPerRow: 24, distanceFromField: 135 } as StadiumSection,
      // Left field mezzanine (136-142)
      { id: '136', name: 'Mezzanine 136', level: 'lower', baseAngle: 172, angleSpan: 7, covered: false, price: 'value', rows: 22, seatsPerRow: 20, distanceFromField: 130 } as StadiumSection,
      { id: '137', name: 'Mezzanine 137', level: 'lower', baseAngle: 179, angleSpan: 7, covered: false, price: 'value', rows: 22, seatsPerRow: 20, distanceFromField: 135 } as StadiumSection,
      { id: '138', name: 'Mezzanine 138', level: 'lower', baseAngle: 186, angleSpan: 7, covered: false, price: 'value', rows: 22, seatsPerRow: 20, distanceFromField: 140 } as StadiumSection,
      { id: '139', name: 'Mezzanine 139', level: 'lower', baseAngle: 193, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 14, distanceFromField: 145 } as StadiumSection,
      { id: '140', name: 'Mezzanine 140', level: 'lower', baseAngle: 200, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 14, distanceFromField: 150 } as StadiumSection,
      { id: '141', name: 'Mezzanine 141', level: 'lower', baseAngle: 214, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 14, distanceFromField: 155 } as StadiumSection,
      { id: '142', name: 'Mezzanine 142', level: 'lower', baseAngle: 228, angleSpan: 7, covered: false, price: 'value', rows: 20, seatsPerRow: 19, distanceFromField: 160 } as StadiumSection,

      // Pavilion Level (200 Level) - sections 201-234, ~20 seats per row
      // Third base side (201-212)
      { id: '201', name: 'Pavilion 201', level: 'club', baseAngle: 250, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 150 } as StadiumSection,
      { id: '202', name: 'Pavilion 202', level: 'club', baseAngle: 256, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 148 } as StadiumSection,
      { id: '203', name: 'Pavilion 203', level: 'club', baseAngle: 262, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 146 } as StadiumSection,
      { id: '204', name: 'Pavilion 204', level: 'club', baseAngle: 268, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 144 } as StadiumSection,
      { id: '205', name: 'Pavilion 205', level: 'club', baseAngle: 274, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 142 } as StadiumSection,
      { id: '206', name: 'Pavilion 206', level: 'club', baseAngle: 280, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 16, distanceFromField: 140 } as StadiumSection,
      { id: '207', name: 'Pavilion 207', level: 'club', baseAngle: 286, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 16, distanceFromField: 138 } as StadiumSection,
      { id: '208', name: 'Pavilion 208', level: 'club', baseAngle: 292, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 16, distanceFromField: 136 } as StadiumSection,
      { id: '209', name: 'Pavilion 209', level: 'club', baseAngle: 298, angleSpan: 6, covered: false, price: 'premium', rows: 14, seatsPerRow: 16, distanceFromField: 134 } as StadiumSection,
      { id: '210', name: 'Pavilion 210', level: 'club', baseAngle: 304, angleSpan: 6, covered: false, price: 'premium', rows: 14, seatsPerRow: 16, distanceFromField: 132 } as StadiumSection,
      { id: '211', name: 'Pavilion 211', level: 'club', baseAngle: 310, angleSpan: 6, covered: false, price: 'premium', rows: 14, seatsPerRow: 16, distanceFromField: 130 } as StadiumSection,
      { id: '212', name: 'Pavilion 212', level: 'club', baseAngle: 316, angleSpan: 6, covered: false, price: 'premium', rows: 14, seatsPerRow: 18, distanceFromField: 128 } as StadiumSection,
      // Behind home plate (213-216)
      { id: '213', name: 'Pavilion 213', level: 'club', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium', rows: 14, seatsPerRow: 16, distanceFromField: 126 } as StadiumSection,
      { id: '214', name: 'Pavilion 214', level: 'club', baseAngle: 345, angleSpan: 12, covered: false, price: 'luxury', rows: 14, seatsPerRow: 16, distanceFromField: 125 } as StadiumSection,
      { id: '215', name: 'Pavilion 215', level: 'club', baseAngle: 3, angleSpan: 12, covered: false, price: 'luxury', rows: 14, seatsPerRow: 16, distanceFromField: 125 } as StadiumSection,
      { id: '216', name: 'Pavilion 216', level: 'club', baseAngle: 18, angleSpan: 10, covered: false, price: 'premium', rows: 14, seatsPerRow: 18, distanceFromField: 128 } as StadiumSection,
      // First base side (217-232) - sunny sections 222-232
      { id: '217', name: 'Pavilion 217', level: 'club', baseAngle: 30, angleSpan: 6, covered: false, price: 'premium', rows: 14, seatsPerRow: 16, distanceFromField: 130 } as StadiumSection,
      { id: '218', name: 'Pavilion 218', level: 'club', baseAngle: 36, angleSpan: 6, covered: false, price: 'premium', rows: 14, seatsPerRow: 16, distanceFromField: 132 } as StadiumSection,
      { id: '219', name: 'Pavilion 219', level: 'club', baseAngle: 42, angleSpan: 6, covered: false, price: 'premium', rows: 14, seatsPerRow: 16, distanceFromField: 134 } as StadiumSection,
      { id: '220', name: 'Pavilion 220', level: 'club', baseAngle: 48, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 16, distanceFromField: 136 } as StadiumSection,
      { id: '221', name: 'Pavilion 221', level: 'club', baseAngle: 54, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 16, distanceFromField: 138 } as StadiumSection,
      { id: '222', name: 'Pavilion 222', level: 'club', baseAngle: 60, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 16, distanceFromField: 140 } as StadiumSection,
      { id: '223', name: 'Pavilion 223', level: 'club', baseAngle: 66, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 16, distanceFromField: 142 } as StadiumSection,
      { id: '224', name: 'Pavilion 224', level: 'club', baseAngle: 72, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 144 } as StadiumSection,
      { id: '225', name: 'Pavilion 225', level: 'club', baseAngle: 78, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 146 } as StadiumSection,
      { id: '226', name: 'Pavilion 226', level: 'club', baseAngle: 84, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 148 } as StadiumSection,
      { id: '227', name: 'Pavilion 227', level: 'club', baseAngle: 90, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 150 } as StadiumSection,
      { id: '228', name: 'Pavilion 228', level: 'club', baseAngle: 96, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 152 } as StadiumSection,
      { id: '229', name: 'Pavilion 229', level: 'club', baseAngle: 102, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 154 } as StadiumSection,
      { id: '230', name: 'Pavilion 230', level: 'club', baseAngle: 108, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 156 } as StadiumSection,
      { id: '231', name: 'Pavilion 231', level: 'club', baseAngle: 114, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 158 } as StadiumSection,
      { id: '232', name: 'Pavilion 232', level: 'club', baseAngle: 120, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 19, distanceFromField: 160 } as StadiumSection,
      // Left field pavilion (233-236) - start in shade
      { id: '233', name: 'Pavilion 233', level: 'club', baseAngle: 186, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 18, distanceFromField: 180, partialCoverage: true, coveredRows: '1-6' } as StadiumSection,
      { id: '234', name: 'Pavilion 234', level: 'club', baseAngle: 194, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 18, distanceFromField: 185, partialCoverage: true, coveredRows: '1-6' } as StadiumSection,
      { id: '235', name: 'Pavilion 235', level: 'club', baseAngle: 202, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 18, distanceFromField: 190, partialCoverage: true, coveredRows: '1-6' } as StadiumSection,
      { id: '236', name: 'Pavilion 236', level: 'club', baseAngle: 210, angleSpan: 8, covered: false, price: 'value', rows: 12, seatsPerRow: 18, distanceFromField: 195, partialCoverage: true, coveredRows: '1-6' } as StadiumSection,

      // Upper Deck (300 Level) - sections 301-326, 24-26 seats per row
      // Sections 301-314 under permanent roof section (covered when roof is open)
      { id: '301', name: 'Upper 301', level: 'upper', baseAngle: 250, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 20, distanceFromField: 200 } as StadiumSection,
      { id: '302', name: 'Upper 302', level: 'upper', baseAngle: 256, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 20, distanceFromField: 198 } as StadiumSection,
      { id: '303', name: 'Upper 303', level: 'upper', baseAngle: 262, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 20, distanceFromField: 196 } as StadiumSection,
      { id: '304', name: 'Upper 304', level: 'upper', baseAngle: 268, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 20, distanceFromField: 194 } as StadiumSection,
      { id: '305', name: 'Upper 305', level: 'upper', baseAngle: 274, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 19, distanceFromField: 192 } as StadiumSection,
      { id: '306', name: 'Upper 306', level: 'upper', baseAngle: 280, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 19, distanceFromField: 190 } as StadiumSection,
      { id: '307', name: 'Upper 307', level: 'upper', baseAngle: 286, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 19, distanceFromField: 188 } as StadiumSection,
      { id: '308', name: 'Upper 308', level: 'upper', baseAngle: 292, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 22, distanceFromField: 186 } as StadiumSection,
      { id: '309', name: 'Upper 309', level: 'upper', baseAngle: 298, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 22, distanceFromField: 184 } as StadiumSection,
      { id: '310', name: 'Upper 310', level: 'upper', baseAngle: 304, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 22, distanceFromField: 182 } as StadiumSection,
      { id: '311', name: 'Upper 311', level: 'upper', baseAngle: 310, angleSpan: 6, covered: true, price: 'moderate', rows: 16, seatsPerRow: 22, distanceFromField: 180 } as StadiumSection,
      { id: '312', name: 'Upper 312', level: 'upper', baseAngle: 330, angleSpan: 12, covered: true, price: 'moderate', rows: 16, seatsPerRow: 19, distanceFromField: 178 } as StadiumSection,
      { id: '313', name: 'Upper 313', level: 'upper', baseAngle: 350, angleSpan: 14, covered: true, price: 'moderate', rows: 16, seatsPerRow: 18, distanceFromField: 176 } as StadiumSection,
      { id: '314', name: 'Upper 314', level: 'upper', baseAngle: 8, angleSpan: 12, covered: true, price: 'moderate', rows: 16, seatsPerRow: 19, distanceFromField: 178 } as StadiumSection,
      // First base side - NOT under permanent roof (315-326)
      { id: '315', name: 'Upper 315', level: 'upper', baseAngle: 24, angleSpan: 6, covered: false, price: 'moderate', rows: 16, seatsPerRow: 22, distanceFromField: 180 } as StadiumSection,
      { id: '316', name: 'Upper 316', level: 'upper', baseAngle: 30, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 22, distanceFromField: 182 } as StadiumSection,
      { id: '317', name: 'Upper 317', level: 'upper', baseAngle: 36, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 22, distanceFromField: 184 } as StadiumSection,
      { id: '318', name: 'Upper 318', level: 'upper', baseAngle: 42, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 22, distanceFromField: 186 } as StadiumSection,
      { id: '319', name: 'Upper 319', level: 'upper', baseAngle: 48, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 19, distanceFromField: 188 } as StadiumSection,
      { id: '320', name: 'Upper 320', level: 'upper', baseAngle: 54, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 19, distanceFromField: 190 } as StadiumSection,
      { id: '321', name: 'Upper 321', level: 'upper', baseAngle: 60, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 19, distanceFromField: 192 } as StadiumSection,
      { id: '322', name: 'Upper 322', level: 'upper', baseAngle: 66, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 25, distanceFromField: 194 } as StadiumSection,
      { id: '323', name: 'Upper 323', level: 'upper', baseAngle: 72, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 25, distanceFromField: 196 } as StadiumSection,
      { id: '324', name: 'Upper 324', level: 'upper', baseAngle: 78, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 25, distanceFromField: 198 } as StadiumSection,
      { id: '325', name: 'Upper 325', level: 'upper', baseAngle: 84, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 25, distanceFromField: 200 } as StadiumSection,
      { id: '326', name: 'Upper 326', level: 'upper', baseAngle: 90, angleSpan: 6, covered: false, price: 'value', rows: 16, seatsPerRow: 25, distanceFromField: 202 } as StadiumSection,
    ]
  };
