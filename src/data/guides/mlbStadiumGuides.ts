import { StadiumGuide } from '../stadiumGuides';

export const mlbStadiumGuides: Record<string, StadiumGuide> = {
  'angels': {
      id: 'angels',
      name: 'Angel Stadium',
      team: 'Los Angeles Angels',
      opened: 1966,
      capacity: 45517,
      overview: {
        description: 'Angel Stadium of Anaheim, originally known as Anaheim Stadium, is the fourth-oldest active ballpark in MLB. Located in Orange County, this classic ballpark features the iconic Big A sign and rock waterfall beyond the outfield.',
        highlights: [
          'Fourth-oldest active MLB ballpark',
          'Iconic 230-foot tall Big A sign',
          'Rock waterfall feature in outfield',
          'Recently renovated clubhouse and facilities'
        ],
        uniqueFeatures: [
          'Rock waterfall with geysers beyond center field',
          'The Big A electronic marquee sign',
          'Outfield extravaganza area',
          'Home run celebration fireworks'
        ],
        renovations: [
          { year: 1979, description: 'Enclosed stadium for NFL Rams' },
          { year: 1998, description: 'Restored to baseball-only configuration' },
          { year: 2011, description: 'HD video boards and sound system upgrade' }
        ],
        previousNames: ['Anaheim Stadium', 'Edison International Field']
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Terrace Level 401-410', 'Club Level MVP 1-10', 'Field Level 108-115'],
          afternoon: ['Terrace Level 420-435', 'Club Level sections', 'Diamond Club'],
          evening: ['Most sections shaded after 5 PM', 'First base side', 'Home plate area']
        },
        coveredSeating: ['Club Level MVP sections', 'Diamond Club', 'Terrace Level under overhang'],
        shadeTips: [
          'Third base side gets shade first in afternoon games',
          'Upper deck provides shade for sections below',
          'Club level has permanent overhead coverage',
          'Avoid right field pavilion for day games'
        ],
        sunProtection: {
          sunscreenStations: ['Section 130', 'Section 230', 'Section 430'],
          shadedConcourses: ['All concourse areas', 'Club level concourse'],
          indoorAreas: ['Diamond Club', 'Team Store', 'Stadium Club Restaurant']
        },
        worstSunExposure: ['Right Field Pavilion 236-239', 'Left Field Pavilion 201-204', 'Terrace Level 501-510'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 68, avgHumidity: 60, rainChance: 10, typicalConditions: 'Mild and pleasant', shadeTip: 'Third base side best for afternoon' },
          { month: 'May', avgTemp: 71, avgHumidity: 65, rainChance: 5, typicalConditions: 'Warming up, marine layer', shadeTip: 'Club level recommended' },
          { month: 'June', avgTemp: 75, avgHumidity: 65, rainChance: 2, typicalConditions: 'June gloom mornings', shadeTip: 'Upper deck for day games' },
          { month: 'July', avgTemp: 82, avgHumidity: 60, rainChance: 1, typicalConditions: 'Hot and sunny', shadeTip: 'Shade essential, arrive early' },
          { month: 'August', avgTemp: 84, avgHumidity: 60, rainChance: 1, typicalConditions: 'Peak heat', shadeTip: 'Evening games recommended' },
          { month: 'September', avgTemp: 80, avgHumidity: 60, rainChance: 3, typicalConditions: 'Still warm', shadeTip: 'First base side for late afternoon' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'Diamond Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Private entrance'], access: 'Behind home plate' },
            { name: 'MVP Box', perks: ['Club access', 'Wider seats', 'Waiter service'], access: 'Club level' }
          ],
          suites: {
            levels: ['Suite Level between Club and Terrace'],
            amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
          },
          specialAreas: [
            { name: 'Brewery X Beer Garden', description: 'Left field social space with craft beers', capacity: 200 },
            { name: 'Rock & Brews Restaurant', description: 'Right field restaurant with field view' }
          ]
        },
        budgetOptions: ['Terrace Level 501-535', 'Pavilion sections 201-239', 'View Level corners'],
        familySections: ['Family Zone sections 433-435', 'Right Field Pavilion'],
        standingRoom: ['Budweiser Patio', 'Outfield pavilion areas'],
        partyAreas: [
          { name: 'Left Field Pavilion', capacity: '250', amenities: ['Group seating', 'Private food service'] },
          { name: 'Trout Farm', description: 'Right field group area', capacity: '100', amenities: ['Group seating'] }
        ],
        tips: [
          { section: 'Field 108-115', tip: 'Best shade and proximity combination', category: 'shade' },
          { section: 'Terrace 420-425', tip: 'Great value with shade after 3 PM', category: 'value' },
          { section: 'Diamond Club', tip: 'All-inclusive premium experience', category: 'experience' },
          { section: 'Pavilion 236-239', tip: 'Avoid for day games - full sun exposure', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Helmet Nachos', 'Angel Dog', 'Chronic Tacos', 'Ruby\'s Diner Burger'],
        local: ['In-N-Out inspired burgers', 'California Pizza Kitchen', 'Lolita\'s Mexican Food'],
        healthy: ['Fresh fruit cups', 'Veggie wraps', 'Salad bowls'],
        vegetarian: ['Beyond Burger', 'Veggie tacos', 'Caprese sandwich'],
        glutenFree: ['GF hot dogs available', 'Nachos with GF chips'],
        kidsFriendly: ['Chicken tenders', 'Mini corn dogs', 'Ice cream helmets'],
        alcohol: {
          beer: ['Budweiser', 'Modelo', 'Stone Brewing', 'Golden Road'],
          wine: true,
          cocktails: true,
          localBreweries: ['Golden Road', 'Stone', 'Brewery X', 'Noble Ale Works']
        }
      },
      parking: {
        lots: [
          { name: 'Preferred Parking', distance: 'Adjacent', price: '$20', shadedSpots: false, covered: false, tip: 'Closest to gates' },
          { name: 'General Parking', distance: '5 min walk', price: '$10', shadedSpots: false, covered: false, tip: 'Best value option' },
          { name: 'Orangewood Lot', distance: '10 min walk', price: '$10', shadedSpots: true, covered: false, tip: 'Some tree shade available' }
        ],
        streetParking: {
          available: true,
          restrictions: 'Residential permit required in most areas',
          tip: 'Check signs carefully - enforcement is strict'
        },
        alternativeTransport: {
          publicTransit: ['OCTA bus routes 50, 430', 'Metrolink to Anaheim Station (2 miles)'],
          rideShare: 'Dedicated zones at Katella and State College',
          bicycle: 'Bike racks at main gates'
        }
      },
      gates: [
        { name: 'Home Plate Gate', location: 'Behind home plate', bestFor: ['Diamond Club', 'Field Level'], openTime: '90 minutes before first pitch', tip: 'Most crowded but central' },
        { name: 'Right Field Gate', location: 'Right field corner', bestFor: ['Pavilion', 'Budweiser Patio'], openTime: '90 minutes before first pitch' },
        { name: 'Left Field Gate', location: 'Left field corner', bestFor: ['Brewery X', 'Left field seating'], openTime: '90 minutes before first pitch' }
      ],
      amenities: {
        merchandise: [
          { location: 'Main Team Store - Home Plate Gate', exclusive: ['Game-used items', 'Custom jerseys'] },
          { location: 'Outfield stores', exclusive: ['Discount items'] }
        ],
        firstAid: ['Section 104', 'Section 215', 'Section 433'],
        babyChanging: ['All family restrooms', 'Section 130', 'Section 230'],
        nursingRooms: ['Guest Relations near Section 130'],
        atms: ['Near each main gate', 'Club level', 'Sections 115, 215, 415'],
        wifi: { available: true, network: 'Angels_FreeWiFi', freeZones: ['All seating areas'] },
        chargingStations: ['Club level', 'Diamond Club'],
        kidZones: [
          { name: 'Kids Clubhouse', location: 'Right field', activities: ['Photo ops', 'Games', 'Face painting on weekends'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels have designated wheelchair spaces'],
          entrance: 'All gates are accessible',
          elevators: ['Home Plate Gate', 'Sections 108, 130, 236']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels near elevators'],
        accessibleConcessions: ['All main concession stands'],
        parkingSpaces: 'Available in all lots - arrive early'
      },
      gameDay: {
        tips: [
          { title: 'Arrive Early', description: 'Gates open 90 minutes early - beat traffic and heat', category: 'arrival' },
          { title: 'Shade Strategy', description: 'For day games, start on third base side', category: 'shade' },
          { title: 'Try Chronic Tacos', description: 'Local favorite at Section 130', category: 'food' },
          { title: 'Stay for Fireworks', description: 'Friday night games feature post-game fireworks', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before first pitch',
          battingPractice: 'Angels BP 2.5 hours before game',
          firstPitch: '7:07 PM weekdays, 6:07 PM Saturdays, 1:07 PM Sundays',
          rushHours: ['6:00-6:45 PM for night games']
        },
        security: {
          allowedBags: 'Soft-sided bags under 16"x16"x8"',
          prohibitedItems: ['Hard coolers', 'Glass bottles', 'Weapons', 'Drones', 'Large umbrellas'],
          metalDetectors: true,
          clearBagPolicy: false
        }
      },
      neighborhood: {
        name: 'Platinum Triangle',
        description: 'Entertainment district with Disneyland nearby',
        beforeGame: ['Golden Road Brewing', 'JT Schmid\'s Restaurant', 'Noble Ale Works'],
        afterGame: ['Downtown Disney', 'The Catch restaurant', 'Anaheim Packing District'],
        radius: '1-2 miles'
      },
      transportation: {
        address: '2000 E Gene Autry Way, Anaheim, CA 92806',
        publicTransit: {
          bus: [{ routes: ['OCTA 50', 'OCTA 430'], stops: ['Katella/State College', 'Gene Autry Way'] }],
          train: [{ lines: ['Metrolink Orange County Line'], station: 'Anaheim Station', walkTime: '30 minutes or OCTA bus' }]
        },
        driving: {
          majorRoutes: ['I-5 Exit Katella', 'CA-57 to Katella', 'CA-22 to I-5'],
          typicalTraffic: 'Heavy 5:30-7 PM weekdays',
          bestApproach: 'From CA-57 to avoid I-5 congestion'
        },
        rideShare: {
          pickupZone: 'Lot 5 near Douglass Road',
          dropoffZone: 'State College Blvd entrance',
          surgePricing: '2-3x after games',
          alternativeTip: 'Walk to Katella Ave for better rates'
        }
      },
      history: {
        timeline: [
          { year: 1966, event: 'Stadium opens as Anaheim Stadium' },
          { year: 1979, event: 'Enclosed for NFL Rams' },
          { year: 1998, event: 'Renovated back to baseball-only' },
          { year: 2002, event: 'Angels win World Series' },
          { year: 2003, event: 'Renamed Angel Stadium of Anaheim' }
        ],
        notableGames: [
          { date: '1967-07-11', description: 'First All-Star Game at stadium' },
          { date: '2002-10-27', description: 'World Series Championship clinched' },
          { date: '2014-07-08', description: 'Mike Trout hits for the cycle' }
        ],
        traditions: [
          { name: 'Rally Monkey', description: 'Video board rally monkey appears in key moments' },
          { name: 'Fireworks Fridays', description: 'Post-game fireworks every Friday home game' }
        ],
        retired: [
          { number: '11', player: 'Jim Fregosi', year: 1998 },
          { number: '26', player: 'Gene Autry', year: 1982 },
          { number: '29', player: 'Rod Carew', year: 1991 },
          { number: '30', player: 'Nolan Ryan', year: 1992 },
          { number: '50', player: 'Jimmie Reese', year: 1995 }
        ]
      },
      fanExperience: {
        atmosphere: 'Family-friendly with laid-back Southern California vibe',
        bestExperiences: [
          'Rally Monkey appearances',
          'Fireworks Friday nights',
          'Mike Trout at-bats',
          'Rock waterfall home run celebration'
        ],
        traditions: ['Rally Monkey', 'Calling "Light Wave"', 'Build Me Up Buttercup sing-along'],
        music: 'Classic rock and modern hits mix',
        mascot: { name: 'Rally Monkey', description: 'Famous video board monkey that appears during rallies' },
        fanGroups: [
          { name: 'Halo Honks', section: 'Right Field', description: 'Loyal season ticket holders' }
        ]
      },
      proTips: {
        insiderTips: [
          'Park at Noble Ale Works and have a beer before walking over',
          'Tuesday games often have best ticket deals',
          'Club level restrooms rarely have lines',
          'Get autographs near dugout during BP',
          'Right field gate typically has shortest lines'
        ],
        avoidThese: [
          'Parking in Lot 1 after game - worst exit traffic',
          'Right field pavilion seats for day games',
          'Concessions right at first pitch',
          'I-5 North immediately after games'
        ],
        hiddenGems: [
          'Brewery X Beer Garden in left field',
          'Saint Archer Brewing cart behind section 130',
          'Viewing area behind section 258',
          'Family restrooms have no lines'
        ],
        photoSpots: [
          'Big A sign from parking lot',
          'Home plate gate entrance',
          'Rock waterfall from outfield',
          'Team photo spot behind section 108'
        ],
        bestValue: [
          'Terrace Level corners under $20',
          'Tuesday night specials',
          'Pavilion seats with bring-your-own-food',
          'Happy Hour at Brewery X before first pitch'
        ]
      }
    },


  'padres': {
    id: 'padres',
    name: 'Petco Park',
    team: 'San Diego Padres',
    opened: 2004,
    capacity: 40209,
    overview: {
      description: 'Petco Park in downtown San Diego is widely considered one of the best ballparks in baseball, featuring perfect weather, a unique sandbox, and the historic Western Metal Supply Co. building integrated into the structure.',
      highlights: [
        'Downtown location in East Village',
        'Western Metal Supply Co. building in left field',
        'The Beach sandbox beyond center field',
        'Year-round perfect weather'
      ],
      uniqueFeatures: [
        'Western Metal Supply Co. building as left field foul pole',
        'The Beach sandbox for kids',
        'Park at the Park grass berm',
        'Rooftop bar with city views'
      ],
      renovations: [
        { year: 2013, description: 'Moved in outfield fences' },
        { year: 2016, description: 'New HD video boards' },
        { year: 2022, description: 'Gallagher Square renovation' }
      ]
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck third base side', 'Field Level 101-108', 'Toyota Terrace'],
        afternoon: ['Press Level sections', 'Field Level 115-124', 'Western Metal Supply'],
        evening: ['Most sections after 5 PM', 'Third base line', 'Behind home plate']
      },
      coveredSeating: ['Press Level under overhang', 'Toyota Terrace', 'Premium clubs'],
      shadeTips: [
        'Third base side gets shade first',
        'Upper levels provide shade to lower sections',
        'Coastal breeze keeps temperatures comfortable',
        'Seek Press Level for guaranteed shade'
      ],
      sunProtection: {
        sunscreenStations: ['Section 107', 'Section 207', 'Section 307'],
        shadedConcourses: ['All concourse areas', 'Press Level concourse'],
        indoorAreas: ['Omni Premier Club', 'Lexus Premier Club', 'Team Store']
      },
      worstSunExposure: ['Right field sections 131-135', 'Park at the Park', 'Upper deck first base 301-307'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 65, avgHumidity: 65, rainChance: 10, typicalConditions: 'Perfect baseball weather', shadeTip: 'Light shade needed' },
        { month: 'May', avgTemp: 67, avgHumidity: 68, rainChance: 5, typicalConditions: 'May Gray marine layer', shadeTip: 'Natural cloud coverage common' },
        { month: 'June', avgTemp: 70, avgHumidity: 70, rainChance: 2, typicalConditions: 'June Gloom continues', shadeTip: 'Morning clouds, afternoon sun' },
        { month: 'July', avgTemp: 74, avgHumidity: 68, rainChance: 1, typicalConditions: 'Warm and sunny', shadeTip: 'Shade important for day games' },
        { month: 'August', avgTemp: 76, avgHumidity: 66, rainChance: 1, typicalConditions: 'Peak summer heat', shadeTip: 'Essential shade for comfort' },
        { month: 'September', avgTemp: 74, avgHumidity: 64, rainChance: 3, typicalConditions: 'Still warm', shadeTip: 'Shade recommended' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Omni Premier Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Private entrance'], access: 'Behind home plate' },
          { name: 'Lexus Premier Club', perks: ['Field level views', 'Premium menu', 'Climate controlled'], access: 'First base line' },
          { name: 'Western Metal Supply', perks: ['Historic building', 'Unique views', 'Private bar'], access: 'Left field corner' }
        ],
        suites: { levels: ['Suite Level', 'Party Suites'], amenities: ['Private restrooms', 'Catering', 'HDTV', 'Balcony seating'] },
        specialAreas: [
          { name: 'The Beach', description: 'Sand play area beyond center field', capacity: 50 },
          { name: 'Gallagher Square', description: 'Grass berm with picnic area', capacity: 300 }
        ]
      },
      budgetOptions: ['Upper deck corners', 'Park at the Park', 'Toyota Terrace'],
      familySections: ['The Beach', 'Park at the Park', 'Upper 301-303'],
      standingRoom: ['Toyota Terrace', 'Rooftop areas'],
      partyAreas: [
        { name: 'The Loft', capacity: '50', description: 'Rooftop party space', amenities: ['Full bar', 'TVs', 'Lounge seating'] },
        { name: 'Beach Club', capacity: '100', description: 'Party deck', amenities: ['Bar', 'Food service', 'Standing tables'] }
      ],
      tips: [
        { section: 'Toyota Terrace', tip: 'All-you-can-eat value option', category: 'value' },
        { section: 'Western Metal Building', tip: 'Unique historic setting', category: 'experience' },
        { section: 'Press Level 205-210', tip: 'Best shade all game long', category: 'shade' },
        { section: 'Field 119-121', tip: 'Close to visitor dugout', category: 'view' }
      ]
    },
    concessions: {
      signature: ['Fish tacos', 'Tri-tip nachos', 'Hodad\'s burgers', 'Phil\'s BBQ'],
      local: ['California burritos', 'Carnitas fries', 'Lucha Libre tacos', 'Board and Brew sandwiches'],
      healthy: ['Poke bowls', 'Seaside Market salads', 'Fresh fruit', 'Veggie wraps'],
      vegetarian: ['Beyond burgers', 'Veggie tacos', 'Salad options'],
      glutenFree: ['GF buns available', 'Nachos', 'Salads'],
      kidsFriendly: ['Kids meals', 'Ice cream', 'Churros', 'Popcorn'],
      alcohol: {
        beer: ['Stone Brewing', 'Ballast Point', 'Modern Times', 'Local craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Stone', 'Ballast Point', 'Modern Times', 'Karl Strauss']
      }
    },
    parking: {
      lots: [
        { name: 'Tailgate Park', distance: 'Adjacent', price: '$35', shadedSpots: false, covered: false, tip: 'Opens 2.5 hours early for tailgating' },
        { name: 'Lexus Premier Lot', distance: '0.1 miles', price: '$40', shadedSpots: false, covered: false },
        { name: '6th & K Parkade', distance: '0.3 miles', price: '$20', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Meters and time limits',
        tip: 'Limited availability on game days'
      },
      alternativeTransport: {
        publicTransit: ['Trolley Green Line to Gaslamp', 'MTS buses'],
        rideShare: 'Multiple drop-off points around ballpark',
        bicycle: 'Bike racks at multiple entrances'
      }
    },
    gates: [
      { name: 'Home Plate Gate', location: 'Park Boulevard', bestFor: ['Main entrance', 'Team store'], openTime: '2 hours before' },
      { name: 'East Village Gate', location: 'J Street', bestFor: ['Upper deck', 'Quick entry'], openTime: '1.5 hours before' },
      { name: 'Gaslamp Gate', location: 'L Street', bestFor: ['Field level', 'Restaurants'], openTime: '2 hours before' },
      { name: 'Park at the Park', location: 'Outfield', bestFor: ['Berm seating', 'Families'], openTime: '2.5 hours before' }
    ],
    amenities: {
      merchandise: [
        { location: 'The Majestic Team Store', exclusive: ['Game-used items', 'Custom jerseys'] },
        { location: 'The Beach Store', exclusive: ['Kids items', 'Beach themed gear'] }
      ],
      firstAid: ['Section 107', 'Section 213', 'Section 319'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services Level 1 and 3'],
      atms: ['All concourse levels'],
      wifi: { available: true, network: 'Padres_Free_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Club levels', 'Toyota Terrace'],
      kidZones: [
        { name: 'The Beach', location: 'Beyond center field', activities: ['Sandbox', 'Playground', 'Kids concessions'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['All levels serviced by elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'All lots have ADA spaces'
    },
    gameDay: {
      tips: [
        { title: 'Explore East Village', description: 'Great bars and restaurants nearby', category: 'experience' },
        { title: 'Arrive early for beach', description: 'The Beach fills up quickly', category: 'family' },
        { title: 'Tailgate Park party', description: 'Pre-game tailgating allowed', category: 'experience' },
        { title: 'Stay for fireworks', description: 'Friday night fireworks shows', category: 'experience' },
        { title: 'Gaslamp after dark', description: 'Nightlife district adjacent', category: 'departure' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: 'Varies by team',
        firstPitch: '6:40 PM weekdays, 5:40 PM weekends',
        rushHours: ['30 minutes before game', '7th inning']
      },
      security: {
        allowedBags: 'Single compartment bags 7"x10" or smaller',
        prohibitedItems: ['Outside food/drinks except water', 'Umbrellas', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'East Village/Gaslamp Quarter',
      description: 'Vibrant downtown districts with restaurants, bars, and nightlife',
      beforeGame: ['Bub\'s at the Ballpark', 'Lolita\'s Mexican', 'The Tin Fish', 'Yard House'],
      afterGame: ['Barleymash', 'The Field', 'Star Bar', 'Noble Experiment'],
      radius: '0.5 miles'
    },
    transportation: {
      address: '100 Park Boulevard, San Diego, CA 92101',
      publicTransit: {
        subway: [
          { lines: ['Green Line Trolley'], station: 'Gaslamp Quarter', walkTime: '7 minutes' },
          { lines: ['Blue/Orange Line'], station: '12th & Imperial', walkTime: '10 minutes' }
        ],
        bus: [
          { routes: ['3', '11', '120', '280', '290'], stops: ['Multiple downtown stops'] }
        ]
      },
      driving: {
        majorRoutes: ['I-5 to 10th Avenue', 'CA-163 to 6th Avenue', 'CA-94 to Park Boulevard'],
        typicalTraffic: 'Moderate, downtown congestion',
        bestApproach: 'From north via 163, from south via I-5'
      },
      rideShare: {
        pickupZone: 'L Street between 10th and 11th',
        dropoffZone: 'Multiple locations around ballpark',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to East Village for better rates'
      }
    },
    history: {
      timeline: [
        { year: 2004, event: 'Petco Park opens' },
        { year: 2016, event: 'All-Star Game hosted' },
        { year: 2020, event: 'Playoff baseball returns' },
        { year: 2022, event: 'Wild Card series hosted' }
      ],
      notableGames: [
        { date: '2004-04-08', description: 'First game at Petco Park' },
        { date: '2020-10-01', description: 'First playoff game in 14 years' }
      ],
      traditions: [
        { name: 'Friar Faithful', description: 'Dedicated fan base' },
        { name: 'Bells at the mission', description: 'Home run celebration' }
      ],
      retired: [
        { number: '6', player: 'Steve Garvey', year: 1989 },
        { number: '19', player: 'Tony Gwynn', year: 2004 },
        { number: '31', player: 'Dave Winfield', year: 2001 },
        { number: '35', player: 'Randy Jones', year: 1997 },
        { number: '51', player: 'Trevor Hoffman', year: 2011 }
      ]
    },
    fanExperience: {
      atmosphere: 'Laid-back Southern California vibe with passionate fans',
      bestExperiences: ['The Beach sandbox', 'Park at the Park', 'Craft beer selection', 'Perfect weather'],
      traditions: ['Swinging Friar mascot', 'Bells for home runs', 'Brown and yellow throwbacks'],
      mascot: { name: 'Swinging Friar', description: 'Padres monk mascot since 1958' },
      fanGroups: [
        { name: 'The Friar Faithful', section: 'Various', description: 'Die-hard supporter group' }
      ]
    },
    proTips: {
      insiderTips: [
        'Park at the Park free viewing until 7:30 PM',
        'Hodad\'s burgers are worth the line',
        'Western Metal Supply building has best sunset views',
        'Gallagher Square great for families'
      ],
      avoidThese: [
        'Driving without pre-paid parking',
        'Right field on sunny day games',
        'Leaving immediately after game (traffic)'
      ],
      hiddenGems: [
        'Rooftop bar at Altitude Sky Lounge',
        'Tony Gwynn statue garden',
        'Craft beer garden in Gallagher Square'
      ],
      photoSpots: [
        'Home plate gate',
        'Tony Gwynn statue',
        'Western Metal Supply Co. building',
        'The Beach with field view'
      ],
      bestValue: [
        'Toyota Terrace all-you-can-eat',
        'Park at the Park (free until 7:30)',
        'Upper deck corners'
      ]
    }
  }
};
