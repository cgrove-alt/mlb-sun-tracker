import type { StadiumSection } from '../stadiumSectionTypes';

export const stadiumSections = {
    stadiumId: 'angels',
    sections: [
      // Field Level - Behind Home Plate (Premium)
      { id: '101', name: 'Field Level 101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '102', name: 'Field Level 102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '103', name: 'Field Level 103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '104', name: 'Field Level 104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'luxury' },
      { id: '105', name: 'Field Level 105', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'luxury' },
      
      // Field Level - First Base Side
      { id: '106', name: 'Field Level 106', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: '107', name: 'Field Level 107', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: '108', name: 'Field Level 108', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: '109', name: 'Field Level 109', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: '110', name: 'Field Level 110', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: '111', name: 'Field Level 111', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: '112', name: 'Field Level 112', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'premium' },
      { id: '113', name: 'Field Level 113', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'moderate' },
      { id: '114', name: 'Field Level 114', level: 'field', baseAngle: 110, angleSpan: 10, covered: false, price: 'moderate' },
      { id: '115', name: 'Field Level 115', level: 'field', baseAngle: 120, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Field Level - Outfield (Right Field)
      { id: '116', name: 'Field Level 116', level: 'field', baseAngle: 130, angleSpan: 10, covered: false, price: 'value' },
      { id: '117', name: 'Field Level 117', level: 'field', baseAngle: 140, angleSpan: 10, covered: false, price: 'value' },
      { id: '118', name: 'Field Level 118', level: 'field', baseAngle: 150, angleSpan: 10, covered: false, price: 'value' },
      
      // Field Level - Left Field
      { id: '127', name: 'Field Level 127', level: 'field', baseAngle: 210, angleSpan: 10, covered: false, price: 'value' },
      { id: '128', name: 'Field Level 128', level: 'field', baseAngle: 220, angleSpan: 10, covered: false, price: 'value' },
      { id: '129', name: 'Field Level 129', level: 'field', baseAngle: 230, angleSpan: 10, covered: false, price: 'value' },
      { id: '130', name: 'Field Level 130', level: 'field', baseAngle: 240, angleSpan: 10, covered: false, price: 'moderate' },
      
      // Field Level - Third Base Side
      { id: '119', name: 'Field Level 119', level: 'field', baseAngle: 250, angleSpan: 10, covered: false, price: 'moderate' },
      { id: '120', name: 'Field Level 120', level: 'field', baseAngle: 260, angleSpan: 10, covered: false, price: 'moderate' },
      { id: '121', name: 'Field Level 121', level: 'field', baseAngle: 270, angleSpan: 10, covered: false, price: 'premium' },
      { id: '122', name: 'Field Level 122', level: 'field', baseAngle: 280, angleSpan: 10, covered: false, price: 'premium' },
      { id: '123', name: 'Field Level 123', level: 'field', baseAngle: 290, angleSpan: 10, covered: false, price: 'premium' },
      { id: '124', name: 'Field Level 124', level: 'field', baseAngle: 300, angleSpan: 10, covered: false, price: 'premium' },
      { id: '125', name: 'Field Level 125', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: '126', name: 'Field Level 126', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      
      // Terrace Level - Behind Home Plate
      { id: '201', name: 'Terrace Level 201', level: 'lower', baseAngle: 340, angleSpan: 10, covered: true, price: 'premium' },
      { id: '202', name: 'Terrace Level 202', level: 'lower', baseAngle: 350, angleSpan: 10, covered: true, price: 'premium' },
      { id: '203', name: 'Terrace Level 203', level: 'lower', baseAngle: 0, angleSpan: 10, covered: true, price: 'premium' },
      { id: '204', name: 'Terrace Level 204', level: 'lower', baseAngle: 10, angleSpan: 10, covered: true, price: 'premium' },
      { id: '205', name: 'Terrace Level 205', level: 'lower', baseAngle: 20, angleSpan: 10, covered: true, price: 'premium' },
      
      // Terrace Level - First Base Side
      { id: '206', name: 'Terrace Level 206', level: 'lower', baseAngle: 30, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '207', name: 'Terrace Level 207', level: 'lower', baseAngle: 40, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '208', name: 'Terrace Level 208', level: 'lower', baseAngle: 50, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '209', name: 'Terrace Level 209', level: 'lower', baseAngle: 60, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '210', name: 'Terrace Level 210', level: 'lower', baseAngle: 70, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '211', name: 'Terrace Level 211', level: 'lower', baseAngle: 80, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '212', name: 'Terrace Level 212', level: 'lower', baseAngle: 90, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '213', name: 'Terrace Level 213', level: 'lower', baseAngle: 100, angleSpan: 10, covered: true, price: 'value' },
      { id: '214', name: 'Terrace Level 214', level: 'lower', baseAngle: 110, angleSpan: 10, covered: true, price: 'value' },
      { id: '215', name: 'Terrace Level 215', level: 'lower', baseAngle: 120, angleSpan: 10, covered: true, price: 'value' },
      
      // Terrace Level - Third Base Side
      { id: '219', name: 'Terrace Level 219', level: 'lower', baseAngle: 240, angleSpan: 10, covered: true, price: 'value' },
      { id: '220', name: 'Terrace Level 220', level: 'lower', baseAngle: 250, angleSpan: 10, covered: true, price: 'value' },
      { id: '221', name: 'Terrace Level 221', level: 'lower', baseAngle: 260, angleSpan: 10, covered: true, price: 'value' },
      { id: '222', name: 'Terrace Level 222', level: 'lower', baseAngle: 270, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '223', name: 'Terrace Level 223', level: 'lower', baseAngle: 280, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '224', name: 'Terrace Level 224', level: 'lower', baseAngle: 290, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '225', name: 'Terrace Level 225', level: 'lower', baseAngle: 300, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '226', name: 'Terrace Level 226', level: 'lower', baseAngle: 310, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '227', name: 'Terrace Level 227', level: 'lower', baseAngle: 320, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '228', name: 'Terrace Level 228', level: 'lower', baseAngle: 330, angleSpan: 10, covered: true, price: 'moderate' },
      
      // Club Level (Premium sections)
      { id: 'C301', name: 'Club Level C301', level: 'club', baseAngle: 340, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C302', name: 'Club Level C302', level: 'club', baseAngle: 350, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C303', name: 'Club Level C303', level: 'club', baseAngle: 0, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C304', name: 'Club Level C304', level: 'club', baseAngle: 10, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C305', name: 'Club Level C305', level: 'club', baseAngle: 20, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C306', name: 'Club Level C306', level: 'club', baseAngle: 30, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C307', name: 'Club Level C307', level: 'club', baseAngle: 310, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C308', name: 'Club Level C308', level: 'club', baseAngle: 320, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C309', name: 'Club Level C309', level: 'club', baseAngle: 330, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C310', name: 'Club Level C310', level: 'club', baseAngle: 300, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C311', name: 'Club Level C311', level: 'club', baseAngle: 290, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'C312', name: 'Club Level C312', level: 'club', baseAngle: 280, angleSpan: 10, covered: true, price: 'luxury' },
      
      // View Level - Behind Home Plate
      { id: '401', name: 'View Level 401', level: 'upper', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '402', name: 'View Level 402', level: 'upper', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '403', name: 'View Level 403', level: 'upper', baseAngle: 0, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '404', name: 'View Level 404', level: 'upper', baseAngle: 10, angleSpan: 10, covered: true, price: 'moderate' },
      { id: '405', name: 'View Level 405', level: 'upper', baseAngle: 20, angleSpan: 10, covered: true, price: 'moderate' },
      
      // View Level - First Base Side
      { id: '406', name: 'View Level 406', level: 'upper', baseAngle: 30, angleSpan: 10, covered: true, price: 'value' },
      { id: '407', name: 'View Level 407', level: 'upper', baseAngle: 40, angleSpan: 10, covered: true, price: 'value' },
      { id: '408', name: 'View Level 408', level: 'upper', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: '409', name: 'View Level 409', level: 'upper', baseAngle: 60, angleSpan: 10, covered: true, price: 'value' },
      { id: '410', name: 'View Level 410', level: 'upper', baseAngle: 70, angleSpan: 10, covered: true, price: 'value' },
      { id: '411', name: 'View Level 411', level: 'upper', baseAngle: 80, angleSpan: 10, covered: true, price: 'value' },
      { id: '412', name: 'View Level 412', level: 'upper', baseAngle: 90, angleSpan: 10, covered: true, price: 'value' },
      { id: '413', name: 'View Level 413', level: 'upper', baseAngle: 100, angleSpan: 10, covered: true, price: 'value' },
      { id: '414', name: 'View Level 414', level: 'upper', baseAngle: 110, angleSpan: 10, covered: true, price: 'value' },
      { id: '415', name: 'View Level 415', level: 'upper', baseAngle: 120, angleSpan: 10, covered: true, price: 'value' },
      { id: '416', name: 'View Level 416', level: 'upper', baseAngle: 130, angleSpan: 10, covered: true, price: 'value' },
      { id: '417', name: 'View Level 417', level: 'upper', baseAngle: 140, angleSpan: 10, covered: true, price: 'value' },
      
      // View Level - Third Base Side
      { id: '421', name: 'View Level 421', level: 'upper', baseAngle: 220, angleSpan: 10, covered: true, price: 'value' },
      { id: '422', name: 'View Level 422', level: 'upper', baseAngle: 230, angleSpan: 10, covered: true, price: 'value' },
      { id: '423', name: 'View Level 423', level: 'upper', baseAngle: 240, angleSpan: 10, covered: true, price: 'value' },
      { id: '424', name: 'View Level 424', level: 'upper', baseAngle: 250, angleSpan: 10, covered: true, price: 'value' },
      { id: '425', name: 'View Level 425', level: 'upper', baseAngle: 260, angleSpan: 10, covered: true, price: 'value' },
      { id: '426', name: 'View Level 426', level: 'upper', baseAngle: 270, angleSpan: 10, covered: true, price: 'value' },
      { id: '427', name: 'View Level 427', level: 'upper', baseAngle: 280, angleSpan: 10, covered: true, price: 'value' },
      { id: '428', name: 'View Level 428', level: 'upper', baseAngle: 290, angleSpan: 10, covered: true, price: 'value' },
      { id: '429', name: 'View Level 429', level: 'upper', baseAngle: 300, angleSpan: 10, covered: true, price: 'value' },
      { id: '430', name: 'View Level 430', level: 'upper', baseAngle: 310, angleSpan: 10, covered: true, price: 'value' },
      
      // Right Field Pavilion
      { id: '230', name: 'Right Field Pavilion 230', level: 'field', baseAngle: 160, angleSpan: 20, covered: false, price: 'value' },
      { id: '231', name: 'Right Field Pavilion 231', level: 'field', baseAngle: 180, angleSpan: 20, covered: false, price: 'value' },
      
      // Left Field Pavilion
      { id: '232', name: 'Left Field Pavilion 232', level: 'field', baseAngle: 200, angleSpan: 10, covered: false, price: 'value' }
    ]
  };
