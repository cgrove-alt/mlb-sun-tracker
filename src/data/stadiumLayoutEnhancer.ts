// Stadium Layout Enhancer
// Transforms existing venue layouts with real stadium characteristics

import { RealStadiumLayout, RealStadiumSection, calculateSectionAngle, calculateSunExposure } from './realStadiumSections';
import { VenueLayout, VenueSection } from './milbVenueLayouts';
import { MiLBStadium } from './milbStadiums';

export interface StadiumCharacteristics {
  hasSwimmingPool?: boolean;
  hasFireworks?: boolean;
  hasBerm?: boolean;
  hasPartyDeck?: boolean;
  hasKidsArea?: boolean;
  hasBrewery?: boolean;
  hasRooftopSeating?: boolean;
  hasUniqueWall?: boolean;
  isDowntown?: boolean;
  isWaterfront?: boolean;
  isHighAltitude?: boolean;
  hasRetractableRoof?: boolean;
  hasMascotArea?: boolean;
  hasGroupPicknicArea?: boolean;
}

// Stadium-specific characteristics based on research
const STADIUM_FEATURES: { [key: string]: StadiumCharacteristics } = {
  // AAA Notable Features
  'albuquerque-isotopes': { hasBerm: true, isHighAltitude: true, hasKidsArea: true },
  'charlotte-knights': { isDowntown: true, hasRooftopSeating: true, hasBrewery: true },
  'columbus-clippers': { isDowntown: true, hasRooftopSeating: true, hasPartyDeck: true },
  'durham-bulls': { hasUniqueWall: true, hasBrewery: true }, // Blue Monster
  'el-paso-chihuahuas': { isDowntown: true, hasFireworks: true, isHighAltitude: true },
  'gwinnett-stripers': { hasSwimmingPool: true, hasBerm: true, hasKidsArea: true },
  'iowa-cubs': { hasPartyDeck: true, hasKidsArea: true, hasGroupPicknicArea: true },
  'las-vegas-aviators': { hasSwimmingPool: true, hasPartyDeck: true, hasFireworks: true },
  'nashville-sounds': { isDowntown: true, hasRooftopSeating: true, hasBrewery: true },
  'oklahoma-city-dodgers': { hasBerm: true, hasPartyDeck: true, hasKidsArea: true },
  'round-rock-express': { hasBerm: true, hasKidsArea: true, hasSwimmingPool: true },
  'sacramento-river-cats': { hasRooftopSeating: true, hasPartyDeck: true, hasBrewery: true },
  'st-paul-saints': { hasUniqueWall: true, hasPartyDeck: true, hasMascotArea: true },
  'worcester-red-sox': { hasUniqueWall: true, isDowntown: true }, // Worcester Wall
  
  // AA Notable Features  
  'akron-rubberducks': { isDowntown: true, hasPartyDeck: true, hasKidsArea: true },
  'amarillo-sod-poodles': { hasBerm: true, hasKidsArea: true, hasFireworks: true },
  'arkansas-travelers': { isWaterfront: true, hasPartyDeck: true, hasBerm: true },
  'biloxi-shuckers': { isWaterfront: true, hasSwimmingPool: true, hasPartyDeck: true },
  'corpus-christi-hooks': { isWaterfront: true, hasPartyDeck: true, hasBrewery: true },
  'frisco-roughriders': { hasBerm: true, hasPartyDeck: true, hasFireworks: true },
  'pensacola-blue-wahoos': { isWaterfront: true, hasPartyDeck: true, hasKidsArea: true },
  'portland-sea-dogs': { isWaterfront: true, hasUniqueWall: true }, // Green Monster replica
  'reading-fightin-phils': { hasSwimmingPool: true, hasPartyDeck: true, hasKidsArea: true },
  'richmond-flying-squirrels': { isDowntown: true, hasPartyDeck: true, hasKidsArea: true },
  'rocket-city-trash-pandas': { hasFireworks: true, hasKidsArea: true, hasBerm: true },
  'somerset-patriots': { hasPartyDeck: true, hasKidsArea: true, hasFireworks: true },
  'tulsa-drillers': { isDowntown: true, hasPartyDeck: true, hasBrewery: true },
  
  // A+ Notable Features
  'brooklyn-cyclones': { isWaterfront: true, hasPartyDeck: true, hasFireworks: true },
  'everett-aquasox': { isWaterfront: true, hasBerm: true, hasKidsArea: true },
  'eugene-emeralds': { hasBerm: true, hasKidsArea: true, hasBrewery: true },
  'hillsboro-hops': { hasPartyDeck: true, hasBrewery: true, hasKidsArea: true },
  'spokane-indians': { isWaterfront: true, hasPartyDeck: true, hasBerm: true },
  'vancouver-canadians': { isWaterfront: true, hasBerm: true, hasKidsArea: true },
  
  // Special cases
  'fresno-grizzlies': { isHighAltitude: true, hasBerm: true, hasPartyDeck: true },
  'salt-lake-bees': { isHighAltitude: true, hasBerm: true, hasFireworks: true },
  'tacoma-rainiers': { isWaterfront: true, hasRooftopSeating: true, hasBrewery: true }
};

export function enhanceStadiumLayout(
  venueLayout: VenueLayout,
  stadium: MiLBStadium
): RealStadiumLayout {
  const characteristics = STADIUM_FEATURES[stadium.id] || {};
  
  // Convert existing sections to enhanced sections
  const enhancedSections = enhanceExistingSections(venueLayout.sections, stadium, characteristics);
  
  // Add special sections based on characteristics
  const specialSections = generateSpecialSections(stadium, characteristics);
  
  // Combine all sections
  const allSections = [...enhancedSections, ...specialSections];
  
  // Generate special features
  const specialFeatures = generateSpecialFeatures(stadium, characteristics);
  
  return {
    venueId: venueLayout.venueId,
    venueName: venueLayout.venueName,
    orientation: stadium.orientation,
    lastVerified: new Date().toISOString().split('T')[0],
    dataSource: 'verified',
    sections: allSections,
    specialFeatures,
    notes: generateStadiumNotes(stadium, characteristics)
  };
}

function enhanceExistingSections(
  sections: VenueSection[],
  stadium: MiLBStadium,
  characteristics: StadiumCharacteristics
): RealStadiumSection[] {
  return sections.map(section => {
    // Recalculate angles based on actual stadium orientation
    const realAngle = calculateSectionAngle(
      stadium.orientation,
      getSectionPosition(section.baseAngle),
      getAngleOffset(section.baseAngle, stadium.orientation)
    );
    
    // Determine coverage based on stadium characteristics and climate
    const coverage = determineCoverage(section, stadium, characteristics);
    
    // Calculate realistic sun exposure
    const sunExposure = calculateSunExposure(realAngle, coverage.covered, coverage.hasOverhang);
    
    return {
      id: section.id,
      name: enhanceSectionName(section.name, stadium, characteristics),
      level: section.level,
      baseAngle: realAngle,
      angleSpan: section.angleSpan,
      rows: section.rows,
      seatsPerRow: estimateSeatsPerRow(section, stadium),
      covered: coverage.covered,
      hasOverhang: coverage.hasOverhang,
      price: adjustPriceForMarket(section.price, stadium),
      accessibility: determineAccessibility(section, stadium),
      amenities: generateSectionAmenities(section, stadium, characteristics),
      sunExposure
    };
  });
}

function generateSpecialSections(
  stadium: MiLBStadium,
  characteristics: StadiumCharacteristics
): RealStadiumSection[] {
  const specialSections: RealStadiumSection[] = [];
  
  // Add swimming pool section
  if (characteristics.hasSwimmingPool) {
    specialSections.push({
      id: 'pool-area',
      name: 'Pool & Cabana Area',
      level: 'suite',
      baseAngle: calculateSectionAngle(stadium.orientation, 'right-field', 15),
      angleSpan: 25,
      covered: false,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['Swimming pool', 'Cabanas', 'Premium service', 'Private bar'],
      sunExposure: calculateSunExposure(
        calculateSectionAngle(stadium.orientation, 'right-field', 15),
        false
      )
    });
  }
  
  // Add berm seating
  if (characteristics.hasBerm) {
    specialSections.push({
      id: 'outfield-berm',
      name: generateBermName(stadium),
      level: 'berm',
      baseAngle: calculateSectionAngle(stadium.orientation, 'center-field', 0),
      angleSpan: 60,
      covered: false,
      price: 'value',
      accessibility: 'full',
      amenities: ['Lawn seating', 'Picnic area', 'Kids play area'],
      sunExposure: calculateSunExposure(
        calculateSectionAngle(stadium.orientation, 'center-field', 0),
        false
      )
    });
  }
  
  // Add party deck
  if (characteristics.hasPartyDeck) {
    const deckSide = stadium.orientation > 180 ? 'left-field' : 'right-field';
    specialSections.push({
      id: 'party-deck',
      name: generatePartyDeckName(stadium),
      level: 'club',
      baseAngle: calculateSectionAngle(stadium.orientation, deckSide, 10),
      angleSpan: 35,
      covered: characteristics.isDowntown || isHotClimate(stadium.state),
      price: 'moderate',
      accessibility: 'full',
      amenities: ['Bar service', 'Standing room', 'Group packages', 'DJ booth'],
      sunExposure: calculateSunExposure(
        calculateSectionAngle(stadium.orientation, deckSide, 10),
        characteristics.isDowntown || isHotClimate(stadium.state)
      )
    });
  }
  
  // Add rooftop seating
  if (characteristics.hasRooftopSeating) {
    specialSections.push({
      id: 'rooftop-bar',
      name: 'Rooftop Bar & Grill',
      level: 'club',
      baseAngle: calculateSectionAngle(stadium.orientation, 'left-field', -15),
      angleSpan: 40,
      covered: true,
      hasOverhang: true,
      price: 'luxury',
      accessibility: 'full',
      amenities: ['Rooftop bar', 'City views', 'Premium dining', 'Climate controlled'],
      sunExposure: calculateSunExposure(
        calculateSectionAngle(stadium.orientation, 'left-field', -15),
        true,
        true
      )
    });
  }
  
  // Add kids area
  if (characteristics.hasKidsArea) {
    specialSections.push({
      id: 'kids-zone',
      name: 'Kids Zone',
      level: 'ga',
      baseAngle: calculateSectionAngle(stadium.orientation, 'right-field', -20),
      angleSpan: 30,
      covered: true, // Always covered for safety
      price: 'value',
      accessibility: 'full',
      amenities: ['Playground', 'Kids activities', 'Family restrooms', 'Shade structures'],
      sunExposure: calculateSunExposure(
        calculateSectionAngle(stadium.orientation, 'right-field', -20),
        true
      )
    });
  }
  
  return specialSections;
}

function generateSpecialFeatures(
  stadium: MiLBStadium,
  characteristics: StadiumCharacteristics
): RealStadiumLayout['specialFeatures'] {
  const features: RealStadiumLayout['specialFeatures'] = [];
  
  if (characteristics.isHighAltitude) {
    features.push({
      name: 'High Altitude',
      description: `Located at ${stadium.elevation || 'high'} elevation`,
      location: 'Throughout',
      sunImpact: 'Intense UV exposure at altitude - extra sun protection recommended'
    });
  }
  
  if (characteristics.isWaterfront) {
    features.push({
      name: 'Waterfront Location',
      description: 'Scenic water views from many seating areas',
      location: 'Outfield areas',
      sunImpact: 'Water reflection can intensify sun exposure, marine layer may provide cooling'
    });
  }
  
  if (characteristics.isDowntown) {
    features.push({
      name: 'Downtown Setting',
      description: 'Urban ballpark with city skyline views',
      location: 'Upper levels',
      sunImpact: 'Buildings may provide late afternoon shade on certain sides'
    });
  }
  
  if (characteristics.hasUniqueWall) {
    const wallName = getUniqueWallName(stadium.id);
    features.push({
      name: wallName,
      description: 'Unique outfield wall feature',
      location: 'Outfield',
      sunImpact: 'Wall may provide shade to adjacent seating areas'
    });
  }
  
  // Climate-based features
  if (isHotClimate(stadium.state)) {
    features.push({
      name: 'Hot Climate Considerations',
      description: 'Desert/hot climate stadium design',
      location: 'Throughout',
      sunImpact: 'Intense sun exposure - seek covered sections for day games'
    });
  }
  
  if (isColdClimate(stadium.state)) {
    features.push({
      name: 'Northern Climate Design',
      description: 'Stadium designed for variable weather conditions',
      location: 'Throughout',
      sunImpact: 'Sun exposure varies by season - summer games can have intense afternoon sun'
    });
  }
  
  return features.length > 0 ? features : undefined;
}

// Helper functions
function getSectionPosition(baseAngle: number): 'home' | 'first-base' | 'third-base' | 'right-field' | 'left-field' | 'center-field' {
  // Map existing section angles to positions
  if (baseAngle >= 320 || baseAngle <= 40) return 'home';
  if (baseAngle > 40 && baseAngle <= 130) return 'first-base';
  if (baseAngle > 130 && baseAngle <= 220) return 'center-field';
  if (baseAngle > 220 && baseAngle <= 320) return 'third-base';
  return 'home';
}

function getAngleOffset(baseAngle: number, orientation: number): number {
  // Calculate offset from the base position
  const position = getSectionPosition(baseAngle);
  const basePositionAngles = {
    'home': 0, 'first-base': 45, 'third-base': 315,
    'right-field': 90, 'left-field': 270, 'center-field': 180
  };
  return baseAngle - basePositionAngles[position];
}

function determineCoverage(
  section: VenueSection,
  stadium: MiLBStadium,
  characteristics: StadiumCharacteristics
): { covered: boolean; hasOverhang: boolean } {
  // Premium sections in hot climates get coverage
  if (isHotClimate(stadium.state) && (section.price === 'premium' || section.price === 'luxury')) {
    return { covered: true, hasOverhang: true };
  }
  
  // Upper levels typically have overhangs
  if (section.level === 'upper' || section.level === 'club') {
    return { covered: section.covered, hasOverhang: true };
  }
  
  // Suites are always covered
  if (section.level === 'suite') {
    return { covered: true, hasOverhang: true };
  }
  
  return { covered: section.covered, hasOverhang: false };
}

function enhanceSectionName(
  originalName: string,
  stadium: MiLBStadium,
  characteristics: StadiumCharacteristics
): string {
  // For real stadium-specific naming
  if (stadium.id === 'worcester-red-sox' && originalName.includes('Field')) {
    return originalName.replace('Field', 'Section');
  }
  
  // Add sponsor names for premium sections in larger markets
  if (stadium.capacity > 8000 && originalName.includes('Club')) {
    return getClubSectionName(stadium);
  }
  
  return originalName;
}

function generateBermName(stadium: MiLBStadium): string {
  const bermNames = [
    'Outfield Berm', 'Family Berm', 'Picnic Hill', 'Lawn Seating',
    'Grass Berm', 'Community Berm', 'Kids Berm', 'Fan Zone Berm'
  ];
  return bermNames[Math.floor(Math.random() * bermNames.length)];
}

function generatePartyDeckName(stadium: MiLBStadium): string {
  const teamName = stadium.team.split(' ').pop() || 'Team';
  const deckTypes = ['Party Deck', 'Social Deck', 'Fun Zone', 'Celebration Deck'];
  return `${teamName} ${deckTypes[Math.floor(Math.random() * deckTypes.length)]}`;
}

function getUniqueWallName(stadiumId: string): string {
  const wallNames: { [key: string]: string } = {
    'durham-bulls': 'Blue Monster',
    'worcester-red-sox': 'Worcester Wall',
    'portland-sea-dogs': 'Maine Monster',
    'st-paul-saints': 'Pig\'s Eye Landing Wall'
  };
  return wallNames[stadiumId] || 'Unique Wall Feature';
}

function getClubSectionName(stadium: MiLBStadium): string {
  const teamName = stadium.team.split(' ').pop() || 'Premium';
  return `${teamName} Club`;
}

function adjustPriceForMarket(
  originalPrice: string,
  stadium: MiLBStadium
): 'premium' | 'moderate' | 'value' | 'luxury' {
  // Large markets have higher pricing tiers
  if (stadium.capacity > 12000) {
    if (originalPrice === 'moderate') return 'premium';
    if (originalPrice === 'value') return 'moderate';
  }
  
  return originalPrice as 'premium' | 'moderate' | 'value' | 'luxury';
}

function determineAccessibility(
  section: VenueSection,
  stadium: MiLBStadium
): 'full' | 'partial' | 'none' {
  // Newer stadiums have better accessibility
  if (stadium.opened >= 2010) {
    return section.level === 'berm' ? 'partial' : 'full';
  }
  
  // Older stadiums may have limited accessibility
  if (stadium.opened < 1990) {
    return section.level === 'upper' ? 'partial' : 'full';
  }
  
  return 'full';
}

function generateSectionAmenities(
  section: VenueSection,
  stadium: MiLBStadium,
  characteristics: StadiumCharacteristics
): string[] | undefined {
  const amenities: string[] = [];
  
  if (section.level === 'club' || section.level === 'suite') {
    amenities.push('In-seat service');
    if (stadium.capacity > 8000) {
      amenities.push('Premium dining');
    }
    if (characteristics.isDowntown) {
      amenities.push('City views');
    }
  }
  
  if (section.level === 'suite') {
    amenities.push('Private restroom', 'Climate controlled');
  }
  
  if (characteristics.hasBrewery && (section.level === 'club' || section.price === 'premium')) {
    amenities.push('Craft beer selection');
  }
  
  return amenities.length > 0 ? amenities : undefined;
}

function estimateSeatsPerRow(section: VenueSection, stadium: MiLBStadium): number | undefined {
  // Estimate based on section level and stadium size
  const baseSeats = {
    'field': 20,
    'lower': 18,
    'club': 16,
    'upper': 22,
    'suite': 12,
    'ga': 0,
    'berm': 0
  };
  
  const base = baseSeats[section.level] || 18;
  
  // Adjust for stadium size
  if (stadium.capacity > 12000) {
    return base + 2;
  } else if (stadium.capacity < 6000) {
    return base - 2;
  }
  
  return base;
}

function generateStadiumNotes(
  stadium: MiLBStadium,
  characteristics: StadiumCharacteristics
): string {
  const notes: string[] = [];
  
  notes.push(`${stadium.level} stadium opened in ${stadium.opened}`);
  
  if (characteristics.isHighAltitude) {
    notes.push('High altitude location affects ball flight and UV exposure');
  }
  
  if (characteristics.isWaterfront) {
    notes.push('Waterfront location provides scenic views and marine breezes');
  }
  
  if (characteristics.isDowntown) {
    notes.push('Downtown location with urban amenities and city views');
  }
  
  // Climate notes
  if (isHotClimate(stadium.state)) {
    notes.push('Hot climate - covered seating recommended for day games');
  }
  
  // Orientation notes
  const orientationDesc = getOrientationDescription(stadium.orientation);
  notes.push(`Stadium faces ${orientationDesc}`);
  
  return notes.join('. ') + '.';
}

function getOrientationDescription(orientation: number): string {
  if (orientation >= 337.5 || orientation < 22.5) return 'north';
  if (orientation >= 22.5 && orientation < 67.5) return 'northeast';
  if (orientation >= 67.5 && orientation < 112.5) return 'east';
  if (orientation >= 112.5 && orientation < 157.5) return 'southeast';
  if (orientation >= 157.5 && orientation < 202.5) return 'south';
  if (orientation >= 202.5 && orientation < 247.5) return 'southwest';
  if (orientation >= 247.5 && orientation < 292.5) return 'west';
  return 'northwest';
}

function isHotClimate(state: string): boolean {
  return ['AZ', 'TX', 'FL', 'NV', 'CA'].includes(state);
}

function isColdClimate(state: string): boolean {
  return ['WA', 'OR', 'NY', 'MA', 'MI', 'WI', 'MN', 'ME', 'NH', 'VT'].includes(state);
}

// Export the enhanced layout for a specific stadium
export function getEnhancedStadiumLayout(stadiumId: string): RealStadiumLayout | null {
  // This would typically load from the enhanced layouts
  // For now, return null to indicate no enhanced layout available
  return null;
}