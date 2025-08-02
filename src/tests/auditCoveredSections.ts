import { MLB_STADIUMS } from '../data/stadiums';
import { stadiumSections } from '../data/stadiumSections';

interface AuditResult {
  stadiumId: string;
  stadiumName: string;
  team: string;
  roofType: 'open' | 'retractable' | 'fixed';
  totalSections: number;
  coveredSections: number;
  coveragePercentage: number;
  allSectionsCovered: boolean;
  suspiciousCoverage: boolean;
  sectionBreakdown: {
    field: { total: number; covered: number };
    lower: { total: number; covered: number };
    club: { total: number; covered: number };
    upper: { total: number; covered: number };
    suite: { total: number; covered: number };
  };
}

function auditStadiumCoverage(): AuditResult[] {
  const results: AuditResult[] = [];
  
  for (const stadium of MLB_STADIUMS) {
    const sections = stadiumSections.find(s => s.stadiumId === stadium.id)?.sections || [];
    
    if (sections.length === 0) {
      console.warn(`No sections found for ${stadium.name}`);
      continue;
    }
    
    // Count covered sections
    const coveredSections = sections.filter(s => s.covered).length;
    const coveragePercentage = (coveredSections / sections.length) * 100;
    
    // Count by level
    const sectionBreakdown = {
      field: { 
        total: sections.filter(s => s.level === 'field').length,
        covered: sections.filter(s => s.level === 'field' && s.covered).length 
      },
      lower: { 
        total: sections.filter(s => s.level === 'lower').length,
        covered: sections.filter(s => s.level === 'lower' && s.covered).length 
      },
      club: { 
        total: sections.filter(s => s.level === 'club').length,
        covered: sections.filter(s => s.level === 'club' && s.covered).length 
      },
      upper: { 
        total: sections.filter(s => s.level === 'upper').length,
        covered: sections.filter(s => s.level === 'upper' && s.covered).length 
      },
      suite: { 
        total: sections.filter(s => s.level === 'suite').length,
        covered: sections.filter(s => s.level === 'suite' && s.covered).length 
      }
    };
    
    // Determine if coverage is suspicious
    const allSectionsCovered = coveredSections === sections.length;
    const suspiciousCoverage = stadium.roof === 'open' && 
      (allSectionsCovered || coveragePercentage > 70);
    
    results.push({
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      team: stadium.team,
      roofType: stadium.roof,
      totalSections: sections.length,
      coveredSections,
      coveragePercentage,
      allSectionsCovered,
      suspiciousCoverage,
      sectionBreakdown
    });
  }
  
  return results;
}

function printAuditReport(results: AuditResult[]): void {
  console.log('=== MLB Stadium Coverage Audit Report ===\n');
  
  // Find problematic stadiums
  const problematicStadiums = results.filter(r => r.suspiciousCoverage);
  
  if (problematicStadiums.length > 0) {
    console.log('🚨 PROBLEMATIC STADIUMS (Open-air with suspicious coverage):');
    console.log('━'.repeat(80));
    
    // Check for common pattern
    const allHave100PercentUpperLevels = problematicStadiums.every(stadium => {
      const { lower, club, upper } = stadium.sectionBreakdown;
      return (lower.total === 0 || lower.covered === lower.total) &&
             (club.total === 0 || club.covered === club.total) &&
             (upper.total === 0 || upper.covered === upper.total);
    });
    
    if (allHave100PercentUpperLevels) {
      console.log('\n⚠️  PATTERN DETECTED: All problematic stadiums have 100% coverage in lower/club/upper levels!');
      console.log('   This suggests a systematic data entry error where all non-field sections');
      console.log('   were incorrectly marked as covered for these open-air stadiums.\n');
    }
    
    for (const stadium of problematicStadiums) {
      console.log(`\n${stadium.stadiumName} (${stadium.team})`);
      console.log(`  Roof Type: ${stadium.roofType}`);
      console.log(`  Coverage: ${stadium.coveredSections}/${stadium.totalSections} sections (${stadium.coveragePercentage.toFixed(1)}%)`);
      console.log(`  All Sections Covered: ${stadium.allSectionsCovered ? 'YES ⚠️' : 'NO'}`);
      console.log(`  Section Breakdown:`);
      
      const levels = ['field', 'lower', 'club', 'upper', 'suite'] as const;
      for (const level of levels) {
        const data = stadium.sectionBreakdown[level];
        if (data.total > 0) {
          const percentage = data.total > 0 ? (data.covered / data.total * 100).toFixed(1) : '0.0';
          const flag = level !== 'field' && percentage === '100.0' && stadium.roofType === 'open' ? ' ❌' : '';
          console.log(`    ${level.padEnd(6)}: ${data.covered}/${data.total} covered (${percentage}%)${flag}`);
        }
      }
    }
  } else {
    console.log('✅ No stadiums found with suspicious coverage patterns.');
  }
  
  // Summary statistics
  console.log('\n\n=== SUMMARY STATISTICS ===');
  console.log('━'.repeat(80));
  
  const openAirStadiums = results.filter(r => r.roofType === 'open');
  const retractableStadiums = results.filter(r => r.roofType === 'retractable');
  const fixedRoofStadiums = results.filter(r => r.roofType === 'fixed');
  
  console.log(`\nTotal Stadiums Analyzed: ${results.length}`);
  console.log(`  Open-air: ${openAirStadiums.length}`);
  console.log(`  Retractable roof: ${retractableStadiums.length}`);
  console.log(`  Fixed roof: ${fixedRoofStadiums.length}`);
  
  // Average coverage by roof type
  const avgCoverageOpen = openAirStadiums.reduce((sum, s) => sum + s.coveragePercentage, 0) / openAirStadiums.length;
  const avgCoverageRetractable = retractableStadiums.reduce((sum, s) => sum + s.coveragePercentage, 0) / retractableStadiums.length;
  const avgCoverageFixed = fixedRoofStadiums.reduce((sum, s) => sum + s.coveragePercentage, 0) / fixedRoofStadiums.length;
  
  console.log(`\nAverage Coverage by Roof Type:`);
  console.log(`  Open-air: ${avgCoverageOpen.toFixed(1)}%`);
  console.log(`  Retractable: ${avgCoverageRetractable.toFixed(1)}%`);
  console.log(`  Fixed: ${avgCoverageFixed.toFixed(1)}%`);
  
  // List all stadiums with their coverage
  console.log('\n\n=== ALL STADIUMS COVERAGE ===');
  console.log('━'.repeat(80));
  console.log('Stadium Name'.padEnd(30) + 'Roof Type'.padEnd(15) + 'Coverage %'.padEnd(12) + 'Covered/Total');
  console.log('─'.repeat(80));
  
  const sortedResults = [...results].sort((a, b) => b.coveragePercentage - a.coveragePercentage);
  
  for (const stadium of sortedResults) {
    const indicator = stadium.suspiciousCoverage ? ' ⚠️' : '';
    console.log(
      stadium.stadiumName.padEnd(30) +
      stadium.roofType.padEnd(15) +
      `${stadium.coveragePercentage.toFixed(1)}%`.padEnd(12) +
      `${stadium.coveredSections}/${stadium.totalSections}` +
      indicator
    );
  }
  
  // Generate fix recommendations
  if (problematicStadiums.length > 0) {
    console.log('\n\n=== RECOMMENDED FIXES ===');
    console.log('━'.repeat(80));
    console.log('\nThe following stadiums need their section coverage data corrected:');
    
    for (const stadium of problematicStadiums) {
      console.log(`\n${stadium.stadiumName} (stadiumId: '${stadium.stadiumId}'):`);
      console.log('  - Set covered: false for all upper deck sections');
      console.log('  - Set covered: false for most lower deck sections (except behind home plate)');
      console.log('  - Set covered: false for most club level sections');
      console.log('  - Review field level sections individually');
    }
    
    console.log('\n📝 Note: Open-air stadiums typically only have coverage in:');
    console.log('   - Premium seating areas behind home plate');
    console.log('   - Some club/suite levels with overhangs');
    console.log('   - Specific sections under upper deck overhangs');
  }
}

// Run the audit
console.log('Starting stadium coverage audit...\n');
const auditResults = auditStadiumCoverage();
printAuditReport(auditResults);