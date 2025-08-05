import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides3: Record<string, StadiumGuide> = {
  'binghamton-rumble-ponies': {
    id: 'binghamton-rumble-ponies',
    name: 'Mirabito Stadium',
    team: 'Binghamton Rumble Ponies',
    opened: 1992,
    capacity: 6012,

    overview: {
      description: 'Mirabito Stadium sits in upstate New York\'s Triple Cities region, offering a classic ballpark experience with views of the surrounding hills and modern amenities for fans.',
      highlights: [
        'Mets Double-A affiliate',
        'Triple Cities location',
        'Hills and valley views',
        'Renovated facilities',
        'Rumble Ponies unique branding'
      ],
      uniqueFeatures: [
        'Carousel beyond outfield',
        'Pony Express kids area',
        'Triple Cities heritage displays',
        'Natural grass field',
        'Scenic hillside setting'
      ],
      renovations: [
        { year: 2017, description: 'Major renovations including new name and branding' },
        { year: 2019, description: 'Enhanced clubhouse facilities' },
        { year: 2021, description: 'New LED lighting system' }
      ],
      previousNames: ['NYSEG Stadium (1992-2016)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['201', '202', '203', 'Club Level'],
        afternoon: ['205', '206', '207', 'Berm'],
        evening: ['103', '104', '105', '201', '202']
      },
      coveredSeating: ['201', '202', '203', '204', '205', '206', 'Club Level'],
      shadeTips: [
        'Upper deck provides best protection',
        'Hill setting creates natural cooling',
        'Third base side gets afternoon shade',
        'Valley breezes help with comfort'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Club level', 'Team store', 'Restaurant areas'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['101', '102', '108', 'Right field berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool and variable', shadeTip: 'Dress warmly, limited sun protection needed' },
        { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable in most seating' },
        { month: 'June', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warm and pleasant', shadeTip: 'Afternoon shade becomes helpful' },
        { month: 'July', avgTemp: 76, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Upper deck recommended for day games' },
        { month: 'August', avgTemp: 74, avgHumidity: 72, rainChance: 32, typicalConditions: 'Warm with humidity', shadeTip: 'Shade important for comfort' },
        { month: 'September', avgTemp: 67, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling fall weather', shadeTip: 'Evening games very comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Climate controlled', 'Premium food service', 'Exclusive bar', 'Valley views'],
            access: 'Behind home plate with upscale amenities'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering options', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Berm Seating', description: 'Grassy area beyond outfield', capacity: 150 }
        ]
      },
      budgetOptions: ['Berm seating', '206', '207', 'General admission'],
      familySections: ['Berm', 'Family sections', '204', '205'],
      standingRoom: ['Concourse areas', 'Berm'],
      partyAreas: [
        {
          name: 'Pony Express Party Area',
          capacity: '100',
          description: 'Group area with kids activities',
          amenities: ['Picnic tables', 'Kids activities', 'Group menus']
        }
      ],
      tips: [
        { section: '101-103', tip: 'Great views of action and hills', category: 'view' },
        { section: '201-203', tip: 'Perfect combination of views and shade', category: 'shade' },
        { section: 'Home Plate Club', tip: 'Ultimate comfort with valley views', category: 'experience' },
        { section: 'Berm', tip: 'Great value for families, scenic setting', category: 'value' },
        { section: '104-106', tip: 'Good angle for foul balls', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Rumble Pony Dog', 'Spiedie Sandwich', 'Salt Potatoes', 'Chicken Riggies'],
      local: ['Spiedies', 'Salt potatoes', 'New York cheese', 'Local craft beers'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at main concession stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Popcorn'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Local upstate New York craft beers'],
        wine: true,
        cocktails: false,
        localBreweries: ['Galaxy Brewing', 'Brewery Ommegang']
      }
    },

    parking: {
      lots: [
        { name: 'Main Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.2 miles', price: '$3', shadedSpots: false, covered: false },
        { name: 'VIP Parking', distance: '50 yards', price: '$10', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited residential parking nearby',
        tip: 'Free street parking available within walking distance'
      },
      alternativeTransport: {
        publicTransit: ['BC Transit bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks at main entrance'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating areas', 'Team store'],
        openTime: '90 minutes before first pitch',
        tip: 'Primary entrance with team store and club access'
      },
      {
        name: 'Outfield Gate',
        location: 'Beyond right field',
        bestFor: ['Berm seating', 'Groups'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Rumble Ponies Team Store', exclusive: ['Rumble Ponies gear', 'Mets items', 'Pony-themed merchandise'] }
      ],
      firstAid: ['Main concourse near home plate'],
      babyChanging: ['All restroom facilities'],
      atms: ['Main concourse', 'Club level'],
      wifi: { available: true, network: 'RumblePonies' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        { name: 'Pony Express Kids Zone', location: 'Beyond first base', activities: ['Carousel', 'Playground', 'Speed pitch'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['101', '102', '103', '201', '202'],
        entrance: 'All gates wheelchair accessible',
        elevators: ['Behind home plate to upper levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All major stands'],
      parkingSpaces: '20 spaces in main lot'
    },

    gameDay: {
      tips: [
        { title: 'Try Spiedies', description: 'Local upstate New York specialty', category: 'food' },
        { title: 'Arrive Early', description: 'Enjoy pre-game activities and carousel', category: 'arrival' },
        { title: 'Valley Views', description: 'Best scenic photos from upper concourse', category: 'experience' },
        { title: 'Weather Layers', description: 'Upstate weather can change quickly', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: '45 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before first pitch', '7th inning stretch']
      },
      security: {
        allowedBags: 'Small bags allowed, subject to search',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Binghamton',
      description: 'Triple Cities region of upstate New York',
      beforeGame: ['Local restaurants', 'Oakdale Mall area', 'Ross Park Zoo'],
      afterGame: ['Downtown Binghamton', 'Local entertainment'],
      radius: '5 miles'
    },

    transportation: {
      address: '89 Stanton Ave, Binghamton, NY 13905',
      publicTransit: {
        bus: [
          { routes: ['BC Transit'], stops: ['Various city routes'] }
        ]
      },
      driving: {
        majorRoutes: ['I-81', 'Route 17', 'Route 11'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-81 to Front Street exit'
      },
      rideShare: {
        pickupZone: 'Main parking lot',
        dropoffZone: 'Home plate gate',
        surgePricing: 'Minimal due to smaller market'
      }
    },

    history: {
      timeline: [
        { year: 1992, event: 'Stadium opens as NYSEG Stadium' },
        { year: 2017, event: 'Renamed Mirabito Stadium, team becomes Rumble Ponies' },
        { year: 2021, event: 'Major facility upgrades completed' }
      ],
      notableGames: [
        { date: '1992-04-14', description: 'First game in stadium history' },
        { date: '2017-04-06', description: 'First game as Rumble Ponies' }
      ],
      traditions: [
        { name: 'Pony Power', description: 'Team rally cry and fan engagement' },
        { name: 'Carousel Rides', description: 'Kids tradition between innings' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly upstate New York baseball with unique pony theme',
      bestExperiences: [
        'Carousel rides for kids',
        'Scenic valley and hill views',
        'Local spiedie sandwiches',
        'Pony-themed entertainment'
      ],
      traditions: [
        'Pony Express kids activities',
        'Spiedie eating contests',
        'Valley appreciation nights'
      ],
      mascot: {
        name: 'Rowdy',
        description: 'Pony mascot representing the Rumble Ponies brand'
      }
    },

    proTips: {
      insiderTips: [
        'Try authentic spiedies - a local specialty',
        'Carousel is free for kids on certain days',
        'Upper deck offers best valley views',
        'Evening games are most comfortable'
      ],
      avoidThese: [
        'Don\'t miss trying local spiedie sandwiches',
        'Avoid lower level day games in summer heat',
        'Don\'t skip the carousel if you have kids'
      ],
      hiddenGems: [
        'Best upstate New York craft beer selection',
        'Scenic photography opportunities from concourse',
        'Triple Cities historical displays',
        'Local art installations throughout facility'
      ],
      photoSpots: [
        'Home plate with valley backdrop',
        'Carousel with kids',
        'Rowdy mascot interactions',
        'Scenic views from upper concourse'
      ],
      bestValue: [
        'Berm seating for families',
        'Group packages with spiedie dinner',
        'Season tickets with parking included',
        'Thursday promotional nights'
      ]
    }
  },

  'bowie-baysox': {
    id: 'bowie-baysox',
    name: 'Prince George\'s Stadium',
    team: 'Bowie Baysox',
    opened: 1994,
    capacity: 10000,

    overview: {
      description: 'Prince George\'s Stadium serves as the home of the Bowie Baysox in Maryland, offering a classic ballpark experience with modern amenities and strong ties to the Baltimore Orioles organization.',
      highlights: [
        'Orioles Double-A affiliate',
        'Large capacity for Double-A',
        'Maryland location near DC',
        'Classic ballpark design',
        'Strong community ties'
      ],
      uniqueFeatures: [
        'One of largest Double-A stadiums',
        'Natural grass field',
        'Picnic pavilions',
        'Kids play area',
        'Maryland heritage displays'
      ],
      renovations: [
        { year: 2008, description: 'Major concourse and seating improvements' },
        { year: 2015, description: 'New LED lighting system' },
        { year: 2020, description: 'Enhanced safety and technology upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['301', '302', '303', 'Club Level'],
        afternoon: ['305', '306', '307', 'Pavilions'],
        evening: ['203', '204', '205', '301', '302']
      },
      coveredSeating: ['301', '302', '303', '304', '305', '306', 'Club Level'],
      shadeTips: [
        'Upper deck provides excellent shade coverage',
        'Maryland summer heat requires shade planning',
        'Third base side gets better afternoon shade',
        'Pavilion areas offer group shade options'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Club level', 'Team store', 'Restaurant areas'],
        sunscreenStations: ['Guest services', 'First aid station']
      },
      worstSunExposure: ['201', '202', '208', 'Right field general admission'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 65, rainChance: 35, typicalConditions: 'Mild spring weather', shadeTip: 'Comfortable in most seating areas' },
        { month: 'May', avgTemp: 72, avgHumidity: 68, rainChance: 40, typicalConditions: 'Warm with spring storms', shadeTip: 'Afternoon shade becomes valuable' },
        { month: 'June', avgTemp: 81, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck recommended' },
        { month: 'July', avgTemp: 85, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot and humid', shadeTip: 'Covered seating essential' },
        { month: 'August', avgTemp: 83, avgHumidity: 73, rainChance: 38, typicalConditions: 'Hot with afternoon storms', shadeTip: 'Shade and cover both important' },
        { month: 'September', avgTemp: 76, avgHumidity: 70, rainChance: 32, typicalConditions: 'Warm, more pleasant', shadeTip: 'Evening games comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Diamond Club',
            perks: ['Climate controlled', 'Premium food service', 'Full bar', 'Exclusive entrance'],
            access: 'Behind home plate with upscale amenities'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering options', 'Climate control', 'Multiple HDTVs']
        },
        specialAreas: [
          { name: 'Picnic Pavilions', description: 'Group seating areas with catering', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Lawn areas', '306', '307'],
      familySections: ['Family sections', '304', '305'],
      standingRoom: ['Concourse areas', 'Pavilion areas'],
      partyAreas: [
        {
          name: 'Right Field Pavilion',
          capacity: '150',
          description: 'Group area with picnic tables and catering',
          amenities: ['Picnic tables', 'Group menus', 'Dedicated service']
        },
        {
          name: 'Left Field Pavilion',
          capacity: '100',
          description: 'Smaller group area perfect for corporate events',
          amenities: ['Tables', 'Bar service', 'Private entrance']
        }
      ],
      tips: [
        { section: '201-203', tip: 'Best views of action and scoreboard', category: 'view' },
        { section: '301-303', tip: 'Great views with excellent shade protection', category: 'shade' },
        { section: 'Diamond Club', tip: 'Premium experience with Maryland hospitality', category: 'experience' },
        { section: 'Pavilions', tip: 'Perfect for groups and families', category: 'value' },
        { section: '204-206', tip: 'Good balance of price and view quality', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Baysox Dog', 'Maryland Crab Cake', 'Old Bay Fries', 'Berger Cookies'],
      local: ['Maryland crab cakes', 'Old Bay seasoning items', 'Natty Boh beer', 'Smith Island cake'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at main concession stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['National Bohemian', 'Flying Dog', 'Heavy Seas', 'Budweiser'],
        wine: true,
        cocktails: false,
        localBreweries: ['Flying Dog Brewery', 'Heavy Seas Beer']
      }
    },

    parking: {
      lots: [
        { name: 'Main Stadium Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'North Lot', distance: '300 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'VIP Parking', distance: '100 yards', price: '$15', shadedSpots: true, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited street parking in area',
        tip: 'Stadium lots are primary parking option'
      },
      alternativeTransport: {
        publicTransit: ['MARC train to Bowie State', 'TheBus Prince George\'s County'],
        rideShare: 'Uber and Lyft readily available',
        bicycle: 'Bike racks available at main entrance'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating areas', 'Team store access'],
        openTime: '90 minutes before first pitch',
        tip: 'Primary entrance with largest team store'
      },
      {
        name: 'Left Field Gate',
        location: 'Left field area',
        bestFor: ['Pavilion areas', 'Groups'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Baysox Team Store', exclusive: ['Baysox gear', 'Orioles items', 'Maryland-themed merchandise'] }
      ],
      firstAid: ['Main concourse behind home plate'],
      babyChanging: ['All restroom facilities'],
      atms: ['Main concourse', 'Club level'],
      wifi: { available: true, network: 'BaysoxBaseball' },
      chargingStations: ['Club level', 'Main concourse areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Beyond right field', activities: ['Playground', 'Speed pitch', 'Interactive games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['201', '202', '203', '301', '302'],
        entrance: 'All gates wheelchair accessible',
        elevators: ['Behind home plate to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All major concession stands'],
      parkingSpaces: '25 spaces in main lot'
    },

    gameDay: {
      tips: [
        { title: 'Maryland Crab Cakes', description: 'Must-try local specialty at the ballpark', category: 'food' },
        { title: 'Traffic Planning', description: 'Allow extra time for DC area traffic', category: 'arrival' },
        { title: 'Summer Heat', description: 'Maryland summers are hot and humid', category: 'weather' },
        { title: 'Orioles Connection', description: 'Watch for future Orioles stars', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: '45 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before first pitch', '7th inning stretch']
      },
      security: {
        allowedBags: 'Small bags allowed, subject to search',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Bowie',
      description: 'Growing Maryland suburb between Baltimore and Washington DC',
      beforeGame: ['Local restaurants along Route 50', 'Bowie Town Center'],
      afterGame: ['Route 50 corridor dining', 'Annapolis nearby'],
      radius: '10 miles'
    },

    transportation: {
      address: '4101 Crain Hwy, Bowie, MD 20716',
      publicTransit: {
        train: [
          { lines: ['MARC Brunswick Line'], station: 'Bowie State', walkTime: '15 minutes' }
        ],
        bus: [
          { routes: ['TheBus routes'], stops: ['Crain Highway'] }
        ]
      },
      driving: {
        majorRoutes: ['US-50', 'I-95', 'I-495'],
        typicalTraffic: 'Heavy during DC rush hours',
        bestApproach: 'US-50 to Crain Highway'
      },
      rideShare: {
        pickupZone: 'Main parking lot',
        dropoffZone: 'Home plate gate',
        surgePricing: 'Moderate, higher during DC rush hour'
      }
    },

    history: {
      timeline: [
        { year: 1994, event: 'Prince George\'s Stadium opens' },
        { year: 1994, event: 'Bowie Baysox inaugural season' },
        { year: 2008, event: 'Major stadium renovations completed' },
        { year: 2015, event: 'LED lighting installation' }
      ],
      notableGames: [
        { date: '1994-04-15', description: 'First game in stadium history' },
        { date: '2019-09-02', description: 'Eastern League Championship clincher' }
      ],
      traditions: [
        { name: 'Maryland Pride', description: 'Celebrating state heritage and culture' },
        { name: 'Orioles Pipeline', description: 'Showcasing future Baltimore stars' }
      ]
    },

    fanExperience: {
      atmosphere: 'Maryland hospitality with strong connection to Orioles organization',
      bestExperiences: [
        'Maryland crab cake concessions',
        'Future Orioles prospect watching',
        'Family-friendly pavilion areas',
        'Classic Double-A baseball atmosphere'
      ],
      traditions: [
        'Maryland-themed promotional nights',
        'Orioles alumni appearances',
        'Community appreciation events'
      ],
      mascot: {
        name: 'Louie',
        description: 'Bay retriever mascot representing the Chesapeake Bay heritage'
      }
    },

    proTips: {
      insiderTips: [
        'Try the Maryland crab cake - authentic local favorite',
        'Upper deck offers best value with great views',
        'Pavilion areas perfect for group outings',
        'MARC train option avoids DC traffic'
      ],
      avoidThese: [
        'Don\'t drive during DC rush hour if possible',
        'Avoid lower level day games in July/August',
        'Don\'t miss watching future Orioles prospects'
      ],
      hiddenGems: [
        'Best Maryland craft beer selection in area',
        'Orioles organizational history displays',
        'Great group rates for pavilion areas',
        'Close proximity to both Baltimore and DC'
      ],
      photoSpots: [
        'Home plate with Maryland flag backdrop',
        'Louie mascot interactions',
        'Orioles prospect action shots',
        'Stadium exterior with classic architecture'
      ],
      bestValue: [
        'Pavilion group packages with food included',
        'Upper deck season tickets',
        'Thursday promotional nights',
        'General admission for budget-conscious fans'
      ]
    }
  }
};