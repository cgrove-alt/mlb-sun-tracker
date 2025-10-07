// Dynamic loader for stadium guides with code splitting
import { StadiumGuide } from '../stadiumGuides';

// Cache for loaded guides
const guideCache: Map<string, Record<string, StadiumGuide>> = new Map();
const loadingPromises: Map<string, Promise<Record<string, StadiumGuide>>> = new Map();

// Lazy load guides by league
export async function loadGuidesByLeague(
  league: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'
): Promise<Record<string, StadiumGuide>> {
  // Check cache first
  const cacheKey = league;
  if (guideCache.has(cacheKey)) {
    return guideCache.get(cacheKey)!;
  }

  // Check if already loading
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!;
  }

  // Create loading promise
  let loadPromise: Promise<Record<string, StadiumGuide>>;

  switch (league) {
    case 'MLB':
      loadPromise = Promise.all([
        import(/* webpackChunkName: "mlb-guides-1" */ './mlbStadiumGuides'),
        import(/* webpackChunkName: "mlb-guides-2" */ './mlbStadiumGuidesExtended'),
        import(/* webpackChunkName: "mlb-guides-3" */ './mlbStadiumGuidesRemainder'),
        import(/* webpackChunkName: "mlb-guides-4" */ './mlbStadiumGuidesFinal'),
      ]).then(modules => ({
        ...modules[0].mlbStadiumGuides,
        ...modules[1].mlbStadiumGuidesExtended,
        ...modules[2].mlbStadiumGuidesRemainder,
        ...modules[3].mlbStadiumGuidesFinal,
      }));
      break;

    case 'NFL':
      loadPromise = import(/* webpackChunkName: "nfl-guides" */ './nflStadiumGuides')
        .then(module => module.nflStadiumGuides);
      break;

    case 'AAA':
      loadPromise = import(/* webpackChunkName: "aaa-guides" */ './aaaStadiumGuides')
        .then(module => module.aaaStadiumGuides);
      break;

    case 'AA':
      loadPromise = import(/* webpackChunkName: "aa-guides" */ './aaStadiumGuides')
        .then(module => module.aaStadiumGuides);
      break;

    case 'A+':
      loadPromise = import(/* webpackChunkName: "aplus-guides" */ './aPlusStadiumGuides')
        .then(module => module.aPlusStadiumGuides);
      break;

    case 'A':
      loadPromise = import(/* webpackChunkName: "singlea-guides" */ './singleAStadiumGuides')
        .then(module => module.singleAStadiumGuides);
      break;

    default:
      loadPromise = Promise.resolve({});
  }

  // Store promise while loading
  loadingPromises.set(cacheKey, loadPromise);

  try {
    const guides = await loadPromise;
    guideCache.set(cacheKey, guides);
    loadingPromises.delete(cacheKey);
    return guides;
  } catch (error) {
    loadingPromises.delete(cacheKey);
    throw error;
  }
}

// Load specific stadium guide
export async function loadStadiumGuide(
  stadiumId: string,
  league?: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'
): Promise<StadiumGuide | undefined> {
  // If we know the league, load only that league's data
  if (league) {
    const guides = await loadGuidesByLeague(league);
    return guides[stadiumId];
  }

  // Otherwise, we need to check each league
  // Start with most common (MLB) first for performance
  const leagueOrder: Array<'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'> =
    ['MLB', 'AAA', 'AA', 'A+', 'A', 'NFL'];

  for (const checkLeague of leagueOrder) {
    const guides = await loadGuidesByLeague(checkLeague);
    if (guides[stadiumId]) {
      return guides[stadiumId];
    }
  }

  return undefined;
}

// Prefetch guides for better performance
export function prefetchGuides(league: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A') {
  // Fire and forget - just start the loading
  loadGuidesByLeague(league).catch(() => {
    // Silently fail prefetch
  });
}

// Clear cache if needed (for memory management)
export function clearGuideCache(league?: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A') {
  if (league) {
    guideCache.delete(league);
    loadingPromises.delete(league);
  } else {
    guideCache.clear();
    loadingPromises.clear();
  }
}

// Get all cached guides
export function getCachedGuides(): Record<string, StadiumGuide> {
  const allGuides: Record<string, StadiumGuide> = {};

  guideCache.forEach(guides => {
    Object.assign(allGuides, guides);
  });

  return allGuides;
}

// Check if guides are loaded
export function areGuidesLoaded(league: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'): boolean {
  return guideCache.has(league);
}