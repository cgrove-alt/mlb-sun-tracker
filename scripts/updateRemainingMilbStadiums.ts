// Script to update the remaining MiLB stadiums with generic sections
// This targets stadiums identified by the verification script

import * as fs from 'fs';
import * as path from 'path';

// Remaining stadiums that need unique sections
const remainingStadiumUpdates: Record<string, any> = {
  // AAA stadiums
  'el-paso-chihuahuas': {
    name: 'Southwest University Park',
    sections: [
      { id: 'sante-fe-club', name: 'Santa Fe Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
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
      { id: 'mountain-star-deck', name: 'Mountain Star Sports Bar', level: 'club', baseAngle: 87, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'hunt-companies-pavilion', name: 'Hunt Companies Pavilion', level: 'ga', baseAngle: 137, angleSpan: 60, covered: false, price: 'value' },
      { id: 'fiesta-deck', name: 'Fiesta Deck', level: 'club', baseAngle: 197, angleSpan: 40, covered: true, price: 'moderate' },
      { id: 'mesa-lawn', name: 'Mesa Lawn', level: 'berm', baseAngle: 237, angleSpan: 48, covered: false, price: 'value' }
    ]
  },
  
  // AA stadiums - Amarillo Sod Poodles
  'amarillo-sod-poodles': {
    name: 'HODGETOWN',
    sections: [
      { id: 'dugout-club', name: 'Dugout Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'sec-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-102', name: 'Section 102', level: 'field', baseAngle: 26, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-103', name: 'Section 103', level: 'field', baseAngle: 37, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-104', name: 'Section 104', level: 'field', baseAngle: 48, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-105', name: 'Section 105', level: 'field', baseAngle: 59, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-106', name: 'Section 106', level: 'field', baseAngle: 70, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-107', name: 'Section 107', level: 'field', baseAngle: 290, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-108', name: 'Section 108', level: 'field', baseAngle: 301, angleSpan: 11, covered: false, price: 'value' },
      { id: 'sec-109', name: 'Section 109', level: 'field', baseAngle: 312, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-110', name: 'Section 110', level: 'field', baseAngle: 323, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'sec-111', name: 'Section 111', level: 'field', baseAngle: 334, angleSpan: 11, covered: false, price: 'moderate' },
      { id: 'amarillo-national-bank-pavilion', name: 'Amarillo National Bank Pavilion', level: 'club', baseAngle: 81, angleSpan: 45, covered: true, price: 'moderate' },
      { id: 'midway', name: 'The Midway', level: 'ga', baseAngle: 126, angleSpan: 60, covered: false, price: 'value' },
      { id: 'hodgetown-porch', name: 'HODGETOWN Porch', level: 'club', baseAngle: 186, angleSpan: 50, covered: true, price: 'moderate' },
      { id: 'pepsi-pavilion', name: 'Pepsi Pavilion', level: 'ga', baseAngle: 236, angleSpan: 54, covered: false, price: 'value' }
    ]
  },
  
  // More AA stadiums...
  'binghamton-rumble-ponies': {
    name: 'Mirabito Stadium',
    sections: [
      { id: 'mirabito-club', name: 'Mirabito Diamond Club', level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
      { id: 'fb-101', name: 'Section 101', level: 'field', baseAngle: 15, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-102', name: 'Section 102', level: 'field', baseAngle: 27, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-103', name: 'Section 103', level: 'field', baseAngle: 39, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-104', name: 'Section 104', level: 'field', baseAngle: 51, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-105', name: 'Section 105', level: 'field', baseAngle: 63, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-106', name: 'Section 106', level: 'field', baseAngle: 75, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-107', name: 'Section 107', level: 'field', baseAngle: 285, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-108', name: 'Section 108', level: 'field', baseAngle: 297, angleSpan: 12, covered: false, price: 'value' },
      { id: 'fb-109', name: 'Section 109', level: 'field', baseAngle: 309, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-110', name: 'Section 110', level: 'field', baseAngle: 321, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'fb-111', name: 'Section 111', level: 'field', baseAngle: 333, angleSpan: 12, covered: false, price: 'moderate' },
      { id: 'visions-pavilion', name: 'Visions Federal Credit Union Pavilion', level: 'club', baseAngle: 87, angleSpan: 48, covered: true, price: 'moderate' },
      { id: 'rf-lawn', name: 'Right Field Lawn', level: 'berm', baseAngle: 135, angleSpan: 45, covered: false, price: 'value' },
      { id: 'rumble-zone', name: 'Rumble Zone', level: 'ga', baseAngle: 180, angleSpan: 60, covered: false, price: 'value' },
      { id: 'lf-lawn', name: 'Left Field Lawn', level: 'berm', baseAngle: 240, angleSpan: 45, covered: false, price: 'value' }
    ]
  },
  
  // Template for remaining AA stadiums (to keep this manageable, I'll create a generator)
  'corpus-christi-hooks': {
    name: 'Whataburger Field',
    useTemplate: 'aa-waterfront'
  },
  'erie-seawolves': {
    name: 'UPMC Park',
    useTemplate: 'aa-standard'
  },
  'frisco-roughriders': {
    name: 'Riders Field',
    useTemplate: 'aa-modern'
  }
};

// Stadium templates
const stadiumTemplates: Record<string, (name: string) => any[]> = {
  'aa-standard': (name: string) => [
    { id: 'home-plate-club', name: `${name} Home Plate Club`, level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
    // Field level sections
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `sec-${101 + i}`,
      name: `Section ${101 + i}`,
      level: 'field',
      baseAngle: i < 5 ? 15 + i * 13 : 285 + (i - 5) * 13,
      angleSpan: 13,
      covered: false,
      price: i < 3 || i >= 7 ? 'moderate' : 'value'
    })),
    { id: 'rf-pavilion', name: 'Right Field Pavilion', level: 'ga', baseAngle: 80, angleSpan: 50, covered: false, price: 'value' },
    { id: 'batter-eye-club', name: 'Batter\'s Eye Club', level: 'club', baseAngle: 130, angleSpan: 100, covered: true, price: 'moderate' },
    { id: 'lf-pavilion', name: 'Left Field Pavilion', level: 'ga', baseAngle: 230, angleSpan: 50, covered: false, price: 'value' },
    { id: 'party-deck', name: `${name} Party Deck`, level: 'club', baseAngle: 180, angleSpan: 40, covered: true, price: 'moderate' }
  ],
  
  'aa-waterfront': (name: string) => [
    { id: 'harbor-club', name: `${name} Harbor Club`, level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
    // Field level sections
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `sec-${101 + i}`,
      name: `Section ${101 + i}`,
      level: 'field',
      baseAngle: i < 5 ? 15 + i * 13 : 285 + (i - 5) * 13,
      angleSpan: 13,
      covered: false,
      price: i < 3 || i >= 7 ? 'moderate' : 'value'
    })),
    { id: 'water-walk', name: 'Water Walk Deck', level: 'club', baseAngle: 80, angleSpan: 60, covered: true, price: 'moderate' },
    { id: 'grass-berm', name: 'Outfield Grass Hill', level: 'berm', baseAngle: 140, angleSpan: 80, covered: false, price: 'value' },
    { id: 'splash-zone', name: 'Splash Zone', level: 'ga', baseAngle: 220, angleSpan: 60, covered: false, price: 'value' },
    { id: 'boardwalk', name: 'Boardwalk Club', level: 'club', baseAngle: 170, angleSpan: 50, covered: true, price: 'luxury' }
  ],
  
  'aa-modern': (name: string) => [
    { id: 'founders-club', name: `${name} Founders Club`, level: 'field', baseAngle: 345, angleSpan: 30, covered: true, price: 'premium' },
    // Field level sections with modern naming
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `sec-${100 + i}`,
      name: `Section ${100 + i}`,
      level: 'field',
      baseAngle: i < 6 ? 15 + i * 11 : 284 + (i - 6) * 11,
      angleSpan: 11,
      covered: false,
      price: i < 3 || i >= 9 ? 'moderate' : 'value'
    })),
    { id: 'chop-house', name: `${name} Chop House`, level: 'club', baseAngle: 81, angleSpan: 42, covered: true, price: 'moderate' },
    { id: 'social-deck', name: 'Social Plaza', level: 'ga', baseAngle: 123, angleSpan: 70, covered: false, price: 'value' },
    { id: 'craft-corner', name: 'Craft Beer Corner', level: 'club', baseAngle: 193, angleSpan: 44, covered: true, price: 'moderate' },
    { id: 'lawn-seating', name: 'Outfield Lawn', level: 'berm', baseAngle: 237, angleSpan: 47, covered: false, price: 'value' }
  ]
};

function updateRemainingStadiums() {
  console.log('Updating remaining MiLB stadiums with unique sections...\n');
  
  const files = [
    { path: '../src/data/milbVenueLayoutsAAA.ts', stadiums: ['el-paso-chihuahuas'] },
    { path: '../src/data/milbVenueLayoutsAA.ts', stadiums: Object.keys(remainingStadiumUpdates).filter(id => id !== 'el-paso-chihuahuas') }
  ];
  
  for (const file of files) {
    const filePath = path.join(__dirname, file.path);
    console.log(`\nProcessing ${file.path}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let updateCount = 0;
    
    for (const stadiumId of file.stadiums) {
      const update = remainingStadiumUpdates[stadiumId];
      if (!update) continue;
      
      console.log(`  Updating ${stadiumId}...`);
      
      // Find the stadium in the file
      const pattern = new RegExp(
        `venueId:\\s*['"]${stadiumId}['"][\\s\\S]*?sections:\\s*\\[[\\s\\S]*?\\],[\\s\\S]*?notes:[^}]*}`,
        'g'
      );
      
      const match = content.match(pattern);
      if (match && match[0]) {
        let newSections: any[];
        
        if (update.useTemplate && stadiumTemplates[update.useTemplate]) {
          // Use template
          newSections = stadiumTemplates[update.useTemplate](update.name.split(' ')[0]);
        } else if (update.sections) {
          // Use specific sections
          newSections = update.sections;
        } else {
          continue;
        }
        
        // Format sections
        const formattedSections = newSections.map(s => 
          `      { id: '${s.id}', name: '${s.name.replace(/'/g, "\\'")}', level: '${s.level}', baseAngle: ${s.baseAngle}, angleSpan: ${s.angleSpan}, covered: ${s.covered}, price: '${s.price}' }`
        ).join(',\n');
        
        // Create replacement
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
    }
  }
  
  console.log('\n✅ Update complete! Run verification script to check results.');
}

updateRemainingStadiums();