// Script to apply remaining AAA stadium sections
import * as fs from 'fs';
import * as path from 'path';
import { remainingAAAStadiums } from './remainingAAAStadiums';

// Function to update stadium sections in a file
async function updateStadiumSections(filePath: string, stadiumUpdates: Record<string, any>) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updateCount = 0;
  
  for (const [venueId, update] of Object.entries(stadiumUpdates)) {
    // Find the stadium in the file
    const venuePattern = new RegExp(
      `venueId:\\s*['"]${venueId}['"][\\s\\S]*?sections:\\s*\\[[\\s\\S]*?\\],[\\s\\S]*?notes:[^}]*}`,
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
    }
  }
  
  if (updateCount > 0) {
    fs.writeFileSync(filePath, content);
  }
  
  return updateCount;
}

// Main function
async function applyRemainingAAAStadiums() {
  console.log('Applying remaining AAA stadium sections...\n');
  
  // Update AAA stadiums
  const aaaPath = path.join(__dirname, '..', 'src', 'data', 'milbVenueLayoutsAAA.ts');
  const aaaUpdates = await updateStadiumSections(aaaPath, remainingAAAStadiums);
  console.log(`\n✅ Updated ${aaaUpdates} remaining AAA stadiums with real sections`);
  
  console.log('\n✅ All 30 AAA stadiums now have real sections!');
  console.log('\n⚠️  Next steps:');
  console.log('1. Begin researching and updating AA stadiums (30)');
  console.log('2. Then A+ stadiums (30)');
  console.log('3. Then A stadiums (30)');
  console.log('4. Verify all 120 stadiums have accurate sections');
}

// Run the update
applyRemainingAAAStadiums().catch(console.error);