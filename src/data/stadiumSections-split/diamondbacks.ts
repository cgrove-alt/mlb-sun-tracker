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
    stadiumId: 'diamondbacks',
    sections: [
      // Dugout Box - Behind Home Plate
      { id: 'DGB', name: 'Dugout Box B', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'DGC', name: 'Dugout Box C', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'DGD', name: 'Dugout Box D', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'DGE', name: 'Dugout Box E', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'luxury' },
      
      // Infield Box - Third Base Line
      { id: 'IB104', name: 'Infield Box 104', level: 'field', baseAngle: 20, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB105', name: 'Infield Box 105', level: 'field', baseAngle: 28, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB106', name: 'Infield Box 106', level: 'field', baseAngle: 36, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB107', name: 'Infield Box 107', level: 'field', baseAngle: 44, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB108', name: 'Infield Box 108', level: 'field', baseAngle: 52, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB109', name: 'Infield Box 109', level: 'field', baseAngle: 60, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB110', name: 'Infield Box 110', level: 'field', baseAngle: 68, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB111', name: 'Infield Box 111', level: 'field', baseAngle: 76, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB112', name: 'Infield Box 112', level: 'field', baseAngle: 84, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB113', name: 'Infield Box 113', level: 'field', baseAngle: 92, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB114', name: 'Infield Box 114', level: 'field', baseAngle: 100, angleSpan: 8, covered: true, price: 'premium' },
      
      // Infield Box - First Base Line
      { id: 'IB115', name: 'Infield Box 115', level: 'field', baseAngle: 332, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB116', name: 'Infield Box 116', level: 'field', baseAngle: 324, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB117', name: 'Infield Box 117', level: 'field', baseAngle: 316, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB118', name: 'Infield Box 118', level: 'field', baseAngle: 308, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB119', name: 'Infield Box 119', level: 'field', baseAngle: 300, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB120', name: 'Infield Box 120', level: 'field', baseAngle: 292, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB121', name: 'Infield Box 121', level: 'field', baseAngle: 284, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB122', name: 'Infield Box 122', level: 'field', baseAngle: 276, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB123', name: 'Infield Box 123', level: 'field', baseAngle: 268, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB124', name: 'Infield Box 124', level: 'field', baseAngle: 260, angleSpan: 8, covered: true, price: 'premium' },
      
      // Outfield Box
      { id: 'OF125', name: 'Outfield Box 125', level: 'field', baseAngle: 108, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF126', name: 'Outfield Box 126', level: 'field', baseAngle: 116, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF127', name: 'Outfield Box 127', level: 'field', baseAngle: 124, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF128', name: 'Outfield Box 128', level: 'field', baseAngle: 132, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF129', name: 'Outfield Box 129', level: 'field', baseAngle: 140, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF130', name: 'Outfield Box 130', level: 'field', baseAngle: 148, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF131', name: 'Outfield Box 131', level: 'field', baseAngle: 156, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF132', name: 'Outfield Box 132', level: 'field', baseAngle: 164, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF133', name: 'Outfield Box 133', level: 'field', baseAngle: 172, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF134', name: 'Outfield Box 134', level: 'field', baseAngle: 180, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF135', name: 'Outfield Box 135', level: 'field', baseAngle: 188, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF136', name: 'Outfield Box 136', level: 'field', baseAngle: 196, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF137', name: 'Outfield Box 137', level: 'field', baseAngle: 204, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF138', name: 'Outfield Box 138', level: 'field', baseAngle: 212, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF139', name: 'Outfield Box 139', level: 'field', baseAngle: 220, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF140', name: 'Outfield Box 140', level: 'field', baseAngle: 228, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF141', name: 'Outfield Box 141', level: 'field', baseAngle: 236, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF142', name: 'Outfield Box 142', level: 'field', baseAngle: 244, angleSpan: 8, covered: true, price: 'moderate' },
      { id: 'OF143', name: 'Outfield Box 143', level: 'field', baseAngle: 252, angleSpan: 8, covered: true, price: 'moderate' },
      
      // Baseline Reserved
      { id: 'BR201', name: 'Baseline Reserved 201', level: 'lower', baseAngle: 340, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR202', name: 'Baseline Reserved 202', level: 'lower', baseAngle: 346, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR203', name: 'Baseline Reserved 203', level: 'lower', baseAngle: 352, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR204', name: 'Baseline Reserved 204', level: 'lower', baseAngle: 358, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR205', name: 'Baseline Reserved 205', level: 'lower', baseAngle: 4, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR206', name: 'Baseline Reserved 206', level: 'lower', baseAngle: 10, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR207', name: 'Baseline Reserved 207', level: 'lower', baseAngle: 16, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR208', name: 'Baseline Reserved 208', level: 'lower', baseAngle: 22, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR209', name: 'Baseline Reserved 209', level: 'lower', baseAngle: 28, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR210', name: 'Baseline Reserved 210', level: 'lower', baseAngle: 34, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR211', name: 'Baseline Reserved 211', level: 'lower', baseAngle: 40, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR212', name: 'Baseline Reserved 212', level: 'lower', baseAngle: 46, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR213', name: 'Baseline Reserved 213', level: 'lower', baseAngle: 52, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR214', name: 'Baseline Reserved 214', level: 'lower', baseAngle: 58, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR215', name: 'Baseline Reserved 215', level: 'lower', baseAngle: 64, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR216', name: 'Baseline Reserved 216', level: 'lower', baseAngle: 70, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR217', name: 'Baseline Reserved 217', level: 'lower', baseAngle: 76, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR218', name: 'Baseline Reserved 218', level: 'lower', baseAngle: 82, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR219', name: 'Baseline Reserved 219', level: 'lower', baseAngle: 88, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR220', name: 'Baseline Reserved 220', level: 'lower', baseAngle: 94, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR221', name: 'Baseline Reserved 221', level: 'lower', baseAngle: 100, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR222', name: 'Baseline Reserved 222', level: 'lower', baseAngle: 260, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR223', name: 'Baseline Reserved 223', level: 'lower', baseAngle: 266, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR224', name: 'Baseline Reserved 224', level: 'lower', baseAngle: 272, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR225', name: 'Baseline Reserved 225', level: 'lower', baseAngle: 278, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR226', name: 'Baseline Reserved 226', level: 'lower', baseAngle: 284, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR227', name: 'Baseline Reserved 227', level: 'lower', baseAngle: 290, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR228', name: 'Baseline Reserved 228', level: 'lower', baseAngle: 296, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR229', name: 'Baseline Reserved 229', level: 'lower', baseAngle: 302, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR230', name: 'Baseline Reserved 230', level: 'lower', baseAngle: 308, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR231', name: 'Baseline Reserved 231', level: 'lower', baseAngle: 314, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR232', name: 'Baseline Reserved 232', level: 'lower', baseAngle: 320, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR233', name: 'Baseline Reserved 233', level: 'lower', baseAngle: 326, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'BR234', name: 'Baseline Reserved 234', level: 'lower', baseAngle: 332, angleSpan: 6, covered: true, price: 'moderate' },
      
      // Bleachers
      { id: 'BL235', name: 'Bleachers 235', level: 'lower', baseAngle: 106, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL236', name: 'Bleachers 236', level: 'lower', baseAngle: 114, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL237', name: 'Bleachers 237', level: 'lower', baseAngle: 122, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL238', name: 'Bleachers 238', level: 'lower', baseAngle: 130, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL239', name: 'Bleachers 239', level: 'lower', baseAngle: 138, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL240', name: 'Bleachers 240', level: 'lower', baseAngle: 146, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL241', name: 'Bleachers 241', level: 'lower', baseAngle: 154, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL242', name: 'Bleachers 242', level: 'lower', baseAngle: 162, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL243', name: 'Bleachers 243', level: 'lower', baseAngle: 170, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL244', name: 'Bleachers 244', level: 'lower', baseAngle: 178, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL245', name: 'Bleachers 245', level: 'lower', baseAngle: 186, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL246', name: 'Bleachers 246', level: 'lower', baseAngle: 194, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL247', name: 'Bleachers 247', level: 'lower', baseAngle: 202, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL248', name: 'Bleachers 248', level: 'lower', baseAngle: 210, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL249', name: 'Bleachers 249', level: 'lower', baseAngle: 218, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL250', name: 'Bleachers 250', level: 'lower', baseAngle: 226, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL251', name: 'Bleachers 251', level: 'lower', baseAngle: 234, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL252', name: 'Bleachers 252', level: 'lower', baseAngle: 242, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL253', name: 'Bleachers 253', level: 'lower', baseAngle: 250, angleSpan: 8, covered: true, price: 'value' },
      { id: 'BL254', name: 'Bleachers 254', level: 'lower', baseAngle: 258, angleSpan: 8, covered: true, price: 'value' },
      
      // Upper Level
      { id: 'UL301', name: 'Upper Level 301', level: 'upper', baseAngle: 340, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL302', name: 'Upper Level 302', level: 'upper', baseAngle: 345, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL303', name: 'Upper Level 303', level: 'upper', baseAngle: 350, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL304', name: 'Upper Level 304', level: 'upper', baseAngle: 355, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL305', name: 'Upper Level 305', level: 'upper', baseAngle: 0, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL306', name: 'Upper Level 306', level: 'upper', baseAngle: 5, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL307', name: 'Upper Level 307', level: 'upper', baseAngle: 10, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL308', name: 'Upper Level 308', level: 'upper', baseAngle: 15, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL309', name: 'Upper Level 309', level: 'upper', baseAngle: 20, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL310', name: 'Upper Level 310', level: 'upper', baseAngle: 25, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL311', name: 'Upper Level 311', level: 'upper', baseAngle: 30, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL312', name: 'Upper Level 312', level: 'upper', baseAngle: 35, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL313', name: 'Upper Level 313', level: 'upper', baseAngle: 40, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL314', name: 'Upper Level 314', level: 'upper', baseAngle: 45, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL315', name: 'Upper Level 315', level: 'upper', baseAngle: 50, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL316', name: 'Upper Level 316', level: 'upper', baseAngle: 55, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL317', name: 'Upper Level 317', level: 'upper', baseAngle: 60, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL318', name: 'Upper Level 318', level: 'upper', baseAngle: 65, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL319', name: 'Upper Level 319', level: 'upper', baseAngle: 70, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL320', name: 'Upper Level 320', level: 'upper', baseAngle: 75, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL321', name: 'Upper Level 321', level: 'upper', baseAngle: 80, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL322', name: 'Upper Level 322', level: 'upper', baseAngle: 85, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL323', name: 'Upper Level 323', level: 'upper', baseAngle: 90, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL324', name: 'Upper Level 324', level: 'upper', baseAngle: 95, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL325', name: 'Upper Level 325', level: 'upper', baseAngle: 100, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL326', name: 'Upper Level 326', level: 'upper', baseAngle: 260, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL327', name: 'Upper Level 327', level: 'upper', baseAngle: 265, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL328', name: 'Upper Level 328', level: 'upper', baseAngle: 270, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL329', name: 'Upper Level 329', level: 'upper', baseAngle: 275, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL330', name: 'Upper Level 330', level: 'upper', baseAngle: 280, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL331', name: 'Upper Level 331', level: 'upper', baseAngle: 285, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL332', name: 'Upper Level 332', level: 'upper', baseAngle: 290, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL333', name: 'Upper Level 333', level: 'upper', baseAngle: 295, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL334', name: 'Upper Level 334', level: 'upper', baseAngle: 300, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL335', name: 'Upper Level 335', level: 'upper', baseAngle: 305, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL336', name: 'Upper Level 336', level: 'upper', baseAngle: 310, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL337', name: 'Upper Level 337', level: 'upper', baseAngle: 315, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL338', name: 'Upper Level 338', level: 'upper', baseAngle: 320, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL339', name: 'Upper Level 339', level: 'upper', baseAngle: 325, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL340', name: 'Upper Level 340', level: 'upper', baseAngle: 330, angleSpan: 5, covered: true, price: 'value' },
      { id: 'UL341', name: 'Upper Level 341', level: 'upper', baseAngle: 335, angleSpan: 5, covered: true, price: 'value' },
      
      // Friday's Front Row
      { id: 'FFR', name: 'Friday\'s Front Row', level: 'upper', baseAngle: 140, angleSpan: 20, covered: true, price: 'premium' },
      
      // Cox Clubhouse
      { id: 'CC1', name: 'Cox Clubhouse 1', level: 'club', baseAngle: 40, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'CC2', name: 'Cox Clubhouse 2', level: 'club', baseAngle: 320, angleSpan: 10, covered: true, price: 'luxury' },
    ]
  };
