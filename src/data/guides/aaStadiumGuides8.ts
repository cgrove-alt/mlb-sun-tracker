import { StadiumGuide } from '../stadiumGuides';

export const aaStadiumGuides8: Record<string, StadiumGuide> = {
  'mississippi-braves': {
    id: 'mississippi-braves',
    name: 'Trustmark Park',
    team: 'Mississippi Braves',
    opened: 2005,
    capacity: 7422,

    overview: {
      description: 'Trustmark Park in Pearl serves as home to the Braves Double-A affiliate, featuring Southern hospitality and a family-friendly atmosphere in the Jackson metro area.',
      highlights: [
        'Braves Double-A affiliate',
        'Pearl, Mississippi location',
        'Opened in 2005',
        'Jackson metro area',
        'Southern baseball tradition'
      ],
      uniqueFeatures: [
        'Mississippi-themed elements',
        'Natural grass field',
        'Southern architecture',
        'Family entertainment focus',
        'Braves organizational displays'
      ],
      renovations: [
        { year: 2014, description: 'LED lighting installation' },
        { year: 2019, description: 'Concourse improvements' },
        { year: 2022, description: 'Premium seating upgrades' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-218', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Mississippi summers extremely hot and humid',
        'Limited natural shade',
        'Third base side preferred',
        'Evening games essential June-August'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper areas'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield berm'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 70, avgHumidity: 68, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 78, avgHumidity: 70, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade becoming valuable' },
        { month: 'June', avgTemp: 85, avgHumidity: 72, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'July', avgTemp: 89, avgHumidity: 74, rainChance: 40, typicalConditions: 'Very hot and humid', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 89, avgHumidity: 73, rainChance: 40, typicalConditions: 'Peak heat', shadeTip: 'Maximum shade essential' },
        { month: 'September', avgTemp: 82, avgHumidity: 71, rainChance: 35, typicalConditions: 'Still hot', shadeTip: 'More bearable evenings' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Trustmark Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Behind home plate premium level'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Berm', description: 'Outfield grass seating', capacity: 500 }
        ]
      },
      budgetOptions: ['Berm seating', 'Upper reserved', 'General admission'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Party Pavilion',
          capacity: '200',
          description: 'Left field group area',
          amenities: ['Covered area', 'Tables', 'Group seating']
        }
      ],
      tips: [
        { section: 'Trustmark Club', tip: 'A/C relief from humidity', category: 'experience' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Berm', tip: 'Family-friendly atmosphere', category: 'value' },
        { section: 'Behind home plate', tip: 'Best overall views', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Mississippi BBQ', 'Catfish po\'boy', 'Southern fried chicken'],
      local: ['Mississippi BBQ', 'Catfish', 'Southern specialties', 'Sweet tea'],
      healthy: ['Grilled options', 'Salads'],
      vegetarian: ['Veggie burgers', 'Pizza'],
      glutenFree: ['Limited options'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Lazy Magnolia', 'Southern Prohibition', 'Domestic beers'],
        wine: true,
        cocktails: false,
        localBreweries: ['Lazy Magnolia', 'Southern Prohibition', 'Lucky Town']
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
        tip: 'Plenty of lot parking'
      },
      alternativeTransport: {
        publicTransit: ['Limited JATRAN service'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch'
      },
      {
        name: 'Left Field Gate',
        location: 'Outfield entrance',
        bestFor: ['Berm', 'Pavilion'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'M-Braves Team Store', exclusive: ['M-Braves gear', 'Braves items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true, network: 'Trustmark_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Fun Zone', location: 'Right field', activities: ['Playground', 'Bounce house', 'Speed pitch'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['To suite level']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '30 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Braves Pipeline', description: 'See future Atlanta stars', category: 'experience' },
        { title: 'Mississippi Heat', description: 'Evening games essential', category: 'weather' },
        { title: 'Southern BBQ', description: 'Try authentic Mississippi style', category: 'food' },
        { title: 'Family Focus', description: 'Great kids entertainment', category: 'experience' }
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
      name: 'Pearl',
      description: 'Jackson suburb with shopping and dining',
      beforeGame: ['Outlets of Mississippi', 'Local restaurants'],
      afterGame: ['Limited nightlife', 'Jackson entertainment'],
      radius: '5 miles'
    },

    transportation: {
      address: '1 Braves Way, Pearl, MS 39208',
      publicTransit: {
        bus: [
          { routes: ['JATRAN'], stops: ['Limited service'] }
        ]
      },
      driving: {
        majorRoutes: ['I-20', 'US-80', 'Highway 468'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-20 to Highway 468'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2005, event: 'Trustmark Park opens' },
        { year: 2005, event: 'Mississippi Braves begin play' },
        { year: 2016, event: 'Southern League championship' }
      ],
      traditions: [
        { name: 'Braves Heritage', description: 'Strong Atlanta connection' },
        { name: 'Mississippi Pride', description: 'State baseball tradition' }
      ]
    },

    fanExperience: {
      atmosphere: 'Southern hospitality meets Braves tradition',
      bestExperiences: [
        'Braves organizational depth',
        'Mississippi hospitality',
        'Family-friendly atmosphere',
        'Southern BBQ'
      ],
      traditions: [
        'Tomahawk chop',
        'Friday Fireworks',
        'Thirsty Thursday'
      ],
      mascot: {
        name: 'Kazoo',
        description: 'Baseball-themed mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Braves prospects worth watching',
        'Try Mississippi catfish',
        'Evening games avoid heat',
        'Outlets of Mississippi nearby'
      ],
      avoidThese: [
        'Day games in summer',
        'First base side in afternoon',
        'Underestimating Mississippi humidity'
      ],
      hiddenGems: [
        'Braves development system',
        'Southern hospitality genuine',
        'Jackson attractions nearby',
        'Mississippi food culture'
      ],
      photoSpots: [
        'With Kazoo mascot',
        'Braves signage',
        'Mississippi themed areas',
        'Team photo opportunities'
      ],
      bestValue: [
        'Berm seating for families',
        'Thirsty Thursday deals',
        'General admission',
        'Group packages'
      ]
    }
  },

  'northwest-arkansas-naturals': {
    id: 'northwest-arkansas-naturals',
    name: 'Arvest Ballpark',
    team: 'Northwest Arkansas Naturals',
    opened: 2008,
    capacity: 6500,

    overview: {
      description: 'Arvest Ballpark in Springdale serves as home to the Royals Double-A affiliate, nestled in the Ozark Mountains with modern amenities and Arkansas charm.',
      highlights: [
        'Royals Double-A affiliate',
        'Northwest Arkansas location',
        'Opened in 2008',
        'Ozark Mountain region',
        'Walmart country proximity'
      ],
      uniqueFeatures: [
        'Ozark Mountain views',
        'Natural setting',
        'Modern design',
        'Natural grass field',
        'Arkansas culture displays'
      ],
      renovations: [
        { year: 2017, description: 'LED lighting installation' },
        { year: 2020, description: 'Concourse improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club seats'],
        afternoon: ['Sections 200-210', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level'],
      shadeTips: [
        'Arkansas summers hot and humid',
        'Mountain location provides some relief',
        'Third base side preferred',
        'Evening games more comfortable'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper areas'],
        indoorAreas: ['Club areas', 'Team store'],
        sunscreenStations: ['Guest services']
      },
      worstSunExposure: ['First base bleachers', 'Outfield lawn'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 62, avgHumidity: 65, rainChance: 40, typicalConditions: 'Variable spring', shadeTip: 'Comfortable most days' },
        { month: 'May', avgTemp: 71, avgHumidity: 68, rainChance: 45, typicalConditions: 'Pleasant', shadeTip: 'Nice baseball weather' },
        { month: 'June', avgTemp: 79, avgHumidity: 69, rainChance: 35, typicalConditions: 'Warm and humid', shadeTip: 'Shade becoming valuable' },
        { month: 'July', avgTemp: 84, avgHumidity: 68, rainChance: 30, typicalConditions: 'Hot summer', shadeTip: 'Evening games ideal' },
        { month: 'August', avgTemp: 83, avgHumidity: 67, rainChance: 30, typicalConditions: 'Continued heat', shadeTip: 'Shade important' },
        { month: 'September', avgTemp: 75, avgHumidity: 68, rainChance: 35, typicalConditions: 'Cooling down', shadeTip: 'Pleasant evenings' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Arvest Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats'],
            access: 'Behind home plate club level'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control']
        },
        specialAreas: [
          { name: 'Lawn', description: 'Outfield grass seating', capacity: 1000 }
        ]
      },
      budgetOptions: ['Lawn seating', 'Upper reserved', 'General admission'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Concourse areas', 'Party deck'],
      partyAreas: [
        {
          name: 'Party Deck',
          capacity: '150',
          description: 'Left field group area',
          amenities: ['Bar service', 'Tables', 'Ozark views']
        }
      ],
      tips: [
        { section: 'Arvest Club', tip: 'All-inclusive comfort', category: 'experience' },
        { section: 'Lawn', tip: 'Great family atmosphere', category: 'value' },
        { section: 'Third base side', tip: 'Better shade coverage', category: 'shade' },
        { section: 'Behind home plate', tip: 'Best overall views', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Natural Dog', 'Arkansas BBQ', 'Ozark specialties'],
      local: ['Arkansas BBQ', 'Local produce', 'Regional treats', 'Sweet tea'],
      healthy: ['Grilled options', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream'],
      alcohol: {
        beer: ['Ozark Beer', 'Core Brewing', 'Domestic options'],
        wine: true,
        cocktails: false,
        localBreweries: ['Ozark Beer', 'Core Brewing', 'Black Apple']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$5', shadedSpots: false, covered: false },
        { name: 'Overflow', distance: '400 yards', price: 'Free', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Plenty of lot parking'
      },
      alternativeTransport: {
        publicTransit: ['Ozark Regional Transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Razorback Greenway access'
      }
    },

    gates: [
      {
        name: 'Home Plate Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '60 minutes before first pitch'
      },
      {
        name: 'Left Field Gate',
        location: 'Outfield entrance',
        bestFor: ['Lawn', 'Party deck'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Naturals Team Store', exclusive: ['Naturals gear', 'Royals items'] }
      ],
      firstAid: ['Behind home plate'],
      babyChanging: ['Family restrooms'],
      atms: ['Main concourse'],
      wifi: { available: true, network: 'Arvest_WiFi' },
      chargingStations: ['Club areas'],
      kidZones: [
        { name: 'Kids Zone', location: 'Right field', activities: ['Playground', 'Speed pitch'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['To all levels']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '25 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Ozark Beauty', description: 'Mountain scenery surrounds', category: 'experience' },
        { title: 'Walmart Country', description: 'Corporate crowds common', category: 'experience' },
        { title: 'Arkansas BBQ', description: 'Try local style', category: 'food' },
        { title: 'Greenway Trail', description: 'Bike to the game', category: 'arrival' }
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
      name: 'Springdale',
      description: 'Northwest Arkansas city in growing metro area',
      beforeGame: ['Downtown Springdale', 'Local restaurants'],
      afterGame: ['Fayetteville nightlife', 'Bentonville options'],
      radius: '10 miles'
    },

    transportation: {
      address: '3000 S 56th St, Springdale, AR 72762',
      publicTransit: {
        bus: [
          { routes: ['ORT routes'], stops: ['Stadium stop'] }
        ]
      },
      driving: {
        majorRoutes: ['I-49', 'US-412', 'Highway 112'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-49 to Don Tyson Parkway'
      },
      rideShare: {
        pickupZone: 'Main lot',
        dropoffZone: 'Main gate',
        surgePricing: 'Minimal'
      }
    },

    history: {
      timeline: [
        { year: 2008, event: 'Arvest Ballpark opens' },
        { year: 2008, event: 'Naturals begin play' },
        { year: 2018, event: 'Texas League championship' }
      ],
      traditions: [
        { name: 'Natural State', description: 'Arkansas nature celebration' },
        { name: 'Royals Development', description: 'KC pipeline' }
      ]
    },

    fanExperience: {
      atmosphere: 'Ozark hospitality meets modern baseball',
      bestExperiences: [
        'Ozark Mountain setting',
        'Modern amenities',
        'Arkansas hospitality',
        'Family atmosphere'
      ],
      traditions: [
        'Strike Out Stroke',
        'Fireworks Fridays',
        'Thirsty Thursday'
      ],
      mascot: {
        name: 'Strike',
        description: 'Sasquatch mascot representing Ozark legend'
      }
    },

    proTips: {
      insiderTips: [
        'Razorback Greenway bike trail access',
        'Northwest Arkansas booming area',
        'Try local Ozark Beer',
        'Crystal Bridges Museum nearby'
      ],
      avoidThese: [
        'Summer afternoon games',
        'Missing the lawn experience',
        'First base side in sun'
      ],
      hiddenGems: [
        'Ozark Mountain beauty',
        'Growing NWA region',
        'Bike-friendly area',
        'Walmart Museum nearby'
      ],
      photoSpots: [
        'Ozark Mountain backdrop',
        'With Strike mascot',
        'Natural State signage',
        'Sunset views'
      ],
      bestValue: [
        'Lawn seating families',
        'Thirsty Thursday',
        'General admission',
        'Group packages'
      ]
    }
  },

  'pensacola-blue-wahoos': {
    id: 'pensacola-blue-wahoos',
    name: 'Blue Wahoos Stadium',
    team: 'Pensacola Blue Wahoos',
    opened: 2012,
    capacity: 5038,

    overview: {
      description: 'Blue Wahoos Stadium sits on Pensacola Bay waterfront, serving as home to the Marlins Double-A affiliate with stunning water views and Gulf Coast atmosphere.',
      highlights: [
        'Marlins Double-A affiliate',
        'Pensacola Bay waterfront',
        'Opened in 2012',
        'Water views from all seats',
        'Downtown location'
      ],
      uniqueFeatures: [
        'Pensacola Bay views',
        'Maritime Park location',
        'Waterfront setting',
        'Natural grass field',
        'Naval aviation heritage'
      ],
      renovations: [
        { year: 2018, description: 'LED lighting upgrade' },
        { year: 2021, description: 'Premium seating improvements' }
      ]
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-218', 'Suites'],
        evening: ['Most sections after 5 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Gulf Coast sun intense',
        'Bay breeze provides relief',
        'Third base side preferred',
        'Evening games essential summer'
      ],
      sunProtection: {
        shadedConcourses: ['Main concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Right field'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 72, avgHumidity: 70, rainChance: 25, typicalConditions: 'Pleasant coastal', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 78, avgHumidity: 72, rainChance: 25, typicalConditions: 'Warming up', shadeTip: 'Shade becoming helpful' },
        { month: 'June', avgTemp: 85, avgHumidity: 74, rainChance: 40, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'July', avgTemp: 88, avgHumidity: 75, rainChance: 50, typicalConditions: 'Peak heat and storms', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 88, avgHumidity: 75, rainChance: 50, typicalConditions: 'Continued heat', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 83, avgHumidity: 73, rainChance: 40, typicalConditions: 'Still hot', shadeTip: 'Bay breeze helps' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Hancock Whitney Club',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Bay views', 'Padded seats'],
            access: 'Premium level with best views'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'Bay views']
        },
        specialAreas: [
          { name: 'Bay Deck', description: 'Right field standing area', capacity: 200 }
        ]
      },
      budgetOptions: ['General admission', 'Upper reserved', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['Bay Deck', 'Concourse areas'],
      partyAreas: [
        {
          name: 'Bay Deck',
          capacity: '200',
          description: 'Right field bay views',
          amenities: ['Full bar', 'Standing tables', 'Water views']
        }
      ],
      tips: [
        { section: 'Club level', tip: 'A/C and best bay views', category: 'experience' },
        { section: 'Third base side', tip: 'Better afternoon shade', category: 'shade' },
        { section: 'Bay Deck', tip: 'Social atmosphere with views', category: 'experience' },
        { section: 'Behind home plate', tip: 'Perfect water views', category: 'view' }
      ]
    },

    concessions: {
      signature: ['Wahoos Fish Tacos', 'Gulf seafood', 'Bushwacker drink', 'Grouper sandwich'],
      local: ['Gulf Coast seafood', 'Southern BBQ', 'Key lime pie', 'Bushwackers'],
      healthy: ['Grilled fish', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie tacos', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Snow cones'],
      alcohol: {
        beer: ['Pensacola Bay Brewery', 'Gulf Coast beers', 'Craft selection'],
        wine: true,
        cocktails: true,
        localBreweries: ['Pensacola Bay', 'Gulf Coast', 'Props Brewery']
      }
    },

    parking: {
      lots: [
        { name: 'Maritime Lot', distance: '200 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Downtown Lots', distance: '0.5 miles', price: '$5-10', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: true,
        restrictions: 'Metered downtown',
        tip: 'Free after 6 PM some areas'
      },
      alternativeTransport: {
        publicTransit: ['ECAT buses'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Main Gate',
        location: 'Main Street entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch',
        tip: 'Waterfront entrance'
      },
      {
        name: 'Bay Gate',
        location: 'Right field',
        bestFor: ['Bay Deck', 'Right field'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Wahoos Team Store', exclusive: ['Blue Wahoos gear', 'Marlins items', 'Naval aviation items'] }
      ],
      firstAid: ['Behind home plate', 'Upper level'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Guest services'],
      atms: ['Multiple locations'],
      wifi: { available: true, network: 'Wahoos_WiFi' },
      chargingStations: ['Club areas', 'Concourse'],
      kidZones: [
        { name: 'Splash Pad', location: 'Left field', activities: ['Water play area', 'Playground'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['All levels accessible'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout facility'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '30 ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Bay Views', description: 'Best waterfront views in MiLB', category: 'experience' },
        { title: 'Naval Aviation', description: 'Blue Angels flyovers possible', category: 'experience' },
        { title: 'Gulf Seafood', description: 'Fresh local catches', category: 'food' },
        { title: 'Beach Proximity', description: 'Combine with beach trip', category: 'experience' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Select games',
        firstPitch: 'Varies by day',
        rushHours: ['45 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Downtown Pensacola',
      description: 'Historic waterfront district with restaurants and entertainment',
      beforeGame: ['Palafox Street', 'Historic district', 'Waterfront restaurants'],
      afterGame: ['Downtown bars', 'Palafox nightlife'],
      radius: '0.5 miles'
    },

    transportation: {
      address: '351 W Cedar St, Pensacola, FL 32502',
      publicTransit: {
        bus: [
          { routes: ['ECAT routes'], stops: ['Downtown stops'] }
        ]
      },
      driving: {
        majorRoutes: ['I-10', 'I-110', 'US-98'],
        typicalTraffic: 'Light to moderate',
        bestApproach: 'I-110 to downtown'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2012, event: 'Blue Wahoos Stadium opens' },
        { year: 2012, event: 'Team begins play' },
        { year: 2017, event: 'Southern League championship' }
      ],
      traditions: [
        { name: 'Naval Aviation', description: 'Blue Angels heritage' },
        { name: 'Gulf Coast Pride', description: 'Waterfront culture' }
      ]
    },

    fanExperience: {
      atmosphere: 'Waterfront baseball paradise with Gulf Coast vibe',
      bestExperiences: [
        'Pensacola Bay views',
        'Downtown waterfront location',
        'Gulf seafood options',
        'Naval aviation connection'
      ],
      traditions: [
        'Blue Angels appearances',
        'Fireworks over the bay',
        'Mullet Toss'
      ],
      mascot: {
        name: 'Kazoo',
        description: 'Blue Wahoo fish mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Best ballpark views in Double-A',
        'Downtown Pensacola walkable',
        'Try Bushwacker drink',
        'Beach just minutes away'
      ],
      avoidThese: [
        'Day games in summer',
        'Limited parking downtown',
        'First base side afternoon sun'
      ],
      hiddenGems: [
        'Naval Aviation Museum nearby',
        'Historic Pensacola district',
        'Pensacola Beach proximity',
        'Waterfront dining'
      ],
      photoSpots: [
        'Bay views from stands',
        'Waterfront entrance',
        'With Kazoo mascot',
        'Sunset over water'
      ],
      bestValue: [
        'Bay Deck standing room',
        'Upper reserved seats',
        'Thursday specials',
        'Group packages'
      ]
    }
  },

  'rocket-city-trash-pandas': {
    id: 'rocket-city-trash-pandas',
    name: 'Toyota Field',
    team: 'Rocket City Trash Pandas',
    opened: 2021,
    capacity: 7500,

    overview: {
      description: 'Toyota Field in Madison is one of the newest parks in professional baseball, serving as home to the Angels Double-A affiliate with space-themed entertainment and modern amenities.',
      highlights: [
        'Angels Double-A affiliate',
        'Opened in 2021',
        'Space City USA location',
        'Brand new facility',
        'Huntsville area'
      ],
      uniqueFeatures: [
        'Space-themed elements',
        'Trash Panda branding',
        'State-of-the-art design',
        'Synthetic turf field',
        '360-degree concourse'
      ],
      renovations: []
    },

    shadeGuide: {
      bestShadedSections: {
        morning: ['Third base side', 'Club level'],
        afternoon: ['Sections 210-220', 'Suites'],
        evening: ['Most sections after 6 PM']
      },
      coveredSeating: ['Club level', 'Suite level', 'Premium areas'],
      shadeTips: [
        'Alabama summers very hot',
        'Modern design includes shade features',
        'Third base side preferred',
        'Evening games recommended'
      ],
      sunProtection: {
        shadedConcourses: ['360-degree concourse', 'Upper levels'],
        indoorAreas: ['Club areas', 'Team store', 'Restaurant'],
        sunscreenStations: ['Guest services', 'First aid']
      },
      worstSunExposure: ['First base field level', 'Outfield areas'],
      monthlyPatterns: [
        { month: 'April', avgTemp: 67, avgHumidity: 65, rainChance: 35, typicalConditions: 'Pleasant spring', shadeTip: 'Comfortable conditions' },
        { month: 'May', avgTemp: 75, avgHumidity: 68, rainChance: 35, typicalConditions: 'Warming up', shadeTip: 'Shade helpful' },
        { month: 'June', avgTemp: 83, avgHumidity: 69, rainChance: 35, typicalConditions: 'Hot and humid', shadeTip: 'Covered seating ideal' },
        { month: 'July', avgTemp: 87, avgHumidity: 71, rainChance: 40, typicalConditions: 'Very hot', shadeTip: 'Evening games only' },
        { month: 'August', avgTemp: 86, avgHumidity: 70, rainChance: 35, typicalConditions: 'Peak heat', shadeTip: 'Maximum shade needed' },
        { month: 'September', avgTemp: 79, avgHumidity: 68, rainChance: 30, typicalConditions: 'Cooling down', shadeTip: 'More comfortable' }
      ]
    },

    seatingGuide: {
      premiumSeating: {
        clubs: [
          {
            name: 'Toyota Terrace',
            perks: ['Climate controlled', 'All-inclusive food/drinks', 'Padded seats', 'Private bar'],
            access: 'Premium level behind home plate'
          }
        ],
        suites: {
          levels: ['Suite level'],
          amenities: ['Private restrooms', 'Catering', 'Climate control', 'HDTVs']
        },
        specialAreas: [
          { name: 'Moon Deck', description: 'Left field party area', capacity: 250 }
        ]
      },
      budgetOptions: ['General admission', 'Lawn seating', 'Standing room'],
      familySections: ['Family Zone', 'Alcohol-free sections'],
      standingRoom: ['360 concourse', 'Moon Deck'],
      partyAreas: [
        {
          name: 'Moon Deck',
          capacity: '250',
          description: 'Space-themed party area',
          amenities: ['Full bar', 'Games', 'Moon-themed decor']
        }
      ],
      tips: [
        { section: 'Toyota Terrace', tip: 'All-inclusive with A/C', category: 'experience' },
        { section: '360 concourse', tip: 'Walk around for views', category: 'experience' },
        { section: 'Third base upper', tip: 'Best shade value', category: 'shade' },
        { section: 'Moon Deck', tip: 'Unique party atmosphere', category: 'experience' }
      ]
    },

    concessions: {
      signature: ['Space Burger', 'Trash Panda Nachos', 'Rocket Fuel BBQ', 'Moon Pies'],
      local: ['Alabama BBQ', 'Southern specialties', 'Moon Pies', 'Sweet tea'],
      healthy: ['Grilled options', 'Salads', 'Fresh fruit'],
      vegetarian: ['Veggie burgers', 'Pizza', 'Salads'],
      glutenFree: ['Available at select stands'],
      kidsFriendly: ['Hot dogs', 'Chicken tenders', 'Ice cream', 'Cotton candy'],
      alcohol: {
        beer: ['Straight to Ale', 'Yellowhammer', 'Alabama craft beers'],
        wine: true,
        cocktails: true,
        localBreweries: ['Straight to Ale', 'Yellowhammer', 'Rocket Republic']
      }
    },

    parking: {
      lots: [
        { name: 'Main Lot', distance: '100 yards', price: '$10', shadedSpots: false, covered: false },
        { name: 'Overflow Lots', distance: '300-500 yards', price: '$5', shadedSpots: false, covered: false }
      ],
      streetParking: {
        available: false,
        restrictions: 'No street parking',
        tip: 'Use stadium lots only'
      },
      alternativeTransport: {
        publicTransit: ['Limited Madison transit'],
        rideShare: 'Uber and Lyft available',
        bicycle: 'Bike racks available'
      }
    },

    gates: [
      {
        name: 'Rocket Gate',
        location: 'Main entrance',
        bestFor: ['All seating'],
        openTime: '90 minutes before first pitch',
        tip: 'Space-themed entrance'
      },
      {
        name: 'Moon Gate',
        location: 'Left field',
        bestFor: ['Moon Deck', 'Outfield'],
        openTime: '60 minutes before first pitch'
      }
    ],

    amenities: {
      merchandise: [
        { location: 'Trash Pandas Team Store', exclusive: ['Trash Pandas gear', 'Angels items', 'Space merchandise'] }
      ],
      firstAid: ['Multiple locations'],
      babyChanging: ['All family restrooms'],
      nursingRooms: ['Available'],
      atms: ['Throughout'],
      wifi: { available: true, network: 'TrashPandas_WiFi' },
      chargingStations: ['Throughout facility'],
      kidZones: [
        { name: 'Space Zone', location: 'Right field', activities: ['Space-themed playground', 'Interactive games'] }
      ]
    },

    accessibility: {
      wheelchairAccess: {
        available: true,
        sections: ['Full ADA compliance'],
        entrance: 'All gates ADA compliant',
        elevators: ['Multiple elevators']
      },
      assistiveListening: true,
      signageAndBraille: true,
      serviceAnimals: true,
      companionSeats: true,
      accessibleRestrooms: ['Throughout facility'],
      accessibleConcessions: ['All locations'],
      parkingSpaces: '40+ ADA spaces'
    },

    gameDay: {
      tips: [
        { title: 'Space Theme', description: 'NASA connection throughout', category: 'experience' },
        { title: 'Brand New', description: 'Newest park in Double-A', category: 'experience' },
        { title: 'Trash Panda Fun', description: 'Unique mascot and theme', category: 'experience' },
        { title: 'Alabama Heat', description: 'Evening games ideal', category: 'weather' }
      ],
      typicalSchedule: {
        gatesOpen: '90 minutes before first pitch',
        battingPractice: 'Select games',
        firstPitch: 'Varies by day',
        rushHours: ['45 minutes before game']
      },
      security: {
        allowedBags: 'Small bags allowed',
        prohibitedItems: ['Outside food/drink', 'Weapons'],
        metalDetectors: true
      }
    },

    neighborhood: {
      name: 'Madison',
      description: 'Huntsville suburb near Space Center',
      beforeGame: ['Research Park', 'Local restaurants'],
      afterGame: ['Madison dining', 'Huntsville entertainment'],
      radius: '10 miles'
    },

    transportation: {
      address: '1 Trash Panda Way, Madison, AL 35758',
      publicTransit: {
        bus: [
          { routes: ['Limited service'], stops: ['Few options'] }
        ]
      },
      driving: {
        majorRoutes: ['I-565', 'US-72', 'Highway 20'],
        typicalTraffic: 'Moderate during rush hour',
        bestApproach: 'I-565 to Exit 8'
      },
      rideShare: {
        pickupZone: 'Designated area',
        dropoffZone: 'Main gate',
        surgePricing: 'Higher on weekends'
      }
    },

    history: {
      timeline: [
        { year: 2021, event: 'Toyota Field opens' },
        { year: 2021, event: 'Trash Pandas begin play' },
        { year: 2020, event: 'Viral rebrand success' }
      ],
      traditions: [
        { name: 'Space City', description: 'NASA and space exploration' },
        { name: 'Trash Panda Nation', description: 'Viral brand identity' }
      ]
    },

    fanExperience: {
      atmosphere: 'Space-themed fun with modern amenities',
      bestExperiences: [
        'Brand new facility',
        'Unique Trash Panda brand',
        'Space-themed entertainment',
        'Modern amenities throughout'
      ],
      traditions: [
        'Launch sequences',
        'Space-themed promotions',
        'Trash Panda antics'
      ],
      mascot: {
        name: 'Sprocket',
        description: 'Trash Panda (raccoon) mascot'
      }
    },

    proTips: {
      insiderTips: [
        'Newest park worth experiencing',
        'Space Center nearby worth visit',
        'Trash Panda merchandise popular',
        'Research Park tech crowd'
      ],
      avoidThese: [
        'Summer day games',
        'Limited public transit',
        'First base afternoon sun'
      ],
      hiddenGems: [
        'U.S. Space & Rocket Center',
        'Huntsville tech scene',
        'Brand new everything',
        'Viral brand success story'
      ],
      photoSpots: [
        'Space-themed entrance',
        'With Sprocket mascot',
        'Moon Deck views',
        'Modern architecture'
      ],
      bestValue: [
        'General admission flexibility',
        'Moon Deck experience',
        'Group packages',
        'Thursday deals'
      ]
    }
  }
};