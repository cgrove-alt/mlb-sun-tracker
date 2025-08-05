import { StadiumGuide } from '../stadiumGuides';

export const aaaStadiumGuides4: Record<string, StadiumGuide> = {
  'gwinnett-stripers': {
    id: 'gwinnett-stripers',
    name: 'Coolray Field',
    team: 'Gwinnett Stripers',
    opened: 2009,
    capacity: 10427,
    
    overview: {
      description: 'Coolray Field, located in Lawrenceville just north of Atlanta, is a modern Triple-A facility featuring a 360-degree concourse, multiple social spaces, and the recently added Coca-Cola Front Porch behind home plate.',
      highlights: [
        '360-degree concourse with continuous field views',
        'Coca-Cola Front Porch (added 2024)',
        'The Bank grass hill seating',
        'Completely cashless venue'
      ],
      uniqueFeatures: [
        '30x40 foot video board',
        'Pontoon Brewing Boathouse',
        'SoFi Super Suite for 100+ guests',
        'Free Wi-Fi in specific areas'
      ],
      renovations: [
        { year: 2024, description: 'Added Coca-Cola Front Porch behind home plate' },
        { year: 2023, description: 'New SoFi Super Suite and Pontoon Brewing Boathouse' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Club level seats', 'Box sections 106-109', 'Under concourse'],
        afternoon: ['Club seats with coverage', 'Third base side boxes', 'Coca-Cola Front Porch'],
        evening: ['Most sections shaded', 'First base side in shade', 'Club level optimal']
      },
      coveredSeating: ['The Club premium seats', '19 luxury suites', 'Coca-Cola Front Porch', 'Pontoon Brewing Boathouse'],
      shadeTips: [
        '360-degree concourse provides continuous shade',
        'Club seats offer best protection',
        'Palm trees provide natural shade on concourse',
        'The Bank hill has no shade coverage'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree main concourse', 'All walkways'],
        indoorAreas: ['Luxury suites', 'The Club', 'Pontoon Brewing Boathouse']
      },
      worstSunExposure: ['The Bank grass hill', 'Right field bleachers', 'Field box seats afternoon'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 65, rainChance: 25, typicalConditions: 'Mild spring weather', shadeTip: 'Afternoon games need shade' },
        { month: 'May', avgTemp: 76, avgHumidity: 68, rainChance: 20, typicalConditions: 'Warm and pleasant', shadeTip: 'Seek shade for day games' },
        { month: 'June', avgTemp: 83, avgHumidity: 70, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Club seats or concourse best' },
        { month: 'July', avgTemp: 86, avgHumidity: 72, rainChance: 30, typicalConditions: 'Peak summer heat', shadeTip: 'Stay under cover' },
        { month: 'August', avgTemp: 85, avgHumidity: 72, rainChance: 25, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games more comfortable' },
        { month: 'September', avgTemp: 79, avgHumidity: 70, rainChance: 20, typicalConditions: 'Still warm', shadeTip: 'Third base side for afternoon' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'The Club', perks: ['Private entrance', 'Covered seating', 'Premium amenities'], access: 'Club entrance' }
        ],
        suites: { 
          levels: ['19 Luxury Suites', 'SoFi Super Suite'],
          amenities: ['Air conditioning', 'Private restrooms', 'Catering', 'TVs']
        },
        specialAreas: [
          { name: 'Coca-Cola Front Porch', description: '1,500 sq ft deck behind home plate', capacity: 50 },
          { name: 'Pontoon Brewing Boathouse', description: 'Social space behind Section 105' }
        ]
      },
      budgetOptions: ['The Bank grass hill', 'General admission lawn', 'Upper reserved sections'],
      familySections: ['Kids Zone in left field', 'Family-friendly seating areas'],
      standingRoom: ['360-degree concourse', 'Behind seating sections'],
      tips: [
        { section: 'Club Seats', tip: 'Best shade and amenities', category: 'shade' },
        { section: 'The Bank', tip: 'Cheapest option but no shade', category: 'value' },
        { section: 'Box 106-109', tip: 'Good shade for afternoon games', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: [
        'Sahlen\'s Premium Smokehouse Hot Dogs',
        'Sweet & Boozy Ice Cream',
        'Walking Tacos from Xolos Cantina',
        'Street Corn'
      ],
      local: [
        'Shiner Bock Bar selections',
        'Pontoon Brewing beers',
        'Georgia craft beers'
      ],
      healthy: ['Salads', 'Veggie options', 'Gluten-free items at select stands'],
      kidsFriendly: ['Traditional ballpark fare', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Shiner Bock', 'Pontoon Brewing', 'Domestic selections'],
        wine: true,
        cocktails: true,
        localBreweries: ['Pontoon Brewing']
      }
    },
    
    parking: {
      lots: [
        { name: 'Main Lot', distance: '2-5 minutes', price: '$12', shadedSpots: false, covered: false, tip: 'Credit card only' },
        { name: 'VIP Lot A', distance: '1-2 minutes', price: '$20', shadedSpots: false, covered: false, tip: 'Rideshare pickup area' }
      ],
      alternativeTransport: {
        rideShare: 'GOHS Rideshare Area in VIP Lot A'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Buford Drive', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Main Team Store', exclusive: ['Stripers gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Cashless venue - ATMs for card loading'],
      wifi: { available: true, network: 'Coolray_Guest', freeZones: ['Select areas'] },
      kidZones: [{ name: 'Kids Zone', location: 'Left field corner', activities: ['Playground', 'Games'] }]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have accessible seating'],
        entrance: 'All gates accessible',
        elevators: ['Suite level access']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated ADA spaces'
    },
    
    gameDay: {
      tips: [
        { title: 'Go Cashless', description: 'Venue is completely cashless', category: 'arrival' },
        { title: 'Early Arrival', description: 'Beat Atlanta traffic', category: 'arrival' },
        { title: 'Club Seats', description: 'Best for hot days', category: 'shade' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM (weekdays), 6:05 PM (Saturday), 1:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Large bags'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Lawrenceville',
      description: 'Located near Mall of Georgia, 40 minutes north of Atlanta with shopping and dining nearby.',
      beforeGame: ['Mall of Georgia dining', 'Local restaurants on Buford Drive'],
      afterGame: ['Mall of Georgia', 'Downtown Lawrenceville'],
      radius: '1-2 miles'
    },
    
    transportation: {
      address: '2500 Buford Drive, Lawrenceville, GA 30043',
      publicTransit: {},
      driving: {
        majorRoutes: ['I-85', 'GA-316', 'US-29'],
        typicalTraffic: 'Heavy from Atlanta during rush hour',
        bestApproach: 'I-85 to GA-20 exit'
      },
      rideShare: {
        pickupZone: 'VIP Lot A',
        dropoffZone: 'Main entrance',
        surgePricing: 'Moderate after games'
      }
    },
    
    history: {
      timeline: [
        { year: 2009, event: 'Stadium opens' },
        { year: 2017, event: 'Rebranded from Gwinnett Braves to Stripers' },
        { year: 2024, event: 'Major renovations including Front Porch' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly suburban ballpark with modern amenities',
      bestExperiences: ['The Bank hill seating', 'Coca-Cola Front Porch', '360-degree concourse walk'],
      traditions: ['Chopper mascot appearances'],
      mascot: { name: 'Chopper', description: 'Friendly Stripers mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Park is completely cashless - bring cards',
        'Club seats worth it for hot days',
        'The Bank is fun but hot',
        'Traffic from Atlanta can be heavy'
      ],
      avoidThese: ['Right field in afternoon sun', 'Arriving late on weekends'],
      hiddenGems: ['Pontoon Brewing Boathouse', 'Coca-Cola Front Porch views'],
      photoSpots: ['Behind home plate', 'The Bank hill', 'With Chopper'],
      bestValue: ['The Bank general admission', 'Group areas']
    }
  },

  'jacksonville-jumbo-shrimp': {
    id: 'jacksonville-jumbo-shrimp',
    name: 'VyStar Ballpark',
    team: 'Jacksonville Jumbo Shrimp',
    opened: 2003,
    capacity: 11000,
    
    overview: {
      description: 'VyStar Ballpark, located in downtown Jacksonville\'s Stadium District, is undergoing the largest renovation since opening with Project NEXT, featuring a new right-field building and enhanced fan amenities.',
      highlights: [
        '$31.8 million Project NEXT renovation (2025)',
        'Unique Tiki Terrace in left field',
        'Downtown location between major venues',
        'HD videoboards throughout'
      ],
      uniqueFeatures: [
        'One-of-a-kind Tiki Terrace',
        'Left-field grass berm',
        'New two-story right-field building',
        'Completely rebuilt clubhouses'
      ],
      renovations: [
        { year: 2025, description: '$31.8M Project NEXT - new right-field building, larger videoboard' },
        { year: 2016, description: '$1.8M Tiki Terrace and suite renovations' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Suite level', 'Tiki Terrace'],
        afternoon: ['Third base side gets shade first', 'Climate-controlled lounge', 'Skyboxes'],
        evening: ['Most sections shaded', 'First base side cooler', 'Berm area shaded']
      },
      coveredSeating: ['12 luxury skyboxes', 'Four skydecks', 'Suite-level lounge', 'Tiki Terrace'],
      shadeTips: [
        'Third base side best for day games',
        'Avoid right field bleachers in afternoon',
        'Palm trees provide concourse shade',
        'Suite level has climate control'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse with palm trees'],
        indoorAreas: ['Suite-level lounge', 'Skyboxes', 'Home Plate Club']
      },
      worstSunExposure: ['Right field bleachers', 'First base side afternoon', 'Grass berm early game'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 75, avgHumidity: 70, rainChance: 20, typicalConditions: 'Warm and pleasant', shadeTip: 'Third base side for afternoon' },
        { month: 'May', avgTemp: 82, avgHumidity: 72, rainChance: 25, typicalConditions: 'Getting hot', shadeTip: 'Seek covered areas' },
        { month: 'June', avgTemp: 88, avgHumidity: 75, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Suite level recommended' },
        { month: 'July', avgTemp: 91, avgHumidity: 76, rainChance: 45, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games better' },
        { month: 'August', avgTemp: 90, avgHumidity: 77, rainChance: 50, typicalConditions: 'Very humid, storms', shadeTip: 'Indoor areas essential' },
        { month: 'September', avgTemp: 85, avgHumidity: 75, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'Third base or covered areas' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Home Plate Club', perks: ['$1.56M renovation', 'Premium dining', 'Climate control'], access: 'Exclusive entrance' }
        ],
        suites: { 
          levels: ['12 Luxury Skyboxes', 'Four Skydecks'],
          amenities: ['Air conditioning', 'Private restrooms', 'Catering', 'TVs']
        },
        specialAreas: [
          { name: 'Tiki Terrace', description: 'Left field corner social area', capacity: 100 },
          { name: 'Groups Area', description: 'Behind home bullpen' }
        ]
      },
      budgetOptions: ['Left field berm', 'General admission', 'Upper reserved'],
      familySections: ['Family seating areas', 'Near playground'],
      standingRoom: ['Concourse areas', 'Social spaces'],
      tips: [
        { section: 'Third base side', tip: 'Best shade for day games', category: 'shade' },
        { section: 'Tiki Terrace', tip: 'Unique social experience', category: 'experience' },
        { section: 'Skyboxes', tip: 'Climate controlled comfort', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: [
        'Boom Boom Shrimp',
        'Shrimp Po\'Boys',
        'Duval Heavy Hitter',
        'Shrimp Quesadillas'
      ],
      local: [
        'Southern Fried Freebird',
        'Sweet Tea-bows',
        'BBQ Pulled Pork',
        'Jacksonville specialties'
      ],
      healthy: ['Salads', 'Grilled options'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Ice cream'],
      alcohol: {
        beer: ['Local craft beers', 'Domestic options'],
        wine: true,
        cocktails: true
      }
    },
    
    parking: {
      lots: [
        { name: 'Multi-level Deck', distance: '1 minute', price: 'Varies', shadedSpots: true, covered: true, tip: 'Directly across from entrance' },
        { name: 'TIAA Bank Lots', distance: '5-10 minutes', price: 'Varies', shadedSpots: false, covered: false },
        { name: 'Jacksonville Fairgrounds', distance: '10 minutes', price: 'Varies', shadedSpots: false, covered: false }
      ],
      streetParking: { available: true, restrictions: 'Downtown meters apply' },
      alternativeTransport: {
        publicTransit: ['Downtown location with bus access'],
        rideShare: 'Multiple pickup points downtown'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'A. Philip Randolph Blvd', bestFor: ['All sections'], openTime: '90 minutes before' },
      { name: 'Center Field Gate', location: 'New for 2025', bestFor: ['Outfield seats'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Main Team Store', exclusive: ['Jumbo Shrimp gear'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates'],
      kidZones: [{ name: 'Playground', location: 'Outfield', activities: ['Play area'] }]
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
        { title: 'Downtown Location', description: 'Many dining options nearby', category: 'arrival' },
        { title: 'Third Base Shade', description: 'Best for afternoon games', category: 'shade' },
        { title: 'Tiki Terrace', description: 'Arrive early for best spots', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM (weekdays), 6:35 PM (Saturday), 3:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Stadium District',
      description: 'Located in downtown Jacksonville between VyStar Veterans Memorial Arena and EverBank Stadium.',
      beforeGame: ['Downtown restaurants', 'Sports bars nearby'],
      afterGame: ['Downtown nightlife', 'Riverside district'],
      radius: 'Walking distance to downtown'
    },
    
    transportation: {
      address: '301 A. Philip Randolph Blvd., Jacksonville, FL 32202',
      publicTransit: {
        bus: [{ routes: ['Downtown routes'], stops: ['Stadium area'] }]
      },
      driving: {
        majorRoutes: ['I-95', 'US-1', 'I-10'],
        typicalTraffic: 'Downtown congestion on game days',
        bestApproach: 'I-95 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Designated areas',
        dropoffZone: 'Main entrance area',
        surgePricing: 'Moderate after games'
      }
    },
    
    history: {
      timeline: [
        { year: 2003, event: 'Stadium opens' },
        { year: 2016, event: 'Major renovations including Tiki Terrace' },
        { year: 2017, event: 'Rebranded to Jumbo Shrimp' },
        { year: 2025, event: '$31.8M Project NEXT renovation' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Fun, quirky atmosphere with shrimp-themed entertainment',
      bestExperiences: ['Tiki Terrace party deck', 'Grass berm relaxation', 'New right-field building'],
      traditions: ['Shrimp racing', 'Jumbo Shrimp merchandise'],
      mascot: { name: 'Southpaw', description: 'Jumbo Shrimp mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Tiki Terrace fills up fast',
        'Downtown location means many food options',
        'Third base side essential for day games',
        'Check out new renovations in 2025'
      ],
      avoidThese: ['Right field bleachers in sun', 'Late arrival downtown'],
      hiddenGems: ['Tiki Terrace experience', 'Grass berm views'],
      photoSpots: ['Tiki Terrace', 'New videoboard', 'Downtown skyline views'],
      bestValue: ['Grass berm seating', 'Group areas']
    }
  },

  'lehigh-valley-ironpigs': {
    id: 'lehigh-valley-ironpigs',
    name: 'Coca-Cola Park',
    team: 'Lehigh Valley IronPigs',
    opened: 2008,
    capacity: 10178,
    
    overview: {
      description: 'Coca-Cola Park in Allentown is consistently rated as having the best food in Minor League Baseball, featuring innovative social spaces like The Bacon Strip and a sloping grass berm in left field.',
      highlights: [
        'Best Food in Minor League Baseball',
        'First standing-room-only social areas',
        'The Bacon Strip behind right field',
        '360-degree concourse'
      ],
      uniqueFeatures: [
        'The Bacon Strip aisle',
        'Sloping grass berm',
        'Multiple pig-themed areas',
        'Tiki Terrace & Oasis'
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections', 'Club seats', 'Back rows any section'],
        afternoon: ['Even-numbered sections (third base)', 'Club level', 'Tiki Terrace'],
        evening: ['Even-numbered sections avoid setting sun', 'Third base optimal', 'Club seats']
      },
      coveredSeating: ['19 luxury suites', 'Capital Blue Tiki Terrace', 'The Pig Pen', 'Club seats'],
      shadeTips: [
        'Third base (even-numbered) sections best',
        'Avoid sections 101-108 for day games',
        'Back rows offer better shade',
        'Club seats provide excellent protection'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree main concourse'],
        indoorAreas: ['Luxury suites', 'Hog Heaven lounge', 'Club areas']
      },
      worstSunExposure: ['Sections 101-108', 'Sections 201-204', 'Grass berm', 'The Bacon Strip'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool spring weather', shadeTip: 'Sun welcome on cool days' },
        { month: 'May', avgTemp: 69, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant', shadeTip: 'Shade for afternoon games' },
        { month: 'June', avgTemp: 78, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warm', shadeTip: 'Third base side recommended' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot summer', shadeTip: 'Even-numbered sections essential' },
        { month: 'August', avgTemp: 80, avgHumidity: 72, rainChance: 28, typicalConditions: 'Hot and humid', shadeTip: 'Club seats or back rows' },
        { month: 'September', avgTemp: 73, avgHumidity: 70, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Still need shade for day games' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Club Seats', perks: ['Air-conditioned lounge', 'Premium food', 'Best shade'], access: 'Club entrance' },
          { name: 'Hog Heaven', perks: ['Season ticket holder lounge', 'Exclusive access'], access: 'Members only' }
        ],
        suites: { 
          levels: ['19 Luxury Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering', 'TVs']
        },
        specialAreas: [
          { name: 'Capital Blue Tiki Terrace', description: 'Left field social area with coverage' },
          { name: 'The Pig Pen', description: 'Behind bullpen party area' }
        ]
      },
      budgetOptions: ['Grass berm (free with any ticket)', 'Upper reserved', 'The Bacon Strip standing'],
      familySections: ['Family-friendly areas', 'Near kids activities'],
      standingRoom: ['The Bacon Strip', '360-degree concourse', 'Behind most sections'],
      tips: [
        { section: 'Even-numbered sections', tip: 'No sun in eyes for evening games', category: 'shade' },
        { section: 'The Bacon Strip', tip: 'Unique but no shade', category: 'experience' },
        { section: 'Club seats', tip: 'Best overall experience', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: [
        'The Nacho Porker',
        '$1 hot dogs (Tues/Thurs)',
        'Tacos & Tallboys ($2 tacos Wednesdays)',
        'Pig-themed specialties'
      ],
      local: [
        'Pennsylvania Dutch treats',
        'Local craft beers',
        'Lehigh Valley favorites'
      ],
      healthy: ['Salads', 'Veggie options', 'Gluten-free items'],
      kidsFriendly: ['Dollar dogs', 'Traditional fare', 'Ice cream'],
      alcohol: {
        beer: ['$5 16-oz cans on Wednesdays', 'Craft selections', 'Domestic options'],
        wine: true,
        cocktails: true
      }
    },
    
    parking: {
      lots: [
        { name: 'Coke Zero Lot', distance: '1-2 minutes', price: '$5', shadedSpots: false, covered: false, tip: 'Closest to main gate' },
        { name: 'Cherry Coke Lot', distance: '2-3 minutes', price: '$5', shadedSpots: false, covered: false, tip: 'Credit card only' },
        { name: 'Coca-Cola Lot', distance: '5 minutes', price: '$5', shadedSpots: false, covered: false },
        { name: 'Diet Coke/Sprite Lots', distance: '7-10 minutes', price: '$5', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        rideShare: 'Designated pickup areas'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'IronPigs Way', bestFor: ['All sections'], openTime: '2.5 hours before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Main Team Store', exclusive: ['IronPigs bacon merchandise'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates'],
      wifi: { available: true, freeZones: ['Select areas'] }
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have accessible seating'],
        entrance: 'All gates accessible',
        elevators: ['Suite and club levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: 'ADA parking in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive Early', description: 'Lots open 2.5 hours before', category: 'arrival' },
        { title: 'Dollar Dog Days', description: 'Tuesday/Thursday deals', category: 'food' },
        { title: 'Third Base Shade', description: 'Even-numbered sections', category: 'shade' }
      ],
      typicalSchedule: {
        gatesOpen: '2.5 hours before first pitch',
        firstPitch: '7:05 PM (weekdays), 6:35 PM (Saturday), 1:35 PM (Sunday)',
        rushHours: ['45 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    
    neighborhood: {
      name: 'Allentown',
      description: '90 minutes from Philadelphia, 2 hours from NYC, connected to downtown via American Parkway Bridge.',
      beforeGame: ['Downtown Allentown restaurants', 'Local breweries'],
      afterGame: ['Downtown Allentown', 'ArtsWalk district'],
      radius: '1-2 miles to downtown'
    },
    
    transportation: {
      address: '1050 IronPigs Way, Allentown, PA 18109',
      publicTransit: {},
      driving: {
        majorRoutes: ['I-476', 'I-78', 'US-22'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'I-78 to Cedar Crest Blvd exit'
      },
      rideShare: {
        pickupZone: 'Designated areas',
        dropoffZone: 'Main entrance',
        surgePricing: 'Light to moderate'
      }
    },
    
    history: {
      timeline: [
        { year: 2008, event: 'Stadium opens' },
        { year: 2008, event: 'First standing-room social areas in baseball' }
      ],
      traditions: [
        { name: 'Bacon Racing', description: 'Between-inning bacon race' },
        { name: 'Dollar Dog Days', description: 'Tuesday/Thursday tradition' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Fun, food-focused atmosphere with pig-themed entertainment',
      bestExperiences: ['The Bacon Strip experience', 'Tiki Terrace party', 'Award-winning food'],
      traditions: ['Bacon racing', 'Pig mascots', 'Dollar dogs'],
      mascot: { name: 'FeFe', description: 'IronPigs mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Even-numbered sections avoid sun glare',
        'Dollar dogs Tuesday/Thursday',
        '$2 tacos and $5 beers Wednesday',
        'The Bacon Strip is unique but hot',
        'Average 9,000+ attendance - arrive early'
      ],
      avoidThese: ['Sections 101-108 for day games', 'The Bacon Strip on hot days'],
      hiddenGems: ['Hog Heaven lounge', 'Trough bar', 'Standing room views'],
      photoSpots: ['The Bacon Strip', 'With mascots', 'Grass berm'],
      bestValue: ['Dollar dog nights', 'Grass berm (free)', 'Tacos & Tallboys Wednesday']
    }
  },

  'louisville-bats': {
    id: 'louisville-bats',
    name: 'Louisville Slugger Field',
    team: 'Louisville Bats',
    opened: 2000,
    capacity: 11500,
    
    overview: {
      description: 'Louisville Slugger Field incorporates a historic 100+ year old train depot into its design, offering scenic views of the Ohio River and downtown Louisville while featuring modern amenities from a recent $7 million renovation.',
      highlights: [
        'Historic train depot integrated into design',
        'Ohio River and downtown views',
        '$7 million renovation (2021)',
        'Only carousel in professional baseball'
      ],
      uniqueFeatures: [
        'Historic train warehouse (100+ years old)',
        'Baseball carousel for kids',
        'Pee Wee Reese statue',
        'Two grassy seating areas'
      ],
      renovations: [
        { year: 2021, description: '$7M renovation - removed bleachers, added outfield bars, expanded kids area' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club seats', 'Train shed area'],
        afternoon: ['92 On-Deck Club seats', 'Private suites', 'Third base sections'],
        evening: ['Most sections shaded', 'First base cooler', 'Outfield bars']
      },
      coveredSeating: ['32 private suites', 'Club level with lounge', 'Historic train shed', 'Humana Cabana'],
      shadeTips: [
        'On-Deck Club seats best for shade',
        'Third base side for afternoon',
        'Train shed provides unique coverage',
        'Club level has air-conditioned access'
      ],
      sunProtection: {
        shadedConcourses: ['Continuous concourse'],
        indoorAreas: ['Train shed Hall of Fame', 'Touch of Color Stadium Club', 'Club lounge']
      },
      worstSunExposure: ['Right field lawn', 'First base afternoon', 'Left-center berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 65, rainChance: 30, typicalConditions: 'Variable spring weather', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 71, avgHumidity: 68, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Shade helpful for day games' },
        { month: 'June', avgTemp: 80, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Club seats recommended' },
        { month: 'July', avgTemp: 84, avgHumidity: 72, rainChance: 30, typicalConditions: 'Hot summer', shadeTip: 'Shade essential' },
        { month: 'August', avgTemp: 83, avgHumidity: 73, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Evening games more comfortable' },
        { month: 'September', avgTemp: 76, avgHumidity: 70, rainChance: 25, typicalConditions: 'Still warm', shadeTip: 'Third base side best' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'On-Deck Club', perks: ['92 padded seats behind home', 'Premium amenities'], access: 'Exclusive entrance' },
          { name: 'Touch of Color Stadium Club', perks: ['Suite level', 'Capacity 150', 'Event space'], access: 'Suite level' }
        ],
        suites: { 
          levels: ['32 Private Suites'],
          amenities: ['Climate control', 'Private restrooms', 'Catering', 'Wet bar options']
        },
        specialAreas: [
          { name: 'Humana Cabana', description: 'Right field premium seating' },
          { name: 'Home Plate Club', description: 'Soft-serve ice cream machine included' }
        ]
      },
      budgetOptions: ['Outfield lawn areas', 'General admission', 'Berm seating'],
      familySections: ['Expanded kids area', 'Near carousel'],
      standingRoom: ['Outfield bars', 'Concourse areas'],
      partyAreas: [
        { name: 'Miller Time Taphouse', description: 'Behind right-center with full bar', amenities: ['Full bar', 'TVs'] },
        { name: 'Double Play Bar', description: 'Third base line off concourse', amenities: ['Full bar'] }
      ],
      tips: [
        { section: 'On-Deck Club', tip: 'Best seats in house', category: 'experience' },
        { section: 'Grassy areas', tip: 'Bring blanket, great value', category: 'value' },
        { section: 'Third base side', tip: 'Best shade coverage', category: 'shade' }
      ]
    },
    
    concessions: {
      signature: [
        'The Slugger Dog',
        'Against the Grain Smokehouse',
        'Local brewery annual special release'
      ],
      local: [
        'Against the Grain Brewery',
        'Louisville craft beers',
        'Kentucky bourbon selections'
      ],
      healthy: ['Smokehouse salads', 'Grilled options'],
      kidsFriendly: ['Carousel', 'Traditional ballpark fare', 'Ice cream'],
      alcohol: {
        beer: ['Against the Grain', 'Miller Time Taphouse selections', 'Local craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Against the Grain']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '1 minute', price: '$10', shadedSpots: false, covered: false, tip: 'Season ticket holders priority' },
        { name: 'Adjacent Lots', distance: '2-3 minutes', price: '$9-10', shadedSpots: false, covered: false },
        { name: 'Preston Street Lot', distance: '5 minutes', price: '$6', shadedSpots: false, covered: false, tip: 'Best value' },
        { name: 'Witherspoon Garage', distance: '5-7 minutes', price: 'Varies', shadedSpots: true, covered: true }
      ],
      streetParking: { available: true, restrictions: 'Free after 6PM weekdays, anytime weekends' },
      alternativeTransport: {
        publicTransit: ['TARC bus system - $1.75 fare', 'Day pass $3.50'],
        rideShare: 'Multiple pickup points downtown'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: '401 East Main Street', bestFor: ['All sections'], openTime: '90 minutes before' }
    ],
    
    amenities: {
      merchandise: [{ location: 'Team Store', exclusive: ['Slugger merchandise'] }],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse', 'Near gates'],
      kidZones: [{ name: 'Kids Area', location: 'Expanded outfield area', activities: ['Modern playground', 'Only carousel in pro baseball'] }]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates accessible',
        elevators: ['Suite level access']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Handicap parking off Jackson Street'
    },
    
    gameDay: {
      tips: [
        { title: 'Free Street Parking', description: 'After 6PM weekdays', category: 'arrival' },
        { title: 'TARC Transit', description: 'UofL rides free with app', category: 'arrival' },
        { title: 'Historic Train Shed', description: 'Visit Hall of Fame', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '6:45 PM (weekdays), 6:15 PM (Saturday), 1:05 PM (Sunday)',
        rushHours: ['30 minutes before first pitch']
      },
      security: {
        allowedBags: 'Small bags permitted',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Louisville',
      description: 'Located on the Ohio River waterfront in downtown Louisville with easy access to dining and entertainment.',
      beforeGame: ['Fourth Street Live!', 'Downtown restaurants', 'Waterfront Park'],
      afterGame: ['Downtown nightlife', 'Bourbon district', 'NuLu neighborhood'],
      radius: 'Walking distance to downtown'
    },
    
    transportation: {
      address: '401 East Main Street, Louisville, KY 40202',
      publicTransit: {
        bus: [{ routes: ['TARC routes'], stops: ['Multiple downtown stops'] }]
      },
      driving: {
        majorRoutes: ['I-65', 'I-71', 'I-264'],
        typicalTraffic: 'Downtown congestion on game days',
        bestApproach: 'I-65 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Designated areas',
        dropoffZone: 'Main entrance',
        surgePricing: 'Moderate after games'
      }
    },
    
    history: {
      timeline: [
        { year: 2000, event: 'Stadium opens' },
        { year: 2021, event: '$7 million renovation completed' }
      ],
      traditions: [
        { name: 'Pee Wee Reese Statue', description: 'Honoring Brooklyn Dodgers legend' },
        { name: 'Train Depot', description: 'Historic structure preserved' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Historic charm meets modern amenities with riverfront views',
      bestExperiences: ['Carousel rides', 'Train depot tour', 'Outfield bars', 'River views'],
      traditions: ['Against the Grain brewery', 'Slugger Dog']
    },
    
    proTips: {
      insiderTips: [
        'Free street parking after 6PM',
        'Train depot worth exploring',
        'Grassy areas great for families',
        'Against the Grain a must-try',
        'UofL students ride TARC free'
      ],
      avoidThese: ['Right field in afternoon sun', 'Arriving late for parking'],
      hiddenGems: ['Historic train shed', 'Carousel', 'Touch of Color Club'],
      photoSpots: ['Pee Wee Reese statue', 'Ohio River views', 'Historic depot'],
      bestValue: ['$6 Preston lot', 'Grassy lawn areas', 'Free street parking evenings']
    }
  }
};