import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides8: Record<string, StadiumGuide> = {
  'bradenton-marauders': {
    id: 'bradenton-marauders',
    name: 'LECOM Park',
    team: 'Bradenton Marauders',
    opened: 1923,
    capacity: 8500,

    overview: {
      description: 'LECOM Park in Bradenton is one of the oldest spring training facilities in baseball, serving as both the Pirates spring home and their Single-A affiliate venue with historic charm and Gulf Coast atmosphere.',
      highlights: [
        'Pirates Single-A affiliate',
        'Historic venue since 1923',
        'Spring training facility',
        'Gulf Coast location',
        'Spanish Mission architecture'
      ],
      uniqueFeatures: [
        'Historic grandstand',
        'Spanish Mission style',
        'Spring training heritage',
        'Natural grass field',
        'Manatee River proximity'
      ],
      renovations: [
        { year: 1993, description: 'Major renovation' },
        { year: 2013, description: 'Additional improvements' },
        { year: 2017, description: 'Seating upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base grandstand', 'Covered areas'],
        afternoon: ['Under grandstand roof', 'Third base side'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Grandstand roof sections', 'Premium areas'],
      shadeTips: [
        'Florida sun intense year-round',
        'Historic grandstand provides cover',
        'Third base side preferred',
        'Evening games much better'
      ],
      sunProtection: {
        shadedConcourses: ['Under grandstand'],
        indoorAreas: ['Limited indoor spaces'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Outfield bleachers', 'First base side'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 78, avgHumidity: 67, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Shade helpful' },
        { month: 'May', avgTemp: 83, avgHumidity: 68, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Covered seating ideal' },
        { month: 'June', avgTemp: 87, avgHumidity: 73, rainChance: 45, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential' },
        { month: 'July', avgTemp: 89, avgHumidity: 75, rainChance: 50, typicalConditions: 'Very hot, afternoon storms', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 89, avgHumidity: 76, rainChance: 50, typicalConditions: 'Peak heat and storms', shadeTip: 'Maximum protection needed' },
        { month: 'September', avgTemp: 86, avgHumidity: 74, rainChance: 45, typicalConditions: 'Still very warm', shadeTip: 'Shade important' }
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
      budgetOptions: ['General admission', 'Bleacher seats', 'Lawn areas'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '150',
          description: 'Group area',
          amenities: ['Bar service', 'Standing room']
        }
      ],
      tips: [
        { section: 'Grandstand', tip: 'Historic covered seating', category: 'shade' },
        { section: 'Behind home plate', tip: 'Best traditional views', category: 'view' },
        { section: 'Third base side', tip: 'Better shade angles', category: 'shade' },
        { section: 'Bleachers', tip: 'Budget but no shade', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Cuban sandwich', 'Grouper sandwich', 'Key lime pie'],
      local: ['Gulf seafood', 'Cuban food', 'Florida citrus', 'Tropical drinks'],
      healthy: ['Grilled fish', 'Salads'],
      vegetarian: ['Veggie options', 'Salads'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Ice cream', 'Snow cones'],
      alcohol: {
        beer: ['Florida craft beers', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Motorworks', '3 Daughters', 'Big Top']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Street Parking', distance: 'Variable', price: 'Free/Metered', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Some metered areas',
        tip: 'Free spots available nearby'
      },
      alternativeTransport: {
        publicTransit: ['MCAT bus service'],
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
        { location: 'Team Store', exclusive: ['Marauders gear', 'Pirates items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: false },
      kidZones: [
        { name: 'Kids Area', location: 'Right field', activities: ['Playground'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'Main gate accessible',
        elevators: ['Limited']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '15 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Historic Venue', description: 'Spring training heritage', category: 'experience' },
        { title: 'Gulf Coast Location', description: 'Beach proximity', category: 'experience' },
        { title: 'Florida Heat', description: 'Evening games essential', category: 'weather' },
        { title: 'Cuban Sandwich', description: 'Local specialty', category: 'food' }
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
      name: 'Downtown Bradenton',
      description: 'Historic Florida Gulf Coast city',
      beforeGame: ['Downtown Bradenton', 'Riverwalk', 'Beaches'],
      afterGame: ['Downtown restaurants', 'Beach bars'],
      radius: '3 miles'
    },

    transportation: {
      address: '1611 9th St W, Bradenton, FL 34205',
      publicTransit: {
        bus: [
          { routes: ['MCAT'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-75', 'US-41', 'US-301'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-75 to SR-64 West'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1923, event: 'McKechnie Field opens' },
        { year: 2017, event: 'Renamed LECOM Park' },
        { year: 1969, event: 'Pirates spring training begins' }
      ],
      traditions: [
        { name: 'Spring Training Heritage', description: 'Long history of baseball' },
        { name: 'Pirates Connection', description: 'Organization presence' }
      ]
    },

    fanExperience: {
      atmosphere: 'Historic Florida baseball with spring training charm',
      bestExperiences: [
        'Historic ballpark atmosphere',
        'Spring training heritage',
        'Gulf Coast setting',
        'Pirates organization presence'
      ],
      traditions: [
        'Spring training nostalgia',
        'Florida baseball culture',
        'Pirates traditions'
      ],
      mascot: {
        name: 'Marty the Marauder',
        description: 'Pirate-themed mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Historic charm worth experiencing',
        'Beach visit before games',
        'Try Cuban sandwich',
        'Spring training museum onsite'
      ],
      avoidThese: [
        'Afternoon games in summer',
        'Outfield bleachers midday',
        'Limited shade expectations'
      ],
      hiddenGems: [
        'Spring training history',
        'Spanish Mission architecture',
        'Downtown Bradenton nearby',
        'Beach proximity'
      ],
      photoSpots: [
        'Historic grandstand',
        'Spanish Mission entrance',
        'With Marty mascot',
        'Palm tree backdrop'
      ],
      bestValue: [
        'General admission flexibility',
        'Bleacher seats',
        'Weeknight games',
        'Group rates'
      ]
    }
  },

  'clearwater-threshers': {
    id: 'clearwater-threshers',
    name: 'BayCare Ballpark',
    team: 'Clearwater Threshers',
    opened: 2004,
    capacity: 8500,

    overview: {
      description: 'BayCare Ballpark serves as both the Phillies spring training home and their Single-A affiliate venue, featuring modern amenities and Gulf Coast beach proximity.',
      highlights: [
        'Phillies Single-A affiliate',
        'Spring training facility',
        'Opened in 2004',
        'Clearwater Beach nearby',
        'Modern amenities'
      ],
      uniqueFeatures: [
        'Tiki Pavilion',
        'Beach-themed atmosphere',
        'Natural grass field',
        'Spring training quality',
        'Gulf Coast setting'
      ],
      renovations: [
        { year: 2017, description: 'Clubhouse renovations' },
        { year: 2020, description: 'Seating improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 200-210', 'Covered areas'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Club level', 'Premium sections', 'Tiki Pavilion'],
      shadeTips: [
        'Florida sun intense',
        'Gulf breeze helps slightly',
        'Third base side preferred',
        'Evening games essential summer'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper areas'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 78, avgHumidity: 68, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 83, avgHumidity: 69, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Shade becoming important' },
        { month: 'June', avgTemp: 87, avgHumidity: 74, rainChance: 45, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 89, avgHumidity: 76, rainChance: 50, typicalConditions: 'Very hot, storms', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 89, avgHumidity: 77, rainChance: 50, typicalConditions: 'Peak heat', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 86, avgHumidity: 75, rainChance: 40, typicalConditions: 'Still hot', shadeTip: 'Shade essential' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Frenchy\'s Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Premium level'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Tiki Pavilion', description: 'Left field party area', capacity: 200 },
          { name: 'Outfield Lawn', description: 'Grass berm seating', capacity: 1500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved', 'Bleachers'],
      familySections: ['Family Zone sections'],
      standingRoom: ['Concourse areas', 'Tiki Pavilion'],
      partyAreas: [
        {
          name: 'Frenchy\'s Tiki Pavilion',
          capacity: '200',
          description: 'Beach-themed party area',
          amenities: ['Full bar', 'Beach atmosphere', 'Group seating']
        }
      ],
      tips: [
        { section: 'Frenchy\'s Club', tip: 'A/C and all-inclusive', category: 'experience' },
        { section: 'Tiki Pavilion', tip: 'Party atmosphere', category: 'experience' },
        { section: 'Third base side', tip: 'Better shade', category: 'shade' },
        { section: 'Lawn', tip: 'Bring blanket', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Frenchy\'s grouper sandwich', 'Beach fries', 'Tropical drinks'],
      local: ['Gulf seafood', 'Cuban sandwiches', 'Key lime pie', 'Florida citrus'],
      healthy: ['Grilled fish', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Florida craft beers', 'Beach-themed drinks'],
        wine: true,
        cocktails: true,
        localBreweries: ['Cage Brewing', 'Pair O\' Dice', 'Brew Bus']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '400 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots'
      },
      alternativeTransport: {
        publicTransit: ['PSTA bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch',
        tip: 'Spring training entrance'
      },
      {
        name: 'Left Field Gate',
        location: 'Outfield entrance',
        bestFor: ['Tiki Pavilion', 'Lawn'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Threshers Team Store', exclusive: ['Threshers gear', 'Phillies items', 'Beach-themed merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Outfield'],
      babyChanging: ['Family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Multiple locations'],
      wifi: { available: true, network: 'BayCare_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Phin\'s Fun Zone', location: 'Right field', activities: ['Playground', 'Games', 'Speed pitch'] }
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
      parkingSpaces: '40 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Beach Day Combo', description: 'Visit Clearwater Beach before', category: 'experience' },
        { title: 'Spring Training Quality', description: 'Major league facility', category: 'experience' },
        { title: 'Florida Heat', description: 'Evening games better', category: 'weather' },
        { title: 'Grouper Sandwich', description: 'Frenchy\'s specialty', category: 'food' }
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
      name: 'Clearwater',
      description: 'Gulf Coast city famous for beaches',
      beforeGame: ['Clearwater Beach', 'Beach Walk', 'Pier 60'],
      afterGame: ['Beach bars', 'Downtown Clearwater'],
      radius: '5 miles'
    },

    transportation: {
      address: '601 N Old Coachman Rd, Clearwater, FL 33765',
      publicTransit: {
        bus: [
          { routes: ['PSTA routes'], stops: ['Drew Street'] }
        ]
      },
      driving: {
        majorRoutes: ['US-19', 'SR-60', 'I-275'],
        typicalTraffic: 'Moderate, heavy beach days',
        bestApproach: 'US-19 to Drew Street'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on beach days'
      }
    },

    history: {
      timeline: [
        { year: 2004, event: 'Bright House Field opens' },
        { year: 2017, event: 'Renamed Spectrum Field' },
        { year: 2021, event: 'Becomes BayCare Ballpark' }
      ],
      traditions: [
        { name: 'Spring Training Home', description: 'Phillies presence' },
        { name: 'Beach Baseball', description: 'Gulf Coast culture' }
      ]
    },

    fanExperience: {
      atmosphere: 'Beach-themed baseball with spring training quality',
      bestExperiences: [
        'Clearwater Beach proximity',
        'Spring training facility',
        'Tiki Pavilion party',
        'Gulf Coast atmosphere'
      ],
      traditions: [
        'Thirsty Thursday',
        'Beach Night',
        'Fireworks Friday'
      ],
      mascot: {
        name: 'Phinley',
        description: 'Thresher shark mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Combine with beach visit',
        'Frenchy\'s grouper sandwich must-try',
        'Tiki Pavilion for groups',
        'Spring training quality facility'
      ],
      avoidThese: [
        'Afternoon summer games',
        'Beach traffic on weekends',
        'First base side afternoon sun'
      ],
      hiddenGems: [
        'Beach proximity unique',
        'Spring training museum',
        'Phillies player rehabs',
        'Clearwater Marine Aquarium nearby'
      ],
      photoSpots: [
        'Tiki Pavilion atmosphere',
        'With Phinley mascot',
        'Palm tree entrance',
        'Spring training signage'
      ],
      bestValue: [
        'Lawn seating flexibility',
        'Thirsty Thursday deals',
        'Beach and baseball combo',
        'Group packages'
      ]
    }
  },

  'dunedin-blue-jays': {
    id: 'dunedin-blue-jays',
    name: 'TD Ballpark',
    team: 'Dunedin Blue Jays',
    opened: 1990,
    capacity: 8500,

    overview: {
      description: 'TD Ballpark serves as both the Blue Jays spring training home and their Single-A affiliate venue, recently renovated with state-of-the-art facilities and Gulf Coast charm.',
      highlights: [
        'Blue Jays Single-A affiliate',
        'Spring training facility',
        'Major 2020 renovation',
        'Gulf Coast location',
        'Canadian connection'
      ],
      uniqueFeatures: [
        'Newly renovated facility',
        '360-degree concourse',
        'Natural grass field',
        'Spring training quality',
        'Modern amenities'
      ],
      renovations: [
        { year: 2020, description: '$81 million complete renovation' },
        { year: 2020, description: 'New seating bowl and concourse' },
        { year: 2020, description: 'Enhanced player facilities' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'New design includes shade features',
        'Florida sun still intense',
        'Third base side preferred',
        'Evening games ideal'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 77, avgHumidity: 67, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 82, avgHumidity: 68, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Shade helpful' },
        { month: 'June', avgTemp: 86, avgHumidity: 73, rainChance: 45, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'July', avgTemp: 88, avgHumidity: 75, rainChance: 50, typicalConditions: 'Very hot, storms', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 88, avgHumidity: 76, rainChance: 50, typicalConditions: 'Peak heat', shadeTip: 'Maximum protection' },
        { month: 'September', avgTemp: 85, avgHumidity: 74, rainChance: 40, typicalConditions: 'Still very warm', shadeTip: 'Shade important' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private bar'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Berm', description: 'Outfield grass seating', capacity: 1000 }
        ]
      },
      budgetOptions: ['Berm seating', 'Upper reserved', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['360 concourse', 'Party areas'],
      partyAreas: [
        {
          name: 'Left Field Deck',
          capacity: '150',
          description: 'Group party area',
          amenities: ['Bar service', 'Standing room', 'Tables']
        }
      ],
      tips: [
        { section: 'Champions Club', tip: 'Premium all-inclusive', category: 'experience' },
        { section: '360 concourse', tip: 'Walk for views', category: 'experience' },
        { section: 'Berm', tip: 'Bring blanket or chair', category: 'value' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' }
      ]
    },

    concessions: {
      signature: ['Poutine', 'Beaver Tails', 'Gulf grouper', 'Cuban sandwich'],
      local: ['Canadian specialties', 'Gulf seafood', 'Cuban food', 'Florida citrus'],
      healthy: ['Grilled options', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Canadian beers', 'Florida craft beers', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Dunedin Brewery', 'Caledonia', 'Stilt House']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Overflow Lots', distance: '400 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited on game days',
        tip: 'Arrive early for street parking'
      },
      alternativeTransport: {
        publicTransit: ['PSTA bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Pinellas Trail access'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch',
        tip: 'New modern entrance'
      },
      {
        name: 'Right Field Gate',
        location: 'Outfield entrance',
        bestFor: ['Berm', 'Outfield seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Blue Jays Team Store', exclusive: ['Blue Jays gear', 'Spring training items', 'Canadian merchandise'] }
      ],
      firstAid: ['Multiple locations'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Available'],
      atms: ['Throughout facility'],
      wifi: { available: true, network: 'TD_Ballpark_WiFi' },
      chargingStations: ['Multiple locations'],
      kidZones: [
        { name: 'Jr. Jays Zone', location: 'Right field', activities: ['Playground', 'Interactive games'] }
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
      parkingSpaces: '50+ ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'New Facility', description: 'Completely renovated 2020', category: 'experience' },
        { title: 'Canadian Culture', description: 'Blue Jays connection strong', category: 'experience' },
        { title: 'Beach Proximity', description: 'Beaches nearby', category: 'experience' },
        { title: 'Florida Heat', description: 'Evening games better', category: 'weather' }
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
      name: 'Dunedin',
      description: 'Charming Gulf Coast city with Scottish heritage',
      beforeGame: ['Downtown Dunedin', 'Honeymoon Island', 'Pinellas Trail'],
      afterGame: ['Downtown breweries', 'Main Street'],
      radius: '3 miles'
    },

    transportation: {
      address: '373 Douglas Ave, Dunedin, FL 34698',
      publicTransit: {
        bus: [
          { routes: ['PSTA routes'], stops: ['Douglas Avenue'] }
        ]
      },
      driving: {
        majorRoutes: ['US-19', 'SR-580', 'Pinellas Trail'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'US-19 to SR-580'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate on weekends'
      }
    },

    history: {
      timeline: [
        { year: 1990, event: 'Dunedin Stadium opens' },
        { year: 2020, event: 'Complete renovation' },
        { year: 2020, event: 'Renamed TD Ballpark' }
      ],
      traditions: [
        { name: 'Blue Jays Spring Home', description: 'Long-term relationship' },
        { name: 'Canadian Connection', description: 'Strong Canadian fan base' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern facility with Canadian flair and Florida charm',
      bestExperiences: [
        'Brand new amenities',
        'Canadian culture mix',
        'Spring training quality',
        'Gulf Coast location'
      ],
      traditions: [
        'O Canada anthem',
        'Canadian Heritage Night',
        'Beach Night'
      ],
      mascot: {
        name: 'DJay',
        description: 'Blue Jay mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Newly renovated everything',
        'Try poutine and Beaver Tails',
        'Downtown Dunedin walkable',
        'Pinellas Trail access unique'
      ],
      avoidThese: [
        'Summer afternoon games',
        'Limited parking on big games',
        'First base afternoon sun'
      ],
      hiddenGems: [
        'Brand new facility features',
        'Dunedin Brewery nearby',
        'Honeymoon Island State Park',
        'Scottish heritage downtown'
      ],
      photoSpots: [
        'New entrance plaza',
        'With DJay mascot',
        '360 concourse views',
        'Modern architecture'
      ],
      bestValue: [
        'Berm seating flexibility',
        'Standing room options',
        'Weeknight games',
        'Group packages'
      ]
    }
  }
};