import * as fs from 'fs';
import * as path from 'path';

// Read the nflSections.ts file
const sectionsPath = path.join(__dirname, '../src/data/nflSections.ts');
let sectionsContent = fs.readFileSync(sectionsPath, 'utf-8');

// ID mappings from old to new
const idMappings: Record<string, string> = {
  'cleveland-browns-stadium': 'huntington-bank-field',
  'tiaa-bank-field': 'everbank-stadium',
  'arrowhead-stadium': 'geha-field-arrowhead',
  'fedexfield': 'northwest-stadium',
  'metlife-stadium': 'metlife-stadium-jets', // Keep the Jets version
  // 'metlife-stadium-giants' stays the same
};

// Apply the mappings
for (const [oldId, newId] of Object.entries(idMappings)) {
  const regex = new RegExp(`'${oldId}'`, 'g');
  sectionsContent = sectionsContent.replace(regex, `'${newId}'`);
}

// Write back the updated content
fs.writeFileSync(sectionsPath, sectionsContent);

console.log('✅ Updated stadium IDs in nflSections.ts');
console.log('Applied mappings:');
for (const [oldId, newId] of Object.entries(idMappings)) {
  console.log(`  ${oldId} → ${newId}`);
}