import type { StadiumSection } from '../stadiumSectionTypes';

// American Family Field - Milwaukee Brewers
// Capacity: 47,061
// RETRACTABLE ROOF stadium - fan-shaped roof can open/close in 10 min
// When roof open: 1st base = shade, 3rd base = sun (day games)
// Club Level 330-338 always climate controlled
// Upper deck has roof overhang protection

export const stadiumSections = {
    stadiumId: 'brewers',
    sections: [
      // Field Infield Box (100 Level center - premium behind home)
      // Sections 112-123 are infield, rows 1-20
      { id: '112', name: 'Field Infield 112', level: 'field', baseAngle: 300, angleSpan: 5, covered: false, price: 'premium', rows: 20, seatsPerRow: 25, distanceFromField: 45 } as StadiumSection,
      { id: '113', name: 'Field Infield 113', level: 'field', baseAngle: 310, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 25, distanceFromField: 42 } as StadiumSection,
      { id: '114', name: 'Field Infield 114', level: 'field', baseAngle: 320, angleSpan: 8, covered: false, price: 'luxury', rows: 20, seatsPerRow: 25, distanceFromField: 38 } as StadiumSection,
      { id: '115', name: 'Field Infield 115', level: 'field', baseAngle: 332, angleSpan: 10, covered: false, price: 'luxury', rows: 20, seatsPerRow: 23, distanceFromField: 35 } as StadiumSection,
      { id: '116', name: 'Field Infield 116', level: 'field', baseAngle: 346, angleSpan: 12, covered: false, price: 'luxury', rows: 20, seatsPerRow: 23, distanceFromField: 32 } as StadiumSection,
      { id: '117', name: 'Field Infield 117', level: 'field', baseAngle: 2, angleSpan: 12, covered: false, price: 'luxury', rows: 20, seatsPerRow: 23, distanceFromField: 32 } as StadiumSection,
      { id: '118', name: 'Field Infield 118', level: 'field', baseAngle: 18, angleSpan: 10, covered: false, price: 'luxury', rows: 20, seatsPerRow: 23, distanceFromField: 35 } as StadiumSection,
      { id: '119', name: 'Field Infield 119', level: 'field', baseAngle: 32, angleSpan: 8, covered: false, price: 'luxury', rows: 20, seatsPerRow: 25, distanceFromField: 38 } as StadiumSection,
      { id: '120', name: 'Field Infield 120', level: 'field', baseAngle: 44, angleSpan: 6, covered: false, price: 'premium', rows: 20, seatsPerRow: 25, distanceFromField: 42 } as StadiumSection,
      { id: '121', name: 'Field Infield 121', level: 'field', baseAngle: 54, angleSpan: 5, covered: false, price: 'premium', rows: 20, seatsPerRow: 23, distanceFromField: 45 } as StadiumSection,
      { id: '122', name: 'Field Infield 122', level: 'field', baseAngle: 62, angleSpan: 5, covered: false, price: 'premium', rows: 20, seatsPerRow: 23, distanceFromField: 48 } as StadiumSection,
      { id: '123', name: 'Field Infield 123', level: 'field', baseAngle: 70, angleSpan: 5, covered: false, price: 'moderate', rows: 20, seatsPerRow: 25, distanceFromField: 52 } as StadiumSection,

      // Field Corner/End sections (100 Level)
      // Third base corner (107-111)
      { id: '107', name: 'Field 107', level: 'field', baseAngle: 250, angleSpan: 8, covered: false, price: 'moderate', rows: 18, seatsPerRow: 25, distanceFromField: 70 } as StadiumSection,
      { id: '108', name: 'Field 108', level: 'field', baseAngle: 258, angleSpan: 8, covered: false, price: 'moderate', rows: 18, seatsPerRow: 25, distanceFromField: 65 } as StadiumSection,
      { id: '109', name: 'Field 109', level: 'field', baseAngle: 268, angleSpan: 8, covered: false, price: 'moderate', rows: 18, seatsPerRow: 23, distanceFromField: 58 } as StadiumSection,
      { id: '110', name: 'Field 110', level: 'field', baseAngle: 278, angleSpan: 8, covered: false, price: 'moderate', rows: 18, seatsPerRow: 23, distanceFromField: 52 } as StadiumSection,
      { id: '111', name: 'Field 111', level: 'field', baseAngle: 290, angleSpan: 8, covered: false, price: 'moderate', rows: 18, seatsPerRow: 25, distanceFromField: 48 } as StadiumSection,
      // First base corner (124-129) - gets shade earlier
      { id: '124', name: 'Field 124', level: 'field', baseAngle: 78, angleSpan: 5, covered: false, price: 'moderate', rows: 20, seatsPerRow: 25, distanceFromField: 55 } as StadiumSection,
      { id: '125', name: 'Field 125', level: 'field', baseAngle: 86, angleSpan: 6, covered: false, price: 'moderate', rows: 20, seatsPerRow: 25, distanceFromField: 58 } as StadiumSection,
      { id: '126', name: 'Field 126', level: 'field', baseAngle: 94, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 36, distanceFromField: 62 } as StadiumSection,
      { id: '127', name: 'Field 127', level: 'field', baseAngle: 102, angleSpan: 6, covered: false, price: 'moderate', rows: 18, seatsPerRow: 36, distanceFromField: 66 } as StadiumSection,
      { id: '128', name: 'Field 128', level: 'field', baseAngle: 110, angleSpan: 6, covered: false, price: 'value', rows: 18, seatsPerRow: 38, distanceFromField: 70 } as StadiumSection,
      { id: '129', name: 'Field 129', level: 'field', baseAngle: 118, angleSpan: 6, covered: false, price: 'value', rows: 18, seatsPerRow: 38, distanceFromField: 75 } as StadiumSection,
      // Left field corner (101-106) - Video Viewing Only sections
      { id: '101', name: 'Field Bleachers 101', level: 'field', baseAngle: 190, angleSpan: 10, covered: false, price: 'value', rows: 15, seatsPerRow: 30, distanceFromField: 100 } as StadiumSection,
      { id: '102', name: 'Field Bleachers 102', level: 'field', baseAngle: 200, angleSpan: 10, covered: false, price: 'value', rows: 15, seatsPerRow: 30, distanceFromField: 95 } as StadiumSection,
      { id: '103', name: 'Field Bleachers 103', level: 'field', baseAngle: 210, angleSpan: 10, covered: false, price: 'value', rows: 15, seatsPerRow: 30, distanceFromField: 90 } as StadiumSection,
      { id: '104', name: 'Field Bleachers 104', level: 'field', baseAngle: 220, angleSpan: 10, covered: false, price: 'value', rows: 15, seatsPerRow: 30, distanceFromField: 85 } as StadiumSection,
      { id: '105', name: 'Field 105', level: 'field', baseAngle: 232, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 28, distanceFromField: 80 } as StadiumSection,
      { id: '106', name: 'Field 106', level: 'field', baseAngle: 242, angleSpan: 8, covered: false, price: 'value', rows: 16, seatsPerRow: 28, distanceFromField: 75 } as StadiumSection,
      // Right field (130-131)
      { id: '130', name: 'Field 130', level: 'field', baseAngle: 130, angleSpan: 10, covered: false, price: 'value', rows: 16, seatsPerRow: 31, distanceFromField: 80 } as StadiumSection,
      { id: '131', name: 'Field 131', level: 'field', baseAngle: 142, angleSpan: 10, covered: false, price: 'value', rows: 16, seatsPerRow: 30, distanceFromField: 85 } as StadiumSection,

      // Loge Level (200 Level) - sections 206-235
      // Left field loge (Video Viewing 201-205 skipped)
      { id: '206', name: 'Loge 206', level: 'lower', baseAngle: 238, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 25, distanceFromField: 110 } as StadiumSection,
      { id: '207', name: 'Loge 207', level: 'lower', baseAngle: 246, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 25, distanceFromField: 105 } as StadiumSection,
      { id: '208', name: 'Loge 208', level: 'lower', baseAngle: 254, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 23, distanceFromField: 100 } as StadiumSection,
      { id: '209', name: 'Loge 209', level: 'lower', baseAngle: 262, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 23, distanceFromField: 95 } as StadiumSection,
      { id: '210', name: 'Loge 210', level: 'lower', baseAngle: 270, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 23, distanceFromField: 90 } as StadiumSection,
      { id: '211', name: 'Loge 211', level: 'lower', baseAngle: 278, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 23, distanceFromField: 88 } as StadiumSection,
      { id: '212', name: 'Loge 212', level: 'lower', baseAngle: 286, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 23, distanceFromField: 85 } as StadiumSection,
      { id: '213', name: 'Loge 213', level: 'lower', baseAngle: 294, angleSpan: 6, covered: false, price: 'premium', rows: 14, seatsPerRow: 25, distanceFromField: 82 } as StadiumSection,
      { id: '214', name: 'Loge 214', level: 'lower', baseAngle: 304, angleSpan: 8, covered: false, price: 'premium', rows: 14, seatsPerRow: 25, distanceFromField: 80 } as StadiumSection,
      { id: '215', name: 'Loge 215', level: 'lower', baseAngle: 316, angleSpan: 10, covered: false, price: 'premium', rows: 14, seatsPerRow: 25, distanceFromField: 78 } as StadiumSection,
      // Behind home plate loge
      { id: '216', name: 'Loge 216', level: 'lower', baseAngle: 330, angleSpan: 12, covered: false, price: 'premium', rows: 14, seatsPerRow: 23, distanceFromField: 75 } as StadiumSection,
      { id: '217', name: 'Loge 217', level: 'lower', baseAngle: 348, angleSpan: 14, covered: false, price: 'premium', rows: 14, seatsPerRow: 23, distanceFromField: 72 } as StadiumSection,
      { id: '218', name: 'Loge 218', level: 'lower', baseAngle: 8, angleSpan: 14, covered: false, price: 'premium', rows: 14, seatsPerRow: 23, distanceFromField: 72 } as StadiumSection,
      { id: '219', name: 'Loge 219', level: 'lower', baseAngle: 26, angleSpan: 12, covered: false, price: 'premium', rows: 14, seatsPerRow: 25, distanceFromField: 75 } as StadiumSection,
      // First base loge (gets shade earlier)
      { id: '220', name: 'Loge 220', level: 'lower', baseAngle: 42, angleSpan: 10, covered: false, price: 'premium', rows: 14, seatsPerRow: 20, distanceFromField: 78 } as StadiumSection,
      { id: '221', name: 'Loge 221', level: 'lower', baseAngle: 56, angleSpan: 8, covered: false, price: 'premium', rows: 14, seatsPerRow: 20, distanceFromField: 80 } as StadiumSection,
      { id: '222', name: 'Loge 222', level: 'lower', baseAngle: 68, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 23, distanceFromField: 82 } as StadiumSection,
      { id: '223', name: 'Loge 223', level: 'lower', baseAngle: 78, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 85 } as StadiumSection,
      { id: '224', name: 'Loge 224', level: 'lower', baseAngle: 88, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 88 } as StadiumSection,
      { id: '225', name: 'Loge 225', level: 'lower', baseAngle: 98, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 18, distanceFromField: 90 } as StadiumSection,
      { id: '226', name: 'Loge 226', level: 'lower', baseAngle: 108, angleSpan: 6, covered: false, price: 'moderate', rows: 14, seatsPerRow: 20, distanceFromField: 95 } as StadiumSection,
      { id: '227', name: 'Loge 227', level: 'lower', baseAngle: 118, angleSpan: 6, covered: false, price: 'value', rows: 14, seatsPerRow: 20, distanceFromField: 100 } as StadiumSection,
      // Right field loge (sunniest sections 228-235)
      { id: '228', name: 'Loge 228', level: 'lower', baseAngle: 128, angleSpan: 8, covered: false, price: 'value', rows: 14, seatsPerRow: 28, distanceFromField: 105 } as StadiumSection,
      { id: '229', name: 'Loge 229', level: 'lower', baseAngle: 138, angleSpan: 8, covered: false, price: 'value', rows: 14, seatsPerRow: 28, distanceFromField: 110 } as StadiumSection,
      { id: '230', name: 'Loge 230', level: 'lower', baseAngle: 150, angleSpan: 10, covered: false, price: 'value', rows: 14, seatsPerRow: 28, distanceFromField: 115 } as StadiumSection,
      { id: '231', name: 'Loge 231', level: 'lower', baseAngle: 164, angleSpan: 10, covered: false, price: 'value', rows: 14, seatsPerRow: 28, distanceFromField: 120 } as StadiumSection,
      { id: '232', name: 'Loge 232', level: 'lower', baseAngle: 178, angleSpan: 10, covered: false, price: 'value', rows: 14, seatsPerRow: 20, distanceFromField: 125 } as StadiumSection,
      { id: '233', name: 'Loge 233', level: 'lower', baseAngle: 192, angleSpan: 10, covered: false, price: 'value', rows: 14, seatsPerRow: 20, distanceFromField: 125 } as StadiumSection,
      { id: '234', name: 'Loge 234', level: 'lower', baseAngle: 206, angleSpan: 10, covered: false, price: 'value', rows: 14, seatsPerRow: 20, distanceFromField: 120 } as StadiumSection,
      { id: '235', name: 'Loge 235', level: 'lower', baseAngle: 220, angleSpan: 10, covered: false, price: 'value', rows: 14, seatsPerRow: 20, distanceFromField: 115 } as StadiumSection,

      // Club Level (300 Level) - sections 320-339
      // Climate controlled, all covered
      { id: '320', name: 'Club 320', level: 'club', baseAngle: 270, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 130 } as StadiumSection,
      { id: '321', name: 'Club 321', level: 'club', baseAngle: 280, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 128 } as StadiumSection,
      { id: '322', name: 'Club 322', level: 'club', baseAngle: 290, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 126 } as StadiumSection,
      { id: '323', name: 'Club 323', level: 'club', baseAngle: 300, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 124 } as StadiumSection,
      { id: '324', name: 'Club 324', level: 'club', baseAngle: 310, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 18, distanceFromField: 122 } as StadiumSection,
      { id: '325', name: 'Club 325', level: 'club', baseAngle: 320, angleSpan: 10, covered: true, price: 'luxury', rows: 10, seatsPerRow: 18, distanceFromField: 120 } as StadiumSection,
      { id: '326', name: 'Club 326', level: 'club', baseAngle: 332, angleSpan: 10, covered: true, price: 'luxury', rows: 10, seatsPerRow: 15, distanceFromField: 118 } as StadiumSection,
      { id: '327', name: 'Club 327', level: 'club', baseAngle: 346, angleSpan: 12, covered: true, price: 'luxury', rows: 10, seatsPerRow: 15, distanceFromField: 116 } as StadiumSection,
      { id: '328', name: 'Club 328', level: 'club', baseAngle: 4, angleSpan: 12, covered: true, price: 'luxury', rows: 10, seatsPerRow: 15, distanceFromField: 116 } as StadiumSection,
      { id: '329', name: 'Club 329', level: 'club', baseAngle: 20, angleSpan: 10, covered: true, price: 'luxury', rows: 10, seatsPerRow: 18, distanceFromField: 118 } as StadiumSection,
      { id: '330', name: 'Club 330', level: 'club', baseAngle: 34, angleSpan: 10, covered: true, price: 'luxury', rows: 10, seatsPerRow: 18, distanceFromField: 120 } as StadiumSection,
      { id: '331', name: 'Club 331', level: 'club', baseAngle: 48, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 18, distanceFromField: 122 } as StadiumSection,
      { id: '332', name: 'Club 332', level: 'club', baseAngle: 60, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 124 } as StadiumSection,
      { id: '333', name: 'Club 333', level: 'club', baseAngle: 72, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 126 } as StadiumSection,
      { id: '334', name: 'Club 334', level: 'club', baseAngle: 84, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 128 } as StadiumSection,
      { id: '335', name: 'Club 335', level: 'club', baseAngle: 96, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 130 } as StadiumSection,
      { id: '336', name: 'Club 336', level: 'club', baseAngle: 108, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 132 } as StadiumSection,
      { id: '337', name: 'Club 337', level: 'club', baseAngle: 120, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 134 } as StadiumSection,
      { id: '338', name: 'Club 338', level: 'club', baseAngle: 132, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 136 } as StadiumSection,
      { id: '339', name: 'Club 339', level: 'club', baseAngle: 144, angleSpan: 8, covered: true, price: 'luxury', rows: 10, seatsPerRow: 20, distanceFromField: 138 } as StadiumSection,

      // Terrace Level (400 Level) - sections 404-442
      // Third base upper (404-417) - roof overhang
      { id: '404', name: 'Terrace 404', level: 'upper', baseAngle: 238, angleSpan: 8, covered: true, price: 'value', rows: 20, seatsPerRow: 28, distanceFromField: 180 } as StadiumSection,
      { id: '405', name: 'Terrace 405', level: 'upper', baseAngle: 248, angleSpan: 8, covered: true, price: 'value', rows: 20, seatsPerRow: 33, distanceFromField: 175 } as StadiumSection,
      { id: '406', name: 'Terrace 406', level: 'upper', baseAngle: 258, angleSpan: 8, covered: true, price: 'value', rows: 18, seatsPerRow: 30, distanceFromField: 170 } as StadiumSection,
      { id: '407', name: 'Terrace 407', level: 'upper', baseAngle: 268, angleSpan: 6, covered: true, price: 'value', rows: 18, seatsPerRow: 28, distanceFromField: 165 } as StadiumSection,
      { id: '408', name: 'Terrace 408', level: 'upper', baseAngle: 276, angleSpan: 6, covered: true, price: 'value', rows: 18, seatsPerRow: 28, distanceFromField: 162 } as StadiumSection,
      { id: '409', name: 'Terrace 409', level: 'upper', baseAngle: 284, angleSpan: 6, covered: true, price: 'value', rows: 18, seatsPerRow: 20, distanceFromField: 158 } as StadiumSection,
      { id: '410', name: 'Terrace 410', level: 'upper', baseAngle: 292, angleSpan: 6, covered: true, price: 'value', rows: 18, seatsPerRow: 20, distanceFromField: 155 } as StadiumSection,
      { id: '411', name: 'Terrace 411', level: 'upper', baseAngle: 300, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 18, distanceFromField: 152 } as StadiumSection,
      { id: '412', name: 'Terrace 412', level: 'upper', baseAngle: 308, angleSpan: 8, covered: true, price: 'value', rows: 16, seatsPerRow: 18, distanceFromField: 150 } as StadiumSection,
      { id: '413', name: 'Terrace 413', level: 'upper', baseAngle: 318, angleSpan: 10, covered: true, price: 'moderate', rows: 16, seatsPerRow: 20, distanceFromField: 148 } as StadiumSection,
      { id: '414', name: 'Terrace 414', level: 'upper', baseAngle: 332, angleSpan: 12, covered: true, price: 'moderate', rows: 16, seatsPerRow: 20, distanceFromField: 146 } as StadiumSection,
      { id: '415', name: 'Terrace 415', level: 'upper', baseAngle: 350, angleSpan: 14, covered: true, price: 'moderate', rows: 16, seatsPerRow: 18, distanceFromField: 144 } as StadiumSection,
      { id: '416', name: 'Terrace 416', level: 'upper', baseAngle: 8, angleSpan: 14, covered: true, price: 'moderate', rows: 16, seatsPerRow: 18, distanceFromField: 144 } as StadiumSection,
      { id: '417', name: 'Terrace 417', level: 'upper', baseAngle: 26, angleSpan: 12, covered: true, price: 'moderate', rows: 16, seatsPerRow: 20, distanceFromField: 146 } as StadiumSection,
      // First base upper (418-427) - shaded side, roof overhang
      { id: '418', name: 'Terrace 418', level: 'upper', baseAngle: 42, angleSpan: 10, covered: true, price: 'value', rows: 16, seatsPerRow: 20, distanceFromField: 148 } as StadiumSection,
      { id: '419', name: 'Terrace 419', level: 'upper', baseAngle: 56, angleSpan: 8, covered: true, price: 'value', rows: 16, seatsPerRow: 18, distanceFromField: 150 } as StadiumSection,
      { id: '420', name: 'Terrace 420', level: 'upper', baseAngle: 68, angleSpan: 6, covered: true, price: 'value', rows: 16, seatsPerRow: 18, distanceFromField: 152 } as StadiumSection,
      { id: '421', name: 'Terrace 421', level: 'upper', baseAngle: 78, angleSpan: 6, covered: true, price: 'value', rows: 18, seatsPerRow: 20, distanceFromField: 155 } as StadiumSection,
      { id: '422', name: 'Terrace 422', level: 'upper', baseAngle: 88, angleSpan: 6, covered: true, price: 'value', rows: 18, seatsPerRow: 20, distanceFromField: 158 } as StadiumSection,
      { id: '423', name: 'Terrace 423', level: 'upper', baseAngle: 98, angleSpan: 6, covered: true, price: 'value', rows: 18, seatsPerRow: 28, distanceFromField: 162 } as StadiumSection,
      { id: '424', name: 'Terrace 424', level: 'upper', baseAngle: 108, angleSpan: 6, covered: true, price: 'value', rows: 18, seatsPerRow: 28, distanceFromField: 165 } as StadiumSection,
      { id: '425', name: 'Terrace 425', level: 'upper', baseAngle: 118, angleSpan: 8, covered: true, price: 'value', rows: 18, seatsPerRow: 30, distanceFromField: 170 } as StadiumSection,
      { id: '426', name: 'Terrace 426', level: 'upper', baseAngle: 128, angleSpan: 8, covered: true, price: 'value', rows: 20, seatsPerRow: 33, distanceFromField: 175 } as StadiumSection,
      { id: '427', name: 'Terrace 427', level: 'upper', baseAngle: 138, angleSpan: 8, covered: true, price: 'value', rows: 20, seatsPerRow: 28, distanceFromField: 180 } as StadiumSection,
      // Outfield upper (438-442) - sunniest sections when roof open
      { id: '438', name: 'Terrace 438', level: 'upper', baseAngle: 152, angleSpan: 10, covered: false, price: 'value', rows: 18, seatsPerRow: 30, distanceFromField: 200 } as StadiumSection,
      { id: '439', name: 'Terrace 439', level: 'upper', baseAngle: 166, angleSpan: 10, covered: false, price: 'value', rows: 18, seatsPerRow: 41, distanceFromField: 210 } as StadiumSection,
      { id: '440', name: 'Terrace 440', level: 'upper', baseAngle: 180, angleSpan: 10, covered: false, price: 'value', rows: 18, seatsPerRow: 43, distanceFromField: 215 } as StadiumSection,
      { id: '441', name: 'Terrace 441', level: 'upper', baseAngle: 194, angleSpan: 10, covered: false, price: 'value', rows: 18, seatsPerRow: 41, distanceFromField: 210 } as StadiumSection,
      { id: '442', name: 'Terrace 442', level: 'upper', baseAngle: 208, angleSpan: 10, covered: false, price: 'value', rows: 18, seatsPerRow: 30, distanceFromField: 200 } as StadiumSection,
    ]
  };
