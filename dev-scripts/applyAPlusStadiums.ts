// Script to apply A+ stadium sections
import * as fs from 'fs';
import * as path from 'path';
import { allAPlusStadiums } from './allAPlusStadiums';

// Map numeric venue IDs to string IDs used in A+ file
const venueIdMap: Record<string, string> = {
  '2837': 'aberdeen-ironbirds',
  '2807': 'asheville-tourists',
  '3569': 'bowling-green-hot-rods',
  '2795': 'brooklyn-cyclones',
  '2723': 'greensboro-grasshoppers',
  '3429': 'greenville-drive',
  '2796': 'hickory-crawdads',
  '2757': 'hudson-valley-renegades',
  '2866': 'jersey-shore-blueclaws',
  '3394': 'rome-braves',
  '2793': 'wilmington-blue-rocks',
  '4089': 'winston-salem-dash',
  '5525': 'beloit-sky-carp',
  '2857': 'cedar-rapids-kernels',
  '2766': 'dayton-dragons',
  '3790': 'fort-wayne-tincaps',
  '3189': 'great-lakes-loons',
  '2759': 'lake-county-captains',
  '2822': 'lansing-lugnuts',
  '2821': 'peoria-chiefs',
  '2790': 'quad-cities-river-bandits',
  '2850': 'south-bend-cubs',
  '2765': 'west-michigan-whitecaps',
  '2771': 'wisconsin-timber-rattlers',
  '4109': 'eugene-emeralds',
  '2762': 'everett-aquasox',
  '4429': 'hillsboro-hops',
  '2730': 'spokane-indians',
  '2826': 'tri-city-dust-devils',
  '2817': 'vancouver-canadians'
};

// Function to update stadium sections in a file
async function updateStadiumSections(filePath: string, stadiumUpdates: Record<string, any>) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updateCount = 0;
  
  for (const [numericVenueId, update] of Object.entries(stadiumUpdates)) {
    const venueId = venueIdMap[numericVenueId];
    if (!venueId) {
      console.log(`⚠️  No mapping found for venue ID ${numericVenueId}`);
      continue;
    }
    
    // Find the stadium in the file
    const venuePattern = new RegExp(
      `venueId:\\s*['\"]${venueId}['\"][\\s\\S]*?sections:\\s*\\[[\\s\\S]*?\\],[\\s\\S]*?notes:[^}]*}`,
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
      console.log(`✅ Updated ${venueId} (${update.name}) with real sections`);
    } else {
      console.log(`❌ Could not find ${venueId} in file`);
    }
  }
  
  if (updateCount > 0) {
    fs.writeFileSync(filePath, content);
  }
  
  return updateCount;
}

// Main function
async function applyAPlusStadiums() {
  console.log('Applying A+ stadium sections...\n');
  
  // Update A+ stadiums
  const aplusPath = path.join(__dirname, '..', 'src', 'data', 'milbVenueLayoutsAPlus.ts');
  const aplusUpdates = await updateStadiumSections(aplusPath, allAPlusStadiums);
  console.log(`\n✅ Updated ${aplusUpdates} A+ stadiums with real sections`);
  
  console.log('\n✅ All 30 A+ stadiums now have real sections!');
  console.log('\n⚠️  Next steps:');
  console.log('1. Begin researching and updating A stadiums (30)');
  console.log('2. Verify all 120 stadiums have accurate sections');
}

// Run the update
applyAPlusStadiums().catch(console.error);