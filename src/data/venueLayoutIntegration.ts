// Integration system for venue-specific layouts
// This module handles merging venue data with specific seating layouts

import { VenueLayout, getVenueLayout as getLayoutFromBase, allMilbLayouts } from './milbVenueLayouts';
import { aPlusVenueLayouts, aVenueLayouts, allLowerLevelLayouts } from './milbVenueLayoutsLower';
import { applyVenueCorrections, milbLevelClassifications } from './venueCorrections';

// Combine all layouts
const allLayouts = [
  ...allMilbLayouts,  // Contains AAA and AA layouts
  ...allLowerLevelLayouts  // Contains A+ and A layouts
];

// Override the base getVenueLayout to search all files
function getVenueLayout(venueId: string): VenueLayout | undefined {
  return allLayouts.find(layout => layout.venueId === venueId);
}

export interface IntegratedVenue {
  id: string;
  name: string;
  league: string;
  level?: string;
  team: string;
  alternateTeams?: string[];
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  timezone: string;
  seatingGeometry: any;
  venueType: string;
  sport: string;
  surface?: string;
  opened?: number;
  address: string;
  sections: any[];
  hasCustomLayout: boolean;
}

/**
 * Integrates venue-specific layouts with base venue data
 */
export function integrateVenueLayout(baseVenue: any): IntegratedVenue {
  // First apply corrections
  const correctedVenue = applyVenueCorrections(baseVenue);
  
  // Check if we have a custom layout for this venue
  const customLayout = getVenueLayout(baseVenue.id);
  
  if (customLayout) {
    // Replace generic sections with venue-specific sections
    return {
      ...correctedVenue,
      sections: customLayout.sections.map(section => ({
        id: section.id,
        name: section.name,
        level: section.level,
        baseAngle: section.baseAngle,
        angleSpan: section.angleSpan,
        covered: section.covered,
        price: section.price,
        rows: section.rows,
        capacity: section.capacity
      })),
      hasCustomLayout: true
    };
  }
  
  // If no custom layout, return with corrected generic sections
  return {
    ...correctedVenue,
    hasCustomLayout: false
  };
}

/**
 * Get stadium coverage statistics
 */
export function getLayoutCoverage(): {
  total: number;
  withCustomLayouts: number;
  byLevel: Record<string, { total: number; covered: number }>;
} {
  const allVenueIds = Object.keys(milbLevelClassifications);
  const layoutIds = allLayouts.map(l => l.venueId);
  
  const coverage = {
    total: allVenueIds.length,
    withCustomLayouts: layoutIds.length,
    byLevel: {} as Record<string, { total: number; covered: number }>
  };
  
  // Count by level
  Object.entries(milbLevelClassifications).forEach(([venueId, level]) => {
    if (!coverage.byLevel[level]) {
      coverage.byLevel[level] = { total: 0, covered: 0 };
    }
    coverage.byLevel[level].total++;
    
    if (layoutIds.includes(venueId)) {
      coverage.byLevel[level].covered++;
    }
  });
  
  return coverage;
}

/**
 * Get list of venues that still need custom layouts
 */
export function getVenuesNeedingLayouts(): Array<{ id: string; level: string; priority: number }> {
  const hasLayout = new Set(allLayouts.map(l => l.venueId));
  const needed: Array<{ id: string; level: string; priority: number }> = [];
  
  Object.entries(milbLevelClassifications).forEach(([venueId, level]) => {
    if (!hasLayout.has(venueId)) {
      // Prioritize by level (AAA highest priority)
      const priority = level === 'AAA' ? 1 : level === 'AA' ? 2 : level === 'A+' ? 3 : 4;
      needed.push({ id: venueId, level, priority });
    }
  });
  
  return needed.sort((a, b) => a.priority - b.priority);
}

/**
 * Validate all custom layouts
 */
export function validateAllLayouts(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  allLayouts.forEach(layout => {
    // Check for valid angles
    layout.sections.forEach(section => {
      if (section.baseAngle < 0 || section.baseAngle >= 360) {
        errors.push(`${layout.venueName} - ${section.name}: Invalid baseAngle ${section.baseAngle}`);
      }
      
      if (section.angleSpan < 0 || section.angleSpan > 360) {
        errors.push(`${layout.venueName} - ${section.name}: Invalid angleSpan ${section.angleSpan}`);
      }
    });
    
    // Check for section overlaps
    const sectionRanges = layout.sections.map(s => ({
      start: s.baseAngle,
      end: (s.baseAngle + s.angleSpan) % 360,
      wraps: s.baseAngle + s.angleSpan > 360,
      name: s.name
    }));
    
    // Simple overlap check (doesn't handle all edge cases)
    for (let i = 0; i < sectionRanges.length; i++) {
      for (let j = i + 1; j < sectionRanges.length; j++) {
        const a = sectionRanges[i];
        const b = sectionRanges[j];
        
        if (!a.wraps && !b.wraps) {
          // Neither wraps around 360
          if ((a.start < b.end && a.end > b.start)) {
            errors.push(`${layout.venueName}: Sections ${a.name} and ${b.name} overlap`);
          }
        } else if (a.wraps && b.wraps) {
          // Both wrap around 360 - they always overlap
          errors.push(`${layout.venueName}: Sections ${a.name} and ${b.name} both wrap around and overlap`);
        } else if (a.wraps) {
          // 'a' wraps, 'b' doesn't
          // 'a' covers [start, 360] and [0, end]
          // Check if 'b' overlaps with either range
          if (b.start >= a.start || b.end <= a.end) {
            errors.push(`${layout.venueName}: Sections ${a.name} and ${b.name} overlap`);
          }
        } else if (b.wraps) {
          // 'b' wraps, 'a' doesn't
          // 'b' covers [start, 360] and [0, end]
          // Check if 'a' overlaps with either range
          if (a.start >= b.start || a.end <= b.end) {
            errors.push(`${layout.venueName}: Sections ${a.name} and ${b.name} overlap`);
          }
        }
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate a report of venue layout implementation status
 */
export function generateLayoutReport(): string {
  const coverage = getLayoutCoverage();
  const needed = getVenuesNeedingLayouts();
  const validation = validateAllLayouts();
  
  let report = '# MiLB Venue Layout Implementation Report\\n\\n';
  
  report += '## Coverage Statistics\\n';
  report += `- Total MiLB Venues: ${coverage.total}\\n`;
  report += `- Venues with Custom Layouts: ${coverage.withCustomLayouts} (${Math.round(coverage.withCustomLayouts / coverage.total * 100)}%)\\n\\n`;
  
  report += '### Coverage by Level\\n';
  Object.entries(coverage.byLevel).forEach(([level, stats]) => {
    const percent = Math.round(stats.covered / stats.total * 100);
    report += `- ${level}: ${stats.covered}/${stats.total} (${percent}%)\\n`;
  });
  
  report += '\\n## Validation Results\\n';
  if (validation.valid) {
    report += '✅ All custom layouts are valid\\n';
  } else {
    report += `❌ Found ${validation.errors.length} validation errors:\\n`;
    validation.errors.forEach(error => {
      report += `  - ${error}\\n`;
    });
  }
  
  report += '\\n## High Priority Venues Needing Layouts\\n';
  const highPriority = needed.filter(v => v.priority <= 2).slice(0, 20);
  highPriority.forEach(venue => {
    report += `- ${venue.id} (${venue.level})\\n`;
  });
  
  return report;
}