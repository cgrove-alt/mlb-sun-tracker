// Script to verify that all MiLB stadiums have unique sections
// and identify any generic or duplicate layouts

import { aaaCompleteLayouts } from '../src/data/milbVenueLayoutsAAA';
import { aaCompleteLayouts } from '../src/data/milbVenueLayoutsAA';
import { aPlusVenueLayouts } from '../src/data/milbVenueLayoutsAPlus';
import { aVenueLayouts } from '../src/data/milbVenueLayoutsA';
import { missingVenueLayouts } from '../src/data/milbVenueLayoutsMissing';
import { VenueLayout } from '../src/data/milbVenueLayouts';

interface SectionPattern {
  pattern: string;
  stadiums: string[];
}

function analyzeSectionPatterns() {
  const allLayouts = [
    ...aaaCompleteLayouts,
    ...aaCompleteLayouts,
    ...aPlusVenueLayouts,
    ...aVenueLayouts,
    ...missingVenueLayouts
  ];

  // Track section patterns
  const sectionPatterns = new Map<string, string[]>();
  const genericSectionNames = new Set<string>();
  const clubConfigPatterns = new Map<string, string[]>();

  allLayouts.forEach(layout => {
    // Create a pattern signature for this stadium's sections
    const sectionPattern = layout.sections
      .map((s: any) => `${s.level}-${s.baseAngle}-${s.angleSpan}`)
      .sort()
      .join('|');
    
    if (!sectionPatterns.has(sectionPattern)) {
      sectionPatterns.set(sectionPattern, []);
    }
    sectionPatterns.get(sectionPattern)!.push(layout.venueId);

    // Check for generic section names
    layout.sections.forEach((section: any) => {
      if (section.name.match(/^(Field Level|Lower Box|Upper Reserved|Field Box|Box Seats|Suite Level|Right Field Pavilion|Left Field Pavilion|Club Level) \d+$/)) {
        genericSectionNames.add(section.name);
      }

      // Track club level configurations
      if (section.level === 'club' || section.price === 'luxury') {
        const configKey = `${section.baseAngle}-${section.angleSpan}-${section.covered}`;
        if (!clubConfigPatterns.has(configKey)) {
          clubConfigPatterns.set(configKey, []);
        }
        clubConfigPatterns.get(configKey)!.push(`${layout.venueId}:${section.name}`);
      }
    });
  });

  // Report findings
  console.log('=== MiLB Stadium Section Analysis ===\n');
  
  console.log(`Total stadiums analyzed: ${allLayouts.length}`);
  console.log(`Unique section patterns: ${sectionPatterns.size}\n`);

  // Find duplicate patterns
  const duplicatePatterns = Array.from(sectionPatterns.entries())
    .filter(([_, stadiums]) => stadiums.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  if (duplicatePatterns.length > 0) {
    console.log('⚠️  DUPLICATE SECTION PATTERNS FOUND:');
    duplicatePatterns.forEach(([pattern, stadiums]) => {
      console.log(`\n${stadiums.length} stadiums with identical layout:`);
      stadiums.forEach(s => console.log(`  - ${s}`));
    });
  }

  // Report generic section names
  if (genericSectionNames.size > 0) {
    console.log('\n⚠️  GENERIC SECTION NAMES FOUND:');
    console.log(`Total generic names: ${genericSectionNames.size}`);
    console.log('Examples:', Array.from(genericSectionNames).slice(0, 10));
  }

  // Report duplicate club configurations
  const duplicateClubConfigs = Array.from(clubConfigPatterns.entries())
    .filter(([_, stadiums]) => stadiums.length > 5)
    .sort((a, b) => b[1].length - a[1].length);

  if (duplicateClubConfigs.length > 0) {
    console.log('\n⚠️  DUPLICATE CLUB/LUXURY CONFIGURATIONS:');
    duplicateClubConfigs.forEach(([config, stadiums]) => {
      console.log(`\n${stadiums.length} stadiums with config "${config}":`);
      console.log(stadiums.slice(0, 10).join(', '), stadiums.length > 10 ? '...' : '');
    });
  }

  // Identify stadiums needing updates
  const stadiumsNeedingUpdates = allLayouts.filter(layout => {
    const hasGenericNames = layout.sections.some((s: any) => 
      s.name.match(/^(Field Level|Lower Box|Upper Reserved|Field Box|Box Seats|Suite Level) \d+$/)
    );
    const hasStandardClubConfig = layout.sections.some((s: any) => 
      s.baseAngle === 340 && s.angleSpan === 40 && s.level === 'club'
    );
    return hasGenericNames || hasStandardClubConfig;
  });

  console.log(`\n📋 STADIUMS NEEDING UPDATES: ${stadiumsNeedingUpdates.length}`);
  console.log('\nBy Level:');
  const byLevel = stadiumsNeedingUpdates.reduce((acc, s) => {
    const level = getStadiumLevel(s.venueId);
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(byLevel).forEach(([level, count]) => {
    console.log(`  ${level}: ${count} stadiums`);
  });

  // Provide recommendations
  console.log('\n📊 RECOMMENDATIONS:');
  console.log('1. Replace generic section names with venue-specific names');
  console.log('2. Adjust club section angles/spans to match actual stadium layouts');
  console.log('3. Add unique stadium features (berms, party decks, special areas)');
  console.log('4. Verify section counts match actual stadium configurations');
}

function getStadiumLevel(venueId: string): string {
  if (aaaCompleteLayouts.some((l: VenueLayout) => l.venueId === venueId)) return 'AAA';
  if (aaCompleteLayouts.some((l: VenueLayout) => l.venueId === venueId)) return 'AA';
  if (aPlusVenueLayouts.some((l: VenueLayout) => l.venueId === venueId)) return 'A+';
  if (aVenueLayouts.some((l: VenueLayout) => l.venueId === venueId)) return 'A';
  return 'Unknown';
}

// Run the analysis
analyzeSectionPatterns();