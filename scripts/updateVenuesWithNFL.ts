// Script to update venues.ts with all NFL stadiums
import fs from 'fs';
import path from 'path';

// Read the generated NFL venues
const nflVenuesRaw = fs.readFileSync('./nfl-venues-generated.json', 'utf8');
const nflVenues = JSON.parse(nflVenuesRaw);

// Current venues (will be replaced)
const currentVenuesContent = `// Auto-generated venues data
// Generated on ${new Date().toISOString()}

export interface Venue {
  id: string;
  name: string;
  league: string;
  team: string;
  alternateTeams?: string[];
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
  timezone: string;
  seatingGeometry: {
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
  venueType: string;
  surface: string;
  opened: number;
  address: string;
}

export const ALL_VENUES: Venue[] = ${JSON.stringify(nflVenues, null, 2)};

export const VENUES_BY_LEAGUE: Record<string, Venue[]> = {
  "NFL": ${JSON.stringify(nflVenues, null, 2)}
};

export const VENUE_BY_ID: Record<string, Venue> = {
${nflVenues.map((venue: any) => `  "${venue.id}": ${JSON.stringify(venue, null, 4)}`).join(',\n')}
};

export const LEAGUES = {
  "MLB": {
    "name": "Major League Baseball",
    "sport": "baseball",
    "season": {
      "start": "April",
      "end": "October"
    },
    "gameTypes": [
      "day",
      "night"
    ],
    "typicalGameTimes": [
      "13:00",
      "19:00",
      "20:00"
    ]
  },
  "NFL": {
    "name": "National Football League",
    "sport": "football",
    "season": {
      "start": "September",
      "end": "February"
    },
    "gameTypes": [
      "day",
      "night"
    ],
    "typicalGameTimes": [
      "13:00",
      "16:00",
      "20:00"
    ]
  },
  "MLS": {
    "name": "Major League Soccer",
    "sport": "soccer",
    "season": {
      "start": "February",
      "end": "November"
    },
    "gameTypes": [
      "day",
      "afternoon",
      "night"
    ],
    "typicalGameTimes": [
      "12:00",
      "15:00",
      "17:00",
      "19:00"
    ]
  }
};

export const VENUE_TYPES = {
  "baseball": {
    "defaultGameDuration": 180,
    "shadePriority": "high",
    "sunExposureConcerns": [
      "day games",
      "afternoon games"
    ],
    "seasonalFactors": [
      "spring training",
      "summer heat",
      "playoff weather"
    ]
  },
  "football": {
    "defaultGameDuration": 180,
    "shadePriority": "medium",
    "sunExposureConcerns": [
      "afternoon games",
      "early season heat"
    ],
    "seasonalFactors": [
      "early season heat",
      "late season cold",
      "playoff weather"
    ]
  },
  "soccer": {
    "defaultGameDuration": 120,
    "shadePriority": "high",
    "sunExposureConcerns": [
      "afternoon games",
      "summer matches"
    ],
    "seasonalFactors": [
      "summer heat",
      "playoff season"
    ]
  }
};

// Helper functions
export function getVenueById(id: string): Venue | null {
  return VENUE_BY_ID[id] || null;
}

export function getVenuesByLeague(league: string): Venue[] {
  return VENUES_BY_LEAGUE[league] || [];
}

export function getAllLeagues(): string[] {
  return Object.keys(LEAGUES);
}

export function getLeagueInfo(league: string) {
  return (LEAGUES as any)[league] || null;
}

export function getVenueTypeInfo(venueType: string) {
  return (VENUE_TYPES as any)[venueType] || null;
}
`;

// Write the updated venues.ts file
fs.writeFileSync('./src/data/venues.ts', currentVenuesContent);

console.log('Updated venues.ts with all NFL stadiums');
console.log(`Total venues: ${nflVenues.length}`);