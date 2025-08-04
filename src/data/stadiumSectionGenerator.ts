// Stadium Section Generator
// Intelligent fallback system for generating realistic section layouts when real data is unavailable

import { RealStadiumSection, RealStadiumLayout, calculateSectionAngle, calculateSunExposure, PRICE_TIERS } from './realStadiumSections';
import { MiLBStadium } from './milbStadiums';

export type GenerationQuality = 'high' | 'medium' | 'basic';

interface GenerationOptions {
  quality: GenerationQuality;
  includeSpecialFeatures?: boolean;
  climateConsiderations?: boolean;
}

export function generateStadiumLayout(
  stadium: MiLBStadium,
  options: GenerationOptions = { quality: 'medium' }
): RealStadiumLayout {
  const { quality, includeSpecialFeatures = true, climateConsiderations = true } = options;
  
  // Base layout generation based on capacity and level
  const sections = generateSectionsBasedOnCapacity(stadium, quality);
  
  // Apply climate-based modifications
  if (climateConsiderations) {
    applyClimateModifications(sections, stadium);
  }
  
  // Generate special features based on stadium characteristics
  const specialFeatures = includeSpecialFeatures ? 
    generateSpecialFeatures(stadium) : undefined;
  
  return {
    venueId: stadium.id,
    venueName: stadium.name,
    orientation: stadium.orientation,
    lastVerified: new Date().toISOString().split('T')[0],
    dataSource: 'estimated',
    sections,
    specialFeatures,
    notes: `Generated layout based on ${quality} quality algorithm. Capacity: ${stadium.capacity}, Level: ${stadium.level}`
  };
}

function generateSectionsBasedOnCapacity(
  stadium: MiLBStadium,
  quality: GenerationQuality
): RealStadiumSection[] {
  const sections: RealStadiumSection[] = [];
  const { capacity, level, orientation } = stadium;
  
  // Determine section configuration based on capacity
  const config = getStadiumConfiguration(capacity, level);
  
  // Generate home plate premium sections
  const premiumSections = Math.floor(config.premiumPercentage * 10);
  for (let i = 0; i < premiumSections; i++) {
    const angle = -premiumSections * 5 + i * 10;
    sections.push({
      id: `field-${i + 1}`,
      name: `Field Box ${i + 1}`,
      level: 'field',
      baseAngle: calculateSectionAngle(orientation, 'home', angle),
      angleSpan: 10,
      rows: quality === 'high' ? 12 + Math.floor(Math.random() * 4) : 12,
      seatsPerRow: quality === 'high' ? 18 + Math.floor(Math.random() * 4) : 20,
      covered: false,
      price: PRICE_TIERS[level].field,
      accessibility: i % 2 === 0 ? 'full' : 'partial',
      sunExposure: calculateSunExposure(calculateSectionAngle(orientation, 'home', angle), false)
    });
  }
  
  // Generate baseline sections
  const baselineSections = Math.floor(config.baselinePercentage * 12);
  
  // First base line
  for (let i = 0; i < baselineSections / 2; i++) {
    const angle = -25 + i * 12;
    sections.push({
      id: `fb-${i + 1}`,
      name: quality === 'high' ? `Section ${100 + i}` : `Lower Box ${i + 1}`,
      level: 'lower',
      baseAngle: calculateSectionAngle(orientation, 'first-base', angle),
      angleSpan: 12,
      rows: 16 + (quality === 'high' ? Math.floor(Math.random() * 6) : 4),
      seatsPerRow: 20 + (quality === 'high' ? Math.floor(Math.random() * 4) : 0),
      covered: false,
      price: PRICE_TIERS[level].lower,
      sunExposure: calculateSunExposure(calculateSectionAngle(orientation, 'first-base', angle), false)
    });
  }
  
  // Third base line
  for (let i = 0; i < baselineSections / 2; i++) {
    const angle = 25 - i * 12;
    sections.push({
      id: `tb-${i + 1}`,
      name: quality === 'high' ? `Section ${200 + i}` : `Lower Box ${baselineSections / 2 + i + 1}`,
      level: 'lower',
      baseAngle: calculateSectionAngle(orientation, 'third-base', angle),
      angleSpan: 12,
      rows: 16 + (quality === 'high' ? Math.floor(Math.random() * 6) : 4),
      seatsPerRow: 20 + (quality === 'high' ? Math.floor(Math.random() * 4) : 0),
      covered: false,
      price: PRICE_TIERS[level].lower,
      sunExposure: calculateSunExposure(calculateSectionAngle(orientation, 'third-base', angle), false)
    });
  }
  
  // Generate outfield sections
  if (config.hasOutfieldSeating) {
    // Right field
    sections.push({
      id: 'rf-ga',
      name: 'Right Field ' + (config.hasOutfieldBleachers ? 'Bleachers' : 'Pavilion'),
      level: config.hasOutfieldBleachers ? 'ga' : 'lower',
      baseAngle: calculateSectionAngle(orientation, 'right-field', 0),
      angleSpan: 35,
      rows: config.hasOutfieldBleachers ? 10 : 8,
      covered: false,
      price: PRICE_TIERS[level].ga,
      sunExposure: calculateSunExposure(calculateSectionAngle(orientation, 'right-field', 0), false)
    });
    
    // Left field
    sections.push({
      id: 'lf-ga',
      name: 'Left Field ' + (config.hasOutfieldBleachers ? 'Bleachers' : 'Pavilion'),
      level: config.hasOutfieldBleachers ? 'ga' : 'lower',
      baseAngle: calculateSectionAngle(orientation, 'left-field', 0),
      angleSpan: 35,
      rows: config.hasOutfieldBleachers ? 10 : 8,
      covered: false,
      price: PRICE_TIERS[level].ga,
      sunExposure: calculateSunExposure(calculateSectionAngle(orientation, 'left-field', 0), false)
    });
  }
  
  // Add berm if appropriate
  if (config.hasBerm) {
    sections.push({
      id: 'berm',
      name: 'Outfield Berm',
      level: 'berm',
      baseAngle: calculateSectionAngle(orientation, 'center-field', 0),
      angleSpan: 60,
      covered: false,
      price: PRICE_TIERS[level].berm,
      accessibility: 'full',
      sunExposure: calculateSunExposure(calculateSectionAngle(orientation, 'center-field', 0), false)
    });
  }
  
  // Add club/suite level for larger stadiums
  if (config.hasClubLevel) {
    sections.push({
      id: 'club-level',
      name: quality === 'high' ? `${stadium.team.split(' ').pop()} Club` : 'Club Level',
      level: 'club',
      baseAngle: calculateSectionAngle(orientation, 'home', 0),
      angleSpan: 40,
      rows: 6,
      covered: true,
      hasOverhang: true,
      price: PRICE_TIERS[level].club,
      accessibility: 'full',
      amenities: ['In-seat service', 'Climate controlled', 'Private concessions'],
      sunExposure: calculateSunExposure(calculateSectionAngle(orientation, 'home', 0), true, true)
    });
  }
  
  return sections;
}

interface StadiumConfiguration {
  premiumPercentage: number;
  baselinePercentage: number;
  hasOutfieldSeating: boolean;
  hasOutfieldBleachers: boolean;
  hasBerm: boolean;
  hasClubLevel: boolean;
  hasUpperDeck: boolean;
}

function getStadiumConfiguration(capacity: number, level: string): StadiumConfiguration {
  // AAA stadiums (6,000-16,000)
  if (level === 'AAA') {
    return {
      premiumPercentage: 0.15,
      baselinePercentage: 0.50,
      hasOutfieldSeating: true,
      hasOutfieldBleachers: capacity < 10000,
      hasBerm: capacity < 12000 && Math.random() > 0.5,
      hasClubLevel: capacity > 8000,
      hasUpperDeck: capacity > 12000
    };
  }
  
  // AA stadiums (4,000-10,000)
  if (level === 'AA') {
    return {
      premiumPercentage: 0.12,
      baselinePercentage: 0.45,
      hasOutfieldSeating: true,
      hasOutfieldBleachers: true,
      hasBerm: Math.random() > 0.4,
      hasClubLevel: capacity > 7000,
      hasUpperDeck: false
    };
  }
  
  // A+ and A stadiums (2,000-8,000)
  return {
    premiumPercentage: 0.10,
    baselinePercentage: 0.40,
    hasOutfieldSeating: capacity > 3000,
    hasOutfieldBleachers: true,
    hasBerm: Math.random() > 0.3,
    hasClubLevel: capacity > 5000,
    hasUpperDeck: false
  };
}

function applyClimateModifications(sections: RealStadiumSection[], stadium: MiLBStadium): void {
  // Hot climates - add more covered sections
  const hotStates = ['AZ', 'TX', 'FL', 'NV', 'CA'];
  if (hotStates.includes(stadium.state)) {
    // Add covering to some premium sections
    sections.filter(s => s.price === 'premium' || s.price === 'luxury')
      .forEach((section, index) => {
        if (index % 2 === 0) {
          section.covered = true;
          section.hasOverhang = true;
          section.sunExposure = calculateSunExposure(section.baseAngle, true, true);
        }
      });
  }
  
  // Cold/rainy climates - more covered concourses
  const coldStates = ['WA', 'OR', 'NY', 'MA', 'MI', 'WI', 'MN'];
  if (coldStates.includes(stadium.state)) {
    // Add overhangs to upper sections
    sections.filter(s => s.level === 'upper' || s.level === 'club')
      .forEach(section => {
        section.hasOverhang = true;
        section.sunExposure = calculateSunExposure(section.baseAngle, section.covered, true);
      });
  }
}

function generateSpecialFeatures(stadium: MiLBStadium): RealStadiumLayout['specialFeatures'] {
  const features: RealStadiumLayout['specialFeatures'] = [];
  
  // Altitude considerations
  if (stadium.elevation && stadium.elevation > 4000) {
    features.push({
      name: 'High Altitude',
      description: `Stadium at ${stadium.elevation} feet elevation`,
      location: 'Throughout',
      sunImpact: 'Stronger UV exposure, sun feels more intense'
    });
  }
  
  // Coastal stadiums
  const coastalCities = ['Norfolk', 'Charleston', 'Pensacola', 'Jacksonville', 'Fresno', 'San Jose'];
  if (coastalCities.some(city => stadium.city.includes(city))) {
    features.push({
      name: 'Coastal Breeze',
      description: 'Ocean/bay breezes provide cooling effect',
      location: 'Throughout',
      sunImpact: 'Breeze helps moderate sun exposure'
    });
  }
  
  // Desert stadiums
  if (stadium.state === 'AZ' || stadium.state === 'NV') {
    features.push({
      name: 'Desert Climate',
      description: 'Very low humidity, intense sun',
      location: 'Throughout',
      sunImpact: 'Sun exposure more intense due to clear skies'
    });
  }
  
  return features.length > 0 ? features : undefined;
}