#!/usr/bin/env tsx

// Script to generate comprehensive obstruction models for all stadiums
// Run with: npx tsx scripts/generate-all-obstructions.ts

import * as fs from 'fs';
import * as path from 'path';
import { generateMLBObstructions, generateMiLBObstructions, generateNFLObstructions } from '../src/utils/generateObstructions';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { AAA_STADIUMS, AA_STADIUMS, HIGH_A_STADIUMS, LOW_A_STADIUMS } from '../src/data/milbStadiums';
import { NFL_STADIUMS } from '../src/data/nflStadiums';

// Generate obstruction file content
function generateObstructionFile(
  stadiumName: string,
  stadiumId: string,
  obstructions: any[]
): string {
  const exportName = stadiumId.replace(/-/g, '');
  
  return `// ${stadiumName} - 3D Obstruction Models
// Comprehensive obstruction data for accurate shadow calculations

import { Obstruction3D, Vector3D, Mesh3D } from '${
  stadiumId.includes('mlb') ? '../../../' : 
  stadiumId.includes('aaa') || stadiumId.includes('aa') || stadiumId.includes('high-a') || stadiumId.includes('low-a') ? '../../../../' :
  '../../../'
}types/stadium-complete';

// Helper to create box mesh
function createBoxMesh(min: Vector3D, max: Vector3D): Mesh3D {
  const vertices: Vector3D[] = [
    // Bottom face
    { x: min.x, y: min.y, z: min.z },
    { x: max.x, y: min.y, z: min.z },
    { x: max.x, y: max.y, z: min.z },
    { x: min.x, y: max.y, z: min.z },
    // Top face
    { x: min.x, y: min.y, z: max.z },
    { x: max.x, y: min.y, z: max.z },
    { x: max.x, y: max.y, z: max.z },
    { x: min.x, y: max.y, z: max.z }
  ];
  
  const faces = [
    [0, 1, 2, 3], // Bottom
    [4, 7, 6, 5], // Top
    [0, 4, 5, 1], // Front
    [2, 6, 7, 3], // Back
    [0, 3, 7, 4], // Left
    [1, 5, 6, 2]  // Right
  ];
  
  return { vertices, faces };
}

export const ${exportName}Obstructions: Obstruction3D[] = ${JSON.stringify(obstructions, null, 2)
  .replace(/"geometry":\s*{[^}]*}/g, (match) => {
    // Extract min and max from the geometry object
    const minMatch = match.match(/"min":\s*({[^}]*})/);
    const maxMatch = match.match(/"max":\s*({[^}]*})/);
    if (minMatch && maxMatch) {
      return `"geometry": createBoxMesh(${minMatch[1]}, ${maxMatch[1]})`;
    }
    return match;
  })
  .replace(/"boundingBox":\s*{[^}]*"min":\s*({[^}]*}),\s*"max":\s*({[^}]*})\s*}/g, 
    '"boundingBox": { min: $1, max: $2 }')
  .replace(/"(x|y|z)":/g, '$1:')
  .replace(/"(id|name|type|castsAndReceivesShadows|transparency|affectedSections)":/g, '$1:')
  .replace(/"/g, "'")
  .replace(/'(overhang|structure|roof|field|lower-bowl|first-base-line|right-field|third-base-line|left-field|bleachers|center-field|outfield|all|home-plate|diamond-box|box-seats|general|east-sideline|lower-east|west-sideline|lower-west|north-endzone|south-endzone|club-level)'/g, "'$1'")};

// Export for use in stadium data aggregator
export default ${exportName}Obstructions;
`;
}

// Process MLB stadiums
console.log('Processing MLB stadiums...');
MLB_STADIUMS.forEach(stadium => {
  // Skip Yankees as it already exists
  if (stadium.id === 'yankees') {
    console.log(`  ✓ Skipping ${stadium.name} (already exists)`);
    return;
  }
  
  const fileName = `${stadium.id}-obstructions.ts`;
  const filePath = path.join(__dirname, '..', 'src', 'data', 'obstructions', 'mlb', fileName);
  
  console.log(`  → Generating obstructions for ${stadium.name}...`);
  
  const hasRoof = stadium.roof === 'fixed' || stadium.roof === 'retractable';
  const roofType = stadium.roof as 'fixed' | 'retractable' | undefined;
  
  const obstructions = generateMLBObstructions(
    stadium.id,
    stadium.orientation,
    hasRoof,
    roofType
  );
  
  const fileContent = generateObstructionFile(stadium.name, stadium.id, obstructions);
  fs.writeFileSync(filePath, fileContent);
  console.log(`    ✓ Created ${fileName}`);
});

// Process MiLB stadiums
console.log('\nProcessing MiLB stadiums...');

// AAA
console.log('  Processing AAA stadiums...');
AAA_STADIUMS.forEach(stadium => {
  const fileName = `${stadium.id}-obstructions.ts`;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'obstructions', 'milb', 'aaa');
  const filePath = path.join(dirPath, fileName);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const obstructions = generateMiLBObstructions(
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'AAA'
  );
  
  const fileContent = generateObstructionFile(stadium.name, stadium.id, obstructions);
  fs.writeFileSync(filePath, fileContent);
});
console.log(`    ✓ Generated ${AAA_STADIUMS.length} AAA obstruction files`);

// AA
console.log('  Processing AA stadiums...');
AA_STADIUMS.forEach(stadium => {
  const fileName = `${stadium.id}-obstructions.ts`;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'obstructions', 'milb', 'aa');
  const filePath = path.join(dirPath, fileName);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const obstructions = generateMiLBObstructions(
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'AA'
  );
  
  const fileContent = generateObstructionFile(stadium.name, stadium.id, obstructions);
  fs.writeFileSync(filePath, fileContent);
});
console.log(`    ✓ Generated ${AA_STADIUMS.length} AA obstruction files`);

// High-A
console.log('  Processing High-A stadiums...');
HIGH_A_STADIUMS.forEach(stadium => {
  const fileName = `${stadium.id}-obstructions.ts`;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'obstructions', 'milb', 'high-a');
  const filePath = path.join(dirPath, fileName);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const obstructions = generateMiLBObstructions(
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'High-A'
  );
  
  const fileContent = generateObstructionFile(stadium.name, stadium.id, obstructions);
  fs.writeFileSync(filePath, fileContent);
});
console.log(`    ✓ Generated ${HIGH_A_STADIUMS.length} High-A obstruction files`);

// Low-A
console.log('  Processing Low-A stadiums...');
LOW_A_STADIUMS.forEach(stadium => {
  const fileName = `${stadium.id}-obstructions.ts`;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'obstructions', 'milb', 'low-a');
  const filePath = path.join(dirPath, fileName);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const obstructions = generateMiLBObstructions(
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'Low-A'
  );
  
  const fileContent = generateObstructionFile(stadium.name, stadium.id, obstructions);
  fs.writeFileSync(filePath, fileContent);
});
console.log(`    ✓ Generated ${LOW_A_STADIUMS.length} Low-A obstruction files`);

// Process NFL stadiums
console.log('\nProcessing NFL stadiums...');
NFL_STADIUMS.forEach(stadium => {
  const fileName = `${stadium.id}-obstructions.ts`;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'obstructions', 'nfl');
  const filePath = path.join(dirPath, fileName);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  console.log(`  → Generating obstructions for ${stadium.name}...`);
  
  const hasRoof = stadium.roof === 'fixed' || stadium.roof === 'retractable';
  const isOpenAir = stadium.roof === 'open' || stadium.roof === undefined;
  
  const obstructions = generateNFLObstructions(
    stadium.id,
    stadium.orientation,
    hasRoof,
    isOpenAir
  );
  
  const fileContent = generateObstructionFile(stadium.name, stadium.id, obstructions);
  fs.writeFileSync(filePath, fileContent);
});
console.log(`  ✓ Generated ${NFL_STADIUMS.length} NFL obstruction files`);

console.log('\n✅ Obstruction generation complete!');
console.log('All stadiums now have comprehensive 3D obstruction models for accurate shadow calculations.');