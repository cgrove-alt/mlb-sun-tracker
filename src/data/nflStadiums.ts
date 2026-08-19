// NFL Stadium Data
// Comprehensive data for all 30 NFL stadiums with accurate 2025 information

export interface NFLStadium {
  id: string;
  name: string;
  team: string;
  conference: 'AFC' | 'NFC';
  division: 'East' | 'North' | 'South' | 'West';
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number; // Field long-axis compass bearing, degrees clockwise from north (0=N). End zones sit at orientation and orientation+180.
  capacity: number;
  opened: number;
  surface: 'grass' | 'turf' | 'hybrid';
  roof: 'open' | 'retractable' | 'fixed';
  timezone: string;
  elevation?: number; // Feet above sea level
  roofHeight?: number; // Height in feet for covered stadiums
  upperDeckHeight?: number; // Upper deck overhang height
  features?: string[]; // Notable features like video boards, overhangs
}

export const NFL_STADIUMS: NFLStadium[] = [
  // AFC East
  {
    id: 'highmark-stadium',
    name: 'Highmark Stadium',
    team: 'Buffalo Bills',
    conference: 'AFC',
    division: 'East',
    city: 'Orchard Park',
    state: 'NY',
    latitude: 42.77306,
    longitude: -78.79222,
    orientation: 0, // N-S — 2026 stadium (west of Abbott). The demolished New Era / Ralph Wilson bowl was ~302°.
    capacity: 60108,
    opened: 2026,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 770,
    features: ['Canopy covers ~65% of seats', 'North-south field to cut Lake Erie wind', 'Lake effect weather']
  },
  {
    id: 'hard-rock-stadium',
    name: 'Hard Rock Stadium',
    team: 'Miami Dolphins',
    conference: 'AFC',
    division: 'East',
    city: 'Miami Gardens',
    state: 'FL',
    latitude: 25.9580,
    longitude: -80.2389,
    orientation: 302, // NW-SE — OSM pitch 127.2° agrees with Bliss 302.1° (same undirected axis)
    capacity: 65326,
    opened: 1987,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 8,
    upperDeckHeight: 140,
    features: ['Canopy covers 92% of seats', 'Open ends']
  },
  {
    id: 'gillette-stadium',
    name: 'Gillette Stadium',
    team: 'New England Patriots',
    conference: 'AFC',
    division: 'East',
    city: 'Foxborough',
    state: 'MA',
    latitude: 42.0909,
    longitude: -71.2643,
    orientation: 343, // NNW-SSE — OSM pitch 152.4° agrees with Bliss 343°
    capacity: 65878,
    opened: 2002,
    surface: 'turf',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 289,
    features: ['Lighthouse', 'Open concourses']
  },
  {
    id: 'metlife-stadium-jets',
    name: 'MetLife Stadium',
    team: 'New York Jets',
    conference: 'AFC',
    division: 'East',
    city: 'East Rutherford',
    state: 'NJ',
    latitude: 40.8128,
    longitude: -74.0742,
    orientation: 346, // NNW-SSE — OSM pitch 171.7° agrees with Bliss 345.5°
    capacity: 82500,
    opened: 2010,
    surface: 'turf',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 7,
    features: ['Largest NFL stadium by seating', 'Shared by two teams']
  },
  
  // AFC North
  {
    id: 'm-t-bank-stadium',
    name: 'M&T Bank Stadium',
    team: 'Baltimore Ravens',
    conference: 'AFC',
    division: 'North',
    city: 'Baltimore',
    state: 'MD',
    latitude: 39.2780,
    longitude: -76.6227,
    orientation: 290, // WNW-ESE — OSM pitch 104.6° agrees with Bliss 289.5°
    capacity: 71008,
    opened: 1998,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 51,
    features: ['Downtown location', 'Purple seats']
  },
  {
    id: 'paycor-stadium',
    name: 'Paycor Stadium',
    team: 'Cincinnati Bengals',
    conference: 'AFC',
    division: 'North',
    city: 'Cincinnati',
    state: 'OH',
    latitude: 39.0954,
    longitude: -84.5160,
    orientation: 321, // NW-SE — OSM pitch 146.5° agrees with Bliss 320.6°
    capacity: 65515,
    opened: 2000,
    surface: 'turf',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 485,
    features: ['Riverfront location', 'Jungle-themed']
  },
  {
    id: 'huntington-bank-field',
    name: 'Huntington Bank Field',
    team: 'Cleveland Browns',
    conference: 'AFC',
    division: 'North',
    city: 'Cleveland',
    state: 'OH',
    latitude: 41.5061,
    longitude: -81.6995,
    orientation: 56, // NE-SW — OSM pitch 50.4° agrees with Bliss 56.1°
    capacity: 67431,
    opened: 1999,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 582,
    features: ['Lake Erie winds', 'Dawg Pound']
  },
  {
    id: 'acrisure-stadium',
    name: 'Acrisure Stadium',
    team: 'Pittsburgh Steelers',
    conference: 'AFC',
    division: 'North',
    city: 'Pittsburgh',
    state: 'PA',
    latitude: 40.4468,
    longitude: -80.0158,
    orientation: 334, // NNW-SSE — OSM pitch 165.6° agrees with Bliss 333.9°
    capacity: 68400,
    opened: 2001,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 764,
    features: ['Open end zone', 'River views']
  },
  
  // AFC South
  {
    id: 'nrg-stadium',
    name: 'NRG Stadium',
    team: 'Houston Texans',
    conference: 'AFC',
    division: 'South',
    city: 'Houston',
    state: 'TX',
    latitude: 29.6847,
    longitude: -95.4107,
    orientation: 358, // N-S — OSM stadium/practice axis ~173° agrees with Bliss 358.2°
    capacity: 72220,
    opened: 2002,
    surface: 'turf',
    roof: 'retractable',
    timezone: 'America/Chicago',
    elevation: 49,
    roofHeight: 210,
    features: ['First NFL retractable roof', 'Usually closed']
  },
  {
    id: 'lucas-oil-stadium',
    name: 'Lucas Oil Stadium',
    team: 'Indianapolis Colts',
    conference: 'AFC',
    division: 'South',
    city: 'Indianapolis',
    state: 'IN',
    latitude: 39.7601,
    longitude: -86.1639,
    orientation: 27, // NNE-SSW — indoor; Bliss 26.6°. OSM building outline is ~8° (weak).
    capacity: 67000,
    opened: 2008,
    surface: 'turf',
    roof: 'retractable',
    timezone: 'America/Indiana/Indianapolis',
    elevation: 717,
    roofHeight: 184,
    features: ['Window wall', 'Downtown location']
  },
  {
    id: 'everbank-stadium',
    name: 'EverBank Stadium',
    team: 'Jacksonville Jaguars',
    conference: 'AFC',
    division: 'South',
    city: 'Jacksonville',
    state: 'FL',
    latitude: 30.3239,
    longitude: -81.6373,
    orientation: 17, // NNE-SSW — OSM pitch 14.9° agrees with Bliss 16.7°
    capacity: 69132,
    opened: 1995,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 16,
    features: ['Pools', 'Cabanas', 'Stadium of the Future renovations']
  },
  {
    id: 'nissan-stadium',
    name: 'Nissan Stadium',
    team: 'Tennessee Titans',
    conference: 'AFC',
    division: 'South',
    city: 'Nashville',
    state: 'TN',
    latitude: 36.1665,
    longitude: -86.7713,
    orientation: 335, // NNW-SSE — OSM pitch 161.0° agrees with Bliss 334.6°
    capacity: 69143,
    opened: 1999,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/Chicago',
    elevation: 400,
    features: ['River location', 'New stadium planned for 2027']
  },
  
  // AFC West
  {
    id: 'empower-field',
    name: 'Empower Field at Mile High',
    team: 'Denver Broncos',
    conference: 'AFC',
    division: 'West',
    city: 'Denver',
    state: 'CO',
    latitude: 39.7439,
    longitude: -105.0200,
    orientation: 0, // N-S — OSM pitch 175.0° + Bliss 0° + vizual-statistix "perfectly N-S"
    capacity: 76125,
    opened: 2001,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/Denver',
    elevation: 5280,
    features: ['Mile High altitude', 'Ring of Fame']
  },
  {
    id: 'geha-field-arrowhead',
    name: 'GEHA Field at Arrowhead Stadium',
    team: 'Kansas City Chiefs',
    conference: 'AFC',
    division: 'West',
    city: 'Kansas City',
    state: 'MO',
    latitude: 39.0489,
    longitude: -94.4839,
    orientation: 316, // NW-SE — OSM way 65960009 (named GEHA Field) 142.8° agrees with Bliss 316.3°
    capacity: 76416,
    opened: 1972,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/Chicago',
    elevation: 889,
    features: ['Loudest stadium', 'Sea of Red']
  },
  {
    id: 'allegiant-stadium',
    name: 'Allegiant Stadium',
    team: 'Las Vegas Raiders',
    conference: 'AFC',
    division: 'West',
    city: 'Las Vegas',
    state: 'NV',
    latitude: 36.0909,
    longitude: -115.1833,
    orientation: 26, // NNE-SSW — OSM indoor pitch 25.8° (named Las Vegas Raiders). Bliss seating-chart 0° disagrees.
    capacity: 65000,
    opened: 2020,
    surface: 'grass',
    roof: 'fixed',
    timezone: 'America/Los_Angeles',
    elevation: 2030,
    roofHeight: 275,
    features: ['Translucent roof', 'Natural grass tray system']
  },
  {
    id: 'sofi-stadium-chargers',
    name: 'SoFi Stadium',
    team: 'Los Angeles Chargers',
    conference: 'AFC',
    division: 'West',
    city: 'Los Angeles',
    state: 'CA',
    latitude: 33.9535,
    longitude: -118.3392,
    orientation: 338, // NNW-SSE — OSM stadium outline 152.0° agrees with Bliss 338.2°. Previous 90° was leftover E-W.
    capacity: 70240,
    opened: 2020,
    surface: 'turf',
    roof: 'fixed',
    timezone: 'America/Los_Angeles',
    elevation: 125,
    roofHeight: 150,
    features: ['Open sides', 'Oculus video board']
  },
  
  // NFC East
  {
    id: 'at-t-stadium',
    name: 'AT&T Stadium',
    team: 'Dallas Cowboys',
    conference: 'NFC',
    division: 'East',
    city: 'Arlington',
    state: 'TX',
    latitude: 32.7473,
    longitude: -97.0945,
    orientation: 68, // ENE-WSW — OSM stadium 65.8° agrees with Bliss 68°. Previous 340° was perpendicular.
    capacity: 80000,
    opened: 2009,
    surface: 'turf',
    roof: 'retractable',
    timezone: 'America/Chicago',
    elevation: 600,
    roofHeight: 292,
    features: ['Largest video board', 'Glass doors']
  },
  {
    id: 'metlife-stadium-giants',
    name: 'MetLife Stadium',
    team: 'New York Giants',
    conference: 'NFC',
    division: 'East',
    city: 'East Rutherford',
    state: 'NJ',
    latitude: 40.8128,
    longitude: -74.0742,
    orientation: 346, // NNW-SSE — same measurement as Jets / MetLife
    capacity: 82500,
    opened: 2010,
    surface: 'turf',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 7,
    features: ['Shared with Jets', 'Largest NFL stadium']
  },
  {
    id: 'lincoln-financial-field',
    name: 'Lincoln Financial Field',
    team: 'Philadelphia Eagles',
    conference: 'NFC',
    division: 'East',
    city: 'Philadelphia',
    state: 'PA',
    latitude: 39.9008,
    longitude: -75.1675,
    orientation: 351, // N-S — OSM pitch 167.2° agrees with Bliss 351°
    capacity: 69596,
    opened: 2003,
    surface: 'hybrid',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 14,
    features: ['Solar panels', 'Wind turbines']
  },
  {
    id: 'northwest-stadium',
    name: 'Northwest Stadium',
    team: 'Washington Commanders',
    conference: 'NFC',
    division: 'East',
    city: 'Landover',
    state: 'MD',
    latitude: 38.9076,
    longitude: -76.8645,
    orientation: 295, // WNW-ESE — OSM pitch 124.5° agrees with Bliss 295°
    capacity: 67617,
    opened: 1997,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 203,
    features: ['New stadium planned']
  },
  
  // NFC North
  {
    id: 'soldier-field',
    name: 'Soldier Field',
    team: 'Chicago Bears',
    conference: 'NFC',
    division: 'North',
    city: 'Chicago',
    state: 'IL',
    latitude: 41.8623,
    longitude: -87.6167,
    orientation: 354, // N-S — OSM pitch 170.6° agrees with Bliss 353.9° + vizual-statistix within 5° of N-S
    capacity: 61500,
    opened: 1924,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/Chicago',
    elevation: 596,
    features: ['Smallest NFL capacity', 'Historic colonnades']
  },
  {
    id: 'ford-field',
    name: 'Ford Field',
    team: 'Detroit Lions',
    conference: 'NFC',
    division: 'North',
    city: 'Detroit',
    state: 'MI',
    latitude: 42.3400,
    longitude: -83.0456,
    orientation: 64, // ENE-WSW — indoor; Bliss 63.7°. OSM building outline (~32°) is not the field.
    capacity: 65000,
    opened: 2002,
    surface: 'turf',
    roof: 'fixed',
    timezone: 'America/Detroit',
    elevation: 600,
    roofHeight: 235,
    features: ['Downtown location', 'Windows']
  },
  {
    id: 'lambeau-field',
    name: 'Lambeau Field',
    team: 'Green Bay Packers',
    conference: 'NFC',
    division: 'North',
    city: 'Green Bay',
    state: 'WI',
    latitude: 44.5013,
    longitude: -88.0622,
    orientation: 0, // N-S — OSM pitch 174.2° + Bliss 0° + vizual-statistix "perfectly N-S". Previous 45° was wrong.
    capacity: 81441,
    opened: 1957,
    surface: 'hybrid',
    roof: 'open',
    timezone: 'America/Chicago',
    elevation: 640,
    features: ['Frozen Tundra', 'Historic venue']
  },
  {
    id: 'us-bank-stadium',
    name: 'U.S. Bank Stadium',
    team: 'Minnesota Vikings',
    conference: 'NFC',
    division: 'North',
    city: 'Minneapolis',
    state: 'MN',
    latitude: 44.9738,
    longitude: -93.2575,
    orientation: 310, // NW-SE — Bliss 309.9° for U.S. Bank. Previous 88° was leftover TCF Bank Stadium (Bliss TCF=90).
    capacity: 66655,
    opened: 2016,
    surface: 'turf',
    roof: 'fixed',
    timezone: 'America/Chicago',
    elevation: 830,
    roofHeight: 245,
    features: ['ETFE roof', 'Nordic design']
  },
  
  // NFC South
  {
    id: 'mercedes-benz-stadium',
    name: 'Mercedes-Benz Stadium',
    team: 'Atlanta Falcons',
    conference: 'NFC',
    division: 'South',
    city: 'Atlanta',
    state: 'GA',
    latitude: 33.7554,
    longitude: -84.4009,
    orientation: 71, // ENE-WSW — Bliss 70.9° + OSM field-shaped way 68.4°. Georgia Dome was E-W; this building is not.
    capacity: 71000,
    opened: 2017,
    surface: 'turf',
    roof: 'retractable',
    timezone: 'America/New_York',
    elevation: 1050,
    roofHeight: 295,
    features: ['Pinwheel roof', '360° video board']
  },
  {
    id: 'bank-of-america-stadium',
    name: 'Bank of America Stadium',
    team: 'Carolina Panthers',
    conference: 'NFC',
    division: 'South',
    city: 'Charlotte',
    state: 'NC',
    latitude: 35.2258,
    longitude: -80.8528,
    orientation: 322, // NW-SE — OSM on-field pitch 150.5° agrees with Bliss 322.4°
    capacity: 75523,
    opened: 1996,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 744,
    features: ['Three open corners', 'Panther statues']
  },
  {
    id: 'caesars-superdome',
    name: 'Caesars Superdome',
    team: 'New Orleans Saints',
    conference: 'NFC',
    division: 'South',
    city: 'New Orleans',
    state: 'LA',
    latitude: 29.9511,
    longitude: -90.0812,
    orientation: 30, // NNE-SSW — indoor; Bliss 30° from seating-chart. Dome outline is circular (no axis).
    capacity: 73208,
    opened: 1975,
    surface: 'turf',
    roof: 'fixed',
    timezone: 'America/Chicago',
    elevation: 3,
    roofHeight: 273,
    features: ['Iconic dome', 'Recently renovated']
  },
  {
    id: 'raymond-james-stadium',
    name: 'Raymond James Stadium',
    team: 'Tampa Bay Buccaneers',
    conference: 'NFC',
    division: 'South',
    city: 'Tampa',
    state: 'FL',
    latitude: 27.9759,
    longitude: -82.5033,
    orientation: 0, // N-S — OSM pitch 6.4° + Bliss 0° + vizual-statistix "perfectly N-S"
    capacity: 69218,
    opened: 1998,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 51,
    features: ['Pirate ship', 'Cannons']
  },
  
  // NFC West
  {
    id: 'state-farm-stadium',
    name: 'State Farm Stadium',
    team: 'Arizona Cardinals',
    conference: 'NFC',
    division: 'West',
    city: 'Glendale',
    state: 'AZ',
    latitude: 33.5276,
    longitude: -112.2626,
    orientation: 330, // NW-SE — OSM grass-growing / roll-out field 144.0° agrees with Bliss 330°
    capacity: 63400,
    opened: 2006,
    surface: 'grass',
    roof: 'retractable',
    timezone: 'America/Phoenix',
    elevation: 1070,
    roofHeight: 200,
    features: ['Roll-out field', 'AC when closed']
  },
  {
    id: 'sofi-stadium-rams',
    name: 'SoFi Stadium',
    team: 'Los Angeles Rams',
    conference: 'NFC',
    division: 'West',
    city: 'Los Angeles',
    state: 'CA',
    latitude: 33.9535,
    longitude: -118.3392,
    orientation: 338, // NNW-SSE — same measurement as Chargers / SoFi
    capacity: 70240,
    opened: 2020,
    surface: 'turf',
    roof: 'fixed',
    timezone: 'America/Los_Angeles',
    elevation: 125,
    roofHeight: 150,
    features: ['Open sides', 'Oculus video board']
  },
  {
    id: 'levis-stadium',
    name: 'Levi\'s Stadium',
    team: 'San Francisco 49ers',
    conference: 'NFC',
    division: 'West',
    city: 'Santa Clara',
    state: 'CA',
    latitude: 37.4033,
    longitude: -121.9694,
    orientation: 330, // NW-SE — OSM practice/stadium axis ~147–158° agrees with Bliss 330° + shadedseats NW-SE
    capacity: 68500,
    opened: 2014,
    surface: 'grass',
    roof: 'open',
    timezone: 'America/Los_Angeles',
    elevation: 20,
    features: ['Solar panels', 'Tech integration', 'Hot east side']
  },
  {
    id: 'lumen-field',
    name: 'Lumen Field',
    team: 'Seattle Seahawks',
    conference: 'NFC',
    division: 'West',
    city: 'Seattle',
    state: 'WA',
    latitude: 47.5952,
    longitude: -122.3316,
    orientation: 0, // N-S — OSM pitch 5.6° + Bliss 0° + vizual-statistix "perfectly N-S"
    capacity: 69000,
    opened: 2002,
    surface: 'turf',
    roof: 'open',
    timezone: 'America/Los_Angeles',
    elevation: 0,
    upperDeckHeight: 180,
    features: ['Partial roof coverage', '12th Man', 'Extremely loud']
  }
];

// Helper functions
export function getNFLStadiumById(id: string): NFLStadium | null {
  return NFL_STADIUMS.find(stadium => stadium.id === id) || null;
}

export function getNFLStadiumByTeam(team: string): NFLStadium | null {
  return NFL_STADIUMS.find(stadium => stadium.team === team) || null;
}

export function getNFLStadiumsByDivision(conference: 'AFC' | 'NFC', division: string): NFLStadium[] {
  return NFL_STADIUMS.filter(stadium => 
    stadium.conference === conference && stadium.division === division
  );
}

export function getOpenAirNFLStadiums(): NFLStadium[] {
  return NFL_STADIUMS.filter(stadium => stadium.roof === 'open');
}

export function getDomeNFLStadiums(): NFLStadium[] {
  return NFL_STADIUMS.filter(stadium => stadium.roof === 'fixed');
}

export function getRetractableNFLStadiums(): NFLStadium[] {
  return NFL_STADIUMS.filter(stadium => stadium.roof === 'retractable');
}