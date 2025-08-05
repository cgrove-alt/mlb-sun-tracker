import { StadiumGuide } from '../stadiumGuides';

export const aaaStadiumGuides2: Record<string, StadiumGuide> = {
  'las-vegas-aviators': {
    id: 'las-vegas-aviators',
    name: 'Las Vegas Ballpark',
    team: 'Las Vegas Aviators',
    opened: 2019,
    capacity: 10000,
    
    overview: {
      description: 'Las Vegas Ballpark in Summerlin is the newest jewel of Triple-A baseball, featuring a unique design with the largest video board in minor league baseball, synthetic turf, and stunning views of Red Rock Canyon.',
      highlights: [
        'Largest video board in MiLB (3,930 sq ft)',
        'Mesh seating for airflow in desert heat',
        'Swimming pool beyond right field',
        'Views of Red Rock Canyon'
      ],
      uniqueFeatures: [
        'Swimming pool and spa in outfield',
        'Party deck with cabanas',
        'Climate-controlled suites',
        'Synthetic turf field',
        'Flying Aces kids zone'
      ],
      renovations: [],
      previousNames: []
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-108 behind home plate', 'Club Level'],
        afternoon: ['Third base side 109-115', 'Upper deck with canopy', 'Suite Level'],
        evening: ['Most sections after 6 PM', 'First base side gains shade']
      },
      coveredSeating: ['Club Level', 'Suite Level', 'Upper deck under canopy'],
      shadeTips: [
        'Canopy covers most upper deck seats',
        'Third base side best for afternoon games',
        'Pool area has umbrellas and shade structures',
        'Desert heat makes shade essential April-September'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourses', 'Club Level'],
        indoorAreas: ['Club lounges', 'Team Store', 'Suite Level']
      },
      worstSunExposure: ['Right field lawn', 'Sections 201-205 in afternoon', 'Pool deck without umbrellas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 75, avgHumidity: 20, rainChance: 5, typicalConditions: 'Warm and dry', shadeTip: 'Afternoon shade recommended' },
        { month: 'May', avgTemp: 85, avgHumidity: 15, rainChance: 3, typicalConditions: 'Hot and sunny', shadeTip: 'Shade essential after 2 PM' },
        { month: 'June', avgTemp: 95, avgHumidity: 10, rainChance: 2, typicalConditions: 'Very hot', shadeTip: 'Upper deck or club level' },
        { month: 'July', avgTemp: 104, avgHumidity: 15, rainChance: 10, typicalConditions: 'Extreme heat', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 102, avgHumidity: 20, rainChance: 10, typicalConditions: 'Peak heat with monsoons', shadeTip: 'Covered seating essential' },
        { month: 'September', avgTemp: 93, avgHumidity: 15, rainChance: 5, typicalConditions: 'Still very hot', shadeTip: 'Shade crucial for day games' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Founders Club', perks: ['All-inclusive food/drinks', 'Climate control', 'Padded seats'], access: 'Behind home plate' },
          { name: 'Aviators Club', perks: ['Buffet', 'Full bar', 'Indoor/outdoor seating'], access: 'Club Level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Climate control', 'Private restrooms', 'HDTV', 'Catering']
        },
        specialAreas: [
          { name: 'Pool Beyond Right Field', description: 'Swimming pool with game viewing', capacity: 350 },
          { name: 'Party Deck', description: 'Left field deck with cabanas', capacity: 200 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper deck corners', 'GA standing areas'],
      familySections: ['Flying Aces kids zone area'],
      standingRoom: ['Party Deck', 'Concourse areas'],
      partyAreas: [
        { name: 'Pool Zone', capacity: '350', amenities: ['Swimming pool', 'Spa', 'Cabanas', 'Bar service'] },
        { name: 'Party Deck', capacity: '200', amenities: ['Cabanas', 'Bar', 'Shade structures'] }
      ],
      tips: [
        { section: 'Club Level', tip: 'Best for escaping heat with AC', category: 'shade' },
        { section: 'Sections 109-115', tip: 'Third base side with afternoon shade', category: 'shade' },
        { section: 'Pool Zone', tip: 'Unique experience but can be hot', category: 'experience' },
        { section: 'Upper deck', tip: 'Canopy coverage and breeze', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['Capriotti\'s subs', 'Nathan\'s hot dogs', 'BBQ nachos', 'Craft cocktails'],
      local: ['Roberto\'s Taco Shop', 'Las Vegas craft beers', 'Desert desserts'],
      healthy: ['Fresh salads', 'Fruit cups', 'Veggie wraps'],
      vegetarian: ['Beyond burgers', 'Veggie tacos', 'Salads'],
      glutenFree: ['GF buns available', 'Rice bowls'],
      kidsFriendly: ['Pizza', 'Chicken tenders', 'Ice cream', 'Dippin\' Dots'],
      alcohol: {
        beer: ['Tenaya Creek', 'Big Dog\'s', 'PT\'s', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Tenaya Creek', 'Big Dog\'s Brewing', 'PT\'s Brewing']
      }
    },
    
    parking: {
      lots: [
        { name: 'Main Lot', distance: 'Adjacent', price: '$10', shadedSpots: false, covered: false, tip: 'Arrives early on weekends' },
        { name: 'Overflow Lot', distance: '5 min walk', price: '$8', shadedSpots: false, covered: false },
        { name: 'Downtown Summerlin', distance: '10 min walk', price: 'Free after 6 PM', shadedSpots: true, covered: true, tip: 'Garage parking available' }
      ],
      alternativeTransport: {
        publicTransit: ['Limited RTC bus service'],
        rideShare: 'Designated pickup at main entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'Main entrance', bestFor: ['All sections'], openTime: '90 minutes before first pitch' },
      { name: 'Right Field Gate', location: 'Pool entrance', bestFor: ['Pool zone', 'Right field'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Main Team Store', exclusive: ['Aviators gear', 'Las Vegas themed items'] }
      ],
      firstAid: ['Section 105', 'Section 205'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services'],
      atms: ['Main concourse', 'Club Level'],
      wifi: { available: true, network: 'Aviators_WiFi' },
      chargingStations: ['Club Level'],
      kidZones: [
        { name: 'Flying Aces', location: 'Left field', activities: ['Playground', 'Games', 'Speed pitch'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Main entrance', 'Third base side']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: 'Available in main lot'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive early for parking', description: 'Limited spaces fill quickly', category: 'arrival' },
        { title: 'Bring sunscreen', description: 'Desert sun is intense', category: 'weather' },
        { title: 'Try the pool', description: 'Unique MiLB experience', category: 'experience' },
        { title: 'Evening games cooler', description: 'Avoid afternoon heat', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM (most games)',
        rushHours: ['6:00-7:00 PM on Summerlin Parkway']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Glass'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Downtown Summerlin',
      description: 'Upscale shopping and dining district',
      beforeGame: ['Lazy Dog Restaurant', 'Yard House', 'BJ\'s Restaurant'],
      afterGame: ['Downtown Summerlin bars', 'Red Rock Casino'],
      radius: '0.5 mile'
    },
    
    transportation: {
      address: '1650 S Pavilion Center Dr, Las Vegas, NV 89135',
      publicTransit: {
        bus: [{ routes: ['RTC Route 203'], stops: ['Summerlin Parkway'] }]
      },
      driving: {
        majorRoutes: ['US-95 to Summerlin Parkway', 'I-215 to Town Center'],
        typicalTraffic: 'Moderate, heavier after games',
        bestApproach: 'Summerlin Parkway from US-95'
      },
      rideShare: {
        pickupZone: 'Main entrance circle',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to Downtown Summerlin for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 2019, event: 'Las Vegas Ballpark opens' },
        { year: 2019, event: 'Aviators relocate from Fresno' },
        { year: 2021, event: 'First full season after COVID' }
      ],
      notableGames: [
        { date: '2019-04-09', description: 'First game at Las Vegas Ballpark' }
      ],
      traditions: [
        { name: 'Aviator flyovers', description: 'Military aircraft flyovers' },
        { name: 'Pool parties', description: 'Swimming during games' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Vegas entertainment meets baseball',
      bestExperiences: [
        'Pool party atmosphere',
        'Red Rock Canyon views',
        'Modern amenities',
        'Vegas-style entertainment'
      ],
      traditions: ['7th inning stretch Vegas style', 'Aviator flyovers'],
      music: 'Vegas mix - contemporary hits',
      mascot: { name: 'Spruce the Goose', description: 'Aviator goose mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Downtown Summerlin parking free after 6 PM',
        'Club Level worth it for heat relief',
        'Pool tickets sell out on weekends',
        'Upper deck has best breeze',
        'Weeknight games less crowded'
      ],
      avoidThese: [
        'Afternoon games in summer',
        'Right field lawn without shade',
        'Parking lot without arriving early',
        'Pool area if wanting to watch game closely'
      ],
      hiddenGems: [
        'Craft beer selection at Party Deck',
        'Views from upper deck at sunset',
        'Roberto\'s Taco Shop stand',
        'Kids zone has shade structures'
      ],
      photoSpots: [
        'With Red Rock Canyon backdrop',
        'Pool area overview',
        'Main entrance plaza',
        'From upper deck at sunset'
      ],
      bestValue: [
        'Lawn tickets under $15',
        'Upper deck with canopy shade',
        'Downtown Summerlin happy hours before game',
        'Family four-pack deals'
      ]
    }
  },

  'sacramento-river-cats': {
    id: 'sacramento-river-cats',
    name: 'Sutter Health Park',
    team: 'Sacramento River Cats',
    opened: 2000,
    capacity: 14014,
    
    overview: {
      description: 'Sutter Health Park in West Sacramento sits on the Sacramento River waterfront, offering views of the Tower Bridge and downtown skyline. Known for its family-friendly atmosphere and innovative food options.',
      highlights: [
        'Sacramento River and Tower Bridge views',
        'Downtown skyline backdrop',
        'Extensive lawn seating areas',
        'Farm-to-fork concessions'
      ],
      uniqueFeatures: [
        'River Cats Landing beyond outfield',
        'Solon Club with river views',
        'Toyota Home Run Hill',
        'Fairytale Town play area',
        'Raley Field Express train for kids'
      ],
      renovations: [
        { year: 2019, description: 'Sutter Health naming rights and upgrades' },
        { year: 2016, description: 'New video board installation' }
      ],
      previousNames: ['Raley Field (2000-2019)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-108 behind home plate', 'Solon Club'],
        afternoon: ['Third base side 113-118', 'Upper Box sections', 'Suite Level'],
        evening: ['Most sections after 5 PM', 'First base side by 6 PM']
      },
      coveredSeating: ['Solon Club', 'Suite Level', 'Upper Box overhang rows'],
      shadeTips: [
        'Third base side best for afternoon shade',
        'Upper Box provides shade for Field Box below',
        'Lawn areas have minimal shade',
        'Sacramento heat makes shade important May-September'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['Main concourse', 'Club Level'],
        indoorAreas: ['Solon Club', 'Team Store', 'Suite areas']
      },
      worstSunExposure: ['Toyota Home Run Hill', 'Right field sections 201-206', 'Lawn berm areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 50, rainChance: 15, typicalConditions: 'Pleasant spring weather', shadeTip: 'Comfortable most areas' },
        { month: 'May', avgTemp: 75, avgHumidity: 45, rainChance: 8, typicalConditions: 'Warming up', shadeTip: 'Afternoon shade helpful' },
        { month: 'June', avgTemp: 83, avgHumidity: 40, rainChance: 3, typicalConditions: 'Hot and dry', shadeTip: 'Shade important after 3 PM' },
        { month: 'July', avgTemp: 92, avgHumidity: 35, rainChance: 1, typicalConditions: 'Peak heat', shadeTip: 'Evening games recommended' },
        { month: 'August', avgTemp: 91, avgHumidity: 35, rainChance: 1, typicalConditions: 'Very hot', shadeTip: 'Shade essential for comfort' },
        { month: 'September', avgTemp: 85, avgHumidity: 40, rainChance: 5, typicalConditions: 'Still warm', shadeTip: 'Third base side best' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Solon Club', perks: ['All-inclusive food/drinks', 'River views', 'Climate control'], access: 'Behind home plate' },
          { name: 'Dignity Health Club', perks: ['Buffet dining', 'Private bar'], access: 'First base side' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'River Cats Landing', description: 'Outfield party area', capacity: 300 },
          { name: 'Toyota Home Run Hill', description: 'Lawn seating beyond left field', capacity: 500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper Reserved', 'GA berm areas'],
      familySections: ['Sections 208-210', 'Family Fun Zone'],
      standingRoom: ['River Cats Landing', 'Concourse areas'],
      partyAreas: [
        { name: 'River Cats Landing', capacity: '300', amenities: ['BBQ area', 'Bar service', 'Standing tables'] },
        { name: 'Toyota Home Run Hill', capacity: '500', amenities: ['Lawn seating', 'Picnic area'] }
      ],
      tips: [
        { section: 'Solon Club', tip: 'Best amenities and shade', category: 'experience' },
        { section: 'Sections 113-118', tip: 'Good shade and value', category: 'shade' },
        { section: 'Home Run Hill', tip: 'Fun but sunny lawn area', category: 'family' },
        { section: 'Upper Box', tip: 'Affordable with overhang shade', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['Tri-tip sandwich', 'Donut burger', 'Corn dogs', 'Local craft beers'],
      local: ['Sacramento farm-to-fork options', 'Squeeze Inn burgers', 'Local food trucks'],
      healthy: ['Fresh salads', 'Fruit options', 'Veggie wraps'],
      vegetarian: ['Garden burgers', 'Veggie tacos', 'Salads'],
      glutenFree: ['GF options marked'],
      kidsFriendly: ['Kids meals', 'Pizza', 'Ice cream'],
      alcohol: {
        beer: ['Track 7', 'New Glory', 'Bike Dog', 'Coors'],
        wine: true,
        cocktails: true,
        localBreweries: ['Track 7', 'New Glory', 'Bike Dog', 'Device Brewing']
      }
    },
    
    parking: {
      lots: [
        { name: 'Main Lot', distance: 'Adjacent', price: '$12', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '10 min walk', price: '$10', shadedSpots: false, covered: false },
        { name: 'Street parking', distance: 'Various', price: 'Free but limited', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['Yolobus routes from Davis', 'Limited Sacramento RT service'],
        rideShare: 'Designated area at main entrance',
        bicycle: 'Bike valet available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: 'Home plate entrance', bestFor: ['All sections'], openTime: '90 minutes before first pitch' },
      { name: 'VIP Gate', location: 'First base side', bestFor: ['Club seats', 'Suites'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store - Main entrance', exclusive: ['River Cats gear', 'Giants affiliate items'] }
      ],
      firstAid: ['Section 107', 'Section 203'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['First Aid station'],
      atms: ['Main concourse locations'],
      wifi: { available: true, network: 'RiverCats_WiFi' },
      kidZones: [
        { name: 'Fairytale Town', location: 'Left field', activities: ['Playground', 'Train ride', 'Games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available for all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'Available in main lot'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Try tri-tip sandwich', description: 'Local specialty', category: 'food' },
        { title: 'Visit Home Run Hill', description: 'Great for families', category: 'family' },
        { title: 'Stay for fireworks', description: 'Friday night shows', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM weekdays, 6:05 PM weekends',
        rushHours: ['5:30-6:30 PM on I-80 and US-50']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drinks', 'Glass', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'West Sacramento Waterfront',
      description: 'Developing riverfront area',
      beforeGame: ['Drake\'s The Barn', 'Broderick Roadhouse', 'Club Pheasant'],
      afterGame: ['Bridge District bars', 'Downtown Sacramento nightlife'],
      radius: '1-2 miles'
    },
    
    transportation: {
      address: '400 Ballpark Dr, West Sacramento, CA 95691',
      publicTransit: {
        bus: [{ routes: ['Yolobus 42A/42B'], stops: ['Ballpark Drive'] }]
      },
      driving: {
        majorRoutes: ['I-80 to Jefferson Blvd', 'US-50 to Jefferson', 'I-5 to US-50'],
        typicalTraffic: 'Heavy on I-80 and US-50 at rush hour',
        bestApproach: 'Jefferson Blvd exit from I-80'
      },
      rideShare: {
        pickupZone: 'Main entrance area',
        dropoffZone: 'Same as pickup',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to Tower Bridge for easier pickup'
      }
    },
    
    history: {
      timeline: [
        { year: 2000, event: 'Raley Field opens' },
        { year: 2015, event: 'Become Giants Triple-A affiliate' },
        { year: 2019, event: 'Renamed Sutter Health Park' }
      ],
      notableGames: [
        { date: '2000-04-11', description: 'First game at Raley Field' },
        { date: '2019-09-08', description: 'Triple-A Championship win' }
      ],
      traditions: [
        { name: 'Dinger\'s Ball Toss', description: 'Mascot tosses balls to kids' },
        { name: 'Friday Fireworks', description: 'Post-game firework shows' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly with riverfront charm',
      bestExperiences: [
        'Tower Bridge views',
        'Friday fireworks',
        'Farm-to-fork food',
        'Kids activities'
      ],
      traditions: ['Dinger mascot antics', 'River Cats chant'],
      music: 'Classic ballpark with modern hits',
      mascot: { name: 'Dinger', description: 'River Cats mascot' }
    },
    
    proTips: {
      insiderTips: [
        'Drake\'s The Barn pregame for craft beer',
        'Solon Club worth upgrade for heat',
        'Lawn areas good for families',
        'Bike valet saves parking hassle',
        'Upper Box best shade value'
      ],
      avoidThese: [
        'Lawn seating on hot days',
        'Parking lot without early arrival',
        'Right field in afternoon sun',
        'I-80 right after game'
      ],
      hiddenGems: [
        'River views from upper deck',
        'Local food truck offerings',
        'Track 7 beer selection',
        'Kids train ride'
      ],
      photoSpots: [
        'With Tower Bridge backdrop',
        'River Cats Landing',
        'Home Run Hill overview',
        'Main entrance statue'
      ],
      bestValue: [
        'Lawn tickets for families',
        'Upper Reserved seats',
        'Tuesday discount nights',
        'Group packages'
      ]
    }
  },

  'salt-lake-bees': {
    id: 'salt-lake-bees',
    name: 'Smith\'s Ballpark',
    team: 'Salt Lake Bees',
    opened: 1994,
    capacity: 15411,
    
    overview: {
      description: 'Smith\'s Ballpark sits in the shadow of the Wasatch Mountains in Salt Lake City, offering spectacular mountain views and a classic ballpark experience. Home to the Angels\' Triple-A affiliate since 2001.',
      highlights: [
        'Spectacular Wasatch Mountain views',
        'Downtown Salt Lake City location',
        'Family-friendly atmosphere',
        'Craft beer garden'
      ],
      uniqueFeatures: [
        'Mountain backdrop beyond outfield',
        'Apiary social area in right field',
        'Kids Fun Zone',
        'Party deck areas',
        'Local food court'
      ],
      renovations: [
        { year: 2020, description: 'Smith\'s naming rights and upgrades' },
        { year: 2015, description: 'New video board and sound system' }
      ],
      previousNames: ['Franklin Covey Field (1994-2000)', 'Spring Mobile Ballpark (2015-2019)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Home plate sections 7-11', 'Club seats'],
        afternoon: ['Third base side sections 1-6', 'Upper deck 201-208'],
        evening: ['Most sections after 6 PM', 'First base side by sunset']
      },
      coveredSeating: ['Club Level seats', 'Upper deck overhang', 'Suite areas'],
      shadeTips: [
        'Third base side gets afternoon shade first',
        'Upper deck provides shade for lower sections',
        'Mountain shadows provide late afternoon relief',
        'High altitude sun is intense - shade important'
      ],
      sunProtection: {
        sunscreenStations: ['First Aid stations'],
        shadedConcourses: ['Main concourse', 'Upper level'],
        indoorAreas: ['Club areas', 'Team Store', 'Guest Services']
      },
      worstSunExposure: ['Right field lawn', 'Sections 15-18', 'Outfield bleachers'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 40, rainChance: 20, typicalConditions: 'Cool and variable', shadeTip: 'Layers recommended' },
        { month: 'May', avgTemp: 67, avgHumidity: 35, rainChance: 20, typicalConditions: 'Pleasant spring', shadeTip: 'Shade helpful afternoons' },
        { month: 'June', avgTemp: 78, avgHumidity: 30, rainChance: 10, typicalConditions: 'Warm and dry', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 88, avgHumidity: 25, rainChance: 15, typicalConditions: 'Hot with monsoons', shadeTip: 'Shade essential' },
        { month: 'August', avgTemp: 86, avgHumidity: 30, rainChance: 15, typicalConditions: 'Hot afternoons', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 75, avgHumidity: 35, rainChance: 15, typicalConditions: 'Cooling down', shadeTip: 'Perfect baseball weather' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Home Plate Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Wait service'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['Suite Level third base side'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'The Apiary', description: 'Right field social area', capacity: 200 },
          { name: 'Left Field Lawn', description: 'Grass berm seating', capacity: 500 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Outfield bleachers', 'Upper deck corners'],
      familySections: ['Sections 201-203'],
      standingRoom: ['The Apiary', 'Concourse areas'],
      partyAreas: [
        { name: 'The Apiary', capacity: '200', amenities: ['Full bar', 'Standing tables', 'TVs'] },
        { name: 'Party Deck', capacity: '150', amenities: ['Group seating', 'Catering options'] }
      ],
      tips: [
        { section: 'Sections 7-11', tip: 'Best views behind home plate', category: 'view' },
        { section: 'Sections 1-6', tip: 'Third base shade and value', category: 'shade' },
        { section: 'The Apiary', tip: 'Social atmosphere', category: 'experience' },
        { section: 'Left Field Lawn', tip: 'Great for families', category: 'family' }
      ]
    },
    
    concessions: {
      signature: ['Beehive Cheese curds', 'Bees Burger', 'Crown Burger', 'Fry sauce'],
      local: ['Red Iguana Mexican', 'Local craft beers', 'Utah scones', 'Pastrami burger'],
      healthy: ['Fresh salads', 'Fruit cups', 'Veggie options'],
      vegetarian: ['Veggie burgers', 'Bean burritos', 'Salads'],
      glutenFree: ['GF buns available'],
      kidsFriendly: ['Hot dogs', 'Pizza', 'Popcorn', 'Cotton candy'],
      alcohol: {
        beer: ['Wasatch', 'Squatters', 'Uinta', 'Budweiser'],
        wine: false,
        cocktails: false,
        localBreweries: ['Wasatch', 'Squatters', 'Uinta', 'Red Rock']
      }
    },
    
    parking: {
      lots: [
        { name: 'Main Lot', distance: 'Adjacent', price: '$7', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '5 min walk', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown garages', distance: '10-15 min walk', price: '$5-10', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['TRAX Red Line to Ballpark Station', 'UTA bus routes'],
        rideShare: '1300 South entrance',
        bicycle: 'Bike racks available'
      }
    },
    
    gates: [
      { name: 'Main Gate', location: '1300 South', bestFor: ['All sections'], openTime: '90 minutes before first pitch' },
      { name: 'West Gate', location: 'West Temple', bestFor: ['Third base side'], openTime: '60 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Team Store - Main gate', exclusive: ['Bees gear', 'Angels affiliate items'] }
      ],
      firstAid: ['Section 9', 'Section 201'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true, network: 'Bees_WiFi' },
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Speed pitch', 'Bounce house'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Available for upper deck']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available in main lot'
    },
    
    gameDay: {
      tips: [
        { title: 'Take TRAX', description: 'Avoid parking hassles', category: 'arrival' },
        { title: 'Try fry sauce', description: 'Utah specialty', category: 'food' },
        { title: 'Enjoy mountain views', description: 'Best at sunset', category: 'experience' },
        { title: 'Thursday fireworks', description: 'Post-game shows', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        firstPitch: '7:05 PM weekdays, 6:35 PM Saturdays',
        rushHours: ['5:00-6:30 PM on I-15']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drinks', 'Weapons'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Ballpark District',
      description: 'Growing area near downtown SLC',
      beforeGame: ['Lucky 13 Bar', 'Piper Down Pub', 'Red Iguana'],
      afterGame: ['Downtown SLC bars', '9th & 9th district'],
      radius: '1-2 miles'
    },
    
    transportation: {
      address: '77 W 1300 S, Salt Lake City, UT 84115',
      publicTransit: {
        subway: [{ lines: ['TRAX Red Line'], station: 'Ballpark', walkTime: '5 minutes' }],
        bus: [{ routes: ['UTA Routes 9, 17'], stops: ['1300 South'] }]
      },
      driving: {
        majorRoutes: ['I-15 to 1300 South', 'I-80 to State Street'],
        typicalTraffic: 'Moderate on I-15',
        bestApproach: 'I-15 Exit 305 (1300 South)'
      },
      rideShare: {
        pickupZone: '1300 South entrance',
        dropoffZone: 'Same as pickup',
        surgePricing: '2x after games',
        alternativeTip: 'Walk to TRAX station'
      }
    },
    
    history: {
      timeline: [
        { year: 1994, event: 'Franklin Covey Field opens' },
        { year: 2001, event: 'Become Angels affiliate' },
        { year: 2006, event: 'Rebrand as Salt Lake Bees' }
      ],
      notableGames: [
        { date: '1994-04-15', description: 'First game at ballpark' }
      ],
      traditions: [
        { name: 'Bumble mascot race', description: 'Between innings entertainment' },
        { name: 'Thursday fireworks', description: 'Summer firework shows' }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly with mountain views',
      bestExperiences: [
        'Wasatch Mountain backdrop',
        'Local craft beer selection',
        'Thursday fireworks',
        'The Apiary social area'
      ],
      traditions: ['Bumble mascot antics', 'Beehive theme'],
      music: 'Classic ballpark organ and hits',
      mascot: { name: 'Bumble', description: 'Bee mascot' }
    },
    
    proTips: {
      insiderTips: [
        'TRAX Red Line direct to stadium',
        'Lucky 13 for pregame burgers',
        'Upper deck has best mountain views',
        'Thursday games have fireworks',
        'The Apiary has best beer selection'
      ],
      avoidThese: [
        'Driving on I-15 at rush hour',
        'Right field on sunny afternoons',
        'Parking lot without early arrival',
        'Limited alcohol options (Utah laws)'
      ],
      hiddenGems: [
        'Red Iguana stand for Mexican food',
        'Crown Burger at concessions',
        'Mountain sunset views',
        'Local craft beer options'
      ],
      photoSpots: [
        'With Wasatch Mountains backdrop',
        'Main entrance with Bumble',
        'The Apiary deck',
        'Upper deck panorama'
      ],
      bestValue: [
        'Lawn seating for families',
        'TRAX saves parking fees',
        'Tuesday discount nights',
        'Upper deck corners'
      ]
    }
  }
};