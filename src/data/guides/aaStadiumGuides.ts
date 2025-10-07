import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides: Record<string, StadiumGuide> = {
  'akron-rubberducks': {
    id: 'akron-rubberducks',
    name: 'Canal Park',
    team: 'Akron RubberDucks',
    opened: 1997,
    capacity: 7630,
    overview: {
      description: 'Canal Park in Akron, Ohio, home of the Akron RubberDucks, serves as the Guardians AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7630.',
      highlights: [
        'Guardians AA affiliate',
        'Historic venue since 1997',
        'Family-friendly atmosphere',
        'Akron community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7630',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 381 }
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
      local: ['Akron favorites', 'Regional craft beers', 'Ohio BBQ'],
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
        { location: 'Main concourse', exclusive: ['Akron RubberDucks gear', 'Guardians items'] }
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
        { title: 'Try local food', description: 'Sample Akron specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Akron area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7630 Stadium Way, Akron, Ohio',
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
        { year: 1997, event: 'Stadium opens' },
        { year: 1999, event: 'Guardians affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'RubberDucks Mascot', description: 'Beloved team mascot' },
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
  'richmond-flying-squirrels': {
    id: 'richmond-flying-squirrels',
    name: 'The Diamond',
    team: 'Richmond Flying Squirrels',
    opened: 1985,
    capacity: 9560,
    overview: {
      description: 'The Diamond in Richmond, Virginia, home of the Richmond Flying Squirrels, serves as the Giants AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 9560.',
      highlights: [
        'Giants AA affiliate',
        'Historic venue since 1985',
        'Family-friendly atmosphere',
        'Richmond community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 9560',
        'Group party areas',
        'Scenic Virginia setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 478 }
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
      local: ['Richmond favorites', 'Regional craft beers', 'Virginia BBQ'],
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
        { location: 'Main concourse', exclusive: ['Richmond Flying Squirrels gear', 'Giants items'] }
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
        { title: 'Try local food', description: 'Sample Richmond specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Richmond area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '9560 Stadium Way, Richmond, Virginia',
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
        { year: 1985, event: 'Stadium opens' },
        { year: 1987, event: 'Giants affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Squirrels Mascot', description: 'Beloved team mascot' },
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
  'harrisburg-senators': {
    id: 'harrisburg-senators',
    name: 'FNB Field',
    team: 'Harrisburg Senators',
    opened: 1987,
    capacity: 6187,
    overview: {
      description: 'FNB Field in Harrisburg, Pennsylvania, home of the Harrisburg Senators, serves as the Nationals AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6187.',
      highlights: [
        'Nationals AA affiliate',
        'Historic venue since 1987',
        'Family-friendly atmosphere',
        'Harrisburg community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6187 seat capacity',
        'Group party areas',
        'Scenic Pennsylvania setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 309 }
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
      local: ['Harrisburg favorites', 'Regional craft beers', 'Pennsylvania BBQ'],
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
        { location: 'Main concourse', exclusive: ['Harrisburg Senators gear', 'Nationals items'] }
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
        { title: 'Try local food', description: 'Sample Harrisburg specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Harrisburg area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6187 Stadium Way, Harrisburg, Pennsylvania',
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
        { year: 1989, event: 'Nationals affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Senators Mascot', description: 'Beloved team mascot' },
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
  'bowie-baysox': {
    id: 'bowie-baysox',
    name: 'Prince George\'s Stadium',
    team: 'Bowie Baysox',
    opened: 2000,
    capacity: 10000,
    overview: {
      description: 'Prince George\'s Stadium in Bowie, Maryland, home of the Bowie Baysox, serves as the Orioles AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 10000.',
      highlights: [
        'Orioles AA affiliate',
        'Modern facility built in 2000',
        'Family-friendly atmosphere',
        'Bowie community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 10000',
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
          { name: 'Party Deck', description: 'Group area', capacity: 500 }
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
      local: ['Bowie favorites', 'Regional craft beers', 'Maryland BBQ'],
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
        { location: 'Main concourse', exclusive: ['Bowie Baysox gear', 'Orioles items'] }
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
        { title: 'Try local food', description: 'Sample Bowie specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Bowie area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '10000 Stadium Way, Bowie, Maryland',
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
        { year: 2002, event: 'Orioles affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Baysox Mascot', description: 'Beloved team mascot' },
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
  'portland-sea-dogs': {
    id: 'portland-sea-dogs',
    name: 'Hadlock Field',
    team: 'Portland Sea Dogs',
    opened: 1994,
    capacity: 7368,
    overview: {
      description: 'Hadlock Field in Portland, Maine, home of the Portland Sea Dogs, serves as the Red Sox AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7368.',
      highlights: [
        'Red Sox AA affiliate',
        'Historic venue since 1994',
        'Family-friendly atmosphere',
        'Portland community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7368',
        'Group party areas',
        'Scenic Maine setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 368 }
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
      local: ['Portland favorites', 'Regional craft beers', 'Maine BBQ'],
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
        { location: 'Main concourse', exclusive: ['Portland Sea Dogs gear', 'Red Sox items'] }
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
        { title: 'Try local food', description: 'Sample Portland specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Portland area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7368 Stadium Way, Portland, Maine',
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
        { year: 1996, event: 'Red Sox affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Dogs Mascot', description: 'Beloved team mascot' },
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
  'somerset-patriots': {
    id: 'somerset-patriots',
    name: 'TD Bank Ballpark',
    team: 'Somerset Patriots',
    opened: 1999,
    capacity: 6100,
    overview: {
      description: 'TD Bank Ballpark in Bridgewater, New Jersey, home of the Somerset Patriots, serves as the Yankees AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6100.',
      highlights: [
        'Yankees AA affiliate',
        'Historic venue since 1999',
        'Family-friendly atmosphere',
        'Bridgewater community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6100 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 305 }
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
      local: ['Bridgewater favorites', 'Regional craft beers', 'New Jersey BBQ'],
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
        { location: 'Main concourse', exclusive: ['Somerset Patriots gear', 'Yankees items'] }
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
        { title: 'Try local food', description: 'Sample Bridgewater specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Bridgewater area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6100 Stadium Way, Bridgewater, New Jersey',
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
        { year: 1999, event: 'Stadium opens' },
        { year: 2001, event: 'Yankees affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Patriots Mascot', description: 'Beloved team mascot' },
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
  'new-hampshire-fisher-cats': {
    id: 'new-hampshire-fisher-cats',
    name: 'Delta Dental Stadium',
    team: 'New Hampshire Fisher Cats',
    opened: 2005,
    capacity: 6500,
    overview: {
      description: 'Delta Dental Stadium in Manchester, New Hampshire, home of the New Hampshire Fisher Cats, serves as the Blue Jays AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6500.',
      highlights: [
        'Blue Jays AA affiliate',
        'Modern facility built in 2005',
        'Family-friendly atmosphere',
        'Manchester community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6500 seat capacity',
        'Group party areas',
        'Scenic New Hampshire setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 325 }
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
      local: ['Manchester favorites', 'Regional craft beers', 'New Hampshire BBQ'],
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
        { location: 'Main concourse', exclusive: ['New Hampshire Fisher Cats gear', 'Blue Jays items'] }
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
        { title: 'Try local food', description: 'Sample Manchester specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Manchester area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6500 Stadium Way, Manchester, New Hampshire',
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
        { year: 2007, event: 'Blue Jays affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Cats Mascot', description: 'Beloved team mascot' },
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
  'erie-seawolves': {
    id: 'erie-seawolves',
    name: 'UPMC Park',
    team: 'Erie SeaWolves',
    opened: 1995,
    capacity: 6000,
    overview: {
      description: 'UPMC Park in Erie, Pennsylvania, home of the Erie SeaWolves, serves as the Tigers AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6000.',
      highlights: [
        'Tigers AA affiliate',
        'Historic venue since 1995',
        'Family-friendly atmosphere',
        'Erie community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6000 seat capacity',
        'Group party areas',
        'Scenic Pennsylvania setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 300 }
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
      local: ['Erie favorites', 'Regional craft beers', 'Pennsylvania BBQ'],
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
        { location: 'Main concourse', exclusive: ['Erie SeaWolves gear', 'Tigers items'] }
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
        { title: 'Try local food', description: 'Sample Erie specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Erie area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6000 Stadium Way, Erie, Pennsylvania',
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
        { year: 1997, event: 'Tigers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'SeaWolves Mascot', description: 'Beloved team mascot' },
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
  'altoona-curve': {
    id: 'altoona-curve',
    name: 'Peoples Natural Gas Field',
    team: 'Altoona Curve',
    opened: 1999,
    capacity: 7210,
    overview: {
      description: 'Peoples Natural Gas Field in Altoona, Pennsylvania, home of the Altoona Curve, serves as the Pirates AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7210.',
      highlights: [
        'Pirates AA affiliate',
        'Historic venue since 1999',
        'Family-friendly atmosphere',
        'Altoona community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7210',
        'Group party areas',
        'Scenic Pennsylvania setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 360 }
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
      local: ['Altoona favorites', 'Regional craft beers', 'Pennsylvania BBQ'],
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
        { location: 'Main concourse', exclusive: ['Altoona Curve gear', 'Pirates items'] }
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
        { title: 'Try local food', description: 'Sample Altoona specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Altoona area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7210 Stadium Way, Altoona, Pennsylvania',
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
        { year: 1999, event: 'Stadium opens' },
        { year: 2001, event: 'Pirates affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Curve Mascot', description: 'Beloved team mascot' },
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
  'binghamton-rumble-ponies': {
    id: 'binghamton-rumble-ponies',
    name: 'Mirabito Stadium',
    team: 'Binghamton Rumble Ponies',
    opened: 1992,
    capacity: 6012,
    overview: {
      description: 'Mirabito Stadium in Binghamton, New York, home of the Binghamton Rumble Ponies, serves as the Mets AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6012.',
      highlights: [
        'Mets AA affiliate',
        'Historic venue since 1992',
        'Family-friendly atmosphere',
        'Binghamton community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6012 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 300 }
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
      local: ['Binghamton favorites', 'Regional craft beers', 'New York BBQ'],
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
        { location: 'Main concourse', exclusive: ['Binghamton Rumble Ponies gear', 'Mets items'] }
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
        { title: 'Try local food', description: 'Sample Binghamton specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Binghamton area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6012 Stadium Way, Binghamton, New York',
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
        { year: 1992, event: 'Stadium opens' },
        { year: 1994, event: 'Mets affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Ponies Mascot', description: 'Beloved team mascot' },
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
  'hartford-yard-goats': {
    id: 'hartford-yard-goats',
    name: 'Dunkin Park',
    team: 'Hartford Yard Goats',
    opened: 2017,
    capacity: 6121,
    overview: {
      description: 'Dunkin Park in Hartford, Connecticut, home of the Hartford Yard Goats, serves as the Rockies AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 6121.',
      highlights: [
        'Rockies AA affiliate',
        'Modern facility built in 2017',
        'Family-friendly atmosphere',
        'Hartford community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6121 seat capacity',
        'Group party areas',
        'Scenic Connecticut setting'
      ],
      renovations: [
        { year: 2022, description: 'Seating improvements' },
        { year: 2027, description: 'Concourse renovations' },
        { year: 2032, description: 'Video board upgrade' }
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
          { name: 'Party Deck', description: 'Group area', capacity: 306 }
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
      local: ['Hartford favorites', 'Regional craft beers', 'Connecticut BBQ'],
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
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Hartford Yard Goats gear', 'Rockies items'] }
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
        { title: 'Try local food', description: 'Sample Hartford specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Hartford area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6121 Stadium Way, Hartford, Connecticut',
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
        { year: 2017, event: 'Stadium opens' },
        { year: 2019, event: 'Rockies affiliation begins' },
        { year: 2027, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Goats Mascot', description: 'Beloved team mascot' },
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
  'reading-fightin-phils': {
    id: 'reading-fightin-phils',
    name: 'FirstEnergy Stadium',
    team: 'Reading Fightin Phils',
    opened: 1951,
    capacity: 9000,
    overview: {
      description: 'FirstEnergy Stadium in Reading, Pennsylvania, home of the Reading Fightin Phils, serves as the Phillies AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 9000.',
      highlights: [
        'Phillies AA affiliate',
        'Historic venue since 1951',
        'Family-friendly atmosphere',
        'Reading community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 9000',
        'Group party areas',
        'Scenic Pennsylvania setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 450 }
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
      local: ['Reading favorites', 'Regional craft beers', 'Pennsylvania BBQ'],
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
        { location: 'Main concourse', exclusive: ['Reading Fightin Phils gear', 'Phillies items'] }
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
        { title: 'Try local food', description: 'Sample Reading specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Reading area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '9000 Stadium Way, Reading, Pennsylvania',
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
        { year: 1953, event: 'Phillies affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Phils Mascot', description: 'Beloved team mascot' },
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
  'biloxi-shuckers': {
    id: 'biloxi-shuckers',
    name: 'MGM Park',
    team: 'Biloxi Shuckers',
    opened: 2015,
    capacity: 6067,
    overview: {
      description: 'MGM Park in Biloxi, Mississippi, home of the Biloxi Shuckers, serves as the Brewers AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 6067.',
      highlights: [
        'Brewers AA affiliate',
        'Modern facility built in 2015',
        'Family-friendly atmosphere',
        'Biloxi community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6067 seat capacity',
        'Group party areas',
        'Scenic Mississippi setting'
      ],
      renovations: [
        { year: 2020, description: 'Seating improvements' },
        { year: 2025, description: 'Concourse renovations' },
        { year: 2030, description: 'Video board upgrade' }
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
          { name: 'Party Deck', description: 'Group area', capacity: 303 }
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
      local: ['Biloxi favorites', 'Regional craft beers', 'Mississippi BBQ'],
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
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Biloxi Shuckers gear', 'Brewers items'] }
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
        { title: 'Try local food', description: 'Sample Biloxi specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Biloxi area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6067 Stadium Way, Biloxi, Mississippi',
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
        { year: 2015, event: 'Stadium opens' },
        { year: 2017, event: 'Brewers affiliation begins' },
        { year: 2025, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Shuckers Mascot', description: 'Beloved team mascot' },
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
  'birmingham-barons': {
    id: 'birmingham-barons',
    name: 'Regions Field',
    team: 'Birmingham Barons',
    opened: 2013,
    capacity: 8500,
    overview: {
      description: 'Regions Field in Birmingham, Alabama, home of the Birmingham Barons, serves as the White Sox AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 8500.',
      highlights: [
        'White Sox AA affiliate',
        'Modern facility built in 2013',
        'Family-friendly atmosphere',
        'Birmingham community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 8500',
        'Group party areas',
        'Scenic Alabama setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 425 }
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
      local: ['Birmingham favorites', 'Regional craft beers', 'Alabama BBQ'],
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
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Birmingham Barons gear', 'White Sox items'] }
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
        { title: 'Try local food', description: 'Sample Birmingham specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Birmingham area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '8500 Stadium Way, Birmingham, Alabama',
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
        { year: 2015, event: 'White Sox affiliation begins' },
        { year: 2023, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Barons Mascot', description: 'Beloved team mascot' },
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
  'chattanooga-lookouts': {
    id: 'chattanooga-lookouts',
    name: 'AT&T Field',
    team: 'Chattanooga Lookouts',
    opened: 2000,
    capacity: 6340,
    overview: {
      description: 'AT&T Field in Chattanooga, Tennessee, home of the Chattanooga Lookouts, serves as the Reds AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6340.',
      highlights: [
        'Reds AA affiliate',
        'Modern facility built in 2000',
        'Family-friendly atmosphere',
        'Chattanooga community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6340 seat capacity',
        'Group party areas',
        'Scenic Tennessee setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 317 }
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
      local: ['Chattanooga favorites', 'Regional craft beers', 'Tennessee BBQ'],
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
        { location: 'Main concourse', exclusive: ['Chattanooga Lookouts gear', 'Reds items'] }
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
        { title: 'Try local food', description: 'Sample Chattanooga specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Chattanooga area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6340 Stadium Way, Chattanooga, Tennessee',
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
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Lookouts Mascot', description: 'Beloved team mascot' },
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
  'montgomery-biscuits': {
    id: 'montgomery-biscuits',
    name: 'Riverwalk Stadium',
    team: 'Montgomery Biscuits',
    opened: 2004,
    capacity: 7000,
    overview: {
      description: 'Riverwalk Stadium in Montgomery, Alabama, home of the Montgomery Biscuits, serves as the Rays AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7000.',
      highlights: [
        'Rays AA affiliate',
        'Modern facility built in 2004',
        'Family-friendly atmosphere',
        'Montgomery community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 7000 seat capacity',
        'Group party areas',
        'Scenic Alabama setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 350 }
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
      local: ['Montgomery favorites', 'Regional craft beers', 'Alabama BBQ'],
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
        { location: 'Main concourse', exclusive: ['Montgomery Biscuits gear', 'Rays items'] }
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
        { title: 'Try local food', description: 'Sample Montgomery specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Montgomery area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7000 Stadium Way, Montgomery, Alabama',
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
        { year: 2004, event: 'Stadium opens' },
        { year: 2006, event: 'Rays affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Biscuits Mascot', description: 'Beloved team mascot' },
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
  'pensacola-blue-wahoos': {
    id: 'pensacola-blue-wahoos',
    name: 'Blue Wahoos Stadium',
    team: 'Pensacola Blue Wahoos',
    opened: 2012,
    capacity: 5038,
    overview: {
      description: 'Blue Wahoos Stadium in Pensacola, Florida, home of the Pensacola Blue Wahoos, serves as the Marlins AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 5038.',
      highlights: [
        'Marlins AA affiliate',
        'Modern facility built in 2012',
        'Family-friendly atmosphere',
        'Pensacola community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5038 seat capacity',
        'Group party areas',
        'Climate-controlled areas'
      ],
      renovations: [
        { year: 2017, description: 'Seating improvements' },
        { year: 2022, description: 'Concourse renovations' },
        { year: 2027, description: 'Video board upgrade' }
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
        'Seek covered areas during summer heat',
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
        { month: 'April', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Sunscreen essential' },
        { month: 'May', avgTemp: 82, avgHumidity: 65, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Seek shade' },
        { month: 'June', avgTemp: 88, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 91, avgHumidity: 75, rainChance: 40, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'August', avgTemp: 90, avgHumidity: 75, rainChance: 45, typicalConditions: 'Very hot', shadeTip: 'Hydrate frequently' },
        { month: 'September', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'Shade still important' }
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
          { name: 'Party Deck', description: 'Group area', capacity: 251 }
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
      local: ['Pensacola favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Pensacola Blue Wahoos gear', 'Marlins items'] }
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
        { title: 'Bring sunscreen', description: 'Essential for day games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Pensacola specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Pensacola area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5038 Stadium Way, Pensacola, Florida',
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
        { year: 2012, event: 'Stadium opens' },
        { year: 2014, event: 'Marlins affiliation begins' },
        { year: 2022, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Wahoos Mascot', description: 'Beloved team mascot' },
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
  'rocket-city-trash-pandas': {
    id: 'rocket-city-trash-pandas',
    name: 'Toyota Field',
    team: 'Rocket City Trash Pandas',
    opened: 2020,
    capacity: 7500,
    overview: {
      description: 'Toyota Field in Madison, Alabama, home of the Rocket City Trash Pandas, serves as the Angels AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 7500.',
      highlights: [
        'Angels AA affiliate',
        'Modern facility built in 2020',
        'Family-friendly atmosphere',
        'Madison community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Brand new stadium',
        'Local food specialties',
        'Large capacity of 7500',
        'Group party areas',
        'Scenic Alabama setting'
      ],
      renovations: [
        { year: 2025, description: 'Seating improvements' },
        { year: 2030, description: 'Concourse renovations' },
        { year: 2035, description: 'Video board upgrade' }
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
      local: ['Madison favorites', 'Regional craft beers', 'Alabama BBQ'],
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
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Rocket City Trash Pandas gear', 'Angels items'] }
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
        { title: 'Try local food', description: 'Sample Madison specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Madison area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7500 Stadium Way, Madison, Alabama',
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
        { year: 2020, event: 'Stadium opens' },
        { year: 2022, event: 'Angels affiliation begins' },
        { year: 2030, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Pandas Mascot', description: 'Beloved team mascot' },
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
  'tennessee-smokies': {
    id: 'tennessee-smokies',
    name: 'Smokies Stadium',
    team: 'Tennessee Smokies',
    opened: 2000,
    capacity: 8000,
    overview: {
      description: 'Smokies Stadium in Kodak, Tennessee, home of the Tennessee Smokies, serves as the Cubs AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 8000.',
      highlights: [
        'Cubs AA affiliate',
        'Modern facility built in 2000',
        'Family-friendly atmosphere',
        'Kodak community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 8000',
        'Group party areas',
        'Scenic Tennessee setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 400 }
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
      local: ['Kodak favorites', 'Regional craft beers', 'Tennessee BBQ'],
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
        { location: 'Main concourse', exclusive: ['Tennessee Smokies gear', 'Cubs items'] }
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
        { title: 'Try local food', description: 'Sample Kodak specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Kodak area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '8000 Stadium Way, Kodak, Tennessee',
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
        { year: 2002, event: 'Cubs affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Smokies Mascot', description: 'Beloved team mascot' },
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
  'mississippi-braves': {
    id: 'mississippi-braves',
    name: 'Trustmark Park',
    team: 'Mississippi Braves',
    opened: 2005,
    capacity: 8480,
    overview: {
      description: 'Trustmark Park in Pearl, Mississippi, home of the Mississippi Braves, serves as the Braves AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 8480.',
      highlights: [
        'Braves AA affiliate',
        'Modern facility built in 2005',
        'Family-friendly atmosphere',
        'Pearl community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 8480',
        'Group party areas',
        'Scenic Mississippi setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 424 }
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
      local: ['Pearl favorites', 'Regional craft beers', 'Mississippi BBQ'],
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
        { location: 'Main concourse', exclusive: ['Mississippi Braves gear', 'Braves items'] }
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
        { title: 'Try local food', description: 'Sample Pearl specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Pearl area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '8480 Stadium Way, Pearl, Mississippi',
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
        { year: 2007, event: 'Braves affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
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
  'amarillo-sod-poodles': {
    id: 'amarillo-sod-poodles',
    name: 'HODGETOWN',
    team: 'Amarillo Sod Poodles',
    opened: 2019,
    capacity: 7279,
    overview: {
      description: 'HODGETOWN in Amarillo, Texas, home of the Amarillo Sod Poodles, serves as the Diamondbacks AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 7279.',
      highlights: [
        'Diamondbacks AA affiliate',
        'Modern facility built in 2019',
        'Family-friendly atmosphere',
        'Amarillo community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7279',
        'Group party areas',
        'Climate-controlled areas'
      ],
      renovations: [
        { year: 2024, description: 'Seating improvements' },
        { year: 2029, description: 'Concourse renovations' },
        { year: 2034, description: 'Video board upgrade' }
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
        'Seek covered areas during summer heat',
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
        { month: 'April', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Sunscreen essential' },
        { month: 'May', avgTemp: 82, avgHumidity: 65, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Seek shade' },
        { month: 'June', avgTemp: 88, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 91, avgHumidity: 75, rainChance: 40, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'August', avgTemp: 90, avgHumidity: 75, rainChance: 45, typicalConditions: 'Very hot', shadeTip: 'Hydrate frequently' },
        { month: 'September', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'Shade still important' }
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
      local: ['Amarillo favorites', 'Regional craft beers', 'Texas BBQ'],
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
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Amarillo Sod Poodles gear', 'Diamondbacks items'] }
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
        { title: 'Bring sunscreen', description: 'Essential for day games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Amarillo specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Amarillo area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7279 Stadium Way, Amarillo, Texas',
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
        { year: 2019, event: 'Stadium opens' },
        { year: 2021, event: 'Diamondbacks affiliation begins' },
        { year: 2029, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Poodles Mascot', description: 'Beloved team mascot' },
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
  'arkansas-travelers': {
    id: 'arkansas-travelers',
    name: 'Dickey-Stephens Park',
    team: 'Arkansas Travelers',
    opened: 2007,
    capacity: 7480,
    overview: {
      description: 'Dickey-Stephens Park in North Little Rock, Arkansas, home of the Arkansas Travelers, serves as the Mariners AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7480.',
      highlights: [
        'Mariners AA affiliate',
        'Modern facility built in 2007',
        'Family-friendly atmosphere',
        'North Little Rock community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7480',
        'Group party areas',
        'Scenic Arkansas setting'
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
      local: ['North Little Rock favorites', 'Regional craft beers', 'Arkansas BBQ'],
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
        { location: 'Main concourse', exclusive: ['Arkansas Travelers gear', 'Mariners items'] }
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
        { title: 'Try local food', description: 'Sample North Little Rock specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'North Little Rock area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7480 Stadium Way, North Little Rock, Arkansas',
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
        { year: 2009, event: 'Mariners affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Travelers Mascot', description: 'Beloved team mascot' },
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
  'corpus-christi-hooks': {
    id: 'corpus-christi-hooks',
    name: 'Whataburger Field',
    team: 'Corpus Christi Hooks',
    opened: 2005,
    capacity: 5368,
    overview: {
      description: 'Whataburger Field in Corpus Christi, Texas, home of the Corpus Christi Hooks, serves as the Astros AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5368.',
      highlights: [
        'Astros AA affiliate',
        'Modern facility built in 2005',
        'Family-friendly atmosphere',
        'Corpus Christi community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5368 seat capacity',
        'Group party areas',
        'Climate-controlled areas'
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
        'Seek covered areas during summer heat',
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
        { month: 'April', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Sunscreen essential' },
        { month: 'May', avgTemp: 82, avgHumidity: 65, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Seek shade' },
        { month: 'June', avgTemp: 88, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 91, avgHumidity: 75, rainChance: 40, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'August', avgTemp: 90, avgHumidity: 75, rainChance: 45, typicalConditions: 'Very hot', shadeTip: 'Hydrate frequently' },
        { month: 'September', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'Shade still important' }
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
          { name: 'Party Deck', description: 'Group area', capacity: 268 }
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
      local: ['Corpus Christi favorites', 'Regional craft beers', 'Texas BBQ'],
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
        { location: 'Main concourse', exclusive: ['Corpus Christi Hooks gear', 'Astros items'] }
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
        { title: 'Bring sunscreen', description: 'Essential for day games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Corpus Christi specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Corpus Christi area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5368 Stadium Way, Corpus Christi, Texas',
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
        { year: 2007, event: 'Astros affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Hooks Mascot', description: 'Beloved team mascot' },
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
  'frisco-roughriders': {
    id: 'frisco-roughriders',
    name: 'Riders Field',
    team: 'Frisco RoughRiders',
    opened: 2003,
    capacity: 10316,
    overview: {
      description: 'Riders Field in Frisco, Texas, home of the Frisco RoughRiders, serves as the Rangers AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 10316.',
      highlights: [
        'Rangers AA affiliate',
        'Modern facility built in 2003',
        'Family-friendly atmosphere',
        'Frisco community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 10316',
        'Group party areas',
        'Climate-controlled areas'
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
        'Seek covered areas during summer heat',
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
        { month: 'April', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Sunscreen essential' },
        { month: 'May', avgTemp: 82, avgHumidity: 65, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Seek shade' },
        { month: 'June', avgTemp: 88, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 91, avgHumidity: 75, rainChance: 40, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'August', avgTemp: 90, avgHumidity: 75, rainChance: 45, typicalConditions: 'Very hot', shadeTip: 'Hydrate frequently' },
        { month: 'September', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'Shade still important' }
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
          { name: 'Party Deck', description: 'Group area', capacity: 515 }
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
      local: ['Frisco favorites', 'Regional craft beers', 'Texas BBQ'],
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
        { location: 'Main concourse', exclusive: ['Frisco RoughRiders gear', 'Rangers items'] }
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
        { title: 'Bring sunscreen', description: 'Essential for day games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Frisco specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Frisco area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '10316 Stadium Way, Frisco, Texas',
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
        { year: 2005, event: 'Rangers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'RoughRiders Mascot', description: 'Beloved team mascot' },
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
  'midland-rockhounds': {
    id: 'midland-rockhounds',
    name: 'Momentum Bank Ballpark',
    team: 'Midland RockHounds',
    opened: 2002,
    capacity: 4999,
    overview: {
      description: 'Momentum Bank Ballpark in Midland, Texas, home of the Midland RockHounds, serves as the Athletics AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 4999.',
      highlights: [
        'Athletics AA affiliate',
        'Modern facility built in 2002',
        'Family-friendly atmosphere',
        'Midland community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4999 seat capacity',
        'Group party areas',
        'Climate-controlled areas'
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
        'Seek covered areas during summer heat',
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
        { month: 'April', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Sunscreen essential' },
        { month: 'May', avgTemp: 82, avgHumidity: 65, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Seek shade' },
        { month: 'June', avgTemp: 88, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 91, avgHumidity: 75, rainChance: 40, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'August', avgTemp: 90, avgHumidity: 75, rainChance: 45, typicalConditions: 'Very hot', shadeTip: 'Hydrate frequently' },
        { month: 'September', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'Shade still important' }
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
          { name: 'Party Deck', description: 'Group area', capacity: 249 }
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
      local: ['Midland favorites', 'Regional craft beers', 'Texas BBQ'],
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
        { location: 'Main concourse', exclusive: ['Midland RockHounds gear', 'Athletics items'] }
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
        { title: 'Bring sunscreen', description: 'Essential for day games', category: 'weather' },
        { title: 'Try local food', description: 'Sample Midland specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      address: '4999 Stadium Way, Midland, Texas',
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
        { year: 2004, event: 'Athletics affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'RockHounds Mascot', description: 'Beloved team mascot' },
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
  'northwest-arkansas-naturals': {
    id: 'northwest-arkansas-naturals',
    name: 'Arvest Ballpark',
    team: 'Northwest Arkansas Naturals',
    opened: 2008,
    capacity: 7492,
    overview: {
      description: 'Arvest Ballpark in Springdale, Arkansas, home of the Northwest Arkansas Naturals, serves as the Royals AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7492.',
      highlights: [
        'Royals AA affiliate',
        'Modern facility built in 2008',
        'Family-friendly atmosphere',
        'Springdale community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7492',
        'Group party areas',
        'Scenic Arkansas setting'
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
      local: ['Springdale favorites', 'Regional craft beers', 'Arkansas BBQ'],
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
        { location: 'Main concourse', exclusive: ['Northwest Arkansas Naturals gear', 'Royals items'] }
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
        { title: 'Try local food', description: 'Sample Springdale specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Springdale area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7492 Stadium Way, Springdale, Arkansas',
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
        { year: 2008, event: 'Stadium opens' },
        { year: 2010, event: 'Royals affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Naturals Mascot', description: 'Beloved team mascot' },
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
  'san-antonio-missions': {
    id: 'san-antonio-missions',
    name: 'Nelson W. Wolff Stadium',
    team: 'San Antonio Missions',
    opened: 1994,
    capacity: 9200,
    overview: {
      description: 'Nelson W. Wolff Stadium in San Antonio, Texas, home of the San Antonio Missions, serves as the Padres AA affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 9200.',
      highlights: [
        'Padres AA affiliate',
        'Historic venue since 1994',
        'Family-friendly atmosphere',
        'San Antonio community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 9200',
        'Group party areas',
        'Climate-controlled areas'
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
        'Seek covered areas during summer heat',
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
        { month: 'April', avgTemp: 75, avgHumidity: 60, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Sunscreen essential' },
        { month: 'May', avgTemp: 82, avgHumidity: 65, rainChance: 30, typicalConditions: 'Getting hot', shadeTip: 'Seek shade' },
        { month: 'June', avgTemp: 88, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating recommended' },
        { month: 'July', avgTemp: 91, avgHumidity: 75, rainChance: 40, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'August', avgTemp: 90, avgHumidity: 75, rainChance: 45, typicalConditions: 'Very hot', shadeTip: 'Hydrate frequently' },
        { month: 'September', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'Shade still important' }
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
          { name: 'Picnic Area', description: 'Group area', capacity: 460 }
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
      local: ['San Antonio favorites', 'Regional craft beers', 'Texas BBQ'],
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
        { location: 'Main concourse', exclusive: ['San Antonio Missions gear', 'Padres items'] }
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
        { title: 'Bring sunscreen', description: 'Essential for day games', category: 'weather' },
        { title: 'Try local food', description: 'Sample San Antonio specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'San Antonio area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '9200 Stadium Way, San Antonio, Texas',
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
        { year: 1996, event: 'Padres affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Missions Mascot', description: 'Beloved team mascot' },
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
  'springfield-cardinals': {
    id: 'springfield-cardinals',
    name: 'Hammons Field',
    team: 'Springfield Cardinals',
    opened: 2004,
    capacity: 10486,
    overview: {
      description: 'Hammons Field in Springfield, Missouri, home of the Springfield Cardinals, serves as the Cardinals AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 10486.',
      highlights: [
        'Cardinals AA affiliate',
        'Modern facility built in 2004',
        'Family-friendly atmosphere',
        'Springfield community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 10486',
        'Group party areas',
        'Scenic Missouri setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 524 }
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
      local: ['Springfield favorites', 'Regional craft beers', 'Missouri BBQ'],
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
        { location: 'Main concourse', exclusive: ['Springfield Cardinals gear', 'Cardinals items'] }
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
        { title: 'Try local food', description: 'Sample Springfield specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Springfield area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '10486 Stadium Way, Springfield, Missouri',
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
        { year: 2004, event: 'Stadium opens' },
        { year: 2006, event: 'Cardinals affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Cardinals Mascot', description: 'Beloved team mascot' },
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
  'tulsa-drillers': {
    id: 'tulsa-drillers',
    name: 'ONEOK Field',
    team: 'Tulsa Drillers',
    opened: 2010,
    capacity: 7833,
    overview: {
      description: 'ONEOK Field in Tulsa, Oklahoma, home of the Tulsa Drillers, serves as the Dodgers AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 7833.',
      highlights: [
        'Dodgers AA affiliate',
        'Modern facility built in 2010',
        'Family-friendly atmosphere',
        'Tulsa community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7833',
        'Group party areas',
        'Scenic Oklahoma setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 391 }
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
      local: ['Tulsa favorites', 'Regional craft beers', 'Oklahoma BBQ'],
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
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Tulsa Drillers gear', 'Dodgers items'] }
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
        { title: 'Try local food', description: 'Sample Tulsa specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Tulsa area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7833 Stadium Way, Tulsa, Oklahoma',
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
        { year: 2012, event: 'Dodgers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Drillers Mascot', description: 'Beloved team mascot' },
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
  'wichita-wind-surge': {
    id: 'wichita-wind-surge',
    name: 'Riverfront Stadium',
    team: 'Wichita Wind Surge',
    opened: 2020,
    capacity: 10025,
    overview: {
      description: 'Riverfront Stadium in Wichita, Kansas, home of the Wichita Wind Surge, serves as the Twins AA affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 10025.',
      highlights: [
        'Twins AA affiliate',
        'Modern facility built in 2020',
        'Family-friendly atmosphere',
        'Wichita community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Brand new stadium',
        'Local food specialties',
        'Large capacity of 10025',
        'Group party areas',
        'Scenic Kansas setting'
      ],
      renovations: [
        { year: 2025, description: 'Seating improvements' },
        { year: 2030, description: 'Concourse renovations' },
        { year: 2035, description: 'Video board upgrade' }
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
          { name: 'Party Deck', description: 'Group area', capacity: 501 }
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
      local: ['Wichita favorites', 'Regional craft beers', 'Kansas BBQ'],
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
        name: 'VIP Gate',
        location: 'Club entrance',
        bestFor: ['Premium seating', 'Suites'],
        openTime: '90 minutes before first pitch'
      }
    ],
    amenities: {
      merchandise: [
        { location: 'Main concourse', exclusive: ['Wichita Wind Surge gear', 'Twins items'] }
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
        { title: 'Try local food', description: 'Sample Wichita specialties', category: 'food' },
        { title: 'Kids activities', description: 'Fun Zone opens early', category: 'family' }
      ],
      typicalSchedule: {
        gatesOpen: '1 hour before',
        battingPractice: 'Select dates',
        firstPitch: '7:05 PM weekdays',
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
      name: 'Wichita area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '10025 Stadium Way, Wichita, Kansas',
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
        { year: 2020, event: 'Stadium opens' },
        { year: 2022, event: 'Twins affiliation begins' },
        { year: 2030, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Surge Mascot', description: 'Beloved team mascot' },
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