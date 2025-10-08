import type { StadiumSection } from './stadiumSections';

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}

/**
 * Get stadium sections data asynchronously with dynamic imports
 * Only loads the specific stadium's section data, avoiding bundling all 5MB+ of sections
 */
export async function getStadiumSectionsAsync(stadiumId: string): Promise<StadiumSection[]> {
  try {
    // Dynamic import from split files - only bundles what's needed
    const module = await import(`./stadiumSections-split/${stadiumId}.ts`);
    const data = module.stadiumSections;
    return data.sections || [];
  } catch (error) {
    console.warn(`No section data found for stadium: ${stadiumId}`);
    return [];
  }
}

/**
 * Synchronous fallback that returns an empty array
 * Use getStadiumSectionsAsync for actual data loading
 */
export function getStadiumSections(stadiumId: string): StadiumSection[] {
  console.warn('getStadiumSections (sync) called - use getStadiumSectionsAsync instead');
  return [];
}
