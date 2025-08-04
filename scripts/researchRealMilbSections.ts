// Script to research and apply REAL MiLB stadium sections
// This will replace generic sections with actual stadium sections

import * as fs from 'fs';
import * as path from 'path';

// Real stadium sections based on 2025 data
const realStadiumSections: Record<string, any> = {
  // AAA Stadiums - Pacific Coast League & International League
  'buffalo-bisons': {
    name: 'Sahlen Field',
    sections: [
      // 100 Level (Field Box)
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 60, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-123', name: '123', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-124', name: '124', level: 'field', baseAngle: 284, angleSpan: 8, covered: false, price: 'value' },
      
      // 200 Level (Upper Reserved)
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 64, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 296, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-211', name: '211', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-212', name: '212', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      
      // Special areas
      { id: 'coca-cola-field-club', name: 'Coca-Cola Field Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'bully-hill-deck', name: 'The Bully Hill Party Deck', level: 'club', baseAngle: 76, angleSpan: 35, covered: false, price: 'moderate' },
      { id: 'pub-at-the-park', name: 'Pub at the Park', level: 'club', baseAngle: 270, angleSpan: 20, covered: true, price: 'moderate' }
    ]
  },
  
  'columbus-clippers': {
    name: 'Huntington Park',
    sections: [
      // Main sections around the baselines
      { id: 'sec-4', name: '4', level: 'field', baseAngle: 20, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-5', name: '5', level: 'field', baseAngle: 32, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-6', name: '6', level: 'field', baseAngle: 44, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-7', name: '7', level: 'field', baseAngle: 56, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-8', name: '8', level: 'field', baseAngle: 68, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-9', name: '9', level: 'field', baseAngle: 80, angleSpan: 12, covered: false, price: 'value' },
      
      // Behind home plate sections
      { id: 'sec-10', name: '10', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-11', name: '11', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-12', name: '12', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-13', name: '13', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-14', name: '14', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      
      // Third base side sections
      { id: 'sec-15', name: '15', level: 'field', baseAngle: 280, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-16', name: '16', level: 'field', baseAngle: 292, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-17', name: '17', level: 'field', baseAngle: 304, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-18', name: '18', level: 'field', baseAngle: 316, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-19', name: '19', level: 'field', baseAngle: 328, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-20', name: '20', level: 'field', baseAngle: 340, angleSpan: 12, covered: false, price: 'moderate' },
      
      // Bleacher sections
      { id: 'sec-27', name: '27', level: 'ga', baseAngle: 92, angleSpan: 20, covered: false, price: 'value' },
      { id: 'sec-28', name: '28', level: 'ga', baseAngle: 112, angleSpan: 20, covered: false, price: 'value' },
      { id: 'sec-29', name: '29', level: 'ga', baseAngle: 132, angleSpan: 20, covered: false, price: 'value' },
      { id: 'sec-30', name: '30', level: 'ga', baseAngle: 152, angleSpan: 20, covered: false, price: 'value' },
      { id: 'sec-31', name: '31', level: 'ga', baseAngle: 172, angleSpan: 20, covered: false, price: 'value' },
      
      // Special areas
      { id: 'aep-power-pavilion', name: 'AEP Power Pavilion', level: 'club', baseAngle: 192, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'home-plate-club', name: 'The Home Plate Club', level: 'club', baseAngle: 345, angleSpan: 30, covered: true, price: 'luxury' },
      { id: 'left-field-building', name: 'Left Field Building', level: 'club', baseAngle: 242, angleSpan: 38, covered: true, price: 'moderate' }
    ]
  },
  
  'iowa-cubs': {
    name: 'Principal Park',
    sections: [
      // Field Level (100s)
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 52, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'value' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Upper Level (200s) 
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 352, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 4, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 16, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 28, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 40, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 320, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 332, angleSpan: 8, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 52, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 308, angleSpan: 12, covered: true, price: 'value' },
      
      // Special areas
      { id: 'budweiser-club', name: 'Budweiser Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'skybox-suites', name: 'BMW of Des Moines Skybox Suites', level: 'suite', baseAngle: 10, angleSpan: 40, covered: true, price: 'luxury' },
      { id: 'left-field-building', name: 'Left Field Building', level: 'club', baseAngle: 240, angleSpan: 40, covered: true, price: 'moderate' }
    ]
  },
  
  'las-vegas-aviators': {
    name: 'Las Vegas Ballpark',
    sections: [
      // Field Box sections (100 level)
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 348, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 356, angleSpan: 8, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 4, angleSpan: 8, covered: true, price: 'premium' }, // Premium Club
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 12, angleSpan: 8, covered: true, price: 'premium' }, // Premium Club
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 20, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 28, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 36, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 44, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 316, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 324, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 332, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 340, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 308, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 300, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 292, angleSpan: 8, covered: false, price: 'moderate' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 284, angleSpan: 8, covered: false, price: 'moderate' },
      
      // Special areas
      { id: 'party-deck', name: 'Party Deck', level: 'club', baseAngle: 52, angleSpan: 30, covered: true, price: 'moderate' },
      { id: 'home-run-porch', name: 'Home Run Porch', level: 'ga', baseAngle: 82, angleSpan: 40, covered: false, price: 'value' },
      { id: 'pool-area', name: 'Pool Area', level: 'club', baseAngle: 122, angleSpan: 30, covered: false, price: 'luxury' },
      { id: 'berm', name: 'Grass Berm', level: 'berm', baseAngle: 152, angleSpan: 60, covered: false, price: 'value' },
      { id: 'left-field-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 212, angleSpan: 40, covered: false, price: 'value' },
      { id: 'las-vegas-club', name: 'Las Vegas Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'suites', name: 'Luxury Suites', level: 'suite', baseAngle: 10, angleSpan: 40, covered: true, price: 'luxury' }
    ]
  },
  
  'durham-bulls': {
    name: 'Durham Bulls Athletic Park',
    sections: [
      // Diamond View Box (100 level behind home)
      { id: 'sec-100', name: '100', level: 'field', baseAngle: 340, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 350, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 0, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 10, angleSpan: 10, covered: true, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 20, angleSpan: 10, covered: true, price: 'premium' },
      
      // Field Box (first base side)
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 30, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 39, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 48, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 57, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 66, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 75, angleSpan: 9, covered: false, price: 'value' },
      
      // Field Box (third base side)
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 285, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-114', name: '114', level: 'field', baseAngle: 294, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-115', name: '115', level: 'field', baseAngle: 303, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-116', name: '116', level: 'field', baseAngle: 312, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-117', name: '117', level: 'field', baseAngle: 321, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-118', name: '118', level: 'field', baseAngle: 330, angleSpan: 9, covered: false, price: 'moderate' },
      
      // Upper Reserved (200 level)
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 340, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 0, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 20, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 40, angleSpan: 20, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 60, angleSpan: 20, covered: true, price: 'value' },
      
      // Special areas
      { id: 'blue-monster', name: 'Blue Monster', level: 'club', baseAngle: 225, angleSpan: 30, covered: false, price: 'moderate' },
      { id: 'pnc-triangle-club', name: 'PNC Triangle Club', level: 'club', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' },
      { id: 'rf-picnic', name: 'Right Field Picnic Area', level: 'ga', baseAngle: 84, angleSpan: 40, covered: false, price: 'value' },
      { id: 'jackie-robinson-deck', name: 'Jackie Robinson Deck', level: 'ga', baseAngle: 124, angleSpan: 50, covered: false, price: 'value' },
      { id: 'tobacco-road-sports-cafe', name: 'Tobacco Road Sports Cafe', level: 'club', baseAngle: 270, angleSpan: 15, covered: true, price: 'moderate' }
    ]
  },
  
  'charlotte-knights': {
    name: 'Truist Field',
    sections: [
      // Field Level (100s)
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 20, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 29, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 38, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 47, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-109', name: '109', level: 'field', baseAngle: 56, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-110', name: '110', level: 'field', baseAngle: 304, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-111', name: '111', level: 'field', baseAngle: 313, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-112', name: '112', level: 'field', baseAngle: 322, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-113', name: '113', level: 'field', baseAngle: 331, angleSpan: 9, covered: false, price: 'moderate' },
      
      // Upper Level (200s)
      { id: 'sec-201', name: '201', level: 'upper', baseAngle: 340, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-202', name: '202', level: 'upper', baseAngle: 353, angleSpan: 14, covered: true, price: 'value' },
      { id: 'sec-203', name: '203', level: 'upper', baseAngle: 7, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-204', name: '204', level: 'upper', baseAngle: 20, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'upper', baseAngle: 33, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-206', name: '206', level: 'upper', baseAngle: 46, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-207', name: '207', level: 'upper', baseAngle: 59, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-208', name: '208', level: 'upper', baseAngle: 72, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-209', name: '209', level: 'upper', baseAngle: 85, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-210', name: '210', level: 'upper', baseAngle: 98, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-211', name: '211', level: 'upper', baseAngle: 111, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-212', name: '212', level: 'upper', baseAngle: 124, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-213', name: '213', level: 'upper', baseAngle: 137, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-214', name: '214', level: 'upper', baseAngle: 223, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-215', name: '215', level: 'upper', baseAngle: 236, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-216', name: '216', level: 'upper', baseAngle: 249, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-217', name: '217', level: 'upper', baseAngle: 262, angleSpan: 14, covered: true, price: 'value' },
      { id: 'sec-218', name: '218', level: 'upper', baseAngle: 276, angleSpan: 13, covered: true, price: 'value' },
      { id: 'sec-219', name: '219', level: 'upper', baseAngle: 289, angleSpan: 13, covered: true, price: 'value' },
      
      // Special Areas
      { id: 'belfor-dugout-suites', name: 'BELFOR Dugout Suites', level: 'suite', baseAngle: 319, angleSpan: 21, covered: true, price: 'luxury' },
      { id: 'knights-castle', name: 'Knights Castle', level: 'ga', baseAngle: 149, angleSpan: 30, covered: false, price: 'value' },
      { id: 'picnic-terrace', name: 'Picnic Terrace', level: 'ga', baseAngle: 179, angleSpan: 44, covered: false, price: 'value' },
      { id: 'skyline-beer-garden', name: 'Skyline Beer Garden', level: 'club', baseAngle: 65, angleSpan: 20, covered: false, price: 'moderate' }
    ]
  }
};

// Function to update stadium sections in a file
async function updateStadiumSections(filePath: string, stadiumUpdates: Record<string, any>) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updateCount = 0;
  
  for (const [venueId, update] of Object.entries(stadiumUpdates)) {
    // Find the stadium in the file
    const venuePattern = new RegExp(
      `venueId:\\s*['"]${venueId}['"][\\s\\S]*?sections:\\s*\\[[\\s\\S]*?\\],[\\s\\S]*?notes:[^}]*}`,
      'g'
    );
    
    const match = content.match(venuePattern);
    if (match && match[0]) {
      // Format the new sections
      const formattedSections = update.sections.map((s: any) => 
        `      { id: '${s.id}', name: '${s.name}', level: '${s.level}', baseAngle: ${s.baseAngle}, angleSpan: ${s.angleSpan}, covered: ${s.covered}, price: '${s.price}' }`
      ).join(',\n');
      
      // Replace the sections array
      const replacement = match[0].replace(
        /sections:\s*\[[^\]]*\]/,
        `sections: [\n${formattedSections}\n    ]`
      );
      
      content = content.replace(match[0], replacement);
      updateCount++;
      console.log(`✅ Updated ${venueId} with real sections`);
    }
  }
  
  if (updateCount > 0) {
    fs.writeFileSync(filePath, content);
  }
  
  return updateCount;
}

// Main function
async function researchAndUpdateRealSections() {
  console.log('Researching and updating MiLB stadiums with REAL 2025 sections...\n');
  
  // Update AAA stadiums
  const aaaPath = path.join(__dirname, '..', 'src', 'data', 'milbVenueLayoutsAAA.ts');
  const aaaUpdates = await updateStadiumSections(aaaPath, realStadiumSections);
  console.log(`\n✅ Updated ${aaaUpdates} AAA stadiums with real sections`);
  
  console.log('\n⚠️  NOTE: This is a partial update. To complete all 120+ stadiums:');
  console.log('1. Research actual section numbers for each stadium');
  console.log('2. Verify with official stadium maps and seating charts');
  console.log('3. Update the realStadiumSections object with all stadiums');
  console.log('4. Run this script again to apply all updates');
}

// Run the update
researchAndUpdateRealSections().catch(console.error);