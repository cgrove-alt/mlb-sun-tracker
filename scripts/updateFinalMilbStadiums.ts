// Final update script for the last remaining MiLB stadiums with generic sections

import * as fs from 'fs';
import * as path from 'path';

const finalStadiumUpdates: Record<string, any> = {
  // AA Stadium
  'bowie-baysox': {
    file: 'milbVenueLayoutsAA.ts',
    name: 'Prince George\'s Stadium',
    sections: [
      { id: 'diamond-club', name: 'Diamond Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 27, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 39, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 51, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 63, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 75, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 285, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 297, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 309, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 321, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 333, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'orioles-pavilion', name: 'Orioles Pavilion', level: 'club', baseAngle: 87, angleSpan: 48, covered: true, price: 'moderate' },
      { id: 'rf-picnic', name: 'Right Field Picnic Area', level: 'ga', baseAngle: 135, angleSpan: 45, covered: false, price: 'value' },
      { id: 'baysox-berm', name: 'Baysox Berm', level: 'berm', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-party-deck', name: 'Left Field Party Deck', level: 'ga', baseAngle: 240, angleSpan: 45, covered: false, price: 'value' },
      { id: 'suites', name: 'Executive Suites', level: 'suite', baseAngle: 350, angleSpan: 20, covered: true, price: 'luxury' }
    ]
  },
  
  'chattanooga-lookouts': {
    file: 'milbVenueLayoutsAA.ts',
    name: 'AT&T Field',
    sections: [
      { id: 'att-club', name: 'AT&T Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'fb-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Section 102', level: 'field', baseAngle: 26, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Section 103', level: 'field', baseAngle: 37, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Section 104', level: 'field', baseAngle: 48, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Section 105', level: 'field', baseAngle: 59, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-106', name: 'Section 106', level: 'field', baseAngle: 70, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-107', name: 'Section 107', level: 'field', baseAngle: 290, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Section 108', level: 'field', baseAngle: 301, angleSpan: 11, covered: false, price: 'value' },
      { id: 'fb-109', name: 'Section 109', level: 'field', baseAngle: 312, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Section 110', level: 'field', baseAngle: 323, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'fb-111', name: 'Section 111', level: 'field', baseAngle: 334, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'lookouts-landing', name: 'Lookouts Landing', level: 'club', baseAngle: 81, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'scenic-city-deck', name: 'Scenic City Deck', level: 'ga', baseAngle: 131, angleSpan: 58, covered: false, price: 'value' },
      { id: 'moon-pie-terrace', name: 'Moon Pie Terrace', level: 'club', baseAngle: 189, angleSpan: 48, covered: true, price: 'moderate' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 237, angleSpan: 53, covered: false, price: 'value' }
    ]
  },
  
  'hartford-yard-goats': {
    file: 'milbVenueLayoutsAA.ts',
    name: 'Dunkin\' Park',
    sections: [
      { id: 'dunkin-club', name: 'Dunkin\' Dugout Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 27, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 39, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 51, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 63, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 75, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 285, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 297, angleSpan: 12, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 309, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 321, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 333, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'aetna-pavilion', name: 'Aetna Pavilion', level: 'club', baseAngle: 87, angleSpan: 46, covered: true, price: 'moderate' },
      { id: 'yard-goats-yard', name: 'The Yard', level: 'ga', baseAngle: 133, angleSpan: 54, covered: false, price: 'value' },
      { id: 'pratt-whitney-club', name: 'Pratt & Whitney Club', level: 'club', baseAngle: 187, angleSpan: 50, covered: true, price: 'luxury' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 237, angleSpan: 48, covered: false, price: 'value' }
    ]
  },
  
  'lakeland-flying-tigers': {
    file: 'milbVenueLayoutsA.ts',
    name: 'Publix Field at Joker Marchant Stadium',
    sections: [
      { id: 'publix-club', name: 'Publix Field Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'box-101', name: 'Box 101', level: 'field', baseAngle: 15, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'box-102', name: 'Box 102', level: 'field', baseAngle: 25, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'box-103', name: 'Box 103', level: 'field', baseAngle: 35, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'box-104', name: 'Box 104', level: 'field', baseAngle: 45, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'box-105', name: 'Box 105', level: 'field', baseAngle: 55, angleSpan: 10, covered: false, price: 'value' },
      { id: 'box-106', name: 'Box 106', level: 'field', baseAngle: 65, angleSpan: 10, covered: false, price: 'value' },
      { id: 'box-107', name: 'Box 107', level: 'field', baseAngle: 295, angleSpan: 10, covered: false, price: 'value' },
      { id: 'box-108', name: 'Box 108', level: 'field', baseAngle: 305, angleSpan: 10, covered: false, price: 'value' },
      { id: 'box-109', name: 'Box 109', level: 'field', baseAngle: 315, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'box-110', name: 'Box 110', level: 'field', baseAngle: 325, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'box-111', name: 'Box 111', level: 'field', baseAngle: 335, angleSpan: 10, covered: false, price: 'moderate' },
      { id: 'tigers-den', name: 'Tigers Den', level: 'club', baseAngle: 75, angleSpan: 40, covered: true, price: 'moderate' },
      { id: 'boardwalk', name: 'The Boardwalk', level: 'ga', baseAngle: 115, angleSpan: 60, covered: false, price: 'value' },
      { id: 'tiki-terrace', name: 'Tiki Terrace', level: 'ga', baseAngle: 175, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-berm', name: 'Left Field Berm', level: 'berm', baseAngle: 225, angleSpan: 70, covered: false, price: 'value' }
    ]
  },
  
  'wisconsin-timber-rattlers': {
    file: 'milbVenueLayoutsA.ts',
    name: 'Neuroscience Group Field',
    sections: [
      { id: 'home-plate-club', name: 'Home Plate Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
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
      { id: 'lf-hill', name: 'Left Field Hill', level: 'berm', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' }
    ]
  }
};

async function updateFinalStadiums() {
  console.log('Updating final 5 MiLB stadiums with unique sections...\n');
  
  const fileGroups: Record<string, string[]> = {
    'milbVenueLayoutsAA.ts': ['bowie-baysox', 'chattanooga-lookouts', 'hartford-yard-goats'],
    'milbVenueLayoutsA.ts': ['lakeland-flying-tigers', 'wisconsin-timber-rattlers']
  };
  
  let totalUpdated = 0;
  
  for (const [fileName, stadiumIds] of Object.entries(fileGroups)) {
    const filePath = path.join(__dirname, '..', 'src', 'data', fileName);
    console.log(`\nProcessing ${fileName}...`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let updateCount = 0;
      
      for (const stadiumId of stadiumIds) {
        const update = finalStadiumUpdates[stadiumId];
        if (!update) continue;
        
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
        console.log(`✅ Updated ${updateCount} stadiums`);
        totalUpdated += updateCount;
      }
      
    } catch (error) {
      console.error(`❌ Error updating ${fileName}:`, error);
    }
  }
  
  console.log(`\n✅ Total stadiums updated: ${totalUpdated}`);
  console.log('\nAll MiLB stadiums should now have unique sections!');
}

// Run the update
updateFinalStadiums().catch(console.error);