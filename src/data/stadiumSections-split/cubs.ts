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
    stadiumId: 'cubs',
    sections: [
      // Field Box - Behind Home Plate
      { id: 'FB14', name: 'Field Box 14', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'FB15', name: 'Field Box 15', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'FB16', name: 'Field Box 16', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'FB17', name: 'Field Box 17', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'luxury' },
      
      // Field Box - Third Base Line
      { id: 'FB1', name: 'Field Box 1', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB2', name: 'Field Box 2', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB3', name: 'Field Box 3', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB4', name: 'Field Box 4', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB5', name: 'Field Box 5', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB6', name: 'Field Box 6', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB7', name: 'Field Box 7', level: 'field', baseAngle: 68, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB8', name: 'Field Box 8', level: 'field', baseAngle: 76, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB9', name: 'Field Box 9', level: 'field', baseAngle: 84, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB10', name: 'Field Box 10', level: 'field', baseAngle: 92, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB11', name: 'Field Box 11', level: 'field', baseAngle: 100, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB12', name: 'Field Box 12', level: 'field', baseAngle: 108, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB13', name: 'Field Box 13', level: 'field', baseAngle: 116, angleSpan: 8, covered: false, price: 'premium' },
      
      // Field Box - First Base Line
      { id: 'FB18', name: 'Field Box 18', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB19', name: 'Field Box 19', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB20', name: 'Field Box 20', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB21', name: 'Field Box 21', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB22', name: 'Field Box 22', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB23', name: 'Field Box 23', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB24', name: 'Field Box 24', level: 'field', baseAngle: 292, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB25', name: 'Field Box 25', level: 'field', baseAngle: 284, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB26', name: 'Field Box 26', level: 'field', baseAngle: 276, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB27', name: 'Field Box 27', level: 'field', baseAngle: 268, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB28', name: 'Field Box 28', level: 'field', baseAngle: 260, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB29', name: 'Field Box 29', level: 'field', baseAngle: 252, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'FB30', name: 'Field Box 30', level: 'field', baseAngle: 244, angleSpan: 8, covered: false, price: 'premium' },
      
      // Terrace Box - Lower Level Behind Home
      { id: 'TB213', name: 'Terrace Box 213', level: 'lower', baseAngle: 340, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'TB214', name: 'Terrace Box 214', level: 'lower', baseAngle: 346, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'TB215', name: 'Terrace Box 215', level: 'lower', baseAngle: 352, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'TB216', name: 'Terrace Box 216', level: 'lower', baseAngle: 358, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'TB217', name: 'Terrace Box 217', level: 'lower', baseAngle: 4, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'TB218', name: 'Terrace Box 218', level: 'lower', baseAngle: 10, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'TB219', name: 'Terrace Box 219', level: 'lower', baseAngle: 16, angleSpan: 6, covered: true, price: 'moderate' },
      
      // Terrace Box - Third Base Side
      { id: 'TB201', name: 'Terrace Box 201', level: 'lower', baseAngle: 22, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB202', name: 'Terrace Box 202', level: 'lower', baseAngle: 28, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB203', name: 'Terrace Box 203', level: 'lower', baseAngle: 34, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB204', name: 'Terrace Box 204', level: 'lower', baseAngle: 40, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB205', name: 'Terrace Box 205', level: 'lower', baseAngle: 46, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB206', name: 'Terrace Box 206', level: 'lower', baseAngle: 52, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB207', name: 'Terrace Box 207', level: 'lower', baseAngle: 58, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB208', name: 'Terrace Box 208', level: 'lower', baseAngle: 64, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB209', name: 'Terrace Box 209', level: 'lower', baseAngle: 70, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB210', name: 'Terrace Box 210', level: 'lower', baseAngle: 76, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB211', name: 'Terrace Box 211', level: 'lower', baseAngle: 82, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB212', name: 'Terrace Box 212', level: 'lower', baseAngle: 88, angleSpan: 6, covered: false, price: 'moderate' },
      
      // Terrace Box - First Base Side
      { id: 'TB220', name: 'Terrace Box 220', level: 'lower', baseAngle: 334, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB221', name: 'Terrace Box 221', level: 'lower', baseAngle: 328, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB222', name: 'Terrace Box 222', level: 'lower', baseAngle: 322, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB223', name: 'Terrace Box 223', level: 'lower', baseAngle: 316, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB224', name: 'Terrace Box 224', level: 'lower', baseAngle: 310, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB225', name: 'Terrace Box 225', level: 'lower', baseAngle: 304, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB226', name: 'Terrace Box 226', level: 'lower', baseAngle: 298, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB227', name: 'Terrace Box 227', level: 'lower', baseAngle: 292, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB228', name: 'Terrace Box 228', level: 'lower', baseAngle: 286, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB229', name: 'Terrace Box 229', level: 'lower', baseAngle: 280, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB230', name: 'Terrace Box 230', level: 'lower', baseAngle: 274, angleSpan: 6, covered: false, price: 'moderate' },
      { id: 'TB231', name: 'Terrace Box 231', level: 'lower', baseAngle: 268, angleSpan: 6, covered: false, price: 'moderate' },
      
      // Terrace Reserved - Third Base Side
      { id: 'TR101', name: 'Terrace Reserved 101', level: 'lower', baseAngle: 94, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR102', name: 'Terrace Reserved 102', level: 'lower', baseAngle: 100, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR103', name: 'Terrace Reserved 103', level: 'lower', baseAngle: 106, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR104', name: 'Terrace Reserved 104', level: 'lower', baseAngle: 112, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR105', name: 'Terrace Reserved 105', level: 'lower', baseAngle: 118, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR106', name: 'Terrace Reserved 106', level: 'lower', baseAngle: 124, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR107', name: 'Terrace Reserved 107', level: 'lower', baseAngle: 130, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR108', name: 'Terrace Reserved 108', level: 'lower', baseAngle: 136, angleSpan: 6, covered: false, price: 'value' },
      
      // Terrace Reserved - First Base Side
      { id: 'TR132', name: 'Terrace Reserved 132', level: 'lower', baseAngle: 262, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR133', name: 'Terrace Reserved 133', level: 'lower', baseAngle: 256, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR134', name: 'Terrace Reserved 134', level: 'lower', baseAngle: 250, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR135', name: 'Terrace Reserved 135', level: 'lower', baseAngle: 244, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR136', name: 'Terrace Reserved 136', level: 'lower', baseAngle: 238, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR137', name: 'Terrace Reserved 137', level: 'lower', baseAngle: 232, angleSpan: 6, covered: false, price: 'value' },
      { id: 'TR138', name: 'Terrace Reserved 138', level: 'lower', baseAngle: 226, angleSpan: 6, covered: false, price: 'value' },
      
      // Upper Deck Box - Behind Home
      { id: 'UD413', name: 'Upper Deck Box 413', level: 'upper', baseAngle: 340, angleSpan: 6, covered: true, price: 'value' },
      { id: 'UD414', name: 'Upper Deck Box 414', level: 'upper', baseAngle: 346, angleSpan: 6, covered: true, price: 'value' },
      { id: 'UD415', name: 'Upper Deck Box 415', level: 'upper', baseAngle: 352, angleSpan: 6, covered: true, price: 'value' },
      { id: 'UD416', name: 'Upper Deck Box 416', level: 'upper', baseAngle: 358, angleSpan: 6, covered: true, price: 'value' },
      { id: 'UD417', name: 'Upper Deck Box 417', level: 'upper', baseAngle: 4, angleSpan: 6, covered: true, price: 'value' },
      { id: 'UD418', name: 'Upper Deck Box 418', level: 'upper', baseAngle: 10, angleSpan: 6, covered: true, price: 'value' },
      { id: 'UD419', name: 'Upper Deck Box 419', level: 'upper', baseAngle: 16, angleSpan: 6, covered: true, price: 'value' },
      
      // Upper Deck Box - Third Base Side
      { id: 'UD401', name: 'Upper Deck Box 401', level: 'upper', baseAngle: 22, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD402', name: 'Upper Deck Box 402', level: 'upper', baseAngle: 28, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD403', name: 'Upper Deck Box 403', level: 'upper', baseAngle: 34, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD404', name: 'Upper Deck Box 404', level: 'upper', baseAngle: 40, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD405', name: 'Upper Deck Box 405', level: 'upper', baseAngle: 46, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD406', name: 'Upper Deck Box 406', level: 'upper', baseAngle: 52, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD407', name: 'Upper Deck Box 407', level: 'upper', baseAngle: 58, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD408', name: 'Upper Deck Box 408', level: 'upper', baseAngle: 64, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD409', name: 'Upper Deck Box 409', level: 'upper', baseAngle: 70, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD410', name: 'Upper Deck Box 410', level: 'upper', baseAngle: 76, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD411', name: 'Upper Deck Box 411', level: 'upper', baseAngle: 82, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD412', name: 'Upper Deck Box 412', level: 'upper', baseAngle: 88, angleSpan: 6, covered: false, price: 'value' },
      
      // Upper Deck Box - First Base Side
      { id: 'UD420', name: 'Upper Deck Box 420', level: 'upper', baseAngle: 334, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD421', name: 'Upper Deck Box 421', level: 'upper', baseAngle: 328, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD422', name: 'Upper Deck Box 422', level: 'upper', baseAngle: 322, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD423', name: 'Upper Deck Box 423', level: 'upper', baseAngle: 316, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD424', name: 'Upper Deck Box 424', level: 'upper', baseAngle: 310, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD425', name: 'Upper Deck Box 425', level: 'upper', baseAngle: 304, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD426', name: 'Upper Deck Box 426', level: 'upper', baseAngle: 298, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD427', name: 'Upper Deck Box 427', level: 'upper', baseAngle: 292, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD428', name: 'Upper Deck Box 428', level: 'upper', baseAngle: 286, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD429', name: 'Upper Deck Box 429', level: 'upper', baseAngle: 280, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD430', name: 'Upper Deck Box 430', level: 'upper', baseAngle: 274, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UD431', name: 'Upper Deck Box 431', level: 'upper', baseAngle: 268, angleSpan: 6, covered: false, price: 'value' },
      
      // Upper Deck Reserved
      { id: 'UR501', name: 'Upper Deck Reserved 501', level: 'upper', baseAngle: 94, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR502', name: 'Upper Deck Reserved 502', level: 'upper', baseAngle: 100, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR503', name: 'Upper Deck Reserved 503', level: 'upper', baseAngle: 106, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR504', name: 'Upper Deck Reserved 504', level: 'upper', baseAngle: 112, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR505', name: 'Upper Deck Reserved 505', level: 'upper', baseAngle: 118, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR506', name: 'Upper Deck Reserved 506', level: 'upper', baseAngle: 124, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR507', name: 'Upper Deck Reserved 507', level: 'upper', baseAngle: 130, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR508', name: 'Upper Deck Reserved 508', level: 'upper', baseAngle: 136, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR509', name: 'Upper Deck Reserved 509', level: 'upper', baseAngle: 142, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR532', name: 'Upper Deck Reserved 532', level: 'upper', baseAngle: 262, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR533', name: 'Upper Deck Reserved 533', level: 'upper', baseAngle: 256, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR534', name: 'Upper Deck Reserved 534', level: 'upper', baseAngle: 250, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR535', name: 'Upper Deck Reserved 535', level: 'upper', baseAngle: 244, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR536', name: 'Upper Deck Reserved 536', level: 'upper', baseAngle: 238, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR537', name: 'Upper Deck Reserved 537', level: 'upper', baseAngle: 232, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR538', name: 'Upper Deck Reserved 538', level: 'upper', baseAngle: 226, angleSpan: 6, covered: false, price: 'value' },
      { id: 'UR539', name: 'Upper Deck Reserved 539', level: 'upper', baseAngle: 220, angleSpan: 6, covered: false, price: 'value' },
      
      // Bleachers
      { id: 'BL301', name: 'Bleachers 301', level: 'upper', baseAngle: 148, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BL302', name: 'Bleachers 302', level: 'upper', baseAngle: 156, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BL303', name: 'Bleachers 303', level: 'upper', baseAngle: 164, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BL304', name: 'Bleachers 304', level: 'upper', baseAngle: 172, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BL305', name: 'Bleachers 305', level: 'upper', baseAngle: 180, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BL306', name: 'Bleachers 306', level: 'upper', baseAngle: 188, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BL307', name: 'Bleachers 307', level: 'upper', baseAngle: 196, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BL308', name: 'Bleachers 308', level: 'upper', baseAngle: 204, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BL309', name: 'Bleachers 309', level: 'upper', baseAngle: 212, angleSpan: 8, covered: false, price: 'value' },
      
      // Budweiser Bleachers (Right Field)
      { id: 'BB201', name: 'Budweiser Bleachers 201', level: 'upper', baseAngle: 94, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BB202', name: 'Budweiser Bleachers 202', level: 'upper', baseAngle: 102, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BB203', name: 'Budweiser Bleachers 203', level: 'upper', baseAngle: 110, angleSpan: 8, covered: false, price: 'value' },
      
      // Budweiser Bleachers (Left Field)
      { id: 'BB231', name: 'Budweiser Bleachers 231', level: 'upper', baseAngle: 250, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BB232', name: 'Budweiser Bleachers 232', level: 'upper', baseAngle: 258, angleSpan: 8, covered: false, price: 'value' },
      { id: 'BB233', name: 'Budweiser Bleachers 233', level: 'upper', baseAngle: 266, angleSpan: 8, covered: false, price: 'value' },
    ]
  };
