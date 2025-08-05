import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides2: Record<string, StadiumGuide> = {
  'erie-seawolves': {
    id: 'erie-seawolves',
    name: 'UPMC Park',
    team: 'Erie SeaWolves',
    opened: 1995,
    capacity: 6000,
    
    overview: {
      description: 'UPMC Park sits on Erie\'s bayfront, offering stunning views of Presque Isle Bay and Lake Erie while providing an intimate baseball experience in Pennsylvania\'s Great Lakes region.',
      highlights: [
        'Lake Erie views',
        'Bayfront location',
        'Tigers Double-A affiliate',
        'Maritime theme'
      ],
      uniqueFeatures: [
        'Bayfront views',
        'Wolf Pack picnic pavilion',
        'Kids zone with lighthouse',
        'Beach area beyond outfield',
        'Nautical decorations'
      ],
      renovations: [
        { year: 2015, description: 'Major renovations' },
        { year: 2020, description: 'New LED lighting' }
      ],
      previousNames: ['Jerry Uht Park (1995-2015)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-107 behind home plate'],
        afternoon: ['Third base side 108-114', 'Suites'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Luxury suites', 'Pavilion areas'],
      shadeTips: [
        'Lake breeze provides cooling',
        'Third base side for afternoon',
        'Upper rows have overhang',
        'Lake effect weather variable'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Suite level', 'Team Store']
      },
      worstSunExposure: ['Right field bleachers', 'Sections 115-120'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 48, avgHumidity: 70, rainChance: 35, typicalConditions: 'Cool and damp', shadeTip: 'Dress warm' },
        { month: 'May', avgTemp: 59, avgHumidity: 65, rainChance: 30, typicalConditions: 'Variable spring', shadeTip: 'Layers essential' },
        { month: 'June', avgTemp: 69, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Lake breeze helps' },
        { month: 'July', avgTemp: 74, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm', shadeTip: 'Seek shade afternoons' },
        { month: 'August', avgTemp: 73, avgHumidity: 70, rainChance: 25, typicalConditions: 'Humid', shadeTip: 'Third base side best' },
        { month: 'September', avgTemp: 66, avgHumidity: 70, rainChance: 30, typicalConditions: 'Cooling', shadeTip: 'Comfortable conditions' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Bayview Club', perks: ['All-inclusive food/drinks', 'Bay views'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Wolf Pack Pavilion', description: 'Left field picnic area', capacity: 200 },
          { name: 'Beach Party Deck', description: 'Right field deck', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats'],
      familySections: ['Sections 201-203'],
      standingRoom: ['Concourse', 'Beach deck'],
      partyAreas: [
        { name: 'Wolf Pack Pavilion', capacity: '200', amenities: ['Picnic tables', 'Private bar'] },
        { name: 'Beach Party Deck', capacity: '150', amenities: ['Standing room', 'Beach theme'] }
      ],
      tips: [
        { section: 'Sections 101-107', tip: 'Best overall views', category: 'view' },
        { section: 'Beach Party Deck', tip: 'Fun atmosphere', category: 'experience' },
        { section: 'Third base side', tip: 'Afternoon shade', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Smith\'s hot dogs', 'Pepperoni balls', 'Lake perch'],
      local: ['Smith\'s provisions', 'Romolo chocolates', 'Erie brewing'],
      healthy: ['Salads', 'Grilled fish'],
      vegetarian: ['Veggie options', 'Salads'],
      kidsFriendly: ['Hot dogs', 'Pizza', 'Ice cream'],
      alcohol: {
        beer: ['Erie Brewing', 'Lavery Brewing', 'Voodoo Brewery'],
        wine: true,
        cocktails: false,
        localBreweries: ['Erie Brewing', 'Lavery', 'Voodoo']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'Bayfront lots', distance: '5-10 min walk', price: '$3-5', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['EMTA buses'],
        rideShare: 'State Street entrance',
        bicycle: 'Bayfront bike path'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'State Street', bestFor: ['All sections'], openTime: '60 minutes before first pitch' },
      { name: 'Bayfront Gate', location: 'Bayfront side', bestFor: ['Pavilion areas'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'SeaWolves Store', exclusive: ['SeaWolves gear', 'Tigers items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Behind right field', activities: ['Playground', 'Lighthouse climb'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['To suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available near gates'
    },
    
    gameDay: {
      tips: [
        { title: 'Lake perch sandwich', description: 'Local specialty', category: 'food' },
        { title: 'Bayfront walk', description: 'Great before games', category: 'experience' },
        { title: 'Friday fireworks', description: 'Over the bay', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:05 PM weekdays, 6:05 PM Saturdays, 1:35 PM Sundays',
        rushHours: ['5:00-6:00 PM on Bayfront Highway']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Bayfront District',
      description: 'Erie\'s waterfront entertainment area',
      beforeGame: ['Bayfront restaurants', 'Presque Isle visits'],
      afterGame: ['Downtown Erie bars', 'Bayfront district'],
      radius: '0.5-1 mile'
    },
    
    transportation: {
      address: '831 French St, Erie, PA 16501',
      publicTransit: {
        bus: [{ routes: ['EMTA various routes'], stops: ['Bayfront'] }]
      },
      driving: {
        majorRoutes: ['I-90 to State Street', 'I-79 to Bayfront'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'Bayfront Parkway'
      },
      rideShare: {
        pickupZone: 'State Street',
        dropoffZone: 'Same',
        surgePricing: '1.5x after games',
        alternativeTip: 'Walk to downtown for options'
      }
    },
    
    history: {
      timeline: [
        { year: 1995, event: 'Jerry Uht Park opens' },
        { year: 2015, event: 'Renamed UPMC Park' }
      ],
      traditions: [
        { name: 'SeaWolf howl', description: 'Fan tradition' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Relaxed lakefront baseball',
      bestExperiences: [
        'Bay views',
        'Friday fireworks',
        'Beach party deck',
        'Local food options'
      ],
      traditions: ['SeaWolf howl', 'Wave the flag'],
      music: 'Classic with nautical themes',
      mascot: { name: 'C. Wolf', description: 'SeaWolf mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Bayfront walk before games',
        'Lake perch is must-try',
        'Beach deck for social scene',
        'Thursday deals'
      ],
      avoidThese: [
        'Right field in afternoon sun',
        'Limited parking on fireworks nights'
      ],
      hiddenGems: [
        'Erie Brewing beers',
        'Bayfront views at sunset',
        'Romolo chocolates'
      ],
      photoSpots: [
        'Bay backdrop',
        'With C. Wolf',
        'Beach area'
      ],
      bestValue: [
        'General admission',
        'Thursday promotions',
        'Bleacher seats'
      ]
    }
  },

  'reading-fightin-phils': {
    id: 'reading-fightin-phils',
    name: 'FirstEnergy Stadium',
    team: 'Reading Fightin Phils',
    opened: 1951,
    capacity: 9000,
    
    overview: {
      description: 'FirstEnergy Stadium, America\'s Classic Ballpark, combines historic charm with modern amenities, featuring the unique Fightin Phils brand and the famous Crazy Hot Dog Vendor.',
      highlights: [
        'Historic ballpark since 1951',
        'Phillies Double-A affiliate',
        'Crazy Hot Dog Vendor',
        'Pool pavilion'
      ],
      uniqueFeatures: [
        'Pool beyond right field',
        'Tiki Terrace',
        'Savage 61 restaurant',
        'Historic facade',
        'Reading Pagoda view'
      ],
      renovations: [
        { year: 1998, description: 'Major renovation' },
        { year: 2013, description: 'Pool pavilion added' },
        { year: 2019, description: 'New video board' }
      ],
      previousNames: ['Municipal Memorial Stadium (1951-2013)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 1-8 behind home plate'],
        afternoon: ['Third base side 9-15', 'Upper deck'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Suites', 'Upper deck overhang', 'Tiki Terrace'],
      shadeTips: [
        'Upper deck provides shade below',
        'Third base side for afternoon',
        'Pool area partially shaded',
        'Pennsylvania summers hot'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Savage 61', 'Team Store']
      },
      worstSunExposure: ['Right field sections', 'Lower box 16-20'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 54, avgHumidity: 60, rainChance: 30, typicalConditions: 'Cool spring', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 65, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant', shadeTip: 'Comfortable' },
        { month: 'June', avgTemp: 74, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warming', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 79, avgHumidity: 70, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck or third base' },
        { month: 'August', avgTemp: 77, avgHumidity: 70, rainChance: 25, typicalConditions: 'Continued heat', shadeTip: 'Pool area popular' },
        { month: 'September', avgTemp: 70, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling', shadeTip: 'Comfortable evenings' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Savage 61 Club', perks: ['All-inclusive food/drinks', 'AC'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'HDTV']
        },
        specialAreas: [
          { name: 'Pool Pavilion', description: 'Right field pool area', capacity: 200 },
          { name: 'Tiki Terrace', description: 'Left field deck', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', 'Lawn seating'],
      familySections: ['Sections 1-3'],
      standingRoom: ['Concourse', 'Tiki Terrace'],
      partyAreas: [
        { name: 'Pool Pavilion', capacity: '200', amenities: ['Pool', 'Cabanas', 'Bar'] },
        { name: 'Tiki Terrace', capacity: '150', amenities: ['Tiki bar', 'Tables'] }
      ],
      tips: [
        { section: 'Sections 1-8', tip: 'Best views', category: 'view' },
        { section: 'Pool Pavilion', tip: 'Unique experience', category: 'experience' },
        { section: 'Upper deck', tip: 'Shade and value', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Crazy Hot Dog Vendor', 'Cheesesteak', 'Barrel 21 IPA'],
      local: ['PA Dutch treats', 'Yuengling', 'Soft pretzels'],
      healthy: ['Salads', 'Grilled options'],
      vegetarian: ['Veggie burgers', 'Salads'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin\' Dots'],
      alcohol: {
        beer: ['Yuengling', 'Sly Fox', 'Victory'],
        wine: true,
        cocktails: true,
        localBreweries: ['Sly Fox', 'Victory', 'Stoudts']
      }
    },
    
    parking: {
      lots: [
        { name: 'Main Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'Route 61 lots', distance: '5 min walk', price: '$3-5', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['BARTA buses'],
        rideShare: 'Centre Avenue entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Centre Avenue', bestFor: ['All sections'], openTime: '60 minutes before first pitch' },
      { name: 'Right Field Gate', location: 'Pool entrance', bestFor: ['Pool Pavilion'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Baseballtown Team Store', exclusive: ['Fightin Phils gear', 'Crazy Hot Dog items'] }
      ],
      firstAid: ['Behind section 5'],
      babyChanging: ['Family restrooms'],
      nursingRooms: ['Guest Services'],
      atms: ['Main concourse'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Behind stands', activities: ['Playground', 'Speed pitch', 'Bounce house'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['To all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available near main gate'
    },
    
    gameDay: {
      tips: [
        { title: 'Crazy Hot Dog show', description: 'Must-see entertainment', category: 'experience' },
        { title: 'Pool reservations', description: 'Book in advance', category: 'experience' },
        { title: 'Baseballtown history', description: 'Explore displays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:45 PM weekdays, 6:45 PM Saturdays, 1:15 PM Sundays',
        rushHours: ['5:00-6:30 PM on Route 61']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Exeter Township',
      description: 'Suburban Reading area',
      beforeGame: ['Brass Lantern', 'Giannotti\'s'],
      afterGame: ['Downtown Reading', 'West Reading'],
      radius: '3-5 miles'
    },
    
    transportation: {
      address: '1900 Centre Ave, Reading, PA 19605',
      publicTransit: {
        bus: [{ routes: ['BARTA various routes'], stops: ['Stadium'] }]
      },
      driving: {
        majorRoutes: ['Route 422 to Route 61', 'I-176 to Route 61'],
        typicalTraffic: 'Moderate on Route 61',
        bestApproach: 'Route 61 North'
      },
      rideShare: {
        pickupZone: 'Main entrance',
        dropoffZone: 'Same',
        surgePricing: '1.5-2x after games',
        alternativeTip: 'Schedule in advance'
      }
    },
    
    history: {
      timeline: [
        { year: 1951, event: 'Stadium opens' },
        { year: 1967, event: 'Phillies affiliation begins' },
        { year: 2013, event: 'Pool pavilion added' }
      ],
      traditions: [
        { name: 'Crazy Hot Dog Vendor', description: 'Legendary vendor show' },
        { name: 'Baseballtown', description: 'Reading baseball heritage' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Fun, family-friendly with unique attractions',
      bestExperiences: [
        'Crazy Hot Dog Vendor',
        'Pool parties',
        'Tiki Terrace',
        'Saturday fireworks'
      ],
      traditions: ['Crazy Hot Dog chants', 'Fightin Phils rallies'],
      music: 'Energetic with fun themes',
      mascot: { name: 'Change Up', description: 'Ostrich mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Pool tickets sell out fast',
        'Crazy Hot Dog performs 3rd/7th innings',
        'Tiki Terrace great for groups',
        'Upper deck best value'
      ],
      avoidThese: [
        'Right field in afternoon',
        'Route 61 traffic after fireworks'
      ],
      hiddenGems: [
        'Savage 61 restaurant',
        'Historic displays',
        'Local brewery selection'
      ],
      photoSpots: [
        'Pool area',
        'With Crazy Hot Dog Vendor',
        'Historic facade'
      ],
      bestValue: [
        'Upper deck seats',
        'Tuesday promotions',
        'General admission'
      ]
    }
  },

  'new-hampshire-fisher-cats': {
    id: 'new-hampshire-fisher-cats',
    name: 'Delta Dental Stadium',
    team: 'New Hampshire Fisher Cats',
    opened: 2005,
    capacity: 6500,
    
    overview: {
      description: 'Delta Dental Stadium in Manchester offers modern amenities with New England charm, serving as the Blue Jays\' Double-A affiliate in the heart of New Hampshire\'s largest city.',
      highlights: [
        'Downtown Manchester location',
        'Blue Jays affiliate',
        'Modern facility',
        'New England charm'
      ],
      uniqueFeatures: [
        'Fisher Cat Den',
        'Hotel overlooks field',
        'Kids Fun Zone',
        'Granite State deck',
        'Manchester skyline views'
      ],
      renovations: [
        { year: 2011, description: 'New video board' },
        { year: 2019, description: 'Clubhouse renovations' },
        { year: 2021, description: 'LED field lighting' }
      ],
      previousNames: ['Fisher Cats Ballpark (2005-2010)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 100-106 behind home plate'],
        afternoon: ['Third base side 107-113', 'Club level'],
        evening: ['Most sections after 5:30 PM']
      },
      coveredSeating: ['Suites', 'Club level'],
      shadeTips: [
        'Third base side for afternoon',
        'New England weather variable',
        'Upper rows provide shade',
        'Can be cool even in summer'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Relations'],
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Club level', 'Team Store']
      },
      worstSunExposure: ['Right field sections', 'Sections 114-118'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 48, avgHumidity: 60, rainChance: 30, typicalConditions: 'Cool and wet', shadeTip: 'Dress warm' },
        { month: 'May', avgTemp: 60, avgHumidity: 60, rainChance: 30, typicalConditions: 'Spring weather', shadeTip: 'Layers needed' },
        { month: 'June', avgTemp: 69, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Perfect baseball weather' },
        { month: 'July', avgTemp: 74, avgHumidity: 65, rainChance: 25, typicalConditions: 'Warm', shadeTip: 'Shade helpful afternoons' },
        { month: 'August', avgTemp: 73, avgHumidity: 70, rainChance: 25, typicalConditions: 'Best weather', shadeTip: 'Comfortable most areas' },
        { month: 'September', avgTemp: 65, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling', shadeTip: 'Evening games cool' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Samuel Adams Pub', perks: ['All-inclusive food/drinks', 'Pub atmosphere'], access: 'Third base side' }
        ],
        suites: {
          levels: ['Suite Level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Fisher Cat Den', description: 'Left field deck', capacity: 100 },
          { name: 'Granite State Deck', description: 'Right field party area', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', 'Lawn seating'],
      familySections: ['Sections 200-202'],
      standingRoom: ['Concourse', 'Decks'],
      partyAreas: [
        { name: 'Fisher Cat Den', capacity: '100', amenities: ['Private bar', 'Tables'] },
        { name: 'Granite State Deck', capacity: '150', amenities: ['Standing room', 'Bar service'] }
      ],
      tips: [
        { section: 'Sections 100-106', tip: 'Best views', category: 'view' },
        { section: 'Samuel Adams Pub', tip: 'Great atmosphere', category: 'experience' },
        { section: 'Third base side', tip: 'Afternoon shade', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: ['Manchester hot dog', 'Maple bacon donuts', 'Sam Adams beer'],
      local: ['New England clam chowder', 'Lobster rolls', 'Local craft beers'],
      healthy: ['Salads', 'Grilled options'],
      vegetarian: ['Veggie burgers', 'Salads'],
      kidsFriendly: ['Hot dogs', 'Pizza', 'Ice cream'],
      alcohol: {
        beer: ['Samuel Adams', 'Smuttynose', 'Tuckerman'],
        wine: true,
        cocktails: true,
        localBreweries: ['Smuttynose', 'Tuckerman', '603 Brewery']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown garages', distance: '5-10 min walk', price: '$5-10', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['Manchester Transit buses'],
        rideShare: 'Line Drive entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Line Drive', bestFor: ['All sections'], openTime: '60 minutes before first pitch' },
      { name: 'Third Base Gate', location: 'Third base side', bestFor: ['Pub, suites'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Fisher Cats Team Store', exclusive: ['Fisher Cats gear', 'Blue Jays items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Third base side'],
      wifi: { available: true, network: 'FisherCats_WiFi' },
      kidZones: [
        { name: 'Fun Zone', location: 'Behind right field', activities: ['Playground', 'Speed pitch', 'Bounce house'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['To all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available near main gate'
    },
    
    gameDay: {
      tips: [
        { title: 'Sam Adams Pub', description: 'Unique ballpark pub', category: 'experience' },
        { title: 'Atlas Fireworks', description: 'Best in MiLB', category: 'experience' },
        { title: 'Downtown dining', description: 'Walk to restaurants', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: '6:35 PM weekdays, 6:05 PM Saturdays, 1:35 PM Sundays',
        rushHours: ['5:00-6:00 PM on I-293']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Manchester',
      description: 'Urban center of New Hampshire',
      beforeGame: ['Cotton restaurant', 'Strange Brew Tavern'],
      afterGame: ['Elm Street bars', 'Downtown nightlife'],
      radius: '0.5 mile'
    },
    
    transportation: {
      address: '1 Line Dr, Manchester, NH 03101',
      publicTransit: {
        bus: [{ routes: ['Manchester Transit'], stops: ['Downtown'] }]
      },
      driving: {
        majorRoutes: ['I-293 Exit 5', 'Route 101 to downtown'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-293 to Granite Street'
      },
      rideShare: {
        pickupZone: 'Line Drive',
        dropoffZone: 'Same',
        surgePricing: '1.5-2x after games',
        alternativeTip: 'Walk downtown for options'
      }
    },
    
    history: {
      timeline: [
        { year: 2005, event: 'Stadium opens' },
        { year: 2011, event: 'Blue Jays affiliation begins' }
      ],
      traditions: [
        { name: 'Atlas Fireworks', description: 'Spectacular shows' },
        { name: 'Fisher Cat races', description: 'Between innings fun' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Modern facility with New England hospitality',
      bestExperiences: [
        'Sam Adams Pub',
        'Atlas Fireworks',
        'Downtown location',
        'Blue Jays prospects'
      ],
      traditions: ['Fisher Cat races', 'Thunder clap'],
      music: 'Mix of classic and modern',
      mascot: { name: 'Fungo', description: 'Fisher cat mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Sam Adams Pub unique experience',
        'Downtown parking cheaper',
        'Atlas Fireworks worth staying',
        'Thursday deals best value'
      ],
      avoidThese: [
        'Stadium lot on fireworks nights',
        'Right field in afternoon'
      ],
      hiddenGems: [
        'Hotel rooms overlook field',
        'Local brewery selection',
        'Downtown restaurant scene'
      ],
      photoSpots: [
        'With Fungo',
        'Manchester skyline',
        'Sam Adams Pub'
      ],
      bestValue: [
        'General admission',
        'Thursday promotions',
        'Downtown garage parking'
      ]
    }
  }
};

export default aaStadiumGuides2;