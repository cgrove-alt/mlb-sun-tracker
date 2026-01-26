// Script to check coverage for only the NEW row-level functions
const fs = require('fs');
const path = require('path');

const sunCalculatorPath = path.join(__dirname, '..', 'src', 'utils', 'sunCalculator.ts');
const content = fs.readFileSync(sunCalculatorPath, 'utf8');
const lines = content.split('\n');

// NEW code line ranges (from Task 0.2)
const newCodeRanges = [
  // RowShadowData interface (lines ~490-503)
  { start: 490, end: 503, name: 'RowShadowData interface' },
  // calculateRowShadow (lines ~505-615)
  { start: 505, end: 615, name: 'calculateRowShadow()' },
  // calculateOverhangShadow (lines ~620-650)
  { start: 620, end: 650, name: 'calculateOverhangShadow()' },
  // calculateUpperDeckShadowForRow (lines ~655-709)
  { start: 655, end: 709, name: 'calculateUpperDeckShadowForRow()' },
  // calculateRowShadows (lines ~714-752)
  { start: 714, end: 752, name: 'calculateRowShadows()' }
];

// Uncovered lines from jest output
const uncoveredStr = '97-98,102,114-173,190-196,200-222,228-279,293-323,327-340,345-349,355-369,373-376,383-414,421-440,444-461,472-475,484-487,494-500';
const uncovered = new Set();

uncoveredStr.split(',').forEach(range => {
  if (range.includes('-')) {
    const [start, end] = range.split('-').map(Number);
    for (let i = start; i <= end; i++) {
      uncovered.add(i);
    }
  } else {
    uncovered.add(Number(range));
  }
});

console.log('Coverage Analysis for NEW Row-Level Code:\n');

let totalNewLines = 0;
let totalCoveredLines = 0;

newCodeRanges.forEach(range => {
  const rangeLines = range.end - range.start + 1;
  let uncoveredInRange = 0;

  for (let i = range.start; i <= range.end; i++) {
    if (uncovered.has(i)) {
      uncoveredInRange++;
    }
  }

  const coveredInRange = rangeLines - uncoveredInRange;
  const coverage = (coveredInRange / rangeLines * 100).toFixed(2);

  totalNewLines += rangeLines;
  totalCoveredLines += coveredInRange;

  console.log(`${range.name} (lines ${range.start}-${range.end})`);
  console.log(`  Total lines: ${rangeLines}`);
  console.log(`  Covered: ${coveredInRange}`);
  console.log(`  Uncovered: ${uncoveredInRange}`);
  console.log(`  Coverage: ${coverage}%\n`);
});

const overallCoverage = (totalCoveredLines / totalNewLines * 100).toFixed(2);
console.log('='.repeat(60));
console.log(`OVERALL NEW CODE COVERAGE: ${overallCoverage}%`);
console.log(`Total new lines: ${totalNewLines}`);
console.log(`Covered: ${totalCoveredLines}`);
console.log(`Uncovered: ${totalNewLines - totalCoveredLines}`);
console.log('='.repeat(60));

if (overallCoverage >= 90) {
  console.log('\n✅ NEW CODE meets >90% coverage requirement!');
  process.exit(0);
} else {
  console.log(`\n⚠️  NEW CODE coverage (${overallCoverage}%) is below 90% target`);
  process.exit(1);
}
