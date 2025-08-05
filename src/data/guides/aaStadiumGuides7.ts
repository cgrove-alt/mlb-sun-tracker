import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides7: Record<string, StadiumGuide> = {
  'arkansas-travelers': {
    id: 'arkansas-travelers',
    name: 'Dickey-Stephens Park',
    team: 'Arkansas Travelers',
    opened: 2007,
    capacity: 7480,

    overview: {
      description: 'Dickey-Stephens Park sits along the Arkansas River in North Little Rock, serving as home to the Mariners Double-A affiliate with scenic river views and the downtown Little Rock skyline.',
      highlights: [
        'Mariners Double-A affiliate',
        'Arkansas River location',
        'Downtown skyline views',
        'Opened in 2007',
        'Bridge views'
      ],
      uniqueFeatures: [
        'Arkansas River setting',
        'Junction Bridge proximity',
        'Little Rock skyline backdrop',
        'Natural grass field',
        'Riverfront entertainment district'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2021, description: 'Concourse improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-220', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Arkansas summers hot and humid',
        'River breeze provides minimal relief',
        'Third base side preferred',
        'Evening games essential in summer'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 65, avgHumidity: 65, rainChance: 40, typicalConditions: 'Variable spring', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 74, avgHumidity: 68, rainChance: 45, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 82, avgHumidity: 69, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 87, avgHumidity: 68, rainChance: 30, typicalConditions: 'Very hot', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 87, avgHumidity: 67, rainChance: 30, typicalConditions: 'Peak heat', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 79, avgHumidity: 68, rainChance: 35, typicalConditions: 'Still warm', shadeTip: 'More comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Stephens Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Behind home plate premium level'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 800 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved', 'Bleachers'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Party Deck',
          capacity: '150',
          description: 'Left field group area',
          amenities: ['Bar service', 'Tables', 'River views']
        }
      ],
      tips: [
        { section: 'Stephens Club', tip: 'All-inclusive with A/C', category: 'experience' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Lawn', tip: 'Bring blanket for comfort', category: 'value' },
        { section: 'Behind home plate', tip: 'Best skyline views', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Travs Burger', 'Arkansas BBQ', 'Cheese dip nachos'],
      local: ['Arkansas BBQ', 'Catfish', 'Cheese dip', 'Sweet tea'],
      healthy: ['Grilled chicken', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local Arkansas beers', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Lost Forty', 'Stone\'s Throw', 'Flyway']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Riverfront Lot', distance: '300 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited availability',
        tip: 'Arrive early for street parking'
      },
      alternativeTransport: {
        publicTransit: ['Rock Region METRO'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'River Trail access'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch'
      },
      {
        name: 'River Gate',
        location: 'Left field',
        bestFor: ['Lawn', 'Party deck'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Travelers Team Store', exclusive: ['Travelers gear', 'Mariners items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Travelers_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Speed pitch'] }
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
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '30 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'River Views', description: 'Enjoy Arkansas River scenery', category: 'experience' },
        { title: 'Bridge Photo', description: 'Junction Bridge great backdrop', category: 'experience' },
        { title: 'Arkansas Heat', description: 'Evening games more comfortable', category: 'weather' },
        { title: 'Cheese Dip', description: 'Try Arkansas specialty', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Select games',
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
      name: 'North Little Rock Riverfront',
      description: 'Riverfront entertainment district with restaurants and attractions',
      beforeGame: ['River Market District', 'Junction Bridge walk', 'Downtown restaurants'],
      afterGame: ['Argenta nightlife', 'River Market bars'],
      radius: '1 mile'
    },

    transportation: {
      address: '400 W Broadway, North Little Rock, AR 72114',
      publicTransit: {
        bus: [
          { routes: ['Rock Region METRO'], stops: ['Broadway stop'] }
        ]
      },
      driving: {
        majorRoutes: ['I-30', 'I-40', 'US-67'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-30 to Broadway exit'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2007, event: 'Dickey-Stephens Park opens' },
        { year: 2007, event: 'Move from Ray Winder Field' },
        { year: 2017, event: 'Became Mariners affiliate' }
      ],
      traditions: [
        { name: 'Travs Tradition', description: 'Long Arkansas baseball history' },
        { name: 'River Celebrations', description: 'Arkansas River themed events' }
      ]
    },

    fanExperience: {
      atmosphere: 'Riverside baseball with Southern hospitality',
      bestExperiences: [
        'Arkansas River views',
        'Downtown Little Rock skyline',
        'Bridge proximity',
        'Southern BBQ'
      ],
      traditions: [
        'Strike Out Stroke Night',
        'Two Dollar Tuesday',
        'Fireworks Fridays'
      ],
      mascot: {
        name: 'Ace',
        description: 'Horse mascot representing Travelers heritage'
      }
    },

    proTips: {
      insiderTips: [
        'Junction Bridge walk before game',
        'River Market District nearby',
        'Try Arkansas cheese dip',
        'Evening games avoid heat'
      ],
      avoidThese: [
        'Day games in summer',
        'First base side in afternoon',
        'Limited parking on fireworks nights'
      ],
      hiddenGems: [
        'River Trail access',
        'Downtown Little Rock proximity',
        'Bridge views from park',
        'Argenta Arts District nearby'
      ],
      photoSpots: [
        'With Junction Bridge backdrop',
        'River views from concourse',
        'Downtown skyline from lawn',
        'With Ace mascot'
      ],
      bestValue: [
        'Lawn seating for families',
        'Two Dollar Tuesdays',
        'Upper reserved seats',
        'Group packages'
      ]
    }
  },

  'biloxi-shuckers': {
    id: 'biloxi-shuckers',
    name: 'MGM Park',
    team: 'Biloxi Shuckers',
    opened: 2015,
    capacity: 6076,

    overview: {
      description: 'MGM Park sits near the Gulf Coast beaches in Biloxi, serving as home to the Brewers Double-A affiliate with casino proximity and coastal charm.',
      highlights: [
        'Brewers Double-A affiliate',
        'Gulf Coast location',
        'Opened in 2015',
        'Casino district proximity',
        'Beach nearby'
      ],
      uniqueFeatures: [
        'Gulf Coast setting',
        'Casino district location',
        'Modern facility',
        'Natural grass field',
        'Coastal architecture'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-218', 'Suites'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Gulf Coast heat and humidity intense',
        'Sea breeze provides some relief',
        'Third base side preferred',
        'Evening games essential May-September'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper areas'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 73, avgHumidity: 72, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Shade helpful' },
        { month: 'May', avgTemp: 79, avgHumidity: 74, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Covered seating recommended' },
        { month: 'June', avgTemp: 85, avgHumidity: 75, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential' },
        { month: 'July', avgTemp: 88, avgHumidity: 76, rainChance: 45, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 88, avgHumidity: 76, rainChance: 45, typicalConditions: 'Peak heat and storms', shadeTip: 'Maximum protection needed' },
        { month: 'September', avgTemp: 83, avgHumidity: 74, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'Shade important' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Shuckers Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private bar'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Left field group area', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Upper reserved', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '200',
          description: 'Group party area',
          amenities: ['Full bar', 'Tables', 'Gulf views']
        }
      ],
      tips: [
        { section: 'Shuckers Club', tip: 'A/C relief from humidity', category: 'experience' },
        { section: 'Third base upper', tip: 'Best shade value', category: 'shade' },
        { section: 'Party Deck', tip: 'Social atmosphere', category: 'experience' },
        { section: 'Behind home plate', tip: 'Best overall views', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Shuckers Po\'boy', 'Gulf seafood', 'Crawfish nachos', 'Beignets'],
      local: ['Gulf Coast seafood', 'Cajun specialties', 'Po\'boys', 'Gumbo'],
      healthy: ['Grilled fish', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie options', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Snow cones'],
      alcohol: {
        beer: ['Lazy Magnolia', 'Gulf Coast beers', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Lazy Magnolia', 'Chandeleur', 'Crooked Letter']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Casino Lots', distance: '400 yards', price: 'Varies', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium or casino lots'
      },
      alternativeTransport: {
        publicTransit: ['Coast Transit Authority'],
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
        tip: 'Main entrance near casinos'
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
        { location: 'Shuckers Team Store', exclusive: ['Shuckers gear', 'Brewers items', 'Beach-themed merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Left field'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Multiple locations'],
      wifi: { available: true, network: 'MGMPark_WiFi' },
      chargingStations: ['Club areas', 'Concourse'],
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Bounce house', 'Speed pitch'] }
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
      parkingSpaces: '35 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Gulf Coast Seafood', description: 'Try local specialties', category: 'food' },
        { title: 'Casino District', description: 'Entertainment before/after', category: 'experience' },
        { title: 'Beach Proximity', description: 'Combine with beach visit', category: 'experience' },
        { title: 'Gulf Heat', description: 'Evening games essential', category: 'weather' }
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
      name: 'Biloxi Casino District',
      description: 'Entertainment district with casinos, restaurants, and Gulf beaches',
      beforeGame: ['Casinos', 'Beach', 'Seafood restaurants'],
      afterGame: ['Casino entertainment', 'Beach bars'],
      radius: '2 miles'
    },

    transportation: {
      address: '105 Caillavet St, Biloxi, MS 39530',
      publicTransit: {
        bus: [
          { routes: ['CTA routes'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-10', 'US-90', 'I-110'],
        typicalTraffic: 'Moderate, heavy during casino events',
        bestApproach: 'I-110 to Beach Boulevard'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2015, event: 'MGM Park opens' },
        { year: 2015, event: 'Shuckers inaugural season' },
        { year: 2015, event: 'First new team since 1999' }
      ],
      traditions: [
        { name: 'Shuck Nation', description: 'Fan base identity' },
        { name: 'Gulf Coast Pride', description: 'Coastal culture celebration' }
      ]
    },

    fanExperience: {
      atmosphere: 'Gulf Coast party atmosphere with baseball',
      bestExperiences: [
        'Gulf Coast seafood',
        'Modern amenities',
        'Casino district energy',
        'Beach proximity'
      ],
      traditions: [
        'Shuck Yeah Fridays',
        'Thirsty Thursday',
        'Sunday Family Fun Day'
      ],
      mascot: {
        name: 'Schooner and Biscuit',
        description: 'Oyster mascots representing Shuckers'
      }
    },

    proTips: {
      insiderTips: [
        'Casino parking garages offer shade',
        'Try Gulf seafood specialties',
        'Beach visit before day games',
        'Club level worth it for A/C'
      ],
      avoidThese: [
        'Day games in summer heat',
        'Underestimating Gulf humidity',
        'First base side in afternoon'
      ],
      hiddenGems: [
        'Beach walking distance',
        'Casino entertainment packages',
        'Gulf seafood quality',
        'Modern facility amenities'
      ],
      photoSpots: [
        'With Schooner and Biscuit',
        'Casino lights backdrop',
        'Modern entrance plaza',
        'Gulf Coast themed areas'
      ],
      bestValue: [
        'Thirsty Thursday deals',
        'Casino parking validation',
        'Group packages',
        'Sunday family specials'
      ]
    }
  },

  'birmingham-barons': {
    id: 'birmingham-barons',
    name: 'Regions Field',
    team: 'Birmingham Barons',
    opened: 2013,
    capacity: 8500,

    overview: {
      description: 'Regions Field in downtown Birmingham is one of the finest facilities in Double-A baseball, serving as home to the White Sox affiliate with city skyline views and modern amenities.',
      highlights: [
        'White Sox Double-A affiliate',
        'Downtown Birmingham location',
        'Opened in 2013',
        'City skyline views',
        'Railroad Park adjacent'
      ],
      uniqueFeatures: [
        'Birmingham skyline backdrop',
        'Railroad Park proximity',
        'Modern architecture',
        'Natural grass field',
        'Urban ballpark design'
      ],
      renovations: [
        { year: 2019, description: 'LED lighting upgrade' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-220', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Alabama summers very hot and humid',
        'Urban setting intensifies heat',
        'Third base side preferred',
        'Evening games much more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 67, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 76, avgHumidity: 69, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 83, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 87, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 87, avgHumidity: 71, rainChance: 35, typicalConditions: 'Peak heat', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 80, avgHumidity: 69, rainChance: 30, typicalConditions: 'Still warm', shadeTip: 'More bearable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Regions Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private bar'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Outfield Plaza', description: 'Standing room party area', capacity: 300 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Outfield plaza', 'Concourse areas'],
      partyAreas: [
        {
          name: 'Outfield Plaza',
          capacity: '300',
          description: 'Standing room party area',
          amenities: ['Full bar', 'Food trucks', 'Games']
        }
      ],
      tips: [
        { section: 'Regions Club', tip: 'All-inclusive with A/C', category: 'experience' },
        { section: 'Behind home plate', tip: 'Best skyline views', category: 'view' },
        { section: 'Third base upper', tip: 'Best shade value', category: 'shade' },
        { section: 'Outfield Plaza', tip: 'Social standing room', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Birmingham BBQ', 'Dreamland ribs', 'Fried green tomatoes'],
      local: ['Alabama BBQ', 'Southern specialties', 'Sweet tea', 'Fried chicken'],
      healthy: ['Grilled options', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Good People', 'Avondale', 'Alabama craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Good People', 'Avondale', 'Cahaba', 'TrimTab']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Downtown Decks', distance: '0.3 miles', price: '$5-15', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 6 PM',
        tip: 'Free after 6 PM on streets'
      },
      alternativeTransport: {
        publicTransit: ['Birmingham public transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks and Zyp BikeShare'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch',
        tip: 'Downtown entrance'
      },
      {
        name: 'First Base Gate',
        location: 'First base side',
        bestFor: ['First base seating'],
        openTime: '60 minutes before first pitch'
      },
      {
        name: 'Third Base Gate',
        location: 'Third base side',
        bestFor: ['Third base seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Barons Team Store', exclusive: ['Barons gear', 'White Sox items', 'Birmingham merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Upper concourse'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Multiple locations'],
      wifi: { available: true, network: 'Regions_WiFi' },
      chargingStations: ['Club areas', 'Concourse'],
      kidZones: [
        { name: 'Kids Zone', location: 'Left field', activities: ['Playground', 'Speed pitch', 'Bounce house'] }
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
      parkingSpaces: '40+ ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Downtown Location', description: 'Walk to restaurants/bars', category: 'experience' },
        { title: 'Railroad Park', description: 'Visit before games', category: 'experience' },
        { title: 'Alabama BBQ', description: 'Try Dreamland ribs', category: 'food' },
        { title: 'Summer Heat', description: 'Evening games essential', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Select games',
        firstPitch: 'Varies by day',
        rushHours: ['45 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Downtown Birmingham',
      description: 'Revitalized downtown with restaurants, bars, and entertainment',
      beforeGame: ['Railroad Park', 'Downtown restaurants', 'Civil Rights District'],
      afterGame: ['Downtown nightlife', 'Uptown entertainment'],
      radius: '1 mile'
    },

    transportation: {
      address: '1401 1st Ave S, Birmingham, AL 35233',
      publicTransit: {
        bus: [
          { routes: ['MAX Transit'], stops: ['Downtown stops'] }
        ]
      },
      driving: {
        majorRoutes: ['I-20/59', 'I-65', 'US-280'],
        typicalTraffic: 'Moderate downtown traffic',
        bestApproach: 'I-20/59 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2013, event: 'Regions Field opens' },
        { year: 2013, event: 'Return to Birmingham' },
        { year: 1885, event: 'Birmingham baseball tradition begins' }
      ],
      traditions: [
        { name: 'Birmingham Baseball', description: 'Rich baseball history' },
        { name: 'Negro League Heritage', description: 'Black Barons legacy' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern downtown baseball with Southern hospitality',
      bestExperiences: [
        'Downtown Birmingham location',
        'Modern facility amenities',
        'Alabama BBQ',
        'City skyline views'
      ],
      traditions: [
        'Thirsty Thursday',
        'Friday Fireworks',
        'Negro League tributes'
      ],
      mascot: {
        name: 'Biscuit',
        description: 'Barons mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Railroad Park great before games',
        'Downtown dining excellent',
        'Try Dreamland BBQ at park',
        'Club level worth it for heat'
      ],
      avoidThese: [
        'Day games in summer',
        'Downtown parking meters',
        'First base side in afternoon'
      ],
      hiddenGems: [
        'Negro League Museum nearby',
        'Railroad Park connection',
        'Downtown Birmingham renaissance',
        'Civil Rights history'
      ],
      photoSpots: [
        'Birmingham skyline backdrop',
        'With Biscuit mascot',
        'Railroad Park views',
        'Modern entrance plaza'
      ],
      bestValue: [
        'Thirsty Thursday deals',
        'Downtown deck parking',
        'Standing room plaza',
        'Group packages'
      ]
    }
  }
};