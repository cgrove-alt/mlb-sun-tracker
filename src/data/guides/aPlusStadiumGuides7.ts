import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides7: Record<string, StadiumGuide> = {
  'modesto-nuts': {
    id: 'modesto-nuts',
    name: 'John Thurman Field',
    team: 'Modesto Nuts',
    opened: 1955,
    capacity: 4000,

    overview: {
      description: 'John Thurman Field is a classic California ballpark in the Central Valley, serving as home to the Mariners High-A affiliate with a long history dating back to 1955.',
      highlights: [
        'Mariners High-A affiliate',
        'Central Valley location',
        'Historic ballpark since 1955',
        'Agricultural region setting',
        'Classic California baseball'
      ],
      uniqueFeatures: [
        'Nut-themed entertainment',
        'Central Valley agricultural heritage',
        'Natural grass field',
        'Historic grandstand',
        'San Joaquin Valley setting'
      ],
      renovations: [
        { year: 1997, description: 'Major renovation and expansion' },
        { year: 2015, description: 'LED lighting installation' },
        { year: 2019, description: 'Concourse improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Covered grandstand'],
        afternoon: ['Sections under roof', 'Third base upper'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Grandstand roof sections', 'Premium areas'],
      shadeTips: [
        'Central Valley heat extreme in summer',
        'Covered seating essential July-August',
        'Evening games much more comfortable',
        'Hydration crucial'
      ],
      sunProtection: {
        shadedConcourses: ['Under grandstand'],
        indoorAreas: ['Team store', 'Club areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 70, avgHumidity: 60, rainChance: 20, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 78, avgHumidity: 55, rainChance: 10, typicalConditions: 'Warming up', shadeTip: 'Shade helpful afternoons' },
        { month: 'June', avgTemp: 87, avgHumidity: 50, rainChance: 5, typicalConditions: 'Hot and dry', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 94, avgHumidity: 45, rainChance: 2, typicalConditions: 'Extreme heat', shadeTip: 'Evening games only if possible' },
        { month: 'August', avgTemp: 93, avgHumidity: 45, rainChance: 2, typicalConditions: 'Continued extreme heat', shadeTip: 'Shade absolutely essential' },
        { month: 'September', avgTemp: 87, avgHumidity: 50, rainChance: 5, typicalConditions: 'Still very hot', shadeTip: 'Shade remains important' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Limited suite options'],
          amenities: ['Enhanced seating', 'Better views']
        },
        specialAreas: [
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Bleacher seats', 'General admission'],
      familySections: ['Family areas available'],
      standingRoom: ['Concourse areas'],
      tips: [
        { section: 'Covered grandstand', tip: 'Essential for summer heat', category: 'shade' },
        { section: 'Behind home plate', tip: 'Best views under cover', category: 'view' },
        { section: 'Third base side', tip: 'Gets shade first', category: 'shade' },
        { section: 'Lawn', tip: 'Bring blanket and sun protection', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Modesto Nuts sundae', 'Tri-tip sandwich', 'Garlic fries'],
      local: ['Central Valley produce', 'California wines', 'Local almonds and walnuts'],
      healthy: ['Grilled options', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie options available'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Budweiser', 'Coors', 'Local craft options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Dust Bowl Brewing', 'Blaker Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '300 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited near stadium',
        tip: 'Arrive early for close parking'
      },
      alternativeTransport: {
        publicTransit: ['MAX bus service'],
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
        { location: 'Nuts Team Store', exclusive: ['Nuts gear', 'Mariners items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Area', location: 'Right field', activities: ['Playground'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated accessible areas'],
        entrance: 'Main gate accessible',
        elevators: ['Not applicable - single level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '15 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Central Valley Heat', description: 'Extreme heat in summer', category: 'weather' },
        { title: 'Agricultural Heritage', description: 'Nut-themed entertainment', category: 'experience' },
        { title: 'Evening Games', description: 'Much more comfortable', category: 'weather' },
        { title: 'Local Produce', description: 'Try Central Valley specialties', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:05 PM',
        rushHours: ['Game time arrival']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Modesto',
      description: 'Central Valley agricultural hub',
      beforeGame: ['Downtown Modesto', 'Local restaurants'],
      afterGame: ['Downtown bars', 'Local establishments'],
      radius: '5 miles'
    },

    transportation: {
      address: '601 Neece Dr, Modesto, CA 95351',
      publicTransit: {
        bus: [
          { routes: ['MAX routes'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway 99', 'I-5', 'Highway 132'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'Highway 99 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Stadium area',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1955, event: 'John Thurman Field opens' },
        { year: 1997, event: 'Major renovation' },
        { year: 2017, event: 'Became Mariners affiliate' }
      ],
      traditions: [
        { name: 'Nuts Entertainment', description: 'Nut-themed promotions and fun' },
        { name: 'Central Valley Baseball', description: 'Long baseball tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Classic California baseball with agricultural charm',
      bestExperiences: [
        'Nut-themed entertainment',
        'Central Valley hospitality',
        'Historic ballpark atmosphere',
        'Agricultural heritage'
      ],
      traditions: [
        'Nut races',
        'Agricultural appreciation nights',
        'Mariners prospects'
      ],
      mascot: {
        name: 'Al the Almond and Wally the Walnut',
        description: 'Nut mascots representing local agriculture'
      }
    },

    proTips: {
      insiderTips: [
        'Evening games essential in summer heat',
        'Covered grandstand worth premium for shade',
        'Try local Central Valley produce',
        'Arrive early for limited parking'
      ],
      avoidThese: [
        'Day games in summer if possible',
        'Bleachers in afternoon sun',
        'Underestimating Central Valley heat'
      ],
      hiddenGems: [
        'Agricultural heritage displays',
        'Classic ballpark architecture',
        'Central Valley food specialties',
        'Historic grandstand'
      ],
      photoSpots: [
        'With nut mascots',
        'Historic grandstand entrance',
        'Classic ballpark views',
        'Agricultural displays'
      ],
      bestValue: [
        'Lawn seating for families',
        'General admission flexibility',
        'Weeknight games',
        'Group packages'
      ]
    }
  },

  'rome-emperors': {
    id: 'rome-emperors',
    name: 'AdventHealth Stadium',
    team: 'Rome Emperors',
    opened: 2003,
    capacity: 5105,

    overview: {
      description: 'AdventHealth Stadium in Rome, Georgia serves as home to the Braves High-A affiliate, offering Southern hospitality and a family-friendly atmosphere in northwest Georgia.',
      highlights: [
        'Braves High-A affiliate',
        'Northwest Georgia location',
        'Modern facility opened 2003',
        'Close to Atlanta pipeline',
        'Southern baseball tradition'
      ],
      uniqueFeatures: [
        'Emperor-themed elements',
        'Georgia pine trees backdrop',
        'Natural grass field',
        'Braves organizational displays',
        'Southern architecture'
      ],
      renovations: [
        { year: 2014, description: 'LED lighting installation' },
        { year: 2018, description: 'Concourse improvements' },
        { year: 2023, description: 'Rebrand to Emperors' }
      ],
      previousNames: ['State Mutual Stadium (2003-2022)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Premium areas'],
        afternoon: ['Sections 210-216', 'Suite level'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Limited covered seating', 'Premium areas'],
      shadeTips: [
        'Georgia summers hot and humid',
        'Third base side better for afternoon',
        'Evening games more comfortable',
        'Humidity makes heat feel worse'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Team store', 'Restaurant'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 76, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 83, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Shade recommended' },
        { month: 'July', avgTemp: 87, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games ideal' },
        { month: 'August', avgTemp: 86, avgHumidity: 73, rainChance: 40, typicalConditions: 'Continued heat', shadeTip: 'Shade essential' },
        { month: 'September', avgTemp: 79, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still warm', shadeTip: 'More comfortable' }
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
          { name: 'Berm', description: 'Outfield grass seating', capacity: 300 }
        ]
      },
      budgetOptions: ['Berm seating', 'General admission', 'Bleachers'],
      familySections: ['Family Zone sections'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Party Pavilion',
          capacity: '100',
          description: 'Left field group area',
          amenities: ['Covered area', 'Tables', 'Group seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade in afternoon', category: 'shade' },
        { section: 'Berm', tip: 'Fun family atmosphere', category: 'experience' },
        { section: 'Party Pavilion', tip: 'Great for groups', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Emperor Burger', 'Georgia BBQ', 'Peach cobbler'],
      local: ['Georgia peaches', 'Southern BBQ', 'Sweet tea', 'Boiled peanuts'],
      healthy: ['Grilled chicken', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Budweiser', 'Miller', 'Regional craft beers'],
        wine: false,
        cocktails: false,
        localBreweries: ['Rome City Brewing', 'Etowah River Brewing']
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
      },
      {
        name: 'Left Field Gate',
        location: 'Third base side',
        bestFor: ['Berm', 'Pavilion'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Emperors Team Store', exclusive: ['Emperors gear', 'Braves items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true },
      chargingStations: ['Limited areas'],
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
      parkingSpaces: '20 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Braves Pipeline', description: 'See future Braves stars', category: 'experience' },
        { title: 'Georgia Heat', description: 'Evening games more comfortable', category: 'weather' },
        { title: 'Southern BBQ', description: 'Try local BBQ options', category: 'food' },
        { title: 'Family Fun', description: 'Extensive kids activities', category: 'experience' }
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
      name: 'Rome',
      description: 'Historic Georgia city in Appalachian foothills',
      beforeGame: ['Downtown Rome', 'Local restaurants'],
      afterGame: ['Downtown establishments'],
      radius: '5 miles'
    },

    transportation: {
      address: '755 Braves Blvd NE, Rome, GA 30161',
      publicTransit: {
        bus: [
          { routes: ['Rome Transit'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['US-411', 'US-27', 'GA-20'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'US-411 to Braves Blvd'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2003, event: 'State Mutual Stadium opens' },
        { year: 2003, event: 'Rome Braves inaugural season' },
        { year: 2023, event: 'Rebrand to Rome Emperors' }
      ],
      traditions: [
        { name: 'Braves Heritage', description: 'Strong organizational connection' },
        { name: 'Southern Baseball', description: 'Georgia baseball tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Southern hospitality with Braves tradition',
      bestExperiences: [
        'Braves prospects on display',
        'Southern BBQ and hospitality',
        'Family-friendly entertainment',
        'Emperor theme fun'
      ],
      traditions: [
        'Tomahawk chop',
        'Southern hospitality nights',
        'Braves heritage celebrations'
      ],
      mascot: {
        name: 'Romey',
        description: 'Emperor-themed mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Close to Braves organization - good prospects',
        'Try Georgia BBQ and peach desserts',
        'Evening games much more comfortable',
        'Family entertainment extensive'
      ],
      avoidThese: [
        'Afternoon games in summer heat',
        'First base side in afternoon',
        'Underestimating Georgia humidity'
      ],
      hiddenGems: [
        'Braves organizational connection',
        'Historic Rome nearby',
        'Berry College campus beautiful',
        'Appalachian foothills scenery'
      ],
      photoSpots: [
        'With Romey mascot',
        'Emperor-themed entrance',
        'Georgia pines backdrop',
        'Braves signage'
      ],
      bestValue: [
        'Berm seating for families',
        'General admission',
        'Thursday promotions',
        'Group packages'
      ]
    }
  },

  'winston-salem-dash': {
    id: 'winston-salem-dash',
    name: 'Truist Stadium',
    team: 'Winston-Salem Dash',
    opened: 2010,
    capacity: 5500,

    overview: {
      description: 'Truist Stadium in downtown Winston-Salem is a modern ballpark serving as home to the White Sox High-A affiliate, featuring skyline views and tobacco heritage displays.',
      highlights: [
        'White Sox High-A affiliate',
        'Downtown Winston-Salem location',
        'Modern facility opened 2010',
        'Tobacco Road heritage',
        'City skyline views'
      ],
      uniqueFeatures: [
        'Downtown skyline backdrop',
        'Tobacco heritage displays',
        'Natural grass field',
        'Winston-Salem history exhibits',
        'Modern architecture'
      ],
      renovations: [
        { year: 2017, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Premium seating improvements' },
        { year: 2021, description: 'Renamed Truist Stadium' }
      ],
      previousNames: ['BB&T Ballpark (2010-2020)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-220', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'North Carolina summers hot and humid',
        'Third base side preferable',
        'Upper levels provide shade below',
        'Evening games most comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base field level', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 64, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 73, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 80, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck recommended' },
        { month: 'July', avgTemp: 84, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'August', avgTemp: 83, avgHumidity: 73, rainChance: 40, typicalConditions: 'Continued heat', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 76, avgHumidity: 70, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'More comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Piedmont Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Behind home plate premium level'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Right field group area', capacity: 150 }
        ]
      },
      budgetOptions: ['Upper reserved', 'Outfield seats', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Right Field Party Deck',
          capacity: '150',
          description: 'Group party area with bar',
          amenities: ['Full bar', 'Tables', 'Standing room', 'City views']
        }
      ],
      tips: [
        { section: 'Piedmont Club', tip: 'All-inclusive with A/C', category: 'experience' },
        { section: 'Behind home plate', tip: 'Best views of downtown', category: 'view' },
        { section: 'Third base upper', tip: 'Good shade and value', category: 'shade' },
        { section: 'Party Deck', tip: 'Social atmosphere with skyline', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Dash Dog', 'Carolina BBQ', 'Moravian cookies', 'Texas Pete wings'],
      local: ['North Carolina BBQ', 'Cheerwine', 'Krispy Kreme donuts', 'Sweet tea'],
      healthy: ['Grilled options', 'Salads', 'Fresh items'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Foothills', 'Highland', 'North Carolina craft beers'],
        wine: true,
        cocktails: false,
        localBreweries: ['Foothills Brewing', 'Small Batch', 'Wise Man Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '100 yards', price: '$5-8', shadedSpots: false, covered: false },
        { name: 'Downtown Decks', distance: '0.3 miles', price: '$5-10', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 6 PM',
        tip: 'Free after 6 PM on streets'
      },
      alternativeTransport: {
        publicTransit: ['WSTA bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Downtown bike lanes'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch',
        tip: 'Downtown entrance'
      },
      {
        name: 'Right Field Gate',
        location: 'First base side',
        bestFor: ['Party deck', 'Right field'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Dash Team Store', exclusive: ['Dash gear', 'White Sox items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['All family restrooms'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Truist_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Fun Zone', location: 'Left field', activities: ['Playground', 'Speed pitch', 'Bounce house'] }
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
      parkingSpaces: '25 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Downtown Location', description: 'Walk to restaurants/bars', category: 'experience' },
        { title: 'Carolina BBQ', description: 'Try authentic NC style', category: 'food' },
        { title: 'Moravian Heritage', description: 'Local cultural traditions', category: 'experience' },
        { title: 'Summer Heat', description: 'Evening games preferable', category: 'weather' }
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
      name: 'Downtown Winston-Salem',
      description: 'Historic tobacco city with arts and innovation districts',
      beforeGame: ['Downtown restaurants', 'Innovation Quarter', 'Old Salem'],
      afterGame: ['Downtown nightlife', 'Fourth Street entertainment'],
      radius: '1 mile'
    },

    transportation: {
      address: '926 Brookstown Ave, Winston-Salem, NC 27101',
      publicTransit: {
        bus: [
          { routes: ['WSTA routes'], stops: ['Downtown Winston-Salem'] }
        ]
      },
      driving: {
        majorRoutes: ['I-40', 'US-52', 'US-421'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-40 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Brookstown Avenue',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate on game nights'
      }
    },

    history: {
      timeline: [
        { year: 2010, event: 'BB&T Ballpark opens' },
        { year: 2010, event: 'Dash inaugural downtown season' },
        { year: 2021, event: 'Renamed Truist Stadium' }
      ],
      traditions: [
        { name: 'Tobacco Road', description: 'Historic tobacco heritage' },
        { name: 'Moravian Culture', description: 'Local cultural traditions' }
      ]
    },

    fanExperience: {
      atmosphere: 'Downtown energy with Southern charm',
      bestExperiences: [
        'Downtown Winston-Salem location',
        'City skyline views',
        'North Carolina BBQ',
        'Modern amenities'
      ],
      traditions: [
        'Dash racing',
        'Thirsty Thursday',
        'Fireworks Fridays'
      ],
      mascot: {
        name: 'Bolt',
        description: 'Lightning bolt mascot representing speed'
      }
    },

    proTips: {
      insiderTips: [
        'Try Foothills beer - local favorite',
        'Downtown location perfect for pre/post game',
        'Piedmont Club worth upgrade for heat',
        'Krispy Kreme donuts at concessions'
      ],
      avoidThese: [
        'Field level in afternoon sun',
        'Downtown parking on busy nights',
        'Missing local food specialties'
      ],
      hiddenGems: [
        'Innovation Quarter nearby',
        'Old Salem historic area',
        'Arts District walking distance',
        'Tobacco heritage displays'
      ],
      photoSpots: [
        'Downtown skyline backdrop',
        'With Bolt mascot',
        'Tobacco Road signage',
        'Modern stadium architecture'
      ],
      bestValue: [
        'Upper reserved seats',
        'Downtown deck parking',
        'Thirsty Thursday deals',
        'Group packages'
      ]
    }
  }
};