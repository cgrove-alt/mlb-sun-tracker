// Auto-generated venues data
// Generated on 2025-08-01T17:18:01.373Z

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
      "endZoneOrientation": "northeast-southwest",
      "primarySeatingAngle": 50,
      "sideline1Angle": 140,
      "sideline2Angle": 320,
      "endZone1Angle": 50,
      "endZone2Angle": 230
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 1973,
    "address": "Orchard Park, NY"
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
    "surface": "grass",
    "opened": 1987,
    "address": "Miami Gardens, FL"
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
    "surface": "turf",
    "opened": 2002,
    "address": "Foxborough, MA"
  },
  {
    "id": "metlife-stadium",
    "name": "MetLife Stadium",
    "league": "NFL",
    "team": "New York Jets",
    "alternateTeams": [
      "New York Giants"
    ],
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
      "endZoneOrientation": "northeast-southwest",
      "primarySeatingAngle": 23,
      "sideline1Angle": 113,
      "sideline2Angle": 293,
      "endZone1Angle": 23,
      "endZone2Angle": 203
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2010,
    "address": "East Rutherford, NJ"
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 22,
      "sideline1Angle": 112,
      "sideline2Angle": 292,
      "endZone1Angle": 22,
      "endZone2Angle": 202
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1998,
    "address": "Baltimore, MD"
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 13,
      "sideline1Angle": 103,
      "sideline2Angle": 283,
      "endZone1Angle": 13,
      "endZone2Angle": 193
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2000,
    "address": "Cincinnati, OH"
  },
  {
    "id": "cleveland-browns-stadium",
    "name": "Cleveland Browns Stadium",
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
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 287,
      "sideline1Angle": 17,
      "sideline2Angle": 197,
      "endZone1Angle": 287,
      "endZone2Angle": 107
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1999,
    "address": "Cleveland, OH"
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
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 275,
      "sideline1Angle": 5,
      "sideline2Angle": 185,
      "endZone1Angle": 275,
      "endZone2Angle": 95
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 2001,
    "address": "Pittsburgh, PA"
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
    "surface": "turf",
    "opened": 2002,
    "address": "Houston, TX"
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
    "surface": "turf",
    "opened": 2008,
    "address": "Indianapolis, IN"
  },
  {
    "id": "tiaa-bank-field",
    "name": "TIAA Bank Field",
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 22,
      "sideline1Angle": 112,
      "sideline2Angle": 292,
      "endZone1Angle": 22,
      "endZone2Angle": 202
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1995,
    "address": "Jacksonville, FL"
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
    "surface": "grass",
    "opened": 1999,
    "address": "Nashville, TN"
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
    "surface": "grass",
    "opened": 2001,
    "address": "Denver, CO"
  },
  {
    "id": "arrowhead-stadium",
    "name": "Arrowhead Stadium",
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
    "surface": "grass",
    "opened": 1972,
    "address": "Kansas City, MO"
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
    "surface": "grass",
    "opened": 2020,
    "address": "Las Vegas, NV"
  },
  {
    "id": "sofi-stadium",
    "name": "SoFi Stadium",
    "league": "NFL",
    "team": "Los Angeles Chargers",
    "alternateTeams": [
      "Los Angeles Rams"
    ],
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
    "surface": "turf",
    "opened": 2020,
    "address": "Los Angeles, CA"
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 340,
      "sideline1Angle": 70,
      "sideline2Angle": 250,
      "endZone1Angle": 340,
      "endZone2Angle": 160
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2009,
    "address": "Arlington, TX"
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 5,
      "sideline1Angle": 95,
      "sideline2Angle": 275,
      "endZone1Angle": 5,
      "endZone2Angle": 185
    },
    "venueType": "football",
    "surface": "hybrid",
    "opened": 2003,
    "address": "Philadelphia, PA"
  },
  {
    "id": "fedexfield",
    "name": "FedExField",
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
      "endZoneOrientation": "northeast-southwest",
      "primarySeatingAngle": 58,
      "sideline1Angle": 148,
      "sideline2Angle": 328,
      "endZone1Angle": 58,
      "endZone2Angle": 238
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1997,
    "address": "Landover, MD"
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
    "surface": "grass",
    "opened": 1924,
    "address": "Chicago, IL"
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
    "surface": "turf",
    "opened": 2002,
    "address": "Detroit, MI"
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
    "surface": "hybrid",
    "opened": 1957,
    "address": "Green Bay, WI"
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
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 88,
      "sideline1Angle": 178,
      "sideline2Angle": 358,
      "endZone1Angle": 88,
      "endZone2Angle": 268
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2016,
    "address": "Minneapolis, MN"
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
    "surface": "turf",
    "opened": 2017,
    "address": "Atlanta, GA"
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
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 75,
      "sideline1Angle": 165,
      "sideline2Angle": 345,
      "endZone1Angle": 75,
      "endZone2Angle": 255
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1996,
    "address": "Charlotte, NC"
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
    "surface": "turf",
    "opened": 1975,
    "address": "New Orleans, LA"
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
    "surface": "grass",
    "opened": 1998,
    "address": "Tampa, FL"
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
    "surface": "grass",
    "opened": 2006,
    "address": "Glendale, AZ"
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
      "endZoneOrientation": "northwest-southeast",
      "primarySeatingAngle": 310,
      "sideline1Angle": 40,
      "sideline2Angle": 220,
      "endZone1Angle": 310,
      "endZone2Angle": 130
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 2014,
    "address": "Santa Clara, CA"
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
    "surface": "turf",
    "opened": 2002,
    "address": "Seattle, WA"
  }
];

export const VENUES_BY_LEAGUE: Record<string, Venue[]> = {
  "NFL": [
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
      "endZoneOrientation": "northeast-southwest",
      "primarySeatingAngle": 50,
      "sideline1Angle": 140,
      "sideline2Angle": 320,
      "endZone1Angle": 50,
      "endZone2Angle": 230
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 1973,
    "address": "Orchard Park, NY"
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
    "surface": "grass",
    "opened": 1987,
    "address": "Miami Gardens, FL"
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
    "surface": "turf",
    "opened": 2002,
    "address": "Foxborough, MA"
  },
  {
    "id": "metlife-stadium",
    "name": "MetLife Stadium",
    "league": "NFL",
    "team": "New York Jets",
    "alternateTeams": [
      "New York Giants"
    ],
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
      "endZoneOrientation": "northeast-southwest",
      "primarySeatingAngle": 23,
      "sideline1Angle": 113,
      "sideline2Angle": 293,
      "endZone1Angle": 23,
      "endZone2Angle": 203
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2010,
    "address": "East Rutherford, NJ"
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 22,
      "sideline1Angle": 112,
      "sideline2Angle": 292,
      "endZone1Angle": 22,
      "endZone2Angle": 202
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1998,
    "address": "Baltimore, MD"
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 13,
      "sideline1Angle": 103,
      "sideline2Angle": 283,
      "endZone1Angle": 13,
      "endZone2Angle": 193
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2000,
    "address": "Cincinnati, OH"
  },
  {
    "id": "cleveland-browns-stadium",
    "name": "Cleveland Browns Stadium",
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
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 287,
      "sideline1Angle": 17,
      "sideline2Angle": 197,
      "endZone1Angle": 287,
      "endZone2Angle": 107
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1999,
    "address": "Cleveland, OH"
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
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 275,
      "sideline1Angle": 5,
      "sideline2Angle": 185,
      "endZone1Angle": 275,
      "endZone2Angle": 95
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 2001,
    "address": "Pittsburgh, PA"
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
    "surface": "turf",
    "opened": 2002,
    "address": "Houston, TX"
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
    "surface": "turf",
    "opened": 2008,
    "address": "Indianapolis, IN"
  },
  {
    "id": "tiaa-bank-field",
    "name": "TIAA Bank Field",
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 22,
      "sideline1Angle": 112,
      "sideline2Angle": 292,
      "endZone1Angle": 22,
      "endZone2Angle": 202
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1995,
    "address": "Jacksonville, FL"
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
    "surface": "grass",
    "opened": 1999,
    "address": "Nashville, TN"
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
    "surface": "grass",
    "opened": 2001,
    "address": "Denver, CO"
  },
  {
    "id": "arrowhead-stadium",
    "name": "Arrowhead Stadium",
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
    "surface": "grass",
    "opened": 1972,
    "address": "Kansas City, MO"
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
    "surface": "grass",
    "opened": 2020,
    "address": "Las Vegas, NV"
  },
  {
    "id": "sofi-stadium",
    "name": "SoFi Stadium",
    "league": "NFL",
    "team": "Los Angeles Chargers",
    "alternateTeams": [
      "Los Angeles Rams"
    ],
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
    "surface": "turf",
    "opened": 2020,
    "address": "Los Angeles, CA"
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 340,
      "sideline1Angle": 70,
      "sideline2Angle": 250,
      "endZone1Angle": 340,
      "endZone2Angle": 160
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2009,
    "address": "Arlington, TX"
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
      "endZoneOrientation": "north-south",
      "primarySeatingAngle": 5,
      "sideline1Angle": 95,
      "sideline2Angle": 275,
      "endZone1Angle": 5,
      "endZone2Angle": 185
    },
    "venueType": "football",
    "surface": "hybrid",
    "opened": 2003,
    "address": "Philadelphia, PA"
  },
  {
    "id": "fedexfield",
    "name": "FedExField",
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
      "endZoneOrientation": "northeast-southwest",
      "primarySeatingAngle": 58,
      "sideline1Angle": 148,
      "sideline2Angle": 328,
      "endZone1Angle": 58,
      "endZone2Angle": 238
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1997,
    "address": "Landover, MD"
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
    "surface": "grass",
    "opened": 1924,
    "address": "Chicago, IL"
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
    "surface": "turf",
    "opened": 2002,
    "address": "Detroit, MI"
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
    "surface": "hybrid",
    "opened": 1957,
    "address": "Green Bay, WI"
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
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 88,
      "sideline1Angle": 178,
      "sideline2Angle": 358,
      "endZone1Angle": 88,
      "endZone2Angle": 268
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2016,
    "address": "Minneapolis, MN"
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
    "surface": "turf",
    "opened": 2017,
    "address": "Atlanta, GA"
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
      "endZoneOrientation": "east-west",
      "primarySeatingAngle": 75,
      "sideline1Angle": 165,
      "sideline2Angle": 345,
      "endZone1Angle": 75,
      "endZone2Angle": 255
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1996,
    "address": "Charlotte, NC"
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
    "surface": "turf",
    "opened": 1975,
    "address": "New Orleans, LA"
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
    "surface": "grass",
    "opened": 1998,
    "address": "Tampa, FL"
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
    "surface": "grass",
    "opened": 2006,
    "address": "Glendale, AZ"
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
      "endZoneOrientation": "northwest-southeast",
      "primarySeatingAngle": 310,
      "sideline1Angle": 40,
      "sideline2Angle": 220,
      "endZone1Angle": 310,
      "endZone2Angle": 130
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 2014,
    "address": "Santa Clara, CA"
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
    "surface": "turf",
    "opened": 2002,
    "address": "Seattle, WA"
  }
]
};

export const VENUE_BY_ID: Record<string, Venue> = {
  "highmark-stadium": {
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
        "endZoneOrientation": "northeast-southwest",
        "primarySeatingAngle": 50,
        "sideline1Angle": 140,
        "sideline2Angle": 320,
        "endZone1Angle": 50,
        "endZone2Angle": 230
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 1973,
    "address": "Orchard Park, NY"
},
  "hard-rock-stadium": {
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
    "surface": "grass",
    "opened": 1987,
    "address": "Miami Gardens, FL"
},
  "gillette-stadium": {
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
    "surface": "turf",
    "opened": 2002,
    "address": "Foxborough, MA"
},
  "metlife-stadium": {
    "id": "metlife-stadium",
    "name": "MetLife Stadium",
    "league": "NFL",
    "team": "New York Jets",
    "alternateTeams": [
        "New York Giants"
    ],
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
        "endZoneOrientation": "northeast-southwest",
        "primarySeatingAngle": 23,
        "sideline1Angle": 113,
        "sideline2Angle": 293,
        "endZone1Angle": 23,
        "endZone2Angle": 203
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2010,
    "address": "East Rutherford, NJ"
},
  "m-t-bank-stadium": {
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
        "endZoneOrientation": "north-south",
        "primarySeatingAngle": 22,
        "sideline1Angle": 112,
        "sideline2Angle": 292,
        "endZone1Angle": 22,
        "endZone2Angle": 202
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1998,
    "address": "Baltimore, MD"
},
  "paycor-stadium": {
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
        "endZoneOrientation": "north-south",
        "primarySeatingAngle": 13,
        "sideline1Angle": 103,
        "sideline2Angle": 283,
        "endZone1Angle": 13,
        "endZone2Angle": 193
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2000,
    "address": "Cincinnati, OH"
},
  "cleveland-browns-stadium": {
    "id": "cleveland-browns-stadium",
    "name": "Cleveland Browns Stadium",
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
        "endZoneOrientation": "east-west",
        "primarySeatingAngle": 287,
        "sideline1Angle": 17,
        "sideline2Angle": 197,
        "endZone1Angle": 287,
        "endZone2Angle": 107
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1999,
    "address": "Cleveland, OH"
},
  "acrisure-stadium": {
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
        "endZoneOrientation": "east-west",
        "primarySeatingAngle": 275,
        "sideline1Angle": 5,
        "sideline2Angle": 185,
        "endZone1Angle": 275,
        "endZone2Angle": 95
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 2001,
    "address": "Pittsburgh, PA"
},
  "nrg-stadium": {
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
    "surface": "turf",
    "opened": 2002,
    "address": "Houston, TX"
},
  "lucas-oil-stadium": {
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
    "surface": "turf",
    "opened": 2008,
    "address": "Indianapolis, IN"
},
  "tiaa-bank-field": {
    "id": "tiaa-bank-field",
    "name": "TIAA Bank Field",
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
        "endZoneOrientation": "north-south",
        "primarySeatingAngle": 22,
        "sideline1Angle": 112,
        "sideline2Angle": 292,
        "endZone1Angle": 22,
        "endZone2Angle": 202
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1995,
    "address": "Jacksonville, FL"
},
  "nissan-stadium": {
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
    "surface": "grass",
    "opened": 1999,
    "address": "Nashville, TN"
},
  "empower-field": {
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
    "surface": "grass",
    "opened": 2001,
    "address": "Denver, CO"
},
  "arrowhead-stadium": {
    "id": "arrowhead-stadium",
    "name": "Arrowhead Stadium",
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
    "surface": "grass",
    "opened": 1972,
    "address": "Kansas City, MO"
},
  "allegiant-stadium": {
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
    "surface": "grass",
    "opened": 2020,
    "address": "Las Vegas, NV"
},
  "sofi-stadium": {
    "id": "sofi-stadium",
    "name": "SoFi Stadium",
    "league": "NFL",
    "team": "Los Angeles Chargers",
    "alternateTeams": [
        "Los Angeles Rams"
    ],
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
    "surface": "turf",
    "opened": 2020,
    "address": "Los Angeles, CA"
},
  "at-t-stadium": {
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
        "endZoneOrientation": "north-south",
        "primarySeatingAngle": 340,
        "sideline1Angle": 70,
        "sideline2Angle": 250,
        "endZone1Angle": 340,
        "endZone2Angle": 160
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2009,
    "address": "Arlington, TX"
},
  "lincoln-financial-field": {
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
        "endZoneOrientation": "north-south",
        "primarySeatingAngle": 5,
        "sideline1Angle": 95,
        "sideline2Angle": 275,
        "endZone1Angle": 5,
        "endZone2Angle": 185
    },
    "venueType": "football",
    "surface": "hybrid",
    "opened": 2003,
    "address": "Philadelphia, PA"
},
  "fedexfield": {
    "id": "fedexfield",
    "name": "FedExField",
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
        "endZoneOrientation": "northeast-southwest",
        "primarySeatingAngle": 58,
        "sideline1Angle": 148,
        "sideline2Angle": 328,
        "endZone1Angle": 58,
        "endZone2Angle": 238
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1997,
    "address": "Landover, MD"
},
  "soldier-field": {
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
    "surface": "grass",
    "opened": 1924,
    "address": "Chicago, IL"
},
  "ford-field": {
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
    "surface": "turf",
    "opened": 2002,
    "address": "Detroit, MI"
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
        "endZoneOrientation": "northeast-southwest",
        "primarySeatingAngle": 45,
        "sideline1Angle": 135,
        "sideline2Angle": 315,
        "endZone1Angle": 45,
        "endZone2Angle": 225
    },
    "venueType": "football",
    "surface": "hybrid",
    "opened": 1957,
    "address": "Green Bay, WI"
},
  "us-bank-stadium": {
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
        "endZoneOrientation": "east-west",
        "primarySeatingAngle": 88,
        "sideline1Angle": 178,
        "sideline2Angle": 358,
        "endZone1Angle": 88,
        "endZone2Angle": 268
    },
    "venueType": "football",
    "surface": "turf",
    "opened": 2016,
    "address": "Minneapolis, MN"
},
  "mercedes-benz-stadium": {
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
    "surface": "turf",
    "opened": 2017,
    "address": "Atlanta, GA"
},
  "bank-of-america-stadium": {
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
        "endZoneOrientation": "east-west",
        "primarySeatingAngle": 75,
        "sideline1Angle": 165,
        "sideline2Angle": 345,
        "endZone1Angle": 75,
        "endZone2Angle": 255
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 1996,
    "address": "Charlotte, NC"
},
  "caesars-superdome": {
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
    "surface": "turf",
    "opened": 1975,
    "address": "New Orleans, LA"
},
  "raymond-james-stadium": {
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
    "surface": "grass",
    "opened": 1998,
    "address": "Tampa, FL"
},
  "state-farm-stadium": {
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
    "surface": "grass",
    "opened": 2006,
    "address": "Glendale, AZ"
},
  "levis-stadium": {
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
        "endZoneOrientation": "northwest-southeast",
        "primarySeatingAngle": 310,
        "sideline1Angle": 40,
        "sideline2Angle": 220,
        "endZone1Angle": 310,
        "endZone2Angle": 130
    },
    "venueType": "football",
    "surface": "grass",
    "opened": 2014,
    "address": "Santa Clara, CA"
},
  "lumen-field": {
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
    "surface": "turf",
    "opened": 2002,
    "address": "Seattle, WA"
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
