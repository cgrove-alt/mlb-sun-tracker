// Stadium Data Aggregator
// Central system for loading stadium-specific sections and obstructions

import { DetailedSection, Obstruction3D, StadiumComplete } from '../types/stadium-complete';

// Import MLB sections
import { yankeeStadiumSections } from './sections/mlb/yankees';
import { fenwayParkSections } from './sections/mlb/fenway-park';
import { dodgerStadiumSections } from './sections/mlb/dodger-stadium';
import { wrigleyFieldSections } from './sections/mlb/wrigley-field';
import { citiFieldSections } from './sections/mlb/citi-field';
import { oracleParkSections } from './sections/mlb/oracle-park';
import { petcoParkSections } from './sections/mlb/petco-park';
import { camdenYardsSections } from './sections/mlb/camden-yards';
import { pncParkSections } from './sections/mlb/pnc-park';
import { minuteMaidParkSections } from './sections/mlb/minute-maid-park';
import { truistParkSections } from './sections/mlb/truist-park';
import { coorsFieldSections } from './sections/mlb/coors-field';
import { targetFieldSections } from './sections/mlb/target-field';
import { greatAmericanBallparkSections } from './sections/mlb/great-american-ballpark';
import { progressiveFieldSections } from './sections/mlb/progressive-field';
import { citizensBankParkSections } from './sections/mlb/citizens-bank-park';
import { nationalsParkSections } from './sections/mlb/nationals-park';
import { globeLifeFieldSections } from './sections/mlb/globe-life-field';
import { angelStadiumSections } from './sections/mlb/angel-stadium';
import { americanFamilyFieldSections } from './sections/mlb/american-family-field';
import { buschStadiumSections } from './sections/mlb/busch-stadium';
import { chaseFieldSections } from './sections/mlb/chase-field';
import { comericaParkSections } from './sections/mlb/comerica-park';
import { georgeMSteinbrennerFieldSections } from './sections/mlb/george-m-steinbrenner-field';
import { guaranteedRateFieldSections } from './sections/mlb/guaranteed-rate-field';
import { kauffmanStadiumSections } from './sections/mlb/kauffman-stadium';
import { loanDepotParkSections } from './sections/mlb/loandepot-park';
import { rogersCentreSections } from './sections/mlb/rogers-centre';
import { sutterHealthParkSections } from './sections/mlb/sutter-health-park';
import { tMobileParkSections } from './sections/mlb/t-mobile-park';

// Import MiLB sections
import { lasVegasBallparkSections } from './sections/milb/aaa/las-vegas-aviators';
// Import other MiLB stadiums as they're created...

// Import NFL sections
import { sofiStadiumSections } from './sections/nfl/sofi-stadium';
// Import other NFL stadiums as they're created...

// Import obstructions
import { yankeeStadiumObstructions } from './obstructions/mlb/yankees-obstructions';
// Import other obstructions as they're created...

// Section data registry
const SECTION_REGISTRY: Record<string, DetailedSection[]> = {
  // MLB
  'yankees': yankeeStadiumSections,
  'red-sox': fenwayParkSections,
  'dodgers': dodgerStadiumSections,
  'cubs': wrigleyFieldSections,
  'mets': citiFieldSections,
  'giants': oracleParkSections,
  'padres': petcoParkSections,
  'orioles': camdenYardsSections,
  'pirates': pncParkSections,
  'astros': minuteMaidParkSections,
  'braves': truistParkSections,
  'rockies': coorsFieldSections,
  'twins': targetFieldSections,
  'reds': greatAmericanBallparkSections,
  'guardians': progressiveFieldSections,
  'phillies': citizensBankParkSections,
  'nationals': nationalsParkSections,
  'rangers': globeLifeFieldSections,
  'angels': angelStadiumSections,
  'brewers': americanFamilyFieldSections,
  'cardinals': buschStadiumSections,
  'diamondbacks': chaseFieldSections,
  'tigers': comericaParkSections,
  'rays': georgeMSteinbrennerFieldSections,
  'white-sox': guaranteedRateFieldSections,
  'royals': kauffmanStadiumSections,
  'marlins': loanDepotParkSections,
  'blue-jays': rogersCentreSections,
  'athletics': sutterHealthParkSections,
  'mariners': tMobileParkSections,
  
  // MiLB
  'las-vegas-aviators': lasVegasBallparkSections,
  
  // NFL
  'sofi-stadium': sofiStadiumSections,
  
  // Add more as they're created...
};

// Obstruction data registry
const OBSTRUCTION_REGISTRY: Record<string, Obstruction3D[]> = {
  // MLB
  'yankees': yankeeStadiumObstructions,
  
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