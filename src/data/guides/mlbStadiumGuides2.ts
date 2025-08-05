import { StadiumGuide } from '../stadiumGuides';

export const mlbStadiumGuides2: Record<string, StadiumGuide> = {
  'bluejays': {
    id: 'bluejays',
    name: 'Rogers Centre',
    team: 'Toronto Blue Jays',
    opened: 1989,
    capacity: 49282,
    
    overview: {
      description: 'Rogers Centre (formerly SkyDome) was the world\'s first stadium with a fully retractable roof. Located in downtown Toronto, it offers spectacular views of the CN Tower and features a unique hotel with rooms overlooking the field.',
      highlights: [
        'World\'s first retractable roof stadium',
        'Hotel rooms with field views',
        'CN Tower views from upper deck',
        'Four-panel retractable roof opens in 20 minutes'
      ],
      uniqueFeatures: [
        'Renaissance Hotel in stadium',
        'Largest video board in Canada',
        '100 Level social spaces',
        'WestJet Flight Deck in center field',
        'Blue Jays memorabilia displays'
      ],
      renovations: [
        { year: 2022, description: 'Major renovation - new outfield design' },
        { year: 2023, description: 'New video boards and social spaces' },
        { year: 2024, description: 'Infield dirt and new turf installed' }
      ],
      previousNames: ['SkyDome (1989-2005)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Roof typically closed for comfort'],
        afternoon: ['All sections with closed roof', '500 Level under overhang'],
        evening: ['200 Level Club', 'Upper deck sections']
      },
      coveredSeating: ['All seats when roof closed', 'Club Level', '500 Level back rows'],
      shadeTips: [
        'Roof closed for temperature below 50°F or above 85°F',
        'When open, third base side gets shade first',
        'Flight Deck can be very sunny when roof open',
        '500 Level provides shade for sections below'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services locations'],
        shadedConcourses: ['All concourses covered'],
        indoorAreas: ['Renaissance Hotel areas', 'Restaurants', 'Team Store']
      },
      worstSunExposure: ['Outfield 100 Level when roof open', 'Flight Deck'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 48, avgHumidity: 65, rainChance: 25, typicalConditions: 'Cool, roof often closed', shadeTip: 'Indoor comfort' },
        { month: 'May', avgTemp: 59, avgHumidity: 65, rainChance: 20, typicalConditions: 'Variable weather', shadeTip: 'Roof status varies' },
        { month: 'June', avgTemp: 68, avgHumidity: 70, rainChance: 20, typicalConditions: 'Pleasant', shadeTip: 'Roof often open' },
        { month: 'July', avgTemp: 74, avgHumidity: 70, rainChance: 20, typicalConditions: 'Warm', shadeTip: 'Seek shade if roof open' },
        { month: 'August', avgTemp: 73, avgHumidity: 75, rainChance: 20, typicalConditions: 'Humid', shadeTip: 'Upper deck for shade' },
        { month: 'September', avgTemp: 65, avgHumidity: 70, rainChance: 20, typicalConditions: 'Cooling down', shadeTip: 'Comfortable with roof open' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'TD Comfort Club', perks: ['Premium dining', 'Private bar', 'Padded seats'], access: '200 Level' },
          { name: 'Rogers Club', perks: ['All-inclusive food/drinks', 'Private entrance'], access: 'Behind home plate' }
        ],
        suites: {
          levels: ['200 Level Suites', '300 Level Suites'],
          amenities: ['Private washrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'WestJet Flight Deck', description: 'Standing room party area in CF', capacity: 300 },
          { name: 'Hotel Rooms', description: '70 rooms with field views', capacity: 140 }
        ]
      },
      budgetOptions: ['500 Level outfield', '500L sections', 'Flight Deck standing'],
      familySections: ['Family Zone 513-515'],
      standingRoom: ['WestJet Flight Deck', 'Concourse areas'],
      partyAreas: [
        { name: 'WestJet Flight Deck', capacity: '300', amenities: ['Bar service', 'Food vendors', 'Games'] },
        { name: 'Corona Rooftop Patio', capacity: '200', amenities: ['Full bar', 'Seating areas'] }
      ],
      tips: [
        { section: 'TD Club 224-226', tip: 'Best amenities and shade combo', category: 'shade' },
        { section: 'Flight Deck', tip: 'Fun but sunny when roof open', category: 'experience' },
        { section: '524R', tip: 'Cheapest seats with CN Tower view', category: 'value' },
        { section: '113-117', tip: 'Close to action behind plate', category: 'view' }
      ]
    },
    
    concessions: {
      signature: ['Street meat hot dogs', 'Poutine', 'Muddy York ribs', 'Tim Hortons'],
      local: ['Pinnacle Caterers', 'The Craft Brasserie', 'Smoke\'s Poutinerie'],
      healthy: ['Freshii bowls', 'Salad stations', 'Veggie options'],
      vegetarian: ['Beyond Meat burgers', 'Veggie dogs', 'Salads'],
      glutenFree: ['GF beer', 'GF buns available'],
      kidsFriendly: ['Pizza Pizza', 'Popcorn', 'Ice cream'],
      alcohol: {
        beer: ['Budweiser', 'Stella Artois', 'Goose Island', 'Steam Whistle'],
        wine: true,
        cocktails: true,
        localBreweries: ['Steam Whistle', 'Amsterdam', 'Mill Street']
      }
    },
    
    parking: {
      lots: [
        { name: 'Rogers Centre Parking', distance: 'Underground', price: '$35 CAD', shadedSpots: true, covered: true, tip: 'Book ahead online' },
        { name: 'Metro Toronto Convention', distance: '5 min walk', price: '$25 CAD', shadedSpots: true, covered: true },
        { name: 'Green P Lots', distance: 'Various', price: '$15-30 CAD', shadedSpots: false, covered: false }
      ],
      alternativeTransport: {
        publicTransit: ['Union Station - Subway/GO Transit', 'Streetcar on Bremner'],
        rideShare: 'Bremner Blvd drop-off zones',
        bicycle: 'Bike Share Toronto stations nearby'
      }
    },
    
    gates: [
      { name: 'Gate 1', location: 'Behind home plate', bestFor: ['100 Level infield'], openTime: '90 minutes before first pitch' },
      { name: 'Gate 5', location: 'Right field', bestFor: ['Outfield sections', 'Flight Deck'], openTime: '90 minutes before first pitch' },
      { name: 'Gate 10', location: 'Third base', bestFor: ['200 Level', 'Suites'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Jays Shop - Gate 5', exclusive: ['Canadian exclusive items', 'Custom jerseys'] },
        { location: 'Multiple kiosks throughout' }
      ],
      firstAid: ['Section 119', 'Section 229', 'Section 517'],
      babyChanging: ['All family washrooms'],
      nursingRooms: ['Guest Services Level 100'],
      atms: ['All gates and levels'],
      wifi: { available: true, network: 'ROGERS_CENTRE' },
      chargingStations: ['200 Level Club areas'],
      kidZones: [
        { name: 'Jr. Jays Zone', location: 'Level 100', activities: ['Games', 'Photo ops'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have accessible seating'],
        entrance: 'All gates are accessible',
        elevators: ['All levels serviced by elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All permanent stands'],
      parkingSpaces: 'Reserved spaces in Rogers Centre garage'
    },
    
    gameDay: {
      tips: [
        { title: 'Take the subway', description: 'Union Station is attached to stadium', category: 'arrival' },
        { title: 'Check roof status', description: 'Dress accordingly for open/closed', category: 'weather' },
        { title: 'Try poutine', description: 'Canadian classic at multiple stands', category: 'food' },
        { title: 'Arrive early for BP', description: 'Gates open 90 minutes early', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Jays BP 2 hours before',
        firstPitch: '7:07 PM weekdays, 3:07 PM Saturdays, 1:37 PM Sundays',
        rushHours: ['5:00-6:30 PM downtown traffic']
      },
      security: {
        allowedBags: 'Bags under 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Noisemakers'],
        metalDetectors: true
      }
    },
    
    neighborhood: {
      name: 'Entertainment District',
      description: 'Downtown Toronto with endless options',
      beforeGame: ['Steam Whistle Brewery', 'Real Sports Bar', 'Loose Moose'],
      afterGame: ['King Street bars', 'Front Street restaurants', 'Harbourfront'],
      radius: '5-10 minute walk'
    },
    
    transportation: {
      address: '1 Blue Jays Way, Toronto, ON M5V 1J1',
      publicTransit: {
        subway: [{ lines: ['Line 1 Yonge-University'], station: 'Union Station', walkTime: 'Indoor connection' }],
        train: [{ lines: ['GO Transit all lines'], station: 'Union Station', walkTime: 'Indoor connection' }],
        bus: [{ routes: ['Various TTC routes'], stops: ['Union Station Bus Terminal'] }]
      },
      driving: {
        majorRoutes: ['Gardiner Expressway', 'Lake Shore Blvd', 'DVP to Gardiner'],
        typicalTraffic: 'Heavy 4:00-6:30 PM',
        bestApproach: 'Lake Shore from east or west'
      },
      rideShare: {
        pickupZone: 'Bremner Blvd',
        dropoffZone: 'Blue Jays Way',
        surgePricing: '2-3x after games',
        alternativeTip: 'Walk to King St for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 1989, event: 'SkyDome opens' },
        { year: 1992, event: 'First World Series Championship' },
        { year: 1993, event: 'Back-to-back World Series' },
        { year: 2005, event: 'Renamed Rogers Centre' },
        { year: 2015, event: 'First playoffs in 22 years' }
      ],
      notableGames: [
        { date: '1993-10-23', description: 'Joe Carter walk-off World Series homer' },
        { date: '2015-10-14', description: 'Bat flip game vs Rangers' },
        { date: '2016-10-04', description: 'Wild Card walk-off vs Orioles' }
      ],
      traditions: [
        { name: 'OK Blue Jays', description: '7th inning stretch song' },
        { name: 'Home Run Horn', description: 'Foghorn after Blue Jays homers' }
      ],
      retired: [
        { number: '12', player: 'Roberto Alomar', year: 2011 },
        { number: '32', player: 'Roy Halladay', year: 2018 },
        { number: '42', player: 'Jackie Robinson', year: 1997 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Diverse crowd, electric in playoffs',
      bestExperiences: [
        'CN Tower views',
        'Roof opening/closing',
        'Flight Deck party atmosphere',
        'Home run horn'
      ],
      traditions: ['OK Blue Jays song', 'Standing for 2-strike counts', 'Home run horn'],
      music: 'Mix of classic rock and modern hits',
      mascot: { name: 'Ace', description: 'Blue Jay mascot' },
      fanGroups: [
        { name: 'Jays Care', description: 'Community foundation' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Union Station PATH system avoids weather',
        'TD Comfort Club worth upgrade for amenities',
        '500 Level offers best value with views',
        'Steam Whistle Brewery tour before games',
        'Hotel rooms can be booked for special occasions'
      ],
      avoidThese: [
        'Driving during rush hour',
        'Flight Deck without sunscreen when roof open',
        'Concessions right at first pitch',
        'Gardiner Expressway after games'
      ],
      hiddenGems: [
        'Corona Rooftop Patio pregame',
        'Muddy York Market behind 130',
        'Renaissance Hotel sports bar',
        'Level 100 walkway for easy navigation'
      ],
      photoSpots: [
        'With CN Tower from 500 Level',
        'Statue outside Gate 5',
        'Flight Deck with field view',
        'Rogers Centre sign'
      ],
      bestValue: [
        '500 Level outfield seats',
        'Toonie Tuesdays promotions',
        'Flight Deck standing room',
        'Pre-game at nearby bars'
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
      description: 'Truist Park is a state-of-the-art ballpark in suburban Atlanta, surrounded by The Battery Atlanta mixed-use development. The stadium features a unique canopy design that provides shade and excellent sightlines from every seat.',
      highlights: [
        'The Battery Atlanta entertainment district',
        'Extensive canopy for shade coverage',
        'SunTrust Club with field-level seating',
        'Chophouse restaurant in right field'
      ],
      uniqueFeatures: [
        'The Battery Atlanta surrounds stadium',
        'Canopy covers 50% of seats',
        'Monument Garden',
        'Hope & Will\'s Sandlot playground',
        'Xfinity Rooftop party deck'
      ],
      renovations: [
        { year: 2020, description: 'Renamed from SunTrust Park to Truist Park' },
        { year: 2021, description: 'World Series Champions improvements' }
      ],
      previousNames: ['SunTrust Park (2017-2020)']
    },
    
    shadeGuide: {
      bestShadedSections: {
        morning: ['Upper deck under canopy', 'Terrace Level behind home plate'],
        afternoon: ['Most seats under canopy', 'First base side', 'Terrace Level'],
        evening: ['Third base side', 'All covered sections']
      },
      coveredSeating: ['Terrace Level', 'Delta Sky360 Club', 'Most upper deck sections'],
      shadeTips: [
        'Canopy covers majority of upper deck',
        'Field Level exposed but gains shade by 3rd inning',
        'Chophouse has retractable roof',
        'First base side best for afternoon games'
      ],
      sunProtection: {
        sunscreenStations: ['Guest Services on all levels'],
        shadedConcourses: ['All concourses covered'],
        indoorAreas: ['Delta Sky360 Club', 'Chophouse', 'Team Store']
      },
      worstSunExposure: ['Outfield Pavilion', 'Field Level sections 1-10', 'Right field corner'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 60, rainChance: 20, typicalConditions: 'Mild and pleasant', shadeTip: 'Canopy sufficient' },
        { month: 'May', avgTemp: 76, avgHumidity: 65, rainChance: 20, typicalConditions: 'Warming up', shadeTip: 'Seek canopy coverage' },
        { month: 'June', avgTemp: 83, avgHumidity: 70, rainChance: 25, typicalConditions: 'Hot and humid', shadeTip: 'Upper deck essential' },
        { month: 'July', avgTemp: 86, avgHumidity: 75, rainChance: 30, typicalConditions: 'Peak summer heat', shadeTip: 'Arrive early for shade' },
        { month: 'August', avgTemp: 85, avgHumidity: 75, rainChance: 25, typicalConditions: 'Still very hot', shadeTip: 'Evening games better' },
        { month: 'September', avgTemp: 79, avgHumidity: 70, rainChance: 20, typicalConditions: 'Cooling slightly', shadeTip: 'More comfortable' },
        { month: 'October', avgTemp: 69, avgHumidity: 65, rainChance: 15, typicalConditions: 'Perfect baseball weather', shadeTip: 'Playoffs comfort' }
      ]
    },
    
    seatingGuide: {
      premiumSeating: {
        clubs: [
          { name: 'Delta Sky360 Club', perks: ['All-inclusive food/drinks', 'Climate controlled', 'Padded seats'], access: 'Behind home plate' },
          { name: 'SunTrust Club', perks: ['Field level premium', 'Private bar'], access: 'Field level' }
        ],
        suites: {
          levels: ['Suite Level', 'Party Suites'],
          amenities: ['Private restrooms', 'Catering', 'HDTV', 'Climate control']
        },
        specialAreas: [
          { name: 'Chophouse', description: 'Two-story restaurant with field view', capacity: 450 },
          { name: 'Xfinity Rooftop', description: 'Left field party deck', capacity: 200 }
        ]
      },
      budgetOptions: ['Pavilion Level', 'Upper outfield corners', 'Rooftop standing'],
      familySections: ['Hope & Will\'s Sandlot area'],
      standingRoom: ['Xfinity Rooftop', 'Terrapin Taproom'],
      partyAreas: [
        { name: 'Xfinity Rooftop', capacity: '200', amenities: ['Full bar', 'TVs', 'Games'] },
        { name: 'Infiniti Club', capacity: '150', amenities: ['Premium bar', 'Field access'] }
      ],
      tips: [
        { section: 'Terrace 312-320', tip: 'Best shade all game under canopy', category: 'shade' },
        { section: 'Chophouse', tip: 'AC dining with field view', category: 'experience' },
        { section: 'Field 115-120', tip: 'Close action, late shade', category: 'view' },
        { section: 'Pavilion 340-345', tip: 'Budget seats with canopy', category: 'value' }
      ]
    },
    
    concessions: {
      signature: ['H&F Burger', 'Fox Bros BBQ', 'Waffle House', 'Antico Pizza'],
      local: ['Fox Bros Bar-B-Q', 'Terrapin Beer', 'Das Bier Garden'],
      healthy: ['Garden salads', 'Grilled options', 'Fresh fruit'],
      vegetarian: ['Beyond Burgers', 'Veggie pizza', 'Salads'],
      glutenFree: ['GF buns', 'GF beer options'],
      kidsFriendly: ['Chick-fil-A', 'Pizza', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Terrapin', 'SweetWater', 'Budweiser', 'Modelo'],
        wine: true,
        cocktails: true,
        localBreweries: ['Terrapin', 'SweetWater', 'Monday Night', 'Creature Comforts']
      }
    },
    
    parking: {
      lots: [
        { name: 'Red Deck', distance: 'Adjacent', price: '$35', shadedSpots: true, covered: true, tip: 'Closest to stadium' },
        { name: 'Orange/Green Lots', distance: '5 min walk', price: '$25', shadedSpots: false, covered: false },
        { name: 'The Battery Garages', distance: '5-10 min', price: '$20', shadedSpots: true, covered: true }
      ],
      alternativeTransport: {
        publicTransit: ['CobbLinc Route 10/12', 'Limited service'],
        rideShare: 'Designated zones at The Battery',
        bicycle: 'Limited bike parking available'
      }
    },
    
    gates: [
      { name: 'Left Field Gate', location: 'Left field plaza', bestFor: ['Xfinity Rooftop', 'Outfield'], openTime: '2 hours before first pitch' },
      { name: 'First Base Gate', location: 'First base side', bestFor: ['Field Level 1B side'], openTime: '90 minutes before first pitch' },
      { name: 'Third Base Gate', location: 'Third base side', bestFor: ['Field Level 3B side'], openTime: '90 minutes before first pitch' },
      { name: 'Right Field Gate', location: 'Right field/Chophouse', bestFor: ['Chophouse', 'Right field'], openTime: '90 minutes before first pitch' }
    ],
    
    amenities: {
      merchandise: [
        { location: 'Braves Clubhouse Store - Left Field', exclusive: ['World Series gear', 'Custom jerseys'] },
        { location: 'Multiple locations throughout' }
      ],
      firstAid: ['Section 110', 'Section 214', 'Section 327'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest Relations locations'],
      atms: ['All gate areas', 'Throughout concourses'],
      wifi: { available: true, network: 'Truist_Park_WiFi' },
      chargingStations: ['Delta Sky360 Club', 'Premium areas'],
      kidZones: [
        { name: 'Hope & Will\'s Sandlot', location: 'Behind Chophouse', activities: ['Playground', 'Zip line', 'Rock climbing'] }
      ]
    },
    
    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels have ADA seating'],
        entrance: 'All gates are accessible',
        elevators: ['Located throughout stadium']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['All levels'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: 'All lots have ADA spaces'
    },
    
    gameDay: {
      tips: [
        { title: 'Explore The Battery', description: 'Arrive early for dining and entertainment', category: 'arrival' },
        { title: 'Try Fox Bros BBQ', description: 'Local favorite inside stadium', category: 'food' },
        { title: 'Watch the Tomahawk Chop', description: 'Iconic Braves tradition', category: 'experience' },
        { title: 'Stay for fireworks', description: 'Friday night post-game shows', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '2 hours before (Left Field), 90 minutes (others)',
        battingPractice: 'Braves BP 2.5 hours before',
        firstPitch: '7:20 PM weekdays, 7:15 PM Saturdays, 1:35 PM Sundays',
        rushHours: ['5:00-6:30 PM on I-75/I-285']
      },
      security: {
        allowedBags: 'Clear bags only, 16"x16"x8"',
        prohibitedItems: ['Outside food/drinks', 'Weapons', 'Noisemakers'],
        metalDetectors: true,
        clearBagPolicy: true
      }
    },
    
    neighborhood: {
      name: 'The Battery Atlanta',
      description: 'Mixed-use development surrounding stadium',
      beforeGame: ['Terrapin Taproom', 'PBR Atlanta', 'Sports & Social'],
      afterGame: ['Live! at The Battery', 'Yard House', 'Ph\'east'],
      radius: 'All within The Battery complex'
    },
    
    transportation: {
      address: '755 Battery Avenue SE, Atlanta, GA 30339',
      publicTransit: {
        bus: [{ routes: ['CobbLinc 10', 'CobbLinc 12'], stops: ['Cumberland Transfer Center'] }]
      },
      driving: {
        majorRoutes: ['I-75 Exit 256', 'I-285 Exit 16', 'US 41/Cobb Parkway'],
        typicalTraffic: 'Heavy on I-75/I-285 intersection',
        bestApproach: 'I-75 from north, I-285 from east/west'
      },
      rideShare: {
        pickupZone: 'The Battery designated areas',
        dropoffZone: 'Circle Road',
        surgePricing: '3-5x after games',
        alternativeTip: 'Walk to Cobb Parkway for better rates'
      }
    },
    
    history: {
      timeline: [
        { year: 2017, event: 'Truist Park opens' },
        { year: 2018, event: 'First Division title at new park' },
        { year: 2021, event: 'World Series Championship' }
      ],
      notableGames: [
        { date: '2021-11-02', description: 'World Series clincher vs Astros' },
        { date: '2018-10-08', description: 'First playoff game at Truist' }
      ],
      traditions: [
        { name: 'The Tomahawk Chop', description: 'Signature fan chant and motion' },
        { name: 'Beat the Freeze', description: 'Fan race against The Freeze' }
      ],
      retired: [
        { number: '3', player: 'Dale Murphy', year: 1994 },
        { number: '6', player: 'Bobby Cox', year: 2011 },
        { number: '10', player: 'Chipper Jones', year: 2013 },
        { number: '21', player: 'Warren Spahn', year: 1965 },
        { number: '31', player: 'Greg Maddux', year: 2009 },
        { number: '35', player: 'Phil Niekro', year: 1984 },
        { number: '41', player: 'Eddie Mathews', year: 1969 },
        { number: '44', player: 'Hank Aaron', year: 1977 },
        { number: '47', player: 'Tom Glavine', year: 2010 }
      ]
    },
    
    fanExperience: {
      atmosphere: 'Energetic Southern crowd, playoff intensity',
      bestExperiences: [
        'The Tomahawk Chop',
        'The Battery pregame scene',
        'Beat the Freeze race',
        'Friday Fireworks'
      ],
      traditions: ['Tomahawk Chop', 'War chant', 'Beat the Freeze'],
      music: 'Heavy on country and Southern rock',
      mascot: { name: 'Blooper', description: 'Fuzzy creature mascot' },
      fanGroups: [
        { name: 'Braves Country', description: 'Regional fan base across Southeast' }
      ]
    },
    
    proTips: {
      insiderTips: [
        'Park at Galleria and walk through Battery',
        'Terrapin Taproom has best beer selection',
        'Monument Garden is great photo spot',
        'Delta Sky360 Club worth the splurge',
        'Hope & Will\'s Sandlot keeps kids happy'
      ],
      avoidThese: [
        'I-75/I-285 intersection at rush hour',
        'Parking in Red Deck after games',
        'Outfield seats for day games',
        'Concessions during 1st inning'
      ],
      hiddenGems: [
        'Mizuno Experience Center',
        'Scouts Alley museum area',
        'Infiniti Club field access',
        'Top of Chophouse bar'
      ],
      photoSpots: [
        'Monument Garden statues',
        'The Battery plaza',
        'With Hank Aaron statue',
        'Chophouse balcony'
      ],
      bestValue: [
        'Pavilion seats under canopy',
        'The Battery happy hours',
        'Xfinity Rooftop standing room',
        'Weekday day games'
      ]
    }
  }
};

// Continue with more stadiums...