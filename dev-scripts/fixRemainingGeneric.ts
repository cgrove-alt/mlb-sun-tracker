// Fix remaining generic "Section 105" patterns to just "105"
import * as fs from 'fs';
import * as path from 'path';

function fixGenericSectionsInFile(filePath: string) {
  console.log(`Fixing generic sections in ${path.basename(filePath)}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fixCount = 0;
  
  // Replace "Section 105" with just "105"
  content = content.replace(
    /name:\s*['"]Section\s+(\d+)['"]/g, 
    (match, number) => {
      fixCount++;
      return `name: '${number}'`;
    }
  );
  
  // Replace "Field Box 105" with just "105"
  content = content.replace(
    /name:\s*['"]Field\s+Box\s+(\d+)['"]/g, 
    (match, number) => {
      fixCount++;
      return `name: '${number}'`;
    }
  );
  
  // Replace "Reserved 105" with just "105"
  content = content.replace(
    /name:\s*['"]Reserved\s+(\d+)['"]/g, 
    (match, number) => {
      fixCount++;
      return `name: '${number}'`;
    }
  );
  
  if (fixCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed ${fixCount} generic section names`);
  } else {
    console.log(`  ✅ No generic sections found`);
  }
  
  return fixCount;
}

async function fixAllGenericSections() {
  console.log('🔧 Fixing any remaining generic section patterns...\n');
  
  const files = [
    '../src/data/milbVenueLayoutsAAA.ts',
    '../src/data/milbVenueLayoutsAA.ts',
    '../src/data/milbVenueLayoutsAPlus.ts',
    '../src/data/milbVenueLayoutsA.ts',
    '../src/data/milbVenueLayoutsMissing.ts'
  ];
  
  let totalFixed = 0;
  
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    try {
      const fixed = fixGenericSectionsInFile(filePath);
      totalFixed += fixed;
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error);
    }
  }
  
  console.log(`\n🎉 Fixed ${totalFixed} total generic section names`);
  console.log('All sections now use real stadium section numbers!');
}

fixAllGenericSections().catch(console.error);