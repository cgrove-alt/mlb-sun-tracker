// Unified venue data combining MLB stadiums with other sports venues
import { Stadium, MLB_STADIUMS } from './stadiums';
import { ALL_VENUES, Venue, VENUES_BY_LEAGUE, LEAGUES } from './venues';

// Extended interface that combines Stadium and Venue types
export interface UnifiedVenue {
  id: string;
  name: string;
  team: string;
  alternateTeams?: string[];
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  timezone: string;
  league: string;
  sport: string;
  venueType: string;
  surface?: string;
  opened?: number;
  address?: string;
  // Geometry data for shadow calculations
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
  // Seating geometry for non-baseball venues
  seatingGeometry?: {
    bowlShape: 'circular' | 'rectangular' | 'oval';
    fieldDimensions: {
      length: number;
      width: number;
    };
    endZoneOrientation?: string;
    primarySeatingAngle: number;
    sideline1Angle?: number;
    sideline2Angle?: number;
    endZone1Angle?: number;
    endZone2Angle?: number;
  };
}

// Convert MLB stadiums to unified format
const MLB_AS_UNIFIED: UnifiedVenue[] = MLB_STADIUMS.map(stadium => ({
  ...stadium,
  league: 'MLB',
  sport: 'baseball',
  venueType: 'baseball',
  surface: 'varies',
  alternateTeams: undefined,
  seatingGeometry: {
    bowlShape: 'oval' as const,
    fieldDimensions: {
      length: 300, // Approximate baseball field length
      width: 300   // Approximate baseball field width
    },
    primarySeatingAngle: stadium.orientation,
  }
}));

// Convert other venues to unified format
const OTHER_VENUES_AS_UNIFIED: UnifiedVenue[] = ALL_VENUES.map(venue => ({
  ...venue,
  sport: (LEAGUES as any)[venue.league]?.sport || venue.venueType,
}));

// Combined all venues
export const ALL_UNIFIED_VENUES: UnifiedVenue[] = [
  ...MLB_AS_UNIFIED,
  ...OTHER_VENUES_AS_UNIFIED
];

// Group all venues by league
export const UNIFIED_VENUES_BY_LEAGUE: Record<string, UnifiedVenue[]> = {
  MLB: MLB_AS_UNIFIED,
  ...VENUES_BY_LEAGUE
};

// Create lookup by ID
export const UNIFIED_VENUE_BY_ID: Record<string, UnifiedVenue> = {};
ALL_UNIFIED_VENUES.forEach(venue => {
  UNIFIED_VENUE_BY_ID[venue.id] = venue;
});

// Sport groupings
export const VENUES_BY_SPORT: Record<string, UnifiedVenue[]> = {};
ALL_UNIFIED_VENUES.forEach(venue => {
  if (!VENUES_BY_SPORT[venue.sport]) {
    VENUES_BY_SPORT[venue.sport] = [];
  }
  VENUES_BY_SPORT[venue.sport].push(venue);
});

// Extended leagues info including MLB
export const ALL_LEAGUES = {
  ...LEAGUES,
  MLB: {
    name: 'Major League Baseball',
    sport: 'baseball',
    season: {
      start: 'April',
      end: 'October'
    },
    gameTypes: ['day', 'night'],
    typicalGameTimes: ['13:00', '19:00', '20:00']
  }
};

// Helper functions
export function getUnifiedVenueById(id: string): UnifiedVenue | null {
  return UNIFIED_VENUE_BY_ID[id] || null;
}

export function getVenuesByLeague(league: string): UnifiedVenue[] {
  return UNIFIED_VENUES_BY_LEAGUE[league] || [];
}

export function getVenuesBySport(sport: string): UnifiedVenue[] {
  return VENUES_BY_SPORT[sport] || [];
}

export function getAllLeagues(): string[] {
  return Object.keys(ALL_LEAGUES);
}

export function getAllSports(): string[] {
  return Object.keys(VENUES_BY_SPORT);
}

export function getLeagueInfo(league: string) {
  return (ALL_LEAGUES as any)[league] || null;
}

export function isBaseballVenue(venue: UnifiedVenue): boolean {
  return venue.sport === 'baseball' || venue.venueType === 'baseball';
}

export function isFootballVenue(venue: UnifiedVenue): boolean {
  return venue.sport === 'football' || venue.venueType === 'football';
}

export function isSoccerVenue(venue: UnifiedVenue): boolean {
  return venue.sport === 'soccer' || venue.venueType === 'soccer';
}

// Filter functions for different use cases
export function getVenuesWithRoof(): UnifiedVenue[] {
  return ALL_UNIFIED_VENUES.filter(venue => venue.roof !== 'open');
}

export function getOutdoorVenues(): UnifiedVenue[] {
  return ALL_UNIFIED_VENUES.filter(venue => venue.roof === 'open');
}

export function getVenuesByState(state: string): UnifiedVenue[] {
  return ALL_UNIFIED_VENUES.filter(venue => venue.state === state);
}

export function getVenuesByCapacity(minCapacity: number, maxCapacity?: number): UnifiedVenue[] {
  return ALL_UNIFIED_VENUES.filter(venue => {
    if (maxCapacity) {
      return venue.capacity >= minCapacity && venue.capacity <= maxCapacity;
    }
    return venue.capacity >= minCapacity;
  });
}

// Sun tracking compatibility check
export function isVenueCompatibleWithSunTracking(venue: UnifiedVenue): boolean {
  // All venues should be compatible, but some may have better data than others
  return venue.roof === 'open' || venue.roof === 'retractable';
}

export function getHighSunExposureVenues(): UnifiedVenue[] {
  return ALL_UNIFIED_VENUES.filter(venue => 
    venue.roof === 'open' && 
    (venue.latitude > 25) && // Venues in sunny climates
    (venue.sport === 'baseball' || venue.sport === 'football' || venue.sport === 'soccer')
  );
}

// Convert UnifiedVenue to legacy Stadium format for backward compatibility
export function convertToLegacyStadium(venue: UnifiedVenue): Stadium {
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
    timezone: venue.timezone,
    roofHeight: venue.roofHeight,
    roofOverhang: venue.roofOverhang,
    upperDeckHeight: venue.upperDeckHeight
  };
}