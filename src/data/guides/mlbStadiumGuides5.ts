import { StadiumGuide } from '../stadiumGuides';

export const mlbStadiumGuides5: Record<string, StadiumGuide> = {
  'mariners': {
    id: 'mariners',
    name: 'T-Mobile Park',
    team: 'Seattle Mariners',
    opened: 1999,
    capacity: 47929,
    
    overview: {
      description: 'T-Mobile Park features a retractable roof perfect for Seattle\'s rainy climate, stunning views of downtown and Puget Sound, and is known for garlic fries, craft beer, and the Hit It Here Cafe in right field.',
      highlights: [
        'Retractable roof - only MLB park with roof that doesn\'t close',
        'Views of downtown Seattle skyline',
        'Edgar\'s Cantina in left field',
        'The Pen - social gathering space'
      ],
      uniqueFeatures: [
        'Manual scoreboard in left field',
        'Hit It Here Cafe 330 feet from home plate',
        'The Pen with fire pit tables',
        'Lookout Landing deck',
        'Center field beer garden'
      ],
      renovations: [
        { year: 2019, description: 'T-Mobile naming rights and upgrades' },
        { year: 2013, description: 'New HD video board' },
        { year: 2011, description: 'Edgar\'s Cantina added' }
      ],
      previousNames: ['Safeco Field (1999-2018)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Terrace Club 240-247', 'Upper deck behind home plate'],
        afternoon: ['Third base side all levels', 'Sections 316-332', 'Terrace Club'],
        evening: ['Most sections after 5 PM', 'First base side gains shade']
      },
      coveredSeating: ['All seats when roof closed', 'Terrace Club Level', 'Upper deck overhang'],
      shadeTips: [
        'Roof typically closed April-May and Sept-Oct',
        'When open, third base side best for shade',
        'Upper deck overhang provides coverage',
        'The Pen area has limited shade'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourses covered'],
        indoorAreas: ['Hit It Here Cafe', 'Team Store', 'Terrace Club']
      },
      worstSunExposure: ['Bleachers 147-152', 'The Pen area', 'Right field sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 70, rainChance: 40, typicalConditions: 'Cool and rainy', shadeTip: 'Roof usually closed' },
        { month: 'May', avgTemp: 61, avgHumidity: 65, rainChance: 30, typicalConditions: 'Variable', shadeTip: 'Roof status varies' },
        { month: 'June', avgTemp: 66, avgHumidity: 65, rainChance: 20, typicalConditions: 'Mild', shadeTip: 'Roof often open' },
        { month: 'July', avgTemp: 73, avgHumidity: 60, rainChance: 10, typicalConditions: 'Perfect weather', shadeTip: 'Seek shade on sunny days' },
        { month: 'August', avgTemp: 74, avgHumidity: 60, rainChance: 10, typicalConditions: 'Warm and dry', shadeTip: 'Third base side best' },
        { month: 'September', avgTemp: 67, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Roof may close more often' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Private entrance'], access: 'Behind home plate' },
          { name: 'Terrace Club', perks: ['Indoor/outdoor seating', 'Full bar', 'Premium dining'], access: 'Suite Level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'The Pen', description: 'Left field social area with games', capacity: 200 },
          { name: 'Edgar\'s Cantina', description: 'Left field bar and restaurant', capacity: 150 }
        ]
      },
      budgetOptions: ['View Level 300s', 'Bleachers', 'Standing room'],
      familySections: ['Family Section 105-107'],
      standingRoom: ['The Pen', 'Center Field Beer Garden'],
      partyAreas: [
        { name: 'The Pen', capacity: '200', amenities: ['Fire pit tables', 'Games', 'Full bar'] },
        { name: 'Lookout Landing', capacity: '100', amenities: ['Standing deck', 'Bar service'] }
      ],
      tips: [
        { section: 'Terrace Club', tip: 'Best amenities and rain protection', category: 'shade' },
        { section: 'Sections 116-120', tip: 'Close to action with overhang above', category: 'value' },
        { section: 'The Pen', tip: 'Fun social atmosphere', category: 'experience' },
        { section: 'Bleachers 147-150', tip: 'Rowdy crowd, full sun when roof open', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: ['Ivar\'s Fish & Chips', 'Garlic fries', 'Dungeness crab sandwich', 'Pike Place Market offerings'],
      local: ['Din Tai Fung dumplings', 'Ballard Pizza', 'Paseo Caribbean sandwiches', 'Ezell\'s fried chicken'],
      healthy: ['Intentional Foods', 'Salads', 'Fresh fruit', 'Veggie options'],
      vegetarian: ['Field Roast veggie dogs', 'Impossible burgers', 'Veggie nachos'],
      glutenFree: ['GF beer', 'GF buns available', 'Rice bowls'],
      kidsFriendly: ['Kid\'s meals', 'Cotton candy', 'Dippin\' Dots'],
      alcohol: {
        beer: ['Pyramid', 'Elysian', 'Mac & Jack\'s', 'Fremont Brewing'],
        wine: true,
        cocktails: true,
        localBreweries: ['Elysian', 'Fremont', 'Georgetown', 'Stoup', 'Reuben\'s']
      }
    },
    
    parking: {
      lots: [
        { name: 'Mariners Garage', distance: 'Adjacent', price: '$35-45', shadedSpots: true, covered: true, tip: 'Most convenient but pricey' },
        { name: 'SODO lots', distance: '10 min walk', price: '$20-30', shadedSpots: false, covered: false },
        { name: 'Downtown garages', distance: '15-20 min', price: '$15-25', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['Link Light Rail to Stadium Station', 'Multiple bus routes', 'Sounder Train on game days'],
        rideShare: 'Edgar Martinez Dr drop-off zone',
        bicycle: 'Bike racks at all gates'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: '1st Ave S', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: 'Center Field Gate', location: 'Edgar Martinez Dr', bestFor: ['The Pen', 'Bleachers'], openTime: '90 minutes before first pitch' },
      { name: 'Left Field Gate', location: 'Royal Brougham Way', bestFor: ['Edgar\'s Cantina'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store - Home Plate', exclusive: ['Custom jerseys', 'Exclusive designs'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 128', 'Section 213', 'Section 329'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services Section 128'],
      atms: ['All gate entries', 'Throughout concourses'],
      wifi: { available: true, network: 'TMobilePark_WiFi' },
      chargingStations: ['Terrace Club', 'Various locations'],
      kidZones: [
        { name: 'Kids Clubhouse', location: 'Main Level', activities: ['Play area', 'Video games'] }
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
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'Available in Mariners Garage'
    },
    
    gameDay: {
      tips: [
        { title: 'Take Light Rail', description: 'Avoid parking hassles', category: 'arrival' },
        { title: 'Try Ivar\'s', description: 'Seattle seafood institution', category: 'food' },
        { title: 'Visit The Pen', description: 'Pregame social scene', category: 'experience' },
        { title: 'Check roof status', description: 'Dress accordingly', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before (Home Plate), 90 minutes (others)',
        battingPractice: 'Mariners BP 2.5 hours before',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        rushHours: ['5:00-6:30 PM on I-5 and I-90']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Weapons', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'SODO (South of Downtown)',
      description: 'Industrial area with growing food and brewery scene',
      beforeGame: ['Pyramid Alehouse', 'Hooverville Bar', 'Sluggers'],
      afterGame: ['Pioneer Square bars', 'Georgetown Brewing', 'Capitol Hill nightlife'],
      radius: '0.5-1 mile'
    },
    
    transportation: {
      address: '1250 1st Avenue S, Seattle, WA 98134',
      publicTransit: {
        subway: [{ lines: ['Link Light Rail'], station: 'Stadium Station', walkTime: '5 minutes' }],
        train: [{ lines: ['Sounder Train'], station: 'King Street Station', walkTime: '10 minutes' }],
        bus: [{ routes: ['Multiple Metro routes'], stops: ['4th Ave S', 'International District'] }]
      },
      driving: {
        majorRoutes: ['I-5 Exit 164B', 'I-90 to 4th Ave S', 'SR-99 to Atlantic St'],
        typicalTraffic: 'Heavy 5-6:30 PM',
        bestApproach: 'I-90 from east, SR-99 from north'
      },
      rideShare: {
        pickupZone: 'Edgar Martinez Dr',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to Pioneer Square for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 1999, event: 'Safeco Field opens' },
        { year: 2001, event: '116-win season' },
        { year: 2019, event: 'Renamed T-Mobile Park' }
      ],
      notableGames: [
        { date: '2001-10-06', description: 'ALDS Game 3 comeback vs Indians' },
        { date: '1995-10-08', description: 'The Double - Edgar Martinez walkoff' }
      ],
      traditions: [
        { name: 'Hydroplane races', description: 'Video board boat race' },
        { name: 'King\'s Court', description: 'Felix Hernandez cheering section' }
      ],
      retired: [
        { number: '11', player: 'Edgar Martinez', year: 2019 },
        { number: '24', player: 'Ken Griffey Jr.', year: 2016 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Passionate fans despite playoff drought',
      bestExperiences: [
        'The Pen social atmosphere',
        'Garlic fries tradition',
        'Hydroplane races',
        'Edgar\'s Cantina'
      ],
      traditions: ['Hydroplane races', 'King\'s Court for Felix', 'Refuse to Lose (1995)'],
      music: 'Alternative rock heavy, Nirvana and Pearl Jam',
      mascot: { name: 'Mariner Moose', description: 'Moose mascot since 1990' },
      fanGroups: [
        { name: 'King\'s Court', description: 'Felix Hernandez supporters' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Light Rail is fastest way to/from stadium',
        'The Pen opens early for socializing',
        'Terrace Club worth upgrade for amenities',
        'Ivar\'s fish & chips are stadium tradition',
        'Center field beer garden has best selection'
      ],
      avoidThese: [
        'Driving on I-5 during rush hour',
        'Bleachers without layers - gets cold',
        'Garlic fries if sitting close to others',
        'Leaving right at final out - wait 15 minutes'
      ],
      hiddenGems: [
        'Din Tai Fung dumplings in stadium',
        'Manual scoreboard in left field',
        'Lookout Landing deck views',
        'Hit It Here Cafe museum'
      ],
      photoSpots: [
        'Home plate entrance',
        'With Mariner Moose',
        'The Pen with downtown view',
        'Ken Griffey Jr. statue'
      ],
      bestValue: [
        'View Level corners under $20',
        'Happy Hour at The Pen',
        'Value games midweek',
        'Light Rail cheaper than parking'
      ]
    }
  },

  'marlins': {
    id: 'marlins',
    name: 'loanDepot park',
    team: 'Miami Marlins',
    opened: 2012,
    capacity: 37446,
    
    overview: {
      description: 'loanDepot park (formerly Marlins Park) features a retractable roof essential for Miami\'s heat and rain, contemporary art throughout including the iconic home run sculpture, and a Little Havana-inspired atmosphere.',
      highlights: [
        'Retractable roof for Miami weather',
        'Home run sculpture in center field',
        'Contemporary art collection throughout',
        'Air conditioning for summer comfort'
      ],
      uniqueFeatures: [
        'Clevelander Club with pool',
        'Bobblehead Museum',
        'West Plaza entertainment area',
        'Taste of Miami food options',
        'Art installations throughout'
      ],
      renovations: [
        { year: 2021, description: 'loanDepot naming rights' },
        { year: 2019, description: 'Removed home run sculpture to plaza' },
        { year: 2017, description: 'New color scheme and renovations' }
      ],
      previousNames: ['Marlins Park (2012-2020)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['All sections - roof typically closed'],
        afternoon: ['All sections with roof closed', 'Upper deck if open'],
        evening: ['All sections - climate controlled']
      },
      coveredSeating: ['All seats when roof closed (most games)', 'Upper deck overhang'],
      shadeTips: [
        'Roof closed for all summer day games',
        'AC keeps stadium comfortable',
        'When roof open (rare), upper deck provides shade',
        'Clevelander area is outdoors'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services'],
        shadedConcourses: ['All concourses covered'],
        indoorAreas: ['Entire stadium when roof closed', 'Team Store', 'Restaurants']
      },
      worstSunExposure: ['Clevelander Club pool area', 'Outfield when roof open (rare)'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 79, avgHumidity: 70, rainChance: 20, typicalConditions: 'Warm and humid', shadeTip: 'Roof closed for comfort' },
        { month: 'May', avgTemp: 83, avgHumidity: 75, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'AC essential' },
        { month: 'June', avgTemp: 87, avgHumidity: 80, rainChance: 40, typicalConditions: 'Very hot, storms', shadeTip: 'Indoor comfort' },
        { month: 'July', avgTemp: 89, avgHumidity: 80, rainChance: 45, typicalConditions: 'Peak heat/humidity', shadeTip: 'Roof always closed' },
        { month: 'August', avgTemp: 89, avgHumidity: 80, rainChance: 45, typicalConditions: 'Extreme heat', shadeTip: 'AC sanctuary' },
        { month: 'September', avgTemp: 87, avgHumidity: 80, rainChance: 40, typicalConditions: 'Still very hot', shadeTip: 'Roof closed most games' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive dining', 'Premium bar', 'Padded seats'], access: 'Behind home plate' },
          { name: 'Clevelander Club', perks: ['Pool access', 'Party atmosphere', 'Standing room'], access: 'Left field' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'AC']
        },
        specialAreas: [
          { name: 'Clevelander', description: 'Pool and party area in left field', capacity: 240 },
          { name: 'Bobblehead Museum', description: 'Unique memorabilia display' }
        ]
      },
      budgetOptions: ['Upper Reserved', 'Upper Corner Box', 'Standing room'],
      familySections: ['Family Sections 32-34'],
      standingRoom: ['Clevelander', 'West Plaza'],
      partyAreas: [
        { name: 'Clevelander', capacity: '240', amenities: ['Pool', 'DJ', 'Full bar', 'Dancing'] },
        { name: 'West Plaza', capacity: '500', amenities: ['Pre-game entertainment', 'Food trucks'] }
      ],
      tips: [
        { section: 'Diamond Club', tip: 'Best AC and all-inclusive experience', category: 'experience' },
        { section: 'Sections 15-21', tip: 'Behind plate, great views', category: 'view' },
        { section: 'Clevelander', tip: 'Party scene, not for baseball purists', category: 'experience' },
        { section: 'Upper Reserved', tip: 'Budget seats with AC comfort', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['Cuban sandwich', 'Croquetas', 'Empanadas', '305 Lime IPA'],
      local: ['Pincho Factory burgers', 'Doce Provisions Latin food', 'Panna ice cream', 'Arepas'],
      healthy: ['Salads', 'Fruit cups', 'Veggie wraps'],
      vegetarian: ['Black bean burgers', 'Veggie empanadas', 'Salads'],
      glutenFree: ['GF options at various stands'],
      kidsFriendly: ['Pizza', 'Hot dogs', 'Popcorn', 'Cotton candy'],
      alcohol: {
        beer: ['MIA Beer Company', 'Funky Buddha', 'Wynwood Brewing', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['MIA Beer Company', 'Wynwood', 'Funky Buddha', 'J. Wakefield']
      }
    },
    
    parking: {
      lots: [
        { name: 'Garage 1-6', distance: 'Adjacent', price: '$20-40', shadedSpots: true, covered: true, tip: 'Garage 6 usually cheapest' },
        { name: 'Street parking', distance: 'Various', price: 'Metered', shadedSpots: false, covered: false, tip: 'Limited availability' }
      ],
      alternativeTransport: {
        publicTransit: ['Metromover to Museum Park Station (20 min walk)', 'Miami Trolley'],
        rideShare: 'NW 7th Street designated area',
        bicycle: 'Citi Bike stations nearby'
      }
    },
    
    gates: [
      { name: 'East Plaza', location: 'NE 6th St', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch' },
      { name: 'West Plaza', location: 'NW 6th St', bestFor: ['Clevelander', 'Left field'], openTime: '2 hours before first pitch' },
      { name: 'North Gate', location: 'North side', bestFor: ['Upper deck'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store - East Plaza', exclusive: ['City Connect jerseys', 'Cuban heritage items'] },
        { location: 'Various kiosks' }
      ],
      firstAid: ['Section 13', 'Section 27', 'Section 40'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services Section 13'],
      atms: ['All gate areas', 'Throughout concourses'],
      wifi: { available: true, network: 'Marlins_WiFi' },
      chargingStations: ['Various concourse locations'],
      kidZones: [
        { name: 'Kids Zone', location: 'West Plaza', activities: ['Playground', 'Games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['All parking garages connected']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: 'All garages have ADA spaces'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive early for West Plaza', description: 'Pre-game entertainment and activities', category: 'arrival' },
        { title: 'Try Cuban sandwich', description: 'Miami classic', category: 'food' },
        { title: 'Enjoy the AC', description: 'Escape Miami heat', category: 'weather' },
        { title: 'Check out art collection', description: 'Throughout stadium', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before (2 hours West Plaza)',
        battingPractice: 'Limited access',
        firstPitch: '6:40 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        rushHours: ['5:00-6:30 PM on I-95 and 836']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Little Havana',
      description: 'Cuban cultural district',
      beforeGame: ['Ball & Chain', 'Azucar Ice Cream', 'Versailles Restaurant'],
      afterGame: ['Calle Ocho bars', 'Downtown Miami', 'Wynwood district'],
      radius: '1-2 miles'
    },
    
    transportation: {
      address: '501 Marlins Way, Miami, FL 33125',
      publicTransit: {
        subway: [{ lines: ['Metromover'], station: 'Museum Park', walkTime: '20 minutes' }],
        bus: [{ routes: ['Miami Trolley'], stops: ['NW 3rd St'] }]
      },
      driving: {
        majorRoutes: ['I-95 to 836 West', 'FL-836 Exit 2A', 'US-1 to NW 7th St'],
        typicalTraffic: 'Heavy 5-7 PM',
        bestApproach: '836 from west, I-95 from north/south'
      },
      rideShare: {
        pickupZone: 'NW 7th Street',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to 8th St for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 2012, event: 'Marlins Park opens' },
        { year: 1997, event: 'First World Series (at old stadium)' },
        { year: 2003, event: 'Second World Series (at old stadium)' },
        { year: 2021, event: 'Renamed loanDepot park' }
      ],
      notableGames: [
        { date: '2012-04-04', description: 'First game at Marlins Park' }
      ],
      traditions: [
        { name: 'Home run sculpture', description: 'Animated display (now in plaza)' },
        { name: 'Latin music', description: 'Salsa and reggaeton between innings' }
      ],
      retired: [
        { number: '16', player: 'Jose Fernandez', year: 2017 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Laid-back Miami vibe, growing young fanbase',
      bestExperiences: [
        'Clevelander party atmosphere',
        'Cuban food options',
        'Art collection tours',
        'AC comfort in summer'
      ],
      traditions: ['Home run sculpture celebration', 'Latin music', 'Miami culture celebration'],
      music: 'Heavy Latin influence - salsa, reggaeton, Latin pop',
      mascot: { name: 'Billy the Marlin', description: 'Marlin mascot since 1993' },
      fanGroups: [
        { name: 'Marlins Mermaids', description: 'Dance team' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'West Plaza opens early with entertainment',
        'Garage 6 is cheapest parking option',
        'Diamond Club worth it for all-inclusive',
        'Cuban sandwich at Section 10 is best',
        'Upper deck great value with AC'
      ],
      avoidThese: [
        'Driving without pre-paid parking',
        'Clevelander if wanting to watch game',
        'I-95 right after game',
        'Sitting outside in summer day games'
      ],
      hiddenGems: [
        'Bobblehead Museum',
        'Art collection throughout',
        'Taste of Miami behind section 27',
        'Views from upper deck corners'
      ],
      photoSpots: [
        'Home run sculpture in plaza',
        'With Billy the Marlin',
        'Art installations',
        'Clevelander pool area'
      ],
      bestValue: [
        'Upper Reserved under $15',
        'Weekday day games',
        'Student/military discounts',
        'Garage 6 parking'
      ]
    }
  },

  'mets': {
    id: 'mets',
    name: 'Citi Field',
    team: 'New York Mets',
    opened: 2009,
    capacity: 41922,
    
    overview: {
      description: 'Citi Field in Queens pays homage to Brooklyn\'s Ebbets Field with its exterior facade, features the Mets Hall of Fame and Museum, and offers diverse food options reflecting NYC\'s multiculturalism including Shake Shack and Pat LaFrieda\'s steaks.',
      highlights: [
        'Jackie Robinson Rotunda entrance',
        'Shake Shack in center field',
        'Mets Hall of Fame and Museum',
        'Views of Flushing Bay and LaGuardia Airport'
      ],
      uniqueFeatures: [
        'Home Run Apple in center field',
        'Shea Bridge connecting to old stadium site',
        'FanFest area for kids',
        'World\'s Fair Marina beyond right field',
        'Taste of the City food court'
      ],
      renovations: [
        { year: 2012, description: 'Outfield walls moved in' },
        { year: 2013, description: 'New HD video boards' },
        { year: 2018, description: 'Renovated club areas' }
      ],
      previousNames: []
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Promenade Level behind home plate', 'Sections 415-425'],
        afternoon: ['Third base side all levels', 'Promenade Level 400-435', 'Coca-Cola Corner'],
        evening: ['Most sections after 5 PM', 'First base side gains shade']
      },
      coveredSeating: ['Promenade Club', 'Caesar\'s Club', 'Limited overhang areas'],
      shadeTips: [
        'Third base/left field side best for day games',
        'Promenade Level provides shade for Field Level',
        'Pepsi Porch can be very sunny',
        'Excelsior Level has some overhang coverage'
      ],
      sunProtection: {
        sunscreenStations: ['First Aid stations'],
        shadedConcourses: ['All concourse levels'],
        indoorAreas: ['Mets Hall of Fame', 'Caesar\'s Club', 'Team Stores']
      },
      worstSunExposure: ['Pepsi Porch', 'Right field sections', 'Outfield Reserved'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 57, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool and variable', shadeTip: 'Sun not intense yet' },
        { month: 'May', avgTemp: 67, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant spring', shadeTip: 'Third base side for afternoon' },
        { month: 'June', avgTemp: 76, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warming up', shadeTip: 'Shade becomes important' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 20, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck or third base' },
        { month: 'August', avgTemp: 81, avgHumidity: 70, rainChance: 20, typicalConditions: 'Peak summer heat', shadeTip: 'Shade essential for day games' },
        { month: 'September', avgTemp: 73, avgHumidity: 65, rainChance: 20, typicalConditions: 'Cooling down', shadeTip: 'More comfortable overall' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Delta Sky360 Club', perks: ['All-inclusive food/drinks', 'Private entrance', 'Padded seats'], access: 'Behind home plate' },
          { name: 'Caesar\'s Club', perks: ['Sports betting lounge', 'Premium dining', 'Bar'], access: 'First base side' }
        ],
        suites: {
          levels: ['Sterling Level', 'Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Coca-Cola Corner', description: 'Left field family area', capacity: 500 },
          { name: 'Pepsi Porch', description: 'Right field party deck', capacity: 400 }
        ]
      },
      budgetOptions: ['Promenade Reserved', 'Outfield Box', 'Standing room'],
      familySections: ['Coca-Cola Corner', 'Family Sunday sections'],
      standingRoom: ['Shea Bridge', 'Center field plaza'],
      partyAreas: [
        { name: 'Pepsi Porch', capacity: '400', amenities: ['Tables', 'Bar service', 'Standing room'] },
        { name: 'FanFest', capacity: '200', amenities: ['Kids activities', 'Games'] }
      ],
      tips: [
        { section: 'Sections 110-114', tip: 'Behind plate, great views', category: 'view' },
        { section: 'Promenade 415-425', tip: 'Best shade and value', category: 'shade' },
        { section: 'Pepsi Porch', tip: 'Fun but very sunny', category: 'experience' },
        { section: 'Caesar\'s Club', tip: 'AC and betting lounge', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: ['Shake Shack', 'Pat LaFrieda steak sandwich', 'Fuku chicken', 'Blue Smoke BBQ'],
      local: ['Mama\'s of Corona subs', 'Box Frites Belgian fries', 'Nicoletta pizza', 'El Verano Taco'],
      healthy: ['Salad options', 'Fresh fruit', 'Veggie wraps'],
      vegetarian: ['Beyond burgers', 'Veggie options at most stands'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Kids meals', 'Pizza', 'Ice cream helmets'],
      alcohol: {
        beer: ['Mikkeller Brewing', 'Brooklyn Brewery', 'Blue Point', 'Coors'],
        wine: true,
        cocktails: true,
        localBreweries: ['Mikkeller', 'Brooklyn', 'Blue Point', 'SingleCut']
      }
    },
    
    parking: {
      lots: [
        { name: 'Citi Field Lots', distance: 'Adjacent', price: '$40', shadedSpots: false, covered: false, tip: 'Reserve online' },
        { name: 'Southfield Lot', distance: '10 min walk', price: '$40', shadedSpots: false, covered: false },
        { name: 'Marina Lot', distance: '15 min walk', price: '$40', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['7 train to Mets-Willets Point', 'LIRR to Mets-Willets Point'],
        rideShare: 'Roosevelt Ave drop-off',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Jackie Robinson Rotunda', location: 'Home plate', bestFor: ['Main entrance'], openTime: '2 hours before first pitch' },
      { name: 'Bullpen Gate', location: 'Right field', bestFor: ['Pepsi Porch'], openTime: '90 minutes before first pitch' },
      { name: 'Left Field Gate', location: 'Left field', bestFor: ['Coca-Cola Corner'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Mets Team Store - Rotunda', exclusive: ['Custom jerseys', 'Exclusive items'] },
        { location: 'Various kiosks' }
      ],
      firstAid: ['Section 114', 'Section 313', 'Section 413'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['First Aid stations'],
      atms: ['All gates', 'Throughout concourses'],
      wifi: { available: true, network: 'CitiField_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'FanFest', location: 'Center field', activities: ['Wiffle ball', 'Video games', 'Playground'] }
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
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'All lots have ADA spaces'
    },
    
    gameDay: {
      tips: [
        { title: 'Take the 7 train', description: 'Easiest way to stadium', category: 'arrival' },
        { title: 'Get Shake Shack early', description: 'Lines get very long', category: 'food' },
        { title: 'Visit Mets Museum', description: 'Free with ticket', category: 'experience' },
        { title: 'Check out Shea Bridge', description: 'Connection to history', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before (Rotunda), 90 minutes (others)',
        battingPractice: 'Mets BP 2.5 hours before',
        firstPitch: '7:10 PM weekdays, 7:10 PM Saturdays, 1:40 PM Sundays',
        rushHours: ['5:00-7:00 PM on Grand Central Parkway']
      },
      security: {
        allowedBags: 'Soft bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Umbrellas', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Flushing',
      description: 'Diverse Queens neighborhood',
      beforeGame: ['Flushing Chinatown restaurants', 'Corona Park'],
      afterGame: ['Roosevelt Ave bars', 'Flushing Main Street'],
      radius: '0.5-1 mile'
    },
    
    transportation: {
      address: '41 Seaver Way, Queens, NY 11368',
      publicTransit: {
        subway: [{ lines: ['7 Express/Local'], station: 'Mets-Willets Point', walkTime: '5 minutes' }],
        train: [{ lines: ['LIRR Port Washington'], station: 'Mets-Willets Point', walkTime: '5 minutes' }]
      },
      driving: {
        majorRoutes: ['Grand Central Parkway', 'I-678 Whitestone Expwy', 'Northern Blvd'],
        typicalTraffic: 'Heavy on GCP and LIE',
        bestApproach: 'GCP from east or west'
      },
      rideShare: {
        pickupZone: 'Roosevelt Ave',
        dropoffZone: 'Same as pickup',
        surgePricing: '3-5x after games',
        alternativeTip: 'Take 7 train instead'
      }
    },
    
    history: {
      timeline: [
        { year: 2009, event: 'Citi Field opens' },
        { year: 2013, event: 'All-Star Game hosted' },
        { year: 2015, event: 'World Series appearance' }
      ],
      notableGames: [
        { date: '2016-09-26', description: 'Wild Card clincher' },
        { date: '2015-10-31', description: 'World Series Game 4' }
      ],
      traditions: [
        { name: 'Home Run Apple', description: 'Rises from center field after homers' },
        { name: 'Meet the Mets', description: 'Team song' }
      ],
      retired: [
        { number: '14', player: 'Gil Hodges', year: 1973 },
        { number: '16', player: 'Dwight Gooden', year: 1996 },
        { number: '17', player: 'Keith Hernandez', year: 2022 },
        { number: '18', player: 'Darryl Strawberry', year: 1996 },
        { number: '24', player: 'Willie Mays', year: 1973 },
        { number: '31', player: 'Mike Piazza', year: 2016 },
        { number: '36', player: 'Jerry Koosman', year: 1981 },
        { number: '37', player: 'Casey Stengel', year: 1965 },
        { number: '41', player: 'Tom Seaver', year: 1988 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Passionate Queens crowd, rivalry with Yankees',
      bestExperiences: [
        'Home Run Apple tradition',
        'Shake Shack burgers',
        'Jackie Robinson Rotunda',
        '7 Line Army fan section'
      ],
      traditions: ['Home Run Apple', 'Meet the Mets song', 'Ya Gotta Believe'],
      music: 'NYC mix - hip-hop, rock, Latin',
      mascot: { name: 'Mr. Met', description: 'Baseball-headed mascot since 1964' },
      fanGroups: [
        { name: '7 Line Army', section: 'Big Apple Reserve', description: 'Die-hard fan group' }
      ]
    },
    
    proTips: {
      insiderTips: [
        '7 train express saves time',
        'Shake Shack line shortest at first pitch',
        'Promenade Level best value',
        'Pat LaFrieda steak sandwich worth the price',
        'FanFest great for kids before game'
      ],
      avoidThese: [
        'Driving on Grand Central Parkway',
        'Pepsi Porch for day games - no shade',
        'Parking without reservation',
        'Shake Shack in 3rd inning - huge lines'
      ],
      hiddenGems: [
        'Mets Hall of Fame and Museum',
        'Mama\'s of Corona subs',
        'Jim Beam Bourbon Bar',
        'View from Shea Bridge'
      ],
      photoSpots: [
        'Jackie Robinson Rotunda',
        'With Mr. Met',
        'Home Run Apple',
        'Shea Bridge with old stadium site'
      ],
      bestValue: [
        'Promenade Reserved seats',
        'Coca-Cola Corner for families',
        'Student nights',
        'Take mass transit vs parking'
      ]
    }
  }
};

// Continue with more MLB stadiums...