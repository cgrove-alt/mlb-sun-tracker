// MiLB Team ID Mapping
// Maps venue IDs to team IDs for fetching schedules from MLB Stats API

export const MILB_VENUE_TO_TEAM_MAP: Record<number, number> = {
  // Triple-A Teams (International League & Pacific Coast League)
  2756: 422,  // Sahlen Field -> Buffalo Bisons
  4670: 494,  // Truist Field -> Charlotte Knights  
  3970: 445,  // Huntington Park -> Columbus Clippers
  2541: 234,  // Durham Bulls Athletic Park -> Durham Bulls
  3810: 431,  // Coolray Field -> Gwinnett Stripers
  2858: 484,  // Victory Field -> Indianapolis Indians
  2844: 451,  // Principal Park -> Iowa Cubs
  2852: 564,  // Vystar Ballpark -> Jacksonville Jumbo Shrimp
  5355: 400,  // Las Vegas Ballpark -> Las Vegas Aviators
  3230: 1410, // Coca-Cola Park -> Lehigh Valley IronPigs
  2724: 416,  // Louisville Slugger Field -> Louisville Bats
  2542: 235,  // AutoZone Park -> Memphis Redbirds
  4715: 556,  // First Horizon Park -> Nashville Sounds
  2781: 568,  // Harbor Park -> Norfolk Tides
  2843: 238,  // Chickasaw Bricktown Ballpark -> Oklahoma City Comets
  4271: 541,  // Werner Park -> Omaha Storm Chasers
  3789: 2310, // Greater Nevada Field -> Reno Aces
  2773: 534,  // Innovative Field -> Rochester Red Wings
  2528: 102,  // Dell Diamond -> Round Rock Express
  2529: 105,  // Sutter Health Park -> Sacramento River Cats
  5472: 1960, // CHS Field -> St. Paul Saints
  6135: 561,  // The Ballpark at America First Square -> Salt Lake Bees
  2797: 531,  // PNC Field -> Scranton/WB RailRiders
  5421: 5434, // Constellation Field -> Sugar Land Space Cowboys
  2823: 552,  // NBT Bank Stadium -> Syracuse Mets
  2745: 529,  // Cheney Stadium -> Tacoma Rainiers
  2767: 512,  // Fifth Third Field -> Toledo Mud Hens
  5410: 533,  // Polar Park -> Worcester Red Sox
  2683: 342,  // Isotopes Park -> Albuquerque Isotopes
  4669: 4904, // Southwest University Park -> El Paso Chihuahuas

  // Double-A Teams (Eastern, Southern, and Texas Leagues)
  2740: 402,  // Canal Park -> Akron RubberDucks
  2733: 452,  // Peoples Natural Gas Field -> Altoona Curve
  5415: 5368, // Hodgetown -> Amarillo Sod Poodles
  3389: 574,  // Dickey-Stephens Park -> Arkansas Travelers
  4960: 5015, // Keesler Federal Park -> Biloxi Shuckers
  2820: 505,  // Mirabito Stadium -> Binghamton Rumble Ponies
  4529: 247,  // Regions Field -> Birmingham Barons
  2832: 418,  // Prince George's Stadium -> Chesapeake Baysox (Bowie)
  2682: 498,  // AT&T Field -> Chattanooga Lookouts
  2776: 6325, // Synovus Park -> Columbus Clingstones
  2861: 482,  // Whataburger Field -> Corpus Christi Hooks
  2512: 106,  // UPMC Park -> Erie SeaWolves
  2755: 540,  // Riders Field -> Frisco RoughRiders
  2749: 547,  // FNB Field -> Harrisburg Senators
  4985: 538,  // Dunkin' Park -> Hartford Yard Goats
  6136: 553,  // Covenant Health Park -> Knoxville Smokies
  2768: 237,  // Momentum Bank Ballpark -> Midland RockHounds
  2814: 421,  // Montgomery Riverwalk Stadium -> Montgomery Biscuits
  2868: 463,  // Delta Dental Stadium -> New Hampshire Fisher Cats
  3329: 1350, // Arvest Ballpark -> Northwest Arkansas Naturals
  4329: 4124, // Blue Wahoos Stadium -> Pensacola Blue Wahoos
  2779: 546,  // Delta Dental Park -> Portland Sea Dogs
  2769: 522,  // FirstEnergy Stadium -> Reading Fightin Phils
  2853: 3410, // The Diamond -> Richmond Flying Squirrels
  5455: 559,  // Toyota Field -> Rocket City Trash Pandas
  2818: 510,  // Nelson Wolff Stadium -> San Antonio Missions
  5418: 1956, // TD Bank Ballpark -> Somerset Patriots
  2722: 440,  // Hammons Field -> Springfield Cardinals
  4149: 260,  // ONEOK Field -> Tulsa Drillers
  5450: 3898, // Equity Bank Park -> Wichita Wind Surge

  // High-A Teams (Midwest, South Atlantic, and Northwest Leagues)
  2794: 411,  // Nymeo Field -> Aberdeen IronBirds
  3790: 584,  // Parkview Field -> Fort Wayne TinCaps
  3189: 456,  // Dow Diamond -> Great Lakes Loons
  2766: 459,  // Day Air Ballpark -> Dayton Dragons
  3569: 2498, // Bowling Green Ballpark -> Bowling Green Hot Rods
  2765: 582,  // LMCU Ballpark -> West Michigan Whitecaps
  2795: 453,  // Maimonides Park -> Brooklyn Cyclones
  4089: 580,  // Truist Stadium -> Winston-Salem Dash
  2762: 403,  // Funko Field -> Everett AquaSox
  4109: 461,  // PK Park -> Eugene Emeralds
  2826: 460,  // Gesa Stadium -> Tri-City Dust Devils

  // Single-A Teams (California, Carolina, and Florida State Leagues)
  2796: 448,  // L.P. Frans Stadium -> Hickory Crawdads
  5400: 3712, // SEGRA Stadium -> Fayetteville Woodpeckers
  2787: 450,  // Jackie Robinson Ballpark -> Daytona Tortugas
  2791: 515,  // John Thurman Field -> Modesto Nuts
  2640: 259,  // Chukchansi Park -> Fresno Grizzlies
  2835: 516,  // Valley Strong Ballpark -> Visalia Rawhide
  2747: 521,  // Pelicans Ballpark -> Myrtle Beach Pelicans
  7250: 587,  // Yankee Complex Field 2 -> Tampa Tarpons
  2731: 524,  // Banner Island Ballpark -> Stockton Ports
  2854: 526,  // LoanMart Field -> Rancho Cucamonga Quakes
};

// Helper function to get team ID from venue ID
export function getTeamIdFromVenueId(venueId: number): number | null {
  return MILB_VENUE_TO_TEAM_MAP[venueId] || null;
}

// Reverse mapping for convenience
export const MILB_TEAM_TO_VENUE_MAP: Record<number, number> = {};
Object.entries(MILB_VENUE_TO_TEAM_MAP).forEach(([venueId, teamId]) => {
  MILB_TEAM_TO_VENUE_MAP[teamId] = parseInt(venueId);
});