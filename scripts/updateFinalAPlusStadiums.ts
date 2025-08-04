// Final update for A+ stadiums with generic sections

import * as fs from 'fs';
import * as path from 'path';

const finalAPlusUpdates: Record<string, any> = {
  'lakeland-flying-tigers': {
    sections: [
      { id: 'tiger-den', name: 'Tiger Den', level: 'field', baseAngle: 345, angleSpan: 30, covered: false, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 26, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-103', name: 'Section 103', level: 'lower', baseAngle: 37, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'lower', baseAngle: 48, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'lower', baseAngle: 59, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-106', name: 'Section 106', level: 'lower', baseAngle: 70, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'lower', baseAngle: 81, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'lower', baseAngle: 269, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'lower', baseAngle: 280, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-110', name: 'Section 110', level: 'lower', baseAngle: 291, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'lower', baseAngle: 302, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 313, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-113', name: 'Section 113', level: 'field', baseAngle: 324, angleSpan: 11, covered: false, price: 'premium' },
      { id: 'sec-114', name: 'Section 114', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'boardwalk', name: 'The Boardwalk', level: 'ga', baseAngle: 92, angleSpan: 60, covered: false, price: 'value' },
      { id: 'tiki-deck', name: 'Tiki Party Deck', level: 'club', baseAngle: 152, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'publix-porch', name: 'Publix Porch', level: 'club', baseAngle: 202, angleSpan: 40, covered: true, price: 'moderate' },
      { id: 'left-field-berm', name: 'Left Field Berm', level: 'berm', baseAngle: 242, angleSpan: 27, covered: false, price: 'value' }
    ]
  },
  
  'wisconsin-timber-rattlers': {
    sections: [
      { id: 'home-plate-club', name: 'Fox Communities Credit Union Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'snake-pit', name: 'The Snake Pit', level: 'club', baseAngle: 75, angleSpan: 45, covered: true, price: 'moderate' },
      { id: 'bratcho-pavilion', name: 'Bratcho Pavilion', level: 'ga', baseAngle: 120, angleSpan: 60, covered: false, price: 'value' },
      { id: 'fox-cities-deck', name: 'Fox Cities Stadium Deck', level: 'club', baseAngle: 180, angleSpan: 60, covered: true, price: 'moderate' },
      { id: 'left-field-hill', name: 'Left Field Hill', level: 'berm', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' }
    ]
  },
  
  'greenville-drive': {
    sections: [
      { id: 'home-plate-club', name: 'Main Street Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'green-monster', name: 'The Green Monster', level: 'club', baseAngle: 225, angleSpan: 30, covered: false, price: 'moderate' },
      { id: 'brew-lab', name: 'RJ Rockers Brew Lab', level: 'club', baseAngle: 75, angleSpan: 40, covered: true, price: 'moderate' },
      { id: 'picnic-pavilion', name: 'Picnic Pavilion', level: 'ga', baseAngle: 115, angleSpan: 60, covered: false, price: 'value' },
      { id: 'rooftop', name: 'Fluor Rooftop', level: 'club', baseAngle: 175, angleSpan: 50, covered: true, price: 'luxury' }
    ]
  },
  
  'lake-county-captains': {
    sections: [
      { id: 'classic-club', name: 'Classic Auto Group Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-100', name: 'Section 100', level: 'field', baseAngle: 15, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 24, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 33, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 42, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 51, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 60, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 69, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 291, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 300, angleSpan: 9, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 309, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 318, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 327, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'sec-112', name: 'Section 112', level: 'field', baseAngle: 336, angleSpan: 9, covered: false, price: 'moderate' },
      { id: 'captains-deck', name: 'Captain\'s Deck', level: 'club', baseAngle: 78, angleSpan: 48, covered: true, price: 'moderate' },
      { id: 'kidz-zone', name: 'Kidz Zone Hill', level: 'berm', baseAngle: 126, angleSpan: 72, covered: false, price: 'value' },
      { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 198, angleSpan: 50, covered: false, price: 'value' },
      { id: 'party-pavilion', name: 'Shipyard Party Pavilion', level: 'club', baseAngle: 248, angleSpan: 43, covered: true, price: 'moderate' }
    ]
  }
};

async function updateFinalAPlusStadiums() {
  console.log('Updating final A+ stadiums with unique sections...\n');
  
  const filePath = path.join(__dirname, '..', 'src', 'data', 'milbVenueLayoutsAPlus.ts');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updateCount = 0;
    
    for (const [stadiumId, update] of Object.entries(finalAPlusUpdates)) {
      console.log(`  Updating ${stadiumId}...`);
      
      // Find the stadium in the file
      const pattern = new RegExp(
        `venueId:\\s*['"]${stadiumId}['"][\\s\\S]*?sections:\\s*\\[[\\s\\S]*?\\],[\\s\\S]*?notes:[^}]*}`,
        'g'
      );
      
      const match = content.match(pattern);
      if (match && match[0]) {
        // Format the new sections
        const formattedSections = update.sections.map((s: any) => 
          `      { id: '${s.id}', name: '${s.name.replace(/'/g, "\\'")}', level: '${s.level}', baseAngle: ${s.baseAngle}, angleSpan: ${s.angleSpan}, covered: ${s.covered}, price: '${s.price}' }`
        ).join(',\n');
        
        // Replace the sections array
        const replacement = match[0].replace(
          /sections:\s*\[[^\]]*\]/,
          `sections: [\n${formattedSections}\n    ]`
        );
        
        content = content.replace(match[0], replacement);
        updateCount++;
      }
    }
    
    if (updateCount > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`\n✅ Updated ${updateCount} stadiums`);
    }
    
  } catch (error) {
    console.error('❌ Error updating A+ stadiums:', error);
  }
  
  console.log('\nAll MiLB stadiums should now have unique, accurate sections!');
}

// Run the update
updateFinalAPlusStadiums().catch(console.error);