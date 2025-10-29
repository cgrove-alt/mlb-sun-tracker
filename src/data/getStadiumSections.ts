import type { StadiumSection } from './stadiumSectionTypes';

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}

/**
 * Get stadium sections data asynchronously using JSON (client-side)
 * For server-side, import JSON directly from public/data/stadium-sections.json
 */
export async function getStadiumSectionsAsync(stadiumId: string): Promise<StadiumSection[]> {
  return fetchStadiumSectionsByIdJson(stadiumId);
}

/**
 * Load all stadium sections from JSON (client-side only)
 * This replaces the heavy stadiumSections.ts import to reduce bundle size
 */
let cachedSectionsData: StadiumSections[] | null = null;
let fetchPromise: Promise<StadiumSections[]> | null = null;

export async function fetchAllStadiumSectionsJson(): Promise<StadiumSections[]> {
  // Return cached data if available
  if (cachedSectionsData) {
    return cachedSectionsData;
  }

  // If fetch is in progress, return the same promise
  if (fetchPromise) {
    return fetchPromise;
  }

  // Client-side: Fetch from static file
  fetchPromise = fetch('/data/stadium-sections.json')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch stadium sections: ${res.status}`);
      }
      return res.json();
    })
    .then((data: StadiumSections[]) => {
      cachedSectionsData = data;
      fetchPromise = null;
      return data;
    })
    .catch((err) => {
      fetchPromise = null;
      console.error('Failed to load stadium sections from JSON:', err);
      throw err;
    });

  return fetchPromise;
}

/**
 * Get sections for a specific stadium from JSON
 */
export async function fetchStadiumSectionsByIdJson(stadiumId: string): Promise<StadiumSection[]> {
  const allSections = await fetchAllStadiumSectionsJson();
  const stadiumData = allSections.find((s) => s.stadiumId === stadiumId);
  return stadiumData?.sections || [];
}

/**
 * Synchronous fallback that returns an empty array
 * Use getStadiumSectionsAsync for actual data loading
 */
export function getStadiumSections(stadiumId: string): StadiumSection[] {
  console.warn('getStadiumSections (sync) called - use getStadiumSectionsAsync instead');
  return [];
}
