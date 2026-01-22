#!/usr/bin/env node

/**
 * Integration Test: Hook ↔ Worker API Contract Validation
 *
 * Validates that the worker accepts the exact payload format sent by the hook.
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('INTEGRATION TEST: Hook ↔ Worker API Contract');
console.log('='.repeat(70));
console.log('');

// Read both files
const hookPath = path.join(__dirname, '../src/hooks/useSunCalculations.ts');
const workerPath = path.join(__dirname, '../public/workers/sunCalculations.worker.js');

const hookCode = fs.readFileSync(hookPath, 'utf8');
const workerCode = fs.readFileSync(workerPath, 'utf8');

console.log('Analyzing API contract...');
console.log('');

let errors = 0;

// Test 1: Hook sends correct message type
console.log('TEST 1: Hook sends CALCULATE_ROW_SHADOWS message');
const hookSendsRowShadows = hookCode.includes("type: 'CALCULATE_ROW_SHADOWS'");
if (hookSendsRowShadows) {
  console.log('  ✅ Hook sends CALCULATE_ROW_SHADOWS message type');
} else {
  console.log('  ❌ Hook does not send CALCULATE_ROW_SHADOWS message type');
  errors++;
}
console.log('');

// Test 2: Hook sends sections (plural)
console.log('TEST 2: Hook payload structure');
const hookPayloadMatch = hookCode.match(/postMessage\s*\(\s*\{[^}]*type:\s*'CALCULATE_ROW_SHADOWS'[^}]*payload:\s*\{([^}]+)\}/s);
if (hookPayloadMatch) {
  const payloadContent = hookPayloadMatch[1];

  if (payloadContent.includes('sections')) {
    console.log('  ✅ Hook sends "sections" (plural array)');
  } else {
    console.log('  ❌ Hook does not send "sections"');
    errors++;
  }

  if (payloadContent.includes('sunPosition')) {
    console.log('  ✅ Hook sends "sunPosition" (object)');
  } else {
    console.log('  ❌ Hook does not send "sunPosition"');
    errors++;
  }

  if (payloadContent.includes('stadium')) {
    console.log('  ✅ Hook sends "stadium" (object)');
  } else {
    console.log('  ❌ Hook does not send "stadium"');
    errors++;
  }
} else {
  console.log('  ❌ Could not parse hook payload structure');
  errors++;
}
console.log('');

// Test 3: Worker expects correct structure
console.log('TEST 3: Worker payload extraction');
const workerPayloadMatch = workerCode.match(/type\s*===\s*'CALCULATE_ROW_SHADOWS'[\s\S]*?const\s*\{([^}]+)\}\s*=\s*payload/);
if (workerPayloadMatch) {
  const workerExpects = workerPayloadMatch[1].trim();

  if (workerExpects.includes('sections')) {
    console.log('  ✅ Worker expects "sections"');
  } else {
    console.log('  ❌ Worker expects different structure (not "sections")');
    console.log(`     Worker destructures: ${workerExpects}`);
    errors++;
  }

  if (workerExpects.includes('sunPosition')) {
    console.log('  ✅ Worker expects "sunPosition"');
  } else {
    console.log('  ❌ Worker expects different structure (not "sunPosition")');
    errors++;
  }

  if (workerExpects.includes('stadium')) {
    console.log('  ✅ Worker expects "stadium"');
  } else {
    console.log('  ❌ Worker expects different structure (not "stadium")');
    errors++;
  }
} else {
  console.log('  ❌ Could not parse worker payload extraction');
  errors++;
}
console.log('');

// Test 4: Worker processes array
console.log('TEST 4: Worker processes multiple sections');
const workerProcessesArray = workerCode.match(/sections\.map\s*\(/);
if (workerProcessesArray) {
  console.log('  ✅ Worker uses sections.map() to process array');
} else {
  console.log('  ❌ Worker does not use sections.map() - may only handle single section');
  errors++;
}
console.log('');

// Test 5: Worker returns array
console.log('TEST 5: Worker returns array of results');
const workerReturnsArray = workerCode.match(/type:\s*'ROW_SHADOWS_RESULT'[\s\S]{0,100}payload:\s*results/);
if (workerReturnsArray) {
  console.log('  ✅ Worker returns results array in payload');
} else {
  console.log('  ❌ Worker may return single result instead of array');
  errors++;
}
console.log('');

// Final verdict
console.log('='.repeat(70));
if (errors === 0) {
  console.log('✅ ALL TESTS PASSED - API CONTRACT IS CORRECT');
  console.log('='.repeat(70));
  console.log('');
  console.log('Summary:');
  console.log('  Hook sends: { sections, sunPosition, stadium }');
  console.log('  Worker expects: { sections, sunPosition, stadium }');
  console.log('  Worker processes: sections.map(...)');
  console.log('  Worker returns: results[] array');
  console.log('');
  console.log('The hook and worker communicate correctly. ✅');
  process.exit(0);
} else {
  console.log(`❌ ${errors} TEST(S) FAILED - API CONTRACT MISMATCH`);
  console.log('='.repeat(70));
  console.log('');
  console.log('The hook and worker have incompatible API contracts.');
  console.log('Runtime errors will occur when using includeRows=true.');
  process.exit(1);
}
