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

console.log(`Fixing ${files.length} obstruction files`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Remove any duplicate material properties with a more aggressive regex
  // Find all obstruction objects and fix them
  const objects = content.split(/(?=\s*{\s*id:)/);
  
  const fixed = objects.map((obj, index) => {
    if (index === 0) return obj; // Skip the header
    
    // Check if this object has material properties
    const materialMatches = obj.match(/material:\s*{[^}]*}/g);
    
    if (materialMatches && materialMatches.length > 1) {
      // Remove all but the last material property
      for (let i = 0; i < materialMatches.length - 1; i++) {
        obj = obj.replace(materialMatches[i] + ',', '');
        obj = obj.replace(materialMatches[i], '');
      }
    }
    
    // Ensure castsShadow comes after material
    if (obj.includes('material:') && obj.includes('castsShadow:')) {
      // Remove castsShadow if it appears before material
      const materialIndex = obj.indexOf('material:');
      const castsShadowIndex = obj.indexOf('castsShadow:');
      
      if (castsShadowIndex < materialIndex) {
        obj = obj.replace(/castsShadow:\s*true,?\s*/, '');
        // Add it back after material
        obj = obj.replace(/material:\s*{[^}]*},?/, (match) => {
          return match.replace(/,?\s*$/, '') + ',\n    castsShadow: true,';
        });
      }
    }
    
    // Ensure there's exactly one castsShadow property
    const castsShadowMatches = obj.match(/castsShadow:\s*true/g);
    if (castsShadowMatches && castsShadowMatches.length > 1) {
      // Remove all but the last one
      for (let i = 0; i < castsShadowMatches.length - 1; i++) {
        obj = obj.replace(/castsShadow:\s*true,?\s*/, '');
      }
    }
    
    return obj;
  }).join('');
  
  // Final cleanup - ensure proper formatting
  content = fixed
    .replace(/,\s*,/g, ',') // Remove double commas
    .replace(/},\s*}/g, '}\n  }') // Fix closing braces
    .replace(/castsShadow:\s*true\s*}/g, 'castsShadow: true\n  }') // Ensure proper formatting
    .replace(/,\s*]/g, '\n]'); // Fix array closing
  
  fs.writeFileSync(file, content);
  console.log(`✓ Fixed ${path.basename(file)}`);
});

console.log('Done!');