import { StadiumGuide } from '../stadiumGuides';

export const mlbStadiumGuides4: Record<string, StadiumGuide> = {
  'dodgers': {
    id: 'dodgers',
    name: 'Dodger Stadium',
    team: 'Los Angeles Dodgers',
    opened: 1962,
    capacity: 56000,
    
    overview: {
      description: 'Dodger Stadium, the third-oldest ballpark in MLB, sits nestled in Chavez Ravine with stunning views of downtown LA and the San Gabriel Mountains. The largest stadium by capacity in MLB, it\'s known for Dodger Dogs, perfect weather, and a classic mid-century modern design.',
      highlights: [
        'Largest MLB stadium by capacity',
        'Third-oldest ballpark in MLB',
        'Stunning views of downtown LA and mountains',
        'Classic mid-century modern architecture'
      ],
      uniqueFeatures: [
        'Vin Scully Press Box',
        'All You Can Eat Pavilion',
        'Stadium Club restaurant',
        'Think Blue BBQ in outfield',
        'Jackie Robinson statue'
      ],
      renovations: [
        { year: 2020, description: 'New center field plaza and elevators' },
        { year: 2019, description: 'Centerfield Plaza renovation' },
        { year: 2013, description: '$100 million renovation project' }
      ],
      previousNames: []
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Reserve Level 1-20', 'Top Deck sections', 'Loge Level behind plate'],
        afternoon: ['Third base side Reserve', 'Top Deck 1-11', 'Club Level'],
        evening: ['Most sections after 4 PM', 'First base side gains shade', 'Infield Reserve']
      },
      coveredSeating: ['Club Level under overhang', 'Stadium Club', 'Top Deck back rows'],
      shadeTips: [
        'Third base side best for afternoon games',
        'Reserve Level provides shade for Loge below',
        'Pavilion sections get full sun until evening',
        'Top Deck offers best shade value'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourse levels', 'Stadium Club'],
        indoorAreas: ['Stadium Club', 'Baseline Club', 'Team Stores']
      },
      worstSunExposure: ['Pavilion 301-315', 'Field Level outfield', 'Loge Level 160-170'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 60, rainChance: 10, typicalConditions: 'Perfect weather', shadeTip: 'Mild sun, any seat comfortable' },
        { month: 'May', avgTemp: 70, avgHumidity: 65, rainChance: 5, typicalConditions: 'Marine layer mornings', shadeTip: 'Afternoon shade helpful' },
        { month: 'June', avgTemp: 74, avgHumidity: 65, rainChance: 2, typicalConditions: 'June gloom early', shadeTip: 'Upper levels for shade' },
        { month: 'July', avgTemp: 79, avgHumidity: 60, rainChance: 1, typicalConditions: 'Warm and sunny', shadeTip: 'Shade essential for day games' },
        { month: 'August', avgTemp: 80, avgHumidity: 60, rainChance: 1, typicalConditions: 'Peak heat', shadeTip: 'Third base side or upper deck' },
        { month: 'September', avgTemp: 78, avgHumidity: 60, rainChance: 3, typicalConditions: 'Still warm', shadeTip: 'Evening games ideal' },
        { month: 'October', avgTemp: 74, avgHumidity: 60, rainChance: 5, typicalConditions: 'Perfect playoff weather', shadeTip: 'Comfortable everywhere' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Dugout Club', perks: ['All-inclusive dining', 'Field access', 'VIP parking'], access: 'Behind home plate' },
          { name: 'Stadium Club', perks: ['Restaurant access', 'Private bar', 'AC'], access: 'Club Level' },
          { name: 'Baseline Club', perks: ['Buffet dining', 'Private entrance'], access: 'Field Level baseline' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Boxes'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'All You Can Eat Pavilion', description: 'Right field unlimited food', capacity: 2500 },
          { name: 'Think Blue BBQ', description: 'Left field BBQ area', capacity: 200 }
        ]
      },
      budgetOptions: ['Top Deck', 'Reserve Level outfield', 'Pavilion sections'],
      familySections: ['Reserve Level 50-55'],
      standingRoom: ['Top Deck standing areas', 'Pavilion standing'],
      partyAreas: [
        { name: 'Think Blue BBQ', capacity: '200', amenities: ['BBQ buffet', 'Picnic tables', 'Bar'] },
        { name: 'Coca-Cola All You Can Eat', capacity: '2500', amenities: ['Unlimited Dodger Dogs', 'Nachos', 'Soda'] }
      ],
      tips: [
        { section: 'Top Deck 1-6', tip: 'Best shade and value combo', category: 'value' },
        { section: 'Dugout Club', tip: 'Ultimate VIP experience', category: 'experience' },
        { section: 'Reserve 1-20', tip: 'Great views with shade', category: 'shade' },
        { section: 'Pavilion 301-315', tip: 'Party atmosphere but hot', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: ['Dodger Dog', 'Super Dodger Dog', 'Garlic fries', 'Micheladas'],
      local: ['Philippe\'s French Dip', 'King\'s Hawaiian', 'CPK Pizza', 'Wetzel\'s Pretzels'],
      healthy: ['Veggie dogs', 'Salads', 'Fresh fruit', 'Poke bowls'],
      vegetarian: ['Beyond Dodger Dog', 'Veggie nachos', 'Caprese sandwiches'],
      glutenFree: ['GF Dodger Dogs', 'GF beer'],
      kidsFriendly: ['Mini Dodger Dogs', 'Pizza', 'Ice cream helmets'],
      alcohol: {
        beer: ['Modelo', 'Budweiser', 'Golden Road', 'Stella Artois'],
        wine: true,
        cocktails: true,
        localBreweries: ['Golden Road', 'Angel City', 'Three Weavers']
      }
    },
    
    parking: {
      lots: [
        { name: 'Preferred Lots A-K', distance: 'Adjacent', price: '$35-50', shadedSpots: false, covered: false, tip: 'Prepay online to save time' },
        { name: 'General Lots L-P', distance: '10 min walk', price: '$25', shadedSpots: false, covered: false, tip: 'Enter via Academy Road' },
        { name: 'Off-site Lots', distance: '15-20 min', price: '$10-20', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['Dodger Stadium Express from Union Station', 'Harbor Gateway Transit Center shuttle'],
        rideShare: 'Sunset Gate designated zones',
        bicycle: 'Limited bike valet on weekends'
      }
    },
    
    gates: [
      { name: 'Auto Gates A-P', location: 'Various parking lots', bestFor: ['Respective lot sections'], openTime: '2 hours before first pitch' },
      { name: 'Sunset Gate', location: 'Sunset Blvd', bestFor: ['Walk-ups', 'Ride share'], openTime: '90 minutes before first pitch' },
      { name: 'Downtown Gate', location: 'Downtown side', bestFor: ['Field Level'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Top of the Park Store', exclusive: ['Vintage items', 'Custom jerseys'] },
        { location: 'Multiple locations throughout' }
      ],
      firstAid: ['Field Level', 'Loge Level', 'Reserve Level', 'Top Deck'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Relations Field Level'],
      atms: ['All levels near concessions'],
      wifi: { available: true, network: 'DodgerStadium_WiFi' },
      chargingStations: ['Club Level', 'Stadium Club'],
      kidZones: [
        { name: 'Kids\' Clubhouse', location: 'Field Level', activities: ['Photo ops', 'Games on weekends'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['New elevators installed 2020']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: 'All lots have ADA spaces near elevators'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive Early', description: 'Traffic and parking take time', category: 'arrival' },
        { title: 'Try a Dodger Dog', description: 'Classic stadium food since 1962', category: 'food' },
        { title: 'Stay for fireworks', description: 'Friday night fireworks shows', category: 'experience' },
        { title: 'Take Stadium Express', description: 'Free shuttle from Union Station', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: 'Dodgers BP 2.5 hours before',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        rushHours: ['5:00-7:00 PM on surrounding roads']
      },
      security: {
        allowedBags: 'Soft bags under 12"x12"x6"',
        prohibitedItems: ['Hard coolers', 'Glass', 'Cans', 'Weapons', 'Beach balls'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Chavez Ravine/Echo Park',
      description: 'Hilltop location with limited immediate options',
      beforeGame: ['Short Stop bar', 'Sunset Beer Company', 'Echo Park restaurants'],
      afterGame: ['Downtown LA bars', 'Chinatown', 'Little Tokyo'],
      radius: '2-3 miles to neighborhoods'
    },
    
    transportation: {
      address: '1000 Vin Scully Ave, Los Angeles, CA 90012',
      publicTransit: {
        bus: [{ routes: ['Dodger Stadium Express'], stops: ['Union Station', 'Harbor Gateway Transit Center'] }]
      },
      driving: {
        majorRoutes: ['US-101 to Stadium Way', 'I-110 to Academy Road', 'I-5 to Stadium Way'],
        typicalTraffic: 'Heavy 1 hour before and after games',
        bestApproach: 'Academy Road from 110 usually faster'
      },
      rideShare: {
        pickupZone: 'Sunset Gate area',
        dropoffZone: 'Sunset Gate',
        surgePricing: '3-5x after games',
        alternativeTip: 'Walk down to Sunset Blvd for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 1962, event: 'Stadium opens' },
        { year: 1963, event: 'First World Series at Dodger Stadium' },
        { year: 1980, event: 'All-Star Game hosted' },
        { year: 1988, event: 'Kirk Gibson World Series homer' },
        { year: 2020, event: 'World Series Championship' }
      ],
      notableGames: [
        { date: '1988-10-15', description: 'Kirk Gibson\'s legendary World Series homer' },
        { date: '1963-10-06', description: 'Sandy Koufax World Series Game 1' },
        { date: '2020-10-27', description: 'World Series clincher vs Rays' }
      ],
      traditions: [
        { name: 'Nancy Bea Hefley organ', description: 'Classic organ music' },
        { name: 'Beach balls', description: 'Fan tradition (now discouraged)' },
        { name: 'Randy Newman song', description: '"I Love LA" after wins' }
      ],
      retired: [
        { number: '1', player: 'Pee Wee Reese', year: 1984 },
        { number: '2', player: 'Tommy Lasorda', year: 1997 },
        { number: '4', player: 'Duke Snider', year: 1980 },
        { number: '19', player: 'Jim Gilliam', year: 1978 },
        { number: '20', player: 'Don Sutton', year: 1998 },
        { number: '24', player: 'Walter Alston', year: 1977 },
        { number: '32', player: 'Sandy Koufax', year: 1972 },
        { number: '39', player: 'Roy Campanella', year: 1972 },
        { number: '42', player: 'Jackie Robinson', year: 1972 },
        { number: '53', player: 'Don Drysdale', year: 1984 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Laid-back LA vibe, arrives late and leaves early stereotype',
      bestExperiences: [
        'Sunset views from Top Deck',
        'Dodger Dog tradition',
        'Friday night fireworks',
        'Pavilion party atmosphere'
      ],
      traditions: ['Beach balls', 'Wave', 'Randy Newman celebration song'],
      music: 'Classic organ plus modern hits',
      mascot: { name: 'Los Doyers', description: 'No official mascot' },
      fanGroups: [
        { name: 'Pantone 294', section: 'Various', description: 'Traveling superfan group' },
        { name: 'Left Field Pavilion crew', section: '301-315', description: 'Rowdy bleacher fans' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Stadium Express free from Union Station',
        'Philippe\'s pregame for French Dip',
        'Top Deck has best sunset views',
        'Download MLB Ballpark app for mobile ordering',
        'Academy Road entrance usually faster'
      ],
      avoidThese: [
        'Driving if possible - parking is nightmare',
        'Pavilion seats for day games',
        'Leaving early - traffic worse right after game',
        'Beach balls - security confiscates them'
      ],
      hiddenGems: [
        'Think Blue BBQ area',
        'Top of the Park store best selection',
        'Reserve Level 1 best shade/view combo',
        'Baseline Club buffet'
      ],
      photoSpots: [
        'Top Deck with downtown skyline',
        'Jackie Robinson statue',
        'Center field plaza',
        'Overlooking field from Top of Park'
      ],
      bestValue: [
        'Top Deck seats under $25',
        'All You Can Eat Pavilion',
        'Stadium Express saves parking fees',
        'Tuesday promotions'
      ]
    }
  },

  'giants': {
    id: 'giants',
    name: 'Oracle Park',
    team: 'San Francisco Giants',
    opened: 2000,
    capacity: 41915,
    
    overview: {
      description: 'Oracle Park sits on the San Francisco Bay waterfront with stunning views and the famous McCovey Cove beyond right field. Known for its quirky dimensions, spectacular setting, and gourmet food options, it\'s consistently rated as one of baseball\'s best venues.',
      highlights: [
        'McCovey Cove - kayakers catch home run balls',
        'Stunning bay and bridge views',
        'Coca-Cola bottle and old-fashioned glove in left field',
        'Gourmet food capital of MLB'
      ],
      uniqueFeatures: [
        'McCovey Cove splash hits',
        'Cable car in center field',
        'Coca-Cola Fan Lot playground',
        'Garden in center field',
        'Portwalk behind right field'
      ],
      renovations: [
        { year: 2020, description: 'Oracle naming rights' },
        { year: 2019, description: 'New video board and sound system' },
        { year: 2016, description: 'Center field renovations' }
      ],
      previousNames: ['Pacific Bell Park', 'SBC Park', 'AT&T Park']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['View Level 301-310', 'Club Level behind plate'],
        afternoon: ['Third base side View Level', 'Sections 301-334', 'Club Level'],
        evening: ['Most sections after 4 PM', 'First base side gains shade']
      },
      coveredSeating: ['Club Level', 'View Box sections', 'Suite Level'],
      shadeTips: [
        'Afternoon wind and fog provide natural cooling',
        'Third base/left field best for shade',
        'Bleachers get full sun but cooled by bay breeze',
        'Bring layers - temperature drops quickly'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['Club Level', 'Suite Level'],
        indoorAreas: ['Virgin Club House', 'Team Store', '@Cafe']
      },
      worstSunExposure: ['Bleachers 136-152', 'Arcade sections', 'Lower Box right field'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 70, rainChance: 15, typicalConditions: 'Cool and windy', shadeTip: 'Dress warm, sun not intense' },
        { month: 'May', avgTemp: 62, avgHumidity: 70, rainChance: 8, typicalConditions: 'Still cool, some fog', shadeTip: 'Layers essential' },
        { month: 'June', avgTemp: 64, avgHumidity: 70, rainChance: 3, typicalConditions: 'June gloom fog', shadeTip: 'Fog provides natural shade' },
        { month: 'July', avgTemp: 65, avgHumidity: 75, rainChance: 1, typicalConditions: 'Foggy and cool', shadeTip: 'Surprisingly comfortable' },
        { month: 'August', avgTemp: 66, avgHumidity: 75, rainChance: 1, typicalConditions: 'Fog and wind', shadeTip: 'Can be cold despite summer' },
        { month: 'September', avgTemp: 68, avgHumidity: 70, rainChance: 3, typicalConditions: 'Warmest month', shadeTip: 'Actually need shade in Sept' },
        { month: 'October', avgTemp: 65, avgHumidity: 70, rainChance: 10, typicalConditions: 'Indian summer', shadeTip: 'Best weather of year' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Virgin Club House', perks: ['All-inclusive food/drinks', 'Private entrance', 'Field access'], access: 'Behind home plate' },
          { name: 'Alaska Airlines Club Level', perks: ['Indoor/outdoor seating', 'Premium dining'], access: 'Club Level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Heaters']
        },
        specialAreas: [
          { name: 'Arcade Pavilion', description: 'Right field standing room', capacity: 500 },
          { name: 'Garden Table', description: 'Center field dining', capacity: 40 }
        ]
      },
      budgetOptions: ['View Level', 'Bleachers', 'Standing room'],
      familySections: ['Coca-Cola Fan Lot'],
      standingRoom: ['Arcade behind right field', 'View Level standing'],
      partyAreas: [
        { name: 'Triples Alley', capacity: '100', amenities: ['Group seating', 'Bar access'] },
        { name: 'Coca-Cola Fan Lot', capacity: '200', amenities: ['Playground', 'Coca-Cola bottle slide'] }
      ],
      tips: [
        { section: 'View 301-310', tip: 'Best value with shade and views', category: 'value' },
        { section: 'Arcade', tip: 'Standing room with McCovey Cove views', category: 'experience' },
        { section: 'Bleachers 136-142', tip: 'Rowdy crowd, full sun', category: 'experience' },
        { section: 'Club Level', tip: 'Worth it for warmth and amenities', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Gilroy Garlic Fries', 'Dungeness Crab Sandwich', 'Cha Cha Bowl', 'Crazy Crab\'z'],
      local: ['Ghirardelli hot chocolate', 'Anchor Steam beer', 'Mission-style burritos', 'Sheboygan bratwurst'],
      healthy: ['Garden salads', 'Poke bowls', 'Veggie burgers', 'Fresh fruit'],
      vegetarian: ['Impossible burgers', 'Veggie dogs', 'Field greens salads'],
      glutenFree: ['GF hot dogs', 'GF beer', 'Rice bowls'],
      kidsFriendly: ['Junior Giants meals', 'Pizza', 'Churros', 'Hot chocolate'],
      alcohol: {
        beer: ['Anchor Steam', '21st Amendment', 'Lagunitas', 'Stella Artois'],
        wine: true,
        cocktails: true,
        localBreweries: ['Anchor', '21st Amendment', 'Fort Point', 'Local Brewing Co.']
      }
    },
    
    parking: {
      lots: [
        { name: 'Lot A (Pier 48)', distance: '10 min walk', price: '$40', shadedSpots: false, covered: false, tip: 'Closest official lot' },
        { name: 'Lot C', distance: '15 min walk', price: '$35', shadedSpots: false, covered: false },
        { name: 'Downtown garages', distance: '20 min walk', price: '$20-30', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['Muni Metro N-Judah/T-Third to ballpark', 'BART to Embarcadero + Muni', 'Caltrain to 4th & King'],
        rideShare: '3rd Street drop-off zone',
        bicycle: 'Valet bike parking at Portwalk'
      }
    },
    
    gates: [
      { name: 'Willie Mays Gate', location: '3rd & King', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: "O'Doul Gate", location: 'Left field', bestFor: ['Bleachers', 'View Level'], openTime: '90 minutes before first pitch' },
      { name: 'Marina Gate', location: 'Right field', bestFor: ['Arcade', 'Lower Box RF'], openTime: '90 minutes before first pitch' },
      { name: '2nd & King Gate', location: '2nd Street', bestFor: ['Club Level', 'Suites'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Dugout Store - Willie Mays Plaza', exclusive: ['World Series gear', 'Custom jerseys'] },
        { location: 'Multiple locations' }
      ],
      firstAid: ['Section 115', 'Section 209', 'Section 330'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Behind Section 119'],
      atms: ['All gate areas', 'Throughout concourses'],
      wifi: { available: true, network: 'OraclePark_WiFi' },
      chargingStations: ['Club Level', 'Virgin Club House'],
      kidZones: [
        { name: 'Coca-Cola Fan Lot', location: 'Left field', activities: ['Mini ballpark', 'Coca-Cola slide', 'Speed pitch'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available at all gate entries']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'Limited - arrive early or use public transit'
    },
    
    gameDay: {
      tips: [
        { title: 'Dress in layers', description: 'Weather changes quickly', category: 'weather' },
        { title: 'Take public transit', description: 'Parking is expensive and limited', category: 'arrival' },
        { title: 'Try garlic fries', description: 'Signature ballpark food', category: 'food' },
        { title: 'Walk the Portwalk', description: 'Free views into stadium', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before (Willie Mays Gate)',
        battingPractice: 'Giants BP 2.5 hours before',
        firstPitch: '7:15 PM weekdays, 1:05 PM Saturdays, 1:05 PM Sundays',
        rushHours: ['5:00-6:30 PM downtown traffic']
      },
      security: {
        allowedBags: 'Bags under 16"x16"x8"',
        prohibitedItems: ['Glass bottles', 'Cans', 'Hard coolers', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'South Beach/Mission Bay',
      description: 'Waterfront district with restaurants and bars',
      beforeGame: ['21st Amendment Brewery', 'MoMo\'s', 'Public House'],
      afterGame: ['The Yard at Mission Rock', 'Local Brewing Co.', 'Waterfront bars'],
      radius: 'Walking distance'
    },
    
    transportation: {
      address: '24 Willie Mays Plaza, San Francisco, CA 94107',
      publicTransit: {
        subway: [{ lines: ['Muni N-Judah', 'T-Third'], station: '2nd & King', walkTime: '1 minute' }],
        train: [{ lines: ['Caltrain'], station: '4th & King', walkTime: '5 minutes' }],
        bus: [{ routes: ['Multiple Muni routes'], stops: ['2nd & King', '3rd & King'] }]
      },
      driving: {
        majorRoutes: ['I-280 to King St', 'US-101 to 4th St', 'Bay Bridge to 5th St'],
        typicalTraffic: 'Heavy downtown congestion',
        bestApproach: 'I-280 from south, Bay Bridge from east'
      },
      rideShare: {
        pickupZone: '3rd Street between King and Townsend',
        dropoffZone: '3rd & King',
        surgePricing: '3-5x after games',
        alternativeTip: 'Walk to 4th & Brannan for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 2000, event: 'Pacific Bell Park opens' },
        { year: 2007, event: 'Barry Bonds hits 756' },
        { year: 2010, event: 'First World Series Championship in SF' },
        { year: 2012, event: 'World Series Championship' },
        { year: 2014, event: 'Third World Series in five years' }
      ],
      notableGames: [
        { date: '2007-08-07', description: 'Barry Bonds breaks home run record' },
        { date: '2010-11-01', description: 'First SF World Series clincher' },
        { date: '2014-10-16', description: 'Travis Ishikawa NLCS walk-off' }
      ],
      traditions: [
        { name: 'Splash Hits', description: 'Home runs into McCovey Cove' },
        { name: 'Foghorn', description: 'Sounds after Giants home runs' },
        { name: 'Journey sing-along', description: 'Don\'t Stop Believin\' in 8th inning' }
      ],
      retired: [
        { number: '3', player: 'Bill Terry', year: 1984 },
        { number: '4', player: 'Mel Ott', year: 1949 },
        { number: '11', player: 'Carl Hubbell', year: 1944 },
        { number: '20', player: 'Monte Irvin', year: 1973 },
        { number: '24', player: 'Willie Mays', year: 1972 },
        { number: '25', player: 'Barry Bonds', year: 2018 },
        { number: '27', player: 'Juan Marichal', year: 1975 },
        { number: '30', player: 'Orlando Cepeda', year: 1999 },
        { number: '36', player: 'Gaylord Perry', year: 2005 },
        { number: '44', player: 'Willie McCovey', year: 1980 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Knowledgeable fans, family-friendly, beautiful setting',
      bestExperiences: [
        'McCovey Cove kayakers',
        'Garlic fries tradition',
        'Journey sing-along',
        'Walking the Portwalk'
      ],
      traditions: ['Splash hit counter', 'Foghorn', 'Journey in 8th', 'Orange Friday'],
      music: 'Classic rock heavy, Tony Bennett after wins',
      mascot: { name: 'Lou Seal', description: 'Sea lion mascot' },
      fanGroups: [
        { name: 'Bleacher Bums', section: '136-142', description: 'Loyal bleacher regulars' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Public House for pre-game craft beer',
        'Portwalk free views during game',
        'Download Ballpark app for shorter lines',
        'View Level 301-310 best value seats',
        'Bring warm clothes regardless of weather'
      ],
      avoidThese: [
        'Driving - parking is expensive and limited',
        'Arcade without layers - very windy',
        'Leaving jacket at home',
        'Bleachers without sunscreen on sunny days'
      ],
      hiddenGems: [
        'Garden in center field',
        'Cable car in left-center',
        'Virgin Club House all-inclusive',
        'Gotham Club private bar'
      ],
      photoSpots: [
        'Willie Mays statue',
        'McCovey Cove from Portwalk',
        'Bay Bridge from View Level',
        'Coca-Cola bottle and glove'
      ],
      bestValue: [
        'View Level corners',
        'Bleacher seats with atmosphere',
        'Standing room tickets',
        'Take Muni or walk to save parking'
      ]
    }
  },

  'padres': {
    id: 'padres',
    name: 'Petco Park',
    team: 'San Diego Padres',
    opened: 2004,
    capacity: 40209,
    
    overview: {
      description: 'Petco Park in downtown San Diego combines perfect weather, stunning city views, and unique features like the Park at the Park beyond center field. The Western Metal Supply Co. building integrated into left field gives it distinctive character.',
      highlights: [
        'Western Metal Supply Co. building in left field',
        'Park at the Park grass seating area',
        'Perfect San Diego weather',
        'Gaslamp Quarter location'
      ],
      uniqueFeatures: [
        'Beach area beyond right-center',
        'Park at the Park lawn seating',
        'Western Metal Supply Co. building',
        'Gallagher Square events space',
        'Rooftop bar on Metal Supply building'
      ],
      renovations: [
        { year: 2017, description: 'Gallagher Square renovations' },
        { year: 2016, description: 'New video boards' },
        { year: 2015, description: 'Fence moved in, dimensions changed' }
      ],
      previousNames: []
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck third base side', 'Sections 301-315'],
        afternoon: ['Third base side all levels', 'Upper deck behind plate', 'Toyota Terrace'],
        evening: ['Most sections after 4 PM', 'First base side gains shade']
      },
      coveredSeating: ['Toyota Terrace Level', 'Upper deck overhang rows'],
      shadeTips: [
        'Third base side best for day games',
        'Upper deck provides shade for Field Level below',
        'Park at the Park has no shade',
        'Perfect weather means shade less critical than other parks'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourse levels'],
        indoorAreas: ['Omni Premier Club', 'Team Store', 'Metal Supply Co. building']
      },
      worstSunExposure: ['Park at the Park', 'Field Level sections 119-135', 'Right field sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 66, avgHumidity: 65, rainChance: 8, typicalConditions: 'Perfect weather', shadeTip: 'Any seat comfortable' },
        { month: 'May', avgTemp: 68, avgHumidity: 70, rainChance: 3, typicalConditions: 'May Gray mornings', shadeTip: 'Marine layer provides cover' },
        { month: 'June', avgTemp: 71, avgHumidity: 70, rainChance: 2, typicalConditions: 'June Gloom fog', shadeTip: 'Natural shade from marine layer' },
        { month: 'July', avgTemp: 75, avgHumidity: 70, rainChance: 1, typicalConditions: 'Warm and clear', shadeTip: 'Seek shade for day games' },
        { month: 'August', avgTemp: 77, avgHumidity: 70, rainChance: 1, typicalConditions: 'Peak warmth', shadeTip: 'Third base side recommended' },
        { month: 'September', avgTemp: 76, avgHumidity: 65, rainChance: 3, typicalConditions: 'Still warm', shadeTip: 'Beautiful baseball weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Omni Premier Club', perks: ['All-inclusive food/drinks', 'Private entrance', 'Padded seats'], access: 'Behind home plate' },
          { name: 'Western Metal Supply Co.', perks: ['Historic building', 'Multiple bars', 'Rooftop deck'], access: 'Left field building' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Balcony seating']
        },
        specialAreas: [
          { name: 'Beach area', description: 'Sand area beyond right-center', capacity: 100 },
          { name: 'Park at the Park', description: 'Grass berm seating', capacity: 2500 }
        ]
      },
      budgetOptions: ['Upper Reserved', 'Park at the Park ($10 lawn)', 'Toyota Terrace corners'],
      familySections: ['Park at the Park', 'Family sections 131-133'],
      standingRoom: ['Gallagher Square', 'Western Metal Supply Co.'],
      partyAreas: [
        { name: 'Gallagher Square', capacity: '500', amenities: ['Giant screen', 'Bar', 'Games'] },
        { name: 'Beach', capacity: '100', amenities: ['Sand', 'Fire pit', 'Bar service'] }
      ],
      tips: [
        { section: 'Toyota Terrace 205-210', tip: 'Best shade and value', category: 'shade' },
        { section: 'Western Metal', tip: 'Unique experience in historic building', category: 'experience' },
        { section: 'Park at the Park', tip: 'Great for families, only $10', category: 'family' },
        { section: 'Field 113-120', tip: 'Close to action with eventual shade', category: 'view' }
      ]
    },
    
    concessions: {
      signature: ['Fish tacos', 'Tri-tip nachos', 'Hodad\'s burgers', 'Phil\'s BBQ'],
      local: ['Lucha Libre tacos', 'Board & Brew sandwiches', 'Buona Forchetta pizza', 'Carnitas\' Snack Shack'],
      healthy: ['Seaside Market healthy options', 'Salads', 'Poke bowls'],
      vegetarian: ['Beyond burgers', 'Veggie tacos', 'Mediterranean options'],
      glutenFree: ['GF beer', 'GF buns available'],
      kidsFriendly: ['Pizza Port', 'Hot dogs', 'Chicken tenders'],
      alcohol: {
        beer: ['.394 Pale Ale', 'Stone IPA', 'Ballast Point', 'Modelo'],
        wine: true,
        cocktails: true,
        localBreweries: ['AleSmith', 'Stone', 'Ballast Point', 'Karl Strauss']
      }
    },
    
    parking: {
      lots: [
        { name: 'Tailgate Park', distance: 'Adjacent', price: '$25-35', shadedSpots: false, covered: false, tip: 'Tailgating allowed' },
        { name: 'Parkade Structure', distance: '5 min walk', price: '$15-20', shadedSpots: true, covered: true },
        { name: 'Downtown structures', distance: '10-15 min', price: '$10-15', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['Trolley Green Line to Gaslamp Station', 'Multiple bus routes'],
        rideShare: 'L Street between 7th and 10th',
        bicycle: 'Bike valet at Park Blvd'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'Park Blvd', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: 'East Village Gate', location: '10th Ave', bestFor: ['Right field', 'Beach'], openTime: '90 minutes before first pitch' },
      { name: 'Gaslamp Gate', location: '7th Ave', bestFor: ['Left field', 'Western Metal'], openTime: '90 minutes before first pitch' },
      { name: 'Park at the Park', location: 'Park Blvd', bestFor: ['Lawn seating'], openTime: '2.5 hours before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store - Home Plate Gate', exclusive: ['Custom jerseys', 'Exclusive designs'] },
        { location: 'The Goods kiosks throughout' }
      ],
      firstAid: ['Section 105', 'Section 207', 'Section 319'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services behind 108'],
      atms: ['All gates', 'Throughout concourses'],
      wifi: { available: true, network: 'PetcoPark_WiFi' },
      chargingStations: ['Omni Club', 'Various concourse locations'],
      kidZones: [
        { name: 'Park at the Park', location: 'Beyond CF', activities: ['Playground', 'Wiffle ball field', 'Sand area'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available at all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent locations'],
      parkingSpaces: 'Available in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Explore Gaslamp Quarter', description: 'Great bars and restaurants nearby', category: 'arrival' },
        { title: 'Try fish tacos', description: 'San Diego specialty', category: 'food' },
        { title: 'Visit the beach area', description: 'Unique sand feature in CF', category: 'experience' },
        { title: 'Check out Park at the Park', description: 'Great for kids pre-game', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before (Home Plate/Park)',
        battingPractice: 'Padres BP 2.5 hours before',
        firstPitch: '6:40 PM weekdays, 5:40 PM Saturdays, 1:40 PM Sundays',
        rushHours: ['5:00-6:00 PM downtown']
      },
      security: {
        allowedBags: 'Single compartment bags under 7"x10"',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Beach balls', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Gaslamp Quarter/East Village',
      description: 'Vibrant downtown entertainment district',
      beforeGame: ['Bub\'s @ the Ballpark', 'Tin Fish', 'Lolita\'s Mexican'],
      afterGame: ['Gaslamp Quarter bars', 'Little Italy restaurants', 'Seaport Village'],
      radius: 'Walking distance'
    },
    
    transportation: {
      address: '100 Park Blvd, San Diego, CA 92101',
      publicTransit: {
        subway: [{ lines: ['Green Line Trolley'], station: 'Gaslamp Quarter', walkTime: '5 minutes' }],
        bus: [{ routes: ['Multiple MTS routes'], stops: ['Park Blvd', '5th Ave'] }]
      },
      driving: {
        majorRoutes: ['I-5 to 10th Ave', 'CA-163 to downtown', 'I-8 to I-5'],
        typicalTraffic: 'Moderate downtown traffic',
        bestApproach: 'CA-163 from north, I-5 from south'
      },
      rideShare: {
        pickupZone: 'L Street between 7th and 10th',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to Gaslamp for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 2004, event: 'Petco Park opens' },
        { year: 2016, event: 'All-Star Game hosted' },
        { year: 2020, event: 'First playoff appearance in 14 years' },
        { year: 2022, event: 'Wild Card victory over Mets' }
      ],
      notableGames: [
        { date: '2020-10-02', description: 'First playoff game since 2006' },
        { date: '2022-10-09', description: 'Wild Card comeback vs Mets' },
        { date: '2007-09-29', description: 'Trevor Hoffman 500th save' }
      ],
      traditions: [
        { name: 'Friar mascot', description: 'The Swinging Friar' },
        { name: 'Bells ringing', description: 'Mission bells after home runs' }
      ],
      retired: [
        { number: '6', player: 'Steve Garvey', year: 1989 },
        { number: '19', player: 'Tony Gwynn', year: 2004 },
        { number: '31', player: 'Dave Winfield', year: 2001 },
        { number: '35', player: 'Randy Jones', year: 1997 },
        { number: '51', player: 'Trevor Hoffman', year: 2011 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Laid-back San Diego vibe, growing enthusiasm',
      bestExperiences: [
        'Park at the Park family fun',
        'Beach area unique feature',
        'Perfect weather year-round',
        'Gaslamp Quarter nightlife'
      ],
      traditions: ['Mission bells', 'Friar mascot antics', 'Brown and gold revival'],
      music: 'Beach and surf rock heavy',
      mascot: { name: 'The Swinging Friar', description: 'Monk mascot' },
      fanGroups: [
        { name: 'Friar Faithful', description: 'Die-hard fan group' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Park at the Park great value for families',
        'Western Metal Supply Co. for unique experience',
        'Gaslamp happy hours before games',
        'Toyota Terrace best shade value',
        'Trolley easier than driving'
      ],
      avoidThese: [
        'Park at the Park for serious viewing',
        'Right field in afternoon sun',
        'Driving on weekends - parking fills up',
        'Gaslamp immediately after - too crowded'
      ],
      hiddenGems: [
        'Rooftop bar on Metal Supply building',
        'Beach sand area in CF',
        'Gallagher Square for free viewing',
        'Craft beer selection at Field Level'
      ],
      photoSpots: [
        'Tony Gwynn statue',
        'Western Metal Supply Co. sign',
        'Park at the Park overview',
        'Downtown skyline from upper deck'
      ],
      bestValue: [
        'Park at the Park - $10',
        'Toyota Terrace corners',
        'Gallagher Square free viewing',
        'Happy hour at nearby bars'
      ]
    }
  }
};

// Export combined guides
export const allMLBGuides = {
  ...mlbStadiumGuides4
};