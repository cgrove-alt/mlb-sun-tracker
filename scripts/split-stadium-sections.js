const fs = require('fs');
const path = require('path');

// Read the main file
const mainFile = fs.readFileSync(
  path.join(__dirname, '../src/data/stadiumSections.ts'),
  'utf8'
);

const lines = mainFile.split('\n');

// Extract the type definitions and helper functions (lines 1-34)
const header = lines.slice(0, 34).join('\n');

// Stadium boundaries - each entry is the {  stadiumId: 'x', sections: [...] }, object
// Line numbers are 1-based, array indices are 0-based, so subtract 1
// end is the line with closing },
const stadiums = [
  { id: 'yankees', start: 37 - 1, end: 175 - 1 },
  { id: 'redsox', start: 177 - 1, end: 301 - 1 },
  { id: 'dodgers', start: 303 - 1, end: 465 - 1 },
  { id: 'cubs', start: 467 - 1, end: 640 - 1 },
  { id: 'giants', start: 642 - 1, end: 820 - 1 },
  { id: 'padres', start: 822 - 1, end: 973 - 1 },
  { id: 'rockies', start: 975 - 1, end: 1182 - 1 },
  { id: 'diamondbacks', start: 1184 - 1, end: 1348 - 1 },
  { id: 'rays', start: 1350 - 1, end: 1502 - 1 },
  { id: 'astros', start: 1504 - 1, end: 1600 - 1 },
  { id: 'mariners', start: 1602 - 1, end: 1781 - 1 },
  { id: 'rangers', start: 1783 - 1, end: 1976 - 1 },
  { id: 'brewers', start: 1978 - 1, end: 2176 - 1 },
  { id: 'bluejays', start: 2178 - 1, end: 2364 - 1 },
  { id: 'marlins', start: 2366 - 1, end: 2529 - 1 },
  { id: 'orioles', start: 2531 - 1, end: 2686 - 1 },
  { id: 'phillies', start: 2688 - 1, end: 2862 - 1 },
  { id: 'nationals', start: 2864 - 1, end: 3050 - 1 },
  { id: 'mets', start: 3052 - 1, end: 3234 - 1 },
  { id: 'braves', start: 3236 - 1, end: 3420 - 1 },
  { id: 'cardinals', start: 3422 - 1, end: 3608 - 1 },
  { id: 'whitesox', start: 3610 - 1, end: 3784 - 1 },
  { id: 'reds', start: 3786 - 1, end: 3963 - 1 },
  { id: 'guardians', start: 3965 - 1, end: 4151 - 1 },
  { id: 'tigers', start: 4153 - 1, end: 4383 - 1 },
  { id: 'royals', start: 4385 - 1, end: 4620 - 1 },
  { id: 'twins', start: 4622 - 1, end: 4852 - 1 },
  { id: 'pirates', start: 4854 - 1, end: 5088 - 1 },
  { id: 'angels', start: 5090 - 1, end: 5218 - 1 },
  { id: 'athletics', start: 5220 - 1, end: 5279 - 1 }
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

  // Create the file content
  const content = `${header}

export const stadiumSections = ${stadiumData};
`;

  // Write to file
  const filePath = path.join(outputDir, `${stadium.id}.ts`);
  fs.writeFileSync(filePath, content);
  console.log(`✓ Created ${stadium.id}.ts`);
});

console.log(`\n✅ Split ${stadiums.length} stadiums into individual files`);
