import { StadiumGuide } from '../stadiumGuides';

export const singleAStadiumGuides: Record<string, StadiumGuide> = {
  'augusta-greenjackets': {
    id: 'augusta-greenjackets',
    name: 'SRP Park',
    team: 'Augusta GreenJackets',
    opened: 2018,
    capacity: 4782,
    overview: {
      description: 'SRP Park in North Augusta, South Carolina, home of the Augusta GreenJackets, serves as the Braves Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 4782.',
      highlights: [
        'Braves Single-A affiliate',
        'Modern facility built in 2018',
        'Family-friendly atmosphere',
        'North Augusta community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4782 seat capacity',
        'Group party areas',
        'Scenic South Carolina setting'
      ],
      renovations: [
        { year: 2023, description: 'Seating improvements' },
        { year: 2028, description: 'Concourse renovations' },
        { year: 2033, description: 'Video board upgrade' }
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
          { name: 'Party Deck', description: 'Group area', capacity: 239 }
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
      local: ['North Augusta favorites', 'Regional craft beers', 'South Carolina BBQ'],
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
        { location: 'Main concourse', exclusive: ['Augusta GreenJackets gear', 'Braves items'] }
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
        { title: 'Try local food', description: 'Sample North Augusta specialties', category: 'food' },
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
      name: 'North Augusta area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4782 Stadium Way, North Augusta, South Carolina',
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
        { year: 2018, event: 'Stadium opens' },
        { year: 2020, event: 'Braves affiliation begins' },
        { year: 2028, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'GreenJackets Mascot', description: 'Beloved team mascot' },
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
  'charleston-riverdogs': {
    id: 'charleston-riverdogs',
    name: 'Joseph P. Riley Jr. Park',
    team: 'Charleston RiverDogs',
    opened: 1997,
    capacity: 6000,
    overview: {
      description: 'Joseph P. Riley Jr. Park in Charleston, South Carolina, home of the Charleston RiverDogs, serves as the Rays Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6000.',
      highlights: [
        'Rays Single-A affiliate',
        'Historic venue since 1997',
        'Family-friendly atmosphere',
        'Charleston community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6000 seat capacity',
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
      local: ['Charleston favorites', 'Regional craft beers', 'South Carolina BBQ'],
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
        { location: 'Main concourse', exclusive: ['Charleston RiverDogs gear', 'Rays items'] }
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
        { title: 'Try local food', description: 'Sample Charleston specialties', category: 'food' },
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
      name: 'Charleston area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6000 Stadium Way, Charleston, South Carolina',
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
        { year: 1999, event: 'Rays affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'RiverDogs Mascot', description: 'Beloved team mascot' },
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
  'columbia-fireflies': {
    id: 'columbia-fireflies',
    name: 'Segra Park',
    team: 'Columbia Fireflies',
    opened: 2016,
    capacity: 9077,
    overview: {
      description: 'Segra Park in Columbia, South Carolina, home of the Columbia Fireflies, serves as the Royals Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 9077.',
      highlights: [
        'Royals Single-A affiliate',
        'Modern facility built in 2016',
        'Family-friendly atmosphere',
        'Columbia community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 9077',
        'Group party areas',
        'Scenic South Carolina setting'
      ],
      renovations: [
        { year: 2021, description: 'Seating improvements' },
        { year: 2026, description: 'Concourse renovations' },
        { year: 2031, description: 'Video board upgrade' }
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
          { name: 'Party Deck', description: 'Group area', capacity: 453 }
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
      local: ['Columbia favorites', 'Regional craft beers', 'South Carolina BBQ'],
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
        { location: 'Main concourse', exclusive: ['Columbia Fireflies gear', 'Royals items'] }
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
        { title: 'Try local food', description: 'Sample Columbia specialties', category: 'food' },
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
      name: 'Columbia area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '9077 Stadium Way, Columbia, South Carolina',
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
        { year: 2016, event: 'Stadium opens' },
        { year: 2018, event: 'Royals affiliation begins' },
        { year: 2026, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Fireflies Mascot', description: 'Beloved team mascot' },
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
  'carolina-mudcats': {
    id: 'carolina-mudcats',
    name: 'Five County Stadium',
    team: 'Carolina Mudcats',
    opened: 1991,
    capacity: 6500,
    overview: {
      description: 'Five County Stadium in Zebulon, North Carolina, home of the Carolina Mudcats, serves as the Brewers Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6500.',
      highlights: [
        'Brewers Single-A affiliate',
        'Historic venue since 1991',
        'Family-friendly atmosphere',
        'Zebulon community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6500 seat capacity',
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
      local: ['Zebulon favorites', 'Regional craft beers', 'North Carolina BBQ'],
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
        { location: 'Main concourse', exclusive: ['Carolina Mudcats gear', 'Brewers items'] }
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
        { title: 'Try local food', description: 'Sample Zebulon specialties', category: 'food' },
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
      name: 'Zebulon area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6500 Stadium Way, Zebulon, North Carolina',
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
        { year: 1991, event: 'Stadium opens' },
        { year: 1993, event: 'Brewers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Mudcats Mascot', description: 'Beloved team mascot' },
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
  'delmarva-shorebirds': {
    id: 'delmarva-shorebirds',
    name: 'Arthur W. Perdue Stadium',
    team: 'Delmarva Shorebirds',
    opened: 1996,
    capacity: 5200,
    overview: {
      description: 'Arthur W. Perdue Stadium in Salisbury, Maryland, home of the Delmarva Shorebirds, serves as the Orioles Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5200.',
      highlights: [
        'Orioles Single-A affiliate',
        'Historic venue since 1996',
        'Family-friendly atmosphere',
        'Salisbury community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5200 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 260 }
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
      local: ['Salisbury favorites', 'Regional craft beers', 'Maryland BBQ'],
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
        { location: 'Main concourse', exclusive: ['Delmarva Shorebirds gear', 'Orioles items'] }
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
        { title: 'Try local food', description: 'Sample Salisbury specialties', category: 'food' },
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
      name: 'Salisbury area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5200 Stadium Way, Salisbury, Maryland',
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
        { year: 1998, event: 'Orioles affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Shorebirds Mascot', description: 'Beloved team mascot' },
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
  'fayetteville-woodpeckers': {
    id: 'fayetteville-woodpeckers',
    name: 'Segra Stadium',
    team: 'Fayetteville Woodpeckers',
    opened: 2019,
    capacity: 5200,
    overview: {
      description: 'Segra Stadium in Fayetteville, North Carolina, home of the Fayetteville Woodpeckers, serves as the Astros Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 5200.',
      highlights: [
        'Astros Single-A affiliate',
        'Modern facility built in 2019',
        'Family-friendly atmosphere',
        'Fayetteville community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5200 seat capacity',
        'Group party areas',
        'Scenic North Carolina setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 260 }
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
      local: ['Fayetteville favorites', 'Regional craft beers', 'North Carolina BBQ'],
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
        { location: 'Main concourse', exclusive: ['Fayetteville Woodpeckers gear', 'Astros items'] }
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
        { title: 'Try local food', description: 'Sample Fayetteville specialties', category: 'food' },
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
      name: 'Fayetteville area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5200 Stadium Way, Fayetteville, North Carolina',
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
        { year: 2021, event: 'Astros affiliation begins' },
        { year: 2029, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Woodpeckers Mascot', description: 'Beloved team mascot' },
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
  'fredericksburg-nationals': {
    id: 'fredericksburg-nationals',
    name: 'Virginia Credit Union Stadium',
    team: 'Fredericksburg Nationals',
    opened: 2020,
    capacity: 5000,
    overview: {
      description: 'Virginia Credit Union Stadium in Fredericksburg, Virginia, home of the Fredericksburg Nationals, serves as the Nationals Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 5000.',
      highlights: [
        'Nationals Single-A affiliate',
        'Modern facility built in 2020',
        'Family-friendly atmosphere',
        'Fredericksburg community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Brand new stadium',
        'Local food specialties',
        'Intimate 5000 seat capacity',
        'Group party areas',
        'Scenic Virginia setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 250 }
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
      local: ['Fredericksburg favorites', 'Regional craft beers', 'Virginia BBQ'],
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
        { location: 'Main concourse', exclusive: ['Fredericksburg Nationals gear', 'Nationals items'] }
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
        { title: 'Try local food', description: 'Sample Fredericksburg specialties', category: 'food' },
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
      name: 'Fredericksburg area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5000 Stadium Way, Fredericksburg, Virginia',
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
        { year: 2022, event: 'Nationals affiliation begins' },
        { year: 2030, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Nationals Mascot', description: 'Beloved team mascot' },
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
  'kannapolis-cannon-ballers': {
    id: 'kannapolis-cannon-ballers',
    name: 'Atrium Health Ballpark',
    team: 'Kannapolis Cannon Ballers',
    opened: 2020,
    capacity: 4930,
    overview: {
      description: 'Atrium Health Ballpark in Kannapolis, North Carolina, home of the Kannapolis Cannon Ballers, serves as the White Sox Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with state-of-the-art amenities and a capacity of 4930.',
      highlights: [
        'White Sox Single-A affiliate',
        'Modern facility built in 2020',
        'Family-friendly atmosphere',
        'Kannapolis community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Brand new stadium',
        'Local food specialties',
        'Intimate 4930 seat capacity',
        'Group party areas',
        'Scenic North Carolina setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 246 }
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
      local: ['Kannapolis favorites', 'Regional craft beers', 'North Carolina BBQ'],
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
        { location: 'Main concourse', exclusive: ['Kannapolis Cannon Ballers gear', 'White Sox items'] }
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
        { title: 'Try local food', description: 'Sample Kannapolis specialties', category: 'food' },
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
      name: 'Kannapolis area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4930 Stadium Way, Kannapolis, North Carolina',
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
        { year: 2022, event: 'White Sox affiliation begins' },
        { year: 2030, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Ballers Mascot', description: 'Beloved team mascot' },
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
  'lynchburg-hillcats': {
    id: 'lynchburg-hillcats',
    name: 'Bank of the James Stadium',
    team: 'Lynchburg Hillcats',
    opened: 2004,
    capacity: 4291,
    overview: {
      description: 'Bank of the James Stadium in Lynchburg, Virginia, home of the Lynchburg Hillcats, serves as the Guardians Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 4291.',
      highlights: [
        'Guardians Single-A affiliate',
        'Modern facility built in 2004',
        'Family-friendly atmosphere',
        'Lynchburg community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4291 seat capacity',
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
          { name: 'Party Deck', description: 'Group area', capacity: 214 }
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
      local: ['Lynchburg favorites', 'Regional craft beers', 'Virginia BBQ'],
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
        { location: 'Main concourse', exclusive: ['Lynchburg Hillcats gear', 'Guardians items'] }
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
        { title: 'Try local food', description: 'Sample Lynchburg specialties', category: 'food' },
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
      name: 'Lynchburg area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4291 Stadium Way, Lynchburg, Virginia',
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
        { year: 2006, event: 'Guardians affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Hillcats Mascot', description: 'Beloved team mascot' },
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
  'myrtle-beach-pelicans': {
    id: 'myrtle-beach-pelicans',
    name: 'Pelicans Ballpark',
    team: 'Myrtle Beach Pelicans',
    opened: 1999,
    capacity: 6599,
    overview: {
      description: 'Pelicans Ballpark in Myrtle Beach, South Carolina, home of the Myrtle Beach Pelicans, serves as the Cubs Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6599.',
      highlights: [
        'Cubs Single-A affiliate',
        'Historic venue since 1999',
        'Family-friendly atmosphere',
        'Myrtle Beach community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6599 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 329 }
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
      local: ['Myrtle Beach favorites', 'Regional craft beers', 'South Carolina BBQ'],
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
        { location: 'Main concourse', exclusive: ['Myrtle Beach Pelicans gear', 'Cubs items'] }
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
        { title: 'Try local food', description: 'Sample Myrtle Beach specialties', category: 'food' },
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
      name: 'Myrtle Beach area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6599 Stadium Way, Myrtle Beach, South Carolina',
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
        { year: 2001, event: 'Cubs affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Pelicans Mascot', description: 'Beloved team mascot' },
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
  'salem-red-sox': {
    id: 'salem-red-sox',
    name: 'Carilion Clinic Field',
    team: 'Salem Red Sox',
    opened: 1995,
    capacity: 6419,
    overview: {
      description: 'Carilion Clinic Field in Salem, Virginia, home of the Salem Red Sox, serves as the Red Sox Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6419.',
      highlights: [
        'Red Sox Single-A affiliate',
        'Historic venue since 1995',
        'Family-friendly atmosphere',
        'Salem community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6419 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 320 }
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
      local: ['Salem favorites', 'Regional craft beers', 'Virginia BBQ'],
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
        { location: 'Main concourse', exclusive: ['Salem Red Sox gear', 'Red Sox items'] }
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
        { title: 'Try local food', description: 'Sample Salem specialties', category: 'food' },
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
      name: 'Salem area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6419 Stadium Way, Salem, Virginia',
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
        { year: 1997, event: 'Red Sox affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Sox Mascot', description: 'Beloved team mascot' },
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
  'down-east-wood-ducks': {
    id: 'down-east-wood-ducks',
    name: 'Grainger Stadium',
    team: 'Down East Wood Ducks',
    opened: 1949,
    capacity: 4100,
    overview: {
      description: 'Grainger Stadium in Kinston, North Carolina, home of the Down East Wood Ducks, serves as the Rangers Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 4100.',
      highlights: [
        'Rangers Single-A affiliate',
        'Historic venue since 1949',
        'Family-friendly atmosphere',
        'Kinston community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4100 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 205 }
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
      local: ['Kinston favorites', 'Regional craft beers', 'North Carolina BBQ'],
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
        { location: 'Main concourse', exclusive: ['Down East Wood Ducks gear', 'Rangers items'] }
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
        { title: 'Try local food', description: 'Sample Kinston specialties', category: 'food' },
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
      name: 'Kinston area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4100 Stadium Way, Kinston, North Carolina',
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
        { year: 1951, event: 'Rangers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Ducks Mascot', description: 'Beloved team mascot' },
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
  'bradenton-marauders': {
    id: 'bradenton-marauders',
    name: 'LECOM Park',
    team: 'Bradenton Marauders',
    opened: 1923,
    capacity: 8500,
    overview: {
      description: 'LECOM Park in Bradenton, Florida, home of the Bradenton Marauders, serves as the Pirates Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 8500.',
      highlights: [
        'Pirates Single-A affiliate',
        'Historic venue since 1923',
        'Family-friendly atmosphere',
        'Bradenton community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 8500',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 425 }
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
      local: ['Bradenton favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Bradenton Marauders gear', 'Pirates items'] }
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
        { title: 'Try local food', description: 'Sample Bradenton specialties', category: 'food' },
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
      name: 'Bradenton area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '8500 Stadium Way, Bradenton, Florida',
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
        { year: 1923, event: 'Stadium opens' },
        { year: 1925, event: 'Pirates affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Marauders Mascot', description: 'Beloved team mascot' },
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
  'clearwater-threshers': {
    id: 'clearwater-threshers',
    name: 'BayCare Ballpark',
    team: 'Clearwater Threshers',
    opened: 2004,
    capacity: 8500,
    overview: {
      description: 'BayCare Ballpark in Clearwater, Florida, home of the Clearwater Threshers, serves as the Phillies Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 8500.',
      highlights: [
        'Phillies Single-A affiliate',
        'Modern facility built in 2004',
        'Family-friendly atmosphere',
        'Clearwater community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 8500',
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
      local: ['Clearwater favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Clearwater Threshers gear', 'Phillies items'] }
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
        { title: 'Try local food', description: 'Sample Clearwater specialties', category: 'food' },
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
      name: 'Clearwater area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '8500 Stadium Way, Clearwater, Florida',
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
        { year: 2006, event: 'Phillies affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Threshers Mascot', description: 'Beloved team mascot' },
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
  'daytona-tortugas': {
    id: 'daytona-tortugas',
    name: 'Jackie Robinson Ballpark',
    team: 'Daytona Tortugas',
    opened: 1914,
    capacity: 5100,
    overview: {
      description: 'Jackie Robinson Ballpark in Daytona Beach, Florida, home of the Daytona Tortugas, serves as the Reds Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5100.',
      highlights: [
        'Reds Single-A affiliate',
        'Historic venue since 1914',
        'Family-friendly atmosphere',
        'Daytona Beach community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5100 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 255 }
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
      local: ['Daytona Beach favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Daytona Tortugas gear', 'Reds items'] }
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
        { title: 'Try local food', description: 'Sample Daytona Beach specialties', category: 'food' },
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
      name: 'Daytona Beach area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5100 Stadium Way, Daytona Beach, Florida',
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
        { year: 1914, event: 'Stadium opens' },
        { year: 1916, event: 'Reds affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Tortugas Mascot', description: 'Beloved team mascot' },
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
  'dunedin-blue-jays': {
    id: 'dunedin-blue-jays',
    name: 'TD Ballpark',
    team: 'Dunedin Blue Jays',
    opened: 1990,
    capacity: 8500,
    overview: {
      description: 'TD Ballpark in Dunedin, Florida, home of the Dunedin Blue Jays, serves as the Blue Jays Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 8500.',
      highlights: [
        'Blue Jays Single-A affiliate',
        'Historic venue since 1990',
        'Family-friendly atmosphere',
        'Dunedin community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 8500',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 425 }
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
      local: ['Dunedin favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Dunedin Blue Jays gear', 'Blue Jays items'] }
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
        { title: 'Try local food', description: 'Sample Dunedin specialties', category: 'food' },
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
      name: 'Dunedin area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '8500 Stadium Way, Dunedin, Florida',
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
        { year: 1990, event: 'Stadium opens' },
        { year: 1992, event: 'Blue Jays affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Jays Mascot', description: 'Beloved team mascot' },
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
  'fort-myers-mighty-mussels': {
    id: 'fort-myers-mighty-mussels',
    name: 'Hammond Stadium',
    team: 'Fort Myers Mighty Mussels',
    opened: 1991,
    capacity: 9300,
    overview: {
      description: 'Hammond Stadium in Fort Myers, Florida, home of the Fort Myers Mighty Mussels, serves as the Twins Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 9300.',
      highlights: [
        'Twins Single-A affiliate',
        'Historic venue since 1991',
        'Family-friendly atmosphere',
        'Fort Myers community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 9300',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 465 }
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
      local: ['Fort Myers favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Fort Myers Mighty Mussels gear', 'Twins items'] }
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
        { title: 'Try local food', description: 'Sample Fort Myers specialties', category: 'food' },
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
      name: 'Fort Myers area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '9300 Stadium Way, Fort Myers, Florida',
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
        { year: 1991, event: 'Stadium opens' },
        { year: 1993, event: 'Twins affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Mussels Mascot', description: 'Beloved team mascot' },
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
  'jupiter-hammerheads': {
    id: 'jupiter-hammerheads',
    name: 'Roger Dean Chevrolet Stadium',
    team: 'Jupiter Hammerheads',
    opened: 1998,
    capacity: 6940,
    overview: {
      description: 'Roger Dean Chevrolet Stadium in Jupiter, Florida, home of the Jupiter Hammerheads, serves as the Marlins Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6940.',
      highlights: [
        'Marlins Single-A affiliate',
        'Historic venue since 1998',
        'Family-friendly atmosphere',
        'Jupiter community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6940 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 347 }
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
      local: ['Jupiter favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Jupiter Hammerheads gear', 'Marlins items'] }
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
        { title: 'Try local food', description: 'Sample Jupiter specialties', category: 'food' },
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
      name: 'Jupiter area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6940 Stadium Way, Jupiter, Florida',
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
        { year: 1998, event: 'Stadium opens' },
        { year: 2000, event: 'Marlins affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Hammerheads Mascot', description: 'Beloved team mascot' },
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
  'lakeland-flying-tigers': {
    id: 'lakeland-flying-tigers',
    name: 'Publix Field at Joker Marchant Stadium',
    team: 'Lakeland Flying Tigers',
    opened: 1966,
    capacity: 8500,
    overview: {
      description: 'Publix Field at Joker Marchant Stadium in Lakeland, Florida, home of the Lakeland Flying Tigers, serves as the Tigers Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 8500.',
      highlights: [
        'Tigers Single-A affiliate',
        'Historic venue since 1966',
        'Family-friendly atmosphere',
        'Lakeland community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 8500',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 425 }
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
      local: ['Lakeland favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Lakeland Flying Tigers gear', 'Tigers items'] }
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
        { title: 'Try local food', description: 'Sample Lakeland specialties', category: 'food' },
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
      name: 'Lakeland area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '8500 Stadium Way, Lakeland, Florida',
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
        { year: 1966, event: 'Stadium opens' },
        { year: 1968, event: 'Tigers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Tigers Mascot', description: 'Beloved team mascot' },
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
  'palm-beach-cardinals': {
    id: 'palm-beach-cardinals',
    name: 'Roger Dean Chevrolet Stadium',
    team: 'Palm Beach Cardinals',
    opened: 1998,
    capacity: 6940,
    overview: {
      description: 'Roger Dean Chevrolet Stadium in Jupiter, Florida, home of the Palm Beach Cardinals, serves as the Cardinals Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6940.',
      highlights: [
        'Cardinals Single-A affiliate',
        'Historic venue since 1998',
        'Family-friendly atmosphere',
        'Jupiter community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6940 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 347 }
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
      local: ['Jupiter favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Palm Beach Cardinals gear', 'Cardinals items'] }
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
        { title: 'Try local food', description: 'Sample Jupiter specialties', category: 'food' },
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
      name: 'Jupiter area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6940 Stadium Way, Jupiter, Florida',
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
        { year: 1998, event: 'Stadium opens' },
        { year: 2000, event: 'Cardinals affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
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
  'st-lucie-mets': {
    id: 'st-lucie-mets',
    name: 'Clover Park',
    team: 'St. Lucie Mets',
    opened: 1988,
    capacity: 7000,
    overview: {
      description: 'Clover Park in Port St. Lucie, Florida, home of the St. Lucie Mets, serves as the Mets Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7000.',
      highlights: [
        'Mets Single-A affiliate',
        'Historic venue since 1988',
        'Family-friendly atmosphere',
        'Port St. Lucie community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 7000 seat capacity',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 350 }
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
      local: ['Port St. Lucie favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['St. Lucie Mets gear', 'Mets items'] }
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
        { title: 'Try local food', description: 'Sample Port St. Lucie specialties', category: 'food' },
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
      name: 'Port St. Lucie area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7000 Stadium Way, Port St. Lucie, Florida',
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
        { year: 1988, event: 'Stadium opens' },
        { year: 1990, event: 'Mets affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Mets Mascot', description: 'Beloved team mascot' },
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
  'tampa-tarpons': {
    id: 'tampa-tarpons',
    name: 'George M. Steinbrenner Field',
    team: 'Tampa Tarpons',
    opened: 1996,
    capacity: 11076,
    overview: {
      description: 'George M. Steinbrenner Field in Tampa, Florida, home of the Tampa Tarpons, serves as the Yankees Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 11076.',
      highlights: [
        'Yankees Single-A affiliate',
        'Historic venue since 1996',
        'Family-friendly atmosphere',
        'Tampa community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 11076',
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
          { name: 'Picnic Area', description: 'Group area', capacity: 553 }
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
      local: ['Tampa favorites', 'Regional craft beers', 'Florida BBQ'],
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
        { location: 'Main concourse', exclusive: ['Tampa Tarpons gear', 'Yankees items'] }
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
        { title: 'Try local food', description: 'Sample Tampa specialties', category: 'food' },
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
      name: 'Tampa area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '11076 Stadium Way, Tampa, Florida',
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
        { year: 1998, event: 'Yankees affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Tarpons Mascot', description: 'Beloved team mascot' },
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
  'fresno-grizzlies': {
    id: 'fresno-grizzlies',
    name: 'Chukchansi Park',
    team: 'Fresno Grizzlies',
    opened: 2002,
    capacity: 10650,
    overview: {
      description: 'Chukchansi Park in Fresno, California, home of the Fresno Grizzlies, serves as the Rockies Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 10650.',
      highlights: [
        'Rockies Single-A affiliate',
        'Modern facility built in 2002',
        'Family-friendly atmosphere',
        'Fresno community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 10650',
        'Group party areas',
        'Scenic California setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 532 }
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
      local: ['Fresno favorites', 'Regional craft beers', 'California BBQ'],
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
        { location: 'Main concourse', exclusive: ['Fresno Grizzlies gear', 'Rockies items'] }
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
        { title: 'Try local food', description: 'Sample Fresno specialties', category: 'food' },
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
      name: 'Fresno area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '10650 Stadium Way, Fresno, California',
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
        { year: 2004, event: 'Rockies affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: 'Grizzlies Mascot', description: 'Beloved team mascot' },
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
  'inland-empire-66ers': {
    id: 'inland-empire-66ers',
    name: 'San Manuel Stadium',
    team: 'Inland Empire 66ers',
    opened: 1996,
    capacity: 8000,
    overview: {
      description: 'San Manuel Stadium in San Bernardino, California, home of the Inland Empire 66ers, serves as the Angels Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 8000.',
      highlights: [
        'Angels Single-A affiliate',
        'Historic venue since 1996',
        'Family-friendly atmosphere',
        'San Bernardino community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 8000',
        'Group party areas',
        'Scenic California setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 400 }
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
      local: ['San Bernardino favorites', 'Regional craft beers', 'California BBQ'],
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
        { location: 'Main concourse', exclusive: ['Inland Empire 66ers gear', 'Angels items'] }
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
        { title: 'Try local food', description: 'Sample San Bernardino specialties', category: 'food' },
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
      name: 'San Bernardino area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '8000 Stadium Way, San Bernardino, California',
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
        { year: 1998, event: 'Angels affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Electric atmosphere',
      mascot: { name: '66ers Mascot', description: 'Beloved team mascot' },
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
  'lake-elsinore-storm': {
    id: 'lake-elsinore-storm',
    name: 'Lake Elsinore Diamond',
    team: 'Lake Elsinore Storm',
    opened: 1994,
    capacity: 7866,
    overview: {
      description: 'Lake Elsinore Diamond in Lake Elsinore, California, home of the Lake Elsinore Storm, serves as the Padres Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 7866.',
      highlights: [
        'Padres Single-A affiliate',
        'Historic venue since 1994',
        'Family-friendly atmosphere',
        'Lake Elsinore community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Large capacity of 7866',
        'Group party areas',
        'Scenic California setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 393 }
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
      local: ['Lake Elsinore favorites', 'Regional craft beers', 'California BBQ'],
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
        { location: 'Main concourse', exclusive: ['Lake Elsinore Storm gear', 'Padres items'] }
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
        { title: 'Try local food', description: 'Sample Lake Elsinore specialties', category: 'food' },
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
      name: 'Lake Elsinore area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '7866 Stadium Way, Lake Elsinore, California',
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
      mascot: { name: 'Storm Mascot', description: 'Beloved team mascot' },
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
  'modesto-nuts': {
    id: 'modesto-nuts',
    name: 'John Thurman Field',
    team: 'Modesto Nuts',
    opened: 1955,
    capacity: 4000,
    overview: {
      description: 'John Thurman Field in Modesto, California, home of the Modesto Nuts, serves as the Mariners Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 4000.',
      highlights: [
        'Mariners Single-A affiliate',
        'Historic venue since 1955',
        'Family-friendly atmosphere',
        'Modesto community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4000 seat capacity',
        'Group party areas',
        'Scenic California setting'
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
      local: ['Modesto favorites', 'Regional craft beers', 'California BBQ'],
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
        { location: 'Main concourse', exclusive: ['Modesto Nuts gear', 'Mariners items'] }
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
        { title: 'Try local food', description: 'Sample Modesto specialties', category: 'food' },
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
      name: 'Modesto area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4000 Stadium Way, Modesto, California',
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
        { year: 1955, event: 'Stadium opens' },
        { year: 1957, event: 'Mariners affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Nuts Mascot', description: 'Beloved team mascot' },
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
  'rancho-cucamonga-quakes': {
    id: 'rancho-cucamonga-quakes',
    name: 'LoanMart Field',
    team: 'Rancho Cucamonga Quakes',
    opened: 1993,
    capacity: 6615,
    overview: {
      description: 'LoanMart Field in Rancho Cucamonga, California, home of the Rancho Cucamonga Quakes, serves as the Dodgers Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 6615.',
      highlights: [
        'Dodgers Single-A affiliate',
        'Historic venue since 1993',
        'Family-friendly atmosphere',
        'Rancho Cucamonga community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 6615 seat capacity',
        'Group party areas',
        'Scenic California setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 330 }
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
      local: ['Rancho Cucamonga favorites', 'Regional craft beers', 'California BBQ'],
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
        { location: 'Main concourse', exclusive: ['Rancho Cucamonga Quakes gear', 'Dodgers items'] }
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
        { title: 'Try local food', description: 'Sample Rancho Cucamonga specialties', category: 'food' },
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
      name: 'Rancho Cucamonga area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '6615 Stadium Way, Rancho Cucamonga, California',
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
        { year: 1995, event: 'Dodgers affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Quakes Mascot', description: 'Beloved team mascot' },
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
  'san-jose-giants': {
    id: 'san-jose-giants',
    name: 'Excite Ballpark',
    team: 'San Jose Giants',
    opened: 1942,
    capacity: 4200,
    overview: {
      description: 'Excite Ballpark in San Jose, California, home of the San Jose Giants, serves as the Giants Single-A affiliate. This classic ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 4200.',
      highlights: [
        'Giants Single-A affiliate',
        'Historic venue since 1942',
        'Family-friendly atmosphere',
        'San Jose community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 4200 seat capacity',
        'Group party areas',
        'Scenic California setting'
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
          { name: 'Picnic Area', description: 'Group area', capacity: 210 }
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
      local: ['San Jose favorites', 'Regional craft beers', 'California BBQ'],
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
        { location: 'Main concourse', exclusive: ['San Jose Giants gear', 'Giants items'] }
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
        { title: 'Try local food', description: 'Sample San Jose specialties', category: 'food' },
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
      name: 'San Jose area',
      description: 'Traditional ballpark neighborhood',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '4200 Stadium Way, San Jose, California',
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
        { year: 1942, event: 'Stadium opens' },
        { year: 1944, event: 'Giants affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Giants Mascot', description: 'Beloved team mascot' },
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
  'stockton-ports': {
    id: 'stockton-ports',
    name: 'Banner Island Ballpark',
    team: 'Stockton Ports',
    opened: 2005,
    capacity: 5200,
    overview: {
      description: 'Banner Island Ballpark in Stockton, California, home of the Stockton Ports, serves as the Athletics Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 5200.',
      highlights: [
        'Athletics Single-A affiliate',
        'Modern facility built in 2005',
        'Family-friendly atmosphere',
        'Stockton community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 5200 seat capacity',
        'Group party areas',
        'Scenic California setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 260 }
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
      local: ['Stockton favorites', 'Regional craft beers', 'California BBQ'],
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
        { location: 'Main concourse', exclusive: ['Stockton Ports gear', 'Athletics items'] }
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
        { title: 'Try local food', description: 'Sample Stockton specialties', category: 'food' },
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
      name: 'Stockton area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '5200 Stadium Way, Stockton, California',
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
        { year: 2007, event: 'Athletics affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Ports Mascot', description: 'Beloved team mascot' },
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
  'visalia-rawhide': {
    id: 'visalia-rawhide',
    name: 'Valley Strong Ballpark',
    team: 'Visalia Rawhide',
    opened: 2009,
    capacity: 2468,
    overview: {
      description: 'Valley Strong Ballpark in Visalia, California, home of the Visalia Rawhide, serves as the Diamondbacks Single-A affiliate. This modern ballpark offers an intimate Minor League Baseball experience with traditional amenities and a capacity of 2468.',
      highlights: [
        'Diamondbacks Single-A affiliate',
        'Modern facility built in 2009',
        'Family-friendly atmosphere',
        'Visalia community centerpiece',
        'Convenient location'
      ],
      uniqueFeatures: [
        'Well-maintained facility',
        'Local food specialties',
        'Intimate 2468 seat capacity',
        'Group party areas',
        'Scenic California setting'
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
          { name: 'Party Deck', description: 'Group area', capacity: 123 }
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
      local: ['Visalia favorites', 'Regional craft beers', 'California BBQ'],
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
        { location: 'Main concourse', exclusive: ['Visalia Rawhide gear', 'Diamondbacks items'] }
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
        { title: 'Try local food', description: 'Sample Visalia specialties', category: 'food' },
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
      name: 'Visalia area',
      description: 'Urban setting with dining options',
      beforeGame: ['Local restaurants', 'Sports bars', 'Parks'],
      afterGame: ['Nightlife district', 'Family restaurants'],
      radius: '0.5 mile walk'
    },
    transportation: {
      address: '2468 Stadium Way, Visalia, California',
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
        { year: 2011, event: 'Diamondbacks affiliation begins' },
        { year: 2020, event: 'Major renovations completed' }
      ],
      traditions: [
        { name: 'Seventh inning stretch', description: 'Local traditions' },
        { name: 'Mascot race', description: 'Fan favorite between innings' }
      ]
    },
    fanExperience: {
      atmosphere: 'Intimate and friendly',
      mascot: { name: 'Rawhide Mascot', description: 'Beloved team mascot' },
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