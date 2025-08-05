import { StadiumGuide } from '../stadiumGuides';

export const singleAStadiumGuides3: Record<string, StadiumGuide> = {
  'carolina-mudcats': {
    id: 'carolina-mudcats',
    name: 'Five County Stadium',
    team: 'Carolina Mudcats',
    opened: 1991,
    capacity: 6500,

    overview: {
      description: 'Five County Stadium in Zebulon serves as home to the Brewers Single-A affiliate, featuring rural North Carolina charm and a family-friendly atmosphere in the Raleigh metro area.',
      highlights: [
        'Brewers Single-A affiliate',
        'Raleigh metro location',
        'Rural setting',
        'Family-friendly atmosphere',
        'Carolina League heritage'
      ],
      uniqueFeatures: [
        'Tobacco Road region',
        'Natural grass field',
        'Pine tree backdrop',
        'Traditional design',
        'Small-town feel'
      ],
      renovations: [
        { year: 2013, description: 'Seating improvements' },
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse renovations' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Box seats'],
        afternoon: ['Sections 200-208', 'Covered areas'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Limited covered areas', 'Premium sections'],
      shadeTips: [
        'North Carolina summers hot and humid',
        'Limited shade structures',
        'Third base side preferred',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Team store', 'Limited indoor spaces'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 66, avgHumidity: 64, rainChance: 30, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 74, avgHumidity: 67, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 81, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 85, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot', shadeTip: 'Evening games ideal' },
        { month: 'August', avgTemp: 84, avgHumidity: 73, rainChance: 40, typicalConditions: 'Peak humidity', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 77, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still warm', shadeTip: 'More bearable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering options']
        },
        specialAreas: [
          { name: 'Cattails Restaurant', description: 'Restaurant seating', capacity: 100 },
          { name: 'Party Deck', description: 'Left field group area', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Lawn seating', 'Bleachers'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '200',
          description: 'Group party area',
          amenities: ['Picnic area', 'Group seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best action views', category: 'view' },
        { section: 'Third base side', tip: 'Better shade coverage', category: 'shade' },
        { section: 'Cattails Restaurant', tip: 'Indoor dining option', category: 'experience' },
        { section: 'Lawn', tip: 'Budget-friendly for families', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Carolina BBQ', 'Muddy Burger', 'Tobacco Road nachos'],
      local: ['North Carolina BBQ', 'Sweet tea', 'Hush puppies', 'Collard greens'],
      healthy: ['Grilled chicken', 'Salads'],
      vegetarian: ['Veggie options', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['North Carolina craft beers', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Trophy Brewing', 'Aviator', 'White Street']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: 'Free', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '300 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Plenty of free parking'
      },
      alternativeTransport: {
        publicTransit: ['No public transit'],
        rideShare: 'Limited availability',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Behind home plate',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Mudcats Team Store', exclusive: ['Mudcats gear', 'Brewers items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: false },
      kidZones: [
        { name: 'Muddy\'s Fun Zone', location: 'Right field', activities: ['Playground', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated accessible areas'],
        entrance: 'Main gate accessible',
        elevators: ['To suite level']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '20 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Carolina BBQ', description: 'Try authentic style', category: 'food' },
        { title: 'Rural Setting', description: 'Small-town charm', category: 'experience' },
        { title: 'Family Focus', description: 'Great for kids', category: 'experience' },
        { title: 'Summer Heat', description: 'Evening games better', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:00 PM',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: false
      }
    },

    neighborhood: {
      name: 'Zebulon',
      description: 'Small town east of Raleigh',
      beforeGame: ['Downtown Zebulon', 'Local restaurants'],
      afterGame: ['Limited options'],
      radius: '5 miles'
    },

    transportation: {
      address: '1501 NC-39, Zebulon, NC 27597',
      publicTransit: {
        bus: [
          { routes: ['No public transit'], stops: [] }
        ]
      },
      driving: {
        majorRoutes: ['US-264', 'NC-39', 'I-540'],
        typicalTraffic: 'Light',
        bestApproach: 'US-264 to NC-39'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal if available'
      }
    },

    history: {
      timeline: [
        { year: 1991, event: 'Five County Stadium opens' },
        { year: 1991, event: 'Mudcats begin play' },
        { year: 2017, event: 'Became Brewers affiliate' }
      ],
      traditions: [
        { name: 'Mudcat Mascot', description: 'Beloved catfish character' },
        { name: 'Carolina League', description: 'Long league tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly Carolina baseball',
      bestExperiences: [
        'Small-town atmosphere',
        'Carolina BBQ',
        'Family entertainment',
        'Affordable experience'
      ],
      traditions: [
        'Mudcat Monday',
        'Thirsty Thursday',
        'Fireworks Friday'
      ],
      mascot: {
        name: 'Muddy',
        description: 'Mudcat catfish mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Free parking abundant',
        'Try Carolina BBQ nachos',
        'Family-friendly atmosphere',
        'Small-town charm authentic'
      ],
      avoidThese: [
        'Summer day games',
        'Limited shade on hot days',
        'First base side afternoon'
      ],
      hiddenGems: [
        'Cattails Restaurant',
        'Tobacco Road heritage',
        'Rural NC setting',
        'Close to Raleigh'
      ],
      photoSpots: [
        'With Muddy mascot',
        'Pine tree backdrop',
        'Traditional entrance',
        'Tobacco Road signage'
      ],
      bestValue: [
        'Free parking',
        'General admission',
        'Lawn seating',
        'Family deals'
      ]
    }
  },

  'fayetteville-woodpeckers': {
    id: 'fayetteville-woodpeckers',
    name: 'Segra Stadium',
    team: 'Fayetteville Woodpeckers',
    opened: 2019,
    capacity: 5200,

    overview: {
      description: 'Segra Stadium is one of the newest venues in Minor League Baseball, serving as home to the Astros Single-A affiliate with state-of-the-art amenities in downtown Fayetteville.',
      highlights: [
        'Astros Single-A affiliate',
        'Opened in 2019',
        'Downtown Fayetteville location',
        'Brand new facility',
        'Modern amenities throughout'
      ],
      uniqueFeatures: [
        'Downtown integration',
        'LED ribbon boards',
        'Synthetic turf field',
        '360-degree concourse',
        'Contemporary design'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Modern design includes shade features',
        'North Carolina heat and humidity',
        'Third base side preferred',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 64, rainChance: 30, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 76, avgHumidity: 67, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade helpful' },
        { month: 'June', avgTemp: 83, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'July', avgTemp: 87, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 86, avgHumidity: 73, rainChance: 40, typicalConditions: 'Peak heat', shadeTip: 'Maximum protection' },
        { month: 'September', avgTemp: 79, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still warm', shadeTip: 'More bearable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Woodpeckers Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private entrance'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Left field group area', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', 'Upper reserved', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['360 concourse', 'Party areas'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '150',
          description: 'Group party area',
          amenities: ['Bar service', 'Tables', 'Standing room']
        }
      ],
      tips: [
        { section: 'Woodpeckers Club', tip: 'Premium all-inclusive', category: 'experience' },
        { section: '360 concourse', tip: 'Walk for different views', category: 'experience' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Behind home plate', tip: 'Best overall views', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Peckeroni Pizza', 'Fort Bragg favorites', 'Carolina specialties'],
      local: ['North Carolina BBQ', 'Military tributes', 'Sweet tea'],
      healthy: ['Grilled options', 'Salads', 'Fresh items'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['North Carolina craft beers', 'National brands'],
        wine: true,
        cocktails: true,
        localBreweries: ['Dirtbag Ales', 'Bright Light', 'Huske Hardware']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown Decks', distance: '0.3 miles', price: '$5-10', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered downtown',
        tip: 'Downtown decks better option'
      },
      alternativeTransport: {
        publicTransit: ['Limited bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch',
        tip: 'Downtown entrance'
      },
      {
        name: 'Left Field Gate',
        location: 'Outfield entrance',
        bestFor: ['Party deck', 'Outfield seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Woodpeckers Team Store', exclusive: ['Woodpeckers gear', 'Astros items', 'Military tributes'] }
      ],
      firstAid: ['Multiple locations'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Available'],
      atms: ['Throughout'],
      wifi: { available: true, network: 'Segra_WiFi' },
      chargingStations: ['Multiple locations'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Interactive games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All areas fully accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout facility'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '30+ ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Brand New Park', description: 'Newest facilities in MiLB', category: 'experience' },
        { title: 'Military Community', description: 'Fort Bragg nearby', category: 'experience' },
        { title: 'Downtown Location', description: 'Restaurants walkable', category: 'experience' },
        { title: 'Summer Heat', description: 'Evening games better', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30-45 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Downtown Fayetteville',
      description: 'Revitalized downtown near Fort Bragg',
      beforeGame: ['Downtown restaurants', 'Festival Park', 'Museums'],
      afterGame: ['Downtown nightlife', 'Huske Hardware House'],
      radius: '1 mile'
    },

    transportation: {
      address: '460 Hay St, Fayetteville, NC 28301',
      publicTransit: {
        bus: [
          { routes: ['FAST Transit'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-95', 'US-401', 'All American Freeway'],
        typicalTraffic: 'Moderate downtown',
        bestApproach: 'I-95 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2019, event: 'Segra Stadium opens' },
        { year: 2019, event: 'Woodpeckers inaugural season' },
        { year: 2019, event: 'Return of baseball to Fayetteville' }
      ],
      traditions: [
        { name: 'Military Appreciation', description: 'Fort Bragg connection' },
        { name: 'New Traditions', description: 'Building fan base' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern baseball with military community pride',
      bestExperiences: [
        'Brand new amenities',
        'Downtown integration',
        'Military tributes',
        'Modern technology'
      ],
      traditions: [
        'Military Monday',
        'Thirsty Thursday',
        'Fireworks Friday'
      ],
      mascot: {
        name: 'Bunker',
        description: 'Woodpecker mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Newest park in professional baseball',
        'Downtown dining excellent',
        'Military discounts available',
        'All modern amenities'
      ],
      avoidThese: [
        'Downtown parking meters',
        'Summer afternoon games',
        'I-95 traffic peaks'
      ],
      hiddenGems: [
        'State-of-the-art everything',
        'Downtown Fayetteville renaissance',
        'Fort Bragg connection',
        'Festival Park nearby'
      ],
      photoSpots: [
        'Modern entrance plaza',
        'With Bunker mascot',
        '360 concourse views',
        'Downtown skyline backdrop'
      ],
      bestValue: [
        'General admission flexibility',
        'Military discounts',
        'Weeknight games',
        'Group packages'
      ]
    }
  },

  'kannapolis-cannon-ballers': {
    id: 'kannapolis-cannon-ballers',
    name: 'Atrium Health Ballpark',
    team: 'Kannapolis Cannon Ballers',
    opened: 2020,
    capacity: 4930,

    overview: {
      description: 'Atrium Health Ballpark is one of the newest facilities in professional baseball, serving as home to the White Sox Single-A affiliate with cutting-edge design in downtown Kannapolis.',
      highlights: [
        'White Sox Single-A affiliate',
        'Opened in 2020',
        'Downtown Kannapolis location',
        'Ultra-modern design',
        'State-of-the-art amenities'
      ],
      uniqueFeatures: [
        'Unique architectural design',
        'Downtown plaza integration',
        'Synthetic turf field',
        '360-degree concourse',
        'LED light shows'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Modern design maximizes shade',
        'North Carolina summers hot',
        'Third base side preferred',
        'Evening games ideal'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'All levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 65, avgHumidity: 63, rainChance: 30, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 73, avgHumidity: 66, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 80, avgHumidity: 69, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Shade becoming valuable' },
        { month: 'July', avgTemp: 84, avgHumidity: 71, rainChance: 40, typicalConditions: 'Very hot', shadeTip: 'Covered seating ideal' },
        { month: 'August', avgTemp: 83, avgHumidity: 72, rainChance: 35, typicalConditions: 'Continued heat', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 76, avgHumidity: 69, rainChance: 30, typicalConditions: 'More comfortable', shadeTip: 'Pleasant evenings' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Founders Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private bar'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Outfield Plaza', description: 'Standing room party area', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Standing room', 'Plaza areas'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['360 concourse', 'Outfield plaza'],
      partyAreas: [
        {
          name: 'Outfield Plaza',
          capacity: '200',
          description: 'Standing room party area',
          amenities: ['Bar service', 'High-top tables', 'Social atmosphere']
        }
      ],
      tips: [
        { section: 'Founders Club', tip: 'Ultimate premium experience', category: 'experience' },
        { section: '360 concourse', tip: 'Unique design perspectives', category: 'experience' },
        { section: 'Third base side', tip: 'Better shade angles', category: 'shade' },
        { section: 'Outfield Plaza', tip: 'Social standing room', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Cannon Blast Burger', 'Charlotte-area favorites', 'Modern fare'],
      local: ['North Carolina BBQ', 'Charlotte specialties', 'Craft options'],
      healthy: ['Fresh market items', 'Salads', 'Grilled options'],
      vegetarian: ['Plant-based options', 'Veggie burgers', 'Salads'],
      glutenFree: ['Dedicated options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Charlotte craft beers', 'North Carolina breweries'],
        wine: true,
        cocktails: true,
        localBreweries: ['NoDa', 'Olde Mecklenburg', 'Sycamore', 'Wooden Robot']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Deck', distance: '100 yards', price: '$5', shadedSpots: true, covered: true },
        { name: 'Downtown Lots', distance: '0.3 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited downtown',
        tip: 'Stadium deck recommended'
      },
      alternativeTransport: {
        publicTransit: ['Rider Transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main plaza entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch',
        tip: 'Impressive modern entrance'
      },
      {
        name: 'Outfield Gate',
        location: 'Outfield entrance',
        bestFor: ['Plaza areas'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Cannon Ballers Team Store', exclusive: ['Cannon Ballers gear', 'White Sox items', 'Modern designs'] }
      ],
      firstAid: ['Multiple locations'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Available'],
      atms: ['Throughout facility'],
      wifi: { available: true, network: 'AtriumBallpark_WiFi' },
      chargingStations: ['Throughout'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Modern playground', 'Interactive features'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Fully accessible throughout'],
        entrance: 'All entrances ADA compliant',
        elevators: ['Multiple elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout facility'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '40+ ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Ultra-Modern Park', description: 'Newest design in baseball', category: 'experience' },
        { title: 'Charlotte Proximity', description: '25 minutes from city', category: 'experience' },
        { title: 'Downtown Integration', description: 'Part of city center', category: 'experience' },
        { title: 'Summer Heat', description: 'Evening games preferable', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30-45 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Downtown Kannapolis',
      description: 'Revitalized downtown with modern development',
      beforeGame: ['Downtown restaurants', 'NC Research Campus', 'Shops'],
      afterGame: ['Downtown establishments', 'Charlotte nightlife'],
      radius: '1 mile'
    },

    transportation: {
      address: '216 West Ave, Kannapolis, NC 28081',
      publicTransit: {
        bus: [
          { routes: ['Rider Transit'], stops: ['Downtown stops'] }
        ]
      },
      driving: {
        majorRoutes: ['I-85', 'US-29', 'NC-3'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-85 to Exit 58'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Moderate on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2020, event: 'Atrium Health Ballpark opens' },
        { year: 2020, event: 'Move from Intimidators' },
        { year: 2020, event: 'Rebrand to Cannon Ballers' }
      ],
      traditions: [
        { name: 'New Beginning', description: 'Building new traditions' },
        { name: 'White Sox Connection', description: 'Chicago organization' }
      ]
    },

    fanExperience: {
      atmosphere: 'Ultra-modern baseball experience',
      bestExperiences: [
        'Cutting-edge design',
        'Downtown integration',
        'LED light shows',
        'Modern amenities throughout'
      ],
      traditions: [
        'Blast Off Thursday',
        'Fireworks Friday',
        'Sunday Funday'
      ],
      mascot: {
        name: 'Boomer',
        description: 'Cannon ball character'
      }
    },

    proTips: {
      insiderTips: [
        'Most modern park in MiLB',
        'Downtown dining growing',
        'Charlotte just 25 minutes',
        'All cutting-edge amenities'
      ],
      avoidThese: [
        'Summer afternoon games',
        'Limited street parking',
        'I-85 rush hour'
      ],
      hiddenGems: [
        'Architectural marvel',
        'NC Research Campus nearby',
        'Downtown renaissance',
        'Charlotte proximity'
      ],
      photoSpots: [
        'Unique architecture angles',
        'With Boomer mascot',
        'Modern plaza',
        'LED light displays'
      ],
      bestValue: [
        'Standing room flexibility',
        'Weeknight games',
        'Student discounts',
        'Group packages'
      ]
    }
  }
};