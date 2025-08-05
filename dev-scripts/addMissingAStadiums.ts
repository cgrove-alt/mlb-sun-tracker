// Script to add missing A stadiums
import * as fs from 'fs';
import * as path from 'path';

const missingStadiums = `
  {
    venueId: 'lakeland-flying-tigers',
    venueName: 'Publix Field at Joker Marchant Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: true, price: 'value' },
      { id: 'berm', name: 'Berm', level: 'berm', baseAngle: 20, angleSpan: 40, covered: false, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 60, angleSpan: 20, covered: false, price: 'standard' }
    ],
    notes: 'Lakeland, FL - Spring training home of Detroit Tigers'
  },
  
  {
    venueId: 'daytona-tortugas',
    venueName: 'Jackie Robinson Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 100, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'grandstand-1', name: 'Grandstand 1', level: 'main', baseAngle: 40, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'grandstand-2', name: 'Grandstand 2', level: 'main', baseAngle: 55, angleSpan: 15, covered: true, price: 'standard' },
      { id: 'grandstand-3', name: 'Grandstand 3', level: 'main', baseAngle: 70, angleSpan: 15, covered: true, price: 'value' },
      { id: 'grandstand-4', name: 'Grandstand 4', level: 'main', baseAngle: 85, angleSpan: 15, covered: true, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 110, angleSpan: 20, covered: false, price: 'standard' },
      { id: 'picnic-area', name: 'Picnic Area', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'standard' }
    ],
    notes: 'Daytona Beach, FL - Historic ballpark where Jackie Robinson broke the color barrier'
  },
  
  {
    venueId: 'fort-myers-mighty-mussels',
    venueName: 'Hammond Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 345, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 355, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 5, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 305, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 315, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 325, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 335, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 345, angleSpan: 10, covered: true, price: 'value' },
      { id: 'boardwalk', name: 'Boardwalk', level: 'field', baseAngle: 25, angleSpan: 30, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 55, angleSpan: 20, covered: false, price: 'standard' }
    ],
    notes: 'Fort Myers, FL - Spring training home of Minnesota Twins'
  },`;

async function addMissingStadiums() {
  const aPath = path.join(__dirname, '..', 'src', 'data', 'milbVenueLayoutsA.ts');
  let content = fs.readFileSync(aPath, 'utf8');
  
  // Find the end of the array
  const lastBracket = content.lastIndexOf('];');
  
  if (lastBracket !== -1) {
    // Insert the new stadiums before the closing bracket
    const beforeBracket = content.substring(0, lastBracket);
    const afterBracket = content.substring(lastBracket);
    
    // Add a comma after the last stadium if needed
    const trimmedBefore = beforeBracket.trimEnd();
    const needsComma = trimmedBefore[trimmedBefore.length - 1] === '}';
    
    content = beforeBracket + (needsComma ? ',' : '') + '\n  ' + missingStadiums + '\n' + afterBracket;
    
    fs.writeFileSync(aPath, content);
    console.log('✅ Added Lakeland Flying Tigers, Daytona Tortugas, and Fort Myers Mighty Mussels to A layouts');
  }
}

addMissingStadiums().catch(console.error);