import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides: Record<string, StadiumGuide> = {
  'akron-rubberducks': {
    id: 'akron-rubberducks',
    name: 'Canal Park',
    team: 'Akron RubberDucks',
    opened: 1997,
    capacity: 7630,
    overview: {
      description: 'Canal Park in Akron, Ohio, is the home of the Akron RubberDucks, Guardians AA affiliate. This updated facility maintains its classic charm with a capacity of 7630 fans. ',
      highlights: [
        'Guardians AA affiliate since 2000',
        'Renovated Classic facility',
        'Akron landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Webster',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Webster team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 152 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '190',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cincinnati chili', 'Pierogies', 'Stadium mustard', 'Buckeye candy'],
      local: ['Cincinnati chili', 'Pierogies', 'Stadium mustard', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Great Lakes', 'Platform', "Fat Head\\'s", 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Great Lakes', 'Platform', "Fat Head\\'s"]
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$7', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Akron RubberDucks authentic gear', 'Webster merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Websters Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Webster', description: 'Giant rubber duck with attitude appears pregame', category: 'family' },
        { title: 'Try the Cincinnati chili', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Akron area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7630 Canal Park, Akron, Ohio',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1997, event: 'Stadium opens' },
        { year: 2000, event: 'Guardians affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Webster race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Webster', description: 'Giant rubber duck with attitude' },
      bestExperiences: ['Meeting Webster', 'Fireworks shows', 'Trying Cincinnati chili', 'Rivalry games'],
      traditions: ['Webster antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cincinnati chili at Section 117',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Webster meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Webster at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'richmond-flying-squirrels': {
    id: 'richmond-flying-squirrels',
    name: 'The Diamond',
    team: 'Richmond Flying Squirrels',
    opened: 1985,
    capacity: 9560,
    overview: {
      description: 'The Diamond in Richmond, Virginia, is the home of the Richmond Flying Squirrels, Giants AA affiliate. This historic venue offers nostalgic baseball with a capacity of 9560 fans. ',
      highlights: [
        'Giants AA affiliate since 2000',
        'Historic facility',
        'Richmond landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Nutzy',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Nutzy team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 191 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '239',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Virginia ham', 'Peanuts', 'Brunswick stew', 'Apple cider donuts'],
      local: ['Virginia ham', 'Peanuts', 'Brunswick stew', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: '$7', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Richmond Flying Squirrels authentic gear', 'Nutzy merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Nutzys Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Multiple locations']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Nutzy', description: 'Energetic flying squirrel appears pregame', category: 'family' },
        { title: 'Try the Virginia ham', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Richmond area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '9560 The Diamond, Richmond, Virginia',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1985, event: 'Stadium opens' },
        { year: 2000, event: 'Giants affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Nutzy race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Nutzy', description: 'Energetic flying squirrel' },
      bestExperiences: ['Meeting Nutzy', 'Fireworks shows', 'Trying Virginia ham', 'Rivalry games'],
      traditions: ['Nutzy antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Virginia ham at Section 114',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Nutzy meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Nutzy at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'harrisburg-senators': {
    id: 'harrisburg-senators',
    name: 'FNB Field',
    team: 'Harrisburg Senators',
    opened: 1987,
    capacity: 6187,
    overview: {
      description: 'FNB Field in Harrisburg, Pennsylvania, is the home of the Harrisburg Senators, Nationals AA affiliate. This historic venue offers nostalgic baseball with a capacity of 6187 fans. ',
      highlights: [
        'Nationals AA affiliate since 2000',
        'Historic facility',
        'Harrisburg landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Rascal',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Rascal team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 123 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '154',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cheesesteaks', 'Soft pretzels', 'Yuengling beer', 'Whoopie pies'],
      local: ['Cheesesteaks', 'Soft pretzels', 'Yuengling beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Yuengling', 'Victory', 'Troegs', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Yuengling', 'Victory', 'Troegs']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$7', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Harrisburg Senators authentic gear', 'Rascal merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Rascals Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Rascal', description: 'Mischievous raccoon appears pregame', category: 'family' },
        { title: 'Try the Cheesesteaks', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Harrisburg area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6187 FNB Field, Harrisburg, Pennsylvania',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1987, event: 'Stadium opens' },
        { year: 2000, event: 'Nationals affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Rascal race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rascal', description: 'Mischievous raccoon' },
      bestExperiences: ['Meeting Rascal', 'Fireworks shows', 'Trying Cheesesteaks', 'Rivalry games'],
      traditions: ['Rascal antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Cheesesteaks at Section 104',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Rascal meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Rascal at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'bowie-baysox': {
    id: 'bowie-baysox',
    name: 'Prince George\'s Stadium',
    team: 'Bowie Baysox',
    opened: 2000,
    capacity: 10000,
    overview: {
      description: 'Prince George\'s Stadium in Bowie, Maryland, is the home of the Bowie Baysox, Orioles AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 10000 fans. ',
      highlights: [
        'Orioles AA affiliate since 2000',
        'Modern facility',
        'Bowie landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Louie',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Louie team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 200 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '250',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Crab cakes', 'Old Bay fries', 'Pit beef sandwiches', 'Natty Boh beer'],
      local: ['Crab cakes', 'Old Bay fries', 'Pit beef sandwiches', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Flying Dog', 'Heavy Seas', 'Union Craft', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Flying Dog', 'Heavy Seas', 'Union Craft']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Bowie Baysox authentic gear', 'Louie merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Louies Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Louie', description: 'Friendly Chesapeake Bay mascot appears pregame', category: 'family' },
        { title: 'Try the Crab cakes', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Bowie area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '10000 Prince George\'s Stadium, Bowie, Maryland',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2000, event: 'Stadium opens' },
        { year: 2001, event: 'Orioles affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Louie race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Louie', description: 'Friendly Chesapeake Bay mascot' },
      bestExperiences: ['Meeting Louie', 'Fireworks shows', 'Trying Crab cakes', 'Rivalry games'],
      traditions: ['Louie antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Crab cakes at Section 118',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Louie meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Louie at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'portland-sea-dogs': {
    id: 'portland-sea-dogs',
    name: 'Hadlock Field',
    team: 'Portland Sea Dogs',
    opened: 1994,
    capacity: 7368,
    overview: {
      description: 'Hadlock Field in Portland, Maine, is the home of the Portland Sea Dogs, Red Sox AA affiliate. This updated facility maintains its classic charm with a capacity of 7368 fans. ',
      highlights: [
        'Red Sox AA affiliate since 2000',
        'Renovated Classic facility',
        'Portland landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Slugger',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Bring layers for cool evening games',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Slugger team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 147 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '184',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Bring layers for cool evening games', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Lobster rolls', 'Blueberry pie', 'Whoopie pies', 'Sea Dog beer'],
      local: ['Lobster rolls', 'Blueberry pie', 'Whoopie pies', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Allagash', 'Sea Dog', 'Shipyard', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Allagash', 'Sea Dog', 'Shipyard']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$15-20', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$10-15', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Portland Sea Dogs authentic gear', 'Slugger merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Sluggers Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Slugger', description: 'Baseball-playing seal appears pregame', category: 'family' },
        { title: 'Try the Lobster rolls', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Portland area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7368 Hadlock Field, Portland, Maine',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1994, event: 'Stadium opens' },
        { year: 2000, event: 'Red Sox affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Slugger race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Slugger', description: 'Baseball-playing seal' },
      bestExperiences: ['Meeting Slugger', 'Fireworks shows', 'Trying Lobster rolls', 'Rivalry games'],
      traditions: ['Slugger antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Lobster rolls at Section 112',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Slugger meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Slugger at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'somerset-patriots': {
    id: 'somerset-patriots',
    name: 'TD Bank Ballpark',
    team: 'Somerset Patriots',
    opened: 1999,
    capacity: 6100,
    overview: {
      description: 'TD Bank Ballpark in Bridgewater, New Jersey, is the home of the Somerset Patriots, Yankees AA affiliate. This updated facility maintains its classic charm with a capacity of 6100 fans. ',
      highlights: [
        'Yankees AA affiliate since 2000',
        'Renovated Classic facility',
        'Bridgewater landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Sparkee',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Sparkee team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 122 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '152',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Pork roll sandwiches', 'Salt water taffy', 'Disco fries', 'Italian hot dogs'],
      local: ['Pork roll sandwiches', 'Salt water taffy', 'Disco fries', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Somerset Patriots authentic gear', 'Sparkee merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Sparkees Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Sparkee', description: 'Patriotic mascot appears pregame', category: 'family' },
        { title: 'Try the Pork roll sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Bridgewater area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6100 TD Bank Ballpark, Bridgewater, New Jersey',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1999, event: 'Stadium opens' },
        { year: 2000, event: 'Yankees affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Sparkee race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Sparkee', description: 'Patriotic mascot' },
      bestExperiences: ['Meeting Sparkee', 'Fireworks shows', 'Trying Pork roll sandwiches', 'Rivalry games'],
      traditions: ['Sparkee antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Pork roll sandwiches at Section 115',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Sparkee meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Sparkee at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
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
      description: 'Delta Dental Stadium in Manchester, New Hampshire, is the home of the New Hampshire Fisher Cats, Blue Jays AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 6500 fans. ',
      highlights: [
        'Blue Jays AA affiliate since 2005',
        'Modern facility',
        'Manchester landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Fungo',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2025, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Bring layers for cool evening games',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Fungo team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 130 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '162',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Bring layers for cool evening games', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Apple cider donuts', 'Maple syrup items', 'Chowder', 'White Mountain beer'],
      local: ['Apple cider donuts', 'Maple syrup items', 'Chowder', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['New Hampshire Fisher Cats authentic gear', 'Fungo merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Fungos Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Fungo', description: 'Athletic fisher cat appears pregame', category: 'family' },
        { title: 'Try the Apple cider donuts', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Manchester area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6500 Delta Dental Stadium, Manchester, New Hampshire',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2005, event: 'Stadium opens' },
        { year: 2006, event: 'Blue Jays affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Fungo race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Fungo', description: 'Athletic fisher cat' },
      bestExperiences: ['Meeting Fungo', 'Fireworks shows', 'Trying Apple cider donuts', 'Rivalry games'],
      traditions: ['Fungo antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Apple cider donuts at Section 110',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Fungo meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Fungo at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'erie-seawolves': {
    id: 'erie-seawolves',
    name: 'UPMC Park',
    team: 'Erie SeaWolves',
    opened: 1995,
    capacity: 6000,
    overview: {
      description: 'UPMC Park in Erie, Pennsylvania, is the home of the Erie SeaWolves, Tigers AA affiliate. This updated facility maintains its classic charm with a capacity of 6000 fans. ',
      highlights: [
        'Tigers AA affiliate since 2000',
        'Renovated Classic facility',
        'Erie landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of C. Wolf',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['C. Wolf team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 120 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '150',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cheesesteaks', 'Soft pretzels', 'Yuengling beer', 'Whoopie pies'],
      local: ['Cheesesteaks', 'Soft pretzels', 'Yuengling beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Yuengling', 'Victory', 'Troegs', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Yuengling', 'Victory', 'Troegs']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Erie SeaWolves authentic gear', 'C. Wolf merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'C. Wolfs Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet C. Wolf', description: 'Seafaring wolf character appears pregame', category: 'family' },
        { title: 'Try the Cheesesteaks', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Erie area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6000 UPMC Park, Erie, Pennsylvania',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1995, event: 'Stadium opens' },
        { year: 2000, event: 'Tigers affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'C. Wolf race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'C. Wolf', description: 'Seafaring wolf character' },
      bestExperiences: ['Meeting C. Wolf', 'Fireworks shows', 'Trying Cheesesteaks', 'Rivalry games'],
      traditions: ['C. Wolf antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cheesesteaks at Section 101',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'C. Wolf meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With C. Wolf at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'altoona-curve': {
    id: 'altoona-curve',
    name: 'Peoples Natural Gas Field',
    team: 'Altoona Curve',
    opened: 1999,
    capacity: 7210,
    overview: {
      description: 'Peoples Natural Gas Field in Altoona, Pennsylvania, is the home of the Altoona Curve, Pirates AA affiliate. This updated facility maintains its classic charm with a capacity of 7210 fans. ',
      highlights: [
        'Pirates AA affiliate since 2000',
        'Renovated Classic facility',
        'Altoona landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Steamer',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Steamer team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 144 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '180',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cheesesteaks', 'Soft pretzels', 'Yuengling beer', 'Whoopie pies'],
      local: ['Cheesesteaks', 'Soft pretzels', 'Yuengling beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Yuengling', 'Victory', 'Troegs', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Yuengling', 'Victory', 'Troegs']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Altoona Curve authentic gear', 'Steamer merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Steamers Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Steamer', description: 'Railroad-themed mascot appears pregame', category: 'family' },
        { title: 'Try the Cheesesteaks', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Altoona area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7210 Peoples Natural Gas Field, Altoona, Pennsylvania',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1999, event: 'Stadium opens' },
        { year: 2000, event: 'Pirates affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Steamer race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Steamer', description: 'Railroad-themed mascot' },
      bestExperiences: ['Meeting Steamer', 'Fireworks shows', 'Trying Cheesesteaks', 'Rivalry games'],
      traditions: ['Steamer antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Cheesesteaks at Section 117',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Steamer meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Steamer at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'binghamton-rumble-ponies': {
    id: 'binghamton-rumble-ponies',
    name: 'Mirabito Stadium',
    team: 'Binghamton Rumble Ponies',
    opened: 1992,
    capacity: 6012,
    overview: {
      description: 'Mirabito Stadium in Binghamton, New York, is the home of the Binghamton Rumble Ponies, Mets AA affiliate. This updated facility maintains its classic charm with a capacity of 6012 fans. ',
      highlights: [
        'Mets AA affiliate since 2000',
        'Renovated Classic facility',
        'Binghamton landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Rowdy',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Rowdy team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 120 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '150',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ["Nathan\\'s hot dogs", 'New York pizza', 'Knishes', 'Black and white cookies'],
      local: ["Nathan\\'s hot dogs", 'New York pizza', 'Knishes', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Brooklyn Brewery', 'Blue Point', 'Southern Tier', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Brooklyn Brewery', 'Blue Point', 'Southern Tier']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Binghamton Rumble Ponies authentic gear', 'Rowdy merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Rowdys Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Rowdy', description: 'Spirited carousel horse appears pregame', category: 'family' },
        { title: 'Try the Nathan\'s hot dogs', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Binghamton area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6012 Mirabito Stadium, Binghamton, New York',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1992, event: 'Stadium opens' },
        { year: 2000, event: 'Mets affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Rowdy race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rowdy', description: 'Spirited carousel horse' },
      bestExperiences: ['Meeting Rowdy', 'Fireworks shows', 'Trying Nathan\'s hot dogs', 'Rivalry games'],
      traditions: ['Rowdy antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Nathan\'s hot dogs at Section 118',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Rowdy meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Rowdy at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'hartford-yard-goats': {
    id: 'hartford-yard-goats',
    name: 'Dunkin Park',
    team: 'Hartford Yard Goats',
    opened: 2017,
    capacity: 6121,
    overview: {
      description: 'Dunkin Park in Hartford, Connecticut, is the home of the Hartford Yard Goats, Rockies AA affiliate. This brand new facility features modern amenities with a capacity of 6121 fans. ',
      highlights: [
        'Rockies AA affiliate since 2017',
        'State-Of-The-Art facility',
        'Hartford landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Chompers and Chew Chew',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2027, description: 'Seating improvements' },
        { year: 2032, description: 'Concourse and concessions renovation' },
        { year: 2037, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Chompers and Chew Chew team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 122 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '153',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['New Haven pizza', 'Steamed cheeseburgers', 'Hot lobster rolls'],
      local: ['New Haven pizza', 'Steamed cheeseburgers', 'Hot lobster rolls', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Two Roads', 'New England Brewing', 'Thomas Hooker', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Two Roads', 'New England Brewing', 'Thomas Hooker']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: true, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$7', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Hartford Yard Goats authentic gear', 'Chompers and Chew Chew merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['All restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Chompers and Chew Chews Playground',
          location: 'Left field corner',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Chompers and Chew Chew', description: 'Goat duo appears pregame', category: 'family' },
        { title: 'Try the New Haven pizza', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Hartford area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6121 Dunkin Park, Hartford, Connecticut',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2017, event: 'Stadium opens' },
        { year: 2018, event: 'Rockies affiliation established' },
        { year: 2022, event: 'First championship' },
        { year: 2027, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Chompers and Chew Chew race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Chompers and Chew Chew', description: 'Goat duo' },
      bestExperiences: ['Meeting Chompers and Chew Chew', 'Fireworks shows', 'Trying New Haven pizza', 'Rivalry games'],
      traditions: ['Chompers and Chew Chew antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Download the app for deals',
        'Best New Haven pizza at Section 104',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Park entrance sign',
        'Standing room bar area',
        'Chompers and Chew Chew meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Chompers and Chew Chew at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Happy hour deals',
        'Flex plans'
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
      description: 'FirstEnergy Stadium in Reading, Pennsylvania, is the home of the Reading Fightin Phils, Phillies AA affiliate. This historic venue offers nostalgic baseball with a capacity of 9000 fans. ',
      highlights: [
        'Phillies AA affiliate since 2000',
        'Historic facility',
        'Reading landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Change-Up',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Find shade under stands',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Change-Up team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 180 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '225',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cheesesteaks', 'Soft pretzels', 'Yuengling beer', 'Whoopie pies'],
      local: ['Cheesesteaks', 'Soft pretzels', 'Yuengling beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Yuengling', 'Victory', 'Troegs', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Yuengling', 'Victory', 'Troegs']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Reading Fightin Phils authentic gear', 'Change-Up merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Change-Ups Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Multiple locations']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Change-Up', description: 'Ostrich mascot appears pregame', category: 'family' },
        { title: 'Try the Cheesesteaks', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Reading area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '9000 FirstEnergy Stadium, Reading, Pennsylvania',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1951, event: 'Stadium opens' },
        { year: 2000, event: 'Phillies affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Change-Up race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Change-Up', description: 'Ostrich mascot' },
      bestExperiences: ['Meeting Change-Up', 'Fireworks shows', 'Trying Cheesesteaks', 'Rivalry games'],
      traditions: ['Change-Up antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Cheesesteaks at Section 114',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Change-Up meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Change-Up at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'biloxi-shuckers': {
    id: 'biloxi-shuckers',
    name: 'MGM Park',
    team: 'Biloxi Shuckers',
    opened: 2015,
    capacity: 6067,
    overview: {
      description: 'MGM Park in Biloxi, Mississippi, is the home of the Biloxi Shuckers, Brewers AA affiliate. This brand new facility features modern amenities with a capacity of 6067 fans. ',
      highlights: [
        'Brewers AA affiliate since 2015',
        'State-Of-The-Art facility',
        'Biloxi landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Schooner and Bixie',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2025, description: 'Seating improvements' },
        { year: 2030, description: 'Concourse and concessions renovation' },
        { year: 2035, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Schooner and Bixie team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 121 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '151',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['BBQ ribs', "Catfish po\\'boys", 'Fried green tomatoes', 'Sweet tea'],
      local: ['BBQ ribs', "Catfish po\\'boys", 'Fried green tomatoes', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: true, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Biloxi Shuckers authentic gear', 'Schooner and Bixie merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['All restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Schooner and Bixies Playground',
          location: 'Left field corner',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Schooner and Bixie', description: 'Oyster characters appears pregame', category: 'family' },
        { title: 'Try the BBQ ribs', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Biloxi area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6067 MGM Park, Biloxi, Mississippi',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2015, event: 'Stadium opens' },
        { year: 2016, event: 'Brewers affiliation established' },
        { year: 2020, event: 'First championship' },
        { year: 2025, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Schooner and Bixie race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Schooner and Bixie', description: 'Oyster characters' },
      bestExperiences: ['Meeting Schooner and Bixie', 'Fireworks shows', 'Trying BBQ ribs', 'Rivalry games'],
      traditions: ['Schooner and Bixie antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Download the app for deals',
        'Best BBQ ribs at Section 118',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Park entrance sign',
        'Standing room bar area',
        'Schooner and Bixie meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Schooner and Bixie at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Happy hour deals',
        'Flex plans'
      ]
    }
  },
  'birmingham-barons': {
    id: 'birmingham-barons',
    name: 'Regions Field',
    team: 'Birmingham Barons',
    opened: 2013,
    capacity: 8500,
    overview: {
      description: 'Regions Field in Birmingham, Alabama, is the home of the Birmingham Barons, White Sox AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 8500 fans. ',
      highlights: [
        'White Sox AA affiliate since 2013',
        'Modern facility',
        'Birmingham landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Biscuit',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2023, description: 'Seating improvements' },
        { year: 2028, description: 'Concourse and concessions renovation' },
        { year: 2033, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Club level'],
        indoorAreas: ['Biscuit team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Standing room with bar', capacity: 170 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '212',
          description: 'All-inclusive packages',
          amenities: ['Local beer selection', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['BBQ pulled pork', 'Fried chicken', 'Banana pudding', 'Sweet home fries'],
      local: ['BBQ pulled pork', 'Fried chicken', 'Banana pudding', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: '$7', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Birmingham Barons authentic gear', 'Biscuit merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Biscuits Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Biscuit', description: 'Southern biscuit character appears pregame', category: 'family' },
        { title: 'Try the BBQ pulled pork', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Birmingham area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '8500 Regions Field, Birmingham, Alabama',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2013, event: 'Stadium opens' },
        { year: 2014, event: 'White Sox affiliation established' },
        { year: 2018, event: 'First championship' },
        { year: 2023, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Biscuit race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Biscuit', description: 'Southern biscuit character' },
      bestExperiences: ['Meeting Biscuit', 'Fireworks shows', 'Trying BBQ pulled pork', 'Rivalry games'],
      traditions: ['Biscuit antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best BBQ pulled pork at Section 118',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Standing room bar area',
        'Biscuit meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Biscuit at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'chattanooga-lookouts': {
    id: 'chattanooga-lookouts',
    name: 'AT&T Field',
    team: 'Chattanooga Lookouts',
    opened: 2000,
    capacity: 6340,
    overview: {
      description: 'AT&T Field in Chattanooga, Tennessee, is the home of the Chattanooga Lookouts, Reds AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 6340 fans. ',
      highlights: [
        'Reds AA affiliate since 2000',
        'Modern facility',
        'Chattanooga landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Looie',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Looie team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 126 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '158',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Nashville hot chicken', 'BBQ nachos', 'Moon pies', "Jack Daniel\\'s items"],
      local: ['Nashville hot chicken', 'BBQ nachos', 'Moon pies', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Chattanooga Lookouts authentic gear', 'Looie merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Looies Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Looie', description: 'Mountain character appears pregame', category: 'family' },
        { title: 'Try the Nashville hot chicken', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Chattanooga area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6340 AT&T Field, Chattanooga, Tennessee',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2000, event: 'Stadium opens' },
        { year: 2001, event: 'Reds affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Looie race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Looie', description: 'Mountain character' },
      bestExperiences: ['Meeting Looie', 'Fireworks shows', 'Trying Nashville hot chicken', 'Rivalry games'],
      traditions: ['Looie antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Nashville hot chicken at Section 119',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Looie meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Looie at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'montgomery-biscuits': {
    id: 'montgomery-biscuits',
    name: 'Riverwalk Stadium',
    team: 'Montgomery Biscuits',
    opened: 2004,
    capacity: 7000,
    overview: {
      description: 'Riverwalk Stadium in Montgomery, Alabama, is the home of the Montgomery Biscuits, Rays AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 7000 fans. ',
      highlights: [
        'Rays AA affiliate since 2004',
        'Modern facility',
        'Montgomery landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Big Mo',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2024, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Big Mo team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 140 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '175',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['BBQ pulled pork', 'Fried chicken', 'Banana pudding', 'Sweet home fries'],
      local: ['BBQ pulled pork', 'Fried chicken', 'Banana pudding', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Montgomery Biscuits authentic gear', 'Big Mo merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Big Mos Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Big Mo', description: 'Giant biscuit with butter pat appears pregame', category: 'family' },
        { title: 'Try the BBQ pulled pork', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Montgomery area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Walk the riverfront'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7000 Riverwalk Stadium, Montgomery, Alabama',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2004, event: 'Stadium opens' },
        { year: 2005, event: 'Rays affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Big Mo race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Big Mo', description: 'Giant biscuit with butter pat' },
      bestExperiences: ['Meeting Big Mo', 'Fireworks shows', 'Trying BBQ pulled pork', 'Rivalry games'],
      traditions: ['Big Mo antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best BBQ pulled pork at Section 109',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Big Mo meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Big Mo at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'pensacola-blue-wahoos': {
    id: 'pensacola-blue-wahoos',
    name: 'Blue Wahoos Stadium',
    team: 'Pensacola Blue Wahoos',
    opened: 2012,
    capacity: 5038,
    overview: {
      description: 'Blue Wahoos Stadium in Pensacola, Florida, is the home of the Pensacola Blue Wahoos, Marlins AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 5038 fans. ',
      highlights: [
        'Marlins AA affiliate since 2012',
        'Modern facility',
        'Pensacola landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Kazoo',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2022, description: 'Seating improvements' },
        { year: 2027, description: 'Concourse and concessions renovation' },
        { year: 2032, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Covered concourse provides relief',
        'Night games recommended in summer',
        'Sunscreen essential'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Kazoo team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Standing room with bar', capacity: 100 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '125',
          description: 'All-inclusive packages',
          amenities: ['Local beer selection', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Grouper sandwiches'],
      local: ['Cuban sandwiches', 'Key lime pie', 'Conch fritters', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Pensacola Blue Wahoos authentic gear', 'Kazoo merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Kazoos Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Kazoo', description: 'Blue wahoo fish appears pregame', category: 'family' },
        { title: 'Try the Cuban sandwiches', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Pensacola area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5038 Blue Wahoos Stadium, Pensacola, Florida',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2012, event: 'Stadium opens' },
        { year: 2013, event: 'Marlins affiliation established' },
        { year: 2017, event: 'First championship' },
        { year: 2022, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Kazoo race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Kazoo', description: 'Blue wahoo fish' },
      bestExperiences: ['Meeting Kazoo', 'Fireworks shows', 'Trying Cuban sandwiches', 'Rivalry games'],
      traditions: ['Kazoo antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Cuban sandwiches at Section 112',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Standing room bar area',
        'Kazoo meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Kazoo at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'rocket-city-trash-pandas': {
    id: 'rocket-city-trash-pandas',
    name: 'Toyota Field',
    team: 'Rocket City Trash Pandas',
    opened: 2020,
    capacity: 7500,
    overview: {
      description: 'Toyota Field in Madison, Alabama, is the home of the Rocket City Trash Pandas, Angels AA affiliate. This brand new facility features modern amenities with a capacity of 7500 fans. ',
      highlights: [
        'Angels AA affiliate since 2020',
        'State-Of-The-Art facility',
        'Madison landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Sprocket',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2030, description: 'Seating improvements' },
        { year: 2035, description: 'Concourse and concessions renovation' },
        { year: 2040, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Sprocket team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 150 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '187',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['BBQ pulled pork', 'Fried chicken', 'Banana pudding', 'Sweet home fries'],
      local: ['BBQ pulled pork', 'Fried chicken', 'Banana pudding', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Beyond burgers', 'Pizza', 'Cauliflower wings'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: true, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike valet'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Rocket City Trash Pandas authentic gear', 'Sprocket merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['All restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Throughout concourse'],
      kidZones: [
        {
          name: 'Sprockets Playground',
          location: 'Beyond outfield',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Sprocket', description: 'Space raccoon appears pregame', category: 'family' },
        { title: 'Try the BBQ pulled pork', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Clear bags only',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    neighborhood: {
      name: 'Madison area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7500 Toyota Field, Madison, Alabama',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2020, event: 'Stadium opens' },
        { year: 2021, event: 'Angels affiliation established' },
        { year: 2025, event: 'First championship' },
        { year: 2030, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Sprocket race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Sprocket', description: 'Space raccoon' },
      bestExperiences: ['Meeting Sprocket', 'Fireworks shows', 'Trying BBQ pulled pork', 'Rivalry games'],
      traditions: ['Sprocket antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Download the app for deals',
        'Best BBQ pulled pork at Section 114',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Stadium entrance plaza',
        'Standing room bar area',
        'Sprocket meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Sprocket at Kids zone',
        'Sunset from upper deck',
        'Instagram wall'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Happy hour deals',
        'Season memberships'
      ]
    }
  },
  'tennessee-smokies': {
    id: 'tennessee-smokies',
    name: 'Smokies Stadium',
    team: 'Tennessee Smokies',
    opened: 2000,
    capacity: 8000,
    overview: {
      description: 'Smokies Stadium in Kodak, Tennessee, is the home of the Tennessee Smokies, Cubs AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 8000 fans. ',
      highlights: [
        'Cubs AA affiliate since 2000',
        'Modern facility',
        'Kodak landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Homer',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Homer team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 160 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '200',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Nashville hot chicken', 'BBQ nachos', 'Moon pies', "Jack Daniel\\'s items"],
      local: ['Nashville hot chicken', 'BBQ nachos', 'Moon pies', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Tennessee Smokies authentic gear', 'Homer merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Homers Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Homer', description: 'Friendly bear appears pregame', category: 'family' },
        { title: 'Try the Nashville hot chicken', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Kodak area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '8000 Smokies Stadium, Kodak, Tennessee',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2000, event: 'Stadium opens' },
        { year: 2001, event: 'Cubs affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Homer race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Homer', description: 'Friendly bear' },
      bestExperiences: ['Meeting Homer', 'Fireworks shows', 'Trying Nashville hot chicken', 'Rivalry games'],
      traditions: ['Homer antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Nashville hot chicken at Section 116',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Homer meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Homer at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'mississippi-braves': {
    id: 'mississippi-braves',
    name: 'Trustmark Park',
    team: 'Mississippi Braves',
    opened: 2005,
    capacity: 8480,
    overview: {
      description: 'Trustmark Park in Pearl, Mississippi, is the home of the Mississippi Braves, Braves AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 8480 fans. ',
      highlights: [
        'Braves AA affiliate since 2005',
        'Modern facility',
        'Pearl landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Peavey',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2025, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Peavey team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 169 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '212',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['BBQ ribs', "Catfish po\\'boys", 'Fried green tomatoes', 'Sweet tea'],
      local: ['BBQ ribs', "Catfish po\\'boys", 'Fried green tomatoes', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Mississippi Braves authentic gear', 'Peavey merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Peaveys Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Peavey', description: 'Native American-themed mascot appears pregame', category: 'family' },
        { title: 'Try the BBQ ribs', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Pearl area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '8480 Trustmark Park, Pearl, Mississippi',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2005, event: 'Stadium opens' },
        { year: 2006, event: 'Braves affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Peavey race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Peavey', description: 'Native American-themed mascot' },
      bestExperiences: ['Meeting Peavey', 'Fireworks shows', 'Trying BBQ ribs', 'Rivalry games'],
      traditions: ['Peavey antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best BBQ ribs at Section 109',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Peavey meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Peavey at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'amarillo-sod-poodles': {
    id: 'amarillo-sod-poodles',
    name: 'HODGETOWN',
    team: 'Amarillo Sod Poodles',
    opened: 2019,
    capacity: 7279,
    overview: {
      description: 'HODGETOWN in Amarillo, Texas, is the home of the Amarillo Sod Poodles, Diamondbacks AA affiliate. This brand new facility features modern amenities with a capacity of 7279 fans. ',
      highlights: [
        'Diamondbacks AA affiliate since 2019',
        'State-Of-The-Art facility',
        'Amarillo landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Ruckus',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2029, description: 'Seating improvements' },
        { year: 2034, description: 'Concourse and concessions renovation' },
        { year: 2039, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 7pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Covered concourse provides relief',
        'Night games recommended in summer',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Ruckus team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 145 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '181',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Shiner Bock beer'],
      local: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Beyond burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Shiner', 'Karbach', 'Saint Arnold', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Shiner', 'Karbach', 'Saint Arnold']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: true, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike valet'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Amarillo Sod Poodles authentic gear', 'Ruckus merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['All restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Throughout concourse'],
      kidZones: [
        {
          name: 'Ruckuss Playground',
          location: 'Beyond outfield',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Ruckus', description: 'Prairie dog appears pregame', category: 'family' },
        { title: 'Try the Brisket', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Amarillo area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7279 HODGETOWN, Amarillo, Texas',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2019, event: 'Stadium opens' },
        { year: 2020, event: 'Diamondbacks affiliation established' },
        { year: 2024, event: 'First championship' },
        { year: 2029, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Ruckus race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Ruckus', description: 'Prairie dog' },
      bestExperiences: ['Meeting Ruckus', 'Fireworks shows', 'Trying Brisket', 'Rivalry games'],
      traditions: ['Ruckus antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Download the app for deals',
        'Best Brisket at Section 117',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Stadium entrance plaza',
        'Standing room bar area',
        'Ruckus meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Ruckus at Kids zone',
        'Sunset from upper deck',
        'Instagram wall'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Happy hour deals',
        'Flex plans'
      ]
    }
  },
  'arkansas-travelers': {
    id: 'arkansas-travelers',
    name: 'Dickey-Stephens Park',
    team: 'Arkansas Travelers',
    opened: 2007,
    capacity: 7480,
    overview: {
      description: 'Dickey-Stephens Park in North Little Rock, Arkansas, is the home of the Arkansas Travelers, Mariners AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 7480 fans. ',
      highlights: [
        'Mariners AA affiliate since 2007',
        'Modern facility',
        'North Little Rock landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Ace',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2022, description: 'Concourse and concessions renovation' },
        { year: 2027, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Ace team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 149 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '187',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cheese dip', 'Fried catfish', 'Possum pie', 'BBQ beef'],
      local: ['Cheese dip', 'Fried catfish', 'Possum pie', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Arkansas Travelers authentic gear', 'Ace merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Aces Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Ace', description: 'Traveler mascot appears pregame', category: 'family' },
        { title: 'Try the Cheese dip', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'North Little Rock area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7480 Dickey-Stephens Park, North Little Rock, Arkansas',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2007, event: 'Stadium opens' },
        { year: 2008, event: 'Mariners affiliation established' },
        { year: 2012, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Ace race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Ace', description: 'Traveler mascot' },
      bestExperiences: ['Meeting Ace', 'Fireworks shows', 'Trying Cheese dip', 'Rivalry games'],
      traditions: ['Ace antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cheese dip at Section 117',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Ace meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Ace at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'corpus-christi-hooks': {
    id: 'corpus-christi-hooks',
    name: 'Whataburger Field',
    team: 'Corpus Christi Hooks',
    opened: 2005,
    capacity: 5368,
    overview: {
      description: 'Whataburger Field in Corpus Christi, Texas, is the home of the Corpus Christi Hooks, Astros AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 5368 fans. ',
      highlights: [
        'Astros AA affiliate since 2005',
        'Modern facility',
        'Corpus Christi landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Rusty and Honey',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2025, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 7pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Covered concourse provides relief',
        'Night games recommended in summer',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Rusty and Honey team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 107 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '134',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Shiner Bock beer'],
      local: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Shiner', 'Karbach', 'Saint Arnold', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Shiner', 'Karbach', 'Saint Arnold']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Corpus Christi Hooks authentic gear', 'Rusty and Honey merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Rusty and Honeys Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Rusty and Honey', description: 'Hook characters appears pregame', category: 'family' },
        { title: 'Try the Brisket', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Corpus Christi area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5368 Whataburger Field, Corpus Christi, Texas',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2005, event: 'Stadium opens' },
        { year: 2006, event: 'Astros affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Rusty and Honey race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rusty and Honey', description: 'Hook characters' },
      bestExperiences: ['Meeting Rusty and Honey', 'Fireworks shows', 'Trying Brisket', 'Rivalry games'],
      traditions: ['Rusty and Honey antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Brisket at Section 119',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Rusty and Honey meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Rusty and Honey at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'frisco-roughriders': {
    id: 'frisco-roughriders',
    name: 'Riders Field',
    team: 'Frisco RoughRiders',
    opened: 2003,
    capacity: 10316,
    overview: {
      description: 'Riders Field in Frisco, Texas, is the home of the Frisco RoughRiders, Rangers AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 10316 fans. ',
      highlights: [
        'Rangers AA affiliate since 2003',
        'Modern facility',
        'Frisco landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Deuce',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 7pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Covered concourse provides relief',
        'Night games recommended in summer',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Deuce team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Private entrance'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Two suite levels'],
          amenities: ['Catering options', 'Private restrooms', 'In-suite attendant']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 206 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '257',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Shiner Bock beer'],
      local: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Shiner', 'Karbach', 'Saint Arnold', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Shiner', 'Karbach', 'Saint Arnold']
      }
    },
    parking: {
      lots: [
        { name: 'VIP Lot', distance: '50 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Light rail'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: '2 hours early'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Frisco RoughRiders authentic gear', 'Deuce merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Deuces Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '50+ spaces'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Deuce', description: 'Bull rider character appears pregame', category: 'family' },
        { title: 'Try the Brisket', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Frisco area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '10316 Riders Field, Frisco, Texas',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2003, event: 'Stadium opens' },
        { year: 2004, event: 'Rangers affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Deuce race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Deuce', description: 'Bull rider character' },
      bestExperiences: ['Meeting Deuce', 'Fireworks shows', 'Trying Brisket', 'Rivalry games'],
      traditions: ['Deuce antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Brisket at Section 102',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Deuce meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Deuce at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'midland-rockhounds': {
    id: 'midland-rockhounds',
    name: 'Momentum Bank Ballpark',
    team: 'Midland RockHounds',
    opened: 2002,
    capacity: 4999,
    overview: {
      description: 'Momentum Bank Ballpark in Midland, Texas, is the home of the Midland RockHounds, Athletics AA affiliate. This contemporary ballpark combines modern conveniences with intimate seating for 4999 fans. ',
      highlights: [
        'Athletics AA affiliate since 2002',
        'Modern facility',
        'Midland landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Rocky',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 7pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Covered concourse provides relief',
        'Night games recommended in summer',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Rocky team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 99 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '124',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Shiner Bock beer'],
      local: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Shiner', 'Karbach', 'Saint Arnold', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Shiner', 'Karbach', 'Saint Arnold']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Midland RockHounds authentic gear', 'Rocky merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Rockys Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Rocky', description: 'Rock hound dog appears pregame', category: 'family' },
        { title: 'Try the Brisket', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Midland area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4999 Momentum Bank Ballpark, Midland, Texas',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2002, event: 'Stadium opens' },
        { year: 2003, event: 'Athletics affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Rocky race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rocky', description: 'Rock hound dog' },
      bestExperiences: ['Meeting Rocky', 'Fireworks shows', 'Trying Brisket', 'Rivalry games'],
      traditions: ['Rocky antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Brisket at Section 109',
        'Early bird specials'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Rocky meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Rocky at Kids zone',
        'Team logo at entrance',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'northwest-arkansas-naturals': {
    id: 'northwest-arkansas-naturals',
    name: 'Arvest Ballpark',
    team: 'Northwest Arkansas Naturals',
    opened: 2008,
    capacity: 7492,
    overview: {
      description: 'Arvest Ballpark in Springdale, Arkansas, is the home of the Northwest Arkansas Naturals, Royals AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 7492 fans. ',
      highlights: [
        'Royals AA affiliate since 2008',
        'Modern facility',
        'Springdale landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Strike',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2023, description: 'Concourse and concessions renovation' },
        { year: 2028, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Strike team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 149 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '187',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cheese dip', 'Fried catfish', 'Possum pie', 'BBQ beef'],
      local: ['Cheese dip', 'Fried catfish', 'Possum pie', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Northwest Arkansas Naturals authentic gear', 'Strike merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Strikes Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Strike', description: 'Sasquatch appears pregame', category: 'family' },
        { title: 'Try the Cheese dip', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Springdale area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7492 Arvest Ballpark, Springdale, Arkansas',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2008, event: 'Stadium opens' },
        { year: 2009, event: 'Royals affiliation established' },
        { year: 2013, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Strike race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Strike', description: 'Sasquatch' },
      bestExperiences: ['Meeting Strike', 'Fireworks shows', 'Trying Cheese dip', 'Rivalry games'],
      traditions: ['Strike antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cheese dip at Section 110',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Park entrance sign',
        'Picnic area pregame',
        'Strike meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Strike at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'san-antonio-missions': {
    id: 'san-antonio-missions',
    name: 'Nelson W. Wolff Stadium',
    team: 'San Antonio Missions',
    opened: 1994,
    capacity: 9200,
    overview: {
      description: 'Nelson W. Wolff Stadium in San Antonio, Texas, is the home of the San Antonio Missions, Padres AA affiliate. This updated facility maintains its classic charm with a capacity of 9200 fans. ',
      highlights: [
        'Padres AA affiliate since 2000',
        'Renovated Classic facility',
        'San Antonio landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Ballapeno',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2023, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 7pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Shade is essential for day games in the heat',
        'Find shade under stands',
        'Night games recommended in summer',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Ballapeno team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'Field level seats'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 184 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '230',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Shade is essential for day games in the heat', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Shiner Bock beer'],
      local: ['Brisket', 'Tex-Mex nachos', 'Frito pie', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Shiner', 'Karbach', 'Saint Arnold', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Shiner', 'Karbach', 'Saint Arnold']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$15-20', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: '$10-15', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'General admission'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['San Antonio Missions authentic gear', 'Ballapeno merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Ballapenos Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'Main gate accessible',
        elevators: ['Multiple locations']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Ballapeno', description: 'Jalapeño pepper appears pregame', category: 'family' },
        { title: 'Try the Brisket', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'San Antonio area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '9200 Nelson W. Wolff Stadium, San Antonio, Texas',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 1994, event: 'Stadium opens' },
        { year: 2000, event: 'Padres affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Ballapeno race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Ballapeno', description: 'Jalapeño pepper' },
      bestExperiences: ['Meeting Ballapeno', 'Fireworks shows', 'Trying Brisket', 'Rivalry games'],
      traditions: ['Ballapeno antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Brisket at Section 115',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Ballapeno meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Ballapeno at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'springfield-cardinals': {
    id: 'springfield-cardinals',
    name: 'Hammons Field',
    team: 'Springfield Cardinals',
    opened: 2004,
    capacity: 10486,
    overview: {
      description: 'Hammons Field in Springfield, Missouri, is the home of the Springfield Cardinals, Cardinals AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 10486 fans. ',
      highlights: [
        'Cardinals AA affiliate since 2004',
        'Modern facility',
        'Springfield landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Louie',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2020, description: 'Concourse and concessions renovation' },
        { year: 2024, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Club level'],
        indoorAreas: ['Louie team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Wait service', 'Climate controlled', 'Private entrance'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Two suite levels'],
          amenities: ['Catering options', 'Private restrooms', 'In-suite attendant']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 209 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '262',
          description: 'All-inclusive packages',
          amenities: ['Buffet', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['St. Louis ribs', 'Toasted ravioli', 'Gooey butter cake', 'Budweiser'],
      local: ['St. Louis ribs', 'Toasted ravioli', 'Gooey butter cake', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'VIP Lot', distance: '50 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'General Parking', distance: '200 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Light rail'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: '2 hours early'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Springfield Cardinals authentic gear', 'Louie merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Louies Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '50+ spaces'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Louie', description: 'Red bird appears pregame', category: 'family' },
        { title: 'Try the St. Louis ribs', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: false,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Springfield area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '10486 Hammons Field, Springfield, Missouri',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2004, event: 'Stadium opens' },
        { year: 2005, event: 'Cardinals affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Louie race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Louie', description: 'Red bird' },
      bestExperiences: ['Meeting Louie', 'Fireworks shows', 'Trying St. Louis ribs', 'Rivalry games'],
      traditions: ['Louie antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best St. Louis ribs at Section 115',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Picnic area pregame',
        'Louie meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Louie at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'tulsa-drillers': {
    id: 'tulsa-drillers',
    name: 'ONEOK Field',
    team: 'Tulsa Drillers',
    opened: 2010,
    capacity: 7833,
    overview: {
      description: 'ONEOK Field in Tulsa, Oklahoma, is the home of the Tulsa Drillers, Dodgers AA affiliate. This contemporary ballpark combines modern conveniences with a capacity of 7833 fans. ',
      highlights: [
        'Dodgers AA affiliate since 2010',
        'Modern facility',
        'Tulsa landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Hornsby',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2020, description: 'Seating improvements' },
        { year: 2025, description: 'Concourse and concessions renovation' },
        { year: 2030, description: 'Video board installation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Hornsby team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Wait service', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Standing room with bar', capacity: 156 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '195',
          description: 'All-inclusive packages',
          amenities: ['Local beer selection', 'Reserved seating', 'Covered area']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Onion burgers', 'Chicken fried steak', 'Fried okra', 'Calf fries'],
      local: ['Onion burgers', 'Chicken fried steak', 'Fried okra', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$8', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Arrive early for best spots'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Street pickup',
        bicycle: 'Bike racks'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Groups'],
        openTime: 'With main gates'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Tulsa Drillers authentic gear', 'Hornsby merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Hornsbys Playground',
          location: 'Beyond outfield',
          activities: ['Playground', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Hornsby', description: 'Drill bit character appears pregame', category: 'family' },
        { title: 'Try the Onion burgers', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Small bags',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Tulsa area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7833 ONEOK Field, Tulsa, Oklahoma',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Moderate',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Main gate area',
        dropoffZone: 'Main gate',
        surgePricing: 'Occasional',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2010, event: 'Stadium opens' },
        { year: 2011, event: 'Dodgers affiliation established' },
        { year: 2015, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Hornsby race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Hornsby', description: 'Drill bit character' },
      bestExperiences: ['Meeting Hornsby', 'Fireworks shows', 'Trying Onion burgers', 'Rivalry games'],
      traditions: ['Hornsby antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Onion burgers at Section 116',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Long concession lines at peak',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Secret menu at concessions',
        'Stadium entrance plaza',
        'Standing room bar area',
        'Hornsby meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Hornsby at Kids zone',
        'Sunset from upper deck',
        'Historic photos display'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Family packs',
        'Flex plans'
      ]
    }
  },
  'wichita-wind-surge': {
    id: 'wichita-wind-surge',
    name: 'Riverfront Stadium',
    team: 'Wichita Wind Surge',
    opened: 2020,
    capacity: 10025,
    overview: {
      description: 'Riverfront Stadium in Wichita, Kansas, is the home of the Wichita Wind Surge, Twins AA affiliate. This brand new facility features modern amenities with a capacity of 10025 fans. ',
      highlights: [
        'Twins AA affiliate since 2020',
        'State-Of-The-Art facility',
        'Wichita landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Surge',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2030, description: 'Seating improvements' },
        { year: 2035, description: 'Concourse and concessions renovation' },
        { year: 2040, description: 'Premium areas upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club level'],
        afternoon: ['Suite level', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Club level overhang', 'Suites and club seats'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Club level'],
        indoorAreas: ['Surge team store', 'Club lounge'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['Outfield bleachers', 'First base line lower'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 55, rainChance: 35, typicalConditions: 'Cool and sometimes rainy, layer up', shadeTip: 'Bring layers and rain gear' },
        { month: 'May', avgTemp: 70, avgHumidity: 60, rainChance: 25, typicalConditions: 'Perfect baseball weather, mild temperatures', shadeTip: 'Ideal conditions, any seat works' },
        { month: 'June', avgTemp: 80, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warm days, comfortable evenings', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid, stay hydrated', shadeTip: 'Choose covered seating if possible' },
        { month: 'August', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak summer heat, evening games preferred', shadeTip: 'Avoid direct sun exposure' },
        { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cooling down, great for afternoon games', shadeTip: 'Perfect weather for any seating' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Private entrance'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Two suite levels'],
          amenities: ['Catering options', 'Private restrooms', 'In-suite attendant']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 200 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '250',
          description: 'Craft beer focus',
          amenities: ['Local beer selection', 'Reserved seating', 'TVs and games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views but most expensive', category: 'view' },
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Lawn', tip: 'Best value for families', category: 'value' },
        { section: 'Rooftop', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Kansas City BBQ', 'Burnt ends', 'Bierocks', 'Boulevard beer'],
      local: ['Kansas City BBQ', 'Burnt ends', 'Bierocks', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Beyond burgers', 'Pizza', 'Cauliflower wings'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: true,
        cocktails: true,
        localBreweries: ['Local craft beer']
      }
    },
    parking: {
      lots: [
        { name: 'VIP Lot', distance: '50 yards', price: '$8', shadedSpots: true, covered: false },
        { name: 'General Parking', distance: '200 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Residential permit required',
        tip: 'Use parking apps'
      },
      alternativeTransport: {
        publicTransit: ['Light rail'],
        rideShare: 'Dedicated pickup zone',
        bicycle: 'Bike valet'
      }
    },
    gates: [
      {
        name: 'Home Plate Plaza',
        location: 'Plaza entrance',
        bestFor: ['All seating', 'ADA accessible'],
        openTime: '90 minutes early'
      },
      {
        name: 'VIP Entrance',
        location: 'Club level access',
        bestFor: ['Premium seating', 'Season ticket holders'],
        openTime: '2 hours early'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Team Store Plaza', exclusive: ['Wichita Wind Surge authentic gear', 'Surge merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['All restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Throughout concourse'],
      kidZones: [
        {
          name: 'Surges Playground',
          location: 'Beyond outfield',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '50+ spaces'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Surge', description: 'Wind character appears pregame', category: 'family' },
        { title: 'Try the Kansas City BBQ', description: 'Local favorite', category: 'food' },
        { title: 'Happy hour', description: 'Thursdays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes early',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM',
        rushHours: ['30 min before game']
      },
      security: {
        allowedBags: 'Clear bags only',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    neighborhood: {
      name: 'Wichita area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Walk the riverfront'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '10025 Riverfront Stadium, Wichita, Kansas',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Highway access'],
        typicalTraffic: 'Heavy on game days',
        bestApproach: 'Follow stadium signs'
      },
      rideShare: {
        pickupZone: 'Dedicated zone',
        dropoffZone: 'Plaza entrance',
        surgePricing: 'Common postgame',
        alternativeTip: 'Schedule in advance'
      }
    },
    history: {
      timeline: [
        { year: 2020, event: 'Stadium opens' },
        { year: 2021, event: 'Twins affiliation established' },
        { year: 2025, event: 'First championship' },
        { year: 2030, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Surge race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Surge', description: 'Wind character' },
      bestExperiences: ['Meeting Surge', 'Fireworks shows', 'Trying Kansas City BBQ', 'Rivalry games'],
      traditions: ['Surge antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Download the app for deals',
        'Best Kansas City BBQ at Section 119',
        'Pregame happy hour'
      ],
      avoidThese: [
        'Parking lot traffic postgame',
        'Sun in right field afternoon',
        'Crowded kids zone on Sundays'
      ],
      hiddenGems: [
        'Craft beer garden',
        'Stadium entrance plaza',
        'Standing room bar area',
        'Surge meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Surge at Kids zone',
        'Sunset from upper deck',
        'Instagram wall'
      ],
      bestValue: [
        'Group packages',
        'Lawn seats',
        'Happy hour deals',
        'Season memberships'
      ]
    }
  }
};