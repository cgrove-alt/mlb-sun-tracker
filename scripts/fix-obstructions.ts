#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

// Find all obstruction files
function findObstructionFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('-obstructions.ts') && !item.includes('yankees')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Fix each file
const obstructionsDir = path.join(__dirname, '..', 'src', 'data', 'obstructions');
const files = findObstructionFiles(obstructionsDir);

console.log(`Found ${files.length} obstruction files to fix`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Add material property before castsShadow
  content = content.replace(
    /castsShadow: true,/g,
    `material: {
      opacity: 1.0,
      reflectivity: 0.3,
      color: '#808080'
    },
    castsShadow: true,`
  );
  
  // Fix transparency property
  content = content.replace(
    /transparency: ([\d.]+),/g,
    (match, value) => {
      const opacity = 1.0 - parseFloat(value);
      return `material: {
      opacity: ${opacity},
      reflectivity: 0.5,
      color: '#E0E0E0'
    },`;
    }
  );
  
  // Remove duplicate material properties
  content = content.replace(
    /material: \{[^}]*\},\s*material: \{[^}]*\},/g,
    (match) => {
      const lastMaterial = match.match(/material: \{[^}]*\}/g)?.[1];
      return lastMaterial ? lastMaterial + ',' : match;
    }
  );
  
  fs.writeFileSync(file, content);
  console.log(`✓ Fixed ${path.basename(file)}`);
});

console.log('Done!');