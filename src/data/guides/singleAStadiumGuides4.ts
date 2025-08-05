import { StadiumGuide } from '../stadiumGuides';

export const singleAStadiumGuides4: Record<string, StadiumGuide> = {
  'lynchburg-hillcats': {
    id: 'lynchburg-hillcats',
    name: 'Bank of the James Stadium',
    team: 'Lynchburg Hillcats',
    opened: 1940,
    capacity: 4291,

    overview: {
      description: 'Bank of the James Stadium, formerly City Stadium, is a historic venue serving as home to the Guardians Single-A affiliate with Blue Ridge Mountain views and classic charm.',
      highlights: [
        'Guardians Single-A affiliate',
        'Historic venue since 1940',
        'Blue Ridge Mountain views',
        'Downtown Lynchburg proximity',
        'Classic ballpark atmosphere'
      ],
      uniqueFeatures: [
        'Mountain backdrop',
        'Historic grandstand',
        'Natural grass field',
        'Traditional architecture',
        'James River valley location'
      ],
      renovations: [
        { year: 1995, description: 'Major renovation' },
        { year: 2018, description: 'Additional improvements' },
        { year: 2021, description: 'Facility upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Covered grandstand'],
        afternoon: ['Under grandstand roof', 'Third base boxes'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Grandstand roof sections', 'Box seats'],
      shadeTips: [
        'Virginia summers moderate but humid',
        'Mountain location provides some relief',
        'Third base side preferred',
        'Evening games comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Under grandstand'],
        indoorAreas: ['Limited indoor spaces'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'General admission areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 61, avgHumidity: 62, rainChance: 35, typicalConditions: 'Cool spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 70, avgHumidity: 65, rainChance: 40, typicalConditions: 'Pleasant', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 81, avgHumidity: 70, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'August', avgTemp: 80, avgHumidity: 71, rainChance: 35, typicalConditions: 'Continued heat', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 73, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant evenings' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Limited suites'],
          amenities: ['Enhanced seating']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Left field group area', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Limited concourse areas'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '150',
          description: 'Group area',
          amenities: ['Picnic area', 'Standing room']
        }
      ],
      tips: [
        { section: 'Grandstand', tip: 'Historic covered seating', category: 'shade' },
        { section: 'Behind home plate', tip: 'Classic baseball views', category: 'view' },
        { section: 'Third base side', tip: 'Mountain views', category: 'view' },
        { section: 'Bleachers', tip: 'Budget-friendly', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Hill City Dogs', 'Mountain BBQ', 'Virginia peanuts'],
      local: ['Virginia BBQ', 'Local specialties', 'Sweet tea'],
      healthy: ['Limited healthy options'],
      vegetarian: ['Basic options'],
      glutenFree: ['Very limited'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Limited craft selection'],
        wine: false,
        cocktails: false,
        localBreweries: ['Starr Hill', 'Devils Backbone']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: 'Free', shadedSpots: false, covered: false },
        { name: 'Street Parking', distance: 'Variable', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited on game days',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Limited bus service'],
        rideShare: 'Uber and Lyft available',
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
        { location: 'Hillcats Team Store', exclusive: ['Hillcats gear', 'Guardians items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Limited facilities'],
      atms: ['Main entrance'],
      wifi: { available: false },
      kidZones: [
        { name: 'Kids Area', location: 'Right field', activities: ['Small play area'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Limited accessible areas'],
        entrance: 'Main gate accessible',
        elevators: ['Not applicable']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Limited'],
      accessibleConcessions: ['Main stand'],
      parkingSpaces: '10 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Historic Charm', description: 'Classic ballpark experience', category: 'experience' },
        { title: 'Mountain Views', description: 'Blue Ridge backdrop', category: 'experience' },
        { title: 'Virginia BBQ', description: 'Try local style', category: 'food' },
        { title: 'Small Park', description: 'Intimate atmosphere', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 6:30 PM',
        rushHours: ['Game time arrival']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: false
      }
    },

    neighborhood: {
      name: 'Lynchburg',
      description: 'Historic Virginia city in Blue Ridge foothills',
      beforeGame: ['Downtown Lynchburg', 'Riverwalk'],
      afterGame: ['Downtown restaurants'],
      radius: '3 miles'
    },

    transportation: {
      address: '3180 Fort Ave, Lynchburg, VA 24501',
      publicTransit: {
        bus: [
          { routes: ['GLTC'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['US-29', 'US-460', 'US-501'],
        typicalTraffic: 'Light',
        bestApproach: 'US-29 to Fort Avenue'
      },
      rideShare: {
        pickupZone: 'Stadium area',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1940, event: 'City Stadium opens' },
        { year: 1995, event: 'Hillcats begin play' },
        { year: 2022, event: 'Became Guardians affiliate' }
      ],
      traditions: [
        { name: 'Historic Baseball', description: 'Long minor league tradition' },
        { name: 'Hill City Pride', description: 'Community support' }
      ]
    },

    fanExperience: {
      atmosphere: 'Classic small-town baseball with mountain charm',
      bestExperiences: [
        'Historic ballpark feel',
        'Blue Ridge Mountain views',
        'Small-town atmosphere',
        'Affordable family fun'
      ],
      traditions: [
        'Thirsty Thursday',
        'Friday Fireworks',
        'Sunday Family Day'
      ],
      mascot: {
        name: 'Southpaw',
        description: 'Hillcat mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Free parking available',
        'Mountain views from third base',
        'Historic charm authentic',
        'Downtown Lynchburg walkable'
      ],
      avoidThese: [
        'Limited amenities',
        'Bleachers on hot days',
        'Expecting modern facilities'
      ],
      hiddenGems: [
        'Blue Ridge Mountain backdrop',
        'Historic ballpark features',
        'Downtown Lynchburg nearby',
        'James River proximity'
      ],
      photoSpots: [
        'Mountain backdrop',
        'Historic grandstand',
        'With Southpaw mascot',
        'Classic entrance'
      ],
      bestValue: [
        'Free parking',
        'Affordable tickets',
        'General admission',
        'Family deals'
      ]
    }
  },

  'myrtle-beach-pelicans': {
    id: 'myrtle-beach-pelicans',
    name: 'Pelicans Ballpark',
    team: 'Myrtle Beach Pelicans',
    opened: 1999,
    capacity: 6599,

    overview: {
      description: 'Pelicans Ballpark serves as home to the Cubs Single-A affiliate, located just minutes from the famous Myrtle Beach attractions and offering a beach vacation baseball experience.',
      highlights: [
        'Cubs Single-A affiliate',
        'Beach resort location',
        'Tourist destination setting',
        'Family entertainment focus',
        'Vacation atmosphere'
      ],
      uniqueFeatures: [
        'Beach proximity',
        'Tourist area integration',
        'Natural grass field',
        'Coastal design elements',
        'Entertainment district location'
      ],
      renovations: [
        { year: 2011, description: 'Facility improvements' },
        { year: 2018, description: 'Seating upgrades' },
        { year: 2021, description: 'Concourse renovations' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Box seats'],
        afternoon: ['Sections 200-210', 'Covered areas'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Limited covered areas', 'Premium sections'],
      shadeTips: [
        'Coastal heat and humidity intense',
        'Ocean breeze provides minimal relief',
        'Third base side preferred',
        'Evening games essential summer'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Team store', 'Limited indoor spaces'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 70, avgHumidity: 70, rainChance: 25, typicalConditions: 'Pleasant coastal', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 77, avgHumidity: 72, rainChance: 30, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 83, avgHumidity: 74, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'July', avgTemp: 87, avgHumidity: 76, rainChance: 40, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 86, avgHumidity: 77, rainChance: 45, typicalConditions: 'Peak heat and storms', shadeTip: 'Maximum protection' },
        { month: 'September', avgTemp: 81, avgHumidity: 74, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'Shade important' }
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
          { name: 'Tiki Terrace', description: 'Left field party area', capacity: 200 },
          { name: 'Budweiser Pavilion', description: 'Right field group area', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Family sections available'],
      standingRoom: ['Concourse areas', 'Party decks'],
      partyAreas: [
        {
          name: 'Tiki Terrace',
          capacity: '200',
          description: 'Beach-themed party area',
          amenities: ['Bar service', 'Tropical atmosphere']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best overall views', category: 'view' },
        { section: 'Third base side', tip: 'Better shade coverage', category: 'shade' },
        { section: 'Tiki Terrace', tip: 'Party atmosphere', category: 'experience' },
        { section: 'Bleachers', tip: 'Budget but hot', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Beach Dogs', 'Coastal seafood', 'Funnel cakes'],
      local: ['Seafood options', 'Beach fare', 'Southern specialties'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Limited options', 'Pizza'],
      glutenFree: ['Very limited'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Beach beers', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['New South', 'Grand Strand']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '400 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots'
      },
      alternativeTransport: {
        publicTransit: ['Coast RTA'],
        rideShare: 'Uber and Lyft available',
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
        { location: 'Pelicans Team Store', exclusive: ['Pelicans gear', 'Cubs items', 'Beach-themed merchandise'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations'],
      wifi: { available: true },
      kidZones: [
        { name: 'Splash Zone', location: 'Right field', activities: ['Playground', 'Water features'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated accessible areas'],
        entrance: 'All gates accessible',
        elevators: ['To suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '25 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Beach Vacation Baseball', description: 'Combine with beach trip', category: 'experience' },
        { title: 'Tourist Area', description: 'Broadway at the Beach nearby', category: 'experience' },
        { title: 'Coastal Heat', description: 'Evening games essential', category: 'weather' },
        { title: 'Family Entertainment', description: 'Lots of kids activities', category: 'experience' }
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
      name: 'Myrtle Beach',
      description: 'Major beach resort and tourist destination',
      beforeGame: ['Beach', 'Broadway at the Beach', 'Mini golf'],
      afterGame: ['Beach bars', 'Entertainment venues'],
      radius: '5 miles'
    },

    transportation: {
      address: '1251 21st Ave N, Myrtle Beach, SC 29577',
      publicTransit: {
        bus: [
          { routes: ['Coast RTA'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['US-17', 'US-501', 'SC-31'],
        typicalTraffic: 'Heavy in tourist season',
        bestApproach: 'US-17 to 21st Avenue'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'High in tourist season'
      }
    },

    history: {
      timeline: [
        { year: 1999, event: 'Coastal Federal Field opens' },
        { year: 1999, event: 'Pelicans begin play' },
        { year: 2015, event: 'Became Cubs affiliate' }
      ],
      traditions: [
        { name: 'Beach Baseball', description: 'Vacation atmosphere' },
        { name: 'Tourist Friendly', description: 'Entertainment focus' }
      ]
    },

    fanExperience: {
      atmosphere: 'Beach vacation baseball with family fun',
      bestExperiences: [
        'Beach proximity',
        'Tourist attractions nearby',
        'Family entertainment',
        'Vacation atmosphere'
      ],
      traditions: [
        'Thirsty Thursday',
        'Friday Fireworks',
        'Splash the Pelican'
      ],
      mascot: {
        name: 'Splash',
        description: 'Pelican mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Combine with beach day',
        'Broadway at the Beach nearby',
        'Tourist season busy',
        'Evening games cooler'
      ],
      avoidThese: [
        'Day games in summer',
        'Tourist traffic peaks',
        'First base side afternoon'
      ],
      hiddenGems: [
        'Beach just minutes away',
        'Entertainment district location',
        'Mini golf capital nearby',
        'Coastal atmosphere'
      ],
      photoSpots: [
        'With Splash mascot',
        'Tiki Terrace',
        'Beach-themed areas',
        'Pelican entrance'
      ],
      bestValue: [
        'General admission',
        'Weeknight games',
        'Group packages',
        'Tourist combo deals'
      ]
    }
  },

  'salem-red-sox': {
    id: 'salem-red-sox',
    name: 'Carilion Clinic Field at Salem Memorial Ballpark',
    team: 'Salem Red Sox',
    opened: 1995,
    capacity: 6300,

    overview: {
      description: 'Salem Memorial Ballpark sits in the Roanoke Valley serving as home to the Red Sox Single-A affiliate, featuring Blue Ridge Mountain views and Virginia hospitality.',
      highlights: [
        'Red Sox Single-A affiliate',
        'Roanoke Valley location',
        'Blue Ridge Mountain views',
        'Modern facility',
        'Strong Red Sox connection'
      ],
      uniqueFeatures: [
        'Mountain valley setting',
        'Natural grass field',
        'Modern amenities',
        'Red Sox heritage displays',
        'Appalachian backdrop'
      ],
      renovations: [
        { year: 2008, description: 'Facility improvements' },
        { year: 2019, description: 'Naming rights change' },
        { year: 2021, description: 'Seating upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Box seats'],
        afternoon: ['Sections 200-210', 'Club areas'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Limited covered areas', 'Premium sections'],
      shadeTips: [
        'Mountain location moderates heat',
        'Virginia summers still warm',
        'Third base side preferred',
        'Evening games comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Team store', 'Club areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 61, rainChance: 35, typicalConditions: 'Cool spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 69, avgHumidity: 64, rainChance: 40, typicalConditions: 'Pleasant', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 76, avgHumidity: 67, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 80, avgHumidity: 69, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating better' },
        { month: 'August', avgTemp: 79, avgHumidity: 70, rainChance: 35, typicalConditions: 'Continued warmth', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 72, avgHumidity: 67, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant evenings' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Left field group area', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats'],
      familySections: ['Family Zone sections'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Green Monster Deck',
          capacity: '200',
          description: 'Left field party area',
          amenities: ['Bar service', 'Standing room']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views', category: 'view' },
        { section: 'Third base side', tip: 'Mountain views and shade', category: 'view' },
        { section: 'Party Deck', tip: 'Social atmosphere', category: 'experience' },
        { section: 'Bleachers', tip: 'Budget-friendly', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Salem Dogs', 'Mountain BBQ', 'Red Sox favorites'],
      local: ['Virginia BBQ', 'Appalachian specialties', 'Local craft items'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie options', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Virginia craft beers', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Salem Brewing', 'Parkway Brewing', 'Olde Salem']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$3', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '300 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited on game days',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Valley Metro'],
        rideShare: 'Uber and Lyft available',
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
        { location: 'Red Sox Team Store', exclusive: ['Salem Red Sox gear', 'Boston items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true },
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated accessible areas'],
        entrance: 'Main gate accessible',
        elevators: ['To suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '20 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Mountain Views', description: 'Blue Ridge backdrop', category: 'experience' },
        { title: 'Red Sox Connection', description: 'Boston organization', category: 'experience' },
        { title: 'Valley Location', description: 'Cooler than expected', category: 'weather' },
        { title: 'Virginia BBQ', description: 'Try local style', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:05 PM',
        rushHours: ['30-45 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Salem',
      description: 'Roanoke Valley city with mountain charm',
      beforeGame: ['Downtown Salem', 'Roanoke attractions'],
      afterGame: ['Local restaurants', 'Downtown Roanoke'],
      radius: '5 miles'
    },

    transportation: {
      address: '1004 Texas St, Salem, VA 24153',
      publicTransit: {
        bus: [
          { routes: ['Valley Metro'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['I-81', 'US-460', 'Route 419'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-81 to Exit 140'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1995, event: 'Salem Memorial Ballpark opens' },
        { year: 2009, event: 'Became Red Sox affiliate' },
        { year: 2019, event: 'Carilion Clinic naming rights' }
      ],
      traditions: [
        { name: 'Red Sox Heritage', description: 'Boston connection strong' },
        { name: 'Valley Baseball', description: 'Community support' }
      ]
    },

    fanExperience: {
      atmosphere: 'Mountain valley baseball with Red Sox tradition',
      bestExperiences: [
        'Blue Ridge Mountain views',
        'Red Sox organization presence',
        'Modern facility',
        'Valley hospitality'
      ],
      traditions: [
        'Thirsty Thursday',
        'Friday Fireworks',
        'Red Sox heritage nights'
      ],
      mascot: {
        name: 'Mugsy',
        description: 'Red Sox character'
      }
    },

    proTips: {
      insiderTips: [
        'Mountain views from third base',
        'Affordable parking',
        'Red Sox rehabs common',
        'Downtown Salem walkable'
      ],
      avoidThese: [
        'First base afternoon sun',
        'Limited parking big games',
        'I-81 construction delays'
      ],
      hiddenGems: [
        'Blue Ridge Parkway nearby',
        'Roanoke attractions close',
        'Mountain valley setting',
        'Red Sox player development'
      ],
      photoSpots: [
        'Mountain backdrop',
        'With Mugsy mascot',
        'Red Sox signage',
        'Valley views'
      ],
      bestValue: [
        'Cheap parking',
        'General admission',
        'Weeknight games',
        'Family packages'
      ]
    }
  }
};