import { StadiumGuide } from '../stadiumGuides';

export const mlbStadiumGuides3: Record<string, StadiumGuide> = {
  'brewers': {
    id: 'brewers',
    name: 'American Family Field',
    team: 'Milwaukee Brewers',
    opened: 2001,
    capacity: 41900,
    
    overview: {
      description: 'American Family Field (formerly Miller Park) is a retractable-roof ballpark featuring a distinctive fan-shaped roof and massive windows that provide natural light even when closed. Home to the famous racing sausages and the largest tailgating culture in MLB.',
      highlights: [
        'Fan-shaped retractable roof closes in 10 minutes',
        'Largest tailgating lots in MLB',
        'Bernie Brewer\'s chalet and slide',
        'Famous racing sausages tradition'
      ],
      uniqueFeatures: [
        'Bernie\'s Dugout playground behind home plate',
        'Miller Park Way tailgating areas',
        'Harley-Davidson deck in right field',
        'Uecker seats (obstructed view sections)',
        'Sausage racing between 6th and 7th innings'
      ],
      renovations: [
        { year: 2021, description: 'Name change to American Family Field' },
        { year: 2017, description: 'New video boards and sound system' },
        { year: 2014, description: 'Concourse improvements and new restaurants' }
      ],
      previousNames: ['Miller Park']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Sections 213-220', 'Club Level 322-328', 'Terrace Level 401-415'],
        afternoon: ['First base side upper deck', 'Club Level 330-340', 'Sections 201-210'],
        evening: ['Most sections shaded by roof overhang', 'Third base side', 'Behind home plate']
      },
      coveredSeating: ['All Club Level seats', 'Terrace Box sections', 'Premium seating areas'],
      shadeTips: [
        'Roof closes automatically in bad weather',
        'First base side gets afternoon shade first',
        'Upper deck overhangs protect many lower seats',
        'Field Box sections 117-125 good for day games'
      ],
      sunProtection: {
        sunscreenStations: ['Section 114', 'Section 219', 'Section 424'],
        shadedConcourses: ['All concourse levels', 'Club Level Terrace'],
        indoorAreas: ['Friday\'s Front Row Sports Grill', 'Brewers Team Store', 'TGI Friday\'s']
      },
      worstSunExposure: ['Right field Bleachers 201-206', 'Left field sections 142-144', 'Outfield Box 104-108'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool and variable', shadeTip: 'Layer clothing, roof may close' },
        { month: 'May', avgTemp: 65, avgHumidity: 60, rainChance: 30, typicalConditions: 'Mild spring weather', shadeTip: 'Perfect weather, minimal shade needed' },
        { month: 'June', avgTemp: 75, avgHumidity: 65, rainChance: 25, typicalConditions: 'Warm and pleasant', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 80, avgHumidity: 70, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'First base side preferred for day games' },
        { month: 'August', avgTemp: 78, avgHumidity: 72, rainChance: 35, typicalConditions: 'Hot and humid with storms', shadeTip: 'Upper deck shade essential' },
        { month: 'September', avgTemp: 70, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant fall weather', shadeTip: 'Great weather, any seat works' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Diamond Box', perks: ['All-inclusive food and drink', 'Climate control', 'Premium views'], access: 'Behind home plate, field level' },
          { name: 'Club Level', perks: ['Dedicated concourse', 'Upscale concessions', 'Indoor/outdoor seating'], access: 'Second level, sections 315-345' },
          { name: 'Brewers Deck', perks: ['All-you-can-eat', 'Social atmosphere', 'Standing room'], access: 'Right field upper deck' }
        ],
        suites: { levels: ['Club Level', 'Terrace Level'], amenities: ['Private bathrooms', 'Catering options', 'Climate control', 'HD TVs'] },
        specialAreas: [
          { name: 'Harley-Davidson Deck', description: 'Right field party deck with motorcycle displays', capacity: 75 },
          { name: 'Miller Lite Patio', description: 'Left field social area with games', capacity: 100 }
        ]
      },
      budgetOptions: ['Terrace Reserved 401-436', 'Bleachers 201-206', 'Upper Box 301-314'],
      familySections: ['Bernie\'s Dugout area', 'Outfield sections with kids activities', 'Upper deck family areas'],
      standingRoom: ['SRO areas throughout concourses', 'Brewers Deck', 'Miller Lite Patio'],
      partyAreas: [
        { name: 'Brewers Deck', capacity: '200', amenities: ['All-you-can-eat buffet', 'Premium bar', 'Games'] },
        { name: 'Harley-Davidson Deck', capacity: '75', amenities: ['Motorcycle displays', 'Premium concessions', 'Social seating'] }
      ],
      tips: [
        { section: 'Diamond Box', tip: 'All-inclusive pricing covers premium food and alcohol', category: 'value' },
        { section: 'Sections 117-125', tip: 'Field Box seats with great sight lines and afternoon shade', category: 'shade' },
        { section: 'Uecker Seats', tip: 'Cheapest tickets with obstructed views - Bob Uecker\'s favorite', category: 'value' },
        { section: 'Bernie\'s Dugout', tip: 'Behind home plate with playground for kids', category: 'family' }
      ]
    },
    
    concessions: {
      signature: ['Famous Racing Sausages (Italian, Polish, Bratwurst, Chorizo, Hot Dog)', 'Cheese Curds from multiple vendors', 'Friday\'s Front Row burgers', 'Klement\'s sausages'],
      local: ['Sprecher root beer and cream soda', 'Usinger\'s bratwurst', 'AJ Bombers burgers', 'Lakefront Brewery beer', 'George Webb sliders'],
      healthy: ['Fresh salads at Friday\'s', 'Grilled chicken options', 'Fresh fruit cups'],
      vegetarian: ['Veggie brats', 'Garden burgers', 'Pizza options', 'Salads'],
      glutenFree: ['Gluten-free buns available', 'Certified concessions in Club Level'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Ice cream', 'Cotton candy', 'Pretzels'],
      alcohol: {
        beer: ['Miller Lite', 'Miller High Life', 'Blue Moon', 'Leinenkugel\'s', 'Lakefront Brewery', 'New Glarus (Wisconsin exclusive)'],
        wine: true,
        cocktails: true,
        localBreweries: ['Lakefront Brewery', 'New Glarus', 'Sprecher', 'Milwaukee Brewing Company']
      }
    },
    
    parking: {
      lots: [
        { name: 'Preferred Parking', distance: 'Adjacent to stadium', price: '$25-35', shadedSpots: false, covered: false, tip: 'Closest to entrances' },
        { name: 'General Parking', distance: '0.1-0.3 miles', price: '$15-25', shadedSpots: false, covered: false, tip: 'Best tailgating atmosphere' },
        { name: 'Tailgating Lots', distance: '0.2-0.4 miles', price: '$20-30', shadedSpots: false, covered: false, tip: 'Famous for pre-game parties' },
        { name: 'Economy Parking', distance: '0.5-0.8 miles', price: '$10-15', shadedSpots: false, covered: false, tip: 'Budget option with shuttle' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited availability, mostly residential',
        tip: 'Try neighborhoods south of stadium'
      },
      alternativeTransport: {
        publicTransit: ['Milwaukee County Transit buses to stadium', 'Park & ride lots with shuttle'],
        rideShare: 'Designated pickup zones in Lot E',
        bicycle: 'Bike racks available at all entrances'
      }
    },
    
    gates: [
      { name: 'Home Plate Gate', location: 'South side', bestFor: ['Diamond Box', 'Club Level', 'Behind home plate'], openTime: '2 hours before first pitch', tip: 'Main entrance with team store' },
      { name: 'Left Field Gate', location: 'West side', bestFor: ['Left field sections', 'Miller Lite Patio'], openTime: '2 hours before first pitch' },
      { name: 'Right Field Gate', location: 'East side', bestFor: ['Right field sections', 'Harley-Davidson Deck'], openTime: '2 hours before first pitch' },
      { name: 'Uecker Gate', location: 'Third base side', bestFor: ['Upper deck', 'Terrace seating'], openTime: '2 hours before first pitch', tip: 'Named after Bob Uecker' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Brewers Team Store (Home Plate Gate)', exclusive: ['Authentic jerseys', 'Racing sausage merchandise'] },
        { location: 'Pro Shop (Club Level)', exclusive: ['Premium merchandise'] },
        { location: 'Concourse stands throughout stadium' }
      ],
      firstAid: ['Section 114', 'Section 324', 'Guest Services'],
      babyChanging: ['Family restrooms throughout stadium', 'Bernie\'s Dugout area'],
      nursingRooms: ['Guest Services areas', 'Family-friendly zones'],
      atms: ['All concourse levels', 'Near major concession stands'],
      wifi: { available: true, network: 'Brewers WiFi', freeZones: ['All public areas'] },
      chargingStations: ['Club Level', 'Premium seating areas'],
      kidZones: [
        { name: 'Bernie\'s Dugout', location: 'Behind home plate', activities: ['Playground', 'Speed pitch', 'Interactive games'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible', 'Designated wheelchair sections throughout'],
        entrance: 'All gates accessible',
        elevators: ['Multiple elevators to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels', 'Family restrooms available'],
      accessibleConcessions: ['All major concession stands'],
      parkingSpaces: 'Accessible parking in all lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive Early for Tailgating', description: 'Milwaukee has the best tailgating culture in MLB - arrive 3-4 hours early', category: 'arrival' },
        { title: 'Racing Sausages Experience', description: 'The famous sausage race happens between the 6th and 7th innings', category: 'experience' },
        { title: 'Bernie\'s Celebration', description: 'Watch Bernie Brewer slide down his chalet after home runs', category: 'experience' },
        { title: 'Roof Status Check', description: 'Check if the roof will be open or closed before choosing seats', category: 'weather' },
        { title: 'Try Local Specialties', description: 'Don\'t miss the cheese curds and bratwurst - Milwaukee classics', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: '2.5 hours before first pitch',
        firstPitch: 'Varies by game',
        rushHours: ['1 hour before first pitch', '7th inning stretch', 'Post-game']
      },
      security: {
        allowedBags: 'Bags smaller than 16"x16"x8"',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    
    neighborhood: {
      name: 'Miller Park Way',
      description: 'Primarily a stadium district with extensive parking and tailgating areas, surrounded by residential neighborhoods.',
      beforeGame: ['Tailgating in stadium lots', 'Nearby sports bars', 'Restaurants on Miller Park Way'],
      afterGame: ['Continue tailgating', 'Local taverns', 'Milwaukee breweries downtown'],
      radius: '1 mile from stadium has limited dining, but great tailgating culture'
    },
    
    transportation: {
      address: '1 Brewers Way, Milwaukee, WI 53214',
      publicTransit: {
        bus: [
          { routes: ['Route 90 (Miller Park Express)'], stops: ['Direct service from downtown'] },
          { routes: ['Multiple MCTS routes'], stops: ['Various stops near stadium'] }
        ]
      },
      driving: {
        majorRoutes: ['I-94', 'US-41', 'Miller Park Way'],
        typicalTraffic: 'Heavy congestion 1-2 hours before games',
        bestApproach: 'I-94 to Miller Park Way exit'
      },
      rideShare: {
        pickupZone: 'Lot E designated area',
        dropoffZone: 'Drop-off zones at all gates',
        surgePricing: 'High demand during games',
        alternativeTip: 'Consider park and ride options'
      }
    },
    
    history: {
      timeline: [
        { year: 1953, event: 'Brewers move from St. Louis to Milwaukee' },
        { year: 1970, event: 'Brewers move to County Stadium' },
        { year: 2001, event: 'Miller Park opens with retractable roof' },
        { year: 2021, event: 'Renamed to American Family Field' }
      ],
      notableGames: [
        { date: '2008-09-28', description: 'Brewers clinch wild card, ending 26-year playoff drought' },
        { date: '2011-10-16', description: 'Brewers win NLCS Game 6 to reach World Series' }
      ],
      traditions: [
        { name: 'Racing Sausages', description: 'Five sausage mascots race around the bases during the 6th inning' },
        { name: 'Bernie Brewer\'s Slide', description: 'Bernie slides down his chalet after home runs' },
        { name: 'Tailgating Culture', description: 'Legendary pre-game tailgating parties in parking lots' }
      ],
      retired: [
        { number: '4', player: 'Paul Molitor', year: 1999 },
        { number: '19', player: 'Robin Yount', year: 1994 },
        { number: '34', player: 'Rollie Fingers', year: 1992 },
        { number: '44', player: 'Hank Aaron', year: 1976 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Family-friendly with the best tailgating culture in baseball. Passionate fans create electric atmosphere during playoff runs.',
      bestExperiences: [
        'Pre-game tailgating with grills and games',
        'Racing Sausages during 6th inning',
        'Bernie Brewer\'s home run slide',
        'Retractable roof opening/closing',
        'Friday\'s Front Row dining experience'
      ],
      traditions: [
        'Sausage racing',
        'Bernie\'s home run celebration',
        'Tailgating culture',
        '"Roll Out the Barrel" music',
        'Wisconsin polka music'
      ],
      music: 'Polka music, "Roll Out the Barrel," traditional Milwaukee songs',
      mascot: { name: 'Bernie Brewer', description: 'Mustachioed mascot who slides down a chalet after home runs' },
      fanGroups: [
        { name: 'Tailgating Groups', section: 'Parking lots', description: 'Organized tailgating parties throughout lots' },
        { name: 'Brewers Deck regulars', section: 'Right field upper deck', description: 'Season ticket holders with all-inclusive experience' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Arrive 3-4 hours early to experience the legendary tailgating',
        'Friday\'s Front Row offers unlimited food with some ticket packages',
        'Bernie\'s Dugout is perfect for families with young children',
        'Club Level has indoor/outdoor seating options'
      ],
      avoidThese: [
        'Don\'t miss the sausage race - it\'s a Milwaukee tradition',
        'Avoid driving close to game time - traffic gets very heavy',
        'Don\'t skip the cheese curds - they\'re a local specialty'
      ],
      hiddenGems: [
        'Uecker seats offer great value despite obstructed views',
        'Miller Lite Patio has games and social atmosphere',
        'Upper deck concourse has great stadium views',
        'Harley-Davidson Deck features motorcycle displays'
      ],
      photoSpots: [
        'Bernie Brewer\'s chalet and slide',
        'Racing sausage statues',
        'Retractable roof mechanism',
        'Milwaukee skyline from upper deck'
      ],
      bestValue: [
        'Terrace Reserved sections for budget-conscious fans',
        'Brewers Deck all-inclusive experience',
        'Weekday games for lower ticket prices',
        'Upper deck seats with great views at lower cost'
      ]
    }
  },

  'cardinals': {
    id: 'cardinals',
    name: 'Busch Stadium',
    team: 'St. Louis Cardinals',
    opened: 2006,
    capacity: 45494,
    
    overview: {
      description: 'Busch Stadium is a modern ballpark featuring spectacular views of the Gateway Arch and downtown St. Louis skyline. Known for its passionate fan base, "The Best Fans in Baseball," and the iconic red brick facade.',
      highlights: [
        'Spectacular Gateway Arch views from upper deck',
        'Red brick facade matching downtown architecture',
        'Cardinals Hall of Fame and Museum',
        'Ballpark Village entertainment district adjacent'
      ],
      uniqueFeatures: [
        'Gateway Arch visible from upper deck seats',
        'Cardinals Hall of Fame and Museum',
        'Stan Musial statue at home plate entrance',
        'Budweiser Terrace rooftop seating',
        'Green roof above left field'
      ],
      renovations: [
        { year: 2019, description: 'Ballpark Village Phase II completion' },
        { year: 2017, description: 'New video boards and sound system' },
        { year: 2014, description: 'Cardinals Hall of Fame expansion' }
      ],
      previousNames: ['New Busch Stadium']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side sections 131-144', 'Green seats 239-250', 'Terrace level 346-360'],
        afternoon: ['First base side sections 145-158', 'Pavilion sections 297-334', 'Upper deck 346-375'],
        evening: ['Behind home plate', 'Most infield sections shaded', 'Club level seating']
      },
      coveredSeating: ['Redbird Club', 'Champions Club', 'All club level sections'],
      shadeTips: [
        'Third base side gets shade first in day games',
        'Upper deck overhangs protect Green Seats below',
        'Club level has climate-controlled areas',
        'Avoid right field bleachers for afternoon games'
      ],
      sunProtection: {
        sunscreenStations: ['Section 135', 'Section 254', 'Section 350'],
        shadedConcourses: ['All concourse levels', 'Cardinals Hall of Fame'],
        indoorAreas: ['Cardinals Hall of Fame', 'Champions Club', 'Team Store']
      },
      worstSunExposure: ['Right field Pavilion 297-314', 'Bleachers sections', 'Left field Green Seats 235-245'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 60, rainChance: 40, typicalConditions: 'Cool spring weather', shadeTip: 'Layers recommended, minimal shade needed' },
        { month: 'May', avgTemp: 70, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring weather', shadeTip: 'Perfect weather for any seat' },
        { month: 'June', avgTemp: 80, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 85, avgHumidity: 75, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Third base side preferred for day games' },
        { month: 'August', avgTemp: 84, avgHumidity: 74, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck shade essential' },
        { month: 'September', avgTemp: 75, avgHumidity: 68, rainChance: 25, typicalConditions: 'Pleasant fall weather', shadeTip: 'Great weather, most seats comfortable' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Redbird Club', perks: ['All-inclusive dining', 'Climate control', 'Premium bar'], access: 'Field level behind home plate' },
          { name: 'Champions Club', perks: ['Upscale dining', 'Premium views', 'VIP entrance'], access: 'Club level sections 244-264' },
          { name: 'Home Plate Club', perks: ['Field-level dining', 'Behind home plate', 'Premium service'], access: 'Field level sections 140-148' }
        ],
        suites: { levels: ['Infield Club Level', 'Luxury Suite Level'], amenities: ['Private bathrooms', 'Catering', 'Climate control', 'Premium TVs'] },
        specialAreas: [
          { name: 'Budweiser Terrace', description: 'Rooftop seating with Arch views', capacity: 200 },
          { name: 'Ford MVP Club', description: 'All-inclusive premium experience', capacity: 100 }
        ]
      },
      budgetOptions: ['Pavilion sections 297-334', 'Upper Reserved 335-375', 'Standing Room Only areas'],
      familySections: ['Redbird Rookies area', 'Family sections throughout upper deck'],
      standingRoom: ['Multiple SRO areas', 'Budweiser Terrace', 'Concourse areas'],
      partyAreas: [
        { name: 'Budweiser Terrace', capacity: '200', amenities: ['All-you-can-eat', 'Premium bar', 'Arch views'] },
        { name: 'PNC Rivals Sports Bar', capacity: '150', amenities: ['Full bar', 'HD TVs', 'Games'] }
      ],
      tips: [
        { section: 'Green Seats 239-250', tip: 'Great value with good views and some shade', category: 'value' },
        { section: 'Budweiser Terrace', tip: 'Best views of Gateway Arch with all-inclusive pricing', category: 'view' },
        { section: 'Redbird Club', tip: 'All-inclusive premium experience behind home plate', category: 'experience' },
        { section: 'Upper deck 346-360', tip: 'Best budget seats with Arch views', category: 'view' }
      ]
    },
    
    concessions: {
      signature: ['Pork steak sandwiches', 'St. Paul sandwiches', 'Gooey butter cake', 'Toasted ravioli', 'Cardinals red hot dogs'],
      local: ['Anheuser-Busch beer products', 'Ted Drewes frozen custard', 'Imo\'s Pizza', 'Sugarfire BBQ', 'Schlafly beer'],
      healthy: ['Fresh salads', 'Grilled chicken', 'Veggie wraps', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza options', 'Salads', 'Pretzel options'],
      glutenFree: ['Gluten-free beer', 'Certified concessions available'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy', 'Ice cream', 'Pretzels'],
      alcohol: {
        beer: ['Budweiser', 'Bud Light', 'Michelob Ultra', 'Stella Artois', 'Schlafly', 'Local craft breweries'],
        wine: true,
        cocktails: true,
        localBreweries: ['Schlafly', 'Urban Chestnut', '4 Hands Brewing']
      }
    },
    
    parking: {
      lots: [
        { name: 'Stadium East Garage', distance: 'Adjacent to stadium', price: '$25-40', shadedSpots: true, covered: true, tip: 'Covered parking, closest to gates' },
        { name: 'Stadium West Garage', distance: 'Adjacent to stadium', price: '$25-40', shadedSpots: true, covered: true, tip: 'Connected to Ballpark Village' },
        { name: 'Surface Lots A-G', distance: '0.1-0.4 miles', price: '$15-25', shadedSpots: false, covered: false, tip: 'Various price points' },
        { name: 'Downtown Lots', distance: '0.5-1 mile', price: '$10-20', shadedSpots: false, covered: false, tip: 'Walk through downtown' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered and time-limited downtown',
        tip: 'Limited availability near stadium'
      },
      alternativeTransport: {
        publicTransit: ['MetroLink light rail to Stadium station', 'Multiple bus routes'],
        rideShare: 'Designated zones at Ballpark Village',
        bicycle: 'Bike racks at all stadium entrances'
      }
    },
    
    gates: [
      { name: 'Gate 1 (Stan Musial Gate)', location: 'Home plate entrance', bestFor: ['Behind home plate', 'Club level', 'Premium seating'], openTime: '2 hours before first pitch', tip: 'Main entrance with Musial statue' },
      { name: 'Gate 2', location: 'First base side', bestFor: ['Right field sections', 'Upper deck'], openTime: '2 hours before first pitch' },
      { name: 'Gate 3', location: 'Left field', bestFor: ['Left field sections', 'Pavilion'], openTime: '2 hours before first pitch' },
      { name: 'Gate 5', location: 'Third base side', bestFor: ['Third base sections', 'Cardinals Hall of Fame'], openTime: '2 hours before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Cardinals Authentics (main team store)', exclusive: ['Authentic jerseys', 'World Series merchandise'] },
        { location: 'Hall of Fame gift shop', exclusive: ['Historical memorabilia'] },
        { location: 'Concourse stands throughout stadium' }
      ],
      firstAid: ['Section 142', 'Section 249', 'Guest Services'],
      babyChanging: ['Family restrooms throughout stadium', 'Redbird Rookies area'],
      nursingRooms: ['Guest Services locations', 'Family-friendly areas'],
      atms: ['All concourse levels', 'Ballpark Village'],
      wifi: { available: true, network: 'Cardinals WiFi', freeZones: ['All public areas'] },
      chargingStations: ['Club level', 'Premium seating areas'],
      kidZones: [
        { name: 'Redbird Rookies', location: 'Upper level', activities: ['Interactive games', 'Kids activities', 'Photo opportunities'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Accessible sections on all levels'],
        entrance: 'All gates wheelchair accessible',
        elevators: ['Multiple elevators throughout stadium']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels with accessible facilities'],
      accessibleConcessions: ['All major concession areas'],
      parkingSpaces: 'Accessible parking in all garages and lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Visit Cardinals Hall of Fame', description: 'Arrive early to explore the Cardinals Hall of Fame and Museum', category: 'experience' },
        { title: 'Gateway Arch Views', description: 'Upper deck seats offer spectacular views of the Gateway Arch', category: 'experience' },
        { title: 'Ballpark Village', description: 'Pre and post-game entertainment district adjacent to stadium', category: 'experience' },
        { title: 'Try Local Specialties', description: 'Don\'t miss pork steak sandwiches and gooey butter cake', category: 'food' },
        { title: 'Stan Musial Statue', description: 'Photo opportunity at the main entrance', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: '2.5 hours before first pitch',
        firstPitch: 'Varies by game',
        rushHours: ['1 hour before first pitch', '7th inning stretch', 'Post-game']
      },
      security: {
        allowedBags: 'Bags smaller than 16"x16"x8"',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    
    neighborhood: {
      name: 'Downtown St. Louis',
      description: 'Located in downtown St. Louis with the adjacent Ballpark Village entertainment district and easy access to the Gateway Arch.',
      beforeGame: ['Ballpark Village restaurants and bars', 'Downtown dining', 'Gateway Arch visits'],
      afterGame: ['Ballpark Village nightlife', 'Downtown bars', 'Riverfront area'],
      radius: 'Multiple dining and entertainment options within walking distance'
    },
    
    transportation: {
      address: '700 Clark Ave, St. Louis, MO 63102',
      publicTransit: {
        train: [
          { lines: ['MetroLink Red Line', 'Blue Line'], station: 'Stadium station', walkTime: '2 minutes' }
        ],
        bus: [
          { routes: ['Multiple MetroBus routes'], stops: ['Downtown stops within walking distance'] }
        ]
      },
      driving: {
        majorRoutes: ['I-64', 'I-70', 'I-55', 'Highway 40'],
        typicalTraffic: 'Heavy downtown congestion during games',
        bestApproach: 'I-64 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Ballpark Village designated areas',
        dropoffZone: 'Multiple drop-off zones around stadium',
        surgePricing: 'High during games and events',
        alternativeTip: 'MetroLink is often faster than driving'
      }
    },
    
    history: {
      timeline: [
        { year: 1882, event: 'Cardinals franchise established' },
        { year: 1966, event: 'Original Busch Stadium opens' },
        { year: 2006, event: 'New Busch Stadium opens' },
        { year: 2014, event: 'Ballpark Village opens' }
      ],
      notableGames: [
        { date: '2006-04-10', description: 'First game at new Busch Stadium' },
        { date: '2011-10-28', description: 'World Series Game 7 victory over Texas Rangers' },
        { date: '2006-10-27', description: 'World Series championship celebration' }
      ],
      traditions: [
        { name: 'Rally Squirrel', description: 'Famous squirrel that ran across field during 2011 playoffs' },
        { name: 'Cardinals Way', description: 'Traditional approach to baseball excellence' },
        { name: 'Red Sea', description: 'Fans wearing red throughout stadium' }
      ],
      retired: [
        { number: '1', player: 'Ozzie Smith', year: 1996 },
        { number: '2', player: 'Red Schoendienst', year: 1996 },
        { number: '6', player: 'Stan Musial', year: 1963 },
        { number: '14', player: 'Ken Boyer', year: 1984 },
        { number: '17', player: 'Dizzy Dean', year: 1974 },
        { number: '20', player: 'Lou Brock', year: 1979 },
        { number: '23', player: 'Ted Simmons', year: 2019 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '45', player: 'Bob Gibson', year: 1975 },
        { number: '85', player: 'August Busch Jr.', year: 1984 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Passionate, knowledgeable fans known as "The Best Fans in Baseball." Rich tradition and strong baseball culture.',
      bestExperiences: [
        'Cardinals Hall of Fame and Museum tour',
        'Gateway Arch views from upper deck',
        'Ballpark Village entertainment',
        'Stan Musial statue photo opportunity',
        'Traditional Cardinals baseball atmosphere'
      ],
      traditions: [
        'Red Sea of Cardinals fans',
        'Cardinals Way tradition',
        '"Here Comes the King" Budweiser song',
        'Rally towels and noise makers',
        'Standing ovations for great plays'
      ],
      music: '"Here Comes the King," organ music, traditional baseball songs',
      mascot: { name: 'Fredbird', description: 'Red cardinal mascot who entertains fans throughout games' },
      fanGroups: [
        { name: 'Cardinals Nation', description: 'Widespread fan base throughout Midwest' },
        { name: 'Season ticket holders', section: 'Various premium areas', description: 'Loyal long-term fans with deep baseball knowledge' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Visit Cardinals Hall of Fame before or after games',
        'Upper deck seats offer best Gateway Arch views',
        'Ballpark Village has great pre/post-game atmosphere',
        'MetroLink is often faster than driving'
      ],
      avoidThese: [
        'Avoid right field pavilion for day games due to sun exposure',
        'Don\'t drive if you can take MetroLink',
        'Skip expensive downtown parking for nearby alternatives'
      ],
      hiddenGems: [
        'Upper deck concourse has great city views',
        'Cardinals Hall of Fame has rare memorabilia',
        'Budweiser Terrace offers unique rooftop experience',
        'Stan Musial statue area is great for photos'
      ],
      photoSpots: [
        'Stan Musial statue at main entrance',
        'Gateway Arch views from upper deck',
        'Cardinals Hall of Fame displays',
        'Field views from Budweiser Terrace'
      ],
      bestValue: [
        'Green Seats sections for good views at reasonable prices',
        'Upper Reserved for budget-conscious fans with Arch views',
        'Standing room areas during sold-out games',
        'Weekday games for lower ticket prices'
      ]
    }
  },

  'cubs': {
    id: 'cubs',
    name: 'Wrigley Field',
    team: 'Chicago Cubs',
    opened: 1914,
    capacity: 41649,
    
    overview: {
      description: 'Wrigley Field is the second-oldest ballpark in MLB, famous for its ivy-covered outfield walls, iconic marquee, and Wrigleyville neighborhood atmosphere. Known as "The Friendly Confines," it combines historic charm with modern amenities.',
      highlights: [
        'Second-oldest MLB ballpark (1914)',
        'Iconic ivy-covered outfield walls',
        'Famous Wrigley Field marquee',
        'Wrigleyville neighborhood atmosphere',
        'Manual scoreboard operated by hand'
      ],
      uniqueFeatures: [
        'Ivy-covered brick outfield walls',
        'Manual scoreboard in center field',
        'Rooftop seating across the street',
        'Wind patterns affect gameplay significantly',
        'Gallagher Way entertainment area',
        'Green Line L tracks visible from upper deck'
      ],
      renovations: [
        { year: 2019, description: 'Gallagher Way and Park at Wrigley completed' },
        { year: 2016, description: 'Video boards added, maintaining historic character' },
        { year: 2014, description: '1060 Project renovation began' },
        { year: 1988, description: 'Lights installed for night games' }
      ],
      previousNames: ['Weeghman Park', 'Cubs Park']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['First base side sections 108-120', 'Club Box 13-25', 'Upper deck 205-220'],
        afternoon: ['Third base side sections 127-142', 'Upper deck 230-240', 'Bleacher Reserved'],
        evening: ['Behind home plate sections', 'Most infield seating', 'Upper deck infield']
      },
      coveredSeating: ['Club Level sections', 'Some upper deck under overhangs'],
      shadeTips: [
        'Third base side gets afternoon shade in summer',
        'Upper deck overhangs provide limited shade',
        'Bleacher seats have no shade coverage',
        'Wind direction affects comfort more than shade'
      ],
      sunProtection: {
        sunscreenStations: ['Section 114', 'Bleacher concourse', 'Upper deck concourse'],
        shadedConcourses: ['Upper and lower concourses', 'Club level areas'],
        indoorAreas: ['Cubs Store', 'Clark Street concessions', 'Premium clubs']
      },
      worstSunExposure: ['Left field bleachers', 'Right field bleachers', 'Field Box 101-107'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 65, rainChance: 40, typicalConditions: 'Cool and windy off Lake Michigan', shadeTip: 'Layer clothing, wind more important than shade' },
        { month: 'May', avgTemp: 65, avgHumidity: 60, rainChance: 35, typicalConditions: 'Pleasant spring weather', shadeTip: 'Perfect weather for bleacher seats' },
        { month: 'June', avgTemp: 75, avgHumidity: 65, rainChance: 30, typicalConditions: 'Warm with lake breeze', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 80, avgHumidity: 70, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Third base side preferred for day games' },
        { month: 'August', avgTemp: 79, avgHumidity: 72, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck provides some relief' },
        { month: 'September', avgTemp: 72, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant fall weather', shadeTip: 'Great weather for any seat' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: '1914 Club', perks: ['All-inclusive dining', 'Private entrance', 'Premium views'], access: 'Field level behind home plate' },
          { name: 'Catalina Club', perks: ['Upscale dining', 'Full bar', 'Climate control'], access: 'Upper club level' },
          { name: 'Dugout Box', perks: ['Field level seating', 'Premium location', 'Wait service'], access: 'Behind dugouts' }
        ],
        suites: { levels: ['Club Level', 'Terrace Level'], amenities: ['Private bathrooms', 'Catering options', 'Premium TVs', 'Wait service'] },
        specialAreas: [
          { name: 'Rooftop Seating', description: 'Privately owned buildings across the street', capacity: 1500 },
          { name: 'Gallagher Way', description: 'Entertainment area behind stadium', capacity: 1000 }
        ]
      },
      budgetOptions: ['Upper deck Reserve 201-244', 'Bleacher Reserved', 'Standing Room Only'],
      familySections: ['Family sections in upper deck', 'Kid-friendly bleacher areas'],
      standingRoom: ['Multiple SRO areas', 'Gallagher Way', 'Concourse standing areas'],
      partyAreas: [
        { name: 'Budweiser Bleachers', capacity: '5000+', amenities: ['Social atmosphere', 'Concession stands', 'Traditional bleacher experience'] },
        { name: 'Gallagher Way', capacity: '1000', amenities: ['Entertainment', 'Food trucks', 'Family activities'] }
      ],
      tips: [
        { section: 'Bleacher seats', tip: 'Best atmosphere and fan experience, no shade', category: 'experience' },
        { section: 'Club Box 13-25', tip: 'Close to field with some afternoon shade', category: 'shade' },
        { section: 'Upper deck 205-220', tip: 'Great views with better shade than lower level', category: 'view' },
        { section: 'Rooftops across street', tip: 'Unique experience with all-inclusive packages', category: 'experience' }
      ]
    },
    
    concessions: {
      signature: ['Chicago-style hot dogs', 'Italian beef sandwiches', 'Deep-dish pizza slices', 'Old Style beer', 'Garrett Popcorn'],
      local: ['Portillo\'s Italian beef', 'Lou Malnati\'s pizza', 'Vienna Beef hot dogs', 'Goose Island beer', 'Eli\'s cheesecake'],
      healthy: ['Fresh salads', 'Grilled options', 'Veggie wraps'],
      vegetarian: ['Veggie burgers', 'Pizza options', 'Salads', 'Pretzel varieties'],
      glutenFree: ['Gluten-free beer', 'Certified concessions in premium areas'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy', 'Ice cream', 'Cracker Jack'],
      alcohol: {
        beer: ['Old Style', 'Budweiser', 'Goose Island', 'Revolution Brewing', 'Local Chicago craft breweries'],
        wine: true,
        cocktails: true,
        localBreweries: ['Goose Island', 'Revolution Brewing', 'Half Acre', '3 Floyds']
      }
    },
    
    parking: {
      lots: [
        { name: 'Gallagher Way Lot', distance: 'Adjacent to stadium', price: '$35-50', shadedSpots: false, covered: false, tip: 'Closest to stadium, premium pricing' },
        { name: 'Wrigley Field Premium Lot', distance: '0.1 miles', price: '$30-45', shadedSpots: false, covered: false, tip: 'Official stadium parking' },
        { name: 'Private Wrigleyville Lots', distance: '0.2-0.5 miles', price: '$20-35', shadedSpots: false, covered: false, tip: 'Multiple small lots throughout neighborhood' },
        { name: 'Residential Street Parking', distance: '0.3-0.8 miles', price: '$15-25', shadedSpots: true, covered: false, tip: 'Limited availability, arrive early' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Permit parking in most residential areas, metered during games',
        tip: 'Very limited availability, arrive 2+ hours early'
      },
      alternativeTransport: {
        publicTransit: ['Red Line to Addison (2 blocks)', 'Multiple bus routes to Wrigleyville'],
        rideShare: 'Heavy traffic, consider walking from nearby drop-off',
        bicycle: 'Bike racks available, popular option from downtown'
      }
    },
    
    gates: [
      { name: 'Gate K (Clark & Addison)', location: 'Main entrance', bestFor: ['Field level', 'Club level', 'Behind home plate'], openTime: '2 hours before first pitch', tip: 'Historic main entrance under marquee' },
      { name: 'Gate D (Sheffield)', location: 'Right field side', bestFor: ['Right field sections', 'Bleachers'], openTime: '2 hours before first pitch' },
      { name: 'Gate N (Waveland)', location: 'Left field side', bestFor: ['Left field sections', 'Bleachers'], openTime: '2 hours before first pitch' },
      { name: 'Gallagher Way Gate', location: 'Behind stadium', bestFor: ['Upper deck', 'Gallagher Way access'], openTime: '2 hours before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Cubs Store (Clark Street)', exclusive: ['Authentic jerseys', 'World Series championship gear'] },
        { location: 'Bleacher concourse stands', exclusive: ['Bleacher-specific merchandise'] },
        { location: 'Multiple concourse locations throughout stadium' }
      ],
      firstAid: ['Section 108', 'Section 217', 'Bleacher first aid station'],
      babyChanging: ['Family restrooms throughout stadium', 'Cubs family areas'],
      nursingRooms: ['Guest services areas', 'Family-friendly sections'],
      atms: ['All concourse levels', 'Clark Street entrance'],
      wifi: { available: true, network: 'Cubs WiFi', freeZones: ['All public areas'] },
      chargingStations: ['Club level', 'Premium seating areas'],
      kidZones: [
        { name: 'Gallagher Way Kids Area', location: 'Behind stadium', activities: ['Playground', 'Interactive games', 'Photo opportunities'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Accessible sections throughout stadium'],
        entrance: 'All main gates wheelchair accessible',
        elevators: ['Limited elevators due to historic nature']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels with accessible facilities'],
      accessibleConcessions: ['Major concession areas'],
      parkingSpaces: 'Limited accessible parking due to urban location'
    },
    
    gameDay: {
      tips: [
        { title: 'Arrive Early for Wrigleyville', description: 'Explore bars and restaurants in Wrigleyville before games', category: 'arrival' },
        { title: 'Check Wind Direction', description: 'Wind greatly affects gameplay - check flags on foul poles', category: 'weather' },
        { title: 'Ivy Wall Rules', description: 'Balls in ivy are ground rule doubles', category: 'experience' },
        { title: 'Manual Scoreboard', description: 'Watch the manual scoreboard operation in center field', category: 'experience' },
        { title: 'Take the L', description: 'Red Line to Addison is easiest transportation option', category: 'arrival' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: '2.5 hours before first pitch',
        firstPitch: 'Varies by game',
        rushHours: ['1 hour before first pitch', '7th inning stretch', 'Post-game L station']
      },
      security: {
        allowedBags: 'Bags smaller than 16"x16"x8"',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    
    neighborhood: {
      name: 'Wrigleyville',
      description: 'Historic neighborhood centered around Wrigley Field with numerous bars, restaurants, and entertainment venues within walking distance.',
      beforeGame: ['Murphy\'s Bleachers', 'Sluggers World Class Sports Bar', 'Gallagher Way events', 'Clark Street bars and restaurants'],
      afterGame: ['Wrigleyville bar scene', 'Late-night dining options', 'Red Line back to downtown'],
      radius: '3-block radius packed with Cubs-themed establishments'
    },
    
    transportation: {
      address: '1060 W Addison St, Chicago, IL 60613',
      publicTransit: {
        train: [
          { lines: ['CTA Red Line'], station: 'Addison', walkTime: '2 blocks' }
        ],
        bus: [
          { routes: ['#152 Addison', '#80 Irving Park'], stops: ['Multiple stops near stadium'] }
        ]
      },
      driving: {
        majorRoutes: ['Lake Shore Drive', 'Kennedy Expressway (I-90/94)', 'Addison Street'],
        typicalTraffic: 'Very heavy congestion, limited parking',
        bestApproach: 'Avoid driving if possible, take public transit'
      },
      rideShare: {
        pickupZone: 'Designated areas several blocks from stadium',
        dropoffZone: 'Drop-off zones away from main entrances',
        surgePricing: 'Very high during games',
        alternativeTip: 'Red Line much faster and cheaper than ride-share'
      }
    },
    
    history: {
      timeline: [
        { year: 1914, event: 'Weeghman Park opens' },
        { year: 1916, event: 'Cubs begin playing at stadium' },
        { year: 1937, event: 'Ivy planted on outfield walls' },
        { year: 1988, event: 'Lights installed for night games' },
        { year: 2016, event: 'Cubs win World Series after 108-year drought' }
      ],
      notableGames: [
        { date: '2016-11-02', description: 'Cubs win World Series Game 7 (in Cleveland)' },
        { date: '1932-10-01', description: 'Babe Ruth\'s alleged "called shot"' },
        { date: '1984-06-23', description: 'Ryne Sandberg\'s "Sandberg Game"' }
      ],
      traditions: [
        { name: 'Ivy-covered walls', description: 'Iconic ivy planted in 1937, creates unique ground rules' },
        { name: 'Manual scoreboard', description: 'Hand-operated scoreboard in center field' },
        { name: 'W Flag', description: 'White W flag raised after Cubs wins' },
        { name: 'Take Me Out to the Ballgame', description: '7th inning stretch tradition with guest conductors' }
      ],
      retired: [
        { number: '10', player: 'Ron Santo', year: 2003 },
        { number: '14', player: 'Ernie Banks', year: 1982 },
        { number: '23', player: 'Ryne Sandberg', year: 2005 },
        { number: '26', player: 'Billy Williams', year: 1987 },
        { number: '31', player: 'Ferguson Jenkins', year: 2009 },
        { number: '31', player: 'Greg Maddux', year: 2009 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '17', player: 'Mark Grace', year: 2017 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Historic, friendly atmosphere with passionate fans. Wrigleyville provides unique urban ballpark experience with neighborhood feel.',
      bestExperiences: [
        'Bleacher seat atmosphere and fan culture',
        'Manual scoreboard operation viewing',
        'Wrigleyville bar scene before/after games',
        'Ivy wall and brick outfield architecture',
        'W flag celebration after wins'
      ],
      traditions: [
        'Throwing back opposing team home runs',
        'W flag after wins, L flag after losses',
        '7th inning stretch with guest conductors',
        'Bleacher Bums fan culture',
        '"Go Cubs Go" victory song'
      ],
      music: '"Go Cubs Go," organ music, "Take Me Out to the Ballgame"',
      mascot: { name: 'Clark the Cub', description: 'Friendly bear mascot introduced in 2014' },
      fanGroups: [
        { name: 'Bleacher Bums', section: 'Bleacher seats', description: 'Passionate fan group known for heckling and atmosphere' },
        { name: 'Rooftop fans', section: 'Buildings across street', description: 'Unique viewing experience from private rooftops' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Take Red Line to Addison - much easier than driving',
        'Bleacher seats offer best fan experience despite no shade',
        'Manual scoreboard is operated by hand during games',
        'Check wind direction - affects gameplay significantly'
      ],
      avoidThese: [
        'Don\'t drive unless absolutely necessary - parking nightmare',
        'Avoid bleachers for day games if sun-sensitive',
        'Don\'t leave early - you\'ll miss post-game Wrigleyville atmosphere'
      ],
      hiddenGems: [
        'Gallagher Way has free entertainment before games',
        'Upper deck has great neighborhood views',
        'Manual scoreboard area for close-up photos',
        'Rooftop experiences across the street'
      ],
      photoSpots: [
        'Wrigley Field marquee at Clark and Addison',
        'Ivy-covered outfield walls',
        'Manual scoreboard in center field',
        'W flag on foul pole after wins'
      ],
      bestValue: [
        'Bleacher seats for authentic Cubs experience',
        'Upper deck reserve for budget-friendly option with great views',
        'Standing room for sold-out games',
        'Weekday games for lower prices'
      ]
    }
  },

  'yankees': {
    id: 'yankees',
    name: 'Yankee Stadium',
    team: 'New York Yankees',
    opened: 2009,
    capacity: 47309,
    
    overview: {
      description: 'The new Yankee Stadium maintains the classic design elements of the original while incorporating modern amenities. Located in the Bronx, it features Monument Park and continues the legacy of "The House That Ruth Built."',
      highlights: [
        'Monument Park with Yankees legends',
        'Classic facade design from original stadium',
        'Great Hall entrance with historical displays',
        'Short right field porch (314 feet)',
        'Premium amenities throughout'
      ],
      uniqueFeatures: [
        'Monument Park beyond center field',
        'Classic frieze facade design',
        'Great Hall with Yankees history',
        'Yankee Museum and exhibits',
        'Premium club levels with full amenities',
        'Short right field dimensions favor lefty hitters'
      ],
      renovations: [
        { year: 2016, description: 'Added standing room areas' },
        { year: 2018, description: 'Expanded concession options' }
      ],
      previousNames: ['New Yankee Stadium']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['First base side sections 103-136', 'Legends Suite East', 'Tier Box 313-333'],
        afternoon: ['Third base side sections 137-203', 'Main Level West', 'Grandstand 401-433'],
        evening: ['Behind home plate sections', 'Most infield seating', 'Premium club areas']
      },
      coveredSeating: ['Legends Suite', 'Delta Sky360 Suite', 'All club level seating'],
      shadeTips: [
        'Third base side gets best afternoon shade',
        'Upper deck overhangs protect Tier seating',
        'Premium levels have climate control',
        'Avoid right field sections 103-106 for day games'
      ],
      sunProtection: {
        sunscreenStations: ['Section 114', 'Section 203', 'Section 420'],
        shadedConcourses: ['All concourse levels', 'Great Hall', 'Premium club areas'],
        indoorAreas: ['Yankees Museum', 'Great Hall', 'Premium clubs and restaurants']
      },
      worstSunExposure: ['Right field sections 103-114', 'Bleacher sections 202-239', 'Left field sections 201-205'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 60, avgHumidity: 60, rainChance: 35, typicalConditions: 'Cool spring weather', shadeTip: 'Light layers, minimal shade needed' },
        { month: 'May', avgTemp: 70, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant spring weather', shadeTip: 'Perfect weather for any seating' },
        { month: 'June', avgTemp: 78, avgHumidity: 70, rainChance: 25, typicalConditions: 'Warm and humid', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 83, avgHumidity: 75, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Third base side preferred for day games' },
        { month: 'August', avgTemp: 81, avgHumidity: 76, rainChance: 35, typicalConditions: 'Hot and humid with storms', shadeTip: 'Upper deck shade essential' },
        { month: 'September', avgTemp: 74, avgHumidity: 68, rainChance: 25, typicalConditions: 'Pleasant fall weather', shadeTip: 'Great weather, most seats comfortable' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Legends Suite', perks: ['All-inclusive dining', 'Premium entrance', 'Field-level access'], access: 'Behind home plate, field level' },
          { name: 'Delta Sky360 Suite', perks: ['All-inclusive experience', 'Premium bar', 'Climate control'], access: 'Suite level' },
          { name: 'Champions Suite', perks: ['Upscale dining', 'Premium views', 'VIP access'], access: 'Club level behind home plate' }
        ],
        suites: { levels: ['Suite Level', 'Championship Level'], amenities: ['Private bathrooms', 'Premium catering', 'Climate control', 'Premium TVs'] },
        specialAreas: [
          { name: 'Mohegan Sun Sports Bar', description: 'Center field sports bar and restaurant', capacity: 200 },
          { name: 'Hard Rock Cafe', description: 'Full-service restaurant in stadium', capacity: 150 }
        ]
      },
      budgetOptions: ['Grandstand 401-433', 'Bleacher sections 202-239', 'Standing Room Only areas'],
      familySections: ['Family sections throughout Grandstand', 'Kids areas near concessions'],
      standingRoom: ['Multiple SRO areas', 'Concourse standing sections'],
      partyAreas: [
        { name: 'Mohegan Sun Sports Bar', capacity: '200', amenities: ['Full bar', 'HD TVs', 'Game viewing'] },
        { name: 'Party City Party Deck', capacity: '100', amenities: ['Group seating', 'Private bar', 'Catering options'] }
      ],
      tips: [
        { section: 'Right field sections 103-106', tip: 'Short porch makes for exciting home run chances', category: 'experience' },
        { section: 'Legends Suite', tip: 'All-inclusive premium experience with field access', category: 'experience' },
        { section: 'Tier Box 313-333', tip: 'Great views with afternoon shade protection', category: 'shade' },
        { section: 'Grandstand 401-433', tip: 'Budget-friendly with good sight lines', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['Yankee Tavern specialties', 'New York pizza slices', 'Pastrami sandwiches', 'Hard Rock Cafe items', 'Pinstripe Bowl'],
      local: ['Nathan\'s Famous hot dogs', 'New York cheesecake', 'Lobel\'s steak sandwiches', 'Local NYC bagels', 'Junior\'s cheesecake'],
      healthy: ['Fresh salads', 'Grilled chicken options', 'Fresh fruit stands'],
      vegetarian: ['Veggie burgers', 'Pizza options', 'Salads', 'Vegetarian wraps'],
      glutenFree: ['Gluten-free options available', 'Certified concessions in premium areas'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy', 'Ice cream', 'Pretzels'],
      alcohol: {
        beer: ['Budweiser', 'Stella Artois', 'Modelo', 'Local NYC craft breweries'],
        wine: true,
        cocktails: true,
        localBreweries: ['Brooklyn Brewery', 'Bronx Brewery', 'Other Five Boroughs']
      }
    },
    
    parking: {
      lots: [
        { name: 'Yankee Stadium Garage', distance: 'Adjacent to stadium', price: '$35-50', shadedSpots: true, covered: true, tip: 'Covered parking, most convenient' },
        { name: 'Lot 1 (East)', distance: '0.1 miles', price: '$25-40', shadedSpots: false, covered: false, tip: 'Close to stadium, good for early arrival' },
        { name: 'Private Bronx Lots', distance: '0.2-0.5 miles', price: '$15-30', shadedSpots: false, covered: false, tip: 'Various neighborhood lots' },
        { name: 'Off-site Park & Ride', distance: '1-2 miles', price: '$10-20', shadedSpots: false, covered: false, tip: 'Shuttle service provided' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited street parking, mostly residential permit areas',
        tip: 'Very limited availability, arrive 2+ hours early'
      },
      alternativeTransport: {
        publicTransit: ['4, 6, B, D subway lines to 161st Street-Yankee Stadium', 'Multiple bus routes'],
        rideShare: 'Designated pickup/drop-off areas near stadium',
        bicycle: 'Limited bike parking available'
      }
    },
    
    gates: [
      { name: 'Gate 2 (Great Hall)', location: 'Main entrance', bestFor: ['Field level', 'Premium seating', 'Behind home plate'], openTime: '2 hours before first pitch', tip: 'Main entrance with Yankees Museum access' },
      { name: 'Gate 4', location: 'Right field side', bestFor: ['Right field sections', 'Bleachers'], openTime: '2 hours before first pitch' },
      { name: 'Gate 6', location: 'Left field side', bestFor: ['Left field sections', 'Upper deck'], openTime: '2 hours before first pitch' },
      { name: 'Gate 8', location: 'Third base side', bestFor: ['Third base sections', 'Grandstand'], openTime: '2 hours before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Yankees Clubhouse Shop (Great Hall)', exclusive: ['Authentic jerseys', 'Championship merchandise'] },
        { location: 'Monument Park gift shop', exclusive: ['Historical memorabilia'] },
        { location: 'Multiple concourse locations throughout stadium' }
      ],
      firstAid: ['Section 114', 'Section 314', 'Guest Services'],
      babyChanging: ['Family restrooms throughout stadium', 'Premium club areas'],
      nursingRooms: ['Guest services areas', 'Family-friendly sections'],
      atms: ['All concourse levels', 'Great Hall area'],
      wifi: { available: true, network: 'Yankees WiFi', freeZones: ['All public areas'] },
      chargingStations: ['Club level', 'Premium seating areas', 'Great Hall'],
      kidZones: [
        { name: 'Kids Clubhouse', location: 'Upper level', activities: ['Interactive games', 'Photo opportunities', 'Yankees activities'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Accessible sections throughout all levels'],
        entrance: 'All gates wheelchair accessible',
        elevators: ['Multiple elevators to all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels with accessible facilities'],
      accessibleConcessions: ['All major concession areas'],
      parkingSpaces: 'Accessible parking in garage and lots'
    },
    
    gameDay: {
      tips: [
        { title: 'Visit Monument Park', description: 'Arrive early to tour Monument Park with Yankees legends', category: 'experience' },
        { title: 'Great Hall Experience', description: 'Explore Yankees history displays in the Great Hall', category: 'experience' },
        { title: 'Take the Subway', description: '4, 6, B, D trains directly to stadium', category: 'arrival' },
        { title: 'Right Field Short Porch', description: 'Sit in right field to see potential home runs over short porch', category: 'experience' },
        { title: 'Premium Dining', description: 'Try upscale dining options throughout the stadium', category: 'food' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: '2.5 hours before first pitch',
        firstPitch: 'Varies by game',
        rushHours: ['1 hour before first pitch', '7th inning stretch', 'Post-game subway']
      },
      security: {
        allowedBags: 'Bags smaller than 16"x16"x8"',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    
    neighborhood: {
      name: 'South Bronx',
      description: 'Stadium is located in the South Bronx with limited immediate dining, but easy subway access to Manhattan.',
      beforeGame: ['Stadium concessions', 'Limited local restaurants', 'Manhattan dining before subway ride'],
      afterGame: ['Return to Manhattan via subway', 'Limited local nightlife'],
      radius: 'Limited dining/entertainment within walking distance'
    },
    
    transportation: {
      address: '1 E 161st St, Bronx, NY 10451',
      publicTransit: {
        subway: [
          { lines: ['4', '6'], station: '161st Street-Yankee Stadium', walkTime: 'Direct access' },
          { lines: ['B', 'D'], station: '161st Street-Yankee Stadium', walkTime: 'Direct access' }
        ],
        bus: [
          { routes: ['Bx1', 'Bx2', 'Bx6'], stops: ['Multiple stops near stadium'] }
        ]
      },
      driving: {
        majorRoutes: ['Major Deegan Expressway (I-87)', 'Cross Bronx Expressway (I-95)', 'FDR Drive'],
        typicalTraffic: 'Heavy congestion during games',
        bestApproach: 'Major Deegan to 161st Street exit'
      },
      rideShare: {
        pickupZone: 'Designated areas around stadium',
        dropoffZone: 'Multiple drop-off zones',
        surgePricing: 'Very high during games',
        alternativeTip: 'Subway much faster and cheaper'
      }
    },
    
    history: {
      timeline: [
        { year: 1923, event: 'Original Yankee Stadium opens' },
        { year: 2008, event: 'Final season at original stadium' },
        { year: 2009, event: 'New Yankee Stadium opens' },
        { year: 2009, event: 'Yankees win World Series in new stadium' }
      ],
      notableGames: [
        { date: '2009-04-16', description: 'First game at new Yankee Stadium' },
        { date: '2009-11-04', description: 'World Series championship at new stadium' },
        { date: '2017-10-18', description: 'Aaron Judge postseason home run record' }
      ],
      traditions: [
        { name: 'Monument Park', description: 'Monuments and plaques honoring Yankees legends' },
        { name: 'Pinstripe Pride', description: 'Classic Yankees uniform tradition' },
        { name: 'Roll Call', description: 'Bleacher Creatures roll call of starting lineup' }
      ],
      retired: [
        { number: '1', player: 'Billy Martin', year: 1986 },
        { number: '3', player: 'Babe Ruth', year: 1948 },
        { number: '4', player: 'Lou Gehrig', year: 1939 },
        { number: '5', player: 'Joe DiMaggio', year: 1952 },
        { number: '7', player: 'Mickey Mantle', year: 1969 },
        { number: '8', player: 'Yogi Berra', year: 1972 },
        { number: '9', player: 'Roger Maris', year: 1984 },
        { number: '10', player: 'Phil Rizzuto', year: 1985 },
        { number: '15', player: 'Thurman Munson', year: 1979 },
        { number: '16', player: 'Whitey Ford', year: 1974 },
        { number: '23', player: 'Don Mattingly', year: 1997 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '49', player: 'Ron Guidry', year: 2003 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Corporate and premium atmosphere with passionate fans. Rich tradition and history throughout the stadium experience.',
      bestExperiences: [
        'Monument Park tour before games',
        'Great Hall historical displays',
        'Short porch home run excitement',
        'Yankees Museum exhibits',
        'Premium dining and club experiences'
      ],
      traditions: [
        'Roll call by Bleacher Creatures',
        'Pinstripe uniforms and tradition',
        '"New York, New York" after wins',
        'Monument Park ceremonies',
        'Yankees mystique and aura'
      ],
      music: '"New York, New York" by Frank Sinatra, organ music, "Enter Sandman" for Mariano Rivera',
      fanGroups: [
        { name: 'Bleacher Creatures', section: 'Right field bleachers', description: 'Passionate fan group known for roll call' },
        { name: 'Season ticket holders', description: 'Long-term fans with deep Yankees knowledge' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Take subway directly to stadium - much easier than driving',
        'Visit Monument Park early - it closes before first pitch',
        'Great Hall has excellent Yankees historical displays',
        'Premium clubs offer upscale dining experiences'
      ],
      avoidThese: [
        'Avoid driving unless absolutely necessary - traffic nightmare',
        'Don\'t miss Monument Park - closes during game',
        'Skip expensive parking for subway option'
      ],
      hiddenGems: [
        'Yankees Museum has rare historical artifacts',
        'Great Hall displays change throughout season',
        'Upper deck has good views at lower prices',
        'Hard Rock Cafe offers full restaurant experience'
      ],
      photoSpots: [
        'Monument Park with Yankees legends',
        'Great Hall entrance and displays',
        'Field views from behind home plate',
        'Classic facade architecture'
      ],
      bestValue: [
        'Grandstand sections for budget-friendly Yankees experience',
        'Bleacher seats for passionate fan atmosphere',
        'Standing room areas during sold-out games',
        'Weekday games for lower prices'
      ]
    }
  },

  'redsox': {
    id: 'redsox',
    name: 'Fenway Park',
    team: 'Boston Red Sox',
    opened: 1912,
    capacity: 37755,
    
    overview: {
      description: 'Fenway Park is the oldest ballpark in MLB, famous for the Green Monster left field wall, Pesky\'s Pole, and intimate atmosphere. Located in Boston\'s Kenmore Square area, it combines historic charm with passionate Red Sox Nation.',
      highlights: [
        'Oldest MLB ballpark (1912)',
        'Iconic Green Monster 37-foot left field wall',
        'Pesky\'s Pole down right field line',
        'Triangle in deep center field',
        'Red Sox Nation passionate fanbase'
      ],
      uniqueFeatures: [
        'Green Monster 37-foot wall with manual scoreboard',
        'Monster Seats on top of Green Monster',
        'Pesky\'s Pole 302 feet down right field line',
        'Triangle area in deep center field',
        'Lone Red Seat marking Ted Williams\' longest home run',
        'Irregular field dimensions and foul territory'
      ],
      renovations: [
        { year: 2003, description: 'Monster Seats added on top of Green Monster' },
        { year: 2006, description: 'Green Monster SRO deck added' },
        { year: 2011, description: 'Right field roof deck and pavilion added' }
      ]
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['First base side Grandstand 1-15', 'Right Field Box 89-96', 'Pavilion Box 1-8'],
        afternoon: ['Third base side Grandstand 16-33', 'Green Monster sections', 'Left field areas'],
        evening: ['Behind home plate areas', 'Infield Box seating', 'Most premium seating']
      },
      coveredSeating: ['Green Monster seats', '.406 Club', 'EMC Club'],
      shadeTips: [
        'Third base side gets afternoon shade first',
        'Green Monster provides shade for left field areas',
        'Grandstand upper sections have some overhang protection',
        'Right field can be very sunny for day games'
      ],
      sunProtection: {
        sunscreenStations: ['Section 12', 'Right field concourse', 'Green Monster concourse'],
        shadedConcourses: ['Main concourse areas', 'Club level concourses'],
        indoorAreas: ['.406 Club', 'EMC Club', 'Team Store', 'Green Monster Bar']
      },
      worstSunExposure: ['Right Field Box 89-96', 'Bleacher sections 34-43', 'Field Box 81-88'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 55, avgHumidity: 60, rainChance: 40, typicalConditions: 'Cool New England spring', shadeTip: 'Layer clothing, wind off harbor' },
        { month: 'May', avgTemp: 65, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring weather', shadeTip: 'Perfect weather for any seat' },
        { month: 'June', avgTemp: 74, avgHumidity: 70, rainChance: 30, typicalConditions: 'Warm and humid', shadeTip: 'Seek shade for day games' },
        { month: 'July', avgTemp: 80, avgHumidity: 73, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Third base side preferred for day games' },
        { month: 'August', avgTemp: 78, avgHumidity: 74, rainChance: 30, typicalConditions: 'Hot and humid', shadeTip: 'Green Monster area offers some relief' },
        { month: 'September', avgTemp: 71, avgHumidity: 68, rainChance: 30, typicalConditions: 'Pleasant fall weather', shadeTip: 'Great weather for any seating' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: '.406 Club', perks: ['All-inclusive dining', 'Climate control', 'Premium entrance'], access: 'Behind home plate, field level' },
          { name: 'EMC Club', perks: ['Upscale dining', 'Full bar', 'Premium views'], access: 'Upper level behind home plate' },
          { name: 'Green Monster Seats', perks: ['Iconic experience', 'Manual scoreboard access', 'Historic views'], access: 'Top of Green Monster wall' }
        ],
        suites: { levels: ['Suite Level'], amenities: ['Private bathrooms', 'Catering options', 'Premium TVs', 'Climate control'] },
        specialAreas: [
          { name: 'Monster Seats', description: 'Seats on top of the Green Monster', capacity: 274 },
          { name: 'Right Field Roof Deck', description: 'Standing room area above right field', capacity: 200 }
        ]
      },
      budgetOptions: ['Grandstand 16-33', 'Bleacher sections 34-43', 'Standing Room Only'],
      familySections: ['Family sections in Grandstand', 'Kid-friendly areas'],
      standingRoom: ['Green Monster SRO', 'Right Field Roof Deck', 'Various concourse areas'],
      partyAreas: [
        { name: 'Right Field Roof Deck', capacity: '200', amenities: ['Standing room', 'Premium concessions', 'Social atmosphere'] },
        { name: 'Green Monster Bar', capacity: '100', amenities: ['Full bar', 'Green Monster views', 'Premium experience'] }
      ],
      tips: [
        { section: 'Green Monster Seats', tip: 'Iconic experience but limited foul ball territory view', category: 'experience' },
        { section: 'Right Field Box 89-96', tip: 'Close to Pesky\'s Pole, great for right-handed hitter home runs', category: 'experience' },
        { section: 'Grandstand 16-25', tip: 'Good value with classic Fenway atmosphere', category: 'value' },
        { section: 'Triangle seating', tip: 'Unique views of center field triangle area', category: 'view' }
      ]
    },
    
    concessions: {
      signature: ['Fenway Franks', 'New England clam chowder', 'Italian sausages', 'Cracker Jack', 'Boston baked beans'],
      local: ['Dunkin\' Donuts coffee', 'Samuel Adams beer', 'New England clam rolls', 'Boston cream pie', 'Whoopie pies'],
      healthy: ['Fresh salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Veggie dogs', 'Pizza options', 'Salads', 'Vegetarian Italian dishes'],
      glutenFree: ['Gluten-free beer', 'Certified options in premium areas'],
      kidsFriendly: ['Hot dogs', 'Popcorn', 'Cotton candy', 'Ice cream', 'Cracker Jack'],
      alcohol: {
        beer: ['Samuel Adams', 'Budweiser', 'Stella Artois', 'Local Boston craft breweries'],
        wine: true,
        cocktails: true,
        localBreweries: ['Samuel Adams', 'Harpoon Brewery', 'Boston Beer Company']
      }
    },
    
    parking: {
      lots: [
        { name: 'Fenway Park Official Lots', distance: '0.1-0.3 miles', price: '$35-50', shadedSpots: false, covered: false, tip: 'Limited official parking, reserve in advance' },
        { name: 'Private Boston Lots', distance: '0.2-0.8 miles', price: '$25-45', shadedSpots: false, covered: false, tip: 'Multiple private lots throughout area' },
        { name: 'Kenmore Square Garage', distance: '0.3 miles', price: '$30-40', shadedSpots: true, covered: true, tip: 'Covered parking, short walk' },
        { name: 'Boston Common Garage', distance: '2 miles + T ride', price: '$20 + T fare', shadedSpots: true, covered: true, tip: 'Park downtown, take Green Line' }
      ],
      streetParking: {
        available: true,
        restrictions: 'Resident permit parking, very limited availability',
        tip: 'Nearly impossible to find, arrive 3+ hours early'
      },
      alternativeTransport: {
        publicTransit: ['Green Line B, C, D to Kenmore Square (3 blocks)', 'Multiple bus routes'],
        rideShare: 'Heavy traffic, consider T instead',
        bicycle: 'Bike racks available, popular option'
      }
    },
    
    gates: [
      { name: 'Gate A (Jersey Street)', location: 'Main entrance', bestFor: ['Home plate areas', 'Premium seating'], openTime: '2 hours before first pitch', tip: 'Main entrance near Yawkey Way' },
      { name: 'Gate B', location: 'Right field side', bestFor: ['Right field sections', 'Pavilion'], openTime: '2 hours before first pitch' },
      { name: 'Gate C', location: 'Center field', bestFor: ['Bleacher sections', 'Upper deck'], openTime: '2 hours before first pitch' },
      { name: 'Gate E', location: 'Green Monster side', bestFor: ['Left field sections', 'Monster Seats'], openTime: '2 hours before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Red Sox Team Store (Jersey Street)', exclusive: ['Authentic jerseys', 'World Series merchandise'] },
        { location: 'Twins Souvenir Shop', exclusive: ['Fenway-specific items'] },
        { location: 'Multiple concourse stands throughout stadium' }
      ],
      firstAid: ['Section 18', 'Right field concourse', 'Guest services'],
      babyChanging: ['Family restrooms throughout stadium'],
      nursingRooms: ['Guest services areas'],
      atms: ['All concourse areas', 'Jersey Street entrance'],
      wifi: { available: true, network: 'Red Sox WiFi', freeZones: ['All public areas'] },
      chargingStations: ['Club areas', 'Premium seating sections'],
      kidZones: [
        { name: 'Kids Concourse Activities', location: 'Various concourse areas', activities: ['Interactive games', 'Photo opportunities'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Limited accessible sections due to historic nature'],
        entrance: 'Most gates wheelchair accessible',
        elevators: ['Limited elevators, some areas require ramps']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available on all accessible levels'],
      accessibleConcessions: ['Major concession areas'],
      parkingSpaces: 'Limited accessible parking due to urban location'
    },
    
    gameDay: {
      tips: [
        { title: 'Take the Green Line', description: 'T to Kenmore Square is much easier than driving', category: 'arrival' },
        { title: 'Explore Yawkey Way', description: 'Pre-game atmosphere on Jersey Street (formerly Yawkey Way)', category: 'experience' },
        { title: 'Green Monster Experience', description: 'Monster Seats offer unique but limited view perspective', category: 'experience' },
        { title: 'Manual Scoreboard', description: 'Watch manual scoreboard operation inside Green Monster', category: 'experience' },
        { title: 'Ted Williams Red Seat', description: 'Find the lone red seat marking his 502-foot home run', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before first pitch',
        battingPractice: '2.5 hours before first pitch',
        firstPitch: 'Varies by game',
        rushHours: ['1 hour before first pitch', '7th inning stretch', 'Post-game T station']
      },
      security: {
        allowedBags: 'Bags smaller than 16"x16"x8"',
        prohibitedItems: ['Outside food/drink', 'Weapons', 'Professional cameras'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    
    neighborhood: {
      name: 'Fenway-Kenmore',
      description: 'Historic neighborhood with numerous bars, restaurants, and entertainment venues within walking distance of the ballpark.',
      beforeGame: ['Cask \'n\' Flagon', 'Game On!', 'Bleacher Bar', 'Jersey Street vendors and activities'],
      afterGame: ['Kenmore Square bars', 'Lansdowne Street nightlife', 'Boston restaurant scene'],
      radius: 'Multiple dining and entertainment options within 3-block radius'
    },
    
    transportation: {
      address: '4 Jersey St, Boston, MA 02215',
      publicTransit: {
        subway: [
          { lines: ['Green Line B, C, D'], station: 'Kenmore', walkTime: '3 blocks' }
        ],
        bus: [
          { routes: ['Multiple MBTA bus routes'], stops: ['Kenmore Square and surrounding areas'] }
        ]
      },
      driving: {
        majorRoutes: ['Mass Pike (I-90)', 'Storrow Drive', 'Route 1'],
        typicalTraffic: 'Very heavy congestion, limited parking',
        bestApproach: 'Avoid driving, take public transit'
      },
      rideShare: {
        pickupZone: 'Designated areas several blocks from stadium',
        dropoffZone: 'Drop-off zones away from main gates',
        surgePricing: 'Very high during games',
        alternativeTip: 'Green Line much faster and cheaper'
      }
    },
    
    history: {
      timeline: [
        { year: 1912, event: 'Fenway Park opens' },
        { year: 1934, event: 'Green Monster wall constructed at current height' },
        { year: 1947, event: 'Left field wall painted green' },
        { year: 2003, event: 'Monster Seats added on top of Green Monster' },
        { year: 2004, event: 'Red Sox break Curse of the Bambino, win World Series' }
      ],
      notableGames: [
        { date: '1975-10-21', description: 'Carlton Fisk\'s dramatic Game 6 World Series home run' },
        { date: '2004-10-27', description: 'World Series championship, breaking 86-year drought' },
        { date: '1999-07-13', description: 'Ted Williams throws out first pitch at All-Star Game' }
      ],
      traditions: [
        { name: 'Green Monster', description: '37-foot left field wall, unique to Fenway' },
        { name: 'Sweet Caroline', description: '8th inning singing tradition' },
        { name: 'Red Seat', description: 'Lone red seat marking Ted Williams\' 502-foot home run' },
        { name: 'Pesky\'s Pole', description: 'Right field foul pole, 302 feet from home plate' }
      ],
      retired: [
        { number: '1', player: 'Bobby Doerr', year: 1988 },
        { number: '4', player: 'Joe Cronin', year: 1984 },
        { number: '6', player: 'Johnny Pesky', year: 2008 },
        { number: '8', player: 'Carl Yastrzemski', year: 1989 },
        { number: '9', player: 'Ted Williams', year: 1984 },
        { number: '14', player: 'Jim Rice', year: 2009 },
        { number: '26', player: 'Wade Boggs', year: 2016 },
        { number: '27', player: 'Carlton Fisk', year: 2000 },
        { number: '42', player: 'Jackie Robinson', year: 1997 },
        { number: '45', player: 'Pedro Martinez', year: 2015 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Intimate, historic atmosphere with passionate Red Sox Nation fans. Rich tradition and unique ballpark quirks create special experience.',
      bestExperiences: [
        'Green Monster Seats unique perspective',
        'Sweet Caroline 8th inning sing-along',
        'Jersey Street pre-game atmosphere',
        'Manual scoreboard and Green Monster wall',
        'Historic ballpark architecture and quirks'
      ],
      traditions: [
        'Sweet Caroline in 8th inning',
        'Green Monster home runs celebration',
        'Dirty Water victory song',
        'Red Sox Nation loyalty',
        'Fenway Frank tradition'
      ],
      music: '"Sweet Caroline," "Dirty Water" after wins, organ music',
      mascot: { name: 'Wally the Green Monster', description: 'Friendly green monster mascot representing the famous wall' },
      fanGroups: [
        { name: 'Red Sox Nation', description: 'Passionate fan base throughout New England' },
        { name: 'Bleacher Creatures', section: 'Center field bleachers', description: 'Vocal fan group in bleacher sections' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Take Green Line to Kenmore - much easier than driving',
        'Monster Seats are unique but have limited foul territory view',
        'Jersey Street (Yawkey Way) has great pre-game atmosphere',
        'Manual scoreboard operators work inside Green Monster'
      ],
      avoidThese: [
        'Don\'t drive unless absolutely necessary - parking nightmare',
        'Don\'t expect modern amenities - it\'s a historic ballpark',
        'Monster Seats have obstructed views of some areas'
      ],
      hiddenGems: [
        'Lone red seat marking Ted Williams\' home run',
        'Triangle area in center field creates unique plays',
        'Pesky\'s Pole down right field line',
        'Manual scoreboard operation viewing'
      ],
      photoSpots: [
        'Green Monster wall and scoreboard',
        'Pesky\'s Pole in right field',
        'Ted Williams\' red seat',
        'Fenway Park exterior and signage'
      ],
      bestValue: [
        'Grandstand sections for classic Fenway experience',
        'Bleacher seats for passionate fan atmosphere',
        'Standing room for sold-out games',
        'Weekday games for lower prices'
      ]
    }
  }
};