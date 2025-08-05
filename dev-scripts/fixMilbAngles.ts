// Fix angle values that exceed 360 degrees in MiLB venue files
import * as fs from 'fs';
import * as path from 'path';

function fixAnglesInFile(filePath: string) {
  console.log(`Fixing angles in ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fixCount = 0;
  
  // Find all baseAngle values and fix those > 360
  content = content.replace(
    /baseAngle:\s*([\d.]+)/g, 
    (match, angle) => {
      const angleNum = parseFloat(angle);
      if (angleNum >= 360) {
        const fixedAngle = angleNum % 360;
        fixCount++;
        return `baseAngle: ${fixedAngle}`;
      }
      return match;
    }
  );
  
  if (fixCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed ${fixCount} angles`);
  } else {
    console.log(`  ✅ No angles needed fixing`);
  }
  
  return fixCount;
}

async function fixAllAngles() {
  console.log('🔧 Fixing angle values that exceed 360 degrees...\n');
  
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
      const fixed = fixAnglesInFile(filePath);
      totalFixed += fixed;
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error);
    }
  }
  
  console.log(`\n🎉 Fixed ${totalFixed} total angle values`);
}

fixAllAngles().catch(console.error);