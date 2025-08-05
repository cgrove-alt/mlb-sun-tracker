import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides5: Record<string, StadiumGuide> = {
  'frisco-roughriders': {
    id: 'frisco-roughriders',
    name: 'Riders Field',
    team: 'Frisco RoughRiders',
    opened: 2003,
    capacity: 10316,

    overview: {
      description: 'Riders Field in Frisco, Texas, is one of the premier Double-A facilities in the country, serving as the Rangers Double-A affiliate with state-of-the-art amenities and Texas-sized hospitality.',
      highlights: [
        'One of largest Double-A stadiums',
        'Rangers Double-A affiliate',
        'State-of-the-art facility',
        'Texas Rangers connection',
        'Modern North Texas location'
      ],
      uniqueFeatures: [
        'Lazy River beyond outfield (at adjacent complex)',
        'Multiple premium seating options',
        'Natural grass field',
        'Large capacity for Double-A',
        'Texas Rangers organizational displays'
      ],
      renovations: [
        { year: 2008, description: 'Concourse expansion and improvements' },
        { year: 2014, description: 'LED lighting system installation' },
        { year: 2019, description: 'Clubhouse and training facility upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['300 level', 'Suite Level', 'Club Level'],
        afternoon: ['306-312', 'Suite Level', 'Berm'],
        evening: ['203-207', '300 level']
      },
      coveredSeating: ['300 level', 'Suite Level', 'Club Level'],
      shadeTips: [
        'Upper deck essential for Texas heat',
        'Third base side gets better afternoon shade',
        'Multiple premium levels offer climate control',
        'Berm has some shade structures'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse', 'Club concourse'],
        indoorAreas: ['Club level', 'Suite level', 'Team store', 'Restaurants'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['201-205', '101-107', 'Right field berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 72, avgHumidity: 60, rainChance: 30, typicalConditions: 'Pleasant spring weather', shadeTip: 'Comfortable in most seating areas' },
        { month: 'May', avgTemp: 80, avgHumidity: 65, rainChance: 35, typicalConditions: 'Warm with occasional storms', shadeTip: 'Afternoon shade becomes valuable' },
        { month: 'June', avgTemp: 88, avgHumidity: 65, rainChance: 25, typicalConditions: 'Hot and dry', shadeTip: 'Upper deck strongly recommended' },
        { month: 'July', avgTemp: 93, avgHumidity: 60, rainChance: 20, typicalConditions: 'Very hot', shadeTip: 'Covered seating essential' },
        { month: 'August', avgTemp: 93, avgHumidity: 58, rainChance: 25, typicalConditions: 'Peak heat', shadeTip: 'Climate-controlled areas preferred' },
        { month: 'September', avgTemp: 86, avgHumidity: 62, rainChance: 30, typicalConditions: 'Still hot but improving', shadeTip: 'Evening games much better' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Legacy Club',
            perks: ['Climate controlled', 'Premium dining', 'Full bar', 'Exclusive entrance'],
            access: 'Behind home plate with upscale Texas hospitality'
          },
          {
            name: 'Field Club',
            perks: ['Field-level seating', 'Premium service', 'Climate controlled lounge'],
            access: 'Field level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs', 'Private entrances']
        },
        specialAreas: [
          { name: 'Berm', description: 'Grassy seating area beyond outfield', capacity: 200 }
        ]
      },
      budgetOptions: ['Berm seating', '312-316', 'General admission'],
      familySections: ['Family sections', '208-212', 'Berm'],
      standingRoom: ['Concourse areas', 'Berm', 'Party decks'],
      partyAreas: [
        {
          name: 'Home Run Porch',
          capacity: '100',
          description: 'Right field party area',
          amenities: ['Standing room', 'Bar service', 'Group pricing']
        },
        {
          name: 'Left Field Pavilion',
          capacity: '75',
          description: 'Group seating with picnic tables',
          amenities: ['Picnic tables', 'Group menus', 'Shade structures']
        }
      ],
      tips: [
        { section: '201-207', tip: 'Best views of action and Rangers prospects', category: 'view' },
        { section: '300 level', tip: 'Great views with excellent shade protection', category: 'shade' },
        { section: 'Legacy Club', tip: 'Ultimate premium experience', category: 'experience' },
        { section: 'Berm', tip: 'Great value for families, Texas-style', category: 'value' },
        { section: '208-212', tip: 'Good family seating with amenities nearby', category: 'family' }
      ]
    },

    concessions: {
      signature: ['RoughRider Dog', 'Texas BBQ Brisket', 'Chicken Fried Steak', 'Blue Bell Ice Cream'],
      local: ['Texas BBQ', 'Tex-Mex', 'Chicken fried items', 'Blue Bell ice cream', 'Dr Pepper'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at main concession stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Blue Bell ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Shiner Bock', 'Local North Texas craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Tupps Brewery', '3 Nations Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Main Stadium Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'North Lot', distance: '300 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'VIP Parking', distance: '100 yards', price: '$20', shadedSpots: true, covered: false },
        { name: 'Premium Parking', distance: '50 yards', price: '$15', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking in area',
        tip: 'Stadium lots are the only parking option'
      },
      alternativeTransport: {
        publicTransit: ['DCTA bus service to Frisco'],
        rideShare: 'Uber and Lyft readily available',
        bicycle: 'Bike racks available at main entrance'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance behind home plate',
        bestFor: ['All seating areas', 'Team store', 'Premium areas'],
        openTime: '90 minutes before first pitch',
        tip: 'Primary entrance with largest team store and club access'
      },
      {
        name: 'Left Field Gate',
        location: 'Left field area',
        bestFor: ['Berm seating', 'Groups', 'Pavilion'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'RoughRiders Team Store', exclusive: ['RoughRiders gear', 'Rangers items', 'Texas-themed merchandise'] }
      ],
      firstAid: ['Main concourse behind home plate'],
      babyChanging: ['All restroom facilities'],
      nursingRooms: ['Guest services area'],
      atms: ['Main concourse', 'Club level', 'Suite level'],
      wifi: { available: true, network: 'RoughRiders' },
      chargingStations: ['Club level', 'Suite level', 'Main concourse'],
      kidZones: [
        { name: 'Kids Zone', location: 'Beyond right field', activities: ['Playground', 'Speed pitch', 'Interactive games', 'Bounce house'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['101-103', '201-203', '301-303'],
        entrance: 'All gates wheelchair accessible with ramps',
        elevators: ['Multiple locations to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels throughout facility'],
      accessibleConcessions: ['All major concession stands'],
      parkingSpaces: '30 spaces in main lot near entrance'
    },

    gameDay: {
      tips: [
        { title: 'Texas Heat Prep', description: 'Bring sun protection - Texas sun is intense', category: 'weather' },
        { title: 'Rangers Connection', description: 'Watch for future Rangers stars', category: 'experience' },
        { title: 'BBQ Experience', description: 'Try authentic Texas barbecue specialties', category: 'food' },
        { title: 'Premium Worth It', description: 'Climate control valuable in Texas heat', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: '45 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['45 minutes before first pitch', '7th inning stretch']
      },
      security: {
        allowedBags: 'Small bags allowed, subject to search',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },

    neighborhood: {
      name: 'Frisco',
      description: 'Rapidly growing North Texas suburb with family attractions',
      beforeGame: ['The Star (Cowboys headquarters)', 'Frisco Commons Park', 'Stonebriar Centre'],
      afterGame: ['Legacy West', 'Downtown Frisco Square', 'The Star entertainment'],
      radius: '10 miles'
    },

    transportation: {
      address: '7300 RoughRiders Trail, Frisco, TX 75034',
      publicTransit: {
        bus: [
          { routes: ['DCTA routes'], stops: ['Frisco area stops'] }
        ]
      },
      driving: {
        majorRoutes: ['Dallas North Tollway', 'Highway 121', 'Preston Road'],
        typicalTraffic: 'Heavy during Dallas rush hours',
        bestApproach: 'Dallas North Tollway to Main Street'
      },
      rideShare: {
        pickupZone: 'Main parking lot',
        dropoffZone: 'Home plate gate',
        surgePricing: 'Moderate to high due to Dallas area demand'
      }
    },

    history: {
      timeline: [
        { year: 2003, event: 'Riders Field opens' },
        { year: 2003, event: 'Frisco RoughRiders inaugural season' },
        { year: 2010, event: 'Hosted Texas League All-Star Game' },
        { year: 2020, event: 'Major facility and technology upgrades' }
      ],
      notableGames: [
        { date: '2003-04-17', description: 'First game in Riders Field history' },
        { date: '2010-06-29', description: 'Texas League All-Star Game' },
        { date: '2018-09-10', description: 'Texas League Championship clincher' }
      ],
      traditions: [
        { name: 'Texas Rangers Pride', description: 'Celebrating connection to Rangers organization' },
        { name: 'North Texas Growth', description: 'Representing rapidly growing Frisco community' }
      ]
    },

    fanExperience: {
      atmosphere: 'High-end Double-A experience with Texas hospitality and Rangers organizational pride',
      bestExperiences: [
        'Premium amenities rivaling major league facilities',
        'Future Rangers prospect watching',
        'Texas-style barbecue and hospitality',
        'Family-friendly North Texas setting'
      ],
      traditions: [
        'Rangers organizational pride events',
        'Texas-themed promotional nights',
        'Community appreciation celebrations'
      ],
      mascot: {
        name: 'Deuce',
        description: 'Armadillo mascot representing Texas heritage and RoughRiders brand'
      }
    },

    proTips: {
      insiderTips: [
        'Legacy Club worth the upgrade for Texas heat',
        'Try Texas BBQ brisket - authentic and delicious',
        '300 level offers best value with shade and views',
        'Evening games much more comfortable than day games'
      ],
      avoidThese: [
        'Don\'t underestimate Texas summer heat',
        'Avoid lower level day games in July/August',
        'Don\'t skip the Rangers organizational displays'
      ],
      hiddenGems: [
        'One of the best Double-A facilities in the country',
        'Rangers organizational history throughout facility',
        'High-quality Texas craft beer selection',
        'The Star (Cowboys facility) nearby for pre-game'
      ],
      photoSpots: [
        'Home plate with modern facility backdrop',
        'Rangers organizational displays',
        'Deuce mascot interactions',
        'Texas sunset from upper concourse'
      ],
      bestValue: [
        'Berm seating for Texas-style baseball experience',
        'Group packages with Texas BBQ included',
        '300 level season tickets with parking',
        'Evening games for comfortable weather'
      ]
    }
  },

  'hartford-yard-goats': {
    id: 'hartford-yard-goats',
    name: 'Dunkin\' Park',
    team: 'Hartford Yard Goats',
    opened: 2017,
    capacity: 6850,

    overview: {
      description: 'Dunkin\' Park is one of the newest ballparks in Minor League Baseball, located in downtown Hartford with stunning views of the Connecticut State Capitol and modern amenities throughout.',
      highlights: [
        'Newest ballpark in Eastern League (2017)',
        'Downtown Hartford location',
        'Connecticut State Capitol views',
        'Rockies Double-A affiliate',
        'Modern amenities and design'
      ],
      uniqueFeatures: [
        'State Capitol building visible from stadium',
        'Modern urban ballpark design',
        'Dunkin\' Donuts partnership throughout',
        'Natural grass field',
        'Connecticut-themed architecture'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['201', '202', '203', 'Suite Level'],
        afternoon: ['205', '206', '207', 'Party Deck'],
        evening: ['103', '104', '105', '201', '202']
      },
      coveredSeating: ['201', '202', '203', '204', '205', '206', 'Suite Level'],
      shadeTips: [
        'Upper deck provides excellent shade coverage',
        'New England weather can be variable',
        'Third base side gets better afternoon shade',
        'Modern design includes good sun protection'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Suite level', 'Team store', 'Restaurant areas'],
        sunscreenStations: ['Guest services', 'First aid station']
      },
      worstSunExposure: ['101', '102', '108', 'Right field deck areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 56, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool spring with rain', shadeTip: 'Dress warmly, limited sun exposure' },
        { month: 'May', avgTemp: 66, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable in most seating' },
        { month: 'June', avgTemp: 75, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warm and pleasant', shadeTip: 'Afternoon shade becomes helpful' },
        { month: 'July', avgTemp: 80, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Upper deck recommended for day games' },
        { month: 'August', avgTemp: 78, avgHumidity: 72, rainChance: 32, typicalConditions: 'Warm with humidity', shadeTip: 'Shade important for comfort' },
        { month: 'September', avgTemp: 71, avgHumidity: 68, rainChance: 30, typicalConditions: 'Pleasant fall weather', shadeTip: 'Very comfortable conditions' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Thomas Hooker Club',
            perks: ['Climate controlled', 'Premium food service', 'Full bar', 'Capitol views'],
            access: 'Behind home plate with Connecticut heritage theming'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering options', 'Climate control', 'Capitol views']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area with Hartford skyline views', capacity: 100 }
        ]
      },
      budgetOptions: ['General admission', '206', '207', 'Standing room'],
      familySections: ['Family sections', '204', '205'],
      standingRoom: ['Concourse areas', 'Party Deck'],
      partyAreas: [
        {
          name: 'Party Deck',
          capacity: '100',
          description: 'Group area with downtown Hartford views',
          amenities: ['Standing room', 'Bar service', 'City views']
        }
      ],
      tips: [
        { section: '101-103', tip: 'Best views of action and State Capitol', category: 'view' },
        { section: '201-203', tip: 'Great views with modern shade protection', category: 'shade' },
        { section: 'Thomas Hooker Club', tip: 'Premium experience with Connecticut hospitality', category: 'experience' },
        { section: 'Party Deck', tip: 'Unique urban ballpark atmosphere', category: 'experience' },
        { section: '104-106', tip: 'Good value with Capitol building views', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Yard Goat Dog', 'Connecticut Lobster Roll', 'Steamed Cheeseburger', 'Dunkin\' items'],
      local: ['Connecticut lobster rolls', 'Steamed cheeseburgers', 'New England clam chowder', 'Local craft beers'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at main concession stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Dunkin\' Donuts'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'New England craft beers', 'Thomas Hooker Brewing'],
        wine: true,
        cocktails: true,
        localBreweries: ['Thomas Hooker Brewing', 'City Steam Brewery']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '300 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Downtown Garages', distance: '0.2-0.5 miles', price: '$5-15', shadedSpots: true, covered: true },
        { name: 'Street Parking', distance: 'Variable', price: '$2-5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Meter parking until 8 PM weekdays',
        tip: 'Free evening and weekend street parking available'
      },
      alternativeTransport: {
        publicTransit: ['CT Transit bus service', 'Hartford Line train'],
        rideShare: 'Uber and Lyft readily available',
        bicycle: 'Bike racks available, downtown bike paths'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating areas', 'Team store'],
        openTime: '90 minutes before first pitch',
        tip: 'Primary entrance with team store and Capitol views'
      },
      {
        name: 'Outfield Gate',
        location: 'Right field area',
        bestFor: ['Party Deck', 'Groups'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Yard Goats Team Store', exclusive: ['Yard Goats gear', 'Rockies items', 'Connecticut-themed merchandise'] }
      ],
      firstAid: ['Main concourse behind home plate'],
      babyChanging: ['All restroom facilities'],
      atms: ['Main concourse', 'Suite level'],
      wifi: { available: true, network: 'YardGoats' },
      chargingStations: ['Suite level', 'Main concourse'],
      kidZones: [
        { name: 'Kids Zone', location: 'Beyond right field', activities: ['Playground', 'Speed pitch', 'Interactive games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['101', '102', '103', '201', '202'],
        entrance: 'All gates wheelchair accessible',
        elevators: ['Behind home plate to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All major stands'],
      parkingSpaces: '20 spaces in stadium lot'
    },

    gameDay: {
      tips: [
        { title: 'Capitol Views', description: 'Best photography of State Capitol from upper concourse', category: 'experience' },
        { title: 'New England Weather', description: 'Connecticut weather can change quickly', category: 'weather' },
        { title: 'Local Specialties', description: 'Try Connecticut steamed cheeseburger', category: 'food' },
        { title: 'Downtown Location', description: 'Walk to restaurants and attractions', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: '45 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before first pitch', '7th inning stretch']
      },
      security: {
        allowedBags: 'Small bags allowed, subject to search',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Downtown Hartford',
      description: 'Connecticut\'s capital city with government buildings and cultural attractions',
      beforeGame: ['Wadsworth Atheneum', 'Connecticut Science Center', 'Downtown restaurants'],
      afterGame: ['Downtown entertainment', 'XL Center events'],
      radius: '2 miles'
    },

    transportation: {
      address: '1214 Main St, Hartford, CT 06103',
      publicTransit: {
        train: [
          { lines: ['Hartford Line'], station: 'Hartford Union Station', walkTime: '10 minutes' }
        ],
        bus: [
          { routes: ['CT Transit routes'], stops: ['Downtown Hartford'] }
        ]
      },
      driving: {
        majorRoutes: ['I-91', 'I-84', 'Route 2'],
        typicalTraffic: 'Moderate downtown congestion',
        bestApproach: 'I-84 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Stadium area',
        dropoffZone: 'Home plate gate',
        surgePricing: 'Moderate on game nights'
      }
    },

    history: {
      timeline: [
        { year: 2017, event: 'Dunkin\' Park opens' },
        { year: 2017, event: 'Hartford Yard Goats inaugural season' },
        { year: 2019, event: 'Hosted Eastern League All-Star Game' }
      ],
      notableGames: [
        { date: '2017-04-13', description: 'First game in Dunkin\' Park history' },
        { date: '2019-07-10', description: 'Eastern League All-Star Game' }
      ],
      traditions: [
        { name: 'Connecticut Pride', description: 'Celebrating state heritage and culture' },
        { name: 'Capitol City Baseball', description: 'Representing Hartford as state capital' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern urban ballpark experience with New England hospitality',
      bestExperiences: [
        'Connecticut State Capitol views during games',
        'Modern ballpark amenities and design',
        'Downtown Hartford location and walkability',
        'New England regional food specialties'
      ],
      traditions: [
        'Connecticut-themed promotional nights',
        'State government appreciation events',
        'New England heritage celebrations'
      ],
      mascot: {
        name: 'Chompers',
        description: 'Goat mascot representing the Yard Goats brand and Connecticut spirit'
      }
    },

    proTips: {
      insiderTips: [
        'Try the Connecticut steamed cheeseburger - unique regional specialty',
        'Upper deck offers best State Capitol photography',
        'Downtown parking garages often cheaper than stadium lot',
        'Hartford Line train avoids downtown traffic'
      ],
      avoidThese: [
        'Don\'t drive during Hartford rush hour if possible',
        'Don\'t miss the Capitol building views',
        'Avoid missing local Connecticut food specialties'
      ],
      hiddenGems: [
        'One of the newest and most modern Double-A facilities',
        'State Capitol building photography opportunities',
        'Connecticut craft beer selection',
        'Easy access to Hartford cultural attractions'
      ],
      photoSpots: [
        'Home plate with State Capitol backdrop',
        'Downtown Hartford skyline from upper concourse',
        'Chompers mascot interactions',
        'Modern ballpark architecture'
      ],
      bestValue: [
        'General admission with Capitol views',
        'Group packages with Connecticut specialties',
        'Season tickets with downtown parking access',
        'Evening games for comfortable New England weather'
      ]
    }
  }
};