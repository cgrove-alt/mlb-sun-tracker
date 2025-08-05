import { StadiumGuide } from '../stadiumGuides';

export const mlbStadiumGuides6: Record<string, StadiumGuide> = {
  'nationals': {
    id: 'nationals',
    name: 'Nationals Park',
    team: 'Washington Nationals',
    opened: 2008,
    capacity: 41339,
    
    overview: {
      description: 'Nationals Park sits along the Anacostia River in Southeast DC with views of the Capitol dome and Washington Monument. Known for Presidents Race, the Red Porch deck, and Ben\'s Chili Bowl stands.',
      highlights: [
        'Views of Washington Monument and Capitol dome',
        'Red Porch deck beyond right field',
        'Presidents Race between innings',
        'Green ballpark with sustainable features'
      ],
      uniqueFeatures: [
        'Red Porch right field party deck',
        'Center Field Gate with water features',
        'PNC Diamond Club behind home plate',
        'Gallery with local DC art',
        'Navy Yard location on Anacostia River'
      ],
      renovations: [
        { year: 2019, description: 'World Series championship upgrades' },
        { year: 2015, description: 'Scoreboard and video board enhancements' },
        { year: 2012, description: 'Concession and club improvements' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 130-142', 'Diamond Club', 'Infield Box 20-34'],
        afternoon: ['First base side sections 108-120', 'Terrace Level 300-315', 'Gallery Level'],
        evening: ['Most infield sections after 6 PM', 'Upper deck provides shade below']
      },
      coveredSeating: ['PNC Diamond Club', 'Terrace Level overhangs', 'Suite levels'],
      shadeTips: [
        'First base side best for afternoon shade',
        'Diamond Club stays cool with AC',
        'Red Porch can be very sunny',
        'Upper deck provides shade for lower levels'
      ],
      sunProtection: {
        sunscreenStations: ['First Aid stations', 'Guest Services'],
        shadedConcourses: ['Main concourse', 'Terrace Level', 'Gallery Level'],
        indoorAreas: ['Team Store', 'PNC Diamond Club', 'Suite areas']
      },
      worstSunExposure: ['Red Porch deck', 'Left field sections 140-145', 'Center field bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 61, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool spring weather', shadeTip: 'Mild sun, light layers recommended' },
        { month: 'May', avgTemp: 71, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant temperatures', shadeTip: 'Shade starts becoming important' },
        { month: 'June', avgTemp: 80, avgHumidity: 70, rainChance: 30, typicalConditions: 'Getting warm and humid', shadeTip: 'First base side for afternoon games' },
        { month: 'July', avgTemp: 84, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential for day games' },
        { month: 'August', avgTemp: 83, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Upper deck or shaded areas recommended' },
        { month: 'September', avgTemp: 76, avgHumidity: 70, rainChance: 20, typicalConditions: 'Cooling down', shadeTip: 'More comfortable, less shade needed' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'PNC Diamond Club', perks: ['All-inclusive dining', 'Premium bar', 'Climate control', 'Field access'], access: 'Behind home plate' },
          { name: 'Terrace Club', perks: ['Club dining', 'Premium concessions', 'Padded seats'], access: 'Upper level behind plate' }
        ],
        suites: {
          levels: ['Suite Level', 'Gallery Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control', 'Private entrance']
        },
        specialAreas: [
          { name: 'Red Porch', description: 'Right field party deck with games and food', capacity: 500 },
          { name: 'Center Field Plaza', description: 'Standing room with views', capacity: 200 }
        ]
      },
      budgetOptions: ['Gallery 400s', 'Outfield Reserved', 'Grandstand 330s-340s'],
      familySections: ['Family Sections 228-230'],
      standingRoom: ['Red Porch', 'Center Field Plaza', 'Budweiser Brew House'],
      partyAreas: [
        { name: 'Red Porch', capacity: '500', amenities: ['Games', 'Standing tables', 'Full bar', 'Food options'] },
        { name: 'Budweiser Brew House', capacity: '300', amenities: ['Craft beer', 'Food', 'Standing room', 'TVs'] }
      ],
      tips: [
        { section: 'PNC Diamond Club', tip: 'Best amenities and field access', category: 'experience' },
        { section: 'Sections 128-135', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Red Porch', tip: 'Fun party atmosphere but hot', category: 'experience' },
        { section: 'Gallery 408-420', tip: 'Best budget seats with good views', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['Ben\'s Chili Bowl half-smokes', 'Shake Shack burgers', 'DC-03 pizzas', 'Blue Jacket beer'],
      local: ['Hard Times Cafe chili', 'Chesapeake crab cakes', 'District Chicken', 'Capitol City Brewing'],
      healthy: ['Nats salads', 'Fresh fruit', 'Veggie wraps', 'Smoothies'],
      vegetarian: ['Impossible burgers', 'Beyond hot dogs', 'Veggie pizza'],
      glutenFree: ['GF hot dog buns', 'GF pizza', 'Rice bowls'],
      kidsFriendly: ['Kids combo meals', 'Cotton candy', 'Ice cream helmets', 'Popcorn'],
      alcohol: {
        beer: ['Blue Jacket', 'Port City', '3 Stars', 'DC Brau'],
        wine: true,
        cocktails: true,
        localBreweries: ['Blue Jacket', 'Port City', '3 Stars', 'DC Brau', 'Atlas Brew Works']
      }
    },
    
    parking: {
      lots: [
        { name: 'Lot A-E (Stadium)', distance: 'Adjacent', price: '$25-45', shadedSpots: false, covered: false, tip: 'Most convenient but fills up early' },
        { name: 'Navy Yard Lots', distance: '3-8 blocks', price: '$15-30', shadedSpots: false, covered: false, tip: 'Walk through Navy Yard area' },
        { name: 'L\'Enfant Plaza', distance: '1 mile', price: '$20', shadedSpots: true, covered: true, tip: 'Metro accessible parking' }
      ],
      streetParking: {
        available: true,
        restrictions: '2-hour meters until 6:30 PM',
        tip: 'Limited availability, arrive early'
      },
      alternativeTransport: {
        publicTransit: ['Green Line to Navy Yard-Ballpark', 'Blue/Orange/Silver to L\'Enfant then bus'],
        rideShare: 'South Capitol St designated area',
        bicycle: 'Capital Bikeshare stations nearby'
      }
    },
    
    gates: [
      { name: 'Center Field Gate', location: 'South Capitol St', bestFor: ['Main entrance', 'Red Porch'], openTime: '2 hours before first pitch' },
      { name: 'First Base Gate', location: 'N St SE', bestFor: ['Diamond Club', 'First base side'], openTime: '90 minutes before first pitch' },
      { name: 'Third Base Gate', location: 'Potomac Ave', bestFor: ['Third base side', 'Terrace Club'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store - Center Field Gate', exclusive: ['World Series gear', 'City Connect jerseys'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 114', 'Section 216', 'Section 314'],
      babyChanging: ['All family restrooms', 'Nursing areas'],
      nursingRooms: ['Guest Services locations'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'Nationals_WiFi' },
      chargingStations: ['Club levels', 'Various concourse locations'],
      kidZones: [
        { name: 'Kids Zone', location: 'Center Field Plaza', activities: ['Playground', 'Speed pitch', 'Face painting'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'All lots have ADA spaces'
    },
    
    gameDay: {
      tips: [
        { title: 'Take Metro Green Line', description: 'Navy Yard station is closest', category: 'arrival' },
        { title: 'Try Ben\'s Chili Bowl', description: 'DC institution in the ballpark', category: 'food' },
        { title: 'Watch Presidents Race', description: 'Between 4th inning entertainment', category: 'experience' },
        { title: 'Explore Navy Yard', description: 'Restaurants and bars pre/post game', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before (Center Field), 90 minutes (others)',
        battingPractice: 'Nats BP 2.5 hours before',
        firstPitch: '7:05 PM weekdays, 7:05 PM Saturdays, 1:35 PM Sundays',
        rushHours: ['5:00-7:00 PM on I-395 and local streets']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas over 36"', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Navy Yard',
      description: 'Rapidly developing waterfront district with new restaurants and apartments',
      beforeGame: ['Bluejacket Brewery', 'Due South', 'Gordon Biersch', 'Vida Fitness rooftop'],
      afterGame: ['The Bullpen (seasonal)', 'Agua 301', 'Osteria Morini', 'Capitol Riverfront'],
      radius: '0.5 miles'
    },
    
    transportation: {
      address: '1500 South Capitol Street SE, Washington, DC 20003',
      publicTransit: {
        subway: [{ lines: ['Green Line'], station: 'Navy Yard-Ballpark', walkTime: '3 minutes' }],
        bus: [{ routes: ['P6', 'V2'], stops: ['South Capitol/N St'] }]
      },
      driving: {
        majorRoutes: ['I-395 to South Capitol St', 'I-695/SW Freeway', 'Anacostia Freeway'],
        typicalTraffic: 'Heavy 5-7 PM on all routes',
        bestApproach: 'I-395 from Virginia, New York Ave from north'
      },
      rideShare: {
        pickupZone: 'South Capitol St & Potomac Ave',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-4x after games',
        alternativeTip: 'Walk to L\'Enfant Metro for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 2008, event: 'Nationals Park opens' },
        { year: 2012, event: 'First division title' },
        { year: 2019, event: 'World Series championship' }
      ],
      notableGames: [
        { date: '2019-10-30', description: 'World Series Game 7 victory' },
        { date: '2012-10-11', description: 'First playoff game in DC' }
      ],
      traditions: [
        { name: 'Presidents Race', description: 'Racing presidents between 4th inning' },
        { name: 'Take Me Out to the Ballgame', description: '7th inning stretch tradition' }
      ],
      retired: [
        { number: '11', player: 'Ryan Zimmerman', year: 2022 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Growing fanbase with 2019 championship energy',
      bestExperiences: [
        'Presidents Race entertainment',
        'Ben\'s Chili Bowl half-smokes',
        'Red Porch party deck',
        'World Series championship celebration'
      ],
      traditions: ['Presidents Race', 'Baby Shark (2019 season)', 'Fight Song'],
      music: 'Mix of classic rock and current hits',
      mascot: { name: 'Screech', description: 'Bald eagle mascot representing national bird' },
      fanGroups: [
        { name: 'Nationals Park Faithful', description: 'Season ticket holder groups' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Metro Green Line easiest way to stadium',
        'Ben\'s Chili Bowl half-smoke is must-try',
        'Red Porch fun but gets very hot',
        'Navy Yard restaurants great for pre-game',
        'Diamond Club worth splurge for amenities'
      ],
      avoidThese: [
        'Driving during rush hour - traffic terrible',
        'Red Porch for day games - no shade',
        'Parking without pre-purchase',
        'Leaving right at game end - Metro crowds'
      ],
      hiddenGems: [
        'Gallery level views of Capitol',
        'Budweiser Brew House craft selection',
        'Anacostia River walking paths',
        'Presidents statues around stadium'
      ],
      photoSpots: [
        'Center Field Gate with stadium behind',
        'With Screech mascot',
        'Presidents Race statues',
        'Views of Capitol dome from upper deck'
      ],
      bestValue: [
        'Gallery sections 408-420',
        'Grandstand corners',
        'Metro cheaper than parking',
        'Weekday games have promotions'
      ]
    }
  },

  'orioles': {
    id: 'orioles',
    name: 'Oriole Park at Camden Yards',
    team: 'Baltimore Orioles',
    opened: 1992,
    capacity: 45971,
    
    overview: {
      description: 'Camden Yards revolutionized baseball stadium design with its retro-classic architecture incorporating the historic B&O Warehouse. Located in downtown Baltimore, it features Boog\'s BBQ, Eutaw Street, and the iconic right field warehouse.',
      highlights: [
        'Historic B&O Warehouse beyond right field',
        'Eutaw Street promenade with restaurants',
        'Downtown Baltimore Inner Harbor location',
        'Pioneer of retro-classic ballpark design'
      ],
      uniqueFeatures: [
        'B&O Warehouse integration',
        'Eutaw Street pedestrian concourse',
        'Flag Court beyond center field',
        'Boog Powell\'s BBQ stand',
        'Iron gate entrance design'
      ],
      renovations: [
        { year: 2019, description: 'Left field dimensions reduced' },
        { year: 2011, description: 'HD video board installation' },
        { year: 2008, description: 'Warehouse renovations' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 54-70', 'Club Box 242-252', 'Upper Reserve 320-340'],
        afternoon: ['First base side sections 12-28', 'Lower Reserve 14-30', 'Upper deck 314-330'],
        evening: ['Home plate area sections', 'Most infield seating after 6 PM']
      },
      coveredSeating: ['Club Level overhangs', 'Some Upper Reserve sections', 'Suite levels'],
      shadeTips: [
        'First base side gets afternoon shade first',
        'Eutaw Street has some covered areas',
        'Upper deck provides shade for lower sections',
        'Club Level stays cooler with overhangs'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services', 'First Aid locations'],
        shadedConcourses: ['Eutaw Street', 'Main concourse', 'Club Level'],
        indoorAreas: ['Team Store', 'Club areas', 'Warehouse shops']
      },
      worstSunExposure: ['Right field bleachers 96-98', 'Left field sections 80-86', 'Flag Court area'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cool spring weather', shadeTip: 'Light sun exposure, layers recommended' },
        { month: 'May', avgTemp: 72, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant temperatures', shadeTip: 'Shade becoming more important' },
        { month: 'June', avgTemp: 81, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'First base side for afternoon relief' },
        { month: 'July', avgTemp: 86, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential, upper deck recommended' },
        { month: 'August', avgTemp: 84, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Covered areas highly recommended' },
        { month: 'September', avgTemp: 77, avgHumidity: 70, rainChance: 20, typicalConditions: 'Cooling temperatures', shadeTip: 'More comfortable, less shade needed' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Camden Club', perks: ['All-inclusive food/drinks', 'Climate control', 'Premium entrance'], access: 'Behind home plate' },
          { name: 'Club Level', perks: ['Padded seats', 'Concession upgrades', 'Better restrooms'], access: 'Mid-level between decks' }
        ],
        suites: {
          levels: ['Suite Level', 'Warehouse Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control', 'Warehouse views']
        },
        specialAreas: [
          { name: 'Flag Court', description: 'Center field picnic area', capacity: 150 },
          { name: 'Eutaw Street', description: 'Walkway with food and shops' }
        ]
      },
      budgetOptions: ['Upper Reserve 316-350', 'Bleachers', 'Standing room on Eutaw St'],
      familySections: ['Family sections in Upper Reserve'],
      standingRoom: ['Eutaw Street', 'Flag Court', 'Standing room areas'],
      partyAreas: [
        { name: 'Flag Court', capacity: '150', amenities: ['Picnic tables', 'Group food service', 'Games'] }
      ],
      tips: [
        { section: 'Camden Club', tip: 'Best amenities and all-inclusive experience', category: 'experience' },
        { section: 'Sections 20-32', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Eutaw Street', tip: 'Free pregame, great atmosphere', category: 'experience' },
        { section: 'Upper Reserve 324-340', tip: 'Best value with good views', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['Boog\'s BBQ', 'Crab cakes', 'Natty Boh beer', 'Pit Beef sandwiches'],
      local: ['Phillips Seafood crab cakes', 'Chesapeake Bay cuisine', 'Old Bay everything', 'Berger cookies'],
      healthy: ['Salads', 'Grilled options', 'Fresh seafood'],
      vegetarian: ['Veggie burgers', 'Salads', 'Fruit options'],
      glutenFree: ['GF hot dog buns', 'Rice bowls', 'Salads'],
      kidsFriendly: ['Kids meals', 'Cotton candy', 'Ice cream', 'Hot dogs'],
      alcohol: {
        beer: ['National Bohemian', 'Flying Dog', 'Heavy Seas', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Flying Dog', 'Heavy Seas', 'Union Craft', 'Peabody Heights']
      }
    },
    
    parking: {
      lots: [
        { name: 'Lot A-H (Stadium)', distance: 'Adjacent', price: '$25-40', shadedSpots: false, covered: false, tip: 'Closest but most expensive' },
        { name: 'Downtown lots', distance: '3-6 blocks', price: '$15-25', shadedSpots: false, covered: false, tip: 'Walk through downtown' },
        { name: 'Inner Harbor lots', distance: '1 mile', price: '$20-30', shadedSpots: true, covered: true, tip: 'Combined with harbor visit' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 8 PM most areas',
        tip: 'Limited near stadium, better south of ballpark'
      },
      alternativeTransport: {
        publicTransit: ['Light Rail to Camden Yards', 'MARC train to Camden Station', 'Bus routes to downtown'],
        rideShare: 'Russell St designated pickup area',
        bicycle: 'Bike racks throughout area'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'Camden St', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: 'Eutaw Street Gate', location: 'Eutaw St', bestFor: ['Right field', 'Warehouse'], openTime: '2.5 hours before first pitch' },
      { name: 'Left Field Gate', location: 'Hamburg St', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Orioles Team Store - Eutaw St', exclusive: ['Vintage jerseys', 'Camden Yards merchandise'] },
        { location: 'Multiple locations throughout' }
      ],
      firstAid: ['Section 38', 'Section 238', 'Section 338'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Eutaw Street'],
      wifi: { available: true, network: 'Orioles_WiFi' },
      chargingStations: ['Club areas', 'Concourse locations'],
      kidZones: [
        { name: 'Kids Clubhouse', location: 'Eutaw Street', activities: ['Play area', 'Games', 'Photo ops'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent locations'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Take Light Rail', description: 'Stops right at stadium', category: 'arrival' },
        { title: 'Walk Eutaw Street', description: 'Opens 2.5 hours early, great atmosphere', category: 'experience' },
        { title: 'Try Boog\'s BBQ', description: 'Orioles legend\'s barbecue stand', category: 'food' },
        { title: 'Visit Inner Harbor', description: 'Before/after game entertainment', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before (2.5 hours Eutaw St)',
        battingPractice: 'O\'s BP 2.5 hours before',
        firstPitch: '7:05 PM weekdays, 7:05 PM Saturdays, 1:35 PM Sundays',
        rushHours: ['5:00-7:00 PM on I-95 and I-83']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Camden Yards/Inner Harbor',
      description: 'Historic downtown area with tourist attractions and nightlife',
      beforeGame: ['Pickles Pub', 'Sliders Bar & Grille', 'Inner Harbor restaurants'],
      afterGame: ['Fells Point bars', 'Federal Hill', 'Power Plant Live'],
      radius: '0.5-1 mile'
    },
    
    transportation: {
      address: '333 West Camden Street, Baltimore, MD 21201',
      publicTransit: {
        train: [
          { lines: ['Light Rail'], station: 'Camden Yards', walkTime: '2 minutes' },
          { lines: ['MARC Camden Line'], station: 'Camden Station', walkTime: '5 minutes' }
        ],
        bus: [{ routes: ['Multiple MTA routes'], stops: ['Camden & Howard'] }]
      },
      driving: {
        majorRoutes: ['I-95 to I-395', 'I-83 to downtown', 'US-40 to Martin Luther King Jr Blvd'],
        typicalTraffic: 'Heavy 5-7 PM on all routes',
        bestApproach: 'I-395 from south, Russell St from north'
      },
      rideShare: {
        pickupZone: 'Russell St & Hamburg St',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to Inner Harbor for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 1992, event: 'Camden Yards opens' },
        { year: 1996, event: 'Cal Ripken breaks consecutive games record' },
        { year: 2001, event: 'Cal Ripken\'s final season' }
      ],
      notableGames: [
        { date: '1992-04-06', description: 'First game at Camden Yards' },
        { date: '1995-09-06', description: 'Cal Ripken breaks Lou Gehrig record' }
      ],
      traditions: [
        { name: 'National Anthem', description: 'O! emphasis during anthem' },
        { name: 'Thank God I\'m a Country Boy', description: '7th inning stretch song' }
      ],
      retired: [
        { number: '4', player: 'Earl Weaver', year: 1982 },
        { number: '5', player: 'Brooks Robinson', year: 1977 },
        { number: '8', player: 'Cal Ripken Jr.', year: 2001 },
        { number: '20', player: 'Frank Robinson', year: 1972 },
        { number: '22', player: 'Jim Palmer', year: 1985 },
        { number: '33', player: 'Eddie Murray', year: 1998 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Passionate fanbase with strong baseball tradition',
      bestExperiences: [
        'Eutaw Street pregame atmosphere',
        'Boog\'s BBQ tradition',
        'B&O Warehouse backdrop',
        'National Anthem "O!" shout'
      ],
      traditions: ['O! during National Anthem', 'Thank God I\'m a Country Boy', 'Warehouse home runs'],
      music: 'Classic rock and country mix',
      mascot: { name: 'The Oriole Bird', description: 'Oriole bird mascot since 1979' },
      fanGroups: [
        { name: 'Birdland', description: 'General fan community' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Light Rail is easiest way to stadium',
        'Eutaw Street opens 2.5 hours early',
        'Boog\'s BBQ is a must-try experience',
        'Club Level worth upgrade for shade',
        'Warehouse shops have unique items'
      ],
      avoidThese: [
        'Driving on I-95 during rush hour',
        'Parking without reservation',
        'Right field bleachers for day games',
        'Leaving immediately after game'
      ],
      hiddenGems: [
        'Warehouse shops and restaurants',
        'Eutaw Street bronze baseballs marking homers',
        'Views from Flag Court',
        'Inner Harbor connection'
      ],
      photoSpots: [
        'Eutaw Street with warehouse',
        'With Oriole Bird mascot',
        'B&O Warehouse from right field',
        'Camden Yards entrance sign'
      ],
      bestValue: [
        'Upper Reserve corners',
        'Bleacher seats',
        'Standing room on Eutaw Street',
        'Light Rail vs driving'
      ]
    }
  },

  'phillies': {
    id: 'phillies',
    name: 'Citizens Bank Park',
    team: 'Philadelphia Phillies',
    opened: 2004,
    capacity: 42792,
    
    overview: {
      description: 'Citizens Bank Park in South Philadelphia features the largest Liberty Bell replica, Ashburn Alley beyond center field, and Phanavision video board. Known for passionate Phillies fans, cheesesteaks, and the Phanatic\'s antics.',
      highlights: [
        'Liberty Bell replica in center field',
        'Ashburn Alley entertainment area',
        'Phanavision HD video board',
        'South Philly sports complex location'
      ],
      uniqueFeatures: [
        'Liberty Bell beyond center field',
        'Ashburn Alley with games and food',
        'Phanatic\'s Phun Zone for kids',
        'Hall of Fame Club restaurant',
        'Philadelphia sports statues outside'
      ],
      renovations: [
        { year: 2018, description: 'Phanavision video board upgrade' },
        { year: 2014, description: 'Concession and seating improvements' },
        { year: 2011, description: 'Left field scoreboard addition' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 136-148', 'Pavilion Level 236-248', 'Hall of Fame Club'],
        afternoon: ['First base side sections 108-120', 'Terrace Level 214-226', 'Upper deck 416-428'],
        evening: ['Most infield sections after 6 PM', 'Club and suite levels']
      },
      coveredSeating: ['Hall of Fame Club', 'Diamond Club', 'Some terrace overhangs'],
      shadeTips: [
        'First base side gets afternoon shade',
        'Upper deck provides shade for lower levels',
        'Ashburn Alley has some covered areas',
        'Club levels stay cooler'
      ],
      sunProtection: {
        sunscreenStations: ['First Aid stations'],
        shadedConcourses: ['Main concourse', 'Ashburn Alley', 'Terrace Level'],
        indoorAreas: ['Team Store', 'Hall of Fame Club', 'Diamond Club']
      },
      worstSunExposure: ['Left field sections 140-144', 'Right field 101-107', 'Some Ashburn Alley areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 59, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cool spring weather', shadeTip: 'Mild sun, light jacket recommended' },
        { month: 'May', avgTemp: 69, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant temperatures', shadeTip: 'Shade starting to matter' },
        { month: 'June', avgTemp: 78, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm summer weather', shadeTip: 'First base side for afternoon games' },
        { month: 'July', avgTemp: 83, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential for day games' },
        { month: 'August', avgTemp: 82, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Upper deck or shaded areas recommended' },
        { month: 'September', avgTemp: 74, avgHumidity: 70, rainChance: 20, typicalConditions: 'Cooling temperatures', shadeTip: 'More comfortable conditions' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive dining', 'Premium bar', 'Field access'], access: 'Behind home plate' },
          { name: 'Hall of Fame Club', perks: ['Upscale dining', 'Climate control', 'Premium amenities'], access: 'Club level' }
        ],
        suites: {
          levels: ['Suite Level', 'Dugout Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Ashburn Alley', description: 'Center field entertainment area', capacity: 1000 },
          { name: 'Phanatic\'s Phun Zone', description: 'Kids play area', capacity: 100 }
        ]
      },
      budgetOptions: ['Pavilion Level 310-348', 'Upper Reserved', 'Standing room'],
      familySections: ['Family sections throughout pavilion'],
      standingRoom: ['Ashburn Alley', 'Hall of Fame Grille', 'McFadden\'s'],
      partyAreas: [
        { name: 'Ashburn Alley', capacity: '1000', amenities: ['Games', 'Food stands', 'Entertainment', 'Standing room'] },
        { name: 'McFadden\'s Restaurant', capacity: '400', amenities: ['Full bar', 'Food', 'TVs', 'Party atmosphere'] }
      ],
      tips: [
        { section: 'Diamond Club', tip: 'Best amenities and field access', category: 'experience' },
        { section: 'Sections 114-126', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Ashburn Alley', tip: 'Fun atmosphere but can be crowded', category: 'experience' },
        { section: 'Pavilion 324-340', tip: 'Best budget seats with decent views', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['Cheesesteaks from various vendors', 'Schmitter sandwich', 'Chickie\'s & Pete\'s crab fries', 'Yuengling beer'],
      local: ['Tony Luke\'s roast pork', 'Campo\'s deli', 'Federal Donuts', 'Bassetts ice cream'],
      healthy: ['Fresh salads', 'Grilled options', 'Fruit cups'],
      vegetarian: ['Veggie cheesesteaks', 'Beyond burgers', 'Salads'],
      glutenFree: ['GF rolls available', 'Salads', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Cotton candy', 'Ice cream', 'Hot dogs'],
      alcohol: {
        beer: ['Yuengling', 'Yards Brewing', 'Victory', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Yards', 'Victory', 'Dogfish Head', 'Troegs']
      }
    },
    
    parking: {
      lots: [
        { name: 'Citizens Bank Park Lots', distance: 'Adjacent', price: '$20-35', shadedSpots: false, covered: false, tip: 'Prepurchase recommended' },
        { name: 'FDR Park', distance: '10 min walk', price: '$15', shadedSpots: true, covered: false, tip: 'Cheaper option with trees' },
        { name: 'Wells Fargo Center', distance: '5 min walk', price: '$25', shadedSpots: false, covered: false, tip: 'Shared with other venues' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited, mostly residential permit areas',
        tip: 'Very limited, not recommended'
      },
      alternativeTransport: {
        publicTransit: ['Broad Street Line to NRG Station', 'SEPTA buses'],
        rideShare: 'Pattison Ave designated areas',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'First Base Gate', location: '11th & Pattison', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: 'Third Base Gate', location: 'Darien St', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' },
      { name: 'Center Field Gate', location: 'Ashburn Alley', bestFor: ['Center field, kids areas'], openTime: '2 hours before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Majestic Clubhouse Store', exclusive: ['Custom jerseys', 'Exclusive Phillies gear'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 126', 'Section 226', 'Section 326'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'Phillies_WiFi' },
      chargingStations: ['Club areas', 'Ashburn Alley'],
      kidZones: [
        { name: 'Phanatic\'s Phun Zone', location: 'Ashburn Alley', activities: ['Playground', 'Games', 'Photo ops'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Take Broad Street Line', description: 'Direct to NRG Station', category: 'arrival' },
        { title: 'Get cheesesteak early', description: 'Lines get long during games', category: 'food' },
        { title: 'Visit Ashburn Alley', description: 'Great pre-game atmosphere', category: 'experience' },
        { title: 'Watch for Phanatic', description: 'Best mascot in baseball', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: 'Phillies BP 2.5 hours before',
        firstPitch: '7:05 PM weekdays, 7:05 PM Saturdays, 1:05 PM Sundays',
        rushHours: ['4:30-6:30 PM on I-95 and Broad St']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'South Philadelphia Sports Complex',
      description: 'Sports complex area with all four major Philly teams',
      beforeGame: ['Xfinity Live!', 'Tony Luke\'s', 'Local sports bars'],
      afterGame: ['Xfinity Live!', 'Center City bars', 'South Street'],
      radius: '1 mile'
    },
    
    transportation: {
      address: '1 Citizens Bank Way, Philadelphia, PA 19148',
      publicTransit: {
        subway: [{ lines: ['Broad Street Line'], station: 'NRG Station', walkTime: '5 minutes' }],
        bus: [{ routes: ['Multiple SEPTA routes'], stops: ['Broad & Pattison'] }]
      },
      driving: {
        majorRoutes: ['I-95 to Broad St', 'I-76 to Broad St', 'Broad St from Center City'],
        typicalTraffic: 'Heavy 4:30-6:30 PM on all routes',
        bestApproach: 'I-95 from south, Broad St from north'
      },
      rideShare: {
        pickupZone: 'Pattison Ave & 11th St',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to AT&T Station for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 2004, event: 'Citizens Bank Park opens' },
        { year: 2008, event: 'World Series championship' },
        { year: 2009, event: 'World Series return' }
      ],
      notableGames: [
        { date: '2008-10-29', description: 'World Series Game 5 victory (rain delay)' },
        { date: '2010-05-29', description: 'Roy Halladay perfect game' }
      ],
      traditions: [
        { name: 'Phanatic antics', description: 'Beloved mascot entertainment' },
        { name: 'High Hopes', description: 'Victory song' }
      ],
      retired: [
        { number: '1', player: 'Richie Ashburn', year: 1979 },
        { number: '14', player: 'Jim Bunning', year: 2001 },
        { number: '15', player: 'Dick Allen', year: 2020 },
        { number: '20', player: 'Mike Schmidt', year: 1990 },
        { number: '32', player: 'Steve Carlton', year: 1989 },
        { number: '36', player: 'Robin Roberts', year: 1962 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Passionate, knowledgeable, and sometimes rowdy fanbase',
      bestExperiences: [
        'Phanatic entertainment',
        'Authentic Philly cheesesteaks',
        'Ashburn Alley atmosphere',
        'Liberty Bell celebration'
      ],
      traditions: ['Phanatic antics', 'High Hopes victory song', 'Cheesesteak traditions'],
      music: 'Rock and classic Philadelphia songs',
      mascot: { name: 'Phillie Phanatic', description: 'Green furry mascot, famous for antics since 1978' },
      fanGroups: [
        { name: 'Phan Club', description: 'Season ticket holder groups' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Broad Street Line is easiest transit',
        'Cheesesteaks from Tony Luke\'s are authentic',
        'Ashburn Alley great for kids',
        'Diamond Club worth splurge',
        'Phanatic usually appears multiple times'
      ],
      avoidThese: [
        'Driving during rush hour',
        'Parking without prepurchase',
        'Standing in cheesesteak lines during innings',
        'Heckling too much - fans give it back'
      ],
      hiddenGems: [
        'Liberty Bell replica tours',
        'Chickie\'s & Pete\'s crab fries',
        'Hall of Fame Club restaurant',
        'Phillies Wall of Fame'
      ],
      photoSpots: [
        'With Phillie Phanatic',
        'Liberty Bell replica',
        'Ashburn Alley entrance',
        'Mike Schmidt statue outside'
      ],
      bestValue: [
        'Pavilion Level corners',
        'Standing room in Ashburn Alley',
        'Weeknight games',
        'Subway vs driving and parking'
      ]
    }
  },

  'pirates': {
    id: 'pirates',
    name: 'PNC Park',
    team: 'Pittsburgh Pirates',
    opened: 2001,
    capacity: 38747,
    
    overview: {
      description: 'PNC Park sits along the Allegheny River with stunning views of Pittsburgh\'s skyline and the Roberto Clemente Bridge. Known for Primanti Brothers sandwiches, the Clemente Wall, and intimate atmosphere with no bad seats.',
      highlights: [
        'Pittsburgh skyline and three rivers views',
        'Roberto Clemente Bridge entrance',
        '21-foot right field wall (Clemente Wall)',
        'Intimate ballpark with excellent sight lines'
      ],
      uniqueFeatures: [
        'Roberto Clemente Bridge pedestrian access',
        'Allegheny River waterfront location',
        'Clemente Wall in right field',
        'Pittsburgh skyline backdrop',
        'Outfield concourse with river views'
      ],
      renovations: [
        { year: 2015, description: 'Video board and sound system upgrades' },
        { year: 2012, description: 'Concession and seating improvements' },
        { year: 2008, description: 'Right field renovations' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 127-141', 'Club Level 219-233', 'Upper deck 315-329'],
        afternoon: ['First base side sections 101-115', 'Infield Box 203-217', 'Upper deck 301-315'],
        evening: ['Home plate sections', 'Most infield areas after 6 PM']
      },
      coveredSeating: ['Club Level overhangs', 'Some upper deck sections', 'Suite levels'],
      shadeTips: [
        'First base side gets afternoon shade',
        'Club Level provides good shade coverage',
        'River breeze helps with heat',
        'Upper deck overhangs protect lower sections'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services', 'First Aid stations'],
        shadedConcourses: ['Outfield concourse', 'Main concourse', 'Club Level'],
        indoorAreas: ['Team Store', 'Club areas', 'Restaurants']
      },
      worstSunExposure: ['Bleachers 142-144', 'Left field sections 135-139', 'Some outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 57, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool and variable', shadeTip: 'Light sun, jacket recommended' },
        { month: 'May', avgTemp: 67, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant spring weather', shadeTip: 'Shade becoming important' },
        { month: 'June', avgTemp: 76, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm summer weather', shadeTip: 'First base side for afternoon' },
        { month: 'July', avgTemp: 80, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential for day games' },
        { month: 'August', avgTemp: 79, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Upper deck or shaded areas' },
        { month: 'September', avgTemp: 72, avgHumidity: 70, rainChance: 20, typicalConditions: 'Cooling temperatures', shadeTip: 'More comfortable conditions' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive dining', 'Premium bar', 'Field access'], access: 'Behind home plate' },
          { name: 'Club Level', perks: ['Padded seats', 'Better concessions', 'Shade coverage'], access: 'Mid-level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'River views']
        },
        specialAreas: [
          { name: 'Outfield Reserved', description: 'Budget seating with great views' },
          { name: 'Grandstand', description: 'Upper level with skyline views' }
        ]
      },
      budgetOptions: ['Grandstand 301-341', 'Outfield Reserved', 'Standing room'],
      familySections: ['Designated family areas throughout'],
      standingRoom: ['Outfield concourse', 'Various deck areas'],
      partyAreas: [
        { name: 'Right Field Terrace', capacity: '200', amenities: ['Standing room', 'Bar service', 'River views'] }
      ],
      tips: [
        { section: 'Diamond Club', tip: 'Best amenities and climate control', category: 'experience' },
        { section: 'Sections 105-115', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Outfield Reserved', tip: 'Best value with skyline views', category: 'value' },
        { section: 'Club Level 219-229', tip: 'Good shade and amenities', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Primanti Brothers sandwiches', 'Pierogies', 'IC Light beer', 'Kennywood popcorn'],
      local: ['Heinz ketchup everything', 'Pittsburgh-style salads', 'Klondike bars', 'Sarris chocolates'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie pierogies', 'Beyond burgers', 'Salads'],
      glutenFree: ['GF options available', 'Salads', 'Grilled items'],
      kidsFriendly: ['Kids meals', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['IC Light', 'Penn Pilsner', 'Yuengling', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Penn Brewery', 'Church Brew Works', 'Voodoo', 'Grist House']
      }
    },
    
    parking: {
      lots: [
        { name: 'North Shore lots', distance: 'Adjacent', price: '$20-30', shadedSpots: false, covered: false, tip: 'Closest to stadium' },
        { name: 'Downtown lots', distance: '10-15 min walk', price: '$15-25', shadedSpots: true, covered: true, tip: 'Cross Roberto Clemente Bridge' },
        { name: 'Strip District', distance: '1 mile', price: '$10-15', shadedSpots: false, covered: false, tip: 'Cheaper option' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 6 PM most areas',
        tip: 'Limited near stadium'
      },
      alternativeTransport: {
        publicTransit: ['T (Light Rail) to North Side', 'Bus routes to North Shore'],
        rideShare: 'General Robinson St pickup area',
        bicycle: 'Bike racks throughout North Shore'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'Federal St', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: 'Center Field Gate', location: 'Tony Dorsett Way', bestFor: ['Outfield sections'], openTime: '90 minutes before first pitch' },
      { name: 'Left Field Gate', location: 'Mazeroski Way', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Pirates Clubhouse Store', exclusive: ['Vintage Pittsburgh gear', 'Clemente merchandise'] },
        { location: 'Multiple kiosks' }
      ],
      firstAid: ['Section 114', 'Section 221', 'Section 321'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'PNC_Park_WiFi' },
      chargingStations: ['Club areas', 'Various locations'],
      kidZones: [
        { name: 'Kids Area', location: 'Outfield concourse', activities: ['Play area', 'Games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Walk Roberto Clemente Bridge', description: 'Iconic entrance to ballpark', category: 'arrival' },
        { title: 'Try Primanti Brothers', description: 'Pittsburgh sandwich tradition', category: 'food' },
        { title: 'Enjoy skyline views', description: 'Best views in baseball', category: 'experience' },
        { title: 'Take outfield walk', description: 'Great concourse with river views', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: 'Pirates BP 2.5 hours before',
        firstPitch: '7:05 PM weekdays, 7:05 PM Saturdays, 1:35 PM Sundays',
        rushHours: ['4:30-6:30 PM on all bridges and highways']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'North Shore',
      description: 'Sports and entertainment district across from downtown',
      beforeGame: ['Jerome Bettis Grille 36', 'Rivers Casino', 'North Shore restaurants'],
      afterGame: ['SouthSide bars', 'Strip District', 'Market Square'],
      radius: '0.5 miles'
    },
    
    transportation: {
      address: '115 Federal Street, Pittsburgh, PA 15212',
      publicTransit: {
        train: [{ lines: ['T Light Rail'], station: 'North Side', walkTime: '5 minutes' }],
        bus: [{ routes: ['Multiple PAT routes'], stops: ['North Shore'] }]
      },
      driving: {
        majorRoutes: ['I-279 to North Shore', 'I-376 to downtown then bridges', 'Route 28'],
        typicalTraffic: 'Heavy on all bridges 4:30-6:30 PM',
        bestApproach: 'I-279 from north, bridges from downtown'
      },
      rideShare: {
        pickupZone: 'General Robinson St',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk across bridge to downtown'
      }
    },
    
    history: {
      timeline: [
        { year: 2001, event: 'PNC Park opens' },
        { year: 2013, event: 'End of 20-year losing streak' },
        { year: 2015, event: 'Wild Card appearances' }
      ],
      notableGames: [
        { date: '2013-09-23', description: 'Clinched first playoff berth in 21 years' },
        { date: '2014-10-01', description: 'Wild Card Game vs Giants' }
      ],
      traditions: [
        { name: 'Pierogi Race', description: 'Between-inning racing pierogies' },
        { name: 'Let\'s Go Bucs', description: 'Team chant' }
      ],
      retired: [
        { number: '1', player: 'Billy Meyer', year: 1954 },
        { number: '4', player: 'Ralph Kiner', year: 1987 },
        { number: '8', player: 'Willie Stargell', year: 1982 },
        { number: '9', player: 'Bill Mazeroski', year: 1987 },
        { number: '11', player: 'Paul Waner', year: 1956 },
        { number: '20', player: 'Pie Traynor', year: 1972 },
        { number: '21', player: 'Roberto Clemente', year: 1973 },
        { number: '33', player: 'Honus Wagner', year: 1956 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Loyal fanbase despite recent struggles, beautiful setting',
      bestExperiences: [
        'Pittsburgh skyline views',
        'Primanti Brothers sandwiches',
        'Roberto Clemente Bridge walk',
        'Pierogi Race entertainment'
      ],
      traditions: ['Pierogi Race', 'Let\'s Go Bucs chant', 'Terrible Towel waving'],
      music: 'Classic rock and Pittsburgh songs',
      mascot: { name: 'Pirate Parrot', description: 'Parrot mascot since 1979' },
      fanGroups: [
        { name: 'Bucco Brigade', description: 'Die-hard fan group' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Walk Roberto Clemente Bridge for best entrance',
        'Outfield concourse has best skyline views',
        'Primanti Brothers sandwich is mandatory',
        'Club Level worth upgrade for shade',
        'River breeze can cool things down'
      ],
      avoidThese: [
        'Driving during rush hour',
        'Parking on North Shore without prepay',
        'Missing the Pierogi Race',
        'Sitting in sun for day games'
      ],
      hiddenGems: [
        'Clemente Wall signatures',
        'Outfield river views',
        'Willie Stargell statue',
        'Three Rivers confluence views'
      ],
      photoSpots: [
        'Roberto Clemente Bridge approach',
        'Skyline from outfield concourse',
        'With Pirate Parrot',
        'Clemente statue outside'
      ],
      bestValue: [
        'Grandstand sections with skyline views',
        'Outfield Reserved seats',
        'Standing room on concourse',
        'Light rail vs driving'
      ]
    }
  },

  'rangers': {
    id: 'rangers',
    name: 'Globe Life Field',
    team: 'Texas Rangers',
    opened: 2020,
    capacity: 40300,
    
    overview: {
      description: 'Globe Life Field is the newest MLB stadium, featuring a retractable roof essential for Texas heat, modern amenities, and air conditioning throughout. Located in Arlington between Dallas and Fort Worth with Texas-sized hospitality.',
      highlights: [
        'Retractable roof with air conditioning',
        'Most modern MLB facility',
        'Texas Live! entertainment district adjacent',
        'Largest video board in MLB'
      ],
      uniqueFeatures: [
        'Climate-controlled environment',
        'Texas Live! connected entertainment',
        'Home Run Porch in right field',
        'Gallery seating with premium views',
        'Modern technology throughout'
      ],
      renovations: []
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['All sections with roof closed (most games)', 'Climate controlled throughout'],
        afternoon: ['Entire stadium air conditioned', 'Roof typically closed for comfort'],
        evening: ['All seating areas climate controlled']
      },
      coveredSeating: ['Entire stadium when roof closed', 'All premium areas'],
      shadeTips: [
        'Roof closed for virtually all summer games',
        'AC throughout stadium',
        'When roof open (rare), upper deck provides shade',
        'Texas Live! outdoor areas can be hot'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services areas'],
        shadedConcourses: ['All concourses covered and climate controlled'],
        indoorAreas: ['Entire stadium', 'Texas Live!', 'Team Store']
      },
      worstSunExposure: ['Texas Live! outdoor areas', 'Parking lots'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 73, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant spring weather', shadeTip: 'Roof may be open occasionally' },
        { month: 'May', avgTemp: 81, avgHumidity: 70, rainChance: 30, typicalConditions: 'Getting warm', shadeTip: 'AC comfort begins' },
        { month: 'June', avgTemp: 89, avgHumidity: 70, rainChance: 20, typicalConditions: 'Hot Texas summer', shadeTip: 'Roof closed, AC essential' },
        { month: 'July', avgTemp: 95, avgHumidity: 65, rainChance: 15, typicalConditions: 'Extreme heat', shadeTip: 'Indoor comfort crucial' },
        { month: 'August', avgTemp: 95, avgHumidity: 65, rainChance: 15, typicalConditions: 'Peak Texas heat', shadeTip: 'AC sanctuary' },
        { month: 'September', avgTemp: 87, avgHumidity: 70, rainChance: 20, typicalConditions: 'Still very hot', shadeTip: 'Roof remains closed' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Field Club', perks: ['All-inclusive dining', 'Premium bar', 'Field access', 'AC'], access: 'Field level behind plate' },
          { name: 'Gallery Club', perks: ['Upscale dining', 'Premium service', 'Climate control'], access: 'Gallery level' },
          { name: 'Texas Live! Club', perks: ['Entertainment district access', 'Premium amenities'], access: 'Connected to Texas Live!' }
        ],
        suites: {
          levels: ['Suite Level', 'Premium Suites'],
          amenities: ['Private restrooms', 'Catering', 'Multiple HDTVs', 'Climate control', 'Premium service']
        },
        specialAreas: [
          { name: 'Home Run Porch', description: 'Right field party deck', capacity: 400 },
          { name: 'Texas Live!', description: 'Adjacent entertainment district' }
        ]
      },
      budgetOptions: ['Upper Reserved 300s', 'Outfield sections', 'Standing room'],
      familySections: ['Family sections throughout upper level'],
      standingRoom: ['Home Run Porch', 'Texas Live! areas', 'Concourse areas'],
      partyAreas: [
        { name: 'Home Run Porch', capacity: '400', amenities: ['Standing room', 'Bar service', 'Games', 'Climate control'] },
        { name: 'Texas Live!', capacity: '2000+', amenities: ['Restaurants', 'Bars', 'Entertainment', 'Shopping'] }
      ],
      tips: [
        { section: 'Field Club', tip: 'Best amenities and field access', category: 'experience' },
        { section: 'Sections 20-26', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Home Run Porch', tip: 'Fun party atmosphere with AC', category: 'experience' },
        { section: 'Upper Reserved 314-334', tip: 'Good value with comfort', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['Texas BBQ', 'Chicken fried steak', 'Frito pie', 'Shiner Bock beer'],
      local: ['Whataburger', 'Pecan pie', 'Texas chili', 'Kolaches', 'Dr Pepper'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Beyond burgers', 'Veggie options', 'Salads'],
      glutenFree: ['GF options available', 'Salads', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Cotton candy', 'Ice cream', 'Corn dogs'],
      alcohol: {
        beer: ['Shiner Bock', 'Deep Ellum', 'Revolver', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Deep Ellum', 'Revolver', 'Peticolas', 'Four Corners']
      }
    },
    
    parking: {
      lots: [
        { name: 'Globe Life Field Lots', distance: 'Adjacent', price: '$25-50', shadedSpots: false, covered: false, tip: 'Reserve online for better prices' },
        { name: 'Texas Live! Garage', distance: 'Connected', price: '$30-40', shadedSpots: true, covered: true, tip: 'Climate controlled parking' },
        { name: 'Overflow lots', distance: '10-15 min walk', price: '$15-25', shadedSpots: false, covered: false, tip: 'Shuttle service available' }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking available',
        tip: 'Must use official parking'
      },
      alternativeTransport: {
        publicTransit: ['TEXRail to CentrePort/DFW Airport Station (shuttle)', 'TRE to CentrePort'],
        rideShare: 'Designated pickup/drop-off zones',
        bicycle: 'Limited bike parking available'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'Randol Mill Rd', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: 'Center Field Gate', location: 'Texas Live! Way', bestFor: ['Outfield sections', 'Texas Live!'], openTime: '2 hours before first pitch' },
      { name: 'Left Field Gate', location: 'Globe Life Way', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Rangers Clubhouse Store', exclusive: ['World Series gear', 'Exclusive Rangers items'] },
        { location: 'Multiple locations throughout stadium' }
      ],
      firstAid: ['Section 25', 'Section 225', 'Section 325'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Texas Live!', 'Main concourses'],
      wifi: { available: true, network: 'Rangers_WiFi', freeZones: ['Throughout stadium'] },
      chargingStations: ['Premium areas', 'Various concourse locations'],
      kidZones: [
        { name: 'Kids Zone', location: 'Outfield area', activities: ['Play area', 'Interactive games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: 'ADA spaces in all lots and garages'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive early for Texas Live!', description: 'Entertainment district with dining', category: 'arrival' },
        { title: 'Enjoy the AC', description: 'Escape Texas heat indoors', category: 'weather' },
        { title: 'Try Texas BBQ', description: 'Authentic local cuisine', category: 'food' },
        { title: 'Explore modern amenities', description: 'Newest stadium features', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: 'Rangers BP 2.5 hours before',
        firstPitch: '7:05 PM weekdays, 6:05 PM Saturdays, 1:35 PM Sundays',
        rushHours: ['5:00-7:00 PM on I-30 and Highway 360']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Arlington Entertainment District',
      description: 'Sports and entertainment complex between Dallas and Fort Worth',
      beforeGame: ['Texas Live! restaurants', 'AT&T Stadium area', 'Local sports bars'],
      afterGame: ['Texas Live! nightlife', 'Six Flags Over Texas', 'Downtown Arlington'],
      radius: '1 mile'
    },
    
    transportation: {
      address: '734 Stadium Drive, Arlington, TX 76011',
      publicTransit: {
        train: [
          { lines: ['TEXRail'], station: 'CentrePort/DFW Airport', walkTime: '15 minutes with shuttle' },
          { lines: ['TRE'], station: 'CentrePort', walkTime: '15 minutes with shuttle' }
        ]
      },
      driving: {
        majorRoutes: ['I-30 to Ballpark Way', 'Highway 360 to Randol Mill Rd', 'Highway 161'],
        typicalTraffic: 'Heavy 5-7 PM on I-30 and 360',
        bestApproach: 'I-30 from east/west, 360 from north/south'
      },
      rideShare: {
        pickupZone: 'Designated rideshare lots',
        dropoffZone: 'Texas Live! area',
        surgePricing: '2-4x after games',
        alternativeTip: 'Walk to nearby hotels for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 2020, event: 'Globe Life Field opens' },
        { year: 2020, event: 'World Series hosted (neutral site)' },
        { year: 2023, event: 'First World Series championship' }
      ],
      notableGames: [
        { date: '2020-10-27', description: 'World Series Game 6 (neutral site)' },
        { date: '2023-11-01', description: 'World Series Game 5 championship' }
      ],
      traditions: [
        { name: 'Captain', description: 'Rangers mascot entertainment' },
        { name: 'Cotton-Eyed Joe', description: 'Between innings tradition' }
      ],
      retired: [
        { number: '26', player: 'Johnny Oates', year: 2005 },
        { number: '34', player: 'Nolan Ryan', year: 1996 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Growing excitement after 2023 championship, family-friendly',
      bestExperiences: [
        'Climate-controlled comfort',
        'Texas Live! entertainment',
        'Modern stadium amenities',
        'World Series championship celebration'
      ],
      traditions: ['Cotton-Eyed Joe', 'Captain mascot antics', 'Texas pride'],
      music: 'Country and classic rock mix',
      mascot: { name: 'Captain', description: 'Horse mascot representing Texas Rangers heritage' },
      fanGroups: [
        { name: 'Rangers Republic', description: 'Fan club organization' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Texas Live! great for pre/post game',
        'AC makes summer games comfortable',
        'Texas BBQ is authentic',
        'Modern amenities throughout',
        'Reserve parking online for savings'
      ],
      avoidThese: [
        'Outdoor areas in summer heat',
        'Driving without parking reservation',
        'Rush hour on I-30',
        'Missing Texas Live! experience'
      ],
      hiddenGems: [
        'Gallery level views',
        'Texas Live! rooftop bars',
        'Modern technology features',
        'Climate-controlled comfort'
      ],
      photoSpots: [
        'With Captain mascot',
        'Texas Live! entrance',
        'Stadium exterior architecture',
        'World Series trophy display'
      ],
      bestValue: [
        'Upper Reserved with AC comfort',
        'Texas Live! dining specials',
        'Group packages',
        'Season ticket plans'
      ]
    }
  }
,

  'rays': {
    id: 'rays',
    name: 'Tropicana Field',
    team: 'Tampa Bay Rays',
    opened: 1990,
    capacity: 25000,
    
    overview: {
      description: 'Tropicana Field is the only fixed-dome stadium in MLB, featuring artificial turf, the unique catwalk system, and the Rays Tank with live rays. Located in St. Petersburg, it\'s known for innovative fan experiences and quirky ground rules.',
      highlights: [
        'Only fixed-dome stadium in MLB',
        'Ray Tank with live stingrays',
        'Unique catwalk system affects play',
        'Artificial turf playing surface'
      ],
      uniqueFeatures: [
        'Four-level catwalk system',
        'Ray Tank behind center field',
        'Rotunda entrance area',
        'Ted Williams Museum & Hitters Hall of Fame',
        'Smaller capacity creates intimate feel'
      ],
      renovations: [
        { year: 2019, description: 'Concession and seating improvements' },
        { year: 2006, description: 'Major renovations and rebranding' },
        { year: 1998, description: 'Tampa Bay Devil Rays era begins' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['All sections - indoor climate controlled'],
        afternoon: ['Entire stadium air conditioned'],
        evening: ['All seating areas climate controlled']
      },
      coveredSeating: ['Entire stadium is covered and climate controlled'],
      shadeTips: [
        'Indoor stadium eliminates sun concerns',
        'Climate controlled year-round',
        'No weather delays or sun issues',
        'Consistent temperature throughout'
      ],
      sunProtection: {
        sunscreenStations: ['Not needed - indoor facility'],
        shadedConcourses: ['All areas covered'],
        indoorAreas: ['Entire facility', 'Rotunda', 'Ray Tank area']
      },
      worstSunExposure: ['Parking lots only'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 72, avgHumidity: 65, rainChance: 20, typicalConditions: 'Indoor climate control', shadeTip: 'Perfect indoor conditions' },
        { month: 'May', avgTemp: 72, avgHumidity: 65, rainChance: 25, typicalConditions: 'Climate controlled', shadeTip: 'Consistent indoor comfort' },
        { month: 'June', avgTemp: 72, avgHumidity: 65, rainChance: 40, typicalConditions: 'AC comfort while hot outside', shadeTip: 'Indoor sanctuary from heat' },
        { month: 'July', avgTemp: 72, avgHumidity: 65, rainChance: 45, typicalConditions: 'Cool inside, hot outside', shadeTip: 'AC essential escape' },
        { month: 'August', avgTemp: 72, avgHumidity: 65, rainChance: 45, typicalConditions: 'Climate controlled relief', shadeTip: 'Perfect escape from heat' },
        { month: 'September', avgTemp: 72, avgHumidity: 65, rainChance: 40, typicalConditions: 'Consistent indoor comfort', shadeTip: 'Year-round climate control' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Lexus Lounge', perks: ['All-inclusive dining', 'Premium bar', 'Climate control'], access: 'Behind home plate' },
          { name: 'Cuesta-Rey Cigar Bar', perks: ['Cigar lounge', 'Premium drinks', 'Upscale atmosphere'], access: 'Upper level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Ray Tank', description: 'Touch tank with live rays behind center field' },
          { name: 'Rotunda', description: 'Entrance area with activities' }
        ]
      },
      budgetOptions: ['Upper Reserved 300s', 'Outfield sections', 'Bleachers'],
      familySections: ['Designated family areas'],
      standingRoom: ['Rotunda area', 'Concourse areas'],
      partyAreas: [
        { name: 'Party Deck', capacity: '200', amenities: ['Standing room', 'Bar service', 'Group dining'] }
      ],
      tips: [
        { section: 'Lexus Lounge', tip: 'Best amenities and all-inclusive experience', category: 'experience' },
        { section: 'Sections 104-110', tip: 'Close to action behind home plate', category: 'view' },
        { section: 'Outfield sections', tip: 'Budget-friendly with decent views', category: 'value' },
        { section: 'Ray Tank area', tip: 'Unique experience for kids', category: 'family' }
      ]
    },
    
    concessions: {
      signature: ['Cuban sandwiches', 'Grouper sandwich', 'Ybor City fare', 'Cigar City beer'],
      local: ['Florida orange juice', 'Key lime pie', 'Stone crab', 'Café con leche'],
      healthy: ['Salads', 'Fresh fruit', 'Grilled fish'],
      vegetarian: ['Beyond burgers', 'Veggie options', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Kids meals', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Cigar City', 'Funky Buddha', 'Yuengling', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Cigar City', 'Funky Buddha', 'Green Bench', '3 Daughters']
      }
    },
    
    parking: {
      lots: [
        { name: 'Tropicana Field Lots', distance: 'Adjacent', price: '$20-30', shadedSpots: false, covered: false, tip: 'Limited spaces, arrive early' },
        { name: 'Downtown St. Pete lots', distance: '3-8 blocks', price: '$10-20', shadedSpots: true, covered: true, tip: 'Walk through downtown' },
        { name: 'Street parking', distance: 'Varies', price: 'Metered', shadedSpots: false, covered: false, tip: 'Limited availability' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 8 PM in most areas',
        tip: 'Some free residential areas nearby'
      },
      alternativeTransport: {
        publicTransit: ['PSTA bus routes', 'Central Avenue trolley'],
        rideShare: 'Designated pickup areas',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Rotunda Gate', location: '16th St S', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch' },
      { name: 'Home Plate Gate', location: '1st Ave S', bestFor: ['Behind home plate'], openTime: '90 minutes before first pitch' },
      { name: 'Outfield Gate', location: '4th St S', bestFor: ['Outfield sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Rays Team Store', exclusive: ['Unique Rays gear', 'Local Tampa Bay items'] },
        { location: 'Various kiosks' }
      ],
      firstAid: ['Section 115', 'Section 215'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'Rays_WiFi' },
      chargingStations: ['Various locations'],
      kidZones: [
        { name: 'Ray Tank', location: 'Center field', activities: ['Touch tank with rays'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in stadium lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive early for Ray Tank', description: 'Popular attraction for kids', category: 'family' },
        { title: 'Try Cuban sandwich', description: 'Tampa Bay specialty', category: 'food' },
        { title: 'Learn catwalk rules', description: 'Unique ground rules', category: 'experience' },
        { title: 'Enjoy climate control', description: 'Escape Florida heat/humidity', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Rays BP 2 hours before',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:40 PM Sundays',
        rushHours: ['5:00-6:30 PM on I-275 and I-4']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Downtown St. Petersburg',
      description: 'Revitalized downtown with arts district and waterfront',
      beforeGame: ['Central Avenue restaurants', 'The Dali Museum area', 'Vinoy Park'],
      afterGame: ['Beach Drive bars', 'Grand Central District', 'Baywalk'],
      radius: '1 mile'
    },
    
    transportation: {
      address: '1 Tropicana Drive, St. Petersburg, FL 33705',
      publicTransit: {
        bus: [{ routes: ['PSTA routes'], stops: ['Multiple downtown stops'] }]
      },
      driving: {
        majorRoutes: ['I-275 to I-375', 'US-19 to downtown', '4th St S'],
        typicalTraffic: 'Heavy on I-275 5-6:30 PM',
        bestApproach: 'I-375 from I-275, 4th St from north/south'
      },
      rideShare: {
        pickupZone: '16th St S',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to Central Ave for more options'
      }
    },
    
    history: {
      timeline: [
        { year: 1990, event: 'Tropicana Field opens (originally for hockey)' },
        { year: 1998, event: 'Tampa Bay Devil Rays begin play' },
        { year: 2008, event: 'World Series appearance' },
        { year: 2008, event: 'Renamed Tampa Bay Rays' }
      ],
      notableGames: [
        { date: '2008-10-19', description: 'ALCS Game 7 pennant clincher' },
        { date: '2011-09-28', description: 'Wild Card clincher' }
      ],
      traditions: [
        { name: 'Cowbell ringing', description: 'Fan noise tradition' },
        { name: 'Ray Tank visits', description: 'Touch tank experience' }
      ],
      retired: [
        { number: '12', player: 'Wade Boggs', year: 2016 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Smaller crowd but passionate, family-friendly environment',
      bestExperiences: [
        'Ray Tank interaction',
        'Climate-controlled comfort',
        'Unique catwalk system',
        'Intimate stadium feel'
      ],
      traditions: ['Cowbell ringing', 'Ray Tank visits', 'Unique ground rules'],
      music: 'Mix of classic rock and current hits',
      mascot: { name: 'Raymond', description: 'Furry blue mascot representing a ray' },
      fanGroups: [
        { name: 'Rays Republic', description: 'Die-hard fan organization' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Ray Tank is free and popular with kids',
        'Smaller venue means most seats are decent',
        'Climate control makes summer games comfortable',
        'Cuban sandwich is authentic Tampa fare',
        'Arrive early - limited parking'
      ],
      avoidThese: [
        'Driving without parking plan',
        'Expecting outdoor baseball atmosphere',
        'Rush hour on I-275',
        'Missing unique features like Ray Tank'
      ],
      hiddenGems: [
        'Ted Williams Museum displays',
        'Rotunda area activities',
        'Catwalk system viewing',
        'Downtown St. Pete walkability'
      ],
      photoSpots: [
        'With Raymond mascot',
        'Ray Tank area',
        'Rotunda entrance',
        'Catwalk system'
      ],
      bestValue: [
        'Upper Reserved sections',
        'Group packages',
        'Weekday games',
        'Climate-controlled comfort'
      ]
    }
  },

  'reds': {
    id: 'reds',
    name: 'Great American Ball Park',
    team: 'Cincinnati Reds',
    opened: 2003,
    capacity: 42319,
    
    overview: {
      description: 'Great American Ball Park sits along the Ohio River with views of Cincinnati\'s skyline and the John A. Roebling Suspension Bridge. Known for the Reds Hall of Fame, Cincinnati chili, and the steamboat-inspired design elements.',
      highlights: [
        'Ohio River and Cincinnati skyline views',
        'Reds Hall of Fame and Museum',
        'Steamboat-inspired architecture',
        'The Gap entrance with statues'
      ],
      uniqueFeatures: [
        'Power stacks resembling riverboat smokestacks',
        'The Gap entrance plaza',
        'Reds Hall of Fame and Museum',
        'Machine Room Grille restaurant',
        'Riverfront Stadium location'
      ],
      renovations: [
        { year: 2019, description: 'Scoreboard and video display upgrades' },
        { year: 2015, description: 'Concession and seating improvements' },
        { year: 2010, description: 'Hall of Fame expansion' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 126-142', 'Club Level 226-242', 'Upper deck 426-442'],
        afternoon: ['First base side sections 104-120', 'Pavilion Level 504-520', 'Diamond seats'],
        evening: ['Most infield sections after 6 PM', 'Club and suite levels']
      },
      coveredSeating: ['Diamond Club', 'Club Level overhangs', 'Some suite areas'],
      shadeTips: [
        'First base side gets afternoon shade',
        'Club Level provides good shade coverage',
        'Ohio River breeze can help with heat',
        'Upper deck overhangs protect some sections'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services', 'First Aid stations'],
        shadedConcourses: ['Main concourse', 'Club Level', 'Hall of Fame area'],
        indoorAreas: ['Reds Hall of Fame', 'Machine Room Grille', 'Team Store']
      },
      worstSunExposure: ['Right field Sun Deck', 'Left field sections 138-142', 'Some bleacher areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool spring weather', shadeTip: 'Mild sun, jacket recommended' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant temperatures', shadeTip: 'Shade starting to matter' },
        { month: 'June', avgTemp: 77, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm summer weather', shadeTip: 'First base side for afternoon' },
        { month: 'July', avgTemp: 81, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential for day games' },
        { month: 'August', avgTemp: 80, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Upper deck or shaded areas' },
        { month: 'September', avgTemp: 73, avgHumidity: 70, rainChance: 20, typicalConditions: 'Cooling temperatures', shadeTip: 'More comfortable conditions' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive dining', 'Premium bar', 'Field access'], access: 'Behind home plate' },
          { name: 'Club Level', perks: ['Padded seats', 'Better concessions', 'Shade coverage'], access: 'Mid-level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'River views']
        },
        specialAreas: [
          { name: 'Sun Deck', description: 'Right field party area', capacity: 300 },
          { name: 'Machine Room Grille', description: 'Restaurant with field views' }
        ]
      },
      budgetOptions: ['Pavilion Level 500s', 'View Level 400s', 'Standing room'],
      familySections: ['Family sections throughout pavilion'],
      standingRoom: ['Sun Deck', 'Concourse areas', 'The Gap'],
      partyAreas: [
        { name: 'Sun Deck', capacity: '300', amenities: ['Standing room', 'Bar service', 'Games'] }
      ],
      tips: [
        { section: 'Diamond Club', tip: 'Best amenities and climate control', category: 'experience' },
        { section: 'Sections 114-124', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Pavilion 518-530', tip: 'Good value with skyline views', category: 'value' },
        { section: 'Club Level 226-236', tip: 'Good shade and amenities', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Cincinnati chili (Skyline/Gold Star)', 'Graeter\'s ice cream', 'Montgomery Inn BBQ', 'Christian Moerlein beer'],
      local: ['Goetta', 'LaRosa\'s pizza', 'Queen City sausage', 'Grippo\'s chips'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie chili', 'Beyond burgers', 'Salads'],
      glutenFree: ['GF options available', 'Salads'],
      kidsFriendly: ['Kids meals', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Christian Moerlein', 'Rhinegeist', 'MadTree', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Christian Moerlein', 'Rhinegeist', 'MadTree', 'Fifty West']
      }
    },
    
    parking: {
      lots: [
        { name: 'Great American Ball Park Lots', distance: 'Adjacent', price: '$15-25', shadedSpots: false, covered: false, tip: 'Reserve online for best prices' },
        { name: 'Banks project lots', distance: '3-5 blocks', price: '$10-20', shadedSpots: true, covered: true, tip: 'Mixed-use development' },
        { name: 'Downtown Cincinnati lots', distance: '5-10 blocks', price: '$8-15', shadedSpots: true, covered: true, tip: 'Walk through downtown' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 9 PM most areas',
        tip: 'Limited near stadium'
      },
      alternativeTransport: {
        publicTransit: ['Metro bus routes', 'Cincinnati streetcar'],
        rideShare: 'Joe Nuxhall Way pickup area',
        bicycle: 'Bike racks throughout area'
      }
    },
    
    gates: [
      { name: 'The Gap', location: 'Joe Nuxhall Way', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: 'Home Plate Gate', location: 'Mehring Way', bestFor: ['Behind home plate'], openTime: '90 minutes before first pitch' },
      { name: 'Left Field Gate', location: 'Freedom Way', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Reds Team Shop', exclusive: ['Vintage Reds gear', 'Hall of Fame items'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 124', 'Section 224', 'Section 424'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'Reds_WiFi' },
      chargingStations: ['Club areas', 'Various locations'],
      kidZones: [
        { name: 'Kids Zone', location: 'Concourse area', activities: ['Play area', 'Interactive games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Visit Reds Hall of Fame', description: 'Great baseball history', category: 'experience' },
        { title: 'Try Cincinnati chili', description: 'Unique local specialty', category: 'food' },
        { title: 'Walk The Gap entrance', description: 'Impressive entrance with statues', category: 'experience' },
        { title: 'Enjoy river views', description: 'Ohio River and bridge views', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before (The Gap), 90 minutes (others)',
        battingPractice: 'Reds BP 2.5 hours before',
        firstPitch: '7:10 PM weekdays, 7:10 PM Saturdays, 1:10 PM Sundays',
        rushHours: ['4:30-6:30 PM on I-71 and I-75']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'The Banks/Downtown Cincinnati',
      description: 'Mixed-use development with restaurants and entertainment',
      beforeGame: ['The Banks restaurants', 'Moerlein Lager House', 'Holy Grail Tavern'],
      afterGame: ['Over-the-Rhine bars', 'Banks nightlife', 'Fountain Square'],
      radius: '0.5 miles'
    },
    
    transportation: {
      address: '100 Joe Nuxhall Way, Cincinnati, OH 45202',
      publicTransit: {
        bus: [{ routes: ['Metro bus routes'], stops: ['Downtown Cincinnati'] }]
      },
      driving: {
        majorRoutes: ['I-71 to 2nd St', 'I-75 to 5th St', 'I-471 from Kentucky'],
        typicalTraffic: 'Heavy 4:30-6:30 PM on all interstates',
        bestApproach: 'I-71 from north, I-471 from south'
      },
      rideShare: {
        pickupZone: 'Joe Nuxhall Way',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to The Banks for more options'
      }
    },
    
    history: {
      timeline: [
        { year: 2003, event: 'Great American Ball Park opens' },
        { year: 2010, event: 'Division championship' },
        { year: 2012, event: 'Wild Card appearance' }
      ],
      notableGames: [
        { date: '2010-10-06', description: 'Division clincher' },
        { date: '2012-10-09', description: 'Wild Card Game vs Giants' }
      ],
      traditions: [
        { name: 'Mr. Red and Rosie Red', description: 'Mascot duo' },
        { name: 'Cincinnati chili', description: 'Unique local food tradition' }
      ],
      retired: [
        { number: '1', player: 'Fred Hutchinson', year: 1965 },
        { number: '5', player: 'Johnny Bench', year: 1984 },
        { number: '8', player: 'Joe Morgan', year: 1998 },
        { number: '10', player: 'Sparky Anderson', year: 2005 },
        { number: '11', player: 'Barry Larkin', year: 2012 },
        { number: '13', player: 'Dave Concepcion', year: 2007 },
        { number: '14', player: 'Pete Rose', year: 2016 },
        { number: '18', player: 'Ted Kluszewski', year: 1998 },
        { number: '20', player: 'Frank Robinson', year: 1998 },
        { number: '24', player: 'Tony Perez', year: 2000 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Traditional baseball fans with Midwest friendliness',
      bestExperiences: [
        'Reds Hall of Fame visits',
        'Cincinnati chili tradition',
        'Ohio River views',
        'The Gap entrance experience'
      ],
      traditions: ['Cincinnati chili', 'Mr. Red and Rosie Red', 'Big Red Machine history'],
      music: 'Classic rock and country mix',
      mascot: { name: 'Mr. Red and Rosie Red', description: 'Longtime mascot duo' },
      fanGroups: [
        { name: 'Reds Country', description: 'General fan community' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Reds Hall of Fame worth the visit',
        'Cincinnati chili is acquired taste',
        'The Banks development great for dining',
        'River breeze can cool things down',
        'Club Level worth upgrade for shade'
      ],
      avoidThese: [
        'Driving during rush hour',
        'Sun Deck for day games - gets very hot',
        'Parking without research',
        'Missing Hall of Fame if you\'re a baseball fan'
      ],
      hiddenGems: [
        'Machine Room Grille restaurant',
        'Power stacks design details',
        'Ohio River walking paths',
        'The Banks development'
      ],
      photoSpots: [
        'With Mr. Red and Rosie Red',
        'The Gap entrance statues',
        'Ohio River and bridge views',
        'Power stacks architecture'
      ],
      bestValue: [
        'Pavilion Level with skyline views',
        'View Level corners',
        'The Banks dining specials',
        'Group packages'
      ]
    }
  },

  'rockies': {
    id: 'rockies',
    name: 'Coors Field',
    team: 'Colorado Rockies',
    opened: 1995,
    capacity: 50398,
    
    overview: {
      description: 'Coors Field sits exactly one mile above sea level in Denver\'s LoDo district, featuring spectacular Rocky Mountain views, the largest foul territory in MLB, and famous for home run-friendly conditions due to thin air.',
      highlights: [
        'One mile above sea level (5,280 feet)',
        'Rocky Mountain views beyond outfield',
        'Historic LoDo (Lower Downtown) location',
        'Largest foul territory in MLB'
      ],
      uniqueFeatures: [
        'Purple row of seats at exactly 5,280 feet',
        'Humidor for baseballs to reduce home runs',
        'Rooftop deck beyond right field',
        'Blue Moon Brewery at The Sandlot',
        'Mountain views from upper deck'
      ],
      renovations: [
        { year: 2013, description: 'Video board and sound system upgrades' },
        { year: 2012, description: 'Rooftop improvements' },
        { year: 2002, description: 'Humidor installation' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 140-158', 'Club Level 240-258', 'Upper deck 340-358'],
        afternoon: ['First base side sections 114-132', 'Infield Box 214-232', 'Upper Reserved 314-332'],
        evening: ['Most infield sections after 5 PM', 'Club and suite levels']
      },
      coveredSeating: ['Club Level overhangs', 'Some upper deck sections', 'Suite levels'],
      shadeTips: [
        'First base side gets afternoon shade',
        'High altitude means stronger UV rays',
        'Mountain breeze can provide relief',
        'Upper deck provides shade for lower sections'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services', 'First Aid stations'],
        shadedConcourses: ['Main concourse', 'Club Level', 'Rooftop areas'],
        indoorAreas: ['Team Store', 'Club areas', 'The Sandlot brewery']
      },
      worstSunExposure: ['Rockpile bleachers', 'Right field sections 160-164', 'Some rooftop areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 56, avgHumidity: 45, rainChance: 25, typicalConditions: 'Cool spring weather', shadeTip: 'Strong UV at altitude, sunscreen essential' },
        { month: 'May', avgTemp: 66, avgHumidity: 45, rainChance: 30, typicalConditions: 'Pleasant temperatures', shadeTip: 'UV rays stronger at altitude' },
        { month: 'June', avgTemp: 76, avgHumidity: 40, rainChance: 25, typicalConditions: 'Warm and dry', shadeTip: 'First base side for afternoon relief' },
        { month: 'July', avgTemp: 82, avgHumidity: 40, rainChance: 25, typicalConditions: 'Hot but dry', shadeTip: 'Shade essential, UV very strong' },
        { month: 'August', avgTemp: 80, avgHumidity: 40, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Mountain breeze helps but seek shade' },
        { month: 'September', avgTemp: 71, avgHumidity: 40, rainChance: 20, typicalConditions: 'Cooling temperatures', shadeTip: 'Still strong UV, shade recommended' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Club Level', perks: ['Padded seats', 'Premium concessions', 'Mountain views'], access: 'Mid-level' },
          { name: 'Dugout Box', perks: ['Close to field', 'Premium amenities'], access: 'Field level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Mountain views']
        },
        specialAreas: [
          { name: 'Rooftop', description: 'Right field party deck with mountain views', capacity: 2300 },
          { name: 'The Sandlot', description: 'Blue Moon Brewery inside stadium' }
        ]
      },
      budgetOptions: ['Rockpile bleachers', 'Upper Reserved 300s', 'Standing room'],
      familySections: ['Family sections throughout upper level'],
      standingRoom: ['Rooftop deck', 'Concourse areas', 'The Sandlot'],
      partyAreas: [
        { name: 'Rooftop', capacity: '2300', amenities: ['Standing room', 'Bar service', 'Mountain views', 'Games'] }
      ],
      tips: [
        { section: 'Club Level 244-254', tip: 'Great mountain views and shade', category: 'view' },
        { section: 'Sections 122-130', tip: 'Behind home plate, good views', category: 'view' },
        { section: 'Rooftop', tip: 'Fun party atmosphere with mountain views', category: 'experience' },
        { section: 'Rockpile', tip: 'Cheapest seats, fun crowd but full sun', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['Rocky Mountain Oysters', 'Biker Jim\'s gourmet hot dogs', 'Blue Moon beer', 'Denver green chili'],
      local: ['Colorado lamb', 'Bison burgers', 'Green chili on everything', 'Voodoo Doughnut'],
      healthy: ['Salads', 'Grilled options', 'Fresh mountain trout'],
      vegetarian: ['Beyond burgers', 'Veggie options', 'Salads'],
      glutenFree: ['GF options available', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Cotton candy', 'Ice cream'],
      alcohol: {
        beer: ['Blue Moon', 'Coors', 'Great Divide', 'Odell'],
        wine: true,
        cocktails: true,
        localBreweries: ['Blue Moon', 'Great Divide', 'Odell', 'Left Hand']
      }
    },
    
    parking: {
      lots: [
        { name: 'Coors Field Lots', distance: 'Adjacent', price: '$25-40', shadedSpots: false, covered: false, tip: 'Reserve online for better prices' },
        { name: 'LoDo lots', distance: '2-6 blocks', price: '$15-30', shadedSpots: true, covered: true, tip: 'Walk through historic district' },
        { name: 'Downtown Denver lots', distance: '5-10 blocks', price: '$10-20', shadedSpots: true, covered: true, tip: 'Cheaper option' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 10 PM most areas',
        tip: 'Limited near stadium, better farther out'
      },
      alternativeTransport: {
        publicTransit: ['Light Rail to Union Station then walk', 'RTD bus routes'],
        rideShare: '20th St pickup area',
        bicycle: 'B-cycle stations throughout LoDo'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: '20th & Blake', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: 'Right Field Gate', location: '20th & Wynkoop', bestFor: ['Rooftop', 'Right field'], openTime: '2 hours before first pitch' },
      { name: 'Left Field Gate', location: 'Park Ave', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Rockies Dugout Store', exclusive: ['Colorado-themed gear', 'Mountain merchandise'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 130', 'Section 230', 'Section 330'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse', 'LoDo area'],
      wifi: { available: true, network: 'Rockies_WiFi' },
      chargingStations: ['Club areas', 'Various locations'],
      kidZones: [
        { name: 'Kids Area', location: 'Concourse level', activities: ['Play area', 'Games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Use extra sunscreen', description: 'UV rays stronger at altitude', category: 'weather' },
        { title: 'Visit The Sandlot', description: 'Blue Moon brewery inside', category: 'experience' },
        { title: 'Check out Rooftop', description: 'Great mountain views and party atmosphere', category: 'experience' },
        { title: 'Explore LoDo', description: 'Historic downtown district', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: 'Rockies BP 2.5 hours before',
        firstPitch: '6:40 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        rushHours: ['4:30-6:30 PM on I-25 and I-70']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'LoDo (Lower Downtown)',
      description: 'Historic warehouse district with restaurants and nightlife',
      beforeGame: ['Falling Rock Tap House', 'Great Divide Brewing', 'Union Station'],
      afterGame: ['LoDo bars', 'RiNo district', 'Larimer Square'],
      radius: '0.5 miles'
    },
    
    transportation: {
      address: '2001 Blake Street, Denver, CO 80205',
      publicTransit: {
        train: [{ lines: ['Light Rail'], station: 'Union Station', walkTime: '15 minutes' }],
        bus: [{ routes: ['RTD bus routes'], stops: ['Downtown Denver'] }]
      },
      driving: {
        majorRoutes: ['I-25 to 23rd Ave', 'I-70 to Brighton Blvd', 'Speer Blvd to downtown'],
        typicalTraffic: 'Heavy 4:30-6:30 PM on I-25',
        bestApproach: 'I-25 from south, I-70 from east/west'
      },
      rideShare: {
        pickupZone: '20th St & Wynkoop',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to Union Station for more options'
      }
    },
    
    history: {
      timeline: [
        { year: 1995, event: 'Coors Field opens' },
        { year: 2007, event: 'World Series appearance' },
        { year: 2009, event: 'Wild Card playoff' }
      ],
      notableGames: [
        { date: '2007-10-01', description: 'Wild Card playoff win' },
        { date: '2007-10-21', description: 'World Series Game 1' }
      ],
      traditions: [
        { name: 'Dinger mascot', description: 'Purple triceratops mascot' },
        { name: 'Purple row', description: 'Seats at exactly 5,280 feet' }
      ],
      retired: [
        { number: '17', player: 'Todd Helton', year: 2014 },
        { number: '33', player: 'Larry Walker', year: 2022 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Casual, family-friendly with mountain outdoor culture',
      bestExperiences: [
        'Rocky Mountain views',
        'Rooftop party deck',
        'Blue Moon brewery',
        'LoDo district exploration'
      ],
      traditions: ['Purple row tradition', 'Dinger entertainment', 'Mile-high baseball'],
      music: 'Country and classic rock mix',
      mascot: { name: 'Dinger', description: 'Purple triceratops mascot since 1994' },
      fanGroups: [
        { name: 'Rockies fans', description: 'Casual mountain community' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Extra sunscreen essential at altitude',
        'Rooftop has best mountain views',
        'The Sandlot brewery worth visiting',
        'LoDo great for pre-game dining',
        'Purple row seats are Instagram-worthy'
      ],
      avoidThese: [
        'Forgetting sunscreen - UV very strong',
        'Rockpile for day games - full sun',
        'Driving during rush hour',
        'Missing mountain views from upper deck'
      ],
      hiddenGems: [
        'Blue Moon brewery tours',
        'Purple row photo opportunities',
        'Mountain views from concourse',
        'LoDo historic architecture'
      ],
      photoSpots: [
        'Purple row seats',
        'With Dinger mascot',
        'Mountain views from upper deck',
        'LoDo historic buildings'
      ],
      bestValue: [
        'Upper Reserved with mountain views',
        'Rockpile if you can handle sun',
        'Light rail vs parking',
        'LoDo happy hour specials'
      ]
    }
  }
,

  'royals': {
    id: 'royals',
    name: 'Kauffman Stadium',
    team: 'Kansas City Royals',
    opened: 1973,
    capacity: 37903,
    
    overview: {
      description: 'Kauffman Stadium features the iconic crown-shaped scoreboard and the largest privately funded fountain display in the world. Known for excellent sight lines, wide foul territory, and Kansas City barbecue throughout the concourses.',
      highlights: [
        'Crown-shaped HD scoreboard',
        'World\'s largest privately funded fountains',
        'Excellent sight lines from all seats',
        'Wide foul territory gives pitchers advantage'
      ],
      uniqueFeatures: [
        'Spectacular fountain display in outfield',
        'Crown scoreboard with 84-foot HD screen',
        'Outfield experience with kids activities',
        'Craft & Draft restaurant in left field',
        'Rivals Sports Bar behind home plate'
      ],
      renovations: [
        { year: 2012, description: 'Major renovation completed - $250 million' },
        { year: 2009, description: 'Crown scoreboard installation' },
        { year: 2004, description: 'Concourse and seating improvements' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 216-240', 'Club Level 316-340', 'Upper deck 416-440'],
        afternoon: ['First base side sections 204-228', 'Dugout Box 126-140', 'View Level 424-440'],
        evening: ['Most infield sections after 6 PM', 'Club and suite levels']
      },
      coveredSeating: ['Some Club Level overhangs', 'Suite levels', 'Limited upper deck coverage'],
      shadeTips: [
        'First base side gets afternoon shade',
        'Upper deck provides some shade for lower sections',
        'Hot and humid summers require shade planning',
        'Evening games more comfortable'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services', 'First Aid stations'],
        shadedConcourses: ['Main concourse', 'Club Level', 'Outfield areas'],
        indoorAreas: ['Team Store', 'Rivals Sports Bar', 'Craft & Draft']
      },
      worstSunExposure: ['Outfield Box sections', 'General Admission outfield', 'Some bleacher areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 59, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool spring weather', shadeTip: 'Light sun, jacket recommended' },
        { month: 'May', avgTemp: 69, avgHumidity: 70, rainChance: 35, typicalConditions: 'Pleasant temperatures', shadeTip: 'Shade becoming important' },
        { month: 'June', avgTemp: 78, avgHumidity: 75, rainChance: 30, typicalConditions: 'Getting warm and humid', shadeTip: 'First base side for afternoon relief' },
        { month: 'July', avgTemp: 83, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential for day games' },
        { month: 'August', avgTemp: 82, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Upper deck or shaded areas recommended' },
        { month: 'September', avgTemp: 74, avgHumidity: 70, rainChance: 25, typicalConditions: 'Cooling temperatures', shadeTip: 'More comfortable conditions' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Crown Club', perks: ['All-inclusive dining', 'Premium bar', 'Climate control'], access: 'Behind home plate' },
          { name: 'Club Level', perks: ['Padded seats', 'Better concessions', 'Some shade coverage'], access: 'Mid-level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Fountain views']
        },
        specialAreas: [
          { name: 'Outfield Experience', description: 'Kids play area beyond outfield', capacity: 200 },
          { name: 'Craft & Draft', description: 'Left field restaurant and bar' }
        ]
      },
      budgetOptions: ['View Level 400s', 'General Admission outfield', 'Bleachers'],
      familySections: ['Family sections throughout View Level'],
      standingRoom: ['Outfield Experience', 'Concourse areas', 'Craft & Draft'],
      partyAreas: [
        { name: 'Outfield Experience', capacity: '200', amenities: ['Kids activities', 'Games', 'Standing room'] }
      ],
      tips: [
        { section: 'Crown Club', tip: 'Best amenities and air conditioning', category: 'experience' },
        { section: 'Sections 214-226', tip: 'Great views behind home plate', category: 'view' },
        { section: 'View Level 424-436', tip: 'Good value with fountain views', category: 'value' },
        { section: 'Club Level 324-336', tip: 'Decent shade coverage', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Kansas City barbecue', 'Burnt ends', 'Joe\'s Kansas City BBQ', 'Boulevard beer'],
      local: ['LC\'s Bar-B-Q', 'Stroud\'s chicken', 'Winstead\'s burgers', 'Kansas City strip steak'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Salads', 'Veggie options'],
      glutenFree: ['GF options available', 'Salads'],
      kidsFriendly: ['Kids meals', 'Cotton candy', 'Ice cream'],
      alcohol: {
        beer: ['Boulevard', 'KC Bier Co.', 'Crane Brewing', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Boulevard', 'KC Bier Co.', 'Crane', 'Rock & Run']
      }
    },
    
    parking: {
      lots: [
        { name: 'Kauffman Stadium Lots', distance: 'Adjacent', price: '$20-30', shadedSpots: false, covered: false, tip: 'Arrive early for closer spots' },
        { name: 'Truman Sports Complex lots', distance: '5-10 min walk', price: '$15-25', shadedSpots: false, covered: false, tip: 'Shared with Chiefs' },
        { name: 'Overflow lots', distance: '10-15 min walk', price: '$10-15', shadedSpots: false, covered: false, tip: 'Shuttle service available' }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking in area',
        tip: 'Must use stadium lots'
      },
      alternativeTransport: {
        publicTransit: ['Limited bus service', 'Game day shuttles from downtown'],
        rideShare: 'Designated pickup/drop-off areas',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'Main entrance', bestFor: ['Behind home plate'], openTime: '90 minutes before first pitch' },
      { name: 'Outfield Gate', location: 'Right field', bestFor: ['Outfield sections', 'Kids areas'], openTime: '90 minutes before first pitch' },
      { name: 'Left Field Gate', location: 'Left field', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Royals Hall of Fame Store', exclusive: ['Championship gear', 'Vintage Royals items'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 215', 'Section 315', 'Section 415'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'Royals_WiFi' },
      chargingStations: ['Club areas', 'Various locations'],
      kidZones: [
        { name: 'Outfield Experience', location: 'Beyond outfield', activities: ['Play area', 'Speed pitch', 'Interactive games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive early for fountains', description: 'Watch pre-game fountain show', category: 'experience' },
        { title: 'Try KC barbecue', description: 'World-famous Kansas City BBQ', category: 'food' },
        { title: 'Visit Outfield Experience', description: 'Great for kids and families', category: 'family' },
        { title: 'Watch for Crown scoreboard', description: 'Unique design and features', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Royals BP 2 hours before',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:15 PM Sundays',
        rushHours: ['5:00-6:30 PM on I-70 and I-435']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Truman Sports Complex',
      description: 'Sports complex shared with Kansas City Chiefs',
      beforeGame: ['Complex restaurants', 'Tailgating areas'],
      afterGame: ['Power & Light District downtown', 'Westport entertainment'],
      radius: '5 miles to downtown'
    },
    
    transportation: {
      address: '1 Royal Way, Kansas City, MO 64129',
      publicTransit: {
        bus: [{ routes: ['Limited service'], stops: ['Game day shuttles'] }]
      },
      driving: {
        majorRoutes: ['I-70 to Blue Ridge Cutoff', 'I-435 to I-70', 'US-40 to complex'],
        typicalTraffic: 'Heavy 5-6:30 PM on I-70',
        bestApproach: 'I-70 from east/west, I-435 from north/south'
      },
      rideShare: {
        pickupZone: 'Designated areas in lots',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Pre-arrange pickup times'
      }
    },
    
    history: {
      timeline: [
        { year: 1973, event: 'Kauffman Stadium opens (originally Royals Stadium)' },
        { year: 1985, event: 'World Series championship' },
        { year: 2015, event: 'World Series championship' },
        { year: 1993, event: 'Renamed Kauffman Stadium' }
      ],
      notableGames: [
        { date: '1985-10-27', description: 'World Series Game 7 victory' },
        { date: '2015-11-01', description: 'World Series Game 5 victory' }
      ],
      traditions: [
        { name: 'Fountain displays', description: 'Synchronized fountain shows' },
        { name: 'Crown vision', description: 'Crown-shaped scoreboard' }
      ],
      retired: [
        { number: '5', player: 'George Brett', year: 1994 },
        { number: '10', player: 'Dick Howser', year: 1987 },
        { number: '20', player: 'Frank White', year: 1995 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Midwest friendly, loyal fanbase despite smaller market',
      bestExperiences: [
        'Fountain displays and shows',
        'Kansas City barbecue',
        'Crown scoreboard features',
        'Family-friendly atmosphere'
      ],
      traditions: ['Fountain shows', 'Take Me Out to the Ballgame', 'George Brett legacy'],
      music: 'Country and classic rock mix',
      mascot: { name: 'Sluggerrr', description: 'Lion mascot since 1996' },
      fanGroups: [
        { name: 'Royals Review', description: 'Fan community and blog' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Fountain show happens before games',
        'Joe\'s Kansas City BBQ is authentic',
        'Outfield Experience great for kids',
        'Crown Club worth splurge for comfort',
        'Plan extra time for parking and walking'
      ],
      avoidThese: [
        'Driving without parking plan',
        'Missing fountain display',
        'Outfield seats for day games - very hot',
        'Rush hour on I-70'
      ],
      hiddenGems: [
        'Royals Hall of Fame displays',
        'Craft & Draft restaurant',
        'Crown scoreboard features',
        'Best BBQ in baseball'
      ],
      photoSpots: [
        'With Sluggerrr mascot',
        'Fountain displays',
        'Crown scoreboard',
        'George Brett statue'
      ],
      bestValue: [
        'View Level with fountain views',
        'General Admission outfield',
        'Group packages',
        'Season ticket plans'
      ]
    }
  },

  'tigers': {
    id: 'tigers',
    name: 'Comerica Park',
    team: 'Detroit Tigers',
    opened: 2000,
    capacity: 41083,
    
    overview: {
      description: 'Comerica Park in downtown Detroit features distinctive tiger statues, a Ferris wheel beyond left field, and excellent views of the Detroit skyline. Known for Coney dogs, the carousel, and unique architectural features celebrating Detroit\'s automotive heritage.',
      highlights: [
        'Tiger statues throughout the ballpark',
        'Ferris wheel beyond left field',
        'Downtown Detroit skyline views',
        'Comerica Park Carousel for kids'
      ],
      uniqueFeatures: [
        'Two 15-foot tiger statues at main gate',
        'Ferris wheel and carousel beyond outfield',
        'General Motors Fountain',
        'Walk of Fame brick path',
        'Automotive heritage design elements'
      ],
      renovations: [
        { year: 2019, description: 'Video board and sound system upgrades' },
        { year: 2015, description: 'Concession and seating improvements' },
        { year: 2011, description: 'Left field dimension changes' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 126-142', 'Club Level 226-242', 'Upper Reserved 326-342'],
        afternoon: ['First base side sections 104-120', 'Lower Box 114-130', 'Pavilion 424-440'],
        evening: ['Most infield sections after 6 PM', 'Club and suite levels']
      },
      coveredSeating: ['Club Level overhangs', 'Some Upper Reserved sections', 'Suite levels'],
      shadeTips: [
        'First base side gets afternoon shade',
        'Club Level provides good shade coverage',
        'Upper deck overhangs protect some sections',
        'Evening games more comfortable'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services', 'First Aid stations'],
        shadedConcourses: ['Main concourse', 'Club Level', 'Upper concourse'],
        indoorAreas: ['Team Store', 'Club areas', 'Restaurants']
      },
      worstSunExposure: ['Right field sections 138-146', 'Bleachers', 'Some outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool spring weather', shadeTip: 'Light sun, warm layers recommended' },
        { month: 'May', avgTemp: 66, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant temperatures', shadeTip: 'Shade starting to matter' },
        { month: 'June', avgTemp: 75, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm summer weather', shadeTip: 'First base side for afternoon games' },
        { month: 'July', avgTemp: 80, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential for day games' },
        { month: 'August', avgTemp: 78, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Upper deck or shaded areas' },
        { month: 'September', avgTemp: 71, avgHumidity: 70, rainChance: 25, typicalConditions: 'Cooling temperatures', shadeTip: 'More comfortable conditions' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Tiger Club', perks: ['All-inclusive dining', 'Premium bar', 'Climate control'], access: 'Behind home plate' },
          { name: 'Club Level', perks: ['Padded seats', 'Better concessions', 'Shade coverage'], access: 'Mid-level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Skyline views']
        },
        specialAreas: [
          { name: 'Pepsi Porch', description: 'Right field deck area', capacity: 200 },
          { name: 'Kaline Corner', description: 'Left field area honoring Al Kaline' }
        ]
      },
      budgetOptions: ['Pavilion 400s', 'Upper Reserved 300s', 'Bleachers'],
      familySections: ['Family sections throughout upper levels'],
      standingRoom: ['Concourse areas', 'Pepsi Porch'],
      partyAreas: [
        { name: 'Pepsi Porch', capacity: '200', amenities: ['Standing room', 'Bar service', 'Group options'] }
      ],
      tips: [
        { section: 'Tiger Club', tip: 'Best amenities and air conditioning', category: 'experience' },
        { section: 'Sections 120-132', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Pavilion 420-436', tip: 'Good value with skyline views', category: 'value' },
        { section: 'Club Level 230-242', tip: 'Good shade and amenities', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Coney dogs (American and Chili)', 'Little Caesars pizza', 'Faygo pop', 'Vernors ginger ale'],
      local: ['Polish boy sandwich', 'Detroit-style pizza', 'Better Made chips', 'Sanders hot fudge'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie dogs', 'Beyond burgers', 'Salads'],
      glutenFree: ['GF options available', 'Salads'],
      kidsFriendly: ['Kids meals', 'Cotton candy', 'Ice cream'],
      alcohol: {
        beer: ['Bell\'s', 'Founders', 'Budweiser', 'Local craft options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Bell\'s', 'Founders', 'Atwater', 'Detroit Beer Co.']
      }
    },
    
    parking: {
      lots: [
        { name: 'Comerica Park Lots', distance: 'Adjacent', price: '$20-35', shadedSpots: false, covered: false, tip: 'Reserve online for better prices' },
        { name: 'Downtown Detroit lots', distance: '2-6 blocks', price: '$10-20', shadedSpots: true, covered: true, tip: 'Walk through downtown' },
        { name: 'Casino lots', distance: '3-4 blocks', price: '$15-25', shadedSpots: true, covered: true, tip: 'MotorCity and MGM Grand' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 8 PM most areas',
        tip: 'Limited near stadium'
      },
      alternativeTransport: {
        publicTransit: ['QLine streetcar', 'DDOT bus routes', 'SMART bus'],
        rideShare: 'Designated pickup areas on Brush St',
        bicycle: 'MoGo bike share stations'
      }
    },
    
    gates: [
      { name: 'Tiger Gate', location: 'Adams St', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch' },
      { name: 'Kaline Gate', location: 'Montcalm St', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' },
      { name: 'Witherell Gate', location: 'Witherell St', bestFor: ['Right field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Detroit Athletic Co. Team Store', exclusive: ['Vintage Tigers gear', 'Detroit-themed items'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 120', 'Section 220', 'Section 320'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'Tigers_WiFi' },
      chargingStations: ['Club areas', 'Various locations'],
      kidZones: [
        { name: 'Comerica Park Carousel', location: 'Beyond center field', activities: ['Carousel rides', 'Play area'] },
        { name: 'Ferris wheel', location: 'Left field area', activities: ['Ferris wheel rides'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Ride the Ferris wheel', description: 'Great views of city and ballpark', category: 'experience' },
        { title: 'Try authentic Coney dog', description: 'Detroit specialty', category: 'food' },
        { title: 'Visit carousel area', description: 'Great for kids and families', category: 'family' },
        { title: 'Walk downtown', description: 'Revitalized downtown area', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Tigers BP 2 hours before',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        rushHours: ['4:30-6:30 PM on I-75 and I-94']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Downtown Detroit',
      description: 'Revitalized downtown with sports district',
      beforeGame: ['Greektown restaurants', 'Campus Martius area', 'Detroit riverfront'],
      afterGame: ['Greektown Casino', 'Corktown bars', 'Riverfront dining'],
      radius: '0.5 miles'
    },
    
    transportation: {
      address: '2100 Woodward Avenue, Detroit, MI 48201',
      publicTransit: {
        train: [{ lines: ['QLine Streetcar'], station: 'Grand Circus Park', walkTime: '8 minutes' }],
        bus: [{ routes: ['DDOT and SMART routes'], stops: ['Downtown Detroit'] }]
      },
      driving: {
        majorRoutes: ['I-75 to Adams St', 'I-94 to I-375', 'Lodge Freeway to downtown'],
        typicalTraffic: 'Heavy 4:30-6:30 PM on all freeways',
        bestApproach: 'I-75 from north/south, I-94 from east/west'
      },
      rideShare: {
        pickupZone: 'Brush St designated areas',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to Greektown for more options'
      }
    },
    
    history: {
      timeline: [
        { year: 2000, event: 'Comerica Park opens' },
        { year: 2006, event: 'World Series appearance' },
        { year: 2012, event: 'World Series appearance' }
      ],
      notableGames: [
        { date: '2006-10-24', description: 'World Series Game 1' },
        { date: '2012-10-27', description: 'World Series Game 3' }
      ],
      traditions: [
        { name: 'Tiger statues', description: 'Iconic tiger statues at entrance' },
        { name: 'Ferris wheel and carousel', description: 'Unique family attractions' }
      ],
      retired: [
        { number: '1', player: 'Ty Cobb', year: 1999 },
        { number: '2', player: 'Charlie Gehringer', year: 1983 },
        { number: '3', player: 'Alan Trammell', year: 2018 },
        { number: '5', player: 'Hank Greenberg', year: 1983 },
        { number: '6', player: 'Al Kaline', year: 1980 },
        { number: '11', player: 'Sparky Anderson', year: 2011 },
        { number: '16', player: 'Hal Newhouser', year: 1997 },
        { number: '23', player: 'Willie Horton', year: 2000 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Loyal Detroit fanbase, blue-collar mentality',
      bestExperiences: [
        'Ferris wheel and carousel rides',
        'Authentic Coney dogs',
        'Tiger statues photo ops',
        'Downtown Detroit revitalization'
      ],
      traditions: ['Tiger statues', 'Ferris wheel tradition', 'Detroit rock music'],
      music: 'Classic rock and Motown mix',
      mascot: { name: 'Paws', description: 'Tiger mascot since 1995' },
      fanGroups: [
        { name: 'Bless You Boys', description: 'Fan community' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Ferris wheel offers great views',
        'Coney dogs are Detroit tradition',
        'Carousel popular with kids',
        'QLine streetcar convenient',
        'Downtown Detroit walkable from park'
      ],
      avoidThese: [
        'Driving without parking plan',
        'Missing Ferris wheel experience',
        'Rush hour on freeways',
        'Bleachers for day games - very hot'
      ],
      hiddenGems: [
        'Walk of Fame bricks',
        'General Motors Fountain',
        'Al Kaline Corner displays',
        'Downtown riverfront views'
      ],
      photoSpots: [
        'With tiger statues at entrance',
        'Ferris wheel with city skyline',
        'With Paws mascot',
        'Carousel area'
      ],
      bestValue: [
        'Pavilion Level with skyline views',
        'Upper Reserved corners',
        'Group packages for families',
        'QLine vs driving and parking'
      ]
    }
  },

  'twins': {
    id: 'twins',
    name: 'Target Field',
    team: 'Minnesota Twins',
    opened: 2010,
    capacity: 38649,
    
    overview: {
      description: 'Target Field in downtown Minneapolis features limestone facade, excellent views of the Minneapolis skyline, and is known for surviving Minnesota winters outdoors after decades in the Metrodome. Famous for Jucy Lucy burgers and craft beer selections.',
      highlights: [
        'Limestone facade reflecting Minnesota heritage',
        'Downtown Minneapolis skyline views',
        'Open-air baseball after Metrodome era',
        'Gold Glove Bar in right field'
      ],
      uniqueFeatures: [
        'Limestone and granite construction',
        'Right field overhang and Gold Glove Bar',
        'Target Plaza beyond left field',
        'Minnesota-themed concessions throughout',
        'Climate considerations for northern location'
      ],
      renovations: [
        { year: 2019, description: 'Concession and seating improvements' },
        { year: 2016, description: 'Video board upgrades' },
        { year: 2014, description: 'Right field bar expansion' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 120-138', 'Club Level 220-238', 'Upper deck 320-338'],
        afternoon: ['First base side sections 102-118', 'Lower Reserved 202-218', 'Terrace Level 302-318'],
        evening: ['Most infield sections after 6 PM', 'Club and suite levels']
      },
      coveredSeating: ['Some Club Level overhangs', 'Suite levels', 'Gold Glove Bar area'],
      shadeTips: [
        'First base side gets afternoon shade',
        'Upper deck provides shade for lower sections',
        'Northern location means different sun angles',
        'Evening games can get cool'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services', 'First Aid stations'],
        shadedConcourses: ['Main concourse', 'Club Level', 'Target Plaza'],
        indoorAreas: ['Team Store', 'Gold Glove Bar', 'Club areas']
      },
      worstSunExposure: ['Left field sections 134-140', 'Some bleacher areas', 'Target Plaza'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 54, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool spring weather', shadeTip: 'Mild sun, warm layers essential' },
        { month: 'May', avgTemp: 65, avgHumidity: 60, rainChance: 30, typicalConditions: 'Pleasant temperatures', shadeTip: 'Shade starting to matter' },
        { month: 'June', avgTemp: 74, avgHumidity: 65, rainChance: 30, typicalConditions: 'Warm summer weather', shadeTip: 'First base side for afternoon games' },
        { month: 'July', avgTemp: 79, avgHumidity: 70, rainChance: 25, typicalConditions: 'Peak summer warmth', shadeTip: 'Shade recommended for day games' },
        { month: 'August', avgTemp: 77, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm but comfortable', shadeTip: 'Generally pleasant conditions' },
        { month: 'September', avgTemp: 68, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling temperatures', shadeTip: 'Very comfortable, light layers' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Delta Sky360° Club', perks: ['All-inclusive dining', 'Premium bar', 'Climate control'], access: 'Behind home plate' },
          { name: 'Club Level', perks: ['Padded seats', 'Better concessions', 'Some weather protection'], access: 'Mid-level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Skyline views']
        },
        specialAreas: [
          { name: 'Gold Glove Bar', description: 'Right field bar and standing area', capacity: 300 },
          { name: 'Target Plaza', description: 'Left field plaza with activities' }
        ]
      },
      budgetOptions: ['Terrace Level 300s', 'Upper Reserved', 'Bleachers'],
      familySections: ['Family sections throughout upper levels'],
      standingRoom: ['Gold Glove Bar', 'Target Plaza', 'Concourse areas'],
      partyAreas: [
        { name: 'Gold Glove Bar', capacity: '300', amenities: ['Standing room', 'Full bar', 'Field views'] }
      ],
      tips: [
        { section: 'Delta Sky360° Club', tip: 'Best amenities and climate control', category: 'experience' },
        { section: 'Sections 108-118', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Terrace Level 308-322', tip: 'Good value with skyline views', category: 'value' },
        { section: 'Gold Glove Bar', tip: 'Fun atmosphere but standing room only', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: ['Jucy Lucy burgers', 'Kramarczuk\'s bratwurst', 'Sweet Martha\'s cookies', 'Grain Belt beer'],
      local: ['Walleye sandwich', 'Mini donuts', 'Lefse', 'Wild rice soup'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Beyond options', 'Salads'],
      glutenFree: ['GF options available', 'Salads'],
      kidsFriendly: ['Kids meals', 'Mini donuts', 'Cotton candy'],
      alcohol: {
        beer: ['Grain Belt', 'Summit', 'Surly', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Summit', 'Surly', 'Indeed', 'Fulton']
      }
    },
    
    parking: {
      lots: [
        { name: 'Target Field Lots A-E', distance: 'Adjacent', price: '$25-40', shadedSpots: false, covered: false, tip: 'Reserve online for better rates' },
        { name: 'Downtown Minneapolis lots', distance: '2-8 blocks', price: '$15-25', shadedSpots: true, covered: true, tip: 'Walk through downtown' },
        { name: 'Ramps and garages', distance: '3-6 blocks', price: '$20-30', shadedSpots: true, covered: true, tip: 'Weather protection' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 10 PM most areas',
        tip: 'Limited near stadium'
      },
      alternativeTransport: {
        publicTransit: ['Metro Light Rail Blue and Green Lines', 'Metro buses'],
        rideShare: 'Designated areas on 5th St',
        bicycle: 'Nice Ride bike share stations'
      }
    },
    
    gates: [
      { name: 'Gate 14 (Home Plate)', location: '7th St', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch' },
      { name: 'Gate 34 (Left Field)', location: 'Target Plaza', bestFor: ['Left field sections'], openTime: '2 hours before first pitch' },
      { name: 'Gate 29 (Right Field)', location: '6th St', bestFor: ['Right field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Twins Pro Shop', exclusive: ['Minnesota-themed gear', 'Vintage Twins items'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 114', 'Section 214', 'Section 314'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'Twins_WiFi' },
      chargingStations: ['Club areas', 'Various locations'],
      kidZones: [
        { name: 'Twins Kids Zone', location: 'Target Plaza', activities: ['Play area', 'Games', 'Activities'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Take Light Rail', description: 'Convenient and avoids parking', category: 'arrival' },
        { title: 'Try Jucy Lucy', description: 'Minnesota\'s famous burger', category: 'food' },
        { title: 'Visit Target Plaza', description: 'Great for families before games', category: 'family' },
        { title: 'Dress for weather', description: 'Minnesota weather can change quickly', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch (2 hours Target Plaza)',
        battingPractice: 'Twins BP 2 hours before',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        rushHours: ['4:30-6:30 PM on I-35W and I-94']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Downtown Minneapolis',
      description: 'Vibrant downtown with skyways and entertainment',
      beforeGame: ['Mill District restaurants', 'Target Center area', 'Mississippi riverfront'],
      afterGame: ['First Avenue music venues', 'Warehouse District', 'Mill City Museum area'],
      radius: '0.5 miles'
    },
    
    transportation: {
      address: '1 Twins Way, Minneapolis, MN 55403',
      publicTransit: {
        train: [
          { lines: ['Blue Line'], station: 'Target Field', walkTime: '2 minutes' },
          { lines: ['Green Line'], station: 'Target Field', walkTime: '2 minutes' }
        ],
        bus: [{ routes: ['Multiple Metro routes'], stops: ['Downtown Minneapolis'] }]
      },
      driving: {
        majorRoutes: ['I-35W to downtown', 'I-94 to 7th St', 'Highway 55 to downtown'],
        typicalTraffic: 'Heavy 4:30-6:30 PM on all routes',
        bestApproach: 'I-35W from south, I-94 from east/west'
      },
      rideShare: {
        pickupZone: '5th St N designated areas',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Light Rail much cheaper and faster'
      }
    },
    
    history: {
      timeline: [
        { year: 2010, event: 'Target Field opens' },
        { year: 1987, event: 'World Series championship (at Metrodome)' },
        { year: 1991, event: 'World Series championship (at Metrodome)' }
      ],
      notableGames: [
        { date: '2010-04-12', description: 'First game at Target Field' },
        { date: '2019-10-07', description: 'AL Division Series Game 3' }
      ],
      traditions: [
        { name: 'TC Bear', description: 'Beloved mascot' },
        { name: 'Minnesota nice', description: 'Friendly fan culture' }
      ],
      retired: [
        { number: '3', player: 'Harmon Killebrew', year: 1975 },
        { number: '6', player: 'Tony Oliva', year: 1991 },
        { number: '7', player: 'Joe Mauer', year: 2019 },
        { number: '14', player: 'Kent Hrbek', year: 1995 },
        { number: '29', player: 'Rod Carew', year: 1987 },
        { number: '34', player: 'Kirby Puckett', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Minnesota nice - friendly, family-oriented fanbase',
      bestExperiences: [
        'Open-air baseball after Metrodome',
        'Jucy Lucy tradition',
        'Downtown Minneapolis setting',
        'Light Rail convenience'
      ],
      traditions: ['Minnesota nice culture', 'Jucy Lucy burgers', 'TC Bear entertainment'],
      music: 'Mix of classic rock and Minnesota artists',
      mascot: { name: 'TC Bear', description: 'Bear mascot representing Twin Cities' },
      fanGroups: [
        { name: 'Twins Territory', description: 'Fan community' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Light Rail directly to stadium entrance',
        'Jucy Lucy is must-try Minnesota food',
        'Target Plaza great for kids',
        'Gold Glove Bar has best beer selection',
        'Downtown skyways connect in winter'
      ],
      avoidThese: [
        'Driving when Light Rail available',
        'Underdressing for weather changes',
        'Missing Target Plaza activities',
        'Rush hour traffic on freeways'
      ],
      hiddenGems: [
        'Limestone facade details',
        'Minnesota-themed art throughout',
        'Mill City Museum nearby',
        'Mississippi riverfront walks'
      ],
      photoSpots: [
        'With TC Bear mascot',
        'Minneapolis skyline from upper deck',
        'Target Plaza entrance',
        'Limestone facade architecture'
      ],
      bestValue: [
        'Terrace Level with skyline views',
        'Light Rail vs parking costs',
        'Group packages',
        'Minnesota nice pricing'
      ]
    }
  },

  'whitesox': {
    id: 'whitesox',
    name: 'Guaranteed Rate Field',
    team: 'Chicago White Sox',
    opened: 1991,
    capacity: 40615,
    
    overview: {
      description: 'Guaranteed Rate Field on Chicago\'s South Side features distinctive architecture with arched design elements, the FUNdamentals Deck for kids, and is known for Polish sausage, Italian beef, and passionate South Side fan culture.',
      highlights: [
        'South Side Chicago location and culture',
        'Distinctive arched architecture',
        'FUNdamentals Deck interactive area',
        'Scout Seats behind home plate'
      ],
      uniqueFeatures: [
        'Exploding scoreboard in center field',
        'FUNdamentals Deck with kids activities',
        'Scout Seats with unique perspective',
        'South Side food specialties',
        'Chicago skyline views from upper deck'
      ],
      renovations: [
        { year: 2016, description: 'FUNdamentals Deck addition' },
        { year: 2018, description: 'Concession and facility upgrades' },
        { year: 2020, description: 'Video board enhancements' }
      ],
      previousNames: ['Comiskey Park (1991-2003)', 'U.S. Cellular Field (2003-2016)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 148-166', 'Upper deck 518-536', 'Club Level 248-266'],
        afternoon: ['First base side sections 126-144', 'Lower Box 226-244', 'Upper deck 502-520'],
        evening: ['Most infield sections after 6 PM', 'Club and suite levels']
      },
      coveredSeating: ['Some Club Level areas', 'Suite levels', 'Limited upper deck overhangs'],
      shadeTips: [
        'First base side gets afternoon shade',
        'Upper deck provides some shade for lower sections',
        'Hot and humid Chicago summers require planning',
        'Evening games more comfortable'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services', 'First Aid stations'],
        shadedConcourses: ['Main concourse', 'Club Level', 'Upper concourse'],
        indoorAreas: ['Team Store', 'Club areas', 'FUNdamentals Deck indoor areas']
      },
      worstSunExposure: ['Right field sections 160-168', 'Some bleacher areas', 'FUNdamentals Deck'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 56, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool spring weather', shadeTip: 'Light sun, jacket recommended' },
        { month: 'May', avgTemp: 67, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant temperatures', shadeTip: 'Shade starting to matter' },
        { month: 'June', avgTemp: 76, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm summer weather', shadeTip: 'First base side for afternoon relief' },
        { month: 'July', avgTemp: 81, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential for day games' },
        { month: 'August', avgTemp: 79, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Upper deck or shaded areas' },
        { month: 'September', avgTemp: 72, avgHumidity: 70, rainChance: 25, typicalConditions: 'Cooling temperatures', shadeTip: 'More comfortable conditions' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Stadium Club', perks: ['All-inclusive dining', 'Premium bar', 'Climate control'], access: 'Behind home plate upper level' },
          { name: 'Scout Seats', perks: ['Field level behind plate', 'Unique perspective', 'Premium amenities'], access: 'Field level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'City views']
        },
        specialAreas: [
          { name: 'FUNdamentals Deck', description: 'Kids interactive area in center field', capacity: 150 },
          { name: 'Craft Kave', description: 'Craft beer bar area' }
        ]
      },
      budgetOptions: ['Upper deck 500s', 'Outfield sections', 'SRO areas'],
      familySections: ['Family sections throughout upper deck'],
      standingRoom: ['FUNdamentals Deck', 'Concourse areas', 'Craft Kave'],
      partyAreas: [
        { name: 'FUNdamentals Deck', capacity: '150', amenities: ['Kids activities', 'Games', 'Standing room', 'Food'] }
      ],
      tips: [
        { section: 'Scout Seats', tip: 'Unique field-level perspective', category: 'experience' },
        { section: 'Sections 132-140', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Upper deck 512-528', tip: 'Good value with skyline views', category: 'value' },
        { section: 'Stadium Club', tip: 'Best amenities and climate control', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: ['Polish sausage', 'Chicago-style Italian beef', 'Chicago-style hot dogs', 'Old Style beer'],
      local: ['Garrett Popcorn', 'Deep dish pizza slices', 'Chicago mix popcorn', 'Vienna Beef hot dogs'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie dogs', 'Beyond burgers', 'Salads'],
      glutenFree: ['GF options available', 'Salads'],
      kidsFriendly: ['Kids meals', 'Cotton candy', 'Ice cream'],
      alcohol: {
        beer: ['Old Style', 'Goose Island', 'Revolution', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Goose Island', 'Revolution', 'Half Acre', 'Lagunitas']
      }
    },
    
    parking: {
      lots: [
        { name: 'Guaranteed Rate Field Lots', distance: 'Adjacent', price: '$25-40', shadedSpots: false, covered: false, tip: 'Reserve online for better rates' },
        { name: 'Bridgeport area lots', distance: '3-8 blocks', price: '$15-25', shadedSpots: false, covered: false, tip: 'Walk through neighborhood' },
        { name: 'IIT campus lots', distance: '5-10 blocks', price: '$10-20', shadedSpots: false, covered: false, tip: 'Cheaper option' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Permit parking in most residential areas',
        tip: 'Limited and challenging'
      },
      alternativeTransport: {
        publicTransit: ['Red Line to Sox-35th', 'CTA bus routes'],
        rideShare: 'Designated areas on 35th St',
        bicycle: 'Divvy bike share stations'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: '35th & Shields', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch' },
      { name: 'Center Field Gate', location: 'FUNdamentals area', bestFor: ['Kids activities'], openTime: '2 hours before first pitch' },
      { name: 'Left Field Gate', location: 'Dan Ryan side', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'White Sox Team Shop', exclusive: ['South Side gear', 'Vintage White Sox items'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 137', 'Section 237', 'Section 537'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'WhiteSox_WiFi' },
      chargingStations: ['Club areas', 'Various locations'],
      kidZones: [
        { name: 'FUNdamentals Deck', location: 'Center field', activities: ['Speed pitch', 'Interactive games', 'Play area'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Take Red Line', description: 'Direct to Sox-35th station', category: 'arrival' },
        { title: 'Try Italian beef', description: 'Chicago specialty', category: 'food' },
        { title: 'Visit FUNdamentals Deck', description: 'Great for kids', category: 'family' },
        { title: 'Experience South Side culture', description: 'Authentic Chicago neighborhood', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch (2 hours FUNdamentals)',
        battingPractice: 'White Sox BP 2 hours before',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        rushHours: ['4:30-6:30 PM on Dan Ryan Expressway']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Bridgeport/South Side',
      description: 'Historic working-class Chicago neighborhood',
      beforeGame: ['Bridgeport restaurants', 'South Side taverns', 'Chinatown nearby'],
      afterGame: ['South Side bars', 'Chinatown dining', 'Bridgeport pubs'],
      radius: '1 mile'
    },
    
    transportation: {
      address: '333 West 35th Street, Chicago, IL 60616',
      publicTransit: {
        subway: [{ lines: ['Red Line'], station: 'Sox-35th', walkTime: '3 minutes' }],
        bus: [{ routes: ['CTA bus routes'], stops: ['35th Street'] }]
      },
      driving: {
        majorRoutes: ['Dan Ryan Expressway (I-90/94)', 'I-55 to 35th St', 'Lake Shore Drive'],
        typicalTraffic: 'Heavy 4:30-6:30 PM on Dan Ryan',
        bestApproach: 'Dan Ryan from north/south, I-55 from southwest'
      },
      rideShare: {
        pickupZone: '35th St designated areas',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Red Line much more reliable'
      }
    },
    
    history: {
      timeline: [
        { year: 1991, event: 'New Comiskey Park opens' },
        { year: 2005, event: 'World Series championship' },
        { year: 2016, event: 'Renamed Guaranteed Rate Field' }
      ],
      notableGames: [
        { date: '2005-10-26', description: 'World Series Game 4 clincher' },
        { date: '1991-04-18', description: 'First game at new park' }
      ],
      traditions: [
        { name: 'Exploding scoreboard', description: 'Fireworks after home runs' },
        { name: 'South Side pride', description: 'Working-class fan culture' }
      ],
      retired: [
        { number: '2', player: 'Nellie Fox', year: 1976 },
        { number: '3', player: 'Harold Baines', year: 2019 },
        { number: '4', player: 'Luke Appling', year: 1975 },
        { number: '9', player: 'Minnie Minoso', year: 1983 },
        { number: '11', player: 'Luis Aparicio', year: 1984 },
        { number: '14', player: 'Paul Konerko', year: 2016 },
        { number: '16', player: 'Ted Lyons', year: 1987 },
        { number: '19', player: 'Billy Pierce', year: 1987 },
        { number: '72', player: 'Carlton Fisk', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Passionate South Side fans, working-class pride',
      bestExperiences: [
        'South Side Chicago culture',
        'Exploding scoreboard fireworks',
        'Italian beef and polish sausage',
        'FUNdamentals Deck for families'
      ],
      traditions: ['Exploding scoreboard', 'South Side pride', 'Na na na na, hey hey hey, goodbye'],
      music: 'Chicago blues and classic rock',
      mascot: { name: 'Southpaw', description: 'Green mascot since 1996' },
      fanGroups: [
        { name: 'South Side Sox fans', description: 'Passionate neighborhood supporters' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Red Line drops you right at stadium',
        'Italian beef is Chicago essential',
        'FUNdamentals Deck great for kids',
        'Scout Seats offer unique perspective',
        'Exploding scoreboard is iconic'
      ],
      avoidThese: [
        'Driving during rush hour on Dan Ryan',
        'Parking without research',
        'Missing South Side food specialties',
        'Underestimating neighborhood character'
      ],
      hiddenGems: [
        'Craft Kave beer selection',
        'Upper deck Chicago skyline views',
        'South Side neighborhood exploration',
        'Historic Bridgeport area'
      ],
      photoSpots: [
        'With Southpaw mascot',
        'Exploding scoreboard',
        'Chicago skyline from upper deck',
        'South Side street art'
      ],
      bestValue: [
        'Upper deck with skyline views',
        'Red Line vs driving costs',
        'Group packages',
        'South Side authentic experience'
      ]
    }
  },

  'guardians': {
    id: 'guardians',
    name: 'Progressive Field',
    team: 'Cleveland Guardians',
    opened: 1994,
    capacity: 34788,
    
    overview: {
      description: 'Progressive Field in downtown Cleveland features asymmetrical outfield dimensions, the distinctive left field wall, and views of Lake Erie and downtown Cleveland. Known for mustard on everything, the Slider mascot, and passionate Cleveland fans.',
      highlights: [
        'Downtown Cleveland location',
        '19-foot left field wall',
        'Lake Erie and city skyline views',
        'Intimate ballpark atmosphere'
      ],
      uniqueFeatures: [
        'Mini Green Monster 19-foot left field wall',
        'Heritage Park beyond center field',
        'Kids Clubhouse interactive area',
        'Terrace Club restaurant',
        'Cleveland-themed concessions throughout'
      ],
      renovations: [
        { year: 2015, description: 'Major concourse and seating renovations' },
        { year: 2019, description: 'Video board and technology upgrades' },
        { year: 2012, description: 'Outfield and kids area improvements' }
      ],
      previousNames: ['Jacobs Field (1994-2008)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side 154-172', 'Club Level 254-272', 'Upper Reserved 454-472'],
        afternoon: ['First base side sections 126-144', 'Lower Box 226-244', 'Terrace 426-444'],
        evening: ['Most infield sections after 6 PM', 'Club and suite levels']
      },
      coveredSeating: ['Club Level overhangs', 'Some upper reserved sections', 'Suite levels'],
      shadeTips: [
        'First base side gets afternoon shade',
        'Upper deck provides shade for lower sections',
        'Lake breeze can provide cooling',
        'Intimate size means good views everywhere'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services', 'First Aid stations'],
        shadedConcourses: ['Main concourse', 'Club Level', 'Heritage Park'],
        indoorAreas: ['Team Store', 'Terrace Club', 'Kids Clubhouse']
      },
      worstSunExposure: ['Right field sections 168-176', 'Some bleacher areas', 'Heritage Park'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool spring weather', shadeTip: 'Light sun, warm layers recommended' },
        { month: 'May', avgTemp: 65, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant temperatures', shadeTip: 'Shade starting to matter' },
        { month: 'June', avgTemp: 74, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm summer weather', shadeTip: 'First base side for afternoon relief' },
        { month: 'July', avgTemp: 78, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer warmth', shadeTip: 'Shade recommended for day games' },
        { month: 'August', avgTemp: 77, avgHumidity: 75, rainChance: 25, typicalConditions: 'Warm and humid', shadeTip: 'Lake breeze helps but seek shade' },
        { month: 'September', avgTemp: 70, avgHumidity: 70, rainChance: 25, typicalConditions: 'Cooling temperatures', shadeTip: 'Generally comfortable conditions' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Terrace Club', perks: ['All-inclusive dining', 'Premium bar', 'Climate control', 'Field views'], access: 'Upper level behind plate' },
          { name: 'Club Level', perks: ['Padded seats', 'Better concessions', 'Some weather protection'], access: 'Mid-level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Lake and city views']
        },
        specialAreas: [
          { name: 'Heritage Park', description: 'Beyond center field with activities', capacity: 200 },
          { name: 'Kids Clubhouse', description: 'Interactive kids area' }
        ]
      },
      budgetOptions: ['Upper Reserved 400s', 'Bleachers', 'Standing room'],
      familySections: ['Family sections throughout upper reserved'],
      standingRoom: ['Heritage Park', 'Concourse areas', 'District areas'],
      partyAreas: [
        { name: 'Heritage Park', capacity: '200', amenities: ['Standing room', 'Activities', 'Food options'] }
      ],
      tips: [
        { section: 'Terrace Club', tip: 'Best amenities and all-inclusive experience', category: 'experience' },
        { section: 'Sections 136-148', tip: 'Great views behind home plate', category: 'view' },
        { section: 'Upper Reserved 440-456', tip: 'Good value with city views', category: 'value' },
        { section: 'Left field sections', tip: 'Watch for balls off the 19-foot wall', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: ['Stadium mustard on everything', 'Polish boys', 'Bertman Ball Park Mustard', 'Great Lakes beer'],
      local: ['Pierogi', 'Kielbasa', 'Cleveland corned beef', 'Malley\'s chocolate'],
      healthy: ['Salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie dogs', 'Beyond burgers', 'Salads'],
      glutenFree: ['GF options available', 'Salads'],
      kidsFriendly: ['Kids meals', 'Cotton candy', 'Ice cream'],
      alcohol: {
        beer: ['Great Lakes', 'Fat Heads', 'Platform', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Great Lakes', 'Fat Heads', 'Platform', 'Market Garden']
      }
    },
    
    parking: {
      lots: [
        { name: 'Progressive Field Lots', distance: 'Adjacent', price: '$20-35', shadedSpots: false, covered: false, tip: 'Reserve online for better rates' },
        { name: 'Downtown Cleveland lots', distance: '2-6 blocks', price: '$10-20', shadedSpots: true, covered: true, tip: 'Walk through downtown' },
        { name: 'Flats area lots', distance: '5-8 blocks', price: '$8-15', shadedSpots: false, covered: false, tip: 'Cheaper option' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 8 PM most areas',
        tip: 'Limited but some options downtown'
      },
      alternativeTransport: {
        publicTransit: ['RTA Rapid Transit Red Line', 'RTA bus routes'],
        rideShare: 'Designated areas on Carnegie Ave',
        bicycle: 'UHBikes bike share stations'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'Ontario St', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch' },
      { name: 'Heritage Park Gate', location: 'Center field', bestFor: ['Kids activities'], openTime: '2 hours before first pitch' },
      { name: 'Left Field Gate', location: 'Carnegie Ave', bestFor: ['Left field sections'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Shop', exclusive: ['Guardians rebrand gear', 'Cleveland-themed items'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 140', 'Section 240', 'Section 440'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services areas'],
      atms: ['All gate areas', 'Main concourse'],
      wifi: { available: true, network: 'Guardians_WiFi' },
      chargingStations: ['Club areas', 'Various locations'],
      kidZones: [
        { name: 'Kids Clubhouse', location: 'Upper concourse', activities: ['Interactive games', 'Play area', 'Educational activities'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Try stadium mustard', description: 'Cleveland\'s famous Bertman mustard', category: 'food' },
        { title: 'Visit Heritage Park', description: 'Great for families', category: 'family' },
        { title: 'Watch left field wall', description: '19-foot wall creates unique plays', category: 'experience' },
        { title: 'Explore downtown', description: 'Walkable downtown area', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch (2 hours Heritage Park)',
        battingPractice: 'Guardians BP 2 hours before',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        rushHours: ['4:30-6:30 PM on I-90 and I-71']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Downtown Cleveland',
      description: 'Revitalized downtown with dining and entertainment',
      beforeGame: ['East 4th Street restaurants', 'Gateway District', 'Playhouse Square'],
      afterGame: ['Flats East Bank', 'West Side Market area', 'Ohio City'],
      radius: '0.5 miles'
    },
    
    transportation: {
      address: '2401 Ontario Street, Cleveland, OH 44115',
      publicTransit: {
        train: [{ lines: ['RTA Red Line'], station: 'Tower City', walkTime: '8 minutes' }],
        bus: [{ routes: ['RTA bus routes'], stops: ['Downtown Cleveland'] }]
      },
      driving: {
        majorRoutes: ['I-90 to Carnegie Ave', 'I-71 to downtown', 'I-77 to downtown'],
        typicalTraffic: 'Heavy 4:30-6:30 PM on all interstates',
        bestApproach: 'I-90 from east/west, I-71 from south'
      },
      rideShare: {
        pickupZone: 'Carnegie Ave designated areas',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to East 4th Street for dining'
      }
    },
    
    history: {
      timeline: [
        { year: 1994, event: 'Jacobs Field opens' },
        { year: 1995, event: 'World Series appearance' },
        { year: 1997, event: 'World Series appearance' },
        { year: 2008, event: 'Renamed Progressive Field' },
        { year: 2021, event: 'Team renamed Cleveland Guardians' }
      ],
      notableGames: [
        { date: '1995-10-17', description: 'World Series Game 1' },
        { date: '1997-10-26', description: 'World Series Game 7' }
      ],
      traditions: [
        { name: 'Stadium mustard', description: 'Bertman Ball Park Mustard tradition' },
        { name: 'Guardians name change', description: 'New era beginning in 2021' }
      ],
      retired: [
        { number: '3', player: 'Earl Averill', year: 1975 },
        { number: '5', player: 'Lou Boudreau', year: 1970 },
        { number: '14', player: 'Larry Doby', year: 1994 },
        { number: '18', player: 'Mel Harder', year: 1957 },
        { number: '19', player: 'Bob Feller', year: 1957 },
        { number: '21', player: 'Bob Lemon', year: 1998 },
        { number: '455', player: 'The Fans', year: 1994 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Passionate Cleveland fans, loyal despite heartbreak',
      bestExperiences: [
        'Stadium mustard tradition',
        'Left field wall unique plays',
        'Downtown Cleveland revitalization',
        'Heritage Park family activities'
      ],
      traditions: ['Stadium mustard', 'Cleveland pride', 'Guardians new era'],
      music: 'Rock and classic Cleveland songs',
      mascot: { name: 'Slider', description: 'Fuzzy mascot since 1990' },
      fanGroups: [
        { name: 'Guardians faithful', description: 'Loyal Cleveland supporters' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Stadium mustard is Cleveland essential',
        'Heritage Park great for kids',
        'Left field wall creates unique plays',
        'Downtown walkable from stadium',
        'Terrace Club worth the splurge'
      ],
      avoidThese: [
        'Driving during rush hour',
        'Missing mustard experience',
        'Parking without research',
        'Underestimating Cleveland food scene'
      ],
      hiddenGems: [
        'Kids Clubhouse interactive features',
        'Lake Erie views from upper deck',
        'East 4th Street dining',
        'Cleveland cultural attractions nearby'
      ],
      photoSpots: [
        'With Slider mascot',
        'Left field wall',
        'Downtown Cleveland skyline',
        'Heritage Park activities'
      ],
      bestValue: [
        'Upper Reserved with city views',
        'Rapid Transit vs parking',
        'Group packages',
        'Cleveland authentic experience'
      ]
    }
  }
};