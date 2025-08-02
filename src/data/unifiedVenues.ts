// Auto-generated unified venues data
// Generated on 2025-08-02T18:57:10.435Z

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

export const ALL_UNIFIED_VENUES: UnifiedVenue[] = [
  {
    "id": "angels",
    "name": "Angel Stadium",
    "league": "MLB",
    "team": "Los Angeles Angels",
    "city": "Anaheim",
    "state": "CA",
    "latitude": 33.8003,
    "longitude": -117.8827,
    "orientation": 65,
    "capacity": 45517,
    "roof": "open",
    "roofHeight": 120,
    "upperDeckHeight": 80,
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 65,
      "sideline1Angle": 155,
      "sideline2Angle": 335,
      "endZone1Angle": 65,
      "endZone2Angle": 245
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Anaheim, CA"
  },
  {
    "id": "astros",
    "name": "Minute Maid Park",
    "league": "MLB",
    "team": "Houston Astros",
    "city": "Houston",
    "state": "TX",
    "latitude": 29.757,
    "longitude": -95.3555,
    "orientation": 20,
    "capacity": 41168,
    "roof": "retractable",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 20,
      "sideline1Angle": 110,
      "sideline2Angle": 290,
      "endZone1Angle": 20,
      "endZone2Angle": 200
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Houston, TX"
  },
  {
    "id": "athletics",
    "name": "Sutter Health Park",
    "league": "MLB",
    "team": "Oakland Athletics",
    "city": "Sacramento",
    "state": "CA",
    "latitude": 38.5664,
    "longitude": -121.503,
    "orientation": 330,
    "capacity": 14014,
    "roof": "open",
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northwest-north-southeast-south",
      "primarySeatingAngle": 330,
      "sideline1Angle": 60,
      "sideline2Angle": 240,
      "endZone1Angle": 330,
      "endZone2Angle": 150
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Sacramento, CA"
  },
  {
    "id": "bluejays",
    "name": "Rogers Centre",
    "league": "MLB",
    "team": "Toronto Blue Jays",
    "city": "Toronto",
    "state": "ON",
    "latitude": 43.6414,
    "longitude": -79.3894,
    "orientation": 15,
    "capacity": 49282,
    "roof": "retractable",
    "timezone": "America/Toronto",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 15,
      "sideline1Angle": 105,
      "sideline2Angle": 285,
      "endZone1Angle": 15,
      "endZone2Angle": 195
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Toronto, ON"
  },
  {
    "id": "braves",
    "name": "Truist Park",
    "league": "MLB",
    "team": "Atlanta Braves",
    "city": "Atlanta",
    "state": "GA",
    "latitude": 33.8908,
    "longitude": -84.4678,
    "orientation": 45,
    "capacity": 41084,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-southwest",
      "primarySeatingAngle": 45,
      "sideline1Angle": 135,
      "sideline2Angle": 315,
      "endZone1Angle": 45,
      "endZone2Angle": 225
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Atlanta, GA"
  },
  {
    "id": "brewers",
    "name": "American Family Field",
    "league": "MLB",
    "team": "Milwaukee Brewers",
    "city": "Milwaukee",
    "state": "WI",
    "latitude": 43.028,
    "longitude": -87.9712,
    "orientation": 357,
    "capacity": 41900,
    "roof": "retractable",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northwest-north-southeast-south",
      "primarySeatingAngle": 357,
      "sideline1Angle": 87,
      "sideline2Angle": 267,
      "endZone1Angle": 357,
      "endZone2Angle": 177
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Milwaukee, WI"
  },
  {
    "id": "cardinals",
    "name": "Busch Stadium",
    "league": "MLB",
    "team": "St. Louis Cardinals",
    "city": "St. Louis",
    "state": "MO",
    "latitude": 38.6226,
    "longitude": -90.1928,
    "orientation": 92,
    "capacity": 44494,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "east-southeast-west-northwest",
      "primarySeatingAngle": 92,
      "sideline1Angle": 182,
      "sideline2Angle": 2,
      "endZone1Angle": 92,
      "endZone2Angle": 272
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "St. Louis, MO"
  },
  {
    "id": "cubs",
    "name": "Wrigley Field",
    "league": "MLB",
    "team": "Chicago Cubs",
    "city": "Chicago",
    "state": "IL",
    "latitude": 41.9484,
    "longitude": -87.6553,
    "orientation": 13,
    "capacity": 41649,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 13,
      "sideline1Angle": 103,
      "sideline2Angle": 283,
      "endZone1Angle": 13,
      "endZone2Angle": 193
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Chicago, IL"
  },
  {
    "id": "diamondbacks",
    "name": "Chase Field",
    "league": "MLB",
    "team": "Arizona Diamondbacks",
    "city": "Phoenix",
    "state": "AZ",
    "latitude": 33.4455,
    "longitude": -112.0667,
    "orientation": 23,
    "capacity": 48686,
    "roof": "retractable",
    "timezone": "America/Phoenix",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 23,
      "sideline1Angle": 113,
      "sideline2Angle": 293,
      "endZone1Angle": 23,
      "endZone2Angle": 203
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Phoenix, AZ"
  },
  {
    "id": "dodgers",
    "name": "Dodger Stadium",
    "league": "MLB",
    "team": "Los Angeles Dodgers",
    "city": "Los Angeles",
    "state": "CA",
    "latitude": 34.0739,
    "longitude": -118.24,
    "orientation": 25,
    "capacity": 56000,
    "roof": "open",
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 25,
      "sideline1Angle": 115,
      "sideline2Angle": 295,
      "endZone1Angle": 25,
      "endZone2Angle": 205
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Los Angeles, CA"
  },
  {
    "id": "giants",
    "name": "Oracle Park",
    "league": "MLB",
    "team": "San Francisco Giants",
    "city": "San Francisco",
    "state": "CA",
    "latitude": 37.7786,
    "longitude": -122.3893,
    "orientation": 87,
    "capacity": 41915,
    "roof": "open",
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 87,
      "sideline1Angle": 177,
      "sideline2Angle": 357,
      "endZone1Angle": 87,
      "endZone2Angle": 267
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "San Francisco, CA"
  },
  {
    "id": "guardians",
    "name": "Progressive Field",
    "league": "MLB",
    "team": "Cleveland Guardians",
    "city": "Cleveland",
    "state": "OH",
    "latitude": 41.4962,
    "longitude": -81.6852,
    "orientation": 60,
    "capacity": 34830,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 60,
      "sideline1Angle": 150,
      "sideline2Angle": 330,
      "endZone1Angle": 60,
      "endZone2Angle": 240
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Cleveland, OH"
  },
  {
    "id": "mariners",
    "name": "T-Mobile Park",
    "league": "MLB",
    "team": "Seattle Mariners",
    "city": "Seattle",
    "state": "WA",
    "latitude": 47.5914,
    "longitude": -122.3325,
    "orientation": 318,
    "capacity": 47929,
    "roof": "retractable",
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northwest-north-southeast-south",
      "primarySeatingAngle": 318,
      "sideline1Angle": 48,
      "sideline2Angle": 228,
      "endZone1Angle": 318,
      "endZone2Angle": 138
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Seattle, WA"
  },
  {
    "id": "marlins",
    "name": "loanDepot park",
    "league": "MLB",
    "team": "Miami Marlins",
    "city": "Miami",
    "state": "FL",
    "latitude": 25.7781,
    "longitude": -80.2197,
    "orientation": 40,
    "capacity": 37446,
    "roof": "retractable",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 40,
      "sideline1Angle": 130,
      "sideline2Angle": 310,
      "endZone1Angle": 40,
      "endZone2Angle": 220
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Miami, FL"
  },
  {
    "id": "mets",
    "name": "Citi Field",
    "league": "MLB",
    "team": "New York Mets",
    "city": "New York",
    "state": "NY",
    "latitude": 40.7571,
    "longitude": -73.8458,
    "orientation": 90,
    "capacity": 41922,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 90,
      "sideline1Angle": 180,
      "sideline2Angle": 0,
      "endZone1Angle": 90,
      "endZone2Angle": 270
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "New York, NY"
  },
  {
    "id": "nationals",
    "name": "Nationals Park",
    "league": "MLB",
    "team": "Washington Nationals",
    "city": "Washington",
    "state": "DC",
    "latitude": 38.873,
    "longitude": -77.0074,
    "orientation": 87,
    "capacity": 41313,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 87,
      "sideline1Angle": 177,
      "sideline2Angle": 357,
      "endZone1Angle": 87,
      "endZone2Angle": 267
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Washington, DC"
  },
  {
    "id": "orioles",
    "name": "Oriole Park at Camden Yards",
    "league": "MLB",
    "team": "Baltimore Orioles",
    "city": "Baltimore",
    "state": "MD",
    "latitude": 39.2838,
    "longitude": -76.6218,
    "orientation": 58,
    "capacity": 45971,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 58,
      "sideline1Angle": 148,
      "sideline2Angle": 328,
      "endZone1Angle": 58,
      "endZone2Angle": 238
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Baltimore, MD"
  },
  {
    "id": "padres",
    "name": "Petco Park",
    "league": "MLB",
    "team": "San Diego Padres",
    "city": "San Diego",
    "state": "CA",
    "latitude": 32.7076,
    "longitude": -117.157,
    "orientation": 25,
    "capacity": 40209,
    "roof": "open",
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 25,
      "sideline1Angle": 115,
      "sideline2Angle": 295,
      "endZone1Angle": 25,
      "endZone2Angle": 205
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "San Diego, CA"
  },
  {
    "id": "phillies",
    "name": "Citizens Bank Park",
    "league": "MLB",
    "team": "Philadelphia Phillies",
    "city": "Philadelphia",
    "state": "PA",
    "latitude": 39.9061,
    "longitude": -75.1665,
    "orientation": 59,
    "capacity": 42792,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 59,
      "sideline1Angle": 149,
      "sideline2Angle": 329,
      "endZone1Angle": 59,
      "endZone2Angle": 239
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Philadelphia, PA"
  },
  {
    "id": "pirates",
    "name": "PNC Park",
    "league": "MLB",
    "team": "Pittsburgh Pirates",
    "city": "Pittsburgh",
    "state": "PA",
    "latitude": 40.4468,
    "longitude": -80.0057,
    "orientation": 25,
    "capacity": 38362,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 25,
      "sideline1Angle": 115,
      "sideline2Angle": 295,
      "endZone1Angle": 25,
      "endZone2Angle": 205
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Pittsburgh, PA"
  },
  {
    "id": "rangers",
    "name": "Globe Life Field",
    "league": "MLB",
    "team": "Texas Rangers",
    "city": "Arlington",
    "state": "TX",
    "latitude": 32.7512,
    "longitude": -97.0833,
    "orientation": 46,
    "capacity": 40300,
    "roof": "retractable",
    "timezone": "America/Denver",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 46,
      "sideline1Angle": 136,
      "sideline2Angle": 316,
      "endZone1Angle": 46,
      "endZone2Angle": 226
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Arlington, TX"
  },
  {
    "id": "rays",
    "name": "George M. Steinbrenner Field",
    "league": "MLB",
    "team": "Tampa Bay Rays",
    "city": "Tampa",
    "state": "FL",
    "latitude": 27.9628,
    "longitude": -82.5062,
    "orientation": 316,
    "capacity": 11026,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northwest-north-southeast-south",
      "primarySeatingAngle": 316,
      "sideline1Angle": 46,
      "sideline2Angle": 226,
      "endZone1Angle": 316,
      "endZone2Angle": 136
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Tampa, FL"
  },
  {
    "id": "redsox",
    "name": "Fenway Park",
    "league": "MLB",
    "team": "Boston Red Sox",
    "city": "Boston",
    "state": "MA",
    "latitude": 42.3467,
    "longitude": -71.0972,
    "orientation": 52,
    "capacity": 37755,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 52,
      "sideline1Angle": 142,
      "sideline2Angle": 322,
      "endZone1Angle": 52,
      "endZone2Angle": 232
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Boston, MA"
  },
  {
    "id": "reds",
    "name": "Great American Ball Park",
    "league": "MLB",
    "team": "Cincinnati Reds",
    "city": "Cincinnati",
    "state": "OH",
    "latitude": 39.0979,
    "longitude": -84.508,
    "orientation": 105,
    "capacity": 42319,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "east-southeast-west-northwest",
      "primarySeatingAngle": 105,
      "sideline1Angle": 195,
      "sideline2Angle": 15,
      "endZone1Angle": 105,
      "endZone2Angle": 285
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Cincinnati, OH"
  },
  {
    "id": "rockies",
    "name": "Coors Field",
    "league": "MLB",
    "team": "Colorado Rockies",
    "city": "Denver",
    "state": "CO",
    "latitude": 39.7559,
    "longitude": -104.9942,
    "orientation": 40,
    "capacity": 50144,
    "roof": "open",
    "timezone": "America/Denver",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 40,
      "sideline1Angle": 130,
      "sideline2Angle": 310,
      "endZone1Angle": 40,
      "endZone2Angle": 220
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Denver, CO"
  },
  {
    "id": "royals",
    "name": "Kauffman Stadium",
    "league": "MLB",
    "team": "Kansas City Royals",
    "city": "Kansas City",
    "state": "MO",
    "latitude": 39.0517,
    "longitude": -94.4803,
    "orientation": 58,
    "capacity": 37903,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 58,
      "sideline1Angle": 148,
      "sideline2Angle": 328,
      "endZone1Angle": 58,
      "endZone2Angle": 238
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Kansas City, MO"
  },
  {
    "id": "tigers",
    "name": "Comerica Park",
    "league": "MLB",
    "team": "Detroit Tigers",
    "city": "Detroit",
    "state": "MI",
    "latitude": 42.339,
    "longitude": -83.0485,
    "orientation": 145,
    "capacity": 41083,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "southeast-south-northwest-north",
      "primarySeatingAngle": 145,
      "sideline1Angle": 235,
      "sideline2Angle": 55,
      "endZone1Angle": 145,
      "endZone2Angle": 325
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Detroit, MI"
  },
  {
    "id": "twins",
    "name": "Target Field",
    "league": "MLB",
    "team": "Minnesota Twins",
    "city": "Minneapolis",
    "state": "MN",
    "latitude": 44.9817,
    "longitude": -93.2776,
    "orientation": 0,
    "capacity": 38544,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 0,
      "sideline1Angle": 90,
      "sideline2Angle": 270,
      "endZone1Angle": 0,
      "endZone2Angle": 180
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Minneapolis, MN"
  },
  {
    "id": "whitesox",
    "name": "Guaranteed Rate Field",
    "league": "MLB",
    "team": "Chicago White Sox",
    "city": "Chicago",
    "state": "IL",
    "latitude": 41.8299,
    "longitude": -87.6338,
    "orientation": 90,
    "capacity": 40615,
    "roof": "open",
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 90,
      "sideline1Angle": 180,
      "sideline2Angle": 0,
      "endZone1Angle": 90,
      "endZone2Angle": 270
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "Chicago, IL"
  },
  {
    "id": "yankees",
    "name": "Yankee Stadium",
    "league": "MLB",
    "team": "New York Yankees",
    "city": "New York",
    "state": "NY",
    "latitude": 40.8296,
    "longitude": -73.9262,
    "orientation": 55,
    "capacity": 46537,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "diamond",
      "fieldDimensions": {
        "length": 330,
        "width": 330
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 55,
      "sideline1Angle": 145,
      "sideline2Angle": 325,
      "endZone1Angle": 55,
      "endZone2Angle": 235
    },
    "venueType": "baseball",
    "sport": "baseball",
    "address": "New York, NY"
  },
  {
    "id": "highmark-stadium",
    "name": "Highmark Stadium",
    "league": "NFL",
    "team": "Buffalo Bills",
    "city": "Orchard Park",
    "state": "NY",
    "latitude": 42.7738,
    "longitude": -78.787,
    "orientation": 50,
    "capacity": 71608,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 50,
      "sideline1Angle": 140,
      "sideline2Angle": 320,
      "endZone1Angle": 50,
      "endZone2Angle": 230
    },
    "venueType": "football",
    "sport": "football",
    "surface": "turf",
    "opened": 1973,
    "address": "Orchard Park, NY",
    "features": [
      "Wind-prone",
      "Lake effect weather"
    ]
  },
  {
    "id": "hard-rock-stadium",
    "name": "Hard Rock Stadium",
    "league": "NFL",
    "team": "Miami Dolphins",
    "city": "Miami Gardens",
    "state": "FL",
    "latitude": 25.958,
    "longitude": -80.2389,
    "orientation": 0,
    "capacity": 65326,
    "roof": "open",
    "upperDeckHeight": 140,
    "timezone": "America/New_York",
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
    "sport": "football",
    "surface": "grass",
    "opened": 1987,
    "address": "Miami Gardens, FL",
    "features": [
      "Canopy covers 92% of seats",
      "Open ends"
    ]
  },
  {
    "id": "gillette-stadium",
    "name": "Gillette Stadium",
    "league": "NFL",
    "team": "New England Patriots",
    "city": "Foxborough",
    "state": "MA",
    "latitude": 42.0909,
    "longitude": -71.2643,
    "orientation": 0,
    "capacity": 65878,
    "roof": "open",
    "timezone": "America/New_York",
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
    "sport": "football",
    "surface": "turf",
    "opened": 2002,
    "address": "Foxborough, MA",
    "features": [
      "Lighthouse",
      "Open concourses"
    ]
  },
  {
    "id": "metlife-stadium-jets",
    "name": "MetLife Stadium",
    "league": "NFL",
    "team": "New York Jets",
    "city": "East Rutherford",
    "state": "NJ",
    "latitude": 40.8128,
    "longitude": -74.0742,
    "orientation": 23,
    "capacity": 82500,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 23,
      "sideline1Angle": 113,
      "sideline2Angle": 293,
      "endZone1Angle": 23,
      "endZone2Angle": 203
    },
    "venueType": "football",
    "sport": "football",
    "surface": "turf",
    "opened": 2010,
    "address": "East Rutherford, NJ",
    "features": [
      "Largest NFL stadium by seating",
      "Shared by two teams"
    ]
  },
  {
    "id": "m-t-bank-stadium",
    "name": "M&T Bank Stadium",
    "league": "NFL",
    "team": "Baltimore Ravens",
    "city": "Baltimore",
    "state": "MD",
    "latitude": 39.278,
    "longitude": -76.6227,
    "orientation": 22,
    "capacity": 71008,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 22,
      "sideline1Angle": 112,
      "sideline2Angle": 292,
      "endZone1Angle": 22,
      "endZone2Angle": 202
    },
    "venueType": "football",
    "sport": "football",
    "surface": "grass",
    "opened": 1998,
    "address": "Baltimore, MD",
    "features": [
      "Downtown location",
      "Purple seats"
    ]
  },
  {
    "id": "paycor-stadium",
    "name": "Paycor Stadium",
    "league": "NFL",
    "team": "Cincinnati Bengals",
    "city": "Cincinnati",
    "state": "OH",
    "latitude": 39.0954,
    "longitude": -84.516,
    "orientation": 13,
    "capacity": 65515,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 13,
      "sideline1Angle": 103,
      "sideline2Angle": 283,
      "endZone1Angle": 13,
      "endZone2Angle": 193
    },
    "venueType": "football",
    "sport": "football",
    "surface": "turf",
    "opened": 2000,
    "address": "Cincinnati, OH",
    "features": [
      "Riverfront location",
      "Jungle-themed"
    ]
  },
  {
    "id": "huntington-bank-field",
    "name": "Huntington Bank Field",
    "league": "NFL",
    "team": "Cleveland Browns",
    "city": "Cleveland",
    "state": "OH",
    "latitude": 41.5061,
    "longitude": -81.6995,
    "orientation": 287,
    "capacity": 67431,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "west-northwest-east-southeast",
      "primarySeatingAngle": 287,
      "sideline1Angle": 17,
      "sideline2Angle": 197,
      "endZone1Angle": 287,
      "endZone2Angle": 107
    },
    "venueType": "football",
    "sport": "football",
    "surface": "grass",
    "opened": 1999,
    "address": "Cleveland, OH",
    "features": [
      "Lake Erie winds",
      "Dawg Pound"
    ]
  },
  {
    "id": "acrisure-stadium",
    "name": "Acrisure Stadium",
    "league": "NFL",
    "team": "Pittsburgh Steelers",
    "city": "Pittsburgh",
    "state": "PA",
    "latitude": 40.4468,
    "longitude": -80.0158,
    "orientation": 275,
    "capacity": 68400,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "west-northwest-east-southeast",
      "primarySeatingAngle": 275,
      "sideline1Angle": 5,
      "sideline2Angle": 185,
      "endZone1Angle": 275,
      "endZone2Angle": 95
    },
    "venueType": "football",
    "sport": "football",
    "surface": "grass",
    "opened": 2001,
    "address": "Pittsburgh, PA",
    "features": [
      "Open end zone",
      "River views"
    ]
  },
  {
    "id": "nrg-stadium",
    "name": "NRG Stadium",
    "league": "NFL",
    "team": "Houston Texans",
    "city": "Houston",
    "state": "TX",
    "latitude": 29.6847,
    "longitude": -95.4107,
    "orientation": 0,
    "capacity": 72220,
    "roof": "retractable",
    "roofHeight": 210,
    "timezone": "America/Chicago",
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
    "sport": "football",
    "surface": "turf",
    "opened": 2002,
    "address": "Houston, TX",
    "features": [
      "First NFL retractable roof",
      "Usually closed"
    ]
  },
  {
    "id": "lucas-oil-stadium",
    "name": "Lucas Oil Stadium",
    "league": "NFL",
    "team": "Indianapolis Colts",
    "city": "Indianapolis",
    "state": "IN",
    "latitude": 39.7601,
    "longitude": -86.1639,
    "orientation": 0,
    "capacity": 67000,
    "roof": "retractable",
    "roofHeight": 184,
    "timezone": "America/New_York",
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
    "sport": "football",
    "surface": "turf",
    "opened": 2008,
    "address": "Indianapolis, IN",
    "features": [
      "Window wall",
      "Downtown location"
    ]
  },
  {
    "id": "everbank-stadium",
    "name": "EverBank Stadium",
    "league": "NFL",
    "team": "Jacksonville Jaguars",
    "city": "Jacksonville",
    "state": "FL",
    "latitude": 30.3239,
    "longitude": -81.6373,
    "orientation": 22,
    "capacity": 69132,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 22,
      "sideline1Angle": 112,
      "sideline2Angle": 292,
      "endZone1Angle": 22,
      "endZone2Angle": 202
    },
    "venueType": "football",
    "sport": "football",
    "surface": "grass",
    "opened": 1995,
    "address": "Jacksonville, FL",
    "features": [
      "Pools",
      "Cabanas",
      "Stadium of the Future renovations"
    ]
  },
  {
    "id": "nissan-stadium",
    "name": "Nissan Stadium",
    "league": "NFL",
    "team": "Tennessee Titans",
    "city": "Nashville",
    "state": "TN",
    "latitude": 36.1665,
    "longitude": -86.7713,
    "orientation": 0,
    "capacity": 69143,
    "roof": "open",
    "timezone": "America/Chicago",
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
    "sport": "football",
    "surface": "grass",
    "opened": 1999,
    "address": "Nashville, TN",
    "features": [
      "River location",
      "New stadium planned for 2027"
    ]
  },
  {
    "id": "empower-field",
    "name": "Empower Field at Mile High",
    "league": "NFL",
    "team": "Denver Broncos",
    "city": "Denver",
    "state": "CO",
    "latitude": 39.7439,
    "longitude": -105.02,
    "orientation": 0,
    "capacity": 76125,
    "roof": "open",
    "timezone": "America/Denver",
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
    "sport": "football",
    "surface": "grass",
    "opened": 2001,
    "address": "Denver, CO",
    "features": [
      "Mile High altitude",
      "Ring of Fame"
    ]
  },
  {
    "id": "geha-field-arrowhead",
    "name": "GEHA Field at Arrowhead Stadium",
    "league": "NFL",
    "team": "Kansas City Chiefs",
    "city": "Kansas City",
    "state": "MO",
    "latitude": 39.0489,
    "longitude": -94.4839,
    "orientation": 0,
    "capacity": 76416,
    "roof": "open",
    "timezone": "America/Chicago",
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
    "sport": "football",
    "surface": "grass",
    "opened": 1972,
    "address": "Kansas City, MO",
    "features": [
      "Loudest stadium",
      "Sea of Red"
    ]
  },
  {
    "id": "allegiant-stadium",
    "name": "Allegiant Stadium",
    "league": "NFL",
    "team": "Las Vegas Raiders",
    "city": "Las Vegas",
    "state": "NV",
    "latitude": 36.0909,
    "longitude": -115.1833,
    "orientation": 0,
    "capacity": 65000,
    "roof": "fixed",
    "roofHeight": 275,
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
    "sport": "football",
    "surface": "grass",
    "opened": 2020,
    "address": "Las Vegas, NV",
    "features": [
      "Translucent roof",
      "Natural grass tray system"
    ]
  },
  {
    "id": "sofi-stadium-chargers",
    "name": "SoFi Stadium",
    "league": "NFL",
    "team": "Los Angeles Chargers",
    "city": "Los Angeles",
    "state": "CA",
    "latitude": 33.9535,
    "longitude": -118.3392,
    "orientation": 90,
    "capacity": 70240,
    "roof": "fixed",
    "roofHeight": 150,
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 90,
      "sideline1Angle": 180,
      "sideline2Angle": 0,
      "endZone1Angle": 90,
      "endZone2Angle": 270
    },
    "venueType": "football",
    "sport": "football",
    "surface": "turf",
    "opened": 2020,
    "address": "Los Angeles, CA",
    "features": [
      "Open sides",
      "Oculus video board"
    ]
  },
  {
    "id": "at-t-stadium",
    "name": "AT&T Stadium",
    "league": "NFL",
    "team": "Dallas Cowboys",
    "city": "Arlington",
    "state": "TX",
    "latitude": 32.7473,
    "longitude": -97.0945,
    "orientation": 340,
    "capacity": 80000,
    "roof": "retractable",
    "roofHeight": 292,
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "northwest-north-southeast-south",
      "primarySeatingAngle": 340,
      "sideline1Angle": 70,
      "sideline2Angle": 250,
      "endZone1Angle": 340,
      "endZone2Angle": 160
    },
    "venueType": "football",
    "sport": "football",
    "surface": "turf",
    "opened": 2009,
    "address": "Arlington, TX",
    "features": [
      "Largest video board",
      "Glass doors"
    ]
  },
  {
    "id": "metlife-stadium-giants",
    "name": "MetLife Stadium",
    "league": "NFL",
    "team": "New York Giants",
    "city": "East Rutherford",
    "state": "NJ",
    "latitude": 40.8128,
    "longitude": -74.0742,
    "orientation": 23,
    "capacity": 82500,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 23,
      "sideline1Angle": 113,
      "sideline2Angle": 293,
      "endZone1Angle": 23,
      "endZone2Angle": 203
    },
    "venueType": "football",
    "sport": "football",
    "surface": "turf",
    "opened": 2010,
    "address": "East Rutherford, NJ",
    "features": [
      "Shared with Jets",
      "Largest NFL stadium"
    ]
  },
  {
    "id": "lincoln-financial-field",
    "name": "Lincoln Financial Field",
    "league": "NFL",
    "team": "Philadelphia Eagles",
    "city": "Philadelphia",
    "state": "PA",
    "latitude": 39.9008,
    "longitude": -75.1675,
    "orientation": 5,
    "capacity": 69596,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "north-northeast-south-southwest",
      "primarySeatingAngle": 5,
      "sideline1Angle": 95,
      "sideline2Angle": 275,
      "endZone1Angle": 5,
      "endZone2Angle": 185
    },
    "venueType": "football",
    "sport": "football",
    "surface": "hybrid",
    "opened": 2003,
    "address": "Philadelphia, PA",
    "features": [
      "Solar panels",
      "Wind turbines"
    ]
  },
  {
    "id": "northwest-stadium",
    "name": "Northwest Stadium",
    "league": "NFL",
    "team": "Washington Commanders",
    "city": "Landover",
    "state": "MD",
    "latitude": 38.9076,
    "longitude": -76.8645,
    "orientation": 58,
    "capacity": 67617,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 58,
      "sideline1Angle": 148,
      "sideline2Angle": 328,
      "endZone1Angle": 58,
      "endZone2Angle": 238
    },
    "venueType": "football",
    "sport": "football",
    "surface": "grass",
    "opened": 1997,
    "address": "Landover, MD",
    "features": [
      "New stadium planned"
    ]
  },
  {
    "id": "soldier-field",
    "name": "Soldier Field",
    "league": "NFL",
    "team": "Chicago Bears",
    "city": "Chicago",
    "state": "IL",
    "latitude": 41.8623,
    "longitude": -87.6167,
    "orientation": 0,
    "capacity": 61500,
    "roof": "open",
    "timezone": "America/Chicago",
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
    "sport": "football",
    "surface": "grass",
    "opened": 1924,
    "address": "Chicago, IL",
    "features": [
      "Smallest NFL capacity",
      "Historic colonnades"
    ]
  },
  {
    "id": "ford-field",
    "name": "Ford Field",
    "league": "NFL",
    "team": "Detroit Lions",
    "city": "Detroit",
    "state": "MI",
    "latitude": 42.34,
    "longitude": -83.0456,
    "orientation": 45,
    "capacity": 65000,
    "roof": "fixed",
    "roofHeight": 235,
    "timezone": "America/Detroit",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "northeast-southwest",
      "primarySeatingAngle": 45,
      "sideline1Angle": 135,
      "sideline2Angle": 315,
      "endZone1Angle": 45,
      "endZone2Angle": 225
    },
    "venueType": "football",
    "sport": "football",
    "surface": "turf",
    "opened": 2002,
    "address": "Detroit, MI",
    "features": [
      "Downtown location",
      "Windows"
    ]
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
      "endZoneOrientation": "northeast-southwest",
      "primarySeatingAngle": 45,
      "sideline1Angle": 135,
      "sideline2Angle": 315,
      "endZone1Angle": 45,
      "endZone2Angle": 225
    },
    "venueType": "football",
    "sport": "football",
    "surface": "hybrid",
    "opened": 1957,
    "address": "Green Bay, WI",
    "features": [
      "Frozen Tundra",
      "Historic venue"
    ]
  },
  {
    "id": "us-bank-stadium",
    "name": "U.S. Bank Stadium",
    "league": "NFL",
    "team": "Minnesota Vikings",
    "city": "Minneapolis",
    "state": "MN",
    "latitude": 44.9738,
    "longitude": -93.2575,
    "orientation": 88,
    "capacity": 66655,
    "roof": "fixed",
    "roofHeight": 245,
    "timezone": "America/Chicago",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 88,
      "sideline1Angle": 178,
      "sideline2Angle": 358,
      "endZone1Angle": 88,
      "endZone2Angle": 268
    },
    "venueType": "football",
    "sport": "football",
    "surface": "turf",
    "opened": 2016,
    "address": "Minneapolis, MN",
    "features": [
      "ETFE roof",
      "Nordic design"
    ]
  },
  {
    "id": "mercedes-benz-stadium",
    "name": "Mercedes-Benz Stadium",
    "league": "NFL",
    "team": "Atlanta Falcons",
    "city": "Atlanta",
    "state": "GA",
    "latitude": 33.7554,
    "longitude": -84.4009,
    "orientation": 0,
    "capacity": 71000,
    "roof": "retractable",
    "roofHeight": 295,
    "timezone": "America/New_York",
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
    "sport": "football",
    "surface": "turf",
    "opened": 2017,
    "address": "Atlanta, GA",
    "features": [
      "Pinwheel roof",
      "360° video board"
    ]
  },
  {
    "id": "bank-of-america-stadium",
    "name": "Bank of America Stadium",
    "league": "NFL",
    "team": "Carolina Panthers",
    "city": "Charlotte",
    "state": "NC",
    "latitude": 35.2258,
    "longitude": -80.8528,
    "orientation": 75,
    "capacity": 75523,
    "roof": "open",
    "timezone": "America/New_York",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "northeast-east-southwest-west",
      "primarySeatingAngle": 75,
      "sideline1Angle": 165,
      "sideline2Angle": 345,
      "endZone1Angle": 75,
      "endZone2Angle": 255
    },
    "venueType": "football",
    "sport": "football",
    "surface": "grass",
    "opened": 1996,
    "address": "Charlotte, NC",
    "features": [
      "Three open corners",
      "Panther statues"
    ]
  },
  {
    "id": "caesars-superdome",
    "name": "Caesars Superdome",
    "league": "NFL",
    "team": "New Orleans Saints",
    "city": "New Orleans",
    "state": "LA",
    "latitude": 29.9511,
    "longitude": -90.0812,
    "orientation": 0,
    "capacity": 73208,
    "roof": "fixed",
    "roofHeight": 273,
    "timezone": "America/Chicago",
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
    "sport": "football",
    "surface": "turf",
    "opened": 1975,
    "address": "New Orleans, LA",
    "features": [
      "Iconic dome",
      "Recently renovated"
    ]
  },
  {
    "id": "raymond-james-stadium",
    "name": "Raymond James Stadium",
    "league": "NFL",
    "team": "Tampa Bay Buccaneers",
    "city": "Tampa",
    "state": "FL",
    "latitude": 27.9759,
    "longitude": -82.5033,
    "orientation": 0,
    "capacity": 69218,
    "roof": "open",
    "timezone": "America/New_York",
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
    "sport": "football",
    "surface": "grass",
    "opened": 1998,
    "address": "Tampa, FL",
    "features": [
      "Pirate ship",
      "Cannons"
    ]
  },
  {
    "id": "state-farm-stadium",
    "name": "State Farm Stadium",
    "league": "NFL",
    "team": "Arizona Cardinals",
    "city": "Glendale",
    "state": "AZ",
    "latitude": 33.5276,
    "longitude": -112.2626,
    "orientation": 0,
    "capacity": 63400,
    "roof": "retractable",
    "roofHeight": 200,
    "timezone": "America/Phoenix",
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
    "sport": "football",
    "surface": "grass",
    "opened": 2006,
    "address": "Glendale, AZ",
    "features": [
      "Roll-out field",
      "AC when closed"
    ]
  },
  {
    "id": "sofi-stadium-rams",
    "name": "SoFi Stadium",
    "league": "NFL",
    "team": "Los Angeles Rams",
    "city": "Los Angeles",
    "state": "CA",
    "latitude": 33.9535,
    "longitude": -118.3392,
    "orientation": 90,
    "capacity": 70240,
    "roof": "fixed",
    "roofHeight": 150,
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 90,
      "sideline1Angle": 180,
      "sideline2Angle": 0,
      "endZone1Angle": 90,
      "endZone2Angle": 270
    },
    "venueType": "football",
    "sport": "football",
    "surface": "turf",
    "opened": 2020,
    "address": "Los Angeles, CA",
    "features": [
      "Open sides",
      "Oculus video board"
    ]
  },
  {
    "id": "levis-stadium",
    "name": "Levi's Stadium",
    "league": "NFL",
    "team": "San Francisco 49ers",
    "city": "Santa Clara",
    "state": "CA",
    "latitude": 37.4033,
    "longitude": -121.9694,
    "orientation": 310,
    "capacity": 68500,
    "roof": "open",
    "timezone": "America/Los_Angeles",
    "seatingGeometry": {
      "bowlShape": "rectangular",
      "fieldDimensions": {
        "length": 120,
        "width": 53.3
      },
      "endZoneOrientation": "west-northwest-east-southeast",
      "primarySeatingAngle": 310,
      "sideline1Angle": 40,
      "sideline2Angle": 220,
      "endZone1Angle": 310,
      "endZone2Angle": 130
    },
    "venueType": "football",
    "sport": "football",
    "surface": "grass",
    "opened": 2014,
    "address": "Santa Clara, CA",
    "features": [
      "Solar panels",
      "Tech integration",
      "Hot east side"
    ]
  },
  {
    "id": "lumen-field",
    "name": "Lumen Field",
    "league": "NFL",
    "team": "Seattle Seahawks",
    "city": "Seattle",
    "state": "WA",
    "latitude": 47.5952,
    "longitude": -122.3316,
    "orientation": 0,
    "capacity": 69000,
    "roof": "open",
    "upperDeckHeight": 180,
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
    "sport": "football",
    "surface": "turf",
    "opened": 2002,
    "address": "Seattle, WA",
    "features": [
      "Partial roof coverage",
      "12th Man",
      "Extremely loud"
    ]
  }
];

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
