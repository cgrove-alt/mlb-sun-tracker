import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides2: Record<string, StadiumGuide> = {
  'bowling-green-hot-rods': {
    id: 'bowling-green-hot-rods',
    name: 'Bowling Green Ballpark',
    team: 'Bowling Green Hot Rods',
    opened: 2009,
    capacity: 4559,

    overview: {
      description: 'Bowling Green Ballpark serves as home to the Rays High-A affiliate, featuring modern amenities and a family-friendly atmosphere in the heart of Kentucky.',
      highlights: [
        'Rays High-A affiliate',
        'Modern facility opened 2009',
        'Kentucky cave country location',
        'Family-friendly design',
        'Automotive-themed branding'
      ],
      uniqueFeatures: [
        'Hot Rod themed elements',
        'Kentucky limestone construction',
        'Party deck areas',
        'Natural grass field',
        'Corvette Museum proximity'
      ],
      renovations: [
        { year: 2015, description: 'LED lighting upgrade' },
        { year: 2019, description: 'Clubhouse renovations' },
        { year: 2021, description: 'Concourse improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Covered seating'],
        afternoon: ['Sections 205-210', 'Club areas'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Premium seating areas', 'Select upper sections'],
      shadeTips: [
        'Kentucky summers are hot and humid',
        'Third base side provides afternoon shade',
        'Evening games much more comfortable',
        'Limited covered seating available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Team store', 'Club areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base side', 'Outfield sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 65, rainChance: 40, typicalConditions: 'Variable spring weather', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 71, avgHumidity: 68, rainChance: 45, typicalConditions: 'Warm with rain chances', shadeTip: 'Covered seating valuable' },
        { month: 'June', avgTemp: 79, avgHumidity: 70, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Shade becomes important' },
        { month: 'July', avgTemp: 83, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games recommended' },
        { month: 'August', avgTemp: 82, avgHumidity: 71, rainChance: 35, typicalConditions: 'Continued heat', shadeTip: 'Seek shade and hydrate' },
        { month: 'September', avgTemp: 75, avgHumidity: 68, rainChance: 35, typicalConditions: 'More comfortable', shadeTip: 'Pleasant baseball weather' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering options', 'Climate control']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area with bar', capacity: 75 }
        ]
      },
      budgetOptions: ['General admission', 'Lawn seating', 'Bleachers'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '75',
          description: 'Group area with bar service',
          amenities: ['Private bar', 'Standing tables']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade in afternoon', category: 'shade' },
        { section: 'Party Deck', tip: 'Fun group atmosphere', category: 'experience' },
        { section: 'Lawn', tip: 'Budget-friendly family option', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Hot Rod Dog', 'Kentucky BBQ', 'Bourbon items'],
      local: ['Kentucky bourbon BBQ', 'Hot Browns', 'Local treats'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Local Kentucky beers'],
        wine: false,
        cocktails: false,
        localBreweries: ['White Squirrel Brewery']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '300 yards', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots'
      },
      alternativeTransport: {
        publicTransit: ['Limited GO bg transit'],
        rideShare: 'Uber and Lyft available',
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
        { location: 'Hot Rods Team Store', exclusive: ['Hot Rods gear', 'Rays items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Accessible seating throughout'],
        entrance: 'All gates accessible',
        elevators: ['Available to upper levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '15 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Kentucky BBQ', description: 'Try the bourbon BBQ specialty', category: 'food' },
        { title: 'Corvette Connection', description: 'Visit Corvette Museum nearby', category: 'experience' },
        { title: 'Evening Games', description: 'Much cooler than day games', category: 'weather' }
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
      name: 'Bowling Green',
      description: 'Home to Western Kentucky University and Corvette Museum',
      beforeGame: ['Corvette Museum', 'WKU campus', 'Downtown dining'],
      afterGame: ['Local restaurants', 'Campus area'],
      radius: '5 miles'
    },

    transportation: {
      address: '300 8th Ave, Bowling Green, KY 42101',
      publicTransit: {
        bus: [
          { routes: ['GO bg transit'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-65', 'US-31W', 'US-68'],
        typicalTraffic: 'Light',
        bestApproach: 'I-65 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2009, event: 'Bowling Green Ballpark opens' },
        { year: 2009, event: 'Hot Rods inaugural season' },
        { year: 2010, event: 'Midwest League Championship' }
      ],
      traditions: [
        { name: 'Hot Rod Heritage', description: 'Automotive themed entertainment' },
        { name: 'Kentucky Pride', description: 'Celebrating local culture' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly with unique automotive theme',
      bestExperiences: [
        'Hot Rod themed entertainment',
        'Kentucky hospitality',
        'Modern facility amenities',
        'Affordable family fun'
      ],
      traditions: [
        'Hot Rod races',
        'Kentucky heritage nights',
        'WKU partnerships'
      ],
      mascot: {
        name: 'Axle', 
        description: 'Hot Rod themed mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Try the bourbon BBQ - local specialty',
        'Visit Corvette Museum before games',
        'Third base side for afternoon shade',
        'Thursday promotions best value'
      ],
      avoidThese: [
        'Day games in summer heat',
        'First base side in afternoon',
        'Limited parking on busy nights'
      ],
      hiddenGems: [
        'Corvette displays at stadium',
        'Kentucky craft beer selection',
        'WKU student nights',
        'Cave country nearby'
      ],
      photoSpots: [
        'With Axle mascot',
        'Hot Rod displays',
        'Kentucky sunset views',
        'Team photo zones'
      ],
      bestValue: [
        'Lawn seating',
        'Thursday promotions',
        'Group packages',
        'Student discounts'
      ]
    }
  },

  'brooklyn-cyclones': {
    id: 'brooklyn-cyclones',
    name: 'Maimonides Park',
    team: 'Brooklyn Cyclones',
    opened: 2001,
    capacity: 7500,

    overview: {
      description: 'Maimonides Park sits on the Coney Island boardwalk, offering spectacular views of the Atlantic Ocean, the iconic Coney Island attractions, and serving as the Mets High-A affiliate.',
      highlights: [
        'Mets High-A affiliate',
        'Coney Island boardwalk location',
        'Atlantic Ocean views',
        'NYC skyline visible',
        'Adjacent to amusement parks'
      ],
      uniqueFeatures: [
        'Ocean views from seats',
        'Parachute Jump landmark visible',
        'Cyclone roller coaster nearby',
        'Natural grass field',
        'Brooklyn baseball revival'
      ],
      renovations: [
        { year: 2020, description: 'Major renovations and rebranding' },
        { year: 2021, description: 'Clubhouse improvements' }
      ],
      previousNames: ['MCU Park (2010-2020)', 'KeySpan Park (2001-2009)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Upper sections'],
        afternoon: ['Sections 11-14', 'Premium areas'],
        evening: ['Most sections after 6 PM with ocean breeze']
      },
      coveredSeating: ['Premium club areas', 'Select upper sections'],
      shadeTips: [
        'Ocean breeze provides natural cooling',
        'Third base side gets shade first',
        'Premium areas offer best protection',
        'Evening games very comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base side afternoon', 'Bleacher sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 56, avgHumidity: 70, rainChance: 35, typicalConditions: 'Cool ocean breeze', shadeTip: 'Bring layers for wind' },
        { month: 'May', avgTemp: 66, avgHumidity: 72, rainChance: 35, typicalConditions: 'Pleasant seaside weather', shadeTip: 'Ocean breeze helps' },
        { month: 'June', avgTemp: 75, avgHumidity: 73, rainChance: 35, typicalConditions: 'Warm with ocean cooling', shadeTip: 'Shade helpful midday' },
        { month: 'July', avgTemp: 80, avgHumidity: 74, rainChance: 35, typicalConditions: 'Hot but breezy', shadeTip: 'Ocean side seats cooler' },
        { month: 'August', avgTemp: 79, avgHumidity: 74, rainChance: 35, typicalConditions: 'Peak summer at beach', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 72, avgHumidity: 72, rainChance: 30, typicalConditions: 'Perfect baseball weather', shadeTip: 'Comfortable throughout' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Climate controlled', 'Premium dining', 'Private bar', 'Ocean views'],
            access: 'Behind home plate with exclusive amenities'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering', 'Ocean/skyline views']
        },
        specialAreas: [
          { name: 'Beach Box', description: 'Field level premium seating', capacity: 30 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Upper reserved'],
      familySections: ['Family sections available'],
      standingRoom: ['Concourse areas', 'Party decks'],
      partyAreas: [
        {
          name: 'Party Deck',
          capacity: '100',
          description: 'Group area with ocean views',
          amenities: ['Bar service', 'Standing tables', 'Ocean breeze']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of ocean and game', category: 'view' },
        { section: 'Third base side', tip: 'Parachute Jump and Wonder Wheel views', category: 'view' },
        { section: 'Bleachers', tip: 'Budget option with character', category: 'value' },
        { section: 'Champions Club', tip: 'Escape summer heat in comfort', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Nathan\'s Famous hot dogs', 'Brooklyn pizza', 'Coney Island classics'],
      local: ['Nathan\'s hot dogs', 'Brooklyn pizza', 'Italian ices', 'Knishes'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie dogs', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Pizza', 'Cotton candy', 'Ice cream'],
      alcohol: {
        beer: ['Brooklyn Brewery', 'Coney Island Brewing', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Brooklyn Brewery', 'Coney Island Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '200 yards', price: '$25', shadedSpots: false, covered: false },
        { name: 'Street Parking', distance: 'Variable', price: 'Metered', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking, limited availability',
        tip: 'Take subway - much easier than driving'
      },
      alternativeTransport: {
        publicTransit: ['D/F/N/Q trains to Coney Island-Stillwell Ave'],
        rideShare: 'Uber/Lyft available but expensive',
        bicycle: 'Citi Bike stations nearby'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Behind home plate',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch',
        tip: 'Main entrance off Surf Avenue'
      },
      {
        name: 'Boardwalk Gate',
        location: 'Right field',
        bestFor: ['Bleachers', 'Party areas'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Cyclones Team Store', exclusive: ['Cyclones gear', 'Mets items', 'Coney Island themed items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Throughout concourse'],
      wifi: { available: true, network: 'Cyclones_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Left field', activities: ['Speed pitch', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['To all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Limited ADA parking'
    },

    gameDay: {
      tips: [
        { title: 'Nathan\'s Hot Dogs', description: 'Must try the original at Coney Island', category: 'food' },
        { title: 'Subway Access', description: 'Take the train - parking is difficult', category: 'arrival' },
        { title: 'Ocean Breeze', description: 'Can be cool even in summer', category: 'weather' },
        { title: 'Boardwalk Fun', description: 'Explore before/after games', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['Beach traffic on weekends']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Coney Island',
      description: 'Historic Brooklyn beach and amusement district',
      beforeGame: ['Beach', 'Boardwalk', 'Luna Park', 'NY Aquarium'],
      afterGame: ['Nathan\'s Famous', 'Boardwalk bars', 'Amusement rides'],
      radius: '0.5 miles'
    },

    transportation: {
      address: '1904 Surf Ave, Brooklyn, NY 11224',
      publicTransit: {
        subway: [
          { lines: ['D', 'F', 'N', 'Q'], station: 'Coney Island-Stillwell Ave', walkTime: '5 minutes' }
        ],
        bus: [
          { routes: ['B36', 'B64', 'B68', 'B82'], stops: ['Surf Avenue'] }
        ]
      },
      driving: {
        majorRoutes: ['Belt Parkway', 'Ocean Parkway'],
        typicalTraffic: 'Heavy on beach days',
        bestApproach: 'Belt Parkway to Ocean Parkway'
      },
      rideShare: {
        pickupZone: 'Surf Avenue',
        dropoffZone: 'Main gate area',
        surgePricing: 'High during events and beach days'
      }
    },

    history: {
      timeline: [
        { year: 2001, event: 'KeySpan Park opens' },
        { year: 2001, event: 'Brooklyn Cyclones inaugural season' },
        { year: 2001, event: 'First professional baseball in Brooklyn since 1957' },
        { year: 2021, event: 'Became Mets High-A affiliate' }
      ],
      traditions: [
        { name: 'Brooklyn Baseball', description: 'Reviving Brooklyn baseball tradition' },
        { name: 'Coney Island Fun', description: 'Beach and boardwalk atmosphere' }
      ]
    },

    fanExperience: {
      atmosphere: 'Beach party meets baseball with NYC energy',
      bestExperiences: [
        'Ocean views during games',
        'Coney Island boardwalk atmosphere',
        'Nathan\'s hot dogs',
        'Amusement park proximity'
      ],
      traditions: [
        'Seinfeld Night',
        'Brooklyn heritage celebrations',
        'Beach themed promotions'
      ],
      mascot: {
        name: 'Sandy the Seagull',
        description: 'Seagull mascot representing Coney Island beach'
      }
    },

    proTips: {
      insiderTips: [
        'Take the subway - parking is expensive and limited',
        'Bring layers - ocean breeze can be cool',
        'Explore Coney Island before/after games',
        'Try Nathan\'s Famous - the original location'
      ],
      avoidThese: [
        'Don\'t drive on beach weekends',
        'Avoid first base side in afternoon sun',
        'Skip expensive stadium parking'
      ],
      hiddenGems: [
        'Ocean views from upper sections',
        'Parachute Jump lit up at night',
        'Brooklyn Brewery selections',
        'Beach access from stadium'
      ],
      photoSpots: [
        'Ocean backdrop from seats',
        'Parachute Jump in background',
        'Wonder Wheel views',
        'Sandy the Seagull on boardwalk'
      ],
      bestValue: [
        'Bleacher seats with character',
        'Subway access saves money',
        'Combo deals with Luna Park',
        'Tuesday/Wednesday specials'
      ]
    }
  },

  'cedar-rapids-kernels': {
    id: 'cedar-rapids-kernels',
    name: 'Veterans Memorial Stadium',
    team: 'Cedar Rapids Kernels',
    opened: 2002,
    capacity: 5300,

    overview: {
      description: 'Veterans Memorial Stadium serves as home to the Twins High-A affiliate in Cedar Rapids, Iowa, featuring a modern design with Midwest hospitality and corn-themed branding.',
      highlights: [
        'Twins High-A affiliate',
        'Modern facility in Iowa',
        'Corn/agricultural theme',
        'Family-friendly atmosphere',
        'Cedar Rapids community hub'
      ],
      uniqueFeatures: [
        'Corn-themed elements throughout',
        'Iowa farmland views',
        'Natural grass field',
        'Veterans memorial displays',
        'Midwest architectural style'
      ],
      renovations: [
        { year: 2013, description: 'Flood recovery improvements' },
        { year: 2018, description: 'LED lighting installation' },
        { year: 2021, description: 'Clubhouse renovations' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club areas'],
        afternoon: ['Sections 205-210', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Premium seating areas'],
      shadeTips: [
        'Iowa summers can be hot and humid',
        'Third base side provides better shade',
        'Evening games more comfortable',
        'Limited covered seating available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base side', 'Bleacher sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 54, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool and variable', shadeTip: 'Dress warmly' },
        { month: 'May', avgTemp: 65, avgHumidity: 68, rainChance: 40, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'June', avgTemp: 75, avgHumidity: 70, rainChance: 40, typicalConditions: 'Warm and humid', shadeTip: 'Shade becomes valuable' },
        { month: 'July', avgTemp: 79, avgHumidity: 72, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Evening games better' },
        { month: 'August', avgTemp: 77, avgHumidity: 73, rainChance: 35, typicalConditions: 'Continued heat', shadeTip: 'Seek shade and hydrate' },
        { month: 'September', avgTemp: 69, avgHumidity: 70, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Perfect baseball weather' }
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
          { name: 'Party Deck', description: 'Left field group area', capacity: 100 }
        ]
      },
      budgetOptions: ['General admission', 'Lawn seating', 'Bleachers'],
      familySections: ['Family areas near kids zone'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '100',
          description: 'Group area with bar',
          amenities: ['Private bar', 'Tables', 'Group pricing']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of action', category: 'view' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Party Deck', tip: 'Fun group atmosphere', category: 'experience' },
        { section: 'Lawn', tip: 'Family-friendly budget option', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Kernel Dog', 'Iowa corn items', 'Pork tenderloin sandwich'],
      local: ['Iowa pork', 'Sweet corn', 'Local beers', 'Midwest favorites'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh corn'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Corn on the cob'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Popcorn'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Iowa craft beers'],
        wine: false,
        cocktails: false,
        localBreweries: ['Big Grove Brewery', 'Lion Bridge Brewing']
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
        tip: 'Use stadium lots'
      },
      alternativeTransport: {
        publicTransit: ['Limited Cedar Rapids Transit'],
        rideShare: 'Uber and Lyft available',
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
        { location: 'Kernels Team Store', exclusive: ['Kernels gear', 'Twins items', 'Corn-themed merchandise'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Corn maze replica'] }
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
      parkingSpaces: '20 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Iowa Pork', description: 'Try the pork tenderloin sandwich', category: 'food' },
        { title: 'Flood History', description: 'Learn about 2008 flood recovery', category: 'experience' },
        { title: 'Veterans Tribute', description: 'Visit memorial displays', category: 'experience' },
        { title: 'Midwest Weather', description: 'Can change quickly', category: 'weather' }
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
      name: 'Cedar Rapids',
      description: 'Iowa\'s second-largest city with agricultural heritage',
      beforeGame: ['NewBo District', 'Czech Village', 'Local breweries'],
      afterGame: ['Downtown Cedar Rapids', 'Local restaurants'],
      radius: '5 miles'
    },

    transportation: {
      address: '950 Rockford Rd SW, Cedar Rapids, IA 52404',
      publicTransit: {
        bus: [
          { routes: ['Cedar Rapids Transit'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-380', 'US-30', 'Highway 100'],
        typicalTraffic: 'Light',
        bestApproach: 'I-380 to Highway 30'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2002, event: 'Veterans Memorial Stadium opens' },
        { year: 2008, event: 'Major flood damages stadium' },
        { year: 2013, event: 'Stadium reopens after flood recovery' },
        { year: 2013, event: 'Became Twins affiliate' }
      ],
      traditions: [
        { name: 'Iowa Baseball', description: 'Celebrating Iowa\'s baseball heritage' },
        { name: 'Agricultural Pride', description: 'Corn and farming themes' }
      ]
    },

    fanExperience: {
      atmosphere: 'Midwest hospitality with agricultural charm',
      bestExperiences: [
        'Iowa nice atmosphere',
        'Corn-themed entertainment',
        'Family-friendly environment',
        'Veterans tributes'
      ],
      traditions: [
        'Corn races',
        'Iowa heritage nights',
        'Veterans appreciation'
      ],
      mascot: {
        name: 'Mr. Shucks',
        description: 'Corn cob mascot representing Iowa agriculture'
      }
    },

    proTips: {
      insiderTips: [
        'Try the pork tenderloin - Iowa specialty',
        'Visit NewBo District before games',
        'Third base side for afternoon shade',
        'Check for flood memorial displays'
      ],
      avoidThese: [
        'First base side in afternoon sun',
        'Weather can change quickly',
        'Limited public transit'
      ],
      hiddenGems: [
        'Czech Village nearby',
        'Iowa craft beer selection',
        'Flood recovery story',
        'Agricultural displays'
      ],
      photoSpots: [
        'With Mr. Shucks mascot',
        'Veterans memorial',
        'Iowa farmland views',
        'Corn-themed decorations'
      ],
      bestValue: [
        'Lawn seating for families',
        'Thursday promotions',
        'Group packages',
        'General admission deals'
      ]
    }
  }
};