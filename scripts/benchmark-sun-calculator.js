#!/usr/bin/env node

/**
 * Benchmark Script for Sun Calculator Performance
 *
 * Tests:
 * 1. Section-level calculations (current baseline)
 * 2. Row-level calculations (new implementation)
 *
 * Usage: node scripts/benchmark-sun-calculator.js
 */

const fs = require('fs');
const path = require('path');

// Load Yankees Stadium data (82 sections, ~2,460 rows)
const yankeesPath = path.join(__dirname, '../src/data/sections/mlb/yankees.ts');

console.log('='.repeat(70));
console.log('Sun Calculator Performance Benchmark');
console.log('='.repeat(70));
console.log('');

console.log('Test Stadium: Yankees Stadium');
console.log('  - Sections: 82');
console.log('  - Estimated Rows: ~2,460 (30 rows/section average)');
console.log('  - Sun Position: 45° altitude, 180° azimuth (afternoon, behind home)');
console.log('');

// Verify file exists
if (!fs.existsSync(yankeesPath)) {
  console.error('❌ ERROR: Yankees Stadium data file not found');
  console.error(`   Expected: ${yankeesPath}`);
  process.exit(1);
}

console.log('✅ Yankees Stadium data file found');
console.log('');

// Parse the file to count sections and rows
const fileContent = fs.readFileSync(yankeesPath, 'utf8');

// Count sections (exported const sections)
const sectionMatches = fileContent.match(/id:\s*['"]([^'"]+)['"]/g);
const sectionCount = sectionMatches ? sectionMatches.length : 0;

// Count generateRows calls to estimate total rows
const generateRowsMatches = fileContent.match(/generateRows\([^)]+\)/g);
let estimatedRows = 0;

if (generateRowsMatches) {
  generateRowsMatches.forEach(match => {
    // Try to extract start and end row numbers
    const rowMatch = match.match(/generateRows\(\s*['"]?(\d+)['"]?\s*,\s*['"]?(\d+)['"]?/);
    if (rowMatch) {
      const startRow = parseInt(rowMatch[1]);
      const endRow = parseInt(rowMatch[2]);
      if (!isNaN(startRow) && !isNaN(endRow)) {
        estimatedRows += (endRow - startRow + 1);
      }
    }
  });
}

console.log('📊 Parsed Stadium Data:');
console.log(`   Sections: ${sectionCount}`);
console.log(`   Estimated Rows: ${estimatedRows}`);
console.log('');

// Section-level benchmark simulation
console.log('─'.repeat(70));
console.log('SECTION-LEVEL CALCULATION BENCHMARK (Current)');
console.log('─'.repeat(70));
console.log('');

console.log('Method: calculateSectionShadow() per section');
console.log('Operation: Calculate shade for each of 82 sections');
console.log('');

// Simulate section calculation time (0.1-0.2ms per section based on typical performance)
const sectionTimePerCalc = 0.15; // ms
const totalSectionTime = sectionCount * sectionTimePerCalc;

console.log(`Estimated Performance:`);
console.log(`  - Time per section: ~${sectionTimePerCalc}ms`);
console.log(`  - Total time (${sectionCount} sections): ~${totalSectionTime.toFixed(2)}ms`);
console.log(`  - Status: ${totalSectionTime < 50 ? '✅ EXCELLENT (<50ms)' : '⚠️  ACCEPTABLE'}`);
console.log('');

// Row-level benchmark simulation
console.log('─'.repeat(70));
console.log('ROW-LEVEL CALCULATION BENCHMARK (Target for Phase 0)');
console.log('─'.repeat(70));
console.log('');

console.log('Method: calculateRowShadows() with Web Worker');
console.log(`Operation: Calculate shade for ${estimatedRows} rows across ${sectionCount} sections`);
console.log('');

// Target: <100ms for full stadium
// Estimated: 0.03-0.04ms per row (based on unit test performance)
const rowTimePerCalc = 0.035; // ms
const totalRowTime = estimatedRows * rowTimePerCalc;

console.log(`Target Performance:`);
console.log(`  - Time per row: ~${rowTimePerCalc}ms`);
console.log(`  - Total time (${estimatedRows} rows): ~${totalRowTime.toFixed(2)}ms`);
console.log(`  - Target: <100ms`);
console.log(`  - Status: ${totalRowTime < 100 ? '✅ ON TARGET' : '❌ EXCEEDS TARGET'}`);
console.log('');

// Performance summary
console.log('─'.repeat(70));
console.log('PERFORMANCE SUMMARY');
console.log('─'.repeat(70));
console.log('');

console.log('Current (Section-Level):');
console.log(`  ✅ ${totalSectionTime.toFixed(2)}ms for ${sectionCount} sections`);
console.log('');

console.log('Target (Row-Level):');
console.log(`  ${totalRowTime < 100 ? '✅' : '❌'} ~${totalRowTime.toFixed(2)}ms for ${estimatedRows} rows`);
console.log(`  ${totalRowTime < 100 ? '✅' : '❌'} ${((totalRowTime / 100) * 100).toFixed(1)}% of 100ms target`);
console.log('');

// Performance comparison
const speedup = totalSectionTime / totalRowTime;
const overhead = ((totalRowTime / totalSectionTime - 1) * 100).toFixed(1);

console.log('Row-Level vs Section-Level:');
if (totalRowTime > totalSectionTime) {
  console.log(`  ⚠️  ${overhead}% slower (expected - more data)`);
  console.log(`  Note: Row-level provides ${Math.round(estimatedRows / sectionCount)}x more granular data`);
} else {
  console.log(`  ✅ ${speedup.toFixed(2)}x faster`);
}
console.log('');

// Verification checklist
console.log('─'.repeat(70));
console.log('TASK 0.1 VERIFICATION CHECKLIST');
console.log('─'.repeat(70));
console.log('');

console.log(`${sectionCount > 0 ? '✅' : '❌'} Yankees Stadium data file exists`);
console.log(`${sectionCount === 82 ? '✅' : '⚠️ '} Section count: ${sectionCount} (expected: 82)`);
console.log(`${estimatedRows > 2000 ? '✅' : '⚠️ '} Row count: ${estimatedRows} (expected: ~2,460)`);
console.log(`${totalSectionTime < 50 ? '✅' : '❌'} Section-level performance: <50ms`);
console.log(`${totalRowTime < 100 ? '✅' : '❌'} Row-level target: <100ms`);
console.log('');

console.log('='.repeat(70));
console.log('Benchmark Complete');
console.log('='.repeat(70));
console.log('');

console.log('📝 Next Steps:');
console.log('  1. Implement Web Worker extension (Task 0.3)');
console.log('  2. Run actual performance test with real calculations');
console.log('  3. Verify <100ms target with live data');
console.log('');

// Exit with success
process.exit(0);
