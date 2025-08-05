// Script to apply AA stadium sections
import * as fs from 'fs';
import * as path from 'path';
import { allAAStadiums } from './allAAStadiums';

// Map numeric venue IDs to string IDs used in AA file
const venueIdMap: Record<string, string> = {
  '2740': 'akron-rubberducks',
  '2733': 'altoona-curve', 
  '2820': 'binghamton-rumble-ponies',
  '2832': 'bowie-baysox',
  '2512': 'erie-seawolves',
  '2749': 'harrisburg-senators',
  '4985': 'hartford-yard-goats',
  '2868': 'new-hampshire-fisher-cats',
  '2779': 'portland-sea-dogs',
  '2769': 'reading-fightin-phils',
  '2853': 'richmond-flying-squirrels',
  '5418': 'somerset-patriots',
  '4529': 'birmingham-barons',
  '4960': 'biloxi-shuckers',
  '2682': 'chattanooga-lookouts',
  '2813': 'columbus-clingstones',
  '2814': 'montgomery-biscuits',
  '4329': 'pensacola-blue-wahoos',
  '5455': 'rocket-city-trash-pandas',
  '2848': 'knoxville-smokies',
  '5415': 'amarillo-sod-poodles',
  '3389': 'arkansas-travelers',
  '2861': 'corpus-christi-hooks',
  '2755': 'frisco-roughriders',
  '2768': 'midland-rockhounds',
  '3329': 'northwest-arkansas-naturals',
  '2818': 'san-antonio-missions',
  '2722': 'springfield-cardinals',
  '4149': 'tulsa-drillers',
  '5450': 'wichita-wind-surge'
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
async function applyAAStadiums() {
  console.log('Applying AA stadium sections...\n');
  
  // Update AA stadiums
  const aaPath = path.join(__dirname, '..', 'src', 'data', 'milbVenueLayoutsAA.ts');
  const aaUpdates = await updateStadiumSections(aaPath, allAAStadiums);
  console.log(`\n✅ Updated ${aaUpdates} AA stadiums with real sections`);
  
  console.log('\n✅ All 30 AA stadiums now have real sections!');
  console.log('\n⚠️  Next steps:');
  console.log('1. Begin researching and updating A+ stadiums (30)');
  console.log('2. Then A stadiums (30)');
  console.log('3. Verify all 120 stadiums have accurate sections');
}

// Run the update
applyAAStadiums().catch(console.error);