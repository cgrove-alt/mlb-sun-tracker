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

    'astros': {
      id: 'astros',
      name: 'Minute Maid Park',
      team: 'Houston Astros',
      opened: 2000,
      capacity: 41168,
      overview: {
        description: 'Minute Maid Park, nicknamed "The Juice Box," is Houston\'s retractable-roof ballpark featuring a unique train that runs along the left field wall. The stadium combines classic ballpark architecture with modern amenities and Texas-sized features.',
        highlights: [
          'Retractable roof opens/closes in 12-20 minutes',
          'Famous left field train on 800-foot track',
          'Tal\'s Hill removed in 2016 renovation',
          'Crawford Boxes - shortest porch in MLB at 315 feet'
        ],
        uniqueFeatures: [
          'Union Station lobby entrance',
          'Left field train with conductor',
          'Crawford Boxes in left field',
          'Manual scoreboard in left field',
          'Torchy\'s Tacos in center field'
        ],
        renovations: [
          { year: 2011, description: 'New HD video board installed' },
          { year: 2016, description: 'Tal\'s Hill removed, center field renovated' },
          { year: 2017, description: 'World Series Champions improvements' }
        ],
        previousNames: ['Enron Field (2000-2002)']
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Roof typically closed for day games'],
          afternoon: ['All sections with closed roof', 'Club Level 210-230'],
          evening: ['Mezzanine under overhang', 'Upper deck sections']
        },
        coveredSeating: ['All seats when roof is closed', 'Club Level', 'Suite Level'],
        shadeTips: [
          'Roof usually closed April-September for AC',
          'When open, upper deck provides shade below',
          'Left field gets afternoon shade first',
          'Crawford Boxes can be hot even with roof open'
        ],
        sunProtection: {
          sunscreenStations: ['Guest Services locations'],
          shadedConcourses: ['All concourses are covered'],
          indoorAreas: ['Union Station lobby', 'Team Store', 'Insperity Club']
        },
        worstSunExposure: ['Crawford Boxes 100-104 when roof open', 'Outfield sections 152-154'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 75, avgHumidity: 70, rainChance: 20, typicalConditions: 'Humid, possible storms', shadeTip: 'Roof likely closed' },
          { month: 'May', avgTemp: 82, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'AC on with roof closed' },
          { month: 'June', avgTemp: 88, avgHumidity: 75, rainChance: 20, typicalConditions: 'Very hot', shadeTip: 'Roof always closed' },
          { month: 'July', avgTemp: 91, avgHumidity: 75, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Indoor comfort essential' },
          { month: 'August', avgTemp: 91, avgHumidity: 75, rainChance: 25, typicalConditions: 'Extreme heat', shadeTip: 'Arrive early for AC' },
          { month: 'September', avgTemp: 86, avgHumidity: 75, rainChance: 20, typicalConditions: 'Still very hot', shadeTip: 'Roof closed most games' },
          { month: 'October', avgTemp: 78, avgHumidity: 70, rainChance: 15, typicalConditions: 'Finally cooling', shadeTip: 'Roof may open for playoffs' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'Diamond Club', perks: ['All-inclusive dining', 'Premium bar', 'Padded seats'], access: 'Behind home plate' },
            { name: 'Insperity Club', perks: ['Upscale dining', 'Full bar', 'Climate controlled'], access: 'Suite Level' }
          ],
          suites: {
            levels: ['Suite Level', 'Party Suites'],
            amenities: ['Private bathrooms', 'Catering', 'HDTV', 'Climate control']
          },
          specialAreas: [
            { name: 'Crawford Boxes', description: 'Iconic left field seats', capacity: 500 },
            { name: 'Torchy\'s Tacos Deck', description: 'Center field deck with food', capacity: 100 }
          ]
        },
        budgetOptions: ['View Deck 400s', 'Outfield Deck', 'Upper corners'],
        familySections: ['Family Deck sections 433-436'],
        standingRoom: ['Budweiser Brew House', 'Center Field viewing areas'],
        partyAreas: [
          { name: 'Home Run Porch', capacity: '150', amenities: ['Bar service', 'Standing tables'] },
          { name: 'Torchy\'s Deck', capacity: '100', amenities: ['Tacos', 'Drinks', 'Games'] }
        ],
        tips: [
          { section: 'Crawford Boxes', tip: 'Iconic but hot when roof open', category: 'experience' },
          { section: 'Club 220-225', tip: 'Best shade and amenities combo', category: 'shade' },
          { section: 'Diamond Club', tip: 'Ultimate all-inclusive experience', category: 'experience' },
          { section: 'View Deck 435', tip: 'Great value with AC comfort', category: 'value' }
        ]
      },
      concessions: {
        signature: ['Torchy\'s Tacos', 'Jackson Street BBQ', 'Killer Korn', 'Minute Maid Lemonade'],
        local: ['Pappas BBQ', 'Saint Arnold Brewing', 'Shipley Do-Nuts', 'Whataburger-style burgers'],
        healthy: ['Salad station', 'Fresh fruit', 'Veggie wraps'],
        vegetarian: ['Black bean burgers', 'Veggie tacos', 'Salads'],
        glutenFree: ['GF buns available', 'Rice bowls', 'Nachos'],
        kidsFriendly: ['Chick-fil-A', 'Pizza', 'Hot dogs', 'Ice cream'],
        alcohol: {
          beer: ['Saint Arnold', 'Karbach', '8th Wonder', 'Budweiser'],
          wine: true,
          cocktails: true,
          localBreweries: ['Saint Arnold', 'Karbach', '8th Wonder', 'Eureka Heights']
        }
      },
      parking: {
        lots: [
          { name: 'Diamond Lot', distance: 'Adjacent', price: '$35', shadedSpots: false, covered: false, tip: 'Valet available' },
          { name: 'Garage B', distance: '5 min walk', price: '$20', shadedSpots: true, covered: true, tip: 'Best for shade' },
          { name: 'Lot C', distance: '10 min walk', price: '$15', shadedSpots: false, covered: false },
          { name: 'Street meters', distance: 'Varies', price: '$1.25/hr', shadedSpots: false, covered: false, tip: 'Free after 6 PM' }
        ],
        alternativeTransport: {
          publicTransit: ['METRORail Red Line to Convention District Station', 'Multiple bus routes'],
          rideShare: 'Texas Ave between Hamilton and Chartres',
          bicycle: 'Bike racks available at all gates'
        }
      },
      gates: [
        { name: 'Union Station North', location: 'Left field', bestFor: ['Crawford Boxes', 'Left field'], openTime: '2 hours before first pitch' },
        { name: 'Home Plate Entry', location: 'Behind home plate', bestFor: ['Diamond Club', 'Field boxes'], openTime: '90 minutes before first pitch' },
        { name: 'Center Field Gate', location: 'Center field', bestFor: ['Outfield deck', 'Torchy\'s'], openTime: '90 minutes before first pitch' }
      ],
      amenities: {
        merchandise: [
          { location: 'Main Team Store - Union Station', exclusive: ['Custom jerseys', 'Game-used items'] },
          { location: 'Multiple kiosks throughout' }
        ],
        firstAid: ['Section 113', 'Section 230', 'Section 407'],
        babyChanging: ['All family restrooms', 'Guest Services'],
        nursingRooms: ['Guest Services behind Section 126'],
        atms: ['All gate entries', 'Club level', 'Throughout concourses'],
        wifi: { available: true, network: 'Astros_WiFi' },
        chargingStations: ['Club level', 'Diamond Club', 'Insperity Club'],
        kidZones: [
          { name: 'Squeeze Play Zone', location: 'Center field', activities: ['Playground', 'Games', 'Speed pitch'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels have ADA seating'],
          entrance: 'All gates are accessible',
          elevators: ['All levels accessible via elevators']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All permanent stands'],
        parkingSpaces: 'All lots have designated spaces'
      },
      gameDay: {
        tips: [
          { title: 'Arrive Early for AC', description: 'Beat the Houston heat inside', category: 'weather' },
          { title: 'Try Torchy\'s Tacos', description: 'Austin favorite in center field', category: 'food' },
          { title: 'Watch the train', description: 'Runs after Astros homers', category: 'experience' },
          { title: 'Explore Union Station', description: 'Historic lobby worth seeing', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '2 hours before first pitch (Union Station)',
          battingPractice: 'Astros BP 2.5 hours before',
          firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
          rushHours: ['5:30-7:00 PM downtown traffic']
        },
        security: {
          allowedBags: 'Bags under 16"x16"x8"',
          prohibitedItems: ['Outside food/drinks (sealed water OK)', 'Weapons', 'Drones'],
          metalDetectors: true,
          clearBagPolicy: false
        }
      },
      neighborhood: {
        name: 'Downtown Houston',
        description: 'Urban setting with restaurants and bars',
        beforeGame: ['8th Wonder Brewery', 'Truck Yard Houston', 'Rodeo Goat'],
        afterGame: ['Main Street bars', 'Market Square Park area', 'Discovery Green'],
        radius: '0.5-1 mile walk'
      },
      transportation: {
        address: '501 Crawford St, Houston, TX 77002',
        publicTransit: {
          subway: [{ lines: ['METRORail Red Line'], station: 'Convention District', walkTime: '5 minutes' }],
          bus: [{ routes: ['Multiple downtown routes'], stops: ['Crawford & Congress', 'Texas & Crawford'] }]
        },
        driving: {
          majorRoutes: ['I-45 to downtown', 'I-10 to downtown', 'US-59/I-69 to downtown'],
          typicalTraffic: 'Heavy 4:30-6:30 PM',
          bestApproach: 'US-59 from southwest suburbs'
        },
        rideShare: {
          pickupZone: 'Texas Ave between Hamilton and Chartres',
          dropoffZone: 'Crawford Street',
          surgePricing: '2-4x after games',
          alternativeTip: 'Walk few blocks away for better rates'
        }
      },
      history: {
        timeline: [
          { year: 2000, event: 'Stadium opens as Enron Field' },
          { year: 2002, event: 'Renamed Minute Maid Park' },
          { year: 2005, event: 'First World Series at park' },
          { year: 2017, event: 'World Series Championship' },
          { year: 2022, event: 'World Series Championship' }
        ],
        notableGames: [
          { date: '2017-11-01', description: 'World Series Game 7 victory' },
          { date: '2022-11-05', description: 'World Series clincher vs Phillies' },
          { date: '2019-10-30', description: 'World Series Game 7 loss to Nationals' }
        ],
        traditions: [
          { name: 'Train Run', description: 'Train runs after every Astros home run' },
          { name: 'Deep in the Heart of Texas', description: '7th inning sing-along' }
        ],
        retired: [
          { number: '5', player: 'Jeff Bagwell', year: 2007 },
          { number: '7', player: 'Craig Biggio', year: 2008 },
          { number: '24', player: 'Jimmy Wynn', year: 2011 },
          { number: '25', player: 'Jose Cruz', year: 1992 },
          { number: '32', player: 'Jim Umbricht', year: 1965 },
          { number: '33', player: 'Mike Scott', year: 1992 },
          { number: '34', player: 'Nolan Ryan', year: 1996 },
          { number: '40', player: 'Don Wilson', year: 1975 },
          { number: '49', player: 'Larry Dierker', year: 2002 }
        ]
      },
      fanExperience: {
        atmosphere: 'Loud and energetic, especially in playoffs',
        bestExperiences: [
          'Train celebrating home runs',
          'Jose Altuve at-bats',
          'Closed roof comfort in summer',
          'Playoff atmosphere'
        ],
        traditions: ['Train runs', 'Deep in the Heart of Texas', 'Stand up for Altuve'],
        music: 'Mix of country, Latin music, and modern hits',
        mascot: { name: 'Orbit', description: 'Green alien mascot with attitude' },
        fanGroups: [
          { name: 'The Crawford Box Crew', section: '100-104', description: 'Rowdy left field fans' }
        ]
      },
      proTips: {
        insiderTips: [
          '8th Wonder Brewery is 5-minute walk for pregame',
          'Union Station entrance least crowded',
          'Club level has best AC and shortest lines',
          'Saint Arnold beer garden in left field',
          'Garage B is covered and worth extra cost'
        ],
        avoidThese: [
          'Driving on I-45 during rush hour',
          'Lot C in summer - no shade walking',
          'Crawford Boxes when roof is open',
          'Concessions right at first pitch'
        ],
        hiddenGems: [
          'Jackson Street BBQ behind section 112',
          'Craft beer selection at Budweiser Brew House',
          'Manual scoreboard viewing area',
          'Team store has game-used baseballs'
        ],
        photoSpots: [
          'Union Station lobby',
          'With the train in left field',
          'Home plate gate plaza',
          'Center field with downtown skyline'
        ],
        bestValue: [
          'View Deck seats under $15',
          'Happy Hour at bars before 7 PM games',
          '$5 tickets for some weekday games',
          'Bring sealed water bottle'
        ]
      }
    },

    'athletics': {
      id: 'athletics',
      name: 'Oakland Coliseum',
      team: 'Oakland Athletics',
      opened: 1966,
      capacity: 46847,
      overview: {
        description: 'Oakland Coliseum, the last multi-purpose stadium in MLB, is known for its passionate fan base despite aging facilities. Home to the A\'s since 1968, it features the largest foul territory in baseball and Mount Davis, the massive upper deck structure in center field.',
        highlights: [
          'Last dual-purpose stadium in MLB',
          'Largest foul territory in baseball',
          'Mount Davis seats (usually tarped)',
          'Passionate and creative fan base'
        ],
        uniqueFeatures: [
          'Mount Davis structure in outfield',
          'Massive foul territory',
          'Drum section in bleachers',
          'BART bridge to stadium',
          'Championship banners display'
        ],
        renovations: [
          { year: 1995, description: 'Mount Davis added for Raiders' },
          { year: 2017, description: 'New video boards installed' },
          { year: 2019, description: 'A\'s Access membership areas added' }
        ],
        previousNames: ['Oakland-Alameda County Coliseum', 'Network Associates Coliseum', 'McAfee Coliseum', 'O.co Coliseum']
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Plaza Level behind home plate', 'Field Level 113-126'],
          afternoon: ['Plaza Level 200s', 'Third base side sections', 'Mount Davis provides shade'],
          evening: ['Most sections shaded after 5 PM', 'First base side gains shade']
        },
        coveredSeating: ['Plaza Club', 'Limited overhang sections'],
        shadeTips: [
          'Third base side best for afternoon games',
          'Mount Davis creates shade for field level',
          'Bleachers have no shade coverage',
          'Plaza level overhang provides some coverage'
        ],
        sunProtection: {
          sunscreenStations: ['Guest Services locations'],
          shadedConcourses: ['Plaza level concourse', 'Club level'],
          indoorAreas: ['Plaza Club', 'Team Store', 'The Treehouse']
        },
        worstSunExposure: ['Bleachers 145-150', 'Field Level right field', 'Upper deck when open'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 65, avgHumidity: 65, rainChance: 15, typicalConditions: 'Cool and pleasant', shadeTip: 'Sun not intense yet' },
          { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 8, typicalConditions: 'Mild with marine layer', shadeTip: 'Afternoon shade helpful' },
          { month: 'June', avgTemp: 72, avgHumidity: 65, rainChance: 3, typicalConditions: 'Warming up', shadeTip: 'Seek shade for day games' },
          { month: 'July', avgTemp: 73, avgHumidity: 65, rainChance: 1, typicalConditions: 'Warm but breezy', shadeTip: 'Third base side recommended' },
          { month: 'August', avgTemp: 74, avgHumidity: 65, rainChance: 1, typicalConditions: 'Peak warmth', shadeTip: 'Plaza level for shade' },
          { month: 'September', avgTemp: 75, avgHumidity: 60, rainChance: 3, typicalConditions: 'Indian summer', shadeTip: 'Evening games more comfortable' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'Plaza Club', perks: ['Indoor/outdoor seating', 'Inclusive food', 'Private bar'], access: 'Plaza Level' }
          ],
          suites: {
            levels: ['Suite Level behind home plate'],
            amenities: ['Private restrooms', 'Catering', 'HDTV', 'Indoor/outdoor seating']
          },
          specialAreas: [
            { name: 'The Treehouse', description: 'Left field social space with games and food', capacity: 200 },
            { name: 'Championship Plaza', description: 'Standing room party area' }
          ]
        },
        budgetOptions: ['Bleachers 145-150', 'Upper Reserve (when open)', 'Value Deck'],
        familySections: ['Family Value sections'],
        standingRoom: ['The Treehouse', 'Championship Plaza', 'Stomper\'s Fun Zone'],
        partyAreas: [
          { name: 'The Treehouse', capacity: '200', amenities: ['Full bar', 'Food trucks', 'Games'] },
          { name: 'Shibe Park Tavern', capacity: '150', amenities: ['Craft beer', 'Standing tables'] }
        ],
        tips: [
          { section: 'Field 113-120', tip: 'Best value with shade', category: 'value' },
          { section: 'Bleachers 149', tip: 'Right field drummers and diehards', category: 'experience' },
          { section: 'Plaza Club', tip: 'Climate controlled option', category: 'shade' },
          { section: 'The Treehouse', tip: 'Fun social atmosphere', category: 'experience' }
        ]
      },
      concessions: {
        signature: ['Shibe Park Tavern craft beers', 'Loaded nachos', 'Coliseum Dogs'],
        local: ['Drake\'s Brewing', 'Everett & Jones BBQ', 'Cholita Linda tacos'],
        healthy: ['Veggie dogs', 'Salads', 'Fresh fruit'],
        vegetarian: ['Impossible burgers', 'Veggie nachos'],
        glutenFree: ['GF beer available', 'GF buns on request'],
        kidsFriendly: ['Pizza', 'Chicken tenders', 'Ice cream'],
        alcohol: {
          beer: ['Drake\'s', 'Lagunitas', 'Coors', 'Modelo'],
          wine: true,
          cocktails: true,
          localBreweries: ['Drake\'s Brewing', 'Oakland United', 'Ghost Town Brewing']
        }
      },
      parking: {
        lots: [
          { name: 'Lot A', distance: 'Adjacent', price: '$30', shadedSpots: false, covered: false, tip: 'Closest to gates' },
          { name: 'Lot B/C', distance: '5 min walk', price: '$20', shadedSpots: false, covered: false },
          { name: 'BART Parking', distance: '10 min walk', price: '$3', shadedSpots: false, covered: false, tip: 'Take BART bridge to stadium' }
        ],
        alternativeTransport: {
          publicTransit: ['BART Coliseum Station - direct bridge to stadium', 'AC Transit buses'],
          rideShare: 'Designated zones near Gates B and D',
          bicycle: 'Bike parking at all gates'
        }
      },
      gates: [
        { name: 'Gate A', location: 'Home plate', bestFor: ['Field Level behind plate'], openTime: '2 hours before first pitch' },
        { name: 'Gate B', location: 'First base', bestFor: ['Field Level 100s'], openTime: '90 minutes before first pitch' },
        { name: 'Gate C', location: 'Third base', bestFor: ['Field Level 200s'], openTime: '90 minutes before first pitch' },
        { name: 'Gate D', location: 'Outfield', bestFor: ['Bleachers', 'Treehouse'], openTime: '90 minutes before first pitch' }
      ],
      amenities: {
        merchandise: [
          { location: 'Main Team Store - Gate A', exclusive: ['Throwback jerseys', 'Kelly Green gear'] }
        ],
        firstAid: ['Section 120', 'Section 213'],
        babyChanging: ['Family restrooms all levels'],
        atms: ['All gate entries', 'Throughout concourses'],
        wifi: { available: true, network: 'OaklandColiseum_WiFi' },
        kidZones: [
          { name: 'Stomper\'s Fun Zone', location: 'West side plaza', activities: ['Speed pitch', 'Playground'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels have ADA seating'],
          entrance: 'All gates accessible',
          elevators: ['Available at all levels']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All permanent stands'],
        parkingSpaces: 'Available in all lots'
      },
      gameDay: {
        tips: [
          { title: 'Take BART', description: 'Avoid parking hassles with direct bridge', category: 'arrival' },
          { title: 'Visit The Treehouse', description: 'Fun pre-game atmosphere', category: 'experience' },
          { title: 'Join the drummers', description: 'Bleacher atmosphere is unique', category: 'experience' },
          { title: 'Dollar Hot Dog Wednesdays', description: 'Best concession deal', category: 'food' }
        ],
        typicalSchedule: {
          gatesOpen: '2 hours before (Gate A), 90 minutes (others)',
          battingPractice: 'A\'s BP 2.5 hours before',
          firstPitch: '7:07 PM weekdays, 6:07 PM Saturdays, 1:07 PM Sundays',
          rushHours: ['5:30-6:45 PM for night games']
        },
        security: {
          allowedBags: 'Soft bags under 16"x16"x8"',
          prohibitedItems: ['Hard coolers', 'Glass', 'Weapons', 'Noisemakers (except drums in designated area)'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'East Oakland',
        description: 'Industrial area with limited nearby options',
        beforeGame: ['San Leandro Marina restaurants (10 min)', 'Jack London Square (15 min)'],
        afterGame: ['Downtown Oakland bars', 'Chinatown restaurants'],
        radius: 'Most options require driving'
      },
      transportation: {
        address: '7000 Coliseum Way, Oakland, CA 94621',
        publicTransit: {
          subway: [{ lines: ['BART Green/Orange/Blue'], station: 'Coliseum', walkTime: 'Direct bridge' }],
          bus: [{ routes: ['AC Transit 45, 46, 73, 98'], stops: ['Coliseum BART'] }]
        },
        driving: {
          majorRoutes: ['I-880 Exit 66th Ave', 'I-580 to I-880'],
          typicalTraffic: 'Moderate, worse after games',
          bestApproach: 'I-880 from either direction'
        },
        rideShare: {
          pickupZone: 'Lot D near Gate D',
          dropoffZone: 'Gates B and D',
          surgePricing: '2-3x after games',
          alternativeTip: 'Walk to BART for easy exit'
        }
      },
      history: {
        timeline: [
          { year: 1966, event: 'Stadium opens' },
          { year: 1968, event: 'A\'s move from Kansas City' },
          { year: 1972, event: 'First World Series Championship' },
          { year: 1973, event: 'World Series repeat' },
          { year: 1974, event: 'World Series three-peat' },
          { year: 1989, event: 'World Series Championship' },
          { year: 1995, event: 'Mount Davis added' }
        ],
        notableGames: [
          { date: '1973-10-21', description: 'World Series Game 7 victory' },
          { date: '1989-10-28', description: 'World Series sweep completed' },
          { date: '2002-09-04', description: '20-game win streak' },
          { date: '2012-10-10', description: 'Walk-off ALDS victory' }
        ],
        traditions: [
          { name: 'The Drums', description: 'Right field bleacher drummers since 1981' },
          { name: 'White Cleats', description: 'Team tradition started by Charles Finley' }
        ],
        retired: [
          { number: '9', player: 'Reggie Jackson', year: 2004 },
          { number: '24', player: 'Rickey Henderson', year: 2009 },
          { number: '27', player: 'Catfish Hunter', year: 1991 },
          { number: '34', player: 'Rollie Fingers', year: 1993 },
          { number: '42', player: 'Jackie Robinson', year: 1997 },
          { number: '43', player: 'Dennis Eckersley', year: 2005 }
        ]
      },
      fanExperience: {
        atmosphere: 'Passionate despite challenges, creative and loyal fans',
        bestExperiences: [
          'Right field bleacher drummers',
          'The Treehouse social scene',
          'Affordable tickets',
          'BART bridge convenience'
        ],
        traditions: ['Drums and chants', 'White cleats', 'Green and gold army'],
        music: 'Classic rock and hip-hop heavy',
        mascot: { name: 'Stomper', description: 'White elephant mascot' },
        fanGroups: [
          { name: 'RF Bleacher Crew', section: '149', description: 'Die-hard drummers and chanters' },
          { name: 'Oakland 68s', description: 'Supporters group' }
        ]
      },
      proTips: {
        insiderTips: [
          'BART is easier than driving',
          'Treehouse has best food and beer selection',
          'Field Level sections 113-120 best value',
          'Wednesday dollar hot dogs',
          'A\'s Access membership great for frequent visitors'
        ],
        avoidThese: [
          'Parking in Lot A - hardest to exit',
          'Bleachers without sunscreen',
          'Driving after fireworks nights',
          'Upper deck (usually closed anyway)'
        ],
        hiddenGems: [
          'Championship Plaza displays',
          'Shibe Park Tavern craft selection',
          'View from BART bridge',
          'BBQ behind section 120'
        ],
        photoSpots: [
          'Championship Plaza with trophies',
          'BART bridge with stadium view',
          'With Stomper near kids zone',
          'Mount Davis from field level'
        ],
        bestValue: [
          'Treehouse tickets include food/drink credit',
          'Value Deck seats under $20',
          'A\'s Access membership pays for itself',
          'BART cheaper than parking'
        ]
      }
    },

    'diamondbacks': {
      id: 'diamondbacks',
      name: 'Chase Field',
      team: 'Arizona Diamondbacks',
      opened: 1998,
      capacity: 48633,
      overview: {
        description: 'Chase Field, originally Bank One Ballpark, was the first stadium in the US with a retractable roof over natural grass. Located in downtown Phoenix, this climate-controlled ballpark features the famous swimming pool in right-center field and operates powerful air conditioning even with the roof open.',
        highlights: [
          'First US stadium with retractable roof over grass',
          'Famous 35-person swimming pool suite',
          'Air conditioning operates even with roof open',
          'Second highest elevation stadium in MLB'
        ],
        uniqueFeatures: [
          'Swimming pool beyond right-center field fence',
          '9 million pounds of structural steel in roof',
          'Retractable roof opens/closes in 4+ minutes',
          'Massive HVAC system cools to 78°F'
        ],
        renovations: [
          { year: 2019, description: 'Converted natural grass to artificial turf' },
          { year: 2024, description: 'New LED lighting and CO12 speaker system' }
        ],
        previousNames: ['Bank One Ballpark (1998-2005)']
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Sections 314-318', 'Sections 328-332', 'Upper deck 300-302'],
          afternoon: ['Third base side sections', 'Sections 314-332 under roof', 'Upper deck corners'],
          evening: ['Most sections shaded', 'Third base side optimal', 'Left field areas']
        },
        coveredSeating: ['All 300-level sections when roof closed', 'Back rows of 319-327', 'Corner sections 135-138, 220-223'],
        shadeTips: [
          'Roof typically closed when temperature exceeds 100°F',
          'Air conditioning runs even with roof open',
          'Third base side gets shade first in afternoon',
          'Upper deck provides best sun protection',
          'Stadium cooled to 78°F when roof closed'
        ],
        sunProtection: {
          sunscreenStations: ['Guest Services locations', 'First Aid stations'],
          shadedConcourses: ['All concourses climate controlled', 'Main concourse fully enclosed'],
          indoorAreas: ['Audi Quattro Lounge', 'Sedona Club', 'Sonoran Room', 'Team Shop']
        },
        worstSunExposure: ['Right field sections 101-110', 'First base side afternoon games', 'Field level outfield'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 85, avgHumidity: 20, rainChance: 5, typicalConditions: 'Warm and dry, roof often open', shadeTip: 'Seek upper deck or third base side' },
          { month: 'May', avgTemp: 95, avgHumidity: 15, rainChance: 3, typicalConditions: 'Hot and very dry', shadeTip: 'Roof likely closed, any seat comfortable' },
          { month: 'June', avgTemp: 105, avgHumidity: 12, rainChance: 2, typicalConditions: 'Extreme heat begins', shadeTip: 'Stadium climate controlled with roof closed' },
          { month: 'July', avgTemp: 108, avgHumidity: 25, rainChance: 15, typicalConditions: 'Monsoon season, extreme heat', shadeTip: 'Stay inside - roof always closed' },
          { month: 'August', avgTemp: 106, avgHumidity: 30, rainChance: 20, typicalConditions: 'Peak monsoon, very hot', shadeTip: 'Climate controlled environment essential' },
          { month: 'September', avgTemp: 100, avgHumidity: 20, rainChance: 10, typicalConditions: 'Still very hot', shadeTip: 'Roof typically closed, AC running' },
          { month: 'October', avgTemp: 88, avgHumidity: 18, rainChance: 5, typicalConditions: 'Cooler for playoffs', shadeTip: 'Roof may open, seek shade on third base side' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'Legends Suite', perks: ['Behind home plate', 'Exclusive lounge', 'All-inclusive'], access: 'Private entrance' },
            { name: 'Diamond Level', perks: ['Club access', 'Wide seats', 'In-seat service'], access: 'Diamond Level entrance' },
            { name: 'Audi Quattro Lounge', perks: ['Climate controlled', 'Premium bar', 'Exclusive menu'], access: 'Club level' }
          ],
          suites: { 
            levels: ['Field Level Suites', 'D-Backs Suites', 'Pool Suite', 'Dugout Suites'],
            amenities: ['Private restrooms', 'Catering options', 'HDTV', 'Climate control', 'VIP parking']
          },
          specialAreas: [
            { name: 'Pool Suite', description: 'Famous swimming pool with 35-person capacity', capacity: 35 },
            { name: 'Batter\'s Box Suites', description: 'Field level behind home plate', capacity: 24 }
          ]
        },
        budgetOptions: ['Upper deck outfield', 'Bleacher sections', 'Standing room only', '$5 Value Menu seats (select games)'],
        familySections: ['Sections 301-305', 'Family-friendly concourse areas'],
        standingRoom: ['SRO tickets available', 'Craft beer garden areas'],
        partyAreas: [
          { name: 'Pool Pavilion', capacity: '35', description: 'Swimming pool and patio', amenities: ['Pool access', 'Private bar', 'TVs'] },
          { name: 'Draft Room', capacity: '50+', description: 'Group party space', amenities: ['Multiple TVs', 'Bar service'] }
        ],
        tips: [
          { section: 'Sections 314-332', tip: 'Best value for shade and views', category: 'value' },
          { section: 'Pool Suite', tip: 'Book early - most unique MLB experience', category: 'experience' },
          { section: 'Upper deck third base', tip: 'Coolest seats for day games', category: 'shade' },
          { section: 'Diamond Level', tip: 'All-inclusive food and beverage', category: 'experience' }
        ]
      },
      concessions: {
        signature: [
          'Millionaire Steak Sandwich with truffle cheese',
          'XL Sonoran Hot Dog (footlong)',
          'Korean Pork Belly Nachos',
          'Apple Pie Chimichangas',
          'Churro Sundae'
        ],
        local: [
          'Gadzooks Enchiladas',
          'Four Peaks Beer',
          'Huss Brewing selections',
          'Festival Street Tacos',
          'Sonoran-style hot dogs'
        ],
        healthy: ['Fresh salads', 'Veggie wraps', 'Fruit cups', 'Gluten-free options'],
        vegetarian: ['Beyond Burger', 'Veggie nachos', 'Cheese quesadillas'],
        kidsFriendly: ['Double Header $2.99 hot dogs', 'Popcorn', 'Cotton candy', 'Ice cream'],
        alcohol: {
          beer: ['Four Peaks Kilt Lifter', 'Huss Brewing varieties', 'Dos Equis', 'Modelo', 'Craft beer garden selections'],
          wine: true,
          cocktails: true,
          localBreweries: ['Four Peaks', 'Huss Brewing', 'SanTan Brewing']
        }
      },
      parking: {
        lots: [
          { name: 'Chase Field Garage', distance: '1-3 minutes', price: '$25-30', shadedSpots: false, covered: true, tip: 'Closest to stadium, fills quickly' },
          { name: 'Jefferson Street Garage', distance: '3-5 minutes', price: '$25-30', shadedSpots: false, covered: true },
          { name: 'General Parking', distance: '5-10 minutes', price: '$10', shadedSpots: false, covered: false, tip: 'Best value option' },
          { name: 'VIP Parking', distance: '1-2 minutes', price: '$35', shadedSpots: false, covered: false, tip: 'Premium location' }
        ],
        streetParking: { available: true, restrictions: 'Meters and time limits apply', tip: 'Very limited on game days' },
        alternativeTransport: {
          publicTransit: ['Valley Metro Light Rail - 3rd St/Jefferson Station', '$2 single ride or $4 day pass'],
          rideShare: 'Uber official partner - pickup at Washington & 5th St',
          bicycle: 'Bike racks available at multiple entrances'
        }
      },
      gates: [
        { name: 'Home Plate Gate', location: '401 E Jefferson St', bestFor: ['Main entrance', 'Team shop'], openTime: '2 hours before first pitch' },
        { name: 'Left Field Gate', location: '4th Street', bestFor: ['Pool access', 'Left field seats'], openTime: '90 minutes before' },
        { name: 'Right Field Gate', location: '7th Street', bestFor: ['Right field seats', 'Value parking'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [
          { location: 'Main Team Shop - Home Plate Gate', exclusive: ['Game-used memorabilia', 'Custom jerseys'] },
          { location: 'The Dugout Store - Section 115', exclusive: ['Authentic collection'] }
        ],
        firstAid: ['Section 107', 'Section 214', 'Section 316'],
        babyChanging: ['All family restrooms', 'Guest Services'],
        nursingRooms: ['Guest Services behind Section 115'],
        atms: ['All concourse levels', 'Near main gates'],
        wifi: { available: true, network: 'ChaseField-Guest', freeZones: ['All seating areas'] },
        chargingStations: ['Club level lounges', 'Legends Suite'],
        kidZones: [{ name: 'Baxter\'s Den', location: 'Section 139', activities: ['Games', 'Photo ops with mascot'] }]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels have wheelchair accessible seating'],
          entrance: 'All gates wheelchair accessible',
          elevators: ['Home Plate Gate', 'Left Field Gate', 'Right Field Gate']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All concession stands'],
        parkingSpaces: '31 ADA parking spots available'
      },
      gameDay: {
        tips: [
          { title: 'Beat the Heat', description: 'Arrive early to avoid hot parking lots', category: 'weather' },
          { title: 'Roof Status', description: 'Check social media for roof open/closed status', category: 'shade' },
          { title: 'Light Rail', description: 'Avoid parking hassles with $2 light rail', category: 'arrival' },
          { title: 'Happy Hour', description: 'Discounted drinks 2 hours before first pitch', category: 'food' },
          { title: 'Pool Viewing', description: 'Visit right field to see the famous pool', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '2 hours before first pitch',
          battingPractice: 'Varies by team schedule',
          firstPitch: '6:40 PM (weeknights), 1:10 PM (day games)',
          rushHours: ['30 minutes before first pitch', 'After 7th inning']
        },
        security: {
          allowedBags: 'Clear bags and small clutches only',
          prohibitedItems: ['Outside food/drinks (except sealed water)', 'Weapons', 'Drones', 'Large bags'],
          metalDetectors: true,
          clearBagPolicy: true
        }
      },
      neighborhood: {
        name: 'Downtown Phoenix',
        description: 'Located in the heart of downtown Phoenix, Chase Field is surrounded by entertainment, dining, and cultural attractions, with easy access to the Valley Metro Light Rail.',
        beforeGame: [
          'CityScape Phoenix - multiple restaurants and bars',
          'Pizzeria Bianco - famous pizza',
          'The Arrogant Butcher - upscale American',
          'Huss Brewing - local craft beer'
        ],
        afterGame: [
          'Footprint Center - catch a Suns game',
          'Arizona Science Center',
          'Downtown Phoenix nightlife district',
          'Roosevelt Row arts district'
        ],
        radius: '0.5 mile walk to most attractions'
      },
      transportation: {
        address: '401 E Jefferson St, Phoenix, AZ 85004',
        publicTransit: {
          train: [{ lines: ['Valley Metro Light Rail'], station: '3rd Street/Jefferson', walkTime: '3 minutes' }]
        },
        driving: {
          majorRoutes: ['I-10', 'I-17', 'Loop 202', 'US-60'],
          typicalTraffic: 'Heavy congestion 1 hour before games',
          bestApproach: 'From I-10, exit 7th Street northbound'
        },
        rideShare: {
          pickupZone: 'Washington Street & 5th Street',
          dropoffZone: 'Jefferson Street main entrance',
          surgePricing: 'Expect 2-3x surge after games',
          alternativeTip: 'Walk a few blocks to avoid surge pricing'
        }
      },
      history: {
        timeline: [
          { year: 1998, event: 'Stadium opens as Bank One Ballpark' },
          { year: 1998, event: 'Mark Grace hits first home run into pool' },
          { year: 2001, event: 'Diamondbacks win World Series in Game 7' },
          { year: 2005, event: 'Renamed Chase Field' },
          { year: 2011, event: 'Hosts MLB All-Star Game' },
          { year: 2019, event: 'Natural grass replaced with artificial turf' },
          { year: 2023, event: 'Hosts World Series Games 3-5' }
        ],
        notableGames: [
          { date: '2001-11-04', description: 'Luis Gonzalez wins World Series with walk-off hit' },
          { date: '2011-07-12', description: 'MLB All-Star Game' }
        ],
        traditions: [
          { name: 'The Pool', description: 'Only MLB stadium with swimming pool' },
          { name: 'Roof Countdown', description: 'Fans count down roof closing' }
        ],
        retired: [
          { number: '20', player: 'Luis Gonzalez', year: 2010 },
          { number: '51', player: 'Randy Johnson', year: 2015 },
          { number: '42', player: 'Jackie Robinson', year: 1997 }
        ]
      },
      fanExperience: {
        atmosphere: 'Climate-controlled comfort with unique pool party vibe and passionate fans',
        bestExperiences: [
          'Swimming pool suite rental',
          'Roof opening/closing experience',
          'Pre-game at CityScape',
          'Craft beer garden'
        ],
        traditions: ['D-Baxter the Bobcat mascot', 'Roof countdown', 'Swimming pool home runs'],
        music: 'Mix of classic rock and modern hits',
        mascot: { name: 'D. Baxter the Bobcat', description: 'Energetic bobcat who roams the stadium' },
        fanGroups: [{ name: 'The Bleacher Bums', section: 'Left field bleachers', description: 'Rowdy supporters group' }]
      },
      proTips: {
        insiderTips: [
          'Check roof status on Twitter before games',
          'Light rail is easier than driving',
          'Pool suite books months in advance',
          'Upper deck stays coolest on hot days',
          'Happy hour drinks 2 hours before first pitch'
        ],
        avoidThese: [
          'Right field seats for day games',
          'Parking without prepaying',
          'Arriving late - security lines get long',
          'Outside gates during summer heat'
        ],
        hiddenGems: [
          'Craft beer garden in center field',
          'Views from upper deck behind home plate',
          'Double Header value menu ($2.99 items)',
          'Standing room drink rails with great views'
        ],
        photoSpots: [
          'Pool overlook in right field',
          'Home plate gate entrance',
          'With D. Baxter the Bobcat',
          'Legends Suite club'
        ],
        bestValue: [
          'Upper deck third base side',
          'Double Header concession stands',
          '$10 general parking',
          'Light rail instead of parking'
        ]
      }
    },

  'bluejays': {
    id: 'bluejays',
    name: 'Rogers Centre',
    team: 'Toronto Blue Jays',
    opened: 1989,
    capacity: 49282,
    overview: {
      description: 'Rogers Centre, originally known as SkyDome, was the first stadium in the world with a fully retractable roof. Located in downtown Toronto, this multi-purpose facility features a hotel with field-view rooms and one of the most unique ballpark experiences in MLB.',
      highlights: [
        'First stadium with fully retractable roof (1989)',
        'Hotel rooms overlooking the field',
        'Downtown Toronto location',
        'Multi-purpose design for baseball and events'
      ],
      uniqueFeatures: [
        'Renaissance Toronto Downtown Hotel with 70 field-view rooms',
        '348-foot CN Tower adjacent to stadium',
        'Retractable roof opens in 20 minutes',
        'Dirt infield only around bases (artificial turf)'
      ],
      renovations: [
        { year: 2005, description: 'Renamed from SkyDome to Rogers Centre' },
        { year: 2022, description: 'Major renovation including new video boards' }
      ],
      previousNames: ['SkyDome (1989-2005)']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['500 Level sections', '200 Level behind home plate'],
        afternoon: ['500 Level provides overhead coverage', '200 Level infield'],
        evening: ['Most sections shaded', 'Roof often closed']
      },
      coveredSeating: ['All seats when roof is closed', '500 Level sections', 'Club Level'],
      shadeTips: [
        'Roof closed for most games due to weather',
        'Upper levels provide best shade when roof open',
        'Air conditioning when roof is closed',
        'Third base side gets shade first'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourses climate controlled'],
        indoorAreas: ['Club Level', 'Hotel lobby', 'Team Shop']
      },
      worstSunExposure: ['100 Level outfield', 'First base side when roof open'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 50, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool, roof often closed', shadeTip: 'Climate controlled comfort' },
        { month: 'May', avgTemp: 62, avgHumidity: 65, rainChance: 20, typicalConditions: 'Mild spring weather', shadeTip: 'Roof may open for nice days' },
        { month: 'June', avgTemp: 72, avgHumidity: 65, rainChance: 15, typicalConditions: 'Pleasant summer', shadeTip: 'Upper level for shade' },
        { month: 'July', avgTemp: 76, avgHumidity: 65, rainChance: 10, typicalConditions: 'Warm summer', shadeTip: 'Third base side better' },
        { month: 'August', avgTemp: 75, avgHumidity: 65, rainChance: 12, typicalConditions: 'Peak summer warmth', shadeTip: 'Seek upper level shade' },
        { month: 'September', avgTemp: 67, avgHumidity: 65, rainChance: 18, typicalConditions: 'Cooling fall weather', shadeTip: 'Roof often closed for comfort' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Rogers Club', perks: ['All-inclusive dining', 'Premium bar', 'Indoor/outdoor seating'], access: 'Club Level' },
          { name: 'WestJet Flight Deck', perks: ['Field level', 'Premium amenities', 'Exclusive access'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['SkyBoxes', 'Theatre Boxes', 'Hotel Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Hotel Rooms', description: 'Field-view hotel rooms for ultimate experience', capacity: 4 },
          { name: 'Hard Rock Cafe', description: 'Restaurant with field view' }
        ]
      },
      budgetOptions: ['500 Level sections', '200 Level outfield', 'Flexpack tickets'],
      familySections: ['Family sections throughout'],
      standingRoom: ['Standing room only tickets available'],
      partyAreas: [
        { name: 'WVRST', capacity: '100', amenities: ['Craft beer', 'Gourmet sausages', 'Standing tables'] }
      ],
      tips: [
        { section: '200 Level behind plate', tip: 'Great views with some cover', category: 'value' },
        { section: 'Hotel rooms', tip: 'Ultimate unique experience', category: 'experience' },
        { section: '500 Level', tip: 'Budget option with full roof coverage', category: 'value' }
      ]
    },
    concessions: {
      signature: ['Bacon on a Stick', 'Poutine', 'Tim Hortons coffee', 'Peameal bacon sandwich'],
      local: ['Harvey\'s burgers', 'Swiss Chalet', 'Second City Pizza'],
      healthy: ['Fresh salads', 'Veggie wraps'],
      vegetarian: ['Beyond burgers', 'Veggie dogs'],
      glutenFree: ['GF options at most stands'],
      kidsFriendly: ['Hot dogs', 'Pizza', 'Ice cream'],
      alcohol: {
        beer: ['Molson Canadian', 'Coors Light', 'Steam Whistle', 'Amsterdam'],
        wine: true,
        cocktails: true,
        localBreweries: ['Steam Whistle', 'Amsterdam Brewing']
      }
    },
    parking: {
      lots: [
        { name: 'Green P lots', distance: '5-10 min walk', price: '$25 CAD', shadedSpots: true, covered: true, tip: 'City parking garages' },
        { name: 'Private lots', distance: '2-5 min walk', price: '$30-40 CAD', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['TTC Subway - Union Station', 'GO Transit trains', 'UP Express from airport'],
        rideShare: 'Uber/Lyft pickup zones',
        bicycle: 'Bike Share Toronto stations nearby'
      }
    },
    gates: [
      { name: 'Gate 1', location: 'Home plate entrance', bestFor: ['Field Level', 'Club Level'], openTime: '2 hours before first pitch' },
      { name: 'Gate 5', location: 'Left field', bestFor: ['200/500 Level'], openTime: '90 minutes before first pitch' }
    ],
    amenities: {
      merchandise: [
        { location: 'Jays Shop - Gate 1', exclusive: ['Authentic jerseys', 'Maple Leaf themed gear'] }
      ],
      firstAid: ['Medical stations on each level'],
      babyChanging: ['Family rooms on all levels'],
      atms: ['Throughout concourses'],
      wifi: { available: true, network: 'Rogers_Centre_WiFi' },
      kidZones: [
        { name: 'Junior Jays Clubhouse', location: '200 Level', activities: ['Interactive games', 'Photo ops'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels wheelchair accessible'],
        entrance: 'All gates accessible',
        elevators: ['Throughout building']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available in Green P lots'
    },
    gameDay: {
      tips: [
        { title: 'Take Transit', description: 'Union Station is directly connected', category: 'arrival' },
        { title: 'Try Poutine', description: 'Canadian ballpark staple', category: 'food' },
        { title: 'Hotel Experience', description: 'Book field-view room for special occasions', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: 'Blue Jays BP 2.5 hours before',
        firstPitch: '7:07 PM weekdays, 1:07 PM Sundays',
        rushHours: ['5:30-6:30 PM on Union Station']
      },
      security: {
        allowedBags: 'Clear bags preferred',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    neighborhood: {
      name: 'Downtown Toronto',
      description: 'Heart of Toronto with attractions, dining, and entertainment',
      beforeGame: ['CN Tower', 'Ripley\'s Aquarium', 'Steam Whistle Brewing'],
      afterGame: ['Entertainment District', 'King Street restaurants', 'Harbourfront'],
      radius: 'Walking distance to most downtown attractions'
    },
    transportation: {
      address: '1 Blue Jays Way, Toronto, ON M5V 1J1',
      publicTransit: {
        subway: [{ lines: ['TTC Subway Lines 1/2'], station: 'Union Station', walkTime: 'Direct connection' }],
        train: [{ lines: ['GO Transit', 'UP Express'], station: 'Union Station', walkTime: 'Direct connection' }]
      },
      driving: {
        majorRoutes: ['Gardiner Expressway', 'Don Valley Parkway', 'Highway 401'],
        typicalTraffic: 'Heavy downtown congestion',
        bestApproach: 'Gardiner Expressway to downtown'
      },
      rideShare: {
        pickupZone: 'Front Street West',
        dropoffZone: 'Blue Jays Way',
        surgePricing: '2-3x after games'
      }
    },
    history: {
      timeline: [
        { year: 1989, event: 'Opens as SkyDome' },
        { year: 1992, event: 'Blue Jays win World Series' },
        { year: 1993, event: 'Blue Jays repeat as World Series champions' },
        { year: 2005, event: 'Renamed Rogers Centre' }
      ],
      notableGames: [
        { date: '1992-10-24', description: 'World Series clinching Game 6' },
        { date: '1993-10-23', description: 'Joe Carter walk-off World Series home run' }
      ],
      traditions: [
        { name: 'OK Blue Jays', description: 'Classic Blue Jays fight song' }
      ],
      retired: [
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    },
    fanExperience: {
      atmosphere: 'Enthusiastic Canadian crowd with polite but passionate support',
      bestExperiences: [
        'Field-view hotel rooms',
        'CN Tower views',
        'Retractable roof opening',
        'Canadian ballpark food'
      ],
      traditions: ['OK Blue Jays song', '7th inning stretch', 'Wave'],
      music: 'Mix of Canadian and international hits',
      mascot: { name: 'Ace', description: 'Blue Jay mascot' },
      fanGroups: []
    },
    proTips: {
      insiderTips: [
        'Book hotel rooms early for field view',
        'Union Station connection makes transit easy',
        'Check roof status before game',
        'Try Steam Whistle Brewery nearby'
      ],
      avoidThese: [
        'Driving downtown during rush hour',
        'Expensive parking lots',
        'Concessions right at first pitch'
      ],
      hiddenGems: [
        'Hotel lobby bar with field view',
        'CN Tower EdgeWalk before games',
        'Harbourfront walk after games'
      ],
      photoSpots: [
        'CN Tower and stadium together',
        'Hotel field-view rooms',
        'Union Station interior'
      ],
      bestValue: [
        '500 Level seats',
        'TTC day pass for transit',
        'Happy hour at nearby restaurants'
      ]
    }
  },

  'braves': {
    id: 'braves',
    name: 'Truist Park',
    team: 'Atlanta Braves',
    opened: 2017,
    capacity: 41084,
    overview: {
      description: 'Truist Park is the newest ballpark in MLB, featuring modern amenities and traditional baseball architecture. Located in Cobb County with The Battery Atlanta entertainment district, it offers a complete entertainment experience beyond baseball.',
      highlights: [
        'Newest ballpark in MLB (opened 2017)',
        'The Battery Atlanta mixed-use development',
        'Modern design with classic ballpark feel',
        'State-of-the-art technology throughout'
      ],
      uniqueFeatures: [
        'The Battery Atlanta entertainment district',
        'Monument Garden honoring Braves legends',
        'Xfinity Rooftop for events',
        'Kids\' area with playground'
      ],
      renovations: [],
      previousNames: ['SunTrust Park (2017-2019)']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 140-150', 'Chophouse seats', 'Upper deck 400s'],
        afternoon: ['Third base side sections', 'Club Level', 'Sections 320-340'],
        evening: ['Most sections shaded after 5 PM', 'First base side']
      },
      coveredSeating: ['Club Level sections', 'SunTrust Club', 'Delta Sky360 Club'],
      shadeTips: [
        'Third base side best for afternoon games',
        'Upper deck provides shade for lower sections',
        'Club level has permanent coverage',
        'Avoid right field for day games'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourse levels'],
        indoorAreas: ['Club areas', 'Team Store', 'Monument Garden']
      },
      worstSunExposure: ['Right field sections 130-139', 'Field Level 1-20'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 70, avgHumidity: 55, rainChance: 15, typicalConditions: 'Pleasant spring weather', shadeTip: 'Third base side recommended' },
        { month: 'May', avgTemp: 78, avgHumidity: 60, rainChance: 12, typicalConditions: 'Warming up', shadeTip: 'Seek shade for day games' },
        { month: 'June', avgTemp: 84, avgHumidity: 65, rainChance: 18, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck for shade' },
        { month: 'July', avgTemp: 87, avgHumidity: 70, rainChance: 20, typicalConditions: 'Peak summer heat and humidity', shadeTip: 'Club level recommended' },
        { month: 'August', avgTemp: 86, avgHumidity: 70, rainChance: 18, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games preferred' },
        { month: 'September', avgTemp: 81, avgHumidity: 65, rainChance: 12, typicalConditions: 'Still warm', shadeTip: 'Afternoon shade important' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Delta Sky360 Club', perks: ['All-inclusive dining', 'Premium bar', 'Climate controlled'], access: 'Behind home plate' },
          { name: 'SunTrust Club', perks: ['Upscale dining', 'Full bar', 'Exclusive access'], access: 'Club Level' },
          { name: 'Chophouse', perks: ['Restaurant seating', 'Full menu', 'Field views'], access: 'Right field' }
        ],
        suites: {
          levels: ['Premium Level', 'Club Level'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Xfinity Rooftop', description: 'Party deck with entertainment', capacity: 600 },
          { name: 'Coca-Cola Corner', description: 'Family area with activities', capacity: 200 }
        ]
      },
      budgetOptions: ['Upper deck 400s', 'SRO tickets', 'Outfield pavilion'],
      familySections: ['Coca-Cola Corner', 'Kids\' areas throughout'],
      standingRoom: ['Xfinity Rooftop', 'Various SRO locations'],
      partyAreas: [
        { name: 'Xfinity Rooftop', capacity: '600', amenities: ['DJ', 'Games', 'Food stations'] },
        { name: 'Home Depot Clubhouse', capacity: '200', amenities: ['Group seating', 'TVs'] }
      ],
      tips: [
        { section: 'Delta Sky360', tip: 'Premium all-inclusive experience', category: 'experience' },
        { section: 'Upper deck 400s', tip: 'Great value with shade', category: 'value' },
        { section: 'Chophouse', tip: 'Dine while watching the game', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Waffle House hash browns', 'H&F Burger', 'Fox Bros. BBQ', 'Kevin Gillespie\'s Gamechanger'],
      local: ['Antico Pizza', 'The Varsity', 'Sublime Doughnuts', 'Atlanta-style wings'],
      healthy: ['Fresh salads', 'Veggie options', 'Fruit bowls'],
      vegetarian: ['Beyond burgers', 'Veggie dogs', 'Salads'],
      glutenFree: ['GF options available'],
      kidsFriendly: ['Chick-fil-A', 'Pizza', 'Ice cream'],
      alcohol: {
        beer: ['Sweetwater', 'Terrapin', 'Monday Night Brewing', 'Budweiser'],
        wine: true,
        cocktails: true,
        localBreweries: ['Sweetwater', 'Terrapin', 'Monday Night', 'SweetWater']
      }
    },
    parking: {
      lots: [
        { name: 'Green Lot', distance: '5 min walk', price: '$30', shadedSpots: false, covered: false, tip: 'Closest to stadium' },
        { name: 'Red Lot', distance: '8 min walk', price: '$20', shadedSpots: false, covered: false },
        { name: 'Blue Lot', distance: '10 min walk', price: '$15', shadedSpots: true, covered: false, tip: 'Some tree coverage' }
      ],
      alternativeTransport: {
        publicTransit: ['CobbLinc bus service', 'Limited MARTA connection'],
        rideShare: 'Designated pickup/dropoff areas',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      { name: 'Home Plate Gate', location: 'Behind home plate', bestFor: ['Field Level', 'Club Level'], openTime: '2 hours before first pitch' },
      { name: 'Right Field Gate', location: 'Right field', bestFor: ['Pavilion', 'Chophouse'], openTime: '90 minutes before first pitch' }
    ],
    amenities: {
      merchandise: [
        { location: 'Braves Clubhouse Store - Home Plate Gate', exclusive: ['Championship gear', 'Hank Aaron memorabilia'] }
      ],
      firstAid: ['Medical stations on each level'],
      babyChanging: ['Family restrooms throughout'],
      atms: ['All concourse levels'],
      wifi: { available: true, network: 'TruistPark_WiFi' },
      kidZones: [
        { name: 'Coca-Cola Corner', location: 'Right field', activities: ['Playground', 'Games', 'Mascot appearances'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels ADA compliant'],
        entrance: 'All gates accessible',
        elevators: ['Throughout stadium']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'ADA spots in all lots'
    },
    gameDay: {
      tips: [
        { title: 'Visit The Battery', description: 'Entertainment district before/after games', category: 'experience' },
        { title: 'Try Waffle House items', description: 'Local favorite available at stadium', category: 'food' },
        { title: 'Monument Garden', description: 'See Braves history display', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: 'Braves BP 2.5 hours before',
        firstPitch: '7:20 PM weekdays, 1:20 PM Sundays',
        rushHours: ['6:00-7:00 PM for weeknight games']
      },
      security: {
        allowedBags: 'Clear bags only',
        prohibitedItems: ['Outside food/drinks', 'Backpacks', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    neighborhood: {
      name: 'The Battery Atlanta',
      description: 'Modern mixed-use development with restaurants, shops, and entertainment',
      beforeGame: ['Antico Pizza', 'The Battery restaurants', 'Live music venues'],
      afterGame: ['The Battery nightlife', 'TopGolf', 'Various restaurants'],
      radius: 'Adjacent to stadium'
    },
    transportation: {
      address: '755 Battery Ave SE, Atlanta, GA 30339',
      publicTransit: {
        bus: [{ routes: ['CobbLinc routes'], stops: ['The Battery'] }]
      },
      driving: {
        majorRoutes: ['I-75', 'I-285', 'US-41'],
        typicalTraffic: 'Heavy before/after games',
        bestApproach: 'I-75 to Cumberland Boulevard'
      },
      rideShare: {
        pickupZone: 'The Battery Atlanta',
        dropoffZone: 'Circle 75 Parkway',
        surgePricing: '2-4x after games'
      }
    },
    history: {
      timeline: [
        { year: 2017, event: 'Stadium opens as SunTrust Park' },
        { year: 2019, event: 'Renamed Truist Park' },
        { year: 2021, event: 'Braves win World Series' }
      ],
      notableGames: [
        { date: '2021-11-02', description: 'World Series Game 6 - Braves clinch championship' }
      ],
      traditions: [
        { name: 'Tomahawk Chop', description: 'Iconic Braves fan tradition' },
        { name: 'War Chant', description: 'Accompanying chant with tomahawk chop' }
      ],
      retired: [
        { number: '3', player: 'Dale Murphy', year: 1994 },
        { number: '6', player: 'Bobby Cox', year: 2010 },
        { number: '10', player: 'Chipper Jones', year: 2013 },
        { number: '21', player: 'Warren Spahn', year: 1965 },
        { number: '35', player: 'Phil Niekro', year: 1984 },
        { number: '41', player: 'Eddie Mathews', year: 1969 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '44', player: 'Hank Aaron', year: 1977 }
      ]
    },
    fanExperience: {
      atmosphere: 'Modern ballpark with traditional Southern hospitality',
      bestExperiences: [
        'The Battery Atlanta entertainment',
        'Monument Garden history',
        'Tomahawk Chop participation',
        'Local food specialties'
      ],
      traditions: ['Tomahawk Chop', 'War Chant', '"Take Me Out to the Ballgame" with Braves twist'],
      music: 'Mix of classic rock and Southern favorites',
      mascot: { name: 'Blooper', description: 'Fuzzy blue mascot' },
      fanGroups: []
    },
    proTips: {
      insiderTips: [
        'The Battery has free entertainment',
        'Monument Garden is worth visiting',
        'Club level has best amenities',
        'Parking fills up early for big games'
      ],
      avoidThese: [
        'I-75 traffic after games',
        'Right field seats for day games',
        'Expensive Battery parking'
      ],
      hiddenGems: [
        'Monument Garden displays',
        'Xfinity Rooftop views',
        'The Battery free concerts'
      ],
      photoSpots: [
        'Monument Garden with statues',
        'Home plate gate entrance',
        'The Battery Atlanta plaza'
      ],
      bestValue: [
        'Upper deck sections',
        'The Battery free activities',
        'Happy hour at Battery restaurants'
      ]
    }
  },

  'brewers': {
    id: 'brewers',
    name: 'American Family Field',
    team: 'Milwaukee Brewers',
    opened: 2001,
    capacity: 41900,
    overview: {
      description: 'American Family Field (formerly Miller Park) features a retractable roof and fan-shaped design. Known for its tailgating culture, bratwurst races, and the famous Bernie Brewer slide, it embodies Milwaukee\'s love for baseball and beer.',
      highlights: [
        'Retractable roof with fan-shaped design',
        'Famous Bernie Brewer slide and chalet',
        'Legendary tailgating culture',
        'Bratwurst racing tradition'
      ],
      uniqueFeatures: [
        'Bernie Brewer\'s Dugout with slide',
        'Retractable roof opens like a fan in 10 minutes',
        'Miller Park (now American Family Field) brewery legacy',
        'Extensive tailgating lots'
      ],
      renovations: [
        { year: 2021, description: 'Renamed from Miller Park to American Family Field' }
      ],
      previousNames: ['Miller Park (2001-2020)']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Club Level sections', 'Terrace Level 400s'],
        afternoon: ['Third base side', 'Sections 220-240', 'Club Level'],
        evening: ['Most sections shaded', 'Roof often closed']
      },
      coveredSeating: ['All seats when roof is closed', 'Club Level', 'Terrace Level overhang'],
      shadeTips: [
        'Roof closed for most games due to weather',
        'Club level has permanent coverage',
        'Third base side gets shade first',
        'Upper deck provides shade for lower sections'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourses climate controlled when roof closed'],
        indoorAreas: ['Club Level', 'Team Store', 'Bernie Brewer\'s Dugout']
      },
      worstSunExposure: ['Right field sections when roof open', 'Field Level 100-120'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool spring, roof often closed', shadeTip: 'Climate controlled comfort' },
        { month: 'May', avgTemp: 66, avgHumidity: 60, rainChance: 20, typicalConditions: 'Mild weather', shadeTip: 'Roof may open for nice days' },
        { month: 'June', avgTemp: 76, avgHumidity: 65, rainChance: 15, typicalConditions: 'Pleasant summer', shadeTip: 'Third base side for afternoon' },
        { month: 'July', avgTemp: 80, avgHumidity: 65, rainChance: 12, typicalConditions: 'Warm summer', shadeTip: 'Upper level for shade' },
        { month: 'August', avgTemp: 79, avgHumidity: 68, rainChance: 12, typicalConditions: 'Peak summer warmth', shadeTip: 'Club level recommended' },
        { month: 'September', avgTemp: 71, avgHumidity: 65, rainChance: 15, typicalConditions: 'Comfortable fall weather', shadeTip: 'Less shade needed' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Champions Club', perks: ['All-inclusive dining', 'Premium bar', 'Climate controlled'], access: 'Behind home plate' },
          { name: 'Miller Lite Landing', perks: ['Brewery-themed club', 'Craft beer selection'], access: 'Right field' }
        ],
        suites: {
          levels: ['Club Level', 'Terrace Level'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Bernie Brewer\'s Dugout', description: 'Party deck with slide replica', capacity: 80 },
          { name: 'Friday\'s Front Row', description: 'Restaurant seating with field view' }
        ]
      },
      budgetOptions: ['Terrace Level 400s', 'Bleacher sections', 'SRO tickets'],
      familySections: ['Family sections throughout'],
      standingRoom: ['Bernie Brewer\'s Dugout', 'Various SRO locations'],
      partyAreas: [
        { name: 'Bernie Brewer\'s Dugout', capacity: '80', amenities: ['Slide replica', 'Party atmosphere', 'Group seating'] }
      ],
      tips: [
        { section: 'Champions Club', tip: 'Premium all-inclusive experience', category: 'experience' },
        { section: 'Terrace Level', tip: 'Great value with roof coverage', category: 'value' },
        { section: 'Bernie\'s Dugout', tip: 'Fun party atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Bratwurst (multiple varieties)', 'Cheese curds', 'Lakefront Brewery beer', 'Frozen custard'],
      local: ['Usinger\'s sausages', 'Sprecher root beer', 'Kopp\'s frozen custard'],
      healthy: ['Salads', 'Veggie bratwurst'],
      vegetarian: ['Veggie brats', 'Beyond burgers'],
      glutenFree: ['GF bratwurst buns available'],
      kidsFriendly: ['Hot dogs', 'Pizza', 'Frozen custard'],
      alcohol: {
        beer: ['Miller Lite', 'Lakefront', 'New Glarus', 'Sprecher'],
        wine: true,
        cocktails: true,
        localBreweries: ['Lakefront', 'New Glarus', 'Sprecher', 'Milwaukee Brewing Co.']
      }
    },
    parking: {
      lots: [
        { name: 'Preferred Parking', distance: 'Adjacent', price: '$25', shadedSpots: false, covered: false, tip: 'Closest to gates' },
        { name: 'General Parking', distance: '5-10 min walk', price: '$12', shadedSpots: false, covered: false },
        { name: 'Tailgating Lots', distance: '10-15 min walk', price: '$12', shadedSpots: false, covered: false, tip: 'Best for tailgating' }
      ],
      alternativeTransport: {
        publicTransit: ['MCTS bus routes', 'Brewers Line shuttle'],
        rideShare: 'Designated pickup areas',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      { name: 'Home Plate Gate', location: 'Behind home plate', bestFor: ['Field Level', 'Club Level'], openTime: '2 hours before first pitch' },
      { name: 'Outfield Gates', location: 'Left/Right field', bestFor: ['Bleachers', 'Terrace Level'], openTime: '90 minutes before first pitch' }
    ],
    amenities: {
      merchandise: [
        { location: 'Brewers Team Store - Home Plate Gate', exclusive: ['Retro jerseys', 'Bernie Brewer items'] }
      ],
      firstAid: ['Medical stations on each level'],
      babyChanging: ['Family restrooms throughout'],
      atms: ['All concourse levels'],
      wifi: { available: true, network: 'AmericanFamilyField_WiFi' },
      kidZones: [
        { name: 'Bernie\'s Dugout Kids Area', location: 'Behind home plate', activities: ['Playground', 'Bernie Brewer meet & greet'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels wheelchair accessible'],
        entrance: 'All gates accessible',
        elevators: ['Throughout stadium']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Available in all lots'
    },
    gameDay: {
      tips: [
        { title: 'Tailgate Early', description: 'Experience Milwaukee\'s tailgating culture', category: 'experience' },
        { title: 'Watch Sausage Race', description: 'Famous between-inning entertainment', category: 'experience' },
        { title: 'Try Local Bratwurst', description: 'Wisconsin specialty with many varieties', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: 'Brewers BP 2.5 hours before',
        firstPitch: '7:10 PM weekdays, 1:10 PM Sundays',
        rushHours: ['6:00-7:00 PM for weeknight games']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside alcohol', 'Glass bottles', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: false
      }
    },
    neighborhood: {
      name: 'Miller Valley',
      description: 'Industrial area with limited walkable options, known for tailgating',
      beforeGame: ['Tailgating in stadium lots', 'Nearby sports bars'],
      afterGame: ['Water Street district (15 min drive)', 'Downtown Milwaukee'],
      radius: 'Most dining requires driving'
    },
    transportation: {
      address: '1 Brewers Way, Milwaukee, WI 53214',
      publicTransit: {
        bus: [{ routes: ['MCTS routes', 'Brewers Line'], stops: ['Stadium'] }]
      },
      driving: {
        majorRoutes: ['I-94', 'US-41', 'I-894'],
        typicalTraffic: 'Moderate, heavier after games',
        bestApproach: 'I-94 to Stadium Freeway'
      },
      rideShare: {
        pickupZone: 'Lot 1 designated area',
        dropoffZone: 'Main entrance',
        surgePricing: '2-3x after games'
      }
    },
    history: {
      timeline: [
        { year: 2001, event: 'Miller Park opens' },
        { year: 2021, event: 'Renamed American Family Field' }
      ],
      notableGames: [
        { date: '2011-10-16', description: 'NLCS Game 6 victory' }
      ],
      traditions: [
        { name: 'Bratwurst Race', description: 'Famous sausage mascot race' },
        { name: 'Bernie Brewer', description: 'Mascot slides down chalet' }
      ],
      retired: [
        { number: '1', player: 'Bud Selig', year: 2016 },
        { number: '4', player: 'Paul Molitor', year: 1999 },
        { number: '19', player: 'Robin Yount', year: 1994 },
        { number: '34', player: 'Rollie Fingers', year: 1992 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '44', player: 'Hank Aaron', year: 1976 }
      ]
    },
    fanExperience: {
      atmosphere: 'Friendly Midwestern crowd with strong tailgating culture',
      bestExperiences: [
        'Tailgating before games',
        'Bratwurst races',
        'Bernie Brewer slide celebrations',
        'Local beer and food'
      ],
      traditions: ['Bratwurst races', 'Bernie Brewer slide', 'Roll out the Barrel'],
      music: 'Classic rock and polka influences',
      mascot: { name: 'Bernie Brewer', description: 'German-themed mascot with famous slide' },
      fanGroups: []
    },
    proTips: {
      insiderTips: [
        'Arrive early for tailgating experience',
        'Try different bratwurst varieties',
        'Roof status affects game experience',
        'Parking lots have great pre-game atmosphere'
      ],
      avoidThese: [
        'Stadium Freeway after games',
        'Missing the sausage races',
        'Expensive concessions without trying local specialties'
      ],
      hiddenGems: [
        'Bernie Brewer\'s Dugout party deck',
        'Local brewery selections',
        'Tailgating lot friendships'
      ],
      photoSpots: [
        'Bernie Brewer\'s chalet and slide',
        'Retractable roof mechanism',
        'Tailgating setup in lots'
      ],
      bestValue: [
        'Terrace Level seats',
        'Bringing tailgating food/drinks to lot',
        'Local bratwurst varieties'
      ]
    }
  }
};
