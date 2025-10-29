// Stadium Data Aggregator
// Dynamic loading system for stadium-specific sections and obstructions
// IMPORTANT: This file uses dynamic imports to prevent bundling all stadium data

import { DetailedSection, Obstruction3D, StadiumComplete } from '../types/stadium-complete';

// Cache for loaded stadium data
const stadiumDataCache = new Map<string, StadiumComplete>();

/**
 * Dynamically loads section data for a specific stadium
 * @param stadiumId The stadium identifier
 * @returns Promise<DetailedSection[]> The stadium's sections or empty array if not found
 */
async function loadSections(stadiumId: string): Promise<DetailedSection[]> {
  try {
    switch (stadiumId) {
      // MLB stadiums
      case 'yankees':
        const { yankeesSections } = await import('./sections/mlb/yankees');
        return yankeesSections;
      case 'red-sox':
      case 'fenway-park':
        const { fenwayParkSections } = await import('./sections/mlb/fenway-park');
        return fenwayParkSections;
      case 'dodgers':
        const { dodgersSections } = await import('./sections/mlb/dodgers');
        return dodgersSections;
      case 'cubs':
      case 'wrigley-field':
        const { wrigleyFieldSections } = await import('./sections/mlb/wrigley-field');
        return wrigleyFieldSections;
      case 'mets':
        const { metsSections } = await import('./sections/mlb/mets');
        return metsSections;
      case 'giants':
      case 'oracle-park':
        const { oracleParkSections } = await import('./sections/mlb/oracle-park');
        return oracleParkSections;
      case 'padres':
        const { padresSections } = await import('./sections/mlb/padres');
        return padresSections;
      case 'orioles':
        const { oriolesSections } = await import('./sections/mlb/orioles');
        return oriolesSections;
      case 'pirates':
      case 'pnc-park':
        const { pncParkSections } = await import('./sections/mlb/pnc-park');
        return pncParkSections;
      case 'astros':
        const { astrosSections } = await import('./sections/mlb/astros');
        return astrosSections;
      case 'braves':
      case 'truist-park':
        const { truistParkSections } = await import('./sections/mlb/truist-park');
        return truistParkSections;
      case 'rockies':
        const { rockiesSections } = await import('./sections/mlb/rockies');
        return rockiesSections;
      case 'twins':
        const { twinsSections } = await import('./sections/mlb/twins');
        return twinsSections;
      case 'reds':
      case 'great-american-ballpark':
        const { greatAmericanBallparkSections } = await import('./sections/mlb/great-american-ballpark');
        return greatAmericanBallparkSections;
      case 'guardians':
        const { guardiansSections } = await import('./sections/mlb/guardians');
        return guardiansSections;
      case 'phillies':
        const { philliesSections } = await import('./sections/mlb/phillies');
        return philliesSections;
      case 'nationals':
        const { nationalsSections } = await import('./sections/mlb/nationals');
        return nationalsSections;
      case 'rangers':
        const { rangersSections } = await import('./sections/mlb/rangers');
        return rangersSections;
      case 'angels':
        const { angelsSections } = await import('./sections/mlb/angels');
        return angelsSections;
      case 'brewers':
        const { brewersSections } = await import('./sections/mlb/brewers');
        return brewersSections;
      case 'cardinals':
      case 'busch-stadium':
        const { buschstadiumSections } = await import('./sections/mlb/busch-stadium');
        return buschstadiumSections;
      case 'diamondbacks':
        const { diamondbacksSections } = await import('./sections/mlb/diamondbacks');
        return diamondbacksSections;
      case 'tigers':
        const { tigersSections } = await import('./sections/mlb/tigers');
        return tigersSections;
      case 'george-m-steinbrenner-field':
        const { georgeMSteinbrennerFieldSections } = await import('./sections/mlb/george-m-steinbrenner-field');
        return georgeMSteinbrennerFieldSections;
      case 'whitesox':
        const { whitesoxSections } = await import('./sections/mlb/whitesox');
        return whitesoxSections;
      case 'royals':
        const { royalsSections } = await import('./sections/mlb/royals');
        return royalsSections;
      case 'marlins':
        const { marlinsSections } = await import('./sections/mlb/marlins');
        return marlinsSections;
      case 'bluejays':
        const { bluejaysSections } = await import('./sections/mlb/bluejays');
        return bluejaysSections;
      case 'athletics':
        const { athleticsSections } = await import('./sections/mlb/athletics');
        return athleticsSections;
      case 'mariners':
        const { marinersSections } = await import('./sections/mlb/mariners');
        return marinersSections;
      case 'rays':
        const { raysSections } = await import('./sections/mlb/rays');
        return raysSections;

      // MiLB stadiums
      case 'las-vegas-aviators':
        const { lasvegasaviatorsSections } = await import('./sections/milb/aaa/las-vegas-aviators');
        return lasvegasaviatorsSections;

      // NFL stadiums
      case 'sofi-stadium':
        const { sofiStadiumSections } = await import('./sections/nfl/sofi-stadium');
        return sofiStadiumSections;

      default:
        console.warn(`No section data found for stadium: ${stadiumId}`);
        return [];
    }
  } catch (error) {
    console.error(`Error loading sections for ${stadiumId}:`, error);
    return [];
  }
}

/**
 * Dynamically loads obstruction data for a specific stadium
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
 * Get complete stadium data including sections and obstructions
 * Uses dynamic imports to load only the requested stadium data
 * @param stadiumId The stadium identifier
 * @returns Promise<StadiumComplete | null>
 */
export async function getStadiumCompleteData(stadiumId: string): Promise<StadiumComplete | null> {
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

  const completeData: StadiumComplete = {
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