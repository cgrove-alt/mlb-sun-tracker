import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides1: Record<string, StadiumGuide> = {
  'altoona-curve': {
    id: 'altoona-curve',
    name: 'Peoples Natural Gas Field',
    team: 'Altoona Curve',
    opened: 1999,
    capacity: 7210,

    overview: {
      description: 'Peoples Natural Gas Field is a scenic Double-A ballpark nestled in the Allegheny Mountains of Pennsylvania, offering breathtaking mountain views and the unique Skyliner roller coaster beyond the right field wall.',
      highlights: [
        'Allegheny Mountains backdrop',
        'Skyliner roller coaster beyond right field',
        'Rail Kings Club premium seating',
        'Family-friendly atmosphere',
        'Affordable pricing'
      ],
      uniqueFeatures: [
        'Only ballpark with amusement park roller coaster in play',
        'Mountain setting with elevation changes',
        'Rail-themed design and naming',
        'Natural grass field'
      ],
      renovations: [
        { year: 2009, description: 'Added LED lighting system' },
        { year: 2015, description: 'Renovated clubhouses and concessions' },
        { year: 2019, description: '20th anniversary improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['201', '202', '203', 'Rail Kings Club'],
        afternoon: ['205', '206', 'Rail Kings Club'],
        evening: ['103', '104', '105', '201', '202']
      },
      coveredSeating: ['201', '202', '203', '204', '205', '206', 'Rail Kings Club'],
      shadeTips: [
        'Upper deck sections provide best shade coverage',
        'Rail Kings Club offers climate-controlled environment',
        'First base side gets afternoon shade first',
        'Mountain elevation creates cooler temperatures'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Rail Kings Club', 'Gift shop', 'Restrooms'],
        sunscreenStations: ['Main gates', 'First aid station']
      },
      worstSunExposure: ['101', '102', '108', 'Lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 65, rainChance: 45, typicalConditions: 'Cool and variable', shadeTip: 'Dress in layers, limited shade needed' },
        { month: 'May', avgTemp: 68, avgHumidity: 63, rainChance: 40, typicalConditions: 'Pleasant spring weather', shadeTip: 'Afternoon games benefit from upper deck' },
        { month: 'June', avgTemp: 76, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Seek shade after 2 PM' },
        { month: 'July', avgTemp: 80, avgHumidity: 70, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck essential for day games' },
        { month: 'August', avgTemp: 78, avgHumidity: 72, rainChance: 38, typicalConditions: 'Hot with afternoon storms', shadeTip: 'Cover and shade both important' },
        { month: 'September', avgTemp: 71, avgHumidity: 69, rainChance: 32, typicalConditions: 'Comfortable fall weather', shadeTip: 'Less shade needed, enjoy the views' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Rail Kings Club',
            perks: ['Climate controlled', 'Premium food service', 'Cash bar', 'Exclusive entrance'],
            access: 'Behind home plate with premium amenities'
          }
        ],
        suites: {
          levels: ['Club level'],
          amenities: ['Private restrooms', 'Catering options', 'Climate control']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group seating with picnic tables', capacity: 100 }
        ]
      },
      budgetOptions: ['Lawn seating', '205', '206', 'General admission'],
      familySections: ['Picnic Area', 'Lawn', '204', '205'],
      standingRoom: ['Concourse areas', 'Lawn'],
      partyAreas: [
        {
          name: 'Picnic Area',
          capacity: '100',
          description: 'Right field picnic area with group pricing',
          amenities: ['Picnic tables', 'Group menu options', 'Dedicated concessions']
        }
      ],
      tips: [
        { section: '101-103', tip: 'Best views of action, no shade protection', category: 'view' },
        { section: '201-203', tip: 'Perfect combination of views and shade', category: 'shade' },
        { section: 'Rail Kings Club', tip: 'Ultimate comfort with mountain views', category: 'experience' },
        { section: 'Lawn', tip: 'Great value for families, bring blankets', category: 'value' },
        { section: '104-105', tip: 'Good angle to see Skyliner coaster', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Curve Dog', 'Mountain Burger', 'Funnel Cake Fries', 'Altoona-style Pizza'],
      local: ['Sheetz MTO', 'Pennsylvania Dutch items', 'Whoopie Pies', 'Pierogi'],
      healthy: ['Grilled chicken', 'Salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Soft pretzels'],
      glutenFree: ['Designated items at main stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Yuengling', 'Local craft beers'],
        wine: true,
        cocktails: false,
        localBreweries: ['Altoona Brewing', 'Voodoo Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '0.1 miles', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.2 miles', price: '$3', shadedSpots: false, covered: false },
        { name: 'VIP Parking', distance: '50 yards', price: '$10', shadedSpots: true, covered: false, tip: 'Reserved for season ticket holders' }
      ],
      streetParking: {
        available: true,
        restrictions: '2-hour limit on game days',
        tip: 'Free parking available on residential streets'
      },
      alternativeTransport: {
        publicTransit: ['Limited bus service from downtown Altoona'],
        rideShare: 'Available but limited in area',
        bicycle: 'Bike racks available at main entrance'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Behind home plate',
        bestFor: ['Rail Kings Club', 'Premium seating'],
        openTime: '1 hour before first pitch',
        tip: 'Main entrance with team store'
      },
      {
        name: 'First Base Gate',
        location: 'Right field line',
        bestFor: ['General admission', 'Groups'],
        openTime: '1 hour before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Team store at main entrance', exclusive: ['Curve jerseys', 'Skyliner coaster items'] }
      ],
      firstAid: ['Main concourse near home plate'],
      babyChanging: ['All restroom facilities'],
      atms: ['Main concourse', 'Near gates'],
      wifi: { available: true, network: 'CurveBaseball' },
      chargingStations: ['Rail Kings Club', 'Main concourse'],
      kidZones: [
        { name: 'Kids Zone', location: 'Behind first base', activities: ['Playground', 'Speed pitch'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['101', '102', '103', '201', '202'],
        entrance: 'Home plate gate with ramp access',
        elevators: ['Behind home plate to upper level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Main concourse', 'Upper concourse'],
      accessibleConcessions: ['Main concession stands'],
      parkingSpaces: '20 spaces in main lot'
    },

    gameDay: {
      tips: [
        { title: 'Arrive Early', description: 'Get there 30 minutes before first pitch for parking', category: 'arrival' },
        { title: 'Bring Layers', description: 'Mountain weather can change quickly', category: 'weather' },
        { title: 'Watch the Coaster', description: 'Time your photos with Skyliner riders', category: 'experience' },
        { title: 'Try Local Food', description: 'Sample Altoona-style pizza and Sheetz items', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before first pitch',
        battingPractice: '45 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before game', '7th inning stretch']
      },
      security: {
        allowedBags: 'Small bags and purses allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },

    neighborhood: {
      name: 'Altoona',
      description: 'Historic railroad town in the Allegheny Mountains',
      beforeGame: ['Railroaders Memorial Museum', 'Downtown dining', 'Horseshoe Curve'],
      afterGame: ['Local taverns', 'Skyliner amusement park'],
      radius: '5 miles'
    },

    transportation: {
      address: '1000 Park Ave, Altoona, PA 16602',
      publicTransit: {
        bus: [
          { routes: ['AMTRAN local routes'], stops: ['Downtown transfer center'] }
        ]
      },
      driving: {
        majorRoutes: ['I-99', 'US-220', 'PA-36'],
        typicalTraffic: 'Light except game days',
        bestApproach: 'I-99 to Plank Road exit'
      },
      rideShare: {
        pickupZone: 'Main parking lot',
        dropoffZone: 'Home plate gate',
        surgePricing: 'Minimal due to small market',
        alternativeTip: 'Consider designated driver due to limited service'
      }
    },

    history: {
      timeline: [
        { year: 1999, event: 'Stadium opens as Blair County Ballpark' },
        { year: 2002, event: 'Renamed to Peoples Natural Gas Field' },
        { year: 2010, event: 'Hosted Eastern League All-Star Game' },
        { year: 2019, event: 'Celebrated 20th anniversary season' }
      ],
      notableGames: [
        { date: '1999-04-15', description: 'First game in stadium history' },
        { date: '2010-07-14', description: 'Eastern League All-Star Game' }
      ],
      traditions: [
        { name: 'Skyliner Derby', description: 'Racing the roller coaster during games' },
        { name: 'Railroad Heritage', description: 'Celebrating Altoona\'s rail history' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly small-town baseball with unique mountain setting',
      bestExperiences: [
        'Watching Skyliner coaster during games',
        'Mountain sunset views',
        'Interactive kids area',
        'Affordable family entertainment'
      ],
      traditions: [
        'Skyliner Derby races',
        'Railroad-themed promotions',
        'Mountain appreciation nights'
      ],
      mascot: {
        name: 'Steamer',
        description: 'Railroad-themed mascot representing Altoona\'s heritage'
      }
    },

    proTips: {
      insiderTips: [
        'Sit on first base side for best Skyliner views',
        'Bring a jacket even in summer - mountain elevation',
        'Park early in main lot to avoid walking uphill',
        'Visit Horseshoe Curve before the game'
      ],
      avoidThese: [
        'Don\'t sit behind third base if you want coaster views',
        'Avoid driving during shift changes at nearby businesses',
        'Don\'t rely solely on GPS - mountain roads can be tricky'
      ],
      hiddenGems: [
        'Best photo spot is from section 105 for coaster shots',
        'Free tours of Railroaders Museum nearby',
        'Local pizza joints serve unique Altoona-style pizza',
        'Hiking trails accessible from stadium area'
      ],
      photoSpots: [
        'Right field with Skyliner coaster',
        'Home plate with mountains in background',
        'Upper deck mountain panorama',
        'Steamer mascot interactions'
      ],
      bestValue: [
        'Lawn seating for families',
        'Group rates for picnic area',
        'Season ticket packages',
        'Combine with amusement park visit'
      ]
    }
  },

  'amarillo-sod-poodles': {
    id: 'amarillo-sod-poodles',
    name: 'HODGETOWN',
    team: 'Amarillo Sod Poodles',
    opened: 2019,
    capacity: 9323,

    overview: {
      description: 'HODGETOWN is one of the newest ballparks in Minor League Baseball, featuring state-of-the-art amenities and a distinctive Texas Panhandle design with wind-resistant architecture.',
      highlights: [
        'Brand new facility opened in 2019',
        'Wind-resistant design for Texas Panhandle',
        'Modern amenities throughout',
        'Sod Poodles Hall of Fame',
        'Large video board and sound system'
      ],
      uniqueFeatures: [
        'Named after local philanthropist Calvin Hodge',
        'Designed specifically for high wind conditions',
        'LED lighting throughout facility',
        'Synthetic turf field'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['201', '202', '203', 'Club Level'],
        afternoon: ['205', '206', '207', 'Club Level'],
        evening: ['103', '104', '105', '201', '202']
      },
      coveredSeating: ['201', '202', '203', '204', '205', '206', '207', 'Club Level'],
      shadeTips: [
        'Upper deck essential for day games in Texas heat',
        'Club level offers climate-controlled environment',
        'Wind can provide natural cooling but brings dust',
        'Concourse areas provide shade relief'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse', 'Club concourse'],
        indoorAreas: ['Club level', 'Team store', 'Restaurants'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['101', '102', '108', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 45, rainChance: 25, typicalConditions: 'Pleasant with wind', shadeTip: 'Comfortable in most seating areas' },
        { month: 'May', avgTemp: 77, avgHumidity: 50, rainChance: 30, typicalConditions: 'Warm and breezy', shadeTip: 'Afternoon shade becomes important' },
        { month: 'June', avgTemp: 85, avgHumidity: 52, rainChance: 25, typicalConditions: 'Hot and windy', shadeTip: 'Upper deck strongly recommended' },
        { month: 'July', avgTemp: 89, avgHumidity: 50, rainChance: 20, typicalConditions: 'Very hot, high UV', shadeTip: 'Covered seating essential' },
        { month: 'August', avgTemp: 87, avgHumidity: 52, rainChance: 25, typicalConditions: 'Hot with dust storms possible', shadeTip: 'Indoor areas during dust events' },
        { month: 'September', avgTemp: 79, avgHumidity: 48, rainChance: 30, typicalConditions: 'Warm days, cooler evenings', shadeTip: 'Evening games more comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Club Level',
            perks: ['Climate controlled', 'Premium concessions', 'Indoor/outdoor seating', 'Exclusive bar'],
            access: 'Behind home plate with panoramic views'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'TVs']
        }
      },
      budgetOptions: ['Berm seating', '206', '207', 'Standing room'],
      familySections: ['Berm', 'Family sections', '204', '205'],
      standingRoom: ['Concourse areas', 'Berm'],
      partyAreas: [
        {
          name: 'Group Areas',
          capacity: '50-200',
          description: 'Various group seating options available',
          amenities: ['Group menus', 'Dedicated service', 'Flexible arrangements']
        }
      ],
      tips: [
        { section: '101-103', tip: 'Great views but intense sun exposure', category: 'view' },
        { section: '201-203', tip: 'Best combination of views and protection from elements', category: 'shade' },
        { section: 'Club Level', tip: 'Escape from wind and heat', category: 'experience' },
        { section: 'Berm', tip: 'Great value, bring sun protection', category: 'value' },
        { section: '204-206', tip: 'Good views with some afternoon shade', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Sod Poodle Dog', 'Texas BBQ Sandwich', 'Funnel Cake', 'Nachos Supreme'],
      local: ['Texas BBQ', 'Chicken fried steak', 'Amarillo Burger', 'Local beef items'],
      healthy: ['Grilled items', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Designated items available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Popcorn'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Coors Light', 'Texas craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Six Car Pub & Brewery', '575 Pizzeria']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'North Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'VIP Parking', distance: '50 yards', price: '$15', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited residential parking nearby',
        tip: 'Arrive early for free street parking'
      },
      alternativeTransport: {
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks at main entrance'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating areas', 'Team store access'],
        openTime: '90 minutes before first pitch',
        tip: 'Main gate with largest team store'
      },
      {
        name: 'Left Field Gate',
        location: 'Left field area',
        bestFor: ['Berm seating', 'Group areas'],
        openTime: '90 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Main team store', exclusive: ['Sod Poodles gear', 'Texas-themed items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['All restroom facilities'],
      atms: ['Main concourse', 'Club level'],
      wifi: { available: true, network: 'HODGETOWN' },
      chargingStations: ['Club level', 'Concourse areas'],
      kidZones: [
        { name: 'Kids Area', location: 'Beyond right field', activities: ['Playground', 'Interactive games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['101', '102', '103', '201', '202', '203'],
        entrance: 'All gates ADA accessible',
        elevators: ['Multiple locations to upper levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All major stands'],
      parkingSpaces: '25 spaces in main lot'
    },

    gameDay: {
      tips: [
        { title: 'Prepare for Wind', description: 'Bring hat with chin strap, secure loose items', category: 'weather' },
        { title: 'Sun Protection', description: 'Essential in Texas - hat, sunscreen, sunglasses', category: 'weather' },
        { title: 'Hydrate Often', description: 'Drink water frequently, especially in summer', category: 'weather' },
        { title: 'Try Local BBQ', description: 'Sample authentic Texas barbecue options', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: '45 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before game', 'Between innings']
      },
      security: {
        allowedBags: 'Small bags allowed, subject to search',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },

    neighborhood: {
      name: 'Downtown Amarillo',
      description: 'Historic Texas Panhandle city with Route 66 heritage',
      beforeGame: ['Big Texan Steak Ranch', 'Historic downtown district', 'Route 66 attractions'],
      afterGame: ['Local restaurants', 'Entertainment district'],
      radius: '10 miles'
    },

    transportation: {
      address: '715 S Buchanan St, Amarillo, TX 79101',
      publicTransit: {
        bus: [
          { routes: ['Amarillo City Transit'], stops: ['Downtown transit center'] }
        ]
      },
      driving: {
        majorRoutes: ['I-40', 'I-27', 'US-287'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-40 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Main parking lot',
        dropoffZone: 'Home plate gate',
        surgePricing: 'Moderate on game nights',
        alternativeTip: 'Consider walking from downtown hotels'
      }
    },

    history: {
      timeline: [
        { year: 2019, event: 'HODGETOWN opens as new home for Sod Poodles' },
        { year: 2019, event: 'First professional game played' },
        { year: 2021, event: 'Hosted Texas League Championship' }
      ],
      notableGames: [
        { date: '2019-04-08', description: 'First game in HODGETOWN history' },
        { date: '2021-09-21', description: 'Texas League Championship clincher' }
      ],
      traditions: [
        { name: 'Ruckus', description: 'Sod Poodles mascot entertainment' },
        { name: 'Texas Pride', description: 'Celebrating Panhandle heritage' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern ballpark experience with Texas hospitality',
      bestExperiences: [
        'State-of-the-art video board presentations',
        'Interactive kids area',
        'Climate-controlled club level',
        'Texas-sized portions at concessions'
      ],
      traditions: [
        'Ruckus mascot appearances',
        'Texas-themed between-inning entertainment',
        'Route 66 heritage celebrations'
      ],
      mascot: {
        name: 'Ruckus',
        description: 'Prairie dog mascot representing the team name and regional wildlife'
      }
    },

    proTips: {
      insiderTips: [
        'Club level is worth the upgrade for weather protection',
        'Bring secure hat - wind can be intense',
        'Evening games are much more comfortable than day games',
        'Try the Big Texan challenge before the game if you dare'
      ],
      avoidThese: [
        'Don\'t wear loose clothing or hats without straps',
        'Avoid lower level day games in summer',
        'Don\'t park too far away - Texas heat is brutal'
      ],
      hiddenGems: [
        'Sod Poodles Hall of Fame display',
        'Best sunset views from upper deck',
        'Local art installations throughout concourse',
        'Route 66 historical displays'
      ],
      photoSpots: [
        'Home plate with video board backdrop',
        'Texas flag displays',
        'Ruckus mascot interactions',
        'Sunset shots from upper concourse'
      ],
      bestValue: [
        'Berm seating for budget-conscious fans',
        'Group packages with food included',
        'Season tickets with parking included',
        'Evening games for better weather'
      ]
    }
  }
};