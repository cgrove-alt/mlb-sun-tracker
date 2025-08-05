// Script to fix type issues in all venue layout files
import * as fs from 'fs';
import * as path from 'path';

function fixTypeIssues(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  // Replace 'standard' price with 'moderate'
  const standardCount = (content.match(/price: 'standard'/g) || []).length;
  content = content.replace(/price: 'standard'/g, "price: 'moderate'");
  changeCount += standardCount;
  
  // Replace 'main' level with 'lower' or 'upper' based on section number
  // Sections 200+ are typically upper level
  const mainMatches = content.match(/level: 'main'[^}]*name: '(\d+)'/g) || [];
  mainMatches.forEach(match => {
    const sectionMatch = match.match(/name: '(\d+)'/);
    if (sectionMatch) {
      const sectionNum = parseInt(sectionMatch[1]);
      if (sectionNum >= 200) {
        content = content.replace(match, match.replace("level: 'main'", "level: 'upper'"));
      } else {
        content = content.replace(match, match.replace("level: 'main'", "level: 'lower'"));
      }
    }
  });
  
  // For named sections (not numbered), default to 'upper' for main level
  content = content.replace(/level: 'main'/g, "level: 'upper'");
  changeCount += mainMatches.length;
  
  // Replace 'plaza' level with 'lower'
  const plazaCount = (content.match(/level: 'plaza'/g) || []).length;
  content = content.replace(/level: 'plaza'/g, "level: 'lower'");
  changeCount += plazaCount;
  
  // Replace 'mezzanine' level with 'upper'
  const mezzanineCount = (content.match(/level: 'mezzanine'/g) || []).length;
  content = content.replace(/level: 'mezzanine'/g, "level: 'upper'");
  changeCount += mezzanineCount;
  
  if (changeCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${changeCount} type issues in ${path.basename(filePath)}`);
  }
  
  return changeCount;
}

// Main function
async function fixAllTypeIssues() {
  console.log('Fixing type issues in all venue layout files...\n');
  
  const dataPath = path.join(__dirname, '..', 'src', 'data');
  const files = [
    'milbVenueLayoutsAAA.ts',
    'milbVenueLayoutsAA.ts',
    'milbVenueLayoutsAPlus.ts',
    'milbVenueLayoutsA.ts'
  ];
  
  let totalFixed = 0;
  
  for (const file of files) {
    const filePath = path.join(dataPath, file);
    if (fs.existsSync(filePath)) {
      totalFixed += fixTypeIssues(filePath);
    }
  }
  
  console.log(`\n✅ Fixed ${totalFixed} total type issues across all files`);
}

// Run the fix
fixAllTypeIssues().catch(console.error);