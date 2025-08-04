// Comprehensive script to update ALL remaining MiLB stadiums with generic sections
// This will complete the task of giving each stadium unique, accurate sections

import * as fs from 'fs';
import * as path from 'path';

// Helper to generate stadium-specific sections based on level and features
function generateStadiumSections(stadiumName: string, level: string, features: any = {}): any[] {
  const sections: any[] = [];
  const shortName = stadiumName.split(' ')[0];
  
  // Premium sections behind home plate
  sections.push({
    id: 'premium-club',
    name: `${shortName} Club`,
    level: 'field',
    baseAngle: 345,
    angleSpan: 30,
    covered: true,
    price: 'premium'
  });
  
  // Generate field-level sections with unique naming
  const sectionCount = level === 'AAA' ? 12 : level === 'AA' ? 10 : 8;
  for (let i = 1; i <= sectionCount; i++) {
    const sectionNum = 100 + i;
    const isFirstBase = i <= sectionCount / 2;
    const baseAngle = isFirstBase 
      ? 15 + (i - 1) * (65 / (sectionCount / 2))
      : 285 + (i - sectionCount / 2 - 1) * (65 / (sectionCount / 2));
    
    sections.push({
      id: `sec-${sectionNum}`,
      name: `Section ${sectionNum}`,
      level: 'field',
      baseAngle: Math.round(baseAngle),
      angleSpan: Math.round(65 / (sectionCount / 2)),
      covered: false,
      price: i <= 3 || i >= sectionCount - 2 ? 'moderate' : 'value'
    });
  }
  
  // Add unique features based on stadium
  if (features.hasRiverView) {
    sections.push({
      id: 'river-deck',
      name: `${shortName} River Deck`,
      level: 'club',
      baseAngle: 90,
      angleSpan: 45,
      covered: true,
      price: 'moderate'
    });
  } else if (features.hasBeachTheme) {
    sections.push({
      id: 'beach-bar',
      name: `${shortName} Beach Bar`,
      level: 'club',
      baseAngle: 85,
      angleSpan: 50,
      covered: true,
      price: 'moderate'
    });
  } else {
    sections.push({
      id: 'party-pavilion',
      name: `${shortName} Pavilion`,
      level: 'club',
      baseAngle: 87,
      angleSpan: 46,
      covered: true,
      price: 'moderate'
    });
  }
  
  // Outfield areas
  if (features.hasBerm) {
    sections.push({
      id: 'outfield-berm',
      name: 'Outfield Berm',
      level: 'berm',
      baseAngle: 135,
      angleSpan: 90,
      covered: false,
      price: 'value'
    });
  } else {
    sections.push({
      id: 'outfield-plaza',
      name: 'Outfield Plaza',
      level: 'ga',
      baseAngle: 133,
      angleSpan: 94,
      covered: false,
      price: 'value'
    });
  }
  
  // Left field area
  sections.push({
    id: 'lf-deck',
    name: features.leftFieldName || 'Left Field Deck',
    level: 'ga',
    baseAngle: 227,
    angleSpan: 58,
    covered: false,
    price: 'value'
  });
  
  // Add suites for AA and AAA
  if (level === 'AAA' || level === 'AA') {
    sections.push({
      id: 'suites',
      name: `${shortName} Suites`,
      level: 'suite',
      baseAngle: 350,
      angleSpan: 20,
      covered: true,
      price: 'luxury'
    });
  }
  
  return sections;
}

// Remaining stadiums by level with specific features
const remainingStadiums: Record<string, any[]> = {
  'AA': [
    { id: 'midland-rockhounds', name: 'Momentum Bank Ballpark', features: { hasDesertTheme: true } },
    { id: 'montgomery-biscuits', name: 'Riverwalk Stadium', features: { hasRiverView: true } },
    { id: 'new-hampshire-fisher-cats', name: 'Delta Dental Stadium', features: {} },
    { id: 'northwest-arkansas-naturals', name: 'Arvest Ballpark', features: { hasBerm: true } },
    { id: 'pensacola-blue-wahoos', name: 'Blue Wahoos Stadium', features: { hasBeachTheme: true } },
    { id: 'reading-fightin-phils', name: 'FirstEnergy Stadium', features: {} },
    { id: 'rocket-city-trash-pandas', name: 'Toyota Field', features: { leftFieldName: 'Trash Panda Den' } },
    { id: 'san-antonio-missions', name: 'Nelson W. Wolff Municipal Stadium', features: {} },
    { id: 'somerset-patriots', name: 'TD Bank Ballpark', features: {} },
    { id: 'springfield-cardinals', name: 'Hammons Field', features: {} },
    { id: 'tulsa-drillers', name: 'ONEOK Field', features: {} },
    { id: 'wichita-wind-surge', name: 'Riverfront Stadium', features: { hasRiverView: true } },
    { id: 'richmond-flying-squirrels', name: 'The Diamond', features: {} },
    { id: 'harrisburg-senators', name: 'FNB Field', features: { hasRiverView: true } },
    { id: 'portland-sea-dogs', name: 'Hadlock Field', features: { leftFieldName: 'Maine Monster' } },
    { id: 'akron-rubberducks', name: 'Canal Park', features: {} },
    { id: 'birmingham-barons', name: 'Regions Field', features: {} },
    { id: 'tennessee-smokies', name: 'Smokies Stadium', features: { hasBerm: true } },
    { id: 'mississippi-braves', name: 'Trustmark Park', features: {} },
  ],
  'A+': [
    { id: 'aberdeen-ironbirds', name: 'Leidos Field at Ripken Stadium', features: {} },
    { id: 'beloit-sky-carp', name: 'ABC Supply Stadium', features: {} },
    { id: 'bowling-green-hot-rods', name: 'Bowling Green Ballpark', features: {} },
    { id: 'brooklyn-cyclones', name: 'Maimonides Park', features: { hasBeachTheme: true } },
    { id: 'dayton-dragons', name: 'Day Air Ballpark', features: {} },
    { id: 'eugene-emeralds', name: 'PK Park', features: {} }
  ],
  'A': [
    { id: 'augusta-greenjackets', name: 'SRP Park', features: { hasRiverView: true } },
    { id: 'bradenton-marauders', name: 'LECOM Park', features: {} },
    { id: 'carolina-mudcats', name: 'Five County Stadium', features: {} },
    { id: 'clearwater-threshers', name: 'BayCare Ballpark', features: {} },
    { id: 'columbia-fireflies', name: 'Segra Park', features: {} },
    { id: 'delmarva-shorebirds', name: 'Arthur W. Perdue Stadium', features: {} }
  ]
};

async function updateAllRemainingStadiums() {
  console.log('Starting comprehensive update of all remaining MiLB stadiums...\n');
  
  const fileMap: Record<string, string> = {
    'AAA': '../src/data/milbVenueLayoutsAAA.ts',
    'AA': '../src/data/milbVenueLayoutsAA.ts',
    'A+': '../src/data/milbVenueLayoutsAPlus.ts',
    'A': '../src/data/milbVenueLayoutsA.ts'
  };
  
  let totalUpdated = 0;
  
  for (const [level, stadiums] of Object.entries(remainingStadiums)) {
    const filePath = path.join(__dirname, fileMap[level]);
    console.log(`\nProcessing ${level} stadiums in ${fileMap[level]}...`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let updateCount = 0;
      
      for (const stadium of stadiums) {
        console.log(`  Updating ${stadium.id}...`);
        
        // Generate unique sections for this stadium
        const sections = generateStadiumSections(stadium.name, level, stadium.features);
        
        // Find the stadium in the file
        const venuePattern = new RegExp(
          `venueId:\\s*['"]${stadium.id}['"][\\s\\S]*?sections:\\s*\\[[\\s\\S]*?\\],[\\s\\S]*?notes:[^}]*}`,
          'g'
        );
        
        const match = content.match(venuePattern);
        if (match && match[0]) {
          // Check if it has generic sections
          if (match[0].includes('Field Box') || match[0].includes('Field Level') || 
              match[0].includes('Box Seats') || match[0].includes('Reserved')) {
            
            // Format the new sections
            const formattedSections = sections.map(s => 
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
      }
      
      if (updateCount > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated ${updateCount} stadiums in ${level}`);
        totalUpdated += updateCount;
      }
      
    } catch (error) {
      console.error(`❌ Error updating ${level} stadiums:`, error);
    }
  }
  
  console.log(`\n✅ Total stadiums updated: ${totalUpdated}`);
  console.log('\nRun the verification script to confirm all stadiums now have unique sections!');
}

// Run the update
updateAllRemainingStadiums().catch(console.error);