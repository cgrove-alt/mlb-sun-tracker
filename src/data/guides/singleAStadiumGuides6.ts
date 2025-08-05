import { StadiumGuide } from '../stadiumGuides';

export const singleAStadiumGuides6: Record<string, StadiumGuide> = {
  'lake-county-captains': {
    id: 'lake-county-captains',
    name: 'Classic Park',
    team: 'Lake County Captains',
    opened: 2003,
    capacity: 7273,

    overview: {
      description: 'Classic Park in Eastlake serves as home to the Guardians Single-A affiliate, located in the Cleveland suburbs near Lake Erie with modern amenities and family entertainment.',
      highlights: [
        'Guardians Single-A affiliate',
        'Cleveland suburbs location',
        'Lake Erie proximity',
        'Modern facility',
        'Family-friendly atmosphere'
      ],
      uniqueFeatures: [
        'Lake Erie region setting',
        'Natural grass field',
        'Modern amenities',
        'Cleveland connection',
        'Suburban convenience'
      ],
      renovations: [
        { year: 2015, description: 'Video board upgrade' },
        { year: 2019, description: 'Seating improvements' },
        { year: 2021, description: 'Concourse updates' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 6:30 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Lake effect moderates temperatures',
        'Ohio summers can be humid',
        'Third base side preferred',
        'Evening games comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Lawn areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 63, rainChance: 40, typicalConditions: 'Cool and variable', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Pleasant conditions' },
        { month: 'June', avgTemp: 72, avgHumidity: 67, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Nice baseball weather' },
        { month: 'July', avgTemp: 76, avgHumidity: 68, rainChance: 30, typicalConditions: 'Peak summer', shadeTip: 'Shade helpful' },
        { month: 'August', avgTemp: 75, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 68, avgHumidity: 67, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Perfect conditions' }
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
          { name: 'Party Deck', description: 'Left field group area', capacity: 200 },
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 1500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Bleacher seats', 'General admission'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '200',
          description: 'Group party area',
          amenities: ['Bar service', 'Tables', 'Standing room']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views', category: 'view' },
        { section: 'Third base side', tip: 'Better shade', category: 'shade' },
        { section: 'Party Deck', tip: 'Social atmosphere', category: 'experience' },
        { section: 'Lawn', tip: 'Family-friendly budget option', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Captain Dogs', 'Lake perch', 'Cleveland favorites'],
      local: ['Lake Erie perch', 'Polish boys', 'Stadium mustard', 'Pierogies'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Great Lakes Brewing', 'Ohio craft beers'],
        wine: false,
        cocktails: false,
        localBreweries: ['Great Lakes', 'Fat Head\'s', 'Platform']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '300 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Plenty of lot parking'
      },
      alternativeTransport: {
        publicTransit: ['Laketran bus'],
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
        { location: 'Captains Team Store', exclusive: ['Captains gear', 'Guardians items'] }
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
        elevators: ['To suite level']
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
        { title: 'Cleveland Connection', description: 'Guardians prospects', category: 'experience' },
        { title: 'Lake Erie Perch', description: 'Try local fish', category: 'food' },
        { title: 'Suburban Location', description: 'Easy access', category: 'experience' },
        { title: 'Family Focus', description: 'Great for kids', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:00 PM',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Eastlake',
      description: 'Cleveland suburb near Lake Erie',
      beforeGame: ['Chain restaurants', 'Shopping areas'],
      afterGame: ['Limited nightlife'],
      radius: '5 miles'
    },

    transportation: {
      address: '35300 Vine St, Eastlake, OH 44095',
      publicTransit: {
        bus: [
          { routes: ['Laketran'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-90', 'Route 91', 'Route 2'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-90 to Route 91'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2003, event: 'Classic Park opens' },
        { year: 2003, event: 'Captains begin play' },
        { year: 2003, event: 'Indians (now Guardians) affiliate' }
      ],
      traditions: [
        { name: 'Captains Identity', description: 'Lake boat captain theme' },
        { name: 'Cleveland Connection', description: 'Strong organization tie' }
      ]
    },

    fanExperience: {
      atmosphere: 'Suburban family baseball with Cleveland connection',
      bestExperiences: [
        'Modern facility',
        'Family entertainment',
        'Guardians prospects',
        'Lake Erie region'
      ],
      traditions: [
        'Thirsty Thursday',
        'Friday Fireworks',
        'Captain\'s Wheel spin'
      ],
      mascot: {
        name: 'Skipper',
        description: 'Sea captain character'
      }
    },

    proTips: {
      insiderTips: [
        'Try Lake Erie perch',
        'Great Lakes beer excellent',
        'Easy suburban access',
        'Guardians rehabs common'
      ],
      avoidThese: [
        'Lake effect weather changes',
        'Limited dining nearby',
        'First base afternoon sun'
      ],
      hiddenGems: [
        'Lake Erie beaches nearby',
        'Cleveland 30 minutes',
        'Holden Arboretum',
        'Wine country east'
      ],
      photoSpots: [
        'With Skipper mascot',
        'Captain\'s wheel',
        'Modern entrance',
        'Lake County signage'
      ],
      bestValue: [
        'Lawn seating',
        'Weeknight games',
        'Group packages',
        'Family deals'
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
      description: 'Jackson Field in downtown Lansing serves as home to the Athletics Single-A affiliate, located in Michigan\'s capital city with one of the largest capacities in Single-A baseball.',
      highlights: [
        'Athletics Single-A affiliate',
        'State capital location',
        'Downtown Lansing',
        'Large capacity venue',
        'Government city setting'
      ],
      uniqueFeatures: [
        'Downtown skyline views',
        'Capitol building proximity',
        'Natural grass field',
        'Large outfield area',
        'Classic design'
      ],
      renovations: [
        { year: 2018, description: 'Renovations and improvements' },
        { year: 2020, description: 'Additional upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Upper deck'],
        afternoon: ['Sections 200-210', 'Club areas'],
        evening: ['Most sections after 6:30 PM']
      },
      coveredSeating: ['Upper deck overhang', 'Premium areas'],
      shadeTips: [
        'Michigan summers moderate',
        'Downtown buildings provide some shade',
        'Third base side preferred',
        'Evening games comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper areas'],
        indoorAreas: ['Team store', 'Club areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base field level', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 51, avgHumidity: 64, rainChance: 35, typicalConditions: 'Cool spring', shadeTip: 'Bring layers' },
        { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 35, typicalConditions: 'Variable', shadeTip: 'Pleasant most days' },
        { month: 'June', avgTemp: 72, avgHumidity: 67, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Nice baseball weather' },
        { month: 'July', avgTemp: 76, avgHumidity: 68, rainChance: 30, typicalConditions: 'Peak summer', shadeTip: 'Shade helpful' },
        { month: 'August', avgTemp: 74, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 66, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Perfect conditions' }
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
          { name: 'Lawn', description: 'Large outfield grass area', capacity: 3000 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Bleacher seats', 'Upper deck'],
      familySections: ['Family sections available'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Outfield Lawn',
          capacity: '3000',
          description: 'Large grass berm',
          amenities: ['Open seating', 'Picnic atmosphere']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Classic views', category: 'view' },
        { section: 'Third base side', tip: 'Better shade', category: 'shade' },
        { section: 'Lawn', tip: 'Great for families and groups', category: 'value' },
        { section: 'Upper deck', tip: 'Some weather protection', category: 'shade' }
      ]
    },

    concessions: {
      signature: ['Lugnut Burger', 'Michigan favorites', 'Capitol City specials'],
      local: ['Michigan craft items', 'Coney dogs', 'Better Made chips'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie options', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Michigan craft beers', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Lansing Brewing', 'EagleMonk', 'BAD Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown Lots', distance: '0.3 miles', price: '$3-8', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered downtown',
        tip: 'Stadium lot convenient'
      },
      alternativeTransport: {
        publicTransit: ['CATA bus'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'River Trail access'
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
        { location: 'Lugnuts Team Store', exclusive: ['Lugnuts gear', 'Athletics items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Outfield', activities: ['Playground', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['To upper levels']
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
        { title: 'Capitol City', description: 'Government workers attend', category: 'experience' },
        { title: 'Large Venue', description: 'Rarely crowded', category: 'experience' },
        { title: 'Downtown Location', description: 'Restaurants nearby', category: 'experience' },
        { title: 'Michigan Weather', description: 'Can be variable', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:05 PM',
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
      description: 'Michigan capital city downtown',
      beforeGame: ['Downtown restaurants', 'Capitol building', 'Museums'],
      afterGame: ['Downtown bars', 'Old Town'],
      radius: '1 mile'
    },

    transportation: {
      address: '505 E Michigan Ave, Lansing, MI 48912',
      publicTransit: {
        bus: [
          { routes: ['CATA'], stops: ['Downtown routes'] }
        ]
      },
      driving: {
        majorRoutes: ['I-496', 'I-96', 'US-127'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-496 to downtown'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1996, event: 'Oldsmobile Park opens' },
        { year: 1996, event: 'Lugnuts begin play' },
        { year: 2011, event: 'Renamed Cooley Law School Stadium' },
        { year: 2021, event: 'Became Jackson Field' }
      ],
      traditions: [
        { name: 'Lugnut Identity', description: 'Automotive heritage' },
        { name: 'Capitol City Pride', description: 'State capital connection' }
      ]
    },

    fanExperience: {
      atmosphere: 'Downtown baseball in state capital',
      bestExperiences: [
        'Downtown location',
        'Large lawn area',
        'Capitol proximity',
        'Family-friendly'
      ],
      traditions: [
        'Thirsty Thursday',
        'Fireworks nights',
        'Government employee nights'
      ],
      mascot: {
        name: 'Big Lug',
        description: 'Anthropomorphic lugnut'
      }
    },

    proTips: {
      insiderTips: [
        'Large lawn great for groups',
        'Downtown dining options',
        'Capitol building nearby',
        'River Trail accessible'
      ],
      avoidThese: [
        'Large venue can feel empty',
        'Downtown parking confusion',
        'Cool Michigan evenings'
      ],
      hiddenGems: [
        'Old Town district',
        'River Trail system',
        'Capitol tours',
        'Michigan History Museum'
      ],
      photoSpots: [
        'With Big Lug',
        'Capitol backdrop',
        'Downtown skyline',
        'Large lawn area'
      ],
      bestValue: [
        'Lawn seating cheap',
        'Plenty of good seats',
        'Weeknight deals',
        'Group packages'
      ]
    }
  },

  'west-michigan-whitecaps': {
    id: 'west-michigan-whitecaps',
    name: 'LMCU Ballpark',
    team: 'West Michigan Whitecaps',
    opened: 1994,
    capacity: 9281,

    overview: {
      description: 'LMCU Ballpark in Comstock Park serves as home to the Tigers Single-A affiliate, located in the Grand Rapids area with strong community support and family entertainment.',
      highlights: [
        'Tigers Single-A affiliate',
        'Grand Rapids area',
        'Large capacity venue',
        'Strong attendance',
        'Community fixture'
      ],
      uniqueFeatures: [
        'Michigan\'s team atmosphere',
        'Natural grass field',
        'Large concourse',
        'Family areas throughout',
        'Traditional design'
      ],
      renovations: [
        { year: 2014, description: 'Major renovations' },
        { year: 2019, description: 'Video board upgrade' },
        { year: 2021, description: 'Seating improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Upper sections'],
        afternoon: ['Sections 200-210', 'Club areas'],
        evening: ['Most sections after 6:30 PM']
      },
      coveredSeating: ['Limited covered areas', 'Premium sections'],
      shadeTips: [
        'Michigan summers mild',
        'Lake Michigan influence',
        'Third base side preferred',
        'Evening games pleasant'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Team store', 'Limited indoor areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Lawn areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 50, avgHumidity: 64, rainChance: 35, typicalConditions: 'Cool and variable', shadeTip: 'Dress warmly' },
        { month: 'May', avgTemp: 62, avgHumidity: 65, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Layers recommended' },
        { month: 'June', avgTemp: 71, avgHumidity: 67, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Perfect baseball weather' },
        { month: 'July', avgTemp: 75, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warm', shadeTip: 'Shade helpful midday' },
        { month: 'August', avgTemp: 73, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 65, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Bring jacket for evening' }
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
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 2500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Bleacher seats', 'General admission'],
      familySections: ['Family sections throughout'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Picnic Area',
          capacity: '300',
          description: 'Left field group area',
          amenities: ['Covered pavilion', 'Group seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views', category: 'view' },
        { section: 'Third base side', tip: 'Better shade', category: 'shade' },
        { section: 'Lawn', tip: 'Great for families', category: 'value' },
        { section: 'Picnic area', tip: 'Perfect for groups', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Whitecaps Burger', 'Michigan favorites', 'Ballpark classics'],
      local: ['Michigan craft items', 'Coney dogs', 'Faygo'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Michigan craft beers', 'Founders', 'Bell\'s'],
        wine: false,
        cocktails: false,
        localBreweries: ['Founders', 'Brewery Vivant', 'Perrin']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '300 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Plenty of lot parking'
      },
      alternativeTransport: {
        publicTransit: ['The Rapid bus'],
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
        { location: 'Whitecaps Team Store', exclusive: ['Whitecaps gear', 'Tigers items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Inflatables', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['To all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '50 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Tigers Connection', description: 'Detroit prospects', category: 'experience' },
        { title: 'Family Focus', description: 'Great kids entertainment', category: 'experience' },
        { title: 'Michigan Baseball', description: 'Strong community support', category: 'experience' },
        { title: 'Cool Evenings', description: 'Bring layers', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:00 PM',
        rushHours: ['30-45 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Comstock Park',
      description: 'Grand Rapids suburb',
      beforeGame: ['Chain restaurants', 'Local eateries'],
      afterGame: ['Downtown Grand Rapids 10 minutes'],
      radius: '5 miles'
    },

    transportation: {
      address: '4500 West River Dr, Comstock Park, MI 49321',
      publicTransit: {
        bus: [
          { routes: ['The Rapid'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['US-131', 'I-96', 'M-45'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'US-131 to West River Drive'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1994, event: 'Old Kent Park opens' },
        { year: 1994, event: 'Whitecaps begin play' },
        { year: 2014, event: 'Renamed Fifth Third Ballpark' },
        { year: 2021, event: 'Becomes LMCU Ballpark' }
      ],
      traditions: [
        { name: 'Michigan Baseball', description: 'Strong state pride' },
        { name: 'Tigers Heritage', description: 'Detroit connection' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly Michigan baseball tradition',
      bestExperiences: [
        'Strong attendance',
        'Tigers prospects',
        'Family entertainment',
        'Michigan pride'
      ],
      traditions: [
        'Dollar Night Monday',
        'Thirsty Thursday',
        'Friday Fireworks'
      ],
      mascot: {
        name: 'Crash',
        description: 'Whitecap wave character'
      }
    },

    proTips: {
      insiderTips: [
        'Great family atmosphere',
        'Strong attendance expected',
        'Tigers rehabs common',
        'Grand Rapids nearby'
      ],
      avoidThese: [
        'Cool evening unprepared',
        'Crowded weekend games',
        'First base afternoon sun'
      ],
      hiddenGems: [
        'Grand Rapids 10 minutes',
        'Frederik Meijer Gardens',
        'Lake Michigan beaches',
        'Beer City USA'
      ],
      photoSpots: [
        'With Crash mascot',
        'Whitecaps signage',
        'Family areas',
        'Traditional ballpark views'
      ],
      bestValue: [
        'Dollar Night Monday',
        'Lawn seating',
        'Group packages',
        'Family deals'
      ]
    }
  }
};