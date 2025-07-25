import { MLB_STADIUMS } from '../data/stadiums';
import { getStadiumSections } from '../data/stadiumSections';
import { SunCalculator } from '../utils/sunCalculator';

// Test sun exposure calculations with more detail
function detailedSunExposureTest() {
  // Test a few stadiums in detail
  const testStadiums = ['yankees', 'dodgers', 'fenway', 'wrigley'];
  
  testStadiums.forEach(stadiumId => {
    const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
    if (!stadium) return;
    
    console.log(`\n=== ${stadium.name} Detailed Analysis ===`);
    console.log(`Orientation: ${stadium.orientation}°, Roof: ${stadium.roof}`);
    
    const sections = getStadiumSections(stadium.id);
    const calculator = new SunCalculator(stadium);
    
    // Test different times and dates
    const scenarios = [
      { date: '2024-04-15', time: '13:00', label: 'April 1PM' },
      { date: '2024-06-21', time: '13:00', label: 'June 1PM' },
      { date: '2024-06-21', time: '16:00', label: 'June 4PM' },
      { date: '2024-08-15', time: '19:00', label: 'August 7PM' }
    ];
    
    scenarios.forEach(scenario => {
      console.log(`\n  ${scenario.label}:`);
      const gameDateTime = new Date(`${scenario.date}T${scenario.time}:00`);
      const sunPos = calculator.calculateSunPosition(scenario.date, scenario.time);
      console.log(`  Sun: alt=${sunPos.altitude.toFixed(1)}°, az=${sunPos.azimuth.toFixed(1)}°`);
      
      // Calculate exposures
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
          baseAngle: section.baseAngle,
          exposure: result.percentage,
          minutes: result.totalMinutes
        };
      });
      
      // Sort by exposure
      exposures.sort((a, b) => a.exposure - b.exposure);
      
      // Show distribution
      const ranges = {
        '0%': 0,
        '1-25%': 0,
        '26-50%': 0,
        '51-75%': 0,
        '76-99%': 0,
        '100%': 0
      };
      
      exposures.forEach(e => {
        if (e.exposure === 0) ranges['0%']++;
        else if (e.exposure <= 25) ranges['1-25%']++;
        else if (e.exposure <= 50) ranges['26-50%']++;
        else if (e.exposure <= 75) ranges['51-75%']++;
        else if (e.exposure < 100) ranges['76-99%']++;
        else ranges['100%']++;
      });
      
      console.log('  Distribution:', Object.entries(ranges)
        .filter(([_, count]) => count > 0)
        .map(([range, count]) => `${range}: ${count}`)
        .join(', '));
      
      // Show some intermediate exposure examples
      const intermediateExamples = exposures.filter(e => e.exposure > 0 && e.exposure < 100);
      if (intermediateExamples.length > 0) {
        console.log('  Partial shade examples:');
        intermediateExamples.slice(0, 5).forEach(e => {
          console.log(`    ${e.name} (${e.level}${e.covered ? ', covered' : ''}): ${e.exposure.toFixed(1)}% (${e.minutes.toFixed(0)} min)`);
        });
      }
      
      // Check covered sections
      const coveredWithSun = exposures.filter(e => e.covered && e.exposure > 0);
      if (coveredWithSun.length > 0) {
        console.log(`  ⚠️  ${coveredWithSun.length} covered sections have sun exposure!`);
      }
    });
  });
}

// Run the test
detailedSunExposureTest();