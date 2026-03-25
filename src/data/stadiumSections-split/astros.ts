import type { StadiumSection } from '../stadiumSectionTypes';

export const stadiumSections = {
    stadiumId: 'astros',
    sections: [
      // Diamond Club (Behind Home Plate)
      { id: 'DC3', name: 'Diamond Club 3', level: 'field', baseAngle: 104, angleSpan: 10, covered: false, price: 'luxury' , rows: 8, seatsPerRow: 1 },
      { id: 'DC4', name: 'Diamond Club 4', level: 'field', baseAngle: 120, angleSpan: 10, covered: false, price: 'luxury' , rows: 20, seatsPerRow: 6 },
      { id: 'DC5', name: 'Diamond Club 5', level: 'field', baseAngle: 137, angleSpan: 10, covered: false, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      
      // Field Box
      { id: 'FB103', name: 'Field Box 103', level: 'field', baseAngle: 153, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB104', name: 'Field Box 104', level: 'field', baseAngle: 169, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB105', name: 'Field Box 105', level: 'field', baseAngle: 186, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB106', name: 'Field Box 106', level: 'field', baseAngle: 202, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB107', name: 'Field Box 107', level: 'field', baseAngle: 219, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB108', name: 'Field Box 108', level: 'field', baseAngle: 235, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB109', name: 'Field Box 109', level: 'field', baseAngle: 251, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB110', name: 'Field Box 110', level: 'field', baseAngle: 268, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB125', name: 'Field Box 125', level: 'field', baseAngle: 284, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB126', name: 'Field Box 126', level: 'field', baseAngle: 300, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB127', name: 'Field Box 127', level: 'field', baseAngle: 317, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB128', name: 'Field Box 128', level: 'field', baseAngle: 333, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB129', name: 'Field Box 129', level: 'field', baseAngle: 6, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB130', name: 'Field Box 130', level: 'field', baseAngle: 22, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB131', name: 'Field Box 131', level: 'field', baseAngle: 55, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'FB132', name: 'Field Box 132', level: 'field', baseAngle: 71, angleSpan: 8, covered: true, price: 'premium' , rows: 20, seatsPerRow: 27 },
      
      // Crawford Boxes
      { id: 'CB436', name: 'Crawford Boxes 436', level: 'field', baseAngle: 349, angleSpan: 15, covered: false, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'CB437', name: 'Crawford Boxes 437', level: 'field', baseAngle: 39, angleSpan: 15, covered: false, price: 'premium' , rows: 20, seatsPerRow: 27 },
      { id: 'CB438', name: 'Crawford Boxes 438', level: 'field', baseAngle: 88, angleSpan: 15, covered: false, price: 'premium' , rows: 20, seatsPerRow: 27 },
      
      // Club Level
      { id: 'CL213', name: 'Club Level 213', level: 'club', baseAngle: 350, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL214', name: 'Club Level 214', level: 'club', baseAngle: 11, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL215', name: 'Club Level 215', level: 'club', baseAngle: 32, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL216', name: 'Club Level 216', level: 'club', baseAngle: 54, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL217', name: 'Club Level 217', level: 'club', baseAngle: 75, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL218', name: 'Club Level 218', level: 'club', baseAngle: 96, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL219', name: 'Club Level 219', level: 'club', baseAngle: 117, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL220', name: 'Club Level 220', level: 'club', baseAngle: 138, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL221', name: 'Club Level 221', level: 'club', baseAngle: 159, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL222', name: 'Club Level 222', level: 'club', baseAngle: 181, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL223', name: 'Club Level 223', level: 'club', baseAngle: 202, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL224', name: 'Club Level 224', level: 'club', baseAngle: 223, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL225', name: 'Club Level 225', level: 'club', baseAngle: 244, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL226', name: 'Club Level 226', level: 'club', baseAngle: 265, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL227', name: 'Club Level 227', level: 'club', baseAngle: 286, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL228', name: 'Club Level 228', level: 'club', baseAngle: 308, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      { id: 'CL229', name: 'Club Level 229', level: 'club', baseAngle: 329, angleSpan: 8, covered: true, price: 'luxury' , rows: 20, seatsPerRow: 27 },
      
      // Mezzanine
      { id: 'MZ315', name: 'Mezzanine 315', level: 'lower', baseAngle: 340, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ316', name: 'Mezzanine 316', level: 'lower', baseAngle: 3, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ317', name: 'Mezzanine 317', level: 'lower', baseAngle: 25, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ318', name: 'Mezzanine 318', level: 'lower', baseAngle: 48, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ319', name: 'Mezzanine 319', level: 'lower', baseAngle: 70, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ320', name: 'Mezzanine 320', level: 'lower', baseAngle: 93, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ321', name: 'Mezzanine 321', level: 'lower', baseAngle: 115, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ322', name: 'Mezzanine 322', level: 'lower', baseAngle: 138, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ323', name: 'Mezzanine 323', level: 'lower', baseAngle: 160, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ324', name: 'Mezzanine 324', level: 'lower', baseAngle: 183, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ325', name: 'Mezzanine 325', level: 'lower', baseAngle: 205, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ326', name: 'Mezzanine 326', level: 'lower', baseAngle: 228, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ327', name: 'Mezzanine 327', level: 'lower', baseAngle: 250, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ328', name: 'Mezzanine 328', level: 'lower', baseAngle: 273, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ329', name: 'Mezzanine 329', level: 'lower', baseAngle: 295, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      { id: 'MZ330', name: 'Mezzanine 330', level: 'lower', baseAngle: 318, angleSpan: 6, covered: true, price: 'moderate' , rows: 20, seatsPerRow: 27 },
      
      // Upper Deck
      { id: 'UD409', name: 'Upper Deck 409', level: 'upper', baseAngle: 317, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD410', name: 'Upper Deck 410', level: 'upper', baseAngle: 333, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD411', name: 'Upper Deck 411', level: 'upper', baseAngle: 348, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD412', name: 'Upper Deck 412', level: 'upper', baseAngle: 4, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD413', name: 'Upper Deck 413', level: 'upper', baseAngle: 20, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD414', name: 'Upper Deck 414', level: 'upper', baseAngle: 35, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD415', name: 'Upper Deck 415', level: 'upper', baseAngle: 51, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD416', name: 'Upper Deck 416', level: 'upper', baseAngle: 67, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD417', name: 'Upper Deck 417', level: 'upper', baseAngle: 82, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD418', name: 'Upper Deck 418', level: 'upper', baseAngle: 98, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD419', name: 'Upper Deck 419', level: 'upper', baseAngle: 113, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD420', name: 'Upper Deck 420', level: 'upper', baseAngle: 129, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD421', name: 'Upper Deck 421', level: 'upper', baseAngle: 145, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD422', name: 'Upper Deck 422', level: 'upper', baseAngle: 160, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD423', name: 'Upper Deck 423', level: 'upper', baseAngle: 176, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD424', name: 'Upper Deck 424', level: 'upper', baseAngle: 192, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD425', name: 'Upper Deck 425', level: 'upper', baseAngle: 207, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD426', name: 'Upper Deck 426', level: 'upper', baseAngle: 223, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD427', name: 'Upper Deck 427', level: 'upper', baseAngle: 239, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'UD428', name: 'Upper Deck 428', level: 'upper', baseAngle: 254, angleSpan: 8, covered: true, price: 'value' , rows: 20, seatsPerRow: 27 },
      
      // Bleachers
      { id: 'BL436', name: 'Bleachers 436', level: 'upper', baseAngle: 270, angleSpan: 15, covered: false, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'BL437', name: 'Bleachers 437', level: 'upper', baseAngle: 285, angleSpan: 15, covered: false, price: 'value' , rows: 20, seatsPerRow: 27 },
      { id: 'BL438', name: 'Bleachers 438', level: 'upper', baseAngle: 300, angleSpan: 15, covered: false, price: 'value' , rows: 20, seatsPerRow: 27 },
    ]
  };
