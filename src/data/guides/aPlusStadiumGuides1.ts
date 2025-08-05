import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides1: Record<string, StadiumGuide> = {
  'aberdeen-ironbirds': {
    id: 'aberdeen-ironbirds',
    name: 'Leidos Field at Ripken Stadium',
    team: 'Aberdeen IronBirds',
    opened: 2002,
    capacity: 6000,

    overview: {
      description: 'Leidos Field at Ripken Stadium is a state-of-the-art facility in Aberdeen, Maryland, built to replicate the classic feel of Camden Yards while serving as the home of the Orioles High-A affiliate.',
      highlights: [
        'Orioles High-A affiliate',
        'Replica of Camden Yards design',
        'Cal Ripken Jr. ownership connection',
        'Youth tournament complex',
        'Maryland baseball heritage'
      ],
      uniqueFeatures: [
        'Mini Camden Yards warehouse replica',
        'Ripken Academy adjacent',
        'Youth fields complex',
        'Natural grass field',
        'Aberdeen Proving Ground proximity'
      ],
      renovations: [
        { year: 2012, description: 'LED lighting installation' },
        { year: 2018, description: 'Clubhouse renovations' },
        { year: 2021, description: 'Concourse improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['200 level behind home plate', 'Suite level'],
        afternoon: ['Third base side 205-210', 'Covered seating'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['200 level sections', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Maryland summers are hot and humid',
        'Upper level provides best shade',
        'Third base side gets afternoon shade first',
        'Replica warehouse provides some shade'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Suite level', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['Field level first base side', 'Outfield sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool spring weather', shadeTip: 'Light layers recommended' },
        { month: 'May', avgTemp: 70, avgHumidity: 68, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable in most areas' },
        { month: 'June', avgTemp: 79, avgHumidity: 70, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Shade becomes valuable' },
        { month: 'July', avgTemp: 84, avgHumidity: 72, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck recommended' },
        { month: 'August', avgTemp: 82, avgHumidity: 73, rainChance: 38, typicalConditions: 'Hot with afternoon storms', shadeTip: 'Covered seating ideal' },
        { month: 'September', avgTemp: 75, avgHumidity: 70, rainChance: 32, typicalConditions: 'Warm but improving', shadeTip: 'Evening games comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Ripken Club',
            perks: ['Climate controlled', 'Premium food service', 'Full bar', 'Exclusive entrance'],
            access: 'Behind home plate with Camden Yards-style amenities'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area beyond outfield', capacity: 100 }
        ]
      },
      budgetOptions: ['General admission', 'Outfield reserved', 'Lawn seating'],
      familySections: ['Family sections near kids zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Party Deck',
          capacity: '100',
          description: 'Outfield group area',
          amenities: ['Picnic tables', 'Group menus', 'Private bar']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of action and warehouse replica', category: 'view' },
        { section: '200 level', tip: 'Great views with shade protection', category: 'shade' },
        { section: 'Party Deck', tip: 'Fun group atmosphere', category: 'experience' },
        { section: 'Lawn', tip: 'Budget-friendly family option', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Crab mac and cheese', 'Maryland crab cakes', 'Old Bay fries', 'Pit beef sandwich'],
      local: ['Maryland crab items', 'Old Bay everything', 'Natty Boh beer', 'Berger cookies'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at main stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['National Bohemian', 'Flying Dog', 'Heavy Seas', 'Local craft beers'],
        wine: true,
        cocktails: false,
        localBreweries: ['Flying Dog', 'Heavy Seas', 'Union Craft']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '300 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'VIP Parking', distance: '50 yards', price: '$10', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking available',
        tip: 'Use stadium lots only'
      },
      alternativeTransport: {
        publicTransit: ['Limited bus service from Aberdeen'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating areas'],
        openTime: '60 minutes before first pitch',
        tip: 'Main entrance with team store'
      },
      {
        name: 'Outfield Gate',
        location: 'Right field',
        bestFor: ['Party deck', 'Lawn seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'IronBirds Team Store', exclusive: ['IronBirds gear', 'Orioles items', 'Ripken memorabilia'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['All restroom facilities'],
      atms: ['Main concourse', 'Near gates'],
      wifi: { available: true, network: 'IronBirds_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field area', activities: ['Playground', 'Speed pitch', 'Bounce house'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates wheelchair accessible',
        elevators: ['To upper levels and suites']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All major stands'],
      parkingSpaces: '20 spaces near main gate'
    },

    gameDay: {
      tips: [
        { title: 'Maryland Crab', description: 'Try the crab mac and cheese specialty', category: 'food' },
        { title: 'Ripken Legacy', description: 'Explore Ripken museum and displays', category: 'experience' },
        { title: 'Youth Tournaments', description: 'Complex hosts youth events regularly', category: 'experience' },
        { title: 'Camden Yards Feel', description: 'Enjoy the mini Camden Yards atmosphere', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        battingPractice: '45 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Aberdeen',
      description: 'Harford County Maryland, near Aberdeen Proving Ground',
      beforeGame: ['Ripken Museum', 'Local restaurants', 'Downtown Aberdeen'],
      afterGame: ['Local dining', 'Harford County entertainment'],
      radius: '5 miles'
    },

    transportation: {
      address: '873 Long Dr, Aberdeen, MD 21001',
      publicTransit: {
        bus: [
          { routes: ['Harford Transit Link'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-95', 'MD Route 22', 'US Route 40'],
        typicalTraffic: 'Light except rush hours',
        bestApproach: 'I-95 to MD-22 exit'
      },
      rideShare: {
        pickupZone: 'Main parking lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal in small market'
      }
    },

    history: {
      timeline: [
        { year: 2002, event: 'Ripken Stadium opens' },
        { year: 2002, event: 'Aberdeen IronBirds inaugural season' },
        { year: 2021, event: 'Became Orioles High-A affiliate' }
      ],
      notableGames: [
        { date: '2002-06-18', description: 'First game in stadium history' }
      ],
      traditions: [
        { name: 'Ripken Legacy', description: 'Celebrating Cal Ripken Jr. heritage' },
        { name: 'Maryland Pride', description: 'Celebrating state baseball tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly with strong Orioles and Ripken connections',
      bestExperiences: [
        'Mini Camden Yards atmosphere',
        'Maryland crab specialties',
        'Youth baseball complex',
        'Ripken legacy displays'
      ],
      traditions: [
        'Maryland flag celebrations',
        'Orioles organizational pride',
        'Youth team recognition'
      ],
      mascot: {
        name: 'Ferrous', 
        description: 'IronBird mascot representing team name'
      }
    },

    proTips: {
      insiderTips: [
        'Try the crab mac and cheese - local favorite',
        'Visit Ripken Museum before games',
        'Upper deck offers best shade and value',
        'Youth tournaments bring energy to complex'
      ],
      avoidThese: [
        'Don\'t skip the Maryland crab items',
        'Avoid field level in afternoon sun',
        'Limited public transit options'
      ],
      hiddenGems: [
        'Ripken Academy facilities tour',
        'Mini warehouse like Camden Yards',
        'Local craft beer selection',
        'Youth fields complex'
      ],
      photoSpots: [
        'With warehouse replica backdrop',
        'Ferrous mascot interactions',
        'Ripken statue area',
        'Youth complex overview'
      ],
      bestValue: [
        'Lawn seating for families',
        'Upper deck for shade and views',
        'Group packages with Maryland menu',
        'Youth team discounts'
      ]
    }
  },

  'asheville-tourists': {
    id: 'asheville-tourists',
    name: 'McCormick Field',
    team: 'Asheville Tourists',
    opened: 1924,
    capacity: 4000,

    overview: {
      description: 'McCormick Field is one of the oldest ballparks in Minor League Baseball, nestled in the Blue Ridge Mountains with a rich history including visits from Babe Ruth and Jackie Robinson.',
      highlights: [
        'Historic ballpark since 1924',
        'Astros High-A affiliate',
        'Blue Ridge Mountain setting',
        'Rich baseball history',
        'Classic architecture preserved'
      ],
      uniqueFeatures: [
        'Mountain views beyond outfield',
        'Historic façade maintained',
        'Babe Ruth and Jackie Robinson played here',
        'Natural grass field',
        'Classic ballpark charm'
      ],
      renovations: [
        { year: 1992, description: 'Major renovation and restoration' },
        { year: 2015, description: 'Concourse and amenity improvements' },
        { year: 2019, description: 'LED lighting installation' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Covered grandstand behind home plate'],
        afternoon: ['Third base side sections', 'Covered areas'],
        evening: ['Most sections after 5 PM due to mountain shadows']
      },
      coveredSeating: ['Grandstand roof sections', 'Premium areas'],
      shadeTips: [
        'Mountain elevation provides cooler temperatures',
        'Covered grandstand essential for rain protection',
        'Third base side gets mountain shadows first',
        'Evening games very comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Under grandstand'],
        indoorAreas: ['Team store', 'Concession areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Bleacher sections', 'First base side afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool mountain spring', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 66, avgHumidity: 68, rainChance: 40, typicalConditions: 'Pleasant with rain chances', shadeTip: 'Covered seating valuable' },
        { month: 'June', avgTemp: 74, avgHumidity: 70, rainChance: 45, typicalConditions: 'Warm with afternoon storms', shadeTip: 'Shade and cover important' },
        { month: 'July', avgTemp: 77, avgHumidity: 72, rainChance: 50, typicalConditions: 'Warm and humid', shadeTip: 'Covered grandstand ideal' },
        { month: 'August', avgTemp: 76, avgHumidity: 73, rainChance: 45, typicalConditions: 'Warm with storms', shadeTip: 'Protection from sun and rain' },
        { month: 'September', avgTemp: 70, avgHumidity: 70, rainChance: 35, typicalConditions: 'Beautiful fall weather', shadeTip: 'Perfect baseball weather' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Limited premium seating'],
          amenities: ['Enhanced concessions', 'Better views']
        }
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Concourse areas'],
      tips: [
        { section: 'Covered grandstand', tip: 'Best protection from elements', category: 'shade' },
        { section: 'Behind home plate', tip: 'Classic ballpark views', category: 'view' },
        { section: 'Third base side', tip: 'Mountain views and shade', category: 'view' },
        { section: 'Bleachers', tip: 'Budget option with character', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Mountain burger', 'Local BBQ', 'Appalachian specialties'],
      local: ['North Carolina BBQ', 'Local craft beers', 'Mountain treats'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie options available'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Ice cream'],
      alcohol: {
        beer: ['Highland Brewing', 'Green Man', 'Pisgah', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Highland', 'Green Man', 'Pisgah', 'Wicked Weed']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Street Parking', distance: 'Variable', price: 'Free-$2', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited near stadium',
        tip: 'Arrive early for street parking'
      },
      alternativeTransport: {
        publicTransit: ['Asheville Rides Transit'],
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
        tip: 'Historic entrance'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Tourists Team Store', exclusive: ['Tourists gear', 'Historic ballpark items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Available in restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Area', location: 'Beyond outfield', activities: ['Play area'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas available'],
        entrance: 'Main gate accessible',
        elevators: ['Limited due to historic nature']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: 'Available near entrance'
    },

    gameDay: {
      tips: [
        { title: 'Mountain Weather', description: 'Weather can change quickly', category: 'weather' },
        { title: 'Historic Charm', description: 'Enjoy the classic ballpark atmosphere', category: 'experience' },
        { title: 'Local Brews', description: 'Try Asheville craft beer selection', category: 'food' },
        { title: 'Early Arrival', description: 'Limited parking fills quickly', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['Game time arrival']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Asheville',
      description: 'Mountain city known for arts, culture, and outdoor activities',
      beforeGame: ['Downtown Asheville', 'Brewery tours', 'Mountain views'],
      afterGame: ['Downtown entertainment', 'Local restaurants'],
      radius: '5 miles'
    },

    transportation: {
      address: '30 Buchanan Pl, Asheville, NC 28801',
      publicTransit: {
        bus: [
          { routes: ['ART routes'], stops: ['McCormick Field area'] }
        ]
      },
      driving: {
        majorRoutes: ['I-26', 'I-40', 'US-70'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-240 to Charlotte Street'
      },
      rideShare: {
        pickupZone: 'Stadium area',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate during events'
      }
    },

    history: {
      timeline: [
        { year: 1924, event: 'McCormick Field opens' },
        { year: 1925, event: 'Babe Ruth exhibition game' },
        { year: 1948, event: 'Jackie Robinson played here' },
        { year: 1992, event: 'Major renovation completed' }
      ],
      notableGames: [
        { date: '1925-04-09', description: 'Babe Ruth exhibition' },
        { date: '1948-04-09', description: 'Jackie Robinson appearance' }
      ],
      traditions: [
        { name: 'Historic Baseball', description: 'Celebrating baseball legends who played here' },
        { name: 'Mountain Baseball', description: 'Blue Ridge Mountain tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Historic charm in beautiful mountain setting',
      bestExperiences: [
        'Classic ballpark atmosphere',
        'Mountain views',
        'Historic significance',
        'Local craft beer selection'
      ],
      traditions: [
        'Historic ballpark tours',
        'Mountain heritage nights',
        'Local brewery partnerships'
      ],
      mascot: {
        name: 'Ted E. Tourist',
        description: 'Bear mascot representing mountain region'
      }
    },

    proTips: {
      insiderTips: [
        'Covered grandstand essential for weather',
        'Try local craft beers - excellent selection',
        'Explore historic displays and photos',
        'Evening games offer best mountain views'
      ],
      avoidThese: [
        'Don\'t forget layers - mountain weather changes',
        'Avoid bleachers during rain',
        'Parking is very limited'
      ],
      hiddenGems: [
        'Historic photos throughout stadium',
        'Mountain sunset views',
        'Babe Ruth and Jackie Robinson history',
        'Local Asheville culture'
      ],
      photoSpots: [
        'Mountain backdrop from stands',
        'Historic façade entrance',
        'With Ted E. Tourist',
        'Classic grandstand architecture'
      ],
      bestValue: [
        'General admission tickets',
        'Bleacher seats for budget option',
        'Group packages available',
        'Evening games for comfort'
      ]
    }
  },

  'beloit-sky-carp': {
    id: 'beloit-sky-carp',
    name: 'ABC Supply Stadium',
    team: 'Beloit Sky Carp',
    opened: 2021,
    capacity: 3850,

    overview: {
      description: 'ABC Supply Stadium is one of the newest ballparks in Minor League Baseball, featuring state-of-the-art amenities along the Rock River in downtown Beloit, Wisconsin.',
      highlights: [
        'Brand new stadium opened 2021',
        'Marlins High-A affiliate',
        'Rock River waterfront location',
        'Modern amenities throughout',
        'Downtown Beloit revitalization anchor'
      ],
      uniqueFeatures: [
        'Rock River views from concourse',
        'Modern architectural design',
        'Climate-controlled club spaces',
        'Synthetic turf field',
        'Unique Sky Carp branding'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 205-210', 'Suites'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'New stadium design includes shade considerations',
        'Wisconsin summers can be hot and humid',
        'River breeze provides cooling',
        'Modern concourse offers shade relief'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse'],
        indoorAreas: ['Club spaces', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Field level first base side', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool and variable', shadeTip: 'Dress warmly' },
        { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'June', avgTemp: 73, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm and pleasant', shadeTip: 'Shade becoming helpful' },
        { month: 'July', avgTemp: 77, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Club level recommended' },
        { month: 'August', avgTemp: 75, avgHumidity: 72, rainChance: 35, typicalConditions: 'Warm with storms', shadeTip: 'Covered areas valuable' },
        { month: 'September', avgTemp: 68, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling fall weather', shadeTip: 'Perfect baseball weather' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Geiger Club',
            perks: ['Climate controlled', 'All-inclusive food/beverage', 'Private entrance', 'River views'],
            access: 'Premium level with full amenities'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'Private balcony']
        },
        specialAreas: [
          { name: 'Lawn', description: 'Outfield grass seating area', capacity: 500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved', 'Standing room'],
      familySections: ['Family sections available', 'Kids zone nearby'],
      standingRoom: ['Concourse areas', 'Drink rails'],
      partyAreas: [
        {
          name: 'River Deck',
          capacity: '100',
          description: 'Group area with river views',
          amenities: ['Private bar', 'Standing tables', 'River views']
        }
      ],
      tips: [
        { section: 'Geiger Club', tip: 'Ultimate comfort with all-inclusive service', category: 'experience' },
        { section: 'Behind home plate', tip: 'Best views in new stadium', category: 'view' },
        { section: 'River Deck', tip: 'Great for groups with scenic views', category: 'experience' },
        { section: 'Lawn', tip: 'Family-friendly budget option', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Sky Carp Sandwich', 'Wisconsin cheese curds', 'Brats', 'Local specialties'],
      local: ['Wisconsin cheese', 'Bratwurst', 'Cheese curds', 'Local beers'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh options'],
      vegetarian: ['Beyond brats', 'Veggie options'],
      glutenFree: ['Available at main stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Wisconsin craft beers', 'Miller products', 'Local selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Ale Asylum', 'New Glarus', 'Potosi']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown Lots', distance: '0.2 miles', price: '$3-5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered downtown',
        tip: 'Free after 5 PM on streets'
      },
      alternativeTransport: {
        publicTransit: ['Beloit Transit System'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks and paths available'
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
        name: 'River Gate',
        location: 'Third base side',
        bestFor: ['Club level', 'River deck'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Sky Carp Team Store', exclusive: ['Sky Carp gear', 'Marlins items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Available'],
      atms: ['Throughout concourse'],
      wifi: { available: true, network: 'SkyCarp_WiFi', freeZones: ['Entire stadium'] },
      chargingStations: ['Club level', 'Concourse areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Left field', activities: ['Playground', 'Interactive games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout facility'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '30+ ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Wisconsin Cheese', description: 'Must try the cheese curds', category: 'food' },
        { title: 'River Views', description: 'Check out river from concourse', category: 'experience' },
        { title: 'New Stadium', description: 'Explore all the modern amenities', category: 'experience' },
        { title: 'Downtown Location', description: 'Walk to restaurants and bars', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        battingPractice: 'Limited for High-A',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },

    neighborhood: {
      name: 'Downtown Beloit',
      description: 'Revitalized riverfront district with dining and entertainment',
      beforeGame: ['Downtown restaurants', 'Riverwalk', 'Local breweries'],
      afterGame: ['Downtown bars', 'River activities'],
      radius: '0.5 miles'
    },

    transportation: {
      address: '217 Shirland Ave, Beloit, WI 53511',
      publicTransit: {
        bus: [
          { routes: ['Beloit Transit'], stops: ['Downtown routes'] }
        ]
      },
      driving: {
        majorRoutes: ['I-90', 'I-43', 'US-51'],
        typicalTraffic: 'Light',
        bestApproach: 'I-90 to WI-81'
      },
      rideShare: {
        pickupZone: 'Stadium entrance',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2021, event: 'ABC Supply Stadium opens' },
        { year: 2021, event: 'Sky Carp inaugural season' },
        { year: 2021, event: 'Team relocates from Clinton, Iowa' }
      ],
      traditions: [
        { name: 'Sky Carp Identity', description: 'Unique team branding and mascot' },
        { name: 'Wisconsin Baseball', description: 'Bringing baseball back to Beloit' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern stadium experience with small-town charm',
      bestExperiences: [
        'State-of-the-art facilities',
        'Rock River views',
        'Wisconsin hospitality',
        'Downtown integration'
      ],
      traditions: [
        'Sky Carp splash',
        'Wisconsin heritage nights',
        'River celebrations'
      ],
      mascot: {
        name: 'Splash', 
        description: 'Sky Carp mascot with unique design'
      }
    },

    proTips: {
      insiderTips: [
        'Geiger Club worth it for all-inclusive experience',
        'Try Wisconsin cheese curds - stadium specialty',
        'Explore downtown Beloit before games',
        'River deck great for groups'
      ],
      avoidThese: [
        'Don\'t miss the new stadium amenities',
        'Parking downtown can fill up quickly',
        'Weather can be variable in spring/fall'
      ],
      hiddenGems: [
        'River views from upper concourse',
        'Modern club spaces',
        'Downtown Beloit renaissance',
        'State-of-the-art technology throughout'
      ],
      photoSpots: [
        'Rock River backdrop',
        'With Splash mascot',
        'Modern stadium architecture',
        'Downtown Beloit skyline'
      ],
      bestValue: [
        'Lawn seating for families',
        'Upper reserved seats',
        'Group packages with food',
        'Downtown dining combo deals'
      ]
    }
  }
};