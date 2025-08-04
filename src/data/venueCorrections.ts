// Venue data corrections for MiLB stadiums
// This file contains fixes for identified issues in the venue data

export interface VenueCorrection {
  id: string;
  corrections: {
    capacity?: number;
    latitude?: number;
    longitude?: number;
    level?: string;
    sections?: SectionCorrection[];
  };
}

export interface SectionCorrection {
  id: string;
  baseAngle?: number;
}

export const venueCorrections: VenueCorrection[] = [
  {
    id: 'las-vegas-aviators',
    corrections: {
      capacity: 8196, // Corrected from 10000
      level: 'AAA'
    }
  },
  {
    id: 'worcester-red-sox',
    corrections: {
      latitude: 42.25724,
      longitude: -71.8001,
      level: 'AAA'
    }
  },
  {
    id: 'columbus-clippers', // Note: "Clingstones" appears to be a typo
    corrections: {
      level: 'AAA'
    }
  }
];

// Angle corrections for seating sections
// These corrections apply to all MiLB venues using the standard template
export const sectionAngleCorrections: SectionCorrection[] = [
  // Field level corrections
  { id: 'field-4', baseAngle: 4 },    // Was 364°
  { id: 'field-5', baseAngle: 12 },   // Was 372°
  
  // Suite level corrections
  { id: 'suite-3', baseAngle: 0 },    // Was 360°
  { id: 'suite-4', baseAngle: 10 },   // Was 370°
  { id: 'suite-5', baseAngle: 20 },   // Was 380°
  { id: 'suite-6', baseAngle: 30 },   // Was 390°
  { id: 'suite-7', baseAngle: 40 },   // Was 400°
  { id: 'suite-8', baseAngle: 50 },   // Was 410°
];

// MiLB Level classifications for all teams
export const milbLevelClassifications: Record<string, string> = {
  // AAA Teams
  'albuquerque-isotopes': 'AAA',
  'buffalo-bisons': 'AAA',
  'charlotte-knights': 'AAA',
  'columbus-clippers': 'AAA',
  'durham-bulls': 'AAA',
  'el-paso-chihuahuas': 'AAA',
  'gwinnett-stripers': 'AAA',
  'indianapolis-indians': 'AAA',
  'iowa-cubs': 'AAA',
  'jacksonville-jumbo-shrimp': 'AAA',
  'las-vegas-aviators': 'AAA',
  'lehigh-valley-ironpigs': 'AAA',
  'louisville-bats': 'AAA',
  'memphis-redbirds': 'AAA',
  'nashville-sounds': 'AAA',
  'norfolk-tides': 'AAA',
  'oklahoma-city-dodgers': 'AAA',
  'omaha-storm-chasers': 'AAA',
  'reno-aces': 'AAA',
  'rochester-red-wings': 'AAA',
  'round-rock-express': 'AAA',
  'sacramento-river-cats': 'AAA',
  'salt-lake-bees': 'AAA',
  'scranton-railriders': 'AAA',
  'st-paul-saints': 'AAA',
  'sugar-land-space-cowboys': 'AAA',
  'syracuse-mets': 'AAA',
  'tacoma-rainiers': 'AAA',
  'toledo-mud-hens': 'AAA',
  'worcester-red-sox': 'AAA',
  
  // AA Teams
  'akron-rubberducks': 'AA',
  'altoona-curve': 'AA',
  'amarillo-sod-poodles': 'AA',
  'arkansas-travelers': 'AA',
  'biloxi-shuckers': 'AA',
  'binghamton-rumble-ponies': 'AA',
  'birmingham-barons': 'AA',
  'bowie-baysox': 'AA',
  'chattanooga-lookouts': 'AA',
  'corpus-christi-hooks': 'AA',
  'erie-seawolves': 'AA',
  'frisco-roughriders': 'AA',
  'harrisburg-senators': 'AA',
  'hartford-yard-goats': 'AA',
  'midland-rockhounds': 'AA',
  'montgomery-biscuits': 'AA',
  'new-hampshire-fisher-cats': 'AA',
  'northwest-arkansas-naturals': 'AA',
  'pensacola-blue-wahoos': 'AA',
  'portland-sea-dogs': 'AA',
  'reading-fightin-phils': 'AA',
  'richmond-flying-squirrels': 'AA',
  'rocket-city-trash-pandas': 'AA',
  'san-antonio-missions': 'AA',
  'somerset-patriots': 'AA',
  'springfield-cardinals': 'AA',
  'tulsa-drillers': 'AA',
  'wichita-wind-surge': 'AA',
  
  // A+ (High-A) Teams
  'aberdeen-ironbirds': 'A+',
  'asheville-tourists': 'A+',
  'beloit-sky-carp': 'A+',
  'bowling-green-hot-rods': 'A+',
  'brooklyn-cyclones': 'A+',
  'cedar-rapids-kernels': 'A+',
  'dayton-dragons': 'A+',
  'eugene-emeralds': 'A+',
  'everett-aquasox': 'A+',
  'fort-myers-mighty-mussels': 'A+',
  'great-lakes-loons': 'A+',
  'greensboro-grasshoppers': 'A+',
  'greenville-drive': 'A+',
  'hickory-crawdads': 'A+',
  'hillsboro-hops': 'A+',
  'hudson-valley-renegades': 'A+',
  'jersey-shore-blueclaws': 'A+',
  'lansing-lugnuts': 'A+',
  'peoria-chiefs': 'A+',
  'quad-cities-river-bandits': 'A+',
  'rome-braves': 'A+',
  'south-bend-cubs': 'A+',
  'spokane-indians': 'A+',
  'vancouver-canadians': 'A+',
  'west-michigan-whitecaps': 'A+',
  'winston-salem-dash': 'A+',
  'wisconsin-timber-rattlers': 'A+',
  
  // A (Low-A) Teams
  'augusta-greenjackets': 'A',
  'bradenton-marauders': 'A',
  'carolina-mudcats': 'A',
  'charleston-riverdogs': 'A',
  'clearwater-threshers': 'A',
  'columbia-fireflies': 'A',
  'daytona-tortugas': 'A',
  'delmarva-shorebirds': 'A',
  'down-east-wood-ducks': 'A',
  'dunedin-blue-jays': 'A',
  'fayetteville-woodpeckers': 'A',
  'fort-wayne-tincaps': 'A',
  'fredericksburg-nationals': 'A',
  'fresno-grizzlies': 'A',
  'inland-empire-66ers': 'A',
  'jupiter-hammerheads': 'A',
  'kannapolis-cannon-ballers': 'A',
  'knoxville-smokies': 'A',
  'lake-county-captains': 'A',
  'lake-elsinore-storm': 'A',
  'lakeland-flying-tigers': 'A',
  'lynchburg-hillcats': 'A',
  'modesto-nuts': 'A',
  'myrtle-beach-pelicans': 'A',
  'palm-beach-cardinals': 'A',
  'rancho-cucamonga-quakes': 'A',
  'salem-red-sox': 'A',
  'san-jose-giants': 'A',
  'st-lucie-mets': 'A',
  'stockton-ports': 'A',
  'tampa-tarpons': 'A',
  'tri-city-dust-devils': 'A',
  'visalia-rawhide': 'A',
};

// Function to apply corrections to venue data
export function applyVenueCorrections(venue: any): any {
  const correctedVenue = { ...venue };
  
  // Apply venue-specific corrections
  const venueCorrection = venueCorrections.find(vc => vc.id === venue.id);
  if (venueCorrection) {
    Object.assign(correctedVenue, venueCorrection.corrections);
  }
  
  // Apply level classification
  if (milbLevelClassifications[venue.id]) {
    correctedVenue.level = milbLevelClassifications[venue.id];
  }
  
  // Apply section angle corrections if venue has sections
  if (correctedVenue.sections && Array.isArray(correctedVenue.sections)) {
    correctedVenue.sections = correctedVenue.sections.map((section: any) => {
      const correction = sectionAngleCorrections.find(sc => sc.id === section.id);
      if (correction && correction.baseAngle !== undefined) {
        return { ...section, baseAngle: correction.baseAngle };
      }
      return section;
    });
  }
  
  return correctedVenue;
}