// Script to fix angle values that exceed 360 degrees
import * as fs from 'fs';
import * as path from 'path';

const files = [
  '../src/data/milbVenueLayoutsAAA.ts',
  '../src/data/milbVenueLayoutsAA.ts',
  '../src/data/milbVenueLayoutsAPlus.ts',
  '../src/data/milbVenueLayoutsA.ts'
];

function fixAngleValues() {
  console.log('Fixing angle values that exceed 360 degrees...\n');
  
  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    console.log(`Processing ${file}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fixCount = 0;
    
    // Find all baseAngle values
    const anglePattern = /baseAngle:\s*(\d+)/g;
    
    content = content.replace(anglePattern, (match, angle) => {
      const angleValue = parseInt(angle);
      if (angleValue >= 360) {
        fixCount++;
        const newAngle = angleValue % 360;
        console.log(`  Fixed angle ${angleValue} → ${newAngle}`);
        return `baseAngle: ${newAngle}`;
      }
      return match;
    });
    
    // Fix any unescaped single quotes in name fields
    content = content.replace(/name: '([^']*)'s ([^']*)',/g, "name: '$1\\'s $2',");
    
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed ${fixCount} angle values\n`);
  });
  
  console.log('✅ All angle values fixed!');
}

fixAngleValues();