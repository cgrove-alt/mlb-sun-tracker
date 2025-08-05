import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides4: Record<string, StadiumGuide> = {
  'everett-aquasox': {
    id: 'everett-aquasox',
    name: 'Funko Field',
    team: 'Everett AquaSox',
    opened: 1984,
    capacity: 3682,

    overview: {
      description: 'Funko Field, formerly Everett Memorial Stadium, serves as home to the Mariners High-A affiliate in the Pacific Northwest, featuring intimate baseball with Puget Sound proximity.',
      highlights: [
        'Mariners High-A affiliate',
        'Funko Pop! headquarters nearby',
        'Puget Sound region',
        'Intimate atmosphere',
        'Pacific Northwest baseball'
      ],
      uniqueFeatures: [
        'Funko branding throughout',
        'Everett waterfront nearby',
        'Natural grass field',
        'Boeing factory proximity',
        'Small capacity creates intimacy'
      ],
      renovations: [
        { year: 2019, description: 'Renamed Funko Field with improvements' },
        { year: 2021, description: 'Clubhouse and facility upgrades' }
      ],
      previousNames: ['Everett Memorial Stadium (1984-2018)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Covered areas'],
        afternoon: ['Sections 5-8', 'Behind home plate'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Limited covered seating', 'Premium areas'],
      shadeTips: [
        'Pacific Northwest weather variable',
        'Summer evenings pleasant',
        'Limited shade structures',
        'Marine layer provides cooling'
      ],
      sunProtection: {
        shadedConcourses: ['Small covered areas'],
        indoorAreas: ['Team store', 'Concession areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 54, avgHumidity: 75, rainChance: 50, typicalConditions: 'Cool and often wet', shadeTip: 'Rain gear essential' },
        { month: 'May', avgTemp: 60, avgHumidity: 70, rainChance: 40, typicalConditions: 'Variable spring', shadeTip: 'Layers important' },
        { month: 'June', avgTemp: 65, avgHumidity: 68, rainChance: 30, typicalConditions: 'Improving weather', shadeTip: 'Pleasant conditions' },
        { month: 'July', avgTemp: 70, avgHumidity: 65, rainChance: 15, typicalConditions: 'Best weather', shadeTip: 'Perfect baseball weather' },
        { month: 'August', avgTemp: 71, avgHumidity: 65, rainChance: 15, typicalConditions: 'Peak summer', shadeTip: 'Ideal conditions' },
        { month: 'September', avgTemp: 65, avgHumidity: 70, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Evening layers needed' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Limited premium options'],
          amenities: ['Better seating', 'Enhanced service']
        }
      },
      budgetOptions: ['General admission', 'Bleacher seats'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Limited concourse areas'],
      tips: [
        { section: 'Behind home plate', tip: 'Best views in intimate setting', category: 'view' },
        { section: 'Third base side', tip: 'Better sun angles', category: 'shade' },
        { section: 'Bleachers', tip: 'Budget option close to action', category: 'value' }
      ]
    },

    concessions: {
      signature: ['AquaSox Dog', 'Northwest seafood', 'Funko Field Fries'],
      local: ['Pacific seafood', 'Seattle coffee', 'Washington beers'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie options available'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy'],
      alcohol: {
        beer: ['Local Washington beers', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Scuttlebutt Brewing', 'At Large Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Street Parking', distance: 'Variable', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited near stadium',
        tip: 'Arrive early for close parking'
      },
      alternativeTransport: {
        publicTransit: ['Everett Transit buses'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Behind home plate',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Team Store', exclusive: ['AquaSox gear', 'Mariners items', 'Funko collectibles'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Restroom facilities'],
      atms: ['Main entrance'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Area', location: 'Near entrance', activities: ['Small play area'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated accessible areas'],
        entrance: 'Main gate accessible',
        elevators: ['Not applicable - single level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '10 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Funko Fun', description: 'Check out Funko Pop! displays', category: 'experience' },
        { title: 'Boeing Connection', description: 'Boeing factory tours nearby', category: 'experience' },
        { title: 'Pacific Weather', description: 'Bring layers for evening', category: 'weather' },
        { title: 'Intimate Setting', description: 'Every seat close to action', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:05 PM',
        rushHours: ['Game time arrival']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Everett',
      description: 'Port city north of Seattle with Boeing presence',
      beforeGame: ['Everett waterfront', 'Downtown Everett', 'Funko headquarters'],
      afterGame: ['Local restaurants', 'Waterfront bars'],
      radius: '3 miles'
    },

    transportation: {
      address: '3900 Broadway, Everett, WA 98201',
      publicTransit: {
        bus: [
          { routes: ['Everett Transit', 'Community Transit'], stops: ['Broadway'] }
        ]
      },
      driving: {
        majorRoutes: ['I-5', 'US-2', 'Highway 99'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-5 to Broadway exit'
      },
      rideShare: {
        pickupZone: 'Stadium area',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1984, event: 'Everett Memorial Stadium opens' },
        { year: 1995, event: 'Becomes Mariners affiliate' },
        { year: 2019, event: 'Renamed Funko Field' }
      ],
      traditions: [
        { name: 'Mariners Pipeline', description: 'Developing Seattle talent' },
        { name: 'Funko Fun', description: 'Pop culture meets baseball' }
      ]
    },

    fanExperience: {
      atmosphere: 'Intimate Pacific Northwest baseball',
      bestExperiences: [
        'Close to the action',
        'Funko Pop! theme',
        'Family-friendly atmosphere',
        'Mariners prospects'
      ],
      traditions: [
        'Webbly races',
        'Funko giveaways',
        'Boeing appreciation'
      ],
      mascot: {
        name: 'Webbly',
        description: 'Frog mascot representing AquaSox name'
      }
    },

    proTips: {
      insiderTips: [
        'Every seat is close in small stadium',
        'Visit Funko headquarters nearby',
        'Boeing factory tour worth the trip',
        'Evening games perfect weather'
      ],
      avoidThese: [
        'Limited parking fills quickly',
        'Rain common in spring',
        'Small concourse can get crowded'
      ],
      hiddenGems: [
        'Funko Pop! displays',
        'Everett waterfront nearby',
        'Boeing connection',
        'Small stadium charm'
      ],
      photoSpots: [
        'With Webbly mascot',
        'Funko Field entrance',
        'Intimate stadium views',
        'Team photo opportunities'
      ],
      bestValue: [
        'General admission great value',
        'Every seat has good view',
        'Free street parking if early',
        'Affordable concessions'
      ]
    }
  },

  'fort-myers-mighty-mussels': {
    id: 'fort-myers-mighty-mussels',
    name: 'Hammond Stadium',
    team: 'Fort Myers Mighty Mussels',
    opened: 1991,
    capacity: 9300,

    overview: {
      description: 'Hammond Stadium at CenturyLink Sports Complex serves as both the spring training home of the Minnesota Twins and the regular season home of their High-A affiliate.',
      highlights: [
        'Twins High-A affiliate',
        'Twins spring training home',
        'Large capacity for High-A',
        'Southwest Florida location',
        'Major league quality facility'
      ],
      uniqueFeatures: [
        'Spring training facility',
        'Twin Lakes backdrop',
        'Major league amenities',
        'Natural grass field',
        'Florida sunshine year-round'
      ],
      renovations: [
        { year: 2014, description: 'Major expansion and renovation' },
        { year: 2020, description: 'Rebranding to Mighty Mussels' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Upper sections'],
        afternoon: ['Sections 210-216', 'Suites'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Upper deck overhang', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Florida sun intense year-round',
        'Upper deck provides shade below',
        'Hydration essential',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Team store', 'Club areas', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['Field level first base', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 81, avgHumidity: 70, rainChance: 20, typicalConditions: 'Warm and humid', shadeTip: 'Shade important all day' },
        { month: 'May', avgTemp: 86, avgHumidity: 72, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck recommended' },
        { month: 'June', avgTemp: 89, avgHumidity: 75, rainChance: 45, typicalConditions: 'Very hot, afternoon storms', shadeTip: 'Cover essential' },
        { month: 'July', avgTemp: 91, avgHumidity: 76, rainChance: 50, typicalConditions: 'Peak heat and storms', shadeTip: 'Shade and rain protection' },
        { month: 'August', avgTemp: 91, avgHumidity: 76, rainChance: 50, typicalConditions: 'Continued extreme heat', shadeTip: 'Evening games only if possible' },
        { month: 'September', avgTemp: 89, avgHumidity: 75, rainChance: 45, typicalConditions: 'Still very hot', shadeTip: 'Shade remains critical' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Twins Club',
            perks: ['Climate controlled', 'Premium dining', 'Full bar', 'Padded seats'],
            access: 'Behind home plate with A/C relief'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'TVs']
        },
        specialAreas: [
          { name: 'Berm', description: 'Outfield grass seating', capacity: 500 }
        ]
      },
      budgetOptions: ['Berm seating', 'Upper reserved', 'Standing room'],
      familySections: ['Family sections', 'Alcohol-free areas'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Party Deck',
          capacity: '100',
          description: 'Left field group area',
          amenities: ['Bar service', 'Tables', 'Shade structure']
        }
      ],
      tips: [
        { section: 'Upper deck', tip: 'Best shade and breeze', category: 'shade' },
        { section: 'Twins Club', tip: 'A/C relief from heat', category: 'experience' },
        { section: 'Berm', tip: 'Bring blanket and sunscreen', category: 'value' },
        { section: 'Third base side', tip: 'Gets shade first', category: 'shade' }
      ]
    },

    concessions: {
      signature: ['Mighty Mussel Bucket', 'Cuban sandwich', 'Grouper sandwich', 'Key lime pie'],
      local: ['Gulf seafood', 'Cuban food', 'Florida citrus', 'Tropical drinks'],
      healthy: ['Grilled fish', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie wraps', 'Salads'],
      glutenFree: ['Available at main stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Shaved ice'],
      alcohol: {
        beer: ['Budweiser', 'Corona', 'Florida craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Fort Myers Brewing', 'Bury Me Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '400 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots only'
      },
      alternativeTransport: {
        publicTransit: ['LeeTran bus service'],
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
        tip: 'Spring training entrance'
      },
      {
        name: 'Left Field Gate',
        location: 'Third base side',
        bestFor: ['Berm', 'Left field seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Twins Team Store', exclusive: ['Mighty Mussels gear', 'Twins spring training items'] }
      ],
      firstAid: ['Behind home plate', 'Upper concourse'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Hammond_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Speed pitch'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple elevators to upper levels']
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
        { title: 'Florida Heat', description: 'Bring maximum sun protection', category: 'weather' },
        { title: 'Spring Training', description: 'See major leaguers in spring', category: 'experience' },
        { title: 'Gulf Seafood', description: 'Try local seafood options', category: 'food' },
        { title: 'Afternoon Storms', description: 'Common in summer months', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        battingPractice: 'Spring training only',
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
      name: 'Fort Myers',
      description: 'Southwest Florida city near Gulf beaches',
      beforeGame: ['Gulf beaches', 'Downtown Fort Myers', 'Edison Ford estates'],
      afterGame: ['Beach bars', 'Downtown River District'],
      radius: '10 miles'
    },

    transportation: {
      address: '14100 Six Mile Cypress Pkwy, Fort Myers, FL 33912',
      publicTransit: {
        bus: [
          { routes: ['LeeTran routes'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-75', 'US-41', 'Daniels Parkway'],
        typicalTraffic: 'Heavy during tourist season',
        bestApproach: 'I-75 to Daniels Parkway'
      },
      rideShare: {
        pickupZone: 'Main parking lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher during spring training'
      }
    },

    history: {
      timeline: [
        { year: 1991, event: 'Hammond Stadium opens' },
        { year: 1991, event: 'Becomes Twins spring training home' },
        { year: 2014, event: 'Major renovation completed' },
        { year: 2020, event: 'Rebrand to Mighty Mussels' }
      ],
      traditions: [
        { name: 'Spring Training', description: 'Twins Grapefruit League home' },
        { name: 'Florida Baseball', description: 'Year-round baseball in sunshine' }
      ]
    },

    fanExperience: {
      atmosphere: 'Spring training facility with Florida charm',
      bestExperiences: [
        'Major league quality facility',
        'Spring training atmosphere',
        'Florida weather (evenings)',
        'Twins organization connection'
      ],
      traditions: [
        'Spring training traditions',
        'Mighty Mussels entertainment',
        'Florida baseball culture'
      ],
      mascot: {
        name: 'Mussel Man',
        description: 'Muscular mussel representing team rebrand'
      }
    },

    proTips: {
      insiderTips: [
        'Upper deck essential for shade',
        'Spring training brings crowds',
        'Evening games much more comfortable',
        'Twins Club worth it for A/C'
      ],
      avoidThese: [
        'Day games in summer if possible',
        'Field level in afternoon sun',
        'Underestimating Florida heat'
      ],
      hiddenGems: [
        'Spring training atmosphere',
        'Twin Lakes views',
        'Major league facility quality',
        'Twins history displays'
      ],
      photoSpots: [
        'Twins spring training signs',
        'With Mussel Man mascot',
        'Twin Lakes backdrop',
        'Spring training photo ops'
      ],
      bestValue: [
        'Berm seating for families',
        'Upper deck for shade',
        'Spring training value games',
        'Group packages'
      ]
    }
  },

  'greensboro-grasshoppers': {
    id: 'greensboro-grasshoppers',
    name: 'First National Bank Field',
    team: 'Greensboro Grasshoppers',
    opened: 2005,
    capacity: 7499,

    overview: {
      description: 'First National Bank Field in downtown Greensboro offers modern amenities and Southern hospitality as home to the Pirates High-A affiliate in North Carolina.',
      highlights: [
        'Pirates High-A affiliate',
        'Downtown Greensboro location',
        'Modern facility opened 2005',
        'North Carolina Piedmont region',
        'Family-friendly atmosphere'
      ],
      uniqueFeatures: [
        'Downtown skyline views',
        'Grasshopper-themed elements',
        'Natural grass field',
        'North Carolina brick architecture',
        'Community gathering space'
      ],
      renovations: [
        { year: 2015, description: 'LED lighting installation' },
        { year: 2019, description: 'Concourse improvements' },
        { year: 2021, description: 'Premium seating upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-218', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'North Carolina summers hot and humid',
        'Third base side gets afternoon shade',
        'Upper levels provide shade to lower',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base field level', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 65, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 74, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 81, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck recommended' },
        { month: 'July', avgTemp: 85, avgHumidity: 72, rainChance: 40, typicalConditions: 'Very hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'August', avgTemp: 84, avgHumidity: 73, rainChance: 40, typicalConditions: 'Continued heat', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 77, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still warm', shadeTip: 'More comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Grandstand Club',
            perks: ['Climate controlled', 'Premium food', 'Full bar', 'Exclusive entrance'],
            access: 'Behind home plate premium area'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Outfield Deck', description: 'Party area in left field', capacity: 150 }
        ]
      },
      budgetOptions: ['Upper reserved', 'Outfield seats', 'Standing room'],
      familySections: ['Family Zone sections', 'Alcohol-free areas'],
      standingRoom: ['Concourse areas', 'Outfield deck'],
      partyAreas: [
        {
          name: 'Left Field Deck',
          capacity: '150',
          description: 'Group party area',
          amenities: ['Private bar', 'Tables', 'Standing room']
        }
      ],
      tips: [
        { section: 'Grandstand Club', tip: 'Best amenities and A/C', category: 'experience' },
        { section: 'Behind home plate', tip: 'Great views of downtown', category: 'view' },
        { section: 'Third base upper', tip: 'Best shade value', category: 'shade' },
        { section: 'Outfield deck', tip: 'Fun party atmosphere', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Grasshopper Dog', 'Carolina BBQ', 'Pimento cheese sandwich', 'Cheerwine float'],
      local: ['North Carolina BBQ', 'Cheerwine', 'Pimento cheese', 'Sweet tea'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Natty Greene\'s', 'Red Oak', 'North Carolina craft beers'],
        wine: true,
        cocktails: false,
        localBreweries: ['Natty Greene\'s', 'Red Oak', 'Gibb\'s Hundred']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown Decks', distance: '0.3 miles', price: '$5-10', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 5 PM',
        tip: 'Free after 5 PM on streets'
      },
      alternativeTransport: {
        publicTransit: ['GTA bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Downtown Greenway access'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch',
        tip: 'Main entrance off Bellemeade'
      },
      {
        name: 'Left Field Gate',
        location: 'Third base side',
        bestFor: ['Left field seating', 'Party deck'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Grasshoppers Team Store', exclusive: ['Grasshoppers gear', 'Pirates items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['All family restrooms'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Grasshoppers_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Bounce house', 'Speed pitch'] }
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
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '25 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Carolina BBQ', description: 'Try authentic NC barbecue', category: 'food' },
        { title: 'Downtown Location', description: 'Walk to restaurants/bars', category: 'experience' },
        { title: 'Cheerwine', description: 'Local cherry soda tradition', category: 'food' },
        { title: 'Summer Heat', description: 'Evening games more comfortable', category: 'weather' }
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
      name: 'Downtown Greensboro',
      description: 'North Carolina Piedmont city with rich history',
      beforeGame: ['Downtown restaurants', 'Center City Park', 'Local breweries'],
      afterGame: ['Downtown nightlife', 'South Elm entertainment'],
      radius: '1 mile'
    },

    transportation: {
      address: '408 Bellemeade St, Greensboro, NC 27401',
      publicTransit: {
        bus: [
          { routes: ['GTA routes'], stops: ['Downtown Greensboro'] }
        ]
      },
      driving: {
        majorRoutes: ['I-40', 'I-85', 'US-220'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-40/85 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Bellemeade Street',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate on game nights'
      }
    },

    history: {
      timeline: [
        { year: 2005, event: 'First National Bank Field opens' },
        { year: 2005, event: 'Grasshoppers inaugural season' },
        { year: 2019, event: 'Became Pirates affiliate' }
      ],
      traditions: [
        { name: 'Grasshopper Entertainment', description: 'Between-inning fun' },
        { name: 'Carolina Baseball', description: 'Rich baseball tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Southern hospitality with modern amenities',
      bestExperiences: [
        'Downtown Greensboro location',
        'North Carolina BBQ',
        'Family entertainment',
        'Modern facility'
      ],
      traditions: [
        'Grasshopper races',
        'Thirsty Thursday',
        'Fireworks Fridays'
      ],
      mascot: {
        name: 'Guilford and Gopher',
        description: 'Grasshopper mascots providing entertainment'
      }
    },

    proTips: {
      insiderTips: [
        'Try Carolina BBQ - vinegar or tomato style',
        'Downtown parking decks often cheaper',
        'Thirsty Thursdays popular with crowds',
        'Explore downtown before/after games'
      ],
      avoidThese: [
        'Field level in afternoon sun',
        'Parking on busy Friday nights',
        'Missing the local food options'
      ],
      hiddenGems: [
        'Downtown Greensboro renaissance',
        'Local brewery scene',
        'Greenway trail system',
        'Civil rights history nearby'
      ],
      photoSpots: [
        'Downtown skyline backdrop',
        'With mascots Guilford and Gopher',
        'Grasshopper entrance sign',
        'Modern stadium architecture'
      ],
      bestValue: [
        'Upper deck seats',
        'Thirsty Thursday deals',
        'Group packages',
        'Downtown combo deals'
      ]
    }
  }
};