export interface Stadium {
  id: string;
  name: string;
  team: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number; // Home plate to center field bearing in degrees
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
}

export const MLB_STADIUMS: Stadium[] = [
  {
    id: 'angels',
    name: 'Angel Stadium',
    team: 'Los Angeles Angels',
    city: 'Anaheim',
    state: 'CA',
    latitude: 33.8003,
    longitude: -117.8827,
    orientation: 65,
    capacity: 45517,
    roof: 'open'
  },
  {
    id: 'astros',
    name: 'Minute Maid Park',
    team: 'Houston Astros',
    city: 'Houston',
    state: 'TX',
    latitude: 29.7570,
    longitude: -95.3555,
    orientation: 20,
    capacity: 41168,
    roof: 'retractable'
  },
  {
    id: 'athletics',
    name: 'Oakland Coliseum',
    team: 'Oakland Athletics',
    city: 'Oakland',
    state: 'CA',
    latitude: 37.7516,
    longitude: -122.2006,
    orientation: 330,
    capacity: 46847,
    roof: 'open'
  },
  {
    id: 'bluejays',
    name: 'Rogers Centre',
    team: 'Toronto Blue Jays',
    city: 'Toronto',
    state: 'ON',
    latitude: 43.6414,
    longitude: -79.3894,
    orientation: 15,
    capacity: 49282,
    roof: 'retractable'
  },
  {
    id: 'braves',
    name: 'Truist Park',
    team: 'Atlanta Braves',
    city: 'Atlanta',
    state: 'GA',
    latitude: 33.8908,
    longitude: -84.4678,
    orientation: 45,
    capacity: 41084,
    roof: 'open'
  },
  {
    id: 'brewers',
    name: 'American Family Field',
    team: 'Milwaukee Brewers',
    city: 'Milwaukee',
    state: 'WI',
    latitude: 43.0280,
    longitude: -87.9712,
    orientation: 357,
    capacity: 41900,
    roof: 'retractable'
  },
  {
    id: 'cardinals',
    name: 'Busch Stadium',
    team: 'St. Louis Cardinals',
    city: 'St. Louis',
    state: 'MO',
    latitude: 38.6226,
    longitude: -90.1928,
    orientation: 92,
    capacity: 44494,
    roof: 'open'
  },
  {
    id: 'cubs',
    name: 'Wrigley Field',
    team: 'Chicago Cubs',
    city: 'Chicago',
    state: 'IL',
    latitude: 41.9484,
    longitude: -87.6553,
    orientation: 13,
    capacity: 41649,
    roof: 'open'
  },
  {
    id: 'diamondbacks',
    name: 'Chase Field',
    team: 'Arizona Diamondbacks',
    city: 'Phoenix',
    state: 'AZ',
    latitude: 33.4455,
    longitude: -112.0667,
    orientation: 23,
    capacity: 48686,
    roof: 'retractable'
  },
  {
    id: 'dodgers',
    name: 'Dodger Stadium',
    team: 'Los Angeles Dodgers',
    city: 'Los Angeles',
    state: 'CA',
    latitude: 34.0739,
    longitude: -118.2400,
    orientation: 25,
    capacity: 56000,
    roof: 'open'
  },
  {
    id: 'giants',
    name: 'Oracle Park',
    team: 'San Francisco Giants',
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.7786,
    longitude: -122.3893,
    orientation: 87,
    capacity: 41915,
    roof: 'open'
  },
  {
    id: 'guardians',
    name: 'Progressive Field',
    team: 'Cleveland Guardians',
    city: 'Cleveland',
    state: 'OH',
    latitude: 41.4962,
    longitude: -81.6852,
    orientation: 60,
    capacity: 34830,
    roof: 'open'
  },
  {
    id: 'mariners',
    name: 'T-Mobile Park',
    team: 'Seattle Mariners',
    city: 'Seattle',
    state: 'WA',
    latitude: 47.5914,
    longitude: -122.3325,
    orientation: 318,
    capacity: 47929,
    roof: 'retractable'
  },
  {
    id: 'marlins',
    name: 'loanDepot park',
    team: 'Miami Marlins',
    city: 'Miami',
    state: 'FL',
    latitude: 25.7781,
    longitude: -80.2197,
    orientation: 40,
    capacity: 37446,
    roof: 'retractable'
  },
  {
    id: 'mets',
    name: 'Citi Field',
    team: 'New York Mets',
    city: 'New York',
    state: 'NY',
    latitude: 40.7571,
    longitude: -73.8458,
    orientation: 90,
    capacity: 41922,
    roof: 'open'
  },
  {
    id: 'nationals',
    name: 'Nationals Park',
    team: 'Washington Nationals',
    city: 'Washington',
    state: 'DC',
    latitude: 38.8730,
    longitude: -77.0074,
    orientation: 87,
    capacity: 41313,
    roof: 'open'
  },
  {
    id: 'orioles',
    name: 'Oriole Park at Camden Yards',
    team: 'Baltimore Orioles',
    city: 'Baltimore',
    state: 'MD',
    latitude: 39.2838,
    longitude: -76.6218,
    orientation: 58,
    capacity: 45971,
    roof: 'open'
  },
  {
    id: 'padres',
    name: 'Petco Park',
    team: 'San Diego Padres',
    city: 'San Diego',
    state: 'CA',
    latitude: 32.7076,
    longitude: -117.1570,
    orientation: 25,
    capacity: 40209,
    roof: 'open'
  },
  {
    id: 'phillies',
    name: 'Citizens Bank Park',
    team: 'Philadelphia Phillies',
    city: 'Philadelphia',
    state: 'PA',
    latitude: 39.9061,
    longitude: -75.1665,
    orientation: 59,
    capacity: 42792,
    roof: 'open'
  },
  {
    id: 'pirates',
    name: 'PNC Park',
    team: 'Pittsburgh Pirates',
    city: 'Pittsburgh',
    state: 'PA',
    latitude: 40.4468,
    longitude: -80.0057,
    orientation: 25,
    capacity: 38362,
    roof: 'open'
  },
  {
    id: 'rangers',
    name: 'Globe Life Field',
    team: 'Texas Rangers',
    city: 'Arlington',
    state: 'TX',
    latitude: 32.7512,
    longitude: -97.0833,
    orientation: 46,
    capacity: 40300,
    roof: 'retractable'
  },
  {
    id: 'rays',
    name: 'Tropicana Field',
    team: 'Tampa Bay Rays',
    city: 'St. Petersburg',
    state: 'FL',
    latitude: 27.7682,
    longitude: -82.6534,
    orientation: 316,
    capacity: 25025,
    roof: 'fixed'
  },
  {
    id: 'redsox',
    name: 'Fenway Park',
    team: 'Boston Red Sox',
    city: 'Boston',
    state: 'MA',
    latitude: 42.3467,
    longitude: -71.0972,
    orientation: 52,
    capacity: 37755,
    roof: 'open'
  },
  {
    id: 'reds',
    name: 'Great American Ball Park',
    team: 'Cincinnati Reds',
    city: 'Cincinnati',
    state: 'OH',
    latitude: 39.0979,
    longitude: -84.5080,
    orientation: 105,
    capacity: 42319,
    roof: 'open'
  },
  {
    id: 'rockies',
    name: 'Coors Field',
    team: 'Colorado Rockies',
    city: 'Denver',
    state: 'CO',
    latitude: 39.7559,
    longitude: -104.9942,
    orientation: 40,
    capacity: 50144,
    roof: 'open'
  },
  {
    id: 'royals',
    name: 'Kauffman Stadium',
    team: 'Kansas City Royals',
    city: 'Kansas City',
    state: 'MO',
    latitude: 39.0517,
    longitude: -94.4803,
    orientation: 58,
    capacity: 37903,
    roof: 'open'
  },
  {
    id: 'tigers',
    name: 'Comerica Park',
    team: 'Detroit Tigers',
    city: 'Detroit',
    state: 'MI',
    latitude: 42.3390,
    longitude: -83.0485,
    orientation: 145,
    capacity: 41083,
    roof: 'open'
  },
  {
    id: 'twins',
    name: 'Target Field',
    team: 'Minnesota Twins',
    city: 'Minneapolis',
    state: 'MN',
    latitude: 44.9817,
    longitude: -93.2776,
    orientation: 0,
    capacity: 38544,
    roof: 'open'
  },
  {
    id: 'whitesox',
    name: 'Guaranteed Rate Field',
    team: 'Chicago White Sox',
    city: 'Chicago',
    state: 'IL',
    latitude: 41.8299,
    longitude: -87.6338,
    orientation: 90,
    capacity: 40615,
    roof: 'open'
  },
  {
    id: 'yankees',
    name: 'Yankee Stadium',
    team: 'New York Yankees',
    city: 'New York',
    state: 'NY',
    latitude: 40.8296,
    longitude: -73.9262,
    orientation: 55,
    capacity: 46537,
    roof: 'open'
  }
];