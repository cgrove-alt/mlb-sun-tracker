// Dynamic stadium data loader for code splitting
import { StadiumSection } from './stadiumSections';

// Type for the stadium sections data structure
interface StadiumSectionsData {
  stadiumId: string;
  sections: StadiumSection[];
}

// Map of stadium IDs to their data loaders
const stadiumModules: Record<string, () => Promise<{ default: StadiumSection[] }>> = {
  angels: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'angels');
    return { default: data?.sections || [] };
  }),
  astros: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'astros');
    return { default: data?.sections || [] };
  }),
  athletics: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'athletics');
    return { default: data?.sections || [] };
  }),
  bluejays: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'bluejays');
    return { default: data?.sections || [] };
  }),
  braves: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'braves');
    return { default: data?.sections || [] };
  }),
  brewers: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'brewers');
    return { default: data?.sections || [] };
  }),
  cardinals: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'cardinals');
    return { default: data?.sections || [] };
  }),
  cubs: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'cubs');
    return { default: data?.sections || [] };
  }),
  diamondbacks: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'diamondbacks');
    return { default: data?.sections || [] };
  }),
  dodgers: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'dodgers');
    return { default: data?.sections || [] };
  }),
  giants: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'giants');
    return { default: data?.sections || [] };
  }),
  guardians: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'guardians');
    return { default: data?.sections || [] };
  }),
  mariners: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'mariners');
    return { default: data?.sections || [] };
  }),
  marlins: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'marlins');
    return { default: data?.sections || [] };
  }),
  mets: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'mets');
    return { default: data?.sections || [] };
  }),
  nationals: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'nationals');
    return { default: data?.sections || [] };
  }),
  orioles: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'orioles');
    return { default: data?.sections || [] };
  }),
  padres: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'padres');
    return { default: data?.sections || [] };
  }),
  phillies: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'phillies');
    return { default: data?.sections || [] };
  }),
  pirates: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'pirates');
    return { default: data?.sections || [] };
  }),
  rangers: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'rangers');
    return { default: data?.sections || [] };
  }),
  rays: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'rays');
    return { default: data?.sections || [] };
  }),
  reds: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'reds');
    return { default: data?.sections || [] };
  }),
  redsox: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'redsox');
    return { default: data?.sections || [] };
  }),
  rockies: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'rockies');
    return { default: data?.sections || [] };
  }),
  royals: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'royals');
    return { default: data?.sections || [] };
  }),
  tigers: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'tigers');
    return { default: data?.sections || [] };
  }),
  twins: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'twins');
    return { default: data?.sections || [] };
  }),
  whitesox: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'whitesox');
    return { default: data?.sections || [] };
  }),
  yankees: () => import('./stadiumSections').then(m => {
    const data = m.stadiumSections.find((s: StadiumSectionsData) => s.stadiumId === 'yankees');
    return { default: data?.sections || [] };
  })
};

// Cache for loaded stadium sections
const sectionCache = new Map<string, StadiumSection[]>();

// Load stadium sections dynamically
export async function loadStadiumSections(stadiumId: string): Promise<StadiumSection[]> {
  // Check cache first
  if (sectionCache.has(stadiumId)) {
    return sectionCache.get(stadiumId)!;
  }

  // Load the module
  const loader = stadiumModules[stadiumId];
  if (!loader) {
    console.warn(`No section data found for stadium: ${stadiumId}`);
    return [];
  }

  try {
    const module = await loader();
    const sections = module.default || [];
    
    // Cache the result
    sectionCache.set(stadiumId, sections);
    
    return sections;
  } catch (error) {
    console.error(`Error loading sections for stadium ${stadiumId}:`, error);
    return [];
  }
}

// Preload stadium sections for better performance
export function preloadStadiumSections(stadiumId: string): void {
  if (!sectionCache.has(stadiumId) && stadiumModules[stadiumId]) {
    loadStadiumSections(stadiumId).catch(console.error);
  }
}

// Clear cache if needed (for memory management)
export function clearStadiumCache(): void {
  sectionCache.clear();
}