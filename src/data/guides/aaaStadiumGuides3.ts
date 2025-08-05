import { StadiumGuide } from '../stadiumGuides';

export const aaaStadiumGuides3: Record<string, StadiumGuide> = {
  'iowa-cubs': {
    id: 'iowa-cubs',
    name: 'Principal Park',
    team: 'Iowa Cubs',
    opened: 1992,
    capacity: 11500,
    
    overview: {
      description: 'Principal Park in Des Moines is consistently rated as one of the finest Triple-A facilities, featuring perfect sightlines, the iconic outfield bridge, and stunning views of the downtown Des Moines skyline.',
      highlights: [
        'Downtown Des Moines skyline views',
        'Pedestrian bridge to center field',
        'Perfect sightlines from every seat',
        'Iowa Craft Beer Garden'
      ],
      uniqueFeatures: [
        'Center field pedestrian bridge',
        'Left Field Porch party area',
        'Cub Club restaurant',
        'Kids Zone with playground',
        'Iowa Pork Producers grill'
      ],
      renovations: [
        { year: 2021, description: 'New video board and LED lighting' },
        { year: 2019, description: 'Clubhouse renovations' },
        { year: 2006, description: 'Left Field Porch addition' }
      ],
      previousNames: ['Sec Taylor Stadium (1992-2003)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 11-15 behind home plate', 'Club seats'],
        afternoon: ['Third base side sections 1-8', 'Upper box 201-210'],
        evening: ['Most sections shaded after 5 PM', 'First base gains shade by 6 PM']
      },
      coveredSeating: ['Cub Club', 'Suite Level', 'Upper deck overhang rows'],
      shadeTips: [
        'Third base side best for afternoon games',
        'Upper deck provides shade for lower bowl',
        'Left Field Porch has umbrella tables',
        'Iowa summers require shade consideration'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['Main concourse', 'Upper level'],
        indoorAreas: ['Cub Club', 'Team Store', 'Suite Level']
      },
      worstSunExposure: ['Right field lawn', 'Sections 16-20', 'Bleacher sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool and variable', shadeTip: 'Layers needed, sun not intense' },
        { month: 'May', avgTemp: 66, avgHumidity: 65, rainChance: 30, typicalConditions: 'Spring storms possible', shadeTip: 'Shade helpful on sunny days' },
        { month: 'June', avgTemp: 76, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Shade important after 2 PM' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck or third base side' },
        { month: 'August', avgTemp: 80, avgHumidity: 70, rainChance: 25, typicalConditions: 'Continued heat', shadeTip: 'Evening games more comfortable' },
        { month: 'September', avgTemp: 71, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Pleasant most areas' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Cub Club', perks: ['All-inclusive food/drinks', 'Climate control', 'Private bar'], access: 'Third base side' },
          { name: 'Diamond Club', perks: ['Field level premium', 'Wait service'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Left Field Porch', description: 'Party deck with bar', capacity: 300 },
          { name: 'Lawn Hill', description: 'Grass berm beyond left field', capacity: 500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Bleachers', 'Upper reserved corners'],
      familySections: ['Sections 201-203', 'Lawn area'],
      standingRoom: ['Left Field Porch', 'Concourse areas'],
      partyAreas: [
        { name: 'Left Field Porch', capacity: '300', amenities: ['Full bar', 'Tables', 'TVs'] },
        { name: 'Tito\'s Tailgate', capacity: '200', amenities: ['Picnic area', 'Games'] }
      ],
      tips: [
        { section: 'Sections 11-15', tip: 'Best views behind plate', category: 'view' },
        { section: 'Sections 1-8', tip: 'Third base shade and value', category: 'shade' },
        { section: 'Left Field Porch', tip: 'Social party atmosphere', category: 'experience' },
        { section: 'Lawn Hill', tip: 'Great for families, bring blankets', category: 'family' }
      ]
    },
    
    concessions: {
      signature: ['Iowa Pork Chop on a stick', 'Walking Taco', 'Sweet corn', 'Maid-Rite sandwich'],
      local: ['Zombie Burger', 'Exile Brewing beer', 'Casey\'s pizza', 'Tasty Tacos'],
      healthy: ['Fresh salads', 'Grilled chicken', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Salads', 'Veggie pizza'],
      glutenFree: ['GF buns available', 'Marked options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Exile', 'Confluence', 'Big Grove', 'Busch Light'],
        wine: true,
        cocktails: true,
        localBreweries: ['Exile', 'Confluence', 'Big Grove', 'Peace Tree']
      }
    },
    
    parking: {
      lots: [
        { name: 'North Lot', distance: 'Adjacent', price: '$8', shadedSpots: false, covered: false },
        { name: 'South Lot', distance: '5 min walk', price: '$6', shadedSpots: false, covered: false },
        { name: 'Downtown ramps', distance: '10 min walk', price: '$5-10', shadedSpots: true, covered: true, tip: 'Covered parking available' }
      ],
      alternativeTransport: {
        publicTransit: ['DART bus routes to downtown'],
        rideShare: 'SW 2nd Street entrance',
        bicycle: 'Bike racks and BCycle stations'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'Line Drive entrance', bestFor: ['All sections'], openTime: '90 minutes before first pitch' },
      { name: 'First Base Gate', location: 'SW 2nd Street', bestFor: ['First base side'], openTime: '60 minutes before first pitch' },
      { name: 'Third Base Gate', location: 'SW 1st Street', bestFor: ['Third base side'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store - Home Plate Gate', exclusive: ['I-Cubs gear', 'Cubs affiliate items'] }
      ],
      firstAid: ['Section 12', 'Section 201'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services'],
      atms: ['Main concourse locations'],
      wifi: { available: true, network: 'ICubs_WiFi' },
      chargingStations: ['Cub Club', 'Various locations'],
      kidZones: [
        { name: 'Casey\'s General Store Fun Zone', location: 'Right field', activities: ['Playground', 'Speed pitch', 'Bounce house'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available for all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'Available in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Try pork chop on stick', description: 'Iowa State Fair favorite', category: 'food' },
        { title: 'Walk the bridge', description: 'Unique center field feature', category: 'experience' },
        { title: 'Friday fireworks', description: 'Post-game shows', category: 'experience' },
        { title: 'Arrive early', description: 'Limited parking fills fast', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:08 PM weekdays, 6:08 PM Saturdays, 1:08 PM Sundays',
        rushHours: ['5:00-6:00 PM on I-235']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Umbrellas'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Des Moines',
      description: 'Revitalized urban core with restaurants and bars',
      beforeGame: ['Court Avenue restaurants', 'El Bait Shop', 'Fong\'s Pizza'],
      afterGame: ['Court Avenue District', 'East Village bars'],
      radius: '0.5-1 mile'
    },
    
    transportation: {
      address: '1 Line Drive, Des Moines, IA 50309',
      publicTransit: {
        bus: [{ routes: ['DART Routes 1, 4, 7'], stops: ['Downtown stops'] }]
      },
      driving: {
        majorRoutes: ['I-235 to MLK Parkway', 'I-35/80 to Downtown'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'MLK Parkway from I-235'
      },
      rideShare: {
        pickupZone: 'SW 2nd Street',
        dropoffZone: 'Same as pickup',
        surgePricing: '2x after games',
        alternativeTip: 'Walk to Court Avenue for easier pickup'
      }
    },
    
    history: {
      timeline: [
        { year: 1992, event: 'Sec Taylor Stadium opens' },
        { year: 1981, event: 'Cubs affiliation begins (at old stadium)' },
        { year: 2004, event: 'Renamed Principal Park' }
      ],
      notableGames: [
        { date: '1992-04-16', description: 'First game at Sec Taylor Stadium' },
        { date: '2008-09-02', description: 'Triple-A Championship' }
      ],
      traditions: [
        { name: 'Cubbie Bear race', description: 'Between innings entertainment' },
        { name: 'Friday Fireworks', description: 'Summer firework shows' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly Midwest charm',
      bestExperiences: [
        'Center field bridge walk',
        'Iowa pork specialties',
        'Downtown skyline views',
        'Friday fireworks'
      ],
      traditions: ['Cubbie Bear mascot', 'Sweet Caroline sing-along'],
      music: 'Classic ballpark with modern hits',
      mascot: { name: 'Cubbie Bear', description: 'Bear mascot in Cubs uniform' }
    },
    
    proTips: {
      insiderTips: [
        'Left Field Porch has best beer selection',
        'Park downtown and walk for easier exit',
        'Bridge is open during games for unique views',
        'Zombie Burger stand worth the line',
        'Thursday Thirsty games have drink specials'
      ],
      avoidThese: [
        'Right field in afternoon sun',
        'Parking lots without early arrival',
        'Bridge during busy innings',
        'I-235 right after fireworks nights'
      ],
      hiddenGems: [
        'Craft beer selection at Left Field Porch',
        'Views from center field bridge',
        'Local food vendors rotate',
        'Kids can run bases after Sunday games'
      ],
      photoSpots: [
        'Center field bridge',
        'With downtown skyline',
        'Principal Park sign',
        'With Cubbie Bear'
      ],
      bestValue: [
        'Lawn tickets for families',
        'Thursday drink specials',
        'Upper reserved corners',
        'Park downtown and walk'
      ]
    }
  },

  'memphis-redbirds': {
    id: 'memphis-redbirds',
    name: 'AutoZone Park',
    team: 'Memphis Redbirds',
    opened: 2000,
    capacity: 10000,
    
    overview: {
      description: 'AutoZone Park in downtown Memphis is a retro-classic ballpark on the edge of Beale Street, featuring stunning views of downtown, BBQ nachos, and the famous Memphis music scene atmosphere.',
      highlights: [
        'Downtown Memphis location near Beale Street',
        'Retro-classic architecture',
        'Bluff City Brewing beer garden',
        'Memphis BBQ throughout'
      ],
      uniqueFeatures: [
        'Toyota Plaza entrance',
        'Bluff restaurant in right field',
        'Party Deck in left field',
        'BBQ nachos originated here',
        'Rock \'n\' Soul Museum nearby'
      ],
      renovations: [
        { year: 2018, description: 'New video board and sound system' },
        { year: 2015, description: 'Clubhouse renovations' },
        { year: 2009, description: 'Bluff restaurant addition' }
      ],
      previousNames: []
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Home Plate Club seats', 'Sections 106-110'],
        afternoon: ['Third base side 101-105', 'Dugout Suites', 'Upper sections'],
        evening: ['Most sections after 5 PM', 'First base side by sunset']
      },
      coveredSeating: ['Dugout Suites', 'Club Level', 'Upper deck overhang'],
      shadeTips: [
        'Third base side best for day games',
        'Upper level provides shade for Field Box',
        'Bluff restaurant has covered seating',
        'Memphis heat and humidity make shade crucial'
      ],
      sunProtection: {
        sunscreenStations: ['First Aid stations'],
        shadedConcourses: ['All concourse areas'],
        indoorAreas: ['Bluff restaurant', 'Club areas', 'Team Store']
      },
      worstSunExposure: ['Lawn seating', 'Right field sections 201-203', 'Bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 66, avgHumidity: 65, rainChance: 30, typicalConditions: 'Variable spring weather', shadeTip: 'Comfortable most areas' },
        { month: 'May', avgTemp: 75, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warming and humid', shadeTip: 'Shade helpful afternoons' },
        { month: 'June', avgTemp: 83, avgHumidity: 70, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential after 2 PM' },
        { month: 'July', avgTemp: 87, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak heat and humidity', shadeTip: 'Upper deck or club seats' },
        { month: 'August', avgTemp: 87, avgHumidity: 75, rainChance: 25, typicalConditions: 'Continued heat', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 79, avgHumidity: 70, rainChance: 25, typicalConditions: 'Still warm', shadeTip: 'More bearable' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Home Plate Club', perks: ['All-inclusive food/drinks', 'Climate control', 'Padded seats'], access: 'Behind home plate' },
          { name: 'Dugout Suites', perks: ['Field level luxury', 'Wait service'], access: 'Dugout level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Bluff Restaurant', description: 'Right field dining with views', capacity: 150 },
          { name: 'Party Deck', description: 'Left field group area', capacity: 200 }
        ]
      },
      budgetOptions: ['Lawn berm', 'Bleacher seats', 'Upper deck corners'],
      familySections: ['Sections 201-203'],
      standingRoom: ['Party Deck', 'Plaza areas'],
      partyAreas: [
        { name: 'Party Deck', capacity: '200', amenities: ['Bar service', 'Standing tables', 'TVs'] },
        { name: 'Bluff City Brewing', capacity: '150', amenities: ['Craft beer', 'Picnic tables'] }
      ],
      tips: [
        { section: 'Sections 106-110', tip: 'Best views behind home plate', category: 'view' },
        { section: 'Sections 101-105', tip: 'Third base shade', category: 'shade' },
        { section: 'Bluff Restaurant', tip: 'Dinner and game combo', category: 'experience' },
        { section: 'Lawn', tip: 'Budget friendly for families', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['BBQ Nachos (invented here)', 'Pulled pork sandwich', 'Memphis BBQ', 'Pronto Pups'],
      local: ['Rendezvous BBQ', 'Central BBQ', 'Gus\'s Fried Chicken', 'Local craft beers'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Salads', 'Veggie nachos'],
      glutenFree: ['GF options marked'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Pizza', 'Ice cream'],
      alcohol: {
        beer: ['Memphis Made', 'Ghost River', 'Wiseacre', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Memphis Made', 'Ghost River', 'Wiseacre', 'Crosstown Brewing']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lot', distance: 'Adjacent', price: '$10', shadedSpots: false, covered: false },
        { name: 'Downtown garages', distance: '5-10 min walk', price: '$5-15', shadedSpots: true, covered: true },
        { name: 'Street parking', distance: 'Various', price: 'Metered until 6 PM', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['MATA bus routes', 'Main Street Trolley'],
        rideShare: 'Third Street entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Toyota Plaza Gate', location: 'Third Street', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch' },
      { name: 'Union Avenue Gate', location: 'Union Ave', bestFor: ['First base side'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store - Toyota Plaza', exclusive: ['Redbirds gear', 'Cardinals affiliate items'] }
      ],
      firstAid: ['Section 109', 'Section 202'],
      babyChanging: ['Family restrooms'],
      nursingRooms: ['Guest Services'],
      atms: ['Main concourse'],
      wifi: { available: true, network: 'Redbirds_WiFi' },
      kidZones: [
        { name: 'Kids Zone', location: 'Left field', activities: ['Playground', 'Games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available for all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available in stadium lot'
    },
    
    gameDay: {
      tips: [
        { title: 'Get BBQ nachos', description: 'Stadium invented them', category: 'food' },
        { title: 'Explore Beale Street', description: 'Before or after game', category: 'experience' },
        { title: 'Friday fireworks', description: 'Post-game shows', category: 'experience' },
        { title: 'Take trolley', description: 'Free downtown transport', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM weekdays, 6:35 PM Saturdays, 2:05 PM Sundays',
        rushHours: ['5:00-6:00 PM on I-40 and I-240']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Memphis',
      description: 'Historic downtown near Beale Street',
      beforeGame: ['Beale Street bars', 'Central BBQ', 'Rendezvous BBQ'],
      afterGame: ['Beale Street music venues', 'Downtown bars'],
      radius: '0.5 mile'
    },
    
    transportation: {
      address: '200 Union Ave, Memphis, TN 38103',
      publicTransit: {
        bus: [{ routes: ['MATA various routes'], stops: ['Downtown Transit Center'] }]
      },
      driving: {
        majorRoutes: ['I-40 to Downtown', 'I-55 to Downtown', 'US-61 to Union Ave'],
        typicalTraffic: 'Moderate downtown traffic',
        bestApproach: 'I-40 to Second Street exit'
      },
      rideShare: {
        pickupZone: 'Third Street',
        dropoffZone: 'Same as pickup',
        surgePricing: '2x after games',
        alternativeTip: 'Walk to Beale Street area'
      }
    },
    
    history: {
      timeline: [
        { year: 2000, event: 'AutoZone Park opens' },
        { year: 1998, event: 'Become Cardinals affiliate' },
        { year: 2009, event: 'Triple-A National Championship' }
      ],
      notableGames: [
        { date: '2000-04-01', description: 'First game at AutoZone Park' },
        { date: '2009-09-22', description: 'Triple-A Championship clincher' }
      ],
      traditions: [
        { name: 'BBQ Nachos', description: 'Stadium creation now nationwide' },
        { name: 'Friday Fireworks', description: 'Summer tradition' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Memphis music and BBQ culture',
      bestExperiences: [
        'BBQ nachos in their birthplace',
        'Beale Street proximity',
        'Bluff restaurant dining',
        'Memphis music between innings'
      ],
      traditions: ['7th inning stretch Memphis style', 'BBQ competitions'],
      music: 'Heavy on Memphis soul, blues, and rock',
      mascot: { name: 'Rockey the Redbird', description: 'Cardinal mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Park downtown and walk',
        'Bluff restaurant requires reservations',
        'BBQ nachos are huge - share them',
        'Thursday Thirsty games have deals',
        'Beale Street before games'
      ],
      avoidThese: [
        'Lawn on hot humid days',
        'Driving on I-40 at rush hour',
        'Right field in afternoon sun',
        'Parking lot without early arrival'
      ],
      hiddenGems: [
        'Craft beer at Bluff City Brewing',
        'Rendezvous BBQ stand',
        'Views from upper deck',
        'Free trolley around downtown'
      ],
      photoSpots: [
        'Toyota Plaza entrance',
        'With downtown skyline',
        'Beale Street sign nearby',
        'With Rockey the Redbird'
      ],
      bestValue: [
        'Lawn seating',
        'Thursday promotions',
        'Park in downtown garage',
        'Combo tickets with Rock \'n\' Soul Museum'
      ]
    }
  },

  'nashville-sounds': {
    id: 'nashville-sounds',
    name: 'First Horizon Park',
    team: 'Nashville Sounds',
    opened: 2015,
    capacity: 10000,
    
    overview: {
      description: 'First Horizon Park sits in the heart of Nashville\'s Germantown neighborhood, featuring the iconic guitar-shaped scoreboard, local hot chicken, craft beer selection, and Music City atmosphere throughout.',
      highlights: [
        'Guitar-shaped scoreboard',
        'Nashville skyline views',
        'The Band Box entertainment stage',
        'Local music between innings'
      ],
      uniqueFeatures: [
        'Guitar scoreboard - largest in sports',
        'The Band Box stage for live music',
        'Coca-Cola Corner playground',
        'Nashville hot chicken stands',
        'Country music atmosphere'
      ],
      renovations: [
        { year: 2019, description: 'First Horizon naming rights' },
        { year: 2018, description: 'Clubhouse upgrades' }
      ],
      previousNames: []
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 109-115 behind home plate', 'Club Level'],
        afternoon: ['Third base side 101-108', 'Sections 201-210 upper deck'],
        evening: ['Most sections after 5:30 PM', 'First base side by 6:30 PM']
      },
      coveredSeating: ['Club Level', 'Dugout Suites', 'Upper deck overhang'],
      shadeTips: [
        'Third base side for afternoon shade',
        'Upper deck provides shade for lower sections',
        'Band Box area has covered seating',
        'Nashville humidity makes shade valuable'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services'],
        shadedConcourses: ['All concourse levels'],
        indoorAreas: ['Club lounges', 'Team Store', 'First Base Line Club']
      },
      worstSunExposure: ['Right field lawn', 'Sections 116-120', 'Bleacher sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 63, avgHumidity: 65, rainChance: 30, typicalConditions: 'Spring storms possible', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 72, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Shade helpful afternoons' },
        { month: 'June', avgTemp: 80, avgHumidity: 70, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Seek shade after 2 PM' },
        { month: 'July', avgTemp: 84, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Upper deck or club level' },
        { month: 'August', avgTemp: 83, avgHumidity: 75, rainChance: 20, typicalConditions: 'Continued heat', shadeTip: 'Evening games recommended' },
        { month: 'September', avgTemp: 76, avgHumidity: 70, rainChance: 20, typicalConditions: 'Still warm', shadeTip: 'More comfortable' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Dugout Club', perks: ['All-inclusive food/drinks', 'Field level', 'Climate control'], access: 'Behind home plate' },
          { name: 'First Base Line Club', perks: ['Buffet', 'Full bar', 'Lounge access'], access: 'First base side' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'The Band Box', description: 'Left field stage and bar', capacity: 250 },
          { name: 'Budweiser Bowtie Bar', description: 'Right field party area', capacity: 200 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved corners', 'Standing room'],
      familySections: ['Coca-Cola Corner', 'Sections 201-203'],
      standingRoom: ['Band Box', 'Bowtie Bar', 'Concourse areas'],
      partyAreas: [
        { name: 'The Band Box', capacity: '250', amenities: ['Live music stage', 'Full bar', 'Standing tables'] },
        { name: 'Bowtie Bar', capacity: '200', amenities: ['Bar service', 'TVs', 'Picnic tables'] }
      ],
      tips: [
        { section: 'Sections 109-115', tip: 'Best views of guitar scoreboard', category: 'view' },
        { section: 'Sections 101-108', tip: 'Third base shade value', category: 'shade' },
        { section: 'Band Box', tip: 'Music and social scene', category: 'experience' },
        { section: 'Lawn', tip: 'Bring blankets for comfort', category: 'family' }
      ]
    },
    
    concessions: {
      signature: ['Nashville hot chicken', 'Goo Goo Clusters', 'BBQ nachos', 'Local craft beers'],
      local: ['Prince\'s Hot Chicken', 'Martin\'s BBQ', 'Hattie B\'s', 'Yazoo beer'],
      healthy: ['Salads', 'Grilled chicken', 'Fresh options'],
      vegetarian: ['Veggie burgers', 'Salads', 'Veggie nachos'],
      glutenFree: ['GF buns available', 'Marked options'],
      kidsFriendly: ['Chicken tenders', 'Pizza', 'Hot dogs', 'Ice cream'],
      alcohol: {
        beer: ['Yazoo', 'Tennessee Brew Works', 'Jackalope', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Yazoo', 'Tennessee Brew Works', 'Jackalope', 'Bearded Iris']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lot', distance: 'Adjacent', price: '$10', shadedSpots: false, covered: false },
        { name: 'Germantown lots', distance: '5-10 min walk', price: '$5-10', shadedSpots: false, covered: false },
        { name: 'Street parking', distance: 'Various', price: 'Free after 6 PM', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['WeGo bus routes'],
        rideShare: 'Harrison Street entrance',
        bicycle: 'B-cycle stations nearby'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'Junior Gilliam Way', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch' },
      { name: 'Right Field Gate', location: 'Harrison Street', bestFor: ['Right field', 'Bowtie Bar'], openTime: '60 minutes before first pitch' },
      { name: 'Left Field Gate', location: '5th Ave N', bestFor: ['Band Box', 'Left field'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store - Home Plate Gate', exclusive: ['Sounds gear', 'Guitar scoreboard items'] }
      ],
      firstAid: ['Section 112', 'Section 203'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services'],
      atms: ['Throughout concourses'],
      wifi: { available: true, network: 'Sounds_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Coca-Cola Corner', location: 'Right field', activities: ['Playground', 'Games', 'Speed pitch'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available for all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'Available in stadium lot'
    },
    
    gameDay: {
      tips: [
        { title: 'Try hot chicken', description: 'Nashville specialty', category: 'food' },
        { title: 'Enjoy live music', description: 'Band Box performances', category: 'experience' },
        { title: 'Saturday fireworks', description: 'Post-game shows', category: 'experience' },
        { title: 'Explore Germantown', description: 'Great neighborhood bars', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '6:35 PM weekdays, 6:35 PM Saturdays, 2:05 PM Sundays',
        rushHours: ['5:00-6:00 PM on I-65 and I-40']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Germantown',
      description: 'Historic neighborhood with restaurants and bars',
      beforeGame: ['Von Elrod\'s', 'Tennessee Brew Works', 'Germantown Pub'],
      afterGame: ['5th & Taylor', 'Geist Bar', 'Bearded Iris Brewing'],
      radius: 'Walking distance'
    },
    
    transportation: {
      address: '19 Junior Gilliam Way, Nashville, TN 37219',
      publicTransit: {
        bus: [{ routes: ['WeGo Routes 22, 25'], stops: ['Jefferson Street'] }]
      },
      driving: {
        majorRoutes: ['I-65 to Wedgewood', 'I-40 to Downtown', 'I-24 to I-40'],
        typicalTraffic: 'Heavy on interstates at rush hour',
        bestApproach: 'Jefferson Street from downtown'
      },
      rideShare: {
        pickupZone: 'Harrison Street',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to Germantown for easier pickup'
      }
    },
    
    history: {
      timeline: [
        { year: 2015, event: 'First Horizon Park opens' },
        { year: 1978, event: 'Sounds founded' },
        { year: 2021, event: 'Become Brewers affiliate' }
      ],
      notableGames: [
        { date: '2015-04-17', description: 'First game at First Horizon Park' }
      ],
      traditions: [
        { name: 'Guitar scoreboard celebration', description: 'Lights up for home runs' },
        { name: 'Country music themes', description: 'Music City atmosphere' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Music City meets baseball',
      bestExperiences: [
        'Guitar scoreboard home runs',
        'Live music at Band Box',
        'Nashville hot chicken',
        'Local craft beer selection'
      ],
      traditions: ['Country music between innings', 'Guitar lighting ceremony'],
      music: 'Heavy country influence with variety',
      mascot: { name: 'Booster', description: 'Musical note mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Band Box has live music pre-game',
        'Germantown restaurants within walking distance',
        'Thursday Thirsty games have beer specials',
        'Upper deck has best skyline views',
        'Street parking free after 6 PM'
      ],
      avoidThese: [
        'Right field lawn on hot days',
        'I-65 at rush hour',
        'Hot chicken if you can\'t handle spice',
        'Stadium lot - fills quickly'
      ],
      hiddenGems: [
        'Tennessee Brew Works nearby',
        'Guitar scoreboard photos at night',
        'Local musicians at Band Box',
        'Germantown dining scene'
      ],
      photoSpots: [
        'With guitar scoreboard',
        'Nashville skyline from upper deck',
        'Band Box stage area',
        'Home plate entrance'
      ],
      bestValue: [
        'Lawn tickets',
        'Thursday beer specials',
        'Street parking after 6 PM',
        'Germantown happy hours before game'
      ]
    }
  }
};