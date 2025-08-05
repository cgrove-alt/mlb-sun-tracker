import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides4: Record<string, StadiumGuide> = {
  'chattanooga-lookouts': {
    id: 'chattanooga-lookouts',
    name: 'AT&T Field',
    team: 'Chattanooga Lookouts',
    opened: 2000,
    capacity: 6160,

    overview: {
      description: 'AT&T Field sits along the Tennessee River in downtown Chattanooga, offering stunning river views and a connection to the city\'s rich railroad and Civil War history.',
      highlights: [
        'Tennessee River waterfront location',
        'Downtown Chattanooga setting',
        'Historic Lookouts franchise',
        'Reds Double-A affiliate',
        'Scenic mountain backdrop'
      ],
      uniqueFeatures: [
        'Tennessee River views from concourse',
        'Historic railroad bridge nearby',
        'Lookout Mountain visible from stadium',
        'Natural grass field',
        'Civil War historical significance'
      ],
      renovations: [
        { year: 2008, description: 'Concourse and seating improvements' },
        { year: 2015, description: 'LED lighting installation' },
        { year: 2019, description: 'Clubhouse renovations' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['201', '202', '203', 'Suite Level'],
        afternoon: ['205', '206', '207', 'River Deck'],
        evening: ['103', '104', '105', '201', '202']
      },
      coveredSeating: ['201', '202', '203', '204', '205', '206', 'Suite Level'],
      shadeTips: [
        'Upper deck provides best sun protection',
        'Tennessee heat and humidity require shade planning',
        'River breeze provides some natural cooling',
        'Third base side gets better afternoon shade'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Suite level', 'Team store', 'Restaurant areas'],
        sunscreenStations: ['Guest services', 'First aid station']
      },
      worstSunExposure: ['101', '102', '108', 'River Deck during midday'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 67, avgHumidity: 65, rainChance: 40, typicalConditions: 'Mild spring with occasional storms', shadeTip: 'Generally comfortable conditions' },
        { month: 'May', avgTemp: 75, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm and pleasant', shadeTip: 'Afternoon shade becomes helpful' },
        { month: 'June', avgTemp: 83, avgHumidity: 70, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck recommended for day games' },
        { month: 'July', avgTemp: 86, avgHumidity: 72, rainChance: 45, typicalConditions: 'Very hot and humid', shadeTip: 'Covered seating essential' },
        { month: 'August', avgTemp: 85, avgHumidity: 71, rainChance: 40, typicalConditions: 'Hot with afternoon storms', shadeTip: 'Shade and cover both important' },
        { month: 'September', avgTemp: 79, avgHumidity: 69, rainChance: 35, typicalConditions: 'Warm, more comfortable', shadeTip: 'Evening games pleasant' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'River Club',
            perks: ['Climate controlled', 'Premium food service', 'River views', 'Full bar'],
            access: 'Behind home plate with Tennessee River views'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering options', 'Climate control', 'River views']
        },
        specialAreas: [
          { name: 'River Deck', description: 'Party area with Tennessee River views', capacity: 100 }
        ]
      },
      budgetOptions: ['General admission', '206', '207', 'Standing room'],
      familySections: ['Family sections', '204', '205'],
      standingRoom: ['Concourse areas', 'River Deck'],
      partyAreas: [
        {
          name: 'River Deck',
          capacity: '100',
          description: 'Group area overlooking Tennessee River',
          amenities: ['Standing room', 'Bar service', 'River views']
        }
      ],
      tips: [
        { section: '101-103', tip: 'Best views of action with mountain backdrop', category: 'view' },
        { section: '201-203', tip: 'Great views with shade protection', category: 'shade' },
        { section: 'River Club', tip: 'Premium experience with historic river views', category: 'experience' },
        { section: 'River Deck', tip: 'Unique party atmosphere with scenic views', category: 'experience' },
        { section: '104-106', tip: 'Good value with decent river glimpses', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Lookout Dog', 'Tennessee BBQ Sandwich', 'Moon Pie', 'Jack Daniel\'s items'],
      local: ['Tennessee BBQ', 'Hot chicken', 'Moon Pies', 'Jack Daniel\'s sauce', 'Sweet tea'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at main concession stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Tennessee Brew Works', 'Yazoo Brewing'],
        wine: true,
        cocktails: true,
        localBreweries: ['Tennessee Brew Works', 'Yazoo Brewing Company']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown Lots', distance: '0.3 miles', price: '$3-8', shadedSpots: true, covered: true },
        { name: 'VIP Parking', distance: '100 yards', price: '$15', shadedSpots: true, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Meter parking until 6 PM weekdays',
        tip: 'Free evening and weekend street parking downtown'
      },
      alternativeTransport: {
        publicTransit: ['CARTA bus service'],
        rideShare: 'Uber and Lyft readily available',
        bicycle: 'Tennessee Riverwalk bike access, racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating areas', 'Team store'],
        openTime: '90 minutes before first pitch',
        tip: 'Primary entrance with team store and river views'
      },
      {
        name: 'River Gate',
        location: 'River side',
        bestFor: ['River Deck', 'Groups'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Lookouts Team Store', exclusive: ['Lookouts gear', 'Reds items', 'Tennessee-themed merchandise'] }
      ],
      firstAid: ['Main concourse near home plate'],
      babyChanging: ['All restroom facilities'],
      atms: ['Main concourse', 'Suite level'],
      wifi: { available: true, network: 'LookutsBaseball' },
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
        elevators: ['Behind home plate to upper levels']
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
        { title: 'River Walk', description: 'Stroll Tennessee Riverwalk before games', category: 'arrival' },
        { title: 'Tennessee BBQ', description: 'Try authentic Tennessee barbecue specialties', category: 'food' },
        { title: 'Historic Downtown', description: 'Explore Chattanooga\'s rich history', category: 'experience' },
        { title: 'Summer Heat', description: 'Tennessee summers are hot and humid', category: 'weather' }
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
      name: 'Downtown Chattanooga',
      description: 'Historic river city with Civil War significance and modern attractions',
      beforeGame: ['Tennessee Aquarium', 'Coolidge Park', 'Riverfront restaurants'],
      afterGame: ['Downtown entertainment district', 'Riverfront nightlife'],
      radius: '5 miles'
    },

    transportation: {
      address: '201 Power Alley, Chattanooga, TN 37402',
      publicTransit: {
        bus: [
          { routes: ['CARTA routes'], stops: ['Downtown Chattanooga'] }
        ]
      },
      driving: {
        majorRoutes: ['I-24', 'I-75', 'US-27'],
        typicalTraffic: 'Moderate downtown congestion',
        bestApproach: 'I-24 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Stadium parking lot',
        dropoffZone: 'Home plate gate',
        surgePricing: 'Moderate on game nights'
      }
    },

    history: {
      timeline: [
        { year: 2000, event: 'AT&T Field opens' },
        { year: 2009, event: 'Affiliated with Los Angeles Dodgers' },
        { year: 2021, event: 'Became Cincinnati Reds affiliate' }
      ],
      notableGames: [
        { date: '2000-04-15', description: 'First game in AT&T Field' },
        { date: '2015-08-28', description: 'Southern League Championship clincher' }
      ],
      traditions: [
        { name: 'River City Baseball', description: 'Celebrating Tennessee River heritage' },
        { name: 'Lookout Mountain Legacy', description: 'Honoring Civil War and railroad history' }
      ]
    },

    fanExperience: {
      atmosphere: 'Southern hospitality with historic charm and scenic river views',
      bestExperiences: [
        'Tennessee River views during games',
        'Historic downtown Chattanooga exploration',
        'Tennessee barbecue specialties',
        'Civil War and railroad history'
      ],
      traditions: [
        'River-themed promotional nights',
        'Tennessee heritage celebrations',
        'Civil War history recognition'
      ],
      mascot: {
        name: 'Looie',
        description: 'Mascot representing the Lookouts heritage and mountain setting'
      }
    },

    proTips: {
      insiderTips: [
        'Walk the Tennessee Riverwalk before games',
        'Try Tennessee BBQ - authentic regional specialty',
        'River Club offers best views and comfort',
        'Downtown attractions within walking distance'
      ],
      avoidThese: [
        'Don\'t park too far in summer heat',
        'Avoid lower level day games in July/August',
        'Don\'t miss historic downtown exploration'
      ],
      hiddenGems: [
        'Best Tennessee River views from upper concourse',
        'Civil War and railroad history displays',
        'Tennessee craft brewery selection',
        'Historic walking bridge nearby'
      ],
      photoSpots: [
        'Home plate with Tennessee River backdrop',
        'Lookout Mountain views from stadium',
        'Looie mascot interactions',
        'Historic railroad bridge in background'
      ],
      bestValue: [
        'General admission with river views',
        'Group packages with Tennessee BBQ',
        'Season tickets with downtown parking',
        'Evening games for comfortable weather'
      ]
    }
  },

  'corpus-christi-hooks': {
    id: 'corpus-christi-hooks',
    name: 'Whataburger Field',
    team: 'Corpus Christi Hooks',
    opened: 2005,
    capacity: 7000,

    overview: {
      description: 'Whataburger Field sits on the Corpus Christi bayfront, offering spectacular views of Corpus Christi Bay while serving as home to the Houston Astros Double-A affiliate.',
      highlights: [
        'Corpus Christi Bay waterfront location',
        'Astros Double-A affiliate',
        'Harbor Bridge views',
        'Gulf Coast setting',
        'Modern bayfront facility'
      ],
      uniqueFeatures: [
        'Bay views from throughout stadium',
        'Harbor Bridge backdrop',
        'Seagull frequent visitors',
        'Gulf Coast maritime theme',
        'Natural grass field with bay breeze'
      ],
      renovations: [
        { year: 2012, description: 'Concourse and amenity improvements' },
        { year: 2017, description: 'LED lighting system installation' },
        { year: 2020, description: 'Enhanced safety and technology upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['201', '202', '203', 'Club Level'],
        afternoon: ['205', '206', '207', 'Bay Deck'],
        evening: ['103', '104', '105', '201', '202']
      },
      coveredSeating: ['201', '202', '203', '204', '205', '206', 'Club Level'],
      shadeTips: [
        'Upper deck essential for South Texas sun',
        'Bay breeze provides natural cooling',
        'High humidity makes shade critical',
        'UV reflection off water increases exposure'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Club level', 'Team store', 'Restaurant areas'],
        sunscreenStations: ['Guest services', 'First aid station']
      },
      worstSunExposure: ['101', '102', '108', 'Bay Deck during afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 76, avgHumidity: 75, rainChance: 25, typicalConditions: 'Warm and humid with bay breeze', shadeTip: 'Bay breeze helps, shade still useful' },
        { month: 'May', avgTemp: 82, avgHumidity: 78, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Shade becomes important' },
        { month: 'June', avgTemp: 88, avgHumidity: 80, rainChance: 35, typicalConditions: 'Very hot and humid', shadeTip: 'Upper deck strongly recommended' },
        { month: 'July', avgTemp: 91, avgHumidity: 78, rainChance: 25, typicalConditions: 'Extremely hot', shadeTip: 'Covered seating essential' },
        { month: 'August', avgTemp: 91, avgHumidity: 79, rainChance: 30, typicalConditions: 'Peak heat and humidity', shadeTip: 'Indoor areas for relief' },
        { month: 'September', avgTemp: 87, avgHumidity: 80, rainChance: 40, typicalConditions: 'Still hot with storm chances', shadeTip: 'Shade and cover both needed' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Hooks Club',
            perks: ['Climate controlled', 'Premium seafood menu', 'Full bar', 'Bay views'],
            access: 'Behind home plate with Gulf Coast cuisine'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'Bay views']
        },
        specialAreas: [
          { name: 'Bay Deck', description: 'Party area overlooking Corpus Christi Bay', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', '206', '207', 'Standing room'],
      familySections: ['Family sections', '204', '205'],
      standingRoom: ['Concourse areas', 'Bay Deck'],
      partyAreas: [
        {
          name: 'Bay Deck',
          capacity: '150',
          description: 'Group area with spectacular bay views',
          amenities: ['Standing room', 'Bar service', 'Bay views']
        }
      ],
      tips: [
        { section: '101-103', tip: 'Best views of action and Harbor Bridge', category: 'view' },
        { section: '201-203', tip: 'Great views with essential shade protection', category: 'shade' },
        { section: 'Hooks Club', tip: 'Ultimate comfort with Gulf Coast cuisine', category: 'experience' },
        { section: 'Bay Deck', tip: 'Unique bayfront party atmosphere', category: 'experience' },
        { section: '104-106', tip: 'Good balance of view and value', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Whataburger items', 'Gulf Coast Shrimp Po\'boy', 'Fish Tacos', 'Kolaches'],
      local: ['Gulf shrimp', 'Fresh fish', 'Texas BBQ', 'Kolaches', 'Tex-Mex items'],
      healthy: ['Grilled fish', 'Shrimp salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Seafood options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Shiner Bock', 'Local Texas craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['B&J\'s Pizza & Brewery', 'Executive Surf Club']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Bayfront Lots', distance: '0.3 miles', price: '$3-5', shadedSpots: false, covered: false },
        { name: 'VIP Parking', distance: '100 yards', price: '$15', shadedSpots: true, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited bayfront street parking',
        tip: 'Downtown parking available within walking distance'
      },
      alternativeTransport: {
        publicTransit: ['RTA bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bayfront bike path access, racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating areas', 'Team store'],
        openTime: '90 minutes before first pitch',
        tip: 'Primary entrance with bay views and team store'
      },
      {
        name: 'Bay Gate',
        location: 'Bayfront side',
        bestFor: ['Bay Deck', 'Groups'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Hooks Team Store', exclusive: ['Hooks gear', 'Astros items', 'Gulf Coast themed merchandise'] }
      ],
      firstAid: ['Main concourse near home plate'],
      babyChanging: ['All restroom facilities'],
      atms: ['Main concourse', 'Club level'],
      wifi: { available: true, network: 'HooksBaseball' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        { name: 'Kids Zone', location: 'Beyond right field', activities: ['Playground', 'Speed pitch', 'Maritime theme'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['101', '102', '103', '201', '202'],
        entrance: 'All gates wheelchair accessible',
        elevators: ['Behind home plate to upper levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All major stands'],
      parkingSpaces: '25 spaces in stadium lot'
    },

    gameDay: {
      tips: [
        { title: 'Gulf Coast Heat', description: 'Prepare for intense South Texas sun and humidity', category: 'weather' },
        { title: 'Bay Views', description: 'Best photography from upper concourse', category: 'experience' },
        { title: 'Seafood Specialties', description: 'Try fresh Gulf Coast seafood options', category: 'food' },
        { title: 'Hurricane Season', description: 'Check weather forecasts June-November', category: 'weather' }
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
      name: 'Corpus Christi Bayfront',
      description: 'Gulf Coast city with maritime culture and tourism',
      beforeGame: ['Texas State Aquarium', 'USS Lexington', 'Bayfront restaurants'],
      afterGame: ['Downtown entertainment', 'Bayfront nightlife'],
      radius: '5 miles'
    },

    transportation: {
      address: '734 E Port Ave, Corpus Christi, TX 78401',
      publicTransit: {
        bus: [
          { routes: ['RTA routes'], stops: ['Downtown/Bayfront'] }
        ]
      },
      driving: {
        majorRoutes: ['I-37', 'US-181', 'Highway 358'],
        typicalTraffic: 'Light to moderate, heavy during tourist season',
        bestApproach: 'I-37 to downtown/bayfront exits'
      },
      rideShare: {
        pickupZone: 'Stadium parking lot',
        dropoffZone: 'Home plate gate',
        surgePricing: 'Higher during tourism and events'
      }
    },

    history: {
      timeline: [
        { year: 2005, event: 'Whataburger Field opens' },
        { year: 2005, event: 'Corpus Christi Hooks inaugural season' },
        { year: 2013, event: 'Affiliated with Houston Astros' },
        { year: 2017, event: 'Astros World Series championship celebration' }
      ],
      notableGames: [
        { date: '2005-04-16', description: 'First game in Whataburger Field' },
        { date: '2017-11-01', description: 'World Series championship celebration' }
      ],
      traditions: [
        { name: 'Gulf Coast Heritage', description: 'Celebrating maritime and fishing culture' },
        { name: 'Astros Pipeline', description: 'Showcasing future Houston stars' }
      ]
    },

    fanExperience: {
      atmosphere: 'Gulf Coast charm with spectacular bay views and maritime culture',
      bestExperiences: [
        'Corpus Christi Bay views during games',
        'Fresh Gulf Coast seafood concessions',
        'Harbor Bridge sunset backdrop',
        'Future Astros prospect watching'
      ],
      traditions: [
        'Bay-themed promotional nights',
        'Maritime heritage celebrations',
        'Astros organizational pride'
      ],
      mascot: {
        name: 'Sammy the Shrimp',
        description: 'Shrimp mascot representing Gulf Coast maritime culture'
      }
    },

    proTips: {
      insiderTips: [
        'Upper deck essential for Texas heat',
        'Try Gulf shrimp specialties - fresh daily',
        'Bay views best from third base upper deck',
        'Evening games much more comfortable'
      ],
      avoidThese: [
        'Don\'t underestimate South Texas heat',
        'Avoid lower level day games in summer',
        'Don\'t miss sunset over the bay'
      ],
      hiddenGems: [
        'Best Gulf Coast seafood in Texas minor leagues',
        'Harbor Bridge photography opportunities',
        'Seagull watching entertainment',
        'Maritime history displays throughout facility'
      ],
      photoSpots: [
        'Home plate with Harbor Bridge backdrop',
        'Bay views from upper concourse',
        'Sammy the Shrimp mascot interactions',
        'Sunset colors over Corpus Christi Bay'
      ],
      bestValue: [
        'Bay Deck for group experiences',
        'General admission with bay views',
        'Season tickets with VIP parking',
        'Evening games for weather comfort'
      ]
    }
  }
};