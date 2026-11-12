// NOTE: `orientation` is the single most important geometric input to our shade
// calculations. The provenance (measured vs estimated vs unverified) of each
// stadium's orientation is tracked in `stadiumOrientationProvenance.ts`. When
// editing a value here, update the matching provenance entry so the audit
// trail stays honest.
export interface Stadium {
  id: string;
  name: string;
  team: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number; // Home plate to center field bearing in degrees — see stadiumOrientationProvenance.ts
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  timezone: string; // IANA timezone identifier
  // Geometry data for shadow calculations
  roofHeight?: number; // Height of roof/overhang in feet
  roofOverhang?: number; // Horizontal overhang distance in feet
  upperDeckHeight?: number; // Height of upper deck in feet
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
    orientation: 44, // NE — measured 2026-11-11 from USGS NAIP imagery (44° ±1°); replaces 50°. See orientationMeasurements.ts.
    capacity: 45517,
    roof: 'open',
    timezone: 'America/Los_Angeles',
    roofHeight: 120,
    roofOverhang: 40,
    upperDeckHeight: 80
  },
  {
    id: 'astros',
    name: 'Daikin Park',
    team: 'Houston Astros',
    city: 'Houston',
    state: 'TX',
    latitude: 29.7570,
    longitude: -95.3555,
    orientation: 345, // NNW — measured 2026-11-12 from USGS NAIP imagery, roof open (345° ±2°); replaces 340°. See orientationMeasurements.ts.
    capacity: 41168,
    roof: 'retractable',
    timezone: 'America/Chicago'
  },
  {
    id: 'athletics',
    name: 'Sutter Health Park',
    team: 'Athletics', // Dropped "Oakland" — the franchise's official name is now just "Athletics" while based in West Sacramento (Sutter Health Park, 2025-2027).
    city: 'West Sacramento',
    state: 'CA',
    latitude: 38.5803,
    longitude: -121.5132,
    orientation: 47, // NE — measured 2026-11-11 from USGS NAIP imagery (47° ±1.5°); replaces 20°. See orientationMeasurements.ts.
    capacity: 14014,
    roof: 'open',
    timezone: 'America/Los_Angeles'
  },
  {
    id: 'bluejays',
    name: 'Rogers Centre',
    team: 'Toronto Blue Jays',
    city: 'Toronto',
    state: 'ON',
    latitude: 43.6414,
    longitude: -79.3894,
    orientation: 0, // N — confirmed 2026-05-13. Multiple authoritative sources: "Rogers Centre is one of the few major league parks where the batter faces north when hitting" (intheballparks.com / shadedseats). Geometric check: "Throughout the afternoon the sun rotates from above home plate down the third base side… 3rd base side is the shade side, 1st base side is sunny" — sun moves E→W during day; if afternoon sun is on 3B side, 3B is W and 1B is E (catcher's right when facing N). Consistent with HP→CF=N. Independent OSM building polygon axis: 354° N (well-matched). Previous 15° was approximately right but the published source explicitly says "north."
    capacity: 49282,
    roof: 'retractable',
    timezone: 'America/Toronto'
  },
  {
    id: 'braves',
    name: 'Truist Park',
    team: 'Atlanta Braves',
    city: 'Atlanta',
    state: 'GA',
    latitude: 33.8908,
    longitude: -84.4678,
    orientation: 159, // SSE — measured 2026-11-11 from USGS NAIP imagery (159° ±1°); replaces 135°. See orientationMeasurements.ts.
    capacity: 41084,
    roof: 'open',
    timezone: 'America/New_York'
  },
  {
    id: 'brewers',
    name: 'American Family Field',
    team: 'Milwaukee Brewers',
    city: 'Milwaukee',
    state: 'WI',
    latitude: 43.0280,
    longitude: -87.9712,
    orientation: 130, // SE — measured 2026-11-12 from USGS NAIP imagery, roof open (130° ±1°); replaces 135°. See orientationMeasurements.ts.
    capacity: 41900,
    roof: 'retractable',
    timezone: 'America/Chicago'
  },
  {
    id: 'cardinals',
    name: 'Busch Stadium',
    team: 'St. Louis Cardinals',
    city: 'St. Louis',
    state: 'MO',
    latitude: 38.6226,
    longitude: -90.1928,
    orientation: 62, // ENE — measured 2026-11-11 from USGS NAIP imagery (62° ±1.5°); replaces 60°. See orientationMeasurements.ts.
    capacity: 44494,
    roof: 'open',
    timezone: 'America/Chicago'
  },
  {
    id: 'cubs',
    name: 'Wrigley Field',
    team: 'Chicago Cubs',
    city: 'Chicago',
    state: 'IL',
    latitude: 41.9484,
    longitude: -87.6553,
    orientation: 38, // NE — corrected 2026-06-23 from 13°. ballparks.com 30° + Hardball Times "oriented toward the northeast" + sun pattern confirm NE (the old 13° was too far north). See provenance.
    capacity: 41649,
    roof: 'open',
    timezone: 'America/Chicago',
    upperDeckHeight: 52, // Low classic ballpark (1914) — original grandstands were 56 ft; upper deck base ~52 ft
    roofHeight: 65,
    roofOverhang: 22
  },
  {
    id: 'diamondbacks',
    name: 'Chase Field',
    team: 'Arizona Diamondbacks',
    city: 'Phoenix',
    state: 'AZ',
    latitude: 33.4455,
    longitude: -112.0667,
    orientation: 0, // N — measured 2026-11-12 from USGS NAIP imagery, roof open (0° ±1°), confirming the published "oriented to the north". See orientationMeasurements.ts.
    capacity: 48686,
    roof: 'retractable',
    timezone: 'America/Phoenix'
  },
  {
    id: 'dodgers',
    name: 'Dodger Stadium',
    team: 'Los Angeles Dodgers',
    city: 'Los Angeles',
    state: 'CA',
    latitude: 34.0739,
    longitude: -118.2400,
    orientation: 27,
    capacity: 56000,
    roof: 'open',
    timezone: 'America/Los_Angeles'
  },
  {
    id: 'giants',
    name: 'Oracle Park',
    team: 'San Francisco Giants',
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.7786,
    longitude: -122.3893,
    orientation: 86,
    capacity: 41915,
    roof: 'open',
    timezone: 'America/Los_Angeles'
  },
  {
    id: 'guardians',
    name: 'Progressive Field',
    team: 'Cleveland Guardians',
    city: 'Cleveland',
    state: 'OH',
    latitude: 41.4962,
    longitude: -81.6852,
    orientation: 0, // N — measured 2026-11-11 from USGS NAIP imagery (0° ±1.5°); replaces 356°. See orientationMeasurements.ts.
    capacity: 34830,
    roof: 'open',
    timezone: 'America/New_York' // Eastern Time — was incorrectly 'America/Chicago' (Central). Cleveland observes Eastern Time year-round.
  },
  {
    id: 'mariners',
    name: 'T-Mobile Park',
    team: 'Seattle Mariners',
    city: 'Seattle',
    state: 'WA',
    latitude: 47.5914,
    longitude: -122.3325,
    orientation: 48, // NE — measured 2026-11-12 from USGS NAIP imagery, roof open (48° ±1.5°); replaces 45°. See orientationMeasurements.ts.
    capacity: 47929,
    roof: 'retractable',
    timezone: 'America/Los_Angeles'
  },
  {
    id: 'marlins',
    name: 'loanDepot park',
    team: 'Miami Marlins',
    city: 'Miami',
    state: 'FL',
    latitude: 25.7781,
    longitude: -80.2197,
    orientation: 129, // ESE — measured 2026-11-12 from USGS NAIP imagery, roof half open (129° ±1°), agreeing with Miami-Dade County's 2021 orthophoto (129.04°). See orientationMeasurements.ts.
    capacity: 37446,
    roof: 'retractable',
    timezone: 'America/New_York'
  },
  {
    id: 'mets',
    name: 'Citi Field',
    team: 'New York Mets',
    city: 'New York',
    state: 'NY',
    latitude: 40.7571,
    longitude: -73.8458,
    orientation: 14, // NNE — confirmed north-northeast orientation (was incorrectly set to 90/due-East)
    capacity: 41922,
    roof: 'open',
    timezone: 'America/New_York'
  },
  {
    id: 'nationals',
    name: 'Nationals Park',
    team: 'Washington Nationals',
    city: 'Washington',
    state: 'DC',
    latitude: 38.8730,
    longitude: -77.0074,
    orientation: 29, // NNE — measured 2026-11-11 from USGS NAIP imagery (29° ±1°); replaces 30°. See orientationMeasurements.ts.
    capacity: 41313,
    roof: 'open',
    timezone: 'America/New_York'
  },
  {
    id: 'orioles',
    name: 'Oriole Park at Camden Yards',
    team: 'Baltimore Orioles',
    city: 'Baltimore',
    state: 'MD',
    latitude: 39.2838,
    longitude: -76.6218,
    orientation: 31, // NNE — measured 2026-11-11 from USGS NAIP imagery (31° ±1°); replaces 30°. See orientationMeasurements.ts.
    capacity: 45971,
    roof: 'open',
    timezone: 'America/New_York'
  },
  {
    id: 'padres',
    name: 'Petco Park',
    team: 'San Diego Padres',
    city: 'San Diego',
    state: 'CA',
    latitude: 32.7076,
    longitude: -117.1570,
    orientation: 0, // N — measured 2026-11-11 from USGS NAIP imagery (0° ±1°), confirming the published "due north". See orientationMeasurements.ts.
    capacity: 40209,
    roof: 'open',
    timezone: 'America/Los_Angeles'
  },
  {
    id: 'phillies',
    name: 'Citizens Bank Park',
    team: 'Philadelphia Phillies',
    city: 'Philadelphia',
    state: 'PA',
    latitude: 39.9061,
    longitude: -75.1665,
    orientation: 9, // N — measured 2026-11-11 from USGS NAIP imagery (9° ±1°); replaces 18°. See orientationMeasurements.ts.
    capacity: 42792,
    roof: 'open',
    timezone: 'America/New_York'
  },
  {
    id: 'pirates',
    name: 'PNC Park',
    team: 'Pittsburgh Pirates',
    city: 'Pittsburgh',
    state: 'PA',
    latitude: 40.4468,
    longitude: -80.0057,
    orientation: 116, // ESE — measured 2026-11-11 from USGS NAIP imagery (116° ±1.5°); replaces 120°. See orientationMeasurements.ts.
    capacity: 38362,
    roof: 'open',
    timezone: 'America/New_York'
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
    roof: 'retractable',
    timezone: 'America/Chicago' // Central Time — was incorrectly 'America/Denver' (Mountain). Arlington, TX (DFW metroplex) observes Central; only El Paso/Hudspeth counties are Mountain.
  },
  {
    id: 'rays',
    name: 'Tropicana Field', // Rays returned to Tropicana Field for 2026 after Hurricane Milton roof repairs (reopened Apr 6, 2026). 2025 was played at Steinbrenner Field.
    team: 'Tampa Bay Rays',
    city: 'St. Petersburg',
    state: 'FL',
    latitude: 27.7683,
    longitude: -82.6534,
    orientation: 316, // fixed-roof dome — orientation is nominal; roof:'fixed' means all seats are shaded regardless of sun position
    capacity: 25000,
    roof: 'fixed',
    timezone: 'America/New_York'
  },
  {
    id: 'redsox',
    name: 'Fenway Park',
    team: 'Boston Red Sox',
    city: 'Boston',
    state: 'MA',
    latitude: 42.3467,
    longitude: -71.0972,
    orientation: 44,
    capacity: 37755,
    roof: 'open',
    timezone: 'America/New_York',
    upperDeckHeight: 50, // Low classic ballpark (1912) — Green Monster seats at ~43 ft; upper deck base ~50 ft
    roofHeight: 65,
    roofOverhang: 22
  },
  {
    id: 'reds',
    name: 'Great American Ball Park',
    team: 'Cincinnati Reds',
    city: 'Cincinnati',
    state: 'OH',
    latitude: 39.0979,
    longitude: -84.5080,
    orientation: 122, // ESE — measured 2026-11-11 from USGS NAIP imagery (122° ±1°); replaces 115°. See orientationMeasurements.ts.
    capacity: 42319,
    roof: 'open',
    timezone: 'America/New_York' // Eastern Time — was incorrectly 'America/Chicago' (Central). All of Ohio observes Eastern.
  },
  {
    id: 'rockies',
    name: 'Coors Field',
    team: 'Colorado Rockies',
    city: 'Denver',
    state: 'CO',
    latitude: 39.7559,
    longitude: -104.9942,
    orientation: 5, // N — measured 2026-11-11 from USGS NAIP imagery (5° ±1°); replaces 0°. See orientationMeasurements.ts.
    capacity: 50144,
    roof: 'open',
    timezone: 'America/Denver'
  },
  {
    id: 'royals',
    name: 'Kauffman Stadium',
    team: 'Kansas City Royals',
    city: 'Kansas City',
    state: 'MO',
    latitude: 39.0517,
    longitude: -94.4803,
    orientation: 47, // NE — measured 2026-11-11 from USGS NAIP imagery (47° ±1°); replaces 48°. See orientationMeasurements.ts.
    capacity: 37903,
    roof: 'open',
    timezone: 'America/Chicago'
  },
  {
    id: 'tigers',
    name: 'Comerica Park',
    team: 'Detroit Tigers',
    city: 'Detroit',
    state: 'MI',
    latitude: 42.3390,
    longitude: -83.0485,
    orientation: 151, // SSE — measured 2026-11-11 from USGS NAIP imagery (151° ±1°); replaces 145°. See orientationMeasurements.ts.
    capacity: 41083,
    roof: 'open',
    timezone: 'America/New_York' // Eastern Time — was incorrectly 'America/Chicago' (Central). Detroit and all of Michigan's Lower Peninsula observe Eastern; only 4 western UP counties are Central.
  },
  {
    id: 'twins',
    name: 'Target Field',
    team: 'Minnesota Twins',
    city: 'Minneapolis',
    state: 'MN',
    latitude: 44.9817,
    longitude: -93.2776,
    orientation: 91, // E — measured 2026-11-11 from USGS NAIP imagery (91° ±1°); replaces 90°. See orientationMeasurements.ts.
    capacity: 38544,
    roof: 'open',
    timezone: 'America/Chicago'
  },
  {
    id: 'whitesox',
    name: 'Rate Field', // Renamed from "Guaranteed Rate Field" in 2025.
    team: 'Chicago White Sox',
    city: 'Chicago',
    state: 'IL',
    latitude: 41.8299,
    longitude: -87.6338,
    orientation: 129, // SE — measured 2026-11-11 from USGS NAIP imagery (129° ±2°); replaces 120°. See orientationMeasurements.ts.
    capacity: 40615,
    roof: 'open',
    timezone: 'America/Chicago'
  },
  {
    id: 'yankees',
    name: 'Yankee Stadium',
    team: 'New York Yankees',
    city: 'New York',
    state: 'NY',
    latitude: 40.8296,
    longitude: -73.9262,
    orientation: 75,
    capacity: 46537,
    roof: 'open',
    timezone: 'America/New_York'
  }
];

/**
 * The one place an MLB park's orientation is read from. Section maps call this
 * instead of typing the number again, so a corrected orientation reaches every
 * section at once. Throws for an unknown id rather than guessing.
 */
export function getStadiumOrientation(stadiumId: string): number {
  const stadium = MLB_STADIUMS.find((s) => s.id === stadiumId);
  if (!stadium) throw new Error(`Unknown MLB stadium id: ${stadiumId}`);
  return stadium.orientation;
}
