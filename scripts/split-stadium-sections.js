const fs = require('fs');
const path = require('path');

// Read the main file
const mainFile = fs.readFileSync(
  path.join(__dirname, '../src/data/stadiumSections.ts'),
  'utf8'
);

const lines = mainFile.split('\n');

// Import statement for split files - use types file to avoid bundling data
const importStatement = `import type { StadiumSection } from '../stadiumSectionTypes';`;

// Stadium boundaries - each entry is the {  stadiumId: 'x', sections: [...] }, object
// Line numbers are 1-based, array indices are 0-based, so subtract 1
// Line numbers updated after header refactoring
// Original line 37 (yankees { line) is now at line 26, so offset = -11
// But we need to start one line EARLIER to include the { opening brace
// So start = original_start + offset - 1
// end is the line with closing },
const offset = -12; // Start one line earlier to include opening brace
const stadiums = [
  { id: 'yankees', start: (37 + offset) - 1, end: (175 + offset) - 1 },
  { id: 'redsox', start: (177 + offset) - 1, end: (301 + offset) - 1 },
  { id: 'dodgers', start: (303 + offset) - 1, end: (465 + offset) - 1 },
  { id: 'cubs', start: (467 + offset) - 1, end: (640 + offset) - 1 },
  { id: 'giants', start: (642 + offset) - 1, end: (820 + offset) - 1 },
  { id: 'padres', start: (822 + offset) - 1, end: (973 + offset) - 1 },
  { id: 'rockies', start: (975 + offset) - 1, end: (1182 + offset) - 1 },
  { id: 'diamondbacks', start: (1184 + offset) - 1, end: (1348 + offset) - 1 },
  { id: 'rays', start: (1350 + offset) - 1, end: (1502 + offset) - 1 },
  { id: 'astros', start: (1504 + offset) - 1, end: (1600 + offset) - 1 },
  { id: 'mariners', start: (1602 + offset) - 1, end: (1781 + offset) - 1 },
  { id: 'rangers', start: (1783 + offset) - 1, end: (1976 + offset) - 1 },
  { id: 'brewers', start: (1978 + offset) - 1, end: (2176 + offset) - 1 },
  { id: 'bluejays', start: (2178 + offset) - 1, end: (2364 + offset) - 1 },
  { id: 'marlins', start: (2366 + offset) - 1, end: (2529 + offset) - 1 },
  { id: 'orioles', start: (2531 + offset) - 1, end: (2686 + offset) - 1 },
  { id: 'phillies', start: (2688 + offset) - 1, end: (2862 + offset) - 1 },
  { id: 'nationals', start: (2864 + offset) - 1, end: (3050 + offset) - 1 },
  { id: 'mets', start: (3052 + offset) - 1, end: (3234 + offset) - 1 },
  { id: 'braves', start: (3236 + offset) - 1, end: (3420 + offset) - 1 },
  { id: 'cardinals', start: (3422 + offset) - 1, end: (3608 + offset) - 1 },
  { id: 'whitesox', start: (3610 + offset) - 1, end: (3784 + offset) - 1 },
  { id: 'reds', start: (3786 + offset) - 1, end: (3963 + offset) - 1 },
  { id: 'guardians', start: (3965 + offset) - 1, end: (4151 + offset) - 1 },
  { id: 'tigers', start: (4153 + offset) - 1, end: (4383 + offset) - 1 },
  { id: 'royals', start: (4385 + offset) - 1, end: (4620 + offset) - 1 },
  { id: 'twins', start: (4622 + offset) - 1, end: (4852 + offset) - 1 },
  { id: 'pirates', start: (4854 + offset) - 1, end: (5088 + offset) - 1 },
  { id: 'angels', start: (5090 + offset) - 1, end: (5218 + offset) - 1 },
  { id: 'athletics', start: (5220 + offset) - 1, end: (5279 + offset) - 1 }
];

// Output directory
const outputDir = path.join(__dirname, '../src/data/stadiumSections-split');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Split each stadium
stadiums.forEach(stadium => {
  // Extract the stadium object { stadiumId: 'x', sections: [...] },
  let stadiumLines = lines.slice(stadium.start, stadium.end + 1);

  // Join and clean up
  let stadiumData = stadiumLines.join('\n').trim();

  // Remove trailing comma if present
  if (stadiumData.endsWith('},')) {
    stadiumData = stadiumData.slice(0, -1);
  }

  // Create the file content with import instead of full header
  const content = `${importStatement}

export const stadiumSections = ${stadiumData};
`;

  // Write to file
  const filePath = path.join(outputDir, `${stadium.id}.ts`);
  fs.writeFileSync(filePath, content);
  console.log(`✓ Created ${stadium.id}.ts`);
});

console.log(`\n✅ Split ${stadiums.length} stadiums into individual files`);
