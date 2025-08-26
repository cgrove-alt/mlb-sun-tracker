import { StadiumGuide } from '../stadiumGuides';
import { aaaStadiumGuides2 } from './aaaStadiumGuides2';
import { aaaStadiumGuides3 } from './aaaStadiumGuides3';
import { aaaStadiumGuides4 } from './aaaStadiumGuides4';
import { aaaStadiumGuides5 } from './aaaStadiumGuides5';
import { aaaStadiumGuides6 } from './aaaStadiumGuides6';

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
  ...aaaStadiumGuides2,
  ...aaaStadiumGuides3,
  ...aaaStadiumGuides4,
  ...aaaStadiumGuides5,
  ...aaaStadiumGuides6
};