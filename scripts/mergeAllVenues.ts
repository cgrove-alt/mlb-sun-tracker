import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { NFL_STADIUMS } from '../src/data/nflStadiums';
import { ALL_MILB_STADIUMS } from '../src/data/milbStadiums';

// Read existing venues.json
const venuesPath = path.join(__dirname, '../venues.json');
const venuesData = JSON.parse(fs.readFileSync(venuesPath, 'utf-8'));

// Convert MLB stadiums to venue format
const mlbVenues = MLB_STADIUMS.map(stadium => ({
  id: stadium.id,
  name: stadium.name,
  league: 'MLB',
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
    bowlShape: 'diamond',
    fieldDimensions: {
      length: 330, // approximate outfield distance
      width: 330
    },
    endZoneOrientation: getEndZoneOrientation(stadium.orientation),
    primarySeatingAngle: stadium.orientation,
    sideline1Angle: (stadium.orientation + 90) % 360,
    sideline2Angle: (stadium.orientation + 270) % 360,
    endZone1Angle: stadium.orientation,
    endZone2Angle: (stadium.orientation + 180) % 360
  },
  venueType: 'baseball',
  sport: 'baseball',
  address: `${stadium.city}, ${stadium.state}`
}));

// Convert NFL stadiums to venue format
const nflVenues = NFL_STADIUMS.map(stadium => ({
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
  sport: 'football',
  surface: stadium.surface,
  opened: stadium.opened,
  address: `${stadium.city}, ${stadium.state}`,
  features: stadium.features
}));

// Convert MiLB stadiums to venue format
const milbVenues = ALL_MILB_STADIUMS.map(stadium => ({
  id: stadium.id,
  name: stadium.name,
  league: 'MiLB',
  team: stadium.team,
  alternateTeams: [stadium.parentOrg], // Include parent org as alternate
  city: stadium.city,
  state: stadium.state,
  latitude: stadium.latitude,
  longitude: stadium.longitude,
  orientation: stadium.orientation,
  capacity: stadium.capacity,
  roof: stadium.roof,
  roofHeight: stadium.roofHeight,
  roofOverhang: stadium.roofOverhang,
  upperDeckHeight: stadium.upperDeckHeight,
  timezone: stadium.timezone,
  seatingGeometry: {
    bowlShape: 'diamond',
    fieldDimensions: {
      length: 330, // approximate outfield distance
      width: 330
    },
    endZoneOrientation: getEndZoneOrientation(stadium.orientation),
    primarySeatingAngle: stadium.orientation,
    sideline1Angle: (stadium.orientation + 90) % 360,
    sideline2Angle: (stadium.orientation + 270) % 360,
    endZone1Angle: stadium.orientation,
    endZone2Angle: (stadium.orientation + 180) % 360
  },
  venueType: 'baseball',
  sport: 'baseball',
  surface: stadium.surface,
  opened: stadium.opened,
  address: stadium.address || `${stadium.city}, ${stadium.state}`,
  level: stadium.level // MiLB level (AAA, AA, etc.)
}));

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

// Combine all venues
const allVenues = [...mlbVenues, ...nflVenues, ...milbVenues];

// Update venues.json
const updatedVenuesData = {
  ...venuesData,
  venues: allVenues
};

fs.writeFileSync(venuesPath, JSON.stringify(updatedVenuesData, null, 2));

console.log(`✅ Updated venues.json with:`);
console.log(`   - ${mlbVenues.length} MLB stadiums`);
console.log(`   - ${nflVenues.length} NFL stadiums`);
console.log(`   - ${milbVenues.length} MiLB stadiums`);
console.log(`   Total: ${allVenues.length} venues`);

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
  seatingGeometry?: {
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
  venueType: 'baseball' | 'football';
  surface?: string;
  opened?: number;
  address?: string;
  features?: string[];
  level?: string; // For MiLB
  sport?: 'baseball' | 'football';
}

export const ALL_UNIFIED_VENUES: UnifiedVenue[] = ${JSON.stringify(allVenues, null, 2)};

export function getUnifiedVenueById(id: string): UnifiedVenue | null {
  return ALL_UNIFIED_VENUES.find(venue => venue.id === id) || null;
}

export function getUnifiedVenuesByLeague(league: 'MLB' | 'NFL' | 'MiLB'): UnifiedVenue[] {
  return ALL_UNIFIED_VENUES.filter(venue => venue.league === league);
}

export function convertToLegacyStadium(venue: UnifiedVenue): any {
  return {
    id: venue.id,
    name: venue.name,
    team: venue.team,
    city: venue.city,
    state: venue.state,
    latitude: venue.latitude,
    longitude: venue.longitude,
    orientation: venue.orientation,
    capacity: venue.capacity,
    roof: venue.roof,
    roofHeight: venue.roofHeight,
    upperDeckHeight: venue.upperDeckHeight,
    timezone: venue.timezone,
    opened: venue.opened,
    surface: venue.surface,
    features: venue.features
  };
}

// League-related exports
export const ALL_LEAGUES = ['MLB', 'NFL', 'MiLB'] as const;

export function getAllLeagues() {
  return ALL_LEAGUES;
}

export function getLeagueInfo(league: string) {
  const leagueInfo: Record<string, any> = {
    MLB: { 
      name: 'Major League Baseball', 
      sport: 'baseball',
      season: { start: 'April', end: 'October' },
      typicalGameTimes: ['12:00', '13:00', '19:00']
    },
    NFL: { 
      name: 'National Football League', 
      sport: 'football',
      season: { start: 'September', end: 'February' },
      typicalGameTimes: ['13:00', '16:00', '20:00']
    },
    MiLB: { 
      name: 'Minor League Baseball', 
      sport: 'baseball',
      season: { start: 'April', end: 'September' },
      typicalGameTimes: ['12:00', '18:00', '19:00']
    }
  };
  return leagueInfo[league] || null;
}

export function getVenuesByLeague(league: string): UnifiedVenue[] {
  return ALL_UNIFIED_VENUES.filter(venue => venue.league === league);
}

export function getMiLBLevels() {
  return ['AAA', 'AA', 'A+', 'A'];
}

export function getMiLBVenuesByLevel(level: string): UnifiedVenue[] {
  return ALL_UNIFIED_VENUES.filter(venue => venue.league === 'MiLB' && venue.level === level);
}

export function isMiLBVenue(venue: UnifiedVenue): boolean {
  return venue.league === 'MiLB';
}

export function getVenueSport(venue: UnifiedVenue): string {
  return venue.venueType || 'baseball'; // Default to baseball if not specified
}
`;

fs.writeFileSync(unifiedVenuesPath, unifiedVenuesContent);
console.log(`✅ Updated unifiedVenues.ts`);