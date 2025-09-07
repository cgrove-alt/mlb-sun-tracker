const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the broken "covered: false" lines
  content = content.replace(/covered: false\s*\}/g, 'covered: false,\n    distance: 50,\n    height: 20,\n    rake: 25,\n    viewQuality: \'good\'\n  }');
  
  // Fix missing commas after covered: true
  content = content.replace(/covered: true\s+partialCoverage:/g, 'covered: true,\n    partialCoverage:');
  
  // Fix missing commas after covered: false
  content = content.replace(/covered: false\s+partialCoverage:/g, 'covered: false,\n    partialCoverage:');
  
  // Fix duplicate 'covered: false' at the section level
  content = content.replace(/\],\s*covered: false\s*\}/g, '],\n    covered: false,\n    distance: 50,\n    height: 20,\n    rake: 25,\n    viewQuality: \'good\'\n  }');
  
  // Fix the broken syntax for sections with covered after vertices3D
  content = content.replace(/\] as Vector3D\[\],\s*covered: false\s*\}/g, '] as Vector3D[],\n    covered: false,\n    distance: 50,\n    height: 20,\n    rake: 25,\n    viewQuality: \'good\'\n  }');
  
  content = content.replace(/\],\s*covered: false\s*\}/g, '],\n    covered: false,\n    distance: 50,\n    height: 20,\n    rake: 25,\n    viewQuality: \'good\'\n  }');
  
  // Fix any sections with broken syntax
  content = content.replace(/\s+covered: false\s+\}/g, '\n    covered: false,\n    distance: 50,\n    height: 20,\n    rake: 25,\n    viewQuality: \'good\'\n  }');
  
  // Remove "No newline at end of file" if present
  content = content.replace('No newline at end of file', '');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${path.basename(filePath)}`);
}

// Process all MLB stadium files
const mlbDir = path.join(__dirname, 'src/data/sections/mlb');
const files = fs.readdirSync(mlbDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(mlbDir, file);
  try {
    processFile(filePath);
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nProcessed ${files.length} files`);