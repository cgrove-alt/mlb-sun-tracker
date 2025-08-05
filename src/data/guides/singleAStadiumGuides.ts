import { StadiumGuide } from '../stadiumGuides';

export const singleAStadiumGuides: Record<string, StadiumGuide> = {
  'augusta-greenjackets': {
    id: 'augusta-greenjackets',
    name: 'SRP Park',
    team: 'Augusta GreenJackets',
    opened: 2018,
    capacity: 4782,

    overview: {
      description: 'SRP Park sits along the Savannah River in North Augusta, serving as home to the Braves Single-A affiliate with modern amenities and scenic river views.',
      highlights: [
        'Braves Single-A affiliate',
        'Savannah River location',
        'Opened in 2018',
        'Downtown North Augusta',
        'Modern riverside ballpark'
      ],
      uniqueFeatures: [
        'Savannah River views',
        'Riverside entertainment district',
        'Natural grass field',
        'Augusta skyline backdrop',
        'Greeneway walking paths'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 110-116', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level'],
      shadeTips: [
        'South Carolina summers very hot',
        'River breeze provides some relief',
        'Third base side preferred',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper areas'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 70, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 78, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Shade recommended' },
        { month: 'July', avgTemp: 89, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot', shadeTip: 'Evening games ideal' },
        { month: 'August', avgTemp: 88, avgHumidity: 73, rainChance: 40, typicalConditions: 'Peak heat', shadeTip: 'Shade essential' },
        { month: 'September', avgTemp: 81, avgHumidity: 70, rainChance: 30, typicalConditions: 'Still warm', shadeTip: 'More bearable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Dugout Club',
            perks: ['Field level premium', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Outfield reserved', 'Upper corners'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['SRP Pavilion', 'Concourse areas'],
      partyAreas: [
        {
          name: 'SRP Pavilion',
          capacity: '200',
          description: 'Left field party area',
          amenities: ['Bar', 'Tables', 'River views']
        }
      ],
      tips: [
        { section: 'Dugout Club', tip: 'All-inclusive premium experience', category: 'experience' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Lawn', tip: 'Great value for families', category: 'value' },
        { section: 'Pavilion', tip: 'Social atmosphere with views', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Pimento cheese burger', 'Augusta peach cobbler', 'River Dogs'],
      local: ['Southern BBQ', 'Pimento cheese', 'Peach desserts', 'Sweet tea'],
      healthy: ['Grilled options', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Limited options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['SweetWater', 'Local craft beers', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Riverwatch Brewery', 'Savannah River Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Riverside Lot', distance: '300 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited availability',
        tip: 'Arrive early on weekends'
      },
      alternativeTransport: {
        publicTransit: ['Limited bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Greeneway trail access'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch'
      },
      {
        name: 'River Gate',
        location: 'Left field',
        bestFor: ['Pavilion', 'Lawn'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'GreenJackets Team Store', exclusive: ['GreenJackets gear', 'Braves items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true, network: 'SRP_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Games'] }
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
      parkingSpaces: '20 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'River Views', description: 'Enjoy Savannah River scenery', category: 'experience' },
        { title: 'Riverside District', description: 'Explore before/after game', category: 'experience' },
        { title: 'Southern Heat', description: 'Evening games more comfortable', category: 'weather' },
        { title: 'Braves Pipeline', description: 'See future Braves talent', category: 'experience' }
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
      name: 'North Augusta Riverside',
      description: 'Riverside entertainment district with restaurants and shops',
      beforeGame: ['Riverside restaurants', 'Greeneway walk', 'Downtown Augusta'],
      afterGame: ['Riverside bars', 'Entertainment district'],
      radius: '0.5 miles'
    },

    transportation: {
      address: '187 Railroad Ave, North Augusta, SC 29841',
      publicTransit: {
        bus: [
          { routes: ['Limited service'], stops: ['Downtown connections'] }
        ]
      },
      driving: {
        majorRoutes: ['I-20', 'US-1', 'US-25'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-20 to North Augusta exits'
      },
      rideShare: {
        pickupZone: 'Riverside area',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2018, event: 'SRP Park opens' },
        { year: 2018, event: 'Move from Lake Olmstead Stadium' },
        { year: 2018, event: 'Riverside district development begins' }
      ],
      traditions: [
        { name: 'Masters Week', description: 'Special events during Masters Tournament' },
        { name: 'River Celebrations', description: 'Savannah River themed promotions' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern riverside ballpark with Southern charm',
      bestExperiences: [
        'Savannah River views',
        'Modern amenities in new park',
        'Riverside entertainment district',
        'Braves organizational connection'
      ],
      traditions: [
        'GreenJackets entertainment',
        'Masters Week celebrations',
        'River fireworks'
      ],
      mascot: {
        name: 'Auggie',
        description: 'GreenJacket-wearing mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Explore riverside district before games',
        'River views best from left field',
        'Masters Week brings special events',
        'Evening games avoid heat'
      ],
      avoidThese: [
        'Afternoon games in summer',
        'Limited parking on busy nights',
        'First base side in afternoon sun'
      ],
      hiddenGems: [
        'Greeneway trail along river',
        'Riverside development growing',
        'Augusta downtown nearby',
        'Masters golf connection'
      ],
      photoSpots: [
        'Savannah River backdrop',
        'With Auggie mascot',
        'Riverside district views',
        'Modern ballpark entrance'
      ],
      bestValue: [
        'Lawn seating for families',
        'Weeknight games',
        'Riverside dining combo',
        'Group packages'
      ]
    }
  },

  'charleston-riverdogs': {
    id: 'charleston-riverdogs',
    name: 'Joseph P. Riley Jr. Park',
    team: 'Charleston RiverDogs',
    opened: 1997,
    capacity: 6000,

    overview: {
      description: 'Joseph P. Riley Jr. Park, known as "The Joe," serves as home to the Rays Single-A affiliate in historic Charleston, featuring Lowcountry charm and coastal atmosphere.',
      highlights: [
        'Rays Single-A affiliate',
        'Historic Charleston location',
        'Coastal setting',
        'Bill Murray co-owner',
        'Southern hospitality'
      ],
      uniqueFeatures: [
        'Ashley River proximity',
        'Lowcountry architecture',
        'Natural grass field',
        'Charleston skyline views',
        'Bill Murray connections'
      ],
      renovations: [
        { year: 2011, description: 'Facility improvements' },
        { year: 2016, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse renovations' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite areas', 'Premium sections'],
      shadeTips: [
        'Charleston summers hot and humid',
        'Coastal breeze helps slightly',
        'Third base side preferred',
        'Evening games essential in summer'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper areas'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 72, avgHumidity: 68, rainChance: 25, typicalConditions: 'Pleasant coastal', shadeTip: 'Comfortable most areas' },
        { month: 'May', avgTemp: 79, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warming up', shadeTip: 'Shade becoming valuable' },
        { month: 'June', avgTemp: 85, avgHumidity: 73, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'July', avgTemp: 88, avgHumidity: 75, rainChance: 45, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 87, avgHumidity: 76, rainChance: 45, typicalConditions: 'Peak heat and humidity', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 82, avgHumidity: 73, rainChance: 40, typicalConditions: 'Still hot', shadeTip: 'Shade important' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Piazza Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Premium views'],
            access: 'Behind home plate upper level'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Left field group area', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', 'Bleachers', 'Standing room'],
      familySections: ['Family sections', 'Alcohol-free zones'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '150',
          description: 'Group party area',
          amenities: ['Bar service', 'Tables', 'Social atmosphere']
        }
      ],
      tips: [
        { section: 'Piazza Club', tip: 'A/C relief from humidity', category: 'experience' },
        { section: 'Third base side', tip: 'Better shade angles', category: 'shade' },
        { section: 'Party Deck', tip: 'Fun group atmosphere', category: 'experience' },
        { section: 'Behind home plate', tip: 'Best overall views', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Homewrecker Hot Dog', 'Lowcountry boil', 'She-crab soup', 'Pulled pork nachos'],
      local: ['Charleston seafood', 'Southern BBQ', 'Sweet tea', 'Boiled peanuts'],
      healthy: ['Grilled fish', 'Salads', 'Fresh options'],
      vegetarian: ['Veggie options', 'Pizza', 'Salads'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Palmetto', 'Holy City', 'Charleston craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Holy City Brewing', 'Palmetto Brewing', 'Coast Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '400 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots only'
      },
      alternativeTransport: {
        publicTransit: ['CARTA bus service'],
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
        tip: 'Main entrance with team store'
      },
      {
        name: 'Left Field Gate',
        location: 'Third base side',
        bestFor: ['Party deck', 'Left field'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'RiverDogs Team Store', exclusive: ['RiverDogs gear', 'Bill Murray items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true, network: 'RiverDogs_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Inflatables'] }
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
      parkingSpaces: '25 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Bill Murray Night', description: 'Special appearances possible', category: 'experience' },
        { title: 'Lowcountry Food', description: 'Try local specialties', category: 'food' },
        { title: 'Coastal Heat', description: 'Evening games essential', category: 'weather' },
        { title: 'Historic Charleston', description: 'Explore before/after', category: 'experience' }
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
      name: 'West Ashley',
      description: 'Charleston suburb near Ashley River',
      beforeGame: ['Downtown Charleston', 'Local restaurants', 'Historic sites'],
      afterGame: ['Downtown bars', 'King Street nightlife'],
      radius: '10 miles'
    },

    transportation: {
      address: '360 Fishburne St, Charleston, SC 29403',
      publicTransit: {
        bus: [
          { routes: ['CARTA routes'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-26', 'US-17', 'Highway 61'],
        typicalTraffic: 'Moderate, heavy downtown',
        bestApproach: 'I-26 to Cosgrove Avenue'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on weekends'
      }
    },

    history: {
      timeline: [
        { year: 1997, event: 'Joseph P. Riley Jr. Park opens' },
        { year: 1997, event: 'Move from College Park' },
        { year: 1996, event: 'Bill Murray becomes co-owner' }
      ],
      traditions: [
        { name: 'Bill Murray Connection', description: 'Celebrity owner involvement' },
        { name: 'Charleston Heritage', description: 'Lowcountry baseball tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Lowcountry charm with quirky entertainment',
      bestExperiences: [
        'Bill Murray appearances',
        'Charleston hospitality',
        'Lowcountry cuisine',
        'Creative promotions'
      ],
      traditions: [
        'Dog-themed promotions',
        'Bill Murray tributes',
        'Charleston celebrations'
      ],
      mascot: {
        name: 'Charlie T. RiverDog',
        description: 'Dog mascot with Charleston personality'
      }
    },

    proTips: {
      insiderTips: [
        'Bill Murray occasionally appears',
        'Try Homewrecker Hot Dog challenge',
        'Explore historic Charleston before/after',
        'Evening games avoid brutal humidity'
      ],
      avoidThese: [
        'Day games in summer',
        'First base side in afternoon',
        'Underestimating Charleston humidity'
      ],
      hiddenGems: [
        'Bill Murray director\'s suite',
        'Charleston food specialties',
        'Historic city proximity',
        'Lowcountry atmosphere'
      ],
      photoSpots: [
        'With Charlie T. RiverDog',
        'Bill Murray displays',
        'Charleston skyline views',
        'Lowcountry entrance'
      ],
      bestValue: [
        'General admission flexibility',
        'Thursday promotions',
        'Group packages',
        'Weeknight games'
      ]
    }
  },

  'columbia-fireflies': {
    id: 'columbia-fireflies',
    name: 'Segra Park',
    team: 'Columbia Fireflies',
    opened: 2016,
    capacity: 9077,

    overview: {
      description: 'Segra Park is a modern facility in Columbia serving as home to the Royals Single-A affiliate, featuring state-of-the-art amenities and the largest capacity in Single-A baseball.',
      highlights: [
        'Royals Single-A affiliate',
        'Opened in 2016',
        'Largest Single-A capacity',
        'Columbia, SC capital city',
        'Modern amenities'
      ],
      uniqueFeatures: [
        '360-degree concourse',
        'Fireflies light shows',
        'Natural grass field',
        'Columbia skyline views',
        'State-of-the-art facility'
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
        'South Carolina summers brutal',
        'Modern design provides good shade options',
        'Third base side preferred',
        'Evening games much better'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 71, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 79, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warming up', shadeTip: 'Shade helpful' },
        { month: 'June', avgTemp: 86, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 90, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 89, avgHumidity: 73, rainChance: 40, typicalConditions: 'Peak heat', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 82, avgHumidity: 70, rainChance: 30, typicalConditions: 'Still warm', shadeTip: 'More comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Lexington Medical Center Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private entrance'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 1500 },
          { name: 'Budweiser Bow Tie Bar', description: 'Premium bar area', capacity: 100 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Bar areas'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '250',
          description: 'Left field group area',
          amenities: ['Covered area', 'Buffet options', 'Private space']
        }
      ],
      tips: [
        { section: 'Club level', tip: 'All-inclusive with A/C', category: 'experience' },
        { section: '360 concourse', tip: 'Walk around for views', category: 'experience' },
        { section: 'Third base upper', tip: 'Best shade value', category: 'shade' },
        { section: 'Lawn', tip: 'Great for families', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Fireflies Burger', 'Carolina Gold BBQ', 'Pimento cheese fries'],
      local: ['South Carolina BBQ', 'Pimento cheese', 'Boiled peanuts', 'Sweet tea'],
      healthy: ['Grilled options', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['River Rat', 'Conquest', 'South Carolina craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['River Rat Brewery', 'Conquest Brewing', 'Steel Hands']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lots', distance: '300-500 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking available',
        tip: 'Use stadium lots only'
      },
      alternativeTransport: {
        publicTransit: ['COMET bus service'],
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
        tip: 'Main entrance with team store'
      },
      {
        name: 'Left Field Gate',
        location: 'Outfield entrance',
        bestFor: ['Lawn', 'Pavilion'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Fireflies Team Store', exclusive: ['Fireflies gear', 'Royals items'] }
      ],
      firstAid: ['Behind home plate', 'Left field'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Multiple locations'],
      wifi: { available: true, network: 'Segra_WiFi' },
      chargingStations: ['Club areas', 'Concourse'],
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Bounce house', 'Games'] }
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
        { title: 'Modern Amenities', description: 'Newest park in Single-A', category: 'experience' },
        { title: 'Capital City', description: 'Government worker crowds', category: 'experience' },
        { title: 'USC Connection', description: 'Gamecock fans prevalent', category: 'experience' },
        { title: 'Summer Heat', description: 'Evening games essential', category: 'weather' }
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
      name: 'BullStreet District',
      description: 'Redeveloped area on former state hospital grounds',
      beforeGame: ['BullStreet development', 'Downtown Columbia', 'USC campus'],
      afterGame: ['Vista nightlife', 'Main Street restaurants'],
      radius: '5 miles'
    },

    transportation: {
      address: '1640 Freed St, Columbia, SC 29201',
      publicTransit: {
        bus: [
          { routes: ['COMET routes'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-26', 'I-77', 'I-20'],
        typicalTraffic: 'Moderate, heavy during USC games',
        bestApproach: 'I-126 to Huger Street'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2016, event: 'Segra Park opens' },
        { year: 2016, event: 'Move from Capital City Stadium' },
        { year: 2016, event: 'Fireflies inaugural season' }
      ],
      traditions: [
        { name: 'Fireflies Light Shows', description: 'LED light displays' },
        { name: 'Capital City Baseball', description: 'Columbia baseball tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern facility with Southern hospitality',
      bestExperiences: [
        'State-of-the-art amenities',
        '360-degree concourse',
        'Fireflies light shows',
        'Large capacity atmosphere'
      ],
      traditions: [
        'Fireflies light shows',
        'Mason Jar Mondays',
        'Thirsty Thursday'
      ],
      mascot: {
        name: 'Mason',
        description: 'Firefly in a mason jar mascot'
      }
    },

    proTips: {
      insiderTips: [
        '360 concourse allows full park views',
        'Club level worth it for heat relief',
        'Modern amenities throughout',
        'USC nights draw bigger crowds'
      ],
      avoidThese: [
        'Day games in summer heat',
        'Parking challenges on big nights',
        'First base side in afternoon'
      ],
      hiddenGems: [
        'BullStreet development growing',
        'Best amenities in Single-A',
        'Capital city location benefits',
        'USC campus proximity'
      ],
      photoSpots: [
        'With Mason mascot',
        'Modern entrance plaza',
        '360 concourse views',
        'Fireflies light displays'
      ],
      bestValue: [
        'Lawn seating for families',
        'Mason Jar Monday deals',
        'Upper reserved seats',
        'Group packages'
      ]
    }
  }
};