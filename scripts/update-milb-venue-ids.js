const fs = require('fs');
const path = require('path');

// Mapping of team names to correct venue IDs from the API
const venueIdMapping = {
  // Triple-A
  'Buffalo Bisons': 2756,
  'Charlotte Knights': 4670,
  'Columbus Clippers': 3970,
  'Durham Bulls': 2541,
  'Gwinnett Stripers': 3810,
  'Indianapolis Indians': 2858,
  'Iowa Cubs': 2844,
  'Jacksonville Jumbo Shrimp': 2852,
  'Las Vegas Aviators': 5355,
  'Lehigh Valley IronPigs': 3230,
  'Louisville Bats': 2724,
  'Memphis Redbirds': 2542,
  'Nashville Sounds': 4715,
  'Norfolk Tides': 2781,
  'Oklahoma City Baseball Club': 2843,
  'Omaha Storm Chasers': 4271,
  'Reno Aces': 3789,
  'Rochester Red Wings': 2773,
  'Round Rock Express': 2528,
  'Sacramento River Cats': 2529,
  'St. Paul Saints': 5472,
  'Salt Lake Bees': 6135,
  'Scranton/WB RailRiders': 2797,
  'Sugar Land Space Cowboys': 5421,
  'Syracuse Mets': 2823,
  'Tacoma Rainiers': 2745,
  'Toledo Mud Hens': 2767,
  'Worcester Red Sox': 5410,
  'Albuquerque Isotopes': 2683,
  'El Paso Chihuahuas': 4669,

  // Double-A
  'Akron RubberDucks': 2740,
  'Altoona Curve': 2733,
  'Amarillo Sod Poodles': 5415,
  'Arkansas Travelers': 3389,
  'Biloxi Shuckers': 4960,
  'Binghamton Rumble Ponies': 2820,
  'Birmingham Barons': 4529,
  'Bowie Baysox': 2832,
  'Chattanooga Lookouts': 2682,
  'Corpus Christi Hooks': 2861,
  'Erie SeaWolves': 2512,
  'Eugene Emeralds': 4109,
  'Everett AquaSox': 2762,
  'Frisco RoughRiders': 2755,
  'Harrisburg Senators': 2749,
  'Hartford Yard Goats': 4985,
  'Midland RockHounds': 2768,
  'Mississippi Braves': 2776,
  'Montgomery Biscuits': 2814,
  'New Hampshire Fisher Cats': 2868,
  'Northwest Arkansas Naturals': 3329,
  'Pensacola Blue Wahoos': 4329,
  'Portland Sea Dogs': 2779,
  'Reading Fightin Phils': 2769,
  'Richmond Flying Squirrels': 2853,
  'Rocket City Trash Pandas': 5455,
  'San Antonio Missions': 2818,
  'Somerset Patriots': 5418,
  'Springfield Cardinals': 2722,
  'Tulsa Drillers': 4149,
  'Wichita Wind Surge': 5450,

  // High-A
  'Aberdeen IronBirds': 2794,
  'Asheville Tourists': 2864,
  'Beloit Sky Carp': 3834,
  'Bowling Green Hot Rods': 3569,
  'Brooklyn Cyclones': 2795,
  'Cedar Rapids Kernels': 2772,
  'Dayton Dragons': 2766,
  'Fort Myers Mighty Mussels': 2834,
  'Fort Wayne TinCaps': 3790,
  'Great Lakes Loons': 3189,
  'Greensboro Grasshoppers': 2803,
  'Greenville Drive': 2710,
  'Hickory Crawdads': 2796,
  'Hillsboro Hops': 4629,
  'Hudson Valley Renegades': 2544,
  'Jersey Shore BlueClaws': 2785,
  'Lake Elsinore Storm': 2777,
  'Lansing Lugnuts': 2811,
  'Peoria Chiefs': 2809,
  'Rome Emperors': 2740,
  'South Bend Cubs': 2524,
  'Spokane Indians': 2815,
  'Tri-City Dust Devils': 2826,
  'Vancouver Canadians': 2746,
  'Visalia Rawhide': 2835,
  'West Michigan Whitecaps': 2765,
  'Wilmington Blue Rocks': 2842,
  'Winston-Salem Dash': 4089,
  'Wisconsin Timber Rattlers': 2717,

  // Single-A
  'Augusta GreenJackets': 2737,
  'Carolina Mudcats': 2625,
  'Charleston RiverDogs': 2739,
  'Clearwater Threshers': 2742,
  'Columbia Fireflies': 4957,
  'Daytona Tortugas': 2787,
  'Delmarva Shorebirds': 2760,
  'Down East Wood Ducks': 2738,
  'Dunedin Blue Jays': 2790,
  'Fayetteville Woodpeckers': 5400,
  'Fort Wayne TinCaps': 3790,
  'Fredericksburg Nationals': 5453,
  'Fresno Grizzlies': 2640,
  'Inland Empire 66ers': 2782,
  'Jupiter Hammerheads': 2801,
  'Kannapolis Cannon Ballers': 5454,
  'Lake County Captains': 2806,
  'Lynchburg Hillcats': 2729,
  'Modesto Nuts': 2791,
  'Myrtle Beach Pelicans': 2747,
  'Palm Beach Cardinals': 2799,
  'Quad Cities River Bandits': 2795,
  'Rancho Cucamonga Quakes': 2854,
  'Salem Red Sox': 2816,
  'San Jose Giants': 2817,
  'St. Lucie Mets': 2821,
  'Stockton Ports': 2731,
  'Tampa Tarpons': 7250,
};

// Read the file
const filePath = path.join(__dirname, '..', 'src', 'data', 'milbStadiums.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Update venue IDs
Object.entries(venueIdMapping).forEach(([team, venueId]) => {
  const regex = new RegExp(`team: '${team}',\\s*parentOrg:[^,]*,\\s*level:[^,]*,\\s*city:[^,]*,\\s*state:[^,]*,\\s*latitude:[^,]*,\\s*longitude:[^,]*,\\s*orientation:[^,]*,\\s*capacity:[^,]*,\\s*opened:[^,]*,\\s*surface:[^,]*,\\s*roof:[^,]*,\\s*timezone:[^}]*}`, 'gs');
  
  content = content.replace(regex, (match) => {
    return match.replace(/venueId: \d+,/, `venueId: ${venueId},`);
  });
});

// Write the updated file
fs.writeFileSync(filePath, content);
console.log('Updated venue IDs in milbStadiums.ts');