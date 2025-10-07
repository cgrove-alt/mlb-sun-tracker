import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides: Record<string, StadiumGuide> = {
  'aberdeen-ironbirds': {
    id: 'aberdeen-ironbirds',
    name: 'Leidos Field at Ripken Stadium',
    team: 'Aberdeen IronBirds',
    opened: 2002,
    capacity: 6300,
    overview: {
      description: 'Leidos Field at Ripken Stadium in Aberdeen, Maryland, home of the Aberdeen IronBirds, serves as the Orioles High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6,300.',
      highlights: [
        'Orioles High-A affiliate',
        'Modern facility built in 2002',
        'Family-friendly atmosphere',
        'Aberdeen community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6300 seat capacity',
        'Group party areas',
        'Scenic Maryland setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 315 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Aberdeen favorites', 'Regional craft beers', 'Maryland BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Aberdeen IronBirds gear', 'Orioles items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Aberdeen specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Aberdeen area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6300 Stadium Way, Aberdeen, Maryland',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2002, event: 'Stadium opens' },
        { year: 2004, event: 'Orioles affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'IronBirds Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Maimonides Park in Brooklyn, New York, home of the Brooklyn Cyclones, serves as the Mets High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7,500.',
      highlights: [
        'Mets High-A affiliate',
        'Modern facility built in 2001',
        'Family-friendly atmosphere',
        'Brooklyn community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7500',
        'Group party areas',
        'Scenic New York setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 60, rainChance: 35, typicalConditions: 'Cool spring', shadeTip: 'Bring layers' },
        { month: 'May', avgTemp: 63, avgHumidity: 62, rainChance: 35, typicalConditions: 'Mild weather', shadeTip: 'Pleasant conditions' },
        { month: 'June', avgTemp: 72, avgHumidity: 65, rainChance: 30, typicalConditions: 'Comfortable', shadeTip: 'Ideal baseball weather' },
        { month: 'July', avgTemp: 77, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warm summer', shadeTip: 'Shade for afternoon games' },
        { month: 'August', avgTemp: 76, avgHumidity: 70, rainChance: 30, typicalConditions: 'Late summer', shadeTip: 'Evening games comfortable' },
        { month: 'September', avgTemp: 68, avgHumidity: 65, rainChance: 30, typicalConditions: 'Early fall', shadeTip: 'Perfect weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 375 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Brooklyn favorites', 'Regional craft beers', 'New York BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Brooklyn Cyclones gear', 'Mets items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Brooklyn specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Brooklyn area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7500 Stadium Way, Brooklyn, New York',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2001, event: 'Stadium opens' },
        { year: 2003, event: 'Mets affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Cyclones Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Dutchess Stadium in Wappingers Falls, New York, home of the Hudson Valley Renegades, serves as the Yankees High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 4,494.',
      highlights: [
        'Yankees High-A affiliate',
        'Historic venue since 1994',
        'Family-friendly atmosphere',
        'Wappingers Falls community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4494 seat capacity',
        'Group party areas',
        'Scenic New York setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 60, rainChance: 35, typicalConditions: 'Cool spring', shadeTip: 'Bring layers' },
        { month: 'May', avgTemp: 63, avgHumidity: 62, rainChance: 35, typicalConditions: 'Mild weather', shadeTip: 'Pleasant conditions' },
        { month: 'June', avgTemp: 72, avgHumidity: 65, rainChance: 30, typicalConditions: 'Comfortable', shadeTip: 'Ideal baseball weather' },
        { month: 'July', avgTemp: 77, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warm summer', shadeTip: 'Shade for afternoon games' },
        { month: 'August', avgTemp: 76, avgHumidity: 70, rainChance: 30, typicalConditions: 'Late summer', shadeTip: 'Evening games comfortable' },
        { month: 'September', avgTemp: 68, avgHumidity: 65, rainChance: 30, typicalConditions: 'Early fall', shadeTip: 'Perfect weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 224 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Wappingers Falls favorites', 'Regional craft beers', 'New York BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Hudson Valley Renegades gear', 'Yankees items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Wappingers Falls specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Wappingers Falls area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4494 Stadium Way, Wappingers Falls, New York',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1994, event: 'Stadium opens' },
        { year: 1996, event: 'Yankees affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Renegades Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'ShoreTown Ballpark in Lakewood, New Jersey, home of the Jersey Shore BlueClaws, serves as the Phillies High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6,588.',
      highlights: [
        'Phillies High-A affiliate',
        'Modern facility built in 2001',
        'Family-friendly atmosphere',
        'Lakewood community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6588 seat capacity',
        'Group party areas',
        'Scenic New Jersey setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 329 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Lakewood favorites', 'Regional craft beers', 'New Jersey BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Jersey Shore BlueClaws gear', 'Phillies items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Lakewood specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Lakewood area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6588 Stadium Way, Lakewood, New Jersey',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2001, event: 'Stadium opens' },
        { year: 2003, event: 'Phillies affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'BlueClaws Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Frawley Stadium in Wilmington, Delaware, home of the Wilmington Blue Rocks, serves as the Nationals High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6,532.',
      highlights: [
        'Nationals High-A affiliate',
        'Historic venue since 1993',
        'Family-friendly atmosphere',
        'Wilmington community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6532 seat capacity',
        'Group party areas',
        'Scenic Delaware setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 326 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Wilmington favorites', 'Regional craft beers', 'Delaware BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Wilmington Blue Rocks gear', 'Nationals items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Wilmington specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Wilmington area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6532 Stadium Way, Wilmington, Delaware',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1993, event: 'Stadium opens' },
        { year: 1995, event: 'Nationals affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rocks Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'McCormick Field in Asheville, North Carolina, home of the Asheville Tourists, serves as the Astros High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 4,000.',
      highlights: [
        'Astros High-A affiliate',
        'Historic venue since 1924',
        'Family-friendly atmosphere',
        'Asheville community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4000 seat capacity',
        'Group party areas',
        'Scenic North Carolina setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Asheville favorites', 'Regional craft beers', 'North Carolina BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Asheville Tourists gear', 'Astros items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Asheville specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Asheville area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4000 Stadium Way, Asheville, North Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1924, event: 'Stadium opens' },
        { year: 1926, event: 'Astros affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Tourists Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Bowling Green Ballpark in Bowling Green, Kentucky, home of the Bowling Green Hot Rods, serves as the Rays High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 4,559.',
      highlights: [
        'Rays High-A affiliate',
        'Modern facility built in 2009',
        'Family-friendly atmosphere',
        'Bowling Green community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4559 seat capacity',
        'Group party areas',
        'Scenic Kentucky setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2024, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 227 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Bowling Green favorites', 'Regional craft beers', 'Kentucky BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Bowling Green Hot Rods gear', 'Rays items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Bowling Green specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Bowling Green area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4559 Stadium Way, Bowling Green, Kentucky',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2009, event: 'Stadium opens' },
        { year: 2011, event: 'Rays affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rods Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'First National Bank Field in Greensboro, North Carolina, home of the Greensboro Grasshoppers, serves as the Pirates High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7,499.',
      highlights: [
        'Pirates High-A affiliate',
        'Modern facility built in 2005',
        'Family-friendly atmosphere',
        'Greensboro community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7499',
        'Group party areas',
        'Scenic North Carolina setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 374 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Greensboro favorites', 'Regional craft beers', 'North Carolina BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Greensboro Grasshoppers gear', 'Pirates items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Greensboro specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Greensboro area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7499 Stadium Way, Greensboro, North Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2005, event: 'Stadium opens' },
        { year: 2007, event: 'Pirates affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Grasshoppers Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Fluor Field in Greenville, South Carolina, home of the Greenville Drive, serves as the Red Sox High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6,700.',
      highlights: [
        'Red Sox High-A affiliate',
        'Modern facility built in 2006',
        'Family-friendly atmosphere',
        'Greenville community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6700 seat capacity',
        'Group party areas',
        'Scenic South Carolina setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 335 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Greenville favorites', 'Regional craft beers', 'South Carolina BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Greenville Drive gear', 'Red Sox items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Greenville specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Greenville area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6700 Stadium Way, Greenville, South Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2006, event: 'Stadium opens' },
        { year: 2008, event: 'Red Sox affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Drive Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'L.P. Frans Stadium in Hickory, North Carolina, home of the Hickory Crawdads, serves as the Rangers High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5,062.',
      highlights: [
        'Rangers High-A affiliate',
        'Historic venue since 1993',
        'Family-friendly atmosphere',
        'Hickory community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5062 seat capacity',
        'Group party areas',
        'Scenic North Carolina setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 253 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Hickory favorites', 'Regional craft beers', 'North Carolina BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Hickory Crawdads gear', 'Rangers items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Hickory specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Hickory area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5062 Stadium Way, Hickory, North Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1993, event: 'Stadium opens' },
        { year: 1995, event: 'Rangers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Crawdads Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'State Mutual Stadium in Rome, Georgia, home of the Rome Braves, serves as the Braves High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5,105.',
      highlights: [
        'Braves High-A affiliate',
        'Modern facility built in 2003',
        'Family-friendly atmosphere',
        'Rome community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5105 seat capacity',
        'Group party areas',
        'Scenic Georgia setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 255 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Rome favorites', 'Regional craft beers', 'Georgia BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Rome Braves gear', 'Braves items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Rome specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Rome area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5105 Stadium Way, Rome, Georgia',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2003, event: 'Stadium opens' },
        { year: 2005, event: 'Braves affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Braves Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Truist Stadium in Winston-Salem, North Carolina, home of the Winston-Salem Dash, serves as the White Sox High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 5,500.',
      highlights: [
        'White Sox High-A affiliate',
        'Modern facility built in 2010',
        'Family-friendly atmosphere',
        'Winston-Salem community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5500 seat capacity',
        'Group party areas',
        'Scenic North Carolina setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2025, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 275 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Winston-Salem favorites', 'Regional craft beers', 'North Carolina BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$7', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Winston-Salem Dash gear', 'White Sox items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Winston-Salem specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Winston-Salem area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5500 Stadium Way, Winston-Salem, North Carolina',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2010, event: 'Stadium opens' },
        { year: 2012, event: 'White Sox affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Dash Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'PK Park in Eugene, Oregon, home of the Eugene Emeralds, serves as the Giants High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 4,000.',
      highlights: [
        'Giants High-A affiliate',
        'Modern facility built in 2009',
        'Family-friendly atmosphere',
        'Eugene community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4000 seat capacity',
        'Group party areas',
        'Scenic Oregon setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2024, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Eugene favorites', 'Regional craft beers', 'Oregon BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Eugene Emeralds gear', 'Giants items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Eugene specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Eugene area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4000 Stadium Way, Eugene, Oregon',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2009, event: 'Stadium opens' },
        { year: 2011, event: 'Giants affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Emeralds Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Funko Field in Everett, Washington, home of the Everett AquaSox, serves as the Mariners High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 3,682.',
      highlights: [
        'Mariners High-A affiliate',
        'Historic venue since 1984',
        'Family-friendly atmosphere',
        'Everett community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 3682 seat capacity',
        'Group party areas',
        'Scenic Washington setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 184 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Everett favorites', 'Regional craft beers', 'Washington BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Everett AquaSox gear', 'Mariners items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Everett specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Everett area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '3682 Stadium Way, Everett, Washington',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1984, event: 'Stadium opens' },
        { year: 1986, event: 'Mariners affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'AquaSox Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Ron Tonkin Field in Hillsboro, Oregon, home of the Hillsboro Hops, serves as the Diamondbacks High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 4,500.',
      highlights: [
        'Diamondbacks High-A affiliate',
        'Modern facility built in 2013',
        'Family-friendly atmosphere',
        'Hillsboro community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4500 seat capacity',
        'Group party areas',
        'Scenic Oregon setting'
      ],
      renovations: [
        { year: 2018, description: 'Seating improvements' },
        { year: 2023, description: 'Concourse renovations' },
        { year: 2028, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 225 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Hillsboro favorites', 'Regional craft beers', 'Oregon BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$7', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Hillsboro Hops gear', 'Diamondbacks items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Hillsboro specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Hillsboro area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4500 Stadium Way, Hillsboro, Oregon',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2013, event: 'Stadium opens' },
        { year: 2015, event: 'Diamondbacks affiliation begins' },
        { year: 2023, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Hops Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Avista Stadium in Spokane, Washington, home of the Spokane Indians, serves as the Rockies High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6,803.',
      highlights: [
        'Rockies High-A affiliate',
        'Historic venue since 1958',
        'Family-friendly atmosphere',
        'Spokane community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6803 seat capacity',
        'Group party areas',
        'Scenic Washington setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 340 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Spokane favorites', 'Regional craft beers', 'Washington BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Spokane Indians gear', 'Rockies items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Spokane specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Spokane area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6803 Stadium Way, Spokane, Washington',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1958, event: 'Stadium opens' },
        { year: 1960, event: 'Rockies affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Indians Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Gesa Stadium in Pasco, Washington, home of the Tri-City Dust Devils, serves as the Angels High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 3,654.',
      highlights: [
        'Angels High-A affiliate',
        'Historic venue since 1995',
        'Family-friendly atmosphere',
        'Pasco community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 3654 seat capacity',
        'Group party areas',
        'Scenic Washington setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 182 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Pasco favorites', 'Regional craft beers', 'Washington BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Tri-City Dust Devils gear', 'Angels items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Pasco specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Pasco area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '3654 Stadium Way, Pasco, Washington',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1995, event: 'Stadium opens' },
        { year: 1997, event: 'Angels affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Devils Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Nat Bailey Stadium in Vancouver, British Columbia, home of the Vancouver Canadians, serves as the Blue Jays High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6,500.',
      highlights: [
        'Blue Jays High-A affiliate',
        'Historic venue since 1951',
        'Family-friendly atmosphere',
        'Vancouver community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6500 seat capacity',
        'Group party areas',
        'Scenic British Columbia setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 325 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Vancouver favorites', 'Regional craft beers', 'British Columbia BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Vancouver Canadians gear', 'Blue Jays items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Vancouver specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Vancouver area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6500 Stadium Way, Vancouver, British Columbia',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1951, event: 'Stadium opens' },
        { year: 1953, event: 'Blue Jays affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Canadians Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'ABC Supply Stadium in Beloit, Wisconsin, home of the Beloit Sky Carp, serves as the Marlins High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 3,850.',
      highlights: [
        'Marlins High-A affiliate',
        'Modern facility built in 2021',
        'Family-friendly atmosphere',
        'Beloit community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Brand new stadium',
        'Local food specialties',
        'Intimate 3850 seat capacity',
        'Group party areas',
        'Scenic Wisconsin setting'
      ],
      renovations: [
        { year: 2026, description: 'Seating improvements' },
        { year: 2031, description: 'Concourse renovations' },
        { year: 2036, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 192 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Beloit favorites', 'Regional craft beers', 'Wisconsin BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$7', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Beloit Sky Carp gear', 'Marlins items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Beloit specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    neighborhood: {
      name: 'Beloit area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '3850 Stadium Way, Beloit, Wisconsin',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2021, event: 'Stadium opens' },
        { year: 2023, event: 'Marlins affiliation begins' },
        { year: 2031, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Carp Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Veterans Memorial Stadium in Cedar Rapids, Iowa, home of the Cedar Rapids Kernels, serves as the Twins High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5,300.',
      highlights: [
        'Twins High-A affiliate',
        'Historic venue since 1949',
        'Family-friendly atmosphere',
        'Cedar Rapids community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5300 seat capacity',
        'Group party areas',
        'Scenic Iowa setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 265 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Cedar Rapids favorites', 'Regional craft beers', 'Iowa BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Cedar Rapids Kernels gear', 'Twins items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Cedar Rapids specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Cedar Rapids area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5300 Stadium Way, Cedar Rapids, Iowa',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1949, event: 'Stadium opens' },
        { year: 1951, event: 'Twins affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Kernels Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Day Air Ballpark in Dayton, Ohio, home of the Dayton Dragons, serves as the Reds High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7,230.',
      highlights: [
        'Reds High-A affiliate',
        'Modern facility built in 2000',
        'Family-friendly atmosphere',
        'Dayton community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7230',
        'Group party areas',
        'Scenic Ohio setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 361 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Dayton favorites', 'Regional craft beers', 'Ohio BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Dayton Dragons gear', 'Reds items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Dayton specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Dayton area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7230 Stadium Way, Dayton, Ohio',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2000, event: 'Stadium opens' },
        { year: 2002, event: 'Reds affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Dragons Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Parkview Field in Fort Wayne, Indiana, home of the Fort Wayne TinCaps, serves as the Padres High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 8,100.',
      highlights: [
        'Padres High-A affiliate',
        'Modern facility built in 2009',
        'Family-friendly atmosphere',
        'Fort Wayne community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 8100',
        'Group party areas',
        'Scenic Indiana setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2024, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 405 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Fort Wayne favorites', 'Regional craft beers', 'Indiana BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Fort Wayne TinCaps gear', 'Padres items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Fort Wayne specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Fort Wayne area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '8100 Stadium Way, Fort Wayne, Indiana',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2009, event: 'Stadium opens' },
        { year: 2011, event: 'Padres affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'TinCaps Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Dow Diamond in Midland, Michigan, home of the Great Lakes Loons, serves as the Dodgers High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5,500.',
      highlights: [
        'Dodgers High-A affiliate',
        'Modern facility built in 2007',
        'Family-friendly atmosphere',
        'Midland community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5500 seat capacity',
        'Group party areas',
        'Scenic Michigan setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 275 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Midland favorites', 'Regional craft beers', 'Michigan BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Great Lakes Loons gear', 'Dodgers items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Midland specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Midland area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5500 Stadium Way, Midland, Michigan',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2007, event: 'Stadium opens' },
        { year: 2009, event: 'Dodgers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Loons Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Classic Park in Eastlake, Ohio, home of the Lake County Captains, serves as the Guardians High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7,273.',
      highlights: [
        'Guardians High-A affiliate',
        'Modern facility built in 2003',
        'Family-friendly atmosphere',
        'Eastlake community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7273',
        'Group party areas',
        'Scenic Ohio setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 363 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Eastlake favorites', 'Regional craft beers', 'Ohio BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Lake County Captains gear', 'Guardians items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Eastlake specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Eastlake area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7273 Stadium Way, Eastlake, Ohio',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2003, event: 'Stadium opens' },
        { year: 2005, event: 'Guardians affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Captains Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Jackson Field in Lansing, Michigan, home of the Lansing Lugnuts, serves as the Athletics High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 11,000.',
      highlights: [
        'Athletics High-A affiliate',
        'Historic venue since 1996',
        'Family-friendly atmosphere',
        'Lansing community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 11000',
        'Group party areas',
        'Scenic Michigan setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 550 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Lansing favorites', 'Regional craft beers', 'Michigan BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Lansing Lugnuts gear', 'Athletics items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Lansing specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Lansing area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '11000 Stadium Way, Lansing, Michigan',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1996, event: 'Stadium opens' },
        { year: 1998, event: 'Athletics affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Lugnuts Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Dozer Park in Peoria, Illinois, home of the Peoria Chiefs, serves as the Cardinals High-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7,500.',
      highlights: [
        'Cardinals High-A affiliate',
        'Modern facility built in 2002',
        'Family-friendly atmosphere',
        'Peoria community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7500',
        'Group party areas',
        'Scenic Illinois setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Group area', capacity: 375 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Peoria favorites', 'Regional craft beers', 'Illinois BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'Limited availability',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Peoria Chiefs gear', 'Cardinals items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Peoria specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Peoria area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7500 Stadium Way, Peoria, Illinois',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2002, event: 'Stadium opens' },
        { year: 2004, event: 'Cardinals affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Chiefs Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Modern Woodmen Park in Davenport, Iowa, home of the Quad Cities River Bandits, serves as the Royals High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7,140.',
      highlights: [
        'Royals High-A affiliate',
        'Historic venue since 1931',
        'Family-friendly atmosphere',
        'Davenport community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7140',
        'Group party areas',
        'Scenic Iowa setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 357 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Davenport favorites', 'Regional craft beers', 'Iowa BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Quad Cities River Bandits gear', 'Royals items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Davenport specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Davenport area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7140 Stadium Way, Davenport, Iowa',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1931, event: 'Stadium opens' },
        { year: 1933, event: 'Royals affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Bandits Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Four Winds Field in South Bend, Indiana, home of the South Bend Cubs, serves as the Cubs High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5,000.',
      highlights: [
        'Cubs High-A affiliate',
        'Historic venue since 1987',
        'Family-friendly atmosphere',
        'South Bend community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5000 seat capacity',
        'Group party areas',
        'Scenic Indiana setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 250 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['South Bend favorites', 'Regional craft beers', 'Indiana BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['South Bend Cubs gear', 'Cubs items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample South Bend specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'South Bend area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5000 Stadium Way, South Bend, Indiana',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1987, event: 'Stadium opens' },
        { year: 1989, event: 'Cubs affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Cubs Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'LMCU Ballpark in Comstock Park, Michigan, home of the West Michigan Whitecaps, serves as the Tigers High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 9,281.',
      highlights: [
        'Tigers High-A affiliate',
        'Historic venue since 1994',
        'Family-friendly atmosphere',
        'Comstock Park community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 9281',
        'Group party areas',
        'Scenic Michigan setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Indoor club areas available'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Champions Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 464 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Comstock Park favorites', 'Regional craft beers', 'Michigan BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['West Michigan Whitecaps gear', 'Tigers items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Comstock Park specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Comstock Park area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '9281 Stadium Way, Comstock Park, Michigan',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1994, event: 'Stadium opens' },
        { year: 1996, event: 'Tigers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Whitecaps Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
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
      description: 'Neuroscience Group Field in Grand Chute, Wisconsin, home of the Wisconsin Timber Rattlers, serves as the Brewers High-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5,500.',
      highlights: [
        'Brewers High-A affiliate',
        'Historic venue since 1995',
        'Family-friendly atmosphere',
        'Grand Chute community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5500 seat capacity',
        'Group party areas',
        'Scenic Wisconsin setting'
      ],
      renovations: [
        { year: 2015, description: 'Seating improvements' },
        { year: 2020, description: 'Concourse renovations' },
        { year: 2023, description: 'Video board upgrade' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Sections under overhang'],
        afternoon: ['First base side upper deck', 'Club level'],
        evening: ['Most sections after sunset']
      },
      coveredSeating: ['Club level', 'Upper deck overhang', 'Premium boxes'],
      shadeTips: [
        'Third base side recommended for day games',
        'Upper deck provides coverage',
        'Evening games most comfortable',
        'Limited covered seating'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper level walkways'],
        indoorAreas: ['Team store', 'Club lounges'],
        sunscreenStations: ['Guest services', 'First aid stations']
      },
      worstSunExposure: ['First base side lower deck', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 62, rainChance: 35, typicalConditions: 'Spring weather', shadeTip: 'Variable conditions' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Comfortable evenings' },
        { month: 'June', avgTemp: 77, avgHumidity: 68, rainChance: 35, typicalConditions: 'Summer begins', shadeTip: 'Shade helpful' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Seek covered areas' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 35, typicalConditions: 'Late summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'Pleasant baseball weather' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Home Plate Club',
            perks: ['Padded seats', 'Wait service', 'Climate control'],
            access: 'Behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Catering', 'Private restrooms', 'HVAC']
        },
        specialAreas: [
          { name: 'Picnic Area', description: 'Group area', capacity: 275 }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Sections 201-205', 'Family zone'],
      standingRoom: ['Concourse', 'Outfield areas'],
      partyAreas: [
        {
          name: 'Group Pavilion',
          capacity: '150',
          description: 'All-inclusive group area',
          amenities: ['Buffet', 'Private bar', 'Covered seating']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of the action', category: 'view' },
        { section: 'Third base side', tip: 'Better shade for day games', category: 'shade' },
        { section: 'Outfield', tip: 'Budget-friendly options', category: 'value' },
        { section: 'Club level', tip: 'Premium amenities', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Stadium hot dogs', 'Local specialty', 'Signature nachos'],
      local: ['Grand Chute favorites', 'Regional craft beers', 'Wisconsin BBQ'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Domestic beers', 'Local craft selection'],
        wine: true,
        cocktails: false,
        localBreweries: ['Regional breweries featured']
      }
    },
    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '0.25 miles', price: '$3', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered parking',
        tip: 'Arrive early for best parking'
      },
      alternativeTransport: {
        publicTransit: ['Local bus service'],
        rideShare: 'Uber/Lyft pickup zone',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      {
        name: 'Main Gate',
        location: 'Home plate entrance',
        bestFor: ['All seating areas'],
        openTime: '1 hour before first pitch'
      },
      {
        name: 'Side Gate',
        location: 'First base side',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Wisconsin Timber Rattlers gear', 'Brewers items'] }
      ],
      firstAid: ['Behind home plate', 'Third base concourse'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: false, network: 'Stadium_WiFi' },
      chargingStations: ['Club level', 'Main concourse'],
      kidZones: [
        {
          name: 'Fun Zone',
          location: 'Left field',
          activities: ['Playground', 'Games', 'Face painting']
        }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Available at main entrance']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Every level'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA parking'
    },
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Recommended for afternoon games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Grand Chute specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '6:35 PM weekdays',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Grand Chute area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5500 Stadium Way, Grand Chute, Wisconsin',
      publicTransit: {
        bus: [
          { routes: ['Local routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['Interstate access', 'State highways'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From downtown via main roads'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: 'Common after games',
        alternativeTip: 'Walk to nearby streets for better rates'
      }
    },
    history: {
      timeline: [
        { year: 1995, event: 'Stadium opens' },
        { year: 1997, event: 'Brewers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rattlers Mascot', description: 'Beloved team mascot' },
      bestExperiences: ['Mascot race', 'Between-inning games', 'Fireworks nights'],
      traditions: ['Rally chants', 'Theme nights', 'Seventh-inning stretch']
    },
    proTips: {
      insiderTips: [
        'Buy tickets in advance for weekend games',
        'Arrive early to explore the stadium',
        'Park in overflow lot for easier exit'
      ],
      avoidThese: [
        'Weekend parking rush',
        'Long concession lines at peak times',
        'Leaving immediately after game ends'
      ],
      hiddenGems: [
        'Secret menu items at concessions',
        'Best photo spot behind section 110',
        'Free parking on nearby streets'
      ],
      photoSpots: [
        'Main entrance sign',
        'View from upper deck',
        'With team mascot'
      ],
      bestValue: [
        'General admission tickets',
        'Group packages',
        'Season ticket deals'
      ]
    }
  }
};