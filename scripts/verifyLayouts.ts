// Script to verify all MiLB stadiums have venue-specific layouts
import { generateLayoutReport, getLayoutCoverage, validateAllLayouts, getVenuesNeedingLayouts } from '../src/data/venueLayoutIntegration';
import { milbLevelClassifications } from '../src/data/venueCorrections';
import { allVenueLayouts } from '../src/data';

console.log('MiLB Venue Layout Verification\n');
console.log('================================\n');

// Get coverage statistics
const coverage = getLayoutCoverage();
console.log(`Total MiLB Venues: ${coverage.total}`);
console.log(`Venues with Custom Layouts: ${coverage.withCustomLayouts}`);
console.log(`Coverage: ${Math.round(coverage.withCustomLayouts / coverage.total * 100)}%\n`);

// Show coverage by level
console.log('Coverage by Level:');
Object.entries(coverage.byLevel).forEach(([level, stats]) => {
  const percent = Math.round(stats.covered / stats.total * 100);
  console.log(`  ${level}: ${stats.covered}/${stats.total} (${percent}%)`);
});

// Count layouts from each file
const layoutCounts = {
  base: 0,
  extended: 0,
  AAA: 0,
  AA: 0,
  'A+': 0,
  A: 0
};

// Get unique venue IDs from all layouts
const uniqueVenueIds = new Set<string>();
allVenueLayouts.forEach(layout => {
  uniqueVenueIds.add(layout.venueId);
});

console.log(`\nTotal unique layouts created: ${uniqueVenueIds.size}`);

// Validate all layouts
console.log('\nValidation Results:');
const validation = validateAllLayouts();
if (validation.valid) {
  console.log('✅ All layouts are valid!');
} else {
  console.log(`❌ Found ${validation.errors.length} errors:`);
  validation.errors.slice(0, 10).forEach(error => {
    console.log(`  - ${error}`);
  });
  if (validation.errors.length > 10) {
    console.log(`  ... and ${validation.errors.length - 10} more errors`);
  }
}

// Check for missing venues
const needed = getVenuesNeedingLayouts();
if (needed.length === 0) {
  console.log('\n✅ ALL 120 MiLB STADIUMS HAVE CUSTOM LAYOUTS!');
} else {
  console.log(`\n⚠️  ${needed.length} venues still need layouts:`);
  needed.slice(0, 10).forEach(venue => {
    console.log(`  - ${venue.id} (${venue.level})`);
  });
  if (needed.length > 10) {
    console.log(`  ... and ${needed.length - 10} more venues`);
  }
}

// Generate full report
console.log('\nGenerating full report...');
const report = generateLayoutReport();
console.log('\n' + report);