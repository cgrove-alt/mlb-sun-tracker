import { StadiumGuide } from '../stadiumGuides';

export const mlbStadiumGuidesFinal: Record<string, StadiumGuide> = {
  'astros': {
    id: 'astros',
    name: 'Minute Maid Park',
    team: 'Houston Astros',
    opened: 2000,
    capacity: 41168,
    overview: {
      description: 'Minute Maid Park in downtown Houston features a retractable roof and the famous train that runs along the left field wall. This unique ballpark combines Houston\'s railroad history with modern amenities, including the iconic Tal\'s Hill (now removed) and distinctive architecture.',
      highlights: [
        'Retractable roof for Houston weather',
        'Train runs on 800-foot track',
        'Downtown Houston skyline views',
        'Crawford Boxes in left field'
      ],
      uniqueFeatures: [
        'Union Station facade integration',
        'Train with coal tender on left field wall',
        'Crawford Boxes short porch',
        'Gas pump beyond center field'
      ],
      renovations: [
        { year: 2016, description: 'Tal\'s Hill removed, center field renovated' },
        { year: 2017, description: 'New video boards' },
        { year: 2023, description: 'Club level upgrades' }
      ],
      previousNames: ['Enron Field (2000-2002)']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['All sections (roof typically closed)', 'Club Level', 'Diamond Club'],
        afternoon: ['All sections (roof closed for heat)', 'Mezzanine third base if open', 'Upper deck'],
        evening: ['First base side if roof open', 'Sections 105-120', 'Club level']
      },
      coveredSeating: ['All seats when roof closed', 'Club Level', 'Diamond Club'],
      shadeTips: [
        'Roof usually closed April-October',
        'AC keeps stadium at 73°F',
        'Even with roof open, upper levels covered',
        'No sun worries with roof closed'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourses covered'],
        indoorAreas: ['Entire stadium when roof closed', 'Club areas', 'Team Store']
      },
      worstSunExposure: ['Crawford Boxes when roof open', 'Outfield sections if open'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 75, avgHumidity: 75, rainChance: 25, typicalConditions: 'Mild, roof varies', shadeTip: 'Usually comfortable' },
        { month: 'May', avgTemp: 82, avgHumidity: 75, rainChance: 30, typicalConditions: 'Getting humid', shadeTip: 'Roof often closed' },
        { month: 'June', avgTemp: 88, avgHumidity: 75, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'AC essential' },
        { month: 'July', avgTemp: 91, avgHumidity: 75, rainChance: 40, typicalConditions: 'Peak heat', shadeTip: 'Roof always closed' },
        { month: 'August', avgTemp: 91, avgHumidity: 75, rainChance: 35, typicalConditions: 'Extremely humid', shadeTip: 'Indoor comfort crucial' },
        { month: 'September', avgTemp: 86, avgHumidity: 75, rainChance: 30, typicalConditions: 'Still hot', shadeTip: 'Roof provides relief' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Waitstaff'], access: 'Behind home plate' },
          { name: 'Club Level', perks: ['Upscale dining', 'Private bars', 'Climate control'], access: 'Club level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private entrance', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Budweiser Brew House', description: 'Left field bar', capacity: 100 },
          { name: 'Home Run Pump', description: 'Center field platform' }
        ]
      },
      budgetOptions: ['View Deck 400s', 'Outfield Deck', 'Standing room'],
      familySections: ['Sections 401-403', 'Family Deck'],
      standingRoom: ['Budweiser Brew House', 'Outfield areas'],
      partyAreas: [
        { name: 'Home Run Alley', capacity: '200', amenities: ['All-inclusive packages'] },
        { name: 'Torchy\'s Tacos Deck', description: 'Left field party area', capacity: '150', amenities: ['Tacos', 'Bar service', 'Group seating'] }
      ],
      tips: [
        { section: 'Diamond Club', tip: 'Ultimate luxury with AC comfort', category: 'experience' },
        { section: 'View Deck 420-430', tip: 'Best value seats', category: 'value' },
        { section: 'Crawford Boxes', tip: 'Unique left field experience', category: 'experience' },
        { section: 'Sections 125-135', tip: 'Great views, always comfortable', category: 'view' }
      ]
    },
    concessions: {
      signature: ['Torchy\'s Tacos', 'Killen\'s BBQ', 'Jackson Street BBQ', 'Pluckers Wings'],
      local: ['Killen\'s', 'Torchy\'s', 'Saint Arnold Brewing', 'Pappas BBQ'],
      healthy: ['Fresh salads', 'Grilled options', 'Fruit cups'],
      vegetarian: ['Veggie tacos', 'Beyond Burger', 'Salads'],
      glutenFree: ['GF buns available', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Dippin Dots', 'Cotton candy'],
      alcohol: {
        beer: ['Saint Arnold', 'Karbach', '8th Wonder', 'Southern Star'],
        wine: true,
        cocktails: true,
        localBreweries: ['Saint Arnold', 'Karbach', '8th Wonder', 'Buffalo Bayou']
      },
    },
    parking: {
      lots: [
        { name: 'Diamond Lot', distance: 'Adjacent', price: '$25', shadedSpots: false, covered: false, tip: 'Closest to stadium' },
        { name: 'Lot C', distance: '5 min walk', price: '$15', shadedSpots: false, covered: false, tip: 'Good value' },
        { name: 'Downtown garages', distance: '10 min walk', price: '$10-20', shadedSpots: true, covered: true, tip: 'Covered options' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Meters and time limits',
        tip: 'Very limited on game days'
      },
      alternativeTransport: {
        publicTransit: ['METRORail Red Line to Convention District', 'Multiple bus routes'],
        rideShare: 'Crawford Street designated zones',
        bicycle: 'Houston BCycle stations'
      },
    },
    gates: [
      { name: 'Union Station Entry', location: 'Home plate', bestFor: ['Main entrance'], openTime: '2 hours before', tip: 'Historic entrance' },
      { name: 'Left Field Entry', location: 'Left field', bestFor: ['Crawford Boxes'], openTime: '90 minutes before' },
      { name: 'Center Field Entry', location: 'Center field', bestFor: ['Outfield sections'], openTime: '90 minutes before' },
      { name: 'Right Field Entry', location: 'Right field', bestFor: ['Right side sections'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store - Main', exclusive: ['Authentics', 'Custom jerseys'] },
        { location: 'Outfield shops', exclusive: ['Unique items'] }
      ],
      firstAid: ['Section 126', 'Section 226', 'Section 405'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services behind Section 126'],
      atms: ['All entrances', 'Throughout concourses'],
      wifi: { available: true, network: 'MinuteMaid_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Club Level', 'Budweiser Brew House'],
      kidZones: [
        { name: 'Squeeze Play', location: 'Center field', activities: ['Play area', 'Games'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['All entrances have elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main stands'],
      parkingSpaces: 'Diamond Lot has ADA spaces'
    },
    transportation: {
      address: '501 Crawford Street, Houston, TX 77002',
      publicTransit: {
        train: [
          { lines: ['METRORail Green/Purple Lines'], station: 'Convention District', walkTime: '10 minutes' }
        ]
      },
      driving: {
        majorRoutes: ['Local roads'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'Taxi stand on Texas Avenue'
      },
      rideShare: {
        pickupZone: 'Crawford Street',
        dropoffZone: 'Crawford Street',
        surgePricing: 'Common during games'
      },
    },
    gameDay: {
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:10 PM weekdays, various weekend times',
        rushHours: ['30 minutes before first pitch', 'End of game']
      },
      tips: [
        { title: 'Early Arrival', description: 'Gates open 90 minutes before first pitch', category: 'arrival' },
        { title: 'Sun Protection', description: 'Bring sunscreen for day games', category: 'shade' },
        { title: 'Local Food', description: 'Try the stadium signature items', category: 'food' },
        { title: 'Beat Traffic', description: 'Leave early or stay late to avoid congestion', category: 'departure' }
      ],
      security: {
        allowedBags: 'Soft-sided bags under 16"x16"x8"',
        prohibitedItems: ['Hard coolers', 'Glass bottles', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
      },
    neighborhood: {
      name: 'Downtown Houston',
      description: 'Urban center with restaurants, bars, and entertainment',
      beforeGame: ['8th Wonder Brewery', 'Truck Yard Houston', 'Rodeo Goat', 'Biggio\'s'],
      afterGame: ['Downtown bars', 'Main Street nightlife', 'Midtown district'],
      radius: '0.5 miles to downtown core'
    },
    proTips: {
      insiderTips: [
        'Train runs on 800-foot track',
        'Crawford Boxes are MLB\'s shortest',
        'Union Station entrance is historic',
        'Roof usually closed for comfort'
      ],
      bestValue: [
        'View Deck affordable',
        'Standing room good option',
        'Tuesday deals throughout'
      ],
      hiddenGems: [
        'Gas pump in center field',
        'Train filled with oranges',
        'Bobby Dynamite train conductor'
      ],
      avoidThese: [
        'Driving without prepaid parking',
        'Crawford Boxes on rare sunny days',
        'Missing the train after home runs'
      ],
      photoSpots: [
        'Stadium entrance sign',
        'Statues and monuments',
        'City skyline views',
        'Unique stadium features'
      ]
    },
    history: {
      timeline: [
        { year: 2000, event: 'Enron Field opens' },
        { year: 2002, event: 'Renamed Minute Maid Park' },
        { year: 2017, event: 'Astros win World Series' },
        { year: 2022, event: 'Astros win World Series' }
      ],
      traditions: [
        { name: 'Train', description: 'Runs after home runs' },
        { name: 'Orbit', description: 'Green alien mascot' },
        { name: 'Deep in the Heart of Texas', description: '7th inning stretch' }
      ],
      retired: [
        { number: '5', player: 'Jeff Bagwell', year: 2007 },
        { number: '7', player: 'Craig Biggio', year: 2008 },
        { number: '24', player: 'Jimmy Wynn', year: 2011 },
        { number: '25', player: 'Jose Cruz', year: 1992 },
        { number: '32', player: 'Jim Umbricht', year: 1965 },
        { number: '33', player: 'Mike Scott', year: 1992 },
        { number: '34', player: 'Nolan Ryan', year: 1996 },
        { number: '40', player: 'Don Wilson', year: 1975 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '49', player: 'Larry Dierker', year: 2002 }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere with passionate fans',
      bestExperiences: [
        'Pre-game festivities on the plaza',
        'Signature food and drink options',
        'Team traditions and chants'
      ],
      traditions: [
        'Seventh inning stretch',
        'Rally songs and chants',
        'Mascot interactions'
      ],
      music: 'Classic ballpark organ and modern hits',
      mascot: {
        name: 'Team Mascot',
        description: 'Beloved character entertaining fans'
      },
      fanGroups: [
        { name: 'Supporter Section', section: 'Bleachers', description: 'Dedicated fan section' }
      ]
    },
  },

  'athletics': {
    id: 'athletics',
    name: 'Oakland Coliseum',
    team: 'Oakland Athletics',
    opened: 1966,
    capacity: 46847,
    overview: {
      description: 'The Oakland Coliseum, one of the last multi-purpose stadiums in MLB, is known for its vast foul territory and passionate fanbase. Despite its age and the infamous Mt. Davis addition, it maintains a unique charm with drum circles, creative fan sections, and affordable prices.',
      highlights: [
        'Largest foul territory in MLB',
        'Passionate A\'s fanbase',
        'Affordable ticket prices',
        'BART accessible'
      ],
      uniqueFeatures: [
        'Mt. Davis upper deck structure',
        'Massive foul territory',
        'Drum section in right field',
        'Shared with NFL Raiders (formerly)'
      ],
      renovations: [
        { year: 1995, description: 'Mt. Davis addition for Raiders' },
        { year: 2017, description: 'New video boards' },
        { year: 2024, description: 'Minor improvements for final season' }
      ],
      previousNames: ['Oakland-Alameda County Coliseum', 'Network Associates Coliseum', 'McAfee Coliseum', 'O.co Coliseum', 'RingCentral Coliseum']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Plaza Level 213-230 third base', 'Field Level 113-130', 'Diamond Level'],
        afternoon: ['Plaza Level 230-245', 'Sections 125-135 third base', 'Club seats'],
        evening: ['First base side after 6 PM', 'Sections 105-115', 'Most Plaza level']
      },
      coveredSeating: ['Plaza Club', 'Upper deck overhang rows'],
      shadeTips: [
        'Third base side gets afternoon shade',
        'Upper levels provide overhang coverage',
        'Bleachers stay sunny longest',
        'Bay breeze provides cooling'
      ],
      sunProtection: {
        sunscreenStations: ['Section 120', 'Section 220'],
        shadedConcourses: ['All concourses covered'],
        indoorAreas: ['Plaza Club', 'Team Store']
      },
      worstSunExposure: ['Bleachers 145-150', 'Right field sections', 'Field Level 100-110'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 70, rainChance: 20, typicalConditions: 'Cool with marine layer', shadeTip: 'Bring layers' },
        { month: 'May', avgTemp: 66, avgHumidity: 70, rainChance: 10, typicalConditions: 'Mild', shadeTip: 'Third base for afternoon' },
        { month: 'June', avgTemp: 70, avgHumidity: 70, rainChance: 5, typicalConditions: 'Perfect weather', shadeTip: 'Any section comfortable' },
        { month: 'July', avgTemp: 72, avgHumidity: 70, rainChance: 2, typicalConditions: 'Warm but breezy', shadeTip: 'Upper deck stays cool' },
        { month: 'August', avgTemp: 73, avgHumidity: 70, rainChance: 2, typicalConditions: 'Peak summer', shadeTip: 'Shade helpful afternoon' },
        { month: 'September', avgTemp: 72, avgHumidity: 70, rainChance: 5, typicalConditions: 'Indian summer', shadeTip: 'Most sections fine' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Level', perks: ['Premium seats', 'Wider seats', 'Better food options'], access: 'Behind home plate' },
          { name: 'Plaza Club', perks: ['Indoor club', 'Private bar'], access: 'Plaza level' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private entrance', 'Catering', 'HDTV']
        },
        specialAreas: [
          { name: 'The Treehouse', description: 'Left field bar and lounge', capacity: 200 },
          { name: 'Championship Plaza', description: 'Standing room area' }
        ]
      },
      budgetOptions: ['Mt. Davis sections', 'Bleachers', 'Value Deck'],
      familySections: ['Sections 213-215', 'Family Value sections'],
      standingRoom: ['The Treehouse', 'Championship Plaza'],
      partyAreas: [
        { name: 'The Treehouse', capacity: '200', amenities: ['Full bar', 'Food options'] },
        { name: 'Shibe Park Tavern', description: 'Restaurant with views', capacity: '150', amenities: ['Full restaurant', 'Field views'] }
      ],
      tips: [
        { section: 'Field Level 115-125', tip: 'Best views despite foul territory', category: 'view' },
        { section: 'Plaza Level 220-230', tip: 'Good value with shade', category: 'value' },
        { section: 'Bleachers 147-149', tip: 'Drum section atmosphere', category: 'experience' },
        { section: 'Mt. Davis', tip: 'Cheapest seats but far away', category: 'value' }
      ]
    },
    concessions: {
      signature: ['Saag\'s sausages', 'Ribs & Things BBQ', 'Nachos', 'Stomper Burger'],
      local: ['Saag\'s', 'Ribs & Things', 'Kinder\'s BBQ', 'Shibe Park Tavern'],
      healthy: ['Fresh salads', 'Grilled options', 'Fruit'],
      vegetarian: ['Veggie dogs', 'Impossible Burger', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Kids meals', 'Ice cream', 'Popcorn'],
      alcohol: {
        beer: ['Drake\'s', 'Lagunitas', 'Sierra Nevada', 'Coors'],
        wine: true,
        cocktails: true,
        localBreweries: ['Drake\'s', 'Fieldwork', 'Oakland United']
      },
    },
    parking: {
      lots: [
        { name: 'Coliseum Parking', distance: 'Surrounding stadium', price: '$30', shadedSpots: false, covered: false, tip: 'Large lots all around' },
        { name: 'BART Parking', distance: 'At station', price: '$3', shadedSpots: false, covered: false, tip: 'Take BART to avoid parking' }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots or BART'
      },
      alternativeTransport: {
        publicTransit: ['BART Coliseum Station (direct access)', 'AC Transit buses'],
        rideShare: 'Designated zones near BART',
        bicycle: 'Bike racks available'
      },
    },
    gates: [
      { name: 'Home Plate Gate', location: 'Behind home plate', bestFor: ['Field Level'], openTime: '2 hours before' },
      { name: 'Gate B', location: 'First base', bestFor: ['Right side sections'], openTime: '90 minutes before' },
      { name: 'Gate C', location: 'Center field', bestFor: ['Bleachers'], openTime: '90 minutes before' },
      { name: 'Gate D', location: 'Third base', bestFor: ['Left side sections'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'A\'s Team Store', exclusive: ['Final season items', 'Authentics'] },
        { location: 'The Treehouse Shop', exclusive: ['Unique designs'] }
      ],
      firstAid: ['Section 121', 'Section 221'],
      babyChanging: ['Family restrooms'],
      nursingRooms: ['Guest Services'],
      atms: ['All gates', 'Concourses'],
      wifi: { available: true, network: 'Athletics_WiFi', freeZones: ['Limited areas'] },
      chargingStations: ['The Treehouse', 'Plaza Club'],
      kidZones: [
        { name: 'Stomper Fun Zone', location: 'Left field', activities: ['Play area', 'Games'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available at main gates']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: 'Designated ADA parking areas'
    },
    transportation: {
      address: '7000 Coliseum Way, Oakland, CA 94621',
      publicTransit: {
        train: [
          { lines: ['BART'], station: 'Coliseum', walkTime: '5 minutes' }
        ]
      },
      driving: {
        majorRoutes: ['Local roads'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'Limited availability'
      },
      rideShare: {
        pickupZone: 'Near BART station',
        dropoffZone: 'Near BART station',
        surgePricing: 'Common during games'
      },
    },
    gameDay: {
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:10 PM weekdays, various weekend times',
        rushHours: ['30 minutes before first pitch', 'End of game']
      },
      tips: [
        { title: 'Early Arrival', description: 'Gates open 90 minutes before first pitch', category: 'arrival' },
        { title: 'Sun Protection', description: 'Bring sunscreen for day games', category: 'shade' },
        { title: 'Local Food', description: 'Try the stadium signature items', category: 'food' },
        { title: 'Beat Traffic', description: 'Leave early or stay late to avoid congestion', category: 'departure' }
      ],
      security: {
        allowedBags: 'Soft-sided bags under 16"x16"x8"',
        prohibitedItems: ['Hard coolers', 'Glass bottles', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
      },
    neighborhood: {
      name: 'East Oakland',
      description: 'Industrial area with limited nearby entertainment',
      beforeGame: ['Tailgating in lots', 'Limited nearby options'],
      afterGame: ['Jack London Square (10 min)', 'Downtown Oakland (15 min)'],
      radius: 'Entertainment districts 10-15 minutes away'
    },
    proTips: {
      insiderTips: [
        'Right field drums are iconic',
        'The Treehouse has best food/drinks',
        'Final season memorabilia valuable',
        'BART is easiest transport'
      ],
      bestValue: [
        'Bleachers very affordable',
        'Mt. Davis cheapest seats',
        'Wednesday deals'
      ],
      hiddenGems: [
        'Championship banners',
        'A\'s Hall of Fame',
        'Stomper\'s birthday celebrations'
      ],
      avoidThese: [
        'Driving if possible (take BART)',
        'Mt. Davis for close views',
        'Leaving early (traffic)'
      ],
      photoSpots: [
        'Stadium entrance sign',
        'Statues and monuments',
        'City skyline views',
        'Unique stadium features'
      ]
    },
    history: {
      timeline: [
        { year: 1968, event: 'A\'s move to Oakland' },
        { year: 1972, event: 'Win World Series' },
        { year: 1973, event: 'Win World Series' },
        { year: 1974, event: 'Win World Series' },
        { year: 1989, event: 'Win World Series' },
        { year: 2024, event: 'Final season in Oakland' }
      ],
      traditions: [
        { name: 'Right Field Drummers', description: 'Fan drummers since 1981' },
        { name: 'Stomper', description: 'Elephant mascot' },
        { name: 'Dot Racing', description: 'Between innings entertainment' }
      ],
      retired: [
        { number: '9', player: 'Reggie Jackson', year: 2004 },
        { number: '24', player: 'Rickey Henderson', year: 2009 },
        { number: '27', player: 'Catfish Hunter', year: 1991 },
        { number: '34', player: 'Rollie Fingers', year: 1992 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '43', player: 'Dennis Eckersley', year: 2005 }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere with passionate fans',
      bestExperiences: [
        'Pre-game festivities on the plaza',
        'Signature food and drink options',
        'Team traditions and chants'
      ],
      traditions: [
        'Seventh inning stretch',
        'Rally songs and chants',
        'Mascot interactions'
      ],
      music: 'Classic ballpark organ and modern hits',
      mascot: {
        name: 'Team Mascot',
        description: 'Beloved character entertaining fans'
      },
      fanGroups: [
        { name: 'Supporter Section', section: 'Bleachers', description: 'Dedicated fan section' }
      ]
    },
  },

  'diamondbacks': {
    id: 'diamondbacks',
    name: 'Chase Field',
    team: 'Arizona Diamondbacks',
    opened: 1998,
    capacity: 48686,
    overview: {
      description: 'Chase Field in downtown Phoenix was the first stadium built with a retractable roof and air conditioning, essential for baseball in the Arizona desert. The park features a swimming pool beyond the outfield fence and maintains a comfortable environment even during extreme summer heat.',
      highlights: [
        'Retractable roof with AC',
        'Swimming pool in right field',
        'Downtown Phoenix location',
        'Climate-controlled comfort'
      ],
      uniqueFeatures: [
        'Swimming pool and hot tub suite',
        'Retractable roof opens in 4.5 minutes',
        'Natural grass with roof',
        'Sandlot brewery'
      ],
      renovations: [
        { year: 2017, description: 'New video boards and sound' },
        { year: 2019, description: 'Upgraded seating and concourses' },
        { year: 2024, description: 'New premium areas' }
      ],
      previousNames: ['Bank One Ballpark (BOB)']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['All sections (roof closed)', 'Climate controlled'],
        afternoon: ['All sections (roof always closed for heat)', 'AC throughout'],
        evening: ['All sections (roof may open after sunset)', 'First base if open']
      },
      coveredSeating: ['All seats when roof closed', 'Always covered in summer'],
      shadeTips: [
        'Roof closed April-September for heat',
        'AC maintains 75°F when closed',
        'Roof sometimes opens for evening games',
        'No sun exposure concerns in summer'
      ],
      sunProtection: {
        sunscreenStations: ['Not needed when roof closed'],
        shadedConcourses: ['All areas covered'],
        indoorAreas: ['Entire stadium when roof closed']
      },
      worstSunExposure: ['None when roof closed', 'Outfield if roof open (rare)'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 84, avgHumidity: 25, rainChance: 5, typicalConditions: 'Warm and dry', shadeTip: 'Roof often closed' },
        { month: 'May', avgTemp: 93, avgHumidity: 20, rainChance: 3, typicalConditions: 'Getting hot', shadeTip: 'AC essential' },
        { month: 'June', avgTemp: 103, avgHumidity: 15, rainChance: 2, typicalConditions: 'Extreme heat', shadeTip: 'Roof always closed' },
        { month: 'July', avgTemp: 106, avgHumidity: 30, rainChance: 10, typicalConditions: 'Monsoon season', shadeTip: 'Indoor comfort crucial' },
        { month: 'August', avgTemp: 104, avgHumidity: 35, rainChance: 12, typicalConditions: 'Hot with storms', shadeTip: 'AC paradise' },
        { month: 'September', avgTemp: 98, avgHumidity: 30, rainChance: 8, typicalConditions: 'Still very hot', shadeTip: 'Roof provides relief' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Legends Suite', perks: ['All-inclusive food/drinks', 'Padded seats', 'Private entrance'], access: 'Behind home plate' },
          { name: 'Infield Suite', perks: ['Upscale dining', 'Private bar', 'Climate control'], access: 'Infield level' }
        ],
        suites: {
          levels: ['Suite Level', 'Pool Suite'],
          amenities: ['Private entrance', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Pool Suite', description: 'Swimming pool and hot tub', capacity: 35 },
          { name: 'Draft Room', description: 'Left field bar and restaurant' }
        ]
      },
      budgetOptions: ['Upper Level 300s', 'Bleachers', 'All You Can Eat seats'],
      familySections: ['Sections 301-303', 'Family Zone'],
      standingRoom: ['Draft Room', 'Outfield areas'],
      partyAreas: [
        { name: 'Pool Suite', capacity: '35', amenities: ['Pool', 'Hot tub', 'Private patio'] },
        { name: 'Game Seven Grill', description: 'Restaurant with field views', capacity: '200', amenities: ['Full dining', 'Bar', 'Field views'] }
      ],
      tips: [
        { section: 'Legends Suite', tip: 'Ultimate luxury with AC comfort', category: 'experience' },
        { section: 'Upper 315-325', tip: 'Best value seats', category: 'value' },
        { section: 'Pool Suite', tip: 'Unique MLB experience', category: 'experience' },
        { section: 'Sections 115-125', tip: 'Great views, always cool', category: 'view' }
      ]
    },
    concessions: {
      signature: ['Sonoran hot dog', 'Churro dog', 'Asada nachos', 'Street tacos'],
      local: ['Lo-Lo\'s Chicken & Waffles', 'Pork on a Fork', 'Gonzo\'s Grill', 'Four Peaks Brewing'],
      healthy: ['Fresh salads', 'Grilled options', 'Fruit cups'],
      vegetarian: ['Veggie tacos', 'Beyond Burger', 'Salads'],
      glutenFree: ['GF buns and options available'],
      kidsFriendly: ['Kids meals', 'Dippin Dots', 'Cotton candy'],
      alcohol: {
        beer: ['Four Peaks', 'SanTan', 'Huss Brewing', 'Modelo'],
        wine: true,
        cocktails: true,
        localBreweries: ['Four Peaks', 'SanTan', 'Huss', 'Arizona Wilderness']
      },
    },
    parking: {
      lots: [
        { name: 'Chase Field Garage', distance: 'Adjacent', price: '$25', shadedSpots: true, covered: true, tip: 'Covered and closest' },
        { name: 'East Garage', distance: '5 min walk', price: '$15', shadedSpots: true, covered: true, tip: 'Good value covered' },
        { name: 'Downtown lots', distance: '10 min walk', price: '$10', shadedSpots: false, covered: false, tip: 'Budget options' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Meters until 10 PM',
        tip: 'Limited on game days'
      },
      alternativeTransport: {
        publicTransit: ['Valley Metro Light Rail', 'Downtown buses'],
        rideShare: 'Jefferson Street designated zones',
        bicycle: 'Grid Bike Share stations'
      },
    },
    gates: [
      { name: 'Home Plate Gate', location: 'Behind home plate', bestFor: ['Main entrance'], openTime: '2 hours before' },
      { name: 'Left Field Gate', location: 'Left field', bestFor: ['Left side sections'], openTime: '90 minutes before' },
      { name: 'Right Field Gate', location: 'Right field', bestFor: ['Right side sections', 'Pool'], openTime: '90 minutes before' },
      { name: 'Rotunda Gate', location: 'Center field', bestFor: ['Bleachers'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Shop - Main', exclusive: ['Authentics', 'Custom jerseys'] },
        { location: 'Desert Shop', exclusive: ['Unique desert designs'] }
      ],
      firstAid: ['Section 115', 'Section 215', 'Section 315'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services behind home plate'],
      atms: ['All gates', 'Throughout concourses'],
      wifi: { available: true, network: 'ChaseField_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Legends Suite area', 'Draft Room'],
      kidZones: [
        { name: 'Sandlot', location: 'Right field', activities: ['Play area', 'Wiffle ball field'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['All gates have elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main stands'],
      parkingSpaces: 'Chase Field Garage has ADA spaces'
    },
    transportation: {
      address: '401 E Jefferson Street, Phoenix, AZ 85004',
      publicTransit: {
        train: [
          { lines: ['Valley Metro Light Rail'], station: '3rd St/Jefferson', walkTime: '10 minutes' }
        ]
      },
      driving: {
        majorRoutes: ['Local roads'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'Taxi stand on Jefferson Street'
      },
      rideShare: {
        pickupZone: 'Jefferson Street',
        dropoffZone: 'Jefferson Street',
        surgePricing: 'Common during games'
      },
    },
    gameDay: {
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:10 PM weekdays, various weekend times',
        rushHours: ['30 minutes before first pitch', 'End of game']
      },
      tips: [
        { title: 'Early Arrival', description: 'Gates open 90 minutes before first pitch', category: 'arrival' },
        { title: 'Sun Protection', description: 'Bring sunscreen for day games', category: 'shade' },
        { title: 'Local Food', description: 'Try the stadium signature items', category: 'food' },
        { title: 'Beat Traffic', description: 'Leave early or stay late to avoid congestion', category: 'departure' }
      ],
      security: {
        allowedBags: 'Soft-sided bags under 16"x16"x8"',
        prohibitedItems: ['Hard coolers', 'Glass bottles', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
      },
    neighborhood: {
      name: 'Downtown Phoenix',
      description: 'Urban center with growing entertainment district',
      beforeGame: ['Majerle\'s Sports Grill', 'Alice Cooper\'stown', 'The Arrogant Butcher', 'Tilted Kilt'],
      afterGame: ['Downtown bars', 'Roosevelt Row', 'CityScape complex'],
      radius: '0.5 miles to entertainment'
    },
    proTips: {
      insiderTips: [
        'Pool must be reserved in advance',
        'Roof opens occasionally for perfect weather',
        'Sandlot great for kids',
        'Friday fireworks popular'
      ],
      bestValue: [
        'Upper level affordable',
        'All You Can Eat seats',
        'Student discounts with ID'
      ],
      hiddenGems: [
        'Gonzo Memorial', 
        'World Series trophy display',
        'Desert sunset from upper deck (roof open)'
      ],
      avoidThese: [
        'Parking without shade in summer',
        'Forgetting sweater (AC is cold)',
        'Missing pregame roof opening (when it happens)'
      ],
      photoSpots: [
        'Swimming pool',
        'Randy Johnson statue',
        'Rotunda entrance',
        'Desert landscape views'
      ]
    },
    history: {
      timeline: [
        { year: 1998, event: 'Bank One Ballpark opens' },
        { year: 1999, event: 'Hosts NLDS in second season' },
        { year: 2001, event: 'Win World Series' },
        { year: 2011, event: 'Hosts MLB All-Star Game' }
      ],
      traditions: [
        { name: 'D. Baxter the Bobcat', description: 'Team mascot' },
        { name: 'The D-backs Swing', description: 'Rally tradition' },
        { name: 'Pool celebration', description: 'Players jump in after clinching' }
      ],
      retired: [
        { number: '20', player: 'Luis Gonzalez', year: 2010 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '51', player: 'Randy Johnson', year: 2015 }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere with passionate fans',
      bestExperiences: [
        'Pre-game festivities on the plaza',
        'Signature food and drink options',
        'Team traditions and chants'
      ],
      traditions: [
        'Seventh inning stretch',
        'Rally songs and chants',
        'Mascot interactions'
      ],
      music: 'Classic ballpark organ and modern hits',
      mascot: {
        name: 'Team Mascot',
        description: 'Beloved character entertaining fans'
      },
      fanGroups: [
        { name: 'Supporter Section', section: 'Bleachers', description: 'Dedicated fan section' }
      ]
    },
  }
};