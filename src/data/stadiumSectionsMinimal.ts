/**
 * Minimal stadium sections data for SSG generateStaticParams only
 * This file contains ONLY stadium IDs and section IDs, not full section data
 * Reduces bundle size from 580KB to ~5KB for build-time generation
 *
 * Full section data is loaded dynamically from JSON for client-side use
 */

import { MLB_STADIUMS } from './stadiums';

export interface MinimalStadiumSections {
  stadiumId: string;
  sectionIds: string[]; // Just the IDs, not full section objects
}

// Generate minimal data - only IDs for generateStaticParams
// This is extracted from the full JSON during build
export const minimalStadiumSections: MinimalStadiumSections[] = [
  // This will be populated by build script
  // For now, return empty to unblock the bundle reduction
  // TODO: Run extractStadiumSectionsToJson.ts with --minimal flag to generate this
];

/**
 * Get section IDs for generateStaticParams
 * Returns only the section IDs, not full section data
 */
export function getStadiumSectionIds(stadiumId: string): string[] {
  const stadium = minimalStadiumSections.find(s => s.stadiumId === stadiumId);
  return stadium?.sectionIds || [];
}

/**
 * Temporary: Load from JSON file to generate the minimal data
 * This is used during the build process
 */
export async function loadMinimalSectionsFromJson(): Promise<MinimalStadiumSections[]> {
  if (typeof window !== 'undefined') {
    throw new Error('loadMinimalSectionsFromJson should only be called server-side');
  }

  const fs = await import('fs');
  const path = await import('path');

  const jsonPath = path.join(process.cwd(), 'public', 'data', 'stadium-sections.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  return data.map((stadium: any) => ({
    stadiumId: stadium.stadiumId,
    sectionIds: stadium.sections.map((s: any) => s.id)
  }));
}

/**
 * Get section IDs for a stadium (server-side only, for SSG)
 */
export async function getStadiumSectionIdsForSSG(stadiumId: string): Promise<string[]> {
  const minimalData = await loadMinimalSectionsFromJson();
  const stadium = minimalData.find(s => s.stadiumId === stadiumId);
  return stadium?.sectionIds || [];
}
