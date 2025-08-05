// Script to add missing A+ stadiums and update Rome Emperors
import * as fs from 'fs';
import * as path from 'path';

async function addMissingStadiums() {
  const aplusPath = path.join(__dirname, '..', 'src', 'data', 'milbVenueLayoutsAPlus.ts');
  let content = fs.readFileSync(aplusPath, 'utf8');
  
  // Update Rome Emperors sections
  const romePattern = /venueId:\s*['"]rome-emperors['"][\s\S]*?sections:\s*\[[\s\S]*?\],[\s\S]*?notes:[^}]*}/g;
  const romeMatch = content.match(romePattern);
  
  if (romeMatch && romeMatch[0]) {
    const romeSections = [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 310, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 310, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 320, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 330, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 340, angleSpan: 10, covered: false, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 30, angleSpan: 40, covered: false, price: 'value' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'field', baseAngle: 70, angleSpan: 20, covered: false, price: 'standard' }
    ];
    
    const formattedSections = romeSections.map(s => 
      `      { id: '${s.id}', name: '${s.name}', level: '${s.level}', baseAngle: ${s.baseAngle}, angleSpan: ${s.angleSpan}, covered: ${s.covered}, price: '${s.price}' }`
    ).join(',\n');
    
    const replacement = romeMatch[0].replace(
      /sections:\s*\[[^\]]*\]/,
      `sections: [\n${formattedSections}\n    ]`
    );
    
    content = content.replace(romeMatch[0], replacement);
    console.log('✅ Updated Rome Emperors sections');
  }
  
  // Add missing stadiums
  const missingStadiums = `
  {
    venueId: 'hickory-crawdads',
    venueName: 'L.P. Frans Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 10, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 90, angleSpan: 40, covered: false, price: 'value' },
      { id: 'party-deck', name: 'Party Deck', level: 'field', baseAngle: 130, angleSpan: 20, covered: false, price: 'standard' }
    ],
    notes: 'Hickory, NC with mountain views'
  },
  
  {
    venueId: 'fort-wayne-tincaps',
    venueName: 'Parkview Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'sec-101', name: '101', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: '102', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-103', name: '103', level: 'field', baseAngle: 40, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-104', name: '104', level: 'field', baseAngle: 50, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-105', name: '105', level: 'field', baseAngle: 60, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-106', name: '106', level: 'field', baseAngle: 70, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-107', name: '107', level: 'field', baseAngle: 80, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-108', name: '108', level: 'field', baseAngle: 90, angleSpan: 10, covered: false, price: 'standard' },
      { id: 'sec-201', name: '201', level: 'main', baseAngle: 20, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-202', name: '202', level: 'main', baseAngle: 30, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-203', name: '203', level: 'main', baseAngle: 40, angleSpan: 10, covered: true, price: 'standard' },
      { id: 'sec-204', name: '204', level: 'main', baseAngle: 50, angleSpan: 10, covered: true, price: 'value' },
      { id: 'sec-205', name: '205', level: 'main', baseAngle: 60, angleSpan: 10, covered: true, price: 'value' },
      { id: 'lawn', name: 'Lawn', level: 'berm', baseAngle: 100, angleSpan: 40, covered: false, price: 'value' },
      { id: 'harrison-square-club', name: 'Harrison Square Club', level: 'club', baseAngle: 40, angleSpan: 30, covered: true, price: 'luxury' }
    ],
    notes: 'Fort Wayne, IN - Downtown ballpark with city skyline views'
  },`;
  
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
    
    console.log('✅ Added Hickory Crawdads and Fort Wayne TinCaps to A+ layouts');
  }
  
  fs.writeFileSync(aplusPath, content);
}

addMissingStadiums().catch(console.error);