// Auto-generated venues data
// Generated on 2025-07-31T18:50:12.767Z

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

export const ALL_VENUES: Venue[] = [
  {
    "id": "sofi-stadium",
    "name": "SoFi Stadium",
    "league": "NFL",
    "team": "Los Angeles Rams",
    "alternateTeams": [
      "Los Angeles Chargers"
    ],
    "city": "Los Angeles",
    "state": "CA",
    "latitude": 33.9535,
    "longitude": -118.3392,
    "orientation": 90,
    "capacity": 70240,
    "roof": "fixed",
    "roofHeight": 150,
    "roofOverhang": 60,
    "upperDeckHeight": 120,
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 0,
      "sideline1Angle": 90,
      "sideline2Angle": 270,
      "endZone1Angle": 0,
      "endZone2Angle": 180
    },
    "venueType": "football",
    "surface": "artificial",
    "opened": 2020,
    "address": "1001 Stadium Dr, Los Angeles, CA 90301"
  },
  {
    "id": "lambeau-field",
    "name": "Lambeau Field",
    "league": "NFL",
    "team": "Green Bay Packers",
    "city": "Green Bay",
    "state": "WI",
    "latitude": 44.5013,
    "longitude": -88.0622,
    "orientation": 45,
    "capacity": 81441,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "northwest-southeast",
      "primarySeatingAngle": 45,
      "sideline1Angle": 135,
      "sideline2Angle": 315,
      "endZone1Angle": 45,
      "endZone2Angle": 225
    },
    "venueType": "football",
    "surface": "natural grass",
    "opened": 1957,
    "address": "1265 Lombardi Ave, Green Bay, WI 54304"
  },
  {
    "id": "bmo-stadium",
    "name": "BMO Stadium",
    "league": "MLS",
    "team": "Los Angeles FC",
    "city": "Los Angeles",
    "state": "CA",
    "latitude": 34.0119,
    "longitude": -118.285,
    "orientation": 15,
    "capacity": 22000,
    "roof": "open",
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 110,
        "width": 70
      },
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 15,
      "sideline1Angle": 105,
      "sideline2Angle": 285,
      "endZone1Angle": 15,
      "endZone2Angle": 195
    },
    "venueType": "soccer",
    "surface": "natural grass",
    "opened": 2018,
    "address": "3939 S Figueroa St, Los Angeles, CA 90037"
  }
];

export const VENUES_BY_LEAGUE: Record<string, Venue[]> = {
  "NFL": [
    {
      "id": "sofi-stadium",
      "name": "SoFi Stadium",
      "league": "NFL",
      "team": "Los Angeles Rams",
      "alternateTeams": [
        "Los Angeles Chargers"
      ],
      "city": "Los Angeles",
      "state": "CA",
      "latitude": 33.9535,
      "longitude": -118.3392,
      "orientation": 90,
      "capacity": 70240,
      "roof": "fixed",
      "roofHeight": 150,
      "roofOverhang": 60,
      "upperDeckHeight": 120,
      "timezone": "America/Los_Angeles",
      "seatingGeometry": {
        "bowlShape": "rectangular",
        "fieldDimensions": {
          "length": 120,
          "width": 53.3
        },
        "endZoneOrientation": "north-south",
        "primarySeatingAngle": 0,
        "sideline1Angle": 90,
        "sideline2Angle": 270,
        "endZone1Angle": 0,
        "endZone2Angle": 180
      },
      "venueType": "football",
      "surface": "artificial",
      "opened": 2020,
      "address": "1001 Stadium Dr, Los Angeles, CA 90301"
    },
    {
      "id": "lambeau-field",
      "name": "Lambeau Field",
      "league": "NFL",
      "team": "Green Bay Packers",
      "city": "Green Bay",
      "state": "WI",
      "latitude": 44.5013,
      "longitude": -88.0622,
      "orientation": 45,
      "capacity": 81441,
      "roof": "open",
      "timezone": "America/Chicago",
      "seatingGeometry": {
        "bowlShape": "rectangular",
        "fieldDimensions": {
          "length": 120,
          "width": 53.3
        },
        "endZoneOrientation": "northwest-southeast",
        "primarySeatingAngle": 45,
        "sideline1Angle": 135,
        "sideline2Angle": 315,
        "endZone1Angle": 45,
        "endZone2Angle": 225
      },
      "venueType": "football",
      "surface": "natural grass",
      "opened": 1957,
      "address": "1265 Lombardi Ave, Green Bay, WI 54304"
    }
  ],
  "MLS": [
    {
      "id": "bmo-stadium",
      "name": "BMO Stadium",
      "league": "MLS",
      "team": "Los Angeles FC",
      "city": "Los Angeles",
      "state": "CA",
      "latitude": 34.0119,
      "longitude": -118.285,
      "orientation": 15,
      "capacity": 22000,
      "roof": "open",
      "timezone": "America/Los_Angeles",
      "seatingGeometry": {
        "bowlShape": "rectangular",
        "fieldDimensions": {
          "length": 110,
          "width": 70
        },
        "endZoneOrientation": "north-south",
        "primarySeatingAngle": 15,
        "sideline1Angle": 105,
        "sideline2Angle": 285,
        "endZone1Angle": 15,
        "endZone2Angle": 195
      },
      "venueType": "soccer",
      "surface": "natural grass",
      "opened": 2018,
      "address": "3939 S Figueroa St, Los Angeles, CA 90037"
    }
  ]
};

export const VENUE_BY_ID: Record<string, Venue> = {
  "sofi-stadium": {
    "id": "sofi-stadium",
    "name": "SoFi Stadium",
    "league": "NFL",
    "team": "Los Angeles Rams",
    "alternateTeams": [
      "Los Angeles Chargers"
    ],
    "city": "Los Angeles",
    "state": "CA",
    "latitude": 33.9535,
    "longitude": -118.3392,
    "orientation": 90,
    "capacity": 70240,
    "roof": "fixed",
    "roofHeight": 150,
    "roofOverhang": 60,
    "upperDeckHeight": 120,
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 0,
      "sideline1Angle": 90,
      "sideline2Angle": 270,
      "endZone1Angle": 0,
      "endZone2Angle": 180
    },
    "venueType": "football",
    "surface": "artificial",
    "opened": 2020,
    "address": "1001 Stadium Dr, Los Angeles, CA 90301"
  },
  "lambeau-field": {
    "id": "lambeau-field",
    "name": "Lambeau Field",
    "league": "NFL",
    "team": "Green Bay Packers",
    "city": "Green Bay",
    "state": "WI",
    "latitude": 44.5013,
    "longitude": -88.0622,
    "orientation": 45,
    "capacity": 81441,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "northwest-southeast",
      "primarySeatingAngle": 45,
      "sideline1Angle": 135,
      "sideline2Angle": 315,
      "endZone1Angle": 45,
      "endZone2Angle": 225
    },
    "venueType": "football",
    "surface": "natural grass",
    "opened": 1957,
    "address": "1265 Lombardi Ave, Green Bay, WI 54304"
  },
  "bmo-stadium": {
    "id": "bmo-stadium",
    "name": "BMO Stadium",
    "league": "MLS",
    "team": "Los Angeles FC",
    "city": "Los Angeles",
    "state": "CA",
    "latitude": 34.0119,
    "longitude": -118.285,
    "orientation": 15,
    "capacity": 22000,
    "roof": "open",
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 110,
        "width": 70
      },
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 15,
      "sideline1Angle": 105,
      "sideline2Angle": 285,
      "endZone1Angle": 15,
      "endZone2Angle": 195
    },
    "venueType": "soccer",
    "surface": "natural grass",
    "opened": 2018,
    "address": "3939 S Figueroa St, Los Angeles, CA 90037"
  }
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
