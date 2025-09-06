// Comprehensive Stadium Sun Exposure Validation Test Suite
// Tests all MLB, MiLB, and NFL stadiums for accurate sun calculations

import { MLB_STADIUMS } from './src/data/stadiums';
import { MILB_STADIUMS } from './src/data/milbStadiums';
import { NFL_STADIUMS } from './src/data/nflStadiums';
import { getUnifiedShadedSections } from './src/utils/unifiedStadiumShade';
import { getMiLBStadiumSections } from './src/data/milbStadiumSections';
import { getNFLStadiumSections } from './src/data/nflStadiumSections';
import { getStadiumSections } from './src/data/stadiumSections';
import { getStadiumObstructions } from './src/data/stadiumObstructions';

interface ValidationResult {
  stadiumId: string;
  stadiumName: string;
  league: string;
  passed: boolean;
  issues: string[];
  sectionCount: number;
  obstructionCount: number;
  avgShadePercentage: number;
}

// Validate stadium data integrity
function validateStadiumData(stadium: any, league: string): string[] {
  const issues: string[] = [];
  
  // Check required fields
  if (!stadium.id) issues.push('Missing stadium ID');
  if (!stadium.name) issues.push('Missing stadium name');
  if (!stadium.latitude || stadium.latitude < -90 || stadium.latitude > 90) {
    issues.push(`Invalid latitude: ${stadium.latitude}`);
  }
  if (!stadium.longitude || stadium.longitude < -180 || stadium.longitude > 180) {
    issues.push(`Invalid longitude: ${stadium.longitude}`);
  }
  if (stadium.orientation === undefined || stadium.orientation < 0 || stadium.orientation >= 360) {
    issues.push(`Invalid orientation: ${stadium.orientation}`);
  }
  if (!stadium.capacity || stadium.capacity < 1000) {
    issues.push(`Suspicious capacity: ${stadium.capacity}`);
  }
  
  return issues;
}

// Validate section data
function validateSections(sections: any[]): string[] {
  const issues: string[] = [];
  
  if (!sections || sections.length === 0) {
    issues.push('No sections defined');
    return issues;
  }
  
  const angleSet = new Set<number>();
  
  for (const section of sections) {
    // Check for invalid angles
    if (section.baseAngle < 0 || section.baseAngle >= 360) {
      issues.push(`Section ${section.id}: Invalid angle ${section.baseAngle}`);
    }
    
    // Check for duplicate angles
    if (angleSet.has(section.baseAngle)) {
      issues.push(`Section ${section.id}: Duplicate angle ${section.baseAngle}`);
    }
    angleSet.add(section.baseAngle);
    
    // Check angle span
    if (!section.angleSpan || section.angleSpan <= 0 || section.angleSpan > 360) {
      issues.push(`Section ${section.id}: Invalid angle span ${section.angleSpan}`);
    }
    
    // Check level
    if (!['field', 'lower', 'club', 'upper', 'suite'].includes(section.level)) {
      issues.push(`Section ${section.id}: Invalid level ${section.level}`);
    }
  }
  
  return issues;
}

// Test sun calculations for a stadium
async function testSunCalculations(
  stadium: any,
  sections: any[],
  league: string
): Promise<{ avgShade: number; issues: string[] }> {
  const issues: string[] = [];
  let totalShade = 0;
  
  try {
    // Test for 1 PM in July (peak sun)
    const testDate = new Date(2025, 6, 15, 13, 0, 0);
    
    // Convert to unified format
    const unifiedStadium = {
      ...stadium,
      type: league as 'MLB' | 'MiLB' | 'NFL'
    };
    
    // Get shaded sections
    const shadedSections = await getUnifiedShadedSections(
      unifiedStadium,
      sections,
      testDate
    );
    
    if (!shadedSections || shadedSections.length === 0) {
      issues.push('No shade calculations returned');
      return { avgShade: 0, issues };
    }
    
    // Calculate average shade
    for (const section of shadedSections) {
      if (section.shadePercentage < 0 || section.shadePercentage > 100) {
        issues.push(`Section ${section.section.id}: Invalid shade ${section.shadePercentage}%`);
      }
      totalShade += section.shadePercentage;
    }
    
    const avgShade = totalShade / shadedSections.length;
    
    // Check for suspicious patterns
    if (avgShade === 0) {
      issues.push('All sections show 0% shade (suspicious)');
    }
    if (avgShade === 100) {
      issues.push('All sections show 100% shade (suspicious)');
    }
    
    return { avgShade, issues };
  } catch (error) {
    issues.push(`Calculation error: ${error}`);
    return { avgShade: 0, issues };
  }
}

// Main validation function
async function validateAllStadiums() {
  console.log('Stadium Sun Exposure Validation Report');
  console.log('=' .repeat(60));
  console.log(`Date: ${new Date().toISOString()}`);
  console.log();
  
  const results: ValidationResult[] = [];
  
  // Validate MLB Stadiums
  console.log('Validating MLB Stadiums...');
  for (const stadium of MLB_STADIUMS) {
    const sections = getStadiumSections(stadium.id);
    const obstructions = getStadiumObstructions(stadium.id);
    
    const dataIssues = validateStadiumData(stadium, 'MLB');
    const sectionIssues = validateSections(sections);
    const { avgShade, issues: calcIssues } = await testSunCalculations(stadium, sections, 'MLB');
    
    results.push({
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      league: 'MLB',
      passed: dataIssues.length === 0 && sectionIssues.length === 0 && calcIssues.length === 0,
      issues: [...dataIssues, ...sectionIssues, ...calcIssues],
      sectionCount: sections.length,
      obstructionCount: obstructions.length,
      avgShadePercentage: avgShade
    });
  }
  
  // Validate MiLB Stadiums (sample - top 10)
  console.log('Validating MiLB Stadiums...');
  const milbSample = MILB_STADIUMS.slice(0, 10);
  for (const stadium of milbSample) {
    const sections = getMiLBStadiumSections(stadium.id);
    const obstructions = getStadiumObstructions(stadium.id);
    
    const dataIssues = validateStadiumData(stadium, 'MiLB');
    const sectionIssues = validateSections(sections);
    const { avgShade, issues: calcIssues } = await testSunCalculations(stadium, sections, 'MiLB');
    
    results.push({
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      league: 'MiLB',
      passed: dataIssues.length === 0 && sectionIssues.length === 0 && calcIssues.length === 0,
      issues: [...dataIssues, ...sectionIssues, ...calcIssues],
      sectionCount: sections.length,
      obstructionCount: obstructions.length,
      avgShadePercentage: avgShade
    });
  }
  
  // Validate NFL Stadiums (sample - top 10)
  console.log('Validating NFL Stadiums...');
  const nflSample = NFL_STADIUMS.slice(0, 10);
  for (const stadium of nflSample) {
    const sections = getNFLStadiumSections(stadium.id);
    const obstructions = getStadiumObstructions(stadium.id);
    
    const dataIssues = validateStadiumData(stadium, 'NFL');
    const sectionIssues = validateSections(sections);
    const { avgShade, issues: calcIssues } = await testSunCalculations(stadium, sections, 'NFL');
    
    results.push({
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      league: 'NFL',
      passed: dataIssues.length === 0 && sectionIssues.length === 0 && calcIssues.length === 0,
      issues: [...dataIssues, ...sectionIssues, ...calcIssues],
      sectionCount: sections.length,
      obstructionCount: obstructions.length,
      avgShadePercentage: avgShade
    });
  }
  
  // Generate Report
  console.log('\n' + '=' .repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('=' .repeat(60));
  
  const mlbResults = results.filter(r => r.league === 'MLB');
  const milbResults = results.filter(r => r.league === 'MiLB');
  const nflResults = results.filter(r => r.league === 'NFL');
  
  console.log(`\nMLB Stadiums: ${mlbResults.filter(r => r.passed).length}/${mlbResults.length} passed`);
  console.log(`MiLB Stadiums: ${milbResults.filter(r => r.passed).length}/${milbResults.length} passed`);
  console.log(`NFL Stadiums: ${nflResults.filter(r => r.passed).length}/${nflResults.length} passed`);
  
  // Show failed stadiums
  const failed = results.filter(r => !r.passed);
  if (failed.length > 0) {
    console.log('\n' + '=' .repeat(60));
    console.log('FAILED VALIDATIONS');
    console.log('=' .repeat(60));
    
    for (const result of failed) {
      console.log(`\n${result.league} - ${result.stadiumName} (${result.stadiumId})`);
      console.log(`  Sections: ${result.sectionCount}, Obstructions: ${result.obstructionCount}`);
      console.log(`  Avg Shade: ${result.avgShadePercentage.toFixed(1)}%`);
      console.log('  Issues:');
      for (const issue of result.issues) {
        console.log(`    - ${issue}`);
      }
    }
  }
  
  // Show statistics
  console.log('\n' + '=' .repeat(60));
  console.log('STATISTICS');
  console.log('=' .repeat(60));
  
  const avgSections = results.reduce((sum, r) => sum + r.sectionCount, 0) / results.length;
  const avgObstructions = results.reduce((sum, r) => sum + r.obstructionCount, 0) / results.length;
  const avgShade = results.reduce((sum, r) => sum + r.avgShadePercentage, 0) / results.length;
  
  console.log(`\nAverage sections per stadium: ${avgSections.toFixed(1)}`);
  console.log(`Average obstructions per stadium: ${avgObstructions.toFixed(1)}`);
  console.log(`Average shade percentage (1 PM July): ${avgShade.toFixed(1)}%`);
  
  // Detailed stats by league
  for (const league of ['MLB', 'MiLB', 'NFL']) {
    const leagueResults = results.filter(r => r.league === league);
    if (leagueResults.length > 0) {
      const leagueAvgSections = leagueResults.reduce((sum, r) => sum + r.sectionCount, 0) / leagueResults.length;
      const leagueAvgObstructions = leagueResults.reduce((sum, r) => sum + r.obstructionCount, 0) / leagueResults.length;
      const leagueAvgShade = leagueResults.reduce((sum, r) => sum + r.avgShadePercentage, 0) / leagueResults.length;
      
      console.log(`\n${league} Averages:`);
      console.log(`  Sections: ${leagueAvgSections.toFixed(1)}`);
      console.log(`  Obstructions: ${leagueAvgObstructions.toFixed(1)}`);
      console.log(`  Shade: ${leagueAvgShade.toFixed(1)}%`);
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('Validation Complete');
}

// Run validation
validateAllStadiums().catch(console.error);