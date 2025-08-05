import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides9: Record<string, StadiumGuide> = {
  'fort-myers-mighty-mussels': {
    id: 'fort-myers-mighty-mussels',
    name: 'Hammond Stadium',
    team: 'Fort Myers Mighty Mussels',
    opened: 1991,
    capacity: 9300,

    overview: {
      description: 'Hammond Stadium at CenturyLink Sports Complex serves as both the Twins spring training home and their Single-A affiliate venue, featuring excellent facilities and Southwest Florida sunshine.',
      highlights: [
        'Twins Single-A affiliate',
        'Spring training facility',
        'Southwest Florida location',
        'Modern amenities',
        'Twins organization presence'
      ],
      uniqueFeatures: [
        'Spring training quality',
        'Lakes and palm trees',
        'Natural grass field',
        'Twins heritage displays',
        'Florida architecture'
      ],
      renovations: [
        { year: 2014, description: 'Major renovations' },
        { year: 2017, description: 'Additional improvements' },
        { year: 2020, description: 'Seating upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Upper deck'],
        afternoon: ['Sections 210-220', 'Suites'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Upper deck roof', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Southwest Florida sun intense',
        'Upper deck provides good cover',
        'Third base side preferred',
        'Evening games essential summer'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper deck'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base field level', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm and dry', shadeTip: 'Shade helpful' },
        { month: 'May', avgTemp: 85, avgHumidity: 67, rainChance: 25, typicalConditions: 'Getting hot', shadeTip: 'Covered seating ideal' },
        { month: 'June', avgTemp: 88, avgHumidity: 73, rainChance: 45, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential' },
        { month: 'July', avgTemp: 90, avgHumidity: 75, rainChance: 50, typicalConditions: 'Very hot, afternoon storms', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 90, avgHumidity: 76, rainChance: 50, typicalConditions: 'Peak heat and storms', shadeTip: 'Maximum protection' },
        { month: 'September', avgTemp: 88, avgHumidity: 74, rainChance: 45, typicalConditions: 'Still very hot', shadeTip: 'Shade critical' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Twins Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Premium level'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Berm', description: 'Outfield grass seating', capacity: 1000 }
        ]
      },
      budgetOptions: ['Berm seating', 'Upper reserved', 'Bleachers'],
      familySections: ['Family sections available'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Party Deck',
          capacity: '200',
          description: 'Left field group area',
          amenities: ['Bar service', 'Group seating']
        }
      ],
      tips: [
        { section: 'Upper deck', tip: 'Best shade coverage', category: 'shade' },
        { section: 'Behind home plate', tip: 'Spring training quality views', category: 'view' },
        { section: 'Berm', tip: 'Bring blanket or chair', category: 'value' },
        { section: 'Third base side', tip: 'Better sun angles', category: 'shade' }
      ]
    },

    concessions: {
      signature: ['Cuban sandwich', 'Grouper tacos', 'Key lime pie', 'Minnesota favorites'],
      local: ['Gulf seafood', 'Cuban food', 'Florida citrus', 'Tropical drinks'],
      healthy: ['Grilled fish', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie options', 'Salads'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Florida craft beers', 'Minnesota beers', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Fort Myers Brewing', 'Bury Me Brewing', 'Point Ybel']
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
        tip: 'Plenty of lot parking'
      },
      alternativeTransport: {
        publicTransit: ['LeeTran bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Behind home plate',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch'
      },
      {
        name: 'Left Field Gate',
        location: 'Outfield entrance',
        bestFor: ['Berm', 'Party deck'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Mussels Team Store', exclusive: ['Mussels gear', 'Twins items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['To upper deck']
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
        { title: 'Spring Training Quality', description: 'Major league facility', category: 'experience' },
        { title: 'Twins Connection', description: 'Organization presence', category: 'experience' },
        { title: 'Southwest Florida', description: 'Beaches and attractions', category: 'experience' },
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
      name: 'South Fort Myers',
      description: 'Southwest Florida with beaches and nature',
      beforeGame: ['Lakes Regional Park', 'Gulf beaches', 'Shopping'],
      afterGame: ['Fort Myers restaurants', 'Beach bars'],
      radius: '10 miles'
    },

    transportation: {
      address: '14100 Six Mile Cypress Pkwy, Fort Myers, FL 33912',
      publicTransit: {
        bus: [
          { routes: ['LeeTran'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-75', 'US-41', 'Daniels Parkway'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-75 to Daniels Parkway'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1991, event: 'Hammond Stadium opens' },
        { year: 1991, event: 'Twins spring training begins' },
        { year: 2020, event: 'Rebrand to Mighty Mussels' }
      ],
      traditions: [
        { name: 'Twins Heritage', description: 'Minnesota connection' },
        { name: 'Spring Training Home', description: 'Shared facility' }
      ]
    },

    fanExperience: {
      atmosphere: 'Spring training quality with Florida charm',
      bestExperiences: [
        'Spring training facility',
        'Twins organization presence',
        'Southwest Florida weather',
        'Modern amenities'
      ],
      traditions: [
        'Twins heritage nights',
        'Beach themes',
        'Fireworks nights'
      ],
      mascot: {
        name: 'Mussel Man',
        description: 'Mighty mussel mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Spring training quality facility',
        'Lakes Regional Park nearby',
        'Try grouper tacos',
        'Upper deck best for shade'
      ],
      avoidThese: [
        'Summer afternoon games',
        'First base side midday',
        'Underestimating humidity'
      ],
      hiddenGems: [
        'Twins player rehabs',
        'Spring training museum',
        'Lakes and nature trails',
        'Beach proximity'
      ],
      photoSpots: [
        'With Mussel Man',
        'Palm tree entrance',
        'Spring training signage',
        'Lake views'
      ],
      bestValue: [
        'Berm seating',
        'Upper reserved',
        'Weeknight games',
        'Group rates'
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
      description: 'Publix Field at Joker Marchant Stadium serves as both the Tigers spring training home and their Single-A affiliate venue, featuring historic charm and Central Florida hospitality.',
      highlights: [
        'Tigers Single-A affiliate',
        'Spring training facility',
        'Historic venue since 1966',
        'Central Florida location',
        'Tigers organization presence'
      ],
      uniqueFeatures: [
        'Tiger Town complex',
        'Lake Parker proximity',
        'Natural grass field',
        'Classic Florida architecture',
        'Tigers heritage throughout'
      ],
      renovations: [
        { year: 2003, description: 'Major renovation' },
        { year: 2017, description: 'Additional improvements' },
        { year: 2020, description: 'Facility upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Box seats'],
        afternoon: ['Covered grandstand', 'Suites'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Grandstand roof sections', 'Suite level'],
      shadeTips: [
        'Central Florida heat intense',
        'Limited shade structures',
        'Third base side better',
        'Evening games recommended'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Limited indoor spaces'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Outfield bleachers', 'First base side'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 78, avgHumidity: 66, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 84, avgHumidity: 67, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Shade becoming important' },
        { month: 'June', avgTemp: 88, avgHumidity: 73, rainChance: 45, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating best' },
        { month: 'July', avgTemp: 90, avgHumidity: 75, rainChance: 50, typicalConditions: 'Very hot, afternoon storms', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 90, avgHumidity: 76, rainChance: 50, typicalConditions: 'Peak heat', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 87, avgHumidity: 74, rainChance: 40, typicalConditions: 'Still hot', shadeTip: 'Shade essential' }
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
          { name: 'Berm', description: 'Outfield grass seating', capacity: 1200 }
        ]
      },
      budgetOptions: ['Berm seating', 'Bleacher seats', 'General admission'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Limited concourse areas'],
      partyAreas: [
        {
          name: 'Picnic Area',
          capacity: '250',
          description: 'Left field group area',
          amenities: ['Covered pavilion', 'Group seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best traditional views', category: 'view' },
        { section: 'Third base grandstand', tip: 'Better shade coverage', category: 'shade' },
        { section: 'Berm', tip: 'Family-friendly and budget', category: 'value' },
        { section: 'Picnic area', tip: 'Great for groups', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Publix deli subs', 'Tigers dogs', 'Florida orange juice'],
      local: ['Publix specialties', 'Florida citrus', 'Cuban sandwiches'],
      healthy: ['Deli options', 'Salads'],
      vegetarian: ['Limited options'],
      glutenFree: ['Very limited'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Limited craft selection'],
        wine: false,
        cocktails: false,
        localBreweries: ['Swan Brewing', 'Grove Roots']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '400 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Plenty of free parking'
      },
      alternativeTransport: {
        publicTransit: ['Citrus Connection'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Behind home plate',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Flying Tigers Store', exclusive: ['Flying Tigers gear', 'Tigers items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Limited facilities'],
      atms: ['Main entrance'],
      wifi: { available: false },
      kidZones: [
        { name: 'Kids Area', location: 'Right field', activities: ['Small playground'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated accessible areas'],
        entrance: 'Main gate accessible',
        elevators: ['Limited']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '25 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Tiger Town', description: 'Historic complex', category: 'experience' },
        { title: 'Spring Training', description: 'Tigers presence strong', category: 'experience' },
        { title: 'Publix Subs', description: 'Local favorite', category: 'food' },
        { title: 'Florida Heat', description: 'Evening games better', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: 'Usually 6:30 PM',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: false
      }
    },

    neighborhood: {
      name: 'Lakeland',
      description: 'Central Florida city between Tampa and Orlando',
      beforeGame: ['Lake Parker Park', 'Downtown Lakeland'],
      afterGame: ['Local restaurants'],
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
        typicalTraffic: 'Light',
        bestApproach: 'I-4 to Lakeland Hills Blvd'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1966, event: 'Joker Marchant Stadium opens' },
        { year: 1934, event: 'Tigers spring training begins in Lakeland' },
        { year: 2017, event: 'Publix naming rights' }
      ],
      traditions: [
        { name: 'Tiger Town Heritage', description: 'Long Tigers history' },
        { name: 'Spring Training Home', description: 'Decades of tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Classic spring training with Tigers tradition',
      bestExperiences: [
        'Historic Tiger Town',
        'Spring training heritage',
        'Central Florida charm',
        'Tigers organization presence'
      ],
      traditions: [
        'Tigers heritage nights',
        'Flying Tigers history',
        'Military appreciation'
      ],
      mascot: {
        name: 'Southpaw',
        description: 'Flying tiger mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Free parking plentiful',
        'Publix subs are excellent',
        'Tiger Town history worth exploring',
        'Lake Parker Park nearby'
      ],
      avoidThese: [
        'Afternoon summer games',
        'Bleachers in heat',
        'Limited amenities expectations'
      ],
      hiddenGems: [
        'Tiger Town complex',
        'Spring training history',
        'Lake Parker trails',
        'Historic Lakeland downtown'
      ],
      photoSpots: [
        'Tiger statue',
        'With Southpaw',
        'Spring training signage',
        'Classic entrance'
      ],
      bestValue: [
        'Free parking',
        'Berm seating',
        'General admission',
        'Family packages'
      ]
    }
  },

  'palm-beach-cardinals': {
    id: 'palm-beach-cardinals',
    name: 'Roger Dean Chevrolet Stadium',
    team: 'Palm Beach Cardinals',
    opened: 1998,
    capacity: 6871,

    overview: {
      description: 'Roger Dean Chevrolet Stadium uniquely serves as spring training home for both the Cardinals and Marlins, and hosts the Cardinals Single-A affiliate with South Florida style.',
      highlights: [
        'Cardinals Single-A affiliate',
        'Dual spring training facility',
        'Palm Beach County location',
        'Modern amenities',
        'Two MLB teams presence'
      ],
      uniqueFeatures: [
        'Only dual-team spring facility',
        'Palm Beach Gardens setting',
        'Natural grass field',
        'Tropical landscaping',
        'Modern design'
      ],
      renovations: [
        { year: 2019, description: 'Seating improvements' },
        { year: 2021, description: 'Facility upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club seats'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'South Florida sun intense',
        'Limited natural shade',
        'Third base side preferred',
        'Evening games much better'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club areas'],
        indoorAreas: ['Club level', 'Team stores'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base field level', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 79, avgHumidity: 68, rainChance: 25, typicalConditions: 'Warm and humid', shadeTip: 'Shade helpful' },
        { month: 'May', avgTemp: 83, avgHumidity: 70, rainChance: 35, typicalConditions: 'Getting hot', shadeTip: 'Covered seating ideal' },
        { month: 'June', avgTemp: 87, avgHumidity: 74, rainChance: 45, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential' },
        { month: 'July', avgTemp: 89, avgHumidity: 75, rainChance: 45, typicalConditions: 'Very hot', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 89, avgHumidity: 76, rainChance: 45, typicalConditions: 'Peak heat', shadeTip: 'Maximum protection' },
        { month: 'September', avgTemp: 87, avgHumidity: 75, rainChance: 40, typicalConditions: 'Still very hot', shadeTip: 'Shade critical' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Party Lawn', description: 'Left field berm', capacity: 500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved', 'Bleachers'],
      familySections: ['Family sections available'],
      standingRoom: ['Concourse areas', 'Party areas'],
      partyAreas: [
        {
          name: 'Left Field Lawn',
          capacity: '500',
          description: 'Berm party area',
          amenities: ['Open lawn', 'Picnic atmosphere']
        }
      ],
      tips: [
        { section: 'Champions Club', tip: 'A/C and all-inclusive', category: 'experience' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Party Lawn', tip: 'Bring blanket', category: 'value' },
        { section: 'Behind home plate', tip: 'Best overall views', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Mahi mahi sandwich', 'Conch fritters', 'Key lime pie'],
      local: ['South Florida seafood', 'Cuban food', 'Tropical drinks'],
      healthy: ['Grilled fish', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie options', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Florida craft beers', 'Cardinals favorites'],
        wine: true,
        cocktails: true,
        localBreweries: ['Saltwater Brewery', 'Due South', 'Funky Buddha']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '200 yards', price: '$5-10', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '400 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots'
      },
      alternativeTransport: {
        publicTransit: ['Palm Tran bus'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
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
        name: 'Left Field Gate',
        location: 'Outfield entrance',
        bestFor: ['Lawn seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Cardinals Store', exclusive: ['Cardinals gear', 'Spring training items'] },
        { location: 'Marlins Store', exclusive: ['Marlins gear available too'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations'],
      wifi: { available: true },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Available']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '35 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Dual Spring Home', description: 'Cardinals and Marlins share', category: 'experience' },
        { title: 'Palm Beach Location', description: 'Upscale area', category: 'experience' },
        { title: 'South Florida Heat', description: 'Evening games better', category: 'weather' },
        { title: 'Seafood Options', description: 'Try mahi sandwich', category: 'food' }
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
      name: 'Jupiter/Palm Beach Gardens',
      description: 'Upscale Palm Beach County area',
      beforeGame: ['Gardens Mall', 'Downtown at the Gardens', 'Abacoa'],
      afterGame: ['Jupiter restaurants', 'Atlantic beaches'],
      radius: '5 miles'
    },

    transportation: {
      address: '4751 Main St, Jupiter, FL 33458',
      publicTransit: {
        bus: [
          { routes: ['Palm Tran'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-95', 'Florida Turnpike', 'US-1'],
        typicalTraffic: 'Moderate, heavy in season',
        bestApproach: 'I-95 to Donald Ross Road'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher in season'
      }
    },

    history: {
      timeline: [
        { year: 1998, event: 'Roger Dean Stadium opens' },
        { year: 1998, event: 'Cardinals/Marlins spring training begins' },
        { year: 2021, event: 'Chevrolet naming rights' }
      ],
      traditions: [
        { name: 'Cardinals Heritage', description: 'St. Louis connection' },
        { name: 'Dual Team Unique', description: 'Only shared spring facility' }
      ]
    },

    fanExperience: {
      atmosphere: 'Spring training quality with Palm Beach style',
      bestExperiences: [
        'Two MLB teams presence',
        'Spring training quality',
        'Palm Beach location',
        'Modern facilities'
      ],
      traditions: [
        'Cardinals traditions',
        'Beach Night',
        'Fireworks Friday'
      ],
      mascot: {
        name: 'Splash',
        description: 'Cardinals mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Two team stores unique',
        'Gardens Mall nearby',
        'Jupiter beaches close',
        'Try both Cardinals and Marlins games'
      ],
      avoidThese: [
        'Afternoon summer games',
        'Season traffic congestion',
        'First base afternoon sun'
      ],
      hiddenGems: [
        'Only dual-team facility',
        'Abacoa Town Center',
        'Jupiter Inlet nearby',
        'Spring training museum'
      ],
      photoSpots: [
        'Dual team signage',
        'With Splash mascot',
        'Palm tree entrance',
        'Spring training plaza'
      ],
      bestValue: [
        'Lawn seating',
        'Weeknight games',
        'Upper reserved',
        'Group packages'
      ]
    }
  }
};