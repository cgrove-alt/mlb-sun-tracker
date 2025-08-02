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
  orientation: number; // Field orientation in degrees (0=North)
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
    latitude: 42.7738,
    longitude: -78.7870,
    orientation: 50, // Northeast-Southwest
    capacity: 71608,
    opened: 1973,
    surface: 'turf',
    roof: 'open',
    timezone: 'America/New_York',
    elevation: 600,
    features: ['Wind-prone', 'Lake effect weather']
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
    orientation: 0, // North-South
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
    orientation: 0, // North-South
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
    orientation: 23, // NNE-SSW
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
    orientation: 22, // NNE-SSW
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
    orientation: 13, // NNE-SSW
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
    orientation: 287, // WNW-ESE
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
    orientation: 275, // W-E
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
    orientation: 0, // North-South
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
    orientation: 0, // North-South
    capacity: 67000,
    opened: 2008,
    surface: 'turf',
    roof: 'retractable',
    timezone: 'America/New_York',
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
    orientation: 22, // NNE-SSW
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
    orientation: 0, // North-South
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
    orientation: 0, // North-South
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
    orientation: 0, // North-South
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
    orientation: 0, // North-South
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
    orientation: 90, // East-West
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
    orientation: 340, // NNW-SSE
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
    orientation: 23, // NNE-SSW
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
    orientation: 5, // N-S
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
    orientation: 58, // ENE-WSW
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
    orientation: 0, // North-South
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
    orientation: 45, // NE-SW
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
    orientation: 45, // NE-SW
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
    orientation: 88, // E-W
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
    orientation: 0, // North-South
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
    orientation: 75, // ENE-WSW
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
    orientation: 0, // North-South
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
    orientation: 0, // North-South
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
    orientation: 0, // North-South
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
    orientation: 90, // East-West
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
    orientation: 310, // NW-SE
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
    orientation: 0, // North-South
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