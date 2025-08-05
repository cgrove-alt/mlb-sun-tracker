import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides6: Record<string, StadiumGuide> = {
  'midland-rockhounds': {
    id: 'midland-rockhounds',
    name: 'Momentum Bank Ballpark',
    team: 'Midland RockHounds',
    opened: 2002,
    capacity: 5000,

    overview: {
      description: 'Momentum Bank Ballpark sits in the heart of West Texas oil country, offering an intimate baseball experience with excellent sightlines and a connection to the Oakland Athletics organization.',
      highlights: [
        'Athletics Double-A affiliate',
        'West Texas oil country setting',
        'Intimate 5,000-seat capacity',
        'Natural grass field',
        'Strong community support'
      ],
      uniqueFeatures: [
        'Oil derrick visible beyond outfield',
        'West Texas desert landscape',
        'Wind-resistant design',
        'Oil industry heritage displays',
        'Prairie dog mascot theme'
      ],
      renovations: [
        { year: 2010, description: 'LED lighting installation' },
        { year: 2015, description: 'Clubhouse renovations' },
        { year: 2019, description: 'Concourse and amenity improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['201', '202', '203'],
        afternoon: ['205', '206', '207'],
        evening: ['103', '104', '105', '201']
      },
      coveredSeating: ['201', '202', '203', '204', '205', '206'],
      shadeTips: [
        'West Texas sun is intense year-round',
        'Wind can provide cooling but brings dust',
        'Upper deck essential for day games',
        'Third base side gets better afternoon shade'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Team store', 'Concession areas'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['101', '102', '108', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 72, avgHumidity: 35, rainChance: 15, typicalConditions: 'Dry and windy', shadeTip: 'Comfortable, light shade needed' },
        { month: 'May', avgTemp: 81, avgHumidity: 40, rainChance: 20, typicalConditions: 'Warm and dry', shadeTip: 'Shade becomes important' },
        { month: 'June', avgTemp: 89, avgHumidity: 45, rainChance: 15, typicalConditions: 'Hot and dry', shadeTip: 'Upper deck strongly recommended' },
        { month: 'July', avgTemp: 93, avgHumidity: 40, rainChance: 10, typicalConditions: 'Very hot, intense sun', shadeTip: 'Covered seating essential' },
        { month: 'August', avgTemp: 92, avgHumidity: 42, rainChance: 15, typicalConditions: 'Peak heat', shadeTip: 'Shade absolutely necessary' },
        { month: 'September', avgTemp: 85, avgHumidity: 45, rainChance: 20, typicalConditions: 'Still hot but improving', shadeTip: 'Evening games much better' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Box seats'],
          amenities: ['Private restrooms', 'Enhanced concessions']
        }
      },
      budgetOptions: ['General admission', '206', '207'],
      familySections: ['Family sections', '204', '205'],
      standingRoom: ['Concourse areas'],
      tips: [
        { section: '101-103', tip: 'Best views but intense sun exposure', category: 'view' },
        { section: '201-203', tip: 'Great views with shade protection', category: 'shade' },
        { section: '204-206', tip: 'Good value with decent shade', category: 'value' }
      ]
    },

    concessions: {
      signature: ['RockHounds Dog', 'Texas BBQ', 'Chicken Fried Steak'],
      local: ['West Texas BBQ', 'Tex-Mex', 'Local beef'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Local Texas beers'],
        wine: false,
        cocktails: false
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        rideShare: 'Limited availability',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Team store', exclusive: ['RockHounds gear', 'A\'s items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Restroom facilities'],
      atms: ['Main concourse'],
      wifi: { available: true }
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Accessible seating available'],
        entrance: 'Main gate accessible',
        elevators: ['To upper level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '10 spaces available'
    },

    gameDay: {
      tips: [
        { title: 'West Texas Heat', description: 'Prepare for intense sun and heat', category: 'weather' },
        { title: 'Wind Factor', description: 'West Texas wind affects play', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['Game time arrival']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Midland',
      description: 'West Texas oil industry center',
      beforeGame: ['Local restaurants', 'Oil museums'],
      afterGame: ['Downtown Midland'],
      radius: '5 miles'
    },

    transportation: {
      address: '5514 Champions Dr, Midland, TX 79706',
      publicTransit: {
        bus: [
          { routes: ['Limited local service'], stops: ['Limited stops'] }
        ]
      },
      driving: {
        majorRoutes: ['I-20', 'Loop 250'],
        typicalTraffic: 'Light',
        bestApproach: 'Loop 250 south'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2002, event: 'Ballpark opens' },
        { year: 2017, event: 'Became A\'s affiliate' }
      ]
    },

    fanExperience: {
      atmosphere: 'Small-town West Texas baseball',
      bestExperiences: ['Intimate setting', 'Oil industry heritage', 'Family atmosphere'],
      traditions: ['Prairie dog races', 'Oil industry appreciation'],
      mascot: { name: 'Digger', description: 'Prairie dog mascot' }
    },

    proTips: {
      insiderTips: ['Evening games much more comfortable', 'Bring hat and sunscreen'],
      avoidThese: ['Day games in summer'],
      hiddenGems: ['Oil industry displays'],
      photoSpots: ['With Digger mascot'],
      bestValue: ['General admission tickets']
    }
  },

  'montgomery-biscuits': {
    id: 'montgomery-biscuits',
    name: 'Riverwalk Stadium',
    team: 'Montgomery Biscuits',
    opened: 2004,
    capacity: 7000,

    overview: {
      description: 'Riverwalk Stadium sits along the Alabama River in downtown Montgomery, combining Southern charm with modern amenities and celebrating the unique Biscuits brand.',
      highlights: [
        'Alabama River waterfront location',
        'Rays Double-A affiliate',
        'Unique Biscuits branding',
        'Downtown Montgomery setting',
        'Southern hospitality'
      ],
      uniqueFeatures: [
        'Alabama River views',
        'Butter sculpture mascot',
        'Southern cuisine focus',
        'Civil rights history nearby',
        'Riverfront setting'
      ],
      renovations: [
        { year: 2010, description: 'Concourse improvements' },
        { year: 2016, description: 'LED lighting installation' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['200 level', 'Suites'],
        afternoon: ['Third base side', 'Upper deck'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Upper deck sections', 'Suite level'],
      shadeTips: [
        'Alabama sun is intense in summer',
        'River breeze provides some relief',
        'Upper deck essential for day games'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Team store', 'Suites'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Lower level first base side'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 70, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 78, avgHumidity: 70, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Shade becomes helpful' },
        { month: 'June', avgTemp: 85, avgHumidity: 75, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck recommended' },
        { month: 'July', avgTemp: 88, avgHumidity: 78, rainChance: 45, typicalConditions: 'Very hot and humid', shadeTip: 'Covered seating essential' },
        { month: 'August', avgTemp: 87, avgHumidity: 77, rainChance: 40, typicalConditions: 'Hot with storms', shadeTip: 'Shade and cover needed' },
        { month: 'September', avgTemp: 82, avgHumidity: 73, rainChance: 35, typicalConditions: 'Still warm', shadeTip: 'Evening games better' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'River Club',
            perks: ['Climate controlled', 'Premium dining', 'River views'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering', 'Climate control']
        }
      },
      budgetOptions: ['General admission', 'Outfield sections'],
      familySections: ['Family areas'],
      tips: [
        { section: 'River Club', tip: 'Best comfort and views', category: 'experience' },
        { section: 'Upper deck', tip: 'Great value with shade', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Biscuit sandwich', 'Southern fried chicken', 'Pulled pork'],
      local: ['Alabama BBQ', 'Fried green tomatoes', 'Sweet tea', 'Peach cobbler'],
      healthy: ['Grilled chicken', 'Salads'],
      vegetarian: ['Veggie options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Local Alabama brews'],
        wine: true,
        cocktails: false
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown Lots', distance: '0.3 miles', price: '$3-8', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited downtown',
        tip: 'Arrive early for street parking'
      },
      alternativeTransport: {
        rideShare: 'Available',
        bicycle: 'River trail access'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Biscuits Team Store', exclusive: ['Biscuits gear', 'Southern themed items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Restroom facilities'],
      atms: ['Main concourse'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Outfield area', activities: ['Playground', 'Interactive games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Accessible seating throughout'],
        entrance: 'All gates accessible',
        elevators: ['To upper levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '20 spaces available'
    },

    gameDay: {
      tips: [
        { title: 'Southern Cuisine', description: 'Try the biscuit sandwich specialty', category: 'food' },
        { title: 'River Views', description: 'Best from upper concourse', category: 'experience' },
        { title: 'Alabama Heat', description: 'Summer games can be hot and humid', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Downtown Montgomery',
      description: 'Historic Alabama capital with civil rights significance',
      beforeGame: ['Civil Rights Memorial', 'Alabama State Capitol', 'Riverfront restaurants'],
      afterGame: ['Downtown entertainment', 'River district'],
      radius: '5 miles'
    },

    transportation: {
      address: '200 Coosa St, Montgomery, AL 36104',
      publicTransit: {
        bus: [
          { routes: ['Montgomery bus system'], stops: ['Downtown Montgomery'] }
        ]
      },
      driving: {
        majorRoutes: ['I-65', 'I-85', 'US-82'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-65 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Stadium area',
        dropoffZone: 'Main gate',
        surgePricing: 'Low to moderate'
      }
    },

    history: {
      timeline: [
        { year: 2004, event: 'Riverwalk Stadium opens' },
        { year: 2004, event: 'Montgomery Biscuits inaugural season' }
      ],
      traditions: [
        { name: 'Southern Heritage', description: 'Celebrating Alabama culture' },
        { name: 'Biscuit Theme', description: 'Unique food-based branding' }
      ]
    },

    fanExperience: {
      atmosphere: 'Southern charm with unique food-themed entertainment',
      bestExperiences: [
        'Alabama River views',
        'Southern cuisine specialties',
        'Civil rights history nearby',
        'Unique Biscuits branding'
      ],
      traditions: ['Butter sculpture mascot', 'Southern food promotions'],
      mascot: { name: 'Big Mo', description: 'Biscuit mascot with butter pat' }
    },

    proTips: {
      insiderTips: [
        'Try the biscuit sandwich - team specialty',
        'River Club worth upgrade for comfort',
        'Evening games much more comfortable',
        'Explore civil rights history nearby'
      ],
      avoidThese: [
        'Day games in peak summer',
        'Lower level without shade in afternoon'
      ],
      hiddenGems: [
        'Alabama River sunset views',
        'Historic downtown Montgomery',
        'Southern cuisine authenticity'
      ],
      photoSpots: [
        'With Big Mo mascot',
        'Alabama River backdrop',
        'Historic Montgomery skyline'
      ],
      bestValue: [
        'Upper deck with shade and views',
        'Group packages with Southern meal',
        'Evening games for weather comfort'
      ]
    }
  }
};