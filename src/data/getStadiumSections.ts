import { stadiumSections, type StadiumSection } from './stadiumSections';

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}

/**
 * Get stadium sections data asynchronously
 * Currently uses the main stadiumSections array but keeps async interface for future optimization
 */
export async function getStadiumSectionsAsync(stadiumId: string): Promise<StadiumSection[]> {
  const stadiumData = stadiumSections.find(s => s.stadiumId === stadiumId);
  return stadiumData ? stadiumData.sections : [];
}

/**
 * Synchronous fallback that returns an empty array
 * Use getStadiumSectionsAsync for actual data loading
 */
export function getStadiumSections(stadiumId: string): StadiumSection[] {
  console.warn('getStadiumSections (sync) called - use getStadiumSectionsAsync instead');
  return [];
}
