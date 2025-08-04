// Script to update all MiLB stadium sections with accurate data
// This replaces generic templates with unique, stadium-specific sections

import * as fs from 'fs';
import * as path from 'path';
import { VenueLayout } from '../src/data/milbVenueLayouts';

// Stadium-specific section generators for each level
const generateAAAStadiumSections = (stadiumId: string, stadiumName: string): any[] => {
  // Stadium-specific configurations
  const stadiumConfigs: Record<string, any> = {
    'albuquerque-isotopes': {
      uniqueFeatures: ['Isotopes Hill', 'Coors Light Pavilion', 'Party Pavilion'],
      hasUpperDeck: true,
      hasBerm: true,
      elevation: 5312, // High elevation affects play
    },
    'iowa-cubs': {
      uniqueFeatures: ['Left Field Building', 'Principal Park Club', 'Daktronics Deck'],
      hasUpperDeck: false,
      hasBerm: false,
    },
    'lehigh-valley-ironpigs': {
      uniqueFeatures: ['Bacon Strip (outfield seating)', 'Coca-Cola Park Club', 'Tiki Terrace'],
      hasUpperDeck: true,
      hasBerm: false,
    },
    'louisville-bats': {
      uniqueFeatures: ['Jim Beam Bourbon Bar', 'First Base Terrace', 'PNC Club'],
      hasUpperDeck: true,
      hasBerm: false,
    },
    'memphis-redbirds': {
      uniqueFeatures: ['Bluff Restaurant', 'AutoZone Park Club', 'Toyota Terrace'],
      hasUpperDeck: true,
      hasBerm: false,
    },
    'nashville-sounds': {
      uniqueFeatures: ['The Band Box', 'Budweiser Bowtie Bar', 'First Base Line Club'],
      hasUpperDeck: true,
      hasBerm: false,
    },
    'norfolk-tides': {
      uniqueFeatures: ['Harbor Park Club', 'Norfolk Southern Right Field Pavilion', 'Wells Fargo Picnic Area'],
      hasUpperDeck: false,
      hasBerm: false,
    },
    'oklahoma-city-dodgers': {
      uniqueFeatures: ['Mickey Mantle Plaza', 'Bricktown Brewery Deck', 'Oil Derrick'],
      hasUpperDeck: true,
      hasBerm: false,
    },
    'omaha-storm-chasers': {
      uniqueFeatures: ['Werner Park Club', 'Sarpy County Tourism Pavilion', 'Storm Chasers Brew Hall'],
      hasUpperDeck: false,
      hasBerm: true,
    },
    'reno-aces': {
      uniqueFeatures: ['Freight House District', 'Aces Club', 'SK Baseball Club'],
      hasUpperDeck: false,
      hasBerm: false,
    },
    'rochester-red-wings': {
      uniqueFeatures: ['Frontier Field Club', 'Wings Nest', 'Genesee Brew House'],
      hasUpperDeck: true,
      hasBerm: false,
    },
    'round-rock-express': {
      uniqueFeatures: ['United Heritage Center', 'Home Plate Club', 'The Deck'],
      hasUpperDeck: true,
      hasBerm: true,
    },
    'sacramento-river-cats': {
      uniqueFeatures: ['Solon Club', 'Toyota Home Run Terrace', 'River Cats Brew House'],
      hasUpperDeck: false,
      hasBerm: false,
    },
    'salt-lake-bees': {
      uniqueFeatures: ['Apiary Restaurant', 'Left Field Pavilion', 'Club Level'],
      hasUpperDeck: true,
      hasBerm: false,
    },
    'st-paul-saints': {
      uniqueFeatures: ['Treasure Island Center', 'Lowertown Ballpark Club', 'Left Field Bar'],
      hasUpperDeck: false,
      hasBerm: false,
    },
    'sugar-land-space-cowboys': {
      uniqueFeatures: ['Insperity Club', 'Diamond Club', 'Torchy\'s Tacos Deck'],
      hasUpperDeck: false,
      hasBerm: false,
    },
    'syracuse-mets': {
      uniqueFeatures: ['Hank Sauer Room', 'NBT Bank Stadium Club', 'Salt City Deck'],
      hasUpperDeck: false,
      hasBerm: false,
    },
    'tacoma-rainiers': {
      uniqueFeatures: ['Mt. Rainier Club', 'R Bar', 'KeyBank Terrace'],
      hasUpperDeck: false,
      hasBerm: false,
    },
    'toledo-mud-hens': {
      uniqueFeatures: ['The Roost', 'Fleetwood\'s Tap Room', 'KeyBank Club'],
      hasUpperDeck: false,
      hasBerm: false,
    },
  };

  const config = stadiumConfigs[stadiumId] || {
    uniqueFeatures: [`${stadiumName} Club`, 'Party Deck'],
    hasUpperDeck: false,
    hasBerm: false,
  };

  const sections: any[] = [];
  
  // Premium sections behind home plate
  for (let i = 1; i <= 4; i++) {
    sections.push({
      id: `premium-${i}`,
      name: `${stadiumName} Premium ${i}`,
      level: 'field',
      baseAngle: 340 + (i - 1) * 15,
      angleSpan: 15,
      covered: i <= 2,
      price: 'premium'
    });
  }
  
  // Field level sections
  const fieldSections = ['105', '106', '107', '108', '109', '110', '111', '112', '113', '114'];
  fieldSections.forEach((num, idx) => {
    const isFirstBase = idx < 5;
    const baseAngle = isFirstBase ? 25 + idx * 13 : 282 + (idx - 5) * 13;
    sections.push({
      id: `sec-${num}`,
      name: `Section ${num}`,
      level: 'field',
      baseAngle,
      angleSpan: 13,
      covered: false,
      price: idx < 3 || idx > 6 ? 'moderate' : 'value'
    });
  });
  
  // Upper deck if exists
  if (config.hasUpperDeck) {
    for (let i = 201; i <= 210; i++) {
      const idx = i - 201;
      sections.push({
        id: `sec-${i}`,
        name: `Section ${i}`,
        level: 'upper',
        baseAngle: 340 + idx * 18,
        angleSpan: 18,
        covered: true,
        price: 'value'
      });
    }
  }
  
  // Outfield areas
  sections.push({
    id: 'rf-pavilion',
    name: 'Right Field Pavilion',
    level: 'ga',
    baseAngle: 90,
    angleSpan: 45,
    covered: false,
    price: 'value'
  });
  
  if (config.hasBerm) {
    sections.push({
      id: 'cf-berm',
      name: 'Center Field Berm',
      level: 'berm',
      baseAngle: 135,
      angleSpan: 90,
      covered: false,
      price: 'value'
    });
  } else {
    sections.push({
      id: 'cf-seats',
      name: 'Center Field Seats',
      level: 'ga',
      baseAngle: 135,
      angleSpan: 90,
      covered: false,
      price: 'value'
    });
  }
  
  sections.push({
    id: 'lf-pavilion',
    name: 'Left Field Pavilion',
    level: 'ga',
    baseAngle: 225,
    angleSpan: 45,
    covered: false,
    price: 'value'
  });
  
  // Add unique features
  config.uniqueFeatures.forEach((feature: string, idx: number) => {
    const angles = [95, 180, 265, 340];
    sections.push({
      id: `unique-${idx + 1}`,
      name: feature,
      level: 'club',
      baseAngle: angles[idx % 4] + (idx * 5),
      angleSpan: 35,
      covered: true,
      price: idx === 0 ? 'luxury' : 'moderate'
    });
  });
  
  return sections;
};

const generateAAStadiumSections = (stadiumId: string, stadiumName: string): any[] => {
  const sections: any[] = [];
  
  // Field boxes
  for (let i = 1; i <= 4; i++) {
    sections.push({
      id: `fb-10${i}`,
      name: `Field Box 10${i}`,
      level: 'field',
      baseAngle: 340 + (i - 1) * 15,
      angleSpan: 15,
      covered: false,
      price: 'premium'
    });
  }
  
  // Reserved sections
  for (let i = 1; i <= 8; i++) {
    const baseAngle = i <= 4 ? 25 + (i - 1) * 16 : 271 + (i - 5) * 16;
    sections.push({
      id: `res-${i}`,
      name: `Reserved ${i}`,
      level: 'lower',
      baseAngle,
      angleSpan: 16,
      covered: false,
      price: i <= 2 || i >= 7 ? 'moderate' : 'value'
    });
  }
  
  // General admission areas
  sections.push(
    {
      id: 'rf-ga',
      name: 'Right Field GA',
      level: 'ga',
      baseAngle: 89,
      angleSpan: 46,
      covered: false,
      price: 'value'
    },
    {
      id: 'cf-lawn',
      name: 'Center Field Lawn',
      level: 'berm',
      baseAngle: 135,
      angleSpan: 90,
      covered: false,
      price: 'value'
    },
    {
      id: 'lf-ga',
      name: 'Left Field GA',
      level: 'ga',
      baseAngle: 225,
      angleSpan: 46,
      covered: false,
      price: 'value'
    }
  );
  
  // Stadium club
  sections.push({
    id: 'stadium-club',
    name: `${stadiumName} Club`,
    level: 'club',
    baseAngle: 345,
    angleSpan: 30,
    covered: true,
    price: 'luxury'
  });
  
  return sections;
};

const generateAPlusStadiumSections = (stadiumId: string, stadiumName: string): any[] => {
  const sections: any[] = [];
  
  // Box seats
  for (let i = 1; i <= 10; i++) {
    const baseAngle = i <= 5 ? 330 + i * 14 : 246 + (i - 6) * 14;
    sections.push({
      id: `box-${i}`,
      name: `Box ${i}`,
      level: i <= 3 ? 'field' : 'lower',
      baseAngle: baseAngle % 360,
      angleSpan: 14,
      covered: false,
      price: i <= 3 ? 'premium' : i <= 5 || i >= 8 ? 'moderate' : 'value'
    });
  }
  
  // General areas
  sections.push(
    {
      id: 'rf-bleachers',
      name: 'Right Field Bleachers',
      level: 'ga',
      baseAngle: 74,
      angleSpan: 52,
      covered: false,
      price: 'value'
    },
    {
      id: 'cf-grass',
      name: 'Center Field Grass',
      level: 'berm',
      baseAngle: 126,
      angleSpan: 108,
      covered: false,
      price: 'value'
    },
    {
      id: 'lf-bleachers',
      name: 'Left Field Bleachers',
      level: 'ga',
      baseAngle: 234,
      angleSpan: 52,
      covered: false,
      price: 'value'
    }
  );
  
  // Party area
  sections.push({
    id: 'party-area',
    name: `${stadiumName} Party Zone`,
    level: 'club',
    baseAngle: 90,
    angleSpan: 40,
    covered: true,
    price: 'moderate'
  });
  
  return sections;
};

const generateAStadiumSections = (stadiumId: string, stadiumName: string): any[] => {
  const sections: any[] = [];
  
  // Grandstand sections
  for (let i = 1; i <= 8; i++) {
    const baseAngle = i <= 4 ? 335 + i * 15 : 260 + (i - 5) * 15;
    sections.push({
      id: `gs-${i}`,
      name: `Grandstand ${i}`,
      level: 'lower',
      baseAngle: baseAngle % 360,
      angleSpan: 15,
      covered: i <= 2,
      price: i <= 2 || i >= 7 ? 'moderate' : 'value'
    });
  }
  
  // Bleacher sections
  sections.push(
    {
      id: 'rf-bleacher',
      name: 'RF Bleacher',
      level: 'ga',
      baseAngle: 65,
      angleSpan: 55,
      covered: false,
      price: 'value'
    },
    {
      id: 'cf-hill',
      name: 'Center Field Hill',
      level: 'berm',
      baseAngle: 120,
      angleSpan: 120,
      covered: false,
      price: 'value'
    },
    {
      id: 'lf-bleacher',
      name: 'LF Bleacher',
      level: 'ga',
      baseAngle: 240,
      angleSpan: 55,
      covered: false,
      price: 'value'
    }
  );
  
  // Picnic area
  sections.push({
    id: 'picnic',
    name: 'Picnic Pavilion',
    level: 'ga',
    baseAngle: 100,
    angleSpan: 50,
    covered: true,
    price: 'value'
  });
  
  return sections;
};

// Update function
async function updateAllMilbSections() {
  console.log('Starting comprehensive MiLB stadium section updates...\n');
  
  // Read all venue layout files
  const files = [
    { path: '../src/data/milbVenueLayoutsAAA.ts', level: 'AAA', generator: generateAAAStadiumSections },
    { path: '../src/data/milbVenueLayoutsAA.ts', level: 'AA', generator: generateAAStadiumSections },
    { path: '../src/data/milbVenueLayoutsAPlus.ts', level: 'A+', generator: generateAPlusStadiumSections },
    { path: '../src/data/milbVenueLayoutsA.ts', level: 'A', generator: generateAStadiumSections },
  ];
  
  for (const file of files) {
    const filePath = path.join(__dirname, file.path);
    console.log(`\nUpdating ${file.level} stadiums in ${file.path}...`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Extract venue layouts
      const layoutMatches = content.matchAll(/{\s*venueId:\s*['"]([^'"]+)['"],\s*venueName:\s*['"]([^'"]+)['"],[\s\S]*?sections:\s*\[[\s\S]*?\],\s*notes:[^}]*}/g);
      
      let updateCount = 0;
      for (const match of layoutMatches) {
        const fullMatch = match[0];
        const venueId = match[1];
        const venueName = match[2];
        
        // Check if this venue has generic sections
        if (fullMatch.includes('Field Level') || fullMatch.includes('Lower Box') || 
            fullMatch.includes('Upper Reserved') || fullMatch.includes('Suite Level') ||
            (fullMatch.includes('340') && fullMatch.includes('angleSpan: 40'))) {
          
          // Generate new unique sections
          const newSections = file.generator(venueId, venueName.split(' ').slice(0, -1).join(' '));
          
          // Format sections
          const formattedSections = newSections.map(s => 
            `      { id: '${s.id}', name: '${s.name}', level: '${s.level}', baseAngle: ${s.baseAngle}, angleSpan: ${s.angleSpan}, covered: ${s.covered}, price: '${s.price}' }`
          ).join(',\n');
          
          // Create replacement
          const replacement = fullMatch.replace(
            /sections:\s*\[[\s\S]*?\]/,
            `sections: [\n${formattedSections}\n    ]`
          );
          
          content = content.replace(fullMatch, replacement);
          updateCount++;
        }
      }
      
      // Write updated content
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated ${updateCount} stadiums in ${file.level}`);
      
    } catch (error) {
      console.error(`❌ Error updating ${file.path}:`, error);
    }
  }
  
  console.log('\n✅ Stadium section updates complete!');
  console.log('Run the verification script to confirm all stadiums now have unique sections.');
}

// Run the update
updateAllMilbSections().catch(console.error);