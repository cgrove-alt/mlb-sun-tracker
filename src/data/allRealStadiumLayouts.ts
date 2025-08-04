// All Real Stadium Layouts - Comprehensive Import System
// This consolidates all hand-crafted stadium layouts for easy access

import { RealStadiumLayout } from './realStadiumSections';
import { MiLBStadium, AAA_STADIUMS, AA_STADIUMS } from './milbStadiums';
import { VenueLayout, getVenueLayout } from './milbVenueLayouts';
import { enhanceStadiumLayout } from './stadiumLayoutEnhancer';

// Import existing hand-crafted layouts
import { polarParkLayout } from './realStadiumLayouts/worcesterRedSox';
import { columbusClippersLayout, durhamBullsLayout, lasVegasAviatorsLayout } from './realStadiumLayouts/aaaStadiums';
import { buffaloBisonsLayout, charlotteKnightsLayout } from './realStadiumLayouts/allAAAStadiums';

// Master registry of all real stadium layouts
const HAND_CRAFTED_LAYOUTS: Map<string, RealStadiumLayout> = new Map([
  // Existing complete hand-crafted layouts
  ['worcester-red-sox', polarParkLayout],
  ['columbus-clippers', columbusClippersLayout],
  ['durham-bulls', durhamBullsLayout],
  ['las-vegas-aviators', lasVegasAviatorsLayout],
  ['buffalo-bisons', buffaloBisonsLayout],
  ['charlotte-knights', charlotteKnightsLayout],
]);

// Function to get a real stadium layout for any MiLB venue
export function getRealStadiumLayout(stadiumId: string): RealStadiumLayout | null {
  // First check if we have a hand-crafted layout
  const handCrafted = HAND_CRAFTED_LAYOUTS.get(stadiumId);
  if (handCrafted) {
    return handCrafted;
  }
  
  // If no hand-crafted layout, create one from existing venue data enhanced with real characteristics
  const stadium = findStadium(stadiumId);
  const existingLayout = getVenueLayout(stadiumId);
  
  if (stadium && existingLayout) {
    // Convert the existing venue layout to a real stadium layout with enhancements
    return enhanceStadiumLayout(existingLayout, stadium);
  }
  
  return null;
}

// Get all available real stadium layouts
export function getAllRealStadiumLayouts(): Map<string, RealStadiumLayout> {
  const allLayouts = new Map<string, RealStadiumLayout>();
  
  // Add all hand-crafted layouts
  HAND_CRAFTED_LAYOUTS.forEach((layout, id) => {
    allLayouts.set(id, layout);
  });
  
  // Add enhanced layouts for all other stadiums
  const allStadiums = [...AAA_STADIUMS, ...AA_STADIUMS];
  
  allStadiums.forEach(stadium => {
    if (!allLayouts.has(stadium.id)) {
      const realLayout = getRealStadiumLayout(stadium.id);
      if (realLayout) {
        allLayouts.set(stadium.id, realLayout);
      }
    }
  });
  
  return allLayouts;
}

// Get comprehensive stadium data report
export function getStadiumImplementationReport(): {
  totalStadiums: number;
  handCraftedLayouts: number;
  enhancedLayouts: number;
  coveragePercentage: number;
  handCraftedStadiums: string[];
  missingStadiums: string[];
} {
  const allStadiums = [...AAA_STADIUMS, ...AA_STADIUMS];
  const allLayouts = getAllRealStadiumLayouts();
  
  const handCraftedStadiums = Array.from(HAND_CRAFTED_LAYOUTS.keys());
  const missingStadiums = allStadiums
    .filter(stadium => !allLayouts.has(stadium.id))
    .map(stadium => stadium.id);
  
  const enhancedLayouts = allLayouts.size - HAND_CRAFTED_LAYOUTS.size;
  
  return {
    totalStadiums: allStadiums.length,
    handCraftedLayouts: HAND_CRAFTED_LAYOUTS.size,
    enhancedLayouts,
    coveragePercentage: Math.round((allLayouts.size / allStadiums.length) * 100),
    handCraftedStadiums,
    missingStadiums
  };
}

// Priority list for converting enhanced layouts to hand-crafted layouts
export const PRIORITY_FOR_HAND_CRAFTING = [
  // AAA Priority
  'albuquerque-isotopes', 'el-paso-chihuahuas', 'gwinnett-stripers',
  'indianapolis-indians', 'iowa-cubs', 'jacksonville-jumbo-shrimp',
  'lehigh-valley-ironpigs', 'louisville-bats', 'memphis-redbirds',
  'nashville-sounds', 'norfolk-tides', 'omaha-storm-chasers',
  'rochester-red-wings', 'scranton-railriders', 'st-paul-saints',
  'syracuse-mets', 'toledo-mud-hens', 'oklahoma-city-dodgers',
  'reno-aces', 'round-rock-express', 'sacramento-river-cats',
  'salt-lake-bees', 'sugar-land-space-cowboys', 'tacoma-rainiers',
  
  // AA Priority
  'akron-rubberducks', 'portland-sea-dogs', 'reading-fightin-phils',
  'richmond-flying-squirrels', 'biloxi-shuckers', 'pensacola-blue-wahoos',
  'corpus-christi-hooks', 'frisco-roughriders', 'tulsa-drillers',
  
  // A+ Priority
  'brooklyn-cyclones', 'everett-aquasox', 'spokane-indians',
  'vancouver-canadians', 'eugene-emeralds'
];

// Function to add new hand-crafted layouts (for future expansion)
export function addHandCraftedLayout(stadiumId: string, layout: RealStadiumLayout): void {
  HAND_CRAFTED_LAYOUTS.set(stadiumId, layout);
}

// Helper function to find stadium by ID
function findStadium(stadiumId: string): MiLBStadium | undefined {
  return [...AAA_STADIUMS, ...AA_STADIUMS].find(s => s.id === stadiumId);
}

// Export for use in other modules
export { HAND_CRAFTED_LAYOUTS };