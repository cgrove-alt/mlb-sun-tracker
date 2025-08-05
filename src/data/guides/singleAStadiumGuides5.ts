import { StadiumGuide } from '../stadiumGuides';

export const singleAStadiumGuides5: Record<string, StadiumGuide> = {
  'dayton-dragons': {
    id: 'dayton-dragons',
    name: 'Day Air Ballpark',
    team: 'Dayton Dragons',
    opened: 2000,
    capacity: 8200,

    overview: {
      description: 'Day Air Ballpark in downtown Dayton serves as home to the Reds Single-A affiliate, famous for the longest sellout streak in professional sports with over 1,400 consecutive games.',
      highlights: [
        'Reds Single-A affiliate',
        'Downtown Dayton location',
        'Longest sellout streak in sports',
        'Family-friendly atmosphere',
        'Community centerpiece'
      ],
      uniqueFeatures: [
        'Downtown riverfront setting',
        'Natural grass field',
        'Dragon-themed elements',
        'Modern amenities',
        'Great Miami River views'
      ],
      renovations: [
        { year: 2011, description: 'Video board upgrade' },
        { year: 2018, description: 'Seating improvements' },
        { year: 2021, description: 'Concourse renovations' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Dragons Lair'],
      shadeTips: [
        'Ohio summers hot and humid',
        'Downtown location intensifies heat',
        'Third base side preferred',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper levels'],
        indoorAreas: ['Dragons Lair club', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 40, typicalConditions: 'Variable spring', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Pleasant', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 77, avgHumidity: 67, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Shade becoming valuable' },
        { month: 'July', avgTemp: 81, avgHumidity: 69, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'August', avgTemp: 80, avgHumidity: 70, rainChance: 30, typicalConditions: 'Continued heat', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 73, avgHumidity: 67, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant evenings' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Dragons Lair',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private bar'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Dragons Den', description: 'Left field party area', capacity: 300 },
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 1500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved', 'Bleachers'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Dragons Den'],
      partyAreas: [
        {
          name: 'Dragons Den',
          capacity: '300',
          description: 'Left field party deck',
          amenities: ['Full bar', 'Standing room', 'Group atmosphere']
        }
      ],
      tips: [
        { section: 'Dragons Lair', tip: 'All-inclusive with A/C', category: 'experience' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Lawn', tip: 'Bring blanket, arrive early', category: 'value' },
        { section: 'Dragons Den', tip: 'Party atmosphere', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Dragon Dogs', 'Dragon Fire Nachos', 'Cincinnati chili'],
      local: ['Cincinnati-style chili', 'Goetta', 'Montgomery Inn BBQ', 'Graeters ice cream'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Ohio craft beers', 'Cincinnati favorites', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Warped Wing', 'Yellow Springs', 'Dayton Beer Company']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5-10', shadedSpots: false, covered: false },
        { name: 'Downtown Garages', distance: '0.3 miles', price: '$5-10', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 6 PM',
        tip: 'Downtown garages better option'
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
        openTime: '90 minutes before first pitch',
        tip: 'Downtown entrance'
      },
      {
        name: 'Monument Avenue Gate',
        location: 'First base side',
        bestFor: ['First base seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Dragons Team Store', exclusive: ['Dragons gear', 'Reds items', 'Sellout streak memorabilia'] }
      ],
      firstAid: ['Behind home plate', 'Upper concourse'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Multiple locations'],
      wifi: { available: true, network: 'Dragons_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Speed pitch', 'Bounce house'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout facility'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '40+ ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Sellout Streak', description: 'Tickets hard to get', category: 'experience' },
        { title: 'Downtown Location', description: 'Restaurants walkable', category: 'experience' },
        { title: 'Family Atmosphere', description: 'Great for kids', category: 'experience' },
        { title: 'Cincinnati Chili', description: 'Try the local style', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Select games',
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
      description: 'Revitalized downtown with riverfront development',
      beforeGame: ['RiverScape MetroPark', 'Downtown restaurants', 'Oregon District'],
      afterGame: ['Oregon District nightlife', 'Downtown bars'],
      radius: '1 mile'
    },

    transportation: {
      address: '220 N Patterson Blvd, Dayton, OH 45402',
      publicTransit: {
        bus: [
          { routes: ['RTA routes'], stops: ['Downtown stops'] }
        ]
      },
      driving: {
        majorRoutes: ['I-75', 'I-70', 'US-35'],
        typicalTraffic: 'Moderate downtown',
        bestApproach: 'I-75 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on sellout games'
      }
    },

    history: {
      timeline: [
        { year: 2000, event: 'Fifth Third Field opens' },
        { year: 2000, event: 'Dragons begin play' },
        { year: 2011, event: 'Sellout streak begins' },
        { year: 2020, event: 'Renamed Day Air Ballpark' }
      ],
      traditions: [
        { name: 'Sellout Streak', description: 'Longest in professional sports' },
        { name: 'Dragon Mascots', description: 'Heater, Gem, Wink, Roar' }
      ]
    },

    fanExperience: {
      atmosphere: 'Electric atmosphere with passionate fan base',
      bestExperiences: [
        'Sellout streak energy',
        'Dragon-themed entertainment',
        'Downtown integration',
        'Family-friendly focus'
      ],
      traditions: [
        'Dragon boat races',
        'Mascot races',
        'Friday Fireworks',
        'Thirsty Thursday'
      ],
      mascot: {
        name: 'Heater, Gem, Wink, Roar',
        description: 'Four dragon mascots'
      }
    },

    proTips: {
      insiderTips: [
        'Buy tickets well in advance',
        'Sellout streak means packed games',
        'Try Cincinnati chili',
        'Downtown dining excellent'
      ],
      avoidThese: [
        'Expecting day-of tickets',
        'Summer afternoon games',
        'Limited parking on sellouts'
      ],
      hiddenGems: [
        'RiverScape MetroPark nearby',
        'Oregon District nightlife',
        'Great Miami River views',
        'Downtown renaissance'
      ],
      photoSpots: [
        'With dragon mascots',
        'Sellout streak signage',
        'Downtown skyline backdrop',
        'Dragon-themed areas'
      ],
      bestValue: [
        'Lawn seating if available',
        'Weeknight games',
        'Season ticket packages',
        'Group outings'
      ]
    }
  },

  'fort-wayne-tincaps': {
    id: 'fort-wayne-tincaps',
    name: 'Parkview Field',
    team: 'Fort Wayne TinCaps',
    opened: 2009,
    capacity: 8100,

    overview: {
      description: 'Parkview Field in downtown Fort Wayne is consistently rated as one of the best ballparks in Minor League Baseball, serving as home to the Padres Single-A affiliate.',
      highlights: [
        'Padres Single-A affiliate',
        'Downtown Fort Wayne location',
        'Award-winning facility',
        'Modern amenities',
        'Downtown integration'
      ],
      uniqueFeatures: [
        'Downtown skyline views',
        'The Harrison apartments',
        'Natural grass field',
        'Modern architecture',
        'Urban ballpark design'
      ],
      renovations: [
        { year: 2019, description: 'Video board upgrade' },
        { year: 2021, description: 'Concourse improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Suite level'],
        afternoon: ['Sections 210-220', 'Club areas'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Suite level', 'Club areas', 'Premium sections'],
      shadeTips: [
        'Indiana summers variable',
        'Downtown buildings provide some shade',
        'Third base side preferred',
        'Evening games comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper levels'],
        indoorAreas: ['Suite level', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 64, rainChance: 40, typicalConditions: 'Cool and variable', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 66, avgHumidity: 66, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Pleasant conditions' },
        { month: 'June', avgTemp: 75, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 79, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating better' },
        { month: 'August', avgTemp: 77, avgHumidity: 71, rainChance: 30, typicalConditions: 'Continued warmth', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 70, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Perfect baseball weather' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Parkview Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private entrance'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level', 'The Harrison apartments'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'The Shelf', description: 'Left field party deck', capacity: 250 },
          { name: 'Lawn', description: 'Right field grass', capacity: 1000 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved', 'Bleachers'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['The Shelf', 'Concourse areas'],
      partyAreas: [
        {
          name: 'The Shelf',
          capacity: '250',
          description: 'Left field party deck',
          amenities: ['Full bar', 'Tables', 'Standing room']
        }
      ],
      tips: [
        { section: 'Parkview Club', tip: 'Premium all-inclusive', category: 'experience' },
        { section: 'The Harrison', tip: 'Unique apartment suites', category: 'experience' },
        { section: 'Third base side', tip: 'Better shade', category: 'shade' },
        { section: 'Lawn', tip: 'Family-friendly budget option', category: 'value' }
      ]
    },

    concessions: {
      signature: ['TinCap Tacos', 'Fort Wayne famous hot dogs', 'Apple dumplings'],
      local: ['Indiana pork tenderloin', 'Local craft items', 'Midwest favorites'],
      healthy: ['Grilled options', 'Salads', 'Fresh items'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Dippin\' Dots'],
      alcohol: {
        beer: ['Indiana craft beers', 'Midwest favorites', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Mad Anthony', 'Summit City', 'Hop River']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Garage', distance: '100 yards', price: '$5', shadedSpots: true, covered: true },
        { name: 'Downtown Lots', distance: '0.3 miles', price: '$3-8', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered downtown',
        tip: 'Stadium garage convenient'
      },
      alternativeTransport: {
        publicTransit: ['Citilink bus'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch',
        tip: 'Downtown entrance'
      },
      {
        name: 'Left Field Gate',
        location: 'Outfield entrance',
        bestFor: ['The Shelf', 'Outfield seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'TinCaps Team Store', exclusive: ['TinCaps gear', 'Padres items', 'Johnny Appleseed themes'] }
      ],
      firstAid: ['Multiple locations'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Available'],
      atms: ['Throughout facility'],
      wifi: { available: true, network: 'Parkview_WiFi' },
      chargingStations: ['Multiple locations'],
      kidZones: [
        { name: 'Apple Works', location: 'Right field', activities: ['Playground', 'Interactive games', 'Speed pitch'] }
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
      parkingSpaces: '50+ ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Award-Winning Park', description: 'Top-rated facility', category: 'experience' },
        { title: 'Downtown Location', description: 'Restaurants and bars nearby', category: 'experience' },
        { title: 'Johnny Appleseed', description: 'Local legend theme', category: 'experience' },
        { title: 'Indiana Weather', description: 'Can be variable', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Select games',
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
      name: 'Downtown Fort Wayne',
      description: 'Revitalized downtown with restaurants and entertainment',
      beforeGame: ['Downtown restaurants', 'Promenade Park', 'Museums'],
      afterGame: ['Downtown nightlife', 'The Landing'],
      radius: '0.5 miles'
    },

    transportation: {
      address: '1301 Ewing St, Fort Wayne, IN 46802',
      publicTransit: {
        bus: [
          { routes: ['Citilink'], stops: ['Downtown routes'] }
        ]
      },
      driving: {
        majorRoutes: ['I-69', 'US-30', 'US-24'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-69 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2009, event: 'Parkview Field opens' },
        { year: 2009, event: 'TinCaps begin play' },
        { year: 1999, event: 'Became Padres affiliate' }
      ],
      traditions: [
        { name: 'Johnny Appleseed', description: 'Local legend connection' },
        { name: 'Apple Theme', description: 'Throughout branding' }
      ]
    },

    fanExperience: {
      atmosphere: 'Modern downtown baseball with Midwest charm',
      bestExperiences: [
        'Award-winning facility',
        'Downtown integration',
        'The Harrison apartments unique',
        'Family-friendly focus'
      ],
      traditions: [
        'Thirsty Thursday',
        'Friday Fireworks',
        'Apple Works fun'
      ],
      mascot: {
        name: 'Johnny TinCap',
        description: 'Apple-themed character with pot hat'
      }
    },

    proTips: {
      insiderTips: [
        'Top-rated park worth visiting',
        'Downtown dining excellent',
        'The Harrison suites unique',
        'Try pork tenderloin sandwich'
      ],
      avoidThese: [
        'Limited parking on big games',
        'First base afternoon sun',
        'Downtown construction zones'
      ],
      hiddenGems: [
        'Promenade Park nearby',
        'The Landing district',
        'Downtown renaissance',
        'Three rivers confluence'
      ],
      photoSpots: [
        'With Johnny TinCap',
        'Downtown skyline backdrop',
        'The Harrison apartments',
        'Apple-themed areas'
      ],
      bestValue: [
        'Lawn seating',
        'Weeknight games',
        'Student discounts',
        'Group packages'
      ]
    }
  },

  'great-lakes-loons': {
    id: 'great-lakes-loons',
    name: 'Dow Diamond',
    team: 'Great Lakes Loons',
    opened: 2007,
    capacity: 5500,

    overview: {
      description: 'Dow Diamond in Midland serves as home to the Dodgers Single-A affiliate, featuring modern amenities and family entertainment in Michigan\'s chemical capital.',
      highlights: [
        'Dodgers Single-A affiliate',
        'Midland location',
        'Modern facility',
        'Family-friendly focus',
        'Dow Chemical connection'
      ],
      uniqueFeatures: [
        'Fire pit in outfield',
        'Hot tub suite',
        'Natural grass field',
        'Modern design',
        'Michigan architecture'
      ],
      renovations: [
        { year: 2017, description: 'Video board upgrade' },
        { year: 2020, description: 'Seating improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 6:30 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Michigan summers moderate',
        'Lake effect can cool evenings',
        'Third base side preferred',
        'Evening games comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base field level', 'Lawn areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 50, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool and variable', shadeTip: 'Bring layers' },
        { month: 'May', avgTemp: 62, avgHumidity: 65, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Pleasant most days' },
        { month: 'June', avgTemp: 71, avgHumidity: 67, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Nice baseball weather' },
        { month: 'July', avgTemp: 75, avgHumidity: 68, rainChance: 30, typicalConditions: 'Peak summer', shadeTip: 'Shade helpful' },
        { month: 'August', avgTemp: 73, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 65, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Perfect conditions' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Pepsi Porch',
            perks: ['All-inclusive food/drinks', 'Padded seats', 'Great views'],
            access: 'Third base side'
          }
        ],
        suites: {
          levels: ['Suite level', 'Hot tub suite'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'Unique hot tub option']
        },
        specialAreas: [
          { name: 'Fire Pit', description: 'Right field gathering spot', capacity: 50 },
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 2000 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper deck', 'Bleachers'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Fire pit area'],
      partyAreas: [
        {
          name: 'Hot Tub Suite',
          capacity: '20',
          description: 'Unique hot tub experience',
          amenities: ['Hot tub', 'Private area', 'Catering']
        }
      ],
      tips: [
        { section: 'Hot Tub Suite', tip: 'Unique MiLB experience', category: 'experience' },
        { section: 'Fire Pit', tip: 'Great for groups', category: 'experience' },
        { section: 'Third base side', tip: 'Better shade', category: 'shade' },
        { section: 'Lawn', tip: 'Family-friendly and cheap', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Loons Burger', 'Michigan favorites', 'Dow Dogs'],
      local: ['Michigan craft items', 'Coney dogs', 'Faygo', 'Better Made chips'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Michigan craft beers', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Founders', 'Bell\'s', 'Midland Brewing']
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
        tip: 'Plenty of free parking'
      },
      alternativeTransport: {
        publicTransit: ['Limited bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch'
      },
      {
        name: 'Outfield Gate',
        location: 'Outfield entrance',
        bestFor: ['Lawn', 'Fire pit'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Loons Team Store', exclusive: ['Loons gear', 'Dodgers items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations'],
      wifi: { available: true, network: 'DowDiamond_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Left field', activities: ['Playground', 'Bounce house', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['To all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '30 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Hot Tub Suite', description: 'Unique in baseball', category: 'experience' },
        { title: 'Fire Pit', description: 'Cool Michigan evenings', category: 'experience' },
        { title: 'Free Parking', description: 'Plenty available', category: 'experience' },
        { title: 'Family Focus', description: 'Great kids activities', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:05 PM',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Midland',
      description: 'Chemical capital with family focus',
      beforeGame: ['Downtown Midland', 'Dow Gardens'],
      afterGame: ['Local restaurants'],
      radius: '5 miles'
    },

    transportation: {
      address: '825 E Main St, Midland, MI 48640',
      publicTransit: {
        bus: [
          { routes: ['County Connection'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['US-10', 'M-20', 'I-75'],
        typicalTraffic: 'Light',
        bestApproach: 'US-10 to downtown'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2007, event: 'Dow Diamond opens' },
        { year: 2007, event: 'Loons begin play' },
        { year: 2015, event: 'Became Dodgers affiliate' }
      ],
      traditions: [
        { name: 'Dow Connection', description: 'Chemical company support' },
        { name: 'Loon Mascots', description: 'Lou E. and Rall E. Camel' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly Michigan baseball',
      bestExperiences: [
        'Hot tub suite unique',
        'Fire pit gatherings',
        'Free parking',
        'Modern amenities'
      ],
      traditions: [
        'Thirsty Thursday',
        'Friday Fireworks',
        'Feast Night Tuesday'
      ],
      mascot: {
        name: 'Lou E. Loon and Rall E. Camel',
        description: 'Loon mascot and camel sidekick'
      }
    },

    proTips: {
      insiderTips: [
        'Hot tub suite bucket list item',
        'Fire pit great for groups',
        'Free parking plentiful',
        'Try Michigan craft beers'
      ],
      avoidThese: [
        'Cool Michigan evenings unprepared',
        'First base afternoon sun',
        'Missing unique features'
      ],
      hiddenGems: [
        'Dow Gardens nearby',
        'Midland Center for Arts',
        'Chippewa Nature Center',
        'Rail trail system'
      ],
      photoSpots: [
        'Hot tub suite',
        'Fire pit area',
        'With Lou E. Loon',
        'Modern entrance'
      ],
      bestValue: [
        'Free parking',
        'Lawn seating',
        'Feast Night Tuesday',
        'Family packages'
      ]
    }
  }
};