import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides9: Record<string, StadiumGuide> = {
  'san-antonio-missions': {
    id: 'san-antonio-missions',
    name: 'Nelson W. Wolff Municipal Stadium',
    team: 'San Antonio Missions',
    opened: 1994,
    capacity: 9200,

    overview: {
      description: 'Nelson W. Wolff Municipal Stadium serves as home to the Padres Double-A affiliate in San Antonio, featuring Texas-sized baseball with downtown skyline views.',
      highlights: [
        'Padres Double-A affiliate',
        'San Antonio location',
        'Downtown skyline views',
        'Large capacity for Double-A',
        'Texas baseball tradition'
      ],
      uniqueFeatures: [
        'San Antonio skyline backdrop',
        'Mission-themed elements',
        'Natural grass field',
        'Texas-sized dimensions',
        'Hispanic heritage celebration'
      ],
      renovations: [
        { year: 2001, description: 'Expansion and improvements' },
        { year: 2015, description: 'LED lighting installation' },
        { year: 2020, description: 'Concourse upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-220', 'Suites'],
        evening: ['Most sections after 7 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Limited roof coverage'],
      shadeTips: [
        'Texas heat extreme in summer',
        'Limited shade structures',
        'Third base side preferred',
        'Evening games essential May-September'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper areas'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 73, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 80, avgHumidity: 67, rainChance: 35, typicalConditions: 'Getting warm', shadeTip: 'Shade becoming important' },
        { month: 'June', avgTemp: 87, avgHumidity: 65, rainChance: 25, typicalConditions: 'Hot and dry', shadeTip: 'Evening games recommended' },
        { month: 'July', avgTemp: 92, avgHumidity: 60, rainChance: 20, typicalConditions: 'Very hot', shadeTip: 'Night games only if possible' },
        { month: 'August', avgTemp: 93, avgHumidity: 60, rainChance: 20, typicalConditions: 'Peak heat', shadeTip: 'Maximum shade essential' },
        { month: 'September', avgTemp: 86, avgHumidity: 65, rainChance: 30, typicalConditions: 'Still hot', shadeTip: 'Evening relief coming' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Wolff Stadium Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Behind home plate club level'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Berm', description: 'Outfield grass seating', capacity: 2000 }
        ]
      },
      budgetOptions: ['Berm seating', 'General admission', 'Upper deck'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party areas'],
      partyAreas: [
        {
          name: 'Fiesta Deck',
          capacity: '200',
          description: 'Left field party area',
          amenities: ['Bar service', 'Tables', 'Tex-Mex food']
        }
      ],
      tips: [
        { section: 'Club level', tip: 'A/C relief from Texas heat', category: 'experience' },
        { section: 'Third base side', tip: 'Better shade coverage', category: 'shade' },
        { section: 'Berm', tip: 'Bring blankets and sunscreen', category: 'value' },
        { section: 'Behind home plate', tip: 'Best skyline views', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Puffy Tacos', 'Missions BBQ', 'Churros', 'Elote'],
      local: ['Tex-Mex specialties', 'Texas BBQ', 'Breakfast tacos', 'Margaritas'],
      healthy: ['Grilled options', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie tacos', 'Bean and cheese', 'Salads'],
      glutenFree: ['Corn tortilla options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Lone Star', 'Shiner', 'Texas craft beers', 'Mexican imports'],
        wine: true,
        cocktails: true,
        localBreweries: ['Freetail', 'Ranger Creek', 'Weathered Souls']
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
        publicTransit: ['VIA Metropolitan Transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Limited bike access'
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
        name: 'First Base Gate',
        location: 'First base side',
        bestFor: ['First base seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Missions Team Store', exclusive: ['Missions gear', 'Padres items', 'Puffy Taco merchandise'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Missions_WiFi' },
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
      parkingSpaces: '40 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Puffy Tacos', description: 'Try San Antonio specialty', category: 'food' },
        { title: 'Texas Heat', description: 'Evening games essential summer', category: 'weather' },
        { title: 'Downtown Views', description: 'Skyline backdrop impressive', category: 'experience' },
        { title: 'Hispanic Heritage', description: 'Copa nights celebration', category: 'experience' }
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
      name: 'West San Antonio',
      description: 'Near downtown with easy highway access',
      beforeGame: ['Downtown San Antonio', 'River Walk', 'Local restaurants'],
      afterGame: ['Downtown nightlife', 'St. Mary\'s Strip'],
      radius: '5 miles'
    },

    transportation: {
      address: '5757 US-90, San Antonio, TX 78227',
      publicTransit: {
        bus: [
          { routes: ['VIA routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['US-90', 'I-35', 'Loop 410'],
        typicalTraffic: 'Moderate',
        bestApproach: 'US-90 direct access'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on weekends'
      }
    },

    history: {
      timeline: [
        { year: 1994, event: 'Wolff Stadium opens' },
        { year: 2007, event: 'Became Padres affiliate' },
        { year: 1888, event: 'San Antonio baseball tradition begins' }
      ],
      traditions: [
        { name: 'Missions Heritage', description: 'Long baseball history' },
        { name: 'Puffy Taco', description: 'Mascot and food tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Texas-sized baseball with Hispanic flair',
      bestExperiences: [
        'Puffy Taco tradition',
        'San Antonio culture',
        'Texas BBQ and Tex-Mex',
        'Downtown skyline views'
      ],
      traditions: [
        'Copa de la Diversión',
        'Puffy Taco races',
        'Fiesta Fridays'
      ],
      mascot: {
        name: 'Henry the Puffy Taco',
        description: 'Anthropomorphic puffy taco mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Puffy Tacos are must-try',
        'Copa nights have special atmosphere',
        'Downtown San Antonio worth exploring',
        'Evening games avoid Texas heat'
      ],
      avoidThese: [
        'Day games April-September',
        'First base side in afternoon',
        'Underestimating Texas sun'
      ],
      hiddenGems: [
        'River Walk proximity',
        'Historic missions nearby',
        'San Antonio food scene',
        'Hispanic baseball culture'
      ],
      photoSpots: [
        'Downtown skyline backdrop',
        'With Henry the Puffy Taco',
        'Mission-themed areas',
        'Texas-sized scoreboard'
      ],
      bestValue: [
        'Berm seating for families',
        'Dollar nights promotions',
        'General admission',
        'Group packages'
      ]
    }
  },

  'springfield-cardinals': {
    id: 'springfield-cardinals',
    name: 'Hammons Field',
    team: 'Springfield Cardinals',
    opened: 2004,
    capacity: 7820,

    overview: {
      description: 'Hammons Field in Springfield serves as home to the Cardinals Double-A affiliate, featuring Ozark hospitality and one of the finest facilities in the Texas League.',
      highlights: [
        'Cardinals Double-A affiliate',
        'Springfield, Missouri location',
        'Opened in 2004',
        'Ozark region setting',
        'Route 66 proximity'
      ],
      uniqueFeatures: [
        'Ozark Mountain backdrop',
        'Cardinals organizational displays',
        'Natural grass field',
        'Missouri architecture',
        'Route 66 heritage'
      ],
      renovations: [
        { year: 2015, description: 'LED lighting upgrade' },
        { year: 2019, description: 'Concourse improvements' },
        { year: 2022, description: 'Premium seating updates' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-218', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Missouri summers hot and humid',
        'Ozark location provides some relief',
        'Third base side preferred',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 65, rainChance: 40, typicalConditions: 'Variable spring', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 70, avgHumidity: 68, rainChance: 45, typicalConditions: 'Pleasant', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 79, avgHumidity: 69, rainChance: 40, typicalConditions: 'Warm and humid', shadeTip: 'Shade becoming valuable' },
        { month: 'July', avgTemp: 84, avgHumidity: 68, rainChance: 35, typicalConditions: 'Hot summer', shadeTip: 'Evening games ideal' },
        { month: 'August', avgTemp: 83, avgHumidity: 68, rainChance: 35, typicalConditions: 'Continued heat', shadeTip: 'Shade important' },
        { month: 'September', avgTemp: 75, avgHumidity: 67, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Pleasant evenings' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Redbird Roost',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private bar'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Party Pavilion', description: 'Left field group area', capacity: 250 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party pavilion'],
      partyAreas: [
        {
          name: 'Left Field Pavilion',
          capacity: '250',
          description: 'Group party area',
          amenities: ['Picnic area', 'Private bar', 'Games']
        }
      ],
      tips: [
        { section: 'Redbird Roost', tip: 'All-inclusive Cardinals experience', category: 'experience' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Behind home plate', tip: 'Best overall views', category: 'view' },
        { section: 'Pavilion', tip: 'Great for groups', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Springfield Cashew Chicken', 'Cardinals BBQ', 'Ozark treats'],
      local: ['Missouri BBQ', 'Cashew chicken', 'Pork steaks', 'Gooey butter cake'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Mother\'s Brewing', 'Springfield Brewing', 'Missouri craft beers'],
        wine: true,
        cocktails: false,
        localBreweries: ['Mother\'s', 'Springfield Brewing', 'White River']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Jordan Valley Lots', distance: '300 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited availability',
        tip: 'Downtown lots available'
      },
      alternativeTransport: {
        publicTransit: ['City Utilities Transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Greenways Trail access'
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
        name: 'Third Base Gate',
        location: 'Third base side',
        bestFor: ['Third base seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Cardinals Team Store', exclusive: ['Springfield Cardinals gear', 'St. Louis Cardinals items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['All family restrooms'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Hammons_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Speed pitch', 'Bounce house'] }
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
      parkingSpaces: '35 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Cardinals Pipeline', description: 'See future St. Louis stars', category: 'experience' },
        { title: 'Cashew Chicken', description: 'Try Springfield invention', category: 'food' },
        { title: 'Route 66', description: 'Historic highway nearby', category: 'experience' },
        { title: 'Ozark Charm', description: 'Missouri hospitality', category: 'experience' }
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
      name: 'Downtown Springfield',
      description: 'Jordan Valley Park area near downtown',
      beforeGame: ['Downtown Springfield', 'Route 66 attractions', 'Local restaurants'],
      afterGame: ['Downtown bars', 'Entertainment district'],
      radius: '2 miles'
    },

    transportation: {
      address: '955 E Trafficway St, Springfield, MO 65802',
      publicTransit: {
        bus: [
          { routes: ['CU Transit'], stops: ['Downtown routes'] }
        ]
      },
      driving: {
        majorRoutes: ['I-44', 'US-65', 'US-60'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'US-65 to downtown'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2004, event: 'Hammons Field opens' },
        { year: 2005, event: 'Became Cardinals affiliate' },
        { year: 2012, event: 'Texas League championship' }
      ],
      traditions: [
        { name: 'Cardinals Way', description: 'St. Louis organizational excellence' },
        { name: 'Ozark Pride', description: 'Regional identity' }
      ]
    },

    fanExperience: {
      atmosphere: 'Cardinals tradition meets Ozark hospitality',
      bestExperiences: [
        'Cardinals organizational depth',
        'Springfield hospitality',
        'Modern facility',
        'Family atmosphere'
      ],
      traditions: [
        'Cardinals traditions',
        'Fireworks Fridays',
        'Thirsty Thursday'
      ],
      mascot: {
        name: 'Louie',
        description: 'Red cardinal mascot like St. Louis'
      }
    },

    proTips: {
      insiderTips: [
        'Cardinals prospects worth watching',
        'Try Springfield cashew chicken',
        'Route 66 attractions nearby',
        'Downtown Springfield walkable'
      ],
      avoidThese: [
        'Summer afternoon games',
        'Limited shade on hot days',
        'First base side in sun'
      ],
      hiddenGems: [
        'Cardinals development system',
        'Route 66 history',
        'Ozark beauty nearby',
        'Bass Pro flagship store'
      ],
      photoSpots: [
        'With Louie mascot',
        'Cardinals signage',
        'Ozark backdrop',
        'Modern facility views'
      ],
      bestValue: [
        'General admission flexibility',
        'Thirsty Thursday deals',
        'Family packages',
        'Group rates'
      ]
    }
  },

  'tennessee-smokies': {
    id: 'tennessee-smokies',
    name: 'Smokies Stadium',
    team: 'Tennessee Smokies',
    opened: 2000,
    capacity: 6412,

    overview: {
      description: 'Smokies Stadium near the Great Smoky Mountains serves as home to the Cubs Double-A affiliate, featuring mountain views and Tennessee hospitality.',
      highlights: [
        'Cubs Double-A affiliate',
        'Sevierville location',
        'Smoky Mountain views',
        'Near Dollywood',
        'Tourist area setting'
      ],
      uniqueFeatures: [
        'Mountain backdrop',
        'Tourist destination area',
        'Natural grass field',
        'Tennessee culture',
        'Cubs organizational displays'
      ],
      renovations: [
        { year: 2014, description: 'Facility improvements' },
        { year: 2018, description: 'LED lighting installation' },
        { year: 2021, description: 'Concourse upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Box seats'],
        afternoon: ['Sections under roof', 'Third base upper'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Limited covered areas', 'Premium sections'],
      shadeTips: [
        'Tennessee summers hot and humid',
        'Mountain location doesn\'t provide much relief',
        'Third base side preferred',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Team store', 'Limited indoor space'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 65, rainChance: 40, typicalConditions: 'Variable spring', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 70, avgHumidity: 68, rainChance: 40, typicalConditions: 'Pleasant', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 78, avgHumidity: 70, rainChance: 40, typicalConditions: 'Warm and humid', shadeTip: 'Shade becoming valuable' },
        { month: 'July', avgTemp: 82, avgHumidity: 72, rainChance: 45, typicalConditions: 'Hot and humid', shadeTip: 'Evening games ideal' },
        { month: 'August', avgTemp: 81, avgHumidity: 73, rainChance: 40, typicalConditions: 'Continued heat', shadeTip: 'Shade essential' },
        { month: 'September', avgTemp: 74, avgHumidity: 70, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'More comfortable' }
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
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 1000 }
        ]
      },
      budgetOptions: ['Lawn seating', 'General admission', 'Bleachers'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '200',
          description: 'Left field group area',
          amenities: ['Covered area', 'Picnic tables']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best mountain views', category: 'view' },
        { section: 'Third base side', tip: 'Better shade coverage', category: 'shade' },
        { section: 'Lawn', tip: 'Family-friendly atmosphere', category: 'value' },
        { section: 'Box seats', tip: 'Close to action', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Smokies BBQ', 'Mountain nachos', 'Fried green tomatoes'],
      local: ['Tennessee BBQ', 'Southern specialties', 'Sweet tea', 'Moon pies'],
      healthy: ['Limited healthy options'],
      vegetarian: ['Basic vegetarian options'],
      glutenFree: ['Very limited'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Limited craft selection'],
        wine: false,
        cocktails: false,
        localBreweries: ['Yee-Haw Brewing', 'Smoky Mountain Brewery']
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
        publicTransit: ['No public transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Limited bike infrastructure'
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
        { location: 'Smokies Team Store', exclusive: ['Smokies gear', 'Cubs items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
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
        elevators: ['To suite level']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Limited'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '20 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Mountain Views', description: 'Smoky Mountains backdrop', category: 'experience' },
        { title: 'Tourist Area', description: 'Combine with Dollywood visit', category: 'experience' },
        { title: 'Cubs Pipeline', description: 'See future Chicago stars', category: 'experience' },
        { title: 'Tennessee Heat', description: 'Evening games preferred', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['Game time arrival']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: false
      }
    },

    neighborhood: {
      name: 'Sevierville',
      description: 'Tourist area near Gatlinburg and Pigeon Forge',
      beforeGame: ['Tourist attractions', 'Local restaurants'],
      afterGame: ['Limited nightlife', 'Tourist areas'],
      radius: '10 miles'
    },

    transportation: {
      address: '3540 Line Dr, Kodak, TN 37764',
      publicTransit: {
        bus: [
          { routes: ['No public transit'], stops: [] }
        ]
      },
      driving: {
        majorRoutes: ['I-40', 'Highway 66', 'Highway 411'],
        typicalTraffic: 'Heavy during tourist season',
        bestApproach: 'I-40 to Exit 407'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher during tourist season'
      }
    },

    history: {
      timeline: [
        { year: 2000, event: 'Smokies Stadium opens' },
        { year: 2011, event: 'Became Cubs affiliate' },
        { year: 2016, event: 'Southern League championship' }
      ],
      traditions: [
        { name: 'Mountain Baseball', description: 'Smoky Mountain setting' },
        { name: 'Cubs Connection', description: 'Chicago pipeline' }
      ]
    },

    fanExperience: {
      atmosphere: 'Mountain baseball with tourist area energy',
      bestExperiences: [
        'Smoky Mountain views',
        'Cubs prospects',
        'Tennessee hospitality',
        'Tourist destination combo'
      ],
      traditions: [
        'Friday Fireworks',
        'Thirsty Thursday',
        'Tourist promotions'
      ],
      mascot: {
        name: 'Homer the Dragon',
        description: 'Dragon mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Combine with Dollywood trip',
        'Mountain views best from third base',
        'Tourist traffic can be heavy',
        'Evening games avoid heat'
      ],
      avoidThese: [
        'Tourist season traffic',
        'Day games in summer',
        'Limited food options'
      ],
      hiddenGems: [
        'Great Smoky Mountains nearby',
        'Gatlinburg/Pigeon Forge',
        'Dollywood proximity',
        'Mountain scenery'
      ],
      photoSpots: [
        'Mountain backdrop',
        'With Homer mascot',
        'Smokies signage',
        'Scenic overlooks'
      ],
      bestValue: [
        'Lawn seating families',
        'General admission',
        'Thursday deals',
        'Tourist packages'
      ]
    }
  },

  'tulsa-drillers': {
    id: 'tulsa-drillers',
    name: 'ONEOK Field',
    team: 'Tulsa Drillers',
    opened: 2010,
    capacity: 7833,

    overview: {
      description: 'ONEOK Field in downtown Tulsa is one of the finest facilities in Double-A baseball, serving as home to the Dodgers affiliate with Art Deco architecture and urban setting.',
      highlights: [
        'Dodgers Double-A affiliate',
        'Downtown Tulsa location',
        'Opened in 2010',
        'Art Deco architecture',
        'Greenwood District proximity'
      ],
      uniqueFeatures: [
        'Downtown skyline views',
        'Art Deco design elements',
        'Natural grass field',
        'Oil industry heritage',
        'Route 66 location'
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
        'Oklahoma summers very hot',
        'Downtown location intensifies heat',
        'Third base side preferred',
        'Evening games essential summer'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Right field'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 63, avgHumidity: 65, rainChance: 35, typicalConditions: 'Variable spring', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 72, avgHumidity: 68, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 81, avgHumidity: 67, rainChance: 35, typicalConditions: 'Hot', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 87, avgHumidity: 63, rainChance: 25, typicalConditions: 'Very hot', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 86, avgHumidity: 64, rainChance: 30, typicalConditions: 'Continued heat', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 77, avgHumidity: 67, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'More comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Oil Derrick Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private bar'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Greenwood Terrace', description: 'Left field party area', capacity: 200 }
        ]
      },
      budgetOptions: ['Upper reserved', 'General admission', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Terrace areas'],
      partyAreas: [
        {
          name: 'Greenwood Terrace',
          capacity: '200',
          description: 'Left field party deck',
          amenities: ['Full bar', 'Tables', 'Downtown views']
        }
      ],
      tips: [
        { section: 'Oil Derrick Club', tip: 'All-inclusive with A/C', category: 'experience' },
        { section: 'Behind home plate', tip: 'Best downtown views', category: 'view' },
        { section: 'Third base upper', tip: 'Best shade value', category: 'shade' },
        { section: 'Greenwood Terrace', tip: 'Social atmosphere', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Driller Dog', 'Oklahoma BBQ', 'Chicken and waffles', 'Fried everything'],
      local: ['Oklahoma BBQ', 'Native American fry bread', 'Local craft beers'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Prairie Artisan', 'Marshall Brewing', 'Oklahoma craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Prairie', 'Marshall', 'Cabin Boys', 'American Solera']
      }
    },

    parking: {
      lots: [
        { name: 'ONEOK Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Downtown Lots', distance: '0.3 miles', price: '$5-10', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 6 PM',
        tip: 'Free after 6 PM downtown'
      },
      alternativeTransport: {
        publicTransit: ['Tulsa Transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Elgin Avenue entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch',
        tip: 'Main downtown entrance'
      },
      {
        name: 'Greenwood Gate',
        location: 'Archer Street',
        bestFor: ['Left field seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Drillers Team Store', exclusive: ['Drillers gear', 'Dodgers items', 'Oil derrick merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Upper concourse'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Multiple locations'],
      wifi: { available: true, network: 'ONEOK_WiFi' },
      chargingStations: ['Club areas', 'Concourse'],
      kidZones: [
        { name: 'Hornsby\'s Hangout', location: 'Right field', activities: ['Playground', 'Speed pitch', 'Games'] }
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
      parkingSpaces: '40 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Downtown Location', description: 'Walk to restaurants/bars', category: 'experience' },
        { title: 'Art Deco Design', description: 'Architecture worth seeing', category: 'experience' },
        { title: 'Oil Heritage', description: 'Derrick-themed elements', category: 'experience' },
        { title: 'Oklahoma Heat', description: 'Evening games essential', category: 'weather' }
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
      name: 'Downtown Tulsa',
      description: 'Greenwood District and downtown entertainment',
      beforeGame: ['Blue Dome District', 'Greenwood history', 'Downtown restaurants'],
      afterGame: ['Downtown nightlife', 'Brady Arts District'],
      radius: '1 mile'
    },

    transportation: {
      address: '201 N Elgin Ave, Tulsa, OK 74120',
      publicTransit: {
        bus: [
          { routes: ['Tulsa Transit'], stops: ['Downtown routes'] }
        ]
      },
      driving: {
        majorRoutes: ['I-44', 'I-244', 'US-75'],
        typicalTraffic: 'Moderate downtown',
        bestApproach: 'I-244 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2010, event: 'ONEOK Field opens' },
        { year: 2015, event: 'Became Dodgers affiliate' },
        { year: 2018, event: 'Texas League championship' }
      ],
      traditions: [
        { name: 'Oil Industry', description: 'Tulsa oil heritage' },
        { name: 'Route 66', description: 'Historic highway location' }
      ]
    },

    fanExperience: {
      atmosphere: 'Downtown energy with oil heritage theme',
      bestExperiences: [
        'Downtown Tulsa location',
        'Art Deco architecture',
        'Modern amenities',
        'Dodgers prospects'
      ],
      traditions: [
        'Fireworks Fridays',
        'Thirsty Thursday',
        'Oil industry nights'
      ],
      mascot: {
        name: 'Hornsby',
        description: 'Baseball-themed mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Downtown Tulsa walkable',
        'Art Deco architecture impressive',
        'Blue Dome District nearby',
        'Greenwood history significant'
      ],
      avoidThese: [
        'Summer day games',
        'Downtown parking meters',
        'First base afternoon sun'
      ],
      hiddenGems: [
        'Greenwood District history',
        'Route 66 attractions',
        'Brady Arts District',
        'Downtown renaissance'
      ],
      photoSpots: [
        'Downtown skyline backdrop',
        'Art Deco entrance',
        'With Hornsby mascot',
        'Oil derrick displays'
      ],
      bestValue: [
        'Thirsty Thursday deals',
        'Upper reserved seats',
        'Downtown parking garages',
        'Group packages'
      ]
    }
  },

  'wichita-wind-surge': {
    id: 'wichita-wind-surge',
    name: 'Riverfront Stadium',
    team: 'Wichita Wind Surge',
    opened: 2021,
    capacity: 10025,

    overview: {
      description: 'Riverfront Stadium is one of the newest parks in professional baseball, serving as home to the Twins Double-A affiliate with Arkansas River views and state-of-the-art amenities.',
      highlights: [
        'Twins Double-A affiliate',
        'Opened in 2021',
        'Arkansas River location',
        'Brand new facility',
        'Largest Double-A capacity'
      ],
      uniqueFeatures: [
        'Arkansas River views',
        'State-of-the-art design',
        'Natural grass field',
        'Wind-themed elements',
        'Modern architecture'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-220', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Kansas summers hot with wind',
        'Modern design includes shade features',
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
        { month: 'April', avgTemp: 59, avgHumidity: 65, rainChance: 35, typicalConditions: 'Windy spring', shadeTip: 'Layers for wind' },
        { month: 'May', avgTemp: 69, avgHumidity: 68, rainChance: 40, typicalConditions: 'Variable weather', shadeTip: 'Pleasant most days' },
        { month: 'June', avgTemp: 79, avgHumidity: 67, rainChance: 35, typicalConditions: 'Warm and windy', shadeTip: 'Shade becoming valuable' },
        { month: 'July', avgTemp: 85, avgHumidity: 63, rainChance: 30, typicalConditions: 'Hot and dry', shadeTip: 'Evening games ideal' },
        { month: 'August', avgTemp: 84, avgHumidity: 64, rainChance: 30, typicalConditions: 'Continued heat', shadeTip: 'Shade essential' },
        { month: 'September', avgTemp: 75, avgHumidity: 66, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'More comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Riverfront Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'River views'],
            access: 'Premium level with best views'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Wind Deck', description: 'Left field party area', capacity: 300 }
        ]
      },
      budgetOptions: ['Upper reserved', 'Lawn seating', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['360 concourse', 'Wind Deck'],
      partyAreas: [
        {
          name: 'Wind Deck',
          capacity: '300',
          description: 'Left field party area',
          amenities: ['Full bar', 'Tables', 'River views']
        }
      ],
      tips: [
        { section: 'Riverfront Club', tip: 'All-inclusive with best views', category: 'experience' },
        { section: '360 concourse', tip: 'Walk for different perspectives', category: 'experience' },
        { section: 'Third base upper', tip: 'Best shade value', category: 'shade' },
        { section: 'Wind Deck', tip: 'Social atmosphere', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Wind Surge Burger', 'Kansas BBQ', 'Tornado Fries'],
      local: ['Kansas BBQ', 'Wheat state specialties', 'Local beef'],
      healthy: ['Grilled options', 'Salads', 'Fresh items'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Wichita Brewing', 'Central Standard', 'Kansas craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Wichita Brewing', 'Central Standard', 'Hopping Gnome']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Riverfront Lots', distance: '300 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited availability',
        tip: 'Arrive early for street parking'
      },
      alternativeTransport: {
        publicTransit: ['Wichita Transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'River path access'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch',
        tip: 'Riverfront entrance'
      },
      {
        name: 'River Gate',
        location: 'Left field',
        bestFor: ['Wind Deck', 'Outfield'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Wind Surge Team Store', exclusive: ['Wind Surge gear', 'Twins items'] }
      ],
      firstAid: ['Multiple locations'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Available'],
      atms: ['Throughout'],
      wifi: { available: true, network: 'WindSurge_WiFi' },
      chargingStations: ['Throughout facility'],
      kidZones: [
        { name: 'Surge Zone', location: 'Right field', activities: ['Modern playground', 'Interactive games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Full ADA compliance'],
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
        { title: 'Brand New', description: 'Newest park experience', category: 'experience' },
        { title: 'River Views', description: 'Arkansas River scenery', category: 'experience' },
        { title: 'Kansas Wind', description: 'Can affect games', category: 'weather' },
        { title: 'Modern Amenities', description: 'State-of-the-art throughout', category: 'experience' }
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
      name: 'Delano District',
      description: 'Historic district with restaurants and entertainment',
      beforeGame: ['Delano restaurants', 'Riverfront walking', 'Local breweries'],
      afterGame: ['Delano nightlife', 'Downtown Wichita'],
      radius: '2 miles'
    },

    transportation: {
      address: '300 S Sycamore St, Wichita, KS 67213',
      publicTransit: {
        bus: [
          { routes: ['Wichita Transit'], stops: ['Stadium area'] }
        ]
      },
      driving: {
        majorRoutes: ['I-135', 'US-54', 'Highway 96'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-135 to downtown'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2021, event: 'Riverfront Stadium opens' },
        { year: 2021, event: 'Wind Surge begin play' },
        { year: 2020, event: 'Team relocates from New Orleans' }
      ],
      traditions: [
        { name: 'New Beginning', description: 'Building new traditions' },
        { name: 'Wind Identity', description: 'Kansas wind theme' }
      ]
    },

    fanExperience: {
      atmosphere: 'Brand new facility with Midwest hospitality',
      bestExperiences: [
        'State-of-the-art amenities',
        'Arkansas River setting',
        'Modern everything',
        'Growing fan base'
      ],
      traditions: [
        'Wind celebrations',
        'Fireworks Fridays',
        'Thirsty Thursday'
      ],
      mascot: {
        name: 'Surge',
        description: 'Wind-themed mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Newest Double-A park worth seeing',
        'Delano District great before/after',
        'River walking paths scenic',
        'Modern amenities throughout'
      ],
      avoidThese: [
        'Kansas wind can be strong',
        'Summer afternoon heat',
        'Limited parking on big nights'
      ],
      hiddenGems: [
        'Delano District revival',
        'River development',
        'Keeper of the Plains nearby',
        'Old Town entertainment'
      ],
      photoSpots: [
        'River views from stadium',
        'Modern architecture',
        'With Surge mascot',
        'Wind-themed areas'
      ],
      bestValue: [
        'Upper reserved seats',
        'Wind Deck experience',
        'Thursday promotions',
        'Group packages'
      ]
    }
  }
};