import * as fs from 'fs';
import * as path from 'path';
import { NFL_STADIUMS } from '../src/data/nflStadiums';
import { NFL_SECTIONS } from '../src/data/nflSections';

// Read existing venues.json
const venuesPath = path.join(__dirname, '../venues.json');
const venuesData = JSON.parse(fs.readFileSync(venuesPath, 'utf-8'));

// Keep only non-NFL venues
const nonNFLVenues = venuesData.venues.filter((v: any) => v.league !== 'NFL');

// Convert NFL stadiums to venue format
const nflVenues = NFL_STADIUMS.map(stadium => {
  // Check if we have sections for this stadium
  const hasSections = NFL_SECTIONS[stadium.id] && NFL_SECTIONS[stadium.id].length > 0;
  
  if (!hasSections) {
    console.warn(`Warning: No sections defined for ${stadium.name} (${stadium.id})`);
  }
  
  return {
    id: stadium.id,
    name: stadium.name,
    league: 'NFL',
    team: stadium.team,
    city: stadium.city,
    state: stadium.state,
    latitude: stadium.latitude,
    longitude: stadium.longitude,
    orientation: stadium.orientation,
    capacity: stadium.capacity,
    roof: stadium.roof,
    roofHeight: stadium.roofHeight,
    upperDeckHeight: stadium.upperDeckHeight,
    timezone: stadium.timezone,
    seatingGeometry: {
      bowlShape: 'rectangular',
      fieldDimensions: {
        length: 120,
        width: 53.3
      },
      endZoneOrientation: getEndZoneOrientation(stadium.orientation),
      primarySeatingAngle: stadium.orientation,
      sideline1Angle: (stadium.orientation + 90) % 360,
      sideline2Angle: (stadium.orientation + 270) % 360,
      endZone1Angle: stadium.orientation,
      endZone2Angle: (stadium.orientation + 180) % 360
    },
    venueType: 'football',
    surface: stadium.surface,
    opened: stadium.opened,
    address: `${stadium.city}, ${stadium.state}`,
    features: stadium.features
  };
});

function getEndZoneOrientation(orientation: number): string {
  if (orientation === 0) return 'north-south';
  if (orientation === 90) return 'east-west';
  if (orientation === 45) return 'northeast-southwest';
  if (orientation === 315) return 'northwest-southeast';
  if (orientation < 45) return 'north-northeast-south-southwest';
  if (orientation < 90) return 'northeast-east-southwest-west';
  if (orientation < 135) return 'east-southeast-west-northwest';
  if (orientation < 180) return 'southeast-south-northwest-north';
  if (orientation < 225) return 'south-southwest-north-northeast';
  if (orientation < 270) return 'southwest-west-northeast-east';
  if (orientation < 315) return 'west-northwest-east-southeast';
  return 'northwest-north-southeast-south';
}

// Combine venues
const updatedVenuesData = {
  ...venuesData,
  venues: [...nonNFLVenues, ...nflVenues]
};

// Write back to venues.json
fs.writeFileSync(venuesPath, JSON.stringify(updatedVenuesData, null, 2));

console.log(`✅ Updated venues.json with ${nflVenues.length} NFL stadiums`);
console.log(`   Total venues: ${updatedVenuesData.venues.length}`);

// Also update the unifiedVenues.ts file
const unifiedVenuesPath = path.join(__dirname, '../src/data/unifiedVenues.ts');
const unifiedVenuesContent = `// Auto-generated unified venues data
// Generated on ${new Date().toISOString()}

export interface UnifiedVenue {
  id: string;
  name: string;
  league: 'MLB' | 'NFL' | 'MiLB';
  team: string;
  alternateTeams?: string[];
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof?: 'open' | 'retractable' | 'fixed';
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
  timezone: string;
  seatingGeometry: {
    bowlShape: string;
    fieldDimensions: {
      length: number;
      width: number;
    };
    endZoneOrientation: string;
    primarySeatingAngle: number;
    sideline1Angle: number;
    sideline2Angle: number;
    endZone1Angle: number;
    endZone2Angle: number;
  };
  venueType: 'baseball' | 'football' | 'soccer';
  surface: string;
  opened: number;
  address: string;
  features?: string[];
}

export const ALL_UNIFIED_VENUES: UnifiedVenue[] = ${JSON.stringify(updatedVenuesData.venues, null, 2)};

export function getUnifiedVenueById(id: string): UnifiedVenue | null {
  return ALL_UNIFIED_VENUES.find(venue => venue.id === id) || null;
}

export function getUnifiedVenuesByLeague(league: 'MLB' | 'NFL' | 'MiLB'): UnifiedVenue[] {
  return ALL_UNIFIED_VENUES.filter(venue => venue.league === league);
}
`;

fs.writeFileSync(unifiedVenuesPath, unifiedVenuesContent);
console.log(`✅ Updated unifiedVenues.ts`);