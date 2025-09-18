import { StadiumGuide } from '../stadiumGuides';

export const aaaStadiumGuides: Record<string, StadiumGuide> = {
  'buffalo-bisons': {
      id: 'buffalo-bisons',
      name: 'Sahlen Field',
      team: 'Buffalo Bisons',
      opened: 1988,
      capacity: 16600,
      overview: {
        description: 'Sahlen Field is home to the Buffalo Bisons, the Triple-A affiliate of the Toronto Blue Jays. Located in downtown Buffalo, this ballpark offers views of the city skyline and provides an intimate minor league experience with excellent fan amenities.',
        highlights: [
          'Downtown Buffalo location with city skyline views',
          'Large capacity for Triple-A baseball',
          'Modern renovations with classic ballpark feel',
          'Excellent sight lines throughout stadium'
        ],
        uniqueFeatures: [
          'Buffalo skyline backdrop beyond outfield',
          'Bison mascot entertainment',
          'Family-friendly atmosphere',
          'Close proximity to downtown attractions',
          'Traditional minor league ballpark charm'
        ],
        renovations: [
          { year: 2012, description: 'Major facility upgrades and renovations' },
          { year: 2018, description: 'Concession and amenity improvements' }
        ]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['First base side sections 101-110', 'Box seats 201-210'],
          afternoon: ['Third base side sections 111-120', 'Reserved seating 301-310'],
          evening: ['Behind home plate sections', 'Most infield seating areas']
        },
        coveredSeating: ['Concourse areas', 'Some box seat overhangs'],
        shadeTips: [
          'Third base side gets afternoon shade first',
          'Upper level provides some shade coverage',
          'Concourse areas offer relief from sun',
          'Evening games provide natural shade'
        ],
        sunProtection: {
          sunscreenStations: ['Main concourse', 'Family areas'],
          shadedConcourses: ['Main concourse level', 'Upper concourse'],
          indoorAreas: ['Team store', 'Concession stands', 'Restroom facilities']
        },
        worstSunExposure: ['Right field sections', 'Left field general admission', 'Some bleacher areas'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 50, avgHumidity: 65, rainChance: 40, typicalConditions: 'Cool spring weather', shadeTip: 'Layer clothing, wind off Lake Erie' },
          { month: 'May', avgTemp: 62, avgHumidity: 60, rainChance: 35, typicalConditions: 'Pleasant spring weather', shadeTip: 'Perfect weather for any seat' },
          { month: 'June', avgTemp: 72, avgHumidity: 65, rainChance: 30, typicalConditions: 'Warm and comfortable', shadeTip: 'Seek shade for day games' },
          { month: 'July', avgTemp: 76, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm summer weather', shadeTip: 'Third base side preferred for day games' },
          { month: 'August', avgTemp: 74, avgHumidity: 72, rainChance: 30, typicalConditions: 'Warm with occasional humidity', shadeTip: 'Upper level provides relief' },
          { month: 'September', avgTemp: 67, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant fall weather', shadeTip: 'Great weather for any seating' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'Club Level', perks: ['Enhanced concessions', 'Premium views', 'Indoor access'], access: 'Upper level behind home plate' },
            { name: 'Box Seats', perks: ['Best field views', 'Close to action', 'Premium seating'], access: 'Lower level throughout stadium' }
          ],
          suites: { levels: ['Suite Level'], amenities: ['Private space', 'Catering options', 'Climate control'] },
          specialAreas: [
            { name: 'Picnic Areas', description: 'Group seating with food options', capacity: 50 }
          ]
        },
        budgetOptions: ['General Admission', 'Reserved seating upper level', 'Bleacher sections'],
        familySections: ['Family sections with activities', 'Kids play areas'],
        standingRoom: ['Concourse areas', 'Outfield standing sections'],
        partyAreas: [
          { name: 'Group Picnic Area', capacity: '100', amenities: ['Food included', 'Private space', 'Game viewing'] }
        ],
        tips: [
          { section: 'Box seats 201-210', tip: 'Great views with some afternoon shade protection', category: 'shade' },
          { section: 'General Admission', tip: 'Best value for casual fans and families', category: 'value' },
          { section: 'Club Level', tip: 'Premium experience with indoor amenities', category: 'experience' }
        ]
      },
      concessions: {
        signature: ['Buffalo wings', 'Beef on weck sandwiches', 'Local favorites', 'Bison burgers'],
        local: ['Sahlen\'s hot dogs', 'Buffalo-style pizza', 'Local craft beer', 'Regional specialties'],
        healthy: ['Grilled options', 'Salads', 'Fresh fruit'],
        vegetarian: ['Veggie burgers', 'Pizza options', 'Salads'],
        glutenFree: ['Available options', 'Ask concession staff'],
        kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy', 'Ice cream'],
        alcohol: {
          beer: ['Local craft breweries', 'Domestic beer', 'Import options'],
          wine: false,
          cocktails: false,
          localBreweries: ['Flying Bison Brewing', 'Resurgence Brewing', '42 North Brewing']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium Parking', distance: 'Adjacent', price: '$5-10', shadedSpots: false, covered: false, tip: 'Convenient stadium parking' },
          { name: 'Downtown Lots', distance: '0.2-0.5 miles', price: '$3-8', shadedSpots: false, covered: false, tip: 'Walk through downtown Buffalo' }
        ],
        streetParking: {
          available: true,
          restrictions: 'Some metered areas, check signs',
          tip: 'Limited availability on game days'
        },
        alternativeTransport: {
          publicTransit: ['NFTA bus routes to downtown'],
          rideShare: 'Available with pickup areas',
          bicycle: 'Bike racks available'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Home plate entrance', bestFor: ['All seating areas'], openTime: '1 hour before first pitch' },
        { name: 'Outfield Gate', location: 'Beyond outfield', bestFor: ['General admission', 'Family areas'], openTime: '1 hour before first pitch' }
      ],
      amenities: {
        merchandise: [
          { location: 'Team store', exclusive: ['Bisons gear', 'Blue Jays affiliate items'] }
        ],
        firstAid: ['Guest services'],
        babyChanging: ['Family restrooms'],
        atms: ['Concourse area'],
        wifi: { available: true, freeZones: ['Concourse areas'] },
        kidZones: [
          { name: 'Kids Play Area', location: 'Concourse', activities: ['Playground equipment', 'Interactive games'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['Accessible seating throughout'],
          entrance: 'All gates accessible',
          elevators: ['Available to all levels']
        },
        assistiveListening: true,
        signageAndBraille: false,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All major stands'],
        parkingSpaces: 'Accessible parking available'
      },
      gameDay: {
        tips: [
          { title: 'Arrive Early', description: 'Enjoy pre-game atmosphere and activities', category: 'arrival' },
          { title: 'Try Local Food', description: 'Don\'t miss Buffalo wings and beef on weck', category: 'food' },
          { title: 'Family Activities', description: 'Check out kids play areas and entertainment', category: 'family' }
        ],
        typicalSchedule: {
          gatesOpen: '1 hour before first pitch',
          battingPractice: '1.5 hours before first pitch',
          firstPitch: 'Varies by game',
          rushHours: ['30 minutes before first pitch', 'Between innings']
        },
        security: {
          allowedBags: 'Standard bag policy',
          prohibitedItems: ['Weapons', 'Outside alcohol'],
          metalDetectors: false,
          clearBagPolicy: false
        }
      },
      neighborhood: {
        name: 'Downtown Buffalo',
        description: 'Located in downtown Buffalo with access to city attractions, restaurants, and entertainment venues.',
        beforeGame: ['Downtown restaurants', 'Buffalo breweries', 'City attractions'],
        afterGame: ['Downtown bars', 'Restaurants', 'Entertainment district'],
        radius: 'Multiple options within walking distance'
      },
      transportation: {
        address: '275 Washington St, Buffalo, NY 14203',
        publicTransit: {
          bus: [
            { routes: ['NFTA Metro bus routes'], stops: ['Downtown Buffalo stops'] }
          ]
        },
        driving: {
          majorRoutes: ['I-90', 'I-190', 'Route 33'],
          typicalTraffic: 'Moderate downtown traffic',
          bestApproach: 'I-190 to downtown exits'
        },
        rideShare: {
          pickupZone: 'Designated stadium areas',
          dropoffZone: 'Main entrance area',
          surgePricing: 'Minimal for minor league games'
        }
      },
      history: {
        timeline: [
          { year: 1988, event: 'Pilot Field (now Sahlen Field) opens' },
          { year: 2009, event: 'Becomes Blue Jays affiliate' },
          { year: 2012, event: 'Major renovations completed' }
        ],
        traditions: [
          { name: 'Bison mascot', description: 'Team mascot entertainment throughout games' },
          { name: 'Minor league atmosphere', description: 'Family-friendly environment with interactive activities' }
        ]
      },
      fanExperience: {
        atmosphere: 'Family-friendly minor league atmosphere with emphasis on entertainment and community engagement.',
        bestExperiences: [
          'Bison mascot interactions',
          'Between-inning entertainment',
          'Buffalo-style concessions',
          'Downtown ballpark experience'
        ],
        traditions: [
          'Mascot races',
          'Fan participation games',
          'Community events'
        ],
        mascot: { name: 'Buster Bison', description: 'Team mascot who entertains fans throughout games' }
      },
      proTips: {
        insiderTips: [
          'Arrive early for best parking downtown',
          'Try the local Buffalo specialties',
          'Great for families with young children',
          'Downtown location offers pre/post-game activities'
        ],
        avoidThese: [
          'Rush hour traffic downtown',
          'Limited shade in outfield sections'
        ],
        hiddenGems: [
          'City skyline views from upper sections',
          'Local craft beer selection',
          'Interactive kids areas'
        ],
        photoSpots: [
          'Buffalo skyline backdrop',
          'Stadium exterior architecture',
          'Mascot photo opportunities'
        ],
        bestValue: [
          'General admission for budget-conscious fans',
          'Group packages for families',
          'Season ticket options for regular attendees'
        ]
      }
    },

    'columbus-clippers': {
      id: 'columbus-clippers',
      name: 'Huntington Park',
      team: 'Columbus Clippers',
      opened: 2009,
      capacity: 10100,
      overview: {
        description: 'Huntington Park is a modern ballpark in downtown Columbus, home to the Columbus Clippers, Triple-A affiliate of the Cleveland Guardians. The stadium features excellent sight lines, modern amenities, and beautiful views of the Columbus skyline.',
        highlights: [
          'Modern downtown ballpark opened in 2009',
          'Columbus skyline views beyond outfield',
          'LEED Gold certified green building',
          'Excellent sight lines from all seats'
        ],
        uniqueFeatures: [
          'Green roof and sustainable design features',
          'Columbus skyline backdrop',
          'Brick facade matching downtown architecture',
          'Wide concourses and modern amenities',
          'Picnic areas and group entertainment spaces'
        ],
        renovations: [
          { year: 2019, description: 'Concession and facility upgrades' }
        ]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['First base side sections 101-108', 'Club seating areas'],
          afternoon: ['Third base side sections 109-116', 'Upper reserved sections'],
          evening: ['Behind home plate sections', 'Most covered areas']
        },
        coveredSeating: ['Club level sections', 'Some upper deck overhangs'],
        shadeTips: [
          'Third base side gets afternoon shade first',
          'Upper level provides shade for sections below',
          'Club areas have covered concourses',
          'Evening games naturally provide relief'
        ],
        sunProtection: {
          sunscreenStations: ['Main concourse', 'Family areas'],
          shadedConcourses: ['Club level', 'Main concourse areas'],
          indoorAreas: ['Team store', 'Club restaurant', 'Indoor concessions']
        },
        worstSunExposure: ['Right field sections', 'Left field bleachers', 'Some lower bowl areas'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 55, avgHumidity: 60, rainChance: 40, typicalConditions: 'Cool spring weather', shadeTip: 'Layers recommended for changing conditions' },
          { month: 'May', avgTemp: 66, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring weather', shadeTip: 'Perfect weather for any seating' },
          { month: 'June', avgTemp: 75, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm summer weather', shadeTip: 'Seek shade for day games' },
          { month: 'July', avgTemp: 79, avgHumidity: 73, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Third base side preferred for day games' },
          { month: 'August', avgTemp: 77, avgHumidity: 74, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck provides relief' },
          { month: 'September', avgTemp: 70, avgHumidity: 68, rainChance: 25, typicalConditions: 'Pleasant fall weather', shadeTip: 'Great weather for any seat' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'Huntington Club', perks: ['All-inclusive dining', 'Premium bar', 'Climate control'], access: 'Club level behind home plate' },
            { name: 'Field Box', perks: ['Closest to field', 'Premium views', 'Wait service available'], access: 'Lower level premium sections' }
          ],
          suites: { levels: ['Suite Level'], amenities: ['Private bathrooms', 'Catering', 'Premium TVs'] },
          specialAreas: [
            { name: 'Picnic Areas', description: 'Group seating with food packages', capacity: 100 },
            { name: 'Party Deck', description: 'Social area with games and entertainment', capacity: 75 }
          ]
        },
        budgetOptions: ['General Admission', 'Upper Reserved', 'Lawn seating areas'],
        familySections: ['Family sections with activities', 'Kids zones'],
        standingRoom: ['Concourse areas', 'Party deck'],
        partyAreas: [
          { name: 'Right Field Party Deck', capacity: '75', amenities: ['Games', 'Social atmosphere', 'Premium concessions'] }
        ],
        tips: [
          { section: 'Field Box sections', tip: 'Best views of the action, close to players', category: 'experience' },
          { section: 'Upper Reserved', tip: 'Great value with excellent sight lines', category: 'value' },
          { section: 'Huntington Club', tip: 'Premium experience with all-inclusive dining', category: 'experience' }
        ]
      },
      concessions: {
        signature: ['Columbus-style chili', 'Buckeye candy', 'Local barbecue', 'Craft beer selection'],
        local: ['Schmidt\'s Bahama Mama sausages', 'Jeni\'s Ice Cream', 'Local Columbus restaurants', 'Ohio craft breweries'],
        healthy: ['Fresh salads', 'Grilled options', 'Fresh fruit stands'],
        vegetarian: ['Veggie burgers', 'Pizza options', 'Salads'],
        glutenFree: ['Available options throughout stadium'],
        kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy', 'Ice cream'],
        alcohol: {
          beer: ['Local craft breweries', 'Domestic options', 'Premium selections'],
          wine: true,
          cocktails: true,
          localBreweries: ['BrewDog', 'Columbus Brewing Company', 'Seventh Son Brewing']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium Parking Garage', distance: 'Adjacent', price: '$8-15', shadedSpots: true, covered: true, tip: 'Covered parking attached to stadium' },
          { name: 'Downtown Surface Lots', distance: '0.1-0.3 miles', price: '$5-10', shadedSpots: false, covered: false, tip: 'Multiple options downtown' }
        ],
        streetParking: {
          available: true,
          restrictions: 'Metered parking, check time limits',
          tip: 'Limited availability, arrive early'
        },
        alternativeTransport: {
          publicTransit: ['COTA bus routes to downtown'],
          rideShare: 'Designated pickup/drop-off areas',
          bicycle: 'Bike parking available'
        }
      },
      gates: [
        { name: 'Home Plate Gate', location: 'Main entrance', bestFor: ['Premium seating', 'Club areas'], openTime: '1 hour before first pitch' },
        { name: 'Left Field Gate', location: 'Third base side', bestFor: ['General admission', 'Family areas'], openTime: '1 hour before first pitch' }
      ],
      amenities: {
        merchandise: [
          { location: 'Clippers Team Store', exclusive: ['Clippers gear', 'Guardians affiliate items', 'Columbus merchandise'] }
        ],
        firstAid: ['Guest services area'],
        babyChanging: ['Family restrooms throughout stadium'],
        atms: ['Concourse areas'],
        wifi: { available: true, freeZones: ['All public areas'] },
        chargingStations: ['Club areas'],
        kidZones: [
          { name: 'Kids Zone', location: 'Concourse area', activities: ['Interactive games', 'Playground equipment'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['Accessible seating throughout all levels'],
          entrance: 'All gates wheelchair accessible',
          elevators: ['Multiple elevators available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All major concession areas'],
        parkingSpaces: 'Accessible parking in garage and lots'
      },
      gameDay: {
        tips: [
          { title: 'Downtown Experience', description: 'Explore downtown Columbus before and after games', category: 'experience' },
          { title: 'Green Building Features', description: 'Notice the LEED Gold certified sustainable features', category: 'experience' },
          { title: 'Skyline Views', description: 'Best Columbus skyline views from upper sections', category: 'experience' },
          { title: 'Local Food', description: 'Try Columbus specialties like Schmidt\'s sausages', category: 'food' }
        ],
        typicalSchedule: {
          gatesOpen: '1 hour before first pitch',
          battingPractice: '1.5 hours before first pitch',
          firstPitch: 'Varies by game',
          rushHours: ['30 minutes before first pitch', 'Between innings']
        },
        security: {
          allowedBags: 'Standard minor league bag policy',
          prohibitedItems: ['Weapons', 'Outside alcohol'],
          metalDetectors: false,
          clearBagPolicy: false
        }
      },
      neighborhood: {
        name: 'Downtown Columbus',
        description: 'Located in the heart of downtown Columbus with easy access to restaurants, bars, and entertainment venues.',
        beforeGame: ['Arena District restaurants', 'Local breweries', 'Shopping areas'],
        afterGame: ['Downtown nightlife', 'Restaurant scene', 'Entertainment venues'],
        radius: 'Extensive dining and entertainment within walking distance'
      },
      transportation: {
        address: '330 Huntington Park Ln, Columbus, OH 43215',
        publicTransit: {
          bus: [
            { routes: ['COTA downtown routes'], stops: ['Multiple downtown stops'] }
          ]
        },
        driving: {
          majorRoutes: ['I-70', 'I-71', 'Route 315'],
          typicalTraffic: 'Moderate downtown traffic',
          bestApproach: 'I-71 to downtown exits'
        },
        rideShare: {
          pickupZone: 'Designated areas near stadium',
          dropoffZone: 'Main entrance area',
          surgePricing: 'Minimal for minor league games'
        }
      },
      history: {
        timeline: [
          { year: 2009, event: 'Huntington Park opens' },
          { year: 2009, event: 'Clippers move from Cooper Stadium' },
          { year: 2021, event: 'Parent club changes from Indians to Guardians' }
        ],
        traditions: [
          { name: 'Lou Seal mascot entertainment', description: 'Interactive mascot activities throughout games' },
          { name: 'Minor league promotions', description: 'Creative theme nights and fan engagement' }
        ]
      },
      fanExperience: {
        atmosphere: 'Modern minor league experience with emphasis on fan engagement and entertainment.',
        bestExperiences: [
          'Columbus skyline views',
          'Modern ballpark amenities',
          'Downtown location convenience',
          'Family-friendly entertainment'
        ],
        traditions: [
          'Between-inning entertainment',
          'Mascot interactions',
          'Theme nights and promotions'
        ],
        mascot: { name: 'Lou Seal', description: 'Team mascot providing entertainment throughout games' }
      },
      proTips: {
        insiderTips: [
          'Park in the attached garage for convenience',
          'Upper sections offer great skyline views',
          'Try local Columbus food specialties',
          'Downtown location perfect for dinner after games'
        ],
        avoidThese: [
          'Rush hour downtown traffic',
          'Right field sections can be sunny for day games'
        ],
        hiddenGems: [
          'Green building features throughout stadium',
          'Columbus skyline photography opportunities',
          'Local craft beer selection'
        ],
        photoSpots: [
          'Columbus skyline backdrop from upper deck',
          'Modern stadium architecture',
          'Downtown Columbus views'
        ],
        bestValue: [
          'Upper Reserved for great views at lower cost',
          'General admission for budget-friendly option',
          'Group packages for families and parties'
        ]
      }
    },

    'charlotte-knights': {
      id: 'charlotte-knights',
      name: 'Truist Field',
      team: 'Charlotte Knights',
      opened: 2014,
      capacity: 10200,
      overview: {
        description: 'Truist Field is a state-of-the-art ballpark in uptown Charlotte, home to the Charlotte Knights, Triple-A affiliate of the Chicago White Sox. Located in the heart of Charlotte\'s business district, this modern facility offers spectacular city skyline views and serves as a premier entertainment destination.',
        highlights: [
          'Modern downtown ballpark in uptown Charlotte',
          'Charlotte skyline views beyond outfield',
          '360-degree concourse with continuous field visibility',
          'Premium amenities and diverse dining options',
          'Integrated into Charlotte\'s entertainment district'
        ],
        uniqueFeatures: [
          'Charlotte city skyline backdrop',
          'Complete 360-degree concourse visibility',
          'Year-round Paper Mill Pub at ballpark',
          'Homer the Dragon mascot entertainment',
          'Multiple group party areas and social spaces',
          'Cashless facility with modern conveniences'
        ],
        renovations: [
          { year: 2023, description: 'Paper Mill Pub opens as year-round dining venue' },
          { year: 2020, description: 'Enhanced safety and sanitation protocols' }
        ]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['First base side sections 101-105', 'Club level 201-204'],
          afternoon: ['Third base side sections 110-117', 'Upper club sections 205-209'],
          evening: ['Behind home plate sections', 'Most covered concourse areas']
        },
        coveredSeating: ['Club level sections with overhang', 'Some upper deck coverage'],
        shadeTips: [
          'Third base side gets afternoon shade first',
          'Upper club level provides best shade protection',
          '360-degree concourse offers shaded walking areas',
          'Evening games provide natural relief from sun'
        ],
        sunProtection: {
          sunscreenStations: ['Guest services behind section 104', 'First aid area'],
          shadedConcourses: ['Complete 360-degree main concourse', 'Club level indoor areas'],
          indoorAreas: ['Paper Mill Pub', 'Knights Armor Shoppe', 'Club lounges', 'Restroom facilities']
        },
        worstSunExposure: ['Right field sections', 'Left field general admission', 'Some lower bowl afternoon exposure'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 65, avgHumidity: 60, rainChance: 35, typicalConditions: 'Pleasant spring weather', shadeTip: 'Perfect conditions for any seating area' },
          { month: 'May', avgTemp: 74, avgHumidity: 65, rainChance: 30, typicalConditions: 'Warm and comfortable', shadeTip: 'Seek shade for day games' },
          { month: 'June', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Third base side preferred for day games' },
          { month: 'July', avgTemp: 86, avgHumidity: 75, rainChance: 40, typicalConditions: 'Hot and very humid', shadeTip: 'Club level recommended for comfort' },
          { month: 'August', avgTemp: 85, avgHumidity: 75, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Evening games much more comfortable' },
          { month: 'September', avgTemp: 79, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm but pleasant', shadeTip: 'Great weather for any seating' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'Club Level (201-209)', perks: ['Panoramic field views', 'Exclusive lounge access', 'Upscale dining options', 'Climate-controlled areas'], access: 'Second level behind home plate and foul territory' },
            { name: 'Field Box (101-117)', perks: ['Closest to action', 'Premium chairback seating', 'Enhanced sight lines'], access: 'Lower level throughout stadium' }
          ],
          suites: { levels: ['BELFOR Dugout Suites'], amenities: ['Private space', 'Catering options', 'Premium service', 'Elevator access'] },
          specialAreas: [
            { name: 'Group Party Areas', description: 'Social seating with entertainment options', capacity: 50 },
            { name: 'Outfield Group Areas', description: 'Casual group seating in outfield sections' }
          ]
        },
        budgetOptions: ['Upper level sections 210-219', 'General admission areas', 'Standing room concourse'],
        familySections: ['Designated family areas with activities', 'Kids entertainment zones'],
        standingRoom: ['360-degree concourse areas', 'Social gathering spaces'],
        partyAreas: [
          { name: 'Group Party Experiences', capacity: '20-100', amenities: ['Food packages', 'Entertainment', 'Social atmosphere', 'Game viewing'] }
        ],
        tips: [
          { section: 'Club Level 201-209', tip: 'Best overall experience with panoramic views and exclusive amenities', category: 'experience' },
          { section: 'Sections 101-105', tip: 'Prime lower level with excellent views, close to team store and concessions', category: 'experience' },
          { section: 'Upper Level 210-219', tip: 'Best value with bird\'s eye view of entire field', category: 'value' },
          { section: '360-degree concourse', tip: 'Continuous field visibility while walking around stadium', category: 'experience' }
        ]
      },
      concessions: {
        signature: ['BBQ sandwiches', 'Pulled pork nachos', 'Chicken and waffle sandwiches', 'Italian beef sandwiches', 'Fried PB&J'],
        local: ['Charlotte-style BBQ', 'Southern comfort food', 'Local craft beer selection', 'Regional specialties'],
        healthy: ['Grilled options', 'Fresh salads', 'Lighter fare'],
        vegetarian: ['Veggie burgers', 'Personal pizzas', 'Salads', 'Empanadas'],
        glutenFree: ['Available options throughout stadium - ask concession staff'],
        kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy', 'Bruster\'s Ice Cream (sections 105 & 110)'],
        alcohol: {
          beer: ['Local Charlotte breweries', 'Craft beer selection', 'Domestic options', 'Premium selections'],
          wine: true,
          cocktails: true,
          localBreweries: ['NoDa Brewing', 'Wooden Robot Brewery', 'Sycamore Brewing', 'Sugar Creek Brewing']
        }
      },
      parking: {
        lots: [
          { name: 'Mint Street Garage', distance: 'Adjacent', price: '$5-10', shadedSpots: true, covered: true, tip: 'Entrance on MLK Jr Blvd across from right field gate - closer and cheaper than surrounding lots' },
          { name: 'Uptown Surface Lots', distance: '0.1-0.3 miles', price: '$10-20', shadedSpots: false, covered: false, tip: 'Multiple options but can be expensive on event days' },
          { name: 'Evening Rate Parking', distance: '0.2-0.5 miles', price: '$5-15', shadedSpots: true, covered: true, tip: 'Many uptown decks offer evening rates after 5 PM' }
        ],
        streetParking: {
          available: true,
          restrictions: 'Metered parking with time limits, check signs carefully',
          tip: 'Limited availability, arrive early and check for special event restrictions'
        },
        alternativeTransport: {
          publicTransit: ['LYNX Blue Line to CTC/Arena Station (0.3 miles)', 'CATS bus routes to uptown'],
          rideShare: 'Designated pickup at South Mint Street',
          bicycle: 'Bike racks available around stadium'
        }
      },
      gates: [
        { name: 'Home Plate Gate', location: 'Main entrance behind home plate', bestFor: ['All seating areas', 'Premium access'], openTime: '1 hour before first pitch' },
        { name: 'Right Field Gate', location: 'South Mint Street', bestFor: ['Outfield seating', 'General admission'], openTime: '1 hour before first pitch' }
      ],
      amenities: {
        merchandise: [
          { location: 'Knights Armor Shoppe (behind section 103)', exclusive: ['Knights gear', 'White Sox affiliate items', 'Charlotte merchandise', 'Homer the Dragon items'] }
        ],
        firstAid: ['First aid room behind section 106'],
        babyChanging: ['Family restrooms throughout stadium'],
        atms: ['Concourse areas (cashless facility - credit cards only)'],
        wifi: { available: true, freeZones: ['Public areas throughout stadium'] },
        chargingStations: ['Club areas and premium sections'],
        kidZones: [
          { name: 'Kids Entertainment Areas', location: 'Various concourse locations', activities: ['Interactive games', 'Homer the Dragon appearances', 'Family activities'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['ADA seating available behind back row of all sections'],
          entrance: 'All gates wheelchair accessible',
          elevators: ['Elevator behind Section 109 for upper levels and dugout suites']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels throughout stadium'],
        accessibleConcessions: ['All major concession areas'],
        parkingSpaces: 'Accessible parking available in Mint Street Garage and surrounding lots'
      },
      gameDay: {
        tips: [
          { title: 'Cashless Facility', description: 'Only credit cards accepted (Visa, MasterCard, Amex, Discover) - no cash', category: 'arrival' },
          { title: '360-Degree Walk', description: 'Do a complete concourse walk to see all food options before deciding', category: 'food' },
          { title: 'Pre-Game Uptown', description: 'Explore uptown Charlotte\'s restaurants and bars before game', category: 'experience' },
          { title: 'Paper Mill Pub', description: 'Year-round dining venue at ballpark for pre/post-game', category: 'food' }
        ],
        typicalSchedule: {
          gatesOpen: '1 hour before first pitch',
          battingPractice: '1.5 hours before first pitch',
          firstPitch: 'Varies by game',
          rushHours: ['30 minutes before first pitch', 'Between innings']
        },
        security: {
          allowedBags: 'Bags no larger than 14" x 14" x 6" (exceptions for diaper bags with child present and medical bags)',
          prohibitedItems: ['Cans', 'Bottles', 'Plastic containers', 'Coolers', 'Food packages', 'Outside alcohol'],
          metalDetectors: true,
          clearBagPolicy: false
        }
      },
      neighborhood: {
        name: 'Uptown Charlotte',
        description: 'Located in the heart of Charlotte\'s business and entertainment district with numerous hotels, restaurants, bars, and attractions within walking distance.',
        beforeGame: ['Uptown restaurants', 'Local breweries', 'Paper Mill Pub at ballpark', 'Charlotte attractions'],
        afterGame: ['Uptown nightlife', 'Restaurant scene', 'Entertainment venues', 'Hotel bars'],
        radius: 'Extensive dining and entertainment within 0.5 miles'
      },
      transportation: {
        address: '324 South Mint Street, Charlotte, NC 28202',
        publicTransit: {
          train: [
            { lines: ['LYNX Blue Line'], station: 'CTC/Arena Station', walkTime: '5 minutes' }
          ],
          bus: [
            { routes: ['Multiple CATS routes'], stops: ['Uptown transit center', 'Various uptown stops'] }
          ]
        },
        driving: {
          majorRoutes: ['I-77', 'I-85', 'I-277 (inner loop)', 'US-74'],
          typicalTraffic: 'Heavy during rush hours and events',
          bestApproach: 'I-277 to uptown exits, follow signs to stadium'
        },
        rideShare: {
          pickupZone: 'Designated areas on South Mint Street',
          dropoffZone: 'Main entrance area',
          surgePricing: 'Moderate for Triple-A games, higher during concurrent uptown events'
        }
      },
      history: {
        timeline: [
          { year: 2014, event: 'Truist Field (originally BB&T Ballpark) opens' },
          { year: 2014, event: 'Knights move from Knights Stadium to new downtown facility' },
          { year: 1999, event: 'Knights become White Sox affiliate' },
          { year: 1993, event: 'Charlotte becomes Triple-A franchise' },
          { year: 1988, event: 'Team renamed Charlotte Knights' },
          { year: 2021, event: 'Extended White Sox affiliation through 2030' }
        ],
        traditions: [
          { name: 'Homer the Dragon', description: 'Beloved team mascot entertaining fans since team\'s early days' },
          { name: 'Queen City Connection', description: 'Team name honors Charlotte\'s "Queen City" nickname' },
          { name: 'Traffic Cone Theme Nights', description: 'Playful tribute to Charlotte\'s construction and traffic cones' },
          { name: 'Hornets Tribute Nights', description: 'Honor Charlotte\'s historic minor league teams with throwback jerseys' }
        ],
        notableGames: [
          { date: '2014', description: 'Inaugural game at new Truist Field' },
          { date: '1993', description: 'International League Championship' },
          { date: '1999', description: 'International League Championship as White Sox affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Modern urban ballpark experience with strong community connection and family-friendly entertainment in Charlotte\'s vibrant uptown setting.',
        bestExperiences: [
          'Charlotte skyline views from upper sections',
          '360-degree concourse with continuous field visibility',
          'Homer the Dragon mascot interactions',
          'Uptown Charlotte pre/post-game activities',
          'Paper Mill Pub year-round dining'
        ],
        traditions: [
          'Mascot races and entertainment',
          'Between-inning fan participation',
          'Theme nights and special events',
          'Community outreach programs'
        ],
        mascot: { name: 'Homer the Dragon', description: 'Energetic team mascot who provides entertainment throughout games with interactive activities and fan engagement' }
      },
      proTips: {
        insiderTips: [
          'Use Mint Street Garage entrance on MLK Jr Blvd, not Mint Street',
          'Do complete 360-degree concourse walk to see all food options',
          'Paper Mill Pub open year-round for pre/post-game dining',
          'Club level offers best shade and amenities for hot summer games',
          'Take LYNX Blue Line to avoid downtown parking hassles'
        ],
        avoidThese: [
          'Overpriced surface lots near other venues on event days',
          'Bringing cash - stadium is completely cashless',
          'Large bags - strict 14" size limit enforced',
          'Rush hour traffic downtown'
        ],
        hiddenGems: [
          'Charlotte skyline photography from upper sections',
          'Local craft beer selection throughout stadium',
          'Knights Armor Shoppe exclusive merchandise',
          'Multiple group party areas for social experiences'
        ],
        photoSpots: [
          'Charlotte skyline backdrop from upper deck',
          'Modern stadium architecture exterior',
          'Homer the Dragon mascot photo ops',
          '360-degree concourse views'
        ],
        bestValue: [
          'Upper level sections for great views at lower cost',
          'Evening games for comfort and atmosphere',
          'Group packages for families and parties',
          'Season ticket plans for regular attendees'
        ]
      }
    },

    'durham-bulls': {
      id: 'durham-bulls',
      name: 'Durham Bulls Athletic Park',
      team: 'Durham Bulls',
      opened: 1995,
      capacity: 10000,
      overview: {
        description: 'Durham Bulls Athletic Park (DBAP) is an iconic ballpark in downtown Durham, home to the Durham Bulls, Triple-A affiliate of the Tampa Bay Rays. Famous for its connection to the movie "Bull Durham," this ballpark sits in the heart of the American Tobacco Campus and celebrates Durham\'s rich tobacco heritage.',
        highlights: [
          'Iconic connection to the movie "Bull Durham"',
          'Located in historic American Tobacco Campus',
          'Famous Blue Monster left field wall seating',
          '360-degree walkable concourse',
          'Rich tobacco heritage and Bull City history'
        ],
        uniqueFeatures: [
          '32-foot high Blue Monster left field wall with seating',
          'Bull sign modeled after the movie prop',
          'American Tobacco Campus setting',
          'All seats have extra width and cup holders',
          '95% of seats feature seat backs',
          'Cashless facility with local food emphasis'
        ],
        renovations: [
          { year: 2019, description: 'Enhanced concession and facility improvements' },
          { year: 2015, description: 'Stadium upgrades and modernization' }
        ]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['First base side sections 116-119', 'Covered sections 200-203'],
          afternoon: ['Third base side sections 100-104', 'Covered sections 204-208'],
          evening: ['Behind home plate covered sections', 'Blue Monster seating provides some relief']
        },
        coveredSeating: ['Sections 200-208 (approximately 2,500 seats)', 'Roof covers home plate and baselines'],
        shadeTips: [
          'Covered sections 200-208 provide best protection',
          'Blue Monster seating gets afternoon shade',
          '360-degree concourse offers shaded walking',
          'Evening games provide natural relief'
        ],
        sunProtection: {
          sunscreenStations: ['Guest services areas', 'First aid stations'],
          shadedConcourses: ['Complete 360-degree concourse', 'Covered concession areas'],
          indoorAreas: ['Team store', 'Concession stands', 'Restroom facilities', 'Bull City Hospitality areas']
        },
        worstSunExposure: ['Right field sections', 'Some lower bowl areas', 'Outfield general admission'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 67, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring weather', shadeTip: 'Great conditions for any seating' },
          { month: 'May', avgTemp: 75, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and comfortable', shadeTip: 'Consider covered sections for day games' },
          { month: 'June', avgTemp: 83, avgHumidity: 75, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Covered sections highly recommended' },
          { month: 'July', avgTemp: 86, avgHumidity: 78, rainChance: 45, typicalConditions: 'Hot, humid with afternoon storms', shadeTip: 'Covered seating essential for comfort' },
          { month: 'August', avgTemp: 85, avgHumidity: 78, rainChance: 40, typicalConditions: 'Hot and very humid', shadeTip: 'Evening games much more comfortable' },
          { month: 'September', avgTemp: 79, avgHumidity: 73, rainChance: 30, typicalConditions: 'Warm but pleasant', shadeTip: 'Excellent conditions for all seating' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'Covered Sections (200-208)', perks: ['Weather protection', 'Premium views', 'Enhanced amenities'], access: 'Upper level with roof coverage' },
            { name: 'Blue Monster Seating', perks: ['Unique experience', 'Above 32-foot left field wall', 'Great views'], access: 'Left field wall seating' }
          ],
          suites: { levels: ['Premium suite options'], amenities: ['Private space', 'Catering', 'Climate control'] },
          specialAreas: [
            { name: 'Blue Monster', description: 'Seating above the famous 32-foot left field wall', capacity: 100 },
            { name: 'Group Areas', description: 'Various group seating options throughout park' }
          ]
        },
        budgetOptions: ['General admission sections', 'Outfield seating', 'Standing room areas'],
        familySections: ['Designated family areas', 'Kids zones with activities'],
        standingRoom: ['360-degree concourse', 'Social areas'],
        partyAreas: [
          { name: 'Group Experiences', capacity: '20-200', amenities: ['Food packages', 'Entertainment', 'Dedicated areas'] }
        ],
        tips: [
          { section: 'Covered Sections 200-208', tip: 'Best weather protection and comfort for hot/rainy days', category: 'shade' },
          { section: 'Blue Monster Seating', tip: 'Unique experience above famous left field wall', category: 'experience' },
          { section: 'Accessible Seating', tip: 'Available in sections 100, 103, 104, 116-122, 128, 130, 132, 134', category: 'accessibility' },
          { section: '360-degree concourse', tip: 'Can walk completely around field with continuous views', category: 'experience' }
        ]
      },
      concessions: {
        signature: ['Bright Leaf Hot Dogs', 'BBQ from Brookwood Farms', 'Local Durham specialties'],
        local: ['Brookwood Farms BBQ', 'Chick-fil-A (locally owned)', 'Mezcalito', 'Jimmy\'s Gourmet Popcorn', 'Loco Pops', 'Pie Pushers Pizza', 'Rita\'s Italian Ice', 'Two Roosters Ice Cream'],
        healthy: ['Fresh fruit', 'Hummus with pretzels', 'Salads', 'Impossible veggie dogs'],
        vegetarian: ['Vegan burgers', 'Impossible veggie dogs', 'Pizza options'],
        glutenFree: ['Gluten-sensitive chicken tenders', 'Gluten-free hot dog buns', 'Various options available'],
        kidsFriendly: ['Dollar Dogs on Thursdays', 'Popcorn', 'Ice cream', 'Cotton candy'],
        alcohol: {
          beer: ['Foothills Beer Garden', 'Local craft selections', '$5 tallboy specials on Tuesdays'],
          wine: true,
          cocktails: false,
          localBreweries: ['Foothills Brewing', 'Local Triangle area breweries']
        }
      },
      parking: {
        lots: [
          { name: 'North Deck', distance: 'Adjacent', price: '$7', shadedSpots: true, covered: true, tip: 'Covered parking deck - no cash accepted, cards only' },
          { name: 'South Deck', distance: 'Adjacent', price: '$7', shadedSpots: true, covered: true, tip: 'Convenient covered parking - cards only' },
          { name: 'East Deck', distance: 'Adjacent', price: '$7', shadedSpots: true, covered: true, tip: 'Multiple deck options around stadium' },
          { name: 'Free Parking', distance: '0.3-0.5 miles', price: 'Free', shadedSpots: false, covered: false, tip: 'Available for those willing to walk further' }
        ],
        streetParking: {
          available: true,
          restrictions: 'Limited downtown metered parking',
          tip: 'Very limited availability, arrive early'
        },
        alternativeTransport: {
          publicTransit: ['Durham bus routes to downtown'],
          rideShare: 'Available with designated pickup areas',
          bicycle: 'Bike parking available at American Tobacco Campus'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Home plate entrance', bestFor: ['All seating areas', 'Premium access'], openTime: '1 hour before first pitch' },
        { name: 'Outfield Gates', location: 'Various outfield entrances', bestFor: ['General admission', 'Outfield seating'], openTime: '1 hour before first pitch' }
      ],
      amenities: {
        merchandise: [
          { location: 'Bulls Team Store', exclusive: ['Bulls gear', 'Bull Durham movie merchandise', 'Wool E Bull items', 'Rays affiliate gear'] }
        ],
        firstAid: ['First aid stations throughout park'],
        babyChanging: ['Family restrooms throughout stadium'],
        atms: ['Cashless facility - cards only accepted'],
        wifi: { available: true, freeZones: ['Public areas throughout park'] },
        kidZones: [
          { name: 'Kids Activity Areas', location: 'Various concourse locations', activities: ['Interactive games', 'Wool E Bull appearances', 'Family entertainment'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['Sections 100, 103, 104, 116, 117, 118, 119, 120, 122, 128, 130, 132, 134'],
          entrance: 'All gates accessible',
          elevators: ['Available to all levels']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All major concession areas'],
        parkingSpaces: 'Accessible parking available in all decks'
      },
      gameDay: {
        tips: [
          { title: 'Cashless Facility', description: 'Only cards accepted throughout park - no cash', category: 'arrival' },
          { title: 'Blue Monster Experience', description: 'Unique seating above the famous left field wall', category: 'experience' },
          { title: 'Theme Nights', description: 'Bull Durham movie nights and special promotions throughout season', category: 'experience' },
          { title: 'Local Food Tour', description: 'Try Bull City Hospitality\'s local vendor selections', category: 'food' }
        ],
        typicalSchedule: {
          gatesOpen: '1 hour before first pitch',
          battingPractice: '1.5 hours before first pitch',
          firstPitch: 'Varies by game',
          rushHours: ['30 minutes before first pitch', 'Between innings']
        },
        security: {
          allowedBags: 'Bags up to 16" x 16" x 8" allowed (not required to be clear)',
          prohibitedItems: ['Large bags over size limit', 'Outside food and beverages', 'Weapons'],
          metalDetectors: true,
          clearBagPolicy: false
        }
      },
      neighborhood: {
        name: 'American Tobacco Campus',
        description: 'Located in downtown Durham\'s historic American Tobacco Campus, a revitalized tobacco warehouse complex with restaurants, bars, and entertainment venues.',
        beforeGame: ['American Tobacco Campus restaurants', 'Downtown Durham dining', 'Historic tobacco district exploration'],
        afterGame: ['Campus bars and restaurants', 'Downtown Durham nightlife', 'Historic district attractions'],
        radius: 'Multiple dining and entertainment options within walking distance'
      },
      transportation: {
        address: '409 Blackwell Street, Durham, NC 27701',
        publicTransit: {
          bus: [
            { routes: ['Durham GoDurham bus routes'], stops: ['Downtown Durham stops', 'American Tobacco Campus'] }
          ]
        },
        driving: {
          majorRoutes: ['I-85', 'I-40', 'NC-147 (Durham Freeway)', 'US-15-501'],
          typicalTraffic: 'Moderate downtown traffic',
          bestApproach: 'NC-147 to downtown Durham exits'
        },
        rideShare: {
          pickupZone: 'Designated areas at American Tobacco Campus',
          dropoffZone: 'Main entrance area',
          surgePricing: 'Minimal for minor league games'
        }
      },
      history: {
        timeline: [
          { year: 1995, event: 'Durham Bulls Athletic Park opens' },
          { year: 1988, event: 'Movie "Bull Durham" brings national attention to team' },
          { year: 1998, event: 'Becomes Tampa Bay Rays affiliate' },
          { year: 1992, event: 'Wool E Bull mascot debuts' },
          { year: 1913, event: 'Team renamed Durham Bulls' },
          { year: 1902, event: 'Durham\'s first minor league team formed as Tobacconists' }
        ],
        traditions: [
          { name: 'Bull Durham Movie Connection', description: 'Ballpark celebrates its famous movie connection with theme nights and memorabilia' },
          { name: 'Tobacco Heritage', description: 'Honors Durham\'s historic role in tobacco industry' },
          { name: 'Bull Durham Mascot Race', description: 'Themed mascot races during games' }
        ],
        notableGames: [
          { date: '2021', description: 'Triple-A Championship victory' },
          { date: '2017', description: 'Triple-A Championship victory' },
          { date: '2009', description: 'Triple-A Championship victory' }
        ]
      },
      fanExperience: {
        atmosphere: 'Historic ballpark atmosphere with strong connection to baseball movie culture and Durham\'s tobacco heritage, creating an authentic Bull City experience.',
        bestExperiences: [
          'Blue Monster seating above left field wall',
          'Wool E Bull mascot entertainment and Go Kart rides',
          'Bull Durham movie connections and memorabilia',
          'American Tobacco Campus historic setting',
          'Local Bull City Hospitality food vendors'
        ],
        traditions: [
          'Wool E Bull\'s Bright Leaf Hot Dog Launcher',
          'Bull Durham themed promotions',
          'Mascot races and entertainment',
          'Between-inning activities'
        ],
        mascot: { name: 'Wool E Bull', description: '2016 Baseball America MiLB Mascot of the Year who entertains with dancing, t-shirt launches, and Go Kart rides around the stadium' }
      },
      proTips: {
        insiderTips: [
          'Experience the Blue Monster seating for unique left field wall views',
          'Take advantage of covered sections 200-208 for weather protection',
          'Try the local vendors emphasized by Bull City Hospitality',
          'Visit during Bull Durham movie theme nights for special atmosphere',
          'Park in covered decks to avoid weather issues'
        ],
        avoidThese: [
          'Bringing cash - completely cashless facility',
          'Large bags over 16x16x8 inch limit',
          'Missing Wool E Bull\'s entertainment during games'
        ],
        hiddenGems: [
          '360-degree walkable concourse with continuous field views',
          'American Tobacco Campus historic architecture',
          'Local Durham food vendors throughout park',
          'Bull sign replica from the famous movie'
        ],
        photoSpots: [
          'Blue Monster left field wall seating',
          'Bull sign modeled after movie prop',
          'American Tobacco Campus historic buildings',
          'Wool E Bull mascot interactions'
        ],
        bestValue: [
          'General admission for budget-friendly option',
          'Tuesday tacos and tallboys promotion',
          'Thursday dollar dog specials',
          'Group packages for families'
        ]
      }
    },

    'indianapolis-indians': {
      id: 'indianapolis-indians',
      name: 'Victory Field',
      team: 'Indianapolis Indians',
      opened: 1996,
      capacity: 14230,
      overview: {
        description: 'Victory Field is widely regarded as one of the finest ballparks in Minor League Baseball, home to the Indianapolis Indians, Triple-A affiliate of the Pittsburgh Pirates. Located on the west side of downtown Indianapolis, it offers unparalleled views of the city skyline and has been recognized as the "Best Minor League Ballpark in America" by Sports Illustrated and Baseball America.',
        highlights: [
          'Recognized as "Best Minor League Ballpark in America"',
          'Spectacular downtown Indianapolis skyline views',
          'Two-tier seating with expansive grass berm',
          'Award-winning ballpark design and amenities',
          'Perfect integration with downtown Indianapolis'
        ],
        uniqueFeatures: [
          'Lush grass berm area wrapping around outfield',
          'Unparalleled downtown skyline backdrop',
          'Open concourse with continuous field viewing',
          '28 luxury suites and premium amenities',
          'Perfectly sloped lawn seating',
          'Adjacent to White River State Park'
        ],
        renovations: [
          { year: 2019, description: 'Enhanced concession and facility upgrades' },
          { year: 2015, description: 'Technology and amenity improvements' }
        ]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['First base side box seats', 'East side reserved seating'],
          afternoon: ['Third base side sections', 'Upper reserved west side'],
          evening: ['Behind home plate sections', 'Covered concourse areas']
        },
        coveredSeating: ['Upper deck overhang areas', 'Some concourse coverage'],
        shadeTips: [
          'Upper reserved sections provide some afternoon shade',
          'Lawn area can be sunny - bring blankets and shade',
          'Open concourse offers shaded walking areas',
          'Evening games provide natural relief from sun'
        ],
        sunProtection: {
          sunscreenStations: ['Guest services areas', 'First aid stations'],
          shadedConcourses: ['Open concourse areas', 'Concession stand coverage'],
          indoorAreas: ['Elements Financial Club', 'Suite levels', 'Team store', 'Restroom facilities']
        },
        worstSunExposure: ['Lawn seating areas', 'Bleacher sections', 'Some lower box seats'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 58, avgHumidity: 65, rainChance: 40, typicalConditions: 'Cool spring weather', shadeTip: 'Layer clothing for changing conditions' },
          { month: 'May', avgTemp: 69, avgHumidity: 68, rainChance: 35, typicalConditions: 'Pleasant spring weather', shadeTip: 'Great conditions for any seating' },
          { month: 'June', avgTemp: 78, avgHumidity: 72, rainChance: 30, typicalConditions: 'Warm summer weather', shadeTip: 'Consider shade for day games' },
          { month: 'July', avgTemp: 82, avgHumidity: 75, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Upper sections preferred for day games' },
          { month: 'August', avgTemp: 80, avgHumidity: 75, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Evening games much more comfortable' },
          { month: 'September', avgTemp: 73, avgHumidity: 70, rainChance: 25, typicalConditions: 'Pleasant fall weather', shadeTip: 'Perfect conditions for all seating' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'Elements Financial Club', perks: ['All-inclusive food and drink', 'Climate control', 'Premium views'], access: 'Premium club level - $85 per person' },
            { name: 'Yuengling Landing', perks: ['Table-top seating', 'Wait service', 'Left field corner location'], access: 'Left field area - $30 per person, capacity 150' }
          ],
          suites: { levels: ['28 luxury suites', '5 suite-level party areas'], amenities: ['Private space', 'Catering options', 'Premium service'] },
          specialAreas: [
            { name: 'Picnic Areas', description: 'Two large group picnic areas', capacity: 100 },
            { name: 'Party Areas', description: 'Five suite-level party spaces for groups' }
          ]
        },
        budgetOptions: ['Lawn seating ($9)', 'Bleacher seats ($9)', 'Upper reserved ($9)'],
        familySections: ['PNC Plaza children\'s play zone', 'Lawn areas perfect for families with blankets'],
        standingRoom: ['Open concourse areas', 'Berm areas'],
        partyAreas: [
          { name: 'Suite-Level Party Areas', capacity: '25-50', amenities: ['Private space', 'Food options', 'Premium views'] }
        ],
        tips: [
          { section: 'Box Seats', tip: 'Best views of action and skyline - $13-19 depending on game', category: 'experience' },
          { section: 'Lawn Seating', tip: 'Perfect for families with blankets, allows coolers, great value at $9', category: 'value' },
          { section: 'Elements Financial Club', tip: 'All-inclusive premium experience with food and drinks', category: 'experience' },
          { section: 'Yuengling Landing', tip: 'Unique table-top seating with wait service in left field', category: 'experience' }
        ]
      },
      concessions: {
        signature: ['Traditional ballpark fare', 'Grilled hot dogs', 'Indianapolis specialties'],
        local: ['Local Indianapolis vendors', 'Regional favorites', 'Indiana craft beer'],
        healthy: ['Fresh options available at various stands'],
        vegetarian: ['Pizza options', 'Various vegetarian selections'],
        glutenFree: ['Available options - ask concession staff'],
        kidsFriendly: ['Hot dogs', 'Pizza', 'Ice cream', 'Nachos'],
        alcohol: {
          beer: ['Local craft breweries', 'Domestic selections', 'Premium options'],
          wine: false,
          cocktails: false,
          localBreweries: ['Indiana craft beer selections']
        }
      },
      parking: {
        lots: [
          { name: 'Government Center Garage', distance: '0.12 miles (3 min walk)', price: '$10', shadedSpots: true, covered: true, tip: 'Most convenient - right outside gates at West & Maryland, 2,900 spaces' },
          { name: 'White River State Park Surface Lot', distance: '0.15 miles (3 min walk)', price: '$10', shadedSpots: false, covered: false, tip: 'Close to park with easy access' },
          { name: 'Convention Center Lot A', distance: '0.2 miles (4 min walk)', price: '$10', shadedSpots: false, covered: false, tip: 'Multiple downtown options' },
          { name: 'Diamond Chain Lot', distance: '0.2 miles (4 min walk)', price: '$10', shadedSpots: false, covered: false, tip: 'Additional downtown parking' }
        ],
        streetParking: {
          available: true,
          restrictions: 'Downtown metered parking with time limits',
          tip: 'Limited availability, parking garages recommended'
        },
        alternativeTransport: {
          publicTransit: ['IndyGo bus routes to downtown'],
          rideShare: 'Available with designated areas',
          bicycle: 'Bike parking available near stadium'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Corner of West and Maryland Streets', bestFor: ['All seating areas', 'Box office'], openTime: '1 hour before first pitch' },
        { name: 'Right Field Gate', location: 'West Street', bestFor: ['Bus drop-off', 'Group access'], openTime: '1 hour before first pitch' }
      ],
      amenities: {
        merchandise: [
          { location: 'Indians Team Store', exclusive: ['Indians gear', 'Pirates affiliate items', 'Victory Field merchandise'] }
        ],
        firstAid: ['First aid stations throughout stadium'],
        babyChanging: ['Family restrooms available'],
        atms: ['Cashless concessions - cards, Google Pay, Apple Pay accepted'],
        wifi: { available: true, freeZones: ['Free WiFi throughout park'] },
        kidZones: [
          { name: 'PNC Plaza Children\'s Play Zone', location: 'Plaza area', activities: ['Playground equipment', 'Interactive games', 'Family activities'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['Accessible seating throughout stadium'],
          entrance: 'All gates wheelchair accessible',
          elevators: ['Available to all levels']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All major concession areas'],
        parkingSpaces: '50 handicap accessible parking spaces available for home games'
      },
      gameDay: {
        tips: [
          { title: 'Cooler Policy', description: 'Single-handed coolers up to 20 inches allowed (no glass or alcohol)', category: 'arrival' },
          { title: 'Lawn Experience', description: 'Bring blankets for lawn seating - perfect for families', category: 'family' },
          { title: 'Digital Ticketing', description: 'Contactless entry available for all fans', category: 'arrival' },
          { title: 'Downtown Location', description: 'Explore downtown Indianapolis before/after games', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '1 hour before first pitch',
          battingPractice: '1.5 hours before first pitch',
          firstPitch: 'Varies by game',
          rushHours: ['30 minutes before first pitch', 'Between innings']
        },
        security: {
          allowedBags: 'Single-handed coolers up to 20 inches allowed',
          prohibitedItems: ['Glass containers', 'Outside alcoholic beverages', 'Large coolers'],
          metalDetectors: true,
          clearBagPolicy: false
        }
      },
      neighborhood: {
        name: 'Downtown Indianapolis',
        description: 'Located on the west side of downtown Indianapolis adjacent to White River State Park, with easy access to the city\'s dining, entertainment, and cultural attractions.',
        beforeGame: ['Downtown Indianapolis restaurants', 'White River State Park', 'Cultural attractions', 'City center venues'],
        afterGame: ['Downtown nightlife', 'Restaurant district', 'Entertainment venues', 'Hotel bars'],
        radius: 'Extensive downtown amenities within walking distance'
      },
      transportation: {
        address: '501 West Maryland Street, Indianapolis, IN 46225',
        publicTransit: {
          bus: [
            { routes: ['IndyGo bus routes'], stops: ['Downtown Indianapolis stops'] }
          ]
        },
        driving: {
          majorRoutes: ['I-65', 'I-70', 'I-465 (outer loop)', 'US-40'],
          typicalTraffic: 'Moderate downtown traffic',
          bestApproach: 'I-65 or I-70 to downtown exits'
        },
        rideShare: {
          pickupZone: 'Designated areas near stadium',
          dropoffZone: 'Main entrance area',
          surgePricing: 'Minimal for minor league games'
        }
      },
      history: {
        timeline: [
          { year: 1996, event: 'Victory Field opens' },
          { year: 2005, event: 'Becomes Pirates affiliate' },
          { year: 2000, event: 'Named "Best Minor League Ballpark" by Sports Illustrated' },
          { year: 1998, event: 'Baseball America names it "Best Minor League Ballpark"' }
        ],
        traditions: [
          { name: 'Award-Winning Excellence', description: 'Consistently recognized as premier minor league facility' },
          { name: 'Downtown Integration', description: 'Seamless connection with Indianapolis downtown and White River State Park' },
          { name: 'Family Atmosphere', description: 'Strong emphasis on family-friendly entertainment and accessibility' }
        ]
      },
      fanExperience: {
        atmosphere: 'Premium minor league experience combining award-winning facility design with downtown Indianapolis charm and unparalleled skyline views.',
        bestExperiences: [
          'Indianapolis skyline views from seating areas',
          'Lawn seating with blankets and coolers',
          'Open concourse with continuous field visibility',
          'Elements Financial Club premium experience',
          'PNC Plaza children\'s activities'
        ],
        traditions: [
          'Between-inning entertainment',
          'Family-friendly activities',
          'Community engagement events',
          'Mascot interactions'
        ],
        mascot: { name: 'Rowdie', description: 'Team mascot providing entertainment and fan engagement throughout games' }
      },
      proTips: {
        insiderTips: [
          'Government Center Garage is most convenient parking right outside gates',
          'Lawn seating allows coolers and is perfect for families with kids',
          'Elements Financial Club includes all food and drinks for premium experience',
          'Open concourse allows viewing field from anywhere in stadium',
          'Evening games provide best skyline views and weather comfort'
        ],
        avoidThese: [
          'Buses and RVs not allowed in Victory Field parking lot',
          'Glass containers prohibited even in allowed coolers',
          'Day games can be very sunny on lawn areas'
        ],
        hiddenGems: [
          'White River State Park adjacent to stadium for pre-game activities',
          'Yuengling Landing unique table seating with wait service',
          'Free WiFi throughout entire ballpark',
          'PNC Plaza children\'s area for family entertainment'
        ],
        photoSpots: [
          'Indianapolis skyline backdrop from upper sections',
          'Victory Field exterior architecture',
          'Lawn seating with city views',
          'Open concourse panoramic views'
        ],
        bestValue: [
          'Lawn seating at $9 - bring blankets and coolers',
          'Reserved seating at $9 for great views',
          'Group packages for families and parties',
          'Season ticket options for regular attendees'
        ]
      }
    },

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
    },
    'gwinnett-stripers': {
      id: 'gwinnett-stripers',
      name: 'Coolray Field',
      team: 'Gwinnett Stripers',
      opened: 2009,
      capacity: 10427,
      overview: {
        description: 'Coolray Field is home to the Gwinnett Stripers, the Triple-A affiliate of the Atlanta Braves. Located in Lawrenceville, this modern facility offers a premier baseball experience in the Atlanta metro area.',
        highlights: [
          'Modern facilities opened in 2009',
          'Close to Atlanta metro area',
          'Family-friendly atmosphere',
          'Excellent player development facility'
        ],
        uniqueFeatures: [
          'The Cutter\'s Bar & Grill',
          'Kids Zone playground area',
          'Party pavilions',
          'Grass berm seating',
          'Wide concourses with great views'
        ],
        renovations: [
          { year: 2018, description: 'Rebranded from Gwinnett Braves to Stripers' },
          { year: 2020, description: 'Upgraded video board and sound' },
          { year: 2022, description: 'Enhanced concession areas' }
        ]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side sections', 'Club level'],
          afternoon: ['First base side sections 101-108', 'Suite level'],
          evening: ['Most infield sections after 6 PM', 'Behind home plate']
        },
        coveredSeating: ['Club level', 'Suite level', 'Pavilion areas'],
        shadeTips: [
          'First base side for afternoon shade',
          'Club level has indoor access',
          'Pavilions provide coverage',
          'Evening games most comfortable in summer'
        ],
        sunProtection: {
          sunscreenStations: ['Guest services'],
          shadedConcourses: ['Main concourse', 'Club level'],
          indoorAreas: ['Cutter\'s Bar & Grill', 'Team store', 'Club areas']
        },
        worstSunExposure: ['Left field lawn', 'Right field sections', 'Bleacher seating'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 65, avgHumidity: 60, rainChance: 35, typicalConditions: 'Mild spring weather', shadeTip: 'Perfect baseball weather' },
          { month: 'May', avgTemp: 73, avgHumidity: 65, rainChance: 40, typicalConditions: 'Warming up', shadeTip: 'Seek shade for day games' },
          { month: 'June', avgTemp: 81, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'First base side for shade' },
          { month: 'July', avgTemp: 85, avgHumidity: 73, rainChance: 45, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games recommended' },
          { month: 'August', avgTemp: 84, avgHumidity: 75, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Hydrate frequently' },
          { month: 'September', avgTemp: 77, avgHumidity: 70, rainChance: 30, typicalConditions: 'Still warm', shadeTip: 'More comfortable evenings' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [
            { name: 'SunTrust Club', perks: ['All-inclusive food/drinks', 'Climate controlled', 'Premium seating'], access: 'Behind home plate' }
          ],
          suites: {
            levels: ['Suite level'],
            amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
          },
          specialAreas: [
            { name: 'Party Pavilions', description: 'Group areas with shade', capacity: 50 },
            { name: 'Grass Berm', description: 'Lawn seating in outfield', capacity: 500 }
          ]
        },
        budgetOptions: ['Grass berm', 'Upper reserved', 'Outfield box'],
        familySections: ['Sections 113-115'],
        standingRoom: ['Concourse areas', 'Bar areas'],
        partyAreas: [
          { name: 'Left Field Pavilion', capacity: '75', amenities: ['Covered seating', 'Buffet options'] },
          { name: 'Right Field Pavilion', capacity: '75', amenities: ['Covered seating', 'Group atmosphere'] }
        ],
        tips: [
          { section: 'Sections 105-109', tip: 'Best overall views', category: 'view' },
          { section: 'Grass Berm', tip: 'Great for families', category: 'family' },
          { section: 'First base side', tip: 'Afternoon shade', category: 'shade' },
          { section: 'Club Level', tip: 'Premium experience', category: 'experience' }
        ]
      },
      concessions: {
        signature: ['Striped Burger', 'BBQ nachos', 'Local craft beers', 'Funnel cakes'],
        local: ['Georgia BBQ', 'Terrapin beer', 'SweetWater brewing', 'Varsity hot dogs'],
        healthy: ['Salads', 'Grilled chicken', 'Fresh fruit', 'Veggie options'],
        vegetarian: ['Veggie burgers', 'Salads', 'Pizza', 'Nachos'],
        glutenFree: ['GF options available'],
        kidsFriendly: ['Hot dogs', 'Pizza', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
        alcohol: {
          beer: ['Terrapin', 'SweetWater', 'Monday Night', 'Domestic options'],
          wine: true,
          cocktails: true,
          localBreweries: ['Terrapin', 'SweetWater', 'Monday Night', 'Creature Comforts']
        }
      },
      parking: {
        lots: [
          { name: 'Main Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
          { name: 'Overflow Lot', distance: '5 min walk', price: 'Free', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          rideShare: 'Designated drop-off area',
          bicycle: 'Bike racks available'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Main entrance', bestFor: ['All sections'], openTime: '90 minutes before first pitch' },
        { name: 'Left Field Gate', location: 'Left field', bestFor: ['Outfield and berm'], openTime: '60 minutes before first pitch' }
      ],
      amenities: {
        merchandise: [
          { location: 'Stripers Store', exclusive: ['Stripers gear', 'Braves affiliate items'] }
        ],
        firstAid: ['Behind section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true, network: 'Coolray_WiFi' },
        kidZones: [
          { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Inflatables', 'Games'] }
        ]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels have ADA seating'],
          entrance: 'All gates accessible',
          elevators: ['Available to upper levels']
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
          { title: 'Arrive early for parking', description: 'Limited spaces fill quickly', category: 'arrival' },
          { title: 'Check theme nights', description: 'Special promotions', category: 'experience' },
          { title: 'Grass berm great for kids', description: 'Bring blankets', category: 'family' },
          { title: 'Thirsty Thursday', description: 'Drink specials', category: 'food' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before first pitch',
          firstPitch: '7:05 PM weekdays, 6:05 PM Saturdays',
          rushHours: ['5:00-6:30 PM on I-85 and SR-316']
        },
        security: {
          allowedBags: 'Small bags allowed',
          prohibitedItems: ['Outside food/drinks', 'Weapons'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Lawrenceville',
        description: 'Suburban area with shopping and dining',
        beforeGame: ['Local restaurants in Lawrenceville', 'Mall of Georgia area'],
        afterGame: ['Downtown Lawrenceville', 'Local bars'],
        radius: '2-5 miles'
      },
      transportation: {
        address: '2500 Buford Dr, Lawrenceville, GA 30043',
        publicTransit: {
          bus: [{ routes: ['Limited Gwinnett County Transit'], stops: ['Nearby stops'] }]
        },
        driving: {
          majorRoutes: ['I-85 to SR-20', 'SR-316 to SR-20'],
          typicalTraffic: 'Moderate on highways',
          bestApproach: 'From I-85 or SR-316'
        },
        rideShare: {
          pickupZone: 'Main entrance area',
          dropoffZone: 'Same as pickup',
          surgePricing: '1.5-2x after games',
          alternativeTip: 'Schedule pickup in advance'
        }
      },
      history: {
        timeline: [
          { year: 2009, event: 'Coolray Field opens' },
          { year: 1966, event: 'Franchise founded as Richmond Braves' },
          { year: 2009, event: 'Move to Gwinnett County' },
          { year: 2018, event: 'Rebrand as Stripers' }
        ],
        notableGames: [
          { date: '2009-04-10', description: 'First game at Coolray Field' }
        ],
        traditions: [
          { name: 'Chopper mascot', description: 'Team mascot entertainment' },
          { name: 'Friday Fireworks', description: 'Post-game firework shows' }
        ]
      },
      fanExperience: {
        atmosphere: 'Family-friendly suburban ballpark',
        bestExperiences: [
          'Grass berm for families',
          'Friday fireworks',
          'Thirsty Thursday specials',
          'Kids Zone activities'
        ],
        traditions: ['Friday fireworks', 'Chopper mascot', 'Theme nights'],
        music: 'Modern hits and classic ballpark tunes',
        mascot: { name: 'Chopper', description: 'Stripers mascot' }
      },
      proTips: {
        insiderTips: [
          'Grass berm great value for families',
          'Arrive early for close parking',
          'First base side for shade',
          'Thirsty Thursdays popular',
          'Check for theme night giveaways'
        ],
        avoidThese: [
          'Arriving late on firework nights',
          'Left field in afternoon sun',
          'Parking far without checking weather',
          'Missing Kids Zone if with children'
        ],
        hiddenGems: [
          'Cutter\'s Bar & Grill',
          'Standing room behind home plate',
          'Local beer selections',
          'Grass berm sunset views'
        ],
        photoSpots: [
          'Main entrance',
          'With Chopper mascot',
          'Grass berm panorama',
          'Kids Zone'
        ],
        bestValue: [
          'Grass berm seating',
          'Thirsty Thursday specials',
          'Upper reserved seats',
          'Family 4-packs'
        ]
      }
    },
    'iowa-cubs': {
      id: 'iowa-cubs',
      name: 'Principal Park',
      team: 'Iowa Cubs',
      opened: 1992,
      capacity: 11500,
      overview: {
        description: 'Principal Park is home to the Iowa Cubs, the Triple-A affiliate of the Chicago Cubs. Located along the Des Moines River with downtown views.',
        highlights: ['Des Moines River location', 'Downtown proximity', 'Renovated facilities', 'Capitol views'],
        uniqueFeatures: ['Confluence Brewing taproom', 'Party decks', 'Iowa Pork tent', 'River views'],
        renovations: [{ year: 2019, description: 'New video board and improvements' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side', 'Upper deck'],
          afternoon: ['First base side sections 15-22', 'Club level'],
          evening: ['Most infield sections']
        },
        coveredSeating: ['Club level', 'Upper deck overhang'],
        shadeTips: ['First base side for afternoon', 'Upper deck has overhang'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Confluence Brewing', 'Team store']
        },
        worstSunExposure: ['Left field bleachers', 'Right field lawn'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 52, avgHumidity: 60, rainChance: 40, typicalConditions: 'Cool', shadeTip: 'Dress in layers' },
          { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 45, typicalConditions: 'Variable', shadeTip: 'Check forecast' },
          { month: 'June', avgTemp: 73, avgHumidity: 68, rainChance: 40, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'July', avgTemp: 78, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot', shadeTip: 'Evening games ideal' },
          { month: 'August', avgTemp: 76, avgHumidity: 72, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 67, avgHumidity: 65, rainChance: 35, typicalConditions: 'Perfect', shadeTip: 'Enjoy fall weather' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Champions Club', perks: ['All-inclusive', 'Climate controlled'], access: 'Behind home plate' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV', 'Climate control'] },
          specialAreas: [{ name: 'Party Decks', description: 'Group areas', capacity: 100 }]
        },
        budgetOptions: ['Lawn seating', 'Bleachers'],
        familySections: ['Sections 16-18'],
        tips: [
          { section: 'Sections 8-12', tip: 'Best views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Iowa pork chop on a stick', 'Confluence beer'],
        local: ['Iowa Pork', 'Confluence Brewing', 'Caseys pizza'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie burgers', 'Salads'],
        kidsFriendly: ['Hot dogs', 'Pizza', 'Ice cream'],
        alcohol: {
          beer: ['Confluence', 'Exile', 'Toppling Goliath'],
          wine: true,
          cocktails: true,
          localBreweries: ['Confluence', 'Exile']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium Lot', distance: 'Adjacent', price: '$7', shadedSpots: false, covered: false },
          { name: 'Riverfront lots', distance: '5 min walk', price: '$5', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          publicTransit: ['DART bus routes'],
          rideShare: 'Line Drive drop-off'
        }
      },
      gates: [
        { name: 'Home Plate Gate', location: 'Line Drive SW', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Cubs Store', exclusive: ['I-Cubs gear'] }],
        firstAid: ['Section 10'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true, network: 'Principal_Park_WiFi' }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels have ADA seating'],
          entrance: 'All gates accessible',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Try pork chop', description: 'Iowa classic', category: 'food' },
          { title: 'River walk', description: 'Scenic views', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '7:08 PM weekdays',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags allowed',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Downtown Des Moines',
        description: 'Riverfront area',
        beforeGame: ['Court Avenue district'],
        afterGame: ['Downtown bars'],
        radius: '1 mile'
      },
      transportation: {
        address: '1 Line Dr, Des Moines, IA 50309',
        publicTransit: {
          bus: [{ routes: ['DART'], stops: ['Downtown'] }]
        },
        driving: {
          majorRoutes: ['I-235 to downtown'],
          typicalTraffic: 'Light to moderate',
          bestApproach: 'From I-235'
        },
        rideShare: {
          pickupZone: 'Line Drive',
          dropoffZone: 'Same',
          surgePricing: '1.5-2x after games'
        }
      },
      history: {
        timeline: [
          { year: 1992, event: 'Principal Park opens' },
          { year: 1982, event: 'Become Cubs affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Relaxed riverfront ballpark',
        bestExperiences: ['Pork chop on stick', 'River views', 'Friday fireworks'],
        traditions: ['Friday fireworks'],
        music: 'Cubs-themed',
        mascot: { name: 'Cubbie Bear', description: 'Cubs mascot' }
      },
      proTips: {
        insiderTips: ['Pork chop is must-try', 'First base for shade'],
        avoidThese: ['Left field in sun', 'Late arrival on fireworks'],
        hiddenGems: ['Confluence taproom', 'River walk'],
        photoSpots: ['Capitol view', 'River views'],
        bestValue: ['Lawn seating', 'Thirsty Thursday']
      }
    },
    'jacksonville-jumbo-shrimp': {
      id: 'jacksonville-jumbo-shrimp',
      name: 'VyStar Ballpark',
      team: 'Jacksonville Jumbo Shrimp',
      opened: 2003,
      capacity: 11000,
      overview: {
        description: 'VyStar Ballpark is home to the Jacksonville Jumbo Shrimp, Triple-A affiliate of the Miami Marlins. Located on the St. Johns River in downtown Jacksonville.',
        highlights: ['St. Johns River views', 'Downtown location', 'Modern facilities', 'Unique team branding'],
        uniqueFeatures: ['River views', 'Party deck', 'Shrimp entertainment', 'Kids Zone'],
        renovations: [{ year: 2017, description: 'Rebrand to Jumbo Shrimp' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side', 'Club level'],
          afternoon: ['First base side sections 101-108'],
          evening: ['Most infield sections']
        },
        coveredSeating: ['Club level', 'Upper deck overhang'],
        shadeTips: ['First base for afternoon', 'Club level has indoor access'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store', 'Club areas']
        },
        worstSunExposure: ['Left field', 'Right field deck'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 72, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Perfect weather' },
          { month: 'May', avgTemp: 78, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warming', shadeTip: 'Seek shade' },
          { month: 'June', avgTemp: 84, avgHumidity: 75, rainChance: 45, typicalConditions: 'Hot', shadeTip: 'Afternoon storms' },
          { month: 'July', avgTemp: 87, avgHumidity: 78, rainChance: 50, typicalConditions: 'Peak heat', shadeTip: 'Evening games' },
          { month: 'August', avgTemp: 86, avgHumidity: 78, rainChance: 50, typicalConditions: 'Hot', shadeTip: 'Check weather' },
          { month: 'September', avgTemp: 82, avgHumidity: 75, rainChance: 40, typicalConditions: 'Still hot', shadeTip: 'Hurricane season' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'VyStar Club', perks: ['All-inclusive', 'Climate controlled'], access: 'Behind home plate' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV'] },
          specialAreas: [{ name: 'Right Field Deck', description: 'Party area', capacity: 150 }]
        },
        budgetOptions: ['Bleachers', 'Upper reserved'],
        familySections: ['Sections 201-203'],
        tips: [
          { section: 'Sections 105-109', tip: 'River views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Shrimp and grits', 'Seafood', 'Bold City beer'],
        local: ['Bold City Brewery', 'Southern BBQ', 'Seafood'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie burgers', 'Salads'],
        kidsFriendly: ['Hot dogs', 'Pizza', 'Ice cream'],
        alcohol: {
          beer: ['Bold City', 'Intuition', 'Aardwolf'],
          wine: true,
          cocktails: true,
          localBreweries: ['Bold City', 'Intuition']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium Lot', distance: 'Adjacent', price: '$10', shadedSpots: false, covered: false },
          { name: 'Downtown lots', distance: '5-10 min', price: '$5-10', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          publicTransit: ['JTA bus routes'],
          rideShare: 'A. Philip Randolph Blvd'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'A. Philip Randolph', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Jumbo Shrimp Store' }],
        firstAid: ['Behind section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true, network: 'VyStar_WiFi' }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Try shrimp and grits', description: 'Signature', category: 'food' },
          { title: 'River views', description: 'At sunset', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '7:05 PM weekdays',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Sports Complex',
        description: 'Near downtown',
        beforeGame: ['Downtown restaurants'],
        afterGame: ['Downtown bars'],
        radius: '1-2 miles'
      },
      transportation: {
        address: '301 A. Philip Randolph Blvd, Jacksonville, FL 32202',
        publicTransit: {
          bus: [{ routes: ['JTA'], stops: ['Stadium'] }]
        },
        driving: {
          majorRoutes: ['I-95 to downtown'],
          typicalTraffic: 'Light',
          bestApproach: 'From I-95'
        },
        rideShare: {
          pickupZone: 'A. Philip Randolph',
          dropoffZone: 'Same',
          surgePricing: '1.5-2x'
        }
      },
      history: {
        timeline: [
          { year: 2003, event: 'Ballpark opens' },
          { year: 2017, event: 'Rebrand as Jumbo Shrimp' }
        ]
      },
      fanExperience: {
        atmosphere: 'Fun, quirky atmosphere',
        bestExperiences: ['Shrimp entertainment', 'River views'],
        traditions: ['Red Shirt Friday'],
        music: 'Beach themes',
        mascot: { name: 'Scampi', description: 'Shrimp mascot' }
      },
      proTips: {
        insiderTips: ['First base for shade', 'Red shirt Friday discount'],
        avoidThese: ['Left field in sun', 'Forgetting sunscreen'],
        hiddenGems: ['Bold City beer', 'River walk'],
        photoSpots: ['River background', 'With Scampi'],
        bestValue: ['Upper reserved', 'Thrifty Thursday']
      }
    },
    'lehigh-valley-ironpigs': {
      id: 'lehigh-valley-ironpigs',
      name: 'Coca-Cola Park',
      team: 'Lehigh Valley IronPigs',
      opened: 2008,
      capacity: 10100,
      overview: {
        description: 'Coca-Cola Park is home to the Lehigh Valley IronPigs, Triple-A affiliate of the Philadelphia Phillies. Features unique bacon-themed concessions.',
        highlights: ['Modern facility', 'Bacon-themed everything', 'Family-friendly'],
        uniqueFeatures: ['Pig Pen party area', 'Bacon concessions', 'Tiki Terrace', 'Kids bacon slide'],
        renovations: [{ year: 2019, description: 'New video board' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side sections 101-110'],
          evening: ['Most infield sections']
        },
        coveredSeating: ['Club level', 'Suite level'],
        shadeTips: ['First base for afternoon', 'Club level has climate control'],
        sunProtection: {
          shadedConcourses: ['360-degree concourse'],
          indoorAreas: ['PNC Club', 'Team store']
        },
        worstSunExposure: ['Left field', 'Right field lawn'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 53, avgHumidity: 58, rainChance: 40, typicalConditions: 'Cool', shadeTip: 'Bring layers' },
          { month: 'May', avgTemp: 64, avgHumidity: 62, rainChance: 40, typicalConditions: 'Variable', shadeTip: 'Check forecast' },
          { month: 'June', avgTemp: 73, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Seek shade' },
          { month: 'July', avgTemp: 78, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Evening games' },
          { month: 'August', avgTemp: 76, avgHumidity: 70, rainChance: 35, typicalConditions: 'Humid', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 68, avgHumidity: 68, rainChance: 35, typicalConditions: 'Perfect', shadeTip: 'Enjoy fall' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'PNC Club', perks: ['All-inclusive', 'Climate controlled'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV'] },
          specialAreas: [
            { name: 'Pig Pen', description: 'Left field party', capacity: 250 },
            { name: 'Tiki Terrace', description: 'Right field', capacity: 150 }
          ]
        },
        budgetOptions: ['Lawn', 'Bleachers'],
        familySections: ['Sections 116-118'],
        tips: [
          { section: 'Pig Pen', tip: 'Party atmosphere', category: 'experience' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Bacon on a stick', 'Bacon mac and cheese', 'Pig candy'],
        local: ['Yuengling', 'PA Dutch treats', 'Philly cheesesteaks'],
        healthy: ['Salads', 'Grilled chicken'],
        vegetarian: ['Veggie burgers', 'Salads'],
        kidsFriendly: ['Hot dogs', 'Pizza', 'Ice cream'],
        alcohol: {
          beer: ['Yuengling', 'Weyerbacher', 'Victory'],
          wine: true,
          cocktails: true,
          localBreweries: ['Weyerbacher', 'Victory']
        }
      },
      parking: {
        lots: [
          { name: 'Main Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          publicTransit: ['LANTA bus'],
          rideShare: 'Main entrance'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Scherersville Road', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'IronPigs Store', exclusive: ['Bacon merchandise'] }],
        firstAid: ['Behind section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true },
        kidZones: [{ name: 'Pigtown', location: 'Right field', activities: ['Bacon slide'] }]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Try bacon on stick', description: 'Signature', category: 'food' },
          { title: 'Pig Pen', description: 'All-you-can-eat', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '7:05 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'East Allentown',
        description: 'Suburban area',
        beforeGame: ['Chain restaurants'],
        afterGame: ['Downtown Allentown'],
        radius: '2-5 miles'
      },
      transportation: {
        address: '1050 IronPigs Way, Allentown, PA 18109',
        publicTransit: {
          bus: [{ routes: ['LANTA'], stops: ['Limited'] }]
        },
        driving: {
          majorRoutes: ['US-22'],
          typicalTraffic: 'Light',
          bestApproach: 'From US-22'
        },
        rideShare: {
          pickupZone: 'Main entrance',
          dropoffZone: 'Same',
          surgePricing: '1.5x'
        }
      },
      history: {
        timeline: [
          { year: 2008, event: 'Coca-Cola Park opens' },
          { year: 2007, event: 'Become Phillies affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Fun bacon-themed entertainment',
        bestExperiences: ['Bacon on stick', 'Pig Pen', 'Kids bacon slide'],
        traditions: ['Bacon everything', 'Friday fireworks'],
        music: 'Modern hits',
        mascot: { name: 'FeRROUS and FeFe', description: 'Pig mascots' }
      },
      proTips: {
        insiderTips: ['Bacon on stick must-try', 'Pig Pen opens early'],
        avoidThese: ['Left field in sun', 'Late on giveaways'],
        hiddenGems: ['Pig candy', 'Tiki Terrace'],
        photoSpots: ['With pig mascots', 'Bacon slide'],
        bestValue: ['Lawn seating', 'Tuesday specials']
      }
    },
    'louisville-bats': {
      id: 'louisville-bats',
      name: 'Louisville Slugger Field',
      team: 'Louisville Bats',
      opened: 2000,
      capacity: 13131,
      overview: {
        description: 'Louisville Slugger Field is home to the Louisville Bats, Triple-A affiliate of the Cincinnati Reds. Located along the Ohio River in downtown Louisville.',
        highlights: ['Ohio River views', 'Downtown location', 'Louisville Slugger connection'],
        uniqueFeatures: ['River views', 'Party decks', 'Slugger Museum nearby'],
        renovations: [{ year: 2020, description: 'Facility upgrades' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side sections'],
          evening: ['Most infield sections']
        },
        coveredSeating: ['Club level', 'Suite level'],
        shadeTips: ['First base for afternoon', 'Club level covered'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store', 'Club areas']
        },
        worstSunExposure: ['Left field', 'Bleachers'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 58, avgHumidity: 60, rainChance: 45, typicalConditions: 'Variable', shadeTip: 'Bring layers' },
          { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 45, typicalConditions: 'Pleasant', shadeTip: 'Perfect weather' },
          { month: 'June', avgTemp: 76, avgHumidity: 68, rainChance: 40, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'July', avgTemp: 80, avgHumidity: 70, rainChance: 40, typicalConditions: 'Hot', shadeTip: 'Evening games' },
          { month: 'August', avgTemp: 79, avgHumidity: 72, rainChance: 35, typicalConditions: 'Humid', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 72, avgHumidity: 68, rainChance: 35, typicalConditions: 'Comfortable', shadeTip: 'Great weather' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Champions Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV'] },
          specialAreas: [{ name: 'Party Decks', description: 'Group areas', capacity: 100 }]
        },
        budgetOptions: ['Bleachers', 'Upper reserved'],
        familySections: ['Sections 110-112'],
        tips: [
          { section: 'Sections 105-109', tip: 'River views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Hot Brown', 'Bourbon selections', 'Local BBQ'],
        local: ['Kentucky bourbon', 'Louisville specialties', 'BBQ'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options', 'Salads'],
        kidsFriendly: ['Hot dogs', 'Pizza', 'Ice cream'],
        alcohol: {
          beer: ['Falls City', 'West Sixth', 'Against the Grain'],
          wine: true,
          cocktails: true,
          localBreweries: ['Falls City', 'West Sixth']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium Lot', distance: 'Adjacent', price: '$10', shadedSpots: false, covered: false },
          { name: 'Downtown lots', distance: '5-10 min', price: '$5-15', shadedSpots: true, covered: true }
        ],
        alternativeTransport: {
          publicTransit: ['TARC bus routes'],
          rideShare: 'Main Street drop-off'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Main Street', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Bats Store' }],
        firstAid: ['Section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Try Hot Brown', description: 'Louisville classic', category: 'food' },
          { title: 'River views', description: 'Great at sunset', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '7:00 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Downtown Louisville',
        description: 'Riverfront district',
        beforeGame: ['4th Street Live', 'Main Street restaurants'],
        afterGame: ['Bardstown Road bars'],
        radius: '1 mile'
      },
      transportation: {
        address: '401 E Main St, Louisville, KY 40202',
        publicTransit: {
          bus: [{ routes: ['TARC'], stops: ['Downtown'] }]
        },
        driving: {
          majorRoutes: ['I-65 to downtown', 'I-71 to downtown'],
          typicalTraffic: 'Moderate',
          bestApproach: 'From I-65'
        },
        rideShare: {
          pickupZone: 'Main Street',
          dropoffZone: 'Same',
          surgePricing: '2x after games'
        }
      },
      history: {
        timeline: [
          { year: 2000, event: 'Louisville Slugger Field opens' },
          { year: 2000, event: 'Become Reds affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Classic ballpark on river',
        bestExperiences: ['River views', 'Bourbon selections', 'Friday fireworks'],
        traditions: ['Friday fireworks', 'Thirsty Thursday'],
        music: 'Classic ballpark',
        mascot: { name: 'Buddy Bat', description: 'Bat mascot' }
      },
      proTips: {
        insiderTips: ['First base for shade', 'Slugger Museum before game'],
        avoidThese: ['Left field in sun', 'Downtown traffic'],
        hiddenGems: ['Bourbon bar', 'River walk'],
        photoSpots: ['River background', 'With giant bat'],
        bestValue: ['Bleachers', 'Thirsty Thursday']
      }
    },
    'memphis-redbirds': {
      id: 'memphis-redbirds',
      name: 'AutoZone Park',
      team: 'Memphis Redbirds',
      opened: 2000,
      capacity: 10000,
      overview: {
        description: 'AutoZone Park is home to the Memphis Redbirds, Triple-A affiliate of the St. Louis Cardinals. Located in downtown Memphis with Beale Street nearby.',
        highlights: ['Downtown Memphis', 'Beale Street proximity', 'Award-winning design'],
        uniqueFeatures: ['Bluff seating', 'BBQ nachos', 'Downtown skyline'],
        renovations: [{ year: 2018, description: 'Facility improvements' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side', 'Club level'],
          evening: ['Most infield sections']
        },
        coveredSeating: ['Club level', 'Bluff area'],
        shadeTips: ['First base for afternoon', 'Bluff has umbrellas'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store', 'Club']
        },
        worstSunExposure: ['Left field', 'Right field lawn'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 64, avgHumidity: 60, rainChance: 45, typicalConditions: 'Variable', shadeTip: 'Check forecast' },
          { month: 'May', avgTemp: 73, avgHumidity: 65, rainChance: 45, typicalConditions: 'Pleasant', shadeTip: 'Perfect weather' },
          { month: 'June', avgTemp: 81, avgHumidity: 68, rainChance: 35, typicalConditions: 'Getting hot', shadeTip: 'Seek shade' },
          { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot', shadeTip: 'Evening games' },
          { month: 'August', avgTemp: 84, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 77, avgHumidity: 65, rainChance: 30, typicalConditions: 'Comfortable', shadeTip: 'Great weather' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Coors Light Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV'] },
          specialAreas: [{ name: 'The Bluff', description: 'Left field seating', capacity: 200 }]
        },
        budgetOptions: ['Lawn', 'Upper reserved'],
        familySections: ['Sections 106-108'],
        tips: [
          { section: 'The Bluff', tip: 'Unique experience', category: 'experience' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['BBQ nachos', 'Memphis BBQ', 'Pulled pork'],
        local: ['Central BBQ', 'Local Memphis food', 'Sweet tea'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Ghost River', 'Wiseacre', 'Memphis Made'],
          wine: true,
          cocktails: true,
          localBreweries: ['Ghost River', 'Wiseacre']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium lots', distance: 'Adjacent', price: '$10', shadedSpots: false, covered: false },
          { name: 'Downtown garages', distance: '5-10 min', price: '$5-15', shadedSpots: true, covered: true }
        ],
        alternativeTransport: {
          publicTransit: ['MATA trolley'],
          rideShare: 'Union Avenue'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Union Avenue', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Redbirds Store' }],
        firstAid: ['Section 105'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'BBQ nachos', description: 'Must-try', category: 'food' },
          { title: 'Beale Street', description: 'Before/after game', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '7:05 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Downtown Memphis',
        description: 'Near Beale Street',
        beforeGame: ['Beale Street', 'Downtown restaurants'],
        afterGame: ['Beale Street bars'],
        radius: '0.5 mile'
      },
      transportation: {
        address: '175 Toyota Plaza, Memphis, TN 38103',
        publicTransit: {
          bus: [{ routes: ['MATA'], stops: ['Downtown'] }]
        },
        driving: {
          majorRoutes: ['I-40 to downtown', 'I-55 to downtown'],
          typicalTraffic: 'Moderate',
          bestApproach: 'From I-40'
        },
        rideShare: {
          pickupZone: 'Union Avenue',
          dropoffZone: 'Same',
          surgePricing: '2x after games'
        }
      },
      history: {
        timeline: [
          { year: 2000, event: 'AutoZone Park opens' },
          { year: 1998, event: 'Become Cardinals affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Downtown ballpark near Beale Street',
        bestExperiences: ['BBQ nachos', 'The Bluff', 'Beale Street'],
        traditions: ['Friday fireworks'],
        music: 'Blues and Memphis music',
        mascot: { name: 'Rockey', description: 'Redbird mascot' }
      },
      proTips: {
        insiderTips: ['BBQ nachos are legendary', 'Beale Street after game'],
        avoidThese: ['Left field in sun', 'Parking on Beale'],
        hiddenGems: ['The Bluff seating', 'Local beer selection'],
        photoSpots: ['Downtown skyline', 'The Bluff'],
        bestValue: ['Lawn seating', 'Thirsty Thursday']
      }
    },
    'nashville-sounds': {
      id: 'nashville-sounds',
      name: 'First Horizon Park',
      team: 'Nashville Sounds',
      opened: 2015,
      capacity: 10000,
      overview: {
        description: 'First Horizon Park is home to the Nashville Sounds, Triple-A affiliate of the Milwaukee Brewers. Modern ballpark with Nashville skyline views.',
        highlights: ['Nashville skyline', 'Modern facility', 'Music City location'],
        uniqueFeatures: ['Guitar scoreboard', 'The Band Box', 'Skyline views'],
        renovations: []
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side', 'Club level'],
          evening: ['Most sections']
        },
        coveredSeating: ['Club level', 'Suite level'],
        shadeTips: ['First base for afternoon', 'Club has AC'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Club', 'Team store']
        },
        worstSunExposure: ['Right field', 'Left field lawn'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 61, avgHumidity: 58, rainChance: 45, typicalConditions: 'Variable', shadeTip: 'Bring layers' },
          { month: 'May', avgTemp: 70, avgHumidity: 65, rainChance: 45, typicalConditions: 'Pleasant', shadeTip: 'Perfect weather' },
          { month: 'June', avgTemp: 78, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot', shadeTip: 'Evening games' },
          { month: 'August', avgTemp: 81, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 74, avgHumidity: 65, rainChance: 30, typicalConditions: 'Comfortable', shadeTip: 'Great weather' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'First Base Club', perks: ['All-inclusive'], access: 'First base line' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV'] },
          specialAreas: [{ name: 'The Band Box', description: 'Right field party area', capacity: 200 }]
        },
        budgetOptions: ['Outfield', 'Upper corners'],
        familySections: ['Sections 115-117'],
        tips: [
          { section: 'Behind home', tip: 'Skyline views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Hot chicken', 'Nashville BBQ', 'Local craft beer'],
        local: ['Prince\'s hot chicken', 'Goo Goo Clusters', 'Nashville food'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Yazoo', 'Tennessee Brew Works', 'Blackstone'],
          wine: true,
          cocktails: true,
          localBreweries: ['Yazoo', 'Tennessee Brew Works']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium lots', distance: 'Adjacent', price: '$10', shadedSpots: false, covered: false },
          { name: 'Downtown lots', distance: '5-10 min', price: '$10-20', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          publicTransit: ['WeGo bus'],
          rideShare: 'Junior Gilliam Way'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Junior Gilliam Way', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Sounds Store' }],
        firstAid: ['Section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Hot chicken', description: 'Nashville specialty', category: 'food' },
          { title: 'Guitar scoreboard', description: 'Unique feature', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '6:35 PM or 7:05 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Germantown',
        description: 'Hip neighborhood',
        beforeGame: ['Germantown restaurants', 'Bicentennial Park'],
        afterGame: ['Downtown Nashville', 'Broadway bars'],
        radius: '1-2 miles'
      },
      transportation: {
        address: '19 Junior Gilliam Way, Nashville, TN 37219',
        publicTransit: {
          bus: [{ routes: ['WeGo'], stops: ['Downtown'] }]
        },
        driving: {
          majorRoutes: ['I-40 to downtown', 'I-65 to downtown'],
          typicalTraffic: 'Heavy downtown',
          bestApproach: 'From I-65'
        },
        rideShare: {
          pickupZone: 'Junior Gilliam Way',
          dropoffZone: 'Same',
          surgePricing: '2-3x after games'
        }
      },
      history: {
        timeline: [
          { year: 2015, event: 'First Horizon Park opens' },
          { year: 2021, event: 'Become Brewers affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Modern ballpark in Music City',
        bestExperiences: ['Guitar scoreboard', 'Hot chicken', 'Skyline views'],
        traditions: ['Post-game fireworks'],
        music: 'Country and Nashville sound',
        mascot: { name: 'Booster', description: 'Sounds mascot' }
      },
      proTips: {
        insiderTips: ['Hot chicken is spicy', 'Broadway after game'],
        avoidThese: ['Right field in sun', 'Downtown traffic'],
        hiddenGems: ['The Band Box', 'Local beer selection'],
        photoSpots: ['Guitar scoreboard', 'Skyline view'],
        bestValue: ['Outfield seats', 'Tuesday deals']
      }
    },
    'norfolk-tides': {
      id: 'norfolk-tides',
      name: 'Harbor Park',
      team: 'Norfolk Tides',
      opened: 1993,
      capacity: 12067,
      overview: {
        description: 'Harbor Park is home to the Norfolk Tides, Triple-A affiliate of the Baltimore Orioles. Located on the Elizabeth River with beautiful water views.',
        highlights: ['Elizabeth River views', 'Downtown Norfolk', 'Maritime setting'],
        uniqueFeatures: ['Harbor views', 'Navy ship backdrop', 'Picnic plaza'],
        renovations: [{ year: 2020, description: 'Facility upgrades' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side', 'Upper deck'],
          evening: ['Most sections']
        },
        coveredSeating: ['Upper deck overhang', 'Club level'],
        shadeTips: ['First base for afternoon', 'Upper deck has overhang'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store', 'Club']
        },
        worstSunExposure: ['Right field', 'Lower left field'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 60, avgHumidity: 65, rainChance: 35, typicalConditions: 'Mild', shadeTip: 'Pleasant weather' },
          { month: 'May', avgTemp: 69, avgHumidity: 68, rainChance: 35, typicalConditions: 'Nice', shadeTip: 'Perfect conditions' },
          { month: 'June', avgTemp: 77, avgHumidity: 72, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'July', avgTemp: 81, avgHumidity: 75, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Evening games' },
          { month: 'August', avgTemp: 80, avgHumidity: 75, rainChance: 40, typicalConditions: 'Humid', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 73, avgHumidity: 72, rainChance: 35, typicalConditions: 'Comfortable', shadeTip: 'Great weather' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Norfolk Southern Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV'] },
          specialAreas: [{ name: 'Picnic Plaza', description: 'Left field picnic area', capacity: 300 }]
        },
        budgetOptions: ['Upper reserved', 'Outfield'],
        familySections: ['Sections 214-216'],
        tips: [
          { section: 'Behind home', tip: 'Harbor views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Crab cakes', 'Seafood', 'Local craft beer'],
        local: ['Chesapeake seafood', 'Virginia peanuts', 'Local specialties'],
        healthy: ['Salads', 'Grilled fish'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Green Flash', 'O\'Connor', 'Smartmouth'],
          wine: true,
          cocktails: true,
          localBreweries: ['O\'Connor', 'Smartmouth']
        }
      },
      parking: {
        lots: [
          { name: 'Park Place Garage', distance: 'Adjacent', price: '$8', shadedSpots: true, covered: true },
          { name: 'Surface lots', distance: '5 min', price: '$5', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          publicTransit: ['HRT bus', 'Tide light rail'],
          rideShare: 'Park Avenue'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Park Avenue', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Tides Store' }],
        firstAid: ['Section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Crab cakes', description: 'Local specialty', category: 'food' },
          { title: 'Harbor views', description: 'Beautiful setting', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '6:35 PM or 7:05 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Downtown Norfolk',
        description: 'Waterfront district',
        beforeGame: ['Waterside District', 'Downtown restaurants'],
        afterGame: ['Granby Street bars'],
        radius: '0.5 mile'
      },
      transportation: {
        address: '150 Park Ave, Norfolk, VA 23510',
        publicTransit: {
          subway: [{ lines: ['Tide light rail'], station: 'Harbor Park', walkTime: '2 minutes' }],
          bus: [{ routes: ['HRT'], stops: ['Downtown'] }]
        },
        driving: {
          majorRoutes: ['I-264 to downtown', 'US-460 to downtown'],
          typicalTraffic: 'Moderate',
          bestApproach: 'From I-264'
        },
        rideShare: {
          pickupZone: 'Park Avenue',
          dropoffZone: 'Same',
          surgePricing: '2x after games'
        }
      },
      history: {
        timeline: [
          { year: 1993, event: 'Harbor Park opens' },
          { year: 2007, event: 'Become Orioles affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Waterfront ballpark with Navy presence',
        bestExperiences: ['Harbor views', 'Crab cakes', 'Navy ship backdrop'],
        traditions: ['Friday fireworks', 'Military appreciation'],
        music: 'Classic ballpark',
        mascot: { name: 'Rip Tide', description: 'Seahorse mascot' }
      },
      proTips: {
        insiderTips: ['Crab cakes are excellent', 'Waterside District before game'],
        avoidThese: ['Right field in sun', 'Tunnel traffic'],
        hiddenGems: ['Harbor walk', 'Local seafood options'],
        photoSpots: ['Harbor backdrop', 'Navy ships'],
        bestValue: ['Upper reserved', 'Tuesday specials']
      }
    },
    'omaha-storm-chasers': {
      id: 'omaha-storm-chasers',
      name: 'Werner Park',
      team: 'Omaha Storm Chasers',
      opened: 2011,
      capacity: 9023,
      overview: {
        description: 'Werner Park is home to the Omaha Storm Chasers, Triple-A affiliate of the Kansas City Royals. Modern suburban ballpark with excellent facilities.',
        highlights: ['Modern facility', 'Family-friendly', 'Great sightlines'],
        uniqueFeatures: ['Kids zone', 'Party porch', 'Grass berm'],
        renovations: []
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side', 'Club level'],
          evening: ['Most sections']
        },
        coveredSeating: ['Club level', 'Suite level'],
        shadeTips: ['First base for afternoon', 'Club has AC'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Club', 'Team store']
        },
        worstSunExposure: ['Left field berm', 'Right field'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 53, avgHumidity: 60, rainChance: 40, typicalConditions: 'Variable', shadeTip: 'Dress in layers' },
          { month: 'May', avgTemp: 64, avgHumidity: 65, rainChance: 45, typicalConditions: 'Unpredictable', shadeTip: 'Check forecast' },
          { month: 'June', avgTemp: 74, avgHumidity: 68, rainChance: 40, typicalConditions: 'Pleasant', shadeTip: 'Seek shade' },
          { month: 'July', avgTemp: 79, avgHumidity: 70, rainChance: 35, typicalConditions: 'Hot', shadeTip: 'Evening games' },
          { month: 'August', avgTemp: 77, avgHumidity: 72, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 68, avgHumidity: 65, rainChance: 35, typicalConditions: 'Perfect', shadeTip: 'Enjoy fall' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Werner Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV'] },
          specialAreas: [{ name: 'Party Porch', description: 'Right field party area', capacity: 150 }]
        },
        budgetOptions: ['Grass berm', 'Upper corners'],
        familySections: ['Sections 113-115'],
        tips: [
          { section: 'Behind home', tip: 'Best views', category: 'view' },
          { section: 'Grass berm', tip: 'Family value', category: 'family' }
        ]
      },
      concessions: {
        signature: ['Runza sandwich', 'Local craft beer', 'Corn products'],
        local: ['Nebraska beef', 'Runza', 'Local specialties'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Nebraska Brewing', 'Zipline', 'Brickway'],
          wine: true,
          cocktails: true,
          localBreweries: ['Nebraska Brewing', 'Zipline']
        }
      },
      parking: {
        lots: [
          { name: 'Main Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          rideShare: 'Main entrance'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Line Drive', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Storm Chasers Store' }],
        firstAid: ['Section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true },
        kidZones: [{ name: 'Fun Zone', location: 'Left field', activities: ['Playground', 'Games'] }]
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Runza sandwich', description: 'Nebraska classic', category: 'food' },
          { title: 'Grass berm', description: 'Great for families', category: 'family' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '7:05 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Papillion',
        description: 'Suburban location',
        beforeGame: ['Nearby restaurants'],
        afterGame: ['Return to Omaha'],
        radius: '2-5 miles'
      },
      transportation: {
        address: '12356 Ballpark Way, Papillion, NE 68046',
        publicTransit: {
          bus: [{ routes: ['Limited Metro Transit'], stops: ['Papillion'] }]
        },
        driving: {
          majorRoutes: ['US-370', 'I-80 to US-370'],
          typicalTraffic: 'Light',
          bestApproach: 'From US-370'
        },
        rideShare: {
          pickupZone: 'Main entrance',
          dropoffZone: 'Same',
          surgePricing: '1.5x'
        }
      },
      history: {
        timeline: [
          { year: 2011, event: 'Werner Park opens' },
          { year: 1969, event: 'Franchise founded' },
          { year: 2011, event: 'Rebrand as Storm Chasers' }
        ]
      },
      fanExperience: {
        atmosphere: 'Modern family-friendly ballpark',
        bestExperiences: ['Kids zone', 'Grass berm', 'Runza'],
        traditions: ['Friday fireworks', 'Storm warnings'],
        music: 'Modern hits',
        mascot: { name: 'Casey and Vortex', description: 'Storm mascots' }
      },
      proTips: {
        insiderTips: ['Grass berm great for families', 'Runza is must-try'],
        avoidThese: ['Left field in sun', 'Late arrival parking'],
        hiddenGems: ['Party porch', 'Local beer selection'],
        photoSpots: ['Main entrance', 'With mascots'],
        bestValue: ['Grass berm', 'Tuesday deals']
      }
    },
    'rochester-red-wings': {
      id: 'rochester-red-wings',
      name: 'Innovative Field',
      team: 'Rochester Red Wings',
      opened: 1997,
      capacity: 10840,
      overview: {
        description: 'Innovative Field is home to the Rochester Red Wings, Triple-A affiliate of the Washington Nationals. Downtown ballpark with city skyline views.',
        highlights: ['Downtown Rochester', 'City skyline', 'High Falls nearby'],
        uniqueFeatures: ['Skyline views', 'Party deck', 'Kids area'],
        renovations: [{ year: 2021, description: 'Name change and upgrades' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side', 'Upper deck'],
          evening: ['Most sections']
        },
        coveredSeating: ['Club level', 'Upper deck overhang'],
        shadeTips: ['First base for afternoon', 'Upper deck has overhang'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store', 'Club']
        },
        worstSunExposure: ['Left field', 'Right field corners'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 48, avgHumidity: 60, rainChance: 40, typicalConditions: 'Cool', shadeTip: 'Bundle up' },
          { month: 'May', avgTemp: 60, avgHumidity: 62, rainChance: 40, typicalConditions: 'Variable', shadeTip: 'Layers needed' },
          { month: 'June', avgTemp: 69, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Perfect weather' },
          { month: 'July', avgTemp: 74, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'August', avgTemp: 72, avgHumidity: 70, rainChance: 35, typicalConditions: 'Comfortable', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 64, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cool evenings', shadeTip: 'Bring jacket' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Home Plate Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV'] },
          specialAreas: [{ name: 'Party Deck', description: 'Left field party area', capacity: 100 }]
        },
        budgetOptions: ['Upper reserved', 'Outfield'],
        familySections: ['Sections 211-213'],
        tips: [
          { section: 'Behind home', tip: 'Skyline views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Garbage plate', 'Zweigle\'s hot dogs', 'Local beer'],
        local: ['Rochester specialties', 'Genesee beer', 'Local foods'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Genesee', 'Rohrbach', 'Three Heads'],
          wine: true,
          cocktails: true,
          localBreweries: ['Genesee', 'Rohrbach']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium lots', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
          { name: 'Downtown garages', distance: '5-10 min', price: '$5-10', shadedSpots: true, covered: true }
        ],
        alternativeTransport: {
          publicTransit: ['RTS bus'],
          rideShare: 'Morrie Silver Way'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Morrie Silver Way', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Red Wings Store' }],
        firstAid: ['Section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Garbage plate', description: 'Rochester classic', category: 'food' },
          { title: 'High Falls', description: 'Visit before game', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '6:05 PM or 7:05 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Downtown Rochester',
        description: 'Near High Falls',
        beforeGame: ['High Falls district', 'Downtown restaurants'],
        afterGame: ['East End bars'],
        radius: '0.5 mile'
      },
      transportation: {
        address: '1 Morrie Silver Way, Rochester, NY 14608',
        publicTransit: {
          bus: [{ routes: ['RTS'], stops: ['Downtown'] }]
        },
        driving: {
          majorRoutes: ['I-490 to downtown', 'I-390 to downtown'],
          typicalTraffic: 'Light to moderate',
          bestApproach: 'From I-490'
        },
        rideShare: {
          pickupZone: 'Morrie Silver Way',
          dropoffZone: 'Same',
          surgePricing: '1.5-2x'
        }
      },
      history: {
        timeline: [
          { year: 1997, event: 'Frontier Field opens' },
          { year: 2021, event: 'Renamed Innovative Field' },
          { year: 2021, event: 'Become Nationals affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Classic downtown ballpark',
        bestExperiences: ['Garbage plate', 'Skyline views', 'High Falls'],
        traditions: ['Friday fireworks', 'Plate Night'],
        music: 'Classic ballpark',
        mascot: { name: 'Spikes and Mittsy', description: 'Red Wings mascots' }
      },
      proTips: {
        insiderTips: ['Garbage plate is huge', 'High Falls before game'],
        avoidThese: ['Left field in sun', 'Limited parking'],
        hiddenGems: ['Local beer selection', 'Party deck'],
        photoSpots: ['Skyline view', 'High Falls nearby'],
        bestValue: ['Upper reserved', 'Thursday specials']
      }
    },
    'scranton-railriders': {
      id: 'scranton-railriders',
      name: 'PNC Field',
      team: 'Scranton/Wilkes-Barre RailRiders',
      opened: 1989,
      capacity: 10000,
      overview: {
        description: 'PNC Field is home to the Scranton/Wilkes-Barre RailRiders, Triple-A affiliate of the New York Yankees. Mountain views in northeastern Pennsylvania.',
        highlights: ['Mountain views', 'Yankees affiliate', 'Family atmosphere'],
        uniqueFeatures: ['Mountain backdrop', 'Kids zone', 'Party pavilion'],
        renovations: [{ year: 2013, description: 'Major renovations' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side'],
          evening: ['Most sections']
        },
        coveredSeating: ['Club level', 'Pavilion'],
        shadeTips: ['First base for afternoon', 'Pavilion has cover'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store']
        },
        worstSunExposure: ['Left field', 'Bleachers'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 50, avgHumidity: 58, rainChance: 40, typicalConditions: 'Cool', shadeTip: 'Bring layers' },
          { month: 'May', avgTemp: 61, avgHumidity: 62, rainChance: 40, typicalConditions: 'Variable', shadeTip: 'Check forecast' },
          { month: 'June', avgTemp: 70, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Perfect weather' },
          { month: 'July', avgTemp: 75, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'August', avgTemp: 73, avgHumidity: 70, rainChance: 35, typicalConditions: 'Comfortable', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 65, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cool evenings', shadeTip: 'Bring jacket' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Dugout Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering'] },
          specialAreas: [{ name: 'Party Pavilion', description: 'Left field', capacity: 200 }]
        },
        budgetOptions: ['Bleachers', 'Upper reserved'],
        familySections: ['Sections 10-12'],
        tips: [
          { section: 'Behind home', tip: 'Mountain views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Pierogies', 'Local beer', 'Yankees fare'],
        local: ['Pennsylvania specialties', 'Yuengling'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Yuengling', 'Local craft'],
          wine: true,
          cocktails: true,
          localBreweries: ['Susquehanna']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium lots', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          rideShare: 'Main entrance'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Montage Mountain Road', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'RailRiders Store' }],
        firstAid: ['Section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Pierogies', description: 'Local favorite', category: 'food' },
          { title: 'Mountain views', description: 'Beautiful backdrop', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '6:35 PM or 7:05 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Moosic',
        description: 'Near Montage Mountain',
        beforeGame: ['Local restaurants'],
        afterGame: ['Return to Scranton'],
        radius: '2-5 miles'
      },
      transportation: {
        address: '235 Montage Mountain Rd, Moosic, PA 18507',
        publicTransit: {
          bus: [{ routes: ['COLTS'], stops: ['Limited service'] }]
        },
        driving: {
          majorRoutes: ['I-81', 'I-380'],
          typicalTraffic: 'Light',
          bestApproach: 'From I-81'
        },
        rideShare: {
          pickupZone: 'Main entrance',
          dropoffZone: 'Same',
          surgePricing: '1.5x'
        }
      },
      history: {
        timeline: [
          { year: 1989, event: 'Stadium opens' },
          { year: 2013, event: 'Become RailRiders' },
          { year: 2007, event: 'Become Yankees affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Family-friendly with mountain views',
        bestExperiences: ['Mountain backdrop', 'Yankees connection', 'Pierogies'],
        traditions: ['Friday fireworks'],
        music: 'Yankees-themed',
        mascot: { name: 'Champ', description: 'Porcupine mascot' }
      },
      proTips: {
        insiderTips: ['Mountain views at sunset', 'Yankees rehab appearances'],
        avoidThese: ['Left field in sun', 'Limited food late'],
        hiddenGems: ['Pierogy race', 'Local beer'],
        photoSpots: ['Mountain backdrop', 'With Champ'],
        bestValue: ['Bleachers', 'Tuesday deals']
      }
    },
    'st-paul-saints': {
      id: 'st-paul-saints',
      name: 'CHS Field',
      team: 'St. Paul Saints',
      opened: 2015,
      capacity: 7210,
      overview: {
        description: 'CHS Field is home to the St. Paul Saints, Triple-A affiliate of the Minnesota Twins. Modern ballpark in Lowertown St. Paul.',
        highlights: ['Downtown St. Paul', 'Modern facility', 'Mississippi River nearby'],
        uniqueFeatures: ['Downtown skyline', 'Dog park', 'Green design'],
        renovations: []
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side'],
          evening: ['Most sections']
        },
        coveredSeating: ['Club level'],
        shadeTips: ['First base for afternoon', 'Club has cover'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store', 'Club']
        },
        worstSunExposure: ['Right field', 'Lawn'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 48, avgHumidity: 58, rainChance: 35, typicalConditions: 'Cool', shadeTip: 'Bundle up' },
          { month: 'May', avgTemp: 60, avgHumidity: 60, rainChance: 40, typicalConditions: 'Variable', shadeTip: 'Layers needed' },
          { month: 'June', avgTemp: 70, avgHumidity: 65, rainChance: 40, typicalConditions: 'Pleasant', shadeTip: 'Perfect weather' },
          { month: 'July', avgTemp: 75, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'August', avgTemp: 73, avgHumidity: 70, rainChance: 35, typicalConditions: 'Comfortable', shadeTip: 'Stay hydrated' },
          { month: 'September', avgTemp: 63, avgHumidity: 65, rainChance: 30, typicalConditions: 'Cool', shadeTip: 'Fall weather' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Treasure Island Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering'] },
          specialAreas: [{ name: 'Lawn', description: 'Outfield grass', capacity: 500 }]
        },
        budgetOptions: ['Lawn', 'Bleachers'],
        familySections: ['Sections 101-103'],
        tips: [
          { section: 'Behind home', tip: 'Skyline views', category: 'view' },
          { section: 'Lawn', tip: 'Great for families', category: 'family' }
        ]
      },
      concessions: {
        signature: ['Kramarczuk sausages', 'Local craft beer', 'Mini donuts'],
        local: ['Minnesota specialties', 'Local foods'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Summit', 'Surly', 'Indeed'],
          wine: true,
          cocktails: true,
          localBreweries: ['Summit', 'Surly']
        }
      },
      parking: {
        lots: [
          { name: 'Broadway lots', distance: '5 min', price: '$10', shadedSpots: false, covered: false },
          { name: 'Downtown ramps', distance: '10 min', price: '$5-15', shadedSpots: true, covered: true }
        ],
        alternativeTransport: {
          publicTransit: ['Green Line light rail'],
          rideShare: 'Broadway entrance'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Broadway', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Saints Store' }],
        firstAid: ['Section 105'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Kramarczuk sausages', description: 'Local favorite', category: 'food' },
          { title: 'Dog park', description: 'Bring your dog', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '7:07 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Lowertown',
        description: 'Arts district',
        beforeGame: ['Lowertown restaurants', 'Farmers Market'],
        afterGame: ['Downtown St. Paul bars'],
        radius: '0.5 mile'
      },
      transportation: {
        address: '360 Broadway St, St. Paul, MN 55101',
        publicTransit: {
          subway: [{ lines: ['Green Line'], station: 'Union Depot', walkTime: '5 minutes' }]
        },
        driving: {
          majorRoutes: ['I-94 to downtown', 'I-35E to downtown'],
          typicalTraffic: 'Moderate',
          bestApproach: 'From I-94'
        },
        rideShare: {
          pickupZone: 'Broadway',
          dropoffZone: 'Same',
          surgePricing: '2x after games'
        }
      },
      history: {
        timeline: [
          { year: 2015, event: 'CHS Field opens' },
          { year: 2021, event: 'Join Triple-A' },
          { year: 2021, event: 'Become Twins affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Modern downtown ballpark',
        bestExperiences: ['Downtown setting', 'Dog park', 'Local food'],
        traditions: ['Pig mascot', 'Fun promotions'],
        music: 'Eclectic mix',
        mascot: { name: 'Mudonna', description: 'Pig mascot' }
      },
      proTips: {
        insiderTips: ['Dog park unique feature', 'Green Line convenient'],
        avoidThese: ['Right field in sun', 'Limited parking'],
        hiddenGems: ['Lawn seating', 'Local beer selection'],
        photoSpots: ['Skyline view', 'With Mudonna'],
        bestValue: ['Lawn seats', 'Thursday deals']
      }
    },
    'syracuse-mets': {
      id: 'syracuse-mets',
      name: 'NBT Bank Stadium',
      team: 'Syracuse Mets',
      opened: 1997,
      capacity: 10815,
      overview: {
        description: 'NBT Bank Stadium is home to the Syracuse Mets, Triple-A affiliate of the New York Mets. Classic ballpark in central New York.',
        highlights: ['Downtown Syracuse', 'Mets affiliate', 'Family atmosphere'],
        uniqueFeatures: ['Skyline views', 'Kids zone', 'Party deck'],
        renovations: [{ year: 2019, description: 'Rebrand as Mets' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side'],
          evening: ['Most sections']
        },
        coveredSeating: ['Club level', 'Upper deck overhang'],
        shadeTips: ['First base for afternoon', 'Upper deck has cover'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store']
        },
        worstSunExposure: ['Left field', 'Right field'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 48, avgHumidity: 60, rainChance: 40, typicalConditions: 'Cool', shadeTip: 'Dress warm' },
          { month: 'May', avgTemp: 60, avgHumidity: 62, rainChance: 40, typicalConditions: 'Variable', shadeTip: 'Layers' },
          { month: 'June', avgTemp: 69, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Perfect' },
          { month: 'July', avgTemp: 74, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'August', avgTemp: 72, avgHumidity: 70, rainChance: 35, typicalConditions: 'Comfortable', shadeTip: 'Hydrate' },
          { month: 'September', avgTemp: 64, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cool', shadeTip: 'Jacket needed' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Hank Sauer Room', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering'] },
          specialAreas: [{ name: 'Party Deck', description: 'Right field', capacity: 150 }]
        },
        budgetOptions: ['Bleachers', 'Upper reserved'],
        familySections: ['Sections 208-210'],
        tips: [
          { section: 'Behind home', tip: 'Best views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Salt potatoes', 'Hofmann hot dogs', 'Local beer'],
        local: ['Syracuse specialties', 'Central NY foods'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Empire', 'Middle Ages', 'Local craft'],
          wine: true,
          cocktails: true,
          localBreweries: ['Empire', 'Middle Ages']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium lots', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          publicTransit: ['Centro bus'],
          rideShare: 'NBT Bank Parkway'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'NBT Bank Parkway', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Mets Store' }],
        firstAid: ['Section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Salt potatoes', description: 'Syracuse classic', category: 'food' },
          { title: 'Mets connection', description: 'Rehab appearances', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '6:35 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'North Side',
        description: 'Near downtown',
        beforeGame: ['Armory Square restaurants'],
        afterGame: ['Downtown Syracuse bars'],
        radius: '1 mile'
      },
      transportation: {
        address: '1 Tex Simone Dr, Syracuse, NY 13208',
        publicTransit: {
          bus: [{ routes: ['Centro'], stops: ['Stadium'] }]
        },
        driving: {
          majorRoutes: ['I-690', 'I-81'],
          typicalTraffic: 'Light',
          bestApproach: 'From I-690'
        },
        rideShare: {
          pickupZone: 'Main entrance',
          dropoffZone: 'Same',
          surgePricing: '1.5x'
        }
      },
      history: {
        timeline: [
          { year: 1997, event: 'Stadium opens' },
          { year: 2019, event: 'Become Mets affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Classic Triple-A ballpark',
        bestExperiences: ['Salt potatoes', 'Mets connection', 'Family fun'],
        traditions: ['Friday fireworks'],
        music: 'Classic ballpark',
        mascot: { name: 'Scooch', description: 'Mets mascot' }
      },
      proTips: {
        insiderTips: ['Salt potatoes unique', 'Mets rehabs common'],
        avoidThese: ['Left field in sun', 'Limited late food'],
        hiddenGems: ['Party deck', 'Local beer'],
        photoSpots: ['Skyline view', 'With Scooch'],
        bestValue: ['Bleachers', 'Tuesday deals']
      }
    },
    'toledo-mud-hens': {
      id: 'toledo-mud-hens',
      name: 'Fifth Third Field',
      team: 'Toledo Mud Hens',
      opened: 2002,
      capacity: 10300,
      overview: {
        description: 'Fifth Third Field is home to the Toledo Mud Hens, Triple-A affiliate of the Detroit Tigers. Downtown Toledo warehouse district location.',
        highlights: ['Downtown Toledo', 'Tigers affiliate', 'Warehouse district'],
        uniqueFeatures: ['Roost party area', 'Downtown skyline', 'Historic warehouses'],
        renovations: [{ year: 2020, description: 'Facility improvements' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side'],
          evening: ['Most sections']
        },
        coveredSeating: ['Club level', 'The Roost'],
        shadeTips: ['First base for afternoon', 'Roost has cover'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store', 'Club']
        },
        worstSunExposure: ['Left field', 'Bleachers'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 50, avgHumidity: 60, rainChance: 40, typicalConditions: 'Cool', shadeTip: 'Layers' },
          { month: 'May', avgTemp: 61, avgHumidity: 62, rainChance: 40, typicalConditions: 'Variable', shadeTip: 'Check forecast' },
          { month: 'June', avgTemp: 71, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Perfect' },
          { month: 'July', avgTemp: 75, avgHumidity: 68, rainChance: 30, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'August', avgTemp: 74, avgHumidity: 70, rainChance: 30, typicalConditions: 'Comfortable', shadeTip: 'Hydrate' },
          { month: 'September', avgTemp: 66, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cool', shadeTip: 'Fall weather' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Fleetwood Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering'] },
          specialAreas: [{ name: 'The Roost', description: 'Left field party area', capacity: 200 }]
        },
        budgetOptions: ['Bleachers', 'Upper reserved'],
        familySections: ['Sections 100-102'],
        tips: [
          { section: 'Behind home', tip: 'Best views', category: 'view' },
          { section: 'The Roost', tip: 'Party atmosphere', category: 'experience' }
        ]
      },
      concessions: {
        signature: ['Tony Packos hot dogs', 'Local craft beer', 'Ballpark classics'],
        local: ['Toledo specialties', 'Ohio foods'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Great Lakes', 'Maumee Bay', 'Local craft'],
          wine: true,
          cocktails: true,
          localBreweries: ['Maumee Bay', 'Black Cloister']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium lots', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
          { name: 'Downtown garages', distance: '5-10 min', price: '$5-10', shadedSpots: true, covered: true }
        ],
        alternativeTransport: {
          publicTransit: ['TARTA bus'],
          rideShare: 'Washington Street'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Washington Street', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Mud Hens Store' }],
        firstAid: ['Section 105'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Tony Packos', description: 'Famous hot dogs', category: 'food' },
          { title: 'Tigers connection', description: 'Rehab appearances', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '6:35 PM or 7:05 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Warehouse District',
        description: 'Historic downtown',
        beforeGame: ['Downtown restaurants', 'Hensville area'],
        afterGame: ['Downtown bars'],
        radius: '0.5 mile'
      },
      transportation: {
        address: '406 Washington St, Toledo, OH 43604',
        publicTransit: {
          bus: [{ routes: ['TARTA'], stops: ['Downtown'] }]
        },
        driving: {
          majorRoutes: ['I-75 to downtown', 'I-280 to downtown'],
          typicalTraffic: 'Light',
          bestApproach: 'From I-75'
        },
        rideShare: {
          pickupZone: 'Washington Street',
          dropoffZone: 'Same',
          surgePricing: '1.5x'
        }
      },
      history: {
        timeline: [
          { year: 2002, event: 'Fifth Third Field opens' },
          { year: 1987, event: 'Become Tigers affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'Downtown warehouse district setting',
        bestExperiences: ['Tony Packos', 'The Roost', 'Tigers connection'],
        traditions: ['Friday fireworks', 'Muddy mascot'],
        music: 'Classic ballpark',
        mascot: { name: 'Muddy', description: 'Mud Hen mascot' }
      },
      proTips: {
        insiderTips: ['Tony Packos famous', 'Tigers rehabs common'],
        avoidThese: ['Left field in sun', 'Limited parking'],
        hiddenGems: ['The Roost', 'Hensville before game'],
        photoSpots: ['Warehouse backdrop', 'With Muddy'],
        bestValue: ['Bleachers', 'Tuesday deals']
      }
    },
    'worcester-red-sox': {
      id: 'worcester-red-sox',
      name: 'Polar Park',
      team: 'Worcester Red Sox',
      opened: 2021,
      capacity: 9508,
      overview: {
        description: 'Polar Park is home to the Worcester Red Sox, Triple-A affiliate of the Boston Red Sox. Brand new ballpark in the Canal District.',
        highlights: ['Brand new facility', 'Red Sox affiliate', 'Canal District'],
        uniqueFeatures: ['Worcester Wall', 'DCU Club', 'Heart of the Commonwealth'],
        renovations: []
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side', 'DCU Club'],
          evening: ['Most sections']
        },
        coveredSeating: ['DCU Club', 'Suite level'],
        shadeTips: ['First base for afternoon', 'DCU Club climate controlled'],
        sunProtection: {
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['DCU Club', 'Team store']
        },
        worstSunExposure: ['Left field wall', 'Right field'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 49, avgHumidity: 58, rainChance: 40, typicalConditions: 'Cool', shadeTip: 'Dress warm' },
          { month: 'May', avgTemp: 60, avgHumidity: 62, rainChance: 40, typicalConditions: 'Variable', shadeTip: 'Layers' },
          { month: 'June', avgTemp: 69, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant', shadeTip: 'Perfect' },
          { month: 'July', avgTemp: 74, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warm', shadeTip: 'Seek shade' },
          { month: 'August', avgTemp: 72, avgHumidity: 70, rainChance: 35, typicalConditions: 'Comfortable', shadeTip: 'Hydrate' },
          { month: 'September', avgTemp: 64, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cool', shadeTip: 'Fall weather' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'DCU Club', perks: ['All-inclusive', 'Climate controlled'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering', 'HDTV'] },
          specialAreas: [{ name: 'Worcester Wall', description: 'Left field wall seating', capacity: 50 }]
        },
        budgetOptions: ['Upper reserved', 'Standing room'],
        familySections: ['Sections 10-12'],
        tips: [
          { section: 'Worcester Wall', tip: 'Unique experience', category: 'experience' },
          { section: 'DCU Club', tip: 'Premium experience', category: 'experience' }
        ]
      },
      concessions: {
        signature: ['Table Talk pies', 'Coney Island hot dogs', 'Local craft beer'],
        local: ['Worcester specialties', 'New England fare'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Wachusett', 'Wormtown', 'Sam Adams'],
          wine: true,
          cocktails: true,
          localBreweries: ['Wachusett', 'Wormtown']
        }
      },
      parking: {
        lots: [
          { name: 'Summit Street Garage', distance: 'Adjacent', price: '$10', shadedSpots: true, covered: true },
          { name: 'Canal District lots', distance: '5-10 min', price: '$5-10', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          publicTransit: ['WRTA bus', 'Commuter rail'],
          rideShare: 'Madison Street'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Madison Street', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'WooSox Store' }],
        firstAid: ['Section 7'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Table Talk pies', description: 'Local favorite', category: 'food' },
          { title: 'Red Sox connection', description: 'Close to Boston', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '6:45 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Canal District',
        description: 'Entertainment district',
        beforeGame: ['Canal District restaurants', 'Green Street area'],
        afterGame: ['Downtown Worcester bars'],
        radius: '0.5 mile'
      },
      transportation: {
        address: '100 Madison St, Worcester, MA 01608',
        publicTransit: {
          train: [{ lines: ['Commuter Rail'], station: 'Worcester Union', walkTime: '10 minutes' }],
          bus: [{ routes: ['WRTA'], stops: ['Downtown'] }]
        },
        driving: {
          majorRoutes: ['I-290 to downtown', 'Route 146'],
          typicalTraffic: 'Moderate',
          bestApproach: 'From I-290'
        },
        rideShare: {
          pickupZone: 'Madison Street',
          dropoffZone: 'Same',
          surgePricing: '2x after games'
        }
      },
      history: {
        timeline: [
          { year: 2021, event: 'Polar Park opens' },
          { year: 2021, event: 'WooSox begin play' },
          { year: 1973, event: 'Red Sox affiliation begins' }
        ]
      },
      fanExperience: {
        atmosphere: 'New ballpark with Red Sox heritage',
        bestExperiences: ['Worcester Wall', 'Red Sox connection', 'Canal District'],
        traditions: ['Smiley Ball mascot', 'Red Sox heritage'],
        music: 'Red Sox themed',
        mascot: { name: 'Smiley Ball', description: 'WooSox mascot' }
      },
      proTips: {
        insiderTips: ['Worcester Wall unique', 'Red Sox rehabs frequent'],
        avoidThese: ['Left field wall sun', 'Limited street parking'],
        hiddenGems: ['DCU Club', 'Canal District before'],
        photoSpots: ['Worcester Wall', 'With Smiley Ball'],
        bestValue: ['Upper reserved', 'Student nights']
      }
    },
    'albuquerque-isotopes': {
      id: 'albuquerque-isotopes',
      name: 'Isotopes Park',
      team: 'Albuquerque Isotopes',
      opened: 2003,
      capacity: 13279,
      overview: {
        description: 'Isotopes Park is home to the Albuquerque Isotopes, Triple-A affiliate of the Colorado Rockies. High elevation ballpark with mountain views.',
        highlights: ['High elevation', 'Sandia Mountains views', 'Simpsons connection'],
        uniqueFeatures: ['Mountain backdrop', 'High altitude baseball', 'Green chile'],
        renovations: [{ year: 2019, description: 'Facility upgrades' }]
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side', 'Upper deck'],
          evening: ['Most sections']
        },
        coveredSeating: ['Club level', 'Suite level'],
        shadeTips: ['First base for afternoon', 'High altitude sun strong'],
        sunProtection: {
          sunscreenStations: ['Guest services'],
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store', 'Club']
        },
        worstSunExposure: ['Right field', 'Bleachers'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 57, avgHumidity: 30, rainChance: 15, typicalConditions: 'Dry and mild', shadeTip: 'Sun protection essential' },
          { month: 'May', avgTemp: 67, avgHumidity: 25, rainChance: 15, typicalConditions: 'Perfect weather', shadeTip: 'High altitude sun' },
          { month: 'June', avgTemp: 77, avgHumidity: 20, rainChance: 15, typicalConditions: 'Hot and dry', shadeTip: 'Hydrate frequently' },
          { month: 'July', avgTemp: 82, avgHumidity: 35, rainChance: 30, typicalConditions: 'Monsoon season', shadeTip: 'Afternoon storms' },
          { month: 'August', avgTemp: 80, avgHumidity: 40, rainChance: 30, typicalConditions: 'Monsoon continues', shadeTip: 'Check weather' },
          { month: 'September', avgTemp: 72, avgHumidity: 30, rainChance: 20, typicalConditions: 'Beautiful fall', shadeTip: 'Perfect baseball weather' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'Isotopes Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering'] },
          specialAreas: [{ name: 'Berm', description: 'Outfield grass', capacity: 500 }]
        },
        budgetOptions: ['Berm seating', 'Upper reserved'],
        familySections: ['Sections 115-117'],
        tips: [
          { section: 'Behind home', tip: 'Mountain views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Green chile cheeseburgers', 'Mariachis Nachos', 'Local beer'],
        local: ['New Mexican cuisine', 'Green chile everything', 'Local specialties'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie options'],
        kidsFriendly: ['Hot dogs', 'Pizza'],
        alcohol: {
          beer: ['Santa Fe', 'La Cumbre', 'Marble'],
          wine: true,
          cocktails: true,
          localBreweries: ['Santa Fe', 'La Cumbre', 'Marble']
        }
      },
      parking: {
        lots: [
          { name: 'Stadium lots', distance: 'Adjacent', price: '$8', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          publicTransit: ['ABQ RIDE bus'],
          rideShare: 'Avenida Cesar Chavez'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Avenida Cesar Chavez', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Isotopes Store' }],
        firstAid: ['Section 108'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Green chile burger', description: 'Must-try', category: 'food' },
          { title: 'High altitude', description: 'Ball flies farther', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '6:35 PM or 7:05 PM',
          rushHours: ['5:00-6:00 PM on I-25']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Uptown',
        description: 'Near UNM',
        beforeGame: ['Uptown restaurants', 'Local breweries'],
        afterGame: ['Nob Hill bars'],
        radius: '1-2 miles'
      },
      transportation: {
        address: '1601 Avenida Cesar Chavez SE, Albuquerque, NM 87106',
        publicTransit: {
          bus: [{ routes: ['ABQ RIDE'], stops: ['Stadium'] }]
        },
        driving: {
          majorRoutes: ['I-25 to Cesar Chavez'],
          typicalTraffic: 'Light to moderate',
          bestApproach: 'From I-25'
        },
        rideShare: {
          pickupZone: 'Cesar Chavez',
          dropoffZone: 'Same',
          surgePricing: '1.5x'
        }
      },
      history: {
        timeline: [
          { year: 2003, event: 'Isotopes Park opens' },
          { year: 2003, event: 'Named after Simpsons episode' },
          { year: 2015, event: 'Become Rockies affiliate' }
        ]
      },
      fanExperience: {
        atmosphere: 'High altitude fun with green chile',
        bestExperiences: ['Green chile burger', 'Mountain views', 'Mariachis'],
        traditions: ['Mariachi Mondays', 'Green chile roasting'],
        music: 'Southwest mix',
        mascot: { name: 'Orbit', description: 'Alien mascot' }
      },
      proTips: {
        insiderTips: ['Green chile on everything', 'Balls fly at altitude', 'Sunscreen essential'],
        avoidThese: ['Right field in sun', 'Forgetting water', 'Underestimating sun'],
        hiddenGems: ['Berm seating', 'Local beer selection', 'Mariachi nights'],
        photoSpots: ['Mountain backdrop', 'With Orbit', 'Sunset views'],
        bestValue: ['Berm seating', 'Thirsty Thursday', 'Dollar Dog nights']
      }
    },
    'el-paso-chihuahuas': {
      id: 'el-paso-chihuahuas',
      name: 'Southwest University Park',
      team: 'El Paso Chihuahuas',
      opened: 2014,
      capacity: 9500,
      overview: {
        description: 'Southwest University Park is home to the El Paso Chihuahuas, Triple-A affiliate of the San Diego Padres. Downtown El Paso with mountain views.',
        highlights: ['Downtown El Paso', 'Franklin Mountains views', 'Mexican border proximity'],
        uniqueFeatures: ['Mountain backdrop', 'Border culture', 'Desert setting'],
        renovations: []
      },
      shadeGuide: {
        bestShadedSections: {
          morning: ['Third base side'],
          afternoon: ['First base side', 'Club level'],
          evening: ['Most sections']
        },
        coveredSeating: ['Club level', 'Suite level'],
        shadeTips: ['First base for afternoon', 'Desert sun intense'],
        sunProtection: {
          sunscreenStations: ['Guest services'],
          shadedConcourses: ['Main concourse'],
          indoorAreas: ['Team store', 'Club']
        },
        worstSunExposure: ['Left field', 'Right field'],
        monthlyPatterns: [
          { month: 'April', avgTemp: 70, avgHumidity: 25, rainChance: 5, typicalConditions: 'Perfect', shadeTip: 'Ideal weather' },
          { month: 'May', avgTemp: 79, avgHumidity: 20, rainChance: 5, typicalConditions: 'Warming up', shadeTip: 'Sun protection' },
          { month: 'June', avgTemp: 88, avgHumidity: 20, rainChance: 10, typicalConditions: 'Hot and dry', shadeTip: 'Evening games best' },
          { month: 'July', avgTemp: 89, avgHumidity: 35, rainChance: 25, typicalConditions: 'Monsoon season', shadeTip: 'Afternoon storms' },
          { month: 'August', avgTemp: 87, avgHumidity: 40, rainChance: 25, typicalConditions: 'Monsoon continues', shadeTip: 'Check weather' },
          { month: 'September', avgTemp: 81, avgHumidity: 35, rainChance: 15, typicalConditions: 'Still warm', shadeTip: 'Evening comfort' }
        ]
      },
      seatingGuide: {
        premiumSeating: {
          clubs: [{ name: 'WestStar Club', perks: ['All-inclusive'], access: 'Behind home' }],
          suites: { levels: ['Suite level'], amenities: ['Catering'] },
          specialAreas: [{ name: 'Party Patio', description: 'Right field', capacity: 150 }]
        },
        budgetOptions: ['Upper reserved', 'Outfield'],
        familySections: ['Sections 205-207'],
        tips: [
          { section: 'Behind home', tip: 'Mountain views', category: 'view' },
          { section: 'First base', tip: 'Afternoon shade', category: 'shade' }
        ]
      },
      concessions: {
        signature: ['Chico\'s Tacos', 'Street tacos', 'Margaritas'],
        local: ['El Paso Mexican food', 'Border cuisine', 'Local specialties'],
        healthy: ['Salads', 'Grilled options'],
        vegetarian: ['Veggie tacos'],
        kidsFriendly: ['Hot dogs', 'Nachos'],
        alcohol: {
          beer: ['Modelo', 'Dos Equis', 'Local craft'],
          wine: true,
          cocktails: true,
          localBreweries: ['DeadBeach', 'Ode']
        }
      },
      parking: {
        lots: [
          { name: 'Downtown lots', distance: '5-10 min', price: '$5-10', shadedSpots: false, covered: false },
          { name: 'Street parking', distance: 'Varies', price: 'Metered', shadedSpots: false, covered: false }
        ],
        alternativeTransport: {
          publicTransit: ['Sun Metro bus'],
          rideShare: 'Santa Fe Street'
        }
      },
      gates: [
        { name: 'Main Gate', location: 'Santa Fe Street', bestFor: ['All sections'], openTime: '90 minutes before' }
      ],
      amenities: {
        merchandise: [{ location: 'Chihuahuas Store' }],
        firstAid: ['Section 110'],
        babyChanging: ['Family restrooms'],
        atms: ['Main concourse'],
        wifi: { available: true }
      },
      accessibility: {
        wheelchairAccess: {
          available: true,
          sections: ['All levels'],
          entrance: 'All gates',
          elevators: ['Available']
        },
        assistiveListening: true,
        signageAndBraille: true,
        serviceAnimals: true,
        companionSeats: true,
        accessibleRestrooms: ['All levels'],
        accessibleConcessions: ['All stands'],
        parkingSpaces: 'Available'
      },
      gameDay: {
        tips: [
          { title: 'Chico\'s Tacos', description: 'El Paso classic', category: 'food' },
          { title: 'Mountain sunset', description: 'Beautiful views', category: 'experience' }
        ],
        typicalSchedule: {
          gatesOpen: '90 minutes before',
          firstPitch: '7:05 PM',
          rushHours: ['5:00-6:00 PM']
        },
        security: {
          allowedBags: 'Small bags',
          prohibitedItems: ['Outside food/drinks'],
          metalDetectors: true
        }
      },
      neighborhood: {
        name: 'Downtown El Paso',
        description: 'Urban center',
        beforeGame: ['Downtown restaurants', 'Cincinnati Street'],
        afterGame: ['Downtown bars'],
        radius: '0.5 mile'
      },
      transportation: {
        address: '1 Ballpark Plaza, El Paso, TX 79901',
        publicTransit: {
          bus: [{ routes: ['Sun Metro'], stops: ['Downtown'] }]
        },
        driving: {
          majorRoutes: ['I-10 to downtown'],
          typicalTraffic: 'Light',
          bestApproach: 'From I-10'
        },
        rideShare: {
          pickupZone: 'Santa Fe Street',
          dropoffZone: 'Same',
          surgePricing: '1.5x'
        }
      },
      history: {
        timeline: [
          { year: 2014, event: 'Southwest University Park opens' },
          { year: 2014, event: 'Chihuahuas begin play' }
        ]
      },
      fanExperience: {
        atmosphere: 'Border town baseball with mountain views',
        bestExperiences: ['Mountain sunset', 'Mexican food', 'Border culture'],
        traditions: ['Chihuahua races', 'Margarita Monday'],
        music: 'Tex-Mex mix',
        mascot: { name: 'Chico', description: 'Chihuahua mascot' }
      },
      proTips: {
        insiderTips: ['Chico\'s Tacos unique', 'Sunset views amazing', 'Margarita Monday deals'],
        avoidThese: ['Afternoon sun', 'Limited parking downtown', 'Desert heat'],
        hiddenGems: ['Party Patio', 'Local Mexican food', 'Border culture'],
        photoSpots: ['Mountain backdrop', 'With Chico', 'Sunset views'],
        bestValue: ['Upper reserved', 'Dollar nights', 'Group deals']
      }
    },

  'oklahoma-city-dodgers': {
    id: 'oklahoma-city-dodgers',
    name: 'Chickasaw Bricktown Ballpark',
    team: 'Oklahoma City Baseball Club',
    opened: 1998,
    capacity: 13066,

    overview: {
      description: 'Chickasaw Bricktown Ballpark is home to the Oklahoma City Baseball Club, Triple-A affiliate of the Los Angeles Dodgers. Located in the heart of Bricktown entertainment district.',
      highlights: ['Bricktown location', 'Downtown skyline views', 'Entertainment district'],
      uniqueFeatures: ['Bricktown canal', 'Oil derrick in outfield', 'Party deck'],
      renovations: [{ year: 2014, description: 'Clubhouse renovation' }]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-105', 'Sections 117-120'],
        afternoon: ['Sections 109-115', 'Club Level'],
        evening: ['Sections 101-107', 'Sections 201-207']
      },
      coveredSeating: ['Sections 201-217 (upper deck overhang)', 'Club Level'],
      shadeTips: [
        'Third base side gets afternoon shade first',
        'Upper deck provides shade for lower sections',
        'Club level fully covered'
      ],
      sunProtection: {
        shadedConcourses: ['Upper concourse', 'Club level'],
        indoorAreas: ['Club lounge', 'Team store']
      },
      worstSunExposure: ['Sections 106-108', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 58, rainChance: 25, typicalConditions: 'Variable spring weather', shadeTip: 'Bring layers for evening games' },
        { month: 'May', avgTemp: 71, avgHumidity: 65, rainChance: 30, typicalConditions: 'Warm with thunderstorms', shadeTip: 'Watch for severe weather' },
        { month: 'June', avgTemp: 79, avgHumidity: 65, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Seek shade early' },
        { month: 'July', avgTemp: 84, avgHumidity: 60, rainChance: 20, typicalConditions: 'Very hot', shadeTip: 'Night games preferred' },
        { month: 'August', avgTemp: 83, avgHumidity: 60, rainChance: 20, typicalConditions: 'Hot and dry', shadeTip: 'Hydrate frequently' },
        { month: 'September', avgTemp: 75, avgHumidity: 62, rainChance: 25, typicalConditions: 'Warm days, cool nights', shadeTip: 'Perfect baseball weather' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [{ name: 'Coors Light Club', perks: ['Indoor/outdoor seating', 'Full bar', 'AC'], access: 'Club ticket required' }],
        suites: { levels: ['Suite Level'], amenities: ['Private bathroom', 'Catering', 'TV monitors'] }
      },
      budgetOptions: ['General admission lawn', 'Upper deck corners'],
      familySections: ['Sections 115-117'],
      standingRoom: ['Party deck', 'Outfield concourse'],
      partyAreas: [{ name: 'Corona Beach House', capacity: '150', amenities: ['Beach theme', 'Group seating'] }],
      tips: [
        { section: 'Sections 109-111', tip: 'Best shade for day games', category: 'shade' },
        { section: 'Sections 106-108', tip: 'Close to Bricktown', category: 'experience' },
        { section: 'Lawn', tip: 'Great value for families', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Bricktown Burger', 'Toby Keith nachos'],
      local: ['Oklahoma BBQ', 'Chicken fried steak', 'Native American tacos'],
      healthy: ['Salad bar', 'Grilled chicken wraps'],
      vegetarian: ['Veggie burgers', 'Salads'],
      kidsFriendly: ['Mini corn dogs', 'Ice cream helmet'],
      alcohol: {
        beer: ['Coors Light', 'Prairie Artisan Ales', 'COOP Ale Works'],
        wine: true,
        cocktails: true,
        localBreweries: ['Prairie', 'COOP', 'Anthem']
      }
    },

    parking: {
      lots: [
        { name: 'North Lot', distance: '2 blocks', price: '$10', shadedSpots: false, covered: false },
        { name: 'Bricktown Garage', distance: '5 minute walk', price: '$5-10', shadedSpots: false, covered: true }
      ],
      streetParking: { available: true, restrictions: 'Metered until 6pm', tip: 'Free after 6pm' },
      alternativeTransport: {
        publicTransit: ['EMBARK bus routes'],
        rideShare: 'Designated pickup zone',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      { name: 'Home Plate Gate', location: 'Mickey Mantle Drive', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch', tip: 'Busiest entrance' },
      { name: 'First Base Gate', location: 'East side', bestFor: ['Lower bowl access'], openTime: '90 minutes before first pitch' },
      { name: 'Third Base Gate', location: 'West side', bestFor: ['Club level'], openTime: '90 minutes before first pitch' }
    ],

    amenities: {
      merchandise: [{ location: 'Main concourse', exclusive: ['OKC Baseball gear'] }],
      firstAid: ['Behind home plate', 'Section 215'],
      babyChanging: ['All family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'BricktownBallpark_Guest' },
      chargingStations: ['Club level']
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels via elevators'],
        entrance: 'All gates',
        elevators: ['Home plate', 'First base', 'Third base']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Each lot has designated spaces'
    },

    gameDay: {
      tips: [
        { title: 'Explore Bricktown', description: 'Arrive early to enjoy restaurants and bars', category: 'arrival' },
        { title: 'Canal walk', description: 'Take the canal boat to the ballpark', category: 'experience' },
        { title: 'Shade priority', description: 'Third base side for afternoon games', category: 'shade' },
        { title: 'Stay after', description: 'Bricktown nightlife after games', category: 'departure' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before',
        firstPitch: '7:05 PM weekdays, 6:05 PM weekends',
        rushHours: ['6:30-7:00 PM']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Umbrellas'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Bricktown',
      description: 'Oklahoma City premier entertainment district',
      beforeGame: ['Toby Keith Bar & Grill', 'Bricktown Brewery', 'Mickey Mantle Restaurant'],
      afterGame: ['Bricktown bars', 'Canal restaurants', 'Live music venues'],
      radius: '2 blocks'
    },

    transportation: {
      address: '2 S Mickey Mantle Dr, Oklahoma City, OK 73104',
      publicTransit: {
        bus: [{ routes: ['EMBARK Downtown Discovery'], stops: ['Bricktown Transit Center'] }]
      },
      driving: {
        majorRoutes: ['I-40', 'I-35', 'I-235'],
        typicalTraffic: 'Moderate on game days',
        bestApproach: 'From I-40, exit Shields Blvd'
      },
      rideShare: {
        pickupZone: 'Reno Ave',
        dropoffZone: 'Mickey Mantle Dr',
        surgePricing: '1.5-2x after games'
      }
    },

    history: {
      timeline: [
        { year: 1998, event: 'Stadium opens as home to RedHawks' },
        { year: 2011, event: 'Becomes Dodgers affiliate' },
        { year: 2014, event: 'Major renovations completed' }
      ],
      notableGames: [
        { date: '1998-04-16', description: 'First game at Bricktown Ballpark' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly with Bricktown energy',
      bestExperiences: ['Bricktown pre-game', 'Oil derrick celebration', 'Fireworks nights'],
      traditions: ['Oil derrick home runs', 'Seventh inning stretch'],
      mascot: { name: 'Rumble the Bison', description: 'Team mascot' }
    },

    proTips: {
      insiderTips: [
        'Explore Bricktown before games',
        'Canal boat to stadium is unique',
        'Club level best value for shade'
      ],
      avoidThese: [
        'Driving right at game time',
        'Outfield during day games',
        'Limited parking nearby'
      ],
      hiddenGems: [
        'Bricktown history walk',
        'Mickey Mantle statue',
        'Canal-side seating at restaurants'
      ],
      photoSpots: [
        'Oil derrick',
        'Bricktown canal view',
        'Downtown skyline from upper deck'
      ],
      bestValue: [
        'Lawn seating',
        'Thirsty Thursday specials',
        'Kids eat free Sundays'
      ]
    }
  },

  'reno-aces': {
    id: 'reno-aces',
    name: 'Greater Nevada Field',
    team: 'Reno Aces',
    opened: 2009,
    capacity: 9013,

    overview: {
      description: 'Greater Nevada Field is home to the Reno Aces, Triple-A affiliate of the Arizona Diamondbacks. Downtown ballpark with Sierra Nevada mountain views.',
      highlights: ['Mountain views', 'Downtown location', 'Biggest Little City'],
      uniqueFeatures: ['Aces Alley', 'Party deck', 'Sierra views'],
      renovations: [{ year: 2019, description: 'LED lighting upgrade' }]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-106', 'Sections 118-120'],
        afternoon: ['Sections 112-118', 'Club Level'],
        evening: ['Sections 101-108', 'Sections 201-208']
      },
      coveredSeating: ['Club Level', 'Luxury Suites'],
      shadeTips: [
        'First base side gets afternoon shade',
        'High altitude means strong sun',
        'Mountain shadows help late innings'
      ],
      sunProtection: {
        shadedConcourses: ['Club level', 'Suite level'],
        indoorAreas: ['Freight House District', 'Team store']
      },
      worstSunExposure: ['Sections 107-111', 'Outfield party deck'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 35, rainChance: 15, typicalConditions: 'Cool and dry', shadeTip: 'Bring layers for evening' },
        { month: 'May', avgTemp: 67, avgHumidity: 30, rainChance: 10, typicalConditions: 'Pleasant and dry', shadeTip: 'Perfect weather' },
        { month: 'June', avgTemp: 76, avgHumidity: 25, rainChance: 5, typicalConditions: 'Warm and dry', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 83, avgHumidity: 20, rainChance: 5, typicalConditions: 'Hot and very dry', shadeTip: 'Hydrate constantly' },
        { month: 'August', avgTemp: 81, avgHumidity: 22, rainChance: 5, typicalConditions: 'Hot and dry', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 73, avgHumidity: 25, rainChance: 5, typicalConditions: 'Warm days, cool nights', shadeTip: 'Ideal conditions' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [{ name: 'SK Baseball Club', perks: ['All-inclusive food/drink', 'Premium seating'], access: 'Club membership' }],
        suites: { levels: ['Suite Level'], amenities: ['Private restroom', 'Catering', 'Climate control'] }
      },
      budgetOptions: ['GA lawn', 'Upper deck corners'],
      familySections: ['Sections 114-116'],
      standingRoom: ['Aces Alley', 'Party deck'],
      partyAreas: [{ name: 'Party Deck', capacity: '200', amenities: ['Bar', 'Standing room'] }],
      tips: [
        { section: 'Sections 112-114', tip: 'Best shade and value', category: 'shade' },
        { section: 'Sections 101-103', tip: 'Close to Freight House', category: 'experience' },
        { section: 'Lawn', tip: 'Bring blankets, great for families', category: 'family' }
      ]
    },

    concessions: {
      signature: ['Awful Awful Burger', 'Bighorns BBQ'],
      local: ['Basque food', 'Nevada craft beers', 'Casino-style shrimp cocktail'],
      healthy: ['Fresh salads', 'Grilled options'],
      vegetarian: ['Veggie dogs', 'Portobello burgers'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy'],
      alcohol: {
        beer: ['Great Basin', 'Revision Brewing', 'IMBIB'],
        wine: true,
        cocktails: true,
        localBreweries: ['Great Basin', 'Revision', 'Lead Dog']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: 'Adjacent', price: '$7', shadedSpots: false, covered: false },
        { name: 'National Bowling Stadium', distance: '2 blocks', price: '$5', shadedSpots: false, covered: true }
      ],
      streetParking: { available: true, restrictions: 'Metered', tip: 'Free after 6pm' },
      alternativeTransport: {
        publicTransit: ['RTC RAPID buses'],
        rideShare: 'Designated zones',
        bicycle: 'Bike valet available'
      }
    },

    gates: [
      { name: 'Home Plate Gate', location: 'North Virginia St', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch', tip: 'Freight House District access' },
      { name: 'Right Field Gate', location: 'East 2nd St', bestFor: ['Party deck'], openTime: '90 minutes before first pitch' }
    ],

    amenities: {
      merchandise: [{ location: 'Main concourse', exclusive: ['Aces gear', 'Biggest Little City items'] }],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'AcesWiFi' },
      kidZones: [{ name: 'Kids Zone', location: 'Left field', activities: ['Playground', 'Games'] }]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels'],
        entrance: 'All gates ADA accessible',
        elevators: ['Main entrance', 'Suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated in all lots'
    },

    gameDay: {
      tips: [
        { title: 'Freight House District', description: 'Great pre-game spot', category: 'arrival' },
        { title: 'High altitude', description: 'Stay hydrated', category: 'weather' },
        { title: 'Casino shuttles', description: 'Free from major casinos', category: 'arrival' },
        { title: 'Mountain views', description: 'Best at sunset', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before',
        firstPitch: '6:35 PM or 7:05 PM',
        rushHours: ['6:00-6:30 PM']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside alcohol', 'Weapons', 'Glass'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Downtown Reno',
      description: 'The Biggest Little City downtown district',
      beforeGame: ['Freight House District', 'The Depot', 'Campo'],
      afterGame: ['Downtown casinos', 'Midtown District bars'],
      radius: '3 blocks'
    },

    transportation: {
      address: '250 Evans Ave, Reno, NV 89501',
      publicTransit: {
        bus: [{ routes: ['RTC RAPID'], stops: ['Downtown Reno'] }]
      },
      driving: {
        majorRoutes: ['I-80', 'US-395', 'I-580'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'From I-80, exit Virginia St'
      },
      rideShare: {
        pickupZone: 'East 2nd Street',
        dropoffZone: 'Virginia Street',
        surgePricing: '1.5-2x after games'
      }
    },

    history: {
      timeline: [
        { year: 2009, event: 'Stadium opens' },
        { year: 2009, event: 'Aces begin play as D-backs affiliate' },
        { year: 2012, event: 'Hosts Triple-A All-Star Game' }
      ]
    },

    fanExperience: {
      atmosphere: 'Relaxed Nevada vibe with mountain backdrop',
      bestExperiences: ['Freight House pre-game', 'Sunset over mountains', 'Fireworks Fridays'],
      traditions: ['Ace in the Hole', 'Home run train whistle'],
      mascot: { name: 'Archie', description: 'Red fuzzy mascot' }
    },

    proTips: {
      insiderTips: [
        'Freight House District for food/drinks',
        'Free casino shuttles available',
        'Lawn seating great for families'
      ],
      avoidThese: [
        'Sections 107-111 for day games',
        'Limited shade options',
        'Parking fills quickly'
      ],
      hiddenGems: [
        'Bike valet service',
        'Kids run bases Sundays',
        'Freight House history'
      ],
      photoSpots: [
        'Mountain backdrop',
        'Reno arch nearby',
        'Sunset from upper deck'
      ],
      bestValue: [
        'Lawn seating',
        'Taco Tuesday specials',
        'Thirsty Thursday deals'
      ]
    }
  },

  'round-rock-express': {
    id: 'round-rock-express',
    name: 'Dell Diamond',
    team: 'Round Rock Express',
    opened: 2000,
    capacity: 11631,

    overview: {
      description: 'Dell Diamond is home to the Round Rock Express, Triple-A affiliate of the Texas Rangers. Award-winning facility in Austin metro area.',
      highlights: ['Dell technology partnership', 'Austin area', 'Family-friendly'],
      uniqueFeatures: ['Rock Wall', 'Swimming pool', 'Play area'],
      renovations: [
        { year: 2019, description: 'Rangers affiliation upgrades' },
        { year: 2021, description: 'Video board upgrade' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-105', 'Sections 119-124'],
        afternoon: ['Sections 113-119', 'Suites'],
        evening: ['Sections 101-108', 'Sections 201-208']
      },
      coveredSeating: ['Suites', 'United Heritage Center'],
      shadeTips: [
        'Third base side best for afternoon',
        'Texas heat requires shade priority',
        'Upper deck provides some shade to lower'
      ],
      sunProtection: {
        shadedConcourses: ['Suite level', 'Club areas'],
        indoorAreas: ['United Heritage Center', 'Team store']
      },
      worstSunExposure: ['Sections 106-112', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 71, avgHumidity: 65, rainChance: 20, typicalConditions: 'Pleasant spring weather', shadeTip: 'Great baseball weather' },
        { month: 'May', avgTemp: 78, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm and humid', shadeTip: 'Seek shade for day games' },
        { month: 'June', avgTemp: 85, avgHumidity: 65, rainChance: 20, typicalConditions: 'Hot and humid', shadeTip: 'Night games recommended' },
        { month: 'July', avgTemp: 89, avgHumidity: 60, rainChance: 15, typicalConditions: 'Very hot', shadeTip: 'Shade essential' },
        { month: 'August', avgTemp: 89, avgHumidity: 60, rainChance: 15, typicalConditions: 'Peak heat', shadeTip: 'Hydrate constantly' },
        { month: 'September', avgTemp: 82, avgHumidity: 65, rainChance: 20, typicalConditions: 'Still warm', shadeTip: 'Late summer heat' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [{ name: 'United Heritage Center', perks: ['All-inclusive', 'AC', 'Private bar'], access: 'Special ticket' }],
        suites: { levels: ['Suite Level'], amenities: ['Climate control', 'Private restroom', 'Catering'] },
        specialAreas: [{ name: 'Pool Area', description: 'Swimming pool in outfield', capacity: 30 }]
      },
      budgetOptions: ['Outfield berm', 'Upper deck corners'],
      familySections: ['Sections 120-122'],
      standingRoom: ['Rock Porch', 'Concourse'],
      partyAreas: [
        { name: 'Rock Porch', capacity: '300', amenities: ['Bar', 'Standing room'] },
        { name: 'Pool', capacity: '30', amenities: ['Swimming', 'Seating'] }
      ],
      tips: [
        { section: 'Sections 113-115', tip: 'Best shade for Texas heat', category: 'shade' },
        { section: 'Berm', tip: 'Great for families with kids', category: 'family' },
        { section: 'Pool area', tip: 'Unique experience, book early', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Cheeseburger Cheeseburger', 'Brisket nachos'],
      local: ['Texas BBQ', 'Breakfast tacos', 'Kolaches'],
      healthy: ['Salads', 'Fruit cups', 'Grilled chicken'],
      vegetarian: ['Veggie burgers', 'Salads'],
      kidsFriendly: ['Dippin Dots', 'Cotton candy', 'Mini pizzas'],
      alcohol: {
        beer: ['Shiner Bock', 'Austin Beerworks', 'Independence Brewing'],
        wine: true,
        cocktails: true,
        localBreweries: ['Austin Beerworks', 'Independence', 'Hops & Grain']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: 'Adjacent', price: '$10', shadedSpots: false, covered: false },
        { name: 'Overflow Lot', distance: '5 minute walk', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: { available: false, restrictions: 'No street parking' },
      alternativeTransport: {
        rideShare: 'Designated pickup/dropoff',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      { name: 'Home Plate Gate', location: 'Nolan Ryan Expressway', bestFor: ['Main entrance'], openTime: '90 minutes before first pitch', tip: 'Most amenities' },
      { name: 'Left Field Gate', location: 'Northwest corner', bestFor: ['Berm seating'], openTime: '60 minutes before first pitch' },
      { name: 'Right Field Gate', location: 'Northeast corner', bestFor: ['Rock Porch'], openTime: '60 minutes before first pitch' }
    ],

    amenities: {
      merchandise: [{ location: 'Main entrance', exclusive: ['Express gear', 'Nolan Ryan items'] }],
      firstAid: ['Behind home plate', 'Section 215'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'DellDiamond_Guest' },
      chargingStations: ['Club level'],
      kidZones: [
        { name: 'Fun Zone', location: 'Left field', activities: ['Playground', 'Rock wall', 'Speed pitch'] },
        { name: 'Splash pad', location: 'Outfield', activities: ['Water play'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Home plate', 'First base', 'Third base']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: 'Designated spaces near entrances'
    },

    gameDay: {
      tips: [
        { title: 'Arrive early', description: 'Parking fills up quickly', category: 'arrival' },
        { title: 'Texas heat', description: 'Bring sunscreen and water', category: 'weather' },
        { title: 'Family activities', description: 'Kids zone opens early', category: 'family' },
        { title: 'Nolan Ryan history', description: 'Check out the displays', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before',
        battingPractice: 'Select games',
        firstPitch: '7:05 PM weekdays, 6:05 PM weekends',
        rushHours: ['6:30-7:00 PM']
      },
      security: {
        allowedBags: 'Small bags and purses',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Drones'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },

    neighborhood: {
      name: 'Round Rock',
      description: 'Growing Austin suburb with tech presence',
      beforeGame: ['Downtown Round Rock', 'La Frontera shopping'],
      afterGame: ['Main Street bars', 'Downtown Round Rock'],
      radius: '2 miles'
    },

    transportation: {
      address: '3400 E Palm Valley Blvd, Round Rock, TX 78665',
      publicTransit: {
        bus: [{ routes: ['Limited service'], stops: ['Dell Diamond'] }]
      },
      driving: {
        majorRoutes: ['I-35', 'TX-45', 'US-79'],
        typicalTraffic: 'Heavy on I-35',
        bestApproach: 'From TX-45 or US-79 to avoid I-35'
      },
      rideShare: {
        pickupZone: 'Designated area near main gate',
        dropoffZone: 'Main entrance',
        surgePricing: '2-3x after games'
      }
    },

    history: {
      timeline: [
        { year: 2000, event: 'Dell Diamond opens' },
        { year: 2005, event: 'Becomes Astros affiliate' },
        { year: 2011, event: 'Rangers affiliation begins' },
        { year: 2019, event: 'Returns to Rangers system' }
      ],
      notableGames: [
        { date: '2000-04-16', description: 'First game at Dell Diamond' },
        { date: '2014-09-04', description: 'Roger Clemens starts for Express' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly Texas baseball',
      bestExperiences: ['Pool party', 'Rock wall climbing', 'Fireworks nights'],
      traditions: ['Train whistle home runs', 'Dancing groundskeepers'],
      mascot: { name: 'Spike', description: 'Dog mascot' }
    },

    proTips: {
      insiderTips: [
        'Book pool area well in advance',
        'Berm great for families',
        'United Heritage Center best for heat'
      ],
      avoidThese: [
        'I-35 at rush hour',
        'Sections 106-112 for day games',
        'Limited shade in outfield'
      ],
      hiddenGems: [
        'Nolan Ryan exhibit',
        'Kids run bases postgame',
        'Sunday family specials'
      ],
      photoSpots: [
        'Rock wall',
        'Pool area',
        'Nolan Ryan statue'
      ],
      bestValue: [
        'Berm seating',
        'Thursday specials',
        'Family four-packs'
      ]
    }
  },

  'sugar-land-space-cowboys': {
    id: 'sugar-land-space-cowboys',
    name: 'Constellation Field',
    team: 'Sugar Land Space Cowboys',
    opened: 2012,
    capacity: 7500,

    overview: {
      description: 'Constellation Field is home to the Sugar Land Space Cowboys, Triple-A affiliate of the Houston Astros. Modern facility in Houston suburbs.',
      highlights: ['Houston suburb location', 'Space theme', 'Family entertainment'],
      uniqueFeatures: ['Party plaza', 'Kids zone', 'Budweiser Bow Tie Bar'],
      renovations: [{ year: 2021, description: 'Rebranding to Space Cowboys' }]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 101-105', 'Sections 116-120'],
        afternoon: ['Sections 110-116', 'Club seats'],
        evening: ['Sections 101-107', 'Upper boxes']
      },
      coveredSeating: ['Club seats', 'Suites'],
      shadeTips: [
        'First base side for afternoon shade',
        'Houston humidity makes shade crucial',
        'Club seats offer best protection'
      ],
      sunProtection: {
        shadedConcourses: ['Club level', 'Suite level'],
        indoorAreas: ['Club lounge', 'Team store']
      },
      worstSunExposure: ['Sections 106-109', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 73, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm and humid', shadeTip: 'Check radar for storms' },
        { month: 'May', avgTemp: 79, avgHumidity: 72, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Afternoon storms possible' },
        { month: 'June', avgTemp: 84, avgHumidity: 72, rainChance: 25, typicalConditions: 'Very hot and humid', shadeTip: 'Seek AC areas' },
        { month: 'July', avgTemp: 87, avgHumidity: 70, rainChance: 25, typicalConditions: 'Peak summer heat', shadeTip: 'Night games only' },
        { month: 'August', avgTemp: 87, avgHumidity: 70, rainChance: 25, typicalConditions: 'Continued heat', shadeTip: 'Hydrate frequently' },
        { month: 'September', avgTemp: 82, avgHumidity: 70, rainChance: 25, typicalConditions: 'Still hot', shadeTip: 'Heat persists' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [{ name: 'Premium Club', perks: ['Indoor/outdoor seating', 'All-inclusive'], access: 'Club ticket' }],
        suites: { levels: ['Suite Level'], amenities: ['Climate control', 'Private restroom', 'Catering'] }
      },
      budgetOptions: ['Outfield berm', 'Upper corners'],
      familySections: ['Sections 114-116'],
      standingRoom: ['Party plaza', 'Budweiser Bow Tie Bar'],
      partyAreas: [
        { name: 'Party Plaza', capacity: '200', amenities: ['Picnic area', 'Bar access'] },
        { name: 'Budweiser Bow Tie Bar', capacity: '100', amenities: ['Full bar', 'Standing room'] }
      ],
      tips: [
        { section: 'Sections 110-112', tip: 'Best shade and value', category: 'shade' },
        { section: 'Berm', tip: 'Perfect for families with young kids', category: 'family' },
        { section: 'Club seats', tip: 'AC relief from humidity', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Space Burger', 'Cosmic Nachos'],
      local: ['Texas BBQ', 'Tex-Mex', 'Kolaches'],
      healthy: ['Salads', 'Fresh fruit', 'Grilled options'],
      vegetarian: ['Veggie wraps', 'Salads'],
      kidsFriendly: ['Cosmic dogs', 'Dippin Dots', 'Popcorn'],
      alcohol: {
        beer: ['Saint Arnold', 'Karbach', '8th Wonder'],
        wine: true,
        cocktails: true,
        localBreweries: ['Saint Arnold', 'Karbach', 'Southern Star']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: 'Adjacent', price: '$5', shadedSpots: false, covered: false },
        { name: 'VIP Lot', distance: 'Front entrance', price: '$10', shadedSpots: false, covered: false }
      ],
      streetParking: { available: false, restrictions: 'No street parking' },
      alternativeTransport: {
        rideShare: 'Designated zones',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      { name: 'Main Gate', location: 'Highway 6', bestFor: ['All sections'], openTime: '90 minutes before first pitch', tip: 'Only entrance' }
    ],

    amenities: {
      merchandise: [{ location: 'Main concourse', exclusive: ['Space Cowboys gear'] }],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance', 'Concourse'],
      wifi: { available: true, network: 'SpaceCowboys_WiFi' },
      kidZones: [{ name: 'Space Zone', location: 'Left field', activities: ['Playground', 'Games'] }]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All areas accessible'],
        entrance: 'Main gate ADA accessible',
        elevators: ['Club level', 'Suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated spaces near entrance'
    },

    gameDay: {
      tips: [
        { title: 'Beat the heat', description: 'Arrive early for shaded parking', category: 'arrival' },
        { title: 'Houston humidity', description: 'Dress light and hydrate', category: 'weather' },
        { title: 'Family night', description: 'Tuesday specials for families', category: 'family' },
        { title: 'Space theme', description: 'Look for astronaut appearances', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before',
        firstPitch: '7:05 PM',
        rushHours: ['6:30-7:00 PM']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Umbrellas'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Sugar Land',
      description: 'Planned Houston suburb',
      beforeGame: ['Sugar Land Town Square', 'First Colony Mall area'],
      afterGame: ['Town Square restaurants', 'Local bars'],
      radius: '2 miles'
    },

    transportation: {
      address: '1 Stadium Dr, Sugar Land, TX 77498',
      publicTransit: {
        bus: [{ routes: ['Limited transit'], stops: ['Town Square'] }]
      },
      driving: {
        majorRoutes: ['US-59/I-69', 'Highway 6', 'US-90A'],
        typicalTraffic: 'Moderate, heavier from Houston',
        bestApproach: 'Highway 6 from US-59'
      },
      rideShare: {
        pickupZone: 'Main entrance',
        dropoffZone: 'Main entrance',
        surgePricing: '1.5-2x after games'
      }
    },

    history: {
      timeline: [
        { year: 2012, event: 'Stadium opens as Skeeters home' },
        { year: 2021, event: 'Becomes Astros Triple-A affiliate' },
        { year: 2021, event: 'Rebrand to Space Cowboys' }
      ]
    },

    fanExperience: {
      atmosphere: 'Family-friendly with space theme',
      bestExperiences: ['Space-themed promotions', 'Fireworks nights', 'Kids activities'],
      traditions: ['Launch sequence', 'Astronaut races'],
      mascot: { name: 'Orion', description: 'Space cowboy mascot' }
    },

    proTips: {
      insiderTips: [
        'Club seats worth it for heat',
        'Tuesday family deals',
        'Arrive early for promotions'
      ],
      avoidThese: [
        'Sections 106-109 during day',
        'US-59 at rush hour',
        'Limited shade in general'
      ],
      hiddenGems: [
        'Space-themed photo ops',
        'Kids zone activities',
        'Budweiser Bow Tie Bar views'
      ],
      photoSpots: [
        'Space Cowboys logo',
        'Mascot meet and greet',
        'Sunset from berm'
      ],
      bestValue: [
        'Berm seating',
        'Tuesday family nights',
        'Group packages'
      ]
    }
  },

  'tacoma-rainiers': {
    id: 'tacoma-rainiers',
    name: 'Cheney Stadium',
    team: 'Tacoma Rainiers',
    opened: 1960,
    capacity: 6500,

    overview: {
      description: 'Cheney Stadium is home to the Tacoma Rainiers, Triple-A affiliate of the Seattle Mariners. Historic ballpark with Puget Sound views.',
      highlights: ['Mount Rainier views', 'Historic ballpark', 'Puget Sound location'],
      uniqueFeatures: ['The Sandlot', 'Beer garden', 'Kids play area'],
      renovations: [
        { year: 2011, description: 'Major renovation and modernization' },
        { year: 2019, description: 'New video board' }
      ],
      previousNames: ['Tacoma Tigers Stadium']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 1-5', 'Sections 17-20'],
        afternoon: ['Sections 11-17', 'Press Level'],
        evening: ['Sections 1-7', 'Covered seating']
      },
      coveredSeating: ['Press Level suites', 'Club seats'],
      shadeTips: [
        'Pacific Northwest means less sun concern',
        'Third base side for afternoon games',
        'Evening marine layer provides relief'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse partially covered'],
        indoorAreas: ['Club area', 'Team store']
      },
      worstSunExposure: ['Sections 6-10', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 53, avgHumidity: 70, rainChance: 40, typicalConditions: 'Cool and possibly wet', shadeTip: 'Bring rain gear' },
        { month: 'May', avgTemp: 59, avgHumidity: 65, rainChance: 30, typicalConditions: 'Mild with occasional rain', shadeTip: 'Layers recommended' },
        { month: 'June', avgTemp: 64, avgHumidity: 60, rainChance: 25, typicalConditions: 'Pleasant early summer', shadeTip: 'Perfect baseball weather' },
        { month: 'July', avgTemp: 69, avgHumidity: 55, rainChance: 15, typicalConditions: 'Warm and dry', shadeTip: 'Ideal conditions' },
        { month: 'August', avgTemp: 69, avgHumidity: 55, rainChance: 15, typicalConditions: 'Peak summer', shadeTip: 'Best weather of season' },
        { month: 'September', avgTemp: 63, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Evening games can be cool' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [{ name: 'Stadium Club', perks: ['Indoor seating', 'Full bar'], access: 'Club ticket' }],
        suites: { levels: ['Press Level'], amenities: ['Private restroom', 'Catering'] }
      },
      budgetOptions: ['GA berm', 'Upper corners'],
      familySections: ['Sections 14-16'],
      standingRoom: ['Beer garden', 'The Sandlot'],
      partyAreas: [
        { name: 'The Sandlot', capacity: '150', amenities: ['Picnic area', 'Kids play area'] },
        { name: 'Beer Garden', capacity: '100', amenities: ['Craft beers', 'Standing tables'] }
      ],
      tips: [
        { section: 'Sections 11-13', tip: 'Best views of Mount Rainier', category: 'view' },
        { section: 'The Sandlot', tip: 'Perfect for families', category: 'family' },
        { section: 'Sections 1-3', tip: 'Close to beer garden', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Rainiers Red Hot', 'Ivar fish & chips'],
      local: ['Pacific Northwest seafood', 'Local craft beers', 'Garlic fries'],
      healthy: ['Salads', 'Grilled salmon', 'Fresh fruit'],
      vegetarian: ['Veggie dogs', 'Salads', 'Hummus plates'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Ice cream'],
      alcohol: {
        beer: ['Rainier Beer', 'Georgetown Brewing', 'Harmon Brewing'],
        wine: true,
        cocktails: false,
        localBreweries: ['Harmon', 'Georgetown', '7 Seas']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: 'Adjacent', price: 'Free', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '3 minute walk', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: { available: true, restrictions: 'Limited', tip: 'Free but fills quickly' },
      alternativeTransport: {
        publicTransit: ['Pierce Transit buses'],
        rideShare: 'Designated zones',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      { name: 'Main Gate', location: 'South 19th Street', bestFor: ['All sections'], openTime: '90 minutes before first pitch', tip: 'Only public entrance' }
    ],

    amenities: {
      merchandise: [{ location: 'Main concourse', exclusive: ['Rainiers gear', 'Retro items'] }],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: true, network: 'Rainiers_WiFi' },
      kidZones: [{ name: 'Kids Zone', location: 'The Sandlot', activities: ['Playground', 'Wiffle ball'] }]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All main concourse sections'],
        entrance: 'Main gate ADA accessible',
        elevators: ['Press level elevator']
      },
      assistiveListening: true,
      signageAndBraille: false,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Main concourse'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Designated spaces near entrance'
    },

    gameDay: {
      tips: [
        { title: 'Free parking', description: 'Arrive early to get close spots', category: 'arrival' },
        { title: 'Weather', description: 'Bring layers, can be cool', category: 'weather' },
        { title: 'Mount Rainier', description: 'Best views from third base side', category: 'experience' },
        { title: 'Local beers', description: 'Try the beer garden', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before',
        firstPitch: '7:05 PM weekdays, 6:05 PM weekends',
        rushHours: ['6:30-7:00 PM']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside alcohol', 'Weapons', 'Umbrellas'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Tacoma',
      description: 'Historic port city south of Seattle',
      beforeGame: ['Engine House No. 9', 'Tacoma Brewing'],
      afterGame: ['6th Avenue bars', 'Downtown Tacoma'],
      radius: '1 mile'
    },

    transportation: {
      address: '2502 S Tyler St, Tacoma, WA 98405',
      publicTransit: {
        bus: [{ routes: ['Pierce Transit Route 1'], stops: ['19th & Tyler'] }]
      },
      driving: {
        majorRoutes: ['I-5', 'Highway 16', 'I-705'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'From I-5, take Highway 16 west'
      },
      rideShare: {
        pickupZone: 'Main entrance',
        dropoffZone: 'South 19th Street',
        surgePricing: 'Minimal surge pricing'
      }
    },

    history: {
      timeline: [
        { year: 1960, event: 'Stadium opens' },
        { year: 1995, event: 'Becomes Mariners affiliate' },
        { year: 2011, event: 'Major renovation completed' }
      ],
      notableGames: [
        { date: '1960-04-16', description: 'First game at Cheney Stadium' }
      ],
      traditions: [
        { name: 'R Bar', description: 'Celebrate Rainiers home runs' }
      ]
    },

    fanExperience: {
      atmosphere: 'Laid-back Pacific Northwest vibe',
      bestExperiences: ['Mount Rainier views', 'Beer garden', 'Fireworks nights'],
      traditions: ['We R Tacoma', 'Racing food items'],
      mascot: { name: 'Rhubarb', description: 'Reindeer mascot' }
    },

    proTips: {
      insiderTips: [
        'Free parking is huge plus',
        'Beer garden has best selection',
        'The Sandlot great for families'
      ],
      avoidThese: [
        'Limited concessions',
        'Can be chilly at night',
        'Older facility limitations'
      ],
      hiddenGems: [
        'Mount Rainier views at sunset',
        'Historic stadium tour',
        'Kids wiffle ball field'
      ],
      photoSpots: [
        'Mount Rainier backdrop',
        'Historic entrance',
        'Beer garden atmosphere'
      ],
      bestValue: [
        'Free parking',
        'Berm seating',
        'Family deals'
      ]
    }
  }
};
