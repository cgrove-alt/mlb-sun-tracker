import { MLB_STADIUMS } from '../data/stadiums';
import { getStadiumSections } from '../data/stadiumSections';
import { SunCalculator } from '../utils/sunCalculator';

// Test Yankee Stadium specifically
const yankees = MLB_STADIUMS.find(s => s.id === 'yankees')!;
const sections = getStadiumSections('yankees');
const calculator = new SunCalculator(yankees);

// Test 1PM game
const gameDateTime = new Date('2024-06-21T13:00:00');
console.log('=== Yankee Stadium - June 21, 1 PM ===\n');

const exposures = sections.map(section => {
  const sectionWithGeometry = {
    ...section,
    side: 'home' as const,
    angle: section.baseAngle || 0,
    depth: 50
  };
  
  const result = calculator.calculateTimeInSun(sectionWithGeometry, gameDateTime, 3);
  return {
    name: section.name,
    level: section.level,
    covered: section.covered,
    exposure: result.percentage
  };
});

// Sort by exposure
exposures.sort((a, b) => a.exposure - b.exposure);

// Show sections with <20% exposure
const lowExposure = exposures.filter(e => e.exposure < 20);
console.log(`Sections with <20% exposure: ${lowExposure.length}`);
console.log('\nSamples:');
lowExposure.slice(0, 10).forEach(s => {
  console.log(`  ${s.name} (${s.level}${s.covered ? ', covered' : ''}): ${s.exposure.toFixed(1)}%`);
});

// Show distribution
const ranges = {
  '0%': exposures.filter(e => e.exposure === 0).length,
  '1-20%': exposures.filter(e => e.exposure > 0 && e.exposure <= 20).length,
  '21-50%': exposures.filter(e => e.exposure > 20 && e.exposure <= 50).length,
  '51-80%': exposures.filter(e => e.exposure > 50 && e.exposure <= 80).length,
  '81-99%': exposures.filter(e => e.exposure > 80 && e.exposure < 100).length,
  '100%': exposures.filter(e => e.exposure === 100).length
};

console.log('\nExposure distribution:');
Object.entries(ranges).forEach(([range, count]) => {
  console.log(`  ${range}: ${count} sections`);
});