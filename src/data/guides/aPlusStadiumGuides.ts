import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides: Record<string, StadiumGuide> = {
  'aberdeen-ironbirds': {
    id: 'aberdeen-ironbirds',
    name: 'Leidos Field at Ripken Stadium',
    team: 'Aberdeen IronBirds',
    opened: 2002,
    capacity: 6300,
    overview: {
      description: 'Leidos Field at Ripken Stadium in Aberdeen, Maryland, is the home of the Aberdeen IronBirds, Orioles High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 6300 fans. ',
      highlights: [
        'Orioles High-A affiliate since 2002',
        'Modern facility',
        'Aberdeen landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Ripcord',
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
        indoorAreas: ['Ripcord team store', 'Concession stands'],
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
          capacity: '157',
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
        { location: 'Main concourse', exclusive: ['Aberdeen IronBirds authentic gear', 'Ripcord merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Ripcords Playground',
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
        { title: 'Meet Ripcord', description: 'Iron bird mascot appears pregame', category: 'family' },
        { title: 'Try the Crab cakes', description: 'Local favorite', category: 'food' },
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
      name: 'Aberdeen area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6300 Leidos Field at Ripken Stadium, Aberdeen, Maryland',
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
        { year: 2003, event: 'Orioles affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Ripcord race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Ripcord', description: 'Iron bird mascot' },
      bestExperiences: ['Meeting Ripcord', 'Fireworks shows', 'Trying Crab cakes', 'Rivalry games'],
      traditions: ['Ripcord antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Crab cakes at Section 117',
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
        'Ripcord meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Ripcord at Kids zone',
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
  'brooklyn-cyclones': {
    id: 'brooklyn-cyclones',
    name: 'Maimonides Park',
    team: 'Brooklyn Cyclones',
    opened: 2001,
    capacity: 7500,
    overview: {
      description: 'Maimonides Park in Brooklyn, New York, is the home of the Brooklyn Cyclones, Mets High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 7500 fans. ',
      highlights: [
        'Mets High-A affiliate since 2001',
        'Modern facility',
        'Brooklyn landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Sandy',
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
        indoorAreas: ['Sandy team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 150 }
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
      signature: ["Nathan\\'s hot dogs", 'New York pizza', 'Knishes', 'Black and white cookies'],
      local: ["Nathan\\'s hot dogs", 'New York pizza', 'Knishes', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Brooklyn Brewery', 'Blue Point', 'Southern Tier', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Brooklyn Brewery', 'Blue Point', 'Southern Tier']
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
        { location: 'Main concourse', exclusive: ['Brooklyn Cyclones authentic gear', 'Sandy merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Sandys Playground',
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
        { title: 'Meet Sandy', description: 'Seagull appears pregame', category: 'family' },
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
      name: 'Brooklyn area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7500 Maimonides Park, Brooklyn, New York',
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
        { year: 2001, event: 'Stadium opens' },
        { year: 2002, event: 'Mets affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Sandy race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Sandy', description: 'Seagull' },
      bestExperiences: ['Meeting Sandy', 'Fireworks shows', 'Trying Nathan\'s hot dogs', 'Rivalry games'],
      traditions: ['Sandy antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Nathan\'s hot dogs at Section 118',
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
        'Sandy meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Sandy at Kids zone',
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
  'hudson-valley-renegades': {
    id: 'hudson-valley-renegades',
    name: 'Dutchess Stadium',
    team: 'Hudson Valley Renegades',
    opened: 1994,
    capacity: 4494,
    overview: {
      description: 'Dutchess Stadium in Wappingers Falls, New York, is the home of the Hudson Valley Renegades, Yankees High-A affiliate. This updated facility maintains its classic charm with intimate seating for 4494 fans. ',
      highlights: [
        'Yankees High-A affiliate since 2000',
        'Renovated Classic facility',
        'Wappingers Falls landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
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
        indoorAreas: ['Rascal team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'Field level seats'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 89 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '112',
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
        wine: false,
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
        { location: 'Main concourse', exclusive: ['Hudson Valley Renegades authentic gear', 'Rascal merchandise'] }
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
        sections: ['Designated areas'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Rascal', description: 'Raccoon bandit appears pregame', category: 'family' },
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
      name: 'Wappingers Falls area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4494 Dutchess Stadium, Wappingers Falls, New York',
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
        { year: 2000, event: 'Yankees affiliation begins' },
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
      mascot: { name: 'Rascal', description: 'Raccoon bandit' },
      bestExperiences: ['Meeting Rascal', 'Fireworks shows', 'Trying Nathan\'s hot dogs', 'Rivalry games'],
      traditions: ['Rascal antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Nathan\'s hot dogs at Section 104',
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
  'jersey-shore-blueclaws': {
    id: 'jersey-shore-blueclaws',
    name: 'ShoreTown Ballpark',
    team: 'Jersey Shore BlueClaws',
    opened: 2001,
    capacity: 6588,
    overview: {
      description: 'ShoreTown Ballpark in Lakewood, New Jersey, is the home of the Jersey Shore BlueClaws, Phillies High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 6588 fans. ',
      highlights: [
        'Phillies High-A affiliate since 2001',
        'Modern facility',
        'Lakewood landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Buster',
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
        indoorAreas: ['Buster team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 131 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '164',
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
        { location: 'Main concourse', exclusive: ['Jersey Shore BlueClaws authentic gear', 'Buster merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Busters Playground',
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
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Buster', description: 'Blue crab appears pregame', category: 'family' },
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
      name: 'Lakewood area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6588 ShoreTown Ballpark, Lakewood, New Jersey',
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
        { year: 2001, event: 'Stadium opens' },
        { year: 2002, event: 'Phillies affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Buster race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Buster', description: 'Blue crab' },
      bestExperiences: ['Meeting Buster', 'Fireworks shows', 'Trying Pork roll sandwiches', 'Rivalry games'],
      traditions: ['Buster antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Pork roll sandwiches at Section 106',
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
        'Buster meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Buster at Kids zone',
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
  'wilmington-blue-rocks': {
    id: 'wilmington-blue-rocks',
    name: 'Frawley Stadium',
    team: 'Wilmington Blue Rocks',
    opened: 1993,
    capacity: 6532,
    overview: {
      description: 'Frawley Stadium in Wilmington, Delaware, is the home of the Wilmington Blue Rocks, Nationals High-A affiliate. This updated facility maintains its classic charm with a capacity of 6532 fans. ',
      highlights: [
        'Nationals High-A affiliate since 2000',
        'Renovated Classic facility',
        'Wilmington landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Rocky Bluewinkle',
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
        indoorAreas: ['Rocky Bluewinkle team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 130 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '163',
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
      signature: ['Scrapple', 'Blue crab', 'Boardwalk fries', 'Dogfish Head beer'],
      local: ['Scrapple', 'Blue crab', 'Boardwalk fries', 'Local craft selections'],
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
        { location: 'Main concourse', exclusive: ['Wilmington Blue Rocks authentic gear', 'Rocky Bluewinkle merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Rocky Bluewinkles Playground',
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
        { title: 'Meet Rocky Bluewinkle', description: 'Blue moose appears pregame', category: 'family' },
        { title: 'Try the Scrapple', description: 'Local favorite', category: 'food' },
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
      name: 'Wilmington area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6532 Frawley Stadium, Wilmington, Delaware',
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
        { year: 1993, event: 'Stadium opens' },
        { year: 2000, event: 'Nationals affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Rocky Bluewinkle race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rocky Bluewinkle', description: 'Blue moose' },
      bestExperiences: ['Meeting Rocky Bluewinkle', 'Fireworks shows', 'Trying Scrapple', 'Rivalry games'],
      traditions: ['Rocky Bluewinkle antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Scrapple at Section 119',
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
        'Rocky Bluewinkle meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Rocky Bluewinkle at Kids zone',
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
  'asheville-tourists': {
    id: 'asheville-tourists',
    name: 'McCormick Field',
    team: 'Asheville Tourists',
    opened: 1924,
    capacity: 4000,
    overview: {
      description: 'McCormick Field in Asheville, North Carolina, is the home of the Asheville Tourists, Astros High-A affiliate. This historic venue offers nostalgic baseball with intimate seating for 4000 fans. ',
      highlights: [
        'Astros High-A affiliate since 2000',
        'Historic facility',
        'Asheville landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Ted E. Tourist',
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
        indoorAreas: ['Ted E. Tourist team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'Field level seats'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 80 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '100',
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
      signature: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Cheerwine floats'],
      local: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Highland', 'Wicked Weed', 'NoDa', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Highland', 'Wicked Weed', 'NoDa']
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
        { location: 'Main concourse', exclusive: ['Asheville Tourists authentic gear', 'Ted E. Tourist merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Ted E. Tourists Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Ted E. Tourist', description: 'Tourist character appears pregame', category: 'family' },
        { title: 'Try the Carolina BBQ', description: 'Local favorite', category: 'food' },
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
      name: 'Asheville area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4000 McCormick Field, Asheville, North Carolina',
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
        { year: 1924, event: 'Stadium opens' },
        { year: 2000, event: 'Astros affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Ted E. Tourist race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Ted E. Tourist', description: 'Tourist character' },
      bestExperiences: ['Meeting Ted E. Tourist', 'Fireworks shows', 'Trying Carolina BBQ', 'Rivalry games'],
      traditions: ['Ted E. Tourist antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Carolina BBQ at Section 117',
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
        'Ted E. Tourist meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Ted E. Tourist at Kids zone',
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
  'bowling-green-hot-rods': {
    id: 'bowling-green-hot-rods',
    name: 'Bowling Green Ballpark',
    team: 'Bowling Green Hot Rods',
    opened: 2009,
    capacity: 4559,
    overview: {
      description: 'Bowling Green Ballpark in Bowling Green, Kentucky, is the home of the Bowling Green Hot Rods, Rays High-A affiliate. This contemporary ballpark combines modern conveniences with intimate seating for 4559 fans. ',
      highlights: [
        'Rays High-A affiliate since 2009',
        'Modern facility',
        'Bowling Green landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Axle and Rosie',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2019, description: 'LED lighting upgrade' },
        { year: 2024, description: 'Concourse and concessions renovation' },
        { year: 2029, description: 'Video board installation' }
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
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Axle and Rosie team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 91 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '113',
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
      signature: ['Hot Browns', 'Bourbon items', 'Burgoo', 'Beer cheese'],
      local: ['Hot Browns', 'Bourbon items', 'Burgoo', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
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
        { location: 'Main concourse', exclusive: ['Bowling Green Hot Rods authentic gear', 'Axle and Rosie merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Axle and Rosies Playground',
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
        { title: 'Meet Axle and Rosie', description: 'Racing duo appears pregame', category: 'family' },
        { title: 'Try the Hot Browns', description: 'Local favorite', category: 'food' },
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
      name: 'Bowling Green area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4559 Bowling Green Ballpark, Bowling Green, Kentucky',
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
        { year: 2009, event: 'Stadium opens' },
        { year: 2010, event: 'Rays affiliation established' },
        { year: 2014, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Axle and Rosie race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Axle and Rosie', description: 'Racing duo' },
      bestExperiences: ['Meeting Axle and Rosie', 'Fireworks shows', 'Trying Hot Browns', 'Rivalry games'],
      traditions: ['Axle and Rosie antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Hot Browns at Section 118',
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
        'Axle and Rosie meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Axle and Rosie at Kids zone',
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
  'greensboro-grasshoppers': {
    id: 'greensboro-grasshoppers',
    name: 'First National Bank Field',
    team: 'Greensboro Grasshoppers',
    opened: 2005,
    capacity: 7499,
    overview: {
      description: 'First National Bank Field in Greensboro, North Carolina, is the home of the Greensboro Grasshoppers, Pirates High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 7499 fans. ',
      highlights: [
        'Pirates High-A affiliate since 2005',
        'Modern facility',
        'Greensboro landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Guilford',
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
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Guilford team store', 'Concession stands'],
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
      signature: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Cheerwine floats'],
      local: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Highland', 'Wicked Weed', 'NoDa', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Highland', 'Wicked Weed', 'NoDa']
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
        { location: 'Main concourse', exclusive: ['Greensboro Grasshoppers authentic gear', 'Guilford merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Guilfords Playground',
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
        { title: 'Meet Guilford', description: 'Green grasshopper appears pregame', category: 'family' },
        { title: 'Try the Carolina BBQ', description: 'Local favorite', category: 'food' },
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
      name: 'Greensboro area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7499 First National Bank Field, Greensboro, North Carolina',
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
        { year: 2006, event: 'Pirates affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Guilford race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Guilford', description: 'Green grasshopper' },
      bestExperiences: ['Meeting Guilford', 'Fireworks shows', 'Trying Carolina BBQ', 'Rivalry games'],
      traditions: ['Guilford antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Carolina BBQ at Section 103',
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
        'Guilford meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Guilford at Kids zone',
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
  'greenville-drive': {
    id: 'greenville-drive',
    name: 'Fluor Field',
    team: 'Greenville Drive',
    opened: 2006,
    capacity: 6700,
    overview: {
      description: 'Fluor Field in Greenville, South Carolina, is the home of the Greenville Drive, Red Sox High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 6700 fans. ',
      highlights: [
        'Red Sox High-A affiliate since 2006',
        'Modern facility',
        'Greenville landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Reedy Rip\'It',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2021, description: 'Concourse and concessions renovation' },
        { year: 2026, description: 'Video board installation' }
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
        indoorAreas: ['Reedy Rip\'It team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 134 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '167',
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
      signature: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'She-crab soup'],
      local: ['Mustard BBQ', 'Pimento cheese', 'Boiled peanuts', 'Local craft selections'],
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
        { location: 'Main concourse', exclusive: ['Greenville Drive authentic gear', 'Reedy Rip\'It merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Reedy Rip\'Its Playground',
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
        { title: 'Meet Reedy Rip\'It', description: 'Baseball character appears pregame', category: 'family' },
        { title: 'Try the Mustard BBQ', description: 'Local favorite', category: 'food' },
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
      name: 'Greenville area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6700 Fluor Field, Greenville, South Carolina',
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
        { year: 2006, event: 'Stadium opens' },
        { year: 2007, event: 'Red Sox affiliation established' },
        { year: 2011, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Reedy Rip\'It race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Reedy Rip\'It', description: 'Baseball character' },
      bestExperiences: ['Meeting Reedy Rip\'It', 'Fireworks shows', 'Trying Mustard BBQ', 'Rivalry games'],
      traditions: ['Reedy Rip\'It antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Mustard BBQ at Section 103',
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
        'Reedy Rip\'It meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Reedy Rip\'It at Kids zone',
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
  'hickory-crawdads': {
    id: 'hickory-crawdads',
    name: 'L.P. Frans Stadium',
    team: 'Hickory Crawdads',
    opened: 1993,
    capacity: 5062,
    overview: {
      description: 'L.P. Frans Stadium in Hickory, North Carolina, is the home of the Hickory Crawdads, Rangers High-A affiliate. This updated facility maintains its classic charm with a capacity of 5062 fans. ',
      highlights: [
        'Rangers High-A affiliate since 2000',
        'Renovated Classic facility',
        'Hickory landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Conrad',
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
        indoorAreas: ['Conrad team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 101 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '126',
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
      signature: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Cheerwine floats'],
      local: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Highland', 'Wicked Weed', 'NoDa', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Highland', 'Wicked Weed', 'NoDa']
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
        { location: 'Main concourse', exclusive: ['Hickory Crawdads authentic gear', 'Conrad merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Conrads Playground',
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
        { title: 'Meet Conrad', description: 'Crawfish appears pregame', category: 'family' },
        { title: 'Try the Carolina BBQ', description: 'Local favorite', category: 'food' },
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
      name: 'Hickory area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5062 L.P. Frans Stadium, Hickory, North Carolina',
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
        { year: 1993, event: 'Stadium opens' },
        { year: 2000, event: 'Rangers affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Conrad race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Conrad', description: 'Crawfish' },
      bestExperiences: ['Meeting Conrad', 'Fireworks shows', 'Trying Carolina BBQ', 'Rivalry games'],
      traditions: ['Conrad antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Carolina BBQ at Section 104',
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
        'Conrad meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Conrad at Kids zone',
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
  'rome-braves': {
    id: 'rome-braves',
    name: 'State Mutual Stadium',
    team: 'Rome Braves',
    opened: 2003,
    capacity: 5105,
    overview: {
      description: 'State Mutual Stadium in Rome, Georgia, is the home of the Rome Braves, Braves High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 5105 fans. ',
      highlights: [
        'Braves High-A affiliate since 2003',
        'Modern facility',
        'Rome landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Romey',
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
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Romey team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 102 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '127',
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
      signature: ['Peach cobbler', 'Fried chicken', 'Pimento cheese', 'Sweet tea'],
      local: ['Peach cobbler', 'Fried chicken', 'Pimento cheese', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
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
        { location: 'Main concourse', exclusive: ['Rome Braves authentic gear', 'Romey merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Romeys Playground',
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
        { title: 'Meet Romey', description: 'Wolf in Braves uniform appears pregame', category: 'family' },
        { title: 'Try the Peach cobbler', description: 'Local favorite', category: 'food' },
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
      name: 'Rome area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5105 State Mutual Stadium, Rome, Georgia',
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
        { year: 2003, event: 'Stadium opens' },
        { year: 2004, event: 'Braves affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Romey race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Romey', description: 'Wolf in Braves uniform' },
      bestExperiences: ['Meeting Romey', 'Fireworks shows', 'Trying Peach cobbler', 'Rivalry games'],
      traditions: ['Romey antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Peach cobbler at Section 114',
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
        'Romey meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Romey at Kids zone',
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
  'winston-salem-dash': {
    id: 'winston-salem-dash',
    name: 'Truist Stadium',
    team: 'Winston-Salem Dash',
    opened: 2010,
    capacity: 5500,
    overview: {
      description: 'Truist Stadium in Winston-Salem, North Carolina, is the home of the Winston-Salem Dash, White Sox High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 5500 fans. ',
      highlights: [
        'White Sox High-A affiliate since 2010',
        'Modern facility',
        'Winston-Salem landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Bolt',
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
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Bolt team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Standing room with bar', capacity: 110 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '137',
          description: 'All-inclusive packages',
          amenities: ['Local beer selection', 'Reserved seating', 'Covered area']
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
      signature: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Cheerwine floats'],
      local: ['Carolina BBQ', 'Hush puppies', 'Sweet tea', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Highland', 'Wicked Weed', 'NoDa', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Highland', 'Wicked Weed', 'NoDa']
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
        { location: 'Team Store Plaza', exclusive: ['Winston-Salem Dash authentic gear', 'Bolt merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Bolts Playground',
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
        { title: 'Meet Bolt', description: 'Fast character appears pregame', category: 'family' },
        { title: 'Try the Carolina BBQ', description: 'Local favorite', category: 'food' },
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
      name: 'Winston-Salem area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5500 Truist Stadium, Winston-Salem, North Carolina',
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
        { year: 2011, event: 'White Sox affiliation established' },
        { year: 2015, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Bolt race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Bolt', description: 'Fast character' },
      bestExperiences: ['Meeting Bolt', 'Fireworks shows', 'Trying Carolina BBQ', 'Rivalry games'],
      traditions: ['Bolt antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Carolina BBQ at Section 119',
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
        'Bolt meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Bolt at Kids zone',
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
  'eugene-emeralds': {
    id: 'eugene-emeralds',
    name: 'PK Park',
    team: 'Eugene Emeralds',
    opened: 2009,
    capacity: 4000,
    overview: {
      description: 'PK Park in Eugene, Oregon, is the home of the Eugene Emeralds, Giants High-A affiliate. This contemporary ballpark combines modern conveniences with intimate seating for 4000 fans. ',
      highlights: [
        'Giants High-A affiliate since 2009',
        'Modern facility',
        'Eugene landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Slug',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2019, description: 'LED lighting upgrade' },
        { year: 2024, description: 'Concourse and concessions renovation' },
        { year: 2029, description: 'Video board installation' }
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
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Slug team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 80 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '100',
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
      signature: ['Craft beer', 'Marionberry pie', 'Food trucks', 'Portland coffee'],
      local: ['Craft beer', 'Marionberry pie', 'Food trucks', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Deschutes', 'Rogue', 'Widmer Brothers', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Deschutes', 'Rogue', 'Widmer Brothers']
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
        { location: 'Main concourse', exclusive: ['Eugene Emeralds authentic gear', 'Slug merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Slugs Playground',
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
        { title: 'Meet Slug', description: 'Green slug appears pregame', category: 'family' },
        { title: 'Try the Craft beer', description: 'Local favorite', category: 'food' },
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
      name: 'Eugene area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4000 PK Park, Eugene, Oregon',
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
        { year: 2009, event: 'Stadium opens' },
        { year: 2010, event: 'Giants affiliation established' },
        { year: 2014, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Slug race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Slug', description: 'Green slug' },
      bestExperiences: ['Meeting Slug', 'Fireworks shows', 'Trying Craft beer', 'Rivalry games'],
      traditions: ['Slug antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Craft beer at Section 101',
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
        'Slug meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Slug at Kids zone',
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
  'everett-aquasox': {
    id: 'everett-aquasox',
    name: 'Funko Field',
    team: 'Everett AquaSox',
    opened: 1984,
    capacity: 3682,
    overview: {
      description: 'Funko Field in Everett, Washington, is the home of the Everett AquaSox, Mariners High-A affiliate. This historic venue offers nostalgic baseball with intimate seating for 3682 fans. ',
      highlights: [
        'Mariners High-A affiliate since 2000',
        'Historic facility',
        'Everett landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Webbly',
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
        indoorAreas: ['Webbly team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'Field level seats'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 73 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '92',
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
      signature: ['Seattle dogs', 'Salmon', 'Craft beer', 'Coffee drinks'],
      local: ['Seattle dogs', 'Salmon', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
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
        { location: 'Main concourse', exclusive: ['Everett AquaSox authentic gear', 'Webbly merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Webblys Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Webbly', description: 'Frog appears pregame', category: 'family' },
        { title: 'Try the Seattle dogs', description: 'Local favorite', category: 'food' },
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
      name: 'Everett area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '3682 Funko Field, Everett, Washington',
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
        { year: 1984, event: 'Stadium opens' },
        { year: 2000, event: 'Mariners affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Webbly race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Webbly', description: 'Frog' },
      bestExperiences: ['Meeting Webbly', 'Fireworks shows', 'Trying Seattle dogs', 'Rivalry games'],
      traditions: ['Webbly antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Seattle dogs at Section 101',
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
        'Webbly meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Webbly at Kids zone',
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
  'hillsboro-hops': {
    id: 'hillsboro-hops',
    name: 'Ron Tonkin Field',
    team: 'Hillsboro Hops',
    opened: 2013,
    capacity: 4500,
    overview: {
      description: 'Ron Tonkin Field in Hillsboro, Oregon, is the home of the Hillsboro Hops, Diamondbacks High-A affiliate. This contemporary ballpark combines modern conveniences with intimate seating for 4500 fans. ',
      highlights: [
        'Diamondbacks High-A affiliate since 2013',
        'Modern facility',
        'Hillsboro landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Barley',
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
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Barley team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Standing room with bar', capacity: 90 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '112',
          description: 'All-inclusive packages',
          amenities: ['Local beer selection', 'Reserved seating', 'Covered area']
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
      signature: ['Craft beer', 'Marionberry pie', 'Food trucks', 'Portland coffee'],
      local: ['Craft beer', 'Marionberry pie', 'Food trucks', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Deschutes', 'Rogue', 'Widmer Brothers', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Deschutes', 'Rogue', 'Widmer Brothers']
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
        { location: 'Team Store Plaza', exclusive: ['Hillsboro Hops authentic gear', 'Barley merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Barleys Playground',
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
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Barley', description: 'Hop character appears pregame', category: 'family' },
        { title: 'Try the Craft beer', description: 'Local favorite', category: 'food' },
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
      name: 'Hillsboro area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '4500 Ron Tonkin Field, Hillsboro, Oregon',
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
        { year: 2013, event: 'Stadium opens' },
        { year: 2014, event: 'Diamondbacks affiliation established' },
        { year: 2018, event: 'First championship' },
        { year: 2023, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Barley race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Barley', description: 'Hop character' },
      bestExperiences: ['Meeting Barley', 'Fireworks shows', 'Trying Craft beer', 'Rivalry games'],
      traditions: ['Barley antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Craft beer at Section 104',
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
        'Barley meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Barley at Kids zone',
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
  'spokane-indians': {
    id: 'spokane-indians',
    name: 'Avista Stadium',
    team: 'Spokane Indians',
    opened: 1958,
    capacity: 6803,
    overview: {
      description: 'Avista Stadium in Spokane, Washington, is the home of the Spokane Indians, Rockies High-A affiliate. This historic venue offers nostalgic baseball with a capacity of 6803 fans. ',
      highlights: [
        'Rockies High-A affiliate since 2000',
        'Historic facility',
        'Spokane landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Otto and Doris',
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
        indoorAreas: ['Otto and Doris team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 136 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '170',
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
      signature: ['Seattle dogs', 'Salmon', 'Craft beer', 'Coffee drinks'],
      local: ['Seattle dogs', 'Salmon', 'Craft beer', 'Local craft selections'],
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
        { location: 'Main concourse', exclusive: ['Spokane Indians authentic gear', 'Otto and Doris merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Otto and Doriss Playground',
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
        { title: 'Meet Otto and Doris', description: 'Native American-themed duo appears pregame', category: 'family' },
        { title: 'Try the Seattle dogs', description: 'Local favorite', category: 'food' },
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
      name: 'Spokane area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6803 Avista Stadium, Spokane, Washington',
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
        { year: 1958, event: 'Stadium opens' },
        { year: 2000, event: 'Rockies affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Otto and Doris race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Otto and Doris', description: 'Native American-themed duo' },
      bestExperiences: ['Meeting Otto and Doris', 'Fireworks shows', 'Trying Seattle dogs', 'Rivalry games'],
      traditions: ['Otto and Doris antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Seattle dogs at Section 115',
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
        'Otto and Doris meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Otto and Doris at Kids zone',
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
  'tri-city-dust-devils': {
    id: 'tri-city-dust-devils',
    name: 'Gesa Stadium',
    team: 'Tri-City Dust Devils',
    opened: 1995,
    capacity: 3654,
    overview: {
      description: 'Gesa Stadium in Pasco, Washington, is the home of the Tri-City Dust Devils, Angels High-A affiliate. This updated facility maintains its classic charm with intimate seating for 3654 fans. ',
      highlights: [
        'Angels High-A affiliate since 2000',
        'Renovated Classic facility',
        'Pasco landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Dusty',
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
        indoorAreas: ['Dusty team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'Field level seats'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 73 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '91',
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
      signature: ['Seattle dogs', 'Salmon', 'Craft beer', 'Coffee drinks'],
      local: ['Seattle dogs', 'Salmon', 'Craft beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
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
        { location: 'Main concourse', exclusive: ['Tri-City Dust Devils authentic gear', 'Dusty merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Dustys Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Dusty', description: 'Dust devil character appears pregame', category: 'family' },
        { title: 'Try the Seattle dogs', description: 'Local favorite', category: 'food' },
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
      name: 'Pasco area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '3654 Gesa Stadium, Pasco, Washington',
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
        { year: 2000, event: 'Angels affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Dusty race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Dusty', description: 'Dust devil character' },
      bestExperiences: ['Meeting Dusty', 'Fireworks shows', 'Trying Seattle dogs', 'Rivalry games'],
      traditions: ['Dusty antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Seattle dogs at Section 116',
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
        'Dusty meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Dusty at Kids zone',
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
  'vancouver-canadians': {
    id: 'vancouver-canadians',
    name: 'Nat Bailey Stadium',
    team: 'Vancouver Canadians',
    opened: 1951,
    capacity: 6500,
    overview: {
      description: 'Nat Bailey Stadium in Vancouver, British Columbia, is the home of the Vancouver Canadians, Blue Jays High-A affiliate. This historic venue offers nostalgic baseball with a capacity of 6500 fans. ',
      highlights: [
        'Blue Jays High-A affiliate since 2000',
        'Historic facility',
        'Vancouver landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Bob Brown Bear',
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
        indoorAreas: ['Bob Brown Bear team store', 'Concession stands'],
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
        { section: 'Third base line', tip: 'Check weather forecast before choosing seats', category: 'shade' },
        { section: 'Bleachers', tip: 'Best value for families', category: 'value' },
        { section: 'Upper deck', tip: 'Great for groups', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Poutine', 'BC salmon', 'Nanaimo bars', 'Canadian beer'],
      local: ['Poutine', 'BC salmon', 'Nanaimo bars', 'Local craft selections'],
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
        { location: 'Main concourse', exclusive: ['Vancouver Canadians authentic gear', 'Bob Brown Bear merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Bob Brown Bears Playground',
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
        { title: 'Meet Bob Brown Bear', description: 'Canadian bear appears pregame', category: 'family' },
        { title: 'Try the Poutine', description: 'Local favorite', category: 'food' },
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
      name: 'Vancouver area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '6500 Nat Bailey Stadium, Vancouver, British Columbia',
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
        { year: 1951, event: 'Stadium opens' },
        { year: 2000, event: 'Blue Jays affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Bob Brown Bear race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Bob Brown Bear', description: 'Canadian bear' },
      bestExperiences: ['Meeting Bob Brown Bear', 'Fireworks shows', 'Trying Poutine', 'Rivalry games'],
      traditions: ['Bob Brown Bear antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Poutine at Section 118',
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
        'Bob Brown Bear meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Bob Brown Bear at Kids zone',
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
  'beloit-sky-carp': {
    id: 'beloit-sky-carp',
    name: 'ABC Supply Stadium',
    team: 'Beloit Sky Carp',
    opened: 2021,
    capacity: 3850,
    overview: {
      description: 'ABC Supply Stadium in Beloit, Wisconsin, is the home of the Beloit Sky Carp, Marlins High-A affiliate. This brand new facility features modern amenities with intimate seating for 3850 fans. ',
      highlights: [
        'Marlins High-A affiliate since 2021',
        'State-Of-The-Art facility',
        'Beloit landmark',
        'Family-friendly atmosphere',
        'Intimate setting'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Splash',
        'Craft beer garden',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2031, description: 'Seating improvements' },
        { year: 2036, description: 'Concourse and concessions renovation' },
        { year: 2041, description: 'Premium areas upgrade' }
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
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Limited areas'],
        indoorAreas: ['Splash team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'First aid stations']
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
            perks: ['All-inclusive food and drinks', 'Climate controlled', 'Premium parking'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering options', 'Private restrooms', 'HDTV']
        },
        specialAreas: [
          { name: 'Rooftop Deck', description: 'Standing room with bar', capacity: 77 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Drink rails', 'Outfield bar'],
      partyAreas: [
        {
          name: 'Beer Garden',
          capacity: '96',
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
      signature: ['Bratwurst', 'Cheese curds', 'Milwaukee beer', 'Frozen custard'],
      local: ['Bratwurst', 'Cheese curds', 'Milwaukee beer', 'Local craft selections'],
      healthy: ['Veggie wraps', 'Fresh salads', 'Gluten-free options'],
      vegetarian: ['Beyond burgers', 'Pizza', 'Cauliflower wings'],
      glutenFree: ['Dedicated GF stand'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['New Glarus', 'Lakefront', 'MKE Brewing', 'Domestic options'],
        wine: false,
        cocktails: true,
        localBreweries: ['New Glarus', 'Lakefront', 'MKE Brewing']
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
        { location: 'Team Store Plaza', exclusive: ['Beloit Sky Carp authentic gear', 'Splash merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['All restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'StadiumWiFi' },
      chargingStations: ['Throughout concourse'],
      kidZones: [
        {
          name: 'Splashs Playground',
          location: 'Left field corner',
          activities: ['Interactive games', 'Speed pitch', 'Face painting']
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
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Splash', description: 'Flying fish appears pregame', category: 'family' },
        { title: 'Try the Bratwurst', description: 'Local favorite', category: 'food' },
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
      name: 'Beloit area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Local breweries', 'Food trucks', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Craft beer bars'],
      radius: 'Short drive'
    },
    transportation: {
      address: '3850 ABC Supply Stadium, Beloit, Wisconsin',
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
        { year: 2021, event: 'Stadium opens' },
        { year: 2022, event: 'Marlins affiliation established' },
        { year: 2026, event: 'First championship' },
        { year: 2031, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Splash race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Splash', description: 'Flying fish' },
      bestExperiences: ['Meeting Splash', 'Fireworks shows', 'Trying Bratwurst', 'Rivalry games'],
      traditions: ['Splash antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Download the app for deals',
        'Best Bratwurst at Section 118',
        'Early bird specials'
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
        'Splash meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Splash at Kids zone',
        'Team logo at entrance',
        'Instagram wall'
      ],
      bestValue: [
        'Group packages',
        'Bleacher seats',
        'Happy hour deals',
        'Season memberships'
      ]
    }
  },
  'cedar-rapids-kernels': {
    id: 'cedar-rapids-kernels',
    name: 'Veterans Memorial Stadium',
    team: 'Cedar Rapids Kernels',
    opened: 1949,
    capacity: 5300,
    overview: {
      description: 'Veterans Memorial Stadium in Cedar Rapids, Iowa, is the home of the Cedar Rapids Kernels, Twins High-A affiliate. This historic venue offers nostalgic baseball with a capacity of 5300 fans. ',
      highlights: [
        'Twins High-A affiliate since 2000',
        'Historic facility',
        'Cedar Rapids landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
        'Home of Mr. Shucks',
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
        indoorAreas: ['Mr. Shucks team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 106 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '132',
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
      signature: ['Pork tenderloin', 'Sweet corn', 'Maid-Rites', "Casey\\'s pizza"],
      local: ['Pork tenderloin', 'Sweet corn', 'Maid-Rites', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
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
        { location: 'Main concourse', exclusive: ['Cedar Rapids Kernels authentic gear', 'Mr. Shucks merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Mr. Shuckss Playground',
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
        { title: 'Meet Mr. Shucks', description: 'Corn cob appears pregame', category: 'family' },
        { title: 'Try the Pork tenderloin', description: 'Local favorite', category: 'food' },
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
      name: 'Cedar Rapids area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5300 Veterans Memorial Stadium, Cedar Rapids, Iowa',
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
        { year: 1949, event: 'Stadium opens' },
        { year: 2000, event: 'Twins affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Mr. Shucks race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Mr. Shucks', description: 'Corn cob' },
      bestExperiences: ['Meeting Mr. Shucks', 'Fireworks shows', 'Trying Pork tenderloin', 'Rivalry games'],
      traditions: ['Mr. Shucks antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Pork tenderloin at Section 119',
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
        'Mr. Shucks meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Mr. Shucks at Kids zone',
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
  'dayton-dragons': {
    id: 'dayton-dragons',
    name: 'Day Air Ballpark',
    team: 'Dayton Dragons',
    opened: 2000,
    capacity: 7230,
    overview: {
      description: 'Day Air Ballpark in Dayton, Ohio, is the home of the Dayton Dragons, Reds High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 7230 fans. ',
      highlights: [
        'Reds High-A affiliate since 2000',
        'Modern facility',
        'Dayton landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Heater and Gem',
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
        indoorAreas: ['Heater and Gem team store', 'Concession stands'],
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
      signature: ['Cincinnati chili', 'Pierogies', 'Stadium mustard', 'Buckeye candy'],
      local: ['Cincinnati chili', 'Pierogies', 'Stadium mustard', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Great Lakes', 'Platform', "Fat Head\\'s", 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Great Lakes', 'Platform', "Fat Head\\'s"]
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
        { location: 'Main concourse', exclusive: ['Dayton Dragons authentic gear', 'Heater and Gem merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Heater and Gems Playground',
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
        { title: 'Meet Heater and Gem', description: 'Dragon duo appears pregame', category: 'family' },
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
      name: 'Dayton area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7230 Day Air Ballpark, Dayton, Ohio',
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
        { name: 'Heater and Gem race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Heater and Gem', description: 'Dragon duo' },
      bestExperiences: ['Meeting Heater and Gem', 'Fireworks shows', 'Trying Cincinnati chili', 'Rivalry games'],
      traditions: ['Heater and Gem antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cincinnati chili at Section 100',
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
        'Heater and Gem meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Heater and Gem at Kids zone',
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
  'fort-wayne-tincaps': {
    id: 'fort-wayne-tincaps',
    name: 'Parkview Field',
    team: 'Fort Wayne TinCaps',
    opened: 2009,
    capacity: 8100,
    overview: {
      description: 'Parkview Field in Fort Wayne, Indiana, is the home of the Fort Wayne TinCaps, Padres High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 8100 fans. ',
      highlights: [
        'Padres High-A affiliate since 2009',
        'Modern facility',
        'Fort Wayne landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Johnny',
        'Classic concessions',
        'Kids zone and playground'
      ],
      renovations: [
        { year: 2019, description: 'LED lighting upgrade' },
        { year: 2024, description: 'Concourse and concessions renovation' },
        { year: 2029, description: 'Video board installation' }
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
        indoorAreas: ['Johnny team store', 'Club lounge'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 162 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '202',
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
      signature: ['Pork tenderloin', 'Sugar cream pie', 'Corn dogs', 'Indianapolis beer'],
      local: ['Pork tenderloin', 'Sugar cream pie', 'Corn dogs', 'Local craft selections'],
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
        { location: 'Main concourse', exclusive: ['Fort Wayne TinCaps authentic gear', 'Johnny merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Johnnys Playground',
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
        { title: 'Meet Johnny', description: 'Apple character appears pregame', category: 'family' },
        { title: 'Try the Pork tenderloin', description: 'Local favorite', category: 'food' },
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
      name: 'Fort Wayne area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '8100 Parkview Field, Fort Wayne, Indiana',
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
        { year: 2009, event: 'Stadium opens' },
        { year: 2010, event: 'Padres affiliation established' },
        { year: 2014, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Johnny race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Johnny', description: 'Apple character' },
      bestExperiences: ['Meeting Johnny', 'Fireworks shows', 'Trying Pork tenderloin', 'Rivalry games'],
      traditions: ['Johnny antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Pork tenderloin at Section 102',
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
        'Johnny meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Johnny at Kids zone',
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
  'great-lakes-loons': {
    id: 'great-lakes-loons',
    name: 'Dow Diamond',
    team: 'Great Lakes Loons',
    opened: 2007,
    capacity: 5500,
    overview: {
      description: 'Dow Diamond in Midland, Michigan, is the home of the Great Lakes Loons, Dodgers High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 5500 fans. ',
      highlights: [
        'Dodgers High-A affiliate since 2007',
        'Modern facility',
        'Midland landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Rall E. Camel',
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
        morning: ['Third base side sections', 'Upper rows'],
        afternoon: ['First base upper deck', 'Behind home plate upper'],
        evening: ['Most seats after 6:30pm']
      },
      coveredSeating: ['Limited coverage', 'Picnic pavilions'],
      shadeTips: [
        'Check weather forecast before choosing seats',
        'Covered concourse provides relief',
        'Afternoon games can be pleasant',
        'Weather can change quickly'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Limited areas'],
        indoorAreas: ['Rall E. Camel team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 110 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '137',
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
      signature: ['Coney dogs', 'Better Made chips', 'Faygo pop', 'Mackinac fudge'],
      local: ['Coney dogs', 'Better Made chips', 'Faygo pop', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Founders', "Bell\\'s", 'Shorts', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['Founders', "Bell\\'s", 'Shorts']
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
        { location: 'Main concourse', exclusive: ['Great Lakes Loons authentic gear', 'Rall E. Camel merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Rall E. Camels Playground',
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
        { title: 'Meet Rall E. Camel', description: 'Camel on skates appears pregame', category: 'family' },
        { title: 'Try the Coney dogs', description: 'Local favorite', category: 'food' },
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
      address: '5500 Dow Diamond, Midland, Michigan',
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
        { year: 2008, event: 'Dodgers affiliation established' },
        { year: 2012, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Rall E. Camel race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rall E. Camel', description: 'Camel on skates' },
      bestExperiences: ['Meeting Rall E. Camel', 'Fireworks shows', 'Trying Coney dogs', 'Rivalry games'],
      traditions: ['Rall E. Camel antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Coney dogs at Section 103',
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
        'Rall E. Camel meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Rall E. Camel at Kids zone',
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
  'lake-county-captains': {
    id: 'lake-county-captains',
    name: 'Classic Park',
    team: 'Lake County Captains',
    opened: 2003,
    capacity: 7273,
    overview: {
      description: 'Classic Park in Eastlake, Ohio, is the home of the Lake County Captains, Guardians High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 7273 fans. ',
      highlights: [
        'Guardians High-A affiliate since 2003',
        'Modern facility',
        'Eastlake landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Skipper',
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
        indoorAreas: ['Skipper team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 145 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '181',
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
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Dippin Dots'],
      alcohol: {
        beer: ['Great Lakes', 'Platform', "Fat Head\\'s", 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Great Lakes', 'Platform', "Fat Head\\'s"]
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
        { location: 'Main concourse', exclusive: ['Lake County Captains authentic gear', 'Skipper merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Skippers Playground',
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
        { title: 'Meet Skipper', description: 'Sea captain appears pregame', category: 'family' },
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
      name: 'Eastlake area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7273 Classic Park, Eastlake, Ohio',
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
        { year: 2003, event: 'Stadium opens' },
        { year: 2004, event: 'Guardians affiliation established' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Skipper race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Skipper', description: 'Sea captain' },
      bestExperiences: ['Meeting Skipper', 'Fireworks shows', 'Trying Cincinnati chili', 'Rivalry games'],
      traditions: ['Skipper antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Cincinnati chili at Section 108',
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
        'Skipper meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Skipper at Kids zone',
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
  'lansing-lugnuts': {
    id: 'lansing-lugnuts',
    name: 'Jackson Field',
    team: 'Lansing Lugnuts',
    opened: 1996,
    capacity: 11000,
    overview: {
      description: 'Jackson Field in Lansing, Michigan, is the home of the Lansing Lugnuts, Athletics High-A affiliate. This updated facility maintains its classic charm with a capacity of 11000 fans. ',
      highlights: [
        'Athletics High-A affiliate since 2000',
        'Renovated Classic facility',
        'Lansing landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Big Lug',
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
        indoorAreas: ['Big Lug team store', 'Club lounge'],
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
            perks: ['Wait service', 'Climate controlled', 'Private entrance'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Two suite levels'],
          amenities: ['Catering options', 'Private restrooms', 'In-suite attendant']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 220 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '275',
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
      signature: ['Coney dogs', 'Better Made chips', 'Faygo pop', 'Mackinac fudge'],
      local: ['Coney dogs', 'Better Made chips', 'Faygo pop', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Founders', "Bell\\'s", 'Shorts', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Founders', "Bell\\'s", 'Shorts']
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
        bestFor: ['All seating', 'General admission'],
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
        { location: 'Main concourse', exclusive: ['Lansing Lugnuts authentic gear', 'Big Lug merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Big Lugs Playground',
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
      parkingSpaces: '50+ spaces'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Big Lug', description: 'Giant nut and bolt appears pregame', category: 'family' },
        { title: 'Try the Coney dogs', description: 'Local favorite', category: 'food' },
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
      name: 'Lansing area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '11000 Jackson Field, Lansing, Michigan',
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
        { year: 1996, event: 'Stadium opens' },
        { year: 2000, event: 'Athletics affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Big Lug race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Big Lug', description: 'Giant nut and bolt' },
      bestExperiences: ['Meeting Big Lug', 'Fireworks shows', 'Trying Coney dogs', 'Rivalry games'],
      traditions: ['Big Lug antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Coney dogs at Section 108',
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
        'Big Lug meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Big Lug at Kids zone',
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
  'peoria-chiefs': {
    id: 'peoria-chiefs',
    name: 'Dozer Park',
    team: 'Peoria Chiefs',
    opened: 2002,
    capacity: 7500,
    overview: {
      description: 'Dozer Park in Peoria, Illinois, is the home of the Peoria Chiefs, Cardinals High-A affiliate. This contemporary ballpark combines modern conveniences with a capacity of 7500 fans. ',
      highlights: [
        'Cardinals High-A affiliate since 2002',
        'Modern facility',
        'Peoria landmark',
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
          { name: 'Party Deck', description: 'Group area', capacity: 150 }
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
      signature: ['Chicago dogs', 'Italian beef', 'Deep dish pizza', 'Garrett popcorn'],
      local: ['Chicago dogs', 'Italian beef', 'Deep dish pizza', 'Local craft selections'],
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
        { location: 'Main concourse', exclusive: ['Peoria Chiefs authentic gear', 'Homer merchandise'] }
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
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Homer', description: 'Chief character appears pregame', category: 'family' },
        { title: 'Try the Chicago dogs', description: 'Local favorite', category: 'food' },
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
      name: 'Peoria area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7500 Dozer Park, Peoria, Illinois',
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
        { year: 2003, event: 'Cardinals affiliation established' },
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
      mascot: { name: 'Homer', description: 'Chief character' },
      bestExperiences: ['Meeting Homer', 'Fireworks shows', 'Trying Chicago dogs', 'Rivalry games'],
      traditions: ['Homer antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Chicago dogs at Section 112',
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
        'Homer meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
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
  'quad-cities-river-bandits': {
    id: 'quad-cities-river-bandits',
    name: 'Modern Woodmen Park',
    team: 'Quad Cities River Bandits',
    opened: 1931,
    capacity: 7140,
    overview: {
      description: 'Modern Woodmen Park in Davenport, Iowa, is the home of the Quad Cities River Bandits, Royals High-A affiliate. This historic venue offers nostalgic baseball with a capacity of 7140 fans. ',
      highlights: [
        'Royals High-A affiliate since 2000',
        'Historic facility',
        'Davenport landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Historic ballpark',
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
          { name: 'Party Deck', description: 'Group area', capacity: 142 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '178',
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
      signature: ['Pork tenderloin', 'Sweet corn', 'Maid-Rites', "Casey\\'s pizza"],
      local: ['Pork tenderloin', 'Sweet corn', 'Maid-Rites', 'Local craft selections'],
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
        { location: 'Main concourse', exclusive: ['Quad Cities River Bandits authentic gear', 'Rascal merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Rascals Playground',
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
        { title: 'Meet Rascal', description: 'Raccoon bandit appears pregame', category: 'family' },
        { title: 'Try the Pork tenderloin', description: 'Local favorite', category: 'food' },
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
      name: 'Davenport area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '7140 Modern Woodmen Park, Davenport, Iowa',
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
        { year: 1931, event: 'Stadium opens' },
        { year: 2000, event: 'Royals affiliation begins' },
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
      mascot: { name: 'Rascal', description: 'Raccoon bandit' },
      bestExperiences: ['Meeting Rascal', 'Fireworks shows', 'Trying Pork tenderloin', 'Rivalry games'],
      traditions: ['Rascal antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Pork tenderloin at Section 113',
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
        'Rascal meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Rascal at Kids zone',
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
  'south-bend-cubs': {
    id: 'south-bend-cubs',
    name: 'Four Winds Field',
    team: 'South Bend Cubs',
    opened: 1987,
    capacity: 5000,
    overview: {
      description: 'Four Winds Field in South Bend, Indiana, is the home of the South Bend Cubs, Cubs High-A affiliate. This historic venue offers nostalgic baseball with a capacity of 5000 fans. ',
      highlights: [
        'Cubs High-A affiliate since 2000',
        'Historic facility',
        'South Bend landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Stu',
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
        indoorAreas: ['Stu team store', 'Concession stands'],
        sunscreenStations: ['Guest services', 'Fan assistance']
      },
      worstSunExposure: ['General admission', 'Field level seats'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 100 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '125',
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
      signature: ['Pork tenderloin', 'Sugar cream pie', 'Corn dogs', 'Indianapolis beer'],
      local: ['Pork tenderloin', 'Sugar cream pie', 'Corn dogs', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beer', 'Domestic options'],
        wine: false,
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
        { location: 'Main concourse', exclusive: ['South Bend Cubs authentic gear', 'Stu merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Stus Playground',
          location: 'Left field corner',
          activities: ['Playground', 'Batting cages', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated areas'],
        entrance: 'Main gate accessible',
        elevators: ['Main entrance']
      },
      assistiveListening: false,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['Main concourse'],
      parkingSpaces: '20+ designated spots'
    },
    gameDay: {
      tips: [
        { title: 'Check out the team store for exclusive merchandise', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Stu', description: 'Bear cub appears pregame', category: 'family' },
        { title: 'Try the Pork tenderloin', description: 'Local favorite', category: 'food' },
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
      name: 'South Bend area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5000 Four Winds Field, South Bend, Indiana',
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
        { year: 2000, event: 'Cubs affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Stu race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Stu', description: 'Bear cub' },
      bestExperiences: ['Meeting Stu', 'Fireworks shows', 'Trying Pork tenderloin', 'Rivalry games'],
      traditions: ['Stu antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Pork tenderloin at Section 115',
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
        'Stu meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Stu at Kids zone',
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
  'west-michigan-whitecaps': {
    id: 'west-michigan-whitecaps',
    name: 'LMCU Ballpark',
    team: 'West Michigan Whitecaps',
    opened: 1994,
    capacity: 9281,
    overview: {
      description: 'LMCU Ballpark in Comstock Park, Michigan, is the home of the West Michigan Whitecaps, Tigers High-A affiliate. This updated facility maintains its classic charm with a capacity of 9281 fans. ',
      highlights: [
        'Tigers High-A affiliate since 2000',
        'Renovated Classic facility',
        'Comstock Park landmark',
        'Great gameday atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Crash',
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
        indoorAreas: ['Crash team store', 'Club lounge'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 185 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Lower level corners'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '232',
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
      signature: ['Coney dogs', 'Better Made chips', 'Faygo pop', 'Mackinac fudge'],
      local: ['Coney dogs', 'Better Made chips', 'Faygo pop', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Founders', "Bell\\'s", 'Shorts', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Founders', "Bell\\'s", 'Shorts']
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
        { location: 'Main concourse', exclusive: ['West Michigan Whitecaps authentic gear', 'Crash merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Club level'],
      babyChanging: ['Family restrooms'],
      atms: ['Multiple locations', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Crashs Playground',
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
        { title: 'Walk around the park before the game', description: 'Insider tip', category: 'arrival' },
        { title: 'Meet Crash', description: 'Lake monster appears pregame', category: 'family' },
        { title: 'Try the Coney dogs', description: 'Local favorite', category: 'food' },
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
      name: 'Comstock Park area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '9281 LMCU Ballpark, Comstock Park, Michigan',
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
        { year: 2000, event: 'Tigers affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Attendance record set' }
      ],
      traditions: [
        { name: 'Crash race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric on weekends',
      mascot: { name: 'Crash', description: 'Lake monster' },
      bestExperiences: ['Meeting Crash', 'Fireworks shows', 'Trying Coney dogs', 'Rivalry games'],
      traditions: ['Crash antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Walk around the park before the game',
        'Join the fan club',
        'Best Coney dogs at Section 119',
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
        'Crash meet and greet location'
      ],
      photoSpots: [
        'Park entrance sign',
        'With Crash at Kids zone',
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
  'wisconsin-timber-rattlers': {
    id: 'wisconsin-timber-rattlers',
    name: 'Neuroscience Group Field',
    team: 'Wisconsin Timber Rattlers',
    opened: 1995,
    capacity: 5500,
    overview: {
      description: 'Neuroscience Group Field in Grand Chute, Wisconsin, is the home of the Wisconsin Timber Rattlers, Brewers High-A affiliate. This updated facility maintains its classic charm with a capacity of 5500 fans. ',
      highlights: [
        'Brewers High-A affiliate since 2000',
        'Renovated Classic facility',
        'Grand Chute landmark',
        'Family-friendly atmosphere',
        'Spacious concourses'
      ],
      uniqueFeatures: [
        'Great sightlines from all seats',
        'Modern amenities',
        'Home of Whiffer and Fang',
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
        indoorAreas: ['Whiffer and Fang team store', 'Concession stands'],
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
          { name: 'Party Deck', description: 'Group area', capacity: 110 }
        ]
      },
      budgetOptions: ['Bleacher seats', 'Standing room', 'Group rates'],
      familySections: ['Family deck', 'Kids zone nearby'],
      standingRoom: ['Concourse', 'First base line'],
      partyAreas: [
        {
          name: 'Picnic Pavilion',
          capacity: '137',
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
      signature: ['Bratwurst', 'Cheese curds', 'Milwaukee beer', 'Frozen custard'],
      local: ['Bratwurst', 'Cheese curds', 'Milwaukee beer', 'Local craft selections'],
      healthy: ['Grilled chicken', 'Fresh salads', 'Fruit cups'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Nachos'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['New Glarus', 'Lakefront', 'MKE Brewing', 'Domestic options'],
        wine: false,
        cocktails: false,
        localBreweries: ['New Glarus', 'Lakefront', 'MKE Brewing']
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
        { location: 'Main concourse', exclusive: ['Wisconsin Timber Rattlers authentic gear', 'Whiffer and Fang merchandise'] }
      ],
      firstAid: ['Behind home plate', 'Guest services'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: '' },
      chargingStations: ['Club level'],
      kidZones: [
        {
          name: 'Whiffer and Fangs Playground',
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
        { title: 'Meet Whiffer and Fang', description: 'Rattlesnake duo appears pregame', category: 'family' },
        { title: 'Try the Bratwurst', description: 'Local favorite', category: 'food' },
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
      name: 'Grand Chute area',
      description: 'Suburban location with nearby amenities',
      beforeGame: ['Sports bars', 'Restaurants', 'Nearby parks'],
      afterGame: ['Family restaurants', 'Local favorites'],
      radius: 'Short drive'
    },
    transportation: {
      address: '5500 Neuroscience Group Field, Grand Chute, Wisconsin',
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
        { year: 2000, event: 'Brewers affiliation begins' },
        { year: 2010, event: 'First championship' },
        { year: 2020, event: 'Fan experience upgrades' }
      ],
      traditions: [
        { name: 'Whiffer and Fang race', description: 'Between innings entertainment' },
        { name: 'Fireworks Fridays', description: 'Summer tradition' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Whiffer and Fang', description: 'Rattlesnake duo' },
      bestExperiences: ['Meeting Whiffer and Fang', 'Fireworks shows', 'Trying Bratwurst', 'Rivalry games'],
      traditions: ['Whiffer and Fang antics', 'Rally traditions', 'Thursday specials']
    },
    proTips: {
      insiderTips: [
        'Check out the team store for exclusive merchandise',
        'Join the fan club',
        'Best Bratwurst at Section 119',
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
        'Whiffer and Fang meet and greet location'
      ],
      photoSpots: [
        'Stadium entrance plaza',
        'With Whiffer and Fang at Kids zone',
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
  }
};