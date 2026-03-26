import type { StadiumSection } from '../stadiumSectionTypes';

export const stadiumSections = {
    stadiumId: 'redsox',
    sections: [
      // Field Box (Behind Home Plate)
      { id: 'FB15', name: 'Field Box 15', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'FB16', name: 'Field Box 16', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'FB17', name: 'Field Box 17', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'FB18', name: 'Field Box 18', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'luxury' },
      { id: 'FB19', name: 'Field Box 19', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'luxury' },
      
      // Dugout Box (Behind Dugouts)
      { id: 'DGB45', name: 'Dugout Box 45', level: 'field', baseAngle: 30, angleSpan: 8, covered: false, price: 'luxury' },
      { id: 'DGB46', name: 'Dugout Box 46', level: 'field', baseAngle: 38, angleSpan: 8, covered: false, price: 'luxury' },
      { id: 'DGB47', name: 'Dugout Box 47', level: 'field', baseAngle: 46, angleSpan: 8, covered: false, price: 'luxury' },
      { id: 'DGB48', name: 'Dugout Box 48', level: 'field', baseAngle: 54, angleSpan: 8, covered: false, price: 'luxury' },
      { id: 'DGB49', name: 'Dugout Box 49', level: 'field', baseAngle: 62, angleSpan: 8, covered: false, price: 'luxury' },
      { id: 'DGB70', name: 'Dugout Box 70', level: 'field', baseAngle: 298, angleSpan: 8, covered: false, price: 'luxury' },
      { id: 'DGB71', name: 'Dugout Box 71', level: 'field', baseAngle: 306, angleSpan: 8, covered: false, price: 'luxury' },
      { id: 'DGB72', name: 'Dugout Box 72', level: 'field', baseAngle: 314, angleSpan: 8, covered: false, price: 'luxury' },
      { id: 'DGB73', name: 'Dugout Box 73', level: 'field', baseAngle: 322, angleSpan: 8, covered: false, price: 'luxury' },
      { id: 'DGB74', name: 'Dugout Box 74', level: 'field', baseAngle: 330, angleSpan: 8, covered: false, price: 'luxury' },
      
      // Infield Box
      { id: 'IB18', name: 'Infield Box 18', level: 'lower', baseAngle: 350, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB19', name: 'Infield Box 19', level: 'lower', baseAngle: 358, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB20', name: 'Infield Box 20', level: 'lower', baseAngle: 6, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB21', name: 'Infield Box 21', level: 'lower', baseAngle: 14, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB22', name: 'Infield Box 22', level: 'lower', baseAngle: 22, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB44', name: 'Infield Box 44', level: 'lower', baseAngle: 30, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB45', name: 'Infield Box 45', level: 'lower', baseAngle: 38, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB46', name: 'Infield Box 46', level: 'lower', baseAngle: 46, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB47', name: 'Infield Box 47', level: 'lower', baseAngle: 54, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB48', name: 'Infield Box 48', level: 'lower', baseAngle: 62, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB49', name: 'Infield Box 49', level: 'lower', baseAngle: 70, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB77', name: 'Infield Box 77', level: 'lower', baseAngle: 290, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB78', name: 'Infield Box 78', level: 'lower', baseAngle: 298, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB79', name: 'Infield Box 79', level: 'lower', baseAngle: 306, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB80', name: 'Infield Box 80', level: 'lower', baseAngle: 314, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB81', name: 'Infield Box 81', level: 'lower', baseAngle: 322, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'IB82', name: 'Infield Box 82', level: 'lower', baseAngle: 330, angleSpan: 8, covered: true, price: 'premium' },
      { id: 'IB83', name: 'Infield Box 83', level: 'lower', baseAngle: 338, angleSpan: 8, covered: true, price: 'premium' },
      
      // Grandstand
      { id: 'GS1', name: 'Grandstand 1', level: 'lower', baseAngle: 70, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS2', name: 'Grandstand 2', level: 'lower', baseAngle: 76, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS3', name: 'Grandstand 3', level: 'lower', baseAngle: 82, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS4', name: 'Grandstand 4', level: 'lower', baseAngle: 88, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS5', name: 'Grandstand 5', level: 'lower', baseAngle: 94, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS6', name: 'Grandstand 6', level: 'lower', baseAngle: 100, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS7', name: 'Grandstand 7', level: 'lower', baseAngle: 106, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS8', name: 'Grandstand 8', level: 'lower', baseAngle: 112, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS9', name: 'Grandstand 9', level: 'lower', baseAngle: 118, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS10', name: 'Grandstand 10', level: 'lower', baseAngle: 124, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS11', name: 'Grandstand 11', level: 'lower', baseAngle: 130, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS12', name: 'Grandstand 12', level: 'lower', baseAngle: 246, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS13', name: 'Grandstand 13', level: 'lower', baseAngle: 252, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS14', name: 'Grandstand 14', level: 'lower', baseAngle: 258, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS15', name: 'Grandstand 15', level: 'lower', baseAngle: 264, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS16', name: 'Grandstand 16', level: 'lower', baseAngle: 270, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS17', name: 'Grandstand 17', level: 'lower', baseAngle: 276, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS18', name: 'Grandstand 18', level: 'lower', baseAngle: 282, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS19', name: 'Grandstand 19', level: 'lower', baseAngle: 288, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS20', name: 'Grandstand 20', level: 'lower', baseAngle: 340, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'GS21', name: 'Grandstand 21', level: 'lower', baseAngle: 350, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'GS22', name: 'Grandstand 22', level: 'lower', baseAngle: 0, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'GS23', name: 'Grandstand 23', level: 'lower', baseAngle: 10, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'GS24', name: 'Grandstand 24', level: 'lower', baseAngle: 20, angleSpan: 10, covered: true, price: 'moderate' },
      { id: 'GS25', name: 'Grandstand 25', level: 'lower', baseAngle: 30, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS26', name: 'Grandstand 26', level: 'lower', baseAngle: 36, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS27', name: 'Grandstand 27', level: 'lower', baseAngle: 42, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS28', name: 'Grandstand 28', level: 'lower', baseAngle: 48, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS29', name: 'Grandstand 29', level: 'lower', baseAngle: 54, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS30', name: 'Grandstand 30', level: 'lower', baseAngle: 60, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS31', name: 'Grandstand 31', level: 'lower', baseAngle: 66, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS32', name: 'Grandstand 32', level: 'lower', baseAngle: 294, angleSpan: 6, covered: true, price: 'moderate' },
      { id: 'GS33', name: 'Grandstand 33', level: 'lower', baseAngle: 300, angleSpan: 6, covered: true, price: 'moderate' },
      
      // Pavilion
      { id: 'PV1', name: 'Pavilion Box 1', level: 'lower', baseAngle: 230, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'PV2', name: 'Pavilion Box 2', level: 'lower', baseAngle: 238, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'PV3', name: 'Pavilion Box 3', level: 'lower', baseAngle: 246, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'PV4', name: 'Pavilion Box 4', level: 'lower', baseAngle: 254, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'PV5', name: 'Pavilion Box 5', level: 'lower', baseAngle: 262, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'PV6', name: 'Pavilion Box 6', level: 'lower', baseAngle: 270, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'PV7', name: 'Pavilion Box 7', level: 'lower', baseAngle: 278, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'PV8', name: 'Pavilion Box 8', level: 'lower', baseAngle: 286, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Right Field Box
      { id: 'RFB1', name: 'Right Field Box 1', level: 'lower', baseAngle: 78, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'RFB2', name: 'Right Field Box 2', level: 'lower', baseAngle: 86, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'RFB3', name: 'Right Field Box 3', level: 'lower', baseAngle: 94, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'RFB4', name: 'Right Field Box 4', level: 'lower', baseAngle: 102, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'RFB5', name: 'Right Field Box 5', level: 'lower', baseAngle: 110, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Bleachers
      { id: 'BL34', name: 'Bleachers 34', level: 'upper', baseAngle: 160, angleSpan: 10, covered: false, price: 'value' },
      { id: 'BL35', name: 'Bleachers 35', level: 'upper', baseAngle: 170, angleSpan: 10, covered: false, price: 'value' },
      { id: 'BL36', name: 'Bleachers 36', level: 'upper', baseAngle: 180, angleSpan: 10, covered: false, price: 'value' },
      { id: 'BL37', name: 'Bleachers 37', level: 'upper', baseAngle: 190, angleSpan: 10, covered: false, price: 'value' },
      { id: 'BL38', name: 'Bleachers 38', level: 'upper', baseAngle: 200, angleSpan: 10, covered: false, price: 'value' },
      { id: 'BL39', name: 'Bleachers 39', level: 'upper', baseAngle: 210, angleSpan: 10, covered: false, price: 'value' },
      { id: 'BL40', name: 'Bleachers 40', level: 'upper', baseAngle: 220, angleSpan: 10, covered: false, price: 'value' },
      { id: 'BL41', name: 'Bleachers 41', level: 'upper', baseAngle: 78, angleSpan: 10, covered: false, price: 'value' },
      { id: 'BL42', name: 'Bleachers 42', level: 'upper', baseAngle: 88, angleSpan: 10, covered: false, price: 'value' },
      { id: 'BL43', name: 'Bleachers 43', level: 'upper', baseAngle: 98, angleSpan: 10, covered: false, price: 'value' },
      
      // Green Monster
      { id: 'GM1', name: 'Green Monster 1', level: 'upper', baseAngle: 135, angleSpan: 5, covered: false, price: 'premium' },
      { id: 'GM2', name: 'Green Monster 2', level: 'upper', baseAngle: 140, angleSpan: 5, covered: false, price: 'premium' },
      { id: 'GM3', name: 'Green Monster 3', level: 'upper', baseAngle: 145, angleSpan: 5, covered: false, price: 'premium' },
      { id: 'GM4', name: 'Green Monster 4', level: 'upper', baseAngle: 150, angleSpan: 5, covered: false, price: 'premium' },
      { id: 'GM5', name: 'Green Monster 5', level: 'upper', baseAngle: 155, angleSpan: 5, covered: false, price: 'premium' },
      
      // EMC Club
      { id: 'EMC', name: 'EMC Club', level: 'club', baseAngle: 0, angleSpan: 20, covered: true, price: 'luxury' },
      
      // State Street Pavilion
      { id: 'SSP1', name: 'State Street Pavilion 1', level: 'club', baseAngle: 340, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'SSP2', name: 'State Street Pavilion 2', level: 'club', baseAngle: 350, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'SSP3', name: 'State Street Pavilion 3', level: 'club', baseAngle: 0, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'SSP4', name: 'State Street Pavilion 4', level: 'club', baseAngle: 10, angleSpan: 10, covered: true, price: 'luxury' },
      { id: 'SSP5', name: 'State Street Pavilion 5', level: 'club', baseAngle: 20, angleSpan: 10, covered: true, price: 'luxury' },
    ]
  };
