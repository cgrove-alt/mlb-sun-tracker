#!/usr/bin/env ts-node

// Script to generate comprehensive sections for all stadiums
// Run with: npx ts-node scripts/generate-all-sections.ts

import * as fs from 'fs';
import * as path from 'path';
import { generateMLBSections, generateMiLBSections, generateNFLSections } from '../src/utils/generateComprehensiveSections';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { AAA_STADIUMS, AA_STADIUMS, HIGH_A_STADIUMS, LOW_A_STADIUMS } from '../src/data/milbStadiums';
import { NFL_STADIUMS } from '../src/data/nflStadiums';

// Stadiums that already have comprehensive sections (don't overwrite)
const COMPLETED_MLB = [
  'great-american-ballpark',
  'george-m-steinbrenner-field',
  'truist-park',
  'fenway-park',
  'oracle-park',
  'pnc-park',
  'wrigley-field'
];

// Generate section file content
function generateSectionFile(
  stadiumName: string,
  stadiumId: string,
  orientation: number,
  capacity: number,
  type: 'MLB' | 'MiLB' | 'NFL',
  level?: 'AAA' | 'AA' | 'High-A' | 'Low-A'
): string {
  let sections;
  
  if (type === 'MLB') {
    sections = generateMLBSections(stadiumId, orientation, capacity);
  } else if (type === 'MiLB' && level) {
    sections = generateMiLBSections(stadiumId, orientation, capacity, level);
  } else if (type === 'NFL') {
    sections = generateNFLSections(stadiumId, orientation, capacity, false);
  } else {
    throw new Error('Invalid stadium type');
  }
  
  const sectionsCode = sections.map(section => {
    const verticesStr = section.vertices3D
      .map(v => `      { x: ${v.x.toFixed(0)}, y: ${v.y.toFixed(0)}, z: ${v.z !== null ? v.z.toFixed(0) : 'null'} }`)
      .join(',\n');
    
    const rowsStr = section.rows.length > 0
      ? `generateRows(${
          typeof section.rows[0].rowNumber === 'string' 
            ? `'${section.rows[0].rowNumber}', '${section.rows[section.rows.length - 1].rowNumber}'`
            : `${section.rows[0].rowNumber}, ${section.rows[section.rows.length - 1].rowNumber}`
        }, ${section.rows[0].seats}, ${section.rows[0].elevation}, ${section.rake}, ${section.covered})`
      : '[]';
    
    return `  {
    id: '${section.id}',
    name: '${section.name}',
    level: '${section.level}',
    baseAngle: ${section.baseAngle},
    angleSpan: ${section.angleSpan},
    rows: ${rowsStr},
    vertices3D: [
${verticesStr}
    ] as Vector3D[],
    covered: ${section.covered},
    distance: ${section.distance},
    height: ${section.height},
    rake: ${section.rake}
  }`;
  }).join(',\n');
  
  return `// ${stadiumName} - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations

import { DetailedSection, Vector3D, RowDetail } from '${
  type === 'MLB' ? '../../../types/stadium-complete' :
  type === 'MiLB' ? '../../../../types/stadium-complete' :
  '../../../../types/stadium-complete'
}';

// Helper function to generate rows
function generateRows(
  startRow: number | string,
  endRow: number | string,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  covered: boolean = false
): RowDetail[] {
  const rows: RowDetail[] = [];
  const rowHeight = 2.5;
  const rowDepth = 2.8;
  
  const isLetterRows = typeof startRow === 'string';
  
  if (isLetterRows) {
    const startCode = (startRow as string).charCodeAt(0);
    const endCode = (endRow as string).charCodeAt(0);
    
    for (let i = startCode; i <= endCode; i++) {
      const rowNum = i - startCode;
      rows.push({
        rowNumber: String.fromCharCode(i),
        seats: seatsPerRow - Math.floor(rowNum * 0.2),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  } else {
    for (let i = startRow as number; i <= (endRow as number); i++) {
      const rowNum = i - (startRow as number);
      rows.push({
        rowNumber: i.toString(),
        seats: seatsPerRow - Math.floor(rowNum * 0.2),
        elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
        depth: rowNum * rowDepth,
        covered: covered,
        overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
      });
    }
  }
  
  return rows;
}

export const ${stadiumId.replace(/-/g, '')}Sections: DetailedSection[] = [
${sectionsCode}
];

// Export section map for easy lookup
export const ${stadiumId.replace(/-/g, '')}SectionMap = new Map(
  ${stadiumId.replace(/-/g, '')}Sections.map(section => [section.id, section])
);
`;
}

// Process MLB stadiums
console.log('Processing MLB stadiums...');
MLB_STADIUMS.forEach(stadium => {
  const fileName = stadium.id.replace(/[^a-z0-9]/g, '-');
  const filePath = path.join(__dirname, '..', 'src', 'data', 'sections', 'mlb', `${fileName}.ts`);
  
  // Skip if already has comprehensive sections
  if (COMPLETED_MLB.includes(fileName)) {
    console.log(`  ✓ Skipping ${stadium.name} (already comprehensive)`);
    return;
  }
  
  // Check if file exists and has enough sections
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sectionCount = (content.match(/id:/g) || []).length;
    if (sectionCount >= 40) {
      console.log(`  ✓ ${stadium.name} already has ${sectionCount} sections`);
      return;
    }
  }
  
  console.log(`  → Generating comprehensive sections for ${stadium.name}...`);
  const fileContent = generateSectionFile(
    stadium.name,
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'MLB'
  );
  
  // Write file
  fs.writeFileSync(filePath, fileContent);
  console.log(`    ✓ Created ${fileName}.ts with comprehensive sections`);
});

// Process MiLB stadiums
console.log('\nProcessing MiLB stadiums...');

// AAA
AAA_STADIUMS.forEach(stadium => {
  const fileName = stadium.id;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'sections', 'milb', 'aaa');
  const filePath = path.join(dirPath, `${fileName}.ts`);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  console.log(`  → Generating AAA sections for ${stadium.name}...`);
  const fileContent = generateSectionFile(
    stadium.name,
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'MiLB',
    'AAA'
  );
  
  fs.writeFileSync(filePath, fileContent);
});

// AA
AA_STADIUMS.forEach(stadium => {
  const fileName = stadium.id;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'sections', 'milb', 'aa');
  const filePath = path.join(dirPath, `${fileName}.ts`);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  console.log(`  → Generating AA sections for ${stadium.name}...`);
  const fileContent = generateSectionFile(
    stadium.name,
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'MiLB',
    'AA'
  );
  
  fs.writeFileSync(filePath, fileContent);
});

// HIGH-A
HIGH_A_STADIUMS.forEach(stadium => {
  const fileName = stadium.id;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'sections', 'milb', 'high-a');
  const filePath = path.join(dirPath, `${fileName}.ts`);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  console.log(`  → Generating High-A sections for ${stadium.name}...`);
  const fileContent = generateSectionFile(
    stadium.name,
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'MiLB',
    'High-A'
  );
  
  fs.writeFileSync(filePath, fileContent);
});

// LOW-A
LOW_A_STADIUMS.forEach(stadium => {
  const fileName = stadium.id;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'sections', 'milb', 'low-a');
  const filePath = path.join(dirPath, `${fileName}.ts`);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  console.log(`  → Generating Low-A sections for ${stadium.name}...`);
  const fileContent = generateSectionFile(
    stadium.name,
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'MiLB',
    'Low-A'
  );
  
  fs.writeFileSync(filePath, fileContent);
});

// Process NFL stadiums
console.log('\nProcessing NFL stadiums...');
NFL_STADIUMS.forEach(stadium => {
  const fileName = stadium.id;
  const dirPath = path.join(__dirname, '..', 'src', 'data', 'sections', 'nfl');
  const filePath = path.join(dirPath, `${fileName}.ts`);
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Skip if already exists
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sectionCount = (content.match(/id:/g) || []).length;
    if (sectionCount >= 50) {
      console.log(`  ✓ ${stadium.name} already has ${sectionCount} sections`);
      return;
    }
  }
  
  console.log(`  → Generating NFL sections for ${stadium.name}...`);
  const fileContent = generateSectionFile(
    stadium.name,
    stadium.id,
    stadium.orientation,
    stadium.capacity,
    'NFL'
  );
  
  fs.writeFileSync(filePath, fileContent);
});

console.log('\n✅ Section generation complete!');
console.log('All stadiums now have comprehensive sections with accurate 3D geometry.');