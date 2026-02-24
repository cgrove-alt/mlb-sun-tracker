#!/usr/bin/env node

/**
 * Smoke Test for Web Worker Row Shadow Calculations
 * 
 * Tests the row calculation functions from the worker file
 * by simulating worker message handling.
 * 
 * Usage: node scripts/smoke-test-worker.js
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('Web Worker Row Shadow Calculation - Smoke Test');
console.log('='.repeat(70));
console.log('');

// Load and evaluate the worker file in Node.js context
const workerPath = path.join(__dirname, '../public/workers/sunCalculations.worker.js');

if (!fs.existsSync(workerPath)) {
  console.error('❌ ERROR: Worker file not found');
  console.error(`   Expected: ${workerPath}`);
  process.exit(1);
}

console.log('✅ Worker file found');
console.log('');

// Read the worker file
const workerCode = fs.readFileSync(workerPath, 'utf8');

// Extract just the calculation functions (not the addEventListener part)
// We'll evaluate them in a sandboxed context
const functionRegex = /function (calculateRowShadow|calculateOverhangShadow|calculateUpperDeckShadowForRow|calculateRowShadows)\([^)]*\)\s*{/g;
const matches = workerCode.match(functionRegex);

if (!matches || matches.length < 4) {
  console.error('❌ ERROR: Expected 4 calculation functions, found:', matches ? matches.length : 0);
  process.exit(1);
}

console.log('✅ Found 4 row calculation functions:');
console.log('   - calculateRowShadow()');
console.log('   - calculateOverhangShadow()');
console.log('   - calculateUpperDeckShadowForRow()');
console.log('   - calculateRowShadows()');
console.log('');

// Create a minimal self object for the worker context
const self = {
  addEventListener: () => {},
  postMessage: () => {}
};

// Evaluate the worker code in a controlled context
try {
  eval(workerCode);
  console.log('✅ Worker code evaluated successfully (no syntax errors)');
  console.log('');
} catch (error) {
  console.error('❌ ERROR: Worker code evaluation failed');
  console.error(error.message);
  process.exit(1);
}

// Test 1: Calculate shadow for a single row
console.log('Test 1: Single row shadow calculation');
console.log('-'.repeat(70));

const testRow = {
  rowNumber: '10',
  seats: 20,
  elevation: 30,
  depth: 28,
  covered: false,
  overhangHeight: 15
};

const testSection = {
  id: 'test-101',
  name: 'Section 101',
  level: 'lower',
  baseAngle: 180,
  height: 20,
  covered: false,
  rows: [testRow]
};

try {
  const result = calculateRowShadow(testRow, testSection, 45, 180, 0);
  
  if (!result || typeof result !== 'object') {
    throw new Error('Invalid result format');
  }
  
  if (!result.hasOwnProperty('coverage') || !result.hasOwnProperty('sunExposure')) {
    throw new Error('Missing required properties');
  }
  
  console.log('  Row Number:', result.rowNumber);
  console.log('  Coverage:', result.coverage + '%');
  console.log('  Sun Exposure:', result.sunExposure + '%');
  console.log('  In Shadow:', result.inShadow);
  console.log('  Recommendation:', result.recommendation);
  console.log('  Shadow Sources:', JSON.stringify(result.shadowSources));
  console.log('✅ Single row calculation successful');
  console.log('');
} catch (error) {
  console.error('❌ Single row calculation failed:', error.message);
  process.exit(1);
}

// Test 2: Calculate shadows for multiple rows
console.log('Test 2: Section with multiple rows');
console.log('-'.repeat(70));

const multiRowSection = {
  id: 'test-102',
  name: 'Section 102',
  level: 'lower',
  baseAngle: 180,
  height: 20,
  covered: false,
  rows: [
    { rowNumber: '1', seats: 20, elevation: 10, depth: 5, covered: false, overhangHeight: 15 },
    { rowNumber: '5', seats: 20, elevation: 20, depth: 14, covered: false, overhangHeight: 15 },
    { rowNumber: '10', seats: 20, elevation: 30, depth: 28, covered: false, overhangHeight: 15 },
    { rowNumber: '15', seats: 20, elevation: 45, depth: 42, covered: false, overhangHeight: 15 },
    { rowNumber: '20', seats: 20, elevation: 60, depth: 56, covered: false, overhangHeight: 15 }
  ]
};

try {
  const result = calculateRowShadows(multiRowSection, 45, 180, 0);
  
  if (!result || typeof result !== 'object') {
    throw new Error('Invalid result format');
  }
  
  if (!Array.isArray(result.rows) || result.rows.length !== 5) {
    throw new Error('Expected 5 row results');
  }
  
  console.log('  Section:', result.sectionName);
  console.log('  Rows Calculated:', result.rows.length);
  console.log('  Average Coverage:', result.averageCoverage + '%');
  console.log('  Best Rows:', result.bestRows.join(', '));
  console.log('  Worst Rows:', result.worstRows.join(', '));
  console.log('');
  console.log('  Row-by-Row Results:');
  result.rows.forEach(row => {
    console.log(`    Row ${row.rowNumber}: ${row.coverage}% shade (${row.recommendation})`);
  });
  console.log('✅ Multi-row calculation successful');
  console.log('');
} catch (error) {
  console.error('❌ Multi-row calculation failed:', error.message);
  process.exit(1);
}

// Test 3: Edge cases
console.log('Test 3: Edge cases');
console.log('-'.repeat(70));

try {
  // Covered row
  const coveredRow = { rowNumber: '1', seats: 20, elevation: 10, depth: 5, covered: true, overhangHeight: 0 };
  const coveredResult = calculateRowShadow(coveredRow, testSection, 45, 180, 0);
  if (coveredResult.coverage !== 100) {
    throw new Error('Covered row should have 100% coverage');
  }
  console.log('  ✅ Covered row: 100% shade');
  
  // Sun at horizon
  const horizonResult = calculateRowShadow(testRow, testSection, 0, 180, 0);
  if (typeof horizonResult.coverage !== 'number') {
    throw new Error('Invalid coverage for sun at horizon');
  }
  console.log('  ✅ Sun at horizon: Handled correctly');
  
  // Section with no rows
  const emptySection = { ...testSection, rows: [] };
  const emptyResult = calculateRowShadows(emptySection, 45, 180, 0);
  if (emptyResult.rows.length !== 0) {
    throw new Error('Empty section should return empty rows array');
  }
  console.log('  ✅ Empty section: Handled correctly');
  
  console.log('✅ All edge cases passed');
  console.log('');
} catch (error) {
  console.error('❌ Edge case test failed:', error.message);
  process.exit(1);
}

// Summary
console.log('='.repeat(70));
console.log('✅ ALL TESTS PASSED - Worker is ready for use');
console.log('='.repeat(70));
console.log('');
console.log('Worker File Stats:');
const lines = workerCode.split('\n').length;
console.log(`  - Total Lines: ${lines}`);
console.log(`  - Original Size: 65 lines`);
console.log(`  - Growth: +${lines - 65} lines (${Math.round(((lines - 65) / 65) * 100)}%)`);
console.log('');
