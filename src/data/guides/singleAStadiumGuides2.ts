import { StadiumGuide } from '../stadiumGuides';

export const singleAStadiumGuides2: Record<string, StadiumGuide> = {
  'delmarva-shorebirds': {
    id: 'delmarva-shorebirds',
    name: 'Arthur W. Perdue Stadium',
    team: 'Delmarva Shorebirds',
    opened: 1996,
    capacity: 5200,

    overview: {
      description: 'Arthur W. Perdue Stadium serves as home to the Orioles Single-A affiliate on Maryland\'s Eastern Shore, featuring a family-friendly atmosphere and agricultural heritage.',
      highlights: [
        'Orioles Single-A affiliate',
        'Delmarva Peninsula location',
        'Agricultural region setting',
        'Family entertainment focus',
        'Eastern Shore charm'
      ],
      uniqueFeatures: [
        'Chicken-themed promotions',
        'Agricultural displays',
        'Natural grass field',
        'Eastern Shore culture',
        'Perdue Farms connection'
      ],
      renovations: [
        { year: 2001, description: 'Seating expansion' },
        { year: 2015, description: 'LED lighting installation' },
        { year: 2019, description: 'Concourse improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Box seats'],
        afternoon: ['Sections 200-210', 'Premium areas'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Limited covered areas', 'Premium sections'],
      shadeTips: [
        'Eastern Shore summers humid',
        'Limited shade structures',
        'Third base side preferred',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Team store', 'Concession areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 70, avgHumidity: 68, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 78, avgHumidity: 70, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Shade becoming valuable' },
        { month: 'July', avgTemp: 83, avgHumidity: 72, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Evening games ideal' },
        { month: 'August', avgTemp: 82, avgHumidity: 73, rainChance: 35, typicalConditions: 'Peak humidity', shadeTip: 'Shade essential' },
        { month: 'September', avgTemp: 75, avgHumidity: 70, rainChance: 30, typicalConditions: 'More comfortable', shadeTip: 'Pleasant evenings' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering options']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Left field group area', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Lawn areas'],
      familySections: ['Family sections available'],
      standingRoom: ['Concourse areas'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '200',
          description: 'Left field picnic area',
          amenities: ['Covered area', 'Picnic tables', 'Group seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade coverage', category: 'shade' },
        { section: 'Picnic area', tip: 'Great for groups and families', category: 'experience' },
        { section: 'Bleachers', tip: 'Budget-friendly option', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Crab cakes', 'Chicken sandwiches', 'Eastern Shore corn'],
      local: ['Maryland crab', 'Chicken products', 'Sweet corn', 'Old Bay fries'],
      healthy: ['Grilled chicken', 'Salads'],
      vegetarian: ['Veggie options', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['National Bohemian', 'Maryland craft beers'],
        wine: false,
        cocktails: false,
        localBreweries: ['Evolution Craft', 'Dogfish Head']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: 'Free', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '300 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Plenty of free lot parking'
      },
      alternativeTransport: {
        publicTransit: ['Limited bus service'],
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
        { location: 'Shorebirds Team Store', exclusive: ['Shorebirds gear', 'Orioles items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated accessible areas'],
        entrance: 'Main gate accessible',
        elevators: ['To suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '20 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Eastern Shore Culture', description: 'Experience Delmarva charm', category: 'experience' },
        { title: 'Chicken Connection', description: 'Perdue Farms heritage', category: 'experience' },
        { title: 'Maryland Crab', description: 'Try local seafood', category: 'food' },
        { title: 'Family Focus', description: 'Great kids entertainment', category: 'experience' }
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
      name: 'Salisbury',
      description: 'Eastern Shore city with agricultural heritage',
      beforeGame: ['Downtown Salisbury', 'Local restaurants'],
      afterGame: ['Downtown establishments'],
      radius: '5 miles'
    },

    transportation: {
      address: '6400 Hobbs Rd, Salisbury, MD 21804',
      publicTransit: {
        bus: [
          { routes: ['Shore Transit'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['US-50', 'US-13', 'Route 12'],
        typicalTraffic: 'Light',
        bestApproach: 'US-50 to Hobbs Road'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1996, event: 'Perdue Stadium opens' },
        { year: 1996, event: 'Shorebirds inaugural season' },
        { year: 1997, event: 'Became Orioles affiliate' }
      ],
      traditions: [
        { name: 'Chicken Races', description: 'Perdue Farms themed entertainment' },
        { name: 'Eastern Shore Pride', description: 'Delmarva culture celebration' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly Eastern Shore baseball',
      bestExperiences: [
        'Eastern Shore hospitality',
        'Agricultural heritage',
        'Family entertainment',
        'Orioles organizational connection'
      ],
      traditions: [
        'Chicken races',
        'Crab shuffle',
        'Eastern Shore celebrations'
      ],
      mascot: {
        name: 'Sherman the Shorebird',
        description: 'Orange shorebird mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Free parking is plentiful',
        'Try Maryland crab cakes',
        'Family entertainment excellent',
        'Eastern Shore charm throughout'
      ],
      avoidThese: [
        'Limited shade on hot days',
        'First base side in afternoon',
        'Missing local seafood options'
      ],
      hiddenGems: [
        'Perdue Farms connection',
        'Eastern Shore culture',
        'Downtown Salisbury nearby',
        'Agricultural displays'
      ],
      photoSpots: [
        'With Sherman mascot',
        'Chicken-themed areas',
        'Eastern Shore signage',
        'Agricultural displays'
      ],
      bestValue: [
        'Free parking',
        'General admission flexibility',
        'Family packages',
        'Weeknight games'
      ]
    }
  },

  'down-east-wood-ducks': {
    id: 'down-east-wood-ducks',
    name: 'Grainger Stadium',
    team: 'Down East Wood Ducks',
    opened: 1949,
    capacity: 4100,

    overview: {
      description: 'Historic Grainger Stadium in Kinston serves as home to the Rangers Single-A affiliate, featuring classic ballpark charm and Eastern North Carolina hospitality.',
      highlights: [
        'Rangers Single-A affiliate',
        'Historic ballpark since 1949',
        'Eastern North Carolina location',
        'Classic architecture',
        'Small-town baseball'
      ],
      uniqueFeatures: [
        'Historic grandstand',
        'Wood Duck pond beyond outfield',
        'Natural grass field',
        'Classic brick construction',
        'Traditional scoreboard'
      ],
      renovations: [
        { year: 1994, description: 'Major renovation' },
        { year: 2012, description: 'Further improvements' },
        { year: 2017, description: 'Wood Ducks rebrand updates' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base grandstand', 'Covered areas'],
        afternoon: ['Under grandstand roof', 'Third base side'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Grandstand roof sections', 'Box seats'],
      shadeTips: [
        'Eastern NC summers hot and humid',
        'Historic grandstand provides good cover',
        'Third base side preferred',
        'Evening games much more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Under grandstand'],
        indoorAreas: ['Limited indoor areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Bleacher sections', 'First base side'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 67, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 75, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade helpful' },
        { month: 'June', avgTemp: 82, avgHumidity: 71, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'July', avgTemp: 86, avgHumidity: 73, rainChance: 40, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 85, avgHumidity: 74, rainChance: 40, typicalConditions: 'Peak heat', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 79, avgHumidity: 71, rainChance: 35, typicalConditions: 'Still warm', shadeTip: 'More bearable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Limited premium options'],
          amenities: ['Enhanced seating']
        }
      },
      budgetOptions: ['General admission', 'Bleacher seats'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Limited concourse areas'],
      tips: [
        { section: 'Grandstand', tip: 'Classic covered seating', category: 'shade' },
        { section: 'Behind home plate', tip: 'Best traditional views', category: 'view' },
        { section: 'Third base side', tip: 'Better shade angles', category: 'shade' },
        { section: 'Bleachers', tip: 'Budget option but no shade', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Eastern NC BBQ', 'Wood Duck wings', 'Tobacco Road treats'],
      local: ['North Carolina BBQ', 'Sweet tea', 'Hush puppies', 'Collard greens'],
      healthy: ['Limited healthy options'],
      vegetarian: ['Basic options'],
      glutenFree: ['Very limited'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Limited craft selection'],
        wine: false,
        cocktails: false,
        localBreweries: ['Mother Earth Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: 'Free', shadedSpots: false, covered: false },
        { name: 'Street Parking', distance: 'Variable', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'None on game days',
        tip: 'Plenty of free options'
      },
      alternativeTransport: {
        publicTransit: ['Very limited'],
        rideShare: 'Limited availability',
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
        { location: 'Wood Ducks Team Store', exclusive: ['Wood Ducks gear', 'Rangers items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Limited facilities'],
      atms: ['Main entrance'],
      wifi: { available: false },
      kidZones: [
        { name: 'Kids Area', location: 'Outfield', activities: ['Small play area'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Limited accessible areas'],
        entrance: 'Main gate accessible',
        elevators: ['Not applicable']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Limited'],
      accessibleConcessions: ['Main stand'],
      parkingSpaces: '10 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Historic Charm', description: 'Classic ballpark experience', category: 'experience' },
        { title: 'Eastern NC BBQ', description: 'Try authentic style', category: 'food' },
        { title: 'Small Town Baseball', description: 'Community atmosphere', category: 'experience' },
        { title: 'Summer Heat', description: 'Evening games essential', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:00 PM',
        rushHours: ['Game time arrival']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: false
      }
    },

    neighborhood: {
      name: 'Kinston',
      description: 'Small Eastern North Carolina town',
      beforeGame: ['Downtown Kinston', 'Local restaurants'],
      afterGame: ['Limited nightlife'],
      radius: '2 miles'
    },

    transportation: {
      address: '400 E Grainger Ave, Kinston, NC 28501',
      publicTransit: {
        bus: [
          { routes: ['No public transit'], stops: [] }
        ]
      },
      driving: {
        majorRoutes: ['US-70', 'US-258', 'Highway 11'],
        typicalTraffic: 'Light',
        bestApproach: 'US-70 to downtown'
      },
      rideShare: {
        pickupZone: 'Stadium area',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal if available'
      }
    },

    history: {
      timeline: [
        { year: 1949, event: 'Grainger Stadium opens' },
        { year: 2017, event: 'Rebrand to Wood Ducks' },
        { year: 2017, event: 'Became Rangers affiliate' }
      ],
      traditions: [
        { name: 'Historic Baseball', description: 'Long minor league tradition' },
        { name: 'Small Town Pride', description: 'Community support' }
      ]
    },

    fanExperience: {
      atmosphere: 'Classic small-town baseball charm',
      bestExperiences: [
        'Historic ballpark atmosphere',
        'Eastern NC hospitality',
        'Traditional baseball experience',
        'Community feel'
      ],
      traditions: [
        'Wood Duck calls',
        'Eastern NC pride',
        'Traditional seventh-inning stretch'
      ],
      mascot: {
        name: 'Dewie the Wood Duck',
        description: 'Wood duck mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Historic charm worth experiencing',
        'Free parking everywhere',
        'Try authentic Eastern NC BBQ',
        'Small-town hospitality genuine'
      ],
      avoidThese: [
        'Day games in summer',
        'Limited amenities expectations',
        'Bleachers on hot days'
      ],
      hiddenGems: [
        'Historic ballpark features',
        'Wood duck pond views',
        'Traditional scoreboard',
        'Small-town atmosphere'
      ],
      photoSpots: [
        'Historic grandstand',
        'With Dewie mascot',
        'Classic scoreboard',
        'Wood duck pond'
      ],
      bestValue: [
        'Free parking',
        'Affordable tickets',
        'General admission flexibility',
        'Family pricing'
      ]
    }
  },

  'fredericksburg-nationals': {
    id: 'fredericksburg-nationals',
    name: 'Virginia Credit Union Stadium',
    team: 'Fredericksburg Nationals',
    opened: 2020,
    capacity: 5000,

    overview: {
      description: 'Virginia Credit Union Stadium is one of the newest parks in Minor League Baseball, serving as home to the Nationals Single-A affiliate with state-of-the-art amenities.',
      highlights: [
        'Nationals Single-A affiliate',
        'Opened in 2020',
        'Brand new facility',
        'Northern Virginia location',
        'Modern amenities throughout'
      ],
      uniqueFeatures: [
        'State-of-the-art design',
        'Rappahannock River proximity',
        'Modern video board',
        'Synthetic turf field',
        '360-degree concourse'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Modern design includes shade features',
        'Virginia summers hot and humid',
        'Third base side preferred',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 63, rainChance: 35, typicalConditions: 'Variable spring', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 71, avgHumidity: 66, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 79, avgHumidity: 69, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Shade becoming valuable' },
        { month: 'July', avgTemp: 83, avgHumidity: 71, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'August', avgTemp: 82, avgHumidity: 72, rainChance: 35, typicalConditions: 'Continued heat', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 75, avgHumidity: 69, rainChance: 30, typicalConditions: 'More comfortable', shadeTip: 'Pleasant evenings' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Founders Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private entrance'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Left field group area', capacity: 150 }
        ]
      },
      budgetOptions: ['General admission', 'Lawn seating', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Left Field Party Deck',
          capacity: '150',
          description: 'Group party area',
          amenities: ['Bar service', 'Tables', 'Standing room']
        }
      ],
      tips: [
        { section: 'Founders Club', tip: 'All-inclusive premium experience', category: 'experience' },
        { section: '360 concourse', tip: 'Walk for different views', category: 'experience' },
        { section: 'Third base side', tip: 'Better shade coverage', category: 'shade' },
        { section: 'Party Deck', tip: 'Social atmosphere', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Fred Nats Nachos', 'Virginia ham biscuits', 'Rappahannock oysters'],
      local: ['Virginia wines', 'Local craft beers', 'Regional specialties'],
      healthy: ['Grilled options', 'Salads', 'Fresh items'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Virginia craft selection', 'National brands'],
        wine: true,
        cocktails: true,
        localBreweries: ['Strangeways', 'Red Dragon', 'Adventure Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lots', distance: '300-500 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots'
      },
      alternativeTransport: {
        publicTransit: ['FRED Transit'],
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
        tip: 'Modern entrance plaza'
      },
      {
        name: 'Left Field Gate',
        location: 'Outfield entrance',
        bestFor: ['Party deck', 'Outfield seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'FredNats Team Store', exclusive: ['FredNats gear', 'Nationals items'] }
      ],
      firstAid: ['Multiple locations'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Available'],
      atms: ['Throughout'],
      wifi: { available: true, network: 'FredNats_WiFi' },
      chargingStations: ['Multiple locations'],
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Interactive games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All areas fully accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple elevators']
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
        { title: 'Brand New Park', description: 'Newest facility in MiLB', category: 'experience' },
        { title: 'DC Proximity', description: 'Nationals fans common', category: 'experience' },
        { title: 'Modern Amenities', description: 'State-of-the-art throughout', category: 'experience' },
        { title: 'Virginia Heat', description: 'Evening games preferable', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30-45 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Fredericksburg',
      description: 'Historic Virginia city between DC and Richmond',
      beforeGame: ['Historic downtown', 'Civil War sites', 'Local restaurants'],
      afterGame: ['Downtown bars', 'Historic district'],
      radius: '5 miles'
    },

    transportation: {
      address: '42 Jackie Robinson Way, Fredericksburg, VA 22401',
      publicTransit: {
        bus: [
          { routes: ['FRED Transit'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['I-95', 'US-1', 'Route 3'],
        typicalTraffic: 'Moderate, heavy from DC',
        bestApproach: 'I-95 to Route 3'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2020, event: 'Stadium opens' },
        { year: 2020, event: 'Move from Woodbridge' },
        { year: 2020, event: 'FredNats inaugural season' }
      ],
      traditions: [
        { name: 'New Beginning', description: 'Building new traditions' },
        { name: 'Nationals Connection', description: 'DC organization ties' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern facility with growing traditions',
      bestExperiences: [
        'Brand new amenities',
        '360-degree concourse',
        'Modern technology throughout',
        'Growing fan base'
      ],
      traditions: [
        'George Washington race',
        'Nationals heritage',
        'Virginia celebrations'
      ],
      mascot: {
        name: 'Gus',
        description: 'Baseball-headed mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Newest park in professional baseball',
        'All modern amenities available',
        'Historic Fredericksburg worth exploring',
        'DC fans make the trip'
      ],
      avoidThese: [
        'I-95 traffic from DC',
        'Summer afternoon games',
        'Limited parking on big nights'
      ],
      hiddenGems: [
        'State-of-the-art everything',
        'Historic city location',
        'Civil War history nearby',
        'Growing entertainment district'
      ],
      photoSpots: [
        'Modern entrance plaza',
        'With Gus mascot',
        '360 concourse views',
        'New park signage'
      ],
      bestValue: [
        'General admission flexibility',
        'Weeknight games',
        'Group packages',
        'Student discounts'
      ]
    }
  }
};