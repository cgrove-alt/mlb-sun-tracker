const fs = require('fs');
const path = require('path');

// Files to process
const filesToClean = [
  'src/utils/sunCalculator.ts',
  'src/utils/sunCalculations.ts',
  'src/utils/apiCache.ts',
  'src/utils/pwa.ts',
  'src/utils/serviceWorkerRegistration.ts',
  'src/components/GameSelector.tsx',
  'src/components/StadiumHeader/StadiumHeader.tsx',
  'src/components/UnifiedGameSelector.tsx',
  'src/components/ComprehensiveStadiumGuide.tsx',
  'src/components/StadiumVisualizationSection.tsx',
  'src/components/WeatherDisplay.tsx',
  'src/components/OfflineIndicator.tsx',
  'src/data/milbVenueLayouts.ts',
  'src/services/nflApi.ts',
];

// Patterns to remove (debug logs only, keep error/warn)
const debugPatterns = [
  /console\.log\([^)]*\);?\s*\n/g,
  /console\.log\(/g,  // For multiline
];

let totalRemoved = 0;
let filesModified = 0;

filesToClean.forEach(file => {
  const filePath = path.join(__dirname, '..', file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalLength = content.length;
  const originalLines = content.split('\n').length;

  // Count console.log occurrences
  const logCount = (content.match(/console\.log/g) || []).length;

  if (logCount === 0) {
    console.log(`✓ ${file} - no debug logs found`);
    return;
  }

  // Remove single-line console.log statements
  content = content.replace(/^\s*console\.log\([^)]*\);?\s*$/gm, '');

  // Remove console.log from multi-line statements (more complex)
  const lines = content.split('\n');
  const cleanedLines = [];
  let inConsoleLog = false;
  let bracketCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if line starts console.log
    if (trimmed.startsWith('console.log(')) {
      inConsoleLog = true;
      bracketCount = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;

      // Check if it ends on same line
      if (bracketCount === 0 && trimmed.endsWith(');')) {
        inConsoleLog = false;
        continue; // Skip this line
      }
      continue; // Skip start of multiline
    }

    // If we're in a console.log, track brackets
    if (inConsoleLog) {
      bracketCount += (line.match(/\(/g) || []).length;
      bracketCount -= (line.match(/\)/g) || []).length;

      if (bracketCount <= 0) {
        inConsoleLog = false;
      }
      continue; // Skip lines inside console.log
    }

    cleanedLines.push(line);
  }

  content = cleanedLines.join('\n');

  // Remove excess blank lines (more than 2 consecutive)
  content = content.replace(/\n\n\n+/g, '\n\n');

  const newLines = content.split('\n').length;
  const removed = originalLines - newLines;

  if (removed > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ ${file} - removed ${logCount} debug log${logCount !== 1 ? 's' : ''} (${removed} lines)`);
    totalRemoved += logCount;
    filesModified++;
  }
});

console.log(`\n✓ Cleanup complete!`);
console.log(`  Files modified: ${filesModified}`);
console.log(`  Debug logs removed: ${totalRemoved}`);
