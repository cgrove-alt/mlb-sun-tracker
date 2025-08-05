import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides: Record<string, StadiumGuide> = {
  'akron-rubberducks': {
    id: 'akron-rubberducks',
    name: 'Canal Park',
    team: 'Akron RubberDucks',
    opened: 1997,
    capacity: 7630,
    
    overview: {
      description: 'Canal Park in downtown Akron is an intimate downtown ballpark along the Ohio & Erie Canal, featuring unique rubber duck theme elements and one of the best fan experiences in Double-A baseball.',
      highlights: [
        'Downtown Akron location',
        'Ohio & Erie Canal views',
        'Duck-themed entertainment',
        'Award-winning fan experience'
      ],
      uniqueFeatures: [
        'DuckTail Terrace in left field',
        'Kids Fundeck playground',
        'Canal behind outfield',
        'Rubber duck races',
        'Duck call traditions'
      ],
      renovations: [
        { year: 2014, description: 'RubberDucks rebrand and upgrades' },
        { year: 2021, description: 'New video board' }
      ],
      previousNames: ['Akron Aeros (1997-2013)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 100-105 behind home plate'],
        afternoon: ['Third base side 106-112', 'Upper boxes'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Duck Row suites', 'Upper deck overhang'],
      shadeTips: [
        'Third base side best for afternoon',
        'Upper level provides shade below',
        'DuckTail Terrace has umbrellas',
        'Ohio weather can be variable'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Duck Row club', 'Team Store']
      },
      worstSunExposure: ['Right field lawn', 'Sections 113-118'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool and wet', shadeTip: 'Dress warm' },
        { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 30, typicalConditions: 'Variable spring', shadeTip: 'Layers recommended' },
        { month: 'June', avgTemp: 72, avgHumidity: 70, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Shade helpful afternoons' },
        { month: 'July', avgTemp: 76, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm and humid', shadeTip: 'Seek shade for day games' },
        { month: 'August', avgTemp: 75, avgHumidity: 70, rainChance: 25, typicalConditions: 'Continued warmth', shadeTip: 'Upper deck best' },
        { month: 'September', avgTemp: 68, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Comfortable most areas' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Duck Row', perks: ['All-inclusive food/drinks', 'Climate control'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'HDTV']
        },
        specialAreas: [
          { name: 'DuckTail Terrace', description: 'Left field deck', capacity: 150 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved'],
      familySections: ['Sections 200-202'],
      standingRoom: ['DuckTail Terrace', 'Concourse'],
      partyAreas: [
        { name: 'DuckTail Terrace', capacity: '150', amenities: ['Bar', 'Tables', 'Umbrellas'] }
      ],
      tips: [
        { section: 'Sections 100-105', tip: 'Best views', category: 'view' },
        { section: 'DuckTail Terrace', tip: 'Social atmosphere', category: 'experience' },
        { section: 'Lawn', tip: 'Great for families', category: 'family' }
      ]
    },
    
    concessions: {
      signature: ['Orbit Dog', 'Rubber City Nachos', 'Local craft beers'],
      local: ['Swensons burgers', 'Luigi\'s pizza', 'Thirsty Dog beer'],
      healthy: ['Salads', 'Veggie options'],
      vegetarian: ['Veggie burgers', 'Salads'],
      kidsFriendly: ['Hot dogs', 'Pizza', 'Ice cream'],
      alcohol: {
        beer: ['Thirsty Dog', 'Great Lakes', 'Hoppin\' Frog'],
        wine: true,
        cocktails: true,
        localBreweries: ['Thirsty Dog', 'Hoppin\' Frog', 'Missing Falls']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown decks', distance: '5-10 min walk', price: '$3-8', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['METRO bus routes'],
        rideShare: 'Main Street entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Main Street', bestFor: ['All sections'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store', exclusive: ['RubberDucks gear'] }
      ],
      firstAid: ['Behind section 105'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Fundeck', location: 'Right field', activities: ['Playground', 'Games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Available']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available'
    },
    
    gameDay: {
      tips: [
        { title: 'Duck call tradition', description: 'Join in the quacking', category: 'experience' },
        { title: 'Friday fireworks', description: 'Post-game shows', category: 'experience' },
        { title: 'Try Swensons', description: 'Local burger favorite', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:35 PM weekdays, 6:05 PM Saturdays, 2:05 PM Sundays',
        rushHours: ['5:00-6:00 PM on Route 8']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Akron',
      description: 'Revitalizing urban core',
      beforeGame: ['Lock 15 Brewing', 'Crave', 'Barley House'],
      afterGame: ['Highland Square bars', 'Downtown nightlife'],
      radius: '0.5 mile'
    },
    
    transportation: {
      address: '300 S Main St, Akron, OH 44308',
      publicTransit: {
        bus: [{ routes: ['METRO various routes'], stops: ['Downtown Transit Center'] }]
      },
      driving: {
        majorRoutes: ['I-76/77 to downtown', 'Route 8 to downtown'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'Route 8 to Main Street'
      },
      rideShare: {
        pickupZone: 'Main Street',
        dropoffZone: 'Same',
        surgePricing: '2x after games',
        alternativeTip: 'Walk downtown for easier pickup'
      }
    },
    
    history: {
      timeline: [
        { year: 1997, event: 'Canal Park opens' },
        { year: 2014, event: 'Rebrand as RubberDucks' }
      ],
      notableGames: [
        { date: '1997-04-10', description: 'First game at Canal Park' }
      ],
      traditions: [
        { name: 'Rubber duck races', description: 'Between innings entertainment' },
        { name: 'Duck calls', description: 'Fan participation' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Fun, family-friendly with quirky duck theme',
      bestExperiences: [
        'Duck races',
        'Friday fireworks',
        'DuckTail Terrace',
        'Canal views'
      ],
      traditions: ['Duck calls', 'Rubber duck giveaways'],
      music: 'Mix of classics and modern',
      mascot: { name: 'Orbit', description: 'Duck mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Park downtown and walk',
        'DuckTail Terrace great for groups',
        'Thursday Thirsty deals',
        'Kids love the playground'
      ],
      avoidThese: [
        'Right field on sunny days',
        'Parking lot traffic after fireworks'
      ],
      hiddenGems: [
        'Canal walk behind stadium',
        'Thirsty Dog beer selection',
        'Lock 15 Brewing nearby'
      ],
      photoSpots: [
        'With Orbit mascot',
        'Canal Park sign',
        'Canal backdrop'
      ],
      bestValue: [
        'Lawn seating',
        'Thursday promotions',
        'Downtown deck parking'
      ]
    }
  },

  'richmond-flying-squirrels': {
    id: 'richmond-flying-squirrels',
    name: 'The Diamond',
    team: 'Richmond Flying Squirrels',
    opened: 1985,
    capacity: 9560,
    
    overview: {
      description: 'The Diamond in Richmond has served as home to Double-A baseball since 1985. While showing its age, the stadium maintains charm with its traditional design and the wildly popular Flying Squirrels brand.',
      highlights: [
        'Classic ballpark design',
        'Flying Squirrels entertainment',
        'Richmond skyline views',
        'Party deck areas'
      ],
      uniqueFeatures: [
        'Funnville community area',
        'Party Plaza',
        'Squirrel-themed entertainment',
        'Traditional scoreboard',
        'Picnic pavilion'
      ],
      renovations: [
        { year: 2010, description: 'Flying Squirrels rebrand' },
        { year: 2014, description: 'New video board' }
      ],
      previousNames: []
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-108 behind home plate'],
        afternoon: ['Third base side 109-116', 'Upper level 201-210'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Suites', 'Upper deck overhang'],
      shadeTips: [
        'Third base side for afternoon games',
        'Upper level provides some shade',
        'Party Plaza has covered areas',
        'Virginia heat requires shade'
      ],
      sunProtection: {
        sunscreenStations: ['First Aid'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Suite Level', 'Team Store']
      },
      worstSunExposure: ['Right field sections', 'General admission lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 60, rainChance: 25, typicalConditions: 'Mild spring', shadeTip: 'Comfortable' },
        { month: 'May', avgTemp: 71, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Afternoon shade helpful' },
        { month: 'June', avgTemp: 79, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warming up', shadeTip: 'Shade important' },
        { month: 'July', avgTemp: 83, avgHumidity: 75, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck or third base' },
        { month: 'August', avgTemp: 82, avgHumidity: 75, rainChance: 30, typicalConditions: 'Peak heat', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 75, avgHumidity: 70, rainChance: 25, typicalConditions: 'Still warm', shadeTip: 'More comfortable' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Flying Squirrels Club', perks: ['All-inclusive food/drinks'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'AC']
        },
        specialAreas: [
          { name: 'Party Plaza', description: 'Left field party area', capacity: 200 },
          { name: 'Funnville', description: 'Family fun area', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', 'Upper level corners'],
      familySections: ['Funnville area'],
      standingRoom: ['Party Plaza', 'Concourse'],
      partyAreas: [
        { name: 'Party Plaza', capacity: '200', amenities: ['Bar', 'Tables'] }
      ],
      tips: [
        { section: 'Sections 101-108', tip: 'Best views', category: 'view' },
        { section: 'Third base side', tip: 'Afternoon shade', category: 'shade' },
        { section: 'Party Plaza', tip: 'Social scene', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: ['Pulled pork sandwich', 'Flying nuts', 'Local beers'],
      local: ['Buz and Ned\'s BBQ', 'Virginia craft beers'],
      healthy: ['Salads', 'Grilled options'],
      vegetarian: ['Veggie options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Pizza'],
      alcohol: {
        beer: ['Hardywood', 'Legend', 'Strangeways'],
        wine: true,
        cocktails: false,
        localBreweries: ['Hardywood', 'Legend', 'Veil', 'Triple Crossing']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '5 min walk', price: '$5', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['Limited GRTC service'],
        rideShare: 'Arthur Ashe Blvd entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Arthur Ashe Blvd', bestFor: ['All sections'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store', exclusive: ['Flying Squirrels gear'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      kidZones: [
        { name: 'Funnville', location: 'Right field', activities: ['Playground', 'Games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'All gates accessible',
        elevators: ['Available']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available'
    },
    
    gameDay: {
      tips: [
        { title: 'Friday fireworks', description: 'Popular shows', category: 'experience' },
        { title: 'Try BBQ', description: 'Local specialty', category: 'food' },
        { title: 'Arrive early', description: 'Limited parking', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:35 PM weekdays, 6:05 PM Saturdays, 1:05 PM Sundays',
        rushHours: ['5:00-6:00 PM on I-95']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Scott\'s Addition',
      description: 'Growing brewery district nearby',
      beforeGame: ['Scott\'s Addition breweries', 'Boulevard Burger & Brew'],
      afterGame: ['Scott\'s Addition bars', 'The Fan district'],
      radius: '1-2 miles'
    },
    
    transportation: {
      address: '3001 N Arthur Ashe Blvd, Richmond, VA 23230',
      publicTransit: {
        bus: [{ routes: ['GRTC limited service'], stops: ['Arthur Ashe Blvd'] }]
      },
      driving: {
        majorRoutes: ['I-95 to Boulevard', 'I-64 to Boulevard'],
        typicalTraffic: 'Moderate',
        bestApproach: 'I-95 Exit 78'
      },
      rideShare: {
        pickupZone: 'Arthur Ashe Blvd',
        dropoffZone: 'Same',
        surgePricing: '2x after games',
        alternativeTip: 'Walk to Boulevard for easier pickup'
      }
    },
    
    history: {
      timeline: [
        { year: 1985, event: 'The Diamond opens' },
        { year: 2010, event: 'Flying Squirrels arrive' }
      ],
      traditions: [
        { name: 'Nutzy\'s Nuts', description: 'Mascot peanut toss' },
        { name: 'Friday Fireworks', description: 'Summer tradition' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Fun, quirky Flying Squirrels theme',
      bestExperiences: [
        'Friday fireworks',
        'Nutzy mascot antics',
        'Local beer selection',
        'BBQ options'
      ],
      traditions: ['Go Nuts chant', 'Nutzy\'s antics'],
      music: 'Mix of classic and modern',
      mascot: { name: 'Nutzy', description: 'Flying squirrel mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Scott\'s Addition breweries before games',
        'Party Plaza for social atmosphere',
        'Thursday Thirsty deals',
        'Friday games most crowded'
      ],
      avoidThese: [
        'Right field on hot days',
        'Parking lot traffic after fireworks'
      ],
      hiddenGems: [
        'Local brewery selection',
        'Scott\'s Addition dining',
        'Buz and Ned\'s BBQ stand'
      ],
      photoSpots: [
        'With Nutzy',
        'Party Plaza',
        'Diamond entrance sign'
      ],
      bestValue: [
        'General admission',
        'Thursday promotions',
        'Group packages'
      ]
    }
  },

  'binghamton-rumble-ponies': {
    id: 'binghamton-rumble-ponies',
    name: 'Mirabito Stadium',
    team: 'Binghamton Rumble Ponies',
    opened: 1992,
    capacity: 6012,
    
    overview: {
      description: 'Mirabito Stadium sits in the Southern Tier of New York, offering intimate baseball with carousel-themed entertainment and stunning views of the surrounding Appalachian foothills.',
      highlights: [
        'Carousel-themed entertainment',
        'Appalachian foothills backdrop',
        'Intimate atmosphere',
        'Family-friendly environment'
      ],
      uniqueFeatures: [
        'Rowdy the Rumble Pony mascot',
        'Carousel behind first base',
        'Picnic pavilion',
        'Kids Fun Zone',
        'Party deck areas'
      ],
      renovations: [
        { year: 2017, description: 'Rumble Ponies rebrand and upgrades' },
        { year: 2020, description: 'New LED lighting' }
      ],
      previousNames: ['NYSEG Stadium (1992-2016)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 1-7 behind home plate'],
        afternoon: ['Third base side sections 8-14', 'Covered picnic areas'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Luxury suites', 'Picnic pavilion'],
      shadeTips: [
        'Third base side best for afternoon',
        'Picnic pavilion fully covered',
        'Upper rows provide some shade',
        'Upstate NY weather varies greatly'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services'],
        shadedConcourses: ['Main concourse partially covered'],
        indoorAreas: ['Suite level', 'Team Store']
      },
      worstSunExposure: ['Right field bleachers', 'Sections 15-20'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 48, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool and wet', shadeTip: 'Dress warm' },
        { month: 'May', avgTemp: 60, avgHumidity: 65, rainChance: 30, typicalConditions: 'Spring weather', shadeTip: 'Layers needed' },
        { month: 'June', avgTemp: 69, avgHumidity: 70, rainChance: 30, typicalConditions: 'Pleasant', shadeTip: 'Shade for day games' },
        { month: 'July', avgTemp: 73, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm days', shadeTip: 'Third base side ideal' },
        { month: 'August', avgTemp: 72, avgHumidity: 70, rainChance: 25, typicalConditions: 'Continued warmth', shadeTip: 'Evening games comfortable' },
        { month: 'September', avgTemp: 64, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Comfortable most areas' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Bullpen Club', perks: ['All-inclusive food/drinks', 'Field level'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Right field deck', capacity: 100 },
          { name: 'Picnic Pavilion', description: 'Left field covered area', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats'],
      familySections: ['Sections 1-3'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        { name: 'Party Deck', capacity: '100', amenities: ['Bar', 'Tables'] },
        { name: 'Picnic Pavilion', capacity: '200', amenities: ['Covered seating', 'BBQ options'] }
      ],
      tips: [
        { section: 'Sections 1-7', tip: 'Best overall views', category: 'view' },
        { section: 'Picnic Pavilion', tip: 'Great for groups', category: 'experience' },
        { section: 'Third base side', tip: 'Afternoon shade', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Spiedie sandwich', 'Carousel cookies', 'Local craft beers'],
      local: ['Lupo\'s spiedies', 'Nirchi\'s pizza', 'Local breweries'],
      healthy: ['Salads', 'Grilled options'],
      vegetarian: ['Veggie burgers', 'Salads'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Galaxy Brewing', 'Water Street Brewing'],
        wine: true,
        cocktails: false,
        localBreweries: ['Galaxy', 'Water Street', 'Beer Tree']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lot', distance: 'Adjacent', price: 'Free', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '5 min walk', price: 'Free', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['BC Transit buses'],
        rideShare: 'Main entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Henry Street', bestFor: ['All sections'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store', exclusive: ['Rumble Ponies gear'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true },
      kidZones: [
        { name: 'Fun Zone', location: 'Behind first base', activities: ['Playground', 'Carousel'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Available to suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available near main gate'
    },
    
    gameDay: {
      tips: [
        { title: 'Try spiedies', description: 'Local specialty sandwich', category: 'food' },
        { title: 'Carousel rides', description: 'Kids love the carousel', category: 'family' },
        { title: 'Free parking', description: 'Arrive early for best spots', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:35 PM weekdays, 6:05 PM Saturdays, 1:05 PM Sundays',
        rushHours: ['5:00-6:00 PM on Route 17']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Johnson City',
      description: 'Historic carousel capital',
      beforeGame: ['Lost Dog Cafe', 'Cortese Restaurant'],
      afterGame: ['Downtown Binghamton bars'],
      radius: '1-2 miles'
    },
    
    transportation: {
      address: '211 Henry St, Binghamton, NY 13901',
      publicTransit: {
        bus: [{ routes: ['BC Transit'], stops: ['Stadium stop'] }]
      },
      driving: {
        majorRoutes: ['I-81 to Route 17', 'Route 201 exit'],
        typicalTraffic: 'Light',
        bestApproach: 'Route 17 to Route 201'
      },
      rideShare: {
        pickupZone: 'Main entrance',
        dropoffZone: 'Same',
        surgePricing: 'Minimal',
        alternativeTip: 'Downtown for more options'
      }
    },
    
    history: {
      timeline: [
        { year: 1992, event: 'Stadium opens' },
        { year: 2017, event: 'Become Rumble Ponies' }
      ],
      traditions: [
        { name: 'Carousel Heritage', description: 'Celebrating local carousel history' },
        { name: 'Rowdy antics', description: 'Mascot entertainment' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly with carousel theme',
      bestExperiences: [
        'Carousel rides',
        'Spiedie sandwiches',
        'Rowdy mascot',
        'Fireworks nights'
      ],
      traditions: ['Carousel music', 'Rowdy races'],
      music: 'Classic ballpark with carousel sounds',
      mascot: { name: 'Rowdy', description: 'Rumble Pony mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Free parking everywhere',
        'Spiedies are must-try',
        'Carousel perfect for kids',
        'Thursday deals best value'
      ],
      avoidThese: [
        'Right field on sunny days',
        'Limited concessions late'
      ],
      hiddenGems: [
        'Local spiedie stand',
        'Carousel behind first base',
        'Galaxy Brewing beers'
      ],
      photoSpots: [
        'Carousel',
        'With Rowdy',
        'Hills backdrop'
      ],
      bestValue: [
        'General admission',
        'Thursday promotions',
        'Free parking'
      ]
    }
  },

  'harrisburg-senators': {
    id: 'harrisburg-senators',
    name: 'FNB Field',
    team: 'Harrisburg Senators',
    opened: 1987,
    capacity: 6187,
    
    overview: {
      description: 'FNB Field on City Island in the Susquehanna River offers one of Minor League Baseball\'s most unique settings, accessible only by bridge with stunning river and skyline views.',
      highlights: [
        'City Island location',
        'Susquehanna River views',
        'Harrisburg skyline backdrop',
        'Bridge access only'
      ],
      uniqueFeatures: [
        'Island ballpark setting',
        'Riverboat landing nearby',
        'Beach area behind outfield',
        'Boardwalk',
        'Mini golf and attractions'
      ],
      renovations: [
        { year: 2010, description: 'Major renovations and boardwalk' },
        { year: 2018, description: 'New video board' }
      ],
      previousNames: ['Riverside Stadium (1987-2004)', 'Commerce Bank Park (2005-2009)', 'Metro Bank Park (2010-2015)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-108 behind home plate'],
        afternoon: ['Third base side 109-115', 'Picnic areas'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Suites', 'Picnic pavilions'],
      shadeTips: [
        'Third base side for afternoon',
        'Boardwalk has shaded areas',
        'River breeze helps cooling',
        'Pennsylvania summers humid'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Suite level', 'Team Store']
      },
      worstSunExposure: ['Right field sections', 'Lawn seating'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 54, avgHumidity: 60, rainChance: 30, typicalConditions: 'Cool spring', shadeTip: 'Layers needed' },
        { month: 'May', avgTemp: 65, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant', shadeTip: 'Afternoon shade helpful' },
        { month: 'June', avgTemp: 74, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warming up', shadeTip: 'Shade important' },
        { month: 'July', avgTemp: 79, avgHumidity: 70, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Third base or pavilions' },
        { month: 'August', avgTemp: 77, avgHumidity: 70, rainChance: 25, typicalConditions: 'Continued heat', shadeTip: 'River breeze helps' },
        { month: 'September', avgTemp: 70, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Comfortable evenings' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Senators Club', perks: ['All-inclusive food/drinks'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'AC']
        },
        specialAreas: [
          { name: 'Boardwalk', description: 'Left field boardwalk', capacity: 200 },
          { name: 'Picnic Pavilions', description: 'Various locations', capacity: 300 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved'],
      familySections: ['Sections 200-202'],
      standingRoom: ['Boardwalk', 'Concourse'],
      partyAreas: [
        { name: 'Boardwalk', capacity: '200', amenities: ['Bar', 'Standing room'] },
        { name: 'Picnic Pavilions', capacity: '50-100 each', amenities: ['Covered seating', 'Group areas'] }
      ],
      tips: [
        { section: 'Sections 101-108', tip: 'Best views', category: 'view' },
        { section: 'Boardwalk', tip: 'Social atmosphere', category: 'experience' },
        { section: 'Third base side', tip: 'Afternoon shade', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Senators Dog', 'Crab fries', 'Local beers'],
      local: ['PA Dutch treats', 'Hershey ice cream', 'Local breweries'],
      healthy: ['Salads', 'Grilled options'],
      vegetarian: ['Veggie options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Troegs', 'Appalachian Brewing', 'Lancaster Brewing'],
        wine: true,
        cocktails: true,
        localBreweries: ['Troegs', 'ABC', 'Zeroday']
      }
    },
    
    parking: {
      lots: [
        { name: 'City Island Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown garages', distance: 'Walk across bridge', price: '$5-10', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['CAT bus to downtown'],
        rideShare: 'Island entrance',
        bicycle: 'Bike racks on island'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'City Island entrance', bestFor: ['All sections'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store', exclusive: ['Senators gear'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Play Area', location: 'Behind stands', activities: ['Playground', 'Games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['To suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available in main lot'
    },
    
    gameDay: {
      tips: [
        { title: 'Walk the boardwalk', description: 'Great river views', category: 'experience' },
        { title: 'Arrive early', description: 'Island parking fills up', category: 'arrival' },
        { title: 'Explore island', description: 'Mini golf and more', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:30 PM weekdays, 6:00 PM Saturdays, 1:00 PM Sundays',
        rushHours: ['5:00-6:00 PM bridge traffic']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'City Island',
      description: 'Recreation island in Susquehanna',
      beforeGame: ['Downtown Harrisburg restaurants', 'Island attractions'],
      afterGame: ['Downtown bars', '2nd Street nightlife'],
      radius: 'Bridge to downtown'
    },
    
    transportation: {
      address: 'FNB Field, City Island, Harrisburg, PA 17101',
      publicTransit: {
        bus: [{ routes: ['CAT buses'], stops: ['Downtown, walk bridge'] }]
      },
      driving: {
        majorRoutes: ['I-83 to downtown', 'Market St Bridge to island'],
        typicalTraffic: 'Bridge can back up',
        bestApproach: 'Market Street Bridge'
      },
      rideShare: {
        pickupZone: 'Island entrance',
        dropoffZone: 'Same',
        surgePricing: '2x after games',
        alternativeTip: 'Walk to downtown for pickup'
      }
    },
    
    history: {
      timeline: [
        { year: 1987, event: 'Stadium opens on City Island' },
        { year: 2010, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Splash Zone', description: 'Home runs can reach river' },
        { name: 'Fireworks', description: 'Over the river' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Unique island setting with family fun',
      bestExperiences: [
        'River views',
        'Boardwalk strolls',
        'Island attractions',
        'Fireworks over water'
      ],
      traditions: ['Splash zone homers', 'Island time'],
      music: 'Classic ballpark mix',
      mascot: { name: 'Rascal', description: 'Raccoon mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Park downtown and walk bridge',
        'Explore island before game',
        'Boardwalk great for kids',
        'Thursday deals'
      ],
      avoidThese: [
        'Island parking on fireworks nights',
        'Right field in afternoon sun'
      ],
      hiddenGems: [
        'Beach area behind outfield',
        'Mini golf on island',
        'Troegs beer selection'
      ],
      photoSpots: [
        'Boardwalk with river',
        'Skyline backdrop',
        'Bridge views'
      ],
      bestValue: [
        'Lawn seating',
        'Thursday promotions',
        'Downtown parking'
      ]
    }
  },

  'portland-sea-dogs': {
    id: 'portland-sea-dogs',
    name: 'Hadlock Field',
    team: 'Portland Sea Dogs',
    opened: 1994,
    capacity: 7368,
    
    overview: {
      description: 'Hadlock Field in Portland features the iconic Maine Monster (Green Monster replica), lighthouse, and ship mast, creating one of Minor League Baseball\'s most distinctive and beloved venues.',
      highlights: [
        'Maine Monster wall',
        'Portland lighthouse',
        'Ship mast in center',
        'Casco Bay proximity'
      ],
      uniqueFeatures: [
        '37-foot Maine Monster',
        'Lighthouse behind left field',
        'Ship mast with crows nest',
        'Sea Dog Biscuits concession',
        'Picnic areas'
      ],
      renovations: [
        { year: 2003, description: 'Maine Monster added' },
        { year: 2014, description: 'Major upgrades for 20th anniversary' },
        { year: 2021, description: 'New video board' }
      ],
      previousNames: []
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 100-106 behind home plate'],
        afternoon: ['Third base side 107-112', 'Under roof sections'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Suites', 'Upper pavilion'],
      shadeTips: [
        'Third base side for afternoon',
        'Maine weather can be cool',
        'Sea breeze provides cooling',
        'Upper rows have overhang'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Suite level', 'Sluggers Team Store']
      },
      worstSunExposure: ['Right field bleachers', 'Maine Monster seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 48, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool and damp', shadeTip: 'Dress warm' },
        { month: 'May', avgTemp: 58, avgHumidity: 65, rainChance: 30, typicalConditions: 'Spring weather', shadeTip: 'Layers essential' },
        { month: 'June', avgTemp: 68, avgHumidity: 70, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Perfect baseball weather' },
        { month: 'July', avgTemp: 74, avgHumidity: 70, rainChance: 20, typicalConditions: 'Warm days', shadeTip: 'Shade helpful afternoons' },
        { month: 'August', avgTemp: 73, avgHumidity: 70, rainChance: 20, typicalConditions: 'Best weather', shadeTip: 'Comfortable most areas' },
        { month: 'September', avgTemp: 65, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Evening games cool' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Shipyard Club', perks: ['All-inclusive food/drinks', 'Indoor/outdoor'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Maine Monster seats', description: 'On top of wall', capacity: 50 },
          { name: 'Picnic Areas', description: 'Various locations', capacity: 300 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats'],
      familySections: ['Sections 200-202'],
      standingRoom: ['Concourse', 'Behind Monster'],
      partyAreas: [
        { name: 'Maine Monster seats', capacity: '50', amenities: ['Unique view', 'Bar service'] },
        { name: 'Picnic Areas', capacity: 'Various', amenities: ['Group seating', 'Food packages'] }
      ],
      tips: [
        { section: 'Maine Monster seats', tip: 'Unique experience', category: 'experience' },
        { section: 'Sections 100-106', tip: 'Best overall views', category: 'view' },
        { section: 'Third base side', tip: 'Afternoon shade', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Sea Dog Biscuits', 'Lobster rolls', 'Whoopie pies'],
      local: ['Maine lobster', 'Shipyard beer', 'Local seafood'],
      healthy: ['Salads', 'Grilled seafood'],
      vegetarian: ['Veggie options', 'Salads'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Shipyard', 'Allagash', 'Sea Dog Brewing'],
        wine: true,
        cocktails: true,
        localBreweries: ['Shipyard', 'Allagash', 'Rising Tide', 'Bissell Brothers']
      }
    },
    
    parking: {
      lots: [
        { name: 'Hadlock Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'Fitzpatrick Stadium', distance: '5 min walk', price: '$3', shadedSpots: false, covered: false },
        { name: 'Street parking', distance: 'Various', price: 'Free after 6PM', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['METRO bus routes'],
        rideShare: 'Park Avenue entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Park Avenue', bestFor: ['All sections'], openTime: '60 minutes before first pitch' },
      { name: 'Right Field Gate', location: 'Right field corner', bestFor: ['Bleachers', 'Picnic areas'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Sluggers Team Store', exclusive: ['Sea Dogs gear', 'Maine Monster items'] }
      ],
      firstAid: ['Behind section 105'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true, network: 'SeaDogs_WiFi' },
      kidZones: [
        { name: 'Kids Fun Zone', location: 'Right field', activities: ['Playground', 'Games', 'Bounce house'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['To suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available near main gate'
    },
    
    gameDay: {
      tips: [
        { title: 'Try Sea Dog Biscuits', description: 'Ice cream sandwich specialty', category: 'food' },
        { title: 'Lobster roll', description: 'Maine specialty', category: 'food' },
        { title: 'Monster seats', description: 'Unique experience', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:00 PM weekdays, 6:00 PM Saturdays, 1:00 PM Sundays',
        rushHours: ['5:00-6:00 PM on Park Ave']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks except sealed water', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Deering',
      description: 'Residential Portland neighborhood',
      beforeGame: ['Old Port restaurants', 'Back Cove trail'],
      afterGame: ['Old Port bars', 'Downtown Portland'],
      radius: '2 miles to Old Port'
    },
    
    transportation: {
      address: '271 Park Ave, Portland, ME 04102',
      publicTransit: {
        bus: [{ routes: ['METRO various routes'], stops: ['Park Avenue'] }]
      },
      driving: {
        majorRoutes: ['I-295 to Exit 6B', 'Route 1 to Park Ave'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-295 to Forest Ave to Park Ave'
      },
      rideShare: {
        pickupZone: 'Park Avenue',
        dropoffZone: 'Same',
        surgePricing: '2x after games',
        alternativeTip: 'Walk to Forest Ave for easier pickup'
      }
    },
    
    history: {
      timeline: [
        { year: 1994, event: 'Hadlock Field opens' },
        { year: 2003, event: 'Maine Monster constructed' },
        { year: 2021, event: 'Return of fans after pandemic' }
      ],
      traditions: [
        { name: 'Slugger\'s Birthday', description: 'Annual mascot celebration' },
        { name: 'Bean Suppers', description: 'Maine tradition' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Intimate New England charm with unique features',
      bestExperiences: [
        'Maine Monster seats',
        'Sea Dog Biscuits',
        'Lighthouse view',
        'Local beer selection'
      ],
      traditions: ['Slugger antics', 'L.L. Bean boot race'],
      music: 'Classic ballpark with local flair',
      mascot: { name: 'Slugger', description: 'Sea dog mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Monster seats sell out fast',
        'Try local breweries',
        'Street parking free after 6',
        'Sea Dog Biscuits must-try'
      ],
      avoidThese: [
        'Right field on sunny days',
        'Parking lot after fireworks'
      ],
      hiddenGems: [
        'Shipyard beer selection',
        'Lobster rolls at concessions',
        'View from Monster seats'
      ],
      photoSpots: [
        'Maine Monster',
        'Lighthouse',
        'Ship mast',
        'With Slugger'
      ],
      bestValue: [
        'General admission',
        'Thursday deals',
        'Street parking'
      ]
    }
  },

  'somerset-patriots': {
    id: 'somerset-patriots',
    name: 'TD Bank Ballpark',
    team: 'Somerset Patriots',
    opened: 1999,
    capacity: 6100,
    
    overview: {
      description: 'TD Bank Ballpark in central New Jersey offers an intimate setting with modern amenities, having transitioned from independent ball to Yankees Double-A affiliate with significant upgrades.',
      highlights: [
        'Yankees affiliate since 2021',
        'Modern amenities',
        'Central Jersey location',
        'Family entertainment focus'
      ],
      uniqueFeatures: [
        'Kids Kingdom playground',
        'Picnic Grove',
        'Party Deck',
        'Somerset Patriots Hall of Fame',
        'Inflatable fun zone'
      ],
      renovations: [
        { year: 2021, description: 'Yankees affiliation upgrades' },
        { year: 2022, description: 'New clubhouse facilities' }
      ],
      previousNames: ['Commerce Bank Ballpark (1999-2007)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 201-206 behind home plate'],
        afternoon: ['Third base side 207-212', 'Upper deck'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Suites', 'Club level overhang'],
      shadeTips: [
        'Third base side best afternoon',
        'Upper deck provides shade below',
        'New Jersey humidity factor',
        'Party Deck has umbrellas'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Champions Club', 'Team Store']
      },
      worstSunExposure: ['Right field sections', 'Sections 213-218'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 60, rainChance: 30, typicalConditions: 'Variable spring', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 66, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant', shadeTip: 'Comfortable conditions' },
        { month: 'June', avgTemp: 75, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warming up', shadeTip: 'Shade becoming important' },
        { month: 'July', avgTemp: 80, avgHumidity: 70, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck or third base' },
        { month: 'August', avgTemp: 79, avgHumidity: 70, rainChance: 25, typicalConditions: 'Peak summer', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 71, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Comfortable most areas' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Champions Club', perks: ['All-inclusive food/drinks', 'Climate control'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Left field deck', capacity: 150 },
          { name: 'Picnic Grove', description: 'Right field picnic area', capacity: 200 }
        ]
      },
      budgetOptions: ['Reserved bleachers', 'General admission'],
      familySections: ['Sections 101-103'],
      standingRoom: ['Party Deck', 'Concourse'],
      partyAreas: [
        { name: 'Party Deck', capacity: '150', amenities: ['Bar', 'Tables', 'TV monitors'] },
        { name: 'Picnic Grove', capacity: '200', amenities: ['Picnic tables', 'BBQ options'] }
      ],
      tips: [
        { section: 'Sections 201-206', tip: 'Best views behind plate', category: 'view' },
        { section: 'Party Deck', tip: 'Social atmosphere', category: 'experience' },
        { section: 'Third base side', tip: 'Afternoon shade', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Jersey Mike\'s subs', 'Pork roll sandwich', 'Local craft beers'],
      local: ['Jersey Mike\'s', 'Tony\'s Brick Oven Pizza', 'NJ craft beers'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Salads', 'Pizza'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin\' Dots'],
      alcohol: {
        beer: ['River Horse', 'Kane Brewing', 'Carton Brewing'],
        wine: true,
        cocktails: true,
        localBreweries: ['River Horse', 'Kane', 'Carton', 'Twin Elephant']
      }
    },
    
    parking: {
      lots: [
        { name: 'Main Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '5 min walk', price: '$5', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['NJ Transit bus from Somerville station'],
        rideShare: 'Main entrance drop-off',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Route 287 side', bestFor: ['All sections'], openTime: '60 minutes before first pitch' },
      { name: 'Right Field Gate', location: 'Parking lot side', bestFor: ['Picnic Grove'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Patriots Team Store', exclusive: ['Yankees affiliate gear'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['All family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true, network: 'TD_Bank_WiFi' },
      kidZones: [
        { name: 'Kids Kingdom', location: 'Behind right field', activities: ['Playground', 'Inflatables', 'Speed pitch'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['To all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available near main gate'
    },
    
    gameDay: {
      tips: [
        { title: 'Yankees prospects', description: 'See future Yankees stars', category: 'experience' },
        { title: 'Kids Kingdom', description: 'Great for families', category: 'family' },
        { title: 'Pork roll', description: 'NJ specialty', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:35 PM weekdays, 6:05 PM Saturdays, 1:05 PM Sundays',
        rushHours: ['5:00-6:30 PM on Route 287']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Bridgewater',
      description: 'Central Jersey suburban area',
      beforeGame: ['Chimney Rock Inn', 'Cafe Emilia', 'Red Lobster'],
      afterGame: ['Bridgewater Commons Mall area'],
      radius: '2-3 miles'
    },
    
    transportation: {
      address: '1 Patriots Park, Bridgewater, NJ 08807',
      publicTransit: {
        bus: [{ routes: ['NJ Transit from Somerville'], stops: ['Stadium'] }]
      },
      driving: {
        majorRoutes: ['Route 287 Exit 13B', 'Route 22 to 287'],
        typicalTraffic: 'Can be heavy on 287',
        bestApproach: 'Route 287 Exit 13B'
      },
      rideShare: {
        pickupZone: 'Main entrance',
        dropoffZone: 'Same',
        surgePricing: '1.5-2x after games',
        alternativeTip: 'Schedule in advance'
      }
    },
    
    history: {
      timeline: [
        { year: 1999, event: 'Stadium opens for independent Patriots' },
        { year: 2021, event: 'Become Yankees Double-A affiliate' }
      ],
      traditions: [
        { name: 'Sparkee\'s antics', description: 'Mascot entertainment' },
        { name: 'Saturday fireworks', description: 'Summer tradition' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly with Yankees connection',
      bestExperiences: [
        'Yankees prospects',
        'Kids Kingdom',
        'Saturday fireworks',
        'Party Deck atmosphere'
      ],
      traditions: ['Sparkee mascot', 'Yankees chants'],
      music: 'Mix with Yankees traditions',
      mascot: { name: 'Sparkee', description: 'Patriot mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Check Yankees rehab assignments',
        'Kids Kingdom perfect for families',
        'Party Deck for social scene',
        'Affordable parking'
      ],
      avoidThese: [
        'Route 287 traffic at rush hour',
        'Right field on hot afternoons'
      ],
      hiddenGems: [
        'Local craft beer selection',
        'Pork roll sandwich',
        'Yankees memorabilia displays'
      ],
      photoSpots: [
        'Yankees logo backdrop',
        'With Sparkee',
        'Kids Kingdom'
      ],
      bestValue: [
        'Reserved bleachers',
        'Tuesday deals',
        'Family packages'
      ]
    }
  },

  'altoona-curve': {
    id: 'altoona-curve',
    name: 'Peoples Natural Gas Field',
    team: 'Altoona Curve',
    opened: 1999,
    capacity: 7210,
    
    overview: {
      description: 'Peoples Natural Gas Field sits beneath the Allegheny Mountains with a unique roller coaster beyond the outfield fence, creating one of Minor League Baseball\'s most distinctive backdrops.',
      highlights: [
        'Skyliner roller coaster view',
        'Mountain backdrop',
        'Pirates Double-A affiliate',
        'Award-winning design'
      ],
      uniqueFeatures: [
        'Roller coaster beyond right field',
        'Curve Cove picnic area',
        'Speed pitch game',
        'Kids play area',
        'Allegheny Mountain views'
      ],
      renovations: [
        { year: 2006, description: 'Curve Cove addition' },
        { year: 2017, description: 'New video board' },
        { year: 2022, description: 'Clubhouse renovations' }
      ],
      previousNames: ['Blair County Ballpark (1999-2009)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-108 behind home plate'],
        afternoon: ['Third base side 109-115', 'Club level'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Suites', 'Club level overhang'],
      shadeTips: [
        'Mountain shade varies by season',
        'Third base side best afternoon',
        'Pennsylvania weather variable',
        'Curve Cove has covered areas'
      ],
      sunProtection: {
        sunscreenStations: ['First Aid station'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Club level', 'Team Store']
      },
      worstSunExposure: ['Right field bleachers', 'Sections 116-120'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 60, rainChance: 30, typicalConditions: 'Cool spring', shadeTip: 'Dress warm' },
        { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 30, typicalConditions: 'Variable', shadeTip: 'Layers recommended' },
        { month: 'June', avgTemp: 72, avgHumidity: 70, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Shade helpful afternoons' },
        { month: 'July', avgTemp: 76, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm', shadeTip: 'Seek shade for day games' },
        { month: 'August', avgTemp: 75, avgHumidity: 70, rainChance: 25, typicalConditions: 'Continued warmth', shadeTip: 'Third base side best' },
        { month: 'September', avgTemp: 67, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling', shadeTip: 'Comfortable most areas' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive food/drinks', 'Waitstaff'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Curve Cove', description: 'Right field picnic area', capacity: 250 },
          { name: 'Rail Kings Club', description: 'Left field deck', capacity: 100 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats'],
      familySections: ['Sections 200-202'],
      standingRoom: ['Concourse', 'Rail Kings Club'],
      partyAreas: [
        { name: 'Curve Cove', capacity: '250', amenities: ['Picnic tables', 'Private concessions'] },
        { name: 'Rail Kings Club', capacity: '100', amenities: ['Standing room', 'Bar area'] }
      ],
      tips: [
        { section: 'Sections 101-108', tip: 'Best views', category: 'view' },
        { section: 'Curve Cove', tip: 'Great for groups', category: 'experience' },
        { section: 'Right field', tip: 'Roller coaster views', category: 'view' }
      ]
    },
    
    concessions: {
      signature: ['Curve burger', 'Pierogi', 'Sheetz items'],
      local: ['Altoona-style pizza', 'PA Dutch treats', 'Local beers'],
      healthy: ['Salads', 'Grilled options'],
      vegetarian: ['Veggie options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Cotton candy'],
      alcohol: {
        beer: ['Straub', 'Yuengling', 'Local craft options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Straub', 'Marzoni\'s Brick Oven']
      }
    },
    
    parking: {
      lots: [
        { name: 'Main Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'Lakemont Park', distance: '5 min walk', price: '$3', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['Limited AMTRAN service'],
        rideShare: 'Park Boulevard entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Park Avenue', bestFor: ['All sections'], openTime: '60 minutes before first pitch' },
      { name: 'Right Field Gate', location: 'Curve Cove entrance', bestFor: ['Picnic areas'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Curve Team Store', exclusive: ['Curve gear', 'Pirates items'] }
      ],
      firstAid: ['Behind section 106'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Behind stands', activities: ['Playground', 'Speed pitch'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas all levels'],
        entrance: 'All gates accessible',
        elevators: ['To club level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available near main gate'
    },
    
    gameDay: {
      tips: [
        { title: 'Roller coaster runs', description: 'Watch from right field', category: 'experience' },
        { title: 'Try pierogi', description: 'Local favorite', category: 'food' },
        { title: 'Lakemont Park', description: 'Combo tickets available', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:00 PM weekdays, 6:00 PM Saturdays, 1:00 PM Sundays',
        rushHours: ['5:00-6:00 PM on Route 220']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Lakemont',
      description: 'Near Lakemont Park amusement park',
      beforeGame: ['Park Hills Plaza restaurants', 'Downtown Altoona'],
      afterGame: ['Lakemont Park', 'Downtown bars'],
      radius: '2-3 miles'
    },
    
    transportation: {
      address: '1000 Park Ave, Altoona, PA 16602',
      publicTransit: {
        bus: [{ routes: ['AMTRAN limited'], stops: ['Lakemont'] }]
      },
      driving: {
        majorRoutes: ['I-99 to Route 220', 'Route 36 to Park Ave'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'Route 220 to Park Ave'
      },
      rideShare: {
        pickupZone: 'Main entrance',
        dropoffZone: 'Same',
        surgePricing: 'Minimal',
        alternativeTip: 'Limited availability'
      }
    },
    
    history: {
      timeline: [
        { year: 1999, event: 'Stadium opens' },
        { year: 1999, event: 'Pirates affiliation begins' }
      ],
      traditions: [
        { name: 'Roller coaster home runs', description: 'Balls hit to coaster' },
        { name: 'Curve racing', description: 'Mascot races' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Unique setting with amusement park backdrop',
      bestExperiences: [
        'Roller coaster views',
        'Mountain scenery',
        'Curve Cove parties',
        'Fireworks nights'
      ],
      traditions: ['Curve mascot races', 'Roller coaster cheers'],
      music: 'Classic ballpark mix',
      mascot: { name: 'Steamer', description: 'Train engineer mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Combo tickets with Lakemont Park',
        'Right field for coaster views',
        'Curve Cove great for groups',
        'Thursday promotions'
      ],
      avoidThese: [
        'Right field bleachers in sun',
        'Limited late concessions'
      ],
      hiddenGems: [
        'Roller coaster photo ops',
        'Mountain views at sunset',
        'Local pizza options'
      ],
      photoSpots: [
        'With roller coaster backdrop',
        'Mountain views',
        'With Steamer mascot'
      ],
      bestValue: [
        'General admission',
        'Lakemont combo tickets',
        'Thursday deals'
      ]
    }
  }
};

export default aaStadiumGuides;