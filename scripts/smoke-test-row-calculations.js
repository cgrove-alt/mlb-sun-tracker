#!/usr/bin/env node

/**
 * Smoke Test: Row Shadow Calculations
 *
 * Verifies that calculateRowShadow() and calculateRowShadows()
 * can process 30 rows without errors.
 *
 * Usage: node scripts/smoke-test-row-calculations.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('='.repeat(70));
console.log('SMOKE TEST: Row Shadow Calculations');
console.log('='.repeat(70));
console.log('');

console.log('Goal: Verify 30 rows can be calculated without errors');
console.log('');

// Create a simple test file that imports and runs the functions
const testCode = `
import { calculateRowShadow, calculateRowShadows } from '../src/utils/sunCalculator';
import type { RowDetail, DetailedSection } from '../src/types/stadium-complete';

console.log('Creating test data: 30 rows...');

// Generate 30 test rows
const testRows: RowDetail[] = Array.from({ length: 30 }, (_, i) => ({
  rowNumber: String(i + 1),
  seats: 20,
  elevation: 10 + (i * 2.5),
  depth: 2.8 + (i * 2.8),
  covered: false,
  overhangHeight: 15
}));

const testSection: DetailedSection = {
  id: 'smoke-test-section',
  name: 'Test Section 100',
  level: 'lower',
  baseAngle: 180,
  height: 20,
  covered: false,
  rows: testRows
};

console.log('Testing calculateRowShadow() for each row...');

let errors = 0;
let successCount = 0;

// Test each row individually
for (let i = 0; i < testRows.length; i++) {
  try {
    const result = calculateRowShadow(
      testRows[i],
      testSection,
      45,  // sun altitude
      180, // sun azimuth
      0    // stadium orientation
    );

    // Validate result structure
    if (typeof result.coverage !== 'number' ||
        typeof result.sunExposure !== 'number' ||
        typeof result.inShadow !== 'boolean') {
      throw new Error('Invalid result structure');
    }

    if (result.coverage < 0 || result.coverage > 100) {
      throw new Error(\`Invalid coverage: \${result.coverage}\`);
    }

    successCount++;
  } catch (error) {
    console.error(\`❌ Row \${i + 1} failed: \${error.message}\`);
    errors++;
  }
}

console.log(\`Individual row tests: \${successCount}/30 passed\`);

// Test batch calculation
console.log('');
console.log('Testing calculateRowShadows() for all 30 rows...');

try {
  const batchResult = calculateRowShadows(testSection, 45, 180, 0);

  if (batchResult.rows.length !== 30) {
    throw new Error(\`Expected 30 rows, got \${batchResult.rows.length}\`);
  }

  if (typeof batchResult.averageCoverage !== 'number') {
    throw new Error('Invalid averageCoverage');
  }

  console.log('✅ Batch calculation successful');
  console.log(\`   - Rows processed: \${batchResult.rows.length}\`);
  console.log(\`   - Average coverage: \${batchResult.averageCoverage}%\`);
  console.log(\`   - Best rows: \${batchResult.bestRows.join(', ')}\`);
  console.log(\`   - Worst rows: \${batchResult.worstRows.join(', ')}\`);
} catch (error) {
  console.error(\`❌ Batch calculation failed: \${error.message}\`);
  errors++;
}

console.log('');
console.log('='.repeat(70));

if (errors === 0) {
  console.log('✅ SMOKE TEST PASSED: All 30 rows calculated successfully');
  console.log('='.repeat(70));
  process.exit(0);
} else {
  console.log(\`❌ SMOKE TEST FAILED: \${errors} errors\`);
  console.log('='.repeat(70));
  process.exit(1);
}
`;

// Write temporary test file
const fs = require('fs');
const tempTestPath = path.join(__dirname, '../src/utils/__tests__/smoke-test-temp.ts');

console.log('📝 Creating temporary smoke test file...');
fs.writeFileSync(tempTestPath, testCode, 'utf8');

console.log('🔧 Compiling TypeScript and running test...');
console.log('');

try {
  // Use tsx to run the TypeScript file directly
  const result = execSync('npx tsx ' + tempTestPath, {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    stdio: 'inherit'
  });

  // Cleanup
  fs.unlinkSync(tempTestPath);

  console.log('');
  console.log('✅ Smoke test complete - cleanup successful');
} catch (error) {
  // Cleanup even on error
  if (fs.existsSync(tempTestPath)) {
    fs.unlinkSync(tempTestPath);
  }

  console.log('');
  console.error('❌ Smoke test failed');
  process.exit(1);
}
