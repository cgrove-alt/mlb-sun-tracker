import type { StadiumSection } from '../stadiumSectionTypes';

export const stadiumSections = // Sutter Health Park (Oakland Athletics - Open Air)
  {
    stadiumId: 'athletics',
    sections: [
      // Field Box (Behind Home Plate)
      { id: 'FB101', name: 'Field Box 101', level: 'field', baseAngle: 340, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'FB102', name: 'Field Box 102', level: 'field', baseAngle: 355, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'FB103', name: 'Field Box 103', level: 'field', baseAngle: 10, angleSpan: 15, covered: false, price: 'premium' },
      { id: 'FB104', name: 'Field Box 104', level: 'field', baseAngle: 25, angleSpan: 15, covered: false, price: 'premium' },
      
      // Club Level
      { id: 'CL201', name: 'Club Level 201', level: 'club', baseAngle: 340, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'CL202', name: 'Club Level 202', level: 'club', baseAngle: 0, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'CL203', name: 'Club Level 203', level: 'club', baseAngle: 20, angleSpan: 20, covered: true, price: 'luxury' },
      
      // Box Seats
      { id: 'BS105', name: 'Box Seats 105', level: 'field', baseAngle: 40, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS106', name: 'Box Seats 106', level: 'field', baseAngle: 52, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS107', name: 'Box Seats 107', level: 'field', baseAngle: 64, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS108', name: 'Box Seats 108', level: 'field', baseAngle: 76, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS109', name: 'Box Seats 109', level: 'field', baseAngle: 88, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS110', name: 'Box Seats 110', level: 'field', baseAngle: 100, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS111', name: 'Box Seats 111', level: 'field', baseAngle: 112, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS112', name: 'Box Seats 112', level: 'field', baseAngle: 124, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS113', name: 'Box Seats 113', level: 'field', baseAngle: 136, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS114', name: 'Box Seats 114', level: 'field', baseAngle: 148, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS115', name: 'Box Seats 115', level: 'field', baseAngle: 160, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS116', name: 'Box Seats 116', level: 'field', baseAngle: 172, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS117', name: 'Box Seats 117', level: 'field', baseAngle: 184, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS118', name: 'Box Seats 118', level: 'field', baseAngle: 196, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS119', name: 'Box Seats 119', level: 'field', baseAngle: 208, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS120', name: 'Box Seats 120', level: 'field', baseAngle: 220, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS121', name: 'Box Seats 121', level: 'field', baseAngle: 232, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS122', name: 'Box Seats 122', level: 'field', baseAngle: 244, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS123', name: 'Box Seats 123', level: 'field', baseAngle: 256, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS124', name: 'Box Seats 124', level: 'field', baseAngle: 268, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS125', name: 'Box Seats 125', level: 'field', baseAngle: 280, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS126', name: 'Box Seats 126', level: 'field', baseAngle: 292, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS127', name: 'Box Seats 127', level: 'field', baseAngle: 304, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS128', name: 'Box Seats 128', level: 'field', baseAngle: 316, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'BS129', name: 'Box Seats 129', level: 'field', baseAngle: 328, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Reserved Seating
      { id: 'RS301', name: 'Reserved 301', level: 'lower', baseAngle: 130, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS302', name: 'Reserved 302', level: 'lower', baseAngle: 140, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS303', name: 'Reserved 303', level: 'lower', baseAngle: 150, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS304', name: 'Reserved 304', level: 'lower', baseAngle: 160, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS305', name: 'Reserved 305', level: 'lower', baseAngle: 170, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS306', name: 'Reserved 306', level: 'lower', baseAngle: 180, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS307', name: 'Reserved 307', level: 'lower', baseAngle: 190, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS308', name: 'Reserved 308', level: 'lower', baseAngle: 200, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS309', name: 'Reserved 309', level: 'lower', baseAngle: 210, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS310', name: 'Reserved 310', level: 'lower', baseAngle: 220, angleSpan: 10, covered: false, price: 'value' },
      { id: 'RS311', name: 'Reserved 311', level: 'lower', baseAngle: 230, angleSpan: 10, covered: false, price: 'value' },
      
      // Lawn Seating
      { id: 'LN01', name: 'Lawn Area', level: 'lower', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'LN02', name: 'Berm Seating', level: 'lower', baseAngle: 240, angleSpan: 40, covered: false, price: 'value' },
    ]
  };
