import { StadiumGuide } from '../stadiumGuides';

export const aaaStadiumGuides5: Record<string, StadiumGuide> = {
  'norfolk-tides': {
    id: 'norfolk-tides',
    name: 'Harbor Park',
    team: 'Norfolk Tides',
    opened: 1993,
    capacity: 12067,
    
    overview: {
      description: 'Harbor Park sits on the Elizabeth River waterfront in downtown Norfolk, consistently rated as one of the best minor league stadiums with its scenic views and modern amenities.',
      highlights: [
        'Waterfront location on Elizabeth River',
        'Rated best minor league stadium by Baseball America',
        '225-seat full-service restaurant',
        'Downtown Norfolk location'
      ],
      uniqueFeatures: [
        'Elizabeth River views',
        'Hits at the Park restaurant',
        'Nautical-themed design',
        'Free ferry service to games'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck sections', 'Suite level', 'Third base side'],
        afternoon: ['Upper reserved sections', 'Luxury boxes', 'Restaurant seating'],
        evening: ['Most sections shaded', 'First base side cooler', 'Upper deck optimal']
      },
      coveredSeating: ['Hits at the Park restaurant', 'Luxury skyboxes', 'Upper deck overhang'],
      shadeTips: [
        'Upper deck provides shade for lower sections',
        'Third base side best for afternoon',
        'Restaurant seating fully covered',
        'Waterfront breeze helps cooling'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Hits at the Park restaurant', 'Luxury suites', 'Club areas']
      },
      worstSunExposure: ['Lower box seats afternoon', 'First base side early game', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 70, rainChance: 25, typicalConditions: 'Mild with breeze', shadeTip: 'Waterfront can be cool' },
        { month: 'May', avgTemp: 71, avgHumidity: 72, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Perfect weather, any seat' },
        { month: 'June', avgTemp: 79, avgHumidity: 74, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Seek upper deck shade' },
        { month: 'July', avgTemp: 83, avgHumidity: 76, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Restaurant or suites best' },
        { month: 'August', avgTemp: 82, avgHumidity: 77, rainChance: 35, typicalConditions: 'Very humid', shadeTip: 'Evening games recommended' },
        { month: 'September', avgTemp: 76, avgHumidity: 75, rainChance: 30, typicalConditions: 'Still warm', shadeTip: 'Upper deck or third base' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Hits at the Park', perks: ['Full restaurant', '225 seats', 'Climate controlled'], access: 'Restaurant entrance' }
        ],
        suites: { 
          levels: ['Luxury Skyboxes'],
          amenities: ['Climate control', 'Private restrooms', 'Catering', 'TVs']
        }
      },
      budgetOptions: ['General admission', 'Outfield seats', 'Upper reserved'],
      familySections: ['Family seating areas', 'Lawn areas'],
      tips: [
        { section: 'Restaurant', tip: 'Full service dining with game view', category: 'experience' },
        { section: 'Upper deck', tip: 'Best shade and breeze', category: 'shade' },
        { section: 'Lower box', tip: 'Close to action but hot', category: 'view' }
      ]
    },
    
    concessions: {
      signature: [
        'Grilled Pretzels (unique preparation)',
        'Virginia seafood selections',
        'Ynot Pizza',
        'Local craft beers'
      ],
      local: [
        'Norfolk/Virginia Beach specialties',
        'Seafood options',
        'Regional craft breweries'
      ],
      alcohol: {
        beer: ['Local craft selections', 'Domestic options'],
        wine: true,
        cocktails: true
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '1-5 minutes', price: '$5-10', shadedSpots: false, covered: false },
        { name: 'Downtown Garages', distance: '5-10 minutes', price: 'Varies', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['The Tide light rail - free with game ticket', 'Free ferry service from Portsmouth'],
        rideShare: 'Downtown pickup locations'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Park Avenue', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Tides gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces available'
    },
    
    gameDay: {
      tips: [
        { title: 'Free Ferry', description: 'Take ferry from Portsmouth', category: 'arrival' },
        { title: 'Light Rail', description: 'Free with game ticket', category: 'arrival' },
        { title: 'Restaurant Seats', description: 'Book early for AC dining', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '6:35 PM (weekdays), 6:35 PM (Saturday), 1:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Norfolk',
      description: 'Located on the Elizabeth River waterfront in downtown Norfolk with nearby dining and entertainment.',
      beforeGame: ['Waterside District', 'Downtown Norfolk restaurants'],
      afterGame: ['Granby Street nightlife', 'Waterside District'],
      radius: 'Walking distance to downtown'
    },
    
    transportation: {
      address: '150 Park Avenue, Norfolk, VA 23510',
      publicTransit: {
        train: [{ lines: ['The Tide light rail'], station: 'Harbor Park', walkTime: '0 minutes' }]
      },
      driving: {
        majorRoutes: ['I-264', 'US-460', 'I-64'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'I-264 to Waterside Drive'
      },
      rideShare: {
        pickupZone: 'Park Avenue',
        dropoffZone: 'Main entrance',
        surgePricing: 'Light to moderate'
      }
    },
    
    history: {
      timeline: [
        { year: 1993, event: 'Stadium opens' },
        { year: 1993, event: 'Rated best new ballpark' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Scenic waterfront setting with nautical theme',
      bestExperiences: ['Waterfront views', 'Restaurant dining', 'Ferry arrival'],
      traditions: ['Naval heritage nights', 'Tides traditions']
    },
    
    proTips: {
      insiderTips: [
        'Free ferry from Portsmouth',
        'Light rail free with ticket',
        'Restaurant books quickly',
        'Waterfront breeze helps with heat'
      ],
      avoidThese: ['Lower seats in afternoon sun', 'Driving when ferry available'],
      hiddenGems: ['Hits at the Park restaurant', 'Upper deck views'],
      photoSpots: ['Waterfront views', 'Downtown skyline'],
      bestValue: ['Upper reserved', 'Ferry transport', 'Free light rail']
    }
  },

  'omaha-storm-chasers': {
    id: 'omaha-storm-chasers',
    name: 'Werner Park',
    team: 'Omaha Storm Chasers',
    opened: 2011,
    capacity: 9023,
    
    overview: {
      description: 'Werner Park in Papillion serves as a multi-use facility hosting both the Storm Chasers and Union Omaha soccer, featuring a 360-degree concourse and extensive grass berm seating.',
      highlights: [
        'Multi-use facility (baseball and soccer)',
        '360-degree walkable concourse',
        'Extensive grass berm seating',
        'Prairie Flower Casino Club'
      ],
      uniqueFeatures: [
        'Shared with Union Omaha soccer',
        'Large grass berm in outfield',
        'Two-story Prairie Flower Casino Club',
        'Modern amenities opened 2011'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper reserved sections', 'Suite level', 'Third base side'],
        afternoon: ['Prairie Flower Casino Club', 'Luxury suites', 'Upper deck areas'],
        evening: ['Most sections shaded', 'First base cooler', 'Berm gets shade']
      },
      coveredSeating: ['Prairie Flower Casino Club', 'Luxury suites', 'Some upper deck overhang'],
      shadeTips: [
        'Prairie Flower Club is climate controlled',
        'Upper deck provides some shade',
        'Grass berm has no shade coverage',
        'Third base side best for afternoon'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse'],
        indoorAreas: ['Prairie Flower Casino Club', 'Suites', 'Indoor concessions']
      },
      worstSunExposure: ['Grass berm', 'Lower box seats', 'First base afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 65, rainChance: 30, typicalConditions: 'Variable spring', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 69, avgHumidity: 68, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Any seat comfortable' },
        { month: 'June', avgTemp: 79, avgHumidity: 70, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 84, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot summer', shadeTip: 'Club or upper deck' },
        { month: 'August', avgTemp: 82, avgHumidity: 72, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 74, avgHumidity: 68, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Pleasant evenings' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Prairie Flower Casino Club', perks: ['Two stories', 'Indoor/outdoor seating', 'Climate controlled'], access: 'Club entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'Grass Berm', description: 'Large outfield grass area for blankets' }
        ]
      },
      budgetOptions: ['Grass berm', 'General admission', 'Upper reserved'],
      familySections: ['Family areas', 'Grass berm perfect for kids'],
      tips: [
        { section: 'Grass Berm', tip: 'Bring blankets, great for families', category: 'value' },
        { section: 'Prairie Flower Club', tip: 'Best amenities and AC', category: 'experience' },
        { section: 'Upper reserved', tip: 'Good value with some shade', category: 'value' }
      ]
    },
    
    concessions: {
      signature: [
        'Oak View Group concessions',
        'Midwest specialties',
        'Gluten-free options at The Show'
      ],
      local: [
        'Nebraska beef',
        'Local craft beers',
        'Midwest favorites'
      ],
      alcohol: {
        beer: ['Local craft selections', 'Domestic options'],
        wine: true,
        cocktails: true
      }
    },
    
    parking: {
      lots: [
        { name: 'Gravel Lot', distance: '3-5 minutes', price: 'Free', shadedSpots: false, covered: false },
        { name: 'Paved Lots', distance: '1-3 minutes', price: '$5', shadedSpots: false, covered: false }
      ]
    },
    
    gates: [
      { name: 'Main Gate', location: 'Highway 370', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Storm Chasers gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates'],
      kidZones: [{ name: 'Kids Area', location: 'Outfield', activities: ['Playground'] }]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Club and suite levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces in paved lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Free Parking', description: 'Gravel lot is free', category: 'arrival' },
        { title: 'Berm Seating', description: 'Bring blankets and chairs', category: 'experience' },
        { title: 'Multi-Use Venue', description: 'Check for soccer conflicts', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM (weekdays), 6:05 PM (Saturday), 2:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Papillion',
      description: 'Located in suburban Papillion, about 10 miles southwest of downtown Omaha.',
      beforeGame: ['Papillion restaurants', 'Shadow Lake shopping'],
      afterGame: ['Local dining', 'Downtown Omaha (15 minutes)'],
      radius: '2-3 miles to dining'
    },
    
    transportation: {
      address: '12356 Ballpark Way, Papillion, NE 68046',
      publicTransit: {},
      driving: {
        majorRoutes: ['Highway 370', 'I-80', 'Highway 50'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'Highway 370 to Ballpark Way'
      },
      rideShare: {
        pickupZone: 'Main entrance area',
        dropoffZone: 'Main gate',
        surgePricing: 'Light after games'
      }
    },
    
    history: {
      timeline: [
        { year: 2011, event: 'Stadium opens' },
        { year: 2020, event: 'Union Omaha begins sharing facility' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly suburban ballpark with modern amenities',
      bestExperiences: ['Grass berm relaxation', 'Prairie Flower Club', '360-degree concourse walk'],
      traditions: ['Storm Chasers weather theme', 'Family-friendly promotions']
    },
    
    proTips: {
      insiderTips: [
        'Free parking in gravel lot',
        'Berm great for families',
        'Prairie Flower Club worth upgrade',
        'Check soccer schedule for conflicts'
      ],
      avoidThese: ['Berm on hot days without shade', 'Lower seats in afternoon'],
      hiddenGems: ['360-degree concourse views', 'Prairie Flower Club'],
      photoSpots: ['From grass berm', 'Concourse views'],
      bestValue: ['Free parking', 'Grass berm seating', 'Family deals']
    }
  },

  'rochester-red-wings': {
    id: 'rochester-red-wings',
    name: 'Innovative Field',
    team: 'Rochester Red Wings',
    opened: 1997,
    capacity: 10840,
    
    overview: {
      description: 'Innovative Field in downtown Rochester features a unique peanut/tree nut aware seating section and is completely cashless, offering modern amenities in a classic ballpark setting.',
      highlights: [
        'Downtown Rochester location',
        'Peanut/tree nut aware seating section',
        'Completely cashless facility',
        'Recently renamed from Frontier Field'
      ],
      uniqueFeatures: [
        'Allergen-aware seating area',
        'Downtown skyline views',
        'Cashless payments only',
        'Modern amenities in classic design'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper level sections', 'Third base side', 'Suite level'],
        afternoon: ['Upper deck overhang areas', 'Luxury suites', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'Upper level best']
      },
      coveredSeating: ['Suite level', 'Upper deck overhang sections', 'Some concourse areas'],
      shadeTips: [
        'Upper level provides shade below',
        'Third base side for afternoon',
        'Limited covered seating overall',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Suites', 'Club areas', 'Indoor concessions']
      },
      worstSunExposure: ['Field level seats', 'First base afternoon', 'Bleacher sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool and variable', shadeTip: 'Sun often welcome' },
        { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 30, typicalConditions: 'Mild spring', shadeTip: 'Pleasant weather' },
        { month: 'June', avgTemp: 73, avgHumidity: 68, rainChance: 30, typicalConditions: 'Comfortable', shadeTip: 'Shade for afternoon' },
        { month: 'July', avgTemp: 78, avgHumidity: 70, rainChance: 28, typicalConditions: 'Warm summer', shadeTip: 'Upper deck recommended' },
        { month: 'August', avgTemp: 76, avgHumidity: 72, rainChance: 28, typicalConditions: 'Warm and humid', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 68, avgHumidity: 70, rainChance: 28, typicalConditions: 'Cooling down', shadeTip: 'Perfect baseball weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'Peanut/Nut Aware Section', description: 'Allergen-free seating area' }
        ]
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Upper reserved'],
      familySections: ['Family seating areas', 'Allergen-aware section'],
      tips: [
        { section: 'Allergen-aware', tip: 'Perfect for those with nut allergies', category: 'family' },
        { section: 'Upper level', tip: 'Best shade and value', category: 'value' },
        { section: 'Field level', tip: 'Close to action but exposed', category: 'view' }
      ]
    },
    
    concessions: {
      signature: [
        'Zweigle\'s hot dogs (Rochester specialty)',
        'Beef on Weck',
        'Altobelli\'s Deli',
        'Local craft beers'
      ],
      local: [
        'Rochester specialties',
        'Upstate New York favorites',
        'Genesee Brewery selections'
      ],
      alcohol: {
        beer: ['Genesee Brewery', 'Local craft beers', 'Domestic options'],
        wine: true,
        cocktails: true
      }
    },
    
    parking: {
      lots: [
        { name: 'Lots C & D', distance: '2-5 minutes', price: '$7 plus tax', shadedSpots: false, covered: false, tip: 'Cashless only' },
        { name: 'Street Parking', distance: 'Varies', price: 'Metered', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        rideShare: 'Downtown pickup locations'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Morrie Silver Way', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Red Wings gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates']
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces in Lots C & D'
    },
    
    gameDay: {
      tips: [
        { title: 'Cashless Only', description: 'Bring cards or mobile pay', category: 'arrival' },
        { title: 'Allergen Section', description: 'Book early if needed', category: 'family' },
        { title: 'Downtown Location', description: 'Many dining options nearby', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '6:05 PM (weekdays), 6:05 PM (Saturday), 1:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Rochester',
      description: 'Located in downtown Rochester near the High Falls entertainment district.',
      beforeGame: ['High Falls restaurants', 'Downtown dining'],
      afterGame: ['East End entertainment', 'Downtown nightlife'],
      radius: 'Walking distance to downtown'
    },
    
    transportation: {
      address: '1 Morrie Silver Way, Rochester, NY 14608',
      publicTransit: {
        bus: [{ routes: ['RTS routes'], stops: ['Downtown stops'] }]
      },
      driving: {
        majorRoutes: ['I-490', 'I-390', 'Route 104'],
        typicalTraffic: 'Downtown congestion on game days',
        bestApproach: 'I-490 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Designated areas',
        dropoffZone: 'Main entrance',
        surgePricing: 'Moderate after games'
      }
    },
    
    history: {
      timeline: [
        { year: 1997, event: 'Stadium opens as Frontier Field' },
        { year: 2020, event: 'Renamed Innovative Field' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Classic downtown ballpark with modern touches',
      bestExperiences: ['Downtown skyline views', 'Zweigle\'s hot dogs', 'Allergen-free seating'],
      traditions: ['Plate racing', 'Rochester baseball heritage']
    },
    
    proTips: {
      insiderTips: [
        'Completely cashless - plan ahead',
        'Zweigle\'s are must-try local dogs',
        'Allergen section unique feature',
        'Downtown has many pre-game options'
      ],
      avoidThese: ['Field level in afternoon sun', 'Forgetting cashless policy'],
      hiddenGems: ['Altobelli\'s Deli', 'Upper deck value seats'],
      photoSpots: ['Downtown skyline views', 'Main entrance'],
      bestValue: ['Upper reserved', 'Downtown dining combo']
    }
  },

  'scranton-railriders': {
    id: 'scranton-railriders',
    name: 'PNC Field',
    team: 'Scranton/Wilkes-Barre RailRiders',
    opened: 1989,
    capacity: 10000,
    
    overview: {
      description: 'PNC Field underwent a $40+ million reconstruction in 2013, transforming it into a modern facility while maintaining its charm as the Yankees Triple-A affiliate home.',
      highlights: [
        '$40+ million reconstruction (2013)',
        'Yankees Triple-A affiliate',
        'Grass berms for families',
        'Mountain views'
      ],
      uniqueFeatures: [
        'Completely rebuilt in 2013',
        'Pocono Mountain backdrop',
        'Modern amenities',
        'Family-friendly grass areas'
      ],
      renovations: [
        { year: 2013, description: '$40+ million complete reconstruction' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper level sections', 'Third base side', 'Suite areas'],
        afternoon: ['Upper deck areas', 'Luxury suites', 'Some concourse coverage'],
        evening: ['Most sections shaded', 'First base cooler', 'Berms get shade']
      },
      coveredSeating: ['Luxury suites', 'Some upper deck overhang', 'Limited coverage'],
      shadeTips: [
        'Upper level best for shade',
        'Grass berms have no coverage',
        'Third base side for afternoon',
        'Mountain backdrop blocks some sun'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Suites', 'Club areas', 'Indoor concessions']
      },
      worstSunExposure: ['Grass berms', 'Field box seats', 'First base afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 54, avgHumidity: 62, rainChance: 30, typicalConditions: 'Cool mountain spring', shadeTip: 'Dress warmly' },
        { month: 'May', avgTemp: 65, avgHumidity: 65, rainChance: 32, typicalConditions: 'Mild', shadeTip: 'Pleasant weather' },
        { month: 'June', avgTemp: 74, avgHumidity: 68, rainChance: 32, typicalConditions: 'Comfortable', shadeTip: 'Shade for day games' },
        { month: 'July', avgTemp: 78, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm summer', shadeTip: 'Upper deck best' },
        { month: 'August', avgTemp: 77, avgHumidity: 72, rainChance: 28, typicalConditions: 'Warm and humid', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 69, avgHumidity: 70, rainChance: 28, typicalConditions: 'Cooling down', shadeTip: 'Perfect weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'Grass Berms', description: 'Family-friendly lawn seating' }
        ]
      },
      budgetOptions: ['Grass berms', 'General admission', 'Upper reserved'],
      familySections: ['Grass berms', 'Family seating areas'],
      tips: [
        { section: 'Grass Berms', tip: 'Great for families with kids', category: 'family' },
        { section: 'Upper level', tip: 'Best shade coverage', category: 'shade' },
        { section: 'Field boxes', tip: 'Close but exposed to sun', category: 'view' }
      ]
    },
    
    concessions: {
      signature: [
        'Traditional ballpark fare',
        'Pennsylvania specialties',
        'Local favorites'
      ],
      local: [
        'NEPA regional foods',
        'Local craft beers',
        'Pennsylvania Dutch treats'
      ],
      alcohol: {
        beer: ['Yuengling', 'Local craft selections', 'Domestic options'],
        wine: true,
        cocktails: true
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '2-5 minutes', price: '$5-8', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['COLTS Bus Route 9 from downtown Scranton']
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Montage Mountain Road', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['RailRiders/Yankees gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates'],
      kidZones: [{ name: 'Kids Area', location: 'Behind berms', activities: ['Playground'] }]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces available'
    },
    
    gameDay: {
      tips: [
        { title: 'Yankees Affiliate', description: 'Popular rehab assignments', category: 'experience' },
        { title: 'Grass Berms', description: 'Bring blankets', category: 'family' },
        { title: 'Mountain Views', description: 'Enjoy the scenery', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '6:35 PM (weekdays), 6:05 PM (Saturday), 1:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Moosic',
      description: 'Located in Moosic near Montage Mountain, between Scranton and Wilkes-Barre.',
      beforeGame: ['Local restaurants on Birney Avenue', 'Montage Mountain area'],
      afterGame: ['Downtown Scranton (10 minutes)', 'Wilkes-Barre options'],
      radius: '5-10 minutes to dining'
    },
    
    transportation: {
      address: '235 Montage Mountain Road, Moosic, PA 18507',
      publicTransit: {
        bus: [{ routes: ['COLTS Route 9'], stops: ['PNC Field'] }]
      },
      driving: {
        majorRoutes: ['I-81', 'I-380', 'Route 315'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'I-81 to Montage Mountain Road exit'
      },
      rideShare: {
        pickupZone: 'Main entrance area',
        dropoffZone: 'Main gate',
        surgePricing: 'Light to moderate'
      }
    },
    
    history: {
      timeline: [
        { year: 1989, event: 'Stadium opens' },
        { year: 2013, event: '$40+ million reconstruction completed' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly with Yankees connection and mountain views',
      bestExperiences: ['Yankees rehab assignments', 'Mountain backdrop', 'Grass berm relaxation'],
      traditions: ['RailRiders train theme', 'Yankees heritage']
    },
    
    proTips: {
      insiderTips: [
        'Check for Yankees rehab starts',
        'Berms great for families',
        'Mountain views from upper deck',
        'Affordable family entertainment'
      ],
      avoidThese: ['Berms without shade on hot days', 'Field level in afternoon'],
      hiddenGems: ['Mountain views', 'Modern amenities post-renovation'],
      photoSpots: ['Mountain backdrop', 'Main entrance'],
      bestValue: ['Grass berms', 'Upper reserved', 'Family packs']
    }
  },

  'st-paul-saints': {
    id: 'st-paul-saints',
    name: 'CHS Field',
    team: 'St. Paul Saints',
    opened: 2015,
    capacity: 7210,
    
    overview: {
      description: 'CHS Field in the Lowertown District is known as the "Greenest Ballpark in America" with solar panels, rainwater collection, and is the closest Triple-A affiliate to its parent club at just 12.9 miles from Target Field.',
      highlights: [
        'Greenest Ballpark in America',
        'Solar panels and rainwater collection',
        'The Lawn holds 1,000+ fans',
        'Closest Triple-A to parent club (12.9 miles)'
      ],
      uniqueFeatures: [
        'LED lighting throughout',
        'Rainwater collection system',
        'Solar panel array',
        'Historic Lowertown location'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper level sections', 'Third base side', 'Suite level'],
        afternoon: ['Upper deck overhang', 'Luxury suites', 'Third base sections'],
        evening: ['Most sections shaded', 'The Lawn gets shade', 'First base cooler']
      },
      coveredSeating: ['Luxury suites', 'Some upper deck overhang', 'Limited coverage overall'],
      shadeTips: [
        'Upper level provides best shade',
        'The Lawn has no shade until evening',
        'Third base side for afternoon',
        'Limited covered options'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Suites', 'Club areas', 'Treasure Island Club']
      },
      worstSunExposure: ['The Lawn afternoon', 'Field level seats', 'First base side'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 52, avgHumidity: 62, rainChance: 28, typicalConditions: 'Cool and variable', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 64, avgHumidity: 64, rainChance: 32, typicalConditions: 'Spring weather', shadeTip: 'Sun often welcome' },
        { month: 'June', avgTemp: 74, avgHumidity: 68, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Shade for afternoon' },
        { month: 'July', avgTemp: 79, avgHumidity: 70, rainChance: 32, typicalConditions: 'Warm summer', shadeTip: 'Upper deck or evening' },
        { month: 'August', avgTemp: 77, avgHumidity: 72, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Shade essential' },
        { month: 'September', avgTemp: 68, avgHumidity: 70, rainChance: 28, typicalConditions: 'Cooling down', shadeTip: 'Perfect weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Treasure Island Club', perks: ['All-inclusive', 'Climate controlled'], access: 'Club entrance' }
        ],
        suites: { 
          levels: ['Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering']
        },
        specialAreas: [
          { name: 'The Lawn', description: 'Picnic-style grass seating for 1,000+', capacity: 1000 }
        ]
      },
      budgetOptions: ['The Lawn', 'General admission', 'Upper reserved'],
      familySections: ['The Lawn perfect for families', 'Family seating areas'],
      tips: [
        { section: 'The Lawn', tip: 'Bring blankets, arrive early', category: 'value' },
        { section: 'Upper level', tip: 'Best shade and city views', category: 'shade' },
        { section: 'Treasure Island Club', tip: 'All-inclusive experience', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: [
        'Professional Sports Catering',
        'Minnesota specialties',
        'Local craft beers'
      ],
      local: [
        'Twin Cities favorites',
        'Minnesota craft breweries',
        'Local food vendors'
      ],
      alcohol: {
        beer: ['Summit Brewing', 'Surly', 'Local craft selections'],
        wine: true,
        cocktails: true,
        localBreweries: ['Summit', 'Surly', 'Indeed', 'Fulton']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lots', distance: '2-5 minutes', price: '$10-15', shadedSpots: false, covered: false },
        { name: 'Downtown Ramps', distance: '5-10 minutes', price: 'Varies', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['Green Line light rail nearby', 'Multiple bus routes'],
        rideShare: 'Lowertown pickup points',
        bicycle: 'Bike racks and Nice Ride stations'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Broadway Street', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Saints unique merchandise'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates'],
      wifi: { available: true, freeZones: ['Throughout stadium'] }
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['All levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spaces in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Green Features', description: 'Tour the eco-friendly elements', category: 'experience' },
        { title: 'The Lawn', description: 'Arrive early for best spots', category: 'experience' },
        { title: 'Light Rail', description: 'Green Line convenient', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:07 PM (weekdays), 6:07 PM (Saturday), 1:07 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Lowertown District',
      description: 'Located in historic Lowertown St. Paul, surrounded by restaurants, breweries, and the farmers market.',
      beforeGame: ['Lowertown restaurants', 'St. Paul Farmers Market (weekends)', 'Local breweries'],
      afterGame: ['Downtown St. Paul nightlife', 'Lowertown bars'],
      radius: 'Walking distance to everything'
    },
    
    transportation: {
      address: '360 Broadway Street, St. Paul, MN 55101',
      publicTransit: {
        train: [{ lines: ['Green Line'], station: 'Union Depot', walkTime: '5 minutes' }],
        bus: [{ routes: ['Multiple routes'], stops: ['Downtown St. Paul'] }]
      },
      driving: {
        majorRoutes: ['I-94', 'I-35E', 'Highway 52'],
        typicalTraffic: 'Downtown congestion on game days',
        bestApproach: 'I-94 to downtown St. Paul exits'
      },
      rideShare: {
        pickupZone: 'Broadway Street',
        dropoffZone: 'Main entrance',
        surgePricing: 'Moderate after games'
      }
    },
    
    history: {
      timeline: [
        { year: 2015, event: 'CHS Field opens' },
        { year: 2021, event: 'Saints become Twins Triple-A affiliate' }
      ],
      traditions: [
        { name: 'Pig mascot legacy', description: 'Long history of pig mascots' },
        { name: 'Bill Murray connection', description: 'Part owner and occasional visitor' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Quirky, fun atmosphere with eco-friendly focus',
      bestExperiences: ['The Lawn experience', 'Green tour', 'Downtown location perks'],
      traditions: ['Pig mascots', 'Unique promotions', 'Bill Murray sightings'],
      mascot: { name: 'Mudonna', description: 'Current pig mascot in Saints tradition' }
    },
    
    proTips: {
      insiderTips: [
        'Closest Triple-A to MLB parent',
        'The Lawn fills quickly',
        'Green Line makes arrival easy',
        'Lowertown has great pre-game spots'
      ],
      avoidThese: ['The Lawn without shade midday', 'Driving when light rail available'],
      hiddenGems: ['Eco-friendly features tour', 'Treasure Island Club'],
      photoSpots: ['Downtown skyline views', 'The Lawn', 'Green features'],
      bestValue: ['The Lawn tickets', 'Light rail transport', 'Lowertown dining deals']
    }
  }
};