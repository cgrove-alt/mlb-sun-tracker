// Script to add missing AA stadiums
import * as fs from 'fs';
import * as path from 'path';

const missingStadiums = `
  {
    venueId: 'columbus-clingstones',
    venueName: 'Synovus Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 322, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 334, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 346, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 358, angleSpan: 12, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 10, angleSpan: 12, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 22, angleSpan: 12, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 34, angleSpan: 12, covered: false, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 12, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 322, angleSpan: 12, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 334, angleSpan: 12, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 346, angleSpan: 12, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 358, angleSpan: 12, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 46, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Party Pavilion', level: 'field', baseAngle: 86, angleSpan: 20, covered: false, price: 'standard' }
    ],
    notes: 'Columbus, GA - New stadium opening 2025, 5,000 capacity'
  },
  
  {
    venueId: 'knoxville-smokies',
    venueName: 'Covenant Health Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 75, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 85, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 95, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 105, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 115, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 125, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 55, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 65, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 75, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 85, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 95, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 135, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 175, angleSpan: 20, covered: false, price: 'standard' }
    ],
    notes: 'Knoxville, TN - New stadium opening 2025, 7,000 capacity'
  },`;

async function addMissingStadiums() {
  const aaPath = path.join(__dirname, '..', 'src', 'data', 'milbVenueLayoutsAA.ts');
  let content = fs.readFileSync(aaPath, 'utf8');
  
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
    
    fs.writeFileSync(aaPath, content);
    console.log('✅ Added Columbus Clingstones and Knoxville Smokies to AA layouts');
  }
}

addMissingStadiums().catch(console.error);