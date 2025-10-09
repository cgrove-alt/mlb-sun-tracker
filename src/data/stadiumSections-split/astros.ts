import type { StadiumSection } from '../stadiumSections';

export const stadiumSections = {
    stadiumId: 'astros',
    sections: [
      // Diamond Club (Behind Home Plate)
      { id: 'DC3', name: 'Diamond Club 3', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'DC4', name: 'Diamond Club 4', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'DC5', name: 'Diamond Club 5', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'luxury' },
      
      // Field Box
      { id: 'FB103', name: 'Field Box 103', level: 'field', baseAngle: 20, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB104', name: 'Field Box 104', level: 'field', baseAngle: 28, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB105', name: 'Field Box 105', level: 'field', baseAngle: 36, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB106', name: 'Field Box 106', level: 'field', baseAngle: 44, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB107', name: 'Field Box 107', level: 'field', baseAngle: 52, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB108', name: 'Field Box 108', level: 'field', baseAngle: 60, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB109', name: 'Field Box 109', level: 'field', baseAngle: 68, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB110', name: 'Field Box 110', level: 'field', baseAngle: 76, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB125', name: 'Field Box 125', level: 'field', baseAngle: 284, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB126', name: 'Field Box 126', level: 'field', baseAngle: 292, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB127', name: 'Field Box 127', level: 'field', baseAngle: 300, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB128', name: 'Field Box 128', level: 'field', baseAngle: 308, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB129', name: 'Field Box 129', level: 'field', baseAngle: 316, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB130', name: 'Field Box 130', level: 'field', baseAngle: 324, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB131', name: 'Field Box 131', level: 'field', baseAngle: 332, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'FB132', name: 'Field Box 132', level: 'field', baseAngle: 340, angleSpan: 8, covered: true, price: 'premium' },
      
      // Crawford Boxes
      { id: 'CB436', name: 'Crawford Boxes 436', level: 'field', baseAngle: 310, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'CB437', name: 'Crawford Boxes 437', level: 'field', baseAngle: 325, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'CB438', name: 'Crawford Boxes 438', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      
      // Club Level
      { id: 'CL213', name: 'Club Level 213', level: 'club', baseAngle: 350, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL214', name: 'Club Level 214', level: 'club', baseAngle: 358, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL215', name: 'Club Level 215', level: 'club', baseAngle: 6, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL216', name: 'Club Level 216', level: 'club', baseAngle: 14, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL217', name: 'Club Level 217', level: 'club', baseAngle: 22, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL218', name: 'Club Level 218', level: 'club', baseAngle: 30, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL219', name: 'Club Level 219', level: 'club', baseAngle: 38, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL220', name: 'Club Level 220', level: 'club', baseAngle: 46, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL221', name: 'Club Level 221', level: 'club', baseAngle: 54, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL222', name: 'Club Level 222', level: 'club', baseAngle: 62, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL223', name: 'Club Level 223', level: 'club', baseAngle: 70, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL224', name: 'Club Level 224', level: 'club', baseAngle: 78, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL225', name: 'Club Level 225', level: 'club', baseAngle: 86, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL226', name: 'Club Level 226', level: 'club', baseAngle: 94, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL227', name: 'Club Level 227', level: 'club', baseAngle: 102, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL228', name: 'Club Level 228', level: 'club', baseAngle: 110, angleSpan: 8, covered: true, price: 'luxury' },
      { id: 'CL229', name: 'Club Level 229', level: 'club', baseAngle: 118, angleSpan: 8, covered: true, price: 'luxury' },
      
      // Mezzanine
      { id: 'MZ315', name: 'Mezzanine 315', level: 'lower', baseAngle: 340, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ316', name: 'Mezzanine 316', level: 'lower', baseAngle: 346, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ317', name: 'Mezzanine 317', level: 'lower', baseAngle: 352, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ318', name: 'Mezzanine 318', level: 'lower', baseAngle: 358, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ319', name: 'Mezzanine 319', level: 'lower', baseAngle: 4, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ320', name: 'Mezzanine 320', level: 'lower', baseAngle: 10, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ321', name: 'Mezzanine 321', level: 'lower', baseAngle: 16, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ322', name: 'Mezzanine 322', level: 'lower', baseAngle: 22, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ323', name: 'Mezzanine 323', level: 'lower', baseAngle: 28, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ324', name: 'Mezzanine 324', level: 'lower', baseAngle: 34, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ325', name: 'Mezzanine 325', level: 'lower', baseAngle: 40, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ326', name: 'Mezzanine 326', level: 'lower', baseAngle: 46, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ327', name: 'Mezzanine 327', level: 'lower', baseAngle: 52, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ328', name: 'Mezzanine 328', level: 'lower', baseAngle: 58, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ329', name: 'Mezzanine 329', level: 'lower', baseAngle: 64, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'MZ330', name: 'Mezzanine 330', level: 'lower', baseAngle: 70, angleSpan: 6, covered: true, price: 'moderate' },
      
      // Upper Deck
      { id: 'UD409', name: 'Upper Deck 409', level: 'upper', baseAngle: 340, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD410', name: 'Upper Deck 410', level: 'upper', baseAngle: 348, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD411', name: 'Upper Deck 411', level: 'upper', baseAngle: 356, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD412', name: 'Upper Deck 412', level: 'upper', baseAngle: 4, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD413', name: 'Upper Deck 413', level: 'upper', baseAngle: 12, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD414', name: 'Upper Deck 414', level: 'upper', baseAngle: 20, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD415', name: 'Upper Deck 415', level: 'upper', baseAngle: 28, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD416', name: 'Upper Deck 416', level: 'upper', baseAngle: 36, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD417', name: 'Upper Deck 417', level: 'upper', baseAngle: 44, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD418', name: 'Upper Deck 418', level: 'upper', baseAngle: 52, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD419', name: 'Upper Deck 419', level: 'upper', baseAngle: 60, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD420', name: 'Upper Deck 420', level: 'upper', baseAngle: 68, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD421', name: 'Upper Deck 421', level: 'upper', baseAngle: 76, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD422', name: 'Upper Deck 422', level: 'upper', baseAngle: 84, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD423', name: 'Upper Deck 423', level: 'upper', baseAngle: 92, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD424', name: 'Upper Deck 424', level: 'upper', baseAngle: 100, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD425', name: 'Upper Deck 425', level: 'upper', baseAngle: 108, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD426', name: 'Upper Deck 426', level: 'upper', baseAngle: 116, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD427', name: 'Upper Deck 427', level: 'upper', baseAngle: 124, angleSpan: 8, covered: true, price: 'value' },
      { id: 'UD428', name: 'Upper Deck 428', level: 'upper', baseAngle: 132, angleSpan: 8, covered: true, price: 'value' },
      
      // Bleachers
      { id: 'BL436', name: 'Bleachers 436', level: 'upper', baseAngle: 270, angleSpan: 15, covered: false, price: 'value' },
      { id: 'BL437', name: 'Bleachers 437', level: 'upper', baseAngle: 285, angleSpan: 15, covered: false, price: 'value' },
      { id: 'BL438', name: 'Bleachers 438', level: 'upper', baseAngle: 300, angleSpan: 15, covered: false, price: 'value' },
    ]
  };
