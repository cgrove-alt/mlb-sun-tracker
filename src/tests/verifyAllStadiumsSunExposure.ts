import { MLB_STADIUMS } from '../data/stadiums';
import { getStadiumSections } from '../data/stadiumSections';
import { SunCalculator } from '../utils/sunCalculator';

interface StadiumIssue {
  stadium: string;
  issue: string;
  details: string;
}

// Comprehensive test of sun exposure calculations for all stadiums
function verifyAllStadiumsSunExposure() {
  const issues: StadiumIssue[] = [];
  const testDate = '2024-06-21'; // Summer solstice
  const testTime = '13:00'; // 1 PM
  
  console.log('=== Verifying Sun Exposure Calculations for All MLB Stadiums ===\n');
  
  MLB_STADIUMS.forEach(stadium => {
    console.log(`\nChecking ${stadium.name}...`);
    
    const sections = getStadiumSections(stadium.id);
    const calculator = new SunCalculator(stadium);
    const gameDateTime = new Date(`${testDate}T${testTime}:00`);
    
    // Get sun position
    const sunPos = calculator.calculateSunPosition(testDate, testTime);
    console.log(`  Sun position: alt=${sunPos.altitude.toFixed(1)}°, az=${sunPos.azimuth.toFixed(1)}°`);
    console.log(`  Stadium orientation: ${stadium.orientation}°`);
    console.log(`  Roof type: ${stadium.roof}`);
    
    // Track statistics
    let coveredSections = 0;
    let coveredWithSunExposure = 0;
    let sectionsOver100 = 0;
    let sectionsWithNegative = 0;
    const exposureRanges = {
      '0%': 0,
      '1-20%': 0,
      '21-50%': 0,
      '51-80%': 0,
      '81-99%': 0,
      '100%': 0
    };
    
    // Calculate exposure for each section
    sections.forEach(section => {
      const sectionWithGeometry = {
        ...section,
        side: 'home' as const,
        angle: section.baseAngle || 0,
        depth: 50
      };
      
      const exposure = calculator.calculateTimeInSun(sectionWithGeometry, gameDateTime, 3);
      
      // Check for issues
      if (exposure.percentage < 0) {
        sectionsWithNegative++;
        issues.push({
          stadium: stadium.name,
          issue: 'Negative exposure',
          details: `Section ${section.name} has ${exposure.percentage}% exposure`
        });
      }
      
      if (exposure.percentage > 100) {
        sectionsOver100++;
        issues.push({
          stadium: stadium.name,
          issue: 'Over 100% exposure',
          details: `Section ${section.name} has ${exposure.percentage}% exposure`
        });
      }
      
      if (section.covered) {
        coveredSections++;
        if (exposure.percentage > 0) {
          coveredWithSunExposure++;
          issues.push({
            stadium: stadium.name,
            issue: 'Covered section with sun',
            details: `Section ${section.name} is covered but has ${exposure.percentage}% exposure`
          });
        }
      }
      
      // Track exposure distribution
      if (exposure.percentage === 0) {
        exposureRanges['0%']++;
      } else if (exposure.percentage <= 20) {
        exposureRanges['1-20%']++;
      } else if (exposure.percentage <= 50) {
        exposureRanges['21-50%']++;
      } else if (exposure.percentage <= 80) {
        exposureRanges['51-80%']++;
      } else if (exposure.percentage < 100) {
        exposureRanges['81-99%']++;
      } else {
        exposureRanges['100%']++;
      }
    });
    
    // Report statistics
    console.log(`  Total sections: ${sections.length}`);
    console.log(`  Covered sections: ${coveredSections}`);
    if (coveredWithSunExposure > 0) {
      console.log(`  ⚠️  Covered sections with sun: ${coveredWithSunExposure}`);
    }
    
    console.log('  Exposure distribution:');
    Object.entries(exposureRanges).forEach(([range, count]) => {
      if (count > 0) {
        console.log(`    ${range}: ${count} sections`);
      }
    });
    
    // Check for logical issues
    if (stadium.roof === 'fixed' && exposureRanges['0%'] !== sections.length) {
      issues.push({
        stadium: stadium.name,
        issue: 'Fixed roof stadium with sun exposure',
        details: `${sections.length - exposureRanges['0%']} sections have sun despite fixed roof`
      });
    }
    
    // Check if day game has reasonable sun distribution
    if (sunPos.altitude > 0 && stadium.roof === 'open') {
      const shadedSections = exposureRanges['0%'] + exposureRanges['1-20%'];
      if (shadedSections === 0) {
        issues.push({
          stadium: stadium.name,
          issue: 'No shaded sections during day game',
          details: 'Open stadium has no sections with <20% exposure at 1 PM'
        });
      }
    }
  });
  
  // Report all issues
  console.log('\n\n=== SUMMARY OF ISSUES ===');
  if (issues.length === 0) {
    console.log('✅ No issues found! All stadiums have valid sun exposure calculations.');
  } else {
    console.log(`❌ Found ${issues.length} issues:\n`);
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.stadium} - ${issue.issue}`);
      console.log(`   ${issue.details}`);
    });
  }
  
  return issues;
}

// Run the verification
const issues = verifyAllStadiumsSunExposure();
process.exit(issues.length > 0 ? 1 : 0);