// Stadium Data Aggregator
// JSON loading system for stadium-specific sections and obstructions
// IMPORTANT: This file fetches JSON data on-demand to prevent bundling all stadium data

import { DetailedSection, Obstruction3D } from '../types/stadium-complete';

// Simplified type for loaded stadium data (just sections and obstructions)
export interface StadiumSectionsData {
  id: string;
  sections: DetailedSection[];
  obstructions: Obstruction3D[];
}

// Cache for loaded stadium data
const stadiumDataCache = new Map<string, StadiumSectionsData>();

// Stadium ID to filename mapping
const STADIUM_FILE_MAP: Record<string, { league: string; file: string }> = {
  // MLB stadiums
  'yankees': { league: 'mlb', file: 'yankees' },
  'red-sox': { league: 'mlb', file: 'fenway-park' },
  'fenway-park': { league: 'mlb', file: 'fenway-park' },
  'dodgers': { league: 'mlb', file: 'dodgers' },
  'cubs': { league: 'mlb', file: 'wrigley-field' },
  'wrigley-field': { league: 'mlb', file: 'wrigley-field' },
  'mets': { league: 'mlb', file: 'mets' },
  'giants': { league: 'mlb', file: 'oracle-park' },
  'oracle-park': { league: 'mlb', file: 'oracle-park' },
  'padres': { league: 'mlb', file: 'padres' },
  'orioles': { league: 'mlb', file: 'orioles' },
  'pirates': { league: 'mlb', file: 'pnc-park' },
  'pnc-park': { league: 'mlb', file: 'pnc-park' },
  'astros': { league: 'mlb', file: 'astros' },
  'braves': { league: 'mlb', file: 'truist-park' },
  'truist-park': { league: 'mlb', file: 'truist-park' },
  'rockies': { league: 'mlb', file: 'rockies' },
  'twins': { league: 'mlb', file: 'twins' },
  'reds': { league: 'mlb', file: 'great-american-ballpark' },
  'great-american-ballpark': { league: 'mlb', file: 'great-american-ballpark' },
  'guardians': { league: 'mlb', file: 'guardians' },
  'phillies': { league: 'mlb', file: 'phillies' },
  'nationals': { league: 'mlb', file: 'nationals' },
  'rangers': { league: 'mlb', file: 'rangers' },
  'angels': { league: 'mlb', file: 'angels' },
  'brewers': { league: 'mlb', file: 'brewers' },
  'cardinals': { league: 'mlb', file: 'busch-stadium' },
  'busch-stadium': { league: 'mlb', file: 'busch-stadium' },
  'diamondbacks': { league: 'mlb', file: 'diamondbacks' },
  'tigers': { league: 'mlb', file: 'tigers' },
  'george-m-steinbrenner-field': { league: 'mlb', file: 'george-m-steinbrenner-field' },
  'whitesox': { league: 'mlb', file: 'whitesox' },
  'royals': { league: 'mlb', file: 'royals' },
  'marlins': { league: 'mlb', file: 'marlins' },
  'bluejays': { league: 'mlb', file: 'bluejays' },
  'athletics': { league: 'mlb', file: 'athletics' },
  'mariners': { league: 'mlb', file: 'mariners' },
  'rays': { league: 'mlb', file: 'rays' },
  'redsox': { league: 'mlb', file: 'redsox' },

  // MiLB stadiums
  'las-vegas-aviators': { league: 'milb/aaa', file: 'las-vegas-aviators' },

  // NFL stadiums
  'sofi-stadium': { league: 'nfl', file: 'sofi-stadium' }
};

/**
 * Fetches JSON data from the public directory
 * Handles both server-side and client-side environments
 * @param path Path relative to /data/sections/
 * @returns Promise<any> The parsed JSON data
 */
async function fetchJSON(path: string): Promise<any> {
  try {
    // Check if we're on the server (Node.js) or client (browser)
    if (typeof window === 'undefined') {
      // Server-side: use fs to read the file
      const fs = await import('fs');
      const pathModule = await import('path');
      const fullPath = pathModule.join(process.cwd(), 'public', 'data', 'sections', path);

      if (!fs.existsSync(fullPath)) {
        console.warn(`File not found: ${fullPath}`);
        return null;
      }

      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      return JSON.parse(fileContent);
    } else {
      // Client-side: use fetch
      const response = await fetch(`/data/sections/${path}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
      }
      return await response.json();
    }
  } catch (error) {
    console.error(`Error loading JSON from ${path}:`, error);
    return null;
  }
}

/**
 * Loads section data for a specific stadium from JSON
 * @param stadiumId The stadium identifier
 * @returns Promise<DetailedSection[]> The stadium's sections or empty array if not found
 */
async function loadSections(stadiumId: string): Promise<DetailedSection[]> {
  try {
    const mapping = STADIUM_FILE_MAP[stadiumId];
    if (!mapping) {
      console.warn(`No file mapping found for stadium: ${stadiumId}`);
      return [];
    }

    const path = `${mapping.league}/${mapping.file}.json`;
    const data = await fetchJSON(path);
    return data || [];
  } catch (error) {
    console.error(`Error loading sections for ${stadiumId}:`, error);
    return [];
  }
}

/**
 * Loads obstruction data for a specific stadium (still using dynamic imports for now)
 * @param stadiumId The stadium identifier
 * @returns Promise<Obstruction3D[]> The stadium's obstructions or empty array if not found
 */
async function loadObstructions(stadiumId: string): Promise<Obstruction3D[]> {
  try {
    switch (stadiumId) {
      case 'yankees':
        const { yankeeStadiumObstructions } = await import('./obstructions/mlb/yankees-obstructions');
        return yankeeStadiumObstructions;
      case 'red-sox':
      case 'fenway-park':
        const { redsoxObstructions } = await import('./obstructions/mlb/redsox-obstructions');
        return redsoxObstructions;
      case 'dodgers':
        const { dodgersObstructions } = await import('./obstructions/mlb/dodgers-obstructions');
        return dodgersObstructions;
      case 'cubs':
      case 'wrigley-field':
        const { cubsObstructions } = await import('./obstructions/mlb/cubs-obstructions');
        return cubsObstructions;
      case 'mets':
        const { metsObstructions } = await import('./obstructions/mlb/mets-obstructions');
        return metsObstructions;
      case 'giants':
      case 'oracle-park':
        const { giantsObstructions } = await import('./obstructions/mlb/giants-obstructions');
        return giantsObstructions;
      case 'padres':
        const { padresObstructions } = await import('./obstructions/mlb/padres-obstructions');
        return padresObstructions;
      case 'orioles':
        const { oriolesObstructions } = await import('./obstructions/mlb/orioles-obstructions');
        return oriolesObstructions;
      case 'pirates':
      case 'pnc-park':
        const { piratesObstructions } = await import('./obstructions/mlb/pirates-obstructions');
        return piratesObstructions;
      case 'astros':
        const { astrosObstructions } = await import('./obstructions/mlb/astros-obstructions');
        return astrosObstructions;
      case 'braves':
      case 'truist-park':
        const { bravesObstructions } = await import('./obstructions/mlb/braves-obstructions');
        return bravesObstructions;
      case 'rockies':
        const { rockiesObstructions } = await import('./obstructions/mlb/rockies-obstructions');
        return rockiesObstructions;
      case 'twins':
        const { twinsObstructions } = await import('./obstructions/mlb/twins-obstructions');
        return twinsObstructions;
      case 'reds':
      case 'great-american-ballpark':
        const { redsObstructions } = await import('./obstructions/mlb/reds-obstructions');
        return redsObstructions;
      case 'guardians':
        const { guardiansObstructions } = await import('./obstructions/mlb/guardians-obstructions');
        return guardiansObstructions;
      case 'phillies':
        const { philliesObstructions } = await import('./obstructions/mlb/phillies-obstructions');
        return philliesObstructions;
      case 'nationals':
        const { nationalsObstructions } = await import('./obstructions/mlb/nationals-obstructions');
        return nationalsObstructions;
      case 'rangers':
        const { rangersObstructions } = await import('./obstructions/mlb/rangers-obstructions');
        return rangersObstructions;
      case 'angels':
        const { angelsObstructions } = await import('./obstructions/mlb/angels-obstructions');
        return angelsObstructions;
      case 'brewers':
        const { brewersObstructions } = await import('./obstructions/mlb/brewers-obstructions');
        return brewersObstructions;
      case 'cardinals':
      case 'busch-stadium':
        const { cardinalsObstructions } = await import('./obstructions/mlb/cardinals-obstructions');
        return cardinalsObstructions;
      case 'diamondbacks':
        const { diamondbacksObstructions } = await import('./obstructions/mlb/diamondbacks-obstructions');
        return diamondbacksObstructions;
      case 'tigers':
        const { tigersObstructions } = await import('./obstructions/mlb/tigers-obstructions');
        return tigersObstructions;
      case 'whitesox':
        const { whitesoxObstructions } = await import('./obstructions/mlb/whitesox-obstructions');
        return whitesoxObstructions;
      case 'royals':
        const { royalsObstructions } = await import('./obstructions/mlb/royals-obstructions');
        return royalsObstructions;
      case 'marlins':
        const { marlinsObstructions } = await import('./obstructions/mlb/marlins-obstructions');
        return marlinsObstructions;
      case 'bluejays':
        const { bluejaysObstructions } = await import('./obstructions/mlb/bluejays-obstructions');
        return bluejaysObstructions;
      case 'athletics':
        const { athleticsObstructions } = await import('./obstructions/mlb/athletics-obstructions');
        return athleticsObstructions;
      case 'mariners':
        const { marinersObstructions } = await import('./obstructions/mlb/mariners-obstructions');
        return marinersObstructions;
      case 'rays':
        const { raysObstructions } = await import('./obstructions/mlb/rays-obstructions');
        return raysObstructions;

      default:
        // Many stadiums don't have obstruction data yet
        return [];
    }
  } catch (error) {
    // Obstructions are optional - many stadiums don't have them yet
    return [];
  }
}

/**
 * Get stadium sections and obstructions data
 * Uses JSON loading to avoid bundling all stadium data
 * @param stadiumId The stadium identifier
 * @returns Promise<StadiumSectionsData | null>
 */
export async function getStadiumCompleteData(stadiumId: string): Promise<StadiumSectionsData | null> {
  if (!stadiumId) {
    console.warn('No stadium ID provided');
    return null;
  }

  // Check cache first
  if (stadiumDataCache.has(stadiumId)) {
    return stadiumDataCache.get(stadiumId)!;
  }

  // Load sections and obstructions in parallel
  const [sections, obstructions] = await Promise.all([
    loadSections(stadiumId),
    loadObstructions(stadiumId)
  ]);

  if (!sections || sections.length === 0) {
    console.warn(`No data available for stadium: ${stadiumId}`);
    return null;
  }

  const completeData: StadiumSectionsData = {
    id: stadiumId,
    sections,
    obstructions
  };

  // Cache the result
  stadiumDataCache.set(stadiumId, completeData);

  return completeData;
}

/**
 * Preload stadium data for faster access later
 * @param stadiumId The stadium identifier to preload
 */
export async function preloadStadiumData(stadiumId: string): Promise<void> {
  await getStadiumCompleteData(stadiumId);
}

/**
 * Clear the stadium data cache
 */
export function clearStadiumDataCache(): void {
  stadiumDataCache.clear();
}

/**
 * Get all available stadium IDs
 * Note: This returns a static list to avoid importing all data
 */
export function getAvailableStadiumIds(): string[] {
  return [
    // MLB
    'yankees', 'red-sox', 'dodgers', 'cubs', 'mets', 'giants', 'padres',
    'orioles', 'pirates', 'astros', 'braves', 'rockies', 'twins', 'reds',
    'guardians', 'phillies', 'nationals', 'rangers', 'angels', 'brewers',
    'cardinals', 'diamondbacks', 'tigers', 'whitesox', 'royals', 'marlins',
    'bluejays', 'athletics', 'mariners', 'rays',
    // MiLB
    'las-vegas-aviators',
    // NFL
    'sofi-stadium'
  ];
}