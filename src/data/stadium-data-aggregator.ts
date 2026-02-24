// Stadium Data Aggregator
// Central system for loading stadium-specific sections and obstructions
// Uses lazy loading to avoid importing all stadium data at module init

import { DetailedSection, Obstruction3D } from '../types/stadium-complete';

// Lazy import maps: stadium ID → dynamic import function
const SECTION_IMPORTS: Record<string, () => Promise<Record<string, any>>> = {
  // MLB
  'yankees': () => import('./sections/mlb/yankees'),
  'red-sox': () => import('./sections/mlb/redsox'),
  'dodgers': () => import('./sections/mlb/dodgers'),
  'cubs': () => import('./sections/mlb/cubs'),
  'mets': () => import('./sections/mlb/mets'),
  'giants': () => import('./sections/mlb/giants'),
  'padres': () => import('./sections/mlb/padres'),
  'orioles': () => import('./sections/mlb/orioles'),
  'pirates': () => import('./sections/mlb/pirates'),
  'astros': () => import('./sections/mlb/astros'),
  'braves': () => import('./sections/mlb/braves'),
  'rockies': () => import('./sections/mlb/rockies'),
  'twins': () => import('./sections/mlb/twins'),
  'reds': () => import('./sections/mlb/reds'),
  'guardians': () => import('./sections/mlb/guardians'),
  'phillies': () => import('./sections/mlb/phillies'),
  'nationals': () => import('./sections/mlb/nationals'),
  'rangers': () => import('./sections/mlb/rangers'),
  'angels': () => import('./sections/mlb/angels'),
  'brewers': () => import('./sections/mlb/brewers'),
  'cardinals': () => import('./sections/mlb/cardinals'),
  'diamondbacks': () => import('./sections/mlb/diamondbacks'),
  'tigers': () => import('./sections/mlb/tigers'),
  'white-sox': () => import('./sections/mlb/whitesox'),
  'royals': () => import('./sections/mlb/royals'),
  'marlins': () => import('./sections/mlb/marlins'),
  'blue-jays': () => import('./sections/mlb/bluejays'),
  'athletics': () => import('./sections/mlb/athletics'),
  'mariners': () => import('./sections/mlb/mariners'),
  'rays': () => import('./sections/mlb/rays'),
  // MiLB
  'las-vegas-aviators': () => import('./sections/milb/aaa/las-vegas-aviators'),
  // NFL
  'sofi-stadium': () => import('./sections/nfl/sofi-stadium'),
};

const OBSTRUCTION_IMPORTS: Record<string, () => Promise<Record<string, any>>> = {
  'yankees': () => import('./obstructions/mlb/yankees-obstructions'),
  'red-sox': () => import('./obstructions/mlb/redsox-obstructions'),
  'dodgers': () => import('./obstructions/mlb/dodgers-obstructions'),
  'cubs': () => import('./obstructions/mlb/cubs-obstructions'),
  'mets': () => import('./obstructions/mlb/mets-obstructions'),
  'giants': () => import('./obstructions/mlb/giants-obstructions'),
  'padres': () => import('./obstructions/mlb/padres-obstructions'),
  'orioles': () => import('./obstructions/mlb/orioles-obstructions'),
  'pirates': () => import('./obstructions/mlb/pirates-obstructions'),
  'astros': () => import('./obstructions/mlb/astros-obstructions'),
  'braves': () => import('./obstructions/mlb/braves-obstructions'),
  'rockies': () => import('./obstructions/mlb/rockies-obstructions'),
  'twins': () => import('./obstructions/mlb/twins-obstructions'),
  'reds': () => import('./obstructions/mlb/reds-obstructions'),
  'guardians': () => import('./obstructions/mlb/guardians-obstructions'),
  'phillies': () => import('./obstructions/mlb/phillies-obstructions'),
  'nationals': () => import('./obstructions/mlb/nationals-obstructions'),
  'rangers': () => import('./obstructions/mlb/rangers-obstructions'),
  'angels': () => import('./obstructions/mlb/angels-obstructions'),
  'brewers': () => import('./obstructions/mlb/brewers-obstructions'),
  'cardinals': () => import('./obstructions/mlb/cardinals-obstructions'),
  'diamondbacks': () => import('./obstructions/mlb/diamondbacks-obstructions'),
  'tigers': () => import('./obstructions/mlb/tigers-obstructions'),
  'white-sox': () => import('./obstructions/mlb/whitesox-obstructions'),
  'royals': () => import('./obstructions/mlb/royals-obstructions'),
  'marlins': () => import('./obstructions/mlb/marlins-obstructions'),
  'blue-jays': () => import('./obstructions/mlb/bluejays-obstructions'),
  'athletics': () => import('./obstructions/mlb/athletics-obstructions'),
  'mariners': () => import('./obstructions/mlb/mariners-obstructions'),
  'rays': () => import('./obstructions/mlb/rays-obstructions'),
};

// Cache loaded data so each stadium is only imported once
const sectionCache = new Map<string, DetailedSection[]>();
const obstructionCache = new Map<string, Obstruction3D[]>();

// Extract the first array export from a module
function extractArray<T>(mod: Record<string, unknown>): T[] {
  for (const key of Object.keys(mod)) {
    if (Array.isArray(mod[key])) return mod[key] as T[];
  }
  return [];
}

// Generate generic sections for stadiums without specific data
function generateGenericSections(
  stadiumId: string,
  league: 'MLB' | 'MiLB' | 'NFL'
): DetailedSection[] {
  const sections: DetailedSection[] = [];
  const config = league === 'NFL' ? {
    levels: ['field', 'lower', 'club', 'upper'],
    sectionsPerLevel: [4, 32, 16, 32],
    seatsPerSection: [200, 600, 400, 500]
  } : league === 'MLB' ? {
    levels: ['field', 'lower', 'upper'],
    sectionsPerLevel: [8, 20, 16],
    seatsPerSection: [150, 400, 350]
  } : {
    levels: ['field', 'lower'],
    sectionsPerLevel: [6, 12],
    seatsPerSection: [100, 250]
  };

  let sectionId = 100;
  config.levels.forEach((level, levelIndex) => {
    const numSections = config.sectionsPerLevel[levelIndex];
    const angleStep = 360 / numSections;
    for (let i = 0; i < numSections; i++) {
      sections.push({
        id: `${sectionId + i}`,
        name: `Section ${sectionId + i}`,
        level: level as any,
        baseAngle: i * angleStep,
        angleSpan: angleStep,
        rows: [],
        vertices3D: [],
        covered: false,
        price: level === 'field' ? 'premium' : level === 'upper' ? 'value' : 'moderate',
        distance: level === 'field' ? 100 : level === 'upper' ? 250 : 150,
        height: level === 'field' ? 0 : level === 'upper' ? 80 : 30,
        rake: level === 'upper' ? 32 : 25,
        viewQuality: level === 'field' ? 'excellent' : level === 'upper' ? 'fair' : 'good'
      });
    }
    sectionId += 100;
  });
  return sections;
}

// Generate generic obstructions
function generateGenericObstructions(league: 'MLB' | 'MiLB' | 'NFL'): Obstruction3D[] {
  return [{
    id: 'upper_deck_overhang',
    name: 'Upper Deck Overhang',
    type: 'overhang',
    geometry: {
      vertices: [
        { x: -100, y: 100, z: 60 }, { x: 100, y: 100, z: 60 },
        { x: 100, y: 140, z: 60 }, { x: -100, y: 140, z: 60 },
        { x: -100, y: 100, z: 65 }, { x: 100, y: 100, z: 65 },
        { x: 100, y: 140, z: 65 }, { x: -100, y: 140, z: 65 }
      ],
      faces: [[0,1,2,3], [4,7,6,5], [0,4,5,1], [2,6,7,3]]
    },
    boundingBox: { min: { x: -100, y: 100, z: 60 }, max: { x: 100, y: 140, z: 65 } },
    material: { opacity: 1.0, reflectivity: 0.2, color: '#808080' },
    castsShadow: true
  }];
}

// Synchronous getters (return cached data or generic fallback)
// Used by existing consumers that call these synchronously

export function getStadiumSections(stadiumId: string, league: 'MLB' | 'MiLB' | 'NFL'): DetailedSection[] {
  return sectionCache.get(stadiumId) || generateGenericSections(stadiumId, league);
}

export function getStadiumObstructions(stadiumId: string, league: 'MLB' | 'MiLB' | 'NFL' = 'MLB'): Obstruction3D[] {
  return obstructionCache.get(stadiumId) || generateGenericObstructions(league);
}

// Async loader - call this to ensure stadium data is loaded before using sync getters
export async function loadStadiumData(stadiumId: string): Promise<void> {
  const promises: Promise<void>[] = [];

  if (!sectionCache.has(stadiumId) && SECTION_IMPORTS[stadiumId]) {
    promises.push(
      SECTION_IMPORTS[stadiumId]().then(mod => {
        sectionCache.set(stadiumId, extractArray<DetailedSection>(mod as Record<string, unknown>));
      }).catch(() => { /* use generic fallback */ })
    );
  }

  if (!obstructionCache.has(stadiumId) && OBSTRUCTION_IMPORTS[stadiumId]) {
    promises.push(
      OBSTRUCTION_IMPORTS[stadiumId]().then(mod => {
        obstructionCache.set(stadiumId, extractArray<Obstruction3D>(mod as Record<string, unknown>));
      }).catch(() => { /* use generic fallback */ })
    );
  }

  await Promise.all(promises);
}

// Get complete stadium data synchronously (returns cached or generic data)
// Call loadStadiumData() first for specific data, or use this directly for generic fallback
export function getStadiumCompleteData(
  stadiumId: string,
  league: 'MLB' | 'MiLB' | 'NFL' = 'MLB'
): { sections: DetailedSection[], obstructions: Obstruction3D[] } {
  return {
    sections: getStadiumSections(stadiumId, league),
    obstructions: getStadiumObstructions(stadiumId, league),
  };
}

// Check if stadium has specific data
export function hasSpecificData(stadiumId: string): {
  hasSections: boolean;
  hasObstructions: boolean;
} {
  return {
    hasSections: !!SECTION_IMPORTS[stadiumId],
    hasObstructions: !!OBSTRUCTION_IMPORTS[stadiumId]
  };
}
