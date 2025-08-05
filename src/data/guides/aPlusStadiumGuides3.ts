import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides3: Record<string, StadiumGuide> = {
  'dayton-dragons': {
    id: 'dayton-dragons',
    name: 'Day Air Ballpark',
    team: 'Dayton Dragons',
    opened: 2000,
    capacity: 8200,

    overview: {
      description: 'Day Air Ballpark in downtown Dayton is one of the most successful venues in Minor League Baseball, with the Dragons holding the longest sellout streak in professional sports history.',
      highlights: [
        'Reds High-A affiliate',
        'Record sellout streak (1,400+ games)',
        'Downtown Dayton location',
        'Great Miami River adjacent',
        'Family-friendly atmosphere'
      ],
      uniqueFeatures: [
        'Dragons-themed entertainment',
        'Downtown skyline views',
        'Historic sellout streak',
        'Natural grass field',
        'Aviation heritage displays'
      ],
      renovations: [
        { year: 2011, description: 'LED lighting and video board' },
        { year: 2018, description: 'Concourse improvements' },
        { year: 2021, description: 'Premium seating upgrades' }
      ],
      previousNames: ['Fifth Third Field (2000-2020)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Dragon\'s Lair'],
        afternoon: ['Sections 210-220', 'Suite level'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Dragon\'s Lair', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Ohio summers can be hot and humid',
        'Third base side gets shade first',
        'Dragon\'s Lair offers climate control',
        'Evening games most comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Dragon\'s Lair', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base bleachers', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 65, rainChance: 40, typicalConditions: 'Cool and variable', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 68, avgHumidity: 67, rainChance: 40, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable most areas' },
        { month: 'June', avgTemp: 77, avgHumidity: 69, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Shade becomes valuable' },
        { month: 'July', avgTemp: 81, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck recommended' },
        { month: 'August', avgTemp: 79, avgHumidity: 71, rainChance: 35, typicalConditions: 'Continued heat', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Perfect baseball weather' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Dragon\'s Lair',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Private entrance', 'Field views'],
            access: 'Premium club behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Bleacher seats', 'Upper deck corners'],
      familySections: ['Family Zone sections', 'Alcohol-free areas'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Party Deck',
          capacity: '150',
          description: 'Left field group area',
          amenities: ['Private bar', 'Tables', 'Group pricing']
        }
      ],
      tips: [
        { section: 'Dragon\'s Lair', tip: 'All-inclusive premium experience', category: 'experience' },
        { section: 'Behind home plate', tip: 'Best views of action', category: 'view' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Lawn', tip: 'Great value for families', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Dragon Dog', 'Frisch\'s Big Boy', 'LaRosa\'s Pizza', 'Montgomery Inn BBQ'],
      local: ['Cincinnati-style chili', 'Goetta', 'LaRosa\'s pizza', 'Local ice cream'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Budweiser', 'Miller Lite', 'Local Ohio craft beers'],
        wine: true,
        cocktails: false,
        localBreweries: ['Warped Wing', 'Taft\'s Ale House', 'Dayton Beer Company']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$8', shadedSpots: false, covered: false },
        { name: 'Downtown Garages', distance: '0.2-0.5 miles', price: '$5-10', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 6 PM',
        tip: 'Free street parking after 6 PM'
      },
      alternativeTransport: {
        publicTransit: ['RTA bus service'],
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
        name: 'Monument Avenue Gate',
        location: 'Third base side',
        bestFor: ['Third base seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Dragons Team Store', exclusive: ['Dragons gear', 'Reds items', 'Sellout streak memorabilia'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['All family restrooms'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Dragons_WiFi' },
      chargingStations: ['Dragon\'s Lair', 'Concourse areas'],
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Speed pitch', 'Interactive games'] }
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
      accessibleConcessions: ['All major stands'],
      parkingSpaces: '25+ ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Arrive Early', description: 'Sellout crowds are common', category: 'arrival' },
        { title: 'LaRosa\'s Pizza', description: 'Try the local favorite', category: 'food' },
        { title: 'Sellout Streak', description: 'Part of sports history', category: 'experience' },
        { title: 'Downtown Location', description: 'Walk to restaurants/bars', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        battingPractice: 'Limited for High-A',
        firstPitch: 'Varies by day',
        rushHours: ['45 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Downtown Dayton',
      description: 'Revitalized downtown with dining and entertainment',
      beforeGame: ['Oregon District', 'RiverScape MetroPark', 'Downtown restaurants'],
      afterGame: ['Oregon District bars', 'Downtown entertainment'],
      radius: '1 mile'
    },

    transportation: {
      address: '220 N Patterson Blvd, Dayton, OH 45402',
      publicTransit: {
        bus: [
          { routes: ['RTA routes'], stops: ['Downtown Dayton'] }
        ]
      },
      driving: {
        majorRoutes: ['I-75', 'I-70', 'US-35'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-75 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Monument Avenue',
        dropoffZone: 'Main gate area',
        surgePricing: 'Moderate on game nights'
      }
    },

    history: {
      timeline: [
        { year: 2000, event: 'Fifth Third Field opens' },
        { year: 2000, event: 'Dragons begin sellout streak' },
        { year: 2011, event: 'Sellout streak reaches 1,000 games' },
        { year: 2021, event: 'Renamed Day Air Ballpark' }
      ],
      notableGames: [
        { date: '2000-04-27', description: 'First sellout begins historic streak' },
        { date: '2011-06-20', description: '1,000th consecutive sellout' }
      ],
      traditions: [
        { name: 'Sellout Streak', description: 'Longest in professional sports' },
        { name: 'Dragons Entertainment', description: 'Non-stop between-inning fun' }
      ]
    },

    fanExperience: {
      atmosphere: 'Electric atmosphere with passionate fanbase',
      bestExperiences: [
        'Part of historic sellout streak',
        'Non-stop entertainment',
        'Downtown Dayton location',
        'Family-friendly atmosphere'
      ],
      traditions: [
        'Dragons entertainment team',
        'Roof! Roof! chant',
        'Sellout streak celebrations'
      ],
      mascot: {
        name: 'Heater and Gem',
        description: 'Dragon mascots providing entertainment'
      }
    },

    proTips: {
      insiderTips: [
        'Buy tickets well in advance - sellouts common',
        'Dragon\'s Lair worth upgrade for all-inclusive',
        'Try LaRosa\'s pizza - Cincinnati favorite',
        'Explore Oregon District before/after games'
      ],
      avoidThese: [
        'Don\'t wait to buy tickets - they sell out',
        'Avoid driving if possible - parking limited',
        'Skip first base side in afternoon sun'
      ],
      hiddenGems: [
        'Historic sellout streak displays',
        'Aviation heritage exhibits',
        'Downtown Dayton renaissance',
        'Great Miami River walks'
      ],
      photoSpots: [
        'With Dragons mascots',
        'Sellout streak commemorative area',
        'Downtown Dayton skyline',
        'Dragons entrance sign'
      ],
      bestValue: [
        'Lawn seating when available',
        'Downtown garage parking',
        'Group packages sell out early',
        'Weeknight games if available'
      ]
    }
  },

  'daytona-tortugas': {
    id: 'daytona-tortugas',
    name: 'Jackie Robinson Ballpark',
    team: 'Daytona Tortugas',
    opened: 1914,
    capacity: 5100,

    overview: {
      description: 'Jackie Robinson Ballpark is a historic venue where Jackie Robinson broke baseball\'s color barrier in 1946, now serving as home to the Reds High-A affiliate near Daytona Beach.',
      highlights: [
        'Historic ballpark since 1914',
        'Jackie Robinson history',
        'Reds High-A affiliate',
        'Near Daytona Beach',
        'Classic Florida baseball'
      ],
      uniqueFeatures: [
        'Jackie Robinson statue and museum',
        'Historic grandstand preserved',
        'Halifax River nearby',
        'Natural grass field',
        'Spring training history'
      ],
      renovations: [
        { year: 2011, description: 'Major renovation and restoration' },
        { year: 2015, description: 'Clubhouse improvements' },
        { year: 2019, description: 'Concourse upgrades' }
      ],
      previousNames: ['City Island Ball Park (1914-1990)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base grandstand', 'Covered areas'],
        afternoon: ['Sections under roof', 'Third base side'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Grandstand roof sections', 'Premium areas'],
      shadeTips: [
        'Florida sun is intense year-round',
        'Covered grandstand essential',
        'Ocean breeze provides some relief',
        'Hydration crucial'
      ],
      sunProtection: {
        shadedConcourses: ['Under grandstand'],
        indoorAreas: ['Museum area', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Bleacher sections', 'First base side'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 76, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Shade helpful but bearable' },
        { month: 'May', avgTemp: 82, avgHumidity: 72, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Covered seating recommended' },
        { month: 'June', avgTemp: 87, avgHumidity: 75, rainChance: 45, typicalConditions: 'Hot with afternoon storms', shadeTip: 'Cover for sun and rain' },
        { month: 'July', avgTemp: 89, avgHumidity: 76, rainChance: 50, typicalConditions: 'Very hot and humid', shadeTip: 'Covered seating essential' },
        { month: 'August', avgTemp: 89, avgHumidity: 77, rainChance: 50, typicalConditions: 'Peak heat and storms', shadeTip: 'Shade and rain protection' },
        { month: 'September', avgTemp: 86, avgHumidity: 75, rainChance: 45, typicalConditions: 'Still hot', shadeTip: 'Evening games better' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Limited premium options'],
          amenities: ['Enhanced seating', 'Better views']
        }
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Lawn areas'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Concourse areas'],
      tips: [
        { section: 'Covered grandstand', tip: 'Essential for Florida sun', category: 'shade' },
        { section: 'Behind home plate', tip: 'Best views under cover', category: 'view' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Bleachers', tip: 'Budget option but no shade', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Tortuga Taco', 'Beach Dog', 'Florida citrus items'],
      local: ['Cuban sandwich', 'Grouper sandwich', 'Key lime pie', 'Florida orange juice'],
      healthy: ['Grilled fish', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie tacos', 'Salads'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Budweiser', 'Corona', 'Florida craft beers'],
        wine: false,
        cocktails: false,
        localBreweries: ['Daytona Beach Brewing', 'Tomoka Brewery']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '300 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited near stadium',
        tip: 'Arrive early for close parking'
      },
      alternativeTransport: {
        publicTransit: ['Votran bus service'],
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
        { location: 'Tortugas Team Store', exclusive: ['Tortugas gear', 'Jackie Robinson items'] }
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
        elevators: ['Limited due to historic nature']
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
        { title: 'Jackie Robinson History', description: 'Visit museum and statue', category: 'experience' },
        { title: 'Florida Heat', description: 'Bring sun protection', category: 'weather' },
        { title: 'Beach Proximity', description: 'Combine with beach visit', category: 'experience' },
        { title: 'Afternoon Storms', description: 'Common in summer', category: 'weather' }
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
      name: 'Daytona Beach',
      description: 'Famous beach town with racing and tourism',
      beforeGame: ['Daytona Beach', 'Boardwalk', 'Local restaurants'],
      afterGame: ['Beach bars', 'Ocean Walk'],
      radius: '5 miles'
    },

    transportation: {
      address: '105 E Orange Ave, Daytona Beach, FL 32114',
      publicTransit: {
        bus: [
          { routes: ['Votran routes'], stops: ['Downtown Daytona'] }
        ]
      },
      driving: {
        majorRoutes: ['I-95', 'I-4', 'US-1'],
        typicalTraffic: 'Heavy during tourist season',
        bestApproach: 'I-95 to International Speedway Blvd'
      },
      rideShare: {
        pickupZone: 'Stadium area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher during events and tourist season'
      }
    },

    history: {
      timeline: [
        { year: 1914, event: 'Ballpark opens' },
        { year: 1946, event: 'Jackie Robinson breaks color barrier' },
        { year: 1990, event: 'Renamed Jackie Robinson Ballpark' },
        { year: 2011, event: 'Major renovation completed' }
      ],
      notableGames: [
        { date: '1946-03-17', description: 'Jackie Robinson\'s historic first game' }
      ],
      traditions: [
        { name: 'Jackie Robinson Legacy', description: 'Celebrating civil rights history' },
        { name: 'Spring Training Heritage', description: 'Long spring training history' }
      ]
    },

    fanExperience: {
      atmosphere: 'Historic charm with beachtown vibe',
      bestExperiences: [
        'Jackie Robinson history',
        'Classic ballpark atmosphere',
        'Beach proximity',
        'Florida baseball tradition'
      ],
      traditions: [
        'Jackie Robinson tributes',
        'Beach-themed promotions',
        'Spring training heritage'
      ],
      mascot: {
        name: 'Shelldon',
        description: 'Turtle mascot representing Tortugas name'
      }
    },

    proTips: {
      insiderTips: [
        'Visit Jackie Robinson statue and museum',
        'Covered grandstand essential for sun',
        'Combine with beach visit',
        'Evening games more comfortable'
      ],
      avoidThese: [
        'Bleachers in afternoon sun',
        'Underestimating Florida heat',
        'Missing the historic displays'
      ],
      hiddenGems: [
        'Jackie Robinson museum',
        'Historic grandstand architecture',
        'Halifax River nearby',
        'Spring training history displays'
      ],
      photoSpots: [
        'Jackie Robinson statue',
        'Historic grandstand entrance',
        'With Shelldon mascot',
        'Classic ballpark views'
      ],
      bestValue: [
        'General admission tickets',
        'Bleacher seats if sun tolerant',
        'Weeknight games',
        'Group packages'
      ]
    }
  },

  'eugene-emeralds': {
    id: 'eugene-emeralds',
    name: 'PK Park',
    team: 'Eugene Emeralds',
    opened: 2010,
    capacity: 4000,

    overview: {
      description: 'PK Park serves as home to both the Eugene Emeralds and University of Oregon Ducks baseball, featuring modern amenities in the heart of Oregon\'s Willamette Valley.',
      highlights: [
        'Giants High-A affiliate',
        'Shared with Oregon Ducks',
        'Modern facility opened 2010',
        'Willamette Valley location',
        'Pacific Northwest setting'
      ],
      uniqueFeatures: [
        'University of Oregon partnership',
        'Cascade Mountains views',
        'Artificial turf field',
        'Duck and Emerald dual branding',
        'Nike connections'
      ],
      renovations: [
        { year: 2015, description: 'Seating expansion' },
        { year: 2019, description: 'LED lighting upgrade' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Covered areas'],
        afternoon: ['Sections 7-10', 'Premium areas'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Limited covered sections', 'Premium areas'],
      shadeTips: [
        'Oregon summers surprisingly warm',
        'Limited covered seating available',
        'Evening games most comfortable',
        'Willamette Valley can be hot'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Team store', 'Club areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base side', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 75, rainChance: 45, typicalConditions: 'Cool and often rainy', shadeTip: 'Rain gear more important than shade' },
        { month: 'May', avgTemp: 64, avgHumidity: 70, rainChance: 35, typicalConditions: 'Variable spring weather', shadeTip: 'Layers recommended' },
        { month: 'June', avgTemp: 70, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Comfortable most areas' },
        { month: 'July', avgTemp: 79, avgHumidity: 55, rainChance: 10, typicalConditions: 'Warm and dry', shadeTip: 'Shade valuable afternoons' },
        { month: 'August', avgTemp: 79, avgHumidity: 55, rainChance: 10, typicalConditions: 'Peak summer', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 72, avgHumidity: 65, rainChance: 20, typicalConditions: 'Perfect weather', shadeTip: 'Comfortable throughout' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Limited premium options'],
          amenities: ['Enhanced seating', 'Better amenities']
        }
      },
      budgetOptions: ['General admission', 'Lawn areas', 'Bleachers'],
      familySections: ['Family areas available'],
      standingRoom: ['Concourse areas', 'Berm'],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of action', category: 'view' },
        { section: 'Third base side', tip: 'Better sun angles', category: 'shade' },
        { section: 'Berm', tip: 'Relaxed atmosphere', category: 'experience' },
        { section: 'Bleachers', tip: 'Budget-friendly option', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Emerald Dog', 'Northwest specialties', 'Local food trucks'],
      local: ['Oregon craft beers', 'Marionberry items', 'Portland coffee', 'Food trucks'],
      healthy: ['Organic options', 'Salads', 'Veggie items'],
      vegetarian: ['Multiple veggie options', 'Portland-style food'],
      glutenFree: ['Available options'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Ice cream'],
      alcohol: {
        beer: ['Ninkasi', 'Deschutes', 'Oregon craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Ninkasi', 'Oakshire', 'Hop Valley']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'University Lots', distance: '0.3 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited near campus',
        tip: 'Arrive early on Ducks game days'
      },
      alternativeTransport: {
        publicTransit: ['LTD bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Eugene bike-friendly with racks'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Team Store', exclusive: ['Emeralds gear', 'Giants items', 'Oregon Ducks items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Area', location: 'Outfield', activities: ['Play area'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['ADA compliant throughout'],
        entrance: 'All entrances accessible',
        elevators: ['Available as needed']
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
        { title: 'Oregon Craft Beer', description: 'Excellent local selection', category: 'food' },
        { title: 'Food Trucks', description: 'Portland-style food truck options', category: 'food' },
        { title: 'University Setting', description: 'College town atmosphere', category: 'experience' },
        { title: 'Nike Country', description: 'Nike/Oregon connections visible', category: 'experience' }
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
      name: 'Eugene',
      description: 'College town and outdoor recreation hub',
      beforeGame: ['University of Oregon campus', 'Downtown Eugene', 'Local breweries'],
      afterGame: ['Campus area bars', 'Downtown entertainment'],
      radius: '5 miles'
    },

    transportation: {
      address: '2777 Martin Luther King Jr Blvd, Eugene, OR 97401',
      publicTransit: {
        bus: [
          { routes: ['LTD routes'], stops: ['University area'] }
        ]
      },
      driving: {
        majorRoutes: ['I-5', 'Highway 99', 'Highway 126'],
        typicalTraffic: 'Light except campus events',
        bestApproach: 'I-5 to Eugene exits'
      },
      rideShare: {
        pickupZone: 'Stadium area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher during University events'
      }
    },

    history: {
      timeline: [
        { year: 2010, event: 'PK Park opens' },
        { year: 2021, event: 'Became Giants High-A affiliate' }
      ],
      traditions: [
        { name: 'Oregon Baseball', description: 'Shared venue with Ducks' },
        { name: 'Eugene Pride', description: 'TrackTown USA heritage' }
      ]
    },

    fanExperience: {
      atmosphere: 'College town vibe with Pacific Northwest charm',
      bestExperiences: [
        'Oregon craft beer selection',
        'Food truck variety',
        'University atmosphere',
        'Cascade Mountain views'
      ],
      traditions: [
        'Oregon connections',
        'TrackTown USA pride',
        'Environmental consciousness'
      ],
      mascot: {
        name: 'Sluggo',
        description: 'Emerald-themed mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Try Oregon craft beers - excellent selection',
        'Food trucks offer Portland-style cuisine',
        'Check Ducks schedule to avoid conflicts',
        'Evening games best for weather'
      ],
      avoidThese: [
        'Parking issues during University events',
        'First base side in afternoon',
        'Missing the local food trucks'
      ],
      hiddenGems: [
        'University of Oregon campus nearby',
        'Pre-game at local breweries',
        'Nike/Oregon connections',
        'Willamette Valley beauty'
      ],
      photoSpots: [
        'Cascade Mountains backdrop',
        'With Sluggo mascot',
        'Oregon/Nike displays',
        'Modern facility architecture'
      ],
      bestValue: [
        'General admission flexibility',
        'Berm seating',
        'Student discounts',
        'Food truck options'
      ]
    }
  }
};