// Stadium Data Aggregator
// Central system for loading stadium-specific sections and obstructions

import { DetailedSection, Obstruction3D, StadiumComplete } from '../types/stadium-complete';

// Import MLB sections
import { yankeesSections } from './sections/mlb/yankees';
import { fenwayParkSections } from './sections/mlb/fenway-park';
import { dodgersSections } from './sections/mlb/dodgers';
import { wrigleyFieldSections } from './sections/mlb/wrigley-field';
import { metsSections } from './sections/mlb/mets';
import { oracleParkSections } from './sections/mlb/oracle-park';
import { padresSections } from './sections/mlb/padres';
import { oriolesSections } from './sections/mlb/orioles';
import { pncParkSections } from './sections/mlb/pnc-park';
import { astrosSections } from './sections/mlb/astros';
import { truistParkSections } from './sections/mlb/truist-park';
import { rockiesSections } from './sections/mlb/rockies';
import { twinsSections } from './sections/mlb/twins';
import { greatAmericanBallparkSections } from './sections/mlb/great-american-ballpark';
import { guardiansSections } from './sections/mlb/guardians';
import { philliesSections } from './sections/mlb/phillies';
import { nationalsSections } from './sections/mlb/nationals';
import { rangersSections } from './sections/mlb/rangers';
import { angelsSections } from './sections/mlb/angels';
import { brewersSections } from './sections/mlb/brewers';
import { buschstadiumSections } from './sections/mlb/busch-stadium';
import { diamondbacksSections } from './sections/mlb/diamondbacks';
import { tigersSections } from './sections/mlb/tigers';
import { georgeMSteinbrennerFieldSections } from './sections/mlb/george-m-steinbrenner-field';
import { whitesoxSections } from './sections/mlb/whitesox';
import { royalsSections } from './sections/mlb/royals';
import { marlinsSections } from './sections/mlb/marlins';
import { bluejaysSections } from './sections/mlb/bluejays';
import { athleticsSections } from './sections/mlb/athletics';
import { marinersSections } from './sections/mlb/mariners';
import { raysSections } from './sections/mlb/rays';
import { cubsSections } from './sections/mlb/cubs';
import { giantsSections } from './sections/mlb/giants';
import { redsoxSections } from './sections/mlb/redsox';
import { redsSections } from './sections/mlb/reds';
import { cardinalsSections } from './sections/mlb/cardinals';
import { bravesSections } from './sections/mlb/braves';
import { piratesSections } from './sections/mlb/pirates';

// Import MiLB sections
import { lasvegasaviatorsSections } from './sections/milb/aaa/las-vegas-aviators';
// Import other MiLB stadiums as they're created...

// Import NFL sections
import { sofiStadiumSections } from './sections/nfl/sofi-stadium';
// Import other NFL stadiums as they're created...

// Import obstructions
import { yankeeStadiumObstructions } from './obstructions/mlb/yankees-obstructions';
import { redsoxObstructions } from './obstructions/mlb/redsox-obstructions';
import { dodgersObstructions } from './obstructions/mlb/dodgers-obstructions';
import { cubsObstructions } from './obstructions/mlb/cubs-obstructions';
import { metsObstructions } from './obstructions/mlb/mets-obstructions';
import { giantsObstructions } from './obstructions/mlb/giants-obstructions';
import { padresObstructions } from './obstructions/mlb/padres-obstructions';
import { oriolesObstructions } from './obstructions/mlb/orioles-obstructions';
import { piratesObstructions } from './obstructions/mlb/pirates-obstructions';
import { astrosObstructions } from './obstructions/mlb/astros-obstructions';
import { bravesObstructions } from './obstructions/mlb/braves-obstructions';
import { rockiesObstructions } from './obstructions/mlb/rockies-obstructions';
import { twinsObstructions } from './obstructions/mlb/twins-obstructions';
import { redsObstructions } from './obstructions/mlb/reds-obstructions';
import { guardiansObstructions } from './obstructions/mlb/guardians-obstructions';
import { philliesObstructions } from './obstructions/mlb/phillies-obstructions';
import { nationalsObstructions } from './obstructions/mlb/nationals-obstructions';
import { rangersObstructions } from './obstructions/mlb/rangers-obstructions';
import { angelsObstructions } from './obstructions/mlb/angels-obstructions';
import { brewersObstructions } from './obstructions/mlb/brewers-obstructions';
import { cardinalsObstructions } from './obstructions/mlb/cardinals-obstructions';
import { diamondbacksObstructions } from './obstructions/mlb/diamondbacks-obstructions';
import { tigersObstructions } from './obstructions/mlb/tigers-obstructions';
import { whitesoxObstructions } from './obstructions/mlb/whitesox-obstructions';
import { royalsObstructions } from './obstructions/mlb/royals-obstructions';
import { marlinsObstructions } from './obstructions/mlb/marlins-obstructions';
import { bluejaysObstructions } from './obstructions/mlb/bluejays-obstructions';
import { athleticsObstructions } from './obstructions/mlb/athletics-obstructions';
import { marinersObstructions } from './obstructions/mlb/mariners-obstructions';
import { raysObstructions } from './obstructions/mlb/rays-obstructions';

// Section data registry
const SECTION_REGISTRY: Record<string, DetailedSection[]> = {
  // MLB
  'yankees': yankeesSections,
  'red-sox': redsoxSections || fenwayParkSections,
  'dodgers': dodgersSections,
  'cubs': cubsSections || wrigleyFieldSections,
  'mets': metsSections,
  'giants': giantsSections || oracleParkSections,
  'padres': padresSections,
  'orioles': oriolesSections,
  'pirates': piratesSections || pncParkSections,
  'astros': astrosSections,
  'braves': bravesSections || truistParkSections,
  'rockies': rockiesSections,
  'twins': twinsSections,
  'reds': redsSections || greatAmericanBallparkSections,
  'guardians': guardiansSections,
  'phillies': philliesSections,
  'nationals': nationalsSections,
  'rangers': rangersSections,
  'angels': angelsSections,
  'brewers': brewersSections,
  'cardinals': cardinalsSections || buschstadiumSections,
  'diamondbacks': diamondbacksSections,
  'tigers': tigersSections,
  'rays': raysSections || georgeMSteinbrennerFieldSections,
  'white-sox': whitesoxSections,
  'royals': royalsSections,
  'marlins': marlinsSections,
  'blue-jays': bluejaysSections,
  'athletics': athleticsSections,
  'mariners': marinersSections,
  
  // MiLB
  'las-vegas-aviators': lasvegasaviatorsSections,
  
  // NFL
  'sofi-stadium': sofiStadiumSections,
  
  // Add more as they're created...
};

// Obstruction data registry
const OBSTRUCTION_REGISTRY: Record<string, Obstruction3D[]> = {
  // MLB
  'yankees': yankeeStadiumObstructions,
  'red-sox': redsoxObstructions,
  'dodgers': dodgersObstructions,
  'cubs': cubsObstructions,
  'mets': metsObstructions,
  'giants': giantsObstructions,
  'padres': padresObstructions,
  'orioles': oriolesObstructions,
  'pirates': piratesObstructions,
  'astros': astrosObstructions,
  'braves': bravesObstructions,
  'rockies': rockiesObstructions,
  'twins': twinsObstructions,
  'reds': redsObstructions,
  'guardians': guardiansObstructions,
  'phillies': philliesObstructions,
  'nationals': nationalsObstructions,
  'rangers': rangersObstructions,
  'angels': angelsObstructions,
  'brewers': brewersObstructions,
  'cardinals': cardinalsObstructions,
  'diamondbacks': diamondbacksObstructions,
  'tigers': tigersObstructions,
  'white-sox': whitesoxObstructions,
  'royals': royalsObstructions,
  'marlins': marlinsObstructions,
  'blue-jays': bluejaysObstructions,
  'athletics': athleticsObstructions,
  'mariners': marinersObstructions,
  'rays': raysObstructions,
  
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

// Main function to get complete stadium data
export function getStadiumCompleteData(
  stadiumId: string,
  league: 'MLB' | 'MiLB' | 'NFL'
): { sections: DetailedSection[], obstructions: Obstruction3D[] } {
  // Try to get specific sections
  const sections = SECTION_REGISTRY[stadiumId] || generateGenericSections(stadiumId, league);
  
  // Try to get specific obstructions
  const obstructions = OBSTRUCTION_REGISTRY[stadiumId] || generateGenericObstructions(league);
  
  return { sections, obstructions };
}

// Get sections only
export function getStadiumSections(stadiumId: string, league: 'MLB' | 'MiLB' | 'NFL'): DetailedSection[] {
  return SECTION_REGISTRY[stadiumId] || generateGenericSections(stadiumId, league);
}

// Get obstructions only
export function getStadiumObstructions(stadiumId: string, league: 'MLB' | 'MiLB' | 'NFL'): Obstruction3D[] {
  return OBSTRUCTION_REGISTRY[stadiumId] || generateGenericObstructions(league);
}

// Check if stadium has specific data
export function hasSpecificData(stadiumId: string): {
  hasSections: boolean;
  hasObstructions: boolean;
} {
  return {
    hasSections: !!SECTION_REGISTRY[stadiumId],
    hasObstructions: !!OBSTRUCTION_REGISTRY[stadiumId]
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
  const stadiumsWithSections = Object.keys(SECTION_REGISTRY).length;
  const stadiumsWithObstructions = Object.keys(OBSTRUCTION_REGISTRY).length;
  
  return {
    totalStadiums,
    stadiumsWithSections,
    stadiumsWithObstructions,
    coveragePercentage: ((stadiumsWithSections + stadiumsWithObstructions) / (totalStadiums * 2)) * 100
  };
}

// Export registries for direct access if needed
export { SECTION_REGISTRY, OBSTRUCTION_REGISTRY };