import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides6: Record<string, StadiumGuide> = {
  'jersey-shore-blueclaws': {
    id: 'jersey-shore-blueclaws',
    name: 'ShoreTown Ballpark',
    team: 'Jersey Shore BlueClaws',
    opened: 2001,
    capacity: 6588,

    overview: {
      description: 'ShoreTown Ballpark serves as home to the Phillies High-A affiliate, located in the heart of the Jersey Shore with a beach-themed atmosphere and modern amenities.',
      highlights: [
        'Phillies High-A affiliate',
        'Jersey Shore location',
        'Beach-themed ballpark',
        'Family entertainment focus',
        'Modern amenities'
      ],
      uniqueFeatures: [
        'Beach and boardwalk theme',
        'Jersey Shore culture',
        'Natural grass field',
        'Crab-themed branding',
        'Shore town atmosphere'
      ],
      renovations: [
        { year: 2011, description: 'Major renovations and improvements' },
        { year: 2019, description: 'LED lighting installation' },
        { year: 2021, description: 'Rebranding to Jersey Shore' }
      ],
      previousNames: ['FirstEnergy Park (2001-2020)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-218', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Jersey summers hot and humid',
        'Ocean breeze provides some relief',
        'Third base side better afternoon shade',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Right field bleachers', 'First base field level'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cool spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 70, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 77, avgHumidity: 72, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Shade becomes valuable' },
        { month: 'July', avgTemp: 82, avgHumidity: 73, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck recommended' },
        { month: 'August', avgTemp: 81, avgHumidity: 74, rainChance: 35, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 74, avgHumidity: 72, rainChance: 30, typicalConditions: 'Still warm', shadeTip: 'More comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Blue Claws Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Behind home plate premium area'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Left field group area', capacity: 150 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved', 'Bleachers'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '150',
          description: 'Group entertainment area',
          amenities: ['Private bar', 'Tables', 'Games']
        }
      ],
      tips: [
        { section: 'Club level', tip: 'Best amenities and comfort', category: 'experience' },
        { section: 'Third base upper', tip: 'Good shade and value', category: 'shade' },
        { section: 'Party Deck', tip: 'Fun group atmosphere', category: 'experience' },
        { section: 'Lawn', tip: 'Family-friendly budget option', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Boardwalk fries', 'Jersey corn', 'Pork roll sandwich', 'Funnel cake'],
      local: ['Jersey Shore favorites', 'Boardwalk treats', 'Local seafood', 'Italian ice'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Yuengling', 'Jersey craft beers', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Kane Brewing', 'Carton Brewing', 'Cape May Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '400 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots only'
      },
      alternativeTransport: {
        publicTransit: ['NJ Transit bus available'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Behind home plate',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch',
        tip: 'Beach-themed entrance'
      },
      {
        name: 'Left Field Gate',
        location: 'Third base side',
        bestFor: ['Party deck', 'Left field seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'BlueClaws Team Store', exclusive: ['BlueClaws gear', 'Phillies items', 'Beach-themed merchandise'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['All family restrooms'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'BlueClaws_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Bounce house', 'Speed pitch'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '25 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Shore Theme', description: 'Enjoy beach atmosphere', category: 'experience' },
        { title: 'Pork Roll', description: 'Try Jersey specialty', category: 'food' },
        { title: 'Family Fun', description: 'Extensive kids activities', category: 'experience' },
        { title: 'Summer Heat', description: 'Evening games more comfortable', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Lakewood',
      description: 'Central Jersey community near the Shore',
      beforeGame: ['Local restaurants', 'Shopping areas'],
      afterGame: ['Jersey Shore attractions', 'Local dining'],
      radius: '10 miles'
    },

    transportation: {
      address: '2 Stadium Way, Lakewood, NJ 08701',
      publicTransit: {
        bus: [
          { routes: ['NJ Transit routes'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['Route 70', 'Garden State Parkway', 'I-195'],
        typicalTraffic: 'Moderate, heavy on beach days',
        bestApproach: 'Route 70 to stadium'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate on game nights'
      }
    },

    history: {
      timeline: [
        { year: 2001, event: 'FirstEnergy Park opens' },
        { year: 2001, event: 'Lakewood BlueClaws inaugural' },
        { year: 2021, event: 'Rebrand to Jersey Shore BlueClaws' }
      ],
      traditions: [
        { name: 'Shore Pride', description: 'Jersey Shore culture celebration' },
        { name: 'Phillies Pipeline', description: 'Developing Philadelphia talent' }
      ]
    },

    fanExperience: {
      atmosphere: 'Beach party meets baseball with family fun',
      bestExperiences: [
        'Jersey Shore theme throughout',
        'Extensive family entertainment',
        'Boardwalk-style concessions',
        'Phillies prospects'
      ],
      traditions: [
        'Pork Roll Night',
        'Beach-themed promotions',
        'Fireworks Fridays'
      ],
      mascot: {
        name: 'Buster',
        description: 'Blue Claw crab mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Try the pork roll - Jersey classic',
        'Family entertainment extensive',
        'Club level worth it for heat relief',
        'Beach attractions nearby for day trips'
      ],
      avoidThese: [
        'Right field in afternoon sun',
        'Traffic on beach weekends',
        'Underestimating summer humidity'
      ],
      hiddenGems: [
        'Jersey Shore culture displays',
        'Boardwalk food quality',
        'Family entertainment value',
        'Phillies organizational connection'
      ],
      photoSpots: [
        'With Buster mascot',
        'Beach-themed decorations',
        'Jersey Shore signage',
        'Kids zone activities'
      ],
      bestValue: [
        'Lawn seating for families',
        'Upper deck seats',
        'Group packages',
        'Thursday promotions'
      ]
    }
  },

  'lakeland-flying-tigers': {
    id: 'lakeland-flying-tigers',
    name: 'Publix Field at Joker Marchant Stadium',
    team: 'Lakeland Flying Tigers',
    opened: 1966,
    capacity: 8500,

    overview: {
      description: 'Publix Field at Joker Marchant Stadium serves as both the spring training home of the Detroit Tigers and the regular season home of their High-A affiliate in central Florida.',
      highlights: [
        'Tigers High-A affiliate',
        'Tigers spring training home',
        'Historic Tigertown facility',
        'Central Florida location',
        'Major league quality'
      ],
      uniqueFeatures: [
        'Tigertown complex',
        'Spring training facility',
        'Tiger statues and theming',
        'Natural grass field',
        'Lake Parker nearby'
      ],
      renovations: [
        { year: 2017, description: 'Major $40 million renovation' },
        { year: 2020, description: 'Additional improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Upper deck'],
        afternoon: ['Sections 210-220', 'Suites'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Upper deck overhang', 'Suite level', 'Club areas'],
      shadeTips: [
        'Florida sun intense year-round',
        'Upper deck provides shade below',
        'Third base side better afternoon',
        'Hydration essential'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Tiger Den Club', 'Team store'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['Right field berm', 'First base field level'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 78, avgHumidity: 68, rainChance: 20, typicalConditions: 'Warm and pleasant', shadeTip: 'Shade helpful midday' },
        { month: 'May', avgTemp: 84, avgHumidity: 70, rainChance: 25, typicalConditions: 'Getting hot', shadeTip: 'Upper deck recommended' },
        { month: 'June', avgTemp: 88, avgHumidity: 73, rainChance: 45, typicalConditions: 'Hot with storms', shadeTip: 'Cover essential' },
        { month: 'July', avgTemp: 90, avgHumidity: 75, rainChance: 50, typicalConditions: 'Very hot and humid', shadeTip: 'Shade critical' },
        { month: 'August', avgTemp: 90, avgHumidity: 75, rainChance: 50, typicalConditions: 'Peak heat', shadeTip: 'Evening games only' },
        { month: 'September', avgTemp: 87, avgHumidity: 74, rainChance: 45, typicalConditions: 'Still very hot', shadeTip: 'Shade remains important' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Tiger Den Club',
            perks: ['Climate controlled', 'Premium dining', 'Full bar', 'Padded seats'],
            access: 'Behind home plate with A/C'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'TVs']
        },
        specialAreas: [
          { name: 'Berm', description: 'Outfield grass seating', capacity: 1000 }
        ]
      },
      budgetOptions: ['Berm seating', 'Upper reserved', 'Standing room'],
      familySections: ['Family sections', 'Alcohol-free zones'],
      standingRoom: ['Concourse areas', 'Party areas'],
      partyAreas: [
        {
          name: 'Tiki Bar',
          capacity: '100',
          description: 'Left field tropical bar',
          amenities: ['Full bar', 'Tropical theme', 'Standing tables']
        }
      ],
      tips: [
        { section: 'Tiger Den Club', tip: 'A/C relief from Florida heat', category: 'experience' },
        { section: 'Upper deck', tip: 'Best shade coverage', category: 'shade' },
        { section: 'Berm', tip: 'Bring blanket and sunscreen', category: 'value' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' }
      ]
    },

    concessions: {
      signature: ['Tiger Dog', 'Cuban sandwich', 'Publix subs', 'Key lime pie'],
      local: ['Florida citrus', 'Cuban food', 'Seafood', 'Tropical drinks'],
      healthy: ['Grilled fish', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie wraps', 'Salads'],
      glutenFree: ['Available at main stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Shaved ice'],
      alcohol: {
        beer: ['Budweiser', 'Corona', 'Florida craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Swan Brewing', 'Grove Roots']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '400 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Stadium lots only'
      },
      alternativeTransport: {
        publicTransit: ['Citrus Connection bus'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Behind home plate',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch',
        tip: 'Tiger statue entrance'
      },
      {
        name: 'Left Field Gate',
        location: 'Third base side',
        bestFor: ['Berm', 'Left field seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Tigers Team Store', exclusive: ['Flying Tigers gear', 'Tigers spring training items'] }
      ],
      firstAid: ['Behind home plate', 'Upper concourse'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Tigers_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Speed pitch', 'Tiger theme'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
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
        { title: 'Spring Training', description: 'See major leaguers in spring', category: 'experience' },
        { title: 'Florida Heat', description: 'Maximum sun protection needed', category: 'weather' },
        { title: 'Tigertown', description: 'Explore training complex', category: 'experience' },
        { title: 'Publix Subs', description: 'Try Florida favorite', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        battingPractice: 'Spring training only',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Lakeland',
      description: 'Central Florida city between Tampa and Orlando',
      beforeGame: ['Downtown Lakeland', 'Lake Mirror', 'Florida Southern College'],
      afterGame: ['Downtown dining', 'Lake activities'],
      radius: '5 miles'
    },

    transportation: {
      address: '2301 Lakeland Hills Blvd, Lakeland, FL 33805',
      publicTransit: {
        bus: [
          { routes: ['Citrus Connection'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-4', 'US-98', 'Polk Parkway'],
        typicalTraffic: 'Moderate, heavy during spring training',
        bestApproach: 'I-4 to Lakeland Hills Blvd'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher during spring training'
      }
    },

    history: {
      timeline: [
        { year: 1966, event: 'Joker Marchant Stadium opens' },
        { year: 1966, event: 'Tigers spring training begins' },
        { year: 2017, event: 'Major renovation completed' }
      ],
      traditions: [
        { name: 'Tigertown', description: 'Historic Tigers training home' },
        { name: 'Spring Training', description: 'Grapefruit League tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Spring training tradition with Florida charm',
      bestExperiences: [
        'Major league quality facility',
        'Spring training atmosphere',
        'Tigertown complex',
        'Florida weather (evenings)'
      ],
      traditions: [
        'Tigers spring training',
        'Flying Tigers heritage',
        'Florida baseball culture'
      ],
      mascot: {
        name: 'Roary',
        description: 'Tiger mascot shared with Detroit'
      }
    },

    proTips: {
      insiderTips: [
        'Upper deck essential for shade',
        'Spring training brings crowds and prices up',
        'Tiger Den Club worth it for A/C',
        'Evening games much more comfortable'
      ],
      avoidThese: [
        'Day games in summer if possible',
        'Berm without sun protection',
        'Underestimating Florida heat and humidity'
      ],
      hiddenGems: [
        'Tigertown complex tours',
        'Spring training atmosphere',
        'Historic Tigers displays',
        'Lake Parker nearby'
      ],
      photoSpots: [
        'Tiger statues',
        'Spring training signage',
        'With Roary mascot',
        'Tigertown entrance'
      ],
      bestValue: [
        'Berm seating (bring protection)',
        'Upper deck for shade',
        'Spring training value games',
        'Group packages'
      ]
    }
  },

  'lansing-lugnuts': {
    id: 'lansing-lugnuts',
    name: 'Jackson Field',
    team: 'Lansing Lugnuts',
    opened: 1996,
    capacity: 11000,

    overview: {
      description: 'Jackson Field in downtown Lansing serves as home to the Athletics High-A affiliate, offering one of the largest capacities in High-A baseball with Michigan\'s capital city backdrop.',
      highlights: [
        'Athletics High-A affiliate',
        'Downtown Lansing location',
        'Large capacity for High-A',
        'Michigan State proximity',
        'Capital city setting'
      ],
      uniqueFeatures: [
        'Downtown skyline views',
        'Automotive heritage displays',
        'Natural grass field',
        'Michigan-themed elements',
        'Outfield party deck'
      ],
      renovations: [
        { year: 2010, description: 'Major renovations' },
        { year: 2018, description: 'LED lighting installation' },
        { year: 2021, description: 'Became Athletics affiliate' }
      ],
      previousNames: ['Oldsmobile Park (1996-2010)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Upper sections'],
        afternoon: ['Sections 210-220', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Upper deck overhang', 'Suite level'],
      shadeTips: [
        'Michigan summers can be hot',
        'Upper deck provides good coverage',
        'Third base side better afternoon',
        'Evening games comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Right field lawn', 'First base field level'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool and variable', shadeTip: 'Dress warmly' },
        { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'June', avgTemp: 73, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm and nice', shadeTip: 'Some shade helpful' },
        { month: 'July', avgTemp: 77, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm summer', shadeTip: 'Upper deck for shade' },
        { month: 'August', avgTemp: 75, avgHumidity: 72, rainChance: 35, typicalConditions: 'Humid late summer', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 68, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Perfect weather' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 2000 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper deck', 'Bleachers'],
      familySections: ['Family sections available'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Outfield Deck',
          capacity: '200',
          description: 'Right field party area',
          amenities: ['Bar service', 'Tables', 'Games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of downtown', category: 'view' },
        { section: 'Upper deck', tip: 'Great value with shade', category: 'shade' },
        { section: 'Lawn', tip: 'Fun casual atmosphere', category: 'experience' },
        { section: 'Third base side', tip: 'Better afternoon comfort', category: 'shade' }
      ]
    },

    concessions: {
      signature: ['Lugnut Dog', 'Michigan craft beers', 'Coney dogs'],
      local: ['Michigan beers', 'Coney Island hot dogs', 'Better Made chips'],
      healthy: ['Grilled chicken', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Bell\'s', 'Founders', 'Michigan craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Lansing Brewing', 'EagleMonk', 'BAD Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown Ramps', distance: '0.3 miles', price: '$5-10', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 6 PM',
        tip: 'Free after 6 PM downtown'
      },
      alternativeTransport: {
        publicTransit: ['CATA bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'River Trail access'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Michigan Avenue',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch',
        tip: 'Downtown entrance'
      },
      {
        name: 'Outfield Gate',
        location: 'Larch Street',
        bestFor: ['Lawn', 'Outfield deck'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Lugnuts Team Store', exclusive: ['Lugnuts gear', 'Athletics items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Lugnuts_WiFi' },
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Speed pitch'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '30 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Downtown Location', description: 'Walk to restaurants/bars', category: 'experience' },
        { title: 'Michigan Craft Beer', description: 'Excellent selection', category: 'food' },
        { title: 'MSU Connection', description: 'Spartan fans common', category: 'experience' },
        { title: 'Capital City', description: 'Government worker crowds', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Downtown Lansing',
      description: 'Michigan\'s capital city with government and university presence',
      beforeGame: ['Old Town Lansing', 'Michigan Avenue shops', 'Capital building'],
      afterGame: ['Downtown bars', 'Old Town nightlife'],
      radius: '1 mile'
    },

    transportation: {
      address: '505 E Michigan Ave, Lansing, MI 48912',
      publicTransit: {
        bus: [
          { routes: ['CATA routes'], stops: ['Downtown Lansing'] }
        ]
      },
      driving: {
        majorRoutes: ['I-496', 'US-127', 'I-96'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-496 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Michigan Avenue',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate on game nights'
      }
    },

    history: {
      timeline: [
        { year: 1996, event: 'Oldsmobile Park opens' },
        { year: 1996, event: 'Lugnuts inaugural season' },
        { year: 2011, event: 'Renamed Jackson Field' },
        { year: 2021, event: 'Became Athletics affiliate' }
      ],
      traditions: [
        { name: 'Automotive Heritage', description: 'Celebrating Michigan auto industry' },
        { name: 'Capital City Baseball', description: 'Government appreciation' }
      ]
    },

    fanExperience: {
      atmosphere: 'Downtown energy with Michigan charm',
      bestExperiences: [
        'Downtown Lansing location',
        'Michigan craft beer selection',
        'Large facility for High-A',
        'Capital city atmosphere'
      ],
      traditions: [
        'Thirsty Thursday',
        'Fireworks Fridays',
        'Government appreciation nights'
      ],
      mascot: {
        name: 'Big Lug',
        description: 'Anthropomorphic lugnut mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Downtown parking ramps often cheaper',
        'Michigan craft beer selection excellent',
        'Explore Old Town before/after',
        'MSU nights draw bigger crowds'
      ],
      avoidThese: [
        'Right field lawn in afternoon sun',
        'Downtown traffic during events',
        'Missing the local beer selection'
      ],
      hiddenGems: [
        'River Trail access',
        'Old Town Lansing nearby',
        'Capital building walking distance',
        'Automotive history displays'
      ],
      photoSpots: [
        'Downtown skyline backdrop',
        'With Big Lug mascot',
        'Capitol dome visible',
        'Outfield deck views'
      ],
      bestValue: [
        'Lawn seating',
        'Upper deck seats',
        'Downtown ramp parking',
        'Thirsty Thursday deals'
      ]
    }
  }
};