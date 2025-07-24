import { MLB_STADIUMS, Stadium } from '../data/stadiums';
import { getStadiumSections, StadiumSection } from '../data/stadiumSections';
import { getSunPosition, calculateDetailedSectionSunExposure } from '../utils/sunCalculations';

interface TestResult {
  stadiumId: string;
  stadiumName: string;
  roofType: 'open' | 'retractable' | 'fixed';
  totalSections: number;
  coveredSections: number;
  sectionsWithZeroSun: number;
  issues: string[];
}

// Test configuration
const TEST_DATE = new Date('2024-07-15T14:00:00'); // Mid-summer afternoon game
const EXPECTED_COVERED_SECTIONS_WITH_ZERO_SUN_RATIO = 0.95; // 95% of covered sections should show 0% sun

function verifyStadiumShade(stadium: Stadium): TestResult {
  const sections = getStadiumSections(stadium.id);
  const issues: string[] = [];
  
  // Get sun position for test date
  const sunPosition = getSunPosition(TEST_DATE, stadium.latitude, stadium.longitude);
  
  // Calculate sun exposure for all sections
  const sectionSunData = calculateDetailedSectionSunExposure(stadium, sunPosition);
  
  // Count covered sections and sections with zero sun
  const coveredSections = sections.filter(s => s.covered);
  const sectionsWithZeroSun = sectionSunData.filter(s => s.sunExposure === 0);
  const coveredSectionsWithZeroSun = sectionSunData.filter(
    s => s.section.covered && s.sunExposure === 0
  );
  
  // Verify stadiums with fixed roofs
  if (stadium.roof === 'fixed') {
    const nonZeroSections = sectionSunData.filter(s => s.sunExposure > 0);
    if (nonZeroSections.length > 0) {
      issues.push(
        `Fixed roof stadium has ${nonZeroSections.length} sections with sun exposure > 0: ` +
        nonZeroSections.map(s => `${s.section.id} (${s.sunExposure}%)`).join(', ')
      );
    }
  }
  
  // Verify stadiums with retractable roofs
  if (stadium.roof === 'retractable') {
    // For retractable roof stadiums, we expect sections marked as "covered" to show 0% sun
    // when the roof is assumed to be closed
    if (coveredSections.length > 0) {
      const coveredWithSun = sectionSunData.filter(
        s => s.section.covered && s.sunExposure > 0
      );
      if (coveredWithSun.length > 0) {
        issues.push(
          `Retractable roof stadium has ${coveredWithSun.length} covered sections with sun exposure > 0: ` +
          coveredWithSun.map(s => `${s.section.id} (${s.sunExposure}%)`).join(', ')
        );
      }
    }
  }
  
  // Verify covered sections in open stadiums
  if (stadium.roof === 'open' && coveredSections.length > 0) {
    const coveredRatio = coveredSectionsWithZeroSun.length / coveredSections.length;
    if (coveredRatio < EXPECTED_COVERED_SECTIONS_WITH_ZERO_SUN_RATIO) {
      issues.push(
        `Only ${(coveredRatio * 100).toFixed(1)}% of covered sections show 0% sun ` +
        `(expected at least ${EXPECTED_COVERED_SECTIONS_WITH_ZERO_SUN_RATIO * 100}%)`
      );
    }
  }
  
  // Check for logical consistency
  const allSectionsHaveSun = sectionSunData.every(s => s.sunExposure > 0);
  const noSectionsHaveSun = sectionSunData.every(s => s.sunExposure === 0);
  
  if (stadium.roof === 'open' && noSectionsHaveSun && sunPosition.altitudeDegrees > 0) {
    issues.push('Open stadium shows 0% sun for all sections during daylight');
  }
  
  if (stadium.roof === 'fixed' && allSectionsHaveSun) {
    issues.push('Fixed roof stadium shows sun exposure for all sections');
  }
  
  return {
    stadiumId: stadium.id,
    stadiumName: stadium.name,
    roofType: stadium.roof,
    totalSections: sections.length,
    coveredSections: coveredSections.length,
    sectionsWithZeroSun: sectionsWithZeroSun.length,
    issues
  };
}

function runTests(): void {
  console.log('Stadium Shade Verification Test');
  console.log('==============================');
  console.log(`Test Date/Time: ${TEST_DATE.toISOString()}`);
  console.log('');
  
  const results: TestResult[] = [];
  let totalIssues = 0;
  
  // Test all stadiums
  for (const stadium of MLB_STADIUMS) {
    const result = verifyStadiumShade(stadium);
    results.push(result);
    totalIssues += result.issues.length;
  }
  
  // Print results grouped by roof type
  const roofTypes: Array<'fixed' | 'retractable' | 'open'> = ['fixed', 'retractable', 'open'];
  
  for (const roofType of roofTypes) {
    const stadiumsOfType = results.filter(r => r.roofType === roofType);
    if (stadiumsOfType.length === 0) continue;
    
    console.log(`\n${roofType.toUpperCase()} ROOF STADIUMS (${stadiumsOfType.length})`);
    console.log('='.repeat(50));
    
    for (const result of stadiumsOfType) {
      console.log(`\n${result.stadiumName} (${result.stadiumId})`);
      console.log(`  Total sections: ${result.totalSections}`);
      console.log(`  Covered sections: ${result.coveredSections}`);
      console.log(`  Sections with 0% sun: ${result.sectionsWithZeroSun}`);
      
      if (result.issues.length > 0) {
        console.log('  ⚠️  ISSUES:');
        result.issues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      } else {
        console.log('  ✅ No issues found');
      }
    }
  }
  
  // Summary
  console.log('\n\nSUMMARY');
  console.log('=======');
  console.log(`Total stadiums tested: ${results.length}`);
  console.log(`Stadiums with issues: ${results.filter(r => r.issues.length > 0).length}`);
  console.log(`Total issues found: ${totalIssues}`);
  
  // List stadiums with covered sections
  const stadiumsWithCoveredSections = results.filter(r => r.coveredSections > 0);
  console.log(`\nStadiums with covered sections: ${stadiumsWithCoveredSections.length}`);
  stadiumsWithCoveredSections.forEach(r => {
    const coverageRatio = ((r.coveredSections / r.totalSections) * 100).toFixed(1);
    console.log(`  - ${r.stadiumName}: ${r.coveredSections}/${r.totalSections} sections (${coverageRatio}%)`);
  });
  
  // Exit with error code if issues found
  if (totalIssues > 0) {
    console.log('\n❌ Test failed with issues');
  } else {
    console.log('\n✅ All tests passed');
  }
}

// Function to check which stadiums have section data
function checkStadiumSectionData(): void {
  console.log('\n\nSTADIUM SECTION DATA COVERAGE');
  console.log('=============================\n');
  
  const stadiumsWithData: string[] = [];
  const stadiumsWithoutData: string[] = [];
  
  for (const stadium of MLB_STADIUMS) {
    const sections = getStadiumSections(stadium.id);
    if (sections.length > 0) {
      stadiumsWithData.push(`${stadium.name} (${stadium.id}): ${sections.length} sections`);
    } else {
      stadiumsWithoutData.push(`${stadium.name} (${stadium.id})`);
    }
  }
  
  console.log(`Stadiums with section data: ${stadiumsWithData.length}/${MLB_STADIUMS.length}`);
  stadiumsWithData.forEach(s => console.log(`  ✓ ${s}`));
  
  if (stadiumsWithoutData.length > 0) {
    console.log(`\nStadiums WITHOUT section data: ${stadiumsWithoutData.length}`);
    stadiumsWithoutData.forEach(s => console.log(`  ✗ ${s}`));
  }
}

// Run the tests
if (require.main === module) {
  runTests();
  checkStadiumSectionData();
  
  // Exit with appropriate code after all checks
  const results: TestResult[] = [];
  let totalIssues = 0;
  
  for (const stadium of MLB_STADIUMS) {
    const result = verifyStadiumShade(stadium);
    totalIssues += result.issues.length;
  }
  
  process.exit(totalIssues > 0 ? 1 : 0);
}