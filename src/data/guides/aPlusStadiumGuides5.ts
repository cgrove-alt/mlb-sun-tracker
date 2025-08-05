import { StadiumGuide } from '../stadiumGuides';

export const aPlusStadiumGuides5: Record<string, StadiumGuide> = {
  'greenville-drive': {
    id: 'greenville-drive',
    name: 'Fluor Field',
    team: 'Greenville Drive',
    opened: 2006,
    capacity: 5700,

    overview: {
      description: 'Fluor Field at the West End is a stunning replica of Fenway Park, complete with its own "Green Monster" wall, serving as home to the Red Sox High-A affiliate in South Carolina.',
      highlights: [
        'Red Sox High-A affiliate',
        'Fenway Park replica design',
        'Downtown Greenville location',
        'Green Monster replica',
        'Reedy River proximity'
      ],
      uniqueFeatures: [
        '37-foot Green Monster replica',
        'Fenway Park dimensions',
        'Downtown skyline views',
        'Natural grass field',
        'Boston-Greenville connection'
      ],
      renovations: [
        { year: 2016, description: 'LED lighting installation' },
        { year: 2019, description: 'Concourse improvements' },
        { year: 2021, description: 'Premium seating upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Upper boxes'],
        afternoon: ['Sections 210-216', 'Green Monster seats'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Upper box seats', 'Premium areas'],
      shadeTips: [
        'South Carolina summers hot and humid',
        'Green Monster provides unique shade',
        'Third base side better for afternoon',
        'Evening games most comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper concourse'],
        indoorAreas: ['Team store', 'Club areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['Right field bleachers', 'First base field level'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 68, avgHumidity: 65, rainChance: 30, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable most areas' },
        { month: 'May', avgTemp: 76, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade becoming valuable' },
        { month: 'June', avgTemp: 83, avgHumidity: 70, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Upper sections recommended' },
        { month: 'July', avgTemp: 87, avgHumidity: 72, rainChance: 45, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games ideal' },
        { month: 'August', avgTemp: 86, avgHumidity: 73, rainChance: 45, typicalConditions: 'Peak heat', shadeTip: 'Shade essential' },
        { month: 'September', avgTemp: 79, avgHumidity: 70, rainChance: 35, typicalConditions: 'Still warm', shadeTip: 'More comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Heritage Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Behind home plate premium area'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Green Monster Seats', description: 'Atop the Green Monster', capacity: 50 },
          { name: 'Rooftop Deck', description: 'Right field party area', capacity: 150 }
        ]
      },
      budgetOptions: ['Outfield pavilion', 'Upper reserved', 'Standing room'],
      familySections: ['Family sections', 'Alcohol-free zones'],
      standingRoom: ['Concourse areas', 'Rooftop deck'],
      partyAreas: [
        {
          name: 'Rooftop Deck',
          capacity: '150',
          description: 'Right field party area',
          amenities: ['Bar service', 'Standing tables', 'City views']
        }
      ],
      tips: [
        { section: 'Green Monster', tip: 'Unique Fenway experience', category: 'experience' },
        { section: 'Heritage Club', tip: 'All-inclusive comfort', category: 'experience' },
        { section: 'Third base upper', tip: 'Best shade value', category: 'shade' },
        { section: 'Rooftop Deck', tip: 'Social atmosphere', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Fenway Frank replica', 'Southern BBQ', 'Shoeless Joe Jackson sandwich'],
      local: ['South Carolina BBQ', 'Pimento cheese', 'Sweet tea', 'Peach cobbler'],
      healthy: ['Grilled chicken', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Sam Adams', 'Local SC craft beers', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Quest Brewing', 'Birds Fly South', 'Brewery 85']
      }
    },

    parking: {
      lots: [
        { name: 'West End Lots', distance: '200 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Downtown Garages', distance: '0.3 miles', price: '$5-10', shadedSpots: true, covered: true }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered until 6 PM',
        tip: 'Free after 6 PM downtown'
      },
      alternativeTransport: {
        publicTransit: ['Greenlink transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Swamp Rabbit Trail access'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Field Street entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch',
        tip: 'Fenway-style entrance'
      },
      {
        name: 'West End Gate',
        location: 'Augusta Street',
        bestFor: ['Outfield seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Drive Team Store', exclusive: ['Drive gear', 'Red Sox items', 'Green Monster souvenirs'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['All family restrooms'],
      atms: ['Main concourse', 'Upper level'],
      wifi: { available: true, network: 'Drive_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Speed pitch', 'Wiffle ball'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple locations']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '20 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Fenway Feel', description: 'Experience mini Fenway Park', category: 'experience' },
        { title: 'Downtown Location', description: 'Walk to Main Street restaurants', category: 'experience' },
        { title: 'Green Monster', description: 'Sit atop the wall', category: 'experience' },
        { title: 'Southern Heat', description: 'Evening games more comfortable', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Varies by day',
        rushHours: ['30 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'West End Greenville',
      description: 'Vibrant downtown district with dining and entertainment',
      beforeGame: ['Main Street downtown', 'Falls Park', 'Local breweries'],
      afterGame: ['Downtown nightlife', 'Main Street restaurants'],
      radius: '0.5 miles'
    },

    transportation: {
      address: '945 S Main St, Greenville, SC 29601',
      publicTransit: {
        bus: [
          { routes: ['Greenlink routes'], stops: ['Downtown stops'] }
        ]
      },
      driving: {
        majorRoutes: ['I-85', 'I-385', 'US-29'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-385 to downtown exits'
      },
      rideShare: {
        pickupZone: 'Augusta Street',
        dropoffZone: 'Main gate area',
        surgePricing: 'Moderate on game nights'
      }
    },

    history: {
      timeline: [
        { year: 2006, event: 'Fluor Field opens' },
        { year: 2006, event: 'Drive inaugural season' },
        { year: 2006, event: 'Designed as Fenway replica' }
      ],
      traditions: [
        { name: 'Fenway South', description: 'Mini version of Boston landmark' },
        { name: 'Red Sox Connection', description: 'Strong organizational ties' }
      ]
    },

    fanExperience: {
      atmosphere: 'Fenway Park charm in downtown Greenville',
      bestExperiences: [
        'Green Monster experience',
        'Downtown location walkability',
        'Fenway replica atmosphere',
        'Southern hospitality'
      ],
      traditions: [
        'Sweet Caroline sing-along',
        'Green Monster traditions',
        'Red Sox heritage'
      ],
      mascot: {
        name: 'Reedy Rip\'It',
        description: 'Green frog mascot representing Reedy River'
      }
    },

    proTips: {
      insiderTips: [
        'Green Monster seats unique experience',
        'Downtown Greenville excellent before/after',
        'Heritage Club worth upgrade for heat',
        'Falls Park walking distance'
      ],
      avoidThese: [
        'Right field in afternoon sun',
        'Parking difficult on busy nights',
        'Missing Main Street before game'
      ],
      hiddenGems: [
        'Fenway details throughout park',
        'Swamp Rabbit Trail nearby',
        'Downtown Greenville renaissance',
        'Falls Park on the Reedy'
      ],
      photoSpots: [
        'Green Monster backdrop',
        'Fenway replica entrance',
        'Downtown skyline views',
        'With Reedy Rip\'It'
      ],
      bestValue: [
        'Upper reserved seats',
        'Rooftop deck standing room',
        'Downtown parking garages',
        'Thursday promotions'
      ]
    }
  },

  'hillsboro-hops': {
    id: 'hillsboro-hops',
    name: 'Ron Tonkin Field',
    team: 'Hillsboro Hops',
    opened: 2013,
    capacity: 4500,

    overview: {
      description: 'Ron Tonkin Field is a modern ballpark in Oregon\'s Silicon Forest, serving as home to the Diamondbacks High-A affiliate with craft beer culture and Pacific Northwest charm.',
      highlights: [
        'Diamondbacks High-A affiliate',
        'Portland metro location',
        'Craft beer paradise',
        'Silicon Forest setting',
        'Modern facility'
      ],
      uniqueFeatures: [
        'Hop-themed everything',
        'Oregon craft beer focus',
        'Artificial turf field',
        'Tech industry proximity',
        'Sustainable design'
      ],
      renovations: [
        { year: 2019, description: 'LED lighting upgrade' },
        { year: 2021, description: 'Concourse improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Premium areas'],
        afternoon: ['Sections 7-10', 'Party deck'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Limited covered areas', 'Premium sections'],
      shadeTips: [
        'Oregon summers surprisingly warm',
        'Limited shade structures',
        'Evening games ideal',
        'Pacific Northwest sun angle favorable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse areas'],
        indoorAreas: ['Team store', 'Club areas'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base side', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 57, avgHumidity: 75, rainChance: 45, typicalConditions: 'Cool and often wet', shadeTip: 'Rain gear important' },
        { month: 'May', avgTemp: 63, avgHumidity: 70, rainChance: 35, typicalConditions: 'Variable spring', shadeTip: 'Layers needed' },
        { month: 'June', avgTemp: 69, avgHumidity: 65, rainChance: 25, typicalConditions: 'Pleasant', shadeTip: 'Comfortable conditions' },
        { month: 'July', avgTemp: 77, avgHumidity: 55, rainChance: 10, typicalConditions: 'Warm and dry', shadeTip: 'Some shade helpful' },
        { month: 'August', avgTemp: 78, avgHumidity: 55, rainChance: 10, typicalConditions: 'Peak summer', shadeTip: 'Evening games perfect' },
        { month: 'September', avgTemp: 71, avgHumidity: 65, rainChance: 20, typicalConditions: 'Ideal weather', shadeTip: 'Perfect baseball weather' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering', 'Premium service']
        },
        specialAreas: [
          { name: 'Party Deck', description: 'Left field group area', capacity: 100 },
          { name: 'Berm', description: 'Outfield grass seating', capacity: 200 }
        ]
      },
      budgetOptions: ['Berm seating', 'General admission', 'Standing room'],
      familySections: ['Family areas', 'Alcohol-free zones'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Hop Heaven Party Deck',
          capacity: '100',
          description: 'Left field craft beer area',
          amenities: ['Craft beer bar', 'Standing tables', 'Games']
        }
      ],
      tips: [
        { section: 'Behind home plate', tip: 'Best views of action', category: 'view' },
        { section: 'Third base side', tip: 'Better sun angles', category: 'shade' },
        { section: 'Party Deck', tip: 'Craft beer paradise', category: 'experience' },
        { section: 'Berm', tip: 'Family-friendly relaxed', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Hop Dog', 'Oregon craft beer flight', 'Food cart alley'],
      local: ['Portland food carts', 'Oregon wines', 'Marionberry desserts', 'Coffee'],
      healthy: ['Farm-to-table options', 'Organic choices', 'Vegan items'],
      vegetarian: ['Multiple vegetarian options', 'Portland-style'],
      glutenFree: ['Gluten-free beer and food'],
      kidsFriendly: ['Hot dogs', 'Mac and cheese', 'Ice cream'],
      alcohol: {
        beer: ['20+ Oregon craft beers on tap', 'Beer flights available'],
        wine: true,
        cocktails: true,
        localBreweries: ['Deschutes', 'Hopworks', 'Breakside', 'pFriem']
      }
    },

    parking: {
      lots: [
        { name: 'Stadium Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'MAX Park & Ride', distance: '0.3 miles', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Limited availability',
        tip: 'Use MAX light rail instead'
      },
      alternativeTransport: {
        publicTransit: ['MAX Blue Line to Orenco Station'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Extensive bike infrastructure'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch',
        tip: 'Hop-themed entrance'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Hops Team Store', exclusive: ['Hops gear', 'Diamondbacks items', 'Beer-themed merchandise'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: true, network: 'Hops_WiFi' },
      kidZones: [
        { name: 'Barley\'s Kids Zone', location: 'Right field', activities: ['Playground', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['ADA compliant throughout'],
        entrance: 'All gates accessible',
        elevators: ['To suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '15 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Craft Beer Heaven', description: 'Try the beer flights', category: 'food' },
        { title: 'MAX Light Rail', description: 'Easier than driving', category: 'arrival' },
        { title: 'Food Carts', description: 'Portland-style dining', category: 'food' },
        { title: 'Tech Crowd', description: 'Silicon Forest atmosphere', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:05 PM',
        rushHours: ['Tech worker arrival 6:30-7 PM']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Hillsboro',
      description: 'Portland suburb in Silicon Forest tech corridor',
      beforeGame: ['Orenco Station shops', 'Local breweries', 'Tech campuses'],
      afterGame: ['Orenco nightlife', 'Portland options'],
      radius: '5 miles'
    },

    transportation: {
      address: '4460 NW 229th Ave, Hillsboro, OR 97124',
      publicTransit: {
        subway: [
          { lines: ['MAX Blue Line'], station: 'Orenco Station', walkTime: '15 minutes' }
        ]
      },
      driving: {
        majorRoutes: ['US-26', 'Highway 217', 'I-5'],
        typicalTraffic: 'Heavy during tech rush hour',
        bestApproach: 'US-26 to NW 229th'
      },
      rideShare: {
        pickupZone: 'Stadium entrance',
        dropoffZone: 'Main gate',
        surgePricing: 'Moderate during events'
      }
    },

    history: {
      timeline: [
        { year: 2013, event: 'Ron Tonkin Field opens' },
        { year: 2013, event: 'Hops inaugural season' },
        { year: 2014, event: 'Northwest League championship' }
      ],
      traditions: [
        { name: 'Beer Culture', description: 'Oregon craft beer celebration' },
        { name: 'Tech Night', description: 'Silicon Forest appreciation' }
      ]
    },

    fanExperience: {
      atmosphere: 'Craft beer culture meets baseball in tech hub',
      bestExperiences: [
        'Extensive craft beer selection',
        'Portland food cart quality',
        'Family-friendly environment',
        'Tech industry connection'
      ],
      traditions: [
        'Beer Batter promotion',
        'Hop of the Game',
        'Tech company nights'
      ],
      mascot: {
        name: 'Barley',
        description: 'Hop-themed mascot celebrating beer culture'
      }
    },

    proTips: {
      insiderTips: [
        'Take MAX to avoid parking hassles',
        'Beer flights best value for trying varieties',
        'Food carts offer Portland quality',
        'Orenco Station worth exploring'
      ],
      avoidThese: [
        'Driving during tech rush hour',
        'Missing the craft beer selection',
        'First base side in afternoon'
      ],
      hiddenGems: [
        'Best craft beer selection in MiLB',
        'Tech company partnerships',
        'Sustainable stadium practices',
        'Portland food culture'
      ],
      photoSpots: [
        'With Barley mascot',
        'Hop-themed decorations',
        'Craft beer displays',
        'Oregon sunset views'
      ],
      bestValue: [
        'Berm seating for families',
        'MAX transit free parking',
        'Beer flight samplers',
        'Thursday promotions'
      ]
    }
  },

  'hudson-valley-renegades': {
    id: 'hudson-valley-renegades',
    name: 'Heritage Financial Park',
    team: 'Hudson Valley Renegades',
    opened: 1994,
    capacity: 4494,

    overview: {
      description: 'Heritage Financial Park sits in the scenic Hudson Valley, offering intimate baseball with mountain views while serving as the Yankees High-A affiliate.',
      highlights: [
        'Yankees High-A affiliate',
        'Hudson Valley location',
        'Mountain views',
        'Intimate atmosphere',
        'New York heritage'
      ],
      uniqueFeatures: [
        'Hudson Highlands backdrop',
        'Castle-themed elements',
        'Natural grass field',
        'Yankees affiliation prestige',
        'Historic Hudson Valley setting'
      ],
      renovations: [
        { year: 2012, description: 'Facility improvements' },
        { year: 2018, description: 'LED lighting installation' },
        { year: 2021, description: 'Became Yankees affiliate' }
      ],
      previousNames: ['Dutchess Stadium (1994-2021)']
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Covered areas'],
        afternoon: ['Sections 205-210', 'Premium areas'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Limited covered seating', 'Premium areas'],
      shadeTips: [
        'Hudson Valley summers moderate',
        'Mountain shadows help evening',
        'Third base side preferred',
        'Evening games comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse'],
        indoorAreas: ['Team store', 'Restaurant'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 54, avgHumidity: 65, rainChance: 35, typicalConditions: 'Cool spring', shadeTip: 'Dress warmly' },
        { month: 'May', avgTemp: 64, avgHumidity: 67, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'June', avgTemp: 73, avgHumidity: 69, rainChance: 35, typicalConditions: 'Warm and nice', shadeTip: 'Some shade helpful' },
        { month: 'July', avgTemp: 78, avgHumidity: 70, rainChance: 35, typicalConditions: 'Warm summer', shadeTip: 'Shade valuable afternoons' },
        { month: 'August', avgTemp: 76, avgHumidity: 72, rainChance: 35, typicalConditions: 'Humid late summer', shadeTip: 'Evening games ideal' },
        { month: 'September', avgTemp: 69, avgHumidity: 70, rainChance: 30, typicalConditions: 'Beautiful fall', shadeTip: 'Perfect weather' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private areas', 'Catering options']
        }
      },
      budgetOptions: ['General admission', 'Bleacher seats', 'Standing room'],
      familySections: ['Family-friendly throughout'],
      standingRoom: ['Concourse areas'],
      tips: [
        { section: 'Behind home plate', tip: 'Best views with mountain backdrop', category: 'view' },
        { section: 'Third base side', tip: 'Better shade and comfort', category: 'shade' },
        { section: 'Bleachers', tip: 'Budget-friendly close to action', category: 'value' }
      ]
    },

    concessions: {
      signature: ['Renegade Dog', 'Hudson Valley favorites', 'Local specialties'],
      local: ['New York craft beers', 'Local farms produce', 'Regional treats'],
      healthy: ['Grilled options', 'Salads', 'Fresh items'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Brooklyn Brewery', 'Hudson Valley craft beers'],
        wine: true,
        cocktails: false,
        localBreweries: ['Industrial Arts', 'Sloop Brewing', 'Newburgh Brewing']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '300 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots'
      },
      alternativeTransport: {
        publicTransit: ['Limited bus service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Behind home plate',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Team Store', exclusive: ['Renegades gear', 'Yankees items'] }
      ],
      firstAid: ['Main concourse'],
      babyChanging: ['Family restrooms'],
      atms: ['Main entrance'],
      wifi: { available: true },
      kidZones: [
        { name: 'Kids Area', location: 'Down right field line', activities: ['Playground', 'Games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Designated accessible areas'],
        entrance: 'Main gate accessible',
        elevators: ['To suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Available'],
      accessibleConcessions: ['Main stands'],
      parkingSpaces: '15 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Yankees Connection', description: 'See future Yankees stars', category: 'experience' },
        { title: 'Mountain Views', description: 'Enjoy Hudson Highlands scenery', category: 'experience' },
        { title: 'Evening Games', description: 'Best weather and atmosphere', category: 'weather' },
        { title: 'Castle Theme', description: 'Unique castle-themed promotions', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '60 minutes before first pitch',
        firstPitch: 'Usually 7:05 PM',
        rushHours: ['Game time arrival']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Wappingers Falls',
      description: 'Hudson Valley town between NYC and Albany',
      beforeGame: ['Hudson Valley restaurants', 'Historic sites', 'River views'],
      afterGame: ['Local establishments', 'Hudson Valley attractions'],
      radius: '10 miles'
    },

    transportation: {
      address: '1500 Route 9D, Wappingers Falls, NY 12590',
      publicTransit: {
        bus: [
          { routes: ['Dutchess County Transit'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-84', 'Route 9', 'Route 9D'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-84 to Route 9D North'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 1994, event: 'Dutchess Stadium opens' },
        { year: 2021, event: 'Became Yankees affiliate' },
        { year: 2021, event: 'Renamed Heritage Financial Park' }
      ],
      traditions: [
        { name: 'Yankees Pride', description: 'Newest Yankees affiliate' },
        { name: 'Hudson Valley Heritage', description: 'Regional traditions' }
      ]
    },

    fanExperience: {
      atmosphere: 'Intimate setting with Yankees prestige',
      bestExperiences: [
        'Yankees prospects on display',
        'Hudson Valley scenery',
        'Family-friendly atmosphere',
        'Castle-themed entertainment'
      ],
      traditions: [
        'Castle promotions',
        'Yankees heritage nights',
        'Hudson Valley celebrations'
      ],
      mascot: {
        name: 'Rascal',
        description: 'Raccoon mascot with mischievous personality'
      }
    },

    proTips: {
      insiderTips: [
        'Yankees affiliation brings more fans',
        'Hudson Valley scenery spectacular',
        'Evening games perfect weather',
        'Explore Hudson Valley before/after'
      ],
      avoidThese: [
        'Limited public transit options',
        'First base side in afternoon',
        'Parking fills on busy nights'
      ],
      hiddenGems: [
        'Hudson Highlands views',
        'Yankees organizational displays',
        'Historic Hudson Valley nearby',
        'Castle-themed elements'
      ],
      photoSpots: [
        'Mountain backdrop',
        'With Rascal mascot',
        'Yankees signage',
        'Hudson Valley scenery'
      ],
      bestValue: [
        'General admission flexibility',
        'Bleacher seats',
        'Free overflow parking',
        'Thursday promotions'
      ]
    }
  }
};