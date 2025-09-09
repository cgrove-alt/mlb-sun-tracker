import { StadiumGuide } from '../stadiumGuides';

export const mlbStadiumGuidesExtended: Record<string, StadiumGuide> = {
  'guardians': {
    id: 'guardians',
    name: 'Progressive Field',
    team: 'Cleveland Guardians',
    opened: 1994,
    capacity: 34830,
    overview: {
      description: 'Progressive Field, known as "The Jake" from its previous name Jacobs Field, is a retro-modern ballpark in downtown Cleveland. Famous for its intimate atmosphere and the iconic 19-foot left field wall, it offers stunning views of the Cleveland skyline.',
      highlights: [
        'Intimate downtown ballpark atmosphere',
        '19-foot Mini Green Monster in left field',
        'Heritage Park celebrating team history',
        'Kids Clubhouse play area'
      ],
      uniqueFeatures: [
        'Toothbrush-shaped light towers',
        'Bob Feller statue at Gate C',
        'The Corner Bar in right field',
        'Cleveland skyline views from upper deck'
      ],
      renovations: [
        { year: 2015, description: 'Club renovations and new scoreboard' },
        { year: 2016, description: 'Bullpen and bar area additions' },
        { year: 2023, description: 'Upper deck improvements' }
      ],
      previousNames: ['Jacobs Field (1994-2007)']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper Box 451-465', 'Upper Reserved 501-515', 'Club Seats 1-15'],
        afternoon: ['Bleachers 181-187', 'Upper Box 431-445', 'Club Level west side'],
        evening: ['Most sections after 5:30 PM', 'Third base side', 'Upper deck']
      },
      coveredSeating: ['Club Level sections', 'Upper deck under overhang rows'],
      shadeTips: [
        'Third base side gets afternoon shade first',
        'Upper deck overhang provides coverage',
        'Avoid bleachers for hot day games',
        'Club level has best shade coverage'
      ],
      sunProtection: {
        sunscreenStations: ['Section 130', 'Section 309', 'Section 545'],
        shadedConcourses: ['All concourse areas', 'Club level'],
        indoorAreas: ['Team Shop', 'Heritage Park', 'Club Lounge']
      },
      worstSunExposure: ['Bleachers 101-117', 'Lower Box 130-145', 'Field Box sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cool and unpredictable', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 65, avgHumidity: 65, rainChance: 20, typicalConditions: 'Mild spring weather', shadeTip: 'Third base side for afternoon' },
        { month: 'June', avgTemp: 75, avgHumidity: 65, rainChance: 15, typicalConditions: 'Warming up', shadeTip: 'Upper deck recommended' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 15, typicalConditions: 'Hot and humid', shadeTip: 'Club level or upper deck essential' },
        { month: 'August', avgTemp: 80, avgHumidity: 70, rainChance: 15, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 72, avgHumidity: 65, rainChance: 20, typicalConditions: 'Pleasant fall weather', shadeTip: 'Most sections comfortable' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Terrace Club', perks: ['Climate controlled', 'All-inclusive food', 'Private bar'], access: 'Behind home plate' },
          { name: 'Discount Drug Mart Club', perks: ['Padded seats', 'Waiter service', 'Private entrance'], access: 'Third base side' }
        ],
        suites: {
          levels: ['Suite Level between Lower and Upper decks'],
          amenities: ['Private restrooms', 'HDTV', 'Catering options', 'Climate control']
        },
        specialAreas: [
          { name: 'The Corner Bar', description: 'Right field bar with field views', capacity: 200 },
          { name: 'District Ticket Window', description: 'Standing room bar area' }
        ]
      },
      budgetOptions: ['Upper Reserved 501-565', 'Bleachers', 'Upper Box corners'],
      familySections: ['Family Deck sections', 'Kids Clubhouse area'],
      standingRoom: ['The Corner Bar', 'District Ticket Window'],
      partyAreas: [
        { name: 'Budweiser Bow Wow Seats', capacity: '75', amenities: ['Group seating', 'All-inclusive food'] },
        { name: 'Sugardale Club', description: 'Left field group area', capacity: '150' }
      ],
      tips: [
        { section: 'Club 1-20', tip: 'Best shade and amenities combination', category: 'shade' },
        { section: 'Upper Box 531-545', tip: 'Great value with skyline views', category: 'value' },
        { section: 'Lower Box 158-172', tip: 'Close to action but sunny', category: 'view' },
        { section: 'Bleachers 101-117', tip: 'Avoid for day games - full sun', category: 'shade' }
      ]
    },
    concessions: {
      signature: ['Ballpark Mustard', 'Sugardale Hot Dog', 'Slider Dog', 'Bertman Ballpark Mustard'],
      local: ['Great Lakes Brewing', 'Momocho Tacos', 'Barrio Tacos', 'Happy Dog'],
      healthy: ['Fresh salads', 'Veggie wraps', 'Fruit cups'],
      vegetarian: ['Black bean burger', 'Veggie tacos', 'Hummus plate'],
      glutenFree: ['GF buns available', 'Nachos with corn chips'],
      kidsFriendly: ['Kids meals', 'Dippin Dots', 'Cotton candy'],
      alcohol: {
        beer: ['Great Lakes', 'Budweiser', 'Miller Lite', 'Platform Beer'],
        wine: true,
        cocktails: true,
        localBreweries: ['Great Lakes', 'Platform', 'Market Garden', 'Masthead']
      }
    },
    parking: {
      lots: [
        { name: 'Gateway East Garage', distance: 'Adjacent', price: '$25', shadedSpots: true, covered: true, tip: 'Covered and closest' },
        { name: 'Prospect Garage', distance: '5 min walk', price: '$15', shadedSpots: true, covered: true, tip: 'Good value covered option' },
        { name: 'Willard Garage', distance: '8 min walk', price: '$10', shadedSpots: false, covered: false, tip: 'Budget option' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Meters until 6 PM',
        tip: 'Check ParkCLE app for available spots'
      },
      alternativeTransport: {
        publicTransit: ['RTA Red/Blue/Green Lines to Tower City', 'Walkway from Tower City'],
        rideShare: 'Designated zones on Carnegie Ave',
        bicycle: 'Bike racks at all gates'
      }
    },
    gates: [
      { name: 'Gate A', location: 'Home plate', bestFor: ['Lower Box', 'Field Box'], openTime: '90 minutes before', tip: 'Main entrance, busiest' },
      { name: 'Gate B', location: 'First base', bestFor: ['Right field', 'Bleachers'], openTime: '90 minutes before' },
      { name: 'Gate C', location: 'Center field', bestFor: ['Bleachers', 'Standing room'], openTime: '90 minutes before', tip: 'Bob Feller statue here' },
      { name: 'Gate D', location: 'Third base', bestFor: ['Left field', 'Upper deck'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Main Team Shop - Gate A', exclusive: ['Game-used items', 'Custom jerseys'] },
        { location: 'Upper deck shops', exclusive: ['Clearance items'] }
      ],
      firstAid: ['Section 127', 'Section 309', 'Section 545'],
      babyChanging: ['All family restrooms', 'Kids Clubhouse'],
      nursingRooms: ['Guest Services by Section 153'],
      atms: ['Near all main gates', 'Club level', 'Upper deck'],
      wifi: { available: true, network: 'Progressive_Field_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Club level', 'The Corner Bar'],
      kidZones: [
        { name: 'Kids Clubhouse', location: 'Center field', activities: ['Playground', 'Games', 'Kids Run the Bases on Sundays'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Gate A', 'Gate C', 'Club level access']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main concession stands'],
      parkingSpaces: 'Gateway East Garage - Level 1'
    },
    transportation: {
      address: '2401 Ontario Street, Cleveland, OH 44115',
      publicTransit: ['RTA Rapid Transit', 'Downtown trolleys'],
      taxi: 'Taxi stand at Ontario Street',
      rideshare: 'Carnegie Avenue pickup zone'
    },
    gameDay: {
      parkingLots: {
        open: '2 hours before first pitch',
        recommendedArrival: '90 minutes early for best spots'
      },
      gatesOpen: '90 minutes before first pitch (weekdays), 2 hours (weekends)',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '2.5-3 hours',
      rushHours: ['30 minutes before first pitch', 'End of game'],
      tips: [
        { title: 'Early Arrival', description: 'Gates open early on weekends for BP viewing', category: 'arrival' },
        { title: 'Sun Protection', description: 'Lower level gets intense sun until 5 PM', category: 'shade' },
        { title: 'Local Eats', description: 'Try the Stadium Mustard - a Cleveland tradition', category: 'food' },
        { title: 'Avoid Traffic', description: 'RTA train avoids downtown traffic completely', category: 'departure' }
      ],
      typicalSchedule: {
        gatesOpen: '5:30 PM for 7:10 PM games',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        peakConcessionLines: '6:30-7:00 PM'
      }
    },
    neighborhood: {
      name: 'Gateway District',
      description: 'Downtown entertainment district with restaurants, bars, and Rocket Mortgage FieldHouse nearby',
      beforeGame: ['Thirsty Parrot', 'Wilbert\'s Food & Music', 'Harry Buffalo', 'Flannery\'s Pub'],
      afterGame: ['East 4th Street restaurants', 'Playhouse Square', 'Jack Cleveland Casino'],
      radius: '0.5 miles of venues'
    },
    proTips: {
      insiderTips: [
        'The Corner Bar has the best craft beer selection',
        'Heritage Park is free to explore on non-game days',
        'Dollar Dog nights are extremely popular - arrive early',
        'Kids Run the Bases after Sunday games'
      ],
      bestValue: [
        'Upper Reserved corners offer great views for less',
        'Bleacher seats are cheapest with decent sightlines',
        'Tuesday games often have promotions'
      ],
      hiddenGems: [
        'The Terrace Club is all-inclusive and often available day-of',
        'Standing room at The Corner has great views',
        'Gate C has shortest lines'
      ],
      avoidThese: [
        'Bleachers on hot day games',
        'Parking on Ontario Street (expensive)',
        'Concessions during 7th inning stretch'
      ]
    },
    history: {
      timeline: [
        { year: 1994, event: 'Stadium opens as Jacobs Field' },
        { year: 1995, event: 'Hosts MLB All-Star Game' },
        { year: 1997, event: 'World Series Games 3, 4, and 5' },
        { year: 2008, event: 'Renamed Progressive Field' },
        { year: 2019, event: 'Hosts MLB All-Star Game again' }
      ],
      traditions: [
        { name: 'John Adams Drum', description: 'Fan drummer in bleachers since 1973' },
        { name: 'Slider', description: 'Pink furry mascot debuted in 1990' }
      ],
      retired: [
        { number: '3', player: 'Earl Averill', year: 1975 },
        { number: '5', player: 'Lou Boudreau', year: 1970 },
        { number: '14', player: 'Larry Doby', year: 1994 },
        { number: '18', player: 'Mel Harder', year: 1990 },
        { number: '19', player: 'Bob Feller', year: 1957 },
        { number: '20', player: 'Frank Robinson', year: 1975 },
        { number: '21', player: 'Bob Lemon', year: 1998 },
        { number: '455', player: 'The Fans', year: 2001 }
      ]
    }
  },

  'mariners': {
    id: 'mariners',
    name: 'T-Mobile Park',
    team: 'Seattle Mariners',
    opened: 1999,
    capacity: 47929,
    overview: {
      description: 'T-Mobile Park, with its retractable roof and stunning views of downtown Seattle and Puget Sound, is considered one of the most beautiful ballparks in baseball. The park features a unique asymmetrical design and the famous Hit It Here Cafe in right field.',
      highlights: [
        'Retractable roof for Seattle weather',
        'Views of downtown Seattle skyline',
        'Puget Sound glimpses from upper deck',
        'Edgar\'s Cantina and Hit It Here Cafe'
      ],
      uniqueFeatures: [
        'Retractable roof (covers but doesn\'t enclose)',
        'The Pen market and gathering space',
        'Lookout Landing in center field',
        'Manual scoreboard in left field'
      ],
      renovations: [
        { year: 2011, description: 'LED lighting and new video board' },
        { year: 2013, description: 'Edgar\'s Cantina added' },
        { year: 2024, description: 'Seating and concession upgrades' }
      ],
      previousNames: ['Safeco Field (1999-2018)']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Terrace Club 240-246', 'Upper 320-330', 'Diamond Club'],
        afternoon: ['View Level 331-347', 'Main Level 140-150', 'Upper deck third base'],
        evening: ['Most sections after 6 PM', 'First base side best', 'Club level']
      },
      coveredSeating: ['All seats protected when roof closed', 'Terrace Club always covered'],
      shadeTips: [
        'Roof provides shade when closed',
        'Third base side gets afternoon shade',
        'Upper deck has more overhead coverage',
        'Check roof status before games'
      ],
      sunProtection: {
        sunscreenStations: ['Section 108', 'Section 233', 'Section 329'],
        shadedConcourses: ['All concourses covered', 'The Pen area'],
        indoorAreas: ['Team Store', 'Hit It Here Cafe', 'Press Club']
      },
      worstSunExposure: ['Bleachers 182-194 (when roof open)', 'Field Level 108-121', 'Lower Box first base'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 70, rainChance: 40, typicalConditions: 'Cool and often wet', shadeTip: 'Roof usually closed' },
        { month: 'May', avgTemp: 63, avgHumidity: 65, rainChance: 30, typicalConditions: 'Mild with less rain', shadeTip: 'Third base for afternoon' },
        { month: 'June', avgTemp: 68, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant early summer', shadeTip: 'Upper deck best' },
        { month: 'July', avgTemp: 75, avgHumidity: 60, rainChance: 10, typicalConditions: 'Perfect baseball weather', shadeTip: 'Any covered section' },
        { month: 'August', avgTemp: 76, avgHumidity: 60, rainChance: 10, typicalConditions: 'Warm and dry', shadeTip: 'Seek shade after 2 PM' },
        { month: 'September', avgTemp: 69, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Most sections comfortable' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive dining', 'Premium bar', 'Padded seats'], access: 'Behind home plate' },
          { name: 'Terrace Club', perks: ['Indoor/outdoor seating', 'Buffet', 'Private bar'], access: 'Suite level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private entrance', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'The Pen', description: 'Center field social space', capacity: 300 },
          { name: 'Edgar\'s Cantina', description: 'Left field bar and restaurant' }
        ]
      },
      budgetOptions: ['View Level 331-347', 'Bleachers', 'View Box corners'],
      familySections: ['Family Section 315', 'Kids Area by Section 107'],
      standingRoom: ['The Pen', 'Lookout Landing', 'Edgar\'s Cantina'],
      partyAreas: [
        { name: 'The Terrace Club', capacity: '200', amenities: ['Buffet', 'Private space'] },
        { name: 'All-Star Club', description: 'Right field group area', capacity: '100' }
      ],
      tips: [
        { section: 'Diamond Club', tip: 'All-inclusive luxury behind home plate', category: 'experience' },
        { section: 'View 329-331', tip: 'Best value with skyline views', category: 'value' },
        { section: 'Field 147-150', tip: 'Great shade and close to action', category: 'shade' },
        { section: 'Bleachers 182-190', tip: 'Fun atmosphere but sunny when roof open', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Ivar\'s Fish & Chips', 'Garlic Fries', 'Mariners Dog', 'Din Tai Fung Dumplings'],
      local: ['Pike Place Market stands', 'Ezell\'s Fried Chicken', 'Ballard Pizza', 'Holy Smoke BBQ'],
      healthy: ['Evergreens Salads', 'Fresh fruit', 'Veggie options'],
      vegetarian: ['Impossible Burger', 'Field Roast veggie dog', 'Vegetarian nachos'],
      glutenFree: ['GF beer and buns available', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Dippin Dots', 'Popcorn'],
      alcohol: {
        beer: ['Pyramid', 'Elysian', 'Mac & Jack\'s', 'Fremont Brewing'],
        wine: true,
        cocktails: true,
        localBreweries: ['Elysian', 'Fremont', 'Pike Brewing', 'Georgetown']
      }
    },
    parking: {
      lots: [
        { name: 'T-Mobile Park Garage', distance: 'Adjacent', price: '$35', shadedSpots: true, covered: true, tip: 'Most convenient but pricey' },
        { name: 'CenturyLink Garage', distance: '5 min walk', price: '$20', shadedSpots: true, covered: true, tip: 'Good alternative' },
        { name: 'Union Station Lot', distance: '10 min walk', price: '$15', shadedSpots: false, covered: false, tip: 'Budget option' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited and metered',
        tip: 'Very difficult on game days'
      },
      alternativeTransport: {
        publicTransit: ['Link Light Rail to Stadium Station', 'Multiple bus routes', 'Sounder Train on some games'],
        rideShare: 'Occidental Ave S pickup/dropoff',
        bicycle: 'Bike racks at all entrances'
      }
    },
    gates: [
      { name: 'Home Plate', location: 'Behind home plate', bestFor: ['Diamond Club', 'Main Level'], openTime: '2 hours before', tip: 'Main entrance' },
      { name: 'Left Field', location: 'Edgar Martinez Dr', bestFor: ['Bleachers', 'The Pen'], openTime: '90 minutes before' },
      { name: 'Center Field', location: 'Center field', bestFor: ['The Pen', 'Bleachers'], openTime: '90 minutes before', tip: 'Best for The Pen' }
    ],
    amenities: {
      merchandise: [
        { location: 'Main Team Store - Home Plate', exclusive: ['Custom jerseys', 'Authentics'] },
        { location: 'The Pen Shop', exclusive: ['Unique designs'] }
      ],
      firstAid: ['Section 128', 'Section 218', 'Section 329'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services Section 128'],
      atms: ['All gate entrances', 'Main concourse'],
      wifi: { available: true, network: 'T-Mobile_Park_Free', freeZones: ['All areas'] },
      chargingStations: ['The Pen', 'Terrace Club'],
      kidZones: [
        { name: 'Moose Den', location: 'Main Level', activities: ['Play area', 'Moose mascot visits'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have accessible seating'],
        entrance: 'All gates accessible',
        elevators: ['Home Plate', 'Left Field', 'Right Field']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'T-Mobile Park Garage'
    },
    transportation: {
      address: '1250 1st Avenue S, Seattle, WA 98134',
      publicTransit: ['Link Light Rail', 'King County Metro buses'],
      taxi: 'Taxi stands on 1st Ave',
      rideshare: 'Occidental Ave S'
    },
    gameDay: {
      parkingLots: {
        open: '2.5 hours before first pitch',
        recommendedArrival: '90 minutes early'
      },
      gatesOpen: '2 hours before first pitch',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '3 hours',
      rushHours: ['45 minutes before first pitch', 'Post-game'],
      tips: [
        { title: 'Take Light Rail', description: 'Avoid parking hassles with Link Light Rail', category: 'arrival' },
        { title: 'Roof Status', description: 'Check if roof is open/closed before dressing', category: 'weather' },
        { title: 'Local Food', description: 'Don\'t miss Ivar\'s fish & chips', category: 'food' },
        { title: 'Early Entry', description: 'The Pen opens when gates open', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '5:10 PM for 7:10 PM games',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        peakConcessionLines: '6:30-7:00 PM'
      }
    },
    neighborhood: {
      name: 'SoDo (South of Downtown)',
      description: 'Industrial area transforming into entertainment district, near Pioneer Square',
      beforeGame: ['Pyramid Alehouse', 'Henry\'s Tavern', 'Quality Athletics', 'Hooverville Bar'],
      afterGame: ['Pioneer Square bars', 'International District restaurants', 'Capitol Hill nightlife'],
      radius: '1 mile to Pioneer Square'
    },
    proTips: {
      insiderTips: [
        'The Pen is first-come, first-served social space',
        'Edgar\'s has the best beer selection',
        'Kids Run the Bases after Sunday games',
        'Lookout Landing has great photo ops'
      ],
      bestValue: [
        'View Level corners are cheapest with good sightlines',
        'The Pen has $5 beers before first pitch',
        'Value games on Tuesdays'
      ],
      hiddenGems: [
        'Manual scoreboard in left field',
        'Din Tai Fung dumplings at Section 141',
        'Hit It Here Cafe has best views'
      ],
      avoidThese: [
        'Parking at stadium (expensive)',
        'Bleachers when roof is open on hot days',
        'Occidental Ave after games (crowded)'
      ]
    },
    history: {
      timeline: [
        { year: 1999, event: 'Safeco Field opens' },
        { year: 2001, event: '116-win season' },
        { year: 2019, event: 'Renamed T-Mobile Park' },
        { year: 2022, event: 'First playoff appearance in 21 years' }
      ],
      traditions: [
        { name: 'Hydro Boat Race', description: 'Animated boat race on video board' },
        { name: 'Mariner Moose', description: 'Team mascot since 1990' }
      ],
      retired: [
        { number: '11', player: 'Edgar Martinez', year: 2004 },
        { number: '24', player: 'Ken Griffey Jr.', year: 2016 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    }
  },

  'marlins': {
    id: 'marlins',
    name: 'loanDepot park',
    team: 'Miami Marlins',
    opened: 2012,
    capacity: 37446,
    overview: {
      description: 'loanDepot park is a modern, retractable-roof ballpark in Miami\'s Little Havana neighborhood. Known for its contemporary art, unique home run sculpture, and air conditioning, it offers a comfortable baseball experience in South Florida\'s tropical climate.',
      highlights: [
        'Retractable roof with AC when closed',
        'Contemporary art throughout',
        'Bobblehead Museum',
        'Swimming pool in outfield'
      ],
      uniqueFeatures: [
        'Home Run Sculpture (now deactivated)',
        'Clevelander Club with pool',
        'Glass panels for outdoor feel',
        'Art deco inspired design'
      ],
      renovations: [
        { year: 2016, description: 'Removed home run sculpture' },
        { year: 2019, description: 'New color scheme and decor' },
        { year: 2021, description: 'Naming rights change to loanDepot' }
      ],
      previousNames: ['Marlins Park (2012-2020)']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['All sections (roof typically closed)', 'Vista Level', 'Club seats'],
        afternoon: ['All sections (roof typically closed)', 'Third base side if open', 'Upper deck'],
        evening: ['First base side', 'Diamond Club', 'Vista Level']
      },
      coveredSeating: ['All seats when roof closed', 'Vista Level always covered'],
      shadeTips: [
        'Roof usually closed April-September',
        'AC keeps temperature at 75°F when closed',
        'Best natural shade on third base side',
        'Glass panels can create greenhouse effect'
      ],
      sunProtection: {
        sunscreenStations: ['Section 13', 'Section 27', 'Vista Level'],
        shadedConcourses: ['All concourses covered'],
        indoorAreas: ['Entire stadium when roof closed', 'Team Store', 'Clubs']
      },
      worstSunExposure: ['Sections 1-5 when roof open', 'Clevelander seats', 'Lower level first base'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 79, avgHumidity: 75, rainChance: 20, typicalConditions: 'Warm, roof usually closed', shadeTip: 'AC keeps it comfortable' },
        { month: 'May', avgTemp: 83, avgHumidity: 75, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Roof closed for comfort' },
        { month: 'June', avgTemp: 87, avgHumidity: 80, rainChance: 45, typicalConditions: 'Rainy season begins', shadeTip: 'Indoor comfort assured' },
        { month: 'July', avgTemp: 89, avgHumidity: 80, rainChance: 50, typicalConditions: 'Peak heat and storms', shadeTip: 'AC is essential' },
        { month: 'August', avgTemp: 89, avgHumidity: 80, rainChance: 50, typicalConditions: 'Hurricane season', shadeTip: 'Always climate controlled' },
        { month: 'September', avgTemp: 87, avgHumidity: 80, rainChance: 45, typicalConditions: 'Still very hot', shadeTip: 'Roof provides relief' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Private entrance'], access: 'Behind home plate' },
          { name: 'Legends Club', perks: ['Climate controlled', 'Upscale dining', 'Private bar'], access: 'Club level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'AC']
        },
        specialAreas: [
          { name: 'Clevelander', description: 'Party area with pool', capacity: 240 },
          { name: 'DAIQUIRI BAR', description: 'Standing room bar area' }
        ]
      },
      budgetOptions: ['Vista Reserved', 'Vista Box corners', 'Upper deck outfield'],
      familySections: ['Family sections in Vista Level'],
      standingRoom: ['DAIQUIRI BAR', 'Budweiser Bowtie Bar'],
      partyAreas: [
        { name: 'Clevelander', capacity: '240', amenities: ['Pool', 'DJ', 'VIP tables'] },
        { name: 'West Plaza', description: 'Pre-game gathering space', capacity: '500' }
      ],
      tips: [
        { section: 'Diamond Club 11-19', tip: 'All-inclusive luxury experience', category: 'experience' },
        { section: 'Vista Level 301-335', tip: 'Best value with AC comfort', category: 'value' },
        { section: 'Baseline Box 20-28', tip: 'Close action, good shade', category: 'view' },
        { section: 'Clevelander', tip: 'Party atmosphere but not for baseball purists', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['305 Sausage', 'Cuban Sandwich', 'Miami Mex Nachos', 'Croqueta'],
      local: ['Versailles Cuban food', 'Pincho Factory', 'Pasta Paradise', 'Miami Brewery'],
      healthy: ['Fresh salads', 'Sushi', 'Fruit cups'],
      vegetarian: ['Veggie burger', 'Caprese sandwich', 'Veggie wraps'],
      glutenFree: ['GF options at multiple stands'],
      kidsFriendly: ['Kids meals', 'Ice cream', 'Popcorn'],
      alcohol: {
        beer: ['Miami Brewing', 'Funky Buddha', 'Corona', 'Presidente'],
        wine: true,
        cocktails: true,
        localBreweries: ['Miami Brewing', 'Funky Buddha', 'Wynwood Brewing']
      }
    },
    parking: {
      lots: [
        { name: 'Garage 1', distance: 'Adjacent', price: '$20', shadedSpots: true, covered: true, tip: 'Closest to home plate' },
        { name: 'Garage 2', distance: '3 min walk', price: '$15', shadedSpots: true, covered: true, tip: 'Good value' },
        { name: 'Lot 6', distance: '5 min walk', price: '$10', shadedSpots: false, covered: false, tip: 'Budget option' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Residential permits required',
        tip: 'Very limited, not recommended'
      },
      alternativeTransport: {
        publicTransit: ['Orange Line to Stadium Station', 'Multiple bus routes'],
        rideShare: 'NW 7th Street designated area',
        bicycle: 'Bike racks at entrances'
      }
    },
    gates: [
      { name: 'Home Plate', location: 'Behind home plate', bestFor: ['Lower bowl', 'Diamond Club'], openTime: '90 minutes before', tip: 'Main entrance' },
      { name: 'East Plaza', location: 'Right field', bestFor: ['Clevelander', 'Right field'], openTime: '90 minutes before' },
      { name: 'West Plaza', location: 'Left field', bestFor: ['Left field', 'Vista Level'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Main Team Store', exclusive: ['Authentics', 'Custom jerseys'] },
        { location: 'Vista Level stores', exclusive: ['Clearance items'] }
      ],
      firstAid: ['Section 15', 'Section 27', 'Vista Level'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services Section 13'],
      atms: ['All entrance gates', 'Club level'],
      wifi: { available: true, network: 'Marlins_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Club level', 'Vista Level'],
      kidZones: [
        { name: 'Kids Zone', location: 'Promenade Level', activities: ['Play area', 'Games'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['All levels accessible']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All stands'],
      parkingSpaces: 'Garage 1 ground level'
    },
    transportation: {
      address: '501 Marlins Way, Miami, FL 33125',
      publicTransit: ['Metrorail Orange Line', 'Metrobus routes'],
      taxi: 'Taxi stand at West Plaza',
      rideshare: 'NW 7th Street'
    },
    gameDay: {
      parkingLots: {
        open: '2 hours before first pitch',
        recommendedArrival: '60 minutes early'
      },
      gatesOpen: '90 minutes before first pitch',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '2.5-3 hours',
      rushHours: ['30 minutes before first pitch'],
      tips: [
        { title: 'AC Comfort', description: 'Dress for AC, not outdoor heat', category: 'weather' },
        { title: 'Cuban Food', description: 'Try authentic Cuban options', category: 'food' },
        { title: 'Happy Hour', description: 'Discounted drinks before first pitch', category: 'experience' },
        { title: 'Avoid Rain', description: 'Summer afternoon storms common', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '5:40 PM for 7:10 PM games',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        peakConcessionLines: '6:45-7:15 PM'
      }
    },
    neighborhood: {
      name: 'Little Havana',
      description: 'Historic Cuban neighborhood with authentic restaurants and culture',
      beforeGame: ['Ball & Chain', 'Sanguich de Miami', 'Azucar Ice Cream'],
      afterGame: ['Calle Ocho bars', 'Downtown Miami', 'Wynwood district'],
      radius: '2 miles to downtown'
    },
    proTips: {
      insiderTips: [
        'Roof is almost always closed in summer',
        'Clevelander is more party than baseball',
        'Bobblehead Museum on Promenade Level',
        'Best Cuban food at Versailles stand'
      ],
      bestValue: [
        'Vista Reserved cheapest seats',
        '$5 tickets on certain weeknights',
        'Happy hour before first pitch'
      ],
      hiddenGems: [
        'Art collection throughout stadium',
        'Taste of Miami food court',
        'West Plaza pregame activities'
      ],
      avoidThese: [
        'Driving in rush hour',
        'Clevelander if you want to watch the game',
        'Parking on street (unsafe)'
      ]
    },
    history: {
      timeline: [
        { year: 2012, event: 'Marlins Park opens' },
        { year: 2012, event: 'Hosts Miami Beach Bowl' },
        { year: 2017, event: 'Hosts World Baseball Classic' },
        { year: 2021, event: 'Renamed loanDepot park' }
      ],
      traditions: [
        { name: 'Billy the Marlin', description: 'Team mascot' },
        { name: 'Home Run Sculpture', description: 'Retired centerfield feature' }
      ],
      retired: [
        { number: '16', player: 'Jose Fernandez', year: 2017 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    }
  },

  'mets': {
    id: 'mets',
    name: 'Citi Field',
    team: 'New York Mets',
    opened: 2009,
    capacity: 42021,
    overview: {
      description: 'Citi Field in Queens is a modern classic ballpark that pays homage to Brooklyn\'s Ebbets Field. Known for its irregular outfield dimensions, the Jackie Robinson Rotunda, and extensive food options, it offers great sightlines and a more intimate feel than its predecessor.',
      highlights: [
        'Jackie Robinson Rotunda entrance',
        'Shea Bridge from old stadium',
        'Extensive food options',
        'Home Run Apple in center field'
      ],
      uniqueFeatures: [
        'Irregular outfield dimensions',
        'Mets Hall of Fame & Museum',
        'FanFest interactive area',
        'Bullpen overlook seating'
      ],
      renovations: [
        { year: 2012, description: 'Outfield walls moved in' },
        { year: 2013, description: 'Party City added' },
        { year: 2024, description: 'New LED lighting system' }
      ],
      previousNames: []
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Promenade 400-420', 'Caesar\'s Club', 'Excelsior Level third base'],
        afternoon: ['Promenade 420-436', 'Left Field Landing', 'Upper deck third base'],
        evening: ['First base side', 'Field Level 120-140', 'Pepsi Porch']
      },
      coveredSeating: ['Caesar\'s Club', 'Suites', 'Promenade overhang rows'],
      shadeTips: [
        'Third base side gets afternoon shade first',
        'Promenade level has best overhang coverage',
        'Avoid Pepsi Porch for day games',
        'Excelsior level stays cooler'
      ],
      sunProtection: {
        sunscreenStations: ['Section 126', 'Section 326', 'Section 426'],
        shadedConcourses: ['All concourse areas covered'],
        indoorAreas: ['Caesar\'s Club', 'Mets Museum', 'Team Store']
      },
      worstSunExposure: ['Pepsi Porch', 'Outfield Box 101-105', 'Field Level 106-114'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool and windy', shadeTip: 'Dress warmly' },
        { month: 'May', avgTemp: 70, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant spring', shadeTip: 'Third base for afternoon' },
        { month: 'June', avgTemp: 79, avgHumidity: 70, rainChance: 20, typicalConditions: 'Warming up', shadeTip: 'Upper deck recommended' },
        { month: 'July', avgTemp: 85, avgHumidity: 70, rainChance: 20, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential after 1 PM' },
        { month: 'August', avgTemp: 84, avgHumidity: 70, rainChance: 20, typicalConditions: 'Peak summer heat', shadeTip: 'Caesar\'s Club for AC' },
        { month: 'September', avgTemp: 76, avgHumidity: 65, rainChance: 20, typicalConditions: 'Comfortable fall', shadeTip: 'Most sections pleasant' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Delta Sky360 Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Field access'], access: 'Behind home plate' },
          { name: 'Caesar\'s Club', perks: ['Indoor/outdoor seating', 'Buffet', 'Climate controlled'], access: 'First base side' }
        ],
        suites: {
          levels: ['Sterling Level', 'Suite Level'],
          amenities: ['Private entrance', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Jim Beam Highball Club', description: 'Left field bar area', capacity: 150 },
          { name: 'Coca-Cola Corner', description: 'Right field family area' }
        ]
      },
      budgetOptions: ['Promenade Reserved', 'Excelsior corners', 'Outfield Box'],
      familySections: ['Coca-Cola Corner', 'Family Sunday sections'],
      standingRoom: ['Jim Beam Club', 'Shea Bridge'],
      partyAreas: [
        { name: 'Party City', capacity: '50', amenities: ['Private space', 'Food packages'] },
        { name: 'Left Field Landing', description: 'Group area', capacity: '75' }
      ],
      tips: [
        { section: 'Delta Sky360', tip: 'Ultimate all-inclusive experience', category: 'experience' },
        { section: 'Promenade 415-430', tip: 'Best shade value combination', category: 'shade' },
        { section: 'Excelsior 301-310', tip: 'Cheapest with good views', category: 'value' },
        { section: 'Pepsi Porch', tip: 'Fun but very sunny for day games', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Pastrami sandwich', 'Fuku chicken sandwich', 'Blue Smoke BBQ', 'Pat LaFrieda steak sandwich'],
      local: ['Shake Shack', 'Nicoletta Pizza', 'Arancini Bros', 'El Verano Taco'],
      healthy: ['Salads', 'Fresh fruit', 'Veggie options'],
      vegetarian: ['Beyond Burger', 'Veggie tacos', 'Falafel'],
      glutenFree: ['GF options at multiple stands'],
      kidsFriendly: ['Kids meals', 'Chicken tenders', 'Ice cream helmets'],
      alcohol: {
        beer: ['Blue Point', 'Brooklyn Brewery', 'Coney Island Brewing', 'Mikkeller'],
        wine: true,
        cocktails: true,
        localBreweries: ['Blue Point', 'Brooklyn', 'SingleCut', 'Big Alice']
      }
    },
    parking: {
      lots: [
        { name: 'Citi Field Lots', distance: 'Adjacent', price: '$35', shadedSpots: false, covered: false, tip: 'Multiple lots around stadium' },
        { name: 'Southfield Lot', distance: '10 min walk', price: '$35', shadedSpots: false, covered: false, tip: 'Same price, less crowded' },
        { name: 'Marina Lot', distance: '15 min walk', price: '$35', shadedSpots: false, covered: false, tip: 'Easier exit' }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking on game days',
        tip: 'Don\'t attempt street parking'
      },
      alternativeTransport: {
        publicTransit: ['7 train to Mets-Willets Point', 'LIRR to Mets-Willets Point'],
        rideShare: 'Roosevelt Ave designated area',
        bicycle: 'Bike racks available'
      }
    },
    gates: [
      { name: 'Jackie Robinson Rotunda', location: 'Home plate', bestFor: ['All sections'], openTime: '2 hours before', tip: 'Main entrance, great photo op' },
      { name: 'Bullpen Gate', location: 'Right field', bestFor: ['Right field', 'Pepsi Porch'], openTime: '90 minutes before' },
      { name: 'Left Field Gate', location: 'Left field', bestFor: ['Left field', 'Jim Beam Club'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Main Team Store - Rotunda', exclusive: ['Game-used', 'Authentics'] },
        { location: 'Bullpen Shop', exclusive: ['Clearance items'] }
      ],
      firstAid: ['Section 114', 'Section 308', 'Section 420'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services behind Section 126'],
      atms: ['All gate entrances', 'Throughout concourses'],
      wifi: { available: true, network: 'CitiField_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Caesar\'s Club', 'Delta Sky360 Club'],
      kidZones: [
        { name: 'FanFest', location: 'Center field', activities: ['Interactive games', 'Batting cage', 'Dunk tank'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have accessible seating'],
        entrance: 'All gates accessible',
        elevators: ['Rotunda', 'Left field', 'Right field']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main stands'],
      parkingSpaces: 'All lots have designated spaces'
    },
    transportation: {
      address: '41 Seaver Way, Queens, NY 11368',
      publicTransit: ['7 train express/local', 'LIRR Port Washington line'],
      taxi: 'Taxi stand at Roosevelt Ave',
      rideshare: 'Roosevelt Ave and 126th St'
    },
    gameDay: {
      parkingLots: {
        open: '2.5 hours before first pitch',
        recommendedArrival: '90 minutes early for parking'
      },
      gatesOpen: '2 hours before (Rotunda), 90 minutes (other gates)',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '3 hours',
      rushHours: ['45 minutes before first pitch', 'Post-game subway crush'],
      tips: [
        { title: 'Take the 7 Train', description: 'Parking is expensive and limited', category: 'arrival' },
        { title: 'Food Paradise', description: 'Arrive early to explore food options', category: 'food' },
        { title: 'Wind Factor', description: 'Can be very windy, dress accordingly', category: 'weather' },
        { title: 'Museum Visit', description: 'Free Mets Museum worth visiting', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '5:10 PM for 7:10 PM games',
        firstPitch: '7:10 PM weekdays, 7:10 PM Saturdays, 1:40 PM Sundays',
        peakConcessionLines: '6:30-7:00 PM'
      }
    },
    neighborhood: {
      name: 'Flushing',
      description: 'Diverse Queens neighborhood famous for authentic Asian cuisine',
      beforeGame: ['Flushing Chinatown', 'Queens Night Market (Saturdays)', 'New World Mall food court'],
      afterGame: ['Main Street Flushing bars', 'Late night Asian restaurants', 'Roosevelt Ave establishments'],
      radius: '0.5 miles to Main Street'
    },
    proTips: {
      insiderTips: [
        'Shake Shack line is always long - go early or late',
        'Pastrami sandwich is a must-try',
        'FanFest is free and great for kids',
        '7 train express saves significant time'
      ],
      bestValue: [
        'Excelsior level cheapest with decent views',
        'Student discounts available with ID',
        'Tuesday and Wednesday often have deals'
      ],
      hiddenGems: [
        'Mets Hall of Fame & Museum',
        'Shea Bridge has memorabilia',
        'Bullpen overlook unique viewing angle'
      ],
      avoidThese: [
        'Driving on weekends (parking nightmare)',
        'Pepsi Porch on hot days',
        'Leaving right at game end (subway packed)'
      ]
    },
    history: {
      timeline: [
        { year: 2009, event: 'Citi Field opens' },
        { year: 2013, event: 'Hosts MLB All-Star Game' },
        { year: 2015, event: 'World Series Games 3, 4, and 5' },
        { year: 2024, event: 'Major lighting upgrade' }
      ],
      traditions: [
        { name: 'Home Run Apple', description: 'Rises from center field after Mets homers' },
        { name: 'Mr. Met', description: 'Original mascot since 1964' },
        { name: 'Meet the Mets', description: 'Team song' }
      ],
      retired: [
        { number: '14', player: 'Gil Hodges', year: 1973 },
        { number: '16', player: 'Dwight Gooden', year: 1996 },
        { number: '17', player: 'Keith Hernandez', year: 2022 },
        { number: '18', player: 'Darryl Strawberry', year: 1996 },
        { number: '24', player: 'Willie Mays', year: 1973 },
        { number: '31', player: 'Mike Piazza', year: 2016 },
        { number: '36', player: 'Jerry Koosman', year: 2021 },
        { number: '37', player: 'Casey Stengel', year: 1965 },
        { number: '41', player: 'Tom Seaver', year: 1988 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    }
  },

  'nationals': {
    id: 'nationals',
    name: 'Nationals Park',
    team: 'Washington Nationals',
    opened: 2008,
    capacity: 41339,
    overview: {
      description: 'Nationals Park sits along the Anacostia River in Navy Yard, featuring stunning views of the US Capitol and Washington Monument. This modern ballpark is known for its wide concourses, unique outfield configuration, and the Presidents Race tradition.',
      highlights: [
        'Views of US Capitol and monuments',
        'Anacostia Riverfront location',
        'Presidents Race entertainment',
        'Center Field Social area'
      ],
      uniqueFeatures: [
        'Racing Presidents mascots',
        'Center Field Social gathering space',
        'Budweiser Terrace rooftop bar',
        'Kids Play Area beyond center field'
      ],
      renovations: [
        { year: 2016, description: 'Budweiser Terrace added' },
        { year: 2019, description: 'Ring of Honor installation' },
        { year: 2023, description: 'New video boards and sound system' }
      ],
      previousNames: []
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Gallery 401-410', 'Infield Gallery 301-310', 'Diamond Club'],
        afternoon: ['Gallery 410-420', 'Mezzanine third base side', 'PNC Diamond Club'],
        evening: ['First base side after 5 PM', 'Sections 110-130', 'Most upper deck']
      },
      coveredSeating: ['PNC Diamond Club', 'Norfolk Southern Club', 'Gallery overhang rows'],
      shadeTips: [
        'Third base side gets shade first',
        'Gallery level provides overhead coverage',
        'Avoid outfield sections for day games',
        'Club areas have climate control'
      ],
      sunProtection: {
        sunscreenStations: ['Section 131', 'Section 231', 'Section 401'],
        shadedConcourses: ['All concourse areas covered', 'Center Field Social'],
        indoorAreas: ['PNC Diamond Club', 'Norfolk Southern Club', 'Team Store']
      },
      worstSunExposure: ['Outfield Reserved 100-105', 'Right Field sections', 'Scoreboard Pavilion'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 65, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cherry blossoms, mild', shadeTip: 'Light jacket recommended' },
        { month: 'May', avgTemp: 74, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant spring', shadeTip: 'Third base for afternoon' },
        { month: 'June', avgTemp: 83, avgHumidity: 70, rainChance: 25, typicalConditions: 'Getting humid', shadeTip: 'Upper deck recommended' },
        { month: 'July', avgTemp: 88, avgHumidity: 75, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential, hydrate' },
        { month: 'August', avgTemp: 86, avgHumidity: 75, rainChance: 30, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 79, avgHumidity: 70, rainChance: 25, typicalConditions: 'Still warm', shadeTip: 'Most sections comfortable' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'PNC Diamond Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Private entrance'], access: 'Behind home plate' },
          { name: 'Norfolk Southern Club', perks: ['Climate controlled', 'Upscale dining', 'Private bar'], access: 'First base side' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Budweiser Terrace', description: 'Rooftop bar with views', capacity: 150 },
          { name: 'Center Field Social', description: 'Standing room social area' }
        ]
      },
      budgetOptions: ['Gallery Reserved 401-420', 'Outfield Reserved', 'Scoreboard Pavilion'],
      familySections: ['Family Fun Area sections', 'Sections near Kids Play Area'],
      standingRoom: ['Center Field Social', 'Budweiser Terrace', 'Concourse areas'],
      partyAreas: [
        { name: 'Scoreboard Walk', capacity: '75', amenities: ['Group seating', 'Food packages'] },
        { name: 'Red Porch', description: 'Center field gathering spot', capacity: '100' }
      ],
      tips: [
        { section: 'PNC Diamond 115-125', tip: 'Best overall experience with shade', category: 'premium' },
        { section: 'Gallery 401-410', tip: 'Great value with monument views', category: 'value' },
        { section: 'Sections 135-140', tip: 'Close to action but sunny', category: 'view' },
        { section: 'Center Field Social', tip: 'Fun social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Ben\'s Chili Bowl half-smoke', 'Chesapeake crab cake', 'DC Brau beer', 'Nationals Dog'],
      local: ['Ben\'s Chili Bowl', 'District Drafts', 'Shake Shack', 'Box Frites'],
      healthy: ['Fresh salads', 'Veggie wraps', 'Fruit cups'],
      vegetarian: ['Veggie burger', 'Plant-based options', 'Salads'],
      glutenFree: ['GF buns available', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Dippin Dots', 'Cotton candy'],
      alcohol: {
        beer: ['DC Brau', 'Atlas Brew Works', 'Budweiser', 'Miller Lite'],
        wine: true,
        cocktails: true,
        localBreweries: ['DC Brau', 'Atlas', '3 Stars', 'Right Proper']
      }
    },
    parking: {
      lots: [
        { name: 'Garage A', distance: 'Adjacent', price: '$40', shadedSpots: true, covered: true, tip: 'Closest but priciest' },
        { name: 'Garage B', distance: '5 min walk', price: '$30', shadedSpots: true, covered: true, tip: 'Good balance' },
        { name: 'Lot W', distance: '10 min walk', price: '$20', shadedSpots: false, covered: false, tip: 'Budget option' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited meters, 2-hour max',
        tip: 'Very difficult on game days'
      },
      alternativeTransport: {
        publicTransit: ['Navy Yard Metro (Green Line)', 'DC Circulator bus'],
        rideShare: 'N Street SE designated zones',
        bicycle: 'Capital Bikeshare stations nearby'
      }
    },
    gates: [
      { name: 'Center Field Gate', location: 'Center field', bestFor: ['Outfield sections', 'Social areas'], openTime: '2 hours before', tip: 'Main entrance' },
      { name: 'Third Base Gate', location: 'Third base', bestFor: ['Left side sections'], openTime: '90 minutes before' },
      { name: 'First Base Gate', location: 'First base', bestFor: ['Right side sections'], openTime: '90 minutes before' },
      { name: 'Home Plate Gate', location: 'Behind home', bestFor: ['Premium sections'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Main Team Store - Center Field', exclusive: ['Authentics', 'Custom jerseys'] },
        { location: 'The Bullpen stores', exclusive: ['Clearance items'] }
      ],
      firstAid: ['Section 114', 'Section 222', 'Section 401'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services Section 131'],
      atms: ['All gate entrances', 'Throughout concourses'],
      wifi: { available: true, network: 'Nationals_Park_WiFi', freeZones: ['All areas'] },
      chargingStations: ['PNC Diamond Club', 'Center Field Social'],
      kidZones: [
        { name: 'Kids Play Area', location: 'Beyond center field', activities: ['Playground', 'Mini field', 'Games'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['All levels accessible']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main stands'],
      parkingSpaces: 'All garages have designated spaces'
    },
    transportation: {
      address: '1500 South Capitol Street SE, Washington, DC 20003',
      publicTransit: ['Navy Yard-Ballpark Metro Station', 'DC Circulator'],
      taxi: 'Taxi stand at First Street SE',
      rideshare: 'N Street SE'
    },
    gameDay: {
      parkingLots: {
        open: '2.5 hours before first pitch',
        recommendedArrival: '90 minutes early'
      },
      gatesOpen: '2 hours before (Center Field), 90 minutes (others)',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '3 hours',
      rushHours: ['30 minutes before first pitch', 'Navy Yard Metro after game'],
      tips: [
        { title: 'Take Metro', description: 'Green Line direct to Navy Yard', category: 'arrival' },
        { title: 'Monument Views', description: 'Upper deck third base for best views', category: 'experience' },
        { title: 'Half-Smoke', description: 'Ben\'s Chili Bowl is a must-try', category: 'food' },
        { title: 'Presidents Race', description: 'Middle of 4th inning entertainment', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '5:05 PM for 7:05 PM games',
        firstPitch: '7:05 PM weekdays, 7:05 PM Saturdays, 1:35 PM Sundays',
        peakConcessionLines: '6:30-7:00 PM'
      }
    },
    neighborhood: {
      name: 'Navy Yard',
      description: 'Revitalized waterfront district with restaurants, bars, and parks',
      beforeGame: ['Bluejacket Brewery', 'Agua 301', 'The Salt Line', 'Walters Sports Bar'],
      afterGame: ['The Bullpen outdoor bar area', 'Yards Park', 'Capitol Riverfront bars'],
      radius: '0.5 miles of waterfront development'
    },
    proTips: {
      insiderTips: [
        'Scoreboard Walk has unique perspective',
        'Center Field Social best for groups',
        'Presidents Race is can\'t-miss entertainment',
        'Free tours available on non-game days'
      ],
      bestValue: [
        'Gallery level corners great views for less',
        '$5 concessions at Value stands',
        'Happy hour before first pitch at bars'
      ],
      hiddenGems: [
        'Ring of Honor on Gallery level',
        'Budweiser Terrace sunset views',
        'Local food vendors rotate regularly'
      ],
      avoidThese: [
        'Driving without pre-paid parking',
        'Outfield sections on hot days',
        'Leaving immediately after game (Metro crush)'
      ]
    },
    history: {
      timeline: [
        { year: 2008, event: 'Nationals Park opens' },
        { year: 2012, event: 'Hosts first playoff game' },
        { year: 2018, event: 'Hosts MLB All-Star Game' },
        { year: 2019, event: 'World Series championship season' }
      ],
      traditions: [
        { name: 'Racing Presidents', description: 'Mascot race during 4th inning' },
        { name: 'Take On Me', description: '8th inning sing-along' },
        { name: 'Screech', description: 'Bald eagle mascot' }
      ],
      retired: [
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    }
  },

  'orioles': {
    id: 'orioles',
    name: 'Oriole Park at Camden Yards',
    team: 'Baltimore Orioles',
    opened: 1992,
    capacity: 44970,
    overview: {
      description: 'Oriole Park at Camden Yards revolutionized baseball stadium design, sparking the retro ballpark movement. Located in downtown Baltimore, it features the iconic B&O Warehouse beyond right field and perfectly blends modern amenities with classic ballpark charm.',
      highlights: [
        'First retro-classic ballpark',
        'Historic B&O Warehouse backdrop',
        'Eutaw Street pregame destination',
        'Downtown Baltimore skyline views'
      ],
      uniqueFeatures: [
        'B&O Warehouse - longest building on East Coast',
        'Eutaw Street between stadium and warehouse',
        'Home run markers on Eutaw Street',
        'Camden Station integration'
      ],
      renovations: [
        { year: 2011, description: 'HD video boards and ribbon boards' },
        { year: 2022, description: 'Left field wall dimensions changed' },
        { year: 2024, description: 'New lighting and sound systems' }
      ],
      previousNames: []
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper Deck 340-360', 'Club Level 244-264', 'Sections 60-72'],
        afternoon: ['Upper Deck 320-340', 'Club Level third base', 'Sections 18-34'],
        evening: ['First base side after 5:30 PM', 'Sections 40-60', 'Most upper deck']
      },
      coveredSeating: ['Club Level all sections', 'Upper Deck rows under overhang', 'Suites'],
      shadeTips: [
        'Third base side gets afternoon shade first',
        'Club level best for all-day coverage',
        'Upper deck overhang provides relief',
        'Warehouse creates late afternoon shadows'
      ],
      sunProtection: {
        sunscreenStations: ['Section 54', 'Section 252', 'Section 336'],
        shadedConcourses: ['All concourse areas', 'Eutaw Street'],
        indoorAreas: ['Sports Legends Museum', 'Club Level', 'Team Store']
      },
      worstSunExposure: ['Bleachers 86-98', 'Left Field sections 4-8', 'Lower Box 14-26'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 63, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool spring weather', shadeTip: 'Bring layers' },
        { month: 'May', avgTemp: 72, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Third base for afternoon' },
        { month: 'June', avgTemp: 81, avgHumidity: 70, rainChance: 25, typicalConditions: 'Getting warm', shadeTip: 'Upper deck recommended' },
        { month: 'July', avgTemp: 86, avgHumidity: 75, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Club level or upper deck' },
        { month: 'August', avgTemp: 84, avgHumidity: 75, rainChance: 30, typicalConditions: 'Peak summer', shadeTip: 'Evening games preferable' },
        { month: 'September', avgTemp: 77, avgHumidity: 70, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Most sections comfortable' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Jim Palmer Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Climate control'], access: 'Behind home plate' },
          { name: 'Legends Club', perks: ['Upscale dining', 'Private bar', 'Field access'], access: 'Club level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private entrance', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'The Roof Deck', description: 'Rooftop bar above center field', capacity: 200 },
          { name: 'Dempsey\'s Brew Pub', description: 'Restaurant with field views' }
        ]
      },
      budgetOptions: ['Upper Reserve 360-380', 'Bleachers', 'Standing room only'],
      familySections: ['Family picnic area', 'Sections 74-78 alcohol-free'],
      standingRoom: ['Flag Court', 'The Roof Deck', 'Eutaw Street'],
      partyAreas: [
        { name: 'Picnic Perch', capacity: '150', amenities: ['Buffet', 'Private area'] },
        { name: 'The Roof Deck', description: 'Rooftop party space', capacity: '200' }
      ],
      tips: [
        { section: 'Field Box 18-34', tip: 'Best shade and close to action', category: 'shade' },
        { section: 'Upper Reserve 336-342', tip: 'Great value with skyline views', category: 'value' },
        { section: 'Sections 86-90', tip: 'Fun bleacher atmosphere', category: 'experience' },
        { section: 'Club Level 244-250', tip: 'Premium experience with shade', category: 'premium' }
      ]
    },
    concessions: {
      signature: ['Boog\'s BBQ', 'Crab cakes', 'Old Bay fries', 'Natty Boh beer'],
      local: ['Boog\'s BBQ', 'Gino\'s Burgers', 'Pollock Johnny\'s', 'The Crab Chipper'],
      healthy: ['Fresh salads', 'Grilled options', 'Fruit cups'],
      vegetarian: ['Veggie burger', 'Garden salads', 'Veggie wraps'],
      glutenFree: ['GF options marked', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Soft serve', 'Popcorn'],
      alcohol: {
        beer: ['National Bohemian', 'Flying Dog', 'Heavy Seas', 'Union Craft'],
        wine: true,
        cocktails: true,
        localBreweries: ['Flying Dog', 'Heavy Seas', 'Union', 'Peabody Heights']
      }
    },
    parking: {
      lots: [
        { name: 'Lot A', distance: 'Adjacent', price: '$30', shadedSpots: false, covered: false, tip: 'Closest to stadium' },
        { name: 'Lot B/C', distance: '5 min walk', price: '$20', shadedSpots: false, covered: false, tip: 'Good value' },
        { name: 'Inner Harbor garages', distance: '15 min walk', price: '$15-25', shadedSpots: true, covered: true, tip: 'Covered parking' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Meters and resident only zones',
        tip: 'Very limited on game days'
      },
      alternativeTransport: {
        publicTransit: ['Camden Station (MARC train)', 'Light Rail - Camden Yards station'],
        rideShare: 'Russell Street designated zones',
        bicycle: 'Bike racks at gates'
      }
    },
    gates: [
      { name: 'Eutaw Street', location: 'Right field', bestFor: ['All sections'], openTime: '2 hours before', tip: 'Main entrance, explore Eutaw St' },
      { name: 'Gate A', location: 'Third base', bestFor: ['Third base sections'], openTime: '90 minutes before' },
      { name: 'Gate C', location: 'First base', bestFor: ['First base sections'], openTime: '90 minutes before' },
      { name: 'Gate H', location: 'Center field', bestFor: ['Bleachers', 'Upper deck'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Eutaw Street Store', exclusive: ['Authentics', 'Warehouse collection'] },
        { location: 'Team Store - Main', exclusive: ['Custom jerseys'] }
      ],
      firstAid: ['Section 52', 'Section 250', 'Section 340'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services behind Section 54'],
      atms: ['All gate entrances', 'Eutaw Street'],
      wifi: { available: true, network: 'Orioles_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Club Level', 'The Roof Deck'],
      kidZones: [
        { name: 'Kids\' Corner', location: 'Center field plaza', activities: ['Play area', 'Speed pitch', 'Base running'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Eutaw Street', 'Behind home plate']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main stands'],
      parkingSpaces: 'Lot A has closest ADA spaces'
    },
    transportation: {
      address: '333 W Camden Street, Baltimore, MD 21201',
      publicTransit: ['Camden Station MARC', 'Light Rail Camden Yards'],
      taxi: 'Taxi stand on Conway Street',
      rideshare: 'Russell Street south of stadium'
    },
    gameDay: {
      parkingLots: {
        open: '2.5 hours before first pitch',
        recommendedArrival: '90 minutes early for Eutaw Street'
      },
      gatesOpen: '2 hours before (Eutaw), 90 minutes (others)',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '3 hours',
      rushHours: ['45 minutes before first pitch', 'Post-game on Russell St'],
      tips: [
        { title: 'Eutaw Street', description: 'Arrive early to explore pregame', category: 'experience' },
        { title: 'Boog\'s BBQ', description: 'Must-visit on Eutaw Street', category: 'food' },
        { title: 'Light Rail', description: 'Convenient from downtown or BWI', category: 'arrival' },
        { title: 'Warehouse Tours', description: 'Available on select dates', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '5:35 PM for 7:05 PM games',
        firstPitch: '7:05 PM weekdays, 7:05 PM Saturdays, 1:35 PM Sundays',
        peakConcessionLines: '6:30-7:00 PM'
      }
    },
    neighborhood: {
      name: 'Downtown/Inner Harbor',
      description: 'Historic downtown area near Inner Harbor attractions',
      beforeGame: ['Pickles Pub', 'Slider\'s Bar & Grille', 'Pratt Street Ale House'],
      afterGame: ['Inner Harbor bars', 'Federal Hill nightlife', 'Little Italy restaurants'],
      radius: '1 mile to Inner Harbor'
    },
    proTips: {
      insiderTips: [
        'Eutaw Street is a destination itself',
        'Flag Court has free standing room',
        'Boog Powell often at his BBQ stand',
        'Home run plaques on Eutaw Street'
      ],
      bestValue: [
        'Upper Reserve corners good views',
        'Student Night discounts with ID',
        'Bleachers fun and affordable'
      ],
      hiddenGems: [
        'Statue garden outside',
        'Brooks Robinson statue plaza',
        'Warehouse tours when available'
      ],
      avoidThese: [
        'Driving without prepaid parking',
        'Left field bleachers on hot days',
        'Leaving during 7th inning stretch traffic'
      ]
    },
    history: {
      timeline: [
        { year: 1992, event: 'Camden Yards opens' },
        { year: 1993, event: 'Hosts MLB All-Star Game' },
        { year: 1995, event: 'Cal Ripken breaks consecutive games record' },
        { year: 2012, event: 'Hosts ALDS games' }
      ],
      traditions: [
        { name: 'O! during National Anthem', description: 'Fans yell "O!" during anthem' },
        { name: 'Thank God I\'m a Country Boy', description: '7th inning stretch song' },
        { name: 'The Oriole Bird', description: 'Team mascot since 1979' }
      ],
      retired: [
        { number: '4', player: 'Earl Weaver', year: 1982 },
        { number: '5', player: 'Brooks Robinson', year: 1978 },
        { number: '8', player: 'Cal Ripken Jr.', year: 2001 },
        { number: '20', player: 'Frank Robinson', year: 1972 },
        { number: '22', player: 'Jim Palmer', year: 1985 },
        { number: '33', player: 'Eddie Murray', year: 1989 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    }
  },

  'phillies': {
    id: 'phillies',
    name: 'Citizens Bank Park',
    team: 'Philadelphia Phillies',
    opened: 2004,
    capacity: 42901,
    overview: {
      description: 'Citizens Bank Park in South Philadelphia offers an intimate baseball experience with excellent sightlines and the famous Liberty Bell that rings after Phillies home runs. Known for being hitter-friendly and having passionate fans, it\'s one of the most electric atmospheres in baseball.',
      highlights: [
        'Liberty Bell rings for home runs',
        'Ashburn Alley entertainment area',
        'Phanatic Phun Zone for kids',
        'Rooftop bleacher bar'
      ],
      uniqueFeatures: [
        '50-foot Liberty Bell in right-center',
        'Ashburn Alley beyond outfield',
        'Citizens Bank Bridge views',
        'Wall of Fame in Ashburn Alley'
      ],
      renovations: [
        { year: 2011, description: 'HD video board upgrade' },
        { year: 2019, description: 'Pass and Stow bar added' },
        { year: 2023, description: 'New LED lighting system' }
      ],
      previousNames: []
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Terrace 301-315', 'Diamond Club', 'Hall of Fame Club'],
        afternoon: ['Terrace 315-330', 'Pavilion third base side', 'Sections 130-140'],
        evening: ['First base side after 5 PM', 'Sections 108-120', 'Most terrace level']
      },
      coveredSeating: ['Diamond Club', 'Hall of Fame Club', 'Terrace overhang rows'],
      shadeTips: [
        'Third base side best for afternoon shade',
        'Terrace level has overhang protection',
        'Avoid bleachers for day games',
        'Diamond Club fully climate controlled'
      ],
      sunProtection: {
        sunscreenStations: ['Section 140', 'Section 240', 'Section 320'],
        shadedConcourses: ['All concourse areas', 'Ashburn Alley'],
        indoorAreas: ['Diamond Club', 'Hall of Fame Club', 'Team Store']
      },
      worstSunExposure: ['Bleachers 201-204', 'Pavilion 101-105', 'Arcade sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 60, rainChance: 25, typicalConditions: 'Cool and variable', shadeTip: 'Dress in layers' },
        { month: 'May', avgTemp: 72, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant spring', shadeTip: 'Third base for afternoon' },
        { month: 'June', avgTemp: 81, avgHumidity: 70, rainChance: 25, typicalConditions: 'Getting humid', shadeTip: 'Upper deck recommended' },
        { month: 'July', avgTemp: 86, avgHumidity: 75, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Shade essential' },
        { month: 'August', avgTemp: 85, avgHumidity: 75, rainChance: 30, typicalConditions: 'Peak summer heat', shadeTip: 'Evening games best' },
        { month: 'September', avgTemp: 77, avgHumidity: 70, rainChance: 25, typicalConditions: 'Still warm', shadeTip: 'Most sections comfortable' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Waitstaff'], access: 'Behind home plate' },
          { name: 'Hall of Fame Club', perks: ['Upscale dining', 'Private bar', 'Climate control'], access: 'First base side' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private entrance', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Rooftop Bleachers', description: 'Bar area with field views', capacity: 150 },
          { name: 'The Yard', description: 'Beer garden in Ashburn Alley' }
        ]
      },
      budgetOptions: ['Pavilion 201-205', 'Terrace Deck', 'Rooftop Bleachers'],
      familySections: ['Sections 301-303 alcohol-free', 'Near Phanatic Phun Zone'],
      standingRoom: ['Ashburn Alley', 'The Yard', 'Rooftop area'],
      partyAreas: [
        { name: 'Scoreboard Porch', capacity: '50', amenities: ['Group seating', 'Food packages'] },
        { name: 'Pavilion Porch', description: 'Left field group area', capacity: '75' }
      ],
      tips: [
        { section: 'Diamond Club A-G', tip: 'Ultimate luxury with perfect shade', category: 'premium' },
        { section: 'Terrace 315-320', tip: 'Best value with shade', category: 'value' },
        { section: 'Sections 130-135', tip: 'Close to action, good shade', category: 'view' },
        { section: 'Ashburn Alley', tip: 'Great pregame atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cheesesteak', 'Schmitter sandwich', 'Crab fries', 'Tony Luke\'s'],
      local: ['Tony Luke\'s', 'Campo\'s', 'Federal Donuts', 'Chickie\'s & Pete\'s'],
      healthy: ['Fresh salads', 'Grilled chicken', 'Fruit options'],
      vegetarian: ['Veggie cheesesteak', 'Plant-based options', 'Salads'],
      glutenFree: ['GF buns available', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Dollar Dog nights', 'Ice cream'],
      alcohol: {
        beer: ['Yards', 'Victory', 'Yuengling', 'Flying Fish'],
        wine: true,
        cocktails: true,
        localBreweries: ['Yards', 'Victory', 'Tired Hands', 'Evil Genius']
      }
    },
    parking: {
      lots: [
        { name: 'Citizens Bank Park Lots', distance: 'Adjacent', price: '$25', shadedSpots: false, covered: false, tip: 'Multiple lots surround stadium' },
        { name: 'Jetro Lot', distance: '10 min walk', price: '$15', shadedSpots: false, covered: false, tip: 'Budget option' },
        { name: 'Wells Fargo Center', distance: '5 min walk', price: '$20', shadedSpots: false, covered: false, tip: 'Easy access' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Permit zones on game days',
        tip: 'Very limited near stadium'
      },
      alternativeTransport: {
        publicTransit: ['Broad Street Line to AT&T Station', 'SEPTA buses'],
        rideShare: 'Pattison Avenue designated zones',
        bicycle: 'Bike racks at gates'
      }
    },
    gates: [
      { name: 'Third Base Gate', location: 'Third base', bestFor: ['Left side sections'], openTime: '2 hours before', tip: 'Main entrance' },
      { name: 'First Base Gate', location: 'First base', bestFor: ['Right side sections'], openTime: '90 minutes before' },
      { name: 'Left Field Gate', location: 'Left field', bestFor: ['Ashburn Alley', 'Outfield'], openTime: '2 hours before' },
      { name: 'Center Field Gate', location: 'Center field', bestFor: ['Bleachers'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Majestic Clubhouse Store', exclusive: ['Authentics', 'Custom jerseys'] },
        { location: 'Ashburn Alley Store', exclusive: ['Retro items'] }
      ],
      firstAid: ['Section 121', 'Section 210', 'Section 320'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services behind Section 121'],
      atms: ['All gate entrances', 'Throughout concourses'],
      wifi: { available: true, network: 'CBP_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Diamond Club', 'Hall of Fame Club'],
      kidZones: [
        { name: 'Phanatic Phun Zone', location: 'Ashburn Alley', activities: ['Playground', 'Games', 'Phanatic appearances'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['All levels accessible']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main stands'],
      parkingSpaces: 'All lots have ADA spaces'
    },
    transportation: {
      address: '1 Citizens Bank Way, Philadelphia, PA 19148',
      publicTransit: ['Broad Street Line', 'SEPTA buses'],
      taxi: 'Taxi stand on Pattison Ave',
      rideshare: 'Pattison Avenue'
    },
    gameDay: {
      parkingLots: {
        open: '2.5 hours before first pitch',
        recommendedArrival: '90 minutes early'
      },
      gatesOpen: '2 hours before (main gates), 90 minutes (others)',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '3 hours',
      rushHours: ['45 minutes before first pitch', 'Post-game on Broad Street'],
      tips: [
        { title: 'Take the Subway', description: 'Broad Street Line avoids parking', category: 'arrival' },
        { title: 'Ashburn Alley', description: 'Arrive early to explore', category: 'experience' },
        { title: 'Cheesesteak', description: 'Try multiple vendors', category: 'food' },
        { title: 'Phanatic', description: 'Best mascot in sports', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '5:05 PM for 7:05 PM games',
        firstPitch: '7:05 PM weekdays, 7:05 PM Saturdays, 1:35 PM Sundays',
        peakConcessionLines: '6:30-7:00 PM'
      }
    },
    neighborhood: {
      name: 'South Philadelphia Sports Complex',
      description: 'Sports complex with Wells Fargo Center and Lincoln Financial Field',
      beforeGame: ['Xfinity Live!', 'Chickie\'s & Pete\'s', 'The Philadium Tavern'],
      afterGame: ['Xfinity Live!', 'South Philly bars', 'Passyunk Avenue restaurants'],
      radius: '0.5 miles to Passyunk Square'
    },
    proTips: {
      insiderTips: [
        'Ashburn Alley is free during games',
        'Wall of Fame worth exploring',
        'Dollar Dog nights are Tuesdays',
        'High-five the Phanatic on the dugout'
      ],
      bestValue: [
        'Rooftop bleachers include a drink',
        'Terrace corners great views',
        'Student discounts with valid ID'
      ],
      hiddenGems: [
        'Pass and Stow bar (new Liberty Bell replica)',
        'Phillies Authentics store for game-used items',
        'Mike Schmidt statue garden'
      ],
      avoidThese: [
        'Driving without prepaid parking',
        'Bleachers on hot day games',
        'Leaving during 7th inning (traffic)']
    },
    history: {
      timeline: [
        { year: 2004, event: 'Citizens Bank Park opens' },
        { year: 2008, event: 'World Series championship' },
        { year: 2009, event: 'Hosts World Series games' },
        { year: 2022, event: 'National League pennant' }
      ],
      traditions: [
        { name: 'Phillie Phanatic', description: 'Beloved green mascot since 1978' },
        { name: 'Liberty Bell', description: 'Rings and lights for home runs' },
        { name: 'High Hopes', description: 'Victory song after wins' }
      ],
      retired: [
        { number: '1', player: 'Richie Ashburn', year: 1979 },
        { number: '14', player: 'Jim Bunning', year: 2001 },
        { number: '15', player: 'Dick Allen', year: 2020 },
        { number: '20', player: 'Mike Schmidt', year: 1990 },
        { number: '32', player: 'Steve Carlton', year: 1989 },
        { number: '34', player: 'Roy Halladay', year: 2020 },
        { number: '36', player: 'Robin Roberts', year: 1962 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    }
  },

  'pirates': {
    id: 'pirates',
    name: 'PNC Park',
    team: 'Pittsburgh Pirates',
    opened: 2001,
    capacity: 38747,
    overview: {
      description: 'PNC Park, situated along the Allegheny River, is widely considered one of the most beautiful ballparks in America. With the Pittsburgh skyline and Roberto Clemente Bridge as backdrops, it offers an intimate baseball experience with just two decks and excellent sightlines throughout.',
      highlights: [
        'Best skyline view in baseball',
        'Roberto Clemente Bridge pregame walk',
        'Allegheny River location',
        'Intimate two-deck design'
      ],
      uniqueFeatures: [
        'Roberto Clemente Bridge pedestrian access',
        'Riverwalk along Allegheny River',
        '21-foot Clemente Wall in right field',
        'Out-of-town scoreboard'
      ],
      renovations: [
        { year: 2015, description: 'LED lighting upgrade' },
        { year: 2018, description: 'New video boards' },
        { year: 2023, description: 'Club level renovations' }
      ],
      previousNames: []
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper Deck 301-315', 'Pirates Club', 'Lexus Club'],
        afternoon: ['Upper Deck 315-325', 'Sections 120-130 third base', 'Club seats'],
        evening: ['First base side after 6 PM', 'Sections 105-115', 'Most upper deck']
      },
      coveredSeating: ['Club Level sections', 'Upper Deck overhang rows', 'Suites'],
      shadeTips: [
        'Third base side gets afternoon shade',
        'Upper deck provides coverage below',
        'Club level has overhead protection',
        'River breeze provides cooling'
      ],
      sunProtection: {
        sunscreenStations: ['Section 125', 'Section 225', 'Section 325'],
        shadedConcourses: ['All concourse areas', 'Riverwalk'],
        indoorAreas: ['Pirates Club', 'Lexus Club', 'Team Store']
      },
      worstSunExposure: ['Bleachers 131-143', 'Outfield Reserved', 'Right field sections'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 58, avgHumidity: 60, rainChance: 30, typicalConditions: 'Cool and unpredictable', shadeTip: 'Bring layers' },
        { month: 'May', avgTemp: 68, avgHumidity: 65, rainChance: 30, typicalConditions: 'Mild spring', shadeTip: 'Third base for shade' },
        { month: 'June', avgTemp: 77, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Upper deck stays cooler' },
        { month: 'July', avgTemp: 82, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm and humid', shadeTip: 'Club level recommended' },
        { month: 'August', avgTemp: 80, avgHumidity: 70, rainChance: 25, typicalConditions: 'Peak summer', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 73, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cooling down', shadeTip: 'Most sections comfortable' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Pirates Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Private entrance'], access: 'Behind home plate' },
          { name: 'Lexus Club', perks: ['Upscale dining', 'Private bar', 'Climate control'], access: 'Club level' }
        ],
        suites: {
          levels: ['Suite Level', 'PBC Suites'],
          amenities: ['Private entrance', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'The Cove', description: 'Right field social area', capacity: 100 },
          { name: 'Budweiser Bow Tie', description: 'Rooftop bar right field' }
        ]
      },
      budgetOptions: ['Grandstand 301-325', 'Bleachers', 'Left Field Reserved'],
      familySections: ['Family sections 301-303', 'Kids Clubhouse area'],
      standingRoom: ['Riverwalk', 'The Cove', 'Rotunda area'],
      partyAreas: [
        { name: 'Riverfront Deck', capacity: '150', amenities: ['Buffet', 'Private bar'] },
        { name: 'The Cove', description: 'Right field party area', capacity: '100' }
      ],
      tips: [
        { section: 'Infield Box 115-125', tip: 'Best views of skyline and field', category: 'view' },
        { section: 'Grandstand 315-320', tip: 'Great value with shade', category: 'value' },
        { section: 'Pirates Club', tip: 'Premium all-inclusive experience', category: 'premium' },
        { section: 'Bleachers 135-140', tip: 'Lively atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Primanti Bros sandwich', 'Pierogies', 'Quaker Steak wings', "Manny's BBQ"],
      local: ['Primanti Bros', "Manny's BBQ", 'BRGR', "Chickie's & Pete's"],
      healthy: ['Fresh salads', 'Grilled options', 'Fruit stands'],
      vegetarian: ['Veggie burger', 'Pierogi options', 'Salads'],
      glutenFree: ['GF options marked', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Dippin Dots', 'Popcorn'],
      alcohol: {
        beer: ['Iron City', 'Yuengling', 'Penn Brewery', 'Southern Tier'],
        wine: true,
        cocktails: true,
        localBreweries: ['Penn Brewery', 'Voodoo', 'Hitchhiker', 'Grist House']
      }
    },
    parking: {
      lots: [
        { name: 'Gold Lots 1-5', distance: 'Adjacent', price: '$35', shadedSpots: false, covered: false, tip: 'Closest but priciest' },
        { name: 'Red Lots', distance: '10 min walk', price: '$25', shadedSpots: false, covered: false, tip: 'Good value' },
        { name: 'Downtown garages', distance: '15 min walk', price: '$10-20', shadedSpots: true, covered: true, tip: 'Walk across bridge' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Meters and permit zones',
        tip: 'Limited on North Shore'
      },
      alternativeTransport: {
        publicTransit: ['T Light Rail to North Side Station', 'Port Authority buses'],
        rideShare: 'Federal Street designated zones',
        bicycle: 'Bike racks and Three Rivers Heritage Trail'
      }
    },
    gates: [
      { name: 'Home Plate', location: 'Behind home plate', bestFor: ['All sections'], openTime: '2 hours before', tip: 'Main entrance' },
      { name: 'Left Field', location: 'Left field', bestFor: ['Left field sections'], openTime: '90 minutes before' },
      { name: 'Right Field', location: 'Right field', bestFor: ['Bleachers', 'The Cove'], openTime: '90 minutes before' },
      { name: 'Riverwalk', location: 'Center field', bestFor: ['Bleachers'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'PBC Team Store', exclusive: ['Authentics', 'Custom jerseys'] },
        { location: 'Atrium shops', exclusive: ['Vintage items'] }
      ],
      firstAid: ['Section 112', 'Section 212', 'Section 312'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services Section 116'],
      atms: ['All gate entrances', 'Throughout concourses'],
      wifi: { available: true, network: 'PNC_Park_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Club Level', 'The Cove'],
      kidZones: [
        { name: 'Kids Clubhouse', location: 'Left field', activities: ['Play area', 'Games', 'Pirate ship'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['Home Plate', 'Left Field', 'Right Field']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main stands'],
      parkingSpaces: 'Gold Lot 1 has closest ADA spaces'
    },
    transportation: {
      address: '115 Federal Street, Pittsburgh, PA 15212',
      publicTransit: ['T Light Rail', 'Port Authority buses'],
      taxi: 'Taxi stand on General Robinson Street',
      rideshare: 'Federal Street north of stadium'
    },
    gameDay: {
      parkingLots: {
        open: '2.5 hours before first pitch',
        recommendedArrival: '90 minutes early for bridge walk'
      },
      gatesOpen: '2 hours before (Home Plate), 90 minutes (others)',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '3 hours',
      rushHours: ['45 minutes before first pitch', 'Roberto Clemente Bridge after game'],
      tips: [
        { title: 'Walk the Bridge', description: 'Roberto Clemente Bridge closed to cars', category: 'experience' },
        { title: 'Skyline Views', description: 'Upper deck sections 315-325 best', category: 'view' },
        { title: 'Primanti Bros', description: 'Pittsburgh tradition sandwich', category: 'food' },
        { title: 'River Breeze', description: 'Can get cool by the water', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '5:05 PM for 7:05 PM games',
        firstPitch: '7:05 PM weekdays, 7:05 PM Saturdays, 1:35 PM Sundays',
        peakConcessionLines: '6:30-7:00 PM'
      }
    },
    neighborhood: {
      name: 'North Shore',
      description: 'Riverfront entertainment district with restaurants and bars',
      beforeGame: ["McFadden's", 'Soho', 'Burgatory', "Jerome Bettis' Grille 36"],
      afterGame: ['North Shore bars', 'Downtown via bridge', 'Strip District late night'],
      radius: '0.5 miles along riverfront'
    },
    proTips: {
      insiderTips: [
        'Bridge walk is a must-do experience',
        'Riverwalk has great photo ops',
        'Pierogi races in 5th inning',
        'Tours available on non-game days'
      ],
      bestValue: [
        'Grandstand level great views for less',
        'Student discounts with valid ID',
        'Bleachers affordable with atmosphere'
      ],
      hiddenGems: [
        "Manny's BBQ behind section 136",
        'Legacy Square statues outside',
        'Out-of-town scoreboard unique feature'
      ],
      avoidThese: [
        'Driving without prepaid parking',
        'Right field bleachers on sunny days',
        'Leaving during fireworks nights (traffic)'
      ]
    },
    history: {
      timeline: [
        { year: 2001, event: 'PNC Park opens' },
        { year: 2006, event: 'Hosts MLB All-Star Game' },
        { year: 2013, event: 'First playoff game in 21 years' },
        { year: 2014, event: 'Wild Card game victory' }
      ],
      traditions: [
        { name: 'Pierogi Race', description: 'Great Pittsburgh Pierogi Race' },
        { name: 'Jolly Roger', description: 'Raised after victories' },
        { name: 'Pirate Parrot', description: 'Team mascot' }
      ],
      retired: [
        { number: '1', player: 'Billy Meyer', year: 1954 },
        { number: '4', player: 'Ralph Kiner', year: 1987 },
        { number: '8', player: 'Willie Stargell', year: 1982 },
        { number: '9', player: 'Bill Mazeroski', year: 1987 },
        { number: '11', player: 'Paul Waner', year: 2007 },
        { number: '20', player: 'Pie Traynor', year: 1972 },
        { number: '21', player: 'Roberto Clemente', year: 1973 },
        { number: '33', player: 'Honus Wagner', year: 1956 },
        { number: '40', player: 'Danny Murtaugh', year: 1977 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    }
  },

  'rangers': {
    id: 'rangers',
    name: 'Globe Life Field',
    team: 'Texas Rangers',
    opened: 2020,
    capacity: 40300,
    overview: {
      description: 'Globe Life Field is a state-of-the-art retractable roof ballpark in Arlington, featuring a climate-controlled environment perfect for Texas summers. The newest park in MLB combines modern amenities with classic ballpark design, offering spectacular views and comfort year-round.',
      highlights: [
        'Climate-controlled retractable roof',
        'Texas Live! entertainment district',
        'Karbach Sky Porch in right field',
        'Split-level design with great sightlines'
      ],
      uniqueFeatures: [
        'Retractable roof with AC system',
        'Texas-sized video board',
        'Karbach Sky Porch social area',
        'Split-level concourse design'
      ],
      renovations: [
        { year: 2024, description: 'New outfield social spaces added' }
      ],
      previousNames: []
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['All sections (roof closed)', 'Upper Box 301-315', 'Club seats'],
        afternoon: ['All sections (roof typically closed)', 'Third base side if open', 'Upper deck'],
        evening: ['All sections (climate controlled)', 'First base side if roof open', 'Club level']
      },
      coveredSeating: ['All seats when roof closed', 'Club Level always covered', 'Suites'],
      shadeTips: [
        'Roof usually closed April-September',
        'AC maintains 72°F when closed',
        'Even with roof open, upper deck covered',
        'No sun concerns with roof closed'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourses covered'],
        indoorAreas: ['Entire stadium when roof closed', 'Clubs', 'Team Store']
      },
      worstSunExposure: ['Outfield sections when roof open', 'Lower level first base if open'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 75, avgHumidity: 65, rainChance: 20, typicalConditions: 'Mild, roof varies', shadeTip: 'Perfect with roof open' },
        { month: 'May', avgTemp: 83, avgHumidity: 70, rainChance: 25, typicalConditions: 'Getting warm', shadeTip: 'Roof often closed' },
        { month: 'June', avgTemp: 91, avgHumidity: 65, rainChance: 15, typicalConditions: 'Hot', shadeTip: 'AC essential' },
        { month: 'July', avgTemp: 96, avgHumidity: 60, rainChance: 10, typicalConditions: 'Very hot', shadeTip: 'Roof always closed' },
        { month: 'August', avgTemp: 96, avgHumidity: 60, rainChance: 10, typicalConditions: 'Peak heat', shadeTip: 'Climate control blessing' },
        { month: 'September', avgTemp: 88, avgHumidity: 65, rainChance: 15, typicalConditions: 'Still hot', shadeTip: 'Roof usually closed' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Private entrance'], access: 'Behind home plate' },
          { name: 'Lexus Club', perks: ['Upscale dining', 'Climate control', 'Private bar'], access: 'Club level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private entrance', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Karbach Sky Porch', description: 'Right field social deck', capacity: 200 },
          { name: 'Captain Morgan Club', description: 'Left field club area' }
        ]
      },
      budgetOptions: ['Upper Box 316-330', 'Upper Reserved', 'Outfield Plaza'],
      familySections: ['Sections 224-226', 'Near kids area'],
      standingRoom: ['Karbach Sky Porch', 'Outfield concourse', 'Texas Live! views'],
      partyAreas: [
        { name: 'Rangers Republic', capacity: '150', amenities: ['All-inclusive food/drinks'] },
        { name: 'Outfield Plaza', description: 'Group areas', capacity: '100' }
      ],
      tips: [
        { section: 'Diamond Club', tip: 'Ultimate luxury with AC comfort', category: 'premium' },
        { section: 'Upper Box 315-325', tip: 'Great value with full coverage', category: 'value' },
        { section: 'Sections 115-125', tip: 'Close to action, always comfortable', category: 'view' },
        { section: 'Karbach Sky Porch', tip: 'Social atmosphere with shade', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Boomstick hot dog', 'BBQ nachos', 'Brisket grilled cheese', 'Chicken & waffles'],
      local: ['Pluckers Wing Bar', 'Golden Chick', 'Twisted Root Burgers', 'Smoky Rose BBQ'],
      healthy: ['Fresh salads', 'Grilled options', 'Fruit cups'],
      vegetarian: ['Beyond Burger', 'Veggie tacos', 'Salads'],
      glutenFree: ['GF buns available', 'BBQ platters'],
      kidsFriendly: ['Kids meals', 'Dippin Dots', 'Cotton candy'],
      alcohol: {
        beer: ['Karbach', 'Shiner', 'Revolver', 'Martin House'],
        wine: true,
        cocktails: true,
        localBreweries: ['Karbach', 'Revolver', 'Martin House', 'Rahr & Sons']
      }
    },
    parking: {
      lots: [
        { name: 'Lot A', distance: 'Adjacent', price: '$30', shadedSpots: false, covered: false, tip: 'Closest to main entrance' },
        { name: 'Lot B/C', distance: '5 min walk', price: '$20', shadedSpots: false, covered: false, tip: 'Good value' },
        { name: 'Lot N', distance: '10 min walk', price: '$15', shadedSpots: false, covered: false, tip: 'Budget option' }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking available',
        tip: 'Must use official lots'
      },
      alternativeTransport: {
        publicTransit: ['Via Arlington on-demand service', 'TRE to CentrePort + shuttle'],
        rideShare: 'Designated zones Randol Mill Rd',
        bicycle: 'Limited bike racks available'
      }
    },
    gates: [
      { name: 'North Entry', location: 'Behind home plate', bestFor: ['All sections'], openTime: '2 hours before', tip: 'Main entrance' },
      { name: 'South Entry', location: 'Center field', bestFor: ['Outfield sections'], openTime: '90 minutes before' },
      { name: 'East Entry', location: 'First base', bestFor: ['Right side sections'], openTime: '90 minutes before' },
      { name: 'West Entry', location: 'Third base', bestFor: ['Left side sections'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Grand Slam Team Store', exclusive: ['Authentics', 'Custom jerseys'] },
        { location: 'Outfield stores', exclusive: ['Game-used items'] }
      ],
      firstAid: ['Section 117', 'Section 217', 'Section 317'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services behind Section 121'],
      atms: ['All entry points', 'Throughout concourses'],
      wifi: { available: true, network: 'GLF_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Club Level', 'Karbach Sky Porch'],
      kidZones: [
        { name: 'Rangers Kids Zone', location: 'Center field plaza', activities: ['Play area', 'Games', 'Captain mascot visits'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['All entries have elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main stands'],
      parkingSpaces: 'All lots have ADA spaces near entrances'
    },
    transportation: {
      address: '734 Stadium Drive, Arlington, TX 76011',
      publicTransit: ['Via Arlington rideshare', 'TRE + shuttle on select games'],
      taxi: 'Limited availability',
      rideshare: 'Randol Mill Road designated areas'
    },
    gameDay: {
      parkingLots: {
        open: '2 hours before first pitch',
        recommendedArrival: '90 minutes early'
      },
      gatesOpen: '2 hours before (North), 90 minutes (others)',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '3 hours',
      rushHours: ['45 minutes before first pitch', 'Post-game exodus'],
      tips: [
        { title: 'AC Comfort', description: 'Dress for indoor temperature', category: 'weather' },
        { title: 'Texas Live!', description: 'Entertainment district adjacent', category: 'experience' },
        { title: 'Boomstick', description: '2-foot hot dog challenge', category: 'food' },
        { title: 'Early Arrival', description: 'Parking fills quickly', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '5:05 PM for 7:05 PM games',
        firstPitch: '7:05 PM weekdays, 7:05 PM Saturdays, 3:05 PM Sundays',
        peakConcessionLines: '6:30-7:00 PM'
      }
    },
    neighborhood: {
      name: 'Arlington Entertainment District',
      description: 'Sports and entertainment complex with AT&T Stadium nearby',
      beforeGame: ['Texas Live!', 'Hurtado Barbecue', 'Grease Monkey', 'J. Gilligan\'s'],
      afterGame: ['Texas Live! complex', 'Arlington Highlands shops', 'Downtown Arlington'],
      radius: 'Texas Live! adjacent to stadium'
    },
    proTips: {
      insiderTips: [
        'Texas Live! free before games',
        'Roof status shown on website',
        'Captain\'s Deck has unique views',
        'Tours available year-round'
      ],
      bestValue: [
        'Upper Reserved good views for less',
        'Tuesday specials throughout stadium',
        'Karbach Sky Porch includes first drink'
      ],
      hiddenGems: [
        'Greene\'s Hill historical marker',
        'Championship trophy display',
        'Texas Rangers Hall of Fame'
      ],
      avoidThese: [
        'Leaving immediately after game (traffic)',
        'Forgetting sunscreen if roof open',
        'Not checking roof status before dressing'
      ]
    },
    history: {
      timeline: [
        { year: 2020, event: 'Globe Life Field opens' },
        { year: 2020, event: 'Hosts neutral site World Series' },
        { year: 2023, event: 'Rangers win World Series' }
      ],
      traditions: [
        { name: 'Rangers Captain', description: 'Horse mascot' },
        { name: 'Dot Race', description: 'Mid-inning entertainment' },
        { name: 'Seventh Inning Stretch', description: 'Deep in the Heart of Texas' }
      ],
      retired: [
        { number: '7', player: 'Ivan Rodriguez', year: 2017 },
        { number: '10', player: 'Michael Young', year: 2014 },
        { number: '26', player: 'Johnny Oates', year: 2005 },
        { number: '29', player: 'Adrian Beltre', year: 2024 },
        { number: '34', player: 'Nolan Ryan', year: 1996 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    }
  },

  'rays': {
    id: 'rays',
    name: 'Tropicana Field',
    team: 'Tampa Bay Rays',
    opened: 1990,
    capacity: 25025,
    overview: {
      description: 'Tropicana Field, known as "The Trop," is the only fixed-dome stadium in MLB, providing a climate-controlled environment year-round. Located in St. Petersburg, it features unique ground rules with catwalks in play and the popular Rays Tank touch experience.',
      highlights: [
        'Only fixed-dome stadium in MLB',
        'Climate-controlled environment',
        'Rays Tank touch experience',
        'Ted Williams Museum'
      ],
      uniqueFeatures: [
        'Four catwalks in play (unique ground rules)',
        'Rays Tank with live rays',
        '10,000 gallon tank behind center field',
        'Artificial turf playing surface'
      ],
      renovations: [
        { year: 2014, description: 'New LED lighting system' },
        { year: 2019, description: 'New video boards and sound' },
        { year: 2023, description: 'Seating and concourse upgrades' }
      ],
      previousNames: ['Florida Suncoast Dome', 'ThunderDome']
    },
    shadeGuide: {
      bestShadedSections: {
        morning: ['All sections (indoor dome)', 'Climate controlled throughout'],
        afternoon: ['All sections (no sun exposure)', 'Constant 72°F temperature'],
        evening: ['All sections (fully enclosed)', 'No weather concerns']
      },
      coveredSeating: ['100% covered - fixed dome', 'All seats protected'],
      shadeTips: [
        'No sun exposure - fully enclosed dome',
        'Climate controlled at 72°F year-round',
        'No need for sun protection',
        'Dress for air conditioning'
      ],
      sunProtection: {
        sunscreenStations: ['Not needed - indoor venue'],
        shadedConcourses: ['All areas covered'],
        indoorAreas: ['Entire stadium is indoors']
      },
      worstSunExposure: ['None - fully enclosed dome'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 72, avgHumidity: 0, rainChance: 0, typicalConditions: 'Climate controlled', shadeTip: 'Perfect indoor conditions' },
        { month: 'May', avgTemp: 72, avgHumidity: 0, rainChance: 0, typicalConditions: 'Climate controlled', shadeTip: 'No weather impact' },
        { month: 'June', avgTemp: 72, avgHumidity: 0, rainChance: 0, typicalConditions: 'Climate controlled', shadeTip: 'Always comfortable' },
        { month: 'July', avgTemp: 72, avgHumidity: 0, rainChance: 0, typicalConditions: 'Climate controlled', shadeTip: 'AC keeps it cool' },
        { month: 'August', avgTemp: 72, avgHumidity: 0, rainChance: 0, typicalConditions: 'Climate controlled', shadeTip: 'Escape the Florida heat' },
        { month: 'September', avgTemp: 72, avgHumidity: 0, rainChance: 0, typicalConditions: 'Climate controlled', shadeTip: 'Consistent comfort' }
      ]
    },
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Home Plate Club', perks: ['All-inclusive food/drinks', 'Padded seats', 'Private entrance'], access: 'Behind home plate' },
          { name: 'Ducky\'s Club', perks: ['Buffet', 'Private bar', 'Climate control'], access: 'First base side' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private entrance', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'The Porch', description: 'Left field social area', capacity: 150 },
          { name: 'Rays Tank', description: 'Center field aquarium viewing' }
        ]
      },
      budgetOptions: ['Upper Deck 300s', 'Outfield Upper', 'Party Deck'],
      familySections: ['Family Fun sections', 'Near Kids Cove'],
      standingRoom: ['The Porch', 'Outfield areas', 'Rotunda'],
      partyAreas: [
        { name: 'Left Field Street', capacity: '200', amenities: ['Games', 'Food trucks'] },
        { name: 'Party Deck', description: 'Right field social area', capacity: '100' }
      ],
      tips: [
        { section: 'Home Plate Club', tip: 'Best seats with all-inclusive perks', category: 'premium' },
        { section: 'Upper 300-310', tip: 'Affordable with good views', category: 'value' },
        { section: 'Lower Box 120-130', tip: 'Close to action', category: 'view' },
        { section: 'The Porch', tip: 'Social atmosphere', category: 'experience' }
      ]
    },
    concessions: {
      signature: ['Cuban sandwich', 'Pipo\'s Cuban', 'Pulled pork nachos', 'Everglades BBQ'],
      local: ['Pipo\'s', 'PDQ', 'Carmel Kitchen', 'Cigar City Brewing'],
      healthy: ['Fresh salads', 'Grilled options', 'Fruit cups'],
      vegetarian: ['Veggie burger', 'Plant-based options', 'Salads'],
      glutenFree: ['GF options available', 'Rice bowls'],
      kidsFriendly: ['Kids meals', 'Dippin Dots', 'Popcorn'],
      alcohol: {
        beer: ['Cigar City', 'Coppertail', '3 Daughters', 'Yuengling'],
        wine: true,
        cocktails: true,
        localBreweries: ['Cigar City', 'Coppertail', '3 Daughters', 'Green Bench']
      }
    },
    parking: {
      lots: [
        { name: 'Lot 1', distance: 'Adjacent', price: '$20', shadedSpots: false, covered: false, tip: 'Closest to main entrance' },
        { name: 'Lot 2', distance: '5 min walk', price: '$15', shadedSpots: false, covered: false, tip: 'Good value' },
        { name: 'Downtown garages', distance: '10 min walk', price: '$10', shadedSpots: true, covered: true, tip: 'Covered options' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Meters and time limits',
        tip: 'Limited availability on game days'
      },
      alternativeTransport: {
        publicTransit: ['SunRunner BRT', 'PSTA buses', 'Downtown Looper'],
        rideShare: '1st Street South designated zones',
        bicycle: 'Bike racks and Coast Bike Share'
      }
    },
    gates: [
      { name: 'Gate 1', location: 'Home plate', bestFor: ['Main entrance'], openTime: '90 minutes before' },
      { name: 'Gate 2', location: 'First base', bestFor: ['Right side sections'], openTime: '90 minutes before' },
      { name: 'Gate 3', location: 'Third base', bestFor: ['Left side sections'], openTime: '90 minutes before' },
      { name: 'Gate 4', location: 'Left field', bestFor: ['Outfield sections'], openTime: '90 minutes before' }
    ],
    amenities: {
      merchandise: [
        { location: 'Main Team Store', exclusive: ['Authentics', 'Custom jerseys'] },
        { location: 'Outfield stores', exclusive: ['Clearance items'] }
      ],
      firstAid: ['Section 131', 'Section 216', 'Section 316'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Services behind home plate'],
      atms: ['All gate entrances', 'Throughout concourses'],
      wifi: { available: true, network: 'TropField_WiFi', freeZones: ['All areas'] },
      chargingStations: ['Club areas', 'The Porch'],
      kidZones: [
        { name: 'Kids Cove', location: 'Right field', activities: ['Playground', 'Games', 'Raymond mascot visits'] }
      ]
    },
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates accessible',
        elevators: ['All gates have elevator access']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All main stands'],
      parkingSpaces: 'Lot 1 has closest ADA spaces'
    },
    transportation: {
      address: '1 Tropicana Drive, St. Petersburg, FL 33705',
      publicTransit: ['SunRunner BRT', 'PSTA buses'],
      taxi: 'Taxi stand at Gate 1',
      rideshare: '1st Street South'
    },
    gameDay: {
      parkingLots: {
        open: '2 hours before first pitch',
        recommendedArrival: '60 minutes early'
      },
      gatesOpen: '90 minutes before first pitch',
      alcoholSales: 'End of 7th inning',
      typicalGameTime: '2.5-3 hours',
      rushHours: ['30 minutes before first pitch'],
      tips: [
        { title: 'Indoor Comfort', description: 'Dress for AC, not outdoor weather', category: 'weather' },
        { title: 'Rays Tank', description: 'Touch tank experience unique in MLB', category: 'experience' },
        { title: 'Catwalk Rules', description: 'Learn unique ground rules', category: 'experience' },
        { title: 'Ted Williams Museum', description: 'Baseball history exhibit', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '5:40 PM for 7:10 PM games',
        firstPitch: '7:10 PM weekdays, 6:10 PM Saturdays, 1:10 PM Sundays',
        peakConcessionLines: '6:45-7:15 PM'
      }
    },
    neighborhood: {
      name: 'Downtown St. Petersburg',
      description: 'Waterfront downtown with museums, shops, and restaurants',
      beforeGame: ['Ferg\'s Sports Bar', 'Green Bench Brewing', 'The Galley', 'Engine No. 9'],
      afterGame: ['Central Avenue bars', 'Beach Drive restaurants', 'The Pier district'],
      radius: '0.5 miles to downtown core'
    },
    proTips: {
      insiderTips: [
        'Cowbells are a tradition - join in',
        'Rays Tank touch experience is free',
        'DJ plays during games',
        'Upper deck surprisingly good views'
      ],
      bestValue: [
        'Upper corners very affordable',
        '$2 hot dogs on certain nights',
        'Party Deck good value for groups'
      ],
      hiddenGems: [
        'Ted Williams Museum',
        'Rays Hall of Fame',
        'Unique catwalk ground rules'
      ],
      avoidThese: [
        'Forgetting a sweater (AC is cold)',
        'Parking without prepaying',
        'Missing the touch tank experience'
      ]
    },
    history: {
      timeline: [
        { year: 1990, event: 'Stadium opens as Florida Suncoast Dome' },
        { year: 1998, event: 'Devil Rays begin play' },
        { year: 2008, event: 'Rays reach World Series' },
        { year: 2020, event: 'Win American League pennant' }
      ],
      traditions: [
        { name: 'Cowbells', description: 'Fans ring cowbells for rallies' },
        { name: 'DJ Kitty', description: 'Dancing cat video' },
        { name: 'Raymond', description: 'Seadog mascot' }
      ],
      retired: [
        { number: '12', player: 'Wade Boggs', year: 2017 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '66', player: 'Don Zimmer', year: 2015 }
      ]
    }
  },

  // Continue with remaining 6 stadiums...
  // reds, rockies, royals, tigers, twins, whitesox
};