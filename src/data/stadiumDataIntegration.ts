// Stadium Data Integration System
// Manages real stadium data vs intelligent generation with quality tracking

import { RealStadiumLayout } from './realStadiumSections';
import { VenueLayout } from './milbVenueLayouts';
import { MiLBStadium, AAA_STADIUMS, AA_STADIUMS } from './milbStadiums';
import { generateStadiumLayout, GenerationQuality } from './stadiumSectionGenerator';

// Import real stadium layouts as they become available
import { polarParkLayout } from './realStadiumLayouts/worcesterRedSox';

// Map of real stadium layouts
const REAL_STADIUM_LAYOUTS: Map<string, RealStadiumLayout> = new Map([
  ['worcester-red-sox', polarParkLayout],
  // Add more real layouts here as they become available
]);

// Priority stadiums for real data collection
const PRIORITY_STADIUMS = {
  AAA: [
    'worcester-red-sox',
    'columbus-clippers',
    'durham-bulls',
    'charlotte-knights',
    'las-vegas-aviators',
    'sacramento-river-cats',
    'albuquerque-isotopes'
  ],
  AA: [
    'akron-rubberducks',
    'portland-sea-dogs',
    'richmond-flying-squirrels',
    'binghamton-rumble-ponies',
    'corpus-christi-hooks'
  ]
};

export interface StadiumDataQuality {
  stadiumId: string;
  dataSource: 'official' | 'verified' | 'estimated';
  quality: 'real' | 'high' | 'medium' | 'basic';
  lastUpdated: string;
  completeness: number; // 0-100 percentage
  notes?: string;
}

// Get stadium layout with quality tracking
export function getStadiumLayout(stadiumId: string): {
  layout: RealStadiumLayout;
  quality: StadiumDataQuality;
} {
  // Check for real data first
  const realLayout = REAL_STADIUM_LAYOUTS.get(stadiumId);
  if (realLayout) {
    return {
      layout: realLayout,
      quality: {
        stadiumId,
        dataSource: realLayout.dataSource,
        quality: 'real',
        lastUpdated: realLayout.lastVerified,
        completeness: 100,
        notes: 'Complete real stadium data available'
      }
    };
  }
  
  // Find stadium data
  const stadium = findStadium(stadiumId);
  if (!stadium) {
    throw new Error(`Stadium not found: ${stadiumId}`);
  }
  
  // Determine generation quality based on priority
  const quality = determineGenerationQuality(stadiumId, stadium);
  
  // Generate layout
  const generatedLayout = generateStadiumLayout(stadium, {
    quality,
    includeSpecialFeatures: true,
    climateConsiderations: true
  });
  
  return {
    layout: generatedLayout,
    quality: {
      stadiumId,
      dataSource: 'estimated',
      quality,
      lastUpdated: new Date().toISOString().split('T')[0],
      completeness: quality === 'high' ? 75 : quality === 'medium' ? 50 : 25,
      notes: `Generated using ${quality} quality algorithm`
    }
  };
}

// Convert old VenueLayout format to new RealStadiumLayout
export function convertLegacyLayout(
  venueLayout: VenueLayout,
  stadium: MiLBStadium
): RealStadiumLayout {
  return {
    venueId: venueLayout.venueId,
    venueName: venueLayout.venueName,
    orientation: stadium.orientation,
    lastVerified: venueLayout.lastUpdated,
    dataSource: 'estimated',
    sections: venueLayout.sections.map(section => ({
      ...section,
      sunExposure: {
        morning: 'partial',
        afternoon: 'partial',
        evening: 'partial'
      }
    })),
    notes: venueLayout.notes
  };
}

// Get all stadiums with data quality report
export function getStadiumDataReport(): {
  total: number;
  withRealData: number;
  withHighQuality: number;
  withMediumQuality: number;
  withBasicQuality: number;
  priorityMissing: string[];
} {
  const allStadiums = [...AAA_STADIUMS, ...AA_STADIUMS];
  const realDataCount = REAL_STADIUM_LAYOUTS.size;
  
  let highQuality = 0;
  let mediumQuality = 0;
  let basicQuality = 0;
  const priorityMissing: string[] = [];
  
  allStadiums.forEach(stadium => {
    if (!REAL_STADIUM_LAYOUTS.has(stadium.id)) {
      const quality = determineGenerationQuality(stadium.id, stadium);
      if (quality === 'high') highQuality++;
      else if (quality === 'medium') mediumQuality++;
      else basicQuality++;
      
      // Check if this is a priority stadium missing real data
      if (PRIORITY_STADIUMS.AAA.includes(stadium.id) || 
          PRIORITY_STADIUMS.AA.includes(stadium.id)) {
        priorityMissing.push(stadium.id);
      }
    }
  });
  
  return {
    total: allStadiums.length,
    withRealData: realDataCount,
    withHighQuality: highQuality,
    withMediumQuality: mediumQuality,
    withBasicQuality: basicQuality,
    priorityMissing: priorityMissing.filter(id => !REAL_STADIUM_LAYOUTS.has(id))
  };
}

// Helper functions
function findStadium(stadiumId: string): MiLBStadium | undefined {
  return [...AAA_STADIUMS, ...AA_STADIUMS].find(s => s.id === stadiumId);
}

function determineGenerationQuality(stadiumId: string, stadium: MiLBStadium): GenerationQuality {
  // Priority stadiums get high quality generation
  if (PRIORITY_STADIUMS.AAA.includes(stadiumId) || 
      PRIORITY_STADIUMS.AA.includes(stadiumId)) {
    return 'high';
  }
  
  // AAA stadiums get medium quality by default
  if (stadium.level === 'AAA') {
    return 'medium';
  }
  
  // Large capacity stadiums get medium quality
  if (stadium.capacity > 6000) {
    return 'medium';
  }
  
  // Everything else gets basic
  return 'basic';
}

// Export function to update existing venue with real stadium layout
export function integrateRealStadiumData(venue: any): any {
  const { layout, quality } = getStadiumLayout(venue.id);
  
  return {
    ...venue,
    sections: layout.sections,
    hasCustomLayout: quality.quality === 'real',
    layoutQuality: quality,
    specialFeatures: layout.specialFeatures,
    layoutNotes: layout.notes
  };
}