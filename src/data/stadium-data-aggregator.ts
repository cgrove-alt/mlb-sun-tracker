// Stadium Data Aggregator
// Central system for loading stadium-specific sections and obstructions

import { DetailedSection, Obstruction3D } from '../types/stadium-complete';
import {
  getOfficialDetailedSections,
  hasOfficialInventory,
  OFFICIAL_MILB_SECTION_IDS,
  OFFICIAL_NFL_SECTION_IDS,
} from './officialSectionRegistry';


// Import MiLB sections
// Import other MiLB stadiums as they're created...

// Import NFL sections
// Import other NFL stadiums as they're created...

// Import obstructions

// Section data registry
// ---------------------------------------------------------------------------
// Lazy per-stadium data loaders.
//
// These used to be 69 static imports feeding two eagerly-populated registries.
// Because every export of this module then depended on all of them, ANY caller
// pulled all 30 MLB section files plus 29 obstruction files — one ~988 KB chunk
// containing every stadium — just to read one stadium's sections.
//
// As dynamic imports, webpack emits one small chunk per stadium and only the
// requested park is fetched. `hasSpecificData` deliberately reads the KEYS of
// these maps, which costs no data at all.
// ---------------------------------------------------------------------------

type SectionLoader = () => Promise<DetailedSection[]>;
type ObstructionLoader = () => Promise<Obstruction3D[]>;

const SECTION_LOADERS: Record<string, SectionLoader> = {

  // MLB
  'yankees': () => import('./sections/mlb/yankees').then(m => m.yankeesSections),
  'redsox': () =>
    import('./sections/mlb/redsox').then(
      m => m.redsoxSections ?? import('./sections/mlb/fenway-park').then(f => f.fenwayParkSections),
    ),
  'dodgers': () => import('./sections/mlb/dodgers').then(m => m.dodgersSections),
  'cubs': () => import('./sections/mlb/cubs').then(m => m.cubsSections),
  'mets': () => import('./sections/mlb/mets').then(m => m.metsSections),
  'giants': () => import('./sections/mlb/giants').then(m => m.giantsSections),
  'padres': () => import('./sections/mlb/padres').then(m => m.padresSections),
  'orioles': () => import('./sections/mlb/orioles').then(m => m.oriolesSections),
  'pirates': () => import('./sections/mlb/pirates').then(m => m.piratesSections),
  'astros': () => import('./sections/mlb/astros').then(m => m.astrosSections),
  'braves': () => import('./sections/mlb/braves').then(m => m.bravesSections),
  'rockies': () => import('./sections/mlb/rockies').then(m => m.rockiesSections),
  'twins': () => import('./sections/mlb/twins').then(m => m.twinsSections),
  'reds': () => import('./sections/mlb/reds').then(m => m.redsSections),
  'guardians': () => import('./sections/mlb/guardians').then(m => m.guardiansSections),
  'phillies': () => import('./sections/mlb/phillies').then(m => m.philliesSections),
  'nationals': () => import('./sections/mlb/nationals').then(m => m.nationalsSections),
  'rangers': () => import('./sections/mlb/rangers').then(m => m.rangersSections),
  'angels': () => import('./sections/mlb/angels').then(m => m.angelsSections),
  'brewers': () => import('./sections/mlb/brewers').then(m => m.brewersSections),
  'cardinals': () => import('./sections/mlb/cardinals').then(m => m.cardinalsSections),
  'diamondbacks': () => import('./sections/mlb/diamondbacks').then(m => m.diamondbacksSections),
  'tigers': () => import('./sections/mlb/tigers').then(m => m.tigersSections),
  // Rays returned to Tropicana Field (fixed-roof dome) for 2026. The Steinbrenner
  // Field fallback (their 2025 temporary home) is intentionally removed — that
  // venue is now only the Tampa Tarpons' (MiLB) home, not the Rays'.
  'rays': () => import('./sections/mlb/rays').then(m => m.raysSections),
  'whitesox': () => import('./sections/mlb/whitesox').then(m => m.whitesoxSections),
  'royals': () => import('./sections/mlb/royals').then(m => m.royalsSections),
  'marlins': () => import('./sections/mlb/marlins').then(m => m.marlinsSections),
  'bluejays': () => import('./sections/mlb/bluejays').then(m => m.bluejaysSections),
  'athletics': () => import('./sections/mlb/athletics').then(m => m.athleticsSections),
  'mariners': () => import('./sections/mlb/mariners').then(m => m.marinersSections),
};

// Obstruction data registry
const OBSTRUCTION_LOADERS: Record<string, ObstructionLoader> = {

  // MLB
  'yankees': () => import('./obstructions/mlb/yankees-obstructions').then(m => m.yankeeStadiumObstructions),
  'redsox': () => import('./obstructions/mlb/redsox-obstructions').then(m => m.redsoxObstructions),
  'dodgers': () => import('./obstructions/mlb/dodgers-obstructions').then(m => m.dodgersObstructions),
  'cubs': () => import('./obstructions/mlb/cubs-obstructions').then(m => m.cubsObstructions),
  'mets': () => import('./obstructions/mlb/mets-obstructions').then(m => m.metsObstructions),
  'giants': () => import('./obstructions/mlb/giants-obstructions').then(m => m.giantsObstructions),
  'padres': () => import('./obstructions/mlb/padres-obstructions').then(m => m.padresObstructions),
  'orioles': () => import('./obstructions/mlb/orioles-obstructions').then(m => m.oriolesObstructions),
  'pirates': () => import('./obstructions/mlb/pirates-obstructions').then(m => m.piratesObstructions),
  'astros': () => import('./obstructions/mlb/astros-obstructions').then(m => m.astrosObstructions),
  'braves': () => import('./obstructions/mlb/braves-obstructions').then(m => m.bravesObstructions),
  'rockies': () => import('./obstructions/mlb/rockies-obstructions').then(m => m.rockiesObstructions),
  'twins': () => import('./obstructions/mlb/twins-obstructions').then(m => m.twinsObstructions),
  'reds': () => import('./obstructions/mlb/reds-obstructions').then(m => m.redsObstructions),
  'guardians': () => import('./obstructions/mlb/guardians-obstructions').then(m => m.guardiansObstructions),
  'phillies': () => import('./obstructions/mlb/phillies-obstructions').then(m => m.philliesObstructions),
  'nationals': () => import('./obstructions/mlb/nationals-obstructions').then(m => m.nationalsObstructions),
  'rangers': () => import('./obstructions/mlb/rangers-obstructions').then(m => m.rangersObstructions),
  'angels': () => import('./obstructions/mlb/angels-obstructions').then(m => m.angelsObstructions),
  'brewers': () => import('./obstructions/mlb/brewers-obstructions').then(m => m.brewersObstructions),
  'cardinals': () => import('./obstructions/mlb/cardinals-obstructions').then(m => m.cardinalsObstructions),
  'diamondbacks': () => import('./obstructions/mlb/diamondbacks-obstructions').then(m => m.diamondbacksObstructions),
  'tigers': () => import('./obstructions/mlb/tigers-obstructions').then(m => m.tigersObstructions),
  'whitesox': () => import('./obstructions/mlb/whitesox-obstructions').then(m => m.whitesoxObstructions),
  'royals': () => import('./obstructions/mlb/royals-obstructions').then(m => m.royalsObstructions),
  'marlins': () => import('./obstructions/mlb/marlins-obstructions').then(m => m.marlinsObstructions),
  'bluejays': () => import('./obstructions/mlb/bluejays-obstructions').then(m => m.bluejaysObstructions),
  'athletics': () => import('./obstructions/mlb/athletics-obstructions').then(m => m.athleticsObstructions),
  'mariners': () => import('./obstructions/mlb/mariners-obstructions').then(m => m.marinersObstructions),
  'rays': () => import('./obstructions/mlb/rays-obstructions').then(m => m.raysObstructions),
  
  // MiLB - to be added
  // NFL - to be added
};

// Generate generic sections for stadiums without specific data
function generateGenericSections(
  stadiumId: string,
  league: 'MLB' | 'MiLB' | 'NFL'
): DetailedSection[] {
  const sections: DetailedSection[] = [];
  
  // Base configuration per league
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
    const seatsPerSection = config.seatsPerSection[levelIndex];
    
    for (let i = 0; i < numSections; i++) {
      sections.push({
        id: `${sectionId + i}`,
        name: `Section ${sectionId + i}`,
        level: level as any,
        baseAngle: i * angleStep,
        angleSpan: angleStep,
        rows: generateGenericRows(level, seatsPerSection),
        vertices3D: generateGenericVertices(i * angleStep, angleStep, level),
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

function generateGenericRows(level: string, totalSeats: number) {
  const rowCount = level === 'field' ? 10 : level === 'upper' ? 30 : 20;
  const seatsPerRow = Math.floor(totalSeats / rowCount);
  const baseElevation = level === 'field' ? 0 : level === 'upper' ? 80 : 30;
  
  return Array.from({ length: rowCount }, (_, i) => ({
    rowNumber: (i + 1).toString(),
    seats: seatsPerRow,
    elevation: baseElevation + (i * 2.5),
    depth: i * 2.8,
    covered: false
  }));
}

function generateGenericVertices(baseAngle: number, angleSpan: number, level: string) {
  const radius = level === 'field' ? 100 : level === 'upper' ? 250 : 150;
  const height = level === 'field' ? 0 : level === 'upper' ? 80 : 30;
  
  const toRad = (deg: number) => deg * Math.PI / 180;
  
  return [
    {
      x: radius * Math.cos(toRad(baseAngle)),
      y: radius * Math.sin(toRad(baseAngle)),
      z: height
    },
    {
      x: radius * Math.cos(toRad(baseAngle + angleSpan)),
      y: radius * Math.sin(toRad(baseAngle + angleSpan)),
      z: height
    },
    {
      x: (radius + 50) * Math.cos(toRad(baseAngle + angleSpan)),
      y: (radius + 50) * Math.sin(toRad(baseAngle + angleSpan)),
      z: height + 30
    },
    {
      x: (radius + 50) * Math.cos(toRad(baseAngle)),
      y: (radius + 50) * Math.sin(toRad(baseAngle)),
      z: height + 30
    }
  ];
}

// Generate generic obstructions
function generateGenericObstructions(league: 'MLB' | 'MiLB' | 'NFL'): Obstruction3D[] {
  const obstructions: Obstruction3D[] = [];
  
  // Upper deck overhang (common to most stadiums)
  obstructions.push({
    id: 'upper_deck_overhang',
    name: 'Upper Deck Overhang',
    type: 'overhang',
    geometry: {
      vertices: [
        { x: -100, y: 100, z: 60 },
        { x: 100, y: 100, z: 60 },
        { x: 100, y: 140, z: 60 },
        { x: -100, y: 140, z: 60 },
        { x: -100, y: 100, z: 65 },
        { x: 100, y: 100, z: 65 },
        { x: 100, y: 140, z: 65 },
        { x: -100, y: 140, z: 65 }
      ],
      faces: [
        [0, 1, 2, 3],
        [4, 7, 6, 5],
        [0, 4, 5, 1],
        [2, 6, 7, 3]
      ]
    },
    boundingBox: {
      min: { x: -100, y: 100, z: 60 },
      max: { x: 100, y: 140, z: 65 }
    },
    material: {
      opacity: 1.0,
      reflectivity: 0.2,
      color: '#808080'
    },
    castsShadow: true
  });
  
  // Add scoreboard for baseball stadiums
  if (league === 'MLB' || league === 'MiLB') {
    obstructions.push({
      id: 'scoreboard',
      name: 'Scoreboard',
      type: 'scoreboard',
      geometry: {
        vertices: [
          { x: -20, y: 380, z: 20 },
          { x: 20, y: 380, z: 20 },
          { x: 20, y: 382, z: 20 },
          { x: -20, y: 382, z: 20 },
          { x: -20, y: 380, z: 50 },
          { x: 20, y: 380, z: 50 },
          { x: 20, y: 382, z: 50 },
          { x: -20, y: 382, z: 50 }
        ],
        faces: [
          [0, 1, 2, 3],
          [4, 7, 6, 5],
          [0, 4, 5, 1]
        ]
      },
      boundingBox: {
        min: { x: -20, y: 380, z: 20 },
        max: { x: 20, y: 382, z: 50 }
      },
      material: {
        opacity: 1.0,
        reflectivity: 0.5,
        color: '#000000'
      },
      castsShadow: true
    });
  }
  
  // Add video board for NFL stadiums
  if (league === 'NFL') {
    obstructions.push({
      id: 'video_board',
      name: 'Video Board',
      type: 'scoreboard',
      geometry: {
        vertices: [
          { x: -40, y: -40, z: 100 },
          { x: 40, y: -40, z: 100 },
          { x: 40, y: 40, z: 100 },
          { x: -40, y: 40, z: 100 },
          { x: -40, y: -40, z: 120 },
          { x: 40, y: -40, z: 120 },
          { x: 40, y: 40, z: 120 },
          { x: -40, y: 40, z: 120 }
        ],
        faces: [
          [0, 1, 2, 3],
          [4, 7, 6, 5]
        ]
      },
      boundingBox: {
        min: { x: -40, y: -40, z: 100 },
        max: { x: 40, y: 40, z: 120 }
      },
      material: {
        opacity: 1.0,
        reflectivity: 0.7,
        color: '#000000'
      },
      castsShadow: true
    });
  }
  
  return obstructions;
}

// In-process memo so repeated lookups for the same park don't re-await the
// dynamic import (the module itself is cached by the bundler; this just avoids
// re-entering the promise machinery on every render/request).
const sectionCache = new Map<string, DetailedSection[]>();
const obstructionCache = new Map<string, Obstruction3D[]>();

// Main function to get complete stadium data
export async function getStadiumCompleteData(
  stadiumId: string,
  league: 'MLB' | 'MiLB' | 'NFL'
): Promise<{ sections: DetailedSection[], obstructions: Obstruction3D[] }> {
  const [sections, obstructions] = await Promise.all([
    getStadiumSections(stadiumId, league),
    getStadiumObstructions(stadiumId, league),
  ]);
  return { sections, obstructions };
}

// Get sections only
export async function getStadiumSections(
  stadiumId: string,
  league: 'MLB' | 'MiLB' | 'NFL'
): Promise<DetailedSection[]> {
  const cached = sectionCache.get(stadiumId);
  if (cached) return cached;

  const official = getOfficialDetailedSections(stadiumId);
  if (official) {
    sectionCache.set(stadiumId, official);
    return official;
  }

  const loader = SECTION_LOADERS[stadiumId];
  if (!loader) {
    return [];
  }
  const sections = await loader();

  sectionCache.set(stadiumId, sections);
  return sections;
}

// Get obstructions only
export async function getStadiumObstructions(
  stadiumId: string,
  league: 'MLB' | 'MiLB' | 'NFL'
): Promise<Obstruction3D[]> {
  const cached = obstructionCache.get(stadiumId);
  if (cached) return cached;

  const loader = OBSTRUCTION_LOADERS[stadiumId];
  if (!loader) {
    return [];
  }
  const obstructions = await loader();

  obstructionCache.set(stadiumId, obstructions);
  return obstructions;
}

// Check if stadium has specific data.
// Stays synchronous on purpose: it only needs to know WHICH ids are registered,
// which is a property of the loader maps' keys and costs no data loading.
export function hasSpecificData(stadiumId: string): {
  hasSections: boolean;
  hasObstructions: boolean;
} {
  return {
    hasSections: !!SECTION_LOADERS[stadiumId] || hasOfficialInventory(stadiumId),
    hasObstructions: !!OBSTRUCTION_LOADERS[stadiumId]
  };
}

// Get coverage statistics
export function getCoverageStats(): {
  totalStadiums: number;
  stadiumsWithSections: number;
  stadiumsWithObstructions: number;
  coveragePercentage: number;
} {
  const totalStadiums = 187; // 31 MLB + 122 MiLB + 34 NFL
  const stadiumsWithSections = new Set([
    ...Object.keys(SECTION_LOADERS),
    ...OFFICIAL_MILB_SECTION_IDS,
    ...OFFICIAL_NFL_SECTION_IDS,
  ]).size;
  const stadiumsWithObstructions = Object.keys(OBSTRUCTION_LOADERS).length;

  return {
    totalStadiums,
    stadiumsWithSections,
    stadiumsWithObstructions,
    coveragePercentage: ((stadiumsWithSections + stadiumsWithObstructions) / (totalStadiums * 2)) * 100
  };
}

/** Registered stadium ids, without loading any section data. */
export const REGISTERED_SECTION_IDS: readonly string[] = [
  ...Object.keys(SECTION_LOADERS),
  ...OFFICIAL_MILB_SECTION_IDS,
  ...OFFICIAL_NFL_SECTION_IDS,
];
export const REGISTERED_OBSTRUCTION_IDS: readonly string[] = Object.keys(OBSTRUCTION_LOADERS);
